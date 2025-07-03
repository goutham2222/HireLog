import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'node16',
    lib: {
      entry: 'main.ts',
      formats: ['cjs'],
      fileName: () => 'main.cjs'
    },
    rollupOptions: {
      external: ['electron', 'better-sqlite3', 'fs', 'path', 'url', 'os'],
      plugins: [
        commonjs({
          dynamicRequireTargets: ['node_modules/better-sqlite3/**/*'],
          ignoreTryCatch: false,
        })
      ],
    },
  },
});
