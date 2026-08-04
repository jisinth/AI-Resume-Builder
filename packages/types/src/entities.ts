import type {
  ApplicationStatus,
  AuthProvider,
  ProficiencyLevel,
  ResumeTemplateSlug,
  SubscriptionPlan,
} from './enums';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  headline: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  summary: string | null;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  bullets: string[];
  order: number;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string | null;
  bullets: string[];
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  level: ProficiencyLevel | null;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  order: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string | null;
  expiryDate: string | null;
  credentialUrl: string | null;
  order: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateSlug: ResumeTemplateSlug;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  achievements: Achievement[];
  certificates: Certificate[];
  atsScore: number | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  label: string;
  snapshot: Resume;
  createdAt: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  resumeId: string | null;
  jobTitle: string;
  companyName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkedInProfile {
  id: string;
  userId: string;
  headline: string;
  about: string;
  experience: string;
  skills: string[];
  featured: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  resumeId: string | null;
  company: string;
  role: string;
  jobUrl: string | null;
  status: ApplicationStatus;
  appliedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  slug: ResumeTemplateSlug;
  name: string;
  description: string;
  isPremium: boolean;
  previewUrl: string | null;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  currentPeriodEnd: string | null;
  createdAt: string;
}
