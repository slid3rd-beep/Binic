/* ---------------------------------------------------------------
   Nos journées en Bretagne — application statique, sans build.
   État partagé : commentaires + planning, via Firebase Realtime
   Database en REST (voir config.js) ou localStorage en repli.
   --------------------------------------------------------------- */

const LS_STATE = "bretagne.state.v1";
const LS_NAME = "bretagne.prenom";

const state = { comments: {}, plan: {} };
let moi = localStorage.getItem(LS_NAME) || "";
let destOuverte = null;

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
    state.plan = raw.plan || {};
  } catch (_) {
    /* données illisibles : on repart d'un état vide */
  }
}

async function pull() {
  if (!remote) return;
  const res = await fetch(`${base}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) || {};
  state.comments = data.comments || {};
  state.plan = data.plan || {};
  saveLocal();
}

async function pushComment(entry) {
  if (!remote) {
    const key = `l${Date.now()}${Math.random().toString(36).slice(2, 7)}`;
    state.comments[key] = entry;
    saveLocal();
    return;
  }
  const res = await fetch(`${base}/comments.json`, {
    method: "POST",
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { name } = await res.json();
  state.comments[name] = entry;
  saveLocal();
}

async function dropComment(key) {
  delete state.comments[key];
  saveLocal();
  if (!remote) return;
  const res = await fetch(`${base}/comments/${key}.json`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

async function pushPlan(destId, date) {
  if (date) state.plan[destId] = date;
  else delete state.plan[destId];
  saveLocal();
  if (!remote) return;
  const url = `${base}/plan/${destId}.json`;
  const res = date
    ? await fetch(url, { method: "PUT", body: JSON.stringify(date) })
    : await fetch(url, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/* ---------------- utilitaires ---------------- */

const euro = (n) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 });

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function jourLisible(iso) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function quandLisible(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) +
    " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function commentairesDe(destId) {
  return Object.entries(state.comments)
    .filter(([, c]) => c.dest === destId)
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
  const rep = prompt("Ton prénom (il s'affichera à côté de tes commentaires) :", moi || "");
  if (rep && rep.trim()) {
    moi = rep.trim().slice(0, 24);
    localStorage.setItem(LS_NAME, moi);
    majBoutonPrenom();
  }
  return moi;
}

function majBoutonPrenom() {
  $("#who").textContent = moi ? `👤 ${moi}` : "👤 Qui es-tu ?";
}

/* ---------------- vue liste ---------------- */

function prixMini(dest) {
  const obligatoires = dest.aVoir.filter((s) => !s.prix.optionnel);
  const total = obligatoires.reduce((sum, s) => sum + (s.prix.adulte || 0), 0);
  return total === 0 ? "Gratuit" : `dès ${euro(total)}/adulte`;
}

function renderGrid() {
  $("#grid").innerHTML = DESTINATIONS.map((d) => {
    const nb = commentairesDe(d.id).length;
    const jour = state.plan[d.id];
    return `
      <button class="card" data-dest="${d.id}">
        <div class="card-hero" style="background:${d.couleur}">
          <span class="card-emoji">${d.emoji}</span>
          <h2>${esc(d.nom)}</h2>
          <div class="sub">${esc(d.sousTitre)}</div>
        </div>
        <div class="card-body">
          <div class="meta">
            <span class="chip price">${prixMini(d)}</span>
            <span class="chip">${d.trajet.km === 0 ? "sur place" : `~${d.trajet.min} min · ${d.trajet.km} km`}</span>
            <span class="chip">${esc(d.duree)}</span>
            ${jour ? `<span class="chip day">📅 ${jourLisible(jour)}</span>` : ""}
          </div>
          <p>${esc(d.resume.slice(0, 135))}…</p>
          <div class="card-foot">
            <span>📍 ${d.aVoir.length} lieux</span>
            <span>💬 ${nb} commentaire${nb > 1 ? "s" : ""}</span>
          </div>
        </div>
      </button>`;
  }).join("");
}

/* ---------------- vue programme ---------------- */

function renderProgramme() {
  const prevus = DESTINATIONS.filter((d) => state.plan[d.id]).sort((a, b) =>
    state.plan[a.id].localeCompare(state.plan[b.id])
  );

  if (!prevus.length) {
    $("#programme").innerHTML = `
      <div class="block">
        <p class="empty">Rien de calé pour l'instant. Ouvre une destination et choisis une date :
        elle apparaîtra ici, pour tout le monde.</p>
      </div>`;
    return;
  }

  const parJour = {};
  prevus.forEach((d) => (parJour[state.plan[d.id]] ||= []).push(d));

  $("#programme").innerHTML = Object.entries(parJour)
    .map(([jour, dests]) => `
      <div class="day-group">
        <h3 class="day-title">${jourLisible(jour)}</h3>
        ${dests.map((d) => `
          <button class="day-item" data-dest="${d.id}" style="border-left-color:${d.couleur}">
            <span>${d.emoji}</span>
            <span class="n">${esc(d.nom)}</span>
            <span class="c">${d.trajet.km === 0 ? "sur place" : `~${d.trajet.min} min`} · 💬 ${commentairesDe(d.id).length}</span>
          </button>`).join("")}
      </div>`)
    .join("");
}

/* ---------------- feuille de détail ---------------- */

function renderSheet(destId) {
  const d = DESTINATIONS.find((x) => x.id === destId);
  if (!d) return;
  destOuverte = destId;

  const spots = d.aVoir.map((s, i) => {
    const gratuit = !s.prix.adulte && !s.prix.enfant && !s.prix.forfait;
    return `
      <div class="spot">
        <div class="spot-head">
          <input type="checkbox" data-spot="${i}" ${s.prix.optionnel ? "" : "checked"} aria-label="Compter ${esc(s.nom)}">
          <div>
            <div class="spot-name">${esc(s.nom)}</div>
            <div class="spot-detail">${esc(s.detail)}</div>
            <span class="spot-price${gratuit ? " free" : ""}">${esc(s.prix.label)}</span>
            <a class="spot-link" href="${esc(s.lien)}" target="_blank" rel="noopener">${esc(s.lienLabel)} ↗</a>
          </div>
        </div>
      </div>`;
  }).join("");

  const coms = commentairesDe(d.id);

  $("#sheet-scroll").innerHTML = `
    <div class="detail-hero" style="background:${d.couleur}">
      <div class="big-emoji">${d.emoji}</div>
      <h2>${esc(d.nom)}</h2>
      <div class="sub">${esc(d.sousTitre)}</div>
    </div>

    <div class="detail-body">
      <div class="block">
        <p class="lede">${esc(d.resume)}</p>
        <div class="meta" style="margin-top:12px">
          <span class="chip">${d.trajet.km === 0 ? "Sur place" : `🚗 ~${d.trajet.min} min · ${d.trajet.km} km depuis Binic`}</span>
          <span class="chip">⏱ ${esc(d.duree)}</span>
        </div>
        ${d.trajet.note ? `<p class="spot-detail" style="margin-top:8px">${esc(d.trajet.note)}</p>` : ""}
      </div>

      <div class="block">
        <h3>On y va quel jour ?</h3>
        <div class="day-picker">
          <input type="date" id="pick-day" value="${state.plan[d.id] || ""}">
          <button class="btn" id="save-day" type="button">Caler</button>
          ${state.plan[d.id] ? `<button class="btn ghost" id="clear-day" type="button">Retirer</button>` : ""}
        </div>
      </div>

      <div class="block">
        <h3>À voir &amp; tarifs</h3>
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
        </div>
      </div>

      <div class="block">
        <h3>Bon à savoir</h3>
        <ul class="plain">${d.pratique.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
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

      <div class="block">
        <h3>Sources</h3>
        <ul class="plain sources">
          ${d.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.titre)} ↗</a></li>`).join("")}
        </ul>
        <p class="spot-detail" style="margin-top:10px">Tarifs relevés le ${VERIF}. Susceptibles d'avoir changé — le lien officiel fait foi.</p>
      </div>
    </div>`;

  $("#sheet").hidden = false;
  $("#sheet-scroll").scrollTop = 0;
  document.body.style.overflow = "hidden";
  brancherSheet(d);
  recalcTotal(d);
}

function recalcTotal(d) {
  const a = Number($("#nb-a").value) || 0;
  const e = Number($("#nb-e").value) || 0;
  localStorage.setItem("bretagne.nbA", a);
  localStorage.setItem("bretagne.nbE", e);

  let total = 0;
  document.querySelectorAll("[data-spot]").forEach((box) => {
    if (!box.checked) return;
    const p = d.aVoir[Number(box.dataset.spot)].prix;
    total += (p.adulte || 0) * a + (p.enfant || 0) * e + (p.forfait || 0);
  });

  $("#total-val").textContent = total === 0 ? "Gratuit" : euro(total);
}

function brancherSheet(d) {
  $("#nb-a").addEventListener("input", () => recalcTotal(d));
  $("#nb-e").addEventListener("input", () => recalcTotal(d));
  document.querySelectorAll("[data-spot]").forEach((box) =>
    box.addEventListener("change", () => recalcTotal(d))
  );

  $("#save-day").addEventListener("click", async () => {
    const val = $("#pick-day").value;
    if (!val) return badge("Choisis d'abord une date");
    await agir(() => pushPlan(d.id, val), "Journée calée ✓");
    renderSheet(d.id);
    renderGrid();
    renderProgramme();
  });

  const clr = $("#clear-day");
  if (clr) {
    clr.addEventListener("click", async () => {
      await agir(() => pushPlan(d.id, null), "Retiré du programme");
      renderSheet(d.id);
      renderGrid();
      renderProgramme();
    });
  }

  $("#com-send").addEventListener("click", async () => {
    const texte = $("#com-text").value.trim();
    if (!texte) return;
    if (!demanderPrenom()) return badge("Il faut un prénom pour commenter");
    await agir(
      () => pushComment({ dest: d.id, auteur: moi, texte: texte.slice(0, 1200), ts: Date.now() }),
      remote ? "Commentaire partagé ✓" : "Commentaire enregistré (ce téléphone)"
    );
    renderSheet(d.id);
    renderGrid();
    renderProgramme();
  });

  document.querySelectorAll("[data-del]").forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (!confirm("Supprimer ce commentaire ?")) return;
      await agir(() => dropComment(btn.dataset.del), "Supprimé");
      renderSheet(d.id);
      renderGrid();
    })
  );
}

