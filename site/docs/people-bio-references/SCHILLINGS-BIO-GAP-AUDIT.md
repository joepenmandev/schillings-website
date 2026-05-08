# Schillings Bio Gap Audit

Purpose: compare current Schillings practitioner profile pages against behavior patterns in `PATTERN-LIBRARY.md`.

## Scope and Constraint

- Phase: observation and gap classification only
- No implementation in this document
- Date: 2026-05-08

## Sample Audited

Primary benchmark:
- `jenny-afia` (legal, partner)

Additional required profile types:
- legal profile: `ben-hobbs`
- communications profile: `victoria-obyrne`
- intelligence/security profile: `abby-stanglin`
- thinner profile: `emily-white` (bio under thin threshold)

System context reviewed:
- shared profile renderer and sections in `PersonProfileArticle.astro`
- trust/proof section in `PersonTrustSignals.astro`
- contact modules in `PersonPublicContact.astro` and `PersonContactCta.astro`
- related content sections in `PersonProfileContextSections.astro` and `PersonNewsByline.astro`
- thin-profile rule in `person-profile-quality.ts`

## Classification Legend

- **HV/LR** = high value / low risk
- **HV/MR** = high value / medium risk
- **RNB** = risky / needs benchmark
- **DND** = do not do

## Lens-by-Lens Gap Audit

### 1) First-screen authority

Current state:
- Shared first-screen is consistent: name, byline, office, portrait, then biography.
- For thin profiles, expertise chips appear near top.

Gap:
- Independent proof is not surfaced in first-screen; recognitions appear later in `PersonTrustSignals`.

Classification:
- **HV/LR**

Rationale:
- Pattern library emphasizes early trust cues and proof adjacency. Current structure delays validation, especially for skim readers.

---

### 2) Portrait behaviour

Current state:
- Portrait is stable and secondary to identity text.
- Shared square crop and sticky desktop behavior provide consistency.

Gap:
- Little role-based calibration for portrait relevance; all profiles effectively use same portrait weight regardless of proof depth.

Classification:
- **HV/MR**

Rationale:
- Strong consistency is already a strength; over-adjustment risks reintroducing special-case behavior.

---

### 3) Proof visibility

