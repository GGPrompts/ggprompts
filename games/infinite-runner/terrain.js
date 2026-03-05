/**
 * terrain.js — Procedural terrain generation for Infinite Runner
 * Generates ground segments, gaps, barriers, low ceilings, and collectibles
 */
'use strict';

const Terrain = (() => {
    // Segment types
    const GROUND = 'ground';
    const GAP = 'gap';
    const BARRIER = 'barrier';
    const LOW_CEILING = 'low_ceiling';

    // Difficulty scaling
    const BASE_SEGMENT_WIDTH = 200;
    const MIN_SEGMENT_WIDTH = 100;
    const GAP_WIDTH_MIN = 80;
    const GAP_WIDTH_MAX = 180;
    const BARRIER_HEIGHT_MIN = 40;
    const BARRIER_HEIGHT_MAX = 100;
    const CEILING_HEIGHT = 60;
    const CEILING_LENGTH_MIN = 150;
    const CEILING_LENGTH_MAX = 350;

    let segments = [];
    let collectibles = [];
    let nextX = 0;
    let difficulty = 0; // 0 to 1
    let groundY = 0;

    function init(canvasHeight) {
        segments = [];
        collectibles = [];
        nextX = 0;
        difficulty = 0;
        groundY = canvasHeight - 80;

        // Initial flat runway
        addSegment(GROUND, 800, 0);
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function addSegment(type, width, extra) {
        const seg = {
            type: type,
            x: nextX,
            width: width,
            groundY: groundY,
            extra: extra || {}
        };
        segments.push(seg);
        nextX += width;
        return seg;
    }

    function addCollectible(x, y, type) {
        collectibles.push({
            x: x,
            y: y,
            type: type || 'coin',
            collected: false,
            radius: 12,
            bobPhase: Math.random() * Math.PI * 2
        });
    }

    function generateAhead(cameraX, canvasWidth) {
        const generateTo = cameraX + canvasWidth * 2.5;

        while (nextX < generateTo) {
            const roll = Math.random();
            const d = difficulty;

            // Obstacle probability increases with difficulty
            const gapChance = lerp(0.08, 0.22, d);
            const barrierChance = lerp(0.12, 0.28, d);
            const ceilingChance = lerp(0.02, 0.15, d);

            if (roll < gapChance) {
                // Gap
                const gapW = lerp(GAP_WIDTH_MIN, GAP_WIDTH_MAX, d * Math.random());
                addSegment(GAP, gapW, {});

                // Coins above the gap to tempt players
                if (Math.random() < 0.6) {
                    const coinY = groundY - 100 - Math.random() * 60;
                    for (let i = 0; i < 3; i++) {
                        addCollectible(nextX - gapW / 2 + (i - 1) * 30, coinY, 'coin');
                    }
                }
            } else if (roll < gapChance + barrierChance) {
                // Barrier - must jump over
                const h = lerp(BARRIER_HEIGHT_MIN, BARRIER_HEIGHT_MAX, d * Math.random());
                const w = lerp(25, 50, Math.random());
                const seg = addSegment(GROUND, w + 40, {});

                // Place barrier on the ground segment
                segments.push({
                    type: BARRIER,
                    x: seg.x + 20,
                    width: w,
                    groundY: groundY,
                    extra: { height: h }
                });

                // Coin arc above barrier
                if (Math.random() < 0.5) {
                    for (let i = 0; i < 5; i++) {
                        const t = i / 4;
                        const cx = seg.x + 20 + t * (w + 60) - 15;
                        const cy = groundY - h - 40 - Math.sin(t * Math.PI) * 60;
                        addCollectible(cx, cy, 'coin');
                    }
                }
            } else if (roll < gapChance + barrierChance + ceilingChance) {
                // Low ceiling - must slide under
                const len = lerp(CEILING_LENGTH_MIN, CEILING_LENGTH_MAX, Math.random());
                const ceilY = groundY - CEILING_HEIGHT;
                addSegment(GROUND, len, {});

                segments.push({
                    type: LOW_CEILING,
                    x: nextX - len,
                    width: len,
                    groundY: groundY,
                    extra: { ceilingY: ceilY, height: CEILING_HEIGHT }
                });

                // Ground-level coins under ceiling
                if (Math.random() < 0.7) {
                    for (let i = 0; i < 4; i++) {
                        addCollectible(
                            nextX - len + 30 + i * (len - 60) / 3,
                            ceilY + CEILING_HEIGHT / 2 + 10,
                            'coin'
                        );
                    }
                }
            } else {
                // Regular ground
                const w = lerp(MIN_SEGMENT_WIDTH, BASE_SEGMENT_WIDTH, Math.random());
                addSegment(GROUND, w, {});

                // Occasional coin line
                if (Math.random() < 0.3) {
                    const count = Math.floor(rand(3, 7));
                    for (let i = 0; i < count; i++) {
                        addCollectible(
                            nextX - w + 20 + i * ((w - 40) / (count - 1 || 1)),
                            groundY - 50 - Math.random() * 30,
                            Math.random() < lerp(0.05, 0.15, d) ? 'gem' : 'coin'
                        );
                    }
                }
            }

            // Always ensure some ground after obstacles
            if (segments[segments.length - 1].type !== GROUND) {
                addSegment(GROUND, lerp(120, 60, d), {});
            }
        }
    }

    function cleanup(cameraX) {
        // Remove segments well behind camera
        const cutoff = cameraX - 400;
        segments = segments.filter(s => s.x + s.width > cutoff);
        collectibles = collectibles.filter(c => c.x > cutoff - 50);
    }

    function setDifficulty(d) {
        difficulty = Math.min(1, Math.max(0, d));
    }

    function getGroundY() {
        return groundY;
    }

    function getSegments() {
        return segments;
    }

    function getCollectibles() {
        return collectibles;
    }

    return {
        GROUND, GAP, BARRIER, LOW_CEILING,
        init,
        generateAhead,
        cleanup,
        setDifficulty,
        getGroundY,
        getSegments,
        getCollectibles
    };
})();
