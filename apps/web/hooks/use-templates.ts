'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-client';

export interface ResumeTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  isPremium: boolean;
  previewUrl: string | null;
}

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => apiFetch<ResumeTemplate[]>('/templates'),
  });
}
