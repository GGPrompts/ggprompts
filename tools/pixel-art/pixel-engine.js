/* ======================================================================
   Pixel Engine — Grid logic, drawing tools, layer system, animation
   frames, undo/redo, and project serialization for the Pixel Art Editor.
   DOM-free: all state management with no UI dependencies.
====================================================================== */
(function() {
    "use strict";

    // ── Unique ID generator ──────────────────────────────────────────
    function uid(prefix) {
        return (prefix || 'id') + '-' + Math.random().toString(36).slice(2, 9);
    }

    // ── Deep clone (JSON round-trip) ─────────────────────────────────
    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // ── Color utilities ──────────────────────────────────────────────
    function hexToRgba(hex) {
        if (!hex || hex === 'transparent' || hex === '') return [0, 0, 0, 0];
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        if (hex.length === 6) hex += 'ff';
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
            parseInt(hex.slice(6, 8), 16)
        ];
    }

    function rgbaToHex(r, g, b, a) {
        var hex = '#' +
            ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        if (a !== undefined && a < 255) {
            hex += ((1 << 8) + a).toString(16).slice(1);
        }
        return hex;
    }

    function colorsEqual(a, b) {
        if (!a && !b) return true;
        if (!a || !b) return false;
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
    }

    // ── NES Palette (54 colors) ──────────────────────────────────────
    var NES_PALETTE = [
        // Row 1: Darks
        '#000000', '#1d2b53', '#7e2553', '#008751',
        '#ab5236', '#5f574f', '#c2c3c7', '#fff1e8',
        // Row 2: Primaries
        '#ff004d', '#ffa300', '#ffec27', '#00e436',
        '#29adff', '#83769c', '#ff77a8', '#ffccaa',
        // Row 3: NES extended
        '#0f0f0f', '#1a1a2e', '#16213e', '#0077c0',
        '#00d4ff', '#00a854', '#7cfc00', '#fcbf00',
        '#ff7700', '#e4002b', '#ff6b9d', '#c800c8',
        '#6b2d9e', '#fcfcfc', '#bcbcbc', '#7c7c7c',
        // Row 4: Skin / nature tones
        '#3c3c3c', '#442200', '#663300', '#884400',
        '#aa5500', '#cc7722', '#ddaa44', '#eedd88',
        '#224400', '#336600', '#448800', '#55aa00',
        '#002244', '#003366', '#004488', '#0055aa',
        // Row 5: Pastels / extras
        '#330044', '#550066', '#770088', '#9900aa',
        '#ff0066', '#ff3388', '#ff66aa', '#ff99cc'
    ];

    // ── Layer ─────────────────────────────────────────────────────────
    // A layer is a flat Uint8Array of width*height*4 (RGBA)
    function createLayer(width, height, name) {
        return {
            id: uid('layer'),
            name: name || 'Layer',
            visible: true,
            opacity: 1.0,
            locked: false,
            pixels: new Uint8Array(width * height * 4)
        };
    }

    function cloneLayer(layer, width, height) {
        var copy = createLayer(width, height, layer.name + ' Copy');
        copy.visible = layer.visible;
        copy.opacity = layer.opacity;
        copy.locked = layer.locked;
        copy.pixels.set(layer.pixels);
        return copy;
    }

    function layerToSerializable(layer) {
        // Store as base64 for JSON compactness
        var binary = '';
        var bytes = layer.pixels;
        for (var i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return {
            id: layer.id,
            name: layer.name,
            visible: layer.visible,
            opacity: layer.opacity,
            locked: layer.locked,
            data: btoa(binary)
        };
    }

    function layerFromSerializable(obj, width, height) {
        var layer = createLayer(width, height, obj.name);
        layer.id = obj.id;
        layer.visible = obj.visible;
        layer.opacity = obj.opacity;
        layer.locked = obj.locked !== undefined ? obj.locked : false;
        var binary = atob(obj.data);
        for (var i = 0; i < binary.length; i++) {
            layer.pixels[i] = binary.charCodeAt(i);
        }
        return layer;
    }

    // ── Pixel access on a layer ──────────────────────────────────────
    function getPixel(layer, width, x, y) {
        if (x < 0 || y < 0 || x >= width) return null;
        var idx = (y * width + x) * 4;
        if (idx < 0 || idx + 3 >= layer.pixels.length) return null;
        return [
            layer.pixels[idx],
            layer.pixels[idx + 1],
            layer.pixels[idx + 2],
            layer.pixels[idx + 3]
        ];
    }

    function setPixel(layer, width, x, y, rgba) {
        if (x < 0 || y < 0 || x >= width) return;
        var idx = (y * width + x) * 4;
        if (idx < 0 || idx + 3 >= layer.pixels.length) return;
        layer.pixels[idx]     = rgba[0];
        layer.pixels[idx + 1] = rgba[1];
        layer.pixels[idx + 2] = rgba[2];
        layer.pixels[idx + 3] = rgba[3];
    }

    // ── Frame ─────────────────────────────────────────────────────────
    function createFrame(width, height) {
        return {
            id: uid('frame'),
            layers: [createLayer(width, height, 'Background')],
            activeLayerIndex: 0
        };
    }

    function cloneFrame(frame, width, height) {
        var newFrame = {
            id: uid('frame'),
            layers: [],
            activeLayerIndex: frame.activeLayerIndex
        };
        for (var i = 0; i < frame.layers.length; i++) {
            newFrame.layers.push(cloneLayer(frame.layers[i], width, height));
        }
        return newFrame;
    }

    // ── Project state ─────────────────────────────────────────────────
    function createProject(width, height) {
        return {
            version: 1,
            name: 'Untitled',
            width: width || 16,
            height: height || 16,
            frames: [createFrame(width || 16, height || 16)],
            activeFrameIndex: 0,
            fps: 8
        };
    }

    // ── Undo / Redo ──────────────────────────────────────────────────
    var MAX_HISTORY = 80;
    var history = [];
    var historyIndex = -1;
    var historyDisabled = false;

    function snapshotFrames(project) {
        // Serialize current frame data for undo
        var snap = [];
        for (var f = 0; f < project.frames.length; f++) {
            var frame = project.frames[f];
            var layers = [];
            for (var l = 0; l < frame.layers.length; l++) {
                layers.push({
                    id: frame.layers[l].id,
                    name: frame.layers[l].name,
                    visible: frame.layers[l].visible,
                    opacity: frame.layers[l].opacity,
                    locked: frame.layers[l].locked,
                    pixels: new Uint8Array(frame.layers[l].pixels)
                });
            }
            snap.push({
                id: frame.id,
                layers: layers,
                activeLayerIndex: frame.activeLayerIndex
            });
        }
        return {
            frames: snap,
            activeFrameIndex: project.activeFrameIndex,
            width: project.width,
            height: project.height
        };
    }

    function restoreSnapshot(project, snap) {
        project.width = snap.width;
        project.height = snap.height;
        project.activeFrameIndex = snap.activeFrameIndex;
        project.frames = [];
        for (var f = 0; f < snap.frames.length; f++) {
            var sf = snap.frames[f];
            var frame = { id: sf.id, layers: [], activeLayerIndex: sf.activeLayerIndex };
            for (var l = 0; l < sf.layers.length; l++) {
                var sl = sf.layers[l];
                var layer = createLayer(project.width, project.height, sl.name);
                layer.id = sl.id;
                layer.visible = sl.visible;
                layer.opacity = sl.opacity;
                layer.locked = sl.locked;
                layer.pixels.set(sl.pixels);
                frame.layers.push(layer);
            }
            project.frames.push(frame);
        }
    }

    function pushHistory(project) {
        if (historyDisabled) return;
        // Trim redo states
        history = history.slice(0, historyIndex + 1);
        history.push(snapshotFrames(project));
        if (history.length > MAX_HISTORY) {
            history.shift();
        }
        historyIndex = history.length - 1;
    }

    function undo(project) {
        if (historyIndex <= 0) return false;
        historyIndex--;
        historyDisabled = true;
        restoreSnapshot(project, deepCloneSnapshot(history[historyIndex]));
        historyDisabled = false;
        return true;
    }

    function redo(project) {
        if (historyIndex >= history.length - 1) return false;
        historyIndex++;
        historyDisabled = true;
        restoreSnapshot(project, deepCloneSnapshot(history[historyIndex]));
        historyDisabled = false;
        return true;
    }

    function deepCloneSnapshot(snap) {
        var clone = {
            frames: [],
            activeFrameIndex: snap.activeFrameIndex,
            width: snap.width,
            height: snap.height
        };
        for (var f = 0; f < snap.frames.length; f++) {
            var sf = snap.frames[f];
            var frame = { id: sf.id, layers: [], activeLayerIndex: sf.activeLayerIndex };
            for (var l = 0; l < sf.layers.length; l++) {
                var sl = sf.layers[l];
                frame.layers.push({
                    id: sl.id,
                    name: sl.name,
                    visible: sl.visible,
                    opacity: sl.opacity,
                    locked: sl.locked,
                    pixels: new Uint8Array(sl.pixels)
                });
            }
            clone.frames.push(frame);
        }
        return clone;
    }

    function resetHistory(project) {
        history = [snapshotFrames(project)];
        historyIndex = 0;
    }

    function canUndo() { return historyIndex > 0; }
    function canRedo() { return historyIndex < history.length - 1; }

    // ── Drawing Tools ────────────────────────────────────────────────

    // Pencil: set single pixel
    function drawPencil(layer, width, height, x, y, color) {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x < 0 || y < 0 || x >= width || y >= height) return;
        setPixel(layer, width, x, y, color);
    }

    // Eraser: set pixel to transparent
    function drawEraser(layer, width, height, x, y) {
        drawPencil(layer, width, height, x, y, [0, 0, 0, 0]);
    }

    // Bresenham line
    function drawLine(layer, width, height, x0, y0, x1, y1, color) {
        x0 = Math.floor(x0); y0 = Math.floor(y0);
        x1 = Math.floor(x1); y1 = Math.floor(y1);
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = x0 < x1 ? 1 : -1;
        var sy = y0 < y1 ? 1 : -1;
        var err = dx - dy;
        while (true) {
            setPixel(layer, width, x0, y0, color);
            if (x0 === x1 && y0 === y1) break;
            var e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    // Rectangle (outline)
    function drawRect(layer, width, height, x0, y0, x1, y1, color, filled) {
        var minX = Math.max(0, Math.min(x0, x1));
        var maxX = Math.min(width - 1, Math.max(x0, x1));
        var minY = Math.max(0, Math.min(y0, y1));
        var maxY = Math.min(height - 1, Math.max(y0, y1));
        if (filled) {
            for (var fy = minY; fy <= maxY; fy++) {
                for (var fx = minX; fx <= maxX; fx++) {
                    setPixel(layer, width, fx, fy, color);
                }
            }
        } else {
            for (var rx = minX; rx <= maxX; rx++) {
                setPixel(layer, width, rx, minY, color);
                setPixel(layer, width, rx, maxY, color);
            }
            for (var ry = minY; ry <= maxY; ry++) {
                setPixel(layer, width, minX, ry, color);
                setPixel(layer, width, maxX, ry, color);
            }
        }
    }

    // Ellipse (Bresenham midpoint)
    function drawEllipse(layer, width, height, x0, y0, x1, y1, color, filled) {
        var cx = Math.floor((x0 + x1) / 2);
        var cy = Math.floor((y0 + y1) / 2);
        var rx = Math.abs(Math.floor((x1 - x0) / 2));
        var ry = Math.abs(Math.floor((y1 - y0) / 2));
        if (rx === 0 && ry === 0) {
            setPixel(layer, width, cx, cy, color);
            return;
        }
        if (rx === 0) {
            for (var ey = Math.min(y0, y1); ey <= Math.max(y0, y1); ey++) {
                setPixel(layer, width, cx, ey, color);
            }
            return;
        }
        if (ry === 0) {
            for (var ex = Math.min(x0, x1); ex <= Math.max(x0, x1); ex++) {
                setPixel(layer, width, ex, cy, color);
            }
            return;
        }

        // Midpoint ellipse algorithm
        var x = 0, y = ry;
        var rxSq = rx * rx, rySq = ry * ry;
        var d1 = rySq - rxSq * ry + 0.25 * rxSq;
        var dx = 2 * rySq * x, dy = 2 * rxSq * y;

        function plotEllipsePoints(px, py) {
            if (filled) {
                for (var fi = cx - px; fi <= cx + px; fi++) {
                    setPixel(layer, width, fi, cy + py, color);
                    setPixel(layer, width, fi, cy - py, color);
                }
            } else {
                setPixel(layer, width, cx + px, cy + py, color);
                setPixel(layer, width, cx - px, cy + py, color);
                setPixel(layer, width, cx + px, cy - py, color);
                setPixel(layer, width, cx - px, cy - py, color);
            }
        }

        while (dx < dy) {
            plotEllipsePoints(x, y);
            x++;
            dx += 2 * rySq;
            if (d1 < 0) {
                d1 += dx + rySq;
            } else {
                y--;
                dy -= 2 * rxSq;
                d1 += dx - dy + rySq;
            }
        }
        var d2 = rySq * (x + 0.5) * (x + 0.5) + rxSq * (y - 1) * (y - 1) - rxSq * rySq;
        while (y >= 0) {
            plotEllipsePoints(x, y);
            y--;
            dy -= 2 * rxSq;
            if (d2 > 0) {
                d2 += rxSq - dy;
            } else {
                x++;
                dx += 2 * rySq;
                d2 += dx - dy + rxSq;
            }
        }
    }

    // Flood fill (iterative queue-based)
    function floodFill(layer, width, height, startX, startY, fillColor) {
        startX = Math.floor(startX);
        startY = Math.floor(startY);
        if (startX < 0 || startY < 0 || startX >= width || startY >= height) return;
        var target = getPixel(layer, width, startX, startY);
        if (!target) return;
        if (colorsEqual(target, fillColor)) return;

        var queue = [[startX, startY]];
        var visited = new Uint8Array(width * height);

        while (queue.length > 0) {
            var p = queue.shift();
            var px = p[0], py = p[1];
            if (px < 0 || py < 0 || px >= width || py >= height) continue;
            var vi = py * width + px;
            if (visited[vi]) continue;
            visited[vi] = 1;

            var current = getPixel(layer, width, px, py);
            if (!colorsEqual(current, target)) continue;

            setPixel(layer, width, px, py, fillColor);
            queue.push([px + 1, py]);
            queue.push([px - 1, py]);
            queue.push([px, py + 1]);
            queue.push([px, py - 1]);
        }
    }

    // Eyedropper: get pixel color
    function eyedropper(project, x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        var frame = project.frames[project.activeFrameIndex];
        // Sample from top visible layer down
        for (var i = frame.layers.length - 1; i >= 0; i--) {
            var layer = frame.layers[i];
            if (!layer.visible) continue;
            var c = getPixel(layer, project.width, x, y);
            if (c && c[3] > 0) return c;
        }
        return [0, 0, 0, 0];
    }

    // ── Composite / Render ───────────────────────────────────────────
    // Flatten all visible layers of a frame into an ImageData
    function renderFrame(project, frameIndex, targetCanvas) {
        var frame = project.frames[frameIndex];
        var w = project.width;
        var h = project.height;
        var canvas = targetCanvas || document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);

        for (var l = 0; l < frame.layers.length; l++) {
            var layer = frame.layers[l];
            if (!layer.visible) continue;
            var imgData = ctx.createImageData(w, h);
            var src = layer.pixels;
            var dst = imgData.data;
            var opacity = layer.opacity;
            for (var i = 0; i < src.length; i += 4) {
                dst[i]     = src[i];
                dst[i + 1] = src[i + 1];
                dst[i + 2] = src[i + 2];
                dst[i + 3] = Math.round(src[i + 3] * opacity);
            }
            // Use a temp canvas for proper alpha compositing
            var tmp = document.createElement('canvas');
            tmp.width = w;
            tmp.height = h;
            tmp.getContext('2d').putImageData(imgData, 0, 0);
            ctx.drawImage(tmp, 0, 0);
        }
        return canvas;
    }

    // Render to ImageData (for export)
    function renderFrameToImageData(project, frameIndex) {
        var canvas = renderFrame(project, frameIndex);
        return canvas.getContext('2d').getImageData(0, 0, project.width, project.height);
    }

    // ── Layer operations ─────────────────────────────────────────────
    function addLayer(project) {
        var frame = project.frames[project.activeFrameIndex];
        var layer = createLayer(project.width, project.height, 'Layer ' + (frame.layers.length + 1));
        frame.layers.push(layer);
        frame.activeLayerIndex = frame.layers.length - 1;
        return layer;
    }

    function removeLayer(project) {
        var frame = project.frames[project.activeFrameIndex];
        if (frame.layers.length <= 1) return false;
        frame.layers.splice(frame.activeLayerIndex, 1);
        if (frame.activeLayerIndex >= frame.layers.length) {
            frame.activeLayerIndex = frame.layers.length - 1;
        }
        return true;
    }

    function moveLayerUp(project) {
        var frame = project.frames[project.activeFrameIndex];
        var idx = frame.activeLayerIndex;
        if (idx >= frame.layers.length - 1) return false;
        var tmp = frame.layers[idx];
        frame.layers[idx] = frame.layers[idx + 1];
        frame.layers[idx + 1] = tmp;
        frame.activeLayerIndex = idx + 1;
        return true;
    }

    function moveLayerDown(project) {
        var frame = project.frames[project.activeFrameIndex];
        var idx = frame.activeLayerIndex;
        if (idx <= 0) return false;
        var tmp = frame.layers[idx];
        frame.layers[idx] = frame.layers[idx - 1];
        frame.layers[idx - 1] = tmp;
        frame.activeLayerIndex = idx - 1;
        return true;
    }

    function mergeDown(project) {
        var frame = project.frames[project.activeFrameIndex];
        var idx = frame.activeLayerIndex;
        if (idx <= 0) return false;
        var upper = frame.layers[idx];
        var lower = frame.layers[idx - 1];
        var w = project.width;
        // Composite upper onto lower
        for (var i = 0; i < upper.pixels.length; i += 4) {
            var ua = upper.pixels[i + 3] / 255 * upper.opacity;
            if (ua <= 0) continue;
            var la = lower.pixels[i + 3] / 255;
            var outA = ua + la * (1 - ua);
            if (outA > 0) {
                lower.pixels[i]     = Math.round((upper.pixels[i] * ua + lower.pixels[i] * la * (1 - ua)) / outA);
                lower.pixels[i + 1] = Math.round((upper.pixels[i + 1] * ua + lower.pixels[i + 1] * la * (1 - ua)) / outA);
                lower.pixels[i + 2] = Math.round((upper.pixels[i + 2] * ua + lower.pixels[i + 2] * la * (1 - ua)) / outA);
                lower.pixels[i + 3] = Math.round(outA * 255);
            }
        }
        frame.layers.splice(idx, 1);
        frame.activeLayerIndex = idx - 1;
        return true;
    }

    // ── Frame operations ─────────────────────────────────────────────
    function addFrame(project) {
        var frame = createFrame(project.width, project.height);
        project.frames.push(frame);
        project.activeFrameIndex = project.frames.length - 1;
        return frame;
    }

    function duplicateFrame(project) {
        var src = project.frames[project.activeFrameIndex];
        var frame = cloneFrame(src, project.width, project.height);
        project.frames.splice(project.activeFrameIndex + 1, 0, frame);
        project.activeFrameIndex++;
        return frame;
    }

    function removeFrame(project) {
        if (project.frames.length <= 1) return false;
        project.frames.splice(project.activeFrameIndex, 1);
        if (project.activeFrameIndex >= project.frames.length) {
            project.activeFrameIndex = project.frames.length - 1;
        }
        return true;
    }

    function moveFrameLeft(project) {
        var idx = project.activeFrameIndex;
        if (idx <= 0) return false;
        var tmp = project.frames[idx];
        project.frames[idx] = project.frames[idx - 1];
        project.frames[idx - 1] = tmp;
        project.activeFrameIndex = idx - 1;
        return true;
    }

    function moveFrameRight(project) {
        var idx = project.activeFrameIndex;
        if (idx >= project.frames.length - 1) return false;
        var tmp = project.frames[idx];
        project.frames[idx] = project.frames[idx + 1];
        project.frames[idx + 1] = tmp;
        project.activeFrameIndex = idx + 1;
        return true;
    }

    // ── Resize project ───────────────────────────────────────────────
    function resizeProject(project, newWidth, newHeight) {
        var oldW = project.width;
        var oldH = project.height;
        for (var f = 0; f < project.frames.length; f++) {
            var frame = project.frames[f];
            for (var l = 0; l < frame.layers.length; l++) {
                var oldPx = frame.layers[l].pixels;
                var newPx = new Uint8Array(newWidth * newHeight * 4);
                var copyW = Math.min(oldW, newWidth);
                var copyH = Math.min(oldH, newHeight);
                for (var y = 0; y < copyH; y++) {
                    for (var x = 0; x < copyW; x++) {
                        var oi = (y * oldW + x) * 4;
                        var ni = (y * newWidth + x) * 4;
                        newPx[ni]     = oldPx[oi];
                        newPx[ni + 1] = oldPx[oi + 1];
                        newPx[ni + 2] = oldPx[oi + 2];
                        newPx[ni + 3] = oldPx[oi + 3];
                    }
                }
                frame.layers[l].pixels = newPx;
            }
        }
        project.width = newWidth;
        project.height = newHeight;
    }

    // ── Serialize / Deserialize ──────────────────────────────────────
    function saveToJSON(project) {
        var data = {
            version: 1,
            name: project.name,
            width: project.width,
            height: project.height,
            fps: project.fps,
            activeFrameIndex: project.activeFrameIndex,
            frames: []
        };
        for (var f = 0; f < project.frames.length; f++) {
            var frame = project.frames[f];
            var frameData = {
                id: frame.id,
                activeLayerIndex: frame.activeLayerIndex,
                layers: []
            };
            for (var l = 0; l < frame.layers.length; l++) {
                frameData.layers.push(layerToSerializable(frame.layers[l]));
            }
            data.frames.push(frameData);
        }
        return JSON.stringify(data);
    }

    function loadFromJSON(json) {
        var data = typeof json === 'string' ? JSON.parse(json) : json;
        var project = createProject(data.width, data.height);
        project.name = data.name || 'Untitled';
        project.fps = data.fps || 8;
        project.activeFrameIndex = data.activeFrameIndex || 0;
        project.frames = [];
        for (var f = 0; f < data.frames.length; f++) {
            var fd = data.frames[f];
            var frame = {
                id: fd.id,
                layers: [],
                activeLayerIndex: fd.activeLayerIndex || 0
            };
            for (var l = 0; l < fd.layers.length; l++) {
                frame.layers.push(layerFromSerializable(fd.layers[l], data.width, data.height));
            }
            project.frames.push(frame);
        }
        return project;
    }

    // ── Autosave ─────────────────────────────────────────────────────
    var AUTOSAVE_KEY = 'pixel-art-autosave';

    function autosave(project) {
        try {
            localStorage.setItem(AUTOSAVE_KEY, saveToJSON(project));
        } catch (e) {
            // localStorage full or unavailable
        }
    }

    function loadAutosave() {
        try {
            var data = localStorage.getItem(AUTOSAVE_KEY);
            if (data) return loadFromJSON(data);
        } catch (e) {}
        return null;
    }

    function clearAutosave() {
        try { localStorage.removeItem(AUTOSAVE_KEY); } catch (e) {}
    }

    // ── Selection (rectangular) ──────────────────────────────────────
    function getSelection(layer, width, x0, y0, x1, y1) {
        var minX = Math.max(0, Math.min(x0, x1));
        var maxX = Math.min(width - 1, Math.max(x0, x1));
        var minY = Math.max(0, Math.min(y0, y1));
        var maxY = Math.max(y0, y1);
        var sw = maxX - minX + 1;
        var sh = maxY - minY + 1;
        var data = new Uint8Array(sw * sh * 4);
        for (var y = 0; y < sh; y++) {
            for (var x = 0; x < sw; x++) {
                var src = ((minY + y) * width + (minX + x)) * 4;
                var dst = (y * sw + x) * 4;
                data[dst]     = layer.pixels[src];
                data[dst + 1] = layer.pixels[src + 1];
                data[dst + 2] = layer.pixels[src + 2];
                data[dst + 3] = layer.pixels[src + 3];
            }
        }
        return { x: minX, y: minY, width: sw, height: sh, data: data };
    }

    // ── Public API ───────────────────────────────────────────────────
    window.PixelEngine = {
        // Constants
        NES_PALETTE: NES_PALETTE,

        // Color utilities
        hexToRgba: hexToRgba,
        rgbaToHex: rgbaToHex,
        colorsEqual: colorsEqual,

        // Project
        createProject: createProject,
        resizeProject: resizeProject,

        // Layers
        createLayer: createLayer,
        cloneLayer: cloneLayer,
        addLayer: addLayer,
        removeLayer: removeLayer,
        moveLayerUp: moveLayerUp,
        moveLayerDown: moveLayerDown,
        mergeDown: mergeDown,

        // Frames
        addFrame: addFrame,
        duplicateFrame: duplicateFrame,
        removeFrame: removeFrame,
        moveFrameLeft: moveFrameLeft,
        moveFrameRight: moveFrameRight,
        cloneFrame: cloneFrame,

        // Pixel access
        getPixel: getPixel,
        setPixel: setPixel,

        // Drawing tools
        drawPencil: drawPencil,
        drawEraser: drawEraser,
        drawLine: drawLine,
        drawRect: drawRect,
        drawEllipse: drawEllipse,
        floodFill: floodFill,
        eyedropper: eyedropper,

        // Render
        renderFrame: renderFrame,
        renderFrameToImageData: renderFrameToImageData,

        // Undo/Redo
        pushHistory: pushHistory,
        undo: undo,
        redo: redo,
        resetHistory: resetHistory,
        canUndo: canUndo,
        canRedo: canRedo,

        // Save/Load
        saveToJSON: saveToJSON,
        loadFromJSON: loadFromJSON,
        autosave: autosave,
        loadAutosave: loadAutosave,
        clearAutosave: clearAutosave,

        // Selection
        getSelection: getSelection,

        // Utilities
        uid: uid,
        deepClone: deepClone
    };

})();
