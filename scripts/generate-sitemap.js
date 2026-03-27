#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Walks the project tree and generates sitemap.xml for ggprompts.com.
 * Uses only Node.js built-in modules (fs, path).
 *
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ggprompts.com';
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Directories to skip entirely
const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.git',
  'scripts',
  'briefs',
  'prompts',
  'ideas',
]);

// Files to skip
const EXCLUDED_FILES = new Set([
  'CLAUDE.md',
]);

/**
 * Recursively collect all .html files, respecting exclusions.
 */
function walkDir(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walkDir(fullPath, results);
    } else if (entry.isFile()) {
      // Skip non-HTML files
      if (path.extname(entry.name) !== '.html') continue;
      // Skip excluded filenames
      if (EXCLUDED_FILES.has(entry.name)) continue;

      results.push(fullPath);
    }
  }

  return results;
}

/**
 * Convert an absolute file path to a sitemap URL.
 * - Strip index.html from the end (directory URLs)
 * - Keep other .html filenames
 */
function fileToUrl(filePath) {
  let relative = path.relative(PROJECT_ROOT, filePath);
  // Normalize to forward slashes
  relative = relative.split(path.sep).join('/');

  // Strip trailing index.html for clean directory URLs
  if (relative === 'index.html') {
    return BASE_URL + '/';
  }
  if (relative.endsWith('/index.html')) {
    return BASE_URL + '/' + relative.slice(0, -'index.html'.length);
  }
  return BASE_URL + '/' + relative;
}

/**
 * Determine changefreq based on URL depth.
 * Hub/index pages (depth 0-1) get "weekly", content pages get "monthly".
 */
function getChangeFreq(url) {
  const pathname = url.replace(BASE_URL, '');
  // Count path segments (ignore empty strings from leading/trailing slashes)
  const segments = pathname.split('/').filter(Boolean);

  // Root page (/), root-level pages (browse.html, landing.html),
  // and section hub pages (/styles/, /stories/, /news/, etc.)
  // These all have 0 or 1 path segments.
  if (segments.length <= 1) return 'weekly';

  // Everything deeper is content — monthly
  return 'monthly';
}

// --- Main ---

const htmlFiles = walkDir(PROJECT_ROOT);
const urls = htmlFiles.map(f => fileToUrl(f)).sort();

const today = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

for (const url of urls) {
  const changefreq = getChangeFreq(url);
  xml += '  <url>\n';
  xml += `    <loc>${url}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += '  </url>\n';
}

xml += '</urlset>\n';

const outputPath = path.join(PROJECT_ROOT, 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf-8');

console.log(`Sitemap generated: ${outputPath}`);
console.log(`Total URLs: ${urls.length}`);
