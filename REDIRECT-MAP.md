# Redirect map — process and column spec

**Purpose:** One row per **old** URL that must resolve after launch. Feed this to engineering (server, edge, or CDN rules) and validate with a crawler.

**Primary reference:** [Google Search Central — Site moves and migrations](https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes); [Redirects and Google Search](https://developers.google.com/search/docs/advanced/crawling/301-redirects).

---

## Column definitions (`redirect-map.csv`)

| Column | Required | Description |
|--------|----------|-------------|
| `old_url` | Yes | Full URL as crawled today (include `https://`, `www` or not, trailing slash as live). |
| `new_url` | Yes | Final destination users and bots should receive — **one hop** to equivalent content. |
| `redirect_type` | Yes | Use **301** for permanent moves unless you have a specific temporary need (rare at launch). |
| `priority` | Optional | `high` / `medium` / `low` — e.g. by traffic, backlinks, or strategic pages. |
| `backlinks_or_traffic_notes` | Optional | GSC top pages, Ahrefs/SEMrush refs, or “brand homepage”. |
| `content_owner` | Optional | Who signed off equivalence of old vs new content. |
| `implementation_status` | Optional | `pending` / `live` / `verified`. |
| `notes` | Optional | Consolidations, regex exceptions, “do not redirect” (retire 410?), locale. |

---

## Workflow checklist

1. **Export** current indexable URLs (crawl + Search Console + analytics landing pages).
2. **Map** each to a **single** new URL; avoid chains (A→B→C). Merge duplicates explicitly.
3. **Implement** 301s on **production** before or at cutover; keep them **long term** (plan for **≥12 months** minimum per Google migration guidance).
4. **Verify** with a crawl: status codes, no accidental soft 404s, internal links updated where cheap.
5. **Search Console:** verify properties; use [Change of Address](https://support.google.com/webmasters/answer/9370220) only when it applies (domain-level moves).
6. **Update** sitemaps and remove obsolete URLs from active internal linking.

---

## `redirect-map.csv` status

The CSV now includes **initial** rows for legacy paths → **UK unprefixed** URLs (same rules as `site/vercel.json`). **`/en-gb/…`** targets in `new_url` are **deprecated** — use paths without the `/en-gb` segment. Expand with a full crawl export (articles, PDFs, legacy slugs) before cutover; remove rows that do not apply.

**Implementation:** Edge/host redirects should mirror the CSV; `site/vercel.json` is kept in sync for the Vercel deployment.

**Wildcards (Vercel only, not in CSV):** Current `site/vercel.json` includes stable-path rules such as **`/people/:path*`** → **`/people/:path*`**, **`/news/:path*`** → **`/news/:path*`**, **`/keith-schilling-biography/:path*`** → **`/keith-schilling-biography/:path*`**, locale unprefixed UK (**`/en-gb/:path*`** → **`/:path*`**), and **`/en-us` / `/en-ie`** → **`/us` / `/ie`**. There are **no** rules that send **`/expertise/…`** to **`/services/…`** or treat **`/services/…`** as canonical — the Astro build does not publish **`/services/…`**. Replicate on other CDNs if not using Vercel.

---

## Sitemap vs redirect-map (reconciliation pass)

**2026-05-04 — live `sitemap.xml` top segments:** `news`, `people`, `keith-schilling-biography`, `compliance`, `search`, `keith-schilling-founder`, `international`, `expertise`, `contact`, `about-us`, `24-7-immediate-response` (plus root). All non-locale **index** paths in that set are covered by **`vercel.json`** + CSV except paths that only exist as **legacy** shortcuts (e.g. **`/privacy-notice`**, **`/complaints-handling`**, **`/standard-terms-of-business*`** — added to CSV + Vercel **2026-05-04**).

**Expertise IA:** Public capability hubs on the new stack live under **`/expertise/…`** (UK), **`/us/expertise/…`**, **`/ie/expertise/…`** — see **`IA-URL-SPEC.md`** §2. **`/services/…`** was removed from this codebase. **No** production redirect rows were added here for **`/services` → `/expertise`** while the new site remains off the live domain; add explicit **`redirect-map.csv`** (and hosting) entries at cutover when mapping the legacy host to this IA.

**Google Search Console:** export **Top pages** and **External links** → add a CSV row (or wildcard pattern on your CDN) for every URL with meaningful traffic that is **not** already on the **canonical UK or locale-prefixed** path or wildcard-covered. Mark `implementation_status` → `verified` after a crawl.

---

*Related: `RESEARCH-BRIEF.md`, `ENTITY-SERVICES-MATRIX.md`*
