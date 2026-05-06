# Visual system alignment — audit & implementation spec

**Purpose:** Document the **current** visual patterns per template family, propose **shared primitives** without flattening pages into one layout, and outline a safe implementation order.

**Constraints (this document):** Spec only. No requirement to make all pages identical — **template families** keep intentional differences (reading measure, hero complexity, form UX).

**Stack reference:** Astro components + Tailwind v4 tokens in `site/src/styles/global.css` (`secondary-*`, `utility-*`, `brand-*`, `font-serif` / `font-sans`).

---

## Shared layout primitive (today)

### `DocumentMain.astro`

| Prop | Main element width | Notes |
|------|-------------------|--------|
| `contentWidth="wide"` (default when used) | `max-w-[min(88rem,calc(100%-1.5rem))]` | ~“wide shell”; inner articles often add their own `max-w-*`. |
| `contentWidth` omitted / `"default"` | `max-w-3xl` | Standard prose column. |
| `class="..."` | Overrides width entirely | **Contact** passes `class="max-w-3xl"` so the whole page stays narrow. |

**Padding rhythm (all `DocumentMain`):**  
`py-12` + horizontal `px-[min(1.25rem,5.5vw)]` → `md:px-[min(4rem,5vw)]` → `lg:px-[min(5rem,6vw)]`.

**Important:** Many templates use **`DocumentMain` wide** plus an inner **`article`** with **`max-w-6xl`** (hubs) or **`max-w-3xl`** (strategic details). Width is **two-layer**: shell vs article.

---

## Family audits

### 1. Strategic hubs

**Examples:** `/situations/`, `/what-we-protect/`, `/response-system/`, `/expertise/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | `DocumentMain` **wide** → inner `article` **`mx-auto max-w-6xl`**. Intro copy often **`max-w-3xl`** inside the wide article. Grids use full article width. |
| **2. Breadcrumb** | Inline `<nav aria-label="Breadcrumb">`: **`text-xs font-normal text-secondary-3`**. Links use shared `crumbClass` (secondary-2 underline, hover to secondary-3). Separator `/` with **`text-secondary-2/50`**. Current crumb **`text-secondary-4`**. |
| **3. H1** | **`font-serif`**, `text-3xl` → **`md:text-[3.125rem] md:leading-[1.1]`**, `font-extralight`, `text-secondary-4`, `tracking-tight`. |
| **4. Intro** | **`mt-6 max-w-3xl`**, `text-pretty`, **`text-base font-extralight`** (WWP/Situations/Response) or **`font-normal`** on some lines; `md:text-[1.05rem] md:leading-[1.65]`, `text-secondary-3`. |
| **5. Section kicker** | **`text-xs font-medium uppercase tracking-[0.18em] text-secondary-2`** (local const `sectionKicker` / `sectionTitle` naming varies). |
| **6. Card** | Hub grid links: **`rounded-sm border border-secondary-2/20 bg-utility-1/90`**, padding `px-5 py-5` → `md:px-6 md:py-6`, hover **`hover:border-secondary-3/35 hover:bg-utility-2/50`**. Titles **`font-serif text-lg md:text-xl font-extralight`**. Response pillars use similar shell without always being links. |
| **7. CTA** | (a) **Cross-link bands:** `rounded-lg border border-secondary-2/15 bg-utility-1/90` + text link **`text-sm font-medium`** + underline tokens. (b) **Primary CTA block:** `rounded-sm border border-secondary-2/20 bg-utility-2/35` + **`inline-flex min-h-[2.75rem] ... rounded-sm bg-secondary-4 ... text-brand-white`** button. (c) Optional **`MarketingStubNav`**. |
| **8. Spacing** | Header `mt-8 md:mt-10`; first section `mt-12 md:mt-14`; cross-blocks `mt-14 md:mt-16`; CTA strip `mt-12 md:mt-14`. |
| **9. Preserve** | **Wide grid** for scanability; **6xl** article cap; **two cross-link bands** (response + WWP) on Situations index; pillar **4-column** grid on Response system. |
| **10. Files** | `SituationsIndexPage.astro`, `WhatWeProtectIndexPage.astro`, `ResponseSystemPage.astro`, `ExpertiseIndexShell.astro`, `ExpertiseIndexCards.astro`, page entrypoints under `site/src/pages/…/index.astro` (+ `us/` / `ie/` mirrors). |

---

### 2. Strategic details

**Examples:** `/situations/{slug}/`, `/what-we-protect/{slug}/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | `DocumentMain` **wide** → inner **`article mx-auto max-w-3xl`** (narrow reading column; **not** 6xl). |
| **2. Breadcrumb** | Same inline pattern as hubs (`text-xs`, `crumbClass`). |
| **3. H1** | Same hub H1 stack (`font-serif`, `md:text-[3.125rem]`, …). |
| **4. Intro** | Lead paragraph often **`font-normal`** (vs hub **`font-extralight`** on index intros — small nuance). |
| **5. Section kicker** | Same **`sectionTitle`**: `text-xs font-medium uppercase tracking-[0.18em] text-secondary-2`. Body sections use bullet rows with dot markers (`bg-secondary-3/70` / `bg-secondary-2`). |
| **6. Card** | **No** hub-style grid cards; **related links** as underlined **`text-base font-extralight`** list items. |
| **7. CTA** | **`bg-utility-2/35`** strip + **`sr-only` h2** + primary **purple button** (same classes as hub confidential CTA). Footer **← All situations** / similar **`text-sm font-medium`** back link. |
| **8. Spacing** | Sections **`mt-10 md:mt-12`**; CTA **`mt-12 md:mt-14`**. |
| **9. Preserve** | **3xl** measure for long-form; related lists stay compact; **per-situation CTA label** from data. |
| **10. Files** | `SituationDetailPage.astro`, `WhatWeProtectDetailPage.astro`, dynamic pages `situations/[slug]`, `what-we-protect/[slug]` (+ mirrors). |

