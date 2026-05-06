/**
 * One-shot: duplicate [locale] → us / ie, merge [locale]/* → pages/* (GB at root), remove [locale].
 * Run from repo: node site/scripts/migrate-en-gb-to-root.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pagesDir = path.join(__dirname, '../src/pages');
const localeBracket = path.join(pagesDir, '[locale]');

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkFiles(p, acc);
    else if (/\.(astro|ts)$/.test(name)) acc.push(p);
  }
  return acc;
}

function toAliasImports(content) {
  return content.replace(
    /from ['"]((?:\.\.\/)+)(layouts|components|lib|data|i18n)(\/[^'"]*)['"]/g,
    "from '@/$2$3'",
  );
}

function stripSimpleLocaleStatic(content, fixedLocale) {
  let c = content.replace(
    /export function getStaticPaths\(\) \{\s*return locales\.map\(\(locale\) => \(\{ params: \{ locale \} \}\)\)\);\s*\}\s*\n+/,
    '',
  );
  c = c.replace(
    /const raw = Astro\.params\.locale;\s*\nif \(!raw \|\| !isLocale\(raw\)\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = raw;\s*\n/,
    `const locale = '${fixedLocale}';\n`,
  );
  return c;
}

function fixNewsSlug(content, fixedLocale) {
  return content
    .replace(
      /export function getStaticPaths\(\) \{\s*const slugs = getAllNewsSlugs\(\);\s*const paths: \{ params: \{ locale: Locale; slug: string \} \}\[\] = \[\];\s*for \(const locale of locales\) \{\s*for \(const slug of slugs\) \{\s*paths\.push\(\{ params: \{ locale, slug \} \}\);\s*\}\s*\}\s*return paths;\s*\}/,
      `export function getStaticPaths() {
  const slugs = getAllNewsSlugs();
  return slugs.map((slug) => ({ params: { slug } }));
}`,
    )
    .replace(
      /const rawLocale = Astro\.params\.locale;\s*\nconst slug = Astro\.params\.slug;\s*\nif \(!rawLocale \|\| !isLocale\(rawLocale\) \|\| typeof slug !== 'string'\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = rawLocale;/,
      `const slug = Astro.params.slug;
if (typeof slug !== 'string') {
  return new Response(null, { status: 404 });
}
const locale = '${fixedLocale}';`,
    );
}

function fixPeopleSlug(content, fixedLocale) {
  return content
    .replace(
      /export function getStaticPaths\(\) \{\s*const slugs = getAllPeopleSlugs\(\);\s*const paths: \{ params: \{ locale: Locale; slug: string \} \}\[\] = \[\];\s*for \(const locale of locales\) \{\s*for \(const slug of slugs\) \{\s*paths\.push\(\{ params: \{ locale, slug \} \}\);\s*\}\s*\}\s*return paths;\s*\}/,
      `export function getStaticPaths() {
  const slugs = getAllPeopleSlugs();
  return slugs.map((slug) => ({ params: { slug } }));
}`,
    )
    .replace(
      /const rawLocale = Astro\.params\.locale;\s*\nconst slug = Astro\.params\.slug;\s*\nif \(!rawLocale \|\| !isLocale\(rawLocale\) \|\| typeof slug !== 'string'\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = rawLocale;/,
      `const slug = Astro.params.slug;
if (typeof slug !== 'string') {
  return new Response(null, { status: 404 });
}
const locale = '${fixedLocale}';`,
    );
}

function fixNewsPagePaginated(content, fixedLocale) {
  return content
    .replace(
      /export function getStaticPaths\(\) \{\s*const pageNums = newsPaginatedPageNumbers\(\);\s*const paths: \{ params: \{ locale: Locale; page: string \} \}\[\] = \[\];\s*for \(const locale of locales\) \{\s*for \(const p of pageNums\) \{\s*paths\.push\(\{ params: \{ locale, page: String\(p\) \} \}\);\s*\}\s*\}\s*return paths;\s*\}/,
      `export function getStaticPaths() {
  const pageNums = newsPaginatedPageNumbers();
  return pageNums.map((p) => ({ params: { page: String(p) } }));
}`,
    )
    .replace(
      /const rawLocale = Astro\.params\.locale;\s*\nconst rawPage = Astro\.params\.page;\s*\nif \(!rawLocale \|\| !isLocale\(rawLocale\) \|\| typeof rawPage !== 'string'\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = rawLocale;/,
      `const rawPage = Astro.params.page;
if (typeof rawPage !== 'string') {
  return new Response(null, { status: 404 });
}
const locale = '${fixedLocale}';`,
    );
}

function fixNewsTopic(content, fixedLocale) {
  return content
    .replace(
      /export function getStaticPaths\(\) \{\s*const entries = uniqueTopicEntriesFromArticles\(newsArticles\);\s*const paths: \{ params: \{ locale: Locale; topic: string \} \}\[\] = \[\];\s*for \(const locale of locales\) \{\s*for \(const \{ slug \} of entries\) \{\s*paths\.push\(\{ params: \{ locale, topic: slug \} \}\);\s*\}\s*\}\s*return paths;\s*\}/,
      `export function getStaticPaths() {
  const entries = uniqueTopicEntriesFromArticles(newsArticles);
  return entries.map(({ slug }) => ({ params: { topic: slug } }));
}`,
    )
    .replace(
      /const rawLocale = Astro\.params\.locale;\s*\nconst rawTopic = Astro\.params\.topic;\s*\nif \(!rawLocale \|\| !isLocale\(rawLocale\) \|\| typeof rawTopic !== 'string'\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = rawLocale;/,
      `const rawTopic = Astro.params.topic;
if (typeof rawTopic !== 'string') {
  return new Response(null, { status: 404 });
}
const locale = '${fixedLocale}';`,
    );
}

function fixServicesHub(content, fixedLocale) {
  return content
    .replace(
      /export function getStaticPaths\(\) \{\s*const paths: \{ params: \{ locale: Locale; expertiseId: string \} \}\[\] = \[\];\s*for \(const locale of locales\) \{\s*for \(const expertiseId of EXPERTISE_IDS\) \{\s*paths\.push\(\{ params: \{ locale, expertiseId \} \}\);\s*\}\s*\}\s*return paths;\s*\}/,
      `export function getStaticPaths() {
  return EXPERTISE_IDS.map((expertiseId) => ({ params: { expertiseId } }));
}`,
    )
    .replace(
      /const rawLocale = Astro\.params\.locale;\s*\nconst expertiseIdRaw = Astro\.params\.expertiseId;\s*\nif \(!rawLocale \|\| !isLocale\(rawLocale\) \|\| typeof expertiseIdRaw !== 'string' \|\| !isExpertiseId\(expertiseIdRaw\)\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = rawLocale;/,
      `const expertiseIdRaw = Astro.params.expertiseId;
if (typeof expertiseIdRaw !== 'string' || !isExpertiseId(expertiseIdRaw)) {
  return new Response(null, { status: 404 });
}
const locale = '${fixedLocale}';`,
    );
}

function fixKeithBio(content, fixedLocale) {
  return content
    .replace(
      /export function getStaticPaths\(\) \{\s*const paths: \{ params: \{ locale: Locale; slug: string \} \}\[\] = \[\];\s*for \(const locale of locales\) \{\s*for \(const slug of keithBiographySlugs\) \{\s*paths\.push\(\{ params: \{ locale, slug \} \}\);\s*\}\s*\}\s*return paths;\s*\}/,
      `export function getStaticPaths() {
  return keithBiographySlugs.map((slug) => ({ params: { slug } }));
}`,
    )
    .replace(
      /const rawLocale = Astro\.params\.locale;\s*\nconst slug = Astro\.params\.slug;\s*\nif \(!rawLocale \|\| !isLocale\(rawLocale\) \|\| typeof slug !== 'string'\) \{\s*return new Response\(null, \{ status: 404 \}\);\s*\}\s*\nconst locale = rawLocale;/,
      `const slug = Astro.params.slug;
if (typeof slug !== 'string') {
  return new Response(null, { status: 404 });
}
const locale = '${fixedLocale}';`,
    );
}

function fixRssXml(content, fixedLocale) {
  let c = content.replace(
    /export function getStaticPaths\(\) \{\s*return locales\.map\(\(locale\) => \(\{ params: \{ locale \} \}\)\)\);\s*\}\s*\n+/,
    '',
  );
  c = c.replace(
    /const raw = params\.locale;\s*\nif \(typeof raw !== 'string' \|\| !isLocale\(raw\)\) \{\s*return new Response\('Not found', \{ status: 404 \}\);\s*\}\s*\nconst locale = raw as Locale;/,
    `const locale = '${fixedLocale}' as Locale;`,
  );
  return c;
}

function fixHomeIndex(content, fixedLocale) {
  let c = stripSimpleLocaleStatic(content, fixedLocale);
  c = c.replace(/href=\{\s*`\s*\/\$\{l\}\/\s*`\s*\}/g, "href={localeHref(l, '')}");
  c = c.replace(/href=\{`\/\$\{l\}\/`}/g, "href={localeHref(l, '')}");
  if (!c.includes("localeHref") && !c.includes("from '@/lib/site-nav'")) {
    c = c.replace(
      /(import \{ locales, localeLabels, htmlLang[^;]*\};)\n/,
      "$1\nimport { localeHref } from '@/lib/site-nav';\n",
    );
  }
  return c;
}

function fixedLocaleForFile(absPath, pagesRoot) {
  const rel = path.relative(pagesRoot, absPath);
  if (rel.startsWith(`us${path.sep}`) || rel === 'us') return 'en-us';
  if (rel.startsWith(`ie${path.sep}`) || rel === 'ie') return 'en-ie';
  return 'en-gb';
}

function transformFile(absPath, fixedLocale, pagesRoot) {
  let content = fs.readFileSync(absPath, 'utf8');
  content = toAliasImports(content);
  const base = path.basename(absPath);
  const isRootHome = absPath === path.join(pagesRoot, 'index.astro');

  if (base === 'rss.xml.ts') {
    content = fixRssXml(content, fixedLocale);
  } else if (absPath.includes(`${path.sep}news${path.sep}[slug]${path.sep}`)) {
    content = fixNewsSlug(content, fixedLocale);
  } else if (absPath.includes(`${path.sep}people${path.sep}[slug]${path.sep}`)) {
    content = fixPeopleSlug(content, fixedLocale);
  } else if (absPath.includes(`${path.sep}news${path.sep}page${path.sep}[page]${path.sep}`)) {
    content = fixNewsPagePaginated(content, fixedLocale);
  } else if (absPath.includes(`${path.sep}news${path.sep}topic${path.sep}[topic]${path.sep}`)) {
    content = fixNewsTopic(content, fixedLocale);
  } else if (absPath.includes(`${path.sep}services${path.sep}[expertiseId]${path.sep}`)) {
    content = fixServicesHub(content, fixedLocale);
  } else if (absPath.includes(`${path.sep}keith-schilling-biography${path.sep}[slug]${path.sep}`)) {
    content = fixKeithBio(content, fixedLocale);
  } else if (isRootHome) {
    content = fixHomeIndex(content, fixedLocale);
  } else {
    content = stripSimpleLocaleStatic(content, fixedLocale);
  }

  // Drop unused `isLocale` from imports when possible (light touch)
  if (!content.match(/\bisLocale\b/) && content.includes("from '@/i18n/config'")) {
    content = content.replace(/,\s*isLocale/g, '');
    content = content.replace(/isLocale,\s*/g, '');
  }

  fs.writeFileSync(absPath, content, 'utf8');
}

function main() {
  if (!fs.existsSync(localeBracket)) {
    console.error('Missing', localeBracket);
    process.exit(1);
  }

  const enUs = path.join(pagesDir, 'us');
  const enIe = path.join(pagesDir, 'ie');
  fs.rmSync(enUs, { recursive: true, force: true });
  fs.rmSync(enIe, { recursive: true, force: true });
  fs.cpSync(localeBracket, enUs, { recursive: true });
  fs.cpSync(localeBracket, enIe, { recursive: true });

  for (const entry of fs.readdirSync(localeBracket)) {
    const src = path.join(localeBracket, entry);
    const dest = path.join(pagesDir, entry);
    fs.cpSync(src, dest, { recursive: true });
  }

  fs.rmSync(localeBracket, { recursive: true });

  const all = walkFiles(pagesDir);
  for (const file of all) {
    const loc = fixedLocaleForFile(file, pagesDir);
    transformFile(file, loc, pagesDir);
  }

  console.log('migrate-en-gb-to-root: done. Files:', all.length);
}

main();
