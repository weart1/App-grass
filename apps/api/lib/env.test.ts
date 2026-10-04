import { afterEach, describe, expect, it, vi } from 'vitest';

import { env, requireEnv, resetEnvCache } from './env';

afterEach(() => {
  vi.unstubAllEnvs();
  resetEnvCache();
});

describe('env', () => {
  it('defaults AI_PROVIDER to mock and treats empty strings as unset', () => {
    vi.stubEnv('AI_PROVIDER', '');
    vi.stubEnv('RUNWARE_API_KEY', '');
    expect(env().AI_PROVIDER).toBe('mock');
    expect(env().RUNWARE_API_KEY).toBeUndefined();
  });

  it('requireEnv throws a descriptive error for missing values', () => {
    vi.stubEnv('CRON_SECRET', '');
    expect(() => requireEnv('CRON_SECRET')).toThrow(/CRON_SECRET/);
  });

  it('rejects malformed values', () => {
    vi.stubEnv('DATABASE_URL', 'not a url');
    expect(() => env()).toThrow(/DATABASE_URL/);
  });
});
