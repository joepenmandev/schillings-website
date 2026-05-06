# What makes a strong 404 page

This note summarises common guidance from search engines and UX practice, aligned with how we implement `src/pages/404.astro`.

## SEO and HTTP semantics

- **Return a real 404 (or 410)** from the server when a URL has no resource. A “soft 404” (200 OK with “not found” text) confuses crawlers.
- **`noindex`** on the HTML is appropriate so stray URLs are not treated as indexable thin pages. We use `noindex, follow` so link equity can still flow from any links on the page.
- **Do not set a misleading canonical** to the homepage for every missing URL. The canonical URL of a missing path is not the homepage; omit canonical on the global 404 template when it cannot reflect the request path at build time.

References: [Google Search Central — 404 pages](https://developers.google.com/search/docs/crawling-indexing/http-network-errors#soft-404-errors), [Avoid soft 404s](https://developers.google.com/search/docs/crawling-indexing/http-network-errors).

## User experience

- **Clear, human headline** — say plainly that the page was not found; avoid blaming the user.
- **Recovery paths** — prominent links to regional homepages, contact, directory/search, and major IA buckets (e.g. services, people).
- **Optional context** — showing the requested path (via client-side `location.pathname`) helps users confirm a typo or outdated bookmark.
- **Consistent brand** — same header, footer, typography, and colour tokens as the rest of the site so the page feels trustworthy, not like a dead end.
- **Accessibility** — one logical `h1`, labelled sections, skip link (via `Base` + header patterns), sufficient contrast.

## What we intentionally avoid

- **Keyword-stuffed** body copy written for bots.
- **Auto-redirect** to home without user action (disorienting and can look manipulative).
- **Separate 404 per locale** in static hosting unless product requires it — one well-designed global 404 with regional links scales more simply.

## Implementation checklist (this repo)

- [x] `noindex` in metadata
- [x] No false canonical to a single “success” URL (`errorPage` on `Base`)
- [x] Full site chrome (`SiteHeader`, `SiteFooter` via `Base`)
- [x] Correct UK URLs (`/` not `/en-gb/`, per `public-url.ts`)
- [x] Search, regional homes, contact (all locales), primary nav destinations
