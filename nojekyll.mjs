import fs from 'fs/promises';
import path from 'path';
import nextConfig from './next.config.js';

await fs.writeFile(path.join(nextConfig.distDir, '.nojekyll'), '', 'utf-8');