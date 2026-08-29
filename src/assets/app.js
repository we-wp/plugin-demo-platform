const registryUrl = '/data/plugins.json';
const loopbackHosts = new Set(['127.0.0.1', 'localhost', '::1']);
const demoState = {
  client: null,
  generation: 0,
  plugin: null,
  proof: null
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

async function loadRegistry() {
  const response = await fetch(registryUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Catalogue request failed with ${response.status}`);
  return response.json();
}

function pluginIcon(slug) {
  if (slug === 'advanced-bundles') {
    return '<svg aria-hidden="true" viewBox="0 0 48 48"><path d="M10 14h28v8H10zM10 26h18v8H10z"/><path d="M32 26h6v8h-6z"/></svg>';
  }
  return '<svg aria-hidden="true" viewBox="0 0 48 48"><path d="M13 8h22v32H13zM18 16h12M18 22h12M18 28h8"/></svg>';
}

function renderCatalogue(registry) {
  const target = document.querySelector('#catalogue-list');
  if (!target) return;
  if (!Array.isArray(registry.plugins) || registry.plugins.length === 0) {
    target.innerHTML = '<p class="empty-state">No plugin demos are listed yet.</p>';
    return;
  }

  target.innerHTML = registry.plugins.map((plugin) => {
    const ready = plugin.runtime?.ready === true && plugin.demoPath;
    const actions = [];
    if (ready) actions.push(`<a class="button button-secondary" href="${escapeHtml(plugin.demoPath)}">Try interactive demo</a>`);
    if (plugin.productPath) actions.push(`<a class="text-link" href="${escapeHtml(plugin.productPath)}" target="_blank" rel="noopener noreferrer">Product details</a>`);
    if (plugin.downloadUrl) actions.push(`<a class="text-link" href="${escapeHtml(plugin.downloadUrl)}" target="_blank" rel="noopener noreferrer">Download Free ZIP</a>`);
    if (plugin.releaseUrl) actions.push(`<a class="text-link" href="${escapeHtml(plugin.releaseUrl)}" target="_blank" rel="noopener noreferrer">Release notes</a>`);
    if (plugin.sourceUrl) actions.push(`<a class="text-link" href="${escapeHtml(plugin.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source</a>`);
    const action = actions.length > 0 ? actions.join('') : '<span class="coming-label">Coming soon</span>';

    return `
      <article class="catalogue-item${ready ? ' is-ready' : ' is-coming'}">
        <div class="catalogue-icon">${pluginIcon(plugin.slug)}</div>
        <div class="catalogue-copy">
          <p>${ready ? 'Interactive demo ready' : 'In development'}</p>
          <h3>${escapeHtml(plugin.name)}</h3>
          <span>${escapeHtml(plugin.summary)}</span>
        </div>
        <div class="catalogue-action">${action}</div>
      </article>`;
  }).join('');
}

function setupTour(plugin) {
  const shell = document.querySelector('[data-demo-shell]');
  if (!shell || !plugin?.screenshots?.length) return;

  const tabs = [...shell.querySelectorAll('[role="tab"]')];
  const image = shell.querySelector('[data-tour-image]');
  const imageLink = shell.querySelector('[data-tour-image-link]');
  const label = shell.querySelector('[data-tour-label]');
  const description = shell.querySelector('[data-tour-description]');
  const panel = shell.querySelector('[role="tabpanel"]');

  function select(id, moveFocus = false) {
    const selected = plugin.screenshots.find((item) => item.id === id) ?? plugin.screenshots[0];
    tabs.forEach((tab) => {
      const active = tab.dataset.tourId === selected.id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    const activeTab = tabs.find((tab) => tab.dataset.tourId === selected.id);
    image.classList.add('is-switching');
    window.setTimeout(() => {
      image.src = selected.path;
      image.alt = `${plugin.shortName}: ${selected.description}`;
      imageLink.href = selected.path;
      imageLink.setAttribute('aria-label', `Open full-size ${selected.label} screenshot`);
      label.textContent = selected.label;
      description.textContent = selected.description;
      panel.setAttribute('aria-labelledby', activeTab.id);
      image.classList.remove('is-switching');
    }, 110);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.tourId));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[nextIndex].dataset.tourId, true);
    });
  });

  shell.querySelector('[data-tour-reset]')?.addEventListener('click', () => select(plugin.screenshots[0].id, true));
}

