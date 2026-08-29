import { createHash } from 'node:crypto';

const cacheIdentityPattern = /const Ks="([a-f0-9]{40})",Gr="playground-cache"/g;
const runtimeCacheIdentityPattern = /buildVersion="([a-f0-9]{40})",CACHE_NAME_PREFIX="playground-cache"/g;
const networkFirstNeedle = 'if(n.pathname==="/remote.html"||n.pathname==="/api.html"||n.pathname==="/")';
const runtimeResponseNeedle = 'kc(e,a).then(o=>Pr(o,a))';
const runtimeResponseReplacement = 'kc(e,a).then(o=>weWpRuntimeMime(o,e.request.url)).then(o=>Pr(o,a))';
const policyVersion = 'we-wp-shell-network-first-v4';
const shellPolicy = 'function weWpShellRequest(e){const n=new URL(e.url);return n.pathname==="/index.html"||n.pathname==="/favicon.ico"||n.pathname==="/build-manifest.json"||n.pathname==="/assets/app.js"||n.pathname==="/assets/blueprint-resolver.js"||n.pathname==="/assets/app.css"||n.pathname.startsWith("/assets/fonts/")||n.pathname.startsWith("/assets/screenshots/")||n.pathname.startsWith("/data/")||n.pathname.startsWith("/demo-assets/")||n.pathname.startsWith("/health/")||n.pathname.startsWith("/plugins/")}';

export function weWpRuntimeMime(response, requestUrl) {
  const currentType = response.headers.get('content-type');
  if (currentType && !/^(?:application|binary)\/octet-stream(?:\s*;|$)/i.test(currentType)) return response;

  const pathname = new URL(requestUrl).pathname.toLowerCase();
  const extension = pathname.match(/\.([a-z0-9]+)$/)?.[1];
  const types = {
    css: 'text/css',
    eot: 'application/vnd.ms-fontobject',
    gif: 'image/gif',
    html: 'text/html',
    ico: 'image/vnd.microsoft.icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'application/javascript',
    json: 'application/json',
    mjs: 'application/javascript',
    png: 'image/png',
    svg: 'image/svg+xml',
    ttf: 'font/ttf',
    wasm: 'application/wasm',
    webp: 'image/webp',
    woff: 'font/woff',
    woff2: 'font/woff2',
    zip: 'application/zip',
    zst: 'application/zstd'
  };
  const correctedType = types[extension];
  if (!correctedType) return response;

  const headers = new Headers(response.headers);
  headers.set('content-type', correctedType);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

export function releaseFingerprint(entries) {
  const hash = createHash('sha256').update(`${policyVersion}\0`);
  for (const entry of [...entries].sort((left, right) => left.path.localeCompare(right.path))) {
    hash.update(entry.path).update('\0').update(entry.bytes).update('\0');
  }
  return hash.digest('hex').slice(0, 16);
}

export function prepareServiceWorker(upstreamSource, runtimeWorkerSource, fingerprint) {
  if (!/^[a-f0-9]{16}$/.test(fingerprint)) throw new Error('Service-worker release fingerprint must be 16 lowercase hex characters');

  const cacheMatches = [...upstreamSource.matchAll(cacheIdentityPattern)];
  if (cacheMatches.length !== 1) throw new Error(`Expected one pinned Playground service-worker cache identity, found ${cacheMatches.length}`);
  const runtimeCacheMatches = [...runtimeWorkerSource.matchAll(runtimeCacheIdentityPattern)];
  if (runtimeCacheMatches.length !== 1) throw new Error(`Expected one pinned Playground runtime-worker cache identity, found ${runtimeCacheMatches.length}`);
  if (cacheMatches[0][1] !== runtimeCacheMatches[0][1]) throw new Error('Pinned Playground cache identities do not share one upstream build version');
  const networkMatches = upstreamSource.split(networkFirstNeedle).length - 1;
  if (networkMatches !== 1) throw new Error(`Expected one pinned Playground network-first branch, found ${networkMatches}`);
  const runtimeResponseMatches = upstreamSource.split(runtimeResponseNeedle).length - 1;
  if (runtimeResponseMatches !== 1) throw new Error(`Expected one pinned Playground virtual response branch, found ${runtimeResponseMatches}`);

  const upstreamKey = cacheMatches[0][1];
  const versionedKey = `${upstreamKey}-we-wp-${fingerprint}`;
  const runtimeMimePolicy = weWpRuntimeMime.toString();
  const serviceWorker = upstreamSource
    .replace(cacheMatches[0][0], `${shellPolicy}${runtimeMimePolicy}const Ks="${versionedKey}",Gr="playground-cache"`)
    .replace(networkFirstNeedle, `if(n.pathname==="/remote.html"||n.pathname==="/api.html"||n.pathname==="/"||weWpShellRequest(e.request))`)
    .replace(runtimeResponseNeedle, runtimeResponseReplacement);
  const runtimeWorker = runtimeWorkerSource.replace(
    runtimeCacheMatches[0][0],
    `buildVersion="${versionedKey}",CACHE_NAME_PREFIX="playground-cache"`
  );

  if (serviceWorker.includes(`const Ks="${upstreamKey}",Gr="playground-cache"`)) throw new Error('Unversioned service-worker cache identity remains');
  if (runtimeWorker.includes(`buildVersion="${upstreamKey}",CACHE_NAME_PREFIX="playground-cache"`)) throw new Error('Unversioned runtime-worker cache identity remains');
  if (serviceWorker.includes(runtimeResponseNeedle)) throw new Error('Unpatched Playground virtual response branch remains');

  return { serviceWorker, runtimeWorker, upstreamKey, versionedKey };
}

export const serviceWorkerPolicyVersion = policyVersion;
