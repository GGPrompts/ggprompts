/* renderer.js — Canvas stroke-by-stroke replay for Sketch Detective
   Draws strokes at original recorded speed using {x, y, t} point data.
   Coordinates are normalized 0-1 and scaled to canvas size. */

window.SketchRenderer = (function () {
    'use strict';

    var canvas, ctx;
    var width, height, padding;
    var drawing = null;
    var startTime = 0;
    var playing = false;
    var rafId = null;
    var onComplete = null;
    var playbackRate = 1;
    var drawnPoints = 0;
    var totalPoints = 0;

    // Pencil style settings
    var STROKE_COLOR = '#2c2c2c';
    var STROKE_WIDTH_BASE = 2.5;
    var LINE_CAP = 'round';
    var LINE_JOIN = 'round';

    function init(canvasEl) {
        canvas = canvasEl;
        ctx = canvas.getContext('2d');
        resize();
    }

    function resize() {
        if (!canvas) return;
        var container = canvas.parentElement;
        var size = Math.min(container.clientWidth, container.clientHeight, 600);
        canvas.width = size;
        canvas.height = size;
        width = size;
        height = size;
        padding = size * 0.05;
        // Redraw current state if we have a drawing
        if (drawing && !playing) {
            redrawUpTo(Infinity);
        }
    }

    function clear() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);
        // Draw notebook lines
        drawNotebookLines();
    }

    function drawNotebookLines() {
        ctx.save();
        ctx.strokeStyle = 'rgba(173, 200, 230, 0.3)';
        ctx.lineWidth = 1;
        var spacing = height / 20;
        for (var i = 1; i < 20; i++) {
            var y = Math.round(i * spacing) + 0.5;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        // Red margin line
        ctx.strokeStyle = 'rgba(220, 100, 100, 0.25)';
        ctx.lineWidth = 1.5;
        var margin = width * 0.08;
        ctx.beginPath();
        ctx.moveTo(margin, 0);
        ctx.lineTo(margin, height);
        ctx.stroke();
        ctx.restore();
    }

    function toCanvasX(nx) {
        return padding + nx * (width - padding * 2);
    }

    function toCanvasY(ny) {
        return padding + ny * (height - padding * 2);
    }

    function load(drawingData, rate) {
        drawing = drawingData;
        playbackRate = rate || 1;
        playing = false;
        drawnPoints = 0;
        totalPoints = 0;
        for (var i = 0; i < drawing.strokes.length; i++) {
            totalPoints += drawing.strokes[i].length;
        }
        clear();
    }

    function play(completeCb) {
        if (!drawing) return;
        onComplete = completeCb || null;
        startTime = performance.now();
        playing = true;
        drawnPoints = 0;
        clear();
        tick();
    }

    function stop() {
        playing = false;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function getProgress() {
        if (totalPoints === 0) return 0;
        return drawnPoints / totalPoints;
    }

    function getMaxTime() {
        if (!drawing) return 0;
        var maxT = 0;
        for (var i = 0; i < drawing.strokes.length; i++) {
            var stroke = drawing.strokes[i];
            if (stroke.length > 0) {
                var last = stroke[stroke.length - 1].t;
                if (last > maxT) maxT = last;
            }
        }
        return maxT;
    }

    function tick() {
        if (!playing || !drawing) return;

        var elapsed = (performance.now() - startTime) * playbackRate;
        var done = redrawUpTo(elapsed);

        if (done) {
            playing = false;
            if (onComplete) onComplete();
        } else {
            rafId = requestAnimationFrame(tick);
        }
    }

    function redrawUpTo(elapsed) {
        clear();
        ctx.save();
        ctx.strokeStyle = STROKE_COLOR;
        ctx.lineWidth = STROKE_WIDTH_BASE * (width / 400);
        ctx.lineCap = LINE_CAP;
        ctx.lineJoin = LINE_JOIN;

        var allDone = true;
        drawnPoints = 0;

        for (var s = 0; s < drawing.strokes.length; s++) {
            var stroke = drawing.strokes[s];
            if (stroke.length === 0) continue;

            // Find how many points to draw for this stroke
            var count = 0;
            for (var j = 0; j < stroke.length; j++) {
                if (stroke[j].t <= elapsed) {
                    count = j + 1;
                } else {
                    allDone = false;
                    break;
                }
            }

            if (count === stroke.length && stroke[stroke.length - 1].t <= elapsed) {
                // fully drawn
            } else {
                allDone = false;
            }

            drawnPoints += count;

            if (count < 2) continue;

            ctx.beginPath();
            ctx.moveTo(toCanvasX(stroke[0].x), toCanvasY(stroke[0].y));

            for (var k = 1; k < count; k++) {
                // Slightly vary line width for pencil feel
                ctx.lineTo(toCanvasX(stroke[k].x), toCanvasY(stroke[k].y));
            }
            ctx.stroke();
        }

        ctx.restore();
        return allDone;
    }

    /** Instantly draw the full drawing */
    function drawComplete() {
        if (!drawing) return;
        redrawUpTo(Infinity);
        playing = false;
    }

    return {
        init: init,
        resize: resize,
        clear: clear,
        load: load,
        play: play,
        stop: stop,
        drawComplete: drawComplete,
        getProgress: getProgress,
        getMaxTime: getMaxTime
    };
})();
