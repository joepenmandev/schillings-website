# SEO measurement framework (Phase 2C)

**Classification:** REVIEW REQUIRED  
**Purpose:** Track **authority consolidation** and **query ownership**—not internal link counts.  
**Primary tool:** Google Search Console (GSC); supplement with analytics paths and crawl review.  
**Phase 3 editorial / SERP roles:** [`SEO-EDITORIAL-AUTHORITY-STRATEGY.md`](SEO-EDITORIAL-AUTHORITY-STRATEGY.md).  
**Phase 3A editorial operations:** quality, topics, AI, entity, lifecycle — see strategy doc bundle list there.

---

## Primary metrics (expertise-first)

| Metric | What to watch | Success signal |
|--------|----------------|----------------|
| **Expertise query growth** | Impressions/clicks on queries where `/expertise/` URLs appear | Breadth grows without trashy tail |
| **Expertise URL consolidation** | Fewer competing URLs for same commercial query class | One hub URL dominates per cluster |
| **Assisted visibility from situations** | Landing page = situation; **next** session or multi-touch path includes expertise | Behavioural reinforcement (where measurable) |
| **Topic → expertise discovery** | Topic archive as entry; hub appears in same user journeys or secondary queries | “Practice context” bridge reflected in paths |
| **Crawl depth to expertise hubs** | Server logs or crawler reports: clicks from home/nav to hubs | Hubs reachable in few steps; stable in `verify:strategic-crawl` |

---

## Secondary metrics

| Metric | Notes |
|--------|--------|
| **Profile-assisted rankings** | Branded + niche queries; **not** goal to win non-branded commercial heads on `/people/` |
| **Editorial-assisted rankings** | Informational queries; articles **should not** displace hubs for commercial intent |
| **Geo query spread** | Offices/contact for local; hubs for practice |
| **Branded vs non-branded mix** | Healthy branded baseline; non-branded grows on **hubs** first |

---

## Warning signals (investigate)

| Signal | Likely issue |
|--------|----------------|
| **Articles outranking expertise** for commercial practice heads | Editorial cannibalization; tighten internal signals or titles (future phase—**not** mass rewrite here) |
| **Situations outranking hubs** for generic commercial terms | Scenario pages over-weighted; check anchors, external links, query intent |
| **People capturing commercial queries** at scale | Profile drift; review intros and meta (governance) |
| **Query fragmentation** | Multiple URLs share same query class without clear primary |
| **Unstable SERP ownership** | Volatile rankings week-to-week for same query—external factors vs internal ambiguity |

---

## Per–expertise hub checklist (GSC)

For each of the seven hubs (per property / locale as applicable):

1. **Rising query breadth** — new queries where URL appears.  
2. **Supporting query emergence** — long-tail that clearly references scenarios (acceptable on situations).  
3. **Assisted impressions** — hub gains impressions when filtering queries containing situation-like language (manual segment).  
4. **Decreasing fragmentation** — fewer non-hub URLs on same **commercial** query filters over time.

**Interpretation:** Queries **migrating** from situations/articles **toward** expertise URLs for the **same intent class** is the main positive consolidation signal.

---

## Crawl & internal graph (quarterly)

1. Run `npm run verify:strategic-crawl:local` (see site README).  
2. Confirm strategic set includes all expertise + situation routes and locale parity.  
3. **Strategic link check:** crawl flags HTTP failures on links **from** strategic pages (e.g. Intelligence index must not link to non-existent People URLs). Fix in templates, not by weakening the check.  
4. Manually spot-check: home → expertise → situation → back to expertise path exists where intended.  
5. Record regressions in implementation matrix revision log.

---

## What not to optimize

- Raw count of internal links  
- Keyword density on articles  
- Universal “related” blocks  
- Automated anchor injection  

---

## Phase 3A — editorial measurement evolution

**Deprioritise as primary success metrics**

- Raw **article count**  
- **Publishing frequency** or cadence targets  
- **Total indexed pages** as a goal in itself  

**Prioritise**

| Signal | Notes |
|--------|--------|
| **Citation quality** | Who links and references pieces — trust of source matters more than volume. |
| **Assisted rankings** | Informational queries on Intelligence supporting discovery; hubs retain commercial role. |
| **Query expansion** | Thematic and author queries that reflect authority, not spam tail. |
| **Branded search growth** | Firm and named experts — entity strength. |
| **Authority consolidation** | Commercial intent clustering on expertise URLs (see primary metrics above). |
| **High-intent discovery** | Paths from editorial/strategic surfaces toward expertise/contact without forced funnels. |
| **Editorial-assisted conversions** | Qualitative + sparse quantitative — do not over-attribute. |
| **Backlinks from trusted sources** | Legal press, serious media, directories, institutions. |
| **Topic ownership stability** | Editorial supports themes without pseudo-hub behaviour on topic archives. |

Brand protection: **perceived quality** is a long-term SEO asset — avoid optimising for volume at the expense of sophistication ([`SEO-EDITORIAL-QUALITY-STANDARD.md`](SEO-EDITORIAL-QUALITY-STANDARD.md)).

---

## Revision log

| Date | Change |
|------|--------|
| 2026-05-06 | Phase 2C framework |
| 2026-05-06 | Phase 3A: editorial measurement evolution (deprioritise volume; prioritise citations, consolidation, trust) |
