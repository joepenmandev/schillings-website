/**
 * Public URL paths: UK (en-GB) unprefixed; US / Ireland use `/us/…` and `/ie/…`.
 */
import type { Locale } from '../i18n/config';
import { defaultLocale, localePathPrefix } from '../i18n/config';

/** Last segment looks like a file (`rss.xml`, images) — no trailing slash (Astro endpoints 404 with `/rss.xml/` in dev). */
function isFileLikeTail(tail: string): boolean {
  const last = tail.split('/').pop() ?? '';
  return last.includes('.') && /^[\w%-]+\.[a-z0-9]{2,12}$/i.test(last);
}

/** Site-relative path with trailing slash for “directory” pages; file-like tails stay extension URLs. */
export function publicPathname(locale: Locale, pathAfterLocale: string): string {
  const tail = pathAfterLocale.replace(/^\/+|\/+$/g, '');
  const fileLike = tail && isFileLikeTail(tail);
  if (locale === defaultLocale) {
    if (!tail) return '/';
    if (fileLike) return `/${tail}`;
    return `/${tail}/`;
  }
  const prefix = localePathPrefix[locale];
  if (!tail) return `/${prefix}/`;
  if (fileLike) return `/${prefix}/${tail}`;
  return `/${prefix}/${tail}/`;
}

/** Absolute canonical URL for a page. */
export function absolutePageUrl(origin: string, locale: Locale, pathAfterLocale: string): string {
  const o = origin.replace(/\/$/, '');
  return o + publicPathname(locale, pathAfterLocale);
}
