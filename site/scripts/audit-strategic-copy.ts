/**
 * Strategic copy audit for `src/data/strategic-rebuild-content.ts`.
 * Hard failures exit 1; warnings print but exit 0.
 */
import {
  getStrategicHubPageModel,
  homeConfidentialEngagementCta,
  homeHero,
  homeHeroCtas,
  homeInstitutionalTrust,
  homeIntelligenceSection,
  homeWhenClientsComeToUs,
  primaryNavigation,
  responseSystem,
  responseSystemPage,
  situationDetailsById,
  situationsIndex,
  STRATEGIC_HUB_SEGMENTS,
  STRATEGIC_SITUATION_IDS,
  STRATEGIC_WHAT_WE_PROTECT_IDS,
  whatWeProtectDetailsById,
} from '../src/data/strategic-rebuild-content';

import { findSoftTermHits } from './audit-strategic-copy-scan';

const META_TITLE_WARN_LEN = 60;
const META_DESC_WARN_LEN = 160;

type Issue = { page: string; message: string };

const errors: Issue[] = [];
const warnings: Issue[] = [];

function fail(page: string, message: string): void {
  errors.push({ page, message });
}

function warn(page: string, message: string): void {
  warnings.push({ page, message });
}

function isNonEmpty(s: unknown): s is string {
  return typeof s === 'string' && s.trim().length > 0;
}

function auditMetaLengths(page: string, metaTitle: string | undefined, metaDescription: string | undefined): void {
  if (metaTitle !== undefined && metaTitle.length > META_TITLE_WARN_LEN) {
    warn(page, `Meta title length ${metaTitle.length} (>${META_TITLE_WARN_LEN}): ${metaTitle.slice(0, 80)}…`);
  }
  if (metaDescription !== undefined && metaDescription.length > META_DESC_WARN_LEN) {
    warn(
      page,
      `Meta description length ${metaDescription.length} (>${META_DESC_WARN_LEN}): ${metaDescription.slice(0, 100)}…`,
    );
  }
}

function scanWords(page: string, text: string, field: string): void {
  const { banned, claims } = findSoftTermHits(text);
  for (const w of banned) warn(page, `Banned/salesy term "${w}" in ${field}`);
  for (const phrase of claims) warn(page, `Claims-review term "${phrase}" in ${field}`);
}

function auditStrings(page: string, record: Record<string, unknown>, fields: string[]): void {
  for (const f of fields) {
    const v = record[f];
    if (typeof v === 'string') {
      scanWords(page, v, f);
    }
  }
}

/** Map duplicate value -> page keys (canonical) that use it */
const titleByValue = new Map<string, Set<string>>();
const metaTitleByValue = new Map<string, Set<string>>();
const metaDescByValue = new Map<string, Set<string>>();

function trackDup(map: Map<string, Set<string>>, value: string, pageKey: string): void {
  const v = value.trim();
  if (!v) return;
  let set = map.get(v);
  if (!set) {
    set = new Set();
    map.set(v, set);
  }
  set.add(pageKey);
}

function flushDupes(
  map: Map<string, Set<string>>,
  section: string,
  fieldLabel: string,
): void {
  for (const [value, keys] of map) {
    if (keys.size > 1) {
      fail(
        section,
        `Duplicate ${fieldLabel} (${keys.size} pages): "${value.slice(0, 120)}${value.length > 120 ? '…' : ''}" — ${[...keys].sort().join(', ')}`,
      );
    }
  }
}

// --- Required fields & bullets ---

