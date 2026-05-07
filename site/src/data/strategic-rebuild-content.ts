/**
 * Strategic rebuild — shared IA / marketing content config.
 * Single source of truth for UK, US, and IE (English labels); wire into nav/pages when IA is final.
 * Path keys (`id`) are stable for future routes and CMS mapping.
 */

import { expertisePathSlug } from '../lib/expertise-paths';
import type { ExpertiseId } from './people-taxonomy';

export const STRATEGIC_PRIMARY_NAV_IDS = [
  'situations',
  'what_we_protect',
  'response_system',
  'sectors',
  'people',
  'intelligence',
  'about',
] as const;
export type StrategicPrimaryNavId = (typeof STRATEGIC_PRIMARY_NAV_IDS)[number];

export interface StrategicPrimaryNavItem {
  readonly id: StrategicPrimaryNavId;
  /** Display label — shared across locales until regional copy is approved */
  readonly label: string;
}

/** Top-level primary navigation (rebuild IA). Order is intentional. */
export const primaryNavigation = [
  { id: 'situations', label: 'Situations' },
  { id: 'what_we_protect', label: 'What We Protect' },
  { id: 'response_system', label: 'Response System' },
  { id: 'sectors', label: 'Expertise' },
  { id: 'people', label: 'People' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'about', label: 'About' },
] as const satisfies readonly StrategicPrimaryNavItem[];

/** Public URL segment for the expertise index and hubs — must match `EXPERTISE_PUBLIC_SEGMENT` in `site-nav`. */
export const EXPERTISE_INDEX_PATH_SEGMENT = 'expertise' as const;

export const STRATEGIC_SITUATION_IDS = [
  'media_exposure_scrutiny',
  'reputation_under_threat',
  'family_privacy_protection',
  'executive_leadership_risk',
  'online_attacks_misinformation',
  'ai_deepfake_threats',
  'cyber_extortion_coercion',
  'sensitive_investigations',
  'international_disputes',
  'activist_hostile_campaigns',
  'crisis_containment',
  'high_stakes_litigation',
] as const;
export type StrategicSituationId = (typeof STRATEGIC_SITUATION_IDS)[number];

export interface StrategicSituation {
  readonly id: StrategicSituationId;
  readonly label: string;
}

export const STRATEGIC_WHAT_WE_PROTECT_IDS = [
  'reputation',
  'privacy',
  'family',
  'leadership',
  'influence',
  'business_continuity',
  'security',
  'legacy',
] as const;
export type StrategicWhatWeProtectId = (typeof STRATEGIC_WHAT_WE_PROTECT_IDS)[number];

export interface StrategicWhatWeProtectItem {
  readonly id: StrategicWhatWeProtectId;
  readonly label: string;
}

export const STRATEGIC_RESPONSE_SYSTEM_IDS = [
  'intelligence',
  'legal',
  'communications',
  'security',
] as const;
export type StrategicResponseSystemId = (typeof STRATEGIC_RESPONSE_SYSTEM_IDS)[number];

export interface StrategicResponseSystemPillar {
  readonly id: StrategicResponseSystemId;
  /** Pillar name (matches primary nav language where overlapping). */
  readonly label: string;
  /** Short outcome line shown after the pillar name in legacy-style copy. */
  readonly line: string;
}

export const responseSystem = [
  { id: 'intelligence', label: 'Intelligence', line: 'Identify threats' },
  { id: 'legal', label: 'Legal', line: 'Protect rights' },
  { id: 'communications', label: 'Communications', line: 'Shape narratives' },
  { id: 'security', label: 'Security', line: 'Reduce exposure' },
] as const satisfies readonly StrategicResponseSystemPillar[];

/** Join pillar label and line as a single display string (e.g. hero or list). */
export function formatResponseSystemPillar(pillar: StrategicResponseSystemPillar): string {
  return `${pillar.label}: ${pillar.line}`;
}

// --- Public expertise & internal department mapping (IA; URLs unchanged) ---

/**
 * Internal org / routing codes → human-readable capability names.
 * Use for CMS and internal linking — not as primary nav labels.
 */
export const STRATEGIC_INTERNAL_DEPARTMENT_CODES = ['ISD', 'DR', 'SCOM', 'Legal'] as const;
export type StrategicInternalDepartmentCode = (typeof STRATEGIC_INTERNAL_DEPARTMENT_CODES)[number];

export const STRATEGIC_INTERNAL_DEPARTMENT_LABELS = {
  ISD: 'Intelligence & Investigations',
  DR: 'Digital Resilience & Security',
  SCOM: 'Strategic Communications',
  Legal: 'Legal Protection & Disputes',
} as const satisfies Record<StrategicInternalDepartmentCode, string>;

/** Canonical public-facing expertise catalogue (stable ids for future hub / cross-linking). */
export const STRATEGIC_PUBLIC_EXPERTISE = [
  { id: 'reputation_defamation', label: 'Reputation & Defamation' },
  { id: 'privacy_confidentiality', label: 'Privacy & Confidentiality' },
  { id: 'strategic_communications', label: 'Strategic Communications' },
  { id: 'intelligence_investigations', label: 'Intelligence & Investigations' },
  { id: 'digital_resilience_security', label: 'Digital Resilience & Security' },
  { id: 'legal_protection_disputes', label: 'Legal Protection & Disputes' },
  { id: 'crisis_response', label: 'Crisis Response' },
  { id: 'international', label: 'International' },
  { id: 'family_personal_protection', label: 'Family & Personal Protection' },
] as const;

export type StrategicPublicExpertiseId = (typeof STRATEGIC_PUBLIC_EXPERTISE)[number]['id'];

