import {useEffect, useState} from 'react';
import {Lock, X} from 'lucide-react';
import {UI_TEXT} from '../i18n';
import type {Language} from '../types';

interface AdminModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onAuthenticated: (token: string) => void;
}

export function AdminModal({isOpen, lang, onClose, onAuthenticated}: AdminModalProps) {
  const t = UI_TEXT[lang];
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setError('');
    setPassword('');
    setConfirmPassword('');
    setLoadingStatus(true);

    fetch('/api/admin/status')
      .then((res) => res.json())
      .then((data: {needsSetup?: boolean}) => {
        if (!cancelled) {
          setNeedsSetup(Boolean(data.needsSetup));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNeedsSetup(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingStatus(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (needsSetup) {
      if (password.trim().length < 8) {
        setError(
          lang === 'am'
            ? 'የይለፍ ቃሉ ቢያንስ 8 ፊደላት ወይም ቁጥሮች መሆን አለበት።'
            : 'Password must be at least 8 characters.',
        );
        return;
      }
      if (password !== confirmPassword) {
        setError(
          lang === 'am'
            ? 'ሁለቱ የይለፍ ቃሎች አልተመሳሰሉም።'
            : 'Passwords do not match.',
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const endpoint = needsSetup ? '/api/admin/setup' : '/api/admin/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({password}),
      });
      const data = (await res.json()) as {token?: string; error?: string};
      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Authentication failed.');
      }
      onAuthenticated(data.token);
      setPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-[#005A9C] shrink-0">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 id="admin-modal-title" className="font-editorial text-lg font-semibold text-slate-900">
                {needsSetup ? t.adminSetupTitle : t.adminLoginTitle}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                {needsSetup ? t.adminSetupDesc : t.adminLoginDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loadingStatus ? (
          <div className="p-6 text-sm text-slate-500">{t.loadingText}</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-slate-700 mb-1.5">
                {t.adminPasswordLabel}
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>

            {needsSetup && (
              <div>
                <label htmlFor="admin-confirm-password" className="block text-xs font-medium text-slate-700 mb-1.5">
                  {t.adminConfirmLabel}
                </label>
                <input
                  id="admin-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t.close}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-[#005A9C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00487D] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? '...' : needsSetup ? t.adminSubmitSetup : t.adminSubmitLogin}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
