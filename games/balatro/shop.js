// shop.js - Shop logic (jokers, planet cards, tarot cards, vouchers)

(function() {
  const B = window.Balatro;

  B.generateShop = () => {
    const state = B.gameState;
    if (!state) return null;

    const hasRerollSurplus = state.ownedVouchers && state.ownedVouchers.includes('reroll_surplus');
    const shop = {
      jokers: [],
      consumables: [],
      voucher: null,
      rerollCost: hasRerollSurplus ? 3 : 5,
      ownedVouchers: state.ownedVouchers || [],
    };

    // Joker slots (Overstock voucher adds +1)
    const jokerSlots = (state.ownedVouchers && state.ownedVouchers.includes('overstock')) ? 3 : 2;
    for (let i = 0; i < jokerSlots; i++) {
      const j = B.getRandomJoker(B.Rarity.UNCOMMON);
      if (j) {
        j.cost = B.getJokerCost(j);
        // Don't offer jokers player already has
        if (!state.jokers.find(oj => oj.id === j.id)) {
          shop.jokers.push(j);
        } else {
          // Try once more
          const j2 = B.getRandomJoker(B.Rarity.UNCOMMON);
          if (j2 && !state.jokers.find(oj => oj.id === j2.id)) {
            j2.cost = B.getJokerCost(j2);
            shop.jokers.push(j2);
          }
        }
      }
    }

    // 2 consumable slots (mix of planet and tarot)
    const hasTelescope = state.ownedVouchers && state.ownedVouchers.includes('telescope');
    const planetChance = hasTelescope ? 0.75 : 0.5;
    for (let i = 0; i < 2; i++) {
      if (Math.random() < planetChance) {
        shop.consumables.push(B.getRandomPlanet());
      } else {
        shop.consumables.push(B.getRandomTarot());
      }
    }

    // 1 voucher
    shop.voucher = B.getRandomVoucher(shop.ownedVouchers);

    state.currentShop = shop;
    return shop;
  };

  // Get effective item cost (accounting for Clearance Sale voucher)
  B.getEffectiveCost = (cost, state) => {
    if (state && state.ownedVouchers && state.ownedVouchers.includes('clearance')) {
      return Math.floor(cost * 0.75);
    }
    return cost;
  };

  B.buyJoker = index => {
    const state = B.gameState;
    if (!state || !state.currentShop) return false;
    const shop = state.currentShop;
    const joker = shop.jokers[index];
    if (!joker) return false;
    const cost = B.getEffectiveCost(joker.cost, state);
    if (state.roundState.money < cost) return false;
    const maxJ = B.getMaxJokers ? B.getMaxJokers() : B.MAX_JOKERS;
    if (state.jokers.length >= maxJ) return false;

    state.roundState.money -= cost;
    B.runStats.moneySpent += cost;
    B.runStats.jokersAcquired++;
    state.jokers.push(joker);
    shop.jokers.splice(index, 1);
    return true;
  };

  B.buyConsumable = index => {
    const state = B.gameState;
    if (!state || !state.currentShop) return false;
    const shop = state.currentShop;
    const item = shop.consumables[index];
    if (!item) return false;
    const cost = B.getEffectiveCost(item.cost || 3, state);
    if (state.roundState.money < cost) return false;

    state.roundState.money -= cost;
    B.runStats.moneySpent += cost;

    // Use planet cards immediately
    if (item.cardType === 'planet') {
      const newLevel = B.usePlanetCard(item);
      B.runStats.consumablesUsed++;
      shop.consumables.splice(index, 1);
      return { type: 'planet', name: item.name, handType: item.handType, newLevel };
    }

    // Tarot cards go to consumable slots
    const maxCons = B.getMaxConsumables ? B.getMaxConsumables() : 2;
    if (state.consumables.length >= maxCons) return false;
    state.consumables.push(item);
    shop.consumables.splice(index, 1);
    return { type: 'tarot', name: item.name };
  };

  B.buyVoucher = () => {
    const state = B.gameState;
    if (!state || !state.currentShop) return false;
    const shop = state.currentShop;
    if (!shop.voucher) return false;
    const cost = B.getEffectiveCost(shop.voucher.cost, state);
    if (state.roundState.money < cost) return false;

    state.roundState.money -= cost;
    B.runStats.moneySpent += cost;
    if (!state.ownedVouchers) state.ownedVouchers = [];
    state.ownedVouchers.push(shop.voucher.id);

    // Apply voucher effect immediately
    const v = shop.voucher;
    switch (v.effect) {
      case 'cheapReroll':
        shop.rerollCost = 3;
        break;
      case 'discount':
        // Clearance Sale: 25% off - applied via getEffectiveCost
        break;
      case 'extraHand':
        // Grabber: +1 hand takes effect next blind (handled in advanceBlind)
        break;
      case 'extraDiscard':
        // Wasteful: +1 discard takes effect next blind (handled in advanceBlind)
        break;
      case 'jokerSlot':
        // Blank: +1 joker slot - handled via getMaxJokers
        break;
      case 'consumableSlot':
        // Crystal Ball: +1 consumable slot - handled via getMaxConsumables
        break;
      case 'interestCap':
        // Seed Money: interest cap to $25 - handled in advanceBlind
        break;
      case 'shopSlot':
        // Overstock: +1 shop item - adds an extra joker slot to shop
        break;
      case 'editionBoost':
        // Hone: editions appear 2x more - applied during card generation
        break;
      case 'planetBoost':
        // Telescope: celestials 2x more - applied during shop generation
        break;
    }

    shop.voucher = null;
    return { id: v.id, name: v.name, effect: v.effect };
  };

  B.sellJoker = index => {
    const state = B.gameState;
    if (!state) return false;
    const joker = state.jokers[index];
    if (!joker) return false;

    state.roundState.money += B.getJokerSellValue(joker);
    state.jokers.splice(index, 1);
    return true;
  };

  B.rerollShop = () => {
    const state = B.gameState;
    if (!state || !state.currentShop) return false;
    const cost = state.currentShop.rerollCost || 5;
    if (state.roundState.money < cost) return false;

    state.roundState.money -= cost;

    // Regenerate jokers and consumables
    state.currentShop.jokers = [];
    for (let i = 0; i < 2; i++) {
      const j = B.getRandomJoker(B.Rarity.UNCOMMON);
      if (j) {
        j.cost = B.getJokerCost(j);
        state.currentShop.jokers.push(j);
      }
    }
    state.currentShop.consumables = [];
    for (let i = 0; i < 2; i++) {
      if (Math.random() < 0.5) {
        state.currentShop.consumables.push(B.getRandomPlanet());
      } else {
        state.currentShop.consumables.push(B.getRandomTarot());
      }
    }
    return true;
  };

  B.enterShop = () => {
    const state = B.gameState;
    if (!state) return;
    B.generateShop();
    state.phase = B.Phase.SHOP;
  };

  B.leaveShop = () => {
    const state = B.gameState;
    if (!state) return;
    state.currentShop = null;
    state.phase = B.Phase.SELECT_CARDS;
    state.lastScore = null;
  };
})();
