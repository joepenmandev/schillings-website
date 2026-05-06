/**
 * Pure route-discovery helpers (no import.meta.glob) — safe to import from Vitest.
 */
import type { Locale } from '../i18n/config';
import { defaultLocale } from '../i18n/config';
import {
  primaryNav,
  contactSegment,
  complianceNav,
  legalFooterNav,
  utilityFooterNav,
  immediateResponseSegment,
} from './site-nav';
import { officeSlugs, officeSitemapLabel } from './offices';

export type HtmlSitemapItem = { label: string; segment: string };
export type HtmlSitemapGroup = { heading: string; items: HtmlSitemapItem[] };

export const EXCLUDE_FROM_HTML_SITEMAP = new Set(['contact/thank-you']);

function extractAfterPagesDir(dir: string): string {
  const n = dir.replace(/\\/g, '/');
  const i = n.lastIndexOf('pages/');
  if (i === -1) {
    if (n.endsWith('pages')) return '';
    return '';
  }
  return n.slice(i + 'pages/'.length);
}

/** Parse a Vite glob key from src/lib — static routes only (skip keys containing `[`). */
export function parseGlobKeyToRoute(key: string): { locale: Locale; tail: string } | null {
  const p = key.replace(/\\/g, '/');
  if (p.includes('/[')) return null;
  if (!p.endsWith('/index.astro')) return null;
  const dir = p.slice(0, -'/index.astro'.length);
  const rest = extractAfterPagesDir(dir);
  if (rest === 'us' || rest.startsWith('us/')) {
    return { locale: 'en-us', tail: rest === 'us' ? '' : rest.slice('us/'.length) };
  }
  if (rest === 'ie' || rest.startsWith('ie/')) {
    return { locale: 'en-ie', tail: rest === 'ie' ? '' : rest.slice('ie/'.length) };
  }
  return { locale: defaultLocale, tail: rest };
}

export function pickBestStaticTail(tail: string, available: Set<string>): { tail: string; isFallback: boolean } {
  const t = tail.replace(/^\/+|\/+$/g, '');
  if (available.has(t)) return { tail: t, isFallback: false };
  if (t === '') return { tail: '', isFallback: false };

  let prefix = t;
  while (prefix.includes('/')) {
    prefix = prefix.slice(0, prefix.lastIndexOf('/'));
    if (available.has(prefix)) return { tail: prefix, isFallback: true };
  }
  return { tail: '', isFallback: true };
}

const segmentLabelMap: Record<string, string> = (() => {
  const m: Record<string, string> = {
    '': 'Home',
    [contactSegment]: 'Contact',
    [immediateResponseSegment]: 'Immediate response',
    search: 'Site search',
  };
  const add = (rows: readonly { label: string; segment: string }[]) => {
    for (const { label, segment } of rows) m[segment] = label;
  };
  add(primaryNav);
  add(complianceNav);
  add(legalFooterNav);
  add(utilityFooterNav);
  for (const slug of officeSlugs) {
    m[slug] = officeSitemapLabel(slug);
  }
  return m;
})();

function titleCaseSegment(segment: string): string {
  return segment
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function labelForStaticTail(tail: string): string {
  if (segmentLabelMap[tail] !== undefined) return segmentLabelMap[tail];
  const parts = tail.split('/').filter(Boolean);
  if (parts.length === 0) return 'Home';
  return parts.map(titleCaseSegment).join(' — ');
}

type GroupId = 'website' | 'compliance' | 'legal' | 'other';

function groupIdForTail(tail: string): GroupId {
  if (tail.startsWith('compliance/')) return 'compliance';
  if (tail.startsWith('legal/')) return 'legal';
  const otherRoots = new Set(['accessibility', 'careers', 'sitemap', 'search']);
  if (otherRoots.has(tail)) return 'other';
  return 'website';
}

const GROUP_ORDER: { id: GroupId; heading: string }[] = [
  { id: 'website', heading: 'Website' },
  { id: 'compliance', heading: 'Compliance' },
  { id: 'legal', heading: 'Legal & policies' },
  { id: 'other', heading: 'Other' },
];

export function buildHtmlSitemapGroupsFromIndex(
  byLocale: Record<Locale, Set<string>>,
  locale: Locale,
): HtmlSitemapGroup[] {
  const tails = [...byLocale[locale]].filter((t) => !EXCLUDE_FROM_HTML_SITEMAP.has(t));
  const buckets: Record<GroupId, HtmlSitemapItem[]> = {
    website: [],
    compliance: [],
    legal: [],
    other: [],
  };

  for (const tail of tails) {
    const id = groupIdForTail(tail);
    buckets[id].push({ segment: tail, label: labelForStaticTail(tail) });
  }

  const collator = new Intl.Collator('en', { sensitivity: 'base' });
  for (const id of Object.keys(buckets) as GroupId[]) {
    buckets[id].sort((a, b) => collator.compare(a.label, b.label));
  }

  return GROUP_ORDER.map(({ id, heading }) => ({
    heading,
    items: buckets[id],
  })).filter((g) => g.items.length > 0);
}
