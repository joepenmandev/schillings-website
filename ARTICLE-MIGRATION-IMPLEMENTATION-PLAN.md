# Article migration — engineering implementation plan

**Purpose:** Turn `ARTICLE-MIGRATION-SPEC.md` into concrete, sequential engineering work with clear done criteria.

**Execution rule:** complete phases in order; do not start importer until template/schema phase is signed off.

---

## Phase 1 — Schema and template hardening

## Task 1.1: Introduce article import schema in code

- Add a strict validation schema (Zod or equivalent) for imported article records.
- Keep `authorSlugs` optional/deferred; include `legacyAuthorRaw`.
- Enforce ISO date formatting for `datePublished` and optional `dateModified`.

**Done when**

- Validation function exists and is unit tested.
- Invalid records fail with actionable errors (field + reason).

## Task 1.2: Align runtime `news` model to schema contract

- Add any missing fields needed by templates/SEO (`legacyUrl`, status, hero metadata).
- Ensure article pages can render all migrated records without template conditional debt.

**Done when**

- `npm test` and `npm run build` pass with schema-backed sample fixtures.

## Task 1.3: Finalize article/list rendering contract

- Confirm final card + article template fields before import writes begin.
- Keep existing URL structure unchanged.

**Done when**

- Template checklist in `ARTICLE-MIGRATION-SPEC.md` section 3 is complete.

---

## Phase 2 — Importer scaffolding (read, normalize, validate)

## Task 2.1: Create importer entrypoint + config

- New script with:
  - source sitemap/seed input
  - destination files
  - retry/backoff and timeout settings
  - dry-run mode

**Done when**

- Script runs in dry mode and prints intended write counts without writing files.

## Task 2.2: HTML extraction + normalization pipeline

- Parse title, description, dates, hero image, body blocks, legacy author string.
- Normalize headings, links, lists, blockquotes, embeds.
- Strip known legacy boilerplate segments.

**Done when**

- Fixture-based tests cover at least 10 legacy HTML patterns.

## Task 2.3: Media ingestion

- Download hero images to canonical local path.
- Optimize/compress and emit missing-image report.

**Done when**

- Import report includes fetched image counts and failures by URL.

## Task 2.4: Idempotent writes

- Stable `id` generation and upsert behavior.
- Re-run does not duplicate records.

**Done when**

- Two consecutive runs produce identical output hashes when source is unchanged.

---

## Phase 3 — Redirect and mapping outputs

## Task 3.1: Generate article redirect map

- Emit `redirect-map-news.csv` with:
  - `legacyUrl`, `newUrl`, `status`, `reason`

**Done when**

- 100% discovered legacy article URLs are mapped or explicitly marked waived.

## Task 3.2: Merge with platform redirects

- Integrate reviewed rows into root redirect artifacts.
- Avoid chains and conflicting wildcards.

**Done when**

- Redirect audit tests pass; random sample resolves in one hop.

---

## Phase 4 — QA automation and release gates

## Task 4.1: Add migration QA script

- Checks:
  - schema failures
  - duplicate slug per locale
  - missing body
  - broken internal article links
  - missing hero image refs

**Done when**

- CI-friendly command exits non-zero on any gate failure.

## Task 4.2: Staging SEO verification

- Crawl staging articles for canonicals, hreflang, JSON-LD, status codes.
- Confirm sitemap contains migrated indexable pages only.

**Done when**

- QA report archived and signed off by engineering + SEO owner.

---

## Phase 5 — Deferred author backfill

## Task 5.1: Author mapping dataset

- Build mapping table from legacy `legacyAuthorRaw` to `people` slugs.
- Keep unresolved cases explicit.

**Done when**

- Coverage percentage reported; unresolved list reviewed by editorial.

## Task 5.2: Backfill `authorSlugs` and person/article linking

- Update article data in-place with no URL changes.
- Rebuild person "published analysis" sections and schema links.

**Done when**

- `authorSlugs` backfill does not reduce pass rate on migration QA gates.

---

## Phase 6 — Release hardening (post-plan)

## Task 6.1: CI includes migration QA

- `npm run verify` runs `verify:news-migration` alongside people photos, tests, build, and e2e.

## Task 6.2: Stricter migration gates (optional extensions)

- `verify:news-migration` also validates:
  - `authorSlugs` resolve to `people-imported.json`
  - legacy `schillingspartners.com/.../news/{slug}` URLs in article body reference known slugs (imported ∪ sitemap list)

**Done when**

- Local and CI `npm run verify` stay green.

---

## Recommended command checkpoints

- After each phase:
  - `npm test`
  - `npm run build`
- Before release:
  - `npm run verify`
  - technical SEO checklist (`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`)

---

## Ownership checklist (fill before implementation)

- Engineering lead: ☐
- SEO lead: ☐
- Editorial owner: ☐
- Compliance reviewer: ☐

---

*Related:* `ARTICLE-MIGRATION-SPEC.md`, `REDIRECT-MAP.md`, `TECHNICAL-SEO-LAUNCH-CHECKLIST.md`, `HREFLANG-STRATEGY.md`
