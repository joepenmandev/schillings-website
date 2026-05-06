import { describe, expect, it } from 'vitest';
import type { NewsArticle } from '../data/news';
import {
  articlesMatchingTopicSlug,
  topicSlugFromLabel,
  uniqueTopicEntriesFromArticles,
} from './news-topic-slug';

const base: NewsArticle = {
  id: 'x',
  slug: 's',
  locale: 'en-gb',
  title: 'T',
  date: '2026-01-01',
  description: 'D',
  paragraphs: ['p'],
  legacyUrl: 'https://example.com/x',
  status: 'published',
};

describe('news-topic-slug', () => {
  it('slugifies labels for URLs', () => {
    expect(topicSlugFromLabel('Disinformation')).toBe('disinformation');
    expect(topicSlugFromLabel('AI & Risk')).toBe('ai-risk');
  });

  it('matches articles by topic slug', () => {
    const a: NewsArticle = { ...base, topics: ['Disinformation', 'Privacy'] };
    const b: NewsArticle = { ...base, id: 'y', slug: 'y', topics: ['Investigations'] };
    expect(articlesMatchingTopicSlug([a, b], 'disinformation')).toEqual([a]);
  });

  it('builds unique entries sorted by label', () => {
    const a: NewsArticle = { ...base, topics: ['Zebra', 'Apple'] };
    const b: NewsArticle = { ...base, id: 'y', slug: 'y', topics: ['apple'] };
    expect(uniqueTopicEntriesFromArticles([a, b])).toEqual([
      { slug: 'apple', label: 'Apple' },
      { slug: 'zebra', label: 'Zebra' },
    ]);
  });
});
