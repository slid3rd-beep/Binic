/* ---------------------------------------------------------------
   Nos journées en Bretagne — application statique, sans build.
   État partagé : lieux ajoutés, créneaux de la semaine, commentaires.
   Via Firebase Realtime Database en REST (voir config.js), ou
   localStorage en repli quand rien n'est configuré / hors ligne.
   --------------------------------------------------------------- */

const LS_STATE = "bretagne.state.v2";
const LS_NAME = "bretagne.prenom";

/* Les quatre moments d'une journée. */
const CRENEAUX = [
  { id: "matin", nom: "Matin" },
  { id: "midi", nom: "Midi" },
  { id: "aprem", nom: "Après-midi" },
  { id: "soir", nom: "Soir" },
];

/* Catégories proposées à l'ajout d'un lieu : chacune porte son icône et sa couleur. */
const CATEGORIES = {
  visite: { nom: "Visite", emoji: "🏛️", couleur: "#4a6b8a" },
  balade: { nom: "Balade", emoji: "🥾", couleur: "#4a6b3c" },
  resto: { nom: "Resto", emoji: "🍽️", couleur: "#8a5a2b" },
  plage: { nom: "Plage", emoji: "🏖️", couleur: "#a2681b" },
  marche: { nom: "Marché", emoji: "🧺", couleur: "#8a4b5e" },
  autre: { nom: "Autre", emoji: "📍", couleur: "#5c6b74" },
};

const state = { comments: {}, lieux: {}, creneaux: {}, semaine: {} };
let moi = localStorage.getItem(LS_NAME) || "";
let sheetCourant = null; // { type: "lieu", ref } | { type: "form" }
let cibleCreneau = null; // slot visé par le sélecteur

const remote = typeof SYNC_URL === "string" && SYNC_URL.trim() !== "";
const base = remote ? `${SYNC_URL.replace(/\/$/, "")}/${SYNC_ROOM}` : null;

const $ = (sel) => document.querySelector(sel);

/* ---------------- persistance ---------------- */

function saveLocal() {
  try {
    localStorage.setItem(LS_STATE, JSON.stringify(state));
  } catch (_) {
    /* quota plein : on continue, l'affichage reste correct */
  }
}

function loadLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_STATE) || "{}");
    state.comments = raw.comments || {};
    state.lieux = raw.lieux || {};
    state.creneaux = raw.creneaux || {};
    state.semaine = raw.semaine || {};
  } catch (_) {
    /* données illisibles : on repart d'un état vide */
  }
  reprendreAncienPlanning();
}

/* La première version rangeait une date par destination. On la convertit
   en créneaux du matin pour ne rien perdre. */
function reprendreAncienPlanning() {
  let ancien = {};
  try {
    ancien = JSON.parse(localStorage.getItem("bretagne.state.v1") || "{}").plan || {};
  } catch (_) {
    return;
  }
  Object.entries(ancien).forEach(([destId, date]) => {
    const slot = `${date}|matin`;
    (state.creneaux[slot] ||= {})[`d:${destId}`] = true;
  });
  if (Object.keys(ancien).length) saveLocal();
}

async function pull() {
  if (!remote) return;
  const res = await fetch(`${base}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) || {};
  state.comments = data.comments || {};
  state.lieux = data.lieux || {};
  state.creneaux = data.creneaux || {};
  state.semaine = data.semaine || {};
  saveLocal();
}

/* Écritures : chacune touche une clé précise, jamais le document entier —
   deux téléphones qui écrivent en même temps ne s'écrasent pas. */

async function envoyer(chemin, valeur) {
  saveLocal();
  if (!remote) return;
  const url = `${base}/${chemin}.json`;
  const res =
    valeur === null
      ? await fetch(url, { method: "DELETE" })
      : await fetch(url, { method: "PUT", body: JSON.stringify(valeur) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function ajouter(collection, entree) {
  const local = () => {
    const key = `l${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
    state[collection][key] = entree;
    saveLocal();
    return key;
  };
  if (!remote) return local();
  const res = await fetch(`${base}/${collection}.json`, { method: "POST", body: JSON.stringify(entree) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { name } = await res.json();
  state[collection][name] = entree;
  saveLocal();
  return name;
}

async function pushComment(entry) {
  await ajouter("comments", entry);
}

async function dropComment(key) {
  delete state.comments[key];
  await envoyer(`comments/${key}`, null);
}

async function pushLieu(entry) {
  return ajouter("lieux", entry);
}

async function dropLieu(key) {
  delete state.lieux[key];
  // On retire aussi le lieu de tous les créneaux où il était posé.
  const slots = Object.entries(state.creneaux).filter(([, refs]) => refs[`u:${key}`]);
  await envoyer(`lieux/${key}`, null);
  for (const [slot] of slots) {
    delete state.creneaux[slot][`u:${key}`];
    await envoyer(`creneaux/${slot}/u:${key}`, null);
  }
}

async function poser(slot, ref) {
  (state.creneaux[slot] ||= {})[ref] = true;
  await envoyer(`creneaux/${slot}/${ref}`, true);
}

async function retirer(slot, ref) {
  if (state.creneaux[slot]) delete state.creneaux[slot][ref];
  await envoyer(`creneaux/${slot}/${ref}`, null);
}

async function deplacer(slotDe, slotVers, ref) {
  if (slotDe === slotVers) return;
  (state.creneaux[slotVers] ||= {})[ref] = true;
  if (state.creneaux[slotDe]) delete state.creneaux[slotDe][ref];
  await envoyer(`creneaux/${slotVers}/${ref}`, true);
  await envoyer(`creneaux/${slotDe}/${ref}`, null);
}

async function pushSemaine(iso) {
  state.semaine = { depart: iso };
  await envoyer("semaine", { depart: iso });
}

/* ---------------- utilitaires ---------------- */

const euro = (n) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* Le samedi de la semaine en cours (ou celui d'avant si on est en semaine). */
function samediCourant() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 1) % 7));
  return iso(d);
}

