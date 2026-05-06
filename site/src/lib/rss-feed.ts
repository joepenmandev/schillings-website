/** Minimal RSS 2.0 builder — no extra dependencies. */

import type { Locale } from '../i18n/config';

/** RSS 2.0 `<language>` (BCP 47 style, e.g. en-gb). */
export function rssChannelLanguage(locale: Locale): string {
  if (locale === 'en-us') return 'en-us';
  if (locale === 'en-ie') return 'en-ie';
  return 'en-gb';
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS `pubDate` — accepts YYYY-MM-DD or full ISO 8601 instant. */
export function rfc822FromIsoDate(iso: string): string {
  let d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    d = new Date(`${iso}T12:00:00.000Z`);
  }
  return d.toUTCString();
}

export function buildNewsRssXml(opts: {
  channelTitle: string;
  channelLink: string;
  channelDescription: string;
  /** Full URL of this RSS document (for `atom:link rel="self"`). */
  selfFeedUrl: string;
  items: { title: string; link: string; description: string; isoDate?: string }[];
}): string {
  const itemsXml = opts.items
    .map(
      (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${escapeXml(it.link)}</link>
      <guid isPermaLink="true">${escapeXml(it.link)}</guid>
      ${it.isoDate ? `<pubDate>${rfc822FromIsoDate(it.isoDate)}</pubDate>` : ''}
      <description>${escapeXml(it.description)}</description>
    </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(opts.channelTitle)}</title>
    <link>${escapeXml(opts.channelLink)}</link>
    <description>${escapeXml(opts.channelDescription)}</description>
    <language>${escapeXml(opts.channelLanguage ?? 'en-gb')}</language>
    <atom:link href="${escapeXml(opts.selfFeedUrl)}" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>
`;
}
