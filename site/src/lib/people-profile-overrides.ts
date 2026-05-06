import raw from '../data/people-profile-overrides.json';
import { SENIORITY_IDS, type SeniorityId } from '../data/people-taxonomy';

const SENIORITY_SET = new Set<string>(SENIORITY_IDS);

function isSeniorityId(v: string): v is SeniorityId {
  return SENIORITY_SET.has(v);
}

export type ProfileFieldOverride = {
  seniority?: SeniorityId;
  role?: string;
};

/** HR / editorial corrections to imported bios (survives `import:people`). */
export function profileFieldOverridesFor(slug: string): ProfileFieldOverride | undefined {
  const row = (raw as Record<string, unknown>)[slug];
  if (!row || typeof row !== 'object') return undefined;
  const o = row as Record<string, unknown>;
  const out: ProfileFieldOverride = {};
  if (typeof o.seniority === 'string' && isSeniorityId(o.seniority)) out.seniority = o.seniority;
  if (typeof o.role === 'string' && o.role.trim()) out.role = o.role.trim();
  return Object.keys(out).length ? out : undefined;
}
