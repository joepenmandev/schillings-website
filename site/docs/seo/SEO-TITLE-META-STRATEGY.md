# SEO title & meta description strategy

**Status:** Implementation guidance (strategy + governance)  
**Scope:** Document titles, meta descriptions, alignment with on-page H1 where relevant  
**Audience:** SEO, editorial, conversion, strategic content owners, engineering  
**Governance anchor:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) §3 (family intent), §7 (ownership), §11 (change class), Appendix A (protected systems)

**Explicitly out of scope (per platform immutables):** route/slug changes, canonical/`hreflang` changes, JSON-LD graph *restructuring*, sitemap restructuring, universal title systems, replacing family-specific chrome.

---

## 1. Principles

1. **Family intent overrides SEO uniformity** — Different families answer different tasks; titles and meta must reinforce those tasks, not flatten them into one pattern.
2. **Premium legal / editorial positioning** — Copy should read as firm-authored, not agency-SEO. Prefer *precise* over *loud*.
3. **Intent clarity > keyword density** — Primary queries should be *inferable* from title/meta; stuffing erodes trust.
4. **Coherent, not identical** — Regional and family variants may diverge deliberately (governance §1, §59).
5. **CTR is a secondary objective** — Improve relevance signals and honest promises in SERP; never clickbait.

---

## 2. Route family audit (SEO document layer)

Legend: **Template** = primary Astro / component entry; **JSON-LD** = high-level naming role only (no shape changes per this strategy).

| Family | Example routes | Title source (typical) | H1 / hero relationship | noindex notes |
|--------|----------------|-------------------------|-------------------------|---------------|
| Homepage | `/`, `/us/`, `/ie/` | `locale-marketing-meta.ts` `homePageMeta` | Home hero (`strategic-rebuild-content` home hero) | — |
| Narrative / About | `/about-us/` | `about-us-region.ts` `metaTitle` | Regional hero title | — |
| Conversion — Contact | `/contact/` | `contactPageMeta` | Utility H1 on page | — |
| Conversion — Thank you | `/contact/thank-you/` | Static in page | Thank you | **noindex** |
| Conversion — Offices | `/london/`, `/miami/`, `/dublin/` | `Contact — {Office} \| Schillings` | Office name | — |
| Conversion — Urgent | `/24-7-immediate-response/` | `immediate-response-page.ts` | Content H1 | — |
| Strategic — Expertise index | `/expertise/` | `ExpertiseIndexShell` | “Expertise” (strategic title) | — |
| Strategic — Expertise hub | `/expertise/{slug}/` | `{EXPERTISE_LABEL} \| Expertise \| Schillings` | Expertise label | — |
| Strategic — Situations index | `/situations/` | Hub model `title` | Situations | — |
| Strategic — Situation detail | `/situations/{slug}/` | `model.metaTitle` | `model.title` | — |
| Strategic — WWP index | `/what-we-protect/` | Hub model | What We Protect | — |
| Strategic — WWP detail | `/what-we-protect/{slug}/` | `model.metaTitle` | Asset title | — |
| Strategic — Response | `/response-system/` | `responseSystemPage.metaTitle` | Response System | — |
| Editorial — Intelligence index | `/news/` | Static `Intelligence \| Schillings` | Masthead | — |
| Editorial — Paginated | `/news/page/n/` | Page-aware title | Archive | — |
| Editorial — Article | `/news/{slug}/` | `{title} \| Schillings` | Article headline | migration stubs may differ |
| Editorial — Topic | `/news/topic/{slug}/` | `{label} — Intelligence \| Schillings` | Topic | thin hubs: check noindex |
| Editorial — Author | `/news/author/{slug}/` | `{name} — Intelligence \| Schillings` | Author name | thin hubs: noindex |
| Directory | `/people/` | `peopleDirectoryMeta` | People | — |
| Profile | `/people/{slug}/` | `buildPersonPageTitle` | Person name + role subline | thin profiles: noindex |
| International | `/international/` | Static | International | — |
| Utility | `/search/` | Search | Search | **noindex** |
| Legal | `/legal/*` | Per page | H1 | trust-only |
| Compliance | `/compliance/*` | Per page | H1 | trust-only |
| Founder / bio (placeholder) | `/keith-schilling-*` | Static patterns | H1 | — |
| Error | `404` | Page not found | — | **noindex** |

