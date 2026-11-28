/* ===================== SERRA "STANZA" (prova) =====================
   Una scena frontale e piatta per ogni zona (casa, balcone) con dei posti fissi
   (davanzale, mensole, pavimento, ringhiera). I vasi stanno sui posti; tenendo premuto
   un vaso lo sollevi e lo trascini su un altro posto (se è occupato, i due si scambiano).
   Toccando un vaso si apre la sua scheda dal basso, con le stesse azioni della serra a elenco.
   Tutto è dietro all'interruttore Stanza/Elenco: la serra a elenco resta intatta.
   Coordinate: ogni scena è un riquadro 360x480; un posto è {x: centro, y: piano d'appoggio, w: larghezza del vaso}. */

const ROOM_W = 360, ROOM_H = 480;
const ROOMS = {
  casa: {
    spots: [
      { x:64,  y:198, w:80 }, { x:146, y:198, w:80 },                    // davanzale
      { x:238, y:160, w:68 }, { x:310, y:160, w:68 },                    // mensola alta
      { x:238, y:292, w:68 }, { x:310, y:292, w:68 },                    // mensola bassa
      { x:64,  y:466, w:100 }, { x:180, y:466, w:100 }, { x:296, y:466, w:100 }   // pavimento
    ],
    // in che ordine proporre i posti per piantare (prima i più belli: davanzale e pavimento al centro)
    order: [0, 1, 7, 2, 4, 6, 8, 3, 5],
    art: `<rect width="360" height="384" fill="#F7EBD9"/>
      <path d="M0 0h360v14H0z" fill="#EFDFC8"/>
      <rect y="372" width="360" height="12" fill="#E6D2B5"/>
      <rect y="384" width="360" height="96" fill="#DDA56B"/>
      <path d="M0 414h360M0 448h360" stroke="#CB9158" stroke-width="2"/><path d="M90 384v30M250 384v30M40 414v34M180 414v34M310 414v34M120 448v32M270 448v32" stroke="#CB9158" stroke-width="2"/>
      <ellipse cx="180" cy="462" rx="164" ry="16" fill="#E9B08D"/>
      <rect x="20" y="24" width="168" height="168" rx="8" fill="#FFFFFF"/>
      <rect x="30" y="34" width="148" height="148" rx="4" fill="#BFE7F7"/>
      <ellipse cx="70" cy="64" rx="18" ry="7" fill="#fff"/><ellipse cx="134" cy="86" rx="14" ry="6" fill="#fff"/>
      <path d="M30 156c22-16 46-16 70-4 20-12 50-14 78 2v28H30z" fill="#9AD58A"/><path d="M30 170c32-10 76-10 148 0v12H30z" fill="#7CC36E"/>
      <rect x="100" y="34" width="8" height="148" fill="#FFFFFF"/><rect x="30" y="104" width="148" height="8" fill="#FFFFFF"/>
      <rect x="10" y="192" width="188" height="12" rx="3" fill="#EFEFEF"/><rect x="10" y="200" width="188" height="4" fill="#DADADA"/>
      <circle cx="302" cy="52" r="22" fill="#E0773A"/><circle cx="302" cy="52" r="17" fill="#FFF6E5"/><path d="M302 41v11l7 5" stroke="#173b26" stroke-width="3" stroke-linecap="round" fill="none"/>
      <rect x="200" y="160" width="148" height="9" rx="2" fill="#C98B52"/><path d="M214 169v14l10-14zM334 169v14l-10-14z" fill="#B57A44"/>
      <rect x="200" y="292" width="148" height="9" rx="2" fill="#C98B52"/><path d="M214 301v14l10-14zM334 301v14l-10-14z" fill="#B57A44"/>`
  },
  balcone: {
    spots: [
      { x:72,  y:290, w:70 }, { x:180, y:290, w:70 }, { x:288, y:290, w:70 },   // sul corrimano
      { x:64,  y:466, w:100 }, { x:180, y:466, w:100 }, { x:296, y:466, w:100 }   // pavimento
    ],
    order: [4, 1, 3, 5, 0, 2],
    art: `<rect width="360" height="390" fill="#CDEFFC"/>
      <circle cx="300" cy="62" r="26" fill="#FFD43B"/><circle cx="300" cy="62" r="34" fill="#FFD43B" opacity=".25"/>
      <ellipse cx="80" cy="70" rx="30" ry="10" fill="#fff"/><ellipse cx="190" cy="110" rx="22" ry="8" fill="#fff"/>
      <path d="M0 230h70v-70h50v40h40v-90h60v80h50v-50h60v90h30v160H0z" fill="#E7D3BE"/>
      <path d="M150 300V110h60v190zM260 300V150h60v150z" fill="#DCC3A8"/>
      ${[[18,180],[38,180],[18,205],[38,205],[84,175],[100,195],[176,130],[194,130],[176,160],[194,160],[176,190],[194,190],[276,170],[296,170],[276,200],[296,200]].map(([x, y]) => `<rect x="${x}" y="${y}" width="10" height="13" rx="2" fill="#F8EEDF"/>`).join("")}
      <rect y="390" width="360" height="90" fill="#E8B48A"/>
      <path d="M0 420h360M0 452h360M60 390v90M140 390v90M220 390v90M300 390v90" stroke="#D69D71" stroke-width="2"/>
      <rect x="0" y="290" width="360" height="10" rx="3" fill="#5D6F80"/>
      ${Array.from({ length: 19 }, (_, k) => `<rect x="${6 + k * 19.5}" y="300" width="5" height="90" fill="#6E8194"/>`).join("")}
      <rect x="0" y="382" width="360" height="8" fill="#5D6F80"/>`
  }
};

