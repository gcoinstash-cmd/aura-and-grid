import fs from 'fs';
import path from 'path';

const BASE_DIR = process.cwd();
const DIST_DIR = path.join(BASE_DIR, 'dist');
const QUARANTINE_DIR = path.join(DIST_DIR, '_quarantine_duplicates');
const MANIFEST_PATH = path.join(BASE_DIR, 'CATALOG_MANIFEST.json');

console.log('================================================================================');
console.log(' 🧹 GHOST FACTORY™ REPOSITORY SANITATION & DUPLICATE QUARANTINE ENGINE');
console.log('================================================================================');

// 1. Create Quarantine Directory
fs.mkdirSync(QUARANTINE_DIR, { recursive: true });

// 2. Read Catalog Manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
console.log(`📋 Total Verified Catalog Products: ${manifest.products.length}`);

const quarantineReport = [];

// 3. Process Each Product
for (const p of manifest.products) {
  const slug = p.gumroad_url ? p.gumroad_url.split('/l/')[1] : null;
  if (!slug) continue;

  const canonicalName = slug;
  const canonicalPath = path.join(DIST_DIR, canonicalName);

  // Determine duplicate twin
  let duplicateName = null;
  if (slug.endsWith('-os')) {
    duplicateName = slug.replace(/-os$/, '');
  } else if (slug === 'stride-mb') {
    duplicateName = 'stride-manhattan-beach';
  }

  if (!duplicateName) continue;

  const duplicatePath = path.join(DIST_DIR, duplicateName);

  if (fs.existsSync(duplicatePath)) {
    // Ensure canonical directory exists
    if (!fs.existsSync(canonicalPath)) {
      fs.mkdirSync(canonicalPath, { recursive: true });
    }

    // Merge/Copy missing essential files from duplicate to canonical
    const dupFiles = fs.readdirSync(duplicatePath);
    for (const file of dupFiles) {
      const srcFile = path.join(duplicatePath, file);
      const destFile = path.join(canonicalPath, file);
      
      // If file does not exist in canonical, copy it
      if (!fs.existsSync(destFile)) {
        if (fs.statSync(srcFile).isFile()) {
          fs.copyFileSync(srcFile, destFile);
        }
      }
    }

    // Safely move duplicate to quarantine
    const targetQuarantine = path.join(QUARANTINE_DIR, duplicateName);
    if (fs.existsSync(targetQuarantine)) {
      // If already exists in quarantine, remove the old quarantine copy first
      fs.rmSync(targetQuarantine, { recursive: true, force: true });
    }
    fs.renameSync(duplicatePath, targetQuarantine);

    quarantineReport.push({
      canonical: canonicalName,
      quarantined: path.relative(BASE_DIR, targetQuarantine),
      status: '✅ QUARANTINED'
    });
  }
}

console.log(`📦 Quarantined ${quarantineReport.length} legacy duplicate folders into dist/_quarantine_duplicates/`);

// 4. File System Sanitation: Remove .DS_Store and crash logs
console.log('\n🧹 Sweeping stale logs, .DS_Store, and temporary files...');
let cleanedLogs = 0;
let cleanedDsStore = 0;

function sweepDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    if (entry === '.git' || entry === 'node_modules' || entry === '_quarantine_duplicates') continue;
    const fullPath = path.join(dirPath, entry);
    try {
      const stat = fs.lstatSync(fullPath);
      if (stat.isDirectory()) {
        sweepDirectory(fullPath);
      } else if (stat.isFile()) {
        // Remove .DS_Store
        if (entry === '.DS_Store') {
          fs.unlinkSync(fullPath);
          cleanedDsStore++;
        }
        // Remove crash logs
        else if (entry === 'npm-debug.log' || entry === 'yarn-error.log' || entry === 'yarn-debug.log' || entry.endsWith('.tmp')) {
          fs.unlinkSync(fullPath);
          cleanedLogs++;
        }
      }
    } catch (e) {
      // Ignore permission / locked file errors
    }
  }
}

sweepDirectory(BASE_DIR);
console.log(`   ├─ Removed ${cleanedDsStore} .DS_Store file(s)`);
console.log(`   └─ Removed ${cleanedLogs} stale log/temporary file(s)`);

// 5. Update .gitignore if needed
const gitignorePath = path.join(BASE_DIR, '.gitignore');
let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
const rulesToAdd = [
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  '*.tmp',
  'dist/_quarantine_duplicates/'
];

let updatedGitignore = false;
for (const rule of rulesToAdd) {
  if (!gitignoreContent.includes(rule)) {
    gitignoreContent += `\n${rule}`;
    updatedGitignore = true;
  }
}

if (updatedGitignore) {
  fs.writeFileSync(gitignorePath, gitignoreContent.trim() + '\n');
  console.log('✓ Updated .gitignore with log, tmp, and quarantine exclusions.');
}

// 6. Verification and Final Count
const remainingDistDirs = fs.readdirSync(DIST_DIR).filter(f => fs.statSync(path.join(DIST_DIR, f)).isDirectory());
const nonSpecialDirs = remainingDistDirs.filter(d => !['_quarantine_duplicates', 'gumroad_assets', 'vaults'].includes(d));

console.log('\n================================================================================');
console.log(' 📋 TRUTH-ENFORCER DUPLICATE CLEANUP VERIFICATION TABLE');
console.log('================================================================================');
console.log(
  '| Canonical Directory Kept'.padEnd(34) +
  '| Quarantined Folder Path'.padEnd(46) +
  '| Status'
);
console.log('-'.repeat(90));

for (const item of quarantineReport.slice(0, 15)) {
  console.log(
    `| ${item.canonical.padEnd(32)}` +
    `| ${item.quarantined.padEnd(44)}` +
    `| ${item.status}`
  );
}
if (quarantineReport.length > 15) {
  console.log(`| ... and ${quarantineReport.length - 15} more legacy twin folders safely quarantined.`.padEnd(89) + '|');
}

console.log('='.repeat(90));
console.log(`🎯 Exact Catalog Target Count: ${manifest.products.length} Operating Systems`);
console.log(`📁 Active Production Folders in dist/: ${nonSpecialDirs.length} Canonical Folders`);
console.log(`📦 Quarantined Legacy Folders: ${quarantineReport.length} in dist/_quarantine_duplicates/`);
console.log(`✨ Status: ${nonSpecialDirs.length === manifest.products.length ? '🟢 100% PERFECT 1:1 MATCH WITH CATALOG MANIFEST' : '⚠️ MISMATCH DETECTED'}\n`);
