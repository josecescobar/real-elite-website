#!/usr/bin/env node
/**
 * Image optimization script for Real Elite Contracting website.
 * - Compresses oversized images to <300KB
 * - Compresses logo.png and converts to WebP (~50KB)
 * - Generates favicon.ico (32x32) and apple-touch-icon.png (180x180)
 */

import sharp from 'sharp';
import { readdir, stat, copyFile, rename } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../public/images');
const appDir = path.join(__dirname, '../src/app');
const publicDir = path.join(__dirname, '../public');

const MAX_BYTES = 300 * 1024; // 300KB target for regular images
const LOGO_MAX_BYTES = 50 * 1024; // 50KB target for logo WebP

async function getFileSizeKB(filePath) {
  const s = await stat(filePath);
  return Math.round(s.size / 1024);
}

async function compressLogo() {
  const logoPath = path.join(imagesDir, 'logo.png');
  const backupPath = path.join(imagesDir, 'logo.png.backup');
  const webpPath = path.join(imagesDir, 'logo.webp');

  const originalSize = await getFileSizeKB(logoPath);
  console.log(`\nLogo: ${originalSize}KB original`);

  // Backup original
  if (!existsSync(backupPath)) {
    await copyFile(logoPath, backupPath);
    console.log('  Backed up logo.png → logo.png.backup');
  }

  // Convert to WebP with quality tuning for ~50KB
  await sharp(logoPath)
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webpPath);

  const webpSize = await getFileSizeKB(webpPath);
  console.log(`  logo.webp: ${webpSize}KB`);

  // Also compress the original PNG in-place (keep for fallback)
  const tmpPng = path.join(imagesDir, 'logo_tmp.png');
  await sharp(logoPath)
    .resize({ width: 400, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 80 })
    .toFile(tmpPng);

  await rename(tmpPng, logoPath);
  const newPngSize = await getFileSizeKB(logoPath);
  console.log(`  logo.png (compressed): ${newPngSize}KB`);
}

async function generateFavicons() {
  const logoPath = path.join(imagesDir, 'logo.png');

  console.log('\nGenerating favicons...');

  // favicon.ico as PNG at 32x32 (Next.js accepts .ico as PNG)
  const faviconPath = path.join(appDir, 'favicon.ico');
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(faviconPath);
  console.log(`  favicon.ico → ${faviconPath} (32x32)`);

  // apple-touch-icon.png at 180x180
  const appleIconPath = path.join(appDir, 'apple-icon.png');
  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 } })
    .png()
    .toFile(appleIconPath);
  console.log(`  apple-icon.png → ${appleIconPath} (180x180)`);
}

async function compressImages() {
  const files = await readdir(imagesDir);
  const imageFiles = files.filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('logo') && !f.endsWith('.backup')
  );

  console.log(`\nCompressing ${imageFiles.length} images (target: <300KB each)...`);

  let compressed = 0;
  let skipped = 0;

  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const originalSize = await getFileSizeKB(filePath);

    if (originalSize <= 300) {
      console.log(`  SKIP  ${file} (${originalSize}KB — already under 300KB)`);
      skipped++;
      continue;
    }

    // Backup original
    const backupPath = filePath + '.backup';
    if (!existsSync(backupPath)) {
      await copyFile(filePath, backupPath);
    }

    const ext = path.extname(file).toLowerCase();
    const tmpPath = filePath + '.tmp' + ext;

    try {
      if (ext === '.png') {
        await sharp(filePath)
          .resize({ width: 1920, withoutEnlargement: true })
          .png({ compressionLevel: 9, quality: 80 })
          .toFile(tmpPath);
      } else {
        // JPEG/WebP — try quality 82 first, drop if still too big
        let quality = 82;
        let done = false;
        while (!done && quality >= 50) {
          await sharp(filePath)
            .resize({ width: 1920, withoutEnlargement: true })
            .jpeg({ quality, mozjpeg: true })
            .toFile(tmpPath);
          const tmpSize = await getFileSizeKB(tmpPath);
          if (tmpSize <= 300) {
            done = true;
          } else {
            quality -= 8;
          }
        }
      }

      const newSize = await getFileSizeKB(tmpPath);
      await rename(tmpPath, filePath);
      console.log(`  OK    ${file}: ${originalSize}KB → ${newSize}KB`);
      compressed++;
    } catch (err) {
      console.error(`  ERROR ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone: ${compressed} compressed, ${skipped} skipped (already ≤300KB)`);
}

(async () => {
  try {
    await compressLogo();
    await generateFavicons();
    await compressImages();
    console.log('\nAll optimizations complete.');
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
})();
