/* Vasanicola: contenuti (piante, caselle, domande, emergenze). Solo dati, nessuna logica. */
/* =========================================================
   Dati: piante, step, regole
   ========================================================= */
const DAY = 86400000;
const RULES = { waterCost:5, replantCost:10, stepGocce:10, stepXp:20, perfectBonusGocce:4, perfectBonusXp:5, replayGocce:6, replayXp:8, knowledgeMax:3, slotCosts:{ casa:[0,30,50,80,150,220], balcone:[60,60,90,90,170,240] } };
const PLANTS = {
  basilico:{ name:"Basilico", g:"m", indoor:true, sci:"Ocimum basilicum, in abruzzese vasanicola", cost:0,
    care:{ soak:1, thirsty:2, wilt:4, dead:7, rot:3, rule:"Ogni 1-2 giorni: in vaso beve tanto",
      dryTip:"Il basilico in vaso beve spesso: al sole si secca in pochi giorni.", wetTip:"Il basilico vuole terra fresca, non fradicia: lascia asciugare la superficie." }, facts:[
    "Vuole tanta luce: almeno 6 ore al giorno, meglio se di sole.",
    "Si cima: togli le punte sopra una coppia di foglie e diventa più folto.",
    "Il vaso del supermercato contiene decine di piantine strette: dividile in gruppetti e rinvasale.",
    "È una pianta annuale: anche curata benissimo, prima o poi chiude il suo ciclo."] },
  pothos:{ name:"Pothos", g:"m", indoor:true, sci:"Epipremnum aureum", cost:25,
    care:{ soak:5, thirsty:7, wilt:12, dead:21, rot:3, rule:"Circa una volta a settimana",
      dryTip:"Il pothos regge una settimana senz’acqua, non tre.", wetTip:"Il pothos si annaffia quando i primi centimetri di terra sono asciutti." }, facts:[
    "Sopporta poca luce, ma con poca luce perde le striature chiare.",
    "Si annaffia quando i primi centimetri di terra sono asciutti.",
    "Si moltiplica per talea: un pezzo di fusto con un nodo, in un bicchiere d’acqua.",
    "Se mangiato è tossico per cani e gatti."] },
  sansevieria:{ name:"Sansevieria", g:"f", indoor:true, sci:"Dracaena trifasciata, la lingua di suocera", cost:30,
    care:{ soak:10, thirsty:14, wilt:28, dead:45, rot:2, rule:"Ogni 2-3 settimane, a terra asciutta",
      dryTip:"Seccare una sansevieria è un’impresa: resiste più di un mese senz’acqua.", wetTip:"Accumula acqua nelle foglie: con la terra umida marcisce alla base." }, facts:[
    "Accumula acqua nelle foglie: si annaffia ogni 2-3 settimane, ancora meno d’inverno.",
    "Troppa acqua le fa marcire la base delle foglie.",
    "Tollera la poca luce, ma cresce meglio con luce indiretta e intensa."] },
  menta:{ name:"Menta", g:"f", indoor:true, sci:"Mentha, la menta", cost:25,
    care:{ soak:1, thirsty:3, wilt:5, dead:9, rot:4, rule:"Ogni 2-3 giorni: terra sempre un po’ umida",
      dryTip:"La menta vuole la terra sempre un po’ umida: senz’acqua si affloscia in fretta.", wetTip:"Anche la menta soffre se l’acqua ristagna: serve il foro di drenaggio." }, facts:[
    "Ama la terra sempre leggermente umida.",
    "Le sue radici corrono sotto terra e invadono tutto: va in un vaso tutto suo.",
    "Come il basilico, se la cimi diventa più folta."] }
};
const STEPS = [
  { id:"s1", zone:"z1", title:"Il basilico", icon:"leaf", items:[
    { t:"mc", plant:"basilico", q:"Quante ore di luce al giorno vuole il basilico, almeno?", o:["Un paio, è timido","Almeno 6","Zero, vive di affetto"], a:1, why:"Almeno 6 ore, meglio se di sole diretto. Sul davanzale buio fa la fine che sai." },
    { t:"tf", plant:"basilico", q:"Se togli le punte del basilico sopra una coppia di foglie, la pianta diventa più folta.", a:true, why:"Si chiama cimatura: la pianta risponde facendo due rametti dove prima ce n’era uno." },
    { t:"mc", plant:"basilico", q:"Cosa conviene fare appena porti a casa il vasetto del supermercato?", o:["Annaffiarlo tantissimo per sicurezza","Dividere le piantine in gruppetti e rinvasarle","Lasciarlo nel cellophane"], a:1, why:"Separando le piantine dai a ognuna lo spazio per crescere. Il cellophane lo usiamo per il panino." },
    { t:"tf", plant:"basilico", q:"Se il basilico muore dopo un anno, hai sbagliato tutto.", a:false, why:"È una pianta annuale: chiude il suo ciclo comunque. Stavolta non è colpa tua. Stavolta." }
  ]},
  { id:"s2", zone:"z1", title:"Luce", icon:"sun", items:[
    { t:"id", plant:"pothos", q:"Quale di queste è il pothos?", o:["sansevieria","pothos","menta","basilico"], a:"pothos", why:"Il pothos ha foglie a cuore e rami che ricadono. È la pianta che hai in ufficio e che nessuno annaffia." },
    { t:"tf", plant:"pothos", q:"Il pothos sopporta anche poca luce, ma le sue foglie diventano tutte verdi.", a:true, why:"Con poca luce perde le striature chiare: ha bisogno di più clorofilla per arrangiarsi." },
    { t:"mc", q:"Fusti lunghi, sottili e pallidi che si allungano verso la finestra vogliono dire...", o:["Troppa luce","Poca luce","Che la pianta vuole uscire"], a:1, why:"La pianta si allunga per cercare la luce. Si risolve spostandola, o girando il vaso ogni tanto." },
    { t:"id", plant:"sansevieria", q:"E questa? Quale è la sansevieria?", o:["menta","basilico","sansevieria","pothos"], a:"sansevieria", why:"Foglie dritte come spade, spesso con i bordi gialli. Indistruttibile, o quasi." },
    { t:"mc", plant:"sansevieria", q:"Che luce preferisce la sansevieria?", o:["Solo buio totale","Luce indiretta e intensa, ma tollera anche poca luce","Solo sole diretto tutto il giorno"], a:1, why:"Sopravvive anche in un corridoio, ma dove c’è luce indiretta cresce davvero." }
  ]},
  { id:"s3", zone:"z1", title:"Acqua", icon:"drop", items:[
    { t:"mc", q:"Come capisci se è ora di annaffiare?", o:["Ogni giorno alla stessa ora, sempre","Infili un dito nella terra: se i primi centimetri sono asciutti, annaffi","Quando la pianta ti guarda male"], a:1, why:"La prova del dito vale più di qualsiasi calendario. Anche se la pianta che ti guarda male è un ottimo indizio." },
    { t:"tf", plant:"sansevieria", q:"La sansevieria va annaffiata ogni 2-3 giorni.", a:false, why:"Accumula acqua nelle foglie: ogni 2-3 settimane basta, d’inverno anche meno." },
    { t:"mc", plant:"menta", q:"E la menta, come la vuole la terra?", o:["Sempre un po’ umida","Secca come il deserto","Allagata, è una pianta acquatica"], a:0, why:"La menta ama la terra leggermente umida. Non zuppa: leggermente." },
    { t:"id", plant:"menta", q:"Riconosci la menta?", o:["menta","pothos","basilico","sansevieria"], a:"menta", why:"Foglie seghettate sul bordo e fusti dritti. E se la sfreghi, profuma di mojito." },
    { t:"tf", plant:"sansevieria", q:"Troppa acqua può far marcire la base delle foglie della sansevieria.", a:true, why:"È il modo più comune di uccidere una pianta indistruttibile." }
  ]},
  { id:"s4", zone:"z1", title:"Terriccio e vaso", icon:"pot", items:[
    { t:"tf", q:"Uno strato di ghiaia sul fondo del vaso migliora il drenaggio.", a:false, why:"È un mito: la ghiaia fa salire la zona di terra fradicia verso le radici. Serve il foro, non la ghiaia." },
    { t:"mc", plant:"menta", q:"Perché la menta va in un vaso tutto suo?", o:["Perché è antipatica","Le sue radici corrono sotto terra e invadono tutto","Perché profuma troppo"], a:1, why:"Si allarga con radici striscianti. Se la metti con altre piante, in un mese il vaso è suo." },
    { t:"mc", plant:"pothos", q:"Come si fa un nuovo pothos gratis?", o:["Con una talea: un pezzo di fusto con un nodo, in acqua","Seminando le foglie","Chiedendolo alla pianta per favore"], a:0, why:"Dal nodo spuntano le radici in poche settimane. Poi lo metti in terra e hai una pianta nuova." },
    { t:"match", q:"Abbina ogni pianta al suo vizio", pairs:[["Basilico","Vuole il sole"],["Sansevieria","Odia l’acqua in eccesso"],["Menta","Invade il vaso"],["Pothos","Ricade dai mobili"]] }
  ]},
  { id:"s5", zone:"z1", title:"Ripasso", icon:"star", items:[
    { t:"id", plant:"basilico", q:"Per sicurezza: quale è il basilico?", o:["pothos","basilico","menta","sansevieria"], a:"basilico", why:"Foglie lucide, tondeggianti, a coppie. Lui. La leggenda." },
    { t:"tf", plant:"pothos", q:"Il pothos è innocuo se il gatto lo mangia.", a:false, why:"È tossico per cani e gatti: meglio appeso in alto, dove la gravità vince sulla curiosità." },
    { t:"mc", plant:"menta", q:"Come rendi più folta la menta?", o:["La cimi, come il basilico","La metti al buio","Le parli in dialetto"], a:0, why:"Cimare funziona con entrambe. Il dialetto aiuta solo l’umore." },
    { t:"mc", plant:"sansevieria", q:"Il modo migliore per uccidere una sansevieria è...", o:["Dimenticarla per due settimane","Annaffiarla troppo","Metterla in un angolo poco luminoso"], a:1, why:"Esatto: dimenticarla le va benissimo, annegarla no." },
    { t:"match", q:"Ultimo giro: abbina", pairs:[["Prova del dito","Quando annaffiare"],["Foro nel vaso","Drenaggio"],["Talea","Pianta nuova gratis"],["Cimatura","Pianta più folta"]] }
  ]}
];
// ---------- Zona 2: Mediterraneo ----------
Object.assign(PLANTS, {
  olivo:{ name:"Olivo", g:"m", indoor:false, sci:"Olea europaea, l’olivo", cost:40,
    care:{ soak:4, thirsty:7, wilt:14, dead:30, rot:3, rule:"Circa una volta a settimana, a terra asciutta",
      dryTip:"L’olivo resiste alla siccità, ma in vaso le radici non possono cercare l’acqua in profondità.", wetTip:"L’olivo odia i ristagni: terra che drena e vaso con il foro." }, facts:[
    "Vuole pieno sole, più ore possibile.",
    "Le foglie sono argentate sotto: peli microscopici che riflettono il sole e fanno perdere meno acqua.",
    "Sopporta bene la potatura: è così che resta a misura di vaso.",
    "In vaso teme il gelo: le radici non hanno la terra intorno a proteggerle."] },
  rosmarino:{ name:"Rosmarino", g:"m", indoor:false, sci:"Salvia rosmarinus, il rosmarino", cost:30,
    care:{ soak:4, thirsty:8, wilt:16, dead:30, rot:2, rule:"Poca: ogni 7-10 giorni, a terra asciutta",
      dryTip:"Il rosmarino è un duro, ma in vaso anche lui ha un limite.", wetTip:"Il rosmarino marcisce con i piedi bagnati: vuole terra sabbiosa e drenante." }, facts:[
    "Pieno sole e poca acqua: le sue condizioni preferite.",
    "Vuole terra drenante: sabbia o ghiaino mescolati al terriccio, non sul fondo.",
    "Si moltiplica facilmente per talea.",
    "Dal 2017 i botanici lo considerano una salvia: Salvia rosmarinus."] },
  lavanda:{ name:"Lavanda", g:"f", indoor:false, sci:"Lavandula angustifolia, la lavanda", cost:30,
    care:{ soak:4, thirsty:8, wilt:16, dead:30, rot:2, rule:"Poca: ogni 7-10 giorni, solo a terra asciutta",
      dryTip:"La lavanda sopporta la siccità, non l’abbandono totale in un vaso piccolo.", wetTip:"La lavanda muore più spesso di troppa acqua che di sete." }, facts:[
    "Pieno sole: all’ombra fiorisce poco e si allunga.",
    "Si pota dopo la fioritura, lasciando sempre un po’ di verde.",
    "Dal legno vecchio e spoglio raramente ributta.",
    "D’inverno beve pochissimo: terra fredda e bagnata le fa marcire le radici."] },
  ficodindia:{ name:"Fico d’India", g:"m", indoor:false, sci:"Opuntia ficus-indica, il fico d’India", cost:35,
    care:{ soak:10, thirsty:18, wilt:35, dead:60, rot:2, rule:"Molto poca: ogni 2-3 settimane",
      dryTip:"Accumula acqua nelle pale: per seccarlo ci vuole impegno.", wetTip:"Freddo e umidità insieme lo fanno marcire: poca acqua, sempre." }, facts:[
    "È un cactus arrivato dalle Americhe secoli fa.",
    "Le pale sono fusti piatti che accumulano acqua; le spine sono foglie trasformate.",
    "Una pala staccata, lasciata asciugare qualche giorno e poi piantata, diventa una pianta nuova.",
    "Oltre alle spine ha ciuffi di spine sottilissime, i glochidi: guanti spessi, sempre."] }
});
STEPS.push(
  { id:"m1", zone:"z2", title:"Pieno sole", icon:"sun", items:[
    { t:"mc", plant:"olivo", q:"Quanta luce vuole l’olivo?", o:["Pieno sole, più ore possibile","Luce indiretta, come il pothos","Ombra fresca, per riposare"], a:0, why:"Pieno sole. All’ombra cresce poco e non fa frutti. Le olive, s’intende." },
    { t:"tf", plant:"olivo", q:"Le foglie dell’olivo sono argentate sotto perché sono malate.", a:false, why:"Quella patina è fatta di peli microscopici che riflettono il sole e fanno perdere meno acqua. È crema solare, non una malattia." },
    { t:"id", plant:"lavanda", q:"Quale è la lavanda?", o:["rosmarino","olivo","lavanda","ficodindia"], a:"lavanda", why:"Ciuffo grigio-verde e spighe viola in cima. Il profumo dei cassetti della nonna." },
    { t:"mc", plant:"lavanda", q:"Perché tante piante mediterranee hanno foglie piccole, strette o grigie?", o:["Per perdere meno acqua sotto il sole","Perché sono ancora giovani","Per mimetizzarsi tra i sassi"], a:0, why:"Foglie piccole, strette o coperte di peli grigi si scaldano meno e traspirano meno: è il loro modo di risparmiare acqua." },
    { t:"tf", plant:"lavanda", q:"La lavanda sta bene nell’angolo più ombroso del balcone.", a:false, why:"Vuole pieno sole. All’ombra fiorisce poco e si allunga, tutta triste." }
  ]},
  { id:"m2", zone:"z2", title:"Bere poco", icon:"drop", items:[
    { t:"tf", plant:"ficodindia", q:"Le spine del fico d’India sono foglie trasformate.", a:true, why:"Proprio così: foglie diventate spine, che non perdono acqua e tengono lontano chi ha fame. La fotosintesi la fanno le pale verdi." },
    { t:"mc", plant:"ficodindia", q:"Ogni quanto si annaffia un fico d’India in vaso, d’estate?", o:["Ogni giorno, fa caldo","Ogni 2-3 settimane, a terra asciutta","Mai, vive d’aria"], a:1, why:"Poca acqua e solo con la terra asciutta. D’inverno quasi niente." },
    { t:"mc", plant:"rosmarino", q:"Che terra vuole il rosmarino in vaso?", o:["Terriccio con sabbia o ghiaino mescolati, che drena","Terra argillosa che trattiene l’acqua","Solo acqua, in un vaso di vetro"], a:0, why:"Deve drenare: sabbia o ghiaino aiutano. Mescolati nel terriccio, non sul fondo: il mito della ghiaia lo conosci già." },
    { t:"id", plant:"rosmarino", q:"Riconosci il rosmarino?", o:["lavanda","rosmarino","ficodindia","olivo"], a:"rosmarino", why:"Rametti dritti pieni di foglioline ad ago. Sa di arrosto della domenica." },
    { t:"tf", plant:"rosmarino", q:"Il rosmarino muore più spesso di sete che di troppa acqua.", a:false, why:"Al contrario: con i piedi bagnati le radici marciscono. Di sete è difficile, è un osso duro." }
  ]},
  { id:"m3", zone:"z2", title:"Potare e moltiplicare", icon:"leaf", items:[
    { t:"mc", plant:"lavanda", q:"Quando si pota la lavanda?", o:["Subito dopo la fioritura","In pieno inverno, a fondo","Mai, si offende"], a:0, why:"Dopo la fioritura, togliendo gli steli secchi e un po’ di verde. Così resta compatta e l’anno dopo rifiorisce." },
    { t:"tf", plant:"lavanda", q:"Per ringiovanire una lavanda vecchia basta tagliarla fino al legno spoglio alla base.", a:false, why:"Dal legno vecchio la lavanda raramente ributta. Si taglia sempre lasciando un po’ di verde." },
    { t:"mc", plant:"rosmarino", q:"Come ottieni un rosmarino nuovo gratis?", o:["Con una talea: un rametto di una decina di centimetri, senza le foglie in basso, nel terriccio","Piantando un ago","Comprandone due e sperando"], a:0, why:"Le talee di rosmarino attecchiscono bene. Come per il pothos, ma di solito direttamente in terra." },
    { t:"mc", plant:"ficodindia", q:"Al fico d’India si stacca una pala. Che fai?", o:["La lasci asciugare qualche giorno e poi la pianti","La pianti subito e la annaffi tanto","La butti, ormai è andata"], a:0, why:"Si lascia cicatrizzare il taglio per qualche giorno, poi si pianta: mette radici e diventa una pianta nuova." },
    { t:"tf", plant:"olivo", q:"L’olivo si può potare per tenerlo piccolo in vaso.", a:true, why:"Sopporta bene la potatura: è così che si tiene a misura di balcone." }
  ]},
  { id:"m4", zone:"z2", title:"Vaso e inverno", icon:"pot", items:[
    { t:"mc", plant:"olivo", q:"Arriva una notte di gelo forte. L’olivo in vaso sul balcone...", o:["Lo avvicini al muro di casa e copri chioma e vaso con il tessuto non tessuto","Lo annaffi tanto, così si scalda","Lo porti vicino al termosifone acceso"], a:0, why:"Il muro fa da riparo e il tessuto non tessuto lo protegge. Il termosifone no: caldo secco, e lo sveglia nel momento sbagliato." },
    { t:"tf", plant:"ficodindia", q:"Al fico d’India fanno più danno freddo e umidità insieme che il freddo da solo.", a:true, why:"Con la terra bagnata e il freddo le pale marciscono. D’inverno: riparo dalla pioggia e quasi niente acqua." },
    { t:"mc", q:"Per una pianta che odia i ristagni, meglio un vaso...", o:["Di terracotta, che respira e fa evaporare l’acqua","Di vetro, così vedi le radici","Senza foro, così non sporca"], a:0, why:"La terracotta è porosa e lascia evaporare l’acqua in più. Perfetta per chi teme i piedi bagnati. E il foro, sempre." },
    { t:"id", plant:"ficodindia", q:"Quale è il fico d’India?", o:["olivo","ficodindia","rosmarino","lavanda"], a:"ficodindia", why:"Pale ovali e spine. Lo riconosci anche al buio. Con le mani, purtroppo." },
    { t:"tf", plant:"lavanda", q:"D’inverno la lavanda va annaffiata come d’estate.", a:false, why:"D’inverno beve pochissimo: terra fredda e bagnata le fa marcire le radici." }
  ]},
  { id:"m5", zone:"z2", title:"Ripasso", icon:"star", items:[
    { t:"id", plant:"olivo", q:"Quale è l’olivo?", o:["lavanda","ficodindia","olivo","rosmarino"], a:"olivo", why:"Foglie strette, verdi sopra e argentate sotto, tronco nodoso. Pace, longevità e olio." },
    { t:"mc", plant:"lavanda", q:"Come si tiene compatta la lavanda?", o:["Potandola dopo la fioritura, senza arrivare al legno vecchio","Tagliandola a raso ogni inverno","Annaffiandola tutti i giorni"], a:0, why:"Dopo i fiori, e lasciando sempre un po’ di verde." },
    { t:"tf", plant:"rosmarino", q:"Il rosmarino vuole pieno sole.", a:true, why:"Sole pieno e poca acqua. Come chi va in vacanza al Sud, ma senza la crema." },
    { t:"mc", plant:"ficodindia", q:"Cosa sono le pale del fico d’India?", o:["Fusti piatti che fanno da serbatoio d’acqua","Foglie molto grosse","Frutti non ancora maturi"], a:0, why:"Fusti piatti e verdi: fanno la fotosintesi e tengono l’acqua da parte." },
    { t:"match", q:"Abbina pianta e superpotere", pairs:[["Olivo","Foglie argentate anti-sole"],["Fico d’India","Pale serbatoio"],["Lavanda","Si pota dopo i fiori"],["Rosmarino","Talee facili"]] }
  ]}
);
// ---------- Zona 3: Giungla in salotto (tutte piante da casa) ----------
Object.assign(PLANTS, {
  monstera:{ name:"Monstera", g:"f", indoor:true, sci:"Monstera deliciosa", cost:30,
    care:{ soak:5, thirsty:8, wilt:14, dead:25, rot:3, rule:"Circa una volta a settimana, quando i primi centimetri sono asciutti",
      dryTip:"La monstera regge un po’ di sete, ma non settimane di abbandono.", wetTip:"Con la terra sempre bagnata le radici della monstera marciscono e le foglie ingialliscono." }, facts:[
    "Luce indiretta e intensa: il sole diretto le brucia le foglie.",
    "I buchi nelle foglie arrivano con l’età e con la luce giusta: le foglie giovani sono intere.",
    "Le radici che escono dal fusto servono ad aggrapparsi: si possono guidare verso un tutore.",
    "È tossica per cani e gatti, come il suo parente pothos."] },
  calathea:{ name:"Calathea", g:"f", indoor:true, sci:"Calathea, oggi spesso chiamata Goeppertia", cost:35,
    care:{ soak:2, thirsty:4, wilt:7, dead:12, rot:3, rule:"Ogni 3-4 giorni: terra appena umida, mai zuppa",
      dryTip:"La calathea non perdona la terra secca: arriccia le foglie e si arrende presto.", wetTip:"La calathea vuole terra umida, non fradicia: le radici devono respirare." }, facts:[
    "Di sera alza le foglie e al mattino le riabbassa: per questo la chiamano pianta della preghiera.",
    "Vuole luce indiretta: il sole diretto sbiadisce i disegni delle foglie.",
    "Punte marroni e foglie arricciate: aria troppo secca o acqua troppo calcarea.",
    "Non è tossica per cani e gatti."] },
  orchidea:{ name:"Orchidea", g:"f", indoor:true, sci:"Phalaenopsis, l’orchidea farfalla", cost:35,
    care:{ soak:5, thirsty:8, wilt:14, dead:30, rot:2, rule:"Circa una volta a settimana, per immersione, quando le radici sono argentate",
      feelWet:"Corteccia fradicia e radici verde scuro. Niente acqua per un po’.", feelReady:"Corteccia asciutta e radici argentate: è il momento di immergerla.",
      dryTip:"L’orchidea accumula acqua nelle foglie spesse, ma non all’infinito.", wetTip:"L’acqua ferma tra la corteccia fa marcire le radici: dopo l’immersione va scolata bene." }, facts:[
    "Non vive nella terra: in natura sta aggrappata agli alberi, nel vaso ha la corteccia.",
    "Le radici fanno anche la fotosintesi: per questo il vaso è trasparente.",
    "Si annaffia per immersione: 10-15 minuti in acqua, poi si scola bene.",
    "Dopo i fiori non è morta: riposa, e con qualche notte più fresca può rifiorire."] },
  felce:{ name:"Felce", g:"f", indoor:true, sci:"Nephrolepis exaltata, la felce di Boston", cost:25,
    care:{ soak:1, thirsty:3, wilt:5, dead:9, rot:4, rule:"Ogni 2-3 giorni: terra sempre un po’ umida",
      dryTip:"Con la terra secca la felce perde le fogliette a pioggia, poi si arrende.", wetTip:"Anche la felce, che ama l’umido, soffre se l’acqua ristagna nel vaso." }, facts:[
    "Ama l’aria umida: un bagno luminoso è il suo paradiso, il termosifone il suo inferno.",
    "Se la terra si secca, perde fogliette a pioggia.",
    "Non fa né fiori né semi: si riproduce con le spore, i puntini marroni sotto le fronde.",
    "Le felci esistevano già prima dei dinosauri."] }
});
PLANTS.sansevieria.care.feelReady = "Asciutta anche in profondità. Adesso sì, si può annaffiare.";
STEPS.push(
  { id:"j1", zone:"z3", title:"Luce filtrata", icon:"sun", items:[
    { t:"mc", plant:"monstera", q:"Dove sta meglio la monstera?", o:["Vicino a una finestra luminosa, senza sole diretto sulle foglie","Sul balcone in pieno sole","In un corridoio senza finestre"], a:0, why:"Luce indiretta e intensa. Il sole diretto le brucia le foglie, il buio la fa crescere storta e senza buchi." },
    { t:"tf", plant:"monstera", q:"Le foglie giovani della monstera sono già piene di buchi.", a:false, why:"I buchi arrivano con l’età e con la luce giusta: le prime foglie sono intere. Se continuano a uscire intere, chiede più luce." },
    { t:"id", plant:"calathea", q:"Quale è la calathea?", o:["monstera","calathea","orchidea","felce"], a:"calathea", why:"Foglie larghe e decorate, come disegnate a pennarello. Sembrano finte, ma pretendono attenzioni vere." },
    { t:"tf", plant:"calathea", q:"Il sole diretto rende più belli i disegni delle foglie della calathea.", a:false, why:"Li sbiadisce e brucia le foglie. Vuole luce indiretta." },
    { t:"mc", plant:"calathea", q:"La sera la calathea alza le foglie. Cosa vuol dire?", o:["Niente di grave: si muove così ogni giorno, al mattino le riabbassa","Ha sete, subito","Ha freddo e va spostata"], a:0, why:"È un movimento naturale, giorno e notte. Per questo la chiamano pianta della preghiera." }
  ]},
  { id:"j2", zone:"z3", title:"Aria umida", icon:"drop", items:[
    { t:"mc", plant:"calathea", q:"Punte delle foglie marroni e secche sulla calathea vogliono dire...", o:["Aria troppo secca, o acqua troppo calcarea","Troppa luce della luna","Che sta per fiorire"], a:0, why:"È il segnale classico. Si taglia la parte secca e si cerca di dare più umidità." },
    { t:"tf", plant:"felce", q:"Spruzzare acqua sulle foglie ogni tanto risolve il problema dell’aria secca.", a:false, why:"L’effetto dura pochi minuti. Funziona meglio raggruppare le piante, o mettere il vaso su un sottovaso con argilla espansa e acqua, senza che il fondo tocchi l’acqua." },
    { t:"mc", plant:"felce", q:"Dove sta bene una felce in casa?", o:["In un bagno luminoso, dove l’aria è più umida","Sopra il termosifone, al calduccio","Sul balcone, in pieno sole d’agosto"], a:0, why:"Il bagno, se ha una finestra, è il suo paradiso: umido e luminoso. Il termosifone è il suo inferno." },
    { t:"id", plant:"felce", q:"Riconosci la felce?", o:["orchidea","felce","calathea","monstera"], a:"felce", why:"Fronde lunghe e arcuate, piene di fogliette. È più antica dei dinosauri, e si vede." },
    { t:"tf", plant:"felce", q:"Se la terra della felce si secca, perde fogliette a pioggia.", a:true, why:"Ama la terra sempre un po’ umida. Se si secca, te lo dice spargendo foglioline sul pavimento." }
  ]},
  { id:"j3", zone:"z3", title:"Radici strane", icon:"leaf", items:[
    { t:"tf", plant:"orchidea", q:"L’orchidea si pianta nel terriccio normale, come il basilico.", a:false, why:"Nel terriccio le radici soffocano e marciscono. Vuole corteccia, che lascia passare l’aria." },
    { t:"mc", plant:"orchidea", q:"Perché l’orchidea sta spesso in un vaso trasparente?", o:["Perché le radici fanno anche la fotosintesi","Per controllare che non ci siano pesci","Perché costa meno"], a:0, why:"Le radici verdi-argentate fanno la fotosintesi. E il vaso trasparente aiuta anche te: vedi quando hanno sete." },
    { t:"mc", plant:"orchidea", q:"Come si annaffia un’orchidea?", o:["Immergi il vaso in acqua per 10-15 minuti, poi la lasci scolare bene","Un bicchiere d’acqua sulle foglie ogni giorno","Riempi il vaso d’acqua e la lasci lì"], a:0, why:"Per immersione, quando le radici sono argentate. Poi si scola bene: l’acqua ferma la fa marcire." },
    { t:"mc", plant:"monstera", q:"Le radici che escono dal fusto della monstera...", o:["Servono ad aggrapparsi: si possono guidare verso un tutore","Sono un sintomo di malattia","Vanno annaffiate ogni giorno"], a:0, why:"Sono radici aeree: in natura si aggrappano ai tronchi. Un tutore di fibra di cocco la aiuta a crescere dritta." },
    { t:"id", plant:"monstera", q:"Quale è la monstera?", o:["felce","orchidea","monstera","calathea"], a:"monstera", why:"Foglie enormi con i buchi. La pianta più fotografata di Instagram." }
  ]},
  { id:"j4", zone:"z3", title:"Fiori e riposo", icon:"pot", items:[
    { t:"tf", plant:"orchidea", q:"Quando cadono i fiori, l’orchidea è morta.", a:false, why:"Sta riposando. Foglie e radici sono vive: la pianta si prepara alla prossima fioritura." },
    { t:"mc", plant:"orchidea", q:"Cosa aiuta l’orchidea a fare un nuovo stelo di fiori?", o:["Qualche settimana con le notti più fresche del giorno","Tenerla al buio totale","Annaffiarla il doppio"], a:0, why:"La differenza di temperatura tra giorno e notte le dà il segnale. In autunno, vicino a una finestra, spesso basta." },
    { t:"tf", plant:"felce", q:"La felce fa fiori piccolissimi, difficili da vedere.", a:false, why:"Le felci non fanno né fiori né semi: si riproducono con le spore, i puntini marroni sotto le fronde." },
    { t:"mc", plant:"felce", q:"Puntini marroni in file ordinate sotto le fronde della felce...", o:["Sono le spore: è tutto normale","Sono parassiti da eliminare subito","Sono bruciature del sole"], a:0, why:"Sono gruppi di spore. Non confonderli con le cocciniglie, che invece sono sparse e si staccano con l’unghia." },
    { t:"tf", plant:"calathea", q:"La calathea è tossica per cani e gatti, come il pothos.", a:false, why:"Buona notizia: la calathea non è tossica. Il gatto può fissarla in pace. La monstera invece sì." }
  ]},
  { id:"j5", zone:"z3", title:"Ripasso", icon:"star", items:[
    { t:"id", plant:"orchidea", q:"Quale è l’orchidea?", o:["calathea","monstera","felce","orchidea"], a:"orchidea", why:"Foglie larghe e spesse alla base, uno stelo con fiori a farfalla, radici argentate che escono dal vaso." },
    { t:"mc", plant:"monstera", q:"La monstera fa foglie nuove piccole e senza buchi. Cosa le manca?", o:["Più luce indiretta","Più acqua","Un tutore più alto"], a:0, why:"Con poca luce risparmia energie e fa foglie piccole e intere." },
    { t:"tf", plant:"calathea", q:"Con l’acqua di casa molto calcarea, la calathea può farsi le punte marroni.", a:true, why:"È sensibile al calcare: meglio acqua piovana o filtrata, se quella di casa è molto dura." },
    { t:"mc", plant:"felce", q:"Intorno alla felce l’aria è secca. La cosa più utile è...", o:["Raggrupparla con altre piante o metterla su argilla espansa bagnata","Spruzzarla una volta al mese","Avvicinarla al termosifone"], a:0, why:"Le piante vicine si fanno umidità a vicenda, e l’acqua nell’argilla evapora intorno al vaso." },
    { t:"match", q:"Abbina pianta e mania", pairs:[["Monstera","Foglie con i buchi"],["Calathea","Prega la sera"],["Orchidea","Radici al sole"],["Felce","Spore, non semi"]] }
  ]}
);
// ---------- Caselle a più lezioni ----------
// Ogni casella (step) ha: le lezioni scritte (la prima è step.items, le altre in EXTRA) + un "Allenamento"
// generato pescando a caso le sue domande. Il Ripasso di fine zona pesca da tutta la zona.
const EXTRA = {};
// ---------- Piante nuove: zone 1-3 (seconde lezioni) e zona 4 Fiori da balcone ----------
Object.assign(PLANTS, {
  zamioculcas:{ name:"Zamioculcas", g:"f", indoor:true, sci:"Zamioculcas zamiifolia, la ZZ", cost:25,
    care:{ soak:10, thirsty:16, wilt:30, dead:50, rot:2, rule:"Ogni 2-3 settimane: i rizomi le fanno da borraccia",
      feelReady:"Asciutta anche in profondità. Adesso sì, un po’ d’acqua.",
      dryTip:"Per seccare una zamioculcas ci vuole impegno: complimenti, in un certo senso.", wetTip:"I rizomi della zamioculcas marciscono con la terra bagnata: meglio dimenticarla che annegarla." }, facts:[
    "Sotto terra ha dei rizomi che accumulano acqua: sopporta settimane di dimenticanza.",
    "Tollera la poca luce meglio di quasi tutte le piante da casa.",
    "Le foglie lucide sembrano finte. Non lo sono.",
    "È irritante se mangiata: lontana da cani e gatti."] },
  spatifillo:{ name:"Spatifillo", g:"m", indoor:true, sci:"Spathiphyllum, il giglio della pace", cost:25,
    care:{ soak:2, thirsty:4, wilt:6, dead:12, rot:3, rule:"Ogni 3-5 giorni: quando si affloscia, sei in ritardo",
      dryTip:"Lo spatifillo avvisa con una scena madre. Ignorata troppe volte, la scena diventa finale.", wetTip:"Lo spatifillo ama l’umido, ma non il vaso allagato: le radici devono respirare." }, facts:[
    "Quando ha sete si affloscia tutto, e dopo l’acqua si rialza in poche ore.",
    "Fiorisce anche con poca luce, cosa rara tra le piante da casa.",
    "La vela bianca è una brattea: i fiori veri sono sulla spiga al centro.",
    "È irritante per bocca e stomaco di cani e gatti."] },
  limone:{ name:"Limone", g:"m", indoor:false, sci:"Citrus limon, il limone", cost:40,
    care:{ soak:3, thirsty:5, wilt:10, dead:20, rot:2, rule:"Ogni 3-5 giorni d’estate, quando la superficie è asciutta",
      dryTip:"In vaso il limone si secca in fretta: le foglie si arrotolano, poi cadono.", wetTip:"Con l’acqua ferma il limone perde le foglie: vuole acqua regolare, mai ristagni." }, facts:[
    "Vuole pieno sole: senza, niente fiori e niente limoni.",
    "Foglie gialle con le venature verdi: manca ferro, spesso per colpa del calcare.",
    "D’inverno, al Nord, va in un posto riparato e luminoso: teme il gelo.",
    "I rami dritti che spuntano dalla base vengono dal portainnesto: si tagliano."] },
  salvia:{ name:"Salvia", g:"f", indoor:false, sci:"Salvia officinalis, la salvia", cost:25,
    care:{ soak:3, thirsty:6, wilt:12, dead:24, rot:2, rule:"Poca: ogni 5-7 giorni, in terra drenante",
      dryTip:"La salvia è resistente, ma in un vaso piccolo e sotto il sole ha un limite.", wetTip:"Con la terra sempre bagnata la salvia marcisce: drenaggio, sempre." }, facts:[
    "Le foglie grigie e vellutate la aiutano a perdere meno acqua al sole.",
    "È parente stretta del rosmarino, che dal 2017 si chiama Salvia rosmarinus.",
    "Si pota in primavera, senza arrivare al legno vecchio e spoglio.",
    "Regge il freddo molto meglio del limone."] },
  tillandsia:{ name:"Tillandsia", g:"f", indoor:true, sci:"Tillandsia, la pianta dell’aria", cost:25,
    care:{ soak:3, thirsty:5, wilt:10, dead:20, rot:2, rule:"1-2 volte a settimana: bagno di 20-30 minuti, poi ad asciugare capovolta",
      feelWet:"Acqua ancora nel centro della rosetta. Falla asciugare a testa in giù, subito.", feelDamp:"Foglie verdi e pesanti: ha bevuto da poco.",
      feelReady:"Foglie argentate e leggere: è ora di un bagno.", feelDry:"Foglie arricciate e leggerissime. Bagno, subito.",
      dryTip:"Vive d’aria, ma non solo d’aria: senza bagni si accartoccia.", wetTip:"L’acqua ferma al centro della rosetta la fa marcire dall’interno." }, facts:[
    "Vive senza terra: beve dalle foglie, coperte di minuscole squame argentate.",
    "Le radici servono solo ad aggrapparsi.",
    "Dopo il bagno va asciugata a testa in giù, o marcisce al centro.",
    "Fiorisce una volta sola, poi fa i figli alla base."] },
  ficus:{ name:"Ficus elastica", g:"m", indoor:true, sci:"Ficus elastica, l’albero della gomma", cost:35,
    care:{ soak:5, thirsty:8, wilt:14, dead:25, rot:2, rule:"Circa una volta a settimana, quando i primi centimetri sono asciutti",
      dryTip:"Il ficus regge un po’ di sete, poi inizia a lasciar cadere le foglie in basso.", wetTip:"Terra sempre bagnata, foglie che cadono: il ficus odia i ristagni." }, facts:[
    "Odia i traslochi: se lo sposti spesso, perde le foglie.",
    "La polvere sulle foglie ruba luce: un panno umido ogni tanto.",
    "Se tagli un ramo esce lattice bianco, irritante: guanti.",
    "Un tempo dal suo lattice si ricavava la gomma."] },
  geranio:{ name:"Geranio", g:"m", indoor:false, sci:"Pelargonium, il geranio dei balconi", cost:25,
    care:{ soak:2, thirsty:4, wilt:8, dead:15, rot:2, rule:"Ogni 2-4 giorni d’estate, a terra asciutta: odia i ristagni",
      dryTip:"Il geranio sopporta un po’ di secco, non un’estate intera di abbandono.", wetTip:"Le radici del geranio marciscono in fretta: meglio poca acqua che troppa." }, facts:[
    "Il geranio dei balconi in realtà è un Pelargonium.",
    "Più sole prende, più fiorisce.",
    "Togliendo gli steli dei fiori secchi, ne arrivano di nuovi.",
    "Si moltiplica facilmente per talea, e d’inverno va al riparo dal gelo."] },
  petunia:{ name:"Petunia", g:"f", indoor:false, sci:"Petunia, la petunia", cost:20,
    care:{ soak:1, thirsty:2, wilt:4, dead:7, rot:3, rule:"Quasi ogni giorno d’estate: in vaso si secca in fretta",
      dryTip:"In un vaso piccolo e al sole, la petunia si secca in un pomeriggio.", wetTip:"Anche la petunia, assetata com’è, soffre se il vaso ristagna." }, facts:[
    "Togliendo i fiori secchi non fa semi e continua a fiorire.",
    "Le foglie sono un po’ appiccicose: sono peli, non sporco.",
    "Si coltiva di solito come annuale: dalla primavera all’autunno.",
    "A metà estate una spuntatina la fa ramificare e rifiorire."] },
  ortensia:{ name:"Ortensia", g:"f", indoor:false, sci:"Hydrangea macrophylla, l’ortensia", cost:35,
    care:{ soak:1, thirsty:2, wilt:3, dead:6, rot:4, rule:"Tanta: terra sempre umida, d’estate anche ogni giorno",
      dryTip:"Hydrangea vuol dire “vaso d’acqua”: senza acqua si affloscia in poche ore.", wetTip:"Anche l’ortensia, la più assetata del balcone, soffre se l’acqua ristagna." }, facts:[
    "Hydrangea, dal greco: “vaso d’acqua”. È tra le più assetate del balcone.",
    "Vuole mezz’ombra: il sole del pomeriggio la brucia.",
    "Alcune cambiano colore: blu in terra acida, rosa in terra calcarea.",
    "Fiorisce sui rami dell’anno prima: potarla in autunno toglie i fiori futuri."] },
  bouganville:{ name:"Bouganville", g:"f", indoor:false, sci:"Bougainvillea, la bouganville", cost:40,
    care:{ soak:4, thirsty:7, wilt:14, dead:28, rot:2, rule:"Poca: circa una volta a settimana, a terra asciutta",
      dryTip:"La bouganville ama il secco, ma un vaso dimenticato per settimane è troppo anche per lei.", wetTip:"Troppa acqua: tante foglie, niente fiori, poi marciume." }, facts:[
    "La parte colorata sono brattee: i fiori veri sono i tubetti bianchi al centro.",
    "Vuole sole pieno e caldo per fiorire tanto.",
    "Teme il gelo: al Nord, d’inverno, va al riparo.",
    "Si pota dopo la fioritura: rifiorisce sui rami nuovi."] }
});

