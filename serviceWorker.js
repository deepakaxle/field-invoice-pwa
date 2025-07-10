const CACHE_NAME = 'field-invoice-cache-v5';
const urlsToCache = [
  './offlineForm.html',
  './dynamicForm.js',
  './style.css',
  './logo.png',
  './'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching files:', urlsToCache);
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  console.log('[SW] Fetching:', event.request.url);
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((response) => {
        if (response) {
          console.log('[SW] Found in cache:', event.request.url);
          return response;
        }
        if (event.request.mode === 'navigate') {
          console.log('[SW] Fallback to offlineForm.html');
          return caches.match('./offlineForm.html');
        }
        return new Response('', { status: 404 });
      })
    )
  );
});
