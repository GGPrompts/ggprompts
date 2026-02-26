// cards.js - Card definitions, deck management, card types
// Slay the Spire-lite card combat deckbuilder

(function() {
  const S = window.Spire = window.Spire || {};

  // Card types
  const ATTACK = 'attack', DEFEND = 'defend', SKILL = 'skill', POWER = 'power', CURSE = 'curse';
  S.CardType = { ATTACK, DEFEND, SKILL, POWER, CURSE };

  // Card rarity
  const COMMON = 'common', UNCOMMON = 'uncommon', RARE = 'rare';
  S.CardRarity = { COMMON, UNCOMMON, RARE };

  // Target types
  const SINGLE = 'single', ALL_ENEMIES = 'all', SELF = 'self', NONE = 'none';
  S.Target = { SINGLE, ALL_ENEMIES, SELF, NONE };

  // All card definitions
  S.CARD_DEFS = {
    // --- STARTER CARDS ---
    strike: {
      id: 'strike', name: 'Strike', type: ATTACK, rarity: COMMON,
      cost: 1, target: SINGLE, description: 'Deal 6 damage.',
      effect: { damage: 6 }, starter: true
    },
    defend: {
      id: 'defend', name: 'Defend', type: DEFEND, rarity: COMMON,
      cost: 1, target: SELF, description: 'Gain 5 Block.',
      effect: { block: 5 }, starter: true
    },
    bash: {
      id: 'bash', name: 'Bash', type: ATTACK, rarity: COMMON,
      cost: 2, target: SINGLE, description: 'Deal 8 damage. Apply 2 Vulnerable.',
      effect: { damage: 8, applyVulnerable: 2 }, starter: true
    },

    // --- COMMON ATTACKS ---
    cleave: {
      id: 'cleave', name: 'Cleave', type: ATTACK, rarity: COMMON,
      cost: 1, target: ALL_ENEMIES, description: 'Deal 8 damage to ALL enemies.',
      effect: { damage: 8 }
    },
    iron_wave: {
      id: 'iron_wave', name: 'Iron Wave', type: ATTACK, rarity: COMMON,
      cost: 1, target: SINGLE, description: 'Gain 5 Block. Deal 5 damage.',
      effect: { damage: 5, block: 5 }
    },
    pommel_strike: {
      id: 'pommel_strike', name: 'Pommel Strike', type: ATTACK, rarity: COMMON,
      cost: 1, target: SINGLE, description: 'Deal 5 damage. Draw 1 card.',
      effect: { damage: 5, draw: 1 }
    },
    twin_strike: {
      id: 'twin_strike', name: 'Twin Strike', type: ATTACK, rarity: COMMON,
      cost: 1, target: SINGLE, description: 'Deal 5 damage twice.',
      effect: { damage: 5, hits: 2 }
    },
    headbutt: {
      id: 'headbutt', name: 'Headbutt', type: ATTACK, rarity: COMMON,
      cost: 1, target: SINGLE, description: 'Deal 9 damage.',
      effect: { damage: 9 }
    },
    anger: {
      id: 'anger', name: 'Anger', type: ATTACK, rarity: COMMON,
      cost: 0, target: SINGLE, description: 'Deal 6 damage. Add a copy to discard pile.',
      effect: { damage: 6, copyToDiscard: true }
    },

    // --- COMMON DEFENDS ---
    shroud: {
      id: 'shroud', name: 'Shroud of Darkness', type: DEFEND, rarity: COMMON,
      cost: 1, target: SELF, description: 'Gain 6 Block. Draw 1 card.',
      effect: { block: 6, draw: 1 }
    },
    fortify: {
      id: 'fortify', name: 'Fortify', type: DEFEND, rarity: COMMON,
      cost: 1, target: SELF, description: 'Gain 8 Block.',
      effect: { block: 8 }
    },
    parry: {
      id: 'parry', name: 'Parry', type: DEFEND, rarity: COMMON,
      cost: 1, target: SELF, description: 'Gain 5 Block. Gain 1 Strength next turn.',
      effect: { block: 5, nextTurnStrength: 1 }
    },

    // --- COMMON SKILLS ---
    shrug_it_off: {
      id: 'shrug_it_off', name: 'Shrug It Off', type: SKILL, rarity: COMMON,
      cost: 1, target: SELF, description: 'Gain 8 Block. Draw 1 card.',
      effect: { block: 8, draw: 1 }
    },
    blood_vial: {
      id: 'blood_vial', name: 'Blood Vial', type: SKILL, rarity: COMMON,
      cost: 1, target: SELF, description: 'Heal 6 HP.',
      effect: { heal: 6 }
    },
    flex: {
      id: 'flex', name: 'Flex', type: SKILL, rarity: COMMON,
      cost: 0, target: SELF, description: 'Gain 2 Strength this turn.',
      effect: { tempStrength: 2 }
    },

    // --- UNCOMMON ATTACKS ---
    carnage: {
      id: 'carnage', name: 'Carnage', type: ATTACK, rarity: UNCOMMON,
      cost: 2, target: SINGLE, description: 'Deal 20 damage.',
      effect: { damage: 20 }
    },
    uppercut: {
      id: 'uppercut', name: 'Uppercut', type: ATTACK, rarity: UNCOMMON,
      cost: 2, target: SINGLE, description: 'Deal 13 damage. Apply 1 Weak. Apply 1 Vulnerable.',
      effect: { damage: 13, applyWeak: 1, applyVulnerable: 1 }
    },
    whirlwind: {
      id: 'whirlwind', name: 'Whirlwind', type: ATTACK, rarity: UNCOMMON,
      cost: -1, target: ALL_ENEMIES, description: 'Deal 5 damage to ALL enemies X times (X = energy).',
      effect: { damage: 5, hitsFromEnergy: true }
    },
    body_slam: {
      id: 'body_slam', name: 'Body Slam', type: ATTACK, rarity: UNCOMMON,
      cost: 1, target: SINGLE, description: 'Deal damage equal to your Block.',
      effect: { damageFromBlock: true }
    },
    rampage: {
      id: 'rampage', name: 'Rampage', type: ATTACK, rarity: UNCOMMON,
      cost: 1, target: SINGLE, description: 'Deal 8 damage. Increases by 5 each play.',
      effect: { damage: 8, rampUp: 5 }
    },
    bloodletting: {
      id: 'bloodletting', name: 'Bloodletting', type: ATTACK, rarity: UNCOMMON,
      cost: 0, target: SINGLE, description: 'Lose 3 HP. Deal 18 damage.',
      effect: { damage: 18, selfDamage: 3 }
    },

    // --- UNCOMMON DEFENDS/SKILLS ---
    impervious: {
      id: 'impervious', name: 'Impervious', type: DEFEND, rarity: UNCOMMON,
      cost: 2, target: SELF, description: 'Gain 30 Block.',
      effect: { block: 30 }
    },
    flame_barrier: {
      id: 'flame_barrier', name: 'Flame Barrier', type: SKILL, rarity: UNCOMMON,
      cost: 2, target: SELF, description: 'Gain 12 Block. When hit, deal 4 damage back.',
      effect: { block: 12, thorns: 4 }
    },
    battle_trance: {
      id: 'battle_trance', name: 'Battle Trance', type: SKILL, rarity: UNCOMMON,
      cost: 0, target: SELF, description: 'Draw 3 cards.',
      effect: { draw: 3 }
    },
    dark_embrace: {
      id: 'dark_embrace', name: 'Dark Embrace', type: SKILL, rarity: UNCOMMON,
      cost: 1, target: SELF, description: 'Gain 1 energy. Draw 1 card.',
      effect: { gainEnergy: 1, draw: 1 }
    },
    offering: {
      id: 'offering', name: 'Offering', type: SKILL, rarity: UNCOMMON,
      cost: 0, target: SELF, description: 'Lose 6 HP. Gain 2 energy. Draw 3 cards.',
      effect: { selfDamage: 6, gainEnergy: 2, draw: 3 }
    },

    // --- UNCOMMON POWERS ---
    inflame: {
      id: 'inflame', name: 'Inflame', type: POWER, rarity: UNCOMMON,
      cost: 1, target: SELF, description: 'Gain 2 Strength.',
      effect: { strength: 2 }
    },
    metallicize: {
      id: 'metallicize', name: 'Metallicize', type: POWER, rarity: UNCOMMON,
      cost: 1, target: SELF, description: 'At the end of each turn, gain 3 Block.',
      effect: { endTurnBlock: 3 }
    },

    // --- RARE ATTACKS ---
    bludgeon: {
      id: 'bludgeon', name: 'Bludgeon', type: ATTACK, rarity: RARE,
      cost: 3, target: SINGLE, description: 'Deal 32 damage.',
      effect: { damage: 32 }
    },
    reaper: {
      id: 'reaper', name: 'Reaper', type: ATTACK, rarity: RARE,
      cost: 2, target: ALL_ENEMIES, description: 'Deal 4 damage to ALL. Heal for unblocked damage dealt.',
      effect: { damage: 4, lifeSteal: true }
    },
    feed: {
      id: 'feed', name: 'Feed', type: ATTACK, rarity: RARE,
      cost: 1, target: SINGLE, description: 'Deal 10 damage. If this kills, gain 3 Max HP.',
      effect: { damage: 10, onKillMaxHP: 3 }
    },

    // --- RARE SKILLS/POWERS ---
    demon_form: {
      id: 'demon_form', name: 'Demon Form', type: POWER, rarity: RARE,
      cost: 3, target: SELF, description: 'At the start of each turn, gain 2 Strength.',
      effect: { turnStartStrength: 2 }
    },
    barricade: {
      id: 'barricade', name: 'Barricade', type: POWER, rarity: RARE,
      cost: 3, target: SELF, description: 'Block no longer expires at start of turn.',
      effect: { retainBlock: true }
    },
    exhume: {
      id: 'exhume', name: 'Exhume', type: SKILL, rarity: RARE,
      cost: 1, target: SELF, description: 'Put a card from exhaust pile into your hand.',
      effect: { retrieveExhaust: true }
    },

    // --- CURSES ---
    doubt: {
      id: 'doubt', name: 'Doubt', type: CURSE, rarity: COMMON,
      cost: -2, target: NONE, description: 'Unplayable. At end of turn, gain 1 Weak.',
      effect: { endTurnWeak: 1 }
    },
    decay: {
      id: 'decay', name: 'Decay', type: CURSE, rarity: COMMON,
      cost: -2, target: NONE, description: 'Unplayable. At end of turn, take 2 damage.',
      effect: { endTurnDamage: 2 }
    },
  };

  // Create a unique instance of a card definition
  let cardUid = 0;
  S.createCard = defId => {
    const def = S.CARD_DEFS[defId];
    if (!def) return null;
    return {
      ...def,
      uid: ++cardUid,
      effect: { ...def.effect },
      rampBonus: 0, // for Rampage
    };
  };

  // Build starter deck: 5 Strikes, 4 Defends, 1 Bash
  S.starterDeck = () => {
    const deck = [];
    for (let i = 0; i < 5; i++) deck.push(S.createCard('strike'));
    for (let i = 0; i < 4; i++) deck.push(S.createCard('defend'));
    deck.push(S.createCard('bash'));
    return deck;
  };

  // Get reward pool cards by rarity
  S.getRewardCards = (count, rarity) => {
    const pool = Object.values(S.CARD_DEFS).filter(c =>
      c.rarity === rarity && !c.starter && c.type !== CURSE
    );
    const result = [];
    const used = new Set();
    while (result.length < count && result.length < pool.length) {
      const idx = Math.floor(Math.random() * pool.length);
      if (!used.has(idx)) {
        used.add(idx);
        result.push(S.createCard(pool[idx].id));
      }
    }
    return result;
  };

  // Shuffle array in place
  S.shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Card type display info
  S.cardTypeColor = type => ({
    attack: '#c41e1e',
    defend: '#2563eb',
    skill: '#16a34a',
    power: '#9333ea',
    curse: '#4a4a4a',
  }[type] || '#666');

  S.cardTypeBg = type => ({
    attack: 'linear-gradient(135deg, #2a0a0a 0%, #1a0505 100%)',
    defend: 'linear-gradient(135deg, #0a1a2a 0%, #050f1a 100%)',
    skill: 'linear-gradient(135deg, #0a2a0a 0%, #051a05 100%)',
    power: 'linear-gradient(135deg, #1a0a2a 0%, #0f051a 100%)',
    curse: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
  }[type] || '#111');

  S.cardRarityColor = rarity => ({
    common: '#9ca3af',
    uncommon: '#3b82f6',
    rare: '#f59e0b',
  }[rarity] || '#666');
})();
