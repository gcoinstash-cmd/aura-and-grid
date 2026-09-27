import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const templatesDir = 'Website Templates';
const dirs = fs.readdirSync(templatesDir).filter(d => {
  const p = path.join(templatesDir, d);
  return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, '.git'));
});

console.log(`Starting LICENSE dispatch across ${dirs.length} repositories...`);

const results = {
  success: [],
  alreadyPresent: [],
  failed: []
};

for (let i = 0; i < dirs.length; i++) {
  const d = dirs[i];
  const dirPath = path.join(templatesDir, d);
  const targetLicense = path.join(dirPath, 'LICENSE');

  try {
    fs.copyFileSync('LICENSE', targetLicense);
    const status = execSync(`DEVELOPER_DIR=/Library/Developer/CommandLineTools git -C "${dirPath}" status -s`, { encoding: 'utf8' });

    if (status.includes('LICENSE')) {
      execSync(`DEVELOPER_DIR=/Library/Developer/CommandLineTools git -C "${dirPath}" add LICENSE`);
      execSync(`DEVELOPER_DIR=/Library/Developer/CommandLineTools git -C "${dirPath}" commit -m "docs(license): add standard permissive MIT commercial blueprint license"`);
      let branch = 'main';
      try {
        branch = execSync(`DEVELOPER_DIR=/Library/Developer/CommandLineTools git -C "${dirPath}" branch --show-current`, { encoding: 'utf8' }).trim() || 'main';
      } catch (e) {
        branch = 'main';
      }

      console.log(`[${i + 1}/${dirs.length}] Pushing ${d} (${branch})...`);
      execSync(`DEVELOPER_DIR=/Library/Developer/CommandLineTools git -C "${dirPath}" push origin ${branch}`, { stdio: 'pipe' });
      results.success.push(d);
    } else {
      results.alreadyPresent.push(d);
    }
  } catch (err) {
    console.error(`Failed on ${d}:`, err.message);
    results.failed.push({ dir: d, error: err.message });
  }
}

console.log('=== FLEET LICENSE DISPATCH SUMMARY ===');
console.log(`Pushed: ${results.success.length}`);
console.log(`Already Present / Unchanged: ${results.alreadyPresent.length}`);
console.log(`Failed: ${results.failed.length}`);
if (results.failed.length > 0) {
  console.log('Failed repos:', results.failed);
}