export interface StrategicPublicExpertiseItem {
  readonly id: StrategicPublicExpertiseId;
  readonly label: string;
}

/** Labels indexed by public expertise id — safe for `/expertise/` and internal linking layers. */
export const STRATEGIC_PUBLIC_EXPERTISE_LABELS: Record<StrategicPublicExpertiseId, string> =
  Object.fromEntries(STRATEGIC_PUBLIC_EXPERTISE.map((e) => [e.id, e.label])) as Record<
    StrategicPublicExpertiseId,
    string
  >;

export function getStrategicPublicExpertiseById(
  id: StrategicPublicExpertiseId,
): StrategicPublicExpertiseItem | undefined {
  return STRATEGIC_PUBLIC_EXPERTISE.find((e) => e.id === id);
}

export function getStrategicInternalDepartmentLabel(
  code: StrategicInternalDepartmentCode,
): string {
  return STRATEGIC_INTERNAL_DEPARTMENT_LABELS[code];
}

/**
 * Closest existing directory hub slug for each public expertise row (`null` when none).
 * Uses only real directory `ExpertiseId` values — no invented slugs.
 */
export const STRATEGIC_PUBLIC_EXPERTISE_SERVICE_HUB_BY_ID = {
  reputation_defamation: 'reputation_privacy',
  privacy_confidentiality: 'reputation_privacy',
  strategic_communications: 'communications',
  intelligence_investigations: 'intelligence_security',
  /** Hub H1 is ISD; service-hub copy explicitly covers digital resilience & crisis support. */
  digital_resilience_security: 'intelligence_security',
  legal_protection_disputes: 'litigation_disputes',
  /** Closest directory hub: crisis & issues management, stakeholder comms. */
  crisis_response: 'communications',
  international: 'international',
  family_personal_protection: 'reputation_privacy',
} as const satisfies Record<StrategicPublicExpertiseId, ExpertiseId | null>;

export interface ServicesIndexPublicExpertiseCard {
  readonly id: StrategicPublicExpertiseId;
  readonly label: string;
  readonly linkedExpertiseId: ExpertiseId | null;
}

export function getServicesIndexPublicExpertiseCards(): readonly ServicesIndexPublicExpertiseCard[] {
  return STRATEGIC_PUBLIC_EXPERTISE.map((e) => ({
    id: e.id,
    label: e.label,
    linkedExpertiseId: STRATEGIC_PUBLIC_EXPERTISE_SERVICE_HUB_BY_ID[e.id],
  }));
}

/** Graph hubs for expertise index JSON-LD and cards (`/expertise/`, `/expertise/{public-slug}/`). */
export function getExpertiseIndexGraphHubEntries(): {
  id: string;
  label: string;
  pathAfterLocale: string;
}[] {
  const base = EXPERTISE_INDEX_PATH_SEGMENT;
  return getServicesIndexPublicExpertiseCards().map((c) => ({
    id: c.id,
    label: c.label,
    pathAfterLocale: c.linkedExpertiseId ? `${base}/${expertisePathSlug(c.linkedExpertiseId)}` : base,
  }));
}

// --- Typed detail models (editorial / IA source of truth) ---

export interface SituationDetailModel {
  readonly id: StrategicSituationId;
  readonly slug: string;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly lead: string;
  readonly whenThisMatters: readonly string[];
  readonly risksIfMishandled: readonly string[];
  readonly howSchillingsResponds: string;
  readonly relatedProtectiveAssets: readonly StrategicWhatWeProtectId[];
  readonly relatedResponsePillars: readonly StrategicResponseSystemId[];
  readonly ctaLabel: string;
}

export interface WhatWeProtectDetailModel {
  readonly id: StrategicWhatWeProtectId;
  readonly slug: string;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly lead: string;
  readonly whyItMatters: readonly string[];
  readonly commonRisks: readonly string[];
  readonly howSchillingsProtectsIt: string;
  readonly relatedSituations: readonly StrategicSituationId[];
  readonly relatedResponsePillars: readonly StrategicResponseSystemId[];
  readonly ctaLabel: string;
}

export interface ResponseSystemPageModel {
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly lead: string;
  readonly tagline: string;
  readonly pillars: readonly StrategicResponseSystemPillar[];
  readonly howItWorks: string;
  readonly supportedSituations: readonly StrategicSituationId[];
  readonly protectedAssets: readonly StrategicWhatWeProtectId[];
  readonly ctaLabel: string;
}

/** Public URL slug for `/situations/{slug}/` — stable kebab-case from `StrategicSituationId`. */
export function situationPathSlug(id: StrategicSituationId): string {
  return id.replace(/_/g, '-');
}

function situationDetail(
  partial: Omit<SituationDetailModel, 'slug'> & { id: StrategicSituationId },
): SituationDetailModel {
  return { ...partial, slug: situationPathSlug(partial.id) };
}

