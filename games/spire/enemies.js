// enemies.js - Enemy definitions, intents, encounter pools
// Slay the Spire-lite card combat deckbuilder

(function() {
  const S = window.Spire;

  // Intent types
  const INTENT_ATTACK = 'attack', INTENT_DEFEND = 'defend', INTENT_BUFF = 'buff',
        INTENT_DEBUFF = 'debuff', INTENT_ATTACK_DEFEND = 'attack_defend',
        INTENT_ATTACK_DEBUFF = 'attack_debuff', INTENT_UNKNOWN = 'unknown';
  S.Intent = {
    ATTACK: INTENT_ATTACK, DEFEND: INTENT_DEFEND, BUFF: INTENT_BUFF,
    DEBUFF: INTENT_DEBUFF, ATTACK_DEFEND: INTENT_ATTACK_DEFEND,
    ATTACK_DEBUFF: INTENT_ATTACK_DEBUFF, UNKNOWN: INTENT_UNKNOWN
  };

  S.intentIcon = intent => ({
    attack: '\u2694',
    defend: '\u26E8',
    buff: '\u2B06',
    debuff: '\u2B07',
    attack_defend: '\u2694\u26E8',
    attack_debuff: '\u2694\u2B07',
    unknown: '?',
  }[intent] || '?');

  S.intentColor = intent => ({
    attack: '#ef4444',
    defend: '#60a5fa',
    buff: '#a855f7',
    debuff: '#f97316',
    attack_defend: '#ef4444',
    attack_debuff: '#ef4444',
    unknown: '#9ca3af',
  }[intent] || '#9ca3af');

  // Enemy definitions
  S.ENEMY_DEFS = {
    // --- ACT 1 ENEMIES ---
    cultist: {
      id: 'cultist', name: 'Cultist', hp: [48, 54],
      art: '\u2620',
      patterns: [
        { intent: INTENT_BUFF, effect: { selfStrength: 3 }, weight: 1, first: true },
        { intent: INTENT_ATTACK, effect: { damage: 6 }, weight: 3 },
      ]
    },
    jaw_worm: {
      id: 'jaw_worm', name: 'Jaw Worm', hp: [40, 46],
      art: '\uD83D\uDC1B',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 11 }, weight: 3 },
        { intent: INTENT_ATTACK_DEFEND, effect: { damage: 7, block: 5 }, weight: 2 },
        { intent: INTENT_BUFF, effect: { selfStrength: 3, block: 6 }, weight: 1 },
      ]
    },
    louse_red: {
      id: 'louse_red', name: 'Red Louse', hp: [10, 15],
      art: '\uD83D\uDD34',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 6 }, weight: 3 },
        { intent: INTENT_BUFF, effect: { selfStrength: 3 }, weight: 1 },
      ]
    },
    louse_green: {
      id: 'louse_green', name: 'Green Louse', hp: [11, 17],
      art: '\uD83D\uDFE2',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 6 }, weight: 3 },
        { intent: INTENT_DEBUFF, effect: { applyWeak: 2 }, weight: 1 },
      ]
    },
    slime_small: {
      id: 'slime_small', name: 'Acid Slime (S)', hp: [8, 12],
      art: '\uD83E\uDDEA',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 3 }, weight: 2 },
        { intent: INTENT_DEBUFF, effect: { applyWeak: 1 }, weight: 1 },
      ]
    },
    fungus: {
      id: 'fungus', name: 'Fungi Beast', hp: [22, 28],
      art: '\uD83C\uDF44',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 6 }, weight: 3 },
        { intent: INTENT_BUFF, effect: { selfStrength: 3 }, weight: 1 },
      ]
    },

    // --- ACT 1 ELITES ---
    gremlin_nob: {
      id: 'gremlin_nob', name: 'Gremlin Nob', hp: [82, 86],
      art: '\uD83D\uDC79',
      elite: true,
      patterns: [
        { intent: INTENT_BUFF, effect: { selfStrength: 2, enrage: true }, weight: 1, first: true },
        { intent: INTENT_ATTACK, effect: { damage: 14 }, weight: 2 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 8, applyVulnerable: 2 }, weight: 2 },
      ]
    },
    sentries: {
      id: 'sentries', name: 'Sentry', hp: [38, 42],
      art: '\uD83E\uDD16',
      elite: true,
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 9 }, weight: 2 },
        { intent: INTENT_DEBUFF, effect: { addCurse: 'decay' }, weight: 1 },
      ]
    },

    // --- ACT 1 BOSS ---
    slime_boss: {
      id: 'slime_boss', name: 'Slime Boss', hp: [140, 140],
      art: '\uD83E\uDDA0',
      boss: true,
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 35 }, weight: 1 },
        { intent: INTENT_DEBUFF, effect: { addCurse: 'doubt', applyFrail: 2 }, weight: 1 },
        { intent: INTENT_ATTACK_DEFEND, effect: { damage: 16, block: 12 }, weight: 2 },
      ]
    },

    // --- ACT 2 ENEMIES ---
    chosen: {
      id: 'chosen', name: 'Chosen', hp: [90, 96],
      art: '\u269B',
      patterns: [
        { intent: INTENT_DEBUFF, effect: { applyVulnerable: 2, applyWeak: 1 }, weight: 1, first: true },
        { intent: INTENT_ATTACK, effect: { damage: 12 }, weight: 3 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 10, applyVulnerable: 1 }, weight: 1 },
      ]
    },
    snecko: {
      id: 'snecko', name: 'Snecko', hp: [114, 120],
      art: '\uD83D\uDC0D',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 15 }, weight: 2 },
        { intent: INTENT_DEBUFF, effect: { applyWeak: 2, applyVulnerable: 1 }, weight: 1 },
        { intent: INTENT_BUFF, effect: { selfStrength: 2 }, weight: 1 },
      ]
    },
    mugger: {
      id: 'mugger', name: 'Mugger', hp: [48, 52],
      art: '\uD83D\uDDE1',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 10 }, weight: 2 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 8, stealGold: 15 }, weight: 1 },
      ]
    },
    shaman: {
      id: 'shaman', name: 'Shaman', hp: [50, 56],
      art: '\uD83E\uDDDE',
      patterns: [
        { intent: INTENT_BUFF, effect: { selfStrength: 2 }, weight: 1 },
        { intent: INTENT_ATTACK, effect: { damage: 8 }, weight: 2 },
        { intent: INTENT_DEBUFF, effect: { applyWeak: 2 }, weight: 1 },
      ]
    },

    // --- ACT 2 ELITES ---
    book_of_stabbing: {
      id: 'book_of_stabbing', name: 'Book of Stabbing', hp: [160, 168],
      art: '\uD83D\uDCD6',
      elite: true,
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 6, multiHit: 2 }, weight: 2, rampMultiHit: 1 },
        { intent: INTENT_ATTACK, effect: { damage: 21 }, weight: 1 },
      ]
    },
    taskmaster: {
      id: 'taskmaster', name: 'Taskmaster', hp: [120, 130],
      art: '\u2696',
      elite: true,
      patterns: [
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 14, addCurse: 'decay' }, weight: 2 },
        { intent: INTENT_ATTACK, effect: { damage: 7, multiHit: 3 }, weight: 1 },
      ]
    },

    // --- ACT 2 BOSS ---
    automaton: {
      id: 'automaton', name: 'Bronze Automaton', hp: [300, 300],
      art: '\u2699',
      boss: true,
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 7, multiHit: 2 }, weight: 2, rampMultiHit: 1 },
        { intent: INTENT_BUFF, effect: { selfStrength: 4 }, weight: 1 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 20, applyVulnerable: 2 }, weight: 1 },
      ]
    },

    // --- ACT 3 ENEMIES ---
    reptomancer: {
      id: 'reptomancer', name: 'Reptomancer', hp: [180, 190],
      art: '\uD83D\uDC09',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 16 }, weight: 2 },
        { intent: INTENT_BUFF, effect: { selfStrength: 3, summon: 'snake_dagger' }, weight: 1 },
        { intent: INTENT_ATTACK, effect: { damage: 10, multiHit: 2 }, weight: 1 },
      ]
    },
    writhing_mass: {
      id: 'writhing_mass', name: 'Writhing Mass', hp: [160, 170],
      art: '\uD83E\uDDA0',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 14 }, weight: 2 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 10, applyWeak: 2, applyVulnerable: 1 }, weight: 1 },
        { intent: INTENT_BUFF, effect: { selfStrength: 4, block: 15 }, weight: 1 },
      ]
    },
    darkling: {
      id: 'darkling', name: 'Darkling', hp: [48, 56],
      art: '\uD83C\uDF11',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 8 }, weight: 2 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 7, applyWeak: 1 }, weight: 1 },
      ]
    },

    // --- ACT 3 ELITES ---
    giant_head: {
      id: 'giant_head', name: 'Giant Head', hp: [500, 500],
      art: '\uD83D\uDDE3',
      elite: true,
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 13 }, weight: 2 },
        { intent: INTENT_BUFF, effect: { selfStrength: 3 }, weight: 1 },
        { intent: INTENT_ATTACK, effect: { damage: 40 }, weight: 1, afterTurn: 5 },
      ]
    },

    // --- ACT 3 BOSS ---
    time_eater: {
      id: 'time_eater', name: 'Time Eater', hp: [456, 456],
      art: '\u231B',
      boss: true,
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 26 }, weight: 2 },
        { intent: INTENT_DEBUFF, effect: { applyWeak: 2, applyVulnerable: 2 }, weight: 1 },
        { intent: INTENT_BUFF, effect: { selfStrength: 2, block: 20 }, weight: 1 },
        { intent: INTENT_ATTACK_DEBUFF, effect: { damage: 32, applyFrail: 2 }, weight: 1 },
      ]
    },

    // Helper minion
    snake_dagger: {
      id: 'snake_dagger', name: 'Dagger', hp: [20, 25],
      art: '\uD83D\uDDE1',
      patterns: [
        { intent: INTENT_ATTACK, effect: { damage: 9 }, weight: 1 },
      ]
    },
  };

  // Encounter pools per act
  S.ENCOUNTERS = {
    1: {
      normal: [
        ['cultist'],
        ['jaw_worm'],
        ['louse_red', 'louse_green'],
        ['slime_small', 'slime_small', 'slime_small'],
        ['fungus', 'louse_red'],
        ['jaw_worm', 'fungus'],
      ],
      elite: [
        ['gremlin_nob'],
        ['sentries', 'sentries'],
      ],
      boss: [['slime_boss']],
    },
    2: {
      normal: [
        ['chosen'],
        ['snecko'],
        ['mugger', 'mugger'],
        ['shaman', 'mugger'],
        ['chosen', 'shaman'],
      ],
      elite: [
        ['book_of_stabbing'],
        ['taskmaster'],
      ],
      boss: [['automaton']],
    },
    3: {
      normal: [
        ['reptomancer'],
        ['writhing_mass'],
        ['darkling', 'darkling', 'darkling'],
        ['writhing_mass', 'darkling'],
      ],
      elite: [
        ['giant_head'],
      ],
      boss: [['time_eater']],
    },
  };

  // Create an enemy instance from definition
  S.createEnemy = (defId, actScale) => {
    const def = S.ENEMY_DEFS[defId];
    if (!def) return null;
    const hpRange = def.hp;
    const hp = hpRange[0] + Math.floor(Math.random() * (hpRange[1] - hpRange[0] + 1));
    const scale = actScale || 1;
    return {
      id: def.id,
      name: def.name,
      art: def.art,
      maxHp: Math.round(hp * scale),
      hp: Math.round(hp * scale),
      block: 0,
      strength: 0,
      patterns: def.patterns.map(p => ({ ...p, effect: { ...p.effect } })),
      currentIntent: null,
      lastPatternIdx: -1,
      turnCount: 0,
      multiHitRamp: 0,
      boss: def.boss || false,
      elite: def.elite || false,
      // Status effects
      vulnerable: 0,
      weak: 0,
      frail: 0,
    };
  };

  // Pick next intent for an enemy
  S.pickIntent = enemy => {
    const available = enemy.patterns.filter(p => {
      if (p.first && enemy.turnCount > 0) return false;
      if (p.afterTurn && enemy.turnCount < p.afterTurn) return false;
      return true;
    });

    // Prefer first-turn patterns on turn 0
    const firstTurn = available.filter(p => p.first);
    if (enemy.turnCount === 0 && firstTurn.length > 0) {
      enemy.currentIntent = { ...firstTurn[0], effect: { ...firstTurn[0].effect } };
      // Apply multi-hit ramp
      if (firstTurn[0].rampMultiHit && enemy.multiHitRamp > 0) {
        enemy.currentIntent.effect.multiHit =
          (enemy.currentIntent.effect.multiHit || 1) + enemy.multiHitRamp;
      }
      return;
    }

    // Weighted random, avoid repeating same pattern twice
    const nonFirst = available.filter(p => !p.first);
    if (nonFirst.length === 0) {
      enemy.currentIntent = { intent: 'unknown', effect: {} };
      return;
    }

    let pool = nonFirst;
    // Avoid repeat if possible
    if (pool.length > 1 && enemy.lastPatternIdx >= 0) {
      pool = pool.filter((_, i) => i !== enemy.lastPatternIdx);
    }

    const totalWeight = pool.reduce((s, p) => s + (p.weight || 1), 0);
    let roll = Math.random() * totalWeight;
    for (let i = 0; i < pool.length; i++) {
      roll -= pool[i].weight || 1;
      if (roll <= 0) {
        enemy.lastPatternIdx = nonFirst.indexOf(pool[i]);
        enemy.currentIntent = { ...pool[i], effect: { ...pool[i].effect } };
        // Apply multi-hit ramp
        if (pool[i].rampMultiHit && enemy.multiHitRamp > 0) {
          enemy.currentIntent.effect.multiHit =
            (enemy.currentIntent.effect.multiHit || 1) + enemy.multiHitRamp;
        }
        return;
      }
    }
    // Fallback
    enemy.currentIntent = { ...pool[0], effect: { ...pool[0].effect } };
  };

  // Generate an encounter (array of enemy instances)
  S.generateEncounter = (act, type) => {
    const pools = S.ENCOUNTERS[act];
    if (!pools) return [];
    const pool = pools[type] || pools.normal;
    const group = pool[Math.floor(Math.random() * pool.length)];
    const scale = 1 + (act - 1) * 0.15;
    return group.map(id => S.createEnemy(id, scale));
  };
})();
