const APP_CACHE = "blades-repair-app-v2";
const BASE_PATH = "/off-line/blades-repair/blades-app";
const APP_SHELL = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/pwa-192.png`,
  `${BASE_PATH}/pwa-512.png`,
  `${BASE_PATH}/images/pala_enercon.jpg`,
  `${BASE_PATH}/images/pala_other.jpg`,
  `${BASE_PATH}/tinymce/js/tinymce/tinymce.min.js`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== APP_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match(`${BASE_PATH}/`))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();
        caches.open(APP_CACHE).then((cache) => cache.put(request, responseClone));
        return networkResponse;
      });
    })
  );
});
