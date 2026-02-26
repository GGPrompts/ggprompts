/* audio.js - Web Audio sound effects for Pac-Man
 * Exports: window.PacAudio
 */
(function () {
    'use strict';

    let ctx = null;
    let initialized = false;
    let muted = false;

    // Waka-waka alternation
    let wakaToggle = false;
    let lastWakaTime = 0;

    function init() {
        if (initialized) return;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            initialized = true;
        } catch (e) {
            console.warn('Web Audio not available');
        }
    }

    function ensureCtx() {
        if (!ctx) init();
        if (ctx && ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    function setMuted(m) { muted = m; }
    function isMuted() { return muted; }

    // Helper: create oscillator note
    function osc(type, freq, start, dur, vol, detune) {
        if (!ensureCtx() || muted) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        if (detune) o.detune.value = detune;
        g.gain.setValueAtTime(vol || 0.15, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(start);
        o.stop(start + dur + 0.01);
    }

    // Helper: noise burst
    function noise(start, dur, vol) {
        if (!ensureCtx() || muted) return;
        const bufSize = ctx.sampleRate * dur;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            data[i] = (Math.random() * 2 - 1) * vol;
        }
        const src = ctx.createBufferSource();
        const g = ctx.createGain();
        src.buffer = buf;
        g.gain.setValueAtTime(vol, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        src.connect(g);
        g.connect(ctx.destination);
        src.start(start);
    }

    function playWaka() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        // Throttle waka to avoid overlapping
        if (now - lastWakaTime < 0.08) return;
        lastWakaTime = now;

        wakaToggle = !wakaToggle;
        const baseFreq = wakaToggle ? 260 : 330;
        osc('square', baseFreq, now, 0.08, 0.1);
        osc('square', baseFreq * 0.5, now, 0.06, 0.05);
    }

    function playEatGhost() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        // Ascending sweep
        for (let i = 0; i < 8; i++) {
            osc('square', 200 + i * 100, now + i * 0.03, 0.06, 0.12);
        }
    }

    function playDeath() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        // Descending tones
        for (let i = 0; i < 12; i++) {
            const freq = 800 - i * 50;
            osc('sawtooth', freq, now + i * 0.1, 0.15, 0.1);
        }
        // Final low tone
        osc('triangle', 100, now + 1.2, 0.4, 0.12);
    }

    function playEatFruit() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        osc('square', 523, now, 0.08, 0.12);
        osc('square', 659, now + 0.08, 0.08, 0.12);
        osc('square', 784, now + 0.16, 0.12, 0.15);
    }

    function playPowerPellet() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        // Dramatic chord
        osc('square', 262, now, 0.3, 0.1);
        osc('square', 330, now, 0.3, 0.1);
        osc('square', 392, now, 0.3, 0.1);
        osc('triangle', 131, now, 0.5, 0.08);
    }

    function playLevelComplete() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        const notes = [523, 587, 659, 784, 880, 1047];
        notes.forEach((f, i) => {
            osc('square', f, now + i * 0.12, 0.15, 0.12);
        });
    }

    function playExtraLife() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        for (let i = 0; i < 3; i++) {
            osc('square', 880, now + i * 0.15, 0.1, 0.1);
            osc('square', 1175, now + i * 0.15 + 0.05, 0.1, 0.1);
        }
    }

    function playGameStart() {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        // Classic intro melody approximation
        const melody = [
            [262, 0.15], [330, 0.15], [392, 0.15], [330, 0.15],
            [262, 0.3], [196, 0.15], [262, 0.3]
        ];
        let t = now;
        melody.forEach(([f, d]) => {
            osc('square', f, t, d * 0.8, 0.12);
            t += d;
        });
    }

    // Siren/background (short call, meant to be called periodically)
    function playSiren(level) {
        if (!ensureCtx() || muted) return;
        const now = ctx.currentTime;
        const speed = 1 + level * 0.1;
        const freq = 200 + Math.sin(now * speed) * 60;
        osc('sine', freq, now, 0.2, 0.04);
    }

    window.PacAudio = {
        init, setMuted, isMuted,
        playWaka, playEatGhost, playDeath,
        playEatFruit, playPowerPellet,
        playLevelComplete, playExtraLife,
        playGameStart, playSiren,
    };
})();
