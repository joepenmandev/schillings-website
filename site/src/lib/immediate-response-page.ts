import type { Locale } from '../i18n/config';
import { buildJsonLdGraph, buildPageEntityJsonLd } from './jsonld-page';

const SEGMENT = '24-7-immediate-response';

/** Visible page title + meta — stable brand suffix for SERP / sitelinks. */
export const IMMEDIATE_RESPONSE_PAGE_TITLE = 'Immediate response | Schillings';

export function immediateResponseMetaDescription(locale: Locale): string {
  if (locale === 'en-us') {
    return 'Schillings urgent response line for the United States — high-stakes reputation, privacy, intelligence, and security. Call any time, day or night.';
  }
  if (locale === 'en-ie') {
    return 'Schillings urgent response line for Ireland — high-stakes reputation, privacy, intelligence, and security. Call any time, day or night.';
  }
  return 'Schillings urgent response line for the United Kingdom — high-stakes reputation, privacy, intelligence, and security. Call any time, day or night.';
}

export function buildImmediateResponsePageJsonLd(origin: string, locale: Locale) {
  const description = immediateResponseMetaDescription(locale);
  return buildJsonLdGraph(
    buildPageEntityJsonLd({
      origin,
      locale,
      pathSegment: SEGMENT,
      pageType: 'WebPage',
      name: IMMEDIATE_RESPONSE_PAGE_TITLE,
      description,
    }),
  );
}

export function immediateResponseMarketLabel(locale: Locale): string {
  if (locale === 'en-us') return 'United States';
  if (locale === 'en-ie') return 'Ireland';
  return 'United Kingdom';
}