function setRuntimeState(state, message) {
  const shell = document.querySelector('[data-demo-shell]');
  const start = document.querySelector('[data-demo-start]');
  const tour = document.querySelector('[data-tour-workspace]');
  const runtime = document.querySelector('[data-runtime-panel]');
  const loading = document.querySelector('[data-runtime-loading]');
  const error = document.querySelector('[data-runtime-error]');
  const controls = document.querySelector('[data-runtime-controls]');
  const routeGuide = document.querySelector('[data-runtime-route-guide]');
  const frameHost = document.querySelector('[data-runtime-frame-host]');
  const toolbarState = document.querySelector('[data-toolbar-runtime-state]');

  shell.dataset.runtimeState = state;
  start.disabled = state === 'loading' || state === 'ready';
  start.textContent = state === 'loading' ? 'Starting temporary store' : state === 'ready' ? 'Demo running' : 'Start interactive demo';
  tour.hidden = state !== 'tour';
  runtime.hidden = state === 'tour';
  loading.hidden = state !== 'loading';
  error.hidden = state !== 'error';
  controls.hidden = state !== 'ready';
  routeGuide.hidden = state !== 'ready';
  frameHost.hidden = state !== 'ready';
  document.querySelectorAll('[data-runtime-status]').forEach((status) => { status.textContent = message; });
  toolbarState.textContent = state === 'ready' ? 'Isolated store ready' : state === 'loading' ? 'Preparing temporary store' : state === 'error' ? 'Demo could not start' : 'Screenshot tour';
}

function setRouteGuide(state, title, message) {
  const guide = document.querySelector('[data-runtime-route-guide]');
  if (!guide) return;
  guide.dataset.state = state;
  if (!['loaded', 'preserved'].includes(state)) delete guide.dataset.cartAction;
  guide.querySelector('[data-runtime-route-title]').textContent = title;
  guide.querySelector('[data-runtime-route-message]').textContent = message;
}

function setRouteControlsDisabled(disabled) {
  document.querySelectorAll('[data-demo-route], [data-runtime-reset]').forEach((control) => {
    control.disabled = disabled;
  });
}

function setSelectedRoute(selectedButton) {
  document.querySelectorAll('[data-demo-route]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button === selectedButton));
  });
}

function createRequestId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function readExampleRouteResult(client, requestId) {
  const optionName = `we_wp_demo_route_${requestId}`;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await client.run({
      code: `<?php
require_once '/wordpress/wp-load.php';
$result = get_option( ${JSON.stringify(optionName)}, null );
if ( is_array( $result ) && isset( $result['actualRoute'] ) ) {
    delete_option( ${JSON.stringify(optionName)} );
}
echo wp_json_encode( $result );`
    });
    const result = JSON.parse(response.text.trim() || 'null');
    if (result?.actualRoute) return result;
    await new Promise((resolve) => window.setTimeout(resolve, 200));
  }
  throw new Error('Demo route verification timed out. Your cart was not changed again.');
}

function verifyExampleRouteResult(result, requestedRoute, requestId) {
  if (!result || result.requestId !== requestId || result.requestedRoute !== requestedRoute) {
    throw new Error('Demo route verification returned the wrong request. Retry or reset the store.');
  }
  if (result.state === 'error') {
    throw new Error(result.message || 'Example cart could not be prepared. Retry or reset the store.');
  }
  if (result.actualRoute !== requestedRoute || result.cartEmpty === true || result.cartItemCount < 1) {
    throw new Error(`${requestedRoute === 'checkout' ? 'Checkout' : 'Cart'} did not open with a usable cart. Retry or reset the store.`);
  }
  if (result.state === 'loaded' && (
    result.cartItemCount !== 3
    || result.bundleGroups !== 1
    || result.bundleQuantity !== 1
    || result.componentLines !== 2
    || result.componentQuantity !== 3
    || result.componentTotalMinor !== 3250
  )) {
    throw new Error('Example bundle verification failed. Reset the temporary store before retrying.');
  }
  if (!['loaded', 'preserved'].includes(result.state)) {
    throw new Error('Demo route returned an unknown cart state. Retry or reset the store.');
  }
}

async function openExampleRoute(button, requestedRoute) {
  const requestId = createRequestId();
  const label = requestedRoute === 'checkout' ? 'checkout' : 'cart';
  const toolbarState = document.querySelector('[data-toolbar-runtime-state]');
  setRouteControlsDisabled(true);
  setRouteGuide('loading', `Preparing ${label}.`, 'Checking your temporary cart before opening this step.');
  toolbarState.textContent = `Preparing ${label}`;

  try {
    const actionUrl = `/?we_wp_demo_example=${requestedRoute}&we_wp_demo_request=${requestId}`;
    await demoState.client.goTo(actionUrl);
    const result = await readExampleRouteResult(demoState.client, requestId);
    verifyExampleRouteResult(result, requestedRoute, requestId);
    setSelectedRoute(button);
    toolbarState.textContent = 'Interactive store ready';

    if (result.state === 'loaded') {
      setRouteGuide(
        'loaded',
        'Example cart loaded.',
        `Showing ${label} with one fixed bundle, two component lines, and a EUR 32.50 component total.`
      );
    } else {
      setRouteGuide(
        'preserved',
        'Existing demo cart kept.',
        `Showing ${label} without adding, removing, or replacing your current items.`
      );
    }
    document.querySelector('[data-runtime-route-guide]').dataset.cartAction = result.state;
    document.querySelector('.runtime-frame')?.focus();
  } catch (error) {
    toolbarState.textContent = 'Demo route unavailable';
    setRouteGuide(
      'error',
      `Could not open ${label}.`,
      error instanceof Error ? error.message : 'Retry this step or reset the store.'
    );
  } finally {
    setRouteControlsDisabled(false);
  }
}

