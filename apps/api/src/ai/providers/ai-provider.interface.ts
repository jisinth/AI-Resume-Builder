import type {
  AiRewriteRequest,
  AiRewriteResponse,
  AtsScoreResponse,
  ResumeSuggestionsResponse,
} from '@ai-resume-builder/types';

export interface AiProvider {
  readonly id: string;
  rewrite(request: AiRewriteRequest): Promise<AiRewriteResponse>;
  atsScore(resumeText: string, jobDescription: string): Promise<AtsScoreResponse>;
  suggestions(resumeText: string): Promise<ResumeSuggestionsResponse>;
}

export interface AiProviderCredentials {
  apiKey?: string;
  model?: string;
}