function departSemaine() {
  return state.semaine.depart || samediCourant();
}

/* Le séjour type : samedi d'arrivée → samedi de départ, soit huit journées. */
function joursSemaine() {
  const debut = new Date(`${departSemaine()}T12:00:00`);
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(debut);
    d.setDate(debut.getDate() + i);
    return iso(d);
  });
}

function jourCourt(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "short" });
}

function jourLisible(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function quandLisible(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) +
    " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/* ---------------- catalogue unifié ---------------- */

/* Une « fiche » : soit une destination livrée avec l'app (ref « d:… »),
   soit un lieu ajouté par le groupe (ref « u:… »). */
function fiche(ref) {
  const [type, id] = [ref.slice(0, 1), ref.slice(2)];
  if (type === "d") {
    const d = DESTINATIONS.find((x) => x.id === id);
    return d ? { ...d, ref, perso: false, cat: d.cat || "sortie" } : null;
  }
  const u = state.lieux[id];
  if (!u) return null;
  const c = CATEGORIES[u.cat] || CATEGORIES.autre;
  return {
    ref,
    perso: true,
    cle: id,
    id,
    nom: u.nom,
    sousTitre: u.commune || c.nom,
    emoji: c.emoji,
    couleur: c.couleur,
    cat: u.cat,
    trajet: { km: null, min: null, note: u.commune || "" },
    duree: u.duree || "",
    resume: u.description || "",
    prixTexte: u.prixTexte || "",
    prixAdulte: Number(u.prixAdulte) || 0,
    prixEnfant: Number(u.prixEnfant) || 0,
    lien: u.lien || "",
    source: u.source || "",
    auteur: u.auteur,
    ts: u.ts,
  };
}

/* Dans le rayon, ou déjà posé dans la semaine — dans ce cas on continue de
   l'afficher, sinon la fiche d'une sortie prévue deviendrait introuvable. */
function dansLeRayon(d) {
  if (d.trajet.min < RAYON_MAX_MIN) return true;
  return Object.values(state.creneaux).some((refs) => refs[`d:${d.id}`]);
}

function horsRayon() {
  return DESTINATIONS.filter((d) => !dansLeRayon(d));
}

function toutesLesFiches() {
  const perso = Object.keys(state.lieux)
    .map((k) => fiche(`u:${k}`))
    .filter(Boolean)
    .sort((a, b) => b.ts - a.ts);
  const proches = DESTINATIONS.filter(dansLeRayon).map((d) => fiche(`d:${d.id}`));
  return [...proches, ...perso];
}

/* Prix plancher par adulte, pour les pastilles et les totaux de journée. */
function prixMini(f) {
  if (f.perso) return f.prixAdulte || 0;
  return f.aVoir.filter((s) => !s.prix.optionnel).reduce((sum, s) => sum + (s.prix.adulte || 0), 0);
}

function labelPrix(f) {
  const p = prixMini(f);
  if (f.perso) return f.prixTexte || (p ? `${euro(p)}/adulte` : "Gratuit");
  // Les restaurants n'ont pas de billet d'entrée : on affiche leur budget.
  if (f.budget) return f.budget;
  return p === 0 ? "Gratuit" : `dès ${euro(p)}/adulte`;
}

/* Pastille de note : toujours accompagnée de sa plateforme et du nombre
   d'avis — une note hors contexte ne veut rien dire. */
function labelNote(note) {
  const val = note.valeur.toLocaleString("fr-FR", { minimumFractionDigits: 1 });
  return `★ ${val} · ${note.sur}${note.avis ? ` (${note.avis})` : ""}`;
}

function refsDuSlot(slot) {
  return Object.keys(state.creneaux[slot] || {});
}

function commentairesDe(id) {
  return Object.entries(state.comments)
    .filter(([, c]) => c.dest === id)
    .sort((a, b) => a[1].ts - b[1].ts);
}

function badge(msg, ms = 2600) {
  const el = $("#sync-badge");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(badge._t);
  badge._t = setTimeout(() => { el.hidden = true; }, ms);
}

function demanderPrenom(force) {
  if (moi && !force) return moi;
  const rep = prompt("Ton prénom (il s'affichera à côté de tes ajouts) :", moi || "");
  if (rep && rep.trim()) {
    moi = rep.trim().slice(0, 24);
    localStorage.setItem(LS_NAME, moi);
    majBoutonPrenom();
  }
  return moi;
}

/* Partage du lien : feuille de partage iOS si elle est disponible,
   copie dans le presse-papier sinon. */
async function partagerLien() {
  const donnees = {
    title: "Nos journées en Bretagne",
    text: "Notre agenda de la semaine et les lieux du coin :",
    url: location.href,
  };
  try {
    if (navigator.share) {
      await navigator.share(donnees);
      return;
    }
    await navigator.clipboard.writeText(location.href);
    badge("Lien copié — envoie-le à tes amis");
  } catch (err) {
    if (err && err.name === "AbortError") return; // partage annulé, rien à dire
    prompt("Copie ce lien et envoie-le :", location.href);
  }
}

function majBoutonPrenom() {
  $("#who").textContent = moi ? `👤 ${moi}` : "👤 Qui es-tu ?";
}

/* ---------------- vue semaine ---------------- */

function renderSemaine() {
  const jours = joursSemaine();
  const debut = new Date(`${jours[0]}T12:00:00`);
  const fin = new Date(`${jours[7]}T12:00:00`);
  const fmt = { day: "numeric", month: "short" };

  $("#week-range").textContent =
    `Sam ${debut.toLocaleDateString("fr-FR", fmt)} → sam ${fin.toLocaleDateString("fr-FR", fmt)}`;
  $("#week-start").value = jours[0];

  $("#semaine").innerHTML = jours
    .map((jour, index) => {
      const total = CRENEAUX.reduce(
        (sum, c) => sum + refsDuSlot(`${jour}|${c.id}`).reduce((s, ref) => {
          const f = fiche(ref);
          return s + (f ? prixMini(f) : 0);
        }, 0),
        0
      );

      const vide = CRENEAUX.every((c) => refsDuSlot(`${jour}|${c.id}`).length === 0);

      /* Une journée vide se replie sur une seule ligne : la semaine reste
         lisible d'un coup d'œil, et il suffit d'un geste pour la remplir. */
      const lignesVides = `
        <div class="ligne ligne-repliee">
          <div class="ligne-nom">Libre</div>
          <!-- Un lieu lâché sur une journée vide atterrit le matin. -->
          <div class="zone" data-slot="${jour}|matin">
            ${CRENEAUX.map((c) => `<button class="mini-plus" data-ajouter="${jour}|${c.id}">${c.nom}</button>`).join("")}
          </div>
        </div>`;

      const lignes = CRENEAUX.map((c) => {
        const slot = `${jour}|${c.id}`;
        const refs = refsDuSlot(slot);
        const puces = refs
          .map((ref) => {
            const f = fiche(ref);
            if (!f) return "";
            return `
              <span class="puce" data-ref="${esc(ref)}" data-slot="${esc(slot)}" style="--puce:${f.couleur}">
                <span class="puce-emoji">${f.emoji}</span>
                <span class="puce-nom">${esc(f.nom)}</span>
                <button class="puce-x" data-retirer="${esc(slot)}::${esc(ref)}" aria-label="Retirer ${esc(f.nom)}">✕</button>
              </span>`;
          })
          .join("");

        return `
          <div class="ligne">
            <div class="ligne-nom">${c.nom}</div>
            <div class="zone${refs.length ? "" : " vide"}" data-slot="${esc(slot)}">
              ${puces}
              <button class="zone-plus" data-ajouter="${esc(slot)}" aria-label="Ajouter au ${c.nom.toLowerCase()} du ${jourLisible(jour)}">+</button>
            </div>
          </div>`;
      }).join("");

      const auj = jour === iso(new Date()) ? " est-auj" : "";
      const arrivee = index === 0 ? "arrivée" : index === 7 ? "départ" : "";

      return `
        <section class="jour${auj}${vide ? " jour-vide" : ""}">
          <header class="jour-tete">
            <h3>${jourCourt(jour)}</h3>
            ${arrivee ? `<span class="jour-tag">${arrivee}</span>` : ""}
            ${total > 0 ? `<span class="jour-total">≈ ${euro(total)}/adulte</span>` : ""}
          </header>
          ${vide ? lignesVides : lignes}
        </section>`;
    })
    .join("");

  brancherDrag();
}

/* ---------------- vue lieux ---------------- */

function renderGrid() {
  const loin = horsRayon();
  $("#hors-rayon").innerHTML = loin.length
    ? `Liste limitée à <strong>moins d'une heure de route de Binic</strong>.
       ${loin.length} fiche${loin.length > 1 ? "s sont masquées" : " est masquée"} :
       ${loin.map((d) => `${esc(d.nom)} (~${d.trajet.min} min)`).join(", ")}.
       Pour les revoir, monter <code>RAYON_MAX_MIN</code> dans <code>data.js</code>.`
    : "";

  $("#grid").innerHTML = toutesLesFiches()
    .map((f) => {
      const nb = commentairesDe(f.id).length;
      const place = Object.entries(state.creneaux).filter(([, refs]) => refs[f.ref]).length;
      const texte = f.resume || "Pas encore de description.";
      return `
      <button class="card${f.cat === "resto" ? " est-resto" : ""}" data-ouvrir="${esc(f.ref)}">
        <div class="card-hero" style="background:${f.couleur}">
          <span class="card-emoji">${f.emoji}</span>
          <h2>${esc(f.nom)}</h2>
          <div class="sub">${esc(f.sousTitre || "")}</div>
        </div>
        <div class="card-body">
          <div class="meta">
            ${f.note ? `<span class="chip note">${esc(labelNote(f.note))}</span>` : ""}
            <span class="chip price">${esc(labelPrix(f))}</span>
            ${f.trajet.min != null ? `<span class="chip">${f.trajet.km === 0 ? "sur place" : `~${f.trajet.min} min · ${f.trajet.km} km`}</span>` : ""}
            ${f.duree ? `<span class="chip">${esc(f.duree)}</span>` : ""}
            ${place ? `<span class="chip day">📅 ${place} créneau${place > 1 ? "x" : ""}</span>` : ""}
            ${f.perso ? `<span class="chip perso">ajouté par ${esc(f.auteur || "?")}</span>` : ""}
          </div>
          <p>${esc(texte.slice(0, 135))}${texte.length > 135 ? "…" : ""}</p>
          <div class="card-foot">
            <span>📍 ${f.perso ? "fiche libre" : `${f.aVoir.length} lieux`}</span>
            <span>💬 ${nb} commentaire${nb > 1 ? "s" : ""}</span>
          </div>
        </div>
      </button>`;
    })
    .join("");
}

/* ---------------- sélecteur de lieu ---------------- */

function ouvrirPicker(slot) {
  cibleCreneau = slot;
  const [jour, cre] = slot.split("|");
  const nomCre = CRENEAUX.find((c) => c.id === cre).nom.toLowerCase();
  $("#picker-title").textContent = `${nomCre} du ${jourLisible(jour)}`;

  const dejaLa = new Set(refsDuSlot(slot));
  $("#picker-list").innerHTML =
    toutesLesFiches()
      .map((f) => `
        <button class="picker-item" data-choisir="${esc(f.ref)}" ${dejaLa.has(f.ref) ? "disabled" : ""}>
          <span class="picker-pastille" style="background:${f.couleur}">${f.emoji}</span>
          <span class="picker-txt">
            <span class="picker-nom">${esc(f.nom)}</span>
            <span class="picker-sub">${esc(labelPrix(f))}${f.duree ? ` · ${esc(f.duree)}` : ""}</span>
          </span>
          ${dejaLa.has(f.ref) ? `<span class="picker-ok">déjà là</span>` : ""}
        </button>`)
      .join("") +
    `<button class="picker-item picker-new" data-nouveau="1">
       <span class="picker-pastille" style="background:var(--sea);color:var(--sea-ink)">+</span>
       <span class="picker-txt"><span class="picker-nom">Ajouter un lieu…</span>
       <span class="picker-sub">une info prise à l'office de tourisme</span></span>
     </button>`;

  $("#picker").hidden = false;
}

function fermerPicker() {
  $("#picker").hidden = true;
  cibleCreneau = null;
}

/* ---------------- glisser-déposer tactile ---------------- */

let drag = null;

function brancherDrag() {
  document.querySelectorAll(".puce").forEach((puce) => {
    puce.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".puce-x")) return;
      const depart = { x: ev.clientX, y: ev.clientY };
      drag = {
        puce,
        ref: puce.dataset.ref,
        slot: puce.dataset.slot,
        depart,
        actif: false,
        pointerId: ev.pointerId,
        timer: setTimeout(() => demarrerDrag(ev), 220),
      };
    });
  });
}

