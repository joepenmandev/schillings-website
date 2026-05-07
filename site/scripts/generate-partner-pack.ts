import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { chromium, type PDFOptions, type Page } from '@playwright/test';

type AnnotationPosition = 'top-right' | 'left-middle' | 'bottom-right';
type RunEnv = 'production' | 'staging' | 'local';
type LoadState = 'load' | 'domcontentloaded' | 'networkidle';
type PackMode = 'partner' | 'internal' | 'partner-v2';

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}
interface Annotation {
  position: AnnotationPosition;
  text: string;
}
interface MobileInset {
  enabled: boolean;
  source: 'before' | 'after';
  crop: CropRect;
  targetWidth: number;
  position: 'bottom-right';
  referenceExampleId?: string;
}
interface ObservationRow {
  observation: string;
  whyItMatters: string;
}
interface Example {
  id: string;
  title: string;
  type: string;
  beforeUrl: string;
  afterUrl: string;
  crop: CropRect;
  annotations: Annotation[];
  mobileInset?: MobileInset;
  observation?: ObservationRow;
  scaleSignal?: string;
  strategicImplication?: string;
}
interface Config {
  mode?: PackMode;
  compositionSystem?: 'editorial' | 'standard';
  pageCompositions?: Array<'statement-cover' | 'hero-right' | 'quiet-evidence' | 'full-bleed-closing'>;
  failOnRuntimeUi?: boolean;
  editorialAsymmetry?: boolean;
  compositionWeighting?: {
    imageDominance?: number;
    textDensity?: number;
    negativeSpace?: number;
  };
  branding?: {
    logoPath?: string;
  };
  proofPlaceholders?: boolean;
  v2Stage?: 'proof' | 'full';
  placeholderAssets?: {
    page2?: {
      newDominant?: string;
      oldInset?: string;
    };
    page3?: {
      newDominant?: string;
      oldInset?: string;
    };
    page4?: {
      newDominant?: string;
      oldInset?: string;
    };
  };
  meta: {
    title: string;
    subtitle: string;
    confidentialLabel: string;
    version: string;
    preparedFor?: string;
    openingStatement?: string;
  };
  viewport: { width: number; height: number; zoom: number };
  outputDir: string;
  captureLock: boolean;
  pdf: { format: 'A4' | 'Letter'; landscape: boolean; printBackground: boolean };
  capture?: { timeoutMs?: number; retries?: number; waitUntil?: LoadState };
  environments?: Record<RunEnv, { beforeBaseUrl?: string; afterBaseUrl?: string }>;
  summary: { whatPartnersShouldNotice: string };
  readinessStrip: string[];
  examples: Example[];
  partnerNarrative?: {
    materiallyImprovedTable?: Array<{ area: string; improvement: string }>;
    deliberateDecisions?: string[];
    internationalSummary?: string;
    operationalMaturityParagraph?: string;
    closingStrip?: string;
  };
}

function resolvePlaceholderFile(out: ReturnType<typeof outputPaths>, fileName?: string): string | undefined {
  if (!fileName) return undefined;
  const p = path.join(out.root, 'placeholders', fileName);
  if (!existsSync(p)) return undefined;
  return `file://${path.resolve(p)}`;
}
interface CliOptions {
  configPath: string;
  skipCapture: boolean;
  env: RunEnv;
  beforeBaseUrl?: string;
  afterBaseUrl?: string;
  modeOverride?: PackMode;
}

interface RuntimeValidationResult {
  ok: boolean;
  signature?: string;
  screenshotPath?: string;
}

const SAFE_MARGIN = 40;
const ALLOWED_ANNOTATION_POSITIONS = new Set<AnnotationPosition>(['top-right', 'left-middle', 'bottom-right']);

const toSharpExtract = (rect: CropRect) => ({ left: rect.x, top: rect.y, width: rect.width, height: rect.height });
const getArgValue = (flag: string) => process.argv.find((a) => a.startsWith(`${flag}=`))?.slice(flag.length + 1);
const hasFlag = (flag: string) => process.argv.includes(flag);

function parseCliOptions(): CliOptions {
  const envArg = getArgValue('--env');
  const modeArg = getArgValue('--mode');
  return {
    configPath: path.resolve(process.cwd(), getArgValue('--config') ?? 'docs/partner-pack/partner-pack.config.json'),
    skipCapture: hasFlag('--skip-capture'),
    env: envArg && ['production', 'staging', 'local'].includes(envArg) ? (envArg as RunEnv) : 'local',
    beforeBaseUrl: getArgValue('--beforeBaseUrl'),
    afterBaseUrl: getArgValue('--afterBaseUrl'),
    modeOverride: modeArg && ['partner', 'internal', 'partner-v2'].includes(modeArg) ? (modeArg as PackMode) : undefined,
  };
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}
async function loadConfig(configPath: string): Promise<Config> {
  return JSON.parse(await fs.readFile(configPath, 'utf8')) as Config;
}
const isPositiveNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;
const isNonNegativeNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;

function validateCrop(rect: CropRect | undefined, label: string, errors: string[]) {
  if (!rect) return void errors.push(`${label} is required.`);
  if (!isNonNegativeNumber(rect.x)) errors.push(`${label}.x must be >= 0`);
  if (!isNonNegativeNumber(rect.y)) errors.push(`${label}.y must be >= 0`);
  if (!isPositiveNumber(rect.width)) errors.push(`${label}.width must be > 0`);
  if (!isPositiveNumber(rect.height)) errors.push(`${label}.height must be > 0`);
}