// Seconde lezioni delle caselle delle zone 1-3
Object.assign(EXTRA, {
  s1:[{ title:"Raccolto e semina", items:[
    { t:"mc", plant:"basilico", q:"Come si raccoglie il basilico senza rovinarlo?", o:["Dall’alto, tagliando sopra una coppia di foglie","Strappando le foglie grandi in basso","Sradicando una piantina alla volta"], a:0, why:"Raccogliendo dall’alto fai raccolto e cimatura insieme: lui ringrazia facendo due rametti." },
    { t:"tf", plant:"basilico", q:"Il basilico soffre il freddo: sotto i 10 gradi circa inizia a stare male.", a:true, why:"È una pianta da estate. Una notte fredda sul davanzale d’autunno e le foglie anneriscono." },
    { t:"mc", plant:"basilico", q:"Il basilico si può seminare?", o:["Sì, in primavera e al caldo: germoglia in una o due settimane","No, nasce solo al supermercato","Solo in Liguria, per legge"], a:0, why:"Si semina in primavera, al caldo. Germoglia in fretta e dà soddisfazione (per una volta)." },
    { t:"tf", plant:"basilico", q:"Le foglie annerite dal freddo tornano verdi in qualche giorno.", a:false, why:"Sono danni da freddo: quelle foglie non tornano. Si tolgono e si spera nel resto della pianta." }
  ]}],
  s2:[{ title:"Poca luce, nessuna scusa", items:[
    { t:"id", plant:"zamioculcas", q:"Quale è la zamioculcas?", o:["spatifillo","zamioculcas","pothos","sansevieria"], a:"zamioculcas", why:"Steli dritti con foglioline lucide a coppie, come plastificate. Molti la credono finta (lei se ne offende)." },
    { t:"tf", plant:"zamioculcas", q:"La zamioculcas sopravvive anche lontano dalla finestra.", a:true, why:"Tollera la poca luce meglio di quasi tutte. Cresce più lenta, ma non si lamenta." },
    { t:"mc", plant:"spatifillo", q:"Lo spatifillo fiorisce anche con poca luce?", o:["Sì, è una delle poche piante da casa che fiorisce in mezza ombra","No, solo in pieno sole","Solo se gli canti qualcosa"], a:0, why:"È il suo superpotere: fiori bianchi anche lontano dalla finestra. Basta che non sia buio pesto." },
    { t:"id", plant:"spatifillo", q:"Riconosci lo spatifillo?", o:["zamioculcas","menta","spatifillo","basilico"], a:"spatifillo", why:"Foglie lunghe e lucide, e quel “fiore” bianco a vela con una spiga al centro." },
    { t:"tf", plant:"spatifillo", q:"Il “fiore” bianco dello spatifillo è in realtà una foglia trasformata.", a:true, why:"La vela bianca è una brattea: i fiori veri, minuscoli, stanno sulla spiga al centro." }
  ]}],
  s3:[{ title:"Chi parla e chi tace", items:[
    { t:"mc", plant:"spatifillo", q:"Lo spatifillo ha tutte le foglie afflosciate. Cosa fai?", o:["Lo annaffi: in poche ore si rialza","Lo butti, è morto","Lo metti al sole per tirarlo su"], a:0, why:"Quando ha sete si affloscia in modo teatrale, e dopo l’acqua si riprende. Meglio non farglielo fare spesso." },
    { t:"tf", plant:"zamioculcas", q:"La zamioculcas va annaffiata spesso, come la menta.", a:false, why:"I rizomi sotto terra le fanno da borraccia: ogni 2-3 settimane basta. Il pericolo è l’acqua in più." },
    { t:"mc", plant:"zamioculcas", q:"Cosa sono i bulbi grossi sotto terra della zamioculcas?", o:["Rizomi che accumulano acqua","Patate dimenticate","Uova di lumaca"], a:0, why:"Sono rizomi, riserve d’acqua. Per questo perdona le dimenticanze e odia l’acqua ferma." },
    { t:"tf", plant:"spatifillo", q:"Lo spatifillo è innocuo se lo morde il gatto.", a:false, why:"Come il pothos, irrita bocca e stomaco di cani e gatti. Meglio fuori portata." }
  ]}],
  s4:[{ title:"Il rinvaso", items:[
    { t:"mc", q:"Come capisci che una pianta va rinvasata?", o:["Le radici escono dai fori o girano attorno al vaso","Ha compiuto un anno","Ti sembra annoiata"], a:0, why:"Radici dai fori o arrotolate in cerchio: il vaso è diventato stretto." },
    { t:"mc", q:"Quanto più grande deve essere il vaso nuovo?", o:["Poco: qualche centimetro di diametro in più","Il doppio, così non ci pensi più","Uguale, ma di un altro colore"], a:0, why:"Troppa terra in più resta bagnata a lungo e rischia di far marcire le radici." },
    { t:"tf", plant:"zamioculcas", q:"I rizomi della zamioculcas possono deformare un vaso di plastica stretto.", a:true, why:"Crescono e spingono: a volte il vaso si gonfia o si spacca. È il suo modo di chiedere casa nuova." },
    { t:"mc", plant:"spatifillo", q:"Lo spatifillo è diventato un cespuglio enorme. Puoi...", o:["Dividerlo in più ciuffi, ognuno con le sue radici, e rinvasarli","Tagliarlo a metà con le forbici, foglie comprese","Lasciarlo esplodere"], a:0, why:"Si divide il cespo con le radici: da una pianta ne ottieni due o tre." }
  ]}],
  m1:[{ title:"Agrumi e salvia", items:[
    { t:"mc", plant:"limone", q:"Dove sta bene il limone in vaso d’estate?", o:["In pieno sole, al riparo dal vento forte","In un angolo d’ombra fresca","In casa vicino al termosifone"], a:0, why:"Sole pieno: senza, niente fiori e niente limoni. Solo foglie e delusione." },
    { t:"id", plant:"limone", q:"Quale è il limone?", o:["salvia","olivo","limone","lavanda"], a:"limone", why:"Foglie lucide e ovali, e i limoni appesi. Con i limoni è facile, ammettiamolo." },
    { t:"id", plant:"salvia", q:"Riconosci la salvia?", o:["rosmarino","salvia","limone","lavanda"], a:"salvia", why:"Foglie ovali, grigio-verdi e vellutate. Profumo di burro e salvia." },
    { t:"tf", plant:"salvia", q:"Le foglie vellutate e grigie aiutano la salvia a perdere meno acqua al sole.", a:true, why:"I peli sottili riflettono la luce e trattengono umidità: la stessa strategia dell’olivo." },
    { t:"tf", plant:"salvia", q:"Salvia e rosmarino sono parenti stretti.", a:true, why:"Così stretti che dal 2017 il rosmarino si chiama Salvia rosmarinus. Riunione di famiglia sul balcone." }
  ]}],
  m2:[{ title:"Acqua e calcare", items:[
    { t:"mc", plant:"limone", q:"Le foglie del limone ingialliscono, ma le venature restano verdi. Cosa vuol dire?", o:["Gli manca il ferro, spesso per colpa del calcare","Ha preso troppo sole","Sta per fare i limoni"], a:0, why:"È la clorosi ferrica: con il calcare il ferro non viene assorbito. Si usa un concime con ferro per agrumi." },
    { t:"mc", plant:"limone", q:"Quando si annaffia il limone in vaso d’estate?", o:["Quando i primi centimetri di terra sono asciutti","Tutti i giorni, a prescindere","Una volta al mese"], a:0, why:"Regolare, ma a terra asciutta in superficie. I ristagni gli fanno cadere le foglie." },
    { t:"tf", plant:"salvia", q:"La salvia vuole la terra sempre bagnata.", a:false, why:"Come il rosmarino, preferisce terra drenante e poca acqua. Bagnata di continuo marcisce." },
    { t:"mc", plant:"salvia", q:"La salvia in vaso: meglio una terra...", o:["Drenante, anche con un po’ di sabbia","Argillosa e pesante","Sempre allagata"], a:0, why:"Drenante: le radici devono respirare tra un’annaffiatura e l’altra." }
  ]}],
  m3:[{ title:"Potare salvia e limone", items:[
    { t:"mc", plant:"salvia", q:"Quando si pota la salvia?", o:["In primavera, quando riparte, accorciando i rami","In pieno inverno, a raso","Mai, si offende"], a:0, why:"In primavera, togliendo i rami secchi e accorciando gli altri. Senza arrivare al legno vecchio e spoglio." },
    { t:"tf", plant:"salvia", q:"Raccogliere spesso le punte della salvia la aiuta a restare compatta.", a:true, why:"Raccogliere le punte è una piccola potatura: la pianta ramifica. E tu cucini." },
    { t:"mc", plant:"limone", q:"Dalla base del limone spuntano rami dritti e velocissimi, con le spine. Cosa sono?", o:["Polloni del portainnesto, da tagliare","Rami nuovi che faranno limoni giganti","Un regalo della natura da lasciare"], a:0, why:"Spesso il limone è innestato su un’altra pianta: quei rami vengono da lì e gli rubano energie. Si tagliano." },
    { t:"tf", plant:"limone", q:"Il limone va potato a fondo ogni anno per fare frutti.", a:false, why:"Basta una potatura leggera: rami secchi, incrociati e polloni. Troppi tagli, meno fiori." }
  ]}],
  m4:[{ title:"Il limone d’inverno", items:[
    { t:"mc", plant:"limone", q:"D’inverno, al Nord, il limone in vaso...", o:["Va in un posto riparato e luminoso, dove non gela","Resta fuori, è robusto","Va in cantina al buio fino a marzo"], a:0, why:"Teme il gelo ma vuole luce anche d’inverno: veranda, scala luminosa, o vicino al muro e coperto." },
    { t:"tf", plant:"limone", q:"D’inverno il limone va annaffiato come d’estate.", a:false, why:"Con il freddo beve molto meno: troppa acqua fredda nel vaso e le radici soffrono." },
    { t:"tf", plant:"salvia", q:"La salvia sopporta bene il freddo dell’inverno.", a:true, why:"È più rustica del limone: regge il freddo, basta che la terra non resti fradicia." },
    { t:"mc", plant:"salvia", q:"Perché salvia e limone d’inverno si trattano in modo diverso?", o:["Il limone teme il gelo, la salvia lo sopporta","La salvia costa di più","Il limone va in letargo come gli orsi"], a:0, why:"Stessa zona, caratteri diversi: il limone è freddoloso, la salvia no." }
  ]}],
  j1:[{ title:"Il ficus permaloso", items:[
    { t:"mc", plant:"ficus", q:"Dove sta bene il ficus elastica?", o:["In un posto luminoso, senza sole diretto che scotta","Al buio, tanto è robusto","Sul balcone in pieno inverno"], a:0, why:"Luce indiretta e intensa. Al buio si allunga e perde le foglie in basso." },
    { t:"tf", plant:"ficus", q:"Se sposti spesso il ficus, può perdere le foglie per protesta.", a:true, why:"Odia i cambi di luce e di posto: trovagli un angolo buono e lascialo in pace." },
    { t:"id", plant:"ficus", q:"Quale è il ficus elastica?", o:["monstera","ficus","calathea","felce"], a:"ficus", why:"Un fusto dritto con foglie grandi, ovali e lucidissime. E una punta rossa da cui esce la foglia nuova." },
    { t:"mc", plant:"ficus", q:"Le foglie del ficus sono piene di polvere. Perché è un problema?", o:["La polvere ruba luce alla foglia","Gli viene l’allergia","Non è un problema, è vintage"], a:0, why:"La polvere fa da tenda: un panno umido sulle foglie ogni tanto e torna a respirare." }
  ]}],
  j2:[{ title:"Bere dall’aria", items:[
    { t:"tf", plant:"tillandsia", q:"La tillandsia va piantata nel terriccio per sopravvivere.", a:false, why:"Vive senza terra. Nel terriccio sempre umido marcisce." },
    { t:"mc", plant:"tillandsia", q:"Come si annaffia la tillandsia?", o:["Un bagno di 20-30 minuti in acqua, poi ad asciugare capovolta","Una goccia al mese","Si interra e si annaffia la terra"], a:0, why:"Ammollo, poi asciugatura a testa in giù: l’acqua ferma al centro della rosetta la fa marcire." },
    { t:"id", plant:"tillandsia", q:"Riconosci la tillandsia?", o:["felce","orchidea","tillandsia","calathea"], a:"tillandsia", why:"Un ciuffo di foglie argentate e arricciate, senza vaso. Sembra un ragno vegetale (simpatico)." },
    { t:"tf", plant:"tillandsia", q:"Il colore argentato della tillandsia viene da minuscole squame che catturano l’acqua.", a:true, why:"Si chiamano tricomi: sono le sue cannucce. Più è argentata, più ama la luce." }
  ]}],
  j3:[{ title:"Radici che non bevono", items:[
    { t:"mc", plant:"tillandsia", q:"A cosa servono le radici della tillandsia?", o:["Solo ad aggrapparsi","A bere tantissimo","A niente, sono decorative"], a:0, why:"Per bere usa le foglie. Le radici sono ganci per restare attaccata ai rami." },
    { t:"tf", plant:"tillandsia", q:"Tillandsia e orchidea sono epifite: in natura vivono sopra gli alberi.", a:true, why:"Epifita vuol dire che vive sopra un’altra pianta senza rubarle niente: la usa solo come appoggio." },
    { t:"mc", plant:"ficus", q:"Se tagli un ramo del ficus esce un liquido bianco. Cos’è?", o:["Lattice: appiccicoso e irritante, meglio usare i guanti","Latte vegetale da bere","Il segno che è malato"], a:0, why:"È lattice: irrita pelle e occhi. Guanti, e niente esperimenti culinari." },
    { t:"tf", plant:"ficus", q:"In natura, le radici aeree del ficus elastica possono diventare nuovi tronchi.", a:true, why:"Scendono dai rami e diventano colonne. In casa succede di rado, per fortuna del soffitto." }
  ]}],
  j4:[{ title:"Figli e fioriture", items:[
    { t:"tf", plant:"tillandsia", q:"Dopo la fioritura la tillandsia fa dei piccoli figli alla base.", a:true, why:"Crescono attaccati alla madre e diventano piante nuove." },
    { t:"mc", plant:"tillandsia", q:"Quando puoi staccare un figlio della tillandsia?", o:["Quando è grande circa un terzo della madre","Appena spunta","Mai, va lasciato attaccato per sempre"], a:0, why:"Quando è abbastanza grande si stacca con delicatezza. Oppure li lasci insieme e fai un ciuffo enorme." },
    { t:"mc", plant:"ficus", q:"Il ficus perde le foglie in basso, una dopo l’altra. Cosa controlli?", o:["Luce e acqua: spesso è poca luce o terra sempre bagnata","Se ha visto un fantasma","Niente, per lui è autunno"], a:0, why:"Poca luce o troppa acqua sono le cause più comuni. E il trasloco, se l’hai spostato da poco." }
  ]}]
});

