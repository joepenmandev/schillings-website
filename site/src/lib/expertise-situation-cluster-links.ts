/**
 * Curated expertise hub ↔ strategic situation links (Phase 2A).
 * Copy-first anchors; low density; no auto-generation. See `docs/seo/SEO-CLUSTER-RELATIONSHIP-MAP.md`.
 */
import type { ExpertiseId } from '../data/people-taxonomy';
import type { StrategicSituationId } from '../data/strategic-rebuild-content';
import { STRATEGIC_SITUATION_IDS } from '../data/strategic-rebuild-content';

export interface SituationToExpertiseLink {
  readonly expertiseId: ExpertiseId;
  /** Visible anchor — editorial, not a title stamp. */
  readonly linkLabel: string;
}

export interface ExpertiseToSituationLink {
  readonly situationId: StrategicSituationId;
  readonly linkLabel: string;
}

/** Situation detail → expertise hubs (max two per situation). */
export const EXPERTISE_LINKS_BY_SITUATION: Record<
  StrategicSituationId,
  readonly SituationToExpertiseLink[]
> = {
  media_exposure_scrutiny: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Media scrutiny: reputation and privacy posture' },
    { expertiseId: 'communications', linkLabel: 'Media scrutiny: stakeholder communications' },
  ],
  reputation_under_threat: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Coordinated attacks on reputation and privacy' },
  ],
  family_privacy_protection: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Family exposure and privacy boundaries' },
  ],
  executive_leadership_risk: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Executive scrutiny and personal reputational risk' },
    { expertiseId: 'communications', linkLabel: 'Leadership moments and calibrated communications' },
  ],
  online_attacks_misinformation: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Online allegations and false narratives' },
    { expertiseId: 'digital_resilience', linkLabel: 'Hostile online activity: digital resilience and monitoring' },
  ],
  ai_deepfake_threats: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Synthetic media and reputational exposure' },
    { expertiseId: 'digital_resilience', linkLabel: 'Deepfakes and authenticity: security and verification' },
  ],
  cyber_extortion_coercion: [
    { expertiseId: 'digital_resilience', linkLabel: 'Extortion and coercion: response across digital channels' },
  ],
  sensitive_investigations: [
    { expertiseId: 'intelligence_security', linkLabel: 'Discreet investigations and intelligence' },
    { expertiseId: 'litigation_disputes', linkLabel: 'Fact-finding that feeds disputes and proceedings' },
  ],
  international_disputes: [
    { expertiseId: 'international', linkLabel: 'Cross-border forums and parallel audiences' },
    { expertiseId: 'litigation_disputes', linkLabel: 'International proceedings and disputes' },
  ],
  activist_hostile_campaigns: [
    { expertiseId: 'reputation_privacy', linkLabel: 'Hostile campaigns and sustained pressure' },
    { expertiseId: 'litigation_disputes', linkLabel: 'Campaign pressure: legal boundaries' },
  ],
  crisis_containment: [
    { expertiseId: 'communications', linkLabel: 'Fast-moving crises: communications rhythm' },
    { expertiseId: 'litigation_disputes', linkLabel: 'Crisis moments with legal exposure' },
  ],
  high_stakes_litigation: [
    { expertiseId: 'litigation_disputes', linkLabel: 'Serious litigation: disputes strategy' },
  ],
};

/** Expertise hub → situations (curated; empty array omits section on hub). */
export const SITUATION_LINKS_BY_EXPERTISE: Record<ExpertiseId, readonly ExpertiseToSituationLink[]> = {
  reputation_privacy: [
    {
      situationId: 'media_exposure_scrutiny',
      linkLabel: 'Reputation and privacy strategy when media scrutiny builds',
    },
    {
      situationId: 'reputation_under_threat',
      linkLabel: 'Reputation and privacy strategy under coordinated pressure',
    },
    { situationId: 'family_privacy_protection', linkLabel: 'Family privacy strategy when exposure is personal' },
    {
      situationId: 'online_attacks_misinformation',
      linkLabel: 'Online allegations: reputation and privacy strategy',
    },
  ],
  litigation_disputes: [
    { situationId: 'high_stakes_litigation', linkLabel: 'High-stakes disputes and litigation strategy' },
    { situationId: 'international_disputes', linkLabel: 'Cross-border disputes: litigation and coordination' },
    { situationId: 'sensitive_investigations', linkLabel: 'Complex investigations informing disputes' },
    { situationId: 'crisis_containment', linkLabel: 'Crisis containment with legal strategy in view' },
  ],
  intelligence_security: [
    { situationId: 'sensitive_investigations', linkLabel: 'Complex investigations and intelligence discipline' },
    { situationId: 'online_attacks_misinformation', linkLabel: 'Coordinated online pressure: intelligence picture' },
    { situationId: 'ai_deepfake_threats', linkLabel: 'Synthetic media threats: evidence and channel mapping' },
  ],
  digital_resilience: [
    { situationId: 'cyber_extortion_coercion', linkLabel: 'Cyber extortion: digital resilience and response' },
    { situationId: 'online_attacks_misinformation', linkLabel: 'Online attacks: search, social, and monitoring' },
    { situationId: 'ai_deepfake_threats', linkLabel: 'AI-visible reputation: surfaces and narratives' },
  ],
  communications: [
    { situationId: 'media_exposure_scrutiny', linkLabel: 'Strategic communications when media attention converges' },
    { situationId: 'crisis_containment', linkLabel: 'Crisis communications and narrative discipline' },
    { situationId: 'executive_leadership_risk', linkLabel: 'Executive communications under pressure' },
  ],
  corporate_transactions: [],
  international: [{ situationId: 'international_disputes', linkLabel: 'International disputes: cross-border strategy' }],
  regulatory: [
    { situationId: 'sensitive_investigations', linkLabel: 'Regulatory investigations: sensitive fact patterns' },
    { situationId: 'crisis_containment', linkLabel: 'Regulatory pressure alongside market attention' },
  ],
};

export function expertiseLinksForSituation(
  situationId: StrategicSituationId,
): readonly SituationToExpertiseLink[] {
  return EXPERTISE_LINKS_BY_SITUATION[situationId];
}

export function situationLinksForExpertise(expertiseId: ExpertiseId): readonly ExpertiseToSituationLink[] {
  return SITUATION_LINKS_BY_EXPERTISE[expertiseId];
}

/** Static checks: every situation has ≥1 expertise link; at most two per situation. */
export function assertExpertiseSituationClusterIntegrity(): void {
  for (const id of STRATEGIC_SITUATION_IDS) {
    const row = EXPERTISE_LINKS_BY_SITUATION[id];
    if (!row?.length) {
      throw new Error(`expertise-situation-cluster-links: missing expertise links for situation "${id}"`);
    }
    if (row.length > 2) {
      throw new Error(`expertise-situation-cluster-links: situation "${id}" exceeds max 2 expertise links`);
    }
  }
}
