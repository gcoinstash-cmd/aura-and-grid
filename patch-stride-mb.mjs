import fs from 'fs';
import path from 'path';

const dir = 'Website Templates/stride-manhattan-beach';
let indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// 1. Navigation updates in index.html with exact #id links
indexHtml = indexHtml.replace(
  /<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">[\s\S]*?<\/nav>/,
  `<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-200">
        <a href="#shop" class="hover:text-white transition-colors">Shop All</a>
        <a href="#drops" class="hover:text-[#FF5A36] transition-colors flex items-center gap-2">
          Drops <span class="w-1.5 h-1.5 rounded-full bg-[#FF5A36]"></span>
        </a>
        <a href="#lookbook" class="hover:text-white transition-colors">Lookbook</a>
        <a href="#about" class="hover:text-white transition-colors">The Beach House</a>
        <a href="#contact" class="hover:text-white transition-colors">Concierge</a>
        <a href="admin" class="text-xs font-mono text-amber-400 bg-amber-400/10 border border-amber-400/25 px-2.5 py-1 rounded hover:bg-amber-400 hover:text-black transition-colors font-bold">⚡ Admin Pass</a>
      </nav>`
);

// 2. Announcement bar responsive & contrast
indexHtml = indexHtml.replace(
  /<div class="bg-gradient-to-r from-zinc-950 via-\[#131316\] to-zinc-950 border-b border-white\/10 text-xs py-2 px-4 text-center tracking-wider flex items-center justify-center gap-3">[\s\S]*?<\/div>/,
  `<div class="bg-gradient-to-r from-zinc-950 via-[#131316] to-zinc-950 border-b border-white/10 text-xs sm:text-sm py-2.5 px-4 text-center tracking-wider flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 break-words">
    <span class="pulse-dot"></span>
    <span class="text-zinc-200 font-mono"><strong class="text-white">MANHATTAN BEACH FLAGSHIP:</strong> Private VIP Fitting Appointments Open This Weekend</span>
    <a href="#contact" class="underline text-[#FF5A36] hover:text-white transition-colors ml-1 font-semibold">Book Suite &rarr;</a>
  </div>`
);

// 3. Hero section tag with id="hero" and scroll-mt-20
indexHtml = indexHtml.replace(
  /<section class="relative min-h-\[90vh\] flex items-center overflow-hidden border-b border-white\/10">/,
  `<section id="hero" class="scroll-mt-20 relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/10">`
);

// 4. Hero grid & text responsiveness
indexHtml = indexHtml.replace(
  /<div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">/,
  `<div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">`
);

indexHtml = indexHtml.replace(
  /<h1 class="text-5xl sm:text-7xl font-heading font-extrabold tracking-tight leading-\[1\.05\]">/,
  `<h1 class="text-5xl sm:text-7xl font-heading font-extrabold tracking-tight leading-[1.05] break-words">`
);

indexHtml = indexHtml.replace(
  /<p class="text-lg text-zinc-400 max-w-xl font-normal leading-relaxed">/,
  `<p class="text-lg text-zinc-200 max-w-xl font-normal leading-relaxed break-words">`
);

// Hero button targets to anchors
indexHtml = indexHtml.replace(
  /<a href="shop" class="btn-primary">([\s\S]*?)Explore Collection/,
  `<a href="#shop" class="btn-primary">$1Explore Collection`
);
indexHtml = indexHtml.replace(
  /<a href="drops" class="btn-secondary">([\s\S]*?)View Drop Calendar/,
  `<a href="#drops" class="btn-secondary">$1View Drop Calendar`
);

