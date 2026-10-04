import type { ApiError, ApiErrorCode } from '@leafy/shared';
import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  bad_request: 400,
  validation_failed: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  conflict: 409,
  payload_too_large: 413,
  unsupported_media_type: 415,
  rate_limited: 429,
  internal_error: 500,
  ai_invalid_response: 502,
  ai_unavailable: 503,
};

/** Throw from anywhere in a handler to return a typed error response. */
export class HttpError extends Error {
  readonly status: number;

  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = STATUS_BY_CODE[code];
  }
}

export function json<T>(data: T, init?: ResponseInit): NextResponse<T> {
  return NextResponse.json(data, init);
}

export function errorResponse(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
  headers?: HeadersInit,
): NextResponse<ApiError> {
  const body: ApiError = {
    error: { code, message, ...(details === undefined ? {} : { details }) },
  };
  return NextResponse.json(body, { status: STATUS_BY_CODE[code], headers });
}

/** Maps any thrown value to the consistent `{ error: { code, message } }` shape. */
export function toErrorResponse(err: unknown): NextResponse<ApiError> {
  if (err instanceof HttpError) {
    return errorResponse(err.code, err.message, err.details);
  }
  if (err instanceof ZodError) {
    return errorResponse('validation_failed', 'Request validation failed', z.flattenError(err));
  }
  console.error('[api] unhandled error', err);
  return errorResponse('internal_error', 'Something went wrong. Please try again.');
}

type RouteContext<P> = { params: Promise<P> };
type Handler<P> = (req: Request, ctx: RouteContext<P>) => Promise<Response> | Response;

/**
 * Wraps a route handler so thrown `HttpError`s / `ZodError`s / unknown errors
 * are converted into the standard error envelope.
 */
export function route<P = Record<string, never>>(handler: Handler<P>): Handler<P> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      return toErrorResponse(err);
    }
  };
}

/** Parses and validates a JSON body with a Zod schema. */
export async function parseJson<S extends z.ZodType>(req: Request, schema: S): Promise<z.infer<S>> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new HttpError('bad_request', 'Request body must be valid JSON');
  }
  return schema.parse(body);
}

/** Parses and validates URL search params with a Zod schema. */
export function parseQuery<S extends z.ZodType>(req: Request, schema: S): z.infer<S> {
  const params = Object.fromEntries(new URL(req.url).searchParams.entries());
  return schema.parse(params);
}
