import type { Locale } from '../i18n/config';
import type { NewsArticle } from '../data/news';

const NOON_Z = 'T12:00:00.000Z';

/** Calendar + optional precise instants (news articles and ProfilePage `BlogPosting` stubs). */
export type ArticleDateFields = Pick<NewsArticle, 'date' | 'dateModified' | 'publishedAt' | 'modifiedAt'>;

function localeTag(locale: Locale): string {
  return locale === 'en-us' ? 'en-US' : 'en-GB';
}

/** ISO 8601 instant for `datePublished` — JSON-LD and `<time datetime>`. */
export function articleDatePublishedIso(article: ArticleDateFields): string {
  const raw = article.publishedAt?.trim();
  if (raw) {
    const t = Date.parse(raw);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  return `${article.date}${NOON_Z}`;
}

/** ISO 8601 instant for `dateModified` — JSON-LD and optional “Updated” `<time>`. */
export function articleDateModifiedIso(article: NewsArticle): string {
  const raw = article.modifiedAt?.trim();
  if (raw) {
    const t = Date.parse(raw);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  const day = article.dateModified ?? article.date;
  return `${day}${NOON_Z}`;
}

function isUtcNoon(iso: string): boolean {
  const d = new Date(iso);
  return (
    d.getUTCHours() === 12 &&
    d.getUTCMinutes() === 0 &&
    d.getUTCSeconds() === 0 &&
    d.getUTCMilliseconds() === 0
  );
}

export function formatNewsArticlePublishedForDisplay(article: NewsArticle, locale: Locale): string {
  const iso = articleDatePublishedIso(article);
  const d = new Date(iso);
  const tag = localeTag(locale);
  if (isUtcNoon(iso) && !article.publishedAt?.trim()) {
    return d.toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return d.toLocaleString(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function formatNewsArticleModifiedForDisplay(article: NewsArticle, locale: Locale): string {
  const iso = articleDateModifiedIso(article);
  const d = new Date(iso);
  const tag = localeTag(locale);
  if (isUtcNoon(iso) && !article.modifiedAt?.trim()) {
    return d.toLocaleDateString(tag, { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return d.toLocaleString(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function shouldShowArticleUpdated(article: ArticleDateFields): boolean {
  return articleDateModifiedIso(article) !== articleDatePublishedIso(article);
}
