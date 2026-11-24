import {Bookmark, Check, ExternalLink, FileText, X} from 'lucide-react';
import {UI_TEXT} from '../i18n';
import type {Language, Opportunity} from '../types';

interface OpportunityModalProps {
  opportunity: Opportunity | null;
  lang: Language;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onTailorCv: (opportunity: Opportunity) => void;
  onClose: () => void;
}

export function OpportunityModal({
  opportunity,
  lang,
  isSaved,
  onToggleSave,
  onTailorCv,
  onClose,
}: OpportunityModalProps) {
  if (!opportunity) {
    return null;
  }

  const t = UI_TEXT[lang];
  const displayTitle = lang === 'am' ? opportunity.titleAm : opportunity.title;
  const secondaryTitle = lang === 'am' ? opportunity.title : opportunity.titleAm;
  const displaySummary = lang === 'am' ? opportunity.summaryAm : opportunity.summary;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-end bg-slate-950/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="opp-detail-title"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl border-l border-slate-200 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 tabular-nums truncate">
            <span className="font-semibold text-[#005A9C]">{opportunity.agency}</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.referenceCode}</span>
            <span aria-hidden="true">·</span>
            <span>{opportunity.gradeOrLevel}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-7 space-y-7">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2.5">
              <span>{opportunity.category === 'education' ? t.tabEducation : t.tabJobs}</span>
              <span aria-hidden="true">·</span>
              <span>{opportunity.dutyStation}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {t.deadlinePrefix}: {opportunity.deadline}
              </span>
            </div>

            <h2
              id="opp-detail-title"
              className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-900 leading-snug"
            >
              {displayTitle}
            </h2>
            {secondaryTitle && secondaryTitle !== displayTitle && (
              <p className="mt-1.5 text-sm text-slate-500">{secondaryTitle}</p>
            )}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-slate-200 py-4 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Agency / Organization</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{opportunity.agency}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Duty Station</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{opportunity.dutyStation}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Contract / Funding</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{opportunity.contractOrFunding}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">{t.deadlinePrefix}</dt>
              <dd className="mt-0.5 font-mono font-medium text-slate-900 tabular-nums">{opportunity.deadline}</dd>
            </div>
          </dl>

          <section className="space-y-2">
            <p className="text-[15px] leading-relaxed text-slate-700">{displaySummary}</p>
            {lang === 'am' && opportunity.summary && opportunity.summary !== opportunity.summaryAm && (
              <p className="text-sm leading-relaxed text-slate-500">{opportunity.summary}</p>
            )}
          </section>

          {opportunity.responsibilities.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">{t.responsibilitiesTitle}</h3>
              <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5 leading-relaxed">
                {opportunity.responsibilities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {opportunity.qualifications.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">{t.qualificationsTitle}</h3>
              <ul className="space-y-2 text-sm text-slate-700 list-disc pl-5 leading-relaxed">
                {opportunity.qualifications.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {opportunity.competencies.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">{t.competenciesTitle}</h3>
              <p className="text-sm text-slate-600">{opportunity.competencies.join(' · ')}</p>
            </section>
          )}
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.id)}
              className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isSaved
                  ? 'border-[#005A9C] bg-[#005A9C]/5 text-[#005A9C]'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              <span>{isSaved ? t.savedBookmark : t.saveBookmark}</span>
            </button>

            <a
              href={opportunity.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t.applyOfficial}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <button
            type="button"
            onClick={() => onTailorCv(opportunity)}
            className="inline-flex items-center gap-2 rounded-md bg-[#005A9C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#00487D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileText className="h-4 w-4" />
            <span>{t.tailorCv}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
