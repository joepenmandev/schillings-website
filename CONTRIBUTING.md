# Contributing

Engineering commands, CI, and environment setup live in **[`site/README.md`](./site/README.md)** (canonical for the Astro app). Planning specs and launch checklists live in the **[repo root `./`](./README.md)**.

## Architecture & design system governance

Before introducing:

- new **shared primitives**,
- **cross-family** abstractions,
- **hero / layout** systems,
- **token** promotions or new global tokens,
- or **reusable wrappers** that affect more than one page family,

read:

**[`site/docs/DESIGN-SYSTEM-GOVERNANCE.md`](./site/docs/DESIGN-SYSTEM-GOVERNANCE.md)**

The platform intentionally uses multiple **page families** (e.g. Strategic, Editorial, Narrative, Conversion, Profile) with different UX goals and implementation constraints. “Make it consistent” is not sufficient justification when it conflicts with **family intent** in that document.

**Architectural decisions** over time are indexed under **[`site/docs/architecture/adr/`](./site/docs/architecture/adr/)** (see the **ADR index** in the governance doc).

For substantial direction changes, use the **[RFC template](./site/docs/architecture/rfc-template.md)** and record outcomes in ADRs when appropriate.

Pull requests use **[`.github/pull_request_template.md`](./.github/pull_request_template.md)** so reviewers can see governance and family impact up front.

### CODEOWNERS (optional)

To route reviews for governance and token changes, copy **[`.github/CODEOWNERS.example`](./.github/CODEOWNERS.example)** to **`.github/CODEOWNERS`** and replace `@YOUR_GITHUB_OR_TEAM` with a real username or **`@org/team`**. Edit **[`.github/CODEOWNERS`](./.github/CODEOWNERS)** in this repo if placeholders are still present — GitHub ignores unknown handles.

**Drift checks:** `npm run verify:governance-docs` (from **`site/`**) validates section numbering, ADR index links, internal links, `§` references, and PR-template alignment with **§11** — not component or style enforcement.