let roomArea = "casa", sheetPlant = null, sheetFresh = false, pickSpot = null, roomDrag = null, roomNoClick = false;
const pct = (v, of) => (v / of * 100).toFixed(2) + "%";

// Ogni pianta della zona ha un posto suo (g.spot): chi non ce l'ha (piante vecchie o appena piantate) prende il primo libero
function ensureSpots(a){
  const n = ROOMS[a].spots.length, used = new Set();
  S.garden.forEach(g => { if (g.area !== a) return;
    if (Number.isInteger(g.spot) && g.spot < n && !used.has(g.spot)) used.add(g.spot); else g.spot = null; });
  S.garden.forEach(g => { if (g.area !== a || g.spot !== null) return;
    const k = ROOMS[a].order.find(k => !used.has(k)); if (k !== undefined) { g.spot = k; used.add(k); } });
}

function roomPot(g, i, sp){
  const st = plantState(g);
  const flag = !g.dead && g.em ? `<span class="rflag em" aria-hidden="true">!</span>`
    : !g.dead && (st === "assetata" || st === "appassita") ? `<span class="rflag dry" aria-hidden="true">${ILL.drop}</span>` : "";
  return `<button class="rpot" data-rp="${i}" style="left:${pct(sp.x, ROOM_W)};top:${pct(sp.y, ROOM_H)};width:${pct(sp.w, ROOM_W)}" aria-label="${esc(nameOf(g))}, ${g.dead ? "morta" : st}">${plantSVG(g.plant, 100, st, g.dead ? "adulta" : stageOf(g), g.pot)}${flag}</button>`;
}

function renderRoom(){
  const a = roomArea, R = ROOMS[a];
  const open = a === "casa" || balconyOpen();
  if (open) ensureSpots(a);
  const busy = new Map(); S.garden.forEach((g, i) => { if (g.area === a) busy.set(g.spot, i); });
  // il "+" compare solo su tanti posti quanti sono i posti ancora piantabili, nell'ordine preferito
  const nFree = open ? Math.max(0, slotsOf(a) - inArea(a)) : 0;
  const plusAt = new Set(R.order.filter(k => !busy.has(k)).slice(0, nFree));
  // i segni dei posti: "+" dove puoi piantare (se hai posti liberi), un'ombra dove puoi appoggiare durante il trascinamento
  const marks = R.spots.map((sp, k) => { const pl = plusAt.has(k), pos = `left:${pct(sp.x, ROOM_W)};top:${pct(sp.y, ROOM_H)};width:${pct(sp.w * .8, ROOM_W)};height:0;padding-bottom:${pct(sp.w * .2, ROOM_W)}`;
    return `<span class="rspot${pl ? " plus" : ""}" data-spot="${k}" style="${pos}">${pl ? `<button class="rplus" data-plant-spot="${k}" aria-label="Pianta qui">+</button>` : ""}</span>`; }).join("");
  const pots = open ? [...busy.entries()].map(([k, i]) => roomPot(S.garden[i], i, R.spots[k])).join("") : "";
  const nx = nextSlotLevel(a);
  const note = !open ? "" : `<p class="rnote">${inArea(a)} di ${slotsOf(a)} posti usati.${nx ? ` Il prossimo si apre al livello ${nx.n}.` : ""}${inArea(a) ? " Tieni premuto un vaso per spostarlo." : ""}</p>`;
  const lock = open ? "" : `<div class="rlock">${IC("lock").replace("<svg", '<svg width="34" height="34"')}<b>Balcone chiuso</b><span>Si apre finendo la zona Casa tua, insieme al Mediterraneo.</span></div>`;
  return `<div class="rtabs" role="tablist">${["casa", "balcone"].map(z => `<button role="tab" aria-selected="${z === a}" data-room="${z}">${AREAS[z].title}</button>`).join("")}</div>
    <div class="room${open ? "" : " closed"}" id="room" data-area="${a}"><svg class="rart" viewBox="0 0 ${ROOM_W} ${ROOM_H}" preserveAspectRatio="none" aria-hidden="true">${R.art}</svg>${open ? marks : ""}${pots}${lock}</div>${note}
    ${sheetHTML()}`;
}