function demarrerDrag(ev) {
  if (!drag) return;
  drag.actif = true;
  drag.puce.classList.add("en-vol");
  const ghost = $("#drag-ghost");
  ghost.innerHTML = drag.puce.innerHTML;
  ghost.style.setProperty("--puce", getComputedStyle(drag.puce).getPropertyValue("--puce"));
  ghost.hidden = false;
  bougerGhost(ev.clientX, ev.clientY);
  if (navigator.vibrate) navigator.vibrate(12);
}

function bougerGhost(x, y) {
  const ghost = $("#drag-ghost");
  ghost.style.left = `${x}px`;
  ghost.style.top = `${y}px`;
}

function zoneSous(x, y) {
  $("#drag-ghost").style.pointerEvents = "none";
  const el = document.elementFromPoint(x, y);
  return el ? el.closest(".zone") : null;
}

document.addEventListener("pointermove", (ev) => {
  if (!drag) return;
  const dx = Math.abs(ev.clientX - drag.depart.x);
  const dy = Math.abs(ev.clientY - drag.depart.y);
  if (!drag.actif) {
    // L'utilisateur fait défiler la page : on annule la prise.
    if (dx > 10 || dy > 10) { clearTimeout(drag.timer); drag = null; }
    return;
  }
  bougerGhost(ev.clientX, ev.clientY);
  document.querySelectorAll(".zone.survol").forEach((z) => z.classList.remove("survol"));
  const zone = zoneSous(ev.clientX, ev.clientY);
  if (zone) zone.classList.add("survol");
});

