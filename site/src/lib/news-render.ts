import type { NewsArticle } from '../data/news';
import { resolveNewsAuthorProfile } from '../data/news-house-author';

/** Paths that should not be used as a photographic hero `<img>` (OG/meta may still use them). */
const HERO_IMG_PLACEHOLDERS = new Set(['/og-default.svg', '/og-default.png']);

function normalizeSitePath(src: string): string {
  const t = src.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return t.startsWith('/') ? t : `/${t}`;
}

/**
 * Hero image for **UI** (cards, article header). Skips generic OG placeholders; falls back to the first
 * credited author’s profile photo when the article has no real illustration (common for editorial stubs).
 */
export function newsHeroDisplaySrc(article: NewsArticle): string | undefined {
  const raw = newsHeroSource(article)?.trim();
  if (raw) {
    const n = normalizeSitePath(raw);
    if (!HERO_IMG_PLACEHOLDERS.has(n)) return n;
  }
  for (const slug of article.authorSlugs ?? []) {
    const person = resolveNewsAuthorProfile(slug.trim());
    const img = person?.imagePath?.trim();
    if (img && !img.toLowerCase().endsWith('.svg')) return normalizeSitePath(img);
  }
  return undefined;
}

/** Importer fallback when legacy HTML had no parseable date — hide on public listings. */
export const PLACEHOLDER_NEWS_DATE = '1970-01-01';

function clip(text: string, maxLen: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trimEnd()}…`;
}

/** Safe excerpt for list/meta/RSS when description is missing in imported data. */
export function newsExcerpt(article: NewsArticle, maxLen = 158): string {
  const desc = (article.description ?? '').trim();
  if (desc) return clip(desc, maxLen);
  const lead = (article.paragraphs?.[0] ?? '').trim();
  if (lead) return clip(lead, maxLen);
  return 'News and analysis from Schillings.';
}

/** Hero image source from preferred object field with backwards-compatible fallback. */
export function newsHeroSource(article: NewsArticle): string | undefined {
  const fromHero = article.heroImage?.src?.trim();
  if (fromHero) return fromHero;
  const fromLegacy = article.image?.trim();
  return fromLegacy || undefined;
}

/** Hero alt fallback: imported alt if present, else empty-string decorative image. */
export function newsHeroAlt(article: NewsArticle): string {
  return (article.heroImage?.alt ?? '').trim();
}

/**
 * Bylines for article templates — **resolved profile slugs only** (matches JSON-LD `Person` authors).
 * Falls back to `legacyAuthorRaw` when no slugs map to published bios.
 */
export function newsDisplayAuthors(article: NewsArticle): string[] {
  const mapped = (article.authorSlugs ?? []).map((s) => s.trim()).filter(Boolean);
  const resolved = mapped.filter((slug) => resolveNewsAuthorProfile(slug));
  if (resolved.length > 0) return resolved;
  const raw = (article.legacyAuthorRaw ?? '').trim();
  return raw ? [raw] : [];
}

/** Index of first non-empty body paragraph — for `#article-lede` + speakable selectors. */
export function firstNonemptyParagraphIndex(paragraphs: string[]): number {
  return paragraphs.findIndex((p) => (p ?? '').trim().length > 0);
}

/** Whether to show a visible date on news index cards (omit migration placeholders). */
export function newsShowListDate(article: NewsArticle): boolean {
  const d = (article.date ?? '').trim();
  if (!d || d === PLACEHOLDER_NEWS_DATE) return false;
  return true;
}

/** Editorial card date — `DD / MM / YY` when a real publish date exists. */
export function formatNewsCardDateUk(article: NewsArticle): string | null {
  if (!newsShowListDate(article)) return null;
  const parts = article.date.split('-');
  if (parts.length !== 3) return article.date;
  const [y, m, d] = parts;
  if (!y || !m || !d) return article.date;
  return `${d} / ${m} / ${y.slice(2)}`;
}

