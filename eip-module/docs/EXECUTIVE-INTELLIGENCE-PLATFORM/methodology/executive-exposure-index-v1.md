# Executive Exposure Index — Methodology v1.0

*Working draft. v1.0.0 (proposed). Pillar: Exposure Intelligence. Tool: Executive Exposure Audit.*

---

## Purpose

Quantify, in a single composite Index, the *modern executive exposure surface* of a principal: the union of public-data footprint, AI visibility, family exposure, executive traceability, deepfake vulnerability, search-index exposure, data-leak presence, and reputation attack surface.

The Index is a directional intelligence assessment, not a probability of harm. It is a *posture* signal — closer in spirit to a credit rating or an ASV score than to a forecast.

---

## Inputs (principal-provided)

- Full name (legal and known publicly used variants).
- Current organisation and role.
- Email address (used only for assessment delivery; not retained by default).
- Optional: linked profiles (LinkedIn, X, primary social, primary professional sites).
- Optional: primary domain (personal site, family-office domain, foundation domain).
- Optional: jurisdictions of residence and primary travel.
- Optional: family-office or staff representative consent flags.

The platform refuses to ingest sensitive personal data (health, sexual orientation, religion, immigration status, biometric data) unless explicitly volunteered with written consent.

---

## Signal categories

The Index is composed of eight named signal categories, each a sub-index in its own right:

1. **AI Visibility** — extent to which the principal appears in foundation-model knowledge graphs and outputs.
2. **Public Exposure** — open-web footprint: news, interviews, podcast appearances, regulatory filings, open registries.
3. **Family Exposure** — exposure of named family members, where consent permits assessment.
4. **Executive Traceability** — ease with which a knowledgeable adversary could reconstruct the principal's daily, weekly, or annual operating pattern from public sources.
5. **Deepfake Vulnerability** — quantity, quality, and accessibility of voice and image source material.
6. **Search Index Exposure** — first-page search posture, including hostile content prevalence.
7. **Data Leak Presence** — appearance of the principal's identifiers in known breach corpora.
8. **Reputation Attack Surface** — narrative posture indicators that increase susceptibility to coordinated reputational pressure.

---

## Scoring model

- Each signal category produces a 0-100 sub-index, derived from a deterministic-where-possible, model-inferred-where-necessary, weighted blend of underlying signals.
- The composite Index is a weighted blend of the eight sub-indices. Weights are documented and versioned.
- The output is rendered as a band (Low / Moderate / Elevated / High / Severe) with the underlying composite shown.
- Confidence is computed at the signal level and rolled up to the composite level.

The full weighting table and signal definitions are maintained in the methodology repository under `signals/` and are subject to peer review.

---

## Outputs

A standard Schillings Intelligence Report containing:

- **Top-line summary** — Index band and the two highest-contributing sub-indices.
- **Sub-index breakdown** — the eight categories with band, score, and contributing signals.
- **Adversary lens (optional)** — the same posture viewed through one or more Threat Actor archetypes.
- **Confidence panel** — confidence band, named assumptions, largest unknown.
- **AI provenance disclosure** — which signals are deterministic, model-inferred, or analyst-reviewed.
- **Recommended priorities** — three operational actions, in order of urgency.
- **Linked insights** — explicit suggestions to next assessments, each with a stated reason.
- **Analyst review CTA** — gated, with SLA messaging.

---

## Confidence model

- Each signal carries a per-signal confidence value.
- Sub-index confidence is the lower-bound of contributing signal confidences, adjusted for coverage.
- Composite confidence is the lower-bound of sub-index confidences, adjusted for the proportion of signals that were model-inferred without deterministic anchor.
- Reports never present the composite Index without the composite confidence.

---

## Assumptions and explicit limits

- The Index measures *posture*, not probability of harm.
- The Index is sensitive to data freshness; signals decay according to documented half-lives.
- The platform does not have access to non-public corporate data unless the principal volunteers it.
- The platform does not assess third parties; family signals depend on consent.
- The Index is jurisdictionally aware but not a substitute for jurisdiction-specific legal review.

---

## Refusal patterns

The Audit will refuse, with explanation, when:

- The subject is not the requesting principal and no authorised representative consent is on file.
- Inputs include sensitive personal data without consent.
- Inputs reference minors as the assessment subject.
- Inputs imply intent to use the assessment for retaliation or interference with a legal or regulatory process.

---

## Peer review

| Reviewer | Affiliation | Date | Status |
|---|---|---|---|
| [TBD] | Privacy law | | pending |
| [TBD] | AI safety | | pending |
| [TBD] | OSINT | | pending |

Peer review must be complete before v1.0 is considered authoritative. Until then the Audit operates under v1.0-draft labelling.

---

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0-draft | Phase 0 — Week 1 | [Editorial / Methodology] | Initial draft of signals, scoring, confidence model, refusal patterns. |
