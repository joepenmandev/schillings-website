/**
 * Locale-specific document title and meta description for high-traffic marketing routes.
 * Improves international SERP differentiation; keep in sync with on-page H1/hero (`homeHero` in strategic-rebuild-content).
 */
import type { Locale } from '../i18n/config';
import { homeHero } from '../data/strategic-rebuild-content';

/** Short tail so meta descriptions stay distinct per locale while sharing the hero subhead. */
const HOME_META_TAIL: Record<Locale, string> = {
  'en-gb': 'London, Miami and Dublin.',
  'en-us': 'United States, Latin America and cross-border mandates — Miami, London and Dublin.',
  'en-ie': 'Ireland and EU gateway — Dublin, London and Miami.',
};

export function homePageMeta(locale: Locale): { title: string; description: string } {
  const description = `${homeHero.subheadline} ${HOME_META_TAIL[locale]}`;
  switch (locale) {
    case 'en-us':
      return {
        title: 'Reputation, Privacy & Security | Schillings — Americas',
        description,
      };
    case 'en-ie':
      return {
        title: 'Reputation, Privacy & Security | Schillings — Ireland & EU',
        description,
      };
    default:
      return {
        title: 'Protecting reputation, privacy, security and continuity | Schillings',
        description,
      };
  }
}

export function peopleDirectoryMeta(locale: Locale): { title: string; description: string } {
  switch (locale) {
    case 'en-us':
      return {
        title: 'People | Schillings — United States',
        description:
          'Schillings lawyers and specialists — filter by department, seniority, office (Miami, London, Dublin) and expertise.',
      };
    case 'en-ie':
      return {
        title: 'People | Schillings — Ireland',
        description:
          'Browse Schillings partners and specialists across Dublin, London and Miami — by department, seniority, location and expertise.',
      };
    default:
      return {
        title: 'People | Schillings',
        description:
          'Schillings lawyers and specialists — browse by department, seniority, location, and expertise.',
      };
  }
}

export function contactPageMeta(locale: Locale): { title: string; description: string; pageEntityName: string } {
  switch (locale) {
    case 'en-us':
      return {
        title: 'Contact Schillings Miami, USA',
        description:
          'Contact Schillings — enquiry form, offices in Miami, London and Dublin, twenty-four-hour urgent line, and minimum engagement information. Discretion-led enquiries for sensitive reputation, privacy, and legal matters.',
        pageEntityName: 'Contact Schillings Miami, USA',
      };
    case 'en-ie':
      return {
        title: 'Contact Schillings Dublin, Ireland',
        description:
          'Contact Schillings — enquiry form, Dublin, London and Miami offices, urgent line, and minimum engagement information. Discretion-led enquiries for sensitive reputation, privacy, and legal matters.',
        pageEntityName: 'Contact Schillings Dublin, Ireland',
      };
    default:
      return {
        title: 'Contact Schillings London, UK',
        description:
          'Contact Schillings — enquiry form, offices in London, Miami and Dublin, urgent line, and minimum engagement information. Discretion-led enquiries for sensitive reputation, privacy, and legal matters.',
        pageEntityName: 'Contact Schillings London, UK',
      };
  }
}
