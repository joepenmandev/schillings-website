import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ROOT = path.resolve(process.cwd(), '..');
const OUT_DIR = path.join(ROOT, 'artifacts', 'briefing-may-2026');
const ASSETS_DIR = path.join(OUT_DIR, 'assets');
const COMPOSED_PLATES_DIR = path.join(OUT_DIR, 'composed-plates');
/** Approved Page 2 plate — copy here after sign-off (strict gate uses this path only). */
const PAGE2_PLATE_ASSET = path.join(ASSETS_DIR, 'p2-evidence-plate.png');
const PAGE2_PLATE_COMPOSED = path.join(COMPOSED_PLATES_DIR, 'page-2-evidence-plate.png');
const REQUIRE_PAGE2_PLATE = process.argv.includes('--require-page2-plate');

const HTML_PATH = path.join(OUT_DIR, 'schillings-briefing-may-2026.html');
const PDF_PATH = path.join(OUT_DIR, 'schillings-briefing-may-2026.pdf');
const LOGO = `file://${path.resolve(process.cwd(), 'public/brand/schillings-logo-rgb.svg')}`;

function fileUrl(p: string) {
  return `file://${path.resolve(p)}`;
}

function resolvePage2Plate(): string | null {
  if (existsSync(PAGE2_PLATE_ASSET)) return PAGE2_PLATE_ASSET;
  if (existsSync(PAGE2_PLATE_COMPOSED)) return PAGE2_PLATE_COMPOSED;
  return null;
}

function assertPage2Gate() {
  if (!REQUIRE_PAGE2_PLATE) return;
  if (!existsSync(PAGE2_PLATE_ASSET)) {
    throw new Error(
      `Briefing gate (--require-page2-plate): approved Page 2 plate missing.\n  Expected: ${PAGE2_PLATE_ASSET}\n  After sign-off, copy from: ${PAGE2_PLATE_COMPOSED}`,
    );
  }
}

function assetOrPlaceholder(fileName: string, placeholder: string, variant: 'dominant' | 'inset' = 'dominant') {
  const p = path.join(ASSETS_DIR, fileName);
  if (existsSync(p)) return `<img src="${fileUrl(p)}" alt="" />`;
  const klass = variant === 'inset' ? 'ph ph-inset' : 'ph ph-dominant';
  return `<div class="${klass}">${placeholder}</div>`;
}

function plateImgTag(absolutePath: string) {
  return `<img src="${fileUrl(absolutePath)}" alt="" />`;
}