**Alignment check:** Strategic and editorial families intentionally use *different* title philosophies (governance §59: Intelligence remains editorial). Profiles use *name — role* truncation, not strategic chapter titling.

---

## 3. Family-specific title systems

### 3.1 Homepage (brand + regional authority)

- **SEO purpose:** Navigational + brand trust + regional relevance.
- **Philosophy:** Lead with *outcome framing* (reputation, privacy, security) and *regional qualifier*; avoid generic “law firm” stacking in UK title if it crowds out brand clarity.
- **Formula (conceptual):**  
  `[Outcome / positioning phrase] | Schillings [optional regional suffix]`
- **US/IE:** Already differentiated in `homePageMeta` — preserve regional suffix strategy.
- **Keyword aggressiveness:** **Low–medium** on homepage; commercial terms may appear in **meta** before **title** if title length constrained.
- **Risk class for copy changes:** **REVIEW REQUIRED** (SEO + brand + governance §12).

### 3.2 Contact + offices + immediate response (conversion / local)

- **SEO purpose:** Local + commercial investigation + crisis routing.
- **Philosophy:** Title should signal **place** and **confidential access** without widening funnel language in body.
- **Contact hub:** Regional pattern already aligned (e.g. “Contact Schillings London, UK”) — **preserve** conversion-first tone; optional **meta** may carry “enquiry form”, “offices”, “urgent line” (already present).
- **Office pages:** `Contact — {City} | Schillings` — consider **meta** enrichment with *practice-context phrases* (reputation, privacy, disputes) **only** if legal/comms approve (tone risk).
- **24/7:** Title stable; meta carries jurisdiction-specific urgent language.
- **Risk:** **REVIEW REQUIRED** for any title change; **HIGH RISK** if body or form width/order touched (Appendix A, ADR-003).

### 3.3 About (narrative marketing)

- **SEO purpose:** Brand trust + entity understanding (E-E-A-T support).
- **Philosophy:** Titles may stay **brand-led**; secondary clarification belongs in **meta** (founding, geography, multidisciplinary).
- **Risk:** **REVIEW REQUIRED** (narrative owner).

### 3.4 Strategic hubs (situations / WWP / response / expertise index)

- **SEO purpose:** Topical authority + IA reinforcement; **not** primary commercial landing for every query.
- **Situations / WWP / Response:** Current pattern `… | Schillings` or `… | Situations | Schillings` — evaluate **user-problem-first** clauses in title *only* via **REVIEW REQUIRED** experiments (do not mass-rewrite).
- **Expertise index:** `Expertise | Schillings` — **highest commercial leverage** in strategic family; see §3.5.
- **Risk:** **REVIEW REQUIRED**; avoid turning hubs into keyword billboards.

### 3.5 Expertise hubs (primary commercial SEO family)

- **SEO purpose:** Commercial investigation + category authority (“reputation lawyers”, “privacy litigation”, etc.).
- **Current pattern:** `{Public expertise label} | Expertise | Schillings`
- **Strategic question (governance-safe):** Whether **meta** and **supporting copy** carry *legal/commercial* modifiers while **title** retains “Expertise” as IA anchor — often preferable to crowding H1/token systems.
- **Philosophy options (pick per hub with review):**
  - **Title-first legal intent:** Append short qualifier in meta: “… legal team”, “… lawyers (London / Miami / Dublin)” only when accurate.
  - **Title evolution (REVIEW REQUIRED):** Test *one hub* with `{Label}: legal & advisory | Schillings` vs current — measure GSC CTR; **do not** universalize without data.
- **Keyword aggressiveness:** **Medium–high** in **meta** first; **medium** in title.
- **Risk:** **REVIEW REQUIRED**; **HIGH RISK** if H1 component or strategic layout tokens change.

### 3.6 Situation detail pages

- **SEO purpose:** Problem/circumstance capture (informational + high urgency segments).
- **Current:** `… | Situations | Schillings` — trailing segment reinforces IA but consumes characters.
- **Guidance:** Prefer **problem-first 45–55 chars**, then brand. “| Situations | Schillings” is **IA-honest**; shortening to “| Schillings” only with SEO + strategic review (cannibalization with expertise — see `SEO-CANNIBALIZATION-RISKS.md`).
- **Risk:** **REVIEW REQUIRED** per page or small batch.

### 3.7 What We Protect detail

