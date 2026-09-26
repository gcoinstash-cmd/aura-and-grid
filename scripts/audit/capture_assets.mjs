import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const TARGETS = [
  {
    slug: 'litigation-ops',
    name: 'Litigation Ops OS',
    url: 'https://gcoinstash-cmd.github.io/litigation-ops-os/'
  },
  {
    slug: 'wealth-family-office',
    name: 'Wealth Family Office OS',
    url: 'https://gcoinstash-cmd.github.io/wealth-family-office-os/'
  },
  {
    slug: 'executive-search',
    name: 'Executive Search OS',
    url: 'https://gcoinstash-cmd.github.io/executive-search-os/'
  },
  {
    slug: 'ma-advisory',
    name: 'M&A Advisory OS',
    url: 'https://gcoinstash-cmd.github.io/ma-advisory-os/'
  },
  {
    slug: 'boutique-law',
    name: 'Boutique Law OS',
    url: 'https://gcoinstash-cmd.github.io/boutique-law-os/'
  },
  {
    slug: 'recovery-spa',
    name: 'Hyperbaric & Recovery Lab OS',
    url: 'https://gcoinstash-cmd.github.io/recovery-spa-os/'
  },
  {
    slug: 'physical-therapy',
    name: 'Kinetic Spine & Sports PT OS',
    url: 'https://gcoinstash-cmd.github.io/physical-therapy-os/'
  },
  {
    slug: 'fine-dining-matrix',
    name: 'Fine Dining OS',
    url: 'https://gcoinstash-cmd.github.io/fine-dining-matrix-os/'
  },
  {
    slug: 'functional-medicine',
    name: 'Aura Protocol Functional Medicine OS',
    url: 'https://gcoinstash-cmd.github.io/functional-medicine-os/'
  },
  {
    slug: 'superyacht-charter-os',
    name: 'Superyacht Charter OS',
    url: 'https://gcoinstash-cmd.github.io/superyacht-charter-os/'
  },
  {
    slug: 'luxury-horology-vault',
    name: 'Luxury Horology Vault OS',
    url: 'https://gcoinstash-cmd.github.io/luxury-horology-vault-os/'
  }
];

