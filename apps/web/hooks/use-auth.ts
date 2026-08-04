'use client';

import { useMutation } from '@tanstack/react-query';
import type { AuthTokens } from '@ai-resume-builder/types';
import { apiFetch } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import type { AuthenticatedUserLike } from '@/lib/types';

interface AuthResponse {
  user: AuthenticatedUserLike;
  tokens: AuthTokens;
}

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: input, skipAuth: true }),
    onSuccess: (data) => {
      setSession({ ...data.tokens, user: data.user });
    },
  });
}

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: { email: string; password: string }) =>
      apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: input, skipAuth: true }),
    onSuccess: (data) => {
      setSession({ ...data.tokens, user: data.user });
    },
  });
}

export function useLogout() {
  const clearSession = useAuthStore((state) => state.clearSession);

  return useMutation({
    mutationFn: () => apiFetch<void>('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      clearSession();
    },
  });
}
