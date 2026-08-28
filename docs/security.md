# Security model

- Every interactive store is temporary and isolated to one browser context.
- Blueprint networking is `false` and WordPress sets `WP_HTTP_BLOCK_EXTERNAL`.
- The MU plugin stops HTTP requests and `wp_mail` before delivery.
- Order attribution, remote avatars, and remote emoji images are disabled because they add no value to the synthetic demo and would create outbound requests or console warnings.
- Playground's cosmetic cross-document transitions are disabled because Chrome rejects the storefront-to-admin transition that the demo navigation intentionally performs.
- The outer server allows only same-origin scripts, workers, frames, and connections plus the local data and blob schemes required by Playground. Inline scripts remain blocked; inline styles are allowed because the official remote shell sizes its nested WordPress frame with an inline stylesheet.
- Cross-origin opener and embedder isolation is required on the static server. WordPress storefront and admin responses also emit the matching embedder and resource policy headers.
- Production static locations use the complete checked-in MIME map. JavaScript must be served as `application/javascript` while `X-Content-Type-Options: nosniff` remains enabled.
- Only a synthetic offline order method is available. No Stripe, PayPal, or live payment credentials exist.
- File editing, plugin or theme changes, user management, application passwords, XML-RPC, and automatic updates are disabled.
- Uploads are limited to JPG, PNG, and WebP files up to 2 MB inside the temporary browser filesystem.
- Fixtures contain only generated products and images. No production database, customer export, order, user, or secret is bundled.
- Pro source and private repository URLs are absent.
- Static hosting must rate-limit HTML and Blueprint bundle requests at Nginx or the edge. Suggested start: 60 requests per minute per IP, burst 20, with a stricter 10 starts per minute limit on the bundle path.
- No analytics ships in this repository. A later consented analytics decision must count only outer-page events and never inspect the WordPress instance.

The browser instance needs no backup. Back up and version only the static deployment, registry, Blueprint bundle, and release metadata.