---

### 3. Expertise hub detail (strategic-adjacent)

**Examples:** `/expertise/reputation-privacy/`, etc.

Treated as its own **detail** family for content (service hub copy, legal note aside, people grid) but shares **width + typography** with strategic details.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | Same as strategic details: **wide `DocumentMain` + `article max-w-3xl`**. **Exception:** People grid **`sm:grid-cols-2 lg:grid-cols-3`** breaks out in width **inside** the article column (cards, not full-bleed 6xl). |
| **2. Breadcrumb** | Same inline **`text-xs`** pattern; middle link “Expertise”. |
| **3. H1** | Label from taxonomy; same serif scale as strategic details. |
| **4. Intro** | From `getServiceHubCopy`; **`font-normal`** lead. |
| **5. Section kicker** | Same **`sectionTitle`** token chain. |
| **6. Card** | **`PersonColleagueCard`** (`rounded-lg`, `border-secondary-2/20`, `bg-utility-2/55`, ring/shadow) — **different** from hub **`rounded-sm bg-utility-1/90`** cards. |
| **7. CTA** | Same **`utility-2/35` + purple button** as strategic details; **← Expertise** back link. **`ServiceHubInternalNav`** between aside and people. |
| **8. Spacing** | Matches detail spacing (`mt-10 md:mt-12`, CTA `mt-12 md:mt-14`). |
| **9. Preserve** | Legal note **aside**; internal nav; **people grid** density. |
| **10. Files** | `ExpertiseHubDetail.astro`, `ServiceHubInternalNav.astro`, `PersonColleagueCard.astro`, `expertise/[slug]/index.astro` (+ mirrors). |

---

### 4. People directory

