# Content & metadata specification

**Purpose:** Consistent **titles, descriptions, headings, and social** per template so editors and CMS fields stay aligned with SEO and compliance.

**Sources (reference):** [Google — creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content); [Google — title links](https://developers.google.com/search/docs/appearance/title-link); [Google — snippet control](https://developers.google.com/search/docs/appearance/snippet); [SRA — marketing / accurate publicity](https://www.sra.org.uk/solicitors/guidance/marketing-public).

---

## 1. Global rules

| Rule | Standard |
|------|----------|
| **Accuracy** | All claims, credentials, and outcomes copy must be **verifiable** and **not misleading** (regulatory + brand). |
| **One H1** | Exactly **one** `<h1>` per page; matches primary topic (often close to title, not identical spam). |
| **Heading order** | `h2` → `h3` → … without skipping levels. |
| **Language** | `<html lang="en-GB">` on UK templates; **`en-US`** / **`en-IE`** on locale-prefixed routes (BCP 47 — matches `htmlLang` in `site/src/i18n/config.ts`). Internal content keys stay lowercase **`en-gb`**, etc. |
| **Boilerplate** | Avoid near-duplicate titles/descriptions across many URLs. |

**Character targets** (guidelines, not hard limits):

| Element | Target | Note |
|---------|--------|------|
| `<title>` | ~50–60 chars visible in SERPs often truncated | Unique per URL. |
| Meta description | ~140–160 chars | Unique; compelling CTA where appropriate. |
| H1 | Short, readable | Not stuffed with keywords. |

---

## 2. By template (align with `IA-URL-SPEC.md`)

### `T-home`

| Field | Guidance |
|-------|----------|
| Title | Brand + primary value prop + optional location if strategic. |
| Meta | Who you help + differentiators; no unqualified “best” unless substantiated. |
| H1 | Firm-facing welcome or flagship proposition (one clear message). |

### `T-expertise-index` (capability index; legacy label `T-services-index`)

| Field | Guidance |
|-------|----------|
| Title | “Expertise” + brand (or equivalent approved nav wording). |
| Meta | Overview of capabilities; links mentally to top hubs. |
| H1 | Matches nav label (“Expertise”). |

### `T-expertise-hub` (practice / capability hub; legacy label `T-service-hub`)

| Field | Guidance |
|-------|----------|
| Title | Capability name + “ \| ” + brand. |
| Meta | Specific outcomes and client types; avoid generic filler. |
| H1 | Capability name (plain language). |
| Compliance | Link **price/service transparency** pages if SRA rules apply to that regulated **service** offering. |

### `T-expertise-article` / deep topic (legacy label `T-service-article`)

| Field | Guidance |
|-------|----------|
| Title | Topic + practice or brand. |
| Meta | Summary of reader benefit; date if news-led. |
| H1 | Article / guide headline. |

### `T-people-index`

| Field | Guidance |
|-------|----------|
| Title | “Our people” / “Team” + brand. |
| Meta | Range of expertise; invitation to browse or contact. |
| H1 | Matches index purpose. |

### `T-person`

| Field | Guidance |
|-------|----------|
| Title | `Name, Role \| Brand` |
| Meta | Expertise areas + jurisdictions; factual only. |
| H1 | Full name (role can be subtitle or line below). |
| Structured data | Profile **`BlogPosting`** stubs under **`subjectOf`** use this person as the sole **`author`** for quick discovery; the **article URL** remains canonical for full **`@graph`** (including co-authors). |

### `T-news-index`

| Field | Guidance |
|-------|----------|
| Title | “News” / “Insights” + brand. |
| Meta | What readers find (firm news, analysis, etc.). |
| H1 | Matches section name. |

### `T-article`

| Field | Guidance |
|-------|----------|
| Title | Headline + brand (or brand first if very long—pick one pattern). |
| Meta | Deck / first sentence energy; author optional in snippet context. |
| H1 | Headline. |
| Date | `datePublished` / visible date for articles. |

### `T-topic-hub`

| Field | Guidance |
|-------|----------|
| Title | Topic + “hub” or “guide” + brand if space. |
| Meta | Scope of hub + who it’s for. |
| H1 | Topic name. |

### `T-legal` (privacy, cookies, regulatory)

| Field | Guidance |
|-------|----------|
| Title | Document name + brand. |
| Meta | Optional; can be minimal. |
| H1 | Document title. |
| Compliance | Legal owns copy; version date on page. |

### `T-contact`

| Field | Guidance |
|-------|----------|
| Title | “Contact” + brand. |
| Meta | How to reach; crisis line if public. |
| H1 | Contact. |

---

## 3. Open Graph / social (if implemented)

| Property | Rule |
|----------|------|
| `og:title` | Can match `<title>` or a shorter social headline. |
| `og:description` | Often match meta description unless social-specific. |
| `og:image` | Brand-safe; rights cleared; dimensions per platform guidance. |
| `og:url` | Canonical URL of the page. |

---

## 4. CMS field checklist (per content type)

- [ ] Title  
- [ ] Meta description  
- [ ] H1 (if not auto-derived—document rule)  
- [ ] Canonical URL (if not default)  
- [ ] `noindex` flag (rare; for utility pages only)  
- [ ] Hero / listing image + alt text  
- [ ] Compliance review flag for **regulated** copy  

---

*Related: `IA-URL-SPEC.md`, `RESEARCH-BRIEF.md`, `ENTITY-SERVICES-MATRIX.md`*
