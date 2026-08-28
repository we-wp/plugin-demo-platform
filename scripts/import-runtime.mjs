import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = process.argv[2];
const archive = process.argv[3];
const destination = join(root, 'runtime', 'playground');

const expectedArchive = {
  filename: 'wasm-wordpress-net.tar.gz',
  size: 709583353,
  sha256: '93d4d5f1e8de89869b8b5f020a65d738b51b21f8812b29aab702c122cd2a469c'
};

if (!source || !archive) {
  throw new Error('Usage: node scripts/import-runtime.mjs <extracted-runtime> <wasm-wordpress-net.tar.gz>');
}

async function hash(path) {
  return createHash('sha256').update(await readFile(path)).digest('hex');
}

const archiveDetails = await stat(archive);
if (basename(archive) !== expectedArchive.filename || archiveDetails.size !== expectedArchive.size || await hash(archive) !== expectedArchive.sha256) {
  throw new Error('Runtime archive does not match the pinned official artifact.');
}

const rootFiles = [
  'remote.html',
  'sw.js',
  'playground-worker-endpoint-blueprints-Cefw2Oy_.js',
  'favicon.ico'
];
const clientFiles = [
  'git-create-dotgit-directory-Bq8LQROs.js',
  'git-sparse-checkout-DVyRV261.js',
  'index-CKjyuqSU.js',
  'index.js',
  'isomorphic-git-internals-fBGqD_Kt.js',
  'validate-blueprint-v2-BatnYL-x.js'
];
const binaryAssets = [
  'php_8_3-BZacpG4Q.wasm',
  'php_8_3-DYLSAelO.wasm',
  'sqlite-database-integration-trunk-Cmvfhyp_.zip',
  'wp-6.9.tar-YWSiU8TP.zst'
];

await rm(destination, { recursive: true, force: true });
await mkdir(join(destination, 'client'), { recursive: true });
await mkdir(join(destination, 'assets'), { recursive: true });

for (const file of rootFiles) await cp(join(source, file), join(destination, file));
for (const file of clientFiles) await cp(join(source, 'client', file), join(destination, 'client', file));
for (const file of binaryAssets) await cp(join(source, 'assets', file), join(destination, 'assets', file));

for (const entry of await readdir(join(source, 'assets'), { withFileTypes: true })) {
  if (!entry.isFile() || !/\.(?:css|jpeg|js|svg)$/.test(entry.name)) continue;
  await cp(join(source, 'assets', entry.name), join(destination, 'assets', entry.name));
}

await cp(join(source, 'wp-6.9'), join(destination, 'wp-6.9'), { recursive: true });

const offlineAssets = [
  '/assets/php_8_3-BIyy1gxd.js',
  '/assets/php_8_3-BZacpG4Q.wasm',
  '/assets/php_8_3-DYLSAelO.wasm',
  '/assets/php_8_3-GTfJGOrY.js',
  '/assets/sqlite-database-integration-trunk-Cmvfhyp_.zip',
  '/assets/wasm-feature-detect-DUYnTGBd.js',
  '/assets/wordpress-BCT27kqZ.css',
  '/assets/wordpress-CdnRGrfS.js',
  '/assets/worker-x63f4daL.js',
  '/assets/wp-6.9.tar-YWSiU8TP.zst',
  '/assets/zstddec-stream.modern-DR1JNyqv.js',
  '/playground-worker-endpoint-blueprints-Cefw2Oy_.js',
  '/remote.html',
  '/sw.js'
];
await writeFile(join(destination, 'assets-required-for-offline-mode.json'), `${JSON.stringify(offlineAssets, null, 2)}\n`);

async function filesWithin(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path));
    if (entry.isFile()) files.push(path);
  }
  return files;
}

const files = (await filesWithin(destination)).sort();
const inventory = [];
let totalSize = 0;
for (const path of files) {
  const size = (await stat(path)).size;
  totalSize += size;
  inventory.push(`${relative(destination, path).replaceAll('\\', '/')}\t${size}\t${await hash(path)}\n`);
}

const selection = {
  schemaVersion: 1,
  upstreamRevision: 'f29eca6c6f63f65e9176ce9072b2a34c9ed7d864',
  archive: expectedArchive,
  fileCount: files.length,
  size: totalSize,
  inventorySha256: createHash('sha256').update(inventory.join('')).digest('hex'),
  policy: 'Conservative support set with WordPress 6.9, PHP 8.3 JSPI and Asyncify binaries, matching client and remote, and all upstream JS, CSS, JPEG, and SVG support assets; no source maps, unrelated WordPress versions, or non-8.3 PHP WebAssembly binaries'
};
await writeFile(join(destination, 'selection.json'), `${JSON.stringify(selection, null, 2)}\n`);

console.log(JSON.stringify(selection, null, 2));
