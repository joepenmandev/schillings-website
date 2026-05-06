# Live site extract — schillingspartners.com (homepage)

**Purpose:** Machine-readable notes from a **homepage** fetch (HTML + CSS from the previous site), for IA parity, footer/compliance, typography, and third-party inventory. **Not** a full-site crawl. Re-verify before launch (dates, URLs, copy). **The new Astro site does not load assets or fonts from that stack** — use this file as **data and design reference** only.

**Fetched:** 2026-05-04 (HTML ~45 KB; CSS ~122 KB minified).

---

## Platform

- **Webflow** (published artefact on `cdn.prod.website-files.com`).
- Main stylesheet:  
  `https://cdn.prod.website-files.com/65d71c50a043e78769a7be8b/css/schillings-international-llp-ce0e23.webflow.shared.5b80b8329.min.css`

---

## Internal paths (homepage)

| Path | Notes |
|------|--------|
| `/` | Home |
| `/people` | Nav + footer |
| `/news` | Label: News & Insights |
| `/international` | |
| `/about-us` | |
| `/contact` | Footer + elsewhere |
| `/24-7-immediate-response` | Linked from top “Immediate Response” pattern |
| `/compliance/privacy-disclaimer` | Footer + cookie popup link |
| `/compliance/complaints-handling` | Footer |
| `/compliance/schillings-sra` | Footer |

---

## Primary nav (overlay / hamburger)

Order: **People** → **News & Insights** → **International** → **About**.

- **Finsweet** `fs-scrolldisable-element` on menu background and close control.
- **Webflow** `data-collapse="all"` on `.w-nav` — full menu hidden until toggle; standard Webflow breakpoints **991 / 767 / 479** in base CSS.
- **Immediate Response** block inside menu: H2 “Immediate Response”, italic H3-style line, **24/7** copy (truncated in saved HTML — confirm phone on `/contact` / live).

---

## Footer (purple band + ivory legal band)

**Logo (negative):**  
`https://cdn.prod.website-files.com/65d71c50a043e78769a7be8b/65f84e0f8eb5199490468165_Schillings_Logotype%2BTonal_Line%2BDescriptor_RGB_negative%20(7).svg`

**Link list (same order as nav + Contact):** People, News & Insights, International, About, Contact — paths as in table above.

**Social (only these on homepage footer):**

- LinkedIn: `https://uk.linkedin.com/company/schillings`
- YouTube: `https://www.youtube.com/@schillingspartners`

**SRA digital badge:** Yoshki iframe  
`https://cdn.yoshki.com/iframe/55847r.html`  
(wrapper ~275×163 max; `padding-bottom: 59.1%` aspect box).

**Legal links:** Privacy & Disclaimer, Complaints Handling, Schillings: Regulated by SRA — paths as above.

**Copyright / regulatory paragraph (2026):** Long single block covering Schillings International LLP, trading names, OC398731, SRA ABS, Schillings Critical Risk Limited (11308220, 12 Arthur Street), Schillings Communications LLP (OC445763), Schillings Ireland LLP (Law Society / LSRA numbers, Dublin address), Schillings International (USA) LLP (Delaware, Miami), Florida foreign legal consultants, **ATTORNEY ADVERTISING**. **Reconcile with compliance** before paste into static build; do not treat this file as signed-off legal text.

---

## Design tokens (`:root` in Webflow CSS)

Matches tokens already mirrored in `site/src/styles/global.css`:

- `--utility-1`: `#f5f2ef`
- `--utility-2`: `#eeeae4`
- `--black`: `black`
- `--white`: `white`
- `--secondary-4`: `#2d012b`
- `--secondary-3`: `#7d2442`
- `--secondary-2`: `#b8a6b0`
- `--primary-1`: `#9c7a8f`
- `--font-family`: `Esface`, `"Palatino Linotype"`, `sans-serif`

---

## Typography (selected rules from Webflow CSS)

