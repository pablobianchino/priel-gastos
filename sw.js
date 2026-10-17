const CACHE_NAME = 'gastos-priel-v2.7';

self.addEventListener('install', (event) => {
    // Fuerza al nuevo Service Worker a activarse inmediatamente sin esperar a que se cierren las pestañas
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Elimina cualquier caché de versiones anteriores y toma control inmediato de la pantalla
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
    // Para el HTML principal o navegación, forzar siempre lectura directa de red (sin caché)
    if (event.request.mode === 'navigate' || event.request.url.includes('index.html')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
        );
        return;
    }

    // Para el resto de recursos, intenta red primero y cae a caché si no hay internet
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