// Zona 4: Fiori da balcone
STEPS.push(
  { id:"f1", zone:"z4", title:"Sole e fioriture", icon:"sun", items:[
    { t:"mc", plant:"geranio", q:"Quanto sole vuole il geranio?", o:["Tanto: almeno mezza giornata di sole","Pochissimo, è timido","Solo luce artificiale"], a:0, why:"Più sole, più fiori. All’ombra fa foglie e basta." },
    { t:"tf", plant:"geranio", q:"Il geranio dei balconi in realtà è un Pelargonium.", a:true, why:"Il vero geranio è un’altra pianta, più da prato. Ma ormai lo chiamiamo così tutti." },
    { t:"id", plant:"petunia", q:"Quale è la petunia?", o:["geranio","petunia","ortensia","bouganville"], a:"petunia", why:"Fiori a trombetta, tantissimi, che ricadono dal vaso. E foglie un po’ appiccicose." },
    { t:"mc", plant:"petunia", q:"La petunia in vaso d’estate beve...", o:["Tanto: a volte ogni giorno","Pochissimo, una volta al mese","Solo quando piove"], a:0, why:"In un vaso piccolo e al sole si secca in fretta. D’estate controllala ogni giorno." },
    { t:"tf", plant:"ortensia", q:"L’ortensia vuole sole pieno tutto il giorno.", a:false, why:"Preferisce mezz’ombra: con il sole forte del pomeriggio si affloscia e si brucia." }
  ]},
  { id:"f2", zone:"z4", title:"Fiori a ripetizione", icon:"leaf", items:[
    { t:"mc", plant:"petunia", q:"Perché si tolgono i fiori appassiti della petunia?", o:["Così non fa semi e continua a fiorire","Perché sono brutti e basta","Per darli alle formiche"], a:0, why:"Senza semi da preparare, la pianta investe in fiori nuovi." },
    { t:"tf", plant:"geranio", q:"Anche il geranio fiorisce di più se togli gli steli dei fiori secchi.", a:true, why:"Si stacca tutto lo stelo del fiore appassito: così ne arrivano altri." },
    { t:"mc", q:"Che concime aiuta le piante da fiore?", o:["Uno ricco di potassio, per le fioriture","Solo azoto, per fare tante foglie","Il fondo della moka, a cucchiaiate"], a:0, why:"Il potassio aiuta i fiori, l’azoto spinge le foglie. Per i balconi fioriti c’è il concime per piante da fiore." },
    { t:"tf", plant:"petunia", q:"Le foglie della petunia sono un po’ appiccicose al tatto.", a:true, why:"Sono coperte di peli ghiandolari. Non è sporco, è lei." }
  ]},
  { id:"f3", zone:"z4", title:"Colori che cambiano", icon:"drop", items:[
    { t:"mc", plant:"ortensia", q:"In che terra un’ortensia tende a diventare blu?", o:["Acida","Calcarea","Sabbia di mare"], a:0, why:"Nella terra acida l’alluminio si scioglie e la pianta lo assorbe: i fiori diventano blu." },
    { t:"tf", plant:"ortensia", q:"Tutte le ortensie cambiano colore con la terra.", a:false, why:"Solo alcune, soprattutto quelle colorate. Le ortensie bianche restano bianche, coerenti." },
    { t:"mc", plant:"bouganville", q:"La parte colorata della bouganville è...", o:["Brattee: foglie colorate attorno ai fiori veri","Petali giganti","Frutti a forma di foglia"], a:0, why:"I fiori veri sono i tubetti bianchi al centro. Il colore lo fanno le brattee, come la vela dello spatifillo." },
    { t:"tf", plant:"bouganville", q:"I veri fiori della bouganville sono piccoli e bianchi.", a:true, why:"Piccolissimi, al centro delle brattee colorate. I veri protagonisti, e nessuno li nota." }
  ]},
  { id:"f4", zone:"z4", title:"Inverno e potatura", icon:"pot", items:[
    { t:"mc", plant:"geranio", q:"Come fai passare l’inverno al geranio, al Nord?", o:["In un posto luminoso e fresco, al riparo dal gelo, con pochissima acqua","Fuori sotto la neve, così si fortifica","Vicino al termosifone, annaffiato ogni giorno"], a:0, why:"Luminoso, fresco e riparato, con acqua quasi zero: aspetta la primavera." },
    { t:"tf", plant:"geranio", q:"Il geranio si moltiplica facilmente per talea.", a:true, why:"Un rametto di una decina di centimetri in terra: radica in poche settimane. Gerani gratis per tutti." },
    { t:"mc", plant:"ortensia", q:"Se poti l’ortensia nel momento sbagliato, rischi...", o:["Di tagliare i boccioli dei fiori dell’anno dopo","Che diventi un cactus","Niente, si può tagliare quando vuoi"], a:0, why:"Molte ortensie fioriscono sui rami dell’anno prima: tagliandoli in autunno togli i fiori futuri." },
    { t:"tf", plant:"bouganville", q:"La bouganville sopporta bene il gelo.", a:false, why:"Teme il freddo: sotto lo zero si rovina. Al Nord, d’inverno, va al riparo." }
  ]},
  { id:"f5", zone:"z4", title:"Ripasso", icon:"star", items:[
    { t:"id", plant:"bouganville", q:"Quale è la bouganville?", o:["geranio","ortensia","petunia","bouganville"], a:"bouganville", why:"Rami lunghi e legnosi coperti di brattee fucsia, come carta velina." },
    { t:"mc", plant:"ortensia", q:"Ortensia blu, terra...", o:["Acida","Calcarea","Di Marte"], a:0, why:"Acida. Su Marte non abbiamo dati." },
    { t:"tf", plant:"petunia", q:"Togliere i fiori secchi della petunia la fa fiorire di più.", a:true, why:"Niente semi, più fiori. Funziona sempre." },
    { t:"mc", plant:"geranio", q:"Il geranio dei balconi in realtà è...", o:["Un Pelargonium","Una rosa travestita","Un cactus"], a:0, why:"Pelargonium. Ma continueremo tutti a chiamarlo geranio." },
    { t:"match", q:"Abbina fiore e segreto", pairs:[["Geranio","In realtà è un Pelargonium"],["Petunia","Foglie appiccicose"],["Ortensia","Cambia colore con la terra"],["Bouganville","Il colore è nelle brattee"]] }
  ]}
);
Object.assign(EXTRA, {
  f1:[{ title:"Chi vuole il sole, chi no", items:[
    { t:"mc", plant:"ortensia", q:"Dove metti l’ortensia sul balcone?", o:["In mezz’ombra, magari con il sole solo al mattino","Nel punto più assolato","Dentro casa, al buio"], a:0, why:"Sole del mattino e ombra nel pomeriggio: il suo compromesso ideale." },
    { t:"id", plant:"ortensia", q:"Riconosci l’ortensia?", o:["bouganville","geranio","petunia","ortensia"], a:"ortensia", why:"Grandi palle di fiori, blu o rosa, e foglie larghe seghettate. La nonna ne aveva una, sicuro." },
    { t:"mc", plant:"bouganville", q:"Di cosa ha bisogno la bouganville per fiorire tanto?", o:["Sole pieno e caldo","Ombra e umidità","Musica classica"], a:0, why:"Viene da posti caldi e soleggiati: più sole prende, più si copre di colore." },
    { t:"id", plant:"bouganville", q:"Quale è la bouganville?", o:["ortensia","bouganville","petunia","geranio"], a:"bouganville", why:"Rami lunghi e legnosi, coperti di “fiori” fucsia come carta velina." },
    { t:"tf", plant:"geranio", q:"Il geranio teme i ristagni d’acqua.", a:true, why:"Le sue radici marciscono facilmente: meglio poca acqua che troppa, e mai sottovaso pieno." }
  ]}],
  f2:[{ title:"Tanta sete, poca sete", items:[
    { t:"mc", plant:"ortensia", q:"L’ortensia in vaso d’estate...", o:["Vuole terra sempre umida, a volte acqua ogni giorno","Si annaffia ogni due settimane","Si annaffia solo sulle foglie"], a:0, why:"Assetatissima: con la terra secca si affloscia in poche ore." },
    { t:"tf", plant:"ortensia", q:"Se l’ortensia è afflosciata nel pomeriggio d’estate, è morta.", a:false, why:"Spesso si affloscia per il caldo e si riprende la sera. Controlla la terra: se è secca, acqua; se è umida, ombra." },
    { t:"mc", plant:"bouganville", q:"Come si annaffia la bouganville?", o:["Poco, lasciando asciugare la terra tra una volta e l’altra","Ogni giorno, tanta","Mai"], a:0, why:"Ama il secco: troppa acqua fa foglie e pochi fiori, e rischia di marcire." },
    { t:"tf", plant:"bouganville", q:"Un po’ di sete controllata aiuta la bouganville a fiorire.", a:true, why:"Un leggero stress da secco la spinge a fiorire. Leggero, non abbandono." }
  ]}],
  f3:[{ title:"Foglie che parlano", items:[
    { t:"tf", plant:"geranio", q:"Alcune foglie di geranio hanno una fascia scura a forma di anello.", a:true, why:"Si chiamano gerani zonali proprio per questo: hanno una “zona” più scura sulla foglia." },
    { t:"id", plant:"geranio", q:"Quale è il geranio?", o:["petunia","geranio","bouganville","ortensia"], a:"geranio", why:"Foglie rotonde e vellutate, ciuffi di fiori rossi su steli dritti. Il balcone della nonna, parte due." },
    { t:"mc", plant:"petunia", q:"La petunia ha fusti lunghi e spogli, con pochi fiori in punta. Cosa fai?", o:["La accorci un po’: rifarà rami e fiori","La lasci, è il suo stile","La annaffi il triplo"], a:0, why:"Una spuntatina a metà estate la rinnova: ramifica e rifiorisce." },
    { t:"mc", q:"Un fiore che cambia colore con la terra, un “fiore” che è una foglia. Cosa insegnano?", o:["Che le piante non sono come sembrano: guarda meglio","Che i botanici si annoiano","Niente, è un caso"], a:0, why:"Brattee, terra acida, nomi sbagliati: osservare bene è metà del pollice verde." }
  ]}],
  f4:[{ title:"Annuali e ripartenze", items:[
    { t:"tf", plant:"petunia", q:"La petunia da balcone di solito si coltiva come annuale.", a:true, why:"Si compra in primavera e dura fino all’autunno. Con tanta pazienza può svernare, ma di solito non ne vale la pena." },
    { t:"mc", plant:"bouganville", q:"Come si pota la bouganville?", o:["Dopo la fioritura, accorciando i rami lunghi","Mai, si offende","A zero ogni mese"], a:0, why:"Dopo i fiori si accorciano i rami: rifiorisce sui rami nuovi." },
    { t:"mc", plant:"ortensia", q:"Le teste secche dell’ortensia, in inverno...", o:["Si possono lasciare: proteggono le gemme dal freddo, si tolgono a fine inverno","Vanno tolte a ottobre con tutto il ramo","Diventano blu se le annaffi"], a:0, why:"Fanno da cappotto alle gemme sotto. A fine inverno si tolgono, sopra la prima coppia di gemme buone." },
    { t:"tf", plant:"geranio", q:"D’inverno il geranio al riparo va annaffiato come d’estate.", a:false, why:"A riposo beve pochissimo: troppa acqua al fresco e marcisce." }
  ]}]
});

// ---------- Zona 5: Piante carnivore ----------
// bog:true = pianta "di palude": vuole la torba sempre bagnata (sottovaso pieno), non marcisce mai per troppa acqua
const BOG_FEEL = { feelWet:"Torba bagnata come una palude. Per lei è perfetto.", feelDamp:"Torba bagnata come una palude. Per lei è perfetto.",
  feelReady:"La torba inizia ad asciugarsi: rabbocca il sottovaso con acqua piovana.", feelDry:"Torba secca. Per una pianta di palude è un’emergenza." };
Object.assign(PLANTS, {
  dionea:{ name:"Dionea", g:"f", indoor:false, sci:"Dionaea muscipula, la venere acchiappamosche", cost:40,
    care:{ bog:true, soak:1, thirsty:3, wilt:5, dead:9, rot:99, rule:"Sempre bagnata: vaso in un sottovaso d’acqua piovana o demineralizzata", ...BOG_FEEL,
      dryTip:"Una pianta di palude con la torba secca: in pochi giorni le trappole anneriscono e se ne va.", wetTip:"" }, facts:[
    "Viene dalle paludi della Carolina, negli Stati Uniti.",
    "La trappola scatta solo se tocchi due volte i peli sensibili in pochi secondi.",
    "Vuole acqua piovana o demineralizzata: i sali del rubinetto la avvelenano.",
    "D’inverno va in letargo al fresco: sembra morta, ma riposa."] },
  sarracenia:{ name:"Sarracenia", g:"f", indoor:false, sci:"Sarracenia, la pianta a tromba", cost:40,
    care:{ bog:true, soak:1, thirsty:3, wilt:6, dead:10, rot:99, rule:"Sempre bagnata: sottovaso pieno di acqua piovana", ...BOG_FEEL,
      dryTip:"La sarracenia è una pianta di palude: la torba secca la uccide in fretta.", wetTip:"" }, facts:[
    "Le trappole sono tubi: l’insetto scivola dentro e non riesce più a uscire.",
    "Vuole pieno sole: è così che le trombe si colorano.",
    "Vive in torba bionda povera, senza concime.",
    "D’inverno riposa al fresco e perde parte delle foglie."] },
  drosera:{ name:"Drosera", g:"f", indoor:true, sci:"Drosera capensis, la rosolida", cost:30,
    care:{ bog:true, soak:1, thirsty:2, wilt:4, dead:7, rot:99, rule:"Sempre bagnata: sottovaso pieno di acqua piovana", ...BOG_FEEL,
      dryTip:"Senza acqua la drosera perde le goccioline, poi tutto il resto.", wetTip:"" }, facts:[
    "Cattura gli insetti con goccioline appiccicose sui tentacoli.",
    "Sta bene anche su un davanzale molto luminoso.",
    "Niente concime: i nutrienti li prende dagli insetti.",
    "Con aria troppo secca o poca luce, le goccioline spariscono."] },
  nepenthes:{ name:"Nepenthes", g:"f", indoor:true, sci:"Nepenthes, la pianta delle anfore", cost:45,
    care:{ soak:2, thirsty:4, wilt:8, dead:14, rot:3, rule:"Ogni 3-4 giorni: terriccio umido ma drenante, niente sottovaso pieno",
      dryTip:"La nepenthes vuole il terriccio sempre un po’ umido: secco, smette di fare anfore e poi cede.", wetTip:"La nepenthes è carnivora ma non di palude: con i piedi nell’acqua le radici marciscono." }, facts:[
    "Fa trappole ad anfora che pendono dalle foglie, piene di liquido digestivo.",
    "Viene dalle foreste tropicali: niente letargo, caldo tutto l’anno.",
    "Vuole aria umida e terriccio drenante, non i piedi nell’acqua.",
    "Con poca luce o aria secca smette di fare anfore."] }
});
STEPS.push(
  { id:"c1", zone:"z5", title:"Fame di terra", icon:"leaf", items:[
    { t:"mc", plant:"dionea", q:"Perché le piante carnivore catturano gli insetti?", o:["Per i nutrienti che nella loro terra mancano","Perché non sanno fare la fotosintesi","Per vendetta"], a:0, why:"La terra di palude è povera: gli insetti portano azoto e minerali. La vendetta è un effetto collaterale." },
    { t:"tf", plant:"dionea", q:"Le piante carnivore fanno la fotosintesi, come le altre.", a:true, why:"Certo: l’energia viene dal sole. Gli insetti sono un supplemento, non il pranzo." },
    { t:"id", plant:"dionea", q:"Quale è la dionea?", o:["sarracenia","dionea","drosera","nepenthes"], a:"dionea", why:"Trappole a forma di bocca, rosse dentro, con le ciglia sui bordi. La pianta più famosa del cinema horror botanico." },
    { t:"mc", plant:"dionea", q:"Da dove viene la dionea?", o:["Dalle paludi della Carolina, negli Stati Uniti","Dalla foresta amazzonica","Dal deserto del Sahara"], a:0, why:"Vive solo in una piccola zona di paludi tra North e South Carolina. In natura è rara e protetta." },
    { t:"tf", plant:"dionea", q:"La dionea va nutrita con pezzetti di carne o di prosciutto.", a:false, why:"La carne marcisce nella trappola e la fa annerire. Al massimo piccoli insetti vivi, e di solito fa da sola. Il prosciutto mangialo tu." }
  ]},
  { id:"c2", zone:"z5", title:"Acqua di palude", icon:"drop", items:[
    { t:"tf", plant:"dionea", q:"Per la dionea il sottovaso sempre pieno d’acqua va bene.", a:true, why:"È il metodo del sottovaso: un paio di centimetri d’acqua sempre lì. Per lei la torba asciutta è il vero pericolo." },
    { t:"mc", plant:"dionea", q:"Che acqua vuole la dionea?", o:["Piovana o demineralizzata","Quella del rubinetto, più calcarea possibile","Acqua frizzante, per le bollicine"], a:0, why:"I sali del rubinetto si accumulano nella torba e le bruciano le radici. Piovana, demineralizzata o da osmosi." },
    { t:"tf", plant:"sarracenia", q:"La sarracenia sopporta bene l’acqua calcarea del rubinetto.", a:false, why:"Come la dionea: niente calcare. Acqua piovana o demineralizzata, sempre." },
    { t:"mc", plant:"drosera", q:"La torba della drosera si sta asciugando. Cosa fai?", o:["Riempi il sottovaso con acqua piovana","Aspetti che si secchi del tutto, come per la sansevieria","Le dai acqua del rubinetto con un po’ di concime"], a:0, why:"Piante di palude: la torba deve restare bagnata. La sansevieria qui non fa testo." }
  ]},
  { id:"c3", zone:"z5", title:"Sole e trappole", icon:"sun", items:[
    { t:"mc", plant:"sarracenia", q:"Dove sta bene la sarracenia?", o:["Sul balcone in pieno sole","In un angolo buio del soggiorno","In bagno senza finestre"], a:0, why:"Pieno sole, anche tutto il giorno. Per una carnivora di palude non è mai troppo." },
    { t:"tf", plant:"dionea", q:"Più sole prende, più l’interno delle trappole della dionea diventa rosso.", a:true, why:"Con poca luce le trappole restano verdi e deboli. Il rosso è il segno che sta bene." },
    { t:"mc", plant:"dionea", q:"Cosa succede se fai scattare le trappole della dionea per gioco?", o:["La pianta spreca energia e la trappola può annerire","Diventa più forte","Niente, le piace"], a:0, why:"Ogni chiusura le costa fatica, e una trappola si chiude solo poche volte nella sua vita. Non è un giocattolo (purtroppo)." },
    { t:"tf", plant:"dionea", q:"La trappola della dionea scatta al primo tocco di un solo pelo.", a:false, why:"Servono due tocchi sui peli sensibili in una ventina di secondi: così non spreca energia per una goccia di pioggia." }
  ]},
  { id:"c4", zone:"z5", title:"Il letargo", icon:"pot", items:[
    { t:"tf", plant:"dionea", q:"La dionea va tenuta al caldo in casa tutto l’inverno.", a:false, why:"Ha bisogno di un inverno fresco, più o meno tra 0 e 10 gradi, per riposare. Al caldo tutto l’anno si esaurisce." },
    { t:"mc", plant:"sarracenia", q:"D’inverno la sarracenia ingiallisce e perde foglie. Cosa fai?", o:["Niente di drastico: è il riposo, togli solo le parti secche","La butti","La porti al caldo e la concimi"], a:0, why:"È il letargo. In primavera riparte con trombe nuove." },
    { t:"mc", plant:"dionea", q:"Durante il riposo invernale, la torba della dionea...", o:["Resta umida, con meno acqua nel sottovaso","Si lascia seccare del tutto","Va allagata con acqua calda"], a:0, why:"Riposa, ma non deve seccarsi: torba umida, sottovaso più basso." },
    { t:"tf", plant:"drosera", q:"Le piante carnivore vanno concimate come le altre.", a:false, why:"Il concime nella terra brucia le loro radici: i nutrienti li prendono dagli insetti. Niente concime, mai." }
  ]},
  { id:"c5", zone:"z5", title:"Ripasso", icon:"star", items:[
    { t:"id", plant:"drosera", q:"Quale è la drosera?", o:["dionea","nepenthes","sarracenia","drosera"], a:"drosera", why:"Foglie lunghe coperte di tentacoli con goccioline lucide. Sembrano rugiada, sono colla." },
    { t:"mc", plant:"dionea", q:"Acqua per la dionea:", o:["Piovana o demineralizzata","Del rubinetto","Minerale gassata"], a:0, why:"Niente sali, niente calcare. Sempre." },
    { t:"tf", plant:"sarracenia", q:"La sarracenia vuole pieno sole.", a:true, why:"Sole pieno: trombe dritte e colorate." },
    { t:"mc", plant:"nepenthes", q:"Quale di queste carnivore NON vuole i piedi nell’acqua?", o:["La nepenthes","La dionea","La sarracenia"], a:0, why:"La nepenthes viene dalla foresta, non dalla palude: terriccio umido ma drenante." },
    { t:"match", q:"Abbina carnivora e trappola", pairs:[["Dionea","Tagliola"],["Drosera","Colla"],["Sarracenia","Tubo scivoloso"],["Nepenthes","Anfora appesa"]] }
  ]}
);
Object.assign(EXTRA, {
  c1:[{ title:"Le trappole", items:[
    { t:"mc", plant:"drosera", q:"Come cattura gli insetti la drosera?", o:["Con goccioline appiccicose sui tentacoli","Con una tagliola che scatta","Rincorrendoli"], a:0, why:"L’insetto si incolla, i tentacoli si piegano piano piano e lo avvolgono." },
    { t:"id", plant:"drosera", q:"Riconosci la drosera?", o:["nepenthes","drosera","dionea","sarracenia"], a:"drosera", why:"Foglie lunghe e sottili, piene di tentacoli con una goccia lucida in punta." },
    { t:"mc", plant:"sarracenia", q:"Come funziona la trappola della sarracenia?", o:["È un tubo: l’insetto scivola dentro e non riesce più a uscire","Morde","Spara spine"], a:0, why:"Il bordo è scivoloso e dentro i peli puntano verso il basso: si entra, non si esce." },
    { t:"tf", plant:"nepenthes", q:"La nepenthes fa trappole ad anfora che pendono dalle foglie.", a:true, why:"Ogni anfora nasce in punta a una foglia, appesa a un viticcio. Dentro c’è un liquido che digerisce." },
    { t:"id", plant:"sarracenia", q:"Quale è la sarracenia?", o:["sarracenia","nepenthes","drosera","dionea"], a:"sarracenia", why:"Trombe dritte con un cappuccio in cima, spesso venate di rosso." }
  ]}],
  c2:[{ title:"Non sono tutte uguali", items:[
    { t:"tf", plant:"nepenthes", q:"Anche la nepenthes va tenuta con il vaso in un sottovaso sempre pieno.", a:false, why:"Con i piedi nell’acqua le sue radici marciscono. Terriccio umido ma drenante." },
    { t:"mc", plant:"nepenthes", q:"Cosa vuole la nepenthes?", o:["Terriccio umido ma drenante, e aria umida","Piedi sempre in acqua","Sole del deserto e acqua una volta al mese"], a:0, why:"Foresta tropicale: umidità nell’aria, terra che respira." },
    { t:"id", plant:"nepenthes", q:"Quale è la nepenthes?", o:["drosera","sarracenia","nepenthes","dionea"], a:"nepenthes", why:"Foglie lunghe e, appese ai viticci, le anfore con il coperchio." },
    { t:"tf", plant:"nepenthes", q:"Le anfore della nepenthes contengono un liquido che digerisce gli insetti.", a:true, why:"Il liquido lo produce la pianta: chi ci cade dentro non ne esce più." }
  ]}],
  c3:[{ title:"Luce per tutte", items:[
    { t:"mc", plant:"drosera", q:"Dove metti una drosera in casa?", o:["Sul davanzale più luminoso, anche con un po’ di sole","In corridoio","In cantina"], a:0, why:"Più luce ha, più goccioline fa. Al buio smette di cacciare." },
    { t:"mc", plant:"nepenthes", q:"La nepenthes non fa più anfore. Cosa le manca, di solito?", o:["Luce e umidità","Carne","Musica classica"], a:0, why:"Con poca luce o aria secca smette di fare anfore e fa solo foglie. La musica è facoltativa." },
    { t:"tf", plant:"drosera", q:"Le goccioline della drosera spariscono se l’aria è troppo secca o la luce troppo poca.", a:true, why:"Senza goccioline non caccia: è il suo modo di dirti che qualcosa non va." },
    { t:"mc", q:"Perché le trappole di molte carnivore sono rosse?", o:["Il colore aiuta ad attirare gli insetti, e col sole si accende","Perché sono arrabbiate","Perché è sangue"], a:0, why:"Rosso e nettare fanno da insegna luminosa. Col sole pieno l’insegna si accende di più." }
  ]}],
  c4:[{ title:"Vasi e torba", items:[
    { t:"mc", plant:"sarracenia", q:"In che terra si coltiva la sarracenia?", o:["Torba bionda con perlite o sabbia silicea","Terriccio universale concimato","Terra del giardino"], a:0, why:"Povera e acida, come la palude da cui viene." },
    { t:"tf", plant:"dionea", q:"Il terriccio universale va bene per la dionea.", a:false, why:"Ha concime e sali: le brucia le radici. Torba bionda e perlite, nient’altro." },
    { t:"mc", plant:"nepenthes", q:"In che vaso sta bene la nepenthes?", o:["Un vaso appeso, così le anfore pendono libere","Un sottovaso sempre allagato","Un barattolo di vetro chiuso"], a:0, why:"Le anfore pendono dalle foglie: un vaso appeso le lascia libere. E il terriccio deve drenare." },
    { t:"tf", plant:"nepenthes", q:"La nepenthes va in letargo d’inverno, come la dionea.", a:false, why:"Viene dai tropici: niente letargo, vuole caldo tutto l’anno." }
  ]}]
});

