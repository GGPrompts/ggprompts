# Update shop pages with class-specific upgrades and theming

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-85o` |
| **Status** | closed |
| **Priority** | 2 |
| **Labels** | — |
| **Created** | 2026-02-16 17:37:20 |
| **Updated** | 2026-02-16 18:23:47 |

## Description

Each themed shop page should reflect its class identity:

1. Rename 'Stat Upgrades' section to class-themed categories (e.g. Gothic: 'Dark Arts', 'Blood Rites', 'Shadow Magic')
2. Different stat upgrade pools per class:
   - Gunner: Damage, Attack Speed, Crit Chance, Piercing, Accuracy
   - Dark Knight: Max HP, Lifesteal, Thorns, Summon Power, AoE Size
   - Ranger: Move Speed, Dodge Chance, DoT Damage, Trap Power, Pickup Radius
   - Warlock: Ability Power, Cooldown Reduction, Max Mana(?), Shield, Pull Strength
3. Class-specific loot tables for items (Gunner gets tech items, Ranger gets nature items, etc.)
4. Show class icon/name prominently in shop header
5. Skill tree section shows the class-specific tree (from the unique skill trees task)

Files: shop-cyberpunk.html, shop-gothic.html, shop-forest.html, shop-cosmic.html, shop-template.html

## Worker Prompt & Notes

## Retro
- What worked: Clear task spec made it straightforward to update SHOP_CONFIG per class. Each shop already had themed names so extending to class-specific stat lines was natural.
- What was unclear: Whether removing stat lines would break existing saves that had purchased those upgrades. Kept IDs consistent so existing purchases still work.
