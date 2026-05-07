import type { PersonProfile } from './people';
import { getPersonBySlug } from './people';

/** Stable slug for firm/editorial bylines — not a row in `people-imported.json` and not in the People directory. */
export const SCHILLINGS_NEWS_AUTHOR_SLUG = 'schillings' as const;

export function isHouseNewsAuthorSlug(slug: string): boolean {
  return slug.trim() === SCHILLINGS_NEWS_AUTHOR_SLUG;
}

/** Public path after locale for bylines — house author lives under Intelligence, not People. */
export function newsAuthorPublicPathAfterLocale(slug: string): string {
  const s = slug.trim();
  return isHouseNewsAuthorSlug(s) ? `news/author/${s}` : `people/${s}`;
}

const HOUSE_NEWS_AUTHOR_PROFILE: PersonProfile = {
  slug: SCHILLINGS_NEWS_AUTHOR_SLUG,
  name: 'Schillings',
  role: 'Editorial & intelligence',
  office: '',
  seniority: 'other',
  practiceGroup: 'scom',
  paragraphs: [
    'Pieces credited to Schillings are written for clients, colleagues, and partners who need practical context on reputation, privacy, disputes, investigations, and resilience — often where legal, communications, and technical risk overlap.',
    'They reflect how the firm works across teams and jurisdictions, not a single named author. When a specific colleague is the primary author, the byline will name them and link to their profile.',
  ],
  imagePath: '/brand/schillings-logo-rgb.svg',
  draft: false,
};

/** Synthetic profile for `/news/author/schillings/` and article foot bios (PersonProfile-shaped for UI reuse). */
export function getHouseNewsAuthorProfile(): PersonProfile {
  return HOUSE_NEWS_AUTHOR_PROFILE;
}

/** Published people bios first; otherwise the house author profile when the slug matches. */
export function resolveNewsAuthorProfile(slug: string): PersonProfile | null {
  const s = slug.trim();
  if (!s) return null;
  return getPersonBySlug(s) ?? (isHouseNewsAuthorSlug(s) ? getHouseNewsAuthorProfile() : null);
}
