# Automated Validation Workflow (Cohort 1)

Purpose: provide repeatable, structured infrastructure for AI-assisted and human-assisted validation review aggregation of practitioner profiles.

This workflow is validation infrastructure only. It supports evidence collection, aggregation, and escalation checks under existing governance.

## Inputs

Review files should be created as JSON documents that conform to `review-schema.json`.

Expected location:

- `site/docs/people-bio-references/automated-validation/results/`

Expected filename convention:

- `profile.viewport.lens.json`
- examples:
  - `jenny-afia.desktop.gc.json`
  - `jenny-afia.mobile.gc.json`
  - `ben-hobbs.desktop.operator.json`

Each file represents one structured review pass for one profile, one viewport, one reviewer lens.

## Aggregation

Aggregation combines review JSON files to produce:

- score statistics (mean, median, range)
- desktop/mobile score comparisons
- referral safety distribution
- dominant trust mode distribution
- recurring friction markers
- repeated issue candidates
- D-002 trigger candidate checks
- stop/go recommendation framing inputs

Use:

- `site/scripts/people-bio-aggregate-reviews.mjs`

The script outputs markdown only and does not modify source content.

## What This Workflow Does Not Do

- does not generate review outcomes automatically
- does not browse live URLs
- does not rewrite bios
- does not alter profile code, layout, portrait handling, or production components
- does not expand doctrine or governance scope
- does not produce design recommendations

## Constraint Reminder

This system supports validation only, not redesign.
