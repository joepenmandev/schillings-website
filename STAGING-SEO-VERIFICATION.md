# Staging SEO verification workflow (Task 4.2)

This workflow verifies migrated news pages on a live staging host and archives a machine-readable QA report for engineering + SEO sign-off.

## Run

From `site/`:

```bash
STAGING_BASE_URL="https://<staging-host>" npm run verify:staging-seo
```

Optional owner attribution:

```bash
STAGING_BASE_URL="https://<staging-host>" \
STAGING_REPORT_OWNER_ENGINEERING="Engineering owner" \
STAGING_REPORT_OWNER_SEO="SEO owner" \
npm run verify:staging-seo
```

## Gates enforced

- Article URL status code is `200`.
- Canonical exists and matches the article URL.
- Hreflang alternates include the UK cluster (**`en-GB`** in markup; verifier normalizes to `en-gb`) (warns if `x-default` missing).
- JSON-LD script exists.
- `sitemap-index.xml` and child sitemaps are fetchable.
- All published imported article URLs are present in sitemap.
- Non-published imported article URLs are not present in sitemap.

## Report archive

- Output path: `site/reports/seo/staging-seo-<timestamp>.json`
- The command exits non-zero on any gate failure.
- Keep the report artifact with release evidence.

## Sign-off record

| Role | Name | Date | Report file |
|------|------|------|-------------|
| Engineering |  |  |  |
| SEO |  |  |  |

