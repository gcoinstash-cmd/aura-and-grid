#!/usr/bin/env node
/**
 * Ghost Factory™ — Thumbnail Fixer + Gumroad Asset Copier
 * 
 * 1. Generates proper 600x600 thumbnails for all 11 flagged assets
 *    (cropping from existing covers)
 * 2. Copies cover + thumbnail to assets/gumroad_storefront_assets/<id>_<slug>/
 *    as cover_1920x1080.jpg and thumbnail_1080x1080.jpg (for Gumroad upload)
 * 3. Copies covers to Website Templates/<slug>/public/assets/ for showroom
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ASSETS = [
  { id: '05', slug: 'elevate-capital', distSlug: 'elevate-capital-os', coverFile: 'elevate-capital-cover.jpg', thumbFile: 'elevate-capital-thumbnail.jpg' },
  { id: '08', slug: 'aura-medspa', distSlug: 'aura-medspa-os', coverFile: 'aura-medspa-cover.jpg', thumbFile: 'aura-medspa-thumbnail.jpg' },
  { id: '12', slug: 'kinetic-lab', distSlug: 'kinetic-lab-os', coverFile: 'kinetic-lab-cover.jpg', thumbFile: 'kinetic-lab-thumbnail.jpg' },
  { id: '25', slug: 'afrodigital-motion', distSlug: 'afrodigital-motion-os', coverFile: 'afrodigital-motion-cover.jpg', thumbFile: 'afrodigital-motion-thumbnail.jpg' },
  { id: '30', slug: 'family-legacy-wealth', distSlug: 'family-legacy-wealth-os', coverFile: 'family-legacy-wealth-cover.jpg', thumbFile: 'family-legacy-wealth-thumbnail.jpg' },
  { id: '33', slug: 'commercial-finance', distSlug: 'commercial-finance-os', coverFile: 'commercial-finance-cover.jpg', thumbFile: 'commercial-finance-thumbnail.jpg' },
  { id: '45', slug: 'resonance-culinary', distSlug: 'resonance-culinary-os', coverFile: 'resonance-culinary-cover.jpg', thumbFile: 'resonance-culinary-thumbnail.jpg' },
  { id: '62', slug: 'veterinary-hospital', distSlug: 'veterinary-hospital-os', coverFile: 'veterinary-hospital-cover.jpg', thumbFile: 'veterinary-hospital-thumbnail.jpg' },
  { id: '81', slug: 'fine-dining-matrix', distSlug: 'fine-dining-matrix-os', coverFile: 'fine-dining-matrix-cover.jpg', thumbFile: 'fine-dining-matrix-thumbnail.jpg' },
  { id: '83', slug: 'superyacht-charter', distSlug: 'superyacht-charter-os', coverFile: 'superyacht-charter-os-cover.jpg', thumbFile: 'superyacht-charter-os-thumbnail.jpg' },
  { id: '84', slug: 'luxury-horology-vault', distSlug: 'luxury-horology-vault-os', coverFile: 'luxury-horology-vault-cover.jpg', thumbFile: 'luxury-horology-vault-thumbnail.jpg' },
];

// Generate a proper 600x600 thumbnail by rendering cover HTML at 600x600
// using scale transform
async function generateThumbFromCover(browser, coverPath, thumbPath) {
  // Read image as data URL
  const imgData = fs.readFileSync(coverPath);
  const b64 = imgData.toString('base64');
  const mimeType = coverPath.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  
  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 600px; height: 600px; overflow: hidden; background: #080A0C; }
  .wrapper {
    width: 600px; height: 600px;
    overflow: hidden; position: relative;
  }
  img {
    /* Cover is 1280x720. We want to crop center.
       At 600px wide: scale = 600/1280 = 0.469, making img 600x338.
       Since 338 < 600, we letterbox. Instead, fit to height:
       scale = 600/720 = 0.833, making img 1067x600. Crop center. */
    width: 1067px; height: 600px;
    margin-left: -233px; /* Center crop: (1067-600)/2 = 233 */
    display: block;
    object-fit: cover;
  }
</style>
</head>
<body>
<div class="wrapper">
  <img src="data:${mimeType};base64,${b64}" alt="" />