**Examples:** `/people/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | `DocumentMain` **wide**; **no** wrapping **`article max-w-6xl`**. **`PeopleDirectory`** internals: e.g. **`max-w-5xl`** for filter cluster, **`max-w-xl`** for some controls — **effective layout wider / looser** than hub article box. |
| **2. Breadcrumb** | **None** on page (reliance on global nav + H1). |
| **3. H1** | **`font-serif`** but scale **`md:text-4xl`**, **`lg:text-[2.875rem]`** — **not** identical to hub **`md:text-[3.125rem]`**. |
| **4. Intro** | Two paragraphs: **`mt-4` / `mt-3`**, **`max-w-3xl`**, first **`text-base`**, second **`text-sm md:text-base`**. |
| **5. Section kicker** | Filter region uses **`sr-only`** headings and pill UI — **no** strategic section kicker. |
| **6. Card** | Directory grid uses **`PersonColleagueCard`** (see Expertise). |
| **7. CTA** | **`MarketingStubNav`** only (no confidential strip). |
| **8. Spacing** | Intro → **`PeopleDirectory`** `mt-8 md:mt-10` inside component; stub nav after directory. |
| **9. Preserve** | **Filter UX** (JS, query params); **grid density**; optional **no breadcrumb** if IA stays flat. |
| **10. Files** | `site/src/pages/people/index.astro` (+ mirrors), `PeopleDirectory.astro`, `PersonColleagueCard.astro`. |

---

### 5. Person profiles

**Examples:** `/people/craig-edwards/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | `DocumentMain` **wide**; **`article`** has **no** global max-width. **Header** **`max-w-6xl`** flex (text + optional photo). **Biography** **`max-w-[52rem]`** — **between 3xl and 6xl**. |
| **2. Breadcrumb** | **No** visible breadcrumb trail (JSON-LD breadcrumbs exist). |
| **3. H1** | Name: **`font-serif`**, `md:text-4xl`, **`lg:text-[2.75rem]`** — close to directory, **not** hub `3.125rem`. |
| **4. Intro** | **Subline** under H1: **`font-serif text-xl md:text-2xl italic`**, `text-secondary-4`; optional locale note **`text-sm`**. |
| **5. Section kicker** | Biography: **`text-xs font-medium uppercase tracking-[0.18em] text-secondary-2`** — aligns with strategic **`sectionTitle`**. **`PersonContactCta`** uses **`text-sm font-medium uppercase tracking-wide text-secondary-2`** (different kicker). |
| **6. Card** | N/A for main body; related content via subsection components. |
| **7. CTA** | **`PersonContactCta`**: **`rounded-xl`**, `bg-utility-2/45`, **`rounded-lg`** button with **border** on button (vs strategic **filled-only** `rounded-sm` button). **`PersonPublicContact`**, **`PersonContactCta`**, back link **← People**. |
| **8. Spacing** | **`mt-12`** biography; subcomponents **`mt-10`**. |
| **9. Preserve** | **Photo sticky** behavior; **52rem** bio measure; **thin profile** variants; **no fake breadcrumb** if product prefers minimal chrome. |
| **10. Files** | `people/[slug]/index.astro` (+ mirrors), `PersonTrustSignals.astro`, `PersonPublicContact.astro`, `PersonProfileContextSections.astro`, `PersonContactCta.astro`, `PersonNewsByline.astro`, `PersonRelatedAndExplore.astro`. |

---

### 6. Intelligence index

**Examples:** `/news/` (brand string **“Intelligence”** in UI).

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | **`NewsArchiveIndexHero`** **outside** `DocumentMain`: full-width band, inner **`max-w-[min(88rem,calc(100%-1.5rem))]`** (matches wide shell). Below: **`DocumentMain` wide** for list + pagination. |
| **2. Breadcrumb** | **None** in hero or main (breadcrumb JSON-LD on index via graph). |
| **3. H1** | In hero: **`font-serif`**, responsive `text-[1.75rem]` → **`md:text-[2.45rem]`** — **smaller scale family** than strategic hubs. **Accent bar** (gradient vertical rule) beside title. |
| **4. Intro** | Hero subtitle: **`font-serif italic`**, `text-[0.95rem]` → `md:text-lg`, `text-secondary-3`. |
| **5. Section kicker** | **`sr-only`** “More analysis” for grid; **filters** in hero (`NewsArchiveFilters`). |
| **6. Card** | **`NewsArticleEditorialCard`**: **`rounded-lg`**, `bg-brand-white`, image **square aspect**, shadow/hover lift — **magazine** treatment vs hub **`rounded-sm` utility cards**. |
| **7. CTA** | Topic strip, pagination, **`MarketingStubNav`**. No confidential strip. |
| **8. Spacing** | Hero `pt-8` / `md:pt-9`; featured block **`mt-8 md:mt-10`**; list **`mt-12 border-t pt-12`**. |
| **9. Preserve** | **Split hero** (book-style) and **editorial cards**; **URL `/news/` vs label Intelligence** is a content/IA decision. |
| **10. Files** | `news/index.astro` (+ mirrors), `NewsArchiveIndexHero.astro`, `NewsArchiveFeaturedHero.astro`, `NewsArticleList.astro`, `NewsArticleGrid.astro`, `NewsArticleEditorialCard.astro`, `NewsTopicStrip.astro`, `NewsPaginationNav.astro`. |

---

### 7. Intelligence articles

