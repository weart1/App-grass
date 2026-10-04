import { errorResponse } from '@/lib/http';

/**
 * Catch-all for unknown `/api/*` paths so clients always receive the standard
 * JSON error envelope instead of Next's HTML 404 page. Specific routes always
 * take precedence over this catch-all.
 */
export const runtime = 'nodejs';

function notFound(req: Request) {
  const { pathname } = new URL(req.url);
  return errorResponse('not_found', `No route for ${req.method} ${pathname}`);
}

export {
  notFound as GET,
  notFound as POST,
  notFound as PUT,
  notFound as PATCH,
  notFound as DELETE,
};