</div>
</body>
</html>`;
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 600, height: 600 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: thumbPath, type: 'jpeg', quality: 90, fullPage: false });
  await page.close();
}

async function main() {
  console.log('🏭 GHOST FACTORY™ — Thumbnail Fixer + Gumroad Asset Copier');
  console.log('==============================================================\n');
  
  const browser = await chromium.launch({ headless: true });
  
  for (const asset of ASSETS) {
    const distDir = path.join(ROOT, 'dist', asset.distSlug);
    const coverSrc = path.join(distDir, asset.coverFile);
    const thumbDst = path.join(distDir, asset.thumbFile);
    
    if (!fs.existsSync(coverSrc)) {
      console.log(`  ❌ MISSING COVER: ${coverSrc}`);
      continue;
    }
    
    console.log(`🎮 Processing: ${asset.slug} (ID: ${asset.id})`);
    
    // Step 1: Regenerate thumbnail from cover
    try {
      await generateThumbFromCover(browser, coverSrc, thumbDst);
      const thumbKB = Math.round(fs.statSync(thumbDst).size / 1024);
      console.log(`  ✅ Thumbnail regenerated: ${asset.thumbFile} (${thumbKB}KB)`);
    } catch (err) {
      console.log(`  ❌ Thumbnail failed: ${err.message}`);
    }
    
    // Step 2: Copy to gumroad_storefront_assets
    const gumroadDir = path.join(ROOT, 'assets', 'gumroad_storefront_assets', `${asset.id}_${asset.slug}`);
    const gumCoverDst = path.join(gumroadDir, 'cover_1920x1080.jpg');
    const gumThumbDst = path.join(gumroadDir, 'thumbnail_1080x1080.jpg');
    
    fs.copyFileSync(coverSrc, gumCoverDst);
    if (fs.existsSync(thumbDst)) fs.copyFileSync(thumbDst, gumThumbDst);
    
    const gumCoverKB = Math.round(fs.statSync(gumCoverDst).size / 1024);
    const gumThumbKB = fs.existsSync(gumThumbDst) ? Math.round(fs.statSync(gumThumbDst).size / 1024) : 0;
    console.log(`  ✅ Gumroad: cover_1920x1080.jpg (${gumCoverKB}KB) + thumbnail_1080x1080.jpg (${gumThumbKB}KB)`);
    
    // Step 3: Copy to Website Templates public/assets
    const templateDirs = [
      path.join(ROOT, 'Website Templates', `${asset.slug}-os`, 'public', 'assets'),
      path.join(ROOT, 'Website Templates', asset.slug, 'public', 'assets'),
    ];
    
    let copied = false;
    for (const tDir of templateDirs) {
      const parentExists = fs.existsSync(path.dirname(tDir));
      if (parentExists) {
        fs.mkdirSync(tDir, { recursive: true });
        fs.copyFileSync(coverSrc, path.join(tDir, 'cover.webp'));
        fs.copyFileSync(coverSrc, path.join(tDir, 'cover.jpg'));
        if (fs.existsSync(thumbDst)) {
          fs.copyFileSync(thumbDst, path.join(tDir, 'thumb.webp'));
          fs.copyFileSync(thumbDst, path.join(tDir, 'thumb.jpg'));
        }
        console.log(`  ✅ Showroom: ${path.relative(ROOT, tDir)}/cover.jpg + thumb.jpg`);
        copied = true;
        break;
      }
    }
    if (!copied) {
      console.log(`  ⚠️  Template dir not found — showroom copy skipped`);
    }
    console.log('');
  }
  
  await browser.close();
  
  // Final verification
  console.log('\n📦 FINAL VERIFICATION — GUMROAD ASSET FOLDER:');
  const gumroadRoot = path.join(ROOT, 'assets', 'gumroad_storefront_assets');
  let totalFiles = 0;
  const dirs = fs.readdirSync(gumroadRoot).sort();
  for (const dir of dirs) {
    const dirPath = path.join(gumroadRoot, dir);
    const files = fs.readdirSync(dirPath);
    const coverFile = files.find(f => f.includes('cover'));
    const thumbFile = files.find(f => f.includes('thumbnail'));
    const coverKB = coverFile ? Math.round(fs.statSync(path.join(dirPath, coverFile)).size / 1024) : 0;
    const thumbKB = thumbFile ? Math.round(fs.statSync(path.join(dirPath, thumbFile)).size / 1024) : 0;
    const status = (coverFile && thumbFile) ? '✅' : '❌';
    console.log(`  ${status} ${dir}: cover=${coverKB}KB thumb=${thumbKB}KB`);
    totalFiles += files.length;
  }
  console.log(`\n📊 TOTAL FILES: ${totalFiles} (expected: 22)`);
}

main().catch(console.error);
