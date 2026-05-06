/**
 * Explicit IA mapping: directory expertise tags → related strategic situation entry points.
 * Used for on-page navigation only — not a claim about any individual’s casework.
 */
import type { ExpertiseId } from './people-taxonomy';
import type { StrategicSituationId } from './strategic-rebuild-content';

export const EXPERTISE_RELATED_STRATEGIC_SITUATIONS: Record<
  ExpertiseId,
  readonly StrategicSituationId[]
> = {
  reputation_privacy: ['media_exposure_scrutiny', 'reputation_under_threat', 'family_privacy_protection'],
  litigation_disputes: ['high_stakes_litigation', 'international_disputes'],
  intelligence_security: [
    'sensitive_investigations',
    'cyber_extortion_coercion',
    'online_attacks_misinformation',
    'ai_deepfake_threats',
  ],
  communications: [
    'media_exposure_scrutiny',
    'crisis_containment',
    'activist_hostile_campaigns',
    'reputation_under_threat',
  ],
  corporate_transactions: ['executive_leadership_risk', 'crisis_containment', 'international_disputes'],
  international: ['international_disputes', 'reputation_under_threat', 'high_stakes_litigation'],
  regulatory: ['sensitive_investigations', 'executive_leadership_risk', 'media_exposure_scrutiny'],
};

export function strategicSituationIdsForPersonExpertise(
  expertise: readonly ExpertiseId[] | undefined,
): StrategicSituationId[] {
  if (!expertise?.length) return [];
  const seen = new Set<StrategicSituationId>();
  const out: StrategicSituationId[] = [];
  for (const e of expertise) {
    const row = EXPERTISE_RELATED_STRATEGIC_SITUATIONS[e];
    if (!row) continue;
    for (const sid of row) {
      if (!seen.has(sid)) {
        seen.add(sid);
        out.push(sid);
      }
    }
  }
  return out;
}
