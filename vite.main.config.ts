import { defineConfig } from 'vite';

  export default defineConfig({
    build: {
      outDir: 'dist',
      lib: {
        entry: 'main.ts',
        formats: ['cjs'],
        fileName: 'job-application-tracker', // Ensure this matches the output name
      },
      rollupOptions: {
        external: ['sqlite3', 'sqlite', 'path', 'fs', 'electron'], // Add externalized modules
      },
    },
  });