# Outstanding questions — answers from public sources

**Scope:** Filled from **publicly available** pages as of the research date. Anything marked **Internal** still needs the firm. **Not legal advice.**

**Documentation sync (engineering):** **`ENTITY-SERVICES-MATRIX.md`** was filled from this file and live checks **2026-05-04**. Re-run the §6 HTTP checks before cutover if the stack changes.

---

## Confirmed product decisions (internal)

| Topic | Decision |
|-------|----------|
| **Migration** | **301 redirects at domain level**; you will obtain access to the current hosting/DNS to implement. Maintain `redirect-map.csv` for path-level exceptions. |
| **Forms** | Replace simple form with a **multi-step qualifying** flow; **£25,000** minimum engagement communicated clearly; filter out sub-threshold leads; **no remarketing** on the form path. See **`LEAD-QUALIFICATION.md`**. |
| **Analytics / CMP** | **Deferred** — finalise **`ANALYTICS-CONSENT-SPEC.md`** later; build form without ad pixels. |
| **Law Society / footer** | Follow expert checklist in **`FOOTER-REGULATORY-CHECKLIST.md`** (badge, complaints, transparency N/A or pages, Irish review). |
| **Hreflang** | **`HREFLANG-STRATEGY.md`**: UK at **`/`** with **`en-GB`** (and **`x-default`**); **`en-US`** / **`en-IE`** on prefixed paths; internal data locales remain **`en-gb`**, **`en-us`**, **`en-ie`**. Ireland used for **EU litigation / platform takedown** narrative without inventing EU-wide locale codes. |

---

## 1. Domain and brand

| Question | Answer | Source |
|----------|--------|--------|
| Primary marketing domain? | **schillingspartners.com** | Live site |
| Trading name? | **Schillings** is a trading name of **Schillings International LLP** | [Standard Terms of Business](/standard-terms-of-business-and-privacy-notice) |

---

## 2. Legal entities and regulation (for footer, schema, compliance pages)

