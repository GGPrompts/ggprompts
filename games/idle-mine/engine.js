/* engine.js — Core game state and tick loop for Idle Mine */
'use strict';

window.IdleMine = window.IdleMine || {};

(function(G) {

    /* ─── Default State ─── */
    G.defaultState = function() {
        return {
            gold: 0,
            totalGold: 0,         // lifetime gold (never resets except prestige tracking)
            totalGoldAllTime: 0,  // all-time gold across prestiges
            clickPower: 1,
            clickCount: 0,

            // Upgrades: count owned
            upgrades: {
                pickaxe: 0,
                mineCart: 0,
                dynamite: 0,
                drillMachine: 0,
                excavator: 0
            },

            // Workers
            workers: 0,

            // Prestige
            prestigeCount: 0,
            prestigeMultiplier: 1,
            starDust: 0,          // prestige currency

            // Achievements unlocked (by id)
            achievements: {},

            // Timestamps
            lastTick: Date.now(),
            lastSave: Date.now(),
            startedAt: Date.now()
        };
    };

    G.state = G.defaultState();

    /* ─── Derived values ─── */
    G.getClickPower = function() {
        var s = G.state;
        var base = 1;
        base += s.upgrades.pickaxe * 1;
        base += s.upgrades.dynamite * 8;
        base *= s.prestigeMultiplier;
        // Achievement bonuses
        if (s.achievements['click-100']) base *= 1.1;
        if (s.achievements['click-1000']) base *= 1.15;
        if (s.achievements['click-10000']) base *= 1.2;
        return Math.floor(base);
    };

    G.getGoldPerSecond = function() {
        var s = G.state;
        var gps = 0;
        gps += s.workers * 0.5;
        gps += s.upgrades.mineCart * 4;
        gps += s.upgrades.drillMachine * 25;
        gps += s.upgrades.excavator * 150;
        gps *= s.prestigeMultiplier;
        // Achievement bonuses
        if (s.achievements['gold-1m']) gps *= 1.1;
        if (s.achievements['gold-1b']) gps *= 1.15;
        return gps;
    };

    /* ─── Click ─── */
    G.doClick = function() {
        var amount = G.getClickPower();
        G.state.gold += amount;
        G.state.totalGold += amount;
        G.state.totalGoldAllTime += amount;
        G.state.clickCount++;
        G.checkAchievements();
        return amount;
    };

    /* ─── Tick (called every frame) ─── */
    G.tick = function(now) {
        var dt = (now - G.state.lastTick) / 1000;
        if (dt > 0) {
            var gps = G.getGoldPerSecond();
            var earned = gps * dt;
            G.state.gold += earned;
            G.state.totalGold += earned;
            G.state.totalGoldAllTime += earned;
        }
        G.state.lastTick = now;
    };

    /* ─── Offline progress ─── */
    G.calcOfflineProgress = function() {
        var now = Date.now();
        var elapsed = (now - G.state.lastTick) / 1000;
        // Cap at 8 hours
        elapsed = Math.min(elapsed, 8 * 3600);
        if (elapsed < 5) return null; // less than 5 seconds, skip
        var gps = G.getGoldPerSecond();
        var earned = gps * elapsed * 0.5; // 50% efficiency while offline
        G.state.gold += earned;
        G.state.totalGold += earned;
        G.state.totalGoldAllTime += earned;
        G.state.lastTick = now;
        return { elapsed: elapsed, earned: earned };
    };

    /* ─── Number formatting ─── */
    G.formatNumber = function(n) {
        if (n < 0) return '-' + G.formatNumber(-n);
        if (n < 1000) return Math.floor(n).toString();
        var suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
        var tier = Math.floor(Math.log10(n) / 3);
        if (tier >= suffixes.length) tier = suffixes.length - 1;
        var scaled = n / Math.pow(10, tier * 3);
        if (scaled >= 100) return Math.floor(scaled) + suffixes[tier];
        if (scaled >= 10) return scaled.toFixed(1) + suffixes[tier];
        return scaled.toFixed(2) + suffixes[tier];
    };

    G.formatTime = function(seconds) {
        if (seconds < 60) return Math.floor(seconds) + 's';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ' + Math.floor(seconds % 60) + 's';
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        return h + 'h ' + m + 'm';
    };

})(window.IdleMine);
