# Nos journées en Bretagne 🦞

Petite application pour organiser les journées d'un groupe en vacances dans les
Côtes-d'Armor, base à **Binic-Étables-sur-Mer**.

- Un **agenda de la semaine**, du samedi au samedi (huit journées, comme une
  location), découpé en quatre créneaux : matin, midi, après-midi, soir.
  On pose un lieu d'un geste, on le **déplace au doigt** d'un créneau à l'autre,
  et chaque journée affiche son coût estimé. Les journées vides se replient pour
  que la semaine entière tienne sur un écran.
- **15 lieux à moins d'une heure de route de Binic**, plus **vos propres ajouts** :
  une info prise à l'office de tourisme se saisit en 30 secondes (nom, tarif,
  durée, lien, et d'où vient l'info).
- Pour chaque lieu du catalogue : ce qu'il y a à voir, **les tarifs officiels** avec
  le lien vers la billetterie, les infos pratiques et **les sources**.
- Une **calculette** : nombre d'adultes / d'enfants, cases à cocher sur les visites,
  total estimé.
- Les **jours de marché** du secteur et les **brocantes** datées, affichés
  directement sur la bonne journée de l'agenda — sans rien avoir à ouvrir.
- Un **tri** de la liste : filtre par catégorie et ordre au choix.
- Des **commentaires** par lieu, partagés entre les téléphones du groupe.

Zéro dépendance, zéro build : que des fichiers statiques, servis tels quels.
Rien à maintenir. (Les deux scripts `build-*.js` sont facultatifs et ne servent
qu'à régénérer l'icône et la version en un seul fichier.)

---

## 1. Le mettre en ligne (2 minutes)

### GitHub Pages — gratuit, permanent, et le dépôt est déjà public

1. <https://github.com/slid3rd-beep/Binic/settings/pages>
2. *Source* : **Deploy from a branch**.
3. Branche : `claude/vacation-planning-app-bretagne-f5rq71` — dossier `/ (root)`. **Save**.
4. Une à deux minutes plus tard, l'app est en ligne sur :

   **<https://slid3rd-beep.github.io/Binic/>**

C'est cette adresse qu'on envoie aux copains. Elle marche sur tous les téléphones,
sans compte et sans installation.

> Le dépôt n'a pas encore de branche `main` : la liste déroulante ne propose donc
> que la branche ci-dessus. Si un jour vous créez `main`, repassez la source
> dessus — l'URL publique, elle, ne change pas.

### Alternative sans GitHub — Netlify Drop

Glisser le dossier sur <https://app.netlify.com/drop>. URL immédiate, sans compte.

### Sur l'iPhone : la vraie expérience plein écran

Ouvrir l'adresse dans **Safari** → bouton **Partager** → **Sur l'écran d'accueil**.
L'app s'ouvre alors sans barre d'adresse ni onglets, avec sa propre icône (rose des
vents), exactement comme une app installée. À faire par chacun sur son téléphone.

Le bouton **⤴** en haut de l'app ouvre la feuille de partage iOS pour envoyer le
lien par iMessage ou WhatsApp (et le copie dans le presse-papier ailleurs).

### Hors ligne

Un service worker (`sw.js`) garde une copie de l'app : elle s'ouvre et reste
utilisable sans réseau — utile entre deux caps. Seule la synchronisation des
données attend le retour du réseau.

Il fonctionne **réseau d'abord, cache en secours** : en ligne, on voit toujours la
dernière version ; hors ligne, on retombe sur la copie. Il n'y a donc rien à faire
après une modification du code. (La première version faisait l'inverse et
demandait d'incrémenter `CACHE` à la main à chaque fois — un oubli suffisait pour
que les téléphones restent bloqués sur une vieille version.)

**Si un téléphone affiche encore l'ancienne version** : fermer complètement l'app
et la rouvrir deux fois — le temps que le nouveau service worker s'installe. En
dernier recours, la retirer de l'écran d'accueil et la rajouter.

---

## 2. Partage entre téléphones

