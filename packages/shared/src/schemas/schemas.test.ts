import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { APP_NAME } from '../constants/brand';
import { ApiErrorSchema, CursorQuerySchema, paginatedSchema } from './api';
import { SAFETY_LEVELS, SafetyLevelSchema, UsefulnessTagSchema } from './enums';

describe('enums', () => {
  it('orders safety levels from safest to most dangerous', () => {
    expect(SAFETY_LEVELS).toEqual(['safe', 'low', 'moderate', 'high', 'severe']);
  });

  it('rejects unknown values', () => {
    expect(SafetyLevelSchema.safeParse('deadly').success).toBe(false);
    expect(UsefulnessTagSchema.safeParse('edible').success).toBe(true);
  });
});

describe('api envelopes', () => {
  it('parses the error envelope', () => {
    const parsed = ApiErrorSchema.parse({ error: { code: 'not_found', message: 'Nope' } });
    expect(parsed.error.code).toBe('not_found');
    expect(ApiErrorSchema.safeParse({ error: { code: 'teapot', message: 'x' } }).success).toBe(
      false,
    );
  });

  it('builds paginated schemas', () => {
    const Page = paginatedSchema(z.object({ id: z.string() }));
    expect(Page.parse({ items: [{ id: 'a' }], nextCursor: null }).items).toHaveLength(1);
    expect(Page.safeParse({ items: [{ id: 1 }], nextCursor: null }).success).toBe(false);
  });

  it('coerces and bounds cursor query params', () => {
    expect(CursorQuerySchema.parse({}).limit).toBe(20);
    expect(CursorQuerySchema.parse({ limit: '5' }).limit).toBe(5);
    expect(CursorQuerySchema.safeParse({ limit: '500' }).success).toBe(false);
  });
});

describe('brand', () => {
  it('exposes the app name from brand.json', () => {
    expect(APP_NAME).toBe('Leafy');
  });
});