for (const id of STRATEGIC_SITUATION_IDS) {
  const page = `Situation: ${id}`;
  const d = situationDetailsById[id];
  const strFields = [
    'title',
    'metaTitle',
    'metaDescription',
    'lead',
    'howSchillingsResponds',
    'ctaLabel',
  ] as const;
  for (const f of strFields) {
    if (!isNonEmpty(d[f])) fail(page, `Missing or empty "${f}"`);
  }
  if (!isNonEmpty(d.slug)) fail(page, 'Missing or empty "slug"');
  if (!Array.isArray(d.whenThisMatters) || d.whenThisMatters.length === 0) {
    fail(page, 'Empty or missing whenThisMatters bullets');
  } else if (!d.whenThisMatters.every((x) => isNonEmpty(x))) {
    fail(page, 'whenThisMatters contains empty string(s)');
  }
  if (!Array.isArray(d.risksIfMishandled) || d.risksIfMishandled.length === 0) {
    fail(page, 'Empty or missing risksIfMishandled bullets');
  } else if (!d.risksIfMishandled.every((x) => isNonEmpty(x))) {
    fail(page, 'risksIfMishandled contains empty string(s)');
  }
  if (!d.relatedProtectiveAssets?.length) fail(page, 'relatedProtectiveAssets empty');
  if (!d.relatedResponsePillars?.length) fail(page, 'relatedResponsePillars empty');

  auditMetaLengths(page, d.metaTitle, d.metaDescription);
  auditStrings(page, d as unknown as Record<string, unknown>, [...strFields, 'slug']);

  const key = `situation/${id}`;
  trackDup(titleByValue, d.title, key);
  trackDup(metaTitleByValue, d.metaTitle, key);
  trackDup(metaDescByValue, d.metaDescription, key);
}

for (const id of STRATEGIC_WHAT_WE_PROTECT_IDS) {
  const page = `What we protect: ${id}`;
  const d = whatWeProtectDetailsById[id];
  const strFields = [
    'title',
    'metaTitle',
    'metaDescription',
    'lead',
    'howSchillingsProtectsIt',
    'ctaLabel',
  ] as const;
  for (const f of strFields) {
    if (!isNonEmpty(d[f])) fail(page, `Missing or empty "${f}"`);
  }
  if (!isNonEmpty(d.slug)) fail(page, 'Missing or empty "slug"');
  if (!Array.isArray(d.whyItMatters) || d.whyItMatters.length === 0) {
    fail(page, 'Empty or missing whyItMatters bullets');
  } else if (!d.whyItMatters.every((x) => isNonEmpty(x))) {
    fail(page, 'whyItMatters contains empty string(s)');
  }
  if (!Array.isArray(d.commonRisks) || d.commonRisks.length === 0) {
    fail(page, 'Empty or missing commonRisks bullets');
  } else if (!d.commonRisks.every((x) => isNonEmpty(x))) {
    fail(page, 'commonRisks contains empty string(s)');
  }
  if (!d.relatedSituations?.length) fail(page, 'relatedSituations empty');
  if (!d.relatedResponsePillars?.length) fail(page, 'relatedResponsePillars empty');

  auditMetaLengths(page, d.metaTitle, d.metaDescription);
  auditStrings(page, d as unknown as Record<string, unknown>, [...strFields, 'slug']);

  const key = `wwp/${id}`;
  trackDup(titleByValue, d.title, key);
  trackDup(metaTitleByValue, d.metaTitle, key);
  trackDup(metaDescByValue, d.metaDescription, key);
}

{
  const page = 'Response System page';
  const p = responseSystemPage;
  const strFields = [
    'title',
    'metaTitle',
    'metaDescription',
    'lead',
    'tagline',
    'howItWorks',
    'ctaLabel',
  ] as const;
  for (const f of strFields) {
    if (!isNonEmpty(p[f])) fail(page, `Missing or empty "${f}"`);
  }
  if (!p.pillars?.length) fail(page, 'pillars empty');
  if (!p.supportedSituations?.length) fail(page, 'supportedSituations empty');
  if (!p.protectedAssets?.length) fail(page, 'protectedAssets empty');

  auditMetaLengths(page, p.metaTitle, p.metaDescription);
  auditStrings(page, p as unknown as Record<string, unknown>, [...strFields]);

  const key = 'landing/response-system';
  trackDup(titleByValue, p.title, key);
  trackDup(metaTitleByValue, p.metaTitle, key);
  trackDup(metaDescByValue, p.metaDescription, key);
}

