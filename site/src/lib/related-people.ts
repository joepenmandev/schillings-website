import type { PersonProfile } from '../data/people';
import type { PracticeGroupId } from '../data/people-taxonomy';
import { compareDirectoryPeopleBySeniorityThenName, resolvePersonPracticeGroup } from './people-directory';

/** Prefer colleagues who share expertise, then same office. */
export function getRelatedPeople(all: PersonProfile[], current: PersonProfile, limit = 4): PersonProfile[] {
  const others = all.filter((p) => p.slug !== current.slug && !p.draft);
  const curExp = new Set(current.expertise ?? []);
  const curOffice = current.officeId;

  const scored = others.map((p) => {
    let score = 0;
    for (const e of p.expertise ?? []) {
      if (curExp.has(e)) score += 3;
    }
    if (curOffice && p.officeId === curOffice) score += 1;
    return { p, score };
  });

  const positive = scored.filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name));

  if (positive.length >= limit) {
    return positive.slice(0, limit).map(({ p }) => p);
  }

  const need = limit - positive.length;
  const used = new Set(positive.map(({ p }) => p.slug));
  const officeFallback = others
    .filter((p) => !used.has(p.slug) && curOffice && p.officeId === curOffice)
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, need);

  const merged = [...positive.map(({ p }) => p), ...officeFallback];
  const still = limit - merged.length;
  if (still <= 0) return merged;

  const rest = others.filter((p) => !merged.some((m) => m.slug === p.slug)).sort((a, b) => a.name.localeCompare(b.name));
  return [...merged, ...rest.slice(0, still)];
}

export type ColleaguesForProfile = {
  /** Same pillar as directory (`legal`, `isd`, …) when the list is department-based. */
  department: PracticeGroupId | null;
  /** True when `primary` / `overflow` are filtered to the same practice group as the subject. */
  isDepartmentScoped: boolean;
  /** Top colleagues shown in the main grid (most senior first). */
  primary: PersonProfile[];
  /** Additional colleagues in the horizontal strip (same ordering). */
  overflow: PersonProfile[];
};

function sortBySeniorityThenName(people: PersonProfile[]): PersonProfile[] {
  return [...people].sort((a, b) =>
    compareDirectoryPeopleBySeniorityThenName(
      { seniority: a.seniority ?? 'other', name: a.name },
      { seniority: b.seniority ?? 'other', name: b.name },
    ),
  );
}

/**
 * Colleagues for profile “Related people”: same department (practice group) when possible,
 * ordered by seniority (directory tier order), then a scrollable row for the remainder.
 * Falls back to {@link getRelatedPeople} when no one shares the subject’s pillar.
 */
export function getColleaguesForPersonProfile(
  all: PersonProfile[],
  current: PersonProfile,
  primaryCount = 4,
): ColleaguesForProfile {
  const pool = all.filter((p) => p.slug !== current.slug && !p.draft);
  const subjectPg = resolvePersonPracticeGroup(current);
  const sameDept = pool.filter((p) => resolvePersonPracticeGroup(p) === subjectPg);

  let sorted: PersonProfile[];
  let isDepartmentScoped: boolean;

  if (sameDept.length > 0) {
    sorted = sortBySeniorityThenName(sameDept);
    isDepartmentScoped = true;
  } else {
    sorted = sortBySeniorityThenName(getRelatedPeople(all, current, Math.max(primaryCount, 16)));
    isDepartmentScoped = false;
  }

  return {
    department: isDepartmentScoped ? subjectPg : null,
    isDepartmentScoped,
    primary: sorted.slice(0, primaryCount),
    overflow: sorted.slice(primaryCount),
  };
}
