# Deploy & cutover checklist (run in order)

Phased runbook for Vercel + Astro. **Engineering** owns config and headers; **marketing/SEO** owns GSC and analytics; **compliance** owns auth and legal copy. Cross-check **`README.md`** (commands, env vars) and repo **`STATUS.md`** (broader launch phases).

---

## If you only have 5 minutes

1. **Production `PUBLIC_SITE_URL`** — Vercel → Environment Variables → Production: set to final `https://your-domain` (no trailing slash). See **`astro.config.mjs`** (resolved as `PUBLIC_SITE_URL` → `https://$VERCEL_URL` → `http://localhost:4321`).
2. **Canonical** — Open production home → view source → `rel="canonical"` must start with that origin.
3. **`vercel.json` host allowlist** — `site/vercel.json`: both rules that use `"missing"` + `"type": "host"` must list **every hostname that should be indexed** (today includes `schillings-website.vercel.app`; add apex/`www` when DNS points here).
4. **`/robots.txt`** — On production, must not be the full staging disallow unless intentional (`robots-staging.txt` is used for non-allowlisted hosts).
5. **Contact** — Submit a test from `/contact/`; confirm **`CONTACT_WEBHOOK_URL`** and **`PUBLIC_FORM_ENDPOINT=/api/contact`** on Production.

---

## T-7 days (planning)

| Step | Task | Done when |
|------|------|-----------|
| 1 | Decide **canonical host** (apex vs `www`) and record for SEO/analytics | Agreed in ticket or doc |
| 2 | **DNS**: apex + `www` → Vercel; confirm TLS | Vercel **Domains** shows valid certificates |
| 3 | List **all indexable hostnames** | Matches `site/vercel.json` `missing` host entries |
| 4 | **Basic Auth** policy | Document whether **`SITE_USER`** / **`SITE_PASS`** apply to Preview only, Production, or neither at launch |

---

## T-1 day (config freeze)

| Step | Task | Done when |
|------|------|-----------|
| 5 | Set **`PUBLIC_SITE_URL`** on Vercel **Production** | Redeploy triggered after save |
| 6 | Set **`CONTACT_WEBHOOK_URL`** + **`PUBLIC_FORM_ENDPOINT`** | See **`site/.env.example`** |
| 7 | **`robots.txt` sitemap** — When final URL is known: in **`site/public/robots.txt`**, set absolute `Sitemap: https://your-domain/sitemap-index.xml` (currently may be commented; Google expects a full URL). | Line present and URL returns 200 |
| 8 | Release branch green | From **`site/`**: **`npm run verify`** (or at least **`npm test`** + **`npm run build`**) |

---

## Launch day (sequenced)

| Step | Task | Done when |
|------|------|-----------|
| 9 | **DNS / traffic** cutover | Site serves on canonical URL |
| 10 | **Smoke** | `/`, one news article, one person profile, `/contact/`, `/robots.txt`, sitemap index (e.g. `/sitemap-index.xml`) — no 5xx |
| 11 | **`hreflang`** | Same trio of URLs on UK + one mirror (`/us/` or `/ie/`): alternates present and consistent |
| 12 | **Open Graph** | `og:url`, `og:image` (absolute HTTPS) sane on share-worthy pages |
| 13 | **RSS** | `/news/rss.xml` (and `/us/news/rss.xml`, `/ie/news/rss.xml`): item links use expected origin |
| 14 | **Redirects** | Sample paths from **`vercel.json`** + root **`redirect-map.csv`**: status, locale, trailing slash |
| 15 | **Indexing headers** | Production responses must **not** include `X-Robots-Tag: noindex` unless you intend noindex. Non-allowlisted hosts should get staging behavior per **`vercel.json`**. |
| 16 | **Optional script** | From **`site/`**: `INDEXING_VERIFY_URL=https://preview… npm run verify:nonprod-indexing`; for prod checks add `INDEXING_VERIFY_MODE=prod` |

---

## T+24 hours / T+1 week

