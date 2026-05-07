import { describe, expect, it } from 'vitest';
import { SCHILLINGS_NEWS_AUTHOR_SLUG } from '../data/news-house-author';
import { getNewsBySlug } from '../data/news';
import type { NewsArticle } from '../data/news';
import { latestPostsByAuthorsSectionTitle, newsListAuthorEntries } from './news-list-authors';

describe('newsListAuthorEntries', () => {
  it('maps firm byline slug to profile entry', () => {
    const a: NewsArticle = {
      id: 'house-test',
      slug: 'house-test',
      locale: 'en-gb',
      title: 'T',
      date: '2026-01-01',
      description: 'D',
      paragraphs: [],
      legacyUrl: 'https://example.com',
      status: 'published',
      authorSlugs: [SCHILLINGS_NEWS_AUTHOR_SLUG],
    };
    const entries = newsListAuthorEntries(a);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      type: 'profile',
      slug: SCHILLINGS_NEWS_AUTHOR_SLUG,
      name: 'Schillings',
    });
  });

  it('maps published article with author slug to profile entries', () => {
    const a = getNewsBySlug('twelve-schillings-partners-featured-in-spears-500-guide-to-top-hnw-advisors');
    expect(a).toBeTruthy();
    const entries = newsListAuthorEntries(a!);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      type: 'profile',
      slug: 'chris-bell-watson',
      name: expect.stringMatching(/Chris/i),
    });
  });

  it('returns legacy credit when slugs resolve to nothing', () => {
    const a: NewsArticle = {
      id: 'x',
      slug: 'x',
      locale: 'en-gb',
      title: 'T',
      date: '2026-01-01',
      description: 'D',
      paragraphs: [],
      legacyUrl: 'https://example.com',
      status: 'published',
      authorSlugs: ['definitely-not-a-real-person-slug-xyz'],
      legacyAuthorRaw: 'Editorial desk',
    };
    expect(newsListAuthorEntries(a)).toEqual([{ type: 'credit', name: 'Editorial desk' }]);
  });

  it('builds latest-posts heading for one or many names', () => {
    expect(latestPostsByAuthorsSectionTitle([])).toBe('Further reading');
    expect(latestPostsByAuthorsSectionTitle([{ type: 'profile', slug: 'a', name: 'Ann', role: 'Partner' }])).toBe(
      'Further analysis from Ann',
    );
    expect(
      latestPostsByAuthorsSectionTitle([
        { type: 'profile', slug: 'a', name: 'Ann', role: 'Partner' },
        { type: 'profile', slug: 'b', name: 'Ben', role: 'Associate' },
      ]),
    ).toBe('Further analysis from Ann and Ben');
    expect(
      latestPostsByAuthorsSectionTitle([
        { type: 'credit', name: 'Guest' },
        { type: 'profile', slug: 'b', name: 'Ben', role: 'Associate' },
        { type: 'profile', slug: 'c', name: 'Cara', role: 'Partner' },
      ]),
    ).toBe('Further analysis from Guest, Ben and Cara');
  });

  it('returns empty when no authors', () => {
    const a: NewsArticle = {
      id: 'y',
      slug: 'y',
      locale: 'en-gb',
      title: 'T',
      date: '2026-01-01',
      description: 'D',
      paragraphs: [],
      legacyUrl: 'https://example.com',
      status: 'published',
    };
    expect(newsListAuthorEntries(a)).toEqual([]);
  });
});
