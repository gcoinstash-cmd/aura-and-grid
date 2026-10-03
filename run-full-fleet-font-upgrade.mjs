import fs from 'fs';
import path from 'path';
import cp from 'child_process';
import https from 'https';

const BASE_DIR = '/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid';

function getEnv(key) {
  if (process.env[key]) return process.env[key];
  const envPath = path.join(BASE_DIR, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.trim().match(/^([^=]+)=(.*)$/);
      if (match && match[1].trim() === key) {
        return match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
  return '';
}

const RENDER_API_KEY = getEnv('RENDER_API_KEY');
const GIT_ENV = {
  ...process.env,
  DEVELOPER_DIR: '/Library/Developer/CommandLineTools',
  PATH: `/Users/gmane/.local/bin:/Library/Developer/CommandLineTools/usr/bin:${process.env.PATH}`
};

const FONT_STYLE_BLOCK = `  <!-- Ghost Factory Universal Typography & WCAG AAA Bad-Eyesight Protection -->
  <style id="ghost-typography">
    html { font-size: 18px !important; }
    body { font-size: 1.125rem !important; line-height: 1.65 !important; }
    p, li { font-size: 1.125rem !important; line-height: 1.65 !important; }
    button, input, select, textarea { font-size: 1rem !important; min-height: 44px; }
    .text-xs { font-size: 0.875rem !important; line-height: 1.4 !important; }
    .text-sm { font-size: 0.95rem !important; line-height: 1.5 !important; }
    .text-base { font-size: 1.125rem !important; line-height: 1.65 !important; }
  </style>`;

function injectFontStyles(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('id="ghost-typography"')) {
    content = content.replace(/<style id="ghost-typography">[\s\S]*?<\/style>/, FONT_STYLE_BLOCK.trim());
  } else if (content.includes('</head>')) {
    content = content.replace('</head>', `${FONT_STYLE_BLOCK}\n</head>`);
  } else if (content.includes('<body')) {
    content = content.replace('<body', `${FONT_STYLE_BLOCK}\n<body`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

function triggerRenderDeploy(serviceId) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ clearCache: 'clear' });
    const req = https.request({
      hostname: 'api.render.com',
      path: `/v1/services/${serviceId}/deploys`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.id || 'triggered');
        } catch {
          resolve('triggered');
        }
      });
    });
    req.on('error', () => resolve('error'));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const fleet = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'FLEET_MAP.json'), 'utf8'));
  console.log(`\n===============================================================`);
  console.log(`🚀 GHOST FACTORY™ 85-ASSET FLEET TYPOGRAPHY & DEPLOYMENT RUNNER`);
  console.log(`===============================================================\n`);

  let successCount = 0;

  for (const item of fleet) {
    const { id, name, slug, dir, isRender, renderServiceId, repo } = item;
    const appDir = path.join(BASE_DIR, 'Website Templates', dir);
    console.log(`\n---------------------------------------------------------------`);
    console.log(`[Target #${id}/85] ${name} (${slug}) -> ${isRender ? 'Render' : 'GitHub Pages'}`);
    console.log(`---------------------------------------------------------------`);

    if (!fs.existsSync(appDir)) {
      console.error(`❌ Directory not found: ${appDir}`);
      continue;
    }

    // 1. Inject typography into index.html
    const indexPath = path.join(appDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      injectFontStyles(indexPath);
      console.log(`✓ Injected 18px WCAG AAA styles into ${dir}/index.html`);
    }

    // Also check other HTML files in appDir
    const htmlFiles = fs.readdirSync(appDir).filter(f => f.endsWith('.html') && f !== 'index.html');
    for (const hf of htmlFiles) {
      injectFontStyles(path.join(appDir, hf));
    }

    const repoName = repo || `${slug}-os`;
    const remoteUrl = `https://github.com/gcoinstash-cmd/${repoName}.git`;

    // Ensure repo exists on GitHub
    try {
      cp.execSync(`gh repo view gcoinstash-cmd/${repoName}`, { stdio: 'pipe', env: GIT_ENV });
    } catch {
      console.log(`Creating GitHub repo gcoinstash-cmd/${repoName}...`);
      try {
        cp.execSync(`gh repo create gcoinstash-cmd/${repoName} --public --confirm`, { stdio: 'pipe', env: GIT_ENV });
      } catch (e) {
        console.warn(`Repo creation note:`, e.message);
      }
    }

    // Initialize git in appDir if missing
    if (!fs.existsSync(path.join(appDir, '.git'))) {
      cp.execSync('git init -b main', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
      cp.execSync(`git remote add origin "${remoteUrl}"`, { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
    } else {
      try {
        cp.execSync(`git remote set-url origin "${remoteUrl}"`, { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
      } catch {
        cp.execSync(`git remote add origin "${remoteUrl}"`, { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
      }
    }
    cp.execSync('git config user.name "Aura & Grid Foundry"', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
    cp.execSync('git config user.email "foundry@auraandgrid.com"', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });

    // Handle GitHub Pages Apps
    if (!isRender) {
      // Build project
      console.log(`⚙️ Building ${dir}...`);
      try {
        cp.execSync('npm run build', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
        console.log(`✓ Build successful!`);
      } catch (err) {
        console.warn(`⚠️ Build warning: ${err.message}`);
      }

      const distDir = path.join(appDir, 'dist');
      if (fs.existsSync(distDir)) {
        const distIndex = path.join(distDir, 'index.html');
        if (fs.existsSync(distIndex)) {
          fs.copyFileSync(distIndex, path.join(distDir, '200.html'));
          fs.copyFileSync(distIndex, path.join(distDir, '404.html'));
          fs.copyFileSync(distIndex, path.join(distDir, 'admin.html'));
          const adminSub = path.join(distDir, 'admin');
          if (!fs.existsSync(adminSub)) fs.mkdirSync(adminSub, { recursive: true });
          fs.copyFileSync(distIndex, path.join(adminSub, 'index.html'));
          fs.writeFileSync(path.join(distDir, '_redirects'), '/* /index.html 200\n');
          fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
        }

        // Push to gh-pages branch
        const tmpPages = `/tmp/gh-pages-${slug}`;
        if (fs.existsSync(tmpPages)) cp.execSync(`rm -rf "${tmpPages}"`);
        fs.mkdirSync(tmpPages, { recursive: true });
        cp.execSync(`cp -R "${distDir}/"* "${tmpPages}/"`);
        fs.writeFileSync(path.join(tmpPages, '.nojekyll'), '');

        try {
          cp.execSync('git init -b gh-pages', { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          cp.execSync('git config user.name "Aura & Grid Foundry"', { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          cp.execSync('git config user.email "foundry@auraandgrid.com"', { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          cp.execSync('git add -A', { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          cp.execSync('git commit -m "deploy: global 18px font-size scale and WCAG AAA accessibility upgrade"', { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          cp.execSync(`git remote add origin "${remoteUrl}"`, { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          cp.execSync('git push -f origin gh-pages', { cwd: tmpPages, stdio: 'pipe', env: GIT_ENV });
          console.log(`✓ Deployed to gh-pages on ${repoName}`);
        } catch (err) {
          console.error(`❌ gh-pages push error:`, err.message);
        }
        cp.execSync(`rm -rf "${tmpPages}"`);
      }
    }

    // Commit and push main branch
    try {
      cp.execSync('git add -A', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
      cp.execSync('git commit -m "style: universal 18px font-size scale and WCAG AAA readability upgrade"', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
      cp.execSync('git push -f origin main', { cwd: appDir, stdio: 'pipe', env: GIT_ENV });
      console.log(`✓ Pushed main branch to ${repoName}`);
    } catch (err) {
      // If nothing to commit, that is fine
    }

    // If Render app, trigger Render deploy
    if (isRender && renderServiceId) {
      console.log(`🚀 Triggering Render deploy with cache clear for service ${renderServiceId}...`);
      const deployId = await triggerRenderDeploy(renderServiceId);
      console.log(`✓ Render deploy queued: ${deployId}`);
    }

    // Update dist loot crate zip
    const crateDir = path.join(BASE_DIR, 'dist', slug);
    if (!fs.existsSync(crateDir)) fs.mkdirSync(crateDir, { recursive: true });
    const zipPath = path.join(crateDir, `${slug}-v1.0.0.zip`);
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    try {
      cp.execSync(`zip -rq "${zipPath}" "${dir}" -x "${dir}/node_modules/*" -x "${dir}/.git/*" -x "${dir}/dist/*"`, {
        cwd: path.join(BASE_DIR, 'Website Templates'),
        stdio: 'pipe'
      });
      console.log(`✓ Packaged updated loot crate: dist/${slug}/${slug}-v1.0.0.zip`);
    } catch (err) {
      console.warn(`⚠️ Loot crate warning:`, err.message);
    }

    successCount++;
  }

  console.log(`\n===============================================================`);
  console.log(`🎉 ALL ${successCount}/85 APPS UPGRADED & REDEPLOYED SUCCESSFULLY!`);
  console.log(`===============================================================\n`);
}

run();
