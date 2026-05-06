import { describe, it, expect } from 'vitest';
import { absoluteOgImageUrl } from './absolute-media-url';

describe('absoluteOgImageUrl', () => {
  const origin = 'https://www.example.com';

  it('returns undefined for empty input', () => {
    expect(absoluteOgImageUrl(origin, undefined)).toBeUndefined();
    expect(absoluteOgImageUrl(origin, '  ')).toBeUndefined();
  });

  it('passes through absolute http(s) URLs', () => {
    expect(absoluteOgImageUrl(origin, 'https://cdn.test/x.png')).toBe('https://cdn.test/x.png');
  });

  it('prefixes site-root paths with origin', () => {
    expect(absoluteOgImageUrl(origin, '/og-default.svg')).toBe('https://www.example.com/og-default.svg');
    expect(absoluteOgImageUrl(origin, 'og-default.svg')).toBe('https://www.example.com/og-default.svg');
  });

  it('strips trailing slash on origin', () => {
    expect(absoluteOgImageUrl('https://www.example.com/', '/a.jpg')).toBe('https://www.example.com/a.jpg');
  });
});
