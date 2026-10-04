import { APP_NAME, type HealthResponse } from '@leafy/shared';

import { env } from '@/lib/env';
import { json, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = route(() => {
  const body: HealthResponse = {
    status: 'ok',
    service: `${APP_NAME.toLowerCase()}-api`,
    version: env().GIT_COMMIT_SHA?.slice(0, 7) ?? 'dev',
    time: new Date().toISOString(),
  };
  return json(body, { headers: { 'Cache-Control': 'no-store' } });
});
