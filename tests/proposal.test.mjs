import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { loadPlaygroundClient, resolveDemoBlueprint } from '../src/assets/blueprint-resolver.js';
import { prepareServiceWorker, releaseFingerprint, weWpRuntimeMime } from '../scripts/service-worker-release.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const registry = JSON.parse(await readFile(join(root, 'registry', 'plugins.json'), 'utf8'));
const blueprint = JSON.parse(await readFile(join(root, 'blueprints', 'advanced-bundles', 'blueprint.json'), 'utf8'));
const lock = JSON.parse(await readFile(join(root, 'blueprints', 'advanced-bundles', 'demo.lock.json'), 'utf8'));
const runtimeLock = JSON.parse(await readFile(join(root, 'blueprints', 'runtime.lock.json'), 'utf8'));
const runtimeSelection = JSON.parse(await readFile(join(root, 'runtime', 'playground', 'selection.json'), 'utf8'));
const pluginPath = join(root, 'blueprints', 'advanced-bundles', 'plugins', lock.plugin.filename);

test('catalogue has one interactive demo and linkless Advanced Invoices', () => {
  assert.equal(registry.plugins.length, 2);
  const bundles = registry.plugins.find((plugin) => plugin.slug === 'advanced-bundles');
  const invoices = registry.plugins.find((plugin) => plugin.slug === 'advanced-invoices');
  assert.equal(bundles.runtime.ready, true);
  assert.equal(bundles.artifact.sha256, lock.plugin.sha256);
  assert.equal(bundles.productPath, 'https://we-wp.com/plugins/advanced-bundles-for-woocommerce');
  assert.equal(bundles.sourceUrl, 'https://github.com/we-wp/advanced-bundles-for-woocommerce');
  assert.equal(bundles.downloadUrl, 'https://github.com/we-wp/advanced-bundles-for-woocommerce/releases/download/v0.1.0/aim-advanced-bundles-0.1.0.zip');
  assert.equal(bundles.releaseUrl, 'https://github.com/we-wp/advanced-bundles-for-woocommerce/releases/tag/v0.1.0');
  assert.equal(invoices.status, 'coming-soon');
  for (const field of ['demoPath', 'productPath', 'sourceUrl', 'downloadUrl', 'releaseUrl']) assert.equal(invoices[field], null);
});

test('exact Free ZIP is mechanically preserved', async () => {
  const bytes = await readFile(pluginPath);
  assert.equal(bytes.length, 55745);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), 'cfd0f4cba21842d7216f1565bfe4ae874de29abf9a081d1620229e37b38ee2d4');
  const inventory = spawnSync('/usr/bin/unzip', ['-Z1', pluginPath], { encoding: 'utf8' });
  assert.equal(inventory.status, 0);
  assert.equal(inventory.stdout.trim().split('\n').length, 44);
});

test('Blueprint is isolated and uses only bundled packages', () => {
  assert.equal(blueprint.features.networking, false);
  assert.equal(blueprint.preferredVersions.php, lock.php);
  assert.equal(blueprint.preferredVersions.wp, lock.wordpress);
  const text = JSON.stringify(blueprint);
  assert.match(text, /aim-advanced-bundles-0\.1\.0\.zip/);
  assert.match(text, /woocommerce-11\.0\.1\.zip/);
  assert.doesNotMatch(text, /wordpress\.org\/plugins|"resource":"url"/);
  assert.match(text, /WP_HTTP_BLOCK_EXTERNAL/);
});

