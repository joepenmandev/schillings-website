# SEO implementation matrix (living document)

**Purpose:** Track **approved** title/meta patterns, implementation locations, risk tier, and rollout order. Updated as phases ship.  
**Governance:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) §11–§12; Appendix A (protected systems).

---

## A. Title & meta ownership audit

| Utility / surface | Path | Role | Call sites |
|-------------------|------|------|------------|
| Home title/meta | `src/lib/locale-marketing-meta.ts` `homePageMeta` | Regional homepage | `index.astro`, `us/index.astro`, `ie/index.astro` |
| People directory | `locale-marketing-meta.ts` `peopleDirectoryMeta` | Directory only | `people/index.astro` (×3 locales) |
| Contact hub | `locale-marketing-meta.ts` `contactPageMeta` | Title, meta, **pageEntityName** (JSON-LD) | `contact/index.astro` (×3) |
| About | `src/lib/about-us-region.ts` `metaTitle` / `metaDescription` | Regional about | `about-us/index.astro` (×3) |
| Office pages | Inline + **`office-page-meta.ts`** `officeContactPageDescription` | ContactPage + LocalBusiness JSON-LD `description` | `[office]/index.astro` (×3) |
| Expertise index | Inline in `ExpertiseIndexShell.astro` | Collection meta | 3 locales |
| **Expertise hub** | **`service-hub-copy.ts`** + **`ExpertiseHubDetail.astro`** | Per-hub `serpDescription`; title via `expertiseHubDocumentTitle` | `ExpertiseHubDetail` (×3) |
| Strategic hub index | `strategic-rebuild-content.ts` `HUB_PAGE_COPY` | Situations / WWP / Response title+meta | Shell components |
| Situation detail | `strategic-rebuild-content.ts` situation models `metaTitle` / `metaDescription` | Detail pages | `SituationDetailPage.astro` |
| WWP detail | `whatWeProtectDetailsById` | Detail | `WhatWeProtectDetailPage.astro` |
| Response hub | `responseSystemPage` in strategic-rebuild | Meta/title | `ResponseSystemPage.astro` |
| People profile | `person-jsonld.ts` `buildPersonPageTitle` / `buildPersonMetaDescription` | Profiles | `people/[slug]/index.astro` |
| News article | Article `title` + excerpt helpers | Editorial | `news/[slug]/index.astro` |
| 24/7 | `immediate-response-page.ts` | Urgent line | `24-7-immediate-response/index.astro` (×3) |

**Family boundaries:** Do not route People/Intelligence/legal changes through expertise utilities. Expertise copy lives in `service-hub-content.json` + `service-hub-copy.ts`.

---

## B. Editable families — Phase 1 matrix

### B1 Expertise hub (detail)

| Field | Current | Proposed (Phase 1) |
|-------|---------|-------------------|
| **Title** | `{label} \| Expertise \| Schillings` | `{label} \| Legal expertise \| Schillings` |
| **Meta** | `clipPlainText(\`${label}: ${intro}\`, 158)` | Dedicated **`serpDescription`** per hub in JSON (fallback to legacy formula) |
| **Rationale** | “Legal expertise” signals commercial/legal relevance without stuffing “lawyers” in every title; meta carries precise counsel language + geography. |
| **Keyword intent** | Commercial investigation + category. |
| **CTR** | Clearer SERP match for legal seeker; premium tone in hand-written meta lines. |
| **Risk** | **SAFE** (template + content data). |
| **Implementation** | `service-hub-content.json`, `service-hub-copy.ts`, `ExpertiseHubDetail.astro` |
| **Rollout** | P1 first. |
| **QA** | All 7 hubs render; JSON-LD `name`/`description` match `Base`; locales parity; length & truncation. |
| **Rollback** | Revert JSON + one component + helper. |

### B2 Expertise index

| Field | Current | Proposed |
|-------|---------|----------|
| **Title** | `Expertise \| Schillings` | *unchanged* |
| **Meta** | Single paragraph | Add explicit **lawyers / London, Miami, Dublin** and practice breadth (one sentence). |
| **Risk** | **SAFE** |
| **Implementation** | `ExpertiseIndexShell.astro` |

### B3 Contact hub

| Field | Current | Proposed |
|-------|---------|----------|
| **Title** | Geo-specific (London / Miami / Dublin) | *unchanged* |
| **Meta** | Form + offices + urgent line | Add **discretion-led / sensitive matters** clause (one sentence). |
| **Risk** | **SAFE** (wording only; **pageEntityName** synced). |
| **Implementation** | `locale-marketing-meta.ts` |

### B4 Office pages

