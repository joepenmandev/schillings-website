# Executive AI Misuse Risk — Methodology v1.0

*Working draft. v1.0.0 (proposed). Pillar: Exposure Intelligence. Tool: AI Impersonation Exposure Audit.*

---

## Purpose

Assess the principal's *susceptibility to AI-enabled impersonation, fabrication, and misuse* — including voice cloning, synthetic image and video, fraudulent instruction, and impersonated outreach.

This Index addresses a category of exposure that did not exist five years ago and which a meaningful share of the principal's risk now lives inside.

---

## Inputs (principal-provided)

- Public profile (name, organisation, role).
- Optional: known interview, podcast, and broadcast appearances (URLs).
- Optional: known media archives (TV interviews, conference recordings).
- Optional: family-office or staff representative consent flags.
- The platform does not store voice or video samples; it analyses *availability* and *characteristics*, not content.

---

## Signal categories

The Index is composed of six named sub-indices:

1. **Voice cloning risk** — quantity, quality, and accessibility of voice source material.
2. **Facial replication exposure** — high-quality video and image availability suitable for deepfake training.
3. **Impersonation attractiveness** — adversary motivation factors (organisation profile, signalling authority, financial controls).
4. **Fraud susceptibility** — organisational and personal patterns that increase the success rate of synthetic-media-enabled fraud.
5. **Public media availability** — the *surface area* of media that an adversary could harvest.
6. **AI attack surface** — composite of the above, contextualised for the principal's role and organisation.

---

## Attack plausibility scenarios

A core feature: the Audit produces three to five named, plausible misuse scenarios drawn from a controlled scenario taxonomy. Each scenario is framed as an *archetype*, not as a prediction of any actual event.

Default scenario archetypes:

- Synthetic CEO audio fraud (CFO instruction).
- Fake investor or board call.
- Impersonated journalist outreach.
- Synthetic family member distress fraud.
- Fraudulent executive instruction to a wealth manager or family office.
- Hostile narrative scaffolding using fabricated quotes.

---

## Scoring model

- Each sub-index is a 0-100 score derived from a deterministic-where-possible, model-inferred-where-necessary blend.
- The composite Index is a weighted blend of the six sub-indices.
- Output is rendered as a band (Low / Moderate / Elevated / High / Severe) with the underlying composite shown.
- Confidence is computed at sub-index level and rolled up.

---

## Outputs

A standard Schillings Intelligence Report containing:

- **Top-line summary** — Index band, the two highest-contributing sub-indices, and the most plausible misuse scenario.
- **Sub-index breakdown.**
- **Attack plausibility scenarios** — three to five archetypes with rationale.
- **Confidence panel.**
- **AI provenance disclosure.**
- **Recommended priorities** — operational containment actions (instruction-verification protocols, family-office controls, secondary-channel confirmations, public media posture).
- **Linked insights** — to the Executive Exposure Audit and the Crisis Escalation Forecast.
- **Analyst review CTA** — gated, with SLA.

---

## Confidence model

- Confidence is highest where the principal's media availability is well-mapped.
- Confidence is reduced for scenarios that depend on unobserved organisational factors.
- The Audit suppresses scenarios below a confidence threshold rather than producing low-confidence plausibility.

---

## Assumptions and explicit limits

- The Audit measures *susceptibility*, not probability of harm.
- The Audit does not produce, train, or store synthetic media of any individual.
- The Audit does not name specific adversaries.
- The Audit is jurisdictionally aware but not a substitute for jurisdiction-specific legal or security review.

---

## Refusal patterns

The Audit will refuse, with explanation, when:

- Inputs imply intent to *create* synthetic media.
- Subject is not the requesting principal and no authorised representative consent is on file.
- Scenarios are requested that target named third parties.
- Inputs reference minors as the assessment subject.

---

## Peer review

| Reviewer | Affiliation | Date | Status |
|---|---|---|---|
| [TBD] | AI safety | | pending |
| [TBD] | Security and fraud | | pending |
| [TBD] | Information operations research | | pending |

---

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0-draft | Phase 0 — Week 1 | [Editorial / Methodology] | Initial draft of sub-indices, attack plausibility taxonomy, refusal patterns. |
