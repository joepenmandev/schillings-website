/**
 * Public URL paths: UK (en-GB) unprefixed; US / Ireland use `/us/…` and `/ie/…`.
 */
import type { Locale } from '../i18n/config';
import { defaultLocale, localePathPrefix } from '../i18n/config';

/** Site-relative path with trailing slash: `/`, `/news/foo/`, `/us/contact/`. */
export function publicPathname(locale: Locale, pathAfterLocale: string): string {
  const tail = pathAfterLocale.replace(/^\/+|\/+$/g, '');
  if (locale === defaultLocale) {
    if (!tail) return '/';
    return `/${tail}/`;
  }
  const prefix = localePathPrefix[locale];
  if (!tail) return `/${prefix}/`;
  return `/${prefix}/${tail}/`;
}

/** Absolute canonical URL for a page. */
export function absolutePageUrl(origin: string, locale: Locale, pathAfterLocale: string): string {
  const o = origin.replace(/\/$/, '');
  return o + publicPathname(locale, pathAfterLocale);
}