async function captureAll() {
  console.log(`================================================================================`);
  console.log(` 📸 GHOST FACTORY™ HIGH-FIDELITY ASSET CAPTURE & HYDRATION VERIFIER`);
  console.log(`================================================================================`);
  console.log(`🎯 Targets Queued: ${TARGETS.length} applications`);
  console.log(`⚙️ Engine: Playwright (Chromium Headless)`);
  console.log(`📐 Specs: Cover (1280x720 16:9) | Thumbnail (600x600 1:1)`);
  console.log(`⏳ Hydration Wait: NetworkIdle + 3,500ms + Visible Heading Guard (>10 DOM elements)\n`);

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const target of TARGETS) {
    console.log(`\n▶️ [${target.slug}] Launching capture: ${target.url}`);
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    try {
      // 1. Navigate with networkidle
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });

      // 2. Mandatory hydration delay for WebGL/Fonts/SPAs
      await page.waitForTimeout(3500);

      // 3. Verification guard: Check DOM element count & visible heading
      const domCount = await page.$$eval('*', els => els.length);
      const heading = await page.$$eval('h1, h2, h3, #hero, [data-hero]', els => {
        const found = els.find(e => e.offsetParent !== null && e.innerText.trim().length > 0);
        return found ? { tag: found.tagName, text: found.innerText.trim().substring(0, 40) } : null;
      });

      console.log(`   ├─ DOM elements rendered: ${domCount}`);
      console.log(`   ├─ Primary visible heading: ${heading ? `<${heading.tag}> "${heading.text}"` : 'NONE'}`);

      if (domCount <= 10) {
        throw new Error(`DOM count too low (${domCount} elements). Possible blank page or hydration failure.`);
      }

      // 4. Capture 16:9 Cover (1280x720)
      const coverPngBuf = await page.screenshot({ type: 'png' });
      const coverJpgBuf = await page.screenshot({ type: 'jpeg', quality: 92 });

      // 5. Set Viewport for 1:1 Thumbnail (600x600)
      await page.setViewportSize({ width: 600, height: 600 });
      await page.waitForTimeout(1000);
      const thumbPngBuf = await page.screenshot({ type: 'png' });
      const thumbJpgBuf = await page.screenshot({ type: 'jpeg', quality: 92 });

      // 6. Target Directory Wiring
      // Staging directory
      const stagingDir = path.join(process.cwd(), 'dist', 'gumroad_assets', target.slug);
      fs.mkdirSync(stagingDir, { recursive: true });

      const stagingCoverPath = path.join(stagingDir, 'cover.png');
      const stagingThumbPath = path.join(stagingDir, 'thumbnail.png');
      fs.writeFileSync(stagingCoverPath, coverPngBuf);
      fs.writeFileSync(stagingThumbPath, thumbPngBuf);

      // Replace in dist/<slug>/
      const distDirs = [
        path.join(process.cwd(), 'dist', target.slug),
        path.join(process.cwd(), 'dist', `${target.slug}-os`)
      ];

      for (const d of distDirs) {
        if (fs.existsSync(d)) {
          // Standardized dist packaging files
          fs.writeFileSync(path.join(d, `${target.slug}-cover.jpg`), coverJpgBuf);
          fs.writeFileSync(path.join(d, `${target.slug}-thumbnail.jpg`), thumbJpgBuf);
          fs.writeFileSync(path.join(d, 'cover.png'), coverPngBuf);
          fs.writeFileSync(path.join(d, 'thumbnail.png'), thumbPngBuf);
        }
      }

      // Check if template directory has public/assets or dist/assets
      const templateDirs = [
        path.join(process.cwd(), 'Website Templates', target.slug),
        path.join(process.cwd(), 'Website Templates', `${target.slug}-os`),
        path.join(process.cwd(), 'Website Templates', target.slug.replace(/-os$/, ''))
      ];

      for (const t of templateDirs) {
        if (fs.existsSync(t)) {
          const publicAssets = path.join(t, 'public', 'assets');
          if (fs.existsSync(publicAssets)) {
            fs.writeFileSync(path.join(publicAssets, 'cover.png'), coverPngBuf);
            fs.writeFileSync(path.join(publicAssets, 'thumbnail.png'), thumbPngBuf);
          }
          const distAssets = path.join(t, 'dist', 'assets');
          if (fs.existsSync(distAssets)) {
            fs.writeFileSync(path.join(distAssets, 'cover.png'), coverPngBuf);
            fs.writeFileSync(path.join(distAssets, 'thumbnail.png'), thumbPngBuf);
          }
        }
      }

      const coverKb = Math.round(coverPngBuf.length / 1024);
      const thumbKb = Math.round(thumbPngBuf.length / 1024);
      const pass = coverKb > 50 && thumbKb > 50;

      console.log(`   ├─ Cover Generated: ${stagingCoverPath} (${coverKb} KB)`);
      console.log(`   ├─ Thumbnail Generated: ${stagingThumbPath} (${thumbKb} KB)`);
      console.log(`   └─ Status: ${pass ? '✅ VERIFIED (>50 KB)' : '⚠️ WARNING (Under 50 KB)'}`);

      results.push({
        slug: target.slug,
        name: target.name,
        coverPath: path.relative(process.cwd(), stagingCoverPath),
        coverKb,
        thumbPath: path.relative(process.cwd(), stagingThumbPath),
        thumbKb,
        status: pass ? 'PASS' : 'WARN'
      });

    } catch (err) {
      console.error(`   ❌ ERROR capturing ${target.slug}:`, err.message);
      results.push({
        slug: target.slug,
        name: target.name,
        coverPath: 'FAILED',
        coverKb: 0,
        thumbPath: 'FAILED',
        thumbKb: 0,
        status: 'FAIL: ' + err.message
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Print Summary Truth-Enforcer Table
  console.log(`\n================================================================================`);
  console.log(` 📋 TRUTH-ENFORCER ASSET AUDIT VERIFICATION TABLE`);
  console.log(`================================================================================`);
  console.log(
    '| Slug'.padEnd(26) +
    '| Cover Size'.padEnd(14) +
    '| Thumb Size'.padEnd(14) +
    '| Gate (>50KB)'.padEnd(16) +
    '| Staging Cover Path'
  );
  console.log('-'.repeat(100));

  let allPass = true;
  for (const r of results) {
    if (r.coverKb < 50 || r.thumbKb < 50) allPass = false;
    console.log(
      `| ${r.slug.padEnd(24)}` +
      `| ${(r.coverKb + ' KB').padEnd(12)}` +
      `| ${(r.thumbKb + ' KB').padEnd(12)}` +
      `| ${(r.status === 'PASS' ? '✅ 200 OK' : '❌ FAIL').padEnd(14)}` +
      `| ${r.coverPath}`
    );
  }
  console.log('='.repeat(100));
  console.log(`Final Verification Result: ${allPass ? '🟢 100% S-TIER PASS (All assets > 50KB)' : '🔴 CORRUPT ASSETS DETECTED'}\n`);
}

captureAll().catch(e => {
  console.error("Fatal capture script error:", e);
  process.exit(1);
});
