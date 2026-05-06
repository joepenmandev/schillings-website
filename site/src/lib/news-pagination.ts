import type { NewsArticle } from '../data/news';
import { publishedNews } from '../data/news';

/**
 * Articles per index page (`/{locale}/news/page/2/` etc. when count exceeds this).
 * 18 balances fewer paginated URLs (SEO/crawl) with a page that stays scannable; adjust if needed.
 */
export const NEWS_INDEX_PAGE_SIZE = 18;

/**
 * Page 1 shows a featured story from the first slot, then a full grid of {@link NEWS_INDEX_PAGE_SIZE} — pull one extra from the feed.
 */
export const NEWS_INDEX_FIRST_PAGE_EXTRA = 1;

/** Newest first (by `date` string YYYY-MM-DD). */
export function newsSortedPublished(): NewsArticle[] {
  return [...publishedNews()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function newsTotalPages(pageSize = NEWS_INDEX_PAGE_SIZE): number {
  const n = newsSortedPublished().length;
  if (n === 0) return 1;
  const firstChunk = pageSize + NEWS_INDEX_FIRST_PAGE_EXTRA;
  if (n <= firstChunk) return 1;
  return 1 + Math.ceil((n - firstChunk) / pageSize);
}

/** Page numbers that need static routes: `2` … `N` (page `1` is always `/{locale}/news/`). */
export function newsPaginatedPageNumbers(pageSize = NEWS_INDEX_PAGE_SIZE): number[] {
  const total = newsTotalPages(pageSize);
  if (total <= 1) return [];
  return Array.from({ length: total - 1 }, (_, i) => i + 2);
}

/** 1-based page index into sorted published list (page 1 includes {@link NEWS_INDEX_FIRST_PAGE_EXTRA} for the featured slot). */
export function articlesForNewsPage(page: number, pageSize = NEWS_INDEX_PAGE_SIZE): NewsArticle[] {
  const list = newsSortedPublished();
  const head = pageSize + NEWS_INDEX_FIRST_PAGE_EXTRA;
  if (page === 1) {
    return list.slice(0, head);
  }
  const start = head + (page - 2) * pageSize;
  return list.slice(start, start + pageSize);
}

export type NewsPaginationItem = { kind: 'page'; page: number } | { kind: 'ellipsis' };

/**
 * Compact page numbers for news index pagination (1-based). Ellipses only when `totalPages` is large.
 */
export function newsPaginationItems(currentPage: number, totalPages: number): NewsPaginationItem[] {
  if (totalPages < 2 || currentPage < 1 || currentPage > totalPages) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => ({ kind: 'page', page: i + 1 } as const));
  }

  const edge = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  const sorted = [...edge].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  const out: NewsPaginationItem[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      out.push({ kind: 'ellipsis' });
    }
    out.push({ kind: 'page', page: sorted[i]! });
  }
  return out;
}
