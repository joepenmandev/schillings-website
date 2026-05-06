/**
 * Build strategic IA URL pathnames (site-relative, with trailing slashes per Astro config).
 * Used by `verify-strategic-crawl` and unit tests.
 */
import { locales, type Locale } from '../src/i18n/config';
import { publicPathname } from '../src/lib/public-url';
import { getAllSituationPathSlugs, getAllWhatWeProtectPathSlugs } from '../src/data/strategic-rebuild-content';
import { EXPERTISE_IDS } from '../src/data/people-taxonomy';

export type StrategicCrawlEntry = { locale: Locale; path: string };

export function buildStrategicCrawlPathnames(): StrategicCrawlEntry[] {
  const out: StrategicCrawlEntry[] = [];
  for (const locale of locales) {
    out.push({ locale, path: publicPathname(locale, '') });
    out.push({ locale, path: publicPathname(locale, 'situations') });
    for (const slug of getAllSituationPathSlugs()) {
      out.push({ locale, path: publicPathname(locale, `situations/${slug}`) });
    }
    out.push({ locale, path: publicPathname(locale, 'what-we-protect') });
    for (const slug of getAllWhatWeProtectPathSlugs()) {
      out.push({ locale, path: publicPathname(locale, `what-we-protect/${slug}`) });
    }
    out.push({ locale, path: publicPathname(locale, 'response-system') });
    out.push({ locale, path: publicPathname(locale, 'expertise') });
    for (const id of EXPERTISE_IDS) {
      out.push({ locale, path: publicPathname(locale, `expertise/${id}`) });
    }
    out.push({ locale, path: publicPathname(locale, 'people') });
    out.push({ locale, path: publicPathname(locale, 'news') });
  }
  return out;
}

/** Pathname pattern for same-site strategic hubs (news/people/situations/what-we-protect/response-system). */
export function isStrategicInternalPathname(pathname: string): boolean {
  let p = pathname.trim() || '/';
  if (!p.startsWith('/')) p = `/${p}`;
  const normalized = p.replace(/\/$/, '') || '/';
  if (/^\/(situations|what-we-protect|response-system|expertise|people|news)(\/.*)?$/.test(normalized))
    return true;
  if (/^\/(us|ie)\/(situations|what-we-protect|response-system|expertise|people|news)(\/.*)?$/.test(normalized))
    return true;
  return false;
}
