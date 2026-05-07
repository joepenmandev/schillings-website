# Entity architecture (search + E-E-A-T)

**Status:** Strategy for how search engines should *understand* Schillings as an entity system  
**Governance:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) Appendix A (structured data protected); **no JSON-LD restructuring** in this document — only *alignment guidance* for copy, internal linking, and future **CRITICAL-gated** schema work.

---

## 1. Entity layers

| Layer | On-site representation | SEO/E-E-A-T role |
|-------|------------------------|------------------|
| **Organization** | Brand, About, sitewide JSON-LD references | Parent entity; trust anchor |
| **Local business / offices** | Office pages, contact | Geo entities; local trust |
| **People** | Directory + profiles; `Person` in article schema when credited | **E-E-A-T**; disambiguation |
| **Creative/editorial** | Intelligence articles; topic/author archives | Thought leadership; **subject matter** signals |
| **Service / expertise** | Expertise hubs (WebPage-level entities in JSON-LD builders) | Commercial category ownership |
| **Topics / situations** | Strategic detail pages | Problem taxonomy — connects user language to firm |

---

## 2. Reinforcement paths (copy + linking — SAFE levers)

### 2.1 Organization ↔ offices

- Office pages should **name** the legal/market entity consistently with About and footer.  
- **Internal link:** Office → Contact + About + relevant Expertise.

### 2.2 Organization ↔ expertise

- Expertise hubs should **explicitly** frame Schillings as *the* actor (“we”, “Schillings team”) in **controlled** copy — without widening legal claims.  
- **Internal link:** Expertise → Response System + Situations.

### 2.3 People ↔ expertise

- Profiles list expertise tags with **human labels** matching hub vocabulary.  
- **Goal:** Clear `Person` ↔ `knowsAbout` / topical association for search *without* keyword stuffing bios.

### 2.4 People ↔ editorial

- Credited articles: `authorSlugs` in data drives bylines and schema **Person** nodes where implemented.  
- **House author** (`schillings`): firm voice — schema treats as **Organization** reference where configured; **do not** fake `Person` URLs.

### 2.5 Editorial ↔ expertise (proof loop)

- When an article **substantively** discusses a practice area, one contextual link to the Expertise hub can reinforce **topic authority**.  
- **Editorial gate** required — not automatic.

---

## 3. Structured data observations (non-prescriptive)

- **BlogPosting** / article graphs tie authors to people profiles where resolvable — supports E-E-A-T.  
- **Profile pages** use person JSON-LD builders — sensitive to layout/content changes (**HIGH RISK** if tampered).  
- **CollectionPage** hubs (news topics, authors) reference org or person IDs per implementation — changes are **CRITICAL** tier.

**Rule:** Entity improvements **first** via visible content + linking; schema changes only via **CRITICAL** SEO/engineering process.

---

## 4. “Entity ownership” by query type

| Query type | Leading on-site entity surface |
|------------|----------------------------------|
| Brand | Homepage + About |
| Commercial legal category | **Expertise hub** |
| Problem / circumstance | **Situation detail** |
| Stake / asset framing | **WWP detail** |
| Named lawyer | **Profile** |
| Firm POV / analysis | **Intelligence** |
| Regulator / compliance | Compliance pages |

---

## 5. Practical checks (quarterly)

1. **Brand + entity** consistency across About, footer, office pages, and legal disclaimers.  
2. **Profile** coverage for market-facing partners (not a prompt to invent bios).  
3. **Broken** author/topic links in Intelligence data.  
4. **Cannibalization** of entity signals (same title on two leaders) — see `SEO-CANNIBALIZATION-RISKS.md`.

---

## 6. Risk classification

- **SAFE:** Bio copy that clarifies role/office; internal link from profile to expertise.  
- **REVIEW REQUIRED:** Template copy blocks affecting many profiles.  
- **HIGH RISK:** Person schema field changes.  
- **CRITICAL:** Graph ID strategy, `@graph` composition, hreflang.

---

## 7. Related documents

- [`SEO-INTERNAL-LINKING-ARCHITECTURE.md`](./SEO-INTERNAL-LINKING-ARCHITECTURE.md)
- [`SEO-KEYWORD-INTENT-MAP.md`](./SEO-KEYWORD-INTENT-MAP.md)
- [`SEO-IMPLEMENTATION-ROLLUP.md`](./SEO-IMPLEMENTATION-ROLLUP.md)
