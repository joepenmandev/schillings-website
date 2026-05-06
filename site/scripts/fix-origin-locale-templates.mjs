/**
 * Replace `${origin}/${locale}/...` with `absolutePageUrl(origin, locale, ...)` in pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/pages');

function walk(dir, acc = []) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (n.endsWith('.astro') || n.endsWith('.ts')) acc.push(p);
  }
  return acc;
}

function ensureImport(c) {
  if (c.includes("from '@/lib/public-url'") || c.includes('absolutePageUrl')) return c;
  if (!c.includes('${origin}/${locale}')) return c;
  const line = "import { absolutePageUrl } from '@/lib/public-url';\n";
  if (c.includes("from '@/lib/jsonld-page'")) {
    return c.replace(/(import .+ from '@\/lib\/jsonld-page';)\n/, `$1\n${line}`);
  }
  if (c.includes("from '@/lib/site-nav'")) {
    return c.replace(/(import .+ from '@\/lib\/site-nav';)\n/, `$1\n${line}`);
  }
  return c.replace(/^---\n/, `---\n${line}`);
}

for (const file of walk(pagesDir)) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('${origin}/${locale}')) continue;

  c = ensureImport(c);

  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/news\/page\/\$\{pageNum - 1\}\//g,
    '${absolutePageUrl(origin, locale, `news/page/${pageNum - 1}`)}',
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/news\/page\/\$\{pageNum \+ 1\}\//g,
    '${absolutePageUrl(origin, locale, `news/page/${pageNum + 1}`)}',
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/news\/page\/2\//g,
    "${absolutePageUrl(origin, locale, 'news/page/2')}",
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/services\/\$\{expertiseId\}\//g,
    '${absolutePageUrl(origin, locale, `services/${expertiseId}`)}',
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/people\/\$\{person\.slug\}\//g,
    '${absolutePageUrl(origin, locale, `people/${person.slug}`)}',
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/news\/\$\{article\.slug\}\//g,
    '${absolutePageUrl(origin, locale, `news/${article.slug}`)}',
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/people\/\$\{s\}\//g,
    '${absolutePageUrl(origin, locale, `people/${s}`)}',
  );
  c = c.replace(
    /\$\{origin\}\/\$\{locale\}\/\$\{pathAfterLocale\}\//g,
    '${absolutePageUrl(origin, locale, pathAfterLocale)}',
  );
  c = c.replace(/\$\{origin\}\/\$\{locale\}\/news\//g, "${absolutePageUrl(origin, locale, 'news')}");
  c = c.replace(/\$\{origin\}\/\$\{locale\}\/services\//g, "${absolutePageUrl(origin, locale, 'services')}");
  c = c.replace(/\$\{origin\}\/\$\{locale\}\/about-us\//g, "${absolutePageUrl(origin, locale, 'about-us')}");
  c = c.replace(/\$\{origin\}\/\$\{locale\}\/people\//g, "${absolutePageUrl(origin, locale, 'people')}");
  c = c.replace(/\$\{origin\}\/\$\{locale\}\//g, "${absolutePageUrl(origin, locale, '')}");

  fs.writeFileSync(file, c, 'utf8');
}

console.log('fix-origin-locale-templates: done');
