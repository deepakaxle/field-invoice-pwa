const CACHE_NAME = 'field-invoice-cache-v3';  // increment to clear old cache
const urlsToCache = [
  './offlineForm.html',
  './dynamicForm.js',
  './style.css',
  './logo.png',
  './'
];

self.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => {
        if (event.request.mode === 'navigate') {
          return caches.match('./offlineForm.html');
        }
        return response;
      })
    )
  );
});