// 5. Hero stats row
indexHtml = indexHtml.replace(
  /<div class="grid grid-cols-3 gap-6 pt-8 border-t border-white\/10 max-w-lg">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/,
  `<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/10 max-w-lg break-words">
          <div>
            <div class="font-heading font-bold text-2xl text-white">100%</div>
            <div class="text-xs text-zinc-300 font-mono font-medium">Authentic Guaranteed</div>
          </div>
          <div>
            <div class="font-heading font-bold text-2xl text-[#FF5A36]">MB 90266</div>
            <div class="text-xs text-zinc-300 font-mono font-medium">Flagship Boutique</div>
          </div>
          <div>
            <div class="font-heading font-bold text-2xl text-[#2EC4B6]">Same-Day</div>
            <div class="text-xs text-zinc-300 font-mono font-medium">SoCal Courier</div>
          </div>
        </div>`
);

// 6. Hero Sneaker Card header & SKU
indexHtml = indexHtml.replace(
  /<div class="flex justify-between items-center mb-6">[\s\S]*?<span class="badge-drop"><span class="pulse-dot"><\/span> Next Drop In<\/span>[\s\S]*?<span class="font-mono text-xs text-zinc-400">SKU: MB-990-V6<\/span>[\s\S]*?<\/div>/,
  `<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 break-words">
            <span class="badge-drop"><span class="pulse-dot"></span> Next Drop In</span>
            <span class="font-mono text-sm text-zinc-200 font-semibold tracking-wide">SKU: MB-990-V6</span>
          </div>`
);

// 7. Countdown timer labels to text-zinc-300 and grid-cols-4
indexHtml = indexHtml.replace(
  /<div class="flex justify-between items-center text-center p-4 rounded-2xl bg-black\/60 border border-white\/10 mb-6" data-countdown>[\s\S]*?<\/div>\s*<\/div>/,
  `<div class="grid grid-cols-4 gap-2 text-center p-4 rounded-2xl bg-black/60 border border-white/10 mb-6 break-words" data-countdown>
            <div>
              <span class="cd-days text-2xl font-mono font-bold text-white">03</span>
              <span class="block text-xs font-semibold tracking-wider text-zinc-300 font-mono uppercase">Days</span>
            </div>
            <div>
              <span class="cd-hours text-2xl font-mono font-bold text-white">14</span>
              <span class="block text-xs font-semibold tracking-wider text-zinc-300 font-mono uppercase">Hours</span>
            </div>
            <div>
              <span class="cd-minutes text-2xl font-mono font-bold text-white">28</span>
              <span class="block text-xs font-semibold tracking-wider text-zinc-300 font-mono uppercase">Mins</span>
            </div>
            <div>
              <span class="cd-seconds text-2xl font-mono font-bold text-[#FF5A36]">45</span>
              <span class="block text-xs font-semibold tracking-wider text-zinc-300 font-mono uppercase">Secs</span>
            </div>
          </div>`
);

// 8. Hero card bottom product details
indexHtml = indexHtml.replace(
  /<div class="mt-4 pt-4 border-t border-white\/10 flex items-center justify-between">[\s\S]*?Aura Runner 'Pacific Dune'[\s\S]*?<\/div>\s*<\/div>/,
  `<div class="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 break-words">
            <div class="min-w-0">
              <h3 class="font-heading font-bold text-lg text-white break-words">Aura Runner 'Pacific Dune'</h3>
              <p class="text-sm sm:text-base text-zinc-200 leading-relaxed font-mono break-words">Edition of 150 Pairs Worldwide</p>
            </div>
            <div class="text-left sm:text-right shrink-0">
              <span class="block font-heading font-bold text-xl text-white">$240</span>
              <a href="product-detail" class="text-sm font-mono text-[#FF5A36] hover:underline font-bold inline-block">View Drop &rarr;</a>
            </div>
          </div>`
);

