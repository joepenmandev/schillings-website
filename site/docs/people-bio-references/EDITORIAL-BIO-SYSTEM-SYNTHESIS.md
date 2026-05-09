# Editorial Bio System Synthesis

This document summarizes validated editorial and structural patterns observed through the practitioner bio investigation and rollout work. **Governed implementation and approval rules remain defined by the existing doctrine and governance artifacts** (for example `BIO-IMPROVEMENT-PRINCIPLES.md`, `GOVERNANCE-CHANGE-CONTROL.md`, `DOCTRINE-V1-LOCK.md`, `VALIDATION-RUNBOOK.md`, and `IMPLEMENTATION-DECISION-LOG.md`). This file is a **reference synthesis**, not a replacement doctrine layer.

---

## Purpose

Define a scalable, high-trust practitioner bio *editorial model* for institutional advisory firms.

Designed for:

- litigation
- investigations
- reputation
- privacy
- crisis
- regulatory
- strategic advisory environments

**Goal:** Practitioner profiles that:

- form trust quickly,
- feel institution-first,
- remain operationally credible,
- and avoid prestige-performance behavior.

This is a **system lens**, not a redesign style guide.

---

## Core Design Objective

The profile should communicate:

1. who this person advises
2. what environments they operate in
3. why they are credible
4. how to contact them

…with minimal friction and minimal theatricality.

The best result is usually:

- slightly clearer,
- slightly calmer,
- slightly easier to trust,

not dramatically different.

---

## Structural Hierarchy

### Screen one must establish

Before major scrolling, users should understand:

- practitioner identity
- operational remit
- at least one independent credibility signal

If all three are not visible early:

- trust timing weakens,
- especially on mobile.

---

## Recommended information order

### 1. Identity layer

**Required:**

- name
- title
- practice area
- office/location

**Optional:**

- one-line remit summary

**Avoid:**

- slogans
- mission statements
- prestige descriptors

---

### 2. Opening operational paragraph

**Purpose:** Establish the environments this practitioner operates within.

**Good opening structure:**

- matter type
- stakeholder context
- operational pressure
- complexity/risk environment

**Avoid:**

- “leading”
- “renowned”
- “world-class”
- “top-tier”
- “high-profile” without context

**Rule:** The opening paragraph should sound informed, experienced, and operational—not promotional.

---

### 3. Early independent proof

**Recommended placement:** Immediately after the first biography paragraph.

**Purpose:** Reduce trust burden on prose alone.

**Acceptable proof:**

- Chambers
- Legal 500
- industry recognition
- respected editorial recognition
- publications

**Proof rules:**

- factual
- compact
- calm
- adjacent
- non-decorative

**Avoid:**

- badge walls
- oversized rankings
- animated proof systems
- prestige-performance UI

---

### 4. Biography continuation

**Purpose:** Accumulate authority gradually.

**Recommended rhythm:**

- short paragraphs
- one operational theme per paragraph
- readable scan cadence

**Suggested themes:**

- representative work
- investigations/disputes
- cross-border matters
- stakeholder management
- sector exposure
- institutional leadership
- publication/media dynamics

---

## Density rules

### Paragraph density

**Preferred:**

- 3–5 lines per paragraph on desktop
- 2–4 lines visible on mobile

**Avoid:**

- dense authority walls
- giant uninterrupted biographies

---

### Proof density

**Recommended:**

- 3–5 high-quality proof items maximum

Too much proof:

- weakens credibility,
- feels performative,
- reduces scanability.

---

## Portrait rules

Portraits should **support** credibility, not dominate it.

**Preferred:**

- calm
- neutral
- editorial-professional
- consistent treatment

**Avoid:**

- cinematic lighting
- luxury-fashion energy
- dramatic cropping
- founder-brand photography

---

## Mobile trust rules

Mobile is the primary trust environment.

The page should:

- establish credibility before the second major scroll
- avoid excessive biography before validation
- avoid oversized portrait dominance
- maintain readable paragraph rhythm

Most trust degradation occurs through:

- delayed proof,
- dense openings,
- or overlong hero sections.

---

## Section rhythm

**Recommended pacing:**

1. Identity
2. Operational opener
3. Independent proof
4. Biography continuation
5. Recognition/publications
6. Contact pathway

This rhythm generally produces:

- faster trust formation,
- better scanability,
- and stronger institutional calm.

---

## Contact pathway rules

Contact should feel:

- operational,
- available,
- restrained.

**Avoid:**

- conversion language
- “book a consultation”
- marketing-style prompts
- urgency framing

---

## Anti-patterns

Avoid:

- luxury editorial minimalism
- asymmetry as authority signaling
- prestige inflation
- oversized whitespace as seriousness signal
- decorative proof systems
- personal-brand energy
- benchmark mimicry
- profile-specific visual systems
- aggressive “premium” behavior

---

## Thin profile rules

Weak/thin profiles should:

- become clearer,
  not louder.

**Use:**

- operational specificity
- shorter structure
- calmer language
- simpler proof

**Do not** compensate with:

- inflated rhetoric
- prestige adjectives
- excessive layout treatment

---

## Governance principle (editorial)

Every **proposed** change should answer:

“What measurable trust friction does this solve?”

If the answer is unclear: do not treat this synthesis as justification to change the governed system without the normal approval path.

---

## Operating principle

The strongest institutional practitioner systems usually succeed because they **remove friction**, not because they add performance.

Restraint is part of the trust model.

---

## Staging draft template (live preview)

To review copy and rhythm in the **real shared profile layout** before any live rollout:

- **URL path:** `/benchmark/people/alex-hartwell/`
- **Edit:** `site/src/pages/benchmark/people/alex-hartwell/index.astro` (fictional `benchmarkPerson` only)
- **Isolation:** `noindex`, not in the people directory, excluded from the HTML sitemap (see `page-route-discovery-core.ts`)

That page uses `PersonProfileArticle` with **early independent proof after the first biography paragraph**, matching the constrained sequencing used on the approved cohort profiles.
