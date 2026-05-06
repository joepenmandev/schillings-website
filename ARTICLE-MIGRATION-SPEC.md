# Article migration specification (implementation-ready)

**Purpose:** Safely migrate all legacy blog/news articles (body + images) into this Astro stack with stable URLs, redirects, and SEO continuity.

**Scope for first pass:** import content, images, dates, metadata, and redirects.  
**Explicitly deferred:** accurate person-author mapping (legacy source is unreliable).

---

## 1) Locked decisions

## 1.1 URL structure (keep)

**Public paths (aligned with `IA-URL-SPEC.md`):**

- **UK (`locale` data key `en-gb`):** `/news/`, `/news/page/{n}/`, `/news/{slug}/`, `/news/rss.xml/` — **no** `/en-gb/` prefix in the live URL.
- **US / IE:** `/en-us/news/…`, `/en-ie/news/…` (same path pattern after the locale prefix).

**Template shorthand** (when `locale` is explicit in routing docs): `/{locale}/news/…` still means “news for that locale”; for **`en-gb`** the served path omits the segment.

Current locales: `en-gb`, `en-us`, `en-ie`.

## 1.2 Locale policy for articles

- Default import target: `en-gb`.
- Copy into `en-us` / `en-ie` only when content is intentionally shared.
- Region-specific posts may exist in one locale only (no fake alternates).

## 1.3 Canonical/hreflang rules

- Canonical: self-referential for each article URL.
- Hreflang: only for true alternates; must be reciprocal.
- Do not collapse all variants to one "global" canonical URL.

---

## 2) Data contract (source of truth)

Define/validate all imported records against this contract before writing app data.

## 2.1 Required fields

- `id` (stable internal key; deterministic across reruns)
- `slug` (stable public slug)
- `locale` (`en-gb` | `en-us` | `en-ie`)
- `title`
- `description` (SERP/meta summary)
- `datePublished` (ISO `YYYY-MM-DD`)
- `body` (normalized content blocks or normalized HTML)
- `legacyUrl` (original source URL)
- `status` (`published` | `draft` | `migrated-unreviewed`)

## 2.2 Strongly recommended fields

- `dateModified` (ISO)
- `heroImage.src`
- `heroImage.alt` (fallback rule required when missing)
- `topics[]`
- `services[]`
- `legacyAuthorRaw` (string from legacy page, unmapped)

## 2.3 Deferred fields (second pass)

- `authorSlugs[]`
- `reviewedBy`
- `editorialOwner`

---

## 3) Implementation order (do not change)

1. **Template first**
   - Final article template + list template wired to contract.
   - JSON-LD, OG, canonical, breadcrumb in place.
2. **Importer second**
   - Crawl/extract/normalize/write records.
   - Download and optimize images.
3. **Redirects third**
   - Emit and review `legacy -> new` mapping.
4. **QA gates fourth**
   - Validation reports + crawl checks + staging review.
5. **Author mapping fifth**
   - Backfill `authorSlugs` without changing article URLs.

---

## 4) Importer design

## 4.1 Inputs

- Legacy sitemap(s)
- Seed URL list (if sitemap incomplete)
- Existing redirect map (if present)

## 4.2 Processing pipeline

1. Discover URLs
2. Fetch HTML (retry/backoff + timeout)
3. Parse core metadata (title, description, dates, hero)
4. Normalize body content
   - headings, paragraphs, lists, quotes, tables, embeds
   - internal links rewritten to new patterns
5. Download media
   - local canonical path
   - optimize/compress
6. Validate against contract
7. Write output data
8. Emit machine-readable reports

## 4.3 Idempotency requirement

- Reruns must update existing records by `id`, not duplicate.
- Keep a deterministic slug/id strategy.

---

## 5) Normalization rules

- Preserve publish date exactly.
- Preserve modified date when available; else fallback to publish date.
- Strip boilerplate/cta fragments from body.
- Convert relative legacy asset links to normalized site paths.
- For missing hero alt: set empty string + add row to accessibility report.
- For missing description: generate from first paragraph (bounded length) and flag.

---

## 6) Redirect strategy

Generate a complete redirect table:

- `legacyUrl`
- `newUrl`
- `status` (301 expected)
- `reason` (`slug-preserved`, `slug-normalized`, `merged`, `removed`)

Rules:

- One-hop redirects only (avoid chains).
- Keep redirects live at least 12 months.
- Any unmapped legacy URL must be explicitly waived and documented.

---

## 7) Quality gates (must pass)

- 100% imported records pass schema validation.
- 0 duplicate slugs within same locale.
- 0 hard failures in image fetch/write.
- 0 broken internal article links in migrated corpus.
- 100% legacy URLs mapped or explicitly waived.
- `npm test` and `npm run build` pass.
- Spot QA sample signed off by editorial/compliance.

---

## 8) Deliverables per run

- `articles-imported.json` (or target data source)
- `articles-import-errors.json`
- `articles-import-report.md` (human summary)
- `redirect-map-news.csv`
- `image-missing-report.csv`
- `link-rewrite-report.csv`

---

## 9) Rollout plan

- **Wave 1:** low-risk historical posts to prove pipeline
- **Wave 2:** bulk migration
- **Wave 3:** high-traffic legacy posts + manual QA
- **Wave 4:** author backfill and structured data enhancement

---

## 10) Non-goals for first implementation

- No rewriting article substance for tone/brand.
- No large IA change for news routes.
- No forced hreflang alternates where no real equivalent exists.

---

## 11) Acceptance checklist

- [ ] Template(s) finalized against contract
- [ ] Importer implemented with deterministic idempotent writes
- [ ] Legacy URL coverage report reviewed
- [ ] Redirect map merged with platform config
- [ ] SEO checks complete on staging
- [ ] Production smoke checks complete (indexability, canonicals, hreflang, JSON-LD)

---

*Related:* `IA-URL-SPEC.md`, `HREFLANG-STRATEGY.md`, `REDIRECT-MAP.md`, `TECHNICAL-SEO-LAUNCH-CHECKLIST.md`, `site/README.md`
