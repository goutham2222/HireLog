import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'node16',
    lib: {
      entry: path.resolve(__dirname, 'preload.ts'),
      formats: ['cjs'],
      fileName: () => 'preload.cjs',
    },
  },
});
