/* dungeon-gen.js — Procedural dungeon generation with rooms + corridors */
'use strict';

window.DungeonGen = (function () {
    const TILE = { WALL: 0, FLOOR: 1, CORRIDOR: 2, DOOR: 3, STAIRS_DOWN: 4, STAIRS_UP: 5 };
    const GLYPH = {
        [TILE.WALL]: '#',
        [TILE.FLOOR]: '.',
        [TILE.CORRIDOR]: '.',
        [TILE.DOOR]: '+',
        [TILE.STAIRS_DOWN]: '>',
        [TILE.STAIRS_UP]: '<'
    };
    const COLOR = {
        [TILE.WALL]: '#555',
        [TILE.FLOOR]: '#444',
        [TILE.CORRIDOR]: '#3a3a3a',
        [TILE.DOOR]: '#a86f32',
        [TILE.STAIRS_DOWN]: '#0ff',
        [TILE.STAIRS_UP]: '#0ff'
    };

    const WIDTH = 120;
    const HEIGHT = 45;

    function create(level) {
        const map = [];
        for (let y = 0; y < HEIGHT; y++) {
            map[y] = [];
            for (let x = 0; x < WIDTH; x++) {
                map[y][x] = TILE.WALL;
            }
        }

        const rooms = [];
        const minRooms = 8 + Math.floor(level * 0.6);
        const maxRooms = 14 + Math.floor(level * 1.0);
        const targetRooms = minRooms + Math.floor(Math.random() * (maxRooms - minRooms + 1));
        const attempts = targetRooms * 20;

        for (let i = 0; i < attempts && rooms.length < targetRooms; i++) {
            const w = 4 + Math.floor(Math.random() * 8);
            const h = 3 + Math.floor(Math.random() * 6);
            const x = 1 + Math.floor(Math.random() * (WIDTH - w - 2));
            const y = 1 + Math.floor(Math.random() * (HEIGHT - h - 2));
            const room = { x, y, w, h, cx: Math.floor(x + w / 2), cy: Math.floor(y + h / 2) };

            let overlap = false;
            for (const r of rooms) {
                if (x - 1 < r.x + r.w && x + w + 1 > r.x && y - 1 < r.y + r.h && y + h + 1 > r.y) {
                    overlap = true;
                    break;
                }
            }
            if (overlap) continue;

            for (let ry = y; ry < y + h; ry++) {
                for (let rx = x; rx < x + w; rx++) {
                    map[ry][rx] = TILE.FLOOR;
                }
            }
            rooms.push(room);
        }

        // Connect rooms with corridors (MST-like: connect each room to nearest unconnected)
        const connected = [0];
        const unconnected = rooms.slice(1).map((_, i) => i + 1);

        while (unconnected.length > 0) {
            let bestDist = Infinity;
            let bestC = 0, bestU = 0, bestUI = 0;
            for (const ci of connected) {
                for (let ui = 0; ui < unconnected.length; ui++) {
                    const uidx = unconnected[ui];
                    const dx = rooms[ci].cx - rooms[uidx].cx;
                    const dy = rooms[ci].cy - rooms[uidx].cy;
                    const dist = dx * dx + dy * dy;
                    if (dist < bestDist) {
                        bestDist = dist;
                        bestC = ci;
                        bestU = uidx;
                        bestUI = ui;
                    }
                }
            }
            unconnected.splice(bestUI, 1);
            connected.push(bestU);
            carveCorridor(map, rooms[bestC], rooms[bestU]);
        }

        // Add a couple extra corridors for loops
        for (let i = 0; i < Math.min(3, rooms.length - 1); i++) {
            const a = Math.floor(Math.random() * rooms.length);
            let b = Math.floor(Math.random() * rooms.length);
            if (a !== b) carveCorridor(map, rooms[a], rooms[b]);
        }

        // Place doors at room-corridor transitions
        placeDoors(map, rooms);

        // Place stairs
        const startRoom = rooms[0];
        const endRoom = rooms[rooms.length - 1];
        map[startRoom.cy][startRoom.cx] = TILE.STAIRS_UP;
        map[endRoom.cy][endRoom.cx] = TILE.STAIRS_DOWN;

        return { map, rooms, width: WIDTH, height: HEIGHT, startRoom, endRoom, TILE, GLYPH, COLOR };
    }

    function carveCorridor(map, a, b) {
        let x = a.cx, y = a.cy;
        const tx = b.cx, ty = b.cy;

        // L-shaped corridor: horizontal then vertical (or vice versa, random)
        if (Math.random() < 0.5) {
            while (x !== tx) { map[y][x] = map[y][x] === TILE.WALL ? TILE.CORRIDOR : map[y][x]; x += x < tx ? 1 : -1; }
            while (y !== ty) { map[y][x] = map[y][x] === TILE.WALL ? TILE.CORRIDOR : map[y][x]; y += y < ty ? 1 : -1; }
        } else {
            while (y !== ty) { map[y][x] = map[y][x] === TILE.WALL ? TILE.CORRIDOR : map[y][x]; y += y < ty ? 1 : -1; }
            while (x !== tx) { map[y][x] = map[y][x] === TILE.WALL ? TILE.CORRIDOR : map[y][x]; x += x < tx ? 1 : -1; }
        }
        map[ty][tx] = map[ty][tx] === TILE.WALL ? TILE.CORRIDOR : map[ty][tx];
    }

    function placeDoors(map, rooms) {
        for (const room of rooms) {
            // Check edges of each room for corridor adjacency
            for (let x = room.x; x < room.x + room.w; x++) {
                checkDoor(map, x, room.y - 1, x, room.y);
                checkDoor(map, x, room.y + room.h, x, room.y + room.h - 1);
            }
            for (let y = room.y; y < room.y + room.h; y++) {
                checkDoor(map, room.x - 1, y, room.x, y);
                checkDoor(map, room.x + room.w, y, room.x + room.w - 1, y);
            }
        }
    }

    function checkDoor(map, cx, cy, rx, ry) {
        if (cy < 0 || cy >= HEIGHT || cx < 0 || cx >= WIDTH) return;
        if (map[cy][cx] === TILE.CORRIDOR && map[ry][rx] === TILE.FLOOR) {
            if (Math.random() < 0.4) {
                map[cy][cx] = TILE.DOOR;
            }
        }
    }

    function isPassable(tile) {
        return tile === TILE.FLOOR || tile === TILE.CORRIDOR || tile === TILE.DOOR ||
               tile === TILE.STAIRS_DOWN || tile === TILE.STAIRS_UP;
    }

    return { create, TILE, GLYPH, COLOR, WIDTH, HEIGHT, isPassable };
})();
