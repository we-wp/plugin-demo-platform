# Plugin demo platform

This directory is the public source repository for `we-wp/plugin-demo-platform`. Publication of source is approved. Deployment, Forge changes, and DNS changes still require separate explicit approval.

## Boundaries

- Use only public Free plugin artifacts and synthetic demo data.
- Never add Pro source, private repository URLs, credentials, production data, customer data, analytics, or third-party trackers.
- `registry/plugins.json` is the catalogue source of truth.
- Advanced Invoices stays linkless while its status is `coming-soon`.
- The Advanced Bundles Free artifact is pinned to SHA-256 `cfd0f4cba21842d7216f1565bfe4ae874de29abf9a081d1620229e37b38ee2d4`, size `55745`, and 44 ZIP entries.
- Browser demos use isolated, temporary WordPress Playground instances. Networking is disabled. Reloading creates a clean instance.
- Report local, committed, pushed, deployed, DNS-ready, and production-verified states separately.

## Checks

Run `npm run check`. For a local review, run `npm run preview` and open the printed loopback URL.
