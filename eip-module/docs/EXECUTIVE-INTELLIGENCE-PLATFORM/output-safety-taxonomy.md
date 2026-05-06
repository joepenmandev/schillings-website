# Output Safety Taxonomy

*Working draft. v0.1.*

This is a binding internal document. Every AI output, every analyst-reviewed addendum, and every published Schillings Intelligence artifact must conform.

The taxonomy classifies content into three categories:

- **Permitted.** Content the platform may produce.
- **Conditional.** Content the platform may produce only under defined conditions, often gated to specific tiers (verified principal, analyst review, partner co-signature).
- **Prohibited.** Content the platform must never produce, under any circumstances.

The **AI red-line agent** is the last-mile gate that enforces this taxonomy on every generated output before it reaches a user.

---

## Permitted

The platform may produce:

- Risk assessments scoped to the principal who initiated the request, or to a third party for whom an authorised representative has provided attested consent.
- Signal-level disclosures (which categories of public data, AI visibility, narrative posture, or crisis posture contribute to the assessment).
- Confidence bands, named assumptions, and explicit limits.
- Recommended priorities phrased as operational actions (containment, communications, engagement of advisors).
- Adversary archetypes drawn from the Threat Actor Library, with explicit framing as archetypes, not named individuals.
- References to publicly available facts about the principal that the principal has either provided or that are demonstrably in the public record.
- Cross-tool linking suggestions with explicit reasons.
- AI provenance disclosures (which signals are deterministic, model-inferred, or analyst-reviewed).

---

## Conditional

The platform may produce, only under the stated conditions:

| Content | Condition |
|---|---|
| Detailed personal-data exposure findings | Verified Principal tier or analyst-review tier only. |
| Sector-, jurisdiction-, or matter-specific risk framings | Methodology v1.0 or higher applies; reviewer named. |
| Cinematic scenario dramatisations | Only as part of the Scenario Library, never embedded in personalised reports. |
| References to ongoing matters, regulatory actions, or media coverage involving named third parties | Only if the third party is on the public record AND the framing meets editorial review AND no derogatory inference is asserted. |
| Quantitative comparison to peer cohort | Internal benchmark database active and the principal has opted in. |
| Partner-bylined output | Named Schillings partner has personally reviewed and signed. |
| Region-specific regulatory commentary | Reviewed by a partner in the relevant practice; explicit non-advice disclaimer attached. |
| Discussion of family members | Only with attested consent from each named family member, or if treated in aggregate ("family exposure footprint") without individual attribution. |
| Crisis war-room outputs | Live engagement contract in place; analyst on call; SLA active. |

---

## Prohibited

The platform must never produce:

- Legal advice, regulatory advice, or any content that could be reasonably understood as such.
- Conclusions that a third party has committed an unlawful, unethical, or otherwise actionable act, regardless of how the inputs were framed.
- Identification of named individuals as adversaries, hostile actors, threat actors, or perpetrators.
- Content involving minors as subjects of risk analysis.
- Content involving sensitive personal data (health, sexual orientation, religion, immigration status, biometric data) unless the principal has explicitly volunteered the data and given written consent for its use in the assessment.
- Predictions presented with certainty greater than the underlying evidence supports.
- Speculation framed as fact.
- Recommendations that would constitute interference with a regulatory or judicial process.
- Recommendations that direct retaliatory action against another individual or organisation.
- Content reflecting protected-characteristic stereotypes.
- Direct quotations from internal Schillings matters, even anonymised, without partner approval.
- Content that names existing Schillings clients without their explicit consent.
- Comparisons of one client to another by name.
- Synthetic media of real individuals, including synthetic voice, image, or text impersonation.

---

## Refusal patterns

When the platform cannot fulfil a request, it must do so in a way that preserves trust. The voice of refusal is not a chatbot's. It is the voice of a senior advisor explaining a principled limit.

### Required elements of every refusal

1. Acknowledge the request precisely (not generically).
2. Explain the principle that prevents the response.
3. Offer a constructive alternative path (analyst review, scenario library, methodology page, advisory conversation).

### Sample refusal

> "Schillings Intelligence does not produce personalised assessments of individuals other than the principal who initiated the request. To produce a meaningful exposure picture for [named third party], an authorised representative would need to attest to consent. If this concerns an active matter, request analyst review and a Schillings partner will return signed observations within the published SLA."

---

## Operationalisation

- Every prompt to a foundation model includes a system block summarising this taxonomy.
- Every output is run through the AI red-line agent before display.
- Refusals are logged and periodically audited for false positives and false negatives.
- Editorial and Compliance jointly own this document. Updates are versioned and trigger a red-team pass.

---

## Versioning

| Version | Date | Editor | Change |
|---|---|---|---|
| 0.1 | Phase 0 — Week 1 | Editorial | Initial draft. |
