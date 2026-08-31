// Static server for the Exio sample report page.
// No dependencies on purpose. Nothing to install, nothing to break on deploy.
//
// Everything sits in the repo root so the files can be uploaded one at a time
// through the GitHub web interface. Because server.js and package.json also
// live here, only the files in ALLOW below are ever served.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const ALLOW = new Set([
  'index.html',
  'og.png',
  'favicon.png',
  'favicon-32.png'
]);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let name = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');

  // Anything not on the allowlist either falls back to the page (routes with
  // no extension) or 404s (a genuinely missing asset).
  if (!ALLOW.has(name)) {
    if (path.extname(name)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    name = 'index.html';
  }

  const file = path.join(ROOT, name);
  const ext = path.extname(file).toLowerCase();

  res.writeHead(200, {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': ext === '.html'
      ? 'public, max-age=300'         // 5 min, so copy edits go live quickly
      : 'public, max-age=31536000',   // images can cache hard
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Serving ${ROOT} on port ${PORT}`);
});
