import {useEffect, useMemo, useState} from 'react';
import {ArrowRight, Bookmark, Check, FileText, Lock, LogOut, Plus, Search, Trash2} from 'lucide-react';
import {AdminModal} from './components/AdminModal';
import {CVBuilder} from './components/CVBuilder';
import {Header} from './components/Header';
import {OpportunityModal} from './components/OpportunityModal';
import {PublishModal} from './components/PublishModal';
import {ResilientImage} from './components/ResilientImage';
import {SAMPLE_SCHOLARSHIP_CV, SAMPLE_UN_JOB_CV} from './data/sampleCVs';
import {SEED_OPPORTUNITIES} from './data/seedOpportunities';
import {UI_TEXT} from './i18n';
import type {CVData, Language, Opportunity, OpportunityCategory} from './types';

const HERO_IMG = '/src/assets/images/hero_un_diplomacy_1795467239694.jpg';
const ADDIS_IMG = '/src/assets/images/addis_uneca_skyline_1795467240274.jpg';
const EDU_IMG = '/src/assets/images/edu_scholarship_campus_1795467240011.jpg';

const BOOKMARKS_KEY = 'un_bridge_bookmarks_v1';
const ACTIVE_CV_KEY = 'un_bridge_active_cv_v1';
const SAVED_DRAFTS_KEY = 'un_bridge_saved_cvs_v1';

type BoardTab = 'all' | OpportunityCategory | 'saved';

