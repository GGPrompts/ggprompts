/* asteroids/audio.js -- Web Audio procedural sound effects */
'use strict';

window.AsteroidsAudio = (function () {
    let ctx = null;
    let muted = false;

    function init() {
        if (ctx) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function ensureCtx() {
        if (!ctx) init();
        if (ctx.state === 'suspended') ctx.resume();
    }

    function gain(v, t) {
        ensureCtx();
        const g = ctx.createGain();
        g.gain.setValueAtTime(v, t || ctx.currentTime);
        g.connect(ctx.destination);
        return g;
    }

    function play(name) {
        if (muted) return;
        ensureCtx();
        const t = ctx.currentTime;
        switch (name) {
            case 'shoot': {
                const osc = ctx.createOscillator();
                const g = gain(0.15, t);
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, t);
                osc.frequency.exponentialRampToValueAtTime(110, t + 0.15);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                osc.connect(g);
                osc.start(t);
                osc.stop(t + 0.15);
                break;
            }
            case 'thrust': {
                const bufSize = ctx.sampleRate * 0.08;
                const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
                const src = ctx.createBufferSource();
                src.buffer = buf;
                const filt = ctx.createBiquadFilter();
                filt.type = 'lowpass';
                filt.frequency.value = 300;
                const g = gain(0.08, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
                src.connect(filt);
                filt.connect(g);
                src.start(t);
                break;
            }
            case 'explode-large': {
                const bufSize = ctx.sampleRate * 0.5;
                const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                const filt = ctx.createBiquadFilter();
                filt.type = 'lowpass';
                filt.frequency.setValueAtTime(800, t);
                filt.frequency.exponentialRampToValueAtTime(50, t + 0.5);
                const g = gain(0.25, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                src.connect(filt);
                filt.connect(g);
                src.start(t);
                break;
            }
            case 'explode-medium': {
                const bufSize = ctx.sampleRate * 0.3;
                const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                const filt = ctx.createBiquadFilter();
                filt.type = 'lowpass';
                filt.frequency.setValueAtTime(600, t);
                filt.frequency.exponentialRampToValueAtTime(80, t + 0.3);
                const g = gain(0.18, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
                src.connect(filt);
                filt.connect(g);
                src.start(t);
                break;
            }
            case 'explode-small': {
                const bufSize = ctx.sampleRate * 0.15;
                const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                const filt = ctx.createBiquadFilter();
                filt.type = 'lowpass';
                filt.frequency.setValueAtTime(400, t);
                filt.frequency.exponentialRampToValueAtTime(100, t + 0.15);
                const g = gain(0.12, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
                src.connect(filt);
                filt.connect(g);
                src.start(t);
                break;
            }
            case 'ufo': {
                const osc = ctx.createOscillator();
                const g = gain(0.08, t);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, t);
                osc.frequency.setValueAtTime(300, t + 0.1);
                osc.frequency.setValueAtTime(200, t + 0.2);
                osc.frequency.setValueAtTime(300, t + 0.3);
                g.gain.setValueAtTime(0.08, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
                osc.connect(g);
                osc.start(t);
                osc.stop(t + 0.4);
                break;
            }
            case 'ufo-shoot': {
                const osc = ctx.createOscillator();
                const g = gain(0.1, t);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, t);
                osc.frequency.exponentialRampToValueAtTime(200, t + 0.2);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
                osc.connect(g);
                osc.start(t);
                osc.stop(t + 0.2);
                break;
            }
            case 'ship-explode': {
                const bufSize = ctx.sampleRate * 0.8;
                const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                const filt = ctx.createBiquadFilter();
                filt.type = 'lowpass';
                filt.frequency.setValueAtTime(1200, t);
                filt.frequency.exponentialRampToValueAtTime(30, t + 0.8);
                const g = gain(0.3, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
                src.connect(filt);
                filt.connect(g);
                src.start(t);
                break;
            }
            case 'extra-life': {
                const osc = ctx.createOscillator();
                const g = gain(0.12, t);
                osc.type = 'sine';
                const notes = [523, 659, 784, 1047];
                notes.forEach((f, i) => {
                    osc.frequency.setValueAtTime(f, t + i * 0.1);
                });
                g.gain.setValueAtTime(0.12, t);
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
                osc.connect(g);
                osc.start(t);
                osc.stop(t + 0.5);
                break;
            }
            case 'beat-low': {
                const osc = ctx.createOscillator();
                const g = gain(0.12, t);
                osc.type = 'triangle';
                osc.frequency.value = 55;
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                osc.connect(g);
                osc.start(t);
                osc.stop(t + 0.12);
                break;
            }
            case 'beat-high': {
                const osc = ctx.createOscillator();
                const g = gain(0.12, t);
                osc.type = 'triangle';
                osc.frequency.value = 70;
                g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
                osc.connect(g);
                osc.start(t);
                osc.stop(t + 0.12);
                break;
            }
        }
    }

    function toggleMute() {
        muted = !muted;
        return muted;
    }

    return { init, play, toggleMute, isMuted: () => muted };
})();