function validateConfig(config: Config) {
  const errors: string[] = [];
  const allIds = new Set((config.examples ?? []).map((e) => e.id).filter(Boolean));
  if (!config.viewport) errors.push('viewport is required');
  if (config.viewport && (!isPositiveNumber(config.viewport.width) || !isPositiveNumber(config.viewport.height))) {
    errors.push('viewport.width/height must be positive numbers');
  }
  if (!config.pdf) errors.push('pdf settings are required');
  if (config.pdf && !['A4', 'Letter'].includes(config.pdf.format)) errors.push('pdf.format must be A4 or Letter');
  if (!Array.isArray(config.examples) || !config.examples.length) errors.push('examples[] is required');
  const w = config.compositionWeighting;
  if (w) {
    if (w.imageDominance !== undefined && (w.imageDominance <= 0 || w.imageDominance >= 1)) {
      errors.push('compositionWeighting.imageDominance must be between 0 and 1');
    }
    if (w.textDensity !== undefined && (w.textDensity <= 0 || w.textDensity >= 1)) {
      errors.push('compositionWeighting.textDensity must be between 0 and 1');
    }
    if (w.negativeSpace !== undefined && (w.negativeSpace <= 0 || w.negativeSpace >= 1)) {
      errors.push('compositionWeighting.negativeSpace must be between 0 and 1');
    }
  }

  const seen = new Set<string>();
  for (const [i, ex] of (config.examples ?? []).entries()) {
    const p = `examples[${i}]`;
    if (!ex.id) errors.push(`${p}.id is required`);
    if (ex.id && seen.has(ex.id)) errors.push(`${p}.id must be unique`);
    if (ex.id) seen.add(ex.id);
    if (!ex.beforeUrl) errors.push(`${p}.beforeUrl is required`);
    if (!ex.afterUrl) errors.push(`${p}.afterUrl is required`);
    validateCrop(ex.crop, `${p}.crop`, errors);
    if (!Array.isArray(ex.annotations) || !ex.annotations.length) errors.push(`${p}.annotations[] is required`);
    for (const [j, a] of (ex.annotations ?? []).entries()) {
      if (!ALLOWED_ANNOTATION_POSITIONS.has(a.position)) {
        errors.push(`${p}.annotations[${j}].position must be one of top-right,left-middle,bottom-right`);
      }
    }
    if (ex.mobileInset?.enabled) {
      validateCrop(ex.mobileInset.crop, `${p}.mobileInset.crop`, errors);
      if (!isPositiveNumber(ex.mobileInset.targetWidth)) errors.push(`${p}.mobileInset.targetWidth must be > 0`);
      if (!['before', 'after'].includes(ex.mobileInset.source)) errors.push(`${p}.mobileInset.source must be before|after`);
      if (ex.mobileInset.referenceExampleId && !allIds.has(ex.mobileInset.referenceExampleId)) {
        errors.push(`${p}.mobileInset.referenceExampleId must reference an existing example id`);
      }
    }
  }
  if (errors.length) throw new Error(`Invalid partner-pack config:\n- ${errors.join('\n- ')}`);
}

function annotationAnchor(position: AnnotationPosition, width: number, height: number) {
  if (position === 'top-right') return { x: width - SAFE_MARGIN - 320, y: SAFE_MARGIN + 24, tx: width - SAFE_MARGIN, ty: SAFE_MARGIN + 24, anchor: 'end' as const };
  if (position === 'left-middle') return { x: SAFE_MARGIN, y: Math.floor(height / 2) - 40, tx: SAFE_MARGIN + 320, ty: Math.floor(height / 2), anchor: 'start' as const };
  return { x: width - SAFE_MARGIN - 320, y: height - SAFE_MARGIN - 110, tx: width - SAFE_MARGIN, ty: height - SAFE_MARGIN - 24, anchor: 'end' as const };
}
function wrapLines(text: string, maxChars = 48): string[] {
  const words = text.trim().split(/\s+/);
  const out: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      out.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) out.push(cur);
  return out.slice(0, 3);
}
function escapeHtml(v: string) {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildAnnotationSvg(width: number, height: number, annotations: Annotation[], mode: PackMode): Buffer {
  const selected = mode === 'partner' ? annotations.slice(0, 1) : annotations;
  const blocks = selected
    .map((a) => {
      const p = annotationAnchor(a.position, width, height);
      const lines = wrapLines(a.text);
      const lineHeight = 18;
      const textY = p.y + 16;
      const leaderX1 = p.anchor === 'end' ? p.x : p.x + 280;
      const leaderX2 = p.anchor === 'end' ? p.tx - 8 : p.tx + 8;
      const lineEls = lines
        .map((line, idx) => `<text x="${p.x + 2}" y="${textY + idx * lineHeight}" fill="#1f2937" font-size="14">${escapeHtml(line)}</text>`)
        .join('');
      const box = mode === 'partner' ? '' : `<rect x="${p.x - 10}" y="${p.y - 6}" width="296" height="${20 + lines.length * lineHeight}" rx="6" ry="6" fill="#f9fafb" fill-opacity="0.92" stroke="#9ca3af" stroke-width="1" />`;
      return `${box}<line x1="${leaderX1}" y1="${p.ty + 3}" x2="${leaderX2}" y2="${p.ty}" stroke="#6b7280" stroke-width="1" /><circle cx="${p.tx}" cy="${p.ty}" r="2.5" fill="#4b5563" />${lineEls}`;
    })
    .join('\n');
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;}</style>${blocks}</svg>`);
}

function outputPaths(root: string) {
  const shots = path.join(root, 'screenshots');
  return { root, raw: path.join(shots, 'raw'), cropped: path.join(shots, 'cropped'), annotated: path.join(shots, 'annotated'), html: path.join(root, 'partner-pack.html'), pdf: path.join(root, 'partner-pack.pdf') };
}
function normalizeUrl(raw: string, baseUrl?: string) {
  if (!baseUrl) return raw;
  if (/^https?:\/\//i.test(raw)) {
    const u = new URL(raw);
    return new URL(`${u.pathname}${u.search}${u.hash}`, baseUrl).toString();
  }
  return new URL(raw, baseUrl).toString();
}
function resolveBaseUrls(config: Config, cli: CliOptions) {
  const env = config.environments?.[cli.env] ?? {};
  return { beforeBaseUrl: cli.beforeBaseUrl ?? env.beforeBaseUrl, afterBaseUrl: cli.afterBaseUrl ?? env.afterBaseUrl };
}

async function detectLocalAstroBaseUrl(): Promise<string | undefined> {
  const ports = [4321, 4322, 4323, 4324, 4325, 4326, 4327];
  for (const port of ports) {
    const base = `http://localhost:${port}`;
    try {
      const res = await fetch(`${base}/people/jenny-afia/`, { redirect: 'follow' });
      if (!res.ok) continue;
      const text = await res.text();
      if (/jenny afia|schillings/i.test(text)) return base;
    } catch {
      // Try next port.
    }
  }
  return undefined;
}
async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}
async function ensureSkipCaptureAssets(config: Config, out: ReturnType<typeof outputPaths>) {
  const missing: string[] = [];
  for (const ex of config.examples) {
    for (const side of ['before', 'after'] as const) {
      const c = path.join(out.cropped, `${ex.id}-${side}.png`);
      const a = path.join(out.annotated, `${ex.id}-${side}.png`);
      if (!(await exists(c))) missing.push(c);
      if (!(await exists(a))) missing.push(a);
    }
  }
  if (missing.length) throw new Error(`--skip-capture requires existing cropped/annotated assets. Missing:\n- ${missing.join('\n- ')}`);
}