**Examples:** `/news/{slug}/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | `DocumentMain` **wide**; **`NewsArticlePostHero`** is full-width **within** main column (large **book-style** header). Body: outer **`article-body`** panel **`rounded-lg border bg-utility-1/90`** with padding; inner prose **`mx-auto max-w-3xl`** — **narrow reading measure inside wide tinted band**. |
| **2. Breadcrumb** | Not shown inline; JSON-LD breadcrumbs. |
| **3. H1** | Inside hero: **`font-serif`**, **`font-normal`** (not extralight), `text-[1.65rem]` → `lg:text-[2.2rem]`, color **`#3c3b39`** — **distinct editorial stack**. |
| **4. Intro** | Topics / bylines / date in hero; **no** single “intro paragraph” under H1. |
| **5. Section kicker** | N/A in body (continuous **`p` tags**). |
| **6. Card** | N/A in body; related content in **`NewsArticleAuthorFoot`**, **`NewsArticleLatestByAuthors`**. |
| **7. CTA** | **← Back to Intelligence** `text-sm font-medium underline` (simpler than strategic back link decoration). |
| **8. Spacing** | Body **`mt-10 md:mt-12`** after hero; paragraph **`space-y-5`**. |
| **9. Preserve** | **Hero complexity** and **3xl body measure** for readability; **editorial H1 weight**. |
| **10. Files** | `news/[slug]/index.astro` (+ mirrors), `NewsArticlePostHero.astro`, `NewsArticleAuthorFoot.astro`, `NewsArticleLatestByAuthors.astro`. |

---

### 8. About

