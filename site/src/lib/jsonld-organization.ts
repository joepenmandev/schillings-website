/**
 * Site-wide Organization + WebSite + logo JSON-LD (`@graph`).
 * See https://schema.org/Organization , https://schema.org/WebSite , Google Organization markup.
 *
 * **Policy (confirm with legal/comms):** One global `Organization` node (`Schillings International LLP`)
 * uses the **headquarters postal address** (London) and **SRA** `identifier` on every page —
 * this reflects primary UK regulatory positioning. **Regional reach** is expressed via
 * `contactPoint[]` (London, Miami, Dublin telephones with `areaServed`), not by duplicating
 * full addresses here. **Office URLs** carry **LocalBusiness** with precise geo — see office routes.
 * Change this only with documented approval so structured data stays truthful.
 */
import type { Locale } from '../i18n/config';
import { htmlLang } from '../i18n/config';
import { OFFICES, officeAddressCountry, officeSlugs } from './offices';
import { logoImageObjectId, normalizeOrigin, organizationNodeId, websiteNodeId } from './jsonld-entity-ids';
import { absolutePageUrl } from './public-url';

const LOGO_PATH = '/brand/schillings-logo-rgb.svg';

/** Practice themes for entity understanding (non-exhaustive; complements page-level content). */
const ORGANIZATION_KNOWS_ABOUT = [
  'Reputation management',
  'Privacy law',
  'Defamation',
  'Corporate intelligence',
  'Crisis communications',
  'Cyber security governance',
] as const;

export function buildSiteWideJsonLdGraph(originRaw: string, locale: Locale) {
  const origin = normalizeOrigin(originRaw);
  const orgId = organizationNodeId(origin);
  const logoId = logoImageObjectId(origin);
  const siteId = websiteNodeId(origin, locale);
  const logoUrl = `${origin}${LOGO_PATH}`;

  const logoNode: Record<string, unknown> = {
    '@type': 'ImageObject',
    '@id': logoId,
    url: logoUrl,
    contentUrl: logoUrl,
    caption: 'Schillings logo',
  };

  const organization: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': orgId,
    name: 'Schillings',
    legalName: 'Schillings International LLP',
    alternateName: ['Schillings Partners'],
    url: `${origin}/`,
    logo: { '@id': logoId },
    identifier: {
      '@type': 'PropertyValue',
      propertyID: 'SRA',
      name: 'SRA regulated',
      value: '621152',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12 Arthur Street',
      addressLocality: 'London',
      postalCode: 'EC4R 9AB',
      addressCountry: 'GB',
    },
    contactPoint: officeSlugs.map((slug) => ({
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: OFFICES[slug].schemaTelephone,
      areaServed: officeAddressCountry(slug),
      availableLanguage: ['en-GB', 'en-US', 'en-IE'],
    })),
    sameAs: [
      'https://uk.linkedin.com/company/schillings',
      'https://www.youtube.com/@schillingspartners',
    ],
    knowsAbout: [...ORGANIZATION_KNOWS_ABOUT],
  };

  const website: Record<string, unknown> = {
    '@type': 'WebSite',
    '@id': siteId,
    url: absolutePageUrl(origin, locale, ''),
    name: 'Schillings',
    inLanguage: htmlLang[locale],
    publisher: { '@id': orgId },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [logoNode, organization, website],
  };
}
