# Third-party notices

This repository distributes a reduced, auditable browser runtime and exact public plugin packages. These components keep their original licenses and notices.

## WordPress Playground

- Source: `WordPress/wordpress-playground`
- Revision: `f29eca6c6f63f65e9176ce9072b2a34c9ed7d864`
- Artifact and inventory details: `blueprints/runtime.lock.json`
- License: GNU General Public License v2.0
- License source: <https://github.com/WordPress/wordpress-playground/blob/f29eca6c6f63f65e9176ce9072b2a34c9ed7d864/LICENSE>

## WordPress 6.9

The retained Playground selection includes WordPress 6.9 runtime files. WordPress is distributed under the GNU General Public License v2 or later. WordPress trademarks are not licensed by the GPL.

- Project: <https://wordpress.org/>
- License: <https://wordpress.org/about/license/>

## PHP 8.3.32 WebAssembly

The retained Playground runtime includes the JSPI and Asyncify PHP 8.3.32 WebAssembly binaries. The embedded version strings identify PHP 8.3.32, and both binary hashes are recorded in `runtime/playground/selection.json`.

- Corresponding PHP source tag: <https://github.com/php/php-src/tree/php-8.3.32>
- Corresponding PHP source commit: `3e35b370570577e6277f8b46a0e73cdf616921fb`
- WebAssembly build source and recipe: <https://github.com/WordPress/wordpress-playground/tree/f29eca6c6f63f65e9176ce9072b2a34c9ed7d864/packages/php-wasm>
- Build package: `@php-wasm/web-8-3` version `3.1.51`
- Included license: `LICENSES/PHP-3.01.txt`
- Required acknowledgment: This product includes PHP software, freely available from <http://www.php.net/software/>.

## WooCommerce 11.0.1

The Blueprint includes the exact public WooCommerce 11.0.1 ZIP. Its included `woocommerce/license.txt` states GNU General Public License v3 or later. Bundled dependencies may carry compatible licenses recorded inside that archive.

- Project: <https://github.com/woocommerce/woocommerce>

## Advanced Bundles for WooCommerce 0.1.0

The Blueprint includes the exact public Free plugin ZIP. It is licensed under GNU General Public License v2 or later.

- Source: <https://github.com/we-wp/advanced-bundles-for-woocommerce>
- Artifact SHA-256: `cfd0f4cba21842d7216f1565bfe4ae874de29abf9a081d1620229e37b38ee2d4`

## Geist

The self-hosted Geist font file is distributed under the SIL Open Font License 1.1.

- Bundled file SHA-256: `19f9c92546aa300c312235e3125af1b81394d8db9a4bc4a425cd5b641d2d54e1`
- Exact source package: `@fontsource-variable/geist` version `5.3.0`, file `files/geist-latin-wght-normal.woff2`
- Package integrity: `sha512-j0m+vLQuG5XAYoHtGCVu0spvlGreR3EzpECUVzkFmI1mTVnAO38l/NEPDCFgZ177JxzYJCLSmTQibIiYPilGrA==`
- Source repository: <https://github.com/fontsource/font-files/tree/main/fonts/variable/geist>
- Included license: `LICENSES/OFL-1.1.txt`

## Synthetic demo images

The three unbranded product images under `blueprints/advanced-bundles/fixtures/images/` were created specifically for this demo and are project-owned synthetic fixtures. Their hashes and provenance are recorded beside them in `README.md`.
