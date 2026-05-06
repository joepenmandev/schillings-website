import { publishedPeople } from '../data/people';
import peopleSitemapSlugs from '../data/people-sitemap-slugs.json';

/** Union of bios (`people.ts`) and live sitemap slugs — static paths + allow-list. */
export function getAllPeopleSlugs(): string[] {
  const fromData = publishedPeople().map((p) => p.slug);
  return [...new Set([...fromData, ...peopleSitemapSlugs])];
}
