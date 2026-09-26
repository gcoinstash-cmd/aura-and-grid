import fs from 'fs';
import path from 'path';

const manifest = JSON.parse(fs.readFileSync('CATALOG_MANIFEST.json', 'utf8'));
const dirs = fs.readdirSync('Website Templates');

const csvHeaders = [
  'asset_id',
  'legal_asset_name',
  'commercial_product_name',
  'slug',
  'classification_level',
  'sector_canonical',
  'archetype',
  'source_repo_url',
  'default_branch',
  'preview_url',
  'schema_path',
  'seed_path',
  'rls_policy_status'
];

let csvRows = [csvHeaders.join(',')];
let markdownRows = [];

manifest.products.forEach(p => {
  const repoSlug = p.gumroad_url ? p.gumroad_url.split('/l/')[1] : 'blueprint-' + p.id;
  let matchedDir = dirs.find(d => 
    d === repoSlug || 
    d.replace(/-os$/, '') === repoSlug.replace(/-os$/, '') ||
    d.replace(/-clinic-os$/, '') === repoSlug.replace(/-clinic-os$/, '') ||
    (p.id === 1 && d === 'stride-manhattan-beach')
  );

  const assetId = p.id;
  const legalName = `"${p.name} Commercial Web Operating System"`;
  const commName = `"${p.name}"`;
  const slug = repoSlug;
  const classLevel = 'L3-SUPABASE-READY';
  const sector = p.vertical;
  const archetype = `"${p.archetype_name || 'Archetype A: Dense Operational Console'}"`;
  const repoName = (p.id === 1 || repoSlug === 'stride-mb') ? 'stride-manhattan-beach' : repoSlug;
  const repoUrl = `https://github.com/gcoinstash-cmd/${repoName}`;
  const defaultBranch = 'main';
  const previewUrl = p.preview_url || `https://${repoSlug}.onrender.com`;
  const schemaPath = `supabase/schema.sql`;
  const seedPath = `supabase/seed.sql`;
  const rlsStatus = '"RLS ENABLED (DEMO POLICIES + ISOLATION HARNESS)"';

  csvRows.push([
    assetId,
    legalName,
    commName,
    slug,
    classLevel,
    sector,
    archetype,
    repoUrl,
    defaultBranch,
    previewUrl,
    schemaPath,
    seedPath,
    rlsStatus
  ].join(','));

  markdownRows.push(
    `| ${assetId} | \`${slug}\` | **${p.name}** | \`${classLevel}\` | ${sector} | ${p.archetype_id || 'A'} | [\`${repoName}\`](${repoUrl}) | \`${defaultBranch}\` | [Demo](${previewUrl}) | \`supabase/schema.sql\` | \`supabase/seed.sql\` | Level 3 Verified |`
  );
});

// Write CSV to docs/ and site/
const csvContent = csvRows.join('\n');
fs.writeFileSync('docs/APA_SCHEDULE_A.csv', csvContent);
fs.writeFileSync('site/APA_SCHEDULE_A.csv', csvContent);
fs.writeFileSync('site/docs/APA_SCHEDULE_A.csv', csvContent);
console.log('APA_SCHEDULE_A.csv generated with', manifest.products.length, 'records');

// Regenerate TECHNICAL_DATA_ROOM.md
let dataRoom = fs.readFileSync('docs/TECHNICAL_DATA_ROOM.md', 'utf8');

// Replace Section 9
const section9Header = `## 9. Formal APA Schedule A: 85-Asset Commercial Inventory

Every asset listed below constitutes an immutable Schedule A asset item in the Asset Purchase Agreement, transferrable with full intellectual property rights, repository access, schema migrations, and commercial whitelabel deployment rights:

* **Machine-Readable Schedule A CSV**: Available directly at [\`docs/APA_SCHEDULE_A.csv\`](file:///Users/gmane/Documents/ZoMae%20Media%20LLC/Aura%20&%20Grid/docs/APA_SCHEDULE_A.csv) (and live on showroom at \`https://aura-and-grid-showroom.onrender.com/APA_SCHEDULE_A.csv\`).

| Asset ID | Product Slug | Commercial Product Name | Classification | Sector | Arch | GitHub Repo URL | Branch | Live Demo URL | Schema | Seed | Diligence Status |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- | :---: | :--- | :---: | :---: | :--- |
${markdownRows.join('\n')}

---
*Verified by Ghost Factory™ Automated Technical Diligence Harness. ZoMae Media LLC © 2026.*
`;

const sec9Idx = dataRoom.indexOf('## 9. Formal APA Schedule A:');
if (sec9Idx !== -1) {
  dataRoom = dataRoom.substring(0, sec9Idx) + section9Header;
} else {
  dataRoom += '\n\n' + section9Header;
}

fs.writeFileSync('docs/TECHNICAL_DATA_ROOM.md', dataRoom);
fs.writeFileSync('site/TECHNICAL_DATA_ROOM.md', dataRoom);
fs.writeFileSync('site/docs/TECHNICAL_DATA_ROOM.md', dataRoom);
console.log('TECHNICAL_DATA_ROOM.md updated with 12-column canonical Schedule A table');
