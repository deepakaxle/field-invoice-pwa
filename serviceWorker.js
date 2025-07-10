const CACHE_NAME = 'field-invoice-cache-v1';
const urlsToCache = [
  '/field-invoice-pwa/offlineForm.html',
  '/field-invoice-pwa/dynamicForm.js',
  '/field-invoice-pwa/style.css',      // optional, include if present
  '/field-invoice-pwa/logo.png',       // optional assets
  '/'
];

self.addEventListener('install', function (event) {
  self.skipWaiting(); // Ensures the new service worker activates immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => response)
    )
  );
});
