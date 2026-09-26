const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file === 'node_modules' || file === 'dist' || file === '.git') return;
    const fPath = path.join(dir, file);
    const stat = fs.statSync(fPath);
    if (stat && stat.isDirectory()) results = results.concat(walk(fPath));
    else if (/\.(tsx|ts|jsx|js|html)$/.test(file)) results.push(fPath);
  });
  return results;
}

async function main() {
  const targetDir = process.argv[2] || 'Website Templates/trendy-taco-truck';
  const files = walk(targetDir);
  const urlSet = new Set();
  files.forEach(f => {
    const content = fs.readFileSync(f, 'utf8');
    const re = /https:\/\/images\.unsplash\.com\/[^\s"'`)]+/g;
    let match;
    while ((match = re.exec(content)) !== null) {
      urlSet.add(match[0].replace(/&amp;/g, '&'));
    }
  });

  const urls = Array.from(urlSet);
  console.log(`Checking ${urls.length} media URLs in ${targetDir}...`);

  const results = await Promise.all(
    urls.map(u =>
      fetch(u, { method: 'HEAD' })
        .then(r => ({ u, ok: r.ok, status: r.status }))
        .catch(e => ({ u, ok: false, err: e.message }))
    )
  );

  const bad = results.filter(r => !r.ok);
  console.log(`Scan result: ${results.length - bad.length}/${results.length} OK (HTTP 200)`);
  if (bad.length > 0) {
    console.error('FAILURES:', bad);
    process.exit(1);
  }
}

main();
