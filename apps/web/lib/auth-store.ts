import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthenticatedUserLike } from './types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthenticatedUserLike | null;
  setSession: (session: {
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUserLike;
  }) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: 'ai-resume-builder-auth' },
  ),
);
