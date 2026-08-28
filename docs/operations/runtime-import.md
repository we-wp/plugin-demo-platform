# Playground runtime import record

The pinned self-hosted runtime is imported and `/health/ready.json` returns HTTP 200 in the local build. This record proves the local artifact and Chromium checks only, not public production readiness.

## Pinned upstream candidate

- Repository: `WordPress/wordpress-playground`
- Workflow run: `33173419793`
- Source revision: `f29eca6c6f63f65e9176ce9072b2a34c9ed7d864`
- Artifact: `playground-website`, ID `9686769924`
- GitHub-reported compressed size: `708,769,597` bytes

## Verified payload

- Downloaded payload: `wasm-wordpress-net.tar.gz`
- Bytes: `709,583,353`
- SHA-256: `93d4d5f1e8de89869b8b5f020a65d738b51b21f8812b29aab702c122cd2a469c`
- Full entries: `27,769`
- Full inventory SHA-256: `3995f1870fdd6e831b4a92126d95244d29eeed26736cc6cf854bfb319d1d74c4`
- Retained selection: `2,063` files, `120,629,711` bytes
- Selection inventory SHA-256: `6520d1dbce6e32e586aef90bcb6f9b7b2278bd15c2978b39ff149dfc731221ae`

The retained selection contains the matching client, remote, service worker, workers, WordPress 6.9, and both PHP 8.3 JSPI and Asyncify binaries. It deliberately keeps every upstream JavaScript, CSS, JPEG, and SVG support asset because a smaller dependency closure has not been proven. That conservative set includes 89 files not named by the offline manifest (7,296,019 bytes), including 14 JavaScript wrappers labeled for other PHP versions (1,905,409 bytes). No non-8.3 PHP WebAssembly binary is retained. Source maps, unrelated WordPress versions, and large extension binaries not required by the locked demo are excluded.

## Reproduce the selection

After downloading and fully extracting the same payload outside the retained runtime directory:

```sh
node scripts/import-runtime.mjs /absolute/path/to/extracted-runtime /absolute/path/to/wasm-wordpress-net.tar.gz
npm run check
```

The importer rejects an archive hash mismatch, rebuilds the deterministic per-file inventory, and records the exact selection. `scripts/verify.mjs` recalculates all retained file hashes on every check.

## Local browser evidence

Chromium booted the same-origin client and remote, installed the locked Blueprint, opened the real product editor, added the bundle, showed its component rows in cart and checkout, blocked HTTP and mail, enforced the upload cap, reset into a clean scope, rendered the deterministic error state, and showed no outer-page horizontal overflow at 390 or 1440 pixels.

Firefox, Safari, production-origin caching and isolation, live Nginx behavior, TLS, and public anonymous traffic remain release gates.