/* Une fois la prise engagée, on bloque le défilement de la page. */
document.addEventListener("touchmove", (ev) => {
  if (drag && drag.actif) ev.preventDefault();
}, { passive: false });

document.addEventListener("pointerup", async (ev) => {
  if (!drag) return;
  clearTimeout(drag.timer);
  const { actif, ref, slot, puce } = drag;
  drag = null;

  if (!actif) {
    ouvrirFiche(ref);
    return;
  }

  puce.classList.remove("en-vol");
  $("#drag-ghost").hidden = true;
  const zone = zoneSous(ev.clientX, ev.clientY);
  document.querySelectorAll(".zone.survol").forEach((z) => z.classList.remove("survol"));

  if (zone && zone.dataset.slot !== slot) {
    const f = fiche(ref);
    await agir(() => deplacer(slot, zone.dataset.slot, ref), `${f ? f.nom : "Déplacé"} → ${nomDuSlot(zone.dataset.slot)}`);
    repeindre();
  }
});

document.addEventListener("pointercancel", () => {
  if (!drag) return;
  clearTimeout(drag.timer);
  if (drag.actif) {
    drag.puce.classList.remove("en-vol");
    $("#drag-ghost").hidden = true;
  }
  drag = null;
});

function nomDuSlot(slot) {
  const [jour, cre] = slot.split("|");
  const c = CRENEAUX.find((x) => x.id === cre);
  return `${c.nom.toLowerCase()} de ${jourCourt(jour)}`;
}