Par défaut (`SYNC_URL` vide dans `config.js`), l'app fonctionne mais **chacun garde
son agenda, ses lieux ajoutés et ses commentaires sur son propre téléphone**.

Pour que tout le groupe voie la même chose, il faut un petit espace de stockage
en ligne. Le plus simple et gratuit : **Firebase Realtime Database**.

1. Aller sur <https://console.firebase.google.com> → **Créer un projet**
   (on peut désactiver Google Analytics, ça va plus vite).
2. Menu de gauche → **Realtime Database** → **Créer une base de données**.
   Choisir une région Europe (`europe-west1`).
3. Choisir **Démarrer en mode test**. ⚠️ En mode test la base est ouverte en
   lecture/écriture à qui connaît l'URL, et Firebase la referme automatiquement
   au bout de 30 jours — parfait pour des vacances, à ne pas utiliser pour des
   données sensibles.
4. Copier l'URL affichée en haut, du type
   `https://mon-projet-default-rtdb.europe-west1.firebasedatabase.app`.
5. La coller dans `config.js` :

   ```js
   const SYNC_URL = "https://mon-projet-default-rtdb.europe-west1.firebasedatabase.app";
   ```

6. Commit + push. C'est tout : chaque téléphone qui ouvre l'URL voit l'agenda,
   les lieux et les commentaires des autres (rafraîchissement toutes les 10 s).

Chaque écriture ne touche qu'une clé précise (`creneaux/<jour|créneau>/<lieu>`,
`lieux/<clé>`, `comments/<clé>`), jamais le document entier : deux téléphones qui
modifient la semaine en même temps ne s'écrasent pas.

Si le réseau tombe (et ça arrive, sur la côte), l'app continue de fonctionner
avec la dernière copie locale et prévient que la modification n'est pas partie.

---

## 3. Deux façons d'ajouter un lieu

**Depuis l'app** (pour tout le monde, sans toucher au code) : bouton
« + Ajouter un lieu » dans l'onglet *Lieux*, ou « Ajouter un lieu… » au bas du
sélecteur quand on remplit un créneau. C'est fait pour la situation où on récupère
une information à l'office de tourisme : nom, commune, catégorie, description,
tarif affiché, durée, lien, et un champ « d'où vient l'info » pour rester sourcé.
Les deux nombres *adulte / enfant* alimentent le total estimé de la journée.

**Dans le code** (pour une fiche complète avec plusieurs visites et sources) :
tout est dans **`data.js`**, un seul tableau lisible. Copier un bloc existant et
changer les valeurs :

```js
{
  id: "identifiant-unique",     // sans espace ni accent
  nom: "Nom affiché",
  sousTitre: "Une ligne d'accroche",
  emoji: "⛵",
  couleur: "#33684f",           // couleur du bandeau de la carte
  cat: "sortie",                // "sortie" ou "resto"
  trajet: { km: 30, min: 35, note: "Précision sur la route" },
  duree: "Demi-journée",
  resume: "Deux ou trois phrases.",
  aVoir: [
    {
      nom: "Le lieu",
      detail: "Horaires, durée, remarques.",
      prix: {
        adulte: 8.5,            // sert au calcul du total
        enfant: 6,
        forfait: 0,             // optionnel : prix fixe, ex. un parking
        optionnel: true,        // optionnel : case décochée par défaut
        label: "8,50 € adulte / 6 € enfant",   // texte affiché
      },
      lien: "https://site-officiel...",
      lienLabel: "Réserver — site officiel",
    },
  ],
  pratique: ["Un conseil.", "Un autre."],
  sources: [{ titre: "Nom de la source", url: "https://..." }],
}
```

La constante `VERIF` en haut du fichier est la date de relevé des tarifs affichée
partout dans l'app : la mettre à jour quand vous re-vérifiez les prix.

### Marchés et brocantes

Deux tableaux séparés en bas de `data.js`, parce qu'ils n'obéissent pas à la même
logique : un **marché** revient chaque semaine, une **brocante** a lieu une fois.

