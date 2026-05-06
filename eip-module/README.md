# Executive Intelligence Platform (archived module)

This folder holds the EIP implementation that was removed from the main Astro site so it can evolve on its own.

## Layout (mirrors paths under `site/`)

- `src/pages/executive-intelligence-platform/` — routes
- `src/components/platform/` — UI
- `src/lib/platform-docs.ts` and `src/lib/platform/` — loaders, linking rules, tests
- `src/data/platform-*.ts` — assessments, methodologies, scenarios
- `src/styles/platform.css` — platform styles (imported from `AssessmentShell.astro`)
- `docs/EXECUTIVE-INTELLIGENCE-PLATFORM/` — editorial and methodology Markdown

## Re-integrating into `site/`

1. Copy each `src/` subtree into `site/src/` (merge, do not duplicate top-level folders).
2. Copy `docs/EXECUTIVE-INTELLIGENCE-PLATFORM/` into `site/docs/`.
3. In `site/`: `npm install marked` (used by `PlatformMarkdown.astro`).
4. Restore navigation and promos: `SiteHeader.astro`, home/services/people/news pages (all locales), as needed.
5. Run `npm test` and `npm run build` from `site/`.

Tests for this module live under `src/lib/platform/` and `src/data/platform-assessments.test.ts`; they expect the same relative paths inside `site/src/`.
