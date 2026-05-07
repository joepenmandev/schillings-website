import { describe, expect, it } from 'vitest';
import { buildNewsArticleBlogPostingGraph } from './jsonld-article';
import type { NewsArticle } from '../data/news';
import type { PersonProfile } from '../data/people';

const baseArticle: NewsArticle = {
  id: 't',
  slug: 'test-article',
  locale: 'en-gb',
  title: 'Test headline',
  date: '2026-01-15',
  description: 'Deck line.',
  paragraphs: ['Body.'],
  legacyUrl: 'https://example.com/t',
  status: 'published',
  authorSlugs: ['jane-doe'],
  topics: ['Reputation', 'Privacy'],
};

const jane: PersonProfile = {
  slug: 'jane-doe',
  name: 'Jane Doe',
  role: 'Partner',
  office: 'London',
  paragraphs: ['Bio.'],
  imagePath: '/people-photos/jane-doe.webp',
  sameAs: ['https://linkedin.com/in/janedoe'],
};

describe('buildNewsArticleBlogPostingGraph', () => {
  it('emits Person node with stable @id and BlogPosting with isPartOf WebSite', () => {
    const pageUrl = 'https://example.org/news/test-article/';
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: baseArticle,
      pageUrl,
      resolvePerson: (s) => (s === 'jane-doe' ? jane : null),
    });
    expect(g['@graph']).toHaveLength(2);
    const person = g['@graph'][0] as Record<string, unknown>;
    const post = g['@graph'][1] as Record<string, unknown>;
    expect(person['@type']).toBe('Person');
    expect(person['@id']).toBe('https://example.org/people/jane-doe/#person');
    expect(post['@type']).toBe('BlogPosting');
    expect(post.isPartOf).toEqual({ '@id': 'https://example.org/#website' });
    expect(post.articleSection).toBe('Reputation');
    expect(post.keywords).toBe('Reputation, Privacy');
    expect(post.author).toEqual({ '@id': 'https://example.org/people/jane-doe/#person' });
    expect(person.description).toBe('Bio.');
    expect(post.speakable).toEqual({
      '@type': 'SpeakableSpecification',
      cssSelector: ['#article-headline', '#article-lede'],
    });
  });

  it('drops unmapped author slugs (Schillings bios only)', () => {
    const a: NewsArticle = {
      ...baseArticle,
      authorSlugs: ['jane-doe', 'not-a-published-person'],
    };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: (s) => (s === 'jane-doe' ? jane : null),
    });
    const post = g['@graph'][1] as Record<string, unknown>;
    expect(g['@graph']).toHaveLength(2);
    expect(post.author).toEqual({ '@id': 'https://example.org/people/jane-doe/#person' });
  });

  it('speakable uses headline only when there is no body paragraph', () => {
    const a: NewsArticle = { ...baseArticle, paragraphs: ['', '  ', ''] };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: (s) => (s === 'jane-doe' ? jane : null),
    });
    const post = g['@graph'][1] as Record<string, unknown>;
    expect(post.speakable).toEqual({
      '@type': 'SpeakableSpecification',
      cssSelector: ['#article-headline'],
    });
  });

  it('falls back to Organization as author when no people or legacy line', () => {
    const a: NewsArticle = { ...baseArticle, authorSlugs: [], legacyAuthorRaw: '' };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: () => null,
    });
    const post = g['@graph'][0] as Record<string, unknown>;
    expect(post.author).toEqual({ '@id': 'https://example.org/#organization' });
  });

  it('firm byline slug schillings references Organization @id (no Person graph node)', () => {
    const a: NewsArticle = { ...baseArticle, authorSlugs: ['schillings'] };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: () => null,
    });
    expect(g['@graph']).toHaveLength(1);
    const post = g['@graph'][0] as Record<string, unknown>;
    expect(post.author).toEqual({ '@id': 'https://example.org/#organization' });
  });

  it('omits BlogPosting image when hero resolves to SVG', () => {
    const a: NewsArticle = {
      ...baseArticle,
      heroImage: { src: '/art.svg', alt: '' },
    };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: (s) => (s === 'jane-doe' ? jane : null),
    });
    const post = g['@graph'][1] as Record<string, unknown>;
    expect(post.image).toBeUndefined();
  });

  it('uses publishedAt for datePublished when set', () => {
    const a: NewsArticle = {
      ...baseArticle,
      publishedAt: '2026-01-15T14:00:00.000Z',
    };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: (s) => (s === 'jane-doe' ? jane : null),
    });
    const post = g['@graph'][1] as Record<string, unknown>;
    expect(post.datePublished).toBe('2026-01-15T14:00:00.000Z');
  });

  it('uses legacyAuthorRaw as Person when slugs empty (migration credit)', () => {
    const a: NewsArticle = { ...baseArticle, authorSlugs: [], legacyAuthorRaw: 'Legacy credit line' };
    const g = buildNewsArticleBlogPostingGraph({
      origin: 'https://example.org',
      locale: 'en-gb',
      article: a,
      pageUrl: 'https://example.org/news/test-article/',
      resolvePerson: () => null,
    });
    const post = g['@graph'][0] as Record<string, unknown>;
    expect(post.author).toEqual({ '@type': 'Person', name: 'Legacy credit line' });
  });
});
