#!/usr/bin/env node
/**
 * Tier 1 — Optional live / preview URL audit (needs network).
 * Set LAUNCH_VERIFY_URL to origin only, e.g. https://www.example.com or https://preview.vercel.app
 *
 * Checks: GET / 200, GET /contact/ 200, GET /sitemap-index.xml 200,
 *         GET /en-gb/ redirects to / (301/302/307/308).
 *
 * If LAUNCH_VERIFY_URL is unset, exits 0 (skipped — use in CI only when env is set).
 */
const origin = (process.env.LAUNCH_VERIFY_URL ?? '').trim().replace(/\/+$/, '');

if (!origin) {
  console.log('verify-launch-urls: skip (set LAUNCH_VERIFY_URL=https://… to run live checks)');
  process.exit(0);
}

const ua = { 'user-agent': 'schillings-launch-verify/1.0' };

async function get(url) {
  const res = await fetch(url, { redirect: 'manual', headers: ua });
  const text = res.status !== 0 ? await res.text().catch(() => '') : '';
  return { res, text };
}

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

const root = await get(origin + '/');
if (root.res.status !== 200) {
  fail(`verify-launch-urls: GET / expected 200, got ${root.res.status}`);
}

const contact = await get(origin + '/contact/');
if (contact.res.status !== 200) {
  fail(`verify-launch-urls: GET /contact/ expected 200, got ${contact.res.status}`);
}

const sm = await get(origin + '/sitemap-index.xml');
if (sm.res.status !== 200) {
  fail(`verify-launch-urls: GET /sitemap-index.xml expected 200, got ${sm.res.status}`);
}

const legacy = await get(origin + '/en-gb/');
const loc = legacy.res.headers.get('location') ?? '';
if (![301, 302, 307, 308].includes(legacy.res.status)) {
  fail(`verify-launch-urls: GET /en-gb/ expected redirect, got ${legacy.res.status}`);
}
const target = new URL(loc, origin).href.replace(/\/+$/, '') || loc;
const rootUrl = origin.replace(/\/+$/, '');
if (target !== rootUrl && target !== `${rootUrl}/`) {
  fail(`verify-launch-urls: /en-gb/ should redirect to site root, Location was ${loc}`);
}

console.log('verify-launch-urls: OK', origin);
