import { createHash } from 'node:crypto';

const cacheIdentityPattern = /const Ks="([a-f0-9]{40})",Gr="playground-cache"/g;
const networkFirstNeedle = 'if(n.pathname==="/remote.html"||n.pathname==="/api.html"||n.pathname==="/")';
const policyVersion = 'we-wp-shell-network-first-v2';
const shellPolicy = 'function weWpShellRequest(e){const n=new URL(e.url);return n.pathname==="/index.html"||n.pathname==="/favicon.ico"||n.pathname==="/build-manifest.json"||n.pathname==="/assets/app.js"||n.pathname==="/assets/app.css"||n.pathname.startsWith("/assets/fonts/")||n.pathname.startsWith("/assets/screenshots/")||n.pathname.startsWith("/data/")||n.pathname.startsWith("/demo-assets/")||n.pathname.startsWith("/health/")||n.pathname.startsWith("/plugins/")}';

export function releaseFingerprint(entries) {
  const hash = createHash('sha256').update(`${policyVersion}\0`);
  for (const entry of [...entries].sort((left, right) => left.path.localeCompare(right.path))) {
    hash.update(entry.path).update('\0').update(entry.bytes).update('\0');
  }
  return hash.digest('hex').slice(0, 16);
}

export function prepareServiceWorker(upstreamSource, fingerprint) {
  if (!/^[a-f0-9]{16}$/.test(fingerprint)) throw new Error('Service-worker release fingerprint must be 16 lowercase hex characters');

  const cacheMatches = [...upstreamSource.matchAll(cacheIdentityPattern)];
  if (cacheMatches.length !== 1) throw new Error(`Expected one pinned Playground cache identity, found ${cacheMatches.length}`);
  const networkMatches = upstreamSource.split(networkFirstNeedle).length - 1;
  if (networkMatches !== 1) throw new Error(`Expected one pinned Playground network-first branch, found ${networkMatches}`);

  const upstreamKey = cacheMatches[0][1];
  return upstreamSource
    .replace(cacheMatches[0][0], `${shellPolicy}const Ks="${upstreamKey}-we-wp-${fingerprint}",Gr="playground-cache"`)
    .replace(networkFirstNeedle, `if(n.pathname==="/remote.html"||n.pathname==="/api.html"||n.pathname==="/"||weWpShellRequest(e.request))`);
}

export const serviceWorkerPolicyVersion = policyVersion;
