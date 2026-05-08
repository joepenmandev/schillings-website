# Phase 2 Proof Adjacency Investigation

Purpose: define a narrow, evidence-led investigation plan for early proof discoverability and mobile trust timing.

Status: investigation only. No implementation approval in this document.

Decision basis: `IMPLEMENTATION-DECISION-LOG.md` entry `D-002`.

## Scope Boundary

In scope:

- early proof discoverability
- proof adjacency to first trust-forming content
- mobile trust timing in current shared practitioner system

Out of scope:

- layout redesign
- portrait/composition changes
- profile variants
- benchmark aesthetic adoption
- production code changes in this phase

## 1) Hypotheses

H1. Reducing proof-to-opener distance improves early trust formation on mobile without reducing institutional tone.

H2. Clearer proximity between opening remit context and independent proof improves referral safety confidence consistency.

H3. Small sequencing changes can reduce recurring proof friction without introducing redesign behavior.

## 2) Test Candidates (Investigation Design Only)

Candidate A: baseline sequence map

- map current proof position relative to opener and first scroll segments on mobile and desktop
- record average interaction steps to first proof encounter

Candidate B: low-variance sequencing mock

- design a constrained sequencing variant for internal validation only
- keep shared system structure and visual language unchanged
- no portrait, spacing-system, or composition changes

Candidate C: proof label clarity check

- validate whether existing proof framing language reduces or sustains friction when sequencing is adjusted
- no new badge systems or decorative proof UI

Candidate D: mobile-first timing check

- evaluate first-screen and first-scroll trust timing under constrained proof adjacency assumptions
- focus on confidence timing, not visual novelty

## 3) Success Metrics

Primary metrics:

- reduction in repeated `proof discoverability friction` markers
- reduction in repeated `mobile proof adjacency` markers
- reduction in repeated `mobile trust formation delay` markers
- lower desktop/mobile score gap (current recurring delta: -1 mobile)

Secondary metrics:

- no increase in `No` referral safety outcomes
- preserved institutional trust mode dominance
- no anti-pattern drift markers introduced

## 4) Rollback / Abort Criteria

Abort or rollback investigation pathway if any occur:

- referral safety degrades on >=2 profiles
- variance increases meaningfully across tested profiles
- anti-pattern triggers appear (decorative proof, premiumization pressure, asymmetry drift)
- findings depend on redesign-level interventions rather than constrained sequencing

Rollback posture:

- close Phase 2 gate and return to stabilization-only mode under `VALIDATION-RUNBOOK.md`
- log outcome in `IMPLEMENTATION-DECISION-LOG.md`

## 5) Prohibited Changes

The following are explicitly prohibited in this investigation phase:

- production implementation or rollout
- profile code changes
- bio rewrites or rhetoric rewrites as substitute for sequencing evidence
- layout redesign or new composition logic
- portrait treatment changes
- profile-type variants
- benchmark visual pattern import
- subjective premiumization proposals

## 6) Minimum Evidence Required Before Any Implementation Proposal

All conditions must be met:

1. repeated friction reduction appears across >=2 profiles and >=2 reviewer lenses
2. mobile trust timing improvement is measurable and repeatable
3. referral safety remains stable (no `No` outcomes increase)
4. no anti-pattern drift markers are introduced
5. evidence is documented in:
   - `COHORT-1-REVIEW-TRACKER.md` (or active cohort tracker)
   - automated aggregation output from `site/scripts/people-bio-aggregate-reviews.mjs`
   - `IMPLEMENTATION-DECISION-LOG.md` follow-up entry

If any condition is not met, remain in stabilization and do not open implementation.

## Operating Rule

This Phase 2 document governs investigation only.  
It does not authorize redesign or production changes.
