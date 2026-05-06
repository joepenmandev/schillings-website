/** Shared term lists and matching for `audit-strategic-copy.ts`. */

export const BANNED_WORDS = [
  'scandal',
  'explosive',
  'devastating',
  'guaranteed',
  'billionaire',
  'celebrity',
  'best',
] as const;

export const CLAIMS_TERMS = [
  'largest',
  'number one',
  'proven',
  'success rate',
  'award-winning',
  'leading',
] as const;

export function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Phrases use substring match; single tokens use word boundaries. */
export function findSoftTermHits(text: string): { banned: string[]; claims: string[] } {
  const lower = text.toLowerCase();
  const banned: string[] = [];
  const claims: string[] = [];
  for (const w of BANNED_WORDS) {
    const re = new RegExp(`\\b${escapeRe(w)}\\b`, 'i');
    if (re.test(text)) banned.push(w);
  }
  for (const phrase of CLAIMS_TERMS) {
    if (phrase.includes(' ')) {
      if (lower.includes(phrase)) claims.push(phrase);
    } else {
      const re = new RegExp(`\\b${escapeRe(phrase)}\\b`, 'i');
      if (re.test(text)) claims.push(phrase);
    }
  }
  return { banned, claims };
}
