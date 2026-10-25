const CACHE = "plan10k-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./assets/styles.css?v=4",
  "./assets/plan.js?v=4",
  "./assets/app.js?v=4",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Nie cache'uj adresów powrotu z OAuth (kod jest jednorazowy).
  const isOAuthCallback = url.searchParams.has("code") || url.searchParams.has("state");

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok && !isOAuthCallback) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
  );
});
