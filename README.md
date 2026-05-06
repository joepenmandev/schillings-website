# Schillings website — planning & specification pack

Planning artefacts for a new or relaunched **schillingspartners.com** (or successor domain). Use in order roughly as listed.

**Where things live**

| Area | Doc / folder |
|------|----------------|
| **Astro app** | **[`site/`](./site/)** — deployable project |
| **Contributing & architecture governance** | **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** — when to read design-system rules; **[`.github/pull_request_template.md`](./.github/pull_request_template.md)** — governance/family checklist on PRs |
| **Engineering** (install, commands, CI, headers, routes, env) | **[`site/README.md`](./site/README.md)** — canonical; root `package.json` forwards `dev`, `build`, `test`, `verify`, `test:e2e`, `preview`, and people import scripts to `site/` |
| **Launch order** (local → Vercel → forms → compliance → SEO) | **[`STATUS.md`](./STATUS.md)** — checklist; defers command details to `site/README.md` |
| **Prioritized SEO / crawl backlog** | **[`IMPROVEMENT-PLAN.md`](./IMPROVEMENT-PLAN.md)** — P0–P2 from audit + SF alignment; use with `STATUS.md` |

| Document | Purpose |
|----------|---------|
| [RESEARCH-BRIEF.md](./RESEARCH-BRIEF.md) | Regulator and platform sources synthesized (SRA, ICO, Google, WCAG); pre-build decisions |
| [ENTITY-SERVICES-MATRIX.md](./ENTITY-SERVICES-MATRIX.md) | Entities, offices, services, hreflang sets — **fill with compliance** |
| [IA-URL-SPEC.md](./IA-URL-SPEC.md) | Final path taxonomy and templates |
| [redirect-map.csv](./redirect-map.csv) | Old → new URL mapping — **seeded** with legacy paths → **UK unprefixed** URLs (expand before cutover) |
| [REDIRECT-MAP.md](./REDIRECT-MAP.md) | Redirect process and column definitions |
| [CONTENT-METADATA-SPEC.md](./CONTENT-METADATA-SPEC.md) | Title, meta, H1, OG rules per template |
| [TECHNICAL-SEO-LAUNCH-CHECKLIST.md](./TECHNICAL-SEO-LAUNCH-CHECKLIST.md) | Pre/post-launch crawl and indexation checks |
| [IMPROVEMENT-PLAN.md](./IMPROVEMENT-PLAN.md) | **Prioritized** improvements (P0 launch → P1 crawl/SEO → P2 polish) and verification rhythm |
| [ANALYTICS-CONSENT-SPEC.md](./ANALYTICS-CONSENT-SPEC.md) | Cookies, CMP categories, GA4 events — **privacy sign-off** |
| [STACK.md](./STACK.md) | **Recommended implementation stack** (solo builder) |
| [PROJECT-ANSWERS.md](./PROJECT-ANSWERS.md) | **Public-source answers** + confirmed migration/form/analytics decisions |
| [FOOTER-REGULATORY-CHECKLIST.md](./FOOTER-REGULATORY-CHECKLIST.md) | **Law Society / SRA** expert web compliance workflow (badge, complaints, transparency) |
| [LEAD-QUALIFICATION.md](./LEAD-QUALIFICATION.md) | **£25k** gate, multi-step form, no remarketing |
| [HREFLANG-STRATEGY.md](./HREFLANG-STRATEGY.md) | UK at **`/`**; **`en-US` / `en-IE`** prefixed paths; **`x-default`**; Ireland EU gateway narrative |
| [ARTICLE-MIGRATION-SPEC.md](./ARTICLE-MIGRATION-SPEC.md) | **Implementation-ready** migration plan for importing all legacy news/articles (content, images, redirects, QA gates) |
| [ARTICLE-MIGRATION-IMPLEMENTATION-PLAN.md](./ARTICLE-MIGRATION-IMPLEMENTATION-PLAN.md) | Sequenced engineering tasks and done criteria to execute the article migration safely |
| [DESIGN-REFERENCES.md](./DESIGN-REFERENCES.md) | **Template / pattern** use — approved vs borrowed (stakeholder log) |
| [LIVE-SITE-EXTRACT.md](./LIVE-SITE-EXTRACT.md) | **Homepage crawl** — paths, footer, tokens, typography, Esface URLs, scripts (verify before launch) |
| [STATUS.md](./STATUS.md) | **Step-by-step** launch checklist (local → deploy → forms → compliance → SEO) |

**Disclaimer:** These are internal planning templates, not legal advice. Regulatory text must be confirmed for your entities and jurisdictions.
