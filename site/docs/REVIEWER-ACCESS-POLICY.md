# Reviewer Access Policy (Staging / Preview)

This policy is for giving a single external reviewer access to staging while keeping deployments non-indexable and private.

## Goal

- Allow one named reviewer to access staging.
- Prevent anonymous access and crawler indexing.
- Minimize blast radius and cleanup quickly after review.

## Access Standard (Preferred)

Use identity-based access, not shared credentials:

1. Enable deployment protection on staging/preview.
2. Require platform authentication.
3. Grant access to exactly:
   - owner(s)
   - one reviewer identity (email account)
4. Use least privilege permissions.

## Fallback Access (Only if identity-based is not possible)

- Use temporary password-based protection.
- Requirements:
  - strong random password (20+ chars)
  - expiry/rotation window defined (max 7 days)
  - no password reuse across environments
  - remove access immediately after review

## Indexing and Crawler Controls (Mandatory)

Keep all controls enabled for non-production:

- deployment protection (`401`/`403` to anonymous requests)
- `X-Robots-Tag: noindex, nofollow, noarchive`
- `robots.txt` disallow-all for non-production hosts

## Reviewer Onboarding Checklist

- [ ] reviewer name + email recorded
- [ ] review window start/end recorded
- [ ] environment URL shared via private channel only
- [ ] reviewer can access protected deployment
- [ ] non-prod indexing check executed:
  - `INDEXING_VERIFY_URL="https://<nonprod-url>" npm run verify:nonprod-indexing`

## Reviewer Offboarding Checklist

- [ ] reviewer access removed
- [ ] bypass links/tokens revoked
- [ ] temporary password rotated/disabled (if used)
- [ ] review URL removed from shared docs/chats if no longer needed

## Incident Response (Access Leakage)

If staging URL or credentials leak:

1. revoke reviewer access
2. revoke bypass links/tokens
3. rotate credentials
4. redeploy if needed
5. rerun non-prod indexing verification
6. record incident summary and remediation

## Operational Notes

- Do not paste staging URLs into public tickets/channels.
- Do not submit staging URLs/sitemaps to search engines.
- Keep this policy aligned with:
  - `docs/STAGING-DEPLOYMENT-SECURITY-PLAN.md`
  - `docs/SECURITY-HARDENING-CHECKLIST.md`
