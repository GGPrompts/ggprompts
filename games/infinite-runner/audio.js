/**
 * audio.js — Web Audio sound effects for Infinite Runner
 * Synthesized SFX: jump, double-jump, slide, coin, gem, death, milestone
 */
'use strict';

const SFX = (() => {
    let ctx = null;
    let muted = false;

    function init() {
        if (ctx) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    function resume() {
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    function play(type) {
        if (!ctx || muted) return;
        const now = ctx.currentTime;

        switch (type) {
            case 'jump': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            }
            case 'doubleJump': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;
            }
            case 'slide': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;
            }
            case 'coin': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.setValueAtTime(1108, now + 0.06);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;
            }
            case 'gem': {
                // Sparkly arpeggio
                [880, 1108, 1318, 1568].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.04);
                    gain.gain.setValueAtTime(0.08, now + i * 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.15);
                    osc.start(now + i * 0.04);
                    osc.stop(now + i * 0.04 + 0.15);
                });
                break;
            }
            case 'death': {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(60, now + 0.5);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
                osc.start(now);
                osc.stop(now + 0.6);
                break;
            }
            case 'milestone': {
                // Celebratory fanfare
                [523, 659, 784, 1047].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(freq, now + i * 0.08);
                    gain.gain.setValueAtTime(0.1, now + i * 0.08);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);
                    osc.start(now + i * 0.08);
                    osc.stop(now + i * 0.08 + 0.25);
                });
                break;
            }
        }
    }

    function toggleMute() {
        muted = !muted;
        return muted;
    }

    function isMuted() {
        return muted;
    }

    return { init, resume, play, toggleMute, isMuted };
})();
