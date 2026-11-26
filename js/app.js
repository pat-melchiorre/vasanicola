/* Vasanicola: motore del gioco (stato, cura, lezioni, schermate). */
/* =========================================================
   Stato salvato sul dispositivo
   ========================================================= */
const KEY = "vasanicola.v1";
// Strumenti per il test (salto dei giorni, emergenza forzata): nascosti sul sito pubblico,
// visibili aggiungendo ?test all'indirizzo, e sempre visibili fuori da vercel.app (artifact, file locale)
const DEV = new URLSearchParams(location.search).has("test") || !/vercel\.app$/.test(location.hostname);
const fresh = () => ({ onboarded:false, gocce:0, xp:0, done:[], prog:{}, expert:{}, pots:[], slots:1, balcSlots:0, garden:[], knowledge:{}, discovered:[], offset:0, tutorialPlanted:false, recent:[], terms:{}, streak:{ n:0, last:null, best:0, lids:0 } });
let S = (() => { try { return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (e) { return fresh(); } })();
S.garden.forEach(g => { if (!g.area) g.area = "casa"; if (!g.bornAt) g.bornAt = Date.now() + S.offset; });
// Prima dei livelli l'esperienza si spendeva: la restituiamo (posti comprati, vasi, piante in serra)
if (!S.lv) { const cost = (arr, n) => arr.slice(0, n).reduce((a, b) => a + b, 0);
  S.xp += cost(RULES.slotCosts.casa, S.slots) + cost(RULES.slotCosts.balcone, S.balcSlots)
    + S.pots.reduce((a, mo) => a + (({ coprivaso:80, appeso:110, balconiera:120, terracotta:150, autoirrigante:180 })[mo] || 0), 0)
    + S.garden.reduce((a, g) => a + (PLANTS[g.plant]?.cost || 0), 0); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const now = () => Date.now() + S.offset;
let tab = "path";

/* =========================================================
   Caselle a più lezioni: come si scelgono le domande
   ========================================================= */
const authored = st => [{ title:"Le basi", items: st.items }, ...(EXTRA[st.id] || [])];
const lessonCount = st => authored(st).length + 1;
const lessonTitle = (st, li) => li < authored(st).length ? authored(st)[li].title : (st.icon === "star" ? "Ripasso a sorpresa" : "Allenamento");
// Chiave di una domanda (il testo), per ricordare quelle viste da poco
const qKey = it => it.q || it.title || "";
const RECENT_MAX = 80;
function markSeen(it){ const k = qKey(it); if (!k) return; S.recent = [k, ...(S.recent || []).filter(x => x !== k)].slice(0, RECENT_MAX); }
function practiceItems(st){
  const nodes = st.icon === "star" ? STEPS.filter(x => x.zone === st.zone) : [st];
  const pool = nodes.flatMap(x => [...authored(x).flatMap(l => l.items), ...(PRACTICE[x.id] || [])]).filter(it => it.t !== "card");
  // Punteggio: le mai viste (o dimenticate) vincono; tra le altre, più è vecchia più sale.
  // Un pizzico di caso (fino a 8 posizioni) evita che i giri si ripetano sempre identici.
  const score = it => { const r = (S.recent || []).indexOf(qKey(it)); return (r < 0 ? RECENT_MAX : r) + Math.random() * 8; };
  return pool.map(it => [it, score(it)]).sort((x, y) => y[1] - x[1]).slice(0, 6).map(x => x[0]);
}
const lessonItems = (st, li) => li < authored(st).length ? authored(st)[li].items : practiceItems(st);
const progOf = st => S.prog[st.id] || (S.done.includes(st.id) ? lessonCount(st) : 0);
const stepDone = st => progOf(st) >= lessonCount(st);

/* =========================================================
   Logica del giardino
   ========================================================= */
const daysSince = t => Math.floor((now() - t) / DAY);
// wet = quante volte di fila è stata annaffiata con la terra ancora umida.
// Si asciuga di un livello ogni "soak" giorni senza acqua.
// "soak" = per quanti giorni la terra resta bagnata dopo un'annaffiatura (dipende dalla pianta).
// Catalogo del negozio. "fits" = piante adatte, con informazioni vere; "why" = perché non va bene per le altre.
const POT_SHOP = {
  coprivaso:{ name:"Coprivaso della nonna", cost:80, show:"spatifillo", effect:"Solo estetico.", tag:"Solo bellezza",
    desc:"Ceramica a fiorellini sopra il solito vaso col foro. La nonna approva.",
    fits: id => PLANTS[id].indoor, why:"È un vaso da interno: fuori si riempie di pioggia e diventa una piscina." },
  appeso:{ name:"Vaso appeso", cost:110, show:"pothos", effect:"Solo estetico.", tag:"Solo bellezza",
    desc:"Per le piante che ricadono. Foglie libere, mensole pure.",
    fits: id => ["pothos","petunia","felce","nepenthes"].includes(id), why:"È per le piante ricadenti: questa cresce dritta, o è troppo pesante per stare appesa." },
  balconiera:{ name:"Balconiera di legno", cost:120, show:"geranio", effect:"Solo estetico.", tag:"Solo bellezza",
    desc:"Cassetta da ringhiera per fiori e aromatiche. Le radici si allargano.",
    fits: id => ["geranio","petunia","basilico","menta","salvia","lavanda","rosmarino"].includes(id), why:"È da balcone, per fiori e aromatiche: questa sta meglio in un vaso suo." },
  terracotta:{ name:"Vaso di terracotta", cost:150, show:"lavanda", effect:"Asciuga prima: la terra resta bagnata meno a lungo e un’annaffiatura di troppo fa meno danni. In cambio, ha sete un po’ prima.", tag:"Asciuga prima",
    desc:"Porosa: l’acqua in più esce dalle pareti. Perdona chi annaffia troppo.",
    fits: id => ["olivo","rosmarino","lavanda","ficodindia","salvia","limone","kumquat","sansevieria","zamioculcas","geranio","bouganville","echeveria","haworthia","mammillaria","lithops"].includes(id),
    why:"Asciuga in fretta: per una pianta che vuole la terra sempre umida è un piccolo deserto." },
  autoirrigante:{ name:"Vaso autoirrigante", cost:180, show:"basilico", effect:"Riserva d’acqua sul fondo: la pianta resta senza sete molto più a lungo.", tag:"Acqua di scorta",
    desc:"Riserva d’acqua sotto la terra: la pianta beve da sola. Per chi dimentica.",
    fits: id => ["basilico","menta","felce","spatifillo","ortensia","calathea","maranta","fittonia","petunia"].includes(id),
    why:"Tiene la terra sempre umida: per una pianta che teme i ristagni è una condanna." }
};
// Piante che non cambiano mai vaso, con il motivo (vale per qualsiasi modello)
function potBlock(id){
  if (id === "tillandsia") return "Vive senza terra: niente vaso, solo un pezzo di legno.";
  if (id === "vanda") return "Vive a radice nuda, in un cestino: nella terra soffoca.";
  if (id === "orchidea") return "Ha bisogno del vaso trasparente: le sue radici fanno la fotosintesi.";
  if (PLANTS[id].care.bog || id === "cephalotus") return "Le carnivore vogliono plastica e torba: la ceramica e la terracotta rilasciano minerali che le avvelenano.";
  return "";
}
const potFits = (model, id) => !potBlock(id) && POT_SHOP[model].fits(id);
// Effetto del vaso sui tempi dell'acqua (solo dove è vero): terracotta asciuga prima, autoirrigante fa durare l'acqua
function potCare(c, model){
  if (model === "terracotta") { const soak = Math.max(1, Math.round(c.soak * .7)), thirsty = Math.max(soak + 1, Math.round(c.thirsty * .8)), wilt = Math.max(thirsty + 1, Math.round(c.wilt * .85));
    return { ...c, soak, thirsty, wilt, dead: Math.max(wilt + 1, Math.round(c.dead * .9)), rot: c.rot + 1 }; }
  if (model === "autoirrigante") return { ...c, thirsty: Math.round(c.thirsty * 1.5), wilt: Math.round(c.wilt * 1.4), dead: Math.round(c.dead * 1.3) };
  return c;
}
const care = g => potCare(PLANTS[g.plant].care, g.pot);
const wetLevel = g => Math.max(0, (g.wet || 0) - Math.floor(daysSince(g.wateredAt) / care(g).soak));
const nameOf = g => g.nick || PLANTS[g.plant].name;
// Accordo maschile/femminile in base alla pianta (il basilico, la menta...)
const gen = (id, m, f) => PLANTS[id].g === "m" ? m : f;
function plantState(g){ if (g.dead) return g.cause === "marcita" ? "marcita" : "secca";
  const w = care(g).bog ? 0 : wetLevel(g); if (w >= 2) return "fradicia"; if (w === 1) return "zuppa";
  const d = daysSince(g.wateredAt), c = care(g);
  if (d >= c.dead) return "secca"; if (d >= c.wilt) return "appassita"; if (d >= c.thirsty) return "assetata"; return "sana"; }
const STATE_LINE = {
  sana:["Sta benone. Sospetto.","Felice. Non abituarti.","Viva e vegeta (letteralmente)."],
  assetata:["Ha sete e un leggero rancore.","Ti fissa. Ha sete. (Ti fissa.)","Gradirebbe un bicchiere. Anche due."],
  appassita:["Respira ancora (a fatica) (per colpa tua).","Fa scena. (Ma ha ragione.)"],
  secca:["Ci ha lasciati. Però ha lasciato un seme (e un messaggio passivo-aggressivo)."],
  zuppa:["Ha bevuto. Anche troppo.","Sta facendo il bagno. Non richiesto."],
  fradicia:["Le radici chiedono aria (e un avvocato).","Un altro sorso e marcisce. Fidati."],
  marcita:["Annegata d’affetto. Però ha lasciato un seme."]
};
const pickLine = (k, i) => STATE_LINE[k][i % STATE_LINE[k].length];
// Quando una pianta muore, il soprannome se ne va con lei (resta solo il ricordo, in g.rip)
// Giorni di vita: dalla semina a oggi (o al giorno della morte). Primo giorno = 1.
const ageOf = g => Math.floor(((g.dead ? g.diedAt : now()) - g.bornAt) / DAY) + 1;
const ageText = g => { const a = ageOf(g); return a === 1 ? "Primo giorno di vita" : `${a} giorni di vita`; };
// Traguardi da festeggiare: una settimana, un mese, cento giorni, un anno
const MILESTONES = [[7,"Una settimana insieme. Record personale?"],[30,"Un mese insieme. Ormai è di famiglia (quella che sopporti)."],[100,"Cento giorni. Questa pianta si fida di te. Non deluderla."],[365,"Un anno. (Chi l’avrebbe mai detto.) (Nessuno.)"]];
let cheers = [];
function settleMilestones(){
  S.garden.forEach(g => { if (g.dead) return;
    const m = MILESTONES.filter(([d]) => ageOf(g) >= d).pop();
    if (m && (g.mile || 0) < m[0]) { if (g.mile !== undefined || ageOf(g) - m[0] < 7) cheers.push(`${nameOf(g)}: ${m[1]}`); g.mile = m[0]; } });
}
// Dopo la risemina la pianta ricresce: giorni di gioco per tornare adulta, in proporzione alla realtà
const GROW_DAYS = { basilico:6, menta:6, petunia:8, felce:12, spatifillo:10, calathea:12, salvia:10, geranio:10, rosmarino:14, lavanda:14,
  pothos:10, ortensia:14, zamioculcas:20, sansevieria:21, ficus:18, monstera:18, bouganville:25, ficodindia:25, tillandsia:25, orchidea:30, limone:35, olivo:40, drosera:14, dionea:30, sarracenia:30, nepenthes:30,
  alocasia:20, fittonia:10, maranta:14, begonia:14, echeveria:20, haworthia:22, mammillaria:30, lithops:40, gardenia:30, kumquat:35, cephalotus:40, vanda:40 };
const STAGES = [[.15, "seme", "Seme"], [.45, "germoglio", "Germoglio"], [1, "piantina", "Piantina"]];
const growDays = g => GROW_DAYS[g.plant] || 10;
const growFrac = g => g.growAt ? (now() - g.growAt) / (growDays(g) * DAY) : 1;
// Stadio attuale: "adulta" se non sta crescendo, altrimenti il primo stadio la cui soglia non è ancora superata
function stageOf(g){ const f = growFrac(g); const st = STAGES.find(([t]) => f < t); return st ? st[1] : "adulta"; }
const stageLabel = g => (STAGES.find(([, k]) => k === stageOf(g)) || [,, "Adulta"])[2];
function settleGrowth(){
  S.garden.forEach(g => { if (!g.dead && g.growAt && growFrac(g) >= 1) { delete g.growAt; cheers.push(`${nameOf(g)}: di nuovo pianta adulta. Il ciclo della vita, versione vaso.`); } });
}
function kill(g, cause, note, at){ delete g.growAt; g.diedAt = Math.min(at || now(), now()); g.dead = true; g.cause = cause; g.note = note || null; delete g.em; if (g.nick) { g.rip = g.nick; delete g.nick; } }
// Ogni giorno passato, ogni pianta sana senza emergenze ha una probabilità di averne una.
// Si scelgono solo problemi di cui hai già fatto lo step, così la cura la conosci (o dovresti).
const EM = { chance:.1, maxActive:2, deadline:7, calm:4, cureGocce:3, cureXp:5 };
function rollEmergency(g, at){
  const pool = Object.keys(EMERG).filter(id => EMERG[id].plant === g.plant && S.done.includes(EMERG[id].step) && id !== g.lastEm);
  if (!pool.length) return;
  const id = pool[Math.floor(Math.random() * pool.length)];
  g.em = { id, at, retryAt:0 }; g.lastEm = id;
}
function settleEmergencies(){
  const today = Math.floor(now() / DAY);
  if (S.emDay == null) S.emDay = today;
  while (S.emDay < today) {
    S.emDay++;
    const at = S.emDay * DAY;
    S.garden.forEach(g => {
      if (g.dead || g.em || g.growAt || (g.calmUntil || 0) > at || S.garden.filter(x => x.em).length >= EM.maxActive) return;
      if (Math.random() < EM.chance) rollEmergency(g, at);
    });
  }
  // Un’emergenza ignorata troppo a lungo uccide la pianta
  S.garden.forEach(g => { if (!g.dead && g.em && now() - g.em.at >= EM.deadline * DAY) kill(g, "emergenza", `Nessuno se n’è occupato. ${EMERG[g.em.id].why}`, g.em.at + EM.deadline * DAY); });
}
function settleDeaths(){ S.garden.forEach(g => { if (!g.dead && daysSince(g.wateredAt) >= care(g).dead) kill(g, "secca", null, g.wateredAt + care(g).dead * DAY); }); }
// Piante su cui hai appena fatto la prova del dito (vale finché non annaffi o passa il tempo)
// Prova del dito: per ogni pianta, fino a quando mostrare il risultato (tempo reale, non tempo di gioco)
const FEEL_MS = 6000;
let felt = new WeakMap();
const feltNow = g => (felt.get(g) || 0) > Date.now();
function soilFeel(g){
  const c = care(g), d = daysSince(g.wateredAt), st = plantState(g);
  if (wetLevel(g) > 0) return c.feelWet || "Fango. Le dita escono sporche: niente acqua per un po’.";
  if (d < c.soak) return c.feelDamp || "Umida, fresca sotto il dito. Ancora niente acqua.";
  if (st === "assetata" || st === "appassita") return c.feelDry || "Secca e dura, anche più in fondo. Acqua, e in fretta.";
  return c.feelReady || "Asciutta nei primi centimetri. È il momento giusto per annaffiare.";
}
const kOf = id => S.knowledge[id] || 0;
const isReady = id => kOf(id) >= RULES.knowledgeMax;
const inGarden = id => S.garden.some(g => g.plant === id);
// Due aree: in casa solo piante da casa, sul balcone tutte. Il balcone si apre finendo la zona 1.
const AREAS = { casa:{ title:"Casa", lead:"Il davanzale. Solo piante da interni (come te, d’inverno)." }, balcone:{ title:"Balcone", lead:"Sole, vento, piccioni. Qui ci sta tutto, piante da casa comprese." } };
const slotsOf = a => a === "casa" ? S.slots : S.balcSlots;
const inArea = a => S.garden.filter(g => g.area === a).length;
const freeSlots = a => slotsOf(a) - inArea(a);
const balconyOpen = () => STEPS.filter(s => s.zone === "z1").every(s => S.done.includes(s.id));
const fitsIn = (id, a) => a === "balcone" || PLANTS[id].indoor;
const thirstyCount = () => S.garden.filter(g => g.em || ["assetata","appassita","secca","marcita"].includes(plantState(g))).length;

/* =========================================================
   Render
   ========================================================= */
const app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
function toast(msg, html){ document.querySelector(".toast")?.remove(); const t = document.createElement("div"); t.className = "toast"; if (html) t.innerHTML = msg; else t.textContent = msg; msg = t.textContent; document.body.appendChild(t); setTimeout(() => t.remove(), Math.min(7000, 2000 + msg.length * 45)); }
function bump(sel){ const el = document.querySelector(sel); if (el) { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); } }

function topbar(){
  const n = S.streak.n, lv = levelInfo(S.xp).n;
  return `<header class="top"><div class="brand" aria-label="Vasanicola">${mascot(34)}</div>
    <button class="pill streak${streakToday() ? "" : " off"}" data-streak="1" aria-label="${n} giorni di fila${streakToday() ? "" : ", oggi ancora da fare"}">${beanIcon(24)}${n}</button>
    <div class="pill water" id="pGocce" aria-label="${S.gocce} gocce">${ICON.drop}${S.gocce}</div>
    <button class="pill sun" id="pXp" data-level="1" aria-label="Livello ${lv}">${ICON.sun}${lv}</button></header>`;
}
function tabbar(){
  const t = (id, label, icon, dot) => `<button data-tab="${id}" aria-label="${label}${dot ? ", ci sono piante che hanno bisogno di te" : ""}" ${tab === id ? 'aria-current="page"' : ""}>${dot ? '<span class="dot"></span>' : ""}${icon}</button>`;
  return `<nav class="tabs" aria-label="Sezioni">${t("path","Percorso",ICON.path)}${t("serra","Serra",ICON.serra, thirstyCount() > 0)}${t("erbario","Erbario",ICON.book)}${t("negozio","Negozio",ICON.shop)}</nav>`;
}
function render(){
  settleDeaths(); settleGrowth(); settleEmergencies(); settleMilestones(); settleStreak(); levelCheers(settleLevel()); save();
  if (cheers.length && S.onboarded) { const msg = cheers.join(" "); cheers = []; setTimeout(() => toast(msg), 300); }
  if (lvToast && S.onboarded) { const msg = lvToast; lvToast = ""; setTimeout(() => toast(msg, true), cheers.length ? 2500 : 300); }
  if (!S.onboarded) return renderOnboarding(0);
  if (!welcomed) { welcomed = true; return renderWelcome(); }
  const body = tab === "path" ? renderPath() : tab === "serra" ? renderSerra() : tab === "negozio" ? renderNegozio() : renderErbario();
  app.innerHTML = topbar() + `<main>${body}</main>` + tabbar();
  streakNotice();
  const bar = app.querySelector(".top"); if (bar) document.documentElement.style.setProperty("--toph", bar.offsetHeight + "px");
}

/* --- Bentornato: si vede una volta a ogni apertura, dopo l’onboarding --- */
let welcomed = false;
const GREETINGS = [
  "Oh, ci sei. Le piante avevano iniziato a parlare male di te.",
  "Eccoti. Il davanzale ti aspettava (il davanzale no, le piante sì).",
  "Ciao. Ti ho sognato. Avevi un annaffiatoio in mano. Era un incubo?",
  "Finalmente. Temevo avessi ripiegato sulle piante finte."
];
// Il "personaggio" del giorno dipende dallo stato della serra: il primo che corrisponde vince
function todayCharacter(st){
  if (!S.garden.length) return ["Erborista da Divano", "Sa tutto sulle piante. Non ne ha neanche una."];
  if (st.em) return ["Custode in Allarme Rosso", "Una pianta ha un problema e tu stai leggendo questa frase."];
  if (st.dead > st.alive) return ["Negromante del Davanzale", "Le piante le ha. Vive, è un altro discorso."];
  if (st.thirsty) return ["Custode della Siccità", "Le piante hanno sete. Tu, evidentemente, hai altro da fare."];
  if (st.wet) return ["Alluvione Ambulante", "Ama le piante. Troppo. Fisicamente."];
  if (st.alive >= 4) return ["Entità del Pollice Verde", "Tutte vive. Nessuna emergenza. Sospetto."];
  return ["Apprendista del Davanzale", "Poche piante, ma vive. Si parte da qui (si spera)."];
}
function renderWelcome(){
  const alive = S.garden.filter(g => !g.dead), states = alive.map(plantState);
  const st = { alive: alive.length, dead: S.garden.length - alive.length, em: alive.filter(g => g.em).length,
    thirsty: states.filter(x => x === "assetata" || x === "appassita").length, wet: states.filter(x => x === "zuppa" || x === "fradicia").length };
  const [title, sub] = todayCharacter(st);
  const trouble = st.em || st.thirsty || st.dead;
  const chip = (n, label, cls) => `<span class="wchip ${cls}"><b>${n}</b>${label}</span>`;
  const chips = S.garden.length ? `<div class="wchips">${chip(st.alive, st.alive === 1 ? "viva" : "vive", "")}${st.thirsty ? chip(st.thirsty, "con sete", "water") : ""}${st.em ? chip(st.em, st.em === 1 ? "emergenza" : "emergenze", "bad") : ""}${st.dead ? chip(st.dead, st.dead === 1 ? "da ripiantare" : "da ripiantare", "dead") : ""}</div>` : "";
  app.innerHTML = `<section class="welcome">
    <div class="wsay">${esc(GREETINGS[Math.floor(Math.random() * GREETINGS.length)])}</div>
    ${mascot(150, trouble ? "sad" : "happy")}
    <div class="wlabel">Il tuo personaggio di oggi:</div>
    <h1>${title}</h1><p class="wsub">(${sub})</p>
    ${chips}
    <div class="wacts"><button class="btn ${trouble ? "bad" : ""}" data-go="${trouble ? "serra" : "path"}">${trouble ? "Corri in serra" : "Continua il percorso"}</button>
    <button class="btn ghost" data-go="${trouble ? "path" : "serra"}">${trouble ? "Prima una lezione" : "Passa dalla serra"}</button></div></section>`;
  app.querySelectorAll("[data-go]").forEach(b => b.onclick = () => { tab = b.dataset.go; render(); });
}

/* --- Onboarding --- */
const ONB = [
  { h:"Ciao. Sono Vasanicola.", p:"In abruzzese vuol dire basilico. Sì, quello del supermercato, morto in due settimane sul tuo davanzale (riposi in pace) (non è colpa tua) (un po’ sì).", mood:"sad" },
  { h:"Qui si studia. Poco alla volta.", p:"Ogni lezione ti dà gocce ed esperienza. Con le gocce annaffi e compri semi e vasi, l’esperienza ti fa salire di livello e apre posti in serra. Tipo un videogioco, ma con più sensi di colpa.", mood:"happy" },
  { h:"Si parte dal davanzale.", p:"Poi il balcone, poi il mondo. E stavolta il basilico sopravvive. (Promesso.) (Più o meno.) (Non ci contare troppo.)", mood:"happy" }
];
function renderOnboarding(i){
  const o = ONB[i];
  app.innerHTML = `<section class="onb">${mascot(170, o.mood)}<h1>${o.h}</h1><p>${o.p}</p>
    <div class="dots">${ONB.map((_, j) => `<i class="${j === i ? "on" : ""}"></i>`).join("")}</div>
    <div style="width:100%;margin-top:12px"><button class="btn" id="onbNext">${i < ONB.length - 1 ? "Continua" : "Iniziamo"}</button></div></section>`;
  document.getElementById("onbNext").onclick = () => { if (i < ONB.length - 1) renderOnboarding(i + 1); else { S.onboarded = true; welcomed = true; render(); } };
}

/* --- Percorso --- */
function renderPath(){
  const cur = STEPS.findIndex(s => !S.done.includes(s.id));
  const offsets = [0, 52, 70, 30, -40, -64, -20];
  return ZONES.map((z, zi) => {
    const steps = STEPS.map((s, i) => [s, i]).filter(([s]) => s.zone === z.id);
    const first = steps[0][1], open = cur === -1 || first <= cur;
    const nodes = steps.map(([s, i], k) => {
      const done = S.done.includes(s.id), current = i === cur, locked = cur !== -1 && i > cur;
      const pr = progOf(s), n = lessonCount(s), partial = !done && pr > 0;
      const cls = (done ? "done" : current ? "current" : locked ? "locked" : "") + ((current || partial) ? " ringed" : "");
      const ico = done ? ICON.check : locked ? ICON.lock : ICON[s.icon];
      // Lo stepper si vede sulla casella in corso: un segmento per lezione, pieni quelli fatti
      const ring = (current || partial) ? stepperRing(pr, n) : "";
      return `<div class="nodewrap" style="transform:translateX(${offsets[k % offsets.length]}px)">
        <button class="node ${cls}" data-step="${i}" aria-label="${esc(s.title)}${done ? ", completato" : locked ? ", bloccato" : `, lezione ${pr + 1} di ${n}`}" ${locked ? "aria-disabled=\"true\"" : ""}>${ring}${current ? `<span class="bubble">${partial ? "Continua" : S.done.length ? "Avanti" : "Inizia da qui"}</span>` : ""}${ico}</button>
        <div class="nodelabel">${esc(s.title)}</div></div>`;
    }).join("");
    return `<section class="zsec" style="--z:${z.color};--zs:${z.shade}">
      <div class="zhead"><div class="zone ${open ? "" : "locked"}" data-ztop="${zi}" role="button" tabindex="0" aria-label="Torna all’inizio di ${esc(z.title)}"><div><small>Zona ${zi + 1}</small><h2>${z.title}</h2><p>${open ? z.desc : `Si apre finendo ${ZONES[zi - 1].title}.`}</p></div></div></div>
      <div class="path">${nodes}</div></section>`;
  }).join("") + testTools() + `<div class="teaser">${cur === -1 ? "Hai finito tutte le zone. La prossima è in arrivo: intanto, le tue piante hanno bisogno di te." : "Altre zone del pianeta in arrivo nelle prossime versioni."}</div>`;
}

// Anello a segmenti: n spicchi separati da una piccola fessura, dorati quelli completati
function stepperRing(pr, n){
  const seg = 360 / n, gap = n > 1 ? 7 : 0;
  const parts = Array.from({ length: n }, (_, k) => {
    const a = k * seg + gap / 2, b = (k + 1) * seg - gap / 2, c = k < pr ? "var(--sun)" : "var(--surface-2)";
    return `transparent ${a - gap / 2}deg ${a}deg, ${c} ${a}deg ${b}deg, transparent ${b}deg ${(k + 1) * seg}deg`;
  });
  return `<span class="ring" style="background:conic-gradient(${parts.join(", ")})" aria-hidden="true"></span>`;
}
// Toccando la casella: niente scelta della lezione. Si va avanti in ordine; a casella finita, ripasso a sorpresa.
function openNode(i){
  const st = STEPS[i], pr = progOf(st), n = lessonCount(st), done = pr >= n;
  const bar = `<div class="steps" aria-hidden="true">${Array.from({ length: n }, (_, k) => `<i class="${k < pr ? "on" : ""}"></i>`).join("")}</div>`;
  const text = done ? `Casella completata. Il ripasso pesca a caso dalle sue domande (e porta qualche goccia).`
    : pr === n - 1 ? `<b>Lezione ${n} di ${n}:</b> ${st.icon === "star" ? "ripasso a sorpresa, con domande da tutta la zona." : "allenamento a sorpresa, con domande da tutta la casella."}`
    : `<b>Lezione ${pr + 1} di ${n}:</b> ${esc(lessonTitle(st, pr))}.`;
  const m = modal(`<div class="nodecard"><div class="kind" style="margin:0">${esc(ZONES.find(z => z.id === st.zone).title)}</div><h2>${esc(st.title)}</h2>${bar}<p>${text}</p>
    <div style="display:flex;flex-direction:column;gap:12px"><button class="btn ${done ? "sun" : ""}" id="nodeGo">${done ? "Ripassa" : pr ? "Continua" : "Inizia"}</button><button class="btn ghost" data-close="1">Non ora</button></div></div>`);
  m.querySelector("#nodeGo").onclick = () => { m.remove(); startLesson(i, done ? "review" : undefined); };
}

/* --- Lezione --- */
let L = null;
function startLesson(i, li){
  const step = STEPS[i];
  // "review" = ripasso di una casella finita: domande pescate a caso da tutta la casella
  const review = li === "review";
  if (review || li === undefined) li = Math.min(progOf(step), lessonCount(step) - 1);   // di default: la prossima da fare
  L = { i, li, step, items: review ? practiceItems(step) : withNewPlants(lessonItems(step, li)), idx: 0, mistakes: 0, gained:{}, before:{}, seen:[],
    replay: review || li < progOf(step), title: review ? "Ripasso a sorpresa" : lessonTitle(step, li) };
  showItem();
}
function shuffle(a){ const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
/* --- Parole colorate: i termini del glossario si colorano le prime volte e, toccati, si spiegano --- */
const TERM_SHOWS = 3;   // dopo 3 volte che l'hai vista colorata, la parola torna normale
const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TERMS = (() => {
  const list = [];
  Object.keys(PLANT_HINT).forEach(id => (PLANT_FORMS[id] || [PLANTS[id].name]).forEach(f => list.push({ key:"p:" + id, f })));
  Object.entries(GLOSS).forEach(([k, g]) => g.forms.forEach(f => list.push({ key:"g:" + k, f })));
  // Le forme più lunghe vincono ("luce indiretta" prima di "luce")
  return list.sort((a, b) => b.f.length - a.f.length).map(t => ({ key:t.key,
    re: new RegExp(`(?<!\\p{L})${reEsc(t.f.replace(/\*$/, "")).replace(/’/g, "['’]")}${t.f.endsWith("*") ? "\\p{L}*" : ""}(?!\\p{L})`, "giu") }));
})();
// Colora al massimo 3 parole per frase, ognuna una volta sola; "force" colora comunque quella chiave
function hl(text, force){
  const hits = [], used = new Set();
  TERMS.forEach(t => { if (used.has(t.key) || ((S.terms[t.key] || 0) >= TERM_SHOWS && t.key !== force)) return;
    t.re.lastIndex = 0; let m;
    while ((m = t.re.exec(text))) { const a = m.index, b = a + m[0].length;
      if (!hits.some(h => a < h.b && b > h.a)) { hits.push({ a, b, key:t.key }); used.add(t.key); break; } } });
  const pick = hits.filter(h => h.key === force).concat(hits.filter(h => h.key !== force)).slice(0, 3).sort((x, y) => x.a - y.a);
  let out = "", at = 0;
  pick.forEach(h => { out += text.slice(at, h.a) + `<button class="term${h.key === force ? " new" : ""}" data-term="${h.key}">${text.slice(h.a, h.b)}</button>`; at = h.b; });
  return out + text.slice(at);
}
const qText = (it, force) => hl(esc(it.q), force);
function countTerms(){ app.querySelectorAll(".qbody .term").forEach(b => S.terms[b.dataset.term] = (S.terms[b.dataset.term] || 0) + 1); }
function openHint(btn){
  document.querySelector(".hint")?.remove();
  const [kind, k] = btn.dataset.term.split(":"), plant = kind === "p";
  const h = document.createElement("div"); h.className = "hint"; h.setAttribute("role", "tooltip");
  h.innerHTML = `${plant ? `<div class="hart">${plantSVG(k, 56)}</div>` : ""}<div><b>${plant ? PLANTS[k].name : esc(btn.textContent)}</b><p>${esc(plant ? PLANT_HINT[k] : GLOSS[k].text)}</p></div>`;
  document.body.appendChild(h);
  // Sotto la parola, dentro lo schermo; se sotto non c'è spazio, sopra
  const r = btn.getBoundingClientRect(), w = Math.min(320, innerWidth - 24);
  h.style.width = w + "px"; h.style.left = Math.max(12, Math.min(innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + "px";
  const below = r.bottom + 10 + h.offsetHeight < innerHeight;
  h.style.top = (below ? r.bottom + 10 : r.top - 10 - h.offsetHeight) + "px";
  h.classList.add(below ? "down" : "up");
  btn.classList.add("open");
  const close = e => { if (e && h.contains(e.target)) return; h.remove(); btn.classList.remove("open"); document.removeEventListener("pointerdown", close, true); removeEventListener("scroll", close, true); };
  setTimeout(() => { document.addEventListener("pointerdown", close, true); addEventListener("scroll", close, true); });
}
// Prima volta che una pianta compare in una lezione: prima di tutto, una domanda "Pianta nuova".
// Se la lezione ha già "Quale è la ...?" la sposta davanti; altrimenti ne crea una con due piante già note.
// Articolo davanti al nome ("il basilico", "l’olivo", "lo spatifillo"): lo ricava da delOf
const artOf = id => { const d = delOf(id); return d.startsWith("dell’") ? "l’" : d.startsWith("della") ? "la " : d.startsWith("dello") ? "lo " : "il "; };
function withNewPlants(items){
  const out = items.slice(), seen = new Set(S.discovered);
  items.forEach(it => { const p = it.plant; if (!p || seen.has(p)) return; seen.add(p);
    const at = out.findIndex(x => x.plant === p), idq = out.findIndex(x => x.t === "id" && x.a === p);
    let nw;
    if (idq >= 0) { nw = { ...out[idq], isNew:true }; out.splice(idq, 1); }
    else { const pool = Object.keys(PLANTS).filter(x => x !== p && S.discovered.includes(x));
      const others = shuffle(pool.length >= 2 ? pool : Object.keys(PLANTS).filter(x => x !== p)).slice(0, 2);
      nw = { t:"id", plant:p, isNew:true, q:`Quale è ${artOf(p)}${PLANTS[p].name[0].toLowerCase() + PLANTS[p].name.slice(1)}?`, o:shuffle([p, ...others]), a:p, why:PLANT_HINT[p] }; }
    out.splice(at, 0, nw); });
  return out;
}
function showItem(){
  const it = L.items[L.idx];
  const pct = Math.round(L.idx / L.items.length * 100);
  let inner = "", kind = "";
  if (it.t === "mc") { kind = "Scegli la risposta"; inner = `<div class="q">${qText(it)}</div><div class="opts">${it.o.map((o, k) => `<button class="opt" data-k="${k}" aria-pressed="false">${esc(o)}</button>`).join("")}</div>`; }
  if (it.t === "tf") { kind = "Vero o falso?"; inner = `<div class="q">${qText(it)}</div><div class="tf"><button class="opt" data-k="true" aria-pressed="false">Vero</button><button class="opt" data-k="false" aria-pressed="false">Falso</button></div>`; }
  if (it.t === "id") { kind = it.isNew ? "Pianta nuova" : "Riconosci la pianta"; inner = `<div class="q">${qText(it, it.isNew ? "p:" + it.a : null)}</div><div class="ids">${it.o.map(p => `<button class="opt" data-k="${p}" aria-pressed="false" aria-label="Pianta ${["A","B","C","D"][it.o.indexOf(p)]}">${plantSVG(p, 92)}</button>`).join("")}</div>`; }
  if (it.t === "err") { kind = "Trova l’errore"; inner = `<div class="q">${qText(it)}</div><div class="opts">${it.o.map((o, k) => `<button class="opt" data-k="${k}" aria-pressed="false">${esc(o)}</button>`).join("")}</div>`; }
  if (it.t === "order") { kind = "Metti in ordine"; let mix; do { mix = shuffle(it.steps.map((_, k) => k)); } while (mix.every((v, k) => v === k));
    inner = `<div class="q">${qText(it)}</div><ol class="ordans" aria-label="La tua sequenza"></ol><div class="opts ordpool">${mix.map(k => `<button class="opt" data-o="${k}">${esc(it.steps[k])}</button>`).join("")}</div>`; }
  markSeen(it);
  if (it.t === "match") { kind = "Abbina le coppie"; const L1 = shuffle(it.pairs.map(p => p[0])), R1 = shuffle(it.pairs.map(p => p[1]));
    inner = `<div class="q">${esc(it.q)}</div><div class="match">${L1.map((l, k) => `<button class="opt" data-side="l" data-v="${esc(l)}">${esc(l)}</button><button class="opt" data-side="r" data-v="${esc(R1[k])}">${esc(R1[k])}</button>`).join("")}</div>`; }
  app.innerHTML = `<section class="lesson"><div class="lhead"><button id="quit" aria-label="Esci dalla lezione">${ICON.x}</button><div class="prog" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div></div>
    <div class="qbody"><div class="kind${it.isNew ? " isnew" : ""}">${kind}${it.lv === 3 ? '<span class="lvtag">Difficile</span>' : ""}</div>${inner}</div>
    <div class="lfoot"><button class="btn" id="check" disabled>Controlla</button></div></section>
    <div class="sheet" id="sheet" role="status" aria-live="polite"></div>`;
  requestAnimationFrame(() => { const bar = app.querySelector(".prog i"); if (bar) bar.style.width = pct + "%"; });
  document.getElementById("quit").onclick = () => ask("Mollare adesso?", "Vasanicola ci resterà male (lo nasconde bene) (non lo nasconde). I progressi di questa lezione si perdono, quello che hai scoperto sulle piante no.", "Esci lo stesso", () => { L = null; render(); }, "Resto, dai");
  const check = document.getElementById("check");
  countTerms(); save();
  app.querySelectorAll(".qbody .term").forEach(b => b.onclick = e => { e.stopPropagation(); openHint(b); });
  if (it.t === "match") return setupMatch(it, check);
  if (it.t === "order") return setupOrder(it, check);
  let sel = null;
  // Vero/falso, scelta multipla, trova l'errore, riconosci: il tocco sulla risposta è già la risposta (niente "Controlla")
  check.closest(".lfoot").hidden = true;
  app.querySelectorAll(".qbody .opt").forEach(b => b.onclick = () => { if (sel !== null) return; b.setAttribute("aria-pressed", "true"); sel = b.dataset.k; check.onclick(); });
  check.onclick = () => {
    const ok = it.t === "mc" || it.t === "err" ? +sel === it.a : it.t === "tf" ? (sel === "true") === it.a : sel === it.a;
    app.querySelectorAll(".qbody .opt").forEach(x => { x.disabled = true; const k = x.dataset.k;
      const right = it.t === "mc" || it.t === "err" ? +k === it.a : it.t === "tf" ? (k === "true") === it.a : k === it.a;
      if (right) x.classList.add("ok"); else if (k === sel) x.classList.add("ko"); });
    feedback(ok, it.why, it.plant, it.lv || 1);
  };
}
// Metti in ordine: tocchi i passaggi nell'ordine giusto; toccandone uno già messo, torna giù
function setupOrder(it, check){
  const ans = app.querySelector(".ordans"), pool = app.querySelector(".ordpool");
  const sync = () => { check.disabled = ans.children.length !== it.steps.length;
    [...ans.children].forEach((li, n) => li.querySelector("b").textContent = n + 1); };
  pool.querySelectorAll(".opt").forEach(b => b.onclick = () => {
    const li = document.createElement("li"); li.innerHTML = `<button class="opt" data-o="${b.dataset.o}"><b></b>${b.innerHTML}</button>`;
    li.firstChild.onclick = () => { li.remove(); b.hidden = false; sync(); };
    ans.appendChild(li); b.hidden = true; sync(); });
  check.onclick = () => {
    const got = [...ans.querySelectorAll(".opt")].map(x => +x.dataset.o), ok = got.every((v, k) => v === k);
    // Dopo il controllo si vede sempre la sequenza giusta: verde dove avevi indovinato il posto, rosso dove no
    ans.innerHTML = it.steps.map((t, k) => `<li><button class="opt ${got[k] === k ? "ok" : "ko"}" disabled><b>${k + 1}</b>${esc(t)}</button></li>`).join("");
    pool.remove();
    feedback(ok, it.why, it.plant, it.lv || 1);
  };
}
function setupMatch(it, check){
  let pick = null, left = it.pairs.length, errors = 0;
  const map = Object.fromEntries(it.pairs);
  app.querySelectorAll(".match .opt").forEach(b => b.onclick = () => {
    if (!pick || pick.dataset.side === b.dataset.side) { app.querySelectorAll(".match .opt").forEach(x => x.setAttribute("aria-pressed", "false")); b.setAttribute("aria-pressed", "true"); pick = b; return; }
    const l = pick.dataset.side === "l" ? pick : b, r = pick.dataset.side === "l" ? b : pick;
    if (map[l.dataset.v] === r.dataset.v) { [l, r].forEach(x => { x.classList.add("ok"); x.disabled = true; }); left--; if (!left) { check.disabled = false; check.textContent = "Continua"; } }
    else { errors++; [l, r].forEach(x => { x.classList.add("ko"); setTimeout(() => x.classList.remove("ko"), 500); }); }
    app.querySelectorAll(".match .opt").forEach(x => x.setAttribute("aria-pressed", "false")); pick = null;
  });
  check.onclick = () => feedback(errors === 0, errors === 0 ? "Tutte giuste al primo colpo. Sospetto." : `Fatte, con ${errors} ${errors === 1 ? "errore" : "errori"} per strada. Conta che sono arrivate.`, null);
}
// Livelli di scoperta di una pianta: si sale di uno a ogni risposta giusta su quella pianta
const DISCOVERY = ["Mai vista", "Ti ricordi la faccia", "Sai come si chiama", "La conosci davvero: puoi piantarla"];
// Titoli di esperto: dopo "La conosci davvero" (3/3) si sale di grado rispondendo giusto a domande di livello 2-3
// su quella pianta. Al massimo un grado al giorno per pianta: la padronanza si costruisce su giorni diversi.
const EXPERT = ["", "Custode", "Guru", "Leggenda"];
const expertOf = id => (S.expert[id] || {}).g || 0;
const todayN = () => Math.floor(now() / DAY);
// Articolo giusto davanti al nome: del Basilico, dello Spatifillo, dell’Olivo, della Menta, dell’Orchidea
function delOf(id){ const n = PLANTS[id].name, v = /^[aeiouAEIOU]/.test(n);
  if (PLANTS[id].g === "f") return (v ? "dell’" : "della ") + n;
  return v ? "dell’" + n : /^(s[^aeiou]|z|gn|ps|x|y)/i.test(n) ? "dello " + n : "del " + n; }
const titleOf = id => expertOf(id) ? `${EXPERT[expertOf(id)]} ${delOf(id)}` : "";
// Piante rare: per piantarle serve un titolo sulla "cugina facile"
const gateOk = id => !PLANTS[id].gate || expertOf(PLANTS[id].gate.plant) >= PLANTS[id].gate.grade;
const gateText = id => { const gt = PLANTS[id].gate; return `Serve: ${EXPERT[gt.grade]} ${delOf(gt.plant)}`; };
const canPlant = id => isReady(id) && gateOk(id);
const OK_TITLES = ["Giusto!","Esatto. Chi ti ha insegnato?","Pollice verde (in prova).","Corretto. Vasanicola annuisce."];
const KO_TITLES = ["Ehm, no.","Quasi. (Non proprio.)","La pianta ha visto tutto.","No, ma con convinzione."];
function feedback(ok, why, plant, lvl = 1){
  if (!ok) L.mistakes++;
  // Conoscenza: subito, e solo se la risposta è giusta e la domanda è su una pianta
  let discovery = "";
  if (ok && plant) {
    const k0 = kOf(plant);
    if (!(plant in L.before)) L.before[plant] = k0;
    L.gained[plant] = (L.gained[plant] || 0) + 1;
    S.knowledge[plant] = Math.min(RULES.knowledgeMax, k0 + 1); save();
    const k = kOf(plant), max = RULES.knowledgeMax, up = k > k0;
    // pianta già scoperta del tutto: niente riquadro, sarebbe solo rumore
    if (up) discovery = `<div class="disc">${plantSVG(plant, 40)}<div class="t"><b>${PLANTS[plant].name}: scoperta ${k}/${max}</b><small>${DISCOVERY[k]}</small>
      <div class="bar ${k >= max ? "full" : ""}"><i style="width:${k0 / max * 100}%" data-to="${k / max * 100}"></i></div></div></div>`;
    // Titolo di esperto: pianta già conosciuta del tutto, domanda medio-difficile, un grado al giorno
    const e = S.expert[plant] || { g:0, day:-1 };
    if (k0 >= max && lvl >= 2 && e.g < 3 && e.day !== todayN()) {
      S.expert[plant] = { g: e.g + 1, day: todayN() }; save();
      discovery = `<div class="disc xp-up">${plantSVG(plant, 40)}<div class="t"><b>Nuovo titolo: ${titleOf(plant)}</b><small>${["", "Il primo gradino da esperto.", "Ormai ti chiedono consigli.", "Grado massimo. Le piante parlano di te."][S.expert[plant].g]}</small><div class="dots">${[1,2,3].map(n => `<i class="${n <= S.expert[plant].g ? "on" : ""}"></i>`).join("")}</div></div></div>`;
    }
  }
  // La pianta incontrata si segna solo per questa lezione: diventa "scoperta" a lezione finita
  if (plant && !L.seen.includes(plant)) L.seen.push(plant);
  const sh = document.getElementById("sheet");
  sh.className = "sheet " + (ok ? "ok" : "ko");
  const title = (ok ? OK_TITLES : KO_TITLES)[Math.floor(Math.random() * 4)];
  sh.innerHTML = `<h3>${ok ? ICON.check.replace("<svg", '<svg width="26" height="26"') : ICON.x.replace("<svg", '<svg width="24" height="24"')}${title}</h3><p>${esc(why || "")}</p>${discovery}<button class="btn ${ok ? "" : "bad"}" id="cont">Continua</button>`;
  requestAnimationFrame(() => sh.classList.add("show"));
  setTimeout(() => sh.querySelectorAll(".disc .bar i").forEach(i => i.style.width = i.dataset.to + "%"), 300);
  document.getElementById("check").style.visibility = "hidden";
  document.getElementById("cont").onclick = next;
}
function next(){ L.idx++; if (L.idx >= L.items.length) finishLesson(); else showItem(); }


/* =========================================================
   Livelli: l'esperienza non si spende, sale e basta.
   Ogni livello apre qualcosa (un posto in serra o un premio in gocce).
   ========================================================= */
const LEVELS = [
  { xp:0,    name:"Seme",                  line:"Tutto da scrivere. E da annaffiare." },
  { xp:40,   name:"Germoglio",             line:"Qualcosa spunta. Speriamo non sia muffa.",     casa:1 },
  { xp:100,  name:"Piantina",              line:"Fragile, ma ci siamo.",                        casa:1 },
  { xp:180,  name:"Talea con le radici",   line:"Hai messo radici. Letteralmente.",             gocce:30 },
  { xp:280,  name:"Pollice verdino",       line:"Le piante iniziano a fidarsi.",                balcone:1 },
  { xp:380,  name:"Pollice verde",         line:"Ti chiedono consigli al bar.",                 balcone:1 },
  { xp:500,  name:"Mani da vivaio",        line:"Terra sotto le unghie, con orgoglio.",         casa:1 },
  { xp:640,  name:"Sussurro alle felci",   line:"Loro rispondono. Tu fai finta di niente.",     balcone:1 },
  { xp:800,  name:"Terrore dei parassiti", line:"Le cocciniglie si passano la voce.",           casa:1 },
  { xp:980,  name:"Botanica da divano",    line:"Sai i nomi latini. Li usi alle cene.",         balcone:1 },
  { xp:1180, name:"Magia del sottovaso",   line:"Mai più acqua ferma. Quasi mai.",              casa:1 },
  { xp:1400, name:"Domatura di carnivore", line:"La dionea ti saluta. Con prudenza.",           balcone:1 },
  { xp:1650, name:"Serra da rivista",      line:"I vicini fotografano il tuo balcone.",         balcone:1 },
  { xp:1950, name:"Giungla domestica",     line:"Il divano ormai è un supporto per il pothos.", gocce:60 },
  { xp:2300, name:"Mito del davanzale",    line:"Ne parleranno i basilici del futuro.",         gocce:100 }
];
const LEVEL_STEP = 400;   // dopo l'ultimo, un livello ogni 400 XP, con 60 gocce di premio
function levelInfo(xp){
  const last = LEVELS.length - 1;
  if (xp >= LEVELS[last].xp) { const extra = Math.floor((xp - LEVELS[last].xp) / LEVEL_STEP);
    return { n:last + 1 + extra, L:{ ...LEVELS[last], name: extra ? `${LEVELS[last].name} +${extra}` : LEVELS[last].name }, from:LEVELS[last].xp + extra * LEVEL_STEP, to:LEVELS[last].xp + (extra + 1) * LEVEL_STEP }; }
  const i = LEVELS.findIndex((l, k) => xp < (LEVELS[k + 1] || { xp:Infinity }).xp);
  return { n:i + 1, L:LEVELS[i], from:LEVELS[i].xp, to:LEVELS[i + 1].xp };
}
// "Livello 7" sempre seguito dal sole, così si capisce che viene dall’esperienza
const lvTxt = n => `Livello ${n}<i class="lvsun">${ICON.sun}</i>`;
const levelReward = n => n <= LEVELS.length ? LEVELS[n - 1] : { gocce:60 };
const rewardText = r => r.casa ? "Si apre un posto in casa." : r.balcone ? "Si apre un posto sul balcone." : r.gocce ? `+${r.gocce} gocce.` : "";
// Posti in serra dovuti al livello n (la casa ne ha 1 di partenza)
const slotsAt = n => LEVELS.slice(0, n).reduce((a, l) => ({ casa:a.casa + (l.casa || 0), balcone:a.balcone + (l.balcone || 0) }), { casa:1, balcone:0 });
// Prossimo livello che apre un posto in quell'area (per il posto bloccato in serra)
const nextSlotLevel = a => { const k = LEVELS.findIndex((l, i) => l[a] && i + 1 > S.lv); return k < 0 ? null : { n:k + 1, L:LEVELS[k] }; };
function settleLevel(){
  const n = levelInfo(S.xp).n;
  if (!S.lv) {   // salvataggi di prima: niente premi arretrati in gocce, ma i posti dovuti sì
    S.lv = n; const sl = slotsAt(Math.min(n, LEVELS.length)); S.slots = Math.max(S.slots, sl.casa); S.balcSlots = Math.max(S.balcSlots, sl.balcone); return [];
  }
  const ups = [];
  while (S.lv < n) { S.lv++; const r = levelReward(S.lv);
    if (r.casa) S.slots++; if (r.balcone) S.balcSlots++; if (r.gocce) S.gocce += r.gocce;
    ups.push(S.lv); }
  return ups;
}
// Più livelli insieme (es. dopo "Finisci tutto"): un avviso solo, riassunto
function levelCheers(ups){
  if (!ups.length) return;
  const r = ups.map(levelReward), sum = k => r.reduce((a, x) => a + (x[k] || 0), 0), n = ups[ups.length - 1];
  const parts = [sum("casa") && `${sum("casa") === 1 ? "un posto" : sum("casa") + " posti"} in casa`, sum("balcone") && `${sum("balcone") === 1 ? "un posto" : sum("balcone") + " posti"} sul balcone`].filter(Boolean);
  lvToast = `${lvTxt(n)}: ${esc(levelInfo(S.xp).L.name)}. ${parts.length ? (sum("casa") + sum("balcone") > 1 ? "Si aprono " : "Si apre ") + parts.join(" e ") + "." : ""}${sum("gocce") ? ` +${sum("gocce")} gocce.` : ""}`;
}
let lvToast = "";
function openLevel(){
  const { n, L, from, to } = levelInfo(S.xp), nx = levelReward(n + 1), nxName = levelInfo(to).L.name;
  modal(`<div style="text-align:center">${mascot(90)}<div class="kind" style="margin-top:8px">${lvTxt(n)}</div><h2>${L.name}</h2><p style="color:var(--ink-2);margin:4px 0 14px">${L.line}</p>
    <div class="bar lvbar"><i style="width:${Math.round((S.xp - from) / (to - from) * 100)}%"></i></div>
    <p class="pnote" style="margin:8px 0 0">${S.xp} XP. Ancora ${to - S.xp} per ${nxName}: ${rewardText(nx).toLowerCase()}</p></div><button class="btn" data-close="1" style="margin-top:20px">Ok</button>`);
}
/* =========================================================
   Giorni di fila: il fagiolo nel cotone. Cresce a ogni giorno con almeno un quiz finito.
   ========================================================= */
// Il giorno lo decide il calendario del telefono (mezzanotte locale), non "24 ore dall'ultima volta"
const localDay = t => { const d = new Date(t); return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY); };
// Fasi del fagiolo: da quale giorno di fila, e il premio quando ci arrivi (le prime due non ne hanno)
const BEAN = [
  { n:1,   name:"Seme",               msg:"Primo giorno: un fagiolo nel cotone bagnato, come alle elementari. Domani torna a vedere se si muove." },
  { n:3,   name:"Radichetta",         msg:"Spunta la radichetta. Il fagiolo è vivo, e adesso dipende da te." },
  { n:7,   name:"Germoglio",          msg:"Germoglio! Una settimana di fila: il fagiolo ti ringrazia, a modo suo.", g:20, x:30 },
  { n:14,  name:"Prime foglie",       msg:"Prime foglie vere. Due settimane: la maestra delle elementari sarebbe fiera.", g:30, x:50 },
  { n:30,  name:"Col bastoncino",     msg:"Un mese! È così alto che serve un bastoncino. Di quelli del gelato, ovvio.", g:50, x:100 },
  { n:60,  name:"Sulla finestra",     msg:"Due mesi: si arrampica sulla finestra. I vicini iniziano a preoccuparsi.", g:80, x:150 },
  { n:100, name:"In fiore",           msg:"Cento giorni: il fagiolo fiorisce. Nessuno ci credeva. Nemmeno il fagiolo.", g:120, x:200 },
  { n:365, name:"Oltre le nuvole",    msg:"Un anno. Il fagiolo ha bucato le nuvole. Lassù c’è un gigante che chiede di te.", g:300, x:500 }
];
const SPRAY = { cost:100, max:2 };
const beanStage = n => Math.max(0, BEAN.reduce((k, b, i) => n >= b.n ? i : k, 0));
const nextBean = n => BEAN.find(b => b.n > n) || null;
const streakToday = () => S.streak.last === localDay(now());
// All'apertura: se hai saltato dei giorni li copre lo spruzzino; se non basta, il cotone si secca
function settleStreak(){
  const st = S.streak, today = localDay(now());
  if (!st.n || st.last === null || today - st.last <= 1) return;
  const missed = today - st.last - 1;
  if (st.lids >= missed) { st.lids -= missed; st.wet = [...(st.wet || []), ...Array.from({ length:missed }, (_, k) => st.last + 1 + k)].slice(-14); st.last = today - 1; st.saved = (st.saved || 0) + missed; }
  else { st.lost = st.n; st.n = 0; st.last = null; st.hist = []; st.wet = []; }
}
function streakNotice(){
  const st = S.streak;
  if (st.saved) { const k = st.saved; st.saved = 0; save(); toast(`${k === 1 ? "Lo spruzzino ha" : `${k} spruzzini hanno`} tenuto umido il cotone: il fagiolo è salvo, ${st.n} giorni di fila.`); }
  else if (st.lost) { const k = st.lost; st.lost = 0; save();
    modal(`<div style="text-align:center">${beanSVG(Math.min(3, beanStage(k)), 110, true)}<h2>Il cotone si è seccato</h2><p style="color:var(--ink-2)">Il fagiolo aveva ${k} ${k === 1 ? "giorno" : "giorni"} di fila. Si riparte da un seme nuovo: cresce dal primo quiz di oggi.</p>
      <p style="color:var(--ink-2);font-size:14px">Uno spruzzino dal Negozio l’avrebbe salvato. Lo diciamo con affetto.</p></div><button class="btn" data-close="1">Nuovo seme</button>`); }
}
// Al primo quiz finito della giornata: il fagiolo cresce (ed eventuale premio). Torna null se oggi era già fatto.
function bumpStreak(){
  const st = S.streak, today = localDay(now());
  if (st.last === today) return null;
  const before = st.n && st.last === today - 1 ? st.n : 0;
  st.n = before + 1; st.last = today; st.best = Math.max(st.best || 0, st.n);
  st.hist = [...(st.hist || []).filter(d => d > today - 14), today];
  const b = BEAN.find(x => x.n === st.n) || (st.n > 365 && st.n % 365 === 0 ? BEAN[BEAN.length - 1] : null);
  if (b && b.g) { S.gocce += b.g; S.xp += b.x; }
  save();
  return { n:st.n, b, grew: beanStage(st.n) > beanStage(before) || st.n === 1 };
}
// Ultimi 7 giorni: annaffiato (quiz), spruzzato (salvato) o vuoto
function weekRow(){
  const st = S.streak, today = localDay(now()), names = ["D","L","M","M","G","V","S"];
  return `<div class="bweek">${Array.from({ length:7 }, (_, k) => { const d = today - 6 + k, wd = new Date((d * DAY) + 12 * 3600e3).getUTCDay();
    const on = (st.hist || []).includes(d), wet = (st.wet || []).includes(d);
    return `<div class="${on ? "on" : wet ? "wet" : ""}${d === today ? " today" : ""}"><i></i><span>${names[wd]}</span></div>`; }).join("")}</div>`;
}
function showStreak(info, done){
  const { n, b, grew } = info, st = beanStage(n), nx = nextBean(n);
  const sub = b ? b.msg : nx ? `Giorno ${n}. Prossima tappa: ${nx.name.toLowerCase()}, tra ${nx.n - n} ${nx.n - n === 1 ? "giorno" : "giorni"}.` : `Giorno ${n}. Il fagiolo ormai vive tra le nuvole.`;
  app.innerHTML = `<section class="result streak">
    <div class="bstage${grew ? " grow" : ""}">${grew && st > 0 ? `<div class="bold">${beanSVG(st - 1, 170)}</div>` : ""}<div class="bnew">${beanSVG(st, 170)}</div></div>
    <h1><span class="snum">${n}</span> ${n === 1 ? "giorno" : "giorni"} di fila</h1>
    ${b ? `<div class="kind" style="margin:-6px 0 0">${b.name}</div>` : ""}
    <p class="sub">${sub}</p>
    ${b && b.g ? dropBox(b.g, [["Premio del fagiolo", b.g]]) + `<p class="sub" style="margin:0">E una bella spinta di esperienza.</p>` : ""}
    ${weekRow()}
    <div style="width:100%;margin-top:auto"><button class="btn" id="sgo">Continua</button></div></section>`;
  document.getElementById("sgo").onclick = done;
}
// Tocco sul fagiolo in alto: come la fiamma di Duolingo, ti dice a che punto sei
function openStreak(){
  const st = S.streak, n = st.n, today = streakToday(), nx = nextBean(n), cur = BEAN[beanStage(n)];
  const prev = n ? cur.n : 0, pct = nx ? Math.round((n - (n ? cur.n : 0)) / (nx.n - prev) * 100) : 100;
  const status = !n ? "Il cotone è pronto, il fagiolo anche. Manchi tu: finisci un quiz e si parte."
    : today ? "Oggi l’hai già annaffiato. Torna domani per farlo crescere ancora."
    : "Oggi ancora niente: finisci un quiz prima di mezzanotte, o il cotone inizia a seccarsi.";
  modal(`<div style="text-align:center"><div class="${today || !n ? "" : "thirsty"}">${beanSVG(beanStage(n), 120)}</div>
    <h2>${n} ${n === 1 ? "giorno" : "giorni"} di fila</h2><div class="kind" style="margin-top:2px">${n ? cur.name : "Ancora da piantare"}</div>
    <p style="color:var(--ink-2);margin:8px 0 14px">${status}</p></div>
    ${weekRow()}
    ${nx ? `<div class="bnext"><div><b>Prossima tappa: ${nx.name}</b><span>Al giorno ${nx.n}${nx.g ? `, con ${nx.g} gocce di premio` : ""}.</span></div><div class="bar"><i style="width:${pct}%"></i></div></div>` : ""}
    <div class="binfo">
      <p><b>Come funziona.</b> Ogni giorno in cui finisci almeno un quiz, il fagiolo cresce. Se salti un giorno, il cotone si secca e si ricomincia dal seme.</p>
      <p><b>Spruzzini: ${st.lids} su ${SPRAY.max}.</b> Ognuno tiene umido il cotone per un giorno saltato, da solo. Si comprano nel Negozio.</p>
      ${st.best > n ? `<p><b>Record:</b> ${st.best} giorni di fila.</p>` : ""}
    </div>
    <button class="btn" data-close="1">Ok</button>`);
}
// Riquadro delle gocce guadagnate: goccia grande, totale e da dove arrivano
const dropBox = (g, parts) => `<div class="dropbox"><div class="dbicon">${ICON.drop}</div><div class="dbt"><b>+${g}</b><span>Gocce</span></div>
  <ul class="dbparts">${parts.map(([t, v]) => `<li><span>${t}</span><b>+${v}</b></li>`).join("")}</ul></div>`;
// Fine lezione: il numero delle gocce conta da 0, e con zero errori piovono foglie
function celebrate(leaves){
  const quiet = matchMedia("(prefers-reduced-motion: reduce)").matches, num = app.querySelector(".dbt b");
  if (num && !quiet) { const to = +num.textContent.replace(/\D/g, ""), t0 = performance.now() + 200;
    const tick = t => { const k = Math.min(1, Math.max(0, (t - t0) / 700)); num.textContent = "+" + Math.round(to * (1 - (1 - k) ** 3)); if (k < 1) requestAnimationFrame(tick); };
    num.textContent = "+0"; requestAnimationFrame(tick); }
  if (!leaves || quiet) return;
  const box = document.createElement("div"); box.className = "confetti"; box.setAttribute("aria-hidden", "true");
  const cols = ["#43b05c", "#5cc875", "#f2c230", "#3da5ec", "#f28bb5"];
  box.innerHTML = Array.from({ length:22 }, (_, k) => `<i style="left:${Math.random() * 100}%;color:${cols[k % cols.length]};animation-delay:${Math.random() * .6}s;animation-duration:${1.8 + Math.random() * 1.2}s;--r:${Math.round(Math.random() * 720 - 360)}deg;--x:${Math.round(Math.random() * 80 - 40)}px">${ICON.leaf}</i>`).join("");
  app.appendChild(box); setTimeout(() => box.remove(), 3600);
}
function finishLesson(){
  const perfect = L.mistakes === 0;
  // Ricompense: l'Allenamento (domande già viste) vale metà esperienza; le zone difficili (dalla 6) valgono di più
  const practice = !L.replay && L.step.items && L.li >= authored(L.step).length, hardZone = ZONES.findIndex(z => z.id === L.step.zone) >= 5;
  const g = L.replay ? RULES.replayGocce : RULES.stepGocce + (perfect ? RULES.perfectBonusGocce : 0) + (hardZone ? 2 : 0);
  const x = L.replay ? RULES.replayXp : Math.round((RULES.stepXp + (perfect ? RULES.perfectBonusXp : 0)) / (practice ? 2 : 1)) + (hardZone ? 5 : 0);
  S.gocce += g; S.xp += x;
  const xpBefore = S.xp - x, day = bumpStreak(), ups = settleLevel();
  // Esperienza: niente numeri, solo la barra del livello che avanza (i punti sono nella finestra del livello)
  const lb = levelInfo(xpBefore), la = levelInfo(S.xp), frac = (v, l) => Math.round((v - l.from) / (l.to - l.from) * 100);
  const up = ups.length ? ups.map(levelReward).map(rewardText).filter(Boolean).join(" ") : "";
  const lvBar = `<div class="lvres${up ? " up" : ""}"><div class="lvhead"><b>${lvTxt(la.n)}</b><em>${esc(la.L.name)}</em></div><div class="bar"><i data-to="${frac(S.xp, la)}" style="width:${la.n > lb.n ? 0 : frac(xpBefore, lb)}%"></i></div>${up ? `<p class="lvnew"><b>Livello nuovo!</b> ${up}</p>` : ""}</div>`;
  const before = L.before;
  L.seen.forEach(p => { if (!S.discovered.includes(p)) S.discovered.push(p); });
  if (!L.replay) S.prog[L.step.id] = L.li + 1;
  const nodeDone = stepDone(L.step) && !S.done.includes(L.step.id);
  if (stepDone(L.step) && !S.done.includes(L.step.id)) S.done.push(L.step.id);
  const unblocked = S.garden.filter(x => x.em && x.em.retryAt > now() && EMERG[x.em.id].step === L.step.id);
  unblocked.forEach(x => x.em.retryAt = 0);
  save();
  const rows = Object.keys(L.gained).map(p => { const k = kOf(p), full = k >= RULES.knowledgeMax;
    return `<div class="kcard">${plantSVG(p, 46)}<div class="t"><b>${PLANTS[p].name}</b><div class="bar ${full ? "full" : ""}"><i data-to="${k / RULES.knowledgeMax * 100}" style="width:${before[p] / RULES.knowledgeMax * 100}%"></i></div></div>${full ? (inGarden(p) ? '<span class="tag planted">In serra</span>' : '<span class="tag ready">Pronta!</span>') : `<span class="tag study">${k}/${RULES.knowledgeMax}</span>`}</div>`; }).join("");
  const readyNow = Object.keys(L.gained).some(p => canPlant(p) && !inGarden(p));
  const lines = perfect ? ["Zero errori. Hai studiato botanica di nascosto? (Ammettilo.)","Perfetto. Vasanicola piange (di gioia) (forse)."] : ["Fatto. Qualche foglia persa per strada (e qualche neurone).","Completato. Gli errori sono concime. (Lo diciamo per consolarti.)"];
  app.innerHTML = `<section class="result lres">${mascot(96)}<div class="kind" style="margin:0">${esc(L.step.title)}: ${esc(L.title)}</div><h1>${L.replay ? "Ripasso fatto!" : nodeDone ? "Casella completata!" : "Lezione completata!"}</h1><p class="sub">${lines[Math.floor(Math.random() * 2)]}</p>
    ${dropBox(g, L.replay ? [["Ripasso", g]] : [["Lezione", RULES.stepGocce], perfect && ["Zero errori", RULES.perfectBonusGocce], hardZone && ["Zona difficile", 2]].filter(Boolean))}
    ${lvBar}
    ${rows ? `<div class="kl"><div class="kind" style="margin:0">Conoscenza</div><div class="kcar">${rows}</div></div>` : ""}
    <div style="width:100%;margin-top:auto;display:flex;flex-direction:column;gap:12px">
      ${unblocked.length ? `<p class="sub" style="margin:0">Ora sai cosa fare: puoi riprovare a curare ${unblocked.map(x => esc(nameOf(x))).join(" e ")}.</p><button class="btn bad" id="toSerra">Torna a curarla</button>` : readyNow ? `<button class="btn sun" id="toSerra">Vai a piantarla</button>` : ""}
      <button class="btn ${readyNow || unblocked.length ? "ghost" : ""}" id="toPath">Continua</button></div></section>`;
  setTimeout(() => app.querySelectorAll(".bar i").forEach(i => i.style.width = i.dataset.to + "%"), 250);
  celebrate(perfect && !L.replay);
  const back = L.from || "path";
  // Prima di tornare: se è il primo quiz di oggi, la schermata della goccia
  const go = dest => { L = null; if (day) showStreak(day, () => { tab = dest; render(); window.scrollTo(0, 0); }); else { tab = dest; render(); } };
  document.getElementById("toPath").onclick = () => go(back);
  const ts = document.getElementById("toSerra"); if (ts) ts.onclick = () => go("serra");
}

/* --- Serra --- */
// Riga di default di una pianta (quando non c'è la prova del dito in corso)
const restLine = (g, i) => g.em ? "" : pickLine(plantState(g), i);
function slotCard(g, i){
  const st = plantState(g), p = PLANTS[g.plant], c = care(g);
  const line = g.dead ? `${g.rip ? `Addio, ${esc(g.rip)}. ` : ""}Ha vissuto ${ageOf(g)} ${ageOf(g) === 1 ? "giorno" : "giorni"}. ${g.note || (g.cause === "marcita" ? c.wetTip : c.dryTip)}`
    : feltNow(g) ? `<b class="feel">Prova del dito:</b> ${soilFeel(g)}` : restLine(g, i);
  const em = !g.dead && g.em ? `<button class="emerg" data-em="${i}">${ICON.alert}<span><b>Emergenza</b>${esc(EMERG[g.em.id].title)}</span></button>` : "";
  const action = g.dead
    ? `<button class="btn small" data-replant="${i}" ${S.gocce < RULES.replantCost ? "disabled" : ""}>Ripianta il seme ${RULES.replantCost}${ICON.drop.replace("<svg", '<svg width="16" height="16"')}</button>`
    : `<div class="acts"><button class="btn small ghost" data-feel="${i}">Dito nella terra</button><button class="btn small water" data-water="${i}" ${S.gocce < RULES.waterCost ? "disabled" : ""}>Annaffia ${RULES.waterCost}${ICON.drop.replace("<svg", '<svg width="16" height="16"')}</button></div>`;
  const growing = !g.dead && g.growAt;
  const grow = growing ? `<span class="tag study">${stageLabel(g)}</span>` : "";
  // Layout: in alto a destra l'icona per regalare/liberare; a sinistra disegno + vaso; a destra nome, stato, frase;
  // sotto, a tutta larghezza: emergenza, regola d'acqua, azioni
  return `<div class="slot plant${em ? " alarm" : ""}">
    <button class="corner" data-gift="${i}" aria-label="${g.dead ? "Libera il posto" : `Regala ${esc(nameOf(g))}`}">${g.dead ? ICON.trash : ICON.gift}</button>
    <div class="sart">${plantSVG(g.plant, 92, st, g.dead ? "adulta" : stageOf(g), g.pot)}${!g.dead && !potBlock(g.plant) ? `<button class="potbtn" data-pot="${i}">Cambia vaso</button>` : ""}</div>
    <div class="sinfo">
      <div class="namerow"><h3>${esc(nameOf(g))}</h3>${g.dead ? "" : `<button class="nick" data-nick="${i}" aria-label="Dai un soprannome a ${esc(nameOf(g))}">${ICON.pencil}</button>`}</div>
      ${g.nick ? `<span class="species">${p.name}</span>` : ""}
      <div class="badges"><span class="state st-${st}">${st[0].toUpperCase() + st.slice(1)}</span>${grow}</div>
      ${g.dead ? "" : `<span class="age">${ageText(g)}</span>`}
      <div class="line" id="line-${i}">${line}</div>
    </div>
    <div class="sfull">${em}<div class="care">${ICON.drop}<span>${c.rule}${g.pot === "terracotta" ? " (in terracotta asciuga prima)" : g.pot === "autoirrigante" ? " (con la riserva d’acqua dura di più)" : ""}</span></div>${action}</div>
  </div>`;
}
function renderArea(a){
  const A = AREAS[a];
  if (a === "balcone" && !balconyOpen()) return `<div class="area"><h2>${A.title}</h2><div class="slot locked wide">${ICON.lock.replace("<svg", '<svg width="34" height="34"')}<b>Balcone chiuso</b><span class="line">Si apre finendo la zona Casa tua, insieme al Mediterraneo.</span></div></div>`;
  const slots = [];
  S.garden.forEach((g, i) => { if (g.area === a) slots.push(slotCard(g, i)); });
  for (let k = inArea(a); k < slotsOf(a); k++) slots.push(`<button class="slot empty" data-plant-here="${a}"><span class="plus">+</span><b>Posto libero</b><span class="line">${a === "casa" ? "Una pianta da casa che conosci bene." : "Qualsiasi pianta che conosci bene."}</span></button>`);
  const nx = nextSlotLevel(a);
  if (nx) slots.push(`<div class="slot locked">${ICON.lock.replace("<svg", '<svg width="34" height="34"')}<b>Posto bloccato</b><span class="line">Si apre al livello ${nx.n}<i class="lvsun">${ICON.sun}</i>, ${esc(nx.L.name)}.</span></div>`);
  return `<div class="area"><h2>${A.title} <span>${inArea(a)}/${slotsOf(a)}</span></h2><p class="lead">${A.lead}</p><div class="grid">${slots.join("")}</div></div>`;
}
function testTools(){
  if (!DEV) return "";
  const b = (attr, label) => `<button class="btn small ghost" ${attr}>${label}</button>`;
  return `<div class="test"><b>Strumenti per il test</b>Salta il tempo, sblocca le zone, fai cassa. Solo per te: i tester non li vedono.
    <div class="row" style="margin-top:10px">${b('data-skip="3"', "+3 giorni")}${b('data-skip="7"', "+7 giorni")}${b('data-skip="14"', "+14 giorni")}${b('id="forceEm"', "Emergenza ora")}</div>
    <div class="row" style="margin-top:8px">${ZONES.slice(1).map((z, k) => b(`data-unlock="${z.id}"`, `Apri zona ${k + 2}`)).join("")}${b('data-unlock="all"', "Finisci tutto")}</div>
    <div class="row" style="margin-top:8px">${b('id="addRes"', "+200 gocce ed esperienza")}${b('id="reset"', "Ricomincia da zero")}</div></div>`;
}
// Sblocca una zona: completa tutte le caselle delle zone prima, e rende piantabili le loro piante.
// "all" completa tutto il percorso.
function unlockZone(zid){
  const upto = zid === "all" ? ZONES.length : ZONES.findIndex(z => z.id === zid);
  const zonesDone = ZONES.slice(0, upto).map(z => z.id);
  STEPS.filter(st => zonesDone.includes(st.zone)).forEach(st => {
    S.prog[st.id] = lessonCount(st);
    if (!S.done.includes(st.id)) S.done.push(st.id);
    authored(st).flatMap(l => l.items).forEach(it => { if (it.plant) {
      S.knowledge[it.plant] = RULES.knowledgeMax;
      if (!S.discovered.includes(it.plant)) S.discovered.push(it.plant); } });
  });
}
function renderNegozio(){
  const cards = Object.entries(POT_SHOP).map(([mo, P]) => {
    const owned = S.pots.includes(mo);
    const ok = Object.keys(PLANTS).filter(id => potFits(mo, id)), known = ok.filter(id => S.discovered.includes(id));
    // Solo i nomi delle piante già incontrate (massimo 3), il resto è un numero: niente liste chilometriche
    const names = known.length ? known.slice(0, 3).map(id => PLANTS[id].name).join(", ") + (ok.length > 3 && known.length ? ` e altre ${ok.length - Math.min(3, known.length)}` : "") : `${ok.length} piante da scoprire`;
    return `<div class="shopcard${owned ? " owned" : ""}"><div class="sart">${plantSVG(P.show, 96, "sana", "adulta", mo)}</div><div class="t"><h3>${P.name}</h3><span class="tag ptag ${P.tag === "Solo bellezza" ? "study" : "planted"}">${P.tag}</span><p>${P.desc}</p>
      <p class="pnote">Per: ${names}</p>
      ${owned ? '<span class="tag planted">Tuo. Lo cambi dalla serra</span>' : `<button class="btn small water" style="width:auto" data-buypot="${mo}" ${S.gocce < P.cost ? "disabled" : ""}>Compra ${P.cost}${ICON.drop.replace("<svg", '<svg width="16" height="16"')}</button>`}</div></div>`;
  }).join("");
  const lids = S.streak.lids, full = lids >= SPRAY.max;
  const lid = `<div class="shopcard${full ? " owned" : ""}"><div class="sart">${sprayerSVG(80)}</div><div class="t"><h3>Spruzzino</h3><span class="tag ptag study">Salva il fagiolo</span><p>Se salti un giorno, tiene umido il cotone e i giorni di fila non si perdono. Si usa da solo.</p>
    <p class="pnote">Ne hai ${lids} su ${SPRAY.max}.</p>${full ? '<span class="tag planted">Scorta piena</span>' : `<button class="btn small water" style="width:auto" data-buylid="1" ${S.gocce < SPRAY.cost ? "disabled" : ""}>Compra ${SPRAY.cost}${ICON.drop.replace("<svg", '<svg width="16" height="16"')}</button>`}</div></div>`;
  return `<section class="sec"><h1>Negozio</h1><p class="lead">Spruzzini per i giorni no, vasi per sempre.</p>
    <h2 class="shoph">Giorni di fila</h2><div class="shop">${lid}</div>
    <h2 class="shoph">Vasi</h2><p class="pnote" style="margin:-4px 0 12px">Si comprano una volta e valgono per sempre. Ma non tutti stanno bene a tutte.</p><div class="shop">${cards}</div></section>`;
}
function renderSerra(){
  const empty = !S.garden.length;
  return `<section class="sec"><h1>La tua serra</h1><p class="lead">${empty ? "È vuota. Silenzio. Pace. Nessuna vittima. Studia il basilico nel primo step del percorso e rovina tutto." : "Le gocce le tengono in vita, l’esperienza fa spazio. Il resto è ansia."}</p>${renderArea("casa")}${renderArea("balcone")}</section>
    ${testTools()}`;
}
let pickArea = "casa";
function openPicker(a){
  pickArea = a;
  const list = Object.keys(PLANTS).filter(id => S.discovered.includes(id) && !inGarden(id));
  const rows = list.map(id => { const k = kOf(id), ready = k >= RULES.knowledgeMax, cost = (id === "basilico" && !S.tutorialPlanted) ? 0 : PLANTS[id].cost;
    if (!fitsIn(id, a)) return `<div class="krow">${plantSVG(id, 46)}<div class="t"><b>${PLANTS[id].name}</b><span style="font-size:13px;color:var(--ink-2)">Vuole pieno sole: in casa non ce la fa.</span></div><span class="tag study">Solo balcone</span></div>`;
    if (ready && !gateOk(id)) return `<div class="krow">${plantSVG(id, 46)}<div class="t"><b>${PLANTS[id].name}</b><span style="font-size:13px;color:var(--ink-2)">Pianta rara: prima diventa esperto della sua cugina facile.</span></div><span class="tag study">${gateText(id)}</span></div>`;
    return `<div class="krow">${plantSVG(id, 46)}<div class="t"><b>${PLANTS[id].name}</b><div class="bar ${ready ? "full" : ""}"><i style="width:${k / RULES.knowledgeMax * 100}%"></i></div></div>
    ${ready ? `<button class="btn small water" style="width:auto" data-sow="${id}" ${S.gocce < cost ? "disabled" : ""}>${cost ? `Pianta ${cost}${ICON.drop.replace("<svg", '<svg width="14" height="14"')}` : "Gratis"}</button>` : `<span class="tag study">Studiala ancora</span>`}</div>`; }).join("");
  modal(`<h2>Cosa piantiamo ${a === "casa" ? "in casa" : "sul balcone"}?</h2><p class="lead" style="color:var(--ink-2);margin:6px 0 0;font-size:15px">Puoi piantare solo le piante con la barra della conoscenza piena. Niente scorciatoie: qui si studia.</p>
    <div class="pick">${rows || `<p style="color:var(--ink-2)">Non hai ancora scoperto piante da piantare. Fai il primo step del percorso.</p>`}</div><button class="btn ghost" data-close="1">Chiudi</button>`);
}
function ask(title, text, okLabel, onOk, cancelLabel){
  const m = modal(`<h2>${title}</h2><p style="color:var(--ink-2);font-size:16px;line-height:1.45;margin:8px 0 18px">${text}</p><div style="display:flex;flex-direction:column;gap:12px"><button class="btn bad" id="askOk">${okLabel}</button><button class="btn ghost" data-close="1">${cancelLabel}</button></div>`);
  m.querySelector("#askOk").onclick = () => { m.remove(); onOk(); };
}
function modal(html){ const m = document.createElement("div"); m.className = "modal";
  // Su iPhone la tastiera copre la pagina senza rimpicciolirla: con visualViewport la finestra
  // si adatta allo spazio che resta sopra la tastiera
  const vv = window.visualViewport;
  if (vv) { const fit = () => { if (!m.isConnected) { vv.removeEventListener("resize", fit); vv.removeEventListener("scroll", fit); return; }
      m.style.top = vv.offsetTop + "px"; m.style.height = vv.height + "px"; };
    vv.addEventListener("resize", fit); vv.addEventListener("scroll", fit); requestAnimationFrame(fit); } m.innerHTML = `<div class="panel" role="dialog" aria-modal="true"><button class="grab" data-close="1" aria-label="Chiudi"></button>${html}</div>`; document.body.appendChild(m); m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) m.remove(); });
  // Trascina giù per chiudere: vale solo se il pannello è già in cima, altrimenti scorre normalmente
  const p = m.querySelector(".panel"); let y0 = null, x0 = 0, dy = 0;
  p.addEventListener("touchstart", e => { y0 = p.scrollTop <= 0 && !e.target.closest(".fcar") ? e.touches[0].clientY : null; x0 = e.touches[0].clientX; dy = 0; }, { passive: true });
  p.addEventListener("touchmove", e => { if (y0 === null) return; dy = e.touches[0].clientY - y0;
    if (!p.classList.contains("drag") && Math.abs(e.touches[0].clientX - x0) > Math.abs(dy)) { y0 = null; return; }
    if (dy > 0) { e.preventDefault(); p.classList.add("drag"); p.style.transform = `translateY(${dy}px)`; } else y0 = null; }, { passive: false });
  p.addEventListener("touchend", () => { if (!p.classList.contains("drag")) { y0 = null; return; } y0 = null; p.classList.remove("drag");
    if (dy > 90) { m.remove(); return; } p.classList.add("back"); p.style.transform = ""; setTimeout(() => p.classList.remove("back"), 220); });
  return m; }
