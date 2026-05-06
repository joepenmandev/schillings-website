# ADR-002: Strategic vs editorial page families

**Status:** Accepted — (`Proposed` | `Accepted` | `Superseded` | `Deprecated`)  
**Date:** 2026-05-06  
**Supersedes:** —  
**Superseded by:** —  

## Context

The site serves different user tasks: scanning and chapter-like **strategic** hubs vs reading-measure **editorial** content. Collapsing these into one “universal” layout would harm clarity and intent.

## Decision

- **Strategic** surfaces keep hub-oriented hierarchy, components, and CTAs appropriate to scanning and chapter flow (e.g. `StrategicPageTitle`, strategic breadcrumbs, hub cards).  
- **Editorial** surfaces keep article measure, book-style heroes, and news-specific patterns.  
- Cross-family reuse is limited to **SAFE**-class tokens and small primitives; semantic layout is **not** forced to match across families.

## Consequences

- New shared abstractions must be checked against **family leakage** (governance §17).  
- “Visual consistency” alone does not justify merging strategic and editorial templates.

## References

- [`DESIGN-SYSTEM-GOVERNANCE.md`](../../DESIGN-SYSTEM-GOVERNANCE.md) §3 (intent), §10 (protected merges), §31 (decision table)  
