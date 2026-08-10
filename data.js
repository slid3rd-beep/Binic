/* Données des destinations — Côtes-d'Armor, base : Binic-Étables-sur-Mer.
   Tarifs relevés le 10/08/2026. Chaque prix porte un lien vers sa source :
   à re-vérifier sur place, les sites changent leurs grilles en cours de saison. */

const VERIF = "10/08/2026";

const DESTINATIONS = [
  {
    id: "pontrieux",
    nom: "Pontrieux",
    sousTitre: "La cité des 50 lavoirs, sur le Trieux",
    emoji: "🛶",
    couleur: "#2b6e78",
    cat: "sortie",
    trajet: { km: 42, min: 45, note: "Par Saint-Quay puis la D787" },
    duree: "Demi-journée",
    resume:
      "Petite Cité de Caractère au fond de l'estuaire du Trieux, connue pour ses cinquante lavoirs fleuris alignés au bord de l'eau — on les découvre en barque avec un pilote, ou en pagayant soi-même. Le club nautique part du même endroit pour des descentes de rivière et d'estuaire.",
    aVoir: [
      {
        nom: "Promenade en barque des lavoirs",
        detail:
          "Visite commentée des 50 lavoirs par un pilote, ~45 min. Du 2 mai au 28 septembre, 10 h – 18 h (10 h 30 les dimanches et jours fériés). Balades nocturnes sur le parcours illuminé à partir de la mi-juillet. Embarcadère : Jardin de la Passerelle, rue de Traou Mélédern.",
        prix: { adulte: 5, enfant: 3, label: "dès 5 € adulte / 3 € enfant (4–12 ans) / gratuit –4 ans" },
        lien: "https://www.pontrieux.bzh/les-lavoirs-fleuris/",
        lienLabel: "Les lavoirs fleuris — ville de Pontrieux",
      },
      {
        nom: "Canoë-kayak sur l'estuaire du Trieux",
        detail:
          "Club Nautique Pontrivien : sorties de 2 à 3 h ou 3 à 4 h, descente de rivière en amont ou de l'estuaire en aval. Équipement, encadrement, assurance et navette compris. Juillet-août : tous les jours sauf dimanche, 9 h – 12 h et 14 h – 18 h.",
        prix: { adulte: 35, enfant: 25, label: "35 € adulte / 25 € enfant (–12 ans) — estuaire", optionnel: true },
        lien: "https://www.canoe-kayak-pontrieux.fr/estuaire",
        lienLabel: "Club Nautique Pontrivien",
      },
      {
        nom: "Le bourg et les quais",
        detail: "Maisons à pans de bois, la Tour Eiffel de Pontrieux, marché le lundi matin.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.guingamp-paimpol.com/",
        lienLabel: "Office de tourisme Guingamp – Baie de Paimpol",
      },
    ],
    pratique: [
      "La barque est le « pas cher » du coin : 5 € et 45 min, réservation conseillée en août.",
      "Le canoë part du même quartier — on peut enchaîner les deux dans la matinée.",
      "Réserver la barque au 02 96 95 60 31.",
    ],
    sources: [
      { titre: "Les lavoirs fleuris — ville de Pontrieux", url: "https://www.pontrieux.bzh/les-lavoirs-fleuris/" },
      { titre: "Promenades en barque — Côtes d'Armor Tourisme", url: "https://www.cotesdarmor.com/fr/fiche/equipements-de-loisirs/promenades-decouverte-des-lavoirs-en-barques-pontrieux_TFOLOIBRE0220HA6338/" },
      { titre: "Club Nautique Pontrivien — estuaire", url: "https://www.canoe-kayak-pontrieux.fr/estuaire" },
      { titre: "Balade en canoë-kayak sur le Trieux — Guingamp-Paimpol", url: "https://www.guingamp-paimpol.com/nos-experiences/balade-en-canoe-kayak-a-la-decouverte-de-l-estuaire-du-trieux" },
    ],
  },

  {
    id: "rolland",
    nom: "Rolland",
    sousTitre: "Plourhan — le mieux noté du secteur",
    emoji: "🍽️",
    couleur: "#7a3f2b",
    cat: "resto",
    note: { valeur: 4.9, avis: 329, sur: "Tripadvisor", url: "https://www.tripadvisor.com/Restaurant_Review-g3137939-d24142236-Reviews-Rolland-Plourhan_Cotes_d_Armor_Brittany.html" },
    budget: "Bib Gourmand — réserver",
    trajet: { km: 9, min: 13, note: "12 Chemin du Moulin Rolland, Plourhan — entre Binic et Saint-Quay" },
    duree: "2 h",
    resume:
      "Deux frères, Emmanuel au potager et Pierre en cuisine (ex-Mare aux Oiseaux), ont quitté Paris pour retaper un moulin abandonné. Cuisine de la mer et légumes bio cultivés sur place, la viande est écartée. Bib Gourmand au Michelin, repéré aussi par Le Fooding et Gault & Millau. Vue sur les champs et cuisine ouverte.",
    aVoir: [
      {
        nom: "Déjeuner ou dîner",
        detail: "Bistronomie autour du poisson, des coquillages et du potager. Réservation indispensable en août.",
        prix: { adulte: 0, enfant: 0, label: "Carte non publiée — Bib Gourmand" },
        lien: "https://restaurant-rolland.fr/",
        lienLabel: "Site officiel et réservation",
      },
    ],
    pratique: [
      "À 13 min de Binic : le plus proche de la liste, et le mieux noté.",
      "Cuisine sans viande — à savoir si quelqu'un du groupe n'aime pas le poisson.",
      "Réserver plusieurs jours à l'avance en pleine saison.",
    ],
    sources: [
      { titre: "Rolland — site officiel", url: "https://restaurant-rolland.fr/" },
      { titre: "Rolland — guide MICHELIN", url: "https://guide.michelin.com/us/en/bretagne/plourhan_1568608/restaurant/rolland" },
      { titre: "Rolland — Tripadvisor (4,9/5, 329 avis)", url: "https://www.tripadvisor.com/Restaurant_Review-g3137939-d24142236-Reviews-Rolland-Plourhan_Cotes_d_Armor_Brittany.html" },
      { titre: "Rolland — Le Fooding", url: "https://lefooding.com/en/restaurants/rolland" },
    ],
  },

  {
    id: "le-tachen",
    nom: "Le Tachen",
    sousTitre: "Ploëzal — planches et vins, entre Pontrieux et le domaine",
    emoji: "🍷",
    couleur: "#7a3f5e",
    cat: "resto",
    note: { valeur: 4.8, avis: 237, sur: "Restaurant Guru", url: "https://restaurantguru.com/Bar-Creperie-du-Tachen-Pontrieux" },
    budget: "Planches et tapas",
    trajet: { km: 46, min: 50, note: "À Ploëzal, à 5 min de la Roche-Jagu et 5 km de Pontrieux" },
    duree: "1 h 30",
    resume:
      "Attention, ce n'est plus vraiment un restaurant : c'est devenu un bar à vins et à bières avec des planches — huîtres, charcuterie, camembert rôti, escargots farcis, os à moelle, rillettes de la mer. Décor décalé, patrons réputés très accueillants, belle cave. Idéalement placé entre Pontrieux et la Roche-Jagu.",
    aVoir: [
      {
        nom: "Planches et cave à vins",
        detail: "Ardoises à partager plutôt qu'un menu classique. Vérifier les horaires : c'est un bar, pas un service de midi garanti.",
        prix: { adulte: 0, enfant: 0, label: "À la planche — tarifs non publiés" },
        lien: "https://www.petitfute.com/v8574-ploezal-22260/c1169-s-amuser-sortir/c182-bar-cafe/c1239-bar-a-vin/1996811-le-tachen.html",
        lienLabel: "Fiche et avis — Petit Futé",
      },
    ],
    pratique: [
      "Formule apéro dînatoire plutôt que déjeuner assis : à caler au soir, ou au midi en vérifiant l'ouverture.",
      "Si le groupe veut un vrai déjeuner à table, Le Petit Jagu est à côté — mais il est à 4,4/5, sous votre seuil.",
      "Téléphoner avant de faire la route : les horaires d'un bar bougent.",
    ],
    sources: [
      { titre: "Le Tachen — Restaurant Guru (4,8/5, 237 avis)", url: "https://restaurantguru.com/Bar-Creperie-du-Tachen-Pontrieux" },
      { titre: "Le Tachen — Petit Futé", url: "https://www.petitfute.co.uk/v8574-ploezal-22260/c1169-s-amuser-sortir/c182-bar-cafe/c1239-bar-a-vin/1996811-le-tachen.html" },
      { titre: "Le Tachen — Tripadvisor", url: "https://www.tripadvisor.com/Restaurant_Review-g8478011-d8305912-Reviews-Le_Tachen-Ploezal_Cotes_d_Armor_Brittany.html" },
    ],
  },

  {
    id: "ptit-flot",
    nom: "Le P'tit Flot",
    sousTitre: "Saint-Quay-Portrieux — à 12 min de Binic",
    emoji: "🍽️",
    couleur: "#2b5f7a",
    cat: "resto",
    note: { valeur: 4.8, avis: null, sur: "Google", url: "https://www.tripadvisor.com/Restaurants-g735170-Saint_Quay_Portrieux_Cotes_d_Armor_Brittany.html" },
    budget: "Carte non publiée",
    trajet: { km: 8, min: 12, note: "Saint-Quay-Portrieux, sur la route de Paimpol" },
    duree: "1 h 30",
    resume:
      "Le mieux noté de Saint-Quay-Portrieux, la station voisine. Pratique pour un dîner sans faire de route après une journée sur la côte.",
    aVoir: [
      {
        nom: "Déjeuner ou dîner",
        detail: "Réserver en août : Saint-Quay est très fréquenté.",
        prix: { adulte: 0, enfant: 0, label: "Tarifs non publiés en ligne" },
        lien: "https://www.tripadvisor.com/Restaurants-g735170-Saint_Quay_Portrieux_Cotes_d_Armor_Brittany.html",
        lienLabel: "Restaurants de Saint-Quay — Tripadvisor",
      },
    ],
    pratique: [
      "La note vient d'un agrégateur : à recouper sur Google Maps avant de réserver.",
      "Saint-Quay est à 12 min de Binic par la côte.",
    ],
    sources: [
      { titre: "Restaurants de Saint-Quay-Portrieux — Tripadvisor", url: "https://www.tripadvisor.com/Restaurants-g735170-Saint_Quay_Portrieux_Cotes_d_Armor_Brittany.html" },
      { titre: "Saint-Quay-Portrieux — Restaurant Guru", url: "https://restaurantguru.com/Saint-Quay-Portrieux" },
    ],
  },

  {
    id: "restos-paimpol",
    nom: "Déjeuner à Paimpol",
    sousTitre: "Trois adresses à 4,7/5 et plus",
    emoji: "🦪",
    couleur: "#8a5a2b",
    cat: "resto",
    note: { valeur: 4.8, avis: null, sur: "Google", url: "https://restaurantguru.com/Paimpol" },
    budget: "3 adresses au choix",
    trajet: { km: 30, min: 35, note: "À combiner avec l'abbaye de Beauport ou le départ pour Bréhat" },
    duree: "1 h 30",
    resume:
      "Les quais de Paimpol concentrent les tables de fruits de mer — huîtres, coquillages, sardines au beurre demi-sel. Trois adresses passent votre seuil ; à réserver, c'est le port le plus couru du secteur en août.",
    aVoir: [
      {
        nom: "Le Fifties — 4,8/5",
        detail: "2 rue des Islandais. Plus de 280 avis. Cuisine américaine, options végétariennes — le mieux noté de la ville, mais pas une table de fruits de mer.",
        prix: { adulte: 0, enfant: 0, label: "4,8/5 sur Google (280+ avis)" },
        lien: "https://restaurantguru.com/Le-Fifties-Paimpol",
        lienLabel: "Fiche et avis",
      },
      {
        nom: "Le 18 Cuisine Bistro — 4,7/5",
        detail: "18 rue des Huit Patriotes. Plus de 280 avis. Bistro.",
        prix: { adulte: 0, enfant: 0, label: "4,7/5 sur Google (280+ avis)" },
        lien: "https://restaurantguru.com/Paimpol",
        lienLabel: "Restaurants de Paimpol",
      },
      {
        nom: "OSTIUM — 4,7/5",
        detail: "2 chemin de Kergroas. Plus de 80 avis.",
        prix: { adulte: 0, enfant: 0, label: "4,7/5 sur Google (80+ avis)" },
        lien: "https://restaurantguru.com/Paimpol",
        lienLabel: "Restaurants de Paimpol",
      },
    ],
    pratique: [
      "Juste sous le seuil, si tout est complet : Le P'tit Bistrot et le Bar à Huîtres Chez Arin, à 4,6/5.",
      "Se combine avec l'abbaye de Beauport (2 km) ou l'embarquement pour Bréhat.",
      "Les notes viennent d'un agrégateur d'avis Google : à recouper avant de réserver.",
    ],
    sources: [
      { titre: "Restaurants de Paimpol — Restaurant Guru", url: "https://restaurantguru.com/Paimpol" },
      { titre: "Le Fifties — fiche et note", url: "https://restaurantguru.com/Le-Fifties-Paimpol" },
      { titre: "Restaurants de Paimpol — Tripadvisor", url: "https://www.tripadvisor.com/Restaurants-g488278-Paimpol_Cotes_d_Armor_Brittany.html" },
    ],
  },

  {
    id: "roche-jagu",
    nom: "Domaine de la Roche-Jagu",
    sousTitre: "Château du XVe et jardin remarquable, à Ploëzal",
    emoji: "🌿",
    couleur: "#3f6b3a",
    cat: "sortie",
    trajet: { km: 48, min: 52, note: "À 5 km au nord de Pontrieux, par Ploëzal" },
    duree: "Demi-journée",
    resume:
      "Forteresse du XVe siècle dominant une boucle du Trieux, au milieu d'un parc d'inspiration médiévale labellisé « Jardin remarquable ». Le domaine appartient au Département : le parc et les sentiers sont libres et gratuits toute l'année, seul le château et ses expositions sont payants.",
    aVoir: [
      {
        nom: "Parc et jardins du domaine",
        detail: "Jardin remarquable, sentiers vers le Trieux, points de vue sur la boucle du fleuve. Accès libre toute l'année.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://larochejagu.cotesdarmor.fr/",
        lienLabel: "Site officiel du domaine",
      },
      {
        nom: "Château et expositions",
        detail:
          "Juillet-août : tous les jours 10 h – 13 h et 14 h – 19 h (hors saison 10 h – 12 h et 14 h – 18 h). Visite guidée tous les jours à 15 h.",
        prix: {
          adulte: 6.5,
          enfant: 4.5,
          label: "6,50 € plein / 4,50 € réduit / 15 € tarif famille",
        },
        lien: "https://larochejagu.cotesdarmor.fr/",
        lienLabel: "Horaires et tarifs — site officiel",
      },
      {
        nom: "Visite guidée du parc",
        detail: "Sur les jardins et le paysage du Trieux, programmée selon les jours.",
        prix: { adulte: 0, enfant: 0, label: "Voir le programme sur place", optionnel: true },
        lien: "https://larochejagu.cotesdarmor.fr/visites-guidees-du-parc",
        lienLabel: "Visites guidées du parc",
      },
    ],
    pratique: [
      "Le parc seul vaut déjà le détour, et il ne coûte rien.",
      "Tél. 02 96 95 62 35.",
      "Enchaînement naturel : Pontrieux le matin, déjeuner à Ploëzal, le domaine l'après-midi.",
    ],
    sources: [
      { titre: "Domaine de la Roche-Jagu — site officiel du Département", url: "https://larochejagu.cotesdarmor.fr/" },
      { titre: "Domaine départemental de la Roche-Jagu — Côtes d'Armor Tourisme", url: "https://www.cotesdarmor.com/fr/fiche/patrimoine-culturel/domaine-departemental-de-la-roche-jagu-ploezal_TFOPCUBRE0220HA66SA/" },
      { titre: "Comité des Parcs et Jardins de France", url: "https://www.parcsetjardins.fr/jardins/530-domaine-departemental-de-la-roche-jagu" },
    ],
  },

  {
    id: "brehat",
    nom: "Île de Bréhat",
    sousTitre: "L'île aux fleurs, sans voitures",
    emoji: "🌺",
    couleur: "#b8436a",
    trajet: { km: 40, min: 45, note: "Embarquement à la Pointe de l'Arcouest (Ploubazlanec)" },
    duree: "Journée complète",
    resume:
      "Une île sans voiture à 10 minutes de bateau du continent, au climat si doux que les mimosas, figuiers et agapanthes y poussent en pleine terre. Tout se fait à pied ou à vélo : le tour complet de l'île prend environ 4 h de marche.",
    aVoir: [
      {
        nom: "Traversée en vedette (A/R)",
        detail: "10 min de traversée depuis la Pointe de l'Arcouest, départs toutes les 30 min en été.",
        prix: { adulte: 11.9, enfant: 10.2, label: "11,90 € adulte / 10,20 € enfant (A/R)" },
        lien: "https://www.vedettesdebrehat.com/",
        lienLabel: "Réserver — Vedettes de Bréhat",
      },
      {
        nom: "Option tour de l'île commenté",
        detail: "Traversée + tour de l'île en bateau avec commentaire. Remplace le billet simple : cocher l'un OU l'autre.",
        prix: { adulte: 17.9, enfant: 12.4, label: "17,90 € adulte / 12,40 € enfant", optionnel: true },
        lien: "https://www.vedettesdebrehat.com/",
        lienLabel: "Vedettes de Bréhat",
      },
      {
        nom: "Phare du Paon",
        detail: "Pointe nord de l'île, granit rose et falaises. ~2 km à pied depuis le port.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.iledebrehat.fr/",
        lienLabel: "Site officiel de l'île",
      },
      {
        nom: "Croix de Maudez & moulin du Birlot",
        detail: "Grande croix de granit face à la mer, moulin à marée. Boucle d'environ 2 h 15.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.brehat-infos.fr/images/documents/plan-de-l-ile-de-brehat.pdf",
        lienLabel: "Plan de l'île (PDF)",
      },
      {
        nom: "Location de vélo sur l'île",
        detail: "Au port. Compter ~14–15 €/jour le VTT, ~30 €/jour l'électrique. Vélo embarqué sur la vedette : 18 € A/R.",
        prix: { adulte: 15, enfant: 15, label: "≈ 15 €/jour (VTT)", optionnel: true },
        lien: "https://www.locationvelosbrehat.com/",
        lienLabel: "Location Dalibot",
      },
    ],
    pratique: [
      "Chiens acceptés sur la vedette : 3 €/animal A/R.",
      "Prévoir un pique-nique ou réserver : peu de tables sur l'île en août.",
      "Dernier retour en fin d'après-midi — bien noter l'horaire au départ.",
    ],
    sources: [
      { titre: "Vedettes de Bréhat (compagnie officielle)", url: "https://www.vedettesdebrehat.com/" },
      { titre: "Horaires et tarifs traversées — Cobaturage", url: "https://www.cobaturage.bzh/fr/compagnies/vedettes-de-brehat/" },
      { titre: "Mairie de l'île de Bréhat — transports", url: "https://www.iledebrehat.fr/les-transports/vedettes-de-transport-de-passagers/" },
      { titre: "Bréhat Infos — guide et plan", url: "https://brehat-infos.fr/decouvrir/les-guides/272-les-vedettes-de-brehat" },
    ],
  },

  {
    id: "cap-frehel",
    nom: "Cap Fréhel & Fort la Latte",
    sousTitre: "Falaises de 70 m et château sur la mer",
    emoji: "🏰",
    couleur: "#2f6f8f",
    trajet: { km: 60, min: 65, note: "Par Erquy et Plévenon" },
    duree: "Journée",
    resume:
      "Le duo le plus spectaculaire de la côte : la lande rase et les falaises du Cap Fréhel (Grand Site de France), puis le Fort la Latte / château de La Roche Goyon planté sur son éperon rocheux, à 1 h de marche par le GR34 ou 10 min en voiture.",
    aVoir: [
      {
        nom: "Château de La Roche Goyon (Fort la Latte)",
        detail: "Forteresse du XIVe siècle sur la mer. Dernière entrée 30 min avant la fermeture. Juillet-août : 10 h 30 – 19 h.",
        prix: { adulte: 8.5, enfant: 6, label: "8,50 € adulte / 7,50 € réduit / 6 € enfant (–12 ans) / gratuit –5 ans" },
        lien: "https://www.lefortlalatte.com/preparer-votre-visite",
        lienLabel: "Préparer sa visite — site officiel",
      },
      {
        nom: "Phare du Cap Fréhel",
        detail: "Montée au phare, vue sur toute la côte. Juillet-août : tous les jours 10 h – 19 h.",
        prix: { adulte: 2, enfant: 1.5, label: "2 € adulte / 1,50 € (10–14 ans) / gratuit –10 ans" },
        lien: "https://www.dinan-capfrehel.com/sit/phare-du-cap-frehel/",
        lienLabel: "Office de tourisme Dinan-Cap Fréhel",
      },
      {
        nom: "Parking du Cap",
        detail: "Payant toute l'année, à l'entrée du site.",
        prix: { adulte: 0, enfant: 0, label: "3 € / voiture (5 € camping-car)", forfait: 3 },
        lien: "https://www.plevenon.fr/plevenon-cap-frehel-et-ses-sites-emblematiques/",
        lienLabel: "Mairie de Plévenon",
      },
      {
        nom: "Sentier du Cap au Fort (GR34)",
        detail: "≈ 4 km le long des falaises, environ 1 h. Le plus beau morceau de côte du secteur.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.dinan-capfrehel.com/au-coeur-de-la-nature/le-grand-site-de-france-cap-derquy-cap-frehel/",
        lienLabel: "Grand Site de France",
      },
    ],
    pratique: [
      "La lande est à nu : casquette, eau, et coupe-vent même en août.",
      "Falaises non protégées par endroits — attention avec les enfants.",
      "Combiner : matin le Cap, pique-nique, après-midi le Fort.",
    ],
    sources: [
      { titre: "Fort la Latte — horaires et tarifs officiels", url: "https://www.lefortlalatte.com/visite-la-roche-goyon" },
      { titre: "Phare du Cap Fréhel — Côtes d'Armor Tourisme", url: "https://www.cotesdarmor.com/fr/fiche/patrimoine-culturel/phare-du-cap-frehel-plevenon_TFOPCUBRE022FS000C8/" },
      { titre: "Dinan-Cap Fréhel Tourisme", url: "https://www.dinan-capfrehel.com/sit/phare-du-cap-frehel/" },
    ],
  },

  {
    id: "paimpol",
    nom: "Paimpol & Abbaye de Beauport",
    sousTitre: "Port d'Islande et abbaye les pieds dans l'eau",
    emoji: "⚓",
    couleur: "#33684f",
    trajet: { km: 30, min: 35, note: "Par la D786, jolie route côtière" },
    duree: "Demi-journée à journée",
    resume:
      "Le port des Islandais, ses quais et ses ruelles de granit, plus l'abbaye maritime de Beauport à 2 km : ruines gothiques du XIIIe siècle ouvertes sur la baie, entourées d'un domaine naturel de 100 hectares.",
    aVoir: [
      {
        nom: "Abbaye maritime de Beauport",
        detail: "Ouverte du 1er mars au 11 novembre. Juillet-août : tous les jours 10 h 30 – 19 h.",
        prix: { adulte: 7, enfant: 0, label: "7 € plein tarif (tarifs réduit/enfant sur place)" },
        lien: "https://abbayebeauport.com/",
        lienLabel: "Site officiel de l'abbaye",
      },
      {
        nom: "Domaine naturel de Beauport",
        detail: "Espace naturel protégé, accès libre toute l'année, sentiers vers la baie.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.ville-paimpol.fr/abbaye-de-beauport/",
        lienLabel: "Ville de Paimpol",
      },
      {
        nom: "Port et vieille ville de Paimpol",
        detail: "Quais, place du Martray, maisons d'armateurs. Marché le mardi matin.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.guingamp-paimpol.com/",
        lienLabel: "Office de tourisme Guingamp – Baie de Paimpol",
      },
    ],
    pratique: [
      "Réservation conseillée pour les restaurants du port en août.",
      "L'abbaye est bien plus belle à marée haute — vérifier les horaires de marée.",
      "Tél. abbaye : 02 96 55 18 58.",
    ],
    sources: [
      { titre: "Abbaye de Beauport — site officiel", url: "https://abbayebeauport.com/en/visitor-information.html" },
      { titre: "Abbaye de Beauport — Côtes d'Armor Tourisme", url: "https://www.cotesdarmor.com/fr/fiche/patrimoine-culturel/abbaye-de-beauport-paimpol_TFOPCUBRE022FS000AQ/" },
      { titre: "Office de tourisme Guingamp – Baie de Paimpol", url: "https://www.guingamp-paimpol.com/" },
    ],
  },

  {
    id: "ploumanach",
    nom: "Ploumanac'h & Côte de Granit Rose",
    sousTitre: "Village préféré des Français 2015",
    emoji: "🪨",
    couleur: "#a94e30",
    trajet: { km: 65, min: 65, note: "Via Guingamp ou la côte" },
    duree: "Journée complète",
    resume:
      "Chaos de rochers roses posés sur une mer turquoise. Le sentier des douaniers (GR34) longe les blocs entre la plage de Trestraou (Perros-Guirec) et la plage Saint-Guirec : 8 km aller-retour, faisable en famille, avec le phare de Mean Ruz en granit rose au milieu.",
    aVoir: [
      {
        nom: "Sentier des douaniers (GR34)",
        detail: "Trestraou → Saint-Guirec, 8 km A/R. Boucle plus courte d'1 h possible autour de Ploumanac'h.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.perros-guirec.com/accueil/preparer-mon-sejour/sortir-et-bouger/balades-et-randos/circuits-pedestres/le-sentier-des-douaniers/",
        lienLabel: "Le sentier — Ville de Perros-Guirec",
      },
      {
        nom: "Phare de Mean Ruz",
        detail: "Phare de granit rose de 1946, l'un des plus photographiés de Bretagne. Vu de l'extérieur.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.bretagne-cotedegranitrose.com/",
        lienLabel: "Office de tourisme Côte de Granit Rose",
      },
      {
        nom: "Oratoire et plage Saint-Guirec",
        detail: "Petit oratoire posé sur la plage, submergé à marée haute.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.bretagne-cotedegranitrose.com/",
        lienLabel: "Office de tourisme Côte de Granit Rose",
      },
    ],
    pratique: [
      "Se garer tôt à Trestraou en août, ou plus loin et finir à pied.",
      "Lumière la plus belle en fin de journée : le granit devient franchement rose.",
      "Chaussures fermées, le sentier est rocheux par endroits.",
    ],
    sources: [
      { titre: "Le Sentier des Douaniers — Perros-Guirec", url: "https://www.perros-guirec.com/accueil/preparer-mon-sejour/sortir-et-bouger/balades-et-randos/circuits-pedestres/le-sentier-des-douaniers/" },
      { titre: "Office de tourisme de la Côte de Granit Rose", url: "https://www.bretagne-cotedegranitrose.com/" },
      { titre: "Boucle Ploumanac'h – Perros-Guirec — Itirando", url: "https://itirando.bzh/randonnee/boucle-de-ploumanach-a-perros-guirec/" },
    ],
  },

  {
    id: "dinan",
    nom: "Dinan",
    sousTitre: "Ville d'art et d'histoire, 3 km de remparts",
    emoji: "🏯",
    couleur: "#664990",
    trajet: { km: 65, min: 60, note: "Par la N12 puis la D794" },
    duree: "Journée",
    resume:
      "Cité médiévale au-dessus de la Rance, avec les remparts les plus complets de Bretagne, la rue du Jerzual pavée qui descend jusqu'au port, et un donjon ducal du XIVe siècle. Le front nord des remparts vient d'être restauré avec un nouveau cheminement touristique.",
    aVoir: [
      {
        nom: "Château de Dinan (donjon ducal)",
        detail: "Résidence ducale bâtie vers 1380 par Jean IV.",
        prix: { adulte: 8, enfant: 0, label: "8 € adulte (individuel) — 6 €/pers. en groupe de 15+" },
        lien: "https://www.dinan-capfrehel.com/nos-incontournables/chateau-dinan/",
        lienLabel: "Château de Dinan — office de tourisme",
      },
      {
        nom: "Visite guidée des remparts",
        detail: "Env. 1 h 30 avec un guide de l'office de tourisme.",
        prix: { adulte: 7.5, enfant: 5, label: "7,50 € / 5 € réduit / gratuit –12 ans", optionnel: true },
        lien: "https://www.dinan-capfrehel.com/agenda-animations/visite-guidee-les-remparts-de-dinan-2/",
        lienLabel: "Réserver la visite guidée",
      },
      {
        nom: "Rue du Jerzual et port de Dinan",
        detail: "Descente pavée bordée d'ateliers d'artisans jusqu'à la Rance. Raide au retour.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.dinan-capfrehel.com/experiences/incontournable/notre-itineraire-pour-visiter-le-centre-ville-dinan/",
        lienLabel: "Itinéraire dans le centre-ville",
      },
    ],
    pratique: [
      "Office de tourisme : 9 rue du Château, 22100 Dinan — 02 96 87 69 76.",
      "Se garer hors les murs (parkings de la Duchesse Anne ou du port) et monter à pied.",
      "Peut se combiner avec Saint-Malo dans la même journée si on part tôt.",
    ],
    sources: [
      { titre: "Château de Dinan — Dinan-Cap Fréhel Tourisme", url: "https://www.dinan-capfrehel.com/nos-incontournables/chateau-dinan/" },
      { titre: "Le Château de Dinan — Ville de Dinan", url: "https://www.dinan.fr/mes-loisirs/culture-et-patrimoine/le-patrimoine/les-sites-historiques/le-chateau-de-dinan/" },
      { titre: "Visite guidée des remparts", url: "https://www.dinan-capfrehel.com/agenda-animations/visite-guidee-les-remparts-de-dinan-2/" },
    ],
  },

  {
    id: "erquy",
    nom: "Cap d'Erquy & Val-André",
    sousTitre: "Falaises de grès rose et grandes plages",
    emoji: "🏖️",
    couleur: "#a2681b",
    trajet: { km: 45, min: 50, note: "Par Pléneuf-Val-André" },
    duree: "Demi-journée à journée",
    resume:
      "Quinze kilomètres de GR34 relient Erquy à Pléneuf-Val-André le long de falaises de grès rose couvertes d'ajoncs et de bruyère, avec d'anciennes carrières transformées en lacs. En face, l'îlot du Verdelet, réserve ornithologique accessible à pied à marée basse.",
    aVoir: [
      {
        nom: "Boucle du Cap d'Erquy",
        detail: "≈ 8 km au départ du parking du cap, environ 2 h. Landes, criques, points de vue.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.capderquy-valandre.com/decouvrir/randonnees/a-pied-sur-le-gr34",
        lienLabel: "Randonnées — office de tourisme",
      },
      {
        nom: "Plage du Val-André",
        detail: "L'une des plus grandes plages de sable de la côte. Char à voile et kitesurf.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.capderquy-valandre.com/",
        lienLabel: "Office de tourisme Cap d'Erquy – Val André",
      },
      {
        nom: "Îlot du Verdelet",
        detail: "Réserve d'oiseaux, accessible à pied uniquement à marée basse (grandes marées) — vérifier les horaires.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.capderquy-valandre.com/",
        lienLabel: "Office de tourisme Cap d'Erquy – Val André",
      },
    ],
    pratique: [
      "Erquy = capitale de la coquille Saint-Jacques : bonne halte déjeuner au port.",
      "Vérifier l'horaire des marées avant de viser le Verdelet.",
      "Le plus proche de nos grandes balades : parfait pour une demi-journée improvisée.",
    ],
    sources: [
      { titre: "À pied sur le GR34 — Cap d'Erquy-Val André", url: "https://www.capderquy-valandre.com/decouvrir/randonnees/a-pied-sur-le-gr34" },
      { titre: "GR34 Erquy → Pléneuf-Val-André — Tourisme Bretagne", url: "https://www.tourismebretagne.com/tourtrip_step/itineraires-gr-34-saint-brieuc-a-erquy-pleneuf-erquy/" },
      { titre: "Jour 4 : Erquy > Pléneuf-Val-André — Côtes d'Armor", url: "https://www.cotesdarmor.com/fr/fiche/itineraires-touristiques/jour-4-erquy--pleneuf-val-andre-erquy_TFOITIBRE022V53M20W/" },
    ],
  },

  {
    id: "saint-malo",
    nom: "Saint-Malo",
    sousTitre: "La cité corsaire",
    emoji: "🌊",
    couleur: "#1f5f7a",
    trajet: { km: 85, min: 80, note: "Le plus loin de la liste — partir tôt" },
    duree: "Journée complète",
    resume:
      "Intra-muros, ses remparts qu'on fait à pied en 1 h, ses plages et ses îlots accessibles à marée basse (Grand Bé, Fort National). Grand Aquarium à 15 min du centre si la météo tourne.",
    aVoir: [
      {
        nom: "Tour des remparts intra-muros",
        detail: "Environ 2 km, accès libre, vues sur la baie et les îlots.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.saint-malo-tourisme.com/",
        lienLabel: "Office de tourisme de Saint-Malo",
      },
      {
        nom: "Grand Aquarium de Saint-Malo",
        detail: "Nautibus (mini sous-marin) et Abyssal Descender inclus. 11 juillet – 31 août : 9 h 30 – 20 h. Bus ligne 1, arrêt « Aquarium ».",
        prix: { adulte: 19.9, enfant: 15.9, label: "19,90 € (13 ans et +) / 15,90 € (4–12 ans) / gratuit –4 ans", optionnel: true },
        lien: "https://www.aquarium-st-malo.com/particulier/home/tarif",
        lienLabel: "Tarifs et billetterie officielle",
      },
      {
        nom: "Grand Bé & Fort National",
        detail: "Accessibles à pied à marée basse seulement. Tombe de Chateaubriand sur le Grand Bé.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit (Grand Bé)" },
        lien: "https://www.saint-malo-tourisme.com/",
        lienLabel: "Office de tourisme de Saint-Malo",
      },
    ],
    pratique: [
      "Parkings intra-muros pleins dès 10 h en août : viser les parkings extérieurs + navette.",
      "Marées : tout dépend d'elles ici, les consulter avant de partir.",
      "Peut se combiner avec Dinan (30 min entre les deux).",
    ],
    sources: [
      { titre: "Grand Aquarium de Saint-Malo — tarifs officiels", url: "https://www.aquarium-st-malo.com/particulier/home/tarif" },
      { titre: "Office de tourisme Saint-Malo – Baie du Mont-Saint-Michel", url: "https://www.saint-malo-tourisme.com/" },
    ],
  },

  {
    id: "pleumeur-bodou",
    nom: "Parc du Radôme (Pleumeur-Bodou)",
    sousTitre: "Le plan B si la pluie s'installe",
    emoji: "📡",
    couleur: "#3f5f8f",
    trajet: { km: 65, min: 65, note: "À côté de Ploumanac'h — combinable" },
    duree: "Demi-journée",
    resume:
      "Trois sites sur un même parc : la Cité des Télécoms sous son radôme géant, le Planétarium de Bretagne, et le Village Gaulois (village reconstitué, ateliers d'artisanat, jeux géants en bois). Très bien pour une journée sans soleil.",
    aVoir: [
      {
        nom: "Le Village Gaulois",
        detail: "Village reconstitué, jardins médiévaux, ateliers et jeux en bois. Demi-journée.",
        prix: { adulte: 9, enfant: 6, label: "9 € adulte / 6 € enfant" },
        lien: "https://www.levillagegaulois.org/php/tarifsHoraires.php",
        lienLabel: "Tarifs et horaires officiels",
      },
      {
        nom: "Cité des Télécoms",
        detail: "Juillet-août : 7 j/7, 10 h – 19 h. Tarif à confirmer sur le site officiel.",
        prix: { adulte: 0, enfant: 0, label: "Voir tarif sur le site officiel" },
        lien: "https://www.cite-telecoms.com/",
        lienLabel: "Cité des Télécoms",
      },
      {
        nom: "Pass Parc du Radôme (3 sites)",
        detail: "Planétarium + Cité des Télécoms + Village Gaulois sur la journée.",
        prix: { adulte: 0, enfant: 17.4, label: "17,40 € enfant — tarif adulte à confirmer sur place", optionnel: true },
        lien: "https://parcduradome.com/",
        lienLabel: "Parc du Radôme",
      },
    ],
    pratique: [
      "À 10 min de Ploumanac'h : on peut faire le sentier le matin et le parc l'après-midi.",
      "Le Village Gaulois marche très bien avec des enfants.",
      "Confirmer les tarifs adulte du pass à la caisse, les grilles varient selon la saison.",
    ],
    sources: [
      { titre: "Le Village Gaulois — tarifs et horaires", url: "https://www.levillagegaulois.org/php/tarifsHoraires.php" },
      { titre: "Parc du Radôme", url: "https://parcduradome.com/" },
      { titre: "Cité des Télécoms — Tourisme Bretagne", url: "https://www.tourismebretagne.com/offres/cite-des-telecoms-pleumeur-bodou-fr-1973310/" },
    ],
  },

  {
    id: "treguier",
    nom: "Tréguier",
    sousTitre: "Cité épiscopale, Petite Cité de Caractère",
    emoji: "⛪",
    couleur: "#4a6b3c",
    trajet: { km: 50, min: 50, note: "Sur la route de la Côte de Granit Rose" },
    duree: "Demi-journée",
    resume:
      "Ancienne ville d'évêché posée au-dessus du Jaudy, avec l'une des plus belles cathédrales de Bretagne : Saint-Tugdual, sa flèche de plus de 60 m décorée de motifs de cartes à jouer, et son cloître gothique de 48 arcades, le plus complet conservé en Bretagne.",
    aVoir: [
      {
        nom: "Cathédrale Saint-Tugdual",
        detail: "Juillet-août : tous les jours 8 h 30 – 19 h. Tombeau de Saint-Yves, grandes orgues du XVIIe.",
        prix: { adulte: 0, enfant: 0, label: "Visite libre gratuite (cloître : participation possible)" },
        lien: "https://www.bretagne-cotedegranitrose.com/",
        lienLabel: "Office de tourisme Côte de Granit Rose",
      },
      {
        nom: "Cloître gothique (48 arcades)",
        detail: "Achevé en 1470, le plus complet de Bretagne.",
        prix: { adulte: 0, enfant: 0, label: "Voir sur place" },
        lien: "https://www.guide-tourisme-france.com/VISITER/cathedrale-cloitre--treguier-28459.htm",
        lienLabel: "Fiche cathédrale et cloître",
      },
      {
        nom: "Vieille ville et statue d'Ernest Renan",
        detail: "Maisons à pans de bois, place du Martray, maison natale de Renan.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.bretagne-cotedegranitrose.com/mon-sejour/visites-et-decouvertes/les-visites-historiques-et-contees/visite-guidee-de-treguier/",
        lienLabel: "Visite guidée de Tréguier",
      },
    ],
    pratique: [
      "Visites guidées gratuites par la SPREV en juillet-août dans la cathédrale.",
      "Marché le mercredi matin, l'un des plus beaux du secteur.",
      "Se combine bien avec Paimpol le matin.",
    ],
    sources: [
      { titre: "Cathédrale Saint-Tugdual — Office de tourisme Côte de Granit Rose", url: "https://en.bretagne-cotedegranitrose.com/my-stay/leisure-and-discovery/heritage-and-natural-sites/cathedrale-saint-tugdual-treguier-en-2713624/" },
      { titre: "Visite guidée de Tréguier — Petite Cité de Caractère", url: "https://www.bretagne-cotedegranitrose.com/mon-sejour/visites-et-decouvertes/les-visites-historiques-et-contees/visite-guidee-de-treguier/" },
    ],
  },

  {
    id: "saint-brieuc",
    nom: "Saint-Brieuc",
    sousTitre: "La ville d'à côté",
    emoji: "🏘️",
    couleur: "#8a6a4f",
    trajet: { km: 15, min: 20, note: "Le plus proche de Binic" },
    duree: "Demi-journée",
    resume:
      "À 20 minutes : une cathédrale-forteresse (Saint-Étienne, commencée en 1220, l'une des rares fortifiées de Bretagne), un centre historique piéton de maisons à pans de bois des XVe–XVIe siècles, et les vallées qui descendent vers la baie.",
    aVoir: [
      {
        nom: "Cathédrale Saint-Étienne",
        detail: "Cathédrale-forteresse, chantier de 1220 achevé en 1889 avec le porche central.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.baiedesaintbrieuc.com/sit/cathedrale-saint-etienne/",
        lienLabel: "Baie de Saint-Brieuc Tourisme",
      },
      {
        nom: "Balade historique du cœur de ville",
        detail: "Circuit piéton fléché dans le vieux Saint-Brieuc, maisons à pans de bois.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.baiedesaintbrieuc.com/sit/balade-historique-coeur-de-ville-de-saint-brieuc/",
        lienLabel: "Le circuit — office de tourisme",
      },
      {
        nom: "Marché et halle",
        detail: "Grand marché le samedi matin, l'un des plus fournis du département.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.baiedesaintbrieuc.com/",
        lienLabel: "Baie de Saint-Brieuc Tourisme",
      },
    ],
    pratique: [
      "Idéal pour une matinée si la météo est incertaine.",
      "Beaucoup de commerces fermés le lundi.",
      "Retour par la côte via Saint-Quay-Portrieux et Binic.",
    ],
    sources: [
      { titre: "Cathédrale Saint-Étienne — Baie de Saint-Brieuc", url: "https://www.baiedesaintbrieuc.com/en/sit/cathedrale-saint-etienne/" },
      { titre: "Balade historique cœur de ville", url: "https://www.baiedesaintbrieuc.com/sit/balade-historique-coeur-de-ville-de-saint-brieuc/" },
    ],
  },

  {
    id: "binic",
    nom: "Binic-Étables-sur-Mer",
    sousTitre: "Notre camp de base",
    emoji: "🏡",
    couleur: "#2c7373",
    trajet: { km: 0, min: 0, note: "Sur place" },
    duree: "À toute heure",
    resume:
      "Station balnéaire familiale de la baie de Saint-Brieuc : le port, le quai Jean Bart bordé de maisons d'armateurs du XVIIIe en granit et schiste, et les plages reliées par le GR34. Le marché du jeudi existe depuis le Moyen Âge.",
    aVoir: [
      {
        nom: "Quai Jean Bart et le port",
        detail: "Maisons d'armateurs du XVIIIe siècle, terrasses, bateaux.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.binicetablessurmer.com/",
        lienLabel: "Office de tourisme Binic-Étables",
      },
      {
        nom: "Plage de l'Avant-Port & plage des Godelins",
        detail: "L'Avant-Port : rochers, cabines de bois vertes, pins. Les Godelins : la plage emblématique d'Étables.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.binicetablessurmer.com/",
        lienLabel: "Office de tourisme Binic-Étables",
      },
      {
        nom: "Marché du jeudi",
        detail: "Sur le port, toute la matinée. Tradition médiévale.",
        prix: { adulte: 0, enfant: 0, label: "Gratuit" },
        lien: "https://www.binicetablessurmer.com/",
        lienLabel: "Office de tourisme Binic-Étables",
      },
      {
        nom: "Terrarium de Kerdanet",
        detail: "Reptiles et amphibiens du monde entier. Tarif à confirmer sur place.",
        prix: { adulte: 0, enfant: 0, label: "Voir sur place", optionnel: true },
        lien: "https://www.binicetablessurmer.com/",
        lienLabel: "Office de tourisme Binic-Étables",
      },
    ],
    pratique: [
      "L'office de tourisme vend les billets pour Bréhat et les sorties en catamaran — utile pour éviter la queue à l'Arcouest.",
      "Binic Folks Blues Festival en juillet : concerts gratuits.",
      "GR34 au départ du port : belle balade de fin de journée vers Étables.",
    ],
    sources: [
      { titre: "Binic-Étables sur Mer Tourisme — office officiel", url: "https://www.binicetablessurmer.com/" },
      { titre: "Binic-Étables-sur-Mer — Côtes d'Armor Tourisme", url: "https://www.cotesdarmor.com/a-voir-a-faire/patrimoine/villes-et-villages-classes/les-stations-balneaires/binic-etables-sur-mer/" },
      { titre: "Binic-Étables sur Mer — Tourisme Bretagne", url: "https://www.tourismebretagne.com/destinations/les-10-destinations/baie-de-saint-brieuc-paimpol-les-caps/binic-etables-sur-mer/" },
    ],
  },
];
