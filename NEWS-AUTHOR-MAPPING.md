# News Author Mapping (Task 5.1)

This mapping maps legacy `legacyAuthorRaw` values from `site/src/data/news-imported.json` to `people/{slug}` profiles in `site/src/data/people-imported.json`.

## Coverage

- Unique legacy author names found: `2`
- Unique legacy author names mapped: `2`
- Coverage: `100%`

## Mapping artifact

- `site/src/data/news-author-mapping.json`

## Unresolved cases

None.

## Task 5.2 — `authorSlugs` backfill

- **Data:** `authorSlugs` added on every row in `site/src/data/news-imported.json` where `legacyAuthorRaw` maps in `news-author-mapping.json` (164 rows).
- **Runtime:** `site/src/data/news.ts` merges editorial stubs with `news-imported.json` (stubs win on duplicate `slug`).
- **Sitemap:** `site/astro.config.mjs` treats `status: "published"` slugs in `news-imported.json` as published for thin-page / sitemap filtering (in addition to literals in `news.ts`).
- **Re-run after import:** `npm run backfill:news-authors` (idempotent).

