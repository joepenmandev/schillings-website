# Implementation plan — launch, crawl quality, and polish

This is the **single prioritized backlog** for engineering and SEO operations. It extends **`STATUS.md`** (step order) and **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** (§A–L, including Screaming Frog §L) with **acceptance criteria**, **dependencies**, and **what is already shipped**.

**How to use**

1. Complete **milestone M0** (below) before calling production “live.”
2. Run **M1** on the deployed host; export SF **Issues** + **redirect chains** into tickets.
3. Use **M2** for ongoing hygiene; **M3** for brand and editorial.

After each merge: **`cd site && npm run verify`**. After deploy: **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** §0 on staging, full §A–I on production when DNS is final.

---

## Milestones (suggested order)

| Milestone | Focus | Outcome |
|-----------|--------|---------|
| **M0 — Launch-safe** | P0 items + **`STATUS.md`** A–D | Deployed site, form works, apex host, staging not leaking index |
| **M1 — Crawl-clean** | P1 items | SF + GSC baselines; minimal chains; docs accurate |
| **M2 — Steady state** | Redirect backlog, monitoring | CSV/GSC/SF loop; noindex/sitemap drift guarded by CI where possible |
| **M3 — Polish** | P2 | Brand assets, fonts, analytics |
| **M4 — News & bios quality** | P3 | Article/Profile markup parity, listing JSON-LD, hero images, EEAT surfaces |

---

## Shipped baseline (do not re-do)

| Item | Implementation |
|------|----------------|
| Apex canonical | `site` = `https://schillingspartners.com`; fallbacks in `Base.astro` and pages. |
| Public regions | **`/us/`**, **`/ie/`**; **`/en-us/`**, **`/en-ie/`** → **`/us/`**, **`/ie/`** in `vercel.json` + `redirect-map.csv`. |
| UK legacy locale | **`/en-gb/*`** → unprefixed UK paths. |
| XML sitemap | **`noindex`** utilities excluded: **`/search/`**, **`*/contact/thank-you/`** (`astro.config.mjs` filter). |
| Thin migration URLs | News/people sitemap-only slugs without real content excluded via `astro.config.mjs`. |
| Topic hubs | **`getStaticPaths`** and **`NewsBrowseByTopic`** use **`publishedNews()`** only — no routes or nav pills for topics that only appear on **`draft`** articles; avoids **noindex topic pages in sitemap**. |
| Hreflang CI | `verify-build-seo.mjs` — locale homes: canonical + **en-GB / en-US / en-IE / x-default**; **x-default = en-GB**. |
| Regional UX | Footer region links; HTML sitemap regional block; dev vs preview URL behaviour in **`site/README.md`**. |
| Redirect audit | Vitest **`audit-redirect-map-vercel.test.ts`** — every `redirect-map.csv` **old** path matches a **`vercel.json`** **source** pattern. |
| News article JSON-LD | **`buildNewsArticleBlogPostingGraph`** — **`Person`** nodes with stable **`@id`**, **`BlogPosting`** **`isPartOf` WebSite**, **`speakable`**, **`articleSection` / keywords** from topics (`site/src/lib/jsonld-article.ts`). |
| Author archives | **`/news/author/{slug}/`** (UK, **`us/`**, **`ie/`**) + **`NewsAuthorArchiveAside`**, **`publishedNewsAuthorSlugs()`**, list JSON-LD like topic hubs. |
| Archive cards | **`NewsArticleList`** — optional **author avatars + byline links** to bios; **`news-list-authors.ts`**; author hub lists use **`showAuthorByline={false}`** to avoid repetition. |

---

## P0 — Launch blockers (M0)

