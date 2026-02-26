// relics.js - Relic definitions and passive effects
// Slay the Spire-lite card combat deckbuilder

(function() {
  const S = window.Spire;

  S.RELIC_DEFS = {
    burning_blood: {
      id: 'burning_blood', name: 'Burning Blood',
      icon: '\uD83E\uDE78',
      description: 'At the end of combat, heal 6 HP.',
      rarity: 'starter',
      trigger: 'combat_end',
      effect: { heal: 6 },
    },
    anchor: {
      id: 'anchor', name: 'Anchor',
      icon: '\u2693',
      description: 'Start each combat with 10 Block.',
      rarity: 'common',
      trigger: 'combat_start',
      effect: { block: 10 },
    },
    bag_of_prep: {
      id: 'bag_of_prep', name: 'Bag of Preparation',
      icon: '\uD83C\uDF92',
      description: 'At the start of combat, draw 2 extra cards.',
      rarity: 'common',
      trigger: 'combat_start',
      effect: { draw: 2 },
    },
    lantern: {
      id: 'lantern', name: 'Lantern',
      icon: '\uD83C\uDFEE',
      description: 'Gain 1 energy on the first turn of each combat.',
      rarity: 'common',
      trigger: 'first_turn',
      effect: { energy: 1 },
    },
    vajra: {
      id: 'vajra', name: 'Vajra',
      icon: '\u26A1',
      description: 'Start each combat with 1 Strength.',
      rarity: 'common',
      trigger: 'combat_start',
      effect: { strength: 1 },
    },
    oddly_smooth_stone: {
      id: 'oddly_smooth_stone', name: 'Oddly Smooth Stone',
      icon: '\uD83E\uDEA8',
      description: 'Start each combat with 1 Dexterity (+1 Block from cards).',
      rarity: 'common',
      trigger: 'combat_start',
      effect: { dexterity: 1 },
    },
    pen_nib: {
      id: 'pen_nib', name: 'Pen Nib',
      icon: '\u2712',
      description: 'Every 10th Attack deals double damage.',
      rarity: 'uncommon',
      trigger: 'passive',
      effect: { doubleEveryN: 10 },
      counter: 0,
    },
    ornamental_fan: {
      id: 'ornamental_fan', name: 'Ornamental Fan',
      icon: '\uD83C\uDF2C',
      description: 'Every 3rd Attack played, gain 4 Block.',
      rarity: 'uncommon',
      trigger: 'passive',
      effect: { blockEveryN: 3, blockAmount: 4 },
      counter: 0,
    },
    meat_on_bone: {
      id: 'meat_on_bone', name: 'Meat on the Bone',
      icon: '\uD83C\uDF56',
      description: 'If HP is at 50% or less at end of combat, heal 12 HP.',
      rarity: 'uncommon',
      trigger: 'combat_end',
      effect: { healIfLow: 12 },
    },
    eternal_feather: {
      id: 'eternal_feather', name: 'Eternal Feather',
      icon: '\uD83E\uDEB6',
      description: 'For every 5 cards in your deck, heal 3 HP at rest sites.',
      rarity: 'uncommon',
      trigger: 'rest',
      effect: { healPerCards: { per: 5, amount: 3 } },
    },
  };

  S.starterRelic = () => ({ ...S.RELIC_DEFS.burning_blood, counter: 0 });

  S.getRandomRelic = (ownedIds) => {
    const pool = Object.values(S.RELIC_DEFS).filter(r =>
      r.rarity !== 'starter' && !ownedIds.includes(r.id)
    );
    if (pool.length === 0) return null;
    const def = pool[Math.floor(Math.random() * pool.length)];
    return { ...def, counter: 0 };
  };

  // Check relics for a trigger event and apply effects
  S.applyRelics = (trigger, state) => {
    const results = [];
    for (const relic of state.relics) {
      const def = S.RELIC_DEFS[relic.id];
      if (!def || def.trigger !== trigger) continue;

      const fx = def.effect;
      if (trigger === 'combat_start') {
        if (fx.block) { state.player.block += fx.block; results.push(relic.name + ': +' + fx.block + ' Block'); }
        if (fx.draw) { results.push(relic.name + ': draw ' + fx.draw + ' extra'); state.bonusDraws = (state.bonusDraws || 0) + fx.draw; }
        if (fx.strength) { state.player.strength += fx.strength; results.push(relic.name + ': +' + fx.strength + ' Strength'); }
        if (fx.dexterity) { state.player.dexterity += fx.dexterity; results.push(relic.name + ': +' + fx.dexterity + ' Dexterity'); }
      }
      if (trigger === 'first_turn') {
        if (fx.energy) { state.energy += fx.energy; results.push(relic.name + ': +' + fx.energy + ' Energy'); }
      }
      if (trigger === 'combat_end') {
        if (fx.heal) { state.player.hp = Math.min(state.player.maxHp, state.player.hp + fx.heal); results.push(relic.name + ': healed ' + fx.heal + ' HP'); }
        if (fx.healIfLow && state.player.hp <= state.player.maxHp * 0.5) {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + fx.healIfLow);
          results.push(relic.name + ': healed ' + fx.healIfLow + ' HP');
        }
      }
      if (trigger === 'rest') {
        if (fx.healPerCards) {
          const deckSize = state.fullDeck.length;
          const bonus = Math.floor(deckSize / fx.healPerCards.per) * fx.healPerCards.amount;
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + bonus);
          results.push(relic.name + ': healed ' + bonus + ' HP');
        }
      }
    }
    return results;
  };

  // Pen nib / ornamental fan passive checks on attack
  S.checkAttackRelics = state => {
    let doubleDamage = false;
    let bonusBlock = 0;
    for (const relic of state.relics) {
      const def = S.RELIC_DEFS[relic.id];
      if (!def || def.trigger !== 'passive') continue;
      relic.counter = (relic.counter || 0) + 1;

      if (def.effect.doubleEveryN && relic.counter >= def.effect.doubleEveryN) {
        doubleDamage = true;
        relic.counter = 0;
      }
      if (def.effect.blockEveryN && relic.counter >= def.effect.blockEveryN) {
        bonusBlock += def.effect.blockAmount;
        relic.counter = 0;
      }
    }
    return { doubleDamage, bonusBlock };
  };
})();