**Examples:** `/about-us/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | **Custom `<main>`** (no `DocumentMain`). Sections with **`px-[min(1.25rem,5.5vw)] md:px-[min(5rem,5.5vw)]`** and inner **`max-w-4xl`** (hero/breadcrumbs) or **`max-w-3xl`** (story columns). **Leadership grid** `lg:grid-cols-4`. |
| **2. Breadcrumb** | **`PageBreadcrumbs`** — **`text-sm`**, links **`font-medium`**, slash separator **`text-secondary-2/90`** (different from strategic inline crumbs). |
| **3. H1** | Hero: **`font-serif`**, **`clamp(2rem,5vw,3.25rem)`**, centered. |
| **4. Intro** | Hero lead: **`font-serif text-lg md:text-xl`**, `max-w-3xl`, centered. |
| **5. Section kicker** | Often **`text-xs font-medium uppercase tracking-[0.18em]`** on **`text-secondary-2`** or **`text-brand-white/80`** on dark band — **matches strategic kicker** in spirit. **H2** sections use **serif clamp** titles, not hub H1 scale. |
| **6. Card** | **`PersonColleagueCard`** for leadership feature grid. |
| **7. CTA** | Mostly **text links** with **`underline-offset-[5px]`** (vs **`0.2em`** elsewhere). Dark section **white** link treatments. **`MarketingStubNav`** + **`HomeExploreStrip`**. |
| **8. Spacing** | Section **`py-16 md:py-24`**; large vertical rhythm. |
| **9. Preserve** | **Multi-band storytelling**, **centered hero**, **inverted mission band** (`bg-secondary-4`). |
| **10. Files** | `about-us/index.astro` (+ mirrors), `AboutUsRegional.astro`, `PageBreadcrumbs.astro`, `HomeExploreStrip.astro`. |

---

### 9. Contact

**Examples:** `/contact/`.

| Dimension | Pattern |
|-----------|---------|
| **1. Width** | **`DocumentMain class="max-w-3xl"`** — **entire page** narrow (strongest constraint on this list). Inner sections often **`max-w-2xl`**. |
| **2. Breadcrumb** | **`PageBreadcrumbs`** (`text-sm` variant). |
| **3. H1** | **“Contact us”** — **`text-3xl md:text-[3.125rem]`** but **no `font-serif`** on H1 in `ContactPageBody` (sans/ body stack). |
| **4. Intro** | **`max-w-2xl`**, **`font-serif text-lg md:text-xl`**, disclaimer content. |
| **5. Section kicker** | **`text-sm font-semibold uppercase tracking-[0.14em] text-secondary-3`** — **heavier and larger** than strategic **`text-xs`** kickers. |
| **6. Card** | **Office grid**: **`rounded-lg border bg-utility-2/40`**, `sm:grid-cols-3`. |
| **7. CTA** | Phone + links; **`QualifyingForm`** slot; **`MarketingStubNav`**. |
| **8. Spacing** | **`mt-10`** between **`border-t`** sections. |
| **9. Preserve** | **Form-first** narrow layout; **compliance** copy density; **office cards** compact grid. |
| **10. Files** | `contact/index.astro` (+ mirrors), `ContactPageBody.astro`, `QualifyingForm` (and related), `PageBreadcrumbs.astro`. |

---

## Proposed canonical primitives

These are **targets for consolidation** (new thin Astro components or shared class maps in one module). Names are suggestions.

### 1. Canonical breadcrumb primitive

**Recommendation:** Single **`PageChromeBreadcrumb.astro`** (or extend **`PageBreadcrumbs.astro`**) with variants:

| Variant | Use |
|---------|-----|
| **`strategic`** | `text-xs`, `text-secondary-3` nav; link style matching current `crumbClass` (secondary-2 underline, hover secondary-3); current `text-secondary-4` **without** `font-medium` on links (today strategic links are not bold). |
| **`marketing`** | Current **`PageBreadcrumbs`** look: `text-sm`, **`font-medium`** links — for About, Contact, or any page that already uses that affordance. |

**Do not** force one variant everywhere: **strategic hubs/details** vs **form/marketing** pages can keep different **density**.

---

### 2. Canonical hero / H1 primitive

**Recommendation:** **`PageHeroTitle.astro`** props: `variant: 'hub' | 'detail' | 'directory' | 'editorial' | 'contact' | 'about-hero'`.

| Variant | Intended families |
|---------|-------------------|
| **`hub`** | Strategic hubs + Expertise index — `font-serif`, `md:text-[3.125rem]`, extralight. |
| **`detail`** | Strategic details, Expertise hub detail — same as hub (option: `font-normal` lead below). |
| **`directory`** | People index — align **either** to hub scale **or** document intentional smaller scale. |
| **`editorial`** | Intelligence article hero — `font-normal`, responsive sizes, optional accent bar slot. |
| **`contact`** | Optional serif H1 for parity, or explicit sans H1 with token documentation. |
| **`about-hero`** | Clamp, centered — **only** About. |

**Goal:** **Document and centralize** sizes; not necessarily **one H1 for all**.

---

### 3. Canonical section kicker primitive

**Recommendation:** **`SectionKicker.astro`** with:

- **Default:** `text-xs font-medium uppercase tracking-[0.18em] text-secondary-2` (strategic standard).
- **`emphasis`:** Contact-style `text-sm font-semibold uppercase tracking-[0.14em] text-secondary-3` when form sections need stronger hierarchy.
- **`onDark`:** `text-brand-white/80` for About mission band.

**Map `PersonContactCta` h2** to default or `emphasis` for consistency.

---

### 4. Canonical CTA band primitive

**Recommendation:** **`CtaConfidentialBand.astro`** with props:

- `tone: 'utility-2' | 'utility-1'` matching `bg-utility-2/35` vs `bg-utility-1/90` bands.
- `primaryAction`: slot or href + label.
- Optional `srOnlyHeading` text.

**Second primitive:** **`CtaTextLink.astro`** for repeated `text-sm font-medium` + underline offset tokens (strategic cross-links vs About `5px` offset — **choose one standard**).

**Person profile CTA:** Either adopt **same button** as strategic (`rounded-sm`, no border on button) or document **profile** as intentional **rounded-lg + border** variant inside the primitive API.

---

### 5. Canonical card primitive

**Recommendation:** Split by **intent**, not one card for everything:

| Primitive | Families | Notes |
|-----------|----------|--------|
| **`HubLinkCard`** | Situations, WWP, Expertise index | `rounded-sm`, `bg-utility-1/90`, min-height, line-clamp body. |
| **`EditorialCard`** | Intelligence grid | Image-forward, `rounded-lg`, white surface, shadow motion. |
| **`ProfileCard`** | People directory, expertise people grid, About | **`PersonColleagueCard`** remains source; extract **shell classes** to a shared partial or `profileCardTokens`. |
| **`OfficeCard`** | Contact | Small grid cell treatment. |

**Goal:** **Name and freeze** the three visual languages (utility tile vs editorial vs portrait).

---

### 6. Width rules by template family

| Family | `DocumentMain` | Inner article / hero | Body / prose |
|--------|----------------|----------------------|--------------|
| Strategic hub | `wide` | `max-w-6xl` | Intro `max-w-3xl`; grids full **article** width |
| Strategic detail | `wide` | `max-w-3xl` | Same |
| Expertise hub detail | `wide` | `max-w-3xl` | Same; grids inside column |
| People directory | `wide` | *none* (optional future wrapper) | Filters ~`max-w-5xl`; cards fluid in wide shell |
| Person profile | `wide` | *none* | Header `max-w-6xl`; bio `max-w-[52rem]` |
| Intelligence index | Hero outside main; then `wide` | Hero inner 88rem cap | — |
| Intelligence article | `wide` | Hero full column | Body panel wide; prose **`max-w-3xl`** |
| About | *custom main* | Section `max-w-3xl` / `max-w-4xl` | Preserve bands |
| Contact | **`max-w-3xl`** (forced on `DocumentMain`) | — | Sections `max-w-2xl` |

---

## Implementation order (suggested)

1. **Tokens only (no visual change):** Extract repeated class strings into a **`page-chrome.ts`** or **`visual-tokens.ts`** re-exported by components — **snapshot tests** or Storybook optional.
2. **Breadcrumbs:** Unify **`PageBreadcrumbs`** + strategic inline nav under one component with **`variant`** — **low user-visible risk** if classes match exactly.
3. **Section kickers + CTA bands:** Replace duplicated **`h2` + strip** blocks in strategic templates — **medium risk** (spacing regression).
4. **H1 primitive:** Roll out **hub/detail** first; **editorial** and **about** last (most bespoke).
5. **Cards:** Refactor **`ExpertiseIndexCards`** and hub grids to **`HubLinkCard`**; keep **Editorial** separate.
6. **People / Contact / About:** Align **only** where product approves (e.g. People H1 scale vs hubs); **do not** wrap About in `DocumentMain` unless IA agrees to lose banded layout.

---

## Risks

| Risk | Mitigation |
|------|------------|
| **Over-unification** | Explicit **variants** per family; preserve **3xl vs 6xl vs 52rem** rules. |
| **Regression in vertical rhythm** | Diff snapshots or Percy; compare **key URLs** (`/situations/`, `/situations/.../`, `/people/`, `/news/.../`, `/about-us/`, `/contact/`). |
| **Editorial identity dilution** | Keep **`NewsArticlePostHero`** and **EditorialCard** separate from **HubLinkCard**. |
| **Contact form UX** | Narrow **`max-w-3xl`** is intentional; do not widen without stakeholder sign-off. |
| **Hreflang / locale mirrors** | Any template change must be applied to **`en-gb`**, **`us/`**, **`ie/`** entrypoints consistently. |

---

## Files likely touched (future implementation)

**High probability:**  
`DocumentMain.astro`, `PageBreadcrumbs.astro`, `SituationsIndexPage.astro`, `SituationDetailPage.astro`, `WhatWeProtectIndexPage.astro`, `WhatWeProtectDetailPage.astro`, `ResponseSystemPage.astro`, `ExpertiseIndexShell.astro`, `ExpertiseIndexCards.astro`, `ExpertiseHubDetail.astro`, `people/index.astro`, `people/[slug]/index.astro`, `PersonContactCta.astro`, `news/index.astro`, `news/[slug]/index.astro`, `NewsArchiveIndexHero.astro`, `AboutUsRegional.astro`, `contact/index.astro`, `ContactPageBody.astro`.

**Medium probability:**  
`NewsArticleEditorialCard.astro`, `NewsArticleGrid.astro`, `PersonColleagueCard.astro`, `MarketingStubNav.astro` (if footer chrome expands).

**New (proposed):**  
`site/src/components/page-chrome/PageHeroTitle.astro`, `SectionKicker.astro`, `CtaConfidentialBand.astro`, `HubLinkCard.astro`, `visual-tokens.ts` (or similar) — exact paths TBD by implementer.

---

## Report summary

| Item | Summary |
|------|---------|
| **Proposed primitives** | Variant-based **breadcrumb**, **hero/H1**, **section kicker**, **CTA band** (+ text link), **card families** (hub / editorial / profile / office), plus **documented width table**. |
| **Implementation order** | Tokens → breadcrumbs → kickers/CTAs → H1 → cards → optional People/About/Contact alignment. |
| **Risks** | Rhythm regression, editorial dilution, accidental contact widening, mirror locale drift. |
| **Files likely touched** | Listed above; strategic + people + news + about + contact clusters. |

---

*Last updated: spec authored against current `site/src` layout. Update this doc when primitives land or when new template families are added.*
