# Forge deployment gate

No Forge or DNS action is approved by publishing this source repository.

Before production:

1. Re-run the pinned local runtime checks on the exact deployment artifact, then add anonymous Firefox and Safari proof on the production origin. The local Chromium import is complete but is not production evidence.
2. Create or approve the public GitHub organization and repository names. Replace null source and release URLs only after they return public HTTP 200 responses.
3. Complete the approved external signing ceremony. Store no private key in this project. Import only the detached signature and approved public key metadata.
4. Obtain explicit Forge deployment approval for the exact repository, branch, site path, Nginx rules, and rollback release.
5. Obtain explicit DNS approval for `demo.we-wp.com`, then add TLS and verify the final certificate chain.
6. Verify anonymous desktop and mobile demos, bundle hash, headers, health endpoints, rate limits, outbound blocks, and reload reset behavior in production.

Selecting an existing Forge server does not itself approve a new site, deployment, Nginx change, certificate, or DNS record.

Signing metadata must declare `algorithm: Ed25519`, a versioned public `keyId`, the lowercase SHA-256 fingerprint of the decoded 32-byte public key, the detached base64 signature path, and the canonical manifest hash. Verification must reject an unknown key ID, fingerprint mismatch, non-64-byte signature, changed manifest bytes, or artifact hash mismatch. The private key stays outside GitHub, Forge, application configuration, logs, and this repository.
