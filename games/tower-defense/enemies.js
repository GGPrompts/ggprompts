/*  Arcane Bastion — enemies.js
    Enemy types, behaviors, status effects, wave composition, spawning.
    Exposes window.ArcaneEnemies  */
(function () {
  'use strict';

  let nextId = 0;

  /* ------------------------------------------------------------------ */
  /*  Status effect types                                                */
  /* ------------------------------------------------------------------ */
  const STATUS = {
    burn:    'burn',
    slow:    'slow',
    freeze:  'freeze',
    poison:  'poison',
    root:    'root',
    stun:    'stun',
    shatter: 'shatter',
  };

  /* ------------------------------------------------------------------ */
  /*  Drawing helpers                                                    */
  /* ------------------------------------------------------------------ */
  function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
  }

  function glow(ctx, color, blur) {
    ctx.shadowColor = color;
    ctx.shadowBlur  = blur;
  }

  function noGlow(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur  = 0;
  }

  function pulse(time, freq, lo, hi) {
    return lo + (hi - lo) * (0.5 + 0.5 * Math.sin(time * freq));
  }

  /* ------------------------------------------------------------------ */
  /*  Per-type draw functions                                            */
  /* ------------------------------------------------------------------ */

  function drawImp(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // body
    ctx.fillStyle = e.type.color;
    circle(ctx, 0, 0, s);
    ctx.fill();
    // horns
    ctx.strokeStyle = e.type.accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.6);
    ctx.lineTo(-s * 0.3, -s * 1.4);
    ctx.moveTo(s * 0.5, -s * 0.6);
    ctx.lineTo(s * 0.3, -s * 1.4);
    ctx.stroke();
    // eyes
    ctx.fillStyle = '#ff0';
    circle(ctx, -s * 0.3, -s * 0.15, 2); ctx.fill();
    circle(ctx, s * 0.3, -s * 0.15, 2); ctx.fill();
    // tail
    ctx.strokeStyle = e.type.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, s);
    ctx.quadraticCurveTo(s * 1.2, s * 1.4, s * 0.6, s * 1.8);
    ctx.stroke();
    ctx.restore();
  }

  function drawGoblin(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // hunched body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // pointy ears
    ctx.fillStyle = e.type.accentColor;
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.3);
    ctx.lineTo(-s * 1.5, -s * 1.1);
    ctx.lineTo(-s * 0.5, -s * 0.5);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s, -s * 0.3);
    ctx.lineTo(s * 1.5, -s * 1.1);
    ctx.lineTo(s * 0.5, -s * 0.5);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#ff4';
    circle(ctx, -s * 0.3, -s * 0.2, 2.5); ctx.fill();
    circle(ctx, s * 0.3, -s * 0.2, 2.5); ctx.fill();
    ctx.restore();
  }

  function drawSkeleton(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // skull
    ctx.strokeStyle = e.type.color;
    ctx.lineWidth = 2;
    circle(ctx, 0, -s * 0.5, s * 0.55);
    ctx.stroke();
    // eye sockets
    ctx.fillStyle = '#000';
    circle(ctx, -s * 0.2, -s * 0.55, s * 0.15); ctx.fill();
    circle(ctx, s * 0.2, -s * 0.55, s * 0.15); ctx.fill();
    // jaw
    ctx.strokeStyle = e.type.color;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.15);
    ctx.lineTo(0, -s * 0.02);
    ctx.lineTo(s * 0.3, -s * 0.15);
    ctx.stroke();
    // ribcage
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.05);
    ctx.lineTo(0, s * 0.8);
    ctx.stroke();
    for (var i = 0; i < 3; i++) {
      var ry = s * 0.1 + i * s * 0.22;
      ctx.beginPath();
      ctx.moveTo(-s * 0.45, ry);
      ctx.quadraticCurveTo(0, ry + s * 0.15, s * 0.45, ry);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawWisp(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    var p = pulse(t, 8, 0.6, 1.0);
    // trailing particles
    for (var i = 0; i < 5; i++) {
      var ox = Math.sin(t * 3 + i * 1.3) * s * 0.7;
      var oy = Math.cos(t * 2.5 + i * 1.7) * s * 0.7 + s * 0.5;
      ctx.globalAlpha = 0.3 * p;
      glow(ctx, e.type.color, 6);
      ctx.fillStyle = e.type.color;
      circle(ctx, ox, oy, s * 0.2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // core orb
    glow(ctx, e.type.color, 15 * p);
    ctx.fillStyle = e.type.color;
    circle(ctx, 0, 0, s * p);
    ctx.fill();
    // bright center
    ctx.fillStyle = '#fff';
    circle(ctx, 0, 0, s * 0.4 * p);
    ctx.fill();
    noGlow(ctx);
    ctx.restore();
  }

  function drawShade(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    var alpha = e.abilityActive ? pulse(t, 20, 0.05, 0.25) : 0.85;
    ctx.globalAlpha = alpha;
    // hooded cloak
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.2);
    ctx.quadraticCurveTo(-s * 1.1, -s * 0.2, -s * 0.8, s);
    ctx.lineTo(s * 0.8, s);
    ctx.quadraticCurveTo(s * 1.1, -s * 0.2, 0, -s * 1.2);
    ctx.fill();
    // face void
    ctx.fillStyle = '#000';
    circle(ctx, 0, -s * 0.5, s * 0.4);
    ctx.fill();
    // glowing eyes
    if (!e.abilityActive) {
      glow(ctx, '#a040ff', 6);
      ctx.fillStyle = '#a040ff';
      circle(ctx, -s * 0.15, -s * 0.55, 2); ctx.fill();
      circle(ctx, s * 0.15, -s * 0.55, 2); ctx.fill();
      noGlow(ctx);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawScarab(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s, s * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    // shell line
    ctx.strokeStyle = e.type.accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.7);
    ctx.lineTo(0, s * 0.7);
    ctx.stroke();
    // legs
    ctx.strokeStyle = e.type.color;
    ctx.lineWidth = 1;
    var legWiggle = Math.sin(t * 20) * 0.2;
    for (var side = -1; side <= 1; side += 2) {
      for (var j = 0; j < 3; j++) {
        var ly = -s * 0.35 + j * s * 0.35;
        ctx.beginPath();
        ctx.moveTo(side * s * 0.6, ly);
        ctx.lineTo(side * s * 1.2, ly + legWiggle * s * side * (j % 2 === 0 ? 1 : -1));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawGolem(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // main body — chunky rectangle
    ctx.fillStyle = e.type.color;
    ctx.fillRect(-s, -s * 1.2, s * 2, s * 2.4);
    // shoulders
    ctx.fillRect(-s * 1.4, -s * 0.8, s * 0.5, s * 1.2);
    ctx.fillRect(s * 0.9, -s * 0.8, s * 0.5, s * 1.2);
    // cracks
    ctx.strokeStyle = e.type.accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 1.2);
    ctx.lineTo(-s * 0.2, -s * 0.3);
    ctx.lineTo(-s * 0.6, s * 0.4);
    ctx.moveTo(s * 0.3, -s * 0.6);
    ctx.lineTo(s * 0.5, s * 0.2);
    ctx.stroke();
    // eyes
    glow(ctx, '#f80', 6);
    ctx.fillStyle = '#f80';
    circle(ctx, -s * 0.35, -s * 0.7, s * 0.18); ctx.fill();
    circle(ctx, s * 0.35, -s * 0.7, s * 0.18); ctx.fill();
    noGlow(ctx);
    ctx.restore();
  }

  function drawTroll(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // hunched body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, s * 0.1, s * 0.9, s * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // head
    circle(ctx, 0, -s * 1.0, s * 0.5);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#ff0';
    circle(ctx, -s * 0.2, -s * 1.05, 2.5); ctx.fill();
    circle(ctx, s * 0.2, -s * 1.05, 2.5); ctx.fill();
    // club
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(s * 0.7, -s * 0.3);
    ctx.lineTo(s * 1.5, -s * 1.4);
    ctx.stroke();
    ctx.fillStyle = '#5a3a1a';
    circle(ctx, s * 1.5, -s * 1.5, s * 0.3);
    ctx.fill();
    // regen sparkle
    if (e.hp < e.maxHp) {
      ctx.globalAlpha = pulse(t, 4, 0.2, 0.7);
      glow(ctx, '#0f0', 6);
      ctx.fillStyle = '#0f0';
      circle(ctx, Math.sin(t * 5) * s * 0.3, -s * 0.3, 3);
      ctx.fill();
      noGlow(ctx);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawGargoyle(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    var wingFlap = Math.sin(t * 6) * 0.3;
    // wings
    ctx.fillStyle = e.type.accentColor;
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.2);
    ctx.lineTo(-s * 1.8, -s * 0.8 + wingFlap * s);
    ctx.lineTo(-s * 1.2, s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.4, -s * 0.2);
    ctx.lineTo(s * 1.8, -s * 0.8 + wingFlap * s);
    ctx.lineTo(s * 1.2, s * 0.3);
    ctx.closePath();
    ctx.fill();
    // body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.7, s, 0, 0, Math.PI * 2);
    ctx.fill();
    // head
    circle(ctx, 0, -s * 0.85, s * 0.4);
    ctx.fill();
    // horns
    ctx.strokeStyle = e.type.accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, -s * 1.1);
    ctx.lineTo(-s * 0.5, -s * 1.5);
    ctx.moveTo(s * 0.25, -s * 1.1);
    ctx.lineTo(s * 0.5, -s * 1.5);
    ctx.stroke();
    // eyes
    glow(ctx, '#f00', 4);
    ctx.fillStyle = '#f00';
    circle(ctx, -s * 0.15, -s * 0.9, 2); ctx.fill();
    circle(ctx, s * 0.15, -s * 0.9, 2); ctx.fill();
    noGlow(ctx);
    ctx.restore();
  }

  function drawWyvern(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    var wingFlap = Math.sin(t * 5) * 0.4;
    // wings (large)
    ctx.fillStyle = e.type.accentColor;
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, -s * 0.1);
    ctx.lineTo(-s * 2.2, -s * 1.0 + wingFlap * s);
    ctx.lineTo(-s * 1.8, s * 0.4);
    ctx.lineTo(-s * 0.5, s * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.4, -s * 0.1);
    ctx.lineTo(s * 2.2, -s * 1.0 + wingFlap * s);
    ctx.lineTo(s * 1.8, s * 0.4);
    ctx.lineTo(s * 0.5, s * 0.3);
    ctx.closePath();
    ctx.fill();
    // serpentine body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.6, s * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // neck and head
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.8);
    ctx.quadraticCurveTo(s * 0.4, -s * 1.5, 0, -s * 1.8);
    ctx.quadraticCurveTo(-s * 0.4, -s * 1.5, 0, -s * 0.8);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#f80';
    circle(ctx, -s * 0.1, -s * 1.55, 2); ctx.fill();
    circle(ctx, s * 0.1, -s * 1.55, 2); ctx.fill();
    // tail
    ctx.strokeStyle = e.type.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, s * 1.0);
    ctx.quadraticCurveTo(s * 0.5, s * 1.6, 0, s * 2.0);
    ctx.stroke();
    ctx.restore();
  }

  function drawPaladin(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // shield glow
    if (e.shieldHp > 0) {
      ctx.globalAlpha = 0.25 + 0.1 * Math.sin(t * 4);
      glow(ctx, '#4af', 12);
      ctx.fillStyle = '#4af';
      circle(ctx, 0, 0, s * 1.6);
      ctx.fill();
      noGlow(ctx);
      ctx.globalAlpha = 1;
    }
    // armor body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.1);
    ctx.lineTo(-s * 0.8, -s * 0.3);
    ctx.lineTo(-s * 0.7, s * 0.9);
    ctx.lineTo(s * 0.7, s * 0.9);
    ctx.lineTo(s * 0.8, -s * 0.3);
    ctx.closePath();
    ctx.fill();
    // helmet
    ctx.fillStyle = e.type.accentColor;
    circle(ctx, 0, -s * 0.85, s * 0.45);
    ctx.fill();
    // visor slit
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.85);
    ctx.lineTo(s * 0.2, -s * 0.85);
    ctx.stroke();
    // shield on arm
    ctx.fillStyle = '#36c';
    ctx.beginPath();
    ctx.moveTo(-s * 1.1, -s * 0.5);
    ctx.lineTo(-s * 0.7, -s * 0.5);
    ctx.lineTo(-s * 0.7, s * 0.2);
    ctx.lineTo(-s * 0.9, s * 0.5);
    ctx.lineTo(-s * 1.1, s * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawNecromancer(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // aura
    ctx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 3);
    glow(ctx, e.type.color, 15);
    ctx.fillStyle = e.type.color;
    circle(ctx, 0, 0, s * 2);
    ctx.fill();
    noGlow(ctx);
    ctx.globalAlpha = 1;
    // robes
    ctx.fillStyle = '#1a0a2a';
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.2);
    ctx.lineTo(-s * 0.9, s * 0.3);
    ctx.lineTo(-s * 1.0, s * 1.1);
    ctx.lineTo(s * 1.0, s * 1.1);
    ctx.lineTo(s * 0.9, s * 0.3);
    ctx.closePath();
    ctx.fill();
    // hood
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.5);
    ctx.quadraticCurveTo(-s * 0.7, -s * 0.8, -s * 0.5, -s * 0.3);
    ctx.quadraticCurveTo(0, -s * 0.5, s * 0.5, -s * 0.3);
    ctx.quadraticCurveTo(s * 0.7, -s * 0.8, 0, -s * 1.5);
    ctx.fill();
    // glowing eyes
    glow(ctx, e.type.color, 8);
    ctx.fillStyle = e.type.color;
    circle(ctx, -s * 0.18, -s * 0.85, 2.5); ctx.fill();
    circle(ctx, s * 0.18, -s * 0.85, 2.5); ctx.fill();
    noGlow(ctx);
    // staff
    ctx.strokeStyle = '#5a3a1a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(s * 0.8, s * 1.0);
    ctx.lineTo(s * 0.6, -s * 1.5);
    ctx.stroke();
    // orb on staff
    glow(ctx, e.type.color, 10);
    ctx.fillStyle = e.type.color;
    circle(ctx, s * 0.6, -s * 1.6, s * 0.25);
    ctx.fill();
    noGlow(ctx);
    ctx.restore();
  }

  function drawSlime(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    var wobble = Math.sin(t * 4) * s * 0.1;
    // translucent blob
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.moveTo(-s, s * 0.3);
    ctx.quadraticCurveTo(-s * 1.1, -s * 0.5 + wobble, 0, -s * 0.8 - wobble);
    ctx.quadraticCurveTo(s * 1.1, -s * 0.5 - wobble, s, s * 0.3);
    ctx.quadraticCurveTo(s * 0.3, s * 0.5, 0, s * 0.5);
    ctx.quadraticCurveTo(-s * 0.3, s * 0.5, -s, s * 0.3);
    ctx.fill();
    ctx.globalAlpha = 1;
    // highlight
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    circle(ctx, -s * 0.3, -s * 0.3, s * 0.25);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#000';
    circle(ctx, -s * 0.25, -s * 0.15, s * 0.12); ctx.fill();
    circle(ctx, s * 0.25, -s * 0.15, s * 0.12); ctx.fill();
    ctx.restore();
  }

  function drawSlimeling(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    var wobble = Math.sin(t * 6) * s * 0.12;
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.arc(0, wobble * 0.5, s, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    circle(ctx, -s * 0.2, -s * 0.2, s * 0.2);
    ctx.fill();
    ctx.fillStyle = '#000';
    circle(ctx, -s * 0.2, 0, s * 0.1); ctx.fill();
    circle(ctx, s * 0.2, 0, s * 0.1); ctx.fill();
    ctx.restore();
  }

  function drawMimic(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // chest body
    ctx.fillStyle = e.type.accentColor;
    ctx.fillRect(-s, -s * 0.3, s * 2, s * 1.3);
    // lid (open)
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.3);
    ctx.lineTo(-s * 1.05, -s * 1.0);
    ctx.lineTo(s * 1.05, -s * 1.0);
    ctx.lineTo(s, -s * 0.3);
    ctx.closePath();
    ctx.fill();
    // teeth
    ctx.fillStyle = '#fff';
    var teethCount = 6;
    for (var i = 0; i < teethCount; i++) {
      var tx = -s + (s * 2 / teethCount) * i + s / teethCount;
      ctx.beginPath();
      ctx.moveTo(tx - s * 0.1, -s * 0.3);
      ctx.lineTo(tx, -s * 0.05 + Math.sin(t * 8 + i) * s * 0.05);
      ctx.lineTo(tx + s * 0.1, -s * 0.3);
      ctx.fill();
    }
    // tongue
    ctx.strokeStyle = '#d44';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(s * 0.5, s * 0.6, Math.sin(t * 4) * s * 0.3, s * 0.8);
    ctx.stroke();
    // eye
    ctx.fillStyle = '#f00';
    circle(ctx, 0, -s * 0.65, s * 0.2);
    ctx.fill();
    ctx.fillStyle = '#000';
    circle(ctx, 0, -s * 0.65, s * 0.1);
    ctx.fill();
    // gold glow when sprinting
    if (e.abilityActive) {
      ctx.globalAlpha = 0.3;
      glow(ctx, '#fc0', 15);
      ctx.fillStyle = '#fc0';
      circle(ctx, 0, 0, s * 1.5);
      ctx.fill();
      noGlow(ctx);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawWraith(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    var alpha = e.abilityActive ? pulse(t, 18, 0.05, 0.2) : 0.75;
    ctx.globalAlpha = alpha;
    // shroud
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.4);
    ctx.quadraticCurveTo(-s * 1.2, -s * 0.3, -s * 0.9, s * 0.6);
    // tattered bottom
    ctx.lineTo(-s * 0.6, s * 1.1 + Math.sin(t * 4) * s * 0.15);
    ctx.lineTo(-s * 0.2, s * 0.8);
    ctx.lineTo(0, s * 1.2 + Math.sin(t * 4 + 1) * s * 0.15);
    ctx.lineTo(s * 0.2, s * 0.8);
    ctx.lineTo(s * 0.6, s * 1.1 + Math.sin(t * 4 + 2) * s * 0.15);
    ctx.lineTo(s * 0.9, s * 0.6);
    ctx.quadraticCurveTo(s * 1.2, -s * 0.3, 0, -s * 1.4);
    ctx.fill();
    // glowing eyes
    glow(ctx, '#f0f', 10);
    ctx.fillStyle = '#f0f';
    circle(ctx, -s * 0.2, -s * 0.7, 3); ctx.fill();
    circle(ctx, s * 0.2, -s * 0.7, 3); ctx.fill();
    noGlow(ctx);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ---- Boss draw functions ---- */

  function drawInfernalLord(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // fire aura
    ctx.globalAlpha = 0.2 + 0.1 * Math.sin(t * 3);
    glow(ctx, '#f40', 20);
    ctx.fillStyle = '#f40';
    circle(ctx, 0, 0, s * 1.8);
    ctx.fill();
    noGlow(ctx);
    ctx.globalAlpha = 1;
    // massive body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.9, s * 1.1, 0, 0, Math.PI * 2);
    ctx.fill();
    // head
    circle(ctx, 0, -s * 1.0, s * 0.5);
    ctx.fill();
    // large horns
    ctx.strokeStyle = '#2a0a0a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 1.3);
    ctx.quadraticCurveTo(-s * 0.8, -s * 2.0, -s * 0.5, -s * 2.2);
    ctx.moveTo(s * 0.3, -s * 1.3);
    ctx.quadraticCurveTo(s * 0.8, -s * 2.0, s * 0.5, -s * 2.2);
    ctx.stroke();
    // fiery eyes
    glow(ctx, '#ff0', 10);
    ctx.fillStyle = '#ff0';
    circle(ctx, -s * 0.2, -s * 1.05, 4); ctx.fill();
    circle(ctx, s * 0.2, -s * 1.05, 4); ctx.fill();
    noGlow(ctx);
    // arms with flame
    ctx.fillStyle = e.type.color;
    ctx.fillRect(-s * 1.3, -s * 0.5, s * 0.5, s * 1.2);
    ctx.fillRect(s * 0.8, -s * 0.5, s * 0.5, s * 1.2);
    // flames on fists
    for (var i = 0; i < 2; i++) {
      var fx = i === 0 ? -s * 1.05 : s * 1.05;
      ctx.fillStyle = '#f80';
      ctx.globalAlpha = pulse(t, 10, 0.5, 1.0);
      for (var f = 0; f < 3; f++) {
        var ff = Math.sin(t * 8 + f * 2) * s * 0.2;
        circle(ctx, fx + ff, s * 0.8 + f * s * 0.15, s * 0.2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawCrystalHydra(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    // crystal body
    glow(ctx, e.type.color, 10);
    ctx.fillStyle = e.type.color;
    ctx.globalAlpha = 0.6;
    // main body
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.5);
    ctx.lineTo(-s * 0.9, s * 0.4);
    ctx.lineTo(-s * 0.3, s * 1.0);
    ctx.lineTo(s * 0.3, s * 1.0);
    ctx.lineTo(s * 0.9, s * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    // three heads
    for (var h = -1; h <= 1; h++) {
      var hx = h * s * 0.7;
      var hy = -s * 1.0 - Math.abs(h) * s * 0.3;
      var sway = Math.sin(t * 3 + h * 2) * s * 0.15;
      // neck
      ctx.strokeStyle = e.type.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(h * s * 0.3, -s * 0.3);
      ctx.quadraticCurveTo(hx + sway, hy + s * 0.3, hx + sway, hy);
      ctx.stroke();
      // head
      ctx.fillStyle = e.type.accentColor;
      ctx.beginPath();
      ctx.moveTo(hx + sway, hy - s * 0.35);
      ctx.lineTo(hx + sway - s * 0.25, hy + s * 0.1);
      ctx.lineTo(hx + sway + s * 0.25, hy + s * 0.1);
      ctx.closePath();
      ctx.fill();
      // eyes
      ctx.fillStyle = '#fff';
      circle(ctx, hx + sway, hy - s * 0.08, 3);
      ctx.fill();
    }
    noGlow(ctx);
    ctx.restore();
  }

  function drawLichKing(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    // death aura
    ctx.globalAlpha = 0.15 + 0.08 * Math.sin(t * 2);
    glow(ctx, '#0f0', 25);
    ctx.fillStyle = '#0f0';
    circle(ctx, 0, 0, s * 2.2);
    ctx.fill();
    noGlow(ctx);
    ctx.globalAlpha = 1;
    // dark robes
    ctx.fillStyle = '#0a0a1a';
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.4);
    ctx.lineTo(-s * 1.1, s * 0.5);
    ctx.lineTo(-s * 1.2, s * 1.3);
    ctx.lineTo(s * 1.2, s * 1.3);
    ctx.lineTo(s * 1.1, s * 0.5);
    ctx.closePath();
    ctx.fill();
    // crown
    ctx.fillStyle = '#888';
    ctx.fillRect(-s * 0.5, -s * 1.7, s * 1.0, s * 0.3);
    // crown points
    for (var i = 0; i < 5; i++) {
      var cx = -s * 0.4 + i * s * 0.2;
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.08, -s * 1.7);
      ctx.lineTo(cx, -s * 2.0);
      ctx.lineTo(cx + s * 0.08, -s * 1.7);
      ctx.fill();
    }
    // skull face
    ctx.fillStyle = '#d0d0a0';
    circle(ctx, 0, -s * 1.1, s * 0.4);
    ctx.fill();
    ctx.fillStyle = '#000';
    circle(ctx, -s * 0.15, -s * 1.15, s * 0.1); ctx.fill();
    circle(ctx, s * 0.15, -s * 1.15, s * 0.1); ctx.fill();
    // green glowing eyes
    glow(ctx, '#0f0', 8);
    ctx.fillStyle = '#0f0';
    circle(ctx, -s * 0.15, -s * 1.15, s * 0.06); ctx.fill();
    circle(ctx, s * 0.15, -s * 1.15, s * 0.06); ctx.fill();
    noGlow(ctx);
    // staff
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(s * 0.9, s * 1.2);
    ctx.lineTo(s * 0.7, -s * 1.6);
    ctx.stroke();
    glow(ctx, '#0f0', 12);
    ctx.fillStyle = '#0f0';
    circle(ctx, s * 0.7, -s * 1.75, s * 0.3);
    ctx.fill();
    noGlow(ctx);
    ctx.restore();
  }

  function drawShadowDragon(ctx, e, t) {
    var s = e.type.size;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    var alpha = e.abilityActive ? pulse(t, 15, 0.05, 0.25) : 0.9;
    ctx.globalAlpha = alpha;
    var wingFlap = Math.sin(t * 4) * 0.35;
    // massive wings
    ctx.fillStyle = e.type.accentColor;
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, -s * 0.2);
    ctx.lineTo(-s * 2.8, -s * 1.2 + wingFlap * s);
    ctx.lineTo(-s * 2.4, s * 0.2);
    ctx.lineTo(-s * 1.6, s * 0.5);
    ctx.lineTo(-s * 0.5, s * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(s * 0.5, -s * 0.2);
    ctx.lineTo(s * 2.8, -s * 1.2 + wingFlap * s);
    ctx.lineTo(s * 2.4, s * 0.2);
    ctx.lineTo(s * 1.6, s * 0.5);
    ctx.lineTo(s * 0.5, s * 0.2);
    ctx.closePath();
    ctx.fill();
    // body
    ctx.fillStyle = e.type.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.8, s * 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
    // neck + head
    ctx.beginPath();
    ctx.moveTo(-s * 0.3, -s * 0.9);
    ctx.quadraticCurveTo(0, -s * 2.0, s * 0.3, -s * 0.9);
    ctx.fill();
    circle(ctx, 0, -s * 1.7, s * 0.4);
    ctx.fill();
    // horns
    ctx.strokeStyle = '#1a0a2a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 2.0);
    ctx.lineTo(-s * 0.6, -s * 2.5);
    ctx.moveTo(s * 0.2, -s * 2.0);
    ctx.lineTo(s * 0.6, -s * 2.5);
    ctx.stroke();
    // glowing eyes
    glow(ctx, '#f0f', 12);
    ctx.fillStyle = '#f0f';
    circle(ctx, -s * 0.12, -s * 1.75, 4); ctx.fill();
    circle(ctx, s * 0.12, -s * 1.75, 4); ctx.fill();
    noGlow(ctx);
    // tail
    ctx.strokeStyle = e.type.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, s * 1.1);
    ctx.quadraticCurveTo(s * 0.8, s * 2.0, Math.sin(t * 3) * s * 0.5, s * 2.8);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Enemy type definitions                                             */
  /* ------------------------------------------------------------------ */

  var TYPES = {
    imp: {
      id: 'imp', name: 'Imp',
      color: '#cc3333', accentColor: '#991111',
      size: 7, speed: 80, hp: 25, armor: 0, gold: 8,
      behavior: 'walk', flying: false,
      drawEnemy: drawImp,
    },
    goblin: {
      id: 'goblin', name: 'Goblin',
      color: '#44aa44', accentColor: '#2a7a2a',
      size: 9, speed: 60, hp: 35, armor: 0, gold: 10,
      behavior: 'walk', flying: false,
      drawEnemy: drawGoblin,
    },
    skeleton: {
      id: 'skeleton', name: 'Skeleton',
      color: '#d4cbb0', accentColor: '#8a8060',
      size: 10, speed: 45, hp: 50, armor: 1, gold: 12,
      behavior: 'walk', flying: false,
      drawEnemy: drawSkeleton,
    },
    wisp: {
      id: 'wisp', name: 'Wisp',
      color: '#44ffff', accentColor: '#00cccc',
      size: 6, speed: 120, hp: 20, armor: 0, gold: 8,
      behavior: 'walk', flying: true,
      drawEnemy: drawWisp,
    },
    shade: {
      id: 'shade', name: 'Shade',
      color: '#6a2a8a', accentColor: '#4a1060',
      size: 9, speed: 90, hp: 40, armor: 0, gold: 12,
      behavior: 'phase', flying: false,
      phaseInterval: 4, phaseDuration: 1,
      drawEnemy: drawShade,
    },
    scarab: {
      id: 'scarab', name: 'Scarab',
      color: '#b89040', accentColor: '#806020',
      size: 5, speed: 110, hp: 15, armor: 0, gold: 3,
      behavior: 'walk', flying: false,
      drawEnemy: drawScarab,
    },
    stoneGolem: {
      id: 'stoneGolem', name: 'Stone Golem',
      color: '#888888', accentColor: '#555555',
      size: 16, speed: 25, hp: 300, armor: 5, gold: 30,
      behavior: 'walk', flying: false,
      drawEnemy: drawGolem,
    },
    troll: {
      id: 'troll', name: 'Troll',
      color: '#5a7a40', accentColor: '#3a5a20',
      size: 14, speed: 35, hp: 220, armor: 2, gold: 25,
      behavior: 'regen', flying: false,
      regenRate: 5,
      drawEnemy: drawTroll,
    },
    gargoyle: {
      id: 'gargoyle', name: 'Gargoyle',
      color: '#7088a0', accentColor: '#506878',
      size: 11, speed: 55, hp: 100, armor: 2, gold: 18,
      behavior: 'walk', flying: true,
      drawEnemy: drawGargoyle,
    },
    wyvern: {
      id: 'wyvern', name: 'Wyvern',
      color: '#a04030', accentColor: '#703020',
      size: 13, speed: 70, hp: 160, armor: 1, gold: 22,
      behavior: 'walk', flying: true,
      drawEnemy: drawWyvern,
    },
    darkPaladin: {
      id: 'darkPaladin', name: 'Dark Paladin',
      color: '#3366aa', accentColor: '#aabbdd',
      size: 12, speed: 40, hp: 120, armor: 3, gold: 25,
      behavior: 'shield', flying: false,
      shieldHp: 60,
      drawEnemy: drawPaladin,
    },
    necromancer: {
      id: 'necromancer', name: 'Necromancer',
      color: '#33dd55', accentColor: '#118833',
      size: 10, speed: 40, hp: 80, armor: 0, gold: 28,
      behavior: 'healer', flying: false,
      healRate: 10, healRadius: 80,
      drawEnemy: drawNecromancer,
    },
    slime: {
      id: 'slime', name: 'Slime',
      color: '#55cc44', accentColor: '#33aa22',
      size: 13, speed: 35, hp: 150, armor: 0, gold: 18,
      behavior: 'split', flying: false,
      splitType: 'slimeling', splitCount: 3,
      drawEnemy: drawSlime,
    },
    slimeling: {
      id: 'slimeling', name: 'Slimeling',
      color: '#77ee55', accentColor: '#55cc33',
      size: 6, speed: 75, hp: 25, armor: 0, gold: 4,
      behavior: 'walk', flying: false,
      drawEnemy: drawSlimeling,
    },
    mimic: {
      id: 'mimic', name: 'Mimic',
      color: '#ddaa33', accentColor: '#8a6a10',
      size: 11, speed: 45, hp: 130, armor: 2, gold: 35,
      behavior: 'speedburst', flying: false,
      burstInterval: 5, burstDuration: 1.5, burstMultiplier: 3,
      drawEnemy: drawMimic,
    },
    wraith: {
      id: 'wraith', name: 'Wraith',
      color: '#5a1a7a', accentColor: '#3a0a5a',
      size: 10, speed: 80, hp: 90, armor: 0, gold: 30,
      behavior: 'phase', flying: false,
      phaseInterval: 3.5, phaseDuration: 1,
      nexusDrain: 2,
      drawEnemy: drawWraith,
    },
    infernalLord: {
      id: 'infernalLord', name: 'Infernal Lord',
      color: '#881111', accentColor: '#ff4400',
      size: 28, speed: 22, hp: 2000, armor: 5, gold: 200,
      behavior: 'boss', flying: false,
      bossAbility: 'fireNova', abilityInterval: 8, abilityRadius: 100, abilityDamage: 0,
      drawEnemy: drawInfernalLord,
    },
    crystalHydra: {
      id: 'crystalHydra', name: 'Crystal Hydra',
      color: '#44dddd', accentColor: '#88ffff',
      size: 30, speed: 20, hp: 3000, armor: 3, gold: 350,
      behavior: 'boss', flying: false,
      bossAbility: 'summon', abilityInterval: 10, summonType: 'wisp', summonCount: 3,
      drawEnemy: drawCrystalHydra,
    },
    lichKing: {
      id: 'lichKing', name: 'Lich King',
      color: '#22cc44', accentColor: '#88ff88',
      size: 26, speed: 22, hp: 2500, armor: 4, gold: 400,
      behavior: 'boss', flying: false,
      bossAbility: 'massHeal', abilityInterval: 12, healPercent: 0.15,
      drawEnemy: drawLichKing,
    },
    shadowDragon: {
      id: 'shadowDragon', name: 'Shadow Dragon',
      color: '#3a1050', accentColor: '#2a0a3a',
      size: 35, speed: 30, hp: 5000, armor: 8, gold: 600,
      behavior: 'boss', flying: true,
      bossAbility: 'phase', abilityInterval: 8, phaseDuration: 2,
      drawEnemy: drawShadowDragon,
    },
  };

  /* ------------------------------------------------------------------ */
  /*  Enemy instance factory                                             */
  /* ------------------------------------------------------------------ */

  function createEnemy(typeId, path, spawnIndex) {
    var type = TYPES[typeId];
    if (!type) { throw new Error('Unknown enemy type: ' + typeId); }
    var start = path[0] || { x: 0, y: 0 };
    var enemy = {
      id:         nextId++,
      type:       type,
      x:          start.x,
      y:          start.y,
      hp:         type.hp,
      maxHp:      type.hp,
      armor:      type.armor,
      shieldHp:   type.shieldHp || 0,
      maxShieldHp: type.shieldHp || 0,
      speed:      type.speed,
      baseSpeed:  type.speed,
      pathIndex:  0,
      path:       path,
      spawnIndex: spawnIndex || 0,
      flying:     type.flying,
      statuses:   [],
      abilityTimer:  0,
      abilityActive: false,
      hitFlash:   0,
      dead:       false,
      reachedNexus: false,
      angle:      0,
    };
    return enemy;
  }

  /* ------------------------------------------------------------------ */
  /*  Damage formula                                                     */
  /* ------------------------------------------------------------------ */

  function applyDamage(enemy, rawDamage, armorPierce) {
    if (enemy.dead) return 0;
    armorPierce = armorPierce || 0;
    var effectiveArmor = Math.max(0, enemy.armor * (1 - armorPierce));
    var shatterStatus = getStatus(enemy, STATUS.shatter);
    var bonusMult = shatterStatus ? 1 + shatterStatus.intensity : 1;
    var damage = Math.max(1, rawDamage - effectiveArmor) * bonusMult;
    damage = Math.round(damage);
    // shield absorbs first
    if (enemy.shieldHp > 0) {
      if (damage <= enemy.shieldHp) {
        enemy.shieldHp -= damage;
        enemy.hitFlash = 0.1;
        return damage;
      } else {
        damage -= enemy.shieldHp;
        enemy.shieldHp = 0;
      }
    }
    enemy.hp -= damage;
    enemy.hitFlash = 0.1;
    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.dead = true;
    }
    return damage;
  }

  /* ------------------------------------------------------------------ */
  /*  Status effects                                                     */
  /* ------------------------------------------------------------------ */

  function getStatus(enemy, type) {
    for (var i = 0; i < enemy.statuses.length; i++) {
      if (enemy.statuses[i].type === type) return enemy.statuses[i];
    }
    return null;
  }

  function applyStatus(enemy, status) {
    // status: { type, duration, intensity, source }
    // intensity: burn/poison = DPS, slow = fraction (0.5 = 50% slow), shatter = bonus dmg fraction
    if (enemy.dead) return;
    var existing = getStatus(enemy, status.type);
    if (existing) {
      // refresh duration, take stronger intensity
      existing.duration = Math.max(existing.duration, status.duration);
      existing.intensity = Math.max(existing.intensity, status.intensity);
      if (status.type === STATUS.poison) {
        // poison stacks
        existing.intensity += status.intensity;
      }
    } else {
      enemy.statuses.push({
        type:      status.type,
        duration:  status.duration,
        intensity: status.intensity || 0,
        timer:     0,
      });
    }
  }

  function tickStatuses(enemy, dt) {
    if (enemy.dead) return;
    var slowFactor = 1;
    var frozen = false;
    var rooted = false;
    var stunned = false;

    for (var i = enemy.statuses.length - 1; i >= 0; i--) {
      var s = enemy.statuses[i];
      s.duration -= dt;
      if (s.duration <= 0) {
        enemy.statuses.splice(i, 1);
        continue;
      }
      switch (s.type) {
        case STATUS.burn:
          enemy.hp -= s.intensity * dt;
          break;
        case STATUS.poison:
          enemy.hp -= s.intensity * dt;
          break;
        case STATUS.slow:
          slowFactor = Math.min(slowFactor, 1 - s.intensity);
          break;
        case STATUS.freeze:
          frozen = true;
          break;
        case STATUS.root:
          rooted = true;
          break;
        case STATUS.stun:
          stunned = true;
          break;
        case STATUS.shatter:
          // handled in applyDamage
          break;
      }
    }

    // apply speed modifications
    enemy.speed = enemy.baseSpeed;
    if (frozen || rooted || stunned) {
      enemy.speed = 0;
    } else {
      enemy.speed *= Math.max(0.1, slowFactor);
    }

    // stun prevents abilities
    enemy._stunned = stunned || frozen;

    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.dead = true;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Movement                                                           */
  /* ------------------------------------------------------------------ */

  function moveEnemy(enemy, dt, nexus) {
    if (enemy.dead || enemy.speed <= 0) return;

    if (enemy.flying) {
      // fly directly toward nexus with a sine-wave bob
      var dx = nexus.x - enemy.x;
      var dy = nexus.y - enemy.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 5) {
        enemy.reachedNexus = true;
        return;
      }
      var nx = dx / dist;
      var ny = dy / dist;
      var step = enemy.speed * dt;
      // perpendicular bob
      var bob = Math.sin(enemy.id * 3 + enemy.x * 0.05 + enemy.y * 0.05) * 15;
      enemy.x += nx * step + (-ny) * bob * dt;
      enemy.y += ny * step + nx * bob * dt;
      enemy.angle = Math.atan2(ny, nx) + Math.PI / 2;
    } else {
      // follow path waypoints
      if (enemy.pathIndex >= enemy.path.length) {
        enemy.reachedNexus = true;
        return;
      }
      var wp = enemy.path[enemy.pathIndex];
      var dx2 = wp.x - enemy.x;
      var dy2 = wp.y - enemy.y;
      var d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      if (d < 2) {
        enemy.pathIndex++;
        return;
      }
      var step2 = Math.min(enemy.speed * dt, d);
      enemy.x += (dx2 / d) * step2;
      enemy.y += (dy2 / d) * step2;
      enemy.angle = Math.atan2(dy2, dx2) + Math.PI / 2;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Behavior system                                                    */
  /* ------------------------------------------------------------------ */

  function updateBehavior(enemy, dt, enemies, callbacks) {
    if (enemy.dead || enemy._stunned) return;
    var type = enemy.type;

    enemy.abilityTimer += dt;

    switch (type.behavior) {

      case 'phase': {
        var interval = type.phaseInterval || 4;
        var dur = type.phaseDuration || 1;
        var cycle = enemy.abilityTimer % (interval + dur);
        enemy.abilityActive = cycle >= interval;
        break;
      }

      case 'regen': {
        var rate = type.regenRate || 5;
        if (enemy.hp < enemy.maxHp) {
          enemy.hp = Math.min(enemy.maxHp, enemy.hp + rate * dt);
        }
        break;
      }

      case 'shield': {
        // shield is passive — handled by applyDamage
        break;
      }

      case 'healer': {
        var hRate = type.healRate || 10;
        var hRadius = type.healRadius || 80;
        // heal every tick
        for (var i = 0; i < enemies.length; i++) {
          var other = enemies[i];
          if (other === enemy || other.dead) continue;
          var dx = other.x - enemy.x;
          var dy = other.y - enemy.y;
          if (dx * dx + dy * dy <= hRadius * hRadius) {
            if (other.hp < other.maxHp) {
              other.hp = Math.min(other.maxHp, other.hp + hRate * dt);
            }
          }
        }
        break;
      }

      case 'split': {
        // handled on death in updateAll
        break;
      }

      case 'speedburst': {
        var bInterval = type.burstInterval || 5;
        var bDur = type.burstDuration || 1.5;
        var bMult = type.burstMultiplier || 3;
        var bCycle = enemy.abilityTimer % (bInterval + bDur);
        enemy.abilityActive = bCycle >= bInterval;
        if (enemy.abilityActive && !enemy._stunned) {
          enemy.speed = enemy.baseSpeed * bMult;
        }
        break;
      }

      case 'boss': {
        var aInterval = type.abilityInterval || 10;
        if (enemy.abilityTimer >= aInterval) {
          enemy.abilityTimer = 0;
          executeBossAbility(enemy, enemies, callbacks);
        }
        // Shadow Dragon phase
        if (type.bossAbility === 'phase') {
          var pDur = type.phaseDuration || 2;
          enemy.abilityActive = enemy.abilityTimer < pDur;
        }
        break;
      }

      // 'walk' — no special behavior
    }
  }

  function executeBossAbility(enemy, enemies, callbacks) {
    var type = enemy.type;
    switch (type.bossAbility) {
      case 'fireNova':
        // visual callback; no direct tower damage (flavor)
        if (callbacks && callbacks.onBossAbility) {
          callbacks.onBossAbility(enemy, 'fireNova', { x: enemy.x, y: enemy.y, radius: type.abilityRadius });
        }
        break;
      case 'summon':
        if (callbacks && callbacks.onSummon) {
          callbacks.onSummon(enemy, type.summonType, type.summonCount || 3);
        }
        break;
      case 'massHeal':
        var pct = type.healPercent || 0.15;
        for (var i = 0; i < enemies.length; i++) {
          var e = enemies[i];
          if (!e.dead) {
            e.hp = Math.min(e.maxHp, e.hp + e.maxHp * pct);
          }
        }
        if (callbacks && callbacks.onBossAbility) {
          callbacks.onBossAbility(enemy, 'massHeal', { percent: pct });
        }
        break;
      case 'phase':
        // handled in updateBehavior
        break;
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Master update                                                      */
  /* ------------------------------------------------------------------ */

  function updateAll(enemies, dt, nexus, callbacks) {
    // callbacks: { onDeath, onReachNexus, onSummon, onBossAbility, onSplit }
    callbacks = callbacks || {};
    var spawned = [];

    for (var i = enemies.length - 1; i >= 0; i--) {
      var e = enemies[i];
      if (e.dead) continue;

      // tick hit flash
      if (e.hitFlash > 0) e.hitFlash = Math.max(0, e.hitFlash - dt);

      tickStatuses(e, dt);
      if (e.dead) {
        handleDeath(e, enemies, spawned, callbacks);
        continue;
      }

      updateBehavior(e, dt, enemies, callbacks);
      moveEnemy(e, dt, nexus);

      if (e.reachedNexus) {
        var drain = e.type.nexusDrain || 1;
        if (callbacks.onReachNexus) callbacks.onReachNexus(e, drain);
      }
    }

    // add any spawned enemies (from splits, summons)
    for (var j = 0; j < spawned.length; j++) {
      enemies.push(spawned[j]);
    }
  }

  function handleDeath(enemy, enemies, spawned, callbacks) {
    if (enemy.type.behavior === 'split') {
      var splitType = enemy.type.splitType || 'slimeling';
      var count = enemy.type.splitCount || 3;
      for (var s = 0; s < count; s++) {
        var child = createEnemy(splitType, enemy.path, enemy.spawnIndex);
        child.pathIndex = enemy.pathIndex;
        child.x = enemy.x + (Math.random() - 0.5) * 20;
        child.y = enemy.y + (Math.random() - 0.5) * 20;
        spawned.push(child);
      }
      if (callbacks.onSplit) callbacks.onSplit(enemy, count);
    }
    if (callbacks.onDeath) callbacks.onDeath(enemy);
  }

  /* ------------------------------------------------------------------ */
  /*  Wave system                                                        */
  /* ------------------------------------------------------------------ */

  // Progressive unlock table
  var waveUnlocks = [
    { wave: 1,  types: ['imp', 'goblin'] },
    { wave: 2,  types: ['skeleton'] },
    { wave: 4,  types: ['wisp', 'shade', 'scarab'] },
    { wave: 6,  types: ['stoneGolem', 'troll'] },
    { wave: 8,  types: ['gargoyle'] },
    { wave: 10, types: ['wyvern', 'darkPaladin', 'necromancer', 'slime'] },
    { wave: 14, types: ['mimic'] },
    { wave: 16, types: ['wraith'] },
  ];

  var bossWaves = {
    5:  'infernalLord',
    10: 'crystalHydra',
    15: 'lichKing',
    20: 'shadowDragon',
  };

  function getAvailableTypes(waveNum) {
    var available = [];
    for (var i = 0; i < waveUnlocks.length; i++) {
      if (waveNum >= waveUnlocks[i].wave) {
        available = available.concat(waveUnlocks[i].types);
      }
    }
    return available;
  }

  function getWave(waveNum) {
    var hpMult = 1.0 + (waveNum - 1) * 0.08 + Math.pow(waveNum / 12, 1.6) * 0.4;
    var speedMult = 1.0 + waveNum * 0.015;
    var armorBonus = Math.floor(waveNum / 5);
    var goldBonus = 20 + Math.floor(waveNum * 5);
    var totalCount = Math.min(50, 5 + Math.floor(waveNum * 2.5));

    var bossId = bossWaves[waveNum] || null;
    // For boss waves beyond 20, cycle through bosses with scaling
    if (!bossId && waveNum > 20 && waveNum % 5 === 0) {
      var bossKeys = Object.keys(bossWaves);
      bossId = bossWaves[bossKeys[((waveNum / 5 - 1) % bossKeys.length)]];
    }

    var available = getAvailableTypes(waveNum);
    var groups = [];
    var remaining = totalCount;

    // boss group
    if (bossId) {
      groups.push({
        type: bossId,
        count: 1,
        delay: 0,
        spawnIndex: 0,
        startDelay: 3.0,
      });
      // escort
      remaining = Math.max(5, Math.floor(remaining * 0.6));
    }

    // distribute remaining enemies into 2-4 groups
    var numGroups = Math.min(4, Math.max(2, Math.floor(waveNum / 3) + 1));
    var perGroup = Math.floor(remaining / numGroups);
    var delay = 0;

    for (var g = 0; g < numGroups; g++) {
      var count = g === numGroups - 1 ? remaining - perGroup * g : perGroup;
      if (count <= 0) continue;
      var typeId = available[Math.floor(seededRandom(waveNum * 100 + g * 7) * available.length)];
      groups.push({
        type: typeId,
        count: count,
        delay: 0.5 + 0.3 / Math.max(1, waveNum * 0.1),
        spawnIndex: g % 4,
        startDelay: delay,
      });
      delay += count * 0.25 + 1.0;
    }

    return {
      waveNum:    waveNum,
      groups:     groups,
      boss:       bossId,
      goldBonus:  goldBonus,
      hpMult:     hpMult,
      speedMult:  speedMult,
      armorBonus: armorBonus,
    };
  }

  // simple deterministic random for wave composition
  function seededRandom(seed) {
    var x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  }

  /* ------------------------------------------------------------------ */
  /*  Spawning                                                           */
  /* ------------------------------------------------------------------ */

  var activeSpawners = [];
  var currentWaveData = null;

  function startWave(waveNum, paths) {
    currentWaveData = getWave(waveNum);
    activeSpawners = [];

    for (var i = 0; i < currentWaveData.groups.length; i++) {
      var g = currentWaveData.groups[i];
      var pathIndex = Math.min(g.spawnIndex, paths.length - 1);
      activeSpawners.push({
        typeId:     g.type,
        count:      g.count,
        spawned:    0,
        delay:      g.delay,
        timer:      0,
        startDelay: g.startDelay || 0,
        started:    false,
        path:       paths[pathIndex],
        spawnIndex: g.spawnIndex,
        hpMult:     currentWaveData.hpMult,
        speedMult:  currentWaveData.speedMult,
        armorBonus: currentWaveData.armorBonus,
      });
    }

    return currentWaveData;
  }

  function updateSpawning(dt) {
    var newEnemies = [];

    for (var i = activeSpawners.length - 1; i >= 0; i--) {
      var sp = activeSpawners[i];

      // start delay
      if (!sp.started) {
        sp.startDelay -= dt;
        if (sp.startDelay > 0) continue;
        sp.started = true;
      }

      if (sp.spawned >= sp.count) {
        activeSpawners.splice(i, 1);
        continue;
      }

      sp.timer -= dt;
      if (sp.timer <= 0) {
        sp.timer += sp.delay;
        var enemy = createEnemy(sp.typeId, sp.path, sp.spawnIndex);
        // apply wave scaling
        enemy.hp = Math.round(enemy.hp * sp.hpMult);
        enemy.maxHp = enemy.hp;
        enemy.speed = Math.round(enemy.speed * sp.speedMult);
        enemy.baseSpeed = enemy.speed;
        enemy.armor += sp.armorBonus;
        // scale shield too
        if (enemy.shieldHp > 0) {
          enemy.shieldHp = Math.round(enemy.shieldHp * sp.hpMult);
          enemy.maxShieldHp = enemy.shieldHp;
        }
        sp.spawned++;
        newEnemies.push(enemy);
      }
    }

    return newEnemies;
  }

  function isSpawningDone() {
    return activeSpawners.length === 0;
  }

  /* ------------------------------------------------------------------ */
  /*  Drawing: health bars & status indicators                           */
  /* ------------------------------------------------------------------ */

  function drawHealthBar(ctx, enemy) {
    var s = enemy.type.size;
    var barW = s * 2.4;
    var barH = 3;
    var x = enemy.x - barW / 2;
    var y = enemy.y - s * 1.6 - 4;

    // shield bar (above hp)
    if (enemy.maxShieldHp > 0) {
      var sy = y - barH - 1;
      ctx.fillStyle = '#222';
      ctx.fillRect(x, sy, barW, barH);
      var sFrac = enemy.shieldHp / enemy.maxShieldHp;
      ctx.fillStyle = '#66aaff';
      ctx.fillRect(x, sy, barW * sFrac, barH);
    }

    // hp bar
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, barW, barH);
    var frac = enemy.hp / enemy.maxHp;
    var col = frac > 0.6 ? '#4c4' : frac > 0.3 ? '#cc4' : '#c44';
    ctx.fillStyle = col;
    ctx.fillRect(x, y, barW * frac, barH);
  }

  function drawStatusIndicators(ctx, enemy, time) {
    if (enemy.statuses.length === 0) return;
    var s = enemy.type.size;
    var ix = enemy.x - s;
    var iy = enemy.y - s * 1.6 - 12;
    var iconSize = 4;
    var gap = 2;

    for (var i = 0; i < enemy.statuses.length; i++) {
      var st = enemy.statuses[i];
      var sx = ix + i * (iconSize * 2 + gap);
      switch (st.type) {
        case STATUS.burn:
          ctx.fillStyle = '#f80';
          break;
        case STATUS.poison:
          ctx.fillStyle = '#0d0';
          break;
        case STATUS.slow:
          ctx.fillStyle = '#88f';
          break;
        case STATUS.freeze:
          ctx.fillStyle = '#aef';
          break;
        case STATUS.root:
          ctx.fillStyle = '#a62';
          break;
        case STATUS.stun:
          ctx.fillStyle = '#ff0';
          break;
        case STATUS.shatter:
          ctx.fillStyle = '#f4f';
          break;
        default:
          ctx.fillStyle = '#fff';
      }
      ctx.fillRect(sx, iy, iconSize * 2, iconSize * 2);
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Draw single enemy                                                  */
  /* ------------------------------------------------------------------ */

  function drawEnemySingle(ctx, enemy, time) {
    if (enemy.dead) return;

    ctx.save();

    // untargetable enemies are semi-transparent
    if (enemy.abilityActive && (enemy.type.behavior === 'phase' || (enemy.type.behavior === 'boss' && enemy.type.bossAbility === 'phase'))) {
      ctx.globalAlpha = 0.3;
    }

    // hit flash
    if (enemy.hitFlash > 0) {
      // draw a white flash overlay after main draw
    }

    // delegate to type draw function
    enemy.type.drawEnemy(ctx, enemy, time);

    // hit flash overlay
    if (enemy.hitFlash > 0) {
      ctx.globalAlpha = enemy.hitFlash * 5;
      ctx.fillStyle = '#fff';
      circle(ctx, enemy.x, enemy.y, enemy.type.size * 1.1);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();

    // health bar (always visible if damaged or boss)
    if (enemy.hp < enemy.maxHp || enemy.type.behavior === 'boss') {
      drawHealthBar(ctx, enemy);
    }

    // status effect indicators
    drawStatusIndicators(ctx, enemy, time);
  }

  /* ------------------------------------------------------------------ */
  /*  Draw all enemies (sorted by y for depth)                           */
  /* ------------------------------------------------------------------ */

  function drawAll(ctx, enemies, cam, time) {
    // sort by y for painter's order
    var sorted = enemies.filter(function (e) { return !e.dead; });
    sorted.sort(function (a, b) { return a.y - b.y; });

    ctx.save();
    if (cam) {
      ctx.translate(-cam.x, -cam.y);
      if (cam.scale) ctx.scale(cam.scale, cam.scale);
    }

    for (var i = 0; i < sorted.length; i++) {
      drawEnemySingle(ctx, sorted[i], time);
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /*  Public API                                                         */
  /* ------------------------------------------------------------------ */

  var ArcaneEnemies = {
    STATUS:         STATUS,
    TYPES:          TYPES,
    createEnemy:    createEnemy,
    applyDamage:    applyDamage,
    applyStatus:    applyStatus,
    updateAll:      updateAll,
    getWave:        getWave,
    startWave:      startWave,
    updateSpawning: updateSpawning,
    isSpawningDone: isSpawningDone,
    drawEnemy:      drawEnemySingle,
    drawAll:        drawAll,
  };

  window.ArcaneEnemies = ArcaneEnemies;

})();