for (const segment of STRATEGIC_HUB_SEGMENTS) {
  const hub = getStrategicHubPageModel(segment);
  const page = `Hub: ${segment}`;
  if (!isNonEmpty(hub.title)) fail(page, 'Missing or empty title');
  if (!isNonEmpty(hub.metaDescription)) fail(page, 'Missing or empty metaDescription');
  if (!isNonEmpty(hub.heading)) fail(page, 'Missing or empty heading');
  if (!isNonEmpty(hub.intro)) fail(page, 'Missing or empty intro');
  if (!isNonEmpty(hub.listHeading)) fail(page, 'Missing or empty listHeading');
  if (!hub.listItems?.length) fail(page, 'listItems empty');
  else {
    for (let i = 0; i < hub.listItems.length; i++) {
      const item = hub.listItems[i];
      if (!isNonEmpty(item.primary)) {
        fail(page, `listItems[${i}].primary empty`);
      }
      if (item.secondary !== undefined && !isNonEmpty(item.secondary)) {
        fail(page, `listItems[${i}].secondary empty string`);
      }
    }
  }

  auditMetaLengths(page, hub.title, hub.metaDescription);
  auditStrings(page, hub as unknown as Record<string, unknown>, ['title', 'metaDescription', 'heading', 'intro', 'listHeading']);

  if (segment === 'response-system') {
    // Canonical document title/meta for /response-system/ is responseSystemPage; hub strings are secondary — do not duplicate-track (same URL).
    continue;
  }

  const key = `landing/${segment}`;
  trackDup(titleByValue, hub.title, key);
  // Hub uses `title` as the HTML document title (no separate metaTitle).
  trackDup(metaTitleByValue, hub.title, key);
  trackDup(metaDescByValue, hub.metaDescription, key);
}

{
  const page = 'Situations index (data export)';
  if (!isNonEmpty(situationsIndex.title)) fail(page, 'Missing or empty title');
  if (!isNonEmpty(situationsIndex.metaDescription)) fail(page, 'Missing or empty metaDescription');
  if (!isNonEmpty(situationsIndex.intro)) fail(page, 'Missing or empty intro');

  auditMetaLengths(page, situationsIndex.title, situationsIndex.metaDescription);
  auditStrings(page, situationsIndex as unknown as Record<string, unknown>, ['title', 'metaDescription', 'intro']);

  const hubSit = getStrategicHubPageModel('situations');
  if (situationsIndex.title !== hubSit.title) {
    warn(page, `title differs from hub situations title (possible drift)`);
  }
  if (situationsIndex.metaDescription !== hubSit.metaDescription) {
    warn(page, `metaDescription differs from hub situations (possible drift)`);
  }
  // Omit from duplicate maps: same editorial intent as hub situations; drift is warned above.
}

{
  const page = 'Home: hero';
  if (!isNonEmpty(homeHero.headline)) fail(page, 'Empty headline');
  if (!isNonEmpty(homeHero.subheadline)) fail(page, 'Empty subheadline');
  auditStrings(page, homeHero as unknown as Record<string, unknown>, ['headline', 'subheadline']);
}

{
  const page = 'Home: hero CTAs';
  for (const k of Object.keys(homeHeroCtas) as (keyof typeof homeHeroCtas)[]) {
    if (!isNonEmpty(homeHeroCtas[k])) fail(page, `Empty homeHeroCtas.${String(k)}`);
  }
}

{
  const page = 'Home: when clients come to us';
  if (!homeWhenClientsComeToUs.length) fail(page, 'homeWhenClientsComeToUs empty');
  for (let i = 0; i < homeWhenClientsComeToUs.length; i++) {
    if (!isNonEmpty(homeWhenClientsComeToUs[i])) {
      fail(page, `homeWhenClientsComeToUs[${i}] empty`);
    }
    scanWords(page, homeWhenClientsComeToUs[i], `bullet[${i}]`);
  }
}

