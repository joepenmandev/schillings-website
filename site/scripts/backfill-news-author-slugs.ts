/**
 * Backfills `authorSlugs` on `src/data/news-imported.json` using
 * `src/data/news-author-mapping.json` (legacyAuthorRaw -> person slug).
 *
 * Idempotent: skips rows that already have the correct single slug.
 * Run: npm run backfill:news-authors
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseImportedArticleRecord } from '../src/lib/article-import-schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const newsPath = path.join(siteRoot, 'src/data/news-imported.json');
const mapPath = path.join(siteRoot, 'src/data/news-author-mapping.json');

type MappingFile = {
  mappings: { legacyAuthorRaw: string; personSlug: string }[];
};

function main() {
  const mapping: MappingFile = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const legacyToSlug = new Map(mapping.mappings.map((m) => [m.legacyAuthorRaw.trim(), m.personSlug.trim()]));

  const rows = JSON.parse(fs.readFileSync(newsPath, 'utf8')) as unknown[];
  let updated = 0;
  let skippedConflict = 0;

  const out = rows.map((row) => {
    const r = row as Record<string, unknown>;
    const rawAuthor = r.legacyAuthorRaw;
    if (typeof rawAuthor !== 'string') return row;
    const personSlug = legacyToSlug.get(rawAuthor.trim());
    if (!personSlug) return row;

    const existing = r.authorSlugs;
    if (Array.isArray(existing)) {
      const slugs = existing.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
      if (slugs.length === 1 && slugs[0] === personSlug) return row;
      if (slugs.length > 0) {
        console.warn(
          `[backfill-news-author-slugs] skip ${String(r.slug)}: authorSlugs already ${JSON.stringify(slugs)} (mapped ${personSlug})`,
        );
        skippedConflict += 1;
        return row;
      }
    }

    updated += 1;
    return { ...r, authorSlugs: [personSlug] };
  });

  for (const row of out) {
    parseImportedArticleRecord(row);
  }

  fs.writeFileSync(newsPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log(`backfill-news-author-slugs: wrote ${updated} row(s); skipped conflicts: ${skippedConflict}`);
}

main();
