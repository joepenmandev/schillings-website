# Public Interpretation Analysis — Methodology v1.0

*Working draft. v1.0.0 (proposed). Pillar: Narrative Intelligence. Tool: Headline Risk Assessment.*

---

## Purpose

Estimate how a piece of communication — an email, an internal memo, a press statement, a Slack or WhatsApp message, a public post — would be interpreted across the audiences that *actually shape outcomes*: journalists, employees, investors, activists, regulators, and adjacent stakeholders.

The Analysis is a directional intelligence assessment of *interpretation risk*. It is not a content moderation tool, and it is not a legal review.

---

## Inputs (principal-provided)

- Pasted text content (the artifact being assessed).
- Optional: context (intended audience, channel, deadline, attached relationships).
- Optional: principal identity (used to anchor exposure context if linked to an Audit).
- The platform does not retain pasted content beyond the duration of the session by default.

The platform refuses to assess content that involves named third parties as targets of pejorative framing, content involving minors, or content that itself appears to be illegal.

---

## Output dimensions

Each input produces an Analysis containing:

1. **Worst plausible headline** — the most adverse credible journalistic framing.
2. **Screenshot virality risk** — likelihood that an excerpt circulates outside its intended audience.
3. **Internal leak severity** — likely organisational consequence if the content leaves its intended boundary.
4. **Legal sensitivity** — flags for content that *touches* legally sensitive ground; not a legal review.
5. **Media amplification probability** — likelihood that the artifact, if surfaced, becomes a news cycle rather than a single mention.
6. **Stakeholder fallout risk** — anticipated reactions across the principal's stakeholder map.

---

## Audience interpretation lenses

A core feature: the Analysis renders the same content through several stakeholder lenses, each with a short interpretive paragraph and a band (Benign / Neutral / Tension / Hostile / Disqualifying).

Default lenses:

- Investigative journalist
- Senior employee
- Major investor or board member
- Activist coalition
- Sector regulator
- Adjacent peer or rival

Conditional lenses (gated):

- Family-office staff (Verified Principal tier)
- Plaintiffs' counsel (analyst review tier)
- State-aligned hostile media operator (analyst review tier)

---

## Scoring model

- Each output dimension and each audience lens produces a band, supported by a short interpretive paragraph and a confidence value.
- The Analysis does not produce a single composite score for the artifact, by design — interpretation is plural, not a number.
- A *Composite Tension* indicator is produced as a visual reference only, weighted toward dimensions and lenses with the highest confidence.

---

## Outputs

A standard Schillings Intelligence Report containing:

- **Top-line verdict** — the worst plausible headline and the two most adverse interpretations.
- **Dimension panel** — the six output dimensions with band and short rationale.
- **Audience lens panel** — interpretive paragraphs, one per lens.
- **Confidence panel** — per dimension and per lens.
- **AI provenance disclosure** — which paragraphs are model-inferred vs. analyst-reviewed.
- **Recommended priorities** — operational responses (rephrase, hold, escalate, route to advisor).
- **Linked insights** — explicit cross-tool suggestions, especially to the Executive Exposure Audit and the Narrative Escalation Map.
- **Analyst review CTA** — gated, with SLA.

---

## Confidence model

- Per-dimension confidence is computed from coherence between model output and rule-based linguistic signals.
- Lens-level confidence is reduced when the lens is unusual for the platform (e.g., highly jurisdictional regulator).
- The Analysis suppresses dimensions or lenses where confidence falls below a threshold rather than presenting low-confidence speculation.

---

## Assumptions and explicit limits

- The Analysis assesses *interpretation risk* in the absence of broader context. Where the principal can supply context, the Analysis becomes more accurate.
- The Analysis is not a legal review. Legal sensitivity is a directional flag, not a determination.
- The Analysis is *not* a content moderation tool and does not classify content as acceptable or unacceptable.

---

## Refusal patterns

The Analysis will refuse, with explanation, when:

- The artifact appears to target a named third party with pejorative framing.
- The artifact involves minors as subjects of risk discussion.
- The artifact appears to itself be unlawful (incitement, threats, criminal solicitation).
- The principal supplies sensitive personal data of others without consent.

---

## Peer review

| Reviewer | Affiliation | Date | Status |
|---|---|---|---|
| [TBD] | Media law | | pending |
| [TBD] | Investigative journalism | | pending |
| [TBD] | Behavioural science | | pending |

---

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0-draft | Phase 0 — Week 1 | [Editorial / Methodology] | Initial draft of dimensions, lenses, scoring, refusal patterns. |
