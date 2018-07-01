/**
 * Created by mikigv on 6/26/2018.
 */
var staticCacheName = 'curr-conv-v11';
//dddddsdsd
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache) {
            return cache.addAll([
                './',
                './index.html',
                './assets/css/main.css',
                './assets/js/currencyAPI.js',
                './assets/js/view.js',
                './assets/js/main.js',
                './assets/image/bg1.png',
                './assets/image/favicon-16x16.png',
                'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css',
                'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
            ]);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('curr-conv-') &&
                        cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event){
    const requestURL = new URL(event.request.url);

    if(requestURL.origin === location.origin){
        if(requestURL.pathname === '/'){
            event.respondWith(caches.match('/'));
            return;
        }
    }


    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('message', function(event) {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});
