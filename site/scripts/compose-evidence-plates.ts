/**
 * Editorial evidence plate compositor.
 * Assembles manually curated fragments — does not invent imagery or layouts.
 * Doctrine: site/docs/briefing-may-2026/VISUAL-COMPOSITION-PROMPTS.md
 */
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SITE_ROOT, '..');

type FitMode = 'cover' | 'contain';
type CropPosition = string;

interface PlateManifest {
  id: string;
  description?: string;
  outputFile: string;
  canvas: { width: number; height: number; background: string };
  silenceMargin?: { top: number; bottom: number; left: number; right: number };
  fragments: FragmentSpec[];
}

interface FragmentSpec {
  id: string;
  source: string;
  zIndex: number;
  region: { x: number; y: number; width: number; height: number };
  /** If true and source is missing, fragment is skipped (warn only). */
  optional?: boolean;
  /** Extract from source before resize — editorial micro-crop of capture. */
  sourceRect?: { left: number; top: number; width: number; height: number };
  fit?: FitMode;
  position?: CropPosition;
  edgeBleed?: { extendWidth?: number; extendHeight?: number };
  /** Layer opacity 0–1. Use sparingly on subordinate / archival layers. */
  opacity?: number;
  treatment?: Record<string, unknown>;
  archival?: {
    grayscale?: boolean;
    linear?: [number, number];
    gamma?: number;
    desaturateExtra?: number;
  };
}

const getArgValue = (flag: string) => process.argv.find((a) => a.startsWith(`${flag}=`))?.slice(flag.length + 1);

function resolveRepoPath(p: string): string {
  return path.isAbsolute(p) ? p : path.join(REPO_ROOT, p);
}

function parseHexBg(hex: string): { r: number; g: number; b: number } {
  const s = hex.replace('#', '');
  const n = parseInt(s.length === 3 ? s.split('').map((c) => c + c).join('') : s, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

async function loadManifest(manifestPath: string): Promise<PlateManifest> {
  const raw = await fs.readFile(manifestPath, 'utf8');
  return JSON.parse(raw) as PlateManifest;
}

function regionWithBleed(region: FragmentSpec['region'], bleed?: FragmentSpec['edgeBleed']) {
  const w = region.width + (bleed?.extendWidth ?? 0);
  const h = region.height + (bleed?.extendHeight ?? 0);
  return { ...region, width: w, height: h };
}

async function renderFragmentToBox(
  sourcePath: string,
  boxW: number,
  boxH: number,
  fit: FitMode,
  position: CropPosition,
  sourceRect: FragmentSpec['sourceRect'],
  archival?: FragmentSpec['archival'],
): Promise<Buffer> {
  let pipe = sharp(sourcePath).rotate();

  if (sourceRect) {
    pipe = pipe.extract({
      left: Math.round(sourceRect.left),
      top: Math.round(sourceRect.top),
      width: Math.round(sourceRect.width),
      height: Math.round(sourceRect.height),
    });
  }

  if (archival?.grayscale) pipe = pipe.grayscale();

  pipe = pipe.resize(boxW, boxH, {
    fit: fit === 'cover' ? sharp.fit.cover : sharp.fit.contain,
    position: position,
  });

  if (archival?.gamma != null && archival.gamma > 0) {
    pipe = pipe.gamma(archival.gamma);
  }

  if (archival?.linear) {
    const [a, b] = archival.linear;
    pipe = pipe.linear(a, b);
  }

  const buf = await pipe.png().toBuffer();
  if (archival?.desaturateExtra && archival.desaturateExtra > 0) {
    return sharp(buf).modulate({ saturation: 1 - archival.desaturateExtra }).png().toBuffer();
  }
  return buf;
}

async function composePlate(manifest: PlateManifest): Promise<void> {
  const { width: cw, height: ch, background } = manifest.canvas;
  const bg = parseHexBg(background);

  const sorted = [...manifest.fragments].sort((a, b) => a.zIndex - b.zIndex);
  const layers: sharp.OverlayOptions[] = [];
  const m = manifest.silenceMargin ?? { top: 0, bottom: 0, left: 0, right: 0 };

  for (const frag of sorted) {
    const src = resolveRepoPath(frag.source);
    if (!existsSync(src)) {
      if (frag.optional) {
        // eslint-disable-next-line no-console
        console.warn(`Skipping optional fragment (${frag.id}): missing ${src}`);
        continue;
      }
      throw new Error(`Missing source fragment (${frag.id}): ${src}\nAdd real crops under artifacts/briefing-may-2026/source-material/`);
    }

    const fit = frag.fit ?? 'cover';
    const position = (frag.position ?? 'north') as CropPosition;
    const { width: rw, height: rh } = regionWithBleed(frag.region, frag.edgeBleed);
    const buf = await renderFragmentToBox(src, rw, rh, fit, position, frag.sourceRect, frag.archival);

    layers.push({
      input: buf,
      left: Math.round(frag.region.x + m.left),
      top: Math.round(frag.region.y + m.top),
      blend: 'over',
      ...(frag.opacity != null && frag.opacity < 1 ? { opacity: frag.opacity } : {}),
    });
  }

  if (layers.length === 0) {
    throw new Error('No fragments composed (all missing or optional-only skips).');
  }

  await sharp({
    create: {
      width: cw,
      height: ch,
      channels: 3,
      background: bg,
    },
  })
    .composite(layers)
    .png()
    .toFile(path.join(REPO_ROOT, 'artifacts', 'briefing-may-2026', 'composed-plates', manifest.outputFile));
}

async function main() {
  const manifestRel = getArgValue('--manifest') ?? 'site/docs/briefing-may-2026/plates/page-2.manifest.json';
  const manifestPath = resolveRepoPath(manifestRel.startsWith('site/') ? manifestRel : path.join('site', manifestRel));

  if (!existsSync(manifestPath)) {
    throw new Error(`Manifest not found: ${manifestPath}`);
  }

  const outDir = path.join(REPO_ROOT, 'artifacts', 'briefing-may-2026', 'composed-plates');
  await fs.mkdir(outDir, { recursive: true });

  const manifest = await loadManifest(manifestPath);
  await composePlate(manifest);

  const outFile = path.join(outDir, manifest.outputFile);
  // eslint-disable-next-line no-console
  console.log(`Composed evidence plate:\n- ${outFile}\n- manifest: ${manifestPath}`);
}

await main();
