/* ======================================================================
   Timeline UI — Keyframe strip, scrubber, playback controls for the
   Stick Figure Animation Studio.
   Depends on: AnimatorEngine (animator-engine.js)
====================================================================== */
(function() {
    "use strict";

    var AE = null;  // Set on init

    // ── State ────────────────────────────────────────────────────────
    var container = null;
    var canvas = null;
    var ctx = null;
    var animation = null;
    var figures = [];
    var currentTime = 0;
    var playbackState = 'stopped';  // 'stopped' | 'playing' | 'paused'
    var playbackSpeed = 1;
    var loopEnabled = true;
    var onionEnabled = false;
    var lastFrameTime = 0;
    var animFrameId = null;
    var selectedKeyframeId = null;

    // Callbacks
    var onTimeChange = null;
    var onKeyframeSelect = null;
    var onPlaybackChange = null;

    // Layout
    var HEADER_H = 32;
    var TRACK_H = 26;
    var RULER_H = 22;
    var SCRUBBER_W = 2;
    var KF_SIZE = 8;
    var pixelsPerSecond = 120;
    var scrollX = 0;

    // Drag state
    var dragging = null;  // { type: 'scrubber' | 'keyframe', kfId, startX, startTime }

    // ── Initialize ───────────────────────────────────────────────────
    function init(opts) {
        AE = window.AnimatorEngine;
        container = opts.container;
        animation = opts.animation;
        figures = opts.figures || [];
        onTimeChange = opts.onTimeChange || function() {};
        onKeyframeSelect = opts.onKeyframeSelect || function() {};
        onPlaybackChange = opts.onPlaybackChange || function() {};

        // Create canvas
        canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.cursor = 'default';
        container.appendChild(canvas);

        resize();
        bindEvents();
        render();
    }

    function resize() {
        if (!canvas || !container) return;
        var rect = container.getBoundingClientRect();
        var dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        canvas._cssW = rect.width;
        canvas._cssH = rect.height;
        render();
    }

    // ── Update refs ──────────────────────────────────────────────────
    function setAnimation(anim) { animation = anim; render(); }
    function setFigures(figs) { figures = figs; render(); }

    // ── Time ↔ Pixel conversion ──────────────────────────────────────
    function timeToX(t) { return (t * pixelsPerSecond) - scrollX + 80; }
    function xToTime(x) { return Math.max(0, (x - 80 + scrollX) / pixelsPerSecond); }

    // ── Render ───────────────────────────────────────────────────────
    function render() {
        if (!ctx || !canvas) return;
        var W = canvas._cssW || 800;
        var H = canvas._cssH || 180;

        ctx.clearRect(0, 0, W, H);

        // Background
        ctx.fillStyle = '#0d0a08';
        ctx.fillRect(0, 0, W, H);

        // Figure label area
        ctx.fillStyle = '#151110';
        ctx.fillRect(0, 0, 80, H);
        ctx.strokeStyle = '#2d2522';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(80, H); ctx.stroke();

        // Ruler
        drawRuler(W);

        // Track area
        var trackY = RULER_H;
        for (var i = 0; i < figures.length; i++) {
            var fig = figures[i];
            var y = trackY + i * TRACK_H;

            // Alternating background
            if (i % 2 === 1) {
                ctx.fillStyle = 'rgba(45, 37, 34, 0.3)';
                ctx.fillRect(80, y, W - 80, TRACK_H);
            }

            // Figure name
            ctx.fillStyle = '#8a7a72';
            ctx.font = '11px "IBM Plex Mono", monospace';
            ctx.textBaseline = 'middle';
            ctx.fillText(fig._animName.slice(0, 10), 6, y + TRACK_H / 2);

            // Color swatch
            ctx.fillStyle = fig.color;
            ctx.fillRect(68, y + TRACK_H / 2 - 4, 8, 8);

            // Keyframe diamonds
            drawKeyframes(fig, y, W);
        }

        // Track separator lines
        for (var j = 0; j <= figures.length; j++) {
            var sy = trackY + j * TRACK_H;
            ctx.strokeStyle = '#231d1a';
            ctx.beginPath(); ctx.moveTo(80, sy); ctx.lineTo(W, sy); ctx.stroke();
        }

        // Scrubber line
        var scrubX = timeToX(currentTime);
        if (scrubX >= 80 && scrubX <= W) {
            ctx.strokeStyle = '#d94545';
            ctx.lineWidth = SCRUBBER_W;
            ctx.beginPath();
            ctx.moveTo(scrubX, 0);
            ctx.lineTo(scrubX, H);
            ctx.stroke();

            // Scrubber head
            ctx.fillStyle = '#d94545';
            ctx.beginPath();
            ctx.moveTo(scrubX - 6, 0);
            ctx.lineTo(scrubX + 6, 0);
            ctx.lineTo(scrubX, 8);
            ctx.closePath();
            ctx.fill();
        }

        // Time readout
        ctx.fillStyle = '#c4b8b0';
        ctx.font = '11px "IBM Plex Mono", monospace';
        ctx.textBaseline = 'top';
        ctx.fillText(formatTime(currentTime), 4, 4);
    }

    function drawRuler(W) {
        ctx.fillStyle = '#1a1513';
        ctx.fillRect(80, 0, W - 80, RULER_H);

        var duration = Math.max(AE.getAnimationDuration(animation), 5);
        var step = 0.5;
        if (pixelsPerSecond < 60) step = 1;
        if (pixelsPerSecond > 200) step = 0.25;

        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.textBaseline = 'bottom';

        for (var t = 0; t <= duration + 1; t += step) {
            var x = timeToX(t);
            if (x < 80 || x > W) continue;

            var isMajor = Math.abs(t - Math.round(t)) < 0.01;
            ctx.strokeStyle = isMajor ? '#5a4d48' : '#2d2522';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, isMajor ? RULER_H - 14 : RULER_H - 8);
            ctx.lineTo(x, RULER_H);
            ctx.stroke();

            if (isMajor) {
                ctx.fillStyle = '#8a7a72';
                ctx.fillText(t.toFixed(0) + 's', x + 2, RULER_H - 2);
            }
        }
    }

    function drawKeyframes(fig, trackY, W) {
        var kfs = animation.keyframes;
        for (var i = 0; i < kfs.length; i++) {
            var kf = kfs[i];
            if (!kf.figureStates[fig._animId]) continue;

            var x = timeToX(kf.time);
            if (x < 70 || x > W + 10) continue;

            var y = trackY + TRACK_H / 2;
            var isSelected = selectedKeyframeId === kf.id;

            // Duration bar
            if (kf.duration > 0) {
                var endX = timeToX(kf.time + kf.duration);
                ctx.fillStyle = isSelected ? 'rgba(217, 69, 69, 0.2)' : 'rgba(139, 30, 30, 0.15)';
                ctx.fillRect(x, trackY + 3, endX - x, TRACK_H - 6);
            }

            // Diamond marker
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.PI / 4);
            ctx.fillStyle = isSelected ? '#d94545' : '#8b1e1e';
            ctx.fillRect(-KF_SIZE / 2, -KF_SIZE / 2, KF_SIZE, KF_SIZE);
            if (isSelected) {
                ctx.strokeStyle = '#d94545';
                ctx.lineWidth = 1;
                ctx.strokeRect(-KF_SIZE / 2 - 2, -KF_SIZE / 2 - 2, KF_SIZE + 4, KF_SIZE + 4);
            }
            ctx.restore();
        }
    }

    function formatTime(t) {
        var mins = Math.floor(t / 60);
        var secs = t % 60;
        return mins + ':' + (secs < 10 ? '0' : '') + secs.toFixed(1);
    }

    // ── Playback ─────────────────────────────────────────────────────
    function play() {
        if (playbackState === 'playing') return;
        playbackState = 'playing';
        lastFrameTime = performance.now();
        tick();
        onPlaybackChange(playbackState);
    }

    function pause() {
        playbackState = 'paused';
        if (animFrameId) cancelAnimationFrame(animFrameId);
        animFrameId = null;
        onPlaybackChange(playbackState);
    }

    function stop() {
        playbackState = 'stopped';
        if (animFrameId) cancelAnimationFrame(animFrameId);
        animFrameId = null;
        currentTime = 0;
        onTimeChange(currentTime);
        onPlaybackChange(playbackState);
        render();
    }

    function togglePlay() {
        if (playbackState === 'playing') pause();
        else play();
    }

    function tick() {
        if (playbackState !== 'playing') return;

        var now = performance.now();
        var dt = (now - lastFrameTime) / 1000;
        lastFrameTime = now;

        currentTime += dt * playbackSpeed;
        var duration = AE.getAnimationDuration(animation);

        if (currentTime > duration) {
            if (loopEnabled) {
                currentTime = 0;
            } else {
                currentTime = duration;
                pause();
                return;
            }
        }

        onTimeChange(currentTime);
        render();
        animFrameId = requestAnimationFrame(tick);
    }

    function setTime(t) {
        currentTime = Math.max(0, t);
        onTimeChange(currentTime);
        render();
    }

    function stepForward() {
        var kfs = animation.keyframes.slice().sort(function(a, b) { return a.time - b.time; });
        for (var i = 0; i < kfs.length; i++) {
            if (kfs[i].time > currentTime + 0.01) {
                setTime(kfs[i].time);
                return;
            }
        }
    }

    function stepBackward() {
        var kfs = animation.keyframes.slice().sort(function(a, b) { return a.time - b.time; });
        for (var i = kfs.length - 1; i >= 0; i--) {
            if (kfs[i].time < currentTime - 0.01) {
                setTime(kfs[i].time);
                return;
            }
        }
        setTime(0);
    }

    // ── Events ───────────────────────────────────────────────────────
    function bindEvents() {
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseup', onMouseUp);
        canvas.addEventListener('wheel', onWheel, { passive: false });
    }

    function onMouseDown(e) {
        var rect = canvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;
        var my = e.clientY - rect.top;

        // Hit test keyframe diamonds
        var kf = hitTestKeyframe(mx, my);
        if (kf) {
            selectedKeyframeId = kf.id;
            dragging = { type: 'keyframe', kfId: kf.id, startX: mx, startTime: kf.time };
            onKeyframeSelect(kf);
            render();
            return;
        }

        // Click on ruler or track area → move scrubber
        if (mx > 80) {
            var t = xToTime(mx);
            setTime(t);
            dragging = { type: 'scrubber' };
        }
    }

    function onMouseMove(e) {
        if (!dragging) return;
        var rect = canvas.getBoundingClientRect();
        var mx = e.clientX - rect.left;

        if (dragging.type === 'scrubber') {
            setTime(xToTime(mx));
        } else if (dragging.type === 'keyframe') {
            var kf = findKeyframe(dragging.kfId);
            if (kf) {
                kf.time = Math.max(0, Math.round(xToTime(mx) * 20) / 20);  // snap to 0.05s
                render();
            }
        }
    }

    function onMouseUp() {
        dragging = null;
    }

    function onWheel(e) {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
            // Zoom
            pixelsPerSecond = Math.max(40, Math.min(400, pixelsPerSecond - e.deltaY * 0.5));
        } else {
            // Scroll
            scrollX = Math.max(0, scrollX + e.deltaX + e.deltaY);
        }
        render();
    }

    function hitTestKeyframe(mx, my) {
        var kfs = animation.keyframes;
        for (var fi = 0; fi < figures.length; fi++) {
            var fig = figures[fi];
            var trackY = RULER_H + fi * TRACK_H;
            var cy = trackY + TRACK_H / 2;

            for (var i = 0; i < kfs.length; i++) {
                var kf = kfs[i];
                if (!kf.figureStates[fig._animId]) continue;
                var kx = timeToX(kf.time);
                if (Math.abs(mx - kx) < KF_SIZE + 2 && Math.abs(my - cy) < KF_SIZE + 2) {
                    return kf;
                }
            }
        }
        return null;
    }

    function findKeyframe(id) {
        for (var i = 0; i < animation.keyframes.length; i++) {
            if (animation.keyframes[i].id === id) return animation.keyframes[i];
        }
        return null;
    }

    // ── Public API ───────────────────────────────────────────────────
    window.Timeline = {
        init: init,
        resize: resize,
        render: render,
        setAnimation: setAnimation,
        setFigures: setFigures,
        setTime: setTime,
        getTime: function() { return currentTime; },

        play: play,
        pause: pause,
        stop: stop,
        togglePlay: togglePlay,
        stepForward: stepForward,
        stepBackward: stepBackward,
        isPlaying: function() { return playbackState === 'playing'; },
        getPlaybackState: function() { return playbackState; },

        setSpeed: function(s) { playbackSpeed = s; },
        getSpeed: function() { return playbackSpeed; },
        setLoop: function(v) { loopEnabled = v; },
        getLoop: function() { return loopEnabled; },
        setOnion: function(v) { onionEnabled = v; },
        getOnion: function() { return onionEnabled; },

        getSelectedKeyframeId: function() { return selectedKeyframeId; },
        setSelectedKeyframeId: function(id) { selectedKeyframeId = id; render(); },
        findKeyframe: findKeyframe
    };
})();
