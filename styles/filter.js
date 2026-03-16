(function () {
  'use strict';

  // ── Metadata: theme (light|dark|colorful) + categories (1-2 from 10 tags) ──
  var META = {
    'civic':                    { theme: 'light',    cat: ['print'] },
    'federal-night':            { theme: 'dark',     cat: ['digital'] },
    'retro-terminal':           { theme: 'dark',     cat: ['retro'] },
    'neon-brutal':              { theme: 'dark',     cat: ['digital', 'playful'] },
    'neo-void':                 { theme: 'dark',     cat: ['digital'] },
    'glassmorphism':            { theme: 'colorful', cat: ['material'] },
    'swiss':                    { theme: 'light',    cat: ['print'] },
    'vaporwave':                { theme: 'colorful', cat: ['retro'] },
    'editorial':                { theme: 'light',    cat: ['print'] },
    'neumorphism':              { theme: 'light',    cat: ['material'] },
    'art-deco':                 { theme: 'dark',     cat: ['art', 'luxury'] },
    'terrazzo':                 { theme: 'light',    cat: ['material'] },
    'kinetic-flux':             { theme: 'dark',     cat: ['digital'] },
    'verdant-grove':            { theme: 'light',    cat: ['nature'] },
    'atlas-console':            { theme: 'dark',     cat: ['digital'] },
    'plain-chaos':              { theme: 'light',    cat: ['print'] },
    'memphis':                  { theme: 'colorful', cat: ['art', 'playful'] },
    'claymorphism':             { theme: 'light',    cat: ['playful', 'material'] },
    'dark-academia':            { theme: 'dark',     cat: ['luxury'] },
    'dark-folio':               { theme: 'dark',     cat: ['luxury'] },
    'gaming':                   { theme: 'dark',     cat: ['digital', 'playful'] },
    'sketch':                   { theme: 'light',    cat: ['playful'] },
    'pixel':                    { theme: 'dark',     cat: ['retro', 'playful'] },
    'y2k':                      { theme: 'colorful', cat: ['retro'] },
    'japanese-zen':             { theme: 'light',    cat: ['cultural'] },
    'cyberpunk':                { theme: 'dark',     cat: ['digital', 'moody'] },
    'paper-craft':              { theme: 'light',    cat: ['material'] },
    'bauhaus':                  { theme: 'colorful', cat: ['art'] },
    'nordic':                   { theme: 'light',    cat: ['nature'] },
    'brutalist-web':            { theme: 'light',    cat: ['print'] },
    'brutalist-concrete-plant': { theme: 'dark',     cat: ['material', 'moody'] },
    'bubbles':                  { theme: 'colorful', cat: ['playful'] },
    'watercolor':               { theme: 'light',    cat: ['material', 'art'] },
    'risograph':                { theme: 'light',    cat: ['print'] },
    'letterpress':              { theme: 'light',    cat: ['print', 'luxury'] },
    'film-grain':               { theme: 'dark',     cat: ['retro'] },
    'coffee':                   { theme: 'light',    cat: ['material'] },
    'darkroom':                 { theme: 'dark',     cat: ['moody', 'retro'] },
    'parchment':                { theme: 'light',    cat: ['material', 'luxury'] },
    'psychedelic':              { theme: 'colorful', cat: ['retro'] },
    'noir':                     { theme: 'dark',     cat: ['moody'] },
    'holographic':              { theme: 'colorful', cat: ['material'] },
    'moroccan':                 { theme: 'colorful', cat: ['cultural'] },
    'midcentury':               { theme: 'light',    cat: ['retro'] },
    'industrial':               { theme: 'dark',     cat: ['moody', 'material'] },
    'cosmic':                   { theme: 'dark',     cat: ['moody'] },
    'rts-hud':                  { theme: 'dark',     cat: ['digital', 'playful'] },
    'retro-futurism':           { theme: 'light',    cat: ['retro'] },
    'art-nouveau':              { theme: 'light',    cat: ['art'] },
    'streamline-moderne':       { theme: 'light',    cat: ['art', 'luxury'] },
    'frutiger-aero':            { theme: 'light',    cat: ['retro'] },
    'corporate-memphis':        { theme: 'light',    cat: ['playful'] },
    'knolling':                 { theme: 'light',    cat: ['material'] },
    'scandi-cozy':              { theme: 'light',    cat: ['nature'] },
    'concrete-brutalist':       { theme: 'dark',     cat: ['material', 'moody'] },
    'copper-verdigris':         { theme: 'dark',     cat: ['material'] },
    'chalkboard':               { theme: 'dark',     cat: ['print'] },
    'denim':                    { theme: 'light',    cat: ['material'] },
    'de-stijl':                 { theme: 'colorful', cat: ['art'] },
    'constructivism':           { theme: 'colorful', cat: ['art'] },
    'vienna-secession':         { theme: 'dark',     cat: ['art', 'luxury'] },
    'op-art':                   { theme: 'colorful', cat: ['art'] },
    'stained-glass':            { theme: 'dark',     cat: ['cultural', 'material'] },
    'embroidery':               { theme: 'light',    cat: ['material', 'cultural'] },
    'circuit-board':            { theme: 'dark',     cat: ['digital'] },
    'honeycomb':                { theme: 'light',    cat: ['nature'] },
    'korean-hanok':             { theme: 'light',    cat: ['cultural'] },
    'kente-cloth':              { theme: 'colorful', cat: ['cultural'] },
    'persian-miniature':        { theme: 'colorful', cat: ['cultural', 'luxury'] },
    'persian-carpet':           { theme: 'colorful', cat: ['cultural'] },
    'byzantine':                { theme: 'dark',     cat: ['cultural', 'luxury'] },
    'talavera':                 { theme: 'colorful', cat: ['cultural', 'playful'] },
    'jrpg-menu':                { theme: 'dark',     cat: ['playful', 'digital'] },
    'visual-novel':             { theme: 'light',    cat: ['playful'] },
    'windows31':                { theme: 'light',    cat: ['retro'] },
    'solarpunk':                { theme: 'light',    cat: ['nature'] },
    'air-traffic-control':      { theme: 'dark',     cat: ['digital'] },
    'swiss-international':      { theme: 'light',    cat: ['print'] },
    'coffee-shop':              { theme: 'light',    cat: ['material'] },
    'pop-art':                  { theme: 'colorful', cat: ['art', 'playful'] },
    'ukiyo-e':                  { theme: 'colorful', cat: ['cultural', 'art'] },
    'impressionism':            { theme: 'light',    cat: ['art'] },
    'rococo':                   { theme: 'light',    cat: ['art', 'luxury'] },
    'mozarts-study':            { theme: 'dark',     cat: ['luxury'] },
    'futurism':                 { theme: 'colorful', cat: ['art'] },
    'synthwave':                { theme: 'dark',     cat: ['retro', 'digital'] },
    'blueprint':                { theme: 'dark',     cat: ['digital'] },
    'celtic':                   { theme: 'light',    cat: ['cultural'] },
    'day-of-the-dead':          { theme: 'dark',     cat: ['cultural', 'playful'] },
    'newspaper':                { theme: 'light',    cat: ['print'] },
    'chinese-porcelain':        { theme: 'light',    cat: ['cultural'] },
    'chindogu':                 { theme: 'light',    cat: ['playful'] },
    'aboriginal-dot-art':       { theme: 'dark',     cat: ['cultural'] },
    'ocean-maritime':           { theme: 'dark',     cat: ['nature'] },
    'arctic':                   { theme: 'light',    cat: ['nature'] },
    'tropical':                 { theme: 'colorful', cat: ['nature'] },
    'tiki-bar':                 { theme: 'dark',     cat: ['cultural', 'playful'] },
    'wes-anderson':             { theme: 'light',    cat: ['playful'] },
    'cottagecore':              { theme: 'light',    cat: ['nature'] },
    'apothecary':               { theme: 'dark',     cat: ['luxury', 'nature'] },
    'gradient-mesh':            { theme: 'colorful', cat: ['digital'] },
    'cherry-blossom':           { theme: 'light',    cat: ['nature'] },
    'mac-os-classic':           { theme: 'light',    cat: ['retro'] },
    'dos-bios':                 { theme: 'dark',     cat: ['retro'] },
    'wireframe':                { theme: 'light',    cat: ['digital'] },
    'mughal':                   { theme: 'dark',     cat: ['cultural', 'luxury'] },
    'marble-gold':              { theme: 'dark',     cat: ['luxury', 'material'] },
    'astronomical':             { theme: 'dark',     cat: ['moody', 'digital'] },
    'architectural':            { theme: 'light',    cat: ['print'] },
    'suprematism':              { theme: 'light',    cat: ['art'] },
    'aquarium':                 { theme: 'dark',     cat: ['nature'] },
    'fire-and-heat':            { theme: 'dark',     cat: ['moody', 'nature'] },
    'gothic':                   { theme: 'dark',     cat: ['moody', 'luxury'] },
    'gothic-cathedral':         { theme: 'dark',     cat: ['luxury', 'moody'] },
    'pastel-goth':              { theme: 'dark',     cat: ['playful', 'moody'] },
    'baroque':                  { theme: 'dark',     cat: ['art', 'luxury'] },
    'pre-raphaelite':           { theme: 'dark',     cat: ['art', 'luxury'] },
    'minimalism':               { theme: 'light',    cat: ['art'] },
    'cubism':                   { theme: 'colorful', cat: ['art'] },
    'surrealism':               { theme: 'colorful', cat: ['art'] },
    'fauvism':                  { theme: 'colorful', cat: ['art'] },
    'mayan-aztec':              { theme: 'dark',     cat: ['cultural'] },
    'thai-temple':              { theme: 'dark',     cat: ['cultural', 'luxury'] },
    'ethiopian-geez':           { theme: 'dark',     cat: ['cultural'] },
    'russian-propaganda':       { theme: 'colorful', cat: ['cultural', 'moody'] },
    'indian-rangoli':           { theme: 'colorful', cat: ['cultural'] },
    'polynesian-tapa':          { theme: 'light',    cat: ['cultural'] },
    'bento-grid':               { theme: 'dark',     cat: ['digital'] },
    'neubrutalism':             { theme: 'light',    cat: ['playful', 'print'] },
    'barbiecore':               { theme: 'colorful', cat: ['playful'] },
    'dark-mode-material':       { theme: 'dark',     cat: ['digital'] },
    'notion-style':             { theme: 'light',    cat: ['digital'] },
    'mono-developer':           { theme: 'dark',     cat: ['digital'] },
    'volcanic':                 { theme: 'dark',     cat: ['nature', 'moody'] },
    'coral-reef':               { theme: 'dark',     cat: ['nature'] },
    'desert-sahara':            { theme: 'light',    cat: ['nature'] },
    'mushroom-mycelium':        { theme: 'dark',     cat: ['nature'] },
    'aurora-borealis':          { theme: 'dark',     cat: ['nature'] },
    'leather-wood':             { theme: 'dark',     cat: ['material'] },
    'origami':                  { theme: 'light',    cat: ['material'] },
    'roman-mosaic':             { theme: 'light',    cat: ['cultural'] },
    'cork-board':               { theme: 'light',    cat: ['playful', 'material'] },
    'steampunk':                { theme: 'dark',     cat: ['retro', 'material'] },
    'witchcore':                { theme: 'dark',     cat: ['moody', 'nature'] },
    'outrun':                   { theme: 'dark',     cat: ['retro'] },
    'cassette-futurism':        { theme: 'dark',     cat: ['retro', 'digital'] },
    'dieselpunk':               { theme: 'dark',     cat: ['retro'] },
    'cozy-game-ui':             { theme: 'light',    cat: ['playful'] },
    'blackletter-fraktur':      { theme: 'dark',     cat: ['print', 'cultural'] },
    'grunge-typography':        { theme: 'dark',     cat: ['print'] },
    'vintage-signage':          { theme: 'light',    cat: ['retro', 'print'] },
    'topographic-map':          { theme: 'light',    cat: ['nature', 'digital'] },
    'brutalist-zine':           { theme: 'light',    cat: ['print'] },
    'zine-punk':                { theme: 'colorful', cat: ['print', 'playful'] },
    'crime-scene':              { theme: 'dark',     cat: ['moody'] },
    'infrared-thermal':         { theme: 'dark',     cat: ['digital'] },
    'etch-a-sketch':            { theme: 'colorful', cat: ['playful', 'retro'] },
    'casino-vegas':             { theme: 'dark',     cat: ['playful'] },
    'sushi-bar':                { theme: 'light',    cat: ['cultural'] },
    'deep-sea-bioluminescence': { theme: 'dark',     cat: ['nature', 'moody'] },
    'clockwork-horologist':     { theme: 'dark',     cat: ['luxury', 'retro'] },
    'library-card-catalog':     { theme: 'light',    cat: ['luxury'] },
    'graffiti':                 { theme: 'dark',     cat: ['playful', 'print'] },
    'kaleidoscope':             { theme: 'colorful', cat: ['playful'] },
    'seasonal-scroll':          { theme: 'colorful', cat: ['nature'] },
    'terminal-2031':            { theme: 'dark',     cat: ['digital'] },
    'codex-terminal-2031':      { theme: 'dark',     cat: ['digital'] },
    'afrofuturism':             { theme: 'dark',     cat: ['cultural', 'digital'] },
    'anatomical-illustration':  { theme: 'light',    cat: ['print'] },
    'ascii-art':                { theme: 'dark',     cat: ['retro', 'digital'] },
    'batik':                    { theme: 'dark',     cat: ['cultural', 'material'] },
    'brutalist-typography':     { theme: 'dark',     cat: ['print'] },
    'coastal-cottage':          { theme: 'light',    cat: ['nature'] },
    'color-field':              { theme: 'colorful', cat: ['art'] },
    'comic-book':               { theme: 'colorful', cat: ['print', 'playful'] },
    'dadaism':                  { theme: 'colorful', cat: ['art'] },
    'data-visualization':       { theme: 'light',    cat: ['digital'] },
    'data-bento':               { theme: 'light',    cat: ['digital'] },
    'egyptian-pharaonic':       { theme: 'dark',     cat: ['cultural', 'luxury'] },
    'geological-mineral':       { theme: 'dark',     cat: ['nature', 'material'] },
    'glitch-art':               { theme: 'dark',     cat: ['digital'] },
    'goblincore':               { theme: 'dark',     cat: ['nature'] },
    'light-academia':           { theme: 'light',    cat: ['luxury'] },
    'liminal-space':            { theme: 'light',    cat: ['moody'] },
    'linocut':                  { theme: 'light',    cat: ['print', 'art'] },
    'low-poly':                 { theme: 'dark',     cat: ['digital'] },
    'macrame':                  { theme: 'light',    cat: ['material'] },
    'manga':                    { theme: 'light',    cat: ['print', 'cultural'] },
    'manuscript-illumination':  { theme: 'dark',     cat: ['luxury', 'cultural'] },
    'maximalism':               { theme: 'colorful', cat: ['playful'] },
    'microscopy':               { theme: 'dark',     cat: ['digital'] },
    'ottoman-iznik':            { theme: 'colorful', cat: ['cultural'] },
    'paleontology-fossil':      { theme: 'light',    cat: ['nature'] },
    'pointillism':              { theme: 'colorful', cat: ['art'] },
    'polaroid':                 { theme: 'light',    cat: ['retro'] },
    'pressed-flowers':          { theme: 'light',    cat: ['nature'] },
    'qr-code':                  { theme: 'light',    cat: ['digital'] },
    'regencycore':              { theme: 'light',    cat: ['luxury'] },
    'silent-film':              { theme: 'dark',     cat: ['retro', 'moody'] },
    'slavic-folk-art':          { theme: 'dark',     cat: ['cultural'] },
    'tibetan-buddhist':         { theme: 'colorful', cat: ['cultural'] },
    'viking-norse':             { theme: 'dark',     cat: ['cultural', 'moody'] },
    'rainbow-road':             { theme: 'colorful', cat: ['playful'] },
    'cassette-liner-notes':     { theme: 'light',    cat: ['retro'] },
    'soviet-space-program':     { theme: 'colorful', cat: ['cultural', 'retro'] },
    'carnival-fairground':      { theme: 'colorful', cat: ['playful'] },
    'terracotta-adobe':         { theme: 'light',    cat: ['cultural', 'material'] },
    'nautical-maritime-flags':  { theme: 'light',    cat: ['cultural'] }
  };

  var CATEGORIES = [
    { id: 'art',      label: 'Art Movement' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'nature',   label: 'Nature' },
    { id: 'retro',    label: 'Retro' },
    { id: 'digital',  label: 'Tech & Digital' },
    { id: 'print',    label: 'Print & Type' },
    { id: 'material', label: 'Material' },
    { id: 'luxury',   label: 'Elegant' },
    { id: 'playful',  label: 'Playful' },
    { id: 'moody',    label: 'Atmospheric' }
  ];

  var THEMES = [
    { id: 'light',    label: 'Light' },
    { id: 'dark',     label: 'Dark' },
    { id: 'colorful', label: 'Colorful' }
  ];

  var SORTS = [
    { id: 'original', label: 'Original Order' },
    { id: 'az',       label: 'A \u2192 Z' },
    { id: 'za',       label: 'Z \u2192 A' },
    { id: 'small',    label: 'Size: Smallest' },
    { id: 'large',    label: 'Size: Largest' }
  ];

  // ── State ──
  var state = { query: '', theme: 'all', category: 'all', sort: 'original' };

  // ── DOM refs ──
  var grid, cards, searchInput, sortSelect, statusEl, clearBtn;

  // ── Helpers ──
  function getCardKey(el) {
    var cls = el.className.match(/card-([^\s]+)/);
    return cls ? cls[1] : null;
  }

  function getCardTitle(el) {
    var h2 = el.querySelector('h2');
    return h2 ? h2.textContent.trim() : '';
  }

  function getCardDesc(el) {
    var p = el.querySelector('p');
    return p ? p.textContent.trim() : '';
  }

  function getCardSize(el) {
    var tag = el.querySelector('.tag');
    if (!tag) return 0;
    var m = tag.textContent.match(/~?(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function parseHash() {
    var h = location.hash.slice(1);
    if (!h) return;
    h.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      var k = decodeURIComponent(kv[0]);
      var v = decodeURIComponent(kv[1] || '');
      if (k === 'q') state.query = v;
      if (k === 't') state.theme = v || 'all';
      if (k === 'c') state.category = v || 'all';
      if (k === 's') state.sort = v || 'original';
    });
  }

  function writeHash() {
    var parts = [];
    if (state.query) parts.push('q=' + encodeURIComponent(state.query));
    if (state.theme !== 'all') parts.push('t=' + state.theme);
    if (state.category !== 'all') parts.push('c=' + state.category);
    if (state.sort !== 'original') parts.push('s=' + state.sort);
    history.replaceState(null, '', parts.length ? '#' + parts.join('&') : location.pathname);
  }

  // ── Build UI ──
  function buildUI() {
    grid = document.querySelector('.grid');
    if (!grid) return;

    cards = Array.prototype.slice.call(grid.querySelectorAll('.card'));

    // Stamp metadata + original index
    cards.forEach(function (el, i) {
      var key = getCardKey(el);
      var meta = key && META[key];
      el.setAttribute('data-index', i);
      el.setAttribute('data-title', getCardTitle(el).toLowerCase());
      el.setAttribute('data-desc', getCardDesc(el).toLowerCase());
      el.setAttribute('data-size', getCardSize(el));
      if (meta) {
        el.setAttribute('data-theme', meta.theme);
        el.setAttribute('data-cat', meta.cat.join(' '));
      }
    });

    // Create filter bar
    var bar = document.createElement('div');
    bar.className = 'filter-bar';
    bar.innerHTML = buildSearchRow() + buildPillRow('Theme:', 'theme', THEMES) +
                    buildPillRow('Style:', 'category', CATEGORIES) + buildStatusRow();
    grid.parentNode.insertBefore(bar, grid);

    // Grab refs
    searchInput = bar.querySelector('.filter-search');
    sortSelect = bar.querySelector('.filter-sort');
    statusEl = bar.querySelector('.filter-status-count');
    clearBtn = bar.querySelector('.filter-clear');

    // Events
    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        state.query = searchInput.value.trim().toLowerCase();
        apply();
      }, 150);
    });

    sortSelect.addEventListener('change', function () {
      state.sort = sortSelect.value;
      apply();
    });

    bar.addEventListener('click', function (e) {
      var pill = e.target.closest('.filter-pill');
      if (!pill) return;
      var group = pill.getAttribute('data-group');
      var value = pill.getAttribute('data-value');
      if (group === 'theme') state.theme = value;
      if (group === 'category') state.category = value;
      apply();
    });

    clearBtn.addEventListener('click', function (e) {
      e.preventDefault();
      state = { query: '', theme: 'all', category: 'all', sort: 'original' };
      searchInput.value = '';
      sortSelect.value = 'original';
      apply();
    });

    // Init from hash
    parseHash();
    searchInput.value = state.query;
    sortSelect.value = state.sort;
    apply();
  }

  function buildSearchRow() {
    var opts = SORTS.map(function (s) {
      return '<option value="' + s.id + '">' + s.label + '</option>';
    }).join('');
    return '<div class="filter-search-row">' +
      '<input type="text" class="filter-search" placeholder="Search by name or description\u2026" autocomplete="off" spellcheck="false">' +
      '<select class="filter-sort">' + opts + '</select>' +
      '</div>';
  }

  function buildPillRow(label, group, items) {
    var pills = '<button class="filter-pill active" data-group="' + group + '" data-value="all">All</button>';
    items.forEach(function (item) {
      pills += '<button class="filter-pill" data-group="' + group + '" data-value="' + item.id + '">' + item.label + '</button>';
    });
    return '<div class="filter-pill-row"><span class="filter-label">' + label + '</span><div class="filter-pills">' + pills + '</div></div>';
  }

  function buildStatusRow() {
    return '<div class="filter-status">' +
      '<span class="filter-status-count"></span>' +
      '<a href="#" class="filter-clear">Clear filters</a>' +
      '</div>';
  }

  // ── Apply filters + sort ──
  function apply() {
    var q = state.query;
    var visible = 0;

    // Update pill active states
    document.querySelectorAll('.filter-pill').forEach(function (pill) {
      var group = pill.getAttribute('data-group');
      var value = pill.getAttribute('data-value');
      var isActive = (group === 'theme' && value === state.theme) ||
                     (group === 'category' && value === state.category);
      pill.classList.toggle('active', isActive);
    });

    // Filter
    cards.forEach(function (el) {
      var show = true;

      // Text search
      if (q) {
        var title = el.getAttribute('data-title');
        var desc = el.getAttribute('data-desc');
        if (title.indexOf(q) === -1 && desc.indexOf(q) === -1) show = false;
      }

      // Theme
      if (show && state.theme !== 'all') {
        if (el.getAttribute('data-theme') !== state.theme) show = false;
      }

      // Category
      if (show && state.category !== 'all') {
        var cats = el.getAttribute('data-cat') || '';
        if (cats.indexOf(state.category) === -1) show = false;
      }

      el.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    // Sort
    if (state.sort !== 'original') {
      var sorted = cards.filter(function (el) { return el.style.display !== 'none'; });
      sorted.sort(function (a, b) {
        switch (state.sort) {
          case 'az': return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
          case 'za': return b.getAttribute('data-title').localeCompare(a.getAttribute('data-title'));
          case 'small': return (parseInt(a.getAttribute('data-size')) || 0) - (parseInt(b.getAttribute('data-size')) || 0);
          case 'large': return (parseInt(b.getAttribute('data-size')) || 0) - (parseInt(a.getAttribute('data-size')) || 0);
          default: return 0;
        }
      });
      var frag = document.createDocumentFragment();
      sorted.forEach(function (el) { frag.appendChild(el); });
      // Append hidden ones at the end
      cards.forEach(function (el) { if (el.style.display === 'none') frag.appendChild(el); });
      grid.appendChild(frag);
    } else {
      // Restore original order
      var byIndex = cards.slice().sort(function (a, b) {
        return parseInt(a.getAttribute('data-index')) - parseInt(b.getAttribute('data-index'));
      });
      var frag = document.createDocumentFragment();
      byIndex.forEach(function (el) { frag.appendChild(el); });
      grid.appendChild(frag);
    }

    // Status
    var total = cards.length;
    var isFiltered = state.query || state.theme !== 'all' || state.category !== 'all';
    statusEl.textContent = isFiltered
      ? 'Showing ' + visible + ' of ' + total + ' guides'
      : total + ' guides';
    clearBtn.style.display = (isFiltered || state.sort !== 'original') ? '' : 'none';

    if (visible === 0 && isFiltered) {
      if (!grid.querySelector('.filter-empty')) {
        var empty = document.createElement('div');
        empty.className = 'filter-empty';
        empty.textContent = 'No style guides match your filters.';
        grid.appendChild(empty);
      }
    } else {
      var existing = grid.querySelector('.filter-empty');
      if (existing) existing.remove();
    }

    writeHash();
  }

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
