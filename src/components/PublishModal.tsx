import {useState} from 'react';
import {X} from 'lucide-react';
import {UI_TEXT} from '../i18n';
import type {Language, Opportunity, OpportunityCategory, UNAgency} from '../types';

interface PublishModalProps {
  isOpen: boolean;
  lang: Language;
  adminToken: string | null;
  onClose: () => void;
  onCreated: (opportunity: Opportunity) => void;
}

const AGENCIES: UNAgency[] = [
  'UNDP',
  'UNICEF',
  'UNESCO',
  'WHO',
  'UNHCR',
  'WFP',
  'UNECA',
  'FAO',
  'UN-Habitat',
  'ITU',
];

export function PublishModal({isOpen, lang, adminToken, onClose, onCreated}: PublishModalProps) {
  const t = UI_TEXT[lang];
  const [category, setCategory] = useState<OpportunityCategory>('job');
  const [agency, setAgency] = useState<UNAgency>('UNECA');
  const [title, setTitle] = useState('');
  const [titleAm, setTitleAm] = useState('');
  const [dutyStation, setDutyStation] = useState('Addis Ababa, Ethiopia');
  const [gradeOrLevel, setGradeOrLevel] = useState('P-3');
  const [contractOrFunding, setContractOrFunding] = useState('Fixed-Term Appointment');
  const [deadline, setDeadline] = useState('2027-01-30');
  const [officialUrl, setOfficialUrl] = useState('https://careers.un.org');
  const [summary, setSummary] = useState('');
  const [summaryAm, setSummaryAm] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [qualificationsText, setQualificationsText] = useState('');
  const [competenciesText, setCompetenciesText] = useState(
    'Integrity, Professionalism, Respect for Diversity',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim() || !dutyStation.trim() || !deadline.trim()) {
      setError(
        lang === 'am'
          ? 'እባክዎ ርዕስ፣ የስራ/ትምህርት ቦታ እና የመጨረሻ ቀን ያስገቡ።'
          : 'Please fill in title, duty station, and deadline.',
      );
      return;
    }

    if (!adminToken) {
      setError(
        lang === 'am'
          ? 'ማስታወቂያ ለማውጣት በአድሚን መግባት ያስፈልጋል።'
          : 'Admin sign-in is required to publish announcements.',
      );
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          category,
          agency,
          title: title.trim(),
          titleAm: titleAm.trim() || title.trim(),
          dutyStation: dutyStation.trim(),
          gradeOrLevel: gradeOrLevel.trim(),
          contractOrFunding: contractOrFunding.trim(),
          deadline: deadline.trim(),
          officialUrl: officialUrl.trim(),
          summary: summary.trim() || title.trim(),
          summaryAm: summaryAm.trim() || summary.trim() || titleAm.trim() || title.trim(),
          responsibilities: responsibilitiesText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
          qualifications: qualificationsText
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
          competencies: competenciesText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as {error?: string};
        throw new Error(data.error || 'Failed to publish notice.');
      }

      const data = (await response.json()) as {opportunity: Opportunity};
      onCreated(data.opportunity);
      setTitle('');
      setTitleAm('');
      setSummary('');
      setSummaryAm('');
      setResponsibilitiesText('');
      setQualificationsText('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to publish announcement.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h2 id="publish-modal-title" className="font-editorial text-xl font-semibold text-slate-900">
              {t.publishModalTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{t.publishModalDesc}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'የማስታወቂያው አይነት' : 'Announcement Type'}
              </label>
              <div className="grid grid-cols-2 gap-1 rounded-md bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setCategory('job');
                    setGradeOrLevel('P-3');
                    setContractOrFunding('Fixed-Term Appointment');
                  }}
                  className={`rounded px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    category === 'job' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {t.tabJobs}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCategory('education');
                    setGradeOrLevel('Master’s / Fellowship');
                    setContractOrFunding('Full Tuition + Stipend');
                  }}
                  className={`rounded px-3 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    category === 'education' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {t.tabEducation}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="pub-agency" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'የUN ኤጀንሲ' : 'UN Agency'}
              </label>
              <select
                id="pub-agency"
                value={agency}
                onChange={(e) => setAgency(e.target.value as UNAgency)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              >
                {AGENCIES.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pub-title-am" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'ርዕስ (በአማርኛ)' : 'Title (Amharic — Optional)'}
              </label>
              <input
                id="pub-title-am"
                type="text"
                value={titleAm}
                onChange={(e) => setTitleAm(e.target.value)}
                placeholder="ለምሳሌ፡ የትምህርት ፕሮግራም ባለሙያ"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pub-title-en" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'ርዕስ (በእንግሊዝኛ — ግዴታ)' : 'Official Title (English — Required)'}
              </label>
              <input
                id="pub-title-en"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Education Policy Analyst (P-3)"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="pub-station" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'ቦታ (Duty Station)' : 'Duty Station / City'}
              </label>
              <input
                id="pub-station"
                type="text"
                required
                value={dutyStation}
                onChange={(e) => setDutyStation(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pub-grade" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'ደረጃ / የትምህርት እርከን' : 'Grade / Degree Level'}
              </label>
              <input
                id="pub-grade"
                type="text"
                value={gradeOrLevel}
                onChange={(e) => setGradeOrLevel(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pub-deadline" className="block text-xs font-medium text-slate-700 mb-1.5">
                {t.deadlinePrefix}
              </label>
              <input
                id="pub-deadline"
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pub-funding" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'የኮንትራት ወይም የድጋፍ አይነት' : 'Contract / Funding Coverage'}
              </label>
              <input
                id="pub-funding"
                type="text"
                value={contractOrFunding}
                onChange={(e) => setContractOrFunding(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="pub-url" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'የማመልከቻ ድረገጽ (URL)' : 'Official Application URL'}
              </label>
              <input
                id="pub-url"
                type="url"
                value={officialUrl}
                onChange={(e) => setOfficialUrl(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pub-sum-am" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'አጭር ማብራሪያ (አማርኛ)' : 'Summary (Amharic — Optional)'}
              </label>
              <textarea
                id="pub-sum-am"
                rows={3}
                value={summaryAm}
                onChange={(e) => setSummaryAm(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="pub-sum-en" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'አጭር ማብራሪያ (እንግሊዝኛ)' : 'Summary (English)'}
              </label>
              <textarea
                id="pub-sum-en"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pub-resp" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'ዋና ተግባራት (በመስመር ይለዩ)' : 'Key Responsibilities (one per line)'}
              </label>
              <textarea
                id="pub-resp"
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="pub-qual" className="block text-xs font-medium text-slate-700 mb-1.5">
                {lang === 'am' ? 'መስፈርቶች (በመስመር ይለዩ)' : 'Qualifications (one per line)'}
              </label>
              <textarea
                id="pub-qual"
                rows={3}
                value={qualificationsText}
                onChange={(e) => setQualificationsText(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pub-comp" className="block text-xs font-medium text-slate-700 mb-1.5">
              {lang === 'am' ? 'የUN ብቃቶች (በኮማ ይለዩ)' : 'UN Core Competencies (comma-separated)'}
            </label>
            <input
              id="pub-comp"
              type="text"
              value={competenciesText}
              onChange={(e) => setCompetenciesText(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#005A9C] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
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
              className="rounded-md bg-[#005A9C] px-5 py-2 text-sm font-medium text-white hover:bg-[#00487D] disabled:opacity-60 cursor-pointer"
            >
              {submitting ? '...' : t.publishSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
