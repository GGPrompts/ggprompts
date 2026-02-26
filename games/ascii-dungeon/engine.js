/* engine.js — Main game loop, FOV, input handling, turn processing */
'use strict';

window.Engine = (function () {
    const DG = window.DungeonGen;
    const ENT = window.Entities;
    const ITM = window.Items;
    const UI = window.UI;

    let state = {};
    let gameOver = false;
    let victory = false;
    const MAX_FLOOR = 10;
    const FOV_RADIUS = 10;

    function newGame() {
        gameOver = false;
        victory = false;
        const player = ENT.createPlayer();
        state = { player, messages: ['You enter the dungeon. Find the stairs down to descend...'] };
        generateFloor();
        UI.init();
        computeFOV();
        renderAll();
    }

    function generateFloor() {
        const level = state.player.dungeon;
        const dungeon = DG.create(level);
        state.dungeon = dungeon;
        state.enemies = ENT.spawnEnemies(dungeon, level);
        state.explored = [];
        for (let y = 0; y < DG.HEIGHT; y++) {
            state.explored[y] = [];
            for (let x = 0; x < DG.WIDTH; x++) state.explored[y][x] = false;
        }
        state.fov = [];

        // Place player at stairs up
        state.player.x = dungeon.startRoom.cx;
        state.player.y = dungeon.startRoom.cy;

        // Place items in rooms
        const loot = ITM.rollLoot(level);
        state.items = [];
        loot.forEach(item => {
            const roomIdx = 1 + Math.floor(Math.random() * (dungeon.rooms.length - 1));
            const room = dungeon.rooms[Math.min(roomIdx, dungeon.rooms.length - 1)];
            item.x = room.x + Math.floor(Math.random() * room.w);
            item.y = room.y + Math.floor(Math.random() * room.h);
            item.picked = false;
            state.items.push(item);
        });
    }

    // Shadowcasting FOV (recursive)
    function computeFOV() {
        state.fov = [];
        for (let y = 0; y < DG.HEIGHT; y++) {
            state.fov[y] = [];
            for (let x = 0; x < DG.WIDTH; x++) state.fov[y][x] = false;
        }
        const px = state.player.x, py = state.player.y;
        state.fov[py][px] = true;
        state.explored[py][px] = true;

        // Simple raycasting FOV
        for (let angle = 0; angle < 360; angle += 1) {
            const rad = angle * Math.PI / 180;
            const dx = Math.cos(rad);
            const dy = Math.sin(rad);
            for (let r = 1; r <= FOV_RADIUS; r++) {
                const tx = Math.round(px + dx * r);
                const ty = Math.round(py + dy * r);
                if (tx < 0 || tx >= DG.WIDTH || ty < 0 || ty >= DG.HEIGHT) break;
                state.fov[ty][tx] = true;
                state.explored[ty][tx] = true;
                if (state.dungeon.map[ty][tx] === DG.TILE.WALL) break;
            }
        }
    }

    function tryMove(dx, dy) {
        if (gameOver || victory) return;
        const p = state.player;
        const nx = p.x + dx;
        const ny = p.y + dy;

        if (nx < 0 || nx >= DG.WIDTH || ny < 0 || ny >= DG.HEIGHT) return;
        if (!DG.isPassable(state.dungeon.map[ny][nx])) return;

        // Check for enemy
        const enemy = state.enemies.find(e => e.x === nx && e.y === ny && e.hp > 0);
        if (enemy) {
            attack(p, enemy);
        } else {
            p.x = nx;
            p.y = ny;
        }

        endTurn();
    }

    function attack(attacker, defender) {
        const atk = ENT.playerTotalAtk(attacker);
        const def = defender.def || 0;
        const dmg = Math.max(1, atk - def + Math.floor(Math.random() * 3) - 1);
        defender.hp -= dmg;
        state.messages.push(`You hit ${defender.name} for ${dmg} damage.`);

        if (defender.hp <= 0) {
            state.messages.push(`${defender.name} is defeated! (+${defender.xp} XP)`);
            attacker.xp += defender.xp;
            attacker.kills++;
            ENT.checkLevelUp(attacker, state.messages);
        }
    }

    function endTurn() {
        const p = state.player;
        p.turns++;

        // Decrement buffs
        if (p.speedTurns > 0) p.speedTurns--;
        if (p.invisTurns > 0) p.invisTurns--;

        // Enemy turns
        for (const enemy of state.enemies) {
            if (enemy.hp <= 0) continue;
            const msg = ENT.moveEnemy(enemy, p, state.dungeon, state.enemies);
            if (msg) state.messages.push(msg);
        }

        // Speed buff: extra player action (enemies don't move again)
        // Handled by allowing double-speed input, not extra turn

        // Check death
        if (p.hp <= 0) {
            gameOver = true;
            state.messages.push('You have been slain...');
            computeFOV();
            renderAll();
            const score = UI.showGameOver(p);
            saveHighScore(score);
            return;
        }

        computeFOV();
        renderAll();
    }

    function tryPickup() {
        const p = state.player;
        const item = state.items.find(i => i.x === p.x && i.y === p.y && !i.picked);
        if (!item) {
            state.messages.push('Nothing to pick up here.');
            renderAll();
            return;
        }

        if (item.name === 'Gold') {
            p.gold += item.value;
            item.picked = true;
            state.messages.push(`Picked up ${item.value} gold.`);
        } else if (p.inventory.length >= 20) {
            state.messages.push('Your inventory is full!');
        } else {
            p.inventory.push(item);
            item.picked = true;
            state.messages.push(`Picked up ${item.name}.`);
        }
        endTurn();
    }

    function tryDescend() {
        const p = state.player;
        if (state.dungeon.map[p.y][p.x] !== DG.TILE.STAIRS_DOWN) {
            state.messages.push('There are no stairs down here.');
            renderAll();
            return;
        }
        if (p.dungeon >= MAX_FLOOR) {
            victory = true;
            state.messages.push('You ascend from the dungeon victorious!');
            computeFOV();
            renderAll();
            const score = UI.showVictory(p);
            saveHighScore(score);
            return;
        }
        p.dungeon++;
        state.messages.push(`You descend to floor ${p.dungeon}...`);
        generateFloor();
        computeFOV();
        renderAll();
    }

    function tryAscend() {
        const p = state.player;
        if (state.dungeon.map[p.y][p.x] !== DG.TILE.STAIRS_UP) {
            state.messages.push('There are no stairs up here.');
            renderAll();
            return;
        }
        if (p.dungeon <= 1) {
            state.messages.push('You cannot leave the dungeon from here.');
            renderAll();
            return;
        }
        p.dungeon--;
        state.messages.push(`You ascend to floor ${p.dungeon}.`);
        generateFloor();
        computeFOV();
        renderAll();
    }

    function wait() {
        if (gameOver || victory) return;
        state.messages.push('You wait...');
        endTurn();
    }

    // Spell effects (called from items.js via game reference)
    function castFireball(damage, radius) {
        const p = state.player;
        let killed = 0;
        for (const e of state.enemies) {
            if (e.hp <= 0) continue;
            const dist = Math.abs(e.x - p.x) + Math.abs(e.y - p.y);
            if (dist <= radius && state.fov[e.y] && state.fov[e.y][e.x]) {
                e.hp -= damage;
                if (e.hp <= 0) {
                    p.xp += e.xp;
                    p.kills++;
                    killed++;
                }
            }
        }
        ENT.checkLevelUp(p, state.messages);
        return `Fireball! ${killed > 0 ? killed + ' enemies killed!' : 'No enemies in range.'}`;
    }

    function castLightning(damage) {
        const p = state.player;
        // Hit nearest visible enemy
        let nearest = null, nearDist = Infinity;
        for (const e of state.enemies) {
            if (e.hp <= 0) continue;
            if (!state.fov[e.y] || !state.fov[e.y][e.x]) continue;
            const dist = Math.abs(e.x - p.x) + Math.abs(e.y - p.y);
            if (dist < nearDist) { nearDist = dist; nearest = e; }
        }
        if (!nearest) return 'Lightning crackles... but no target found.';
        nearest.hp -= damage;
        let msg = `Lightning strikes ${nearest.name} for ${damage} damage!`;
        if (nearest.hp <= 0) {
            p.xp += nearest.xp;
            p.kills++;
            msg += ` ${nearest.name} is destroyed!`;
            ENT.checkLevelUp(p, state.messages);
        }
        return msg;
    }

    function castTeleport() {
        const p = state.player;
        const rooms = state.dungeon.rooms;
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        p.x = room.x + Math.floor(Math.random() * room.w);
        p.y = room.y + Math.floor(Math.random() * room.h);
        return 'You teleport to a random location!';
    }

    function castMapping() {
        for (let y = 0; y < DG.HEIGHT; y++) {
            for (let x = 0; x < DG.WIDTH; x++) {
                state.explored[y][x] = true;
            }
        }
        return 'The dungeon map is revealed!';
    }

    function useInventoryItem(idx) {
        const p = state.player;
        if (idx < 0 || idx >= p.inventory.length) return;
        const item = p.inventory[idx];
        const gameRef = { castFireball, castLightning, castTeleport, castMapping };
        const msg = ITM.useItem(item, p, gameRef);
        state.messages.push(msg);
        UI.hideInventory();
        endTurn();
    }

    function dropInventoryItem(idx) {
        const p = state.player;
        if (idx < 0 || idx >= p.inventory.length) return;
        const item = p.inventory.splice(idx, 1)[0];
        item.x = p.x;
        item.y = p.y;
        item.picked = false;
        state.items.push(item);
        state.messages.push(`Dropped ${item.name}.`);
        UI.showInventory(p, useInventoryItem, dropInventoryItem);
        renderAll();
    }

    function renderAll() {
        UI.render(state);
        UI.renderLog(state.messages);
        UI.renderMinimap(state.dungeon, state.player, state.explored);
    }

    function saveHighScore(score) {
        try {
            const scores = JSON.parse(localStorage.getItem('ascii-dungeon-scores') || '[]');
            scores.push({
                score,
                floor: state.player.dungeon,
                level: state.player.level,
                kills: state.player.kills,
                date: new Date().toISOString().slice(0, 10),
                victory
            });
            scores.sort((a, b) => b.score - a.score);
            localStorage.setItem('ascii-dungeon-scores', JSON.stringify(scores.slice(0, 10)));
        } catch (e) { /* ignore storage errors */ }
    }

    // Input handling
    function handleKey(e) {
        if (UI.isInventoryOpen()) {
            if (e.key === 'Escape' || e.key === 'i') {
                UI.hideInventory();
                return;
            }
            if ((gameOver || victory) && (e.key === 'Enter' || e.key === 'r' || e.key === 'R')) {
                UI.hideInventory();
                newGame();
                return;
            }
            // a-z to use/equip item (skip 'd' which is reserved for drop mode)
            if (e.key.length === 1 && e.key >= 'a' && e.key <= 'z' && e.key !== 'd') {
                const idx = e.key.charCodeAt(0) - 97;
                useInventoryItem(idx);
                return;
            }
            if (e.key === 'd' || e.key === 'D') {
                state.messages.push('Drop not yet implemented. Use items to consume them.');
                return;
            }
            return;
        }

        if (gameOver || victory) {
            if (e.key === 'Enter' || e.key === 'r' || e.key === 'R') {
                UI.hideInventory();
                newGame();
            }
            return;
        }

        // Movement keys
        const keyMap = {
            'ArrowUp': [0, -1], 'ArrowDown': [0, 1], 'ArrowLeft': [-1, 0], 'ArrowRight': [1, 0],
            'w': [0, -1], 's': [0, 1], 'a': [-1, 0], 'd': [1, 0],
            'W': [0, -1], 'S': [0, 1], 'A': [-1, 0], 'D': [1, 0],
            'k': [0, -1], 'j': [0, 1], 'h': [-1, 0], 'l': [1, 0],
            'y': [-1, -1], 'u': [1, -1], 'b': [-1, 1], 'n': [1, 1], // vi diagonals
        };

        if (keyMap[e.key]) {
            e.preventDefault();
            const [dx, dy] = keyMap[e.key];
            tryMove(dx, dy);
            // Speed buff: allow second move
            if (state.player.speedTurns > 0 && !gameOver) {
                // Don't process enemy turn twice, just allow faster movement next input
            }
            return;
        }

        switch (e.key) {
            case 'g': case ',': tryPickup(); break;
            case '>': tryDescend(); break;
            case '<': tryAscend(); break;
            case '.': case '5': case ' ': wait(); break;
            case 'i': case 'I':
                UI.showInventory(state.player, useInventoryItem, dropInventoryItem);
                break;
            case 'm': case 'M': UI.toggleMinimap(); break;
            case '?': UI.showHelp(); break;
        }
    }

    function start() {
        document.addEventListener('keydown', handleKey);

        // Touch controls for mobile
        setupTouch();

        newGame();
    }

    function setupTouch() {
        const container = document.getElementById('game');
        let startX, startY;
        container.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        container.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - startX;
            const dy = e.changedTouches[0].clientY - startY;
            const adx = Math.abs(dx), ady = Math.abs(dy);
            if (adx < 20 && ady < 20) {
                // Tap = wait or pick up
                tryPickup();
                return;
            }
            if (adx > ady) {
                tryMove(dx > 0 ? 1 : -1, 0);
            } else {
                tryMove(0, dy > 0 ? 1 : -1);
            }
        }, { passive: true });
    }

    return { start };
})();