// ---------- Zone 6-8: domande difficili (lv 3) su piante già fatte + piante nuove rare (lv 2) ----------
// gate = titolo di esperto da avere sulla "cugina facile" per poter piantare questa
Object.assign(PLANTS, {
  alocasia:{ name:"Alocasia", g:"f", indoor:true, sci:"Alocasia, l’orecchio di elefante", cost:50, gate:{ plant:"monstera", grade:1 },
    care:{ soak:3, thirsty:6, wilt:10, dead:18, rot:2, rule:"Quando i primi centimetri sono asciutti: terra che drena, mai zuppa",
      dryTip:"L’alocasia regge poco la terra secca: le foglie si accartocciano e cadono.", wetTip:"L’alocasia è una diva: terra zuppa e le radici marciscono in fretta." }, facts:[
    "È cugina della monstera: foglie enormi a freccia, venature chiare.",
    "Le gocce sulle punte al mattino (guttazione) dicono che stai annaffiando un po’ troppo.",
    "D’inverno può perdere foglie e quasi sparire: il rizoma sotto terra è vivo.",
    "Irritante se masticata: lontana da cani e gatti."] },
  fittonia:{ name:"Fittonia", g:"f", indoor:true, sci:"Fittonia, la pianta mosaico", cost:35, gate:{ plant:"spatifillo", grade:1 },
    care:{ soak:1, thirsty:2, wilt:3, dead:6, rot:3, rule:"Ogni 2-3 giorni: terra sempre leggermente umida",
      dryTip:"La fittonia crolla al primo segno di sete. Una volta sì, dieci volte no.", wetTip:"Umida sì, zuppa no: anche la fittonia marcisce nell’acqua ferma." }, facts:[
    "Foglie a mosaico con venature bianche o rosa.",
    "Se ha sete crolla tutta, poi si rialza dopo l’acqua.",
    "Ama l’aria umida: in un terrario sta benissimo.",
    "Il sole diretto le brucia le foglie."] },
  maranta:{ name:"Maranta", g:"f", indoor:true, sci:"Maranta leuconeura, la pianta della preghiera", cost:40, gate:{ plant:"calathea", grade:1 },
    care:{ soak:2, thirsty:4, wilt:7, dead:12, rot:3, rule:"Ogni 3-4 giorni: terra sempre leggermente umida, acqua poco calcarea",
      dryTip:"Terra secca e la maranta arrotola le foglie come una pergamena.", wetTip:"Anche la maranta, come la calathea, soffre con le radici a mollo." }, facts:[
    "È cugina della calathea, e il soprannome “pianta della preghiera” in origine è suo.",
    "La sera alza le foglie come mani giunte.",
    "Punte secche: aria secca o acqua troppo calcarea.",
    "Luce indiretta: il sole diretto sbiadisce i disegni."] },
  begonia:{ name:"Begonia maculata", g:"f", indoor:true, sci:"Begonia maculata, la begonia a pois", cost:45, gate:{ plant:"felce", grade:1 },
    care:{ soak:3, thirsty:5, wilt:9, dead:16, rot:2, rule:"Quando i primi centimetri sono asciutti, senza bagnare le foglie",
      dryTip:"La begonia a pois perde le foglie se la terra resta secca a lungo.", wetTip:"Il fusto della begonia marcisce alla base con la terra zuppa." }, facts:[
    "Foglie verde scuro con pois argentati e retro rosso.",
    "Niente acqua sulle foglie: rischia l’oidio, una muffa bianca.",
    "Umidità sì, ma intorno: altre piante vicine o argilla espansa bagnata.",
    "Si moltiplica per talea di fusto con un nodo."] },
  echeveria:{ name:"Echeveria", g:"f", indoor:false, sci:"Echeveria, la rosa di pietra", cost:40, gate:{ plant:"sansevieria", grade:1 },
    care:{ soak:6, thirsty:12, wilt:24, dead:40, rot:2, rule:"A fondo, solo quando la terra è asciutta fino in fondo",
      feelReady:"Asciutta fino in fondo. Adesso sì: acqua a fondo, senza bagnare la rosetta.",
      dryTip:"Anche le grasse hanno un limite: foglie raggrinzite, poi niente.", wetTip:"Acqua ferma nella rosetta o terra sempre umida: l’echeveria marcisce dal centro." }, facts:[
    "Viene dalle zone aride del Messico.",
    "In casa si “fila”: si allunga verso la finestra per cercare luce.",
    "La polverina chiara (pruina) la protegge dal sole: non va pulita.",
    "Si annaffia col metodo “bagna e asciuga”."] },
  haworthia:{ name:"Haworthia", g:"f", indoor:true, sci:"Haworthia, la piccola zebra", cost:35, gate:{ plant:"zamioculcas", grade:1 },
    care:{ soak:6, thirsty:12, wilt:24, dead:40, rot:2, rule:"A fondo, solo quando la terra è asciutta fino in fondo",
      feelReady:"Asciutta fino in fondo. Adesso sì: acqua a fondo.",
      dryTip:"Anche l’haworthia, dopo settimane di secco, si raggrinzisce.", wetTip:"Terra sempre umida: le radici dell’haworthia marciscono in silenzio." }, facts:[
    "Piccola succulenta a rosetta, spesso con strisce bianche in rilievo.",
    "In natura vive all’ombra di rocce e cespugli: ama la luce indiretta.",
    "Al sole cocente diventa rossastra e soffre.",
    "Si moltiplica staccando i figli alla base."] },
  mammillaria:{ name:"Mammillaria", g:"f", indoor:true, sci:"Mammillaria, il cactus a cuscino", cost:40, gate:{ plant:"ficodindia", grade:1 },
    care:{ soak:8, thirsty:16, wilt:32, dead:55, rot:2, rule:"D’estate a fondo quando è asciutto, d’inverno quasi niente",
      feelReady:"Terriccio asciutto fino in fondo: d’estate è il momento di un’annaffiatura vera.",
      dryTip:"Il cactus resiste, ma un vaso secco per mesi in estate è troppo anche per lui.", wetTip:"Base molle e scura: marciume. Nei cactus l’acqua in più non perdona." }, facts:[
    "Piccolo cactus tondo che in primavera si fa una corona di fiori.",
    "Per fiorire vuole un inverno fresco e quasi senz’acqua.",
    "Terriccio per cactacee, molto drenante.",
    "D’estate cresce e beve, d’inverno riposa."] },
  lithops:{ name:"Lithops", g:"m", indoor:true, sci:"Lithops, il sasso vivente", cost:60, gate:{ plant:"ficodindia", grade:2 },
    care:{ soak:14, thirsty:25, wilt:45, dead:70, rot:2, rule:"Pochissima e solo in certi periodi: spesso il segreto è non annaffiare",
      feelReady:"Asciutto da tanto. Solo se non sta facendo foglie nuove, un po’ d’acqua.",
      dryTip:"Il lithops resiste a tutto, quasi: dopo mesi di secco totale si accartoccia.", wetTip:"Troppa acqua: il lithops si gonfia, si spacca e marcisce." }, facts:[
    "Due foglie carnose unite, colorate come i sassi del deserto: mimetismo.",
    "Quando fa foglie nuove, quelle vecchie si svuotano per nutrirle: non va annaffiato.",
    "Se si gonfia e la pelle si spacca, ha avuto troppa acqua.",
    "Vuole tanta luce, anche sole diretto."] },
  gardenia:{ name:"Gardenia", g:"f", indoor:false, sci:"Gardenia jasminoides, la gardenia", cost:55, gate:{ plant:"ortensia", grade:1 },
    care:{ soak:2, thirsty:4, wilt:7, dead:13, rot:3, rule:"Ogni 3-4 giorni: terra acida sempre leggermente umida, acqua non calcarea",
      dryTip:"Terra secca e la gardenia lascia cadere boccioli e foglie.", wetTip:"Umida sì, fradicia no: anche la gardenia ha radici che respirano." }, facts:[
    "Fiori bianchi dal profumo fortissimo.",
    "Vuole terriccio acido e acqua non calcarea.",
    "Sbalzi di temperatura o spostamenti le fanno cadere i boccioli.",
    "Foglie gialle con venature verdi: manca ferro."] },
  kumquat:{ name:"Kumquat", g:"m", indoor:false, sci:"Citrus japonica, il mandarino cinese", cost:50, gate:{ plant:"limone", grade:1 },
    care:{ soak:3, thirsty:5, wilt:10, dead:20, rot:2, rule:"Ogni 3-5 giorni d’estate, quando la superficie è asciutta",
      dryTip:"Come il limone, in vaso il kumquat si secca in fretta.", wetTip:"Ristagni d’acqua: il kumquat perde le foglie come il limone." }, facts:[
    "I frutti si mangiano interi, con la buccia: dolce fuori, aspro dentro.",
    "Regge il freddo meglio del limone, ma non le gelate forti.",
    "Stesse manie degli agrumi: sole, acqua non calcarea, niente ristagni.",
    "Foglie gialle con venature verdi: concime con ferro."] },
  cephalotus:{ name:"Cephalotus", g:"m", indoor:true, sci:"Cephalotus follicularis, l’anfora australiana", cost:70, gate:{ plant:"dionea", grade:2 },
    care:{ soak:1, thirsty:3, wilt:5, dead:9, rot:5, rule:"Torba sempre umida, acqua piovana: poca acqua nel sottovaso, non allagato",
      feelWet:"Torba bagnata. Per lui va bene, basta che non resti allagata a lungo.", feelDamp:"Torba umida, come piace a lui.",
      feelReady:"La torba inizia ad asciugarsi: un po’ di acqua piovana.", feelDry:"Torba secca: per una carnivora è un’emergenza.",
      dryTip:"Torba secca: il cephalotus non perdona.", wetTip:"Anche il cephalotus, a mollo per settimane, finisce per marcire." }, facts:[
    "Viene da un angolo minuscolo dell’Australia occidentale.",
    "Fa piccole anfore pelose con il coperchio, come una nepenthes in miniatura.",
    "Torba umida e acqua piovana, ma senza stare sempre allagato.",
    "Più luce riceve, più le anfore diventano rosso scuro."] },
  vanda:{ name:"Vanda", g:"f", indoor:true, noPot:true, sci:"Vanda, l’orchidea a radice nuda", cost:70, gate:{ plant:"orchidea", grade:2 },
    care:{ soak:1, thirsty:2, wilt:4, dead:8, rot:4, rule:"Radici immerse spesso, d’estate anche ogni giorno, poi all’aria",
      feelWet:"Radici verdi e bagnate: ha appena bevuto.", feelDamp:"Radici verdi e bagnate: ha appena bevuto.",
      feelReady:"Radici argentate: è ora di un bagno.", feelDry:"Radici secche e foglie raggrinzite. Bagno, subito.",
      dryTip:"Radici nude e secche per giorni: la vanda si arrende.", wetTip:"Radici sempre bagnate e senz’aria: marciscono anche quelle della vanda." }, facts:[
    "Orchidea dai fiori enormi, spesso blu-viola.",
    "Si coltiva a radice nuda, in un cesto o in un vaso di vetro vuoto.",
    "Vuole più luce della phalaenopsis.",
    "D’estate le radici si immergono anche ogni giorno."] }
});
const lv = (n, items) => items.map(it => ({ lv:n, ...it }));
STEPS.push(
  { id:"d1", zone:"z6", title:"Foglie che parlano", icon:"leaf", items:lv(3, [
    { t:"mc", plant:"pothos", q:"Il pothos fa foglie nuove sempre più piccole, distanziate sul fusto e tutte verdi. La causa più probabile?", o:["Troppo poca luce","Troppa acqua","Troppo concime"], a:0, why:"Foglie piccole, fusto allungato e striature sparite: sta cercando luce. Più luce indiretta e una spuntatina." },
    { t:"mc", plant:"calathea", q:"Calathea con i bordi marroni, terra umida al punto giusto, vicina al termosifone. Cosa cambi per prima cosa?", o:["La allontani dal termosifone e alzi l’umidità intorno","La annaffi di più","La metti al sole"], a:0, why:"La terra è a posto: il problema è l’aria secca e calda. Cambiare l’acqua non serve." },
    { t:"mc", plant:"monstera", q:"Monstera con foglie gialle che partono dal basso, terra fradicia e odore di stantio dal vaso. Cosa sospetti?", o:["Marciume delle radici per troppa acqua","Poca luce","Fame di concime"], a:0, why:"Terra fradicia e cattivo odore: radici marce. Si controllano, si tolgono quelle molli, terra nuova e meno acqua." },
    { t:"tf", plant:"ficus", q:"Il ficus perde foglie dopo il trasloco in un angolo più luminoso: va riportato subito al posto vecchio.", a:false, why:"Si sta adattando: spostarlo ancora lo stressa di più. Se il posto nuovo è buono, pazienza." },
    { t:"mc", plant:"spatifillo", q:"Spatifillo con punte marroni e croccanti, ma non si affloscia mai. La causa più probabile?", o:["Aria secca o sali nell’acqua","Sete grave","Troppa luce della luna"], a:0, why:"Con la sete si affloscerebbe. Punte secche senza crolli: aria secca o sali accumulati dall’acqua del rubinetto." }
  ])},
  { id:"d2", zone:"z6", title:"Acqua: casi difficili", icon:"drop", items:lv(3, [
    { t:"mc", plant:"sansevieria", q:"Sansevieria in un vaso enorme di plastica, d’inverno. I primi centimetri sono asciutti. Annaffi?", o:["Non ancora: in un vaso grande la terra in profondità resta umida a lungo","Sì, la regola dei primi centimetri vale sempre","Sì, e abbondante"], a:0, why:"Per chi accumula acqua conta la terra in profondità. D’inverno ancora di più." },
    { t:"mc", plant:"orchidea", q:"Nel vaso trasparente le radici dell’orchidea sono verdi e lucide. Annaffi?", o:["No: verdi vuol dire che hanno ancora acqua","Sì, subito","Sì, con un cubetto di ghiaccio"], a:0, why:"Si annaffia quando sono argentate. Verdi significa ancora idratate." },
    { t:"mc", plant:"menta", q:"Menta in pieno sole a luglio, in un vaso piccolo: si affloscia ogni pomeriggio anche se la annaffi al mattino. La soluzione migliore?", o:["Un vaso più grande, o ombra nel pomeriggio","Annaffiarla tre volte al giorno","Tagliarla a raso"], a:0, why:"Vaso piccolo e sole forte: poca terra non trattiene abbastanza acqua. Più terra, o meno sole pomeridiano." },
    { t:"tf", plant:"zamioculcas", q:"Se la zamioculcas ha gli steli molli alla base, va annaffiata di più per farla riprendere.", a:false, why:"Steli molli alla base sono marciume da troppa acqua: si controllano i rizomi, si tolgono le parti marce e si lascia asciugare." },
    { t:"mc", plant:"basilico", q:"Basilico con foglie basse gialle, terra sempre bagnata e sottovaso pieno. Cosa fai?", o:["Svuoti il sottovaso e lasci asciugare la superficie prima di annaffiare","Concimi di più","Lo sposti all’ombra"], a:0, why:"Radici a mollo: il basilico vuole terra fresca, non palude." }
  ])},
  { id:"d3", zone:"z6", title:"Luce: casi difficili", icon:"sun", items:lv(3, [
    { t:"mc", plant:"monstera", q:"Monstera vicino a una finestra a nord: foglie grandi ma senza buchi, piccioli lunghissimi. Cosa le manca?", o:["Luce: la finestra a nord non basta","Acqua","Un vaso più piccolo"], a:0, why:"Piccioli lunghi e foglie intere: cerca luce. Serve una finestra più luminosa, senza sole diretto." },
    { t:"tf", plant:"calathea", q:"Una calathea davanti a una finestra a sud, senza tenda, sta benissimo perché ha tanta luce.", a:false, why:"Il sole diretto da sud brucia e sbiadisce le foglie: tenda o qualche metro di distanza." },
    { t:"mc", plant:"zamioculcas", q:"Hai solo un corridoio con la luce di una finestra lontana. Quale di queste ci sopravvive?", o:["La zamioculcas","Il basilico","La lavanda"], a:0, why:"Tra queste, solo la zamioculcas tollera la poca luce. Le altre due lì dentro si spengono." },
    { t:"mc", plant:"spatifillo", q:"Spatifillo sano, foglie belle, ma non fiorisce da un anno. Cosa provi?", o:["Più luce, sempre indiretta","Meno acqua possibile","Tagliare tutte le foglie"], a:0, why:"Fiorisce anche in mezz’ombra, ma con troppo poca luce smette. Un posto più luminoso di solito basta." },
    { t:"tf", plant:"orchidea", q:"Foglie dell’orchidea verde scuro e lucidissime sono sempre il segno di una luce perfetta.", a:false, why:"Un verde molto scuro spesso vuol dire poca luce. Un verde più chiaro, quasi oliva, è più vicino all’ideale." }
  ])},
  { id:"d4", zone:"z6", title:"Coinquilini indesiderati", icon:"pot", items:lv(3, [
    { t:"mc", plant:"calathea", q:"Sotto le foglie della calathea vedi ragnatele sottilissime e puntini che si muovono. Chi è?", o:["Il ragnetto rosso: ama l’aria secca","La cocciniglia","Il moscerino della frutta"], a:0, why:"Il ragnetto rosso adora l’aria secca. Si lavano le foglie e si alza l’umidità." },
    { t:"mc", plant:"pothos", q:"Batuffoli bianchi e cotonosi all’attaccatura delle foglie del pothos. Cosa sono?", o:["Cocciniglia cotonosa","Muffa buona","Semi"], a:0, why:"Si tolgono con un cotton fioc imbevuto di alcol e si controlla spesso, anche le piante vicine." },
    { t:"mc", plant:"spatifillo", q:"Moscerini neri che volano intorno al vaso dello spatifillo. Cosa li attira?", o:["La terra sempre bagnata in superficie","La luce","Le foglie lucide"], a:0, why:"Sono moscerini del terriccio: depongono nella terra umida. Lasciare asciugare la superficie li scoraggia." },
    { t:"tf", plant:"basilico", q:"Gli afidi sul basilico si tolgono bene con un getto d’acqua e un po’ di sapone molle.", a:true, why:"Sapone molle e acqua, ripetuti per qualche giorno. Poi si lava bene prima di mangiarlo." },
    { t:"mc", plant:"felce", q:"Squame marroni sotto le fronde della felce, sparse e NON in file: si staccano con l’unghia. Cosa sono?", o:["Cocciniglie","Spore","Sporco"], a:0, why:"Le spore stanno in file ordinate. Sparse e staccabili con l’unghia: cocciniglie." }
  ])},
  { id:"d5", zone:"z6", title:"Ripasso", icon:"star", items:lv(3, [
    { t:"mc", plant:"alocasia", q:"Alocasia con gocce sulle punte, foglie basse gialle e terra sempre bagnata. Diagnosi?", o:["Troppa acqua","Troppa luce","Troppo freddo secco"], a:0, why:"Gocce sulle punte e terra fradicia: le sta arrivando più acqua di quanta ne usi." },
    { t:"mc", plant:"fittonia", q:"Fittonia e spatifillo hanno in comune che...", o:["Crollano quando hanno sete e si rialzano dopo l’acqua","Vogliono il sole pieno","Sono carnivori"], a:0, why:"Due drammatici dello stesso livello. Si riprendono, ma ogni crollo li stressa." },
    { t:"tf", plant:"maranta", q:"Una maranta che alza le foglie la sera ha qualcosa che non va.", a:false, why:"È il suo movimento naturale: la sera “prega”, al mattino si riapre." },
    { t:"mc", plant:"begonia", q:"Begonia con macchie bianche polverose sulle foglie. Cosa è, e perché?", o:["Oidio, un fungo: aria ferma e foglie bagnate","Pois nuovi","Sale"], a:0, why:"Si tolgono le foglie colpite, più aria intorno e niente acqua sulle foglie." },
    { t:"match", q:"Abbina diva e capriccio", pairs:[["Alocasia","Odia l’acqua in eccesso"],["Fittonia","Crolla se ha sete"],["Maranta","Prega la sera"],["Begonia","Niente acqua sulle foglie"]] }
  ])},
  { id:"g1", zone:"z7", title:"Il sole degli estremi", icon:"sun", items:lv(3, [
    { t:"mc", plant:"lavanda", q:"Lavanda in vaso su un balcone a est: fiorisce poco e si allunga. Cosa le manca?", o:["Ore di sole: a est ne prende troppo poche","Acqua","Concime con tanto azoto"], a:0, why:"Il sole del mattino non basta: vuole pieno sole per gran parte del giorno." },
    { t:"mc", plant:"olivo", q:"Olivo in vaso: a fine inverno perde foglie dopo mesi in casa vicino al termosifone. Causa probabile?", o:["Caldo secco e poca luce in casa","Troppo freddo","Troppa potatura"], a:0, why:"D’inverno vuole fresco e luce, non il salotto riscaldato." },
    { t:"tf", plant:"rosmarino", q:"Rosmarino che ingiallisce dal basso, in un vaso senza foro e con la terra che puzza: basta annaffiarlo meno da oggi.", a:false, why:"Le radici sono già marce: serve un vaso col foro e terra drenante, togliendo le radici molli. Meno acqua da sola non basta." },
    { t:"mc", plant:"geranio", q:"Geranio con i bordi delle foglie rossi a fine autunno. Cosa sta succedendo?", o:["Reagisce al freddo: è ora di metterlo al riparo","Ha troppa acqua","Sta per fiorire"], a:0, why:"Il freddo colora le foglie di rosso: è il segnale che serve un riparo." },
    { t:"mc", plant:"bouganville", q:"Bouganville piena di foglie e rami lunghi, ma nessuna brattea colorata. Concime giusto?", o:["Meno azoto, più potassio, e più sole","Più azoto per spingere la crescita","Nessun cambio, aspetti"], a:0, why:"L’azoto spinge le foglie, il potassio i fiori. E senza sole pieno niente colore." }
  ])},
  { id:"g2", zone:"z7", title:"Bere poco, ma bene", icon:"drop", items:lv(3, [
    { t:"tf", plant:"sansevieria", q:"Per la sansevieria è meglio un goccio d’acqua ogni giorno che un’annaffiatura abbondante ogni tre settimane.", a:false, why:"Il goccio quotidiano bagna solo la superficie: radici deboli e marciume. Meglio a fondo e di rado." },
    { t:"mc", plant:"ficodindia", q:"Fico d’India con una pala molle e giallastra alla base, dopo un autunno piovoso all’aperto. Cosa fai?", o:["Togli la pala marcia, lo ripari dalla pioggia e niente acqua per un po’","Lo annaffi per tirarlo su","Lo poti tutto"], a:0, why:"Freddo e pioggia insieme: marciume. Via la parte molle, riparo e asciutto." },
    { t:"mc", plant:"salvia", q:"Salvia in vaso con le foglie che anneriscono dal basso dopo settimane di pioggia. Cosa fai?", o:["La metti al riparo dalla pioggia e controlli il drenaggio","La annaffi di più","La concimi"], a:0, why:"Troppa acqua, non troppo poca: riparo e terra che drena." },
    { t:"mc", plant:"limone", q:"Limone in vaso che perde foglie verdi all’improvviso: terra bagnata da giorni e sottovaso pieno. Cosa fai?", o:["Svuoti il sottovaso e aspetti che la superficie asciughi","Concimi con il ferro","Lo sposti al buio"], a:0, why:"Le radici soffocano nell’acqua ferma: il limone risponde lasciando cadere le foglie." },
    { t:"mc", plant:"zamioculcas", q:"Zamioculcas con foglioline gialle una dopo l’altra, ma i rizomi sono sodi e la terra è asciutta da più di un mese. Cosa le manca?", o:["Acqua: anche lei ha un limite","Meno acqua","Un vaso senza foro"], a:0, why:"Rizomi sodi: niente marciume. Più di un mese di secco è tanto anche per lei: una bella annaffiatura, poi di nuovo asciutto." }
  ])},
  { id:"g3", zone:"z7", title:"Spine e funghi", icon:"leaf", items:lv(3, [
    { t:"mc", plant:"ficodindia", q:"Hai toccato il fico d’India e hai le dita piene di spine invisibili. Cosa usi?", o:["Nastro adesivo, da attaccare e staccare","Strofinare forte con le mani","Acqua calda e sapone"], a:0, why:"I glochidi si incastrano nella pelle: il nastro adesivo li porta via. Strofinare li spinge dentro." },
    { t:"tf", plant:"lavanda", q:"D’inverno la lavanda in vaso soffre più per l’umidità che per il freddo.", a:true, why:"Il freddo lo regge. Terra fredda e bagnata per settimane, no." },
    { t:"mc", plant:"olivo", q:"Vuoi ridurre l’altezza del tuo olivo in vaso. Quando lo poti?", o:["A fine inverno, quando il gelo è passato","In pieno agosto","Durante una gelata"], a:0, why:"A fine inverno la pianta sta per ripartire e il rischio di gelo è passato." },
    { t:"mc", plant:"rosmarino", q:"Rosmarino con una polvere bianca sulle foglie, stretto tra altri vasi senza aria. Cosa fai?", o:["Più spazio e aria tra i vasi, e togli le parti colpite","Più acqua","Lo copri con un sacchetto"], a:0, why:"È oidio, un fungo che ama l’aria ferma. Serve circolazione d’aria." },
    { t:"mc", plant:"geranio", q:"Geranio con boccioli bucati e una larvetta dentro. Chi è il colpevole più probabile?", o:["La farfalla del geranio, arrivata dal Sud Africa","Un afide","Una cocciniglia"], a:0, why:"Le sue larve scavano boccioli e steli. Si tolgono le parti colpite e si controlla spesso: sui balconi italiani è comunissima." }
  ])},
  { id:"g4", zone:"z7", title:"Radici e rinvasi", icon:"pot", items:lv(3, [
    { t:"mc", plant:"limone", q:"Limone con foglie accartocciate e appiccicose, e formiche che salgono sul tronco. Chi c’è?", o:["Afidi o cocciniglie: le formiche raccolgono la loro melata","Le formiche mangiano le foglie","È normale in estate"], a:0, why:"Le formiche “allevano” afidi e cocciniglie per la melata. Elimini i parassiti e le formiche se ne vanno." },
    { t:"mc", plant:"salvia", q:"Salvia dopo tre anni: tutta legno, foglie solo in punta. Come la ringiovanisci?", o:["Fai talee dalle punte e riparti con piante giovani","La tagli a raso sul legno","Impossibile, si butta"], a:0, why:"Dal legno vecchio ributta poco: le talee sono il modo più sicuro per ripartire." },
    { t:"tf", plant:"bouganville", q:"Rinvasare spesso la bouganville in vasi sempre più grandi la fa fiorire di più.", a:false, why:"Con le radici un po’ strette fiorisce meglio: si rinvasa solo quando serve davvero." },
    { t:"mc", plant:"sansevieria", q:"Sansevieria con foglie che si piegano e si afflosciano a metà. Le due cause più probabili?", o:["Poca luce, o radici marce per troppa acqua","Troppo sole e troppo concime","Freddo e vento"], a:0, why:"Al buio le foglie crescono deboli; con le radici marce non stanno più su. Si controllano luce e radici." },
    { t:"mc", plant:"lavanda", q:"Lavanda rinvasata in terriccio universale ricco: dopo un mese ingiallisce. Perché?", o:["Terra troppo ricca e che trattiene acqua: vuole terra povera e drenante","Le manca il concime","Vuole terriccio acido"], a:0, why:"La lavanda vive in terre povere e sassose: il terriccio ricco e umido la fa soffrire." }
  ])},
  { id:"g5", zone:"z7", title:"Ripasso", icon:"star", items:lv(3, [
    { t:"mc", plant:"echeveria", q:"Echeveria: foglie basse molli e traslucide, terra bagnata. Cosa fai?", o:["Togli le foglie molli, lasci asciugare e annaffi molto meno","Annaffi di più","La concimi"], a:0, why:"Foglie traslucide e molli sono il primo segno di marciume da acqua." },
    { t:"tf", plant:"haworthia", q:"Haworthia ed echeveria si trattano esattamente allo stesso modo.", a:false, why:"L’acqua sì, la luce no: l’haworthia preferisce luce indiretta, l’echeveria vuole sole." },
    { t:"mc", plant:"lithops", q:"Qual è l’errore più comune con i lithops?", o:["Annaffiarli troppo","Dargli troppo sole","Parlargli"], a:0, why:"Sopravvivono a quasi tutto, tranne all’affetto liquido." },
    { t:"mc", plant:"mammillaria", q:"Una mammillaria tenuta al caldo e annaffiata tutto l’inverno...", o:["Difficilmente fiorirà, e rischia di marcire","Fiorirà il doppio","Diventerà un fico d’India"], a:0, why:"Per fiorire le serve il riposo: fresco e asciutto." },
    { t:"match", q:"Abbina grassa e segreto", pairs:[["Echeveria","La pruina non si tocca"],["Haworthia","Preferisce luce indiretta"],["Mammillaria","Inverno fresco e asciutto"],["Lithops","Spesso non annaffiare"]] }
  ])},
  { id:"h1", zone:"z8", title:"Acidofile e capricci", icon:"drop", items:lv(3, [
    { t:"mc", plant:"ortensia", q:"Ortensia blu che dopo un anno di acqua molto calcarea diventa viola-rosa. Se la vuoi blu, cosa fai?", o:["Acqua meno calcarea e terriccio per acidofile, con un prodotto per ortensie blu","Più sole","Concime per cactus"], a:0, why:"Serve terra acida con alluminio disponibile: i prodotti per “azzurrare” le ortensie servono a questo." },
    { t:"mc", plant:"petunia", q:"Petunia con foglie giallastre e venature verdi a metà estate, annaffiata con acqua dura. Cosa le manca?", o:["Ferro: il calcare lo blocca, come per il limone","Sole","Azoto"], a:0, why:"È clorosi ferrica, frequente nelle petunie. Concime con ferro e acqua meno dura." },
    { t:"tf", plant:"ortensia", q:"L’ortensia si affloscia alle tre del pomeriggio ma la sera è dritta, con la terra umida: ha bisogno di più acqua.", a:false, why:"Se la terra è umida è il caldo: si chiude per risparmiare acqua. Serve ombra nel pomeriggio, non altra acqua." },
    { t:"mc", plant:"bouganville", q:"Bouganville che al primo freddo perde tutte le foglie. È morta?", o:["Probabilmente no: conta che i rami siano verdi sotto la corteccia","Sì, si butta","Sì, colpa del sole"], a:0, why:"Gratta leggermente un ramo: se sotto è verde è viva. Riparo dal gelo e poca acqua." },
    { t:"mc", plant:"geranio", q:"Vuoi i gerani anche l’anno prossimo senza ricomprarli. Il metodo più semplice?", o:["Talee a fine estate, tenute al riparo d’inverno","I semi dei fiori secchi","Lasciarli fuori a gelare"], a:0, why:"Le talee radicano facilmente e passano l’inverno al riparo, pronte per la primavera." }
  ])},
  { id:"h2", zone:"z8", title:"Agrumi e funghi", icon:"sun", items:lv(3, [
    { t:"mc", plant:"limone", q:"Limone tenuto sempre in casa: tanti fiori ma pochissimi limoni. Cosa manca?", o:["Impollinatori e aria: in primavera all’aperto va meglio","Acqua del rubinetto","Ombra"], a:0, why:"Fuori, insetti e vento aiutano l’impollinazione. In casa si può aiutare con un pennellino." },
    { t:"mc", plant:"olivo", q:"Olivo con macchie tonde scure, con un alone giallo, dopo una primavera piovosa. Cosa può essere?", o:["L’occhio di pavone, un fungo","Scottature da sole","Fame di concime"], a:0, why:"È un fungo che ama l’umido: si tolgono le foglie colpite e si tratta con prodotti a base di rame." },
    { t:"tf", plant:"limone", q:"Gli agrumi in vaso si concimano soprattutto nella stagione di crescita, non in pieno inverno.", a:true, why:"D’inverno crescono poco: il concime resta nella terra e non serve." },
    { t:"mc", plant:"petunia", q:"Petunie a fine estate: fiori sempre più piccoli e fusti lunghi. Cosa fai?", o:["Spunti i fusti e dai concime per fioriture","Le sposti all’ombra","Aspetti l’anno prossimo"], a:0, why:"Una spuntatina e un po’ di potassio: ripartono per il finale di stagione." },
    { t:"mc", plant:"rosmarino", q:"Rosmarino in un vaso piccolo che deve passare l’inverno al Nord. Cosa fai?", o:["Lo avvicini al muro al riparo, con la terra più asciutta che bagnata","Lo porti in salotto al caldo","Lo annaffi ogni giorno"], a:0, why:"Il muro ripara dal gelo; terra asciutta d’inverno perché il freddo umido è il vero nemico." }
  ])},
  { id:"h3", zone:"z8", title:"Carnivore per esperti", icon:"leaf", items:lv(3, [
    { t:"mc", plant:"dionea", q:"Dionea tenuta in salotto tutto l’anno e annaffiata con acqua del rubinetto. Quali sono gli errori?", o:["Poca luce, niente riposo invernale e acqua con sali","Nessuno, è perfetta","Solo l’acqua"], a:0, why:"Tre errori in uno: le serve sole pieno, un inverno fresco e acqua senza sali." },
    { t:"mc", plant:"sarracenia", q:"In primavera la sarracenia fa trombe nuove piatte e storte. Cosa le manca?", o:["Sole pieno","Acqua del rubinetto","Concime"], a:0, why:"Senza sole pieno le trombe crescono deboli e non si colorano." },
    { t:"tf", plant:"drosera", q:"Se la drosera smette di fare goccioline d’inverno in casa, è sicuramente morta.", a:false, why:"Spesso è poca luce o aria secca: con più luce torna a farle." },
    { t:"mc", plant:"nepenthes", q:"Nepenthes: le anfore vecchie seccano una dopo l’altra. Cosa fai?", o:["Le tagli quando sono secche: è normale, ogni anfora vive qualche mese","La butti","La annaffi dentro le anfore con acqua del rubinetto"], a:0, why:"Le anfore hanno una vita limitata: conta che ne faccia di nuove." },
    { t:"mc", plant:"dionea", q:"Dionea a febbraio, dopo il riposo invernale: tante foglie nere. Cosa fai?", o:["Togli le foglie nere: in primavera ripartirà dal centro","La butti","La porti al caldo e la concimi"], a:0, why:"Il riposo lascia foglie nere: il centro è vivo e ripartirà." }
  ])},
  { id:"h4", zone:"z8", title:"Orchidee difficili", icon:"pot", items:lv(3, [
    { t:"mc", plant:"orchidea", q:"Phalaenopsis con foglie molli e raggrinzite, radici argentate e secche. Cosa fai?", o:["Immersioni più frequenti: ha sete","Meno acqua","Più sole diretto"], a:0, why:"Radici secche e argentate: le serve acqua." },
    { t:"mc", plant:"orchidea", q:"Phalaenopsis con foglie molli e raggrinzite, ma radici marroni e molli. Causa?", o:["Radici marce: non riesce a bere nemmeno con l’acqua","Sete","Troppa luce"], a:0, why:"Stesso sintomo dell’altra domanda, causa opposta. Via le radici marce, corteccia nuova, meno acqua." },
    { t:"tf", plant:"orchidea", q:"Dopo la fioritura si può tagliare lo stelo sopra un nodo: a volte rifiorisce da lì.", a:true, why:"Dal nodo può nascere un nuovo ramo di fiori. Se lo stelo secca, si taglia alla base." },
    { t:"mc", plant:"tillandsia", q:"Tillandsia con le punte delle foglie secche e marroni, il resto bene. Cosa le serve?", o:["Bagni un po’ più frequenti o aria meno secca","Terriccio","Il buio"], a:0, why:"Punte secche: sta bevendo troppo poco." },
    { t:"mc", plant:"monstera", q:"Monstera con radici aeree lunghissime che vagano per il salotto. Puoi...", o:["Guidarle nel vaso o su un tutore, o accorciarle se danno fastidio","Non toccarle mai, o muore","Annaffiarle ogni giorno"], a:0, why:"Non sono indispensabili: si guidano o si accorciano senza drammi." }
  ])},
  { id:"h5", zone:"z8", title:"Ripasso finale", icon:"star", items:lv(3, [
    { t:"mc", plant:"gardenia", q:"Gardenia con i boccioli che cadono dopo essere stata spostata dal balcone al salotto. Cosa è successo?", o:["Lo sbalzo di posto e di temperatura","Troppi complimenti","Il ferro"], a:0, why:"Odia i cambiamenti: un posto fisso, senza sbalzi." },
    { t:"tf", plant:"kumquat", q:"Il kumquat va potato a fondo ogni anno per fare frutti.", a:false, why:"Come il limone: potatura leggera. Troppi tagli, meno fiori e meno frutti." },
    { t:"mc", plant:"cephalotus", q:"Cephalotus con anfore verdi e piccole. Cosa provi?", o:["Più luce","Più acqua del rubinetto","Concime"], a:0, why:"Con più luce le anfore crescono e diventano rosso scuro." },
    { t:"mc", plant:"vanda", q:"Vanda con radici argentate e foglie raggrinzite, d’estate. Cosa fai?", o:["Bagni più frequenti","Meno luce","La pianti nel terriccio"], a:0, why:"D’estate beve tanto: immersioni anche ogni giorno." },
    { t:"match", q:"Abbina rara e mania", pairs:[["Gardenia","Terra acida e niente sbalzi"],["Kumquat","Si mangia con la buccia"],["Cephalotus","Anfore pelose in miniatura"],["Vanda","Radici nude e tanta luce"]] }
  ])}
);
Object.assign(EXTRA, {
  d1:[{ title:"L’alocasia", items:lv(2, [
    { t:"id", plant:"alocasia", q:"Quale è l’alocasia?", o:["alocasia","monstera","maranta","fittonia"], a:"alocasia", why:"Foglie a freccia, lucide, con venature chiarissime. La monstera ha i buchi, lei no." },
    { t:"mc", plant:"alocasia", q:"Cosa vuole l’alocasia?", o:["Luce indiretta intensa, terra che drena, aria umida","Sole pieno e terra sempre zuppa","Buio e freddo"], a:0, why:"Luce sì ma filtrata, acqua sì ma senza ristagni, aria umida. Diva, appunto." },
    { t:"tf", plant:"alocasia", q:"D’inverno l’alocasia può perdere foglie e quasi “sparire”: spesso è riposo, non morte.", a:true, why:"Al fresco rallenta: il rizoma sotto terra è vivo. Meno acqua e pazienza." },
    { t:"mc", plant:"alocasia", q:"Al mattino ci sono gocce d’acqua sulla punta delle foglie dell’alocasia. Cosa sono?", o:["Guttazione: la pianta espelle acqua in eccesso","Lacrime di gioia","Un parassita"], a:0, why:"Succede quando la terra è molto umida. Utile come segnale: forse stai annaffiando un po’ troppo." },
    { t:"tf", plant:"alocasia", q:"L’alocasia è innocua per cani e gatti.", a:false, why:"Come la monstera, è irritante se masticata." }
  ])}],
  d2:[{ title:"La fittonia", items:lv(2, [
    { t:"id", plant:"fittonia", q:"Quale è la fittonia?", o:["fittonia","maranta","alocasia","begonia"], a:"fittonia", why:"Foglioline basse con una rete di venature chiare, come un mosaico." },
    { t:"tf", plant:"fittonia", q:"La fittonia ama la terra sempre leggermente umida e l’aria umida.", a:true, why:"Viene dal sottobosco tropicale: umido sopra e sotto." },
    { t:"mc", plant:"fittonia", q:"Perché la fittonia sta benissimo in un terrario chiuso?", o:["Perché lì l’aria resta umida","Perché le piace il buio","Perché odia l’ossigeno"], a:0, why:"Nel terrario l’umidità resta alta: il suo ambiente ideale, in miniatura." },
    { t:"mc", plant:"fittonia", q:"La fittonia è crollata, foglie sdraiate. Cosa fai?", o:["La annaffi: si rialza presto, ma non farla crollare spesso","La butti","La metti al sole"], a:0, why:"Si riprende, ma ogni crollo la stressa: meglio non arrivarci." },
    { t:"tf", plant:"fittonia", q:"La fittonia vuole sole diretto per avere venature più chiare.", a:false, why:"Il sole diretto le brucia le foglie: luce indiretta." }
  ])}],
  d3:[{ title:"La maranta", items:lv(2, [
    { t:"id", plant:"maranta", q:"Quale è la maranta?", o:["calathea","maranta","fittonia","alocasia"], a:"maranta", why:"Foglie ovali con macchie scure a spina di pesce e venature rosse." },
    { t:"tf", plant:"maranta", q:"Maranta e calathea appartengono alla stessa famiglia.", a:true, why:"Sono entrambe Marantacee: stesse manie per umidità e acqua." },
    { t:"mc", plant:"maranta", q:"La maranta ha punte secche e foglie arricciate. Cosa le manca più spesso?", o:["Umidità nell’aria e acqua poco calcarea","Sole diretto","Concime per cactus"], a:0, why:"Come la calathea: aria secca e calcare sono i suoi nemici." },
    { t:"mc", plant:"maranta", q:"Che terra vuole la maranta?", o:["Sempre leggermente umida, mai zuppa né secca","Secca per settimane","Allagata"], a:0, why:"La via di mezzo, sempre: la parte difficile è proprio quella." }
  ])}],
  d4:[{ title:"La begonia a pois", items:lv(2, [
    { t:"id", plant:"begonia", q:"Quale è la begonia maculata?", o:["fittonia","begonia","maranta","alocasia"], a:"begonia", why:"Foglie lunghe e appuntite, a pois argentati, rosse sotto." },
    { t:"tf", plant:"begonia", q:"La begonia maculata va spruzzata spesso sulle foglie per darle umidità.", a:false, why:"Le foglie bagnate rischiano l’oidio. Umidità sì, ma intorno: altre piante vicine o argilla espansa bagnata." },
    { t:"mc", plant:"begonia", q:"Come annaffi la begonia maculata?", o:["Quando i primi centimetri sono asciutti, senza bagnare le foglie","Ogni giorno, abbondante","Una volta al mese"], a:0, why:"Terra appena asciutta in superficie, acqua alla base." },
    { t:"mc", plant:"begonia", q:"Come ottieni una begonia nuova gratis?", o:["Talea di fusto con un nodo, in acqua o in terra","Seminando i pois","Comprandola"], a:0, why:"Radica facilmente: un pezzo di fusto con un nodo e un po’ di pazienza." }
  ])}],
  g1:[{ title:"L’echeveria", items:lv(2, [
    { t:"id", plant:"echeveria", q:"Quale è l’echeveria?", o:["echeveria","haworthia","lithops","mammillaria"], a:"echeveria", why:"Una rosa fatta di foglie carnose, azzurrine o rosate." },
    { t:"mc", plant:"echeveria", q:"L’echeveria in casa si allunga, la rosetta si apre e il fusto si piega verso la finestra. Cosa le manca?", o:["Sole: si sta “filando” per cercare luce","Acqua","Un vaso più grande"], a:0, why:"Si chiama filatura: in casa la luce non basta. Sul balcone al sole torna compatta (le parti già allungate restano)." },
    { t:"tf", plant:"echeveria", q:"La polverina chiara sulle foglie dell’echeveria va pulita via con un panno.", a:false, why:"È pruina, una protezione naturale dal sole. Toccandola si toglie, e sulle foglie vecchie non ricresce." },
    { t:"mc", plant:"echeveria", q:"Come si annaffia un’echeveria?", o:["A fondo, solo quando la terra è asciutta del tutto, senza bagnare la rosetta","Un goccio ogni giorno","Spruzzando le foglie"], a:0, why:"Bagna e asciuga. L’acqua ferma nella rosetta la fa marcire dal centro." }
  ])}],
  g2:[{ title:"L’haworthia", items:lv(2, [
    { t:"id", plant:"haworthia", q:"Riconosci l’haworthia?", o:["mammillaria","echeveria","haworthia","lithops"], a:"haworthia", why:"Rosetta di foglie appuntite con strisce bianche in rilievo." },
    { t:"tf", plant:"haworthia", q:"L’haworthia sopporta la luce indiretta di casa meglio dell’echeveria.", a:true, why:"In natura cresce all’ombra di rocce e cespugli. Al sole cocente diventa rossiccia e soffre." },
    { t:"mc", plant:"haworthia", q:"L’haworthia è diventata rossastra con le punte secche, dopo un’estate sul balcone a sud. Cosa è successo?", o:["Troppo sole diretto","Troppo poca luce","Freddo"], a:0, why:"Si è scottata: torna alla luce indiretta e recupera il verde." },
    { t:"mc", plant:"haworthia", q:"Come fai una nuova haworthia?", o:["Stacchi i figli che crescono alla base, con un po’ di radici","Metti una foglia intera in acqua","La tagli a metà"], a:0, why:"I figli alla base sono piante pronte: si staccano e si rinvasano." }
  ])}],
  g3:[{ title:"La mammillaria", items:lv(2, [
    { t:"id", plant:"mammillaria", q:"Quale è la mammillaria?", o:["lithops","mammillaria","haworthia","echeveria"], a:"mammillaria", why:"Un cuscino tondo di spine, con la corona di fiori in cima." },
    { t:"mc", plant:"mammillaria", q:"Cosa aiuta la mammillaria a fiorire in primavera?", o:["Un inverno fresco e quasi senz’acqua","Annaffiarla molto d’inverno","Tenerla al buio"], a:0, why:"Il riposo invernale prepara i fiori. Caldo e acqua d’inverno, niente corona." },
    { t:"tf", plant:"mammillaria", q:"I cactus hanno bisogno di acqua anche d’estate, quando crescono.", a:true, why:"D’estate crescono: acqua a fondo quando il terriccio è asciutto. È d’inverno che si sospende quasi del tutto." },
    { t:"mc", plant:"mammillaria", q:"Che terriccio vuole la mammillaria?", o:["Specifico per cactacee, molto drenante, con sabbia o pomice","Torba pura sempre umida","Terra del giardino"], a:0, why:"Deve asciugare in fretta: niente terra che trattiene acqua." }
  ])}],
  g4:[{ title:"I lithops", items:lv(2, [
    { t:"id", plant:"lithops", q:"Quale è il lithops?", o:["haworthia","echeveria","lithops","mammillaria"], a:"lithops", why:"Due “sassi” uniti con una fessura in mezzo. Se non lo sapessi, lo calpesteresti." },
    { t:"tf", plant:"lithops", q:"Quando il lithops fa una nuova coppia di foglie, va annaffiato di più per aiutarlo.", a:false, why:"Le foglie nuove si nutrono delle vecchie, che si svuotano. Annaffiare in quel momento è il modo classico di ucciderlo." },
    { t:"mc", plant:"lithops", q:"Quanto annaffi un lithops?", o:["Pochissimo e solo in certi periodi: spesso il segreto è non annaffiare","Ogni settimana","Ogni giorno, è piccolo"], a:0, why:"Vive dove piove quasi mai. Il suo nemico numero uno è l’annaffiatoio." },
    { t:"mc", plant:"lithops", q:"Il lithops si gonfia e la pelle si spacca. Cosa è successo?", o:["Ha ricevuto troppa acqua","Ha sete","Sta per fiorire"], a:0, why:"Ha bevuto più di quanto riesce a contenere. Niente acqua per un bel po’." },
    { t:"tf", plant:"lithops", q:"I lithops vogliono molta luce, anche sole diretto.", a:true, why:"Con poca luce si allungano e perdono la forma da sasso." }
  ])}],
  h1:[{ title:"La gardenia", items:lv(2, [
    { t:"id", plant:"gardenia", q:"Quale è la gardenia?", o:["gardenia","kumquat","vanda","cephalotus"], a:"gardenia", why:"Foglie lucide verde scuro e fiori bianchi a rosa, profumatissimi." },
    { t:"mc", plant:"gardenia", q:"Che terriccio vuole la gardenia?", o:["Per acidofile, come le ortensie blu","Per cactacee","Terra di giardino calcarea"], a:0, why:"Terra acida: con il calcare le foglie ingialliscono." },
    { t:"mc", plant:"gardenia", q:"La gardenia lascia cadere i boccioli prima che si aprano. Cause tipiche?", o:["Sbalzi di temperatura, spostamenti, aria troppo secca","Troppi complimenti","Acqua poco calcarea"], a:0, why:"Odia i cambiamenti: un posto fisso e condizioni stabili." },
    { t:"tf", plant:"gardenia", q:"Foglie gialle con le venature verdi possono indicare che alla gardenia manca ferro.", a:true, why:"Clorosi ferrica, come per limone e petunia: terra acida e concime con ferro." }
  ])}],
  h2:[{ title:"Il kumquat", items:lv(2, [
    { t:"id", plant:"kumquat", q:"Quale è il kumquat?", o:["kumquat","gardenia","vanda","cephalotus"], a:"kumquat", why:"Un alberello pieno di piccoli frutti arancioni ovali." },
    { t:"tf", plant:"kumquat", q:"Il kumquat sopporta il freddo meglio del limone.", a:true, why:"È tra gli agrumi più resistenti al freddo, ma le gelate forti restano un problema." },
    { t:"mc", plant:"kumquat", q:"Come si mangia il frutto del kumquat?", o:["Intero, con la buccia","Solo il succo","Solo la buccia, il resto si butta"], a:0, why:"La buccia è la parte dolce. Il dentro è aspro: è il bello del contrasto." },
    { t:"mc", plant:"kumquat", q:"Il kumquat ha foglie gialle con le venature verdi. Cosa gli dai?", o:["Concime con ferro per agrumi","Più ombra","Acqua del rubinetto molto calcarea"], a:0, why:"Stessa clorosi del limone: ferro e acqua meno dura." }
  ])}],
  h3:[{ title:"Il cephalotus", items:lv(2, [
    { t:"id", plant:"cephalotus", q:"Quale è il cephalotus?", o:["nepenthes","cephalotus","sarracenia","drosera"], a:"cephalotus", why:"Tante piccole anfore tozze e pelose, a terra, con il coperchio. Nepenthes in versione tascabile." },
    { t:"tf", plant:"cephalotus", q:"Il cephalotus vuole la torba umida, ma senza stare sempre a bagno come la dionea.", a:true, why:"Umido sì, allagato per settimane no: poca acqua nel sottovaso." },
    { t:"mc", plant:"cephalotus", q:"Che acqua vuole il cephalotus?", o:["Piovana o demineralizzata, come le altre carnivore","Del rubinetto","Frizzante"], a:0, why:"Niente sali: stessa regola di tutte le carnivore." },
    { t:"mc", plant:"cephalotus", q:"Più luce riceve il cephalotus, più le sue anfore...", o:["Si colorano di rosso scuro","Diventano trasparenti","Spariscono"], a:0, why:"Con tanta luce diventano rosso scuro, quasi nere." }
  ])}],
  h4:[{ title:"La vanda", items:lv(2, [
    { t:"id", plant:"vanda", q:"Quale è la vanda?", o:["orchidea","vanda","gardenia","cephalotus"], a:"vanda", why:"Radici lunghe e nude che pendono, foglie a ventaglio e fiori viola enormi." },
    { t:"mc", plant:"vanda", q:"Come si annaffia una vanda a radice nuda?", o:["Immergendo le radici spesso, d’estate anche ogni giorno","Una volta al mese","Mai, vive d’aria"], a:0, why:"Le radici nude asciugano in fretta: bagni frequenti, poi all’aria." },
    { t:"tf", plant:"vanda", q:"La vanda vuole più luce della phalaenopsis.", a:true, why:"Molta più luce: è uno dei motivi per cui in casa è difficile." },
    { t:"mc", plant:"vanda", q:"Perché la vanda spesso sta senza terra né corteccia?", o:["Le radici vogliono aria e devono asciugarsi in fretta tra un bagno e l’altro","Perché costa meno","Perché odia i vasi"], a:0, why:"In natura pende dagli alberi: le radici vivono all’aria aperta." }
  ])}]
});

