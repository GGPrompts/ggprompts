/* layouts.js — Mahjong Solitaire tile layouts
 * Each layout is { name, positions[] } where each position is { col, row, layer }.
 * col/row are in half-tile units (allows staggering).
 * layer 0 = bottom, layer 1 = on top of layer 0, etc.
 * Each layout must have exactly 144 positions.
 */

window.MahjongLayouts = (() => {
  'use strict';

  /**
   * Helper: create a rectangular slab of positions.
   * x,y = top-left in half-tile units; w,h = width,height in tiles; z = layer.
   */
  function rect(x, y, w, h, z) {
    const positions = [];
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        positions.push({ col: x + c * 2, row: y + r * 2, layer: z });
      }
    }
    return positions;
  }

  /* === TURTLE (Classic) ===
   * The traditional layout. Roughly shaped like a turtle seen from above.
   * Layer 0: main body (12x8 with wings + head/tail)
   * Layer 1: smaller rectangle
   * Layer 2: even smaller
   * Layer 3: 2 tiles
   * Layer 4: 1 cap tile
   */
  function turtle() {
    const p = [];

    // Layer 0 — main body: 12 wide x 8 tall = 96 (center region)
    // But we shape it more like the classic turtle
    // Row 0 (top): cols 2-12 (6 tiles)
    // Row 1: cols 0-14 (8 tiles) + wing at col -2 + wing at col 16
    // Row 2: cols 0-14 (8 tiles)
    // Row 3: cols 0-14 (8 tiles) + head at col -2 + tail at col 16, 18
    // Row 4: cols 0-14 (8 tiles) + head at col -2 + tail at col 16, 18
    // Row 5: cols 0-14 (8 tiles)
    // Row 6: cols 0-14 (8 tiles) + wing at col -2 + wing at col 16
    // Row 7 (bottom): cols 2-12 (6 tiles)

    // Main body rows (layer 0)
    const bodyRows = [
      { y: 0,  cols: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26] },  // 12
      { y: 2,  cols: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28] }, // 14 (extended sides)
      { y: 4,  cols: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28] }, // 14
      { y: 6,  cols: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] }, // 16 (head + tail)
      { y: 8,  cols: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] }, // 16
      { y: 10, cols: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28] }, // 14
      { y: 12, cols: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28] }, // 14
      { y: 14, cols: [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26] },  // 12
    ]; // Total: 12+14+14+16+16+14+14+12 = 112

    for (const row of bodyRows) {
      for (const c of row.cols) {
        p.push({ col: c, row: row.y, layer: 0 });
      }
    }

    // Layer 1: 6x4 centered = 24
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        p.push({ col: 9 + c * 2, row: 3 + r * 2, layer: 1 });
      }
    }

    // Layer 2: 2x2 = 4
    p.push({ col: 13, row: 5, layer: 2 });
    p.push({ col: 15, row: 5, layer: 2 });
    p.push({ col: 13, row: 7, layer: 2 });
    p.push({ col: 15, row: 7, layer: 2 });

    // Layer 3: 2 tiles stacked center
    p.push({ col: 13, row: 6, layer: 3 });
    p.push({ col: 15, row: 6, layer: 3 });

    // Total so far: 112+24+4+2 = 142. Need 2 more.
    // Add wing tips
    p.push({ col: 14, row: 6, layer: 4 }); // cap
    // One more on the side
    p.push({ col: 32, row: 7, layer: 0 }); // extended tail

    return p;
  }

  /* === PYRAMID ===
   * 4 layers that shrink toward the top.
   */
  function pyramid() {
    const p = [];

    // Layer 0: 10x8 = 80
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 10; c++) {
        p.push({ col: c * 2, row: r * 2, layer: 0 });
      }
    }

    // Layer 1: 8x6 = 48
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 8; c++) {
        p.push({ col: 2 + c * 2, row: 2 + r * 2, layer: 1 });
      }
    }

    // Layer 2: 4x3 = 12
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        p.push({ col: 6 + c * 2, row: 5 + r * 2, layer: 2 });
      }
    }

    // Layer 3: 2x2 = 4
    p.push({ col: 8, row: 6, layer: 3 });
    p.push({ col: 10, row: 6, layer: 3 });
    p.push({ col: 8, row: 8, layer: 3 });
    p.push({ col: 10, row: 8, layer: 3 });

    // Total: 80+48+12+4 = 144
    return p;
  }

  /* === FORTRESS ===
   * Four corner towers + a central platform.
   */
  function fortress() {
    const p = [];

    // 4 towers in corners, each 3x3 base with 2 layers
    const towers = [
      { x: 0,  y: 0 },
      { x: 18, y: 0 },
      { x: 0,  y: 12 },
      { x: 18, y: 12 },
    ];

    for (const t of towers) {
      // Tower base: 3x3 = 9
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          p.push({ col: t.x + c * 2, row: t.y + r * 2, layer: 0 });
        }
      }
      // Tower layer 1: 2x2 = 4
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          p.push({ col: t.x + 1 + c * 2, row: t.y + 1 + r * 2, layer: 1 });
        }
      }
      // Tower cap: 1
      p.push({ col: t.x + 2, row: t.y + 2, layer: 2 });
    }
    // 4 towers x 14 = 56

    // Central courtyard: 6x4 on layer 0 = 24
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        p.push({ col: 6 + c * 2, row: 4 + r * 2, layer: 0 });
      }
    }

    // Central platform layer 1: 4x2 = 8
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        p.push({ col: 8 + c * 2, row: 5 + r * 2, layer: 1 });
      }
    }

    // Walls connecting towers on layer 0
    // Top wall: 4 tiles between top towers
    for (let c = 0; c < 4; c++) {
      p.push({ col: 6 + c * 2, row: 1, layer: 0 });
    }
    // Bottom wall: 4 tiles
    for (let c = 0; c < 4; c++) {
      p.push({ col: 6 + c * 2, row: 15, layer: 0 });
    }
    // Left wall: 4 tiles
    for (let r = 0; r < 4; r++) {
      p.push({ col: 1, row: 6 + r * 2, layer: 0 });
    }
    // Right wall: 4 tiles
    for (let r = 0; r < 4; r++) {
      p.push({ col: 23, row: 6 + r * 2, layer: 0 });
    }

    // Total: 56 + 24 + 8 + 16 = 104. Need 40 more.
    // Add battlements — extra tiles on layer 0 around the courtyard
    // Inner ring: fill gaps
    for (let c = 0; c < 6; c++) {
      p.push({ col: 6 + c * 2, row: 2, layer: 0 });  // +6
      p.push({ col: 6 + c * 2, row: 14, layer: 0 }); // +6
    }
    // Side fills
    for (let r = 0; r < 4; r++) {
      p.push({ col: 3, row: 5 + r * 2, layer: 0 });  // +4
      p.push({ col: 21, row: 5 + r * 2, layer: 0 }); // +4
    }
    // Extra central layer 1: extend
    for (let c = 0; c < 6; c++) {
      p.push({ col: 6 + c * 2, row: 3, layer: 0 }); // +6
    }
    for (let c = 0; c < 6; c++) {
      p.push({ col: 6 + c * 2, row: 13, layer: 0 }); // +6
    }
    // +32 so far. Need 8 more.
    // Moat tiles
    for (let c = 0; c < 4; c++) {
      p.push({ col: 8 + c * 2, row: 6, layer: 2 }); // +4
    }
    for (let c = 0; c < 4; c++) {
      p.push({ col: 8 + c * 2, row: 8, layer: 2 }); // +4
    }

    // Total: 104 + 32 + 8 = 144
    return p;
  }

  /* === BRIDGE ===
   * Two land masses connected by a narrow bridge.
   */
  function bridge() {
    const p = [];

    // Left island layer 0: 6x7 = 42
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 6; c++) {
        p.push({ col: c * 2, row: 1 + r * 2, layer: 0 });
      }
    }

    // Right island layer 0: 6x7 = 42
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 6; c++) {
        p.push({ col: 20 + c * 2, row: 1 + r * 2, layer: 0 });
      }
    }

    // Bridge span layer 0: 4 wide x 3 tall = 12
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        p.push({ col: 12 + c * 2, row: 5 + r * 2, layer: 0 });
      }
    }

    // Left island layer 1: 4x4 = 16
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        p.push({ col: 2 + c * 2, row: 4 + r * 2, layer: 1 });
      }
    }

    // Right island layer 1: 4x4 = 16
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        p.push({ col: 22 + c * 2, row: 4 + r * 2, layer: 1 });
      }
    }

    // Left cap layer 2: 2x2 = 4
    p.push({ col: 4, row: 6, layer: 2 });
    p.push({ col: 6, row: 6, layer: 2 });
    p.push({ col: 4, row: 8, layer: 2 });
    p.push({ col: 6, row: 8, layer: 2 });

    // Right cap layer 2: 2x2 = 4
    p.push({ col: 24, row: 6, layer: 2 });
    p.push({ col: 26, row: 6, layer: 2 });
    p.push({ col: 24, row: 8, layer: 2 });
    p.push({ col: 26, row: 8, layer: 2 });

    // Bridge arch layer 1: 2x2 = 4
    p.push({ col: 14, row: 6, layer: 1 });
    p.push({ col: 16, row: 6, layer: 1 });
    p.push({ col: 14, row: 8, layer: 1 });
    p.push({ col: 16, row: 8, layer: 1 });

    // Bridge towers: 2 tiles each side
    p.push({ col: 12, row: 4, layer: 1 });
    p.push({ col: 18, row: 4, layer: 1 });
    p.push({ col: 12, row: 10, layer: 1 });
    p.push({ col: 18, row: 10, layer: 1 });

    // Total: 42+42+12+16+16+4+4+4+4 = 144
    return p;
  }

  /* === DRAGON (Custom) ===
   * A wide layout with a spiraling feel and layered center eye.
   * Uses a set to guarantee no duplicates.
   */
  function dragon() {
    const set = new Set();
    const p = [];

    function add(col, row, layer) {
      const key = col + ',' + row + ',' + layer;
      if (!set.has(key)) {
        set.add(key);
        p.push({ col, row, layer });
      }
    }

    // Layer 0: large cross/diamond shape
    // Center block 10x8 = 80
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 10; c++) {
        add(4 + c * 2, 2 + r * 2, 0);
      }
    }
    // Wings left: 2x4 = 8
    for (let r = 0; r < 4; r++) {
      add(0, 6 + r * 2, 0);
      add(2, 6 + r * 2, 0);
    }
    // Wings right: 2x4 = 8
    for (let r = 0; r < 4; r++) {
      add(24, 6 + r * 2, 0);
      add(26, 6 + r * 2, 0);
    }
    // Head: 4 tiles top
    add(10, 0, 0); add(12, 0, 0); add(14, 0, 0); add(16, 0, 0);
    // Tail: 4 tiles bottom
    add(10, 18, 0); add(12, 18, 0); add(14, 18, 0); add(16, 18, 0);
    // L0 subtotal: 80+8+8+4+4 = 104

    // Layer 1: 6x4 = 24
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 6; c++) {
        add(8 + c * 2, 6 + r * 2, 1);
      }
    }

    // Layer 2: 4x3 = 12
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        add(10 + c * 2, 7 + r * 2, 2);
      }
    }

    // Layer 3: 2x1 = 2
    add(12, 9, 3);
    add(14, 9, 3);

    // Layer 4: dragon eye cap
    add(13, 9, 4);

    // Subtotal: 104+24+12+2+1 = 143. Need 1 more.
    add(13, 0, 1); // jewel above head

    // Total: 144
    return p;
  }

  // All layouts keyed by ID
  const LAYOUTS = {
    turtle:   { name: 'Turtle',   icon: '🐢', build: turtle },
    pyramid:  { name: 'Pyramid',  icon: '🔺', build: pyramid },
    fortress: { name: 'Fortress', icon: '🏰', build: fortress },
    bridge:   { name: 'Bridge',   icon: '🌉', build: bridge },
    dragon:   { name: 'Dragon',   icon: '🐲', build: dragon },
  };

  function getLayout(id) {
    const layout = LAYOUTS[id];
    if (!layout) throw new Error(`Unknown layout: ${id}`);
    const positions = layout.build();
    if (positions.length !== 144) {
      console.warn(`Layout "${id}" has ${positions.length} positions (expected 144). Adjusting...`);
      // Trim or pad
      while (positions.length > 144) positions.pop();
      while (positions.length < 144) {
        // Add tiles to the last used row
        const last = positions[positions.length - 1];
        positions.push({ col: last.col + 2, row: last.row, layer: last.layer });
      }
    }
    return positions;
  }

  function listLayouts() {
    return Object.entries(LAYOUTS).map(([id, l]) => ({ id, name: l.name, icon: l.icon }));
  }

  return { getLayout, listLayouts };
})();
