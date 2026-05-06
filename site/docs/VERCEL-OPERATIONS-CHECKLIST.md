# Vercel Operations Checklist (Outstanding Items)

Use this to complete non-code platform settings after the repository hardening changes.

## 1) Enforce Production Release Path

- [ ] Project Settings -> Git
- [ ] Production branch set to `main`
- [ ] Auto-assign production deployments from `main` only
- [ ] Restrict who can trigger production deployments manually
- [ ] Confirm latest production deployment commit SHA matches `main`

## 2) Configure Staging Flow

- [ ] Branch `staging` exists and tracks `origin/staging`
- [ ] Create/assign staging domain (e.g. `staging.schillingspartners.com`)
- [ ] Map staging domain to `staging` branch deployment target
- [ ] Verify non-production controls on staging URL:
  - `INDEXING_VERIFY_URL="https://<staging-url>" npm run verify:nonprod-indexing`

## 3) Reviewer Access (One Person)

- [ ] Project Settings -> Deployment Protection
- [ ] Enable protection for previews/staging
- [ ] Preferred: Vercel Authentication (named reviewer account)
- [ ] Fallback: temporary password gate (strong random password, time-bounded)
- [ ] Revoke reviewer access after review window closes

## 4) Confirm Crawler Blocking

- [ ] Anonymous request to staging root returns `401`/`403` (protected), OR if publicly reachable:
  - `X-Robots-Tag: noindex, nofollow, noarchive`
  - `/robots.txt` returns disallow-all policy
- [ ] No staging URLs in Search Console property submissions
- [ ] No staging links in public docs/issues/chats

## 5) Post-Deploy Evidence to Capture

- [ ] Deployment URL
- [ ] Environment (production/staging/preview)
- [ ] Commit SHA
- [ ] Output of `npm run verify:nonprod-indexing`
- [ ] Reviewer signoff date and access removal confirmation

## Quick Commands

From `site/`:

```bash
npm run build
INDEXING_VERIFY_URL="https://<staging-or-preview-url>" npm run verify:nonprod-indexing
INDEXING_VERIFY_MODE=prod INDEXING_VERIFY_URL="https://schillingspartners.com" npm run verify:nonprod-indexing
```

