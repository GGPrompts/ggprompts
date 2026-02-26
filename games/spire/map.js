// map.js - Procedural node map with branching paths
// Slay the Spire-lite card combat deckbuilder

(function() {
  const S = window.Spire;

  // Node types
  const COMBAT = 'combat', ELITE = 'elite', REST = 'rest',
        SHOP = 'shop', TREASURE = 'treasure', BOSS = 'boss', EVENT = 'event';
  S.NodeType = { COMBAT, ELITE, REST, SHOP, TREASURE, BOSS, EVENT };

  S.nodeIcon = type => ({
    combat: '\u2694',
    elite: '\uD83D\uDD25',
    rest: '\u26FA',
    shop: '\uD83D\uDCB0',
    treasure: '\uD83C\uDF81',
    boss: '\uD83D\uDC80',
    event: '?',
  }[type] || '?');

  S.nodeName = type => ({
    combat: 'Combat',
    elite: 'Elite',
    rest: 'Rest Site',
    shop: 'Shop',
    treasure: 'Treasure',
    boss: 'Boss',
    event: 'Unknown Event',
  }[type] || '?');

  S.nodeColor = type => ({
    combat: '#ef4444',
    elite: '#f59e0b',
    rest: '#22c55e',
    shop: '#3b82f6',
    treasure: '#eab308',
    boss: '#dc2626',
    event: '#a855f7',
  }[type] || '#6b7280');

  // Generate a map for one act
  // Returns array of rows, each row has nodes with connections
  S.generateMap = act => {
    const ROWS = 15;
    const MIN_COLS = 2;
    const MAX_COLS = 4;

    const rows = [];

    // Row 0: 2-3 starting nodes (always combat)
    const startCount = 2 + Math.floor(Math.random() * 2);
    const startRow = [];
    for (let i = 0; i < startCount; i++) {
      startRow.push({ type: COMBAT, col: i, row: 0, connections: [], visited: false, id: '0-' + i });
    }
    rows.push(startRow);

    // Rows 1 through ROWS-2: mixed nodes
    for (let r = 1; r < ROWS - 1; r++) {
      const numNodes = MIN_COLS + Math.floor(Math.random() * (MAX_COLS - MIN_COLS + 1));
      const row = [];
      for (let c = 0; c < numNodes; c++) {
        const type = pickNodeType(r, ROWS, act);
        row.push({ type, col: c, row: r, connections: [], visited: false, id: r + '-' + c });
      }
      rows.push(row);
    }

    // Final row: boss
    rows.push([{ type: BOSS, col: 0, row: ROWS - 1, connections: [], visited: false, id: (ROWS - 1) + '-0' }]);

    // Ensure row before boss is rest
    const preBossRow = rows[ROWS - 2];
    for (const node of preBossRow) {
      node.type = REST;
    }

    // Connect rows - each node connects to 1-2 nodes in next row
    for (let r = 0; r < rows.length - 1; r++) {
      const curr = rows[r];
      const next = rows[r + 1];

      // Ensure every node in current row connects to at least one next node
      for (let i = 0; i < curr.length; i++) {
        // Primary connection: roughly same column position
        const ratio = curr.length > 1 ? i / (curr.length - 1) : 0.5;
        const targetCol = Math.round(ratio * (next.length - 1));
        const primary = Math.max(0, Math.min(next.length - 1, targetCol));
        if (!curr[i].connections.includes(next[primary].id)) {
          curr[i].connections.push(next[primary].id);
        }

        // Secondary connection (50% chance, adjacent column)
        if (Math.random() < 0.5) {
          const offset = Math.random() < 0.5 ? -1 : 1;
          const secondary = Math.max(0, Math.min(next.length - 1, primary + offset));
          if (secondary !== primary && !curr[i].connections.includes(next[secondary].id)) {
            curr[i].connections.push(next[secondary].id);
          }
        }
      }

      // Ensure every node in next row is reachable by at least one parent
      for (let j = 0; j < next.length; j++) {
        const reachable = curr.some(n => n.connections.includes(next[j].id));
        if (!reachable) {
          // Connect nearest parent
          const bestParent = Math.max(0, Math.min(curr.length - 1,
            Math.round(j / (next.length - 1) * (curr.length - 1))));
          curr[bestParent].connections.push(next[j].id);
        }
      }
    }

    return rows;
  };

  function pickNodeType(row, totalRows, act) {
    // Early rows: mostly combat
    if (row <= 2) return COMBAT;

    // Mid-late rows can have variety
    const roll = Math.random();

    // Guaranteed patterns: elite around row 6-7, shop around row 9-10
    if (row === 6 || row === 7) {
      if (roll < 0.35) return ELITE;
    }
    if (row === 9 || row === 10) {
      if (roll < 0.3) return SHOP;
    }

    // General distribution
    if (roll < 0.40) return COMBAT;
    if (roll < 0.52) return EVENT;
    if (roll < 0.62) return ELITE;
    if (roll < 0.72) return REST;
    if (roll < 0.82) return SHOP;
    if (roll < 0.88) return TREASURE;
    return COMBAT;
  }

  // Get node by id from a map
  S.getNode = (map, id) => {
    for (const row of map) {
      for (const node of row) {
        if (node.id === id) return node;
      }
    }
    return null;
  };

  // Get accessible nodes from current position
  S.getAccessibleNodes = (map, currentNodeId) => {
    if (!currentNodeId) {
      // Start of act - first row is accessible
      return map[0].map(n => n.id);
    }
    const node = S.getNode(map, currentNodeId);
    if (!node) return [];
    return node.connections;
  };

  // Random event outcomes
  S.EVENTS = [
    {
      name: 'Mysterious Shrine',
      description: 'A dark shrine pulses with energy.',
      choices: [
        { text: 'Pray (Gain a random relic, lose 7 HP)', effect: { relic: true, damage: 7 } },
        { text: 'Leave', effect: {} },
      ]
    },
    {
      name: 'Forgotten Altar',
      description: 'An ancient altar offers tribute.',
      choices: [
        { text: 'Offer blood (Lose 10 HP, gain 75 gold)', effect: { damage: 10, gold: 75 } },
        { text: 'Smash it (Gain 50 gold)', effect: { gold: 50 } },
      ]
    },
    {
      name: 'Wandering Merchant',
      description: 'A figure emerges from the shadows, offering a trade.',
      choices: [
        { text: 'Trade (Lose 50 gold, remove a card)', effect: { cost: 50, removeCard: true } },
        { text: 'Decline', effect: {} },
      ]
    },
    {
      name: 'Golden Idol',
      description: 'A golden idol gleams on a pedestal.',
      choices: [
        { text: 'Take it (Gain 100 gold, gain a Curse)', effect: { gold: 100, curse: true } },
        { text: 'Leave it', effect: {} },
      ]
    },
    {
      name: 'Living Wall',
      description: 'A living wall blocks your path.',
      choices: [
        { text: 'Remove a card from your deck', effect: { removeCard: true } },
        { text: 'Gain 15 Max HP', effect: { maxHp: 15 } },
      ]
    },
    {
      name: 'Fountain of Blood',
      description: 'A fountain filled with crimson liquid.',
      choices: [
        { text: 'Drink (Heal to full HP)', effect: { fullHeal: true } },
        { text: 'Leave', effect: {} },
      ]
    },
  ];

  S.getRandomEvent = () => {
    return S.EVENTS[Math.floor(Math.random() * S.EVENTS.length)];
  };
})();