| Rule | Approximate computed intent |
|------|------------------------------|
| `body` | `background-color: var(--utility-1)`, `color: var(--black)`, `font-family: Esface, Palatino Linotype, sans-serif`, `font-size: 1.25rem`, `font-weight: 200`, `line-height: 1.3` |
| `h1` | `font-size: 5rem`, `font-weight: 200`, `line-height: 1.1`, `color: var(--secondary-4)` |
| `h2` | `font-size: 3.125rem`, `font-weight: 200`, `line-height: 1.1` |
| `.heading-style-huge` | `font-size: clamp(3rem, 8.4vw, 10.8rem)`, `font-weight: 200`, `line-height: 1.1` |
| `.heading-style-h2` | `font-size: 3.125rem`, `line-height: 1.1` |
| `.heading-style-h3` | `font-size: 2.5rem`, `line-height: 1.2`, `padding-bottom: 20px`, `text-wrap: balance` |
| `.boilerplate-text` | `font-size: 2.25rem`, `text-align: center` |
| `.capabilities-heading` | `font-size: 3.125rem`, `font-weight: 200`, `line-height: 1.1` |

---

## Esface `@font-face` (Webflow CDN)

**Licensing:** Fonts are served from Webflow’s project CDN. **Do not assume** redistribution or long-term hotlink rights. Prefer **self-hosted WOFF2** with a confirmed licence before production cutover.

| Weight / style | URL |
|----------------|-----|
| 200 normal | `https://cdn.prod.website-files.com/65d71c50a043e78769a7be8b/65e20b561875c73970147170_ESFace-ExtraLight.woff2` |
| 200 italic | `https://cdn.prod.website-files.com/65d71c50a043e78769a7be8b/65e20b56bc4d9831d29a3dd3_ESFace-ExtraLightItalic.woff2` |

The Astro site **does not** load fonts from the old CMS. Use the URLs above only to **obtain or match** files after licence confirmation; serve copies from **`/fonts/`** (or another controlled origin).

---

## Layout utilities (sample)

- `.section-hero`: `text-align: center`, `height: 60vh`, `min-height: 26rem`, `max-height: 40rem`
- `.hero_padding`: column flex, `padding-top: 3rem`, `padding-bottom: 5rem`
- `.padding-global`: horizontal `padding-left/right: min(5rem, 5.5vw)`
- `.padding-huge`: `padding: 6rem`
- `.container-large`: `max-width: 200rem` (effectively full-bleed container pattern)
- `.max-width-xlarge`: `max-width: 64rem`
- `.footer_legal-links-wrapper`: grid, `justify-content: end`, gap ~2.5rem

---

## Scripts & embeds (homepage)

| Asset / vendor | Role |
|----------------|------|
| jQuery 3.5.1 | CloudFront (`d3e54v103j8qbb.cloudfront.net`) |
| Webflow JS chunks | Site bundle + integrity |
| GSAP 3.12.5 + ScrollTrigger | Nav scroll hide/show, accordion timelines |
| Swiper 11 | Image gallery carousel |
| Inline GSAP | `.dropdown_toggle` accordion, nav menu timelines, CMS filter underlines |
| **Flowappz** cookie UI | Container + popup markup in-page; external scripts referenced in head from prior crawl (see `ANALYTICS-CONSENT-SPEC.md` — **deferred** on new build) |
| **Microsoft Clarity** | Third-party analytics (defer / drop per launch checklist) |

**Nav behaviour (inline):** `.nav_main` fades and translates on scroll (opacity / `translateY`); pointer-events toggled when hidden.

---

## Collage / imagery pattern

- Webflow **CMS** `w-dyn-list` for collage slides.
- Images: `loading="lazy"`, `sizes="100vw"`, responsive `srcset` with `-p-500`, `-p-800`, `-p-1080` variants on CDN.

---

## Gaps for a fuller extract

- **Other templates** (contact, news, compliance): fetch per URL for forms (POST endpoint), extra socials, and page-specific JSON-LD.
- **Hero exact strings** and **24/7 phone** from HTML (long single-line save truncates in some tools).
- **Form POST:** inspect Network on submit on live contact form.

---

## Related repo docs

- `DESIGN-REFERENCES.md` — approval baseline vs templates  
- `IA-URL-SPEC.md`, `REDIRECT-MAP.md` — locale vs legacy paths  
- `FOOTER-REGULATORY-CHECKLIST.md` — SRA badge, mySRA, disclaimers  
- `TECHNICAL-SEO-LAUNCH-CHECKLIST.md` — hreflang, canonicals, 301s