function createRuntimeFrame() {
  const host = document.querySelector('[data-runtime-frame-host]');
  host.replaceChildren();
  const iframe = document.createElement('iframe');
  iframe.className = 'runtime-frame';
  iframe.title = 'Interactive Advanced Bundles WooCommerce demo';
  host.append(iframe);
  return iframe;
}

function withTimeout(promise, milliseconds) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error('Demo startup exceeded two minutes.')), milliseconds);
    })
  ]).finally(() => window.clearTimeout(timer));
}

async function verifyRuntime(client, expectCleanReset) {
  const response = await client.run({
    code: `<?php
require_once '/wordpress/wp-load.php';
$http = wp_remote_get( 'https://example.com/we-wp-demo-probe' );
$bundle = get_page_by_path( 'workshop-starter-bundle', OBJECT, 'product' );
$result = array(
  'wordpress' => get_bloginfo( 'version' ),
  'woocommerce' => defined( 'WC_VERSION' ) ? WC_VERSION : null,
  'plugin' => class_exists( 'AIMPlugins\\\\AdvancedBundles\\\\WooCommerce\\\\AimBundleProduct' ),
  'bundleId' => $bundle instanceof WP_Post ? (int) $bundle->ID : 0,
  'products' => (int) wp_count_posts( 'product' )->publish,
  'httpBlocked' => is_wp_error( $http ) && 'we_wp_demo_network_blocked' === $http->get_error_code(),
  'mailBlocked' => false === wp_mail( 'demo@example.invalid', 'Demo probe', 'Blocked' ),
  'uploadLimit' => (int) wp_max_upload_size(),
  'resetProbe' => get_option( 'we_wp_demo_reset_probe', false ),
);
echo wp_json_encode( $result );`
  });
  const result = JSON.parse(response.text.trim());
  const valid = result.wordpress.startsWith('6.9')
    && result.woocommerce === '11.0.1'
    && result.plugin === true
    && result.bundleId > 0
    && result.products === 3
    && result.httpBlocked === true
    && result.mailBlocked === true
    && result.uploadLimit === 2 * 1024 * 1024
    && (!expectCleanReset || result.resetProbe === false);
  if (!valid) throw new Error('Runtime safety or fixture verification failed.');

  const page = await client.request({ url: '/product/workshop-starter-bundle/' });
  if (page.httpStatusCode !== 200 || !page.text.includes('Included in this bundle')) {
    throw new Error('Synthetic bundle product page verification failed.');
  }
  return result;
}

async function startInteractiveDemo({ expectCleanReset = false } = {}) {
  const generation = ++demoState.generation;
  demoState.client = null;
  demoState.proof = null;
  setRuntimeState('loading', expectCleanReset ? 'Resetting to a fresh temporary store.' : 'Loading WordPress, WooCommerce, and the verified Free package.');

  try {
    if (loopbackHosts.has(window.location.hostname) && new URLSearchParams(window.location.search).get('demo-runtime') === 'fail') {
      throw new Error('Local failure test requested.');
    }
    const { resolveRemoteBlueprint, startPlaygroundWeb } = await import('/client/index.js');
    const iframe = createRuntimeFrame();
    const resolvedBundle = await resolveRemoteBlueprint(demoState.plugin.runtime.blueprintBundlePath);
    const client = await withTimeout(startPlaygroundWeb({
      iframe,
      remoteUrl: new URL('/remote.html', window.location.origin).href,
      blueprint: resolvedBundle,
      detailedProgressCaptions: true,
      onBlueprintStepCompleted: () => {
        document.querySelector('[data-runtime-status]').textContent = 'Installing WooCommerce, Advanced Bundles, and synthetic products.';
      }
    }), 120000);

    const proof = await verifyRuntime(client, expectCleanReset);
    if (generation !== demoState.generation) return;
    demoState.client = client;
    demoState.proof = proof;
    setRuntimeState('ready', `Temporary store ready. WordPress ${proof.wordpress}, WooCommerce ${proof.woocommerce}, Advanced Bundles Free 0.1.0.`);
    await client.goTo('/product/workshop-starter-bundle/');
    setSelectedRoute(document.querySelector('[data-demo-route="/product/workshop-starter-bundle/"]'));
    setRouteGuide('idle', 'Try the full order flow.', 'Cart and Checkout load one example bundle only when your demo cart is empty.');
  } catch (error) {
    if (generation !== demoState.generation) return;
    console.error(error);
    setRuntimeState('error', error instanceof Error ? error.message : 'Demo could not start.');
  }
}

