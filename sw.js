const VERSION = 'english-train-v1.0.3';
const CACHE_PREFIX = 'english-train-';
const APP_FILES = ['./', './index.html', './style.css', './app.js', './content.js', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(APP_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== VERSION).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || event.request.method !== 'GET') return;
  event.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(event.request, {ignoreSearch:true});
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok && response.type !== 'opaque') await cache.put(event.request, response.clone());
      return response;
    } catch (_) {
      if (event.request.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  }));
});
