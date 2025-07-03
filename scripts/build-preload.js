const esbuild = require('esbuild');
const path = require('path');

esbuild.build({
  entryPoints: [path.resolve(__dirname, '../preload.ts')],
  bundle: true,
  platform: 'node',
  target: ['node18'], // Or 'node16' depending on your environment
  outfile: path.resolve(__dirname, '../dist/preload.cjs'),
}).then(() => {
  console.log('[build] Preload script built successfully!');
}).catch((err) => {
  console.error('[build] Failed to build preload script:', err);
  process.exit(1);
});