// ---------- Domande in più per Allenamento e Ripasso (zone 1-5) ----------
// Non fanno parte delle lezioni: allargano il mazzo da cui l'Allenamento pesca, così le domande si ripetono meno.
const PRACTICE = {
  s1:[
    { t:"tf", plant:"basilico", q:"Il basilico è una pianta annuale: dopo la fioritura tende a esaurirsi.", a:true, why:"Fa i fiori, poi i semi, poi saluta. Togliere i fiori allunga la festa." },
    { t:"mc", plant:"basilico", q:"In cima al basilico spuntano i fiori bianchi. Che fai?", o:["Li togli: così continua a fare foglie","Li lasci: più fiori, più foglie","Lo annaffi il doppio"], a:0, why:"Quando fiorisce, il basilico mette le energie nei semi e le foglie diventano meno aromatiche." },
    { t:"mc", plant:"basilico", q:"Basilico sul davanzale, in piena estate. Quanto beve?", o:["Spesso: la terra deve restare appena umida","Una volta al mese","Mai, vive di aria e di pesto"], a:0, why:"Foglie tenere e radici corte: con il caldo la terra si asciuga in fretta." },
    { t:"tf", plant:"basilico", q:"Al Nord il basilico può stare fuori anche in pieno inverno.", a:false, why:"Sotto i 10 gradi soffre, con il gelo muore. Al Nord è una pianta da bella stagione." }
  ],
  s2:[
    { t:"mc", plant:"pothos", q:"Il pothos variegato sta perdendo le striature chiare. Cosa gli manca?", o:["Luce","Acqua","Compagnia"], a:0, why:"Le parti chiare non fanno fotosintesi: con poca luce la pianta le riduce per sopravvivere." },
    { t:"tf", plant:"sansevieria", q:"Se la sposti di colpo dall’angolo buio al sole del pomeriggio, la sansevieria può scottarsi.", a:true, why:"Al sole si abitua, ma per gradi. Il trasloco brusco lascia macchie chiare sulle foglie." },
    { t:"mc", plant:"zamioculcas", q:"Quale di queste sopporta meglio l’angolo lontano dalla finestra?", o:["Zamioculcas","Basilico","Lavanda"], a:0, why:"La zamioculcas tollera la poca luce. Basilico e lavanda lì farebbero una brutta fine." },
    { t:"tf", plant:"spatifillo", q:"Al sole diretto lo spatifillo fa foglie più belle e lucide.", a:false, why:"Il sole diretto gli ingiallisce e brucia le foglie: preferisce luce filtrata o mezz’ombra." }
  ],
  s3:[
    { t:"mc", q:"Hai annaffiato e l’acqua è finita nel sottovaso. Dopo un quarto d’ora?", o:["Svuoti il sottovaso","La lasci lì, così beve dopo","Ne aggiungi altra"], a:0, why:"L’acqua ferma nel sottovaso tiene le radici a bagno. È così che marciscono." },
    { t:"tf", plant:"menta", q:"La menta sopporta la terra umida meglio della sansevieria.", a:true, why:"La menta ama il fresco e l’umido. La sansevieria con la terra bagnata marcisce." },
    { t:"mc", plant:"sansevieria", q:"D’inverno, in casa, ogni quanto annaffi la sansevieria?", o:["Ogni giorno","Circa una volta al mese, a terra asciutta","Ogni due giorni"], a:1, why:"Con poca luce e poco caldo beve pochissimo. L’acqua in più resta nella terra e marcisce la base." },
    { t:"tf", q:"Meglio annaffiare poco e spesso, bagnando solo la superficie.", a:false, why:"Meglio bagnare bene tutta la terra quando serve, poi aspettare che si asciughi. Lo spruzzino in superficie non arriva alle radici." }
  ],
  s4:[
    { t:"tf", q:"I fori sul fondo del vaso servono a far uscire l’acqua in più.", a:true, why:"Senza foro l’acqua si accumula in basso e le radici restano a mollo. Anche nel vaso più bello." },
    { t:"mc", plant:"pothos", q:"La talea di pothos in acqua ha fatto radici di qualche centimetro. E adesso?", o:["La pianti nel terriccio e lo tieni umido i primi giorni","La lasci in acqua per sempre, senza cambiarla mai","La metti al sole forte"], a:0, why:"In acqua può vivere a lungo, ma l’acqua va cambiata spesso. Nel terriccio cresce meglio." },
    { t:"mc", q:"Quando conviene rinvasare, di solito?", o:["In primavera, quando la pianta riparte","In pieno inverno","Il giorno stesso in cui la compri, sempre"], a:0, why:"In primavera le radici ripartono e si sistemano presto nella terra nuova." },
    { t:"tf", plant:"menta", q:"La menta si moltiplica facilmente dividendo il cespo con le radici.", a:true, why:"Le sue radici striscianti fanno germogli ovunque: dividere un cespo è un attimo." }
  ],
  m1:[
    { t:"tf", plant:"olivo", q:"L’olivo può stare tutto l’anno in casa, lontano dalle finestre.", a:false, why:"Vuole sole pieno e aria: in casa al buio perde le foglie e deperisce." },
    { t:"mc", plant:"lavanda", q:"Quante ore di sole diretto vuole la lavanda per fiorire bene?", o:["Almeno 6","Una, di passaggio","Nessuna, le basta la lampada"], a:0, why:"È una pianta di sole pieno: con meno luce fiorisce poco e si allunga." },
    { t:"tf", plant:"limone", q:"Il limone è sempreverde: tiene le foglie anche d’inverno.", a:true, why:"Se le perde d’inverno è un segnale: freddo, buio o acqua sbagliata." },
    { t:"mc", plant:"salvia", q:"Dove sta meglio la salvia sul balcone?", o:["Al sole","Nell’angolo più buio","Dentro un mobile"], a:0, why:"Come le altre aromatiche mediterranee vuole tanto sole: le foglie restano più aromatiche." }
  ],
  m2:[
    { t:"mc", plant:"rosmarino", q:"Rosmarino in vaso: aghi gialli dal basso e terra sempre bagnata. Cosa succede?", o:["Troppa acqua: le radici soffrono","Troppo poca acqua","Troppo sole"], a:0, why:"Il rosmarino teme i ristagni più della sete. Terra drenante e acqua solo quando è asciutta." },
    { t:"tf", plant:"ficodindia", q:"D’inverno, all’aperto, il fico d’India va annaffiato regolarmente.", a:false, why:"D’inverno riposa: acqua e freddo insieme lo fanno marcire. Meglio lasciarlo quasi all’asciutto." },
    { t:"tf", plant:"limone", q:"Il limone soffre l’acqua molto calcarea.", a:true, why:"Il calcare blocca l’assorbimento del ferro e le foglie ingialliscono. Meglio la piovana, quando si può." },
    { t:"mc", plant:"salvia", q:"Prima di annaffiare la salvia in vaso controlli che...", o:["La terra in superficie sia asciutta","Il sottovaso sia pieno","Sia passata esattamente una settimana"], a:0, why:"Meglio il dito del calendario: con il caldo beve di più, con il fresco molto meno." }
  ],
  m3:[
    { t:"tf", plant:"lavanda", q:"Dopo la fioritura si accorciano gli steli della lavanda, restando sulla parte con le foglie.", a:true, why:"Così resta compatta. Più in basso, sul legno spoglio, spesso non ricaccia." },
    { t:"mc", plant:"olivo", q:"Perché si sfoltisce la chioma dell’olivo?", o:["Per far entrare luce e aria tra i rami","Per farlo crescere più in fretta in altezza","Perché le foglie sono troppe da annaffiare"], a:0, why:"Luce e aria dentro la chioma vogliono dire meno malattie e più rametti buoni." },
    { t:"tf", plant:"rosmarino", q:"Tagliare spesso le punte del rosmarino per la cucina lo aiuta a restare folto.", a:true, why:"Tagliare le punte fa spuntare rametti laterali. Più arrosti, più rosmarino." },
    { t:"mc", plant:"ficodindia", q:"Per maneggiare le pale del fico d’India conviene...", o:["Usare guanti spessi o una pinza","Usare le mani: le spine sono finte","Bagnarle prima"], a:0, why:"Oltre alle spine grandi ha i glochidi: ciuffetti di spine minuscole che si staccano e restano nella pelle." }
  ],
  m4:[
    { t:"tf", plant:"olivo", q:"L’olivo in vaso soffre il gelo più di quello piantato in terra.", a:true, why:"In vaso le radici non sono protette dal terreno: il freddo le raggiunge da tutti i lati." },
    { t:"mc", plant:"limone", q:"Il limone in casa d’inverno, vicino al termosifone, perde le foglie. Perché?", o:["Aria calda e secca","Troppo freddo","Troppe attenzioni"], a:0, why:"Il caldo secco lo stressa: meglio un posto luminoso e fresco, sopra lo zero." },
    { t:"tf", plant:"lavanda", q:"D’inverno la lavanda in vaso teme più la terra bagnata del freddo.", a:true, why:"Il freddo lo sopporta bene. Le radici fradice d’inverno, invece, no." },
    { t:"mc", q:"D’inverno, il sottovaso delle piante mediterranee in balcone...", o:["Meglio toglierlo o tenerlo sempre vuoto","Meglio tenerlo pieno","Va riempito di ghiaccio, per abituarle"], a:0, why:"Con il freddo l’acqua ferma non evapora e le radici restano a bagno per giorni." }
  ],
  j1:[
    { t:"mc", plant:"monstera", q:"Le foglie nuove della monstera escono piccole e senza tagli. Cosa serve, di solito?", o:["Più luce","Più acqua","Meno luce"], a:0, why:"Con poca luce fa foglie piccole e intere. I tagli arrivano con luce buona e pianta adulta." },
    { t:"tf", plant:"calathea", q:"La calathea sta bene in un punto luminoso, ma senza sole diretto.", a:true, why:"In natura vive sotto gli alberi: il sole diretto sbiadisce e brucia i disegni delle foglie." },
    { t:"mc", plant:"ficus", q:"Il ficus elastica variegato, rispetto a quello verde scuro, vuole...", o:["Più luce","Meno luce","La stessa, è uguale"], a:0, why:"Le parti chiare fanno meno fotosintesi: per restare colorato gli serve più luce." },
    { t:"tf", plant:"monstera", q:"La monstera si piega verso la finestra: ruotare il vaso ogni tanto la tiene più dritta.", a:true, why:"Le foglie cercano la luce. Un quarto di giro ogni tanto e cresce in modo più uniforme." }
  ],
  j2:[
    { t:"mc", plant:"calathea", q:"Come alzi davvero l’umidità intorno a una calathea?", o:["Un umidificatore, o un sottovaso con argilla espansa bagnata sotto il vaso","Un bicchiere d’acqua in un’altra stanza","Accendendo il termosifone"], a:0, why:"L’acqua che evapora vicino alla pianta aiuta un po’, l’umidificatore aiuta davvero. Il vaso però non deve toccare l’acqua." },
    { t:"tf", plant:"felce", q:"La felce sta bene accanto al termosifone.", a:false, why:"Aria calda e secca: le fronde si seccano e perde fogliette ovunque." },
    { t:"tf", plant:"tillandsia", q:"Dopo il bagno la tillandsia va fatta asciugare bene, a testa in giù.", a:true, why:"Se l’acqua resta al centro, tra le foglie, la base marcisce." },
    { t:"mc", plant:"calathea", q:"Che acqua preferisce la calathea?", o:["Poco calcarea, a temperatura ambiente","Fredda di frigo","Acqua di mare"], a:0, why:"Calcare e cloro le macchiano le punte delle foglie. Piovana o filtrata è meglio." }
  ],
  j3:[
    { t:"tf", plant:"orchidea", q:"Le radici dell’orchidea sono verdi quando sono bagnate e argentate quando sono asciutte.", a:true, why:"È il velamen, uno strato spugnoso: il colore ti dice quando ha bisogno d’acqua." },
    { t:"mc", plant:"orchidea", q:"Le radici dell’orchidea sono marroni e molli. Cosa vuol dire?", o:["Sono marce: troppa acqua o substrato vecchio","Stanno benissimo","Hanno freddo"], a:0, why:"Le radici sane sono sode, verdi o argentate. Quelle molli si tagliano e si cambia il substrato." },
    { t:"tf", plant:"monstera", q:"Le radici aeree della monstera vanno tagliate tutte, sennò la pianta soffre.", a:false, why:"Si possono guidare verso il tutore o nella terra. Tagliarne qualcuna non la uccide, ma non serve." },
    { t:"mc", plant:"tillandsia", q:"Cosa vuol dire che una pianta è epifita?", o:["Vive appoggiata su altre piante, senza rubare nutrimento","È un parassita","Vive sott’acqua"], a:0, why:"Usa gli alberi come appoggio per stare più vicina alla luce. Non è una parassita." }
  ],
  j4:[
    { t:"mc", plant:"orchidea", q:"Lo stelo dei fiori dell’orchidea è secco e marrone. Che fai?", o:["Lo tagli alla base","Lo annaffi","Lo lasci: rifiorirà da lì"], a:0, why:"Uno stelo secco non rifiorisce più. Se è ancora verde, invece, a volte riparte da un nodo." },
    { t:"tf", plant:"felce", q:"La felce si moltiplica dividendo il cespo in primavera.", a:true, why:"Ogni pezzo con le sue radici diventa una felce nuova. Con le spore è tutta un’altra storia, molto più lunga." },
    { t:"tf", plant:"ficus", q:"D’inverno il ficus beve meno che d’estate.", a:true, why:"Con meno luce cresce più piano e beve meno: la terra resta umida più a lungo." },
    { t:"mc", plant:"tillandsia", q:"Quante volte fiorisce una tillandsia?", o:["Una volta sola, poi fa i figli","Ogni settimana","Mai"], a:0, why:"Dopo la fioritura la madre fa i figli e piano piano declina." }
  ],
  f1:[
    { t:"tf", plant:"petunia", q:"La petunia fiorisce bene anche all’ombra.", a:false, why:"Vuole sole: all’ombra fa fusti lunghi e pochi fiori." },
    { t:"mc", plant:"bouganville", q:"La bouganville fa tante foglie e pochi fiori. Cosa controlli per primo?", o:["Che prenda abbastanza sole","Che il sottovaso sia sempre pieno","Che stia all’ombra"], a:0, why:"Sole e caldo sono il suo motore. Anche troppa acqua e troppo concime azotato spingono le foglie al posto dei fiori." },
    { t:"tf", plant:"ortensia", q:"Il sole forte del pomeriggio può bruciare le foglie dell’ortensia.", a:true, why:"Meglio il sole del mattino: d’estate, nel pomeriggio, le foglie grandi perdono acqua troppo in fretta." },
    { t:"mc", plant:"geranio", q:"Il geranio messo all’ombra...", o:["Fiorisce poco e si allunga","Fiorisce il doppio","Cambia colore"], a:0, why:"È una pianta da sole: con poca luce fa fusti lunghi e pochi fiori." }
  ],
  f2:[
    { t:"tf", plant:"petunia", q:"D’estate alla petunia in vaso fa bene un concime per fioriture, dato con regolarità.", a:true, why:"Fiorisce senza sosta, e il poco terriccio del vaso si esaurisce presto." },
    { t:"mc", plant:"geranio", q:"Geranio con le foglie basse gialle e la terra sempre bagnata. Cosa sbagli?", o:["Troppa acqua","Troppo sole","Poca acqua"], a:0, why:"Il geranio teme i ristagni: lascia asciugare la superficie tra un’annaffiatura e l’altra." },
    { t:"tf", plant:"ortensia", q:"L’ortensia si annaffia meglio la mattina presto o la sera, non sotto il sole di mezzogiorno.", a:true, why:"Con il fresco l’acqua arriva alle radici invece di evaporare subito." },
    { t:"mc", plant:"bouganville", q:"Cosa fa fiorire di meno la bouganville?", o:["Troppa acqua e troppo concime azotato","Sole e caldo","Un po’ di sete"], a:0, why:"Coccolata troppo fa solo foglie. Un po’ di vita dura la fa fiorire." }
  ],
  f3:[
    { t:"mc", plant:"ortensia", q:"In terra calcarea, col tempo, un’ortensia blu tende a diventare...", o:["Rosa","Bianca","Nera"], a:0, why:"Senza acidità l’alluminio della terra non arriva al fiore, e il blu vira al rosa." },
    { t:"tf", plant:"ortensia", q:"Le ortensie bianche non cambiano colore con la terra.", a:true, why:"Il cambio di colore riguarda le varietà rosa e blu. Le bianche restano bianche." },
    { t:"tf", plant:"bouganville", q:"Le brattee della bouganville sono sottili come carta.", a:true, why:"In inglese la chiamano anche paper flower. I fiori veri sono i tubicini bianchi al centro." },
    { t:"mc", plant:"geranio", q:"Strofini una foglia di geranio tra le dita. Cosa senti?", o:["Un odore forte e particolare","Niente di niente","Sempre odore di basilico"], a:0, why:"Le foglie hanno ghiandole con oli profumati. Alcune varietà sanno di rosa o di limone." }
  ],
  f4:[
    { t:"tf", plant:"geranio", q:"A fine inverno si accorciano i rami del geranio per farlo ripartire più folto.", a:true, why:"Una potatura leggera prima della ripresa lo fa ramificare. Via anche i rami secchi." },
    { t:"mc", plant:"bouganville", q:"Arriva l’inverno al Nord. La bouganville in vaso...", o:["Va riparata dal gelo, in un posto luminoso e fresco","Resta fuori come d’estate","Va in cantina al buio, con il sottovaso pieno"], a:0, why:"Sotto lo zero soffre. Al riparo, con poca acqua, passa l’inverno e riparte in primavera." },
    { t:"tf", plant:"ortensia", q:"D’inverno l’ortensia perde le foglie: è normale.", a:true, why:"Perde le foglie in autunno, riposa e le rifà in primavera." },
    { t:"mc", plant:"geranio", q:"Quando si fanno le talee di geranio?", o:["A fine estate o in primavera","In pieno inverno, al gelo","Mai, non mette radici"], a:0, why:"Un rametto di una decina di centimetri, senza fiori e senza le foglie in basso, radica in qualche settimana." }
  ],
  c1:[
    { t:"tf", plant:"dionea", q:"Le piante carnivore vivono in terreni poveri, dove mancano soprattutto azoto e minerali.", a:true, why:"Paludi e torbiere: per questo gli insetti sono il loro integratore." },
    { t:"mc", plant:"dionea", q:"Cosa serve, di solito, perché la trappola della dionea si chiuda?", o:["Due tocchi sui peli in pochi secondi","Un tocco solo","Niente, si chiude a caso"], a:0, why:"Il doppio tocco evita i falsi allarmi: una goccia di pioggia non basta." },
    { t:"tf", plant:"drosera", q:"La drosera piega i tentacoli, e a volte tutta la foglia, intorno all’insetto catturato.", a:true, why:"I tentacoli si piegano verso la preda per digerirla meglio. In alcune specie si arrotola tutta la foglia." },
    { t:"mc", plant:"nepenthes", q:"Da dove viene la nepenthes?", o:["Dalle foreste tropicali del Sud-est asiatico","Dalle paludi della Carolina","Dal deserto"], a:0, why:"Clima caldo e umido tutto l’anno: per questo non va in letargo." }
  ],
  c2:[
    { t:"mc", plant:"sarracenia", q:"Perché l’acqua del rubinetto fa male alle carnivore?", o:["Ha sali e calcare che si accumulano nella torba","È troppo fredda","Non fa male"], a:0, why:"Vivono in acque povere di sali: il calcare si accumula e rovina le radici." },
    { t:"tf", plant:"drosera", q:"L’acqua piovana è una buona scelta per la drosera.", a:true, why:"È povera di sali, come quella delle torbiere. Purché raccolta in un contenitore pulito." },
    { t:"mc", plant:"dionea", q:"D’estate, quanta acqua lasci nel sottovaso della dionea?", o:["Un paio di centimetri, rabboccati spesso","Niente, mai","Tanta da coprire la pianta"], a:0, why:"Il sottovaso imita la palude: la torba resta sempre umida dal basso." },
    { t:"tf", plant:"nepenthes", q:"Se le anfore della nepenthes sono vuote, conviene riempirle con l’acqua del rubinetto.", a:false, why:"Il liquido delle anfore lo produce la pianta. Di solito non serve aggiungere niente, e il rubinetto men che meno." }
  ],
  c3:[
    { t:"tf", plant:"sarracenia", q:"La sarracenia cresce bene in casa, lontana dalla finestra.", a:false, why:"Vuole sole pieno: al buio fa trappole molli e pallide." },
    { t:"mc", plant:"dionea", q:"La dionea ha trappole tutte verdi e foglie lunghe e sottili. Cosa le manca?", o:["Luce","Acqua","Insetti"], a:0, why:"Con poca luce si allunga e perde il rosso. Al sole torna compatta e colorata." },
    { t:"tf", plant:"nepenthes", q:"La nepenthes vuole luce intensa, ma non il sole cocente di mezzogiorno.", a:true, why:"Viene dalla foresta: tanta luce filtrata. Il sole d’estate dietro il vetro le brucia le foglie." },
    { t:"mc", plant:"drosera", q:"Le goccioline sui tentacoli della drosera sono...", o:["Colla e succhi digestivi","Rugiada del mattino","Acqua da bere"], a:0, why:"Il nome viene dal greco per rugiada, ma è colla: l’insetto resta attaccato e viene digerito." }
  ],
  c4:[
    { t:"mc", plant:"dionea", q:"Quanto dura il riposo invernale della dionea?", o:["Circa 3-4 mesi, al fresco","Una notte","Non riposa mai"], a:0, why:"Con il freddo e meno luce si ferma. Saltare il riposo la indebolisce anno dopo anno." },
    { t:"tf", plant:"sarracenia", q:"Molte sarracenie passano l’inverno fuori e reggono anche qualche gelata leggera.", a:true, why:"Il freddo dell’inverno è il loro riposo: le serve per ripartire forti in primavera." },
    { t:"mc", plant:"nepenthes", q:"D’inverno la nepenthes...", o:["Resta al caldo e alla luce, senza letargo","Va in frigo","Va lasciata al gelo"], a:0, why:"È tropicale: sotto i 15 gradi circa inizia a soffrire. Altro che letargo." },
    { t:"tf", plant:"dionea", q:"Tagliare presto lo stelo dei fiori aiuta la dionea a restare forte.", a:true, why:"Fiori e semi consumano tante energie. Se i semi non ti servono, tagliarlo aiuta le trappole." }
  ]
};
// ---------- Tipi di domanda nuovi per le zone difficili ----------
// "order": metti in ordine i passaggi. "err": trova l'errore in una lista.
const HARD_NEW = {
  d1:{ t:"err", lv:3, plant:"calathea", q:"Una di queste diagnosi è sbagliata. Quale?", o:["Pothos con foglie piccole e tutte verdi: poca luce","Spatifillo afflosciato e terra asciutta: sete","Monstera con foglie gialle e terra sempre fradicia: troppa acqua","Calathea con foglie arrotolate e terra asciutta: troppo concime"], a:3, why:"Foglie arrotolate con la terra asciutta vogliono dire sete, o aria troppo secca. Il concime non c’entra." },
  d2:{ t:"order", lv:3, plant:"orchidea", q:"Annaffiare un’orchidea in corteccia.", steps:["Controlli che le radici siano argentate","Immergi il vaso in acqua per 10-15 minuti","Lo lasci scolare bene","Lo rimetti nel coprivaso, senza acqua sul fondo"], why:"Prima si guarda, poi si bagna, poi si scola. Un coprivaso pieno d’acqua annulla tutto il resto." },
  d3:{ t:"err", lv:3, plant:"calathea", q:"Una di queste piante è nel posto sbagliato. Quale?", o:["Zamioculcas nell’angolo del soggiorno, lontano dalla finestra","Maranta dietro una tenda leggera","Calathea sul davanzale a sud, al sole del pomeriggio","Spatifillo in mezz’ombra"], a:2, why:"Il sole diretto del pomeriggio sbiadisce e brucia le foglie della calathea. Le altre sono sistemate bene." },
  d4:{ t:"order", lv:3, plant:"calathea", q:"Hai trovato il ragnetto rosso sulla calathea.", steps:["Allontani la pianta dalle altre","Lavi bene le foglie, anche sotto, con acqua tiepida","Alzi l’umidità intorno alla pianta","Ricontrolli le foglie nei giorni seguenti"], why:"Prima eviti il contagio, poi lavi via gli acari. L’aria umida li scoraggia, ma tornano se non controlli." },
  g1:{ t:"order", lv:3, plant:"echeveria", q:"Portare un’echeveria dal negozio al sole pieno del balcone.", steps:["La metti in luce intensa, senza sole diretto","Le dai qualche ora di sole del mattino","Allunghi le ore di sole giorno dopo giorno","La lasci al sole pieno"], why:"Anche le grasse si scottano se passano di colpo dall’ombra al sole. Abituarle per gradi evita le macchie." },
  g2:{ t:"err", lv:3, plant:"zamioculcas", q:"Una di queste abitudini è sbagliata. Quale?", o:["Haworthia: acqua quando la terra è asciutta del tutto","Sansevieria: d’inverno quasi niente acqua","Zamioculcas: un po’ d’acqua ogni due giorni, per sicurezza","Limone: acqua quando i primi centimetri sono asciutti"], a:2, why:"I rizomi della zamioculcas fanno da riserva: annaffiarla spesso vuol dire farla marcire." },
  g3:{ t:"order", lv:3, plant:"mammillaria", q:"Rinvasare una mammillaria senza farsi male.", steps:["Aspetti che la terra sia asciutta","Avvolgi il cactus in una fascia di carta piegata","Lo sfili dal vaso e controlli le radici","Lo metti nel terriccio per cactus e aspetti una settimana prima di annaffiare"], why:"Terra asciutta e niente acqua subito: le radici rovinate nel rinvaso hanno il tempo di cicatrizzare." },
  g4:{ t:"err", lv:3, plant:"lithops", q:"Una di queste regole sui lithops è sbagliata. Quale?", o:["Mentre le foglie vecchie si seccano, niente acqua","Terriccio minerale, che drena benissimo","Se le foglie si raggrinziscono, è sempre il momento di dare tanta acqua","Tanta luce, anche sole"], a:2, why:"Durante il cambio delle foglie le nuove si nutrono delle vecchie, che si raggrinziscono apposta. L’acqua in quel momento fa danni." },
  h1:{ t:"order", lv:3, plant:"gardenia", q:"La gardenia ha le foglie gialle con le venature verdi.", steps:["Riconosci la clorosi: manca ferro","Controlli l’acqua: se è calcarea, passi a piovana o demineralizzata","Dai un concime per acidofile con ferro","Aspetti le foglie nuove, che escono verdi"], why:"Le foglie già gialle spesso restano così: il segno che hai risolto sono quelle nuove." },
  h2:{ t:"err", lv:3, plant:"kumquat", q:"Una di queste cose sul kumquat è sbagliata. Quale?", o:["Si mangia intero, buccia compresa","Vuole tanto sole","Sopporta il freddo un po’ meglio del limone","D’inverno va annaffiato tutti i giorni"], a:3, why:"D’inverno cresce poco e beve poco: l’acqua di troppo fa marcire le radici." },
  h3:{ t:"err", lv:3, plant:"cephalotus", q:"Uno di questi consigli sul cephalotus è sbagliato. Quale?", o:["Torba con tanta perlite, in un vaso alto","Luce intensa, che arrossa le anfore","Sottovaso sempre pieno, come per la dionea","Solo acqua piovana o demineralizzata"], a:2, why:"Il cephalotus vuole la torba umida ma ariosa: con le radici sempre a bagno rischia di marcire." },
  h4:{ t:"order", lv:3, plant:"vanda", q:"Il bagno della vanda a radici nude.", steps:["Immergi le radici in acqua per 15-20 minuti","Le tiri fuori e le lasci sgocciolare","La riappendi in un punto molto luminoso","Aspetti che le radici tornino argentate prima del bagno dopo"], why:"Le radici nude devono bagnarsi e asciugarsi in fretta. Se restano umide a lungo, marciscono." }
};
// Le domande nuove entrano nella seconda lezione di ogni casella (prima dell'Allenamento)
Object.entries(HARD_NEW).forEach(([id, it]) => { const l = (EXTRA[id] || [])[0]; if (l) l.items.push(it); });
const ZONES = [
  { id:"z1", color:"#d9692a", shade:"#a84f1c", title:"Casa tua", desc:"Il davanzale, dove tutto ha inizio. E dove tutto, finora, è morto." },
  { id:"z2", color:"#2284cf", shade:"#1764a0", title:"Mediterraneo", desc:"Sole, sassi e poca acqua. Piante che d’estate non si lamentano. Si vive sul balcone." },
  { id:"z3", color:"#1f9a55", shade:"#157240", title:"Giungla in salotto", desc:"Luce filtrata, aria umida, piante che vogliono attenzioni. Tutte da casa, nessuna al sole." },
  { id:"z4", color:"#d6488d", shade:"#a8306b", title:"Fiori da balcone", desc:"Gerani, petunie, ortensie, bouganville. Il balcone della nonna, ma stavolta sopravvive (forse)." },
  { id:"z5", color:"#8e44ad", shade:"#6c3483", title:"Piante carnivore", desc:"Mangiano insetti, bevono solo acqua piovana e ti giudicano. Il gran finale (per ora)." },
  { id:"z6", color:"#3f51b5", shade:"#2c3a8c", title:"Le dive di casa", desc:"Domande difficili sulle piante di casa che conosci, e nuove dive capricciose. Da qui si fa sul serio." },
  { id:"z7", color:"#9c6b2f", shade:"#744f20", title:"Sassi viventi e grasse rare", desc:"Casi difficili su sole e acqua, e succulente che muoiono d’affetto. Mani lontane dall’annaffiatoio." },
  { id:"z8", color:"#00796b", shade:"#00564c", title:"Collezione rara", desc:"Il misto finale: diagnosi su tutto e piante rare per chi ormai sa il fatto suo." }
];

