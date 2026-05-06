/**
 * Lightweight governance doc drift checks — not architectural linting.
 * - Section numbering contiguous in DESIGN-SYSTEM-GOVERNANCE.md
 * - §N references in tracked docs point to existing sections
 * - ADR files linked from governance exist
 * - Relative markdown links from governance resolve
 * - PR template tiers align with §11 keywords
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, normalize, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = join(__dirname, '..');
const REPO_ROOT = join(SITE_ROOT, '..');
const GOV = join(SITE_ROOT, 'docs/DESIGN-SYSTEM-GOVERNANCE.md');
const DOCS = join(SITE_ROOT, 'docs');

const errors = [];

function fail(msg) {
  errors.push(msg);
}

function read(p) {
  try {
    return readFileSync(p, 'utf8');
  } catch {
    fail(`Missing or unreadable file: ${p}`);
    return '';
  }
}

const govContent = read(GOV);
if (!govContent) process.exit(1);

const sectionRe = /^## (\d+)\.\s/gm;
const sectionNums = [];
let m;
while ((m = sectionRe.exec(govContent)) !== null) {
  sectionNums.push(Number(m[1]));
}

const maxSection = 67;
const set = new Set(sectionNums);
for (let n = 1; n <= maxSection; n++) {
  if (!set.has(n)) fail(`Governance: missing section ## ${n}.`);
}
for (const n of sectionNums) {
  if (n < 1 || n > maxSection) fail(`Governance: unexpected section number ## ${n}.`);
}
if (sectionNums.length !== maxSection) {
  fail(`Governance: expected ${maxSection} numbered sections, found ${sectionNums.length}.`);
}

const sectionRefRe = /§\s*(\d+)(?:\s*[–-]\s*(\d+))?/g;
const filesToScanForSectionRefs = [
  GOV,
  join(REPO_ROOT, 'CONTRIBUTING.md'),
  join(REPO_ROOT, '.github/pull_request_template.md'),
  join(SITE_ROOT, 'docs/architecture/rfc-template.md'),
];

for (const p of readdirSync(join(SITE_ROOT, 'docs/architecture/adr'))) {
  if (p.endsWith('.md')) filesToScanForSectionRefs.push(join(SITE_ROOT, 'docs/architecture/adr', p));
}

for (const file of filesToScanForSectionRefs) {
  if (!existsSync(file)) continue;
  const text = readFileSync(file, 'utf8');
  sectionRefRe.lastIndex = 0;
  let ref;
  while ((ref = sectionRefRe.exec(text)) !== null) {
    const a = Number(ref[1]);
    const b = ref[2] ? Number(ref[2]) : a;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (lo < 1 || hi > maxSection) {
      fail(`§ reference out of range (${lo}–${hi}) in ${posix.relative(REPO_ROOT, file)}`);
    }
  }
}

const adrLinkRe = /\]\(\.\/architecture\/adr\/(ADR-[^)]+\.md)\)/g;
const linkedAdrs = new Set();
while ((m = adrLinkRe.exec(govContent)) !== null) {
  linkedAdrs.add(m[1]);
  const adrPath = join(DOCS, 'architecture/adr', m[1]);
  if (!existsSync(adrPath)) fail(`ADR linked from governance but missing: ${m[1]}`);
}

const adrDir = join(SITE_ROOT, 'docs/architecture/adr');
for (const name of readdirSync(adrDir)) {
  if (!name.endsWith('.md') || name === 'README.md' || name.startsWith('_')) continue;
  if (!linkedAdrs.has(name)) {
    fail(`ADR file not listed in governance ADR index: ${name} (add a row or remove orphan).`);
  }
}

const mdLinkRe = /]\(([^)]+)\)/g;
while ((m = mdLinkRe.exec(govContent)) !== null) {
  let target = m[1].trim();
  const hash = target.indexOf('#');
  if (hash >= 0) target = target.slice(0, hash);
  if (!target || target.startsWith('http://') || target.startsWith('https://')) continue;
  const resolved = normalize(join(DOCS, target));
  const repoRoot = normalize(REPO_ROOT);
  if (!resolved.startsWith(repoRoot)) {
    fail(`Governance link resolves outside repo: ${target}`);
    continue;
  }
  if (!existsSync(resolved)) fail(`Broken relative link in governance: (${target})`);
}

const prPath = join(REPO_ROOT, '.github/pull_request_template.md');
const pr = existsSync(prPath) ? readFileSync(prPath, 'utf8') : '';
const gov11Start = govContent.indexOf('## 11. Change classification');
const gov11End = govContent.indexOf('## 12.', gov11Start);
const gov11 = gov11Start >= 0 && gov11End > gov11Start ? govContent.slice(gov11Start, gov11End) : '';

const tierChecks = [
  ['SAFE', 'SAFE'],
  ['REVIEW REQUIRED', 'REVIEW REQUIRED'],
  ['HIGH RISK', 'HIGH RISK'],
  ['CRITICAL', 'CRITICAL'],
];
for (const [label, needle] of tierChecks) {
  if (!gov11.includes(needle)) fail(`Governance §11 missing expected label: ${label}`);
  if (pr && !pr.includes(needle)) fail(`PR template missing §11-aligned keyword: ${needle}`);
}

if (errors.length) {
  console.error('Governance doc verification failed:\n', errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('Governance docs OK: sections 1–67, ADR index, links, § refs, PR tier keywords.');
