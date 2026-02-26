/**
 * levels.js — 15 hand-crafted levels for Slingshot Siege
 * Each level: { name, birds[], structures[], enemies[], bg }
 *
 * Coordinate system: world is 1600x900 logical pixels
 * Ground is at y=840. Blocks are placed by center position.
 * Materials: wood (hp:60), glass (hp:30), stone (hp:120), ice (hp:40), metal (hp:200)
 * Block sizes: 'plank' (80x20), 'beam' (20x80), 'cube' (40x40), 'slab' (100x30), 'brick' (60x30)
 * Bird types: 'normal', 'explosive', 'splitter', 'heavy', 'speedy'
 */
'use strict';

const Levels = (() => {
    const GROUND = 840;

    // Helper: stack blocks at x, starting from ground
    function stack(x, blocks) {
        let y = GROUND;
        return blocks.map(b => {
            const h = b.h || (b.size === 'beam' ? 80 : b.size === 'plank' ? 20 : b.size === 'slab' ? 30 : b.size === 'brick' ? 30 : 40);
            y -= h / 2;
            const result = { ...b, x, y };
            y -= h / 2;
            return result;
        });
    }

    // Block presets
    const B = {
        woodPlank:  { size: 'plank', material: 'wood' },
        woodBeam:   { size: 'beam', material: 'wood' },
        woodCube:   { size: 'cube', material: 'wood' },
        woodSlab:   { size: 'slab', material: 'wood' },
        woodBrick:  { size: 'brick', material: 'wood' },
        stonePlank: { size: 'plank', material: 'stone' },
        stoneBeam:  { size: 'beam', material: 'stone' },
        stoneCube:  { size: 'cube', material: 'stone' },
        stoneSlab:  { size: 'slab', material: 'stone' },
        stoneBrick: { size: 'brick', material: 'stone' },
        glassPlank: { size: 'plank', material: 'glass' },
        glassBeam:  { size: 'beam', material: 'glass' },
        glassCube:  { size: 'cube', material: 'glass' },
        glassBrick: { size: 'brick', material: 'glass' },
        icePlank:   { size: 'plank', material: 'ice' },
        iceBeam:    { size: 'beam', material: 'ice' },
        iceCube:    { size: 'cube', material: 'ice' },
        metalPlank: { size: 'plank', material: 'metal' },
        metalBeam:  { size: 'beam', material: 'metal' },
        metalCube:  { size: 'cube', material: 'metal' },
    };

    const levels = [
        // Level 1: Tutorial — simple glass house
        {
            name: "Glass House",
            description: "Every demolition expert starts somewhere.",
            bg: 'meadow',
            par: 2,
            birds: ['normal', 'normal', 'normal'],
            structures: [
                { x: 950, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1050, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1000, y: GROUND - 90, size: 'plank', material: 'glass' },
            ],
            enemies: [
                { x: 1000, y: GROUND - 15 },
            ]
        },

        // Level 2: Wood Cabin
        {
            name: "Wood Cabin",
            description: "A cozy wooden shelter. Not for long.",
            bg: 'meadow',
            par: 2,
            birds: ['normal', 'normal', 'heavy'],
            structures: [
                { x: 900, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1000, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1100, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 950, y: GROUND - 90, size: 'plank', material: 'wood' },
                { x: 1050, y: GROUND - 90, size: 'plank', material: 'wood' },
                { x: 1000, y: GROUND - 130, size: 'plank', material: 'wood' },
            ],
            enemies: [
                { x: 950, y: GROUND - 15 },
                { x: 1050, y: GROUND - 15 },
            ]
        },

        // Level 3: Twin Towers
        {
            name: "Twin Towers",
            description: "Two glass towers. Try the splitter.",
            bg: 'meadow',
            par: 2,
            birds: ['splitter', 'normal', 'normal'],
            structures: [
                // Left tower
                { x: 880, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 920, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 900, y: GROUND - 90, size: 'plank', material: 'wood' },
                { x: 880, y: GROUND - 130, size: 'beam', material: 'glass' },
                { x: 920, y: GROUND - 130, size: 'beam', material: 'glass' },
                { x: 900, y: GROUND - 180, size: 'plank', material: 'wood' },
                // Right tower
                { x: 1080, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1120, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1100, y: GROUND - 90, size: 'plank', material: 'wood' },
                { x: 1080, y: GROUND - 130, size: 'beam', material: 'glass' },
                { x: 1120, y: GROUND - 130, size: 'beam', material: 'glass' },
                { x: 1100, y: GROUND - 180, size: 'plank', material: 'wood' },
            ],
            enemies: [
                { x: 900, y: GROUND - 15 },
                { x: 1100, y: GROUND - 15 },
            ]
        },

        // Level 4: Stone Bunker
        {
            name: "Stone Bunker",
            description: "Stone walls need a heavier touch.",
            bg: 'desert',
            par: 2,
            birds: ['heavy', 'explosive', 'normal'],
            structures: [
                { x: 950, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1050, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1000, y: GROUND - 90, size: 'slab', material: 'stone' },
                { x: 950, y: GROUND - 130, size: 'beam', material: 'stone' },
                { x: 1050, y: GROUND - 130, size: 'beam', material: 'stone' },
                { x: 1000, y: GROUND - 180, size: 'slab', material: 'stone' },
            ],
            enemies: [
                { x: 1000, y: GROUND - 15 },
            ]
        },

        // Level 5: Explosive Introduction
        {
            name: "Demolition Day",
            description: "TNT crates are scattered in the structure.",
            bg: 'desert',
            par: 1,
            birds: ['normal', 'explosive', 'normal'],
            structures: [
                { x: 920, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1080, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1000, y: GROUND - 20, size: 'cube', material: 'wood', tnt: true },
                { x: 1000, y: GROUND - 70, size: 'plank', material: 'wood' },
                { x: 960, y: GROUND - 110, size: 'beam', material: 'glass' },
                { x: 1040, y: GROUND - 110, size: 'beam', material: 'glass' },
                { x: 1000, y: GROUND - 160, size: 'plank', material: 'wood' },
            ],
            enemies: [
                { x: 960, y: GROUND - 15 },
                { x: 1040, y: GROUND - 15 },
            ]
        },

        // Level 6: Ice Palace
        {
            name: "Ice Palace",
            description: "Fragile ice, but lots of it.",
            bg: 'winter',
            par: 3,
            birds: ['normal', 'splitter', 'normal', 'normal'],
            structures: [
                { x: 850, y: GROUND - 40, size: 'beam', material: 'ice' },
                { x: 950, y: GROUND - 40, size: 'beam', material: 'ice' },
                { x: 1050, y: GROUND - 40, size: 'beam', material: 'ice' },
                { x: 1150, y: GROUND - 40, size: 'beam', material: 'ice' },
                { x: 900, y: GROUND - 90, size: 'plank', material: 'ice' },
                { x: 1000, y: GROUND - 90, size: 'plank', material: 'ice' },
                { x: 1100, y: GROUND - 90, size: 'plank', material: 'ice' },
                { x: 950, y: GROUND - 130, size: 'beam', material: 'ice' },
                { x: 1050, y: GROUND - 130, size: 'beam', material: 'ice' },
                { x: 1000, y: GROUND - 180, size: 'plank', material: 'ice' },
                { x: 1000, y: GROUND - 220, size: 'cube', material: 'ice' },
            ],
            enemies: [
                { x: 900, y: GROUND - 15 },
                { x: 1000, y: GROUND - 15 },
                { x: 1100, y: GROUND - 15 },
            ]
        },

        // Level 7: Mixed Materials
        {
            name: "Layer Cake",
            description: "Glass, wood, stone. Choose your approach.",
            bg: 'meadow',
            par: 3,
            birds: ['normal', 'heavy', 'explosive', 'normal'],
            structures: [
                // Base: stone
                { x: 930, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 1000, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 1070, y: GROUND - 15, size: 'brick', material: 'stone' },
                // Middle: wood
                { x: 930, y: GROUND - 50, size: 'beam', material: 'wood' },
                { x: 1070, y: GROUND - 50, size: 'beam', material: 'wood' },
                { x: 1000, y: GROUND - 80, size: 'plank', material: 'wood' },
                // Top: glass
                { x: 970, y: GROUND - 120, size: 'beam', material: 'glass' },
                { x: 1030, y: GROUND - 120, size: 'beam', material: 'glass' },
                { x: 1000, y: GROUND - 170, size: 'plank', material: 'glass' },
            ],
            enemies: [
                { x: 1000, y: GROUND - 40 },
                { x: 1000, y: GROUND - 130 },
            ]
        },

        // Level 8: The Bridge
        {
            name: "The Bridge",
            description: "Enemies hiding under a long bridge.",
            bg: 'desert',
            par: 2,
            birds: ['heavy', 'normal', 'explosive'],
            structures: [
                // Left pillar
                { x: 850, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 850, y: GROUND - 120, size: 'beam', material: 'stone' },
                // Right pillar
                { x: 1150, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1150, y: GROUND - 120, size: 'beam', material: 'stone' },
                // Bridge deck
                { x: 920, y: GROUND - 170, size: 'slab', material: 'wood' },
                { x: 1000, y: GROUND - 170, size: 'slab', material: 'wood' },
                { x: 1080, y: GROUND - 170, size: 'slab', material: 'wood' },
                // Railings
                { x: 920, y: GROUND - 210, size: 'beam', material: 'glass' },
                { x: 1080, y: GROUND - 210, size: 'beam', material: 'glass' },
            ],
            enemies: [
                { x: 950, y: GROUND - 15 },
                { x: 1050, y: GROUND - 15 },
                { x: 1000, y: GROUND - 195 },
            ]
        },

        // Level 9: TNT Chain
        {
            name: "Chain Reaction",
            description: "One spark sets off the whole thing.",
            bg: 'desert',
            par: 1,
            birds: ['normal', 'normal'],
            structures: [
                { x: 900, y: GROUND - 20, size: 'cube', material: 'wood', tnt: true },
                { x: 960, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1000, y: GROUND - 20, size: 'cube', material: 'wood', tnt: true },
                { x: 1040, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1100, y: GROUND - 20, size: 'cube', material: 'wood', tnt: true },
                { x: 960, y: GROUND - 70, size: 'plank', material: 'wood' },
                { x: 1040, y: GROUND - 70, size: 'plank', material: 'wood' },
                { x: 1000, y: GROUND - 95, size: 'cube', material: 'wood', tnt: true },
            ],
            enemies: [
                { x: 960, y: GROUND - 15 },
                { x: 1040, y: GROUND - 15 },
            ]
        },

        // Level 10: Fortress
        {
            name: "Fortress",
            description: "A stone fortress. Bring the heavy artillery.",
            bg: 'desert',
            par: 3,
            birds: ['heavy', 'explosive', 'heavy', 'splitter'],
            structures: [
                // Outer walls
                { x: 850, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 850, y: GROUND - 120, size: 'beam', material: 'stone' },
                { x: 1150, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1150, y: GROUND - 120, size: 'beam', material: 'stone' },
                // Roof
                { x: 920, y: GROUND - 170, size: 'slab', material: 'stone' },
                { x: 1000, y: GROUND - 170, size: 'slab', material: 'stone' },
                { x: 1080, y: GROUND - 170, size: 'slab', material: 'stone' },
                // Inner walls
                { x: 950, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1050, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1000, y: GROUND - 90, size: 'plank', material: 'wood' },
                // Top
                { x: 1000, y: GROUND - 210, size: 'beam', material: 'stone' },
                { x: 1000, y: GROUND - 260, size: 'cube', material: 'stone' },
            ],
            enemies: [
                { x: 920, y: GROUND - 15 },
                { x: 1000, y: GROUND - 15 },
                { x: 1080, y: GROUND - 15 },
            ]
        },

        // Level 11: Speed Run
        {
            name: "Speed Run",
            description: "Speedy birds zip through glass corridors.",
            bg: 'meadow',
            par: 2,
            birds: ['speedy', 'speedy', 'normal'],
            structures: [
                // Corridor 1
                { x: 850, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 950, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 900, y: GROUND - 90, size: 'plank', material: 'glass' },
                // Corridor 2
                { x: 1050, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1150, y: GROUND - 40, size: 'beam', material: 'glass' },
                { x: 1100, y: GROUND - 90, size: 'plank', material: 'glass' },
                // High shelf
                { x: 1000, y: GROUND - 130, size: 'slab', material: 'wood' },
                { x: 1000, y: GROUND - 170, size: 'beam', material: 'wood' },
                { x: 1000, y: GROUND - 220, size: 'plank', material: 'wood' },
            ],
            enemies: [
                { x: 900, y: GROUND - 15 },
                { x: 1100, y: GROUND - 15 },
                { x: 1000, y: GROUND - 150 },
            ]
        },

        // Level 12: Ice & Stone
        {
            name: "Frozen Keep",
            description: "Ice outer shell, stone inner core.",
            bg: 'winter',
            par: 3,
            birds: ['heavy', 'explosive', 'splitter', 'normal'],
            structures: [
                // Ice outer
                { x: 850, y: GROUND - 40, size: 'beam', material: 'ice' },
                { x: 1150, y: GROUND - 40, size: 'beam', material: 'ice' },
                { x: 850, y: GROUND - 120, size: 'beam', material: 'ice' },
                { x: 1150, y: GROUND - 120, size: 'beam', material: 'ice' },
                { x: 1000, y: GROUND - 170, size: 'slab', material: 'ice' },
                // Stone inner
                { x: 950, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1050, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1000, y: GROUND - 90, size: 'slab', material: 'stone' },
                { x: 1000, y: GROUND - 130, size: 'cube', material: 'stone' },
                // TNT inside
                { x: 1000, y: GROUND - 20, size: 'cube', material: 'wood', tnt: true },
            ],
            enemies: [
                { x: 950, y: GROUND - 15 },
                { x: 1050, y: GROUND - 15 },
                { x: 1000, y: GROUND - 110 },
            ]
        },

        // Level 13: Sky Castle
        {
            name: "Sky Castle",
            description: "A tall structure reaching for the clouds.",
            bg: 'meadow',
            par: 3,
            birds: ['splitter', 'heavy', 'explosive', 'normal'],
            structures: [
                // Base
                { x: 980, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 1040, y: GROUND - 15, size: 'brick', material: 'stone' },
                // Floor 1
                { x: 980, y: GROUND - 70, size: 'beam', material: 'wood' },
                { x: 1040, y: GROUND - 70, size: 'beam', material: 'wood' },
                { x: 1010, y: GROUND - 120, size: 'plank', material: 'wood' },
                // Floor 2
                { x: 980, y: GROUND - 160, size: 'beam', material: 'wood' },
                { x: 1040, y: GROUND - 160, size: 'beam', material: 'wood' },
                { x: 1010, y: GROUND - 210, size: 'plank', material: 'wood' },
                // Floor 3
                { x: 980, y: GROUND - 250, size: 'beam', material: 'glass' },
                { x: 1040, y: GROUND - 250, size: 'beam', material: 'glass' },
                { x: 1010, y: GROUND - 300, size: 'plank', material: 'glass' },
                // Spire
                { x: 1010, y: GROUND - 340, size: 'beam', material: 'glass' },
            ],
            enemies: [
                { x: 1010, y: GROUND - 40 },
                { x: 1010, y: GROUND - 140 },
                { x: 1010, y: GROUND - 230 },
            ]
        },

        // Level 14: Labyrinth
        {
            name: "The Labyrinth",
            description: "Walls within walls within walls.",
            bg: 'desert',
            par: 3,
            birds: ['explosive', 'splitter', 'heavy', 'normal', 'explosive'],
            structures: [
                // Outer walls
                { x: 830, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 830, y: GROUND - 120, size: 'beam', material: 'stone' },
                { x: 1170, y: GROUND - 40, size: 'beam', material: 'stone' },
                { x: 1170, y: GROUND - 120, size: 'beam', material: 'stone' },
                // Inner dividers
                { x: 940, y: GROUND - 40, size: 'beam', material: 'wood' },
                { x: 1060, y: GROUND - 40, size: 'beam', material: 'wood' },
                // Shelves
                { x: 890, y: GROUND - 80, size: 'plank', material: 'wood' },
                { x: 1000, y: GROUND - 100, size: 'plank', material: 'wood' },
                { x: 1110, y: GROUND - 80, size: 'plank', material: 'wood' },
                // Upper
                { x: 890, y: GROUND - 120, size: 'beam', material: 'glass' },
                { x: 1110, y: GROUND - 120, size: 'beam', material: 'glass' },
                { x: 1000, y: GROUND - 170, size: 'slab', material: 'stone' },
                // TNT
                { x: 1000, y: GROUND - 20, size: 'cube', material: 'wood', tnt: true },
            ],
            enemies: [
                { x: 880, y: GROUND - 15 },
                { x: 1000, y: GROUND - 50 },
                { x: 1120, y: GROUND - 15 },
                { x: 1000, y: GROUND - 130 },
            ]
        },

        // Level 15: Final Boss
        {
            name: "The Citadel",
            description: "The ultimate fortress. Use everything you have.",
            bg: 'sunset',
            par: 4,
            birds: ['heavy', 'explosive', 'splitter', 'heavy', 'explosive', 'normal'],
            structures: [
                // Foundation
                { x: 860, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 930, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 1000, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 1070, y: GROUND - 15, size: 'brick', material: 'stone' },
                { x: 1140, y: GROUND - 15, size: 'brick', material: 'stone' },
                // Outer walls
                { x: 860, y: GROUND - 70, size: 'beam', material: 'stone' },
                { x: 1140, y: GROUND - 70, size: 'beam', material: 'stone' },
                { x: 860, y: GROUND - 150, size: 'beam', material: 'stone' },
                { x: 1140, y: GROUND - 150, size: 'beam', material: 'stone' },
                // Roof
                { x: 930, y: GROUND - 200, size: 'slab', material: 'stone' },
                { x: 1000, y: GROUND - 200, size: 'slab', material: 'stone' },
                { x: 1070, y: GROUND - 200, size: 'slab', material: 'stone' },
                // Inner rooms
                { x: 940, y: GROUND - 55, size: 'beam', material: 'wood' },
                { x: 1060, y: GROUND - 55, size: 'beam', material: 'wood' },
                { x: 1000, y: GROUND - 95, size: 'plank', material: 'wood' },
                // Tower
                { x: 1000, y: GROUND - 240, size: 'beam', material: 'stone' },
                { x: 960, y: GROUND - 280, size: 'beam', material: 'glass' },
                { x: 1040, y: GROUND - 280, size: 'beam', material: 'glass' },
                { x: 1000, y: GROUND - 330, size: 'plank', material: 'glass' },
                { x: 1000, y: GROUND - 360, size: 'cube', material: 'glass' },
                // TNT
                { x: 930, y: GROUND - 50, size: 'cube', material: 'wood', tnt: true },
                { x: 1070, y: GROUND - 50, size: 'cube', material: 'wood', tnt: true },
            ],
            enemies: [
                { x: 920, y: GROUND - 40 },
                { x: 1000, y: GROUND - 40 },
                { x: 1080, y: GROUND - 40 },
                { x: 1000, y: GROUND - 130 },
                { x: 1000, y: GROUND - 250 },
            ]
        },
    ];

    // Block dimensions lookup
    const SIZES = {
        plank: { w: 80, h: 20 },
        beam:  { w: 20, h: 80 },
        cube:  { w: 40, h: 40 },
        slab:  { w: 100, h: 30 },
        brick: { w: 60, h: 30 },
    };

    // Material HP
    const MATERIALS = {
        wood:  { hp: 60,  restitution: 0.2, friction: 0.5, density: 0.8 },
        glass: { hp: 30,  restitution: 0.1, friction: 0.3, density: 0.5 },
        stone: { hp: 120, restitution: 0.1, friction: 0.7, density: 1.5 },
        ice:   { hp: 40,  restitution: 0.15, friction: 0.15, density: 0.6 },
        metal: { hp: 200, restitution: 0.3, friction: 0.6, density: 2.0 },
    };

    // Bird stats
    const BIRDS = {
        normal:    { name: 'Red',     color: '#e74c3c', radius: 15, mass: 5,  ability: null,       desc: 'Standard bird. No special ability.' },
        explosive: { name: 'Bomber',  color: '#2c2c2c', radius: 16, mass: 6,  ability: 'explode',  desc: 'Tap to explode on impact.' },
        splitter:  { name: 'Trio',    color: '#3498db', radius: 13, mass: 4,  ability: 'split',    desc: 'Tap to split into three.' },
        heavy:     { name: 'Boulder', color: '#8e8e8e', radius: 20, mass: 12, ability: 'accelerate', desc: 'Tap to drop like a boulder.' },
        speedy:    { name: 'Dart',    color: '#f1c40f', radius: 12, mass: 3,  ability: 'boost',    desc: 'Tap for a speed boost.' },
    };

    return {
        levels,
        SIZES,
        MATERIALS,
        BIRDS,
        GROUND,
        getLevel(index) { return levels[index]; },
        count() { return levels.length; },
    };
})();
