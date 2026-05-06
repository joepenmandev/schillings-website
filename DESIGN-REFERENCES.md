# Design references — controlled template use

**Purpose:** Record **where we look for patterns** (layout, rhythm, accessibility, responsive behaviour) without replacing **approved** Schillings brand art direction. Stakeholders can see scope: **borrow structure, not identity**.

**Stack:** Astro + Tailwind (`site/`). References should be **rebuildable** as static components, not dropped-in as a different brand skin.

---

## Answers based on **current** [schillingspartners.com](/)

These entries describe what the **live site already does** (structure + messaging patterns). Treat that as the **primary approval baseline** for the rebuild unless marketing explicitly revises it. External templates fill **only gaps** the current site does not define (e.g. multi-step qualification).

### Global / positioning (from live)

| Element | What the current site does | Rebuild note |
|---------|-----------------------------|--------------|
| **Browser title pattern** | `Protecting Your Reputation, Privacy and Security \| Schillings` | Keep equivalent **title + pipe + Schillings** pattern unless brand requests change (`CONTENT-METADATA-SPEC.md`). |
| **Hero headline** | **High stakes, handled.** (H1-level prominence) | Preserve as hero line or approved successor. |
| **Opening proposition** | Single paragraph on **integrated** expertise (reputation, privacy, safety, high stakes). | Keep meaning; tighten copy with compliance. |
| **Capability pillars** | Five blocks: **Intelligence**, **Law**, **Communications**, **Security**, **Diplomacy** — each with a **short supporting line**. | IA + home section structure should **map 1:1** unless strategy changes. |
| **Editorial “split headline” strips** | Pairs of large lines (e.g. theme + payoff: privacy / assured; fake news / corrected; …). | Recreate **rhythm and contrast**, not necessarily identical line breaks. |
| **Typography** | **`--font-family`:** `Esface`, `Palatino Linotype`, sans-serif — mapped to `font-sans` in `site/src/styles/global.css`. | **Self-host** Esface WOFF2 under `site/public/fonts/` when licensed; until then the stack falls back to Palatino. Reference file names in `LIVE-SITE-EXTRACT.md` (data only — do not hotlink the old CMS). |
| **Colour** | **`:root` tokens** in `site/src/styles/global.css`: `--utility-1` #f5f2ef, `--utility-2` #eeeae4, `--primary-1` #9c7a8f, `--secondary-2` #b8a6b0, `--secondary-3` #7d2442, `--secondary-4` #2d012b, `--black`, `--white` — exposed as Tailwind colours (`bg-utility-1`, `text-secondary-4`, `bg-brand-white`, etc.). | Do not change hex values without sign-off. |

### Known issues on live (**not** approval targets)

| Issue | Where | Action in new build |
|-------|--------|------------------------|
| **Placeholder copy** | Homepage contains **Lorem ipsum** | Remove entirely; replace with real or approved interim copy. |
| **Duplicate blocks** | Contact page text repeats **UK / US / Ireland** blocks in the crawl | Deduplicate in new layout; single clean office list. |
| **Form UX** | News page shows generic success/error strings in crawl | Replace with intentional form handling + `LEAD-QUALIFICATION.md` on contact. |

### Home — structure to preserve

1. Hero: headline + body proposition.  
2. Five-pillar capability grid (labels + one line each).  
3. Multiple **theme strips** (headline pairs) for outcomes.  
4. (When Lorem is removed) equivalent **proof or narrative** section — do not leave empty.

### Contact — structure to preserve

1. **H1:** Contact us.  
2. **Media enquiries** as a distinct block.  
3. **Urgent / 24h** path with **+44 (0)20 7034 9000**.  
4. **Offices:** London, Miami, Dublin — addresses as published.  
5. **Find us** / **Enquiries** entry points.  
6. **New:** multi-step **£25k** qualifier (not on live today) — this is the main **borrowed** UX pattern; skin with Schillings tokens.

### News & insights — structure to preserve

| Element | Current behaviour |
|---------|-------------------|
| Title | `News & Insights \| Schillings` |
| H1 | News & Insights |
| Intro | One line on latest news/views/analysis. |
| **Topic chips** | Long list (Investigations, Reputation, Privacy, AI, …) — category / filter vocabulary. |
| **Filter UI** | “All / News / Insights” style filter (per crawl). |

Preserve **taxonomy + filter model** when moving to Astro; improve accessibility (keyboard, `aria` on filters).

### Compliance / legal pages

| Element | Current behaviour |
|---------|-------------------|
| Pattern | Long-form, headings, bullet lists, links to SRA / complaints. |
| Example | [Schillings SRA page](/compliance/schillings-sra) |

