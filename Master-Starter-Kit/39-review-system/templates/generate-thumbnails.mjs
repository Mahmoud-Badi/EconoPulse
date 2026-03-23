#!/usr/bin/env node

/**
 * generate-thumbnails.mjs
 *
 * Generates screenshot thumbnails of all HTML design variations
 * using Playwright. Run this after creating/updating design files.
 *
 * Usage:
 *   node generate-thumbnails.mjs [--config path/to/config.json]
 *
 * Default config path: ./review-config.json
 * Output: ./thumbs/{style}_{screen}.png
 */

import { chromium } from 'playwright';
import { readFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// ── Configuration ────────────────────────────────────────────────

function loadConfig() {
  const configArg = process.argv.find((_, i, a) => a[i - 1] === '--config');
  const configPath = resolve(configArg || join(__dirname, 'review-config.json'));

  if (!existsSync(configPath)) {
    console.error(`Config not found: ${configPath}`);
    console.error('Create review-config.json or pass --config path/to/config.json');
    process.exit(1);
  }

  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function autoDetectStyles(designsPath) {
  const abs = resolve(designsPath);
  if (!existsSync(abs)) return [];

  return readdirSync(abs, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^style-\d+/.test(d.name))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map(d => ({
      key: d.name,
      label: d.name.replace(/^style-(\d+)/, 'Style $1')
    }));
}

// ── Thumbnail Generation ─────────────────────────────────────────

async function generateThumbnails() {
  const config = loadConfig();

  const designsPath = resolve(config.designsPath || 'designs/lookfeels/');
  const thumbsPath = resolve(config.thumbsPath || join(__dirname, 'thumbs'));
  const width = config.width || 1280;
  const height = config.height || 720;

  // Auto-detect styles if set to "auto" or not specified
  const styles = config.styles === 'auto' || !config.styles
    ? autoDetectStyles(designsPath)
    : config.styles;

  const screens = config.screens || [];

  if (styles.length === 0) {
    console.error('No styles found. Create style-01/, style-02/, etc. directories in:', designsPath);
    process.exit(1);
  }

  if (screens.length === 0) {
    console.error('No screens defined in config. Add screens array to review-config.json');
    process.exit(1);
  }

  // Ensure thumbs directory exists
  mkdirSync(thumbsPath, { recursive: true });

  console.log(`\nDesign Review — Thumbnail Generator`);
  console.log(`═══════════════════════════════════`);
  console.log(`Designs path: ${designsPath}`);
  console.log(`Output path:  ${thumbsPath}`);
  console.log(`Viewport:     ${width}x${height}`);
  console.log(`Styles:       ${styles.length} (${styles.map(s => s.key).join(', ')})`);
  console.log(`Screens:      ${screens.length} (${screens.map(s => s.key).join(', ')})`);
  console.log(`Total:        ${styles.length * screens.length} thumbnails\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1
  });

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const style of styles) {
    for (const screen of screens) {
      const htmlFile = join(designsPath, style.key, screen.file);
      const thumbFile = join(thumbsPath, `${style.key}_${screen.key}.png`);
      const label = `${style.label} / ${screen.label}`;

      if (!existsSync(htmlFile)) {
        console.log(`  SKIP  ${label} — file not found: ${htmlFile}`);
        skipped++;
        continue;
      }

      try {
        const page = await context.newPage();
        const fileUrl = `file://${resolve(htmlFile).replace(/\\/g, '/')}`;
        await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 15000 });

        // Wait for fonts and images to load
        await page.waitForTimeout(500);

        await page.screenshot({ path: thumbFile, type: 'png' });
        await page.close();

        console.log(`  OK    ${label} → ${basename(thumbFile)}`);
        generated++;
      } catch (err) {
        console.log(`  FAIL  ${label} — ${err.message}`);
        failed++;
      }
    }
  }

  await browser.close();

  console.log(`\n───────────────────────────────────`);
  console.log(`Generated: ${generated}  Skipped: ${skipped}  Failed: ${failed}`);
  console.log(`Thumbnails saved to: ${thumbsPath}\n`);

  if (failed > 0) process.exit(1);
}

generateThumbnails().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
