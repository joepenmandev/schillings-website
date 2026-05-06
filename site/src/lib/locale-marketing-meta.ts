/**
 * Locale-specific document title and meta description for high-traffic marketing routes.
 * Improves international SERP differentiation; keep in sync with on-page H1/hero where relevant.
 */
import type { Locale } from '../i18n/config';

const UK_HOME_MISSION =
  'Schillings deploys a unique combination of expertise to help you handle high stakes opportunities and threats, because we believe everyone has a right to fair treatment of their reputation, to a reasonable expectation of privacy and to feel safe.';

export function homePageMeta(locale: Locale): { title: string; description: string } {
  switch (locale) {
    case 'en-us':
      return {
        title: 'Reputation, Privacy & Security | Schillings — Americas',
        description:
          'Integrated legal, intelligence, communications and security from Schillings — Miami hub with London and Dublin for high-stakes reputation, privacy and crisis matters in the United States and Latin America.',
      };
    case 'en-ie':
      return {
        title: 'Reputation, Privacy & Security | Schillings — Ireland & EU',
        description:
          'Schillings Ireland LLP and colleagues in London and Miami — multidisciplinary support for reputation, privacy, litigation intelligence and crisis communications, with an EU gateway in Dublin.',
      };
    default:
      return {
        title: 'Protecting Your Reputation, Privacy and Security | Schillings',
        description: UK_HOME_MISSION,
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
        title: 'Contact Schillings — United States',
        description:
          'Contact Schillings — enquiry form, offices in Miami, London and Dublin, twenty-four-hour urgent line, and minimum engagement information.',
        pageEntityName: 'Contact Schillings — United States',
      };
    case 'en-ie':
      return {
        title: 'Contact Schillings — Ireland',
        description:
          'Contact Schillings — enquiry form, Dublin, London and Miami offices, urgent line, and minimum engagement information.',
        pageEntityName: 'Contact Schillings — Ireland',
      };
    default:
      return {
        title: 'Contact Schillings',
        description:
          'Contact Schillings — enquiry form, offices in London, Miami and Dublin, urgent line, and minimum engagement information.',
        pageEntityName: 'Contact Schillings',
      };
  }
}
