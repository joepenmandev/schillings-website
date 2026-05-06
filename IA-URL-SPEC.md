# Information architecture & URL specification

**Purpose:** Single agreed **path list** and **templates** before build — avoids slug drift, broken hreflang sets, and redirect churn.

**Aligned with:** `HREFLANG-STRATEGY.md` (internal locale keys `en-gb`, `en-us`, `en-ie`; **hreflang** link values use BCP 47 e.g. **`en-GB`**, **`en-US`**, **`en-IE`**; **`x-default`**).

---

## 0. Conventions (locked for this project)

| Rule | Choice |
|------|--------|
| Host | `` (pending DNS confirmation) |
| Lowercase paths | **Yes** |
| Trailing slash | **With** trailing slash (`/contact/`); redirect non-slash → slash |
| **UK (primary)** public URLs | **No** `/en-gb/` segment — site root **`/`** and paths like **`/news/`**, **`/people/`** (canonical **en-GB** cluster; internal data `locale` remains **`en-gb`**) |
| **US / Ireland** public URLs | **`/en-us/…`**, **`/en-ie/…`** (locale prefix required) |
| Legacy **`/en-gb/…`** | **301** to the same path **without** the `/en-gb` segment (e.g. `/en-gb/news/foo/` → `/news/foo/`) — see `site/vercel.json` + `redirect-map.csv` |
| Root **`/`** | **Real UK homepage** (200); not a redirect away from UK content |
| `x-default` | Same URL as **UK** home **`/`** (and same as **`en-GB`** alternate) |
| News pagination | **`/news/page/2/`** (path, not query) |
| Astro source | Implement under repo **`site/`** |

---

## 1. Global & utility pages

Path suffixes below are **relative to the locale root**:

- **UK:** prefix = **none** — e.g. suffix `/contact/` → **`/contact/`**
- **US:** prefix = **`/en-us`** — e.g. **`/en-us/contact/`**
- **IE:** prefix = **`/en-ie`** — e.g. **`/en-ie/contact/`**

| Path suffix | Page purpose | Template | In main nav | In sitemap | Notes |
|-------------|--------------|------------|-------------|------------|-------|
| `/` (locale root) | Locale home | `T-home` | — | Yes | UK at **`/`**; US/IE at **`/en-us/`**, **`/en-ie/`** |
| `/contact/` | Contact + **qualifying form** | `T-contact` | Yes | Yes | See `LEAD-QUALIFICATION.md`; thank-you at `/contact/thank-you/` (`noindex`) |
| `/about-us/` | Firm story (legacy public slug) | `T-landing` | Yes | Yes | Matches live IA; redirect `/about/` → here (`redirect-map.csv`, `vercel.json`) |
| `/compliance/privacy-disclaimer/` etc. | Privacy / complaints / SRA | `T-legal` | Footer | Yes | Public paths on current site — stubs in Astro |
| `/compliance/standard-terms-of-business/` | Standard terms (legacy + PDF links) | `T-legal` | Optional | Yes | Live stack path; stub in Astro — legacy **`/privacy-notice`**, **`/complaints-handling`**, **`/standard-terms-of-business*`** → **UK compliance paths** (no `/en-gb/`) in **`vercel.json`** + **`redirect-map.csv`** |
| `/careers/` | Careers | `T-landing` | Optional | Yes | Stub in repo — **`utilityFooterNav`** + **`MarketingStubNav`** |
| `/legal/privacy-notice/` | Internal draft / dev privacy | `T-legal` | Optional | Yes | Public equivalent: **`/compliance/privacy-disclaimer/`** |
| `/legal/cookies/` | Cookie policy | `T-legal` | Footer | Yes | Stub in repo — **`SiteFooter`** + **`legalFooterNav`** in `site-nav.ts` |
| `/legal/terms/` | Terms | `T-legal` | Footer | Optional | Stub — link to **Standard Terms** where relevant |
| `/legal/regulatory/` | SRA / multi-entity disclosures | `T-legal` | Footer | Yes | Stub — cross-link **`/compliance/schillings-sra/`**; per `FOOTER-REGULATORY-CHECKLIST.md` |
| `/accessibility/` | Accessibility statement | `T-legal` | Footer | Yes | Stub in repo — **`utilityFooterNav`**; replace with approved statement before publishing |
| `/complaints-handling/` | Complaints | `T-legal` | Footer | Yes | If separate from regulatory |

**Shared assets:** `/favicon.ico`, `/robots.txt`, `/sitemap-index.xml` — **locale-agnostic** at domain root where applicable.

---

## 2. Expertise / practice hubs

**Canonical pattern (this Astro build):** UK **`/expertise/`** and **`/expertise/{expertiseId}/`** (no locale prefix); US **`/us/expertise/`** and **`/us/expertise/{expertiseId}/`**; Ireland **`/ie/expertise/`** and **`/ie/expertise/{expertiseId}/`**. Controlled **`expertiseId`** slugs live in **`site/src/data/people-taxonomy.ts`** (`EXPERTISE_IDS`). Legacy **`/en-us/…`** and **`/en-ie/…`** URLs **301** to **`/us/…`** and **`/ie/…`** (`site/vercel.json`).

