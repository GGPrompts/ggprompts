/* ======================================================================
   GIF Export — Pure-JS GIF89a encoder with LZW compression and
   median-cut color quantization. No external dependencies.
====================================================================== */
(function() {
    "use strict";

    // ── Median-Cut Color Quantizer ───────────────────────────────────
    // Reduces an image to 256 colors max.

    function quantize(pixels, maxColors) {
        maxColors = maxColors || 256;
        // Build initial color list (sample every 4th pixel for speed)
        var colors = [];
        for (var i = 0; i < pixels.length; i += 16) {  // step by 4 pixels (RGBA * 4)
            colors.push([pixels[i], pixels[i+1], pixels[i+2]]);
        }
        if (colors.length === 0) colors.push([0, 0, 0]);

        // Median-cut subdivision
        var buckets = [colors];
        while (buckets.length < maxColors) {
            var longest = 0, longestIdx = 0;
            for (var b = 0; b < buckets.length; b++) {
                if (buckets[b].length > longest) {
                    longest = buckets[b].length;
                    longestIdx = b;
                }
            }
            if (longest <= 1) break;

            var bucket = buckets[longestIdx];
            // Find channel with widest range
            var ranges = [0, 0, 0];
            var mins = [255, 255, 255], maxs = [0, 0, 0];
            for (var c = 0; c < bucket.length; c++) {
                for (var ch = 0; ch < 3; ch++) {
                    if (bucket[c][ch] < mins[ch]) mins[ch] = bucket[c][ch];
                    if (bucket[c][ch] > maxs[ch]) maxs[ch] = bucket[c][ch];
                }
            }
            for (var ch2 = 0; ch2 < 3; ch2++) ranges[ch2] = maxs[ch2] - mins[ch2];
            var splitCh = ranges[0] >= ranges[1] && ranges[0] >= ranges[2] ? 0 :
                         ranges[1] >= ranges[2] ? 1 : 2;

            bucket.sort(function(a, b) { return a[splitCh] - b[splitCh]; });
            var mid = Math.floor(bucket.length / 2);
            buckets[longestIdx] = bucket.slice(0, mid);
            buckets.push(bucket.slice(mid));
        }

        // Build palette from bucket averages
        var palette = [];
        for (var p = 0; p < buckets.length; p++) {
            var bk = buckets[p];
            var sr = 0, sg = 0, sb = 0;
            for (var j = 0; j < bk.length; j++) {
                sr += bk[j][0]; sg += bk[j][1]; sb += bk[j][2];
            }
            palette.push([
                Math.round(sr / bk.length),
                Math.round(sg / bk.length),
                Math.round(sb / bk.length)
            ]);
        }

        // Pad to power of 2
        var size = 2;
        while (size < palette.length) size *= 2;
        while (palette.length < size) palette.push([0, 0, 0]);

        return palette;
    }

    // ── Map pixels to palette indices ────────────────────────────────
    function mapPixels(pixels, w, h, palette) {
        var indices = new Uint8Array(w * h);
        // Build simple cache for speed
        var cache = {};
        for (var i = 0; i < w * h; i++) {
            var off = i * 4;
            var r = pixels[off], g = pixels[off+1], b = pixels[off+2];
            var key = (r << 16) | (g << 8) | b;
            if (cache[key] !== undefined) {
                indices[i] = cache[key];
                continue;
            }
            var best = 0, bestDist = Infinity;
            for (var p = 0; p < palette.length; p++) {
                var dr = r - palette[p][0];
                var dg = g - palette[p][1];
                var db = b - palette[p][2];
                var dist = dr * dr + dg * dg + db * db;
                if (dist < bestDist) {
                    bestDist = dist;
                    best = p;
                }
            }
            cache[key] = best;
            indices[i] = best;
        }
        return indices;
    }

    // ── LZW Encoder ──────────────────────────────────────────────────
    function lzwEncode(indices, minCodeSize) {
        var clearCode = 1 << minCodeSize;
        var eoiCode = clearCode + 1;
        var codeSize = minCodeSize + 1;
        var nextCode = eoiCode + 1;
        var maxCode = (1 << codeSize);

        var output = [];
        var buffer = 0;
        var bufferBits = 0;

        function emit(code) {
            buffer |= code << bufferBits;
            bufferBits += codeSize;
            while (bufferBits >= 8) {
                output.push(buffer & 0xff);
                buffer >>= 8;
                bufferBits -= 8;
            }
        }

        // Initialize table
        var table = {};
        function resetTable() {
            table = {};
            for (var i = 0; i < clearCode; i++) {
                table[String(i)] = i;
            }
            nextCode = eoiCode + 1;
            codeSize = minCodeSize + 1;
            maxCode = 1 << codeSize;
        }

        resetTable();
        emit(clearCode);

        if (indices.length === 0) {
            emit(eoiCode);
            if (bufferBits > 0) output.push(buffer & 0xff);
            return output;
        }

        var current = String(indices[0]);
        for (var i = 1; i < indices.length; i++) {
            var next = current + ',' + indices[i];
            if (table[next] !== undefined) {
                current = next;
            } else {
                emit(table[current]);
                if (nextCode < 4096) {
                    table[next] = nextCode++;
                    if (nextCode > maxCode && codeSize < 12) {
                        codeSize++;
                        maxCode = 1 << codeSize;
                    }
                } else {
                    emit(clearCode);
                    resetTable();
                }
                current = String(indices[i]);
            }
        }
        emit(table[current]);
        emit(eoiCode);
        if (bufferBits > 0) output.push(buffer & 0xff);

        return output;
    }

    // ── GIF Builder ──────────────────────────────────────────────────
    function GIFBuilder(width, height, opts) {
        opts = opts || {};
        this.width = width;
        this.height = height;
        this.loop = opts.loop !== false;
        this.frames = [];
    }

    GIFBuilder.prototype.addFrame = function(imageData, delay) {
        this.frames.push({
            pixels: imageData.data,
            delay: Math.round(delay / 10)  // GIF delay is in centiseconds
        });
    };

    GIFBuilder.prototype.build = function() {
        var w = this.width, h = this.height;
        var bytes = [];

        // ── Header
        push(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]);  // GIF89a

        // ── Global palette from first frame
        var palette = quantize(this.frames[0].pixels, 256);
        var colorBits = Math.ceil(Math.log2(palette.length));
        if (colorBits < 1) colorBits = 1;
        var paletteSize = 1 << colorBits;

        // Logical Screen Descriptor
        pushWord(bytes, w);
        pushWord(bytes, h);
        bytes.push(0x80 | ((colorBits - 1) << 4) | (colorBits - 1));  // GCT flag + color resolution + GCT size
        bytes.push(0);  // bg color index
        bytes.push(0);  // pixel aspect ratio

        // Global Color Table
        for (var p = 0; p < paletteSize; p++) {
            var c = palette[p] || [0, 0, 0];
            bytes.push(c[0], c[1], c[2]);
        }

        // Application Extension (Netscape looping)
        if (this.loop) {
            push(bytes, [0x21, 0xff, 0x0b]);
            push(bytes, [0x4e, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2e, 0x30]);
            push(bytes, [0x03, 0x01, 0x00, 0x00, 0x00]);
        }

        // ── Frames
        for (var f = 0; f < this.frames.length; f++) {
            var frame = this.frames[f];
            var indices = mapPixels(frame.pixels, w, h, palette);

            // Graphic Control Extension
            push(bytes, [0x21, 0xf9, 0x04, 0x00]);
            pushWord(bytes, frame.delay);
            bytes.push(0, 0);  // transparent index + block terminator

            // Image Descriptor
            bytes.push(0x2c);
            pushWord(bytes, 0);  // left
            pushWord(bytes, 0);  // top
            pushWord(bytes, w);
            pushWord(bytes, h);
            bytes.push(0);  // no local color table

            // Image Data
            var minCodeSize = colorBits;
            if (minCodeSize < 2) minCodeSize = 2;
            bytes.push(minCodeSize);
            var compressed = lzwEncode(indices, minCodeSize);

            // Sub-blocks (max 255 bytes each)
            var pos = 0;
            while (pos < compressed.length) {
                var chunkSize = Math.min(255, compressed.length - pos);
                bytes.push(chunkSize);
                for (var bi = 0; bi < chunkSize; bi++) {
                    bytes.push(compressed[pos++]);
                }
            }
            bytes.push(0);  // block terminator
        }

        // Trailer
        bytes.push(0x3b);

        return new Uint8Array(bytes);
    };

    function push(arr, data) {
        for (var i = 0; i < data.length; i++) arr.push(data[i]);
    }
    function pushWord(arr, val) {
        arr.push(val & 0xff, (val >> 8) & 0xff);
    }

    // ── Export API ───────────────────────────────────────────────────
    // Renders animation frames to an offscreen canvas, encodes GIF.
    // Calls onProgress(0..1) periodically, returns a Promise resolving to a Blob.

    function exportGIF(opts) {
        var animation = opts.animation;
        var figures = opts.figures;
        var drawFn = opts.drawFrame;  // function(ctx, w, h, time) — draws one frame
        var width = opts.width || 400;
        var height = opts.height || 300;
        var fps = opts.fps || 24;
        var onProgress = opts.onProgress || function() {};

        var duration = window.AnimatorEngine.getAnimationDuration(animation);
        if (duration <= 0) duration = 1;
        var totalFrames = Math.ceil(duration * fps);
        var delay = 1000 / fps;

        var offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        var offCtx = offCanvas.getContext('2d');

        var gif = new GIFBuilder(width, height, { loop: opts.loop !== false });

        return new Promise(function(resolve) {
            var frameIdx = 0;
            function renderBatch() {
                var batchEnd = Math.min(frameIdx + 4, totalFrames);
                for (; frameIdx < batchEnd; frameIdx++) {
                    var time = (frameIdx / totalFrames) * duration;
                    offCtx.clearRect(0, 0, width, height);
                    drawFn(offCtx, width, height, time);
                    var imageData = offCtx.getImageData(0, 0, width, height);
                    gif.addFrame(imageData, delay);
                    onProgress(frameIdx / totalFrames);
                }
                if (frameIdx < totalFrames) {
                    setTimeout(renderBatch, 0);
                } else {
                    onProgress(1);
                    var data = gif.build();
                    resolve(new Blob([data], { type: 'image/gif' }));
                }
            }
            renderBatch();
        });
    }

    function downloadBlob(blob, filename) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename || 'animation.gif';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    }

    window.GIFExport = {
        exportGIF: exportGIF,
        downloadBlob: downloadBlob
    };
})();