Keep **content hierarchy**; migration may **reshape** layout (readable max-width, TOC) without changing legal meaning — compliance approves copy.

---

## Principles (agreed)

| Rule | Detail |
|------|--------|
| **Approved layer is fixed** | Logo, colour palette, typography, imagery rules, voice — sign-off required for any change. **De facto:** current live site minus bugs above. |
| **Templates inform layout only** | Use Mishcon / Tailwind UI / Astro themes only where **schillingspartners.com** does not specify behaviour (e.g. step progress UI). |
| **One primary reference per template type** | **First** reference = current Schillings URL; **second** = external pattern if needed. |
| **Document every borrow** | Table below — updated from live site analysis. |

---

## Page types ↔ references (current site **first**)

| Page type | Primary reference (approved baseline) | External pattern (borrow if needed) |
|-----------|----------------------------------------|-------------------------------------|
| **Home** | [schillingspartners.com](/) | Mishcon / Astro marketing themes for **section spacing** only |
| **Service hub** | *(Build to match future IA; live may not mirror final slugs)* | Mishcon practice hub rhythm |
| **Article / insight** | [News & Insights](/news) listing + article templates once URL known | Mishcon article typography |
| **People index** | *(Confirm live people URL when stable)* | Mishcon people filters |
| **Contact / qualify** | [Contact](/contact) for **offices + phone + media** | `LEAD-QUALIFICATION.md` + Tailwind UI for **multi-step** |

---

## Template / pattern libraries (Astro + Tailwind friendly)

| Resource | Use for | Notes |
|----------|---------|--------|
| [Astro themes](https://astro.build/themes/) | Gaps not covered by live site | Strip to sections; keep Schillings tokens |
| [Tailkits Astro](https://astro.build/themes/details/tailkits-astro/) | Marketing blocks | Same |
| [Tailwind UI](https://tailwindui.com/) | Contact steps, FAQ, grids | Same |
| [Mishcon](https://www.mishcon.com/) | Peer **editorial density** only | Do not copy assets or copy |

---

## Approved vs borrowed (living log) — **filled from live site**

| Area | Approved (baseline = current live unless noted) | Borrowed (structure/UX only — re-skinned) | Status |
|------|--------------------------------------------------|---------------------------------------------|--------|
| **Global** | Title pattern; “Schillings” framing; five pillars + editorial strips; **SVG logotypes** in `site/public/brand/` (`schillings-logo-rgb.svg`, `schillings-logo-negative.svg`) | — | Match [homepage](/) |
| **Header / nav** | *(Infer from live header in browser / Figma)* | Sticky / mobile menu **behaviour** from Tailwind UI if live lacks pattern | Confirm with design |
| **Home hero** | “High stakes, handled.” + proposition paragraph | None for headline; **remove Lorem** | Fix placeholder |
| **Home body** | Pillar labels + split-line sections | Optional: Mishcon-style **hub links** under pillars if approved | Optional |
| **Service hub** | TBD per IA | Mishcon-style sub-hub cards | When services ship |
| **News listing** | Topic chips + All/News/Insights filter model | Accessible filter primitives (Tailwind UI / Headless UI patterns) | [News](/news) |
| **People** | TBD when URL stable | Mishcon list density | Pending |
| **Contact** | Offices, phones, media, 24/7 CTA; **dedupe** regions | **Multi-step £25k gate** — new vs live | [Contact](/contact) + `site/` form |
| **Footer / regulatory** | SRA page content & links — `FOOTER-REGULATORY-CHECKLIST.md` | Multi-column footer layout from Tailwind UI | [SRA compliance](/compliance/schillings-sra) |

---

## Out of scope without explicit approval

- New **colour system**, **font families**, or **illustration style** driven by a purchased template  
- **Dark mode**, heavy **motion**, or **sound** unless brand allows  
- Replacing **compliance** or **regulatory** copy with template placeholder text  

---

## Next actions

1. Export **design tokens** (type scale, colours, spacing) from **Figma / live CSS** into `site/` (Tailwind `@theme` or CSS variables).  
2. Archive **screenshots** of current homepage, contact, and news (desktop + mobile) in internal drive — attachment link can go here.  
3. Re-run this table after **brand** delivers any **intentional** visual refresh (then live site is no longer sole baseline).

---

*Related: `IA-URL-SPEC.md`, `CONTENT-METADATA-SPEC.md`, `LEAD-QUALIFICATION.md`, `PROJECT-ANSWERS.md`, `site/README.md`*
