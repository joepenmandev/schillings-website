# SEO authority ownership map (Phase 2B)

**Classification:** REVIEW REQUIRED  
**Purpose:** Make **primary vs supporting** intent explicit for major query clusters—without new routes, schema, or SEO UI systems.  
**Implements (copy + selective links only):** `service-hub-content.json`, `ExpertiseHubDetail.astro`, `expertise-situation-cluster-links.ts`, `PersonProfileContextSections.astro`, `news-topic-expertise-bridge.ts`, topic hub template.

**Phase 2C consolidation:** [`SEO-QUERY-OWNERSHIP-AUDIT.md`](SEO-QUERY-OWNERSHIP-AUDIT.md) (risk/confidence), [`SEO-ANCHOR-VOCABULARY.md`](SEO-ANCHOR-VOCABULARY.md), [`SEO-MEASUREMENT-FRAMEWORK.md`](SEO-MEASUREMENT-FRAMEWORK.md).  
**Phase 3 (earned authority / Intelligence):** [`SEO-EDITORIAL-AUTHORITY-STRATEGY.md`](SEO-EDITORIAL-AUTHORITY-STRATEGY.md).  
**Phase 3A (editorial operations):** quality, topics, AI, entity, lifecycle — see bundle list in that strategy doc.

---

## Query cluster: reputation, privacy, defamation, online harm

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY (commercial)** | Expertise hub | `/expertise/reputation-privacy/` |
| **SUPPORTING (informational / scenario)** | Situations | Media scrutiny; reputation under threat; family privacy; online attacks & misinformation; AI/deepfake (partial) |
| **SUPPORTING (editorial)** | Intelligence | Topics: Reputation, Privacy, Disinformation, Smear campaigns, Online profiles (archive only) |
| **SUPPORTING (entity)** | People | Profiles mention expertise tags → link **to** hub; profiles **do not** compete for commercial head terms |
| **Commercial intent owner** | Expertise hub | Retained counsel / practice |
| **Informational intent owner** | Situations + Intelligence | “What this looks like” / analysis |
| **Geo owner** | Offices (later phase) | Local contact intent—not practice definition |
| **Cannibalization risk** | Articles or bios ranking for “reputation lawyers” | **Mitigation:** hubs carry practice framing; articles stay editorial; bios stay trust/context |
| **Do not compete** | People URLs, news articles, offices | For head commercial clusters |

---

## Query cluster: disputes, litigation, high-stakes proceedings

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY** | Expertise hub | `/expertise/litigation-disputes/` |
| **SUPPORTING** | Situations | High-stakes litigation; international disputes; sensitive investigations (proceedings angle); crisis containment (legal exposure); activist campaigns (boundaries) |
| **SUPPORTING (editorial)** | Intelligence | Investigations, Risk, Crisis topics (interpretive only) |
| **SUPPORTING (entity)** | People | Tags → hub |
| **Commercial owner** | Expertise hub | |
| **Informational owner** | Situations | |
| **Cannibalization risk** | Situation pages outranking hub for “disputes” commercial queries | **Mitigation:** hub copy = **firmwide practice**; situation anchors stay **scenario-led** (see cluster links) |
| **Do not compete** | Topic archives for commercial head terms | Topic pages carry one **practice-context** line only where mapped |

---

## Query cluster: investigations, intelligence, security

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY** | Expertise hub | `/expertise/intelligence-investigations/` |
| **SUPPORTING** | Situations | Sensitive investigations; cyber extortion; online attacks (mapping); AI threats (evidence) |
| **SUPPORTING (editorial)** | Intelligence | Investigations, Security, AI, Disinformation (where aligned) |
| **Commercial owner** | Expertise hub | |
| **Informational owner** | Situations | |
| **Cannibalization risk** | “Investigations” topic hub vs expertise | **Mitigation:** topic hub = editorial; bridge line points to **Intelligence & Investigations** expertise |
| **Do not compete** | — | |

---

## Query cluster: strategic / crisis communications

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY** | Expertise hub | `/expertise/strategic-communications/` |
| **SUPPORTING** | Situations | Media scrutiny; crisis containment; executive & leadership risk |
| **SUPPORTING (editorial)** | Intelligence | Communications, Crisis topics |
| **Commercial owner** | Expertise hub | |
| **Informational owner** | Situations | |

---

## Query cluster: cross-border / international mandates

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY** | Expertise hub | `/expertise/international/` |
| **SUPPORTING** | Situations | International disputes |
| **SUPPORTING (editorial)** | Intelligence | Geopolitics topic → practice bridge |
| **Commercial owner** | Expertise hub | |
| **Geo owner** | Offices | **Local** contact and jurisdiction—not global practice definition |

---

## Query cluster: regulatory / enforcement-facing

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY** | Expertise hub | `/expertise/regulatory/` |
| **SUPPORTING** | Situations | Sensitive investigations; crisis containment (regulator/market pressure) |
| **SUPPORTING (editorial)** | Intelligence | Thin or neutral unless article explicitly regulatory |
| **Commercial owner** | Expertise hub | |

---

## Query cluster: corporate / transactional risk

| Role | Owner | Path / surface |
|------|--------|----------------|
| **PRIMARY** | Expertise hub | `/expertise/corporate-transactions/` |
| **SUPPORTING** | Situations | (Phase 2A had no situation cross-links—intentional; avoid weak ties) |
| **SUPPORTING (editorial)** | Intelligence | Family businesses topic → bridge only |

---

## Overlap resolution (normalization)

| Overlap | PRIMARY OWNER | SUPPORTING CONTEXT | NEUTRAL |
|---------|---------------|-------------------|---------|
| Reputation / privacy commercial | Expertise hub | Situations, Intelligence topics | People mention |
| “Investigations” | Expertise hub (practice) | Situations, editorial Investigations topic | — |
| Crisis narrative | Communications hub (practice) | Crisis situation, Crisis topic | — |
| Cross-border disputes | International + Litigation hubs (split facet) | International disputes situation | — |

---

## Anchor hierarchy (Phase 2B)

| Surface | Anchor philosophy |
|---------|-------------------|
| **Expertise → situation** | Practice- and **strategy**-forward; ties scenario to **firmwide capability** |
| **Situation → expertise** | **Scenario-forward** (scrutiny, allegations, coercion, forums); avoids repeating hub superlatives |
| **Intelligence topic → expertise** | Single contextual line; **editorial vs practice** distinction explicit |
| **People → expertise** | Directory labels; prose states hubs are **firmwide practice** context |

Full link table: `SEO-CLUSTER-RELATIONSHIP-MAP.md` + `expertise-situation-cluster-links.ts`.

---

## Prohibited in Phase 2B

- Schema, canonical, hreflang, routes, breadcrumbs, H1 systems  
- Automated related-content engines, article footers, mass retrofits  
- Directory or profile **title/meta** rewrites  
- Keyword-stuffed anchors or geo spam  

---

## Measurement (guidance)

- Expertise URL impressions/CTR; query consolidation toward hub URLs  
- Reduced query overlap (GSC) between hub and situation for same commercial head  
- Assisted traffic from situations/topics to expertise  

---

## Revision log

| Date | Change |
|------|--------|
| 2026-05-06 | Initial Phase 2B authority map + implementation hooks |
