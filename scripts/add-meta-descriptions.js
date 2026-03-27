#!/usr/bin/env node
/**
 * add-meta-descriptions.js
 * Generates and injects <meta name="description"> tags into ~360 content pages.
 * Skips files that already have a meta description.
 * Uses only Node.js built-in modules.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── File Discovery ──────────────────────────────────────────────────────────

function collectFiles() {
  const files = [];

  // styles/*.html (not index.html)
  addGlobDir(files, 'styles', '*.html', ['index.html']);

  // techguides/*.html (not index.html)
  addGlobDir(files, 'techguides', '*.html', ['index.html']);

  // stories/*/index.html
  addSubdirIndexes(files, 'stories');

  // architecture/*/index.html
  addSubdirIndexes(files, 'architecture');

  // api-alley/*/index.html
  addSubdirIndexes(files, 'api-alley');

  // games/*.html (not index.html, not index-popart.html) + games/survivors/*.html
  addGlobDir(files, 'games', '*.html', ['index.html', 'index-popart.html']);
  addGlobDir(files, 'games/survivors', '*.html', []);

  // news/*/index.html
  addSubdirIndexes(files, 'news');

  // kids/games/*/index.html, kids/create/*/index.html, kids/stories/*/index.html
  addSubdirIndexes(files, 'kids/games');
  addSubdirIndexes(files, 'kids/create');
  const kidsStoriesDir = path.join(ROOT, 'kids/stories');
  if (fs.existsSync(kidsStoriesDir)) {
    addSubdirIndexes(files, 'kids/stories');
  }

  // tools/*/index.html (not tools/index.html)
  addSubdirIndexes(files, 'tools');

  // music sub-pages
  addSpecificFile(files, 'music/audio-tracker/index.html');
  addSpecificFile(files, 'music/visualizer/index.html');

  // dataviz/*/index.html
  addSubdirIndexes(files, 'dataviz');

  // portfolio/*.html (not index.html)
  addGlobDir(files, 'portfolio', '*.html', ['index.html']);

  // tutorials/*/index.html
  addSubdirIndexes(files, 'tutorials');

  // challenges/*/index.html
  addSubdirIndexes(files, 'challenges');

  return files;
}

function addGlobDir(files, relDir, pattern, exclude) {
  const dir = path.join(ROOT, relDir);
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir).filter(f => {
    if (!f.endsWith('.html')) return false;
    if (exclude.includes(f)) return false;
    return fs.statSync(path.join(dir, f)).isFile();
  });
  for (const f of entries) {
    files.push(path.join(dir, f));
  }
}

function addSubdirIndexes(files, relDir) {
  const dir = path.join(ROOT, relDir);
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir).filter(f => {
    const full = path.join(dir, f);
    return fs.statSync(full).isDirectory() && fs.existsSync(path.join(full, 'index.html'));
  });
  for (const f of entries) {
    files.push(path.join(dir, f, 'index.html'));
  }
}

function addSpecificFile(files, relPath) {
  const full = path.join(ROOT, relPath);
  if (fs.existsSync(full)) files.push(full);
}

// ── Extraction ──────────────────────────────────────────────────────────────

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m ? cleanText(m[1]) : '';
}

function extractH1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? cleanText(m[1]) : '';
}

function extractSubtitle(html) {
  // Try h2 first
  const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h2) {
    const text = cleanText(h2[1]);
    // Skip section headings like "01. Color Palette"
    if (text && !/^\d{2}\./.test(text)) return text;
  }
  // Try subtitle/tagline/description class
  const cls = html.match(/<[^>]+class="[^"]*(?:subtitle|tagline|description)[^"]*"[^>]*>([\s\S]*?)<\/[^>]+>/i);
  if (cls) return cleanText(cls[1]);
  return '';
}

