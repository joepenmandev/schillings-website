const REALM = 'Protected Site';

/** True when Vercel/dashboard value means “turn off Basic Auth” (trims whitespace; common truthy tokens). */
export function isBasicAuthDisabledEnvValue(raw: string | undefined): boolean {
  const s = raw?.trim().toLowerCase() ?? '';
  return s === '1' || s === 'true' || s === 'yes' || s === 'on';
}

/**
 * When `DISABLE_SITE_BASIC_AUTH` is truthy (see `isBasicAuthDisabledEnvValue`), Basic Auth is skipped everywhere
 * (Astro middleware + `api/contact`). Use on Vercel for a short-lived open window on staging, then remove.
 *
 * When `BASIC_AUTH_HOSTS` is set to a comma-separated list of hostnames, Basic Auth applies **only** to
 * those hosts (exact match, case-insensitive). Staging on `*.vercel.app` can stay open while production
 * apex/`www` stays gated — without unsetting `SITE_USER` / `SITE_PASS`.
 */
export function shouldApplySiteBasicAuthForRequest(request: Request): boolean {
  if (isBasicAuthDisabledEnvValue(process.env.DISABLE_SITE_BASIC_AUTH)) {
    return false;
  }

  const listRaw = process.env.BASIC_AUTH_HOSTS?.trim() ?? '';
  if (listRaw === '') {
    return true;
  }

  const allowed = listRaw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) {
    return true;
  }

  const host = new URL(request.url).hostname.toLowerCase();
  return allowed.some((h) => host === h);
}

function unauthorizedResponse(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

function decodeBasicCredentials(authHeader: string) {
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Basic' || !token) return null;
  try {
    const decoded = atob(token);
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

/**
 * Same rules as `src/middleware.ts`, for handlers that do not run through Astro middleware
 * (e.g. `api/*.ts` on Vercel Edge). Uses `process.env` only.
 */
export function gateSiteBasicAuth(request: Request): Response | null {
  if (!shouldApplySiteBasicAuthForRequest(request)) {
    return null;
  }

  const expectedUser = process.env.SITE_USER;
  const expectedPass = process.env.SITE_PASS;
  if (!expectedUser || !expectedPass) {
    return null;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return unauthorizedResponse();
  }

  const provided = decodeBasicCredentials(authHeader);
  if (!provided || provided.username !== expectedUser || provided.password !== expectedPass) {
    return unauthorizedResponse();
  }

  return null;
}
