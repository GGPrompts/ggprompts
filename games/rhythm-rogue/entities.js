/**
 * Rhythm Rogue — Entity System
 * Player, enemies, items, and combat.
 * Exposes RhythmEntities global.
 */
var RhythmEntities = (function () {
  'use strict';

  // ------ Items / Weapons ------
  var WEAPONS = [
    { name: 'Fists', dmg: 1, range: 1, symbol: '!' },
    { name: 'Dagger', dmg: 2, range: 1, symbol: '/' },
    { name: 'Sword', dmg: 3, range: 1, symbol: '|' },
    { name: 'Spear', dmg: 2, range: 2, symbol: '-' },
    { name: 'Axe', dmg: 4, range: 1, symbol: 'T' },
    { name: 'Bow', dmg: 2, range: 3, symbol: ')' },
    { name: 'Staff', dmg: 3, range: 2, symbol: '\\' }
  ];

  var ITEMS = [
    { name: 'Health Potion', type: 'heal', value: 3, symbol: '+', color: '#ff6688' },
    { name: 'Shield Scroll', type: 'armor', value: 1, symbol: '=', color: '#66aaff' },
    { name: 'Speed Boots', type: 'speed', value: 1, symbol: '%', color: '#ffcc44' }
  ];

  // ------ Enemy Types ------
  var ENEMY_TYPES = [
    { name: 'Slime', hp: 2, dmg: 1, pattern: 'chase', symbol: 'o', color: '#66ff66', speed: 2 },
    { name: 'Skeleton', hp: 3, dmg: 2, pattern: 'patrol', symbol: 'X', color: '#cccccc', speed: 1 },
    { name: 'Bat', hp: 1, dmg: 1, pattern: 'zigzag', symbol: 'v', color: '#cc88ff', speed: 1 },
    { name: 'Ghost', hp: 2, dmg: 2, pattern: 'wander', symbol: 'G', color: '#88ddff', speed: 2 },
    { name: 'Golem', hp: 6, dmg: 3, pattern: 'chase', symbol: 'H', color: '#cc8844', speed: 3 },
    { name: 'Wraith', hp: 3, dmg: 3, pattern: 'chase', symbol: 'W', color: '#ff44ff', speed: 1 }
  ];

  // ------ Player ------
  var player = {
    x: 0, y: 0,
    hp: 10, maxHp: 10,
    gold: 0,
    weapon: WEAPONS[0],
    armor: 0,
    combo: 0,
    maxCombo: 0,
    score: 0,
    movesMade: 0,
    beatHits: 0,
    beatMisses: 0,
    speed: 0, // extra speed (allows off-beat moves without penalty)
    alive: true
  };

  // ------ Enemies ------
  var enemies = [];
  var items = [];  // dropped items on the floor

  function resetPlayer() {
    player.x = 0;
    player.y = 0;
    player.hp = 10;
    player.maxHp = 10;
    player.gold = 0;
    player.weapon = WEAPONS[0];
    player.armor = 0;
    player.combo = 0;
    player.maxCombo = 0;
    player.score = 0;
    player.movesMade = 0;
    player.beatHits = 0;
    player.beatMisses = 0;
    player.speed = 0;
    player.alive = true;
  }

  function spawnEnemies(spawns, floor) {
    enemies = [];
    for (var i = 0; i < spawns.length; i++) {
      var s = spawns[i];
      // Pick enemy type based on floor difficulty
      var maxType = Math.min(ENEMY_TYPES.length, 2 + Math.floor(floor / 2));
      var typeIdx = Math.floor(Math.random() * maxType);
      var type = ENEMY_TYPES[typeIdx];
      enemies.push({
        x: s.x,
        y: s.y,
        hp: type.hp + Math.floor(floor / 3),
        maxHp: type.hp + Math.floor(floor / 3),
        dmg: type.dmg + Math.floor(floor / 4),
        pattern: type.pattern,
        symbol: type.symbol,
        color: type.color,
        name: type.name,
        speed: type.speed,
        beatCounter: 0,
        patrolDir: Math.floor(Math.random() * 4),
        patrolSteps: 0,
        alive: true,
        flash: 0
      });
    }
  }

  function moveEnemy(enemy, beatNum) {
    if (!enemy.alive) return;
    enemy.beatCounter++;
    // Only move every `speed` beats
    if (enemy.beatCounter % enemy.speed !== 0) return;

    var dx = 0, dy = 0;
    var dirs = [[0,-1],[1,0],[0,1],[-1,0]]; // N E S W

    switch (enemy.pattern) {
      case 'chase':
        // Simple chase toward player
        var pdx = player.x - enemy.x;
        var pdy = player.y - enemy.y;
        if (Math.abs(pdx) > Math.abs(pdy)) {
          dx = pdx > 0 ? 1 : -1;
        } else if (pdy !== 0) {
          dy = pdy > 0 ? 1 : -1;
        }
        break;

      case 'patrol':
        // Walk in a direction, turn when blocked
        var d = dirs[enemy.patrolDir];
        dx = d[0]; dy = d[1];
        enemy.patrolSteps++;
        if (enemy.patrolSteps > 4 || !RhythmDungeon.isWalkable(enemy.x + dx, enemy.y + dy)) {
          enemy.patrolDir = (enemy.patrolDir + 1 + Math.floor(Math.random() * 3)) % 4;
          enemy.patrolSteps = 0;
          d = dirs[enemy.patrolDir];
          dx = d[0]; dy = d[1];
        }
        break;

      case 'zigzag':
        // Alternate horizontal/vertical toward player
        if (beatNum % 2 === 0) {
          dx = player.x > enemy.x ? 1 : (player.x < enemy.x ? -1 : 0);
        } else {
          dy = player.y > enemy.y ? 1 : (player.y < enemy.y ? -1 : 0);
        }
        break;

      case 'wander':
        // Random movement
        var rd = dirs[Math.floor(Math.random() * 4)];
        dx = rd[0]; dy = rd[1];
        break;
    }

    var nx = enemy.x + dx;
    var ny = enemy.y + dy;

    // Check collision with player (attack instead)
    if (nx === player.x && ny === player.y) {
      damagePlayer(enemy.dmg);
      return;
    }

    // Check collision with other enemies
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i] !== enemy && enemies[i].alive && enemies[i].x === nx && enemies[i].y === ny) {
        return; // blocked
      }
    }

    if (RhythmDungeon.isWalkable(nx, ny)) {
      enemy.x = nx;
      enemy.y = ny;
    }
  }

  function moveAllEnemies(beatNum) {
    for (var i = 0; i < enemies.length; i++) {
      moveEnemy(enemies[i], beatNum);
    }
  }

  function damagePlayer(dmg) {
    var actual = Math.max(1, dmg - player.armor);
    player.hp -= actual;
    if (player.hp <= 0) {
      player.hp = 0;
      player.alive = false;
    }
    return actual;
  }

  function attackEnemy(enemy, comboMult) {
    var dmg = player.weapon.dmg * (comboMult || 1);
    enemy.hp -= dmg;
    enemy.flash = 6;
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.alive = false;
      player.score += 50 * (comboMult || 1);
      // Chance to drop item
      if (Math.random() < 0.25) {
        var item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        items.push({ x: enemy.x, y: enemy.y, item: item });
      }
      // Chance to drop weapon upgrade
      if (Math.random() < 0.15) {
        var wpnIdx = Math.min(WEAPONS.length - 1, WEAPONS.indexOf(player.weapon) + 1);
        if (wpnIdx > WEAPONS.indexOf(player.weapon)) {
          items.push({ x: enemy.x, y: enemy.y, item: { name: WEAPONS[wpnIdx].name, type: 'weapon', value: wpnIdx, symbol: WEAPONS[wpnIdx].symbol, color: '#ffdd44' } });
        }
      }
      return true; // killed
    }
    return false;
  }

  /** Try to attack at position. Returns { hit, killed, enemy } or null. */
  function tryAttack(tx, ty, comboMult) {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].alive && enemies[i].x === tx && enemies[i].y === ty) {
        var killed = attackEnemy(enemies[i], comboMult);
        return { hit: true, killed: killed, enemy: enemies[i] };
      }
    }
    return null;
  }

  /** Try to pick up items at position. Returns array of collected items. */
  function collectItems(px, py) {
    var collected = [];
    for (var i = items.length - 1; i >= 0; i--) {
      if (items[i].x === px && items[i].y === py) {
        var it = items[i].item;
        switch (it.type) {
          case 'heal':
            player.hp = Math.min(player.maxHp, player.hp + it.value);
            break;
          case 'armor':
            player.armor += it.value;
            break;
          case 'speed':
            player.speed += it.value;
            break;
          case 'weapon':
            player.weapon = WEAPONS[it.value];
            break;
        }
        collected.push(it);
        items.splice(i, 1);
      }
    }
    return collected;
  }

  /** Check if any alive enemy is adjacent (for danger indicator). */
  function getAdjacentEnemies(px, py) {
    var adj = [];
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e.alive) continue;
      var dist = Math.abs(e.x - px) + Math.abs(e.y - py);
      if (dist <= 1) adj.push(e);
    }
    return adj;
  }

  function getEnemyAt(x, y) {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].alive && enemies[i].x === x && enemies[i].y === y) {
        return enemies[i];
      }
    }
    return null;
  }

  return {
    WEAPONS: WEAPONS,
    ITEMS: ITEMS,
    ENEMY_TYPES: ENEMY_TYPES,
    player: player,
    getEnemies: function () { return enemies; },
    getItems: function () { return items; },
    resetPlayer: resetPlayer,
    spawnEnemies: spawnEnemies,
    moveAllEnemies: moveAllEnemies,
    damagePlayer: damagePlayer,
    tryAttack: tryAttack,
    collectItems: collectItems,
    getAdjacentEnemies: getAdjacentEnemies,
    getEnemyAt: getEnemyAt,
    clearItems: function () { items = []; }
  };
})();
