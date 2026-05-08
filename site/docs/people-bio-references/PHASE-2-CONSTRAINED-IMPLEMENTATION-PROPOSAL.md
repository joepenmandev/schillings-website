# Phase 2 Constrained Implementation Proposal

Purpose: define a narrowly scoped implementation proposal for sequencing-only proof adjacency adjustments validated in Phase 2 investigation.

Status: proposal only. No implementation is authorized by this document.

## Evidence Basis

This proposal is based on constrained internal validation across the three core profiles:

- `jenny-afia`
- `ben-hobbs`
- `rachel-atkins`

Observed repeatable outcomes in investigation runs:

- recurring mobile trust formation delay removed
- mobile proof adjacency friction removed
- desktop/mobile score delta normalized
- referral safety stable or improved (no `No` outcomes)
- dominant trust mode remained stable (institutional/mixed)
- no anti-pattern drift observed

Reference artifacts:

- `PHASE-2-PROOF-ADJACENCY-INVESTIGATION.md`
- `phase-2-investigation-artifacts/`
- automated validation outputs in `automated-validation/results/`
- `IMPLEMENTATION-DECISION-LOG.md` (`D-002`)

## 1) Exact Allowed Sequencing Change

Allowed change (and only this change):

- move the existing independent proof block to appear earlier in reading order, immediately after the first biography paragraph in the shared practitioner flow.

Allowed implementation characteristics:

- same shared proof component
- same labels and proof language model
- same visual styling and spacing tokens
- same shared page architecture

No additional sequencing experiments are included in this proposal.

## 2) Implementation Boundaries

Required boundaries:

- no redesign
- no portrait/composition changes
- no spacing-system changes
- no typography changes
- no profile variants or profile-specific logic
- no benchmark aesthetic adoption
- no new component types
- no changes to recognition design treatment

Boundary rule:

- if a change extends beyond ordering of existing sections/components, it is out of scope.

## 3) Profiles Eligible for Rollout

Initial eligibility (validated core cohort):

- `jenny-afia`
- `ben-hobbs`
- `rachel-atkins`

Conditional extension eligibility:

- additional profiles may be included only after post-implementation validation confirms no regression and stable anti-pattern checks.

Not eligible in initial pass:

- thin-profile variants
- profile-type variants
- any special-case profile treatment

## 4) Rollout Gating Requirements

All must be true before implementation approval:

1. governance sign-off recorded in tracker/decision log
2. sequencing-only scope confirmation documented
3. rollback path confirmed and testable
4. post-implementation validation schedule committed
5. anti-pattern monitoring checklist attached to rollout entry

Gate failure rule:

- if any gate is unmet, remain in stabilization/investigation mode.

## 5) Rollback Conditions

Rollback is required if any condition occurs:

- referral safety `No` appears in >=2 reviewed profiles post-change
- desktop/mobile trust delta worsens versus current validated baseline
- repeated friction markers reappear at material levels:
  - `mobile proof adjacency`
  - `recurring mobile trust formation delay`
- anti-pattern drift is detected

Rollback action:

- revert sequencing change to prior shared order
- log rollback in `IMPLEMENTATION-DECISION-LOG.md`
- rerun validation cycle under `VALIDATION-RUNBOOK.md`

## 6) Post-Implementation Validation Requirements

Required post-change checks:

- run structured desktop/mobile reviews for approved rollout profiles
- aggregate via `site/scripts/people-bio-aggregate-reviews.mjs`
- compare against pre-change baseline and investigation benchmarks

Required metrics to confirm:

- reduced proof/timing friction recurrence
- maintained or improved referral safety
- stable dominant trust mode
- no anti-pattern triggers

Recording requirements:

- update `COHORT-1-REVIEW-TRACKER.md` (or active cohort tracker)
- append decision outcome in `IMPLEMENTATION-DECISION-LOG.md`

## 7) Prohibited Follow-On Changes

The following are explicitly prohibited as follow-on work under this proposal:

- layout redesign exploration
- portrait repositioning/cropping changes
- decorative or premiumized proof surfaces
- profile-specific composition logic
- broad copy rewrites framed as sequencing work
- profile variants introduced under Phase 2 sequencing scope

Any such change requires separate governance decision and new scope approval.

## 8) Anti-Pattern Monitoring Requirements

Monitor and flag immediately:

- decorative proof treatment
- luxury/minimal editorial drift
- asymmetry introduced as authority signaling
- one-off profile exceptions
- unsupported prestige inflation language
- benchmark-style visual mimicry

Monitoring cadence:

- include anti-pattern checks in every post-implementation review cycle
- escalate immediately if drift appears

## Proposal Decision Frame

This proposal supports a narrow, reversible, sequencing-only implementation path.  
It does not authorize redesign or scope expansion.
