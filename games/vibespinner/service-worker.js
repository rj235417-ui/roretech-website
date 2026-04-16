const CACHE_NAME = 'vibespin-v1';
const ASSETS = [
  '/games/vibespinner/',
  '/games/vibespinner/index.html',
  '/games/vibespinner/vibe.css',
  '/games/vibespinner/logic.js',
  '/games/vibespinner/manifest.json',
  '/games/vibespinner/icons/icon-192.png',
  '/games/vibespinner/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});