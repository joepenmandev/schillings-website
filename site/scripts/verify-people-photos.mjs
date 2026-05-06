/**
 * Ensures every `imagePath` in people-imported.json exists under `public/`.
 * Run: npm run verify:people-photos
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const jsonPath = path.join(siteRoot, 'src/data/people-imported.json');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const missing = [];

for (const row of data) {
  if (!row.imagePath || typeof row.imagePath !== 'string') continue;
  const rel = row.imagePath.replace(/^\//, '');
  const abs = path.join(siteRoot, 'public', rel);
  if (!fs.existsSync(abs)) missing.push({ slug: row.slug, imagePath: row.imagePath });
}

if (missing.length) {
  console.error(
    `Missing ${missing.length} file(s) under site/public/ (see people-imported.json imagePath):\n` +
      missing.map((m) => `  ${m.slug}: ${m.imagePath}`).join('\n'),
  );
  console.error('\nFix: npm run import:people:full (syncs from live + optimizes WebP).');
  process.exit(1);
}

const withPhoto = data.filter((r) => r.imagePath).length;
console.log(`verify-people-photos: OK (${withPhoto} paths match files under public/).`);
