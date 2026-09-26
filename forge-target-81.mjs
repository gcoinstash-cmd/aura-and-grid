import fs from 'fs';
import path from 'path';

const slug = "fine-dining-matrix";
const appDir = path.join("Website Templates", slug);

fs.mkdirSync(appDir, { recursive: true });
fs.mkdirSync(path.join(appDir, "src"), { recursive: true });
fs.mkdirSync(path.join(appDir, "supabase"), { recursive: true });
fs.mkdirSync(path.join(appDir, "public"), { recursive: true });

// package.json
fs.writeFileSync(path.join(appDir, "package.json"), JSON.stringify({
  "name": `${slug}-os`,
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build && cp dist/index.html dist/200.html && cp dist/index.html dist/404.html && cp dist/index.html dist/admin.html && mkdir -p dist/admin && cp dist/index.html dist/admin/index.html",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.2"
  }
}, null, 2));

// vite.config.ts
fs.writeFileSync(path.join(appDir, "vite.config.ts"), `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './'
});
`);

// tsconfig.json
fs.writeFileSync(path.join(appDir, "tsconfig.json"), JSON.stringify({
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}, null, 2));

// public/_redirects
fs.writeFileSync(path.join(appDir, "public/_redirects"), `/* /index.html 200\n`);

// index.html
fs.writeFileSync(path.join(appDir, "index.html"), `<!doctype html>
<html lang="en" class="dark scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
    <title>AURA ÉTOILE — Michelin Seat Matrix & Sommelier Cellar OS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              obsidian: '#08090A',
              surface: '#111317',
              gold: '#D4AF37',
              bone: '#F4EFEA',
            }
          }
        }
      }
    </script>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Plus Jakarta Sans', sans-serif; }
      .font-serif-luxury { font-family: 'Cinzel', serif; }
    </style>
  </head>
  <body class="bg-[#08090A] text-zinc-100 text-base font-sans antialiased selection:bg-[#D4AF37] selection:text-black min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

// src/index.css
fs.writeFileSync(path.join(appDir, "src/index.css"), `
@tailwind base;
@tailwind components;
@tailwind utilities;
`);

// src/main.tsx
fs.writeFileSync(path.join(appDir, "src/main.tsx"), `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`);

console.log("Scaffolded target 81 basic structure.");
