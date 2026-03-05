/* ================================================================
   MAP ENGINE — Core data model, rendering, hit testing, serialization
   No DOM — only canvas drawing and data structures.
   ================================================================ */
window.MapEngine = (function () {
    'use strict';

    /* ── Palettes ──────────────────────────────────────────── */
    const PALETTES = {
        terrain: {
            name: 'Terrain',
            colors: [
                '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2',
                '#1b4332', '#b7e4c7', '#d4a373', '#e9c46a', '#f4a261',
                '#264653', '#2a9d8f', '#e76f51', '#8ecae6', '#023e8a',
                '#caf0f8'
            ]
        },
        political: {
            name: 'Political',
            colors: [
                '#e63946', '#457b9d', '#f4a261', '#2a9d8f', '#e9c46a',
                '#264653', '#a8dadc', '#d62828', '#003049', '#fcbf49',
                '#8338ec', '#ff006e', '#3a86ff', '#fb5607', '#ffbe0b',
                '#06d6a0'
            ]
        },
        fantasy: {
            name: 'Fantasy',
            colors: [
                '#3d348b', '#7678ed', '#f7b801', '#f18701', '#f35b04',
                '#5f0f40', '#9a031e', '#0f4c5c', '#e36414', '#fb8b24',
                '#231942', '#5e548e', '#9f86c0', '#be95c4', '#e0b1cb',
                '#2b9348'
            ]
        },
        pastel: {
            name: 'Pastel',
            colors: [
                '#ffc6ff', '#bdb2ff', '#a0c4ff', '#9bf6ff', '#caffbf',
                '#fdffb6', '#ffd6a5', '#ffadad', '#d0f4de', '#e4c1f9',
                '#f694c1', '#a2d2ff', '#cdb4db', '#ffc8dd', '#bde0fe',
                '#bee1e6'
            ]
        }
    };

    /* ── Marker Icons (SVG paths at 24x24) ────────────────── */
    const MARKER_ICONS = {
        pin:      { label: 'Pin',      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z' },
        star:     { label: 'Star',     path: 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01z' },
        flag:     { label: 'Flag',     path: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z' },
        city:     { label: 'City',     path: 'M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z' },
        mountain: { label: 'Mountain', path: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z' },
        anchor:   { label: 'Anchor',   path: 'M17 15l-2 2V13.2A7 7 0 0 0 19 7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 4 6.3V17l-2-2-1.4 1.4L12 22.8l6.4-6.4L17 15zM12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
        castle:   { label: 'Castle',   path: 'M21 9V7h-2V5h-2v2h-2V5h-2v2h-2V5H9v2H7V5H5v2H3v2h2v12h14V9h2zm-4 10h-2v-3h-2v3h-2v-3H9v3H7V11h10v8z' },
        tree:     { label: 'Tree',     path: 'M12 2L5 12h3v3H5l7 7 7-7h-3v-3h3L12 2zm-1 13v3h2v-3h2.5L12 18.5 8.5 15H11z' }
    };

    /* ── Layer order ──────────────────────────────────────── */
    const LAYER_ORDER = ['background', 'regions', 'markers', 'labels'];

    /* ── Default state ────────────────────────────────────── */
    function createMap(width, height) {
        return {
            version: 1,
            name: 'Untitled Map',
            canvas: { width: width || 1200, height: height || 800 },
            backgroundColor: '#1a2332',
            gridEnabled: true,
            gridSize: 40,
            gridColor: 'rgba(255,255,255,0.06)',
            layers: {
                background: { visible: true, locked: false },
                regions:    { visible: true, locked: false },
                markers:    { visible: true, locked: false },
                labels:     { visible: true, locked: false }
            },
            regions: [],
            markers: [],
            labels: [],
            nextId: 1
        };
    }

    function genId(map) {
        return 'obj-' + (map.nextId++);
    }

    /* ── Region (polygon) ─────────────────────────────────── */
    function createRegion(map, points, opts) {
        const r = {
            id: genId(map),
            type: 'region',
            points: points, // [{x, y}, ...]
            fill: (opts && opts.fill) || '#2a9d8f',
            stroke: (opts && opts.stroke) || '#ffffff',
            strokeWidth: (opts && opts.strokeWidth) || 2,
            opacity: (opts && opts.opacity) || 0.7,
            name: (opts && opts.name) || ''
        };
        map.regions.push(r);
        return r;
    }

    function createMarker(map, x, y, opts) {
        const m = {
            id: genId(map),
            type: 'marker',
            x: x,
            y: y,
            icon: (opts && opts.icon) || 'pin',
            color: (opts && opts.color) || '#e63946',
            size: (opts && opts.size) || 32,
            label: (opts && opts.label) || ''
        };
        map.markers.push(m);
        return m;
    }

    function createLabel(map, x, y, text, opts) {
        const l = {
            id: genId(map),
            type: 'label',
            x: x,
            y: y,
            text: text || 'Label',
            fontSize: (opts && opts.fontSize) || 16,
            fontFamily: (opts && opts.fontFamily) || 'serif',
            color: (opts && opts.color) || '#ffffff',
            bold: (opts && opts.bold) || false,
            italic: (opts && opts.italic) || false,
            rotation: (opts && opts.rotation) || 0
        };
        map.labels.push(l);
        return l;
    }

    function removeObject(map, id) {
        map.regions = map.regions.filter(function (r) { return r.id !== id; });
        map.markers = map.markers.filter(function (m) { return m.id !== id; });
        map.labels  = map.labels.filter(function (l) { return l.id !== id; });
    }

    function findObject(map, id) {
        for (var i = 0; i < map.regions.length; i++) { if (map.regions[i].id === id) return map.regions[i]; }
        for (var i = 0; i < map.markers.length; i++) { if (map.markers[i].id === id) return map.markers[i]; }
        for (var i = 0; i < map.labels.length; i++)  { if (map.labels[i].id === id) return map.labels[i]; }
        return null;
    }

    /* ── Drawing ──────────────────────────────────────────── */
    function drawGrid(ctx, map, view) {
        if (!map.gridEnabled) return;
        var gs = map.gridSize * view.zoom;
        if (gs < 8) return; // too small to draw
        ctx.save();
        ctx.strokeStyle = map.gridColor;
        ctx.lineWidth = 1;
        var ox = view.offsetX % gs;
        var oy = view.offsetY % gs;
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        ctx.beginPath();
        for (var x = ox; x < w; x += gs) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
        }
        for (var y = oy; y < h; y += gs) {
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
        }
        ctx.stroke();
        ctx.restore();
    }

    function drawRegion(ctx, region, view) {
        if (region.points.length < 2) return;
        ctx.save();
        ctx.globalAlpha = region.opacity;
        ctx.beginPath();
        var p0 = worldToScreen(region.points[0].x, region.points[0].y, view);
        ctx.moveTo(p0.x, p0.y);
        for (var i = 1; i < region.points.length; i++) {
            var p = worldToScreen(region.points[i].x, region.points[i].y, view);
            ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = region.fill;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = region.stroke;
        ctx.lineWidth = region.strokeWidth * view.zoom;
        ctx.stroke();
        ctx.restore();
    }

    function drawMarkerIcon(ctx, marker, view) {
        var sp = worldToScreen(marker.x, marker.y, view);
        var s = marker.size * view.zoom;
        var icon = MARKER_ICONS[marker.icon] || MARKER_ICONS.pin;
        ctx.save();
        ctx.translate(sp.x, sp.y);
        // Draw shadow
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4 * view.zoom;
        ctx.shadowOffsetY = 2 * view.zoom;
        // Scale SVG 24x24 path to marker size, centered
        var scale = s / 24;
        ctx.translate(-12 * scale, -24 * scale); // anchor at bottom center
        ctx.scale(scale, scale);
        var p2d = new Path2D(icon.path);
        ctx.fillStyle = marker.color;
        ctx.fill(p2d);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5 / scale;
        ctx.stroke(p2d);
        ctx.restore();
    }

    function drawLabel(ctx, label, view) {
        var sp = worldToScreen(label.x, label.y, view);
        ctx.save();
        ctx.translate(sp.x, sp.y);
        if (label.rotation) ctx.rotate(label.rotation * Math.PI / 180);
        var style = '';
        if (label.italic) style += 'italic ';
        if (label.bold) style += 'bold ';
        ctx.font = style + (label.fontSize * view.zoom) + 'px ' + label.fontFamily;
        ctx.fillStyle = label.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // text shadow
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 3 * view.zoom;
        ctx.fillText(label.text, 0, 0);
        ctx.restore();
    }

    function render(ctx, map, view, selection) {
        var w = ctx.canvas.width;
        var h = ctx.canvas.height;
        // Background
        ctx.fillStyle = map.backgroundColor;
        ctx.fillRect(0, 0, w, h);
        // Grid
        if (map.layers.background.visible) drawGrid(ctx, map, view);
        // Regions
        if (map.layers.regions.visible) {
            for (var i = 0; i < map.regions.length; i++) {
                drawRegion(ctx, map.regions[i], view);
            }
        }
        // Markers
        if (map.layers.markers.visible) {
            for (var i = 0; i < map.markers.length; i++) {
                drawMarkerIcon(ctx, map.markers[i], view);
            }
        }
        // Labels
        if (map.layers.labels.visible) {
            for (var i = 0; i < map.labels.length; i++) {
                drawLabel(ctx, map.labels[i], view);
            }
        }
        // Selection highlight
        if (selection) drawSelectionHighlight(ctx, map, view, selection);
    }

    function drawSelectionHighlight(ctx, map, view, selId) {
        var obj = findObject(map, selId);
        if (!obj) return;
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        if (obj.type === 'region' && obj.points.length > 1) {
            ctx.beginPath();
            var p0 = worldToScreen(obj.points[0].x, obj.points[0].y, view);
            ctx.moveTo(p0.x, p0.y);
            for (var i = 1; i < obj.points.length; i++) {
                var p = worldToScreen(obj.points[i].x, obj.points[i].y, view);
                ctx.lineTo(p.x, p.y);
            }
            ctx.closePath();
            ctx.stroke();
            // draw vertex handles
            ctx.fillStyle = '#00e5ff';
            for (var i = 0; i < obj.points.length; i++) {
                var p = worldToScreen(obj.points[i].x, obj.points[i].y, view);
                ctx.fillRect(p.x - 4, p.y - 4, 8, 8);
            }
        } else if (obj.type === 'marker') {
            var sp = worldToScreen(obj.x, obj.y, view);
            var s = obj.size * view.zoom;
            ctx.strokeRect(sp.x - s/2, sp.y - s, s, s);
        } else if (obj.type === 'label') {
            var sp = worldToScreen(obj.x, obj.y, view);
            var fz = obj.fontSize * view.zoom;
            ctx.strokeRect(sp.x - fz * 2, sp.y - fz * 0.7, fz * 4, fz * 1.4);
        }
        ctx.restore();
    }

    /* ── Coordinate transforms ────────────────────────────── */
    function worldToScreen(wx, wy, view) {
        return {
            x: wx * view.zoom + view.offsetX,
            y: wy * view.zoom + view.offsetY
        };
    }

    function screenToWorld(sx, sy, view) {
        return {
            x: (sx - view.offsetX) / view.zoom,
            y: (sy - view.offsetY) / view.zoom
        };
    }

    /* ── Hit testing ──────────────────────────────────────── */
    function hitTestMarker(marker, wx, wy, view) {
        var s = marker.size / view.zoom * 0.8;
        var dx = wx - marker.x;
        var dy = wy - (marker.y - s / 2);
        return dx * dx + dy * dy < s * s;
    }

    function hitTestLabel(label, wx, wy, view) {
        var fz = label.fontSize;
        var hw = fz * 3;
        var hh = fz * 0.8;
        return Math.abs(wx - label.x) < hw && Math.abs(wy - label.y) < hh;
    }

    function pointInPolygon(px, py, points) {
        var inside = false;
        for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
            var xi = points[i].x, yi = points[i].y;
            var xj = points[j].x, yj = points[j].y;
            if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }

    function hitTest(map, wx, wy, view) {
        // Test in reverse draw order: labels first, then markers, then regions
        if (map.layers.labels.visible && !map.layers.labels.locked) {
            for (var i = map.labels.length - 1; i >= 0; i--) {
                if (hitTestLabel(map.labels[i], wx, wy, view)) return map.labels[i].id;
            }
        }
        if (map.layers.markers.visible && !map.layers.markers.locked) {
            for (var i = map.markers.length - 1; i >= 0; i--) {
                if (hitTestMarker(map.markers[i], wx, wy, view)) return map.markers[i].id;
            }
        }
        if (map.layers.regions.visible && !map.layers.regions.locked) {
            for (var i = map.regions.length - 1; i >= 0; i--) {
                if (map.regions[i].points.length >= 3 && pointInPolygon(wx, wy, map.regions[i].points)) {
                    return map.regions[i].id;
                }
            }
        }
        return null;
    }

    /* Hit test a specific vertex of a region, returns {regionId, vertexIndex} or null */
    function hitTestVertex(map, wx, wy, view) {
        if (!map.layers.regions.visible || map.layers.regions.locked) return null;
        var threshold = 10 / view.zoom;
        for (var i = map.regions.length - 1; i >= 0; i--) {
            var pts = map.regions[i].points;
            for (var j = 0; j < pts.length; j++) {
                var dx = wx - pts[j].x;
                var dy = wy - pts[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < threshold) {
                    return { regionId: map.regions[i].id, vertexIndex: j };
                }
            }
        }
        return null;
    }

    /* ── Serialization ────────────────────────────────────── */
    function saveToJSON(map) {
        return JSON.stringify(map, null, 2);
    }

    function loadFromJSON(json) {
        var data = typeof json === 'string' ? JSON.parse(json) : json;
        // Ensure defaults for older formats
        if (!data.layers) {
            data.layers = {
                background: { visible: true, locked: false },
                regions:    { visible: true, locked: false },
                markers:    { visible: true, locked: false },
                labels:     { visible: true, locked: false }
            };
        }
        if (!data.nextId) data.nextId = 1;
        return data;
    }

    /* ── Export PNG ────────────────────────────────────────── */
    function exportPNG(map, scale) {
        scale = scale || 1;
        var canvas = document.createElement('canvas');
        canvas.width = map.canvas.width * scale;
        canvas.height = map.canvas.height * scale;
        var ctx = canvas.getContext('2d');
        var view = {
            zoom: scale,
            offsetX: 0,
            offsetY: 0
        };
        render(ctx, map, view, null);
        return new Promise(function (resolve) {
            canvas.toBlob(function (blob) { resolve(blob); }, 'image/png');
        });
    }

    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    /* ── Undo / Redo ──────────────────────────────────────── */
    var undoStack = [];
    var redoStack = [];
    var MAX_UNDO = 60;

    function pushHistory(map) {
        undoStack.push(saveToJSON(map));
        if (undoStack.length > MAX_UNDO) undoStack.shift();
        redoStack.length = 0;
    }

    function undo(map) {
        if (undoStack.length === 0) return map;
        redoStack.push(saveToJSON(map));
        return loadFromJSON(undoStack.pop());
    }

    function redo(map) {
        if (redoStack.length === 0) return map;
        undoStack.push(saveToJSON(map));
        return loadFromJSON(redoStack.pop());
    }

    function clearHistory() {
        undoStack.length = 0;
        redoStack.length = 0;
    }

    /* ── Public API ───────────────────────────────────────── */
    return {
        PALETTES: PALETTES,
        MARKER_ICONS: MARKER_ICONS,
        LAYER_ORDER: LAYER_ORDER,
        createMap: createMap,
        createRegion: createRegion,
        createMarker: createMarker,
        createLabel: createLabel,
        removeObject: removeObject,
        findObject: findObject,
        render: render,
        worldToScreen: worldToScreen,
        screenToWorld: screenToWorld,
        hitTest: hitTest,
        hitTestVertex: hitTestVertex,
        saveToJSON: saveToJSON,
        loadFromJSON: loadFromJSON,
        exportPNG: exportPNG,
        downloadBlob: downloadBlob,
        pushHistory: pushHistory,
        undo: undo,
        redo: redo,
        clearHistory: clearHistory
    };
})();
