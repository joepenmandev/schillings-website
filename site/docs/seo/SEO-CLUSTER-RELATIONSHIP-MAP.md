# SEO cluster relationship map — expertise ↔ situations (Phase 2A)

**Purpose:** Document **curated** topical clusters between **expertise hubs** (commercial authority) and **situations** (high-intent scenarios).  
**Scope:** Phase 2A only — no Intelligence, topic archives, people profiles, About, or Contact.  
**Implementation:** `src/lib/expertise-situation-cluster-links.ts`; surfaces: `SituationDetailPage.astro`, `ExpertiseHubDetail.astro`.

**Note:** People profiles use a **sibling** map (`person-expertise-strategic-situations.ts`) for directory tags → situations. Hub/situation linking is **governed separately** so profile pages stay unchanged in this phase.

---

## Authority & conversion flow (intended)

| Flow | Role |
|------|------|
| **Situation → expertise** | After scenario framing, surface **where counsel deepens** without turning situations into service landing pages. |
| **Expertise → situation** | Ground commercial hubs in **recognisable scenarios**; reinforce topical ownership and parent/child clarity. |

**Cannibalization stance:** Situations retain **scenario / informational** intent; expertise hubs retain **commercial / capability** intent. Links clarify adjacency; they do not merge query targets.

---

## Implementation surfaces (audit)

| Surface | Component | Phase 2A use |
|---------|-----------|--------------|
| Situation lists (WWP, pillars) | `SituationDetailPage.astro` | **Add** “Related expertise” list — same list/typography as existing related sections. |
| Expertise body | `ExpertiseHubDetail.astro` | **Add** “Related situations” list — mirrors situation-page “Related …” pattern. |
| CTA band | `CtaConfidentialBand` | **Unchanged** (conversion-first, no extra links). |
| People / Intelligence / nav | — | **Out of scope** |

No new grids, footers, or auto-generated “related content” systems.

---

## Cluster matrix

**Legend — relationship strength:** `strong` | `supporting`  
**Link direction:** `↔` bidirectional intent (implemented as two curated lists); `→` one-way in v1 where noted.  
**Risk tier:** **SAFE** — list copy + hrefs only; no routes, titles, schema, or layout system changes.

### Reputation & privacy hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| Media exposure & scrutiny | strong | Media, privacy, narrative | Low — situation = scenario; hub = sustained capability | ↔ | Conceptual: scrutiny, spotlight, pressure | Situation + hub |
| Reputation under threat | strong | Coordinated reputational harm | Low | ↔ | Threat, narrative, record | Both |
| Family privacy & protection | strong | Privacy, dignity, family | Low | ↔ | Family, privacy, boundaries | Both |
| Online attacks & misinformation | strong | Digital harm, false narratives | Medium — also intelligence; **split anchors** | ↔ | Online attacks, mapping activity | Both |
| AI & deepfake threats | supporting | Synthetic media, evidence | Low | Situation → expertise (two hubs) | Authenticity, evidence | Situation |
| Executive & leadership risk | supporting | Leadership scrutiny | Low | Situation → hub | Leadership, judgment | Situation only to comms + reputation |

**Expertise hub outbound (curated):** media scrutiny, reputation threat, family privacy, online attacks (max density).

---

### Litigation & disputes hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| High-stakes litigation | strong | Court + parallel narrative risk | Low | ↔ | Litigation, proceedings | Both |
| International disputes | strong | Cross-border proceedings | Low — **international hub** also linked for coordination | ↔ | Cross-border, forums | Situation → intl + lit; hubs cross-link via situation |
| Sensitive investigations | strong | Fact-finding feeding disputes | Medium — shared with intelligence; **different anchors** | ↔ | Investigations, disputes | Both |
| Crisis containment | supporting | Fast legal + narrative exposure | Medium — shared with communications | ↔ | Crises, legal exposure | Both |
| Activist & hostile campaigns | supporting | Legal boundaries, sustained pressure | Low | Situation → expertise | Hostile campaigns, boundaries | Situation |

---

### Intelligence & investigations hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| Sensitive investigations | strong | Discreet fact-finding | See litigation — anchors differ | ↔ | Discreet investigations | Both |
| Online attacks & misinformation | supporting | Intelligence picture vs surfaces | Shared with reputation + **DR hub**; **different anchors** | ↔ | Coordinated online pressure, intelligence picture | Both |
| AI & deepfake threats | supporting | Evidence / channel mapping | Shared with reputation + **DR hub** | Situation → hub | Synthetic media, evidence | Situation |

