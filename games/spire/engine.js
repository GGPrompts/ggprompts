// engine.js - Game state machine, combat logic, turn management
// Slay the Spire-lite card combat deckbuilder

(function() {
  const S = window.Spire;

  // Game phases
  const PHASE_MENU = 'menu', PHASE_MAP = 'map', PHASE_COMBAT = 'combat',
        PHASE_REWARD = 'reward', PHASE_SHOP = 'shop', PHASE_REST = 'rest',
        PHASE_EVENT = 'event', PHASE_CARD_REMOVE = 'card_remove',
        PHASE_GAME_OVER = 'game_over', PHASE_WIN = 'win',
        PHASE_TREASURE = 'treasure';
  S.Phase = {
    MENU: PHASE_MENU, MAP: PHASE_MAP, COMBAT: PHASE_COMBAT,
    REWARD: PHASE_REWARD, SHOP: PHASE_SHOP, REST: PHASE_REST,
    EVENT: PHASE_EVENT, CARD_REMOVE: PHASE_CARD_REMOVE,
    GAME_OVER: PHASE_GAME_OVER, WIN: PHASE_WIN, TREASURE: PHASE_TREASURE
  };

  const BASE_ENERGY = 3;
  const HAND_SIZE = 5;
  const BASE_HP = 80;
  const BASE_MAX_HP = 80;

  S.newGame = () => {
    const state = {
      phase: PHASE_MAP,
      act: 1,
      floor: 0,
      gold: 99,
      score: 0,
      player: {
        hp: BASE_HP,
        maxHp: BASE_MAX_HP,
        block: 0,
        strength: 0,
        dexterity: 0,
        vulnerable: 0,
        weak: 0,
        frail: 0,
        thorns: 0,
        // Power buffs
        endTurnBlock: 0,
        turnStartStrength: 0,
        retainBlock: false,
        tempStrength: 0,
      },
      energy: BASE_ENERGY,
      maxEnergy: BASE_ENERGY,
      // Deck
      fullDeck: S.starterDeck(),
      drawPile: [],
      hand: [],
      discardPile: [],
      exhaustPile: [],
      // Map
      currentMap: S.generateMap(1),
      currentNodeId: null,
      // Combat
      enemies: [],
      turn: 0,
      combatLog: [],
      // Relics
      relics: [S.starterRelic()],
      // Rewards
      pendingRewards: null,
      cardRewards: null,
      // Event
      currentEvent: null,
      // Shop
      shopItems: null,
      // Card selection for targeting
      selectedCard: null,
      selectedTarget: null,
      // Animation state
      animations: [],
      bonusDraws: 0,
      penNibActive: false,
      attacksPlayed: 0,
    };

    S.state = state;
    return state;
  };

  // --- MAP NAVIGATION ---
  S.selectNode = nodeId => {
    const state = S.state;
    if (state.phase !== PHASE_MAP) return;

    const accessible = S.getAccessibleNodes(state.currentMap, state.currentNodeId);
    if (!accessible.includes(nodeId)) return;

    const node = S.getNode(state.currentMap, nodeId);
    if (!node) return;

    node.visited = true;
    state.currentNodeId = nodeId;
    state.floor++;

    switch (node.type) {
      case 'combat':
      case 'elite':
        S.startCombat(node.type);
        break;
      case 'boss':
        S.startCombat('boss');
        break;
      case 'rest':
        state.phase = PHASE_REST;
        break;
      case 'shop':
        S.enterShop();
        break;
      case 'treasure':
        S.openTreasure();
        break;
      case 'event':
        state.currentEvent = S.getRandomEvent();
        state.phase = PHASE_EVENT;
        break;
    }
  };

  // --- COMBAT ---
  S.startCombat = type => {
    const state = S.state;
    state.phase = PHASE_COMBAT;
    state.enemies = S.generateEncounter(state.act, type);
    state.turn = 0;
    state.combatLog = [];
    state.attacksPlayed = 0;
    state.exhaustPile = [];

    // Reset player combat state
    state.player.block = 0;
    state.player.strength = 0;
    state.player.dexterity = 0;
    state.player.vulnerable = 0;
    state.player.weak = 0;
    state.player.frail = 0;
    state.player.thorns = 0;
    state.player.endTurnBlock = 0;
    state.player.turnStartStrength = 0;
    state.player.retainBlock = false;
    state.player.tempStrength = 0;

    // Reset relic counters
    for (const r of state.relics) r.counter = 0;

    // Apply combat-start relics
    const relicResults = S.applyRelics('combat_start', state);
    relicResults.forEach(msg => state.combatLog.push(msg));

    // Shuffle deck into draw pile
    state.drawPile = state.fullDeck.map(c => S.createCard(c.id));
    S.shuffle(state.drawPile);
    state.hand = [];
    state.discardPile = [];

    // Pick intents for all enemies
    state.enemies.forEach(e => S.pickIntent(e));

    // Start first turn
    S.startPlayerTurn();
  };

  S.startPlayerTurn = () => {
    const state = S.state;
    state.turn++;

    // Reset block (unless Barricade)
    if (!state.player.retainBlock) {
      state.player.block = 0;
    }

    // Apply turn-start strength (Demon Form)
    if (state.player.turnStartStrength > 0) {
      state.player.strength += state.player.turnStartStrength;
      state.combatLog.push('Gained ' + state.player.turnStartStrength + ' Strength (Demon Form)');
    }

    // Reset energy
    state.energy = state.maxEnergy;

    // First turn relic
    if (state.turn === 1) {
      const relicResults = S.applyRelics('first_turn', state);
      relicResults.forEach(msg => state.combatLog.push(msg));
    }

    // Draw cards
    const drawCount = HAND_SIZE + (state.bonusDraws || 0);
    state.bonusDraws = 0;
    S.drawCards(drawCount);
  };

  S.drawCards = count => {
    const state = S.state;
    for (let i = 0; i < count; i++) {
      if (state.drawPile.length === 0) {
        if (state.discardPile.length === 0) break;
        state.drawPile = S.shuffle([...state.discardPile]);
        state.discardPile = [];
      }
      if (state.drawPile.length > 0) {
        state.hand.push(state.drawPile.pop());
      }
    }
  };

  // --- PLAY A CARD ---
  S.selectCard = cardUid => {
    const state = S.state;
    if (state.phase !== PHASE_COMBAT) return;

    const card = state.hand.find(c => c.uid === cardUid);
    if (!card) return;

    // Check energy
    const cost = S.getCardCost(card);
    if (cost > state.energy && cost >= 0) return;
    if (card.type === 'curse') return; // Can't play curses

    if (card.target === 'single' && state.enemies.filter(e => e.hp > 0).length > 1) {
      // Need to pick a target
      state.selectedCard = card;
      return;
    }

    // Auto-target: single enemy or self
    if (card.target === 'single') {
      const target = state.enemies.find(e => e.hp > 0);
      if (target) S.playCard(card, state.enemies.indexOf(target));
    } else {
      S.playCard(card, -1);
    }
  };

  S.selectTarget = enemyIdx => {
    const state = S.state;
    if (!state.selectedCard) return;
    S.playCard(state.selectedCard, enemyIdx);
    state.selectedCard = null;
  };

  S.getCardCost = card => {
    if (card.cost === -1) return 0; // X-cost cards are free to play, use all energy
    return card.cost;
  };

  S.playCard = (card, targetIdx) => {
    const state = S.state;
    const fx = card.effect;
    const cost = card.cost === -1 ? state.energy : card.cost;

    if (cost > state.energy) return;
    state.energy -= cost;

    // Remove from hand
    state.hand = state.hand.filter(c => c.uid !== card.uid);

    const player = state.player;
    const log = state.combatLog;

    // Track attacks for relics
    let relicBonus = { doubleDamage: false, bonusBlock: 0 };
    if (card.type === 'attack') {
      state.attacksPlayed++;
      relicBonus = S.checkAttackRelics(state);
    }

    // --- DAMAGE ---
    let baseDmg = fx.damage || 0;
    if (fx.damageFromBlock) baseDmg = player.block;
    if (fx.rampUp) {
      baseDmg += (card.rampBonus || 0);
      card.rampBonus = (card.rampBonus || 0) + fx.rampUp;
    }

    // Strength
    baseDmg += player.strength;
    if (player.tempStrength > 0) baseDmg += player.tempStrength;

    // Weak debuff: 25% less damage
    if (player.weak > 0) baseDmg = Math.floor(baseDmg * 0.75);

    // Relic double damage
    if (relicBonus.doubleDamage) {
      baseDmg *= 2;
      log.push('Pen Nib: double damage!');
      state.penNibActive = true;
    }

    // Apply damage
    if (baseDmg > 0) {
      const hits = fx.hitsFromEnergy ? (cost + 1) : (fx.hits || fx.multiHit || 1);
      if (card.target === 'all') {
        for (let h = 0; h < hits; h++) {
          state.enemies.forEach(e => {
            if (e.hp > 0) S.dealDamageToEnemy(e, baseDmg, player, log);
          });
        }
      } else if (targetIdx >= 0) {
        const target = state.enemies[targetIdx];
        if (target && target.hp > 0) {
          for (let h = 0; h < hits; h++) {
            S.dealDamageToEnemy(target, baseDmg, player, log);
          }
          // Feed: on kill max HP
          if (fx.onKillMaxHP && target.hp <= 0) {
            player.maxHp += fx.onKillMaxHP;
            player.hp += fx.onKillMaxHP;
            log.push('Feed: +' + fx.onKillMaxHP + ' Max HP!');
          }
        }
      }
    }

    // Life steal (Reaper)
    if (fx.lifeSteal && baseDmg > 0) {
      let totalHealed = 0;
      state.enemies.forEach(e => {
        // already dealt damage above, estimate unblocked
        totalHealed += Math.min(baseDmg, 4); // simplified
      });
      player.hp = Math.min(player.maxHp, player.hp + totalHealed);
      log.push('Reaper healed ' + totalHealed + ' HP');
    }

    // --- BLOCK ---
    let blockGain = fx.block || 0;
    blockGain += player.dexterity;
    if (player.frail > 0) blockGain = Math.floor(blockGain * 0.75);
    if (blockGain > 0) {
      player.block += blockGain;
      log.push('Gained ' + blockGain + ' Block');
    }

    // Relic bonus block (Ornamental Fan)
    if (relicBonus.bonusBlock > 0) {
      player.block += relicBonus.bonusBlock;
      log.push('Ornamental Fan: +' + relicBonus.bonusBlock + ' Block');
    }

    // --- DEBUFFS ON ENEMIES ---
    if (fx.applyVulnerable) {
      const targets = card.target === 'all' ? state.enemies.filter(e => e.hp > 0) : [state.enemies[targetIdx]].filter(Boolean);
      targets.forEach(e => { e.vulnerable += fx.applyVulnerable; });
      log.push('Applied ' + fx.applyVulnerable + ' Vulnerable');
    }
    if (fx.applyWeak) {
      const targets = card.target === 'all' ? state.enemies.filter(e => e.hp > 0) : [state.enemies[targetIdx]].filter(Boolean);
      targets.forEach(e => { e.weak += fx.applyWeak; });
      log.push('Applied ' + fx.applyWeak + ' Weak');
    }

    // --- SELF EFFECTS ---
    if (fx.draw) S.drawCards(fx.draw);
    if (fx.gainEnergy) state.energy += fx.gainEnergy;
    if (fx.heal) { player.hp = Math.min(player.maxHp, player.hp + fx.heal); log.push('Healed ' + fx.heal + ' HP'); }
    if (fx.selfDamage) { player.hp -= fx.selfDamage; log.push('Lost ' + fx.selfDamage + ' HP'); }
    if (fx.tempStrength) { player.tempStrength += fx.tempStrength; log.push('+' + fx.tempStrength + ' Strength this turn'); }
    if (fx.thorns) { player.thorns += fx.thorns; log.push('Flame Barrier: ' + fx.thorns + ' thorns'); }
    if (fx.copyToDiscard) { state.discardPile.push(S.createCard(card.id)); log.push('Added copy to discard'); }
    if (fx.nextTurnStrength) { /* tracked for next turn */ state._pendingStrength = (state._pendingStrength || 0) + fx.nextTurnStrength; }

    // --- POWER EFFECTS ---
    if (fx.strength) { player.strength += fx.strength; log.push('+' + fx.strength + ' Strength'); }
    if (fx.endTurnBlock) { player.endTurnBlock += fx.endTurnBlock; log.push('Metallicize: +' + fx.endTurnBlock + ' Block each turn'); }
    if (fx.turnStartStrength) { player.turnStartStrength += fx.turnStartStrength; log.push('Demon Form: +' + fx.turnStartStrength + ' Strength each turn'); }
    if (fx.retainBlock) { player.retainBlock = true; log.push('Barricade: Block retained!'); }
    if (fx.retrieveExhaust && state.exhaustPile.length > 0) {
      const retrieved = state.exhaustPile.pop();
      state.hand.push(retrieved);
      log.push('Retrieved ' + retrieved.name + ' from exhaust');
    }

    // Discard played card (powers exhaust instead)
    if (card.type === 'power') {
      state.exhaustPile.push(card);
    } else {
      state.discardPile.push(card);
    }

    state.selectedCard = null;
    state.penNibActive = false;

    // Check victory
    if (state.enemies.every(e => e.hp <= 0)) {
      S.endCombat(true);
    }

    // Check player death
    if (player.hp <= 0) {
      state.phase = PHASE_GAME_OVER;
    }
  };

  S.dealDamageToEnemy = (enemy, dmg, player, log) => {
    // Vulnerable: 50% more damage
    if (enemy.vulnerable > 0) dmg = Math.floor(dmg * 1.5);

    let actual = dmg;
    if (enemy.block > 0) {
      const blocked = Math.min(enemy.block, actual);
      enemy.block -= blocked;
      actual -= blocked;
    }
    enemy.hp -= actual;
    if (enemy.hp < 0) enemy.hp = 0;
    log.push('Dealt ' + actual + ' damage to ' + enemy.name + (enemy.block > 0 ? ' (' + enemy.block + ' block left)' : ''));
  };

  // --- END TURN ---
  S.endTurn = () => {
    const state = S.state;
    if (state.phase !== PHASE_COMBAT) return;

    // End-of-turn effects
    const player = state.player;

    // Metallicize
    if (player.endTurnBlock > 0) {
      player.block += player.endTurnBlock;
      state.combatLog.push('Metallicize: +' + player.endTurnBlock + ' Block');
    }

    // Curse effects
    state.hand.forEach(card => {
      if (card.type === 'curse') {
        if (card.effect.endTurnWeak) { player.weak += card.effect.endTurnWeak; }
        if (card.effect.endTurnDamage) { player.hp -= card.effect.endTurnDamage; state.combatLog.push(card.name + ': took ' + card.effect.endTurnDamage + ' damage'); }
      }
    });

    // Remove temp strength
    if (player.tempStrength > 0) {
      player.tempStrength = 0;
    }

    // Apply pending strength from Parry
    if (state._pendingStrength) {
      player.strength += state._pendingStrength;
      state.combatLog.push('+' + state._pendingStrength + ' Strength (Parry)');
      state._pendingStrength = 0;
    }

    // Discard hand
    state.discardPile.push(...state.hand);
    state.hand = [];

    // Enemy turns
    S.executeEnemyTurns();

    // Decrement player debuffs
    if (player.vulnerable > 0) player.vulnerable--;
    if (player.weak > 0) player.weak--;
    if (player.frail > 0) player.frail--;

    // Check player death
    if (player.hp <= 0) {
      state.phase = PHASE_GAME_OVER;
      return;
    }

    // Check if all enemies dead (from thorns etc)
    if (state.enemies.every(e => e.hp <= 0)) {
      S.endCombat(true);
      return;
    }

    // Next turn
    S.startPlayerTurn();
  };

  S.executeEnemyTurns = () => {
    const state = S.state;
    const player = state.player;

    state.enemies.forEach(enemy => {
      if (enemy.hp <= 0) return;

      // Reset enemy block
      enemy.block = 0;

      const intent = enemy.currentIntent;
      if (!intent) return;
      const fx = intent.effect;

      // Apply enemy action
      if (fx.damage) {
        let dmg = fx.damage + enemy.strength;
        if (enemy.weak > 0) dmg = Math.floor(dmg * 0.75);
        const hits = fx.multiHit || 1;
        for (let h = 0; h < hits; h++) {
          // Vulnerable on player
          let finalDmg = dmg;
          if (player.vulnerable > 0) finalDmg = Math.floor(finalDmg * 1.5);

          let actual = finalDmg;
          if (player.block > 0) {
            const blocked = Math.min(player.block, actual);
            player.block -= blocked;
            actual -= blocked;
          }
          player.hp -= actual;
          state.combatLog.push(enemy.name + ' dealt ' + actual + ' damage' + (hits > 1 ? ' (hit ' + (h + 1) + '/' + hits + ')' : ''));

          // Thorns (Flame Barrier)
          if (player.thorns > 0 && actual > 0) {
            enemy.hp -= player.thorns;
            state.combatLog.push('Thorns dealt ' + player.thorns + ' to ' + enemy.name);
          }
        }
      }

      if (fx.block) {
        enemy.block += fx.block;
      }

      if (fx.selfStrength) {
        enemy.strength += fx.selfStrength;
        state.combatLog.push(enemy.name + ' gained ' + fx.selfStrength + ' Strength');
      }

      if (fx.applyWeak) {
        player.weak += fx.applyWeak;
        state.combatLog.push(enemy.name + ' applied ' + fx.applyWeak + ' Weak');
      }
      if (fx.applyVulnerable) {
        player.vulnerable += fx.applyVulnerable;
        state.combatLog.push(enemy.name + ' applied ' + fx.applyVulnerable + ' Vulnerable');
      }
      if (fx.applyFrail) {
        player.frail += fx.applyFrail;
        state.combatLog.push(enemy.name + ' applied ' + fx.applyFrail + ' Frail');
      }
      if (fx.addCurse) {
        const curse = S.createCard(fx.addCurse);
        if (curse) {
          state.discardPile.push(curse);
          state.combatLog.push(enemy.name + ' added ' + curse.name + ' to your deck');
        }
      }
      if (fx.stealGold) {
        const stolen = Math.min(state.gold, fx.stealGold);
        state.gold -= stolen;
        state.combatLog.push(enemy.name + ' stole ' + stolen + ' gold!');
      }

      // Decrement enemy debuffs
      if (enemy.vulnerable > 0) enemy.vulnerable--;
      if (enemy.weak > 0) enemy.weak--;

      // Track ramp for multi-hit enemies
      if (intent.rampMultiHit) {
        enemy.multiHitRamp += intent.rampMultiHit;
      }

      enemy.turnCount++;

      // Pick next intent
      S.pickIntent(enemy);
    });
  };

  S.endCombat = won => {
    const state = S.state;
    if (!won) { state.phase = PHASE_GAME_OVER; return; }

    // Clear combat state
    state.player.thorns = 0;

    // Apply end-of-combat relics
    const relicResults = S.applyRelics('combat_end', state);
    relicResults.forEach(msg => state.combatLog.push(msg));

    // Award gold
    const isElite = state.enemies.some(e => e.elite);
    const isBoss = state.enemies.some(e => e.boss);
    let goldReward = 10 + Math.floor(Math.random() * 10);
    if (isElite) goldReward += 15;
    if (isBoss) goldReward += 50;
    state.gold += goldReward;
    state.score += goldReward;

    // Generate rewards
    const rewards = { gold: goldReward, cards: [], relic: null, potion: null };

    // Card rewards: 3 cards, rarity based on fight type
    const rarity = isBoss ? 'rare' : (isElite ? 'uncommon' : 'common');
    rewards.cards = S.getRewardCards(3, rarity);
    // Mix in some uncommons for normal fights
    if (rarity === 'common' && Math.random() < 0.4) {
      rewards.cards[2] = S.getRewardCards(1, 'uncommon')[0] || rewards.cards[2];
    }

    // Elite/boss relic
    if (isElite || isBoss) {
      const ownedIds = state.relics.map(r => r.id);
      rewards.relic = S.getRandomRelic(ownedIds);
    }

    state.pendingRewards = rewards;
    state.cardRewards = rewards.cards;
    state.phase = PHASE_REWARD;

    // Boss: advance act
    if (isBoss && state.act < 3) {
      state._advanceAct = true;
    } else if (isBoss && state.act >= 3) {
      state.phase = PHASE_WIN;
    }
  };

  // --- REWARDS ---
  S.pickCardReward = cardUid => {
    const state = S.state;
    if (!state.cardRewards) return;
    const card = state.cardRewards.find(c => c.uid === cardUid);
    if (!card) return;
    state.fullDeck.push(card);
    state.cardRewards = null;
  };

  S.skipCardReward = () => {
    const state = S.state;
    state.cardRewards = null;
  };

  S.claimRelic = () => {
    const state = S.state;
    if (!state.pendingRewards || !state.pendingRewards.relic) return;
    state.relics.push(state.pendingRewards.relic);
    state.pendingRewards.relic = null;
  };

  S.proceedFromReward = () => {
    const state = S.state;
    state.pendingRewards = null;
    state.cardRewards = null;

    if (state._advanceAct) {
      state.act++;
      state.currentMap = S.generateMap(state.act);
      state.currentNodeId = null;
      state._advanceAct = false;
    }

    state.phase = PHASE_MAP;
  };

  // --- REST SITE ---
  S.restHeal = () => {
    const state = S.state;
    const healAmount = Math.floor(state.player.maxHp * 0.3);
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
    S.applyRelics('rest', state);
    state.phase = PHASE_MAP;
  };

  S.restUpgrade = () => {
    // Simplified: just go to map (upgrade system not implemented for MVP)
    const state = S.state;
    state.phase = PHASE_MAP;
  };

  S.restSmith = () => {
    // Remove a card from deck
    const state = S.state;
    state.phase = PHASE_CARD_REMOVE;
  };

  S.removeCard = cardUid => {
    const state = S.state;
    state.fullDeck = state.fullDeck.filter(c => c.uid !== cardUid);
    state.phase = PHASE_MAP;
  };

  // --- SHOP ---
  S.enterShop = () => {
    const state = S.state;
    const items = {
      cards: [],
      relics: [],
      removeCardCost: 50 + (state.act - 1) * 25,
    };

    // 5 cards for sale
    const pool = [
      ...S.getRewardCards(2, 'common'),
      ...S.getRewardCards(2, 'uncommon'),
      ...S.getRewardCards(1, 'rare'),
    ];
    pool.forEach(c => {
      const baseCost = { common: 50, uncommon: 75, rare: 150 }[c.rarity] || 50;
      c.shopCost = baseCost + Math.floor(Math.random() * 20) - 10;
    });
    items.cards = pool;

    // 1-2 relics
    const ownedIds = state.relics.map(r => r.id);
    for (let i = 0; i < 2; i++) {
      const r = S.getRandomRelic(ownedIds);
      if (r) {
        r.shopCost = { common: 150, uncommon: 250 }[r.rarity] || 200;
        items.relics.push(r);
        ownedIds.push(r.id);
      }
    }

    state.shopItems = items;
    state.phase = PHASE_SHOP;
  };

  S.buyShopCard = cardUid => {
    const state = S.state;
    if (!state.shopItems) return false;
    const idx = state.shopItems.cards.findIndex(c => c.uid === cardUid);
    if (idx === -1) return false;
    const card = state.shopItems.cards[idx];
    if (state.gold < card.shopCost) return false;
    state.gold -= card.shopCost;
    state.fullDeck.push(card);
    state.shopItems.cards.splice(idx, 1);
    return true;
  };

  S.buyShopRelic = relicId => {
    const state = S.state;
    if (!state.shopItems) return false;
    const idx = state.shopItems.relics.findIndex(r => r.id === relicId);
    if (idx === -1) return false;
    const relic = state.shopItems.relics[idx];
    if (state.gold < relic.shopCost) return false;
    state.gold -= relic.shopCost;
    state.relics.push(relic);
    state.shopItems.relics.splice(idx, 1);
    return true;
  };

  S.shopRemoveCard = cardUid => {
    const state = S.state;
    if (!state.shopItems) return false;
    if (state.gold < state.shopItems.removeCardCost) return false;
    const idx = state.fullDeck.findIndex(c => c.uid === cardUid);
    if (idx === -1) return false;
    state.gold -= state.shopItems.removeCardCost;
    state.fullDeck.splice(idx, 1);
    return true;
  };

  S.leaveShop = () => {
    const state = S.state;
    state.shopItems = null;
    state.phase = PHASE_MAP;
  };

  // --- TREASURE ---
  S.openTreasure = () => {
    const state = S.state;
    const goldAmount = 50 + Math.floor(Math.random() * 50);
    state.gold += goldAmount;
    state.pendingRewards = { gold: goldAmount, relic: null };

    // 50% chance for a relic
    if (Math.random() < 0.5) {
      const ownedIds = state.relics.map(r => r.id);
      state.pendingRewards.relic = S.getRandomRelic(ownedIds);
    }

    state.phase = PHASE_TREASURE;
  };

  // --- EVENT ---
  S.chooseEventOption = choiceIdx => {
    const state = S.state;
    if (!state.currentEvent) return;
    const choice = state.currentEvent.choices[choiceIdx];
    if (!choice) return;
    const fx = choice.effect;

    if (fx.damage) state.player.hp -= fx.damage;
    if (fx.gold) state.gold += fx.gold;
    if (fx.cost && state.gold >= fx.cost) state.gold -= fx.cost;
    if (fx.maxHp) { state.player.maxHp += fx.maxHp; state.player.hp += fx.maxHp; }
    if (fx.fullHeal) state.player.hp = state.player.maxHp;
    if (fx.relic) {
      const ownedIds = state.relics.map(r => r.id);
      const r = S.getRandomRelic(ownedIds);
      if (r) state.relics.push(r);
    }
    if (fx.curse) {
      const curse = S.createCard('doubt');
      if (curse) state.fullDeck.push(curse);
    }
    if (fx.removeCard && state.fullDeck.length > 0) {
      state.phase = PHASE_CARD_REMOVE;
      state.currentEvent = null;
      return;
    }

    if (state.player.hp <= 0) {
      state.phase = PHASE_GAME_OVER;
    } else {
      state.phase = PHASE_MAP;
    }
    state.currentEvent = null;
  };

  // --- SAVE / LOAD ---
  S.saveGame = () => {
    try {
      localStorage.setItem('spire_save', JSON.stringify({
        act: S.state.act,
        floor: S.state.floor,
        gold: S.state.gold,
        score: S.state.score,
        player: S.state.player,
        fullDeck: S.state.fullDeck.map(c => c.id),
        relics: S.state.relics.map(r => r.id),
        currentNodeId: S.state.currentNodeId,
        phase: S.state.phase,
      }));
    } catch (e) { /* ignore */ }
  };

  S.hasSave = () => {
    try { return !!localStorage.getItem('spire_save'); } catch (e) { return false; }
  };

  S.deleteSave = () => {
    try { localStorage.removeItem('spire_save'); } catch (e) { /* ignore */ }
  };
})();
