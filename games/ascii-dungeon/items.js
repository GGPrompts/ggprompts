/* items.js — Item definitions, loot tables, and inventory logic */
'use strict';

window.Items = (function () {
    const SLOT = { WEAPON: 'weapon', ARMOR: 'armor', NONE: 'none' };

    const WEAPONS = [
        { name: 'Rusty Dagger',    glyph: ')', color: '#888',   atk: 1, slot: SLOT.WEAPON, tier: 0 },
        { name: 'Short Sword',     glyph: ')', color: '#aaa',   atk: 2, slot: SLOT.WEAPON, tier: 1 },
        { name: 'Mace',            glyph: ')', color: '#b0a080', atk: 3, slot: SLOT.WEAPON, tier: 2 },
        { name: 'Longsword',       glyph: ')', color: '#ccc',   atk: 4, slot: SLOT.WEAPON, tier: 3 },
        { name: 'Battle Axe',      glyph: ')', color: '#d4a017', atk: 5, slot: SLOT.WEAPON, tier: 4 },
        { name: 'War Hammer',      glyph: ')', color: '#c87030', atk: 6, slot: SLOT.WEAPON, tier: 5 },
        { name: 'Flamebrand',      glyph: ')', color: '#f44',   atk: 8, slot: SLOT.WEAPON, tier: 7 },
        { name: 'Vorpal Blade',    glyph: ')', color: '#f0f',   atk: 10, slot: SLOT.WEAPON, tier: 9 },
    ];

    const ARMORS = [
        { name: 'Leather Armor',   glyph: '[', color: '#8b6914', def: 1, slot: SLOT.ARMOR, tier: 0 },
        { name: 'Studded Leather', glyph: '[', color: '#9a7b2c', def: 2, slot: SLOT.ARMOR, tier: 1 },
        { name: 'Chain Mail',      glyph: '[', color: '#aaa',   def: 3, slot: SLOT.ARMOR, tier: 2 },
        { name: 'Scale Mail',      glyph: '[', color: '#8a8',   def: 4, slot: SLOT.ARMOR, tier: 3 },
        { name: 'Plate Armor',     glyph: '[', color: '#ccc',   def: 5, slot: SLOT.ARMOR, tier: 5 },
        { name: 'Mithril Armor',   glyph: '[', color: '#8cf',   def: 7, slot: SLOT.ARMOR, tier: 7 },
        { name: 'Dragon Scale',    glyph: '[', color: '#f84',   def: 9, slot: SLOT.ARMOR, tier: 9 },
    ];

    const POTIONS = [
        { name: 'Potion of Healing',       glyph: '!', color: '#f44',   type: 'heal',      value: 15, slot: SLOT.NONE, tier: 0 },
        { name: 'Potion of Greater Healing', glyph: '!', color: '#f88',  type: 'heal',      value: 35, slot: SLOT.NONE, tier: 4 },
        { name: 'Potion of Strength',       glyph: '!', color: '#fa0',   type: 'strength',  value: 3,  slot: SLOT.NONE, tier: 2 },
        { name: 'Potion of Speed',          glyph: '!', color: '#0ff',   type: 'speed',     value: 10, slot: SLOT.NONE, tier: 3 },
        { name: 'Potion of Invisibility',   glyph: '!', color: '#aaf',   type: 'invisible', value: 15, slot: SLOT.NONE, tier: 5 },
    ];

    const SCROLLS = [
        { name: 'Scroll of Fireball',      glyph: '?', color: '#f80',   type: 'fireball',    value: 20, radius: 3, slot: SLOT.NONE, tier: 2 },
        { name: 'Scroll of Lightning',      glyph: '?', color: '#ff0',   type: 'lightning',   value: 25, slot: SLOT.NONE, tier: 3 },
        { name: 'Scroll of Teleport',       glyph: '?', color: '#a0f',   type: 'teleport',    slot: SLOT.NONE, tier: 1 },
        { name: 'Scroll of Mapping',        glyph: '?', color: '#0f0',   type: 'mapping',     slot: SLOT.NONE, tier: 2 },
        { name: 'Scroll of Enchantment',    glyph: '?', color: '#faf',   type: 'enchant',     slot: SLOT.NONE, tier: 5 },
    ];

    const GOLD = { name: 'Gold', glyph: '$', color: '#ff0', slot: SLOT.NONE };

    function rollLoot(level) {
        const items = [];
        const numItems = 3 + Math.floor(Math.random() * (3 + level * 0.5));
        for (let i = 0; i < numItems; i++) {
            const roll = Math.random();
            let item;
            if (roll < 0.25) {
                item = pickByTier(WEAPONS, level);
            } else if (roll < 0.45) {
                item = pickByTier(ARMORS, level);
            } else if (roll < 0.7) {
                item = pickByTier(POTIONS, level);
            } else if (roll < 0.9) {
                item = pickByTier(SCROLLS, level);
            } else {
                item = { ...GOLD, value: 5 + Math.floor(Math.random() * (10 + level * 5)) };
            }
            if (item) items.push({ ...item, id: crypto.randomUUID() });
        }
        return items;
    }

    function pickByTier(table, level) {
        // Items up to level + 1 tier can appear, weighted toward current level
        const eligible = table.filter(i => i.tier <= level + 1);
        if (eligible.length === 0) return null;
        // Weight higher tier items less
        const weights = eligible.map(i => Math.max(1, 5 - Math.abs(i.tier - level)));
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let i = 0; i < eligible.length; i++) {
            r -= weights[i];
            if (r <= 0) return { ...eligible[i] };
        }
        return { ...eligible[eligible.length - 1] };
    }

    function useItem(item, player, game) {
        if (item.slot === SLOT.WEAPON) {
            const old = player.equipped.weapon;
            player.equipped.weapon = item;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            if (old) player.inventory.push(old);
            return `Equipped ${item.name} (ATK +${item.atk}).`;
        }
        if (item.slot === SLOT.ARMOR) {
            const old = player.equipped.armor;
            player.equipped.armor = item;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            if (old) player.inventory.push(old);
            return `Equipped ${item.name} (DEF +${item.def}).`;
        }
        if (item.name === 'Gold') {
            player.gold += item.value;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return `Picked up ${item.value} gold.`;
        }
        // Consumables
        if (item.type === 'heal') {
            const healed = Math.min(item.value, player.maxHp - player.hp);
            player.hp += healed;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return `Healed ${healed} HP.`;
        }
        if (item.type === 'strength') {
            player.bonusAtk += item.value;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return `Strength increased by ${item.value}!`;
        }
        if (item.type === 'speed') {
            player.speedTurns = (player.speedTurns || 0) + item.value;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return 'You feel incredibly fast!';
        }
        if (item.type === 'invisible') {
            player.invisTurns = (player.invisTurns || 0) + item.value;
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return 'You fade from sight...';
        }
        if (item.type === 'fireball') {
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return game.castFireball(item.value, item.radius || 3);
        }
        if (item.type === 'lightning') {
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return game.castLightning(item.value);
        }
        if (item.type === 'teleport') {
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return game.castTeleport();
        }
        if (item.type === 'mapping') {
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            return game.castMapping();
        }
        if (item.type === 'enchant') {
            player.inventory = player.inventory.filter(i => i.id !== item.id);
            if (player.equipped.weapon) {
                player.equipped.weapon.atk += 2;
                player.equipped.weapon.name = '+' + player.equipped.weapon.name.replace(/^\+/, '');
                return `${player.equipped.weapon.name} glows with power! (ATK +2)`;
            }
            return 'The scroll crumbles to dust... (no weapon equipped)';
        }
        return 'Nothing happens.';
    }

    return { SLOT, WEAPONS, ARMORS, POTIONS, SCROLLS, GOLD, rollLoot, useItem, pickByTier };
})();
