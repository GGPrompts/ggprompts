# Survivors: Pin gold display so it stays visible when scrolling shop

| Field | Value |
|-------|-------|
| **ID** | `htmlstyleguides-api` |
| **Status** | closed |
| **Priority** | 1 |
| **Labels** | — |
| **Created** | 2026-02-16 16:17:47 |
| **Updated** | 2026-02-16 16:36:21 |

## Description

On the shop page, the gold amount scrolls off screen as you browse upgrades. It should be pinned/sticky so you always know how much gold you have while shopping.

Fix: Make the gold counter a sticky/fixed element at the top of the shop page (or in a floating header bar) so it remains visible during scroll.

## Worker Prompt & Notes

## prepared.prompt

## Context
On the shop page, the gold counter scrolls off screen when browsing upgrades, so players can't see how much gold they have.

## Task
Make the gold display sticky/fixed at the top of the shop page so it remains visible while scrolling.

1. In shop-template.html, find `.gold-display` (~line 88) and add `position: sticky; top: 0; z-index: 10;` (or make the `.shop-header` sticky)
2. Apply the same fix to all themed shop pages: shop-gothic.html, shop-forest.html, shop-cosmic.html
3. Test that the gold amount stays visible when scrolling through the upgrade grid

## Key Files
- games/survivors/shop-template.html (gold-display ~line 88, shop-header ~line 51)
- games/survivors/shop-gothic.html
- games/survivors/shop-forest.html
- games/survivors/shop-cosmic.html

## When Done
bd close htmlstyleguides-api --reason "Pinned gold display as sticky header in all shop pages"
