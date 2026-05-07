# Page 2 evidence plate — review mode only

**Model (locked):** plate compositor = visual authorship · briefing generator = document assembly.  
The PDF must **not** compose Page 2 in HTML/CSS; it accepts **one approved evidence plate** (`assets/p2-evidence-plate.png` after sign-off).

**Do not yet:** add Pages 3–6 plate compositors, new generator features, new copy, annotations, arrows, labels, or layout systems. Page 2 is the benchmark; if it is not premium, more manifests only multiply the problem.

---

## Workflow

1. Place **real** source fragments in `artifacts/briefing-may-2026/source-material/` (paths in `plates/page-2.manifest.json`).
2. From `site/`: `npm run briefing:compose-plates`
3. Review **only** `artifacts/briefing-may-2026/composed-plates/page-2-evidence-plate.png`
4. Iterate **`plates/page-2.manifest.json`** (and sources) until the plate feels right — see allowed knobs below.
5. When approved, copy the PNG to **`artifacts/briefing-may-2026/assets/p2-evidence-plate.png`**
6. **Only then:** `npm run briefing:generate:gated` (full briefing PDF)

Doctrine: `VISUAL-COMPOSITION-PROMPTS.md` · Compositor: `site/scripts/compose-evidence-plates.ts`

---

## Review criteria

- Does the **dominant** practitioner plate feel **authored**, not inserted?
- Does the **archival** inset feel **subordinate** and **recovered** (not presented as a slide)?
- Does the composition **avoid before/after energy**?
- Do **typography and standing** feel **primary at glance**?
- Does **whitespace** feel **intentional** rather than empty?
- Does the plate **slow the reader down** rather than make them scan UI?

If any answer is **no**, adjust **only** these levers (manifest + sources):

- `sourceRect` (per fragment)
- `position` (Sharp crop anchor)
- `opacity`
- `archival` treatment (`grayscale`, `gamma`, `linear`, `desaturateExtra`)
- `edgeBleed` (`extendWidth`, `extendHeight`)
- `silenceMargin` (plate-wide)
- optional `microTypography` fragment (file + regions)

Do **not** fix problems by adding new layout systems or generator logic.
