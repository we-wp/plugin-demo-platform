# Demo architecture

## Decision

Use `demo.we-wp.com` as one static hub with plugin paths such as `/plugins/advanced-bundles/`. Do not create one subdomain per plugin yet.

One origin gives every demo the same runtime cache, Content Security Policy, health checks, deployment, and rollback. A new subdomain is justified only when a plugin later needs server-side services or incompatible isolation.

The checked-in Playground runtime remains byte-for-byte pinned. During `npm run build`, the deployment copy of `sw.js` receives a deterministic cache suffix derived from the first-party shell, registry, and Blueprint bundle. First-party HTML, catalogue data, screenshots, fonts, health files, and demo bundles use network-first delivery with the prior release as offline fallback. Playground runtime assets retain the upstream cache-first behavior. This prevents a root-scope Playground cache from keeping old product copy or application assets after a deployment.

## Runtime flow

1. Static HTML loads the plugin registry and screenshot tour.
2. The visitor chooses an interactive demo.
3. The self-hosted WordPress Playground client creates a new temporary WordPress instance inside the browser.
4. The pinned Blueprint bundle installs WooCommerce 11.0.1 and the exact Advanced Bundles Free 0.1.0 ZIP.
5. The fixture creates only synthetic products. The demo guard blocks external requests, mail, plugin, theme, core, and user-management changes, plus non-COD payment gateways. Product and order edits remain available because each browser instance is disposable.
6. The shell reports ready only after PHP verifies WordPress, WooCommerce, the Free plugin, fixtures, HTTP and mail blocks, and the upload cap.
7. **Reset store** starts a new random Playground scope and proves a marker from the previous store is absent.

There is no shared WordPress database, shared admin account, customer data, or reset worker. The static release artifact is the recovery source.

## Current source boundary

The repository includes the screenshot shell, registry, Blueprint bundle, exact packages, synthetic fixtures, demo guard, and a reduced self-hosted Playground runtime selected from the official pinned artifact. The local Chromium proof covers startup, product and editor pages, a populated cart and checkout, clean reset, deterministic startup failure, outbound blocks, and 390/1440 layouts.

This is local evidence only. Firefox, Safari, a production origin, Forge, TLS, DNS, edge limits, public GitHub links, and production health behavior remain unverified and require separate approvals.
