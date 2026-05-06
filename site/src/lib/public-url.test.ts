import { describe, expect, it } from 'vitest';
import { absolutePageUrl, publicPathname } from './public-url';

describe('public-url', () => {
  it('primary locale has no path prefix', () => {
    expect(publicPathname('en-gb', '')).toBe('/');
    expect(publicPathname('en-gb', 'news/foo')).toBe('/news/foo/');
    expect(absolutePageUrl('https://x.com', 'en-gb', 'contact')).toBe('https://x.com/contact/');
  });

  it('secondary locales stay prefixed', () => {
    expect(publicPathname('en-us', '')).toBe('/us/');
    expect(publicPathname('en-us', 'news')).toBe('/us/news/');
    expect(absolutePageUrl('https://x.com/', 'en-ie', '')).toBe('https://x.com/ie/');
  });
});
