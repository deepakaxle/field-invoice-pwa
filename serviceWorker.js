const CACHE_NAME = 'field-invoice-cache-v3';
const urlsToCache = [
  './offlineForm.html',
  './dynamicForm.js',
  './style.css',
  './logo.png', // optional
  './'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', event => {
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