Current state:
- Recognitions and external references are present in a dedicated trust block.
- Jenny has strong recognitions in data (Band 1 / Hall of Fame / Spear's), but they are below biography.

Gap:
- Proof is discoverable but not adjacent to first claims.
- Thin profiles can feel under-validated if users do not scroll into trust block.

Classification:
- **HV/LR**

Rationale:
- The gap is primarily sequencing, not missing data for key profiles.

---

### 4) Biography density

Current state:
- Jenny and Ben have multi-paragraph bios with role scope and matter context.
- Emily White (thin profile) has one short paragraph with narrow texture.

Gap:
- Density varies widely; some profiles have compact but specific evidence, others remain sparse and assertion-led.
- Paragraph-function discipline is inconsistent across cohort.

Classification:
- **HV/MR**

Rationale:
- Improving density model requires editorial governance and may affect tone consistency if not benchmarked.

---

### 5) Practice/expertise framing

Current state:
- Expertise taxonomy is clear and linked through shared sections.
- Thin profiles get top-level expertise chips, which helps orientation.

Gap:
- Expertise framing is mostly taxonomy-driven and can feel abstract relative to immediate practitioner remit.
- Practice tags are not always paired with role-specific operating context in opening lines.

Classification:
- **HV/LR**

Rationale:
- Existing structure already supports this; issue is phrasing and ordering.

---

### 6) External validation

Current state:
- `people-eeat-extras.json` includes strong recognition coverage for many key profiles.
- Trust section also includes directories and additional references.

Gap:
- Validation appears as a separate section, not integrated into biography arc.
- Profiles with limited recognitions rely on firm-level directory links, which are weaker for individual authority.

Classification:
- **HV/MR**

Rationale:
- High value, but requires careful policy so recognition hierarchy remains compliant and non-promotional.

---

### 7) Contact tone

Current state:
- Contact language is restrained and procedural.
- Public contact + CTA are separated from authority claims, aligned with pattern library.

Gap:
- Near-term gap is minor; the main issue is consistency between direct email/social strip and CTA for thin vs non-thin confidence states.

Classification:
- **HV/LR** (small optimization category)

Rationale:
- Baseline is already strong; avoid over-optimizing into pressure-based language.

---

### 8) Related content

Current state:
- Non-thin profiles include helps/situations/expertise cross-links and related intelligence.
- Thin profiles skip context sections due to `isThinProfile` path.

Gap:
- Thin profile pathway can reduce authority accumulation because contextual scaffolding is removed.

Classification:
- **HV/MR**

Rationale:
- Restoring context for thin profiles without inventing claims requires careful, benchmarked rules.

---

### 9) Page consistency

Current state:
- Shared architecture is now fully consistent (including Jenny reverting to standard path).
- Shared modules enforce stable spacing, hierarchy, and composition rhythm.

Gap:
- Consistency in page structure is high, but content quality consistency is lower (opening precision, proof adjacency, density).

Classification:
- **HV/LR**

Rationale:
- Major systemic strength now exists; remaining gap is editorial standardization.

---

### 10) Mobile behaviour

Current state:
- Mobile uses single-column flow: identity, portrait, biography, then proof/contact/related sections.
- Trust and validation remain below fold on smaller screens.

Gap:
- Mobile first-screen has weaker trust formation because strongest external validation appears later.
- Thin profile mobile journeys are especially sparse.

Classification:
- **HV/MR**

Rationale:
- Mobile sequencing changes can materially affect trust but need benchmarked testing to avoid clutter.

## Profile Notes Against Pattern Library

### Jenny Afia (primary benchmark)

Strengths:
- Strong first paragraph remit clarity and operating context.
- High-quality external recognitions available.
- Institutional tone is measured, not sales-led.

Gaps:
- Early authority relies on internal prose; independent proof is delayed.
- Mixed-proof stack exists but is section-separated.
- No representative matter examples block; expertise is asserted more than evidenced in-flow.

Classification summary:
- first-screen authority: **HV/LR**
- proof adjacency: **HV/MR**
- matter texture: **RNB** (requires benchmark protocol to avoid disclosure risk)

### Ben Hobbs (legal profile)

Strengths:
- Role and scope are clear; includes dual qualification and cross-office signal.
- Includes ranked/list mention in biography and recognitions data.

Gaps:
- Some "leading" language appears before dense proof.
- Could benefit from more concrete operating texture in paragraph sequencing.

Classification summary:
- biography rhythm consistency: **HV/MR**
- specificity over superlatives: **HV/LR**

### Victoria O'Byrne (communications profile)

Strengths:
- High-authority background with named senior roles and long experience.
- External validation exists (Spear's, PR Week reference in copy).

Gaps:
- Biography can trend prestige-listing heavy; proof is strong but narrative can feel stacked.
- Practice framing is broad; evaluator-specific role function is less explicit up front.

Classification summary:
- authority density calibration: **HV/MR**
- promotional drift control: **HV/LR**

### Abby Stanglin (intelligence/security profile)

Strengths:
- Operational seriousness and domain context are clear.
- Direct ranking signal present in biography and recognition data.

Gaps:
- High-density first paragraph compresses many claims; readability under skim may drop.
- Evidence types are present but can be better distributed across paragraph functions.

Classification summary:
- paragraph function discipline: **HV/MR**
- dense-not-noisy editing: **HV/LR**

### Emily White (thinner profile)

Strengths:
- Specific geopolitical and regional context.
- Clear role and practice group metadata from system.

Gaps:
- Thin profile pathway omits context sections and reduces authority accumulation opportunities.
- Minimal proof visibility and limited first-screen trust signal depth on mobile.

Classification summary:
- thin-profile authority scaffold: **RNB**
- preserve sparse profiles without overclaiming: **DND** for forcing artificial depth

## Consolidated Gap Register

| Gap ID | Gap | Primary Lens | Class | Notes |
|---|---|---|---|---|
| G1 | Independent proof appears too late in page flow | First-screen authority / mobile | HV/LR | Especially impacts skim readers and mobile |
| G2 | Claim-to-proof adjacency is inconsistent | Proof visibility | HV/MR | Data exists but sequencing and integration vary |
| G3 | Paragraph function discipline varies by profile | Biography density | HV/MR | Strong in some profiles, weak in others |
| G4 | Thin profile pathway under-accumulates trust | Related content / mobile | RNB | Needs benchmarked handling to avoid overloading thin pages |
| G5 | Occasional prestige-adjective drift | Institutional tone | HV/LR | Replace with factual specificity where possible |
| G6 | Practice taxonomy can outpace role context | Practice framing | HV/LR | Keep taxonomy but tighten evaluator-relevant context |
| G7 | Overlong proof lists risk noise | Proof systems | DND | Do not replicate long quote dump behavior |
| G8 | Visual/layout special cases for individuals | Page consistency | DND | Keep shared architecture; no profile-specific layouts |

## Priority View (Observation-Only)

### HV/LR
- Bring one independent validation cue earlier in profile journey.
- Tighten opening line precision (role + scope + context).
- Standardize specificity over superlatives editorial rule.
- Improve practice framing clarity without changing architecture.

### HV/MR
- Improve claim-to-proof adjacency inside biography flow.
- Normalize paragraph function discipline (scope -> context -> proof).
- Improve mobile trust sequencing where below-fold validation is currently delayed.
- Calibrate dense profiles to stay evidence-rich but scannable.

### RNB
- Thin profile trust scaffolding strategy (how much context to add without overreach).
- Matter-texture enhancement policy with confidentiality and compliance guardrails.

### DND
- Do not reintroduce profile-specific layout branches.
- Do not use long testimonial/quote dumps as primary proof surface.
- Do not force artificial biography expansion on thin profiles.
