# Survivors: Mid-run shop/inventory access from pause menu

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-06t` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 16:17:28 |
| **Updated** | 2026-02-16 16:54:58 |

## Description

No way to spend gold, allocate skill points, or manage inventory during a run. All of that is only on the between-runs shop screen. For long runs (12+ min) this feels limiting.

Needs:
- Pause menu should have tabs/buttons for: inventory, skill tree, shop
- Or periodic shop breaks (e.g. every 3-5 minutes, like Vampire Survivors merchant)
- Show current gold, skill points, and equipped items on pause screen at minimum
- Consider a mid-run skill point allocation UI for points earned during the run

## Worker Prompt & Notes

## Retro
- What worked: Reading the full engine.js upfront gave clear understanding of the pause system (HTML overlay), inventory/equipment system, and skill tree definitions. The existing patterns were consistent across all 4 themes, making bulk edits straightforward.
- What was unclear: The engine.js file was auto-committed by another process mid-edit, requiring careful detection of which changes still needed committing.
