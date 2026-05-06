/**
 * News migration QA gates.
 *
 * Checks:
 * - imported rows validate against article import schema
 * - no duplicate {locale,slug}
 * - non-empty body paragraphs
 * - local hero image refs exist under site/public
 * - every legacyUrl exists in redirect-map-news.csv and root redirect-map.csv
 * - authorSlugs (if present) reference existing people slugs
 * - legacy schillingspartners.com /news/{slug} URLs in body point at known slugs
 *
 * Run:
 *   npm run verify:news-migration
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const repoRoot = path.join(siteRoot, '..');

const importedPath = path.join(siteRoot, 'src/data/news-imported.json');
const peopleImportedPath = path.join(siteRoot, 'src/data/people-imported.json');
const newsSitemapSlugsPath = path.join(siteRoot, 'src/data/news-sitemap-slugs.json');
const redirectNewsPath = path.join(siteRoot, 'src/data/redirect-map-news.csv');
const redirectRootPath = path.join(repoRoot, 'redirect-map.csv');
const publicRoot = path.join(siteRoot, 'public');

/** Matches legacy or locale-prefixed news URLs embedded in body text. */
const INTERNAL_LEGACY_NEWS_RE =
  /https?:\/\/(?:www\.)?schillingspartners\.com\/(?:(?:en-gb|en-us|en-ie|us|ie)\/)?news\/([a-z0-9]+(?:-[a-z0-9]+)*)/gi;

function readCsvRows(csvPath) {
  const txt = fs.readFileSync(csvPath, 'utf8').trim();
  const lines = txt ? txt.split(/\r?\n/) : [];
  if (lines.length <= 1) return [];
  return lines.slice(1).map((line) => {
    const cols = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur);
    return cols.map((c) => c.trim());
  });
}

function fail(errors, message) {
  errors.push(message);
}

function warn(warnings, message) {
  warnings.push(message);
}

function isHttpUrl(v) {
  return /^https?:\/\//i.test(v);
}

function asString(input, field) {
  if (typeof input !== 'string' || input.trim() === '') throw new Error(`${field} must be a non-empty string`);
  return input.trim();
}

function asStringArray(input, field) {
  if (!Array.isArray(input)) throw new Error(`${field} must be an array`);
  const arr = input.map((v) => {
    if (typeof v !== 'string') throw new Error(`${field} values must be strings`);
    return v.trim();
  });
  return arr.filter(Boolean);
}

function parseRecord(input) {
  if (!input || typeof input !== 'object') throw new Error('record must be an object');
  const row = /** @type {Record<string, unknown>} */ (input);
  const locale = asString(row.locale, 'locale');
  if (locale !== 'en-gb' && locale !== 'en-us' && locale !== 'en-ie') {
    throw new Error('locale must be en-gb, en-us, or en-ie');
  }

  const status = asString(row.status, 'status');
  if (!['published', 'draft', 'migrated-unreviewed'].includes(status)) {
    throw new Error('status must be published|draft|migrated-unreviewed');
  }

  const out = {
    id: asString(row.id, 'id'),
    slug: asString(row.slug, 'slug'),
    locale,
    title: asString(row.title, 'title'),
    description: asString(row.description, 'description'),
    datePublished: asString(row.datePublished, 'datePublished'),
    body: asStringArray(row.body, 'body'),
    legacyUrl: asString(row.legacyUrl, 'legacyUrl'),
    status,
    heroImage: undefined,
  };

  if (row.heroImage != null) {
    if (typeof row.heroImage !== 'object') throw new Error('heroImage must be an object');
    const hero = /** @type {Record<string, unknown>} */ (row.heroImage);
    out.heroImage = { src: asString(hero.src, 'heroImage.src') };
  }

  return out;
}

function readPeopleSlugs() {
  if (!fs.existsSync(peopleImportedPath)) {
    throw new Error(`Missing ${path.relative(process.cwd(), peopleImportedPath)}`);
  }
  const people = JSON.parse(fs.readFileSync(peopleImportedPath, 'utf8'));
  if (!Array.isArray(people)) throw new Error('people-imported.json must be an array');
  return new Set(people.map((p) => p?.slug).filter((s) => typeof s === 'string'));
}

function readNewsSitemapSlugSet() {
  if (!fs.existsSync(newsSitemapSlugsPath)) {
    throw new Error(`Missing ${path.relative(process.cwd(), newsSitemapSlugsPath)}`);
  }
  const slugs = JSON.parse(fs.readFileSync(newsSitemapSlugsPath, 'utf8'));
  if (!Array.isArray(slugs)) throw new Error('news-sitemap-slugs.json must be an array');
  return new Set(slugs.filter((s) => typeof s === 'string'));
}

