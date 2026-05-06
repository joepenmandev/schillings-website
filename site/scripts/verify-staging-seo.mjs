/**
 * Staging SEO verification workflow for migrated news pages.
 *
 * Preflight: this script is not part of `npm run verify` (local CI). It needs a live preview
 * origin — set `STAGING_BASE_URL` and run manually or from a deployment workflow after the URL exists.
 *
 * Checks:
 * - article URLs return HTTP 200
 * - self-referencing canonical is present
 * - hreflang alternates include en-GB (BCP 47) and x-default
 * - JSON-LD script is present
 * - sitemap contains indexable migrated article URLs only (published)
 *
 * Usage:
 *   STAGING_BASE_URL="https://preview.example.com" npm run verify:staging-seo
 *
 * Optional:
 *   STAGING_REPORT_OWNER_ENGINEERING="Name"
 *   STAGING_REPORT_OWNER_SEO="Name"
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const reportDir = path.join(siteRoot, 'reports', 'seo');
const importedPath = path.join(siteRoot, 'src/data/news-imported.json');

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value.trim();
}

function normalizeOrigin(origin) {
  return origin.replace(/\/+$/, '');
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!m) return undefined;
  const href = m[0].match(/href=["']([^"']+)["']/i);
  return href?.[1];
}

function extractHreflangs(html) {
  const out = [];
  const re = /<link[^>]+rel=["']alternate["'][^>]*>/gi;
  const tags = html.match(re) ?? [];
  for (const tag of tags) {
    const lang = tag.match(/hreflang=["']([^"']+)["']/i)?.[1];
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (lang && href) out.push({ lang: lang.toLowerCase(), href });
  }
  return out;
}

function hasJsonLd(html) {
  return /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(html);
}

function parseXmlLocs(xml) {
  const out = [];
  const re = /<loc>([^<]+)<\/loc>/gi;
  let match;
  while ((match = re.exec(xml)) !== null) out.push(match[1].trim());
  return out;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'schillings-staging-seo-audit/1.0' },
  });
  const text = await res.text();
  return { status: res.status, text };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function articleUrl(base, locale, slug) {
  return `${base}/${locale}/news/${slug}/`;
}

function remapToBase(url, baseUrl) {
  try {
    const u = new URL(url);
    const base = new URL(baseUrl);
    if (u.origin !== base.origin) return `${base.origin}${u.pathname}${u.search}`;
    return url;
  } catch {
    return url;
  }
}

async function main() {
  const baseUrl = normalizeOrigin(requireEnv('STAGING_BASE_URL'));
  const ownerEngineering = process.env.STAGING_REPORT_OWNER_ENGINEERING?.trim() || '';
  const ownerSeo = process.env.STAGING_REPORT_OWNER_SEO?.trim() || '';

  const importedRaw = JSON.parse(fs.readFileSync(importedPath, 'utf8'));
  const imported = Array.isArray(importedRaw) ? importedRaw : [];
  const published = imported.filter((r) => r && r.status === 'published');

  const failures = [];
  const warnings = [];
  const pageResults = [];

  for (const row of published) {
    const locale = row.locale;
    const slug = row.slug;
    if (typeof locale !== 'string' || typeof slug !== 'string') continue;
    const url = articleUrl(baseUrl, locale, slug);

    let status = 0;
    let canonical;
    let hreflangs = [];
    let jsonLd = false;
    let error = '';

    try {
      const res = await fetchText(url);
      status = res.status;
      if (status !== 200) failures.push(`Non-200 status (${status}): ${url}`);

      canonical = extractCanonical(res.text);
      if (!canonical) {
        failures.push(`Missing canonical: ${url}`);
      } else if (canonical !== url) {
        failures.push(`Canonical mismatch: ${url} -> ${canonical}`);
      }

      hreflangs = extractHreflangs(res.text);
      const langs = new Set(hreflangs.map((h) => h.lang));
      if (!langs.has('en-gb')) failures.push(`Missing hreflang en-GB: ${url}`);
      if (!langs.has('x-default')) warnings.push(`Missing hreflang x-default: ${url}`);

      jsonLd = hasJsonLd(res.text);
      if (!jsonLd) failures.push(`Missing JSON-LD script: ${url}`);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
      failures.push(`Fetch failed: ${url} (${error})`);
    }

    pageResults.push({ url, status, canonical: canonical || null, hreflangs, jsonLd, error: error || null });
  }

  // Sitemap checks
  const sitemapUrl = `${baseUrl}/sitemap-index.xml`;
  const sitemapIndexRes = await fetchText(sitemapUrl);
  if (sitemapIndexRes.status !== 200) {
    failures.push(`Sitemap index non-200 (${sitemapIndexRes.status}): ${sitemapUrl}`);
  }
  const childSitemaps = parseXmlLocs(sitemapIndexRes.text)
    .filter((u) => u.endsWith('.xml'))
    .map((u) => remapToBase(u, baseUrl));

  const sitemapLocs = new Set();
  for (const child of childSitemaps) {
    const childRes = await fetchText(child);
    if (childRes.status !== 200) {
      failures.push(`Child sitemap non-200 (${childRes.status}): ${child}`);
      continue;
    }
    for (const loc of parseXmlLocs(childRes.text)) sitemapLocs.add(loc);
  }

  const publishedUrls = new Set(
    published
      .filter((r) => typeof r.locale === 'string' && typeof r.slug === 'string')
      .map((r) => articleUrl(baseUrl, r.locale, r.slug)),
  );
  const nonPublishedUrls = new Set(
    imported
      .filter((r) => r && r.status !== 'published' && typeof r.locale === 'string' && typeof r.slug === 'string')
      .map((r) => articleUrl(baseUrl, r.locale, r.slug)),
  );

  for (const url of publishedUrls) {
    if (!sitemapLocs.has(url)) failures.push(`Published URL missing from sitemap: ${url}`);
  }
  for (const url of nonPublishedUrls) {
    if (sitemapLocs.has(url)) failures.push(`Non-published URL present in sitemap: ${url}`);
  }

  const report = {
    createdAt: new Date().toISOString(),
    baseUrl,
    owners: { engineering: ownerEngineering, seo: ownerSeo },
    totals: {
      imported: imported.length,
      published: published.length,
      checkedPages: pageResults.length,
      failures: failures.length,
      warnings: warnings.length,
      sitemapsChecked: childSitemaps.length,
      sitemapUrlCount: sitemapLocs.size,
    },
    failures,
    warnings,
    pages: pageResults,
  };

  ensureDir(reportDir);
  const outPath = path.join(reportDir, `staging-seo-${nowStamp()}.json`);
  fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  if (warnings.length) {
    console.log(`Warnings (${warnings.length})`);
    for (const w of warnings.slice(0, 20)) console.log(`- ${w}`);
    if (warnings.length > 20) console.log(`- ... ${warnings.length - 20} more`);
  }

  console.log(`Report: ${path.relative(siteRoot, outPath)}`);

  if (failures.length) {
    console.error(`Staging SEO verification failed (${failures.length} failures).`);
    for (const f of failures.slice(0, 25)) console.error(`- ${f}`);
    if (failures.length > 25) console.error(`- ... ${failures.length - 25} more`);
    process.exit(1);
  }

  console.log('Staging SEO verification passed.');
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});

