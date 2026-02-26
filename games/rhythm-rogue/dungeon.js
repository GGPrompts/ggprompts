/**
 * Rhythm Rogue — Dungeon Generator
 * Procedural dungeon with rooms, corridors, treasure, enemies, and stairs.
 * Exposes RhythmDungeon global.
 */
var RhythmDungeon = (function () {
  'use strict';

  // Tile types
  var TILE = {
    WALL: 0,
    FLOOR: 1,
    CORRIDOR: 2,
    DOOR: 3,
    STAIRS: 4
  };

  var MAP_W = 40;
  var MAP_H = 30;

  var map = [];
  var rooms = [];
  var spawnPoint = { x: 0, y: 0 };
  var stairsPoint = { x: 0, y: 0 };
  var treasures = [];
  var enemySpawns = [];
  var currentFloor = 1;

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function initMap() {
    map = [];
    for (var y = 0; y < MAP_H; y++) {
      map[y] = [];
      for (var x = 0; x < MAP_W; x++) {
        map[y][x] = TILE.WALL;
      }
    }
  }

  function carveRoom(room) {
    for (var y = room.y; y < room.y + room.h; y++) {
      for (var x = room.x; x < room.x + room.w; x++) {
        if (y >= 0 && y < MAP_H && x >= 0 && x < MAP_W) {
          map[y][x] = TILE.FLOOR;
        }
      }
    }
  }

  function roomsOverlap(a, b) {
    var pad = 2;
    return !(a.x + a.w + pad <= b.x || b.x + b.w + pad <= a.x ||
             a.y + a.h + pad <= b.y || b.y + b.h + pad <= a.y);
  }

  function centerOf(room) {
    return {
      x: Math.floor(room.x + room.w / 2),
      y: Math.floor(room.y + room.h / 2)
    };
  }

  function carveCorridor(x1, y1, x2, y2) {
    var x = x1, y = y1;
    // Horizontal first, then vertical (or vice versa randomly)
    var hFirst = Math.random() < 0.5;
    if (hFirst) {
      while (x !== x2) {
        if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
          if (map[y][x] === TILE.WALL) map[y][x] = TILE.CORRIDOR;
        }
        x += x < x2 ? 1 : -1;
      }
      while (y !== y2) {
        if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
          if (map[y][x] === TILE.WALL) map[y][x] = TILE.CORRIDOR;
        }
        y += y < y2 ? 1 : -1;
      }
    } else {
      while (y !== y2) {
        if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
          if (map[y][x] === TILE.WALL) map[y][x] = TILE.CORRIDOR;
        }
        y += y < y2 ? 1 : -1;
      }
      while (x !== x2) {
        if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
          if (map[y][x] === TILE.WALL) map[y][x] = TILE.CORRIDOR;
        }
        x += x < x2 ? 1 : -1;
      }
    }
    // Final tile
    if (x >= 0 && x < MAP_W && y >= 0 && y < MAP_H) {
      if (map[y][x] === TILE.WALL) map[y][x] = TILE.CORRIDOR;
    }
  }

  function generate(floor) {
    currentFloor = floor || 1;
    initMap();
    rooms = [];
    treasures = [];
    enemySpawns = [];

    var numRooms = rand(6, 10) + Math.min(floor, 5);
    var minSize = 4, maxSize = 8;

    var attempts = 0;
    while (rooms.length < numRooms && attempts < 200) {
      attempts++;
      var w = rand(minSize, maxSize);
      var h = rand(minSize, maxSize);
      var x = rand(1, MAP_W - w - 1);
      var y = rand(1, MAP_H - h - 1);
      var newRoom = { x: x, y: y, w: w, h: h };

      var overlaps = false;
      for (var i = 0; i < rooms.length; i++) {
        if (roomsOverlap(newRoom, rooms[i])) { overlaps = true; break; }
      }
      if (!overlaps) {
        carveRoom(newRoom);
        if (rooms.length > 0) {
          var prev = centerOf(rooms[rooms.length - 1]);
          var curr = centerOf(newRoom);
          carveCorridor(prev.x, prev.y, curr.x, curr.y);
        }
        rooms.push(newRoom);
      }
    }

    // Ensure at least 3 rooms
    if (rooms.length < 3) return generate(floor);

    // Spawn in first room
    var sc = centerOf(rooms[0]);
    spawnPoint = { x: sc.x, y: sc.y };

    // Stairs in last room
    var ec = centerOf(rooms[rooms.length - 1]);
    stairsPoint = { x: ec.x, y: ec.y };
    map[ec.y][ec.x] = TILE.STAIRS;

    // Place treasures in some rooms
    for (var ri = 1; ri < rooms.length - 1; ri++) {
      if (Math.random() < 0.5 + floor * 0.03) {
        var rc = centerOf(rooms[ri]);
        // Offset from center
        var tx = rc.x + rand(-1, 1);
        var ty = rc.y + rand(-1, 1);
        if (isWalkable(tx, ty)) {
          var val = rand(10, 30) + floor * 5;
          treasures.push({ x: tx, y: ty, gold: val, collected: false });
        }
      }
    }

    // Place enemy spawns
    var numEnemies = rand(3, 5) + Math.min(floor * 2, 12);
    for (var ei = 0; ei < numEnemies; ei++) {
      var room = rooms[rand(1, rooms.length - 1)];
      var ex = rand(room.x + 1, room.x + room.w - 2);
      var ey = rand(room.y + 1, room.y + room.h - 2);
      if (isWalkable(ex, ey) && !(ex === spawnPoint.x && ey === spawnPoint.y)) {
        enemySpawns.push({ x: ex, y: ey });
      }
    }

    return {
      map: map,
      rooms: rooms,
      spawn: spawnPoint,
      stairs: stairsPoint,
      treasures: treasures,
      enemySpawns: enemySpawns,
      floor: currentFloor,
      width: MAP_W,
      height: MAP_H
    };
  }

  function isWalkable(x, y) {
    if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return false;
    return map[y][x] !== TILE.WALL;
  }

  function getTile(x, y) {
    if (x < 0 || x >= MAP_W || y < 0 || y >= MAP_H) return TILE.WALL;
    return map[y][x];
  }

  return {
    TILE: TILE,
    MAP_W: MAP_W,
    MAP_H: MAP_H,
    generate: generate,
    isWalkable: isWalkable,
    getTile: getTile,
    getMap: function () { return map; },
    getRooms: function () { return rooms; },
    getSpawn: function () { return spawnPoint; },
    getStairs: function () { return stairsPoint; },
    getTreasures: function () { return treasures; },
    getEnemySpawns: function () { return enemySpawns; },
    getFloor: function () { return currentFloor; }
  };
})();
