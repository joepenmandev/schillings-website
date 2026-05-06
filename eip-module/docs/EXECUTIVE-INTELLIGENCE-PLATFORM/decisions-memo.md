# Decisions Memo — Executive Intelligence Platform

**Status:** draft, awaiting partner sponsor sign-off.
**Owner:** [Partner sponsor — TBD]
**Decision deadline:** end of Phase 0 (Week 1).

The twelve decisions below gate every subsequent phase. Recommended defaults are provided to accelerate the conversation; they are *recommendations, not directives*. Override any of them — but do not leave any unanswered.

---

## 1. Brand architecture

**Question:** Is the platform branded under the Schillings master brand, or is it a sub-brand (e.g., "Schillings Intelligence")?

**Recommended default:** Sub-brand — "**Schillings Intelligence**" — endorsed by the master brand.

**Why:** A sub-brand creates space for premium, intelligence-grade design and language without constraining or being constrained by the firm's existing brand system. It also enables a cleaner narrative for press, advisory board, and partner channels. The master endorsement preserves trust and authority.

**Trade-offs:** A sub-brand requires a marginally larger brand investment (logo lockup, typography, voice).

---

## 2. Platform vs. product family

**Question:** Are we positioning a single platform, or a family of related products?

**Recommended default:** A single platform with named products inside it ("the Schillings Intelligence platform" containing the Executive Exposure Audit, Headline Risk Assessment, etc.).

**Why:** A platform commands higher perceived value, supports cross-tool linking, and aligns with the manifesto's "Digital Executive Infrastructure" thesis. A product family fragments the buying conversation.

**Trade-offs:** Slightly more complex IA; more rigorous cross-product consistency required.

---

## 3. Hosting surface — main site vs. dedicated subdomain

**Question:** Does the platform live at `schillingspartners.com/executive-intelligence-platform/` or at a premium subdomain (e.g., `intelligence.schillingspartners.com`)?

**Recommended default:** Start on the main site under `/executive-intelligence-platform/` and migrate to a subdomain only when there is a clear business reason (e.g., separate auth, separate design system, dedicated client portal).

**Why:** Faster launch, leverages existing SEO authority and operational stack; minimises risk during validation. A subdomain becomes interesting once the gated/monitored experience matures.

**Trade-offs:** Less design freedom early on. We mitigate this with a platform-scoped UI system.

---

## 4. Build vs. partner — data layer

**Question:** Do we build the OSINT and intelligence data layer in-house, or partner with one or two specialist vendors?

**Recommended default:** Hybrid — Schillings owns the methodology, scoring, and analyst layer; we license signals from 2-3 carefully selected vendors (specialist OSINT, deepfake detection, dark-web monitoring) into the corpus.

**Why:** Building competitive intelligence sources from zero is expensive and slow. Partnering accelerates time-to-value. Schillings retains control of the IP that matters: methodology, framing, and analyst review.

**Trade-offs:** Vendor diligence and contractual protections are non-trivial. Must avoid lock-in.

---

## 5. Internal owner

**Question:** Which Schillings partner sponsors the platform's P&L, brand, and risk decisions? Which team owns analyst review operations?

**Recommended default:** A single named partner sponsor with an executive product owner and a small analyst pool seconded from the firm's intelligence and reputation practices for the first 90 days.

**Why:** Without a named partner sponsor, the platform will not get partner adoption — and partner adoption is what makes it real. A small dedicated analyst pool prevents quality drift in the first cohort of reports.

**Trade-offs:** Requires partner time. Necessary, not optional.

---

## 6. AI model strategy

**Question:** Single LLM provider, multi-provider routing with evals, or on-prem option for sensitive engagements?

**Recommended default:** Multi-provider routing with a small eval harness from day one. Reserve on-prem (or VPC-isolated) processing for verified-principal and analyst-review tiers.

**Why:** Multi-provider routing protects against provider outage, model regression, and policy drift. Sensitive engagements demand a higher trust floor than commodity API access.

**Trade-offs:** Slightly more engineering complexity. Worth it for reliability and trust posture.

---

## 7. Security posture target

**Question:** Are we committing to SOC 2 Type II and ISO 27001 readiness, and on what timeline?

**Recommended default:** Yes to both, with SOC 2 Type II readiness inside 12 months of public launch and ISO 27001 inside 18 months.

**Why:** UHNW and corporate buyers expect both. Without them, the platform cannot be sold above a certain price point or to certain buyers (regulated industries, listed companies).

**Trade-offs:** Investment in security operations, controls, and audit. Already aligned with the firm's broader security posture.

---

## 8. Jurisdictional scope

**Question:** Which markets do we serve at launch?

**Recommended default:** UK, US, IE on day 1. DE, MC, UAE, SG in Phase 5+.

**Why:** Day-1 markets align with the firm's current footprint and regulatory posture. Phase 5 markets are where the next wave of UHNW demand sits.

**Trade-offs:** Some demand left on the table at launch. Acceptable for quality control.

---

## 9. Free vs. gated split

**Question:** Where exactly is the line between the free top-line scan and the gated full report?

**Recommended default:**
- **Free:** a top-line risk index, the highest-priority signal categories, and the next-best-assessment recommendation.
- **Gated (lead form):** the full Intelligence Report, signal-by-signal detail, the AI provenance disclosure, and the linked-insights graph.
- **Analyst review (qualified-lead form):** human-reviewed addendum, board-grade Executive Briefing PDF, and partner-bylined optional co-signature.

**Why:** The free tier creates a "wow" moment without giving away the methodology. The gated tier captures qualified intent. Analyst review gates the highest-conversion lead profile.

**Trade-offs:** Funnel must be tuned. Iterate post-launch based on conversion data.

---

## 10. Disclosure policy — third parties

**Question:** How does the platform handle assessments that involve named third-party individuals?

**Recommended default:** Mandatory consent or authorised-representative attestation. The platform refuses to score arbitrary third parties on identifying detail.

**Why:** Assessing a third party without consent creates real defamation, privacy, and reputational risk. The platform's trust posture depends on visible, principled refusal patterns.

**Trade-offs:** Some user requests will be declined. This is a feature, not a bug — and it should be documented in the output safety taxonomy.

---

## 11. Localization strategy

**Question:** Are non-English outputs analyst-reviewed translations, or raw model outputs?

**Recommended default:** Analyst-reviewed translations only, for all languages outside English. Initially limit non-English output to the analyst-review tier.

**Why:** Premium clients in DE, FR, AR, and ZH markets do not tolerate machine-translated risk language. Mistranslation in a legal-adjacent product is a brand-level risk.

**Trade-offs:** Slower to expand. Acceptable for the firm's positioning.

---

## 12. Founding-client cohort criteria

**Question:** Who is invited into the founding-client cohort?

**Recommended default:** A mixed cohort of 5-10 — roughly half corporate (chair, GC, CCO of listed companies and large privates) and half UHNW principals or family offices. Diverse jurisdictions inside the day-1 markets.

**Why:** A mixed cohort calibrates methodology across both buyer profiles, produces stronger case-study material, and accelerates word-of-mouth across both sales motions.

**Trade-offs:** Two motions to manage simultaneously. Manageable at this scale.

---

## Sign-off

| Role | Name | Decision date | Signature |
|---|---|---|---|
| Partner sponsor | | | |
| Product owner | | | |
| Compliance | | | |
| Security | | | |
| Editorial | | | |
| Engineering lead | | | |
