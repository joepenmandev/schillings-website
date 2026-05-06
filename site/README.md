# Schillings — Astro site

Marketing site scaffold aligned with repo **`IA-URL-SPEC.md`** and **`HREFLANG-STRATEGY.md`**.

**This file is the canonical engineering reference** for install, scripts, CI, security headers, routes, and environment variables. Planning specs and stakeholder tables live in **`../`**; use **`../STATUS.md`** for an ordered launch checklist (it points here for commands).

## Commands

```bash
npm install
npm run dev
npm run build
npm run test
npm run verify     # test + check:locale-parity + build + verify:build-seo + test:e2e
                   # Vitest: CSP `frame-src`, redirect-map ↔ vercel.json, Consent wiring
                   # Playwright: HTTP smoke + locale/sitemap/region + Chromium/axe on contact `#main`
npm run check:locale-parity   # UK static routes must have en-us + en-ie mirrors (see locale-parity-allowlist.json)
npm run verify:build-seo      # after build: hreflang + canonical on locale home HTML in dist/
npm run verify:launch-urls    # optional live audit — set LAUNCH_VERIFY_URL=https://… (/, /contact/, sitemap, /en-gb/→/)
npm run test:e2e   # Playwright only (needs dist/ — run build first, or use full verify)
npm run preview
npm run import:people
npm run optimize:people-photos
npm run import:people:full   # import then optimize (from repo root or site/)
```

### Local `dev` vs `preview` (footer & HTML sitemap links)

- **`npm run dev`:** Footer **Region** links and the HTML sitemap **Regional sitemaps** block resolve **`Astro.url.origin`**, so absolute `href`s target your dev server (e.g. `http://localhost:4321/us/...`).
- **`npm run build` + `npm run preview`:** The same markup is **pre-rendered** with the site origin from **`astro.config.mjs`** (`site`, e.g. `https://schillingspartners.com`), so those `href`s match **production**. **`hreflang`** and **canonical** use the same apex domain in both modes.

CI (GitHub Actions) runs **`npm ci`**, **`npx playwright install chromium --with-deps`**, and **`npm run verify`** (Vitest → locale parity → build → post-build hreflang check → Playwright HTTP + locale/sitemap + axe on **`/contact/`**) in **`site/`** on push/PR to **`main`**, **`master`**, or **`develop`** (see **`.github/workflows/ci.yml`**).

