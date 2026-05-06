import type { Locale } from '../i18n/config';

export const OFFICE_IDS = ['london', 'dublin', 'miami', 'auckland'] as const;
export type OfficeId = (typeof OFFICE_IDS)[number];

export const SENIORITY_IDS = [
  'founder',
  'ceo',
  'ciso',
  'partner',
  'senior_associate',
  'senior_analyst',
  'associate',
  'analyst',
  'director',
  'business_services',
  'advisory_board',
  'other',
] as const;
export type SeniorityId = (typeof SENIORITY_IDS)[number];

/**
 * People directory seniority filters — pills and `<select>` options — listed most senior first.
 * Matches tier order used when sorting the grid (`people-directory` ranks).
 */
export const SENIORITY_FILTER_ORDER = [
  'founder',
  'ceo',
  'ciso',
  'advisory_board',
  'partner',
  'director',
  'senior_associate',
  'associate',
  'senior_analyst',
  'analyst',
  'business_services',
  'other',
] as const satisfies readonly SeniorityId[];

/** Tiers included in the collated “Leadership” filter (Founder, CEO, CISO/CIO) — individual tiers stay available separately. */
export const EXECUTIVE_COLLATION_SENIORITIES = ['founder', 'ceo', 'ciso'] as const;

/** Synthetic `<select>` / pill value for that collated filter (not a stored `SeniorityId`). */
export const LEADERSHIP_DIRECTORY_FILTER_VALUE = '__leadership__';

/** @deprecated URL-only alias; normalized to `LEADERSHIP_DIRECTORY_FILTER_VALUE` in the directory script. */
export const LEGACY_EXECUTIVES_DIRECTORY_FILTER_VALUE = '__executives__';

/** Main directory pillar (Legal, ISD, Schillings Communications / SCOM, Digital Resilience) — inferred from role, tags, and bio. */
export const PRACTICE_GROUP_IDS = ['legal', 'isd', 'scom', 'dr'] as const;
export type PracticeGroupId = (typeof PRACTICE_GROUP_IDS)[number];

/** Controlled tags for directory filters (extend as needed). */
export const EXPERTISE_IDS = [
  'reputation_privacy',
  'litigation_disputes',
  'intelligence_security',
  'communications',
  'corporate_transactions',
  'international',
  'regulatory',
] as const;
export type ExpertiseId = (typeof EXPERTISE_IDS)[number];

export const OFFICE_LABELS: Record<OfficeId, string> = {
  london: 'London',
  dublin: 'Dublin',
  miami: 'Miami',
  auckland: 'Auckland',
};

export const SENIORITY_LABELS: Record<SeniorityId, string> = {
  founder: 'Founder',
  ceo: 'CEO',
  ciso: 'CISO',
  partner: 'Partner',
  senior_associate: 'Senior Associate',
  associate: 'Associate',
  senior_analyst: 'Senior Analyst',
  analyst: 'Analyst',
  director: 'Director',
  business_services: 'Business services',
  advisory_board: 'Advisory Board',
  other: 'Other',
};

export const PRACTICE_GROUP_LABELS: Record<PracticeGroupId, string> = {
  legal: 'Legal',
  isd: 'ISD',
  scom: 'Schillings Communications',
  dr: 'Digital Resilience',
};

export const EXPERTISE_LABELS: Record<ExpertiseId, string> = {
  reputation_privacy: 'Reputation & privacy',
  litigation_disputes: 'Litigation & disputes',
  intelligence_security: 'Intelligence & security',
  communications: 'Communications',
  corporate_transactions: 'Corporate & transactions',
  international: 'International',
  regulatory: 'Regulatory',
};

/** Physical office order for each locale site (primary office first). */
export function officeOrderForLocale(locale: Locale): OfficeId[] {
  switch (locale) {
    case 'en-ie':
      return ['dublin', 'london', 'miami', 'auckland'];
    case 'en-us':
      return ['miami', 'london', 'dublin', 'auckland'];
    default:
      return ['london', 'dublin', 'miami', 'auckland'];
  }
}

/** Short editorial line under each office heading (locale-aware). */
export function officeSectionSubline(locale: Locale, office: OfficeId): string {
  const lines: Record<Locale, Record<OfficeId, string>> = {
    'en-gb': {
      london: 'United Kingdom headquarters — Schillings International LLP.',
      dublin: 'Schillings Ireland LLP — EU litigation and gateway matters.',
      miami: 'Schillings International (USA) LLP — US counsel and coordination.',
      auckland: 'New Zealand — lawyers admitted in New Zealand.',
    },
    'en-ie': {
      dublin: 'Principal Ireland office — Schillings Ireland LLP.',
      london: 'United Kingdom headquarters — Schillings International LLP.',
      miami: 'Schillings International (USA) LLP.',
      auckland: 'New Zealand — lawyers admitted in New Zealand.',
    },
    'en-us': {
      miami: 'Principal US office — Schillings International (USA) LLP.',
      london: 'United Kingdom headquarters — Schillings International LLP.',
      dublin: 'Schillings Ireland LLP.',
      auckland: 'New Zealand — lawyers admitted in New Zealand.',
    },
  };
  return lines[locale][office];
}
