/**
 * Resize headshots to max width and WebP for smaller deploy / git size.
 * Updates `people-imported.json` `imagePath` to `.webp` and removes originals.
 *
 * Run: node site/scripts/optimize-people-photos.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.join(__dirname, '..');
const photoDir = path.join(siteRoot, 'public/people-photos');
const jsonPath = path.join(siteRoot, 'src/data/people-imported.json');

const MAX_WIDTH = 960;
const WEBP_QUALITY = 82;

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (const row of data) {
  if (!row.imagePath || typeof row.imagePath !== 'string') continue;
  const rel = row.imagePath.replace(/^\//, '');
  const absIn = path.join(siteRoot, 'public', rel);
  if (!fs.existsSync(absIn)) {
    console.warn('skip missing file:', rel);
    continue;
  }

  const slug = path.basename(rel).replace(/\.(jpe?g|png|webp)$/i, '');
  const outAbs = path.join(photoDir, `${slug}.webp`);

  try {
    await sharp(absIn)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: 'inside',
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(outAbs + '.tmp');
    fs.renameSync(outAbs + '.tmp', outAbs);
    if (path.normalize(absIn) !== path.normalize(outAbs)) {
      fs.unlinkSync(absIn);
    }
    row.imagePath = `/people-photos/${slug}.webp`;
    process.stderr.write(`${slug}.webp `);
  } catch (e) {
    console.warn('\nfailed', slug, e.message);
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2) + '\n');
process.stderr.write(`\nUpdated ${jsonPath}\n`);
