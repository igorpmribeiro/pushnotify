import { build } from 'esbuild';
import { writeFileSync, readFileSync } from 'fs';

await build({
  entryPoints: ['packages/backend/src/serverless.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'iife',
  globalName: '__handler',
  outfile: 'api/index.tmp.js',
  external: [],
});

const bundle = readFileSync('api/index.tmp.js', 'utf-8');
const wrapper = `${bundle}
module.exports = __handler.default || __handler.handler || __handler;
module.exports.default = module.exports;
`;
writeFileSync('api/index.js', wrapper);

import { unlinkSync } from 'fs';
unlinkSync('api/index.tmp.js');

console.log('API bundle built successfully');
