#!/usr/bin/env node
/**
 * Verify indexing controls on a deployed environment.
 *
 * Usage (default = non-production expectations):
 *   INDEXING_VERIFY_URL="https://preview.example.vercel.app" npm run verify:nonprod-indexing
 *
 * Optional mode:
 *   INDEXING_VERIFY_MODE=prod INDEXING_VERIFY_URL="https://schillingspartners.com" npm run verify:nonprod-indexing
 */

const origin = (process.env.INDEXING_VERIFY_URL ?? '').trim().replace(/\/+$/, '');
const mode = (process.env.INDEXING_VERIFY_MODE ?? 'nonprod').trim().toLowerCase();

if (!origin) {
  console.log('verify-nonprod-indexing: skip (set INDEXING_VERIFY_URL=https://...)');
  process.exit(0);
}

if (!['nonprod', 'prod'].includes(mode)) {
  console.error(`verify-nonprod-indexing: invalid INDEXING_VERIFY_MODE="${mode}" (use nonprod|prod)`);
  process.exit(1);
}

const ua = { 'user-agent': 'schillings-indexing-verify/1.0' };

async function get(path) {
  const res = await fetch(origin + path, { redirect: 'follow', headers: ua });
  const text = await res.text().catch(() => '');
  return { res, text, finalUrl: res.url };
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function hasNoindex(headerValue) {
  return /\bnoindex\b/i.test(headerValue);
}

function hasDisallowAll(text) {
  return /User-agent:\s*\*/i.test(text) && /Disallow:\s*\/\s*$/im.test(text);
}

function isDnsLookupError(err) {
  const msg = String(err);
  return /ENOTFOUND|fetch failed|getaddrinfo/i.test(msg);
}

let home;
try {
  home = await get('/');
} catch (err) {
  if (isDnsLookupError(err)) {
    fail(
      `verify-nonprod-indexing: cannot resolve host for INDEXING_VERIFY_URL="${origin}". ` +
        'Use a real deployed URL (do not use placeholder text).',
    );
  }
  throw err;
}
const isProtected = [401, 403].includes(home.res.status);

if (mode === 'nonprod' && isProtected) {
  console.log(`verify-nonprod-indexing: OK (nonprod protected deployment, status ${home.res.status})`, origin);
  process.exit(0);
}

if (home.res.status < 200 || home.res.status >= 400) {
  fail(`verify-nonprod-indexing: GET / expected 2xx/3xx, got ${home.res.status}`);
}

const robots = await get('/robots.txt');
if (robots.res.status !== 200) {
  fail(`verify-nonprod-indexing: GET /robots.txt expected 200, got ${robots.res.status}`);
}

const xRobots = home.res.headers.get('x-robots-tag') ?? '';
const noindex = hasNoindex(xRobots);
const disallowAll = hasDisallowAll(robots.text);

if (mode === 'nonprod') {
  if (!noindex) {
    fail(`verify-nonprod-indexing: expected noindex header on nonprod, got "${xRobots || '(missing)'}"`);
  }
  if (!disallowAll) {
    fail(
      `verify-nonprod-indexing: expected robots.txt to disallow all on nonprod (final URL: ${robots.finalUrl})`,
    );
  }
  console.log('verify-nonprod-indexing: OK (nonprod)', origin);
  process.exit(0);
}

// prod mode
if (noindex) {
  fail(`verify-nonprod-indexing: unexpected noindex header on prod, got "${xRobots}"`);
}
if (disallowAll) {
  fail('verify-nonprod-indexing: robots.txt unexpectedly disallows all on prod');
}
console.log('verify-nonprod-indexing: OK (prod)', origin);
