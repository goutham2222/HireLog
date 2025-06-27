import { defineConfig } from 'vite';

    export default defineConfig({
      build: {
        outDir: 'dist',
        lib: {
          entry: 'preload.ts',
          formats: ['cjs'],
        },
        rollupOptions: {
          external: ['sqlite3', 'sqlite'], // Exclude sqlite3 and sqlite from bundling
        },
      },
    });