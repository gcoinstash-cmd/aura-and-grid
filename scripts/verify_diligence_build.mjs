#!/usr/bin/env node

/**
 * Ghost Factory™ — Automated Diligence Build & Artifact Validator
 * 
 * Objectives:
 * 1. Verify CATALOG_MANIFEST.json length === 110.
 * 2. Verify catalogData.ts array length === 110.
 * 3. Validate SSR / static output:
 *    - site/index.html contains exact 110 instances of "SIMULATED DATA PROTOTYPE".
 *    - site/index.html contains exact 110 instances of "Truth & Compliance".
 *    - site/index.html contains 60 instances of "NOT CERTIFIED FOR CLINICAL/LEGAL/FINANCIAL USE".
 *    - Cache-busting parameter v=9.6-diligence present in site/index.html and tools/ghost-factory-console.
 *    - tools/ghost-factory-console/dist/index.html verified intact.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🏛️ [Ghost Factory™] Running Automated Terminal Diligence Validation...\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS] ${message}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${message}`);
    failCount++;
  }
}

// 1. Check CATALOG_MANIFEST.json length
const manifestPath = path.join(rootDir, 'CATALOG_MANIFEST.json');
assert(fs.existsSync(manifestPath), 'CATALOG_MANIFEST.json exists');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestLength = manifest.products?.length || 0;
assert(manifestLength === 110, `CATALOG_MANIFEST.json products length === 110 (Actual: ${manifestLength})`);

// 2. Check catalogData.ts length
const catalogDataPath = path.join(rootDir, 'tools', 'ghost-factory-console', 'src', 'catalogData.ts');
assert(fs.existsSync(catalogDataPath), 'catalogData.ts exists');
const catalogContent = fs.readFileSync(catalogDataPath, 'utf8');
const idMatches = (catalogContent.match(/"id":\s*\d+/g) || []).length;
assert(idMatches === 110, `catalogData.ts array length === 110 (Actual: ${idMatches})`);

// 3. Validate SSR / static output in site/index.html
const showroomPath = path.join(rootDir, 'site', 'index.html');
assert(fs.existsSync(showroomPath), 'site/index.html static artifact exists');
const showroomHtml = fs.readFileSync(showroomPath, 'utf8');

const truthBadgeMatches = (showroomHtml.match(/SIMULATED DATA PROTOTYPE/g) || []).length;
assert(truthBadgeMatches === 110, `site/index.html contains exact 110 Truth Badge occurrences (Actual: ${truthBadgeMatches})`);

const truthComplianceMatches = (showroomHtml.match(/Truth & Compliance/g) || []).length;
assert(truthComplianceMatches === 110, `site/index.html contains exact 110 Truth & Compliance drawer occurrences (Actual: ${truthComplianceMatches})`);

const regulatedDisclaimerMatches = (showroomHtml.match(/NOT CERTIFIED FOR CLINICAL\/LEGAL\/FINANCIAL USE/g) || []).length;
assert(regulatedDisclaimerMatches === 48, `site/index.html contains exact 48 Regulated Sector disclaimers (Actual: ${regulatedDisclaimerMatches})`);

// 4. Validate Best For Buyer Qualification Targeting
const manifestBestForMatches = (manifest.products || []).filter(p => p.best_for && p.best_for.startsWith('Best for:')).length;
assert(manifestBestForMatches === 110, `CATALOG_MANIFEST.json contains 110 valid "best_for" target strings (Actual: ${manifestBestForMatches})`);

const showroomBestForMatches = (showroomHtml.match(/Best For:/g) || []).length;
assert(showroomBestForMatches >= 110, `site/index.html contains >= 110 Best For qualification occurrences (Actual: ${showroomBestForMatches})`);

const consoleDistHtmlPath = path.join(rootDir, 'tools', 'ghost-factory-console', 'dist', 'index.html');
assert(fs.existsSync(consoleDistHtmlPath), 'tools/ghost-factory-console/dist/index.html build artifact exists');
const consoleDistHtml = fs.readFileSync(consoleDistHtmlPath, 'utf8');
const consoleBestForMatches = (consoleDistHtml.match(/Best For:/g) || []).length;
assert(consoleBestForMatches === 110, `tools/ghost-factory-console/dist/index.html contains exact 110 Best For occurrences (Actual: ${consoleBestForMatches})`);

// 5. Validate Truthful Proof & Zero Prohibited Claims
assert(!showroomHtml.includes('100% Production Ready'), 'site/index.html has no unverified "100% Production Ready" claim');
assert(!showroomHtml.includes('WCAG AA Certified'), 'site/index.html has no unverified "WCAG AA Certified" claim');

// 6. Validate cache-busting version parameter v=9.6-diligence
assert(showroomHtml.includes('v=9.6-diligence'), 'site/index.html contains cache-busting version parameter v=9.6-diligence');
assert(consoleDistHtml.includes('v=9.6-diligence'), 'tools/ghost-factory-console/dist/index.html contains cache-busting version parameter v=9.6-diligence');

// 7. Validate v1.2.0-diligence-cleared Frozen Release Version
const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
assert(rootPkg.version === '1.2.0-diligence-cleared', 'root package.json version === 1.2.0-diligence-cleared');

const consolePkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'tools', 'ghost-factory-console', 'package.json'), 'utf8'));
assert(consolePkg.version === '1.2.0-diligence-cleared', 'tools/ghost-factory-console/package.json version === 1.2.0-diligence-cleared');

assert(manifest.catalog_version === '1.2.0-diligence-cleared', 'CATALOG_MANIFEST.json catalog_version === 1.2.0-diligence-cleared');
assert(catalogContent.includes('"catalog_version": "1.2.0-diligence-cleared"'), 'catalogData.ts catalog_version === 1.2.0-diligence-cleared');
assert(showroomHtml.includes('v1.2.0-diligence-cleared'), 'site/index.html contains v1.2.0-diligence-cleared version lock');
assert(consoleDistHtml.includes('v1.2.0-diligence-cleared'), 'tools/ghost-factory-console/dist/index.html contains v1.2.0-diligence-cleared build badge');

console.log('\n-------------------------------------------------------');
console.log(`📊 Diligence Validation Summary: ${passCount} Passed, ${failCount} Failed.`);
console.log('-------------------------------------------------------\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🏁 ALL TERMINAL DILIGENCE VALIDATION CRITERIA SATISFIED!\n');
}
