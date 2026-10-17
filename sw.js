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
    if (event.request.mode === 'navigate' || event.request.url.includes('index.html')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