/* ---------------- fiche détaillée ---------------- */

function ouvrirFiche(ref) {
  const f = fiche(ref);
  if (!f) return;
  sheetCourant = { type: "lieu", ref };

  const corps = f.perso ? corpsFichePerso(f) : corpsFicheCatalogue(f);
  const coms = commentairesDe(f.id);

  $("#sheet-scroll").innerHTML = `
    <div class="detail-hero" style="background:${f.couleur}">
      <div class="big-emoji">${f.emoji}</div>
      <h2>${esc(f.nom)}</h2>
      <div class="sub">${esc(f.sousTitre || "")}</div>
    </div>

    <div class="detail-body">
      ${corps}

      <div class="block">
        <h3>Placer dans la semaine</h3>
        <div id="creneaux-actuels">${listeCreneauxDe(ref)}</div>
        <div class="day-picker" style="margin-top:10px">
          <select id="pick-jour" aria-label="Jour">
            ${joursSemaine().map((j) => `<option value="${j}">${jourCourt(j)}</option>`).join("")}
          </select>
          <select id="pick-creneau" aria-label="Créneau">
            ${CRENEAUX.map((c) => `<option value="${c.id}">${c.nom}</option>`).join("")}
          </select>
          <button class="btn" id="pick-poser" type="button">Poser</button>
        </div>
      </div>

      <div class="block">
        <h3>Ce qu'on en dit (${coms.length})</h3>
        <div id="com-list">
          ${coms.length
            ? coms.map(([key, c]) => `
              <div class="comment">
                <div class="avatar">${esc((c.auteur || "?").slice(0, 1).toUpperCase())}</div>
                <div style="flex:1">
                  <div class="comment-meta">${esc(c.auteur)} · ${quandLisible(c.ts)}</div>
                  <div class="comment-body">${esc(c.texte)}</div>
                </div>
                ${c.auteur === moi ? `<button class="comment-del" data-del="${esc(key)}" aria-label="Supprimer">🗑</button>` : ""}
              </div>`).join("")
            : `<p class="empty">Personne n'a encore donné son avis.</p>`}
        </div>
        <div style="margin-top:12px">
          <textarea id="com-text" placeholder="Ton avis, une idée d'horaire, un resto…"></textarea>
          <button class="btn" id="com-send" type="button" style="margin-top:8px">Envoyer</button>
        </div>
      </div>

      ${f.perso && f.auteur === moi
        ? `<div class="block"><button class="btn ghost" id="suppr-lieu" type="button">Supprimer ce lieu</button></div>`
        : ""}
    </div>`;

  montrerSheet();
  brancherFiche(f);
}

function corpsFicheCatalogue(f) {
  const spots = f.aVoir.map((s, i) => {
    const gratuit = !s.prix.adulte && !s.prix.enfant && !s.prix.forfait;
    return `
      <div class="spot">
        <div class="spot-head">
          ${f.cat === "resto"
            ? ""
            : `<input type="checkbox" data-spot="${i}" ${s.prix.optionnel ? "" : "checked"} aria-label="Compter ${esc(s.nom)}">`}
          <div>
            <div class="spot-name">${esc(s.nom)}</div>
            <div class="spot-detail">${esc(s.detail)}</div>
            <span class="spot-price${gratuit ? " free" : ""}">${esc(s.prix.label)}</span>
            <a class="spot-link" href="${esc(s.lien)}" target="_blank" rel="noopener">${esc(s.lienLabel)} ↗</a>
          </div>
        </div>
      </div>`;
  }).join("");

  return `
    <div class="block">
      <p class="lede">${esc(f.resume)}</p>
      <div class="meta" style="margin-top:12px">
        ${f.note ? `<a class="chip note" href="${esc(f.note.url)}" target="_blank" rel="noopener">${esc(labelNote(f.note))} ↗</a>` : ""}
        <span class="chip">${f.trajet.km === 0 ? "Sur place" : `🚗 ~${f.trajet.min} min · ${f.trajet.km} km depuis Binic`}</span>
        <span class="chip">⏱ ${esc(f.duree)}</span>
      </div>
      ${f.trajet.note ? `<p class="spot-detail" style="margin-top:8px">${esc(f.trajet.note)}</p>` : ""}
      ${f.note ? `<p class="spot-detail" style="margin-top:6px">Note relevée le ${VERIF} — les avis bougent, à recouper avant de réserver.</p>` : ""}
    </div>

    <div class="block">
      ${f.cat === "resto"
        ? `<h3>La table</h3>
           ${spots}
           <p class="spot-detail" style="margin:12px 0 0">
             Pas de calcul possible : ces établissements ne publient pas leurs prix.
             Les repas ne sont pas comptés dans le total estimé de la journée.
           </p>`
        : `<h3>À voir &amp; tarifs</h3>
           <div class="calc">
             <label for="nb-a">Adultes</label>
             <input type="number" id="nb-a" min="0" max="30" value="${localStorage.getItem("bretagne.nbA") || 2}">
             <label for="nb-e">Enfants</label>
             <input type="number" id="nb-e" min="0" max="30" value="${localStorage.getItem("bretagne.nbE") || 0}">
           </div>
           ${spots}
           <div class="total">
             <span>Total estimé</span>
             <span style="text-align:right">
               <span id="total-val">—</span>
               <small>hors repas, essence et parkings non listés</small>
             </span>
           </div>`}
    </div>

    <div class="block">
      <h3>Bon à savoir</h3>
      <ul class="plain">${f.pratique.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
    </div>

    <div class="block">
      <h3>Sources</h3>
      <ul class="plain sources">
        ${f.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.titre)} ↗</a></li>`).join("")}
      </ul>
      <p class="spot-detail" style="margin-top:10px">Tarifs relevés le ${VERIF}. Susceptibles d'avoir changé — le lien officiel fait foi.</p>
    </div>`;
}

