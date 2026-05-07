/**
 * High-confidence Intelligence topic slug → primary expertise hub (Phase 2B).
 * Only slugs present here get a practice-context line on topic archive pages.
 */
import type { ExpertiseId } from '../data/people-taxonomy';

/** Topic URL slug (`news/topic/{slug}/`) from `topicSlugFromLabel`. */
const TOPIC_SLUG_TO_EXPERTISE: Partial<Record<string, ExpertiseId>> = {
  reputation: 'reputation_privacy',
  privacy: 'reputation_privacy',
  disinformation: 'reputation_privacy',
  'smear-campaigns': 'reputation_privacy',
  'online-profiles': 'reputation_privacy',
  communications: 'communications',
  crisis: 'communications',
  investigations: 'intelligence_security',
  security: 'intelligence_security',
  ai: 'intelligence_security',
  geopolitics: 'international',
  'family-businesses': 'corporate_transactions',
};

export function expertiseIdForNewsTopicSlug(topicSlug: string): ExpertiseId | undefined {
  return TOPIC_SLUG_TO_EXPERTISE[topicSlug];
}
