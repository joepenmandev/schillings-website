# Pre-build research brief — Schillings web estate

Synthesized from **regulators, standards bodies, and first-party platform documentation** (December 2024–2026 context). **Not legal advice** — have compliance sign off.

---

## 1. Firm context (from public site)

- Positioning: reputation, privacy, security, law, intelligence, communications, diplomacy ([schillingspartners.com](/)).
- **Quality issue:** placeholder **Lorem ipsum** appears on the live homepage in at least one section — remove before any relaunch; it signals neglect and can undermine trust and E-E-A-T-style signals.

**Action:** Confirm whether marketing is for an **SRA-authorised firm** (or group including one). Everything in §4 applies only to **regulated solicitors/firms** in scope.

---

## 2. Strategy, IA, and geography

**Sources:** [Nielsen Norman — task analysis](https://www.nngroup.com/articles/task-analysis/); market language from [Chambers](https://chambers.com/) / [Legal 500](https://www.legal500.com/); international targeting from [Google — localized versions (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions).

| Decision | Expert-backed answer |
|----------|----------------------|
| IA | Map **user tasks** (instruct / crisis / press / career / alumni) to **≤2 clicks** to primary actions; mirror how buyers describe practices (directories + peer sites). |
| “Europe” | There is **no** `hreflang` value for “EU”. Use **`language`** (`en`, `de`, …) and/or **`language-region`** (`en-gb`, `en-ie`, `en-us`, `en-ae`, …). **UK = `en-gb`** (ISO region **GB**, not `uk`). |
| `x-default` | Point to a **language/region chooser** or your **primary global English** URL — [Google — x-default](https://developers.google.com/search/docs/specialty/international/localized-versions#xdefault). |
| Alternate sets | Each URL in a set must **list all alternates including itself**; URLs must be **absolute** `https://…`. Broken reciprocity → annotations may be ignored. |

Only add locales where you maintain **genuinely equivalent page sets**; do not tag countries you “can serve” without matching URLs.

---

## 3. Migration and URLs

**Source:** [Google Search Central — Site moves and migrations](https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes); [Change of Address tool](https://support.google.com/webmasters/answer/9370220); [Redirects and Google Search](https://developers.google.com/search/docs/advanced/crawling/301-redirects).

| Step | Answer |
|------|--------|
| Inventory | Full URL list (HTML, key PDFs), with organic/backlink priority. |
| Mapping | One **301** per old URL to closest **equivalent** content; avoid mass soft-404 targets. |
| Domain move | After redirects live, use **Change of Address** where Google allows (not for mere HTTPS or www fixes). |
| Duration | Plan to keep redirects **long-term**; Google has cited **≥12 months** in migration guidance as a practical minimum. |
| Validation | Search Console on old + new; monitor coverage, redirects, hreflang. |

Pair with your earlier technical audit pattern (e.g. Screaming Frog) for **chains, orphans, and sitemap accuracy**.

---

## 4. Regulatory — marketing and publicity (SRA)

**Sources:** [SRA — Marketing your services (warning notice, 19 Dec 2024)](https://www.sra.org.uk/solicitors/guidance/marketing-public); [SRA — Unsolicited approaches](https://www.sra.org.uk/solicitors/guidance/unsolicited-approaches-advertising/); [SRA Standards and Regulations](https://www.sra.org.uk/solicitors/standards-regulations/).

| Topic | Requirement (high level) |
|-------|----------------------------|
| Publicity | **Accurate, not misleading** — including charges, success implications, credentials, third-party claims ([Code 8.8](https://www.sra.org.uk/solicitors/standards-regulations/code-conduct-solicitors/) via warning notice). |
| Unsolicited approaches | **No** unsolicited approaches to the public to advertise legal services **except** current/former clients — applies to you **and** introducers ([8.9](https://www.sra.org.uk/solicitors/standards-regulations/code-conduct-solicitors/)); due diligence on lead gen, remarketing, surveys. |
| Third-party marketing | Review **third-party** creative; misleading **NWNF** etc. is your problem to prevent. |
| Governance | Firms need **systems, controls, and records** to demonstrate compliance ([Code for Firms](https://www.sra.org.uk/solicitors/standards-regulations/code-conduct-firms/)). |

**Law Society:** [Information on letterheads, emails and websites](https://www.lawsociety.org.uk/topics/client-care/practice-notes/information-on-letterheads-emails-and-websites) — practice note on **what to display** (full detail may require Law Society access). Treat as **good practice / expectations** for solicitors in England & Wales.

**Ireland / UAE / US:** If entities practise there, add **local regulator** marketing and professional conduct rules — not covered by SRA alone.

---

## 5. Price and service transparency (SRA) — scope check

**Source:** [SRA — Transparency in price and service](https://www.sra.org.uk/solicitors/guidance/transparency-in-price-and-service/) (updated **30 September 2024**); [Transparency Rules](https://www.sra.org.uk/solicitors/standards-regulations/transparency-rules/).

Mandatory **website** price/service disclosure applies when the firm **publishes** (as part of usual business) that it offers **specific listed services** — e.g. residential conveyancing, probate, certain employment tribunal work, immigration (non-asylum), debt recovery to £100k, licensing applications, etc.

**Schillings’ public positioning** is not in that commodity list; **confirm with compliance** whether you **advertise** any in-scope services. If yes, you need the **prominent, signposted** pricing/service pages the SRA describes. If no, the **Transparency Rules** may still be irrelevant, but **8.7** (clear pricing information for clients) and general **accurate publicity** still apply.

---

## 6. Privacy, cookies, analytics

**Sources:** ICO — [Cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/guidance-on-the-use-of-cookies-and-similar-technologies); [Storage and access technologies hub](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/about-this-guidance); [Guide to UK GDPR](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/).

| Topic | Answer |
|-------|--------|
| Cookies vs GDPR | **PECR** governs storing/accessing info on devices; **UK GDPR** applies to **personal data** from analytics/marketing tags — often **both** apply. |
| Consent | Non-essential cookies/marketing generally need **valid consent** before setting (ICO cookie guidance); policy and CMP should match reality. |
| Analytics | Google’s [Consent Mode](https://support.google.com/analytics/answer/9976101) documents **product** behaviour; it does **not** replace ICO legal analysis. |
| DPIA | Expect **DPIA** for intrusive analytics/profiling (ICO analytics toolkit and UK GDPR threshold). |

---

## 7. Accessibility

**Sources:** W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/); [How to Meet WCAG (Quick Reference)](https://www.w3.org/WAI/WCAG22/quickref/); GOV.UK Service Manual [Understanding WCAG 2.2](https://www.gov.uk/service-manual/helping-people-to-use-your-service/understanding-wcag).

| Target | Answer |
|--------|--------|
| Private firm | **WCAG 2.1 or 2.2 Level AA** is the common **commercial and litigation-safety** bar; public sector suppliers may be asked for **2.2 AA** explicitly. |
| Statement | Publish an **accessibility statement** if you commit to a standard or if procurement requires it (see [GOV.UK accessibility publishing guidance](https://www.gov.uk/guidance/make-your-website-or-app-accessible-and-publish-an-accessibility-statement)). |

---

## 8. SEO and structured data

**Sources:** [Google — structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies); [Schema.org](https://schema.org/) (vocabulary).

| Topic | Answer |
|-------|--------|
| Schema | Use types you can **truthfully** maintain (`Organization` / `LegalService` / `Attorney` / `Person` / `Article` as appropriate); follow Google’s **required** fields per feature if you want rich results. |
| Duplicates | Align **canonical** strategy with **hreflang** clusters — [consolidating duplicate URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls). |

---

## 9. Performance

**Sources:** [Web.dev — Core Web Vitals](https://web.dev/articles/vitals); [INP](https://web.dev/inp/).

Set internal **budgets** (LCP, INP, CLS) for templates **with real content** — especially hero media and fonts.

---

## 10. Decisions to lock before build (checklist)

- [ ] Regulated entity map (SRA / Ireland / DIFC / US counsel network — who the site represents).
- [ ] Final **URL taxonomy** and **trailing slash / lowercase** policy.
- [ ] **Hreflang** matrix (only real alternates) + `x-default`.
- [ ] **301 map** from current site; Search Console properties.
- [ ] **Transparency Rules** applicability + compliance owner for web copy.
- [ ] **Cookie taxonomy** + CMP + GA4/consent mode architecture signed off by privacy.
- [ ] **Accessibility** target and statement owner.
- [ ] Remove **placeholder** copy on current site; content governance for launch.

---

## Reference index (primary links)

| Area | URL |
|------|-----|
| Hreflang | https://developers.google.com/search/docs/specialty/international/localized-versions |
| Multi-regional | https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites |
| Site moves | https://developers.google.com/search/docs/advanced/crawling/site-move-with-url-changes |
| SRA marketing warning | https://www.sra.org.uk/solicitors/guidance/marketing-public |
| SRA transparency guidance | https://www.sra.org.uk/solicitors/guidance/transparency-in-price-and-service/ |
| Law Society — websites info | https://www.lawsociety.org.uk/topics/client-care/practice-notes/information-on-letterheads-emails-and-websites |
| ICO cookies | https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/guidance-on-the-use-of-cookies-and-similar-technologies |
| WCAG 2.2 | https://www.w3.org/TR/WCAG22/ |
| Core Web Vitals | https://web.dev/articles/vitals |
