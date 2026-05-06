import { describe, expect, it } from 'vitest';
import type { NewsArticle } from '../data/news';
import {
  articleDateModifiedIso,
  articleDatePublishedIso,
  shouldShowArticleUpdated,
} from './news-datetime';

const base: NewsArticle = {
  id: 'x',
  slug: 'x',
  locale: 'en-gb',
  title: 'T',
  date: '2026-03-10',
  description: 'D',
  paragraphs: [],
  legacyUrl: 'https://example.com/x',
  status: 'published',
};

describe('news-datetime', () => {
  it('defaults published to noon UTC on calendar date', () => {
    expect(articleDatePublishedIso(base)).toBe('2026-03-10T12:00:00.000Z');
  });

  it('uses publishedAt when valid', () => {
    expect(
      articleDatePublishedIso({
        ...base,
        publishedAt: '2026-03-10T08:15:30.000Z',
      }),
    ).toBe('2026-03-10T08:15:30.000Z');
  });

  it('shows updated when dateModified day differs', () => {
    const a: NewsArticle = { ...base, dateModified: '2026-03-12' };
    expect(shouldShowArticleUpdated(a)).toBe(true);
    expect(articleDateModifiedIso(a)).toBe('2026-03-12T12:00:00.000Z');
  });

  it('hides updated when modified equals published', () => {
    expect(shouldShowArticleUpdated(base)).toBe(false);
  });
});
