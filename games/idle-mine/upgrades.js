/* upgrades.js — Upgrade and worker definitions for Idle Mine */
'use strict';

(function(G) {

    /* ─── Upgrade Definitions ─── */
    G.upgradeData = {
        pickaxe: {
            name: 'Pickaxe',
            desc: 'Sharper picks. +1 gold per click.',
            icon: '\u26CF',
            baseCost: 10,
            costScale: 1.15,
            type: 'click'
        },
        mineCart: {
            name: 'Mine Cart',
            desc: 'Automated hauling. +4 gold/sec.',
            icon: '\uD83D\uDED2',
            baseCost: 100,
            costScale: 1.18,
            type: 'auto'
        },
        dynamite: {
            name: 'Dynamite',
            desc: 'Blast through rock. +8 gold per click.',
            icon: '\uD83E\uDDE8',
            baseCost: 500,
            costScale: 1.22,
            type: 'click'
        },
        drillMachine: {
            name: 'Drill Machine',
            desc: 'Mechanical boring. +25 gold/sec.',
            icon: '\u2699\uFE0F',
            baseCost: 2500,
            costScale: 1.25,
            type: 'auto'
        },
        excavator: {
            name: 'Excavator',
            desc: 'Industrial extraction. +150 gold/sec.',
            icon: '\uD83D\uDE9C',
            baseCost: 15000,
            costScale: 1.3,
            type: 'auto'
        }
    };

    /* ─── Worker definition ─── */
    G.workerData = {
        name: 'Miner',
        desc: 'A loyal worker. +0.5 gold/sec.',
        icon: '\u26CF',
        baseCost: 15,
        costScale: 1.12
    };

    /* ─── Cost calculation ─── */
    G.getUpgradeCost = function(key) {
        var data = G.upgradeData[key];
        var count = G.state.upgrades[key];
        return Math.floor(data.baseCost * Math.pow(data.costScale, count));
    };

    G.getWorkerCost = function() {
        var w = G.workerData;
        return Math.floor(w.baseCost * Math.pow(w.costScale, G.state.workers));
    };

    /* ─── Purchase ─── */
    G.buyUpgrade = function(key) {
        var cost = G.getUpgradeCost(key);
        if (G.state.gold >= cost) {
            G.state.gold -= cost;
            G.state.upgrades[key]++;
            G.checkAchievements();
            return true;
        }
        return false;
    };

    G.buyWorker = function() {
        var cost = G.getWorkerCost();
        if (G.state.gold >= cost) {
            G.state.gold -= cost;
            G.state.workers++;
            G.checkAchievements();
            return true;
        }
        return false;
    };

    /* Buy max of a given upgrade */
    G.buyMaxUpgrade = function(key) {
        var bought = 0;
        while (G.buyUpgrade(key)) bought++;
        return bought;
    };

    G.buyMaxWorkers = function() {
        var bought = 0;
        while (G.buyWorker()) bought++;
        return bought;
    };

})(window.IdleMine);
