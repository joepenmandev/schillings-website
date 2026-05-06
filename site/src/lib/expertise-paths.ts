/**
 * Public URL path slugs for expertise hubs (kebab-case). Internal {@link ExpertiseId} values stay snake_case.
 * Routing and links still use `ExpertiseId` until a cutover; these helpers are the single mapping for future use.
 */
import { EXPERTISE_IDS, type ExpertiseId } from '../data/people-taxonomy';

const ID_TO_SLUG: Record<ExpertiseId, string> = {
  reputation_privacy: 'reputation-privacy',
  litigation_disputes: 'litigation-disputes',
  intelligence_security: 'intelligence-investigations',
  communications: 'strategic-communications',
  corporate_transactions: 'corporate-transactions',
  international: 'international',
  regulatory: 'regulatory',
};

const SLUG_TO_ID: Record<string, ExpertiseId> = (() => {
  const out: Record<string, ExpertiseId> = {};
  for (const id of EXPERTISE_IDS) {
    const slug = ID_TO_SLUG[id];
    if (slug in out) {
      throw new Error(`expertise-paths: duplicate public slug "${slug}"`);
    }
    out[slug] = id;
  }
  return out;
})();

export function expertisePathSlug(expertiseId: ExpertiseId): string {
  return ID_TO_SLUG[expertiseId];
}

export function expertiseIdFromPathSlug(slug: string): ExpertiseId | undefined {
  return SLUG_TO_ID[slug];
}

/** All public slugs in {@link EXPERTISE_IDS} order. */
export function getAllExpertisePathSlugs(): readonly string[] {
  return EXPERTISE_IDS.map((id) => ID_TO_SLUG[id]);
}

export function isExpertisePathSlug(slug: string): boolean {
  return slug in SLUG_TO_ID;
}
