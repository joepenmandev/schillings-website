#!/usr/bin/env npx tsx
/**
 * Strategic IA crawl: fetch locale homepages + situations / what-we-protect / response-system / people / news.
 *
 * Required: BASE_URL=http://localhost:4321 (no trailing slash)
 *
 * Usage:
 *   BASE_URL=http://localhost:4321 npx tsx scripts/verify-strategic-crawl.ts
 *   BASE_URL=https://preview.example.com npx tsx scripts/verify-strategic-crawl.ts
 */
import { parse } from 'node-html-parser';
import { localeLabels, type Locale } from '../src/i18n/config';
import { buildStrategicCrawlPathnames, isStrategicInternalPathname } from './strategic-crawl-lib';

const UA = 'schillings-strategic-crawl/1.0';

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

function normalizeOrigin(raw: string): string {
  const t = raw.trim().replace(/\/+$/, '');
  if (!t) fail('verify-strategic-crawl: BASE_URL is empty');
  try {
    const u = new URL(t);
    if (!['http:', 'https:'].includes(u.protocol)) fail(`verify-strategic-crawl: invalid protocol ${u.protocol}`);
    return u.origin;
  } catch {
    fail(`verify-strategic-crawl: BASE_URL is not a valid URL: ${raw}`);
  }
}

function absUrl(origin: string, pathname: string): string {
  return origin + (pathname.startsWith('/') ? pathname : `/${pathname}`);
}

function normalizeCompareUrl(origin: string, href: string): string {
  const u = new URL(href, origin);
  u.hash = '';
  let path = u.pathname;
  const lastSeg = path.split('/').pop() ?? '';
  const fileLike = lastSeg.includes('.') && /\.[a-z0-9]{2,12}$/i.test(lastSeg);
  if (!fileLike && path !== '/' && !path.endsWith('/')) path = `${path}/`;
  if (path === '//') path = '/';
  return `${u.origin}${path}`;
}

type PageResult = {
  url: string;
  locale: Locale;
  path: string;
  ok: boolean;
  errors: string[];
  warnings: string[];
  noindex: boolean;
};

type LinkFail = { from: string; href: string; reason: string };

async function fetchText(url: string): Promise<{ status: number; text: string; finalUrl: string }> {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': UA },
  });
  const text = await res.text();
  return { status: res.status, text, finalUrl: res.url };
}

function auditHtml(html: string, pageUrl: string, origin: string): { errors: string[]; warnings: string[]; noindex: boolean; strategicHrefs: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const root = parse(html, { lowerCaseTagName: true });

  const robots = root.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  const noindex = /\bnoindex\b/i.test(robots);

  const h1s = root.querySelectorAll('h1');
  if (h1s.length === 0) errors.push('zero h1 elements');
  if (h1s.length > 1) errors.push(`multiple h1 (${h1s.length})`);

  const title = root.querySelector('title')?.text?.trim() ?? '';
  if (!title) errors.push('missing <title>');

  const desc = root.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
  if (!desc) errors.push('missing meta description');

  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href')?.trim() ?? '';
  if (!canonical) errors.push('missing link[rel=canonical]');

  const strategicHrefs: string[] = [];
  for (const a of root.querySelectorAll('a[href]')) {
    const raw = (a.getAttribute('href') ?? '').trim();
    if (!raw || raw.startsWith('#') || raw.toLowerCase().startsWith('javascript:')) continue;
    if (/^(mailto:|tel:)/i.test(raw)) continue;
    let resolved: string;
    try {
      resolved = new URL(raw, pageUrl).href;
    } catch {
      warnings.push(`unparseable href: ${raw.slice(0, 80)}`);
      continue;
    }
    try {
      const r = new URL(resolved);
      if (r.origin !== new URL(origin).origin) continue;
      if (!isStrategicInternalPathname(r.pathname)) continue;
      strategicHrefs.push(normalizeCompareUrl(origin, resolved));
    } catch {
      /* skip */
    }
  }

  return { errors, warnings, noindex, strategicHrefs: [...new Set(strategicHrefs)] };
}

function extractLocs(xml: string): string[] {
  const out: string[] = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) out.push(m[1].trim());
  return out;
}

async function fetchSitemapPageUrls(origin: string): Promise<string[] | null> {
  const candidates = ['/sitemap-index.xml', '/sitemap.xml'];
  let xml = '';
  let ok = false;
  for (const path of candidates) {
    const res = await fetch(origin + path, { headers: { 'user-agent': UA } });
    if (res.ok) {
      xml = await res.text();
      ok = true;
      break;
    }
  }
  if (!ok) return null;

  const pageUrls: string[] = [];
  const nestedXmlUrls: string[] = [];
  for (const loc of extractLocs(xml)) {
    if (/\.xml(\?|$)/i.test(loc)) nestedXmlUrls.push(loc);
    else pageUrls.push(loc);
  }

  for (const smUrl of nestedXmlUrls) {
    try {
      const res = await fetch(smUrl, { headers: { 'user-agent': UA } });
      if (!res.ok) continue;
      const inner = await res.text();
      for (const loc of extractLocs(inner)) {
        if (!/\.xml(\?|$)/i.test(loc)) pageUrls.push(loc);
      }
    } catch {
      /* ignore */
    }
  }

  return [...new Set(pageUrls)];
}