/* Enveloppe les écritures : message de confirmation ou d'échec réseau. */
async function agir(fn, ok) {
  try {
    await fn();
    badge(ok);
  } catch (err) {
    badge("Pas de réseau — gardé sur ce téléphone seulement", 3600);
  }
}

function fermerSheet() {
  $("#sheet").hidden = true;
  document.body.style.overflow = "";
  destOuverte = null;
}

/* ---------------- amorçage ---------------- */

function brancherGlobal() {
  document.addEventListener("click", (ev) => {
    const carte = ev.target.closest("[data-dest]");
    if (carte) renderSheet(carte.dataset.dest);
  });

  $("#sheet-close").addEventListener("click", fermerSheet);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape" && !$("#sheet").hidden) fermerSheet();
  });

  $("#who").addEventListener("click", () => demanderPrenom(true));

  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-on"));
      tab.classList.add("is-on");
      const cible = tab.dataset.view;
      $("#view-destinations").hidden = cible !== "destinations";
      $("#view-programme").hidden = cible !== "programme";
    })
  );
}

function repeindre() {
  renderGrid();
  renderProgramme();
  if (destOuverte && !$("#sheet").hidden) {
    // On ne réécrit pas la feuille si l'utilisateur est en train d'y taper.
    const zone = document.activeElement;
    if (!zone || (zone.tagName !== "TEXTAREA" && zone.tagName !== "INPUT")) renderSheet(destOuverte);
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
  renderGrid();
  renderProgramme();

  if (remote) {
    await synchroniser();
    setInterval(() => {
      if (document.visibilityState === "visible") synchroniser();
    }, 10000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") synchroniser();
    });
  } else {
    badge("Mode solo : commentaires gardés sur ce téléphone (voir README)", 4200);
  }
}

demarrer();
