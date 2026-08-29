# Forge deployment gate

Publishing this source repository does not approve arbitrary Forge or DNS work. The owner approved the current `demo.we-wp.com` production deployment on 2026-08-29. Future site, Nginx, DNS, certificate, or unrelated server changes require explicit scope.

Current deployed behavior is commit `7e6ae9e0ac42a877fee8483ce345fa5a1665485e` through Forge command `12464453`. The command finished after checking the exact detached commit and running the repository check. Current source `main` at `3f4dce312306af973f144e7fc75c7db166ec4438` adds test coverage only. It passes 18 Node tests and verifies 2,079 built files. The exact Free installer remains SHA-256 `cfd0f4cba21842d7216f1565bfe4ae874de29abf9a081d1620229e37b38ee2d4`, 55,745 bytes, and 44 ZIP entries.

The current browser-start policy retries the top-level Playground client module once with a unique `release+run+retry` URL and retries the bundled Blueprint once with `cache: no-store` and omitted credentials. A later visible Try again increments the run identifier so rejected browser module-map entries are not reused. Production HTTP checks must prove both sampled client URLs return JavaScript with `Cache-Control: no-store`. If a failure identifies a hashed child chunk instead of `/client/index.js`, stop and generate deployment-only wrapper variants; do not edit the pinned upstream runtime source.

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
