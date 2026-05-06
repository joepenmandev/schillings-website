# Screaming Frog SEO audit — Schillings site

Technical crawl checklist aligned with **Screaming Frog SEO Spider** for structured data, hreflang, and canonical behaviour. Implementation references point at this repo (`site/` Astro app).

**Related code:** `site/src/layouts/Base.astro`, `site/src/lib/jsonld-organization.ts`, `site/src/lib/jsonld-page.ts`, `site/src/lib/person-jsonld.ts`, locale routes under `site/src/pages/`.

**External references:** Screaming Frog user guide (Spider configuration, extraction, Structured Data reporting); Google Search Central — structured data testing and validation; structured data validation issues.

---

## 1. How to run this audit in Screaming Frog (recommended setup)

### Spider → Rendering

Default **HTML-only** crawl is usually enough — the site is statically generated. Enable **JavaScript rendering** only if you need to validate behaviour after client-side hydration (e.g. maps / Leaflet); treat maps as secondary for SEO validation.

### Spider → Extraction

Enable extraction and validation for structured data per SF documentation:

- **JSON-LD** (primary)
- Optionally **Microdata** / **RDFa** if you add them later
- **Schema.org** validation where offered
- **Google rich result** validation where offered

### After the crawl

Use the **Structured Data** tab and filters such as:

- Contains structured data  
- Missing structured data  
- Validation errors  
- Warnings  

Exact filter names depend on your Screaming Frog version.

### Hreflang

Use SF **Hreflang** reporting (often under Response Codes / Hreflang workflows): check **missing return links**, **inconsistent targeting**, and **x-default** behaviour.

### Spot-check URLs (templates)

Crawl or manually verify a sample including:

| Pattern | Example |
|--------|---------|
| UK home | `/` |
| US home | `/us/` |
| IE home | `/ie/` |
| People bio | `/people/{slug}/`, `/us/people/{slug}/` |
| News author hub | `/news/author/{slug}/` |
| Contact | `/contact/`, `/ie/contact/` |
| About | `/about-us/` |
| Office | `/london/` (and matching `/us/`, `/ie/` office routes) |

---

## 2. Hreflang and canonicals (current behaviour)

### Implementation (`Base.astro`)

- **Canonical** = `origin` + locale-aware path (`publicPathname` — see `site/src/lib/public-url.ts`).
- **`hreflang`** is emitted only when `hreflangLocales` resolves to **≥ 2** locales **and** the current locale is in that set (`emitHreflang`). Each target gets `<link rel="alternate" hreflang="…">` using `htmlLang` from `site/src/i18n/config.ts` (e.g. `en-GB`, `en-US`, `en-IE`).
- **`x-default`** points at **default locale** (`en-gb`) URL for the same path when `en-gb` is in the alternate set — appropriate if UK URLs are the agreed global default cluster.

### Thin / migration / noindex pages

Pages that pass `hreflangLocales={[locale]}` produce **no cluster** (single locale) → **no hreflang** emitted. This avoids bogus reciprocal sets — **intentional**.

### Risks to verify in Screaming Frog (not necessarily bugs)

| Check | Notes |
|--------|--------|
| Reciprocal hreflang | Every URL in a cluster should list the **same** set of alternates; SF flags mismatches. |
| Self-reference | Each URL should include its own `hreflang`; the generator adds **all** targets including the current page. |
| x-default | Defaults to **UK** URLs — correct only if product/legal agree UK is the global fallback. |
| Thank-you / utility | No hreflang when only one locale — **intentional** for orphans. |

---

## 3. Structured data inventory by template

Every HTML page gets **two** JSON-LD payloads where applicable:

1. **Sitewide** `@graph` from **Base** → `buildSiteWideJsonLdGraph` (`jsonld-organization.ts`).
2. **Page-specific** `@graph` from the page template where implemented (`jsonld-page.ts`, `person-jsonld.ts`, etc.).

Google merges `@graph` entries across `<script type="application/ld+json">` blocks.

### Sitewide (all templates)

| Type | Source | Locale-aware? |
|------|--------|----------------|
| **Organization** | `jsonld-organization.ts` | **Partially:** London-oriented **PostalAddress** and SRA `identifier`; **`contactPoint`** lists London, Miami, and Dublin phones with **`areaServed`** (`GB` / `US` / `IE`). `sameAs`, `knowsAbout`. Legal HQ remains UK-flavoured in `address`. **Legal/comms:** intentional global-org model — see top-of-file comment in `jsonld-organization.ts`; office-level geo uses **LocalBusiness** on office URLs. |
| **WebSite** | Same graph | **Yes:** `@id` / `url` / `inLanguage` via `websiteNodeId(origin, locale)`. |
| **ImageObject** (logo) | Same graph | Shared logo URL. |

### Homepage (`/`, `/us/`, `/ie/`)

| Type | Notes |
|------|--------|
| **WebPage** | `buildPageEntityJsonLd` — `inLanguage`, `url`, `isPartOf` → locale **WebSite**, `about` → **Organization**. |

Homepage **title/description** are differentiated per locale via `locale-marketing-meta.ts` (`homePageMeta`).

### About (`/about-us/`, `/us/about-us/`, `/ie/about-us/`)

| Type | Notes |
|------|--------|
| **AboutPage** | Correct top-level type for “About”. |
| **BreadcrumbList** | Uses `absolutePageUrl` — URLs match real routes. |

