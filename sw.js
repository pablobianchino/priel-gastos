const CACHE_NAME = 'gastos-priel-v2.8';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', function(event) {
    // No interceptar llamadas a Supabase ni scripts externos
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Para navegación o el HTML principal, ir SIEMPRE a la red sin usar caché
    if (event.request.mode === 'navigate' || event.request.url.endsWith('/') || event.request.url.includes('index.html')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
