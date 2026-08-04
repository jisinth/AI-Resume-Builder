'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DashboardStats, Resume } from '@ai-resume-builder/types';
import type { ResumeFormValues } from '@ai-resume-builder/utils';
import { apiFetch } from '@/lib/api-client';

const RESUMES_KEY = ['resumes'] as const;

export function useResumes() {
  return useQuery({
    queryKey: RESUMES_KEY,
    queryFn: () => apiFetch<Resume[]>('/resumes'),
  });
}

export function useResume(id: string | undefined) {
  return useQuery({
    queryKey: [...RESUMES_KEY, id],
    queryFn: () => apiFetch<Resume>(`/resumes/${id}`),
    enabled: Boolean(id),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: [...RESUMES_KEY, 'stats', 'dashboard'],
    queryFn: () => apiFetch<DashboardStats>('/resumes/stats/dashboard'),
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ResumeFormValues) =>
      apiFetch<Resume>('/resumes', { method: 'POST', body: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESUMES_KEY }),
  });
}

export function useUpdateResume(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<ResumeFormValues>) =>
      apiFetch<Resume>(`/resumes/${id}`, { method: 'PATCH', body: input }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
      queryClient.setQueryData([...RESUMES_KEY, id], data);
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/resumes/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESUMES_KEY }),
  });
}

export function useDuplicateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<Resume>(`/resumes/${id}/duplicate`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RESUMES_KEY }),
  });
}

export function useExportPdfUrl(id: string) {
  return async () => {
    const blob = await apiFetch<Blob>(`/resumes/${id}/export/pdf`, { responseType: 'blob' });
    return URL.createObjectURL(blob);
  };
}
