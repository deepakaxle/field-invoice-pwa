const CACHE_NAME = 'field-invoice-cache-v2'; // 👈 change version

const urlsToCache = [
  './offlineForm.html',
  './dynamicForm.js',
  './style.css',
  './logo.png',
  './'
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
