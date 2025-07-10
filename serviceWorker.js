const CACHE_NAME = 'field-invoice-cache-v1';
const urlsToCache = [
  '/field-invoice-pwa/offlineForm.html',
  '/field-invoice-pwa/dynamicForm.js',
  '/field-invoice-pwa/style.css', // if you add a CSS file
  '/field-invoice-pwa/logo.png',  // optional assets
  '/'
];

self.addEventListener('install', function (event) {
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