function corpsFichePerso(f) {
  const lienSource = /^https?:\/\//.test(f.source)
    ? `<a href="${esc(f.source)}" target="_blank" rel="noopener">${esc(f.source)} ↗</a>`
    : esc(f.source);

  return `
    <div class="block">
      <p class="lede">${f.resume ? esc(f.resume) : `<span class="empty">Pas de description — ouvre le lieu pour en ajouter une.</span>`}</p>
      <div class="meta" style="margin-top:12px">
        ${f.sousTitre ? `<span class="chip">📍 ${esc(f.sousTitre)}</span>` : ""}
        ${f.duree ? `<span class="chip">⏱ ${esc(f.duree)}</span>` : ""}
        <span class="chip perso">ajouté par ${esc(f.auteur || "?")}</span>
      </div>
    </div>

    <div class="block">
      <h3>Tarif</h3>
      <span class="spot-price${prixMini(f) ? "" : " free"}">${esc(f.prixTexte || "Non renseigné")}</span>
      ${f.lien ? `<a class="spot-link" href="${esc(f.lien)}" target="_blank" rel="noopener">Réserver / en savoir plus ↗</a>` : ""}
      ${f.prixAdulte || f.prixEnfant
        ? `<p class="spot-detail" style="margin-top:10px">Compté dans les totaux de la semaine :
           ${euro(f.prixAdulte)}/adulte${f.prixEnfant ? ` · ${euro(f.prixEnfant)}/enfant` : ""}.</p>`
        : ""}
    </div>

    <div class="block">
      <h3>D'où vient l'info</h3>
      <p class="spot-detail" style="margin:0">${f.source ? lienSource : `<span class="empty">Source non renseignée.</span>`}</p>
    </div>`;
}

function listeCreneauxDe(ref) {
  const places = Object.entries(state.creneaux)
    .filter(([, refs]) => refs[ref])
    .map(([slot]) => slot)
    .sort();
  if (!places.length) return `<p class="empty" style="margin:0">Pas encore calé.</p>`;
  return `<div class="meta">${places
    .map((slot) => `<span class="chip day">📅 ${nomDuSlot(slot)}
      <button class="chip-x" data-retirer="${esc(slot)}::${esc(ref)}" aria-label="Retirer">✕</button></span>`)
    .join("")}</div>`;
}

function recalcTotal(f) {
  const a = Number($("#nb-a").value) || 0;
  const e = Number($("#nb-e").value) || 0;
  localStorage.setItem("bretagne.nbA", a);
  localStorage.setItem("bretagne.nbE", e);

  let total = 0;
  document.querySelectorAll("[data-spot]").forEach((box) => {
    if (!box.checked) return;
    const p = f.aVoir[Number(box.dataset.spot)].prix;
    total += (p.adulte || 0) * a + (p.enfant || 0) * e + (p.forfait || 0);
  });

  $("#total-val").textContent = total === 0 ? "Gratuit" : euro(total);
}

