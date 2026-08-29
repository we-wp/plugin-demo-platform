export const blueprintResolveAttempts = 2;

export async function resolveDemoBlueprint({
  resolveRemoteBlueprint,
  path,
  artifactSha256,
  origin = window.location.origin,
  fetchImpl = window.fetch.bind(window),
  onRetry = () => {},
  wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}) {
  let lastError;

  for (let attempt = 0; attempt < blueprintResolveAttempts; attempt += 1) {
    const url = new URL(path, origin);
    url.searchParams.set('release', artifactSha256.slice(0, 12));
    if (attempt > 0) url.searchParams.set('retry', String(attempt));

    try {
      return await resolveRemoteBlueprint(url.href, {
        fetch: (input, options = {}) => fetchImpl(input, {
          ...options,
          cache: 'no-store',
          credentials: 'omit'
        })
      });
    } catch (error) {
      lastError = error;
      if (attempt + 1 >= blueprintResolveAttempts) break;
      onRetry();
      await wait(750);
    }
  }

  throw lastError;
}
