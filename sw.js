/* Service worker : l'app doit s'ouvrir même sans réseau — sur la côte,
   entre deux caps, c'est la règle plutôt que l'exception.

   Stratégie : RÉSEAU D'ABORD, cache en secours.

   La première version faisait l'inverse (cache d'abord). Résultat : après
   plusieurs mises à jour du code, les téléphones continuaient d'afficher
   l'ancienne version, parce qu'il fallait penser à incrémenter CACHE à
   chaque fois — et il a suffi de l'oublier une fois pour que personne ne
   voie plus rien changer. Une app dont on ne voit pas les mises à jour est
   pire qu'une app un peu plus lente à ouvrir : on va donc chercher le
   réseau en premier, et on ne retombe sur le cache que s'il ne répond pas.

   Les appels vers Firebase ne sont pas interceptés. */

const CACHE = "bretagne-v4";

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

  /* `cache: "no-cache"` ne veut pas dire « ne pas mettre en cache » mais
     « toujours revalider auprès du serveur ». Sans ça, le cache HTTP du
     navigateur peut resservir un fichier périmé alors même qu'on croit
     aller au réseau — et on retombe sur le problème qu'on veut éviter.
     Le coût est un 304 vide quand rien n'a changé. */
  ev.respondWith(
    fetch(ev.request, { cache: "no-cache" })
      .then((res) => {
        // Réseau OK : on sert la version fraîche et on met le cache à jour
        // pour la prochaine sortie hors réseau.
        if (res.ok) {
          const copie = res.clone();
          caches.open(CACHE).then((c) => c.put(ev.request, copie));
        }
        return res;
      })
      .catch(async () => (await caches.match(ev.request)) || caches.match("./index.html"))
  );
});
