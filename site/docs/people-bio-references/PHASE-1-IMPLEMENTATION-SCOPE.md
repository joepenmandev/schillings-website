# Phase 1 Implementation Scope (Safe Shared Improvements Only)

Purpose: define approved-safe, scalable improvements for practitioner bios.  
Constraint: planning only. No implementation in this document.

## Scope Guardrails

Phase 1 includes only shared, low-risk changes across practitioner profiles.

Not allowed in Phase 1:

- benchmark-only composition experiments
- portrait system redesign
- profile-type layout variants
- art direction changes
- asymmetry or whitespace-led editorial treatments

---

## Phase 1 Success Signals (Measurable)

Phase 1 should be evaluated against observable outcomes, not taste preference.

- Authority cues are visible earlier in the scroll path (desktop and mobile).
- Lower reliance on self-descriptive language without supporting context.
- Recognitions/proof links are easier to scan and interpret quickly.
- Bios are easier to summarize after first read (role, remit, credibility).
- Reduced variance in perceived profile quality across practitioner cohorts.
- Improved first-screen confidence on mobile journeys.
- Institutional consistency is preserved or improved (no fragmentation in hierarchy/tone).

Measurement approach:

- pre/post editorial QA scoring rubric
- reviewer task checks (summarize profile in one sentence after first read)
- mobile fold-depth trust check on representative sample set
- consistency scoring across legal/scom/isd/dr + thin profiles

---

## Proof Taxonomy (Explicit)

For Phase 1, "proof" means concrete credibility signals that support claims.

Acceptable proof categories:

- legal directories and ranking systems
- publications and authored analysis
- appointments and panel roles
- policy participation and advisory contributions
- representative matters (anonymized where necessary)
- speaking and expert commentary
- investigations and dispute-support context
- cross-border/jurisdiction operating evidence
- institutional affiliations and governance roles

Proof usage rules:

- proof should clarify a claim, not decorate a page
- proof labels should indicate source type and relevance
- proof should remain plain, scannable, and non-promotional

Not acceptable as proof:

- generic prestige adjectives
- decorative award-strip treatment without contextual meaning
- unsupported "trusted adviser" type statements

---

## 1) Exact Proposed Shared Improvements

### Improvement A: Biography Opening Hierarchy Standard
- **What changes:** Standardize first paragraph structure to lead with role scope, evaluator relevance, and operating context before broad positioning claims.
- **Why it matters:** First-screen trust currently relies heavily on internal prose quality and can vary by profile.
- **Expected trust impact:** Earlier confidence signal for skim readers; clearer "who/what/why relevant" in first read.
- **Implementation complexity:** Low-medium (editorial + light template guidance).
- **Rollout risk:** Low (content-level change; no layout rework).

### Improvement B: Reduced Marketing Rhetoric Rule
- **What changes:** Replace unsupported superlatives with concrete operating descriptors and evidence-linked statements.
- **Why it matters:** Pattern library and gap audit show rhetoric drift reduces credibility with sophisticated evaluators.
- **Expected trust impact:** Calmer institutional tone; stronger perceived seriousness.
- **Implementation complexity:** Low (copy pass + style checklist).
- **Rollout risk:** Low.

### Improvement C: Proof Visibility Uplift (Shared, Non-Layout)
- **What changes:** Improve proof discoverability through copy hierarchy and ordering in existing trust sections (without moving to custom layouts).
- **Why it matters:** Current proof exists but can feel deferred, especially on mobile.
- **Expected trust impact:** Better claim credibility and reduced reliance on self-assertion.
- **Implementation complexity:** Medium (shared component copy/order updates).
- **Rollout risk:** Low-medium (must avoid clutter).

### Improvement D: Recognition Ordering Standard
- **What changes:** Apply consistent ordering logic for recognitions (highest evaluator relevance first; consistent source order).
- **Why it matters:** Mixed ordering weakens scan confidence.
- **Expected trust impact:** Faster credibility parsing and cleaner authority stack.
- **Implementation complexity:** Low-medium (data/render ordering rule).
- **Rollout risk:** Low.

### Improvement E: Link Label Clarity in Proof/References
- **What changes:** Improve external-proof link labels so they communicate source type and relevance more clearly.
- **Why it matters:** Generic labels reduce evaluator confidence in what a link proves.
- **Expected trust impact:** Better trust-through-transparency and scanability.
- **Implementation complexity:** Low.
- **Rollout risk:** Low.

### Improvement F: CTA Tone Calibration (Procedural, Restrained)
- **What changes:** Keep CTA/contact language neutral, calm, and procedural; remove any residual promotional phrasing.
- **Why it matters:** Contact pathways should signal discretion and operational seriousness.
- **Expected trust impact:** Reinforces institutional confidence; avoids conversion-pressure feel.
- **Implementation complexity:** Low.
- **Rollout risk:** Low.

### Improvement G: Minor Shared Spacing/Hierarchy Cleanup
- **What changes:** Small shared spacing adjustments to improve reading rhythm in text-heavy areas; no composition changes.
- **Why it matters:** Supports density without clutter.
- **Expected trust impact:** More legible authority signals, better scan path.
- **Implementation complexity:** Low-medium.
- **Rollout risk:** Low-medium (requires regression checks).

### Improvement H: Operational Seriousness Emphasis in Bio Bodies
- **What changes:** Encourage specific matter context, jurisdiction/context cues, and execution framing in biography content standards.
- **Why it matters:** Increases practitioner credibility and matter relevance.
- **Expected trust impact:** Higher confidence in real-world capability.
- **Implementation complexity:** Medium (editorial standards + profile updates).
- **Rollout risk:** Low-medium (needs consistency controls).

---

## Anti-Patterns (Phase 1 Prohibited)

Do not introduce any of the following:

