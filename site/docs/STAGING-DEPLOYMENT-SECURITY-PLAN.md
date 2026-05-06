# Staging Deployment Security Plan

This plan defines how Schillings staging and preview environments should be deployed, protected, and operated.

## Objectives

- Keep non-production environments private by default.
- Prevent staging URLs from being indexed by search engines.
- Ensure changes are verified in staging before production release.
- Reduce accidental data leaks, weak access controls, and misconfigured deployments.

## Environment Model

- **Production**
  - Branch: `main`
  - Domain: `schillingspartners.com` and approved public aliases
  - Indexable: Yes
- **Staging**
  - Branch: `staging`
  - Domain: `staging.schillingspartners.com`
  - Indexable: No
- **Preview**
  - Source: Pull request / feature branch builds
  - Domain: Platform-generated preview URLs
  - Indexable: No

## Access Control ("Security Box")

Apply controls in this order:

1. **Platform deployment protection**
   - Require authentication or password for staging and preview.
   - Restrict bypass links/tokens to approved users only.
2. **IP allowlist** (where feasible)
   - Limit staging access to office/VPN addresses.
3. **Optional edge access control**
   - Add Cloudflare Access (or equivalent) for stricter identity-based access.

## Search Engine Blocking (Mandatory)

For staging and preview responses:

- Send response header:
  - `X-Robots-Tag: noindex, nofollow, noarchive`
- Serve a restrictive `robots.txt`:
  - `User-agent: *`
  - `Disallow: /`

Rules:

- Never submit staging/preview sitemaps to Search Console.
- Keep production canonical behavior intact; do not canonicalize staging to itself for indexable intent.

## Secrets and Configuration

- Store secrets only in platform environment variables.
- Do not commit `.env` or credentials to Git.
- Separate env var scopes:
  - Production-only secrets
  - Staging-only secrets
  - Shared non-sensitive variables
- Rotate secrets on role changes and after incident response.

## CI/CD Release Gates

Required checks before merge to `main`:

- `npm ci`
- `npm test`
- `npm run build`
- Lint/type checks (if configured)
- Route smoke checks for key pages:
  - `/`
  - `/contact/`
  - `/sitemap/`
  - representative people/news pages

## Security Baseline Controls

- Enforce secure headers in all environments:
  - Content Security Policy (CSP)
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `frame-ancestors` via CSP
- Keep API/form protections enabled:
  - request validation
  - request timeout
  - rate limits
  - bot/spam controls as needed

## Operational Runbooks

Maintain and test:

- **Rollback runbook**
  - owner, trigger criteria, rollback steps, communication template
- **Security incident runbook**
  - triage, containment, logging, escalation, postmortem
- **Release checklist**
  - SEO, security, compliance/legal signoff

## 7-Day Rollout Plan

1. Create `staging` branch and staging domain.
2. Enable staging/preview access protection.
3. Add non-prod indexing blocks (`X-Robots-Tag`, `robots.txt` behavior).
4. Enforce branch protections and required CI checks.
5. Validate secure headers and API guardrails.
6. Add runbooks and ownership.
7. Perform staging-to-production dry run.

## Ownership

- **Engineering lead**: implementation and CI gates
- **Security owner**: policy and incident readiness
- **Marketing/SEO owner**: indexing/canonical governance
- **Compliance owner**: release approval where required

## Related Policy

- Reviewer access runbook: `docs/REVIEWER-ACCESS-POLICY.md`
- Vercel platform steps: `docs/VERCEL-OPERATIONS-CHECKLIST.md`