| Field | Current | Proposed |
|-------|---------|----------|
| **Title** | `Contact — {Office} \| Schillings` | *unchanged* (H1/utility unchanged). |
| **Meta** | Address/map/form utility | Lead with **Schillings {city} — lawyers & advisers** + practice clusters (reputation, privacy, disputes, investigations) + existing utility tail. |
| **Risk** | **SAFE** |
| **Implementation** | `office-page-meta.ts` + 3× `[office]/index.astro` |

### B5 Strategic hub indices (Situations, WWP, Response)

| Field | Current | Proposed Phase 1 |
|-------|---------|------------------|
| **Title** | `… \| Schillings` | *unchanged* |
| **Meta** | Hub constants | **Response System** only: extend for “organisations and individuals” clarity; others reviewed — *minimal change* if already strong. |
| **Risk** | **SAFE** |
| **Implementation** | `strategic-rebuild-content.ts` |

### B6 About

| Field | Current | Proposed |
|-------|---------|----------|
| **Title** | Regional about titles | *unchanged* |
| **Meta** | Narrative | Strengthen **entity** framing (“international law firm” / multidisciplinary integration) — **≤~155 chars** per locale. |
| **Risk** | **REVIEW REQUIRED** for brand/comms on exact wording — implemented as conservative copy. |
| **Implementation** | `about-us-region.ts` |

---

## C. Deferred phases (reference only)

| Phase | Scope | Risk band |
|-------|--------|-----------|
| P2 | Internal linking (expertise ↔ situations) — **2A:** curated lists on situation + expertise templates (`expertise-situation-cluster-links.ts`) — **SAFE** | REVIEW for GSC |
| P3 | **Authority expansion** — editorial + SERP roles + external entity (see [`SEO-EDITORIAL-AUTHORITY-STRATEGY.md`](SEO-EDITORIAL-AUTHORITY-STRATEGY.md)); not sitewide SEO mechanics | REVIEW + Editorial |
| P3A | **Editorial operating system** — quality bar, topic selection, AI policy, entity reinforcement, lifecycle ([`SEO-EDITORIAL-QUALITY-STANDARD.md`](SEO-EDITORIAL-QUALITY-STANDARD.md) et al.) | REVIEW + Editorial |
| P4 | Entity / profile meta; archive ops under Phase 3 / 3A | REVIEW |
| P5 | Geo hardening on hubs | REVIEW |
| P6 | Title experiments (situation detail tails) | HIGH RISK |

---

## D. Mandatory QA (per PR)

- [ ] `en-gb` / `en-us` / `en-ie` parity for changed templates  
- [ ] `Base` title + description match JSON-LD **values** where same page builds both  
- [ ] No layout / H1 / breadcrumb component changes  
- [ ] No `hreflang` / canonical / route / slug edits  
- [ ] Truncation: `clipPlainText` where applicable; manual length check for About  

---

## E. Measurement

| Signal | Tool |
|--------|------|
| CTR / impressions | GSC (filter `/expertise/`, `/contact/`, `/london/` etc.) |
| Cannibalization | GSC landing pages + query overlap |
| Branded SERP | Manual spot check |

---

## F. Revision log

| Date | Change |
|------|--------|
| 2026-05-06 | Phase 1 matrix + expertise/office/contact/strategic/about SAFE copy |
| 2026-05-06 | Phase 2A: expertise ↔ situations cluster links + `SEO-CLUSTER-RELATIONSHIP-MAP.md` |
| 2026-05-06 | Phase 2B (REVIEW): `SEO-AUTHORITY-OWNERSHIP-MAP.md`; hub authority/CTA copy; anchor hierarchy; topic bridge; profile prose |
| 2026-05-06 | Phase 2C (REVIEW): query ownership audit, anchor vocabulary, measurement framework; topic bridge + profile calibration; crawl graph fixes (house byline → `news/author/schillings`; IE author hub `resolveNewsAuthorProfile`); `verify:strategic-crawl:local` green |
| 2026-05-06 | Phase 3 (REVIEW): `SEO-EDITORIAL-AUTHORITY-STRATEGY.md` — Intelligence as authority engine, research/insight layer, external entity, SERP roles, monitoring, content-gap rules |
| 2026-05-06 | Phase 3A (REVIEW): editorial OS — `SEO-EDITORIAL-QUALITY-STANDARD.md`, `SEO-EDITORIAL-TOPIC-SELECTION.md`, `SEO-AI-EDITORIAL-POLICY.md`, `SEO-EDITORIAL-ENTITY-STRATEGY.md`, `SEO-CONTENT-LIFECYCLE.md`; measurement framework updated |
