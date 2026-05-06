/**
 * Remove leftover `getStaticPaths` + `locales.map` from post-migration pages; fix RSS GET handlers.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/pages');

const STATIC_PATHS_BLOCK =
  /export function getStaticPaths\(\) \{\s*\r?\n\s*return locales\.map\(\(locale\) => \(\{ params: \{ locale \} \}\)\);\s*\r?\n\}\s*\r?\n+/gm;

function walk(dir, acc = []) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(astro|ts)$/.test(n)) acc.push(p);
  }
  return acc;
}

function fixedLocaleFor(rel) {
  if (rel.startsWith(`us${path.sep}`) || rel === 'us') return 'en-us';
  if (rel.startsWith(`ie${path.sep}`) || rel === 'ie') return 'en-ie';
  return 'en-gb';
}

for (const file of walk(pagesDir)) {
  const rel = path.relative(pagesDir, file);
  let c = fs.readFileSync(file, 'utf8');
  const loc = fixedLocaleFor(rel);

  if (!c.includes('return locales.map((locale) => ({ params: { locale } }));')) continue;

  if (path.basename(file) === 'rss.xml.ts') {
    c = c.replace(STATIC_PATHS_BLOCK, '');
    c = c.replace(
      /const raw = params\.locale;\s*\r?\nif \(typeof raw !== 'string' \|\| !isLocale\(raw\)\) \{\s*\r?\n\s*return new Response\('Not found', \{ status: 404 \}\);\s*\r?\n\}\s*\r?\nconst locale = raw as Locale;/,
      `const locale = '${loc}' as Locale;`,
    );
    c = c.replace(
      /const channelLink = `\$\{origin\}\/\$\{locale\}\/news\/`;/,
      loc === 'en-gb'
        ? 'const channelLink = `${origin}/news/`;'
        : `const channelLink = \`\${origin}/${loc}/news/\`;`,
    );
    c = c.replace(
      /const selfFeedUrl = `\$\{origin\}\/\$\{locale\}\/news\/rss\.xml\/`;/,
      loc === 'en-gb'
        ? 'const selfFeedUrl = `${origin}/news/rss.xml/`;'
        : `const selfFeedUrl = \`\${origin}/${loc}/news/rss.xml/\`;`,
    );
    c = c.replace(
      /link: `\$\{origin\}\/\$\{locale\}\/news\/\$\{a\.slug\}\/`,/g,
      loc === 'en-gb'
        ? 'link: `${origin}/news/${a.slug}/`,'
        : `link: \`\${origin}/${loc}/news/\${a.slug}/\`,`,
    );
    if (!c.includes('isLocale')) {
      c = c.replace(/,\s*isLocale/g, '');
      c = c.replace(/isLocale,\s*/g, '');
    }
    if (!c.includes('locales')) {
      c = c.replace(/,\s*locales/g, '');
      c = c.replace(/locales,\s*/g, '');
    }
  } else {
    c = c.replace(STATIC_PATHS_BLOCK, '');
  }

  if (!c.match(/\bisLocale\b/) && c.includes("from '@/i18n/config'")) {
    c = c.replace(/,\s*isLocale/g, '');
    c = c.replace(/isLocale,\s*/g, '');
  }

  fs.writeFileSync(file, c, 'utf8');
}

console.log('fix-locale-static-paths: done');
