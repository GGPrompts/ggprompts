/* ui.js — Rendering, message log, HUD, inventory overlay, minimap */
'use strict';

window.UI = (function () {
    const DG = window.DungeonGen;
    const ENT = window.Entities;

    // DOM references (set in init)
    let mapEl, hudEl, logEl, invOverlay, invList, minimapCanvas, minimapCtx;
    let statsEl, floorEl;
    let minimapVisible = false;

    // Viewport: how many tiles we show
    const VP_W = 120;
    const VP_H = 45;

    function init() {
        mapEl = document.getElementById('map');
        hudEl = document.getElementById('hud');
        logEl = document.getElementById('log');
        invOverlay = document.getElementById('inv-overlay');
        invList = document.getElementById('inv-list');
        statsEl = document.getElementById('stats');
        floorEl = document.getElementById('floor-info');
        minimapCanvas = document.getElementById('minimap');
        minimapCtx = minimapCanvas.getContext('2d');
        minimapCanvas.width = DG.WIDTH * 2;
        minimapCanvas.height = DG.HEIGHT * 2;
    }

    function render(state) {
        const { dungeon, player, enemies, items, fov, explored } = state;
        const map = dungeon.map;

        // Calculate viewport offset (center on player)
        const ox = Math.max(0, Math.min(player.x - Math.floor(VP_W / 2), DG.WIDTH - VP_W));
        const oy = Math.max(0, Math.min(player.y - Math.floor(VP_H / 2), DG.HEIGHT - VP_H));

        let html = '';
        for (let vy = 0; vy < VP_H; vy++) {
            const y = oy + vy;
            if (y >= DG.HEIGHT) { html += '\n'; continue; }
            for (let vx = 0; vx < VP_W; vx++) {
                const x = ox + vx;
                if (x >= DG.WIDTH) { html += ' '; continue; }

                const visible = fov[y] && fov[y][x];
                const seen = explored[y] && explored[y][x];

                if (x === player.x && y === player.y) {
                    html += `<span class="player">@</span>`;
                    continue;
                }

                if (visible) {
                    // Check for enemy
                    const enemy = enemies.find(e => e.x === x && e.y === y && e.hp > 0);
                    if (enemy) {
                        html += `<span style="color:${enemy.color}" title="${enemy.name} HP:${enemy.hp}/${enemy.maxHp}">${enemy.glyph}</span>`;
                        continue;
                    }
                    // Check for item
                    const item = items.find(i => i.x === x && i.y === y && !i.picked);
                    if (item) {
                        html += `<span style="color:${item.color}" title="${item.name}">${item.glyph}</span>`;
                        continue;
                    }
                    // Terrain
                    const tile = map[y][x];
                    html += `<span style="color:${DG.COLOR[tile]}">${DG.GLYPH[tile]}</span>`;
                } else if (seen) {
                    // Explored but not visible: dim
                    const tile = map[y][x];
                    html += `<span class="dim">${DG.GLYPH[tile]}</span>`;
                } else {
                    html += ' ';
                }
            }
            html += '\n';
        }
        mapEl.innerHTML = html;

        // HUD
        const atkTotal = ENT.playerTotalAtk(player);
        const defTotal = ENT.playerTotalDef(player);
        const hpPct = Math.round((player.hp / player.maxHp) * 100);
        const hpColor = hpPct > 60 ? '#0f0' : hpPct > 30 ? '#ff0' : '#f44';
        const wpn = player.equipped.weapon ? player.equipped.weapon.name : 'Fists';
        const arm = player.equipped.armor ? player.equipped.armor.name : 'None';

        statsEl.innerHTML =
            `<span style="color:${hpColor}">HP: ${player.hp}/${player.maxHp}</span>` +
            ` | ATK: ${atkTotal} | DEF: ${defTotal}` +
            ` | LV: ${player.level} | XP: ${player.xp}/${player.xpNext}` +
            ` | Gold: ${player.gold}` +
            ` | Kills: ${player.kills}` +
            (player.speedTurns > 0 ? ' <span class="buff-badge buff-speed">FAST ' + player.speedTurns + 't</span>' : '') +
            (player.invisTurns > 0 ? ' <span class="buff-badge buff-invis">INVIS ' + player.invisTurns + 't</span>' : '');

        floorEl.innerHTML =
            `Floor ${player.dungeon}/10 | ${wpn} | ${arm} | Turn ${player.turns}` +
            ` | <span class="key-hint">[i]nventory [m]inimap [?]help</span>`;
    }

    function renderLog(messages) {
        // Show last 5 messages
        const recent = messages.slice(-5);
        logEl.innerHTML = recent.map((msg, i) => {
            const opacity = 0.4 + (i / recent.length) * 0.6;
            let color = '#0f0';
            if (msg.includes('damage') || msg.includes('hits') || msg.includes('hurls')) color = '#f44';
            if (msg.includes('LEVEL UP') || msg.includes('picked up') || msg.includes('gold')) color = '#ff0';
            if (msg.includes('Healed') || msg.includes('Equipped')) color = '#4f4';
            if (msg.includes('die') || msg.includes('killed') || msg.includes('defeated')) color = '#fa0';
            if (msg.includes('descend') || msg.includes('floor')) color = '#0ff';
            return `<span style="color:${color};opacity:${opacity.toFixed(2)}">${msg}</span>`;
        }).join('\n');
    }

    function showInventory(player, onUse, onDrop) {
        invOverlay.classList.add('visible');
        let html = '<div class="inv-header">INVENTORY (use/equip | d: drop | Esc: close)</div>';

        if (player.equipped.weapon) {
            html += `<div class="inv-item equipped"><span style="color:${player.equipped.weapon.color}">${player.equipped.weapon.glyph}</span> ${player.equipped.weapon.name} [equipped] ATK +${player.equipped.weapon.atk}</div>`;
        }
        if (player.equipped.armor) {
            html += `<div class="inv-item equipped"><span style="color:${player.equipped.armor.color}">${player.equipped.armor.glyph}</span> ${player.equipped.armor.name} [equipped] DEF +${player.equipped.armor.def}</div>`;
        }

        if (player.inventory.length === 0) {
            html += '<div class="inv-empty">Your pack is empty.</div>';
        } else {
            player.inventory.forEach((item, idx) => {
                const key = idx < 26 ? String.fromCharCode(97 + idx) : '?';
                let desc = item.name;
                if (item.atk) desc += ` (ATK +${item.atk})`;
                if (item.def) desc += ` (DEF +${item.def})`;
                if (item.value && item.name === 'Gold') desc += ` (${item.value}g)`;
                html += `<div class="inv-item" data-idx="${idx}"><span class="inv-key">${key}</span> <span style="color:${item.color}">${item.glyph}</span> ${desc}</div>`;
            });
        }

        invList.innerHTML = html;

        // Bind clicks
        invList.querySelectorAll('.inv-item[data-idx]').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.idx);
                onUse(idx);
            });
        });
    }

    function hideInventory() {
        invOverlay.classList.remove('visible');
    }

    function isInventoryOpen() {
        return invOverlay.classList.contains('visible');
    }

    function renderMinimap(dungeon, player, explored) {
        minimapCtx.fillStyle = '#000';
        minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);

        for (let y = 0; y < DG.HEIGHT; y++) {
            for (let x = 0; x < DG.WIDTH; x++) {
                if (!explored[y] || !explored[y][x]) continue;
                const tile = dungeon.map[y][x];
                if (tile === DG.TILE.WALL) {
                    minimapCtx.fillStyle = '#333';
                } else if (tile === DG.TILE.STAIRS_DOWN) {
                    minimapCtx.fillStyle = '#0ff';
                } else if (tile === DG.TILE.STAIRS_UP) {
                    minimapCtx.fillStyle = '#08f';
                } else {
                    minimapCtx.fillStyle = '#555';
                }
                minimapCtx.fillRect(x * 2, y * 2, 2, 2);
            }
        }
        // Player blip
        minimapCtx.fillStyle = '#0f0';
        minimapCtx.fillRect(player.x * 2 - 1, player.y * 2 - 1, 4, 4);

        minimapCanvas.classList.toggle('visible', minimapVisible);
    }

    function toggleMinimap() {
        minimapVisible = !minimapVisible;
        minimapCanvas.classList.toggle('visible', minimapVisible);
    }

    function showHelp() {
        invOverlay.classList.add('visible');
        invList.innerHTML = `
<div class="inv-header">CONTROLS</div>
<div class="help-text">
  Move:  Arrow keys / WASD / hjkl (vi-keys)
  Wait:  . or 5 or Space
  Pick up item: g or , (walk over + press)
  Use stairs: > (down) or < (up)
  Inventory: i
  Minimap: m
  Help: ?

  In inventory:
    a-z: use/equip item
    Click item to use
    Esc: close

  Goal: Descend 10 floors and survive!
  Permadeath: when you die, it is over.
</div>`;
    }

    function showGameOver(player) {
        invOverlay.classList.add('visible');
        const score = player.gold + player.kills * 10 + player.dungeon * 50 + player.level * 20;
        invList.innerHTML = `
<div class="inv-header game-over">YOU HAVE PERISHED</div>
<div class="score-text">
  Floor reached: ${player.dungeon}
  Level: ${player.level}
  Kills: ${player.kills}
  Gold: ${player.gold}
  Turns survived: ${player.turns}

  <span class="final-score">FINAL SCORE: ${score}</span>

  <span class="restart-hint">Press Enter or R to restart</span>
</div>`;
        return score;
    }

    function showVictory(player) {
        invOverlay.classList.add('visible');
        const score = player.gold + player.kills * 10 + 500 + player.level * 20;
        invList.innerHTML = `
<div class="inv-header victory">YOU HAVE CONQUERED THE DUNGEON!</div>
<div class="score-text">
  Floors cleared: 10
  Level: ${player.level}
  Kills: ${player.kills}
  Gold: ${player.gold}
  Turns: ${player.turns}

  <span class="final-score">FINAL SCORE: ${score}</span>

  <span class="restart-hint">Press Enter or R to play again</span>
</div>`;
        return score;
    }

    return {
        init, render, renderLog, showInventory, hideInventory, isInventoryOpen,
        renderMinimap, toggleMinimap, showHelp, showGameOver, showVictory
    };
})();
