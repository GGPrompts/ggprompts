// Pinball Table Layout
// Defines all table elements: walls, bumpers, flippers, targets, lanes, ramps
(function() {
    'use strict';

    var Flipper = PinballPhysics.Flipper;

    // Table dimensions (logical coordinates, will be scaled to canvas)
    var TABLE_W = 400;
    var TABLE_H = 750;

    // Plunger lane
    var PLUNGER_X = 383;
    var PLUNGER_LANE_W = 25;

    function createTable() {
        var table = {
            width: TABLE_W,
            height: TABLE_H,
            ballRadius: 8,
            plungerX: PLUNGER_X,
            plungerLaneW: PLUNGER_LANE_W,
            ballStartX: PLUNGER_X,
            ballStartY: TABLE_H - 60,
            walls: [],
            bumpers: [],
            flippers: [],
            dropTargets: [],
            spinners: [],
            lanes: [],
            rollovers: [],
            slingshots: []
        };

        // ========== WALLS ==========
        // Left wall
        table.walls.push({ type: 'segment', x1: 20, y1: 0, x2: 20, y2: TABLE_H });
        // Right wall (plunger lane outer)
        table.walls.push({ type: 'segment', x1: TABLE_W - 5, y1: 0, x2: TABLE_W - 5, y2: TABLE_H });
        // Top wall
        table.walls.push({ type: 'segment', x1: 20, y1: 20, x2: TABLE_W - 32, y2: 20 });
        // Bottom drain walls (leave gap for drain)
        table.walls.push({ type: 'segment', x1: 20, y1: TABLE_H - 5, x2: 130, y2: TABLE_H - 5 });
        table.walls.push({ type: 'segment', x1: 260, y1: TABLE_H - 5, x2: TABLE_W - 5, y2: TABLE_H - 5 });

        // Plunger lane inner wall (stops at top for ball to enter play)
        table.walls.push({ type: 'segment', x1: TABLE_W - 30, y1: 120, x2: TABLE_W - 30, y2: TABLE_H - 5 });

        // Top curve guide (sends ball from plunger lane to left)
        table.walls.push({ type: 'segment', x1: TABLE_W - 30, y1: 120, x2: TABLE_W - 60, y2: 55 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 60, y1: 55, x2: TABLE_W - 130, y2: 30 });

        // Upper guide rails
        table.walls.push({ type: 'segment', x1: 20, y1: 20, x2: 55, y2: 75 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 130, y1: 30, x2: TABLE_W - 160, y2: 50 });

        // Left outlane / inlane walls
        table.walls.push({ type: 'segment', x1: 20, y1: 560, x2: 55, y2: 620 });
        table.walls.push({ type: 'segment', x1: 55, y1: 620, x2: 75, y2: 640 });
        table.walls.push({ type: 'segment', x1: 75, y1: 620, x2: 95, y2: 640 });

        // Right outlane / inlane walls
        table.walls.push({ type: 'segment', x1: TABLE_W - 30, y1: 560, x2: TABLE_W - 65, y2: 620 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 65, y1: 620, x2: TABLE_W - 85, y2: 640 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 85, y1: 620, x2: TABLE_W - 105, y2: 640 });

        // Lower guide walls to flippers
        table.walls.push({ type: 'segment', x1: 75, y1: 640, x2: 110, y2: 680 });
        table.walls.push({ type: 'segment', x1: 95, y1: 640, x2: 120, y2: 675 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 85, y1: 640, x2: TABLE_W - 120, y2: 680 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 105, y1: 640, x2: TABLE_W - 130, y2: 675 });

        // Slingshot walls (triangular kickers near flippers)
        // Left slingshot
        table.walls.push({ type: 'segment', x1: 65, y1: 580, x2: 100, y2: 640, restitution: 1.2 });
        table.walls.push({ type: 'segment', x1: 65, y1: 580, x2: 65, y2: 640, restitution: 1.2 });
        table.walls.push({ type: 'segment', x1: 65, y1: 640, x2: 100, y2: 640, restitution: 1.2 });
        // Right slingshot
        table.walls.push({ type: 'segment', x1: TABLE_W - 75, y1: 580, x2: TABLE_W - 110, y2: 640, restitution: 1.2 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 75, y1: 580, x2: TABLE_W - 75, y2: 640, restitution: 1.2 });
        table.walls.push({ type: 'segment', x1: TABLE_W - 75, y1: 640, x2: TABLE_W - 110, y2: 640, restitution: 1.2 });

        // Upper ramp entrance walls
        table.walls.push({ type: 'segment', x1: 140, y1: 200, x2: 150, y2: 140 });
        table.walls.push({ type: 'segment', x1: 170, y1: 200, x2: 175, y2: 140 });

        // Mid-table divider / wire guide
        table.walls.push({ type: 'segment', x1: 200, y1: 350, x2: 200, y2: 420 });

        // ========== BUMPERS ==========
        // Top bumper cluster (3 round bumpers)
        table.bumpers.push({ x: 140, y: 230, radius: 25, points: 100, restitution: 1.5, hitTimer: 0, color: 'neonPink' });
        table.bumpers.push({ x: 210, y: 200, radius: 25, points: 100, restitution: 1.5, hitTimer: 0, color: 'neonBlue' });
        table.bumpers.push({ x: 175, y: 290, radius: 25, points: 100, restitution: 1.5, hitTimer: 0, color: 'neonYellow' });

        // Extra bumper near top right
        table.bumpers.push({ x: 280, y: 250, radius: 20, points: 150, restitution: 1.6, hitTimer: 0, color: 'neonGreen' });

        // Small kicker bumper mid-left
        table.bumpers.push({ x: 80, y: 400, radius: 15, points: 50, restitution: 1.3, hitTimer: 0, color: 'neonPink' });

        // ========== FLIPPERS ==========
        table.flippers.push(new Flipper(130, 700, 55, 'left'));
        table.flippers.push(new Flipper(260, 700, 55, 'right'));

        // ========== DROP TARGETS ==========
        // Bank of 4 drop targets on upper left
        for (var i = 0; i < 4; i++) {
            table.dropTargets.push({
                x: 50, y: 300 + i * 30,
                w: 10, h: 22,
                active: true,
                points: 500,
                hitTimer: 0,
                label: ['N', 'E', 'O', 'N'][i]
            });
        }

        // Bank of 3 drop targets upper right
        for (var j = 0; j < 3; j++) {
            table.dropTargets.push({
                x: 290, y: 340 + j * 30,
                w: 10, h: 22,
                active: true,
                points: 750,
                hitTimer: 0,
                label: ['J', 'P', 'T'][j]
            });
        }

        // ========== SPINNERS ==========
        table.spinners.push({
            x: 120, y: 160,
            width: 30,
            angle: 0,
            spinSpeed: 0,
            points: 25
        });

        // ========== ROLLOVER LANES ==========
        // Top lanes (3 lanes)
        for (var l = 0; l < 3; l++) {
            table.rollovers.push({
                x: 100 + l * 60, y: 90,
                radius: 8,
                lit: false,
                points: 200,
                label: ['L', 'I', 'T'][l]
            });
        }

        // Inlane rollovers
        table.rollovers.push({
            x: 88, y: 630, radius: 6, lit: false, points: 100, label: '<'
        });
        table.rollovers.push({
            x: TABLE_W - 98, y: 630, radius: 6, lit: false, points: 100, label: '>'
        });

        // ========== SLINGSHOTS (visual markers) ==========
        table.slingshots.push({
            x1: 65, y1: 580, x2: 100, y2: 640, x3: 65, y3: 640, side: 'left', hitTimer: 0
        });
        table.slingshots.push({
            x1: TABLE_W - 75, y1: 580, x2: TABLE_W - 110, y2: 640, x3: TABLE_W - 75, y3: 640, side: 'right', hitTimer: 0
        });

        return table;
    }

    // Check if ball is in drain zone
    function isDrained(ball, table) {
        return ball.pos.y > table.height - 2 && ball.pos.x > 130 && ball.pos.x < 260;
    }

    // Check if ball went through a rollover lane
    function checkRollovers(ball, rollovers) {
        var hits = [];
        for (var i = 0; i < rollovers.length; i++) {
            var r = rollovers[i];
            var dx = ball.pos.x - r.x;
            var dy = ball.pos.y - r.y;
            if (dx * dx + dy * dy < (ball.radius + r.radius) * (ball.radius + r.radius)) {
                if (!r.lit) {
                    r.lit = true;
                    hits.push(r);
                }
            }
        }
        return hits;
    }

    // Check spinner
    function checkSpinners(ball, spinners) {
        var hits = [];
        for (var i = 0; i < spinners.length; i++) {
            var s = spinners[i];
            var dx = ball.pos.x - s.x;
            var dy = ball.pos.y - s.y;
            if (Math.abs(dx) < s.width / 2 + ball.radius && Math.abs(dy) < 8 + ball.radius) {
                s.spinSpeed = Math.abs(ball.vel.x) * 0.05 + 10;
                hits.push(s);
            }
        }
        return hits;
    }

    window.PinballTable = {
        create: createTable,
        isDrained: isDrained,
        checkRollovers: checkRollovers,
        checkSpinners: checkSpinners,
        TABLE_W: TABLE_W,
        TABLE_H: TABLE_H
    };
})();
