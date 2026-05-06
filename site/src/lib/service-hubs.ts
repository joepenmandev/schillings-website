import type { ExpertiseId } from '../data/people-taxonomy';
import { EXPERTISE_IDS } from '../data/people-taxonomy';
import type { PersonProfile } from '../data/people';

export function isExpertiseId(value: string): value is ExpertiseId {
  return (EXPERTISE_IDS as readonly string[]).includes(value);
}

export function peopleForExpertise(all: PersonProfile[], expertiseId: ExpertiseId): PersonProfile[] {
  return all
    .filter((p) => !p.draft && (p.expertise ?? []).includes(expertiseId))
    .sort((a, b) => a.name.localeCompare(b.name));
}
