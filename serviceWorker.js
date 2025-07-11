const CACHE_NAME = 'field-invoice-cache-v9';
const urlsToCache = [
  './',
  './index.html',
  './offlineForm.html',
  './dynamicForm.js'
];

self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching:', urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // Offline fallback logic
        if (event.request.mode === 'navigate') {
          console.log('[SW] Offline nav fallback → offlineForm.html');
          return caches.match('./offlineForm.html');
        }
        return caches.match(event.request);
      })
  );
});
