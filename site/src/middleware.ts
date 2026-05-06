import type { APIContext } from 'astro';
import { defineMiddleware } from 'astro:middleware';
import {
  isBasicAuthDisabledEnvValue,
  shouldApplySiteBasicAuthForRequest,
} from './lib/site-basic-auth-gate';

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

/** Same lookup paths as secrets; used so `DISABLE_SITE_BASIC_AUTH` is visible even if only in adapter `runtime.env`. */
function readDisableBasicAuthFlag(context: APIContext): string | undefined {
  const key = 'DISABLE_SITE_BASIC_AUTH';
  const fromAstroEnv = (import.meta.env as Record<string, string | undefined>)[key];
  if (typeof fromAstroEnv === 'string' && fromAstroEnv.length > 0) return fromAstroEnv;
  const fromProcess = typeof process !== 'undefined' ? process.env[key] : undefined;
  if (typeof fromProcess === 'string' && fromProcess.length > 0) return fromProcess;
  const runtimeEnv = (context.locals as Record<string, unknown>)?.runtime as
    | { env?: Record<string, string | undefined> }
    | undefined;
  const fromRuntime = runtimeEnv?.env?.[key];
  if (typeof fromRuntime === 'string' && fromRuntime.length > 0) return fromRuntime;
  return undefined;
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Keep local/staging development friction-free; gate production when credentials are configured.
  if (!import.meta.env.PROD) {
    return next();
  }

  if (isBasicAuthDisabledEnvValue(readDisableBasicAuthFlag(context))) {
    return next();
  }

  // Read private env vars across node/serverless/edge runtime styles.
  const expectedUser = readSecret(context, 'SITE_USER');
  const expectedPass = readSecret(context, 'SITE_PASS');
  if (!expectedUser || !expectedPass) {
    return next();
  }

  if (!shouldApplySiteBasicAuthForRequest(context.request)) {
    return next();
  }

  const authHeader = context.request.headers.get('authorization');
  if (!authHeader) {
    return unauthorizedResponse();
  }

  const provided = decodeBasicCredentials(authHeader);
  if (!provided || provided.username !== expectedUser || provided.password !== expectedPass) {
    return unauthorizedResponse();
  }

  return next();
});
