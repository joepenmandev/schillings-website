import { describe, expect, it } from 'vitest';
import { getNewsBySlug } from '../data/news';
import type { NewsArticle } from '../data/news';
import {
  firstNonemptyParagraphIndex,
  newsDisplayAuthors,
  newsExcerpt,
  newsHeroAlt,
  newsHeroDisplaySrc,
  newsHeroSource,
  newsShowListDate,
  formatNewsCardDateUk,
} from './news-render';

const base: NewsArticle = {
  id: 'x',
  slug: 'slug',
  locale: 'en-gb',
  title: 'Title',
  date: '2026-05-05',
  description: 'Description here',
  paragraphs: ['Paragraph one'],
  legacyUrl: 'https://legacy.example.com/x',
  status: 'published',
};

describe('news-render helpers', () => {
  it('uses article description when present', () => {
    expect(newsExcerpt(base)).toContain('Description here');
  });

  it('falls back to first paragraph when description is empty', () => {
    const a: NewsArticle = { ...base, description: '   ', paragraphs: ['Lead paragraph text'] };
    expect(newsExcerpt(a)).toContain('Lead paragraph text');
  });

  it('prefers heroImage source over legacy image', () => {
    const a: NewsArticle = { ...base, heroImage: { src: '/hero.webp', alt: 'Alt' }, image: '/old.jpg' };
    expect(newsHeroSource(a)).toBe('/hero.webp');
    expect(newsHeroAlt(a)).toBe('Alt');
  });

  it('falls back to legacy author raw when slugs missing', () => {
    const a: NewsArticle = { ...base, authorSlugs: [], legacyAuthorRaw: 'Legacy Name' };
    expect(newsDisplayAuthors(a)).toEqual(['Legacy Name']);
  });

  it('returns only slugs that resolve to published bios', () => {
    const a = getNewsBySlug('twelve-schillings-partners-featured-in-spears-500-guide-to-top-hnw-advisors');
    expect(a).toBeTruthy();
    expect(newsDisplayAuthors(a!)).toEqual(['chris-bell-watson']);
  });

  it('newsHeroDisplaySrc skips OG placeholder and uses first author photo', () => {
    const a: NewsArticle = {
      ...base,
      authorSlugs: ['jenny-afia'],
      heroImage: { src: '/og-default.svg', alt: '' },
      image: '/og-default.svg',
    };
    expect(newsHeroDisplaySrc(a)).toBe('/people-photos/jenny-afia.webp');
  });

  it('newsHeroDisplaySrc uses real hero when not a placeholder', () => {
    const a: NewsArticle = {
      ...base,
      heroImage: { src: '/news-images/example.webp', alt: '' },
      image: '/news-images/example.webp',
    };
    expect(newsHeroDisplaySrc(a)).toBe('/news-images/example.webp');
  });

  it('falls back to legacy line when slugs do not resolve', () => {
    const a: NewsArticle = {
      ...base,
      authorSlugs: ['not-a-real-person-slug'],
      legacyAuthorRaw: 'Desk name',
    };
    expect(newsDisplayAuthors(a)).toEqual(['Desk name']);
  });

  it('returns empty when slugs do not resolve and no legacy line', () => {
    const a: NewsArticle = { ...base, authorSlugs: ['not-a-real-person-slug'] };
    expect(newsDisplayAuthors(a)).toEqual([]);
  });

  it('hides list date for migration placeholder', () => {
    const a: NewsArticle = { ...base, date: '1970-01-01' };
    expect(newsShowListDate(a)).toBe(false);
  });

  it('shows list date for real publish dates', () => {
    expect(newsShowListDate(base)).toBe(true);
  });

  it('formats card date as DD / MM / YY', () => {
    expect(formatNewsCardDateUk(base)).toBe('05 / 05 / 26');
    expect(formatNewsCardDateUk({ ...base, date: '1970-01-01' })).toBeNull();
  });

  it('firstNonemptyParagraphIndex finds first non-empty paragraph', () => {
    expect(firstNonemptyParagraphIndex(['', '  ', 'Hello'])).toBe(2);
    expect(firstNonemptyParagraphIndex(['Lead'])).toBe(0);
  });

  it('firstNonemptyParagraphIndex returns -1 when no content', () => {
    expect(firstNonemptyParagraphIndex([])).toBe(-1);
    expect(firstNonemptyParagraphIndex(['', ' '])).toBe(-1);
  });
});

