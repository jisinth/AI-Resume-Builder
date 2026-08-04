import type { ApiErrorBody } from '@ai-resume-builder/types';
import { useAuthStore } from './auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { refreshToken, user, setSession, clearSession } = useAuthStore.getState();
  if (!refreshToken || !user) return null;

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearSession();
    return null;
  }

  const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
  setSession({ ...tokens, user });
  return tokens.accessToken;
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
  responseType?: 'json' | 'blob';
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, skipAuth, responseType = 'json', headers, ...rest } = options;

  async function send(): Promise<Response> {
    const token = skipAuth ? null : useAuthStore.getState().accessToken;
    return fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  let response = await send();

  if (response.status === 401 && !skipAuth) {
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const newToken = await refreshPromise;
    if (newToken) {
      response = await send();
    }
  }

  if (!response.ok) {
    const errorBody = (await safeJson<ApiErrorBody>(response)) ?? null;
    throw new ApiError(response.status, errorBody?.message ?? response.statusText);
  }

  if (response.status === 204) return undefined as T;
  if (responseType === 'blob') return (await response.blob()) as T;
  return (await response.json()) as T;
}

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}