// 9. Marquee ticker with id="ticker" and high contrast text-zinc-200
indexHtml = indexHtml.replace(
  /<section class="border-b border-white\/10 bg-zinc-950\/60 py-4 overflow-hidden">[\s\S]*?<\/section>/,
  `<section id="ticker" class="scroll-mt-20 border-b border-white/10 bg-zinc-950/80 py-4 overflow-hidden">
    <div class="marquee-track">
      <div class="marquee-content font-heading text-sm sm:text-base uppercase tracking-widest text-zinc-200 font-bold">
        <span>★ MANHATTAN BEACH PIER EDITIONS</span>
        <span>•</span>
        <span>100% VERIFIED AUTHENTICITY</span>
        <span>•</span>
        <span>EXCLUSIVE SOLE RAFFLES</span>
        <span>•</span>
        <span>GLOBAL TEMPERATURE-CONTROLLED COURIER</span>
        <span>•</span>
        <span>LOCALLY CURATED IN 90266</span>
        <span>•</span>
        <span>PRIVATE VIP FITTING LOUNGE</span>
      </div>
      <div class="marquee-content font-heading text-sm sm:text-base uppercase tracking-widest text-zinc-200 font-bold">
        <span>★ MANHATTAN BEACH PIER EDITIONS</span>
        <span>•</span>
        <span>100% VERIFIED AUTHENTICITY</span>
        <span>•</span>
        <span>EXCLUSIVE SOLE RAFFLES</span>
        <span>•</span>
        <span>GLOBAL TEMPERATURE-CONTROLLED COURIER</span>
        <span>•</span>
        <span>LOCALLY CURATED IN 90266</span>
        <span>•</span>
        <span>PRIVATE VIP FITTING LOUNGE</span>
      </div>
    </div>
  </section>`
);

// 10. Featured Curated Drops section with id="shop" and id="drops" and scroll-mt-20
indexHtml = indexHtml.replace(
  /<section class="max-w-7xl mx-auto px-6 py-24">/,
  `<section id="shop" class="scroll-mt-20 max-w-7xl mx-auto px-6 py-24">
    <div id="drops" class="scroll-mt-20"></div>`
);

// 11. High-contrast labels in sneaker cards
indexHtml = indexHtml.replace(/text-xs font-mono text-zinc-500/g, 'text-sm font-mono text-zinc-200 font-medium');
indexHtml = indexHtml.replace(/text-xs font-semibold font-mono text-zinc-400 uppercase tracking-wider/g, 'text-xs sm:text-sm font-semibold font-mono text-zinc-200 uppercase tracking-wider');

// 12. Editorial section with id="lookbook" and id="about" and scroll-mt-20
indexHtml = indexHtml.replace(
  /<section class="border-y border-white\/10 bg-zinc-950\/80 py-24">/,
  `<section id="lookbook" class="scroll-mt-20 border-y border-white/10 bg-zinc-950/80 py-24">
    <div id="about" class="scroll-mt-20"></div>`
);

indexHtml = indexHtml.replace(
  /<p class="text-zinc-400 leading-relaxed">[\s\S]*?We blend the salt-air laid-back ethos/,
  `<p class="text-base sm:text-lg text-zinc-200 leading-relaxed break-words">\n            We blend the salt-air laid-back ethos`
);

indexHtml = indexHtml.replace(
  /<div class="lg:col-span-7 grid grid-cols-2 gap-4">/,
  `<div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 break-words">`
);

// 13. Footer with id="contact" and id="concierge" and scroll-mt-20
indexHtml = indexHtml.replace(
  /<footer class="border-t border-white\/10 bg-\[#070708\] pt-16 pb-12">/,
  `<footer id="contact" class="scroll-mt-20 border-t border-white/10 bg-[#070708] pt-16 pb-12">
    <div id="concierge" class="scroll-mt-20"></div>`
);

// Footer text contrast fixes
indexHtml = indexHtml.replace(/text-zinc-400/g, 'text-zinc-200');
indexHtml = indexHtml.replace(/text-zinc-500/g, 'text-zinc-300');

fs.writeFileSync(path.join(dir, 'index.html'), indexHtml, 'utf8');
console.log('✓ Successfully upgraded index.html with anchors, contrast & responsiveness!');