- oversized portrait heroics
- decorative rankings or badges
- excessive whitespace as authority signal
- luxury editorial minimalism
- profile-card UI treatment on practitioner pages
- excessive asymmetry
- isolated proof systems disconnected from biography claims
- marketing-led superlatives
- generic "trusted adviser" language
- over-designed restraint (style signaling without evidence utility)

These anti-patterns should be treated as release blockers for Phase 1.

---

## 2) Files/Components Likely Affected

Primary shared components:

- `site/src/components/PersonProfileArticle.astro`
- `site/src/components/PersonTrustSignals.astro`
- `site/src/components/PersonContactCta.astro`
- `site/src/components/PersonPublicContact.astro`
- `site/src/components/PersonProfileContextSections.astro`
- `site/src/components/PersonNewsByline.astro`

Data/copy sources:

- `site/src/data/people-imported.json`
- `site/src/data/people-eeat-extras.json`

Quality/control docs:

- `site/docs/people-bio-references/BIO-IMPROVEMENT-PRINCIPLES.md`
- `site/docs/people-bio-references/LIVE-BIO-ROLLOUT-PLAN.md`

No phase-1 changes expected to routing/indexing architecture beyond existing live profile behavior.

---

## 3) Safe Rollout Order

1. **Editorial rules first**  
   Finalize copy hierarchy + rhetoric reduction guidance.

2. **Proof ordering and labels second**  
   Apply recognition ordering + link-label clarity in shared trust blocks.

3. **CTA tone and contact pass third**  
   Ensure procedural and restrained language across profile contact surfaces.

4. **Minor spacing/hierarchy cleanup fourth**  
   Apply only small shared adjustments after content updates are stable.

5. **Cohort copy pass last**  
   Update bios in controlled batches (partners -> senior associates -> broader cohort), measuring consistency as you go.

---

## 4) Rollback Strategy

General rollback principle: revert in small units aligned to rollout order.

- **Content rollback:** restore previous paragraph copy per profile slug.
- **Proof rollback:** revert recognition ordering/label logic to prior behavior.
- **CTA rollback:** restore previous shared CTA/contact strings.
- **Spacing rollback:** revert minor class/token changes in shared components.

Rollback triggers:

- measurable drop in readability/trust signals in review
- inconsistency across profile types
- any drift toward promotional or decorative behavior

---

## Thin Profile Handling Policy (Phase 1)

Thin profiles are expected and should remain credible without inflation.

Policy:

- Do not force artificial paragraph expansion.
- Do not invent recognitions, publications, or matter claims.
- Keep opening remit/context precise and concrete.
- Use available factual anchors (role, office, expertise, jurisdiction context).
- Ensure restrained contact and clear proof labeling where proof exists.

Thin-profile trust objective:

- maintain credibility through clarity and specificity, not volume.

Thin-profile prohibited behaviors:

- padded copy to simulate authority
- generic prestige language replacing evidence
- custom visual variants for thin profiles in Phase 1

---

## 5) QA Checklist

### Trust and hierarchy
- Opening paragraph answers role/scope/relevance quickly.
- First 2 paragraphs accumulate authority (not repetition).
- Claims have nearby supporting context.

### Tone and credibility
- Superlatives are evidence-backed or removed.
- Language remains calm, institutional, and non-promotional.
- Operational seriousness is explicit but not over-disclosed.

### Proof behavior
- Recognition order is consistent and rational.
- Proof labels are clear and source-informative.
- Proof remains plain (not decorative).

### Consistency and scale
- No profile-specific layout branches introduced.
- Shared components behave consistently across legal/scom/isd/dr profiles.
- Thin-profile handling remains policy-consistent (no artificial inflation).

### Regression
- Desktop and mobile review across representative profile types.
- Link integrity for all proof/reference destinations.
- Test/build pass before deployment.

### Institutional consistency checks
- Shared trust language remains coherent across all profiles.
- Shared hierarchy logic remains stable.
- Shared informational pacing remains consistent.
- Shared seriousness signals remain intact across cohorts.

---

## 6) Mobile-Specific Considerations

### Early proof visibility
- Ensure at least one clear authority signal is visible or strongly implied before deep scroll through heading/copy sequencing.
- Do this without introducing custom mobile-only layouts.

### Biography truncation rhythm
- Paragraph lengths should remain scannable on small screens.
- Avoid dense blocks that collapse into unreadable walls of text.
- Preserve paragraph-function clarity (scope -> context -> evidence).

### Portrait/proof sequencing
- Maintain shared sequence and portrait support role.
- Prevent portrait from displacing authority cues.
- Keep proof cues discoverable soon after opening section without compositional experiments.

---

## 7) Explicitly Deferred Items (Do Not Roll Out Yet)

Deferred to later benchmarked phases:

- first-screen composition redesign to move proof blocks structurally
- portrait treatment changes beyond current shared behavior
- proof system layout redesign (new modules/placements)
- density re-architecture that changes section structure
- profile-type layout variants:
  - highly recognised partners
  - thin profile structural variants
  - non-lawyer custom layouts
  - communications/intelligence custom layouts
- any benchmark-specific spacing logic or editorial asymmetry
- any art-direction-led visual behavior

Reason for deferral:

- These items are higher risk and require additional benchmark validation before safe live adoption.

---

## Institutional Consistency as Primary Metric

Institutional consistency is a core success criterion for Phase 1, not a secondary outcome.

Phase 1 should strengthen:

- shared trust language
- shared hierarchy logic
- shared informational pacing
- shared seriousness signals

Any change that improves one profile but weakens cross-profile consistency should be rejected or deferred.

---

## Approval Note

This scope is ready for approval review as a Phase 1 implementation brief.  
No changes should be implemented until explicit approval is given.
