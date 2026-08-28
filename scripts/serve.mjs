import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const publicRoot = resolve(root, 'dist');
const port = Number.parseInt(process.env.WE_WP_DEMO_PORT || '8783', 10);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.zip': 'application/zip',
  '.zst': 'application/zstd'
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const cleaned = normalize(pathname).replace(/^([.][.][/\\])+/, '');
    let path = resolve(publicRoot, `.${cleaned}`);
    if (path !== publicRoot && !path.startsWith(`${publicRoot}${sep}`)) throw new Error('Path rejected');
    const details = await stat(path).catch(() => null);
    if (details?.isDirectory()) path = join(path, 'index.html');
    const file = await stat(path).catch(() => null);
    if (!file?.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const extension = extname(path);
    const immutable = (/^\/assets\/(?!app\.(?:css|js)$).+-[A-Za-z0-9_-]{8,}\./.test(pathname) || pathname.startsWith('/wp-6.9/'));
    const headers = {
      'Content-Type': types[extension] || 'application/octet-stream',
      'Content-Length': file.size,
      'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : 'no-store',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'wasm-unsafe-eval'; connect-src 'self' data:; frame-src 'self' blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff'
    };
    headers['Accept-Ranges'] = 'bytes';
    if (pathname === '/sw.js') headers['Service-Worker-Allowed'] = '/';
    response.writeHead(200, headers);
    createReadStream(path).pipe(response);
  } catch {
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Bad request');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`we-wp plugin demo platform: http://127.0.0.1:${port}/`);
});
