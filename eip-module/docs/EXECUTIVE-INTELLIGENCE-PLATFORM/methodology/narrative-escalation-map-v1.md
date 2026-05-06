# Narrative Escalation Map — Methodology v1.0

*Working draft. v1.0.0 (proposed). Pillar: Narrative Intelligence. Tool: Narrative Warfare Analyzer.*

---

## Purpose

Trace how a current narrative — an article, a thread, an interview, a campaign — could plausibly evolve over the next 7-30 days, and identify the pressure points and amplification vectors most likely to drive that evolution.

The Map is a *predictive intelligence assessment*, not a forecast. It estimates the *shape* of escalation, not the certainty of it.

---

## Inputs (principal-provided)

- Pasted source content (article, thread, interview transcript, public statement).
- Optional: principal identity (anchors the Map to a known exposure profile).
- Optional: relevant adversary archetypes from the Threat Actor Library to overlay.
- The platform does not retain pasted content beyond the session by default.

---

## Output dimensions

The Map produces:

1. **Adversarial framing analysis** — the dominant adversarial framings present or latent in the source.
2. **Pressure points** — specific assertions, omissions, or characterisations most likely to be exploited downstream.
3. **Emotional triggers** — the primary affective registers the source activates and how they amplify or attenuate.
4. **Escalation pathways** — plausible routes the narrative may take across days 1-7, 7-14, 14-30.
5. **Narrative vectors** — the actor types most likely to carry the narrative (investigative outlets, opinion outlets, sector trades, partisan outlets, social-platform-native amplifiers).
6. **Amplification likelihood** — modelled probability that the narrative ascends to wider attention rather than fading.
7. **Likely next headlines** — three to five plausible follow-on headlines, each with a confidence value.

---

## Adversary lens

The Map can be re-rendered through one or more named Threat Actor archetypes (e.g., activist coalition, hostile state-aligned media operator, AI-augmented fraud ring). The same source content is reinterpreted as that archetype would frame and amplify it.

Adversary archetypes are explicit archetypes drawn from the Threat Actor Library and are *never* identifications of named individuals or organisations.

---

## Scoring model

- Each pressure point and each narrative vector receives a band (Latent / Active / Amplifying / Dominant).
- Each likely next headline carries a probability band and a confidence band.
- Amplification likelihood is rendered as a probability range, not a point estimate.
- The Map does not produce a single composite Index. The shape of escalation is the output.

---

## Outputs

A standard Schillings Intelligence Report containing:

- **Top-line synthesis** — the dominant framing and the most likely escalation pathway.
- **Pressure-point panel** — itemised, ranked.
- **Vector panel** — actor types with band and rationale.
- **Headline preview** — the predicted next headlines, with probabilities and confidences.
- **Adversary lens panel** — when invoked.
- **Confidence panel** — at the dimension level.
- **AI provenance disclosure** — which sections are deterministic, model-inferred, or analyst-reviewed.
- **Recommended priorities** — three actions calibrated to escalation pathway.
- **Linked insights** — to the Executive Exposure Audit and the Crisis Escalation Forecast.
- **Analyst review CTA** — gated, with SLA.

---

## Confidence model

- Confidence is highest for short-horizon predictions (days 1-7) and decays over the 14-30 day window.
- Confidence is reduced for niche or unusual sectors, jurisdictions, or actor types.
- Headline previews are explicitly labelled as *plausible*, not predicted.

---

## Assumptions and explicit limits

- The Map describes *plausible* evolution, not deterministic outcomes.
- The Map cannot anticipate exogenous events (breaking news, regulatory action) that would re-anchor the narrative.
- The Map is jurisdictionally aware but not jurisdiction-specific.
- The Map does not name third-party individuals as adversaries.

---

## Refusal patterns

The Map will refuse, with explanation, when:

- The source content targets named third parties with pejorative framing as a basis for further amplification analysis.
- The source content is itself unlawful.
- The principal requests amplification *guidance* against another individual or organisation.

The platform will also refuse to *generate* hostile content under any circumstances.

---

## Peer review

| Reviewer | Affiliation | Date | Status |
|---|---|---|---|
| [TBD] | Investigative journalism | | pending |
| [TBD] | Behavioural science | | pending |
| [TBD] | Information operations research | | pending |

---

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0-draft | Phase 0 — Week 1 | [Editorial / Methodology] | Initial draft of dimensions, vectors, adversary lens, confidence model. |
