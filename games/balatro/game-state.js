// game-state.js - Round state machine, game phases, save/load
// Ported from TUIClassics/games/balatro/round.go + model.go

(function() {
  const B = window.Balatro;

  // Game phases
  const PHASE_MENU=0, PHASE_SELECT_CARDS=1, PHASE_SCORING=2,
        PHASE_BLIND_COMPLETE=3, PHASE_SHOP=4, PHASE_GAME_OVER=5, PHASE_WIN=6;
  B.Phase = { MENU: PHASE_MENU, SELECT_CARDS: PHASE_SELECT_CARDS, SCORING: PHASE_SCORING,
              BLIND_COMPLETE: PHASE_BLIND_COMPLETE, SHOP: PHASE_SHOP, GAME_OVER: PHASE_GAME_OVER, WIN: PHASE_WIN };

  // Sort modes
  const SORT_NONE=0, SORT_SUIT=1, SORT_RANK=2;
  B.SortMode = { NONE: SORT_NONE, SUIT: SORT_SUIT, RANK: SORT_RANK };

  const STARTING_HANDS = 4;
  const STARTING_DISCARDS = 3;
  const STARTING_MONEY = 4;
  const HAND_SIZE = 8;
  let MAX_JOKERS = 5;
  const MAX_PLAY = 5;
  const MAX_ANTE = 8; // Win condition
  let MAX_CONSUMABLES = 2;

  B.MAX_JOKERS = MAX_JOKERS;
  B.MAX_PLAY = MAX_PLAY;
  B.HAND_SIZE = HAND_SIZE;
  B.MAX_CONSUMABLES = MAX_CONSUMABLES;

  // Get effective max jokers (accounting for vouchers)
  B.getMaxJokers = () => {
    const state = B.gameState;
    let max = 5;
    if (state && state.ownedVouchers && state.ownedVouchers.includes('blank')) max++;
    return max;
  };

  // Get effective max consumables (accounting for vouchers)
  B.getMaxConsumables = () => {
    const state = B.gameState;
    let max = 2;
    if (state && state.ownedVouchers && state.ownedVouchers.includes('crystal_ball')) max++;
    return max;
  };

  // Run statistics tracking
  B.runStats = {
    handsPlayed: 0,
    totalChipsEarned: 0,
    bestHandScore: 0,
    bestHandType: null,
    blindsCleared: 0,
    moneyEarned: 0,
    moneySpent: 0,
    jokersAcquired: 0,
    consumablesUsed: 0,
  };

  B.newGame = () => {
    const deck = B.shuffle(B.newDeck());
    const hand = deck.splice(0, HAND_SIZE);
    const starterJoker = B.getJokerById('joker_basic');

    // Reset hand levels
    B.handLevels = [1,1,1,1,1,1,1,1,1,1];

    // Reset run stats
    B.runStats = {
      handsPlayed: 0,
      totalChipsEarned: 0,
      bestHandScore: 0,
      bestHandType: null,
      blindsCleared: 0,
      moneyEarned: 0,
      moneySpent: 0,
      jokersAcquired: 1,
      consumablesUsed: 0,
    };

    const state = {
      phase: PHASE_SELECT_CARDS,
      deck,
      discardPile: [], // discard pile for recycling
      hand,
      playedCards: [],
      jokers: starterJoker ? [starterJoker] : [],
      consumables: [], // tarot/planet cards held
      ownedVouchers: [],
      roundState: {
        ante: 1,
        blindProgress: 0, // 0=small, 1=big, 2=boss
        currentScore: 0,
        handsRemaining: STARTING_HANDS,
        discardsRemaining: STARTING_DISCARDS,
        money: STARTING_MONEY,
      },
      sortMode: SORT_RANK,
      currentHandInfo: null,
      lastScore: null,
      handTypesPlayed: [], // for boss blind "no repeat" tracking
      firstHandType: null, // for boss blind "one hand type" tracking
      bossHandSizeReduction: 0,
    };

    state.roundState.currentBlind = B.getBlind(1, B.BlindType.SMALL);
    state.roundState.targetScore = state.roundState.currentBlind.targetScore;

    // Sort initial hand
    state.hand = B.sortByRank(state.hand);

    B.gameState = state;
    return state;
  };

  B.getEffectiveHandSize = () => {
    const state = B.gameState;
    let size = HAND_SIZE;
    if (state && state.bossHandSizeReduction) size -= state.bossHandSizeReduction;
    return Math.max(size, 1);
  };

  // Helper: draw cards from deck, reshuffling discard pile if needed
  B.drawCards = (state, count) => {
    const drawn = [];
    for (let i = 0; i < count; i++) {
      if (state.deck.length === 0) {
        // Reshuffle discard pile into draw pile
        if (state.discardPile && state.discardPile.length > 0) {
          state.deck = B.shuffle([...state.discardPile]);
          // Clear enhancements/flags from recycled cards
          state.deck.forEach(c => {
            c.selected = false;
            c.faceDown = false;
            c.debuffed = false;
          });
          state.discardPile = [];
        } else {
          break; // No cards left at all
        }
      }
      drawn.push(state.deck.pop());
    }
    return drawn;
  };

  B.toggleCardSelection = index => {
    const state = B.gameState;
    if (!state || state.phase !== PHASE_SELECT_CARDS) return;
    const card = state.hand[index];
    if (!card) return;

    if (card.selected) {
      card.selected = false;
    } else {
      // Count currently selected
      const selectedCount = state.hand.filter(c => c.selected).length;
      if (selectedCount >= MAX_PLAY) return; // Can't select more than 5
      card.selected = true;
    }
    B.updateCurrentHandInfo();
  };

  B.updateCurrentHandInfo = () => {
    const state = B.gameState;
    const selected = state.hand.filter(c => c.selected);
    if (selected.length === 0) {
      state.currentHandInfo = null;
    } else if (selected.length === 5) {
      state.currentHandInfo = B.evaluateHand(selected);
    } else {
      // With Four Fingers, 4-card flushes/straights are valid
      state.currentHandInfo = B.evaluatePartialHand(selected);
    }
  };

  B.playHand = () => {
    const state = B.gameState;
    if (!state || state.phase !== PHASE_SELECT_CARDS) return null;

    let selected = state.hand.filter(c => c.selected);
    if (selected.length === 0) return null;
    if (state.roundState.handsRemaining <= 0) return null;

    // If < 5 cards selected, just play what's selected
    // Evaluate the hand
    let handInfo;
    if (selected.length === 5) {
      handInfo = B.evaluateHand(selected);
    } else {
      handInfo = B.evaluatePartialHand(selected);
    }

    // Boss blind: no repeat hands check
    const blind = state.roundState.currentBlind;
    if (blind.bossEffect) {
      if (blind.bossEffect.effect === 'noRepeatHands' && state.handTypesPlayed.includes(handInfo.type)) {
        return { error: 'Cannot repeat hand types against ' + blind.name };
      }
      if (blind.bossEffect.effect === 'oneHandType' && state.firstHandType !== null && handInfo.type !== state.firstHandType) {
        return { error: 'Can only play ' + B.handTypeName(state.firstHandType) + ' against ' + blind.name };
      }
      if (blind.bossEffect.effect === 'oneHand' && state.roundState.handsRemaining < STARTING_HANDS) {
        return { error: 'Only 1 hand allowed against ' + blind.name };
      }
    }

    // Track hand types for boss blinds
    if (!state.handTypesPlayed.includes(handInfo.type)) {
      state.handTypesPlayed.push(handInfo.type);
    }
    if (state.firstHandType === null) {
      state.firstHandType = handInfo.type;
    }

    // Calculate score
    const scoreCalc = B.calculateScore(handInfo, selected, state.jokers);

    // Filter out debuffed cards from scoring (they contribute 0)
    const scoringCards = selected.filter(c => !c.debuffed);

    // Remove played cards from hand, put them in discard pile
    const selectedIds = new Set(selected.map(c => c.id));
    const removedCards = state.hand.filter(c => selectedIds.has(c.id));
    state.hand = state.hand.filter(c => !selectedIds.has(c.id));

    // Apply glass destruction (glass cards are destroyed, not discarded)
    const glassDestroyed = new Set();
    for (const c of removedCards) {
      if (c.enhancement === B.Enhancement.GLASS) {
        glassDestroyed.add(c.id);
      }
    }
    // Non-glass played cards go to discard pile
    if (!state.discardPile) state.discardPile = [];
    for (const c of removedCards) {
      if (!glassDestroyed.has(c.id)) {
        state.discardPile.push(c);
      }
    }

    // Apply The Ox penalty
    if (B.applyOxPenalty) B.applyOxPenalty(state, selected);

    // Apply The Pillar debuff
    if (B.applyPillarDebuff) B.applyPillarDebuff(state, selected);

    // Boss blind: The Hook discards random cards after play
    if (blind.bossEffect && blind.bossEffect.effect === 'discardRandom') {
      const n = blind.bossEffect.value || 2;
      for (let i = 0; i < n && state.hand.length > 0; i++) {
        const idx = Math.floor(Math.random() * state.hand.length);
        const discarded = state.hand.splice(idx, 1);
        state.discardPile.push(...discarded);
      }
    }

    // The House: reveal cards after first hand
    if (state._houseFirstHand) {
      state.hand.forEach(c => { c.faceDown = false; });
      state._houseFirstHand = false;
    }

    // Draw back to hand size (Serpent overrides to 3)
    const effectiveSize = B.getEffectiveHandSize();
    const drawTarget = B.isSerpentActive && B.isSerpentActive(state)
      ? Math.min(3, effectiveSize - state.hand.length)
      : effectiveSize - state.hand.length;

    const newCards = B.drawCards(state, Math.max(0, drawTarget));

    // Apply boss blind effects on newly drawn cards
    if (B.applyBossBlindOnDraw) B.applyBossBlindOnDraw(state, newCards);

    state.hand.push(...newCards);

    // Apply sorting
    if (state.sortMode === SORT_SUIT) state.hand = B.sortBySuit(state.hand);
    else if (state.sortMode === SORT_RANK) state.hand = B.sortByRank(state.hand);

    // Update round state
    state.roundState.currentScore += scoreCalc.finalScore;
    state.roundState.handsRemaining--;
    state.lastScore = scoreCalc;

    // Track stats
    B.runStats.handsPlayed++;
    B.runStats.totalChipsEarned += scoreCalc.finalScore;
    if (scoreCalc.finalScore > B.runStats.bestHandScore) {
      B.runStats.bestHandScore = scoreCalc.finalScore;
      B.runStats.bestHandType = handInfo.type;
    }

    // Check win/loss
    if (state.roundState.currentScore >= state.roundState.targetScore) {
      state.phase = PHASE_BLIND_COMPLETE;
    } else if (state.roundState.handsRemaining <= 0) {
      state.phase = PHASE_GAME_OVER;
    }

    state.currentHandInfo = null;
    return scoreCalc;
  };

  B.discardCards = () => {
    const state = B.gameState;
    if (!state || state.phase !== PHASE_SELECT_CARDS) return false;

    const selected = state.hand.filter(c => c.selected);
    if (selected.length === 0) return false;
    if (state.roundState.discardsRemaining <= 0) return false;

    // Remove selected cards and put them in discard pile
    const selectedIds = new Set(selected.map(c => c.id));
    const discarded = state.hand.filter(c => selectedIds.has(c.id));
    state.hand = state.hand.filter(c => !selectedIds.has(c.id));
    if (!state.discardPile) state.discardPile = [];
    state.discardPile.push(...discarded);

    // Draw replacements (Serpent overrides to 3)
    const effectiveSize = B.getEffectiveHandSize();
    const drawTarget = B.isSerpentActive && B.isSerpentActive(state)
      ? Math.min(3, effectiveSize - state.hand.length)
      : effectiveSize - state.hand.length;

    const newCards = B.drawCards(state, Math.max(0, drawTarget));
    if (B.applyBossBlindOnDraw) B.applyBossBlindOnDraw(state, newCards);
    state.hand.push(...newCards);

    state.roundState.discardsRemaining--;

    // Apply sorting
    if (state.sortMode === SORT_SUIT) state.hand = B.sortBySuit(state.hand);
    else if (state.sortMode === SORT_RANK) state.hand = B.sortByRank(state.hand);

    state.currentHandInfo = null;
    return true;
  };

  B.advanceBlind = () => {
    const state = B.gameState;
    if (!state) return;

    // Award money
    const reward = state.roundState.currentBlind.reward;
    state.roundState.money += reward;
    B.runStats.moneyEarned += reward;
    B.runStats.blindsCleared++;

    // Gold card earnings
    const goldEarnings = B.calculateGoldEarnings(state.hand);
    state.roundState.money += goldEarnings;
    B.runStats.moneyEarned += goldEarnings;

    // Interest: $1 per $5, max cap (default $5, Seed Money voucher raises to $25)
    const interestCap = (state.ownedVouchers && state.ownedVouchers.includes('seed_money')) ? 25 : 5;
    const interest = Math.min(interestCap, Math.floor(state.roundState.money / 5));
    state.roundState.money += interest;
    B.runStats.moneyEarned += interest;

    // Advance blind progress
    state.roundState.blindProgress++;
    if (state.roundState.blindProgress > 2) {
      state.roundState.ante++;
      state.roundState.blindProgress = 0;

      // Win condition
      if (state.roundState.ante > MAX_ANTE) {
        state.phase = PHASE_WIN;
        return;
      }
    }

    // Get new blind
    const blindType = state.roundState.blindProgress;
    state.roundState.currentBlind = B.getBlind(state.roundState.ante, blindType);
    state.roundState.targetScore = state.roundState.currentBlind.targetScore;

    // Reset for new blind
    state.roundState.currentScore = 0;
    let hands = STARTING_HANDS;
    let discards = STARTING_DISCARDS;
    // Voucher: Grabber gives +1 hand per round
    if (state.ownedVouchers && state.ownedVouchers.includes('grabber')) hands++;
    // Voucher: Wasteful gives +1 discard per round
    if (state.ownedVouchers && state.ownedVouchers.includes('wasteful')) discards++;
    state.roundState.handsRemaining = hands;
    state.roundState.discardsRemaining = discards;
    state.handTypesPlayed = [];
    state.firstHandType = null;
    state.bossHandSizeReduction = 0;
    state._houseFirstHand = false;
    state._pillarPlayed = null;

    // Put current hand cards into discard pile, then reshuffle everything
    if (!state.discardPile) state.discardPile = [];
    state.discardPile.push(...state.hand);
    state.hand = [];

    // Reshuffle: combine deck and discard pile
    const allCards = [...state.deck, ...state.discardPile];
    allCards.forEach(c => { c.selected = false; c.faceDown = false; c.debuffed = false; });
    state.deck = B.shuffle(allCards);
    state.discardPile = [];

    // Deal new hand
    const effectiveSize = B.getEffectiveHandSize();
    state.hand = B.drawCards(state, effectiveSize);

    // Apply boss blind entry effects (face down, debuffs, etc.)
    if (B.applyBossBlindOnEntry) B.applyBossBlindOnEntry(state);

    if (state.sortMode === SORT_SUIT) state.hand = B.sortBySuit(state.hand);
    else if (state.sortMode === SORT_RANK) state.hand = B.sortByRank(state.hand);

    state.phase = PHASE_SHOP;
  };

  // Use a consumable (tarot card) from the player's inventory
  B.useConsumable = index => {
    const state = B.gameState;
    if (!state) return false;
    if (index < 0 || index >= state.consumables.length) return false;

    const tarot = state.consumables[index];
    const selected = state.hand.filter(c => c.selected);

    const ok = B.useTarotCard(tarot, selected, state);
    if (!ok) return false;

    state.consumables.splice(index, 1);
    B.runStats.consumablesUsed++;

    // Deselect all cards after using tarot
    state.hand.forEach(c => { c.selected = false; });
    state.currentHandInfo = null;
    return { name: tarot.name };
  };

  B.skipShop = () => {
    const state = B.gameState;
    if (!state) return;
    state.phase = PHASE_SELECT_CARDS;
    state.lastScore = null;
  };

  B.cycleSortMode = () => {
    const state = B.gameState;
    if (!state) return;
    state.sortMode = (state.sortMode + 1) % 3;
    if (state.sortMode === SORT_SUIT) state.hand = B.sortBySuit(state.hand);
    else if (state.sortMode === SORT_RANK) state.hand = B.sortByRank(state.hand);
    // SORT_NONE leaves as-is
  };

  // Save/Load
  B.saveGame = () => {
    const state = B.gameState;
    if (!state) return;
    try {
      localStorage.setItem('balatro_save', JSON.stringify({
        deck: state.deck,
        discardPile: state.discardPile || [],
        hand: state.hand,
        jokers: state.jokers,
        consumables: state.consumables,
        ownedVouchers: state.ownedVouchers || [],
        roundState: state.roundState,
        sortMode: state.sortMode,
        handLevels: B.handLevels,
        phase: state.phase,
        runStats: B.runStats,
      }));
    } catch(e) { /* ignore */ }
  };

  B.loadGame = () => {
    try {
      const data = JSON.parse(localStorage.getItem('balatro_save'));
      if (!data) return false;

      B.handLevels = data.handLevels || [1,1,1,1,1,1,1,1,1,1];

      if (data.runStats) B.runStats = data.runStats;

      const state = {
        phase: data.phase || PHASE_SELECT_CARDS,
        deck: data.deck,
        discardPile: data.discardPile || [],
        hand: data.hand,
        playedCards: [],
        jokers: data.jokers || [],
        consumables: data.consumables || [],
        ownedVouchers: data.ownedVouchers || [],
        roundState: data.roundState,
        sortMode: data.sortMode || SORT_RANK,
        currentHandInfo: null,
        lastScore: null,
        handTypesPlayed: [],
        firstHandType: null,
        bossHandSizeReduction: 0,
      };

      B.gameState = state;
      return true;
    } catch(e) { return false; }
  };

  B.deleteSave = () => {
    try { localStorage.removeItem('balatro_save'); } catch(e) { /* ignore */ }
  };
})();
