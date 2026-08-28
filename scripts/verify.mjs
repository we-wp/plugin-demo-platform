import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, 'dist');
const manifest = JSON.parse(await readFile(join(dist, 'build-manifest.json'), 'utf8'));
const demoLock = JSON.parse(await readFile(join(root, 'blueprints', 'advanced-bundles', 'demo.lock.json'), 'utf8'));
const runtimeLock = JSON.parse(await readFile(join(root, 'blueprints', 'runtime.lock.json'), 'utf8'));
const runtimeRoot = join(root, 'runtime', 'playground');

for (const file of manifest.files) {
  const bytes = await readFile(join(dist, file.path));
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (hash !== file.sha256 || bytes.length !== file.size) {
    throw new Error(`Build manifest mismatch: ${file.path}`);
  }
}

const bundle = join(dist, 'demo-assets', 'advanced-bundles-demo.zip');
const zipTest = spawnSync('/usr/bin/unzip', ['-t', bundle], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
if (zipTest.status !== 0) throw new Error(`Blueprint ZIP invalid: ${zipTest.stderr}`);

const blueprintBytes = spawnSync('/usr/bin/unzip', ['-p', bundle, 'blueprint.json'], { maxBuffer: 10 * 1024 * 1024 });
if (blueprintBytes.status !== 0) throw new Error('Blueprint bundle has no root blueprint.json');
const blueprint = JSON.parse(blueprintBytes.stdout.toString('utf8'));
if (blueprint.features?.networking !== false) throw new Error('Blueprint networking must be false');

const pluginBytes = spawnSync('/usr/bin/unzip', ['-p', bundle, 'plugins/aim-advanced-bundles-0.1.0.zip'], { maxBuffer: 10 * 1024 * 1024 });
if (pluginBytes.status !== 0) throw new Error('Blueprint bundle has no pinned Free plugin ZIP');
const pluginHash = createHash('sha256').update(pluginBytes.stdout).digest('hex');
if (pluginHash !== demoLock.plugin.sha256 || pluginBytes.stdout.length !== demoLock.plugin.size) {
  throw new Error(`Bundled plugin hash mismatch: ${pluginHash}`);
}

const pluginSourcePath = join(root, 'blueprints', 'advanced-bundles', 'plugins', demoLock.plugin.filename);
const pluginInventory = spawnSync('/usr/bin/unzip', ['-Z1', pluginSourcePath], { maxBuffer: 10 * 1024 * 1024 });
if (pluginInventory.status !== 0) throw new Error('Bundled plugin ZIP inventory could not be read');
const pluginEntries = pluginInventory.stdout.toString('utf8').trim().split('\n');
if (pluginEntries.length !== demoLock.plugin.entries) throw new Error('Bundled plugin ZIP entry count mismatch');

const releaseManifestPath = join(root, 'artifacts', 'aim-advanced-bundles-0.1.0.manifest.json');
const releaseManifestBytes = await readFile(releaseManifestPath);
const releaseManifestHash = createHash('sha256').update(releaseManifestBytes).digest('hex');
if (releaseManifestHash !== demoLock.plugin.manifestSha256) throw new Error('Release manifest hash mismatch');
const releaseManifest = JSON.parse(releaseManifestBytes.toString('utf8'));
const regularEntries = pluginEntries.filter((entry) => !entry.endsWith('/')).sort();
const declaredEntries = releaseManifest.files.map((entry) => entry.path).sort();
if (JSON.stringify(regularEntries) !== JSON.stringify(declaredEntries)) throw new Error('Release manifest inventory mismatch');
for (const entry of releaseManifest.files) {
  const direct = spawnSync('/usr/bin/unzip', ['-p', pluginSourcePath, entry.path], { maxBuffer: 10 * 1024 * 1024 });
  if (direct.status !== 0) throw new Error(`Missing plugin entry: ${entry.path}`);
  const hash = createHash('sha256').update(direct.stdout).digest('hex');
  if (hash !== entry.sha256 || direct.stdout.length !== entry.size) throw new Error(`Plugin entry mismatch: ${entry.path}`);
}

const wooBytes = spawnSync('/usr/bin/unzip', ['-p', bundle, `plugins/${demoLock.woocommerce.filename}`], { maxBuffer: 30 * 1024 * 1024 });
if (wooBytes.status !== 0) throw new Error('Blueprint bundle has no pinned WooCommerce ZIP');
const wooHash = createHash('sha256').update(wooBytes.stdout).digest('hex');
if (wooHash !== demoLock.woocommerce.sha256 || wooBytes.stdout.length !== demoLock.woocommerce.size) throw new Error('Bundled WooCommerce bytes mismatch');
const wooSourcePath = join(root, 'blueprints', 'advanced-bundles', 'plugins', demoLock.woocommerce.filename);
const wooInventory = spawnSync('/usr/bin/unzip', ['-Z1', wooSourcePath], { maxBuffer: 30 * 1024 * 1024 });
if (wooInventory.status !== 0) throw new Error('Bundled WooCommerce ZIP inventory could not be read');
if (wooInventory.stdout.toString('utf8').trim().split('\n').length !== demoLock.woocommerce.entries) throw new Error('Bundled WooCommerce entry count mismatch');

async function filesWithin(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesWithin(path));
    if (entry.isFile() && entry.name !== 'selection.json') files.push(path);
  }
  return files;
}

const runtimeFiles = (await filesWithin(runtimeRoot)).sort();
const runtimeInventory = [];
let runtimeSize = 0;
for (const path of runtimeFiles) {
  const bytes = await readFile(path);
  runtimeSize += bytes.length;
  runtimeInventory.push(`${path.slice(runtimeRoot.length + 1).replaceAll('\\', '/')}\t${bytes.length}\t${createHash('sha256').update(bytes).digest('hex')}\n`);
}
const runtimeInventoryHash = createHash('sha256').update(runtimeInventory.join('')).digest('hex');
if (runtimeFiles.length !== runtimeLock.selection.fileCount || runtimeSize !== runtimeLock.selection.size || runtimeInventoryHash !== runtimeLock.selection.inventorySha256) {
  throw new Error('Pinned Playground runtime selection mismatch');
}
for (const path of ['remote.html', 'sw.js', 'assets/php_8_3-BZacpG4Q.wasm', 'assets/php_8_3-DYLSAelO.wasm', 'assets/wp-6.9.tar-YWSiU8TP.zst']) {
  if (!(await stat(join(runtimeRoot, path))).isFile()) throw new Error(`Pinned Playground runtime file missing: ${path}`);
}

console.log(`Verified ${manifest.files.length} built files, Blueprint ZIP, release manifest, exact Free plugin entries, WooCommerce bytes, and ${runtimeFiles.length} pinned runtime files.`);
