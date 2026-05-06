/** Replace href={`/${locale}/...`} with localeHref in pages. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/pages');

function walk(dir, acc = []) {
  for (const n of fs.readdirSync(dir)) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (n.endsWith('.astro')) acc.push(p);
  }
  return acc;
}

function ensureLocaleHref(c) {
  if (c.includes('localeHref')) return c;
  if (!c.includes('`/${locale}/')) return c;
  const imp = "import { localeHref } from '@/lib/site-nav';\n";
  if (c.includes("from '@/lib/site-nav'")) return c;
  if (c.match(/import .+ from '@\/lib\/[^']+';/)) {
    return c.replace(/(import .+ from '@\/lib\/[^']+';)\n/, `$1\n${imp}`);
  }
  return c.replace(/^---\n/, `---\n${imp}`);
}

for (const file of walk(pagesDir)) {
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('`/${locale}/')) continue;
  c = ensureLocaleHref(c);

  c = c.replace(
    /href=\{`\/\$\{locale\}\/people\/\$\{p\.slug\}\/`\}/g,
    'href={localeHref(locale, `people/${p.slug}`)}',
  );
  c = c.replace(/href=\{`\/\$\{locale\}\/people\/`\}/g, "href={localeHref(locale, 'people')}");
  c = c.replace(/href=\{`\/\$\{locale\}\/people\/\$\{s\}\/`\}/g, 'href={localeHref(locale, `people/${s}`)}');
  c = c.replace(/href=\{`\/\$\{locale\}\/news\/`\}/g, "href={localeHref(locale, 'news')}");
  c = c.replace(/href=\{`\/\$\{locale\}\/news\/rss\.xml\/`\}/g, "href={localeHref(locale, 'news/rss.xml')}");
  c = c.replace(
    /href=\{`\/\$\{locale\}\/compliance\/standard-terms-of-business\/`\}/g,
    "href={localeHref(locale, 'compliance/standard-terms-of-business')}",
  );
  c = c.replace(
    /href=\{`\/\$\{locale\}\/compliance\/schillings-sra\/`\}/g,
    "href={localeHref(locale, 'compliance/schillings-sra')}",
  );
  c = c.replace(
    /href=\{`\/\$\{locale\}\/compliance\/privacy-disclaimer\/`\}/g,
    "href={localeHref(locale, 'compliance/privacy-disclaimer')}",
  );
  c = c.replace(
    /href=\{`\/\$\{locale\}\/keith-schilling-biography\/early-career\/`\}/g,
    "href={localeHref(locale, 'keith-schilling-biography/early-career')}",
  );
  c = c.replace(
    /href=\{`\/\$\{locale\}\/keith-schilling-founder\/`\}/g,
    "href={localeHref(locale, 'keith-schilling-founder')}",
  );
  c = c.replace(/href=\{`\/\$\{locale\}\/contact\/`\}/g, "href={localeHref(locale, 'contact')}");
  c = c.replace(
    /href=\{`\/\$\{locale\}\/`\}\> Home/g,
    "href={localeHref(locale, '')}> Home",
  );
  c = c.replace(/href=\{`\/\$\{locale\}\/`\}/g, "href={localeHref(locale, '')}");
  c = c.replace(
    /href=\{`\/\$\{locale\}\/legal\/privacy-notice\/`\}/g,
    "href={localeHref(locale, 'legal/privacy-notice')}",
  );

  fs.writeFileSync(file, c, 'utf8');
}

console.log('fix-href-locale-prefix: done');
