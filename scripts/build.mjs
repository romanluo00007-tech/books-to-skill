#!/usr/bin/env node
import { spawnSync } from 'child_process';
import { mkdirSync, cpSync, rmSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function run(cmd, cwd = root) {
  const [program, ...args] = cmd.split(' ');
  const r = spawnSync(program, args, { cwd, stdio: 'inherit', shell: true });
  if (r.status !== 0) process.exit(r.status);
}

const dist = join(root, 'dist');
if (existsSync(dist)) rmSync(dist, { recursive: true });
mkdirSync(dist, { recursive: true });

const showcases = ['marketing', 'strategy', 'sales', 'product'];

// 1. Build portal
console.log('\n📦 Building portal...');
run('npm install', join(root, 'portal'));
run('npm run build', join(root, 'portal'));
cpSync(join(root, 'portal', 'dist'), dist, { recursive: true });

// 2. Build each showcase
for (const name of showcases) {
  console.log(`\n📦 Building showcases/${name}...`);
  const showcaseDir = join(root, 'showcases', name);
  const outDir = join(dist, 'showcases', name);
  mkdirSync(outDir, { recursive: true });
  run('npm install', showcaseDir);
  run('npm run build', showcaseDir);
  cpSync(join(showcaseDir, 'dist'), outDir, { recursive: true });
}

// 3. 写入 serve.json：仅对 /meta/* 做 SPA fallback，/showcases/* 正常返回静态文件
writeFileSync(join(dist, 'serve.json'), JSON.stringify({
  rewrites: [
    { "source": "/meta/:path*", "destination": "/index.html" }
  ]
}, null, 2));

console.log('\n✅ Build complete. Output in dist/');
