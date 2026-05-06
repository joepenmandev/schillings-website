# Lead qualification — contact strategy (£25k minimum)

**Goals:** Reduce unqualified enquiries; be **transparent** about minimum engagement; avoid **misleading** marketing (SRA **accurate publicity** — see [marketing warning notice](https://www.sra.org.uk/solicitors/guidance/marketing-public)). **No remarketing** / ad pixels on the form path (per product decision).

**Not legal advice.** Exact wording needs compliance/BD approval.

---

## 1. Principles (what “clever” means here)

| Principle | Why |
|-----------|-----|
| **Honest friction** | State early that the firm **typically** acts from **£25,000** (or your precise threshold). Filters time-wasters **without** implying guaranteed outcomes. |
| **Progressive disclosure** | **Multi-step** flow (3–4 questions per screen) beats one long form — improves completion *among* serious instructing parties; see common B2B qualification pattern (e.g. progressive steps vs single page). |
| **Branching** | Route by **matter type** and **jurisdiction** (UK / US / Ireland / EU gateway) so later questions stay relevant. |
| **Minimise PII for rejects** | If someone **fails** budget fit, **avoid** collecting full contact details unless they **opt in** to a mailing list (separate consent). Reduces spam liability and respects time. |
| **Server-side validation** | Never trust client-side only; validate ranges and required fields on the server. |
| **Anti-abuse** | Rate limiting, **Turnstile** or **hCaptcha**, honeypot field; no third-party **ad** tags on the form. |

---

## 2. Suggested flow (outline)

**Step 0 — Frame (above fold on contact page)**  
Short copy: who you help, **minimum fee / engagement** band in plain English, what happens after submit (e.g. “we assess fit within X working days”).

**Step 1 — Matter**  
Nature of need (reputation, privacy, litigation support, intelligence, cyber, etc.) — **single choice** or limited multi-select.

**Step 2 — Jurisdiction / gateway**  
Where the issue sits (UK, US, Ireland / EU cross-border, other). Use this to set **expectations** (e.g. Ireland as **EU litigation / platform takedown** entry — aligns with business narrative, not a legal claim of universal coverage).

**Step 3 — Budget / instruction scale**  
**Banded** ranges with **£25k+** as lowest qualifying band; include “under £25k” → **polite exit** path:

- **Exit path:** 1–2 sentences: not the right fit; optional links to **public** resources or **pro bono** / general guidance (no cold funnel into paid ads).  
- **No** full name/email required to see exit message.

**Step 4 — Urgency & conflict hints**  
Timeline, opposing party type (generic), **not** soliciting confidential detail yet.

**Step 5 — Contact (only if qualified)**  
Name, org, email, phone; optional upload **after** human follow-up if you want to reduce automated malware risk.

**Step 6 — Confirm**  
Summary + consent checkboxes: privacy notice, **no** bundled marketing unless separate opt-in.

---

## 3. Copy and regulatory cautions

- **Minimum £25k:** phrase as **typical minimum engagement** or **starting point**, not “we guarantee representation for £25k”.  
- Do **not** over-promise **success**, **speed**, or **outcomes** in the form microcopy.  
- If **conditional fee** or similar ever mentioned on site, SRA transparency/warning notice expectations on **clarity of client liability** apply — usually irrelevant to a gate form but relevant to wider site.

---

## 4. Technical delivery (Astro-friendly)

| Piece | Note |
|-------|------|
| **Endpoint** | Server action or hosted serverless **POST**; do not expose secrets in client. |
| **Email/CRM** | Route to **inbox or CRM** once you choose stack; log submissions with **retention policy**. |
| **Analytics** | **Defer** GA4/CMP until `ANALYTICS-CONSENT-SPEC.md` is live; if you measure later, use **consented** events only. |
| **Storage** | If you store submissions, align with **privacy notice** and retention. |

---

## 5. Metrics (internal)

Track **completion rate by step**, **qualification rate**, and **time to first response** — not vanity “max submissions”.

---

*Related: `ANALYTICS-CONSENT-SPEC.md`, `FOOTER-REGULATORY-CHECKLIST.md`, `PROJECT-ANSWERS.md`*
