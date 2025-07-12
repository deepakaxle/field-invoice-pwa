const CACHE_NAME = 'field-invoice-cache-v1';
const urlsToCache = [
  '/field-invoice-pwa/',
  '/field-invoice-pwa/index.html',
  '/field-invoice-pwa/offlineForm.html',
  '/field-invoice-pwa/style.css',
  '/field-invoice-pwa/manifest.json',
  '/field-invoice-pwa/icons/icon-192.png',
  '/field-invoice-pwa/icons/icon-512.png'
];

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

self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      console.log('[SW] Offline fallback → offlineForm.html');
      if (event.request.mode === 'navigate') {
        return caches.match('/field-invoice-pwa/offlineForm.html');
      }
    })
  );
});