async function resetInteractiveDemo() {
  if (demoState.client) {
    await demoState.client.run({
      code: "<?php require_once '/wordpress/wp-load.php'; update_option( 'we_wp_demo_reset_probe', 'present' );"
    });
  }
  await startInteractiveDemo({ expectCleanReset: true });
}

function setupInteractiveDemo(plugin) {
  demoState.plugin = plugin;
  const packageActions = document.querySelector('[data-plugin-actions]');
  if (packageActions) {
    packageActions.innerHTML = `
      <a class="button button-secondary" href="${escapeHtml(plugin.productPath)}" target="_blank" rel="noopener noreferrer">Product details</a>
      <a class="button button-primary" href="${escapeHtml(plugin.downloadUrl)}" target="_blank" rel="noopener noreferrer">Download Free ZIP</a>
      <a class="button button-secondary" href="${escapeHtml(plugin.releaseUrl)}" target="_blank" rel="noopener noreferrer">Release notes</a>
      <a class="button button-secondary" href="${escapeHtml(plugin.sourceUrl)}" target="_blank" rel="noopener noreferrer">View source on GitHub</a>`;
  }
  document.querySelector('[data-demo-start]')?.addEventListener('click', () => startInteractiveDemo());
  document.querySelector('[data-runtime-retry]')?.addEventListener('click', () => startInteractiveDemo());
  document.querySelector('[data-runtime-reset]')?.addEventListener('click', () => resetInteractiveDemo());
  document.querySelectorAll('[data-demo-route]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (!demoState.client) return;
      if (button.dataset.demoRoute === '/cart/' || button.dataset.demoRoute === '/checkout/') {
        const requestedRoute = button.dataset.demoRoute === '/checkout/' ? 'checkout' : 'cart';
        await openExampleRoute(button, requestedRoute);
        return;
      }
      const toolbarState = document.querySelector('[data-toolbar-runtime-state]');
      const route = button.dataset.demoRoute === 'editor'
        ? `/wp-admin/post.php?post=${demoState.proof.bundleId}&action=edit`
        : button.dataset.demoRoute;
      try {
        toolbarState.textContent = `Opening ${button.textContent.trim().toLowerCase()}`;
        const routeProbe = await demoState.client.request({ url: route });
        if (routeProbe.httpStatusCode < 200 || routeProbe.httpStatusCode > 399) {
          throw new Error(`Demo page returned ${routeProbe.httpStatusCode}.`);
        }
        const expectedMarker = button.dataset.demoRoute === 'editor' ? 'Bundle components' : 'Included in this bundle';
        if (!routeProbe.text.includes(expectedMarker)) {
          throw new Error(`${button.textContent.trim()} verification failed.`);
        }
        await demoState.client.goTo(route);
        setSelectedRoute(button);
        toolbarState.textContent = 'Interactive store ready';
        setRouteGuide(
          'idle',
          button.dataset.demoRoute === 'editor' ? 'Review the fixed recipe.' : 'Review the storefront bundle.',
          button.dataset.demoRoute === 'editor'
            ? 'Change products or quantities, then use Cart or Checkout to inspect your current demo cart.'
            : 'Add the bundle manually, or use Cart or Checkout to load the example only when the cart is empty.'
        );
        document.querySelector('.runtime-frame')?.focus();
      } catch (error) {
        toolbarState.textContent = error instanceof Error ? error.message : 'Demo page could not open.';
        setRouteGuide('error', 'Demo page could not open.', 'Retry this step or reset the store.');
      }
    });
  });
}

async function boot() {
  try {
    const registry = await loadRegistry();
    if (document.body.dataset.page === 'hub') renderCatalogue(registry);
    if (document.body.dataset.page === 'advanced-bundles') {
      const plugin = registry.plugins.find((item) => item.slug === 'advanced-bundles');
      setupTour(plugin);
      setupInteractiveDemo(plugin);
    }
  } catch (error) {
    const target = document.querySelector('#catalogue-list');
    if (target) {
      target.innerHTML = `<div class="error-state"><strong>Plugin catalogue could not load.</strong><span>${escapeHtml(error.message)}. Reload this page to try again.</span></div>`;
    }
  }
}

boot();
