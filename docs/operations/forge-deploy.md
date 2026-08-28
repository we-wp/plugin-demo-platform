# Forge deployment gate

No Forge or DNS action is approved by publishing this source repository.

Before production:

1. Re-run the pinned local runtime checks on the exact deployment artifact, then add anonymous Firefox and Safari proof on the production origin. The local Chromium import is complete but is not production evidence.
2. Create or approve the public GitHub organization and repository names. Replace null source and release URLs only after they return public HTTP 200 responses.
3. Complete the approved external signing ceremony. Store no private key in this project. Import only the detached signature and approved public key metadata.
4. Obtain explicit Forge deployment approval for the exact repository, branch, site path, Nginx rules, and rollback release.
5. Obtain explicit DNS approval for `demo.we-wp.com`, then add TLS and verify the final certificate chain.
6. Verify anonymous desktop and mobile demos, bundle hash, headers, health endpoints, rate limits, outbound blocks, and reload reset behavior in production.

For the approved `demo.we-wp.com` deployment, serve `dist/` from the isolated
site user and include `deploy/nginx/security-headers.conf` in every explicit
static-file location. Include `deploy/nginx/static-mime-types.conf` in every
location that declares `types`; do not use a wasm/Zstandard/ZIP-only `types`
block because location-level MIME maps replace inherited JavaScript, CSS, font,
and image mappings. Forge's generated static locations add their own headers,
so relying only on server-level inheritance can silently drop the Playground
isolation policy. Verify raw headers on HTML, JavaScript, WebAssembly, Zstandard,
ZIP, service-worker, health, and missing-file responses after every Nginx edit.

Before reloading Nginx, run `sudo nginx -t`. After reload, these probes must
return `application/javascript` and `text/css`, never
`application/octet-stream`:

```sh
curl -fsSI https://demo.we-wp.com/wp-6.9/wp-includes/js/jquery/jquery.min.js
curl -fsSI https://demo.we-wp.com/assets/app.js
curl -fsSI https://demo.we-wp.com/assets/app.css
```

Keep `X-Content-Type-Options: nosniff`. Removing it would hide a broken MIME
configuration and weaken the deployment instead of fixing the asset response.

The source checkout must resolve to the exact public `main` commit before
`npm run check` builds `dist/`. Keep the public repository as the canonical
source even when the Forge GitHub App cannot enumerate the organization.

`npm run build` must run on every release. It generates a release-specific
Playground cache identity and makes first-party shell routes network-first while
leaving the locked runtime source untouched. Never deploy an older `dist/sw.js`
with newer HTML or assets. Existing visitors from releases before this policy
may need one reload after the browser installs the new worker; later releases
refresh the shell from the network automatically.

Selecting an existing Forge server does not itself approve a new site, deployment, Nginx change, certificate, or DNS record.

Signing metadata must declare `algorithm: Ed25519`, a versioned public `keyId`, the lowercase SHA-256 fingerprint of the decoded 32-byte public key, the detached base64 signature path, and the canonical manifest hash. Verification must reject an unknown key ID, fingerprint mismatch, non-64-byte signature, changed manifest bytes, or artifact hash mismatch. The private key stays outside GitHub, Forge, application configuration, logs, and this repository.
