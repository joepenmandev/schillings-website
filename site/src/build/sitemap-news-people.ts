/**
 * Sitemap extras: indexable `/news/{slug}/` and `/people/{slug}/` for every locale.
 * Keeps thin migration URLs out (same rules as on-page `noindex`).
 */
import newsSitemapSlugs from '../data/news-sitemap-slugs.json';
import peopleSitemapSlugs from '../data/people-sitemap-slugs.json';
import { getNewsBySlug, publishedNews } from '../data/news';
import { EXPERTISE_IDS } from '../data/people-taxonomy';
import { expertisePathSlug } from '../lib/expertise-paths';
import { getPersonBySlug, publishedPeople } from '../data/people';
import { locales } from '../i18n/config';
import { isThinPersonProfile } from '../lib/person-profile-quality';
import { publicPathname } from '../lib/public-url';

const newsAllow = newsSitemapSlugs as string[];
const peopleAllow = peopleSitemapSlugs as string[];

/** Pathname without trailing slash (except `'/'`). */
function normalizePathname(pathname: string): string {
  const p = pathname.replace(/\/$/, '');
  return p || '/';
}

export function isThinMigrationNewsPath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  const prefixed = path.match(/^\/(us|ie)\/news\/([^/]+)$/);
  if (prefixed) {
    const slug = prefixed[2];
    return newsAllow.includes(slug) && !getNewsBySlug(slug);
  }
  const gb = path.match(/^\/news\/([^/]+)$/);
  if (gb) {
    const slug = gb[1];
    if (slug === 'rss.xml') return false;
    return newsAllow.includes(slug) && !getNewsBySlug(slug);
  }
  return false;
}

export function isThinMigrationPeoplePath(pathname: string): boolean {
  const path = normalizePathname(pathname);
  const prefixed = path.match(/^\/(us|ie)\/people\/([^/]+)$/);
  if (prefixed) {
    const slug = prefixed[2];
    return peopleAllow.includes(slug) && !getPersonBySlug(slug);
  }
  const gb = path.match(/^\/people\/([^/]+)$/);
  if (gb) {
    const slug = gb[1];
    return peopleAllow.includes(slug) && !getPersonBySlug(slug);
  }
  return false;
}

/**
 * True when a people profile URL should not appear in the XML sitemap:
 * migration placeholder routes, or published profiles with thin bios (matches on-page noindex).
 */
export function isExcludedPeopleProfileFromSitemap(pageUrlOrPath: string): boolean {
  let pathname: string;
  try {
    pathname = normalizePathname(new URL(pageUrlOrPath).pathname);
  } catch {
    pathname = normalizePathname(pageUrlOrPath);
  }
  if (isThinMigrationPeoplePath(pathname)) return true;
  const prefixed = pathname.match(/^\/(us|ie)\/people\/([^/]+)$/);
  const gb = pathname.match(/^\/people\/([^/]+)$/);
  const slug = prefixed?.[2] ?? gb?.[1];
  if (!slug) return false;
  const person = getPersonBySlug(slug);
  return Boolean(person && isThinPersonProfile(person));
}

/** Absolute URLs for every published article and full (non-thin) person profile, all locales. */
export function indexableNewsAndPeopleAbsoluteUrls(siteOrigin: string): string[] {
  const origin = siteOrigin.replace(/\/$/, '');
  const newsSlugs = [...new Set(publishedNews().map((a) => a.slug))];
  const peopleForSitemap = publishedPeople().filter((p) => !isThinPersonProfile(p));
  const urls: string[] = [];
  for (const locale of locales) {
    for (const slug of newsSlugs) {
      urls.push(origin + publicPathname(locale, `news/${slug}`));
    }
    for (const p of peopleForSitemap) {
      urls.push(origin + publicPathname(locale, `people/${p.slug}`));
    }
  }
  return urls;
}

/** Absolute URLs for every expertise hub detail page (`/expertise/{public-slug}/`, `/us/…`, `/ie/…`) — SSR routes omitted from auto-discovery. */
export function expertiseHubAbsoluteUrls(siteOrigin: string): string[] {
  const origin = siteOrigin.replace(/\/$/, '');
  const urls: string[] = [];
  for (const locale of locales) {
    for (const expertiseId of EXPERTISE_IDS) {
      urls.push(origin + publicPathname(locale, `expertise/${expertisePathSlug(expertiseId)}`));
    }
  }
  return urls;
}