export default function App() {
  const [lang, setLang] = useState<Language>('am');
  const t = UI_TEXT[lang];

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpps, setLoadingOpps] = useState(true);
  const [oppError, setOppError] = useState('');

  const [activeTab, setActiveTab] = useState<BoardTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('all');
  const [stationFilter, setStationFilter] = useState('all');

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Admin session token kept strictly in React memory (never persisted to browser storage)
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const isAdmin = Boolean(adminToken);

  const [cv, setCv] = useState<CVData>(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_CV_KEY);
      return raw ? (JSON.parse(raw) as CVData) : SAMPLE_UN_JOB_CV;
    } catch {
      return SAMPLE_UN_JOB_CV;
    }
  });

  // Private CV drafts stored locally on the visitor's own device
  const [savedDrafts, setSavedDrafts] = useState<CVData[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_DRAFTS_KEY);
      return raw ? (JSON.parse(raw) as CVData[]) : [];
    } catch {
      return [];
    }
  });
  const [tailoredBanner, setTailoredBanner] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_CV_KEY, JSON.stringify(cv));
    } catch {
      // Ignore storage quota issues
    }
  }, [cv]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_DRAFTS_KEY, JSON.stringify(savedDrafts));
    } catch {
      // Ignore storage quota issues
    }
  }, [savedDrafts]);

  useEffect(() => {
    let cancelled = false;
    async function loadInitial() {
      setLoadingOpps(true);
      setOppError('');
      try {
        const oppRes = await fetch('/api/opportunities');
        if (oppRes.ok) {
          const data = (await oppRes.json()) as {opportunities: Opportunity[]};
          if (!cancelled) {
            setOpportunities(data.opportunities);
          }
        } else {
          throw new Error('Failed to fetch announcements');
        }
      } catch {
        if (!cancelled) {
          setOpportunities(SEED_OPPORTUNITIES);
          setOppError(
            lang === 'am'
              ? 'ከሰርቨሩ ጋር መገናኘት ስላልተቻለ መሰረታዊ ማስታወቂያዎች ታይተዋል።'
              : 'Loaded local announcement catalog.',
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingOpps(false);
        }
      }
    }
    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleBookmark(id: string) {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next;
    });
  }

  function handleNavigateSection(target: string) {
    if (target === 'education-filter') {
      setActiveTab('education');
      document.getElementById('opportunities-board')?.scrollIntoView({behavior: 'smooth'});
      return;
    }
    document.getElementById(target)?.scrollIntoView({behavior: 'smooth'});
  }

  function handleTailorCv(opportunity: Opportunity) {
    const mergedCompetencies = Array.from(
      new Set([...opportunity.competencies, ...cv.competencies]),
    ).slice(0, 8);

    setCv((prev) => ({
      ...prev,
      template: opportunity.category === 'education' ? 'europass' : 'un-p11',
      personal: {
        ...prev.personal,
        targetTitle: `${opportunity.title} — ${opportunity.agency}`,
      },
      competencies: mergedCompetencies,
    }));
    setTailoredBanner(`${opportunity.agency} · ${opportunity.title}`);
    setSelectedOpp(null);
    document.getElementById('cv-studio')?.scrollIntoView({behavior: 'smooth'});
  }

  async function handleSaveDraft(currentCv: CVData) {
    const draftToSave: CVData = {
      ...currentCv,
      id: currentCv.id || `cv-${Date.now()}`,
      name: currentCv.personal.fullName || currentCv.name || 'International CV',
      updatedAt: new Date().toISOString(),
    };

    setCv(draftToSave);
    setSavedDrafts((prev) => {
      const exists = prev.some((d) => d.id === draftToSave.id);
      return exists
        ? prev.map((d) => (d.id === draftToSave.id ? draftToSave : d))
        : [draftToSave, ...prev];
    });
  }

  function handleDeleteDraft(id: string) {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  async function handleDeleteOpportunity(id: string) {
    if (!adminToken) {
      setAdminModalOpen(true);
      return;
    }
    try {
      const res = await fetch(`/api/opportunities/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (res.status === 401) {
        setAdminToken(null);
        setAdminModalOpen(true);
        return;
      }
      if (res.ok) {
        setOpportunities((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // Ignore transient network errors
    }
  }

  const agencies = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.agency))).sort(),
    [opportunities],
  );

  const stations = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.dutyStation))).sort(),
    [opportunities],
  );

  const filteredOpportunities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return opportunities.filter((opp) => {
      if (activeTab === 'job' && opp.category !== 'job') return false;
      if (activeTab === 'education' && opp.category !== 'education') return false;
      if (activeTab === 'saved' && !savedIds.includes(opp.id)) return false;
      if (agencyFilter !== 'all' && opp.agency !== agencyFilter) return false;
      if (stationFilter !== 'all' && opp.dutyStation !== stationFilter) return false;

      if (!q) return true;
      const haystack = [
        opp.title,
        opp.titleAm,
        opp.agency,
        opp.dutyStation,
        opp.gradeOrLevel,
        opp.referenceCode,
        opp.summary,
        opp.summaryAm,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [opportunities, activeTab, savedIds, agencyFilter, stationFilter, searchQuery]);

  const jobCount = useMemo(
    () => opportunities.filter((o) => o.category === 'job').length,
    [opportunities],
  );
  const eduCount = useMemo(
    () => opportunities.filter((o) => o.category === 'education').length,
    [opportunities],
  );

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Header
        lang={lang}
        isAdmin={isAdmin}
        onNavigateSection={handleNavigateSection}
        onAdminAction={() => {
          if (isAdmin) {
            setPublishOpen(true);
          } else {
            setAdminModalOpen(true);
          }
        }}
      />

      {/* Hero Split + KPI Utility Strip */}
      <section className="no-print bg-white border-b border-slate-200">
        <div className="mx-auto max-w-[1280px] px-6 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <p className="text-xs font-medium tracking-wide text-[#005A9C]">
                  {t.heroKicker}
                </p>
                <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-semibold text-slate-950 leading-[1.15] tracking-tight text-balance max-w-2xl">
                  {t.heroTitle}
                </h1>
                <p className="text-[15.5px] leading-relaxed text-slate-600 max-w-2xl">
                  {t.heroSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigateSection('opportunities-board')}
                  className="inline-flex items-center gap-2 rounded-md bg-[#005A9C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#00487D] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>{t.heroPrimaryBtn}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateSection('cv-studio')}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 text-[#005A9C]" />
                  <span>{t.heroSecondaryBtn}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col">
              <figure className="flex-1 flex flex-col">
                <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 min-h-[240px]">
                  <ResilientImage
                    src={HERO_IMG}
                    alt="International diplomatic pavilion and conference campus"
                    fallbackLabel="United Nations Diplomatic Pavilion"
                    className="h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-2 text-xs text-slate-500">{t.heroCaption}</figcaption>
              </figure>
            </div>
          </div>

          {/* Full-width 4-Column Operational KPI & Language Strip */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-5 gap-6 items-center">
            <div>
              <p className="text-xs text-slate-500">{t.kpiJobsLabel}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
                {jobCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t.kpiEducationLabel}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
                {eduCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t.kpiAgenciesLabel}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
                {agencies.length || 8}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">{t.kpiDraftsLabel}</p>
              <p className="mt-1 font-mono text-2xl font-medium text-slate-900 tabular-nums">
                {savedDrafts.length}
              </p>
            </div>

            <div className="col-span-2 lg:col-span-1 flex lg:justify-end items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (isAdmin) {
                    setPublishOpen(true);
                  } else {
                    setAdminModalOpen(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Lock className="h-3.5 w-3.5 text-[#005A9C]" />
                <span>{isAdmin ? t.navPublish : t.navAdminLogin}</span>
              </button>

              <div className="inline-flex items-center gap-1 rounded-md bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setLang('am')}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'am' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  አማርኛ
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UN Jobs & Education Announcements Board */}
      <section id="opportunities-board" className="no-print py-14">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="max-w-2xl">
              <h2 className="font-editorial text-3xl font-semibold text-slate-900 tracking-tight">
                {t.boardTitle}
              </h2>
              <p className="mt-2 text-[15px] text-slate-600">{t.boardSubtitle}</p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {isAdmin ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPublishOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-[#005A9C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00487D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t.publishButton}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminToken(null)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t.adminSignOut}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Lock className="h-4 w-4 text-slate-500" />
                  <span>{t.navAdminLogin}</span>
                </button>
              )}
            </div>
          </div>

          {oppError && (
            <p className="mt-4 text-xs text-amber-700">{oppError}</p>
          )}

          {/* Filter Toolbar */}
          <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1 rounded-md bg-slate-200/70 p-1 w-fit">
              {(
                [
                  {id: 'all', label: `${t.tabAll} (${opportunities.length})`},
                  {id: 'job', label: `${t.tabJobs} (${jobCount})`},
                  {id: 'education', label: `${t.tabEducation} (${eduCount})`},
                  {id: 'saved', label: `${t.tabSaved} (${savedIds.length})`},
                ] as {id: BoardTab; label: string}[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-[620px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#005A9C] focus:outline-none"
                />
              </div>

              <select
                aria-label={t.filterAllAgencies}
                value={agencyFilter}
                onChange={(e) => setAgencyFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#005A9C] focus:outline-none"
              >
                <option value="all">{t.filterAllAgencies}</option>
                {agencies.map((ag) => (
                  <option key={ag} value={ag}>
                    {ag}
                  </option>
                ))}
              </select>

              <select
                aria-label={t.filterAllStations}
                value={stationFilter}
                onChange={(e) => setStationFilter(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#005A9C] focus:outline-none"
              >
                <option value="all">{t.filterAllStations}</option>
                {stations.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Opportunities List / Grid */}
          {loadingOpps ? (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-52 rounded-lg border border-slate-200 bg-white p-6 animate-pulse"
                />
              ))}
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-12 text-center">
              <h3 className="font-editorial text-xl font-semibold text-slate-900">{t.emptyTitle}</h3>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">{t.emptyDesc}</p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setSearchQuery('');
                  setAgencyFilter('all');
                  setStationFilter('all');
                }}
                className="mt-5 rounded-md bg-[#005A9C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00487D] cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpportunities.map((opp) => {
                const isSaved = savedIds.includes(opp.id);
                const displayTitle = lang === 'am' ? opp.titleAm : opp.title;
                const displaySummary = lang === 'am' ? opp.summaryAm : opp.summary;

                return (
                  <article
                    key={opp.id}
                    className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-[#005A9C]">{opp.agency}</span>
                          <span aria-hidden="true">·</span>
                          <span>{opp.category === 'education' ? t.tabEducation : t.tabJobs}</span>
                          <span aria-hidden="true">·</span>
                          <span>{opp.dutyStation}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{opp.gradeOrLevel}</span>
                        </div>

                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOpportunity(opp.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>{t.adminDeleteNotice}</span>
                          </button>
                        )}
                      </div>

                      <h3 className="mt-2.5 font-editorial text-xl font-semibold text-slate-900 leading-snug">
                        <button
                          type="button"
                          onClick={() => setSelectedOpp(opp)}
                          className="text-left hover:text-[#005A9C] transition-colors cursor-pointer"
                        >
                          {displayTitle}
                        </button>
                      </h3>

                      {lang === 'am' && opp.title !== opp.titleAm && (
                        <p className="mt-1 text-xs font-medium text-slate-500">{opp.title}</p>
                      )}

                      <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {displaySummary}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 font-mono tabular-nums">
                        <span>
                          {t.deadlinePrefix}: {opp.deadline}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBookmark(opp.id)}
                          aria-label={isSaved ? t.savedBookmark : t.saveBookmark}
                          className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            isSaved
                              ? 'border-[#005A9C] text-[#005A9C] bg-[#005A9C]/5'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {isSaved ? <Check className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                          <span>{isSaved ? t.savedBookmark : t.saveBookmark}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTailorCv(opp)}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {t.tailorCv}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedOpp(opp)}
                          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {t.viewDetails}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Editorial Guidance & Regional Context */}
      <section className="no-print border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="max-w-2xl pb-8">
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {t.editorialHighlightTitle}
            </h2>
            <p className="mt-2 text-[15px] text-slate-600">{t.editorialHighlightSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="border border-slate-200 rounded-lg overflow-hidden bg-[#F8FAFC] flex flex-col">
              <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                <ResilientImage
                  src={ADDIS_IMG}
                  alt="Regional diplomatic complex in Addis Ababa"
                  fallbackLabel="Addis Ababa Regional Hub"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-xl font-semibold text-slate-900">
                    {t.addisCampusTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {t.addisCampusDesc}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setCv({...SAMPLE_UN_JOB_CV, template: 'un-p11'});
                      handleNavigateSection('cv-studio');
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#005A9C] hover:underline cursor-pointer"
                  >
                    <span>{t.cvLoadJobSample}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>

            <article className="border border-slate-200 rounded-lg overflow-hidden bg-[#F8FAFC] flex flex-col">
              <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                <ResilientImage
                  src={EDU_IMG}
                  alt="International graduate fellows researching together in a sunlit library"
                  fallbackLabel="International Graduate Fellowship Library"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-xl font-semibold text-slate-900">
                    {t.scholarshipGuideTitle}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {t.scholarshipGuideDesc}
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setCv({...SAMPLE_SCHOLARSHIP_CV, template: 'europass'});
                      handleNavigateSection('cv-studio');
                    }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#005A9C] hover:underline cursor-pointer"
                  >
                    <span>{t.cvLoadEduSample}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Integrated International CV Studio */}
      <CVBuilder
        lang={lang}
        cv={cv}
        onChange={setCv}
        onSaveDraft={handleSaveDraft}
        savedDrafts={savedDrafts}
        onSelectDraft={(draft) => setCv(draft)}
        onDeleteDraft={handleDeleteDraft}
        tailoredBanner={tailoredBanner}
      />

      {/* Quiet Footer */}
      <footer className="no-print border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-[1280px] px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium text-slate-700">{t.footerCopy}</p>
          <p>{t.footerNote}</p>
        </div>
      </footer>

      {/* Modals */}
      <OpportunityModal
        opportunity={selectedOpp}
        lang={lang}
        isSaved={selectedOpp ? savedIds.includes(selectedOpp.id) : false}
        onToggleSave={toggleBookmark}
        onTailorCv={handleTailorCv}
        onClose={() => setSelectedOpp(null)}
      />

      <PublishModal
        isOpen={publishOpen}
        lang={lang}
        adminToken={adminToken}
        onClose={() => setPublishOpen(false)}
        onCreated={(created) => {
          setOpportunities((prev) => [created, ...prev]);
          setActiveTab('all');
        }}
      />

      <AdminModal
        isOpen={adminModalOpen}
        lang={lang}
        onClose={() => setAdminModalOpen(false)}
        onAuthenticated={(token) => setAdminToken(token)}
      />
    </div>
  );
}
