# Entity, office, and services matrix

**Purpose:** Single source of truth for the web build — hreflang clusters, footer regulatory text, `Organization` / `LocalBusiness` / `LegalService` schema, office pages, and compliance review.

**Instructions:** Legal/compliance should own columns marked *Compliance* and sign §F. **Web implementation** today matches **`PROJECT-ANSWERS.md`** §2–3 and footer copy in **`site/src/data/regulatory-footer.ts`** (synced to live homepage extract, **2026-05-04**).

---

## A. Regulated entities (who the website represents)

| ID | Legal name | Entity type (e.g. LLP, Ltd, PC) | Jurisdiction of incorporation | Primary regulator(s) | SRA number (if applicable) | Other IDs (e.g. VAT, company no.) | Website role (this site = primary brand / group site / subsidiary microsite) |
|----|------------|----------------------------------|-------------------------------|----------------------|----------------------------|-------------------------------------|-------------------------------------------------------------------------------|
| E1 | Schillings International LLP | LLP (ABS) | England & Wales | SRA (ABS) | **621152** (ABS register) | OC398731 | Primary UK regulated entity; **Schillings** trading name; global marketing site host |
| E2 | Schillings Ireland LLP | LLP | Republic of Ireland | Law Society of Ireland / LSRA | — | F11151; LSRA LLP **1262644** | Ireland office; **`en-ie`** narrative where published |
| E3 | Schillings International (USA) LLP | LLP (Delaware) | United States | State bar / FLC (Florida) | — | Principal: Miami | **`en-us`** audience pages |
| E4 | Schillings Communications LLP | LLP (unregulated) | England & Wales | — (unregulated) | — | OC445763; subsidiary of E1 | Disclosed in footer / terms — not SRA-regulated legal advice |
| E5 | Schillings Critical Risk Limited | Ltd | England & Wales | — (as stated by firm: unregulated consulting arm context) | — | 11308220 | Disclosed in footer |

**Notes:**

- **Legendary LLC** (Utah, unregulated) — see **`PROJECT-ANSWERS.md`**; add a row when the site attributes public content to it.
- Multiple entities share **schillingspartners.com**; footer block lists trading names and registrations (see **`FOOTER-REGULATORY-CHECKLIST.md`**).

---

## B. Offices and locales (physical + “doing business”)

| Office ID | Trading / public name | Address (full) | Country (ISO 3166-1 α-2) | `hreflang` target for this office’s primary language/locale (if dedicated URL set exists) | Public phone | Public email | Maps URL (optional) | *Compliance:* mandatory disclosures on this page? (Y/N) |
|-----------|------------------------|----------------|----------------------------|---------------------------------------------------------------------------------------------|--------------|--------------|------------------------|--------------------------------------------------------|
| O1 | London | 12 Arthur Street, London **EC4R 9AB**, GB | GB | **`en-gb`** (site cluster) | +44 (0)20 7034 9000 (24/7 urgent — as published) | Via contact | — | Y (footer + entity) |
| O2 | Miami | 1101 Brickell Avenue, South Tower, 8th Floor, Miami, FL **33131**, US | US | **`en-us`** | As published on contact | Via contact | — | Y |
| O3 | Dublin | 9 Pembroke Street Upper, Dublin 2, **D02 KR83**, IE | IE | **`en-ie`** | As published on contact | Via contact | — | Y |

**Rules of thumb:**

- Only assign **`en-ie`**, **`en-us`**, etc. when you have **equivalent pages** for that market, not only because an office exists.
- UK: internal locale key **`en-gb`**; **`<link hreflang>`** values **`en-GB`** (not **`en-uk`**).

---

## C. Services and regulatory mapping

Homepage **capability labels** on the current public site (editorial pillars — not separate `/law` URL on live). Detailed capability hubs on the new stack use **`/expertise/{expertiseId}/`** (see **`IA-URL-SPEC.md`** §2).

| Service / practice name (public) | URL slug (proposed) | Entity(ies) that deliver (E1, E2…) | Primary office(s) | *Compliance:* SRA Transparency Rules in scope? (Y/N/verify) | *Compliance:* claims / credentials allowed on page (brief note) |
|----------------------------------|---------------------|------------------------------------|--------------------|----------------------------------------------------------------|-------------------------------------------------------------------|
| Intelligence (pillar) | TBD / homepage + future hub | E1 + unregulated arms per matter | O1 / O3 / O2 | verify | Accurate split regulated vs consulting |
| Law (pillar) | TBD — live **`/law`** is **404**; do not invent URL without publish | E1 / E2 as applicable | O1 / O3 | verify | SRA conduct + claims |
| Communications (pillar) | TBD | E1 / E4 as applicable | O1 | verify | Distinguish regulated legal vs comms LLP |
| Security (pillar) | TBD | E1 / E5 as applicable | O1 | verify | Unregulated services clarity |
| Diplomacy (pillar) | TBD | E1 | O1 | verify | — |

**Reference:** [SRA Transparency in price and service](https://www.sra.org.uk/solicitors/guidance/transparency-in-price-and-service/) — if you **publish** that you offer a **listed** service, you need the required price/service information **prominently** on the website.

---

## D. Hreflang cluster plan (one row per **page set**, not per country)

A **set** = URLs that are intentional alternates of the same content (same template / same intent).

| Set ID | Template (e.g. Homepage, Service: Reputation, People: Bio) | URLs in set (full `https://…`) | `hreflang` values used | `x-default` URL | Owner for keeping alternates in sync |
|--------|------------------------------------------------------------|----------------------------------|------------------------|-----------------|----------------------------------------|
| H1 | Locale home | **`…/`** (UK), **`…/en-us/`**, **`…/en-ie/`** | **`en-GB`**, **`en-US`**, **`en-IE`** (see `Base.astro` / `htmlLang`) | **`/`** | Web + compliance |
| H2 | People index | **`…/people/`**, **`…/en-us/people/`**, **`…/en-ie/people/`** | same | **`/people/`** | Web |
| H3 | News index | **`…/news/`**, **`…/en-us/news/`**, **`…/en-ie/news/`** | same | **`/news/`** | Web |

**Source:** [Google — localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)

---

## E. Domains and Search Console

| Property type | URL / domain | Verified owner (team/email) | Notes (staging, www vs apex, regional TLDs) |
|---------------|--------------|-----------------------------|---------------------------------------------|
| Production | `` | *Internal* | **mySRA:** register this hostname for badge (see checklist). |
| Staging / Preview | *e.g. Vercel preview URL* | *Internal* | **`robots.txt`** should **disallow** or use **noindex** until launch (see **`TECHNICAL-SEO-LAUNCH-CHECKLIST.md`** §A). |

**GSC workflow:** Export top **Landing pages** + **Links** reports → reconcile with **`redirect-map.csv`** and **`site/vercel.json`**; add rows for any legacy URL with traffic not yet covered (see **`REDIRECT-MAP.md`**).

---

## F. Sign-off

| Role        | Name | Date | Notes |
|-------------|------|------|-------|
| Compliance  |      |      |       |
| Marketing   |      |      |       |
| Web / product |    |      |       |

---

*Companion doc: `RESEARCH-BRIEF.md` · Last matrix sync with public sources: **2026-05-04***
