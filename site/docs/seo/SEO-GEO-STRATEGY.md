# GEO strategy (UK · US · IE)

**Status:** Regional SEO intent aligned with **existing** locale model  
**Governance:** [`../DESIGN-SYSTEM-GOVERNANCE.md`](../DESIGN-SYSTEM-GOVERNANCE.md) §12 (escalation); **no hreflang/canonical changes** in this document

**URL model (reference):** UK default (`/`), US (`/us/`), IE (`/ie/`) — parity for most marketing routes.

---

## 1. Regional objectives

| Region | Business intent (SEO lens) | Primary geo signals |
|--------|---------------------------|---------------------|
| **UK** | London HQ; English law reputation/privacy/litigation; international outbound | London, UK, City, English courts language |
| **US** | Americas hub; cross-border; US LatAm connector | Miami, United States, Brickell (where accurate) |
| **IE** | EU gateway; Dublin office; cross-border EU | Dublin, Ireland, EU |

---

## 2. Family-level geo aggressiveness

| Family | UK | US | IE | Notes |
|--------|----|----|-----|-------|
| Homepage | **High** | **High** | **High** | Regional titles/meta already differentiated — preserve intent clarity |
| About | **High** | **High** | **High** | Regional `metaTitle` pattern |
| Contact | **High** | **High** | **High** | Geo in **title** (London / Miami / Dublin framing) |
| Offices | **Very high** | **Very high** | **Very high** | City + address + map |
| Expertise hubs | **Med** | **Med** | **Med** | Jurisdiction hints often belong in **meta** or body, not always title |
| Situations | **Low–med** | **Low–med** | **Low–med** | Problems are often universal; **avoid** fake localization |
| WWP | **Low** | **Low** | **Low** | Stake language is global; optional jurisdiction examples in body |
| Intelligence | **Low** | **Low** | **Low** | Editorial authority — geo only when editorially relevant |
| People | **Med** | **Med** | **Med** | Office labels; directory regional meta |
| Legal/compliance | **Low** | **Low** | **Low** | Institutional; duplicate titles acceptable unless GSC shows issues |

---

## 3. Query expectations by locale

### UK

- “Reputation lawyers London”, “defamation solicitors”, “privacy law firm UK”, “City law firm reputation”.  
- **Leading surfaces:** Expertise hubs + London office + Contact + Home.

### US

- “Miami law firm”, “cross-border reputation counsel”, “US crisis communications legal” (careful — practice reality must match).  
- **Leading surfaces:** Miami office + US About + Contact + Home.

### IE

- “Dublin law firm EU”, “Ireland privacy legal counsel”, “EU gateway law firm” (accuracy-gated).  
- **Leading surfaces:** Dublin office + IE About + Contact + Home.

---

## 4. hreflang intent alignment (read-only)

- **Purpose:** Correct regional URL surfaces for brand and utility queries — **not** a tool for keyword permutations.  
- **Strategy:** Keep **parity** of *intent* across locales; **do not** force identical titles if regional positioning differs (governance: coherent, not identical).

---

## 5. Local trust signals (non-SEO-extractive)

- Consistent **NAP** logic (name, address, phone) across office JSON-LD and visible HTML.  
- **24/7** lines: region-appropriate in meta where implemented.  
- **Avoid:** Stuffing every page footer with city lists.

---

## 6. Phasing

1. **SAFE:** Office + Contact meta refinements per city.  
2. **REVIEW:** Expertise hub meta adds “UK / US / Ireland” only where practice truth supports.  
3. **HIGH RISK:** Homepage regional title experiments — brand gate.

---

## 7. Related documents

- [`SEO-TITLE-META-STRATEGY.md`](./SEO-TITLE-META-STRATEGY.md)
- [`SEO-KEYWORD-INTENT-MAP.md`](./SEO-KEYWORD-INTENT-MAP.md)
- [`SEO-SERP-POSITIONING-MATRIX.md`](./SEO-SERP-POSITIONING-MATRIX.md)