| Step | Task | Done when |
|------|------|-----------|
| 17 | **Google Search Console** | Property on canonical host; submit sitemap URL |
| 18 | **Analytics / consent** | Production property IDs; **`ConsentModeDefaults.astro`** flow still correct — see **`ANALYTICS-CONSENT-SPEC.md`** |
| 19 | **Logs** | Skim Vercel function logs for **`/api/contact`** errors |
| 20 | **HSTS `preload`** | In **`site/vercel.json`**, keep **`preload`** only if all subdomains meet [preload](https://hstspreload.org/) requirements |
| 21 | **CSP** | New third-party embeds → update **`Content-Security-Policy`** in **`site/vercel.json`** |

---

## Migrations only

| Step | Task | Done when |
|------|------|-----------|
| M1 | **`LEGACY_SITE_ORIGIN`** | Set before **`npm run import:news`** / **`import:people`** (see **`site/.env.example`**) |

---

## Crawler audit (Screaming Frog) — sitemaps, indexing, technical

Use this alongside Google’s [localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) guidance. Screaming Frog documents hreflang setup under [How to audit hreflang](https://www.screamingfrog.co.uk/how-to-audit-hreflang/) and issue classes under [Hreflang issues](https://www.screamingfrog.co.uk/seo-spider/issues/hreflang/).

### Spider configuration (typical)

1. **Config → Spider → Crawl** — enable **Crawl** and **Store** hreflang; optionally **Crawl Linked XML Sitemaps** (discover via `robots.txt` or paste `sitemap-index.xml`).
2. **Authentication** — if the deploy uses HTTP Basic Auth, add credentials in **Config → Authentication** (or crawl a no-auth preview).
3. **Rendering** — this site is SSR-friendly; start without JS rendering unless you expand heavy client-only UI.
4. After the crawl, use the **Hreflang**, **Response Codes**, **Directives**, **Canonicals**, and **Sitemaps** views; export **Issues** for hreflang errors.

### What this stack does well

- **`@astrojs/sitemap`** emits **`sitemap-index.xml`** / **`sitemap-0.xml`** at build time with **`PUBLIC_SITE_URL`** / **`VERCEL_URL`** as the URL prefix (avoid publishing a sitemap full of `http://localhost:4321` — set env on the **build** that deploys).
- **Filters** in `astro.config.mjs` drop thin migration news/people URLs, `/search`, and `/contact/thank-you` from the XML sitemap (good alignment with “no non-indexable URLs in sitemap”).
- **Canonical + hreflang** on locale templates are enforced post-build via `npm run verify:build-seo` (uses **`astro dev`** locally because **`astro preview`** is unsupported with **`@astrojs/vercel`**).

### Known gaps to track in SF / GSC (not automatic bugs)

| Topic | Detail |
|--------|--------|
| **Sitemap depth** | The generated XML sitemap includes **marketing static routes** (UK + `/us/` + `/ie/` mirrors). It does **not** currently enumerate every **`/news/{slug}/`** or **`/people/{slug}/`** URL. Discovery for articles and bios still relies on **internal links** and GSC; if you want every indexable article in XML, plan a **custom sitemap** or post-process step. |
| **`robots.txt` `Sitemap:`** | Production `site/public/robots.txt` may still omit the absolute `Sitemap:` line until the final public origin is fixed — add it for cleaner SF/GSC discovery (see *If you only have 5 minutes*). |
| **Staging hosts** | Non-allowlisted hosts get **`noindex`** + staging **`robots.txt`** via `vercel.json` — SF should show that on previews; production allowlisted hosts should not. |
| **RSS URLs** | Feeds live at **`/news/rss.xml`** (no trailing slash); `localeHref` matches that pattern for `news/rss.xml`. |

---

## Rollback triggers

| Symptom | Likely fix |
|---------|------------|
| Wrong host in canonical / OG / RSS | **`PUBLIC_SITE_URL`** → redeploy |
| Production noindexed or wrong `robots.txt` | **`site/vercel.json`** `missing` **host** list vs actual **`Host`** header on requests |
| Forms fail silently | Vercel env scope (Production vs Preview); **`CONTACT_WEBHOOK_URL`**; function logs |

---

*Last updated: align with `PUBLIC_SITE_URL` / `vercel.json` host allowlist behaviour in `site/README.md`.*