// Finché c'è una finestra aperta, la pagina dietro non scorre
new MutationObserver(() => document.documentElement.classList.toggle("locked", !!document.querySelector(".modal"))).observe(document.body, { childList: true });

/* --- Erbario --- */
function renderErbario(){
  const rows = Object.keys(PLANTS).map(id => { const known = S.discovered.includes(id), k = kOf(id), full = k >= RULES.knowledgeMax;
    if (!known) return `<div class="krow unknown"><div class="sil">${plantSVG(id, 46)}</div><div class="t"><b>Pianta misteriosa</b><span style="font-size:13px;color:var(--ink-2)">La scopri andando avanti nel percorso.</span></div></div>`;
    const tl = titleOf(id);
    return `<button class="krow" data-card="${id}">${plantSVG(id, 46)}<div class="t"><b>${PLANTS[id].name}</b>${tl ? `<small class="xtitle">${tl}</small>` : ""}<div class="bar ${full ? "full" : ""}"><i style="width:${k / RULES.knowledgeMax * 100}%"></i></div></div>${inGarden(id) ? '<span class="tag planted">In serra</span>' : full && !gateOk(id) ? '<span class="tag study">Rara</span>' : full ? '<span class="tag ready">Pronta</span>' : `<span class="tag study">${k}/${RULES.knowledgeMax}</span>`}</button>`; }).join("");
  return `<section class="sec"><h1>Erbario</h1><p class="lead">Quello che sai delle piante incontrate. Rispondi bene e la barra cresce.</p><div class="herb">${rows}</div></section>`;
}
function openCard(id){
  const p = PLANTS[id], k = kOf(id); let m;
  const shown = Math.max(1, Math.round(k / RULES.knowledgeMax * p.facts.length));
  m = modal(`<div style="display:flex;gap:14px;align-items:center">${plantSVG(id, 90)}<div><h2>${p.name}</h2><div style="color:var(--ink-2);font-size:14px;font-style:italic">${p.sci}</div><span class="tag ${p.indoor ? "planted" : "study"}" style="display:inline-block;margin-top:6px">${p.indoor ? "Casa o balcone" : "Solo balcone"}</span></div></div>
    ${expertBox(id)}
    <div class="kind" style="margin:16px 0 8px">Curiosità</div>
    <div class="fcar" role="list" aria-label="Curiosità">${p.facts.map((f, i) => i < shown ? `<div class="fcard" role="listitem"><p>${esc(f)}</p></div>` : `<div class="fcard lock" role="listitem">${ICON.lock.replace("<svg", '<svg width="22" height="22"')}<p>Da scoprire nelle prossime lezioni.</p></div>`).join("")}</div>
    <div class="fdots" aria-hidden="true">${p.facts.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>
    <div style="display:flex;flex-direction:column;gap:12px">${k >= RULES.knowledgeMax ? `<button class="btn" id="practice">Allenati su questa pianta</button>` : ""}<button class="btn ghost" data-close="1">Chiudi</button></div>`);
  m.querySelector("#practice")?.addEventListener("click", () => { m.remove(); startPlantPractice(id); });
  // Pallini sotto il carosello: seguono la card più visibile
  const car = m.querySelector(".fcar"), dots = m.querySelectorAll(".fdots i");
  car.addEventListener("scroll", () => { const k = Math.round(car.scrollLeft / (car.firstElementChild.offsetWidth + 10)); dots.forEach((d, i) => d.classList.toggle("on", i === k)); }, { passive:true });
}
// Riquadro del titolo nella scheda: grado attuale, prossimo passo, eventuale sblocco di una rara
function expertBox(id){
  const k = kOf(id), g = expertOf(id), e = S.expert[id] || {};
  const gate = PLANTS[id].gate ? `<p class="xnote">${gateOk(id) ? "Pianta rara: sbloccata." : `Pianta rara. ${gateText(id)}.`}</p>` : "";
  if (k < RULES.knowledgeMax) return `<div class="xbox"><b>Titolo</b><p class="xnote">Prima scoprila del tutto (3/3). Poi si diventa esperti.</p>${gate}</div>`;
  const next = g >= 3 ? "Grado massimo raggiunto." : e.day === todayN() ? "Oggi hai già fatto un passo avanti: torna domani." : "Prossimo grado: rispondi giusto a una domanda media o difficile su questa pianta.";
  return `<div class="xbox"><b>${g ? titleOf(id) : "Nessun titolo, per ora"}</b><div class="dots">${[1,2,3].map(n => `<i class="${n <= g ? "on" : ""}"></i>`).join("")}</div><p class="xnote">${next}</p>${gate}</div>`;
}
// Allenamento su una sola pianta: prima le domande medie e difficili (quelle che fanno salire il titolo)
function startPlantPractice(id){
  const all = STEPS.flatMap(st => authored(st).flatMap(l => l.items)).filter(it => it.plant === id && it.t !== "card");
  const hard = shuffle(all.filter(it => (it.lv || 1) >= 2)), easy = shuffle(all.filter(it => (it.lv || 1) < 2));
  L = { i:-1, li:0, step:{ id:"pp-" + id, title: PLANTS[id].name, zone:null, items:[] }, items: hard.concat(easy).slice(0, 6), idx:0, mistakes:0,
    gained:{}, before:{}, seen:[], replay:true, title:"Allenamento", from:"erbario" };
  showItem();
}

