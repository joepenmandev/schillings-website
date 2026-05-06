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

export const onRequest = defineMiddleware(async (context, next) => {
  // Keep local/staging development friction-free; gate production when credentials are configured.
  if (!import.meta.env.PROD) {
    return next();
  }

  const expectedUser = process.env.SITE_USER;
  const expectedPass = process.env.SITE_PASS;
  if (!expectedUser || !expectedPass) {
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
