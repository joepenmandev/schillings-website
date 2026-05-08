# Composed evidence plates

Output from `npm run briefing:compose-plates` (see `site/scripts/compose-evidence-plates.ts`).

- **Page 2 benchmark:** `page-2-evidence-plate.png` from `site/docs/briefing-may-2026/plates/page-2.manifest.json`
- **Sources:** real fragments only in `../source-material/` (see manifest `source` paths)

## Full briefing (Phase 4)

Do **not** treat the full PDF as “ready” until Page 2 is approved and evidence quality is resolved.

1. Compose: `npm run briefing:compose-plates` (from `site/`)
2. Review the PNG; iterate manifest/sources only as needed
3. **Sign-off handoff:** copy the approved plate to **`../assets/p2-evidence-plate.png`** (single spread replaces the old inset+dominant pair in HTML)
4. **Full briefing PDF:** only after step 3 — `npm run briefing:generate:gated` (requires the approved asset path above)

Review workflow and allowed tweaks: `site/docs/briefing-may-2026/PAGE-2-EVIDENCE-PLATE-REVIEW.md`

Legacy pair assets (`p2-practitioner-old-inset.png` + `p2-practitioner-new-dominant.png`) apply only when **no** unified plate file exists at either path above.

Doctrine: `site/docs/briefing-may-2026/VISUAL-COMPOSITION-PROMPTS.md`