| Entity | Role | Regulation / registration (as stated by firm) |
|--------|------|-----------------------------------------------|
| **Schillings International LLP** | Main UK ABS; “Schillings” trading name | LLP **England & Wales**, reg. **OC398731**; **SRA** ABS **621152**; registered office **12 Arthur Street, London EC4R 9AB**. Heads of practice per SRA register: **Benjamin Hobbs** (HOLP), **Brett Reynolds** (HOFA). | [SRA compliance page](/compliance/schillings-sra), [SRA register](https://www.sra.org.uk/solicitors/firm-based-authorisation/abs-register/621152) |
| **Schillings Ireland LLP** | Ireland | LLP **Republic of Ireland**; **Law Society of Ireland** firm no. **F11151**; authorised by **LSRA** as LLP. Address on contact page: **9 Pembroke Street Upper, Dublin 2, D02 KR83**. | Standard Terms §1 |
| **Schillings International (USA) LLP** | US | **Delaware** LLP; principal office **1101 Brickell Avenue, South Tower, 8th Floor, Miami, FL 33131**; attorneys **foreign legal consultants** in **Florida**. | Standard Terms §1, [Contact](/contact) |
| **Schillings Communications LLP** | UK | **Unregulated** LLP, subsidiary of Schillings International LLP, **OC445763** (as stated in terms). | Standard Terms §1 |
| **Legendary LLC** | US | **Utah**; partly owned by Schillings International LLP; **unregulated**; referrals under agreement. | Standard Terms §1 |

**Regulated vs unregulated (firm’s own wording):**  
- **Regulated:** legal advice (SRA).  
- **Unregulated:** consulting — risk consulting, intelligence, cyber security.  
Source: Standard Terms “KEY FACTS”.

**Compliance contact (public):**  
`compliance@schillingspartners.com` — Director of Risk and Compliance, 12 Arthur Street, EC4R 9AB.  
Source: [SRA compliance page](/compliance/schillings-sra).

---

## 3. Offices (contact page)

| Region | Address (as published) |
|--------|-------------------------|
| **UK** | 12 Arthur St, London, EC4R 9AB — **+44 (0)20 7034 9000** (24/7 for urgent matters) |
| **US** | 1101 Brickell Avenue, South Tower, 8th Floor, Miami, FL 33131 |
| **Ireland** | 9 Pembroke Street Upper, Dublin 2, D02 KR83 |

Source: [Contact](/contact).

**UAE:** No office on the fetched contact page — **hreflang `en-ae` or a UAE page** should only be added if you **publish** equivalent content and a business basis; do not infer from “we can do business there” alone.

---

## 4. SRA Transparency Rules (price/service pages)

**SRA register** lists reserved activities including **probate** — that does **not** by itself mean the **Transparency Rules** (mandatory consumer price pages) apply. Those rules apply when the firm **publishes**, as part of its usual business, that it offers **specific listed services** (e.g. residential conveyancing, certain employment tribunal work, etc.).  

**Public check:** Standard Terms describe **integrated** legal + non-legal services; no **commodity** service list matching the SRA’s mandatory categories was found in the excerpt reviewed.

**Answer for build planning:** Treat **mandatory SRA price pages** as **conditional** — **compliance** should confirm yes/no based on **what the new site will advertise**, not only what the ABS is licensed to do.

Guidance: [SRA Transparency in price and service](https://www.sra.org.uk/solicitors/guidance/transparency-in-price-and-service/).

---

## 5. Marketing / conduct (web copy)

Must remain **accurate and not misleading**; unsolicited approaches rules apply to regulated marketing and introducers.  

Source: [SRA warning notice — marketing](https://www.sra.org.uk/solicitors/guidance/marketing-public).

---

## 6. Technical signals on current site

| Issue | Detail |
|-------|--------|
| **Placeholder copy** | **Astro build** (`site/`): homepage editorial strips use **live headline pairs** — no Lorem in shipped templates (spot-check **`HomeEditorialStrips.astro`**). The **legacy Webflow** homepage may still show filler until DNS cuts to the new stack. |
| **Sitemap** | `/sitemap.xml` — **HTTP 200** verified **2026-05-04** (curl). Re-check before launch. |
| **Sample URL** | **`/law`** — **404** on live **2026-05-04**. IA: practice hubs on the new build use **`/expertise/{expertiseId}/`** per **`IA-URL-SPEC.md`** §2; homepage pillars are not a substitute for a dedicated law URL until published. |
| **Legacy privacy URL** | **`/privacy-notice/`** on live **301 → `/privacy-notice` → 404`** (broken chain) **2026-05-04**. New stack: **`vercel.json`** + **`redirect-map.csv`** send **`/privacy-notice`** to **`/compliance/privacy-disclaimer/`** (UK unprefixed). |
| **Standard terms** | Live uses **`/compliance/standard-terms-of-business`** (and legacy long slug → short slug). Astro stub + locale redirects added **2026-05-04** — replace stub with approved HTML/PDF parity. |

---

## 7. What still cannot be answered from the web (Internal)

| Topic | Action |
|-------|--------|
| **Final domain** for relaunch | Confirm keep **schillingspartners.com** vs new domain → drives redirects and GSC. |
| **Form submissions** | Where enquiries land (CRM, email workflow, regions). |
| **CMP / analytics** | Vendor + cookie categories — privacy sign-off (`ANALYTICS-CONSENT-SPEC.md`). |
| **Law Society practice note (full text)** | Mandatory website information for solicitors — may require **Law Society** member access; legal/compliance to supply checklist. |
| **Hreflang** | Only for **real alternate URL sets**; compliance/marketing to confirm which jurisdictions get dedicated pages vs single English site. |
| **PII / insurance / complaints URLs** | Terms reference `/privacy-notice`, `/complaints-handling` — verify live paths and migrate in **redirect map**. |

---

## 8. Pre-filled snippet for `ENTITY-SERVICES-MATRIX.md`

You can copy into Section A/B:

**A. E1:** Schillings International LLP — ABS — England & Wales — SRA 621152 — OC398731 — primary site entity.  
**A. E2:** Schillings Ireland LLP — Ireland — Law Society of Ireland F11151 / LSRA — Ireland office.  
**A. E3:** Schillings International (USA) LLP — Delaware / Florida FLC — Miami office.

**B. O1:** London — 12 Arthur St, EC4R 9AB, GB.  
**B. O2:** Miami — 1101 Brickell Ave, FL 33131, US.  
**B. O3:** Dublin — 9 Pembroke Street Upper, D02 KR83, IE.

---

*Related: `RESEARCH-BRIEF.md`, `ENTITY-SERVICES-MATRIX.md`, `STACK.md`*
