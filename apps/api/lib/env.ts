import { z } from 'zod';

/**
 * Server environment, validated once on first access.
 *
 * Everything is optional at parse time so that `next build` and route handlers
 * that don't need a given secret keep working; call `requireEnv()` at the point
 * of use to fail loudly with a clear message when a needed value is missing.
 */
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),

  AI_PROVIDER: z.enum(['mock', 'runware']).default('mock'),
  RUNWARE_API_KEY: z.string().min(1).optional(),

  DATABASE_URL: z.url().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),

  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_URL: z.url().optional(),

  CRON_SECRET: z.string().min(16).optional(),
  EXPO_ACCESS_TOKEN: z.string().min(1).optional(),
  SENTRY_DSN: z.url().optional(),
});

export type ServerEnv = z.infer<typeof EnvSchema>;

let cached: ServerEnv | undefined;

/** Treat empty strings (as copied from `.env.example`) as unset. */
function normalize(source: NodeJS.ProcessEnv): Record<string, string> {
  return Object.fromEntries(
    Object.entries(source).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}

export function env(): ServerEnv {
  if (!cached) {
    const parsed = EnvSchema.safeParse(normalize(process.env));
    if (!parsed.success) {
      const fields = parsed.error.issues.map((i) => i.path.join('.')).join(', ');
      throw new Error(`Invalid server environment variables: ${fields}`);
    }
    cached = parsed.data;
  }
  return cached;
}

/** Returns a required env value or throws a descriptive configuration error. */
export function requireEnv<K extends keyof ServerEnv>(key: K): NonNullable<ServerEnv[K]> {
  const value = env()[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required environment variable ${String(key)}`);
  }
  return value as NonNullable<ServerEnv[K]>;
}

/** Test helper: forget the cached env so a test can set process.env again. */
export function resetEnvCache(): void {
  cached = undefined;
}
