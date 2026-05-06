# Schillings — Astro site

Marketing site scaffold aligned with repo **`IA-URL-SPEC.md`** and **`HREFLANG-STRATEGY.md`**.

**This file is the canonical engineering reference** for install, scripts, CI, security headers, routes, and environment variables. Planning specs and stakeholder tables live in **`../`**; use **`../STATUS.md`** for an ordered launch checklist (it points here for commands). For **domain cutover, indexing, and env sequencing**, follow **`docs/DEPLOY-CHECKLIST.md`** in order.

## Commands

```bash
npm install
npm run dev
npm run build
npm run test
npm run verify     # test + check:locale-parity + build + verify:build-seo + test:e2e
                   # Vitest: CSP `frame-src`, Consent wiring
                   # Playwright: HTTP smoke + locale/sitemap/region + Chromium/axe on contact `#main`
npm run check:locale-parity   # UK static routes must have en-us + en-ie mirrors (see locale-parity-allowlist.json)
npm run verify:build-seo      # after build: hreflang + canonical on locale homes (fetches via spawned `astro dev`; `astro preview` unsupported with Vercel adapter). Optional: `BUILD_SEO_VERIFY_URL=https://…`
npm run verify:launch-urls    # optional live audit — set LAUNCH_VERIFY_URL=https://… (/, /contact/, sitemap, /en-gb/→/)
npm run verify:nonprod-indexing  # optional live audit — set INDEXING_VERIFY_URL=https://… (checks noindex + robots block on nonprod)
npm run test:e2e   # Playwright (starts `astro dev` on port **8787** by default — set `PLAYWRIGHT_DEV_PORT` to override)
npm run preview
npm run verify:strategic-crawl   # needs BASE_URL — strategic IA HTTP health (not full SEO); see **Staging verification** below
npm run verify:strategic-crawl:local   # build + astro dev on 127.0.0.1:4325 + crawl (Vercel adapter: no `astro preview`)
npm run verify:staging-seo       # needs STAGING_BASE_URL — migrated news canonical/hreflang/sitemap on a live preview
npm run audit:strategic-copy     # static copy audit for strategic-rebuild-content (no server; fails CI on hard issues)
npm run import:people
npm run optimize:people-photos
npm run import:people:full   # import then optimize (from repo root or site/)
```

### Staging verification (preview / pre-launch)

Run these against a **running** site: local dev (`npm run dev`, default **http://localhost:4321**) or a **Vercel preview** URL.

```bash
# Strategic IA crawl: locale homes + situations / what-we-protect / response-system (+ related paths) — link/HTTP checks only
BASE_URL=http://localhost:4321 npm run verify:strategic-crawl
BASE_URL=https://your-preview-url.vercel.app npm run verify:strategic-crawl

# Staging SEO: migrated news article URLs, canonical, hreflang, JSON-LD, sitemap entries
STAGING_BASE_URL=https://your-preview-url.vercel.app npm run verify:staging-seo

# Editorial/data gates on strategic copy (duplicates, required fields, length & term warnings)
npm run audit:strategic-copy

# One-shot local crawl (build → dev server on 4325 → strategic crawl; no BASE_URL needed)
npm run verify:strategic-crawl:local
```

**`verify:strategic-crawl:local`** runs `npm run build`, then **`astro dev`** on **`127.0.0.1:4325`** (the Vercel adapter does not support **`astro preview`**), waits until `/` responds, runs **`verify:strategic-crawl`** with **`BASE_URL=http://127.0.0.1:4325`**, and stops the dev server afterward—including when the crawl fails.

| Check | What it validates |
|--------|-------------------|
| **`verify:strategic-crawl`** | **Strategic route health** (HTTP 200s and internal link consistency for the strategic IA set across **UK / US / IE**). It does **not** replace a full SEO audit (canonical, hreflang on every template, rich results, etc.). |
| **`verify:staging-seo`** | **News migration** surfaces on the given origin: article status, self-canonical, hreflang alternates, JSON-LD presence, sitemap inclusion for published migrated URLs. |
| **`audit:strategic-copy`** | **Static** analysis of `src/data/strategic-rebuild-content.ts` — no network. |

