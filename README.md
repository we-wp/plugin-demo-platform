# we-wp plugin demo platform

[![License: GPL v2](https://img.shields.io/badge/License-GPL_v2-blue.svg)](LICENSE)

Self-hosted browser demo platform for we-wp WooCommerce plugins.

## What works locally

- Multi-plugin hub with Advanced Bundles and linkless Advanced Invoices coming soon.
- Advanced Bundles screenshot tour plus an interactive product, editor, cart, and checkout flow.
- Pinned self-hosted WordPress Playground client, remote, service worker, WordPress 6.9, and PHP 8.3 runtimes.
- Exact pinned Free plugin ZIP, WooCommerce package, synthetic fixtures, and demo guard.
- Fresh-store reset, deterministic failure state, and in-runtime safety verification before the UI reports ready.
- Empty-cart-only example seeding for Cart and Checkout, preservation of manual carts, and verified bundle/component totals before success is shown.
- Bounded automatic retries for transient client-module and bundled-demo fetch failures, with fresh module URLs for each visible retry.
- Deterministic build, package, runtime-inventory, and local preview checks.

The exact upstream artifact, archive hash, full inventory hash, reduced selection hash, and browser-verification state are recorded in `blueprints/runtime.lock.json`. The retained runtime is 120,629,711 bytes across 2,063 files; the 709,583,353-byte source archive is not duplicated in the repository. See `docs/operations/runtime-import.md` for provenance and reproduction.

## Review

```sh
npm run check
npm run preview
```

Open `http://localhost:8783/plugins/advanced-bundles/`, choose **Start live WooCommerce demo**, and allow up to one minute for the first boot.

## Browser proof

![Advanced Bundles interactive demo at 1440 pixels](screenshots/interactive-advanced-bundles-desktop-1440.jpg)

[Open the 390-pixel mobile proof](screenshots/interactive-advanced-bundles-mobile-390.jpg).

## Delivery state

- Local source and preview: yes.
- Local Chromium boot, add-to-cart, editor, cart, checkout, reset, outbound block, failure state, and 390/1440 responsive proof: yes.
- Public source repository: `https://github.com/we-wp/plugin-demo-platform`.
- Forge deployment and `demo.we-wp.com` DNS/TLS: live.
- Production behavior: source commit `b141514248baca05d3fc74d3fb38888c75da5bd8` deployed by Forge command `12465183`; Forge reports the command **Finished**.
- Current local source check: 18/18 Node tests plus deterministic verification of 2,079 built files, the pinned runtime, Blueprint inventory, WooCommerce bytes, and the unchanged 55,745-byte Free installer.
- Production HTTP proof: resolver `v3` is live; sampled `release+run` and `release+run+retry` client entry URLs return identical JavaScript bytes with `Cache-Control: no-store`.
- Independent production browser QA: GO against source commit `b141514248baca05d3fc74d3fb38888c75da5bd8`. The hero started the live store with one click. Cart reported `loaded`; Checkout reported `preserved`; both retained exactly three lines, quantities 1/2/1, and EUR 32.50. The GitHub star prompt appeared only after verified Cart/Checkout success and remains untracked. No installer request, console error, or horizontal overflow occurred.
- Production evidence: `/Users/eim/Documents/GitHub/personal-workspace/assets/we-wp-launch/organic-discovery-download-production-2026-08-29/`.

See `docs/architecture.md` and `docs/operations/forge-deploy.md` for the gated implementation path.
