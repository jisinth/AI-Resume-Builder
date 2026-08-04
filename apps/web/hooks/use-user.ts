'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AiProviderId } from '@ai-resume-builder/types';
import { apiFetch } from '@/lib/api-client';

export interface AiSettings {
  preferredProvider: AiProviderId;
  hasOpenaiKey: boolean;
  hasAnthropicKey: boolean;
  hasGeminiKey: boolean;
  hasDeepseekKey: boolean;
}

export interface UpdateAiSettingsInput {
  preferredProvider?: AiProviderId;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  deepseekApiKey?: string;
}

export function useAiSettings() {
  return useQuery({
    queryKey: ['ai-settings'],
    queryFn: () => apiFetch<AiSettings>('/users/me/ai-settings'),
  });
}

export function useUpdateAiSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAiSettingsInput) =>
      apiFetch<AiSettings>('/users/me/ai-settings', { method: 'PUT', body: input }),
    onSuccess: (data) => queryClient.setQueryData(['ai-settings'], data),
  });
}
