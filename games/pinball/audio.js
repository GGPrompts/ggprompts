// Pinball Audio Engine
// Web Audio synthesis for all pinball sound effects
(function() {
    'use strict';

    var ctx = null;

    function init() {
        if (ctx) return;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {}
    }

    function ensure() {
        try {
            if (!ctx) init();
            if (ctx && ctx.state === 'suspended') ctx.resume();
        } catch(e) {}
        return ctx;
    }

    function osc(freq, type, start, dur, gain) {
        if (!ctx) return;
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, start);
        g.gain.setValueAtTime(gain, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(start);
        o.stop(start + dur);
    }

    function noise(start, dur, gain) {
        if (!ctx) return;
        var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
        var src = ctx.createBufferSource();
        var g = ctx.createGain();
        src.buffer = buf;
        g.gain.setValueAtTime(gain, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        src.connect(g);
        g.connect(ctx.destination);
        src.start(start);
        src.stop(start + dur);
    }

    var sounds = {
        bumper: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(800 + Math.random() * 400, 'square', t, 0.06, 0.12);
            osc(1200 + Math.random() * 300, 'sine', t, 0.1, 0.08);
            osc(400, 'triangle', t + 0.02, 0.05, 0.06);
        },

        flipper: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            noise(t, 0.04, 0.08);
            osc(300, 'square', t, 0.03, 0.05);
            osc(200, 'triangle', t + 0.01, 0.02, 0.04);
        },

        plunger: function(power) {
            if (!ensure()) return;
            var t = ctx.currentTime;
            var freq = 100 + power * 300;
            osc(freq, 'sawtooth', t, 0.15, 0.06);
            osc(freq * 1.5, 'square', t + 0.02, 0.08, 0.04);
            noise(t, 0.1, 0.05);
        },

        dropTarget: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(600, 'square', t, 0.05, 0.08);
            osc(400, 'sine', t + 0.03, 0.08, 0.06);
            noise(t, 0.06, 0.06);
        },

        rollover: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(1800, 'sine', t, 0.08, 0.05);
            osc(2200, 'sine', t + 0.04, 0.06, 0.04);
        },

        spinner: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(1400 + Math.random() * 400, 'sine', t, 0.03, 0.03);
        },

        slingshot: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(500, 'square', t, 0.05, 0.1);
            osc(700, 'sine', t + 0.02, 0.06, 0.08);
        },

        drain: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(300, 'sine', t, 0.3, 0.08);
            osc(200, 'sine', t + 0.15, 0.3, 0.06);
            osc(120, 'sine', t + 0.3, 0.4, 0.05);
        },

        ballSave: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(600, 'sine', t, 0.15, 0.07);
            osc(800, 'sine', t + 0.1, 0.15, 0.07);
            osc(1000, 'sine', t + 0.2, 0.2, 0.08);
        },

        bonus: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            var notes = [523, 659, 784, 1047];
            for (var i = 0; i < notes.length; i++) {
                osc(notes[i], 'sine', t + i * 0.1, 0.2, 0.08);
                osc(notes[i] * 1.5, 'triangle', t + i * 0.1, 0.15, 0.03);
            }
        },

        combo: function(level) {
            if (!ensure()) return;
            var t = ctx.currentTime;
            var base = 500 + level * 100;
            osc(base, 'sine', t, 0.1, 0.06);
            osc(base * 1.25, 'sine', t + 0.06, 0.1, 0.06);
            osc(base * 1.5, 'sine', t + 0.12, 0.15, 0.08);
        },

        tilt: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            noise(t, 0.5, 0.15);
            osc(80, 'sawtooth', t, 0.5, 0.1);
        },

        gameOver: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            osc(400, 'sine', t, 0.3, 0.08);
            osc(300, 'sine', t + 0.25, 0.3, 0.08);
            osc(200, 'sine', t + 0.5, 0.5, 0.06);
            osc(150, 'sine', t + 0.8, 0.6, 0.05);
        },

        multiball: function() {
            if (!ensure()) return;
            var t = ctx.currentTime;
            for (var i = 0; i < 6; i++) {
                osc(400 + i * 200, 'square', t + i * 0.08, 0.15, 0.06);
                osc(400 + i * 200, 'sine', t + i * 0.08, 0.2, 0.04);
            }
        }
    };

    function play(name, arg) {
        if (sounds[name]) {
            try { sounds[name](arg); } catch(e) {}
        }
    }

    window.PinballAudio = {
        init: init,
        play: play
    };
})();
