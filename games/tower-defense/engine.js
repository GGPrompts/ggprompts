/**
 * Arcane Bastion — Engine (Orchestrator)
 *
 * Ties together ArcaneMap, ArcaneTowers, ArcaneEnemies, ArcaneFX into
 * a playable tower-defense game with state machine, game loop, input,
 * audio, HUD, and all integration glue.
 */
(function () {
  'use strict';

  // ─────────────────────────── Module Aliases ──────────────────────────
  var Map      = window.ArcaneMap;
  var Towers   = window.ArcaneTowers;
  var Enemies  = window.ArcaneEnemies;
  var FX       = window.ArcaneFX;
  var CELL     = Map.CELL_SIZE;

  // ─────────────────────────── Canvas Setup ────────────────────────────
  var canvas = document.getElementById('game-canvas');
  var ctx    = canvas.getContext('2d');
  var dpr    = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    canvas.width  = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ─────────────────────────── State Machine ───────────────────────────
  // States: menu, build, wave, paused, gameover, victory
  var state         = 'menu';
  var prevState     = 'menu'; // For resuming from pause

  // ─────────────────────────── Game State ──────────────────────────────
  var gold           = 400;
  var mana           = 0;
  var currentWave    = 0;
  var totalWaves     = 20;
  var towers         = [];     // Array of tower objects
  var enemies        = [];     // Array of live enemy objects
  var gameSpeed      = 1;
  var buildTimer     = 0;
  var buildTimerMax  = 30;
  var firstBuild     = true;
  var currentWaveData = null;
  var totalKills     = 0;
  var totalGoldEarned = 0;

  // Camera
  var cam = { x: 0, y: 0, w: 0, h: 0 };

  // Screen shake
  var shakeX = 0, shakeY = 0, shakeMag = 0, shakeTimer = 0;

  // Placement
  var placementMode  = false;
  var placementType  = null;   // Tower type id string
  var mouseX = 0, mouseY = 0;
  var mouseGridCol = -1, mouseGridRow = -1;
  var mouseOnCanvas = false;

  // Selection
  var selectedTower  = null;
  var towerPlaceCount = 0;
  var tipTimer       = 0;
  var tipText        = '';

  // Wave banner animation
  var bannerTimer    = 0;
  var bannerDuration = 2.5;
  var bannerText     = '';
  var bannerSub      = '';

  // Timing
  var lastTime = 0;

  // ─────────────────────────── Audio Engine ─────────────────────────────
  var Audio = (function () {
    var actx = null;
    var masterGain = null;
    var initialized = false;

    // Looping sound node references
    var portalHumNodes = null;
    var nexusAlarmInterval = null;
    var nexusAlarmActive = false;

    function init() {
      if (initialized) return;
      try {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = actx.createGain();
        masterGain.gain.value = 0.25;
        masterGain.connect(actx.destination);
        initialized = true;
      } catch (e) { /* silent */ }
    }

    function now() { return actx ? actx.currentTime : 0; }

    function osc(type, freq, dur, vol, detune) {
      if (!actx) return;
      var o = actx.createOscillator();
      var g = actx.createGain();
      o.type = type;
      o.frequency.value = freq;
      if (detune) o.detune.value = detune;
      g.gain.setValueAtTime(vol || 0.15, now());
      g.gain.exponentialRampToValueAtTime(0.001, now() + dur);
      o.connect(g);
      g.connect(masterGain);
      o.start(now());
      o.stop(now() + dur + 0.05);
    }

    function noise(dur, vol) {
      if (!actx) return;
      var len = Math.floor(actx.sampleRate * dur);
      var buf = actx.createBuffer(1, len, actx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1);
      var src = actx.createBufferSource();
      src.buffer = buf;
      var g = actx.createGain();
      g.gain.setValueAtTime(vol || 0.05, now());
      g.gain.exponentialRampToValueAtTime(0.001, now() + dur);
      src.connect(g);
      g.connect(masterGain);
      src.start(now());
      src.stop(now() + dur + 0.02);
    }

    // Filtered noise helper — noise through a filter with frequency sweep
    function filteredNoise(dur, vol, filterType, freqStart, freqEnd) {
      if (!actx) return;
      var len = Math.floor(actx.sampleRate * dur);
      var buf = actx.createBuffer(1, len, actx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1);
      var src = actx.createBufferSource();
      src.buffer = buf;
      var filt = actx.createBiquadFilter();
      filt.type = filterType;
      filt.frequency.setValueAtTime(freqStart, now());
      filt.frequency.exponentialRampToValueAtTime(freqEnd, now() + dur);
      filt.Q.value = 2;
      var g = actx.createGain();
      g.gain.setValueAtTime(vol || 0.05, now());
      g.gain.exponentialRampToValueAtTime(0.001, now() + dur);
      src.connect(filt);
      filt.connect(g);
      g.connect(masterGain);
      src.start(now());
      src.stop(now() + dur + 0.02);
    }

    // Filtered oscillator helper — osc through a filter with frequency sweep
    function filteredOsc(oscType, oscFreqStart, oscFreqEnd, dur, vol, filterType, filtFreqStart, filtFreqEnd) {
      if (!actx) return;
      var o = actx.createOscillator();
      o.type = oscType;
      o.frequency.setValueAtTime(oscFreqStart, now());
      o.frequency.exponentialRampToValueAtTime(oscFreqEnd, now() + dur);
      var filt = actx.createBiquadFilter();
      filt.type = filterType;
      filt.frequency.setValueAtTime(filtFreqStart, now());
      filt.frequency.exponentialRampToValueAtTime(filtFreqEnd, now() + dur);
      filt.Q.value = 3;
      var g = actx.createGain();
      g.gain.setValueAtTime(vol || 0.08, now());
      g.gain.exponentialRampToValueAtTime(0.001, now() + dur);
      o.connect(filt);
      filt.connect(g);
      g.connect(masterGain);
      o.start(now());
      o.stop(now() + dur + 0.05);
    }

    return {
      init: init,
      // Tower fire sounds — element-themed blips
      towerFire: function (element) {
        init();
        switch (element) {
          case 'fire':      osc('sawtooth', 600, 0.08, 0.10); noise(0.06, 0.04); break;
          case 'ice':       osc('sine', 1400, 0.1, 0.08); osc('sine', 1800, 0.06, 0.05); break;
          case 'lightning':  osc('square', 800, 0.04, 0.08); osc('square', 1200, 0.03, 0.06); noise(0.03, 0.06); break;
          case 'earth':     osc('triangle', 200, 0.12, 0.12); osc('sine', 120, 0.15, 0.06); break;
          case 'arcane':    osc('sine', 700, 0.15, 0.08); osc('sine', 1050, 0.12, 0.05); break;
          case 'nature':    osc('sine', 500, 0.12, 0.06); osc('triangle', 750, 0.1, 0.04); break;
          case 'shadow':    osc('sawtooth', 250, 0.12, 0.06); osc('sine', 375, 0.1, 0.04); break;
          case 'light':     osc('sine', 1000, 0.08, 0.08); osc('sine', 1500, 0.06, 0.05); break;
          default:          osc('triangle', 500, 0.08, 0.08);
        }
      },
      enemyDeath: function () { init(); osc('sine', 300, 0.1, 0.06); osc('sine', 200, 0.08, 0.04); },
      waveStart: function () {
        init();
        osc('sawtooth', 150, 0.5, 0.08);
        osc('sawtooth', 200, 0.45, 0.06, 5);
        osc('sawtooth', 300, 0.4, 0.04);
        osc('triangle', 100, 0.6, 0.05);
      },
      waveComplete: function () {
        init();
        osc('sine', 523, 0.2, 0.10);
        setTimeout(function () { osc('sine', 659, 0.2, 0.10); }, 100);
        setTimeout(function () { osc('sine', 784, 0.3, 0.10); }, 200);
      },
      bossSpawn: function () {
        init();
        osc('sawtooth', 80, 0.8, 0.10);
        osc('sawtooth', 60, 0.9, 0.06);
        noise(0.5, 0.04);
      },
      towerPlace: function () {
        init();
        osc('sine', 880, 0.1, 0.08);
        osc('sine', 1320, 0.08, 0.05);
        osc('sine', 1760, 0.06, 0.03);
      },
      nexusHit: function () {
        init();
        osc('square', 200, 0.2, 0.12);
        osc('sawtooth', 150, 0.25, 0.06);
        noise(0.15, 0.06);
      },
      upgrade: function () {
        init();
        osc('sine', 600, 0.1, 0.08);
        setTimeout(function () { osc('sine', 800, 0.1, 0.08); }, 60);
        setTimeout(function () { osc('sine', 1100, 0.15, 0.08); }, 120);
      },
      sell: function () {
        init();
        osc('triangle', 1200, 0.06, 0.08);
        osc('triangle', 900, 0.06, 0.06);
      },
      gameOver: function () {
        init();
        osc('sawtooth', 300, 0.4, 0.10);
        setTimeout(function () { osc('sawtooth', 200, 0.5, 0.08); }, 200);
        setTimeout(function () { osc('sawtooth', 120, 0.7, 0.06); }, 450);
      },
      victory: function () {
        init();
        var notes = [523, 659, 784, 1047];
        notes.forEach(function (f, i) {
          setTimeout(function () { osc('sine', f, 0.3, 0.10); }, i * 120);
        });
        setTimeout(function () {
          osc('sine', 1047, 0.6, 0.10);
          osc('sine', 784, 0.6, 0.07);
          osc('sine', 523, 0.6, 0.05);
        }, 500);
      },
      // ── New SFX ──────────────────────────────────────────────────────
      // 1. Portal hum — looping ambient drone for spawn portals
      portalHumStart: function () {
        init();
        if (!actx || portalHumNodes) return;
        // Low sine drone ~80Hz with slow LFO amplitude modulation
        var drone = actx.createOscillator();
        drone.type = 'sine';
        drone.frequency.value = 80;
        var lfo = actx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 1.5; // slow pulse
        var lfoGain = actx.createGain();
        lfoGain.gain.value = 0.015; // modulation depth
        var droneGain = actx.createGain();
        droneGain.gain.value = 0.03; // very quiet
        lfo.connect(lfoGain);
        lfoGain.connect(droneGain.gain); // modulate volume
        drone.connect(droneGain);
        droneGain.connect(masterGain);
        drone.start(now());
        lfo.start(now());
        portalHumNodes = { drone: drone, lfo: lfo, gain: droneGain };
      },
      portalHumStop: function () {
        if (!portalHumNodes) return;
        try {
          portalHumNodes.gain.gain.setValueAtTime(portalHumNodes.gain.gain.value, now());
          portalHumNodes.gain.gain.exponentialRampToValueAtTime(0.001, now() + 0.5);
          var nodes = portalHumNodes;
          setTimeout(function () {
            try { nodes.drone.stop(); } catch (e) {}
            try { nodes.lfo.stop(); } catch (e) {}
          }, 600);
        } catch (e) {}
        portalHumNodes = null;
      },
      // 2. Synergy activate — sparkly ascending chime
      synergyActivate: function () {
        init();
        osc('sine', 800, 0.12, 0.08);
        setTimeout(function () { osc('sine', 1200, 0.10, 0.07); }, 50);
        setTimeout(function () { osc('sine', 1600, 0.15, 0.06); }, 100);
      },
      // 3. Critical hit — punchy impact
      criticalHit: function () {
        init();
        noise(0.06, 0.10);
        osc('square', 150, 0.08, 0.12);
      },
      // 4. Shield break — glass shatter (noise with highpass sweep)
      shieldBreak: function () {
        init();
        filteredNoise(0.2, 0.10, 'highpass', 2000, 8000);
        osc('sine', 3000, 0.05, 0.06);
      },
      // 5. Boss ability — ominous whoosh (filtered sawtooth sweep + noise)
      bossAbility: function () {
        init();
        filteredOsc('sawtooth', 200, 100, 0.4, 0.08, 'lowpass', 800, 200);
        noise(0.3, 0.04);
      },
      // 6. Nexus alarm — pulsing warning loop (alternating square tones)
      nexusAlarmStart: function () {
        init();
        if (nexusAlarmActive) return;
        nexusAlarmActive = true;
        var toggle = false;
        function tick() {
          if (!nexusAlarmActive) return;
          osc('square', toggle ? 400 : 600, 0.12, 0.06);
          toggle = !toggle;
          nexusAlarmInterval = setTimeout(tick, 150);
        }
        tick();
      },
      nexusAlarmStop: function () {
        nexusAlarmActive = false;
        if (nexusAlarmInterval) {
          clearTimeout(nexusAlarmInterval);
          nexusAlarmInterval = null;
        }
      },
      // 7. Freeze hit — crystalline freeze (high sine with fast vibrato)
      freezeHit: function () {
        init();
        if (!actx) return;
        var o = actx.createOscillator();
        o.type = 'sine';
        o.frequency.value = 2000;
        // Fast vibrato via LFO on frequency
        var vib = actx.createOscillator();
        vib.type = 'sine';
        vib.frequency.value = 30; // fast vibrato
        var vibGain = actx.createGain();
        vibGain.gain.value = 150; // vibrato depth in Hz
        vib.connect(vibGain);
        vibGain.connect(o.frequency);
        var g = actx.createGain();
        g.gain.setValueAtTime(0.08, now());
        g.gain.exponentialRampToValueAtTime(0.001, now() + 0.15);
        o.connect(g);
        g.connect(masterGain);
        o.start(now());
        vib.start(now());
        o.stop(now() + 0.2);
        vib.stop(now() + 0.2);
      },
      // 8. Root hit — earthy thud (triangle + noise, short)
      rootHit: function () {
        init();
        osc('triangle', 120, 0.1, 0.10);
        noise(0.06, 0.06);
      }
    };
  })();

  // ─────────────────────────── Save / Load ─────────────────────────────
  var SAVE_KEY = 'arcane-bastion-best';

  function loadBest() {
    try { return parseInt(localStorage.getItem(SAVE_KEY)) || 0; } catch (e) { return 0; }
  }
  function saveBest(wave) {
    try { var b = loadBest(); if (wave > b) localStorage.setItem(SAVE_KEY, wave); } catch (e) {}
  }

  // ─────────────────────────── DOM References ──────────────────────────
  var $menuScreen     = document.getElementById('menu-screen');
  var $bestWave       = document.getElementById('best-wave');
  var $btnNewGame     = document.getElementById('btn-new-game');
  var $hud            = document.getElementById('hud');
  var $goldDisplay    = document.getElementById('gold-display');
  var $manaDisplay    = document.getElementById('mana-display');
  var $waveDisplay    = document.getElementById('wave-display');
  var $waveSub        = document.getElementById('wave-sub');
  var $buildBar       = document.getElementById('hud-build-bar');
  var $buildTimerText = document.getElementById('build-timer-text');
  var $btnSendWave    = document.getElementById('btn-send-wave');
  var $earlyBonus     = document.getElementById('early-bonus');
  var $waveStatus     = document.getElementById('hud-wave-status');
  var $enemiesRemain  = document.getElementById('enemies-remaining');
  var $towerPanel     = document.getElementById('tower-panel');
  var $towerInfo      = document.getElementById('tower-info');
  var $waveBanner     = document.getElementById('wave-banner');
  var $bannerText     = document.getElementById('banner-text');
  var $bannerSub      = document.getElementById('banner-sub');
  var $pauseOverlay   = document.getElementById('pause-overlay');
  var $btnResume      = document.getElementById('btn-resume');
  var $btnQuit        = document.getElementById('btn-quit');
  var $gameoverScreen = document.getElementById('gameover-screen');
  var $gameoverStats  = document.getElementById('gameover-stats');
  var $btnRetry       = document.getElementById('btn-retry');
  var $victoryScreen  = document.getElementById('victory-screen');
  var $victoryStats   = document.getElementById('victory-stats');
  var $btnVictoryMenu = document.getElementById('btn-victory-menu');
  var $btnPause       = document.getElementById('btn-pause');

  // ─────────────────────────── Tower Panel Build ───────────────────────
  var TOWER_ORDER = ['fire', 'ice', 'lightning', 'earth', 'arcane', 'nature', 'shadow', 'light'];
  var TOWER_ICONS = {
    fire: '\u{1F525}', ice: '\u{2744}\uFE0F', lightning: '\u{26A1}', earth: '\u{1FAA8}',
    arcane: '\u{1F52E}', nature: '\u{1F33F}', shadow: '\u{1F311}', light: '\u{2728}'
  };

  function buildTowerPanel() {
    $towerPanel.innerHTML = '';
    for (var i = 0; i < TOWER_ORDER.length; i++) {
      var tid = TOWER_ORDER[i];
      var T = Towers.TYPES[tid];
      var card = document.createElement('div');
      card.className = 'tower-card';
      card.dataset.towerId = tid;
      card.innerHTML =
        '<span class="tc-key">' + (i + 1) + '</span>' +
        '<div class="tc-icon" style="background:' + T.color + '22;border-color:' + T.color + '55">' +
          TOWER_ICONS[tid] +
        '</div>' +
        '<div class="tc-name">' + T.name + '</div>' +
        '<div class="tc-cost">' + T.cost + 'g</div>';
      card.addEventListener('click', (function (id) {
        return function () { startPlacement(id); };
      })(tid));
      $towerPanel.appendChild(card);
    }
  }
  buildTowerPanel();

  function updateTowerPanelAffordability() {
    var cards = $towerPanel.querySelectorAll('.tower-card');
    for (var i = 0; i < cards.length; i++) {
      var tid = cards[i].dataset.towerId;
      var cost = Towers.getTowerCost(tid);
      if (gold < cost) {
        cards[i].classList.add('disabled');
      } else {
        cards[i].classList.remove('disabled');
      }
      // Highlight if in placement mode for this type
      if (placementMode && placementType === tid) {
        cards[i].classList.add('selected');
      } else {
        cards[i].classList.remove('selected');
      }
    }
  }

  // ─────────────────────────── Tower Info Panel ────────────────────────
  function showTowerInfo(tower) {
    selectedTower = tower;
    var T = tower.type;
    var stats = tower.effectiveStats || Towers.getEffectiveStats(tower);
    var tierLabel = tower.tier === 1 ? 'Tier 1' : tower.tier === 2 ? 'Tier 2' : 'Tier 3';
    var html = '';

    // Header
    html += '<div class="ti-header">';
    html += '<div class="ti-icon" style="background:' + T.color + '22;border-color:' + T.color + '55">' + TOWER_ICONS[T.id] + '</div>';
    html += '<span class="ti-name" style="color:' + T.color + '">' + T.name + '</span>';
    html += '<span class="ti-tier">' + tierLabel + '</span>';
    html += '</div>';

    // Upgrade path name
    if (tower.upgradePath) {
      html += '<div style="font-size:0.72rem;color:' + T.color + ';margin-bottom:6px;opacity:0.8">' + tower.upgradePath + '</div>';
    }

    // Stats
    html += '<div class="ti-stats">';
    html += '<span class="stat-label">Damage</span><span class="stat-val">' + Math.round(stats.damage) + '</span>';
    html += '<span class="stat-label">Speed</span><span class="stat-val">' + stats.attackSpeed.toFixed(1) + '/s</span>';
    html += '<span class="stat-label">Range</span><span class="stat-val">' + stats.range.toFixed(1) + '</span>';
    if (stats.splashRadius) html += '<span class="stat-label">Splash</span><span class="stat-val">' + stats.splashRadius.toFixed(1) + '</span>';
    if (stats.chainCount) html += '<span class="stat-label">Chains</span><span class="stat-val">' + stats.chainCount + '</span>';
    html += '<span class="stat-label">Kills</span><span class="stat-val">' + tower.totalKills + '</span>';
    html += '<span class="stat-label">Dmg Done</span><span class="stat-val">' + formatNum(tower.totalDamage) + '</span>';
    html += '</div>';

    // Synergies
    if (tower.synergies && tower.synergies.length > 0) {
      html += '<div class="ti-synergies">';
      html += '<div class="syn-title">Synergies</div>';
      for (var s = 0; s < tower.synergies.length; s++) {
        html += '<div class="ti-synergy-item">' + tower.synergies[s].name + '</div>';
      }
      html += '</div>';
    }

    // Upgrades
    if (tower.tier < 3) {
      html += '<div class="ti-upgrades">';
      // At tier 1: show both paths (a, b). At tier 2: only show the chosen path.
      var showA = tower.tier === 1 || tower.upgradePath === 'a';
      var showB = tower.tier === 1 || tower.upgradePath === 'b';
      var infoA = showA ? Towers.getUpgradeInfo(tower, 'a') : null;
      var infoB = showB ? Towers.getUpgradeInfo(tower, 'b') : null;

      if (infoA) {
        var canA = gold >= infoA.cost;
        html += '<div class="upgrade-btn' + (canA ? '' : ' disabled') + '" data-path="a">';
        html += '<span class="upg-name">[U] ' + infoA.name + '</span>';
        html += '<span class="upg-desc">' + infoA.desc + '</span>';
        html += '<span class="upg-cost">' + infoA.cost + ' gold</span>';
        html += '</div>';
      }
      if (infoB) {
        var canB = gold >= infoB.cost;
        html += '<div class="upgrade-btn' + (canB ? '' : ' disabled') + '" data-path="b">';
        html += '<span class="upg-name">[I] ' + infoB.name + '</span>';
        html += '<span class="upg-desc">' + infoB.desc + '</span>';
        html += '<span class="upg-cost">' + infoB.cost + ' gold</span>';
        html += '</div>';
      }
      html += '</div>';
    }

    // Actions
    var sellVal = Towers.getSellValue(tower);
    html += '<div class="ti-actions">';
    html += '<button class="btn btn-small btn-danger" id="btn-sell">[S] Sell (' + sellVal + 'g)</button>';
    html += '<button class="btn btn-small" id="btn-deselect">Close</button>';
    html += '</div>';

    $towerInfo.innerHTML = html;
    $towerInfo.classList.remove('hidden');

    // Bind upgrade clicks
    var upgBtns = $towerInfo.querySelectorAll('.upgrade-btn');
    for (var u = 0; u < upgBtns.length; u++) {
      upgBtns[u].addEventListener('click', (function (path) {
        return function () { doUpgrade(path); };
      })(upgBtns[u].dataset.path));
    }

    // Bind sell
    var sellBtn = document.getElementById('btn-sell');
    if (sellBtn) sellBtn.addEventListener('click', doSell);

    // Bind deselect
    var desBtn = document.getElementById('btn-deselect');
    if (desBtn) desBtn.addEventListener('click', function () { deselectTower(); });
  }

  function hideTowerInfo() {
    selectedTower = null;
    $towerInfo.classList.add('hidden');
  }

  function deselectTower() {
    hideTowerInfo();
  }

  // ─────────────────────────── Format Helpers ──────────────────────────
  function formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return '' + Math.round(n);
  }

  // ─────────────────────────── Camera ──────────────────────────────────
  function updateCamera() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    cam.w = vw;
    cam.h = vh;
    // Center map in view
    cam.x = (Map.MAP_W - vw) / 2;
    cam.y = (Map.MAP_H - vh) / 2;
    // Clamp
    cam.x = Math.max(0, Math.min(cam.x, Map.MAP_W - vw));
    cam.y = Math.max(0, Math.min(cam.y, Map.MAP_H - vh));
    if (Map.MAP_W < vw) cam.x = (Map.MAP_W - vw) / 2;
    if (Map.MAP_H < vh) cam.y = (Map.MAP_H - vh) / 2;
  }

  // ─────────────────────────── Placement Mode ──────────────────────────
  function startPlacement(typeId) {
    var cost = Towers.getTowerCost(typeId);
    if (gold < cost) return;
    if (placementMode && placementType === typeId) {
      cancelPlacement();
      return;
    }
    placementMode = true;
    placementType = typeId;
    deselectTower();
    updateTowerPanelAffordability();
  }

  function cancelPlacement() {
    placementMode = false;
    placementType = null;
    updateTowerPanelAffordability();
  }

  function tryPlaceTower(col, row) {
    if (!placementType) return false;
    if (!Map.canBuild(col, row)) return false;
    var cost = Towers.getTowerCost(placementType);
    if (gold < cost) return false;

    var pos = Map.gridToWorld(col, row);
    // Center of cell
    var tx = pos.x + CELL / 2;
    var ty = pos.y + CELL / 2;

    Map.placeTower(col, row, placementType);
    // Verify paths still exist after placement
    Map.recomputePaths();
    var pathsValid = true;
    for (var s = 0; s < Map.spawnCells.length; s++) {
      var p = Map.getPath(s);
      if (!p || p.length === 0) { pathsValid = false; break; }
    }
    if (!pathsValid) {
      // Revert placement - would block all paths
      Map.removeTower(col, row);
      Map.recomputePaths();
      return false;
    }

    gold -= cost;
    totalGoldEarned += 0; // cost deducted, not earned

    var tower = Towers.createTower(placementType, col, row, tx, ty);
    towers.push(tower);
    var prevSynCount = towers.reduce(function (n, t) { return n + (t.synergies ? t.synergies.length : 0); }, 0);
    Towers.refreshAllSynergies(towers);
    var newSynCount = towers.reduce(function (n, t) { return n + (t.synergies ? t.synergies.length : 0); }, 0);

    FX.spawnPlaceEffect({ x: tx, y: ty, element: placementType });
    Audio.towerPlace();
    if (newSynCount > prevSynCount) Audio.synergyActivate();

    // Show upgrade tip after first tower placed
    towerPlaceCount++;
    if (towerPlaceCount === 1) {
      showTip('Click placed towers to upgrade them!');
    }

    // Stay in placement mode if player can still afford it
    if (gold < cost) cancelPlacement();

    updateGoldDisplay();
    updateTowerPanelAffordability();
    return true;
  }

  // ─────────────────────────── Upgrades & Sell ─────────────────────────
  function doUpgrade(path) {
    if (!selectedTower) return;
    var info = Towers.getUpgradeInfo(selectedTower, path);
    if (!info || gold < info.cost) return;

    gold -= info.cost;
    var ok = Towers.upgradeTower(selectedTower, path);
    if (ok) {
      var prevSynCount2 = towers.reduce(function (n, t) { return n + (t.synergies ? t.synergies.length : 0); }, 0);
      Towers.refreshAllSynergies(towers);
      var newSynCount2 = towers.reduce(function (n, t) { return n + (t.synergies ? t.synergies.length : 0); }, 0);
      Audio.upgrade();
      if (newSynCount2 > prevSynCount2) Audio.synergyActivate();
      FX.spawnPlaceEffect({ x: selectedTower.x, y: selectedTower.y, element: selectedTower.type.element });
      // Extra upgrade particle burst — rising sparkles in element color
      FX.spawnParticles({
        x: selectedTower.x, y: selectedTower.y, count: 24,
        color: selectedTower.type.color, size: 3, speed: 100,
        lifetime: 0.8, gravity: -60, spread: Math.PI * 2
      });
      showTowerInfo(selectedTower); // refresh panel
      updateGoldDisplay();
      updateTowerPanelAffordability();
    } else {
      gold += info.cost; // refund if upgrade failed
    }
  }

  function doSell() {
    if (!selectedTower) return;
    var val = Towers.getSellValue(selectedTower);
    gold += val;

    Map.removeTower(selectedTower.col, selectedTower.row);
    Map.recomputePaths();

    // Remove from array
    var idx = towers.indexOf(selectedTower);
    if (idx !== -1) towers.splice(idx, 1);

    Towers.refreshAllSynergies(towers);
    Audio.sell();

    hideTowerInfo();
    updateGoldDisplay();
    updateTowerPanelAffordability();
  }

  // ─────────────────────────── Screen Shake ────────────────────────────
  function addScreenShake(amount) {
    shakeMag = Math.min(shakeMag + amount, 15);
    shakeTimer = 0.3;
  }

  function updateShake(dt) {
    if (shakeTimer > 0) {
      shakeTimer -= dt;
      var t = Math.max(0, shakeTimer / 0.3);
      var mag = shakeMag * t;
      shakeX = (Math.random() * 2 - 1) * mag;
      shakeY = (Math.random() * 2 - 1) * mag;
    } else {
      shakeX = 0;
      shakeY = 0;
      shakeMag = 0;
    }
  }

  // ─────────────────────────── Wave Banner ─────────────────────────────
  function showBanner(text, sub) {
    bannerText = text;
    bannerSub = sub || '';
    bannerTimer = bannerDuration;
    $bannerText.textContent = text;
    $bannerSub.textContent = sub || '';
  }

  function updateBanner(dt) {
    if (bannerTimer <= 0) {
      $waveBanner.style.opacity = '0';
      return;
    }
    bannerTimer -= dt / gameSpeed; // Banners run at real time, not game time

    // Phases: slide in (0.3s), hold (1.5s), fade out (0.7s)
    var elapsed = bannerDuration - bannerTimer;
    if (elapsed < 0.3) {
      // Slide in
      var t = elapsed / 0.3;
      $waveBanner.style.opacity = '' + t;
      $waveBanner.style.transform = 'translate(-50%, ' + (-50 + (1 - t) * 30) + '%)';
    } else if (bannerTimer > 0.7) {
      // Hold
      $waveBanner.style.opacity = '1';
      $waveBanner.style.transform = 'translate(-50%, -50%)';
    } else {
      // Fade out
      var t2 = bannerTimer / 0.7;
      $waveBanner.style.opacity = '' + t2;
      $waveBanner.style.transform = 'translate(-50%, -50%)';
    }
  }

  // ─────────────────────────── HUD Updates ─────────────────────────────
  function showTip(text) {
    tipText = text;
    tipTimer = 4.0; // show for 4 seconds
  }

  function updateGoldDisplay() {
    $goldDisplay.textContent = gold;
  }
  function updateManaDisplay() {
    $manaDisplay.textContent = Math.floor(mana);
  }
  function updateWaveDisplay() {
    $waveDisplay.textContent = 'Wave ' + currentWave + '/' + totalWaves;
  }

  function updateHUD() {
    updateGoldDisplay();
    updateManaDisplay();
    updateWaveDisplay();
    updateTowerPanelAffordability();

    // Nexus HP display in wave sub
    var hp = Map.nexus.hp;
    var mhp = Map.nexus.maxHp;
    $waveSub.textContent = 'Nexus: ' + hp + '/' + mhp;
  }

  // ─────────────────────────── State Transitions ───────────────────────
  function showScreen(id) {
    var screens = ['menu-screen', 'pause-overlay', 'gameover-screen', 'victory-screen'];
    for (var i = 0; i < screens.length; i++) {
      var el = document.getElementById(screens[i]);
      if (screens[i] === id) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  }

  function enterMenu() {
    state = 'menu';
    $hud.classList.add('hidden');
    showScreen('menu-screen');
    $bestWave.textContent = 'Wave ' + loadBest();
    $waveBanner.style.opacity = '0';
  }

  function startNewGame() {
    Audio.init();
    state = 'build';
    gold = 400;
    mana = 0;
    currentWave = 0;
    towers = [];
    enemies = [];
    totalKills = 0;
    totalGoldEarned = 0;
    gameSpeed = 1;
    firstBuild = true;
    buildTimer = 0;
    selectedTower = null;
    placementMode = false;
    placementType = null;
    shakeMag = 0;
    shakeTimer = 0;
    bannerTimer = 0;

    Map.init();
    FX.clear();
    updateCamera();

    $hud.classList.remove('hidden');
    showScreen(null);

    // Enter first build phase (unlimited time)
    enterBuildPhase();
    updateHUD();

    // Set speed buttons
    updateSpeedButtons();
  }

  function enterBuildPhase() {
    state = 'build';
    currentWave++;

    if (firstBuild) {
      buildTimer = -1; // Unlimited
      $buildTimerText.textContent = 'Place towers!';
      $earlyBonus.textContent = '';
    } else {
      buildTimer = buildTimerMax;
    }

    $buildBar.classList.remove('hidden');
    $waveStatus.classList.add('hidden');

    updateWaveDisplay();
    showBanner('Build Phase', currentWave === 1 ? 'Place your first towers' : 'Prepare for Wave ' + currentWave);
  }

  function startWave() {
    // Award early start bonus
    if (!firstBuild && buildTimer > 0) {
      var bonus = Math.floor(buildTimer * 2);
      gold += bonus;
      totalGoldEarned += bonus;
    }
    firstBuild = false;

    state = 'wave';
    $buildBar.classList.add('hidden');
    $waveStatus.classList.remove('hidden');

    // Get paths for all spawn points
    Map.recomputePaths();
    var paths = [];
    for (var s = 0; s < Map.spawnCells.length; s++) {
      paths.push(Map.getPath(s));
    }

    currentWaveData = Enemies.startWave(currentWave, paths);

    var isBoss = currentWaveData.boss;
    showBanner('Wave ' + currentWave, isBoss ? 'BOSS INCOMING' : '');
    Audio.waveStart();
    Audio.portalHumStart();
    if (isBoss) {
      setTimeout(function () { Audio.bossSpawn(); }, 300);
    }

    updateHUD();
  }

  function enterPause() {
    prevState = state;
    state = 'paused';
    showScreen('pause-overlay');
  }

  function resumeGame() {
    state = prevState;
    showScreen(null);
  }

  function triggerGameOver() {
    state = 'gameover';
    saveBest(currentWave - 1);
    Audio.portalHumStop();
    Audio.nexusAlarmStop();
    Audio.gameOver();

    $gameoverStats.innerHTML =
      'Reached: <span>Wave ' + currentWave + '</span><br>' +
      'Enemies Slain: <span>' + totalKills + '</span><br>' +
      'Gold Earned: <span>' + totalGoldEarned + '</span><br>' +
      'Towers Built: <span>' + towers.length + '</span>';

    showScreen('gameover-screen');
  }

  function triggerVictory() {
    state = 'victory';
    saveBest(currentWave);
    Audio.portalHumStop();
    Audio.nexusAlarmStop();
    Audio.victory();

    $victoryStats.innerHTML =
      'All <span>20 waves</span> defeated!<br>' +
      'Nexus HP: <span>' + Map.nexus.hp + '/' + Map.nexus.maxHp + '</span><br>' +
      'Enemies Slain: <span>' + totalKills + '</span><br>' +
      'Gold Earned: <span>' + totalGoldEarned + '</span>';

    showScreen('victory-screen');
  }

  // ─────────────────────────── Speed Controls ──────────────────────────
  function updateSpeedButtons() {
    var btns = document.querySelectorAll('.speed-btn');
    for (var i = 0; i < btns.length; i++) {
      var s = parseInt(btns[i].dataset.speed);
      if (s === gameSpeed) btns[i].classList.add('active');
      else btns[i].classList.remove('active');
    }
  }

  // ─────────────────────────── Tower Callbacks ─────────────────────────
  var towerCallbacks = {
    onFire: function (tower, target, stats) {
      Audio.towerFire(tower.type.element);

      if (stats.attackType === 'projectile') {
        FX.spawnProjectile({
          fromX: tower.x, fromY: tower.y,
          toX: target.x, toY: target.y,
          targetId: target.id,
          towerId: tower.id,
          element: tower.type.element,
          damage: stats.damage,
          speed: stats.projectileSpeed || 400,
          pierce: stats.pierce || 0,
          armorPierce: stats.armorPierce || 0,
          onHit: function (enemy) { handleProjectileHit(tower, enemy, stats); }
        });
      } else if (stats.attackType === 'beam') {
        FX.spawnBeam({
          fromX: tower.x, fromY: tower.y,
          toX: target.x, toY: target.y,
          element: tower.type.element,
          duration: stats.beamDuration || 0.5,
          width: 3
        });
        // Beams deal damage immediately
        var dmg = Enemies.applyDamage(target, stats.damage, stats.armorPierce || 0);
        tower.totalDamage += dmg;
        target._lastHitTowerId = tower.id;
        FX.spawnDamageNumber({ x: target.x, y: target.y - 20, amount: dmg });
        applyElementalStatus(target, tower.type.element, stats);
        checkEnemyDeath(target);
      } else if (stats.attackType === 'aoe') {
        FX.spawnExplosion({
          x: target.x, y: target.y,
          radius: (stats.splashRadius || 0.8) * CELL,
          element: tower.type.element
        });
        var sr = (stats.splashRadius || 0.8) * CELL;
        for (var i = 0; i < enemies.length; i++) {
          var e = enemies[i];
          if (e.dead) continue;
          var dist = Math.hypot(e.x - target.x, e.y - target.y);
          if (dist <= sr) {
            var dmg2 = Enemies.applyDamage(e, stats.damage, stats.armorPierce || 0);
            tower.totalDamage += dmg2;
            e._lastHitTowerId = tower.id;
            FX.spawnDamageNumber({ x: e.x, y: e.y - 20, amount: dmg2 });
            applyElementalStatus(e, tower.type.element, stats);
            checkEnemyDeath(e);
          }
        }
        // Stun chance for earth
        if (tower.type.stunChance && Math.random() < tower.type.stunChance) {
          Audio.rootHit();
          for (var j = 0; j < enemies.length; j++) {
            var e2 = enemies[j];
            if (e2.dead) continue;
            var d2 = Math.hypot(e2.x - target.x, e2.y - target.y);
            if (d2 <= sr) {
              Enemies.applyStatus(e2, { type: 'stun', duration: tower.type.stunDuration || 0.8, intensity: 1 });
            }
          }
        }
      }
    },

    onChainFire: function (tower, targets, stats) {
      Audio.towerFire(tower.type.element);
      // Build chain points
      var points = [{ x: tower.x, y: tower.y }];
      var falloff = stats.chainDamageFalloff || tower.type.chainDamageFalloff || 0.7;
      var dmgMult = 1.0;
      for (var i = 0; i < targets.length; i++) {
        points.push({ x: targets[i].x, y: targets[i].y });
        var dmg = Enemies.applyDamage(targets[i], stats.damage * dmgMult, stats.armorPierce || 0);
        tower.totalDamage += dmg;
        targets[i]._lastHitTowerId = tower.id;
        FX.spawnDamageNumber({ x: targets[i].x, y: targets[i].y - 20, amount: dmg });
        applyElementalStatus(targets[i], tower.type.element, stats);
        checkEnemyDeath(targets[i]);
        dmgMult *= falloff;
      }
      FX.spawnChain({ points: points, element: tower.type.element, duration: 0.3 });
    },

    onAuraTick: function (tower, enemiesInRange, stats, dt) {
      for (var i = 0; i < enemiesInRange.length; i++) {
        var e = enemiesInRange[i];
        if (e.dead) continue;
        // Nature: poison + DPS aura
        if (tower.type.element === 'nature') {
          var dmg = Enemies.applyDamage(e, (tower.type.auraDPS || 12) * dt, 0);
          tower.totalDamage += dmg;
          e._lastHitTowerId = tower.id;
          Enemies.applyStatus(e, {
            type: 'poison',
            intensity: tower.type.poisonDPS || 6,
            duration: tower.type.poisonDuration || 4
          });
        } else {
          // Generic aura DPS
          var dmg2 = Enemies.applyDamage(e, (stats.damage || 8) * dt, 0);
          tower.totalDamage += dmg2;
        }
        checkEnemyDeath(e);
      }
    }
  };

  // ─────────────────────────── Elemental Status Application ────────────
  function applyElementalStatus(enemy, element, stats) {
    if (enemy.dead) return;
    switch (element) {
      case 'fire':
        Enemies.applyStatus(enemy, {
          type: 'burn',
          intensity: stats.burnDPS || 5,
          duration: stats.burnDuration || 3
        });
        break;
      case 'ice':
        Enemies.applyStatus(enemy, {
          type: 'slow',
          intensity: stats.slowAmount || 0.4,
          duration: stats.slowDuration || 2
        });
        // Freeze chance from upgrades
        if (stats.freezeChance && Math.random() < stats.freezeChance) {
          Enemies.applyStatus(enemy, { type: 'freeze', duration: 1.2, intensity: 1 });
          Audio.freezeHit();
        }
        break;
      case 'lightning':
        // Occasional stun on crit
        if (Math.random() < 0.1) {
          Enemies.applyStatus(enemy, { type: 'stun', duration: 0.5, intensity: 1 });
          Audio.rootHit();
        }
        break;
      case 'nature':
        Enemies.applyStatus(enemy, {
          type: 'poison',
          intensity: stats.poisonDPS || 6,
          duration: stats.poisonDuration || 4
        });
        break;
      case 'shadow':
        // Mark for bonus damage
        Enemies.applyStatus(enemy, {
          type: 'shatter',
          intensity: 0.15,
          duration: 3
        });
        break;
    }
  }

  // ─────────────────────────── Projectile Hits ─────────────────────────
  function handleProjectileHit(tower, enemy, stats) {
    // This is called by the onHit callback from projectile if defined;
    // but we also handle hits from ArcaneFX.checkProjectileHits below
  }

  function processProjectileHits() {
    var hits = FX.checkProjectileHits(enemies);
    if (!hits || hits.length === 0) return;

    for (var i = 0; i < hits.length; i++) {
      var proj = hits[i].projectile;
      var enemy = hits[i].enemy;
      if (enemy.dead) continue;

      var hadShield = enemy.shieldHp > 0;
      var dmg = Enemies.applyDamage(enemy, proj.damage, proj.armorPierce || 0);
      FX.spawnDamageNumber({
        x: enemy.x,
        y: enemy.y - (enemy.type ? enemy.type.size : 8) - 5,
        amount: dmg
      });

      // Critical hit SFX when damage exceeds 30% of enemy max HP
      if (dmg > enemy.maxHp * 0.3) Audio.criticalHit();
      // Shield break SFX when shield just depleted
      if (hadShield && enemy.shieldHp <= 0) Audio.shieldBreak();

      // Credit damage and potential kill to the tower that fired
      if (proj.towerId) {
        var srcTower = findTowerById(proj.towerId);
        if (srcTower) {
          srcTower.totalDamage += dmg;
          enemy._lastHitTowerId = proj.towerId;
        }
      }
      applyElementalStatus(enemy, proj.element, proj);
      checkEnemyDeath(enemy);
    }
  }

  // ─────────────────────────── Enemy Callbacks ─────────────────────────
  var enemyCallbacks = {
    onDeath: function (enemy) {
      handleEnemyDeath(enemy);
    },
    onReachNexus: function (enemy, damage) {
      handleNexusHit(enemy, damage);
    },
    onSplit: function (enemy, count) {
      handleEnemySplit(enemy, count);
    },
    onHeal: function (healer, target, amount) {
      FX.spawnDamageNumber({ x: target.x, y: target.y - 20, amount: Math.round(amount), color: '#44ff66' });
    },
    onBossAbility: function (enemy, ability, data) {
      Audio.bossAbility();
      if (ability === 'fireNova') {
        FX.spawnExplosion({ x: data.x, y: data.y, radius: data.radius || 100, element: 'fire', duration: 0.6 });
        addScreenShake(6);
      } else if (ability === 'massHeal') {
        FX.spawnAura({ x: enemy.x, y: enemy.y, radius: 200, element: 'nature', duration: 1.5, pulseSpeed: 3 });
        FX.spawnDamageNumber({ x: enemy.x, y: enemy.y - 30, amount: Math.round((data.percent || 0.15) * 100) + '%', color: '#44ff66' });
      }
    },
    onSummon: function (boss, summonType, count) {
      for (var s = 0; s < count; s++) {
        var spath = Map.getPath(Math.floor(Math.random() * Map.spawnCells.length));
        if (!spath) continue;
        var minion = Enemies.createEnemy(summonType || 'wisp', spath, 0);
        minion.x = boss.x + (Math.random() - 0.5) * 40;
        minion.y = boss.y + (Math.random() - 0.5) * 40;
        minion.pathIndex = Math.max(0, Math.floor(spath.length * 0.5));
        enemies.push(minion);
      }
      FX.spawnExplosion({ x: boss.x, y: boss.y, radius: 60, element: 'ice', duration: 0.4 });
    }
  };

  function handleEnemyDeath(enemy) {
    if (!enemy.type) return;
    var goldReward = Math.round((enemy.type.gold || 5) * (currentWaveData ? 1 : 1));
    gold += goldReward;
    totalGoldEarned += goldReward;
    totalKills++;

    // Credit kill to the tower that last hit this enemy
    if (enemy._lastHitTowerId) {
      var killer = findTowerById(enemy._lastHitTowerId);
      if (killer) killer.totalKills++;
    }

    var result = FX.spawnDeathEffect({
      x: enemy.x, y: enemy.y,
      size: enemy.type.size || 8,
      color: enemy.type.color || '#ff4444'
    });
    if (result && result.shakeAmount) addScreenShake(result.shakeAmount);

    Audio.enemyDeath();
    enemy.dead = true;
    updateGoldDisplay();
  }

  function handleNexusHit(enemy, damage) {
    Map.nexus.hp -= damage;
    Audio.nexusHit();
    addScreenShake(4);
    FX.spawnExplosion({
      x: Map.nexus.x, y: Map.nexus.y,
      radius: 30,
      element: 'physical'
    });

    if (Map.nexus.hp <= 0) {
      Map.nexus.hp = 0;
      triggerGameOver();
    }
  }

  function handleEnemySplit(enemy, count) {
    // Slime split: spawn smaller enemies at same position
    if (!enemy.path) return;
    var splitType = enemy.type.splitType || 'slimeling';
    var num = count || enemy.type.splitCount || 3;
    for (var c = 0; c < num; c++) {
      var child = Enemies.createEnemy(splitType, enemy.path, enemy.spawnIndex);
      child.x = enemy.x + (Math.random() - 0.5) * 20;
      child.y = enemy.y + (Math.random() - 0.5) * 20;
      child.pathIndex = Math.max(0, enemy.pathIndex - 1);
      enemies.push(child);
    }
  }

  function checkEnemyDeath(enemy) {
    if (enemy.hp <= 0 && !enemy.dead) {
      handleEnemyDeath(enemy);
    }
  }

  // ─────────────────────────── Wave Completion ─────────────────────────
  function checkWaveComplete() {
    if (state !== 'wave') return;

    // All enemies must be dead or reached nexus, and spawning done
    if (!Enemies.isSpawningDone()) return;

    var alive = 0;
    for (var i = 0; i < enemies.length; i++) {
      if (!enemies[i].dead && !enemies[i].reachedNexus) alive++;
    }
    if (alive > 0) return;

    // Wave complete!
    var bonus = currentWaveData ? currentWaveData.goldBonus || 0 : 0;
    gold += bonus;
    totalGoldEarned += bonus;

    Audio.waveComplete();
    Audio.portalHumStop();
    Audio.nexusAlarmStop();
    showBanner('Wave Complete', bonus > 0 ? '+' + bonus + ' gold bonus' : '');

    saveBest(currentWave);

    // Victory check
    if (currentWave >= totalWaves) {
      setTimeout(function () { triggerVictory(); }, 1500);
      return;
    }

    // Clean up dead enemies
    enemies = [];

    // Enter next build phase after a brief delay for the banner
    // Use a transitional state to stop wave logic
    state = 'waveEnd';
    setTimeout(function () {
      if (state === 'gameover' || state === 'victory' || state === 'menu') return;
      enterBuildPhase();
    }, 1500);
  }

  // ─────────────────────────── Homing Target Resolver ──────────────────
  function getHomingTarget(targetId) {
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].id === targetId && !enemies[i].dead) {
        return { x: enemies[i].x, y: enemies[i].y };
      }
    }
    return null;
  }

  // ─────────────────────────── Main Update ─────────────────────────────
  function update(dt) {
    // Tip timer
    if (tipTimer > 0) tipTimer -= dt;

    // Mana regen
    mana += 1 * dt;

    if (state === 'waveEnd') {
      // Transitional state between wave complete and next build phase
      FX.updateAll(dt);
      updateShake(dt);
      updateBanner(dt);
      updateHUD();
      return;
    }

    if (state === 'build') {
      // Build timer
      if (buildTimer > 0) {
        buildTimer -= dt;
        var sec = Math.ceil(buildTimer);
        $buildTimerText.textContent = sec + 's';
        var bonus = Math.floor(buildTimer * 2);
        $earlyBonus.textContent = bonus > 0 ? '(+' + bonus + 'g early)' : '';

        if (buildTimer <= 0) {
          startWave();
          return;
        }
      } else if (buildTimer < 0) {
        // Unlimited first build
        $buildTimerText.textContent = 'Ready';
        $earlyBonus.textContent = '';
      }

      // FX still animate during build
      FX.updateAll(dt);
      updateShake(dt);
      updateBanner(dt);
      updateHUD();
      return;
    }

    if (state === 'wave') {
      // 1. Spawn new enemies
      var spawned = Enemies.updateSpawning(dt);
      if (spawned && spawned.length > 0) {
        for (var s = 0; s < spawned.length; s++) {
          enemies.push(spawned[s]);
        }
      }

      // 2. Update towers (targeting + firing)
      towerCallbacks.time = time;
      Towers.updateAll(towers, enemies, dt, towerCallbacks);

      // 3. Update enemies (movement + behaviors)
      Enemies.updateAll(enemies, dt, Map.nexus, enemyCallbacks);

      // 4. Update effects
      FX.updateAll(dt);

      // 5. Homing projectiles
      FX.updateProjectileHoming(getHomingTarget);

      // 6. Process projectile hits
      processProjectileHits();

      // 7. Clean dead enemies from array periodically
      if (Math.random() < 0.05) { // ~5% chance per frame to clean
        enemies = enemies.filter(function (e) { return !e.dead && !e.reachedNexus; });
      }

      // 8. Check wave completion
      checkWaveComplete();

      // 9. Update enemies remaining display
      var aliveCount = 0;
      for (var i = 0; i < enemies.length; i++) {
        if (!enemies[i].dead && !enemies[i].reachedNexus) aliveCount++;
      }
      $enemiesRemain.textContent = 'Enemies: ' + aliveCount + (Enemies.isSpawningDone() ? '' : '+');

      // 10. Nexus alarm — pulse warning when HP < 25%
      if (Map.nexus.hp > 0 && Map.nexus.hp < Map.nexus.maxHp * 0.25) {
        Audio.nexusAlarmStart();
      } else {
        Audio.nexusAlarmStop();
      }
    }

    updateShake(dt);
    updateBanner(dt);
    updateHUD();
  }

  // ─────────────────────────── Render ──────────────────────────────────
  function render(timestamp) {
    var time = timestamp / 1000;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    ctx.clearRect(0, 0, vw, vh);
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, vw, vh);

    if (state === 'menu') {
      drawMenuBackground(ctx, time, vw, vh);
      return;
    }

    // Build a "shaken" camera for modules that handle their own offset
    var shakeCam = { x: cam.x - shakeX, y: cam.y - shakeY, w: cam.w, h: cam.h, scale: cam.scale };

    // ── FX below layer (ground effects, auras — uses cam offset internally) ──
    FX.drawBelow(ctx, shakeCam, time);

    // ── World rendering with camera + shake ──
    ctx.save();
    ctx.translate(shakeX - cam.x, shakeY - cam.y);

    // Map (expects translate already applied)
    Map.draw(ctx, cam, time);

    // Build highlight
    if (placementMode && mouseOnCanvas && mouseGridCol >= 0 && mouseGridRow >= 0) {
      var valid = Map.canBuild(mouseGridCol, mouseGridRow);
      Map.drawBuildHighlight(ctx, cam, mouseGridCol, mouseGridRow, valid);
    }

    // Draw towers + upgrade-available glow
    for (var i = 0; i < towers.length; i++) {
      var tw = towers[i];
      // Pulsing glow if upgrade is affordable
      if (tw.tier < 3 && tw !== selectedTower) {
        var showGlowA = tw.tier === 1 || tw.upgradePath === 'a';
        var showGlowB = tw.tier === 1 || tw.upgradePath === 'b';
        var infoA = showGlowA ? Towers.getUpgradeInfo(tw, 'a') : null;
        var infoB = showGlowB ? Towers.getUpgradeInfo(tw, 'b') : null;
        if ((infoA && gold >= infoA.cost) || (infoB && gold >= infoB.cost)) {
          var pulse = 0.3 + 0.25 * Math.sin(time * 3);
          ctx.save();
          ctx.shadowColor = tw.type.color;
          ctx.shadowBlur = 12 * pulse;
          ctx.beginPath();
          ctx.arc(tw.x, tw.y, CELL * 0.4, 0, Math.PI * 2);
          ctx.strokeStyle = tw.type.color;
          ctx.globalAlpha = pulse * 0.6;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        }
      }
      // Attack flash — brief glow + scale pulse for 150ms after firing
      var atkElapsed = time - tw.lastAttackTime;
      if (tw.lastAttackTime >= 0 && atkElapsed < 0.15) {
        var atkT = 1 - atkElapsed / 0.15; // 1 -> 0 fade
        var sc = 1 + atkT * 0.08;
        ctx.save();
        ctx.translate(tw.x, tw.y);
        ctx.scale(sc, sc);
        ctx.translate(-tw.x, -tw.y);
        ctx.shadowBlur = 20 * atkT;
        ctx.shadowColor = tw.type.glowColor || tw.type.color;
        tw.type.drawTower(ctx, tw.x, tw.y, CELL, tw.tier, time);
        ctx.restore();
      } else {
        tw.type.drawTower(ctx, tw.x, tw.y, CELL, tw.tier, time);
      }
    }

    // Range indicator for selected tower
    if (selectedTower) {
      drawRangeIndicator(ctx, selectedTower, time);
    }

    // Placement ghost tower
    if (placementMode && mouseOnCanvas && mouseGridCol >= 0 && mouseGridRow >= 0) {
      drawPlacementGhost(ctx, time);
    }

    // Synergy lines
    drawSynergyLines(ctx, time);

    // Nexus HP bar (rendered in world space)
    Map.drawNexusHP(ctx, cam, Map.nexus);

    ctx.restore();

    // ── Enemies (does its own cam translate via save/translate/restore) ──
    Enemies.drawAll(ctx, enemies, shakeCam, time);

    // ── FX above layer (projectiles, beams, particles — uses cam offset internally) ──
    FX.drawAbove(ctx, shakeCam, time);

    // ── Tip toast (screen space) ──
    if (tipTimer > 0) {
      var tipAlpha = tipTimer > 0.5 ? 1 : tipTimer / 0.5;
      ctx.save();
      ctx.globalAlpha = tipAlpha;
      ctx.font = 'bold 16px "Crimson Text", serif';
      var tw2 = ctx.measureText(tipText).width;
      var tx2 = (canvas.width - tw2) / 2;
      var ty2 = canvas.height * 0.2;
      // Background pill
      ctx.fillStyle = 'rgba(10, 10, 18, 0.85)';
      ctx.beginPath();
      ctx.roundRect(tx2 - 16, ty2 - 20, tw2 + 32, 32, 8);
      ctx.fill();
      ctx.strokeStyle = '#d4a017';
      ctx.lineWidth = 1;
      ctx.stroke();
      // Text
      ctx.fillStyle = '#ffdd88';
      ctx.textBaseline = 'middle';
      ctx.fillText(tipText, tx2, ty2 - 4);
      ctx.restore();
    }
  }

  // ─────────────────────────── Menu Background ─────────────────────────
  function drawMenuBackground(ctx, time, vw, vh) {
    // Subtle animated dark fantasy atmosphere
    var grad = ctx.createRadialGradient(vw / 2, vh / 2, 0, vw / 2, vh / 2, vw * 0.6);
    grad.addColorStop(0, '#151520');
    grad.addColorStop(0.5, '#0c0c18');
    grad.addColorStop(1, '#060610');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, vw, vh);

    // Floating arcane particles
    ctx.save();
    for (var i = 0; i < 40; i++) {
      var seed = i * 137.5;
      var px = (vw / 2) + Math.cos(time * 0.3 + seed) * vw * 0.35 * Math.sin(seed * 0.01);
      var py = (vh / 2) + Math.sin(time * 0.25 + seed * 0.7) * vh * 0.35 * Math.cos(seed * 0.013);
      var alpha = 0.15 + 0.1 * Math.sin(time * 2 + seed);
      var size = 1 + Math.sin(seed) * 1.5;

      var colors = ['#d4a017', '#4488ff', '#bb44ff', '#44ddff'];
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(px, py, Math.abs(size), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Faint rune circle
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.06)';
    ctx.lineWidth = 1;
    var cr = Math.min(vw, vh) * 0.3;
    ctx.beginPath();
    ctx.arc(vw / 2, vh / 2, cr, 0, Math.PI * 2);
    ctx.stroke();
    // Rotating inner circle
    ctx.save();
    ctx.translate(vw / 2, vh / 2);
    ctx.rotate(time * 0.1);
    ctx.beginPath();
    ctx.arc(0, 0, cr * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 160, 23, 0.04)';
    ctx.stroke();
    // Rune marks
    for (var r = 0; r < 8; r++) {
      var a = (r / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * cr * 0.65, Math.sin(a) * cr * 0.65);
      ctx.lineTo(Math.cos(a) * cr * 0.75, Math.sin(a) * cr * 0.75);
      ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }

  // ─────────────────────────── Range Indicator ─────────────────────────
  function drawRangeIndicator(ctx, tower, time) {
    var stats = tower.effectiveStats || Towers.getEffectiveStats(tower);
    var range = (stats.range || tower.type.range) * CELL;
    var pulse = 0.15 + 0.05 * Math.sin(time * 4);

    ctx.save();
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, range, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(' + hexToRgb(tower.type.color) + ',' + (pulse + 0.1) + ')';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(' + hexToRgb(tower.type.color) + ',' + (pulse * 0.3) + ')';
    ctx.fill();
    ctx.restore();
  }

  function hexToRgb(hex) {
    var n = parseInt(hex.replace('#', ''), 16);
    return ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255);
  }

  // ─────────────────────────── Placement Ghost ─────────────────────────
  function drawPlacementGhost(ctx, time) {
    if (!placementType) return;
    var T = Towers.TYPES[placementType];
    if (!T) return;

    var pos = Map.gridToWorld(mouseGridCol, mouseGridRow);
    var gx = pos.x + CELL / 2;
    var gy = pos.y + CELL / 2;

    ctx.save();
    ctx.globalAlpha = 0.5;
    T.drawTower(ctx, gx, gy, CELL, 1, time);
    ctx.globalAlpha = 1;

    // Show range
    var range = T.range * CELL;
    ctx.beginPath();
    ctx.arc(gx, gy, range, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(' + hexToRgb(T.color) + ',0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ─────────────────────────── Synergy Lines ───────────────────────────
  function drawSynergyLines(ctx, time) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);

    for (var i = 0; i < towers.length; i++) {
      var tw = towers[i];
      if (!tw.synergies || tw.synergies.length === 0) continue;

      for (var s = 0; s < tw.synergies.length; s++) {
        var syn = tw.synergies[s];
        if (!syn.partner) continue;

        // Only draw line from lower-id tower to avoid duplicates
        if (tw.id > syn.partner.id) continue;

        var alpha = 0.12 + 0.06 * Math.sin(time * 3 + tw.id + syn.partner.id);
        ctx.strokeStyle = 'rgba(100,180,255,' + alpha + ')';
        ctx.beginPath();
        ctx.moveTo(tw.x, tw.y);
        ctx.lineTo(syn.partner.x, syn.partner.y);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]);
    ctx.restore();
  }

  // ─────────────────────────── Input: Mouse ────────────────────────────
  function updateMouseGrid(clientX, clientY) {
    mouseX = clientX;
    mouseY = clientY;
    var worldX = clientX + cam.x - shakeX;
    var worldY = clientY + cam.y - shakeY;
    var gc = Map.worldToGrid(worldX, worldY);
    mouseGridCol = gc.col;
    mouseGridRow = gc.row;
  }

  canvas.addEventListener('mousemove', function (e) {
    mouseOnCanvas = true;
    updateMouseGrid(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseleave', function () {
    mouseOnCanvas = false;
  });

  canvas.addEventListener('click', function (e) {
    if (state === 'menu' || state === 'paused' || state === 'gameover' || state === 'victory') return;

    updateMouseGrid(e.clientX, e.clientY);

    if (placementMode) {
      if (mouseGridCol >= 0 && mouseGridCol < Map.MAP_COLS &&
          mouseGridRow >= 0 && mouseGridRow < Map.MAP_ROWS) {
        tryPlaceTower(mouseGridCol, mouseGridRow);
      }
      return;
    }

    // Check if clicked on an existing tower
    var clicked = findTowerAt(mouseGridCol, mouseGridRow);
    if (clicked) {
      showTowerInfo(clicked);
    } else {
      deselectTower();
    }
  });

  canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    if (placementMode) {
      cancelPlacement();
    } else {
      deselectTower();
    }
  });

  // Touch support
  canvas.addEventListener('touchstart', function (e) {
    if (state === 'menu' || state === 'paused' || state === 'gameover' || state === 'victory') return;
    e.preventDefault();
    var t = e.touches[0];
    mouseOnCanvas = true;
    updateMouseGrid(t.clientX, t.clientY);

    if (placementMode) {
      if (mouseGridCol >= 0 && mouseGridCol < Map.MAP_COLS &&
          mouseGridRow >= 0 && mouseGridRow < Map.MAP_ROWS) {
        tryPlaceTower(mouseGridCol, mouseGridRow);
      }
      return;
    }

    var clicked = findTowerAt(mouseGridCol, mouseGridRow);
    if (clicked) {
      showTowerInfo(clicked);
    } else {
      deselectTower();
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    var t = e.touches[0];
    updateMouseGrid(t.clientX, t.clientY);
  }, { passive: false });

  function findTowerAt(col, row) {
    for (var i = 0; i < towers.length; i++) {
      if (towers[i].col === col && towers[i].row === row) return towers[i];
    }
    return null;
  }

  function findTowerById(id) {
    for (var i = 0; i < towers.length; i++) {
      if (towers[i].id === id) return towers[i];
    }
    return null;
  }

  // ─────────────────────────── Input: Keyboard ─────────────────────────
  document.addEventListener('keydown', function (e) {
    var key = e.key;

    // Number keys 1-8: tower placement
    if (key >= '1' && key <= '8') {
      var idx = parseInt(key) - 1;
      if (idx < TOWER_ORDER.length && (state === 'build' || state === 'wave')) {
        startPlacement(TOWER_ORDER[idx]);
      }
      return;
    }

    switch (key.toLowerCase()) {
      case 'u':
        // Upgrade path A
        if (selectedTower && selectedTower.tier < 3) {
          doUpgrade('a');
        }
        break;

      case 'i':
        // Upgrade path B
        if (selectedTower && selectedTower.tier < 3) {
          doUpgrade('b');
        }
        break;

      case 's':
        // Sell
        if (selectedTower && (state === 'build' || state === 'wave')) {
          doSell();
        }
        break;

      case ' ':
        e.preventDefault();
        if (state === 'build') {
          startWave();
        } else if (state === 'wave') {
          enterPause();
        }
        break;

      case 'escape':
        if (placementMode) {
          cancelPlacement();
        } else if (selectedTower) {
          deselectTower();
        } else if (state === 'build' || state === 'wave') {
          enterPause();
        } else if (state === 'paused') {
          resumeGame();
        }
        break;
    }
  });

  // ─────────────────────────── Button Event Listeners ──────────────────
  $btnNewGame.addEventListener('click', startNewGame);
  $btnRetry.addEventListener('click', startNewGame);
  $btnVictoryMenu.addEventListener('click', enterMenu);
  $btnResume.addEventListener('click', resumeGame);
  $btnQuit.addEventListener('click', enterMenu);
  $btnSendWave.addEventListener('click', function () {
    if (state === 'build') startWave();
  });
  $btnPause.addEventListener('click', function () {
    if (state === 'build' || state === 'wave') enterPause();
    else if (state === 'paused') resumeGame();
  });

  // Speed buttons
  var speedBtns = document.querySelectorAll('.speed-btn');
  for (var sb = 0; sb < speedBtns.length; sb++) {
    speedBtns[sb].addEventListener('click', function () {
      gameSpeed = parseInt(this.dataset.speed);
      updateSpeedButtons();
    });
  }

  // ─────────────────────────── Game Loop ───────────────────────────────
  function gameLoop(timestamp) {
    requestAnimationFrame(gameLoop);

    var rawDt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;

    if (state === 'menu') {
      render(timestamp);
      return;
    }

    if (state === 'paused') {
      render(timestamp);
      return;
    }

    var dt = rawDt * gameSpeed;
    update(dt);
    render(timestamp);
  }

  // ─────────────────────────── Initialize ──────────────────────────────
  updateCamera();
  window.addEventListener('resize', updateCamera);
  $bestWave.textContent = 'Wave ' + loadBest();

  // Start game loop
  lastTime = performance.now();
  requestAnimationFrame(gameLoop);

})();
