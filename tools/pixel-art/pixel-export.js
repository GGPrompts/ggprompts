/* ======================================================================
   Pixel Export — PNG single frame, sprite sheet, and GIF animation
   export for the Pixel Art Editor. No external dependencies.
====================================================================== */
(function() {
    "use strict";

    var PE = window.PixelEngine;

    // ── Download helper ──────────────────────────────────────────────
    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    }

    function downloadDataURL(dataURL, filename) {
        var a = document.createElement('a');
        a.href = dataURL;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // ── Export single frame as PNG ───────────────────────────────────
    function exportPNG(project, frameIndex, scale) {
        scale = scale || 1;
        frameIndex = frameIndex !== undefined ? frameIndex : project.activeFrameIndex;
        var srcCanvas = PE.renderFrame(project, frameIndex);
        var w = project.width * scale;
        var h = project.height * scale;
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(srcCanvas, 0, 0, w, h);
        return canvas.toDataURL('image/png');
    }

    function downloadPNG(project, frameIndex, scale) {
        var dataURL = exportPNG(project, frameIndex, scale);
        var name = (project.name || 'pixel-art').replace(/\s+/g, '-').toLowerCase();
        downloadDataURL(dataURL, name + '-frame' + (frameIndex + 1) + '.png');
    }

    // ── Export sprite sheet (all frames in a row) ────────────────────
    function exportSpriteSheet(project, scale, layout) {
        scale = scale || 1;
        layout = layout || 'horizontal';
        var frameCount = project.frames.length;
        var fw = project.width * scale;
        var fh = project.height * scale;

        var cols, rows;
        if (layout === 'horizontal') {
            cols = frameCount;
            rows = 1;
        } else if (layout === 'vertical') {
            cols = 1;
            rows = frameCount;
        } else {
            // Grid: try to make it roughly square
            cols = Math.ceil(Math.sqrt(frameCount));
            rows = Math.ceil(frameCount / cols);
        }

        var canvas = document.createElement('canvas');
        canvas.width = cols * fw;
        canvas.height = rows * fh;
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        for (var i = 0; i < frameCount; i++) {
            var srcCanvas = PE.renderFrame(project, i);
            var col = i % cols;
            var row = Math.floor(i / cols);
            ctx.drawImage(srcCanvas, col * fw, row * fh, fw, fh);
        }

        return canvas.toDataURL('image/png');
    }

    function downloadSpriteSheet(project, scale, layout) {
        var dataURL = exportSpriteSheet(project, scale, layout);
        var name = (project.name || 'pixel-art').replace(/\s+/g, '-').toLowerCase();
        downloadDataURL(dataURL, name + '-spritesheet.png');
    }

    // ── GIF Export (GIF89a with LZW compression) ─────────────────────
    // Minimal GIF encoder for animation export

    function buildGIF(frames, width, height, delay) {
        // frames: array of { imageData: ImageData }
        // delay: in 1/100th sec units

        var buf = [];

        function writeByte(b) { buf.push(b & 0xFF); }
        function writeShort(s) { writeByte(s & 0xFF); writeByte((s >> 8) & 0xFF); }
        function writeStr(s) {
            for (var i = 0; i < s.length; i++) buf.push(s.charCodeAt(i));
        }

        // --- Quantize to 256 colors ---
        function quantizeFrame(imageData) {
            var pixels = imageData.data;
            var colorMap = {};
            var palette = [];
            var indexed = new Uint8Array(width * height);
            var transparentIndex = -1;

            // Build palette from unique colors (up to 256)
            for (var i = 0; i < pixels.length; i += 4) {
                var a = pixels[i + 3];
                if (a < 128) {
                    // transparent
                    continue;
                }
                var key = pixels[i] + ',' + pixels[i+1] + ',' + pixels[i+2];
                if (!(key in colorMap) && palette.length < 255) {
                    colorMap[key] = palette.length;
                    palette.push([pixels[i], pixels[i+1], pixels[i+2]]);
                }
            }

            // Reserve last slot for transparency
            if (palette.length === 0) palette.push([0, 0, 0]);
            transparentIndex = palette.length;
            palette.push([0, 0, 0]);

            // Pad palette to power of 2
            var palSize = 2;
            while (palSize < palette.length) palSize *= 2;
            while (palette.length < palSize) palette.push([0, 0, 0]);

            // Map pixels to indices
            for (var j = 0; j < pixels.length; j += 4) {
                var pi = j / 4;
                if (pixels[j + 3] < 128) {
                    indexed[pi] = transparentIndex;
                } else {
                    var k = pixels[j] + ',' + pixels[j+1] + ',' + pixels[j+2];
                    indexed[pi] = colorMap[k] !== undefined ? colorMap[k] : 0;
                }
            }

            var colorBits = 1;
            while ((1 << colorBits) < palSize) colorBits++;

            return {
                palette: palette,
                indexed: indexed,
                transparentIndex: transparentIndex,
                colorBits: colorBits,
                palSize: palSize
            };
        }

        // --- LZW Encoder ---
        function lzwEncode(indexed, colorBits) {
            var minCodeSize = Math.max(2, colorBits);
            var clearCode = 1 << minCodeSize;
            var eoiCode = clearCode + 1;
            var nextCode = eoiCode + 1;
            var codeSize = minCodeSize + 1;
            var maxCode = (1 << codeSize);

            var table = {};
            function resetTable() {
                table = {};
                nextCode = eoiCode + 1;
                codeSize = minCodeSize + 1;
                maxCode = (1 << codeSize);
            }

            var output = [];
            var bitBuf = 0;
            var bitCount = 0;

            function writeCode(code) {
                bitBuf |= (code << bitCount);
                bitCount += codeSize;
                while (bitCount >= 8) {
                    output.push(bitBuf & 0xFF);
                    bitBuf >>= 8;
                    bitCount -= 8;
                }
            }

            resetTable();
            writeCode(clearCode);

            var prefix = indexed[0].toString();
            for (var i = 1; i < indexed.length; i++) {
                var suffix = indexed[i].toString();
                var combined = prefix + ',' + suffix;
                if (table[combined] !== undefined) {
                    prefix = combined;
                } else {
                    // Output code for prefix
                    var prefixParts = prefix.split(',');
                    if (prefixParts.length === 1) {
                        writeCode(parseInt(prefixParts[0]));
                    } else {
                        writeCode(table[prefix]);
                    }
                    // Add to table
                    if (nextCode < 4096) {
                        table[combined] = nextCode++;
                        if (nextCode > maxCode && codeSize < 12) {
                            codeSize++;
                            maxCode = (1 << codeSize);
                        }
                    } else {
                        writeCode(clearCode);
                        resetTable();
                    }
                    prefix = suffix;
                }
            }

            // Output remaining
            var parts = prefix.split(',');
            if (parts.length === 1) {
                writeCode(parseInt(parts[0]));
            } else {
                writeCode(table[prefix]);
            }
            writeCode(eoiCode);

            // Flush remaining bits
            if (bitCount > 0) output.push(bitBuf & 0xFF);

            return { data: output, minCodeSize: minCodeSize };
        }

        // --- Write GIF ---
        // Header
        writeStr('GIF89a');
        writeShort(width);
        writeShort(height);

        // Use first frame for global color table
        var firstQ = quantizeFrame(frames[0].imageData);
        var gctBits = firstQ.colorBits;
        writeByte(0x80 | ((gctBits - 1) << 4) | (gctBits - 1)); // GCT flag + color resolution + GCT size
        writeByte(firstQ.transparentIndex); // background color index
        writeByte(0); // pixel aspect ratio

        // Global Color Table
        for (var c = 0; c < firstQ.palSize; c++) {
            writeByte(firstQ.palette[c][0]);
            writeByte(firstQ.palette[c][1]);
            writeByte(firstQ.palette[c][2]);
        }

        // Netscape extension for looping
        writeByte(0x21); // Extension
        writeByte(0xFF); // Application extension
        writeByte(11);   // Block size
        writeStr('NETSCAPE2.0');
        writeByte(3);    // Sub-block size
        writeByte(1);    // Loop indicator
        writeShort(0);   // Loop count (0 = infinite)
        writeByte(0);    // Block terminator

        for (var fi = 0; fi < frames.length; fi++) {
            var q = fi === 0 ? firstQ : quantizeFrame(frames[fi].imageData);

            // Graphic Control Extension
            writeByte(0x21); // Extension
            writeByte(0xF9); // GCE
            writeByte(4);    // Block size
            writeByte(0x09); // Dispose: restore to bg + transparent flag
            writeShort(delay);
            writeByte(q.transparentIndex);
            writeByte(0);    // Block terminator

            // Image Descriptor
            writeByte(0x2C);
            writeShort(0); // x
            writeShort(0); // y
            writeShort(width);
            writeShort(height);

            if (fi === 0) {
                writeByte(0); // No local color table (use GCT)
            } else {
                // Local color table
                writeByte(0x80 | (q.colorBits - 1));
                for (var lc = 0; lc < q.palSize; lc++) {
                    writeByte(q.palette[lc][0]);
                    writeByte(q.palette[lc][1]);
                    writeByte(q.palette[lc][2]);
                }
            }

            // LZW compressed data
            var lzw = lzwEncode(q.indexed, fi === 0 ? gctBits : q.colorBits);
            writeByte(lzw.minCodeSize);

            // Write sub-blocks (max 255 bytes each)
            var lzwData = lzw.data;
            var pos = 0;
            while (pos < lzwData.length) {
                var blockSize = Math.min(255, lzwData.length - pos);
                writeByte(blockSize);
                for (var bi = 0; bi < blockSize; bi++) {
                    writeByte(lzwData[pos++]);
                }
            }
            writeByte(0); // Block terminator
        }

        // GIF Trailer
        writeByte(0x3B);

        return new Uint8Array(buf);
    }

    function exportGIF(project, scale, onProgress) {
        scale = scale || 1;
        var w = project.width * scale;
        var h = project.height * scale;
        var delay = Math.round(100 / project.fps);
        var frames = [];

        for (var i = 0; i < project.frames.length; i++) {
            var srcCanvas = PE.renderFrame(project, i);
            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            var ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(srcCanvas, 0, 0, w, h);
            frames.push({ imageData: ctx.getImageData(0, 0, w, h) });
            if (onProgress) onProgress((i + 1) / project.frames.length);
        }

        var gifData = buildGIF(frames, w, h, delay);
        return new Blob([gifData], { type: 'image/gif' });
    }

    function downloadGIF(project, scale) {
        var blob = exportGIF(project, scale);
        var name = (project.name || 'pixel-art').replace(/\s+/g, '-').toLowerCase();
        downloadBlob(blob, name + '.gif');
    }

    // ── Public API ───────────────────────────────────────────────────
    window.PixelExport = {
        exportPNG: exportPNG,
        downloadPNG: downloadPNG,
        exportSpriteSheet: exportSpriteSheet,
        downloadSpriteSheet: downloadSpriteSheet,
        exportGIF: exportGIF,
        downloadGIF: downloadGIF,
        downloadBlob: downloadBlob,
        downloadDataURL: downloadDataURL
    };

})();
