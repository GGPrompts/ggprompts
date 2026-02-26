/* save.js — Save/Load system for Idle Mine (localStorage) */
'use strict';

(function(G) {

    var SAVE_KEY = 'idleMine_save_v1';
    var AUTO_SAVE_INTERVAL = 30000; // 30 seconds

    G.save = function() {
        try {
            var data = JSON.stringify(G.state);
            localStorage.setItem(SAVE_KEY, data);
            G.state.lastSave = Date.now();
            return true;
        } catch (e) {
            console.warn('IdleMine: save failed', e);
            return false;
        }
    };

    G.load = function() {
        try {
            var raw = localStorage.getItem(SAVE_KEY);
            if (!raw) return false;
            var saved = JSON.parse(raw);
            // Merge with defaults to handle new fields
            var defaults = G.defaultState();
            for (var key in defaults) {
                if (saved[key] === undefined) {
                    saved[key] = defaults[key];
                }
            }
            // Merge nested upgrades
            for (var uk in defaults.upgrades) {
                if (saved.upgrades[uk] === undefined) {
                    saved.upgrades[uk] = defaults.upgrades[uk];
                }
            }
            G.state = saved;
            return true;
        } catch (e) {
            console.warn('IdleMine: load failed', e);
            return false;
        }
    };

    G.deleteSave = function() {
        localStorage.removeItem(SAVE_KEY);
    };

    G.exportSave = function() {
        return btoa(JSON.stringify(G.state));
    };

    G.importSave = function(str) {
        try {
            var data = JSON.parse(atob(str));
            // Merge with defaults to handle missing properties
            var defaults = G.defaultState();
            for (var key in defaults) {
                if (data[key] === undefined) {
                    data[key] = defaults[key];
                }
            }
            if (!data.upgrades || typeof data.upgrades !== 'object') {
                data.upgrades = defaults.upgrades;
            }
            for (var uk in defaults.upgrades) {
                if (data.upgrades[uk] === undefined) {
                    data.upgrades[uk] = defaults.upgrades[uk];
                }
            }
            if (!data.achievements || typeof data.achievements !== 'object') {
                data.achievements = defaults.achievements;
            }
            G.state = data;
            G.save();
            return true;
        } catch (e) {
            return false;
        }
    };

    /* Auto-save timer */
    G._autoSaveId = null;
    G.startAutoSave = function() {
        if (G._autoSaveId) clearInterval(G._autoSaveId);
        G._autoSaveId = setInterval(function() {
            G.save();
            if (G.ui && G.ui.showToast) G.ui.showToast('Game saved');
        }, AUTO_SAVE_INTERVAL);
    };

})(window.IdleMine);