**Gap:** Copy/schema descriptions are not strongly differentiated per market (IE/US vs UK) — product/content choice.

### Contact (`/contact/`, `/us/contact/`, `/ie/contact/`)

| Type | Notes |
|------|--------|
| **ContactPage** | Via `buildPageEntityJsonLd`. |

UI phone + form defaults are market-aligned; sitewide **Organization** uses London address + SRA + multi-region **`contactPoint`** (see sitewide table). Contact **meta title/description** differ by locale (`contactPageMeta`).

### Office hubs (`/london/`, `/miami/`, `/dublin/` + locale prefixes)

| Type | Notes |
|------|--------|
| **ContactPage** (page entity) | Yes. |
| **LocalBusiness** | `buildOfficeLocalBusinessJsonLd`: telephone, email, address, `addressCountry`, `parentOrganization` — strong location-specific schema. |

### Professional bios (`/people/{slug}/` …)

| Type | Notes |
|------|--------|
| **ProfilePage** | Per Google profile-page guidance. |
| **Person** | `jobTitle`, `description`, `knowsAbout`, `sameAs`, `worksFor` → Organization; optional `workLocation`, optional `image`. |
| **BlogPosting** (optional) | For listed authored pieces — links to news URLs in that locale. |
| **BreadcrumbList** | Merged into graph where implemented. |
| **Hreflang** | Full bios: default 3-way cluster; migration stubs: single locale. |

### Author archives (`/news/author/{slug}/` …)

| Type | Notes |
|------|--------|
| **CollectionPage** | `author` → Person `@id` on bio URL (cross-page entity matching). |
| **ItemList** of BlogPosting refs | Ties listing → articles. |

### News articles

| Type | Notes |
|------|--------|
| **BlogPosting** (+ breadcrumb script on some routes) | Article-level markup; validate dates/authors in SF. |

---

## 4. Issues and opportunities (prioritized)

### High confidence / product decisions

**Organization primary address vs regional phones**

Sitewide **Organization** still uses a **London postal address** and UK **SRA** `identifier` (single legal entity). **`contactPoint`** now includes regional telephone + **`areaServed`** per office (`jsonld-organization.ts` + `OFFICES.schemaTelephone`). **LocalBusiness** on office URLs remains the strongest geo-specific signal.

**Further options if audits still flag mismatch:**

- Add **SubOrganization** / extra **LocalBusiness** narrative nodes; or  
- Use **Department** / **LegalService** with area served; or  
- Document **one global Organization** + regional schema as the approved model.

**Rich-result eligibility**

Screaming Frog will flag Google rich-result rules (e.g. Article, Breadcrumb) separately from raw Schema.org validity. Treat warnings on **optional** fields as nice-to-have unless you target a specific rich result.

**Duplicate / overlapping graphs**

Two JSON-LD `<script>` blocks (Base + page) are **valid**. Watch for **duplicate `@id`** for the **same** entity with **conflicting** properties across scripts. **Organization** appears once in Base — OK.

### Medium

- **About hub meta:** Regional `/about-us/` titles already differ via `getAboutUsRegionModel`; **home, people index, contact** use `locale-marketing-meta.ts`. Further locale tuning on other routes is optional.
- **FAQ / HowTo / Video:** Not present on these templates — only add if you have **matching visible** on-page content (Google policy).

### Lower / verification

- **Crawl depth:** Ensure SF follows pagination and author hubs if full **ItemList** coverage matters.
- **Minimum engagement copy:** Currency/locale in UI (e.g. £) is a **compliance/branding** choice, not a schema requirement.

---

## 5. “Dynamic based on location” — scorecard

| Area | Dynamic? |
|------|----------|
| Canonicals, `og:url`, `og:locale`, HTML `lang` | Yes — per locale route. |
| Hreflang clusters | Yes where ≥ 2 alternates; suppressed for single-locale utilities. |
| **WebSite** JSON-LD | Yes — per locale. |
| Office pages → **LocalBusiness** | Yes — address/phone/country per office. |
| Person / **ProfilePage** | Yes — URLs and `workLocation` / `jobTitle` from profile + locale. |
| **Organization** (sitewide) | **Mixed** — London **address** + SRA on every page; **`contactPoint`** is **multi-region** (phones + `areaServed`). |

---

## 6. Suggested Screaming Frog export checklist (quick)

After a crawl, filter or export:

1. **Structured Data → Validation errors** (fix first).  
2. **Hreflang → Errors** (missing return tags, multiple entries, etc.).  
3. **Response Codes →** 404 / 5xx on sampled locale URLs.  
4. **Directives →** canonical consistency with `og:url`.

---

## 7. Compliance sign-off (one page)

Use this as a minimal record for SEO/comms/legal review:

- [ ] SF crawl completed (HTML default or JS per §1).  
- [ ] Structured Data: no blocking validation errors on priority templates (§3).  
- [ ] Hreflang: no reciprocal/return-tag errors on clustered URLs (§2).  
- [ ] Spot-check URLs from §1 load 200 and match expected canonical.  
- [ ] Organization vs LocalBusiness strategy documented (§4).  
- [ ] UK as `x-default` confirmed with stakeholders (§2).  

---

*Last aligned with implementation in-repo; update this doc when `Base.astro`, JSON-LD builders, or routing change materially.*