**Note:** Cyber extortion, hostile online **resilience/monitoring**, and AI-**surface** narratives are curated primarily against the **Digital Resilience & Security** hub (`expertise-situation-cluster-links.ts`); ISD stays investigations-led.

---

### Digital Resilience & Security hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| Cyber extortion & coercion | strong | Digital channels, response | Low vs ISD when anchors stay distinct | ↔ | Extortion, digital resilience | Both |
| Online attacks & misinformation | strong | Search, social, monitoring | Medium — shared vocabulary with ISD; **split anchors** | ↔ | Online attacks, monitoring | Both |
| AI & deepfake threats | strong | AI-visible reputation, verification | Shared with reputation | ↔ | AI surfaces, narratives | Both |

---

### Strategic communications hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| Media exposure & scrutiny | strong | Narrative under attention | Low | ↔ | Communications in the spotlight | Both |
| Crisis containment | strong | Coordinated messaging | Low | ↔ | Coordinated communications | Both |
| Executive & leadership risk | strong | Executive posture | Low | ↔ | Leadership communications | Both |

---

### International hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| International disputes | strong | Multi-jurisdiction matters | Low — litigation hub also linked from same situation | Situation → intl + lit | Cross-border coordination | Both |

---

### Regulatory hub

| Situation | Strength | Intent overlap | Cannibalization | Direction | Anchor philosophy | Surface |
|-----------|----------|----------------|-----------------|-----------|-------------------|---------|
| Sensitive investigations | supporting | Regulatory/investigation overlap | Low | ↔ | Regulatory exposure | Both |
| Crisis containment | supporting | Market/regulator attention | Low | ↔ | Pressure, clocks | Both |

---

### Corporate transactions hub

| Situation | — | — | — | **No Phase 2A links** | Avoid weak, forced ties | Hubs with empty curated list omit section |

---

## Situation → expertise (summary)

| Situation | Expertise targets (max 2) |
|-----------|---------------------------|
| Media exposure & scrutiny | Reputation & privacy; Strategic communications |
| Reputation under threat | Reputation & privacy |
| Family privacy & protection | Reputation & privacy |
| Executive & leadership risk | Reputation & privacy; Strategic communications |
| Online attacks & misinformation | Reputation & privacy; Intelligence & investigations |
| AI & deepfake threats | Reputation & privacy; Intelligence & investigations |
| Cyber extortion & coercion | Intelligence & investigations |
| Sensitive investigations | Intelligence & investigations; Litigation & disputes |
| International disputes | International; Litigation & disputes |
| Activist & hostile campaigns | Reputation & privacy; Litigation & disputes |
| Crisis containment | Strategic communications; Litigation & disputes |
| High-stakes litigation | Litigation & disputes |

---

## Anchor rules (mandatory)

- **Use:** short conceptual phrases; varied wording; partial/conceptual match.  
- **Avoid:** repeated exact-match “lawyers” / geo / superlative patterns; identical anchors on multiple rows.  
- **Implementation:** All visible labels live in `expertise-situation-cluster-links.ts` (not auto-generated from titles).

### Phase 2B — anchor hierarchy (authority)

- **Situation → expertise:** scenario-first (scrutiny, allegations, coercion, forums); avoids repeating hub-level “strategy” framing on every line.  
- **Expertise → situation:** practice-forward (“strategy”, “discipline”, “informing disputes”) so hubs read as **firmwide authority**; see `SEO-AUTHORITY-OWNERSHIP-MAP.md`.

---

## QA (Phase 2A)

- [ ] UK / US / IE: internal `localeHref` targets resolve.  
- [ ] No new layout regions beyond one list block per page type.  
- [ ] Title, meta, canonical, hreflang, JSON-LD, H1, breadcrumbs unchanged.  
- [ ] Crawl: `verify:strategic-crawl` still passes.  
- [ ] Link density: ≤2 expertise links per situation; hub situation lists capped in data.

---

## Measurement (guidance)

- Expertise impressions/CTR; query expansion on commercial heads.  
- Assisted visibility for situation→hub paths (behavioural + GSC).  
- Watch for query overlap / cannibalization between a situation URL and its primary hub; adjust cluster in a future iteration if needed.

---

## Revision log

| Date | Change |
|------|--------|
| 2026-05-06 | Initial Phase 2A map + implementation wiring. |
| 2026-05-06 | Phase 2C: link graph **unchanged**; vocabulary stabilization in `SEO-ANCHOR-VOCABULARY.md`; ownership audit in `SEO-QUERY-OWNERSHIP-AUDIT.md`. |