/* =========================================================
   Eventi
   ========================================================= */
app.addEventListener("click", e => {
  const t = e.target.closest("button, [data-ztop]"); if (!t) return;
  if (t.dataset.tab) { if (tab === t.dataset.tab) { window.scrollTo({ top: 0, behavior: "smooth" }); return; } tab = t.dataset.tab; render(); window.scrollTo(0, 0); return; }
  if (t.dataset.step !== undefined) { if (t.getAttribute("aria-disabled")) { toast("Prima finisci lo step prima. Le piante non saltano le tappe (e neanche tu)."); return; } openNode(+t.dataset.step); return; }
  if (t.dataset.water !== undefined) {
    const g = S.garden[+t.dataset.water]; if (S.gocce < RULES.waterCost) return toast("Zero gocce. Fai una lezione e torna (la pianta aspetta) (non a lungo).");
    // Annaffiare con la terra ancora umida alza il livello di "zuppo"; con la terra asciutta lo azzera
    const level = !care(g).bog && daysSince(g.wateredAt) < care(g).soak ? wetLevel(g) + 1 : 0;   // le piante di palude non si "inzuppano"
    if (level >= care(g).rot) return ask("Ancora acqua?", `${esc(nameOf(g))} ha la terra ancora bagnata: con un altro sorso le radici marciscono${g.nick ? " e il soprannome se ne va con lei" : ""}. ${care(g).wetTip}`, "Annaffia lo stesso", () => water(g, level), "Aspetto");
    return water(g, level);
  }
  if (t.dataset.nick !== undefined) return openNick(S.garden[+t.dataset.nick]);
  if (t.dataset.pot !== undefined) return openPotPicker(+t.dataset.pot);
  if (t.dataset.gift !== undefined) { const g = S.garden[+t.dataset.gift];
    return ask(g.dead ? "Liberare il posto?" : `Regalare ${esc(nameOf(g))}?`, g.dead ? "Il seme va nel compost e il posto torna libero." : "Va a vivere da qualcun altro (si spera con più attenzioni). Il posto torna libero; soprannome e giorni di vita se ne vanno con lei.", g.dead ? "Libera il posto" : "Regala", () => {
      S.garden.splice(S.garden.indexOf(g), 1); render(); toast(g.dead ? "Posto libero. Si ricomincia." : "Regalata. Chi l’ha ricevuta non sa cosa l’aspetta."); }, "Tienila"); }
  if (t.dataset.buylid) { if (S.gocce < SPRAY.cost || S.streak.lids >= SPRAY.max) return;
    S.gocce -= SPRAY.cost; S.streak.lids++; render(); bump("#pGocce"); toast("Spruzzino in scorta. Ora puoi anche dimenticarti di noi per un giorno (uno)."); return; }
  if (t.dataset.buypot) { const mo = t.dataset.buypot, c = POT_SHOP[mo].cost; if (S.gocce < c || S.pots.includes(mo)) return;
    S.gocce -= c; S.pots.push(mo); render(); bump("#pGocce"); toast(`${POT_SHOP[mo].name}: tuo. Ora vai in serra a sfoggiarlo.`); return; }
  if (t.dataset.em !== undefined) return openEmergency(S.garden[+t.dataset.em]);
  if (t.dataset.unlock) { unlockZone(t.dataset.unlock); tab = "path"; render(); window.scrollTo(0, 0); toast(t.dataset.unlock === "all" ? "Percorso finito. Tutte le piante sono piantabili." : "Zone precedenti completate: si parte da qui."); return; }
  if (t.id === "addRes") { S.gocce += 200; S.xp += 200; render(); bump("#pGocce"); bump("#pXp"); return; }
  if (t.id === "forceEm") { const g = S.garden.find(x => !x.dead && !x.em); if (!g) return toast("Nessuna pianta viva senza emergenze."); rollEmergency(g, now()); if (!g.em) return toast("Prima fai lo step dove si impara a curarla."); render(); return; }
  if (t.dataset.feel !== undefined) {
    const i = +t.dataset.feel, g = S.garden[i];
    felt.set(g, Date.now() + FEEL_MS); render();
    // allo scadere, sfuma la riga e rimette la frase normale (solo se la riga è ancora a schermo)
    setTimeout(() => { const el = document.getElementById("line-" + i); if (!el || feltNow(g)) return;
      el.classList.add("fade"); setTimeout(() => { el.innerHTML = restLine(g, i); el.classList.remove("fade"); }, 300); }, FEEL_MS + 50);
    return;
  }
  if (t.dataset.replant !== undefined) { const g = S.garden[+t.dataset.replant]; S.gocce -= RULES.replantCost; g.dead = false; g.cause = null; g.note = null; g.rip = null; g.bornAt = now(); g.growAt = now(); g.mile = 0; g.diedAt = null; g.wet = 0; g.wateredAt = now(); render(); toast(`Il seme è a terra. Ci vorranno circa ${growDays(g)} giorni per tornare adulta. Seconda vita, stessa persona responsabile.`); return; }
  if (t.dataset.ztop !== undefined) return zoneTop(t);
  if (t.dataset.level) return openLevel();
  if (t.dataset.streak) return openStreak();
  if (t.dataset.buy) { return; if (a === "casa") S.slots++; else S.balcSlots++; render(); bump("#pXp"); toast("Nuovo posto in serra. Più spazio, più occasioni di fallire."); return; }
  if (t.dataset.plantHere) return openPicker(t.dataset.plantHere);
  if (t.dataset.skip) { felt = new WeakMap(); S.offset += +t.dataset.skip * DAY; render(); toast(`Sono passati ${t.dataset.skip} giorni. Le piante hanno preso appunti.`); return; }
  if (t.id === "reset") return ask("Ricominciare da zero?", "Si perde tutto: piante, gocce, esperienza. Anche la dignità.", "Ricomincia", () => { S = fresh(); tab = "path"; render(); }, "Annulla");
  if (t.dataset.card) return openCard(t.dataset.card);
});
// Goccioline che cadono sul disegno; se la pianta aveva sete, si raddrizza
function splashWater(i, perk){
  const art = document.querySelector(`[data-gift="${i}"]`)?.closest(".slot")?.querySelector(".sart");
  if (!art || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (perk) art.classList.add("perk");
  const box = document.createElement("div"); box.className = "rain"; box.setAttribute("aria-hidden", "true");
  box.innerHTML = Array.from({ length:7 }, (_, k) => `<i style="left:${18 + k * 10 + Math.random() * 6}%;animation-delay:${(k % 4) * .08 + Math.random() * .1}s">${ICON.drop}</i>`).join("");
  art.appendChild(box); setTimeout(() => box.remove(), 1200);
}
// Tocco sull'intestazione della zona: torna all'inizio di quella zona; se ci sei già, all'inizio del percorso
function zoneTop(el){
  const sec = el.closest(".zsec"), bar = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--toph")) || 62;
  const y = sec.getBoundingClientRect().top + scrollY - bar, smooth = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  scrollTo({ top: Math.abs(scrollY - y) < 8 ? 0 : Math.max(0, y), behavior: smooth });
}
document.addEventListener("keydown", e => { const z = e.target.closest?.("[data-ztop]"); if (z && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); zoneTop(z); } });
function water(g, level){
  S.gocce -= RULES.waterCost; g.wateredAt = now(); g.wet = level; felt.delete(g);
  const c = care(g), dead = level >= c.rot, n = nameOf(g);
  const wasDry = ["assetata", "appassita"].includes(plantState(g));
  if (dead) kill(g, "marcita");
  render(); bump("#pGocce");
  if (!dead) splashWater(S.garden.indexOf(g), wasDry && !level);
  toast(!level ? `${n} ha bevuto. Ti perdona. (Per ora.)`
    : dead ? `${n} ha le radici marcite. ${c.wetTip}`
    : level >= c.rot - 1 ? `${n} ha la terra fradicia: un altro sorso e le radici marciscono. ${c.wetTip}`
    : `${n} ha la terra zuppa: era ancora umida. ${c.wetTip}`);
}
function openEmergency(g){
  const e = EMERG[g.em.id], stepIdx = STEPS.findIndex(s => s.id === e.step), step = STEPS[stepIdx];
  const left = Math.max(1, EM.deadline - Math.floor((now() - g.em.at) / DAY));
  const head = `<div style="display:flex;gap:12px;align-items:center">${plantSVG(g.plant, 70)}<div><div class="kind" style="color:var(--bad);margin:0">Emergenza</div><h2>${esc(e.title)}</h2></div></div>
    <p style="color:var(--ink-2);font-size:14px;margin:8px 0 0">${esc(nameOf(g))} resiste ancora ${left} ${left === 1 ? "giorno" : "giorni"}. Poi è finita.</p>`;
  if (g.em.retryAt > now()) {
    const m = modal(`${head}<p class="lead" style="font-size:16px;line-height:1.45;margin:14px 0">Hai già provato una cura, e non era quella giusta. Riprova domani, oppure ripassa lo step “${esc(step.title)}”: la risposta è lì, e dopo puoi riprovare subito.</p>
      <div style="display:flex;flex-direction:column;gap:12px"><button class="btn" id="goStep">Ripassa “${esc(step.title)}”</button><button class="btn ghost" data-close="1">Chiudi</button></div>`);
    m.querySelector("#goStep").onclick = () => { m.remove(); startLesson(stepIdx, Math.min(e.lesson || 0, progOf(step) - 1)); };
    return;
  }
  const m = modal(`${head}<div class="q" style="font-size:20px;margin:16px 0 12px">${esc(e.q)}</div><div class="opts">${shuffle(e.o.map((o, k) => [o, k])).map(([o, k]) => `<button class="opt" data-cure="${k}">${esc(o)}</button>`).join("")}</div><div id="emOut"></div><button class="btn ghost" data-close="1" style="margin-top:14px">Ci penso dopo</button>`);
  m.querySelectorAll("[data-cure]").forEach(b => b.onclick = () => {
    const ok = +b.dataset.cure === e.a;
    m.querySelectorAll("[data-cure]").forEach(x => x.disabled = true);
    b.classList.add(ok ? "ok" : "ko");
    if (ok) { delete g.em; g.calmUntil = now() + EM.calm * DAY; S.gocce += EM.cureGocce; S.xp += EM.cureXp; }
    else g.em.retryAt = now() + DAY;
    save();
    m.querySelector("#emOut").innerHTML = ok
      ? `<div class="card" style="margin-top:14px;font-size:15px"><b style="color:var(--leaf-dark)">Salvata.</b> ${esc(e.why)} <b style="color:var(--water)">+${EM.cureGocce} gocce</b>, e un po’ di esperienza.</div>`
      : `<div class="card" style="margin-top:14px;font-size:15px;background:var(--bad-bg);border-color:var(--bad)"><b style="color:var(--bad)">Non era la cura giusta.</b> Riprova domani, oppure ripassa lo step “${esc(step.title)}” e riprova subito.</div>`;
    m.querySelector("[data-close]").textContent = "Torna alla serra";
    m.addEventListener("click", ev => { if (ev.target.closest("[data-close]") || ev.target === m) render(); });
  });
}
function openPotPicker(i){
  const g = S.garden[i], models = [null, ...Object.keys(POT_SHOP).filter(mo => S.pots.includes(mo))];
  const rows = models.map(mo => {
    const name = mo ? POT_SHOP[mo].name : "Vaso di base", using = (g.pot || null) === mo, fits = !mo || potFits(mo, g.plant);
    const right = using ? '<span class="tag planted">In uso</span>' : fits ? `<button class="btn small" style="width:auto" data-usepot="${mo || ""}">Usa</button>` : "";
    const note = !mo ? "Plastica col foro. Non sbaglia mai." : !fits && !using ? POT_SHOP[mo].why : POT_SHOP[mo].tag + ".";
    return `<div class="krow${!fits && !using ? " unknown" : ""}">${plantSVG(g.plant, 54, "sana", "adulta", mo)}<div class="t"><b>${name}</b><span class="pnote">${note}</span></div>${right}</div>`;
  }).join("");
  // Nessun vaso comprato: al posto della lista, un invito al negozio
  const none = models.length === 1;
  const body = none
    ? `<div class="potempty">${plantSVG(g.plant, 72, "sana", "adulta")}<p><b>Per ora c’è solo il vaso di base.</b> Nel negozio ce ne sono altri: alcuni sono solo belli, altri cambiano davvero come beve la pianta.</p><button class="btn sun" data-gotab="negozio">Vai al Negozio</button></div>`
    : `<div class="pick">${rows}</div>`;
  const m = modal(`<h2>Che vaso le diamo?</h2><p style="color:var(--ink-2);margin:6px 0 0;font-size:15px">${esc(nameOf(g))}. Il vaso giusto dipende dalla pianta, non dal divano.</p>${body}<button class="btn ghost" data-close="1">Chiudi</button>`);
  m.querySelectorAll("[data-usepot]").forEach(b => b.onclick = () => { g.pot = b.dataset.usepot || null; m.remove(); render(); toast(g.pot ? `${nameOf(g)} ha un vaso nuovo: ${POT_SHOP[g.pot].name.toLowerCase()}.` : `${nameOf(g)} torna nel vaso di base.`); });
  m.querySelector("[data-gotab]")?.addEventListener("click", () => { m.remove(); tab = "negozio"; render(); window.scrollTo(0, 0); });
}
function openNick(g){
  const m = modal(`<form id="nickForm"><h2>Come ${gen(g.plant, "lo", "la")} chiami?</h2><p style="color:var(--ink-2);margin:6px 0 0;font-size:15px">Un soprannome per ${gen(g.plant, "il tuo", "la tua")} ${PLANTS[g.plant].name}. Dare un nome crea un legame. E un senso di colpa: se muore, il soprannome se ne va con lei.</p>
    <label for="nickIn" class="kind" style="display:block;margin-top:16px">Soprannome</label><input id="nickIn" class="field" style="margin-top:4px" maxlength="20" autocomplete="off" value="${esc(g.nick || "")}" placeholder="${PLANTS[g.plant].name}">
    <div style="display:flex;flex-direction:column;gap:12px"><button class="btn" type="submit">Salva</button>${g.nick ? '<button class="btn ghost" type="button" id="nickOff">Togli il soprannome</button>' : ""}<button class="btn ghost" type="button" data-close="1">Annulla</button></div></form>`);
  const input = m.querySelector("#nickIn"); input.focus();
  const done = v => { g.nick = v || undefined; m.remove(); render();
    toast(v ? `Da oggi si chiama ${v}. Se muore adesso è un lutto vero.` : `Torna a chiamarsi ${PLANTS[g.plant].name}. Come un estraneo.`); };
  m.querySelector("#nickForm").onsubmit = e => { e.preventDefault(); done(input.value.trim().replace(/\s+/g, " ")); };
  m.querySelector("#nickOff")?.addEventListener("click", () => done(""));
}
document.addEventListener("click", e => {
  const t = e.target.closest("[data-sow]"); if (!t) return;
  const id = t.dataset.sow, free = id === "basilico" && !S.tutorialPlanted, cost = free ? 0 : PLANTS[id].cost;
  if (!fitsIn(id, pickArea) || !canPlant(id)) return;
  if (freeSlots(pickArea) <= 0) { toast("Nessun posto libero. La serra è piena come un monolocale in sei."); return; }
  if (S.gocce < cost) return;
  S.gocce -= cost; if (free) S.tutorialPlanted = true;
  S.garden.push({ plant:id, area:pickArea, wateredAt: now(), bornAt: now(), mile: 0, dead:false });
  document.querySelector(".modal")?.remove(); render(); bump("#pGocce");
  toast(id === "basilico" ? "Il basilico è in serra. Stavolta va diversamente. (Diciamo sempre così.)" : `${PLANTS[id].name} ${gen(id, "piantato", "piantata")}. ${gen(id, "Benvenuto", "Benvenuta")} nella tua famiglia disfunzionale.`);
});
render();
/* --- Aggiornamenti: quando l'app torna in primo piano, controlla se online c'è una versione nuova ---
   L'app installata sulla Home a volte resta "congelata" in memoria e non ricarica la pagina:
   così se ne accorge da sola e propone di aggiornare (senza interrompere una lezione a metà). */
