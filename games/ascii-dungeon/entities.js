/* entities.js — Player, enemies, and AI behaviors */
'use strict';

window.Entities = (function () {
    const DG = window.DungeonGen;

    // Enemy templates — 8 types with different AI
    const ENEMY_TYPES = [
        { name: 'Rat',           glyph: 'r', color: '#8a7050', hp: 4,  atk: 1, def: 0, xp: 2,  ai: 'wander',  speed: 1, tier: 0 },
        { name: 'Goblin',        glyph: 'g', color: '#4a4',    hp: 8,  atk: 2, def: 1, xp: 5,  ai: 'chase',   speed: 1, tier: 1 },
        { name: 'Skeleton',      glyph: 's', color: '#ddd',    hp: 12, atk: 3, def: 2, xp: 8,  ai: 'patrol',  speed: 1, tier: 2 },
        { name: 'Orc',           glyph: 'o', color: '#6a4',    hp: 18, atk: 4, def: 2, xp: 12, ai: 'chase',   speed: 1, tier: 3 },
        { name: 'Dark Mage',     glyph: 'M', color: '#a0f',    hp: 14, atk: 6, def: 1, xp: 18, ai: 'ranged',  speed: 1, tier: 4, range: 5 },
        { name: 'Troll',         glyph: 'T', color: '#484',    hp: 30, atk: 5, def: 3, xp: 20, ai: 'chase',   speed: 2, tier: 5 },
        { name: 'Wraith',        glyph: 'W', color: '#88f',    hp: 20, atk: 7, def: 2, xp: 25, ai: 'chase',   speed: 1, tier: 6 },
        { name: 'Dragon',        glyph: 'D', color: '#f44',    hp: 50, atk: 10, def: 5, xp: 50, ai: 'ranged', speed: 2, tier: 8, range: 6 },
    ];

    function createPlayer() {
        return {
            x: 0, y: 0,
            glyph: '@', color: '#0f0',
            hp: 30, maxHp: 30,
            atk: 2, def: 0,
            bonusAtk: 0,
            level: 1, xp: 0, xpNext: 15,
            gold: 0,
            inventory: [],
            equipped: { weapon: null, armor: null },
            speedTurns: 0,
            invisTurns: 0,
            dungeon: 1,
            turns: 0,
            kills: 0,
        };
    }

    function playerTotalAtk(player) {
        let a = player.atk + player.bonusAtk;
        if (player.equipped.weapon) a += player.equipped.weapon.atk;
        return a;
    }

    function playerTotalDef(player) {
        let d = player.def;
        if (player.equipped.armor) d += player.equipped.armor.def;
        return d;
    }

    function checkLevelUp(player, log) {
        while (player.xp >= player.xpNext) {
            player.xp -= player.xpNext;
            player.level++;
            player.xpNext = Math.floor(player.xpNext * 1.5);
            const hpGain = 5 + Math.floor(Math.random() * 4);
            player.maxHp += hpGain;
            player.hp = player.maxHp;
            player.atk += 1;
            log.push(`LEVEL UP! You are now level ${player.level}. +${hpGain} max HP, +1 ATK.`);
        }
    }

    function spawnEnemies(dungeon, level) {
        const enemies = [];
        const count = 4 + Math.floor(level * 1.5) + Math.floor(Math.random() * 3);
        const eligible = ENEMY_TYPES.filter(e => e.tier <= level + 1);

        for (let i = 0; i < count; i++) {
            // Weight toward current level enemies
            const weights = eligible.map(e => Math.max(1, 5 - Math.abs(e.tier - level)));
            const total = weights.reduce((a, b) => a + b, 0);
            let r = Math.random() * total;
            let template = eligible[0];
            for (let j = 0; j < eligible.length; j++) {
                r -= weights[j];
                if (r <= 0) { template = eligible[j]; break; }
            }

            // Find a spot in a random room (skip first room = player start)
            const roomIdx = 1 + Math.floor(Math.random() * (dungeon.rooms.length - 1));
            const room = dungeon.rooms[roomIdx];
            const ex = room.x + Math.floor(Math.random() * room.w);
            const ey = room.y + Math.floor(Math.random() * room.h);

            // Scale stats slightly with level
            const scale = 1 + (level - template.tier) * 0.15;
            enemies.push({
                ...template,
                id: crypto.randomUUID(),
                x: ex, y: ey,
                hp: Math.floor(template.hp * scale),
                maxHp: Math.floor(template.hp * scale),
                atk: Math.floor(template.atk * scale),
                def: template.def,
                patrolDir: Math.floor(Math.random() * 4),
                patrolSteps: 0,
                awake: false,
                turnCooldown: 0,
            });
        }
        return enemies;
    }

    function moveEnemy(enemy, player, dungeon, enemies) {
        // Slow enemies skip turns
        if (enemy.speed > 1) {
            enemy.turnCooldown = (enemy.turnCooldown || 0) + 1;
            if (enemy.turnCooldown % enemy.speed !== 0) return null;
        }

        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const dist = Math.abs(dx) + Math.abs(dy);

        // Wake up if player is close
        if (dist <= 8) enemy.awake = true;
        // Invisible player: enemies lose track
        if (player.invisTurns > 0 && dist > 2) { enemy.awake = false; }
        if (!enemy.awake) return null;

        // Ranged AI: attack from distance
        if (enemy.ai === 'ranged' && dist <= (enemy.range || 5) && dist > 1) {
            if (hasLineOfSight(enemy.x, enemy.y, player.x, player.y, dungeon)) {
                const dmg = Math.max(1, enemy.atk - playerTotalDef(player) + Math.floor(Math.random() * 3));
                player.hp -= dmg;
                return `${enemy.name} hurls a bolt at you for ${dmg} damage!`;
            }
        }

        // Adjacent: melee attack
        if (dist === 1) {
            const dmg = Math.max(1, enemy.atk - playerTotalDef(player) + Math.floor(Math.random() * 3) - 1);
            player.hp -= dmg;
            return `${enemy.name} hits you for ${dmg} damage!`;
        }

        // Movement AI
        let nx = enemy.x, ny = enemy.y;
        if (enemy.ai === 'wander') {
            const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
            if (dist <= 5) {
                // Chase when close
                nx += Math.sign(dx);
                ny += Math.sign(dy);
            } else {
                const d = dirs[Math.floor(Math.random() * 4)];
                nx += d[0]; ny += d[1];
            }
        } else if (enemy.ai === 'chase' || enemy.ai === 'ranged') {
            // Simple chase: move toward player
            if (Math.abs(dx) >= Math.abs(dy)) {
                nx += Math.sign(dx);
            } else {
                ny += Math.sign(dy);
            }
        } else if (enemy.ai === 'patrol') {
            const dirs = [[0,-1],[1,0],[0,1],[-1,0]];
            enemy.patrolSteps++;
            if (dist <= 5) {
                // Chase when close
                if (Math.abs(dx) >= Math.abs(dy)) nx += Math.sign(dx);
                else ny += Math.sign(dy);
            } else {
                if (enemy.patrolSteps > 4 + Math.floor(Math.random() * 4)) {
                    enemy.patrolDir = (enemy.patrolDir + 1) % 4;
                    enemy.patrolSteps = 0;
                }
                nx += dirs[enemy.patrolDir][0];
                ny += dirs[enemy.patrolDir][1];
            }
        }

        // Check bounds, passable, and not occupied by another enemy
        if (nx >= 0 && nx < DG.WIDTH && ny >= 0 && ny < DG.HEIGHT &&
            DG.isPassable(dungeon.map[ny][nx]) &&
            !(nx === player.x && ny === player.y) &&
            !enemies.some(e => e !== enemy && e.x === nx && e.y === ny && e.hp > 0)) {
            enemy.x = nx;
            enemy.y = ny;
        } else if (enemy.ai === 'patrol') {
            enemy.patrolDir = (enemy.patrolDir + 1) % 4;
            enemy.patrolSteps = 0;
        }

        return null;
    }

    function hasLineOfSight(x0, y0, x1, y1, dungeon) {
        // Bresenham line check
        let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        let cx = x0, cy = y0;
        while (cx !== x1 || cy !== y1) {
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; cx += sx; }
            if (e2 < dx) { err += dx; cy += sy; }
            if (cx === x1 && cy === y1) break;
            if (dungeon.map[cy] && dungeon.map[cy][cx] === DG.TILE.WALL) return false;
        }
        return true;
    }

    return {
        ENEMY_TYPES, createPlayer, playerTotalAtk, playerTotalDef,
        checkLevelUp, spawnEnemies, moveEnemy, hasLineOfSight
    };
})();
