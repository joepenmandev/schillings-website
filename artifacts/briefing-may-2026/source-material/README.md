# Briefing source material

Human-curated evidence only. Do not use generated imagery as core evidence.

## Role

- **You choose** what to capture from the real Schillings site and real interface states.
- **Tools** (including automation) may later **compose, crop, align, arrange, scale and systemise** — not invent the primary evidence.

## Rule: signals, not pages

Do **not** capture whole pages. Capture **signals**:

- title hierarchy  
- expertise rhythm  
- credential spacing  
- discreet profile composition  
- taxonomy structure  
- category grouping  
- institutional framing  
- semantic hierarchy  
- progression logic  
- routing clarity  
- calm enquiry structure  
- operational composure  

## What to gather

- Real screenshots and crops from the **actual** site and **actual** redesign states  
- Real typography moments  
- Real hierarchy moments  
- Real practitioner compositions (fragment-level)  
- Real expertise structures (fragment-level)  
- Real contact pathway fragments  

## Page 2 benchmark (evidence plate compositor)

The editorial compositor expects these exact paths for the first plate (`page-2.manifest.json`):

- `p2-practitioner-dominant-fragment.png` — dominant / revised signal (large plate)  
- `p2-practitioner-archival-fragment.png` — archival inset (subordinate)  
- `p2-practitioner-typography-micro-fragment.png` — **optional** forensic type crop (Placeholders C); plate composes without it until you add the file.  

After composing: `npm run briefing:compose-plates` writes `../composed-plates/page-2-evidence-plate.png`.

For a **signed-off** full briefing (`npm run briefing:generate:gated` from `site/`), copy that PNG to **`../assets/p2-evidence-plate.png`** so Page 2 is locked to approved evidence (the generator will otherwise fall back to the latest composed file if present, or legacy inset/dominant pair assets).

Fragment-level **micro-crops** of an existing capture can be declared on any fragment in `page-2.manifest.json` with `"sourceRect": { "left", "top", "width", "height" }` (pixels in the source image after EXIF rotation) so the compositor trims before scaling — editorial control without new exports.

## Naming (suggested)

Use descriptive filenames so handoff to `../assets/` is obvious, for example:

- `signal-practitioner-title-hierarchy.png`  
- `signal-expertise-taxonomy-fragment.png`  
- `signal-contact-progression-fragment.png`  

Final plates for the compositor still follow filenames in `site/docs/briefing-may-2026/VISUAL-COMPOSITION-PROMPTS.md` (alignment table) and `generate-briefing-may-2026.ts`.

## After curation

Assemble approved plates into `../assets/` using the briefing compositor’s expected filenames, or document a one-time rename map in this folder.
