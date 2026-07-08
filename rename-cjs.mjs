import { copyFileSync, rmSync } from 'node:fs';
copyFileSync('dist-cjs/index.js', 'dist/index.cjs');
rmSync('dist-cjs', { recursive: true, force: true });
