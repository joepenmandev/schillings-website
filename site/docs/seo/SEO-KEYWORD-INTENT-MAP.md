# SEO keyword & intent map

**Status:** Strategic reference (not a keyword dump)  
**Governance:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) §3 family intent; §49 (SEO architecture governed separately from DS but must not violate intent)

**How to use this file:** For each **route family**, map *primary* and *supporting* query clusters to **intent**, **funnel role**, and **authority role**. Implementation touches **copy/meta/title** and **internal links** only unless explicitly escalated elsewhere.

---

## 1. Intent taxonomy (site-specific)

| Intent type | Definition on this property |
|-------------|------------------------------|
| **Navigational** | User seeks Schillings or a known destination (people, office, contact). |
| **Commercial investigation** | User compares firms / practice areas / suitability before instructing. |
| **Informational** | User educates on problem, law, or context (editorial + some strategic detail). |
| **Crisis / high urgency** | User needs rapid help (24/7, certain situations). |
| **Local** | Query embeds geography or “near me” mental model. |
| **Brand trust** | User validates legitimacy, history, regulation (about, legal, compliance). |
| **Editorial authority** | User seeks expert perspective (Intelligence). |
| **Entity support** | Query is name-of-lawyer or “Schillings + X” validation (profiles). |

---

## 2. Family-level map

### A. Homepage (`/`, `/us/`, `/ie/`)

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Schillings; reputation; privacy; security; high-stakes disputes (brand + outcome framing). |
| **Secondary** | Crisis communications; investigations; international; regional hub terms (Americas, Ireland, EU). |
| **Intent** | Navigational + brand trust + light commercial framing. |
| **Funnel** | Awareness → exploration (not conversion-heavy in title). |
| **Authority role** | **Leads** brand entity; **supports** all clusters. |
| **SERP competitors** | Other premium disputes / reputation firms; Big Law with overlapping marketing. |
| **Sophistication** | High — avoid patronizing. |
| **Trust sensitivity** | Extreme — no implied outcomes. |
| **Urgency** | Low in title; optional in meta for regional lines. |
| **Geo** | Strong regional differentiation (already in titles/meta tail). |
| **Title direction** | See `SEO-TITLE-META-STRATEGY.md` §3.1. |
| **H1 direction** | Hero subhead supports outcome language; do not mirror long-tail keyword lists. |
| **Internal links** | To Expertise, Situations, Intelligence, Contact — already strategic; reinforce **Expertise** as commercial spine. |
| **Cannibalization** | With Expertise if homepage stacks exact commercial phrases — **manage via meta/supporting copy**, not duplicate landing intent. |

---

### B. About (`/about-us/`)

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | About Schillings; law firm; founded London; international offices. |
| **Secondary** | Leadership; multidisciplinary; reputation privacy intelligence. |
| **Intent** | Brand trust + informational (firm story). |
| **Funnel** | Mid-funnel credibility. |
| **Authority role** | **Supports** E-E-A-T; **does not** compete for granular commercial legal terms. |
| **Title direction** | Regional “About Schillings — {region}” pattern is appropriate. |
| **Internal links** | People leadership, offices, Intelligence — **avoid** orphan About. |

---

### C. Contact hub (`/contact/`)

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Contact Schillings; enquiry; **geo-modified** contact intent. |
| **Secondary** | Urgent line; offices London Miami Dublin; confidential. |
| **Intent** | Navigational + local + crisis subset (cross-link to 24/7). |
| **Funnel** | Conversion — bottom of funnel. |
| **Authority role** | **Leads** conversion queries for brand + region. |
| **Title direction** | Geo explicit in title (implemented pattern). |
| **Meta** | Utility + trust + offices + urgent line (already aligned). |
| **Cannibalization** | With **office pages** — healthy if office pages win *city+contact* long-tail; hub wins *brand+contact*. |

---

### D. Office pages (`/london/`, `/miami/`, `/dublin/`)

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Schillings London / Miami / Dublin; office; contact; address. |
| **Secondary** | Reputation lawyers {city}; privacy lawyers {city}; litigation {city} — **accuracy-gated**. |
| **Intent** | Local + navigational + commercial investigation. |
| **Funnel** | Conversion support. |
| **Authority role** | **Leads** local pack adjacency and geo long-tail; **supports** org local entities. |
| **Internal links** | To Contact, 24/7, People filtered by office where UX allows. |

---

### E. 24/7 immediate response

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Immediate response; urgent; out of hours; crisis line. |
| **Secondary** | Reputation crisis; legal emergency (careful — not all matters are “legal emergency”). |
| **Intent** | Crisis / high urgency. |
| **Funnel** | Late-stage or acute entry. |
| **Authority role** | **Leads** urgency queries; must **not** dilute Contact funnel messaging. |

---