function validateAuthorSlugs(rawRow, peopleSlugs, errors, key) {
  const as = rawRow.authorSlugs;
  if (as == null) return;
  if (!Array.isArray(as)) {
    fail(errors, `authorSlugs must be an array when present: ${key}`);
    return;
  }
  for (const s of as) {
    if (typeof s !== 'string' || !s.trim()) {
      fail(errors, `authorSlugs must be non-empty strings: ${key}`);
      continue;
    }
    const slug = s.trim();
    if (!peopleSlugs.has(slug)) {
      fail(errors, `Unknown authorSlug "${slug}" (not in people-imported.json): ${key}`);
    }
  }
}

function validateInternalNewsLinksInBody(bodyText, validNewsSlugs, errors, key) {
  INTERNAL_LEGACY_NEWS_RE.lastIndex = 0;
  let m;
  const seen = new Set();
  while ((m = INTERNAL_LEGACY_NEWS_RE.exec(bodyText)) !== null) {
    const slug = m[1];
    if (seen.has(slug)) continue;
    seen.add(slug);
    if (!validNewsSlugs.has(slug)) {
      fail(errors, `Body references unknown news slug "${slug}" (legacy URL in copy): ${key}`);
    }
  }
}

function main() {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(importedPath)) {
    console.error(`Missing required file: ${path.relative(process.cwd(), importedPath)}`);
    process.exit(1);
  }
  if (!fs.existsSync(redirectNewsPath)) {
    console.error(`Missing required file: ${path.relative(process.cwd(), redirectNewsPath)}`);
    process.exit(1);
  }
  if (!fs.existsSync(redirectRootPath)) {
    console.error(`Missing required file: ${path.relative(process.cwd(), redirectRootPath)}`);
    process.exit(1);
  }

  let peopleSlugs;
  let newsSitemapSlugSet;
  try {
    peopleSlugs = readPeopleSlugs();
    newsSitemapSlugSet = readNewsSitemapSlugSet();
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }

  const importedRaw = JSON.parse(fs.readFileSync(importedPath, 'utf8'));
  if (!Array.isArray(importedRaw)) {
    console.error('news-imported.json must be an array.');
    process.exit(1);
  }

  /** @type {ReturnType<typeof parseRecord>[]} */
  const imported = [];
  for (let i = 0; i < importedRaw.length; i++) {
    const row = importedRaw[i];
    try {
      imported.push(parseRecord(row));
    } catch (e) {
      fail(errors, `Schema validation failed at row ${i + 1}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const validNewsSlugs = new Set(newsSitemapSlugSet);
  for (const row of imported) {
    validNewsSlugs.add(row.slug);
  }

  const seen = new Set();
  for (let idx = 0; idx < imported.length; idx++) {
    const row = imported[idx];
    const rawRow = importedRaw[idx];
    const key = `${row.locale}:${row.slug}`;
    if (seen.has(key)) fail(errors, `Duplicate locale+slug: ${key}`);
    seen.add(key);

    validateAuthorSlugs(rawRow, peopleSlugs, errors, key);

    const body = (row.body ?? []).map((p) => p.trim()).filter(Boolean);
    if (body.length === 0) fail(errors, `Empty body: ${key}`);
    if (body.join(' ').length < 60) warn(warnings, `Very short body: ${key}`);

    validateInternalNewsLinksInBody(body.join('\n'), validNewsSlugs, errors, key);

    const hero = row.heroImage?.src?.trim();
    if (!hero) {
      warn(warnings, `Missing hero image: ${key}`);
    } else if (!isHttpUrl(hero)) {
      const rel = hero.replace(/^\//, '');
      const abs = path.join(publicRoot, rel);
      if (!fs.existsSync(abs)) fail(errors, `Missing local hero file for ${key}: ${hero}`);
    }
  }

  // Redirect coverage checks
  const redirectNewsRows = readCsvRows(redirectNewsPath);
  const redirectRootRows = readCsvRows(redirectRootPath);

  const newsLegacySet = new Set(redirectNewsRows.map((r) => r[0]).filter(Boolean));
  const rootLegacySet = new Set(redirectRootRows.map((r) => r[0]).filter(Boolean));

  for (const row of imported) {
    const legacy = row.legacyUrl;
    if (!newsLegacySet.has(legacy)) fail(errors, `Missing in redirect-map-news.csv: ${legacy}`);
    if (!rootLegacySet.has(legacy)) fail(errors, `Missing in redirect-map.csv: ${legacy}`);
  }

  if (warnings.length > 0) {
    console.log(`Warnings (${warnings.length}):`);
    for (const w of warnings.slice(0, 20)) console.log(`- ${w}`);
    if (warnings.length > 20) console.log(`- ... ${warnings.length - 20} more`);
  }

  if (errors.length > 0) {
    console.error(`\nNews migration verification failed (${errors.length} errors):`);
    for (const e of errors.slice(0, 40)) console.error(`- ${e}`);
    if (errors.length > 40) console.error(`- ... ${errors.length - 40} more`);
    process.exit(1);
  }

  console.log(`News migration verification passed. Rows checked: ${imported.length}`);
}

main();

