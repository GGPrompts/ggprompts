/**
 * Arcane Bastion - Tower Defense
 * towers.js — Tower types, upgrades, synergies, targeting AI
 *
 * Exports: window.ArcaneTowers
 */
(function () {
  'use strict';

  let _uid = 1;

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function hexToRgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgba(r, g, b, a) {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function rgbaHex(hex, a) {
    const c = hexToRgb(hex);
    return rgba(c[0], c[1], c[2], a);
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  // ---------------------------------------------------------------------------
  // Shared Drawing Helpers
  // ---------------------------------------------------------------------------

  function drawGlow(ctx, x, y, radius, color) {
    ctx.save();
    ctx.shadowBlur = radius;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function drawBase(ctx, x, y, size, color, tier) {
    var r = size * 0.38;
    var grad = ctx.createRadialGradient(x, y + size * 0.1, 0, x, y + size * 0.1, r);
    grad.addColorStop(0, rgbaHex(color, 0.3));
    grad.addColorStop(1, rgbaHex(color, 0.05));
    ctx.beginPath();
    ctx.ellipse(x, y + size * 0.18, r, r * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    if (tier >= 2) {
      ctx.strokeStyle = rgbaHex(color, 0.5);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawTierOrbs(ctx, x, y, size, tier, color, time) {
    if (tier < 2) return;
    var count = tier === 2 ? 2 : 3;
    var orbitR = size * 0.32;
    for (var i = 0; i < count; i++) {
      var a = time * 1.5 + (i / count) * Math.PI * 2;
      var ox = x + Math.cos(a) * orbitR;
      var oy = y - size * 0.05 + Math.sin(a) * orbitR * 0.4;
      ctx.beginPath();
      ctx.arc(ox, oy, 2, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 4;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // ---------------------------------------------------------------------------
  // TOWER TYPE DEFINITIONS
  // ---------------------------------------------------------------------------

  var TYPES = {};

  // ---- 1. FIRE — Inferno Spire ----
  TYPES.fire = {
    id: 'fire',
    name: 'Inferno Spire',
    element: 'fire',
    color: '#ff4422',
    glowColor: 'rgba(255,68,34,0.6)',
    cost: 100,
    damage: 18,
    attackSpeed: 1.2,
    range: 3,
    projectileSpeed: 280,
    attackType: 'projectile',
    burnDPS: 5,
    burnDuration: 3,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#ff4422', tier);
      var h = size * (0.5 + tier * 0.06);
      var w = size * 0.18;
      var topY = y - h * 0.55;
      // Stone base
      ctx.beginPath();
      ctx.moveTo(x - w * 1.3, y + size * 0.12);
      ctx.lineTo(x - w * 0.6, topY + h * 0.3);
      ctx.lineTo(x + w * 0.6, topY + h * 0.3);
      ctx.lineTo(x + w * 1.3, y + size * 0.12);
      ctx.closePath();
      var sg = ctx.createLinearGradient(x - w, y, x + w, topY);
      sg.addColorStop(0, '#553322');
      sg.addColorStop(1, '#884433');
      ctx.fillStyle = sg;
      ctx.fill();
      // Flame
      var flicker = Math.sin(time * 8) * 0.08 + Math.sin(time * 13) * 0.05;
      var fh = h * (0.45 + tier * 0.05 + flicker);
      var fw = w * (1.2 + Math.sin(time * 6) * 0.15);
      var fy = topY + h * 0.15;
      var fg = ctx.createRadialGradient(x, fy, 0, x, fy, fh);
      fg.addColorStop(0, '#ffffff');
      fg.addColorStop(0.2, '#ffdd44');
      fg.addColorStop(0.5, '#ff6622');
      fg.addColorStop(1, 'rgba(255,34,0,0)');
      ctx.save();
      ctx.shadowBlur = 12 + tier * 4;
      ctx.shadowColor = 'rgba(255,100,0,0.8)';
      ctx.beginPath();
      ctx.moveTo(x - fw, fy + fh * 0.3);
      ctx.quadraticCurveTo(x - fw * 0.5, fy - fh * 0.2, x, fy - fh);
      ctx.quadraticCurveTo(x + fw * 0.5, fy - fh * 0.2, x + fw, fy + fh * 0.3);
      ctx.closePath();
      ctx.fillStyle = fg;
      ctx.fill();
      ctx.restore();
      // Inner flame
      var ifw = fw * 0.5;
      var ifh = fh * 0.6;
      ctx.beginPath();
      ctx.moveTo(x - ifw, fy + ifh * 0.2);
      ctx.quadraticCurveTo(x, fy - ifh, x + ifw, fy + ifh * 0.2);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,200,0.7)';
      ctx.fill();
      // Idle: rising ember particles
      for (var em = 0; em < 4; em++) {
        var et = (time * 1.5 + em * 0.7) % 1.0;
        var epx = x + Math.sin(time * 3 + em * 2.3) * size * 0.12;
        var epy = topY - et * size * 0.35;
        var ea = 1 - et;
        ctx.beginPath();
        ctx.arc(epx, epy, 1.5 * ea + 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,' + Math.floor(150 + 105 * ea) + ',0,' + (ea * 0.7) + ')';
        ctx.fill();
      }
      drawTierOrbs(ctx, x, y, size, tier, '#ff8844', time);
    },
    ability: { name: 'Eruption', manaCost: 10, cooldown: 8, description: 'AoE burst dealing 3x damage in radius 2. Enemies hit get burn DoT.' },
    drawProjectile: function (ctx, x, y, angle, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 6);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.4, '#ffaa22');
      g.addColorStop(1, 'rgba(255,68,0,0)');
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff4400';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      // Trail
      ctx.beginPath();
      ctx.moveTo(-8, -2);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-8, 2);
      ctx.fillStyle = 'rgba(255,100,0,0.4)';
      ctx.fill();
      ctx.restore();
    }
  };

  // ---- 2. ICE — Frost Pillar ----
  TYPES.ice = {
    id: 'ice',
    name: 'Frost Pillar',
    element: 'ice',
    color: '#44ccff',
    glowColor: 'rgba(68,204,255,0.5)',
    cost: 80,
    damage: 12,
    attackSpeed: 1.0,
    range: 3.5,
    projectileSpeed: 240,
    attackType: 'projectile',
    ability: { name: 'Flash Freeze', manaCost: 12, cooldown: 10, description: 'All enemies in range instantly frozen for 2s.' },
    slowAmount: 0.4,
    slowDuration: 2.0,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#44ccff', tier);
      var h = size * (0.55 + tier * 0.05);
      var topY = y - h * 0.4;
      // Crystal pillar
      var cw = size * 0.12;
      var pulse = Math.sin(time * 3) * 0.1 + 0.9;
      ctx.save();
      ctx.shadowBlur = 8 + tier * 3;
      ctx.shadowColor = 'rgba(100,200,255,0.6)';
      // Main crystal
      var cg = ctx.createLinearGradient(x - cw, y, x + cw, topY);
      cg.addColorStop(0, '#88ddff');
      cg.addColorStop(0.5, '#ccf0ff');
      cg.addColorStop(1, '#ffffff');
      ctx.beginPath();
      ctx.moveTo(x - cw, y + size * 0.08);
      ctx.lineTo(x - cw * 0.4, topY);
      ctx.lineTo(x, topY - h * 0.15);
      ctx.lineTo(x + cw * 0.4, topY);
      ctx.lineTo(x + cw, y + size * 0.08);
      ctx.closePath();
      ctx.fillStyle = cg;
      ctx.globalAlpha = 0.85 * pulse;
      ctx.fill();
      ctx.globalAlpha = 1;
      // Side shards
      var shards = tier >= 2 ? 3 : 2;
      for (var i = 0; i < shards; i++) {
        var sa = -0.5 + i * (1.0 / (shards - 1));
        var sx = x + sa * size * 0.2;
        var sh = h * (0.3 + i * 0.05);
        var sw = cw * 0.5;
        ctx.beginPath();
        ctx.moveTo(sx - sw, y + size * 0.05);
        ctx.lineTo(sx, y - sh * 0.6 + Math.sin(time * 2 + i) * 2);
        ctx.lineTo(sx + sw, y + size * 0.05);
        ctx.closePath();
        ctx.fillStyle = 'rgba(180,230,255,' + (0.5 * pulse) + ')';
        ctx.fill();
      }
      ctx.restore();
      // Frost particles
      if (tier >= 2) {
        for (var p = 0; p < tier; p++) {
          var pa = time * 1.2 + p * 2.1;
          var px = x + Math.cos(pa) * size * 0.28;
          var py = y - size * 0.15 + Math.sin(pa * 1.5) * size * 0.2;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200,240,255,0.6)';
          ctx.fill();
        }
      }
      // Idle: orbiting ice crystal shards (3 small diamonds)
      for (var ic = 0; ic < 3; ic++) {
        var ia = time * 1.2 + ic * (Math.PI * 2 / 3);
        var ior = size * 0.3;
        var icx = x + Math.cos(ia) * ior;
        var icy = y - h * 0.2 + Math.sin(ia) * ior * 0.4;
        ctx.save();
        ctx.translate(icx, icy);
        ctx.rotate(ia);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.lineTo(2, 0);
        ctx.lineTo(0, 3);
        ctx.lineTo(-2, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(180,230,255,0.6)';
        ctx.fill();
        ctx.restore();
      }
      drawTierOrbs(ctx, x, y, size, tier, '#88eeff', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#44ccff';
      // Ice shard
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-2, -4);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-2, 4);
      ctx.closePath();
      ctx.fillStyle = '#ccf0ff';
      ctx.fill();
      ctx.strokeStyle = '#44ccff';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  };

  // ---- 3. LIGHTNING — Storm Conduit ----
  TYPES.lightning = {
    id: 'lightning',
    name: 'Storm Conduit',
    element: 'lightning',
    color: '#ffee44',
    glowColor: 'rgba(255,238,68,0.6)',
    cost: 120,
    damage: 22,
    attackSpeed: 0.8,
    range: 3,
    projectileSpeed: 0,
    attackType: 'chain',
    ability: { name: 'Overload', manaCost: 15, cooldown: 12, description: 'Chain to ALL enemies in range for full damage.' },
    chainCount: 3,
    chainDamageFalloff: 0.7,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#ffee44', tier);
      var h = size * (0.5 + tier * 0.06);
      var topY = y - h * 0.45;
      // Coil base column
      ctx.beginPath();
      ctx.moveTo(x - size * 0.1, y + size * 0.1);
      ctx.lineTo(x - size * 0.06, topY + h * 0.2);
      ctx.lineTo(x + size * 0.06, topY + h * 0.2);
      ctx.lineTo(x + size * 0.1, y + size * 0.1);
      ctx.closePath();
      ctx.fillStyle = '#666677';
      ctx.fill();
      // Coil rings
      var rings = 3 + tier;
      for (var i = 0; i < rings; i++) {
        var ry = y + size * 0.05 - (i / rings) * h * 0.6;
        var rw = size * 0.16 - i * 0.005;
        ctx.beginPath();
        ctx.ellipse(x, ry, rw, rw * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#aaaacc';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      // Tesla sphere at top
      var spark = Math.sin(time * 12) * 0.3 + 0.7;
      ctx.save();
      ctx.shadowBlur = 10 + tier * 5;
      ctx.shadowColor = 'rgba(255,255,100,' + spark + ')';
      var sg = ctx.createRadialGradient(x, topY, 0, x, topY, size * 0.12);
      sg.addColorStop(0, '#ffffff');
      sg.addColorStop(0.5, '#ffee44');
      sg.addColorStop(1, 'rgba(255,238,68,0)');
      ctx.beginPath();
      ctx.arc(x, topY, size * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = sg;
      ctx.fill();
      ctx.restore();
      // Lightning crackle lines
      var bolts = tier >= 2 ? 4 : 2;
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,150,' + (0.4 + spark * 0.4) + ')';
      ctx.lineWidth = 1;
      for (var b = 0; b < bolts; b++) {
        var ba = time * 5 + b * 1.57;
        var bx = x + Math.cos(ba) * size * 0.2;
        var by = topY + Math.sin(ba) * size * 0.15;
        ctx.beginPath();
        ctx.moveTo(x, topY);
        var mx = (x + bx) / 2 + (Math.random() - 0.5) * 4;
        var my = (topY + by) / 2 + (Math.random() - 0.5) * 4;
        ctx.lineTo(mx, my);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();
      // Idle: intermittent sparks between coil and ground (~every 2s)
      var sparkPhase = (time * 0.5) % 1.0;
      if (sparkPhase < 0.15) {
        var spAlpha = 1 - sparkPhase / 0.15;
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,100,' + (spAlpha * 0.8) + ')';
        ctx.lineWidth = 1.5;
        var sp1x = x + (Math.sin(time * 37) * 0.5) * size * 0.2;
        var sp1y = y - h * 0.1;
        var sp2x = x + (Math.cos(time * 23) * 0.5) * size * 0.25;
        var sp2y = y + size * 0.05;
        ctx.beginPath();
        ctx.moveTo(sp1x, sp1y);
        ctx.lineTo((sp1x + sp2x) / 2 + Math.sin(time * 50) * 4, (sp1y + sp2y) / 2);
        ctx.lineTo(sp2x, sp2y);
        ctx.stroke();
        ctx.restore();
      }
      drawTierOrbs(ctx, x, y, size, tier, '#ffff88', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      // Chain lightning doesn't use projectiles — drawn by engine
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#ffee44';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffff88';
      ctx.fill();
      ctx.restore();
    }
  };

  // ---- 4. EARTH — Stone Sentinel ----
  TYPES.earth = {
    id: 'earth',
    name: 'Stone Sentinel',
    element: 'earth',
    color: '#aa8844',
    glowColor: 'rgba(170,136,68,0.5)',
    cost: 90,
    damage: 25,
    attackSpeed: 0.7,
    range: 2.5,
    projectileSpeed: 200,
    attackType: 'aoe',
    ability: { name: 'Earthquake', manaCost: 12, cooldown: 10, description: 'Stun all enemies in radius 3 for 1.5s + 50% tower damage.' },
    splashRadius: 0.8,
    stunChance: 0.15,
    stunDuration: 0.8,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#aa8844', tier);
      // Idle: subtle ground vibration
      var quake = Math.sin(time * 7) * 0.6 + Math.sin(time * 13) * 0.3;
      y += quake;
      var h = size * (0.52 + tier * 0.05);
      var topY = y - h * 0.4;
      // Stone monolith
      var mw = size * 0.22;
      var mg = ctx.createLinearGradient(x - mw, y, x + mw * 0.5, topY);
      mg.addColorStop(0, '#776644');
      mg.addColorStop(0.3, '#998866');
      mg.addColorStop(0.7, '#bbaa88');
      mg.addColorStop(1, '#aa9977');
      ctx.beginPath();
      ctx.moveTo(x - mw, y + size * 0.1);
      ctx.lineTo(x - mw * 0.85, topY + h * 0.1);
      ctx.lineTo(x - mw * 0.3, topY - h * 0.05);
      ctx.lineTo(x + mw * 0.3, topY);
      ctx.lineTo(x + mw * 0.85, topY + h * 0.15);
      ctx.lineTo(x + mw, y + size * 0.1);
      ctx.closePath();
      ctx.fillStyle = mg;
      ctx.fill();
      ctx.strokeStyle = '#665533';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Carved runes (tier 2+)
      if (tier >= 2) {
        var glow = Math.sin(time * 2) * 0.3 + 0.7;
        ctx.save();
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255,200,80,' + glow + ')';
        ctx.strokeStyle = 'rgba(255,200,80,' + glow + ')';
        ctx.lineWidth = 1.5;
        // Horizontal rune lines
        for (var r = 0; r < tier; r++) {
          var ry = topY + h * 0.2 + r * size * 0.08;
          ctx.beginPath();
          ctx.moveTo(x - mw * 0.5, ry);
          ctx.lineTo(x + mw * 0.5, ry);
          ctx.stroke();
        }
        ctx.restore();
      }
      // Floating rock fragments (tier 3)
      if (tier >= 3) {
        for (var f = 0; f < 3; f++) {
          var fa = time * 1.0 + f * 2.09;
          var fx = x + Math.cos(fa) * size * 0.3;
          var fy = topY - size * 0.05 + Math.sin(fa * 0.7) * size * 0.08;
          ctx.beginPath();
          ctx.arc(fx, fy, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#998866';
          ctx.fill();
        }
      }
      // Idle: dust motes at base
      for (var dm = 0; dm < 3; dm++) {
        var dt2 = (time * 0.8 + dm * 1.1) % 1.5;
        var dma = Math.max(0, 1 - dt2 / 1.5);
        var dmx = x + Math.sin(time * 2 + dm * 2.5) * size * 0.25;
        var dmy = y + size * 0.1 - dt2 * size * 0.15;
        ctx.beginPath();
        ctx.arc(dmx, dmy, 1 + dma, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(170,136,68,' + (dma * 0.4) + ')';
        ctx.fill();
      }
      drawTierOrbs(ctx, x, y, size, tier, '#ccaa66', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + time * 5);
      ctx.fillStyle = '#998866';
      ctx.strokeStyle = '#665533';
      ctx.lineWidth = 1;
      // Jagged rock
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(2, -5);
      ctx.lineTo(-4, -3);
      ctx.lineTo(-6, 2);
      ctx.lineTo(-2, 5);
      ctx.lineTo(3, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  };

  // ---- 5. ARCANE — Arcane Obelisk ----
  TYPES.arcane = {
    id: 'arcane',
    name: 'Arcane Obelisk',
    element: 'arcane',
    color: '#bb44ff',
    glowColor: 'rgba(187,68,255,0.6)',
    cost: 150,
    damage: 35,
    attackSpeed: 0.6,
    range: 4,
    projectileSpeed: 0,
    attackType: 'beam',
    ability: { name: 'Disintegrate', manaCost: 20, cooldown: 15, description: 'Single target beam dealing 5x damage, ignores armor.' },
    armorPierce: 0.3,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#bb44ff', tier);
      var h = size * (0.55 + tier * 0.06);
      var topY = y - h * 0.5;
      var pulse = Math.sin(time * 2.5) * 0.15 + 0.85;
      // Floating crystal
      var floatY = topY + Math.sin(time * 1.8) * 3;
      ctx.save();
      ctx.shadowBlur = 14 + tier * 4;
      ctx.shadowColor = 'rgba(187,68,255,' + pulse + ')';
      // Energy column beneath crystal
      var eg = ctx.createLinearGradient(x, y + size * 0.05, x, floatY + size * 0.1);
      eg.addColorStop(0, 'rgba(187,68,255,0.1)');
      eg.addColorStop(0.5, 'rgba(187,68,255,' + (0.3 * pulse) + ')');
      eg.addColorStop(1, 'rgba(187,68,255,0.05)');
      ctx.beginPath();
      ctx.moveTo(x - size * 0.04, y + size * 0.05);
      ctx.lineTo(x - size * 0.02, floatY + size * 0.1);
      ctx.lineTo(x + size * 0.02, floatY + size * 0.1);
      ctx.lineTo(x + size * 0.04, y + size * 0.05);
      ctx.closePath();
      ctx.fillStyle = eg;
      ctx.fill();
      // Diamond crystal shape
      var cw = size * 0.14 + tier * 2;
      var ch = size * 0.22 + tier * 2;
      var cg = ctx.createLinearGradient(x - cw, floatY - ch, x + cw, floatY + ch);
      cg.addColorStop(0, '#dd88ff');
      cg.addColorStop(0.5, '#bb44ff');
      cg.addColorStop(1, '#8822cc');
      ctx.beginPath();
      ctx.moveTo(x, floatY - ch);
      ctx.lineTo(x + cw, floatY);
      ctx.lineTo(x, floatY + ch * 0.6);
      ctx.lineTo(x - cw, floatY);
      ctx.closePath();
      ctx.fillStyle = cg;
      ctx.fill();
      // Inner gleam
      ctx.beginPath();
      ctx.moveTo(x, floatY - ch * 0.5);
      ctx.lineTo(x + cw * 0.4, floatY);
      ctx.lineTo(x, floatY + ch * 0.2);
      ctx.lineTo(x - cw * 0.4, floatY);
      ctx.closePath();
      ctx.fillStyle = 'rgba(255,255,255,' + (0.3 * pulse) + ')';
      ctx.fill();
      ctx.restore();
      // Arcane ring (tier 2+)
      if (tier >= 2) {
        ctx.save();
        ctx.strokeStyle = 'rgba(187,68,255,' + (0.4 * pulse) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(x, floatY, size * 0.22, size * 0.08, time * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      // Idle: rotating rune circle at base
      ctx.save();
      var runeR = size * 0.32;
      var runeAlpha = 0.2 + Math.sin(time * 2) * 0.1;
      ctx.strokeStyle = 'rgba(187,68,255,' + runeAlpha + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(x, y + size * 0.12, runeR, runeR * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Rune symbols (small marks around the circle)
      var runeCount = 6;
      for (var ri = 0; ri < runeCount; ri++) {
        var ra = time * 0.8 + ri * (Math.PI * 2 / runeCount);
        var rrx = x + Math.cos(ra) * runeR;
        var rry = y + size * 0.12 + Math.sin(ra) * runeR * 0.3;
        ctx.beginPath();
        ctx.arc(rrx, rry, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(221,136,255,' + (runeAlpha * 1.5) + ')';
        ctx.fill();
      }
      ctx.restore();
      drawTierOrbs(ctx, x, y, size, tier, '#cc66ff', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      // Beam — drawn by engine as a line, this is the impact point
      ctx.save();
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#bb44ff';
      var g = ctx.createRadialGradient(x, y, 0, x, y, 8);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.5, '#dd88ff');
      g.addColorStop(1, 'rgba(187,68,255,0)');
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  };

  // ---- 6. NATURE — Verdant Grove ----
  TYPES.nature = {
    id: 'nature',
    name: 'Verdant Grove',
    element: 'nature',
    color: '#33cc55',
    glowColor: 'rgba(51,204,85,0.5)',
    cost: 110,
    damage: 8,
    attackSpeed: 0,
    range: 2.5,
    projectileSpeed: 0,
    attackType: 'aura',
    ability: { name: 'Entangle', manaCost: 10, cooldown: 8, description: 'Root all enemies in range for 2.5s, apply poison.' },
    auraDPS: 12,
    poisonDPS: 6,
    poisonDuration: 4,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#33cc55', tier);
      var h = size * (0.5 + tier * 0.05);
      var topY = y - h * 0.35;
      var sway = Math.sin(time * 1.5) * 2;
      // Trunk
      ctx.beginPath();
      ctx.moveTo(x - size * 0.04, y + size * 0.1);
      ctx.quadraticCurveTo(x + sway * 0.3, y - h * 0.15, x + sway * 0.5, topY + h * 0.15);
      ctx.lineTo(x + sway * 0.5 + size * 0.03, topY + h * 0.15);
      ctx.quadraticCurveTo(x + sway * 0.3 + size * 0.03, y - h * 0.15, x + size * 0.04, y + size * 0.1);
      ctx.closePath();
      ctx.fillStyle = '#554422';
      ctx.fill();
      // Canopy
      ctx.save();
      ctx.shadowBlur = 8 + tier * 3;
      ctx.shadowColor = 'rgba(51,204,85,0.6)';
      var leafPulse = Math.sin(time * 2) * 0.1 + 0.9;
      var canopyR = size * (0.2 + tier * 0.03) * leafPulse;
      var cg = ctx.createRadialGradient(x + sway, topY, 0, x + sway, topY, canopyR);
      cg.addColorStop(0, '#66ee88');
      cg.addColorStop(0.6, '#33cc55');
      cg.addColorStop(1, '#228833');
      // Multi-circle canopy
      var centers = [
        [x + sway, topY],
        [x + sway - canopyR * 0.6, topY + canopyR * 0.3],
        [x + sway + canopyR * 0.6, topY + canopyR * 0.3]
      ];
      if (tier >= 2) {
        centers.push([x + sway, topY - canopyR * 0.5]);
      }
      for (var c = 0; c < centers.length; c++) {
        ctx.beginPath();
        ctx.arc(centers[c][0], centers[c][1], canopyR * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = cg;
        ctx.fill();
      }
      ctx.restore();
      // Vines (tier 2+)
      if (tier >= 2) {
        ctx.strokeStyle = 'rgba(51,180,70,0.6)';
        ctx.lineWidth = 1.5;
        for (var v = 0; v < tier; v++) {
          var va = (v / tier) * Math.PI - Math.PI * 0.5;
          ctx.beginPath();
          ctx.moveTo(x, topY + canopyR * 0.3);
          var vx = x + Math.cos(va) * size * 0.3;
          var vy = topY + canopyR * 0.3 + size * 0.25;
          ctx.quadraticCurveTo(vx + Math.sin(time * 2 + v) * 3, (topY + canopyR * 0.3 + vy) / 2, vx, vy);
          ctx.stroke();
        }
      }
      // Poison aura ring
      ctx.save();
      ctx.strokeStyle = 'rgba(51,204,85,' + (0.2 + Math.sin(time * 3) * 0.1) + ')';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      // Idle: gentle leaf particles drifting upward
      for (var lf = 0; lf < 3; lf++) {
        var lt = (time * 0.6 + lf * 1.1) % 2.0;
        var la = Math.max(0, 1 - lt / 2.0);
        var lfx = x + Math.sin(time * 1.5 + lf * 2.7) * size * 0.3;
        var lfy = topY + canopyR * 0.3 - lt * size * 0.4;
        ctx.save();
        ctx.translate(lfx, lfy);
        ctx.rotate(time * 2 + lf * 1.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, 2.5, 1, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(102,238,136,' + (la * 0.6) + ')';
        ctx.fill();
        ctx.restore();
      }
      drawTierOrbs(ctx, x, y, size, tier, '#55ee77', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      // Aura — no projectile, but draw a poison puff
      ctx.save();
      ctx.globalAlpha = 0.5;
      var g = ctx.createRadialGradient(x, y, 0, x, y, 6);
      g.addColorStop(0, '#66ff88');
      g.addColorStop(1, 'rgba(51,204,85,0)');
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }
  };

  // ---- 7. SHADOW — Void Spire ----
  TYPES.shadow = {
    id: 'shadow',
    name: 'Void Spire',
    element: 'shadow',
    color: '#6633aa',
    glowColor: 'rgba(102,51,170,0.6)',
    cost: 130,
    damage: 20,
    attackSpeed: 1.0,
    range: 3.5,
    projectileSpeed: 260,
    attackType: 'projectile',
    ability: { name: 'Soul Drain', manaCost: 15, cooldown: 12, description: 'Damage all enemies in range for 2x damage, heal nexus 10% of damage dealt.' },
    maxHpBonusDamage: 0.02,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#6633aa', tier);
      var h = size * (0.55 + tier * 0.05);
      var topY = y - h * 0.45;
      // Swirling void effect behind tower
      ctx.save();
      ctx.globalAlpha = 0.3 + Math.sin(time * 2) * 0.1;
      var vr = size * 0.25;
      for (var s = 0; s < 3; s++) {
        var sa = time * (1.5 + s * 0.3) + s * 2.09;
        var sx = x + Math.cos(sa) * vr * 0.4;
        var sy = y - h * 0.2 + Math.sin(sa) * vr * 0.3;
        var sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, vr * 0.5);
        sg.addColorStop(0, 'rgba(80,30,140,0.5)');
        sg.addColorStop(1, 'rgba(40,10,80,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, vr * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      }
      ctx.restore();
      // Spire body
      var sw = size * 0.1;
      var spg = ctx.createLinearGradient(x - sw, y, x + sw, topY);
      spg.addColorStop(0, '#332255');
      spg.addColorStop(0.5, '#553388');
      spg.addColorStop(1, '#7744bb');
      ctx.beginPath();
      ctx.moveTo(x - sw * 1.5, y + size * 0.08);
      ctx.lineTo(x - sw * 0.3, topY - h * 0.08);
      ctx.lineTo(x, topY - h * 0.15);
      ctx.lineTo(x + sw * 0.3, topY - h * 0.08);
      ctx.lineTo(x + sw * 1.5, y + size * 0.08);
      ctx.closePath();
      ctx.fillStyle = spg;
      ctx.fill();
      // Void eye
      ctx.save();
      var eyeY = topY + h * 0.15;
      var eyePulse = Math.sin(time * 3) * 0.2 + 0.8;
      ctx.shadowBlur = 10 + tier * 3;
      ctx.shadowColor = 'rgba(140,60,220,' + eyePulse + ')';
      var eg = ctx.createRadialGradient(x, eyeY, 0, x, eyeY, size * 0.06);
      eg.addColorStop(0, '#dd88ff');
      eg.addColorStop(0.5, '#8833cc');
      eg.addColorStop(1, 'rgba(60,20,100,0)');
      ctx.beginPath();
      ctx.arc(x, eyeY, size * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = eg;
      ctx.fill();
      // Inner pupil
      ctx.beginPath();
      ctx.arc(x, eyeY, size * 0.02, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
      // Dark tendrils (tier 2+)
      if (tier >= 2) {
        ctx.save();
        ctx.strokeStyle = 'rgba(100,50,170,0.4)';
        ctx.lineWidth = 1.5;
        for (var t = 0; t < tier + 1; t++) {
          var ta = time * 0.8 + t * 1.2;
          var tx1 = x + Math.cos(ta) * size * 0.15;
          var ty1 = y - h * 0.15;
          var tx2 = x + Math.cos(ta + 1) * size * 0.35;
          var ty2 = y + size * 0.05;
          ctx.beginPath();
          ctx.moveTo(x, y - h * 0.2);
          ctx.quadraticCurveTo(tx1, ty1, tx2, ty2);
          ctx.stroke();
        }
        ctx.restore();
      }
      // Idle: dark wisps curling around tower
      ctx.save();
      for (var wi = 0; wi < 4; wi++) {
        var wa = time * (0.8 + wi * 0.15) + wi * 1.57;
        var wr = size * (0.18 + Math.sin(time + wi) * 0.05);
        var wx1 = x + Math.cos(wa) * wr;
        var wy1 = y - h * 0.3 + Math.sin(wa * 0.7) * size * 0.15;
        var wx2 = x + Math.cos(wa + 1.2) * wr * 1.3;
        var wy2 = wy1 + Math.sin(wa + 0.8) * size * 0.1;
        ctx.beginPath();
        ctx.moveTo(wx1, wy1);
        ctx.quadraticCurveTo(
          (wx1 + wx2) / 2 + Math.sin(time * 2 + wi) * 3,
          (wy1 + wy2) / 2,
          wx2, wy2
        );
        ctx.strokeStyle = 'rgba(80,30,140,' + (0.2 + Math.sin(time * 1.5 + wi) * 0.1) + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
      drawTierOrbs(ctx, x, y, size, tier, '#9955dd', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#6633aa';
      // Dark orb
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 5);
      g.addColorStop(0, '#bb77ff');
      g.addColorStop(0.6, '#6633aa');
      g.addColorStop(1, 'rgba(40,15,80,0)');
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      // Wispy trail
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(-4, -3);
      ctx.quadraticCurveTo(-10, 0, -4, 3);
      ctx.strokeStyle = '#9955dd';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
  };

  // ---- 8. LIGHT — Radiant Beacon ----
  TYPES.light = {
    id: 'light',
    name: 'Radiant Beacon',
    element: 'light',
    color: '#ffdd88',
    glowColor: 'rgba(255,221,136,0.6)',
    cost: 140,
    damage: 16,
    attackSpeed: 1.1,
    range: 3.5,
    projectileSpeed: 300,
    attackType: 'projectile',
    ability: { name: 'Divine Judgment', manaCost: 18, cooldown: 14, description: 'Smite target for 4x damage. If kill, refund 50% mana.' },
    revealInvisible: true,
    bossBonusDamage: 0.5,
    nearbyDamageBuff: 0.10,
    nearbyBuffRange: 2,
    drawTower: function (ctx, x, y, size, tier, time) {
      drawBase(ctx, x, y, size, '#ffdd88', tier);
      var h = size * (0.55 + tier * 0.05);
      var topY = y - h * 0.45;
      // Pillar
      var pw = size * 0.08;
      ctx.beginPath();
      ctx.moveTo(x - pw * 1.2, y + size * 0.08);
      ctx.lineTo(x - pw, topY + h * 0.25);
      ctx.lineTo(x + pw, topY + h * 0.25);
      ctx.lineTo(x + pw * 1.2, y + size * 0.08);
      ctx.closePath();
      var pg = ctx.createLinearGradient(x - pw, y, x + pw, topY);
      pg.addColorStop(0, '#ccbb88');
      pg.addColorStop(1, '#eeddaa');
      ctx.fillStyle = pg;
      ctx.fill();
      // Lantern housing
      var lw = size * 0.14;
      var ly = topY + h * 0.15;
      ctx.beginPath();
      ctx.moveTo(x - lw, ly + lw * 0.5);
      ctx.lineTo(x - lw * 0.8, ly - lw * 0.5);
      ctx.lineTo(x + lw * 0.8, ly - lw * 0.5);
      ctx.lineTo(x + lw, ly + lw * 0.5);
      ctx.closePath();
      ctx.fillStyle = '#ddcc99';
      ctx.fill();
      ctx.strokeStyle = '#bbaa77';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Radiant light core
      var lightPulse = Math.sin(time * 3) * 0.15 + 0.85;
      ctx.save();
      ctx.shadowBlur = 16 + tier * 6;
      ctx.shadowColor = 'rgba(255,240,180,' + lightPulse + ')';
      var lg = ctx.createRadialGradient(x, ly, 0, x, ly, lw * 0.8);
      lg.addColorStop(0, '#ffffff');
      lg.addColorStop(0.3, '#ffeecc');
      lg.addColorStop(0.7, '#ffdd88');
      lg.addColorStop(1, 'rgba(255,221,136,0)');
      ctx.beginPath();
      ctx.arc(x, ly, lw * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = lg;
      ctx.fill();
      ctx.restore();
      // Light rays
      ctx.save();
      var rays = 4 + tier * 2;
      for (var r = 0; r < rays; r++) {
        var ra = (r / rays) * Math.PI * 2 + time * 0.5;
        var rl = size * (0.2 + tier * 0.04) * lightPulse;
        var rx = x + Math.cos(ra) * rl;
        var ry2 = ly + Math.sin(ra) * rl;
        ctx.beginPath();
        ctx.moveTo(x, ly);
        ctx.lineTo(rx, ry2);
        ctx.strokeStyle = 'rgba(255,240,200,' + (0.15 * lightPulse) + ')';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
      // Buff aura indicator (tier 2+)
      if (tier >= 2) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,221,136,' + (0.15 + Math.sin(time * 2) * 0.1) + ')';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.arc(x, y, size * 0.45, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }
      // Idle: soft pulsing golden aura
      var auraR = size * (0.35 + Math.sin(time * 2.5) * 0.08);
      var auraG = ctx.createRadialGradient(x, y - h * 0.15, 0, x, y - h * 0.15, auraR);
      auraG.addColorStop(0, 'rgba(255,240,180,0.08)');
      auraG.addColorStop(0.6, 'rgba(255,221,136,0.04)');
      auraG.addColorStop(1, 'rgba(255,221,136,0)');
      ctx.beginPath();
      ctx.arc(x, y - h * 0.15, auraR, 0, Math.PI * 2);
      ctx.fillStyle = auraG;
      ctx.fill();
      drawTierOrbs(ctx, x, y, size, tier, '#ffeebb', time);
    },
    drawProjectile: function (ctx, x, y, angle, time) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffdd88';
      // Light bolt
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, 5);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.5, '#ffeeaa');
      g.addColorStop(1, 'rgba(255,221,136,0)');
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      // Star sparkle
      ctx.strokeStyle = 'rgba(255,255,220,0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-6, 0); ctx.lineTo(6, 0);
      ctx.moveTo(0, -6); ctx.lineTo(0, 6);
      ctx.stroke();
      ctx.restore();
    }
  };

  // ---------------------------------------------------------------------------
  // UPGRADE TREES
  // ---------------------------------------------------------------------------

  var UPGRADES = {
    fire: {
      tier2a: { name: 'Hellfire', cost: 150, statMods: { damageMult: 1.5, burnDamageMult: 2.0 }, desc: 'Massive burn damage' },
      tier2b: { name: 'Rapid Flame', cost: 130, statMods: { attackSpeedMult: 1.8 }, desc: 'Much faster attacks' },
      tier3a: { name: 'Inferno', cost: 300, statMods: { damageMult: 2.0, burnDamageMult: 3.0, splashRadius: 1.0 }, desc: 'Burns everything nearby' },
      tier3b: { name: 'Firestorm', cost: 280, statMods: { attackSpeedMult: 2.5, chainCount: 2 }, desc: 'Attacks chain to extra targets' }
    },
    ice: {
      tier2a: { name: 'Deep Freeze', cost: 120, statMods: { slowAmountMult: 1.5, slowDurationMult: 1.5 }, desc: 'Stronger, longer slow' },
      tier2b: { name: 'Ice Shards', cost: 140, statMods: { damageMult: 1.8, splashRadius: 0.5 }, desc: 'Shattering ice hits nearby' },
      tier3a: { name: 'Absolute Zero', cost: 260, statMods: { slowAmountMult: 2.0, slowDurationMult: 2.0, freezeChance: 0.15 }, desc: '15% chance to freeze solid' },
      tier3b: { name: 'Blizzard', cost: 280, statMods: { damageMult: 2.5, splashRadius: 1.2, attackSpeedMult: 1.3 }, desc: 'AoE blizzard shreds groups' }
    },
    lightning: {
      tier2a: { name: 'Arc Welder', cost: 160, statMods: { chainCountAdd: 2, damageMult: 1.3 }, desc: '+2 chain targets, more damage' },
      tier2b: { name: 'Overcharge', cost: 150, statMods: { damageMult: 2.0, attackSpeedMult: 0.7 }, desc: 'Massive single-target bolts' },
      tier3a: { name: 'Tesla Array', cost: 320, statMods: { chainCountAdd: 4, damageMult: 1.6, chainDamageFalloffMult: 0.85 }, desc: 'Chains to 7 with less falloff' },
      tier3b: { name: 'Thundergod', cost: 300, statMods: { damageMult: 3.0, stunChance: 0.25, stunDuration: 0.5 }, desc: 'Devastating bolts that stun' }
    },
    earth: {
      tier2a: { name: 'Earthquake', cost: 130, statMods: { splashRadiusMult: 1.8, damageMult: 1.3 }, desc: 'Much larger splash area' },
      tier2b: { name: 'Fortification', cost: 120, statMods: { stunChanceMult: 2.0, stunDurationMult: 1.5, rangeMult: 1.2 }, desc: 'Frequent stuns, more range' },
      tier3a: { name: 'Cataclysm', cost: 300, statMods: { splashRadiusMult: 2.5, damageMult: 2.0, slowOnHit: 0.2 }, desc: 'Massive quakes slow all hit' },
      tier3b: { name: 'Stoneguard', cost: 260, statMods: { stunChanceMult: 2.5, stunDurationMult: 2.0, armorBuff: 0.15 }, desc: 'Stuns often, nearby towers take less damage' }
    },
    arcane: {
      tier2a: { name: 'Disintegrate', cost: 200, statMods: { damageMult: 1.8, armorPierceMult: 1.5 }, desc: 'Pierces armor, more damage' },
      tier2b: { name: 'Mystic Focus', cost: 180, statMods: { rangeMult: 1.4, attackSpeedMult: 1.3 }, desc: 'Long range rapid beams' },
      tier3a: { name: 'Annihilation Ray', cost: 400, statMods: { damageMult: 3.0, armorPierceMult: 2.0, beamWidth: 2 }, desc: 'Obliterating beam ignores all armor' },
      tier3b: { name: 'Arcane Sanctum', cost: 360, statMods: { rangeMult: 1.8, attackSpeedMult: 1.8, manaRegen: 5 }, desc: 'Rapid-fire beams, generates mana' }
    },
    nature: {
      tier2a: { name: 'Toxic Bloom', cost: 150, statMods: { auraDPSMult: 1.8, poisonDPSMult: 2.0 }, desc: 'Deadly poison, stronger aura' },
      tier2b: { name: 'Thornwall', cost: 140, statMods: { thornDamage: 10, rangeMult: 1.3, slowOnHit: 0.15 }, desc: 'Thorns damage attackers, slow' },
      tier3a: { name: 'Plague Garden', cost: 300, statMods: { auraDPSMult: 3.0, poisonDPSMult: 3.0, poisonSpread: true }, desc: 'Poison spreads between enemies' },
      tier3b: { name: 'World Tree', cost: 320, statMods: { thornDamage: 25, rangeMult: 1.6, healAllyTowers: 1 }, desc: 'Massive range, regenerates nexus' }
    },
    shadow: {
      tier2a: { name: 'Soul Siphon', cost: 170, statMods: { damageMult: 1.4, maxHpBonusMult: 2.0, lifeSteal: 0.1 }, desc: 'Steals life, bonus HP damage' },
      tier2b: { name: 'Phantom Strike', cost: 160, statMods: { attackSpeedMult: 1.6, critChance: 0.15, critMult: 2.0 }, desc: 'Fast attacks with crit chance' },
      tier3a: { name: 'Death Knight', cost: 340, statMods: { damageMult: 2.0, maxHpBonusMult: 3.0, lifeSteal: 0.2, executeThreshold: 0.1 }, desc: 'Executes below 10% HP' },
      tier3b: { name: 'Assassin', cost: 320, statMods: { attackSpeedMult: 2.2, critChance: 0.3, critMult: 3.0, invisOnKill: true }, desc: 'Lethal crits, resets on kill' }
    },
    light: {
      tier2a: { name: 'Holy Smite', cost: 180, statMods: { damageMult: 1.6, bossBonusMult: 1.5 }, desc: 'Massive damage vs bosses' },
      tier2b: { name: 'Aura of Valor', cost: 170, statMods: { nearbyDamageBuffMult: 2.0, nearbyBuffRangeMult: 1.5 }, desc: 'Strong damage buff to allies' },
      tier3a: { name: 'Divine Wrath', cost: 360, statMods: { damageMult: 2.5, bossBonusMult: 2.0, holyExplosion: true }, desc: 'Kills trigger holy explosions' },
      tier3b: { name: 'Archangel', cost: 340, statMods: { nearbyDamageBuffMult: 3.0, nearbyBuffRangeMult: 2.0, attackSpeedBuff: 0.15 }, desc: 'Buffs all nearby towers massively' }
    }
  };

  // ---------------------------------------------------------------------------
  // ELEMENTAL SYNERGIES
  // ---------------------------------------------------------------------------

  var SYNERGIES = {
    'fire+ice': {
      name: 'Thermal Shock',
      desc: 'Enemies take 25% more damage when both burned and frozen',
      bonusDamageMult: 1.25
    },
    'fire+earth': {
      name: 'Magma Flow',
      desc: 'Attacks leave lava puddles (10 DPS)',
      lavaDPS: 10
    },
    'fire+nature': {
      name: 'Wildfire',
      desc: 'Burn spreads to nearby enemies on death',
      spreadRadius: 1.5
    },
    'ice+lightning': {
      name: 'Superconductor',
      desc: 'Chain lightning +2 bounces on slowed enemies',
      extraChains: 2
    },
    'ice+earth': {
      name: 'Permafrost',
      desc: 'Creates permanent 25% slow zone between towers',
      slowAmount: 0.25
    },
    'lightning+arcane': {
      name: 'Arcane Storm',
      desc: '20% crit chance (2x damage)',
      critChance: 0.20
    },
    'earth+nature': {
      name: 'Living Stone',
      desc: '20% chance to root enemies 1.5s',
      rootChance: 0.20,
      rootDuration: 1.5
    },
    'nature+light': {
      name: 'Photosynthesis',
      desc: 'Slowly regenerates nexus HP',
      nexusHealPerSec: 1
    },
    'shadow+arcane': {
      name: 'Void Rift',
      desc: 'Kills create void zones (15 DPS, 4s)',
      voidDPS: 15,
      voidDuration: 4
    },
    'shadow+light': {
      name: 'Eclipse',
      desc: 'True damage (ignores all armor)',
      armorPierce: 1.0
    }
  };

  // Same-element adjacency bonuses
  var SAME_ELEMENT_BONUSES = [
    null,                                                     // 0 neighbors
    null,                                                     // 1 neighbor
    { damageMult: 1.10 },                                    // 2 neighbors
    { damageMult: 1.20, rangeMult: 1.10 },                   // 3 neighbors
    { damageMult: 1.30, rangeMult: 1.15, attackSpeedMult: 1.10 } // 4+ neighbors
  ];

  // ---------------------------------------------------------------------------
  // 8-adjacent cell offsets
  // ---------------------------------------------------------------------------

  var ADJ_OFFSETS = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0],           [1, 0],
    [-1, 1],  [0, 1],  [1, 1]
  ];

  // ---------------------------------------------------------------------------
  // Synergy Computation
  // ---------------------------------------------------------------------------

  /**
   * computeSynergies - find all active synergies for a tower
   * @param {object} tower - tower instance
   * @param {object} towerGrid - Map keyed by "col,row" → tower
   * @returns {Array} array of { type: 'same'|'combo', name, bonuses }
   */
  function computeSynergies(tower, towerGrid) {
    var synergies = [];
    var neighborElements = {};
    var sameCount = 0;

    for (var i = 0; i < ADJ_OFFSETS.length; i++) {
      var nc = tower.col + ADJ_OFFSETS[i][0];
      var nr = tower.row + ADJ_OFFSETS[i][1];
      var key = nc + ',' + nr;
      var neighbor = towerGrid[key];
      if (!neighbor) continue;

      var nElem = neighbor.type.element;
      if (nElem === tower.type.element) {
        sameCount++;
      } else {
        neighborElements[nElem] = true;
      }
    }

    // Same-element bonus
    if (sameCount >= 2) {
      var idx = Math.min(sameCount, 4);
      var bonus = SAME_ELEMENT_BONUSES[idx];
      if (bonus) {
        synergies.push({
          type: 'same',
          name: tower.type.element + ' Resonance (' + sameCount + ')',
          bonuses: bonus
        });
      }
    }

    // Cross-element combos
    var myElem = tower.type.element;
    var checkedPairs = {};
    for (var elem in neighborElements) {
      // Build canonical key (alphabetical order)
      var pair = myElem < elem ? myElem + '+' + elem : elem + '+' + myElem;
      if (checkedPairs[pair]) continue;
      checkedPairs[pair] = true;

      var synergy = SYNERGIES[pair];
      if (synergy) {
        synergies.push({
          type: 'combo',
          name: synergy.name,
          bonuses: synergy
        });
      }
    }

    return synergies;
  }

  // ---------------------------------------------------------------------------
  // Effective Stats
  // ---------------------------------------------------------------------------

  function getUpgradeModsForTower(tower) {
    if (tower.tier < 2 || !tower.upgradePath) return {};
    var elem = tower.type.element;
    var upgrades = UPGRADES[elem];
    if (!upgrades) return {};

    var mods = {};
    var path = tower.upgradePath;

    // Apply tier 2 mods
    var t2 = upgrades['tier2' + path];
    if (t2 && t2.statMods) {
      for (var k in t2.statMods) {
        mods[k] = t2.statMods[k];
      }
    }

    // Apply tier 3 mods (overrides / extends tier 2)
    if (tower.tier >= 3) {
      var t3 = upgrades['tier3' + path];
      if (t3 && t3.statMods) {
        for (var k2 in t3.statMods) {
          mods[k2] = t3.statMods[k2];
        }
      }
    }

    return mods;
  }

  /**
   * getEffectiveStats - compute final stats with upgrades + synergies
   * @param {object} tower - tower instance
   * @returns {object} computed stats
   */
  function getEffectiveStats(tower) {
    var base = tower.type;
    var stats = {
      damage: base.damage,
      attackSpeed: base.attackSpeed,
      range: base.range,
      projectileSpeed: base.projectileSpeed,
      attackType: base.attackType,
      // Copy element-specific properties
      burnDPS: base.burnDPS || 0,
      burnDuration: base.burnDuration || 0,
      slowAmount: base.slowAmount || 0,
      slowDuration: base.slowDuration || 0,
      chainCount: base.chainCount || 0,
      chainDamageFalloff: base.chainDamageFalloff || 1,
      splashRadius: base.splashRadius || 0,
      stunChance: base.stunChance || 0,
      stunDuration: base.stunDuration || 0,
      armorPierce: base.armorPierce || 0,
      auraDPS: base.auraDPS || 0,
      poisonDPS: base.poisonDPS || 0,
      poisonDuration: base.poisonDuration || 0,
      maxHpBonusDamage: base.maxHpBonusDamage || 0,
      revealInvisible: base.revealInvisible || false,
      bossBonusDamage: base.bossBonusDamage || 0,
      nearbyDamageBuff: base.nearbyDamageBuff || 0,
      nearbyBuffRange: base.nearbyBuffRange || 0,
      // Extra properties from upgrades
      critChance: 0,
      critMult: 1,
      lifeSteal: 0,
      executeThreshold: 0,
      freezeChance: 0,
      thornDamage: 0,
      poisonSpread: false,
      holyExplosion: false,
      attackSpeedBuff: 0
    };

    // Apply upgrade mods
    var mods = getUpgradeModsForTower(tower);
    for (var key in mods) {
      var val = mods[key];
      if (key.endsWith('Mult')) {
        // Multiplier — find the base stat name
        var baseName = key.replace('Mult', '');
        if (stats[baseName] !== undefined) {
          stats[baseName] *= val;
        }
      } else if (key.endsWith('Add')) {
        var addName = key.replace('Add', '');
        if (stats[addName] !== undefined) {
          stats[addName] += val;
        }
      } else {
        // Direct set
        stats[key] = val;
      }
    }

    // Apply synergy bonuses
    var synergies = tower.synergies || [];
    for (var s = 0; s < synergies.length; s++) {
      var syn = synergies[s];
      var bonuses = syn.bonuses;
      if (!bonuses) continue;

      if (syn.type === 'same') {
        // Same-element bonuses are multipliers
        if (bonuses.damageMult) stats.damage *= bonuses.damageMult;
        if (bonuses.rangeMult) stats.range *= bonuses.rangeMult;
        if (bonuses.attackSpeedMult) stats.attackSpeed *= bonuses.attackSpeedMult;
      }
      // Combo synergies add special effects — stored as-is for the engine to query
      if (syn.type === 'combo') {
        if (bonuses.bonusDamageMult) stats.damage *= bonuses.bonusDamageMult;
        if (bonuses.armorPierce) stats.armorPierce = Math.max(stats.armorPierce, bonuses.armorPierce);
        if (bonuses.critChance) stats.critChance += bonuses.critChance;
        if (bonuses.extraChains) stats.chainCount += bonuses.extraChains;
      }
    }

    return stats;
  }

  // ---------------------------------------------------------------------------
  // Tower Creation
  // ---------------------------------------------------------------------------

  /**
   * createTower - create a new tower instance
   */
  function createTower(typeId, col, row, x, y) {
    var type = TYPES[typeId];
    if (!type) return null;

    var tower = {
      id: _uid++,
      type: type,
      col: col,
      row: row,
      x: x,
      y: y,
      tier: 1,
      upgradePath: null,
      attackTimer: 0,
      target: null,
      totalDamage: 0,
      totalKills: 0,
      synergies: [],
      effectiveStats: {},
      totalInvested: type.cost,
      targetingMode: 'first',
      lastAttackTime: -1,
      abilityCooldown: 0
    };

    tower.effectiveStats = getEffectiveStats(tower);
    return tower;
  }

  // ---------------------------------------------------------------------------
  // Tower Upgrades
  // ---------------------------------------------------------------------------

  /**
   * upgradeTower - apply an upgrade path
   * @param {object} tower
   * @param {string} path - 'a' or 'b'
   * @returns {boolean} success
   */
  function upgradeTower(tower, path) {
    var elem = tower.type.element;
    var upgrades = UPGRADES[elem];
    if (!upgrades) return false;

    if (tower.tier === 1) {
      // Upgrade to tier 2
      var t2 = upgrades['tier2' + path];
      if (!t2) return false;
      tower.tier = 2;
      tower.upgradePath = path;
      tower.totalInvested += t2.cost;
      tower.effectiveStats = getEffectiveStats(tower);
      return true;
    } else if (tower.tier === 2) {
      // Upgrade to tier 3 — must follow same path
      if (tower.upgradePath !== path) return false;
      var t3 = upgrades['tier3' + path];
      if (!t3) return false;
      tower.tier = 3;
      tower.totalInvested += t3.cost;
      tower.effectiveStats = getEffectiveStats(tower);
      return true;
    }

    return false; // Already tier 3
  }

  /**
   * getTowerCost - base build cost
   */
  function getTowerCost(typeId) {
    var type = TYPES[typeId];
    return type ? type.cost : 0;
  }

  /**
   * getUpgradeCost - cost for next upgrade
   */
  function getUpgradeCost(tower, path) {
    var elem = tower.type.element;
    var upgrades = UPGRADES[elem];
    if (!upgrades) return 0;

    if (tower.tier === 1) {
      var t2 = upgrades['tier2' + path];
      return t2 ? t2.cost : 0;
    } else if (tower.tier === 2 && tower.upgradePath === path) {
      var t3 = upgrades['tier3' + path];
      return t3 ? t3.cost : 0;
    }

    return 0;
  }

  /**
   * getUpgradeInfo - get upgrade data for display
   */
  function getUpgradeInfo(tower, path) {
    var elem = tower.type.element;
    var upgrades = UPGRADES[elem];
    if (!upgrades) return null;

    // path should be 'a' or 'b'
    if (tower.tier === 1) {
      return upgrades['tier2' + path] || null;
    } else if (tower.tier === 2) {
      return upgrades['tier3' + path] || null;
    }

    return null;
  }

  /**
   * getSellValue - 70% of total invested gold
   */
  function getSellValue(tower) {
    return Math.floor(tower.totalInvested * 0.7);
  }

  // ---------------------------------------------------------------------------
  // Targeting AI
  // ---------------------------------------------------------------------------

  /**
   * findTarget - select best enemy for a tower
   */
  function findTarget(tower, enemies, effectiveRange) {
    var best = null;
    var bestVal = -1;
    var rangePx = effectiveRange * 48; // grid cells → pixels

    for (var i = 0; i < enemies.length; i++) {
      var enemy = enemies[i];
      if (enemy.hp <= 0) continue;
      if (enemy.invisible && !tower.effectiveStats.revealInvisible) continue;

      var dx = enemy.x - tower.x;
      var dy = enemy.y - tower.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > rangePx) continue;

      var val = 0;
      switch (tower.targetingMode) {
        case 'first':
          val = enemy.pathProgress || 0;
          break;
        case 'nearest':
          val = -dist;
          break;
        case 'strongest':
          val = enemy.maxHp || enemy.hp;
          break;
        case 'weakest':
          val = -(enemy.hp);
          break;
        default:
          val = enemy.pathProgress || 0;
      }

      if (val > bestVal) {
        bestVal = val;
        best = enemy;
      }
    }

    return best;
  }

  /**
   * findChainTargets - for chain-type attacks, find additional bounce targets
   */
  function findChainTargets(source, enemies, count, rangePx, exclude) {
    var targets = [];
    var excluded = {};
    for (var e = 0; e < exclude.length; e++) {
      excluded[exclude[e].id] = true;
    }

    var current = source;
    for (var c = 0; c < count; c++) {
      var best = null;
      var bestDist = rangePx;

      for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (enemy.hp <= 0 || excluded[enemy.id]) continue;

        var dx = enemy.x - current.x;
        var dy = enemy.y - current.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = enemy;
        }
      }

      if (!best) break;
      targets.push(best);
      excluded[best.id] = true;
      current = best;
    }

    return targets;
  }

  /**
   * updateAll - main update loop for all towers
   * @param {Array} towers - all tower instances
   * @param {Array} enemies - all alive enemies
   * @param {number} dt - delta time in seconds
   * @param {object} callbacks
   *   - onFire(tower, target, effectiveStats)
   *   - onChainFire(tower, targets, effectiveStats) — for chain type
   *   - onAuraTick(tower, enemies, effectiveStats, dt) — for aura type
   */
  function updateAll(towers, enemies, dt, callbacks) {
    for (var t = 0; t < towers.length; t++) {
      var tower = towers[t];
      var stats = tower.effectiveStats;

      // Skip disabled towers (Shadow Dragon breath)
      if (tower._disabled) continue;

      // Aura towers tick continuously
      if (stats.attackType === 'aura') {
        if (callbacks.onAuraTick) {
          // Find enemies in range
          var rangePx = stats.range * 48;
          var auraTargets = [];
          for (var e = 0; e < enemies.length; e++) {
            if (enemies[e].hp <= 0) continue;
            var dx = enemies[e].x - tower.x;
            var dy = enemies[e].y - tower.y;
            if (Math.sqrt(dx * dx + dy * dy) <= rangePx) {
              auraTargets.push(enemies[e]);
            }
          }
          if (auraTargets.length > 0) {
            callbacks.onAuraTick(tower, auraTargets, stats, dt);
          }
        }
        continue;
      }

      // Decrement attack timer
      tower.attackTimer -= dt;
      if (tower.attackTimer > 0) continue;
      if (stats.attackSpeed <= 0) continue;

      // Find target
      var target = findTarget(tower, enemies, stats.range);
      if (!target) {
        tower.target = null;
        continue;
      }

      tower.target = target;

      // Fire!
      tower.lastAttackTime = callbacks.time || 0;
      if (stats.attackType === 'chain' && callbacks.onChainFire) {
        var chainTargets = [target];
        var additionalTargets = findChainTargets(
          target, enemies, stats.chainCount - 1, stats.range * 48, chainTargets
        );
        chainTargets = chainTargets.concat(additionalTargets);
        callbacks.onChainFire(tower, chainTargets, stats);
      } else if (callbacks.onFire) {
        callbacks.onFire(tower, target, stats);
      }

      // Reset timer
      tower.attackTimer = 1.0 / stats.attackSpeed;
    }
  }

  /**
   * refreshAllSynergies - recompute synergies for all towers
   * Call after any tower is placed, sold, or upgraded
   */
  function refreshAllSynergies(towers) {
    // Build grid lookup
    var grid = {};
    for (var i = 0; i < towers.length; i++) {
      grid[towers[i].col + ',' + towers[i].row] = towers[i];
    }

    // Recompute each tower
    for (var j = 0; j < towers.length; j++) {
      towers[j].synergies = computeSynergies(towers[j], grid);
      towers[j].effectiveStats = getEffectiveStats(towers[j]);
    }
  }

  // ---------------------------------------------------------------------------
  // Ability System
  // ---------------------------------------------------------------------------

  /**
   * activateAbility - execute a tower's activated ability
   * @param {object} tower - tower instance (must be tier >= 2)
   * @param {Array} enemies - all alive enemies
   * @param {object} callbacks - { onDamage(tower, enemy, dmg), onStatus(enemy, status), onNexusHeal(amount), onKill(enemy), getMana(), setMana(v), getFX(), getMap() }
   * @returns {object|null} - { success, manaSpent } or null if failed
   */
  function activateAbility(tower, enemies, callbacks) {
    var ability = tower.type.ability;
    if (!ability) return null;
    if (tower.tier < 2) return null;
    if (tower.abilityCooldown > 0) return null;

    var currentMana = callbacks.getMana();
    if (currentMana < ability.manaCost) return null;

    var stats = tower.effectiveStats;
    var rangePx = stats.range * 48;
    var element = tower.type.element;
    var FX = callbacks.getFX();
    var totalDmg = 0;

    // Find enemies in range
    var inRange = [];
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].hp <= 0 || enemies[i].dead) continue;
      var dx = enemies[i].x - tower.x;
      var dy = enemies[i].y - tower.y;
      if (Math.sqrt(dx * dx + dy * dy) <= rangePx) {
        inRange.push(enemies[i]);
      }
    }

    switch (element) {
      case 'fire': {
        // Eruption: AoE burst dealing 3x damage in radius 2, apply burn
        var eruptRadius = 2 * 48;
        var eruptDmg = stats.damage * 3;
        FX.spawnExplosion({ x: tower.x, y: tower.y, radius: eruptRadius, element: 'fire', duration: 0.8 });
        FX.spawnParticles({ x: tower.x, y: tower.y, count: 32, color: '#ff4422', size: 4, speed: 150, lifetime: 1.0, gravity: -40, spread: Math.PI * 2 });
        for (var i = 0; i < enemies.length; i++) {
          var e = enemies[i];
          if (e.hp <= 0 || e.dead) continue;
          var dx = e.x - tower.x;
          var dy = e.y - tower.y;
          if (Math.sqrt(dx * dx + dy * dy) <= eruptRadius) {
            var dmg = callbacks.onDamage(tower, e, eruptDmg, 0);
            totalDmg += dmg;
            callbacks.onStatus(e, { type: 'burn', intensity: stats.burnDPS || 5, duration: stats.burnDuration || 3 });
            callbacks.onKill(e);
          }
        }
        break;
      }
      case 'ice': {
        // Flash Freeze: All enemies in range frozen for 2s
        FX.spawnExplosion({ x: tower.x, y: tower.y, radius: rangePx, element: 'ice', duration: 0.6 });
        FX.spawnParticles({ x: tower.x, y: tower.y, count: 24, color: '#44ccff', size: 3, speed: 120, lifetime: 0.8, gravity: -20, spread: Math.PI * 2 });
        for (var i = 0; i < inRange.length; i++) {
          callbacks.onStatus(inRange[i], { type: 'freeze', duration: 2.0, intensity: 1 });
        }
        break;
      }
      case 'lightning': {
        // Overload: Chain to ALL enemies in range for full damage
        var points = [{ x: tower.x, y: tower.y }];
        for (var i = 0; i < inRange.length; i++) {
          points.push({ x: inRange[i].x, y: inRange[i].y });
          var dmg = callbacks.onDamage(tower, inRange[i], stats.damage, stats.armorPierce || 0);
          totalDmg += dmg;
          callbacks.onKill(inRange[i]);
        }
        if (points.length > 1) {
          FX.spawnChain({ points: points, element: 'lightning', duration: 0.5 });
        }
        FX.spawnParticles({ x: tower.x, y: tower.y, count: 20, color: '#ffee44', size: 3, speed: 200, lifetime: 0.5, gravity: 0, spread: Math.PI * 2 });
        break;
      }
      case 'earth': {
        // Earthquake: Stun all enemies in radius 3 for 1.5s + 50% tower damage
        var quakeRadius = 3 * 48;
        var quakeDmg = stats.damage * 0.5;
        FX.spawnExplosion({ x: tower.x, y: tower.y, radius: quakeRadius, element: 'earth', duration: 0.8 });
        FX.spawnParticles({ x: tower.x, y: tower.y, count: 28, color: '#aa8844', size: 4, speed: 100, lifetime: 1.0, gravity: 60, spread: Math.PI * 2 });
        for (var i = 0; i < enemies.length; i++) {
          var e = enemies[i];
          if (e.hp <= 0 || e.dead) continue;
          var dx = e.x - tower.x;
          var dy = e.y - tower.y;
          if (Math.sqrt(dx * dx + dy * dy) <= quakeRadius) {
            var dmg = callbacks.onDamage(tower, e, quakeDmg, 0);
            totalDmg += dmg;
            callbacks.onStatus(e, { type: 'stun', duration: 1.5, intensity: 1 });
            callbacks.onKill(e);
          }
        }
        break;
      }
      case 'arcane': {
        // Disintegrate: Single target beam, 5x damage, ignores armor
        var target = findTarget(tower, enemies, stats.range);
        if (!target) return null; // No target, don't spend mana
        var disDmg = stats.damage * 5;
        FX.spawnBeam({ fromX: tower.x, fromY: tower.y, toX: target.x, toY: target.y, element: 'arcane', duration: 0.8, width: 6 });
        FX.spawnParticles({ x: target.x, y: target.y, count: 16, color: '#bb44ff', size: 3, speed: 80, lifetime: 0.6, gravity: 0, spread: Math.PI * 2 });
        var dmg = callbacks.onDamage(tower, target, disDmg, 1.0); // 1.0 = 100% armor pierce
        totalDmg += dmg;
        callbacks.onKill(target);
        break;
      }
      case 'nature': {
        // Entangle: Root all enemies in range for 2.5s, apply poison
        FX.spawnAura({ x: tower.x, y: tower.y, radius: rangePx, element: 'nature', duration: 1.0, pulseSpeed: 4 });
        FX.spawnParticles({ x: tower.x, y: tower.y, count: 24, color: '#33cc55', size: 3, speed: 80, lifetime: 1.0, gravity: -30, spread: Math.PI * 2 });
        for (var i = 0; i < inRange.length; i++) {
          callbacks.onStatus(inRange[i], { type: 'stun', duration: 2.5, intensity: 1 }); // Root = stun
          callbacks.onStatus(inRange[i], { type: 'poison', intensity: stats.poisonDPS || 6, duration: stats.poisonDuration || 4 });
        }
        break;
      }
      case 'shadow': {
        // Soul Drain: 2x damage to all in range, heal nexus 10% of damage dealt
        FX.spawnExplosion({ x: tower.x, y: tower.y, radius: rangePx, element: 'shadow', duration: 0.6 });
        FX.spawnParticles({ x: tower.x, y: tower.y, count: 20, color: '#6633aa', size: 3, speed: 100, lifetime: 0.8, gravity: -50, spread: Math.PI * 2 });
        var drainDmg = stats.damage * 2;
        for (var i = 0; i < inRange.length; i++) {
          var dmg = callbacks.onDamage(tower, inRange[i], drainDmg, stats.armorPierce || 0);
          totalDmg += dmg;
          callbacks.onKill(inRange[i]);
        }
        // Heal nexus for 10% of total damage dealt
        var healAmount = Math.floor(totalDmg * 0.1);
        if (healAmount > 0) callbacks.onNexusHeal(healAmount);
        break;
      }
      case 'light': {
        // Divine Judgment: Smite target for 4x damage. Kill refunds 50% mana.
        var target = findTarget(tower, enemies, stats.range);
        if (!target) return null;
        var smiteDmg = stats.damage * 4;
        FX.spawnBeam({ fromX: tower.x, fromY: tower.y - 60, toX: target.x, toY: target.y, element: 'light', duration: 0.6, width: 5 });
        FX.spawnExplosion({ x: target.x, y: target.y, radius: 40, element: 'light', duration: 0.4 });
        FX.spawnParticles({ x: target.x, y: target.y, count: 20, color: '#ffdd88', size: 4, speed: 120, lifetime: 0.8, gravity: -60, spread: Math.PI * 2 });
        var dmg = callbacks.onDamage(tower, target, smiteDmg, 0);
        totalDmg += dmg;
        var killed = target.hp <= 0;
        callbacks.onKill(target);
        // Refund 50% mana on kill
        if (killed || target.dead) {
          var refund = Math.floor(ability.manaCost * 0.5);
          callbacks.setMana(callbacks.getMana() + refund);
        }
        break;
      }
    }

    // Deduct mana and start cooldown
    callbacks.setMana(callbacks.getMana() - ability.manaCost);
    tower.abilityCooldown = ability.cooldown;

    return { success: true, manaSpent: ability.manaCost, totalDamage: totalDmg };
  }

  /**
   * updateAbilityCooldowns - tick down ability cooldowns for all towers
   */
  function updateAbilityCooldowns(towers, dt) {
    for (var i = 0; i < towers.length; i++) {
      if (towers[i].abilityCooldown > 0) {
        towers[i].abilityCooldown = Math.max(0, towers[i].abilityCooldown - dt);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  var ArcaneTowers = {
    TYPES: TYPES,
    UPGRADES: UPGRADES,
    SYNERGIES: SYNERGIES,
    SAME_ELEMENT_BONUSES: SAME_ELEMENT_BONUSES,

    createTower: createTower,
    upgradeTower: upgradeTower,
    getTowerCost: getTowerCost,
    getUpgradeCost: getUpgradeCost,
    getUpgradeInfo: getUpgradeInfo,
    getSellValue: getSellValue,
    getEffectiveStats: getEffectiveStats,
    computeSynergies: computeSynergies,
    refreshAllSynergies: refreshAllSynergies,
    findTarget: findTarget,
    findChainTargets: findChainTargets,
    updateAll: updateAll,
    activateAbility: activateAbility,
    updateAbilityCooldowns: updateAbilityCooldowns
  };

  window.ArcaneTowers = ArcaneTowers;
})();