async function captureWithRetry(page: Page, url: string, outputPath: string, timeoutMs: number, waitUntil: LoadState, retries: number) {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      await page.goto(url, { waitUntil, timeout: timeoutMs });
      await page.screenshot({ path: outputPath, fullPage: true });
      return;
    } catch (err) {
      lastErr = err;
      // eslint-disable-next-line no-console
      console.error(`Capture failed (${attempt + 1}/${retries + 1}) for URL: ${url}`);
    }
  }
  throw new Error(`Capture failed for URL: ${url}\n${String(lastErr)}`);
}

async function assertNoRuntimeUi(page: Page, url: string, rawScreenshotPath: string): Promise<RuntimeValidationResult> {
  const { text, imageCount } = await page.evaluate(() => {
    const t = (document.body?.innerText ?? '').slice(0, 12000);
    const images = document.images?.length ?? 0;
    return { text: t, imageCount: images };
  });
  const normalized = text.toLowerCase();
  const forbidden = [
    'runtime error',
    'stack trace',
    'cannot find module',
    'vite',
    'astro',
    'hydration',
    'cannot read properties',
    'cannot read property',
    '/@vite/client',
    'localhost:',
    'error:',
    '404 page not found',
    'loading skeleton',
  ];
  const hit = forbidden.find((k) => normalized.includes(k));
  if (hit) {
    return { ok: false, signature: hit, screenshotPath: rawScreenshotPath };
  }
  if (normalized.trim().length < 80 && imageCount === 0) {
    return { ok: false, signature: 'blank page', screenshotPath: rawScreenshotPath };
  }
  return { ok: true };
}

async function captureScreenshots(config: Config, out: ReturnType<typeof outputPaths>, beforeBaseUrl?: string, afterBaseUrl?: string) {
  const timeoutMs = config.capture?.timeoutMs ?? 30000;
  const retries = config.capture?.retries ?? 1;
  const waitUntil = config.capture?.waitUntil ?? 'networkidle';
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: config.viewport.width, height: config.viewport.height },
    deviceScaleFactor: config.viewport.zoom,
  });
  const page = await context.newPage();
  const validations: Array<{ url: string; result: RuntimeValidationResult }> = [];
  for (const ex of config.examples) {
    const beforeUrl = normalizeUrl(ex.beforeUrl, beforeBaseUrl);
    const afterUrl = normalizeUrl(ex.afterUrl, afterBaseUrl);
    const beforeRaw = path.join(out.raw, `${ex.id}-before.png`);
    const afterRaw = path.join(out.raw, `${ex.id}-after.png`);
    await captureWithRetry(page, beforeUrl, beforeRaw, timeoutMs, waitUntil, retries);
    if (config.failOnRuntimeUi ?? true) validations.push({ url: beforeUrl, result: await assertNoRuntimeUi(page, beforeUrl, beforeRaw) });
    await captureWithRetry(page, afterUrl, afterRaw, timeoutMs, waitUntil, retries);
    if (config.failOnRuntimeUi ?? true) validations.push({ url: afterUrl, result: await assertNoRuntimeUi(page, afterUrl, afterRaw) });
  }
  const failed = validations.find((v) => !v.result.ok);
  if (failed) {
    await context.close();
    await browser.close();
    throw new Error(
      `Screenshot validation failed.\nURL: ${failed.url}\nMatched signature: ${failed.result.signature}\nScreenshot: ${failed.result.screenshotPath}`,
    );
  }
  await context.close();
  await browser.close();
}

