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

Open `http://localhost:8783/plugins/advanced-bundles/`, choose **Start interactive demo**, and allow up to one minute for the first boot.

## Browser proof

![Advanced Bundles interactive demo at 1440 pixels](screenshots/interactive-advanced-bundles-desktop-1440.jpg)

[Open the 390-pixel mobile proof](screenshots/interactive-advanced-bundles-mobile-390.jpg).

## Delivery state

- Local source and preview: yes.
- Local Chromium boot, add-to-cart, editor, cart, checkout, reset, outbound block, failure state, and 390/1440 responsive proof: yes.
- Public source repository: `https://github.com/we-wp/plugin-demo-platform`.
- Forge deployment and `demo.we-wp.com` DNS/TLS: live.
- Production behavior: commit `7e6ae9e0ac42a877fee8483ce345fa5a1665485e` deployed by Forge command `12464453`; the command finished after checking the exact detached commit. Test-bearing source commit `3f4dce312306af973f144e7fc75c7db166ec4438` adds coverage only; later documentation-only commits do not change the built demo.
- Current local source check: 18/18 Node tests plus deterministic verification of 2,079 built files, the pinned runtime, Blueprint inventory, WooCommerce bytes, and the unchanged 55,745-byte Free installer.
- Production HTTP proof: resolver `v3` is live; sampled `release+run` and `release+run+retry` client entry URLs return identical JavaScript bytes with `Cache-Control: no-store`.
- Independent production browser QA: GO against deployed behavior `7e6ae9e`. Fresh 1440 px and 390 px tabs started with one click and no human retry; Cart, repeated Cart, and Checkout verified exactly three lines, quantities 1/2/1, and EUR 32.50 with no overflow or console errors. The installer was never clicked or fetched.

See `docs/architecture.md` and `docs/operations/forge-deploy.md` for the gated implementation path.
