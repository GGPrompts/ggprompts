# Survivors: Inventory system — more slots, item management, salvage

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-uqq` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 16:17:25 |
| **Updated** | 2026-02-16 16:44:28 |

## Description

Currently limited to 3 equipped item slots with no way to manage inventory. Low-tier items accumulate with no purpose. Need a proper inventory system.

Needs:
- More inventory/equipment slots (or unlock additional slots via shop/progression)
- Inventory UI to view all collected items and swap equipped items
- Salvage/sell system for unwanted items (convert to gold or crafting materials)
- Item comparison when picking up loot (show stat diff vs equipped)
- Maybe item fusion: combine low-tier items into higher tier

## Worker Prompt & Notes

## Retro
- What worked: Existing inventory CSS classes and equip/unequip pattern were well-structured, making it easy to extend with salvage and slot management
- What was unclear: The 4 shop pages having duplicated JS logic means every change needs 4x application; would benefit from shared script extraction in a future refactor
