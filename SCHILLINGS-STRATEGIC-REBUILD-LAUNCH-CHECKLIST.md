# Schillings strategic rebuild — launch checklist

**Repository-only document.** This file is not part of the Astro site, is not copied to `site/public/`, and must not be linked from production pages. Use it internally for the strategic IA rebuild (situations, what we protect, response system, related hubs) and adjacent launches.

For domain cutover, env sequencing, and Vercel operations, also follow **`site/docs/DEPLOY-CHECKLIST.md`** and **`site/docs/VERCEL-OPERATIONS-CHECKLIST.md`**. For broader technical SEO, see **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`**.

---

## 1. Required pre-launch commands

Run from **`site/`** (where `package.json` lives) unless noted.

- [ ] **`npm ci`** (or **`npm install`**) — clean dependency tree
- [ ] **`npm run test`** — Vitest (including scripts under `scripts/*.test.ts` where applicable)
- [ ] **`npm run check:locale-parity`** — UK static routes mirrored for US / IE (see **`site/locale-parity-allowlist.json`** for intentional UK-only exceptions)
- [ ] **`npm run build`** — production build succeeds
- [ ] **`npm run verify:build-seo`** — post-build hreflang / canonical checks (see **`site/README.md`**)
- [ ] **`npm run audit:strategic-copy`** — static gates on **`site/src/data/strategic-rebuild-content.ts`** (hard failures block until copy/data fixes)
- [ ] **`npm run verify`** — full CI-shaped pipeline when you need Playwright + e2e (optional but recommended before major cutover)

Protected / Basic Auth note: automated **`fetch`** scripts (strategic crawl, staging SEO) **cannot** authenticate as a browser user. **Protected staging must be public or auth disabled for crawler checks:** use a **public** preview URL, **`DISABLE_SITE_BASIC_AUTH`** on a short-lived deploy, or **`BASIC_AUTH_HOSTS`** so `*.vercel.app` stays open while production hosts remain gated (see **`site/README.md`** — Environment variables).

---

## 2. Local verification

- [ ] **`npm run dev`** — smoke key routes: `/`, `/situations/`, `/what-we-protect/`, `/response-system/`, sample situation and WWP detail slugs, `/contact/`
- [ ] Confirm **locale switcher** / region links resolve to **`/`**, **`/en-us/…`**, **`/en-ie/…`** as intended (**`HREFLANG-STRATEGY.md`**)
- [ ] **`npm run verify:strategic-crawl:local`** — **`npm run build`**, then **`astro dev`** on **`127.0.0.1:4325`**, then **`verify:strategic-crawl`** (see **`site/README.md`**; Vercel adapter has no **`astro preview`**). Run **before** pushing to preview / relying on a deploy for strategic crawl confidence.
- [ ] Optional: **`BASE_URL=http://localhost:4321`** **`npm run verify:strategic-crawl`** only if you already have **`npm run dev`** on the default port and want the same script without the wrapper.
- [ ] Optional: **`npm run preview`** after **`npm run build`** — footer / sitemap absolute URLs use configured origin (**`site/README.md`** — dev vs preview; **`astro preview`** may be unavailable with **`@astrojs/vercel`**)

---

## 3. Staging verification

Use a **reachable** staging or Vercel preview origin. **Crawler checks require the host to be public or Basic Auth off** for that URL (see §1).

- [ ] **`npm run verify:strategic-crawl:local`** completed satisfactorily **before** treating the branch as preview-ready (local strategic route health).
- [ ] **`BASE_URL=https://<public-preview-url>`** **`npm run verify:strategic-crawl`** — same checks against the **live preview** (no login gate; use **`https://`** origin with no trailing slash per script expectations)
- [ ] **`STAGING_BASE_URL=https://<public-preview-url>`** **`npm run verify:staging-seo`** — migrated news URLs, canonical, hreflang, JSON-LD, sitemap alignment (see **`STAGING-SEO-VERIFICATION.md`** if present)
- [ ] **`INDEXING_VERIFY_URL=…`** **`npm run verify:nonprod-indexing`** — confirm **noindex** / **robots** behaviour matches expectations for **non-production** hosts (**`site/README.md`**)
- [ ] Manually spot-check **strategic deep links** (e.g. **`/response-system/#intelligence`**) from situation / WWP detail pages

---

## 4. UK / US / IE parity checks

- [ ] **`npm run check:locale-parity`** passes on the branch you ship
- [ ] New or changed **UK** paths under **`site/src/pages/`** have matching **`en-us`** and **`en-ie`** trees unless allowlisted
- [ ] **Hreflang** alternates and **`x-default`** align with **`HREFLANG-STRATEGY.md`** on representative templates (home, strategic hubs, one detail page per type)
- [ ] **Sitemap / indexing parity:** indexable UK URLs have correct alternates; **thin**, **stub**, or **migration** URLs use **`noindex`** consistently across locales (avoid UK indexable + US noindex mismatch without a documented reason)
- [ ] Footer **Region** links and HTML sitemap **regional** blocks list the same logical destinations per locale

---

## 5. Editorial review checklist

- [ ] **`npm run audit:strategic-copy`** — **zero errors**; review **warnings** (meta length, claims language, drift vs hub copy)
- [ ] Situation and WWP **titles**, **meta titles**, and **meta descriptions** approved; no unintended duplicate positioning across pages
- [ ] **Response System** pillar copy and **CTAs** (`Speak confidentially`, etc.) match brand and risk tone
- [ ] **Internal links** from strategic pages point to the correct locale-prefixed paths and intended anchors
- [ ] **News / people / services** cross-links from stubs or hubs are still accurate after IA changes

---

## 6. Legal / compliance review checklist

- [ ] **Regulated firm** disclosures, **SRA** references, and footer **compliance** links match current obligations (**`FOOTER-REGULATORY-CHECKLIST.md`**, **`site`** compliance routes)
- [ ] **Privacy**, **cookies**, **terms**, and **complaints** paths resolve and match marketing claims on new pages
- [ ] **Contact** and **lead** flows (including **`/api/contact`**, webhooks, retention) reviewed if copy promises change
- [ ] **Testimonials / outcomes** — avoid unverifiable claims; align with **`site/scripts/audit-strategic-copy.ts`** editorial rules where applicable

---

## 7. Analytics / conversion tracking checklist

- [ ] **Consent Mode** and tag loading order per **`ANALYTICS-CONSENT-SPEC.md`** (and **`ConsentModeDefaults.astro`**)
- [ ] **GA4 / GTM** (or chosen stack): production container IDs only on production; staging either blocked or uses a separate property as agreed
- [ ] **Conversion events** — contact form submit, key CTA clicks, phone/tel links if tracked — fire **after** consent where required
- [ ] **Preview / staging** — confirm analytics does not pollute production dashboards (hostname filters or opt-out)

---

## 8. Sitemap / robots checklist

- [ ] **Production:** **`robots.txt`** allows crawl and references **`sitemap-index.xml`** (or agreed production variant); **`PUBLIC_SITE_URL`** (or Vercel origin) matches the canonical host you want in sitemaps
- [ ] **Non-production / preview:** **`noindex`** (meta and/or **`X-Robots-Tag`**) and **`robots`** **disallow** behaviour match **`site/vercel.json`** and **`site/README.md`** — no accidental indexing of staging
- [ ] **Manual XML review:** open **`/sitemap-index.xml`** and the referenced child **`sitemap-*.xml`** / **`sitemap.xml`** (as your build emits them) in the browser or via **`curl`** — confirm structure, **`<loc>`** hosts, and that files are not error pages
- [ ] **No `noindex` URLs in submitted sitemaps:** URLs you submit for indexing should not be pages that emit **`noindex`** (meta or header); spot-check a sample of **`<loc>`** entries in DevTools or live HTML
- [ ] **Thin / `noindex` people profiles excluded:** migration-only or thin bio URLs that are **`noindex`** must **not** appear as indexable entries in sitemaps (align with **`site`** sitemap / people slug rules)
- [ ] **Strategic pages included where intended:** situations, what-we-protect, and response-system routes (UK and locale mirrors) appear in sitemap output when they should be discoverable; no accidental omission after IA changes
- [ ] **Sitemap parity:** XML sitemap includes **indexable** strategic URLs for **UK / US / IE** where they should be discovered; **excludes** `noindex` stubs, migration placeholders, and thank-you pages per **`site`** sitemap builders
- [ ] **Post-deploy:** fetch **`/sitemap-index.xml`** and a sample **`/sitemap-*.xml`** on production; spot-check strategic paths and alternates
- [ ] **HTML sitemap** (if used for QA) reflects the same route set as far as practical

---

## 9. Post-launch monitoring checklist

- [ ] **HTTP / CDN** — 200s on strategic hubs and top entry URLs; fix **404/5xx** spikes quickly
- [ ] **Search Console** (per property / locale) — coverage, sitemap ingestion, hreflang errors
- [ ] **Search Console accepts the sitemap** after launch — submitted **`sitemap-index.xml`** (or child sitemaps) shows **Success** / no persistent **Couldn't fetch** or **Error** for the production property; fix URL, robots, or hosting issues if Google reports failures
- [ ] **Redirects** — legacy paths from **`REDIRECT-MAP.md`** / **`vercel.json`** still hit the intended UK unprefixed or locale URLs
- [ ] **Rate limits / contact API** — webhook and **`api/contact`** health after traffic increase
- [ ] **Security headers** and **CSP** — no unexpected violations in browser console on key pages
- [ ] **Performance** — spot-check **PageSpeed** or similar on home + one strategic hub (**`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`**)

---

## 10. Rollback notes

- [ ] **Vercel:** keep the **previous production deployment** promotable; document the **last known good** deployment URL or Git SHA
- [ ] **DNS / domain:** if cutover involves DNS, record **TTL** and prior records to revert apex / **www**
- [ ] **Environment variables:** snapshot **`PUBLIC_SITE_URL`**, auth flags, and webhook URLs before change; revert if behaviour diverges
- [ ] **Git:** rollback branch or revert commit is preferable to hot-editing production-only config; tag the release (**`v…`**) after successful launch
- [ ] **If strategic routes are bad but rest of site is fine:** consider **temporary redirects** from new hub paths to legacy equivalents only if product/legal approves — document in **`REDIRECT-MAP.md`** and remove when stable

---

*Last updated for the Schillings Astro repo strategic rebuild. Update this file in Git only; do not publish as a public web page.*
