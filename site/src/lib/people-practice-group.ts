import type { ExpertiseId, PracticeGroupId } from '../data/people-taxonomy';
import { PRACTICE_GROUP_IDS } from '../data/people-taxonomy';

const PRACTICE_GROUP_SET = new Set<string>(PRACTICE_GROUP_IDS);

export function isPracticeGroupId(v: string): v is PracticeGroupId {
  return PRACTICE_GROUP_SET.has(v);
}

/** True when bio/role reads as qualified legal / disputes practice (not pure investigations “Litigation Support” rankings). */
function matchesLegalPracticeBio(blob: string): boolean {
  if (
    /\b(solicitor|barrister|litigator|litigation lawyer|media lawyer|malicious falsehood|defamation|privacy law|data protection law|professional negligence|qualified as a solicitor|qualified solicitor|admitted to practise|admitted to practice|called to the bar|rights of audience|legal proceedings|city law firm|law firm partner|advisory and litigation lawyer|litigation and privacy|commercial litigation|at law|legal advice|legal adviser|legal advisor|reputation and privacy law|areas of law|pre-publication|post-publication advice|in-house counsel|private practice)\b/i.test(
      blob,
    )
  ) {
    return true;
  }
  if (/\b(chambers uk|the legal 500|legal 500)\b/i.test(blob)) return true;
  if (
    /\b(disputes?\s+concerning|court of appeal|high court|high-profile litigation|claimant|defendant in defamation)\b/i.test(blob)
  ) {
    return true;
  }
  if (
    /\b(litigation decisions|litigation and|IP litigation|media, privacy, and IP litigation|privacy, and IP litigation)\b/i.test(blob)
  ) {
    return true;
  }
  return false;
}

/**
 * Infer practice group from role, expertise tags, and optional bio/teaser text.
 * `dr` = Digital Resilience (online profiles, search, social strategy) — not litigation.
 */
export function inferPracticeGroup(
  role: string,
  expertise: readonly ExpertiseId[],
  bioHint = '',
): PracticeGroupId {
  const r = role.toLowerCase();
  const b = bioHint.toLowerCase();
  const blob = `${r} ${b}`;
  const e = new Set(expertise);

  // SCOM — communications business unit (role-led).
  if (
    /schillings communications|strategic communications|digital communications|corporate communications|communications llp/i.test(
      r,
    )
  ) {
    return 'scom';
  }

  // Digital Resilience (internal id `dr`) — from role/bio, not from disputes/litigation.
  if (
    /\bdigital resilience\b/.test(blob) ||
    /\bcritical risk\b/.test(blob) ||
    /\bschillings[''\u2019]?\s+digital\s+resilience\b/i.test(blob) ||
    (/\bsearch engines\b/.test(blob) && /\bgenerative ai\b/.test(blob))
  ) {
    return 'dr';
  }

  // ISD — intelligence & security (excludes legal “analyst” titles).
  if (
    /\b(ciso|chief information security officer|intelligence analyst|senior intelligence analyst|corporate intelligence|\bisd\b)\b/i.test(r) ||
    /\b(junior analyst|senior analyst)\b/i.test(r) ||
    (/\banalyst\b/i.test(r) && !/\b(senior legal|legal adviser|legal advisor|solicitor)\b/i.test(r))
  ) {
    return 'isd';
  }

  // Lawyers / disputes / reputation counsel — Legal even when imports tagged intelligence_security.
  if (matchesLegalPracticeBio(blob)) {
    return 'legal';
  }

  if (e.has('communications')) return 'scom';
  if (e.has('intelligence_security')) return 'isd';
  return 'legal';
}

export function resolvePracticeGroup(
  role: string,
  expertise: readonly ExpertiseId[],
  explicit: PracticeGroupId | null | undefined,
  bioHint = '',
): PracticeGroupId {
  if (explicit && isPracticeGroupId(explicit)) return explicit;
  return inferPracticeGroup(role, expertise, bioHint);
}
