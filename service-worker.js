const CACHE = "quizmania-core-v6";
const CORE_ASSETS = [
  "/", "/?source=pwa", "/index.html", "/manifest.webmanifest", "/assets/css/quizmania.css?v=6",
  "/assets/js/quizmania.js", "/assets/js/catalog.js", "/assets/js/pwa.js?v=6",
  "/assets/data/quizzes.json", "/assets/icons/app-192.png", "/assets/icons/app-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok && response.type === "basic") caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
    return response;
  }).catch(() => request.mode === "navigate" ? caches.match("/index.html") : Response.error())));
});