| ID | Task | Acceptance criteria | Depends on |
|----|------|---------------------|------------|
| **P0.1** | Vercel project: root **`site`**, build output as today | Preview + Production deploy green; **`/`** 200 | Repo access |
| **P0.2** | Env vars per **`site/.env.example`** | At minimum **`CONTACT_WEBHOOK_URL`**, **`PUBLIC_FORM_ENDPOINT=/api/contact`** on Production | P0.1 |
| **P0.3** | Contact form end-to-end | One real submit from **`/contact/`**; webhook payload matches **`api/contact.ts`** schema | P0.2, webhook created (**`STATUS.md`** C) |
| **P0.4** | Apex primary host | **`schillingspartners.com`** primary; **`www`** 301 → apex at **Vercel Domains** (not only path redirects) | DNS |
| **P0.5** | Staging confidentiality | Preview/staging: **`robots.txt` Disallow: /** and/or edge auth — see comments in **`site/public/robots.txt`** | P0.1 |
| **P0.6** | Legacy URL coverage | High-value URLs from **GSC** + **SF List crawl** added to **`redirect-map.csv`**; **`npm run test`** redirect audit passes | Exports |

**Maps to:** **`STATUS.md`** phases A–D (local, deploy, form, compliance). **P0.4–P0.6** overlap E/F.

---

## P1 — Crawl quality & SEO alignment (M1)

| ID | Task | Acceptance criteria | Notes |
|----|------|---------------------|-------|
| **P1.1** | Screaming Frog baseline | Spider from **`https://schillingspartners.com/`** with **Crawl canonicals**, **Extract hreflang**, **Crawl linked XML sitemaps**, **Always follow redirects** ([SF configuration](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/)) | Export **Issues** + **Internal → Redirect chains** |
| **P1.2** | Shorten redirect chains | No **high-traffic** URL with **>1** 301 hop where avoidable. **Implemented:** **`/en-us/expertise`** (and **`/en-ie/expertise`**) → **`/us/services`** / **`/ie/services`** one-hop rules in **`site/vercel.json`** + **`redirect-map.csv`**; **`npm run test`** passes. Re-verify **Internal → Redirect chains** in Screaming Frog after deploy. | [Redirect chains](https://www.screamingfrog.co.uk/seo-spider/issues/response-codes/internal-redirect-chains/) |
| **P1.3** | Sitemap vs indexable | **Issues** tab: **non-indexable URLs in sitemap** empty or justified | Guarded by filters + topic routing; re-check after content changes |
| **P1.4** | Rich Results | Sample **Person**, **Article**, **Organization** URLs pass [Rich Results Test](https://search.google.com/test/rich-results) | SF structured data ≠ Google’s validator |
| **P1.5** | Search Console | Property for apex; submit **`https://schillingspartners.com/sitemap-index.xml`**; watch **Coverage**, **hreflang**, **CWV** | After M0 |
| **P1.6** | Documentation accuracy | Planning + **`site/README.md`**: public paths documented as **`/us/`**, **`/ie/`** where meant for URLs; internal **`Locale`** **`en-us`** / **`en-ie`** called out | Reduces onboarding errors |

**Maps to:** **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** §L (Screaming Frog) and §A–D.

---

## P2 — Product & brand polish (M3)

| ID | Task | Reference |
|----|------|-----------|
| **P2.1** | **OG image** — 1200×630 PNG/JPEG | Replace default SVG when brand supplies |
| **P2.2** | **Esface** WOFF2 + `@font-face` | **`site/README.md`** — Fonts |
| **P2.3** | **Analytics / CMP** | **`ANALYTICS-CONSENT-SPEC.md`** |
| **P2.4** | Editorial **news** **`migrated-unreviewed` → `published`** when signed off; refresh **`news-sitemap-slugs.json`** / **`people-sitemap-slugs.json`** after live IA changes | **`STATUS.md`** E, **`publish:migrated-news`** script |

---

## P3 — News posts, bios & archives (EEAT & Article baseline)

Aligned with **[Google Search Central — Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)** (author best practices, images, dates), **[Profile page markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page)**, and internal **`DESIGN-REFERENCES.md`**. Validate with **[Rich Results Test](https://search.google.com/test/rich-results)** after each batch.

| ID | Task | Acceptance criteria | Primary touchpoints |
|----|------|---------------------|---------------------|
| **P3.1** | **Article visible `<time datetime>`** | Every published article shows **`datePublished`** (and **`dateModified`** when applicable) in HTML as **`<time datetime="ISO-8601">`** matching JSON-LD. | `site/src/pages/**/news/[slug]/index.astro` |
| **P3.2** | **Timezone-aware timestamps** | Where editorial supplies time, store **full ISO 8601** (with offset); stop defaulting all times to **`T12:00:00.000Z`** if a real timestamp exists. JSON-LD and `<time>` stay in sync. | `news` data model, import pipeline, `jsonld-article.ts` |
| **P3.3** | **Article images (raster, multi-aspect)** | Top traffic / hero pieces use **crawlable** WebP or PNG/JPEG; aim for Google’s recommended **~50k+ pixels** and **16×9 / 4×3 / 1×1** where brand supplies crops; avoid **SVG-only** as sole `image` for articles meant for rich results. | `news` data, `absoluteOgImageUrl`, `buildNewsArticleBlogPostingGraph` |
| **P3.4** | **Paginated news JSON-LD** | **`/news/page/N/`** (UK + **`us/`** + **`ie/`**) emits a **listing graph** consistent with page 1 (**`CollectionPage` + `ItemList`** or **`WebPage`** + `isPartOf`) + **breadcrumbs**; not a bare template. | `site/src/pages/**/news/page/[page]/index.astro`, `jsonld-page.ts` |
| **P3.5** | **Author HTML ↔ JSON-LD parity** | Every **visible** byline author appears as a **separate** `author` entry in markup (no merged comma-names); orphan **`authorSlugs`** backfilled or removed. | `NewsArticleList.astro`, `news-imported.json` / stubs, `news-list-authors.ts` |
| **P3.6** | **ProfilePage spot-check loop** | Sample bios pass Rich Results; **`image`** crawlable; **`dateModified`** reflects real updates. | `people` data, `person-jsonld.ts`, `people/[slug]` |
| **P3.7** | **`subjectOf` vs co-authors (optional)** | Document decision: Profile **`BlogPosting`** stubs stay **single-author** vs future enhancement to mirror co-authors; no contradictory claims. | `person-jsonld.ts`, internal note in **`CONTENT-METADATA-SPEC.md`** if needed |
| **P3.8** | **RSS `language` per feed** | Locale feeds use **`en-gb` / `en-us` / `en-ie`** (or equivalent) in **`<channel><language>`** where applicable. | `site/src/pages/**/news/rss.xml` routes, `rss-feed.ts` |
| **P3.9** | **Archive UX (design pass)** | **`DESIGN-REFERENCES.md`** parity: news index / topic / author templates share **card rhythm**; optional numbered pagination beyond prev/next. | `news/index`, `news/topic`, `NewsArticleList`, `DESIGN-REFERENCES.md` |
| **P3.10** | **`migrated-unreviewed` index policy** | Editorial + SEO agree: keep indexable vs **`noindex`** until reviewed; document in **`STATUS.md`** or **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`**. | `news` `status`, `astro.config.mjs` sitemap filter |
| **P3.11** | **CWV on templates** | LCP targets on article hero + bio portrait; avoid layout shift (dimensions on **`img`**). | Article + people templates |
| **P3.12** | **Regression tests** | Extend Vitest where cheap: e.g. paginated page emits graph node count; **`time`** present in built HTML snapshot (optional Playwright). | `site/src/lib/*.test.ts`, e2e |

