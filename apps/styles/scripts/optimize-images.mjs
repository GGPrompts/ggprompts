import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, basename } from 'path';

const DOWNLOADS = '/mnt/c/Users/marci/Downloads';
const OUTPUT = './public/products';

// Map source files to clean names
const imageMap = {
  'Futuristic Judgy Toaster': ['toaster-1.webp', 'toaster-2.webp'],
  'Invisible Socks Challenge': ['socks-1.webp', 'socks-2.webp'],
  'Telepathic Remote Control': ['remote-1.webp', 'remote-2.webp'],
  'Reverse Countdown Timer': ['timer-1.webp', 'timer-2.webp'],
  'Self-Folding Basket': ['basket-1.webp', 'basket-2.webp'],
};

// Track which index we're on for each product
const indices = {};

async function optimizeImage(inputPath, outputName) {
  const outputPath = join(OUTPUT, outputName);

  const inputStats = await stat(inputPath);
  const inputSize = (inputStats.size / 1024 / 1024).toFixed(2);

  await sharp(inputPath)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(outputPath);

  const outputStats = await stat(outputPath);
  const outputSize = (outputStats.size / 1024).toFixed(0);

  console.log(`✓ ${outputName}: ${inputSize}MB → ${outputSize}KB`);
}

async function main() {
  console.log('Optimizing product images...\n');

  // Ensure output directory exists
  await mkdir(OUTPUT, { recursive: true });

  // Get all PNG files from downloads
  const files = await readdir(DOWNLOADS);
  const todayFiles = files
    .filter(f => f.startsWith('20251124_') && f.endsWith('.png'))
    .sort();

  let totalInputMB = 0;
  let totalOutputKB = 0;

  for (const file of todayFiles) {
    const inputPath = join(DOWNLOADS, file);

    // Find which product this belongs to
    for (const [productName, outputNames] of Object.entries(imageMap)) {
      if (file.includes(productName)) {
        const idx = indices[productName] || 0;
        if (idx < outputNames.length) {
          const inputStats = await stat(inputPath);
          totalInputMB += inputStats.size / 1024 / 1024;

          await optimizeImage(inputPath, outputNames[idx]);

          const outputStats = await stat(join(OUTPUT, outputNames[idx]));
          totalOutputKB += outputStats.size / 1024;

          indices[productName] = idx + 1;
        }
        break;
      }
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Total: ${totalInputMB.toFixed(1)}MB → ${(totalOutputKB / 1024).toFixed(1)}MB`);
  console.log(`Saved: ${(totalInputMB - totalOutputKB / 1024).toFixed(1)}MB (${((1 - totalOutputKB / 1024 / totalInputMB) * 100).toFixed(0)}% reduction)`);
}

main().catch(console.error);
