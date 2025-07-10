const CACHE_NAME = 'field-invoice-cache-v5';

const urlsToCache = [
  './offlineForm.html',
  './index.html',
  './dynamicForm.js'
];

// INSTALL
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching files:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error('[SW] Caching failed during install:', err);
      })
  );
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetching:', event.request.url, '| Mode:', event.request.mode);

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            console.log('[SW] Found in cache:', event.request.url);
            return response;
          }

          // Offline fallback for navigation
          if (event.request.mode === 'navigate') {
            console.warn('[SW] Offline fallback triggered → offlineForm.html');
            return caches.match('./offlineForm.html');
          }

          // Otherwise, return empty response (404)
          return new Response('', { status: 404, statusText: 'Offline: Resource not cached' });
        });
      })
  );
});