**Suggested order:** **P3.1 → P3.4 → P3.3 → P3.2** (quick correctness + crawl signals first), then **P3.5–P3.6**, then **P3.8–P3.12**.

**Maps to:** **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** §A (crawl/index), §D (structured data), **`CONTENT-METADATA-SPEC.md`** (`T-article`, `T-person`, `T-news-index`).

---

## Quick wins (optional, low effort)

| Item | Action |
|------|--------|
| **Q1** | Run **`LAUNCH_VERIFY_URL=https://schillingspartners.com npm run verify:launch-urls`** from **`site/`** after deploy (see **`site/package.json`**). |
| **Q2** | Add **`verify:launch-urls`** to release checklist in **`STATUS.md`** verification table if not already routine. |
| **Q3** | PageSpeed Insights on **`/`**, **`/contact/`**, **`/news/`** (lab + field when CrUX exists) — **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** §G2. |

---

## Verification rhythm

| When | Command / artefact |
|------|---------------------|
| Every PR | **`cd site && npm run verify`** |
| After content redirect changes | **`redirect-map.csv`** ↔ **`vercel.json`** + tests |
| After major deploy | SF crawl + GSC sitemap ping |
| Quarterly | Re-export legacy URLs; refresh slug JSON from live sitemap if IA shifted |

---

## Out of scope (this plan)

- Choosing a CMS or headless editorial workflow.
- Legal sign-off on copy (track in **`FOOTER-REGULATORY-CHECKLIST.md`** / compliance).
- Non-SEO accessibility beyond existing **Playwright + axe** on contact (**`site/README.md`**).

---

## Reference index

| Document | Role |
|----------|------|
| **[`STATUS.md`](./STATUS.md)** | Ordered launch phases A–F |
| **[`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`](./TECHNICAL-SEO-LAUNCH-CHECKLIST.md)** | Full SEO gates; **§L** = Screaming Frog |
| **[`site/README.md`](./site/README.md)** | Commands, env, CI, dev vs preview |
| **[`redirect-map.csv`](./redirect-map.csv)** + **[`site/vercel.json`](./site/vercel.json)** | Legacy routing |
| **[Screaming Frog Issues](https://www.screamingfrog.co.uk/seo-spider/issues/)** | Interpreting SF severity |

---

## Changelog

| Date | Change |
|------|--------|
| **2026-05-05** | Plan restructured into milestones M0–M3, P0–P2 acceptance criteria; baseline updated (topic hubs + browse-by-topic use **`publishedNews()`**; utility URLs excluded from sitemap). |
| **2026-05-05** | **P3** added — news posts, bios & archives (EEAT, Article/Profile markup, pagination JSON-LD, images, RSS, CWV). Shipped baseline extended (article graph, author archives, **`NewsArticleList`** bylines). |
