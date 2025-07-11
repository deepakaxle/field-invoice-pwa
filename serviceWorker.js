// serviceWorker.js

const CACHE_NAME = 'field-invoice-cache-v1';
const urlsToCache = [
  './index.html',
  './offlineForm.html',
  './style.css',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// ✅ Install event: cache static files
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('[SW] Failed to cache:', err);
      })
  );
});

// ✅ Activate event
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

// ✅ Fetch: Try network first, fallback to offlineForm.html if it fails
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log('[SW] Offline fallback → offlineForm.html');
      if (event.request.mode === 'navigate') {
        return caches.match('./offlineForm.html');
      }
    })
  );
});
