// blinds.js - Blind types, boss blind mechanics, ante scaling
// Ported from TUIClassics/games/balatro/blinds.go

(function() {
  const B = window.Balatro;

  const SMALL_BLIND=0, BIG_BLIND=1, BOSS_BLIND=2;
  B.BlindType = { SMALL: SMALL_BLIND, BIG: BIG_BLIND, BOSS: BOSS_BLIND };

  const bossBlindNames = [
    'The Hook','The Ox','The House','The Wall','The Wheel',
    'The Eye','The Mouth','The Serpent','The Pillar','The Needle',
    'The Head','The Club','The Window','The Manacle','The Mark',
  ];

  const bossBlindEffects = {
    'The Hook':    { desc: 'Discards 2 random cards from hand each hand played', effect: 'discardRandom', value: 2 },
    'The Ox':      { desc: 'Playing a #4 sets money to $0', effect: 'oxPenalty' },
    'The House':   { desc: 'First hand is drawn face down', effect: 'faceDown' },
    'The Wall':    { desc: '2x base score to beat', effect: 'doubleScore' },
    'The Wheel':   { desc: '1 in 7 cards are drawn face down', effect: 'randomFaceDown' },
    'The Eye':     { desc: 'No repeat hand types this blind', effect: 'noRepeatHands' },
    'The Mouth':   { desc: 'Only play 1 hand type this blind', effect: 'oneHandType' },
    'The Serpent':  { desc: 'After Play or Discard, always draw 3 cards', effect: 'draw3' },
    'The Pillar':  { desc: 'Cards played previously are debuffed', effect: 'debuffPlayed' },
    'The Needle':  { desc: 'Play only 1 hand', effect: 'oneHand' },
    'The Head':    { desc: 'Hearts are debuffed', effect: 'debuffSuit', suit: B.Suit.HEARTS },
    'The Club':    { desc: 'Clubs are debuffed', effect: 'debuffSuit', suit: B.Suit.CLUBS },
    'The Window':  { desc: 'Diamonds are debuffed', effect: 'debuffSuit', suit: B.Suit.DIAMONDS },
    'The Manacle': { desc: '-1 hand size', effect: 'reduceHandSize', value: 1 },
    'The Mark':    { desc: 'All face cards are drawn face down', effect: 'faceCardsFaceDown' },
  };

  B.bossBlindEffects = bossBlindEffects;

  B.getBlind = (ante, blindType) => {
    const smallBlindScore = 300 * ante;
    const blind = { type: blindType, ante };

    switch (blindType) {
      case SMALL_BLIND:
        blind.name = 'Small Blind';
        blind.targetScore = smallBlindScore;
        blind.reward = 3 + ante;
        break;
      case BIG_BLIND:
        blind.name = 'Big Blind';
        blind.targetScore = Math.floor(smallBlindScore * 1.5);
        blind.reward = 4 + ante;
        break;
      case BOSS_BLIND:
        blind.name = bossBlindNames[(ante - 1) % bossBlindNames.length];
        blind.targetScore = smallBlindScore * 2;
        blind.reward = 5 + ante;
        blind.bossEffect = bossBlindEffects[blind.name] || null;
        break;
    }
    return blind;
  };

  B.blindTypeName = t => ['Small Blind','Big Blind','Boss Blind'][t] || '?';

  // Apply boss blind effects when entering a new blind
  B.applyBossBlindOnEntry = state => {
    const blind = state.roundState.currentBlind;
    if (!blind.bossEffect) return;
    const eff = blind.bossEffect;

    switch (eff.effect) {
      case 'doubleScore':
        // Wall doubles target score - already applied in getBlind, but
        // we double again here for clarity (getBlind sets 2x base, so target is correct)
        break;
      case 'reduceHandSize':
        state.bossHandSizeReduction = eff.value || 1;
        break;
      case 'oneHand':
        // Needle: only 1 hand allowed - reduce hands remaining
        state.roundState.handsRemaining = 1;
        break;
      case 'faceDown':
        // The House: first hand drawn face down
        state.hand.forEach(c => { c.faceDown = true; });
        state._houseFirstHand = true;
        break;
      case 'randomFaceDown':
        // The Wheel: 1 in 7 cards drawn face down
        state.hand.forEach(c => {
          if (Math.random() < 1/7) c.faceDown = true;
        });
        break;
      case 'faceCardsFaceDown':
        // The Mark: all face cards drawn face down
        state.hand.forEach(c => {
          if (c.rank >= 11 && c.rank <= 13) c.faceDown = true;
        });
        break;
      case 'debuffSuit':
        // Head/Club/Window: debuff all cards of given suit
        state.hand.forEach(c => {
          if (c.suit === eff.suit) c.debuffed = true;
        });
        break;
    }
  };

  // Apply boss blind effects on cards drawn mid-round
  B.applyBossBlindOnDraw = (state, newCards) => {
    const blind = state.roundState.currentBlind;
    if (!blind.bossEffect) return;
    const eff = blind.bossEffect;

    switch (eff.effect) {
      case 'randomFaceDown':
        newCards.forEach(c => {
          if (Math.random() < 1/7) c.faceDown = true;
        });
        break;
      case 'faceCardsFaceDown':
        newCards.forEach(c => {
          if (c.rank >= 11 && c.rank <= 13) c.faceDown = true;
        });
        break;
      case 'debuffSuit':
        newCards.forEach(c => {
          if (c.suit === eff.suit) c.debuffed = true;
        });
        break;
    }
  };

  // Apply The Ox penalty: playing a #4 sets money to $0
  B.applyOxPenalty = (state, playedCards) => {
    const blind = state.roundState.currentBlind;
    if (!blind.bossEffect || blind.bossEffect.effect !== 'oxPenalty') return false;
    for (const c of playedCards) {
      if (c.rank === 4) {
        state.roundState.money = 0;
        return true;
      }
    }
    return false;
  };

  // Apply The Serpent: draw only 3 cards after play/discard
  B.isSerpentActive = state => {
    const blind = state.roundState.currentBlind;
    return blind.bossEffect && blind.bossEffect.effect === 'draw3';
  };

  // Apply The Pillar: previously played cards are debuffed
  B.applyPillarDebuff = (state, playedCards) => {
    const blind = state.roundState.currentBlind;
    if (!blind.bossEffect || blind.bossEffect.effect !== 'debuffPlayed') return;
    if (!state._pillarPlayed) state._pillarPlayed = new Set();
    for (const c of playedCards) {
      state._pillarPlayed.add(c.id);
    }
    // Debuff any cards in hand that were previously played
    state.hand.forEach(c => {
      if (state._pillarPlayed.has(c.id)) c.debuffed = true;
    });
  };
})();
