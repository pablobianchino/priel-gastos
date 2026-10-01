const CACHE_NAME = 'gastos-priel-v2.4';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Borra las cachés antiguas cuando se activa una nueva versión
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    // Intenta buscar en red primero, si falla (sin internet), busca en caché
    event.respondWith(fetch(event.request).catch(function() {
        return caches.match(event.request);
    }));
});