**Prerequisites**

- **Auth:** Staging or preview must be **publicly readable** by HTTP, or **Basic Auth disabled** for that deployment (e.g. `DISABLE_SITE_BASIC_AUTH` or a preview host outside `BASIC_AUTH_HOSTS`). Crawlers use unauthenticated `fetch`; gated HTML will fail checks or return challenge pages.
- **Locale parity:** **`npm run check:locale-parity`** should pass before you treat crawl results as authoritative — strategic paths are expected for **en-gb, en-us, en-ie** mirrors.
- **Indexing / sitemap before launch:** Confirm **XML sitemap**, **`robots.txt`**, and **`noindex`** / **`X-Robots-Tag`** behaviour for the environment you are validating (non-prod: see **`npm run verify:nonprod-indexing`** and **`vercel.json`** staging rules; production: **`docs/DEPLOY-CHECKLIST.md`** and **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`**).

### Local `dev` vs `preview` (footer & HTML sitemap links)

- **`npm run dev`:** Footer **Region** links and the HTML sitemap **Regional sitemaps** block resolve **`Astro.url.origin`**, so absolute `href`s target your dev server (e.g. `http://localhost:4321/us/...`).
- **`npm run build` + `npm run preview`:** The same markup is **pre-rendered** with the site origin from **`astro.config.ts`** (`site`: **`PUBLIC_SITE_URL`**, else **`VERCEL_URL`**, else **`http://localhost:4321`**), so those `href`s match the configured deploy origin. **`hreflang`** and **canonical** use the same origin in both modes.

CI (GitHub Actions) runs **`npm ci`**, **`npx playwright install chromium --with-deps`**, and **`npm run verify`** (Vitest → locale parity → build → post-build hreflang check → Playwright HTTP + locale/sitemap + axe on **`/contact/`**) in **`site/`** on push/PR to **`main`**, **`master`**, or **`develop`** (see **`.github/workflows/ci.yml`**).

`import:people` re-fetches live bios + headshots into `src/data/people-imported.json` and `public/people-photos/` (respectful delay between requests). **`optimize:people-photos`** (run after import, or use **`import:people:full`**) converts headshots to **WebP** max width **960px** (~**5MB** total vs raw CDN pulls). Optional: `git lfs install` then `git lfs track "site/public/people-photos/**"` before committing photos ([Git LFS](https://git-lfs.com/)).

## Environment variables (Vercel / local)

Set in the Vercel project (or **`.env`** locally — never commit secrets). Line-by-line comments: **`.env.example`**.

| Variable | Role |
|----------|------|
| **`PUBLIC_SITE_URL`** | Optional; canonical HTTPS origin for **`astro.config.ts`** `site` (no trailing slash). If unset on Vercel, **`VERCEL_URL`** is used; locally defaults to **`http://localhost:4321`**. See **`docs/DEPLOY-CHECKLIST.md`**. |
| **`LEGACY_SITE_ORIGIN`** | Optional; HTTPS origin for **`import:news`** / **`import:people`** when scraping a legacy host (see **`.env.example`**). |
| **`CONTACT_WEBHOOK_URL`** | Server-only HTTPS URL (Zapier/Make/etc.) receiving JSON from **`api/contact.ts`**. |
| **`PUBLIC_FORM_ENDPOINT`** | Client form action; production typically **`/api/contact`**. Leave empty in local dev to log payloads to the console. |
| **`UPSTASH_REDIS_REST_URL`** / **`UPSTASH_REDIS_REST_TOKEN`** | Optional; **global** rate limit for `/api/contact` across Edge isolates. Omit for in-memory limit only. |
| **`CONTACT_RATE_LIMIT_MAX`** | Optional; max POSTs per IP per minute (default **30**). |
| **`SITE_USER`** / **`SITE_PASS`** | Optional; when both are set in production, HTTP Basic Auth gates the site (see below). |
| **`DISABLE_SITE_BASIC_AUTH`** | Optional; set to **`1`** or **`true`** to **turn off** Basic Auth on that deployment (short-lived staging access — remove afterward). |
| **`BASIC_AUTH_HOSTS`** | Optional; comma-separated hostnames **only** (e.g. `www.example.com,example.com`). When set, the login gate applies **only** on those hosts so **`*.vercel.app`** staging can stay open while credentials remain in the project. |

**Basic Auth and `api/`:** `src/middleware.ts` runs for Astro-rendered routes only. Vercel **`api/*.ts`** handlers are separate Edge functions and **do not** go through that middleware. When you add a new API route and the site is gated, call **`gateSiteBasicAuth(request)`** from **`src/lib/site-basic-auth-gate.ts`** at the top of the handler (same env vars). **`api/contact.ts`** already does this.

**Vercel + Git:** Production should build from the connected Git repo (not only `vercel deploy` from a partial tree), with **Root Directory** set to the folder that contains **`package.json`** and **`astro.config.ts`** (this repo: **`site`** when the Vercel project root is the monorepo, or **`.`** when the project is linked only to `site/`). Mismatches produce static-only deploys where middleware never runs.

## Adding routes & locale mirrors

- **UK:** add `src/pages/.../index.astro` under the root `pages/` tree (or `index.astro` at `pages/` for home).
- **US / Ireland:** add the **same path suffix** under `src/pages/en-us/...` and `src/pages/en-ie/...`. Astro does not copy UK files automatically.
- **`npm run check:locale-parity`** fails CI if a UK static route (non-`[dynamic]`) is missing either mirror. Intentional UK-only pages: add the path tail to **`locale-parity-allowlist.json`** → **`ukOnly`** (e.g. `"my-section/subpage"`).
- **HTML sitemap & footer region links** use filesystem discovery — new mirrored routes appear without editing nav lists (labels still come from **`site-nav.ts`** when the segment matches).

## Locales

- **`/`** (unprefixed paths) — UK / **en-GB** cluster; internal data `locale` = **`en-gb`**; **`x-default`** and **`en-GB`** hreflang point here
- **`/en-us/…`** — US
- **`/en-ie/…`** — Ireland / EU gateway narrative

Legacy **`/en-gb/…`** URLs **301** to the same path **without** `/en-gb` (see **`vercel.json`** + root **`redirect-map.csv`**). The UK homepage is **`/`** (200), not a redirect away to a locale folder.

**Performance & SEO (speed + indexing):** After deploy, use **[PageSpeed Insights](https://pagespeed.web.dev/)** on a **public** production or preview URL for a few key routes — see repo **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** §G–**G2** (CrUX vs lab, Astro/Vercel notes, sitemap/indexing alignment).

**Security headers** (production on Vercel): **`Strict-Transport-Security`** includes **`preload`** — only keep that once **all** subdomains and apex serve HTTPS for the preload policy window; otherwise remove `preload` from `site/vercel.json`. **`Content-Security-Policy`** is set there (inline scripts allowed for Astro + form; **`frame-src`** allows the SRA Yoshki iframe in **`SiteFooter`**).
For non-production hosts (anything other than the primary production hostname configured in `site/vercel.json`, currently `schillings-website.vercel.app` — add your custom apex there when you go live), `site/vercel.json` adds **`X-Robots-Tag: noindex, nofollow, noarchive`** to all responses and rewrites **`/robots.txt`** to **`/robots-staging.txt`** (`Disallow: /`). This remains in place when Basic Auth is enabled.
You can audit this quickly with `npm run verify:nonprod-indexing` (set `INDEXING_VERIFY_URL` and optional `INDEXING_VERIFY_MODE=prod|nonprod`).

**Consent / analytics prep:** **`ConsentModeDefaults.astro`** sets Google **Consent Mode v2** defaults (non-essential denied) before tags load. When marketing ships GA4/GTM + a CMP, follow **`ANALYTICS-CONSENT-SPEC.md`** and call `gtag('consent', 'update', …)` from the CMP.

**Public URLs:** Astro is set to **`build.format: 'directory'`** and **`trailingSlash: 'always'`**, so UK pages are **`/people/`** style and US/IE **`/en-us/people/`**, etc. (no **`page.html`** in the path). On Vercel, **`trailingSlash: true`** and **`cleanUrls: true`** 308 any stray **`*.html`** requests to the clean path ([Vercel `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json)). Use **`npm run preview`** (not raw `file://` or listing `dist` files) to test links locally.

## Routes (scaffold)

- **`/`** (UK), **`/en-us/`**, **`/en-ie/`** — Home per locale (`SiteHeader` + hero aligned with `LIVE-SITE-EXTRACT.md`); **`HomeExploreStrip`** links to Expertise, People, News, International, Contact (`localeHref` / `public-url` helpers build paths).
- **`/contact/`**, **`/en-us/contact/`**, **`/en-ie/contact/`** — Multi-step **qualifying form** (`QualifyingForm.astro`) — £25k gate; `PUBLIC_FORM_ENDPOINT` (see `.env.example`). Production default: **`/api/contact`** (Vercel Edge) forwards to server secret **`CONTACT_WEBHOOK_URL`** (Zapier/Make/etc.)
- **Primary IA (stubs):** same path suffixes under UK root or **`/en-us/`** / **`/en-ie/`**: `people`, **`expertise`**, `news`, `international`, `about-us`, `24-7-immediate-response`, **`accessibility`**, **`careers`** (footer via **`utilityFooterNav`**; optional main nav per IA)
- **Cross-links:** **`MarketingStubNav.astro`** on **`people`**, **`expertise`**, **`news`** (including **`news/page/N/`** pagination), **`contact`**, **`search`** indexes (plus marketing stubs, **`legal/privacy-notice`**, Keith biography) — consistent “Also on this site” row; **Search** is in the row with correct active state on **`/search/`**
- **Compliance (stubs):** `compliance/privacy-disclaimer`, `compliance/complaints-handling`, `compliance/schillings-sra`, `compliance/candidate-privacy-notice`, `compliance/standard-terms-of-business` — all five appear in **`SiteFooter`** and in-page **`ComplianceSectionNav`**. Legacy **`/privacy-notice`**, **`/complaints-handling`**, **`/standard-terms-of-business*`** → **UK** compliance paths (unprefixed) in `vercel.json` + root **`redirect-map.csv`**
- **Legacy & utility:** Public capability hubs are **`/expertise/…`** (UK), **`/us/expertise/…`**, **`/ie/expertise/…`** — **`/services/…`** is not a route on this build (see **`IA-URL-SPEC.md`** §2). **No** **`/services` → `/expertise`** redirects were added in `vercel.json` while the new site is not yet live on production; define cutover rules in root **`redirect-map.csv`** when the stack replaces the legacy host. **`search`** (`noindex`). **Stubs:** `keith-schilling-founder`, `keith-schilling-biography/{slug}`
- **News:** `news/` index + **`news/page/{n}/`** when published count exceeds **`NEWS_INDEX_PAGE_SIZE`** (**`10`** in **`src/lib/news-pagination.ts`**) + `news/{slug}/` — full **live sitemap slug list** in `src/data/news-sitemap-slugs.json`; slugs not yet in `src/data/news.ts` render as **`noindex` migration placeholders** (excluded from XML sitemap). Optional **`authorSlugs`** on each article (people profile slugs) powers **“News & insights”** on matching bio pages. Helpers: `src/lib/news-paths.ts`.
- **People:** `people/` index + `people/{slug}/` — bios and headshots in **`src/data/people-imported.json`** + **`public/people-photos/`** (refresh with **`npm run import:people:full`** or import then optimize). `people.ts` maps that JSON into profiles. **`officeId`** includes **London, Dublin, Miami, Auckland** (see `people-taxonomy.ts`). Live CMS tags map to **`expertise`**; when Webflow omits tags, the import script infers expertise from public bio text. Import also captures **LinkedIn** (`/in/…`) into **`sameAs`** for JSON-LD. Optional per-slug overrides: **`src/data/people-eeat-extras.json`** — merge into **`sameAs`** (e.g. directory profile URLs) and optional **`profileUpdatedAt`** (ISO string) to override import timestamps for **ProfilePage `dateModified`** after editorial changes. Bio pages emit **ProfilePage + Person** structured data per [Google ProfilePage markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page) (validate in [Rich Results Test](https://search.google.com/test/rich-results)), with **`dateModified`** when **`profileUpdatedAt`** is present in `people-imported.json` (set on each **`import:people`** run). Each profile also surfaces **related people** (shared expertise / office) and **Explore** links (people, **expertise**, news, international, contact). **`people-paths.ts`** still unions **`people-sitemap-slugs.json`** so new sitemap-only slugs can build as thin **`noindex`** stubs until the next import. **Directory:** `PeopleDirectory.astro` (locale office order, filters, shareable query params, a11y — see prior docs). **Hreflang:** **`HREFLANG-STRATEGY.md`**.
- **Contact thank-you:** `contact/thank-you/` (`noindex`)
- **Legal (stubs, IA §1):** `legal/privacy-notice`, **`legal/cookies`**, **`legal/terms`**, **`legal/regulatory`** — placeholders + **`MarketingStubNav`**; **Privacy notice (dev)** also in **`legalFooterNav`**. **`privacy-notice`** body links to **`compliance/privacy-disclaimer/`** where live IA differs
- **Global:** `SiteFooter` (purple + ivory bands, SRA iframe, legal row) in `Base.astro`
- `/404.html` — Static not-found page (`noindex`)

## Technical SEO (built in)

- **`public/robots.txt`** — `Allow` + `Sitemap` → `sitemap-index.xml` (swap for staging)
- **`@astrojs/sitemap`** — emits `sitemap-index.xml` / `sitemap-0.xml` (UK homepage **`/`** included; **indexable** **`/news/{slug}/`** and **`/people/{slug}/`** for UK/US/IE via `customPages` in `src/build/sitemap-news-people.ts`; thin migration URLs excluded; see `astro.config.ts`)
- **`src/layouts/Base.astro`** — skip link, default meta description, `robots`, canonical, **hreflang** (optional prop **`hreflangLocales`** when a page is not a full three-way alternate), **`og:locale`** + **`og:locale:alternate`** (aligned with hreflang targets), **Open Graph**, **Twitter**, **Organization** JSON-LD (SRA id, London address, `contactPoint` phone, `sameAs` socials)
- **`vercel.json`** — security headers + **301 redirects** from legacy paths to **UK unprefixed** URLs (e.g. **`/news/:path*`** → **`/news/:path*`**), **`/en-gb/:path*`** → **`/:path*`**, plus **wildcards** for people/news/biography (see `../REDIRECT-MAP.md`)
- **`api/contact.ts`** — Vercel **Edge** POST handler; env vars in **§ Environment variables** and **`.env.example`**; applies **`gateSiteBasicAuth`** when **`SITE_USER`** / **`SITE_PASS`** are set
- **`html lang`** — BCP 47 (`en-GB`, etc.) via `src/i18n/config.ts`

Default **`/og-default.svg`** (1200×630) is used for Open Graph / Twitter unless a page passes `ogImage` into `Base`. Replace with a raster **1200×630** when brand supplies one (some crawlers prefer PNG/JPEG).

## Brand assets (`public/brand/`)

- **`schillings-logo-rgb.svg`** — logotype + tonal line (light backgrounds; used in `SiteHeader` + Organization JSON-LD `logo`).
- **`schillings-logo-negative.svg`** — logotype + tonal line + descriptor, **negative** (dark / hero overlays). Use when you add a dark band or full-bleed hero.

## Fonts (`public/fonts/`)

- **Esface** is declared in `src/styles/global.css` as the first face in `--font-family` but **no `@font-face` ships** until you add licensed **WOFF2** files here and uncomment the `@font-face` blocks in that file. Until then, browsers use **Palatino** / fallbacks. File-name hints: `../LIVE-SITE-EXTRACT.md` (reference only — do not hotlink the old CMS).

## Design tokens (`src/styles/global.css`)

`:root` holds **CSS variables** (`--utility-1`, `--primary-1`, `--secondary-2` …). `@theme` maps them to Tailwind utilities: `bg-utility-1`, `text-secondary-4`, `bg-brand-white`, `border-primary-1`, etc. Use **`var(--token)`** in custom CSS when needed.

## Repo layout

Planning docs live in the **parent** folder (`../`). This directory is the deployable app.

---

*Parent index: [../README.md](../README.md)*
