# Technical SEO — pre- and post-launch checklist

**Purpose:** Crawl, indexation, international, and quality gates before and after go-live.

**Primary references:** [Google Search Central](https://developers.google.com/search/docs); [Site moves](https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes); [Localized versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions); [Core Web Vitals](https://web.dev/articles/vitals); [Screaming Frog SEO Spider — User Guide](https://www.screamingfrog.co.uk/seo-spider/user-guide/); [Screaming Frog — Issues (300+)](https://www.screamingfrog.co.uk/seo-spider/issues/) (interpret with context — not every issue applies to every site).

---

## 0. Pre-flight (local / CI — before staging)

| Check | Done |
|-------|------|
| **`npm run build`** (repo root or `site/`) completes; page count stable | ☐ |
| Spot-check **`site/dist/index.html`** (UK homepage): no accidental **`noindex`**; **`lang`** on `<html>` matches locale (**`en-GB`** for UK — see `CONTENT-METADATA-SPEC.md`) | ☐ |
| Spot-check **`site/dist/sitemap-0.xml`**: migration placeholders (**news/people** not in `news.ts` / `people.ts`) are **absent** (filtered in **`astro.config.mjs`**) | ☐ |
| **`robots.txt`** in **`site/public/`** — production allows crawl; **staging** must disallow or password-gate | ☐ |

When a **staging URL** exists (e.g. Vercel Preview), re-run **§A–I** against that host, then again on **production** after DNS. For **Screaming Frog** crawl settings and Issues-tab triage mapped to official docs, use **§L**.

---

## A. Environment & crawling

| Check | Done |
|-------|------|
| **Staging** blocked via `robots.txt` and/or auth (no accidental index) | ☐ |
| **Production** `robots.txt` allows important sections; disallows admin/draft/search if applicable | ☐ |
| No unintended **noindex** sitewide (meta or header) | ☐ |
| **HTTPS** everywhere; HTTP → HTTPS **301** | ☐ |
| **HSTS** enabled (with careful rollout) | ☐ |
| **www / apex** single canonical host; other **301** | ☐ |
| **Trailing slash** policy matches `IA-URL-SPEC.md` | ☐ |

---

## B. URLs, redirects, migration

| Check | Done |
|-------|------|
| `redirect-map.csv` complete; **301** for every retired URL that had traffic/links | ☐ |
| No long **redirect chains** (fix to one hop where possible) | ☐ |
| Internal links point to **final** URLs, not redirects | ☐ |
| **404** template helpful; true removals return 404/410 as appropriate | ☐ |
| Soft 404s checked (thin pages with 200) | ☐ |

---

## C. Indexation signals

| Check | Done |
|-------|------|
| **Canonical** on templates; self-referencing on indexable pages | ☐ |
| **Pagination** handled (rel or clean paths—consistent with IA spec) | ☐ |
| **XML sitemap(s)** include only **indexable** canonical URLs | ☐ |
| Sitemap submitted in **Search Console** | ☐ |
| `lastmod` reflects real changes (avoid noise) | ☐ |
| **`migrated-unreviewed`** news: currently **indexable** like `published` (routes + sitemap). If policy changes to hold unreviewed pieces out of the index, set **`noindex`** on those templates and exclude them from the sitemap filter in **`astro.config.mjs`** after editorial/SEO sign-off | ☐ |

---

## D. International (if applicable)

| Check | Done |
|-------|------|
| **Hreflang** clusters complete and **reciprocal** (`ENTITY-SERVICES-MATRIX.md`) | ☐ |
| **`x-default`** set where strategy defines it | ☐ |
| **`hreflang`** values are **BCP 47** (**`en-GB`**, **`en-US`**, **`en-IE`** — not **`en-uk`**) | ☐ |
| No hreflang pointing to **redirects** or **non-200** URLs | ☐ |

---

## E. Page-level metadata

| Check | Done |
|-------|------|
| Unique **`<title>`** and **meta description** on key templates (`CONTENT-METADATA-SPEC.md`) | ☐ |
| One **H1**; sensible heading hierarchy | ☐ |
| `lang` attribute on `<html>` | ☐ |

---

## F. Structured data

| Check | Done |
|-------|------|
| [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) respected | ☐ |
| **Organization** / **LegalService** (or equivalent) on global templates as approved | ☐ |
| **LocalBusiness** or office variants only where accurate | ☐ |
| **Person** / **Article** where used; validate in Rich Results Test | ☐ |

---

## G. Performance & UX signals

| Check | Done |
|-------|------|
| **LCP / INP / CLS** acceptable on key templates (field or lab) | ☐ |
| **[PageSpeed Insights](https://pagespeed.web.dev/)** on **production** (or a stable **public** preview URL) for **home**, one **service hub**, one **article**, one **bio**, **contact** — after material template or asset changes | ☐ |
| Images: appropriate format, dimensions, **lazy** where safe, **alt** text | ☐ |
| Fonts: limit weight variants; avoid CLS from web fonts | ☐ |

---

## G2. PageSpeed Insights, CrUX, and this stack (Astro + Vercel)

**Why this section exists:** PSI and Lighthouse are easy to misread on localhost or to over-optimise without tying back to **crawl/indexation** (which is mostly about URLs, signals, and HTML — not a single score).

### PageSpeed Insights — when and how

1. **Use a public URL.** Run PSI against **production** or a **passwordless, publicly reachable** preview. `localhost` and many private previews are a poor lab proxy and may not reflect CDN/TLS/HSTS/CSP behaviour.
2. **Lab vs field.** PSI’s **Lighthouse** tab is **lab** (repeatable, good for regressions). The **“Discover what your real users are experiencing”** block is **CrUX field data** and only appears when Chrome has enough URL-level traffic. Many professional-services pages show *insufficient real-world data* — that is **not** a failure; use **Search Console → Core Web Vitals** over time and keep lab scores sane.
3. **What to fix first (typical Astro marketing site):** largest **LCP** image or text block (priority hints, dimensions, format); **CLS** (explicit `width`/`height` on images, `font-display` when self-hosting fonts); **INP** only if you ship noticeable client JS (keep islands small; defer non-critical scripts behind consent where applicable).

### Indexing with this stack (mostly static HTML)

Google can index **server-rendered / pre-built HTML** without depending on client hydration for the main story — which matches **Astro’s** default model.

| Topic | Practice for this repo |
|-------|-------------------------|
| **Crawl budget / efficiency** | Prefer **clean internal links** to final locale URLs (`IA-URL-SPEC.md`); avoid chains (§B). **XML sitemap** lists only indexable URLs (`astro.config.mjs` filter for thin migration pages). |
| **Discovery** | **`robots.txt`** `Sitemap` line; submit sitemap in **Search Console** (§C). **RSS** on news helps discovery but is secondary to sitemaps + internal links. |
| **Rendering** | Keep **title, meta description, canonical, `robots`, hreflang** in HTML from layouts (e.g. `Base.astro`) — not added solely by late or consent-gated client scripts. |
| **Rich results** | Structured data in HTML; validate with [Rich Results Test](https://search.google.com/test/rich-results) (§F). |

### Stack-specific speed notes

| Area | Note |
|------|------|
| **Astro** | Default **minimal JS** on navigation — good for INP. Add **`client:*`** only where interaction needs it. |
| **Images** | People photos are **WebP** from the import pipeline; for large editorial/hero assets prefer explicit dimensions and modern formats when you add them (`STACK.md` suggests `astro:assets` where appropriate). |
| **Fonts** | Until **Esface** ships as self-hosted **WOFF2**, fallbacks avoid a large font download — when you enable `@font-face`, use **`font-display: swap`** and subset/limit weights to control CLS. |
| **Third parties** | **Yoshki / SRA iframe** is a fixed third-party cost in the footer; PSI may flag it — balance **compliance** vs micro-optimisations; do not strip it for a few lab points without regulatory sign-off. |
| **Vercel** | Static pages are served from the **edge CDN**; ensure large assets use **cache-friendly** URLs and avoid shipping huge unoptimised media to `public/`. |

### Optional automation

- **Lighthouse CI** in GitHub Actions against a **stable preview URL** (stored as a repo secret) can guard **regressions** on key paths. PSI remains useful for **ad hoc** checks and stakeholder reports.
- Do not treat **“100”** as the goal; treat **no critical regressions** + **acceptable LCP/CLS** on money pages + **clean indexation** (§C, §I) as the goal.

---

## H. Compliance & trust (site quality)

| Check | Done |
|-------|------|
| No **placeholder** copy (Lorem ipsum) on production | ☐ |
| Privacy, cookies, regulatory links in **footer** | ☐ |
| Forms: consent, privacy link, secure submission | ☐ |

---

## I. Post-launch monitoring (first 2–4 weeks)

| Check | Done |
|-------|------|
| **Search Console:** coverage, sitemaps, manual actions | ☐ |
| **404** / **5xx** monitoring | ☐ |
| Crawl comparison (old vs new indexable count—directionally) | ☐ |
| Rankings / landing-page traffic spot-check for **top** URLs | ☐ |

---

## J. Sign-off

| Role | Name | Date |
|------|------|------|
| SEO / digital | | |
| Engineering | | |
| Content | | |

---

## K. Migration slug data (news / people)

| Check | Done |
|-------|------|
| After a crawl of production, refresh **`site/src/data/news-sitemap-slugs.json`** and **`site/src/data/people-sitemap-slugs.json`** if URLs were added or removed | ☐ |
| As real content ships in **`news.ts`** / **`people.ts`**, remove reliance on placeholders for those slugs (they become indexable + sitemap-eligible automatically) | ☐ |

---

## L. Screaming Frog SEO Spider — technical crawl parity

**Purpose:** Align manual crawls with what the [SEO Spider](https://www.screamingfrog.co.uk/seo-spider/) can actually measure, so you cover the same **technical** surface area Screaming Frog documents (configuration + **Issues** tab), without treating every automated flag as a must-fix.

**Important:** Screaming Frog lists [**300+ issues, warnings and opportunities**](https://www.screamingfrog.co.uk/seo-spider/issues/) across categories (Response codes, Security, URL, Titles, Meta, H1–H2, Content, Images, Canonicals, Pagination, Directives, Hreflang, JavaScript, Links, AMP, Structured data, Sitemaps, PageSpeed, Mobile, Accessibility, Analytics, Search Console, Validation). Many rows only light up with **API integrations** (GA4, Search Console, [PageSpeed Insights API](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/#pagespeed-insights-integration)) or do **not apply** to this stack (e.g. **AMP**, old AJAX crawling scheme). Use the **Issues** tab for triage; use judgment and this checklist’s §A–K for what “green” means for Schillings.

### L1. Crawl modes (when to use which)

| Mode | Use for |
|------|---------|
| **Spider** (default) | Discover internal URLs from a start URL (e.g. **`https://schillingspartners.com/`** — UK home). Legacy **`/en-gb/…`** **301**s to unprefixed UK paths; legacy **`/en-us/…`** / **`/en-ie/…`** **301** to **`/us/…`** / **`/ie/…`**. Confirms indexable HTML, links, response codes, inlinks/outlinks. |
| **List** | Paste **GSC** / analytics exports, legacy URLs from `redirect-map.csv`, or “top landing pages” — verify each returns **301 → final** URL, **404**, or **200** as intended. |
| **Sitemap** | Crawl **`sitemap-index.xml`** (linked from `robots.txt`) to verify sitemap ↔ live URLs, **orphans**, and **non-indexable URLs in sitemap** (see [Sitemaps issues](https://www.screamingfrog.co.uk/seo-spider/issues/sitemaps/)). Enable **Crawl linked XML sitemaps** in Configuration → Spider → Crawl where appropriate ([user guide](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/#crawl-linked-xml-sitemaps)). |

### L2. Configuration — Spider (Crawl tab)

Turn these on/off per the [configuration — Crawl](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/) docs so the crawl matches your audit intent.

| Setting | Recommendation for this site |
|---------|-------------------------------|
| **Crawl canonicals** | **On** — aligns with §C (canonical errors, chains via “always follow”). |
| **Extract hreflang** | **On** — aligns with §D; triage [hreflang issues](https://www.screamingfrog.co.uk/seo-spider/issues/hreflang/). |
| **Crawl linked XML sitemaps** | **On** for at least one full audit — compares crawl vs published sitemap (thin migration URLs are **deliberately** omitted from Astro sitemap; expect **URLs not in sitemap** for `noindex` stubs — document as intentional). |
| **Meta refresh** | **On** — catch unwanted refreshes (locale root fallback is special; compare to `IA-URL-SPEC.md`). |
| **iframes** | Optional — third-party **Yoshki** badge; useful to confirm iframe present, not for indexation of iframe content. |
| **JavaScript** rendering | **Default crawl** is usually enough (Astro ships **static HTML** for titles, meta, canonicals, hreflang). Run **one** crawl with **Configuration → Spider → Rendering → JavaScript** enabled ([Rendering](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/#rendering)) to surface [JavaScript issues](https://www.screamingfrog.co.uk/seo-spider/issues/javascript/) (e.g. title/canonical only in rendered DOM, blocked resources) — should be clean for this repo; if not, fix before relying on client-only SEO. |
| **PageSpeed Insights** | Optional (licence + PSI API key): populates **PageSpeed** tab and PSI-derived **Issues** at scale — complements manual PSI (§G2). |

### L3. Configuration — Advanced & behaviour

| Setting | Recommendation |
|---------|------------------|
| **Respect robots.txt** | **On** for production parity; use a **separate** crawl with “ignore robots” only in a controlled environment if you need to see blocked URLs. |
| **Respect noindex / canonical / HSTS** | Understand implications: “respect noindex” limits what gets crawled as **indexable** vs what still appears as URLs ([Advanced](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/#respect-noindex)). |
| **Always follow redirects** | Use to map **redirect chains** ([redirect chain issues](https://www.screamingfrog.co.uk/seo-spider/issues/response-codes/internal-redirect-chains/)) — aligns with §B. |
| **Max redirects to follow** | Set high enough for legacy chains; then fix chains to one hop. |
| **Extract images from img srcset** | **On** if you add `srcset` — aligns with image opportunities ([Images](https://www.screamingfrog.co.uk/seo-spider/issues/images/)). |
| **Perform HTML validation** | Optional — ties to [Validation](https://www.screamingfrog.co.uk/seo-spider/issues/validation/) issues (head/body structure, oversized HTML). |

### L4. Configuration — Extraction

| Setting | Recommendation |
|---------|----------------|
| **Structured data** | **On** — use **Structured data** tab + Issues for parse/validation errors ([Structured data](https://www.screamingfrog.co.uk/seo-spider/issues/structured-data/)); still validate money templates in Google’s [Rich Results Test](https://search.google.com/test/rich-results) (§F). |
| **Directives** | **On** — `noindex` / `nofollow` / `X-Robots-Tag` alignment with §C and migration stubs. |

### L5. After the crawl — tabs and exports

| Tab / report | What to verify vs this repo |
|--------------|------------------------------|
| **Issues** | Clear **High** severity **Issues** first; review **Warnings** with context (e.g. [Security](https://www.screamingfrog.co.uk/seo-spider/issues/security/) headers may already be satisfied on **Vercel** but not on `astro preview` — compare host). |
| **Response codes** | No unexpected **4xx/5xx**; internal **301** only where migration expects (§B). |
| **Security** | HTTPS, mixed content, security headers — cross-check `site/vercel.json` on **production**. |
| **Hreflang** | Reciprocal sets, **x-default**, no **non-200** alternates (§D). |
| **Canonicals** | No **multiple conflicting**, **non-indexable canonical**, fragment URLs (§C). |
| **Sitemaps** | **Orphan** indexable URLs (should be rare); **non-indexable in sitemap** should be **empty** (Astro filter). |
| **PageSpeed / Mobile / Accessibility** | Optional in-app (PSI API / Lighthouse / axe); repo also runs **Playwright + axe** on contact (`site/README.md`). |
| **Bulk export** | **All inlinks**, **redirect chains**, **response codes** → feed **`redirect-map.csv`** and §B. |

### L6. Map Screaming Frog categories → checklist sections

| Screaming Frog category | Primary checklist anchor |
|---------------------------|---------------------------|
| Response codes, URL, Links | §B |
| Security | §A + `site/vercel.json` |
| Directives, Canonicals, Pagination | §C |
| Hreflang | §D |
| Page titles, Meta, H1–H2, Content | §E, `CONTENT-METADATA-SPEC.md` |
| Structured data | §F |
| Images, PageSpeed, Mobile | §G–G2 |
| Sitemaps | §C, §K |
| Analytics / Search Console | §I (plus SF API when connected) |
| Validation | §0 + HTML spot-checks |

---

*Related: `IA-URL-SPEC.md`, `REDIRECT-MAP.md`, `CONTENT-METADATA-SPEC.md`, `RESEARCH-BRIEF.md`, `STATUS.md`, `STACK.md` (Astro rationale)*
