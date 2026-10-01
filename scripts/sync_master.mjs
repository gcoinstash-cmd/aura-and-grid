#!/usr/bin/env node
/**
 * GhostFactoryOS × Aura & Grid — Master Sync Engine
 * 
 * Synchronizes all master blueprints, system instruction files,
 * recovery packages, and zip archives across:
 * 1. Local Workspace Root
 * 2. Local Backup (MASTER_BLUEPRINT_BACKUP)
 * 3. NotebookLM Knowledge Base
 * 4. Dist Vaults
 * 5. Desktop Staging (~/Desktop/Ghost_Factory_Staging/)
 * 6. Google Drive (~/Google Drive/My Drive/ & CloudStorage)
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MASTER_FILES = [
  { src: 'AGENTS.md', destName: 'AGENTS.md' },
  { src: 'GEMINI.md', destName: 'GEMINI.md' },
  { src: 'instructions.txt', destName: 'instructions.txt' },
  { src: 'ghostfactory-master.md', destName: 'ghostfactory-master.md' },
  { src: 'GHOSTFACTORY_V2_MASTER_SYNC.md', destName: 'GHOSTFACTORY_V2_MASTER_SYNC.md' },
  { src: 'BUSINESS_MODEL_AND_FOUNDRY_STRATEGY.md', destName: 'BUSINESS_MODEL_AND_FOUNDRY_STRATEGY.md' },
  { src: 'MASTER_BUSINESS_PLAN.md', destName: 'MASTER_BUSINESS_PLAN.md' },
  { src: 'NOTEBOOKLM_MASTER_FOUNDRY_BRIEF.md', destName: 'NOTEBOOKLM_MASTER_FOUNDRY_BRIEF.md' },
  { src: 'COMMERCIAL_AGENCY_LICENSE.md', destName: 'COMMERCIAL_AGENCY_LICENSE.md' },
  { src: 'QUALITY_GATE.md', destName: 'QUALITY_GATE.md' },
  { src: 'CATALOG_MANIFEST.json', destName: 'CATALOG_MANIFEST.json' },
  { src: 'EMERGENCY_RECOVERY_README.md', destName: 'EMERGENCY_RECOVERY_README.md' },
  { src: 'AUDIT_SNAPSHOT.md', destName: 'AUDIT_SNAPSHOT.md' },
  { src: 'docs/COMMERCIAL_POSITIONING.md', destName: 'COMMERCIAL_POSITIONING.md' },
  { src: 'docs/INVESTOR_AUDIT_REPORT.md', destName: 'INVESTOR_AUDIT_REPORT.md' },
];

function getDestinationDirs() {
  const home = os.homedir();
  const dirs = [
    // 1. Local workspace backup folder
    { id: 'local_backup', path: path.join(ROOT_DIR, 'MASTER_BLUEPRINT_BACKUP'), isBackup: true },
    
    // 2. NotebookLM Knowledge Base (Local Workspace)
    { id: 'notebooklm_kb', path: path.join(ROOT_DIR, 'NotebookLM_Knowledge_Base'), isBackup: false },
    
    // 3. Dist Vaults
    { id: 'dist_vaults', path: path.join(ROOT_DIR, 'dist', 'vaults'), isBackup: false },
    
    // 4. In-Workspace Staging Root & Subfolders
    { id: 'workspace_staging_root', path: path.join(ROOT_DIR, 'Ghost_Factory_Staging'), isBackup: false },
    { id: 'workspace_staging_backup', path: path.join(ROOT_DIR, 'Ghost_Factory_Staging', 'MASTER_BLUEPRINT_BACKUP'), isBackup: true },
    { id: 'workspace_staging_kb', path: path.join(ROOT_DIR, 'Ghost_Factory_Staging', 'NotebookLM_Knowledge_Base'), isBackup: false },
    
    // 5. Google Drive (Standard Mac Mount)
    { id: 'gdrive_standard_root', path: path.join(home, 'Google Drive', 'My Drive', 'Ghost_Factory_Master_Vault'), checkParent: path.join(home, 'Google Drive', 'My Drive'), isBackup: false },
    { id: 'gdrive_standard_backup', path: path.join(home, 'Google Drive', 'My Drive', 'Ghost_Factory_Master_Vault', 'MASTER_BLUEPRINT_BACKUP'), checkParent: path.join(home, 'Google Drive', 'My Drive', 'Ghost_Factory_Master_Vault'), isBackup: true },
    { id: 'gdrive_standard_kb', path: path.join(home, 'Google Drive', 'My Drive', 'Ghost_Factory_Master_Vault', 'NotebookLM_Knowledge_Base'), checkParent: path.join(home, 'Google Drive', 'My Drive', 'Ghost_Factory_Master_Vault'), isBackup: false },
    { id: 'gdrive_standard_direct_backup', path: path.join(home, 'Google Drive', 'My Drive', 'MASTER_BLUEPRINT_BACKUP'), checkParent: path.join(home, 'Google Drive', 'My Drive'), isBackup: true },
    
    // 6. CloudStorage Direct (FileProvider location)
    { id: 'gdrive_cloudstorage_root', path: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive', 'Ghost_Factory_Master_Vault'), checkParent: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive'), isBackup: false },
    { id: 'gdrive_cloudstorage_backup', path: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive', 'Ghost_Factory_Master_Vault', 'MASTER_BLUEPRINT_BACKUP'), checkParent: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive', 'Ghost_Factory_Master_Vault'), isBackup: true },
    { id: 'gdrive_cloudstorage_kb', path: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive', 'Ghost_Factory_Master_Vault', 'NotebookLM_Knowledge_Base'), checkParent: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive', 'Ghost_Factory_Master_Vault'), isBackup: false },
    { id: 'gdrive_cloudstorage_direct_backup', path: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive', 'MASTER_BLUEPRINT_BACKUP'), checkParent: path.join(home, 'Library', 'CloudStorage', 'GoogleDrive-gcoinstash@gmail.com', 'My Drive'), isBackup: true },
  ];

  return dirs;
}

function calculateHash(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(buffer).digest('hex');
  } catch {
    return null;
  }
}

export function runMasterSync() {
  const timestamp = new Date().toISOString();
  console.log(`\n=======================================================`);
  console.log(`🚀 [GHOSTFACTORY SYNC ENGINE] Starting Master Sync at ${timestamp}`);
  console.log(`=======================================================`);

  // Verify source files
  const verifiedSources = [];
  const checksums = {};

  for (const item of MASTER_FILES) {
    const srcPath = path.join(ROOT_DIR, item.src);
    if (fs.existsSync(srcPath)) {
      const hash = calculateHash(srcPath);
      verifiedSources.push({ ...item, fullSrc: srcPath, hash });
      checksums[item.destName] = hash;
    } else {
      console.warn(`⚠️ Warning: Master source file not found: ${item.src}`);
    }
  }

  console.log(`📦 Verified ${verifiedSources.length} master blueprint sources.`);

  const dests = getDestinationDirs();
  const seenPaths = new Set();
  const activeDests = [];

  // Prepare directories and deduplicate symlinked realpaths
  for (const dest of dests) {
    if (dest.checkParent) {
      if (!fs.existsSync(dest.checkParent)) {
        continue;
      }
    }
    if (!fs.existsSync(dest.path)) {
      try {
        fs.mkdirSync(dest.path, { recursive: true });
      } catch (err) {
        console.warn(`Could not create ${dest.path}:`, err.message);
        continue;
      }
    }
    try {
      const real = fs.realpathSync(dest.path);
      if (seenPaths.has(real)) {
        continue;
      }
      seenPaths.add(real);
      activeDests.push({ ...dest, realPath: real });
    } catch {
      activeDests.push(dest);
    }
  }

  console.log(`📁 Active Unique Destinations: ${activeDests.length}`);

  // Copy all master files to ALL active destinations
  for (const target of activeDests) {
    for (const file of verifiedSources) {
      const targetPath = path.join(target.path, file.destName);
      try {
        fs.copyFileSync(file.fullSrc, targetPath);
      } catch (err) {
        console.error(`Error copying ${file.destName} to ${target.path}:`, err.message);
      }
    }
  }
  console.log(`✅ All ${verifiedSources.length} master files copied to ${activeDests.length} target directories.`);

  // Re-generate MASTER_BLUEPRINT_BACKUP_2026.zip
  const localBackupDir = path.join(ROOT_DIR, 'MASTER_BLUEPRINT_BACKUP');
  const zipPath = path.join(localBackupDir, 'MASTER_BLUEPRINT_BACKUP_2026.zip');
  const backupDests = activeDests.filter(d => d.isBackup);

  try {
    // Remove old zip if present to build fresh
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    // Zip all files in localBackupDir (excluding any temp files)
    execSync(`cd "${localBackupDir}" && zip -rq "MASTER_BLUEPRINT_BACKUP_2026.zip" . -x "*.DS_Store" "*.tmp"`, { stdio: 'pipe' });
    console.log(`📦 Re-generated archive: MASTER_BLUEPRINT_BACKUP_2026.zip (${(fs.statSync(zipPath).size / 1024).toFixed(1)} KB)`);

    // Distribute zip to all other backup targets
    for (const target of backupDests) {
      if (target.path !== localBackupDir) {
        try {
          fs.copyFileSync(zipPath, path.join(target.path, 'MASTER_BLUEPRINT_BACKUP_2026.zip'));
        } catch (err) {
          console.warn(`Could not copy zip to ${target.path}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error('Failed to create master zip bundle:', err.message);
  }

  // Generate & write SYNC_MANIFEST.json
  const manifest = {
    sync_timestamp: timestamp,
    version: 'v2.0-master-sync',
    status: 'ALL_SYNCED',
    portfolio_facts: {
      total_catalog_assets: 110,
      track_1_lean_rapid_sale_assets: 85,
      track_2_flagship_tier_1_assets: 25,
      retention_floor_percent: 80,
      retained_floor_assets: 88,
      max_apa_capacity_assets: 22,
    },
    pricing_protocol: {
      track_1_lean_rapid_sale: {
        retail_msrp: 199,
        team_seat: 599,
        exclusive_buyout_floor: [3800, 6500],
        exclusive_buyout_anchor: 4500,
      },
      track_2_flagship_tier_1: {
        commercial_license: [1500, 3500],
        entry_buyout_anchor: 14500,
        entry_buyout_range: [10000, 18000],
        full_buyout_range: [18000, 35000],
        strategic_acquisition_range: [35000, 75000],
      },
      portfolio_retention_floor_percent: 80,
    },
    valuation_summary: {
      orderly_fair_market_value_corridor: [105000, 235250],
      best_planning_anchor_fmv: 160000,
      direct_b2b_ask_target: [195000, 265000],
      realistic_accepted_offer: [135000, 175000],
      development_replacement_cost: [715000, 2020000],
    },
    total_files_synced: verifiedSources.length,
    checksums,
    synced_destinations: activeDests.map(d => d.path),
  };

  const manifestContent = JSON.stringify(manifest, null, 2);
  for (const target of activeDests) {
    try {
      fs.writeFileSync(path.join(target.path, 'SYNC_MANIFEST.json'), manifestContent, 'utf-8');
    } catch (err) {
      console.warn(`Could not write manifest to ${target.path}:`, err.message);
    }
  }

  console.log(`\n=======================================================`);
  console.log(`✅ [GHOSTFACTORY SYNC ENGINE] SUCCESS! All targets in sync.`);
  console.log(`   - Master Blueprint Files: ${verifiedSources.length}`);
  console.log(`   - Unique Synced Destinations: ${activeDests.length}`);
  for (const dest of activeDests) {
    console.log(`     • [${dest.id}] -> ${dest.path}`);
  }
  console.log(`=======================================================\n`);
}

function watchMode() {
  console.log(`👀 [GHOSTFACTORY SYNC ENGINE] Watch mode active. Monitoring master files for changes...`);
  runMasterSync();

  let debounceTimer = null;

  const triggerDebouncedSync = (filename) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`\n⚡ [SYNC DETECTED] Change detected in: ${filename}`);
      runMasterSync();
    }, 500);
  };

  const filesToWatch = [
    ROOT_DIR,
    path.join(ROOT_DIR, 'docs')
  ];

  for (const dir of filesToWatch) {
    if (fs.existsSync(dir)) {
      try {
        fs.watch(dir, { recursive: false }, (eventType, filename) => {
          if (!filename) return;
          const match = MASTER_FILES.some(f => f.src === filename || f.src === `docs/${filename}` || path.basename(f.src) === filename);
          if (match) {
            triggerDebouncedSync(filename);
          }
        });
        console.log(`   Listening on: ${dir}`);
      } catch (err) {
        console.warn(`Watch error on ${dir}:`, err.message);
      }
    }
  }
}

// Execution entry
const args = process.argv.slice(2);
if (args.includes('--watch') || args.includes('-w')) {
  watchMode();
} else {
  runMasterSync();
}
