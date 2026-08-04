export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  TEAM = 'TEAM',
}

export enum ResumeTemplateSlug {
  MODERN = 'modern',
  MINIMAL = 'minimal',
  CORPORATE = 'corporate',
  ATS_FRIENDLY = 'ats-friendly',
}

export enum ApplicationStatus {
  WISHLIST = 'WISHLIST',
  APPLIED = 'APPLIED',
  INTERVIEW = 'INTERVIEW',
  OFFER = 'OFFER',
  REJECTED = 'REJECTED',
}

export enum ProficiencyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum AiProviderId {
  MOCK = 'mock',
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
  DEEPSEEK = 'deepseek',
}

export enum AiTaskType {
  REWRITE_BULLET = 'REWRITE_BULLET',
  REWRITE_SUMMARY = 'REWRITE_SUMMARY',
  ATS_SCORE = 'ATS_SCORE',
  COVER_LETTER = 'COVER_LETTER',
  LINKEDIN_OPTIMIZE = 'LINKEDIN_OPTIMIZE',
  RESUME_SUGGESTIONS = 'RESUME_SUGGESTIONS',
}

export enum ExportFormat {
  PDF = 'PDF',
  DOCX = 'DOCX',
  HTML = 'HTML',
  MARKDOWN = 'MARKDOWN',
  JSON = 'JSON',
}
