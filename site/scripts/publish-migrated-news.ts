/**
 * Move migrated news rows from `migrated-unreviewed` to `published` in `src/data/news-imported.json`.
 *
 * Default: dry-run (prints counts and slugs, writes nothing).
 * Apply: `npm run publish:migrated-news -- --write --confirm`
 *
 * Optional: `--slug=my-article-slug` to publish one row only (must still be `migrated-unreviewed`).
 *
 * After a full re-import (`import:news --write`), re-run `npm run backfill:news-authors` if the
 * importer overwrote `authorSlugs`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const newsPath = path.join(siteRoot, 'src/data/news-imported.json');

type Row = Record<string, unknown>;

function parseArgs(argv: string[]) {
  const write = argv.includes('--write');
  const confirm = argv.includes('--confirm');
  let slug: string | undefined;
  for (const a of argv) {
    if (a.startsWith('--slug=')) slug = a.slice('--slug='.length).trim() || undefined;
  }
  return { write, confirm, slug };
}

function main() {
  const { write, confirm, slug } = parseArgs(process.argv.slice(2));

  const raw = fs.readFileSync(newsPath, 'utf8');
  const rows = JSON.parse(raw) as Row[];

  const pending = rows.filter((r) => r.status === 'migrated-unreviewed');
  const toPublish = slug
    ? pending.filter((r) => r.slug === slug)
    : [...pending];

  if (slug && pending.some((r) => r.slug === slug) === false) {
    const exists = rows.some((r) => r.slug === slug);
    console.error(
      exists
        ? `No row with slug "${slug}" has status migrated-unreviewed (already published or other status).`
        : `No row with slug "${slug}" in ${newsPath}.`,
    );
    process.exit(1);
  }

  console.log(`Total rows: ${rows.length}`);
  console.log(`migrated-unreviewed: ${pending.length}`);
  console.log(`Would publish: ${toPublish.length}`);
  for (const r of toPublish.slice(0, 50)) {
    console.log(`  - ${String(r.slug)}`);
  }
  if (toPublish.length > 50) console.log(`  … and ${toPublish.length - 50} more`);

  if (!write) {
    console.log('\nDry-run only. Pass --write --confirm to update the JSON file.');
    return;
  }

  if (!confirm) {
    console.error('\nRefusing to write without --confirm (safety). Re-run with both --write and --confirm.');
    process.exit(1);
  }

  let updated = 0;
  const slugSet = new Set(toPublish.map((r) => String(r.slug)));
  const out = rows.map((r) => {
    if (r.status !== 'migrated-unreviewed') return r;
    if (slug && !slugSet.has(String(r.slug))) return r;
    updated++;
    return { ...r, status: 'published' };
  });

  fs.writeFileSync(newsPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log(`\nWrote ${newsPath}: ${updated} row(s) set to published.`);
  console.log('If you re-imported news and lost author links, run: npm run backfill:news-authors');
}

main();
