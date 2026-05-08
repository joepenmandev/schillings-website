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

### D-002 (placeholder)
- Date:
- Owner:
- Cohort:
- Profiles affected:

**What Changed**
- 

**Why**
- 

**Evidence Source**
- 

**Rubric Impact**
- Before score range:
- After score range:
- Delta:
- Most improved dimensions:
- Unresolved dimensions:

**Rollback Path**
- 

**Doctrine Exception Required?**
- No

---

## Logging Rules

- Keep entries short, factual, and decision-oriented.
- Prefer measurable evidence over preference-based rationale.
- Link every decision to rubric impact where available.
- If rollback is tested, append result to the same decision entry.
- If doctrine is updated, cross-reference `DOCTRINE-V1-LOCK.md`.
