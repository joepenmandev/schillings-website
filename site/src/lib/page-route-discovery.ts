/**
 * Runtime route index from the filesystem (import.meta.glob). Use page-route-discovery-core in tests.
 *
 * UK pages are not auto-copied; US/IE mirrors live under src/pages/us/ and src/pages/ie/.
 */
import type { Locale } from '../i18n/config';
import { localeSwitcherLabels, locales } from '../i18n/config';
import { publicPathname } from './public-url';
import {
  buildHtmlSitemapGroupsFromIndex,
  parseGlobKeyToRoute,
  pickBestStaticTail,
  type HtmlSitemapGroup,
  type HtmlSitemapItem,
} from './page-route-discovery-core';
import { officeSlugs } from './offices';

export type { HtmlSitemapGroup, HtmlSitemapItem };
export { parseGlobKeyToRoute, pickBestStaticTail, labelForStaticTail } from './page-route-discovery-core';

const pageModules = import.meta.glob('../pages/**/index.astro', { eager: true });

let cachedByLocale: Record<Locale, Set<string>> | null = null;

export function getStaticRouteTailsByLocale(): Record<Locale, Set<string>> {
  if (cachedByLocale) return cachedByLocale;
  const result: Record<Locale, Set<string>> = {
    'en-gb': new Set(),
    'en-us': new Set(),
    'en-ie': new Set(),
  };
  for (const key of Object.keys(pageModules)) {
    const parsed = parseGlobKeyToRoute(key);
    if (!parsed) continue;
    result[parsed.locale].add(parsed.tail);
  }
  for (const slug of officeSlugs) {
    for (const loc of locales) {
      result[loc].add(slug);
    }
  }
  cachedByLocale = result;
  return result;
}

export function staticRouteExists(locale: Locale, tail: string): boolean {
  const normalized = tail.replace(/^\/+|\/+$/g, '');
  return getStaticRouteTailsByLocale()[locale].has(normalized);
}

export function resolveLocalePublicPath(locale: Locale, tail: string): { pathname: string; isFallback: boolean } {
  const by = getStaticRouteTailsByLocale()[locale];
  const { tail: best, isFallback } = pickBestStaticTail(tail, by);
  return { pathname: publicPathname(locale, best), isFallback };
}

export function buildHtmlSitemapGroups(locale: Locale): HtmlSitemapGroup[] {
  return buildHtmlSitemapGroupsFromIndex(getStaticRouteTailsByLocale(), locale);
}

export type RegionSwitchTarget = {
  locale: Locale;
  label: string;
  href: string;
  isCurrent: boolean;
  showFallbackHint: boolean;
};

export function getRegionSwitchTargets(currentLocale: Locale, pathAfterLocale: string): RegionSwitchTarget[] {
  const t = pathAfterLocale.replace(/^\/+|\/+$/g, '');
  return locales.map((loc) => {
    const { pathname, isFallback } = resolveLocalePublicPath(loc, t);
    const isCurrent = loc === currentLocale;
    return {
      locale: loc,
      label: localeSwitcherLabels[loc],
      href: pathname,
      isCurrent,
      showFallbackHint: !isCurrent && isFallback,
    };
  });
}
