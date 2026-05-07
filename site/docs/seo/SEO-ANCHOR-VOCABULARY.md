# SEO anchor vocabulary (Phase 2C)

**Classification:** REVIEW REQUIRED  
**Purpose:** Stabilize **semantic zones** by family so anchors reinforce hierarchy without rigid keyword lists.  
**Implementation source of truth (situation ↔ expertise):** `src/lib/expertise-situation-cluster-links.ts`  
**Editorial bridge:** `src/components/NewsTopicExpertiseContext.astro`  
**Not:** a mandate to reuse exact phrases everywhere—**prefer** these zones when writing new links or copy.

---

## Principles

1. **Expertise** anchors lean **practice-wide**: strategy, capability, firmwide, discipline, coordination.  
2. **Situations** anchors lean **scene-first**: scrutiny, allegations, pressure, coercion, forums, campaigns.  
3. **Editorial (Intelligence)** leans **non-retainer**: analysis, commentary, archive, perspective—**avoid** CTA-shaped phrasing.  
4. **People** use **directory labels** and neutral framing—no superlatives, no geo+practice stuffing.  
5. **Contact / offices** use **utility** language: reach, offices, confidential enquiry—not practice claims.

---

## Approved semantic zones (by family)

### EXPERTISE hubs (outbound to situations / in-body copy)

Use for **commercial authority** framing:

- reputation and privacy **strategy**
- **complex** disputes / high-stakes **litigation strategy**
- **investigations** and **intelligence** (capability, discipline, lawful scope)
- **crisis** / **strategic** communications (paired with legal accuracy)
- **regulatory** strategy / enforcement-facing posture
- **cross-border** coordination / international mandates
- corporate and **transactional** risk (information, counterparties, leaks)

**Avoid on hubs:** scenario-only hooks without practice hook (“when the story breaks”) as the **only** frame—pair with capability.

---

### SITUATIONS (outbound to expertise)

Use for **scenario support** (path into practice):

- media **scrutiny**; **press** and platform attention
- **online allegations**; false narratives; hostile **digital** activity
- **coercion** / **extortion**; threats of release
- **cross-border forums**; parallel proceedings
- **hostile campaigns**; sustained pressure
- **fast-moving** crises; leadership **scrutiny**
- **fact-finding** feeding disputes

**Avoid on situations:** repeating full hub superlatives; “best”; geo+“lawyers” patterns; CTA copy.

---

### EDITORIAL (Intelligence — topics, articles)

Use for **informational** stance:

- analysis, commentary, **Intelligence** archive, perspective, reporting, insight (where accurate)

**Neutral bridge to practice (allowed):**

- **“Related expertise:”** + hub label + **“— firmwide practice context, separate from this editorial archive.”** (`NewsTopicExpertiseContext.astro`).

**Avoid in editorial surfaces:**

- “Need help with…”, “Contact us for…”, “Leading lawyers for…”, disguised landing-page leads.

---

### PEOPLE (profiles)

- Section labels: **Helps clients with**, **Related situations**, **Related expertise** (index).  
- Body: firmwide practice **context**; not individual commercial positioning.

**Avoid:**

- “Top/defamation lawyer in [city]” patterns; repeating commercial head terms in intro paragraphs.

---

### CONTACT / OFFICES

- Confidential enquiry, offices, directions, **discretion**—utility and trust.

**Avoid:**

- Competing with expertise for practice definitions (“our London defamation team” as **primary** practice copy on office page beyond restrained mention).

---

## Drift checks (quarterly)

| Signal | Action |
|--------|--------|
| New internal links added ad hoc | Map to a zone above; update cluster file if recurring |
| Editorial bridge copy lengthening | Shorten; keep “Related expertise” pattern |
| Situation anchors creeping toward hub language | Rewrite toward scenario vocabulary |

---

## Revision log

| Date | Change |
|------|--------|
| 2026-05-06 | Phase 2C stabilization doc |
