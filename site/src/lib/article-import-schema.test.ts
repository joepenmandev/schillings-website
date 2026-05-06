import { describe, expect, it } from 'vitest';
import { parseImportedArticleRecord } from './article-import-schema';

describe('parseImportedArticleRecord', () => {
  it('parses a valid strict article import record', () => {
    const out = parseImportedArticleRecord({
      id: 'legacy:1234',
      slug: 'sample-article',
      locale: 'en-gb',
      title: 'Sample article',
      description: 'Summary.',
      datePublished: '2026-05-05',
      dateModified: '2026-05-06',
      body: ['P1', 'P2'],
      legacyUrl: 'https://legacy.example.com/news/sample-article',
      status: 'migrated-unreviewed',
      heroImage: { src: '/news-images/sample.webp', alt: 'Sample hero' },
      topics: ['litigation'],
      services: ['reputation_privacy'],
      legacyAuthorRaw: 'J Doe',
    });

    expect(out.slug).toBe('sample-article');
    expect(out.locale).toBe('en-gb');
    expect(out.heroImage?.src).toBe('/news-images/sample.webp');
    expect(out.status).toBe('migrated-unreviewed');
  });

  it('fails on invalid slug format', () => {
    expect(() =>
      parseImportedArticleRecord({
        id: 'legacy:1',
        slug: 'Bad Slug',
        locale: 'en-gb',
        title: 'x',
        description: 'y',
        datePublished: '2026-05-05',
        body: ['z'],
        legacyUrl: 'https://legacy.example.com/x',
        status: 'published',
      }),
    ).toThrow(/slug/);
  });

  it('fails on missing required fields', () => {
    expect(() =>
      parseImportedArticleRecord({
        slug: 'ok-slug',
        locale: 'en-gb',
        title: 'x',
        description: 'y',
        datePublished: '2026-05-05',
        body: ['z'],
        legacyUrl: 'https://legacy.example.com/x',
        status: 'published',
      }),
    ).toThrow(/id/);
  });

  it('fails on invalid locale/date/status', () => {
    expect(() =>
      parseImportedArticleRecord({
        id: 'legacy:2',
        slug: 'ok-slug',
        locale: 'en',
        title: 'x',
        description: 'y',
        datePublished: '2026/05/05',
        body: ['z'],
        legacyUrl: 'https://legacy.example.com/x',
        status: 'live',
      }),
    ).toThrow(/locale|datePublished|status/);
  });
});

