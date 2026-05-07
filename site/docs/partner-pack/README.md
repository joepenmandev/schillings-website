# Partner Pack Automation

Deterministic pipeline for producing a partner-facing PDF that compares current live pages with the rebuilt platform.

## What it does

1. Captures full-page screenshots via Playwright (locked viewport).
2. Crops with fixed coordinates (Sharp).
3. Applies annotation overlays with consistent placement and style.
4. Optionally embeds one mobile inset in the profile "after" panel.
5. Renders an HTML board-paper layout.
6. Exports print-quality PDF from Playwright.

## Config

Primary manifest:

- `docs/partner-pack/partner-pack.config.json`

This is the only file you should edit for URL/crop/annotation changes.

## Run

From `site/`:

- `npm run partner-pack:generate`

Optional flags:

- `--config=<path>` custom manifest path
- `--env=production|staging|local`
- `--mode=partner|internal` presentation profile override
- `--beforeBaseUrl=<url>` override before-capture base URL
- `--afterBaseUrl=<url>` override after-capture base URL
- `--skip-capture` reuse existing cropped/annotated assets and only regenerate HTML/PDF

Examples:

- `npm run partner-pack:generate -- --skip-capture`
- `npm run partner-pack:generate -- --env=staging`
- `npm run partner-pack:generate -- --env=local --afterBaseUrl=http://localhost:4321`
- `npm run partner-pack:generate -- --env=production --beforeBaseUrl=https://www.schillingspartners.com`
- `npm run partner-pack:generate -- --mode=internal`

When `--env=local` is used without `--afterBaseUrl`, the generator auto-detects an Astro dev server on `localhost` ports `4321-4327`.

## Outputs

Generated under:

- `artifacts/partner-pack/`

Key files:

- `screenshots/raw/*.png`
- `screenshots/cropped/*.png`
- `screenshots/annotated/*.png`
- `partner-pack.html`
- `partner-pack.pdf`

## Capture lock policy

When stakeholder review approves screenshot source URLs and crop coordinates, keep them fixed. Re-capture only when content/layout has materially changed.

## Troubleshooting failed captures

- `Invalid partner-pack config`: fix required fields in `partner-pack.config.json` before rerunning.
- `Capture failed for URL`: verify URL is reachable and increase `capture.timeoutMs` / `capture.retries`.
- `--skip-capture requires existing...`: run once without `--skip-capture` to seed assets.
- Local environment capture issues: ensure the local Astro server is running at the expected URL.