// Scheda dal basso: è la card della serra a elenco, dentro un pannello. Vive dentro #app,
// così tutte le azioni (dito, annaffia con pressione lunga, emergenze) funzionano come sempre.
function sheetHTML(){
  if (sheetPlant === null) return "";
  const g = S.garden[sheetPlant];
  if (!g || g.area !== roomArea) { sheetPlant = null; return ""; }
  const anim = sheetFresh ? " fresh" : ""; sheetFresh = false;
  return `<div class="rsheet-bg${anim}" data-sheetclose="1"></div><div class="rsheet${anim}" role="dialog" aria-modal="true" aria-label="${esc(nameOf(g))}"><button class="grab" data-sheetclose="1" aria-label="Chiudi"></button>${slotCard(g, sheetPlant)}</div>`;
}

// Clic della stanza (chiamato dal gestore principale dei clic di app.js). Restituisce true se l'ha gestito.
function roomClick(t){
  if (t.dataset.view) { S.serraView = t.dataset.view; sheetPlant = null; save(); render(); return true; }
  if (t.dataset.room) { roomArea = t.dataset.room; sheetPlant = null; render(); return true; }
  if (t.dataset.sheetclose) { sheetPlant = null; render(); return true; }
  if (t.dataset.rp !== undefined) { if (roomNoClick) { roomNoClick = false; return true; } sheetPlant = +t.dataset.rp; sheetFresh = true; render(); return true; }
  if (t.dataset.plantSpot !== undefined) { pickSpot = +t.dataset.plantSpot; openPicker(roomArea); return true; }
  return false;
}

/* --- Trascinare un vaso: tieni premuto ~0,4 s, si solleva, lo porti su un altro posto --- */
const roomRoot = document.getElementById("app");
roomRoot.addEventListener("pointerdown", e => {
  const el = e.target.closest(".rpot"); if (!el || e.button > 0) return;
  const room = el.closest(".room");
  roomDrag = { el, room, i: +el.dataset.rp, x0: e.clientX, y0: e.clientY, on: false, target: null, id: e.pointerId,
    t: setTimeout(() => { if (!roomDrag) return; roomDrag.on = true; el.classList.add("lift"); room.classList.add("dragging");
      try { el.setPointerCapture(roomDrag.id); } catch (err) {} navigator.vibrate?.(12); }, 400) };
});
roomRoot.addEventListener("pointermove", e => {
  if (!roomDrag) return;
  if (!roomDrag.on) { if (Math.hypot(e.clientX - roomDrag.x0, e.clientY - roomDrag.y0) > 8) { clearTimeout(roomDrag.t); roomDrag = null; } return; }
  e.preventDefault();
  const r = roomDrag.room.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * ROOM_W, y = (e.clientY - r.top) / r.height * ROOM_H + 20;
  roomDrag.el.style.left = pct(x, ROOM_W); roomDrag.el.style.top = pct(y, ROOM_H);
  // il posto più vicino al punto d'appoggio del vaso, se abbastanza vicino
  let best = null, bd = 60;
  ROOMS[roomArea].spots.forEach((sp, k) => { const d = Math.hypot(sp.x - x, (sp.y - y) * 1.2); if (d < bd) { bd = d; best = k; } });
  roomDrag.target = best;
  roomDrag.room.querySelectorAll(".rspot").forEach(s => s.classList.toggle("over", +s.dataset.spot === best));
});
const roomDrop = () => {
  if (!roomDrag) return; clearTimeout(roomDrag.t);
  const d = roomDrag; roomDrag = null;
  if (!d.on) return;
  roomNoClick = true; setTimeout(() => { roomNoClick = false; }, 350);
  const g = S.garden[d.i];
  if (d.target !== null && d.target !== g.spot) {
    const other = S.garden.find(o => o !== g && o.area === g.area && o.spot === d.target);
    if (other) other.spot = g.spot;   // posto occupato: si scambiano
    g.spot = d.target; save();
  }
  render();
};
roomRoot.addEventListener("pointerup", roomDrop);
roomRoot.addEventListener("pointercancel", roomDrop);
roomRoot.addEventListener("contextmenu", e => { if (e.target.closest(".rpot")) e.preventDefault(); });
