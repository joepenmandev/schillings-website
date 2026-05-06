# ADR-003: Contact funnel width (`max-w-2xl`)

**Status:** Accepted — (`Proposed` | `Accepted` | `Superseded` | `Deprecated`)  
**Date:** 2026-05-06  
**Supersedes:** —  
**Superseded by:** —  

## Context

Contact is **conversion-oriented**. Narrow content width supports funnel focus, readability of form steps, and distinct UX from wide editorial or strategic layouts.

## Decision

- Contact page body sections and **`QualifyingForm`** context use a **narrow column** (implemented as **`max-w-2xl`** in contact templates / `ContactPageBody.astro`).  
- This is **governed** as a protected **conversion** pattern; widening for “global consistency” requires explicit product/design approval and **HIGH RISK** review.

## Consequences

- Do not reuse strategic or editorial max-width tokens for the contact funnel without intent review.  
- Changes to **`QualifyingForm`** remain **CRITICAL**-class (legal, qualification, analytics).

## References

- [`DESIGN-SYSTEM-GOVERNANCE.md`](../../DESIGN-SYSTEM-GOVERNANCE.md) §10, §14, Appendix A (protected systems)  
- `site/src/components/ContactPageBody.astro`, `QualifyingForm.astro`  
