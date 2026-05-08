# Jenny Afia Internal Sequencing Prototype (Phase 2)

Purpose: internal-only sequencing prototype to test whether constrained proof adjacency improves mobile trust timing and proof discoverability.

Profile in scope: `jenny-afia` only.

Status: investigation artifact only. No production implementation.

## 1) Annotated Sequence Comparison

### Current sequence (shared baseline)

1. identity header (name + role)
2. biography opening paragraph(s)
3. biography continuation
4. independent proof block
5. related context sections
6. contact pathway

Observed effect:

- mobile trust depends on biography before independent proof appears
- proof is encountered later in the first-read flow

### Prototype sequence (constrained adjacency)

1. identity header (unchanged)
2. first biography paragraph (unchanged content intent)
3. independent proof block (same shared component, same styling)
4. remaining biography paragraphs
5. related context sections
6. contact pathway

Annotation:

- only order is adjusted
- no component styling changes
- no portrait or composition changes
- no spacing-system changes

## 2) Internal Prototype Reference

Prototype type: sequencing map only (documentation prototype).

Reference basis:

- `01-current-state-sequence-map.md`
- `02-constrained-adjacency-variant-map.md`
- `03-mobile-first-scroll-comparison.md`
- `04-proof-encounter-timing-comparison.md`
- `05-friction-marker-impact-hypothesis.md`

Prototype control statement:

- this prototype preserves shared architecture and visual language
- this prototype is not a rollout candidate by default

## 3) Expected Trust Timing Impact Notes

Expected directional impact (to validate empirically):

- earlier proof encounter in mobile first-read flow
- reduced delay between remit claim and external proof visibility
- reduced recurring markers:
  - `proof discoverability friction`
  - `mobile proof adjacency`
  - `recurring mobile trust formation delay`

Expected non-changes:

- institutional tone remains unchanged
- no decorative proof behavior introduced
- no layout/portrait drift introduced

## 4) Rollback Notes

If prototype evidence is weak or negative:

1. close prototype path and retain current shared sequence
2. log result in `IMPLEMENTATION-DECISION-LOG.md`
3. continue stabilization under `VALIDATION-RUNBOOK.md`

Rollback trigger examples:

- no measurable reduction in repeated mobile proof/timing friction
- trust outcomes do not improve relative to baseline
- anti-pattern indicators appear

## 5) Anti-Pattern Check

Required pass conditions:

- no premiumization behavior
- no decorative rankings/proof styling
- no asymmetry or art-direction behaviors
- no custom profile variant logic
- no benchmark aesthetic import
- no typography/spacing system drift

If any anti-pattern is observed, prototype is invalid and should not proceed.
