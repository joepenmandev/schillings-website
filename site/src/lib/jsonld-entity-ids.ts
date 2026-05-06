/** Stable `@id` IRIs for JSON-LD graph linking (schema.org sameAs-style intra-document references). */
import { localePathPrefix } from '../i18n/config';

export function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '');
}

/** Canonical Organization node — referenced by Person `worksFor`, BlogPosting `publisher`, etc. */
export function organizationNodeId(origin: string): string {
  return `${normalizeOrigin(origin)}/#organization`;
}

/** Logo ImageObject — referenced by Organization `logo`. */
export function logoImageObjectId(origin: string): string {
  return `${normalizeOrigin(origin)}/#logo`;
}

/** Locale-scoped WebSite — referenced by ProfilePage `isPartOf`. Primary locale uses root. */
export function websiteNodeId(origin: string, locale: string): string {
  const o = normalizeOrigin(origin);
  if (locale === 'en-gb') return `${o}/#website`;
  const prefix = localePathPrefix[locale as keyof typeof localePathPrefix];
  return `${o}/${prefix}/#website`;
}
