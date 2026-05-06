# Analytics, cookies & consent — implementation spec

**Purpose:** Define **what** is measured, **how** consent is obtained, and **which** tags fire when — so engineering, marketing, and privacy share one model.

**Not legal advice.** Privacy/compliance must approve.

**Primary references:** ICO — [Cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/guidance-on-the-use-of-cookies-and-similar-technologies); ICO — [Storage and access technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/about-this-guidance); ICO — [UK GDPR guide](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/); Google — [Consent Mode](https://support.google.com/analytics/answer/9976101), [Consent Mode (developer)](https://developers.google.com/tag-platform/security/guides/consent).

---

## 1. Roles

| Role | Responsibility |
|------|----------------|
| **Privacy / DPO** | Lawful basis, cookie inventory, DPIA if needed, wording of policies and CMP |
| **Marketing** | Reporting needs, campaign parameters, vendor list |
| **Engineering** | Tag loading order, Consent Mode defaults, server-side vs client, blocking |
| **Web** | Cookie banner UX, preference centre, policy links |

---

## 2. Cookie & storage inventory (fill in)

List **every** script or iframe that sets or reads storage. Typical columns:

| Name / vendor | Purpose (strictly necessary / functional / analytics / ads) | Cookie or storage name(s) | Duration | 1st / 3rd party | Fires before consent? (Y/N) | Notes |
|---------------|--------------------------------------------------------------|----------------------------|----------|-----------------|-----------------------------|-------|
| Example: GA4  | Analytics                                                    | `_ga`, …                   |          |                 | N (when Consent Mode denies)|       |

**Rule of thumb:** Non-essential cookies generally require **consent** before setting (PECR); personal data processing also needs a **UK GDPR** lawful basis (often consent for analytics/marketing). Align banner categories with this table.

---

## 3. Consent categories (CMP)

Define **four** (or your CMP’s model) and map vendors:

| Category | User-facing label | Includes | Default (before choice) |
|----------|-------------------|----------|-------------------------|
| Strictly necessary | | Security, load balancing, consent cookie itself | On; cannot opt out |
| Functional | | Preferences, language, embedded features that need storage | Off until accepted (unless truly necessary—legal review) |
| Analytics | | GA4, heatmaps, etc. | Off until accepted |
| Marketing / ads | | Pixels, remarketing, ad measurement where consent required | Off until accepted |

Document **granular** toggles if the CMP supports them.

---

## 4. Google Analytics 4 (GA4)

| Decision | Choice (fill in) |
|----------|------------------|
| Property ID | |
| Data stream | Web |
| IP / ads personalisation | Per Google account settings + regulatory choice |
| **Consent Mode** | v2 / default denied until CMP grants |
| Enhanced measurement | On/off per feature (review each for PECR/GDPR) |
| Google Signals | On/off — privacy review |
| Data retention | Set in Admin |
| Subdomain / cross-domain | Document if `www` + apex or multiple domains |
| **Excluded** URL query params | e.g. strip PII-like params in reporting |

**Event map (minimum):**

| Event name | When fired | Parameters | Consent required |
|------------|------------|------------|------------------|
| `page_view` | Each page / virtual pageview | `page_location`, `page_title` | Analytics |
| `generate_lead` | Successful enquiry form | Form type (non-PII code) | Analytics |
| `file_download` | PDF / key asset | file extension, link URL | Analytics |
| Add campaign events | Per media plan | | Marketing if uses ads tags |

Adjust names to your **GA4 recommended events** where they fit.

---

## 5. Tag Manager (if used)

| Check | Done |
|-------|------|
| Single **container** per site (or documented multi-container rule) | ☐ |
| **Consent** variable gates tags that set non-essential cookies | ☐ |
| **Order:** Consent Mode update before GA/ads tags | ☐ |
| Staging **workspace**; publish checklist | ☐ |
| No **PII** in DL / event params (emails, postcodes in clear text) | ☐ |

---

## 6. Policy pages & UX

| Page | URL (from IA spec) | Owner |
|------|-------------------|--------|
| Privacy notice | `/legal/privacy-policy/` | |
| Cookie policy | `/legal/cookies/` | |
| CMP link to policies | Footer + banner | |

Banner must allow **reject** as easily as **accept** (ICO expectation for non-essential cookies).

---

## 7. Sign-off

| Role | Name | Date |
|------|------|------|
| Privacy / DPO | | |
| Marketing | | |
| Engineering | | |

---

*Related: `RESEARCH-BRIEF.md` §6, `IA-URL-SPEC.md`, `TECHNICAL-SEO-LAUNCH-CHECKLIST.md`*
