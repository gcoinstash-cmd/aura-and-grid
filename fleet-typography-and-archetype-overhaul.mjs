import fs from 'fs';
import path from 'path';

const root = "Website Templates";
const allDirs = fs.readdirSync(root).filter(d => d !== "Archive & Legacy Templates" && fs.statSync(path.join(root, d)).isDirectory());

console.log(`Starting Fleet-Wide Typography & Readability Overhaul across ${allDirs.length} templates...\n`);

let totalFilesUpdated = 0;
let templateReport = [];

allDirs.forEach((slug, idx) => {
  const dirPath = path.join(root, slug);
  let filesChanged = 0;
  let textXsFixed = 0;
  let buttonsFixed = 0;
  let inputsFixed = 0;
  let bodyUpdated = false;

  // 1. Process all HTML files (index.html, shop.html, admin.html, etc.)
  const htmlFiles = fs.readdirSync(dirPath).filter(f => f.endsWith(".html")).map(f => path.join(dirPath, f));
  htmlFiles.forEach(hf => {
    let content = fs.readFileSync(hf, 'utf8');
    const orig = content;

    // Body tag upgrade
    if (content.includes('<body') && !content.includes('text-base text-zinc-100')) {
      content = content.replace(/(<body[^>]*class="[^"]*?)"/, (m, p1) => {
        bodyUpdated = true;
        return p1 + ' text-base text-zinc-100 font-sans antialiased selection:bg-emerald-500"';
      });
    }

    // Micro text replacements in static HTML
    content = content.replace(/text-\[10px\]/g, () => { textXsFixed++; return 'text-xs font-semibold tracking-wider'; });
    content = content.replace(/text-\[11px\]/g, () => { textXsFixed++; return 'text-xs font-semibold'; });
    content = content.replace(/(<p[^>]*class(?:Name)?="[^"]*?)text-xs text-(?:slate|zinc|gray)-(?:400|500)([^"]*")/g, (m, p1, p2) => {
      textXsFixed++;
      return p1 + 'text-base text-zinc-200 leading-relaxed' + p2;
    });
    content = content.replace(/(<p[^>]*class(?:Name)?="[^"]*?)text-sm text-(?:slate|zinc|gray)-(?:400|500)([^"]*")/g, (m, p1, p2) => {
      return p1 + 'text-base sm:text-lg text-zinc-200 leading-relaxed' + p2;
    });

    if (content !== orig) {
      fs.writeFileSync(hf, content);
      filesChanged++;
    }
  });

  // 2. Process src/ directory recursively for React/Vite templates
  const srcDir = path.join(dirPath, 'src');
  if (fs.existsSync(srcDir)) {
    function processDir(curr) {
      const files = fs.readdirSync(curr);
      files.forEach(file => {
        const fullPath = path.join(curr, file);
        if (fs.statSync(fullPath).isDirectory()) {
          processDir(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.js')) {
          let code = fs.readFileSync(fullPath, 'utf8');
          const origCode = code;

          // Replace micro-text text-[10px], text-[11px]
          code = code.replace(/text-\[10px\]/g, () => { textXsFixed++; return 'text-xs font-semibold tracking-wider'; });
          code = code.replace(/text-\[11px\]/g, () => { textXsFixed++; return 'text-xs font-semibold'; });

          // Upgrade buttons: text-xs or text-sm to text-base and min-h-[44px]
          code = code.replace(/(<button[^>]*class(?:Name)?="[^"]*?)text-xs([^"]*")/g, (m, p1, p2) => {
            buttonsFixed++;
            return p1 + 'text-base font-semibold min-h-[44px]' + p2;
          });
          code = code.replace(/(<button[^>]*class(?:Name)?="[^"]*?)text-sm font-(?:bold|semibold)([^"]*")/g, (m, p1, p2) => {
            buttonsFixed++;
            return p1 + 'text-base font-bold min-h-[44px]' + p2;
          });

          // Upgrade inputs, selects, textareas to text-base and min-h-[44px]
          code = code.replace(/(<(?:input|select|textarea)[^>]*class(?:Name)?="[^"]*?)text-xs([^"]*")/g, (m, p1, p2) => {
            inputsFixed++;
            return p1 + 'text-base min-h-[44px]' + p2;
          });
          code = code.replace(/(<(?:input|select|textarea)[^>]*class(?:Name)?="[^"]*?)text-sm([^"]*")/g, (m, p1, p2) => {
            inputsFixed++;
            return p1 + 'text-base min-h-[44px]' + p2;
          });

          // Upgrade low-contrast dark mode gray text
          code = code.replace(/text-zinc-500/g, 'text-zinc-300');
          code = code.replace(/text-slate-500/g, 'text-slate-300');
          code = code.replace(/text-gray-500/g, 'text-gray-300');

          // Upgrade paragraph micro-text
          code = code.replace(/(<p[^>]*class(?:Name)?="[^"]*?)text-xs text-(?:slate|zinc|gray)-(?:400|500)([^"]*")/g, (m, p1, p2) => {
            textXsFixed++;
            return p1 + 'text-base text-zinc-200 leading-relaxed' + p2;
          });
          code = code.replace(/(<p[^>]*class(?:Name)?="[^"]*?)text-sm text-(?:slate|zinc|gray)-(?:400|500)([^"]*")/g, (m, p1, p2) => {
            return p1 + 'text-base sm:text-lg text-zinc-200 leading-relaxed' + p2;
          });

          // Labels: ensure text-sm font-semibold
          code = code.replace(/(<label[^>]*class(?:Name)?="[^"]*?)text-xs([^"]*")/g, (m, p1, p2) => {
            if (!p2.includes('font-semibold') && !p2.includes('font-bold')) {
              return p1 + 'text-sm font-semibold' + p2;
            }
            return p1 + 'text-sm' + p2;
          });

          if (code !== origCode) {
            fs.writeFileSync(fullPath, code);
            filesChanged++;
          }
        }
      });
    }
    processDir(srcDir);
  }

  totalFilesUpdated += filesChanged;
  templateReport.push({ id: idx + 1, slug, filesChanged, textXsFixed, buttonsFixed, inputsFixed, bodyUpdated });
});

console.log(`Scan & Overhaul Complete!`);
console.log(`Total Templates: ${allDirs.length}`);
console.log(`Total Files Enhanced: ${totalFilesUpdated}`);
console.log(`\nSample First 15 Upgrades:`);
templateReport.slice(0, 15).forEach(r => {
  console.log(`[#${r.id.toString().padStart(2, '0')}] ${r.slug.padEnd(28)} | Files:${r.filesChanged} | MicroText:${r.textXsFixed} | Buttons:${r.buttonsFixed} | Inputs:${r.inputsFixed}`);
});
