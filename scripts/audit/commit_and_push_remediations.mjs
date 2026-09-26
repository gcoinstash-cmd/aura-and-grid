/**
 * GHOST FACTORY™ — BULK COMMIT & PUSH PIPELINE
 * Commits and pushes remediations across all 85 Website Templates to GitHub
 * to trigger automated cloud redeployments (Render + GitHub Pages).
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const BASE_DIR = 'Website Templates';
const GIT_ENV = { ...process.env, DEVELOPER_DIR: '/Library/Developer/CommandLineTools' };

const templates = fs.readdirSync(BASE_DIR).filter(item => {
  const fullPath = path.join(BASE_DIR, item);
  return fs.statSync(fullPath).isDirectory() && item !== 'Archive & Legacy Templates';
});

console.log(`Processing git push across ${templates.length} templates...\n`);

let pushedCount = 0;
let cleanCount = 0;
let errorCount = 0;

for (let i = 0; i < templates.length; i++) {
  const slug = templates[i];
  const cwd = path.join(BASE_DIR, slug);

  if (!fs.existsSync(path.join(cwd, '.git'))) {
    console.log(`[#${i + 1}/${templates.length}] ⏭️ SKIP: ${slug} (Not a git repo)`);
    continue;
  }

  try {
    const status = execSync('git status --porcelain', { cwd, env: GIT_ENV }).toString().trim();
    if (!status) {
      cleanCount++;
      continue;
    }

    // Determine current branch (main or master)
    let branch = execSync('git branch --show-current', { cwd, env: GIT_ENV }).toString().trim();
    if (!branch) branch = 'main';

    // Stage all changes
    execSync('git add -A', { cwd, env: GIT_ENV });

    // Commit
    const commitMsg = 'fix(qa): P0 SPA redirect rules, passkey gate verification, and 18px WCAG AAA typography';
    execSync(`git commit -m "${commitMsg}"`, { cwd, env: GIT_ENV });

    // Push to origin
    execSync(`git push origin ${branch}`, { cwd, env: GIT_ENV, stdio: 'pipe' });

    pushedCount++;
    console.log(`[#${i + 1}/${templates.length}] 🚀 PUSHED: ${slug} (${branch})`);
  } catch (err) {
    console.error(`[#${i + 1}/${templates.length}] ❌ ERROR on ${slug}:`, err.message.split('\n')[0]);
    errorCount++;
  }
}

console.log(`\n======================================================`);
console.log(`GIT SYNC REPORT:`);
console.log(`Total Templates Pushed: ${pushedCount}`);
console.log(`Already Clean: ${cleanCount}`);
console.log(`Errors: ${errorCount}`);
console.log(`======================================================\n`);
