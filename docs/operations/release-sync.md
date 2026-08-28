# Release sync

For every public Free release:

1. Copy only the approved release ZIP into the Blueprint source.
2. Update `demo.lock.json` and `registry/plugins.json` with the same version, size, entry count, source revision, manifest hash, and artifact hash.
3. Rebuild the Blueprint bundle.
4. Run `npm run check` and an actual Playground boot against the pinned runtime.
5. Publish the GitHub Release and website download only after their hosted bytes match the approved hash.
6. Update links only after both public URLs return the expected release.

Never import Pro source into a public demo bundle.