- **SEO purpose:** Asset / stake framing (often more conceptual than situation pages).
- **Philosophy:** Preserve conceptual clarity; use **meta** for *legal-adjacent* gloss (“privacy rights”, “reputation defence”) where accurate.
- **Risk:** **REVIEW REQUIRED**.

### 3.8 People directory + profiles

- **SEO purpose:** Entity + branded search + E-E-A-T.
- **Directory:** Regional titles already in `peopleDirectoryMeta` — keep.
- **Profiles:** `buildPersonPageTitle` — **truncation priority:** (1) surname visibility, (2) role/practice readability, (3) optional geo in **meta** not title (unless short role).
- **Risk:** **SAFE** for token-only refactors; **REVIEW REQUIRED** for formula changes.

### 3.9 Intelligence (editorial)

- **SEO purpose:** Thought leadership, long-tail, E-E-A-T; **not** commercial landing.
- **Index:** “Intelligence | Schillings” — **do not** rename public “Intelligence” branding without executive/editorial approval (governance §59).
- **Articles:** Headline drives title; preserve editorial voice.
- **Topic / author archives:** Descriptive; meta can clarify “analysis”, “commentary” — avoid sales language.
- **Risk:** **REVIEW REQUIRED** for index/topic templates; **editorial** gate for article-level.

### 3.10 Legal / compliance

- **SEO purpose:** Trust + compliance discovery only.
- **Philosophy:** Plain labels (`Terms | Schillings`); **no** optimization theatrics.
- **Risk:** **REVIEW REQUIRED** with legal; **CRITICAL** if crawl/noindex policy debated.

---

## 4. Meta description philosophy (by family)

| Family | Tone | Structure | CTA | Confidentiality |
|--------|------|-----------|-----|------------------|
| Homepage | Assured, concise | Value + geography | Soft (“Explore…”) | Optional “confidential enquiry” only if true to funnel |
| About | Narrative | Story + scope | Link to people/contact in copy, not spammy CTA | Low key |
| Contact / offices | Utility | Form + offices + urgent line | Direct | **Must** align with qualifying copy |
| Strategic hubs | Authoritative | What + who it’s for | Confidential band *on page*, not always in meta | Optional single phrase |
| Expertise hubs | Commercial-legal | Capability + differentiator | One calm action | Avoid guarantees |
| Situations / WWP detail | Serious | Problem + approach (high level) | Confidential enquiry | Sensitive; no sensationalism |
| Intelligence | Editorial | Thesis or scope | Read / explore | No faux urgency |
| Profiles | Credential-led | Role + expertise + office | Contact routes via page | Professional |
| Legal / compliance | Neutral | What the document is | None / minimal | Factual |

**Keyword density:** Prefer **one** primary cluster and **one** secondary mention in meta; readability beats repetition.

---

## 5. Length & truncation

- **Title:** Target ~50–60 visible characters for priority clauses; brand `| Schillings` preserved where it signals trust.
- **Meta:** ~150–160 characters; avoid duplication of title verbatim.
- **Profiles:** Existing `clipPlainText` / `buildPersonPageTitle` caps — adjust only with **REVIEW REQUIRED** and visual check (long names).

---

## 6. Change classification (SEO copy only)

| Change | Typical class |
|--------|----------------|
| Meta wording tweak, same intent | **SAFE** (single page) to **REVIEW** (template-wide) |
| Title formula change for one family template | **REVIEW REQUIRED** |
| Title formula change across all expertise hubs | **HIGH RISK** (SEO + strategic + analytics) |
| Anything touching `QualifyingForm`, schema shapes, hreflang | **CRITICAL** — excluded from this doc’s implementation |

---

## 7. Related documents

- [`SEO-KEYWORD-INTENT-MAP.md`](./SEO-KEYWORD-INTENT-MAP.md)
- [`SEO-CANNIBALIZATION-RISKS.md`](./SEO-CANNIBALIZATION-RISKS.md)
- [`SEO-IMPLEMENTATION-ROLLUP.md`](./SEO-IMPLEMENTATION-ROLLUP.md)
- [`SEO-SERP-POSITIONING-MATRIX.md`](./SEO-SERP-POSITIONING-MATRIX.md)
- [`SEO-GEO-STRATEGY.md`](./SEO-GEO-STRATEGY.md)
- [`SEO-ENTITY-ARCHITECTURE.md`](./SEO-ENTITY-ARCHITECTURE.md)