async function cropAndAnnotate(config: Config, out: ReturnType<typeof outputPaths>, mode: PackMode) {
  for (const ex of config.examples) {
    for (const side of ['before', 'after'] as const) {
      const raw = path.join(out.raw, `${ex.id}-${side}.png`);
      const cropped = path.join(out.cropped, `${ex.id}-${side}.png`);
      const annotated = path.join(out.annotated, `${ex.id}-${side}.png`);
      await sharp(raw).extract(toSharpExtract(ex.crop)).png().toFile(cropped);
      let base = sharp(cropped);
      if (mode !== 'partner-v2') {
        base = base.composite([{ input: buildAnnotationSvg(ex.crop.width, ex.crop.height, ex.annotations, mode), left: 0, top: 0 }]);
      }
      if (ex.mobileInset?.enabled && ex.mobileInset.source === side) {
        const mobile = await sharp(raw).extract(toSharpExtract(ex.mobileInset.crop)).resize({ width: ex.mobileInset.targetWidth }).png().toBuffer();
        const meta = await sharp(mobile).metadata();
        const iw = meta.width ?? ex.mobileInset.targetWidth;
        const ih = meta.height ?? 0;
        const left = Math.max(SAFE_MARGIN, ex.crop.width - SAFE_MARGIN - iw);
        const top = Math.max(SAFE_MARGIN, ex.crop.height - SAFE_MARGIN - ih);
        const frame = Buffer.from(`<svg width="${iw + 8}" height="${ih + 8}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${iw + 8}" height="${ih + 8}" rx="6" ry="6" fill="#ffffff" stroke="#9ca3af" stroke-width="1" /></svg>`);
        base = base.composite([{ input: frame, left: left - 4, top: top - 4 }, { input: mobile, left, top }]);
      }
      await base.png().toFile(annotated);
    }
  }
}

function printOptionsFromConfig(config: Config): PDFOptions {
  return { format: config.pdf.format, landscape: config.pdf.landscape, printBackground: config.pdf.printBackground, preferCSSPageSize: true };
}

function row(observation: ObservationRow | undefined) {
  if (!observation) return '';
  return `<table class="obs"><thead><tr><th>Observation</th><th>Why it matters</th></tr></thead><tbody><tr><td>${escapeHtml(observation.observation)}</td><td>${escapeHtml(observation.whyItMatters)}</td></tr></tbody></table>`;
}
function pair(ex: Example, out: ReturnType<typeof outputPaths>, dominantNew = false) {
  const b = `file://${path.resolve(path.join(out.annotated, `${ex.id}-before.png`))}`;
  const a = `file://${path.resolve(path.join(out.annotated, `${ex.id}-after.png`))}`;
  const klass = dominantNew ? 'shots dominant-new' : 'shots';
  return `<section class="pair"><div class="labels"><div>Current live experience</div><div>New platform experience</div></div><div class="${klass}"><img src="${b}" alt="Current live experience for ${escapeHtml(ex.title)}" /><img src="${a}" alt="New platform experience for ${escapeHtml(ex.title)}" /></div>${row(ex.observation)}</section>`;
}