// ---------- Emergenze: problemi reali, si curano sapendo la risposta ----------
// step = dove si impara la cura: ripassarlo permette di riprovare subito
const EMERG = {
  bas_luce:{ plant:"basilico", step:"s2", title:"Fusti lunghi e pallidi, poche foglie", q:"Cosa fai?", o:["Lo sposti dove prende almeno 6 ore di sole","Lo annaffi di più","Gli togli tutte le foglie"], a:0, why:"Si sta allungando per cercare la luce: ne vuole di più, almeno 6 ore al giorno." },
  bas_fiori:{ plant:"basilico", step:"s1", title:"Cresce tutto in altezza e sta per fiorire", q:"Cosa fai?", o:["Lo cimi: togli le punte sopra una coppia di foglie","Lo lasci fiorire, è bello","Lo rinvasi in un vaso più piccolo"], a:0, why:"Cimandolo resta folto e continua a fare foglie, invece di mettere tutto nei fiori." },
  pot_luce:{ plant:"pothos", step:"s2", title:"Le foglie nuove sono tutte verdi, senza striature", q:"Cosa vuol dire?", o:["Ha poca luce: va spostato in un posto più luminoso, ma non al sole diretto","Ha troppa acqua","Sta benissimo, è più elegante così"], a:0, why:"Con poca luce perde le striature chiare per fare più fotosintesi. Più luce indiretta e tornano." },
  pot_gatto:{ plant:"pothos", step:"s5", title:"Il gatto lo fissa con troppo interesse", q:"Cosa fai?", o:["Lo appendi in alto o lo sposti dove il gatto non arriva","Niente, al massimo il gatto fa merenda","Lo annaffi, così il gatto si spaventa"], a:0, why:"Il pothos è tossico per cani e gatti: va tenuto fuori dalla loro portata." },
  san_sottovaso:{ plant:"sansevieria", step:"s4", title:"Il sottovaso è pieno d’acqua da giorni", q:"Cosa fai?", o:["Lo svuoti subito","Lo lasci, così beve quando vuole","Aggiungi ghiaia sul fondo del vaso"], a:0, why:"Il sottovaso non è una piscina: l’acqua ferma fa marcire la base. E la ghiaia non serve, è un mito." },
  san_storta:{ plant:"sansevieria", step:"s2", title:"Le foglie crescono storte, tutte verso la finestra", q:"Cosa fai?", o:["Giri il vaso ogni tanto","La leghi a un bastone","La annaffi meno"], a:0, why:"Le piante si piegano verso la luce. Girando il vaso ogni tanto crescono dritte." },
  men_invade:{ plant:"menta", step:"s4", title:"Le radici sbucano e stanno invadendo il vaso accanto", q:"Cosa fai?", o:["La metti in un vaso tutto suo, più grande","Tagli le radici che sbucano e basta","Le metti vicino un’altra pianta per tenerla a bada"], a:0, why:"Le sue radici corrono sotto terra e invadono tutto: ha bisogno di un vaso tutto suo." },
  men_spoglia:{ plant:"menta", step:"s5", title:"Pochi steli lunghi e spogli", q:"Cosa fai?", o:["La cimi, come il basilico","La metti al buio, così riposa","Le dai il doppio dell’acqua"], a:0, why:"Cimando le punte, la menta si ramifica e diventa folta." },
  oli_gelo:{ plant:"olivo", step:"m4", title:"Stanotte è previsto gelo forte", q:"Cosa fai?", o:["Lo avvicini al muro e copri chioma e vaso con il tessuto non tessuto","Lo annaffi tanto prima di sera","Lo metti vicino al termosifone"], a:0, why:"Il muro ripara e il tessuto non tessuto protegge. In vaso le radici sono le prime a soffrire il gelo." },
  oli_ombra:{ plant:"olivo", step:"m1", title:"È finito in un angolo d’ombra e non cresce più", q:"Cosa fai?", o:["Lo sposti dove prende sole pieno","Gli dai più acqua","Lo poti a fondo per stimolarlo"], a:0, why:"Senza sole pieno l’olivo vegeta e basta. Più ore di sole, più crescita." },
  ros_ristagno:{ plant:"rosmarino", step:"m2", title:"Gli aghi anneriscono e la terra resta bagnata", q:"Cosa fai?", o:["Svuoti il sottovaso e lo rinvasi in terra più drenante","Lo annaffi di più, sembra secco","Lo sposti all’ombra"], a:0, why:"Radici sempre bagnate: stanno marcendo. Serve terra che drena e niente acqua ferma." },
  ros_talea:{ plant:"rosmarino", step:"m3", title:"Un’amica ne vuole uno uguale", q:"Come gliene fai uno?", o:["Con una talea di una decina di centimetri, senza le foglie in basso, in terra","Le regali un ago e le auguri buona fortuna","Lo dividi a metà con le forbici"], a:0, why:"La talea è il modo più semplice: un rametto in terra e un po’ di pazienza." },
  lav_fioritura:{ plant:"lavanda", step:"m3", title:"La fioritura è finita, gli steli sono secchi", q:"Cosa fai?", o:["La poti: tagli steli secchi e un po’ di verde, senza arrivare al legno vecchio","La tagli a raso, fino alla base","La lasci così fino all’anno prossimo"], a:0, why:"Potata dopo i fiori resta compatta e rifiorisce. Il legno vecchio non si tocca." },
  lav_vaso:{ plant:"lavanda", step:"m2", title:"Dopo il temporale il vaso è pieno d’acqua", q:"Cosa fai?", o:["Svuoti il sottovaso e controlli che il foro non sia otturato","La annaffi lo stesso, è il suo giorno","La lasci, la pioggia fa bene"], a:0, why:"La lavanda muore più di acqua che di sete: l’acqua deve uscire, sempre." },
  fic_pala:{ plant:"ficodindia", step:"m3", title:"Gli si è staccata una pala", q:"Cosa ne fai?", o:["La lasci asciugare qualche giorno e poi la pianti","La pianti subito e la annaffi","La butti"], a:0, why:"Con il taglio cicatrizzato mette radici: è una pianta nuova gratis." },
  fic_pioggia:{ plant:"ficodindia", step:"m4", title:"Inverno piovoso e il vaso è sotto la pioggia", q:"Cosa fai?", o:["Lo sposti al riparo dalla pioggia","Lo lasci, è un cactus resistente","Lo annaffi anche tu, per sicurezza"], a:0, why:"Freddo e umidità insieme fanno marcire le pale. D’inverno all’asciutto." }
};
Object.assign(EMERG, {
  mon_sole:{ plant:"monstera", step:"j1", title:"Macchie gialle e secche sulle foglie vicino al vetro", q:"Cosa fai?", o:["La allontani un po’ dal sole diretto","La annaffi di più","Tagli tutte le foglie macchiate e la lasci lì"], a:0, why:"Sono scottature: il sole diretto attraverso il vetro brucia le foglie. Luce sì, sole sulle foglie no." },
  mon_intere:{ plant:"monstera", step:"j1", title:"Le foglie nuove escono piccole e senza buchi", q:"Cosa le manca?", o:["Più luce indiretta","Più acqua","Un vaso più piccolo"], a:0, why:"Con poca luce fa foglie piccole e intere. Avvicinala a una finestra luminosa, senza sole diretto." },
  cal_punte:{ plant:"calathea", step:"j2", title:"Punte delle foglie marroni e arricciate", q:"Cosa fai?", o:["La raggruppi con altre piante o la metti su argilla espansa bagnata","Le dai più sole","La spruzzi una volta e basta"], a:0, why:"Aria troppo secca. Più umidità intorno, e se l’acqua di casa è calcarea, meglio quella filtrata." },
  cal_sbiadita:{ plant:"calathea", step:"j1", title:"I disegni delle foglie si stanno sbiadendo", q:"Cosa fai?", o:["La sposti lontano dal sole diretto","La concimi il doppio","La metti in bagno al buio"], a:0, why:"Il sole diretto sbiadisce e brucia le foglie: vuole luce indiretta." },
  orc_fiori:{ plant:"orchidea", step:"j4", title:"Sono caduti tutti i fiori", q:"Cosa fai?", o:["Continui a curarla: sta riposando","La butti, è finita","La metti al buio per farla dormire"], a:0, why:"Dopo i fiori riposa. Foglie e radici sono vive, e con qualche notte fresca rifiorirà." },
  orc_radici:{ plant:"orchidea", step:"j3", title:"Nel vaso trasparente le radici sono molli e marroni", q:"Cosa fai?", o:["Togli le radici marce, la rinvasi in corteccia nuova e la annaffi meno","La annaffi di più, sembrano secche","Le copri con il terriccio"], a:0, why:"Radici molli e marroni sono marce: troppa acqua ferma. Si tolgono e si riparte da corteccia fresca." },
  fel_termo:{ plant:"felce", step:"j2", title:"È sopra il termosifone e perde foglie a pioggia", q:"Cosa fai?", o:["La sposti lontano dal termosifone, in un posto più umido","La annaffi ogni ora","Le togli le foglie rimaste, così non le perde"], a:0, why:"Il caldo secco del termosifone la disidrata. Meglio un bagno luminoso o un angolo lontano dal calore." },
  fel_puntini:{ plant:"felce", step:"j4", title:"Puntini marroni sotto le fronde", q:"Cosa fai?", o:["Guardi bene: se sono in file ordinate sono spore, e va tutto bene","La butti, è malata","La spruzzi con l’insetticida senza guardare"], a:0, why:"Le spore stanno in file ordinate. Le cocciniglie sono sparse e si staccano con l’unghia." }
});
// Emergenze delle piante nuove. "lesson" = in quale lezione della casella si impara la cura (0 = Le basi)
Object.assign(EMERG, {
  zam_acqua:{ plant:"zamioculcas", step:"s3", lesson:1, title:"Steli gialli alla base e terra sempre bagnata", q:"Cosa fai?", o:["Smetti di annaffiare e lasci asciugare bene la terra","Annaffi di più, sembra sofferente","La metti al sole per asciugarla in fretta"], a:0, why:"I rizomi stanno marcendo: troppa acqua. La zamioculcas va dimenticata, non annegata." },
  zam_vaso:{ plant:"zamioculcas", step:"s4", lesson:1, title:"Il vaso di plastica si è deformato", q:"Cosa fai?", o:["La rinvasi in un vaso appena più grande","Lo stringi con il nastro adesivo","Tagli i rizomi che spingono"], a:0, why:"I rizomi sono cresciuti e chiedono spazio: vaso nuovo, qualche centimetro più largo." },
  spa_floscio:{ plant:"spatifillo", step:"s3", lesson:1, title:"Tutte le foglie afflosciate a terra", q:"Cosa fai?", o:["Lo annaffi: in poche ore si rialza","Lo butti, è finita","Lo leghi a un bastone"], a:0, why:"È la sua scena madre per dire che ha sete. Acqua, e domani è come nuovo." },
  spa_gatto:{ plant:"spatifillo", step:"s3", lesson:1, title:"Il gatto ha morsicchiato una foglia", q:"Cosa fai?", o:["Lo sposti fuori portata e, se il gatto sta male, chiami il veterinario","Niente, è una pianta, cosa vuoi che sia","Spruzzi la foglia con il limone"], a:0, why:"Lo spatifillo irrita bocca e stomaco degli animali: va tenuto dove non arrivano." },
  lim_giallo:{ plant:"limone", step:"m2", lesson:1, title:"Foglie gialle con le venature verdi", q:"Cosa fai?", o:["Gli dai un concime con ferro per agrumi","Lo sposti all’ombra","Gli togli tutte le foglie gialle e basta"], a:0, why:"È clorosi ferrica: il calcare blocca il ferro. Concime con ferro, e se puoi acqua meno calcarea." },
  lim_polloni:{ plant:"limone", step:"m3", lesson:1, title:"Dalla base spuntano rami dritti pieni di spine", q:"Cosa fai?", o:["Li tagli: sono polloni del portainnesto","Li lasci, faranno limoni enormi","Li leghi al tronco"], a:0, why:"Vengono dalla pianta su cui è innestato e rubano energie al limone vero." },
  sal_legnosa:{ plant:"salvia", step:"m3", lesson:1, title:"Tutta legno alla base, poche foglie in cima", q:"Cosa fai?", o:["In primavera la accorci, senza arrivare al legno spoglio","La tagli a raso, così riparte","La annaffi il doppio"], a:0, why:"Una potatura in primavera la ringiovanisce. Il legno vecchio e spoglio non si tocca." },
  sal_fradicia:{ plant:"salvia", step:"m2", lesson:1, title:"Foglie molli e annerite, terra sempre bagnata", q:"Cosa fai?", o:["Svuoti il sottovaso e la rinvasi in terra drenante","La annaffi di più","La porti in casa al caldo"], a:0, why:"La salvia marcisce con i piedi bagnati: terra che drena e niente acqua ferma." },
  til_centro:{ plant:"tillandsia", step:"j2", lesson:1, title:"Il centro della rosetta è scuro e molle", q:"Cosa fai?", o:["Togli le foglie marce e da ora la fai asciugare capovolta dopo ogni bagno","La pianti nel terriccio","La lasci in ammollo per una notte"], a:0, why:"L’acqua ferma al centro l’ha fatta marcire. Dopo il bagno, sempre a testa in giù." },
  til_secca:{ plant:"tillandsia", step:"j2", lesson:1, title:"Foglie arricciate e leggerissime", q:"Cosa fai?", o:["Un bagno di 20-30 minuti, poi ad asciugare capovolta","La metti al sole diretto","Niente, vive d’aria"], a:0, why:"Vive d’aria, ma non solo d’aria: ha sete. Bagno e asciugatura, e si riprende." },
  fic_trasloco:{ plant:"ficus", step:"j1", lesson:1, title:"Perde foglie dopo che l’hai spostato", q:"Cosa fai?", o:["Lo lasci nel nuovo posto, se è luminoso, e smetti di spostarlo","Lo sposti ancora, finché trova il posto giusto","Gli togli tutte le foglie, così non le perde"], a:0, why:"Il ficus odia i traslochi: perde foglie per protesta, poi si abitua. Basta non spostarlo di nuovo." },
  fic_polvere:{ plant:"ficus", step:"j1", lesson:1, title:"Le foglie sono grigie di polvere", q:"Cosa fai?", o:["Le pulisci con un panno umido","Le lucidi con l’olio","Le lasci, è un effetto vintage"], a:0, why:"La polvere ruba luce. Un panno umido basta: l’olio chiude i pori della foglia." },
  ger_sfiorito:{ plant:"geranio", step:"f2", lesson:0, title:"Pieno di fiori secchi, pochi nuovi", q:"Cosa fai?", o:["Togli gli steli dei fiori secchi","Lo annaffi il doppio","Lo sposti all’ombra"], a:0, why:"Senza semi da fare, la pianta torna a fiorire." },
  ger_gelo:{ plant:"geranio", step:"f4", lesson:0, title:"Stanotte gela e il geranio è fuori", q:"Cosa fai?", o:["Lo porti al riparo, in un posto fresco e luminoso","Lo annaffi per scaldarlo","Lo lasci, è un duro"], a:0, why:"Il geranio non regge il gelo: al riparo, con pochissima acqua, fino a primavera." },
  pet_spoglia:{ plant:"petunia", step:"f3", lesson:1, title:"Fusti lunghi e spogli, fiori solo in punta", q:"Cosa fai?", o:["La accorci un po’","La annaffi il triplo","La lasci, prima o poi si sistema"], a:0, why:"Una spuntatina a metà estate: ramifica e rifiorisce." },
  pet_sete:{ plant:"petunia", step:"f1", lesson:0, title:"Afflosciata dopo una giornata di sole", q:"Cosa fai?", o:["La annaffi: in vaso al sole si secca in fretta","La sposti in casa","Le togli i fiori"], a:0, why:"Vaso piccolo e sole pieno: d’estate beve quasi ogni giorno." },
  ort_sole:{ plant:"ortensia", step:"f1", lesson:1, title:"Foglie bruciate dopo il sole del pomeriggio", q:"Cosa fai?", o:["La sposti in mezz’ombra, con il sole solo al mattino","La annaffi solo sulle foglie, al sole","La lasci, si abituerà"], a:0, why:"Il sole forte del pomeriggio la brucia: mezz’ombra è casa sua." },
  ort_rosa:{ plant:"ortensia", step:"f3", lesson:0, title:"Era blu e ora fa fiori rosa", q:"Cosa è successo?", o:["La terra è diventata meno acida, magari per l’acqua calcarea","Ha cambiato idea","Ha preso troppo sole"], a:0, why:"Il colore dipende dalla terra: con il calcare torna rosa. Terriccio per acidofile e acqua meno dura, se la vuoi blu." },
  bou_gelo:{ plant:"bouganville", step:"f4", lesson:0, title:"Arriva il primo gelo", q:"Cosa fai?", o:["La porti al riparo dal gelo","La copri di acqua calda","La lasci fuori, è tropicale ma coraggiosa"], a:0, why:"La bouganville teme il gelo: d’inverno al riparo, luminoso e con poca acqua." },
  bou_foglie:{ plant:"bouganville", step:"f2", lesson:1, title:"Tante foglie, zero fiori", q:"Cosa fai?", o:["Meno acqua e più sole","Più acqua e più concime per foglie","La sposti all’ombra"], a:0, why:"Troppa acqua e poca luce fanno foglie. Un po’ di secco e tanto sole la fanno fiorire." }
});
Object.assign(EMERG, {
  dio_rubinetto:{ plant:"dionea", step:"c2", lesson:0, title:"Foglie che anneriscono dopo settimane di acqua del rubinetto", q:"Cosa fai?", o:["Passi all’acqua piovana o demineralizzata e sciacqui bene la torba","Aggiungi concime per tirarla su","Continui così, si abituerà"], a:0, why:"I sali del rubinetto si accumulano nella torba. Acqua pulita e un bel risciacquo per portarli via." },
  dio_carne:{ plant:"dionea", step:"c1", lesson:0, title:"Qualcuno le ha dato un pezzo di prosciutto", q:"Cosa fai?", o:["Togli la trappola annerita e niente più carne","Le dai anche il formaggio, per bilanciare","Aspetti che lo digerisca"], a:0, why:"La carne marcisce nella trappola e la fa morire. Al massimo piccoli insetti vivi." },
  sar_ombra:{ plant:"sarracenia", step:"c3", lesson:0, title:"Trombe verdi pallide, molli e storte", q:"Cosa le manca?", o:["Sole pieno","Più concime","Più ombra"], a:0, why:"Senza sole pieno le trombe restano deboli e senza colore. Sul balcone, nel punto più soleggiato." },
  sar_inverno:{ plant:"sarracenia", step:"c4", lesson:0, title:"È inverno e sta ingiallendo tutta", q:"Cosa fai?", o:["Niente di drastico: è il letargo, togli solo le parti secche","La porti al caldo vicino al termosifone","La butti"], a:0, why:"Riposa al fresco e in primavera riparte. Il caldo d’inverno la esaurirebbe." },
  dro_secca:{ plant:"drosera", step:"c2", lesson:0, title:"Niente più goccioline e torba asciutta", q:"Cosa fai?", o:["Riempi il sottovaso con acqua piovana","La lasci asciugare ancora","Le spruzzi colla vinilica sulle foglie"], a:0, why:"Pianta di palude: torba sempre bagnata. Con l’acqua tornano anche le goccioline." },
  dro_concime:{ plant:"drosera", step:"c4", lesson:0, title:"Qualcuno l’ha concimata col concime universale", q:"Cosa fai?", o:["La rinvasi in torba nuova e niente più concime","Raddoppi il concime","La metti al buio"], a:0, why:"Il concime nella terra le brucia le radici: torba nuova, povera, e acqua piovana." },
  nep_anfore:{ plant:"nepenthes", step:"c3", lesson:1, title:"Non fa più anfore, solo foglie", q:"Cosa fai?", o:["Le dai più luce e più umidità nell’aria","Le dai carne macinata","La concimi il doppio"], a:0, why:"Le anfore arrivano con luce e aria umida. Il resto non serve." },
  nep_sottovaso:{ plant:"nepenthes", step:"c2", lesson:1, title:"Il sottovaso è pieno da giorni e le foglie ingialliscono", q:"Cosa fai?", o:["Svuoti il sottovaso: lei non è di palude","Lo riempi ancora di più","Aggiungi acqua del rubinetto"], a:0, why:"La nepenthes non vuole i piedi nell’acqua: terriccio umido ma drenante." }
});
Object.assign(EMERG, {
  alo_gocce:{ plant:"alocasia", step:"d1", lesson:1, title:"Gocce sulle punte e foglie basse che ingialliscono", q:"Cosa fai?", o:["Annaffi meno e lasci asciugare i primi centimetri","Annaffi di più","La metti al sole"], a:0, why:"Guttazione e foglie gialle in basso: le arriva più acqua di quanta ne usi." },
  alo_spiffero:{ plant:"alocasia", step:"d1", lesson:1, title:"Vicino alla porta del balcone, d’inverno, perde foglie", q:"Cosa fai?", o:["La sposti lontano dagli spifferi, in luce indiretta","La annaffi con acqua calda","La copri con un sacchetto"], a:0, why:"Le dive odiano gli spifferi freddi: posto riparato e luminoso." },
  fit_crollo:{ plant:"fittonia", step:"d2", lesson:1, title:"Crollata, foglie sdraiate sul vaso", q:"Cosa fai?", o:["La annaffi: si rialza in poco tempo","La butti","La metti al sole per tirarla su"], a:0, why:"Scena madre da sete. Acqua, e torna in piedi. Ma non farglielo fare troppo spesso." },
  fit_sole:{ plant:"fittonia", step:"d2", lesson:1, title:"Foglie bruciate dopo una giornata sul davanzale al sole", q:"Cosa fai?", o:["La sposti in luce indiretta","La annaffi di più","Le togli tutte le foglie"], a:0, why:"Il sole diretto le brucia: viene dal sottobosco." },
  mar_punte:{ plant:"maranta", step:"d3", lesson:1, title:"Punte secche e foglie arricciate", q:"Cosa fai?", o:["Più umidità intorno e acqua poco calcarea","Più sole","Concime per cactus"], a:0, why:"Come la calathea: aria secca e calcare sono i suoi nemici." },
  mar_secca:{ plant:"maranta", step:"d3", lesson:1, title:"Terra secca da giorni e foglie arrotolate", q:"Cosa fai?", o:["La annaffi e da ora tieni la terra leggermente umida","La lasci asciugare ancora","La metti in pieno sole"], a:0, why:"Vuole la terra sempre appena umida: secca, arrotola le foglie." },
  beg_oidio:{ plant:"begonia", step:"d5", lesson:0, title:"Macchie bianche polverose sulle foglie", q:"Cosa fai?", o:["Togli le foglie colpite, più aria intorno, niente acqua sulle foglie","La spruzzi di più","La chiudi in una scatola"], a:0, why:"È oidio, un fungo: ama l’aria ferma e le foglie bagnate." },
  beg_spruzzi:{ plant:"begonia", step:"d4", lesson:1, title:"Qualcuno la spruzza ogni giorno e compaiono macchie", q:"Cosa fai?", o:["Smetti di bagnare le foglie e dai umidità intorno","La spruzzi due volte al giorno","La metti sotto la doccia"], a:0, why:"Foglie bagnate e ferme: muffe in arrivo. Umidità sì, ma non sulle foglie." },
  ech_filata:{ plant:"echeveria", step:"g1", lesson:1, title:"Si allunga verso la finestra e la rosetta si apre", q:"Cosa fai?", o:["La sposti sul balcone al sole","La annaffi di più","La metti in bagno"], a:0, why:"Si sta filando per cercare luce: le serve sole vero." },
  ech_marcia:{ plant:"echeveria", step:"g1", lesson:1, title:"Foglie basse molli e traslucide", q:"Cosa fai?", o:["Togli le foglie molli e lasci asciugare a lungo","Annaffi di più","La concimi"], a:0, why:"Primo segno di marciume da acqua: asciutto, e annaffiature molto più rare." },
  haw_rossa:{ plant:"haworthia", step:"g2", lesson:1, title:"Rossastra e con le punte secche dopo l’estate al sole", q:"Cosa fai?", o:["La riporti alla luce indiretta","La annaffi ogni giorno","La metti al buio"], a:0, why:"Si è scottata: in natura vive all’ombra di rocce e cespugli." },
  haw_figli:{ plant:"haworthia", step:"g2", lesson:1, title:"Il vaso è pieno di figli che spingono", q:"Cosa fai?", o:["Stacchi i figli con le loro radici e li rinvasi","Li tagli e li butti","Niente, si arrangiano"], a:0, why:"Ogni figlio è una pianta nuova gratis." },
  mam_fiori:{ plant:"mammillaria", step:"g3", lesson:1, title:"Non fiorisce mai: sta al caldo e la annaffi anche d’inverno", q:"Cosa cambi?", o:["D’inverno al fresco e quasi senz’acqua","Più acqua d’inverno","Più concime d’inverno"], a:0, why:"Senza riposo invernale niente corona di fiori." },
  mam_marcia:{ plant:"mammillaria", step:"g3", lesson:1, title:"Base scura e molle, in terra sempre umida", q:"Cosa fai?", o:["Togli la parte marcia e la rinvasi in terriccio per cactacee asciutto","Annaffi di più","La metti in torba"], a:0, why:"Marciume: nei cactus l’acqua in più non perdona. Terra drenante e asciutta." },
  lit_spacca:{ plant:"lithops", step:"g4", lesson:1, title:"Si è gonfiato e la pelle si spacca", q:"Cosa fai?", o:["Smetti di annaffiare per un bel po’","Annaffi ancora","Lo copri con la colla"], a:0, why:"Ha bevuto più di quanto riesce a contenere." },
  lit_cambio:{ plant:"lithops", step:"g4", lesson:1, title:"Fa foglie nuove e quelle vecchie si raggrinziscono", q:"Cosa fai?", o:["Niente acqua: le nuove si nutrono delle vecchie","Annaffi per aiutarlo","Togli subito le foglie vecchie"], a:0, why:"È il cambio di foglie: le vecchie si svuotano da sole. L’acqua adesso lo uccide." },
  gar_boccioli:{ plant:"gardenia", step:"h1", lesson:1, title:"Lascia cadere i boccioli dopo lo spostamento", q:"Cosa fai?", o:["Le trovi un posto fisso, senza sbalzi, e non la sposti più","La sposti di nuovo","La concimi tanto"], a:0, why:"Odia i cambiamenti di posto e di temperatura." },
  gar_gialla:{ plant:"gardenia", step:"h1", lesson:1, title:"Foglie gialle con le venature verdi", q:"Cosa fai?", o:["Concime con ferro, terra acida e acqua non calcarea","Più sole","Acqua del rubinetto"], a:0, why:"Clorosi ferrica: il calcare blocca il ferro." },
  kum_gelo:{ plant:"kumquat", step:"h2", lesson:1, title:"Prevista una gelata forte", q:"Cosa fai?", o:["Lo porti al riparo, anche se regge più del limone","Lo lasci fuori, è robusto","Lo annaffi per scaldarlo"], a:0, why:"Regge il freddo meglio del limone, ma le gelate forti no." },
  kum_ferro:{ plant:"kumquat", step:"h2", lesson:1, title:"Foglie gialle con le venature verdi", q:"Cosa fai?", o:["Concime con ferro per agrumi","Più ombra","Acqua più calcarea"], a:0, why:"Stessa clorosi del limone." },
  cep_verde:{ plant:"cephalotus", step:"h3", lesson:1, title:"Anfore piccole e tutte verdi", q:"Cosa fai?", o:["Gli dai più luce","Acqua del rubinetto","Concime"], a:0, why:"Con più luce le anfore crescono e si colorano di rosso scuro." },
  cep_rubinetto:{ plant:"cephalotus", step:"h3", lesson:1, title:"Crosticine bianche sulla torba dopo l’acqua del rubinetto", q:"Cosa fai?", o:["Passi all’acqua piovana e sciacqui la torba","Aggiungi concime","Continui così"], a:0, why:"Sono sali: per una carnivora sono veleno." },
  van_sete:{ plant:"vanda", step:"h4", lesson:1, title:"Radici argentate e foglie raggrinzite, d’estate", q:"Cosa fai?", o:["Bagni più frequenti, anche ogni giorno","Meno luce","La pianti nel terriccio"], a:0, why:"D’estate beve tantissimo: le radici nude asciugano in fretta." },
  van_terra:{ plant:"vanda", step:"h4", lesson:1, title:"Qualcuno l’ha messa nel terriccio: radici molli", q:"Cosa fai?", o:["Togli le radici marce e la rimetti a radice nuda","Annaffi di più","Aggiungi altro terriccio"], a:0, why:"Le sue radici vogliono aria: nel terriccio soffocano." }
});

