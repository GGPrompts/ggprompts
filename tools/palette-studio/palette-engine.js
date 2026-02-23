/* ======================================================================
   Palette Engine — Color math, harmony algorithms, contrast ratios,
   image quantization, and palette operations.
   Pure functions, no DOM dependency.
   Exposed as window.PaletteEngine
====================================================================== */
(function() {
    "use strict";

    // ── HSL ↔ RGB ──────────────────────────────────────────────────────

    /** HSL to RGB. h: 0-360, s: 0-100, l: 0-100 → {r,g,b} each 0-255 */
    function hslToRgb(h, s, l) {
        h = ((h % 360) + 360) % 360;
        s = clamp(s, 0, 100) / 100;
        l = clamp(l, 0, 100) / 100;

        var c = (1 - Math.abs(2 * l - 1)) * s;
        var x = c * (1 - Math.abs((h / 60) % 2 - 1));
        var m = l - c / 2;
        var r1, g1, b1;

        if      (h < 60)  { r1 = c; g1 = x; b1 = 0; }
        else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
        else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
        else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
        else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
        else              { r1 = c; g1 = 0; b1 = x; }

        return {
            r: Math.round((r1 + m) * 255),
            g: Math.round((g1 + m) * 255),
            b: Math.round((b1 + m) * 255)
        };
    }

    /** RGB to HSL. r,g,b: 0-255 → {h: 0-360, s: 0-100, l: 0-100} */
    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        var d = max - min;

        if (d === 0) {
            h = 0; s = 0;
        } else {
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
            else if (max === g) h = ((b - r) / d + 2) * 60;
            else                h = ((r - g) / d + 4) * 60;
        }

        return { h: round2(h), s: round2(s * 100), l: round2(l * 100) };
    }

    // ── Hex conversions ────────────────────────────────────────────────

    /** RGB {r,g,b} → "#rrggbb" */
    function rgbToHex(r, g, b) {
        return '#' + toHex(r) + toHex(g) + toHex(b);
    }

    /** "#rrggbb" or "#rgb" → {r,g,b} */
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex[0]+hex[0] + hex[1]+hex[1] + hex[2]+hex[2];
        }
        if (hex.length !== 6) return null;
        var n = parseInt(hex, 16);
        if (isNaN(n)) return null;
        return { r: (n >> 16) & 0xFF, g: (n >> 8) & 0xFF, b: n & 0xFF };
    }

    function toHex(n) {
        var h = clamp(Math.round(n), 0, 255).toString(16);
        return h.length < 2 ? '0' + h : h;
    }

    // ── Color object: canonical representation ─────────────────────────

    /** Create a normalized color object from HSL */
    function colorFromHsl(h, s, l) {
        var rgb = hslToRgb(h, s, l);
        return {
            h: round2(((h % 360) + 360) % 360),
            s: round2(clamp(s, 0, 100)),
            l: round2(clamp(l, 0, 100)),
            r: rgb.r, g: rgb.g, b: rgb.b,
            hex: rgbToHex(rgb.r, rgb.g, rgb.b)
        };
    }

    /** Create a normalized color object from RGB */
    function colorFromRgb(r, g, b) {
        r = clamp(Math.round(r), 0, 255);
        g = clamp(Math.round(g), 0, 255);
        b = clamp(Math.round(b), 0, 255);
        var hsl = rgbToHsl(r, g, b);
        return {
            h: hsl.h, s: hsl.s, l: hsl.l,
            r: r, g: g, b: b,
            hex: rgbToHex(r, g, b)
        };
    }

    /** Create a normalized color object from hex */
    function colorFromHex(hex) {
        var rgb = hexToRgb(hex);
        if (!rgb) return null;
        return colorFromRgb(rgb.r, rgb.g, rgb.b);
    }

    // ── Harmony generators ─────────────────────────────────────────────

    function harmonies(color) {
        var h = color.h, s = color.s, l = color.l;
        return {
            complementary:       [colorFromHsl(h, s, l), colorFromHsl(h + 180, s, l)],
            analogous:           [colorFromHsl(h - 30, s, l), colorFromHsl(h, s, l), colorFromHsl(h + 30, s, l)],
            triadic:             [colorFromHsl(h, s, l), colorFromHsl(h + 120, s, l), colorFromHsl(h + 240, s, l)],
            splitComplementary:  [colorFromHsl(h, s, l), colorFromHsl(h + 150, s, l), colorFromHsl(h + 210, s, l)],
            tetradic:            [colorFromHsl(h, s, l), colorFromHsl(h + 90, s, l), colorFromHsl(h + 180, s, l), colorFromHsl(h + 270, s, l)],
            monochromatic:       monochromaticScale(h, s, l, 5)
        };
    }

    function generateHarmony(color, type) {
        var all = harmonies(color);
        return all[type] || [color];
    }

    function monochromaticScale(h, s, l, count) {
        var result = [];
        for (var i = 0; i < count; i++) {
            var li = 20 + (60 / (count - 1)) * i;
            var si = s * (0.6 + 0.4 * (1 - Math.abs(li - 50) / 50));
            result.push(colorFromHsl(h, si, li));
        }
        return result;
    }

    // ── Shades & Tints ─────────────────────────────────────────────────

    /** Generate n shades (darker) of a color */
    function generateShades(color, count) {
        count = count || 5;
        var result = [];
        for (var i = 0; i < count; i++) {
            var t = (i + 1) / (count + 1);
            var l = color.l * (1 - t);
            result.push(colorFromHsl(color.h, color.s, l));
        }
        return result;
    }

    /** Generate n tints (lighter) of a color */
    function generateTints(color, count) {
        count = count || 5;
        var result = [];
        for (var i = 0; i < count; i++) {
            var t = (i + 1) / (count + 1);
            var l = color.l + (100 - color.l) * t;
            result.push(colorFromHsl(color.h, color.s, l));
        }
        return result;
    }

    /** Generate shades + base + tints combined strip */
    function generateShadesAndTints(color, shadesCount, tintsCount) {
        shadesCount = shadesCount || 4;
        tintsCount = tintsCount || 4;
        var shades = generateShades(color, shadesCount).reverse();
        var tints = generateTints(color, tintsCount);
        return shades.concat([colorFromHsl(color.h, color.s, color.l)], tints);
    }

    // ── WCAG Contrast ──────────────────────────────────────────────────

    /** Relative luminance per WCAG 2.0 */
    function relativeLuminance(r, g, b) {
        var rs = r / 255, gs = g / 255, bs = b / 255;
        rs = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
        gs = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
        bs = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    /** Contrast ratio between two colors (each has .r .g .b) */
    function contrastRatio(c1, c2) {
        var l1 = relativeLuminance(c1.r, c1.g, c1.b);
        var l2 = relativeLuminance(c2.r, c2.g, c2.b);
        var lighter = Math.max(l1, l2);
        var darker  = Math.min(l1, l2);
        return round2((lighter + 0.05) / (darker + 0.05));
    }

    /** Check WCAG compliance levels */
    function wcagCompliance(ratio) {
        return {
            ratio: ratio,
            AA_normal:  ratio >= 4.5,
            AA_large:   ratio >= 3,
            AAA_normal: ratio >= 7,
            AAA_large:  ratio >= 4.5
        };
    }

    // ── Image Quantization (Median Cut) ────────────────────────────────

    /**
     * Extract dominant colors from ImageData using median cut.
     * @param {ImageData} imageData — from canvas.getContext('2d').getImageData()
     * @param {number} colorCount — number of colors to extract (default 6)
     * @returns {Array} color objects sorted by frequency
     */
    function extractColorsFromImageData(imageData, colorCount) {
        colorCount = colorCount || 6;
        var pixels = samplePixels(imageData, 10000);
        if (pixels.length === 0) return [];

        var buckets = medianCut(pixels, colorCount);
        var results = buckets.map(function(bucket) {
            var avg = averageColor(bucket);
            return {
                color: colorFromRgb(avg.r, avg.g, avg.b),
                count: bucket.length
            };
        });

        results.sort(function(a, b) { return b.count - a.count; });
        return results.map(function(r) { return r.color; });
    }

    /** Sample up to maxSamples pixels from image data, skipping near-transparent */
    function samplePixels(imageData, maxSamples) {
        var data = imageData.data;
        var total = data.length / 4;
        var step = Math.max(1, Math.floor(total / maxSamples));
        var pixels = [];

        for (var i = 0; i < total; i += step) {
            var idx = i * 4;
            if (data[idx + 3] < 128) continue; // skip transparent
            pixels.push([data[idx], data[idx + 1], data[idx + 2]]);
        }
        return pixels;
    }

    /** Median cut algorithm: recursively split pixel groups */
    function medianCut(pixels, depth) {
        if (depth <= 1 || pixels.length <= 1) return [pixels];

        // Find channel with widest range
        var minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
        for (var i = 0; i < pixels.length; i++) {
            var p = pixels[i];
            if (p[0] < minR) minR = p[0]; if (p[0] > maxR) maxR = p[0];
            if (p[1] < minG) minG = p[1]; if (p[1] > maxG) maxG = p[1];
            if (p[2] < minB) minB = p[2]; if (p[2] > maxB) maxB = p[2];
        }

        var rangeR = maxR - minR, rangeG = maxG - minG, rangeB = maxB - minB;
        var channel;
        if (rangeR >= rangeG && rangeR >= rangeB) channel = 0;
        else if (rangeG >= rangeR && rangeG >= rangeB) channel = 1;
        else channel = 2;

        // Sort by widest channel and split at median
        pixels.sort(function(a, b) { return a[channel] - b[channel]; });
        var mid = Math.floor(pixels.length / 2);
        var left  = pixels.slice(0, mid);
        var right = pixels.slice(mid);

        var halfDepth = Math.ceil(depth / 2);
        return medianCut(left, halfDepth).concat(medianCut(right, halfDepth));
    }

    /** Average color of a pixel bucket */
    function averageColor(pixels) {
        if (pixels.length === 0) return { r: 0, g: 0, b: 0 };
        var sr = 0, sg = 0, sb = 0;
        for (var i = 0; i < pixels.length; i++) {
            sr += pixels[i][0]; sg += pixels[i][1]; sb += pixels[i][2];
        }
        var n = pixels.length;
        return { r: Math.round(sr / n), g: Math.round(sg / n), b: Math.round(sb / n) };
    }

    // ── Export Formatters ──────────────────────────────────────────────

    /** Export palette as CSS :root variables */
    function exportCSS(palette, prefix) {
        prefix = prefix || 'color';
        var names = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary', 'octonary'];
        var lines = [':root {'];
        for (var i = 0; i < palette.length; i++) {
            var name = i < names.length ? names[i] : 'color-' + (i + 1);
            lines.push('    --' + prefix + '-' + name + ': ' + palette[i].hex + ';');
        }
        lines.push('}');
        return lines.join('\n');
    }

    /** Export palette as JSON */
    function exportJSON(palette) {
        var obj = {};
        var names = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary', 'senary', 'septenary', 'octonary'];
        for (var i = 0; i < palette.length; i++) {
            var name = i < names.length ? names[i] : 'color_' + (i + 1);
            var c = palette[i];
            obj[name] = {
                hex: c.hex,
                rgb: 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')',
                hsl: 'hsl(' + Math.round(c.h) + ', ' + Math.round(c.s) + '%, ' + Math.round(c.l) + '%)'
            };
        }
        return JSON.stringify(obj, null, 2);
    }

    /** Format color as CSS rgb() */
    function formatRgb(color) {
        return 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
    }

    /** Format color as CSS hsl() */
    function formatHsl(color) {
        return 'hsl(' + Math.round(color.h) + ', ' + Math.round(color.s) + '%, ' + Math.round(color.l) + '%)';
    }

    // ── Palette Operations ─────────────────────────────────────────────

    /** Sort palette by hue */
    function sortByHue(palette) {
        return palette.slice().sort(function(a, b) { return a.h - b.h; });
    }

    /** Sort palette by luminance */
    function sortByLuminance(palette) {
        return palette.slice().sort(function(a, b) { return a.l - b.l; });
    }

    /** Generate a random pleasing color */
    function randomColor() {
        var h = Math.floor(Math.random() * 360);
        var s = 50 + Math.floor(Math.random() * 40);   // 50-90
        var l = 35 + Math.floor(Math.random() * 35);   // 35-70
        return colorFromHsl(h, s, l);
    }

    /** Generate a random palette of n colors */
    function randomPalette(count) {
        count = count || 5;
        var base = randomColor();
        var types = ['analogous', 'triadic', 'splitComplementary', 'tetradic', 'complementary'];
        var type = types[Math.floor(Math.random() * types.length)];
        var palette = generateHarmony(base, type);

        // Pad or trim to desired count
        while (palette.length < count) {
            palette.push(randomColor());
        }
        return palette.slice(0, count);
    }

    // ── Color distance (for deduplication) ─────────────────────────────

    function colorDistance(c1, c2) {
        var dr = c1.r - c2.r, dg = c1.g - c2.g, db = c1.b - c2.b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    // ── Utilities ──────────────────────────────────────────────────────

    function clamp(v, min, max) {
        return v < min ? min : v > max ? max : v;
    }

    function round2(n) {
        return Math.round(n * 100) / 100;
    }

    // ── Public API ─────────────────────────────────────────────────────

    window.PaletteEngine = {
        // Conversions
        hslToRgb: hslToRgb,
        rgbToHsl: rgbToHsl,
        rgbToHex: rgbToHex,
        hexToRgb: hexToRgb,

        // Color objects
        colorFromHsl: colorFromHsl,
        colorFromRgb: colorFromRgb,
        colorFromHex: colorFromHex,

        // Harmony
        harmonies: harmonies,
        generateHarmony: generateHarmony,

        // Shades & tints
        generateShades: generateShades,
        generateTints: generateTints,
        generateShadesAndTints: generateShadesAndTints,

        // Contrast
        relativeLuminance: relativeLuminance,
        contrastRatio: contrastRatio,
        wcagCompliance: wcagCompliance,

        // Image
        extractColorsFromImageData: extractColorsFromImageData,

        // Export
        exportCSS: exportCSS,
        exportJSON: exportJSON,
        formatRgb: formatRgb,
        formatHsl: formatHsl,

        // Palette ops
        sortByHue: sortByHue,
        sortByLuminance: sortByLuminance,
        randomColor: randomColor,
        randomPalette: randomPalette,
        colorDistance: colorDistance,

        // Utils
        clamp: clamp
    };

})();
