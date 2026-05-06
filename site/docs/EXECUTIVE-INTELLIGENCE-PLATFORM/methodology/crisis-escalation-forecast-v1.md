# Crisis Escalation Forecast — Methodology v1.0

*Working draft. v1.0.0 (proposed). Pillar: Crisis Intelligence. Tool: Reputation Crisis Simulator (and First 72 Hours Simulator).*

---

## Purpose

Given a hypothetical or actual incident scenario, simulate the most plausible 72-hour trajectory of public attention, stakeholder reaction, and operational pressure — including where escalation accelerates, where it plateaus, and where intervention has the greatest leverage.

The Forecast is a *boardroom-grade simulation*. It is not a forecast in the meteorological sense, and it is not a substitute for a live crisis response.

---

## Inputs (principal-provided)

- Scenario description in plain language (executive scandal, leak, activist campaign, whistleblower, affair, regulatory issue, employee controversy, AI impersonation event, etc.).
- Optional: principal identity (anchors the simulation to known exposure context).
- Optional: organisational context (sector, listed/private status, jurisdictions).
- Optional: existing crisis response posture (in-house team, retained advisors).
- The platform does not retain scenario inputs beyond the session by default.

---

## Output dimensions

The Forecast produces:

1. **Likely first headlines** — three to five plausible early headlines, with confidences.
2. **First 72 hours timeline** — segmented into 0-2h, 2-6h, 6-24h, 24-48h, 48-72h, with anticipated dominant events in each window.
3. **Investor and board concerns** — anticipated escalation in financial/governance audiences.
4. **Media escalation speed** — modelled tempo from initial mention to peak attention.
5. **Stakeholder response map** — for the principal's likely stakeholder set.
6. **Reputational severity index** — banded composite of the above, with confidence.
7. **Intervention leverage points** — where pre-incident, intra-incident, and post-incident actions plausibly change the curve.

---

## Recommended first response priorities

A first-class output, rendered as operational priorities (containment, communications, stakeholder engagement). Explicit framing:

- **Not legal advice.** Where legal exposure is implicated, the Forecast routes the principal to Schillings's legal practice.
- **Not media advice in the campaign sense.** The Forecast suggests *direction* — not specific public statements.

---

## Crisis War-Room Mode (gated)

When invoked under a live engagement contract, the Forecast becomes a War-Room artefact. Inputs become continuous; analysts are on-call; the Forecast updates as events evolve. Outputs are timestamped and signed.

War-Room Mode is gated behind contract and SLA. It is *not* a self-serve tier.

---

## Scoring model

- Each window in the 72-hour timeline receives a band (Quiet / Activating / Escalating / Peaking / Receding).
- Stakeholder response is rendered as banded reaction per audience.
- The Reputational Severity Index is a banded composite with explicit confidence.
- Intervention leverage points are ranked, not scored.

---

## Outputs

A standard Schillings Intelligence Report containing:

- **Top-line synthesis** — the most likely 72-hour shape and severity band.
- **Headline preview** — likely first headlines with confidences.
- **Timeline panel** — windowed, with anticipated dominant events.
- **Stakeholder response map.**
- **Reputational severity index.**
- **Intervention leverage points** — operational, ranked.
- **Recommended first response priorities** — the most-shared section.
- **Confidence panel** — at the window and dimension level.
- **AI provenance disclosure.**
- **Linked insights** — to Public Interpretation Analysis (for any communications drafted) and Narrative Escalation Map (for downstream narrative shape).
- **Analyst review CTA** — gated, with SLA. War-Room CTA shown only when active engagement is in place.

---

## Confidence model

- Confidence is highest for the 0-24h window; decays through 24-72h.
- Confidence is reduced where the scenario is unusual for the principal's sector or jurisdiction.
- The Forecast suppresses content below a confidence threshold rather than producing speculative timelines.

---

## Assumptions and explicit limits

- The Forecast is a *simulation* of one plausible trajectory. Reality may diverge.
- The Forecast is bounded to 72 hours by design; longer-horizon analysis requires continuous monitoring.
- The Forecast is jurisdictionally aware but not a substitute for jurisdiction-specific legal review.
- The Forecast does not predict the actions of named third parties.

---

## Refusal patterns

The Forecast will refuse, with explanation, when:

- The scenario explicitly targets a named individual with assertions of wrongdoing.
- The scenario involves minors as subjects.
- The scenario implies intent to retaliate, intimidate, or interfere with a regulatory or judicial process.

---

## Peer review

| Reviewer | Affiliation | Date | Status |
|---|---|---|---|
| [TBD] | Crisis communications | | pending |
| [TBD] | Securities and governance | | pending |
| [TBD] | Behavioural science | | pending |

---

## Change log

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0-draft | Phase 0 — Week 1 | [Editorial / Methodology] | Initial draft of windows, dimensions, War-Room gating, refusal patterns. |
