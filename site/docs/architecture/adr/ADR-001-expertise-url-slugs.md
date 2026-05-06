# ADR-001: Expertise URL slugs (`/expertise/{expertiseId}/`)

**Status:** Accepted — (`Proposed` | `Accepted` | `Superseded` | `Deprecated`)  
**Date:** 2026-05-06  
**Supersedes:** —  
**Superseded by:** —  

## Context

Capability URLs must stay stable for `hreflang`, redirects, and internal linking. Expertise hubs use a controlled slug set, not arbitrary strings.

## Decision

- UK paths: **`/expertise/`** and **`/expertise/{expertiseId}/`** (no `/en-gb/` prefix on UK).  
- US/IE: **`/us/expertise/…`**, **`/ie/expertise/…`** per locale rules.  
- Allowed **`expertiseId`** values are defined in **`site/src/data/people-taxonomy.ts`** (`EXPERTISE_IDS`).  
- Authoritative URL taxonomy: repo **`IA-URL-SPEC.md`** (expertise rows).

## Consequences

- New expertise areas require taxonomy updates, redirects if URLs ever change, and locale parity checks.  
- Internal links must target **`expertise/…`**, not legacy **`services/…`**.

## References

- `IA-URL-SPEC.md` — expertise pattern  
- [`DESIGN-SYSTEM-GOVERNANCE.md`](../../DESIGN-SYSTEM-GOVERNANCE.md) — CRITICAL-class routing / migration alignment where applicable  
