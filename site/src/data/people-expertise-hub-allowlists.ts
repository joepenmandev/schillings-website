/**
 * Explicit exceptions for `people-expertise-hub-membership.test.ts`.
 *
 * **Prefer fixing `people-imported.json`** (or `people-practice-group-overrides.json`) over growing these lists.
 *
 * - {@link ALLOW_LITIGATION_EXPERTISE_NON_LEGAL_EFFECTIVE} — carries `litigation_disputes` but directory/byline resolves non-`legal` (rare; usually a data bug).
 * - {@link ALLOW_DIGITAL_RESILIENCE_TAG_NON_DR_EFFECTIVE} — carries `digital_resilience` but byline is not `dr` (e.g. explicit import `isd` with DR tooling; must be intentional).
 * - {@link ALLOW_DR_EFFECTIVE_WITHOUT_DIGITAL_RESILIENCE_TAG} — byline `dr` without `digital_resilience` hub tag (discouraged).
 */
export const ALLOW_LITIGATION_EXPERTISE_NON_LEGAL_EFFECTIVE: readonly string[] = [];

export const ALLOW_DIGITAL_RESILIENCE_TAG_NON_DR_EFFECTIVE: readonly string[] = [];

export const ALLOW_DR_EFFECTIVE_WITHOUT_DIGITAL_RESILIENCE_TAG: readonly string[] = [];