// ---------- Glossario: parole colorate nelle domande ----------
// Al posto delle schede iniziali: le parole qui sotto si colorano nelle domande le prime volte che le incontri,
// e toccandole compare la spiegazione. "forms" sono i modi in cui la parola compare nel testo
// (un asterisco finale vuol dire "e tutto quello che segue": rinvas* trova rinvaso, rinvasare, rinvasata...).
// Le piante hanno la loro voce in PLANT_HINT: il nome si colora da solo, con il disegno.
const PLANT_HINT = {
  basilico:"La vittima più famosa. Il vasetto del supermercato muore quasi sempre: dentro ci sono decine di piantine che si rubano luce e acqua. Tipo un monolocale da fuorisede in sei.",
  pothos:"Rampicante con foglie a cuore, spesso striate di giallo o bianco. Quasi indistruttibile: per questo lo regalano a chiunque.",
  sansevieria:"Foglie dritte e dure come spade. Stoica: accumula acqua e resta zitta per settimane. La uccide solo l’amore in eccesso.",
  menta:"Aromatica fresca, ama la terra umida. Le sue radici corrono sotto terra e invadono tutto: coinquilina pessima.",
  olivo:"Viene da estati lunghe, calde e secche, come rosmarino e lavanda. Tanto sole, poca acqua. Dietro un vetro si deprime, sul balcone rinasce.",
  rosmarino:"Mediterraneo duro e puro: sole pieno, terra che drena, acqua con moderazione. Muore più spesso annegato che di sete.",
  lavanda:"Spighe viola e profumo da cassetto della nonna. Vuole sole pieno e terra povera: più la tratti male, più fiorisce.",
  ficodindia:"Un cactus arrivato dalle Americhe secoli fa, oggi più siciliano dei cannoli. Le sue “foglie” sono fusti piatti, le pale, che fanno da serbatoio.",
  monstera:"Viene dalla giungla, dove la luce arriva filtrata dagli alberi. In casa: vicino alla finestra, ma senza sole sulle foglie. I buchi arrivano con l’età.",
  calathea:"Foglie disegnate come un tappeto, che la sera si alzano. Bellissima e permalosa: aria secca e acqua calcarea la offendono.",
  orchidea:"Non tocca mai terra: in natura sta aggrappata agli alberi, con le radici all’aria. Quando i fiori cadono non è morta, sta riposando.",
  felce:"Una delle piante più antiche del pianeta. Ama l’aria umida e la terra sempre fresca: il termosifone è il suo nemico giurato.",
  zamioculcas:"La pianta da corridoio: si accontenta di poca luce. Si accontenta, non la adora. Sotto terra ha bulbi grossi che fanno da serbatoio.",
  spatifillo:"Foglie lucide e “fiore” bianco. È una pianta drammatica: quando ha sete crolla con una scena madre, poi beve e si rialza.",
  limone:"Il sogno di ogni balcone: fiori profumati, frutti, foglie lucide tutto l’anno. Mediterraneo d’adozione: viene dall’Asia.",
  salvia:"Foglie vellutate e grigie, parente del rosmarino. Con gli anni diventa legnosa alla base: una potatura in primavera la tiene giovane. Magari funzionasse anche con noi.",
  tillandsia:"La pianta senza terra: beve dalle foglie, coperte di squame argentate. In natura sta appesa agli alberi e vive di pioggia e umidità.",
  ficus:"Foglie grandi, spesse e lucide, come di gomma. Un tempo dal suo lattice si ricavava proprio la gomma. Odia i traslochi.",
  geranio:"Il re dei balconi. In realtà non è un geranio ma un Pelargonium: un errore diventato tradizione, come la panna nella carbonara (no).",
  petunia:"Fiori a trombetta tutta l’estate, a patto di avere sole, acqua e concime. Di solito si tiene un anno solo.",
  ortensia:"Il nome scientifico, Hydrangea, vuol dire più o meno “vaso d’acqua”. Non è un caso: è tra le più assetate del balcone.",
  bouganville:"Rampicante dei posti caldi, con macchie di colore accesissime. Quelle non sono petali: sono foglie colorate.",
  dionea:"La carnivora con la tagliola. Viene dalle paludi della Carolina, dove la terra è poverissima: gli insetti sono il suo integratore.",
  sarracenia:"Carnivora a trombe: l’insetto scivola dentro e non esce più. Vuole sole pieno, è con la luce che le trappole si colorano.",
  drosera:"Carnivora a colla: tentacoli con goccioline appiccicose. Si accontenta anche di un davanzale molto luminoso.",
  nepenthes:"Carnivora tropicale con anfore che pendono dalle foglie. Non è di palude: le piace l’aria umida, non i piedi nell’acqua.",
  alocasia:"Cugina della monstera: foglie enormi a orecchio d’elefante, venature chiare. Carattere da diva: troppa acqua, poca luce o uno spiffero, e si offende.",
  fittonia:"Foglie piccole a mosaico, con venature bianche o rosa. Se ha sete crolla tutta come in un film muto, poi beve e si rialza in un’ora.",
  maranta:"Cugina della calathea. La “pianta della preghiera” vera è lei: la sera alza le foglie come mani giunte.",
  begonia:"Foglie verde scuro con pois argentati e il retro rosso: sembra disegnata da qualcuno con troppo caffè in corpo. Bellissima e delicata.",
  echeveria:"La rosa di pietra: rosetta carnosa, spesso coperta da una polverina chiara. Sensibilissima a due cose: poco sole e troppa acqua.",
  haworthia:"Piccola succulenta a rosetta, spesso a strisce bianche come una zebra. Non ama il sole cocente: perfetta per il davanzale di casa.",
  mammillaria:"Piccolo cactus tondo con spine sottili, che in primavera si fa una corona di fiorellini. Il trucco: un inverno fresco e asciutto.",
  lithops:"I sassi viventi: due foglie carnose colorate come le pietre del deserto. Coltivarli è un esame di autocontrollo: quasi sempre, non fare niente.",
  gardenia:"Fiori bianchi dal profumo fortissimo e carattere difficile: terra acida, acqua non calcarea. Basta uno sbalzo e lascia cadere i boccioli, offesa.",
  kumquat:"Agrume piccolo che si mangia con la buccia: dolce fuori, aspro dentro. Regge il freddo meglio del limone, ma ha le stesse manie.",
  cephalotus:"Carnivora di un angolo minuscolo dell’Australia: piccole anfore pelose con il coperchio, una nepenthes in miniatura. Rara, lenta, permalosa.",
  vanda:"Orchidea dai fiori enormi, spesso blu-viola, coltivata a radice nuda. Affamata di luce e d’acqua: per molti la più difficile da tenere in casa."
};
// Nomi alternativi con cui le piante compaiono nelle domande
const PLANT_FORMS = { ficodindia:["fico d’India","fichi d’India"], ficus:["ficus elastica","ficus"], begonia:["begonia maculata","begonia","begonie"], orchidea:["orchidea","orchidee","phalaenopsis"], ortensia:["ortensia","ortensie"], geranio:["geranio","gerani"], petunia:["petunia","petunie"], felce:["felce","felci"], lithops:["lithops"], kumquat:["kumquat"] };
const GLOSS = {
  luce:{ forms:["luce indiretta","luce diretta","sole diretto"], text:"Luce diretta: il sole che colpisce le foglie. Indiretta: la stanza è luminosa, ma il sole non le tocca. Ogni pianta ha i suoi gusti, come per il caffè." },
  cimatura:{ forms:["sopra una coppia di foglie","togli le punte"], text:"È la cimatura: tagli la punta sopra una coppia di foglie e la pianta, invece di salire, si allarga. Come potare, ma con la mozzarella." },
  marciume:{ forms:["marcire","marcisce","marciscono","marciume","marce","marcia"], text:"Il killer numero uno. Le piante di casa non muoiono di sete: muoiono annegate. Con la terra sempre zuppa le radici non respirano e marciscono." },
  ristagno:{ forms:["ristagn*","troppa acqua"], text:"Acqua ferma nel vaso o nel sottovaso. Le radici restano a bagno e smettono di respirare. Amore sì, ma con moderazione." },
  sottovaso:{ forms:["sottovaso"], text:"Raccoglie l’acqua in più e va svuotato: non è una piscina. L’eccezione sono le carnivore di palude, che lo vogliono pieno." },
  drenaggio:{ forms:["drenaggio","drena","drenante"], text:"Quanto in fretta l’acqua in più esce dalla terra. Terra che drena: l’acqua passa e se ne va. Terra pesante: l’acqua resta e le radici affogano." },
  rinvaso:{ forms:["rinvas*"], text:"Un trasloco in un vaso più grande. Va fatto al momento giusto e senza esagerare: il monolocale in sei non va bene, ma neanche la villa con piscina." },
  rizoma:{ forms:["rizom*"], text:"Un fusto sotterraneo gonfio che fa da serbatoio d’acqua e di energia. Per questo chi ce l’ha beve poco." },
  talea:{ forms:["talea","talee"], text:"Un pezzo di pianta che, in acqua o in terra, mette radici e diventa una pianta nuova. Piante gratis, legalmente." },
  nodo:{ forms:["nodo"], text:"Il punto del fusto da cui nascono foglie e radici. Una talea senza nodo resta un rametto e basta." },
  afflosciata:{ forms:["afflosciat*","affloscia","crollata"], text:"Alcune piante ti avvisano della sete con una scena madre: crollano. Altre accumulano acqua e stanno zitte. Conoscerne il carattere evita omicidi." },
  mediterranee:{ forms:["mediterrane*"], text:"Vengono da posti con estati lunghe, calde e secche. Tanto sole, poca acqua, terra che drena. Dietro un vetro si deprimono." },
  calcare:{ forms:["calcare","calcarea","calcaree","acqua dura"], text:"Il nemico nascosto. Blocca il ferro nella terra e le foglie ingialliscono, anche se le venature restano verdi." },
  clorosi:{ forms:["venature verdi","venature restano verdi"], text:"Foglie gialle con le venature verdi: si chiama clorosi. Di solito manca ferro, spesso per colpa del calcare." },
  potatura:{ forms:["pota","poti","potare","potata","potato","potatura"], text:"Potare non vuol dire fare male alla pianta: vuol dire dirle dove crescere. Attenzione però al legno vecchio." },
  legno:{ forms:["legno"], text:"Le mediterranee con gli anni diventano legnose alla base. Se tagli sul legno vecchio e spoglio, spesso non rispuntano più." },
  gelo:{ forms:["gelo","gelata","gela"], text:"Un vaso è peggio della terra: le radici sono fuori, al freddo, senza coperta. Le piante dei posti caldi col gelo non sopravvivono." },
  polloni:{ forms:["polloni","portainnesto"], text:"Rami selvatici che spuntano dalla base, sotto l’innesto. Rubano energia alla pianta buona: vanno tagliati." },
  umidita:{ forms:["aria secca","aria umida","umidità","termosifone"], text:"Le tropicali vengono da posti dove l’aria è umida tutto l’anno. In casa, coi termosifoni accesi, l’aria è secca come nel deserto." },
  squame:{ forms:["squame"], text:"Minuscole scaglie sulle foglie della tillandsia: catturano acqua e nutrienti dall’aria. Per questo è argentata." },
  epifite:{ forms:["epifit*"], text:"Piante che vivono appoggiate su altre piante, senza rubare niente. Usano gli alberi come scala per stare più vicine alla luce." },
  radiciaeree:{ forms:["radici aeree","radici che escono dal fusto"], text:"Radici che stanno all’aria invece che sotto terra. Servono ad aggrapparsi, e alcune anche a bere umidità." },
  lattice:{ forms:["lattice","liquido bianco"], text:"Il liquido bianco che esce da alcune piante tagliate. Appiccicoso e irritante: guanti, e niente occhi." },
  stelo:{ forms:["stelo"], text:"Il gambo che porta i fiori. Nell’orchidea, se è ancora verde, a volte rifiorisce da un nodo." },
  figli:{ forms:["figli","figlio"], text:"Piantine nuove che nascono alla base della madre. Si staccano quando sono abbastanza grandi da cavarsela." },
  spore:{ forms:["spore"], text:"Le felci non fanno fiori né semi: si riproducono con le spore, puntini marroni sotto le fronde. Tutto normale." },
  fronde:{ forms:["fronde"], text:"Le foglie delle felci, divise in tante fogliette. Si chiamano così per fare i botanici." },
  mezzombra:{ forms:["mezz’ombra","mezza ombra"], text:"Qualche ora di sole, meglio quello gentile del mattino, e ombra nel resto della giornata." },
  sfiorire:{ forms:["fiori appassiti","fiori secchi","teste secche"], text:"Quando un fiore appassisce, la pianta inizia a fare semi, e fare semi stanca. Togliendo i fiori secchi la convinci a fiorire ancora." },
  concime:{ forms:["concime","concimi","concimata","concimano","concimare","azoto","potassio"], text:"Cibo per la pianta. L’azoto spinge le foglie, il potassio i fiori. Troppo concime fa più danni di troppo poco." },
  terraacida:{ forms:["acida","acidofile"], text:"Terra con poco calcare. Ortensie blu, gardenie e carnivore la vogliono: con la terra calcarea ingialliscono o cambiano colore." },
  brattee:{ forms:["brattea","brattee"], text:"Foglie colorate attorno ai fiori veri, che spesso sono minuscoli. Sembrano petali, ma è un trucco per attirare gli impollinatori." },
  annuale:{ forms:["annuale","annuali"], text:"Una pianta che vive una stagione: nasce, fiorisce, fa i semi e saluta. Non è colpa tua. Stavolta." },
  carnivore:{ forms:["carnivor*"], text:"Vivono in terre poverissime e prendono l’azoto dagli insetti. L’energia la fanno col sole, come tutte: gli insetti sono l’integratore." },
  trappole:{ forms:["trappol*","tagliola"], text:"Ogni carnivora ha il suo trucco: la dionea chiude una tagliola, la drosera incolla, sarracenia e nepenthes preparano un pozzo. Quattro film horror diversi." },
  anfore:{ forms:["anfor*"], text:"Trappole a forma di vaso, piene di liquido digestivo. L’insetto ci cade dentro e non esce più." },
  demineralizzata:{ forms:["piovana","demineralizzata","acqua del rubinetto"], text:"Acqua povera di sali e di calcare. Per carnivore e piante che odiano il calcare è la scelta giusta: il rubinetto, spesso, di calcare ne porta parecchio." },
  riposo:{ forms:["riposo invernale","riposo","letargo"], text:"D’inverno alcune piante si fermano e sembrano morte. Non lo sono. Senza questo riposo al fresco, in pochi anni si esauriscono. Come noi senza ferie." },
  torba:{ forms:["torba","perlite","sabbia silicea"], text:"La terra delle carnivore di palude: povera e acida, di solito torba bionda con perlite o sabbia. Il terriccio universale per loro è veleno." },
  universale:{ forms:["terriccio universale"], text:"Il terriccio da supermercato, ricco di concime. Va bene per tante piante, ma è troppo ricco per grasse, mediterranee e carnivore." },
  guttazione:{ forms:["guttazione"], text:"Goccioline che la pianta spinge fuori dalla punta delle foglie quando ha acqua in più. Non sta piangendo, giuro." },
  nordsud:{ forms:["finestra a nord","finestra a sud","a nord","a sud","a est"], text:"Sud: tanto sole diretto. Nord: luce tutto il giorno, ma mai sole. Est: il sole gentile del mattino. Dire “luce indiretta” è facile, scegliere la finestra è un mestiere." },
  parassiti:{ forms:["ragnetto rosso","cocciniglia","cocciniglie","moscerini","moscerino","afidi","afide"], text:"I piccoli coinquilini. Riconoscerli in fretta fa la differenza tra un pomeriggio di pulizie e un funerale." },
  melata:{ forms:["melata"], text:"Il liquido zuccherino che lasciano afidi e cocciniglie. Le formiche ne vanno matte: se le vedi salire sul tronco, c’è qualcuno da sfrattare." },
  succulente:{ forms:["succulent*","grasse","cactus","cactacee"], text:"Piante che accumulano acqua in foglie, fusti o radici. Facili, dicono. Poi muoiono, quasi sempre per troppo amore e poco sole." },
  bagnaeasciuga:{ forms:["un goccio","annaffiatura abbondante"], text:"Per chi teme i ristagni la regola non è “poca acqua”: è acqua a fondo, poi aspetti che asciughi tutto. La spruzzatina quotidiana fa marcire e seccare insieme." },
  glochidi:{ forms:["spine invisibili"], text:"Si chiamano glochidi: ciuffetti di spine minuscole che si staccano al primo tocco e restano nella pelle. Il regalo d’addio del fico d’India." },
  terrario:{ forms:["terrario"], text:"Un contenitore di vetro chiuso con piante dentro: l’acqua evapora, si condensa e ricade. Aria umida, sempre." },
  impollinatori:{ forms:["impollinatori"], text:"Api e altri insetti che portano il polline da un fiore all’altro. Senza di loro, molti fiori non diventano frutti." },
  fotosintesi:{ forms:["fotosintesi"], text:"Il modo in cui le piante si fanno il cibo da sole: luce, acqua e aria diventano zuccheri. Niente luce, niente pranzo." },
  variegato:{ forms:["variegat*"], text:"Foglie con macchie o strisce chiare. Le parti chiare non fanno fotosintesi: per questo le variegate vogliono più luce." }
};
