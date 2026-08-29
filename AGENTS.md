# Plugin demo platform

This directory is the public source repository for `we-wp/plugin-demo-platform`. Publication of source is approved. The owner approved the current `demo.we-wp.com` production deployment on 2026-08-29. Future DNS, Nginx, site, or unrelated Forge changes still require explicit scope.

## Boundaries

- Use only public Free plugin artifacts and synthetic demo data.
- Never add Pro source, private repository URLs, credentials, production data, customer data, analytics, or third-party trackers.
- `registry/plugins.json` is the catalogue source of truth.
- Advanced Invoices stays linkless while its status is `coming-soon`.
- The Advanced Bundles Free artifact is pinned to SHA-256 `cfd0f4cba21842d7216f1565bfe4ae874de29abf9a081d1620229e37b38ee2d4`, size `55745`, and 44 ZIP entries.
- Browser demos use isolated, temporary WordPress Playground instances. Networking is disabled. Reloading creates a clean instance.
- Cart and Checkout may seed one synthetic fixed bundle only when the temporary cart is empty. Existing carts must remain untouched. Runtime and Blueprint retries are bounded to two attempts and must report their retry state honestly.
- The production-verified hero flow is source commit `b141514248baca05d3fc74d3fb38888c75da5bd8`, deployed by finished Forge command `12465183`: one click starts the temporary store, Cart reports `loaded`, Checkout reports `preserved`, and the untracked GitHub star prompt appears only after that verified success. Production QA found no installer request, console error, or horizontal overflow. Evidence is retained at `/Users/eim/Documents/GitHub/personal-workspace/assets/we-wp-launch/organic-discovery-download-production-2026-08-29/`.
- Report local, committed, pushed, deployed, DNS-ready, and production-verified states separately.

## Checks

Run `npm run check`. Source commit `b141514248baca05d3fc74d3fb38888c75da5bd8` passes 18 Node tests and verifies 2,079 built files. For a local review, run `npm run preview` and open the printed loopback URL.