test('demo guard blocks delivery and destructive capabilities', async () => {
  const guard = await readFile(join(root, 'blueprints', 'advanced-bundles', 'mu-plugins', 'demo-guard.php'), 'utf8');
  for (const required of ['pre_http_request', 'pre_wp_mail', 'woocommerce_available_payment_gateways', 'install_plugins', 'upload_size_limit', 'Content-Security-Policy', 'woocommerce_feature_order_attribution_enabled', 'pre_option_show_avatars', 'print_emoji_detection_script']) {
    assert.match(guard, new RegExp(required));
  }
  const seed = await readFile(join(root, 'blueprints', 'advanced-bundles', 'fixtures', 'seed.php'), 'utf8');
  assert.match(seed, /woocommerce_feature_order_attribution_enabled', 'no'/);
});

test('demo guard removes Playground cross-document transitions before rendering', async () => {
  const guard = await readFile(join(root, 'blueprints', 'advanced-bundles', 'mu-plugins', 'demo-guard.php'), 'utf8');
  assert.match(guard, /add_action\(\s*'muplugins_loaded'/);
  for (const hook of ['wp_head', 'admin_print_styles', 'login_head']) {
    assert.match(guard, new RegExp(`remove_action\\( '${hook}', 'playground_enable_view_transitions', 0 \\)`));
  }
  assert.doesNotMatch(guard, /unhandledrejection|console\.|AbortError|Transition was skipped/);
});

test('pinned self-hosted runtime selection is imported and ready', async () => {
  assert.equal(runtimeLock.state, 'imported-and-verified');
  assert.equal(runtimeLock.source.headSha, 'f29eca6c6f63f65e9176ce9072b2a34c9ed7d864');
  assert.equal(runtimeLock.source.artifactId, 9686769924);
  assert.equal(runtimeSelection.archive.sha256, '93d4d5f1e8de89869b8b5f020a65d738b51b21f8812b29aab702c122cd2a469c');
  assert.equal(runtimeSelection.inventorySha256, runtimeLock.selection.inventorySha256);
  assert.equal(runtimeSelection.fileCount, runtimeLock.selection.fileCount);
  assert.equal(runtimeSelection.size, runtimeLock.selection.size);
  assert.equal(Object.values(runtimeLock.verification).every(Boolean), true);
  for (const path of [
    'remote.html',
    'sw.js',
    'client/index.js',
    'assets/php_8_3-BZacpG4Q.wasm',
    'assets/php_8_3-DYLSAelO.wasm',
    'assets/wp-6.9.tar-YWSiU8TP.zst',
    'wp-6.9/wordpress-static.zip'
  ]) {
    assert.equal((await stat(join(root, 'runtime', 'playground', path))).isFile(), true, path);
  }
  const ready = JSON.parse(await readFile(join(root, 'src', 'health', 'ready.json'), 'utf8'));
  assert.equal(ready.interactiveRuntime, true);
  assert.equal(ready.httpStatus, 200);
});

test('release worker refreshes first-party shell without changing pinned runtime source', async () => {
  const upstream = await readFile(join(root, 'runtime', 'playground', 'sw.js'), 'utf8');
  const upstreamRuntimeWorker = await readFile(join(root, 'runtime', 'playground', 'playground-worker-endpoint-blueprints-Cefw2Oy_.js'), 'utf8');
  const first = releaseFingerprint([{ path: 'src/index.html', bytes: Buffer.from('first') }]);
  const second = releaseFingerprint([{ path: 'src/index.html', bytes: Buffer.from('second') }]);
  assert.notEqual(first, second);

  const prepared = prepareServiceWorker(upstream, upstreamRuntimeWorker, first);
  assert.notEqual(prepared.serviceWorker, upstream);
  assert.notEqual(prepared.runtimeWorker, upstreamRuntimeWorker);
  assert.match(prepared.serviceWorker, new RegExp(`-we-wp-${first}`));
  assert.match(prepared.runtimeWorker, new RegExp(`-we-wp-${first}`));
  assert.match(prepared.serviceWorker, /Gr="playground-cache"/);
  assert.match(prepared.runtimeWorker, /CACHE_NAME_PREFIX="playground-cache"/);
  for (const route of ['/plugins/', '/data/', '/demo-assets/', '/health/', '/assets/app.js', '/assets/blueprint-resolver.js', '/assets/app.css']) {
    assert.match(prepared.serviceWorker, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(prepared.serviceWorker, /weWpShellRequest\(e\.request\)/);
  assert.match(prepared.serviceWorker, /n\.pathname\.startsWith\("\/client\/index\.js"\)/);
  assert.match(prepared.serviceWorker, /function weWpRuntimeMime\(response, requestUrl\)/);
  assert.match(prepared.serviceWorker, /kc\(e,a\)\.then\(o=>weWpRuntimeMime\(o,e\.request\.url\)\)\.then\(o=>Pr\(o,a\)\)/);
  assert.equal(upstream.split('kc(e,a).then(o=>Pr(o,a))').length - 1, 1);
  assert.doesNotMatch(prepared.serviceWorker, /kc\(e,a\)\.then\(o=>Pr\(o,a\)\)/);
  assert.doesNotMatch(prepared.serviceWorker, new RegExp(`const Ks="${prepared.upstreamKey}",`));
  assert.doesNotMatch(prepared.runtimeWorker, new RegExp(`buildVersion="${prepared.upstreamKey}",`));
  assert.match(upstream, /match\(e,\{ignoreSearch:!0\}\)/);
  assert.doesNotMatch(upstream, /weWpShellRequest|we-wp-/);
  assert.doesNotMatch(upstreamRuntimeWorker, /we-wp-/);
  assert.throws(
    () => prepareServiceWorker(upstream, upstreamRuntimeWorker.replace(/buildVersion="[a-f0-9]{40}"/, 'buildVersion="missing"'), first),
    /Expected one pinned Playground runtime-worker cache identity, found 0/
  );
});

test('runtime MIME policy changes only missing or generic static responses', async () => {
  const correct = new Response('window.ok = true;', {
    headers: { 'content-type': 'text/javascript', 'x-proof': 'kept' }
  });
  assert.equal(weWpRuntimeMime(correct, 'https://demo.test/scope:1/script.js'), correct);

  const generic = new Response('window.ok = true;', {
    status: 206,
    statusText: 'Partial Content',
    headers: { 'content-type': 'application/octet-stream', 'x-proof': 'kept' }
  });
  const corrected = weWpRuntimeMime(generic, 'https://demo.test/scope:1/wp-includes/script.js?ver=1');
  assert.notEqual(corrected, generic);
  assert.equal(corrected.status, 206);
  assert.equal(corrected.statusText, 'Partial Content');
  assert.equal(corrected.headers.get('content-type'), 'application/javascript');
  assert.equal(corrected.headers.get('x-proof'), 'kept');
  assert.equal(await corrected.text(), 'window.ok = true;');

  const missing = new Response(new TextEncoder().encode('body {}'));
  assert.equal(weWpRuntimeMime(missing, 'https://demo.test/scope:1/theme.css').headers.get('content-type'), 'text/css');
  const unknown = new Response('opaque', { headers: { 'content-type': 'application/octet-stream' } });
  assert.equal(weWpRuntimeMime(unknown, 'https://demo.test/scope:1/file.bin'), unknown);
});

test('MIME policy changes rotate the release worker cache', async () => {
  const mimePath = 'deploy/nginx/static-mime-types.conf';
  const mimeBytes = await readFile(join(root, mimePath));
  const current = releaseFingerprint([{ path: mimePath, bytes: mimeBytes }]);
  const changed = releaseFingerprint([{ path: mimePath, bytes: Buffer.concat([mimeBytes, Buffer.from('\n# changed\n')]) }]);
  assert.notEqual(current, changed);

  const build = await readFile(join(root, 'scripts', 'build.mjs'), 'utf8');
  assert.match(build, /path: 'deploy\/nginx\/static-mime-types\.conf'/);
  assert.match(build, /readFile\(join\(root, 'deploy', 'nginx', 'static-mime-types\.conf'\)\)/);
});

test('redistributed PHP, font, and synthetic fixtures have pinned provenance', async () => {
  const expectedHashes = new Map([
    ['LICENSES/PHP-3.01.txt', 'b42e4df5e50e6ecda1047d503d6d91d71032d09ed1027ba1ef29eed26f890c5a'],
    ['src/assets/fonts/geist.woff2', '19f9c92546aa300c312235e3125af1b81394d8db9a4bc4a425cd5b641d2d54e1'],
    ['blueprints/advanced-bundles/fixtures/images/bundle.png', 'aacadbe315c6b5c2565ec4a1817a56244938a4dd6b99903c20dc030211347053'],
    ['blueprints/advanced-bundles/fixtures/images/case.png', 'c2c935434c7e6cee3fe9c692b779c8b1125f6232c613af9f1bd1a75380f98610'],
    ['blueprints/advanced-bundles/fixtures/images/guides.png', '77f85d6c8ad89bbaed10cd84a1c6a7cbdf8cdc1a5b4e7c509133d3c557e92158']
  ]);
  for (const [path, expected] of expectedHashes) {
    const bytes = await readFile(join(root, path));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), expected, path);
  }
  const notices = await readFile(join(root, 'THIRD_PARTY_NOTICES.md'), 'utf8');
  assert.match(notices, /php-src\/tree\/php-8\.3\.32/);
  assert.match(notices, /@fontsource-variable\/geist` version `5\.3\.0/);
  assert.equal(runtimeLock.selection.conservativeSupportAssets.offlineManifestUnlistedFiles, 89);
  assert.equal(runtimeLock.selection.conservativeSupportAssets.nonPhp83WrapperFiles, 14);
});

test('interactive shell has reset, failure, and runtime safety verification states', async () => {
  const app = await readFile(join(root, 'src', 'assets', 'app.js'), 'utf8');
  const page = await readFile(join(root, 'src', 'plugins', 'advanced-bundles', 'index.html'), 'utf8');
  const installerUrl = 'https://github.com/we-wp/advanced-bundles-for-woocommerce/releases/download/v0.1.0/aim-advanced-bundles-0.1.0.zip';
  for (const required of ['startPlaygroundWeb', 'resetInteractiveDemo', 'we_wp_demo_reset_probe', 'we_wp_demo_network_blocked', 'demo-runtime', 'Runtime safety or fixture verification failed']) {
    assert.match(app, new RegExp(required));
  }
  for (const required of [
    'resolveDemoBlueprint',
    'Retrying bundled demo data once.',
    "'/assets/blueprint-resolver.js?v=3'",
    'runId: generation'
  ]) {
    assert.match(app, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(app, /new URL\('\/remote\.html', window\.location\.origin\)/);
  assert.doesNotMatch(app, /playground\.wordpress\.net/);
  assert.match(app, /plugin\.downloadUrl/);
  assert.match(app, /plugin\.releaseUrl/);
  assert.match(app, /plugin\.sourceUrl/);
  assert.match(app, /plugin\.productPath/);
  assert.match(app, /target="_blank" rel="noopener noreferrer"/);
  assert.match(app, /data-tour-image-link/);
  const startControls = page.match(/<button[^>]*data-demo-start[^>]*>Start live WooCommerce demo<\/button>/g) ?? [];
  assert.equal(startControls.length, 2);
  for (const control of startControls) {
    assert.match(control, /aria-controls="demo-runtime-panel"/);
    assert.match(control, /aria-describedby="runtime-note"/);
    assert.match(control, /aria-expanded="false"/);
  }
  assert.match(page, /data-start-source="hero"/);
  assert.match(page, /id="demo-runtime-panel"[^>]*role="region"[^>]*aria-label="Live WooCommerce demo"[^>]*aria-busy="false"[^>]*tabindex="-1"/);
  assert.match(app, /document\.querySelectorAll\('\[data-demo-start\]'\)/);
  assert.match(app, /demoState\.startPromise/);
  assert.match(app, /scrollIntoView\(\{ behavior: reduceMotion \? 'auto' : 'smooth', block: 'start' \}\)/);
  assert.match(app, /runtime\.focus\(\{ preventScroll: true \}\)/);
  for (const required of [
    'we_wp_demo_example',
    'we_wp_demo_request',
    'readExampleRouteResult',
    'verifyExampleRouteResult',
    'Example cart loaded.',
    'Existing demo cart kept.',
    'dataset.cartAction = result.state',
    'componentTotalMinor !== 3250'
  ]) {
    assert.match(app, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.equal(page.split(installerUrl).length - 1, 2);
  assert.doesNotMatch(app, /fetch\s*\(\s*plugin\.downloadUrl/);
  assert.doesNotMatch(app, /fetch\s*\(\s*['"`]https:\/\/github\.com\/we-wp\/advanced-bundles-for-woocommerce\/releases/);
  assert.match(page, /data-tour-image-link/);
  const sourceUrl = 'https://github.com/we-wp/advanced-bundles-for-woocommerce';
  assert.equal(page.split('Useful for your store? Star Advanced Bundles on GitHub.').length - 1, 1);
  assert.match(page, new RegExp(`data-runtime-star-prompt href="${sourceUrl}" target="_blank" rel="noopener noreferrer" hidden`));
  assert.match(app, /const showStarPrompt = \['loaded', 'preserved'\]\.includes\(state\);/);
  assert.match(app, /starPrompt\.hidden = !showStarPrompt;/);
  assert.match(page, /data-runtime-route-guide/);
  assert.match(page, /Cart and Checkout load one example bundle only when your demo cart is empty\./);
});

test('Blueprint resolver retries one transient bundled-file fetch with no-store credentials omitted', async () => {
  const fetchCalls = [];
  const waits = [];
  let retries = 0;
  const result = await resolveDemoBlueprint({
    resolveRemoteBlueprint: async (url, options) => {
      const response = await options.fetch(url, { credentials: 'include' });
      return response.text();
    },
    path: '/demo-assets/advanced-bundles-demo.zip',
    artifactSha256: lock.plugin.sha256,
    origin: 'https://demo.we-wp.com',
    fetchImpl: async (url, options) => {
      fetchCalls.push({ url, options });
      if (fetchCalls.length === 1) throw new TypeError('transient fetch failure');
      return new Response('resolved');
    },
    onRetry: () => { retries += 1; },
    wait: async (milliseconds) => { waits.push(milliseconds); }
  });

  assert.equal(result, 'resolved');
  assert.equal(fetchCalls.length, 2);
  assert.equal(retries, 1);
  assert.deepEqual(waits, [750]);
  assert.equal(fetchCalls[0].options.cache, 'no-store');
  assert.equal(fetchCalls[0].options.credentials, 'omit');
  assert.match(fetchCalls[0].url, /release=cfd0f4cba218/);
  assert.match(fetchCalls[1].url, /retry=1/);
});

test('Playground client loader retries one transient module fetch with a unique release URL', async () => {
  const importCalls = [];
  const waits = [];
  let retries = 0;
  const result = await loadPlaygroundClient({
    artifactSha256: lock.plugin.sha256,
    runId: 7,
    origin: 'https://demo.we-wp.com',
    importModule: async (url) => {
      importCalls.push(url);
      if (importCalls.length === 1) throw new TypeError('transient module fetch failure');
      return { startPlaygroundWeb: true };
    },
    onRetry: () => { retries += 1; },
    wait: async (milliseconds) => { waits.push(milliseconds); }
  });

  assert.deepEqual(result, { startPlaygroundWeb: true });
  assert.equal(importCalls.length, 2);
  assert.equal(retries, 1);
  assert.deepEqual(waits, [750]);
  assert.match(importCalls[0], /\/client\/index\.js\?release=cfd0f4cba218&run=7$/);
  assert.match(importCalls[1], /release=cfd0f4cba218&run=7&retry=1$/);
});

test('Playground client loader gives a visible retry fresh module URLs after both imports fail', async () => {
  const importCalls = [];
  const waits = [];
  const importModule = async (url) => {
    importCalls.push(url);
    if (importCalls.length < 4) throw new TypeError('transient module fetch failure');
    return { startPlaygroundWeb: true };
  };
  const options = {
    artifactSha256: lock.plugin.sha256,
    origin: 'https://demo.we-wp.com',
    importModule,
    wait: async (milliseconds) => { waits.push(milliseconds); }
  };

  await assert.rejects(loadPlaygroundClient({ ...options, runId: 7 }), TypeError);
  const result = await loadPlaygroundClient({ ...options, runId: 8 });

  assert.deepEqual(result, { startPlaygroundWeb: true });
  assert.equal(importCalls.length, 4);
  assert.equal(new Set(importCalls).size, 4);
  assert.deepEqual(waits, [750, 750]);
  assert.match(importCalls[0], /run=7$/);
  assert.match(importCalls[1], /run=7&retry=1$/);
  assert.match(importCalls[2], /run=8$/);
  assert.match(importCalls[3], /run=8&retry=1$/);
});

test('demo-only route helper preserves manual carts and verifies the populated destination', async () => {
  const guard = await readFile(join(root, 'blueprints', 'advanced-bundles', 'mu-plugins', 'demo-guard.php'), 'utf8');
  for (const required of [
    'we_wp_demo_example',
    'we_wp_demo_request',
    "'loaded'",
    "'preserved'",
    "'actualRoute'",
    "'cartEmpty'",
    "'bundleGroups'",
    "'componentLines'",
    "'componentTotalMinor'",
    '$cart->is_empty()',
    '$cart->add_to_cart',
    '$cart->empty_cart()',
    'PHP_INT_MAX'
  ]) {
    assert.match(guard, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('public shell has no Pro source, external script, or fancy dash characters', async () => {
  const files = await readdir(join(root, 'src'), { recursive: true });
  assert.equal(files.some((file) => /(^|[/\\])pro([/\\]|$)|-pro\./i.test(file)), false);
  for (const file of files.filter((name) => /\.(html|js|css)$/.test(name))) {
    const text = await readFile(join(root, 'src', file), 'utf8');
    assert.doesNotMatch(text, /[–—]/, `${file} contains a fancy dash`);
    if (file.endsWith('.html')) assert.doesNotMatch(text, /<(script|link)[^>]+https?:\/\//i);
  }
});

test('production Nginx header include preserves Playground isolation', async () => {
  const headers = await readFile(join(root, 'deploy', 'nginx', 'security-headers.conf'), 'utf8');
  for (const required of [
    "script-src 'self' 'wasm-unsafe-eval'",
    'Cross-Origin-Embedder-Policy "require-corp"',
    'Cross-Origin-Opener-Policy "same-origin"',
    'Cross-Origin-Resource-Policy "same-origin"',
    'X-Content-Type-Options "nosniff"',
    'X-Robots-Tag "noindex, nofollow"'
  ]) {
    assert.match(headers, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(headers, /https?:\/\//);
});

test('production Nginx MIME map covers every built file extension', async () => {
  const mimeTypes = await readFile(join(root, 'deploy', 'nginx', 'static-mime-types.conf'), 'utf8');
  const builtFiles = await readdir(join(root, 'dist'), { recursive: true });
  const builtFileNames = [];
  for (const file of builtFiles) {
    if ((await stat(join(root, 'dist', file))).isFile()) builtFileNames.push(file);
  }
  const builtExtensions = new Set(builtFileNames
    .map((file) => file.split(/[/\\]/).pop())
    .filter((file) => file.includes('.'))
    .map((file) => file.split('.').pop().toLowerCase()));

  for (const extension of builtExtensions) {
    assert.match(mimeTypes, new RegExp(`(?:^|\\s)${extension.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[;\\s])`, 'm'), `Missing Nginx MIME mapping for .${extension}`);
  }
  assert.match(mimeTypes, /application\/javascript\s+js;/);
  assert.match(mimeTypes, /text\/css\s+css;/);
  assert.match(mimeTypes, /font\/woff2\s+woff2;/);
  assert.match(mimeTypes, /application\/wasm\s+wasm;/);
});
