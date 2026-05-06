import importedRaw from './people-imported.json';
import eeatExtras from './people-eeat-extras.json';
import { normalizeImportedSeniority } from '../lib/people-import-parse';
import { profileFieldOverridesFor } from '../lib/people-profile-overrides';
import { isPracticeGroupId } from '../lib/people-practice-group';
import type { ExpertiseId, OfficeId, PracticeGroupId, SeniorityId } from './people-taxonomy';

export interface PersonProfile {
  slug: string;
  name: string;
  role: string;
  office: string;
  officeId?: OfficeId;
  seniority?: SeniorityId;
  /** Authoritative Legal / ISD / Schillings Communications (`scom`) / Digital Resilience (`dr`) when set (import JSON, hand edit, or listing meta). */
  practiceGroup?: PracticeGroupId;
  expertise?: ExpertiseId[];
  paragraphs: string[];
  /** Public path under `site/public`, e.g. `/people-photos/slug.jpg` */
  imagePath?: string;
  /** Authoritative external URLs (LinkedIn, directory profiles, etc.) for E-E-A-T. */
  sameAs?: string[];
  /** Third-party recognitions shown as compact trust badges. */
  recognitions?: PersonRecognition[];
  /** ISO 8601 from last `import:people` run — used for ProfilePage `dateModified`. */
  profileUpdatedAt?: string;
  draft?: boolean;
}

export interface PersonRecognition {
  provider: 'chambers' | 'legal500' | 'spears' | 'other';
  title: string;
  year?: string;
  /** Scope of claim for on-page copy and filtering. */
  scope?: 'person' | 'firm';
  /** Optional source URL to listing/profile. */
  href?: string;
  /** Optional official badge/logo image path under `/public`. */
  imagePath?: string;
}

type ImportedRow = {
  slug: string;
  name: string;
  role: string;
  office: string;
  officeId: string;
  seniority: string;
  practiceGroup?: string | null;
  expertise: string[];
  paragraphs: string[];
  imagePath: string | null;
  sameAs?: string[];
  profileUpdatedAt?: string;
};

type EeatExtrasFile = Record<
  string,
  {
    sameAs?: string[];
    profileUpdatedAt?: string;
    /** Set to "" to hide email on article heroes */
    publicEmail?: string;
    recognitions?: PersonRecognition[];
  }
>;

function mergeSameAs(slug: string, fromImport?: string[]): string[] | undefined {
  const extra = (eeatExtras as EeatExtrasFile)[slug]?.sameAs ?? [];
  const from = fromImport ?? [];
  const merged = [...new Set([...from, ...extra])].filter(Boolean).sort();
  return merged.length ? merged : undefined;
}

function cleanParagraphs(paragraphs: string[]): string[] {
  return paragraphs
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 3 && !/^[\u200b-\u200d\ufeff\s]+$/u.test(p));
}

function toProfile(row: ImportedRow): PersonProfile {
  const extra = (eeatExtras as EeatExtrasFile)[row.slug];
  const pg =
    typeof row.practiceGroup === 'string' && isPracticeGroupId(row.practiceGroup) ? row.practiceGroup : undefined;
  const fieldOv = profileFieldOverridesFor(row.slug);
  const role = fieldOv?.role ?? row.role;
  const bioHint = row.paragraphs.join(' ');
  const seniority = fieldOv?.seniority ?? normalizeImportedSeniority(row.seniority, role, bioHint);
  return {
    slug: row.slug,
    name: row.name,
    role,
    office: row.office,
    officeId: row.officeId as OfficeId,
    seniority,
    practiceGroup: pg,
    expertise: row.expertise as ExpertiseId[],
    paragraphs: cleanParagraphs(row.paragraphs),
    imagePath: row.imagePath ?? undefined,
    sameAs: mergeSameAs(row.slug, row.sameAs),
    recognitions: extra?.recognitions,
    profileUpdatedAt: extra?.profileUpdatedAt ?? row.profileUpdatedAt,
    draft: false,
  };
}

/**
 * Bios and headshots imported from the public live site (Webflow) for migration.
 * Source of truth for files on disk: `imagePath` → `site/public/` (e.g. `/people-photos/{slug}.webp`).
 * Display labels (e.g. Schillings Communications / practice group `scom`) live in `people-taxonomy.ts`; CMS role strings may still say “Strategic Communications” — inference maps both.
 * Refresh: `npm run import:people` then `npm run optimize:people-photos`, or `npm run import:people:full`.
 * **Compliance / HR** must approve before production cutover.
 */
export const peopleProfiles: PersonProfile[] = (importedRaw as ImportedRow[]).map(toProfile);

export function publishedPeople() {
  return peopleProfiles.filter((p) => !p.draft);
}

export function getPersonBySlug(slug: string) {
  return peopleProfiles.find((p) => p.slug === slug && !p.draft) ?? null;
}

/** Skip inferring a slug when legacy credit looks like multiple people. */
const LEGACY_MULTI_AUTHOR_RE = /\s+(?:and|&)\s+|,/;

/**
 * Map a single-name legacy byline to a published profile slug when it exactly matches
 * `PersonProfile.name` (case-insensitive). Used when imports have `legacyAuthorRaw` but no `authorSlugs`.
 */
export function resolvePublishedPersonSlugFromLegacyCredit(legacyAuthorRaw: string): string | null {
  const raw = legacyAuthorRaw.trim().replace(/\s+/g, ' ');
  if (!raw || LEGACY_MULTI_AUTHOR_RE.test(raw)) return null;
  const lower = raw.toLowerCase();
  const p = publishedPeople().find((x) => x.name.toLowerCase() === lower);
  return p?.slug ?? null;
}

/**
 * Public email shown on article heroes (`firstname.lastname@schillingspartners.com` from slug).
 * Override or suppress via `people-eeat-extras.json`: `"your-slug": { "publicEmail": "custom@…" }` or `"publicEmail": ""`.
 */
export function publicContactEmailForPersonSlug(slug: string): string | null {
  const extra = (eeatExtras as EeatExtrasFile)[slug];
  if (extra && 'publicEmail' in extra && extra.publicEmail !== undefined) {
    const e = extra.publicEmail.trim();
    return e === '' ? null : e;
  }
  const parts = slug.split('-').filter(Boolean);
  if (parts.length < 2) return null;
  return `${parts[0]}.${parts.slice(1).join('')}@schillingspartners.com`;
}
