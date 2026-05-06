# Architecture Decision Records (ADRs)

Short, durable decisions live here. **Index:** [`DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) (ADR index + lifecycle table).

## Adding an ADR

1. Copy **`_ADR-TEMPLATE.md`** in this folder to `ADR-NNN-short-kebab-title.md` (next number).  
2. Set **Status** to `Proposed`, then `Accepted` when merged.  
3. If replacing an older ADR: set old file **Superseded by:** → new ADR; new file **Supersedes:** → old ADR.  
4. Add a row to the **ADR index** in the governance doc.  
5. Never delete **Superseded** ADRs without archival elsewhere — history matters.

## Status values

| Status | When to use |
|--------|--------------|
| **Proposed** | Draft / under review. |
| **Accepted** | Current truth. |
| **Superseded** | Replaced; link forward to the new ADR. |
| **Deprecated** | Decision withdrawn; explain if useful. |
