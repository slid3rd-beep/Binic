# Nos journées en Bretagne 🦞

Petite application pour organiser les journées d'un groupe en vacances dans les
Côtes-d'Armor, base à **Binic-Étables-sur-Mer**.

- Un **agenda de la semaine**, du samedi au samedi (huit journées, comme une
  location), découpé en quatre créneaux : matin, midi, après-midi, soir.
  On pose un lieu d'un geste, on le **déplace au doigt** d'un créneau à l'autre,
  et chaque journée affiche son coût estimé. Les journées vides se replient pour
  que la semaine entière tienne sur un écran.
- **14 lieux** déjà renseignés, de Binic à Saint-Malo, plus **vos propres ajouts** :
  une info prise à l'office de tourisme se saisit en 30 secondes (nom, tarif,
  durée, lien, et d'où vient l'info).
- Pour chaque lieu du catalogue : ce qu'il y a à voir, **les tarifs officiels** avec
  le lien vers la billetterie, les infos pratiques et **les sources**.
- Une **calculette** : nombre d'adultes / d'enfants, cases à cocher sur les visites,
  total estimé.
- Des **commentaires** par lieu, partagés entre les téléphones du groupe.

Zéro dépendance, zéro build, quatre fichiers statiques. Rien à maintenir.

---

## 1. Le mettre en ligne (5 minutes)

### Option A — GitHub Pages (gratuit, permanent)

1. Fusionner cette branche dans `main`.
2. Sur GitHub : **Settings → Pages**.
3. *Source* : « Deploy from a branch », branche `main`, dossier `/ (root)`. **Save**.
4. Une minute plus tard, l'app est sur
   `https://slid3rd-beep.github.io/binic/`.

### Option B — Netlify Drop (encore plus rapide, sans compte)

Glisser le dossier sur <https://app.netlify.com/drop>. URL immédiate.

### Sur l'iPhone : l'ajouter à l'écran d'accueil

Ouvrir l'URL dans Safari → bouton **Partager** → **Sur l'écran d'accueil**.
Elle s'ouvre alors en plein écran, comme une vraie app.

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

---

## 4. Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | structure de la page |
| `styles.css` | mise en forme, pensée pour l'iPhone |
| `data.js` | **les destinations, tarifs et sources** — le seul fichier à éditer au quotidien |
| `config.js` | l'URL de partage entre téléphones |
| `app.js` | agenda, glisser-déposer, calculette, lieux ajoutés, commentaires |
| `build-page-unique.js` | assemble le tout en un fichier autonome |
| `manifest.webmanifest` | permet l'ajout à l'écran d'accueil |

---

## Sur les tarifs

Ils ont été relevés le **10/08/2026** sur les sites officiels (offices de tourisme,
billetteries des monuments, compagnies maritimes) et chaque prix est accompagné de
son lien source dans l'app. Deux réserves honnêtes :

- les grilles changent en cours de saison, et certains sites n'affichaient qu'une
  partie de leurs tarifs (indiqué « à confirmer sur place » le cas échéant) ;
- les temps de trajet depuis Binic sont des estimations routières, pas des mesures.

Le lien officiel fait foi.