function renderPartnerHtml(config: Config, out: ReturnType<typeof outputPaths>): string {
  const p = config.partnerNarrative ?? {};
  const compositions = config.pageCompositions ?? ['statement-cover', 'hero-right', 'quiet-evidence', 'full-bleed-closing'];
  const profile = config.examples[0];
  const expertise = config.examples[1];
  const logoFile = config.branding?.logoPath
    ? `file://${path.resolve(process.cwd(), `public${config.branding.logoPath.startsWith('/') ? config.branding.logoPath : `/${config.branding.logoPath}`}`)}`
    : '';
  const imageDominance = config.compositionWeighting?.imageDominance ?? 0.78;
  const minorPane = Math.max(1, Math.round((1 - imageDominance) * 10));
  const majorPane = Math.max(1, Math.round(imageDominance * 10));
  const opening = escapeHtml(
    config.meta.openingStatement ??
      "The objective was to ensure the firm's online presence more accurately reflects the quality, discretion and sophistication of the work itself.",
  );

  const pageMap: Record<string, string> = {
    'statement-cover': `<section class="page cover">${logoFile ? `<img class="logo" src="${logoFile}" alt="Schillings" />` : ''}<h1>${escapeHtml(config.meta.title)}</h1><h3>${escapeHtml(config.meta.subtitle)}</h3><div class="meta">${escapeHtml(config.meta.preparedFor ?? 'Prepared for internal review | May 2026')}</div><p class="statement">${opening}</p><div class="footer-note">${escapeHtml(config.meta.confidentialLabel)}</div></section>`,
    'hero-right': `<section class="page hero-right"><h2>Practitioner authority and validation</h2>${
      profile
        ? `<div class="hero-grid"><figure class="archive"><img src="file://${path.resolve(
            path.join(out.annotated, `${profile.id}-before.png`),
          )}" alt="Context view" /></figure><figure class="canonical"><img src="file://${path.resolve(
            path.join(out.annotated, `${profile.id}-after.png`),
          )}" alt="Current presentation" /></figure></div><p class="micro">${escapeHtml(profile.observation?.observation ?? '')}</p>`
        : ''
    }</section>`,
    'quiet-evidence': `<section class="page quiet-evidence"><h2>Expertise positioning and ownership</h2>${
      expertise
        ? `<figure class="single-proof"><img src="file://${path.resolve(
            path.join(out.annotated, `${expertise.id}-after.png`),
          )}" alt="Expertise presentation" /></figure><p class="micro">${escapeHtml(expertise.observation?.observation ?? '')}</p>`
        : ''
    }</section>`,
    'full-bleed-closing': `<section class="page closing"><div class="closing-copy">${
      p.closingStrip
        ? escapeHtml(p.closingStrip)
        : 'All substantive content remains human-written and human-reviewed. The platform was structured to support authority, clarity and discretion - rather than scaled content production.'
    }</div>${p.internationalSummary ? `<div class="tiny">${escapeHtml(p.internationalSummary)}</div>` : ''}</section>`,
  };

  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${escapeHtml(config.meta.title)}</title><style>
@page{size:A4 landscape;margin:12mm;}
body{font-family:"Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;color:#2d012b;background:#f5f2ef;margin:0;}
.page{min-height:184mm;page-break-after:always;padding:2mm 1mm 1mm;display:flex;flex-direction:column;position:relative;overflow:hidden;}
.page:last-child{page-break-after:auto;}
h1{font-size:44px;line-height:1.08;font-weight:500;margin:10mm 0 3mm;color:#2d012b;max-width:220mm;}
h2{font-size:31px;line-height:1.12;font-weight:500;margin:6mm 0 3mm;color:#2d012b;}
h3{font-size:12px;margin:0 0 2mm;color:#7d2442;font-weight:500;letter-spacing:.04em;text-transform:uppercase;}
p{font-size:12px;line-height:1.5;margin:0;color:#2d012b;}
.meta{font-size:10px;color:#7d2442;margin-bottom:10mm;}
.logo{width:170px;height:auto;opacity:.92;}
.cover::before{content:"";position:absolute;right:-28mm;top:-24mm;width:145mm;height:145mm;border-radius:50%;background:radial-gradient(circle at 35% 35%, rgba(125,36,66,.14), rgba(184,166,176,.08) 52%, rgba(245,242,239,0) 74%);}
.cover::after{content:"";position:absolute;left:-22mm;bottom:-34mm;width:170mm;height:115mm;background:linear-gradient(140deg, rgba(184,166,176,.14), rgba(245,242,239,0));transform:rotate(-8deg);}
.cover .statement{font-size:33px;line-height:1.16;max-width:230mm;color:#2d012b;position:relative;z-index:1;}
.cover .footer-note{margin-top:auto;font-size:10px;color:#7d2442;}
.hero-right h2{margin-bottom:3mm;}
.hero-grid{display:grid;grid-template-columns:${minorPane}fr ${majorPane}fr;gap:6mm;align-items:end;margin-top:3mm;position:relative;}
.archive{align-self:start;margin-top:10mm;}
.archive img{opacity:.46;filter:grayscale(1) contrast(.76);transform:scale(.86);transform-origin:top left;}
.canonical{margin-right:-18mm;}
.canonical img{width:calc(100% + 18mm);max-height:130mm;object-fit:cover;object-position:top;box-shadow:none;border:none;border-radius:0;}
.hero-grid img{display:block;}
.single-proof{margin-top:6mm;margin-right:-18mm;}
.single-proof img{width:calc(100% + 18mm);max-height:136mm;object-fit:cover;object-position:top;border:none;border-radius:0;display:block;}
.quiet-evidence h2{margin-bottom:2mm;}
.micro{margin-top:4mm;font-size:11px;color:#7d2442;max-width:190mm;}
.closing{justify-content:center;}
.closing::before{content:"";position:absolute;inset:-6mm;background:radial-gradient(ellipse at 72% 24%, rgba(125,36,66,.16), rgba(245,242,239,0) 58%), linear-gradient(165deg, rgba(184,166,176,.13), rgba(245,242,239,0) 60%);}
.closing-copy{font-size:42px;line-height:1.16;color:#2d012b;max-width:230mm;position:relative;z-index:1;}
.tiny{margin-top:16mm;font-size:10px;color:#7d2442;max-width:190mm;}
</style></head><body>
${compositions.map((c) => pageMap[c]).filter(Boolean).join('\n')}
</body></html>`;
}

