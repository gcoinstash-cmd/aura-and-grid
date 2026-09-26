import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    // =========================================================================
    //   PRODUCTION OPTIMIZATIONS FOR DIGITAL DISTRIBUTION (GUMROAD READY)
    // =========================================================================
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'esbuild', // Ultrafast high-quality JavaScript compressor
      cssCodeSplit: true, // Split CSS into dedicated lightweight files per chunk
      sourcemap: false, // Turn off sourcemaps for final compressed build to protect raw source format
      rollupOptions: {
        output: {
          // Chunk splitting: prevents large vendor packages from causing slow initial loads
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('motion') || id.includes('lucide-react')) {
                return 'vendor-ui-core';
              }
              return 'vendor-others';
            }
          },
          // Human-readable, premium, cache-friendly asset hashing structure
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
