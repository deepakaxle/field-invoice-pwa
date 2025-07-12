const CACHE_NAME = 'field-invoice-cache-v1';

const urlsToCache = [
  './index.html',
  './offlineForm.html',
  './dynamicForm.js',
  './manifest.json'
];

// ✅ Install: cache known files
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching:', urlsToCache);
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error('[SW] Failed to cache:', err);
    })
  );
});

// ✅ Activate
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

// ✅ Fetch handler: fallback to offlineForm.html
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === 'navigate') {
        console.log('[SW] Offline fallback → offlineForm.html');
        return caches.match('./offlineForm.html');
      }
    })
  );
});