`import:people` re-fetches live bios + headshots into `src/data/people-imported.json` and `public/people-photos/` (respectful delay between requests). **`optimize:people-photos`** (run after import, or use **`import:people:full`**) converts headshots to **WebP** max width **960px** (~**5MB** total vs raw CDN pulls). Optional: `git lfs install` then `git lfs track "site/public/people-photos/**"` before committing photos ([Git LFS](https://git-lfs.com/)).

## Environment variables (Vercel / local)

Set in the Vercel project (or **`.env`** locally — never commit secrets). Line-by-line comments: **`.env.example`**.

| Variable | Role |
|----------|------|
| **`CONTACT_WEBHOOK_URL`** | Server-only HTTPS URL (Zapier/Make/etc.) receiving JSON from **`api/contact.ts`**. |
| **`PUBLIC_FORM_ENDPOINT`** | Client form action; production typically **`/api/contact`**. Leave empty in local dev to log payloads to the console. |
| **`UPSTASH_REDIS_REST_URL`** / **`UPSTASH_REDIS_REST_TOKEN`** | Optional; **global** rate limit for `/api/contact` across Edge isolates. Omit for in-memory limit only. |
| **`CONTACT_RATE_LIMIT_MAX`** | Optional; max POSTs per IP per minute (default **30**). |

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

**Consent / analytics prep:** **`ConsentModeDefaults.astro`** sets Google **Consent Mode v2** defaults (non-essential denied) before tags load. When marketing ships GA4/GTM + a CMP, follow **`ANALYTICS-CONSENT-SPEC.md`** and call `gtag('consent', 'update', …)` from the CMP.

**Public URLs:** Astro is set to **`build.format: 'directory'`** and **`trailingSlash: 'always'`**, so UK pages are **`/people/`** style and US/IE **`/en-us/people/`**, etc. (no **`page.html`** in the path). On Vercel, **`trailingSlash: true`** and **`cleanUrls: true`** 308 any stray **`*.html`** requests to the clean path ([Vercel `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json)). Use **`npm run preview`** (not raw `file://` or listing `dist` files) to test links locally.

## Routes (scaffold)

- **`/`** (UK), **`/en-us/`**, **`/en-ie/`** — Home per locale (`SiteHeader` + hero aligned with `LIVE-SITE-EXTRACT.md`); **`HomeExploreStrip`** links to Services, People, News, International, Contact (`localeHref` / `public-url` helpers build paths).
- **`/contact/`**, **`/en-us/contact/`**, **`/en-ie/contact/`** — Multi-step **qualifying form** (`QualifyingForm.astro`) — £25k gate; `PUBLIC_FORM_ENDPOINT` (see `.env.example`). Production default: **`/api/contact`** (Vercel Edge) forwards to server secret **`CONTACT_WEBHOOK_URL`** (Zapier/Make/etc.)
- **Primary IA (stubs):** same path suffixes under UK root or **`/en-us/`** / **`/en-ie/`**: `people`, **`services`**, `news`, `international`, `about-us`, `24-7-immediate-response`, **`accessibility`**, **`careers`** (footer via **`utilityFooterNav`**; optional main nav per IA)
- **Cross-links:** **`MarketingStubNav.astro`** on **`people`**, **`services`**, **`news`** (including **`news/page/N/`** pagination), **`contact`**, **`search`** indexes (plus marketing stubs, **`legal/privacy-notice`**, Keith biography) — consistent “Also on this site” row; **Search** is in the row with correct active state on **`/search/`**
- **Compliance (stubs):** `compliance/privacy-disclaimer`, `compliance/complaints-handling`, `compliance/schillings-sra`, `compliance/candidate-privacy-notice`, `compliance/standard-terms-of-business` — all five appear in **`SiteFooter`** and in-page **`ComplianceSectionNav`**. Legacy **`/privacy-notice`**, **`/complaints-handling`**, **`/standard-terms-of-business*`** → **UK** compliance paths (unprefixed) in `vercel.json` + root **`redirect-map.csv`**
- **Legacy & utility:** Live **`/expertise`** **301** → **`/services/`** (UK); **`/en-us/expertise/…`** → **`/en-us/services/…`**, etc. (`vercel.json`, root **`redirect-map.csv`**) — see **`IA-URL-SPEC.md`** §2.1. **`search`** (`noindex`). **Stubs:** `keith-schilling-founder`, `keith-schilling-biography/{slug}`
- **News:** `news/` index + **`news/page/{n}/`** when published count exceeds **`NEWS_INDEX_PAGE_SIZE`** (**`10`** in **`src/lib/news-pagination.ts`**) + `news/{slug}/` — full **live sitemap slug list** in `src/data/news-sitemap-slugs.json`; slugs not yet in `src/data/news.ts` render as **`noindex` migration placeholders** (excluded from XML sitemap). Optional **`authorSlugs`** on each article (people profile slugs) powers **“News & insights”** on matching bio pages. Helpers: `src/lib/news-paths.ts`.
- **People:** `people/` index + `people/{slug}/` — bios and headshots in **`src/data/people-imported.json`** + **`public/people-photos/`** (refresh with **`npm run import:people:full`** or import then optimize). `people.ts` maps that JSON into profiles. **`officeId`** includes **London, Dublin, Miami, Auckland** (see `people-taxonomy.ts`). Live CMS tags map to **`expertise`**; when Webflow omits tags, the import script infers expertise from public bio text. Import also captures **LinkedIn** (`/in/…`) into **`sameAs`** for JSON-LD. Optional per-slug overrides: **`src/data/people-eeat-extras.json`** — merge into **`sameAs`** (e.g. directory profile URLs) and optional **`profileUpdatedAt`** (ISO string) to override import timestamps for **ProfilePage `dateModified`** after editorial changes. Bio pages emit **ProfilePage + Person** structured data per [Google ProfilePage markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page) (validate in [Rich Results Test](https://search.google.com/test/rich-results)), with **`dateModified`** when **`profileUpdatedAt`** is present in `people-imported.json` (set on each **`import:people`** run). Each profile also surfaces **related people** (shared expertise / office) and **Explore** links (people, **services**, news, international, contact). **`people-paths.ts`** still unions **`people-sitemap-slugs.json`** so new sitemap-only slugs can build as thin **`noindex`** stubs until the next import. **Directory:** `PeopleDirectory.astro` (locale office order, filters, shareable query params, a11y — see prior docs). **Hreflang:** **`HREFLANG-STRATEGY.md`**.
- **Contact thank-you:** `contact/thank-you/` (`noindex`)
- **Legal (stubs, IA §1):** `legal/privacy-notice`, **`legal/cookies`**, **`legal/terms`**, **`legal/regulatory`** — placeholders + **`MarketingStubNav`**; **Privacy notice (dev)** also in **`legalFooterNav`**. **`privacy-notice`** body links to **`compliance/privacy-disclaimer/`** where live IA differs
- **Global:** `SiteFooter` (purple + ivory bands, SRA iframe, legal row) in `Base.astro`
- `/404.html` — Static not-found page (`noindex`)

## Technical SEO (built in)

- **`public/robots.txt`** — `Allow` + `Sitemap` → `sitemap-index.xml` (swap for staging)
- **`@astrojs/sitemap`** — emits `sitemap-index.xml` / `sitemap-0.xml` (UK homepage **`/`** included; thin migration URLs excluded; see `astro.config.mjs`)
- **`src/layouts/Base.astro`** — skip link, default meta description, `robots`, canonical, **hreflang** (optional prop **`hreflangLocales`** when a page is not a full three-way alternate), **`og:locale`** + **`og:locale:alternate`** (aligned with hreflang targets), **Open Graph**, **Twitter**, **Organization** JSON-LD (SRA id, London address, `contactPoint` phone, `sameAs` socials)
- **`vercel.json`** — security headers + **301 redirects** from legacy paths to **UK unprefixed** URLs (e.g. **`/news/:path*`** → **`/news/:path*`**), **`/en-gb/:path*`** → **`/:path*`**, plus **wildcards** for people/news/biography (see `../REDIRECT-MAP.md`)
- **`api/contact.ts`** — Vercel **Edge** POST handler; env vars in **§ Environment variables** and **`.env.example`**
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
