/**
 * Rhythm Rogue — Main Engine
 * Game loop, rendering, input, state machine.
 * Depends on: RhythmAudio, RhythmDungeon, RhythmEntities, RhythmSystem
 */
(function () {
  'use strict';

  // ---- Canvas Setup ----
  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');

  // ---- State ----
  var STATE = { MENU: 0, PLAYING: 1, PAUSED: 2, DEAD: 3, VICTORY: 4 };
  var state = STATE.MENU;
  var dungeon = null;
  var lastTime = 0;
  var animFrame = 0;

  // Camera
  var cam = { x: 0, y: 0 };
  var TILE_SIZE = 24;
  var MIN_TILE = 16;
  var MAX_TILE = 32;

  // Visual effects
  var particles = [];
  var floatingTexts = [];
  var moveAnim = { active: false, fromX: 0, fromY: 0, toX: 0, toY: 0, t: 0 };

  // Input queue
  var inputQueue = [];
  var keysDown = {};
  var lastMoveTime = 0;
  var MOVE_COOLDOWN = 0.12; // seconds

  // FOV / visibility
  var visible = {};
  var explored = {};

  // ---- Helpers ----
  function tileKey(x, y) { return x + ',' + y; }

  // Simple raycasting FOV
  function computeFOV(px, py, radius) {
    visible = {};
    var r2 = radius * radius;
    for (var a = 0; a < 360; a += 1.5) {
      var rad = a * Math.PI / 180;
      var dx = Math.cos(rad);
      var dy = Math.sin(rad);
      var x = px + 0.5, y = py + 0.5;
      for (var d = 0; d < radius; d++) {
        var tx = Math.floor(x);
        var ty = Math.floor(y);
        var key = tileKey(tx, ty);
        visible[key] = true;
        explored[key] = true;
        if (!RhythmDungeon.isWalkable(tx, ty)) break;
        x += dx;
        y += dy;
      }
    }
  }

  // ---- Particles ----
  function spawnParticle(x, y, color, count) {
    for (var i = 0; i < (count || 5); i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 0.4 + Math.random() * 0.3,
        maxLife: 0.6,
        color: color,
        size: 2 + Math.random() * 2
      });
    }
  }

  function spawnFloatingText(x, y, text, color) {
    floatingTexts.push({
      x: x, y: y,
      text: text,
      color: color,
      life: 0.8,
      maxLife: 0.8
    });
  }

  // ---- Game Flow ----
  function startGame(songFile) {
    state = STATE.MENU; // prevent input while loading
    RhythmEntities.resetPlayer();
    RhythmEntities.clearItems();
    RhythmSystem.reset();
    explored = {};
    particles = [];
    floatingTexts = [];

    RhythmAudio.loadSong(songFile, function (songData) {
      generateFloor(1);
      RhythmAudio.playSong();
      state = STATE.PLAYING;
      ChipPlayer.onEnd(function () {
        // Song ended - if player is alive, they win
        if (RhythmEntities.player.alive) {
          state = STATE.VICTORY;
        }
      });
    });
  }

  function generateFloor(floor) {
    dungeon = RhythmDungeon.generate(floor);
    var p = RhythmEntities.player;
    p.x = dungeon.spawn.x;
    p.y = dungeon.spawn.y;
    RhythmEntities.spawnEnemies(dungeon.enemySpawns, floor);
    RhythmEntities.clearItems();
    visible = {};
    explored = {};
    computeFOV(p.x, p.y, 8);

    RhythmAudio.playSfx('stairs');
    spawnParticle(p.x, p.y, '#ffdd44', 12);
    spawnFloatingText(p.x, p.y - 1, 'FLOOR ' + floor, '#ffdd44');
  }

  function tryMove(dx, dy) {
    if (state !== STATE.PLAYING) return;
    var p = RhythmEntities.player;
    if (!p.alive) return;

    var now = performance.now() / 1000;
    if (now - lastMoveTime < MOVE_COOLDOWN) return;
    lastMoveTime = now;

    // Check beat timing
    var timing = RhythmAudio.checkBeatTiming();
    RhythmSystem.registerMove(timing);
    p.movesMade++;

    var nx = p.x + dx;
    var ny = p.y + dy;

    // Attack enemy at target tile
    var enemy = RhythmEntities.getEnemyAt(nx, ny);
    if (enemy) {
      var mult = RhythmSystem.getComboMultiplier();
      var result = RhythmEntities.tryAttack(nx, ny, mult);
      if (result && result.hit) {
        RhythmAudio.playSfx('hit');
        spawnParticle(nx, ny, result.enemy.color, 8);
        var dmgText = '-' + (p.weapon.dmg * mult);
        spawnFloatingText(nx, ny - 0.5, dmgText, '#ff4444');
        if (result.killed) {
          spawnFloatingText(nx, ny - 1, '+' + (50 * mult), '#ffdd44');
        }
        RhythmSystem.getScreenShake(); // already set by combo
      }
      // Score for on-beat hits
      if (timing.score > 0) {
        p.score += timing.score * 10 * mult;
      }
      computeFOV(p.x, p.y, 8);
      return;
    }

    // Move
    if (RhythmDungeon.isWalkable(nx, ny)) {
      moveAnim = { active: true, fromX: p.x, fromY: p.y, toX: nx, toY: ny, t: 0 };
      p.x = nx;
      p.y = ny;
      RhythmAudio.playSfx('step');

      // Check stairs
      if (RhythmDungeon.getTile(nx, ny) === RhythmDungeon.TILE.STAIRS) {
        generateFloor(RhythmDungeon.getFloor() + 1);
        return;
      }

      // Collect treasures
      var treasures = RhythmDungeon.getTreasures();
      for (var i = 0; i < treasures.length; i++) {
        if (!treasures[i].collected && treasures[i].x === nx && treasures[i].y === ny) {
          treasures[i].collected = true;
          p.gold += treasures[i].gold;
          p.score += treasures[i].gold;
          RhythmAudio.playSfx('coin');
          spawnParticle(nx, ny, '#ffdd44', 8);
          spawnFloatingText(nx, ny - 0.5, '+' + treasures[i].gold + 'g', '#ffdd44');
        }
      }

      // Collect dropped items
      var collected = RhythmEntities.collectItems(nx, ny);
      for (var ci = 0; ci < collected.length; ci++) {
        RhythmAudio.playSfx('coin');
        spawnFloatingText(nx, ny - 0.5, collected[ci].name, collected[ci].color || '#fff');
      }

      // Score for on-beat moves
      if (timing.score > 0) {
        p.score += timing.score * 5 * RhythmSystem.getComboMultiplier();
      }

      computeFOV(p.x, p.y, 8);
    } else {
      RhythmAudio.playSfx('miss');
    }
  }

  // ---- Input ----
  document.addEventListener('keydown', function (e) {
    if (keysDown[e.key]) return;
    keysDown[e.key] = true;

    if (state === STATE.PLAYING) {
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': tryMove(0, -1); e.preventDefault(); break;
        case 'ArrowDown': case 's': case 'S': tryMove(0, 1); e.preventDefault(); break;
        case 'ArrowLeft': case 'a': case 'A': tryMove(-1, 0); e.preventDefault(); break;
        case 'ArrowRight': case 'd': case 'D': tryMove(1, 0); e.preventDefault(); break;
        case 'Escape': case 'p': case 'P':
          state = STATE.PAUSED;
          ChipPlayer.pause && typeof ChipPlayer.pause === 'function' && ChipPlayer.pause();
          e.preventDefault();
          break;
      }
    } else if (state === STATE.PAUSED) {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        state = STATE.PLAYING;
        ChipPlayer.resume && typeof ChipPlayer.resume === 'function' && ChipPlayer.resume();
        e.preventDefault();
      }
      if (e.key === 'q' || e.key === 'Q') {
        RhythmAudio.stopSong();
        state = STATE.MENU;
        showSongSelect();
        e.preventDefault();
      }
    } else if (state === STATE.DEAD || state === STATE.VICTORY) {
      if (e.key === 'Enter' || e.key === ' ') {
        RhythmAudio.stopSong();
        state = STATE.MENU;
        showSongSelect();
        e.preventDefault();
      }
    }
  });

  document.addEventListener('keyup', function (e) {
    keysDown[e.key] = false;
  });

  // Touch controls
  var touchStart = null;
  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  });
  canvas.addEventListener('touchend', function (e) {
    e.preventDefault();
    if (!touchStart) return;
    var dx = e.changedTouches[0].clientX - touchStart.x;
    var dy = e.changedTouches[0].clientY - touchStart.y;
    var threshold = 20;
    if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
      if (Math.abs(dx) > Math.abs(dy)) {
        tryMove(dx > 0 ? 1 : -1, 0);
      } else {
        tryMove(0, dy > 0 ? 1 : -1);
      }
    }
    touchStart = null;
  });

  // ---- Resize ----
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Adjust tile size based on screen
    TILE_SIZE = Math.max(MIN_TILE, Math.min(MAX_TILE, Math.floor(Math.min(canvas.width, canvas.height) / 20)));
  }
  window.addEventListener('resize', resize);
  resize();

  // ---- Rendering ----

  var WALL_COLORS = ['#1a1425', '#1c1628', '#18122a'];
  var FLOOR_COLOR = '#2a2240';
  var CORRIDOR_COLOR = '#252038';
  var STAIRS_COLOR = '#ffdd44';
  var FOG_COLOR = 'rgba(10, 8, 18, 0.85)';

  function drawTile(tx, ty, screenX, screenY, ts) {
    var key = tileKey(tx, ty);
    var isVisible = visible[key];
    var isExplored = explored[key];

    if (!isVisible && !isExplored) {
      // Unexplored - draw nothing (black)
      return;
    }

    var tile = RhythmDungeon.getTile(tx, ty);
    var pulse = RhythmSystem.getBeatPulse();

    if (tile === RhythmDungeon.TILE.WALL) {
      // Visible walls get a subtle beat pulse
      var wallBright = isVisible ? (0.9 + pulse * 0.1) : 0.4;
      ctx.fillStyle = isVisible ? '#1a1425' : '#0f0b18';
      ctx.fillRect(screenX, screenY, ts, ts);
      // Wall edge highlight
      if (isVisible) {
        ctx.strokeStyle = 'rgba(100, 80, 160, ' + (0.15 + pulse * 0.1) + ')';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX + 0.5, screenY + 0.5, ts - 1, ts - 1);
      }
    } else if (tile === RhythmDungeon.TILE.STAIRS) {
      ctx.fillStyle = FLOOR_COLOR;
      ctx.fillRect(screenX, screenY, ts, ts);
      // Staircase symbol
      var stairPulse = 0.6 + pulse * 0.4;
      ctx.fillStyle = 'rgba(255, 221, 68, ' + stairPulse + ')';
      ctx.font = 'bold ' + Math.floor(ts * 0.7) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', screenX + ts / 2, screenY + ts / 2);
    } else {
      // Floor or corridor
      var floorBase = tile === RhythmDungeon.TILE.CORRIDOR ? CORRIDOR_COLOR : FLOOR_COLOR;
      ctx.fillStyle = floorBase;
      ctx.fillRect(screenX, screenY, ts, ts);

      // Subtle grid lines
      if (isVisible) {
        ctx.strokeStyle = 'rgba(100, 80, 160, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(screenX, screenY, ts, ts);
      }
    }

    // Fog overlay for explored but not visible
    if (!isVisible && isExplored) {
      ctx.fillStyle = FOG_COLOR;
      ctx.fillRect(screenX, screenY, ts, ts);
    }
  }

  function drawPlayer(ts, offsetX, offsetY) {
    var p = RhythmEntities.player;
    var pulse = RhythmSystem.getBeatPulse();
    var px, py;

    if (moveAnim.active) {
      var t = Math.min(1, moveAnim.t / 0.1);
      var ease = t * (2 - t); // ease out
      px = (moveAnim.fromX + (moveAnim.toX - moveAnim.fromX) * ease) * ts + offsetX;
      py = (moveAnim.fromY + (moveAnim.toY - moveAnim.fromY) * ease) * ts + offsetY;
    } else {
      px = p.x * ts + offsetX;
      py = p.y * ts + offsetY;
    }

    // Player glow
    var glowSize = ts * (0.8 + pulse * 0.3);
    var grad = ctx.createRadialGradient(px + ts / 2, py + ts / 2, 0, px + ts / 2, py + ts / 2, glowSize);
    grad.addColorStop(0, 'rgba(100, 200, 255, ' + (0.15 + pulse * 0.15) + ')');
    grad.addColorStop(1, 'rgba(100, 200, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(px + ts / 2 - glowSize, py + ts / 2 - glowSize, glowSize * 2, glowSize * 2);

    // Player body
    var bodyScale = 1 + pulse * 0.08;
    var bx = px + ts / 2;
    var by = py + ts / 2;
    var size = ts * 0.35 * bodyScale;

    ctx.fillStyle = '#66ccff';
    ctx.beginPath();
    ctx.arc(bx, by, size, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bx - size * 0.3, by - size * 0.15, size * 0.2, 0, Math.PI * 2);
    ctx.arc(bx + size * 0.3, by - size * 0.15, size * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Weapon indicator
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold ' + Math.floor(ts * 0.35) + 'px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.weapon.symbol, bx + size * 0.8, by + size * 0.3);
  }

  function drawEnemies(ts, offsetX, offsetY) {
    var enemies = RhythmEntities.getEnemies();
    var pulse = RhythmSystem.getBeatPulse();

    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (!e.alive) continue;
      var key = tileKey(e.x, e.y);
      if (!visible[key]) continue;

      var ex = e.x * ts + offsetX;
      var ey = e.y * ts + offsetY;

      // Flash effect when hit
      var flashColor = e.flash > 0 ? '#ffffff' : e.color;
      if (e.flash > 0) e.flash--;

      // Enemy body - pulses on beat
      var eScale = 1 + pulse * 0.06;
      ctx.fillStyle = flashColor;
      ctx.font = 'bold ' + Math.floor(ts * 0.65 * eScale) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.symbol, ex + ts / 2, ey + ts / 2);

      // HP bar
      if (e.hp < e.maxHp) {
        var barW = ts * 0.8;
        var barH = 3;
        var barX = ex + (ts - barW) / 2;
        var barY = ey - 4;
        ctx.fillStyle = '#440000';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
      }
    }
  }

  function drawTreasures(ts, offsetX, offsetY) {
    var treasures = RhythmDungeon.getTreasures();
    var pulse = RhythmSystem.getBeatPulse();

    for (var i = 0; i < treasures.length; i++) {
      var t = treasures[i];
      if (t.collected) continue;
      var key = tileKey(t.x, t.y);
      if (!visible[key]) continue;

      var tx = t.x * ts + offsetX;
      var ty = t.y * ts + offsetY;

      // Gold shimmer
      var alpha = 0.7 + pulse * 0.3;
      ctx.fillStyle = 'rgba(255, 221, 68, ' + alpha + ')';
      ctx.font = 'bold ' + Math.floor(ts * 0.5) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', tx + ts / 2, ty + ts / 2);
    }
  }

  function drawDroppedItems(ts, offsetX, offsetY) {
    var items = RhythmEntities.getItems();
    var pulse = RhythmSystem.getBeatPulse();

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var key = tileKey(it.x, it.y);
      if (!visible[key]) continue;

      var ix = it.x * ts + offsetX;
      var iy = it.y * ts + offsetY;

      var alpha = 0.7 + pulse * 0.3;
      ctx.fillStyle = it.item.color || '#ffffff';
      ctx.globalAlpha = alpha;
      ctx.font = 'bold ' + Math.floor(ts * 0.5) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(it.item.symbol, ix + ts / 2, iy + ts / 2);
      ctx.globalAlpha = 1;
    }
  }

  function drawParticles(ts, offsetX, offsetY, dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      var alpha = p.life / p.maxLife;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      var sx = p.x * ts + offsetX + ts / 2;
      var sy = p.y * ts + offsetY + ts / 2;
      ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawFloatingTexts(ts, offsetX, offsetY, dt) {
    for (var i = floatingTexts.length - 1; i >= 0; i--) {
      var ft = floatingTexts[i];
      ft.life -= dt;
      ft.y -= dt * 1.5;
      if (ft.life <= 0) { floatingTexts.splice(i, 1); continue; }
      var alpha = ft.life / ft.maxLife;
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = alpha;
      ctx.font = 'bold ' + Math.floor(ts * 0.45) + 'px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var sx = ft.x * ts + offsetX + ts / 2;
      var sy = ft.y * ts + offsetY + ts / 2;
      ctx.fillText(ft.text, sx, sy);
    }
    ctx.globalAlpha = 1;
  }

  function drawHUD() {
    var p = RhythmEntities.player;
    var pulse = RhythmSystem.getBeatPulse();
    var w = canvas.width;

    // Top-left: HP bar
    var barX = 16, barY = 16, barW = 140, barH = 14;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);
    ctx.fillStyle = '#331111';
    ctx.fillRect(barX, barY, barW, barH);
    var hpFrac = p.hp / p.maxHp;
    var hpColor = hpFrac > 0.5 ? '#44cc66' : (hpFrac > 0.25 ? '#ccaa44' : '#cc4444');
    ctx.fillStyle = hpColor;
    ctx.fillRect(barX, barY, barW * hpFrac, barH);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('HP ' + p.hp + '/' + p.maxHp, barX + 4, barY + 1);

    // Below HP: weapon, gold, armor
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ccbbff';
    ctx.fillText(p.weapon.symbol + ' ' + p.weapon.name + (p.armor > 0 ? '  [+' + p.armor + ' ARM]' : ''), barX, barY + barH + 6);
    ctx.fillStyle = '#ffdd44';
    ctx.fillText('Gold: ' + p.gold, barX, barY + barH + 22);

    // Floor
    ctx.fillStyle = '#aaa';
    ctx.fillText('Floor ' + RhythmDungeon.getFloor(), barX, barY + barH + 38);

    // Top-right: score and combo
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Score: ' + p.score, w - 16, 20);

    if (p.combo > 0) {
      var comboScale = 1 + pulse * 0.15;
      var mult = RhythmSystem.getComboMultiplier();
      ctx.font = 'bold ' + Math.floor(16 * comboScale) + 'px monospace';
      ctx.fillStyle = mult >= 4 ? '#ff44ff' : (mult >= 3 ? '#ffdd44' : (mult >= 2 ? '#66ff88' : '#ffffff'));
      ctx.fillText('COMBO x' + p.combo + ' (' + mult + 'x)', w - 16, 42);
    }

    // Bottom-center: beat indicator
    drawBeatIndicator();

    // Center: timing feedback
    var fb = RhythmSystem.getFeedback();
    if (fb.text && fb.timer > 0) {
      var fbAlpha = Math.min(1, fb.timer / 0.3);
      var fbScale = 1 + (1 - fbAlpha) * 0.3;
      ctx.textAlign = 'center';
      ctx.globalAlpha = fbAlpha;
      ctx.font = 'bold ' + Math.floor(24 * fbScale) + 'px monospace';
      ctx.fillStyle = fb.color;
      ctx.fillText(fb.text, w / 2, canvas.height / 2 - 40);
      ctx.globalAlpha = 1;
    }
  }

  function drawBeatIndicator() {
    var w = canvas.width;
    var h = canvas.height;
    var pulse = RhythmSystem.getBeatPulse();
    var phase = RhythmAudio.getBeatPhase();

    // Beat bar at bottom
    var barW = 200;
    var barH = 8;
    var barX = (w - barW) / 2;
    var barY = h - 30;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(barX - 2, barY - 2, barW + 4, barH + 4);

    // Beat zone (green center)
    var zoneW = barW * 0.24;
    ctx.fillStyle = 'rgba(68, 204, 102, 0.3)';
    ctx.fillRect(barX + (barW - zoneW) / 2, barY, zoneW, barH);

    // Moving indicator
    var indicatorX = barX + (phase * 2) * barW; // phase 0-0.5 maps to 0-1
    if (phase > 0.25) indicatorX = barX + (1 - phase * 2) * barW;
    // Clamp
    indicatorX = Math.max(barX, Math.min(barX + barW, indicatorX));

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(indicatorX - 2, barY - 2, 4, barH + 4);

    // Center beat dot
    var dotSize = 4 + pulse * 6;
    ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.5 + pulse * 0.5) + ')';
    ctx.beginPath();
    ctx.arc(barX + barW / 2, barY + barH / 2, dotSize, 0, Math.PI * 2);
    ctx.fill();

    // BPM label
    ctx.fillStyle = '#888';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(RhythmAudio.getBpm() + ' BPM', w / 2, barY + barH + 14);
  }

  function drawBeatPulseOverlay() {
    var pulse = RhythmSystem.getBeatPulse();
    if (pulse < 0.01) return;

    // Screen edge glow
    var w = canvas.width;
    var h = canvas.height;
    var glowSize = 40 + pulse * 30;
    var alpha = pulse * 0.12;

    var hue = RhythmSystem.getBeatHue();
    var color = 'hsla(' + hue + ', 70%, 60%, ' + alpha + ')';

    // Top
    var grad = ctx.createLinearGradient(0, 0, 0, glowSize);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, glowSize);

    // Bottom
    grad = ctx.createLinearGradient(0, h, 0, h - glowSize);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, h - glowSize, w, glowSize);

    // Left
    grad = ctx.createLinearGradient(0, 0, glowSize, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, glowSize, h);

    // Right
    grad = ctx.createLinearGradient(w, 0, w - glowSize, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(w - glowSize, 0, glowSize, h);
  }

  function drawPauseOverlay() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '16px monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText('Press ESC to resume  |  Q to quit', canvas.width / 2, canvas.height / 2 + 20);
  }

  function drawDeathScreen() {
    ctx.fillStyle = 'rgba(40, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var p = RhythmEntities.player;
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60);
    ctx.fillStyle = '#cccccc';
    ctx.font = '18px monospace';
    ctx.fillText('Score: ' + p.score + '  |  Floor: ' + RhythmDungeon.getFloor(), canvas.width / 2, canvas.height / 2);
    ctx.fillText('Max Combo: ' + p.maxCombo + '  |  Gold: ' + p.gold, canvas.width / 2, canvas.height / 2 + 28);
    ctx.fillText('On-beat: ' + p.beatHits + '  |  Off-beat: ' + p.beatMisses, canvas.width / 2, canvas.height / 2 + 56);
    ctx.fillStyle = '#888888';
    ctx.font = '14px monospace';
    ctx.fillText('Press ENTER to return to menu', canvas.width / 2, canvas.height / 2 + 100);
  }

  function drawVictoryScreen() {
    ctx.fillStyle = 'rgba(0, 20, 40, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var p = RhythmEntities.player;
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VICTORY', canvas.width / 2, canvas.height / 2 - 60);
    ctx.fillStyle = '#cccccc';
    ctx.font = '18px monospace';
    ctx.fillText('Score: ' + p.score + '  |  Floor: ' + RhythmDungeon.getFloor(), canvas.width / 2, canvas.height / 2);
    ctx.fillText('Max Combo: ' + p.maxCombo + '  |  Gold: ' + p.gold, canvas.width / 2, canvas.height / 2 + 28);
    var accuracy = p.movesMade > 0 ? Math.round(p.beatHits / p.movesMade * 100) : 0;
    ctx.fillText('Beat Accuracy: ' + accuracy + '%', canvas.width / 2, canvas.height / 2 + 56);
    ctx.fillStyle = '#888888';
    ctx.font = '14px monospace';
    ctx.fillText('Press ENTER to return to menu', canvas.width / 2, canvas.height / 2 + 100);
  }

  // ---- Game Loop ----
  function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);
    var dt = Math.min(0.05, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    animFrame++;

    if (state === STATE.MENU) return; // Song select is shown via DOM

    // Update
    if (state === STATE.PLAYING) {
      RhythmSystem.update(dt);

      // Move animation
      if (moveAnim.active) {
        moveAnim.t += dt;
        if (moveAnim.t >= 0.1) moveAnim.active = false;
      }

      // Enemy AI moves on beat
      if (RhythmSystem.shouldEnemiesMove()) {
        RhythmEntities.moveAllEnemies(RhythmSystem.getLastBeat());
        RhythmSystem.markEnemiesMoved();

        // Check if enemies bumped into player
        var adj = RhythmEntities.getAdjacentEnemies(RhythmEntities.player.x, RhythmEntities.player.y);
        // Damage is handled inside moveEnemy when enemy tries to move onto player
      }

      // Check death
      if (!RhythmEntities.player.alive) {
        state = STATE.DEAD;
        RhythmAudio.playSfx('hurt');
      }
    }

    // Render
    var p = RhythmEntities.player;
    var shake = RhythmSystem.getScreenShake();

    ctx.save();

    // Screen shake
    if (shake > 0.5) {
      ctx.translate(
        (Math.random() - 0.5) * shake * 2,
        (Math.random() - 0.5) * shake * 2
      );
    }

    // Clear
    ctx.fillStyle = '#0a0812';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Camera follows player
    cam.x = p.x * TILE_SIZE - canvas.width / 2 + TILE_SIZE / 2;
    cam.y = p.y * TILE_SIZE - canvas.height / 2 + TILE_SIZE / 2;
    var offsetX = -cam.x;
    var offsetY = -cam.y;

    // Draw visible tile range
    var startTX = Math.max(0, Math.floor(cam.x / TILE_SIZE) - 1);
    var startTY = Math.max(0, Math.floor(cam.y / TILE_SIZE) - 1);
    var endTX = Math.min(RhythmDungeon.MAP_W, startTX + Math.ceil(canvas.width / TILE_SIZE) + 2);
    var endTY = Math.min(RhythmDungeon.MAP_H, startTY + Math.ceil(canvas.height / TILE_SIZE) + 2);

    for (var ty = startTY; ty < endTY; ty++) {
      for (var tx = startTX; tx < endTX; tx++) {
        drawTile(tx, ty, tx * TILE_SIZE + offsetX, ty * TILE_SIZE + offsetY, TILE_SIZE);
      }
    }

    // Draw entities
    drawTreasures(TILE_SIZE, offsetX, offsetY);
    drawDroppedItems(TILE_SIZE, offsetX, offsetY);
    drawEnemies(TILE_SIZE, offsetX, offsetY);
    drawPlayer(TILE_SIZE, offsetX, offsetY);
    drawParticles(TILE_SIZE, offsetX, offsetY, dt);
    drawFloatingTexts(TILE_SIZE, offsetX, offsetY, dt);

    ctx.restore();

    // Overlays
    drawBeatPulseOverlay();
    drawHUD();

    if (state === STATE.PAUSED) drawPauseOverlay();
    if (state === STATE.DEAD) drawDeathScreen();
    if (state === STATE.VICTORY) drawVictoryScreen();
  }

  // ---- Song Select ----
  var songSelectEl = document.getElementById('song-select');
  var songGridEl = document.getElementById('song-grid');

  function showSongSelect() {
    songSelectEl.style.display = 'flex';
    canvas.style.display = 'none';
  }

  function hideSongSelect() {
    songSelectEl.style.display = 'none';
    canvas.style.display = 'block';
  }

  function getDifficultyFromBPM(bpm) {
    if (bpm < 90) return { stars: 1, label: 'Easy', color: '#66ff88' };
    if (bpm < 120) return { stars: 2, label: 'Medium', color: '#66bbff' };
    if (bpm < 150) return { stars: 3, label: 'Hard', color: '#ffe066' };
    if (bpm < 180) return { stars: 4, label: 'Expert', color: '#ffaa44' };
    return { stars: 5, label: 'Insane', color: '#ff4466' };
  }

  function buildSongCards(manifest) {
    songGridEl.innerHTML = '';
    // Group by category
    var categories = {};
    for (var i = 0; i < manifest.length; i++) {
      var s = manifest[i];
      var cat = s.category || 'other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(s);
    }
    // Sort each category by BPM
    var catOrder = ['classic', 'original', 'ambient', 'game', 'other'];
    for (var ci = 0; ci < catOrder.length; ci++) {
      var catName = catOrder[ci];
      var songs = categories[catName];
      if (!songs || songs.length === 0) continue;

      songs.sort(function (a, b) { return a.bpm - b.bpm; });

      var label = document.createElement('div');
      label.className = 'category-label';
      label.textContent = catName.charAt(0).toUpperCase() + catName.slice(1);
      songGridEl.appendChild(label);

      for (var si = 0; si < songs.length; si++) {
        (function (song) {
          var diff = getDifficultyFromBPM(song.bpm);
          var card = document.createElement('div');
          card.className = 'song-card';
          card.innerHTML =
            '<div class="song-title">' + song.title + '</div>' +
            '<div class="song-meta">' +
              '<span class="bpm">' + song.bpm + ' BPM</span>' +
              '<span class="diff" style="color:' + diff.color + '">' +
                '\u2605'.repeat(diff.stars) + '\u2606'.repeat(5 - diff.stars) +
                ' ' + diff.label +
              '</span>' +
            '</div>' +
            '<div class="song-desc">' + (song.description || '').substring(0, 80) + '</div>';
          card.addEventListener('click', function () {
            hideSongSelect();
            RhythmAudio.init();
            startGame(song.file);
          });
          songGridEl.appendChild(card);
        })(songs[si]);
      }
    }
    // Also add any remaining categories
    for (var rc in categories) {
      if (catOrder.indexOf(rc) === -1 && categories[rc].length > 0) {
        var rlabel = document.createElement('div');
        rlabel.className = 'category-label';
        rlabel.textContent = rc.charAt(0).toUpperCase() + rc.slice(1);
        songGridEl.appendChild(rlabel);
        for (var ri = 0; ri < categories[rc].length; ri++) {
          (function (song) {
            var diff = getDifficultyFromBPM(song.bpm);
            var card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML =
              '<div class="song-title">' + song.title + '</div>' +
              '<div class="song-meta">' +
                '<span class="bpm">' + song.bpm + ' BPM</span>' +
                '<span class="diff" style="color:' + diff.color + '">' +
                  '\u2605'.repeat(diff.stars) + '\u2606'.repeat(5 - diff.stars) +
                  ' ' + diff.label +
                '</span>' +
              '</div>';
            card.addEventListener('click', function () {
              hideSongSelect();
              RhythmAudio.init();
              startGame(song.file);
            });
            songGridEl.appendChild(card);
          })(categories[rc][ri]);
        }
      }
    }
  }

  // ---- Init ----
  function init() {
    showSongSelect();
    RhythmAudio.loadManifest(function (manifest) {
      buildSongCards(manifest);
    });
    requestAnimationFrame(gameLoop);
  }

  // Expose startGame for external use
  window.RhythmRogue = { startGame: startGame };

  init();
})();
