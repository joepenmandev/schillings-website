const REALM = 'Protected Site';

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