async function checkUpdate(){
  if (!/vercel\.app$/.test(location.hostname) || document.visibilityState !== "visible") return;
  try {
    const html = await (await fetch(location.pathname + "?v=" + Date.now(), { cache: "no-store" })).text();
    const online = (html.match(/const VERSION = "([^"]+)"/) || [])[1];
    if (!online || online === VERSION || document.querySelector(".update")) return;
    const bar = document.createElement("div");
    bar.className = "update"; bar.setAttribute("role", "status");
    bar.innerHTML = `<span>C’è una versione nuova di Vasanicola.</span><button class="btn small sun">Aggiorna</button>`;
    bar.querySelector("button").onclick = () => location.reload();
    document.body.appendChild(bar);
  } catch (e) {}
}
document.addEventListener("visibilitychange", checkUpdate);
setTimeout(checkUpdate, 3000);
/* --- Splash: copre l'app mentre si prepara, poi sparisce da sola (o con un tocco) --- */
const SPLASH_LINES = ["Impara a non uccidere le piante. (Più o meno.)", "Stavolta il basilico sopravvive. (Forse.)", "Caricamento sensi di colpa in corso...", "Le piante ti stavano aspettando. Con ansia."];
(function splash(){
  const el = document.createElement("div");
  el.className = "splash"; el.setAttribute("role", "status"); el.setAttribute("aria-label", "Vasanicola si sta caricando");
  el.innerHTML = `<div class="splash-in">${mascot(160)}<h1>Vasanicola</h1><p>${SPLASH_LINES[Math.floor(Math.random() * SPLASH_LINES.length)]}</p><div class="sdots" aria-hidden="true"><i></i><i></i><i></i></div></div>`;
  document.body.appendChild(el);
  const quick = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let gone = false;
  const close = () => { if (gone) return; gone = true; el.classList.add("out"); setTimeout(() => el.remove(), quick ? 0 : 350); };
  el.addEventListener("click", close);
  setTimeout(close, quick ? 700 : 1600);
})();
