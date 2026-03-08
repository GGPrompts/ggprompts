var CACHE_NAME = 'kids-corner-v1';
var ASSETS = [
    '/kids/index.html',
    '/kids/manifest.json'
];

// Install — cache hub page and key assets
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ASSETS);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

// Activate — clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(names) {
            return Promise.all(
                names.filter(function(name) {
                    return name !== CACHE_NAME;
                }).map(function(name) {
                    return caches.delete(name);
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// Fetch — offline-first (cache, then network)
self.addEventListener('fetch', function(event) {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests (Google Fonts CDN, etc.)
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then(function(cached) {
            if (cached) {
                // Return cached version, but update cache in background
                var fetchPromise = fetch(event.request).then(function(response) {
                    if (response && response.status === 200) {
                        var clone = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                }).catch(function() { /* offline, ignore */ });

                return cached;
            }

            // Not in cache — try network, cache the result
            return fetch(event.request).then(function(response) {
                if (!response || response.status !== 200) {
                    return response;
                }
                var clone = response.clone();
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(event.request, clone);
                });
                return response;
            });
        })
    );
});
