import {useState} from 'react';
import {Check, Download, FileDown, Plus, Printer, Save, Trash2, Upload} from 'lucide-react';
import {EMPTY_CV, SAMPLE_SCHOLARSHIP_CV, SAMPLE_UN_JOB_CV} from '../data/sampleCVs';
import {UI_TEXT} from '../i18n';
import type {
  CVData,
  CVEducationItem,
  CVExperienceItem,
  CVLanguageItem,
  CVReferenceItem,
  CVTemplateId,
  Language,
} from '../types';
import {CVPreview} from './CVPreview';

interface CVBuilderProps {
  lang: Language;
  cv: CVData;
  onChange: (next: CVData) => void;
  onSaveDraft: (cv: CVData) => Promise<void>;
  savedDrafts: CVData[];
  onSelectDraft: (cv: CVData) => void;
  onDeleteDraft: (id: string) => void;
  tailoredBanner: string | null;
}

type EditorTab =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'languages'
  | 'skills'
  | 'references';

const PROFICIENCY_LEVELS: CVLanguageItem['speaking'][] = [
  'Mother Tongue',
  'Fluent (C2/C1)',
  'Intermediate (B2/B1)',
  'Basic (A2/A1)',
];

export function CVBuilder({
  lang,
  cv,
  onChange,
  onSaveDraft,
  savedDrafts,
  onSelectDraft,
  onDeleteDraft,
  tailoredBanner,
}: CVBuilderProps) {
  const t = UI_TEXT[lang];
  const [activeTab, setActiveTab] = useState<EditorTab>('personal');
  const [saving, setSaving] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const tabs: {id: EditorTab; label: string}[] = [
    {id: 'personal', label: t.cvSectionPersonal},
    {id: 'summary', label: t.cvSectionSummary},
    {id: 'experience', label: t.cvSectionExperience},
    {id: 'education', label: t.cvSectionEducation},
    {id: 'languages', label: t.cvSectionLanguages},
    {id: 'skills', label: t.cvSectionSkills},
    {id: 'references', label: t.cvSectionReferences},
  ];

  async function handleSave() {
    setSaving(true);
    try {
      await onSaveDraft(cv);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2400);
    } finally {
      setSaving(false);
    }
  }

  function handleExportJson() {
    const blob = new Blob([JSON.stringify(cv, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(cv.personal.fullName || 'international-cv').toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange({
          ...cv,
          personal: {...cv.personal, photoDataUrl: reader.result},
        });
      }
    };
    reader.readAsDataURL(file);
  }

  function addExperience() {
    const item: CVExperienceItem = {
      id: `exp-${Date.now()}`,
      role: '',
      organization: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      supervisorName: '',
      achievements: [''],
    };
    onChange({...cv, experiences: [...cv.experiences, item]});
  }

  function updateExperience(id: string, patch: Partial<CVExperienceItem>) {
    onChange({
      ...cv,
      experiences: cv.experiences.map((exp) => (exp.id === id ? {...exp, ...patch} : exp)),
    });
  }

  function removeExperience(id: string) {
    onChange({...cv, experiences: cv.experiences.filter((exp) => exp.id !== id)});
  }

  function addEducation() {
    const item: CVEducationItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      fieldOfStudy: '',
      institution: '',
      country: '',
      startYear: '',
      endYear: '',
      honorsOrThesis: '',
    };
    onChange({...cv, education: [...cv.education, item]});
  }

  function updateEducation(id: string, patch: Partial<CVEducationItem>) {
    onChange({
      ...cv,
      education: cv.education.map((edu) => (edu.id === id ? {...edu, ...patch} : edu)),
    });
  }

  function removeEducation(id: string) {
    onChange({...cv, education: cv.education.filter((edu) => edu.id !== id)});
  }

  function addLanguage() {
    const item: CVLanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      speaking: 'Fluent (C2/C1)',
      reading: 'Fluent (C2/C1)',
      writing: 'Fluent (C2/C1)',
    };
    onChange({...cv, languages: [...cv.languages, item]});
  }

  function updateLanguage(id: string, patch: Partial<CVLanguageItem>) {
    onChange({
      ...cv,
      languages: cv.languages.map((l) => (l.id === id ? {...l, ...patch} : l)),
    });
  }

  function removeLanguage(id: string) {
    onChange({...cv, languages: cv.languages.filter((l) => l.id !== id)});
  }

  function addReference() {
    const item: CVReferenceItem = {
      id: `ref-${Date.now()}`,
      name: '',
      title: '',
      organization: '',
      email: '',
      phone: '',
    };
    onChange({...cv, references: [...cv.references, item]});
  }

  function updateReference(id: string, patch: Partial<CVReferenceItem>) {
    onChange({
      ...cv,
      references: cv.references.map((r) => (r.id === id ? {...r, ...patch} : r)),
    });
  }

  function removeReference(id: string) {
    onChange({...cv, references: cv.references.filter((r) => r.id !== id)});
  }

  return (
    <section id="cv-studio" className="border-t border-slate-200 bg-[#F8FAFC] py-14">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Section Header + Top Studio Actions */}
        <div className="no-print flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <h2 className="font-editorial text-3xl font-semibold text-slate-900 tracking-tight">
              {t.cvStudioTitle}
            </h2>
            <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{t.cvStudioSubtitle}</p>
            {tailoredBanner && (
              <p className="mt-2 text-xs font-medium text-[#005A9C]">
                {lang === 'am' ? 'የተመረጠ የCV ዒላማ፡ ' : 'Tailoring CV for: '}
                {tailoredBanner}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onChange({...SAMPLE_UN_JOB_CV, id: cv.id || 'draft-active'})}
              className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.cvLoadJobSample}
            </button>
            <button
              type="button"
              onClick={() => onChange({...SAMPLE_SCHOLARSHIP_CV, id: cv.id || 'draft-active'})}
              className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.cvLoadEduSample}
            </button>
            <button
              type="button"
              onClick={() => onChange({...EMPTY_CV, id: `draft-${Date.now()}`})}
              className="rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {t.cvClearSample}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              {savedFeedback ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Save className="h-3.5 w-3.5" />}
              <span>{savedFeedback ? t.cvSavedStatus : t.cvSaveDraft}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileDown className="h-3.5 w-3.5" />
              <span>{t.cvExportJson}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#005A9C] px-4 py-2 text-xs font-medium text-white hover:bg-[#00487D] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>{t.cvPrintPdf}</span>
            </button>
          </div>
        </div>

        {/* Saved Drafts Bar */}
        {savedDrafts.length > 0 && (
          <div className="no-print mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="font-medium text-slate-700">
              {lang === 'am' ? 'የተቀመጡ ረቂቆች፡' : 'Saved Drafts:'}
            </span>
            {savedDrafts.map((draft) => (
              <div key={draft.id} className="inline-flex items-center gap-1.5 border border-slate-200 bg-white rounded-md px-2.5 py-1">
                <button
                  type="button"
                  onClick={() => onSelectDraft(draft)}
                  className="font-medium text-slate-800 hover:text-[#005A9C] cursor-pointer"
                >
                  {draft.personal.fullName || draft.name || 'Untitled CV'}
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDraft(draft.id)}
                  aria-label="Delete draft"
                  className="text-slate-400 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Split Editor + Live A4 Preview */}
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Structured CV Editor */}
          <div className="no-print lg:col-span-5 rounded-lg border border-slate-200 bg-white">
            {/* Template Switcher */}
            <div className="border-b border-slate-200 p-4">
              <label className="block text-xs font-medium text-slate-600 mb-2">
                {t.cvTemplateLabel}
              </label>
              <div className="grid grid-cols-3 gap-1 rounded-md bg-slate-100 p-1">
                {(
                  [
                    {id: 'un-p11', label: t.cvTplP11},
                    {id: 'europass', label: t.cvTplEuropass},
                    {id: 'executive', label: t.cvTplExecutive},
                  ] as {id: CVTemplateId; label: string}[]
                ).map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onChange({...cv, template: tpl.id})}
                    className={`rounded px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer truncate ${
                      cv.template === tpl.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-slate-200 px-4 py-2.5 bg-slate-50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#005A9C] text-white'
                      : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Tab Body */}
            <div className="p-5 space-y-4">
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      {cv.personal.photoDataUrl ? (
                        <img
                          src={cv.personal.photoDataUrl}
                          alt="Profile"
                          className="h-14 w-14 rounded-md object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-md border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[11px] text-slate-400">
                          Photo
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{t.cvPhotoUpload}</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        {cv.personal.photoDataUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              onChange({...cv, personal: {...cv.personal, photoDataUrl: ''}})
                            }
                            className="text-xs text-slate-500 hover:text-red-600 cursor-pointer"
                          >
                            {t.cvPhotoRemove}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name (International Spelling)
                      </label>
                      <input
                        type="text"
                        value={cv.personal.fullName}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, fullName: e.target.value}})
                        }
                        placeholder="e.g., Selamawit Bekele Tadesse"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Target Position / Scholarship Title
                      </label>
                      <input
                        type="text"
                        value={cv.personal.targetTitle}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, targetTitle: e.target.value}})
                        }
                        placeholder="e.g., Programme Management Officer (P-3)"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nationality</label>
                      <input
                        type="text"
                        value={cv.personal.nationality}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, nationality: e.target.value}})
                        }
                        placeholder="Ethiopian"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={cv.personal.dateOfBirth}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, dateOfBirth: e.target.value}})
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={cv.personal.email}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, email: e.target.value}})
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                      <input
                        type="text"
                        value={cv.personal.phone}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, phone: e.target.value}})
                        }
                        placeholder="+251 911 ..."
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">City, Country</label>
                      <input
                        type="text"
                        value={cv.personal.location}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, location: e.target.value}})
                        }
                        placeholder="Addis Ababa, Ethiopia"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Gender (Optional)</label>
                      <input
                        type="text"
                        value={cv.personal.gender}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, gender: e.target.value}})
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        LinkedIn / ORCID / Portfolio
                      </label>
                      <input
                        type="text"
                        value={cv.personal.linkedin}
                        onChange={(e) =>
                          onChange({...cv, personal: {...cv.personal, linkedin: e.target.value}})
                        }
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-[#005A9C] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-3">
                  <label className="block text-xs font-medium text-slate-700">
                    Executive Summary / Motivation Statement (Recommended in English)
                  </label>
                  <textarea
                    rows={7}
                    value={cv.summary}
                    onChange={(e) => onChange({...cv, summary: e.target.value})}
                    placeholder="Summarize your years of experience, UN mandate alignment (SDGs), and key impact..."
                    className="w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm leading-relaxed focus:border-[#005A9C] focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...cv,
                          summary:
                            'Results-oriented development professional with experience in programme coordination, monitoring & evaluation, and multi-stakeholder partnerships aligned with Sustainable Development Goals (SDGs).',
                        })
                      }
                      className="rounded border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      + UN Job Starter
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChange({
                          ...cv,
                          summary:
                            'Dedicated researcher and graduate candidate with strong academic grounding, quantitative research skills, and commitment to international cooperation and sustainable development.',
                        })
                      }
                      className="rounded border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      + Scholarship Starter
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div className="space-y-5">
                  {cv.experiences.map((exp, idx) => (
                    <div key={exp.id} className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">
                          Position #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => updateExperience(exp.id, {role: e.target.value})}
                          placeholder="Job Title"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={exp.organization}
                          onChange={(e) => updateExperience(exp.id, {organization: e.target.value})}
                          placeholder="Organization / Agency"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, {location: e.target.value})}
                          placeholder="City, Country"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={exp.supervisorName}
                          onChange={(e) => updateExperience(exp.id, {supervisorName: e.target.value})}
                          placeholder="Supervisor (UN P11)"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, {startDate: e.target.value})}
                          placeholder="Start (e.g., 2022-03)"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, {endDate: e.target.value})}
                            placeholder="End (e.g., 2025-11)"
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono disabled:bg-slate-100"
                          />
                          <label className="inline-flex items-center gap-1 text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(exp.id, {current: e.target.checked})}
                            />
                            <span>Current</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Key Duties & Quantified Achievements (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={exp.achievements.join('\n')}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              achievements: e.target.value.split('\n'),
                            })
                          }
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t.cvAddExperience}</span>
                  </button>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-5">
                  {cv.education.map((edu, idx) => (
                    <div key={edu.id} className="space-y-3 border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Degree #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeEducation(edu.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, {degree: e.target.value})}
                          placeholder="Degree (e.g., Master of Public Policy)"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, {fieldOfStudy: e.target.value})}
                          placeholder="Field of Study"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, {institution: e.target.value})}
                          placeholder="University / Institution"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={edu.country}
                          onChange={(e) => updateEducation(edu.id, {country: e.target.value})}
                          placeholder="Country"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(edu.id, {startYear: e.target.value})}
                          placeholder="Start Year"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
                        />
                        <input
                          type="text"
                          value={edu.endYear}
                          onChange={(e) => updateEducation(edu.id, {endYear: e.target.value})}
                          placeholder="Graduation Year"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
                        />
                        <input
                          type="text"
                          value={edu.honorsOrThesis}
                          onChange={(e) => updateEducation(edu.id, {honorsOrThesis: e.target.value})}
                          placeholder="GPA / Distinction / Thesis Title"
                          className="sm:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t.cvAddEducation}</span>
                  </button>
                </div>
              )}

              {activeTab === 'languages' && (
                <div className="space-y-4">
                  {cv.languages.map((item) => (
                    <div key={item.id} className="space-y-2.5 border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={item.language}
                          onChange={(e) => updateLanguage(item.id, {language: e.target.value})}
                          placeholder="Language (e.g., English, Amharic, French)"
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeLanguage(item.id)}
                          aria-label="Remove language"
                          className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(['speaking', 'reading', 'writing'] as const).map((skill) => (
                          <div key={skill}>
                            <label className="block text-[11px] text-slate-500 capitalize mb-1">{skill}</label>
                            <select
                              value={item[skill]}
                              onChange={(e) =>
                                updateLanguage(item.id, {
                                  [skill]: e.target.value as CVLanguageItem['speaking'],
                                })
                              }
                              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs"
                            >
                              {PROFICIENCY_LEVELS.map((lvl) => (
                                <option key={lvl} value={lvl}>
                                  {lvl}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t.cvAddLanguage}</span>
                  </button>
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      UN Core Competencies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={cv.competencies.join(', ')}
                      onChange={(e) =>
                        onChange({
                          ...cv,
                          competencies: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Technical & Research Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={cv.technicalSkills.join(', ')}
                      onChange={(e) =>
                        onChange({
                          ...cv,
                          technicalSkills: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="RBM, SPSS, QGIS, Grant Budgeting..."
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Publications, Fellowships & Awards (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={cv.publicationsOrAwards.join('\n')}
                      onChange={(e) =>
                        onChange({
                          ...cv,
                          publicationsOrAwards: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'references' && (
                <div className="space-y-4">
                  {cv.references.map((ref, idx) => (
                    <div key={ref.id} className="space-y-2.5 border-b border-slate-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Referee #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeReference(ref.id)}
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={ref.name}
                          onChange={(e) => updateReference(ref.id, {name: e.target.value})}
                          placeholder="Full Name"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={ref.title}
                          onChange={(e) => updateReference(ref.id, {title: e.target.value})}
                          placeholder="Title / Role"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={ref.organization}
                          onChange={(e) => updateReference(ref.id, {organization: e.target.value})}
                          placeholder="Organization"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="email"
                          value={ref.email}
                          onChange={(e) => updateReference(ref.id, {email: e.target.value})}
                          placeholder="Official Email"
                          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                        <input
                          type="text"
                          value={ref.phone}
                          onChange={(e) => updateReference(ref.id, {phone: e.target.value})}
                          placeholder="Phone"
                          className="sm:col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-mono"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addReference}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{t.cvAddReference}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live A4 International CV Document */}
          <div className="print-only-container lg:col-span-7">
            <div className="no-print mb-3 flex items-center justify-between text-xs text-slate-500">
              <span>
                {lang === 'am'
                  ? 'የቀጥታ A4 ቅድመ-እይታ — ለማውረድ "PDF አውርድ / አትም" የሚለውን ይጫኑ'
                  : 'Live A4 International Document Preview'}
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-[#005A9C] font-medium hover:underline cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t.cvPrintPdf}</span>
              </button>
            </div>
            <CVPreview cv={cv} />
          </div>
        </div>
      </div>
    </section>
  );
}
