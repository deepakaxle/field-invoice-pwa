const CACHE_NAME = 'field-invoice-cache-v9';
const urlsToCache = [
  '/offlineForm.html',
  '/manifest.json',
  '/dynamicForm.js',
  '/favicon.ico'
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Optional: fallback for navigation requests (e.g., offlineForm.html)
      if (event.request.mode === 'navigate') {
        const fallback = await caches.match('/offlineForm.html');
        if (fallback) return fallback;
      }

      // Fallback: return a minimal response instead of throwing
      return new Response('<h1>⚠️ Offline - Not Cached</h1>', {
        headers: { 'Content-Type': 'text/html' },
      });
    })
  );
});
