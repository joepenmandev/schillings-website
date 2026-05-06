import type { APIContext } from 'astro';
import { defineMiddleware } from 'astro:middleware';

const REALM = 'Protected Site';

function unauthorizedResponse() {
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

function readSecret(context: APIContext, key: 'SITE_USER' | 'SITE_PASS') {
  // 1) Build-time/private env (works in many server adapters).
  const fromAstroEnv = import.meta.env[key];
  if (typeof fromAstroEnv === 'string' && fromAstroEnv.length > 0) return fromAstroEnv;

  // 2) Node/serverless runtime env.
  const fromProcess = typeof process !== 'undefined' ? process.env[key] : undefined;
  if (typeof fromProcess === 'string' && fromProcess.length > 0) return fromProcess;

  // 3) Adapter runtime env bag (edge-style runtimes expose env here).
  const runtimeEnv = (context.locals as Record<string, unknown>)?.runtime as
    | { env?: Record<string, string | undefined> }
    | undefined;
  const fromRuntime = runtimeEnv?.env?.[key];
  if (typeof fromRuntime === 'string' && fromRuntime.length > 0) return fromRuntime;

  return undefined;
}

export const onRequest = defineMiddleware(async (context, next) => {
  return new Response('middleware reached', { status: 401 });
});
