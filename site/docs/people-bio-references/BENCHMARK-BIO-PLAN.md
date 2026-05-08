# Benchmark Bio Plan (Hidden Test Profile)

Goal: create a hidden practitioner benchmark profile to test bio patterns from `BIO-IMPROVEMENT-PRINCIPLES.md` without affecting live practitioner pages.

## Hard Constraints

- Benchmark person is fictional.
- Benchmark page is `noindex`.
- Benchmark page is excluded from sitemap.
- Benchmark page is excluded from people directory/navigation.
- Benchmark uses realistic but fake data only.
- Benchmark is safe for pattern experimentation and review.

## Scope Boundary

This plan defines the benchmark test framework only.

- No edits to live practitioner profiles.
- No rollout to real profile templates until criteria are met.
- No production exposure via directory, nav, or search indexing.

## 1) Benchmark Profile Data Specification

Define one synthetic profile record with enough depth to test full pattern stack.

Required fields:

- `slug`: clearly synthetic (e.g., `benchmark-alex-marlow`)
- `name`: plausible but fictional
- `role`: senior practitioner role label
- `office`: one office
- `practiceGroup`: one of existing groups (legal/scom/isd/dr)
- `expertise`: 3-5 relevant expertise tags
- `paragraphs`: 3-4 paragraphs following authority arc
- `imagePath`: portrait placeholder path
- `sameAs`: synthetic external URLs (clearly non-real or internal placeholders)
- `recognitions`: 4-6 fake-but-realistic entries across sources
- optional outputs/publications list in benchmark-specific data extension
- optional representative matter list in benchmark-specific data extension

Data quality requirements:

- Facts must read plausible for elite evaluator expectations.
- Data must be clearly non-real and non-attributable.
- Include enough proof variety to test ranking, publication, and matter texture behavior.

## 2) Hidden Routing and Visibility Controls

Benchmark page must be accessible only by direct URL.

Control requirements:

- route exists under a hidden path (example: `/benchmark/people/[slug]`)
- set explicit `noindex` on benchmark page
- ensure page is omitted from all sitemap generation paths
- do not include in `getAllPeopleSlugs()` used by public people routes
- do not include in people index, search, breadcrumbs, or related profile modules

Verification checklist:

- page does not appear in `/people`
- page does not appear in site nav
- page not emitted in sitemap
- metadata confirms `noindex`

## 3) Benchmark Page Structure (Pattern Test Surface)

Structure should mirror shared practitioner architecture, with controlled benchmark-only toggles for evaluation.

Required structure:

1. identity and remit above fold
2. biography block (3-4 paragraph arc)
3. proof/validation block
4. expertise/context block
5. related intelligence block (if synthetic test items exist)
6. restrained contact block

Rule:

- test behaviors, not one-off visual styling.
- no experimental art direction treatment.

## 4) Proof System Requirements

Benchmark proof system must test plain, high-credibility evidence behavior.

Include:

- recognitions from at least 3 source types (e.g., chambers/legal500/spears-style)
- 2-4 representative matters (anonymized, realistic context)
- 2-3 publications/thought outputs with practical relevance
- 1-2 institutional appointments/memberships where plausible

Proof behavior requirements:

- proof should be near claims (not fully deferred)
- proof should remain plain and scannable
- no decorative badge-only authority treatment

## 5) Portrait Placeholder Requirements

Use a neutral placeholder portrait asset suitable for authority testing.

Requirements:

- realistic professional portrait style
- non-identifiable / synthetic image source
- stable crop behavior for desktop and mobile
- portrait supports identity; never the primary authority signal

Do not:

- use dramatic art-direction crops
- introduce profile-specific visual novelty

## 6) Biography Format Requirements

Benchmark bio must test authority accumulation patterns.

Required format:

- Paragraph 1: role scope + evaluator relevance
- Paragraph 2: operating context + complexity/jurisdiction
- Paragraph 3: evidence-backed capability + representative matters
- Paragraph 4 (optional): publications/thinking linked to practical advisory remit

Writing rules:

- specificity over superlatives
- dense but readable
- no promotional excess
- no confidentially unsafe detail

## 7) Expertise and Context Format

Benchmark should test clarity of practice framing and cross-context orientation.

Include:

- 3-5 expertise tags aligned to role
- related situations/context links (benchmark-safe)
- one concise explanatory line clarifying firmwide vs individual context

Avoid:

- taxonomy overload
- generic links with weak relevance

## 8) Contact Treatment Requirements

Contact behavior should test restrained, procedural routing.

Include:

- neutral contact heading and text
- clear routing path (form/email) in calm language
- separation between proof claims and contact CTA

Avoid:

- pressure language
- marketing conversion framing

## 9) Mobile Requirements

Benchmark must be evaluated on mobile-first trust formation.

Required checks:

- above-the-fold identity and remit remain clear on small screens
- at least one authority signal appears before deep scroll
- proof blocks remain scannable and non-cluttered
- contact treatment stays restrained and readable
- no content collapse that hides core authority signals

## 10) Rollout Criteria (Before Any Real Profile Adoption)

Benchmark can inform future real-profile changes only if all criteria pass.

### A. Trust and Clarity
- first-screen authority improves versus current baseline
- evaluator can identify role, scope, and credibility quickly

### B. Proof Behavior
- proof is visible and adjacent to major claims
- proof remains plain and non-decorative

### C. System Safety
- no one-off layout dependency
- changes are compatible with shared scalable profile architecture

### D. Mobile Integrity
- no material trust degradation on mobile
- no buried authority signals

### E. Governance
- legal/compliance/editorial sign-off on synthetic-data safety
- explicit approval before any translation to live profiles

If any criterion fails, benchmark remains experimental and does not progress.

## 11) Delivery Sequence

1. Create synthetic benchmark data object.
2. Create hidden route and indexing/sitemap exclusions.
3. Assemble benchmark profile page using shared architecture.
4. Populate synthetic proof, matter, and publication blocks.
5. Run desktop/mobile review against principles checklist.
6. Document findings and decision: pass / revise / stop.
