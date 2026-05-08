# Live Bio Rollout Plan

Source basis:

- `BENCHMARK-BIO-REVIEW.md`
- `BIO-IMPROVEMENT-PRINCIPLES.md`
- `PATTERN-LIBRARY.md`
- `SCHILLINGS-BIO-GAP-AUDIT.md`

Status: planning only.  
No implementation should occur until explicit approval.

## Rollout Logic

- Roll out only patterns that benchmark evidence marks as safe and system-compatible.
- Keep shared architecture as default.
- Defer unresolved early-proof and composition questions to benchmarked phases.

---

## Phase 1 — Safe Shared Improvements

Scope: copy hierarchy, recognition ordering, minor spacing, CTA tone, proof visibility, link label improvements.

### Change 1: Copy Hierarchy and Paragraph Function Discipline
- **Benefit:** Improves trust accumulation and authority arc without layout changes.
- **Risk:** Editorial inconsistency if contributors apply rules unevenly.
- **Affected profiles:** All practitioner pages, highest impact on legal + communications + intelligence profiles.
- **Rollback path:** Revert profile copy to previous approved paragraphs per slug.
- **QA needed:** Editorial review checklist (scope -> context -> proof), tone check, legal/compliance copy pass.

### Change 2: Recognition Ordering Standard
- **Benefit:** Makes proof clearer and more credible (highest-relevance recognition first).
- **Risk:** Perceived ranking sensitivity if ordering logic is unclear.
- **Affected profiles:** Profiles with recognitions in `people-eeat-extras.json`.
- **Rollback path:** Restore prior ordering rule in recognition rendering/data ordering.
- **QA needed:** Ordering logic test, spot checks across highly-recognised and lightly-recognised profiles.

### Change 3: Proof Visibility (Within Shared Sections)
- **Benefit:** Better scan-path trust without introducing new modules.
- **Risk:** Can become noisy if too much proof text is front-loaded.
- **Affected profiles:** All non-thin profiles first; thin profiles reviewed separately.
- **Rollback path:** Revert section copy/placement to baseline wording and spacing.
- **QA needed:** mobile first-screen checks, readability checks, no decorative proof behavior.

### Change 4: CTA Tone Refinement (Restrained Pathways)
- **Benefit:** Reinforces institutional seriousness and procedural confidence.
- **Risk:** Too restrained could reduce action clarity for some users.
- **Affected profiles:** All practitioner profiles.
- **Rollback path:** Restore previous `PersonContactCta` copy strings.
- **QA needed:** copy QA for neutrality, accessibility wording, click-path sanity check.

### Change 5: Link Label Improvements (Evidence-First Labels)
- **Benefit:** Reduces ambiguity and improves evaluator scanning confidence.
- **Risk:** Label verbosity may increase visual noise if overdone.
- **Affected profiles:** Trust links, additional references, related content links.
- **Rollback path:** Restore prior label strings.
- **QA needed:** content style pass, accessibility/link-context checks, mobile truncation check.

### Change 6: Minor Spacing Calibration (No Composition Overhaul)
- **Benefit:** Better density-without-clutter in high-text profiles.
- **Risk:** Small shifts can cascade into inconsistent rhythm across breakpoints.
- **Affected profiles:** Shared practitioner sections only.
- **Rollback path:** Revert token/class tweaks in shared components.
- **QA needed:** desktop/mobile visual regression pass, section rhythm check.

---

## Phase 2 — Benchmarked Layout Improvements

Scope: portrait treatment, first-screen composition, proof system layout, density adjustments.

### Change 1: First-Screen Composition (Early Trust Signal Placement)
- **Benefit:** Addresses open benchmark finding: independent proof appears too late.
- **Risk:** High if it disrupts shared architecture or introduces decorative proof.
- **Affected profiles:** All profiles eventually, pilot on hidden benchmark first.
- **Rollback path:** feature flag or route-limited toggle back to baseline shared order.
- **QA needed:** A/B benchmark review, mobile fold-depth checks, trust-scan usability review.

### Change 2: Portrait Treatment Calibration
- **Benefit:** Can improve identity-proof balance across profile types.
- **Risk:** Medium-high if portrait starts to dominate authority signals.
- **Affected profiles:** Shared profile renderer (`PersonProfileArticle`) all cohorts.
- **Rollback path:** revert portrait classes/crop behavior to current shared defaults.
- **QA needed:** cross-device portrait prominence audit, text-image hierarchy checks.

