import { publishedNews } from '../data/news';
import newsSitemapSlugs from '../data/news-sitemap-slugs.json';

/** Union of editorial stubs (`news.ts`) and live sitemap slugs — used for static paths + allow-list. */
export function getAllNewsSlugs(): string[] {
  const fromData = publishedNews().map((a) => a.slug);
  return [...new Set([...fromData, ...newsSitemapSlugs])];
}
