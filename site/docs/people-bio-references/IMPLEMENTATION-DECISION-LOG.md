# Implementation Decision Log

Purpose: lightweight institutional memory for rollout decisions over time.

Use one entry per approved rollout decision.

---

## Entry Template

### Decision ID
- Date:
- Owner:
- Cohort:
- Profiles affected:

### What Changed
- (Short description of change)

### Why
- (Decision rationale in plain language)

### Evidence Source
- (Reference docs, benchmark findings, cohort scores, review notes)
- Example: `BENCHMARK-BIO-REVIEW.md`, `PROFILE-REVIEW-RUBRIC.md`, cohort tracker deltas

### Rubric Impact
- Before score range:
- After score range:
- Delta:
- Most improved dimensions:
- Unresolved dimensions:

### Rollback Path
- (Exact rollback action/path if outcome degrades)

### Doctrine Exception Required?
- Yes / No
- If yes:
  - Exception description:
  - Approver:
  - Expiry/review date:

---

## Decision Entries

### D-001
- Date: 2026-05-08
- Owner: Phase 1 rollout team
- Cohort: Cohort 1
- Profiles affected: `jenny-afia`, `ben-hobbs`, `rachel-atkins`

**What Changed**
- Updated biography openings to prioritize remit, scope, and operating context.
- Reduced prestige-led rhetoric in core bio copy.
- Improved shared proof framing labels in `PersonTrustSignals`.
- Added deterministic recognition ordering in shared trust rendering.

**Why**
- Improve trust formation and reduce profile-quality variance without layout redesign.
- Align live bios to Phase 1-safe doctrine (evidence proximity, calmer institutional tone, operational realism).

**Evidence Source**
- `PHASE-1-IMPLEMENTATION-SCOPE.md`
- `COHORT-1-REVIEW-TRACKER.md` (before/after deltas)
- `PROFILE-REVIEW-RUBRIC.md`
- `BENCHMARK-BIO-REVIEW.md`

**Rubric Impact**
- Before score range: 13-16 (core three profiles)
- After score range: 15-17 (core three profiles)
- Delta: +1 to +2 per profile
- Most improved dimensions: authority-before-self-description, rhetoric restraint, first-read clarity.
- Unresolved dimensions: independent proof still appears after biography in current shared sequence (mobile impact remains).

**Rollback Path**
- Revert profile paragraph updates in `people-imported.json` for the three slugs.
- Revert proof copy/order changes in `PersonTrustSignals.astro` and provider label adjustments in `RecognitionBadges.astro`.
- Re-run tests/build and restore prior cohort baseline if needed.

**Doctrine Exception Required?**
- No

---

### D-002
- Date: 2026-05-08
- Owner: Validation and governance review
- Cohort: Cohort 1
- Profiles affected: `jenny-afia`, `ben-hobbs`, `rachel-atkins`

**What Changed**
- Opened a narrow Phase 2 investigation gate only.
- Investigation scope limited to early proof discoverability and mobile trust timing.
- No implementation approved in this decision.

**Why**
- Repeated and material friction appears across core cohort validation outputs.
- Evidence supports investigation threshold under runbook D-002 trigger logic, but not redesign or broad rollout change.

**Evidence Source**
- `site/docs/people-bio-references/automated-validation/results/` (18 structured reviews)
- `site/scripts/people-bio-aggregate-reviews.mjs` markdown aggregation output
- `COHORT-1-REVIEW-TRACKER.md`
- `VALIDATION-RUNBOOK.md`

**Rubric Impact**
- Before score range: 12-16 (core baseline)
- After score range: 15-17 (core three profiles after Phase 1)
- Delta: +1 to +2 post-Phase 1, with recurring mobile/adjacency friction in validation execution
- Most improved dimensions: rhetoric restraint, remit clarity, institutional tone consistency
- Unresolved dimensions: proof discoverability timing, mobile proof adjacency, recurring mobile trust formation delay

**Rollback Path**
- Not applicable (no production implementation in D-002 gate decision).
- If investigation scope drifts, close gate and revert to stabilization-only mode under `VALIDATION-RUNBOOK.md`.

**Doctrine Exception Required?**
- No

---

### D-003
- Date: 2026-05-08
- Owner: Phase 2 constrained rollout
- Cohort: Cohort 1 (validated core profiles)
- Profiles affected: `jenny-afia`, `ben-hobbs`, `rachel-atkins`

**What Changed**
- Implemented approved sequencing-only adjustment in shared profile flow for validated Cohort 1 slugs.
- Existing independent proof block now renders immediately after the first biography paragraph for these profiles.
- No proof styling, copy, component, portrait, spacing, or typography changes.

**Why**
- D-002 investigation showed repeatable reduction in mobile trust timing friction via sequencing-only adjacency.
- Change was limited to approved narrow scope with reversible ordering logic.

**Evidence Source**
- `PHASE-2-CONSTRAINED-IMPLEMENTATION-PROPOSAL.md`
- `PHASE-2-PROOF-ADJACENCY-INVESTIGATION.md`
- `site/docs/people-bio-references/automated-validation/results/` (post-implementation passes)
- `site/scripts/people-bio-aggregate-reviews.mjs` output
- `COHORT-1-REVIEW-TRACKER.md`

**Rubric Impact**
- Baseline mobile/desktop delta (core three): -1 each profile
- Post-implementation mobile/desktop delta (core three): 0 each profile
- Delta: +1 mobile normalization without desktop regression
- Most improved dimensions: mobile trust timing, proof adjacency friction recurrence, referral confidence consistency
- Unresolved dimensions: residual `proof discoverability friction` marker still present in controlled outputs

**Rollback Path**
- Revert sequencing logic in `PersonProfileArticle.astro`:
  - remove `phase2SequencingSlugs` gate
  - remove early inline `PersonTrustSignals` placement
  - restore single downstream trust block placement
- Re-run automated validation and confirm baseline restoration.

**Doctrine Exception Required?**
- No

---

## Logging Rules

- Keep entries short, factual, and decision-oriented.
- Prefer measurable evidence over preference-based rationale.
- Link every decision to rubric impact where available.
- If rollback is tested, append result to the same decision entry.
- If doctrine is updated, cross-reference `DOCTRINE-V1-LOCK.md`.