/** Full situation records — no case outcomes or rankings; framing only. */
export const situationDetailsById: Record<StrategicSituationId, SituationDetailModel> = {
  media_exposure_scrutiny: situationDetail({
    id: 'media_exposure_scrutiny',
    title: 'Media Exposure & Scrutiny',
    metaTitle: 'Media Exposure & Scrutiny | Situations | Schillings',
    metaDescription:
      'When media attention converges, Schillings aligns intelligence, legal, communications, and security for a coherent response under pressure.',
    lead: 'Journalistic and public attention can move faster than internal decision-making. Clarity on facts, audiences, and legal position needs to develop in parallel—not in isolation.',
    whenThisMatters: [
      'A story is being researched or is imminent',
      'You need to understand what is on the record and what is not',
      'Multiple outlets or jurisdictions are involved',
    ],
    risksIfMishandled: [
      'Inconsistent statements or partial briefings',
      'Legal and communications timelines falling out of sync',
      'Unintended amplification of sensitive material',
    ],
    howSchillingsResponds:
      'We bring together the disciplines that bear on media risk so you can see the landscape, decide what to assert or challenge, and protect what should remain private—without siloed advice.',
    relatedProtectiveAssets: ['reputation', 'privacy', 'leadership', 'business_continuity'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  reputation_under_threat: situationDetail({
    id: 'reputation_under_threat',
    title: 'Reputation Under Threat',
    metaTitle: 'Reputation Under Threat | Situations | Schillings',
    metaDescription:
      'When reputation is under coordinated or sudden pressure, Schillings helps map harm, audiences, and legal exposure with a single, disciplined response.',
    lead: 'Reputation risk rarely arrives as a single “communications” problem. It sits at the intersection of what is said, what the record supports, and what spreads.',
    whenThisMatters: [
      'Narratives are forming in public before you have a full picture',
      'Stakeholders are drawing conclusions from incomplete information',
      'You need to separate fact, allegation, and opinion',
    ],
    risksIfMishandled: [
      'Reactive messaging that hardens opposition',
      'Missed legal options or procedural windows',
      'Long-term trust damage from short-term tactics',
    ],
    howSchillingsResponds:
      'We work across intelligence, law, communications, and security so you understand the threat surface, choose a strategy you can sustain, and protect parallel private interests.',
    relatedProtectiveAssets: ['reputation', 'influence', 'leadership', 'legacy'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  family_privacy_protection: situationDetail({
    id: 'family_privacy_protection',
    title: 'Family Privacy & Protection',
    metaTitle: 'Family Privacy & Protection | Situations | Schillings',
    metaDescription:
      'When family life meets public or hostile attention, Schillings protects privacy, safety, and dignity alongside legal and communications strategy.',
    lead: 'Family members are often the least public part of a high-profile problem—and sometimes the most exposed. Their interests need deliberate protection, not an afterthought.',
    whenThisMatters: [
      'Private information about family members is at risk of publication',
      'Security and online exposure need to be considered together',
      'You require a plan that respects both law and personal boundaries',
    ],
    risksIfMishandled: [
      'Unintended identification or doxxing of relatives',
      'Emotional decisions that complicate legal options',
      'Inconsistent protection across jurisdictions',
    ],
    howSchillingsResponds:
      'We coordinate legal, security, and communications input so protective steps are lawful, proportionate, and aligned with how the family wants to live and work.',
    relatedProtectiveAssets: ['family', 'privacy', 'security', 'reputation'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  executive_leadership_risk: situationDetail({
    id: 'executive_leadership_risk',
    title: 'Executive & Leadership Risk',
    metaTitle: 'Executive & Leadership Risk | Situations | Schillings',
    metaDescription:
      'When leaders face scrutiny, allegations, or hostile attention, Schillings supports judgment under pressure across legal, narrative, and security dimensions.',
    lead: 'Leadership moments concentrate attention: on the individual, the organisation, and often on both at once. The response has to hold at each level.',
    whenThisMatters: [
      'Personal conduct or decisions are under examination',
      'Board, regulator, or media attention is intensifying',
      'You need a calibrated public and private posture',
    ],
    risksIfMishandled: [
      'Organisational and personal interests diverging without a plan',
      'Fragmented advice to the executive team',
      'Security and reputation risks treated separately',
    ],
    howSchillingsResponds:
      'We help leaders and institutions align on facts, risk, and messaging, with legal and security support so decisions are defensible and sustainable.',
    relatedProtectiveAssets: ['leadership', 'reputation', 'business_continuity', 'influence'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  online_attacks_misinformation: situationDetail({
    id: 'online_attacks_misinformation',
    title: 'Online Attacks & Misinformation',
    metaTitle: 'Online Attacks & Misinformation | Situations | Schillings',
    metaDescription:
      'When online attacks or false narratives spread, Schillings combines intelligence, legal, communications, and security to limit harm and clarify options.',
    lead: 'Digital channels reward speed and emotion. Without a structured view of origin, scale, and law, responses can feed the cycle rather than contain it.',
    whenThisMatters: [
      'False or misleading material is circulating widely',
      'Platforms, impersonation, or coordinated activity are involved',
      'You need to separate speech you can challenge from noise you must manage',
    ],
    risksIfMishandled: [
      'Elevating false claims through clumsy rebuttal',
      'Missing lawful routes to removal or correction',
      'Underestimating personal or physical security implications',
    ],
    howSchillingsResponds:
      'We map the attack surface, advise on legal and platform options, shape communications where appropriate, and tighten exposure where security demands it.',
    relatedProtectiveAssets: ['reputation', 'privacy', 'security', 'influence'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  ai_deepfake_threats: situationDetail({
    id: 'ai_deepfake_threats',
    title: 'AI & Deepfake Threats',
    metaTitle: 'AI & Deepfake Threats | Situations | Schillings',
    metaDescription:
      'Synthetic media and AI deception create reputation and evidence risks. Schillings helps assess authenticity, legal position, and response options.',
    lead: 'Generative tools make credible-looking false content easier to produce. Early technical and legal judgment matters as much as communications discipline.',
    whenThisMatters: [
      'Suspected synthetic audio, video, or imagery is in circulation',
      'You need to establish what the evidence supports and how to explain that carefully',
      'Rapid response is required without compromising investigations',
    ],
    risksIfMishandled: [
      'Public denials that age poorly as facts develop',
      'Loss of evidence or mishandling of material',
      'Panic-driven statements that widen the story',
    ],
    howSchillingsResponds:
      'We coordinate intelligence, legal, and communications work so authenticity questions, rights, and messaging advance together—not in conflicting directions.',
    relatedProtectiveAssets: ['reputation', 'privacy', 'security', 'leadership'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  cyber_extortion_coercion: situationDetail({
    id: 'cyber_extortion_coercion',
    title: 'Cyber Extortion & Coercion',
    metaTitle: 'Cyber Extortion & Coercion | Situations | Schillings',
    metaDescription:
      'When coercion or extortion involves data or threats of release, Schillings supports a disciplined response across legal, security, and communications lines.',
    lead: 'These incidents combine criminal risk, confidentiality, and reputational exposure. Decisions made in the first hours often shape what remains controllable.',
    whenThisMatters: [
      'Threats are tied to stolen or sensitive material',
      'Payment or engagement decisions carry legal and regulatory implications',
      'You must protect people, data, and narrative simultaneously',
    ],
    risksIfMishandled: [
      'Ad hoc engagement that weakens legal or investigative options',
      'Leaks or partial disclosures that accelerate harm',
      'Under-resourced security follow-through after the immediate event',
    ],
    howSchillingsResponds:
      'We help you stabilise the situation with coordinated legal and security judgment, and careful communications where they can reduce—not increase—risk.',
    relatedProtectiveAssets: ['security', 'privacy', 'reputation', 'family'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  sensitive_investigations: situationDetail({
    id: 'sensitive_investigations',
    title: 'Sensitive Investigations',
    metaTitle: 'Sensitive Investigations | Situations | Schillings',
    metaDescription:
      'When facts must be established discreetly—internally or externally—Schillings supports lawful, well-scoped work that feeds strategy rather than noise.',
    lead: 'Investigations touch evidence, privilege, employment, regulatory, and reputational lines. Scope and confidentiality need to be designed in, not improvised.',
    whenThisMatters: [
      'Allegations require structured fact-finding',
      'Multiple jurisdictions or entities are involved',
      'Outcomes may inform public, regulatory, or private action',
    ],
    risksIfMishandled: [
      'Process flaws that undermine usability of findings',
      'Uncontrolled information flow inside or outside the organisation',
      'Investigations that drift beyond lawful or proportionate bounds',
    ],
    howSchillingsResponds:
      'We align legal oversight, intelligence discipline, and communications planning so findings support decisions you can stand behind.',
    relatedProtectiveAssets: ['reputation', 'business_continuity', 'leadership', 'privacy'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  international_disputes: situationDetail({
    id: 'international_disputes',
    title: 'International Disputes',
    metaTitle: 'International Disputes | Situations | Schillings',
    metaDescription:
      'Cross-border disputes often carry parallel reputation and privacy dimensions. Schillings helps clients see the full field—not only the forum in one country.',
    lead: 'Jurisdictional complexity multiplies audiences: courts, regulators, media, and markets may each react on different timelines.',
    whenThisMatters: [
      'Proceedings or threats span more than one legal system',
      'Narrative risk in one country affects position in another',
      'You need a single senior view across London, Dublin, Miami, and beyond',
    ],
    risksIfMishandled: [
      'Local counsel silos without a coordinated strategy',
      'Messaging in one jurisdiction undermining another',
      'Missed non-legal drivers of settlement or escalation',
    ],
    howSchillingsResponds:
      'We integrate legal strategy with intelligence and communications so cross-border disputes are handled as one matter with many facets—not many disconnected files.',
    relatedProtectiveAssets: ['business_continuity', 'reputation', 'influence', 'legacy'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  activist_hostile_campaigns: situationDetail({
    id: 'activist_hostile_campaigns',
    title: 'Activist & Hostile Campaigns',
    metaTitle: 'Activist & Hostile Campaigns | Situations | Schillings',
    metaDescription:
      'Organised campaigns—public or covert—can target brands, leaders, or families. Schillings helps map dynamics, legal boundaries, and response options.',
    lead: 'Campaigns combine narrative, coordination, and sometimes lawful protest with behaviour that may cross legal lines. Understanding the pattern matters as much as the headline.',
    whenThisMatters: [
      'Pressure is sustained and multi-channel',
      'You need to distinguish lawful criticism from actionable conduct',
      'Internal and external audiences are pulling in different directions',
    ],
    risksIfMishandled: [
      'Over-correction that amplifies the campaign',
      'Under-reaction that signals weakness to adversaries',
      'Security gaps alongside reputational exposure',
    ],
    howSchillingsResponds:
      'We combine intelligence, legal assessment, communications judgment, and security planning so responses are proportionate, lawful, and strategically coherent.',
    relatedProtectiveAssets: ['reputation', 'influence', 'leadership', 'business_continuity'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  crisis_containment: situationDetail({
    id: 'crisis_containment',
    title: 'Crisis Containment',
    metaTitle: 'Crisis Containment | Situations | Schillings',
    metaDescription:
      'When events move quickly, Schillings helps contain legal, reputational, and security damage through a single coordinated operating rhythm.',
    lead: 'Crises compress judgment. The objective is not only to “respond”—it is to stabilise facts, audiences, and options before irreversible mistakes land.',
    whenThisMatters: [
      'Timelines are hours or days, not weeks',
      'Multiple workstreams must stay aligned',
      'Decisions carry lasting legal and public consequences',
    ],
    risksIfMishandled: [
      'Parallel teams issuing conflicting guidance',
      'Late involvement of legal or security where it mattered early',
      'Reactive external messaging without an internal fact base',
    ],
    howSchillingsResponds:
      'We stand up integrated intelligence, legal, communications, and security support so leadership can decide once, clearly, and with the full picture in view.',
    relatedProtectiveAssets: ['business_continuity', 'reputation', 'leadership', 'security'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  high_stakes_litigation: situationDetail({
    id: 'high_stakes_litigation',
    title: 'High-Stakes Litigation',
    metaTitle: 'High-Stakes Litigation | Situations | Schillings',
    metaDescription:
      'Serious litigation rarely stays in the courtroom. Schillings aligns legal strategy with communications, intelligence, and security considerations.',
    lead: 'Filings, discovery, and hearings interact with media, markets, and private life. Clients need one strategy that respects privilege and public reality.',
    whenThisMatters: [
      'Proceedings could attract sustained attention',
      'Parallel narrative or regulatory risk sits alongside the claim',
      'You need discipline in what is said, when, and to whom',
    ],
    risksIfMishandled: [
      'Communications that prejudice legal position',
      'Legal strategy blind to reputational drivers of settlement',
      'Unmanaged leaks or hostile use of court material',
    ],
    howSchillingsResponds:
      'We support legal teams with coordinated intelligence, communications, and security input so litigation strategy and reputational reality stay aligned.',
    relatedProtectiveAssets: ['reputation', 'business_continuity', 'legacy', 'privacy'],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
};

/** Public URL slug for what-we-protect detail routes (kebab-case from id). */
export function whatWeProtectPathSlug(id: StrategicWhatWeProtectId): string {
  return id.replace(/_/g, '-');
}

function wwpDetail(
  partial: Omit<WhatWeProtectDetailModel, 'slug'> & { id: StrategicWhatWeProtectId },
): WhatWeProtectDetailModel {
  return { ...partial, slug: whatWeProtectPathSlug(partial.id) };
}

const WHAT_WE_PROTECT_SLUG_TO_ID: Record<string, StrategicWhatWeProtectId> = Object.fromEntries(
  STRATEGIC_WHAT_WE_PROTECT_IDS.map((assetId) => [whatWeProtectPathSlug(assetId), assetId]),
) as Record<string, StrategicWhatWeProtectId>;

export function whatWeProtectIdFromPathSlug(slug: string): StrategicWhatWeProtectId | undefined {
  return WHAT_WE_PROTECT_SLUG_TO_ID[slug];
}

export function getAllWhatWeProtectPathSlugs(): readonly string[] {
  return STRATEGIC_WHAT_WE_PROTECT_IDS.map(whatWeProtectPathSlug);
}

export const whatWeProtectDetailsById: Record<StrategicWhatWeProtectId, WhatWeProtectDetailModel> = {
  reputation: wwpDetail({
    id: 'reputation',
    title: 'Reputation',
    metaTitle: 'Reputation | What We Protect | Schillings',
    metaDescription:
      'Reputation under scrutiny and digital spread: Schillings protects it with coordinated legal, intelligence, communications, and security advice.',
    lead: 'What people believe about you or your organisation can move markets, regulators, and relationships. Protecting reputation is rarely only a messaging exercise.',
    whyItMatters: [
      'Trust affects access to capital, talent, and partners',
      'Narratives harden quickly in public and private forums',
      'Legal and non-legal levers often need to work together',
    ],
    commonRisks: [
      'Reactive statements that cannot be sustained',
      'Misaligned internal and external accounts',
      'Slow recognition of where harm is actually forming',
    ],
    howSchillingsProtectsIt:
      'We help you see how reputation intersects with fact, law, and security, and build a response you can maintain under scrutiny.',
    relatedSituations: [
      'media_exposure_scrutiny',
      'reputation_under_threat',
      'online_attacks_misinformation',
      'activist_hostile_campaigns',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  privacy: wwpDetail({
    id: 'privacy',
    title: 'Privacy',
    metaTitle: 'Privacy | What We Protect | Schillings',
    metaDescription:
      'Personal and institutional privacy faces legal, technical, and public threats. Schillings supports lawful protection and calibrated disclosure decisions.',
    lead: 'Privacy is both a legal right and a practical perimeter. Once information crosses it, recovery is costly and sometimes impossible.',
    whyItMatters: [
      'Data and narrative leaks affect people and organisations together',
      'Jurisdictions differ in what protection means in practice',
      'Security and legal remedies need to align',
    ],
    commonRisks: [
      'Over-sharing under pressure',
      'Under-using lawful tools until damage is done',
      'Fragmented advice across IT, legal, and communications',
    ],
    howSchillingsProtectsIt:
      'We coordinate legal, security, and communications judgment so protective steps are lawful, credible, and proportionate.',
    relatedSituations: [
      'family_privacy_protection',
      'online_attacks_misinformation',
      'cyber_extortion_coercion',
      'sensitive_investigations',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  family: wwpDetail({
    id: 'family',
    title: 'Family',
    metaTitle: 'Family | What We Protect | Schillings',
    metaDescription:
      'When hostile interest reaches private life, Schillings protects family members deliberately across legal, security, and communications.',
    lead: 'Families are often the least public and most affected part of a crisis. Their interests should be designed in from the start.',
    whyItMatters: [
      'Dependents may lack independent public voice',
      'Safety and dignity intersect with legal strategy',
      'Cross-border residence complicates protection',
    ],
    commonRisks: [
      'Incidental exposure through association',
      'Emotional decisions that narrow legal options',
      'Inconsistent protection across households or jurisdictions',
    ],
    howSchillingsProtectsIt:
      'We help structure lawful protection, security, and communications choices that respect the family’s priorities and risk appetite.',
    relatedSituations: [
      'family_privacy_protection',
      'media_exposure_scrutiny',
      'cyber_extortion_coercion',
      'executive_leadership_risk',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  leadership: wwpDetail({
    id: 'leadership',
    title: 'Leadership',
    metaTitle: 'Leadership | What We Protect | Schillings',
    metaDescription:
      'Leaders need judgment under pressure when scrutiny targets them personally and organisationally. Schillings integrates legal, narrative, and security support.',
    lead: 'Leadership is where accountability concentrates. The response must work for the person, the role, and the institution—without contradictions.',
    whyItMatters: [
      'Personal and corporate risk can diverge without a plan',
      'Board and market expectations move on compressed timelines',
      'Security and reputation interact at the top of the organisation',
    ],
    commonRisks: [
      'Advisers speaking past one another',
      'Delayed alignment between counsel and communications',
      'Underestimating personal security or privacy spillover',
    ],
    howSchillingsProtectsIt:
      'We help leaders and institutions align on facts, posture, and next steps—with legal, communications, intelligence, and security in the same frame.',
    relatedSituations: [
      'executive_leadership_risk',
      'crisis_containment',
      'high_stakes_litigation',
      'activist_hostile_campaigns',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  influence: wwpDetail({
    id: 'influence',
    title: 'Influence',
    metaTitle: 'Influence | What We Protect | Schillings',
    metaDescription:
      'Influence—who listens and who acts—shapes outcomes in disputes and crises. Schillings helps protect the ability to be heard accurately and fairly.',
    lead: 'Influence is not “PR.” It is the capacity to inform decisions among audiences that matter, without sacrificing legal position or integrity.',
    whyItMatters: [
      'Audiences may include regulators, partners, and employees—not only media',
      'Misalignment between facts and narrative erodes trust',
      'Timing and tone affect whether you are heard at all',
    ],
    commonRisks: [
      'Speaking when silence is stronger',
      'Silence when inaccuracy is hardening',
      'Treating all channels as interchangeable',
    ],
    howSchillingsProtectsIt:
      'We help calibrate communications and stakeholder engagement alongside legal and intelligence judgment so your position is clear, defensible, and appropriately timed.',
    relatedSituations: [
      'reputation_under_threat',
      'activist_hostile_campaigns',
      'international_disputes',
      'media_exposure_scrutiny',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  business_continuity: wwpDetail({
    id: 'business_continuity',
    title: 'Business Continuity',
    metaTitle: 'Business Continuity | What We Protect | Schillings',
    metaDescription:
      'Serious threats can disrupt operations and confidence. Schillings helps stabilise essential functions while issues are managed.',
    lead: 'Continuity is not only operational—it is legal, reputational, and human. Decisions under stress should not foreclose options you will need later.',
    whyItMatters: [
      'Employees, customers, and counterparties watch how crises are handled',
      'Regulatory and contractual clocks keep running',
      'Recovery is harder after unforced errors',
    ],
    commonRisks: [
      'Short-term cuts that damage long-term position',
      'Inconsistent messaging to staff and markets',
      'Legal and business teams working on different assumptions',
    ],
    howSchillingsProtectsIt:
      'We align legal, communications, intelligence, and security input so leadership can stabilise the organisation while addressing the underlying threat.',
    relatedSituations: [
      'crisis_containment',
      'high_stakes_litigation',
      'international_disputes',
      'sensitive_investigations',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  security: wwpDetail({
    id: 'security',
    title: 'Security',
    metaTitle: 'Security | What We Protect | Schillings',
    metaDescription:
      'Physical and digital security for safety and confidentiality in high-stakes matters—woven into legal and communications strategy at Schillings.',
    lead: 'Security is not an add-on when threats are real—it is a constraint and enabler for everything else you do.',
    whyItMatters: [
      'Exposure online can translate to exposure offline',
      'Travel, events, and homes may need reassessment',
      'Technical and human vulnerabilities interact',
    ],
    commonRisks: [
      'Treating security as purely technical',
      'Delayed hardening after public attention spikes',
      'Miscommunication between security and legal teams',
    ],
    howSchillingsProtectsIt:
      'We integrate security planning with legal and communications work so protective measures are lawful, practical, and suited to the threat profile.',
    relatedSituations: [
      'cyber_extortion_coercion',
      'family_privacy_protection',
      'online_attacks_misinformation',
      'crisis_containment',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
  legacy: wwpDetail({
    id: 'legacy',
    title: 'Legacy',
    metaTitle: 'Legacy | What We Protect | Schillings',
    metaDescription:
      'Long-term standing—personal or institutional—can be shaped by how crises are handled. Schillings helps clients think past the immediate news cycle.',
    lead: 'Legacy is how today’s decisions read tomorrow: to family, to colleagues, and to history. Short-term tactics should not foreclose what you value long-term.',
    whyItMatters: [
      'Recovery from reputational harm can take years',
      'Succession and governance may be in play',
      'Institutional memory matters when scrutiny returns',
    ],
    commonRisks: [
      'Win-the-day messaging that ages poorly',
      'Neglecting private or family dimensions of a public fight',
      'Failing to document decisions that will be revisited',
    ],
    howSchillingsProtectsIt:
      'We help align immediate legal and communications choices with the longer arc—without losing focus on what must be resolved now.',
    relatedSituations: [
      'high_stakes_litigation',
      'international_disputes',
      'reputation_under_threat',
      'executive_leadership_risk',
    ],
    relatedResponsePillars: ['intelligence', 'legal', 'communications', 'security'],
    ctaLabel: 'Speak confidentially',
  }),
};

/** Single page model for the Response System hub (and aligned homepage tagline). */
export const responseSystemPage: ResponseSystemPageModel = {
  title: 'The Schillings Response System',
  metaTitle: 'Response System | Schillings',
  metaDescription:
    'Schillings integrates intelligence, legal, communications, and security so clients receive one coordinated response—not siloed advice under pressure.',
  lead: 'Most significant problems touch more than one discipline. The aim is to see the whole field early, decide clearly, and execute without working at cross-purposes.',
  tagline: 'Most firms address part of the problem. Schillings coordinates the entire response.',
  pillars: responseSystem,
  howItWorks:
    'Matters are staffed with the disciplines that the facts require. Intelligence informs legal and security choices; communications are calibrated to what can be said truthfully and usefully; legal strategy respects reputational and operational reality.',
  supportedSituations: [...STRATEGIC_SITUATION_IDS],
  protectedAssets: [...STRATEGIC_WHAT_WE_PROTECT_IDS],
  ctaLabel: 'Speak confidentially',
};

// --- Legacy list shapes (derived from detail models — preserves existing consumers) ---

export const situations = STRATEGIC_SITUATION_IDS.map((id) => ({
  id,
  label: situationDetailsById[id].title,
})) as const satisfies readonly StrategicSituation[];

export const whatWeProtect = STRATEGIC_WHAT_WE_PROTECT_IDS.map((id) => ({
  id,
  label: whatWeProtectDetailsById[id].title,
})) as const satisfies readonly StrategicWhatWeProtectItem[];

const situationLabelById: Record<StrategicSituationId, string> = Object.fromEntries(
  situations.map((s) => [s.id, s.label]),
) as Record<StrategicSituationId, string>;

const whatWeProtectLabelById: Record<StrategicWhatWeProtectId, string> = Object.fromEntries(
  whatWeProtect.map((w) => [w.id, w.label]),
) as Record<StrategicWhatWeProtectId, string>;

/** Safe lookup for routing or CMS keys */
export function getStrategicSituationById(id: StrategicSituationId): StrategicSituation | undefined {
  return situations.find((s) => s.id === id);
}

const PATH_SLUG_TO_SITUATION_ID: Record<string, StrategicSituationId> = Object.fromEntries(
  STRATEGIC_SITUATION_IDS.map((situationId) => [situationPathSlug(situationId), situationId]),
) as Record<string, StrategicSituationId>;

export function situationIdFromPathSlug(slug: string): StrategicSituationId | undefined {
  return PATH_SLUG_TO_SITUATION_ID[slug];
}

export function getAllSituationPathSlugs(): readonly string[] {
  return STRATEGIC_SITUATION_IDS.map(situationPathSlug);
}

/** Full situation record by id. */
export function getSituationDetailById(id: StrategicSituationId): SituationDetailModel {
  return situationDetailsById[id];
}

/** Full situation record by public slug (reverse lookup). */
export function getSituationDetailBySlug(slug: string): SituationDetailModel | undefined {
  const id = situationIdFromPathSlug(slug);
  return id ? situationDetailsById[id] : undefined;
}

/** Full what-we-protect record by id. */
export function getWhatWeProtectDetailById(id: StrategicWhatWeProtectId): WhatWeProtectDetailModel {
  return whatWeProtectDetailsById[id];
}

/** Reverse lookup for what-we-protect slugs. */
export function getWhatWeProtectDetailBySlug(slug: string): WhatWeProtectDetailModel | undefined {
  const id = whatWeProtectIdFromPathSlug(slug);
  return id ? whatWeProtectDetailsById[id] : undefined;
}

/** Shared with hub situations copy so index export and live hub stay aligned. */
const SITUATIONS_HUB_META_DESCRIPTION =
  'High-stakes situations Schillings handles: scrutiny, reputation, privacy, online attacks, litigation, crisis—intelligence, law, communications, security.' as const;

/** `/situations/` index — title, meta, intro (all locales; regional SEO via `locale-marketing-meta` later if needed). */
export const situationsIndex = {
  title: 'Situations | Schillings',
  metaDescription: SITUATIONS_HUB_META_DESCRIPTION,
  intro:
    'Triggers differ, but patterns recur: compressed timelines, hostile audiences, and decisions that cut across law, narrative, and security. These are common entry points; many matters span several.',
} as const;

/** @deprecated Prefer `SituationDetailModel` via `getSituationDetailById`. Retained for existing page mappers. */
export interface StrategicSituationDetailPageModel {
  readonly id: StrategicSituationId;
  readonly pathSlug: string;
  readonly label: string;
  readonly title: string;
  readonly metaDescription: string;
  readonly lead: string;
  readonly paragraphs: readonly string[];
}

/** Maps rich situation model to the slimmer page shape used by current templates. */
export function getStrategicSituationDetailModel(id: StrategicSituationId): StrategicSituationDetailPageModel {
  const d = getSituationDetailById(id);
  return {
    id: d.id,
    pathSlug: d.slug,
    label: d.title,
    title: d.metaTitle,
    metaDescription: d.metaDescription,
    lead: d.lead,
    paragraphs: [
      d.howSchillingsResponds,
      'Further detail can be discussed in confidence once we understand your context.',
    ],
  };
}

export function getStrategicWhatWeProtectById(
  id: StrategicWhatWeProtectId,
): StrategicWhatWeProtectItem | undefined {
  return whatWeProtect.find((w) => w.id === id);
}

export function getStrategicResponsePillarById(
  id: StrategicResponseSystemId,
): StrategicResponseSystemPillar | undefined {
  return responseSystem.find((p) => p.id === id);
}

export function isStrategicSituationId(value: string): value is StrategicSituationId {
  return (STRATEGIC_SITUATION_IDS as readonly string[]).includes(value);
}

export function isStrategicWhatWeProtectId(value: string): value is StrategicWhatWeProtectId {
  return (STRATEGIC_WHAT_WE_PROTECT_IDS as readonly string[]).includes(value);
}

export function isStrategicResponseSystemId(value: string): value is StrategicResponseSystemId {
  return (STRATEGIC_RESPONSE_SYSTEM_IDS as readonly string[]).includes(value);
}

export function isStrategicPrimaryNavId(value: string): value is StrategicPrimaryNavId {
  return (STRATEGIC_PRIMARY_NAV_IDS as readonly string[]).includes(value);
}

/** Labels indexed by id — useful for tables and JSON-LD without repeated scans */
export const STRATEGIC_SITUATION_LABELS: Record<StrategicSituationId, string> = situationLabelById;

export const STRATEGIC_WHAT_WE_PROTECT_LABELS: Record<StrategicWhatWeProtectId, string> =
  whatWeProtectLabelById;

// --- Homepage (UK / US / IE — same on-page copy; regional SEO tails in `locale-marketing-meta`) ---

export const homeHero = {
  headline:
    'Protecting reputation, privacy, security and continuity in moments of scrutiny and risk.',
  subheadline:
    'Schillings combines legal expertise, intelligence, investigations, communications and security to help influential individuals, families and organisations protect what matters most.',
} as const;

export const homeHeroCtas = {
  speakConfidentially: 'Speak confidentially',
  exploreSituations: 'Explore situations',
} as const;

export const homeWhenClientsComeToUs = [
  'A journalist is preparing a damaging story',
  'Sensitive information has been exposed',
  'Executives face scrutiny',
  'False allegations spread online',
  'AI-generated misinformation escalates',
  'A family’s privacy is threatened',
  'An activist campaign emerges',
  'An international dispute becomes reputationally sensitive',
] as const;

export const homeResponseSystemTagline = responseSystemPage.tagline;

export const homeInstitutionalTrust = {
  heading: 'Institutional Trust',
  paragraphs: [
    'Schillings is regulated as a law firm in the United Kingdom, Ireland and the United States. Our lawyers and specialist teams work within strict professional obligations of confidentiality and conduct.',
    'Clients instruct us when stakes are high and discretion matters — from public figures and family offices to institutions navigating cross-border complexity.',
  ],
} as const;

export const homeIntelligenceSection = {
  heading: 'Intelligence',
  intro:
    'Perspective and analysis on reputation, privacy, investigations, and the forces that shape high-stakes matters.',
  linkLabel: 'Explore intelligence',
} as const;

export const homeConfidentialEngagementCta = {
  heading: 'Confidential Engagement',
  body: 'If you are under scrutiny or facing risk and need to understand your options, we will handle your enquiry with care.',
  linkLabel: 'Speak confidentially',
} as const;

// --- Strategic hub placeholder pages (UK / US / IE same paths, locale via `localeHref`) ---

export const STRATEGIC_HUB_SEGMENTS = ['situations', 'what-we-protect', 'response-system'] as const;
export type StrategicHubSegment = (typeof STRATEGIC_HUB_SEGMENTS)[number];

export function isStrategicHubSegment(value: string): value is StrategicHubSegment {
  return (STRATEGIC_HUB_SEGMENTS as readonly string[]).includes(value);
}

export interface StrategicHubListItem {
  readonly primary: string;
  readonly secondary?: string;
}

export interface StrategicHubPageModel {
  readonly pathSegment: StrategicHubSegment;
  readonly title: string;
  readonly metaDescription: string;
  readonly heading: string;
  readonly intro: string;
  readonly listHeading: string;
  readonly listItems: readonly StrategicHubListItem[];
}

const HUB_PAGE_COPY: Record<
  StrategicHubSegment,
  Omit<StrategicHubPageModel, 'pathSegment' | 'listItems'>
> = {
  situations: {
    title: 'Situations | Schillings',
    metaDescription: SITUATIONS_HUB_META_DESCRIPTION,
    heading: 'Situations',
    intro:
      'Schillings brings together intelligence, law, communications, and security for clients facing acute scrutiny, coordinated pressure, and complex disputes. The areas below are typical entry points; many matters span several.',
    listHeading: 'Typical situations',
  },
  'what-we-protect': {
    title: 'What We Protect | Schillings',
    metaDescription:
      'Schillings protects reputation, privacy, family, leadership, influence, business continuity, security, and legacy under serious, cross-border threat.',
    heading: 'What We Protect',
    intro:
      'Our work is organised around what clients need to defend under pressure: personal and institutional reputation, private life, leadership, and the continuity of business and family interests.',
    listHeading: 'What we work to protect',
  },
  'response-system': {
    title: 'Response System | Schillings',
    metaDescription:
      'Schillings integrates intelligence, legal, communications, and security — one coordinated response for organisations and individuals facing threats to reputation, rights, narrative, and operational security.',
    heading: 'Response System',
    intro:
      'Every engagement draws on the right mix of disciplines so you see the full picture early and respond with a single coherent strategy—not a patchwork of separate advisers.',
    listHeading: 'How we organise the response',
  },
};

/** Page model for `/situations/`, `/what-we-protect/`, and `/response-system/` (all locales). Lists derive from `situations`, `whatWeProtect`, and `responseSystem`. */
export function getStrategicHubPageModel(segment: StrategicHubSegment): StrategicHubPageModel {
  const base = HUB_PAGE_COPY[segment];
  let listItems: readonly StrategicHubListItem[];
  switch (segment) {
    case 'situations':
      listItems = situations.map((s) => ({ primary: s.label }));
      break;
    case 'what-we-protect':
      listItems = whatWeProtect.map((w) => ({ primary: w.label }));
      break;
    case 'response-system':
      listItems = responseSystem.map((p) => ({ primary: p.label, secondary: p.line }));
      break;
  }
  return {
    pathSegment: segment,
    title: base.title,
    metaDescription: base.metaDescription,
    heading: base.heading,
    intro: base.intro,
    listHeading: base.listHeading,
    listItems,
  };
}
