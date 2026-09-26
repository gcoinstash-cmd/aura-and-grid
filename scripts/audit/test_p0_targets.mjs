/**
 * TARGETED P0 VERIFICATION RUNNER
 * Tests only the 12 targets that were flagged in the last audit report.
 */

import { auditSingleApp } from './run_fleet_audit.mjs';
import { chromium } from 'playwright';
import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('CATALOG_MANIFEST.json', 'utf8'));
const targetIds = [9, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 51];

async function main() {
  console.log('Testing 12 flagged targets with Playwright...');
  const browser = await chromium.launch({ headless: true });
  
  const targets = manifest.products.filter(p => targetIds.includes(p.id));
  
  for (const t of targets) {
    const res = await auditSingleApp(browser, t);
    console.log(`[#${t.id}] ${res.verdict} | ${t.name} | HTTP ${res.httpStatus} | DOM: ${res.domElementsCount} | P0s: ${res.p0Issues.length} | P1s: ${res.p1Issues.length}`);
    if (res.p0Issues.length > 0) {
      console.log('   P0s:', res.p0Issues);
    }
  }
  
  await browser.close();
}

main().catch(console.error);
