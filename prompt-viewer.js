/**
 * GGPrompts Viewer
 * Floating buttons to view source code and build prompts.
 * Self-contained: injects its own CSS, no dependencies.
 *
 * - GitHub icon on every page (view source)
 * - Prompt icon only when a build prompt exists in the manifest
 */
(function () {
  'use strict';

  var scriptEl = document.currentScript;
  var scriptSrc = scriptEl ? scriptEl.src : '';
  var SITE_BASE = scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1);
  var REPO = 'https://github.com/GGPrompts/htmlstyleguides';

  // ── Helpers ──────────────────────────────────────────────

  function getPagePath() {
    var url = window.location.href.split('?')[0].split('#')[0];
    if (url.startsWith(SITE_BASE)) return url.slice(SITE_BASE.length) || 'index.html';
    var p = window.location.pathname.replace(/^\/htmlstyleguides\//, '/').replace(/^\//, '');
    return p || 'index.html';
  }

  // ── CSS ──────────────────────────────────────────────────

  var CSS = [
    '.ggp-wrap{position:fixed;bottom:0;right:0;z-index:99999;padding:14px}',
    '.ggp-dot{position:absolute;bottom:11px;right:11px;width:6px;height:6px;border-radius:50%;',
    '  background:rgba(128,128,128,.25);box-shadow:0 0 0 1px rgba(0,0,0,.08);',
    '  transition:opacity .3s;pointer-events:none}',
    '.ggp-wrap:hover .ggp-dot{opacity:0}',
    '.ggp-btns{display:flex;gap:8px;opacity:0;transform:translateY(5px);',
    '  transition:opacity .25s ease,transform .25s ease}',
    '.ggp-wrap:hover .ggp-btns{opacity:1;transform:translateY(0)}',
    '.ggp-btn{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.08);',
    '  cursor:pointer;display:flex;align-items:center;justify-content:center;',
    '  background:rgba(18,18,32,.92);color:#aaa;',
    '  transition:background .2s,color .2s,box-shadow .2s;',
    '  box-shadow:0 2px 10px rgba(0,0,0,.35)}',
    '.ggp-btn:hover{background:rgba(35,35,65,.95);color:#fff;box-shadow:0 3px 14px rgba(0,0,0,.5)}',
    '.ggp-btn svg{width:17px;height:17px}',

    '.ggp-ov{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.72);',
    '  display:flex;align-items:center;justify-content:center;padding:20px;',
    '  opacity:0;transition:opacity .2s ease;pointer-events:none}',
    '.ggp-ov.ggp-open{opacity:1;pointer-events:auto}',
    '.ggp-pnl{background:#151525;color:#d0d0d0;border-radius:12px;width:100%;max-width:700px;',
    '  max-height:82vh;display:flex;flex-direction:column;',
    '  box-shadow:0 8px 40px rgba(0,0,0,.55);overflow:hidden;',
    '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,sans-serif}',
    '.ggp-hdr{display:flex;align-items:center;gap:12px;padding:14px 18px;',
    '  border-bottom:1px solid rgba(255,255,255,.07)}',
    '.ggp-hdr h2{margin:0;font-size:13px;font-weight:600;color:#eee;flex:1;',
    '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.ggp-hdr-btn{background:rgba(255,255,255,.08);border:none;color:#999;cursor:pointer;',
    '  padding:5px 10px;border-radius:6px;font-size:11px;font-family:inherit;',
    '  transition:background .2s,color .2s;white-space:nowrap}',
    '.ggp-hdr-btn:hover{background:rgba(255,255,255,.14);color:#fff}',
    '.ggp-x{background:none;border:none;color:#666;cursor:pointer;font-size:20px;',
    '  line-height:1;padding:2px 6px;border-radius:4px;transition:color .2s}',
    '.ggp-x:hover{color:#fff}',
    '.ggp-body{padding:20px;overflow-y:auto;flex:1;-webkit-overflow-scrolling:touch}',
    '.ggp-body pre{background:#0c0c18;padding:16px;border-radius:8px;overflow-x:auto;',
    '  font-size:13px;line-height:1.65;white-space:pre-wrap;word-wrap:break-word;',
    '  font-family:"SF Mono",SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;',
    '  color:#c5c5d8;margin:0;border:1px solid rgba(255,255,255,.04)}',
    '.ggp-ft{padding:10px 18px;border-top:1px solid rgba(255,255,255,.07);',
    '  font-size:11px;color:#555;display:flex;gap:6px;align-items:center}',
    '.ggp-ft a{color:#6fa8dc;text-decoration:none}',
    '.ggp-ft a:hover{text-decoration:underline}',

    '@media(max-width:640px){',
    '  .ggp-pnl{border-radius:10px;max-height:90vh}',
    '  .ggp-body pre{font-size:11px;padding:12px}',
    '}'
  ].join('\n');

  var s = document.createElement('style');
  s.textContent = CSS;
  document.head.appendChild(s);

  // ── SVGs ─────────────────────────────────────────────────

  var ICON_GH = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

  var ICON_PROMPT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="2.5" width="13" height="11" rx="2"/><path d="M4.5 6.5l2.5 2-2.5 2"/><path d="M8.5 10.5H12"/></svg>';

  // ── Modal ────────────────────────────────────────────────

  function showPromptModal(promptPaths) {
    var paths = Array.isArray(promptPaths) ? promptPaths : [promptPaths];

    var ov = document.createElement('div');
    ov.className = 'ggp-ov';

    var pnl = document.createElement('div');
    pnl.className = 'ggp-pnl';

    // Header
    var hdr = document.createElement('div');
    hdr.className = 'ggp-hdr';
    var h2 = document.createElement('h2');
    h2.textContent = paths.length > 1 ? 'Build Prompts (' + paths.length + ')' : 'Build Prompt';
    var copyBtn = document.createElement('button');
    copyBtn.className = 'ggp-hdr-btn';
    copyBtn.textContent = 'Copy';
    var xBtn = document.createElement('button');
    xBtn.className = 'ggp-x';
    xBtn.innerHTML = '&#215;';
    hdr.appendChild(h2);
    hdr.appendChild(copyBtn);
    hdr.appendChild(xBtn);

    // Body
    var body = document.createElement('div');
    body.className = 'ggp-body';
    var pre = document.createElement('pre');
    pre.textContent = 'Loading\u2026';
    body.appendChild(pre);

    // Footer — links to all prompt files
    var ft = document.createElement('div');
    ft.className = 'ggp-ft';
    paths.forEach(function (p, i) {
      if (i > 0) ft.appendChild(document.createTextNode(' \u00b7 '));
      var a = document.createElement('a');
      a.href = REPO + '/blob/main/' + p;
      a.target = '_blank';
      a.textContent = p.split('/').pop();
      ft.appendChild(a);
    });

    pnl.appendChild(hdr);
    pnl.appendChild(body);
    pnl.appendChild(ft);
    ov.appendChild(pnl);
    document.body.appendChild(ov);

    requestAnimationFrame(function () {
      ov.classList.add('ggp-open');
    });

    // Fetch all prompts and concatenate
    Promise.all(paths.map(function (p) {
      return fetch(SITE_BASE + p)
        .then(function (r) { return r.ok ? r.text() : '[ Could not load ' + p + ' ]'; })
        .catch(function () { return '[ Could not load ' + p + ' ]'; })
        .then(function (text) { return paths.length > 1 ? ('\u2500\u2500 ' + p + ' \u2500\u2500\n\n' + text) : text; });
    })).then(function (texts) {
      var full = texts.join('\n\n');
      pre.textContent = full;
      copyBtn.onclick = function () {
        navigator.clipboard.writeText(full).then(function () {
          copyBtn.textContent = 'Copied!';
          setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1500);
        });
      };
    });

    // Close
    function close() {
      ov.classList.remove('ggp-open');
      setTimeout(function () { ov.remove(); }, 220);
    }
    xBtn.onclick = close;
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    var escHandler = function (e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
  }

  // ── Build UI ─────────────────────────────────────────────

  function build(manifest) {
    var path = getPagePath();

    var wrap = document.createElement('div');
    wrap.className = 'ggp-wrap';

    var dot = document.createElement('div');
    dot.className = 'ggp-dot';

    var btns = document.createElement('div');
    btns.className = 'ggp-btns';

    // GitHub button — always shown
    var gh = document.createElement('button');
    gh.className = 'ggp-btn';
    gh.innerHTML = ICON_GH;
    gh.title = 'View source on GitHub';
    gh.onclick = function () { window.open(REPO + '/blob/main/' + path, '_blank'); };
    btns.appendChild(gh);

    // Prompt button — only if a prompt mapping exists
    var promptPath = manifest[path] || null;
    if (promptPath) {
      var pb = document.createElement('button');
      pb.className = 'ggp-btn';
      pb.innerHTML = ICON_PROMPT;
      pb.title = 'View the prompt that built this';
      pb.onclick = function () { showPromptModal(promptPath); };
      btns.appendChild(pb);
    }

    wrap.appendChild(dot);
    wrap.appendChild(btns);
    document.body.appendChild(wrap);
  }

  // ── Init ─────────────────────────────────────────────────

  fetch(SITE_BASE + 'prompts/manifest.json')
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (manifest) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { build(manifest); });
      } else {
        build(manifest);
      }
    });
})();
