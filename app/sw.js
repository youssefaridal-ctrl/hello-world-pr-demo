// Service worker d'Aridal Lab.
// Incrémenter CACHE_VERSION à chaque mise à jour de contenu (nouvelles leçons,
// nouveaux exercices, changements de structure) pour que l'app installée sur
// le téléphone détecte la nouvelle version et propose la mise à jour à l'utilisateur.
const CACHE_VERSION = "v3";
const CACHE_NAME = `aridal-lab-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/app.js",
  "./js/progress.js",
  "./js/speech.js",
  "./js/utils.js",
  "./js/data/conversations.js",
  "./js/data/grammar.js",
  "./js/data/vocabulary.js",
  "./js/views/categoryHub.js",
  "./js/views/conversation.js",
  "./js/views/conversationsList.js",
  "./js/views/flashcards.js",
  "./js/views/grammarDetail.js",
  "./js/views/grammarList.js",
  "./js/views/home.js",
  "./js/views/lessons.js",
  "./js/views/listening.js",
  "./js/views/profile.js",
  "./js/views/quiz.js",
  "./js/views/rapidResponse.js",
  "./js/views/shadowing.js",
  "./js/views/speaking.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !request.url.startsWith(self.location.origin)) return;

  // Navigations et fichiers HTML : réseau en priorité pour repérer vite les nouvelles versions,
  // avec repli sur le cache si hors-ligne.
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // Reste des ressources (JS, CSS, icônes) : cache en priorité pour la rapidité et le hors-ligne.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