{
  const page = 'Home: institutional trust';
  if (!isNonEmpty(homeInstitutionalTrust.heading)) fail(page, 'Empty heading');
  if (!homeInstitutionalTrust.paragraphs?.length) fail(page, 'paragraphs empty');
  else {
    for (let i = 0; i < homeInstitutionalTrust.paragraphs.length; i++) {
      if (!isNonEmpty(homeInstitutionalTrust.paragraphs[i])) {
        fail(page, `paragraphs[${i}] empty`);
      }
      scanWords(page, homeInstitutionalTrust.paragraphs[i], `paragraphs[${i}]`);
    }
  }
  scanWords(page, homeInstitutionalTrust.heading, 'heading');
}

{
  const page = 'Home: intelligence section';
  const h = homeIntelligenceSection;
  if (!isNonEmpty(h.heading)) fail(page, 'Empty heading');
  if (!isNonEmpty(h.intro)) fail(page, 'Empty intro');
  if (!isNonEmpty(h.linkLabel)) fail(page, 'Empty linkLabel');
  auditStrings(page, h as unknown as Record<string, unknown>, ['heading', 'intro', 'linkLabel']);
}

{
  const page = 'Home: confidential engagement CTA';
  const h = homeConfidentialEngagementCta;
  if (!isNonEmpty(h.heading)) fail(page, 'Empty heading');
  if (!isNonEmpty(h.body)) fail(page, 'Empty body');
  if (!isNonEmpty(h.linkLabel)) fail(page, 'Empty linkLabel');
  auditStrings(page, h as unknown as Record<string, unknown>, ['heading', 'body', 'linkLabel']);
}

{
  const page = 'Primary navigation';
  for (let i = 0; i < primaryNavigation.length; i++) {
    const item = primaryNavigation[i];
    if (!isNonEmpty(item.label)) fail(page, `primaryNavigation[${i}].label empty`);
    scanWords(page, item.label, `primaryNavigation[${i}].label`);
  }
}

{
  const page = 'Response system pillars (labels)';
  for (let i = 0; i < responseSystem.length; i++) {
    const pillar = responseSystem[i];
    if (!isNonEmpty(pillar.label)) fail(page, `responseSystem[${i}].label empty`);
    if (!isNonEmpty(pillar.line)) fail(page, `responseSystem[${i}].line empty`);
    scanWords(page, pillar.label, `pillar[${i}].label`);
    scanWords(page, pillar.line, `pillar[${i}].line`);
  }
}

// --- Duplicates ---

flushDupes(titleByValue, 'Cross-page: duplicate titles', 'title');
flushDupes(metaTitleByValue, 'Cross-page: duplicate meta titles', 'meta title');
flushDupes(metaDescByValue, 'Cross-page: duplicate meta descriptions', 'meta description');

// --- Output grouped by page ---

const byPage = new Map<string, { errors: string[]; warnings: string[] }>();

function bucket(page: string, kind: 'errors' | 'warnings', msg: string): void {
  let row = byPage.get(page);
  if (!row) {
    row = { errors: [], warnings: [] };
    byPage.set(page, row);
  }
  row[kind].push(msg);
}

for (const e of errors) bucket(e.page, 'errors', e.message);
for (const w of warnings) bucket(w.page, 'warnings', w.message);

const pageOrder = [...byPage.keys()].sort((a, b) => a.localeCompare(b));

console.log('Strategic copy audit\n');

for (const page of pageOrder) {
  const row = byPage.get(page)!;
  if (row.errors.length === 0 && row.warnings.length === 0) continue;
  console.log(`## ${page}`);
  for (const m of row.errors) console.log(`  ERROR: ${m}`);
  for (const m of row.warnings) console.log(`  WARN: ${m}`);
  console.log('');
}

const errCount = errors.length;
const warnCount = warnings.length;
console.log(`Summary: ${errCount} error(s), ${warnCount} warning(s)`);

if (errCount > 0) {
  process.exitCode = 1;
}
