/**
 * ArcaneFX — Visual effects engine for Arcane Bastion tower defense.
 *
 * Handles projectiles, beams, chain lightning, explosions, particles,
 * damage numbers, auras, ground effects, and placement/death effects.
 * All rendering targets an HTML5 Canvas 2D context.
 *
 * Exports: window.ArcaneFX
 */
(function () {
  'use strict';

  // -----------------------------------------------------------------------
  //  Element color palettes
  // -----------------------------------------------------------------------

  const PALETTES = {
    fire:      { primary: '#ff4422', secondary: '#ff8800', glow: 'rgba(255,68,34,0.6)',  particle: '#ffaa00' },
    ice:       { primary: '#44ccff', secondary: '#88eeff', glow: 'rgba(68,204,255,0.6)', particle: '#aaeeff' },
    lightning: { primary: '#ffee44', secondary: '#ffffff', glow: 'rgba(255,238,68,0.6)', particle: '#ffffaa' },
    earth:     { primary: '#aa8844', secondary: '#665533', glow: 'rgba(170,136,68,0.5)', particle: '#ccaa66' },
    arcane:    { primary: '#bb44ff', secondary: '#dd88ff', glow: 'rgba(187,68,255,0.6)', particle: '#cc66ff' },
    nature:    { primary: '#33cc55', secondary: '#66ee88', glow: 'rgba(51,204,85,0.5)',  particle: '#88ff99' },
    shadow:    { primary: '#6633aa', secondary: '#442277', glow: 'rgba(102,51,170,0.5)', particle: '#8844cc' },
    light:     { primary: '#ffdd88', secondary: '#ffffff', glow: 'rgba(255,221,136,0.6)',particle: '#ffffcc' },
    physical:  { primary: '#cccccc', secondary: '#999999', glow: 'rgba(200,200,200,0.4)',particle: '#dddddd' },
  };

  // -----------------------------------------------------------------------
  //  Utilities
  // -----------------------------------------------------------------------

  const TAU = Math.PI * 2;

  function lerp(a, b, t)  { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function rand(lo, hi)   { return lo + Math.random() * (hi - lo); }
  function randInt(lo, hi) { return Math.floor(rand(lo, hi + 1)); }

  /** Distance squared (avoids sqrt when only comparing). */
  function dist2(ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay;
    return dx * dx + dy * dy;
  }
  function dist(ax, ay, bx, by) { return Math.sqrt(dist2(ax, ay, bx, by)); }

  /** Parse hex color (#rrggbb) into [r, g, b]. */
  function hexRGB(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  }

  /** Check whether a world-space rectangle overlaps the camera viewport. */
  function inView(cam, x, y, margin) {
    if (!cam) return true;
    const m = margin || 0;
    return x + m >= cam.x && x - m <= cam.x + cam.w &&
           y + m >= cam.y && y - m <= cam.y + cam.h;
  }

  // -----------------------------------------------------------------------
  //  Object Pool
  // -----------------------------------------------------------------------

  class Pool {
    constructor(createFn, resetFn, initialSize) {
      this._create = createFn;
      this._reset  = resetFn;
      this._store  = [];
      initialSize = initialSize || 100;
      for (let i = 0; i < initialSize; i++) this._store.push(createFn());
    }
    acquire() {
      return this._store.length > 0 ? this._store.pop() : this._create();
    }
    release(obj) {
      this._reset(obj);
      this._store.push(obj);
    }
  }

  // -----------------------------------------------------------------------
  //  Active effect lists
  // -----------------------------------------------------------------------

  let projectiles = [];
  let beams       = [];
  let chains      = [];
  let explosions  = [];
  let particles   = [];
  let dmgNumbers  = [];
  let auras       = [];
  let groundFX    = [];
  let placeFX     = [];
  let deathFX     = [];

  const MAX_PARTICLES = 500;

  // -----------------------------------------------------------------------
  //  Pools
  // -----------------------------------------------------------------------

  // -- Particle pool ---
  const particlePool = new Pool(
    () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, r: 255, g: 255, b: 255, gravity: 0 }),
    (p) => { p.life = 0; p.maxLife = 0; },
    200
  );

  // -- Projectile pool ---
  const projectilePool = new Pool(
    () => ({
      x: 0, y: 0, vx: 0, vy: 0, targetId: null, element: 'physical',
      damage: 0, speed: 0, pierce: 0, onHit: null,
      hitRadius: 10, age: 0, alive: true,
      trail: []   // small array of recent positions for the tail
    }),
    (p) => { p.alive = false; p.trail.length = 0; p.onHit = null; p.targetId = null; },
    50
  );

  // -- Beam pool ---
  const beamPool = new Pool(
    () => ({ fromX: 0, fromY: 0, toX: 0, toY: 0, element: 'physical', duration: 0, elapsed: 0, width: 4, alive: true }),
    (b) => { b.alive = false; },
    20
  );

  // -- Chain pool ---
  const chainPool = new Pool(
    () => ({ points: [], element: 'lightning', duration: 0, elapsed: 0, alive: true, segments: [] }),
    (c) => { c.alive = false; c.points = []; c.segments = []; },
    10
  );

  // -- Explosion pool ---
  const explosionPool = new Pool(
    () => ({ x: 0, y: 0, radius: 0, element: 'physical', duration: 0, elapsed: 0, alive: true }),
    (e) => { e.alive = false; },
    30
  );

  // -- Damage number pool ---
  const dmgPool = new Pool(
    () => ({ x: 0, y: 0, amount: 0, color: '#fff', isCrit: false, elapsed: 0, alive: true, scale: 1 }),
    (d) => { d.alive = false; },
    60
  );

  // -- Aura pool ---
  const auraPool = new Pool(
    () => ({ x: 0, y: 0, radius: 0, element: 'nature', duration: 0, elapsed: 0, pulseSpeed: 1, alive: true }),
    (a) => { a.alive = false; },
    15
  );

  // -- Ground effect pool ---
  const groundPool = new Pool(
    () => ({ x: 0, y: 0, radius: 0, element: 'fire', duration: 0, elapsed: 0, dps: 0, type: 'lava', alive: true }),
    (g) => { g.alive = false; },
    15
  );

  // -- Place effect pool ---
  const placePool = new Pool(
    () => ({ x: 0, y: 0, element: 'physical', elapsed: 0, duration: 0.6, alive: true }),
    (p) => { p.alive = false; },
    10
  );

  // -- Death effect pool ---
  const deathPool = new Pool(
    () => ({ x: 0, y: 0, size: 16, color: '#fff', elapsed: 0, duration: 0.4, alive: true }),
    (d) => { d.alive = false; },
    20
  );

  // -----------------------------------------------------------------------
  //  Spawn helpers
  // -----------------------------------------------------------------------

  function palette(element) {
    return PALETTES[element] || PALETTES.physical;
  }

  // -----------------------------------------------------------------------
  //  Public API: Spawn effects
  // -----------------------------------------------------------------------

  /**
   * Spawn a homing projectile toward a target.
   */
  function spawnProjectile(opts) {
    const p  = projectilePool.acquire();
    p.x      = opts.fromX;
    p.y      = opts.fromY;
    p.targetId = opts.targetId || null;
    p.element  = opts.element || 'physical';
    p.damage   = opts.damage  || 0;
    p.speed    = opts.speed   || 300;
    p.pierce   = opts.pierce  || 0;
    p.armorPierce = opts.armorPierce || 0;
    p.onHit    = opts.onHit   || null;
    p.hitRadius = 10;
    p.age      = 0;
    p.alive    = true;
    p.trail.length = 0;

    // Initial velocity toward target
    const dx = opts.toX - opts.fromX;
    const dy = opts.toY - opts.fromY;
    const d  = Math.sqrt(dx * dx + dy * dy) || 1;
    p.vx = (dx / d) * p.speed;
    p.vy = (dy / d) * p.speed;

    projectiles.push(p);
    return p;
  }

  /**
   * Spawn a beam between two points.
   */
  function spawnBeam(opts) {
    const b   = beamPool.acquire();
    b.fromX   = opts.fromX;
    b.fromY   = opts.fromY;
    b.toX     = opts.toX;
    b.toY     = opts.toY;
    b.element = opts.element || 'arcane';
    b.duration = opts.duration || 0.4;
    b.elapsed  = 0;
    b.width    = opts.width || 4;
    b.alive    = true;
    beams.push(b);
    return b;
  }

  /**
   * Spawn chain lightning through a list of points.
   */
  function spawnChain(opts) {
    const c   = chainPool.acquire();
    c.points  = opts.points.slice();
    c.element = opts.element || 'lightning';
    c.duration = opts.duration || 0.35;
    c.elapsed  = 0;
    c.alive    = true;
    c.segments = buildJaggedSegments(c.points);
    chains.push(c);
    return c;
  }

  /**
   * Spawn an explosion at a point.
   */
  function spawnExplosion(opts) {
    const e   = explosionPool.acquire();
    e.x       = opts.x;
    e.y       = opts.y;
    e.radius  = opts.radius || 40;
    e.element = opts.element || 'fire';
    e.duration = opts.duration || 0.4;
    e.elapsed  = 0;
    e.alive    = true;
    explosions.push(e);

    // Burst of particles
    const pal = palette(e.element);
    spawnParticles({
      x: e.x, y: e.y,
      count: randInt(15, 25),
      color: pal.particle,
      size: rand(2, 5),
      speed: rand(80, 200),
      lifetime: rand(0.3, 0.6),
      gravity: 60,
      spread: TAU
    });

    return e;
  }

  /**
   * Spawn generic particles.
   */
  function spawnParticles(opts) {
    const count  = opts.count || 10;
    const rgb    = hexRGB(opts.color || '#ffffff');
    const spread = opts.spread !== undefined ? opts.spread : TAU;
    const baseAngle = opts.baseAngle !== undefined ? opts.baseAngle : 0;

    for (let i = 0; i < count; i++) {
      if (particles.length >= MAX_PARTICLES) {
        // Remove oldest particle and return it to pool
        particlePool.release(particles.shift());
      }
      const p = particlePool.acquire();
      p.x = opts.x + rand(-2, 2);
      p.y = opts.y + rand(-2, 2);
      const angle = baseAngle + rand(-spread / 2, spread / 2);
      const spd   = (opts.speed || 60) * rand(0.6, 1.4);
      p.vx = Math.cos(angle) * spd;
      p.vy = Math.sin(angle) * spd;
      p.life    = 0;
      p.maxLife = (opts.lifetime || 0.6) * rand(0.7, 1.3);
      p.size    = (opts.size || 3) * rand(0.7, 1.3);
      p.r = rgb[0]; p.g = rgb[1]; p.b = rgb[2];
      p.gravity = opts.gravity || 0;
      particles.push(p);
    }
  }

  /**
   * Spawn a floating damage number.
   */
  function spawnDamageNumber(opts) {
    const d   = dmgPool.acquire();
    d.x       = opts.x + rand(-8, 8);
    d.y       = opts.y + rand(-4, 4);
    d.amount  = opts.amount || 0;
    d.color   = opts.color || '#ffffff';
    d.isCrit  = !!opts.isCrit;
    d.elapsed = 0;
    d.alive   = true;
    d.scale   = d.isCrit ? 1.6 : 1;
    dmgNumbers.push(d);
    return d;
  }

  /**
   * Spawn a pulsing aura on the ground.
   */
  function spawnAura(opts) {
    const a    = auraPool.acquire();
    a.x        = opts.x;
    a.y        = opts.y;
    a.radius   = opts.radius || 60;
    a.element  = opts.element || 'nature';
    a.duration = opts.duration || 3;
    a.elapsed  = 0;
    a.pulseSpeed = opts.pulseSpeed || 2;
    a.alive    = true;
    auras.push(a);
    return a;
  }

  /**
   * Spawn a persistent ground zone (lava, frost, void).
   */
  function spawnGroundEffect(opts) {
    const g    = groundPool.acquire();
    g.x        = opts.x;
    g.y        = opts.y;
    g.radius   = opts.radius || 50;
    g.element  = opts.element || 'fire';
    g.duration = opts.duration || 3;
    g.elapsed  = 0;
    g.dps      = opts.dps || 0;
    g.type     = opts.type || 'lava';
    g.alive    = true;
    groundFX.push(g);
    return g;
  }

  /**
   * Quick ring burst when a tower is placed.
   */
  function spawnPlaceEffect(opts) {
    const p   = placePool.acquire();
    p.x       = opts.x;
    p.y       = opts.y;
    p.element = opts.element || 'physical';
    p.elapsed = 0;
    p.duration = 0.6;
    p.alive   = true;
    placeFX.push(p);

    // Ring of particles
    const pal = palette(p.element);
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * TAU;
      spawnParticles({
        x: p.x, y: p.y, count: 1,
        color: pal.particle,
        size: rand(2, 4), speed: rand(60, 120),
        lifetime: rand(0.4, 0.7), gravity: 0,
        spread: 0.2, baseAngle: angle
      });
    }

    // Rising sparkles
    spawnParticles({
      x: p.x, y: p.y, count: 12,
      color: pal.secondary,
      size: rand(1, 3), speed: rand(30, 60),
      lifetime: rand(0.5, 0.9), gravity: -40,
      spread: 0.6, baseAngle: -Math.PI / 2
    });

    return p;
  }

  /**
   * Death burst for an enemy.
   * Returns { shakeAmount } so the engine can apply screen shake if desired.
   */
  function spawnDeathEffect(opts) {
    const d   = deathPool.acquire();
    d.x       = opts.x;
    d.y       = opts.y;
    d.size    = opts.size || 16;
    d.color   = opts.color || '#ffffff';
    d.elapsed = 0;
    d.duration = 0.4;
    d.alive   = true;
    deathFX.push(d);

    // Outward particle ring
    const rgb = hexRGB(d.color);
    const particleColor = '#' +
      clamp(rgb[0] + 60, 0, 255).toString(16).padStart(2, '0') +
      clamp(rgb[1] + 60, 0, 255).toString(16).padStart(2, '0') +
      clamp(rgb[2] + 60, 0, 255).toString(16).padStart(2, '0');

    spawnParticles({
      x: d.x, y: d.y,
      count: randInt(12, 20),
      color: particleColor,
      size: rand(2, 4), speed: rand(80, 180),
      lifetime: rand(0.3, 0.5), gravity: 40,
      spread: TAU
    });

    return { shakeAmount: clamp(d.size / 16, 1, 4) };
  }

  // -----------------------------------------------------------------------
  //  Lightning / jagged line helpers
  // -----------------------------------------------------------------------

  /**
   * Build jagged polyline segments between consecutive chain points.
   * Each segment is an array of {x, y} jitter points.
   */
  function buildJaggedSegments(points) {
    const segs = [];
    for (let i = 0; i < points.length - 1; i++) {
      segs.push(buildJaggedLine(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y));
    }
    return segs;
  }

  /**
   * Generate a jagged lightning line between two points.
   * Returns array of {x, y}.
   */
  function buildJaggedLine(x1, y1, x2, y2) {
    const pts  = [{ x: x1, y: y1 }];
    const segs = randInt(4, 8);
    const dx   = x2 - x1, dy = y2 - y1;
    const len  = Math.sqrt(dx * dx + dy * dy) || 1;
    // Normal direction for displacement
    const nx = -dy / len, ny = dx / len;
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      const jitter = rand(-len * 0.15, len * 0.15);
      pts.push({
        x: lerp(x1, x2, t) + nx * jitter,
        y: lerp(y1, y2, t) + ny * jitter
      });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  // -----------------------------------------------------------------------
  //  Update all effects
  // -----------------------------------------------------------------------

  function updateAll(dt) {
    updateProjectiles(dt);
    updateBeams(dt);
    updateChains(dt);
    updateExplosions(dt);
    updateParticles(dt);
    updateDamageNumbers(dt);
    updateAuras(dt);
    updateGroundFX(dt);
    updatePlaceFX(dt);
    updateDeathFX(dt);
  }

  function updateProjectiles(dt) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.age += dt;

      // Store trail position (keep last 6 positions)
      if (p.trail.length >= 6) p.trail.shift();
      p.trail.push({ x: p.x, y: p.y });

      // Move
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Spawn trailing particle
      if (Math.random() < 0.7) {
        const pal = palette(p.element);
        spawnParticles({
          x: p.x, y: p.y, count: 1,
          color: pal.particle,
          size: rand(1, 3), speed: rand(10, 30),
          lifetime: rand(0.15, 0.3), gravity: 0,
          spread: TAU
        });
      }

      // Kill if too old (off-screen / missed)
      if (p.age > 5) {
        projectiles.splice(i, 1);
        projectilePool.release(p);
      }
    }
  }

  /**
   * External call: let the game engine update projectile homing each frame.
   * `getTarget(id)` should return {x, y} or null.
   */
  function updateProjectileHoming(getTarget) {
    for (let i = 0; i < projectiles.length; i++) {
      const p = projectiles[i];
      if (!p.targetId) continue;
      const t = getTarget(p.targetId);
      if (!t) { p.targetId = null; continue; } // target dead — keep flying straight
      const dx = t.x - p.x, dy = t.y - p.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      p.vx = (dx / d) * p.speed;
      p.vy = (dy / d) * p.speed;
    }
  }

  function updateBeams(dt) {
    for (let i = beams.length - 1; i >= 0; i--) {
      const b = beams[i];
      b.elapsed += dt;
      if (b.elapsed >= b.duration) {
        beams.splice(i, 1);
        beamPool.release(b);
      }
    }
  }

  function updateChains(dt) {
    for (let i = chains.length - 1; i >= 0; i--) {
      const c = chains[i];
      c.elapsed += dt;
      // Re-jitter every ~0.06s
      if (Math.floor(c.elapsed / 0.06) !== Math.floor((c.elapsed - dt) / 0.06)) {
        c.segments = buildJaggedSegments(c.points);
      }
      if (c.elapsed >= c.duration) {
        chains.splice(i, 1);
        chainPool.release(c);
      }
    }
  }

  function updateExplosions(dt) {
    for (let i = explosions.length - 1; i >= 0; i--) {
      const e = explosions[i];
      e.elapsed += dt;
      if (e.elapsed >= e.duration) {
        explosions.splice(i, 1);
        explosionPool.release(e);
      }
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
        particlePool.release(p);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x  += p.vx * dt;
      p.y  += p.vy * dt;
      // Gentle slow-down
      p.vx *= 0.98;
      p.vy *= 0.98;
    }
  }

  function updateDamageNumbers(dt) {
    for (let i = dmgNumbers.length - 1; i >= 0; i--) {
      const d = dmgNumbers[i];
      d.elapsed += dt;
      d.y -= 40 * dt; // float up
      if (d.isCrit && d.elapsed < 0.15) {
        // Scale-up pop for crits
        d.scale = lerp(1.6, 1.2, d.elapsed / 0.15);
      }
      if (d.elapsed >= 1) {
        dmgNumbers.splice(i, 1);
        dmgPool.release(d);
      }
    }
  }

  function updateAuras(dt) {
    for (let i = auras.length - 1; i >= 0; i--) {
      const a = auras[i];
      a.elapsed += dt;
      if (a.elapsed >= a.duration) {
        auras.splice(i, 1);
        auraPool.release(a);
      }
    }
  }

  function updateGroundFX(dt) {
    for (let i = groundFX.length - 1; i >= 0; i--) {
      const g = groundFX[i];
      g.elapsed += dt;
      if (g.elapsed >= g.duration) {
        groundFX.splice(i, 1);
        groundPool.release(g);
      }
    }
  }

  function updatePlaceFX(dt) {
    for (let i = placeFX.length - 1; i >= 0; i--) {
      const p = placeFX[i];
      p.elapsed += dt;
      if (p.elapsed >= p.duration) {
        placeFX.splice(i, 1);
        placePool.release(p);
      }
    }
  }

  function updateDeathFX(dt) {
    for (let i = deathFX.length - 1; i >= 0; i--) {
      const d = deathFX[i];
      d.elapsed += dt;
      if (d.elapsed >= d.duration) {
        deathFX.splice(i, 1);
        deathPool.release(d);
      }
    }
  }

  // -----------------------------------------------------------------------
  //  Collision: projectile-enemy hits
  // -----------------------------------------------------------------------

  /**
   * Check active projectiles against an array of enemies.
   * Each enemy must have: { id, x, y, radius (hitbox) }
   * Returns array of { projectile, enemy, damage }.
   */
  function checkProjectileHits(enemies) {
    const hits = [];
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      for (let j = 0; j < enemies.length; j++) {
        const e = enemies[j];
        const hr = p.hitRadius + (e.radius || 12);
        if (dist2(p.x, p.y, e.x, e.y) <= hr * hr) {
          hits.push({ projectile: p, enemy: e, damage: p.damage });

          // Spawn small impact
          const pal = palette(p.element);
          spawnParticles({
            x: p.x, y: p.y, count: randInt(4, 8),
            color: pal.particle, size: rand(2, 4),
            speed: rand(40, 100), lifetime: rand(0.15, 0.3),
            gravity: 30, spread: TAU
          });

          if (p.onHit) p.onHit(e);

          if (p.pierce > 0) {
            p.pierce--;
          } else {
            projectiles.splice(i, 1);
            projectilePool.release(p);
            break; // This projectile is done
          }
        }
      }
    }
    return hits;
  }

  // -----------------------------------------------------------------------
  //  Draw: below layer (ground effects, auras)
  // -----------------------------------------------------------------------

  function drawBelow(ctx, cam, time) {
    const ox = cam ? cam.x : 0;
    const oy = cam ? cam.y : 0;

    // --- Ground effects ---
    for (let i = 0; i < groundFX.length; i++) {
      const g = groundFX[i];
      if (!inView(cam, g.x, g.y, g.radius)) continue;
      drawGroundEffect(ctx, g, ox, oy, time);
    }

    // --- Auras ---
    for (let i = 0; i < auras.length; i++) {
      const a = auras[i];
      if (!inView(cam, a.x, a.y, a.radius)) continue;
      drawAura(ctx, a, ox, oy, time);
    }

    // --- Place effects (expanding ring on ground) ---
    for (let i = 0; i < placeFX.length; i++) {
      const p = placeFX[i];
      if (!inView(cam, p.x, p.y, 60)) continue;
      drawPlaceEffect(ctx, p, ox, oy);
    }
  }

  // -----------------------------------------------------------------------
  //  Draw: above layer (projectiles, beams, chains, explosions, particles,
  //         damage numbers, death effects)
  // -----------------------------------------------------------------------

  function drawAbove(ctx, cam, time) {
    const ox = cam ? cam.x : 0;
    const oy = cam ? cam.y : 0;

    // --- Death flash ---
    for (let i = 0; i < deathFX.length; i++) {
      const d = deathFX[i];
      if (!inView(cam, d.x, d.y, d.size * 2)) continue;
      drawDeathEffect(ctx, d, ox, oy);
    }

    // --- Beams ---
    for (let i = 0; i < beams.length; i++) {
      drawBeamEffect(ctx, beams[i], ox, oy, time);
    }

    // --- Chain lightning ---
    for (let i = 0; i < chains.length; i++) {
      drawChainEffect(ctx, chains[i], ox, oy);
    }

    // --- Explosions ---
    for (let i = 0; i < explosions.length; i++) {
      const e = explosions[i];
      if (!inView(cam, e.x, e.y, e.radius)) continue;
      drawExplosion(ctx, e, ox, oy);
    }

    // --- Projectiles ---
    for (let i = 0; i < projectiles.length; i++) {
      const p = projectiles[i];
      if (!inView(cam, p.x, p.y, 30)) continue;
      drawProjectile(ctx, p, ox, oy, time);
    }

    // --- Particles (additive blending) ---
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!inView(cam, p.x, p.y, p.size)) continue;
      const t = p.life / p.maxLife;
      const alpha = 1 - t;
      const s = p.size * (1 - t * 0.4);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgb(' + p.r + ',' + p.g + ',' + p.b + ')';
      ctx.beginPath();
      ctx.arc(p.x - ox, p.y - oy, s, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    // --- Damage numbers (on top of everything) ---
    for (let i = 0; i < dmgNumbers.length; i++) {
      drawDamageNumber(ctx, dmgNumbers[i], ox, oy);
    }
  }

  // -----------------------------------------------------------------------
  //  Individual draw routines
  // -----------------------------------------------------------------------

  // -- Projectile -------------------------------------------------------

  function drawProjectile(ctx, p, ox, oy, time) {
    const pal = palette(p.element);
    const sx  = p.x - ox, sy = p.y - oy;

    ctx.save();

    // Trail (fading dots)
    for (let i = 0; i < p.trail.length; i++) {
      const t = i / p.trail.length;
      ctx.globalAlpha = t * 0.5;
      ctx.fillStyle = pal.particle;
      ctx.beginPath();
      ctx.arc(p.trail[i].x - ox, p.trail[i].y - oy, 2 + t * 2, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Glow
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur  = 12;

    // Element-specific visuals
    switch (p.element) {
      case 'fire':
        drawFireProjectile(ctx, sx, sy, time, pal);
        break;
      case 'ice':
        drawIceProjectile(ctx, sx, sy, time, pal);
        break;
      case 'lightning':
        drawLightningProjectile(ctx, sx, sy, time, pal);
        break;
      case 'earth':
        drawEarthProjectile(ctx, sx, sy, time, pal);
        break;
      case 'arcane':
        drawArcaneProjectile(ctx, sx, sy, time, pal);
        break;
      case 'nature':
        drawNatureProjectile(ctx, sx, sy, time, pal);
        break;
      case 'shadow':
        drawShadowProjectile(ctx, sx, sy, time, pal);
        break;
      case 'light':
        drawLightProjectile(ctx, sx, sy, time, pal);
        break;
      default:
        drawDefaultProjectile(ctx, sx, sy, pal);
        break;
    }

    ctx.restore();
  }

  /** Fire: flickering flame orb. */
  function drawFireProjectile(ctx, x, y, time, pal) {
    const flicker = Math.sin(time * 20) * 2;
    const r = 5 + flicker * 0.3;

    // Outer glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r + 4);
    grad.addColorStop(0, pal.secondary);
    grad.addColorStop(0.5, pal.primary);
    grad.addColorStop(1, 'rgba(255,68,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y - flicker, r + 4, 0, TAU);
    ctx.fill();

    // Bright core
    ctx.fillStyle = '#ffffaa';
    ctx.beginPath();
    ctx.arc(x, y - flicker * 0.5, 2.5, 0, TAU);
    ctx.fill();
  }

  /** Ice: spinning crystal shard. */
  function drawIceProjectile(ctx, x, y, time, pal) {
    ctx.translate(x, y);
    ctx.rotate(time * 6);

    // Diamond shape
    ctx.fillStyle = pal.primary;
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(4, 0);
    ctx.moveTo(0, 7);
    ctx.lineTo(-4, 0);
    ctx.closePath();
    ctx.fill();

    // Inner bright
    ctx.fillStyle = pal.secondary;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(2, 0);
    ctx.lineTo(0, 4);
    ctx.lineTo(-2, 0);
    ctx.closePath();
    ctx.fill();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** Lightning: small electric bolt. */
  function drawLightningProjectile(ctx, x, y, time, pal) {
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 16;
    ctx.shadowColor = pal.glow;

    // Small jagged line pointing in travel direction
    const pts = buildJaggedLine(x - 6, y, x + 6, y);
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();

    // Bright core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  /** Earth: tumbling rock. */
  function drawEarthProjectile(ctx, x, y, time, pal) {
    ctx.translate(x, y);
    ctx.rotate(time * 4);

    // Rough pentagon shape
    ctx.fillStyle = pal.primary;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU - Math.PI / 2;
      const r = 5 + (i % 2) * 1.5;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Dark lines for texture
    ctx.strokeStyle = pal.secondary;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, -3);
    ctx.lineTo(2, 2);
    ctx.moveTo(1, -2);
    ctx.lineTo(-1, 3);
    ctx.stroke();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** Arcane: spinning magic rune. */
  function drawArcaneProjectile(ctx, x, y, time, pal) {
    ctx.translate(x, y);
    const rot = time * 3;

    // Outer ring
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, TAU);
    ctx.stroke();

    // Inner star/rune marks
    ctx.rotate(rot);
    ctx.strokeStyle = pal.secondary;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * TAU;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 3, Math.sin(a) * 3);
      ctx.lineTo(Math.cos(a + Math.PI) * 3, Math.sin(a + Math.PI) * 3);
      ctx.stroke();
    }

    // Bright center dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, TAU);
    ctx.fill();

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** Nature: thorny vine ball. */
  function drawNatureProjectile(ctx, x, y, time, pal) {
    ctx.translate(x, y);
    ctx.rotate(time * 5);

    // Core
    ctx.fillStyle = pal.primary;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, TAU);
    ctx.fill();

    // Thorns
    ctx.fillStyle = pal.secondary;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * TAU;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(4, 0);
      ctx.lineTo(7, -1.5);
      ctx.lineTo(7, 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** Shadow: dark swirling orb. */
  function drawShadowProjectile(ctx, x, y, time, pal) {
    // Dark vortex
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 8);
    grad.addColorStop(0, '#110022');
    grad.addColorStop(0.5, pal.primary);
    grad.addColorStop(1, 'rgba(102,51,170,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, TAU);
    ctx.fill();

    // Swirling arcs
    ctx.strokeStyle = pal.particle;
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const a = time * 8 + (i / 3) * TAU;
      ctx.beginPath();
      ctx.arc(x, y, 4, a, a + 1.2);
      ctx.stroke();
    }
  }

  /** Light: radiant star. */
  function drawLightProjectile(ctx, x, y, time, pal) {
    const pulse = 1 + Math.sin(time * 12) * 0.15;

    // Outer glow
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 10 * pulse);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, pal.primary);
    grad.addColorStop(1, 'rgba(255,221,136,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 10 * pulse, 0, TAU);
    ctx.fill();

    // Star points
    ctx.fillStyle = '#ffffff';
    ctx.translate(x, y);
    ctx.rotate(time * 2);
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.rotate((i / 4) * TAU);
      ctx.beginPath();
      ctx.moveTo(0, -6 * pulse);
      ctx.lineTo(-1.5, 0);
      ctx.lineTo(0, 6 * pulse);
      ctx.lineTo(1.5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /** Default / physical: plain glowing orb. */
  function drawDefaultProjectile(ctx, x, y, pal) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, 6);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, pal.primary);
    grad.addColorStop(1, 'rgba(200,200,200,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, TAU);
    ctx.fill();
  }

  // -- Beam --------------------------------------------------------------

  function drawBeamEffect(ctx, b, ox, oy, time) {
    const t = b.elapsed / b.duration;
    const alpha = t < 0.1 ? t / 0.1 : 1 - ((t - 0.1) / 0.9);  // Fade in then out
    const pal = palette(b.element);
    const x1 = b.fromX - ox, y1 = b.fromY - oy;
    const x2 = b.toX - ox,   y2 = b.toY - oy;

    // Wobble offset perpendicular to beam
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len, ny = dx / len;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Outer glow pass
    const pulseW = b.width * (1 + Math.sin(time * 16) * 0.2);

    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = pal.glow;
    ctx.lineWidth = pulseW + 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    // Slight sinusoidal wobble along beam
    const mid1x = lerp(x1, x2, 0.33) + nx * Math.sin(time * 14) * 3;
    const mid1y = lerp(y1, y2, 0.33) + ny * Math.sin(time * 14) * 3;
    const mid2x = lerp(x1, x2, 0.66) + nx * Math.sin(time * 14 + 2) * 3;
    const mid2y = lerp(y1, y2, 0.66) + ny * Math.sin(time * 14 + 2) * 3;
    ctx.bezierCurveTo(mid1x, mid1y, mid2x, mid2y, x2, y2);
    ctx.stroke();

    // Bright core
    ctx.shadowBlur = 8;
    ctx.strokeStyle = pal.secondary;
    ctx.lineWidth = pulseW;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(mid1x, mid1y, mid2x, mid2y, x2, y2);
    ctx.stroke();

    // Inner white core
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(1, pulseW * 0.3);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(mid1x, mid1y, mid2x, mid2y, x2, y2);
    ctx.stroke();

    // Particles along beam (arcane rune symbols as small dots along length)
    if (b.element === 'arcane') {
      ctx.fillStyle = pal.particle;
      for (let i = 0; i < 5; i++) {
        const st = (i + time * 3) % 1;
        const px = lerp(x1, x2, st) + nx * Math.sin(st * 10 + time * 8) * 4;
        const py = lerp(y1, y2, st) + ny * Math.sin(st * 10 + time * 8) * 4;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, TAU);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // -- Chain lightning ----------------------------------------------------

  function drawChainEffect(ctx, c, ox, oy) {
    const t = c.elapsed / c.duration;
    const alpha = t < 0.15 ? t / 0.15 : 1 - ((t - 0.15) / 0.85);
    const pal = palette(c.element);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let s = 0; s < c.segments.length; s++) {
      const seg = c.segments[s];
      if (seg.length < 2) continue;

      // Wide glow
      ctx.shadowColor = pal.glow;
      ctx.shadowBlur = 18;
      ctx.strokeStyle = pal.glow;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(seg[0].x - ox, seg[0].y - oy);
      for (let j = 1; j < seg.length; j++) ctx.lineTo(seg[j].x - ox, seg[j].y - oy);
      ctx.stroke();

      // Core bright
      ctx.shadowBlur = 6;
      ctx.strokeStyle = pal.primary;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(seg[0].x - ox, seg[0].y - oy);
      for (let j = 1; j < seg.length; j++) ctx.lineTo(seg[j].x - ox, seg[j].y - oy);
      ctx.stroke();

      // Inner white
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(seg[0].x - ox, seg[0].y - oy);
      for (let j = 1; j < seg.length; j++) ctx.lineTo(seg[j].x - ox, seg[j].y - oy);
      ctx.stroke();
    }

    ctx.restore();
  }

  // -- Explosion ---------------------------------------------------------

  function drawExplosion(ctx, e, ox, oy) {
    const t = e.elapsed / e.duration;
    const pal = palette(e.element);
    const sx = e.x - ox, sy = e.y - oy;

    ctx.save();

    // Expanding shockwave ring
    const ringRadius = e.radius * t;
    const ringAlpha  = 1 - t;
    ctx.globalAlpha = ringAlpha * 0.7;
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth   = 3 * (1 - t);
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur  = 15;
    ctx.beginPath();
    ctx.arc(sx, sy, ringRadius, 0, TAU);
    ctx.stroke();

    // Inner flash (bright at start, fades quickly)
    if (t < 0.3) {
      const flashAlpha = 1 - (t / 0.3);
      const flashR = e.radius * 0.4 * (1 - t);
      ctx.globalAlpha = flashAlpha * 0.9;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, flashR);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, pal.secondary);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, flashR, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  }

  // -- Damage number -----------------------------------------------------

  function drawDamageNumber(ctx, d, ox, oy) {
    const t = d.elapsed / 1;  // 1-second total lifetime
    const alpha = t < 0.2 ? 1 : 1 - ((t - 0.2) / 0.8);
    const sx = d.x - ox, sy = d.y - oy;

    ctx.save();
    ctx.globalAlpha = alpha;

    const fontSize = Math.round(14 * d.scale);
    ctx.font = 'bold ' + fontSize + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = d.isCrit
      ? Math.round(d.amount) + '!'
      : String(Math.round(d.amount));

    // Dark outline for readability (stroke behind fill)
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, sx, sy);

    // Fill color
    ctx.fillStyle = d.isCrit ? '#ffdd44' : d.color;
    ctx.fillText(text, sx, sy);

    ctx.restore();
  }

  // -- Aura (below layer) ------------------------------------------------

  function drawAura(ctx, a, ox, oy, time) {
    const t = a.elapsed / a.duration;
    const pal = palette(a.element);
    const sx = a.x - ox, sy = a.y - oy;

    // Fade in/out at edges of lifetime
    let alpha;
    if (t < 0.1) alpha = t / 0.1;
    else if (t > 0.85) alpha = (1 - t) / 0.15;
    else alpha = 1;
    alpha *= 0.35;

    const pulse = 1 + Math.sin(time * a.pulseSpeed * TAU) * 0.06;
    const r = a.radius * pulse;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Filled translucent circle
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
    grad.addColorStop(0, pal.glow);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, TAU);
    ctx.fill();

    // Border ring
    ctx.globalAlpha = alpha * 2;
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  // -- Ground effects (below layer) --------------------------------------

  function drawGroundEffect(ctx, g, ox, oy, time) {
    const t = g.elapsed / g.duration;
    const sx = g.x - ox, sy = g.y - oy;

    // Fade in first 15%, fade out last 15%
    let alpha;
    if (t < 0.15) alpha = t / 0.15;
    else if (t > 0.85) alpha = (1 - t) / 0.15;
    else alpha = 1;
    alpha *= 0.6;

    ctx.save();
    ctx.globalAlpha = alpha;

    switch (g.type) {
      case 'lava':
        drawLavaGround(ctx, sx, sy, g.radius, time);
        break;
      case 'frost':
        drawFrostGround(ctx, sx, sy, g.radius, time);
        break;
      case 'void':
        drawVoidGround(ctx, sx, sy, g.radius, time);
        break;
      default:
        // Generic colored circle
        ctx.fillStyle = palette(g.element).glow;
        ctx.beginPath();
        ctx.arc(sx, sy, g.radius, 0, TAU);
        ctx.fill();
        break;
    }

    ctx.restore();
  }

  /** Lava ground: orange-red bubbling circles. */
  function drawLavaGround(ctx, x, y, radius, time) {
    // Base circle
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(255,100,20,0.5)');
    grad.addColorStop(0.6, 'rgba(200,50,0,0.35)');
    grad.addColorStop(1, 'rgba(100,20,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();

    // Bubbles — deterministic positions based on time, cycling
    ctx.fillStyle = 'rgba(255,180,40,0.6)';
    for (let i = 0; i < 8; i++) {
      const seed = i * 137.508; // golden angle offset
      const phase = (time * 0.8 + seed) % 3;
      const bx = x + Math.cos(seed) * radius * 0.55;
      const by = y + Math.sin(seed) * radius * 0.55;
      const bSize = (Math.sin(phase * TAU / 3) * 0.5 + 0.5) * 4 + 1;
      ctx.beginPath();
      ctx.arc(bx, by, bSize, 0, TAU);
      ctx.fill();
    }

    // Border ring
    ctx.strokeStyle = 'rgba(255,68,0,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.stroke();
  }

  /** Frost ground: white-blue crystalline pattern. */
  function drawFrostGround(ctx, x, y, radius, time) {
    // Base circle
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(180,230,255,0.45)');
    grad.addColorStop(0.7, 'rgba(100,200,255,0.25)');
    grad.addColorStop(1, 'rgba(68,204,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();

    // Crystal lines radiating from center
    ctx.strokeStyle = 'rgba(200,240,255,0.5)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU + time * 0.2;
      const len = radius * (0.5 + Math.sin(time * 2 + i) * 0.15);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      // Branch tips
      const bx = x + Math.cos(a) * len;
      const by = y + Math.sin(a) * len;
      ctx.lineTo(bx + Math.cos(a + 0.5) * len * 0.25, by + Math.sin(a + 0.5) * len * 0.25);
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(a - 0.5) * len * 0.25, by + Math.sin(a - 0.5) * len * 0.25);
      ctx.stroke();
    }

    // Rim
    ctx.strokeStyle = 'rgba(150,220,255,0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.stroke();
  }

  /** Void ground: dark purple swirling vortex. */
  function drawVoidGround(ctx, x, y, radius, time) {
    // Dark base
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(30,0,60,0.6)');
    grad.addColorStop(0.5, 'rgba(80,30,140,0.35)');
    grad.addColorStop(1, 'rgba(60,20,100,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fill();

    // Swirling arcs
    ctx.strokeStyle = 'rgba(140,60,220,0.5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const a = time * 2 + (i / 4) * TAU;
      const r1 = radius * 0.2;
      const r2 = radius * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, lerp(r1, r2, 0.5), a, a + 1.5);
      ctx.stroke();
    }

    // Inner bright speck
    ctx.fillStyle = 'rgba(180,100,255,0.4)';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, TAU);
    ctx.fill();

    // Rim
    ctx.strokeStyle = 'rgba(100,50,170,0.4)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // -- Place effect (below layer) ----------------------------------------

  function drawPlaceEffect(ctx, p, ox, oy) {
    const t = p.elapsed / p.duration;
    const pal = palette(p.element);
    const sx = p.x - ox, sy = p.y - oy;

    if (t >= 1) return;

    const alpha = 1 - t;
    const ringR = 20 + t * 30;

    ctx.save();
    ctx.globalAlpha = alpha * 0.6;
    ctx.strokeStyle = pal.primary;
    ctx.lineWidth = 2 * (1 - t);
    ctx.shadowColor = pal.glow;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(sx, sy, ringR, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  // -- Death effect (above layer) ----------------------------------------

  function drawDeathEffect(ctx, d, ox, oy) {
    const t = d.elapsed / d.duration;
    const sx = d.x - ox, sy = d.y - oy;

    if (t >= 1) return;

    ctx.save();

    // Bright flash (first half)
    if (t < 0.5) {
      const flashAlpha = 1 - (t / 0.5);
      const flashR = d.size * (0.5 + t * 2);
      ctx.globalAlpha = flashAlpha * 0.7;
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, flashR);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, d.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, flashR, 0, TAU);
      ctx.fill();
    }

    // Expanding ring
    const ringR = d.size * t * 2;
    ctx.globalAlpha = (1 - t) * 0.5;
    ctx.strokeStyle = d.color;
    ctx.lineWidth = 2 * (1 - t);
    ctx.beginPath();
    ctx.arc(sx, sy, ringR, 0, TAU);
    ctx.stroke();

    ctx.restore();
  }

  // -----------------------------------------------------------------------
  //  Clear all effects
  // -----------------------------------------------------------------------

  function clear() {
    let i;
    for (i = projectiles.length - 1; i >= 0; i--) projectilePool.release(projectiles[i]);
    for (i = beams.length - 1; i >= 0; i--)       beamPool.release(beams[i]);
    for (i = chains.length - 1; i >= 0; i--)       chainPool.release(chains[i]);
    for (i = explosions.length - 1; i >= 0; i--)   explosionPool.release(explosions[i]);
    for (i = particles.length - 1; i >= 0; i--)    particlePool.release(particles[i]);
    for (i = dmgNumbers.length - 1; i >= 0; i--)   dmgPool.release(dmgNumbers[i]);
    for (i = auras.length - 1; i >= 0; i--)        auraPool.release(auras[i]);
    for (i = groundFX.length - 1; i >= 0; i--)     groundPool.release(groundFX[i]);
    for (i = placeFX.length - 1; i >= 0; i--)      placePool.release(placeFX[i]);
    for (i = deathFX.length - 1; i >= 0; i--)      deathPool.release(deathFX[i]);

    projectiles.length = 0;
    beams.length       = 0;
    chains.length      = 0;
    explosions.length  = 0;
    particles.length   = 0;
    dmgNumbers.length  = 0;
    auras.length       = 0;
    groundFX.length    = 0;
    placeFX.length     = 0;
    deathFX.length     = 0;
  }

  // -----------------------------------------------------------------------
  //  Public API
  // -----------------------------------------------------------------------

  window.ArcaneFX = {
    PALETTES: PALETTES,

    // Spawn effects
    spawnProjectile:    spawnProjectile,
    spawnBeam:          spawnBeam,
    spawnChain:         spawnChain,
    spawnExplosion:     spawnExplosion,
    spawnParticles:     spawnParticles,
    spawnDamageNumber:  spawnDamageNumber,
    spawnAura:          spawnAura,
    spawnGroundEffect:  spawnGroundEffect,
    spawnPlaceEffect:   spawnPlaceEffect,
    spawnDeathEffect:   spawnDeathEffect,

    // Per-frame
    updateAll:                updateAll,
    updateProjectileHoming:   updateProjectileHoming,
    checkProjectileHits:      checkProjectileHits,
    drawBelow:                drawBelow,
    drawAbove:                drawAbove,

    // Lifecycle
    clear: clear,

    // Diagnostics
    get activeCount() {
      return projectiles.length + beams.length + chains.length +
             explosions.length + particles.length + dmgNumbers.length +
             auras.length + groundFX.length + placeFX.length + deathFX.length;
    }
  };
})();
