# Security Hardening Checklist

Use this checklist for launch readiness and quarterly reviews.

## 1) Access and Identity

- [ ] Production access is restricted by role (least privilege).
- [ ] Staging and preview are behind deployment protection.
- [ ] Repository enforces MFA for maintainers.
- [ ] No shared personal accounts for deployment access.
- [ ] Offboarding process removes access within 24 hours.

## 2) Git and Branch Protection

- [ ] `main` is protected (no direct push).
- [ ] PR review required before merge.
- [ ] Required status checks must pass before merge.
- [ ] Force push disabled on protected branches.
- [ ] Signed commits policy is defined (optional, recommended).

## 3) CI/CD Security

- [ ] CI uses pinned action versions where practical.
- [ ] Build and test run on every PR.
- [ ] Failing checks block merge.
- [ ] Deploy-from-main only for production.
- [ ] Deployment logs are retained and auditable.

## 4) Dependency and Supply Chain

- [ ] Dependabot (or equivalent) enabled.
- [ ] Security alerts are triaged weekly.
- [ ] High/critical vulnerabilities have SLA for remediation.
- [ ] Lockfiles are committed and kept current.
- [ ] New third-party dependencies are reviewed.

## 5) Secrets Management

- [ ] Secrets are stored in platform env vars only.
- [ ] No plaintext secrets in repository history.
- [ ] Secret scanning is enabled in Git provider.
- [ ] Secret rotation schedule documented.
- [ ] Separate secrets per environment (prod/staging/dev).

## 6) HTTP and Browser Security

- [ ] HTTPS enforced everywhere.
- [ ] HSTS enabled (production domain).
- [ ] `X-Content-Type-Options: nosniff` enabled.
- [ ] `Referrer-Policy` set.
- [ ] `Permissions-Policy` set.
- [ ] CSP is defined and tested against breakage.
- [ ] Framing protection in CSP (`frame-ancestors`).

## 7) Robots, Indexing, and SEO Safety

- [ ] Staging/preview return `X-Robots-Tag: noindex, nofollow, noarchive`.
- [ ] Staging `robots.txt` disallows all crawlers.
- [ ] Production robots/canonicals are verified on each release.
- [ ] Staging URLs are not submitted to Search Console.

## 8) App and API Controls

- [ ] API payload validation is strict and centralized.
- [ ] Form endpoints include timeout and input size limits.
- [ ] Rate-limiting is applied to abuse-prone endpoints.
- [ ] Error responses avoid leaking internal details.
- [ ] Logging includes request correlation IDs.

## 9) Data Protection

- [ ] No production PII used in staging.
- [ ] Retention/deletion expectations documented.
- [ ] Backups and restore process tested.
- [ ] Compliance/legal requirements mapped to data flows.

## 10) Monitoring and Incident Response

- [ ] Uptime monitoring covers core routes and forms.
- [ ] Alert thresholds and on-call owner are documented.
- [ ] Incident runbook exists and is accessible.
- [ ] Post-incident review process is defined.
- [ ] Rollback runbook tested within the last 90 days.

## 11) Release Readiness (Go/No-Go)

- [ ] All required CI checks are green.
- [ ] Security checklist deltas reviewed.
- [ ] SEO checks completed (`sitemap`, canonicals, hreflang as applicable).
- [ ] Staging signoff recorded by engineering + product/marketing.
- [ ] Rollback owner confirmed for release window.

## Suggested Verification Commands

Run from `site/`:

```bash
npm ci
npm test
npm run build
```

Optional route smoke checks:

```bash
npm run preview
# then verify: /, /contact/, /sitemap/, representative /people/... and /news/...
```

