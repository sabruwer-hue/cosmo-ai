const CACHE_NAME = "cosmo-shell-v3";
const SHELL = [
  "./", "./index.html", "./app.html", "./subscribe.html", "./work.html", "./admin.html", "./academy.html", "./retail.html", "./product.html",
  "./assets/styles.css", "./assets/cosmo-live.js", "./assets/app.js",
  "./assets/cosmo-icon.svg", "./assets/cosmo-work-icon.svg", "./assets/cosmo-admin-icon.svg", "./assets/cosmo-retail-icon.svg",
  "./manifest.webmanifest", "./work.webmanifest", "./admin.webmanifest", "./retail.webmanifest"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (/\/(rest\/v1|functions\/v1|auth\/v1)\//.test(url.pathname)) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || caches.match("./index.html")));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});