| Path suffix (UK examples) | Public title | Template | In sitemap | Transparency link? |
|-------------|--------------|----------|------------|-------------------|
| `/expertise/` | Expertise index | `T-expertise-index` | Yes | |
| `/expertise/{expertiseId}/` | Capability hub | `T-expertise-hub` | Yes | Per compliance |
| `/expertise/{expertiseId}/{sub}/` | Deep topic (if used) | `T-expertise-article` | Yes | Only if distinct |

**Retired on this site:** Public **`/services/…`** routes are **not** implemented; the XML sitemap and internal links use **`/expertise/…`** only.

**Production cutover:** The new stack is **not** live on the production domain yet, so this repo does **not** define redirects from legacy **`/services/…`** (or other old-host paths) to **`/expertise/…`**. When DNS and hosting cut over, add **`redirect-map.csv`** / CDN rules so bookmarks and inbound links land on the correct **`/expertise/{expertiseId}/`** (or index) URLs.

**Implementation:** New internal links must target the **`expertise`** segment (e.g. **`localeHref` / `publicPathname`** with paths under **`expertise/…`**), not **`services/…`**.

---

## 3. Sectors / audiences (optional)

**Pattern:** UK **`/sectors/…`**; US/IE **`/en-us/sectors/…`**, etc.

| Path suffix | Template | In sitemap |
|-------------|----------|------------|
| `/sectors/` | `T-sectors-index` | Yes |
| `/sectors/{slug}/` | `T-sector-hub` | Yes |

---

## 4. People

**Pattern:** UK **`/people/`**, **`/people/{slug}/`**; US/IE with **`/en-us`**, **`/en-ie`** prefix.

| Path suffix | Template | In sitemap | Notes |
|-------------|----------|------------|-------|
| `/people/` | `T-people-index` | Yes | Filters: document query vs path |
| `/people/{slug}/` | `T-person` | Yes | Schema + compliance |

---

## 5. News, insights, hubs

| Path suffix | Template | In sitemap | Notes |
|-------------|----------|------------|-------|
| `/news/` | `T-news-index` | Yes | |
| `/news/page/{n}/` | `T-news-index` | Yes | Pagination |
| `/news/topic/{slug}/` | `T-news-topic` | Yes | Legacy CMS category labels → hub listing (published articles only) |
| `/news/{slug}/` | `T-article` | Yes | |
| `/news/rss.xml/` | Static RSS (`T-feed`) | No | `application/rss+xml`; per-locale feed URLs (UK `/news/rss.xml/`, etc.) |
| `/reports/{slug}/` | Long-form / PDF landing | Yes | Optional section |
| `/topics/{slug}/` | `T-topic-hub` | Yes | EU litigation / takedowns etc. — **en-ie** may own some topics |

---

## 6. Locale matrix & hreflang

| Internal `locale` | Typical public home | `hreflang` (link attribute) | Primary entity / narrative |
|-------------------|---------------------|----------------------------|----------------------------|
| `en-gb` | **`/`** | **`en-GB`** | Schillings International LLP (SRA); **`x-default`** target |
| `en-us` | **`/en-us/`** | **`en-US`** | US LLP / US audience |
| `en-ie` | **`/en-ie/`** | **`en-IE`** | Schillings Ireland LLP; **EU litigation** & **platform / social takedown** gateway content |

**Rules:**

- Each **indexable** page that exists in **all three** locales carries a **full** alternate set in `<head>` (or sitemap `xhtml:link`). **`x-default`** and **`en-GB`** point at the **same** UK URL.
- Pages **only** in one locale (e.g. Ireland-only topic): **no** hreflang except do not invent fake alternates.
- Optional future **`en`**: document in `HREFLANG-STRATEGY.md` before adding.

---

## 7. Excluded from index

| Path pattern | Reason |
|--------------|--------|
| `/api/*` | Endpoints |
| Search / filtered URLs with params | `noindex` where thin |
| `/contact/thank-you/` | Utility | `noindex` |
| **`/news/{slug}/`** and **`/people/{slug}/`** (UK) **or** prefixed US/IE equivalents — **migration scaffolds** (slug in sitemap list but not yet published in data) | Thin placeholder | `noindex` (and omitted from XML sitemap per `astro.config.mjs` filter) |
| Staging host | `robots disallow` |

---

## 8. Sign-off

| Role | Name | Date |
|------|------|------|
| Marketing / brand | | |
| SEO / digital | | |
| Compliance | | |
| Engineering lead | | |

---

*Related: `HREFLANG-STRATEGY.md`, `ENTITY-SERVICES-MATRIX.md`, `REDIRECT-MAP.md`, `LEAD-QUALIFICATION.md`, `site/README.md`*