function renderHtml() {
  const p1Main = assetOrPlaceholder('p1-opening-anchor.png', 'Institutional opening anchor');
  const p2Inset = assetOrPlaceholder('p2-practitioner-old-inset.png', 'Archival inset: practitioner profile', 'inset');
  const p2Main = assetOrPlaceholder('p2-practitioner-new-dominant.png', 'Revised practitioner presentation plate');
  const platePath = resolvePage2Plate();
  const p2Spread =
    platePath != null
      ? `<figure class="plate-full">${plateImgTag(platePath)}</figure>`
      : `<div class="pair"><figure class="inset">${p2Inset}</figure><figure class="main">${p2Main}</figure></div>`;
  const p3Inset = assetOrPlaceholder('p3-expertise-old-inset.png', 'Archival inset: expertise structure', 'inset');
  const p3Main = assetOrPlaceholder('p3-expertise-new-dominant.png', 'Revised expertise presentation plate');
  const p4Inset = assetOrPlaceholder('p4-authority-old-inset.png', 'Archival inset: institutional authority context', 'inset');
  const p4Main = assetOrPlaceholder('p4-authority-new-dominant.png', 'Institutional authority evidence plate');
  const p5Inset = assetOrPlaceholder('p5-operational-old-inset.png', 'Archival inset: operational route context', 'inset');
  const p5Main = assetOrPlaceholder('p5-operational-new-dominant.png', 'Operational clarity evidence plate');
  const p6Main = assetOrPlaceholder('p6-closing-anchor.png', 'Institutional closing anchor');

  return `<!doctype html><html lang="en"><head><meta charset="utf-8" />
<title>Schillings Briefing - May 2026</title>
<style>
@page{size:A4 landscape;margin:0;}
body{margin:0;background:#f5f2ef;color:#2d012b;font-family:"Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;}
.spread{height:210mm;box-sizing:border-box;page-break-after:always;display:flex;flex-direction:column;position:relative;overflow:hidden;padding:16mm 14mm;}
.spread:last-child{page-break-after:auto;}
.logo{width:150px;height:auto;opacity:.9;margin-bottom:6mm;}
.meta{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#9b6b79;}
h1{font-size:34px;line-height:1.14;font-weight:500;margin:0;max-width:175mm;}
h2{font-size:29px;line-height:1.08;font-weight:500;margin:0 0 2.5mm;max-width:190mm;}
p{font-size:12.5px;line-height:1.36;margin:0;color:#7d2442;max-width:185mm;}
.closing{background:linear-gradient(155deg,#efe8e4 12%,#f7f4f2 70%);}
.pair{display:grid;grid-template-columns:2fr 8fr;gap:8mm;align-items:end;flex:1;margin-top:4mm;}
.inset{margin-top:10mm;opacity:.45;filter:grayscale(1) contrast(.75);}
.inset img,.inset .ph{width:100%;max-height:88mm;min-height:64mm;object-fit:cover;object-position:top;}
.main{margin-right:-20mm;}
.main img,.main .ph{width:calc(100% + 20mm);height:100%;max-height:136mm;min-height:120mm;object-fit:cover;object-position:top;display:block;}
.ph{border:1px solid #ceb8bf;background:#f8f5f3;color:#7d2442;display:flex;align-items:center;justify-content:center;text-align:center;padding:8mm;letter-spacing:.01em;font-size:12px;}
.caption{font-size:11.5px;color:#7d2442;margin-top:3mm;}
.effect{font-size:8.3px;letter-spacing:.05em;text-transform:uppercase;color:rgba(125,36,66,.62);margin-top:2mm;}
.opener{display:grid;grid-template-columns:7fr 5fr;gap:10mm;align-items:end;flex:1;margin-top:4mm;}
.opener .main{margin-right:-10mm;}
/* Single composed evidence plate (Page 2): no CSS re-inset; composure is already in the PNG. */
.plate-full{margin-top:4mm;flex:1;display:flex;align-items:flex-end;min-height:0;}
.plate-full img{width:100%;max-height:138mm;object-fit:contain;object-position:left bottom;display:block;}
.closer{display:grid;grid-template-columns:7fr 5fr;gap:10mm;align-items:end;flex:1;margin-top:4mm;}
.closer .main{margin-right:-8mm;}
</style></head><body>
<section class="spread closing">
  <img class="logo" src="${LOGO}" alt="Schillings" />
  <div class="meta">Confidential - Internal Partner Review</div>
  <h1>Institutional trust is often established before any conversation begins.</h1>
  <p>Sophisticated clients and introducers form judgments before contact. Clear authority and discretion at first review support earlier confidence and reduce hesitation in mandate assessment.</p>
  <p class="effect">Commercial effect: earlier confidence at first approach.</p>
  <div class="opener">
    <figure class="main">${p1Main}</figure>
  </div>
  <p class="caption">Confidence is inferred structurally before it is tested personally.</p>
</section>

<section class="spread">
  <img class="logo" src="${LOGO}" alt="Schillings" />
  <h2>Practitioner framing influences confidence before suitability is assessed.</h2>
  <p>Practitioner pages shape standing, relevance and discretion at first review. Clear practitioner context reduces hesitation for clients and introducers.</p>
  <p class="effect">Commercial effect: stronger introducer confidence.</p>
  ${p2Spread}
  <p class="caption">Clear practitioner context reduces hesitation at first review.</p>
</section>

<section class="spread">
  <img class="logo" src="${LOGO}" alt="Schillings" />
  <h2>Expertise positioning helps prospective matters arrive with clearer intent.</h2>
  <p>Expertise framing determines whether matters are read as relevant and properly scoped. Clearer boundaries support earlier self-qualification and more precise approaches.</p>
  <p class="effect">Commercial effect: higher-intent enquiries.</p>
  <div class="pair"><figure class="inset">${p3Inset}</figure><figure class="main">${p3Main}</figure></div>
  <p class="caption">Clarity of scope reduces avoidable ambiguity.</p>
</section>

<section class="spread">
  <img class="logo" src="${LOGO}" alt="Schillings" />
  <h2>Authority is reinforced when institutional signals remain coherent.</h2>
  <p>Authority is inferred through consistency and composure before dialogue. Coherent institutional signals reinforce referral confidence at evaluation.</p>
  <p class="effect">Commercial effect: stronger referral confidence.</p>
  <div class="pair"><figure class="inset">${p4Inset}</figure><figure class="main">${p4Main}</figure></div>
  <p class="caption">Authority is read through structure before it is tested in dialogue.</p>
</section>

<section class="spread">
  <img class="logo" src="${LOGO}" alt="Schillings" />
  <h2>Clearer contact pathways reduce hesitation at the point of engagement.</h2>
  <p>Clear next steps reduce uncertainty for high-intent audiences. This supports clearer routing expectations and better-qualified approaches.</p>
  <p class="effect">Commercial effect: clearer intake quality.</p>
  <div class="pair"><figure class="inset">${p5Inset}</figure><figure class="main">${p5Main}</figure></div>
  <p class="caption">Calm routing clarity supports better commercial outcomes.</p>
</section>

<section class="spread closing">
  <img class="logo" src="${LOGO}" alt="Schillings" />
  <h2>The institutional signal is now clearer at the point of evaluation.</h2>
  <p>Taken together, these institutional signals reinforce authority earlier in evaluation.</p>
  <p class="effect">Commercial effect: stronger premium positioning.</p>
  <div class="closer"><figure class="main">${p6Main}</figure></div>
  <p>All substantive content remains human-written and human-reviewed.</p>
  <p>The platform was structured to support authority, clarity and discretion rather than scaled content production.</p>
</section>
</body></html>`;
}

async function main() {
  assertPage2Gate();
  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.mkdir(ASSETS_DIR, { recursive: true });
  const html = renderHtml();
  await fs.writeFile(HTML_PATH, html, 'utf8');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`file://${HTML_PATH}`, { waitUntil: 'load' });
  await page.waitForFunction(() => Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0));
  await page.pdf({ path: PDF_PATH, format: 'A4', landscape: true, printBackground: true });
  await browser.close();

  const page2Mode = resolvePage2Plate() != null ? 'unified evidence plate' : 'legacy inset + dominant assets';
  // eslint-disable-next-line no-console
  console.log(
    `Schillings Briefing generated:\n- PDF: ${PDF_PATH}\n- HTML: ${HTML_PATH}\n- Assets folder: ${ASSETS_DIR}\n- Page 2: ${page2Mode}`,
  );
}

await main();
