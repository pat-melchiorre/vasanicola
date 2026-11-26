/* Vasanicola: icone e disegni (piante, vasi, mascotte). Funzioni che restituiscono SVG. */
/* =========================================================
   Icone e illustrazioni
   ========================================================= */
const ICON = {
  drop:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c3.6 4.5 6.5 8 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.5 8.4 7 12 2.5z"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><g stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7"/></g></svg>',
  leaf:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3C10 3 4 8 4 15c0 2 .6 3.6 1.4 4.6C7 14 11 10 16 8c-4.4 2.6-7.6 6.5-9 12.3.9.5 2 .7 3 .7 7 0 10-7 10-18z"/></svg>',
  pot:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9h16v3H4zM5.5 13h13l-1.6 8H7.1z"/><path d="M12 9V5M12 5c0-2 2-3 4-3-.2 2-1.8 3-4 3zM12 6c0-1.6-1.6-2.6-3.4-2.6.2 1.6 1.6 2.6 3.4 2.6z"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V8a3 3 0 0 0-6 0z"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  path:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="6" r="3"/><circle cx="19" cy="22" r="3"/><path d="M9 9c0 6 10 4 10 10"/></svg>',
  serra:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><path d="M4 12L14 4l10 8v12H4z"/><path d="M14 24v-7M14 17c0-3 2.5-4.5 5-4.5-.3 3-2.3 4.5-5 4.5zM14 19c0-2.4-2-3.6-4.2-3.6.3 2.4 2 3.6 4.2 3.6z"/></svg>',
  alert:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L23 21.5H1z"/><path d="M12 9v6M12 17.6v.4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
  pencil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
  shop:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><path d="M5 10h18l-1.6 13H6.6z"/><path d="M10 10V8a4 4 0 0 1 8 0v2" stroke-linecap="round"/></svg>',
  book:'<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"><path d="M5 5h7a3 3 0 0 1 3 3v15a2.5 2.5 0 0 0-2.5-2.5H5zM23 5h-6a3 3 0 0 0-3 3v15a2.5 2.5 0 0 1 2.5-2.5H23z"/></svg>'
};
const POTS = { basilico:"#e0773a", pothos:"#5b8def", sansevieria:"#f2c230", menta:"#e8649a", olivo:"#2fae9e", rosmarino:"#d9534f", lavanda:"#f2a541", ficodindia:"#7d6bd6", monstera:"#c98b5a", calathea:"#3a6ea5", orchidea:"#bcd9ea", felce:"#8a5a44", zamioculcas:"#d1495b", spatifillo:"#5bc0be", limone:"#e07a5f", salvia:"#8d99ae", ficus:"#f4a261", geranio:"#2a9d8f", petunia:"#f6bd60", ortensia:"#f7f7f2", bouganville:"#9c6644", dionea:"#6d597a", sarracenia:"#355070", drosera:"#b56576", nepenthes:"#e9c46a", alocasia:"#264653", fittonia:"#f28482", maranta:"#84a59d", begonia:"#2b2d42", echeveria:"#e5989b", haworthia:"#6d6875", mammillaria:"#d4a373", lithops:"#bc6c25", gardenia:"#457b9d", kumquat:"#2a9d8f", cephalotus:"#7b2cbf", vanda:"#a47148" };
// Disegno del vaso: "back" va dietro alla pianta (corde del vaso appeso), "front" davanti
function potDrawing(id, model, color, wet){
  const soilC = wet ? "#33200f" : "#5a3b22";
  const soil = (rx = 30) => `<ellipse cx="60" cy="86" rx="${rx}" ry="3.5" fill="${soilC}" opacity=".9"/>${wet ? '<ellipse cx="66" cy="85.5" rx="13" ry="1.8" fill="#8fcaff" opacity=".85"/>' : ""}`;
  const body = c => `<path d="M30 92h60l-6 36H36z" fill="${c}"/><rect x="26" y="84" width="68" height="12" rx="4" fill="${c}"/><rect x="26" y="84" width="68" height="5" rx="2.5" fill="#000" opacity=".12"/>`;
  if (id === "tillandsia") return { back:"", front:`<path d="M22 98c10-7 64-9 76-2c5 3 5 11 0 13c-15 6-64 6-76 0c-5-3-5-8 0-11z" fill="#a47148"/><path d="M34 103c14 2 36 2 52-1M44 98c8-1 20-1 28 0" stroke="#7a5230" stroke-width="2" fill="none" stroke-linecap="round"/>` };
  if (id === "vanda") return { back:'<path d="M36 84L60 6M84 84L60 6" stroke="#9c7a5a" stroke-width="1.4"/>', front:`<rect x="34" y="82" width="52" height="20" rx="3" fill="none" stroke="#8b5a32" stroke-width="3"/><path d="M34 92h52M47 82v20M60 82v20M73 82v20" stroke="#8b5a32" stroke-width="2"/>` };
  if (model === "terracotta") return { back:"", front: body("#c8693a") + `<path d="M33 106h54M35 116h50" stroke="#a9532c" stroke-width="1.6"/>` + soil() };
  if (model === "autoirrigante") return { back:"", front: body("#e8eef2") + `<rect x="42" y="112" width="36" height="10" rx="3" fill="#8fcaff"/><rect x="80" y="98" width="4" height="18" rx="2" fill="#5aa9e6"/>` + soil() };
  if (model === "appeso") return { back:'<path d="M30 86L60 2M90 86L60 2" stroke="#b08968" stroke-width="1.6"/>', front:`<path d="M26 88h68c0 22-15 38-34 38S26 110 26 88z" fill="#efe6d8"/><rect x="24" y="82" width="72" height="9" rx="4" fill="#e0d2bd"/>` + soil(32) };
  if (model === "balconiera") return { back:"", front:`<rect x="12" y="86" width="96" height="40" rx="4" fill="#b07a4a"/><path d="M12 99h96M12 112h96" stroke="#8b5a32" stroke-width="2"/><rect x="10" y="82" width="100" height="8" rx="3" fill="#9c6a3e"/>` + soil(46) };
  if (model === "coprivaso") return { back:"", front: body("#f7f4ee") + `<rect x="26" y="88" width="68" height="3" fill="#3b6ea5"/>` +
    [[46,108],[60,112],[74,108]].map(([x, y]) => [0,72,144,216,288].map(r => `<ellipse cx="${x}" cy="${y - 3}" rx="1.8" ry="3" transform="rotate(${r} ${x} ${y})" fill="#3b6ea5"/>`).join("") + `<circle cx="${x}" cy="${y}" r="1.4" fill="#f2c230"/>`).join("") + soil() };
  return { back:"", front: body(color) + soil() };
}
function plantSVG(id, size = 120, state = "sana", stage = "adulta", model = null){
  const pot = POTS[id] || "#e0773a";
  const wet = ["zuppa","fradicia","marcita"].includes(state);
  const pd = potDrawing(id, model, pot, wet), potSvg = pd.front;
  if (state === "secca") return `<svg width="${size}" height="${size * 1.1}" viewBox="0 0 120 132" aria-hidden="true">${potSvg}<ellipse cx="60" cy="80" rx="7" ry="5" fill="#8a5a2b"/><path d="M60 76c0-6 4-9 8-9-1 5-4 8-8 9z" fill="#9db86a" opacity=".85"/></svg>`;
  if (state === "marcita") return `<svg width="${size}" height="${size * 1.1}" viewBox="0 0 120 132" aria-hidden="true">${potSvg}<path d="M60 84c-1-6-6-9-14-9" stroke="#5e5130" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="80" rx="11" ry="4" transform="rotate(-12 44 80)" fill="#6f6a35"/><ellipse cx="74" cy="81" rx="10" ry="3.5" transform="rotate(10 74 81)" fill="#5f5a2e"/><ellipse cx="60" cy="80" rx="6" ry="4" fill="#8a5a2b"/></svg>`;
  // Seme e germoglio sono uguali per tutte le piante; la piantina è la pianta adulta in piccolo
  const wrap = inner => `<svg width="${size}" height="${size * 1.1}" viewBox="0 0 120 132" aria-hidden="true" class="p-${state}"><g class="leaves">${inner}</g>${potSvg}</svg>`;
  if (stage === "seme") return wrap(`<ellipse cx="60" cy="83" rx="5" ry="3.6" fill="#8a5a2b"/><path d="M58 81l2 2 2-3" stroke="#c99a5b" stroke-width="1.4" fill="none" stroke-linecap="round"/>`);
  if (stage === "germoglio") return wrap(`<path d="M60 86V68" stroke="#3f8f4e" stroke-width="3" stroke-linecap="round"/><ellipse cx="53" cy="66" rx="7" ry="4" transform="rotate(-25 53 66)" fill="#5cc875"/><ellipse cx="67" cy="66" rx="7" ry="4" transform="rotate(25 67 66)" fill="#4fb867"/>`);
  let leaves = "", over = "";
  if (id === "basilico") {
    const pairs = [[60,40,0],[47,52,-28],[73,52,28],[44,66,-35],[76,66,35],[60,26,0]];
    leaves = `<path d="M60 86V30M60 70l-14-10M60 70l14-10M60 56l-12-8M60 56l12-8" stroke="#2c7d3f" stroke-width="3" stroke-linecap="round" fill="none"/>` +
      pairs.map(([x,y,r]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="15" transform="rotate(${r} ${x} ${y})" fill="#43b05c"/><path d="M${x} ${y - 11}v22" stroke="#2c8a45" stroke-width="1.4" transform="rotate(${r} ${x} ${y})"/>`).join("");
  } else if (id === "pothos") {
    const heart = (x, y, r, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 12C-14 2-12-12 0-6 12-12 14 2 0 12z" fill="#2f8f4e"/><path d="M-6-4c3 1 4 6 3 10M3-6c2 3 1 7-1 11" stroke="#e8e27a" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
    leaves = `<path d="M50 86c-8 10-18 22-22 38M70 86c8 8 16 20 18 36M60 86c0-14 2-30 0-44" stroke="#2c7d3f" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      [heart(60,40,0,1.1),heart(46,56,-30),heart(74,56,30),heart(36,104,-50,.9),heart(30,122,-20,.8),heart(84,100,40,.9),heart(88,118,15,.8)].join("");
  } else if (id === "sansevieria") {
    const blade = (x, h, r, w = 11) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x - w / 2} 86C${x - w / 2 - 2} ${86 - h * .6} ${x - 2} ${86 - h} ${x} ${86 - h}C${x + 2} ${86 - h} ${x + w / 2 + 2} ${86 - h * .6} ${x + w / 2} 86z" fill="#2e6b3a" stroke="#e1c84a" stroke-width="2.4"/><path d="M${x - 2} 80l4-6M${x - 2} 66l4-6M${x - 2} 52l4-6" stroke="#4f9a5c" stroke-width="2"/></g>`;
    leaves = blade(60,70,0,13) + blade(46,56,-12) + blade(74,60,12) + blade(38,42,-22,10) + blade(82,46,22,10);
  } else if (id === "menta") {
    const leaf = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0-12l3 3 2-1 1 4 2 1-1 4 2 2-3 3 0 3-3 1-3-1 0-3-3-3 2-2-1-4 2-1 1-4 2 1z" fill="#6fc77f"/><path d="M0-9v18" stroke="#3f9a52" stroke-width="1.4"/></g>`;
    leaves = `<path d="M48 86V40M60 86V28M72 86V44" stroke="#3f8f4e" stroke-width="3.2" stroke-linecap="round"/>` +
      [[48,44,-30],[48,60,30],[60,32,0],[60,48,-35],[60,64,35],[72,48,30],[72,64,-30],[40,70,-50],[80,72,50]].map(a => leaf(...a)).join("");
  } else if (id === "olivo") {
    // tronco nodoso + chioma di foglie strette, verdi sopra e argentate sotto, qualche oliva
    const lf = (x, y, r, c) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="7.5" transform="rotate(${r} ${x} ${y})" fill="${c}"/>`;
    const crown = [[44,30],[56,22],[70,26],[80,36],[38,44],[52,40],[66,40],[76,50],[46,54],[62,54],[34,58],[86,58]];
    leaves = `<path d="M60 86c-2-10 4-16 0-26-3-7 2-12 6-18M60 62c-6-6-12-8-18-14M62 56c6-4 12-6 16-12" stroke="#7a5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>` +
      crown.map(([x,y], k) => lf(x, y, (k * 47) % 140 - 70, k % 3 ? "#7d9a6a" : "#b9c8b1") + lf(x + 6, y + 4, (k * 31) % 120 - 60, "#6d8a5c")).join("") +
      `<circle cx="50" cy="48" r="3" fill="#3b2a4a"/><circle cx="70" cy="46" r="3" fill="#3b2a4a"/><circle cx="62" cy="34" r="2.6" fill="#55703a"/>`;
  } else if (id === "rosmarino") {
    // rametti dritti fitti di aghi, qualche fiorellino azzurro
    const stem = (x, h, r) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x} 86V${86 - h}" stroke="#5b6b45" stroke-width="2.4"/>` +
      Array.from({ length: Math.floor(h / 5) }, (_, k) => { const y = 84 - k * 5; return `<path d="M${x} ${y}l-6-4M${x} ${y - 2}l6-4" stroke="#3f7a52" stroke-width="2.2" stroke-linecap="round"/>`; }).join("") + `</g>`;
    leaves = stem(60,62,0) + stem(50,52,-10) + stem(70,54,10) + stem(42,40,-22) + stem(78,42,22) +
      `<circle cx="47" cy="40" r="2.4" fill="#8fb0ff"/><circle cx="72" cy="38" r="2.4" fill="#8fb0ff"/><circle cx="60" cy="27" r="2.4" fill="#8fb0ff"/>`;
  } else if (id === "lavanda") {
    // ciuffo grigio-verde e spighe viola
    const spike = (x, h, r) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x} 86V${86 - h}" stroke="#8aa184" stroke-width="2"/>` +
      [0,1,2,3,4].map(k => `<ellipse cx="${x}" cy="${86 - h + k * 4}" rx="3.2" ry="3" fill="${k % 2 ? "#8b6fd6" : "#7458c4"}"/>`).join("") + `</g>`;
    const blade = (x, r) => `<path d="M${x} 86q${r / 4} -14 ${r} -22" stroke="#a3b89c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    leaves = [-30,-20,-10,0,10,20,30].map((r, k) => blade(60 + r / 3, r)).join("") +
      spike(60,66,0) + spike(52,58,-12) + spike(68,58,12) + spike(46,50,-24) + spike(74,50,24);
  } else if (id === "ficodindia") {
    // pale ovali una sull’altra, puntini di spine, frutti in cima
    const pad = (x, y, rx, ry, r) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#5aa35a"/><ellipse cx="${x - rx / 3}" cy="${y - ry / 3}" rx="${rx / 3}" ry="${ry / 2.4}" fill="#6fb86b"/>` +
      [[-.4,-.4],[.3,-.5],[-.5,.1],[.4,0],[0,.45],[-.1,-.05]].map(([a,b]) => `<circle cx="${x + a * rx}" cy="${y + b * ry}" r="1.3" fill="#e9e2a6"/>`).join("") + `</g>`;
    leaves = pad(60,66,15,20,0) + pad(44,44,11,15,-25) + pad(76,42,11,15,25) + pad(60,32,9,12,0) +
      `<ellipse cx="40" cy="28" rx="4" ry="5" fill="#e8553f"/><ellipse cx="80" cy="26" rx="4" ry="5" fill="#f2a541"/><ellipse cx="60" cy="18" rx="3.6" ry="4.6" fill="#e8553f"/>`;
  } else if (id === "monstera") {
    // foglie grandi a cuore con i buchi (fill-rule evenodd: i cerchi interni diventano fori)
    const hole = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    const leaf = (x, y, r, s) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path fill-rule="evenodd" fill="#2f7d4a" d="M0-24C18-26 28-8 22 8C16 22 4 26 0 18C-4 26-16 22-22 8C-28-8-18-26 0-24Z${hole(-12,-4,3.2)}${hole(12,-4,3.2)}${hole(-11,9,2.6)}${hole(11,9,2.6)}${hole(-6,-14,2.2)}${hole(6,-14,2.2)}"/><path d="M0-22V16" stroke="#4f9b66" stroke-width="1.6"/></g>`;
    leaves = `<path d="M58 86C56 70 44 60 38 50M62 86C64 68 76 58 82 48M60 86V34" stroke="#3f7d4f" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      leaf(36, 46, -30, .85) + leaf(84, 44, 30, .85) + leaf(60, 30, 0, 1);
  } else if (id === "calathea") {
    // foglie ovali dritte con disegno chiaro a spina di pesce
    const leaf = (x, h, r) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x} 86V${86 - h + 26}" stroke="#7a4b6a" stroke-width="2.4"/><ellipse cx="${x}" cy="${86 - h + 14}" rx="10" ry="16" fill="#2f6f4e"/>` +
      [-8,-3,2,7].map(k => `<path d="M${x} ${86 - h + 14 + k}l-7 -4M${x} ${86 - h + 14 + k}l7 -4" stroke="#a6d79a" stroke-width="2.2" stroke-linecap="round"/>`).join("") +
      `<path d="M${x} ${86 - h}V${86 - h + 30}" stroke="#a6d79a" stroke-width="1.4"/></g>`;
    leaves = leaf(60, 66, 0) + leaf(46, 56, -20) + leaf(74, 56, 20) + leaf(38, 42, -38) + leaf(82, 42, 38);
  } else if (id === "orchidea") {
    // foglie larghe alla base, stelo arcuato con fiori a farfalla
    const flower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-6" cy="-2" rx="6" ry="5" fill="#f3a6c9"/><ellipse cx="6" cy="-2" rx="6" ry="5" fill="#f3a6c9"/><ellipse cx="0" cy="-7" rx="4" ry="5" fill="#f7c3dc"/><ellipse cx="-4" cy="5" rx="4" ry="4" fill="#f7c3dc"/><ellipse cx="4" cy="5" rx="4" ry="4" fill="#f7c3dc"/><circle cx="0" cy="1" r="2.4" fill="#c2457d"/></g>`;
    leaves = `<ellipse cx="46" cy="82" rx="16" ry="6" transform="rotate(-14 46 82)" fill="#2f7d4a"/><ellipse cx="74" cy="82" rx="16" ry="6" transform="rotate(14 74 82)" fill="#3a8a55"/>` +
      `<path d="M60 82C60 56 66 36 84 26" stroke="#5b7a3a" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
      flower(66, 44, .95) + flower(76, 32, .9) + flower(88, 24, .8) + `<circle cx="92" cy="22" r="2.4" fill="#f3a6c9"/>`;
  } else if (id === "felce") {
    // fronde arcuate piene di fogliette, calcolate lungo una curva
    const frond = (ex, ey, cx, cy) => { let d = `M60 86Q${cx} ${cy} ${ex} ${ey}`, l = "";
      for (let k = 2; k < 12; k++) { const t = k / 12, x = (1 - t) ** 2 * 60 + 2 * (1 - t) * t * cx + t * t * ex, y = (1 - t) ** 2 * 86 + 2 * (1 - t) * t * cy + t * t * ey, w = 7 * (1 - t) + 2;
        l += `<ellipse class="no" cx="${x.toFixed(1)}" cy="${(y - w / 2).toFixed(1)}" rx="1.8" ry="${w.toFixed(1)}" fill="#4caf5c"/><ellipse class="no" cx="${x.toFixed(1)}" cy="${(y + w / 2).toFixed(1)}" rx="1.8" ry="${w.toFixed(1)}" fill="#3e9a4f"/>`; }
      return `<path d="${d}" stroke="#3b7d43" stroke-width="2" fill="none"/>${l}`; };
    leaves = frond(14, 96, 30, 40) + frond(106, 96, 90, 40) + frond(26, 70, 40, 30) + frond(94, 70, 80, 30) + frond(60, 22, 56, 50);
  } else if (id === "zamioculcas") {
    // steli dritti con foglioline lucide a coppie
    const stem = (x, h, r) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x} 86V${86 - h}" stroke="#3d6b35" stroke-width="2.6" stroke-linecap="round"/>` +
      Array.from({ length: Math.floor(h / 10) }, (_, k) => { const y = 82 - k * 10; return `<ellipse cx="${x - 5}" cy="${y}" rx="3.4" ry="6.5" transform="rotate(-40 ${x - 5} ${y})" fill="#2b8048"/><ellipse cx="${x + 5}" cy="${y}" rx="3.4" ry="6.5" transform="rotate(40 ${x + 5} ${y})" fill="#2b8048"/>`; }).join("") +
      `<ellipse cx="${x}" cy="${83 - h}" rx="3.2" ry="6" fill="#33925a"/></g>`;
    leaves = stem(60, 60, 0) + stem(48, 48, -14) + stem(72, 50, 14) + stem(40, 36, -28) + stem(80, 38, 28);
  } else if (id === "spatifillo") {
    // foglie lunghe e lucide, una vela bianca con la spiga
    const leaf = (x, y, r, l) => `<ellipse cx="${x}" cy="${y}" rx="6.5" ry="${l}" transform="rotate(${r} ${x} ${y})" fill="#2c6e49"/>`;
    leaves = `<path d="M60 86C58 70 46 62 40 56M60 86C62 70 74 62 80 56M60 86V40M60 86C56 66 52 52 50 42M60 86C64 68 70 54 72 46" stroke="#3e7a52" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
      leaf(38, 52, -38, 15) + leaf(82, 52, 38, 15) + leaf(49, 40, -14, 16) + leaf(73, 44, 18, 15) +
      `<path d="M60 42c10-8 10-26 0-34c-10 8-10 26 0 34z" fill="#fbfbf5"/><ellipse cx="60" cy="30" rx="2.2" ry="7" fill="#f0dc82"/>`;
  } else if (id === "limone") {
    // alberello: tronco, chioma di foglie, limoni gialli e un fiore
    const lf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="8.5" transform="rotate(${r} ${x} ${y})" fill="#2f8a4a"/>`;
    leaves = `<path d="M60 86V56M60 66l-10-8M60 62l10-8" stroke="#7a5a3a" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      [[44,46,-40],[52,36,-20],[60,30,0],[68,36,20],[76,46,40],[40,58,-70],[80,58,70],[52,50,-10],[68,50,10],[60,44,0]].map(a => lf(...a)).join("") +
      `<ellipse cx="46" cy="54" rx="5" ry="6.5" fill="#f7d63c"/><ellipse cx="73" cy="48" rx="5" ry="6.5" fill="#f7d63c"/><ellipse cx="59" cy="26" rx="4" ry="5" fill="#f7d63c"/><circle cx="80" cy="36" r="2.6" fill="#ffffff"/>`;
  } else if (id === "salvia") {
    // cespuglio basso di foglie grigio-verdi vellutate e una spiga viola
    const lf = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="5.5" ry="9.5" fill="#9fb59c"/><path d="M${x} ${y - 8}v16" stroke="#c9d7c5" stroke-width="1.2"/></g>`;
    leaves = `<path d="M60 86V54M60 86C56 74 48 66 44 60M60 86C64 74 72 66 76 60" stroke="#7e8f6e" stroke-width="2.4" fill="none" stroke-linecap="round"/>` +
      [[44,60,-35],[52,54,-15],[68,54,15],[76,60,35],[46,72,-55],[74,72,55],[56,66,-8],[64,66,8]].map(a => lf(...a)).join("") +
      `<path d="M60 56V24" stroke="#7e8f6e" stroke-width="2"/>` + [0,1,2,3,4].map(k => `<ellipse cx="${k % 2 ? 62 : 58}" cy="${48 - k * 5}" rx="3" ry="2.6" fill="#7b6cc9"/>`).join("");
  } else if (id === "tillandsia") {
    // rosetta di foglie argentate arricciate, con una spiga rosa
    leaves = [[-34,-6,-44,-22],[-26,-18,-30,-38],[-12,-26,-10,-46],[12,-26,10,-46],[26,-18,30,-38],[34,-6,44,-22],[-20,-4,-36,-6],[20,-4,36,-6]]
      .map(([cx, cy, ex, ey]) => `<path d="M60 94Q${60 + cx} ${94 + cy} ${60 + ex} ${94 + ey}" stroke="#b9cdbf" stroke-width="4.6" fill="none" stroke-linecap="round"/>`).join("") +
      `<ellipse cx="60" cy="62" rx="4.5" ry="11" fill="#e35d8c"/><path d="M58 52l-3-6M62 52l3-6M60 51v-7" stroke="#7b4bd1" stroke-width="2" stroke-linecap="round"/>`;
  } else if (id === "ficus") {
    // fusto dritto con grandi foglie ovali lucide e la punta rossa
    const lf = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="8.5" ry="15" fill="#1f5f3a"/><ellipse class="no" cx="${x - 2.5}" cy="${y - 3}" rx="2.2" ry="8" fill="#3f8a5c"/><path d="M${x} ${y - 13}v26" stroke="#4d8a64" stroke-width="1.2"/></g>`;
    leaves = `<path d="M60 88V22" stroke="#5a4630" stroke-width="3.5" stroke-linecap="round"/>` + lf(46, 72, -55) + lf(74, 62, 55) + lf(46, 50, -40) + lf(74, 40, 40) + lf(50, 30, -20) +
      `<ellipse cx="61" cy="18" rx="2.6" ry="7" fill="#c0392b"/>`;
  } else if (id === "geranio") {
    // foglie tonde con l’anello scuro e due ciuffi di fiori rossi
    const lf = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="#4f9a4a"/><circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#38702f" stroke-width="2"/>`;
    const cluster = (x, y) => [[0,0],[5,-3],[-5,-3],[3,4],[-3,4],[0,-6]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="4" fill="#e63946"/>`).join("") + `<circle class="no" cx="${x}" cy="${y}" r="1.4" fill="#ffd166"/>`;
    leaves = `<path d="M52 72V40M67 72V34" stroke="#4a7a3a" stroke-width="2.2" stroke-linecap="round"/>` +
      [[44,74],[56,70],[68,72],[78,76],[50,80],[66,80]].map(a => lf(...a)).join("") + cluster(52, 38) + cluster(67, 32);
  } else if (id === "petunia") {
    // tante foglioline, i fiori a trombetta si disegnano sopra il vaso (cadono di lato)
    leaves = [[40,80],[50,76],[60,73],[70,76],[80,80],[46,70],[74,70]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="#5c9e4c"/>`).join("") +
      [[46,64,"#9b5de5"],[60,60,"#f15bb5"],[74,64,"#9b5de5"],[53,72,"#f15bb5"],[67,72,"#9b5de5"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${c}"/><circle class="no" cx="${x}" cy="${y}" r="2.6" fill="#4a1d5e"/>`).join("");
    over = [[28,92,"#f15bb5"],[92,92,"#9b5de5"],[24,106,"#9b5de5"],[96,106,"#f15bb5"]].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y - 8}" rx="3.5" ry="4" fill="#5c9e4c"/><circle cx="${x}" cy="${y}" r="7" fill="${c}"/><circle class="no" cx="${x}" cy="${y}" r="2.4" fill="#4a1d5e"/>`).join("");
  } else if (id === "ortensia") {
    // foglie larghe e tre teste di fiori: due blu e una rosa (cambia colore con la terra)
    const head = (x, y, r, c, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>` +
      Array.from({ length: 9 }, (_, k) => { const a = k * 2.4, d = r * .55 * ((k % 3) / 2 + .3); return `<circle class="no" cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d).toFixed(1)}" r="2.6" fill="${f}"/>`; }).join("");
    leaves = [[40,72,-50],[80,72,50],[50,80,-70],[70,80,70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="12.5" transform="rotate(${r} ${x} ${y})" fill="#3f7f4a"/>`).join("") +
      head(45, 54, 15, "#5aa9e6", "#a9d2f5") + head(74, 50, 16, "#5aa9e6", "#a9d2f5") + head(60, 34, 13, "#f28bb5", "#fbc6dc");
  } else if (id === "bouganville") {
    // rami legnosi coperti di brattee fucsia a gruppi di tre
    const bract = (x, y) => [0, 120, 240].map(r => `<ellipse cx="${x}" cy="${y - 5}" rx="4.6" ry="6.5" transform="rotate(${r} ${x} ${y})" fill="#d63384"/>`).join("") + `<circle class="no" cx="${x}" cy="${y}" r="1.6" fill="#fffbe6"/>`;
    leaves = `<path d="M60 86C58 66 44 54 34 40M60 86C62 66 74 52 86 38M60 86V30" stroke="#6b4f3a" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      [[42,62],[78,60],[54,48],[68,44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="5.5" fill="#4e8a3c"/>`).join("") +
      [[34,42],[45,54],[86,40],[76,52],[60,30],[52,66],[68,64],[60,46]].map(a => bract(...a)).join("");
  } else if (id === "dionea") {
    // rosetta di trappole a bocca: due lobi verdi, rossi dentro, con le ciglia sui bordi
    const trap = (x, y, r) => `<path d="M60 84Q${(60 + x) / 2} ${y + 14} ${x} ${y + 4}" stroke="#6aa84f" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(${x} ${y}) rotate(${r})">` +
      `<ellipse cx="0" cy="-4" rx="9" ry="4.8" fill="#79b85a"/><ellipse cx="0" cy="-3.4" rx="6.2" ry="2.8" fill="#d64545"/><ellipse cx="0" cy="4" rx="9" ry="4.8" fill="#79b85a"/><ellipse cx="0" cy="3.4" rx="6.2" ry="2.8" fill="#d64545"/>` +
      [-6,-3,0,3,6].map(k => `<path d="M${k} -8.6v-3.4M${k} 8.6v3.4" stroke="#79b85a" stroke-width="1.3" stroke-linecap="round"/>`).join("") + `</g>`;
    leaves = trap(36, 66, -35) + trap(84, 66, 35) + trap(46, 46, -15) + trap(74, 44, 15) + trap(60, 30, 0);
  } else if (id === "sarracenia") {
    // trombe dritte con il cappuccio, venate di rosso
    const tube = (x, h, r) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x - 2} 86L${x - 7} ${86 - h}Q${x} ${82 - h} ${x + 7} ${86 - h}L${x + 2} 86z" fill="#c2d04f"/>` +
      `<ellipse cx="${x + 3}" cy="${80 - h}" rx="8.5" ry="4.5" transform="rotate(-20 ${x + 3} ${80 - h})" fill="#a3b83c"/><path d="M${x - 4} ${92 - h}l2 12M${x} ${90 - h}l0.5 16M${x + 3} ${92 - h}l-1 12" stroke="#c0392b" stroke-width="1.3"/></g>`;
    leaves = tube(60, 60, 0) + tube(47, 48, -10) + tube(73, 52, 10) + tube(38, 34, -20) + tube(82, 36, 20);
  } else if (id === "drosera") {
    // foglie lunghe coperte di tentacoli con la goccia di colla
    const leaf = (x, h, r) => `<g transform="rotate(${r} ${x} 86)"><path d="M${x} 86V${86 - h}" stroke="#8fc25a" stroke-width="5" stroke-linecap="round"/>` +
      Array.from({ length: Math.floor(h / 6) }, (_, k) => { const y = 82 - k * 6 - (86 - h > 0 ? 0 : 0); return y < 86 - h + 6 ? "" : `<circle cx="${x - 4}" cy="${y}" r="1.6" fill="#d64545"/><circle cx="${x + 4}" cy="${y - 3}" r="1.6" fill="#d64545"/><circle cx="${x - 4.4}" cy="${y - .5}" r=".6" fill="#ffffff"/><circle cx="${x + 3.6}" cy="${y - 3.5}" r=".6" fill="#ffffff"/>`; }).join("") + `</g>`;
    leaves = leaf(60, 58, 0) + leaf(52, 50, -14) + leaf(68, 52, 14) + leaf(44, 40, -30) + leaf(76, 42, 30) + leaf(36, 28, -48) + leaf(84, 30, 48);
  } else if (id === "nepenthes") {
    // foglie lunghe e anfore appese ai viticci: le anfore si disegnano sopra il vaso (pendono di lato)
    const lf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="15" transform="rotate(${r} ${x} ${y})" fill="#4f9a4a"/>`;
    const pitcher = (x, y) => `<path d="M${x - 5} ${y - 8}c-3 8-3 16 5 18 8-2 8-10 5-18z" fill="#a7c957"/><ellipse cx="${x}" cy="${y - 8}" rx="5.5" ry="2" fill="#c0392b"/><ellipse cx="${x + 2}" cy="${y - 12}" rx="5" ry="2.4" fill="#8aa83a"/><circle cx="${x - 2}" cy="${y + 2}" r="1.2" fill="#c0392b"/><circle cx="${x + 2}" cy="${y + 5}" r="1.2" fill="#c0392b"/>`;
    leaves = `<path d="M60 86V44" stroke="#3f7d3a" stroke-width="3" stroke-linecap="round"/>` + lf(46, 60, -50) + lf(74, 58, 50) + lf(52, 44, -20) + lf(68, 42, 20) +
      `<path d="M34 68c-6 6-8 14-6 22M86 66c6 6 8 14 6 22" stroke="#6aa84f" stroke-width="1.6" fill="none"/>`;
    over = pitcher(28, 100) + pitcher(92, 98);
  } else if (id === "alocasia") {
    // foglie a freccia scure con venature chiarissime, su piccioli lunghi
    const lf = (x, y, r, s) => `<path d="M60 86Q${(60 + x) / 2} ${y + 20} ${x} ${y + 10}" stroke="#3f6b4f" stroke-width="2.6" fill="none"/><g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0-24C10-14 16 0 14 10L4 4 0 14-4 4-14 10C-16 0-10-14 0-24z" fill="#1f4d3a"/><path d="M0-22V12M0-8l9 6M0-8l-9 6M0 2l10 5M0 2l-10 5" stroke="#dfeee4" stroke-width="1.3" fill="none"/></g>`;
    leaves = lf(38, 50, -30, .9) + lf(82, 48, 30, .9) + lf(60, 32, 0, 1.05);
  } else if (id === "fittonia") {
    // cuscino basso di foglioline con la rete di venature chiare
    const lf = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#3a7d44"/><path d="M${x - 6} ${y}h12M${x - 2} ${y - 4}v8M${x + 2} ${y - 4}v8" stroke="#f1f7ee" stroke-width="1"/></g>`;
    leaves = [[40,80,-20],[52,76,10],[64,77,-10],[76,80,20],[46,70,30],[58,67,-5],[70,70,15],[52,60,-25],[64,60,20],[58,54,0]].map(a => lf(...a)).join("");
  } else if (id === "maranta") {
    // foglie ovali con macchie scure a spina di pesce e venature rosse
    const lf = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="6.5" ry="12" fill="#7fae5e"/>` + [-6,0,6].map(k => `<ellipse cx="${x - 3}" cy="${y + k}" rx="1.8" ry="2.4" fill="#2f3e1f"/><ellipse cx="${x + 3}" cy="${y + k}" rx="1.8" ry="2.4" fill="#2f3e1f"/>`).join("") +
      `<path d="M${x} ${y - 11}v22M${x} ${y - 4}l-5 -3M${x} ${y - 4}l5 -3M${x} ${y + 3}l-5 -3M${x} ${y + 3}l5 -3" stroke="#c1121f" stroke-width="1"/></g>`;
    leaves = `<path d="M60 86C56 74 46 66 40 62M60 86C64 74 74 66 80 62M60 86V50" stroke="#6b8f4e" stroke-width="2" fill="none"/>` + lf(38, 58, -55) + lf(82, 58, 55) + lf(48, 46, -25) + lf(72, 46, 25) + lf(60, 38, 0);
  } else if (id === "begonia") {
    // foglie ad ala d'angelo con i pois argentati e il bordo rosso, fusti a canna
    const lf = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x + 1}" cy="${y + 1.5}" rx="6" ry="14" fill="#a4161a"/><ellipse cx="${x}" cy="${y}" rx="6" ry="14" fill="#2f4f3a"/>` + [[-2,-8],[2,-3],[-2,2],[2,7],[0,-12]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="1.3" fill="#e9ecef"/>`).join("") + `</g>`;
    leaves = `<path d="M54 86V40M66 86V48" stroke="#6b4f3a" stroke-width="3"/><path d="M52 66h4M52 52h4M64 70h4M64 58h4" stroke="#4a3527" stroke-width="2"/>` + lf(42, 56, -60) + lf(42, 40, -45) + lf(78, 62, 60) + lf(78, 48, 45) + lf(58, 30, -10);
  } else if (id === "echeveria") {
    // rosetta di foglie carnose azzurrine con la punta rosa
    const ring = (n, r, rx, ry, c) => Array.from({ length: n }, (_, k) => { const a = k * 360 / n + (n % 2 ? 0 : 15); return `<g transform="rotate(${a} 60 76)"><ellipse cx="60" cy="${76 - r}" rx="${rx}" ry="${ry}" fill="${c}"/><circle cx="60" cy="${76 - r - ry + 2}" r="1.6" fill="#e5989b"/></g>`; }).join("");
    leaves = ring(9, 13, 6, 9, "#9cc5b8") + ring(7, 7, 5, 7, "#b5d6cb") + `<ellipse cx="60" cy="76" rx="4" ry="4" fill="#cfe6dd"/>`;
  } else if (id === "haworthia") {
    // rosetta di foglie a punta, scure, con strisce bianche in rilievo
    const lf = (r, h) => `<g transform="rotate(${r} 60 86)"><path d="M53 86Q54 ${86 - h * .6} 60 ${86 - h}Q66 ${86 - h * .6} 67 86z" fill="#2d6a4f"/>` + Array.from({ length: Math.floor(h / 6) - 1 }, (_, k) => `<path d="M56 ${81 - k * 6}h8" stroke="#f1f7ee" stroke-width="1.8" stroke-linecap="round"/>`).join("") + `</g>`;
    leaves = [-62,62,-44,44,-24,24,-8,8].map(r => lf(r, 46 - Math.abs(r) / 3)).join("") + lf(0, 50);
  } else if (id === "mammillaria") {
    // cactus a palla con le spine bianche e la corona di fiori rosa
    leaves = `<circle cx="60" cy="68" r="19" fill="#5c8a4a"/><ellipse cx="54" cy="62" rx="6" ry="9" fill="#6f9e5b"/>` +
      Array.from({ length: 22 }, (_, k) => { const a = k * 2.4, d = 4 + (k % 4) * 4; return `<circle cx="${(60 + Math.cos(a) * d).toFixed(1)}" cy="${(68 + Math.sin(a) * d).toFixed(1)}" r="1.1" fill="#f8f9fa"/>`; }).join("") +
      Array.from({ length: 8 }, (_, k) => { const a = Math.PI + k * Math.PI / 7; return `<circle cx="${(60 + Math.cos(a) * 15).toFixed(1)}" cy="${(64 + Math.sin(a) * 12).toFixed(1)}" r="3" fill="#ff70a6"/>`; }).join("");
  } else if (id === "lithops") {
    // due coppie di "sassi": due mezze cupole unite, con una fessura in mezzo
    const pair = (x, y, c) => `<path d="M${x - 11} ${y + 8}c0-12 5-16 10-16v16z" fill="${c}"/><path d="M${x + 11} ${y + 8}c0-12-5-16-10-16v16z" fill="${c}"/><path d="M${x - 8} ${y - 3}c2-2 4-3 6-3M${x + 3} ${y - 4}c2 0 4 1 6 3" stroke="#7a6a4f" stroke-width="1.6" fill="none"/>`;
    leaves = pair(48, 78, "#c2ab84") + pair(73, 77, "#b39c7a") + `<circle cx="34" cy="85" r="2" fill="#9a8f80"/><circle cx="88" cy="85" r="2.4" fill="#a89c8c"/>`;
  } else if (id === "gardenia") {
    // cespuglio di foglie lucide scure e fiori bianchi a rosa
    const lf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="9" transform="rotate(${r} ${x} ${y})" fill="#1b4332"/>`;
    const fl = (x, y) => [0,72,144,216,288].map(r => `<ellipse cx="${x}" cy="${y - 5}" rx="5" ry="6.5" transform="rotate(${r} ${x} ${y})" fill="#fffdf7" stroke="#d9d2bf" stroke-width=".8"/>`).join("") + `<circle cx="${x}" cy="${y}" r="3.4" fill="#ffe9a8"/>`;
    leaves = `<path d="M60 86V54M60 70l-12-10M60 66l12-10" stroke="#5a4630" stroke-width="2.6"/>` +
      [[44,62,-40],[52,52,-15],[68,52,15],[76,62,40],[40,74,-70],[80,74,70],[56,66,-5],[64,64,10],[60,44,0]].map(a => lf(...a)).join("") + fl(48, 50) + fl(72, 46) + fl(60, 34);
  } else if (id === "kumquat") {
    // alberello come il limone, con tanti piccoli frutti arancioni ovali
    const lf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="7.5" transform="rotate(${r} ${x} ${y})" fill="#2f8a4a"/>`;
    leaves = `<path d="M60 86V56M60 66l-10-8M60 62l10-8" stroke="#7a5a3a" stroke-width="3.6" fill="none" stroke-linecap="round"/>` +
      [[44,46,-40],[52,36,-20],[60,30,0],[68,36,20],[76,46,40],[40,58,-70],[80,58,70],[52,50,-10],[68,50,10],[60,44,0]].map(a => lf(...a)).join("") +
      [[46,54],[72,48],[58,26],[66,58],[40,44],[80,40]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="4.2" fill="#f4a261"/>`).join("");
  } else if (id === "cephalotus") {
    // piccole anfore tozze e pelose a terra, con il coperchio
    const pit = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6-8c-4 6-4 14 6 16 10-2 10-10 6-16z" fill="#7f9c3f"/><path d="M-5 0c2 3 8 3 10 0" stroke="#8b1e3f" stroke-width="2" fill="none"/><ellipse cx="0" cy="-8" rx="6.5" ry="2.4" fill="#8b1e3f"/><ellipse cx="2" cy="-12" rx="6" ry="2.6" fill="#6b8f2e"/><path d="M-6-6l-2-2M6-6l2-2M-7 0l-2 0M7 0l2 0" stroke="#e9f5db" stroke-width=".9"/></g>`;
    leaves = `<ellipse cx="60" cy="80" rx="9" ry="4" fill="#4f7a32"/>` + pit(42, 74, .95) + pit(58, 70, 1.1) + pit(76, 74, .95) + pit(50, 80, .8) + pit(68, 81, .8);
  } else if (id === "vanda") {
    // foglie a ventaglio, stelo con fiori viola; le radici pendono sotto il cestino
    const lf = (r, l) => `<ellipse cx="60" cy="${80 - l}" rx="3.6" ry="${l}" transform="rotate(${r} 60 80)" fill="#4f7a32"/>`;
    const fl = (x, y) => [0,72,144,216,288].map(r => `<ellipse cx="${x}" cy="${y - 4}" rx="3.6" ry="5" transform="rotate(${r} ${x} ${y})" fill="#7b4bd1"/>`).join("") + `<circle cx="${x}" cy="${y}" r="2" fill="#f1e3ff"/>`;
    leaves = lf(-55, 16) + lf(55, 16) + lf(-35, 18) + lf(35, 18) + lf(-15, 19) + lf(15, 19) +
      `<path d="M66 70C74 56 84 44 92 34" stroke="#6a8f3a" stroke-width="2" fill="none"/>` + fl(76, 52) + fl(86, 40) + fl(96, 30);
    over = `<path d="M44 102c-2 10 2 18-2 26M52 102c2 10-2 16 0 24M62 102c-2 8 2 14 0 22M72 102c3 8-1 16 3 22M80 102c-2 8 1 12-2 18" stroke="#b8cbb0" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  // Le piante di palude stanno in un sottovaso pieno d’acqua (stavolta è giusto così)
  const tray = PLANTS[id]?.care?.bog ? `<path d="M22 124h76l-3 8H25z" fill="#8fcaff" opacity=".9"/><path d="M28 126h64" stroke="#ffffff" stroke-width="1.5" opacity=".7"/>` : "";
  // L’orchidea ha il vaso trasparente: si vedono le radici argentate dentro
  const roots = id === "orchidea" ? `<path d="M44 100c4 8 2 16 6 24M56 98c-2 10 4 16 2 26M68 98c4 8 0 16 4 24M78 100c-4 8-2 14-6 22" stroke="#b8cbb0" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>` : "";
  return `<svg width="${size}" height="${size * 1.1}" viewBox="0 0 120 132" aria-hidden="true" class="p-${state}">${pd.back}<g class="leaves">${stage === "piantina" ? `<g transform="translate(60 86) scale(.55) translate(-60 -86)">${leaves}</g>` : leaves}</g>${potSvg}${roots}<g class="leaves">${stage === "piantina" ? "" : over}</g>${tray}</svg>`;
}
const mascot = (size = 150, mood = "happy") => {
  const mouth = mood === "sad" ? '<path d="M50 72q10-8 20 0" stroke="#173b26" stroke-width="3.5" fill="none" stroke-linecap="round"/>' : '<path d="M48 68q12 12 24 0" stroke="#173b26" stroke-width="3.5" fill="#173b26" stroke-linecap="round"/>';
  return `<svg class="mascot" width="${size}" height="${size * 1.1}" viewBox="0 0 120 132" aria-hidden="true">
  <ellipse cx="38" cy="30" rx="12" ry="18" transform="rotate(-30 38 30)" fill="#43b05c"/><ellipse cx="82" cy="30" rx="12" ry="18" transform="rotate(30 82 30)" fill="#43b05c"/><ellipse cx="60" cy="20" rx="11" ry="17" fill="#4fc06a"/>
  <ellipse cx="60" cy="62" rx="38" ry="34" fill="#43b05c"/><ellipse cx="60" cy="56" rx="30" ry="22" fill="#5cc875" opacity=".6"/>
  <circle cx="47" cy="56" r="7" fill="#fff"/><circle cx="73" cy="56" r="7" fill="#fff"/><circle cx="48" cy="57" r="3.5" fill="#173b26"/><circle cx="72" cy="57" r="3.5" fill="#173b26"/>${mouth}
  <path d="M28 98h64l-6 30H34z" fill="#e0773a"/><rect x="24" y="90" width="72" height="12" rx="4" fill="#e0773a"/></svg>`;
};

/* ---- Il fagiolo nel cotone (giorni di fila): 8 fasi, più la versione secca ---- */
function beanSVG(stage = 0, size = 120, dry = false){
  const leaf = (x, y, r, flip) => `<path d="M0 0C5-8 17-9 23-2C17 6 6 7 0 0z" transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1) rotate(${r})" fill="${dry ? "#a68b5b" : "#43b05c"}" stroke="${dry ? "#7a6340" : "#2e8b48"}" stroke-width="1.5"/><path d="M0 0L18 -2" transform="translate(${x} ${y}) scale(${flip ? -1 : 1} 1) rotate(${r})" stroke="${dry ? "#7a6340" : "#2e8b48"}" stroke-width="1" opacity=".6"/>`;
  const stemC = dry ? "#9b7e4f" : "#3f9d52";
  const top = [96, 92, 54, 42, 22, 8, 8, -4][stage];
  // Fusto: da dentro il cotone fino a "top"; da secco si piega di lato
  const stem = stage < 2 ? "" : dry
    ? `<path d="M50 72C50 60 52 54 60 52S70 58 72 64" fill="none" stroke="${stemC}" stroke-width="4" stroke-linecap="round"/>`
    : stage === 2 ? `<path d="M50 72C50 62 50 56 46 52" fill="none" stroke="${stemC}" stroke-width="4" stroke-linecap="round"/>`
    : `<path d="M50 72C46 ${(72 + top) / 2 + 10} 56 ${(72 + top) / 2 - 6} 50 ${top}" fill="none" stroke="${stemC}" stroke-width="4" stroke-linecap="round"/>`;
  let extra = "";
  if (!dry) {
    if (stage === 2) extra = `<ellipse cx="44" cy="52" rx="6" ry="4" fill="#b98a4e"/><ellipse cx="52" cy="54" rx="5" ry="3.5" fill="#c99a5e"/>`;
    if (stage >= 3) extra += leaf(50, top + 2, -20, true) + leaf(50, top + 2, 20, false);
    if (stage >= 4) extra = `<rect x="58" y="6" width="6" height="72" rx="3" fill="#e9c98f" stroke="#c9a66a" stroke-width="1.5"/>` + extra + leaf(52, 46, -30, true) + leaf(48, 34, 30, false);
    if (stage >= 5) extra = `<rect x="6" y="4" width="34" height="44" rx="3" fill="#e2f4fc" stroke="#9cc3e0" stroke-width="3"/><path d="M23 4v44M6 26h34" stroke="#9cc3e0" stroke-width="3"/>` + extra + leaf(50, 58, 25, false) + leaf(50, 22, -35, true);
    if (stage >= 6) extra += [[44, 30], [56, 18], [46, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f7a8c8" stroke="#d6488d" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="1.8" fill="#fff"/>`).join("");
    if (stage >= 7) extra += `<g fill="#fff" stroke="#9cc3e0" stroke-width="2.5"><path d="M14 22a12 12 0 0 1 20-10a16 16 0 0 1 30 0a12 12 0 0 1 22 12a8 8 0 0 1-4 10H18a10 10 0 0 1-4-12z"/></g>`;
  }
  return `<svg class="bean" width="${size}" height="${size * 1.2}" viewBox="0 0 100 120" aria-hidden="true">
  ${stem}${extra}
  <path d="M24 66h52l-6 48a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4z" fill="${dry ? "#f1ece2" : "#eaf6ff"}" stroke="#9cc3e0" stroke-width="3" opacity=".95"/>
  <path d="M27 72c4-8 10-2 14-6s10 2 14-2 10 4 14 0 6 4 4 8v6H28z" fill="${dry ? "#ddd3c2" : "#fff"}" stroke="${dry ? "#c4b69c" : "#dfe8ef"}" stroke-width="2"/>
  ${stage === 1 && !dry ? `<path d="M52 77c3 5-3 7 1 12" fill="none" stroke="#c9a66a" stroke-width="3.5" stroke-linecap="round"/>` : ""}
  <ellipse cx="50" cy="73" rx="9" ry="6" fill="${dry ? "#8a6a45" : "#a8743f"}" stroke="#7a4f24" stroke-width="2"/><ellipse cx="47" cy="71" rx="3" ry="1.6" fill="#fff" opacity=".35"/>
  </svg>`;
}
// Lo spruzzino: tiene umido il cotone per un giorno saltato
const sprayerSVG = (size = 80) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true"><path d="M36 40h28v46a6 6 0 0 1-6 6H42a6 6 0 0 1-6-6z" fill="#3da5ec" stroke="#2a6fa8" stroke-width="4"/><rect x="40" y="28" width="20" height="12" rx="2" fill="#f2c230" stroke="#b8860b" stroke-width="3"/><path d="M44 28V16h22l6 6h-12v6" fill="#f2c230" stroke="#b8860b" stroke-width="3" stroke-linejoin="round"/><path d="M60 34l10 8" stroke="#b8860b" stroke-width="4" stroke-linecap="round"/><g fill="#7cc6f6"><circle cx="82" cy="16" r="3"/><circle cx="88" cy="24" r="2.5"/><circle cx="80" cy="28" r="2"/></g><rect x="40" y="56" width="20" height="16" rx="3" fill="#fff" opacity=".4"/></svg>`;
// Icone aggiunte: regalo, fagiolo fisso per la barra in alto
Object.assign(ICON, {
  gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3.5" y="9" width="17" height="4" rx="1"/><path d="M5 13v7.5h14V13M12 9v11.5"/><path d="M12 9c-1.5-3.5-6-4.5-6-1.6C6 9 9 9 12 9zM12 9c1.5-3.5 6-4.5 6-1.6C18 9 15 9 12 9z"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>'
});
const beanIcon = (size = 26) => `<svg class="beanicon" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 15C16 11 15 8 12 6" fill="none" stroke="#3f9d52" stroke-width="2.4" stroke-linecap="round"/><path d="M16 11c1-4 5-6 9-5c-1 4-5 6-9 5z" fill="#43b05c" stroke="#2e8b48" stroke-width="1.4"/><path d="M7 20c0-4 4-6 8-5s4 2 7 1 4 2 3 5-5 6-10 5-8-2-8-6z" fill="#a8743f" stroke="#7a4f24" stroke-width="2"/><ellipse cx="11" cy="20" rx="2.6" ry="1.4" fill="#fff" opacity=".35"/></svg>`;
