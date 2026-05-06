import { describe, it, expect } from 'vitest';
import { buildNewsRssXml, escapeXml, rfc822FromIsoDate } from './rss-feed';

describe('rss-feed', () => {
  it('escapes XML special characters', () => {
    expect(escapeXml('A & B <tag> "q"')).toBe('A &amp; B &lt;tag&gt; &quot;q&quot;');
  });

  it('formats ISO date to RFC 822 UTC', () => {
    expect(rfc822FromIsoDate('2026-05-01')).toMatch(/GMT$/);
  });

  it('formats full ISO instant for pubDate', () => {
    expect(rfc822FromIsoDate('2026-05-01T09:30:00.000Z')).toContain('2026');
    expect(rfc822FromIsoDate('2026-05-01T09:30:00.000Z')).toMatch(/GMT$/);
  });

  it('omits pubDate when isoDate is absent', () => {
    const xml = buildNewsRssXml({
      channelTitle: 'T',
      channelLink: 'https://example.com/news/',
      channelDescription: 'D',
      selfFeedUrl: 'https://example.com/news/rss.xml',
      items: [{ title: 'A', link: 'https://example.com/news/a/', description: 'x' }],
    });
    expect(xml).not.toContain('<pubDate>');
  });

  it('defaults channel language to en-gb', () => {
    const xml = buildNewsRssXml({
      channelTitle: 'T',
      channelLink: 'https://example.com/news/',
      channelDescription: 'D',
      selfFeedUrl: 'https://example.com/news/rss.xml',
      items: [],
    });
    expect(xml).toContain('<language>en-gb</language>');
  });

  it('accepts explicit channel language', () => {
    const xml = buildNewsRssXml({
      channelTitle: 'T',
      channelLink: 'https://example.com/news/',
      channelDescription: 'D',
      selfFeedUrl: 'https://example.com/news/rss.xml',
      channelLanguage: 'en-us',
      items: [],
    });
    expect(xml).toContain('<language>en-us</language>');
  });
});