function renderInternalHtml(config: Config, out: ReturnType<typeof outputPaths>): string {
  const rows = config.examples.map((ex) => pair(ex, out, false)).join('\n');
  const readiness = config.readinessStrip.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>${escapeHtml(config.meta.title)}</title><style>@page{size:A4 landscape;margin:12mm;}body{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;color:#111827;margin:0;background:#f8f8f7;}.page{background:#f8f8f7;padding:6mm 2mm;}h1{font-family:"Iowan Old Style","Times New Roman",serif;font-size:24px;font-weight:500;margin:0 0 4mm;color:#111;}h2{font-size:14px;margin:0 0 4mm;color:#374151;font-weight:500;}h3{margin:0 0 2mm;font-size:16px;font-weight:600;}p{margin:0 0 4mm;font-size:12px;line-height:1.5;color:#374151;}.meta{display:flex;justify-content:space-between;font-size:11px;color:#6b7280;margin-bottom:4mm;}.pair{margin:0 0 7mm;page-break-inside:avoid;}.strip{margin-top:4mm;border-top:1px solid #d1d5db;padding-top:3mm;}.strip ul{margin:0;padding-left:5mm;font-size:11px;color:#374151;columns:2;column-gap:10mm;}</style></head><body><div class="page"><div class="meta"><div>${escapeHtml(config.meta.confidentialLabel)}</div><div>${escapeHtml(config.meta.version)}</div></div><h1>${escapeHtml(config.meta.title)}</h1><h2>${escapeHtml(config.meta.subtitle)}</h2><p><strong>What partners should notice:</strong> ${escapeHtml(config.summary.whatPartnersShouldNotice)}</p>${rows}<section class="strip"><h3>Implementation and Readiness</h3><ul>${readiness}</ul></section></div></body></html>`;
}

function renderPartnerV2Page2ProofHtml(config: Config, out: ReturnType<typeof outputPaths>): string {
  const ex = config.examples[0];
  const logoFile = config.branding?.logoPath
    ? `file://${path.resolve(process.cwd(), `public${config.branding.logoPath.startsWith('/') ? config.branding.logoPath : `/${config.branding.logoPath}`}`)}`
    : '';
  const before = `file://${path.resolve(path.join(out.annotated, `${ex.id}-before.png`))}`;
  const after = `file://${path.resolve(path.join(out.annotated, `${ex.id}-after.png`))}`;
  const placeholders = config.proofPlaceholders ?? false;
  const placeholderBefore = resolvePlaceholderFile(out, config.placeholderAssets?.page2?.oldInset);
  const placeholderAfter = resolvePlaceholderFile(out, config.placeholderAssets?.page2?.newDominant);
  const beforeSrc = placeholders && placeholderBefore ? placeholderBefore : before;
  const afterSrc = placeholders && placeholderAfter ? placeholderAfter : after;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Partner pack v2 Page 2 proof</title><style>
@page{size:A4 landscape;margin:12mm;}
body{font-family:"Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;color:#2d012b;background:#f5f2ef;margin:0;}
.page{min-height:184mm;padding:3mm 2mm;display:flex;flex-direction:column;position:relative;overflow:hidden;}
h1{font-size:32px;line-height:1.1;font-weight:500;margin:0 0 3mm;color:#2d012b;}
p{font-size:13px;line-height:1.45;margin:0;color:#7d2442;max-width:190mm;}
.logo{width:150px;height:auto;opacity:.92;margin-bottom:4mm;}
.stage{display:grid;grid-template-columns:2fr 8fr;gap:8mm;align-items:end;margin-top:7mm;flex:1;}
.archival{align-self:start;margin-top:12mm;opacity:.44;filter:grayscale(1) contrast(.74);}
.archival img{width:100%;max-height:88mm;object-fit:cover;object-position:top;border:none;}
.canonical{margin-right:-20mm;}
.canonical img{width:calc(100% + 20mm);height:100%;max-height:135mm;object-fit:cover;object-position:top;border:none;display:block;}
.ph{border:1px solid #ceb8bf;background:#f8f5f3;color:#7d2442;display:flex;align-items:center;justify-content:center;text-align:center;padding:8mm;letter-spacing:.01em;}
.archival .ph{width:100%;max-height:88mm;min-height:64mm;}
.canonical .ph{width:calc(100% + 20mm);height:100%;max-height:135mm;min-height:120mm;}
.caption{margin-top:5mm;font-size:12px;color:#7d2442;}
</style></head><body>
<section class="page">
${logoFile ? `<img class="logo" src="${logoFile}" alt="Schillings" />` : ''}
<h1>Practitioner authority</h1>
<p>Practitioner profiles now present independent recognition and professional context more clearly.</p>
<div class="stage">
  <figure class="archival">${
    placeholders && !placeholderBefore
      ? `<div class="ph">Archival live-state inset<br/>Insert approved old-state screenshot crop<br/>Jenny Afia profile</div>`
      : `<img src="${beforeSrc}" alt="Current live context" />`
  }</figure>
  <figure class="canonical">${
    placeholders && !placeholderAfter
      ? `<div class="ph">Dominant new-state image area<br/>Insert approved new-state screenshot crop<br/>Jenny Afia profile</div>`
      : `<img src="${afterSrc}" alt="Current platform presentation" />`
  }</figure>
</div>
<p class="caption">Independent recognition and professional context are easier to validate.</p>
</section>
</body></html>`;
}

function renderPartnerV2FullHtml(config: Config, out: ReturnType<typeof outputPaths>): string {
  const logoFile = config.branding?.logoPath
    ? `file://${path.resolve(process.cwd(), `public${config.branding.logoPath.startsWith('/') ? config.branding.logoPath : `/${config.branding.logoPath}`}`)}`
    : '';
  const p2Before = resolvePlaceholderFile(out, config.placeholderAssets?.page2?.oldInset);
  const p2After = resolvePlaceholderFile(out, config.placeholderAssets?.page2?.newDominant);
  const p3Before = resolvePlaceholderFile(out, config.placeholderAssets?.page3?.oldInset);
  const p3After = resolvePlaceholderFile(out, config.placeholderAssets?.page3?.newDominant);
  const p4Before = resolvePlaceholderFile(out, config.placeholderAssets?.page4?.oldInset);
  const p4After = resolvePlaceholderFile(out, config.placeholderAssets?.page4?.newDominant);
  const ph = (label: string) => `<div class="ph">${label}</div>`;
  const li = (items: string[]) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const weaknesses = [
    'Inconsistent metadata framing across key page families.',
    'Weak practitioner-level trust signals on profile pages.',
    'Mixed page intent between profile, expertise and insight routes.',
    'Unclear expertise ownership in selected hubs.',
    'Inconsistent routing and authority presentation.',
  ];
  const trustSignals = [
    'Recognition badges mapped to independently verifiable profiles.',
    'Verified external profile links attached where available.',
    'People and expertise alignment made more explicit.',
    'Expertise ownership phrasing made more consistent.',
    'Practitioner profile authority presented with clearer context.',
  ];
  const oldVsNew = [
    'Old profile context diluted practitioner validation -> New profile context surfaces independent recognition more clearly.',
    'Old expertise pages blurred ownership intent -> New expertise pages separate ownership and service context.',
    'Old DR/ISD distinction could feel ambiguous -> New hub separation is more explicit in framing and route intent.',
  ];
  const metrics = ['96 practitioner profiles', '18 expertise hubs', '14 situations pages', '117 intelligence articles', '3 locales', '259 automated checks'];
  const readiness = config.readinessStrip ?? [];
  const internationalSummary =
    config.partnerNarrative?.internationalSummary ??
    'The international model uses UK as default with US and Ireland as alternates, applying disciplined hreflang alignment without artificial geo-targeting.';
  const operational =
    config.partnerNarrative?.operationalMaturityParagraph ??
    'Operational controls were retained to keep publishing selective, evidence-led and reputation-safe across principal route families.';
  const closing =
    config.partnerNarrative?.closingStrip ??
    'The platform was structured to support authority, clarity and discretion rather than scaled content production.';
  const decisions = config.partnerNarrative?.deliberateDecisions ?? [];
  const pair = (title: string, body: string, caption: string, before?: string, after?: string, notes?: string[]) => `
<section class="page">
  ${logoFile ? `<img class="logo" src="${logoFile}" alt="Schillings" />` : ''}
  <h2>${title}</h2>
  <p class="intro">${body}</p>
  <div class="stage">
    <figure class="archival">${before ? `<img src="${before}" alt="Archival context" />` : ph('Archival inset placeholder')}</figure>
    <figure class="canonical">${after ? `<img src="${after}" alt="Current platform context" />` : ph('Dominant new-state placeholder')}</figure>
  </div>
  <p class="caption">${caption}</p>
  ${notes?.length ? `<ul class="notes">${li(notes)}</ul>` : ''}
</section>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8" /><title>Partner pack v2</title><style>
@page{size:A4 landscape;margin:12mm;}
body{font-family:"Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;color:#2d012b;background:#f5f2ef;margin:0;}
.page{min-height:184mm;padding:3mm 2mm;display:flex;flex-direction:column;position:relative;overflow:hidden;page-break-after:always;}
.page:last-child{page-break-after:auto;}
.logo{width:150px;height:auto;opacity:.92;margin-bottom:4mm;}
h1{font-size:34px;line-height:1.15;font-weight:500;margin:0 0 4mm;}
h2{font-size:30px;line-height:1.1;font-weight:500;margin:0 0 3mm;}
p{font-size:13px;line-height:1.45;margin:0;color:#7d2442;max-width:190mm;}
.intro{margin-bottom:4mm;}
.stage{display:grid;grid-template-columns:2fr 8fr;gap:8mm;align-items:end;margin-top:3mm;flex:1;}
.archival{align-self:start;margin-top:10mm;opacity:.44;filter:grayscale(1) contrast(.74);}
.archival img{width:100%;max-height:88mm;object-fit:cover;object-position:top;border:none;}
.canonical{margin-right:-20mm;}
.canonical img{width:calc(100% + 20mm);height:100%;max-height:135mm;object-fit:cover;object-position:top;border:none;display:block;}
.ph{border:1px solid #ceb8bf;background:#f8f5f3;color:#7d2442;display:flex;align-items:center;justify-content:center;text-align:center;padding:8mm;letter-spacing:.01em;}
.archival .ph{width:100%;max-height:88mm;min-height:64mm;}
.canonical .ph{width:calc(100% + 20mm);height:100%;max-height:135mm;min-height:120mm;}
.closing{display:flex;flex-direction:column;justify-content:center;gap:5mm;background:linear-gradient(150deg,#efe8e4 10%,#f7f4f2 70%);}
.closing p{max-width:170mm;}
.caption{margin-top:5mm;font-size:12px;color:#7d2442;}
.subhead{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#9b6b79;margin-bottom:3mm;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin-top:4mm;}
.panel{border-top:1px solid #d6c4ca;padding-top:3mm;}
ul{margin:0;padding-left:5mm;}
li{font-size:12px;line-height:1.45;color:#6f1e3d;margin:0 0 1.6mm;}
.notes{margin-top:4mm;columns:2;column-gap:10mm;}
.metrics{display:flex;flex-wrap:wrap;gap:6mm;margin-top:4mm;}
.metric{font-size:12px;padding:2mm 3mm;border:1px solid #d9cad0;background:#f8f4f2;color:#6f1e3d;}
</style></head><body>
<section class="page closing">
  ${logoFile ? `<img class="logo" src="${logoFile}" alt="Schillings" />` : ''}
  <h1>Opening statement</h1>
  <p>The objective was to ensure the firm's online presence more accurately reflects the quality, discretion and sophistication of the work itself.</p>
  <div class="grid-2">
    <section class="panel">
      <p class="subhead">What partners should notice</p>
      <p>${escapeHtml(
        config.summary?.whatPartnersShouldNotice ??
          'The document highlights practitioner credibility, service clarity and enquiry pathways, rather than visual redesign for its own sake.',
      )}</p>
    </section>
    <section class="panel">
      <p class="subhead">Current live-site weaknesses</p>
      <ul>${li(weaknesses)}</ul>
    </section>
  </div>
  <div class="metrics">${metrics.map((m) => `<span class="metric">${escapeHtml(m)}</span>`).join('')}</div>
</section>
${pair(
  'Practitioner authority',
  'Practitioner profiles now present independent recognition and professional context more clearly.',
  'Independent recognition and professional context are easier to validate.',
  p2Before,
  p2After,
  trustSignals,
)}
${pair(
  'Expertise clarity',
  'Expertise positioning and service ownership are now presented with clearer boundaries and context.',
  'Expertise ownership and service context are more clearly separated.',
  p3Before,
  p3After,
  oldVsNew,
)}
${pair(
  'Contact and operational clarity',
  'Contact pathways and practical enquiry routes are now presented more consistently across key pages.',
  'Contact routes and practical next steps are presented more consistently.',
  p4Before,
  p4After,
  readiness.slice(0, 6),
)}
<section class="page closing">
  ${logoFile ? `<img class="logo" src="${logoFile}" alt="Schillings" />` : ''}
  <h1>Closing statement</h1>
  <div class="panel">
    <p class="subhead">International model summary</p>
    <p>${escapeHtml(internationalSummary)}</p>
  </div>
  <div class="panel">
    <p class="subhead">Operational maturity</p>
    <p>${escapeHtml(operational)}</p>
  </div>
  ${decisions.length ? `<div class="panel"><p class="subhead">Deliberate decisions</p><ul>${li(decisions)}</ul></div>` : ''}
  <p>All substantive content remains human-written and human-reviewed.</p>
  <p>${escapeHtml(closing)}</p>
</section>
</body></html>`;
}

async function renderPdf(config: Config, out: ReturnType<typeof outputPaths>, mode: PackMode) {
  let html = '';
  let htmlPath = out.html;
  let pdfPath = out.pdf;
  if (mode === 'partner-v2') {
    const stage = config.v2Stage ?? 'proof';
    if (stage === 'full') {
      html = renderPartnerV2FullHtml(config, out);
      htmlPath = path.join(out.root, 'partner-pack.html');
      pdfPath = path.join(out.root, 'partner-pack.pdf');
    } else {
      html = renderPartnerV2Page2ProofHtml(config, out);
      htmlPath = path.join(out.root, 'partner-pack-page-2-proof.html');
      pdfPath = path.join(out.root, 'partner-pack-page-2-proof.pdf');
    }
  } else {
    html = mode === 'partner' ? renderPartnerHtml(config, out) : renderInternalHtml(config, out);
  }
  await fs.writeFile(htmlPath, html, 'utf8');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'load' });
  await page.waitForFunction(() => {
    const imgs = Array.from(document.images);
    if (imgs.length === 0) return true;
    return imgs.every((img) => img.complete && img.naturalWidth > 0);
  });
  await page.waitForTimeout(200);
  await page.pdf({ path: pdfPath, ...printOptionsFromConfig(config) });
  await browser.close();
}

async function main() {
  const cli = parseCliOptions();
  const config = await loadConfig(cli.configPath);
  validateConfig(config);
  const mode = cli.modeOverride ?? config.mode ?? 'partner';
  const resolvedBases = resolveBaseUrls(config, cli);
  let { beforeBaseUrl, afterBaseUrl } = resolvedBases;
  if (!afterBaseUrl && cli.env === 'local') {
    afterBaseUrl = await detectLocalAstroBaseUrl();
    if (!afterBaseUrl) {
      throw new Error(
        'No local Astro dev server detected on ports 4321-4327. Start `npm run dev` or pass --afterBaseUrl.',
      );
    }
  }
  const out = outputPaths(path.resolve(process.cwd(), config.outputDir));
  await ensureDir(out.raw);
  await ensureDir(out.cropped);
  await ensureDir(out.annotated);

  let captureMode: 'fresh' | 'reused' = 'fresh';
  if (cli.skipCapture) {
    await ensureSkipCaptureAssets(config, out);
    captureMode = 'reused';
  } else {
    await captureScreenshots(config, out, beforeBaseUrl, afterBaseUrl);
    await cropAndAnnotate(config, out, mode);
  }
  await renderPdf(config, out, mode);

  // eslint-disable-next-line no-console
  console.log(
    [
      'Partner pack generation complete:',
      `- PDF: ${
        mode === 'partner-v2'
          ? config.v2Stage === 'full'
            ? path.join(out.root, 'partner-pack.pdf')
            : path.join(out.root, 'partner-pack-page-2-proof.pdf')
          : out.pdf
      }`,
      `- HTML: ${
        mode === 'partner-v2'
          ? config.v2Stage === 'full'
            ? path.join(out.root, 'partner-pack.html')
            : path.join(out.root, 'partner-pack-page-2-proof.html')
          : out.html
      }`,
      `- Examples rendered: ${config.examples.length}`,
      `- Capture mode: ${captureMode}`,
      `- Mode: ${mode}`,
      `- Config: ${cli.configPath}`,
      `- beforeBaseUrl: ${beforeBaseUrl ?? '(none)'}`,
      `- afterBaseUrl: ${afterBaseUrl ?? '(none)'}`,
      `- Reused old partner renderer/layout classes: ${mode === 'partner-v2' ? 'no (separate v2 renderer)' : 'n/a'}`,
    ].join('\n'),
  );
}

await main();