### Change 3: Proof System Layout Refinement
- **Benefit:** Better claim-to-proof adjacency and scannability.
- **Risk:** Medium-high if proof section becomes over-designed or badge-centric.
- **Affected profiles:** `PersonTrustSignals` and any biography-adjacent proof insertions.
- **Rollback path:** keep proof in current single trust block format.
- **QA needed:** recognition readability test, non-decorative proof rule validation, content density QA.

### Change 4: Density Adjustments in Layout Rhythm
- **Benefit:** Supports denser authority signals without clutter.
- **Risk:** Medium; can create cramped pages if over-optimized.
- **Affected profiles:** all shared sections with long copy blocks.
- **Rollback path:** revert spacing/typography adjustments to baseline tokens.
- **QA needed:** readability pass at key breakpoints, long-profile and thin-profile comparative review.

---

## Phase 3 — Profile-Type Variants Only If Needed

Scope: highly recognised partners, thin profiles, non-lawyer profiles, communications/intelligence profiles.

Rule: variants are allowed only when shared-system goals cannot be met with content standards alone.

### Variant Track A: Highly Recognised Partners
- **Benefit:** Better ordering of dense proof without clutter.
- **Risk:** Medium-high; may reintroduce prestige-driven visual divergence.
- **Affected profiles:** partners with multiple high-confidence recognitions.
- **Rollback path:** revert to default shared rendering and baseline ordering.
- **QA needed:** proof relevance hierarchy review, anti-noise check, consistency audit.

### Variant Track B: Thin Profiles
- **Benefit:** Solves trust under-accumulation on thin pages.
- **Risk:** High; easy to force artificial depth or overclaim.
- **Affected profiles:** profiles under thin threshold (`isThinPersonProfile`).
- **Rollback path:** retain existing thin behavior (no added context sections).
- **QA needed:** thin-specific benchmark test, compliance-safe claim checks, mobile first-screen trust review.

### Variant Track C: Non-Lawyer Profiles
- **Benefit:** Better remit framing for advisory/intelligence/digital roles.
- **Risk:** Medium; taxonomy drift and inconsistent tone if unmanaged.
- **Affected profiles:** ISD/DR and operational leadership biographies.
- **Rollback path:** return to shared legal-style copy framework with neutral descriptors.
- **QA needed:** role-language consistency checks, matter relevance checks, proof type appropriateness review.

### Variant Track D: Communications / Intelligence Profiles
- **Benefit:** Improves evaluator relevance where proof differs from litigation-centric profiles.
- **Risk:** Medium-high; can drift into personality-led or campaign-style language.
- **Affected profiles:** `scom` and `isd` cohorts.
- **Rollback path:** revert to base shared profile standards and generic proof ordering.
- **QA needed:** institutional tone guardrail review, evidence specificity check, anti-promotional drift pass.

---

## Safe-to-Roll Candidates from Benchmark Review

Eligible now (subject to approval):

1. copy hierarchy and paragraph function discipline
2. specificity-over-superlatives editing pass
3. restrained CTA copy refinements
4. link label clarity improvements
5. recognition ordering improvements without layout change

Not eligible yet (needs further benchmark):

1. early independent proof in first-screen composition
2. proof section layout restructuring
3. portrait behavior adjustments beyond current shared treatment
4. thin profile scaffolding changes

---

## QA Framework by Phase

### Phase 1 QA
- editorial quality checklist
- cross-profile consistency pass (legal/scom/isd/thin)
- mobile/desktop readability pass
- compliance and tone review

### Phase 2 QA
- hidden benchmark and pre-prod review
- visual regression on shared components
- first-screen trust scan tests (especially mobile)
- proof plainness and non-decoration validation

### Phase 3 QA
- cohort-specific review rubric
- regression against shared architecture guardrails
- risk sign-off before any variant survives

---

## Rollback Strategy

- All phases must be delivered in small reversible increments.
- Each change set should be isolated by component/copy scope.
- Rollback command path:
  - revert changed content/config for phase
  - restore baseline component behavior
  - re-run tests/build + smoke checks

No phase should proceed without rollback readiness documented in PR notes.

---

## Approval Gates

Before each phase starts:

1. Written approval on scope and risk level.
2. QA checklist agreed.
3. Rollback plan agreed.
4. Confirmation that no prohibited patterns are introduced:
   - one-off art direction
   - luxury minimalism
   - decorative proof systems
   - buried authority signals

Until these gates are met, this remains planning only.
