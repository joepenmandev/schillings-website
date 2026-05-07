# SEO cannibalization risks

**Status:** Audit + mitigation playbook  
**Governance:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) §3; ADR-002 strategic vs editorial separation

**Definition (here):** Multiple URLs on the same property compete for **the same primary query intent** in a **harmful** way — Google oscillates rankings, CTR fragments, or the *wrong* page wins for the firm’s commercial goals.

**Note:** Some overlap is **healthy** (problem page + service page + proof article) when roles are **clear** and internal links signal hierarchy.

---

## 1. Risk register

### R1 — Reputation: Expertise hub vs Situation vs WWP vs Intelligence topic

| Field | Detail |
|-------|--------|
| **Severity** | **High** (commercial + editorial overlap) |
| **Overlap signals** | Shared vocabulary: reputation, defamation, privacy, media, crisis. |
| **Affected routes** | `/expertise/reputation-privacy/` (slug per ADR-001), `/situations/*` with reputation/media angles, `/what-we-protect/reputation/`, `/news/topic/*`, articles. |
| **Healthy vs harmful** | **Healthy:** Situation = *problem*, Expertise = *capability*, WWP = *stake*, Article = *proof*. **Harmful:** All four use near-identical titles/meta for “reputation management lawyers UK”. |
| **Mitigation** | **Title/meta differentiation** (see `SEO-TITLE-META-STRATEGY.md`); **internal links** from situation → expertise; topic pages clarify “analysis” not “hire us here”; **do not** mass-tune articles to money keywords. |
| **Mitigation tools** | Title/meta (REVIEW), contextual links (SAFE–REVIEW), **not** redirects/canonical (immutable). |

---

### R2 — Privacy: Expertise vs Situations vs WWP “Privacy”

| Field | Detail |
|-------|--------|
| **Severity** | **High** |
| **Overlap** | “Privacy” spans legal rights, personal safety, online abuse, family. |
| **Affected routes** | Expertise hub, WWP Privacy asset, situation pages (family privacy, online attacks), editorial. |
| **Mitigation** | Keep **WWP** stake-led; **Situations** problem-led; **Expertise** capability-led; disambiguate meta (“privacy rights & litigation” vs “family exposure”). |

---

### R3 — Investigations / intelligence (practice) vs editorial “Intelligence” section

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** (naming collision only — different user tasks) |
| **Overlap** | Word “intelligence” appears in practice and brand editorial section **Intelligence**. |
| **Mitigation** | **Do not** rename public Intelligence branding without executive approval (governance §59). Use **meta** and breadcrumbs to clarify “analysis & commentary” vs “investigations capability” on appropriate pages. |

---

### R4 — Situations index vs Response System vs Expertise index

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** |
| **Overlap** | All three answer “how Schillings helps under pressure.” |
| **Mitigation** | **Response System** = *integrated model*; **Situations** = *entry by circumstance*; **Expertise** = *entry by legal/commercial category*. Reinforce with **distinct** meta promises and cross-links (architecture doc). |

---

### R5 — Office pages vs Contact hub

| Field | Detail |
|-------|--------|
| **Severity** | **Low–medium** |
| **Overlap** | “Contact Schillings London” vs London office page. |
| **Healthy** | Office wins **geo + office** navigational; Contact wins **brand + contact** and form-first intent. |
| **Mitigation** | Differentiate meta: office = address/map/regional; contact = form/qualifying/urgent line. Avoid duplicate titles. |

---

### R6 — People profiles vs Expertise hubs

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** (E-E-A-T vs commercial) |
| **Overlap** | Partner bio ranks for practice queries. |
| **Mitigation** | Profiles **support** hubs; hubs **lead** commercial category. Profile meta emphasizes **credential**; hub meta emphasizes **service & team**. Avoid profile titles that mimic hub titles. |

---

### R7 — News topic pages vs Expertise hubs

| Field | Detail |
|-------|--------|
| **Severity** | **Medium** |
| **Overlap** | Topic labels may mirror expertise labels. |
| **Mitigation** | Topic titles include “Intelligence” or analysis framing; **internal link** from topic → expertise **once** as “how we help” not keyword stacking. |

---

### R8 — Legal / compliance duplicate titles (locales)

| Field | Detail |
|-------|--------|
| **Severity** | **Low** (usually filtered mentally by locale) |
| **Mitigation** | If GSC shows wrong locale URL ranking, prefer **subtle** title differentiation **after** legal review — **not** `hreflang` hacks here. |

---

## 2. Severity summary

| Severity | Count | Action |
|----------|-------|--------|
| High | R1, R2 | Prioritize title/meta + linking plan |
| Medium | R3–R7 | Monitor GSC; batch fixes |
| Low | R8 | Watchlist |

---

## 3. When **not** to mitigate

- Short-term ranking oscillation during migrations.  
- Same SERP featuring **two** URLs for *different intents* (e.g. article + hub) — monitor only.

---

## 4. Escalation

- **CRITICAL** if proposing canonical consolidation or redirect maps — **outside** this document’s allowed tools.  
- **REVIEW REQUIRED** for any template that changes **multiple families** at once.

---

## 5. Related documents

- [`SEO-KEYWORD-INTENT-MAP.md`](./SEO-KEYWORD-INTENT-MAP.md)
- [`SEO-INTERNAL-LINKING-ARCHITECTURE.md`](./SEO-INTERNAL-LINKING-ARCHITECTURE.md)
- [`SEO-IMPLEMENTATION-ROLLUP.md`](./SEO-IMPLEMENTATION-ROLLUP.md)
