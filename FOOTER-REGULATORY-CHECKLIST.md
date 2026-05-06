# Footer & regulatory web checklist — expert workflow (England & Wales SRA firms)

**Audience:** Schillings **Schillings International LLP** (SRA ABS **621152**) and related entities on the same site.  
**Method:** What a competent **risk/compliance + legal marketing** team does in 2026: start from **SRA rules and Law Society public guidance**, then obtain the **full** Law Society practice notes (some require member access) and **Irish** obligations for Dublin content.

**Not legal advice.** Compliance signs off final wording.

---

## 1. What experts do first

| Step | Action |
|------|--------|
| 1 | **SRA:** Confirm firm number, HOLP/HOFA, registered office, **reserved activities** — [ABS register](https://www.sra.org.uk/solicitors/firm-based-authorisation/abs-register/621152). |
| 2 | **mySRA:** Register **every production domain** that will show the badge; allow lead time (SRA: up to several working days for multiple domains). |
| 3 | **Law Society:** Read the full **practice note — Information on letterheads, emails and websites** (member access may be required) — [hub](https://www.lawsociety.org.uk/topics/client-care/practice-notes/information-on-letterheads-emails-and-websites). |
| 4 | **Transparency:** Use Law Society **Price and service transparency** guide + SRA guidance — [Law Society overview](https://www.lawsociety.org.uk/topics/price-and-service-transparency/price-and-service-transparency-how-you-can-comply), [SRA transparency](https://www.sra.org.uk/solicitors/guidance/transparency-in-price-and-service/). |
| 5 | **Ireland:** If pages target **Schillings Ireland LLP**, involve **Irish** counsel/compliance for any **LSRA / Law Society of Ireland** website duties — do not assume E&W checklist covers Dublin. |

---

## 2. Universal SRA expectations (nearly all firms)

From [Law Society — how you can comply](https://www.lawsociety.org.uk/topics/price-and-service-transparency/price-and-service-transparency-how-you-can-comply) (aligned with SRA Transparency Rules):

| Requirement | Expert implementation |
|-------------|------------------------|
| **SRA digital badge** | **Mandatory** on the website; obtain via SRA process — [SRA digital badge](https://www.sra.org.uk/solicitors/resources/transparency/digital-badge/). Typically **footer** on all templates + verify script works after deploy. |
| **Complaints** | Publish **complaints procedure** including **Legal Ombudsman** and **SRA** — use or adapt SRA suggested text — [Publishing complaints procedure](https://www.sra.org.uk/solicitors/guidance/ethics-guidance/Publishing-complaints-procedure.page). |
| **Plain English, prominent** | Regulatory and consumer information in **clear** language; **few clicks** from homepage (Law Society emphasis). |

**Experts also:** keep a **version date** on key policies; audit after IA changes so links (e.g. `/complaints-handling`) never 404.

---

## 3. Conditional: price & service transparency

**If** the firm **publicises** services in the **SRA-listed categories** (conveyancing, probate, certain employment tribunal work, immigration except asylum, motoring summary only, debt recovery to £100k, licensing), you must publish **prices + service detail + staff experience** as per rules — see Law Society guide sections on **price** and **service** transparency.

**If** the public site **does not** advertise those consumer/business commodity lines, mandatory **price tables** may not apply — but **badge + complaints** still do, and **accurate** cost messaging elsewhere (e.g. engagement minima) must stay **SRA-compliant** (not misleading).

**Internal owner:** Compliance + BD confirm against **live** service pages on launch.

---

## 4. What the Law Society practice note on websites usually covers (verify in full note)

Experts treat the **letterheads, emails and websites** practice note as the master list for **naming, status, address, contact, regulatory description**, and consistency across **email signatures** and **site footer**.  

**You cannot rely on this summary alone** — pull the current practice note text into your **sign-off pack**.

---

## 5. Schillings-specific: regulated + unregulated

Your **Standard Terms** distinguish **SRA-regulated legal advice** from **unregulated** consulting (intelligence, cyber, etc.).  

**Expert approach on web:**

- **Clear labelling** near relevant service descriptions (who is regulated, what is not).  
- **Footer** focuses on **Schillings International LLP** as the SRA entity; **other entities** (Ireland, US, Communications LLP, Legendary) disclosed where the site attributes work to them — avoid implying **whole brand** is “solicitors” if a product line is not.

---

## 6. Pre-launch QA (compliance + web)

- [ ] Badge live on **all** page types (including error pages if brand extends there).  
- [ ] Domain(s) registered in **mySRA**.  
- [ ] Complaints + LeO + SRA links correct.  
- [ ] SRA number **621152** and formal name **Schillings International LLP** correct.  
- [ ] Transparency pages **present or consciously N/A** with written rationale.  
- [ ] Irish pages reviewed for **Irish** obligations if applicable.  
- [ ] No **placeholder** copy on production.

---

## 7. Build implementation (this repo)

Use this map when doing §6 QA on the **Astro** site (not the legacy Webflow host).

| Checklist item | Where it lives |
|----------------|----------------|
| Regulatory paragraph (entities, OC numbers, Ireland / US lines, ATTORNEY ADVERTISING) | **`site/src/data/regulatory-footer.ts`** — text aligned with **live homepage footer** per **`LIVE-SITE-EXTRACT.md`** (**2026-05-04**). SRA **621152** is **not** repeated in that paragraph on the live homepage; confirm on **`/compliance/schillings-sra/`** content when replacing stubs. |
| Purple band (logo, primary nav, socials) | **`site/src/components/SiteFooter.astro`** + **`site/src/lib/site-nav.ts`** |
| SRA digital badge (Yoshki iframe) | **`SiteFooter.astro`** — `https://cdn.yoshki.com/iframe/55847r.html` (same ID as live extract). **mySRA:** register **production** hostname before go-live. |
| Legal links (Privacy & Disclaimer, Complaints, SRA page) | **`complianceNav`** in **`site-nav.ts`** → pages under **`site/src/pages/[locale]/compliance/`** |

---

*Related: `PROJECT-ANSWERS.md`, `RESEARCH-BRIEF.md`, `IA-URL-SPEC.md`*
