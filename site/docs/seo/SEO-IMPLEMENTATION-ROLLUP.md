# SEO implementation rollup

**Status:** Phased execution guide  
**Governance:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) §11 classification, §12 escalation, §30 PR expectations, Appendix A protected systems

**This document turns** the SEO strategy set **into** sequenced work — with **risk labels** and **explicit boundaries** (no route/slug/redirect/canonical/hreflang/sitemap/JSON-LD architecture changes unless **CRITICAL** programme).

---

## 1. Quick wins (SAFE)

| # | Action | Rationale | Owner |
|---|--------|-----------|-------|
| 1 | **Expertise hub meta** — add one accurate jurisdiction/practice clause per hub (batch in small groups) | Commercial intent capture without H1 churn | SEO + Strategic |
| 2 | **Situation detail meta** — ensure first sentence states *problem in user language* | SERP clarity | SEO + Strategic |
| 3 | **Reciprocal internal links** — situation ↔ expertise (1–2 links) where missing | IA clarity + cannibalization reduction | Engineering + Strategic |
| 4 | **Office page meta** — differentiate office vs contact hub (address vs form) | Geo + intent disambiguation | SEO + Conversion |
| 5 | **Topic archive meta** — phrase as “analysis & commentary” where topics mirror expertise | Soft disambiguation from commercial hubs | SEO + Editorial |

**PR classification:** Mostly **SAFE** to **REVIEW REQUIRED** depending on template breadth.

---

## 2. Highest-impact opportunities (REVIEW REQUIRED)

| # | Opportunity | Expected impact | Dependency |
|---|-------------|-----------------|------------|
| A | **Expertise commercial language** — test richer meta + *selective* title tests on 1–2 hubs | CTR + ranking for money clusters | Strategic + brand approval |
| B | **Situation titles** — problem-first clause; evaluate `| Situations |` tail trade-off | CTR for high-intent problems | Cannibalization monitoring |
| C | **Response System meta** — clarify “legal + intelligence + comms + security” in one line | Abstract query disambiguation | Strategic |
| D | **Profile meta** — office + 2 expertise labels for E-E-A-T snippets | Branded people + long-tail | People owner |
| E | **Internal linking policy** — document anchor text tiers for authors (editorial guideline) | Long-term authority | Editorial |

---

## 3. Highest-risk changes (HIGH RISK / CRITICAL)

| Change | Risk tier | Why |
|--------|-----------|-----|
| Homepage title wholesale rewrite | **HIGH RISK** | Brand + regional positioning |
| Intelligence index title/meta commercialization | **HIGH RISK** | Violates editorial/strategic separation (ADR-002, §59) |
| Contact layout / copy blocks for SEO | **HIGH RISK** | Conversion protected (Appendix A, ADR-003) |
| Universal title formula across families | **HIGH RISK** | Flattens §3 intent |
| JSON-LD graph / hreflang / canonical / routing | **CRITICAL** | Appendix A |

---

## 4. Pages likely underperforming from title/meta *mismatch*

| Surface | Hypothesis | Diagnostic |
|---------|------------|------------|
| Expertise hubs | Titles may under-signal **legal/commercial** intent vs competitors | GSC: high impressions, low CTR for money terms |
| Situation details | Trailing `| Situations | Schillings` may push problem clause out of visible title | CTR tests |
| Response System | Abstract name may hurt naive queries | Branded search + refinement terms |
| WWP detail | Conceptual titles may under-match “asset protection” language | Query gap analysis |
| Topic pages | Topic label without “analysis” may look like service page | Compare vs expertise hub CTR |

**Remedy path:** Meta first → selective title tests → internal links; **not** mass rewrites.

---

## 5. Likely cannibalization clusters (watchlist)

- Reputation / privacy / media / crisis across **Expertise + Situations + WWP + topics**.  
- Office vs Contact geo queries.  
- People vs Expertise for practice names.

