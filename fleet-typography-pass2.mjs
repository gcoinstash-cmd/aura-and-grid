import fs from 'fs';
import path from 'path';

const root = "Website Templates";
const allDirs = fs.readdirSync(root).filter(d => d !== "Archive & Legacy Templates" && fs.statSync(path.join(root, d)).isDirectory());

console.log(`Starting Typography Pass 2: Eliminating text-xs sm:text-sm and enforcing 44px tap targets across ${allDirs.length} templates...\n`);

let totalFilesUpdated = 0;

allDirs.forEach(slug => {
  const dirPath = path.join(root, slug);
  const srcDir = path.join(dirPath, 'src');

  function processDir(curr) {
    if (!fs.existsSync(curr)) return;
    const files = fs.readdirSync(curr);
    files.forEach(file => {
      const fullPath = path.join(curr, file);
      if (fs.statSync(fullPath).isDirectory()) {
        processDir(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.html')) {
        let code = fs.readFileSync(fullPath, 'utf8');
        const origCode = code;

        // Upgrade hybrid micro-sizes like text-xs sm:text-sm on buttons and inputs
        code = code.replace(/text-xs sm:text-sm/g, 'text-base font-semibold');
        code = code.replace(/text-xs md:text-sm/g, 'text-base font-semibold');
        code = code.replace(/text-xs sm:text-base/g, 'text-base');

        // Upgrade button padding to generous 44px min tap targets
        code = code.replace(/(<button[^>]*class(?:Name)?="[^"]*?)px-3\.5 py-1\.5([^"]*")/g, '$1px-5 py-3 min-h-[44px]$2');
        code = code.replace(/(<button[^>]*class(?:Name)?="[^"]*?)px-5 py-2\.5([^"]*")/g, '$1px-5 py-3 min-h-[44px]$2');
        code = code.replace(/(<button[^>]*class(?:Name)?="[^"]*?)px-4 py-2([^"]*")/g, '$1px-5 py-3 min-h-[44px]$2');

        // Upgrade inputs padding to generous 44px min tap targets
        code = code.replace(/(<(?:input|select|textarea)[^>]*class(?:Name)?="[^"]*?)p-2\.5([^"]*")/g, '$1py-3 px-4 min-h-[44px]$2');
        code = code.replace(/(<(?:input|select|textarea)[^>]*class(?:Name)?="[^"]*?)p-2([^"]*")/g, '$1py-3 px-4 min-h-[44px]$2');

        if (code !== origCode) {
          fs.writeFileSync(fullPath, code);
          totalFilesUpdated++;
        }
      }
    });
  }

  processDir(srcDir);
  // Also process top level html
  const htmlFiles = fs.readdirSync(dirPath).filter(f => f.endsWith(".html")).map(f => path.join(dirPath, f));
  htmlFiles.forEach(hf => {
    let code = fs.readFileSync(hf, 'utf8');
    const origCode = code;
    code = code.replace(/text-xs sm:text-sm/g, 'text-base font-semibold');
    code = code.replace(/text-xs md:text-sm/g, 'text-base font-semibold');
    if (code !== origCode) {
      fs.writeFileSync(hf, code);
      totalFilesUpdated++;
    }
  });
});

console.log(`Pass 2 Complete! Additional files refined: ${totalFilesUpdated}`);
