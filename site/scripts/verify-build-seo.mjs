#!/usr/bin/env node
/**
 * Post-build: locale homepages include canonical + full hreflang cluster (en-GB, en-US, en-IE, x-default).
 * x-default href must equal en-GB href (UK-primary strategy).
 *
 * Resolution order:
 * 1. If BUILD_SEO_VERIFY_URL is set — fetch `/`, `/us/`, `/ie/` from that origin (trailing slashes OK).
 * 2. Else if prerendered HTML exists under dist/ — read from disk (legacy static layout).
 * 3. Else — spawn `astro dev` on 127.0.0.1:SEO_VERIFY_PREVIEW_PORT (default 4339), wait until ready, fetch, then exit.
 *    (`astro preview` is unsupported with `@astrojs/vercel`; dev server is used for local HTML checks.)
 *
 * SSR builds (output: server) typically have no homepage HTML in dist/ — mode 3 is used in `npm run verify`.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { parse } from 'node-html-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const dist = join(siteRoot, 'dist');

const checks = [
  { label: 'UK home', fetchPath: '/', diskRel: ['index.html', join('client', 'index.html')] },
  { label: 'US home', fetchPath: '/us/', diskRel: [join('us', 'index.html'), join('client', 'us', 'index.html')] },
  { label: 'IE home', fetchPath: '/ie/', diskRel: [join('ie', 'index.html'), join('client', 'ie', 'index.html')] },
];

const requiredHreflangs = ['en-gb', 'en-us', 'en-ie', 'x-default'];

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

function checkHomepageHtml(html, label, sourceHint) {
  const root = parse(html, { lowerCaseTagName: true });

  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  if (!canonical.trim()) {
    fail(`verify-build-seo: no canonical (${label}) ${sourceHint}`);
  }

  const alternates = root.querySelectorAll('link[rel="alternate"][hreflang]');
  const found = new Map();
  for (const link of alternates) {
    const h = (link.getAttribute('hreflang') ?? '').toLowerCase();
    found.set(h, link.getAttribute('href') ?? '');
  }

  for (const h of requiredHreflangs) {
    if (!found.has(h)) {
      fail(`verify-build-seo: missing hreflang="${h}" (${label}) ${sourceHint}`);
    }
  }
  const xd = found.get('x-default');
  const gb = found.get('en-gb');
  if (xd !== gb) {
    fail(
      `verify-build-seo: x-default must match en-GB URL (${label}) ${sourceHint}. x-default=${xd} en-gb=${gb}`,
    );
  }

  console.log(`verify-build-seo: OK ${label} ${sourceHint}`);
}

function readHtmlFromDisk() {
  const out = [];
  for (const { label, diskRel, fetchPath } of checks) {
    let abs = null;
    for (const rel of diskRel) {
      const p = join(dist, rel);
      if (existsSync(p)) {
        abs = p;
        break;
      }
    }
    if (!abs) return null;
    out.push({ label, html: readFileSync(abs, 'utf8'), hint: `(disk ${abs})` });
  }
  return out;
}

async function fetchHtml(origin, fetchPath) {
  const base = origin.replace(/\/+$/, '');
  const url = new URL(fetchPath, `${base}/`).href;
  const res = await fetch(url, {
    headers: { 'user-agent': 'schillings-verify-build-seo/1.0' },
    redirect: 'follow',
  });
  if (!res.ok) {
    fail(`verify-build-seo: ${res.status} ${url}`);
  }
  return res.text();
}

async function waitForPreview(origin, maxAttempts = 120) {
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const res = await fetch(origin, {
        headers: { 'user-agent': 'schillings-verify-build-seo/1.0' },
        redirect: 'follow',
      });
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  fail(`verify-build-seo: preview server did not respond at ${origin}`);
}

async function runWithSpawnedPreview() {
  const port = process.env.SEO_VERIFY_PREVIEW_PORT ?? '4339';
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn('npx', ['astro', 'dev', '--port', port, '--host', '127.0.0.1'], {
    cwd: siteRoot,
    stdio: 'ignore',
    env: { ...process.env },
  });

  const stop = () => {
    try {
      child.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  try {
    await waitForPreview(origin);
    for (const { label, fetchPath } of checks) {
      const html = await fetchHtml(origin, fetchPath);
      checkHomepageHtml(html, label, `(fetch ${origin}${fetchPath})`);
    }
  } finally {
    stop();
    process.off('SIGINT', stop);
    process.off('SIGTERM', stop);
  }
}

async function main() {
  const envOrigin = (process.env.BUILD_SEO_VERIFY_URL ?? '').trim().replace(/\/+$/, '');

  if (envOrigin) {
    for (const { label, fetchPath } of checks) {
      const html = await fetchHtml(envOrigin, fetchPath);
      checkHomepageHtml(html, label, `(fetch ${envOrigin}${fetchPath})`);
    }
    console.log('verify-build-seo: all locale homepages passed.');
    return;
  }

  const disk = readHtmlFromDisk();
  if (disk) {
    for (const { label, html, hint } of disk) {
      checkHomepageHtml(html, label, hint);
    }
    console.log('verify-build-seo: all locale homepages passed.');
    return;
  }

  if (!existsSync(dist)) {
    fail('verify-build-seo: dist/ missing — run astro build first');
  }

  await runWithSpawnedPreview();
  console.log('verify-build-seo: all locale homepages passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
