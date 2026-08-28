# Local preview

```sh
npm run check
WE_WP_DEMO_PORT=8783 npm run preview
```

Open `http://localhost:8783/` and `http://localhost:8783/plugins/advanced-bundles/`.

Choose **Start interactive demo** on the Advanced Bundles page. First boot can take up to one minute. The page reports ready only after checking WordPress 6.9, WooCommerce 11.0.1, Advanced Bundles Free 0.1.0, the three synthetic products, the product page, HTTP and mail blocks, and the 2 MB upload cap.

Use **Reset store** to create a fresh scope. A loopback-only deterministic error check is available at `http://localhost:8783/plugins/advanced-bundles/?demo-runtime=fail`.

The default review process is a foreground Node server bound only to `127.0.0.1`. It has no macOS boot persistence or restart policy. Installing a LaunchAgent writes outside this repository and needs separate approval.

A persistent-ready LaunchAgent template is staged as `io.businesspress.we-wp-demo-proposal.plist.example`. Replace every placeholder path before copying it into `~/Library/LaunchAgents/`. The template is not installed by this repository.
