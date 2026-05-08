# Validation Runbook

Purpose: operational rules for validating practitioner bio trust quality without subjective drift.

Mode: procedural, lightweight, evidence-led.

## 1) Validation Cadence

Run reviews at three moments:

1. **Baseline review**  
   Before any cohort change (already completed for Cohort 1).

2. **Post-change review**  
   Immediately after each approved cohort change set.

3. **Quarterly drift review**  
   Periodic calibration to detect rhetoric drift, proof drift, or consistency erosion.

Minimum cadence rule:

- No new implementation cycle starts without prior cycle validation logged.

## 2) Reviewer Threshold and Mix

Per cohort, require:

- **Minimum reviewers:** 3
- **Preferred range:** 3-5

Reviewer mix should include at least 3 distinct lenses:

- GC / legal-risk lens
- adviser / intermediary lens
- operator / executive lens
- optional: journalist / UHNW intermediary lens

Consistency rule:

- Use `LIVE-READING-REVIEW-TEMPLATE.md` for all reviewers.
- Reviews must be timed and structured (no freeform critique sessions).

## 3) Aggregation Rules

### Core metrics to aggregate

- total score by profile
- confidence verdict band
- referral safety (Yes/Maybe/No)
- dominant trust mode
- friction markers

### Aggregation method

- Compute mean and median score per profile.
- Compute cohort variance (range and standard deviation if available).
- Track repeated weak dimensions by frequency, not volume of commentary.

### Disagreement handling

If reviewer scores differ materially (gap >= 6 points on same profile):

1. confirm template usage consistency
2. compare notes for evidence vs preference
3. run one tie-break review by a designated reviewer

Do not resolve disagreements by averaging opinion essays.

## 4) D-002 Trigger Conditions (Decision Log Escalation)

Open D-002 only if repeated evidence appears across reviewers/profiles.

### Valid triggers

- same confidence friction appears in >=2 profiles and >=2 reviewers
- recurring mobile trust formation delay
- recurring proof discoverability friction
- recurring rhetoric inflation after updates
- measurable variance increase after change cycle

### Not valid triggers

- one-off subjective preference
- isolated comment without rubric impact
- benchmark-style aesthetic requests

Evidence minimum for D-002:

- rubric deltas
- repeated friction markers
- short evidence summary in cohort tracker

## 5) Stop/Go Thresholds

### Continue stabilization (default)

Choose stabilization if:

- score improvements are positive but uneven
- variance is still narrowing
- unresolved issues are known but not recurring system failures

### Open Phase 2 investigation gate

Only if all apply:

1. repeated friction appears across reviewers and profiles
2. friction materially affects confidence or referral safety
3. Phase 1-safe measures cannot resolve it
4. proposed test can be isolated and reversible

### Hard stop condition

Pause new rollout if:

- variance increases meaningfully across cohort
- referral safety degrades on >=2 profiles
- anti-patterns appear in approved changes

## 6) Non-Actionable Feedback Filter

The following are insufficient grounds for change unless tied to trust evidence:

- "feels more premium"
- "needs more visual energy"
- "portrait should pop more"
- "looks too minimal"
- "needs stronger branding"

Actionability rule:

- feedback must map to rubric dimensions, trust behavior, or repeated friction markers.

## 7) Required Artifacts Per Validation Cycle

For each cycle, update:

- `COHORT-1-REVIEW-TRACKER.md` (or active cohort tracker)
- `IMPLEMENTATION-DECISION-LOG.md` (if decision threshold met)
- optional note in `GOVERNANCE-CHANGE-CONTROL.md` if doctrine-level issue appears

## 8) Rollback-First Principle

If validation degrades confidence:

1. rollback to last stable state
2. log cause in decision log
3. re-validate baseline before further changes

No speculative fixes without measured diagnosis.

## 9) Operating Principle

This runbook exists to preserve:

- trust mechanics over aesthetics
- consistency over novelty
- evidence over preference
- institutional coherence over isolated wins
