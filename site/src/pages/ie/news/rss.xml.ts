import type { APIRoute } from 'astro';
import { publishedNews } from '@/data/news';
import { articleDatePublishedIso } from '@/lib/news-datetime';
import { newsExcerpt, newsShowListDate } from '@/lib/news-render';
import { buildNewsRssXml, rssChannelLanguage } from '@/lib/rss-feed';
import type { Locale } from '@/i18n/config';
import { absolutePageUrl } from '@/lib/public-url';

export const GET: APIRoute = ({ site, url }) => {
  const locale = 'en-ie' as Locale;
  const origin = (site?.origin ?? url.origin);
  const channelLink = absolutePageUrl(origin, locale, 'news');
  const sorted = [...publishedNews()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const selfFeedUrl = absolutePageUrl(origin, locale, 'news/rss.xml');
  const xml = buildNewsRssXml({
    channelTitle: `Schillings — News & Insights (${locale})`,
    channelLink,
    channelDescription: 'News, views, and analysis from Schillings.',
    selfFeedUrl,
    channelLanguage: rssChannelLanguage(locale),
    items: sorted.map((a) => ({
      title: a.title,
      link: absolutePageUrl(origin, locale, `news/${a.slug}`),
      description: newsExcerpt(a, 240),
      ...(newsShowListDate(a) ? { isoDate: articleDatePublishedIso(a) } : {}),
    })),
  });
  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
