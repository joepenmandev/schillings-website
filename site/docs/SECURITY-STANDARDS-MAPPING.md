# Security Standards Mapping (2026 Baseline)

This document maps Schillings website controls to widely used security guidance so implementation and audits use a shared baseline.

## Standards Used

- **OWASP ASVS 5.0** (technical verification baseline)
- **OWASP Top 10:2025** (risk prioritization lens)
- **NIST SP 800-218 (SSDF)** (secure development lifecycle practices)
- **CISA Secure by Design** (organizational security outcomes)

## Current Control Mapping

## Access Control and Environment Protection

- **Control:** deployment protection for non-production access (auth gate / 401-403 behavior)
- **Repo artifacts:**
  - `docs/STAGING-DEPLOYMENT-SECURITY-PLAN.md`
  - `docs/REVIEWER-ACCESS-POLICY.md`
  - `scripts/verify-nonprod-indexing.mjs`
- **Mapped standards:**
  - ASVS: V6 (Authentication), V8 (Authorization)
  - Top 10: A01:2025 Broken Access Control, A07:2025 Authentication Failures
  - SSDF: PW / RV (protect software and verify controls)
  - CISA: Take ownership of customer security outcomes

## Non-Production Indexing and Crawler Blocking

- **Control:** non-production noindex header + disallow-all robots
- **Repo artifacts:**
  - `vercel.json` (`X-Robots-Tag` host-scoped headers + `robots.txt` rewrite)
  - `public/robots-staging.txt`
  - `scripts/verify-nonprod-indexing.mjs`
- **Mapped standards:**
  - ASVS: V1 (Input/Output handling context), V14 (Data protection), V16 (logging/error posture)
  - Top 10: A02:2025 Security Misconfiguration
  - SSDF: PO / PW (define and enforce secure defaults)
  - CISA: Secure by default; transparency/accountability

## HTTP Security Headers

- **Control:** HSTS, CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy
- **Repo artifacts:**
  - `vercel.json` headers section
  - `README.md` hardening notes
- **Mapped standards:**
  - ASVS: V12 (Secure communications), V14 (Data protection)
  - Top 10: A02:2025 Security Misconfiguration, A05:2025 Injection (via CSP risk reduction)
  - SSDF: PW.6 / RV (harden deployment configuration)

## Dependency and Build Integrity

- **Control:** lockfiles committed, CI workflow and verification scripts documented
- **Repo artifacts:**
  - `.github/workflows/ci.yml`
  - `package-lock.json`
  - `README.md` verify scripts section
- **Mapped standards:**
  - ASVS: V2 (Configuration), V16 (Logging/monitoring readiness)
  - Top 10: A03:2025 Software Supply Chain Failures, A08:2025 Software/Data Integrity Failures
  - SSDF: PS / PW / RV practices (secure build and verification)

## Security Operations Process

- **Control:** staged checklists, runbooks, reviewer lifecycle, incident response steps
- **Repo artifacts:**
  - `docs/SECURITY-HARDENING-CHECKLIST.md`
  - `docs/STAGING-DEPLOYMENT-SECURITY-PLAN.md`
  - `docs/REVIEWER-ACCESS-POLICY.md`
- **Mapped standards:**
  - ASVS: V16 (Logging and error handling governance)
  - Top 10: A09:2025 Security Logging and Alerting Failures
  - SSDF: PO / RV / response governance
  - CISA: Lead from the top, radical transparency

## Open Gaps / Next Hardening Steps

- Move from permissive CSP (`'unsafe-inline'`) to nonce/hash-based policy where feasible.
- Enforce production deployment from protected branch only (avoid accidental local production deploys).
- Add post-deploy automated checks in CI for staging/preview indexing controls.
- Add explicit host allowlist governance process when production domains change.

## Evidence Collection (Release / Audit)

For each release window, retain:

- output of `npm test` and `npm run build`
- output of `INDEXING_VERIFY_URL=... npm run verify:nonprod-indexing`
- deployment metadata (URL, environment, commit SHA)
- signoff checklist from `docs/SECURITY-HARDENING-CHECKLIST.md`

