import crypto from 'crypto';
import express from 'express';
import type {NextFunction, Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {SEED_OPPORTUNITIES} from './src/data/seedOpportunities.ts';
import type {Opportunity} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'store.json');
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

interface AdminCredential {
  salt: string;
  hash: string;
  claimedAt: string;
}

interface StoreShape {
  opportunities: Opportunity[];
  adminCredential: AdminCredential | null;
}

interface TokenPayload {
  role: 'admin';
  exp: number;
}

// Simple in-memory rate limit tracker for admin auth attempts
const authAttempts = new Map<string, {count: number; resetAt: number}>();

function checkAuthRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = authAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    authAttempts.set(ip, {count: 1, resetAt: now + 15 * 60 * 1000});
    return true;
  }
  if (entry.count >= 15) {
    return false;
  }
  entry.count += 1;
  return true;
}

function readStore(): StoreShape {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: StoreShape = {
      opportunities: SEED_OPPORTUNITIES,
      adminCredential: null,
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return {
      opportunities:
        Array.isArray(parsed.opportunities) && parsed.opportunities.length > 0
          ? parsed.opportunities
          : SEED_OPPORTUNITIES,
      adminCredential:
        parsed.adminCredential &&
        typeof parsed.adminCredential.salt === 'string' &&
        typeof parsed.adminCredential.hash === 'string'
          ? parsed.adminCredential
          : null,
    };
  } catch {
    return {
      opportunities: SEED_OPPORTUNITIES,
      adminCredential: null,
    };
  }
}

function writeStore(store: StoreShape): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function hashPassword(password: string, saltHex: string): string {
  return crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), 64).toString('hex');
}

function safeCompareStrings(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

function getEnvPasscode(): string {
  return (process.env.ADMIN_PASSCODE || '').trim();
}

function signAdminToken(): string {
  const payload: TokenPayload = {
    role: 'admin',
    exp: Date.now() + SESSION_TTL_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  if (!encoded || !sig) return false;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encoded)
    .digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as TokenPayload;
    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function extractBearerToken(req: Request): string {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return '';
  return header.slice(7).trim();
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token || !verifyAdminToken(token)) {
    res.status(401).json({error: 'Admin authentication required.'});
    return;
  }
  next();
}

function sanitizeHttpUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return 'https://careers.un.org';
  }
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return 'https://careers.un.org';
  } catch {
    return 'https://careers.un.org';
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({limit: '2mb'}));

  app.get('/api/admin/status', (req, res) => {
    const envPasscode = getEnvPasscode();
    const store = readStore();
    const token = extractBearerToken(req);
    const authenticated = token ? verifyAdminToken(token) : false;
    const needsSetup = !envPasscode && !store.adminCredential;
    res.json({
      authenticated,
      needsSetup,
      envConfigured: Boolean(envPasscode),
    });
  });

  app.post('/api/admin/setup', (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkAuthRateLimit(clientIp)) {
      res.status(429).json({error: 'Too many attempts. Please try again later.'});
      return;
    }
    const envPasscode = getEnvPasscode();
    const store = readStore();
    if (envPasscode || store.adminCredential) {
      res.status(403).json({error: 'Admin access has already been configured.'});
      return;
    }

    const body = req.body as {password?: unknown};
    const password = typeof body.password === 'string' ? body.password.trim() : '';
    if (password.length < 8) {
      res.status(400).json({error: 'Password must be at least 8 characters.'});
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(password, salt);
    store.adminCredential = {
      salt,
      hash,
      claimedAt: new Date().toISOString(),
    };
    writeStore(store);

    const token = signAdminToken();
    res.status(201).json({token});
  });

  app.post('/api/admin/login', (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (!checkAuthRateLimit(clientIp)) {
      res.status(429).json({error: 'Too many login attempts. Please wait 15 minutes.'});
      return;
    }
    const body = req.body as {password?: unknown};
    const password = typeof body.password === 'string' ? body.password.trim() : '';
    if (!password) {
      res.status(400).json({error: 'Password is required.'});
      return;
    }

    const envPasscode = getEnvPasscode();
    if (envPasscode) {
      if (!safeCompareStrings(password, envPasscode)) {
        res.status(401).json({error: 'Invalid admin password.'});
        return;
      }
      res.json({token: signAdminToken()});
      return;
    }

    const store = readStore();
    if (!store.adminCredential) {
      res.status(409).json({error: 'Admin password has not been claimed yet.'});
      return;
    }

    const candidateHash = hashPassword(password, store.adminCredential.salt);
    const storedBuf = Buffer.from(store.adminCredential.hash, 'hex');
    const candidateBuf = Buffer.from(candidateHash, 'hex');
    if (storedBuf.length !== candidateBuf.length || !crypto.timingSafeEqual(storedBuf, candidateBuf)) {
      res.status(401).json({error: 'Invalid admin password.'});
      return;
    }

    res.json({token: signAdminToken()});
  });

  app.get('/api/opportunities', (_req, res) => {
    const store = readStore();
    res.json({opportunities: store.opportunities});
  });

  app.post('/api/opportunities', requireAdmin, (req, res) => {
    const body = req.body as Partial<Opportunity>;
    if (!body.title || !body.agency || !body.category || !body.dutyStation || !body.deadline) {
      res.status(400).json({error: 'Missing required announcement fields.'});
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      category: body.category === 'education' ? 'education' : 'job',
      agency: body.agency,
      title: String(body.title).trim(),
      titleAm: String(body.titleAm || body.title).trim(),
      dutyStation: String(body.dutyStation).trim(),
      gradeOrLevel: String(body.gradeOrLevel || (body.category === 'education' ? 'Scholarship' : 'P-2')).trim(),
      contractOrFunding: String(body.contractOrFunding || (body.category === 'education' ? 'Full Funding' : 'Fixed-Term')).trim(),
      deadline: String(body.deadline).trim(),
      postedAt: new Date().toISOString().slice(0, 10),
      referenceCode: String(
        body.referenceCode || `${body.agency}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`,
      ).trim(),
      officialUrl: sanitizeHttpUrl(body.officialUrl),
      summary: String(body.summary || '').trim(),
      summaryAm: String(body.summaryAm || body.summary || '').trim(),
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities.map((s) => String(s).trim()).filter(Boolean)
        : [],
      qualifications: Array.isArray(body.qualifications)
        ? body.qualifications.map((s) => String(s).trim()).filter(Boolean)
        : [],
      competencies:
        Array.isArray(body.competencies) && body.competencies.length > 0
          ? body.competencies.map((s) => String(s).trim()).filter(Boolean)
          : ['Integrity', 'Professionalism', 'Respect for Diversity'],
    };

    const store = readStore();
    store.opportunities = [newOpp, ...store.opportunities];
    writeStore(store);
    res.status(201).json({opportunity: newOpp});
  });

  app.delete('/api/opportunities/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const next = store.opportunities.filter((item) => item.id !== req.params.id);
    if (next.length === store.opportunities.length) {
      res.status(404).json({error: 'Announcement not found.'});
      return;
    }
    store.opportunities = next;
    writeStore(store);
    res.json({ok: true});
  });

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UN Bridge server running at http://localhost:${PORT}`);
  });
}

startServer();
