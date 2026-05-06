#!/usr/bin/env node
/**
 * Post-build: locale homepages include canonical + full hreflang cluster (en-GB, en-US, en-IE, x-default).
 * x-default href must equal en-GB href (UK-primary strategy).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');

const checks = [
  { file: 'index.html', label: 'UK home' },
  { file: join('us', 'index.html'), label: 'US home' },
  { file: join('ie', 'index.html'), label: 'IE home' },
];

const requiredHreflangs = ['en-gb', 'en-us', 'en-ie', 'x-default'];

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

for (const { file, label } of checks) {
  const abs = join(dist, file);
  if (!existsSync(abs)) {
    fail(`verify-build-seo: missing ${abs} — run astro build first`);
  }
  const html = readFileSync(abs, 'utf8');
  const root = parse(html, { lowerCaseTagName: true });

  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  if (!canonical.trim()) {
    fail(`verify-build-seo: no canonical in ${file} (${label})`);
  }

  const alternates = root.querySelectorAll('link[rel="alternate"][hreflang]');
  const found = new Map();
  for (const link of alternates) {
    const h = (link.getAttribute('hreflang') ?? '').toLowerCase();
    found.set(h, link.getAttribute('href') ?? '');
  }

  for (const h of requiredHreflangs) {
    if (!found.has(h)) {
      fail(`verify-build-seo: missing hreflang="${h}" in ${file} (${label})`);
    }
  }
  const xd = found.get('x-default');
  const gb = found.get('en-gb');
  if (xd !== gb) {
    fail(
      `verify-build-seo: x-default must match en-GB URL in ${file} (${label}). x-default=${xd} en-gb=${gb}`,
    );
  }

  console.log(`verify-build-seo: OK ${file} (${label})`);
}

console.log('verify-build-seo: all locale homepages passed.');