function cleanText(s) {
  return s
    .replace(/<[^>]+>/g, '')         // strip HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, '\u2014')
    .replace(/&ndash;/g, '\u2013')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#\d+;/g, '')
    .replace(/&\w+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Description Generation ──────────────────────────────────────────────────

function getSection(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel.startsWith('styles/')) return 'styles';
  if (rel.startsWith('techguides/')) return 'techguides';
  if (rel.startsWith('stories/')) return 'stories';
  if (rel.startsWith('architecture/')) return 'architecture';
  if (rel.startsWith('api-alley/')) return 'api-alley';
  if (rel.startsWith('games/')) return 'games';
  if (rel.startsWith('news/')) return 'news';
  if (rel.startsWith('kids/')) return 'kids';
  if (rel.startsWith('tools/')) return 'tools';
  if (rel.startsWith('music/')) return 'music';
  if (rel.startsWith('dataviz/')) return 'dataviz';
  if (rel.startsWith('portfolio/')) return 'portfolio';
  if (rel.startsWith('tutorials/')) return 'tutorials';
  if (rel.startsWith('challenges/')) return 'challenges';
  return 'default';
}

function getKidsType(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (rel.startsWith('kids/games/')) return 'game';
  if (rel.startsWith('kids/create/')) return 'creative tool';
  if (rel.startsWith('kids/stories/')) return 'story';
  return 'activity';
}

function generateDescription(filePath, html) {
  const section = getSection(filePath);
  const title = extractTitle(html);
  const h1 = extractH1(html);
  const subtitle = extractSubtitle(html);

  // Derive a "name" from the filename/folder for styles
  const basename = path.basename(filePath, '.html');
  const dirname = path.basename(path.dirname(filePath));
  const styleName = basename.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  let desc = '';

  switch (section) {
    case 'styles':
      desc = `${title || styleName} CSS design system style guide — explore typography, color palettes, and component patterns in the ${styleName} aesthetic. Part of GG Prompts' collection of 200+ handcrafted design systems.`;
      break;

    case 'techguides':
      desc = `${title || h1} — a styled developer reference covering key concepts, commands, and workflows with syntax-highlighted examples.`;
      break;

    case 'stories':
      desc = `Interactive educational story: ${title || h1}.${subtitle ? ' ' + subtitle + '.' : ''} A visual, narrated learning experience from GG Prompts.`;
      break;

    case 'architecture': {
      const name = dirname.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      desc = `Interactive architecture map of ${name} — explore components, data flow, and system design in a visual blueprint layout.`;
      break;
    }

    case 'api-alley':
      desc = `${title || h1} — live API widgets with real-time data fetching. Part of API Alley's collection of 450+ free API integrations.`;
      break;

    case 'games':
      desc = `${title || h1} — a browser game built with vanilla HTML, CSS, and JavaScript. No frameworks, no install, just play.`;
      break;

    case 'news':
      desc = `${title || h1} — daily AI news edition from The AI Dispatch.`;
      break;

    case 'kids': {
      const kType = getKidsType(filePath);
      desc = `${title || h1} — a fun, toddler-friendly ${kType} from Kids' Corner.`;
      break;
    }

    case 'tools':
      desc = `${title || h1} — a creative tool built with vanilla HTML/CSS/JS.`;
      break;

    case 'music':
      desc = `${title || h1} — part of Mozart's Study, the chiptune music studio.`;
      break;

    default: // dataviz, portfolio, tutorials, challenges
      desc = `${title || h1}${subtitle ? ' — ' + subtitle : (h1 && title !== h1 ? ' — ' + h1 : '')}. Part of GG Prompts.`;
      break;
  }

  // Truncate to 155 chars
  if (desc.length > 155) {
    desc = desc.substring(0, 152) + '...';
  }

  // Escape quotes for HTML attribute
  desc = desc.replace(/"/g, '&quot;');

  return desc;
}

// ── Injection ───────────────────────────────────────────────────────────────

function hasMetaDescription(html) {
  return /<meta\s+name=["']description["']/i.test(html);
}

function injectMetaDescription(html, desc) {
  // Insert after <meta name="viewport"...> line
  const viewportRegex = /(<meta\s+name=["']viewport["'][^>]*>)/i;
  const match = html.match(viewportRegex);
  if (match) {
    const idx = html.indexOf(match[0]) + match[0].length;
    // Find the end of the line
    let lineEnd = html.indexOf('\n', idx);
    if (lineEnd === -1) lineEnd = idx;
    const before = html.substring(0, lineEnd);
    const after = html.substring(lineEnd);
    // Detect indentation from the viewport line
    const lineStart = html.lastIndexOf('\n', html.indexOf(match[0]));
    const indent = html.substring(lineStart + 1, html.indexOf(match[0])).match(/^(\s*)/)[1];
    return before + '\n' + indent + `<meta name="description" content="${desc}">` + after;
  }

  // Fallback: insert after <head>
  const headIdx = html.indexOf('<head>');
  if (headIdx !== -1) {
    const insertAt = headIdx + '<head>'.length;
    return html.substring(0, insertAt) + '\n    ' + `<meta name="description" content="${desc}">` + html.substring(insertAt);
  }

  return null; // Can't inject
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  const files = collectFiles();
  let processed = 0;
  let skipped = 0;
  let injected = 0;
  let errors = 0;

  console.log(`Found ${files.length} content files to process.\n`);

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);
    const html = fs.readFileSync(filePath, 'utf8');

    if (hasMetaDescription(html)) {
      skipped++;
      continue;
    }

    const desc = generateDescription(filePath, html);
    const newHtml = injectMetaDescription(html, desc);

    if (newHtml === null) {
      console.log(`  ERROR: Could not inject into ${rel}`);
      errors++;
      continue;
    }

    fs.writeFileSync(filePath, newHtml, 'utf8');
    console.log(`  + ${rel}`);
    console.log(`    "${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}"`);
    injected++;
    processed++;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Summary:`);
  console.log(`  Total files found:  ${files.length}`);
  console.log(`  Already had desc:   ${skipped}`);
  console.log(`  Descriptions added: ${injected}`);
  console.log(`  Errors:             ${errors}`);
}

main();
