import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, 'src');
const dist = join(root, 'dist');
const runtimeSource = join(root, 'runtime', 'playground');
const blueprintSource = join(root, 'blueprints', 'advanced-bundles');
const blueprintStage = join(root, '.build', 'advanced-bundles');
const bundlePath = join(dist, 'demo-assets', 'advanced-bundles-demo.zip');

await rm(dist, { recursive: true, force: true });
await rm(join(root, '.build'), { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(source, dist, { recursive: true });
await cp(runtimeSource, dist, { recursive: true });
await mkdir(join(dist, 'data'), { recursive: true });
await cp(join(root, 'registry', 'plugins.json'), join(dist, 'data', 'plugins.json'));
await mkdir(blueprintStage, { recursive: true });
await cp(blueprintSource, blueprintStage, { recursive: true });
await mkdir(dirname(bundlePath), { recursive: true });

const zipped = spawnSync('/usr/bin/zip', ['-X', '-q', '-r', bundlePath, '.'], {
  cwd: blueprintStage,
  encoding: 'utf8'
});

if (zipped.status !== 0) {
  throw new Error(`Blueprint bundle failed: ${zipped.stderr || 'zip exited non-zero'}`);
}

await rm(join(root, '.build'), { recursive: true, force: true });

async function filesWithin(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path));
    if (entry.isFile()) files.push(path);
  }
  return files;
}

const files = (await filesWithin(dist)).sort();
const manifest = { schemaVersion: 1, files: [] };
for (const path of files) {
  const bytes = await readFile(path);
  manifest.files.push({
    path: relative(dist, path).replaceAll('\\', '/'),
    size: (await stat(path)).size,
    sha256: createHash('sha256').update(bytes).digest('hex')
  });
}

await writeFile(join(dist, 'build-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built ${manifest.files.length} files in ${dist}`);
