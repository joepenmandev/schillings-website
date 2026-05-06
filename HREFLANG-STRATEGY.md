# Hreflang strategy — Schillings locations & Ireland EU gateway

**Facts:** Physical / published presences: **UK (London)**, **US (Miami)**, **Ireland (Dublin)**. **No** UAE office on the public contact page at last check — do **not** emit `en-ae` until you have a **real** alternate URL set.

**Business narrative:** Ireland as **gateway** for **EU litigation** and **platform / social takedowns** is a **positioning and content** story. **Hreflang** only signals **language–region targeting** for URLs that are **true alternates** of the same page — there is **no** `eu` or “all Europe” code.

**Source:** [Google — localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions).

---

## Official references (Google Search Central)

Use these as the canonical guidance (bookmark for audits and GSC triage):

| Topic | Documentation |
|-------|-----------------|
| **Hreflang & alternate URLs** (when to use, `x-default`, reciprocal sets, methods) | [Tell Google about localized versions of your page](https://developers.google.com/search/docs/specialty/international/localized-versions) |
| **Common mistakes** (return links, wrong regions, `noindex` + hreflang conflicts) | [Troubleshooting hreflang errors](https://developers.google.com/search/docs/specialty/international/troubleshooting-hreflang-errors) |
| **Site moves / migrations** (redirects, Search Console) | [Site moves and changes](https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes) |
| **Redirects** | [301 redirects and Google Search](https://developers.google.com/search/docs/advanced/crawling/301-redirects) |

**This repo:** `site/src/layouts/Base.astro` emits `<link rel="alternate" hreflang="…">` using **BCP 47** values **`en-GB`**, **`en-US`**, **`en-IE`** (from `htmlLang` in `site/src/i18n/config.ts`), plus **`x-default`** → the **same URL as the UK (en-GB) page** when `defaultLocale` is in the alternate set. Internal content keys remain **`en-gb`**, **`en-us`**, **`en-ie`**. **Only emit alternates when each locale URL is a true alternate** of the same page (see §3). Canonical URLs use **path only** (no query string), so people-directory filter query params (`?office=`, `?seniority=`, `?expertise=`) are for UX/sharing and do not create separate canonicals.

**Optional `hreflangLocales` prop** on `Base`: pass a **readonly subset** of locales (must include the current page’s `locale`) when a template is **not** a full three-way alternate; alternates emit only if **≥2** locales are listed. **`og:locale:alternate`** meta tags follow the same set. Omit the prop for the default (all locales).

---

## Global `/` vs locale URLs and filtering

- **UK** uses **unprefixed** paths (`/`, `/people/`, `/news/`, …). **US** and **Ireland** use **`/en-us/…`** and **`/en-ie/…`**. Do not add a second indexable UK path that duplicates the same intent (e.g. both `/people/` and `/en-gb/people/` as 200 OK); legacy **`/en-gb/…`** should **301** to the unprefixed UK URL.
- **Filtering** belongs on **each locale’s** people index (client-side and/or query params). The **directory dataset** can be global in *code* (`people.ts` + JSON), but **public URLs** stay per locale with **hreflang** between them when the pages are **equivalent alternates**.
- If **`en-ie`** people content later **differs materially** from **`en-gb`** (not just office order / intro copy), reassess whether a **full** reciprocal hreflang set is still accurate; Google’s guidance is to avoid pointing `hreflang` at URLs that are not true localized equivalents.

---

## 1. Recommended locale codes (English sites)

| Code | Role |
|------|------|
| **`en-gb`** | UK entity focus; **primary** ABS messaging; London HQ. |
| **`en-us`** | US entity / US audience pages. |
| **`en-ie`** | Ireland entity; **EU litigation** and **social / platform takedown** pillars where Dublin leads — same locale for “EU gateway” **English** content (do **not** invent `en-de` without German pages). |
| **`x-default`** | **Recommendation:** point to the **UK homepage** **`/`** (same URL as **`en-GB`**). For a UK-centred ABS, **`x-default` → UK** is the usual expert choice unless you intentionally prioritise US. |

Optional **`en`** (language-only): Google suggests a generic English alternate when you maintain several `en-*` pages — often **`en`** duplicates **`en-gb`** content URL or a dedicated “international English” page. **Only add if** you maintain the cluster consistently.

---

## 2. URL patterns (implemented in this repo)

**Primary locale (UK) at domain root; secondary locales prefixed**

| URL | Locale (internal) | `hreflang` (markup) |
|-----|-------------------|---------------------|
| `https://www.schillingspartners.com/` | `en-gb` | `en-GB` |
| `https://www.schillingspartners.com/en-us/` | `en-us` | `en-US` |
| `https://www.schillingspartners.com/en-ie/` | `en-ie` | `en-IE` |

Legacy **`/en-gb/…`** URLs **301** to the same path without the segment. **Option — geo in path** (e.g. `/uk/`) is **not** used here; if you ever add it, map **`hreflang`** explicitly — values are **not** inferred from words like “uk” in the path.

Full detail: `IA-URL-SPEC.md`.

---

## 3. Which pages get hreflang?

| Page type | Typical approach |
|-----------|------------------|
| **Homepage** | Full cluster: `en-GB`, `en-US`, `en-IE`, `x-default` (and `en` if used); `x-default` = UK `/`. |
| **Core service hubs** | Full cluster **when** each locale has a **substantively equivalent** page. |
| **EU litigation / takedowns** | May exist **only** under **`en-ie`** initially — **no** fake alternates; other locales link editorially, not via hreflang. |
| **People / news** | Per-page: only tag when **true** translations or regional equivalents exist. **Current build:** people index uses the same underlying directory for each locale with **locale-specific office section order** and copy; if future **en-ie** bios diverge strongly from **en-gb**, consider **omitting** `hreflang` on people until sets are reciprocal again, or narrow which templates emit alternates (requires a `Base.astro` prop — see engineering backlog). |

**Rule:** If a page exists in **one** language only, **omit** hreflang for that URL (except self-reference is not required for singletons — Google: annotations are for **alternate** sets).

---

## 4. Ireland “gateway” without breaking hreflang rules

- Use **`en-ie`** for pages **legitimately** led from **Dublin** / **Schillings Ireland LLP** (where that is accurate).  
- Use **on-page copy** and **internal linking** to explain EU-wide litigation and **platform** work — that is **messaging**, not extra hreflang codes.  
- If you later add **non-English** EU pages (e.g. `fr-fr`), add them only with **full** reciprocal sets.

---

## 5. Implementation checklist

- [ ] Every URL in a set lists **all** alternates **including itself**; **absolute** `https://` URLs.  
- [ ] **`en-GB`** / **`en-gb`** (data) — not **`en-uk`**.  
- [ ] `x-default` chosen and documented.  
- [ ] **GSC:** separate properties or domain property per Google guidance; monitor **International targeting** reports.  
- [ ] **Legal:** Irish pages reviewed for **Irish** regulatory footer content where Ireland entity is responsible.

---

## 6. Domain-level 301

If you **301 at domain level** from a legacy host to `schillingspartners.com`, **re-register** the **new** domain for the **SRA digital badge** in **mySRA** before relying on the badge script — see `FOOTER-REGULATORY-CHECKLIST.md`.

---

*Related: `ENTITY-SERVICES-MATRIX.md`, `IA-URL-SPEC.md`, `PROJECT-ANSWERS.md`, `TECHNICAL-SEO-LAUNCH-CHECKLIST.md`*
