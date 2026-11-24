export type Language = 'am' | 'en';

export type OpportunityCategory = 'job' | 'education';

export type UNAgency =
  | 'UNDP'
  | 'UNICEF'
  | 'UNESCO'
  | 'WHO'
  | 'UNHCR'
  | 'WFP'
  | 'UNECA'
  | 'FAO'
  | 'UN-Habitat'
  | 'ITU';

export interface Opportunity {
  id: string;
  category: OpportunityCategory;
  agency: UNAgency;
  title: string;
  titleAm: string;
  dutyStation: string;
  gradeOrLevel: string;
  contractOrFunding: string;
  deadline: string; // YYYY-MM-DD
  postedAt: string; // YYYY-MM-DD
  summary: string;
  summaryAm: string;
  responsibilities: string[];
  qualifications: string[];
  competencies: string[];
  officialUrl: string;
  referenceCode: string;
}

export type CVTemplateId = 'un-p11' | 'europass' | 'executive';

export interface CVPersonalInfo {
  fullName: string;
  targetTitle: string;
  nationality: string;
  secondNationality: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  photoDataUrl: string;
}

export interface CVExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  supervisorName: string;
  achievements: string[];
}

export interface CVEducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  country: string;
  startYear: string;
  endYear: string;
  honorsOrThesis: string;
}

export interface CVLanguageItem {
  id: string;
  language: string;
  speaking: 'Mother Tongue' | 'Fluent (C2/C1)' | 'Intermediate (B2/B1)' | 'Basic (A2/A1)';
  reading: 'Mother Tongue' | 'Fluent (C2/C1)' | 'Intermediate (B2/B1)' | 'Basic (A2/A1)';
  writing: 'Mother Tongue' | 'Fluent (C2/C1)' | 'Intermediate (B2/B1)' | 'Basic (A2/A1)';
}

export interface CVReferenceItem {
  id: string;
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
}

export interface CVData {
  id: string;
  name: string;
  template: CVTemplateId;
  updatedAt: string;
  personal: CVPersonalInfo;
  summary: string;
  experiences: CVExperienceItem[];
  education: CVEducationItem[];
  languages: CVLanguageItem[];
  competencies: string[];
  technicalSkills: string[];
  publicationsOrAwards: string[];
  references: CVReferenceItem[];
}