function brancherFiche(f) {
  if (!f.perso && f.cat !== "resto") {
    $("#nb-a").addEventListener("input", () => recalcTotal(f));
    $("#nb-e").addEventListener("input", () => recalcTotal(f));
    document.querySelectorAll("[data-spot]").forEach((box) =>
      box.addEventListener("change", () => recalcTotal(f))
    );
    recalcTotal(f);
  }

  $("#pick-poser").addEventListener("click", async () => {
    const slot = `${$("#pick-jour").value}|${$("#pick-creneau").value}`;
    await agir(() => poser(slot, f.ref), `${f.nom} → ${nomDuSlot(slot)}`);
    $("#creneaux-actuels").innerHTML = listeCreneauxDe(f.ref);
    brancherRetraits();
    repeindre({ saufFiche: true });
  });

  brancherRetraits();

  $("#com-send").addEventListener("click", async () => {
    const texte = $("#com-text").value.trim();
    if (!texte) return;
    if (!demanderPrenom()) return badge("Il faut un prénom pour commenter");
    await agir(
      () => pushComment({ dest: f.id, auteur: moi, texte: texte.slice(0, 1200), ts: Date.now() }),
      remote ? "Commentaire partagé ✓" : "Commentaire enregistré (ce téléphone)"
    );
    ouvrirFiche(f.ref);
    renderGrid();
  });

  document.querySelectorAll("[data-del]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm("Supprimer ce commentaire ?")) return;
      await agir(() => dropComment(btn.dataset.del), "Supprimé");
      ouvrirFiche(f.ref);
      renderGrid();
    })
  );

  const suppr = $("#suppr-lieu");
  if (suppr) {
    suppr.addEventListener("click", async () => {
      if (!confirm(`Supprimer « ${f.nom} » et le retirer de tous les créneaux ?`)) return;
      await agir(() => dropLieu(f.cle), "Lieu supprimé");
      fermerSheet();
      repeindre();
    });
  }
}

function brancherRetraits() {
  document.querySelectorAll("[data-retirer]").forEach((btn) => {
    if (btn.dataset.branche) return;
    btn.dataset.branche = "1";
    btn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const [slot, ref] = btn.dataset.retirer.split("::");
      await agir(() => retirer(slot, ref), "Retiré du créneau");
      if (sheetCourant && sheetCourant.type === "lieu") {
        $("#creneaux-actuels").innerHTML = listeCreneauxDe(sheetCourant.ref);
        brancherRetraits();
      }
      repeindre({ saufFiche: true });
    });
  });
}

/* ---------------- formulaire d'ajout ---------------- */

function ouvrirFormulaire(slotVise) {
  sheetCourant = { type: "form", slot: slotVise || null };

  $("#sheet-scroll").innerHTML = `
    <div class="detail-hero" style="background:var(--sea);color:var(--sea-ink)">
      <div class="big-emoji">📝</div>
      <h2>Ajouter un lieu</h2>
      <div class="sub">Une info prise à l'office de tourisme, un dépliant, une affiche…</div>
    </div>

    <div class="detail-body">
      <div class="block">
        <div class="champ">
          <label for="f-nom">Nom du lieu ou de l'activité *</label>
          <input id="f-nom" type="text" maxlength="70" placeholder="Balade en canoë sur le Trieux">
        </div>
        <div class="champ">
          <label for="f-commune">Commune</label>
          <input id="f-commune" type="text" maxlength="50" placeholder="Pontrieux">
        </div>
        <div class="champ">
          <label for="f-cat">Catégorie</label>
          <select id="f-cat">
            ${Object.entries(CATEGORIES).map(([k, c]) => `<option value="${k}">${c.emoji} ${c.nom}</option>`).join("")}
          </select>
        </div>
        <div class="champ">
          <label for="f-desc">Description</label>
          <textarea id="f-desc" maxlength="800" placeholder="Ce qu'on t'a dit sur place : durée, ce qu'on y voit, à quelle heure y aller…"></textarea>
        </div>
      </div>

      <div class="block">
        <h3>Tarif</h3>
        <div class="champ">
          <label for="f-prix">Tarif tel qu'il est affiché</label>
          <input id="f-prix" type="text" maxlength="90" placeholder="5 € adulte / 3 € enfant">
        </div>
        <div class="calc">
          <label for="f-pa">Adulte (€)</label>
          <input type="number" id="f-pa" min="0" step="0.5" placeholder="0">
          <label for="f-pe">Enfant (€)</label>
          <input type="number" id="f-pe" min="0" step="0.5" placeholder="0">
        </div>
        <p class="spot-detail" style="margin:0">Ces deux nombres servent au total estimé de la journée. Laisse vide si c'est gratuit ou inconnu.</p>
      </div>

      <div class="block">
        <h3>Durée et liens</h3>
        <div class="champ">
          <label for="f-duree">Durée sur place</label>
          <input id="f-duree" type="text" maxlength="40" placeholder="45 min">
        </div>
        <div class="champ">
          <label for="f-lien">Lien de réservation ou site officiel</label>
          <input id="f-lien" type="url" inputmode="url" placeholder="https://…">
        </div>
        <div class="champ">
          <label for="f-source">D'où vient l'info ?</label>
          <input id="f-source" type="text" maxlength="140" placeholder="Office de tourisme de Pontrieux, dépliant du 10/08">
        </div>
      </div>

      <div class="block">
        <button class="btn" id="f-ok" type="button">Ajouter le lieu</button>
        <button class="btn ghost" id="f-annuler" type="button" style="margin-left:8px">Annuler</button>
      </div>
    </div>`;

  montrerSheet();

  $("#f-annuler").addEventListener("click", fermerSheet);
  $("#f-ok").addEventListener("click", async () => {
    const nom = $("#f-nom").value.trim();
    if (!nom) return badge("Il faut au moins un nom");
    if (!demanderPrenom()) return badge("Il faut un prénom pour ajouter un lieu");

    const lien = $("#f-lien").value.trim();
    const entree = {
      nom: nom.slice(0, 70),
      commune: $("#f-commune").value.trim().slice(0, 50),
      cat: $("#f-cat").value,
      description: $("#f-desc").value.trim().slice(0, 800),
      prixTexte: $("#f-prix").value.trim().slice(0, 90),
      prixAdulte: Number($("#f-pa").value) || 0,
      prixEnfant: Number($("#f-pe").value) || 0,
      duree: $("#f-duree").value.trim().slice(0, 40),
      lien: /^https?:\/\//.test(lien) ? lien : "",
      source: $("#f-source").value.trim().slice(0, 140),
      auteur: moi,
      ts: Date.now(),
    };

    let cle = null;
    await agir(async () => { cle = await pushLieu(entree); }, `« ${entree.nom} » ajouté`);

    const slot = sheetCourant.slot;
    if (cle && slot) await agir(() => poser(slot, `u:${cle}`), `Posé sur le ${nomDuSlot(slot)}`);

    repeindre();
    if (cle) ouvrirFiche(`u:${cle}`);
    else fermerSheet();
  });
}

