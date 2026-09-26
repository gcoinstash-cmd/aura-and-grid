import fs from 'fs';
import path from 'path';

const file = 'Website Templates/stride-manhattan-beach/assets/js/app.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Mobile menu items with anchors & data-anchor-close
content = content.replace(
  /<nav class="space-y-4 text-base font-heading font-bold text-zinc-300">[\s\S]*?<\/nav>/,
  `<nav class="space-y-4 text-base font-heading font-bold text-zinc-200">
            <a href="index.html" class="block py-2 hover:text-white transition-colors">Home</a>
            <a href="#shop" class="block py-2 hover:text-white transition-colors" data-anchor-close>Shop All (84+ Pairs)</a>
            <a href="#drops" class="block py-2 text-[#FF5A36] flex items-center justify-between" data-anchor-close>
              Live Drops Radar <span class="text-[10px] font-mono bg-[#FF5A36] text-white px-2 py-0.5 rounded-full font-bold">HOT</span>
            </a>
            <a href="#lookbook" class="block py-2 hover:text-white transition-colors" data-anchor-close>Lookbook 2026</a>
            <a href="#about" class="block py-2 hover:text-white transition-colors" data-anchor-close>The Beach House</a>
            <a href="#contact" class="block py-2 hover:text-white transition-colors" data-anchor-close>VIP Concierge</a>
            <a href="admin" class="block py-2 text-xs font-mono text-amber-400 flex items-center justify-between border-t border-white/10 pt-3 mt-2 font-bold">
              ⚡ Boutique OS Admin <span class="bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold">Portal</span>
            </a>
          </nav>`
);

// 2. Wire data-anchor-close to closeMobileMenu in DOMContentLoaded
content = content.replace(
  /\/\/ Wire mobile menu close/,
  `// Wire mobile anchor clicks to close drawer
  document.querySelectorAll('[data-anchor-close]').forEach(el => {
    el.addEventListener('click', closeMobileMenu);
  });

  // Wire mobile menu close`
);

// 3. Search modal contrast
content = content.replace(/text-zinc-500 font-mono text-xs px-2 py-4 text-center/g, 'text-zinc-300 font-mono text-xs px-2 py-4 text-center font-medium');
content = content.replace(/text-\[10px\] text-zinc-500 font-mono text-center/g, 'text-xs text-zinc-300 font-mono text-center font-medium');

fs.writeFileSync(file, content, 'utf8');
console.log('✓ Successfully upgraded app.js with anchor closers and contrast!');
