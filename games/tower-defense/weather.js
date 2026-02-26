/**
 * Arcane Bastion — Weather & Environment System
 *
 * Visual-only atmospheric effects: rain, day/night cycle, ambient portal
 * particles, nexus pulse rings, and fog wisps.
 *
 * Exports: window.ArcaneWeather
 */
(function () {
  'use strict';

  var Map = window.ArcaneMap;
  var CELL = Map.CELL_SIZE;
  var MAP_W = Map.MAP_W;
  var MAP_H = Map.MAP_H;

  // ───────────────────────── Configuration ──────────────────────────

  // Rain waves (1-indexed wave numbers that have rain)
  var RAIN_WAVES = { 8:1, 9:1, 10:1, 11:1, 12:1, 16:1, 17:1, 18:1 };

  // Day/Night phases keyed by wave ranges
  // Each phase: { overlay rgba, nexus glow multiplier, portal glow multiplier }
  var PHASES = [
    // Dawn: waves 1-5
    { name: 'dawn',  r: 255, g: 180, b: 80,  a: 0.06, nexusGlow: 1.0, portalGlow: 1.0 },
    // Day: waves 6-10
    { name: 'day',   r: 0,   g: 0,   b: 0,   a: 0.0,  nexusGlow: 1.0, portalGlow: 1.0 },
    // Dusk: waves 11-15
    { name: 'dusk',  r: 160, g: 80,  b: 180, a: 0.08, nexusGlow: 1.2, portalGlow: 1.2 },
    // Night: waves 16-20
    { name: 'night', r: 20,  g: 30,  b: 80,  a: 0.18, nexusGlow: 1.6, portalGlow: 1.5 },
  ];

  // ───────────────────────── State ──────────────────────────────────

  var currentWave = 0;
  var isWaveActive = false;

  // Day/Night transition
  var currentPhase = PHASES[0];
  var targetPhase = PHASES[0];
  var phaseBlend = 1.0; // 0 = current, 1 = target (start fully blended)

  // Rain particle pool
  var RAIN_POOL_SIZE = 80;
  var rainPool = [];
  var rainActive = false;
  var rainSplashes = [];

  // Fog wisps
  var fogWisps = [];

  // Nexus pulse rings
  var nexusRings = [];
  var nexusRingTimer = 0;

  // Ambient portal particles (enhanced)
  var ambientPortalParticles = [];

  // ───────────────────────── Init ───────────────────────────────────

  function init() {
    // Pre-allocate rain pool
    rainPool = [];
    for (var i = 0; i < RAIN_POOL_SIZE; i++) {
      rainPool.push(makeRainDrop());
    }
    rainSplashes = [];

    // Init fog wisps
    fogWisps = [];
    for (var f = 0; f < 5; f++) {
      fogWisps.push({
        x: Math.random() * MAP_W,
        y: Math.random() * MAP_H,
        vx: (Math.random() - 0.5) * 20, // ~10px/s
        vy: (Math.random() - 0.5) * 6,
        w: 120 + Math.random() * 100,
        h: 40 + Math.random() * 30,
        alpha: 0.03 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Init nexus rings
    nexusRings = [];
    nexusRingTimer = 0;

    // Init ambient portal particles
    ambientPortalParticles = [];
    var spawns = Map.spawnCells;
    var portalColors = [
      { r: 220, g: 60, b: 60 },   // spawn 0 (top) - red
      { r: 60, g: 140, b: 220 },  // spawn 1 (bottom) - blue
      { r: 60, g: 200, b: 80 },   // spawn 2 (left) - green
      { r: 200, g: 60, b: 200 },  // spawn 3 (right) - purple
    ];
    for (var s = 0; s < spawns.length; s++) {
      var col = portalColors[s % portalColors.length];
      for (var p = 0; p < 8; p++) {
        ambientPortalParticles.push({
          spawnIdx: s,
          angle: Math.random() * Math.PI * 2,
          radius: 20 + Math.random() * 25,
          speed: 0.2 + Math.random() * 0.4,
          size: 1.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          r: col.r, g: col.g, b: col.b
        });
      }
    }

    currentPhase = PHASES[0];
    targetPhase = PHASES[0];
    phaseBlend = 1.0;
  }

  // ───────────────────────── Rain Helpers ───────────────────────────

  function makeRainDrop() {
    return {
      x: Math.random() * (MAP_W + 200) - 100,
      y: Math.random() * MAP_H - MAP_H, // start above viewport
      len: 8 + Math.random() * 14,
      speed: 400 + Math.random() * 250,
      alpha: 0.15 + Math.random() * 0.25,
      active: true
    };
  }

  function resetRainDrop(drop) {
    drop.x = Math.random() * (MAP_W + 200) - 100;
    drop.y = -10 - Math.random() * 60;
    drop.len = 8 + Math.random() * 14;
    drop.speed = 400 + Math.random() * 250;
    drop.alpha = 0.15 + Math.random() * 0.25;
    drop.active = true;
  }

  // ───────────────────────── Phase Helpers ──────────────────────────

  function getPhaseForWave(wave) {
    if (wave <= 5) return PHASES[0];  // dawn
    if (wave <= 10) return PHASES[1]; // day
    if (wave <= 15) return PHASES[2]; // dusk
    return PHASES[3];                 // night
  }

  function isNight(wave) {
    return wave >= 16 && wave <= 20;
  }

  function lerpVal(a, b, t) {
    return a + (b - a) * t;
  }

  // ───────────────────────── Set Wave ───────────────────────────────

  /**
   * Called by engine when wave changes. Triggers phase transition.
   * @param {number} wave  - 1-indexed wave number
   * @param {boolean} active - true if wave is running, false if build phase
   */
  function setWave(wave, active) {
    var prevWave = currentWave;
    currentWave = wave;
    isWaveActive = active;

    var newPhase = getPhaseForWave(wave);
    if (newPhase !== targetPhase) {
      currentPhase = {
        name: 'blend',
        r: lerpVal(currentPhase.r, targetPhase.r, phaseBlend),
        g: lerpVal(currentPhase.g, targetPhase.g, phaseBlend),
        b: lerpVal(currentPhase.b, targetPhase.b, phaseBlend),
        a: lerpVal(currentPhase.a, targetPhase.a, phaseBlend),
        nexusGlow: lerpVal(currentPhase.nexusGlow, targetPhase.nexusGlow, phaseBlend),
        portalGlow: lerpVal(currentPhase.portalGlow, targetPhase.portalGlow, phaseBlend),
      };
      targetPhase = newPhase;
      phaseBlend = 0;
    }

    // Activate/deactivate rain
    rainActive = !!RAIN_WAVES[wave];
  }

  // ───────────────────────── Update ─────────────────────────────────

  function update(dt) {
    // Clamp dt to avoid huge jumps
    if (dt > 0.1) dt = 0.1;

    // Phase transition (smooth during build phase, ~2 seconds)
    if (phaseBlend < 1) {
      phaseBlend = Math.min(1, phaseBlend + dt * 0.5);
    }

    // Update rain
    if (rainActive) {
      updateRain(dt);
    }

    // Update fog wisps (only at night)
    if (isNight(currentWave)) {
      updateFogWisps(dt);
    }

    // Update nexus rings
    updateNexusRings(dt);
  }

  function updateRain(dt) {
    // Update drops
    var windX = -60; // angled from top-right to bottom-left
    for (var i = 0; i < rainPool.length; i++) {
      var drop = rainPool[i];
      drop.y += drop.speed * dt;
      drop.x += windX * dt;

      // Check if below map
      if (drop.y > MAP_H) {
        // Spawn splash
        if (rainSplashes.length < 40) {
          rainSplashes.push({
            x: drop.x,
            y: MAP_H - 2 + Math.random() * 4,
            radius: 0,
            maxRadius: 3 + Math.random() * 3,
            alpha: 0.3,
            life: 0.3
          });
        }
        resetRainDrop(drop);
      }
    }

    // Update splashes
    for (var s = rainSplashes.length - 1; s >= 0; s--) {
      var sp = rainSplashes[s];
      sp.life -= dt;
      sp.radius += 15 * dt;
      sp.alpha = Math.max(0, sp.life / 0.3 * 0.3);
      if (sp.life <= 0) {
        rainSplashes.splice(s, 1);
      }
    }
  }

  function updateFogWisps(dt) {
    for (var i = 0; i < fogWisps.length; i++) {
      var w = fogWisps[i];
      w.x += w.vx * dt;
      w.y += w.vy * dt;
      // Wrap around map edges
      if (w.x > MAP_W + w.w) w.x = -w.w;
      if (w.x < -w.w) w.x = MAP_W + w.w;
      if (w.y > MAP_H + w.h) w.y = -w.h;
      if (w.y < -w.h) w.y = MAP_H + w.h;
    }
  }

  function updateNexusRings(dt) {
    var nx = Map.nexus;
    var hpRatio = nx.hp / nx.maxHp;

    // Pulse speed: faster when HP is low
    var interval = hpRatio > 0.5 ? 2.0 : (hpRatio > 0.2 ? 1.2 : 0.6);
    nexusRingTimer += dt;
    if (nexusRingTimer >= interval) {
      nexusRingTimer -= interval;
      nexusRings.push({
        x: nx.x,
        y: nx.y,
        radius: 10,
        maxRadius: 60 + (1 - hpRatio) * 30,
        alpha: 0.35,
        life: 1.5,
        maxLife: 1.5,
        hpRatio: hpRatio
      });
    }

    // Update existing rings
    for (var i = nexusRings.length - 1; i >= 0; i--) {
      var ring = nexusRings[i];
      ring.life -= dt;
      var t = 1 - ring.life / ring.maxLife;
      ring.radius = 10 + (ring.maxRadius - 10) * t;
      ring.alpha = 0.35 * (1 - t);
      if (ring.life <= 0) {
        nexusRings.splice(i, 1);
      }
    }
  }

  // ───────────────────────── Drawing: World Space ───────────────────
  //
  // Called inside the ctx.save()/ctx.translate() block in engine render,
  // after Map.draw() but before enemies.

  function drawWorldEffects(ctx, cam, time) {
    var t = time;

    // ── Ambient portal particles ──
    drawAmbientPortalParticles(ctx, t);

    // ── Nexus pulse rings ──
    drawNexusRings(ctx, t);

    // ── Rain (if active) ──
    if (rainActive) {
      drawRain(ctx, cam);
    }

    // ── Fog wisps (night only) ──
    if (isNight(currentWave)) {
      drawFogWisps(ctx, t);
    }
  }

  function drawAmbientPortalParticles(ctx, t) {
    var spawns = Map.spawnCells;
    var intensity = isWaveActive ? 1.4 : 0.7;

    ctx.save();
    for (var i = 0; i < ambientPortalParticles.length; i++) {
      var p = ambientPortalParticles[i];
      var sp = spawns[p.spawnIdx];
      if (!sp) continue;

      var cx = sp.col * CELL + CELL / 2;
      var cy = sp.row * CELL + CELL / 2;

      var a = p.angle + t * p.speed;
      var drift = Math.sin(t * 0.5 + p.phase) * 6;
      var r = p.radius + drift;
      var px = cx + Math.cos(a) * r;
      var py = cy + Math.sin(a) * r;
      var alpha = (0.2 + Math.sin(t * 1.5 + p.phase) * 0.15) * intensity;

      ctx.fillStyle = 'rgba(' + p.r + ',' + p.g + ',' + p.b + ',' + alpha + ')';
      ctx.beginPath();
      ctx.arc(px, py, p.size * intensity, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawNexusRings(ctx, t) {
    if (nexusRings.length === 0) return;

    ctx.save();
    for (var i = 0; i < nexusRings.length; i++) {
      var ring = nexusRings[i];
      // Color: blue-white when healthy, red when critical
      var hr = ring.hpRatio;
      var r = Math.floor(lerpVal(255, 120, hr));
      var g = Math.floor(lerpVal(60, 160, hr));
      var b = Math.floor(lerpVal(60, 255, hr));

      ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + ring.alpha + ')';
      ctx.lineWidth = 2 * ring.alpha + 0.5;
      ctx.shadowColor = 'rgba(' + r + ',' + g + ',' + b + ',' + ring.alpha * 0.6 + ')';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawRain(ctx, cam) {
    ctx.save();
    ctx.lineCap = 'round';
    for (var i = 0; i < rainPool.length; i++) {
      var drop = rainPool[i];
      // Angled rain: top-right to bottom-left
      var dx = -4;
      var dy = drop.len;
      ctx.strokeStyle = 'rgba(140, 180, 220, ' + drop.alpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x + dx, drop.y + dy);
      ctx.stroke();
    }

    // Draw splashes
    for (var s = 0; s < rainSplashes.length; s++) {
      var sp = rainSplashes[s];
      ctx.strokeStyle = 'rgba(160, 200, 240, ' + sp.alpha + ')';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawFogWisps(ctx, t) {
    ctx.save();
    for (var i = 0; i < fogWisps.length; i++) {
      var w = fogWisps[i];
      var breathe = Math.sin(t * 0.4 + w.phase) * 0.015;
      var alpha = w.alpha + breathe;
      if (alpha <= 0) continue;

      ctx.fillStyle = 'rgba(180, 190, 210, ' + alpha + ')';
      ctx.beginPath();
      ctx.ellipse(w.x, w.y, w.w / 2, w.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ───────────────────────── Drawing: Screen Space ──────────────────
  //
  // Called after ALL world rendering (enemies, FX) for day/night overlay.

  function drawOverlay(ctx, vw, vh, time) {
    // Compute blended phase values
    var r = lerpVal(currentPhase.r, targetPhase.r, phaseBlend);
    var g = lerpVal(currentPhase.g, targetPhase.g, phaseBlend);
    var b = lerpVal(currentPhase.b, targetPhase.b, phaseBlend);
    var a = lerpVal(currentPhase.a, targetPhase.a, phaseBlend);

    if (a <= 0.001) return; // Day phase, skip

    ctx.save();
    ctx.fillStyle = 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ',' + a.toFixed(3) + ')';
    ctx.fillRect(0, 0, vw, vh);
    ctx.restore();
  }

  /**
   * Get current glow multipliers for nexus/portal brightness at night.
   */
  function getGlowMultipliers() {
    var ng = lerpVal(currentPhase.nexusGlow, targetPhase.nexusGlow, phaseBlend);
    var pg = lerpVal(currentPhase.portalGlow, targetPhase.portalGlow, phaseBlend);
    return { nexus: ng, portal: pg };
  }

  // ───────────────────────── Public API ─────────────────────────────

  init();

  window.ArcaneWeather = {
    init: init,
    setWave: setWave,
    update: update,
    drawWorldEffects: drawWorldEffects,
    drawOverlay: drawOverlay,
    getGlowMultipliers: getGlowMultipliers
  };

})();
