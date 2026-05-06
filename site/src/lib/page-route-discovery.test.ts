import { describe, expect, it } from 'vitest';
import { parseGlobKeyToRoute, pickBestStaticTail, labelForStaticTail } from './page-route-discovery-core';

describe('parseGlobKeyToRoute', () => {
  it('parses UK home and nested routes', () => {
    expect(parseGlobKeyToRoute('../pages/index.astro')).toEqual({ locale: 'en-gb', tail: '' });
    expect(parseGlobKeyToRoute('../pages/contact/index.astro')).toEqual({ locale: 'en-gb', tail: 'contact' });
    expect(parseGlobKeyToRoute('../pages/compliance/schillings-sra/index.astro')).toEqual({
      locale: 'en-gb',
      tail: 'compliance/schillings-sra',
    });
  });

  it('parses prefixed locales', () => {
    expect(parseGlobKeyToRoute('../pages/us/index.astro')).toEqual({ locale: 'en-us', tail: '' });
    expect(parseGlobKeyToRoute('../pages/us/contact/index.astro')).toEqual({ locale: 'en-us', tail: 'contact' });
    expect(parseGlobKeyToRoute('../pages/ie/sitemap/index.astro')).toEqual({ locale: 'en-ie', tail: 'sitemap' });
  });

  it('returns null for dynamic segments', () => {
    expect(parseGlobKeyToRoute('../pages/news/[slug]/index.astro')).toBeNull();
    expect(parseGlobKeyToRoute('../pages/us/people/[slug]/index.astro')).toBeNull();
  });
});

describe('pickBestStaticTail', () => {
  const set = new Set(['', 'news', 'news/foo', 'contact']);

  it('exact match', () => {
    expect(pickBestStaticTail('contact', set)).toEqual({ tail: 'contact', isFallback: false });
  });

  it('walks up to parent section', () => {
    expect(pickBestStaticTail('news/foo/bar', set)).toEqual({ tail: 'news/foo', isFallback: true });
    expect(pickBestStaticTail('news/unknown-slug', set)).toEqual({ tail: 'news', isFallback: true });
  });

  it('falls back to home', () => {
    expect(pickBestStaticTail('does-not-exist', set)).toEqual({ tail: '', isFallback: true });
  });
});

describe('labelForStaticTail', () => {
  it('uses site-nav labels when present', () => {
    expect(labelForStaticTail('about-us')).toBe('About');
    expect(labelForStaticTail('')).toBe('Home');
  });

  it('title-cases unknown tails', () => {
    expect(labelForStaticTail('keith-schilling-founder')).toBe('Keith Schilling Founder');
  });
});