/* ---------------- feuille ---------------- */

function montrerSheet() {
  $("#sheet").hidden = false;
  $("#sheet-scroll").scrollTop = 0;
  document.body.style.overflow = "hidden";
}

function fermerSheet() {
  $("#sheet").hidden = true;
  document.body.style.overflow = "";
  sheetCourant = null;
}

/* Enveloppe les écritures : message de confirmation ou d'échec réseau. */
async function agir(fn, ok) {
  try {
    await fn();
    badge(ok);
  } catch (_) {
    badge("Pas de réseau — gardé sur ce téléphone seulement", 3600);
  }
}

/* ---------------- amorçage ---------------- */

function brancherGlobal() {
  document.addEventListener("click", (ev) => {
    const carte = ev.target.closest("[data-ouvrir]");
    if (carte) return ouvrirFiche(carte.dataset.ouvrir);

    const plus = ev.target.closest("[data-ajouter]");
    if (plus) return ouvrirPicker(plus.dataset.ajouter);

    const choix = ev.target.closest("[data-choisir]");
    if (choix) {
      const slot = cibleCreneau;
      fermerPicker();
      const f = fiche(choix.dataset.choisir);
      agir(() => poser(slot, choix.dataset.choisir), `${f ? f.nom : "Ajouté"} → ${nomDuSlot(slot)}`).then(repeindre);
      return;
    }

    if (ev.target.closest("[data-nouveau]")) {
      const slot = cibleCreneau;
      fermerPicker();
      return ouvrirFormulaire(slot);
    }
  });

  $("#sheet-close").addEventListener("click", fermerSheet);
  $("#picker-close").addEventListener("click", fermerPicker);
  $("#picker").addEventListener("click", (ev) => { if (ev.target.id === "picker") fermerPicker(); });
  $("#add-place").addEventListener("click", () => ouvrirFormulaire(null));

  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Escape") return;
    if (!$("#picker").hidden) return fermerPicker();
    if (!$("#sheet").hidden) fermerSheet();
  });

  $("#who").addEventListener("click", () => demanderPrenom(true));
  $("#share").addEventListener("click", partagerLien);

  $("#week-start").addEventListener("change", async (ev) => {
    const d = new Date(`${ev.target.value}T12:00:00`);
    if (Number.isNaN(d.getTime())) return;
    if (d.getDay() !== 6) badge("Ce n'est pas un samedi, mais va pour ce jour de départ");
    await agir(() => pushSemaine(ev.target.value), "Semaine décalée");
    renderSemaine();
  });

  $("#week-prev").addEventListener("click", () => decalerSemaine(-7));
  $("#week-next").addEventListener("click", () => decalerSemaine(7));

  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-on"));
      tab.classList.add("is-on");
      $("#view-semaine").hidden = tab.dataset.view !== "semaine";
      $("#view-destinations").hidden = tab.dataset.view !== "destinations";
    })
  );
}

async function decalerSemaine(jours) {
  const d = new Date(`${departSemaine()}T12:00:00`);
  d.setDate(d.getDate() + jours);
  await agir(() => pushSemaine(iso(d)), "Semaine décalée");
  renderSemaine();
}

function repeindre(opts = {}) {
  renderSemaine();
  renderGrid();
  if (opts.saufFiche) return;
  if (sheetCourant && sheetCourant.type === "lieu" && !$("#sheet").hidden) {
    const zone = document.activeElement;
    if (!zone || (zone.tagName !== "TEXTAREA" && zone.tagName !== "INPUT" && zone.tagName !== "SELECT")) {
      ouvrirFiche(sheetCourant.ref);
    }
  }
}

async function synchroniser() {
  if (!remote) return;
  try {
    await pull();
    repeindre();
  } catch (_) {
    /* hors ligne : on reste sur la copie locale */
  }
}

async function demarrer() {
  loadLocal();
  majBoutonPrenom();
  brancherGlobal();
  renderSemaine();
  renderGrid();

  if (remote) {
    await synchroniser();
    setInterval(() => {
      if (document.visibilityState === "visible" && !drag && $("#sheet").hidden) synchroniser();
    }, 10000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") synchroniser();
    });
  } else {
    badge("Mode solo : tout est gardé sur ce téléphone (voir README)", 4200);
  }
}

demarrer();
