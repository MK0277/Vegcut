const CACHE_NAME = "vegcut-v1";

const urlsToCache = [
  "/Vegcut/",
  "/Vegcut/index.html",
  "/Vegcut/manifest.json",

  "/Vegcut/css/style.css",
  "/Vegcut/js/script.js",

  "/Vegcut/icons/icon-72.png",
  "/Vegcut/icons/icon-96.png",
  "/Vegcut/icons/icon-128.png",
  "/Vegcut/icons/icon-144.png",
  "/Vegcut/icons/icon-152.png",
  "/Vegcut/icons/icon-192.png",
  "/Vegcut/icons/icon-384.png",
  "/Vegcut/icons/icon-512.png",

  "/Vegcut/screenshots/mobile-home.jpg",
  "/Vegcut/screenshots/desktop-home.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(response => {

      if (response) {
        return response;
      }

      return fetch(event.request)
        .then(networkResponse => {

          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });

        })
        .catch(() => {

          if (event.request.destination === "document") {
            return caches.match("/Vegcut/index.html");
          }

        });

    })
  );

});