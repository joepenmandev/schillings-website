/**
 * One-off migration: fetch public people pages from schillingspartners.com,
 * extract name, role, bio paragraphs, tags, headshot URL; download images to public/people-photos/.
 *
 * Run from repo: npm run import:people (uses tsx)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parsePersonHtml } from '../src/lib/people-import-parse';
import { inferPracticeGroup } from '../src/lib/people-practice-group';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const slugsPath = path.join(siteRoot, 'src/data/people-sitemap-slugs.json');
const outJsonPath = path.join(siteRoot, 'src/data/people-imported.json');
const photoDir = path.join(siteRoot, 'public/people-photos');

const BASE = 'https://schillingspartners.com';
const UA = 'SchillingsInternalMigration/1.0 (+https://schillingspartners.com)';
const DELAY_MS = 450;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} img`);
  return Buffer.from(await res.arrayBuffer());
}

function extFromUrl(url: string): string {
  const m = url.match(/\.(jpe?g|webp|png)/i);
  return (m ? m[1] : 'jpg').toLowerCase().replace('jpeg', 'jpg');
}

async function main(): Promise<void> {
  const slugs = JSON.parse(fs.readFileSync(slugsPath, 'utf8')) as string[];
  fs.mkdirSync(photoDir, { recursive: true });
  const importRunIso = new Date().toISOString();

  const results: Record<string, unknown>[] = [];
  const errors: { slug: string; err: string }[] = [];
  const unmappedPeopleTags = new Set<string>();

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const url = `${BASE}/people/${slug}`;
    process.stderr.write(`[${i + 1}/${slugs.length}] ${slug}… `);
    try {
      const html = await fetchText(url);
      const parsed = parsePersonHtml(html, slug, BASE);
      if ('error' in parsed) {
        errors.push({ slug, err: parsed.error });
        process.stderr.write(`skip (${parsed.error})\n`);
        continue;
      }

      for (const label of parsed.unknownTagLabels ?? []) {
        unmappedPeopleTags.add(label);
      }

      let imagePath: string | null = null;
      if (parsed.photoUrl) {
        try {
          const buf = await fetchBuffer(parsed.photoUrl);
          const ext = extFromUrl(parsed.photoUrl);
          const file = `${slug}.${ext}`;
          fs.writeFileSync(path.join(photoDir, file), buf);
          imagePath = `/people-photos/${file}`;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push({ slug, err: `photo: ${msg}` });
        }
      }

      const bioHint = parsed.paragraphs.join(' ').slice(0, 4000);
      const row: Record<string, unknown> = {
        slug: parsed.slug,
        name: parsed.name,
        role: parsed.role,
        office: parsed.office,
        officeId: parsed.officeId,
        seniority: parsed.seniority,
        practiceGroup: inferPracticeGroup(parsed.role, parsed.expertise, bioHint),
        expertise: parsed.expertise,
        paragraphs: parsed.paragraphs,
        imagePath,
        profileUpdatedAt: importRunIso,
      };
      if (parsed.sameAs?.length) row.sameAs = parsed.sameAs;
      results.push(row);
      process.stderr.write('ok\n');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push({ slug, err: msg });
      process.stderr.write(`ERR ${msg}\n`);
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(outJsonPath, JSON.stringify(results, null, 2) + '\n');
  fs.writeFileSync(
    path.join(siteRoot, 'src/data/people-import-errors.json'),
    JSON.stringify(errors, null, 2) + '\n',
  );

  console.log(`\nWrote ${results.length} profiles → ${path.relative(process.cwd(), outJsonPath)}`);
  console.log(`Photos → ${path.relative(process.cwd(), photoDir)}`);
  console.log(`Errors: ${errors.length} (see src/data/people-import-errors.json)`);
  if (unmappedPeopleTags.size) {
    console.log(
      '\nUnmapped CMS people tags (extend TAG_TO_EXPERTISE or NON_EXPERTISE_TAG_LABELS): ' +
        [...unmappedPeopleTags].sort().join(', '),
    );
  }
  console.log('\nNext: npm run optimize:people-photos — or npm run import:people:full');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