```js
// MARCHES — `jour` suit getDay() : 0 = dimanche, 1 = lundi … 6 = samedi
{ commune: "Binic", jour: 4, horaire: "8 h – 13 h",
  lieu: "Place Le Pomellec et rue Joffre",
  min: 0,              // minutes depuis Binic, filtré par RAYON_MAX_MIN
  creneau: "matin" },  // "soir" pour les marchés nocturnes

// BROCANTES — datées, elles disparaissent d'elles-mêmes une fois passées
{ date: "2026-08-13", commune: "Binic-Étables-sur-Mer",
  nom: "Bouquinistes et brocante — Festival Paimpol Mon Amour",
  horaire: "dès 10 h", min: 0 },
```

Les deux s'affichent automatiquement sur la bonne journée de l'agenda, et
alimentent les fiches « Marchés du coin » et « Brocantes de la semaine » — il n'y
a rien à saisir deux fois. Les jours de marché ont été vérifiés le 10/08/2026
auprès des mairies et offices de tourisme ; le calendrier des vide-greniers,
lui, bouge jusqu'au dernier moment.

### Tri de la liste

Dans l'onglet *Lieux* : filtre par catégorie (Tout · Sorties · Restos · Marchés ·
Ajoutés, avec le compte de chacune) et ordre au choix — distance, note, prix, nom,
ajout récent.

Trois partis pris. Les valeurs manquantes ne valent pas zéro : un lieu sans note
n'est pas un lieu noté 0, il part **en fin de liste** plutôt que de remonter à
tort — même chose pour un lieu ajouté sans distance connue.

Le choix de tri est rangé dans `localStorage`, pas dans l'état partagé : c'est un
confort d'affichage personnel, chacun trie comme il veut sans l'imposer aux autres.

**Le filtre, lui, ne survit pas au rechargement.** C'est un geste ponctuel, pas
une préférence : le garder d'une session à l'autre revenait à rouvrir l'app sur
2 lieux au lieu de 15, sans qu'on comprenne où les autres étaient passés. Et tant
qu'un filtre est actif, une ligne indique combien de lieux il masque avec un
bouton « Tout afficher » — un filtre ne doit jamais être un cul-de-sac.

Le sélecteur qui s'ouvre sur un créneau ignore volontairement le filtre : quand
on remplit une journée, on veut tout avoir sous la main.

### Rayon d'action

`RAYON_MAX_MIN` (en haut de `data.js`) limite la liste aux lieux à moins de tant
de minutes de Binic. Il vaut **60**. Les fiches au-delà ne sont pas supprimées,
juste masquées — et un lieu déjà posé dans la semaine reste affiché même s'il
sort du rayon.

| Valeur | Ce que ça remet |
|---|---|
| `60` | *(actuel)* — 12 lieux |
| `70` | + Dinan, Cap Fréhel & Fort la Latte, Ploumanac'h, Parc du Radôme |
| `90` | + Saint-Malo |

---

## 4. Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | structure de la page |
| `styles.css` | mise en forme, pensée pour l'iPhone |
| `data.js` | **les destinations, tarifs et sources** — le seul fichier à éditer au quotidien |
| `config.js` | l'URL de partage entre téléphones |
| `app.js` | agenda, glisser-déposer, calculette, lieux ajoutés, commentaires |
| `sw.js` | cache hors ligne |
| `manifest.webmanifest`, `icone.svg`, `*.png` | icône et plein écran sur l'écran d'accueil |
| `build-page-unique.js` | assemble le tout en un fichier autonome |
| `build-icones.js` | régénère les PNG depuis `icone.svg` |


---

## Sur les tarifs

Ils ont été relevés le **10/08/2026** sur les sites officiels (offices de tourisme,
billetteries des monuments, compagnies maritimes) et chaque prix est accompagné de
son lien source dans l'app. Deux réserves honnêtes :

- les grilles changent en cours de saison, et certains sites n'affichaient qu'une
  partie de leurs tarifs (indiqué « à confirmer sur place » le cas échéant) ;
- les temps de trajet depuis Binic sont des estimations routières, pas des mesures.

Le lien officiel fait foi.
