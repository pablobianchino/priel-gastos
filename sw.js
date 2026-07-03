const CACHE_NAME = 'gastos-priel-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
    // Si es un pedido de navegación (abrir la app), intentar buscar en red
    event.respondWith(fetch(event.request).catch(function() {
        return caches.match(event.request);
    }));
});