### F. Expertise index + hubs (`/expertise/`, `/expertise/{slug}/`)

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster (examples)** | Reputation management lawyers; privacy lawyers; defamation; investigations; litigation; strategic communications; regulatory — **per hub**. |
| **Secondary** | Law firm; UK; US; Ireland; cross-border; UHNW (where accurate). |
| **Intent** | **Commercial investigation** (primary) + informational. |
| **Funnel** | Mid-funnel evaluation. |
| **Authority role** | **Leads** commercial category authority — **pillar pages** for clusters. |
| **Title/meta** | See title strategy — commercial modifiers may concentrate in **meta** first. |
| **Internal links** | **Required:** related Situations, related WWP assets, relevant People filters, 1–2 Intelligence pieces *as proof*, not noise. |
| **Cannibalization** | Highest risk family vs Situations and topics — see cannibalization doc. |

---

### G. Situations index + detail

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Problem language: media scrutiny, blackmail, deepfakes, investigations, hostile campaigns, litigation pressure, etc. |
| **Secondary** | Reputation; privacy; cross-border. |
| **Intent** | Informational + crisis subsets + early commercial. |
| **Funnel** | Problem-aware → solution-aware. |
| **Authority role** | **Leads** problem-framed queries; **supports** Expertise with narrative context. |
| **Internal links** | Map each situation → **primary Expertise hub(s)** + **WWP** where honest. |

---

### H. What We Protect index + detail

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Asset language: reputation, privacy, family, leadership, continuity, security, legacy. |
| **Secondary** | High-net-worth context where accurate; **avoid** inventing HNW claims globally in meta. |
| **Intent** | Informational + brand-level framing; softer commercial than Expertise. |
| **Authority role** | **Supports** Expertise and Situations; explains *stakes* not *service SKUs*. |
| **Internal links** | To Situations + Expertise for users who think in “services” not “assets.” |

---

### I. Response System

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Integrated response; multidisciplinary; intelligence + legal + comms + security. |
| **Secondary** | “Single team” differentiator language (premium, not buzzword). |
| **Intent** | Commercial investigation + brand differentiation. |
| **Authority role** | **Supports** all strategic chapters — **differentiation** page, not keyword harvester. |
| **Query note** | “Response system” alone is abstract; **meta** should clarify *what* responds (threats, disputes, narrative, security). |

---

### J. People directory + profiles

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Schillings people; partner name; role + Schillings. |
| **Secondary** | Practice areas; office; expertise tags. |
| **Intent** | Entity + navigational + trust validation. |
| **Funnel** | Mid to late (relationship). |
| **Authority role** | **Leads** branded people search; **supports** Expertise E-E-A-T. |
| **Internal links** | Profiles → relevant Expertise hubs; news bylines; **avoid** over-anchoring exact commercial money keywords from bios. |

---

### K. Intelligence (`/news/`, topic, author, articles)

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Topic-specific (varies); “Schillings analysis”; firm POV. |
| **Intent** | Informational + editorial authority. |
| **Funnel** | Awareness / thought leadership — **not** primary conversion landing. |
| **Authority role** | **Supports** Expertise and Situations via **proof** and depth; **long-tail**. |
| **Topic pages** | Align taxonomy with strategic clusters **conceptually** — not duplicate expertise titles. |
| **Author pages** | Entity + byline discovery; house author (`schillings`) is firm voice, not competitor to people profiles. |

---

### L. Legal / compliance

| Dimension | Guidance |
|-----------|----------|
| **Primary cluster** | Terms; privacy; cookies; SRA; complaints; candidate privacy; terms of business. |
| **Intent** | Brand trust + compliance. |
| **Authority role** | **Supports** trust; **no** commercial keyword pursuit. |
| **Implementation** | Duplicate titles across locales may exist — evaluate **REVIEW REQUIRED** only if GSC shows confusion; **noindex** is **CRITICAL** gate. |

---

## 3. Cluster leadership summary

| Cluster “owner” (primary on-site) | Page type |
|-----------------------------------|-----------|
| Outcome + brand | Homepage |
| Commercial legal category | **Expertise hubs** |
| Problem / circumstance | **Situation detail** |
| Stakes / assets | **WWP detail** |
| Differentiation | Response System |
| Proof / depth | **Intelligence** |
| Person entity | **Profiles** |
| Convert | **Contact + offices + 24/7** |
| Trust docs | Legal / compliance |

---

## 4. Risk tags for keyword work

- **SAFE:** Single-page meta refinement; adding one accurate supporting phrase in body *within existing layout*.  
- **REVIEW REQUIRED:** Template-level meta/title experiments; cross-family anchor text policy.  
- **HIGH RISK:** Aggressive commercial wording on strategic hubs that flattens editorial or conversion intent.  
- **CRITICAL:** Anything affecting schema, hreflang, canonical, routing, form legal copy.

---

## 5. Related documents

- [`SEO-TITLE-META-STRATEGY.md`](./SEO-TITLE-META-STRATEGY.md)
- [`SEO-INTERNAL-LINKING-ARCHITECTURE.md`](./SEO-INTERNAL-LINKING-ARCHITECTURE.md)
- [`SEO-CANNIBALIZATION-RISKS.md`](./SEO-CANNIBALIZATION-RISKS.md)
- [`SEO-IMPLEMENTATION-ROLLUP.md`](./SEO-IMPLEMENTATION-ROLLUP.md)
