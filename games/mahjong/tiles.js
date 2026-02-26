/* tiles.js — Mahjong tile definitions (144 tiles)
 * 3 suits x 9 ranks x 4 copies = 108
 * 4 winds x 4 copies = 16
 * 3 dragons x 4 copies = 12
 * 4 flowers + 4 seasons = 8
 * Total = 144
 */

window.MahjongTiles = (() => {
  'use strict';

  // Suit characters for rendering
  const BAMBOO_CHARS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const CHARACTER_CHARS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const CIRCLE_DOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const SUITS = {
    bamboo:    { name: '竹', label: 'Bamboo',    color: '#2e7d32' },
    character: { name: '萬', label: 'Character', color: '#c62828' },
    circle:    { name: '筒', label: 'Circle',    color: '#1565c0' },
  };

  const WINDS = [
    { id: 'east',  char: '東', label: 'East Wind' },
    { id: 'south', char: '南', label: 'South Wind' },
    { id: 'west',  char: '西', label: 'West Wind' },
    { id: 'north', char: '北', label: 'North Wind' },
  ];

  const DRAGONS = [
    { id: 'red',   char: '中', label: 'Red Dragon',   color: '#c62828' },
    { id: 'green', char: '發', label: 'Green Dragon', color: '#2e7d32' },
    { id: 'white', char: '白', label: 'White Dragon', color: '#37474f' },
  ];

  const FLOWERS = [
    { id: 'plum',     char: '梅', label: 'Plum Blossom' },
    { id: 'orchid',   char: '蘭', label: 'Orchid' },
    { id: 'chrysanthemum', char: '菊', label: 'Chrysanthemum' },
    { id: 'bamboo_f', char: '竹', label: 'Bamboo' },
  ];

  const SEASONS = [
    { id: 'spring', char: '春', label: 'Spring' },
    { id: 'summer', char: '夏', label: 'Summer' },
    { id: 'autumn', char: '秋', label: 'Autumn' },
    { id: 'winter', char: '冬', label: 'Winter' },
  ];

  /**
   * Generate the full 144-tile set. Each tile gets a unique `uid`.
   * Tiles have: uid, type, suit?, rank?, id?, char, label, matchGroup
   * matchGroup determines which tiles can be paired:
   *   - suited tiles: "bamboo-3", "character-7", etc.
   *   - winds/dragons: "wind-east", "dragon-red", etc.
   *   - flowers: all match each other -> "bonus-flower"
   *   - seasons: all match each other -> "bonus-season"
   */
  function generateTileSet() {
    const tiles = [];
    let uid = 0;

    // Suited tiles: 3 suits x 9 ranks x 4 copies
    for (const [suitKey, suit] of Object.entries(SUITS)) {
      for (let rank = 1; rank <= 9; rank++) {
        for (let copy = 0; copy < 4; copy++) {
          tiles.push({
            uid: uid++,
            type: 'suit',
            suit: suitKey,
            rank,
            char: suitKey === 'circle' ? String(rank) : (suitKey === 'bamboo' ? BAMBOO_CHARS[rank - 1] : CHARACTER_CHARS[rank - 1]),
            suitChar: suit.name,
            label: `${suit.label} ${rank}`,
            color: suit.color,
            matchGroup: `${suitKey}-${rank}`,
            copy,
          });
        }
      }
    }

    // Winds: 4 winds x 4 copies
    for (const wind of WINDS) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({
          uid: uid++,
          type: 'wind',
          id: wind.id,
          char: wind.char,
          label: wind.label,
          color: '#37474f',
          matchGroup: `wind-${wind.id}`,
          copy,
        });
      }
    }

    // Dragons: 3 dragons x 4 copies
    for (const dragon of DRAGONS) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push({
          uid: uid++,
          type: 'dragon',
          id: dragon.id,
          char: dragon.char,
          label: dragon.label,
          color: dragon.color,
          matchGroup: `dragon-${dragon.id}`,
          copy,
        });
      }
    }

    // Flowers: 4 unique, all match each other
    for (const flower of FLOWERS) {
      tiles.push({
        uid: uid++,
        type: 'flower',
        id: flower.id,
        char: flower.char,
        label: flower.label,
        color: '#e91e63',
        matchGroup: 'bonus-flower',
        copy: 0,
      });
    }

    // Seasons: 4 unique, all match each other
    for (const season of SEASONS) {
      tiles.push({
        uid: uid++,
        type: 'season',
        id: season.id,
        char: season.char,
        label: season.label,
        color: '#ff8f00',
        matchGroup: 'bonus-season',
        copy: 0,
      });
    }

    return tiles;
  }

  /**
   * Check if two tiles can be matched (paired).
   */
  function canMatch(a, b) {
    if (a.uid === b.uid) return false;
    return a.matchGroup === b.matchGroup;
  }

  /**
   * Shuffle an array in place (Fisher-Yates).
   */
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return { generateTileSet, canMatch, shuffle, SUITS, WINDS, DRAGONS, FLOWERS, SEASONS };
})();
