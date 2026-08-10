/* Service worker : l'app doit s'ouvrir même sans réseau — sur la côte,
   entre deux caps, c'est la règle plutôt que l'exception.

   Stratégie : cache d'abord pour la coquille de l'app (elle ne bouge pas),
   réseau d'abord pour rien du tout — les données partagées passent par
   fetch() vers Firebase, que le service worker laisse tranquille.

   Changer CACHE quand on modifie un fichier, pour forcer la mise à jour. */

const CACHE = "bretagne-v3";

const COQUILLE = [
  "./",
  "./index.html",
  "./styles.css",
  "./config.js",
  "./data.js",
  "./app.js",
  "./manifest.webmanifest",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(COQUILLE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((noms) => Promise.all(noms.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (ev) => {
  const url = new URL(ev.request.url);

  // Tout ce qui n'est pas la coquille (Firebase, liens externes) part au réseau.
  if (ev.request.method !== "GET" || url.origin !== self.location.origin) return;

  ev.respondWith(
    caches.match(ev.request).then((hit) => {
      if (hit) {
        // On rafraîchit en arrière-plan pour la prochaine ouverture.
        fetch(ev.request)
          .then((res) => res.ok && caches.open(CACHE).then((c) => c.put(ev.request, res)))
          .catch(() => {});
        return hit;
      }
      return fetch(ev.request).catch(() => caches.match("./index.html"));
    })
  );
});
