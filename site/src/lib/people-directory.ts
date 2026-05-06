import type { Locale } from '../i18n/config';
import type { PersonProfile } from '../data/people';
import { publishedPeople } from '../data/people';
import rawListingMeta from '../data/people-listing-meta.json';
import practiceGroupOverrides from '../data/people-practice-group-overrides.json';
import { normalizeImportedSeniority } from './people-import-parse';
import { profileFieldOverridesFor } from './people-profile-overrides';
import { isPracticeGroupId, resolvePracticeGroup } from './people-practice-group';
import {
  type OfficeId,
  type SeniorityId,
  type ExpertiseId,
  type PracticeGroupId,
  officeOrderForLocale,
  officeSectionSubline,
  OFFICE_IDS,
  SENIORITY_FILTER_ORDER,
  SENIORITY_IDS,
  EXPERTISE_IDS,
  OFFICE_LABELS,
  SENIORITY_LABELS,
  EXPERTISE_LABELS,
  PRACTICE_GROUP_LABELS,
  PRACTICE_GROUP_IDS,
} from '../data/people-taxonomy';

export interface DirectoryPerson {
  slug: string;
  name: string;
  role: string;
  teaser: string;
  officeId: OfficeId;
  seniority: SeniorityId;
  practiceGroup: PracticeGroupId;
  expertise: ExpertiseId[];
  imagePath?: string;
}

/** Lower rank = listed earlier when sorting the directory grid (tier first, then surname/name). */
const SENIORITY_GRID_RANK: Record<SeniorityId, number> = {
  founder: 0,
  ceo: 1,
  ciso: 2,
  advisory_board: 3,
  partner: 4,
  director: 5,
  senior_associate: 6,
  associate: 7,
  senior_analyst: 8,
  analyst: 9,
  business_services: 10,
  other: 11,
};

/** Sort people by seniority tier, then alphabetically by display name — avoids pure A–Z burying partners behind associates. */
export function compareDirectoryPeopleBySeniorityThenName(
  a: Pick<DirectoryPerson, 'seniority' | 'name'>,
  b: Pick<DirectoryPerson, 'seniority' | 'name'>,
): number {
  const ra = SENIORITY_GRID_RANK[a.seniority] ?? 99;
  const rb = SENIORITY_GRID_RANK[b.seniority] ?? 99;
  if (ra !== rb) return ra - rb;
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
}

/** Directory card subtitle — seniority + department pillar (e.g. `Director, Schillings Communications`), aligned with filters. */
export function peopleDirectoryCardByline(seniority: SeniorityId, practiceGroup: PracticeGroupId): string {
  if (seniority === 'advisory_board') return SENIORITY_LABELS.advisory_board;
  if (seniority === 'founder') return `${SENIORITY_LABELS.founder}, ${PRACTICE_GROUP_LABELS[practiceGroup]}`;
  if (seniority === 'ceo') return `${SENIORITY_LABELS.ceo}, ${PRACTICE_GROUP_LABELS[practiceGroup]}`;
  if (seniority === 'ciso') return `${SENIORITY_LABELS.ciso}, ${PRACTICE_GROUP_LABELS[practiceGroup]}`;
  return `${SENIORITY_LABELS[seniority]}, ${PRACTICE_GROUP_LABELS[practiceGroup]}`;
}

/** @deprecated Import from `./people-practice-group` instead; kept for existing imports. */
export { inferPracticeGroup, resolvePracticeGroup } from './people-practice-group';

interface ListingMetaRow {
  officeId: string;
  seniority: string;
  expertise: string[];
  role?: string;
  practiceGroup?: PracticeGroupId;
}

function practiceGroupOverrideForSlug(slug: string): PracticeGroupId | undefined {
  const raw = (practiceGroupOverrides as Record<string, unknown>)[slug];
  return typeof raw === 'string' && isPracticeGroupId(raw) ? raw : undefined;
}

function bioHintFromParagraphs(paragraphs: readonly string[] | undefined, maxChars = 4000): string {
  if (!paragraphs?.length) return '';
  return paragraphs.join(' ').slice(0, maxChars);
}

function directoryPracticeGroup(
  slug: string,
  role: string,
  expertise: ExpertiseId[],
  explicit?: PracticeGroupId | null,
  bioHint = '',
): PracticeGroupId {
  return practiceGroupOverrideForSlug(slug) ?? resolvePracticeGroup(role, expertise, explicit, bioHint);
}

