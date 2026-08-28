# Rollback

Deploy immutable static releases through a Forge release directory and an atomic `current` symlink. Keep the previous two verified releases.

If health, browser boot, package hash, or security checks fail:

1. Point `current` back to the last verified release.
2. Reload Nginx only if configuration changed and its syntax check passes.
3. Purge only the failed static release cache.
4. Verify `/health/live.json`, the hub, Advanced Bundles path, and the previous Blueprint hash.
5. Record the failed release without deleting its evidence.

Browser demo data needs no restore because each instance is temporary.
