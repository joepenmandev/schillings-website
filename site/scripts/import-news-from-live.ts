/**
 * News migration scaffold: discover legacy article URLs and optionally write
 * a normalized import seed file for editorial/engineering follow-up.
 *
 * Defaults to dry-run (no writes):
 *   npm run import:news
 *
 * Explicit write mode:
 *   npm run import:news -- --write
 *
 * After `--write`, re-run author slug backfill (import replaces JSON):
 *   npm run backfill:news-authors
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { parseNewsHtml } from '../src/lib/news-import-parse';
import { parseImportedArticleRecord, type ImportedArticleRecord } from '../src/lib/article-import-schema';

type RunConfig = {
  baseUrl: string;
  userAgent: string;
  delayMs: number;
  dryRun: boolean;
  probe: boolean;
  slugsPath: string;
  outJsonPath: string;
  outErrorsPath: string;
  outImageMissingCsvPath: string;
  outRedirectCsvPath: string;
  imageDir: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getConfig(argv: string[]): RunConfig {
  const write = argv.includes('--write');
  const probe = argv.includes('--probe');
  return {
    baseUrl: 'https://schillingspartners.com',
    userAgent: 'SchillingsNewsMigration/1.0 (+https://schillingspartners.com)',
    delayMs: 200,
    dryRun: !write,
    probe,
    slugsPath: path.join(siteRoot, 'src/data/news-sitemap-slugs.json'),
    outJsonPath: path.join(siteRoot, 'src/data/news-imported.json'),
    outErrorsPath: path.join(siteRoot, 'src/data/news-import-errors.json'),
    outImageMissingCsvPath: path.join(siteRoot, 'src/data/news-image-missing-report.csv'),
    outRedirectCsvPath: path.join(siteRoot, 'src/data/redirect-map-news.csv'),
    imageDir: path.join(siteRoot, 'public/news-images'),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probeUrl(url: string, userAgent: string): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(url, { headers: { 'user-agent': userAgent }, redirect: 'follow' });
  return { ok: res.ok, status: res.status };
}

async function fetchText(url: string, userAgent: string): Promise<string> {
  const res = await fetch(url, { headers: { 'user-agent': userAgent, accept: 'text/html' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function fetchBuffer(url: string, userAgent: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { 'user-agent': userAgent } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function saveOptimizedHeroImage(
  slug: string,
  sourceUrl: string,
  cfg: RunConfig,
): Promise<{ publicPath: string; bytes: number }> {
  const outFile = `${slug}.webp`;
  const outAbs = path.join(cfg.imageDir, outFile);
  const buf = await fetchBuffer(sourceUrl, cfg.userAgent);
  await sharp(buf)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82, effort: 4 })
    .toFile(outAbs);
  const st = fs.statSync(outAbs);
  return { publicPath: `/news-images/${outFile}`, bytes: st.size };
}

function stableArticleKey(a: ImportedArticleRecord): string {
  return `${a.locale}:${a.slug}:${a.id}`;
}

function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

async function main(): Promise<void> {
  const cfg = getConfig(process.argv.slice(2));
  const slugs = JSON.parse(fs.readFileSync(cfg.slugsPath, 'utf8')) as string[];
  const uniqueSlugs = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  const urls = uniqueSlugs.map((slug) => `${cfg.baseUrl}/news/${slug}`);

  console.log(`News migration run (${cfg.dryRun ? 'dry-run' : 'write'})`);
  console.log(`Source slugs: ${path.relative(process.cwd(), cfg.slugsPath)} (${uniqueSlugs.length})`);
  console.log(`Base URL: ${cfg.baseUrl}`);
  console.log(`Probe mode: ${cfg.probe ? 'on' : 'off'}`);
  if (!cfg.dryRun) fs.mkdirSync(cfg.imageDir, { recursive: true });

  const errors: { slug: string; url: string; err: string }[] = [];
  const seeds: ImportedArticleRecord[] = [];
  const imageMissing: { slug: string; legacyUrl: string; reason: string }[] = [];
  let imageSavedCount = 0;

  for (let i = 0; i < uniqueSlugs.length; i++) {
    const slug = uniqueSlugs[i];
    const normalizedSlug = normalizeSlug(slug);
    const url = urls[i];
    process.stderr.write(`[${i + 1}/${uniqueSlugs.length}] ${slug}… `);
    try {
      if (cfg.probe) {
        const p = await probeUrl(url, cfg.userAgent);
        if (!p.ok) {
          errors.push({ slug, url, err: `HTTP ${p.status}` });
          process.stderr.write(`skip (HTTP ${p.status})\n`);
          await sleep(cfg.delayMs);
          continue;
        }
      }

      const html = await fetchText(url, cfg.userAgent);
      const parsed = parseNewsHtml(html, slug, cfg.baseUrl);
      if ('error' in parsed) {
        errors.push({ slug, url, err: parsed.error });
        process.stderr.write(`skip (${parsed.error})\n`);
        await sleep(cfg.delayMs);
        continue;
      }
      const candidate: Record<string, unknown> = {
        id: `legacy:${slug}:en-gb`,
        slug: normalizedSlug,
        locale: 'en-gb',
        title: parsed.title || titleFromSlug(normalizedSlug),
        description: parsed.description,
        datePublished: parsed.datePublished,
        ...(parsed.dateModified ? { dateModified: parsed.dateModified } : {}),
        body: parsed.body,
        legacyUrl: url,
        status: 'migrated-unreviewed',
        ...(parsed.heroImage ? { heroImage: parsed.heroImage } : {}),
        ...(parsed.legacyAuthorRaw ? { legacyAuthorRaw: parsed.legacyAuthorRaw } : {}),
        ...(parsed.topics?.length ? { topics: parsed.topics } : {}),
      };
      if (!parsed.heroImage?.src) {
        imageMissing.push({ slug: normalizedSlug, legacyUrl: url, reason: 'no hero image extracted' });
      } else if (!cfg.dryRun) {
        try {
          const saved = await saveOptimizedHeroImage(normalizedSlug, parsed.heroImage.src, cfg);
          candidate.heroImage = {
            src: saved.publicPath,
            ...(parsed.heroImage.alt ? { alt: parsed.heroImage.alt } : {}),
          };
          imageSavedCount += 1;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push({ slug: normalizedSlug, url, err: `image: ${msg}` });
          imageMissing.push({ slug: normalizedSlug, legacyUrl: url, reason: `image fetch/transform failed: ${msg}` });
        }
      }
      const validated = parseImportedArticleRecord(candidate);
      seeds.push(validated);
      process.stderr.write('ok\n');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ slug, url, err: msg });
      process.stderr.write(`ERR ${msg}\n`);
    }
    await sleep(cfg.delayMs);
  }

  const okCount = seeds.length;
  // Idempotent output: unique by id (last write wins), deterministic sort.
  const byId = new Map<string, ImportedArticleRecord>();
  for (const row of seeds) byId.set(row.id, row);
  const deduped = [...byId.values()].sort((a, b) => stableArticleKey(a).localeCompare(stableArticleKey(b)));
  const dedupedCount = deduped.length;
  const duplicateCount = okCount - dedupedCount;
  const outJson = JSON.stringify(deduped, null, 2) + '\n';
  const outHash = sha256(outJson);

  console.log(`\nPrepared seed rows: ${okCount}`);
  if (duplicateCount > 0) console.log(`Duplicate ids collapsed: ${duplicateCount}`);
  console.log(`Final rows (deduped): ${dedupedCount}`);
  console.log(`Output hash: ${outHash}`);
  console.log(`Probe errors: ${errors.length}`);
  console.log(`Missing hero images: ${imageMissing.length}`);
  if (!cfg.dryRun) console.log(`Saved optimized hero images: ${imageSavedCount}`);

  if (cfg.dryRun) {
    console.log('\nDry-run only. No files written.');
    console.log('Use --write to create:');
    console.log(`- ${path.relative(process.cwd(), cfg.outJsonPath)}`);
    console.log(`- ${path.relative(process.cwd(), cfg.outErrorsPath)}`);
    console.log(`- ${path.relative(process.cwd(), cfg.outImageMissingCsvPath)}`);
    console.log(`- ${path.relative(process.cwd(), cfg.outRedirectCsvPath)}`);
    return;
  }

  let existingHash: string | undefined;
  if (fs.existsSync(cfg.outJsonPath)) {
    existingHash = sha256(fs.readFileSync(cfg.outJsonPath, 'utf8'));
  }
  fs.writeFileSync(cfg.outJsonPath, outJson);
  fs.writeFileSync(cfg.outErrorsPath, JSON.stringify(errors, null, 2) + '\n');
  const csv = [
    'slug,legacy_url,reason',
    ...imageMissing.map((r) =>
      [r.slug, r.legacyUrl, r.reason]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n');
  fs.writeFileSync(cfg.outImageMissingCsvPath, csv + '\n');
  const redirectCsv = [
    'legacy_url,new_url,status,reason',
    ...deduped.map((row) =>
      [
        row.legacyUrl,
        `${cfg.baseUrl}/${row.locale}/news/${row.slug}/`,
        '301',
        'news-migration',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    ),
  ].join('\n');
  fs.writeFileSync(cfg.outRedirectCsvPath, redirectCsv + '\n');
  if (existingHash) {
    console.log(`Existing hash: ${existingHash}`);
    console.log(`Changed: ${existingHash === outHash ? 'no' : 'yes'}`);
  }
  console.log(`\nWrote ${dedupedCount} rows -> ${path.relative(process.cwd(), cfg.outJsonPath)}`);
  console.log(`Wrote ${errors.length} errors -> ${path.relative(process.cwd(), cfg.outErrorsPath)}`);
  console.log(`Wrote image report -> ${path.relative(process.cwd(), cfg.outImageMissingCsvPath)}`);
  console.log(`Wrote redirect map -> ${path.relative(process.cwd(), cfg.outRedirectCsvPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