/** Same department resolution as directory cards (overrides, import `practiceGroup`, inference, bio). */
export function resolvePersonPracticeGroup(profile: {
  slug: string;
  role: string;
  expertise?: ExpertiseId[];
  practiceGroup?: PracticeGroupId | null;
  paragraphs: readonly string[];
}): PracticeGroupId {
  const expertise = (profile.expertise ?? []).filter((e): e is ExpertiseId => isExpertiseId(e));
  return directoryPracticeGroup(
    profile.slug,
    profile.role,
    expertise,
    profile.practiceGroup ?? null,
    bioHintFromParagraphs(profile.paragraphs),
  );
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isOfficeId(v: string): v is OfficeId {
  return (OFFICE_IDS as readonly string[]).includes(v);
}

function isSeniorityId(v: string): v is SeniorityId {
  return (SENIORITY_IDS as readonly string[]).includes(v);
}


function isExpertiseId(v: string): v is ExpertiseId {
  return (EXPERTISE_IDS as readonly string[]).includes(v);
}

export function inferOfficeIdFromOfficeField(office: string): OfficeId {
  const t = office.trim().toLowerCase();
  if (t.includes('dublin') || t.includes('ireland')) return 'dublin';
  if (t.includes('miami') || t.includes('brickell') || t.includes('florida') || t.includes('usa')) return 'miami';
  if (t.includes('auckland') || t.includes('new zealand') || /\bnz\b/.test(t)) return 'auckland';
  return 'london';
}

function parseListingMetaRows(): Map<string, ListingMetaRow> {
  const out = new Map<string, ListingMetaRow>();
  const obj = rawListingMeta as Record<string, unknown>;
  if (!obj || typeof obj !== 'object') return out;
  for (const [slug, raw] of Object.entries(obj)) {
    if (!raw || typeof raw !== 'object') continue;
    const row = raw as Record<string, unknown>;
    const officeId = typeof row.officeId === 'string' && isOfficeId(row.officeId) ? row.officeId : null;
    const seniorityRaw = typeof row.seniority === 'string' ? row.seniority : '';
    const roleHint = typeof row.role === 'string' ? row.role : '';
    const seniority =
      seniorityRaw && (isSeniorityId(seniorityRaw) || seniorityRaw === 'counsel')
        ? normalizeImportedSeniority(seniorityRaw, roleHint, '')
        : null;
    if (!officeId || !seniority) continue;
    const expRaw = Array.isArray(row.expertise) ? row.expertise : [];
    const expertise = expRaw.filter((e): e is ExpertiseId => typeof e === 'string' && isExpertiseId(e));
    const pgRaw = row.practiceGroup;
    const practiceGroup =
      typeof pgRaw === 'string' && isPracticeGroupId(pgRaw) ? (pgRaw as PracticeGroupId) : undefined;
    out.set(slug, {
      officeId,
      seniority,
      expertise,
      role: typeof row.role === 'string' ? row.role : undefined,
      practiceGroup,
    });
  }
  return out;
}

/**
 * Directory rows = everyone in `people.ts` plus any slug-only entry in `people-listing-meta.json`
 * (for migrated bios not yet promoted to full profiles). Sitemap-only slugs without meta do not appear here.
 */
export function getDirectoryPeople(): DirectoryPerson[] {
  const metaMap = parseListingMetaRows();
  const bySlug = new Map<string, DirectoryPerson>();

  for (const p of publishedPeople()) {
    const officeId = p.officeId ?? inferOfficeIdFromOfficeField(p.office);
    const seniority = p.seniority ?? 'other';
    const expertise = (p.expertise ?? []).filter((e): e is ExpertiseId => isExpertiseId(e));
    bySlug.set(p.slug, {
      slug: p.slug,
      name: p.name,
      role: p.role,
      teaser: p.paragraphs[0] ?? '',
      officeId,
      seniority,
      practiceGroup: directoryPracticeGroup(
        p.slug,
        p.role,
        expertise,
        p.practiceGroup ?? null,
        bioHintFromParagraphs(p.paragraphs),
      ),
      expertise,
      imagePath: p.imagePath,
    });
  }

  for (const [slug, row] of metaMap) {
    if (bySlug.has(slug)) continue;
    const expertise = row.expertise.filter(isExpertiseId);
    const fieldOv = profileFieldOverridesFor(slug);
    const role = fieldOv?.role ?? row.role ?? 'Schillings';
    const seniority = fieldOv?.seniority ?? normalizeImportedSeniority(row.seniority, role, '');
    bySlug.set(slug, {
      slug,
      name: titleFromSlug(slug),
      role,
      teaser: '',
      officeId: row.officeId as OfficeId,
      seniority,
      practiceGroup: directoryPracticeGroup(slug, role, expertise, row.practiceGroup ?? null, ''),
      expertise,
    });
  }

  return [...bySlug.values()].sort(compareDirectoryPeopleBySeniorityThenName);
}

const OFFICE_HEADINGS: Record<OfficeId, string> = {
  london: 'London office',
  dublin: 'Dublin office',
  miami: 'Miami office',
  auckland: 'Auckland office',
};

export function getPeopleIndexModel(locale: Locale) {
  const people = getDirectoryPeople();
  const order = officeOrderForLocale(locale);
  const sections = order.map((officeId) => ({
    officeId,
    heading: OFFICE_HEADINGS[officeId],
    subline: officeSectionSubline(locale, officeId),
    people: people.filter((p) => p.officeId === officeId).sort(compareDirectoryPeopleBySeniorityThenName),
  }));

  return {
    people,
    sections,
    expertiseOptions: [...EXPERTISE_IDS].map((id) => ({ id, label: EXPERTISE_LABELS[id] })),
    seniorityOptions: [...SENIORITY_FILTER_ORDER].map((id) => ({ id, label: SENIORITY_LABELS[id] })),
    practiceGroupOptions: [...PRACTICE_GROUP_IDS].map((id) => ({ id, label: PRACTICE_GROUP_LABELS[id] })),
    officeFilterOptions: order.map((id) => ({ id, label: OFFICE_LABELS[id] })),
  };
}

/** Published profiles for a single office, most senior first (same ordering as the people directory). */
export function publishedPeopleForOffice(officeId: OfficeId): PersonProfile[] {
  return publishedPeople()
    .filter((p) => p.officeId === officeId)
    .sort((a, b) =>
      compareDirectoryPeopleBySeniorityThenName(
        { seniority: a.seniority ?? 'other', name: a.name },
        { seniority: b.seniority ?? 'other', name: b.name },
      ),
    );
}
