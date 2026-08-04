'use client';

import { useMutation } from '@tanstack/react-query';
import type {
  AiRewriteRequest,
  AiRewriteResponse,
  AtsScoreResponse,
  ResumeSuggestionsResponse,
} from '@ai-resume-builder/types';
import { apiFetch } from '@/lib/api-client';

export function useRewrite() {
  return useMutation({
    mutationFn: (input: AiRewriteRequest) =>
      apiFetch<AiRewriteResponse>('/ai/rewrite', { method: 'POST', body: input }),
  });
}

export function useAtsScore() {
  return useMutation({
    mutationFn: (input: { resumeId: string; jobDescription: string }) =>
      apiFetch<AtsScoreResponse>('/ai/ats-score', { method: 'POST', body: input }),
  });
}

export function useSuggestions() {
  return useMutation({
    mutationFn: (input: { resumeId: string }) =>
      apiFetch<ResumeSuggestionsResponse>('/ai/suggestions', { method: 'POST', body: input }),
  });
}
