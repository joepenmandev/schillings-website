#!/usr/bin/env node
/**
 * Fail if any UK static route (src/pages, non-dynamic) is missing US/IE mirrors (src/pages/us, src/pages/ie).
 * Allowlist: locale-parity-allowlist.json → ukOnly[]
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanStaticRouteTailsByLocale } from './lib/scan-static-page-routes.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteRoot = join(__dirname, '..');
const pagesRoot = join(siteRoot, 'src', 'pages');
const allowlistPath = join(siteRoot, 'locale-parity-allowlist.json');

function loadAllowlist() {
  const raw = readFileSync(allowlistPath, 'utf8');
  const data = JSON.parse(raw);
  const ukOnly = new Set(Array.isArray(data.ukOnly) ? data.ukOnly : []);
  return ukOnly;
}

const ukOnly = loadAllowlist();
const byLocale = await scanStaticRouteTailsByLocale(pagesRoot);
const uk = byLocale['en-gb'];
const us = byLocale['en-us'];
const ie = byLocale['en-ie'];

const missing = [];
for (const tail of uk) {
  if (ukOnly.has(tail)) continue;
  const usOk = us.has(tail);
  const ieOk = ie.has(tail);
  if (!usOk || !ieOk) {
    missing.push({ tail, usOk, ieOk });
  }
}

if (missing.length > 0) {
  console.error('Locale parity: UK static routes missing US and/or IE mirrors:\n');
  for (const { tail, usOk, ieOk } of missing) {
    const label = tail === '' ? '(home)' : tail;
    console.error(`  - ${label}: en-us=${usOk ? 'ok' : 'MISSING'}, en-ie=${ieOk ? 'ok' : 'MISSING'}`);
  }
  console.error(`\nAdd mirrors under src/pages/us/ and src/pages/ie/, or add the tail to ukOnly in locale-parity-allowlist.json.\n`);
  process.exit(1);
}

console.log('Locale parity: all UK static routes have en-us and en-ie mirrors (or are allowlisted).');
