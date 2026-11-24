import type {Language} from './types';

export const UI_TEXT: Record<
  Language,
  {
    brand: string;
    navAnnouncements: string;
    navEducation: string;
    navCvStudio: string;
    navPublish: string;
    navPrimaryCta: string;
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    heroPrimaryBtn: string;
    heroSecondaryBtn: string;
    heroCaption: string;
    kpiJobsLabel: string;
    kpiEducationLabel: string;
    kpiAgenciesLabel: string;
    kpiDraftsLabel: string;
    langToggleLabel: string;
    boardTitle: string;
    boardSubtitle: string;
    tabAll: string;
    tabJobs: string;
    tabEducation: string;
    tabSaved: string;
    searchPlaceholder: string;
    filterAllAgencies: string;
    filterAllStations: string;
    publishButton: string;
    emptyTitle: string;
    emptyDesc: string;
    resetFilters: string;
    loadingText: string;
    deadlinePrefix: string;
    refPrefix: string;
    viewDetails: string;
    tailorCv: string;
    applyOfficial: string;
    saveBookmark: string;
    savedBookmark: string;
    responsibilitiesTitle: string;
    qualificationsTitle: string;
    competenciesTitle: string;
    close: string;
    editorialHighlightTitle: string;
    editorialHighlightSubtitle: string;
    addisCampusTitle: string;
    addisCampusDesc: string;
    scholarshipGuideTitle: string;
    scholarshipGuideDesc: string;
    cvStudioTitle: string;
    cvStudioSubtitle: string;
    cvTemplateLabel: string;
    cvTplP11: string;
    cvTplEuropass: string;
    cvTplExecutive: string;
    cvLoadJobSample: string;
    cvLoadEduSample: string;
    cvClearSample: string;
    cvSaveDraft: string;
    cvSavedStatus: string;
    cvPrintPdf: string;
    cvExportJson: string;
    cvSectionPersonal: string;
    cvSectionSummary: string;
    cvSectionExperience: string;
    cvSectionEducation: string;
    cvSectionLanguages: string;
    cvSectionSkills: string;
    cvSectionReferences: string;
    cvAddExperience: string;
    cvAddEducation: string;
    cvAddLanguage: string;
    cvAddReference: string;
    cvPhotoUpload: string;
    cvPhotoRemove: string;
    publishModalTitle: string;
    publishModalDesc: string;
    publishSubmit: string;
    publishSuccess: string;
    footerCopy: string;
    footerNote: string;
    navAdminLogin: string;
    adminSignOut: string;
    adminDeleteNotice: string;
    adminSetupTitle: string;
    adminSetupDesc: string;
    adminLoginTitle: string;
    adminLoginDesc: string;
    adminPasswordLabel: string;
    adminConfirmLabel: string;
    adminSubmitSetup: string;
    adminSubmitLogin: string;
  }
