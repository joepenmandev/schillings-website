# Recommended stack — solo builder (2026)

**Scope:** A **marketing website** for Schillings — services, people, news/insights, legal pages, contact. **Not** a logged-in client portal or productised web app. If something app-like is needed later, it can live on a **subdomain** and this site only **links** to it; that does not change the choice below.

**Decision:** Optimise for **fast HTML**, **strong SEO**, and **low client JavaScript**, while one person owns build and content tooling.

---

## Core (recommended)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Astro** + **TypeScript** | **Content-first:** mostly static HTML, **no JS by default**; add **islands** only for menus, filters, or small widgets. Excellent fit for a law-firm **site**, not an app. |
| Styling | **Tailwind CSS** | Same solo-builder speed as before; integrates cleanly with Astro. |
| CMS | **Sanity** (or **MDX/Markdown in Git** early on) | Sanity when editors or structured modules matter; MDX if you alone and want zero CMS cost. |
| Hosting | **Vercel**, **Netlify**, or **Cloudflare Pages** | All run Astro well; pick one account/policy you prefer. |
| Images | **Astro assets** (`astro:assets`) | Responsive images without shipping a heavy runtime. |
| i18n / hreflang routes | **Astro i18n** ([docs](https://docs.astro.build/en/guides/internationalization/)) | Route-per-locale when you implement alternates; pair with `link rel="alternate" hreflang="…"` in layouts. |

---

## Supporting

| Concern | Choice |
|---------|--------|
| Forms | **Astro Actions** or a **serverless function** on the host, or a **form backend** (e.g. Basin, Formspark, Getform) + **Turnstile** / hCaptcha. No need for a full app framework. |
| Analytics | **GA4** + **Consent Mode v2** (see `ANALYTICS-CONSENT-SPEC.md`). |
| Lint/format | ESLint + Prettier. |
| Repo | **pnpm** is fine. |

---

## Alternative you already know

**Next.js (App Router)** is still valid if you **strongly prefer React everywhere** or want one framework for every future project. For **website-only** work, you would use it in a **mostly static / server-rendered** way and avoid turning pages into SPAs. Astro usually means **less JS** and **simpler mental model** when there is no app.

---

## Scaffold (when you start)

```bash
pnpm create astro@latest .
```

Enable TypeScript, Tailwind, and ESLint in the wizard; add Sanity or MDX per your content plan.

---

## Future subdomain

Keep **portal / tools / apps** off this codebase. Same brand, **external link** from the main nav or footer; separate deploy and stack on the subdomain when that day comes.

---

*Related: `README.md`, `IA-URL-SPEC.md`, `TECHNICAL-SEO-LAUNCH-CHECKLIST.md`*
