import type { AiProviderId, AiTaskType } from './enums';

export interface AiRewriteRequest {
  task: AiTaskType.REWRITE_BULLET | AiTaskType.REWRITE_SUMMARY;
  text: string;
  context?: {
    jobTitle?: string;
    targetRole?: string;
  };
}

export interface AiRewriteResponse {
  original: string;
  rewritten: string;
  changes: string[];
}

export interface AtsScoreRequest {
  resumeText: string;
  jobDescription: string;
}

export interface AtsScoreBreakdown {
  overall: number;
  formatting: number;
  keywords: number;
  experience: number;
  skills: number;
}

export interface AtsScoreResponse {
  score: AtsScoreBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export interface CoverLetterRequest {
  resumeText: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  tone?: 'professional' | 'enthusiastic' | 'concise';
}

export interface CoverLetterResponse {
  content: string;
}

export interface LinkedInOptimizeRequest {
  resumeText: string;
  targetRole?: string;
}

export interface LinkedInOptimizeResponse {
  headline: string;
  about: string;
  experienceSummary: string;
  skills: string[];
  featuredSuggestions: string[];
}

export interface ResumeSuggestion {
  section: string;
  itemId: string | null;
  severity: 'low' | 'medium' | 'high';
  issue: string;
  suggestion: string;
}

export interface ResumeSuggestionsResponse {
  suggestions: ResumeSuggestion[];
}

export interface AiProviderConfig {
  provider: AiProviderId;
  apiKey?: string;
  model?: string;
}
