import { ApiErrorSchema } from '@leafy/shared';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { HttpError, parseJson, route, toErrorResponse } from './http';

const ctx = { params: Promise.resolve({}) };

describe('toErrorResponse', () => {
  it('maps HttpError to its status and envelope', async () => {
    const res = toErrorResponse(new HttpError('forbidden', 'Not your plant'));
    expect(res.status).toBe(403);
    const body = ApiErrorSchema.parse(await res.json());
    expect(body.error).toEqual({ code: 'forbidden', message: 'Not your plant' });
  });

  it('maps ZodError to 400 validation_failed with details', async () => {
    const err = z.object({ name: z.string() }).safeParse({ name: 1 }).error;
    const res = toErrorResponse(err);
    expect(res.status).toBe(400);
    const body = ApiErrorSchema.parse(await res.json());
    expect(body.error.code).toBe('validation_failed');
    expect(body.error.details).toBeDefined();
  });

  it('hides unknown errors behind internal_error', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = toErrorResponse(new Error('db password is hunter2'));
    expect(res.status).toBe(500);
    const body = ApiErrorSchema.parse(await res.json());
    expect(body.error.message).not.toContain('hunter2');
    spy.mockRestore();
  });
});

describe('route()', () => {
  it('passes through successful responses', async () => {
    const handler = route(() => Response.json({ ok: true }));
    const res = await handler(new Request('http://x/api/t'), ctx);
    expect(res.status).toBe(200);
  });

  it('catches thrown errors', async () => {
    const handler = route(() => {
      throw new HttpError('not_found', 'Missing');
    });
    const res = await handler(new Request('http://x/api/t'), ctx);
    expect(res.status).toBe(404);
  });
});

describe('parseJson', () => {
  const Body = z.object({ nickname: z.string().min(1) });

  it('validates the body', async () => {
    const req = new Request('http://x', {
      method: 'POST',
      body: JSON.stringify({ nickname: 'Tommy' }),
    });
    await expect(parseJson(req, Body)).resolves.toEqual({ nickname: 'Tommy' });
  });

  it('rejects malformed JSON with bad_request', async () => {
    const req = new Request('http://x', { method: 'POST', body: '{nope' });
    await expect(parseJson(req, Body)).rejects.toMatchObject({ code: 'bad_request' });
  });
});