async function main() {
  if (!process.env.BASE_URL?.trim()) {
    fail('verify-strategic-crawl: set BASE_URL (e.g. BASE_URL=http://localhost:4321 npm run verify:strategic-crawl)');
  }
  const origin = normalizeOrigin(process.env.BASE_URL);
  console.log(`verify-strategic-crawl: BASE_URL=${origin}\n`);

  const entries = buildStrategicCrawlPathnames();
  const results: PageResult[] = [];
  const linkFails: LinkFail[] = [];
  const crawlMap = new Map<string, PageResult>();
  const strategicTargets = new Map<string, string>();

  for (const { locale, path } of entries) {
    const url = absUrl(origin, path);
    const res = await fetchText(url);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (res.status !== 200) {
      errors.push(`HTTP ${res.status}`);
    }

    let noindex = false;
    let strategicHrefs: string[] = [];
    if (res.status === 200) {
      const audit = auditHtml(res.text, res.finalUrl, origin);
      errors.push(...audit.errors);
      warnings.push(...audit.warnings);
      noindex = audit.noindex;
      strategicHrefs = audit.strategicHrefs;
    }

    const pr: PageResult = {
      url: res.finalUrl,
      locale,
      path,
      ok: errors.length === 0,
      errors,
      warnings,
      noindex,
    };
    results.push(pr);
    crawlMap.set(normalizeCompareUrl(origin, res.finalUrl), pr);
    crawlMap.set(normalizeCompareUrl(origin, url), pr);

    for (const target of strategicHrefs) {
      if (!strategicTargets.has(target)) strategicTargets.set(target, res.finalUrl);
    }
  }

  for (const [target, from] of strategicTargets) {
    try {
      const head = await fetch(target, { method: 'GET', redirect: 'follow', headers: { 'user-agent': UA } });
      if (head.status !== 200) {
        linkFails.push({ from, href: target, reason: `HTTP ${head.status}` });
      }
    } catch (e) {
      linkFails.push({
        from,
        href: target,
        reason: e instanceof Error ? e.message : 'fetch failed',
      });
    }
  }

  const byLocale = new Map<Locale, PageResult[]>();
  for (const r of results) {
    if (!byLocale.has(r.locale)) byLocale.set(r.locale, []);
    byLocale.get(r.locale)!.push(r);
  }

  console.log('=== Strategic pages ===\n');
  for (const locale of ['en-gb', 'en-us', 'en-ie'] as const) {
    const rows = byLocale.get(locale) ?? [];
    console.log(`--- ${locale} (${localeLabels[locale]}) ---`);
    for (const r of rows) {
      const status = r.ok ? 'OK' : 'FAIL';
      console.log(`  [${status}] ${r.path}`);
      for (const e of r.errors) console.log(`         - ${e}`);
      for (const w of r.warnings) console.log(`         ! ${w}`);
    }
    console.log('');
  }

  if (linkFails.length) {
    console.log('=== Broken strategic internal links ===\n');
    for (const f of linkFails) {
      console.log(`  from: ${f.from}`);
      console.log(`  href: ${f.href}`);
      console.log(`  ${f.reason}\n`);
    }
  } else {
    console.log('=== Strategic internal links: no failures ===\n');
  }

  const sitemapLocs = await fetchSitemapPageUrls(origin);
  if (!sitemapLocs) {
    console.log('=== Sitemap: not reachable (skipped noindex check) ===\n');
  } else {
    console.log('=== Sitemap vs noindex (warnings only) ===\n');
    let warnCount = 0;
    for (const loc of sitemapLocs) {
      let key: string;
      try {
        key = normalizeCompareUrl(origin, loc);
      } catch {
        continue;
      }
      const pr = crawlMap.get(key);
      if (pr?.noindex) {
        warnCount += 1;
        console.log(`  WARN: sitemap lists noindex URL: ${loc}`);
      }
    }
    if (!warnCount) console.log('  No overlap between crawled noindex pages and sitemap (or none in sitemap).\n');
    else console.log('');
  }

  const pageFails = results.filter((r) => !r.ok).length;
  const totalFails = pageFails + linkFails.length;

  console.log('=== Summary ===');
  console.log(`  Pages checked: ${results.length}`);
  console.log(`  Page failures: ${pageFails}`);
  console.log(`  Strategic link failures: ${linkFails.length}`);
  console.log(`  Total failures: ${totalFails}\n`);

  if (totalFails > 0) {
    process.exit(1);
  }
  console.log('verify-strategic-crawl: all checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