**Playbook:** `SEO-CANNIBALIZATION-RISKS.md`.

---

## 6. Phased rollout order

| Phase | Focus | Exit criteria |
|-------|--------|---------------|
| **P0** | Measurement baseline (GSC, rankings export, CTR by template) | Dashboard + URL lists |
| **P1** | SAFE meta + internal links (expertise ↔ situations) | No conversion/layout regressions |
| **P2** | Expertise hub experiments (meta + 1–2 title tests) | +CTR or rollback |
| **P3** | Situation snippet/title tests (batched) | Cannibalization stable |
| **P4** | Editorial guideline for contextual commercial links | Editorial sign-off |
| **P5** | Profile meta enhancements | People + compliance OK |

**Do not** reorder P4 before editorial policy exists — avoids mechanical linking in articles.

---

## 7. Testing plan

1. **Before:** 4-week baseline impressions/CTR/position (Search Console) for templates.  
2. **During:** Single-variable changes per batch where possible.  
3. **After:** 4-week read; compare same weekday windows; watch **secondary URLs** rising (cannibalization).  
4. **Qualitative:** Legal/comms review of any new commercial claims in meta.

---

## 8. Measurement plan

| Metric | Tool | Notes |
|--------|------|-------|
| CTR by page template | GSC | Filter by URL pattern |
| Impressions vs position | GSC | Detect cannibalization |
| Assisted conversions | Analytics (if configured) | Contact funnel |
| Branded SERP stability | Manual + GSC brand queries | Should not regress |
| Crawl errors | Search Console | Unchanged expectation |

---

## 9. Rollback strategy

1. **Git revert** for template changes (titles/meta in code).  
2. **Content-only** rollbacks in CMS/data JSON if copy lives in imports.  
3. **Stop rule:** If Contact CVR drops or editorial bounce rises **without** clear seasonal cause — revert last SEO batch and post-mortem.

---

## 10. Governance alignment checklist (per PR)

- [ ] Affected **families** named (§30)  
- [ ] **§11** level declared  
- [ ] **Family leakage?** (e.g. strategic patterns on editorial)  
- [ ] **Width / prose / CTA** hierarchy unchanged unless approved  
- [ ] **Schema / hreflang / canonical** untouched for SAFE/REVIEW SEO copy PRs  
- [ ] **Legal/comms** on claims in meta  

---

## 11. Review requirements summary

| Tier | Who |
|------|-----|
| **SAFE** | Engineering + SEO (single-surface) |
| **REVIEW REQUIRED** | SEO + owning family (Strategic / Editorial / People / Conversion) |
| **HIGH RISK** | Above + design/comms as needed |
| **CRITICAL** | SEO + engineering + legal for schema/routing |

---

## 12. Document index

| File | Role |
|------|------|
| [`SEO-TITLE-META-STRATEGY.md`](./SEO-TITLE-META-STRATEGY.md) | Title/meta philosophy |
| [`SEO-KEYWORD-INTENT-MAP.md`](./SEO-KEYWORD-INTENT-MAP.md) | Intent + clusters |
| [`SEO-INTERNAL-LINKING-ARCHITECTURE.md`](./SEO-INTERNAL-LINKING-ARCHITECTURE.md) | Links |
| [`SEO-CANNIBALIZATION-RISKS.md`](./SEO-CANNIBALIZATION-RISKS.md) | Overlap |
| [`SEO-SERP-POSITIONING-MATRIX.md`](./SEO-SERP-POSITIONING-MATRIX.md) | SERP roles |
| [`SEO-ENTITY-ARCHITECTURE.md`](./SEO-ENTITY-ARCHITECTURE.md) | Entities |
| [`SEO-GEO-STRATEGY.md`](./SEO-GEO-STRATEGY.md) | Regions |

---

## 13. Revision log

| Date | Change |
|------|--------|
| 2026-05-06 | Initial SEO strategy pack authored |
