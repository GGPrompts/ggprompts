/* drawings.js — Pre-recorded drawing data for Sketch Detective
   Each drawing: { word, category, strokes: [ [{x,y,t}, ...], ... ] }
   Coordinates are normalized 0-1 range. t = ms from drawing start.
   Generated programmatically to ensure 100+ drawings across categories. */

window.SketchDrawings = (function () {
    'use strict';

    // Helper to build strokes from simplified path descriptions
    function line(x1, y1, x2, y2, t0, duration, points) {
        points = points || 12;
        var s = [];
        for (var i = 0; i < points; i++) {
            var p = i / (points - 1);
            s.push({
                x: x1 + (x2 - x1) * p + (Math.random() - 0.5) * 0.005,
                y: y1 + (y2 - y1) * p + (Math.random() - 0.5) * 0.005,
                t: t0 + duration * p
            });
        }
        return s;
    }

    function arc(cx, cy, rx, ry, startAngle, endAngle, t0, duration, points) {
        points = points || 20;
        var s = [];
        for (var i = 0; i < points; i++) {
            var p = i / (points - 1);
            var angle = startAngle + (endAngle - startAngle) * p;
            s.push({
                x: cx + rx * Math.cos(angle) + (Math.random() - 0.5) * 0.004,
                y: cy + ry * Math.sin(angle) + (Math.random() - 0.5) * 0.004,
                t: t0 + duration * p
            });
        }
        return s;
    }

    function circle(cx, cy, r, t0, duration, points) {
        return arc(cx, cy, r, r, 0, Math.PI * 2, t0, duration, points || 24);
    }

    function ellipse(cx, cy, rx, ry, t0, duration, points) {
        return arc(cx, cy, rx, ry, 0, Math.PI * 2, t0, duration, points || 24);
    }

    // Bezier curve helper
    function bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2, t0, duration, points) {
        points = points || 16;
        var s = [];
        for (var i = 0; i < points; i++) {
            var p = i / (points - 1);
            var ip = 1 - p;
            var x = ip*ip*ip*x1 + 3*ip*ip*p*cx1 + 3*ip*p*p*cx2 + p*p*p*x2;
            var y = ip*ip*ip*y1 + 3*ip*ip*p*cy1 + 3*ip*p*p*cy2 + p*p*p*y2;
            s.push({
                x: x + (Math.random() - 0.5) * 0.004,
                y: y + (Math.random() - 0.5) * 0.004,
                t: t0 + duration * p
            });
        }
        return s;
    }

    // Polyline helper — array of [x,y] pairs
    function polyline(pts, t0, duration) {
        var totalLen = 0;
        var segs = [];
        for (var i = 1; i < pts.length; i++) {
            var dx = pts[i][0] - pts[i-1][0];
            var dy = pts[i][1] - pts[i-1][1];
            var len = Math.sqrt(dx*dx + dy*dy);
            segs.push(len);
            totalLen += len;
        }
        var s = [];
        var elapsed = 0;
        for (var i = 0; i < pts.length; i++) {
            s.push({
                x: pts[i][0] + (Math.random() - 0.5) * 0.004,
                y: pts[i][1] + (Math.random() - 0.5) * 0.004,
                t: t0 + elapsed
            });
            if (i < segs.length) {
                elapsed += (segs[i] / totalLen) * duration;
            }
        }
        return s;
    }

    var categories = {
        ANIMALS: 'Animals',
        FOOD: 'Food',
        OBJECTS: 'Objects',
        VEHICLES: 'Vehicles',
        NATURE: 'Nature',
        SPORTS: 'Sports',
        CLOTHING: 'Clothing',
        BUILDINGS: 'Buildings',
        MUSIC: 'Music',
        TOOLS: 'Tools'
    };

    var drawings = [
        // ===== ANIMALS (15) =====
        {
            word: 'cat', category: categories.ANIMALS,
            strokes: [
                circle(0.5, 0.5, 0.18, 0, 800),           // head
                polyline([[0.35,0.35],[0.30,0.20],[0.38,0.32]], 850, 300), // left ear
                polyline([[0.65,0.35],[0.70,0.20],[0.62,0.32]], 1200, 300), // right ear
                circle(0.43, 0.48, 0.025, 1550, 200, 10),  // left eye
                circle(0.57, 0.48, 0.025, 1800, 200, 10),  // right eye
                polyline([[0.48,0.55],[0.50,0.57],[0.52,0.55]], 2050, 200), // nose
                line(0.50, 0.57, 0.50, 0.62, 2300, 150),   // mouth line
                arc(0.47, 0.62, 0.04, 0.02, 0, Math.PI, 2500, 200, 8), // mouth left
                arc(0.53, 0.62, 0.04, 0.02, 0, Math.PI, 2750, 200, 8), // mouth right
                line(0.35, 0.53, 0.15, 0.50, 3000, 200),   // whisker
                line(0.35, 0.56, 0.15, 0.56, 3250, 200),   // whisker
                line(0.65, 0.53, 0.85, 0.50, 3500, 200),   // whisker
                line(0.65, 0.56, 0.85, 0.56, 3750, 200),   // whisker
            ]
        },
        {
            word: 'dog', category: categories.ANIMALS,
            strokes: [
                ellipse(0.5, 0.45, 0.2, 0.17, 0, 800),     // head
                ellipse(0.5, 0.55, 0.12, 0.08, 850, 400),   // snout
                circle(0.50, 0.52, 0.02, 1300, 150, 8),     // nose
                circle(0.42, 0.42, 0.025, 1500, 200, 8),    // left eye
                circle(0.58, 0.42, 0.025, 1750, 200, 8),    // right eye
                bezier(0.30, 0.38, 0.22, 0.30, 0.20, 0.50, 0.28, 0.55, 2000, 400), // left ear
                bezier(0.70, 0.38, 0.78, 0.30, 0.80, 0.50, 0.72, 0.55, 2450, 400), // right ear
                arc(0.50, 0.60, 0.05, 0.03, 0, Math.PI, 2900, 250, 8), // mouth
                line(0.50, 0.60, 0.50, 0.63, 3200, 100),   // tongue start
                ellipse(0.50, 0.66, 0.025, 0.035, 3350, 250, 10), // tongue
            ]
        },
        {
            word: 'fish', category: categories.ANIMALS,
            strokes: [
                ellipse(0.45, 0.5, 0.22, 0.13, 0, 800),    // body
                polyline([[0.67,0.42],[0.80,0.30],[0.80,0.70],[0.67,0.58]], 850, 500), // tail
                circle(0.35, 0.47, 0.025, 1400, 200, 8),    // eye
                arc(0.50, 0.5, 0.08, 0.10, -0.5, 0.5, 1650, 300, 10), // gill
                polyline([[0.40,0.63],[0.45,0.70],[0.50,0.63]], 2000, 300), // bottom fin
                polyline([[0.38,0.38],[0.42,0.30],[0.48,0.37]], 2350, 300), // top fin
            ]
        },
        {
            word: 'bird', category: categories.ANIMALS,
            strokes: [
                circle(0.4, 0.4, 0.1, 0, 500),             // head
                ellipse(0.55, 0.5, 0.2, 0.13, 550, 700),   // body
                polyline([[0.30,0.40],[0.22,0.38],[0.30,0.42]], 1300, 250), // beak
                circle(0.42, 0.38, 0.02, 1600, 150, 8),     // eye
                bezier(0.65, 0.42, 0.80, 0.25, 0.85, 0.35, 0.78, 0.45, 1800, 400), // wing
                line(0.50, 0.63, 0.48, 0.78, 2250, 200),   // left leg
                line(0.60, 0.63, 0.62, 0.78, 2500, 200),   // right leg
                polyline([[0.44,0.78],[0.48,0.78],[0.52,0.78]], 2750, 150), // left foot
                polyline([[0.58,0.78],[0.62,0.78],[0.66,0.78]], 2950, 150), // right foot
            ]
        },
        {
            word: 'snake', category: categories.ANIMALS,
            strokes: [
                bezier(0.15, 0.5, 0.30, 0.30, 0.40, 0.70, 0.55, 0.40, 0, 600),
                bezier(0.55, 0.40, 0.65, 0.25, 0.75, 0.65, 0.85, 0.45, 650, 600),
                circle(0.15, 0.5, 0.03, 1300, 200, 10),     // head
                circle(0.13, 0.49, 0.008, 1550, 100, 6),    // eye
                polyline([[0.10,0.50],[0.07,0.49],[0.10,0.51]], 1700, 200), // tongue
            ]
        },
        {
            word: 'rabbit', category: categories.ANIMALS,
            strokes: [
                circle(0.5, 0.55, 0.15, 0, 700),           // head
                ellipse(0.42, 0.25, 0.04, 0.15, 750, 400),  // left ear
                ellipse(0.58, 0.25, 0.04, 0.15, 1200, 400), // right ear
                circle(0.44, 0.52, 0.02, 1650, 150, 8),     // left eye
                circle(0.56, 0.52, 0.02, 1850, 150, 8),     // right eye
                circle(0.50, 0.58, 0.015, 2050, 120, 8),    // nose
                arc(0.47, 0.62, 0.03, 0.02, 0, Math.PI, 2200, 200, 8),
                arc(0.53, 0.62, 0.03, 0.02, 0, Math.PI, 2450, 200, 8),
                line(0.36, 0.56, 0.20, 0.54, 2700, 200),   // whisker
                line(0.64, 0.56, 0.80, 0.54, 2950, 200),   // whisker
            ]
        },
        {
            word: 'elephant', category: categories.ANIMALS,
            strokes: [
                ellipse(0.45, 0.45, 0.22, 0.18, 0, 900),   // body/head
                bezier(0.25, 0.42, 0.15, 0.40, 0.12, 0.55, 0.20, 0.60, 950, 400), // left ear
                bezier(0.65, 0.42, 0.75, 0.40, 0.78, 0.55, 0.70, 0.60, 1400, 400), // right ear
                bezier(0.45, 0.58, 0.42, 0.70, 0.38, 0.80, 0.42, 0.85, 1850, 500), // trunk
                circle(0.38, 0.43, 0.02, 2400, 150, 8),     // left eye
                circle(0.52, 0.43, 0.02, 2600, 150, 8),     // right eye
                line(0.35, 0.63, 0.33, 0.82, 2800, 250),   // leg
                line(0.55, 0.63, 0.57, 0.82, 3100, 250),   // leg
            ]
        },
        {
            word: 'butterfly', category: categories.ANIMALS,
            strokes: [
                line(0.50, 0.30, 0.50, 0.70, 0, 400),      // body
                ellipse(0.35, 0.42, 0.14, 0.12, 450, 600),  // left top wing
                ellipse(0.65, 0.42, 0.14, 0.12, 1100, 600), // right top wing
                ellipse(0.37, 0.58, 0.10, 0.08, 1750, 400), // left bottom wing
                ellipse(0.63, 0.58, 0.10, 0.08, 2200, 400), // right bottom wing
                polyline([[0.48,0.30],[0.42,0.20]], 2650, 200), // left antenna
                polyline([[0.52,0.30],[0.58,0.20]], 2900, 200), // right antenna
            ]
        },
        {
            word: 'frog', category: categories.ANIMALS,
            strokes: [
                ellipse(0.5, 0.5, 0.22, 0.15, 0, 800),     // body
                circle(0.38, 0.35, 0.06, 850, 300),         // left eye bump
                circle(0.62, 0.35, 0.06, 1200, 300),        // right eye bump
                circle(0.38, 0.34, 0.025, 1550, 150, 8),    // left pupil
                circle(0.62, 0.34, 0.025, 1750, 150, 8),    // right pupil
                arc(0.5, 0.55, 0.12, 0.05, 0, Math.PI, 1950, 300, 12), // mouth
                line(0.30, 0.60, 0.18, 0.75, 2300, 200),   // left leg
                line(0.70, 0.60, 0.82, 0.75, 2550, 200),   // right leg
            ]
        },
        {
            word: 'turtle', category: categories.ANIMALS,
            strokes: [
                arc(0.50, 0.48, 0.22, 0.16, Math.PI, 0, 0, 700), // shell top
                line(0.28, 0.48, 0.72, 0.48, 750, 300),    // shell bottom
                circle(0.25, 0.50, 0.06, 1100, 300),        // head
                circle(0.24, 0.49, 0.015, 1450, 100, 6),    // eye
                line(0.35, 0.48, 0.33, 0.60, 1600, 200),   // front leg
                line(0.65, 0.48, 0.67, 0.60, 1850, 200),   // back leg
                bezier(0.72, 0.48, 0.80, 0.47, 0.82, 0.50, 0.78, 0.52, 2100, 250), // tail
                arc(0.45, 0.42, 0.06, 0.04, Math.PI, 0, 2400, 200, 8), // shell pattern
                arc(0.55, 0.42, 0.06, 0.04, Math.PI, 0, 2650, 200, 8), // shell pattern
            ]
        },
        {
            word: 'penguin', category: categories.ANIMALS,
            strokes: [
                ellipse(0.5, 0.5, 0.14, 0.25, 0, 900),     // body
                circle(0.5, 0.30, 0.09, 950, 400),          // head
                circle(0.47, 0.28, 0.02, 1400, 150, 8),     // left eye
                circle(0.53, 0.28, 0.02, 1600, 150, 8),     // right eye
                polyline([[0.50,0.32],[0.47,0.36],[0.53,0.36]], 1800, 250), // beak
                bezier(0.36, 0.45, 0.25, 0.50, 0.28, 0.65, 0.35, 0.68, 2100, 400), // left wing
                bezier(0.64, 0.45, 0.75, 0.50, 0.72, 0.65, 0.65, 0.68, 2550, 400), // right wing
                line(0.45, 0.75, 0.42, 0.82, 3000, 150),   // left foot
                line(0.55, 0.75, 0.58, 0.82, 3200, 150),   // right foot
            ]
        },
        {
            word: 'spider', category: categories.ANIMALS,
            strokes: [
                circle(0.5, 0.5, 0.08, 0, 400),            // body
                circle(0.5, 0.38, 0.05, 450, 300),          // head
                bezier(0.44, 0.48, 0.30, 0.35, 0.20, 0.40, 0.15, 0.35, 800, 250), // leg1
                bezier(0.44, 0.50, 0.28, 0.45, 0.18, 0.50, 0.12, 0.48, 1100, 250), // leg2
                bezier(0.44, 0.52, 0.28, 0.55, 0.18, 0.58, 0.12, 0.60, 1400, 250), // leg3
                bezier(0.44, 0.55, 0.30, 0.65, 0.20, 0.68, 0.15, 0.72, 1700, 250), // leg4
                bezier(0.56, 0.48, 0.70, 0.35, 0.80, 0.40, 0.85, 0.35, 2000, 250), // leg5
                bezier(0.56, 0.50, 0.72, 0.45, 0.82, 0.50, 0.88, 0.48, 2300, 250), // leg6
                bezier(0.56, 0.52, 0.72, 0.55, 0.82, 0.58, 0.88, 0.60, 2600, 250), // leg7
                bezier(0.56, 0.55, 0.70, 0.65, 0.80, 0.68, 0.85, 0.72, 2900, 250), // leg8
            ]
        },
        {
            word: 'whale', category: categories.ANIMALS,
            strokes: [
                ellipse(0.45, 0.5, 0.28, 0.15, 0, 900),    // body
                polyline([[0.73, 0.45],[0.85,0.32],[0.85,0.68],[0.73,0.55]], 950, 500), // tail
                circle(0.25, 0.47, 0.02, 1500, 150, 8),     // eye
                line(0.30, 0.58, 0.60, 0.58, 1700, 300),   // mouth line
                bezier(0.35, 0.35, 0.38, 0.22, 0.42, 0.22, 0.40, 0.30, 2050, 350), // spout
                bezier(0.40, 0.25, 0.35, 0.18, 0.45, 0.15, 0.42, 0.20, 2450, 250), // spout droplets
            ]
        },
        {
            word: 'horse', category: categories.ANIMALS,
            strokes: [
                ellipse(0.50, 0.50, 0.20, 0.12, 0, 800),   // body
                ellipse(0.28, 0.38, 0.08, 0.10, 850, 500),  // head
                circle(0.26, 0.36, 0.015, 1400, 120, 6),    // eye
                polyline([[0.30,0.28],[0.28,0.20],[0.32,0.22]], 1570, 250), // ear
                bezier(0.33, 0.30, 0.40, 0.25, 0.45, 0.30, 0.42, 0.38, 1870, 400), // neck/mane
                line(0.38, 0.62, 0.36, 0.82, 2320, 200),   // front left leg
                line(0.44, 0.62, 0.42, 0.82, 2570, 200),   // front right leg
                line(0.58, 0.62, 0.56, 0.82, 2820, 200),   // back left leg
                line(0.64, 0.62, 0.62, 0.82, 3070, 200),   // back right leg
                bezier(0.70, 0.48, 0.80, 0.55, 0.82, 0.65, 0.78, 0.72, 3320, 400), // tail
            ]
        },
        {
            word: 'shark', category: categories.ANIMALS,
            strokes: [
                ellipse(0.45, 0.50, 0.28, 0.10, 0, 800),   // body
                polyline([[0.73,0.48],[0.85,0.38],[0.85,0.62],[0.73,0.52]], 850, 450), // tail
                polyline([[0.45,0.40],[0.50,0.28],[0.55,0.40]], 1350, 350), // dorsal fin
                circle(0.25, 0.48, 0.015, 1750, 120, 6),    // eye
                polyline([[0.17,0.50],[0.20,0.53],[0.45,0.53],[0.50,0.50]], 1920, 400), // mouth
                polyline([[0.22,0.53],[0.24,0.50],[0.26,0.53],[0.28,0.50],[0.30,0.53]], 2370, 300), // teeth
            ]
        },

        // ===== FOOD (12) =====
        {
            word: 'apple', category: categories.FOOD,
            strokes: [
                circle(0.5, 0.52, 0.17, 0, 800),           // body
                line(0.50, 0.35, 0.52, 0.25, 850, 200),    // stem
                bezier(0.52, 0.28, 0.58, 0.25, 0.60, 0.32, 0.56, 0.35, 1100, 300), // leaf
            ]
        },
        {
            word: 'pizza', category: categories.FOOD,
            strokes: [
                polyline([[0.25,0.70],[0.50,0.20],[0.75,0.70]], 0, 600), // triangle
                line(0.25, 0.70, 0.75, 0.70, 650, 300),    // bottom arc
                circle(0.42, 0.50, 0.03, 1000, 200, 8),     // pepperoni
                circle(0.55, 0.45, 0.03, 1250, 200, 8),     // pepperoni
                circle(0.48, 0.60, 0.03, 1500, 200, 8),     // pepperoni
                circle(0.60, 0.58, 0.025, 1750, 200, 8),    // pepperoni
            ]
        },
        {
            word: 'banana', category: categories.FOOD,
            strokes: [
                bezier(0.25, 0.55, 0.30, 0.30, 0.65, 0.25, 0.75, 0.40, 0, 800),
                bezier(0.75, 0.40, 0.70, 0.50, 0.35, 0.55, 0.25, 0.55, 850, 800),
                line(0.75, 0.40, 0.78, 0.38, 1700, 150),   // stem tip
            ]
        },
        {
            word: 'cake', category: categories.FOOD,
            strokes: [
                polyline([[0.25,0.40],[0.25,0.70],[0.75,0.70],[0.75,0.40]], 0, 600), // box
                arc(0.50, 0.40, 0.25, 0.08, Math.PI, 0, 650, 400), // top dome
                line(0.25, 0.55, 0.75, 0.55, 1100, 300),   // layer line
                bezier(0.30, 0.40, 0.35, 0.35, 0.40, 0.40, 0.45, 0.35, 1450, 300), // frosting drip
                bezier(0.50, 0.40, 0.55, 0.35, 0.60, 0.40, 0.65, 0.35, 1800, 300),
                line(0.50, 0.32, 0.50, 0.22, 2150, 200),   // candle
                circle(0.50, 0.20, 0.02, 2400, 150, 8),     // flame
            ]
        },
        {
            word: 'ice cream', category: categories.FOOD,
            strokes: [
                polyline([[0.38,0.50],[0.50,0.82],[0.62,0.50]], 0, 500), // cone
                line(0.38, 0.50, 0.62, 0.50, 550, 200),    // cone top
                arc(0.50, 0.40, 0.12, 0.12, Math.PI, 0, 800, 500), // scoop
                arc(0.50, 0.40, 0.12, 0.12, 0, Math.PI, 1350, 500),
                line(0.42, 0.55, 0.58, 0.55, 1900, 200),   // cone line
                line(0.44, 0.62, 0.56, 0.62, 2150, 200),   // cone line
            ]
        },
        {
            word: 'hamburger', category: categories.FOOD,
            strokes: [
                arc(0.50, 0.38, 0.22, 0.12, Math.PI, 0, 0, 600), // top bun
                line(0.28, 0.38, 0.72, 0.38, 650, 250),    // top bun bottom
                line(0.26, 0.48, 0.74, 0.48, 950, 250),    // patty top
                line(0.26, 0.54, 0.74, 0.54, 1250, 250),   // patty bottom
                bezier(0.28, 0.42, 0.40, 0.46, 0.60, 0.38, 0.72, 0.42, 1550, 300), // lettuce
                line(0.28, 0.60, 0.72, 0.60, 1900, 250),   // bottom bun top
                arc(0.50, 0.60, 0.22, 0.08, 0, Math.PI, 2200, 500), // bottom bun
            ]
        },
        {
            word: 'cookie', category: categories.FOOD,
            strokes: [
                circle(0.50, 0.50, 0.20, 0, 800),          // cookie
                circle(0.42, 0.44, 0.02, 850, 150, 6),      // chip
                circle(0.55, 0.42, 0.02, 1050, 150, 6),     // chip
                circle(0.48, 0.55, 0.02, 1250, 150, 6),     // chip
                circle(0.58, 0.54, 0.02, 1450, 150, 6),     // chip
                circle(0.40, 0.56, 0.015, 1650, 120, 6),    // chip
                circle(0.52, 0.46, 0.015, 1820, 120, 6),    // chip
            ]
        },
        {
            word: 'donut', category: categories.FOOD,
            strokes: [
                circle(0.50, 0.50, 0.20, 0, 800),          // outer
                circle(0.50, 0.50, 0.08, 850, 500),         // hole
                arc(0.50, 0.45, 0.18, 0.06, Math.PI+0.3, -0.3, 1400, 400), // icing top
            ]
        },
        {
            word: 'watermelon', category: categories.FOOD,
            strokes: [
                arc(0.50, 0.55, 0.25, 0.22, Math.PI, 0, 0, 700), // top curve
                line(0.25, 0.55, 0.75, 0.55, 750, 300),    // flat bottom
                arc(0.50, 0.55, 0.20, 0.15, Math.PI, 0, 1100, 500), // rind inner line
                circle(0.40, 0.48, 0.012, 1650, 100, 6),    // seed
                circle(0.50, 0.45, 0.012, 1800, 100, 6),    // seed
                circle(0.60, 0.48, 0.012, 1950, 100, 6),    // seed
                circle(0.45, 0.52, 0.012, 2100, 100, 6),    // seed
                circle(0.55, 0.52, 0.012, 2250, 100, 6),    // seed
            ]
        },
        {
            word: 'carrot', category: categories.FOOD,
            strokes: [
                polyline([[0.40,0.30],[0.50,0.80],[0.60,0.30]], 0, 600), // body triangle
                line(0.40, 0.30, 0.60, 0.30, 650, 200),    // top
                bezier(0.45, 0.30, 0.40, 0.18, 0.35, 0.15, 0.38, 0.12, 900, 300), // leaf
                bezier(0.50, 0.30, 0.50, 0.15, 0.48, 0.10, 0.52, 0.08, 1250, 300), // leaf
                bezier(0.55, 0.30, 0.60, 0.18, 0.65, 0.15, 0.62, 0.12, 1600, 300), // leaf
                line(0.43, 0.42, 0.57, 0.42, 1950, 200),   // stripe
                line(0.45, 0.52, 0.55, 0.52, 2200, 200),   // stripe
                line(0.47, 0.62, 0.53, 0.62, 2450, 200),   // stripe
            ]
        },
        {
            word: 'cherry', category: categories.FOOD,
            strokes: [
                circle(0.40, 0.60, 0.10, 0, 500),          // left cherry
                circle(0.60, 0.55, 0.10, 550, 500),         // right cherry
                bezier(0.40, 0.50, 0.40, 0.30, 0.50, 0.25, 0.50, 0.22, 1100, 400), // left stem
                bezier(0.60, 0.45, 0.60, 0.30, 0.52, 0.25, 0.50, 0.22, 1550, 400), // right stem
            ]
        },
        {
            word: 'egg', category: categories.FOOD,
            strokes: [
                ellipse(0.50, 0.50, 0.15, 0.20, 0, 800),   // egg shape
                // add slight top narrowing with overlay arc
                arc(0.50, 0.38, 0.12, 0.08, Math.PI+0.3, -0.3, 850, 400),
            ]
        },

        // ===== OBJECTS (15) =====
        {
            word: 'umbrella', category: categories.OBJECTS,
            strokes: [
                arc(0.50, 0.38, 0.25, 0.18, Math.PI, 0, 0, 700), // canopy
                line(0.25, 0.38, 0.75, 0.38, 750, 300),    // canopy bottom
                line(0.50, 0.38, 0.50, 0.78, 1100, 400),   // shaft
                bezier(0.50, 0.78, 0.50, 0.84, 0.45, 0.84, 0.44, 0.80, 1550, 300), // handle hook
            ]
        },
        {
            word: 'key', category: categories.OBJECTS,
            strokes: [
                circle(0.35, 0.50, 0.10, 0, 500),          // bow (top circle)
                circle(0.35, 0.50, 0.05, 550, 300),         // bow hole
                line(0.45, 0.50, 0.78, 0.50, 900, 350),    // shaft
                line(0.78, 0.50, 0.78, 0.58, 1300, 150),   // bit1
                line(0.72, 0.50, 0.72, 0.56, 1500, 150),   // bit2
            ]
        },
        {
            word: 'book', category: categories.OBJECTS,
            strokes: [
                polyline([[0.30,0.25],[0.30,0.75],[0.70,0.75],[0.70,0.25],[0.30,0.25]], 0, 700),
                line(0.32, 0.25, 0.32, 0.75, 750, 250),    // spine
                line(0.38, 0.38, 0.64, 0.38, 1050, 200),   // text line
                line(0.38, 0.45, 0.64, 0.45, 1300, 200),   // text line
                line(0.38, 0.52, 0.58, 0.52, 1550, 200),   // text line
                line(0.38, 0.59, 0.62, 0.59, 1800, 200),   // text line
            ]
        },
        {
            word: 'clock', category: categories.OBJECTS,
            strokes: [
                circle(0.50, 0.50, 0.22, 0, 900),          // face
                line(0.50, 0.50, 0.50, 0.32, 950, 250),    // hour hand (12)
                line(0.50, 0.50, 0.65, 0.45, 1250, 250),   // minute hand (2)
                circle(0.50, 0.50, 0.015, 1550, 120, 6),    // center dot
                // hour markers
                line(0.50, 0.30, 0.50, 0.32, 1720, 80),    // 12
                line(0.70, 0.50, 0.68, 0.50, 1850, 80),    // 3
                line(0.50, 0.70, 0.50, 0.68, 1980, 80),    // 6
                line(0.30, 0.50, 0.32, 0.50, 2110, 80),    // 9
            ]
        },
        {
            word: 'lightbulb', category: categories.OBJECTS,
            strokes: [
                arc(0.50, 0.40, 0.15, 0.18, Math.PI+0.5, -0.5, 0, 700), // bulb top
                line(0.38, 0.55, 0.38, 0.65, 750, 200),    // left neck
                line(0.62, 0.55, 0.62, 0.65, 1000, 200),   // right neck
                line(0.38, 0.65, 0.62, 0.65, 1250, 200),   // base top
                line(0.40, 0.68, 0.60, 0.68, 1500, 150),   // screw line
                line(0.40, 0.71, 0.60, 0.71, 1700, 150),   // screw line
                arc(0.50, 0.73, 0.10, 0.04, 0, Math.PI, 1900, 250), // base bottom
            ]
        },
        {
            word: 'hat', category: categories.OBJECTS,
            strokes: [
                arc(0.50, 0.50, 0.12, 0.20, Math.PI, 0, 0, 600), // crown
                line(0.38, 0.50, 0.62, 0.50, 650, 200),    // crown bottom
                line(0.20, 0.52, 0.80, 0.52, 900, 300),    // brim
                arc(0.50, 0.52, 0.30, 0.06, 0, Math.PI, 1250, 400), // brim curve
            ]
        },
        {
            word: 'glasses', category: categories.OBJECTS,
            strokes: [
                circle(0.35, 0.50, 0.10, 0, 500),          // left lens
                circle(0.65, 0.50, 0.10, 550, 500),         // right lens
                line(0.45, 0.50, 0.55, 0.50, 1100, 200),   // bridge
                line(0.25, 0.50, 0.15, 0.48, 1350, 200),   // left arm
                line(0.75, 0.50, 0.85, 0.48, 1600, 200),   // right arm
            ]
        },
        {
            word: 'scissors', category: categories.OBJECTS,
            strokes: [
                circle(0.38, 0.62, 0.07, 0, 400),          // left finger hole
                circle(0.62, 0.62, 0.07, 450, 400),         // right finger hole
                line(0.42, 0.56, 0.55, 0.25, 900, 350),    // left blade
                line(0.58, 0.56, 0.45, 0.25, 1300, 350),   // right blade (crossed)
            ]
        },
        {
            word: 'pencil', category: categories.OBJECTS,
            strokes: [
                polyline([[0.25,0.55],[0.25,0.45],[0.68,0.45],[0.68,0.55],[0.25,0.55]], 0, 600),
                polyline([[0.68,0.45],[0.80,0.50],[0.68,0.55]], 650, 300), // tip
                line(0.30, 0.45, 0.30, 0.55, 1000, 150),   // eraser line
                line(0.75, 0.47, 0.78, 0.50, 1200, 100),   // tip detail
                line(0.75, 0.53, 0.78, 0.50, 1350, 100),
            ]
        },
        {
            word: 'cup', category: categories.OBJECTS,
            strokes: [
                polyline([[0.32,0.30],[0.30,0.70],[0.70,0.70],[0.68,0.30]], 0, 600),
                line(0.32, 0.30, 0.68, 0.30, 650, 200),    // rim
                arc(0.50, 0.70, 0.20, 0.05, 0, Math.PI, 900, 300), // bottom curve
                bezier(0.68, 0.38, 0.82, 0.38, 0.82, 0.60, 0.68, 0.60, 1250, 400), // handle
            ]
        },
        {
            word: 'star', category: categories.OBJECTS,
            strokes: [
                polyline([
                    [0.50, 0.20], [0.58, 0.42], [0.80, 0.42],
                    [0.62, 0.56], [0.70, 0.78], [0.50, 0.64],
                    [0.30, 0.78], [0.38, 0.56], [0.20, 0.42],
                    [0.42, 0.42], [0.50, 0.20]
                ], 0, 1500),
            ]
        },
        {
            word: 'heart', category: categories.OBJECTS,
            strokes: [
                bezier(0.50, 0.40, 0.50, 0.25, 0.25, 0.20, 0.25, 0.42, 0, 600),
                bezier(0.25, 0.42, 0.25, 0.60, 0.50, 0.75, 0.50, 0.78, 650, 600),
                bezier(0.50, 0.40, 0.50, 0.25, 0.75, 0.20, 0.75, 0.42, 1300, 600),
                bezier(0.75, 0.42, 0.75, 0.60, 0.50, 0.75, 0.50, 0.78, 1950, 600),
            ]
        },
        {
            word: 'diamond', category: categories.OBJECTS,
            strokes: [
                polyline([
                    [0.50, 0.20], [0.75, 0.45], [0.50, 0.80],
                    [0.25, 0.45], [0.50, 0.20]
                ], 0, 800),
                line(0.25, 0.45, 0.75, 0.45, 850, 300),    // horizontal facet
                line(0.50, 0.20, 0.40, 0.45, 1200, 200),   // left facet
                line(0.50, 0.20, 0.60, 0.45, 1450, 200),   // right facet
                line(0.40, 0.45, 0.50, 0.80, 1700, 200),
                line(0.60, 0.45, 0.50, 0.80, 1950, 200),
            ]
        },
        {
            word: 'balloon', category: categories.OBJECTS,
            strokes: [
                ellipse(0.50, 0.40, 0.14, 0.20, 0, 800),   // balloon
                polyline([[0.50, 0.60],[0.48, 0.63],[0.52, 0.63]], 850, 200), // knot
                bezier(0.50, 0.63, 0.45, 0.72, 0.55, 0.78, 0.50, 0.85, 1100, 400), // string
            ]
        },
        {
            word: 'candle', category: categories.OBJECTS,
            strokes: [
                polyline([[0.42,0.40],[0.42,0.75],[0.58,0.75],[0.58,0.40]], 0, 500),
                line(0.42, 0.40, 0.58, 0.40, 550, 150),    // top
                line(0.50, 0.40, 0.50, 0.30, 750, 200),    // wick
                ellipse(0.50, 0.26, 0.04, 0.06, 1000, 350), // flame
                arc(0.50, 0.75, 0.10, 0.04, 0, Math.PI, 1400, 250), // base
            ]
        },

        // ===== VEHICLES (10) =====
        {
            word: 'car', category: categories.VEHICLES,
            strokes: [
                polyline([[0.20,0.55],[0.20,0.45],[0.35,0.45],[0.42,0.32],[0.62,0.32],[0.75,0.45],[0.82,0.45],[0.82,0.55]], 0, 800),
                line(0.20, 0.55, 0.82, 0.55, 850, 300),    // bottom
                circle(0.32, 0.58, 0.06, 1200, 400),        // left wheel
                circle(0.70, 0.58, 0.06, 1650, 400),        // right wheel
                line(0.42, 0.45, 0.42, 0.32, 2100, 200),   // windshield left
                line(0.62, 0.45, 0.62, 0.32, 2350, 200),   // windshield right
            ]
        },
        {
            word: 'bicycle', category: categories.VEHICLES,
            strokes: [
                circle(0.30, 0.58, 0.12, 0, 600),           // back wheel
                circle(0.70, 0.58, 0.12, 650, 600),          // front wheel
                line(0.30, 0.58, 0.50, 0.40, 1300, 250),    // seat tube
                line(0.50, 0.40, 0.70, 0.58, 1600, 250),    // down tube
                line(0.30, 0.58, 0.50, 0.58, 1900, 200),    // chain stay
                line(0.50, 0.58, 0.50, 0.40, 2150, 200),    // seat post
                line(0.50, 0.40, 0.56, 0.38, 2400, 150),    // top tube
                polyline([[0.56,0.38],[0.56,0.32],[0.60,0.35]], 2600, 250), // handlebars
                line(0.48, 0.38, 0.52, 0.36, 2900, 150),    // seat
            ]
        },
        {
            word: 'airplane', category: categories.VEHICLES,
            strokes: [
                ellipse(0.50, 0.50, 0.30, 0.06, 0, 700),   // fuselage
                polyline([[0.40,0.44],[0.50,0.22],[0.60,0.44]], 750, 500), // top wing
                polyline([[0.72,0.46],[0.82,0.35],[0.82,0.50]], 1300, 350), // tail fin
                polyline([[0.72,0.50],[0.80,0.56],[0.72,0.55]], 1700, 300), // tail wing
                line(0.20, 0.50, 0.22, 0.50, 2050, 100),   // nose tip
            ]
        },
        {
            word: 'boat', category: categories.VEHICLES,
            strokes: [
                polyline([[0.18,0.55],[0.25,0.70],[0.75,0.70],[0.82,0.55]], 0, 600),
                line(0.18, 0.55, 0.82, 0.55, 650, 300),    // deck
                line(0.50, 0.55, 0.50, 0.25, 1000, 300),   // mast
                polyline([[0.50,0.25],[0.70,0.40],[0.50,0.52]], 1350, 500), // sail
            ]
        },
        {
            word: 'rocket', category: categories.VEHICLES,
            strokes: [
                polyline([[0.42,0.70],[0.42,0.35],[0.50,0.18],[0.58,0.35],[0.58,0.70]], 0, 800),
                line(0.42, 0.70, 0.58, 0.70, 850, 200),    // bottom
                polyline([[0.42,0.60],[0.32,0.72],[0.42,0.68]], 1100, 300), // left fin
                polyline([[0.58,0.60],[0.68,0.72],[0.58,0.68]], 1450, 300), // right fin
                circle(0.50, 0.45, 0.04, 1800, 250),        // window
                // flames
                polyline([[0.44,0.70],[0.47,0.80],[0.50,0.75],[0.53,0.82],[0.56,0.70]], 2100, 400),
            ]
        },
        {
            word: 'helicopter', category: categories.VEHICLES,
            strokes: [
                ellipse(0.45, 0.50, 0.18, 0.10, 0, 700),   // body
                line(0.20, 0.42, 0.75, 0.42, 750, 350),    // main rotor
                line(0.47, 0.42, 0.47, 0.40, 1150, 100),   // rotor shaft
                bezier(0.63, 0.48, 0.75, 0.46, 0.82, 0.40, 0.85, 0.38, 1300, 400), // tail boom
                line(0.82, 0.34, 0.88, 0.42, 1750, 250),   // tail rotor
                circle(0.38, 0.48, 0.05, 2050, 300),        // window
                line(0.35, 0.60, 0.55, 0.60, 2400, 200),   // skid
            ]
        },
        {
            word: 'train', category: categories.VEHICLES,
            strokes: [
                polyline([[0.15,0.40],[0.15,0.60],[0.75,0.60],[0.75,0.40],[0.15,0.40]], 0, 700),
                line(0.45, 0.40, 0.45, 0.60, 750, 200),    // car divider
                polyline([[0.75,0.50],[0.85,0.45],[0.85,0.60],[0.75,0.60]], 1000, 400), // engine front
                circle(0.25, 0.63, 0.05, 1450, 300),        // wheel
                circle(0.55, 0.63, 0.05, 1800, 300),        // wheel
                circle(0.80, 0.63, 0.05, 2150, 300),        // wheel
                polyline([[0.82,0.45],[0.82,0.30],[0.78,0.30]], 2500, 300), // smokestack
                circle(0.78, 0.25, 0.04, 2850, 250),        // smoke
            ]
        },
        {
            word: 'bus', category: categories.VEHICLES,
            strokes: [
                polyline([[0.15,0.35],[0.15,0.62],[0.85,0.62],[0.85,0.35],[0.15,0.35]], 0, 700),
                line(0.15, 0.50, 0.85, 0.50, 750, 300),    // window line
                line(0.35, 0.35, 0.35, 0.50, 1100, 150),   // window divider
                line(0.55, 0.35, 0.55, 0.50, 1300, 150),   // window divider
                line(0.75, 0.35, 0.75, 0.50, 1500, 150),   // window divider
                circle(0.28, 0.65, 0.05, 1700, 300),        // left wheel
                circle(0.72, 0.65, 0.05, 2050, 300),        // right wheel
                line(0.15, 0.55, 0.20, 0.55, 2400, 100),   // door
                line(0.20, 0.50, 0.20, 0.62, 2550, 150),
            ]
        },
        {
            word: 'truck', category: categories.VEHICLES,
            strokes: [
                polyline([[0.10,0.42],[0.10,0.60],[0.90,0.60],[0.90,0.42]], 0, 600),
                line(0.10, 0.42, 0.55, 0.42, 650, 250),    // cab top line
                polyline([[0.55,0.42],[0.55,0.32],[0.90,0.32],[0.90,0.42]], 950, 400), // cargo box
                line(0.55, 0.42, 0.55, 0.60, 1400, 200),   // divider
                circle(0.25, 0.63, 0.05, 1650, 300),        // wheel
                circle(0.78, 0.63, 0.05, 2000, 300),        // wheel
            ]
        },
        {
            word: 'submarine', category: categories.VEHICLES,
            strokes: [
                ellipse(0.50, 0.52, 0.30, 0.10, 0, 800),   // hull
                polyline([[0.48,0.42],[0.48,0.32],[0.55,0.32],[0.55,0.42]], 850, 400), // conning tower
                line(0.55, 0.35, 0.62, 0.30, 1300, 200),   // periscope
                line(0.62, 0.30, 0.62, 0.25, 1550, 150),
                circle(0.35, 0.52, 0.04, 1750, 250),        // porthole
                circle(0.50, 0.52, 0.04, 2050, 250),        // porthole
                circle(0.65, 0.52, 0.04, 2350, 250),        // porthole
                polyline([[0.78,0.48],[0.88,0.42],[0.88,0.62],[0.78,0.56]], 2650, 350), // propeller area
            ]
        },

        // ===== NATURE (10) =====
        {
            word: 'tree', category: categories.NATURE,
            strokes: [
                polyline([[0.45,0.55],[0.45,0.85],[0.55,0.85],[0.55,0.55]], 0, 400), // trunk
                circle(0.50, 0.38, 0.20, 450, 800),         // crown
            ]
        },
        {
            word: 'flower', category: categories.NATURE,
            strokes: [
                line(0.50, 0.55, 0.50, 0.85, 0, 300),      // stem
                circle(0.50, 0.45, 0.05, 350, 300),          // center
                circle(0.50, 0.35, 0.05, 700, 250),          // petal top
                circle(0.58, 0.40, 0.05, 1000, 250),         // petal right
                circle(0.55, 0.50, 0.05, 1300, 250),         // petal bottom-right
                circle(0.45, 0.50, 0.05, 1600, 250),         // petal bottom-left
                circle(0.42, 0.40, 0.05, 1900, 250),         // petal left
                bezier(0.50, 0.70, 0.42, 0.68, 0.35, 0.62, 0.30, 0.60, 2200, 300), // leaf
            ]
        },
        {
            word: 'sun', category: categories.NATURE,
            strokes: [
                circle(0.50, 0.50, 0.12, 0, 600),           // sun body
                line(0.50, 0.32, 0.50, 0.22, 650, 150),    // ray top
                line(0.50, 0.68, 0.50, 0.78, 850, 150),    // ray bottom
                line(0.32, 0.50, 0.22, 0.50, 1050, 150),   // ray left
                line(0.68, 0.50, 0.78, 0.50, 1250, 150),   // ray right
                line(0.38, 0.38, 0.30, 0.30, 1450, 150),   // ray top-left
                line(0.62, 0.38, 0.70, 0.30, 1650, 150),   // ray top-right
                line(0.38, 0.62, 0.30, 0.70, 1850, 150),   // ray bottom-left
                line(0.62, 0.62, 0.70, 0.70, 2050, 150),   // ray bottom-right
            ]
        },
        {
            word: 'moon', category: categories.NATURE,
            strokes: [
                arc(0.50, 0.50, 0.20, 0.20, -1.2, Math.PI+1.2, 0, 800),
                arc(0.58, 0.50, 0.16, 0.18, Math.PI+1.0, -1.0+Math.PI*2, 850, 700),
            ]
        },
        {
            word: 'mountain', category: categories.NATURE,
            strokes: [
                polyline([[0.10,0.75],[0.40,0.25],[0.65,0.75]], 0, 600), // main peak
                polyline([[0.35,0.75],[0.60,0.35],[0.88,0.75]], 650, 600), // second peak
                polyline([[0.35,0.35],[0.40,0.25],[0.48,0.38]], 1300, 300), // snow cap
            ]
        },
        {
            word: 'cloud', category: categories.NATURE,
            strokes: [
                arc(0.38, 0.50, 0.10, 0.10, Math.PI, 0, 0, 400),
                arc(0.52, 0.45, 0.12, 0.12, Math.PI+0.5, -0.2, 450, 500),
                arc(0.65, 0.50, 0.08, 0.08, Math.PI, 0.3, 1000, 350),
                line(0.28, 0.52, 0.73, 0.52, 1400, 350),   // bottom
            ]
        },
        {
            word: 'rain', category: categories.NATURE,
            strokes: [
                arc(0.38, 0.35, 0.10, 0.10, Math.PI, 0, 0, 350),
                arc(0.52, 0.30, 0.12, 0.12, Math.PI+0.5, -0.2, 400, 400),
                arc(0.65, 0.35, 0.08, 0.08, Math.PI, 0.3, 850, 300),
                line(0.28, 0.37, 0.73, 0.37, 1200, 300),
                line(0.35, 0.45, 0.33, 0.55, 1550, 150),   // raindrop
                line(0.45, 0.48, 0.43, 0.58, 1750, 150),
                line(0.55, 0.45, 0.53, 0.55, 1950, 150),
                line(0.65, 0.47, 0.63, 0.57, 2150, 150),
                line(0.40, 0.60, 0.38, 0.70, 2350, 150),
                line(0.50, 0.62, 0.48, 0.72, 2550, 150),
                line(0.60, 0.58, 0.58, 0.68, 2750, 150),
            ]
        },
        {
            word: 'lightning', category: categories.NATURE,
            strokes: [
                polyline([[0.45,0.15],[0.35,0.45],[0.55,0.42],[0.40,0.80]], 0, 1000),
                // second bolt
                polyline([[0.60,0.20],[0.52,0.48],[0.68,0.45],[0.55,0.75]], 1050, 900),
            ]
        },
        {
            word: 'cactus', category: categories.NATURE,
            strokes: [
                polyline([[0.45,0.25],[0.45,0.80],[0.55,0.80],[0.55,0.25]], 0, 500), // trunk
                arc(0.50, 0.25, 0.05, 0.03, Math.PI, 0, 550, 200), // top
                bezier(0.45, 0.45, 0.30, 0.45, 0.28, 0.35, 0.30, 0.30, 800, 400), // left arm
                line(0.30, 0.30, 0.32, 0.30, 1250, 100),
                bezier(0.55, 0.55, 0.70, 0.55, 0.72, 0.42, 0.70, 0.38, 1400, 400), // right arm
                line(0.70, 0.38, 0.68, 0.38, 1850, 100),
            ]
        },
        {
            word: 'leaf', category: categories.NATURE,
            strokes: [
                bezier(0.30, 0.50, 0.35, 0.25, 0.65, 0.25, 0.70, 0.50, 0, 600), // top edge
                bezier(0.30, 0.50, 0.35, 0.75, 0.65, 0.75, 0.70, 0.50, 650, 600), // bottom edge
                line(0.30, 0.50, 0.70, 0.50, 1300, 300),   // center vein
                line(0.42, 0.50, 0.38, 0.38, 1650, 200),   // side vein
                line(0.50, 0.50, 0.46, 0.36, 1900, 200),   // side vein
                line(0.58, 0.50, 0.54, 0.38, 2150, 200),   // side vein
                line(0.70, 0.50, 0.78, 0.52, 2400, 200),   // stem
            ]
        },

        // ===== SPORTS (10) =====
        {
            word: 'soccer ball', category: categories.SPORTS,
            strokes: [
                circle(0.50, 0.50, 0.20, 0, 800),
                // pentagon pattern
                polyline([[0.50,0.35],[0.42,0.42],[0.44,0.52],[0.56,0.52],[0.58,0.42],[0.50,0.35]], 850, 600),
            ]
        },
        {
            word: 'basketball', category: categories.SPORTS,
            strokes: [
                circle(0.50, 0.50, 0.20, 0, 800),
                line(0.30, 0.50, 0.70, 0.50, 850, 250),    // horizontal
                line(0.50, 0.30, 0.50, 0.70, 1150, 250),   // vertical
                arc(0.40, 0.50, 0.08, 0.20, -Math.PI/2, Math.PI/2, 1450, 350), // left curve
                arc(0.60, 0.50, 0.08, 0.20, Math.PI/2, Math.PI*1.5, 1850, 350), // right curve
            ]
        },
        {
            word: 'tennis racket', category: categories.SPORTS,
            strokes: [
                ellipse(0.50, 0.38, 0.14, 0.18, 0, 700),   // head
                line(0.50, 0.56, 0.50, 0.82, 750, 300),    // handle
                line(0.38, 0.38, 0.62, 0.38, 1100, 200),   // string h
                line(0.40, 0.30, 0.40, 0.46, 1350, 150),   // string v
                line(0.50, 0.22, 0.50, 0.54, 1550, 150),   // string v
                line(0.60, 0.30, 0.60, 0.46, 1750, 150),   // string v
            ]
        },
        {
            word: 'baseball bat', category: categories.SPORTS,
            strokes: [
                bezier(0.25, 0.72, 0.30, 0.65, 0.60, 0.35, 0.70, 0.25, 0, 700),
                bezier(0.28, 0.75, 0.35, 0.68, 0.65, 0.38, 0.74, 0.28, 750, 700),
                arc(0.72, 0.265, 0.03, 0.02, -0.8, Math.PI-0.8, 1500, 300), // barrel end
                line(0.25, 0.72, 0.28, 0.75, 1850, 150),   // knob
            ]
        },
        {
            word: 'trophy', category: categories.SPORTS,
            strokes: [
                polyline([[0.35,0.25],[0.35,0.50],[0.45,0.55],[0.55,0.55],[0.65,0.50],[0.65,0.25]], 0, 600),
                line(0.35, 0.25, 0.65, 0.25, 650, 200),    // rim
                arc(0.50, 0.50, 0.15, 0.08, 0, Math.PI, 900, 350), // bowl bottom
                line(0.50, 0.58, 0.50, 0.68, 1300, 200),   // stem
                line(0.40, 0.68, 0.60, 0.68, 1550, 200),   // base top
                polyline([[0.38,0.68],[0.38,0.73],[0.62,0.73],[0.62,0.68]], 1800, 300), // base
                bezier(0.35, 0.35, 0.25, 0.35, 0.22, 0.48, 0.30, 0.50, 2150, 350), // left handle
                bezier(0.65, 0.35, 0.75, 0.35, 0.78, 0.48, 0.70, 0.50, 2550, 350), // right handle
            ]
        },
        {
            word: 'golf club', category: categories.SPORTS,
            strokes: [
                line(0.50, 0.18, 0.42, 0.75, 0, 500),      // shaft
                polyline([[0.42,0.75],[0.30,0.78],[0.30,0.72],[0.42,0.72]], 550, 400), // club head
            ]
        },
        {
            word: 'bowling pin', category: categories.SPORTS,
            strokes: [
                ellipse(0.50, 0.65, 0.08, 0.10, 0, 500),   // base
                line(0.44, 0.55, 0.44, 0.45, 550, 200),    // left neck
                line(0.56, 0.55, 0.56, 0.45, 800, 200),    // right neck
                ellipse(0.50, 0.35, 0.06, 0.10, 1050, 500), // head
                line(0.44, 0.48, 0.56, 0.48, 1600, 150),   // stripe
                line(0.44, 0.52, 0.56, 0.52, 1800, 150),   // stripe
            ]
        },
        {
            word: 'skateboard', category: categories.SPORTS,
            strokes: [
                bezier(0.15, 0.50, 0.12, 0.42, 0.20, 0.46, 0.25, 0.48, 0, 300), // left kick
                line(0.25, 0.48, 0.75, 0.48, 350, 350),    // deck
                bezier(0.75, 0.48, 0.80, 0.46, 0.88, 0.42, 0.85, 0.50, 750, 300), // right kick
                line(0.30, 0.48, 0.30, 0.52, 1100, 100),   // left truck
                line(0.70, 0.48, 0.70, 0.52, 1250, 100),   // right truck
                circle(0.27, 0.55, 0.03, 1400, 200, 8),     // wheel
                circle(0.33, 0.55, 0.03, 1650, 200, 8),     // wheel
                circle(0.67, 0.55, 0.03, 1900, 200, 8),     // wheel
                circle(0.73, 0.55, 0.03, 2150, 200, 8),     // wheel
            ]
        },
        {
            word: 'dumbbell', category: categories.SPORTS,
            strokes: [
                line(0.30, 0.50, 0.70, 0.50, 0, 400),      // bar
                polyline([[0.22,0.38],[0.22,0.62],[0.32,0.62],[0.32,0.38],[0.22,0.38]], 450, 400), // left weight
                polyline([[0.68,0.38],[0.68,0.62],[0.78,0.62],[0.78,0.38],[0.68,0.38]], 900, 400), // right weight
            ]
        },
        {
            word: 'surfboard', category: categories.SPORTS,
            strokes: [
                bezier(0.50, 0.15, 0.38, 0.25, 0.36, 0.65, 0.45, 0.85, 0, 700), // left edge
                bezier(0.50, 0.15, 0.62, 0.25, 0.64, 0.65, 0.55, 0.85, 750, 700), // right edge
                line(0.45, 0.85, 0.55, 0.85, 1500, 200),   // bottom
                line(0.48, 0.30, 0.52, 0.30, 1750, 150),   // stripe
                line(0.48, 0.50, 0.52, 0.50, 1950, 150),   // stripe
                polyline([[0.48,0.78],[0.50,0.92],[0.52,0.78]], 2150, 300), // fin
            ]
        },

        // ===== CLOTHING (8) =====
        {
            word: 'shirt', category: categories.CLOTHING,
            strokes: [
                polyline([[0.30,0.30],[0.20,0.42],[0.32,0.42],[0.32,0.75],[0.68,0.75],[0.68,0.42],[0.80,0.42],[0.70,0.30]], 0, 800),
                line(0.30, 0.30, 0.70, 0.30, 850, 300),    // neckline
                bezier(0.42, 0.30, 0.45, 0.38, 0.55, 0.38, 0.58, 0.30, 1200, 300), // collar
            ]
        },
        {
            word: 'shoe', category: categories.CLOTHING,
            strokes: [
                polyline([[0.25,0.50],[0.25,0.42],[0.55,0.42],[0.55,0.50]], 0, 400), // upper
                bezier(0.55, 0.42, 0.70, 0.40, 0.82, 0.45, 0.82, 0.55, 450, 400), // toe
                line(0.82, 0.55, 0.20, 0.55, 900, 350),    // sole bottom
                bezier(0.20, 0.55, 0.18, 0.52, 0.22, 0.50, 0.25, 0.50, 1300, 250), // heel
                line(0.30, 0.42, 0.45, 0.42, 1600, 150),   // tongue line
            ]
        },
        {
            word: 'dress', category: categories.CLOTHING,
            strokes: [
                polyline([[0.40,0.22],[0.35,0.28],[0.35,0.45],[0.25,0.80],[0.75,0.80],[0.65,0.45],[0.65,0.28],[0.60,0.22]], 0, 900),
                line(0.40, 0.22, 0.60, 0.22, 950, 200),    // neckline
                bezier(0.45, 0.22, 0.48, 0.28, 0.52, 0.28, 0.55, 0.22, 1200, 250), // neckline curve
                line(0.35, 0.45, 0.65, 0.45, 1500, 250),   // waist
            ]
        },
        {
            word: 'sock', category: categories.CLOTHING,
            strokes: [
                polyline([[0.40,0.22],[0.40,0.62]], 0, 300),
                bezier(0.40, 0.62, 0.40, 0.72, 0.48, 0.78, 0.65, 0.78, 450, 400), // toe curve
                line(0.65, 0.78, 0.65, 0.68, 900, 150),    // toe top
                bezier(0.65, 0.68, 0.55, 0.68, 0.52, 0.62, 0.52, 0.55, 1100, 350),
                line(0.52, 0.55, 0.52, 0.22, 1500, 300),   // right side
                line(0.40, 0.22, 0.52, 0.22, 1850, 150),   // top
                line(0.40, 0.30, 0.52, 0.30, 2050, 150),   // cuff line
            ]
        },
        {
            word: 'crown', category: categories.CLOTHING,
            strokes: [
                polyline([[0.25,0.60],[0.25,0.40],[0.32,0.52],[0.42,0.30],[0.50,0.50],[0.58,0.30],[0.68,0.52],[0.75,0.40],[0.75,0.60]], 0, 1000),
                line(0.25, 0.60, 0.75, 0.60, 1050, 300),   // base
                circle(0.42, 0.28, 0.02, 1400, 120, 6),     // jewel
                circle(0.50, 0.48, 0.02, 1570, 120, 6),     // jewel
                circle(0.58, 0.28, 0.02, 1740, 120, 6),     // jewel
            ]
        },
        {
            word: 'tie', category: categories.CLOTHING,
            strokes: [
                polyline([[0.45,0.20],[0.50,0.28],[0.55,0.20]], 0, 300), // knot top
                polyline([[0.45,0.28],[0.42,0.48],[0.50,0.80],[0.58,0.48],[0.55,0.28]], 350, 700), // body
                line(0.45, 0.28, 0.55, 0.28, 1100, 150),   // knot bottom line
            ]
        },
        {
            word: 'boot', category: categories.CLOTHING,
            strokes: [
                polyline([[0.38,0.22],[0.38,0.65]], 0, 350),
                bezier(0.38, 0.65, 0.38, 0.75, 0.50, 0.78, 0.68, 0.78, 400, 400),
                line(0.68, 0.78, 0.68, 0.68, 850, 150),
                line(0.68, 0.68, 0.55, 0.68, 1050, 150),
                line(0.55, 0.68, 0.55, 0.22, 1250, 350),
                line(0.38, 0.22, 0.55, 0.22, 1650, 200),   // top
                line(0.28, 0.78, 0.72, 0.78, 1900, 250),   // sole
                line(0.28, 0.78, 0.28, 0.72, 2200, 100),   // heel
                line(0.28, 0.72, 0.38, 0.72, 2350, 150),
            ]
        },
        {
            word: 'belt', category: categories.CLOTHING,
            strokes: [
                polyline([[0.15,0.47],[0.15,0.53],[0.85,0.53],[0.85,0.47],[0.15,0.47]], 0, 600),
                polyline([[0.45,0.44],[0.45,0.56],[0.55,0.56],[0.55,0.44],[0.45,0.44]], 650, 400), // buckle
                circle(0.50, 0.50, 0.015, 1100, 100, 6),    // buckle center
                circle(0.35, 0.50, 0.012, 1250, 80, 6),     // hole
                circle(0.30, 0.50, 0.012, 1380, 80, 6),     // hole
                circle(0.25, 0.50, 0.012, 1510, 80, 6),     // hole
            ]
        },

        // ===== BUILDINGS (8) =====
        {
            word: 'house', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.25,0.45],[0.50,0.22],[0.75,0.45]], 0, 500), // roof
                polyline([[0.28,0.45],[0.28,0.78],[0.72,0.78],[0.72,0.45]], 550, 500), // walls
                polyline([[0.44,0.58],[0.44,0.78],[0.56,0.78],[0.56,0.58],[0.44,0.58]], 1100, 400), // door
                polyline([[0.32,0.50],[0.32,0.60],[0.40,0.60],[0.40,0.50],[0.32,0.50]], 1550, 350), // window
                line(0.36, 0.50, 0.36, 0.60, 1950, 100),
                line(0.32, 0.55, 0.40, 0.55, 2100, 100),
            ]
        },
        {
            word: 'castle', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.25,0.35],[0.25,0.75],[0.75,0.75],[0.75,0.35]], 0, 600),
                // battlements
                polyline([[0.25,0.35],[0.25,0.28],[0.32,0.28],[0.32,0.35]], 650, 250),
                polyline([[0.38,0.35],[0.38,0.28],[0.45,0.28],[0.45,0.35]], 950, 250),
                polyline([[0.55,0.35],[0.55,0.28],[0.62,0.28],[0.62,0.35]], 1250, 250),
                polyline([[0.68,0.35],[0.68,0.28],[0.75,0.28],[0.75,0.35]], 1550, 250),
                // door
                arc(0.50, 0.65, 0.07, 0.10, Math.PI, 0, 1850, 350),
                line(0.43, 0.65, 0.43, 0.75, 2250, 150),
                line(0.57, 0.65, 0.57, 0.75, 2450, 150),
                // tower
                polyline([[0.18,0.45],[0.18,0.20],[0.15,0.20],[0.20,0.12],[0.25,0.20],[0.22,0.20],[0.22,0.45]], 2650, 500),
            ]
        },
        {
            word: 'church', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.30,0.40],[0.30,0.78],[0.70,0.78],[0.70,0.40]], 0, 600), // walls
                polyline([[0.25,0.40],[0.50,0.25],[0.75,0.40]], 650, 400), // roof
                line(0.50, 0.25, 0.50, 0.12, 1100, 200),   // steeple
                line(0.45, 0.18, 0.55, 0.18, 1350, 150),   // cross
                // window (arched)
                arc(0.50, 0.52, 0.06, 0.08, Math.PI, 0, 1550, 300),
                line(0.44, 0.52, 0.44, 0.64, 1900, 150),
                line(0.56, 0.52, 0.56, 0.64, 2100, 150),
                line(0.44, 0.64, 0.56, 0.64, 2300, 150),
                // door
                polyline([[0.44,0.68],[0.44,0.78],[0.56,0.78],[0.56,0.68]], 2500, 300),
            ]
        },
        {
            word: 'lighthouse', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.42,0.28],[0.38,0.78],[0.62,0.78],[0.58,0.28]], 0, 600), // tower tapered
                line(0.42, 0.28, 0.58, 0.28, 650, 200),    // top
                polyline([[0.36,0.22],[0.36,0.28],[0.64,0.28],[0.64,0.22],[0.36,0.22]], 900, 400), // light room
                polyline([[0.36,0.22],[0.50,0.14],[0.64,0.22]], 1350, 300), // roof
                line(0.39, 0.48, 0.61, 0.48, 1700, 200),   // stripe
                line(0.40, 0.58, 0.60, 0.58, 1950, 200),   // stripe
                line(0.41, 0.68, 0.59, 0.68, 2200, 200),   // stripe
                // light rays
                line(0.30, 0.25, 0.18, 0.20, 2450, 150),
                line(0.70, 0.25, 0.82, 0.20, 2650, 150),
            ]
        },
        {
            word: 'bridge', category: categories.BUILDINGS,
            strokes: [
                line(0.10, 0.55, 0.90, 0.55, 0, 400),      // road
                line(0.10, 0.58, 0.90, 0.58, 450, 400),     // road bottom
                arc(0.30, 0.55, 0.12, 0.15, 0, Math.PI, 900, 400), // left arch
                arc(0.60, 0.55, 0.12, 0.15, 0, Math.PI, 1350, 400), // right arch
                line(0.18, 0.55, 0.18, 0.75, 1800, 200),   // left pillar
                line(0.42, 0.55, 0.42, 0.75, 2050, 200),   // center pillar
                line(0.72, 0.55, 0.72, 0.75, 2300, 200),   // right pillar
            ]
        },
        {
            word: 'pyramid', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.20,0.75],[0.50,0.20],[0.80,0.75],[0.20,0.75]], 0, 800),
                line(0.50, 0.20, 0.55, 0.75, 850, 350),    // edge line
                line(0.35, 0.48, 0.67, 0.48, 1250, 250),   // horizontal line
            ]
        },
        {
            word: 'tent', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.15,0.75],[0.50,0.22],[0.85,0.75]], 0, 600),
                line(0.15, 0.75, 0.85, 0.75, 650, 300),    // base
                line(0.50, 0.22, 0.50, 0.75, 1000, 300),   // center pole line
                polyline([[0.42,0.55],[0.42,0.75],[0.58,0.75],[0.58,0.55]], 1350, 400), // door
            ]
        },
        {
            word: 'windmill', category: categories.BUILDINGS,
            strokes: [
                polyline([[0.42,0.40],[0.38,0.80],[0.62,0.80],[0.58,0.40]], 0, 500), // tower
                line(0.42, 0.40, 0.58, 0.40, 550, 150),    // top
                circle(0.50, 0.40, 0.03, 750, 200),         // hub
                line(0.50, 0.40, 0.30, 0.20, 1000, 200),   // blade 1
                line(0.50, 0.40, 0.70, 0.20, 1250, 200),   // blade 2
                line(0.50, 0.40, 0.30, 0.60, 1500, 200),   // blade 3
                line(0.50, 0.40, 0.70, 0.60, 1750, 200),   // blade 4
                polyline([[0.44,0.62],[0.44,0.80],[0.56,0.80],[0.56,0.62]], 2000, 350), // door
            ]
        },

        // ===== MUSIC (8) =====
        {
            word: 'guitar', category: categories.MUSIC,
            strokes: [
                circle(0.50, 0.62, 0.14, 0, 600),          // body
                circle(0.50, 0.62, 0.03, 650, 200),         // sound hole
                line(0.50, 0.48, 0.50, 0.15, 900, 350),    // neck
                line(0.46, 0.15, 0.54, 0.15, 1300, 150),   // headstock top
                line(0.46, 0.15, 0.46, 0.22, 1500, 100),
                line(0.54, 0.15, 0.54, 0.22, 1650, 100),
                line(0.48, 0.30, 0.52, 0.30, 1800, 100),   // fret
                line(0.48, 0.38, 0.52, 0.38, 1950, 100),   // fret
            ]
        },
        {
            word: 'piano', category: categories.MUSIC,
            strokes: [
                polyline([[0.20,0.30],[0.20,0.70],[0.80,0.70],[0.80,0.30],[0.20,0.30]], 0, 600),
                // white key dividers
                line(0.30, 0.30, 0.30, 0.70, 650, 150),
                line(0.40, 0.30, 0.40, 0.70, 850, 150),
                line(0.50, 0.30, 0.50, 0.70, 1050, 150),
                line(0.60, 0.30, 0.60, 0.70, 1250, 150),
                line(0.70, 0.30, 0.70, 0.70, 1450, 150),
                // black keys
                polyline([[0.27,0.30],[0.27,0.50],[0.33,0.50],[0.33,0.30]], 1650, 200),
                polyline([[0.37,0.30],[0.37,0.50],[0.43,0.50],[0.43,0.30]], 1900, 200),
                polyline([[0.57,0.30],[0.57,0.50],[0.63,0.50],[0.63,0.30]], 2150, 200),
                polyline([[0.67,0.30],[0.67,0.50],[0.73,0.50],[0.73,0.30]], 2400, 200),
            ]
        },
        {
            word: 'drum', category: categories.MUSIC,
            strokes: [
                ellipse(0.50, 0.35, 0.20, 0.08, 0, 500),   // top ellipse
                line(0.30, 0.35, 0.30, 0.65, 550, 250),    // left side
                line(0.70, 0.35, 0.70, 0.65, 850, 250),    // right side
                ellipse(0.50, 0.65, 0.20, 0.08, 1150, 500), // bottom ellipse
                // drumsticks
                line(0.35, 0.20, 0.55, 0.35, 1700, 250),
                line(0.65, 0.20, 0.45, 0.35, 2000, 250),
            ]
        },
        {
            word: 'trumpet', category: categories.MUSIC,
            strokes: [
                line(0.20, 0.50, 0.60, 0.50, 0, 400),      // main tube
                line(0.20, 0.47, 0.60, 0.47, 450, 400),     // tube top
                bezier(0.60, 0.47, 0.72, 0.42, 0.80, 0.38, 0.82, 0.55, 900, 400), // bell top
                bezier(0.60, 0.50, 0.72, 0.55, 0.80, 0.60, 0.82, 0.55, 1350, 400), // bell bottom
                // valves
                polyline([[0.35,0.47],[0.35,0.38],[0.37,0.35]], 1800, 200),
                polyline([[0.42,0.47],[0.42,0.38],[0.44,0.35]], 2050, 200),
                polyline([[0.49,0.47],[0.49,0.38],[0.51,0.35]], 2300, 200),
                // mouthpiece
                bezier(0.20, 0.485, 0.15, 0.485, 0.12, 0.49, 0.12, 0.50, 2550, 250),
            ]
        },
        {
            word: 'microphone', category: categories.MUSIC,
            strokes: [
                arc(0.50, 0.35, 0.08, 0.12, Math.PI, 0, 0, 400),  // mic top
                line(0.42, 0.35, 0.42, 0.45, 450, 150),
                line(0.58, 0.35, 0.58, 0.45, 650, 150),
                line(0.42, 0.45, 0.58, 0.45, 850, 150),    // mic bottom
                line(0.50, 0.45, 0.50, 0.72, 1050, 300),   // stand
                line(0.38, 0.72, 0.62, 0.72, 1400, 200),   // base
                // grid lines on mic
                line(0.44, 0.30, 0.56, 0.30, 1650, 120),
                line(0.43, 0.35, 0.57, 0.35, 1820, 120),
                line(0.44, 0.40, 0.56, 0.40, 1990, 120),
            ]
        },
        {
            word: 'headphones', category: categories.MUSIC,
            strokes: [
                arc(0.50, 0.42, 0.20, 0.18, Math.PI, 0, 0, 600), // headband
                polyline([[0.30,0.42],[0.30,0.55],[0.26,0.55],[0.26,0.68],[0.36,0.68],[0.36,0.55],[0.30,0.55]], 650, 500), // left cup
                polyline([[0.70,0.42],[0.70,0.55],[0.64,0.55],[0.64,0.68],[0.74,0.68],[0.74,0.55],[0.70,0.55]], 1200, 500), // right cup
            ]
        },
        {
            word: 'violin', category: categories.MUSIC,
            strokes: [
                ellipse(0.50, 0.35, 0.08, 0.10, 0, 400),   // upper bout
                ellipse(0.50, 0.58, 0.10, 0.12, 450, 500),  // lower bout
                line(0.42, 0.42, 0.42, 0.50, 1000, 150),   // left waist
                line(0.58, 0.42, 0.58, 0.50, 1200, 150),   // right waist
                line(0.50, 0.25, 0.50, 0.12, 1400, 200),   // neck
                line(0.47, 0.12, 0.53, 0.12, 1650, 120),   // scroll
                line(0.48, 0.32, 0.48, 0.60, 1820, 250),   // string
                line(0.52, 0.32, 0.52, 0.60, 2120, 250),   // string
            ]
        },
        {
            word: 'music note', category: categories.MUSIC,
            strokes: [
                circle(0.42, 0.65, 0.06, 0, 350),           // note head
                line(0.48, 0.65, 0.48, 0.28, 400, 350),    // stem
                bezier(0.48, 0.28, 0.55, 0.30, 0.60, 0.35, 0.58, 0.40, 800, 350), // flag
            ]
        },

        // ===== TOOLS (8) =====
        {
            word: 'hammer', category: categories.TOOLS,
            strokes: [
                line(0.35, 0.75, 0.55, 0.35, 0, 400),      // handle
                polyline([[0.48,0.38],[0.42,0.25],[0.65,0.20],[0.62,0.32],[0.55,0.35]], 450, 600), // head
            ]
        },
        {
            word: 'wrench', category: categories.TOOLS,
            strokes: [
                line(0.30, 0.65, 0.62, 0.35, 0, 400),      // shaft
                polyline([[0.25,0.62],[0.20,0.58],[0.22,0.72],[0.30,0.72],[0.35,0.68]], 450, 400), // bottom jaw
                polyline([[0.58,0.38],[0.62,0.28],[0.72,0.30],[0.70,0.40],[0.65,0.40]], 900, 400), // top jaw
            ]
        },
        {
            word: 'screwdriver', category: categories.TOOLS,
            strokes: [
                polyline([[0.45,0.25],[0.45,0.55],[0.55,0.55],[0.55,0.25]], 0, 400), // handle
                line(0.45, 0.25, 0.55, 0.25, 450, 150),    // handle top
                arc(0.50, 0.25, 0.05, 0.03, Math.PI, 0, 650, 200), // handle top curve
                line(0.48, 0.55, 0.48, 0.80, 900, 250),    // shaft
                line(0.52, 0.55, 0.52, 0.80, 1200, 250),   // shaft
                line(0.46, 0.80, 0.54, 0.80, 1500, 150),   // tip
            ]
        },
        {
            word: 'saw', category: categories.TOOLS,
            strokes: [
                polyline([[0.15,0.45],[0.15,0.55],[0.75,0.55],[0.75,0.45]], 0, 500), // blade body
                // teeth
                polyline([[0.20,0.55],[0.23,0.60],[0.26,0.55],[0.29,0.60],[0.32,0.55],[0.35,0.60],[0.38,0.55],[0.41,0.60],[0.44,0.55],[0.47,0.60],[0.50,0.55],[0.53,0.60],[0.56,0.55],[0.59,0.60],[0.62,0.55],[0.65,0.60],[0.68,0.55],[0.71,0.60],[0.74,0.55]], 550, 700),
                // handle
                polyline([[0.15,0.38],[0.08,0.38],[0.08,0.62],[0.15,0.62]], 1300, 400),
            ]
        },
        {
            word: 'paintbrush', category: categories.TOOLS,
            strokes: [
                line(0.35, 0.22, 0.55, 0.60, 0, 400),      // handle left edge
                line(0.42, 0.22, 0.58, 0.55, 450, 400),     // handle right edge
                line(0.35, 0.22, 0.42, 0.22, 900, 100),     // handle top
                polyline([[0.55,0.60],[0.52,0.65],[0.50,0.75],[0.55,0.78],[0.62,0.70],[0.60,0.58]], 1050, 500), // bristles
            ]
        },
        {
            word: 'ladder', category: categories.TOOLS,
            strokes: [
                line(0.38, 0.18, 0.35, 0.82, 0, 400),      // left rail
                line(0.62, 0.18, 0.65, 0.82, 450, 400),     // right rail
                line(0.37, 0.28, 0.63, 0.28, 900, 150),    // rung
                line(0.37, 0.38, 0.63, 0.38, 1100, 150),
                line(0.36, 0.48, 0.64, 0.48, 1300, 150),
                line(0.36, 0.58, 0.64, 0.58, 1500, 150),
                line(0.36, 0.68, 0.65, 0.68, 1700, 150),
                line(0.35, 0.78, 0.65, 0.78, 1900, 150),
            ]
        },
        {
            word: 'axe', category: categories.TOOLS,
            strokes: [
                line(0.40, 0.78, 0.55, 0.25, 0, 450),      // handle
                bezier(0.52, 0.32, 0.48, 0.22, 0.60, 0.15, 0.68, 0.25, 500, 400), // blade top
                bezier(0.68, 0.25, 0.72, 0.32, 0.65, 0.40, 0.58, 0.38, 950, 400), // blade bottom
            ]
        },
        {
            word: 'magnet', category: categories.TOOLS,
            strokes: [
                arc(0.50, 0.45, 0.15, 0.15, Math.PI, 0, 0, 500), // top arc
                line(0.35, 0.45, 0.35, 0.68, 550, 250),    // left arm
                line(0.65, 0.45, 0.65, 0.68, 850, 250),    // right arm
                line(0.30, 0.45, 0.40, 0.45, 1150, 100),   // left end
                line(0.30, 0.68, 0.40, 0.68, 1300, 100),   // left bottom
                line(0.60, 0.45, 0.70, 0.45, 1450, 100),   // right end
                line(0.60, 0.68, 0.70, 0.68, 1600, 100),   // right bottom
                line(0.30, 0.45, 0.30, 0.52, 1750, 100),   // left stripe
                line(0.70, 0.45, 0.70, 0.52, 1900, 100),   // right stripe
            ]
        },

        // ===== EXTRA MISC to hit 100+ (6) =====
        {
            word: 'snowman', category: categories.NATURE,
            strokes: [
                circle(0.50, 0.30, 0.08, 0, 400),           // head
                circle(0.50, 0.48, 0.11, 450, 500),          // middle
                circle(0.50, 0.70, 0.15, 1000, 600),         // base
                circle(0.47, 0.28, 0.012, 1650, 80, 6),      // left eye
                circle(0.53, 0.28, 0.012, 1780, 80, 6),      // right eye
                polyline([[0.50,0.31],[0.55,0.33],[0.50,0.33]], 1910, 200), // nose
                line(0.62, 0.45, 0.78, 0.38, 2160, 250),    // right arm
                line(0.38, 0.45, 0.22, 0.38, 2460, 250),    // left arm
                line(0.42, 0.22, 0.48, 0.22, 2760, 120),    // hat brim
                polyline([[0.44,0.22],[0.44,0.14],[0.56,0.14],[0.56,0.22]], 2930, 300), // hat
            ]
        },
        {
            word: 'anchor', category: categories.OBJECTS,
            strokes: [
                line(0.50, 0.20, 0.50, 0.72, 0, 500),      // shank
                line(0.40, 0.28, 0.60, 0.28, 550, 200),    // stock
                circle(0.50, 0.18, 0.03, 800, 200),         // ring
                bezier(0.50, 0.72, 0.48, 0.80, 0.30, 0.78, 0.25, 0.65, 1050, 450), // left fluke
                bezier(0.50, 0.72, 0.52, 0.80, 0.70, 0.78, 0.75, 0.65, 1550, 450), // right fluke
            ]
        },
        {
            word: 'camera', category: categories.OBJECTS,
            strokes: [
                polyline([[0.25,0.35],[0.25,0.68],[0.75,0.68],[0.75,0.35],[0.25,0.35]], 0, 600),
                circle(0.50, 0.50, 0.10, 650, 500),         // lens
                circle(0.50, 0.50, 0.05, 1200, 300),        // inner lens
                polyline([[0.42,0.35],[0.45,0.28],[0.58,0.28],[0.60,0.35]], 1550, 300), // flash housing
                circle(0.32, 0.40, 0.02, 1900, 120, 6),     // viewfinder
            ]
        },
        {
            word: 'flag', category: categories.OBJECTS,
            strokes: [
                line(0.30, 0.18, 0.30, 0.82, 0, 400),      // pole
                polyline([[0.30,0.22],[0.70,0.22],[0.70,0.50],[0.30,0.50]], 450, 500), // flag rectangle
                bezier(0.30, 0.30, 0.45, 0.28, 0.55, 0.34, 0.70, 0.30, 1000, 300), // wave line
            ]
        },
        {
            word: 'telephone', category: categories.OBJECTS,
            strokes: [
                polyline([[0.30,0.35],[0.30,0.72],[0.70,0.72],[0.70,0.35],[0.30,0.35]], 0, 600),
                // screen
                polyline([[0.35,0.40],[0.35,0.55],[0.65,0.55],[0.65,0.40],[0.35,0.40]], 650, 400),
                // buttons (3x3 grid simplified)
                circle(0.42, 0.60, 0.02, 1100, 80, 6),
                circle(0.50, 0.60, 0.02, 1230, 80, 6),
                circle(0.58, 0.60, 0.02, 1360, 80, 6),
                circle(0.42, 0.66, 0.02, 1490, 80, 6),
                circle(0.50, 0.66, 0.02, 1620, 80, 6),
                circle(0.58, 0.66, 0.02, 1750, 80, 6),
            ]
        },
        {
            word: 'robot', category: categories.OBJECTS,
            strokes: [
                polyline([[0.35,0.28],[0.35,0.48],[0.65,0.48],[0.65,0.28],[0.35,0.28]], 0, 500), // head
                polyline([[0.32,0.50],[0.32,0.75],[0.68,0.75],[0.68,0.50]], 550, 500), // body
                line(0.32, 0.50, 0.68, 0.50, 1100, 200),   // body top
                circle(0.42, 0.37, 0.03, 1350, 200),        // left eye
                circle(0.58, 0.37, 0.03, 1600, 200),        // right eye
                line(0.45, 0.44, 0.55, 0.44, 1850, 150),   // mouth
                line(0.50, 0.28, 0.50, 0.20, 2050, 150),   // antenna
                circle(0.50, 0.18, 0.02, 2250, 120, 6),     // antenna ball
                line(0.32, 0.55, 0.22, 0.62, 2420, 200),   // left arm
                line(0.68, 0.55, 0.78, 0.62, 2670, 200),   // right arm
                line(0.42, 0.75, 0.40, 0.85, 2920, 150),   // left leg
                line(0.58, 0.75, 0.60, 0.85, 3120, 150),   // right leg
            ]
        },
    ];

    // Public API
    return {
        categories: categories,
        all: drawings,

        /** Get array of unique category names */
        getCategoryList: function () {
            var seen = {};
            var list = [];
            for (var i = 0; i < drawings.length; i++) {
                var c = drawings[i].category;
                if (!seen[c]) {
                    seen[c] = true;
                    list.push(c);
                }
            }
            return list;
        },

        /** Get shuffled copy of all drawings */
        getShuffled: function () {
            var arr = drawings.slice();
            for (var i = arr.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = arr[i];
                arr[i] = arr[j];
                arr[j] = tmp;
            }
            return arr;
        },

        /** Get N random drawings, no repeats */
        getRandom: function (n) {
            return this.getShuffled().slice(0, n);
        },

        /** Count */
        count: function () {
            return drawings.length;
        }
    };
})();
