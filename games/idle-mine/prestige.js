/* prestige.js — Prestige (Cave-In) system and achievements for Idle Mine */
'use strict';

(function(G) {

    /* ─── Prestige: "Cave In" ─── */

    // Star Dust earned from a cave-in, based on total gold this run
    G.getPrestigeReward = function() {
        var total = G.state.totalGold;
        if (total < 10000) return 0;
        return Math.floor(Math.sqrt(total / 10000));
    };

    G.getPrestigeMultiplier = function(starDust) {
        // Each star dust = +5% multiplier
        return 1 + (starDust * 0.05);
    };

    G.canPrestige = function() {
        return G.getPrestigeReward() > 0;
    };

    G.doPrestige = function() {
        var reward = G.getPrestigeReward();
        if (reward <= 0) return false;

        var s = G.state;
        var kept = {
            prestigeCount: s.prestigeCount + 1,
            starDust: s.starDust + reward,
            totalGoldAllTime: s.totalGoldAllTime,
            achievements: Object.assign({}, s.achievements),
            startedAt: s.startedAt
        };

        // Reset to defaults
        var fresh = G.defaultState();
        fresh.prestigeCount = kept.prestigeCount;
        fresh.starDust = kept.starDust;
        fresh.prestigeMultiplier = G.getPrestigeMultiplier(kept.starDust);
        fresh.totalGoldAllTime = kept.totalGoldAllTime;
        fresh.achievements = kept.achievements;
        fresh.startedAt = kept.startedAt;
        fresh.lastTick = Date.now();

        G.state = fresh;
        return { reward: reward, totalStarDust: kept.starDust, multiplier: fresh.prestigeMultiplier };
    };

    /* ─── Achievements ─── */
    G.achievementDefs = [
        // Click milestones
        { id: 'click-100', name: 'Novice Miner', desc: 'Click 100 times', icon: '\u26CF', check: function(s) { return s.clickCount >= 100; }, bonus: '+10% click power' },
        { id: 'click-1000', name: 'Seasoned Miner', desc: 'Click 1,000 times', icon: '\u26CF', check: function(s) { return s.clickCount >= 1000; }, bonus: '+15% click power' },
        { id: 'click-10000', name: 'Master Miner', desc: 'Click 10,000 times', icon: '\u26CF', check: function(s) { return s.clickCount >= 10000; }, bonus: '+20% click power' },

        // Gold milestones
        { id: 'gold-1k', name: 'First Nugget', desc: 'Earn 1,000 gold total', icon: '\uD83E\uDE99', check: function(s) { return s.totalGoldAllTime >= 1000; } },
        { id: 'gold-100k', name: 'Gold Vein', desc: 'Earn 100,000 gold total', icon: '\uD83E\uDE99', check: function(s) { return s.totalGoldAllTime >= 100000; } },
        { id: 'gold-1m', name: 'Motherlode', desc: 'Earn 1,000,000 gold total', icon: '\uD83E\uDE99', check: function(s) { return s.totalGoldAllTime >= 1000000; }, bonus: '+10% gold/sec' },
        { id: 'gold-1b', name: 'El Dorado', desc: 'Earn 1,000,000,000 gold total', icon: '\uD83E\uDE99', check: function(s) { return s.totalGoldAllTime >= 1000000000; }, bonus: '+15% gold/sec' },

        // Upgrade milestones
        { id: 'pickaxe-10', name: 'Sharp Edge', desc: 'Own 10 Pickaxes', icon: '\u26CF', check: function(s) { return s.upgrades.pickaxe >= 10; } },
        { id: 'dynamite-5', name: 'Demolitions Expert', desc: 'Own 5 Dynamite', icon: '\uD83E\uDDE8', check: function(s) { return s.upgrades.dynamite >= 5; } },
        { id: 'excavator-1', name: 'Heavy Machinery', desc: 'Buy first Excavator', icon: '\uD83D\uDE9C', check: function(s) { return s.upgrades.excavator >= 1; } },
        { id: 'workers-25', name: 'Foreman', desc: 'Hire 25 Workers', icon: '\uD83D\uDC77', check: function(s) { return s.workers >= 25; } },
        { id: 'workers-100', name: 'Mine Baron', desc: 'Hire 100 Workers', icon: '\uD83D\uDC77', check: function(s) { return s.workers >= 100; } },

        // Prestige milestones
        { id: 'prestige-1', name: 'Cave In!', desc: 'Prestige for the first time', icon: '\uD83C\uDF1F', check: function(s) { return s.prestigeCount >= 1; } },
        { id: 'prestige-5', name: 'Deep Delver', desc: 'Prestige 5 times', icon: '\uD83C\uDF1F', check: function(s) { return s.prestigeCount >= 5; } },
        { id: 'prestige-10', name: 'Eternal Miner', desc: 'Prestige 10 times', icon: '\uD83C\uDF1F', check: function(s) { return s.prestigeCount >= 10; } }
    ];

    G.checkAchievements = function() {
        var newUnlocks = [];
        G.achievementDefs.forEach(function(a) {
            if (!G.state.achievements[a.id] && a.check(G.state)) {
                G.state.achievements[a.id] = Date.now();
                newUnlocks.push(a);
            }
        });
        return newUnlocks;
    };

})(window.IdleMine);
