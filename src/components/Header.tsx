import {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {UI_TEXT} from '../i18n';
import type {Language} from '../types';

interface HeaderProps {
  lang: Language;
  isAdmin: boolean;
  onNavigateSection: (sectionId: string) => void;
  onAdminAction: () => void;
}

export function Header({lang, isAdmin, onNavigateSection, onAdminAction}: HeaderProps) {
  const t = UI_TEXT[lang];
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleMobileNav(sectionId: string) {
    setMobileOpen(false);
    onNavigateSection(sectionId);
  }

  function handleMobileAdmin() {
    setMobileOpen(false);
    onAdminAction();
  }

  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          className="font-editorial text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005A9C]"
        >
          {t.brand}
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600" aria-label="Primary">
          <button
            type="button"
            onClick={() => onNavigateSection('opportunities-board')}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            {t.navAnnouncements}
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('education-filter')}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            {t.navEducation}
          </button>
          <button
            type="button"
            onClick={() => onNavigateSection('cv-studio')}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            {t.navCvStudio}
          </button>
          <button
            type="button"
            onClick={onAdminAction}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline underline-offset-4 transition-colors cursor-pointer"
          >
            {isAdmin ? t.navPublish : t.navAdminLogin}
          </button>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateSection('cv-studio')}
            className="whitespace-nowrap shrink-0 rounded-md bg-[#005A9C] px-4 py-2 text-sm font-medium text-white hover:bg-[#00487D] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005A9C]"
          >
            {t.navPrimaryCta}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t.close : 'Menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-200 bg-slate-50 px-6 py-3 flex flex-col gap-1 text-sm font-medium text-slate-700"
        >
          <button
            type="button"
            onClick={() => handleMobileNav('opportunities-board')}
            className="py-2 text-left hover:text-slate-950 cursor-pointer"
          >
            {t.navAnnouncements}
          </button>
          <button
            type="button"
            onClick={() => handleMobileNav('education-filter')}
            className="py-2 text-left hover:text-slate-950 cursor-pointer"
          >
            {t.navEducation}
          </button>
          <button
            type="button"
            onClick={() => handleMobileNav('cv-studio')}
            className="py-2 text-left hover:text-slate-950 cursor-pointer"
          >
            {t.navCvStudio}
          </button>
          <button
            type="button"
            onClick={handleMobileAdmin}
            className="py-2 text-left text-[#005A9C] font-semibold cursor-pointer"
          >
            {isAdmin ? t.navPublish : t.navAdminLogin}
          </button>
        </nav>
      )}
    </header>
  );
}
