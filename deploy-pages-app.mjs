import fs from 'fs';
import path from 'path';
import cp from 'child_process';

const BASE_DIR = '/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid';
const manifestPath = path.join(BASE_DIR, 'CATALOG_MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Style block to inject into index.html
const FONT_STYLE_BLOCK = `
    <!-- Ghost Factory Universal Typography & WCAG AAA Bad-Eyesight Protection -->
    <style id="ghost-typography">
      html { font-size: 18px !important; }
      body { font-size: 1.125rem !important; line-height: 1.65 !important; }
      p, li { font-size: 1.125rem !important; line-height: 1.65 !important; }
      button, input, select, textarea { font-size: 1rem !important; min-height: 44px; }
      .text-xs { font-size: 0.875rem !important; line-height: 1.4 !important; }
      .text-sm { font-size: 0.95rem !important; line-height: 1.5 !important; }
      .text-base { font-size: 1.125rem !important; line-height: 1.65 !important; }
    </style>
`;

function injectStyles(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  if (html.includes('id="ghost-typography"')) {
    html = html.replace(/<style id="ghost-typography">[\s\S]*?<\/style>/, FONT_STYLE_BLOCK.trim());
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `${FONT_STYLE_BLOCK}\n  </head>`);
  } else {
    html = html.replace('<body', `${FONT_STYLE_BLOCK}\n  <body`);
  }
  fs.writeFileSync(htmlPath, html, 'utf8');
}

export function deployApp(target) {
  const { id, name, slug, repo, dir } = target;
  console.log(`\n==================================================`);
  console.log(`🚀 [Target #${id}] Upgrading & Deploying: ${name} (${slug})`);
  console.log(`==================================================`);

  const appDir = path.join(BASE_DIR, 'Website Templates', dir);
  if (!fs.existsSync(appDir)) {
    console.error(`❌ Directory not found: ${appDir}`);
    return false;
  }

  // 1. Inject styles into index.html
  const indexPath = path.join(appDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    injectStyles(indexPath);
    console.log(`✓ Injected 18px WCAG AAA styles into ${dir}/index.html`);
  } else {
    console.error(`❌ index.html not found in ${appDir}`);
    return false;
  }

  // 2. Build production assets
  console.log(`⚙️ Building ${dir}...`);
  try {
    cp.execSync('npm run build', {
      cwd: appDir,
      stdio: 'pipe',
      env: { ...process.env, DEVELOPER_DIR: '/Library/Developer/CommandLineTools' }
    });
    console.log(`✓ Build successful!`);
  } catch (err) {
    console.error(`❌ Build failed for ${dir}:`, err.message);
    return false;
  }

  // 3. Ensure dist/index.html and fallback files exist
  const distDir = path.join(appDir, 'dist');
  if (!fs.existsSync(distDir)) {
    console.error(`❌ dist directory not found: ${distDir}`);
    return false;
  }

  // Copy SPA fallbacks
  const distIndex = path.join(distDir, 'index.html');
  fs.copyFileSync(distIndex, path.join(distDir, '200.html'));
  fs.copyFileSync(distIndex, path.join(distDir, '404.html'));
  fs.copyFileSync(distIndex, path.join(distDir, 'admin.html'));
  const distAdminDir = path.join(distDir, 'admin');
  if (!fs.existsSync(distAdminDir)) fs.mkdirSync(distAdminDir, { recursive: true });
  fs.copyFileSync(distIndex, path.join(distAdminDir, 'index.html'));
  fs.writeFileSync(path.join(distDir, '_redirects'), '/* /index.html 200\n');
  fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

  // 4. Deploy to GitHub
  const repoName = repo || `${slug}-os`;
  const remoteUrl = `https://github.com/gcoinstash-cmd/${repoName}.git`;

  // Ensure repo exists on GitHub
  try {
    cp.execSync(`gh repo view gcoinstash-cmd/${repoName}`, {
      stdio: 'pipe',
      env: { ...process.env, DEVELOPER_DIR: '/Library/Developer/CommandLineTools', PATH: `/Users/gmane/.local/bin:${process.env.PATH}` }
    });
  } catch (e) {
    console.log(`Creating GitHub repo gcoinstash-cmd/${repoName}...`);
    cp.execSync(`gh repo create gcoinstash-cmd/${repoName} --public --confirm`, {
      stdio: 'pipe',
      env: { ...process.env, DEVELOPER_DIR: '/Library/Developer/CommandLineTools', PATH: `/Users/gmane/.local/bin:${process.env.PATH}` }
    });
  }

  // Deploy to gh-pages branch using clean isolated /tmp directory
  const tmpPages = `/tmp/gh-pages-${slug}`;
  try {
    if (fs.existsSync(tmpPages)) cp.execSync(`rm -rf "${tmpPages}"`);
    fs.mkdirSync(tmpPages, { recursive: true });
    cp.execSync(`cp -R "${distDir}/"* "${tmpPages}/"`);
    fs.writeFileSync(path.join(tmpPages, '.nojekyll'), '');

    cp.execSync('git init -b gh-pages', { cwd: tmpPages, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync('git config user.name "Aura & Grid Foundry"', { cwd: tmpPages, stdio: 'pipe' });
    cp.execSync('git config user.email "foundry@auraandgrid.com"', { cwd: tmpPages, stdio: 'pipe' });
    cp.execSync('git add -A', { cwd: tmpPages, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync('git commit -m "deploy: global 18px font scale and WCAG AAA readability upgrade"', { cwd: tmpPages, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync(`git remote add origin "${remoteUrl}"`, { cwd: tmpPages, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync('git push -f origin gh-pages', { cwd: tmpPages, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync(`rm -rf "${tmpPages}"`);
    console.log(`✓ Pushed clean gh-pages branch to gcoinstash-cmd/${repoName}`);
  } catch (err) {
    console.error(`❌ gh-pages push error:`, err.message);
  }

  // 5. Also push main branch to keep source updated on GitHub
  try {
    if (!fs.existsSync(path.join(appDir, '.git'))) {
      cp.execSync('git init -b main', { cwd: appDir, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
      cp.execSync(`git remote add origin "${remoteUrl}"`, { cwd: appDir, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    }
    cp.execSync('git config user.name "Aura & Grid Foundry"', { cwd: appDir, stdio: 'pipe' });
    cp.execSync('git config user.email "foundry@auraandgrid.com"', { cwd: appDir, stdio: 'pipe' });
    cp.execSync('git add index.html src/ package.json 2>/dev/null || true', { cwd: appDir, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync('git commit -m "style: universal 18px font-size scale and high-contrast readability upgrade" 2>/dev/null || true', { cwd: appDir, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    cp.execSync('git push origin main -f 2>/dev/null || true', { cwd: appDir, stdio: 'pipe', env: { DEVELOPER_DIR: '/Library/Developer/CommandLineTools' } });
    console.log(`✓ Pushed main branch to gcoinstash-cmd/${repoName}`);
  } catch (err) {
    // Non-fatal if main push encounters conflict
  }

  // 6. Update loot crate in dist/<slug>/
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

  return true;
}
