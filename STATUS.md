# Schillings site — step-by-step status

Use this list in order. Check off items as you complete them. **Install, scripts, and CI** are documented once in **[`site/README.md`](./site/README.md)** (including **`npm run verify`** and Playwright).

## Phase A — Run locally (done when you can open the site)

1. **Dependencies installed** — follow **`site/README.md`** (from **`site/`** or repo root with **`--prefix site`**).
2. **Dev server works** — **`npm run dev`** from repo root → **http://localhost:4321/** serves the UK homepage at **`/`** (details in **`site/README.md`**).
3. **Production build works** — **`npm run build`** from root or **`site/`**; output **`site/dist/`**.

## Phase B — Deploy (Vercel)

4. **Connect the repo** to Vercel with **root directory** = **`site`** *or* root = repo and override “Install/build” to run from `site` (match **`site/vercel.json`**).
5. **Environment variables** (Vercel → Settings → Environment Variables) — full list and optional Upstash keys: **`site/.env.example`** and **`site/README.md`** (§ Environment variables). Minimum for the form: **`CONTACT_WEBHOOK_URL`**, **`PUBLIC_FORM_ENDPOINT`** = **`/api/contact`** for Production (and Preview if you test there).
6. **Deploy** and confirm **`/`** returns **200** (UK home), **`/en-gb/…`** **301**s to the unprefixed UK path, and a sample legacy shortcut (e.g. **`/news`** → **`/news/`**). Optional scripted sweep from **`site/`**: **`LAUNCH_VERIFY_URL="https://…" npm run verify:launch-urls`** (also checks **`/contact/`**, **`sitemap-index.xml`**, **`/en-gb/`** → root).

## Phase C — Form & webhook

7. **Create the webhook** (Zapier/Make) to receive the JSON shape posted by **`QualifyingForm`** (see browser Network tab or **`site/api/contact.ts`** validation).
8. **Submit a test** from **`/contact/`** on the deployed URL; confirm the webhook receives payload. **Rate limiting** is implemented in **`api/contact`** (in-memory by default; optional **Upstash** for a global cap — see **`site/.env.example`**).

## Phase D — Compliance & copy

9. **Footer / regulatory**: re-read rendered footer vs **`FOOTER-REGULATORY-CHECKLIST.md`**; update **`site/src/data/regulatory-footer.ts`** if anything changed on the live firm site.
10. **SRA badge**: complete Yoshki / mySRA steps for the **production** hostname.
11. **Replace stubs**: compliance pages, **`src/data/news.ts`**, **`src/data/people.ts`**, Keith biography pages — swap placeholders for approved content (or wire a CMS).

## Phase E — SEO & migration

12. **News migration pages**: legacy article URLs from the live sitemap now build as **`noindex`** placeholders (see **`site/src/data/news-sitemap-slugs.json`**). **Refresh that JSON** after a major crawl if URLs change; replace entries with real articles in **`news.ts`** when ready (then they become indexable + in sitemap).
13. **People URLs**: wildcard redirect sends **`/people/:slug`** → **`/people/:slug`** (UK). **Migration placeholders** match news: **`people-sitemap-slugs.json`** (from live sitemap) + union in **`people-paths.ts`**; slugs not yet in **`people.ts`** render **`noindex`** stubs with no Person JSON-LD; sitemap omits those thin URLs. **Refresh the JSON** after a crawl when the live directory changes; replace with real bios in **`people.ts`** when ready.
14. **Expand `redirect-map.csv`** with every important old URL from Screaming Frog + Google Search Console; keep **`vercel.json`** wildcards + rows aligned with your CDN.

## Phase F — Polish (optional)

15. **Esface**: add licensed WOFF2 under **`site/public/fonts/`** and uncomment **`@font-face`** in **`site/src/styles/global.css`**.
16. **OG image**: replace **`site/public/og-default.svg`** with a **1200×630** PNG/JPEG from brand.
17. **Analytics / CMP**: when approved, follow **`ANALYTICS-CONSENT-SPEC.md`**.

---

## Documentation & verification log

Run in order when preparing a release (complements phases above).

| Step | Doc / artefact | Action |
|------|----------------|--------|
| 1 | **`PROJECT-ANSWERS.md`** + **`ENTITY-SERVICES-MATRIX.md`** | Keep in sync; matrix filled from public answers **2026-05-04** — re-validate entity rows with compliance before cutover. |
| 2 | **`FOOTER-REGULATORY-CHECKLIST.md`** §7 | QA rendered footer vs checklist; **`regulatory-footer.ts`** vs live legal text. |
| 3 | **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** | §0 locally; full §A–I on **staging** then **production**. |
| 4 | **`redirect-map.csv`** + **`REDIRECT-MAP.md`** | Merge **GSC** top pages + link export; keep **`site/vercel.json`** aligned. Vitest **`audit-redirect-map-vercel.test.ts`** catches CSV ↔ `vercel.json` drift. |
| 5 | **`npm run verify`** | Includes CSP/Yoshki (`audit-security-csp`), redirect audit, consent wire-up, Playwright smoke (Yoshki in HTML, migration news **noindex**). **On Vercel:** still check DevTools console once for CSP violations (headers do not apply to `astro preview`). |

**Last engineering pass (public HTTP + doc sync):** **2026-05-04** — live `sitemap.xml` **200**; **`/law`** **404**; live **`/privacy-notice/`** broken chain documented in **`PROJECT-ANSWERS.md`**; legacy redirects added for **`/privacy-notice`**, **`/complaints-handling`**, **`/standard-terms-of-business*`** (see CSV + `vercel.json`).

---

*Planning docs index: [README.md](./README.md) · App details: [site/README.md](./site/README.md)*
