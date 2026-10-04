import { ApiErrorSchema, type ApiErrorCode } from '@leafy/shared';
import type { z } from 'zod';

/**
 * Base URL of apps/api. Only EXPO_PUBLIC_* vars are inlined into the bundle,
 * and the app never holds AI or storage keys — all of that is server-side.
 */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export class ApiClientError extends Error {
  constructor(
    readonly code: ApiErrorCode | 'network_error' | 'invalid_response',
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

interface ApiRequest<S extends z.ZodType> {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Response schema; the payload is validated before it reaches the UI. */
  schema: S;
  signal?: AbortSignal;
  /** Auth header provider — wired up in Phase 2. */
  token?: string | null;
}

export async function apiFetch<S extends z.ZodType>(
  path: string,
  { method = 'GET', body, schema, signal, token }: ApiRequest<S>,
): Promise<z.infer<S>> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new ApiClientError('network_error', 'Network request failed', 0);
  }

  const payload: unknown = await res.json().catch(() => undefined);

  if (!res.ok) {
    const parsed = ApiErrorSchema.safeParse(payload);
    if (parsed.success) {
      throw new ApiClientError(parsed.data.error.code, parsed.data.error.message, res.status);
    }
    throw new ApiClientError('internal_error', `Request failed (${res.status})`, res.status);
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new ApiClientError('invalid_response', 'Unexpected response from server', res.status);
  }
  return parsed.data;
}
