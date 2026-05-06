import {
  parseImportedArticleRecord,
  type ArticleImportStatus,
  type ImportedArticleRecord,
} from '../lib/article-import-schema';
import newsImportedJson from './news-imported.json';
import {
  getPersonBySlug,
  resolvePublishedPersonSlugFromLegacyCredit,
} from './people';

export interface NewsArticle {
  /** Stable internal key from import pipeline. */
  id: string;
  slug: string;
  locale: 'en-gb' | 'en-us' | 'en-ie';
  title: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  description: string;
  paragraphs: string[];
  /** Original source URL for migration traceability. */
  legacyUrl: string;
  /** Migration status; `published` records are public. */
  status: ArticleImportStatus;
  /** Unmapped author text captured from legacy source (author backfill phase). */
  legacyAuthorRaw?: string;
  /** People profile slugs (`people/{slug}`) credited on this piece — drives “News on bio” linking. */
  authorSlugs?: string[];
  /** Legacy Webflow category labels (e.g. “Disinformation”) — drives topic hub URLs and filters. */
  topics?: string[];
  /** ISO date YYYY-MM-DD — defaults to `date` in JSON-LD when omitted. */
  dateModified?: string;
  /** Optional ISO instant; when set, drives `datePublished` in JSON-LD / `<time>` instead of noon UTC on `date`. */
  publishedAt?: string;
  /** Optional ISO instant; when set, drives `dateModified` instead of noon UTC on `dateModified` / `date`. */
  modifiedAt?: string;
  /** Hero media object from import model. */
  heroImage?: { src: string; alt?: string };
  /** Absolute or site-root image URL for OG / structured data when available. */
  image?: string;
  /** True only when `status === 'draft'` (not used for `migrated-unreviewed`). */
  draft?: boolean;
}

const editorialNewsStubs: unknown[] = [
  {
    id: 'legacy:privacy-reputation-safety-one-fight:en-gb',
    slug: 'privacy-reputation-safety-one-fight',
    locale: 'en-gb',
    title: 'Privacy, reputation, and safety as one fight',
    datePublished: '2026-04-18',
    legacyUrl: 'https://schillingspartners.com/news/privacy-reputation-safety-one-fight',
    status: 'published',
    description:
      'Personal and institutional risk rarely arrives as a single “legal” or “PR” problem — mapping the whole surface area early reduces blind spots.',
    body: [
      'Threat models that ignore distribution channels, hostile actors, or jurisdictional friction tend to age badly within hours of going public.',
      'A single map of audiences, harms, and legal exposure — reviewed with communications and investigations where relevant — usually surfaces gaps before they become crises.',
    ],
  },
];

/** Editorial stubs first so they override imported rows with the same `slug`. */
function buildNewsImportSource(): unknown[] {
  const imported = newsImportedJson as unknown[];
  const seen = new Set<string>();
  const out: unknown[] = [];
  for (const row of [...editorialNewsStubs, ...imported]) {
    const slug = (row as { slug?: string }).slug;
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    out.push(row);
  }
  return out;
}

const newsImportSource = buildNewsImportSource();

function toNewsArticle(input: unknown): NewsArticle {
  const row: ImportedArticleRecord = parseImportedArticleRecord(input);
  let authorSlugs = row.authorSlugs;
  if (!authorSlugs?.length && row.legacyAuthorRaw?.trim()) {
    const inferred = resolvePublishedPersonSlugFromLegacyCredit(row.legacyAuthorRaw);
    if (inferred) authorSlugs = [inferred];
  }
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale,
    title: row.title,
    date: row.datePublished,
    dateModified: row.dateModified,
    publishedAt: row.publishedAt,
    modifiedAt: row.modifiedAt,
    description: row.description,
    paragraphs: row.body,
    legacyUrl: row.legacyUrl,
    status: row.status,
    legacyAuthorRaw: row.legacyAuthorRaw,
    authorSlugs,
    topics: row.topics,
    heroImage: row.heroImage,
    image: row.heroImage?.src,
    draft: row.status === 'draft',
  };
}

export const newsArticles: NewsArticle[] = newsImportSource.map(toNewsArticle);

/** Listed on /news/, RSS, and bio blocks: published editorial + migrated legacy (excludes `draft` only). */
function isPublicNewsArticle(a: NewsArticle): boolean {
  return a.status === 'published' || a.status === 'migrated-unreviewed';
}

export function publishedNews() {
  return newsArticles.filter((a) => isPublicNewsArticle(a));
}

export function getNewsBySlug(slug: string) {
  return newsArticles.find((a) => a.slug === slug && isPublicNewsArticle(a)) ?? null;
}

/** Published articles that list `personSlug` in `authorSlugs`, newest first (full list). */
export function getAllNewsForPersonSlug(personSlug: string): NewsArticle[] {
  return publishedNews()
    .filter((a) => (a.authorSlugs ?? []).includes(personSlug))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Published articles for a bio block — capped. */
export function getNewsForPersonSlug(personSlug: string, limit = 6): NewsArticle[] {
  return getAllNewsForPersonSlug(personSlug).slice(0, limit);
}

/** People (published bios) who are credited on at least one public article — for `/news/author/{slug}/`. */
export function publishedNewsAuthorSlugs(): string[] {
  const set = new Set<string>();
  for (const a of publishedNews()) {
    for (const raw of a.authorSlugs ?? []) {
      const s = raw.trim();
      if (s && getPersonBySlug(s)) set.add(s);
    }
  }
  return [...set].sort();
}

/** Resolved profile slugs credited on this piece (for “related by author” and article UI). */
export function authorSlugsForRelatedPosts(article: NewsArticle): string[] {
  const slugs = (article.authorSlugs ?? []).map((s) => s.trim()).filter(Boolean);
  const resolved = slugs.filter((s) => getPersonBySlug(s));
  if (resolved.length > 0) return [...new Set(resolved)];
  const inferred = article.legacyAuthorRaw?.trim()
    ? resolvePublishedPersonSlugFromLegacyCredit(article.legacyAuthorRaw)
    : null;
  return inferred ? [inferred] : [];
}

/** Other published articles sharing at least one credited profile slug (OR), excluding this slug. */
export function getRelatedNewsByArticleAuthors(article: NewsArticle, limit = 12): NewsArticle[] {
  const authorSlugs = authorSlugsForRelatedPosts(article);
  if (authorSlugs.length === 0) return [];
  const set = new Set(authorSlugs);
  return publishedNews()
    .filter(
      (a) =>
        a.slug !== article.slug && (a.authorSlugs ?? []).some((s) => set.has(s.trim())),
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit);
}
