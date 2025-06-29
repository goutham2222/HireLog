import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: 'preload.ts',
      formats: ['cjs'],              // 👈 must be CommonJS for Electron preload
      fileName: 'preload',           // 👈 results in preload.js
    },
    rollupOptions: {
      external: ['electron'],        // 👈 critical: don't bundle 'electron'
    },
    emptyOutDir: false               // optional: don't delete main.ts output
  },
});