> = {
  am: {
    brand: 'UN Bridge',
    navAnnouncements: 'ማስታወቂያዎች',
    navEducation: 'ትምህርት እና ስኮላርሺፕ',
    navCvStudio: 'ዓለም አቀፍ CV',
    navPublish: 'ማስታወቂያ አውጣ',
    navPrimaryCta: 'CV ይስሩ',
    heroKicker: 'የተባበሩት መንግስታት ድርጅት እድሎች እና ዓለም አቀፍ የስራ መዝገብ',
    heroTitle: 'የUN የትምህርትና የስራ ማስታወቂያዎች እና ዓለም አቀፍ CV መስሪያ',
    heroSubtitle:
      'ከUNDP፣ UNICEF፣ UNESCO፣ WHO፣ UNECA እና ሌሎች የUN ኤጀንሲዎች የሚወጡ የስራ ክፍት ቦታዎችን፣ ነፃ የትምህርት እድሎችን (Scholarships & Fellowships) ይከታተሉ፤ እንዲሁም የUN P11፣ Europass እና International Executive CVዎን እዚሁ አዘጋጅተው በPDF ያውርዱ።',
    heroPrimaryBtn: 'ማስታወቂያዎችን ይመልከቱ',
    heroSecondaryBtn: 'ዓለም አቀፍ CV ይጀምሩ',
    heroCaption: 'ምስል 1 — ዓለም አቀፍ የዲፕሎማሲ እና የልማት ተቋማት የትብብር ማዕከል',
    kpiJobsLabel: 'ንቁ የUN የስራ ማስታወቂያዎች',
    kpiEducationLabel: 'የትምህርትና ስኮላርሺፕ እድሎች',
    kpiAgenciesLabel: 'የተካተቱ የUN ኤጀንሲዎች',
    kpiDraftsLabel: 'የተቀመጡ የCV ረቂቆች',
    langToggleLabel: 'ቋንቋ',
    boardTitle: 'የUN የስራ እና የትምህርት ማስታወቂያዎች',
    boardSubtitle: 'በኤጀንሲ፣ በስራ ቦታ (Duty Station) እና በደረጃ በመለየት ወቅታዊ ማስታወቂያዎችን ይፈልጉ ወይም አዲስ ማስታወቂያ ያውጡ።',
    tabAll: 'ሁሉም',
    tabJobs: 'የUN ስራዎች',
    tabEducation: 'ትምህርት እና ስኮላርሺፕ',
    tabSaved: 'የተቀመጡ',
    searchPlaceholder: 'በርዕስ፣ በኤጀንሲ፣ በከተማ ወይም በመለያ ቁጥር ይፈልጉ...',
    filterAllAgencies: 'ሁሉም ኤጀንሲዎች',
    filterAllStations: 'ሁሉም ቦታዎች',
    publishButton: 'አዲስ ማስታወቂያ አውጣ',
    emptyTitle: 'ምንም ማስታወቂያ አልተገኘም',
    emptyDesc: 'የፍለጋ ቃሉን ወይም ማጣሪያዎቹን በመቀየር ሌሎች የUN እድሎችን ይመልከቱ።',
    resetFilters: 'ማጣሪያዎችን አጽዳ',
    loadingText: 'ማስታወቂያዎችን በመጫን ላይ...',
    deadlinePrefix: 'የመጨረሻ ቀን',
    refPrefix: 'መለያ',
    viewDetails: 'ዝርዝር ይመልከቱ',
    tailorCv: 'ለዚህ ማስታወቂያ CV አዘጋጅ',
    applyOfficial: 'በዋናው የUN ገጽ ያመልክቱ',
    saveBookmark: 'አስቀምጥ',
    savedBookmark: 'ተቀምጧል',
    responsibilitiesTitle: 'ዋና ተግባራት እና የፕሮግራም ይዘት',
    qualificationsTitle: 'ተፈላጊ የትምህርት ደረጃ እና ልምድ',
    competenciesTitle: 'የUN ዋና ብቃቶች (Core Competencies)',
    close: 'ዝጋ',
    editorialHighlightTitle: 'ለአዲስ አበባ እና ለዓለም አቀፍ አመልካቾች የተዘጋጀ መመሪያ',
    editorialHighlightSubtitle: 'የUNECA አዲስ አበባ የስራ መስፈርቶችን እና የUNESCO ስኮላርሺፕ መመዘኛዎችን መሠረት ያደረገ።',
    addisCampusTitle: 'የUNECA እና አህጉራዊ ቢሮዎች — አዲስ አበባ',
    addisCampusDesc:
      'ለNational Officer (NO-A/B/C) እና International Professional (P-2/P-3) ደረጃዎች የUN Core Competencies (Integrity, Professionalism, Respect for Diversity) በCVዎ ውስጥ በግልጽ መታየት አለባቸው።',
    scholarshipGuideTitle: 'ዓለም አቀፍ ስኮላርሺፕ እና ፌሎውሺፕ (Fellowships)',
    scholarshipGuideDesc:
      'ለUNESCO፣ UNU፣ WHO TDR እና IAEA የትምህርት እድሎች Europass ወይም Academic CV ቅጽን በመጠቀም የምርምር ርዕሶችን፣ ቋንቋዎችን እና የአካዳሚክ ውጤቶችን በትክክል ያደራጁ።',
    cvStudioTitle: 'ዓለም አቀፍ የCV መስሪያ ስቱዲዮ',
    cvStudioSubtitle:
      'በግራ በኩል መረጃዎን ሲያስገቡ በቀኝ በኩል ዓለም አቀፍ ደረጃውን የጠበቀ A4 CV በቀጥታ ይታያል። ሲጨርሱ በPDF ያትሙ።',
    cvTemplateLabel: 'የCV ቅጽ ይምረጡ',
    cvTplP11: 'UN P11 / Dossier ቅጽ',
    cvTplEuropass: 'Europass የትምህርት CV',
    cvTplExecutive: 'International Executive',
    cvLoadJobSample: 'የUN ስራ ናሙና ሙላ',
    cvLoadEduSample: 'የስኮላርሺፕ ናሙና ሙላ',
    cvClearSample: 'ባዶ አድርግ',
    cvSaveDraft: 'ረቂቅ አስቀምጥ',
    cvSavedStatus: 'ረቂቁ ተቀምጧል',
    cvPrintPdf: 'PDF አውርድ / አትም',
    cvExportJson: 'JSON ላክ',
    cvSectionPersonal: 'የግል መረጃ',
    cvSectionSummary: 'ማጠቃለያ / የዓላማ መግለጫ',
    cvSectionExperience: 'የስራ ልምድ',
    cvSectionEducation: 'የትምህርት ደረጃ',
    cvSectionLanguages: 'የቋንቋ ችሎታ',
    cvSectionSkills: 'ብቃቶች እና ክህሎቶች',
    cvSectionReferences: 'ዋቢዎች (References)',
    cvAddExperience: 'የስራ ልምድ ጨምር',
    cvAddEducation: 'ትምህርት ጨምር',
    cvAddLanguage: 'ቋንቋ ጨምር',
    cvAddReference: 'ዋቢ (Referee) ጨምር',
    cvPhotoUpload: 'ፎቶ አስገባ',
    cvPhotoRemove: 'ፎቶ አንሳ',
    publishModalTitle: 'አዲስ የUN ማስታወቂያ አውጣ',
    publishModalDesc: 'አዲስ የUN የስራ ክፍት ቦታ ወይም የትምህርት / ስኮላርሺፕ ማስታወቂያ ወደ ዝርዝሩ ያክሉ።',
    publishSubmit: 'ማስታወቂያውን አውጣ',
    publishSuccess: 'ማስታወቂያው በተሳካ ሁኔታ ወጥቷል።',
    footerCopy: 'UN Bridge — የተባበሩት መንግስታት የስራ እና የትምህርት መረጃ እና የዓለም አቀፍ CV መስሪያ መድረክ',
    footerNote: 'ማሳሰቢያ፡ ማመልከቻዎች ሁልጊዜ በዋናው የUN ኤጀንሲ ድረገጽ በኩል መላክ አለባቸው።',
    navAdminLogin: 'አድሚን',
    adminSignOut: 'ከአድሚን ውጣ',
    adminDeleteNotice: 'አጥፋ',
    adminSetupTitle: 'የአድሚን ይለፍ ቃል ያዘጋጁ (የመጀመሪያ ጊዜ)',
    adminSetupDesc: 'ማስታወቂያዎችን ማውጣትና ማስተዳደር የሚችለው አድሚን ብቻ እንዲሆን ቢያንስ 8 ፊደላት/ቁጥሮች ያለው የይለፍ ቃል ያስገቡ።',
    adminLoginTitle: 'የአድሚን መግቢያ',
    adminLoginDesc: 'አዲስ የUN ማስታወቂያ ለማውጣት ወይም ለማጥፋት የአድሚን የይለፍ ቃልዎን ያስገቡ።',
    adminPasswordLabel: 'የአድሚን የይለፍ ቃል',
    adminConfirmLabel: 'የይለፍ ቃል ያረጋግጡ',
    adminSubmitSetup: 'የአድሚን ቁልፍ አስቀምጥ',
    adminSubmitLogin: 'ግባ',
  },
  en: {
    brand: 'UN Bridge',
    navAnnouncements: 'Announcements',
    navEducation: 'Education & Grants',
    navCvStudio: 'International CV',
    navPublish: 'Publish Notice',
    navPrimaryCta: 'Build CV',
    heroKicker: 'United Nations Opportunities & International Dossier',
    heroTitle: 'UN Education & Job Announcements with Integrated International CV Studio',
    heroSubtitle:
      'Discover vetted vacancies, scholarships, and fellowships across UNDP, UNICEF, UNESCO, WHO, and UNECA—and build a print-ready UN P11, Europass, or International Executive CV right on the spot.',
    heroPrimaryBtn: 'Browse Announcements',
    heroSecondaryBtn: 'Open CV Studio',
    heroCaption: 'Fig. 1 — International multilateral conference and policy pavilion',
    kpiJobsLabel: 'Active UN Job Notices',
    kpiEducationLabel: 'Scholarships & Fellowships',
    kpiAgenciesLabel: 'UN System Agencies',
    kpiDraftsLabel: 'Saved CV Drafts',
    langToggleLabel: 'Language',
    boardTitle: 'UN Jobs & Education Board',
    boardSubtitle: 'Filter announcements by agency, duty station, or opportunity type, or publish a verified notice.',
    tabAll: 'All',
    tabJobs: 'UN Jobs',
    tabEducation: 'Education & Scholarships',
    tabSaved: 'Saved',
    searchPlaceholder: 'Search by title, agency, duty station, or reference code...',
    filterAllAgencies: 'All Agencies',
    filterAllStations: 'All Duty Stations',
    publishButton: 'Publish Notice',
    emptyTitle: 'No matching announcements',
    emptyDesc: 'Adjust your search keywords or clear active filters to view available UN opportunities.',
    resetFilters: 'Reset Filters',
    loadingText: 'Loading announcements...',
    deadlinePrefix: 'Deadline',
    refPrefix: 'Ref',
    viewDetails: 'View Details',
    tailorCv: 'Tailor CV for this Role',
    applyOfficial: 'Apply on Official UN Portal',
    saveBookmark: 'Save',
    savedBookmark: 'Saved',
    responsibilitiesTitle: 'Key Duties & Program Scope',
    qualificationsTitle: 'Required Education & Experience',
    competenciesTitle: 'UN Core Competencies',
    close: 'Close',
    editorialHighlightTitle: 'Guidance for Addis Ababa & Global Applicants',
    editorialHighlightSubtitle: 'Structured around UNECA duty station standards and UNESCO academic fellowship criteria.',
    addisCampusTitle: 'UNECA & Regional Hubs — Addis Ababa',
    addisCampusDesc:
      'For National Officer (NO-A/B/C) and International Professional (P-2/P-3) applications, ensure UN Core Competencies—Integrity, Professionalism, and Respect for Diversity—are explicitly demonstrated in your CV achievements.',
    scholarshipGuideTitle: 'International Scholarships & Fellowships',
    scholarshipGuideDesc:
      'For UNESCO, UNU, WHO TDR, and IAEA fellowships, use the Europass Academic format to highlight thesis research, language proficiency (CEFR), and international academic references.',
    cvStudioTitle: 'International CV Studio',
    cvStudioSubtitle:
      'Edit your credentials on the left while inspecting a live A4 international dossier on the right. Export directly to clean PDF.',
    cvTemplateLabel: 'CV Standard Format',
    cvTplP11: 'UN P11 / Competency Dossier',
    cvTplEuropass: 'Europass Academic CV',
    cvTplExecutive: 'International Executive',
    cvLoadJobSample: 'Load UN Job Sample',
    cvLoadEduSample: 'Load Scholarship Sample',
    cvClearSample: 'Clear Fields',
    cvSaveDraft: 'Save Draft',
    cvSavedStatus: 'Draft Saved',
    cvPrintPdf: 'Print / Export PDF',
    cvExportJson: 'Export JSON',
    cvSectionPersonal: 'Personal Details',
    cvSectionSummary: 'Summary / Statement',
    cvSectionExperience: 'Work History',
    cvSectionEducation: 'Education',
    cvSectionLanguages: 'Languages',
    cvSectionSkills: 'Competencies & Skills',
    cvSectionReferences: 'References',
    cvAddExperience: 'Add Experience',
    cvAddEducation: 'Add Education',
    cvAddLanguage: 'Add Language',
    cvAddReference: 'Add Referee',
    cvPhotoUpload: 'Upload Photo',
    cvPhotoRemove: 'Remove Photo',
    publishModalTitle: 'Publish UN Announcement',
    publishModalDesc: 'Post a new United Nations job vacancy or education scholarship announcement to the live board.',
    publishSubmit: 'Publish Announcement',
    publishSuccess: 'Announcement published successfully.',
    footerCopy: 'UN Bridge — United Nations Jobs, Scholarships & International CV Studio',
    footerNote: 'Note: Official applications must always be submitted via the designated UN agency portal.',
    navAdminLogin: 'Admin',
    adminSignOut: 'Admin Sign Out',
    adminDeleteNotice: 'Delete',
    adminSetupTitle: 'Set Initial Admin Password',
    adminSetupDesc: 'Create a password (min. 8 characters) to lock publishing and moderation to administrators only.',
    adminLoginTitle: 'Admin Sign In',
    adminLoginDesc: 'Enter your administrator password to publish or remove UN announcements.',
    adminPasswordLabel: 'Admin Password',
    adminConfirmLabel: 'Confirm Password',
    adminSubmitSetup: 'Save Admin Password',
    adminSubmitLogin: 'Sign In',
  },
};
