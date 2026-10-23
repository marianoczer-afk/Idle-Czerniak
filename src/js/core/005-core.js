
"use strict";
/* ---------- DATOS (originales, según el kit) ---------- */
const CLASSES = [
  { id:"mago", name:"Mago", hp:-15, mp:40, attack:-2, magic:12, defense:-2, desc:"Mucho maná, frágil." },
  { id:"paladin", name:"Paladín", hp:20, mp:0, attack:3, magic:2, defense:6, desc:"Tanque equilibrado." },
  { id:"clerigo", name:"Clérigo", hp:5, mp:20, attack:0, magic:7, defense:2, desc:"Sostén con magia." },
  { id:"druida", name:"Druida", hp:0, mp:25, attack:0, magic:8, defense:1, desc:"Naturaleza y magia." },
  { id:"asesino", name:"Asesino", hp:-5, mp:-5, attack:8, magic:0, defense:-2, desc:"Gran ataque, poca vida." },
  { id:"bardo", name:"Bardo", hp:0, mp:15, attack:2, magic:5, defense:0, desc:"Versátil." },
  { id:"guerrero", name:"Guerrero", hp:35, mp:-20, attack:8, magic:-4, defense:6, desc:"Mucha vida y ataque." },
  { id:"cazador", name:"Cazador", hp:10, mp:-10, attack:6, magic:0, defense:2, desc:"Ofensivo y resistente." }
];
const RACES = [
  { id:"humano", name:"Humano", hp:5, mp:5, attack:1, magic:1, defense:1 },
  { id:"elfo", name:"Elfo", hp:-5, mp:15, attack:0, magic:4, defense:-1 },
  { id:"elfo_oscuro", name:"Elfo Oscuro", hp:-5, mp:10, attack:3, magic:3, defense:-2 },
  { id:"enano", name:"Enano", hp:15, mp:-10, attack:2, magic:-2, defense:5 },
  { id:"gnomo", name:"Gnomo", hp:-10, mp:20, attack:-2, magic:5, defense:0 }
];
const DUNGEONS = [
  { id:"newbie", name:"Dungeon Newbie", minLevel:1 },
  { id:"cuevas_musgo", name:"Cuevas del Musgo", minLevel:10 },
  { id:"cripta_abandonada", name:"Cripta Abandonada", minLevel:20 },
  { id:"bosque_sombras", name:"Bosque de las Sombras", minLevel:30 },
  { id:"dungeon_pirata", name:"Dungeon Pirata", minLevel:35, navReq:25 }
];
// id, nombre, dungeon, nivel, hp, ataque, defensa, resMagica, xp, oroMin, oroMax, boss
const ENEMY_ROWS = [
  ["rata","Rata","newbie",1,63,7,3,2,16,4,10,0],
  ["murcielago","Murciélago","newbie",3,99,10,4,4,28,8,18,0],
  ["arana","Araña","newbie",5,135,14,6,4,40,12,26,0],
  ["goblin_joven","Goblin Joven","newbie",7,171,18,7,6,52,16,34,0],
  ["esqueleto_debil","Esqueleto Débil","newbie",9,207,21,9,6,64,20,42,0],
  ["jefe_ratas","Jefe Ratas","newbie",16,1166,34,14,10,424,34,210,1],
  ["lobo","Lobo","cuevas_musgo",10,225,23,10,7,70,22,46,0],
  ["serpiente","Serpiente","cuevas_musgo",12,261,27,11,8,82,26,54,0],
  ["hongo_viviente","Hongo Viviente","cuevas_musgo",14,297,30,12,9,94,30,62,0],
  ["duende","Duende","cuevas_musgo",16,333,34,14,10,106,34,70,0],
  ["troll_joven","Troll Joven","cuevas_musgo",18,369,37,16,11,118,38,78,0],
  ["guardian_musgo","Guardián del Musgo","cuevas_musgo",25,1732,50,21,14,640,52,318,1],
  ["zombi","Zombi","cripta_abandonada",20,405,41,17,12,130,42,86,0],
  ["esqueleto_guerrero","Esqueleto Guerrero","cripta_abandonada",22,441,45,18,13,142,46,94,0],
  ["espectro","Espectro","cripta_abandonada",24,477,48,20,14,154,50,102,0],
  ["bruja","Bruja","cripta_abandonada",26,513,52,22,15,166,54,110,0],
  ["caballero_caido","Caballero Caído","cripta_abandonada",28,549,55,23,16,178,58,118,0],
  ["senor_cripta","Señor de la Cripta","cripta_abandonada",35,2362,68,28,20,880,72,438,1],
  ["lobo_sombrio","Lobo Sombrío","bosque_sombras",30,585,59,24,17,190,62,126,0],
  ["bandido","Bandido","bosque_sombras",32,621,63,26,18,202,66,134,0],
  ["arquero_corrupto","Arquero Corrupto","bosque_sombras",34,657,66,28,19,214,70,142,0],
  ["treant","Treant","bosque_sombras",36,693,70,29,20,226,74,150,0],
  ["druida_oscuro","Druida Oscuro","bosque_sombras",38,729,73,30,21,238,78,158,0],
  ["corazon_bosque","Corazón del Bosque","bosque_sombras",45,2992,86,36,24,1120,92,558,1],
  ["pirata_recluta","Pirata Recluta","dungeon_pirata",35,675,68,28,20,220,72,146,0],
  ["pirata_arquero","Pirata Arquero","dungeon_pirata",37,711,72,30,20,232,76,154,0],
  ["corsario","Corsario","dungeon_pirata",39,747,75,31,22,244,80,162,0],
  ["sirena","Sirena","dungeon_pirata",41,783,79,33,22,256,84,170,0],
  ["capitan_fantasma","Capitán Fantasma","dungeon_pirata",43,819,82,34,24,268,88,178,0],
  ["rey_pirata","Rey Pirata","dungeon_pirata",50,3308,95,40,27,1240,102,618,1]
];
// Enemigos con ataque mágico (suben Resistencia Mágica al recibir daño)
const MAGIC_ENEMIES = ["murcielago","hongo_viviente","bruja","druida_oscuro","espectro","sirena","senor_cripta","capitan_fantasma","corazon_bosque","rey_pirata"];
const ENEMIES = ENEMY_ROWS.map(a => ({
  id:a[0], name:a[1], dungeonId:a[2], level:a[3], hp:a[4], attack:a[5], defense:a[6],
  magicRes:a[7], xp:a[8], goldMin:a[9], goldMax:a[10], boss:!!a[11], magic:MAGIC_ENEMIES.includes(a[0]),
  drop:{ itemId:"material_"+a[0], name:"Material de "+a[1], chance:a[11]?0.12:0.07, min:1, max:2 }
}));

/* ---------- NUEVO EN 2B: habilidades, hechizos, equipo ---------- */
const SKILLS = [
  { key:"magia", name:"Magia" },
  { key:"resMagica", name:"Resistencia Mágica" },
  { key:"escudos", name:"Defensa con Escudos" },
  { key:"armaduras", name:"Combate con Armaduras" },
  { key:"navegacion", name:"Navegación" }
];
// kind: dmg | heal | paraEnemy | cureSelf. req = nivel de Magia requerido para comprar
const SPELLS = [
  { id:"dardo", name:"Dardo Mágico", mp:4, cd:2, kind:"dmg", power:7, req:1, price:0, start:true, desc:"Daño mágico inicial, barato y rápido." },
  { id:"curar_leve", name:"Curar Heridas Leves", mp:6, cd:4, kind:"heal", pct:0.2, req:0, price:0, start:true, desc:"Cura 20% de HP." },
  { id:"flecha", name:"Flecha Mágica", mp:6, cd:3, kind:"dmg", power:11, req:3, price:120, desc:"Proyectil mágico simple." },
  { id:"flecha_electrica", name:"Flecha Eléctrica", mp:9, cd:4, kind:"dmg", power:16, req:6, price:350, desc:"Proyectil eléctrico." },
  { id:"misil", name:"Misil Mágico", mp:12, cd:4, kind:"dmg", power:22, req:10, price:400, desc:"Daño mágico medio." },
  { id:"descarga", name:"Descarga Eléctrica", mp:17, cd:5, kind:"dmg", power:32, stun:0.35, req:16, price:700, desc:"Daño y chance de inmovilizar." },
  { id:"curar_grave", name:"Curar Heridas Graves", mp:14, cd:8, kind:"heal", pct:0.5, req:12, price:200, desc:"Cura 50% de HP." },
  { id:"tormenta", name:"Tormenta de Fuego", mp:25, cd:6, kind:"dmg", power:48, req:23, price:1200, desc:"Daño de fuego alto." },
  { id:"inmovilizar", name:"Inmovilizar", mp:10, cd:8, kind:"paraEnemy", dur:4, req:10, price:180, desc:"El enemigo no ataca 4 s." },
  { id:"remover", name:"Remover Parálisis", mp:5, cd:6, kind:"cureSelf", req:5, price:60, desc:"Quita tu parálisis." },
  { id:"apocalipsis", name:"Apocalipsis", mp:45, cd:20, kind:"dmg", power:110, req:35, price:2000, desc:"Devastador, cooldown largo." }
];
// Los datos antiguos solo se usan para finalizar viajes ya guardados.
const LEGACY_NAV = [
  { id:"costa", name:"Cabotaje costero", sec:30, skill:30, gold:[3,8], req:0 },
  { id:"altamar", name:"Ruta de altamar", sec:60, skill:90, gold:[10,25], req:8 },
  { id:"tormenta_nav", name:"Cruce de tormenta", sec:120, skill:240, gold:[25,60], req:16 }
];
const NAV = [
  {id:"costa",name:"Cabotaje costero",req:1,goldHour:60},
  {id:"altamar",name:"Ruta de altamar",req:8,goldHour:72},
  {id:"tormenta_nav",name:"Cruce de tormenta",req:16,goldHour:80}
];
const NAV_HOURS = [1,2,4,6,8,12,24];
const NAV_XP_HOUR = 400;
const NAV_DENOM = 3600000;
const navHas = s => !!(s.nav && s.nav.id && s.nav.remainingMs>0);
const navActive = s => navHas(s) && !s.nav.paused;
function emptyNav(){ return {id:null,left:0,totalMs:0,remainingMs:0,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0}; }
function normalizeNav(s){
  s.navCarry = s.navCarry || {gold:0,xp:0};
  for(const k of ["gold","xp"]) if(!Number.isSafeInteger(s.navCarry[k]) || s.navCarry[k]<0 || s.navCarry[k]>=NAV_DENOM) s.navCarry[k]=0;
  const n=s.nav, a=n && LEGACY_NAV.find(x=>x.id===n.id);
  if(!n || !a){ s.nav=emptyNav(); return; }
  if(!Number.isFinite(n.remainingMs)){
    if(!(Number.isFinite(n.left) && n.left>0)){ s.nav=emptyNav(); return; }
    const left=Math.min(a.sec,n.left);
    s.nav={id:a.id,left,totalMs:a.sec*1000,remainingMs:Math.round(left*1000),elapsedMs:Math.round((a.sec-left)*1000),paused:false,legacy:true,earnedGold:0,earnedXp:0};
    // Si había combate activo, el motor anterior también priorizaba el viaje.
    // Se conserva esa secuencia solo durante la transición del viaje legado.
    return;
  }
  if(!(n.remainingMs>0)){ s.nav=emptyNav(); return; }
  n.totalMs=Math.max(n.remainingMs,Math.min(86400000,Number(n.totalMs)||n.remainingMs));
  n.remainingMs=Math.min(n.totalMs,Math.max(0,Math.round(n.remainingMs)));
  n.elapsedMs=Math.max(0,Math.round(n.totalMs-n.remainingMs));
  n.left=Math.ceil(n.remainingMs/1000); n.paused=!!n.paused; n.legacy=!!n.legacy;
  n.earnedGold=Math.max(0,Math.floor(Number(n.earnedGold)||0));
  n.earnedXp=Math.max(0,Math.floor(Number(n.earnedXp)||0));
  if(!n.legacy && !n.paused) s.combat.active=false;
}
function advanceNav(s,ms,random=Math.random){
  if(!navActive(s) || !(ms>0)) return null;
  const n=s.nav, used=Math.min(n.remainingMs,Math.floor(ms));
  n.remainingMs-=used; n.elapsedMs+=used; n.left=Math.ceil(n.remainingMs/1000);
  if(!n.legacy){
    const route=NAV.find(x=>x.id===n.id);
    for(const [k,rate] of [["gold",route.goldHour],["xp",NAV_XP_HOUR]]){
      const numerator=s.navCarry[k]+used*rate;
      const award=Math.floor(numerator/NAV_DENOM);
      s.navCarry[k]=numerator-award*NAV_DENOM;
      if(k==="gold"){ s.gold+=award; n.earnedGold+=award; }
      else { n.earnedXp+=sklXp(s,"navegacion",award); }
    }
  }
  if(n.remainingMs>0) return null;
  if(n.legacy){
    const old=LEGACY_NAV.find(x=>x.id===n.id);
    const gold=old.gold[0]+Math.floor(random()*(old.gold[1]-old.gold[0]+1));
    s.gold+=gold; const awarded=sklXp(s,"navegacion",old.skill);
    n.earnedGold+=gold; n.earnedXp+=awarded;
  }
  const result={...n};
  s.navLast={...result,completed:true}; s.nav=emptyNav();
  return result;
}
function pauseNav(s){ if(navActive(s)) s.nav.paused=true; }
function beginPhysicalCombat(s){ pauseNav(s); s.combat.active=true; }
function resumeNavigation(s){
  if(!navHas(s) || s.restLeft>0) return false;
  s.combat.active=false; s.nav.paused=false; return true;
}
function cancelNavigation(s){
  if(!navHas(s)) return false;
  s.navLast={...s.nav,completed:false}; s.nav=emptyNav(); return true;
}
function reportNavEnd(result){
  if(!result) return;
  addLog(`Expedición finalizada: +${result.earnedXp} XP de Navegación y +${result.earnedGold} oro en total. Quedás detenido${state.combat.active?" (transición de viaje antiguo: continúa el combate previo)":""}.`);
  needRender=true;
}
const EQUIP = [
  { id:"daga", name:"Daga oxidada", slot:"weapon", price:80, attack:2 },
  { id:"espada_corta", name:"Espada corta", slot:"weapon", price:300, attack:5 },
  { id:"espada_larga", name:"Espada larga", slot:"weapon", price:900, attack:9 },
  { id:"hacha", name:"Hacha de guerra", slot:"weapon", price:2200, attack:14 },
  { id:"cuero", name:"Armadura de cuero", slot:"armor", price:120, defense:3 },
  { id:"malla", name:"Cota de malla", slot:"armor", price:500, defense:7, req:{key:"armaduras", lvl:5} },
  { id:"placas", name:"Armadura de placas", slot:"armor", price:1800, defense:12, req:{key:"armaduras", lvl:15} },
  { id:"tunica", name:"Túnica arcana", slot:"armor", price:400, mp:20, req:{key:"magia", lvl:5} },
  { id:"madera", name:"Escudo de madera", slot:"shield", price:100, defense:2, magicRes:1 },
  { id:"hierro", name:"Escudo de hierro", slot:"shield", price:450, defense:5, magicRes:2, req:{key:"escudos", lvl:8} },
  { id:"torre", name:"Escudo torre", slot:"shield", price:1500, defense:9, magicRes:4, req:{key:"escudos", lvl:18} }
];
const SLOTS = [["weapon","Arma"],["armor","Armadura"],["shield","Escudo"]];
const SLOT_NAME = { weapon:"arma", armor:"armadura", shield:"escudo" };

/* ---------- PARAMETROS (BALANCE v0.3) ---------- */
const CFG = {
  SAVE_VERSION:7, ATTACK_INTERVAL:2.5, CRIT_CHANCE:0.05, CRIT_MULT:1.5,
  HIT_BASE:0.85, REGEN_PER_SEC:0.002, MP_REGEN:0.02, DEATH_HP_FRACTION:0.3,
  OFFLINE_MAX_SEC:86400, START_GOLD:100, LOG_MAX:80, AUTOSAVE_MS:10000,
  REST_SEC:20, REST_COOLDOWN_SEC:60, REST_COST_BASE:5, REST_COST_PER_LVL:2,
  PARA_SEC:3, PARA_LEVEL:20, PARA_CHANCE:0.06,
  BASE:{ hp:100, mp:50, attack:10, defense:5, magicRes:5 }
};

/* ---------- MOTOR (funciones puras, RNG inyectable) ---------- */
let rng = Math.random;
function randInt(a,b){ return a + Math.floor(rng()*(b-a+1)); }
function clamp(v,a,b){ return Math.min(b,Math.max(a,v)); }
function xpFor(n){ return n<=1 ? 0 : Math.floor(100*Math.pow(n-1,2.2)); }
function levelFromXp(xp){ let l=1; while(xpFor(l+1)<=xp) l++; return l; }
function skillLvl(xp){ return 1 + Math.floor(Math.sqrt(Math.max(0,xp)/10)); }
function skillMult(n){ return 1 + 0.015*Math.min(n,100) + 0.003*Math.max(0,n-100); }
function phys(atk,def){ return Math.max(1, Math.floor(atk*(1-def/(def+100)))); }
function hitChance(atkLvl,defLvl){ return clamp(CFG.HIT_BASE + (atkLvl-defLvl)*0.01, 0.15, 0.98); }
const classById = id => CLASSES.find(c=>c.id===id);
const raceById = id => RACES.find(r=>r.id===id);
const enemyById = id => ENEMIES.find(e=>e.id===id);
const dungeonById = id => DUNGEONS.find(d=>d.id===id);
const spellById = id => SPELLS.find(s=>s.id===id);
const itemById = id => EQUIP.find(i=>i.id===id);

function skl(s,key){ const k = s.skills && s.skills[key]; return skillLvl(k ? k.xp : 0); }
// Punto único de concesión por actividad. Por defecto no cambia el balance.
function xpActivityFactor(s,kind){ return 1; }
function gainCharacterXP(s,n){ const amount=n*xpActivityFactor(s,"character"); s.xp+=amount; return amount; }
function sklXp(s,key,n){ if(!s.skills) s.skills={}; if(!s.skills[key]) s.skills[key]={xp:0}; const amount=n*xpActivityFactor(s,"skills"); s.skills[key].xp += amount; return amount; }
function equipBonus(s){
  const b = {hp:0,mp:0,attack:0,defense:0,magicRes:0};
  const eq = s.equip || {};
  for(const slot in eq){
    const it = eq[slot] && itemById(eq[slot]);
    if(it) for(const k in b) b[k] += it[k] || 0;
  }
  return b;
}
function derive(s){
  const c = classById(s.cls), r = raceById(s.race);
  const L = levelFromXp(s.xp), sk = levelFromXp(s.skill.xp), eq = equipBonus(s);
  const armLvl = skl(s,"armaduras"), shLvl = skl(s,"escudos");
  return {
    L, sk,
    hpMax: Math.max(1, CFG.BASE.hp + c.hp + r.hp + (L-1)*8 + eq.hp),
    mpMax: Math.max(0, CFG.BASE.mp + c.mp + r.mp + (L-1)*3 + eq.mp),
    attack: Math.max(1, Math.round((CFG.BASE.attack + c.attack + r.attack + (L-1)*0.8 + eq.attack) * skillMult(sk))),
    defense: Math.max(0, CFG.BASE.defense + c.defense + r.defense + Math.floor((L-1)*0.5) + eq.defense
      + (s.equip && s.equip.armor ? Math.floor(armLvl*0.2) : 0)
      + (s.equip && s.equip.shield ? Math.floor(shLvl*0.2) : 0)),
    magicRes: Math.max(0, CFG.BASE.magicRes + Math.floor(c.magic/2) + r.magic + Math.floor((L-1)*0.3) + eq.magicRes + Math.floor(skl(s,"resMagica")*0.2)),
    spellMult: skillMult(skl(s,"magia")) * (1 + (c.magic + r.magic)/50)
  };
}
function enemyUnlocked(en, L){ return L >= Math.max(dungeonById(en.dungeonId).minLevel, en.level-3); }
function dungeonOk(d, s){
  const L = derive(s).L;
  return L >= d.minLevel && (!d.navReq || skl(s,"navegacion") >= d.navReq);
}
function dungeonLockText(d, s){
  const parts = [];
  if(derive(s).L < d.minLevel) parts.push("nivel "+d.minLevel);
  if(d.navReq && skl(s,"navegacion") < d.navReq) parts.push("Navegación "+d.navReq);
  return parts.join(" y ");
}
function restCost(L){ return CFG.REST_COST_BASE + CFG.REST_COST_PER_LVL*L; }
function reqOk(s,req){ return !req || skl(s,req.key) >= req.lvl; }
function reqText(req){ if(!req) return "Sin requisitos"; const k = SKILLS.find(x=>x.key===req.key); return "Req. "+k.name+" "+req.lvl; }
function statsText(o){
  const names = {attack:"ATK",defense:"DEF",magicRes:"RM",hp:"HP",mp:"MP"};
  return Object.keys(names).filter(k=>o[k]).map(k=>names[k]+" "+(o[k]>0?"+":"")+o[k]).join(" · ");
}
function fmtDur(sec){
  const h = Math.floor(sec/3600), m = Math.floor((sec%3600)/60);
  return h ? `${h} h ${m} min` : `${m} min`;
}

/* ---------- ESTADO Y PERSISTENCIA ---------- */
let state = null, ready = false, lastSave = null, busy = false;
let draft = { name:"", race:null, cls:null };
const OFF = { active:false, kills:0, deaths:0 };
let needRender = false;
let navDuration = 1;
let runtimeAt = 0, runtimeRemainder = 0;
function syncRuntime(){
  if(!runtimeAt || !ready || !state || busy) return;
  const now=Date.now(), elapsed=Math.max(0,now-runtimeAt); runtimeAt=now;
  if(navActive(state) && state.restLeft===0 && !state.nav.legacy){
    const admitted=Math.min(elapsed,CFG.OFFLINE_MAX_SEC*1000);
    const used=Math.min(admitted,state.nav.remainingMs);
    reportNavEnd(advanceNav(state,used));
    runtimeRemainder+=admitted;
    const secs=Math.floor(runtimeRemainder/1000); runtimeRemainder-=secs*1000;
    // Navegación no cambia las estadísticas de HP/MP.
    if(secs>0) passiveSeconds(state,secs);
    return;
  }
  runtimeRemainder+=elapsed;
  let secs=Math.floor(runtimeRemainder/1000);
  runtimeRemainder-=secs*1000;
  // Las ausencias largas se procesan con el motor offline en lotes.
  if(secs>30){
    const excess=secs; busy=true;
    simulateOffline(excess).then(()=>{runtimeAt=Date.now();renderGame();persist();}).catch(e=>{busy=false;setStatus("Error de simulación: "+e.message,true);});
    return;
  }
  while(secs-->0) step();
}
function passiveSeconds(s,secs){
  const d=derive(s);
  s.hp=Math.min(d.hpMax,s.hp+d.hpMax*CFG.REGEN_PER_SEC*secs);
  s.mp=Math.min(d.mpMax,s.mp+d.mpMax*CFG.MP_REGEN*secs);
  s.restCd=Math.max(0,s.restCd-secs); s.para=Math.max(0,s.para-secs);
  s.combat.enemyPara=Math.max(0,s.combat.enemyPara-secs);
  for(const k in s.cds) s.cds[k]=Math.max(0,s.cds[k]-secs);
}

function newState(){
  const s = {
    name:draft.name, race:draft.race, cls:draft.cls,
    xp:0, gold:CFG.START_GOLD, hp:1, mp:0, skill:{xp:0},
    skills:{}, spells:{}, cds:{}, equip:{weapon:null,armor:null,shield:null}, owned:{},
    para:0, inventory:{}, defeated:{}, nav:emptyNav(), navCarry:{gold:0,xp:0}, navLast:null, autoAtk:null, autoHeal:null,
    favorites:["dardo","curar_leve"],
    combat:{ active:false, dungeonId:"newbie", enemyId:"rata", enemyHp:63, pT:0, eT:0, enemyPara:0 },
    restLeft:0, restCd:0,
    log:[], savedAt:0
  };
  SKILLS.forEach(k => s.skills[k.key] = {xp:0});
  SPELLS.forEach(sp => { if(sp.start) s.spells[sp.id] = true; });
  const d = derive(s);
  s.hp = d.hpMax; s.mp = d.mpMax; // empieza con vida y maná máximos
  return s;
}
function validState(s){
  if(!s || typeof s!=="object") return false;
  if(typeof s.name!=="string" || !classById(s.cls) || !raceById(s.race)) return false;
  if(typeof s.xp!=="number" || typeof s.gold!=="number" || typeof s.hp!=="number") return false;
  if(!s.combat || !enemyById(s.combat.enemyId) || !dungeonById(s.combat.dungeonId)) return false;
  if(!s.skill || typeof s.skill.xp!=="number") return false;
  return true;
}
function migrateState(s, fromVersion){
  s.inventory = s.inventory || {}; s.defeated = s.defeated || {};
  s.log = Array.isArray(s.log) ? s.log : [];
  if(typeof s.restLeft!=="number") s.restLeft = 0;
  if(typeof s.restCd!=="number") s.restCd = 0;
  if(typeof s.para!=="number") s.para = 0;
  s.skills = (s.skills && typeof s.skills==="object") ? s.skills : {};
  SKILLS.forEach(k => { if(!s.skills[k.key] || typeof s.skills[k.key].xp!=="number") s.skills[k.key] = {xp:0}; });
  s.spells = (s.spells && typeof s.spells==="object") ? s.spells : {};
  SPELLS.forEach(sp => { if(sp.start) s.spells[sp.id] = true; });
  s.cds = (s.cds && typeof s.cds==="object") ? s.cds : {};
  s.equip = (s.equip && typeof s.equip==="object") ? s.equip : {weapon:null,armor:null,shield:null};
  s.owned = (s.owned && typeof s.owned==="object") ? s.owned : {};
  if(typeof s.combat.enemyPara!=="number") s.combat.enemyPara = 0;
  normalizeNav(s);
    s.autoAtk = null;
  s.autoHeal = null;
    if(!Array.isArray(s.favorites)) s.favorites = ["dardo","curar_leve"].filter(id=>s.spells[id]);
  s.favorites = [...new Set(s.favorites)].filter(id=>spellById(id) && s.spells[id]).slice(0,6);
  const d = derive(s);
  // La v1 podía guardar hp=0 por un bug de inicio: se corrige a la vida máxima
  if(fromVersion < 2 && !(s.hp > 0)) s.hp = d.hpMax;
  if(fromVersion < 3 || typeof s.mp!=="number") s.mp = d.mpMax;
  s.hp = clamp(s.hp, 0, d.hpMax);
  s.mp = clamp(s.mp, 0, d.mpMax);
  return s;
}
function unwrap(rec){
  if(!rec || typeof rec!=="object") return null;
  if(![1,2,3,4,5,6].includes(rec.version)) return null;
  if(!validState(rec.state)) return null;
  // Migrar una copia conserva intacto el registro que se respalda.
  return migrateState(JSON.parse(JSON.stringify(rec.state)), rec.version);
}
function backupRaw(rec){
  try {
    const k = "argentum-idle-backup-v"+rec.version;
    if(!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify(rec));
  } catch(_){}
}

// El contexto se cambia únicamente después de pausar y conservar el anterior.
let gameMode = "normal";
let dbP = null;
function openDB(){
  if(dbP) return dbP;
  dbP = new Promise((res,rej)=>{
    if(!("indexedDB" in window)) return rej(new Error("no idb"));
    const r = indexedDB.open(gameMode === "dev" ? "argentum-idle-dev" : "argentum-idle",1);
    r.onupgradeneeded = ()=> r.result.createObjectStore("saves");
    r.onsuccess = ()=> res(r.result);
    r.onerror = ()=> rej(r.error);
  });
  return dbP;
}
async function idbPut(rec){
  const db = await openDB();
  return new Promise((res,rej)=>{
    const tx = db.transaction("saves","readwrite");
    tx.objectStore("saves").put(rec,"main");
    tx.oncomplete = res; tx.onerror = ()=> rej(tx.error);
    tx.onabort = ()=> rej(tx.error || Error("Guardado IndexedDB abortado"));
  });
}
async function idbGet(){
  const db = await openDB();
  return new Promise((res,rej)=>{
    const q = db.transaction("saves").objectStore("saves").get("main");
    q.onsuccess = ()=> res(q.result || null); q.onerror = ()=> rej(q.error);
  });
}
let LS_KEY = "argentum-idle-save-v1"; // Normal: clave original sin cambios; DEV usa otra clave.

async function persist(){
  if(!storageReady || busy) return false;
  if(state && ready){ syncRuntime(); if(busy) return false; }
  return saveRoster();
}
function setStatus(msg, warn){
  const el = document.getElementById("saveStatus");
  el.textContent = msg; el.className = warn ? "warn" : "";
  const info = document.getElementById("saveInfo");
  if(info) info.textContent = msg;
}
async function loadSaved(){
  const candidates=[];
  let broken=false;
  try { const rec=await idbGet(); if(rec)candidates.push(rec); } catch(_){}
  try { const raw=localStorage.getItem(LS_KEY); if(raw)candidates.push(JSON.parse(raw)); } catch(_){broken=true;}
  candidates.sort((a,b)=>(Number(b.savedAt)||0)-(Number(a.savedAt)||0)||(Number(b.revision)||0)-(Number(a.revision)||0));
  for(const raw of candidates){
    try {
      const data=decodeRoster(raw);
      if(!data)continue;
      if(raw.version!==7)await durableBackup(raw,"migration");
      return {data,raw};
    } catch(e){
      if(e.backupFailure)throw e;
    }
  }
  if(candidates.length||broken)throw new Error("No se encontró un guardado válido. No se sobrescribió: exportá o recuperá una copia antes de continuar.");
  return null;
}

/* ---------- LOG Y UI ---------- */
function addLog(msg){
  if(OFF.active) return;
  const t = new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  state.log.unshift({t,msg});
  if(state.log.length > CFG.LOG_MAX) state.log.length = CFG.LOG_MAX;
}
function toast(msg){
  if(OFF.active) return;
  const el = document.getElementById("toast");
  el.textContent = msg; el.classList.remove("hidden");
  clearTimeout(toast._t); toast._t = setTimeout(()=> el.classList.add("hidden"), 2800);
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function fmt(n){ return Math.floor(n).toLocaleString("es-AR"); }
function mods(o){
  const p = [["HP","hp"],["MP","mp"],["Ataque","attack"],["Magia","magic"],["Defensa","defense"]]
    .filter(([,k])=>o[k]).map(([l,k])=> l+" "+(o[k]>0?"+":"")+o[k]);
  return p.join(" · ") || "Sin modificadores";
}

/* ---------- CREACION ---------- */
function renderCreate(){
  document.getElementById("raceOpts").innerHTML = RACES.map(r=>
    `<button data-act="race" data-id="${r.id}" class="${draft.race===r.id?"sel":""}">${r.name}<small>${mods(r)}</small></button>`).join("");
  document.getElementById("classOpts").innerHTML = CLASSES.map(c=>
    `<button data-act="class" data-id="${c.id}" class="${draft.cls===c.id?"sel":""}">${c.name}<small>${c.desc}<br>${mods(c)}</small></button>`).join("");
  const pv = document.getElementById("preview");
  if(draft.race && draft.cls){
    const d = derive({cls:draft.cls, race:draft.race, xp:0, skill:{xp:0}, skills:{}, equip:{}});
    pv.innerHTML = `<b style="color:var(--gold)">Vista previa nivel 1</b><br>HP ${d.hpMax} · MP ${d.mpMax} · Ataque ${d.attack} · Defensa ${d.defense} · Res. mágica ${d.magicRes}`;
  } else pv.textContent = "Elegí una raza y una clase para ver las estadísticas.";
  document.getElementById("createBtn").disabled = !(draft.race && draft.cls && draft.name.trim().length>=2);
}

/* ---------- JUEGO: estructura ---------- */
function renderGame(){
  const s = state, c = s.combat, d = derive(s);
  const en = enemyById(c.enemyId), dg = dungeonById(en.dungeonId);
  const cl = classById(s.cls), ra = raceById(s.race);
  const eqRows = SLOTS.map(([slot,label])=>{
    const it = s.equip[slot] && itemById(s.equip[slot]);
    return `<div class="row"><span>${label}</span><span>${it ? esc(it.name) : "—"}</span></div>`;
  }).join("");
  document.getElementById("pChar").innerHTML = `
    <h2>${esc(s.name)}</h2>
    <div class="muted">${ra.name} · ${cl.name}</div>
    <div class="row"><span>Nivel <b id="lvlText"></b></span><span>Oro <b id="goldText" style="color:var(--gold)"></b></span></div>
    <div class="row muted"><span>XP</span><span id="xpText"></span></div>
    <div class="bar xp"><div id="xpBar"></div></div>
    <div class="row"><span>HP</span><span id="hpText"></span></div>
    <div class="bar hp"><div id="hpBar"></div></div>
    <div class="row"><span>Maná</span><span id="mpText"></span></div>
    <div class="bar mp"><div id="mpBar"></div></div>
    <div class="muted" style="margin-top:6px;line-height:1.7">
      Ataque: <b>${d.attack}</b> · Defensa: <b>${d.defense}</b> · Res. mágica: <b>${d.magicRes}</b><br>
      Poder mágico: <b>×${d.spellMult.toFixed(2)}</b> · Combate con Armas: <b>nivel ${d.sk}</b>
    </div>
    <div class="actions"><button id="restBtn" data-act="rest">Descansar</button></div>
    <div class="muted" style="font-size:.8rem;margin-top:6px;line-height:1.4">
      Descanso: ${CFG.REST_SEC} s, cuesta oro y tiene enfriamiento de ${CFG.REST_COOLDOWN_SEC} s.
      Sin descansar, la vida y el maná se regeneran despacio.
    </div>
    <h2 style="margin-top:16px">Habilidades</h2>
    <div id="skillsBox"></div>
    <h2 style="margin-top:16px">Equipo</h2>
    ${eqRows}
    <h2 style="margin-top:16px">Inventario</h2>
    <div id="invBox"></div>
    <h2 style="margin-top:16px">Guardado</h2>
    <div id="saveInfo" class="muted" style="font-size:.85rem">${lastSave ? "Último guardado "+lastSave : "Guardado automático activo"}</div>
    <div class="actions">
      <button data-act="downloadHtml">Descargar index.html · Estable 26</button>
      <button data-act="export">Exportar JSON</button>
      <button data-act="import">Importar JSON</button>
      <input type="file" id="importFile" accept=".json,application/json" hidden>
    </div>
    <div class="actions"><button data-act="switchCharacter">Cambiar personaje</button><button class="danger" data-act="reset">Borrar este personaje</button></div>
  `;
  const spellBtns = SPELLS.filter(sp=>s.spells[sp.id]).map(sp=>
    `<div class="spellEntry"><button id="sp_${sp.id}" data-act="cast" data-id="${sp.id}" title="${esc(sp.desc)}"><span class="spLbl"></span><small>${esc(sp.desc)}</small></button><button class="favToggle" data-act="favorite" data-id="${sp.id}" aria-label="Favorito: ${esc(sp.name)}" aria-pressed="${s.favorites.includes(sp.id)}" title="Agregar o quitar de accesos rápidos (máximo 6)">${s.favorites.includes(sp.id)?"★":"☆"}</button></div>`).join("");
  const eqShop = EQUIP.map(it=>{
    const owned = !!s.owned[it.id], eq = s.equip[it.slot] === it.id;
    const btn = owned
      ? `<button class="small" data-act="equip" data-id="${it.id}">${eq?"Quitar":"Equipar"}</button>`
      : `<button class="small" data-act="buy" data-id="${it.id}" ${reqOk(s,it.req) && s.gold>=it.price ? "" : "disabled"}>Comprar · ${fmt(it.price)} oro</button>`;
    return `<div class="shopRow"><div><b>${it.name}</b> <span class="muted">(${SLOT_NAME[it.slot]})</span><br>
      <small class="muted">${statsText(it)} · ${reqText(it.req)}</small></div>${btn}</div>`;
  }).join("");
  const spShop = SPELLS.filter(sp=>sp.price>0).map(sp=>{
    const known = !!s.spells[sp.id];
    const btn = known
      ? `<span class="muted">Aprendido</span>`
      : `<button class="small" data-act="buySpell" data-id="${sp.id}" ${skl(s,"magia")>=sp.req && s.gold>=sp.price ? "" : "disabled"}>Aprender · ${fmt(sp.price)} oro</button>`;
    return `<div class="shopRow"><div><b>${sp.name}</b><br><small class="muted">${sp.mp} MP · ${sp.desc} · Req. Magia ${sp.req}</small></div>${btn}</div>`;
  }).join("");
  document.getElementById("pCombat").innerHTML = `
    <h2>Combate automático</h2>
    <div class="list" id="dgList">${DUNGEONS.map(x=>{
      const ok = dungeonOk(x,s);
      const label = ok ? x.name : `🔒 ${x.name} · ${dungeonLockText(x,s)}`;
      return `<button data-act="dungeon" data-id="${x.id}" ${ok?"":"disabled"} class="${x.id===dg.id?"sel":""}">${label}</button>`;
    }).join("")}</div>
    <div class="list">${ENEMIES.filter(e=>e.dungeonId===dg.id).map(e=>{
      const un = enemyUnlocked(e,d.L);
      return `<div class="enemyChoice"><button data-act="enemy" data-id="${e.id}" ${un?"":"disabled"} class="${e.id===c.enemyId?"sel":""}">
        <span>${esc(e.name)}${e.boss?'<span class="tag">JEFE</span>':""}<br><small class="muted">Nv ${e.level} · XP ${e.xp} · Oro ${e.goldMin}–${e.goldMax}</small></span>
        <small class="muted">${un ? "x"+(s.defeated[e.id]||0) : "nv "+Math.max(dg.minLevel,e.level-3)}</small></button><button class="small enemyInfoBtn" data-e13-enemy-info="${e.id}" title="Ver ficha del enemigo">ⓘ</button></div>`;
    }).join("")}</div>
    <details class="panel" aria-label="Ficha del NPC seleccionado"><summary>ⓘ Información del enemigo</summary>
      <b>${esc(en.name)} · Nivel ${en.level} · ${en.boss?"Jefe":"Enemigo normal"}</b>
      <div class="npcFacts">
        <div><small>HP máximo</small>${fmt(en.hp)}</div><div><small>Ataque</small>${en.attack}</div>
        <div><small>Defensa</small>${en.defense}</div><div><small>Resistencia mágica</small>${en.magicRes}</div>
        <div><small>Tipo de ataque</small>${en.magic?"Mágico":"Físico"}</div><div><small>XP por derrota</small>${fmt(en.xp)}</div>
        <div><small>Oro por derrota</small>${fmt(en.goldMin)}–${fmt(en.goldMax)}</div><div><small>Dungeon</small>${esc(dg.name)}</div>
      </div>
      <details data-ui-panel="npcRewards"><summary>Recompensas y drops actuales</summary>
        <p class="muted">${esc(en.drop.name)}: ${(en.drop.chance*100).toFixed(0)}% por baja; ${en.drop.min}–${en.drop.max} unidades cuando aparece. Oro y XP indicados arriba. No hay nuevas tablas de equipo implementadas.</p>
      </details>
    </details>
    <div class="row"><span><b>${esc(en.name)}</b></span><span id="eHpText"></span></div>
    <div class="bar en"><div id="eHpBar"></div></div>
    <div class="row"><span>Estado</span><span id="combatState"></span></div>
    <div class="actions">
      <button class="primary wide" id="startBtn" data-act="start">▶ Iniciar combate</button>
      <button class="wide" id="stopBtn" data-act="stop">⏹ Detener</button>
    </div>
    <h2 style="margin-top:16px">Hechizos (uso manual)</h2>
    <div class="muted" style="margin-bottom:8px">Marcá ★ para fijar hasta 6 hechizos en la barra inferior. Deslizá los accesos horizontalmente en celular.</div>
    <div class="spells">${spellBtns || '<span class="muted">Todavía no tenés hechizos.</span>'}</div>
    <div class="muted" style="margin-bottom:8px">Los ataques físicos son automáticos. Los hechizos y las curaciones se lanzan únicamente de forma manual, también al calcular el progreso offline.</div>
    <h2 style="margin-top:12px">Navegación</h2>
    <div class="muted">400 XP de Navegación/h. Sin XP de personaje, drops ni riesgo. Elegí ruta y duración por separado. No hay repetición automática.</div>
    <label for="navHours">Duración de la expedición</label>
    <select id="navHours" style="font:inherit;padding:10px;background:var(--panel2);color:var(--text);max-width:100%">${NAV_HOURS.map(h=>`<option value="${h}" ${h===navDuration?"selected":""}>${h} ${h===1?"hora":"horas"}</option>`).join("")}</select>
    ${NAV.map(a=>`<div class="shopRow"><div><b>${a.name}</b><br><small class="muted">400 XP/h · ${a.goldHour} oro/h · Req. Navegación ${a.req}</small></div><button class="small" data-act="nav" data-id="${a.id}" ${canNav(a)?"":"disabled"}>Zarpar</button></div>`).join("")}
    <div id="navProgress" aria-live="off"></div>
    <div class="actions"><button data-act="navPause" id="navPauseBtn">Pausar</button><button data-act="navResume" id="navResumeBtn">Reanudar</button><button data-act="navCancel" id="navCancelBtn">Cancelar expedición</button></div>
    <div class="muted" style="margin-top:8px">Las ganancias se acreditan por tiempo efectivo; cancelar no las retira ni agrega premios. Iniciar combate o descanso pausa la expedición. Al completar, no comienza otra actividad. Pirata requiere personaje 35 y Navegación 25.</div>
    <details style="margin-top:10px"><summary>Pruebas de navegación y offline</summary><button data-act="navTests">Ejecutar pruebas aisladas</button><pre id="navTestOutput" style="white-space:pre-wrap;font-size:.8rem">No ejecutadas. No modifican tu partida.</pre></details>
    <h2 style="margin-top:12px">Tienda</h2>
    <div class="muted" style="margin-bottom:4px">Equipo</div>
    ${eqShop}
    <div class="muted" style="margin:10px 0 4px">Hechizos</div>
    ${spShop}
    <h2 style="margin-top:16px">Registro de combate</h2>
    <div class="log" id="logBox"></div>`;
  organizeWorkspace(); renderDock(); updateLive(); updateInv();
}
let fishingRenderDepth=0,fishingFinishDepth=0;
function measureDock(){
  if(fishingRenderDepth)return; // Measure only the completed fishing layout, never intermediate DOM.
  const dock = document.getElementById("combatDock");
  const h = dock.classList.contains("hidden") ? 0 : Math.ceil(dock.getBoundingClientRect().height);
  const reserve=h?(h+12)+'px':'0px';
  if(document.documentElement.style.getPropertyValue('--dock-space')!==reserve)document.documentElement.style.setProperty('--dock-space',reserve);
}
function renderDock(){
  document.getElementById("dockQuick").innerHTML = state.favorites.map(id=>{
    const sp = spellById(id);
    return `<button id="quick_${sp.id}" data-act="cast" data-id="${sp.id}" title="${esc(sp.desc)}"><span>${esc(sp.name)}</span><small class="quickInfo"></small></button>`;
  }).join("") || '<span class="muted">Elegí favoritos con ☆ en Hechizos.</span>';
  measureDock();
}
function toggleFavorite(id){
  if(!state.spells[id] || !spellById(id)) return;
  const i = state.favorites.indexOf(id);
  if(i>=0) state.favorites.splice(i,1);
  else if(state.favorites.length<6) state.favorites.push(id);
  else toast("Podés fijar hasta 6 hechizos. Quitá uno primero.");
}
function downloadHTML(){
  // Exporta el documento completo, no una vista previa ni un acceso externo.
  const page = document.documentElement.cloneNode(true);e217CleanClone(page);
  page.querySelector("#uiWorkspace")?.remove();
  page.querySelector("#balanceLabPanel")?.remove();
  page.querySelector("#devBalancePanel")?.remove();
  page.querySelector("#devProgressionPanel")?.remove();
  page.querySelector("#devAdminPanel")?.remove();
  page.querySelector("#devIsolationTests")?.remove();
  page.querySelector("#devModeBanner")?.remove();
  page.querySelector("#devModeToggle")?.remove();
  page.querySelector("#characterScreen").classList.add("hidden");
  page.querySelector("#characterList").innerHTML="";
  page.querySelector("#characterCount").textContent="0";
  page.querySelector("#rosterTestOutput").textContent="No ejecutadas. No modifican tus partidas.";
  page.querySelector("#createScreen").classList.add("hidden");
  page.querySelector("#gameScreen").classList.add("hidden");
  page.querySelector("#combatDock").classList.add("hidden");
  page.querySelector("#toast").classList.add("hidden");
  for(const id of ["pChar","pCombat","raceOpts","classOpts","preview","dockQuick"]) page.querySelector("#"+id).innerHTML="";
  page.querySelector("#charName").value="";
  page.querySelector("#charName").removeAttribute("value");
  page.querySelector("#saveStatus").textContent="Cargando...";
  page.style.removeProperty("--dock-space");
  const url=URL.createObjectURL(new Blob(["<!DOCTYPE html>\n"+page.outerHTML],{type:"text/html;charset=utf-8"}));
  const a=document.createElement("a"); a.href=url; a.download="index.html"; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function updateInv(){
  const box = document.getElementById("invBox"); if(!box) return;
  const keys = Object.keys(state.inventory).filter(k=>state.inventory[k]>0);
  const html = keys.length
    ? keys.map(k=>`<div class="row"><span>${esc(itemNameOf(k))}</span><b>x${state.inventory[k]}</b></div>`).join("")
    : `<div class="muted">Vacío. Los materiales de los enemigos aparecen acá.</div>`;
  if(box.innerHTML!==html)box.innerHTML=html;
}
function itemNameOf(id){ const e = ENEMIES.find(x=>x.drop.itemId===id); return e ? e.drop.name : id; }
function updateSpells(){
  const s = state;
  s.favorites.forEach(id=>{
    const sp=spellById(id), b=document.getElementById("quick_"+id);
    if(!sp || !b) return;
    const cd=Math.ceil(s.cds[id]||0);
    b.querySelector(".quickInfo").textContent=sp.mp+" MP · "+(cd>0?cd+" s":"Listo");
    b.disabled=busy || !canCast(id);
  });
  SPELLS.forEach(sp=>{
    const b = document.getElementById("sp_"+sp.id); if(!b) return;
    const cd = s.cds[sp.id]||0;
    b.querySelector(".spLbl").textContent = `${sp.name} · ${sp.mp} MP` + (cd>0 ? ` · ${cd} s` : "");
    const needsCombat = (sp.kind==="dmg"||sp.kind==="paraEnemy");
    b.disabled = busy || cd>0 || s.mp<sp.mp || s.restLeft>0 || navActive(s)
      || (s.para>0 && sp.kind!=="cureSelf") || (needsCombat && !s.combat.active)
      || (sp.kind==="cureSelf" && s.para===0);
  });
}
function updateLive(){
  if(!state) return;
  const s = state, c = s.combat, d = derive(s), en = enemyById(c.enemyId);
  const set = (id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
  const w = (id,p)=>{ const el=document.getElementById(id); if(el) el.style.width = clamp(p,0,100)+"%"; };
  const cur = xpFor(d.L), nxt = xpFor(d.L+1);
  set("lvlText", d.L); set("goldText", fmt(s.gold));
  set("xpText", fmt(s.xp)+" / "+fmt(nxt)); w("xpBar", (s.xp-cur)/(nxt-cur)*100);
  set("hpText", Math.ceil(s.hp)+" / "+d.hpMax); w("hpBar", s.hp/d.hpMax*100);
  set("mpText", Math.floor(s.mp)+" / "+d.mpMax); w("mpBar", d.mpMax ? s.mp/d.mpMax*100 : 0);
  set("dockHpText", Math.ceil(s.hp)+" / "+d.hpMax); w("dockHpBar",s.hp/d.hpMax*100);
  set("dockMpText", Math.floor(s.mp)+" / "+d.mpMax); w("dockMpBar",d.mpMax?s.mp/d.mpMax*100:0);
  const enemyHp = clamp(Math.ceil(c.enemyHp),0,en.hp);
  set("dockEnemyName",en.name);
  set("dockEnemyLevel",en.level);
  set("dockEnemyHpText",enemyHp+" / "+en.hp+" HP");
  set("dockCombatState",c.active && s.restLeft===0 && !navActive(s) ? "Peleando" : "Detenido");
  w("dockEnemyHpBar",c.enemyHp/en.hp*100);
  const meter=document.getElementById("dockEnemyMeter");
  if(meter){
    meter.setAttribute("aria-valuemax",String(en.hp));
    meter.setAttribute("aria-valuenow",String(enemyHp));
    meter.setAttribute("aria-label","Vida de "+en.name);
  }
  set("eHpText", Math.max(0,Math.ceil(c.enemyHp))+" / "+en.hp); w("eHpBar", c.enemyHp/en.hp*100);
  const sb = document.getElementById("skillsBox");
  // Tarjetas persistentes actualizadas por hybridRefresh.
  let stLabel = c.active ? "En combate" : "Detenido";
  if(navActive(s)) stLabel = "Navegando ("+fmtDur(Math.ceil(s.nav.remainingMs/1000))+")";
  else if(s.restLeft>0) stLabel = "Descansando ("+s.restLeft+" s)";
  else if(s.para>0) stLabel = "Paralizado ("+s.para+" s)";
  else if(c.enemyPara>0 && c.active) stLabel += " · enemigo inmovilizado";
  updateNavUI();
  updateWorkspaceLive();
  set("combatState", stLabel);
  const sbtn = document.getElementById("startBtn"), tb = document.getElementById("stopBtn");
  if(sbtn) sbtn.disabled = (c.active && !navActive(s)) || s.restLeft>0;
  if(tb) tb.disabled = !c.active;
  const rb = document.getElementById("restBtn");
  if(rb){
    const cost = restCost(d.L);
    let label;
    if(s.restLeft>0) label = `Descansando… ${s.restLeft} s`;
    else if(s.restCd>0) label = `Descanso listo en ${s.restCd} s`;
    else label = `Descansar (${CFG.REST_SEC} s · ${cost} oro)`;
    rb.textContent = label;
    rb.disabled = s.restLeft>0 || s.restCd>0 || s.gold<cost || s.hp>=d.hpMax;
  }
  updateSpells();
  const lb = document.getElementById("logBox");
  if(lb){const html=s.log.slice(0,40).map(l=>`<div><span class="muted">${l.t}</span> ${esc(l.msg)}</div>`).join("");if(lb.innerHTML!==html)lb.innerHTML=html;}
}

/* ---------- COMBATE (1 paso = 1 segundo simulado) ---------- */
function playerSwing(d,en){
  const c = state.combat;
  if(rng() < hitChance(d.L,en.level)){
    let dmg = phys(d.attack,en.defense);
    const crit = rng() < CFG.CRIT_CHANCE;
    if(crit) dmg = Math.floor(dmg*CFG.CRIT_MULT);
    c.enemyHp = Math.max(0, c.enemyHp-dmg);
    state.skill.xp += (Math.floor(en.level*0.6)+1)*xpActivityFactor(state,"skills");
    addLog(`Golpeás a ${en.name} por ${dmg}${crit?" (CRÍTICO)":""}.`);
  } else addLog(`Fallás el golpe contra ${en.name}.`);
}
function enemySwing(d,en){
  const s = state;
  if(rng() < hitChance(en.level,d.L)){
    if(en.magic){
      const mdmg = Math.max(1, Math.floor(en.attack*(1-d.magicRes/(d.magicRes+100))));
      s.hp = Math.max(0, s.hp-mdmg);
      addLog(`${en.name} te ataca con magia por ${mdmg}.`);
      sklXp(s,"resMagica",2);
    } else {
      const dmg = phys(en.attack,d.defense);
      s.hp = Math.max(0, s.hp-dmg);
      addLog(`${en.name} te golpea por ${dmg}.`);
      if(s.equip.armor) sklXp(s,"armaduras",1);
      if(s.equip.shield) sklXp(s,"escudos",1);
    }
    if(en.level>=CFG.PARA_LEVEL && s.para===0 && rng()<CFG.PARA_CHANCE){
      s.para = CFG.PARA_SEC; addLog("¡Quedaste paralizado!");
    }
  } else addLog(`${en.name} falla su ataque.`);
}
function onKill(en){
  const s = state, c = s.combat;
  const prevL = derive(s).L;
  const gold = randInt(en.goldMin,en.goldMax);
  s.gold += gold; const awardedXP=gainCharacterXP(s,en.xp);
  if(rng() < en.drop.chance){
    const q = randInt(en.drop.min,en.drop.max);
    s.inventory[en.drop.itemId] = (s.inventory[en.drop.itemId]||0) + q;
    addLog(`Obtenés ${q}x ${en.drop.name}.`);
  }
  s.defeated[en.id] = (s.defeated[en.id]||0) + 1;
  addLog(`${en.boss?"¡JEFE DERROTADO! ":""}${en.name} cae. +${awardedXP} XP, +${gold} oro.`);
  const nd = derive(s);
  if(nd.L > prevL) { addLog(`¡Subiste al nivel ${nd.L}!`); toast("¡Nivel "+nd.L+"!"); }
  s.hp = Math.min(nd.hpMax, s.hp);
  c.enemyHp = en.hp; c.pT = 0; c.eT = 0; c.enemyPara = 0;
  if(OFF.active) OFF.kills++;
  needRender = true;
}
function onDeath(en){
  const s = state, c = s.combat, d = derive(s);
  c.active = false;
  s.hp = Math.max(1, Math.floor(d.hpMax*CFG.DEATH_HP_FRACTION));
  c.enemyHp = en.hp; c.pT = 0; c.eT = 0; c.enemyPara = 0; s.para = 0;
  addLog("Has caído. Volvés a la zona segura. El progreso se conserva.");
  toast("Derrotado: volviste a la zona segura.");
  if(OFF.active) OFF.deaths++;
  needRender = true;
}
// Avanza un segundo: descanso, regeneración, combate, hechizos en enfriamiento
function step(){
  const s = state, c = s.combat;
  if(s.restCd>0) s.restCd--;
  if(s.para>0) s.para--;
  if(c.enemyPara>0) c.enemyPara--;
  for(const k in s.cds) if(s.cds[k]>0) s.cds[k]--;
  const d = derive(s);
  s.hp = clamp(s.hp, 0, d.hpMax);
  s.mp = Math.min(d.mpMax, s.mp + d.mpMax*CFG.MP_REGEN);
  if(s.restLeft>0){
    s.restLeft--;
    s.hp = Math.min(d.hpMax, s.hp + d.hpMax/CFG.REST_SEC);
    if(s.restLeft===0){
      s.hp = d.hpMax; s.restCd = CFG.REST_COOLDOWN_SEC;
      addLog("Terminaste de descansar: vida completa.");
    }
    return;
  }
  if(navActive(s)){
    reportNavEnd(advanceNav(s,1000,rng));
    s.hp = Math.min(d.hpMax, s.hp + d.hpMax*CFG.REGEN_PER_SEC);
    return;
  }
  if(!c.active){
    s.hp = Math.min(d.hpMax, s.hp + d.hpMax*CFG.REGEN_PER_SEC);
    return;
  }
    const en = enemyById(c.enemyId);
  c.pT += 1; c.eT += 1;
  if(c.pT >= CFG.ATTACK_INTERVAL - 1e-9){
    c.pT -= CFG.ATTACK_INTERVAL;
    if(s.para>0) addLog("Estás paralizado y no podés atacar.");
    else {
      playerSwing(d,en);
      if(c.enemyHp<=0){ onKill(en); return; }
    }
  }
  if(c.eT >= CFG.ATTACK_INTERVAL - 1e-9){
    c.eT -= CFG.ATTACK_INTERVAL;
    if(c.enemyPara>0) addLog(`${en.name} está inmovilizado.`);
    else {
      enemySwing(d,en);
      if(s.hp<=0){ onDeath(en); return; }
    }
  }
  s.hp = Math.min(d.hpMax, s.hp + d.hpMax*CFG.REGEN_PER_SEC);
}
// Ciclo en tiempo real (1 s)
function tick(){
  if(!state || !ready || busy || managing) return;
  needRender = false;
  syncRuntime();
  if(busy) return;
  if(needRender)persist();
  updateLive();updateInv();
}

/* ---------- PROGRESO OFFLINE (máx. 24 h) ---------- */
async function simulateOffline(elapsedSec){
  const s = state;
  const sec = Math.min(Math.max(0, Math.floor(elapsedSec)), CFG.OFFLINE_MAX_SEC);
  const capped = elapsedSec > CFG.OFFLINE_MAX_SEC;
  if(sec < 1) return null;
  const wasActive = s.combat.active, wasNav=navActive(s), g0 = s.gold, x0 = s.xp, nav0=s.skills.navegacion.xp, L0 = levelFromXp(s.xp);
  OFF.active = true; OFF.kills = 0; OFF.deaths = 0;
  busy = true;
  document.getElementById("gameScreen").inert = true;
  document.getElementById("combatDock").inert = true;
    let i=0, nextStatus=0;
  try {
    while(i<sec){
      const start=performance.now();
      let batch=0;
      do {
        if(navActive(s) && !s.nav.legacy && s.restLeft===0){
                    const remainingSec=sec-i;
          reportNavEnd(advanceNav(s,remainingSec*1000));
          passiveSeconds(s,remainingSec);
          i=sec;
        } else if(!s.combat.active && !navActive(s) && s.restLeft===0){
          passiveSeconds(s,sec-i);i=sec;
        } else { step(); i++; }
        batch++;
      }
      while(i<sec && batch<250 && performance.now()-start<8);
      const now=performance.now();
      if(now>=nextStatus){
        setStatus("Calculando progreso offline… "+Math.floor(i/sec*100)+"%",false);
        nextStatus=now+100;
      }
      if(i<sec) await new Promise(r=>setTimeout(r,0));
    }
  } finally {
    OFF.active = false; busy = false;
    document.getElementById("gameScreen").inert = false;
    document.getElementById("combatDock").inert = false;
  }
  const L1 = levelFromXp(s.xp);
  const t = new Date().toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
  let msg = `Mientras estabas fuera (${fmtDur(sec)}${capped?", tope de 24 h":""}): `;
  if(wasActive) msg += `${OFF.kills} enemigos derrotados, +${fmt(s.gold-g0)} oro, +${fmt(s.xp-x0)} XP`
                    + (OFF.deaths? `, ${OFF.deaths} derrota(s)` : "")
                    + (L1>L0? `, subiste al nivel ${L1}` : "") + ".";
  else if(wasNav) msg += `+${fmt(s.gold-g0)} oro, +${fmt(s.skills.navegacion.xp-nav0)} XP de Navegación; sin XP de personaje. ${navHas(s)?"La expedición continúa.":"Expedición finalizada; luego permaneciste detenido."}`;
  else msg += "estabas detenido; la vida y el maná se regeneraron.";
  s.log.unshift({t, msg});
  if(s.log.length > CFG.LOG_MAX) s.log.length = CFG.LOG_MAX;
  return { sec, kills:OFF.kills, deaths:OFF.deaths };
}

/* ---------- ACCIONES ---------- */
function selectDungeon(id){
  const c = state.combat, dg = dungeonById(id);
  if(!dungeonOk(dg, state)) return toast("Dungeon bloqueado.");
  const list = ENEMIES.filter(e=>e.dungeonId===dg.id);
  const first = list.find(e=>enemyUnlocked(e,derive(state).L)) || list[0];
  c.active = false; c.dungeonId = dg.id; c.enemyId = first.id; c.enemyHp = first.hp; c.pT = 0; c.eT = 0; c.enemyPara = 0;
  addLog(`Entrás a ${dg.name}.`);
}
function selectEnemy(id){
  const c = state.combat, en = enemyById(id);
  c.active = false; c.enemyId = id; c.enemyHp = en.hp; c.pT = 0; c.eT = 0; c.enemyPara = 0;
  addLog(`Objetivo: ${en.name}.`);
}
function startCombat(){
  if(state.restLeft>0){ toast("Estás descansando."); return; }
  if(navActive(state)) addLog("Expedición pausada para combatir.");
  beginPhysicalCombat(state);
  runtimeRemainder=0;
  const d = derive(state);
  if(state.hp < d.hpMax*0.5) addLog("Vida baja: conviene descansar antes de pelear.");
  state.combat.active = true;
  addLog("Comienza el combate.");
}
function stopCombat(){ state.combat.active = false; addLog("Combate detenido."); }
function rest(){
  const s = state, d = derive(s), cost = restCost(d.L);
  if(s.restLeft>0 || s.restCd>0) return toast("Todavía no podés descansar.");
  if(s.hp>=d.hpMax) return toast("Ya tenés la vida completa.");
  if(s.gold<cost) return toast(`Necesitás ${cost} oro para descansar.`);
  pauseNav(s);
  s.gold -= cost; s.combat.active = false; s.restLeft = CFG.REST_SEC;
  runtimeRemainder=0;
  addLog(`Descansás (${CFG.REST_SEC} s, −${cost} oro).`);
}
function castSpell(id){
  const s = state, c = s.combat, sp = spellById(id);
  if(!sp || !s.spells[id]) return;
  if(s.restLeft>0) return toast("Estás descansando.");
  if(navActive(s)) return toast("Estás navegando.");
  if((s.cds[id]||0)>0) return toast("Hechizo en enfriamiento.");
  if(s.mp<sp.mp) return toast("Maná insuficiente.");
  if(s.para>0 && sp.kind!=="cureSelf") return toast("Estás paralizado: solo podés usar Remover Parálisis.");
  const needsCombat = (sp.kind==="dmg"||sp.kind==="paraEnemy");
  if(needsCombat && !c.active) return toast("Iniciá un combate para usar este hechizo.");
  if(sp.kind==="cureSelf" && s.para===0) return toast("No estás paralizado.");
  const d = derive(s);
  if(sp.kind==="heal" && s.hp>=d.hpMax) return toast("Ya tenés la vida completa.");
  const en = enemyById(c.enemyId);
  s.mp -= sp.mp; s.cds[id] = sp.cd; sklXp(s,"magia",Math.max(1,Math.round(sp.mp*0.35)));
  if(sp.kind==="dmg"){
    const dmg = Math.max(1, Math.floor(sp.power*d.spellMult*(1-en.magicRes/(en.magicRes+100))));
    c.enemyHp = Math.max(0, c.enemyHp-dmg);
    addLog(`Lanzás ${sp.name} y hacés ${dmg} de daño a ${en.name}.`);
    if(sp.stun && rng()<sp.stun){ c.enemyPara = CFG.PARA_SEC; addLog(`${en.name} queda inmovilizado.`); }
    if(c.enemyHp<=0) onKill(en);
  } else if(sp.kind==="heal"){
    const before = s.hp;
    s.hp = Math.min(d.hpMax, s.hp + Math.floor(d.hpMax*sp.pct));
    addLog(`Lanzás ${sp.name} y recuperás ${fmt(s.hp-before)} HP.`);
  } else if(sp.kind==="paraEnemy"){
    c.enemyPara = sp.dur; addLog(`Lanzás ${sp.name}: ${en.name} queda inmovilizado ${sp.dur} s.`);
  } else if(sp.kind==="cureSelf"){
    s.para = 0; addLog(`Lanzás ${sp.name}: ya no estás paralizado.`);
  }
  needRender = true;
}
function buyEquip(id){
  const s = state, it = itemById(id);
  if(!it || s.owned[id]) return;
  if(!reqOk(s,it.req)) return toast("No cumplís el requisito de habilidad.");
  if(s.gold < it.price) return toast("No tenés oro suficiente.");
  s.gold -= it.price; s.owned[id] = true;
  addLog(`Comprás ${it.name} por ${it.price} oro.`);
}
function buySpell(id){
  const s = state, sp = spellById(id);
  if(!sp || s.spells[id]) return;
  if(skl(s,"magia") < sp.req) return toast("Necesitás más nivel de Magia.");
  if(s.gold < sp.price) return toast("No tenés oro suficiente.");
  s.gold -= sp.price; s.spells[id] = true;
  addLog(`Aprendés ${sp.name}.`);
}
function toggleEquip(id){
  const s = state, it = itemById(id);
  if(!it || !s.owned[id]) return;
  s.equip[it.slot] = s.equip[it.slot]===id ? null : id;
  const d = derive(s);
  s.hp = clamp(s.hp, 0, d.hpMax); s.mp = clamp(s.mp, 0, d.mpMax);
  addLog(s.equip[it.slot]===id ? `Equipás ${it.name}.` : `Quitás ${it.name}.`);
}

function startNav(id){
  const s=state,a=NAV.find(x=>x.id===id);
  if(!a || !canNav(a) || !NAV_HOURS.includes(navDuration)) return toast("No podés navegar ahora.");
  s.combat.active=false;
  s.nav={id:a.id,left:navDuration*3600,totalMs:navDuration*NAV_DENOM,remainingMs:navDuration*NAV_DENOM,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0};
  runtimeRemainder=0;
  addLog(`Zarpás: ${a.name}, ${navDuration} h. 400 XP/h y ${a.goldHour} oro/h.`);
}
function canNav(a){ return skl(state,"navegacion")>=a.req && !navHas(state) && state.restLeft===0; }
function updateNavUI(){
  const s=state,n=s.nav,has=navHas(s),box=document.getElementById("navProgress");
  const duration=ms=>{const sec=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(sec/3600)} h ${Math.floor(sec%3600/60)} min ${sec%60} s`;};
  if(box){
    if(has){
      const a=NAV.find(x=>x.id===n.id);
      box.innerHTML=`<div class="panel" style="margin-top:10px"><b>${esc(a.name)}${n.legacy?" · viaje antiguo":""}</b><div class="row"><span>${n.paused?"Pausada":"Navegando"}</span><span>Restan ${duration(n.remainingMs)}</span></div><div class="bar xp"><div style="width:${clamp(n.elapsedMs/n.totalMs*100,0,100)}%;background:var(--xp)"></div></div><div class="muted">Tiempo efectivo: ${duration(n.elapsedMs)} / ${duration(n.totalMs)}<br>Acreditado: ${fmt(n.earnedGold)} oro · ${fmt(n.earnedXp)} XP de Navegación${n.legacy?"<br>Conserva su recompensa original al completarse; no se transforma en expedición larga.":""}</div></div>`;
    } else {
      const last=s.navLast;
      box.innerHTML=last?`<div class="muted">Última expedición ${last.completed?"completada":"cancelada"}: ${fmt(last.earnedGold)} oro · ${fmt(last.earnedXp)} XP de Navegación. Sin recompensas pendientes de cobrar.</div>`:'<div class="muted">Sin expedición en curso.</div>';
    }
  }
  for(const [id,enabled] of [["navPauseBtn",has&&!n.paused],["navResumeBtn",has&&n.paused&&s.restLeft===0],["navCancelBtn",has]]){
    const b=document.getElementById(id);if(b)b.disabled=!enabled || busy;
  }
  document.querySelectorAll('[data-act="nav"]').forEach(b=>{const a=NAV.find(x=>x.id===b.dataset.id);b.disabled=busy||!canNav(a);});
}
function canCast(id){
  const s = state, sp = spellById(id);
  if(!sp || !s.spells[id]) return false;
  if(s.restLeft>0 || navActive(s)) return false;
  if((s.cds[id]||0)>0 || s.mp<sp.mp) return false;
  if(s.para>0 && sp.kind!=="cureSelf") return false;
  if((sp.kind==="dmg"||sp.kind==="paraEnemy") && !s.combat.active) return false;
  if(sp.kind==="cureSelf" && s.para===0) return false;
  if(sp.kind==="heal" && s.hp>=derive(s).hpMax) return false;
  return true;
}
async function exportJSON(){
  if(state&&ready)syncRuntime();
  if(busy)return toast("Esperá a que termine el cálculo offline.");
  const rec=makeRosterRecord();
  const url=URL.createObjectURL(new Blob([JSON.stringify(rec,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download=gameMode==="dev"?"argentum-dev-personajes-v7.json":"argentum-personajes-v7.json";a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function importJSON(file){
  if(managing||busy||!storageReady)return;
  managing=true;
  let old=null;
  try{
    const raw=JSON.parse(await file.text());
    const incoming=decodeRoster(raw);
    if(!incoming)throw Error("Formato inválido o datos incompletos. No se importó nada.");
    const legacy=raw.version!==7;
    if(legacy&&roster.characters.length>=5)throw Error("Ya tenés 5 personajes. Liberá un espacio para incorporar un JSON antiguo.");
    if(!confirm(legacy?"Agregar el personaje del JSON antiguo sin borrar los actuales. Se importará pausado. ¿Continuar?":"Reemplazar TODOS los personajes por este respaldo. Se guardará una copia previa y se importarán pausados. ¿Continuar?"))return;
    if(state&&ready)syncRuntime();
    if(busy)throw Error("Se está calculando progreso offline. Esperá y volvé a importar.");
    old=makeRosterRecord();
    await durableBackup(old,"before-import");
    await durableBackup(raw,"import-source");
    e210StopFishing();
    if(legacy){
      const entry=incoming.characters[0];entry.id=newCharacterId();
      freezeCharacter(entry.state);roster.characters.push(entry);
      if(state)freezeCharacter(state);
      roster.activeId=null;
    }else{
      roster=incoming;
      roster.characters.forEach(entry=>freezeCharacter(entry.state));
      roster.activeId=null;
    }
    state=null;ready=false;runtimeAt=0;runtimeRemainder=0;
    if(!await saveRoster())throw Error("No se pudo conservar la importación. Se restauró la sesión anterior.");
    showCharacters();toast("Importación completada. Todos los personajes están pausados; no se cobra tiempo desde la exportación.");
  }catch(e){
    if(old){restoreRosterSnapshot(old);await saveRoster();if(state){showGame();renderGame();}else showCharacters();}
    toast(e.message||"No se pudo importar.");
  }finally{managing=false;}
}

/* ---------- PRUEBAS AISLADAS (sin alterar la partida) ---------- */
function runNavTests(){
  const results=[];
  const check=(name,fn)=>{try{if(!fn())throw Error("resultado inesperado");results.push("✓ "+name);}catch(e){results.push("✗ "+name+": "+e.message);}};
  // Full character fixture: XP presentation derives class/equipment stats too.
  const fixture=(id="costa",hours=24)=>({...devFixture(),gold:0,navCarry:{gold:0,xp:0},nav:{id,left:hours*3600,totalMs:hours*NAV_DENOM,remainingMs:hours*NAV_DENOM,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0}});
  check("1 hora costa: 60 oro y 400 XP",()=>{const s=fixture();advanceNav(s,NAV_DENOM);return s.gold===60&&s.skills.navegacion.xp===400;});
  check("Rutas: 60 / 72 / 80 oro/h",()=>NAV.every(a=>{const s=fixture(a.id);advanceNav(s,NAV_DENOM);return s.gold===a.goldHour&&s.skills.navegacion.xp===400;}));
  check("400 XP/h: Navegación 25 a 14 h 24 min",()=>{const s=fixture();advanceNav(s,51840000);return s.skills.navegacion.xp===5760&&skl(s,"navegacion")===25;});
  check("Combate pausa y no acredita navegación",()=>{const s=fixture();advanceNav(s,1800000);beginPhysicalCombat(s);advanceNav(s,NAV_DENOM);return s.combat.active&&s.nav.paused&&s.gold===30&&s.skills.navegacion.xp===200;});
  check("Reanudar detiene combate y conserva avance",()=>{const s=fixture();advanceNav(s,1800000);beginPhysicalCombat(s);resumeNavigation(s);advanceNav(s,1800000);return !s.combat.active&&s.gold===60&&s.nav.elapsedMs===NAV_DENOM;});
  check("Cancelar conserva proporcional, sin doble premio",()=>{const s=fixture();advanceNav(s,1800000);cancelNavigation(s);cancelNavigation(s);advanceNav(s,NAV_DENOM);return s.gold===30&&s.skills.navegacion.xp===200&&!navHas(s);});
  check("Fracciones sobreviven a cancelar y reiniciar",()=>{const a=fixture(),b=fixture();advanceNav(a,1001);cancelNavigation(a);a.nav=fixture().nav;advanceNav(a,3598999);advanceNav(b,NAV_DENOM);return a.gold===b.gold&&a.skills.navegacion.xp===b.skills.navegacion.xp&&JSON.stringify(a.navCarry)===JSON.stringify(b.navCarry);});
  check("Recarga JSON no vuelve a acreditar",()=>{const s=fixture();advanceNav(s,1800000);const t=JSON.parse(JSON.stringify(s));normalizeNav(t);normalizeNav(t);advanceNav(t,1800000);return t.gold===60&&t.skills.navegacion.xp===400;});
  check("Offline 24 h: 9600 XP, 1440 oro costa",()=>{const s=fixture();advanceNav(s,Math.min(172800,CFG.OFFLINE_MAX_SEC)*1000);return s.gold===1440&&s.skills.navegacion.xp===9600&&!navHas(s);});
  check("Termina tras 1 h: no cobra otras 23 h",()=>{const s=fixture("costa",1);advanceNav(s,86400000);advanceNav(s,86400000);return s.gold===60&&s.skills.navegacion.xp===400&&!navHas(s);});
  check("Online por pasos = offline agrupado",()=>{const a=fixture("tormenta_nav"),b=fixture("tormenta_nav");for(let i=0;i<86400;i++)advanceNav(a,1000);advanceNav(b,86400000);return a.gold===b.gold&&a.skills.navegacion.xp===b.skills.navegacion.xp&&JSON.stringify(a.navCarry)===JSON.stringify(b.navCarry);});
  check("Viaje antiguo: recompensa original solo una vez",()=>{const s=fixture();s.nav={id:"costa",left:10};normalizeNav(s);advanceNav(s,9000,()=>0);if(s.gold!==0)return false;advanceNav(s,1000,()=>0);advanceNav(s,1000,()=>0);return s.gold===3&&s.skills.navegacion.xp===30&&!navHas(s);});
  check("Viaje antiguo y combate: prioridad legado",()=>{const s=fixture();s.nav={id:"costa",left:10};s.combat.active=true;normalizeNav(s);const before=navActive(s)&&s.combat.active;advanceNav(s,10000,()=>0);return before&&!navHas(s)&&s.combat.active;});
  check("Descanso impide reanudar",()=>{const s=fixture();pauseNav(s);s.restLeft=20;return !resumeNavigation(s)&&s.nav.paused;});
  check("Pirata conserva nivel 35 y Navegación 25",()=>{const d=dungeonById("dungeon_pirata");return d.minLevel===35&&d.navReq===25;});
  const box=document.getElementById("navTestOutput");if(box)box.textContent=results.join("\n")+"\n\n"+results.filter(x=>x.startsWith("✓")).length+" / "+results.length+" pruebas aprobadas.\nEstas pruebas validan contabilidad y transiciones; no sustituyen pruebas de UI, IndexedDB ni del combate completo.";
}

/* ---------- EVENTOS ---------- */
document.addEventListener("click", async e=>{
  const b = e.target.closest("[data-act]"); if(!b || b.disabled || busy || managing || !storageReady) return;
  const act = b.dataset.act, id = b.dataset.id;
  if(state && ready){ syncRuntime(); if(busy) return; }
  if(act==="navTests"){ runNavTests(); return; }
  if(act==="navPause"){ pauseNav(state); addLog("Expedición pausada; no genera recompensas mientras está pausada."); persist(); renderGame(); return; }
  if(act==="navResume"){ if(resumeNavigation(state)){runtimeRemainder=0;addLog("Expedición reanudada; combate detenido.");} persist(); renderGame(); return; }
  if(act==="navCancel"){ if(cancelNavigation(state))addLog("Expedición cancelada. Conservás lo ya acreditado, sin premio adicional."); persist(); renderGame(); return; }
  if(act==="race"){ draft.race = id; renderCreate(); }
  else if(act==="class"){ draft.cls = id; renderCreate(); }
  else if(act==="dungeon"){ selectDungeon(id); persist(); renderGame(); }
  else if(act==="enemy"){ selectEnemy(id); persist(); renderGame(); }
  else if(act==="start"){ startCombat(); persist(); renderGame(); }
  else if(act==="stop"){ stopCombat(); persist(); renderGame(); }
  else if(act==="rest"){ rest(); persist(); renderGame(); }
  else if(act==="nav"){ startNav(id); persist(); renderGame(); }
  else if(act==="cast"){ castSpell(id); persist(); renderGame(); }
  else if(act==="buy"){ buyEquip(id); persist(); renderGame(); }
  else if(act==="buySpell"){ buySpell(id); persist(); renderGame(); }
  else if(act==="equip"){ toggleEquip(id); persist(); renderGame(); }
  else if(act==="favorite"){ toggleFavorite(id); persist(); renderGame(); }
  else if(act==="downloadHtml"){ downloadHTML(); }
  else if(act==="export"){ exportJSON(); }
  else if(act==="import"){ document.getElementById("importFile").click(); }
  // Borrado individual atendido por la capa v7, sin eliminar el registro main.
});
document.addEventListener("change", e=>{
  if(busy) return;
  if(e.target.id==="navHours") navDuration=Number(e.target.value);
  if(e.target.id==="importFile" && e.target.files[0]) importJSON(e.target.files[0]);
});
document.addEventListener("input", e=>{
  if(e.target.id==="charName"){ draft.name = e.target.value; renderCreate(); }
});
// La creación se gestiona en la capa v7 con control del límite y guardado atómico.

/* ---------- PANTALLAS ---------- */
function showCreate(){
  document.getElementById("characterScreen").classList.add("hidden");
  document.getElementById("createScreen").classList.remove("hidden");
  document.getElementById("gameScreen").classList.add("hidden");
  document.getElementById("combatDock").classList.add("hidden");
  measureDock();
  renderCreate();
}
function showGame(){
  document.getElementById("characterScreen").classList.add("hidden");
  document.getElementById("createScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  document.getElementById("combatDock").classList.remove("hidden");
  measureDock();
}
window.addEventListener("resize",measureDock);
if("ResizeObserver" in window) new ResizeObserver(measureDock).observe(document.getElementById("combatDock"));

/* ---------- INTERFAZ COMPACTA: preferencias opcionales por personaje ---------- */
const UI_TABS=[["combat","Combate"],["character","Personaje"],["magic","Magia"],["inventory","Inventario"],["equipment","Equipamiento"],["shop","Tienda"],["navigation","Navegación"]];
function uiPreferences(s){
  if(!s.ui || typeof s.ui!=="object" || Array.isArray(s.ui))s.ui={};
  if(!UI_TABS.some(([id])=>id===s.ui.tab))s.ui.tab="combat";
  if(!s.ui.panels || typeof s.ui.panels!=="object" || Array.isArray(s.ui.panels))s.ui.panels={};
  return s.ui;
}
function organizeWorkspace(){
  const prefs=uiPreferences(state);
  document.getElementById("uiWorkspace")?.remove();
  const root=document.createElement("div");root.id="uiWorkspace";
  root.innerHTML=`<div class="workspaceHeader"><div class="identity"><b>${esc(state.name)}</b> · ${esc(classById(state.cls).name)} · ${esc(raceById(state.race).name)}<br><span id="compactLevelGold" class="muted"></span></div><button class="small" data-act="rest">Descansar</button><button class="small" data-act="switchCharacter">Cambiar personaje</button></div><div class="workspaceTabs" role="tablist" aria-label="Secciones del juego">${UI_TABS.map(([id,label])=>`<button id="tab_${id}" role="tab" aria-controls="page_${id}" data-ui-tab="${id}">${label}</button>`).join("")}</div><button id="compactNavSummary" class="navCompact hidden" data-ui-nav="true"></button>${UI_TABS.map(([id,label])=>`<section id="page_${id}" class="workspacePage hidden" role="tabpanel" aria-labelledby="tab_${id}" aria-label="${label}"></section>`).join("")}`;
  document.getElementById("gameScreen").append(root);
  const place=(source,mapping)=>{
    const nodes=Array.from(source.children);let body=null;
    for(const node of nodes){
      if(node.tagName==="H2"){
        const label=node.textContent.trim(),spec=mapping(label);
        const panel=document.createElement("details");panel.dataset.uiPanel=spec.key;
        const summary=document.createElement("summary");summary.textContent=label;panel.append(summary);
        body=document.createElement("div");body.className="sectionBody";panel.append(body);
        panel.open=typeof prefs.panels[spec.key]==="boolean"?prefs.panels[spec.key]:spec.open;
        document.getElementById("page_"+spec.tab).append(panel);node.remove();
      }else if(body)body.append(node);
    }
  };
  place(document.getElementById("pChar"),label=>{
    if(label==="Habilidades")return {tab:"character",key:"skills",open:true};
    if(label==="Equipo")return {tab:"equipment",key:"equipment",open:true};
    if(label==="Inventario")return {tab:"inventory",key:"inventory",open:true};
    if(label==="Guardado")return {tab:"character",key:"save",open:false};
    return {tab:"character",key:"attributes",open:true};
  });
  place(document.getElementById("pCombat"),label=>{
    if(label.startsWith("Hechizos"))return {tab:"magic",key:"magic",open:true};
    if(label==="Navegación")return {tab:"navigation",key:"navigation",open:false};
    if(label==="Tienda")return {tab:"shop",key:"shop",open:true};
    if(label==="Registro de combate")return {tab:"combat",key:"log",open:false};
    return {tab:"combat",key:"combat",open:true};
  });
  root.querySelectorAll("details[data-ui-panel]").forEach(panel=>{
    const key=panel.dataset.uiPanel;
    if(typeof prefs.panels[key]==="boolean")panel.open=prefs.panels[key];
    panel.addEventListener("toggle",()=>{
      if(!panel.isConnected||!state||busy||managing)return;
      const p=uiPreferences(state);
      if(p.panels[key]===panel.open)return;
      p.panels[key]=panel.open;persist();
    });
  });
  selectWorkspaceTab(prefs.tab,false);
}
function selectWorkspaceTab(id,save=true){
  if(!state||!UI_TABS.some(([key])=>key===id))return;
  uiPreferences(state).tab=id;
  for(const [key] of UI_TABS){
    const selected=key===id,tab=document.getElementById("tab_"+key),page=document.getElementById("page_"+key);
    if(tab){tab.setAttribute("aria-selected",String(selected));tab.tabIndex=selected?0:-1;}
    if(page)page.classList.toggle("hidden",!selected);
  }
  if(save)persist();
}
function updateWorkspaceLive(){
  const label=document.getElementById("compactLevelGold");
  if(label)label.textContent=`Nivel ${levelFromXp(state.xp)} · ${fmt(state.gold)} oro`;
  const button=document.getElementById("compactNavSummary");if(!button)return;
  const has=navHas(state);button.classList.toggle("hidden",!has);
  if(has){const n=state.nav,route=NAV.find(a=>a.id===n.id);button.textContent=`⚓ ${route?route.name:n.id} · ${n.paused?"Pausada":"Navegando"} · Restan ${fmtDur(Math.ceil(n.remainingMs/1000))} · Ver expedición`;}
}
document.addEventListener("click",e=>{
  const button=e.target.closest("[data-ui-tab],[data-ui-nav]");
  if(!button||busy||managing||!state||!ready)return;
  if(button.dataset.uiNav){
    const panel=document.querySelector('details[data-ui-panel="navigation"]');
    if(panel){panel.open=true;uiPreferences(state).panels.navigation=true;}
    selectWorkspaceTab("navigation");
  }else selectWorkspaceTab(button.dataset.uiTab);
});


/* ---------- PERSONAJES Y PERSISTENCIA v7 ---------- */
const MAX_CHARACTERS=5;
const copyJSON=value=>JSON.parse(JSON.stringify(value));
let roster={version:7,revision:0,savedAt:0,activeId:null,characters:[]};
let storageReady=false,managing=false,writeQueue=Promise.resolve(),lastStamp=0;
function newCharacterId(){
  return globalThis.crypto&&crypto.randomUUID?crypto.randomUUID():"pc-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
}
function freezeCharacter(s){
  s.combat.active=false;pauseNav(s);
  // restLeft, cooldowns, parálisis y avance parcial no cambian mientras está inactivo.
  s.savedAt=0;
}
function finiteNonnegative(n){return typeof n==="number"&&Number.isFinite(n)&&n>=0;}
function safeCharacter(s){
  if(!validState(s))return false;
  if(![s.xp,s.gold,s.hp,s.skill.xp].every(finiteNonnegative))return false;
  if(s.mp!==undefined&&!finiteNonnegative(s.mp))return false;
  for(const key of ["pT","eT","enemyHp","enemyPara"]){
    if(s.combat[key]!==undefined&&!finiteNonnegative(s.combat[key]))return false;
  }
  for(const key of ["restLeft","restCd","para"]){if(s[key]!==undefined&&!finiteNonnegative(s[key]))return false;}
  for(const key of ["skills","inventory","defeated","owned","equip","spells","cds"]){
    if(s[key]!==undefined&&(!s[key]||typeof s[key]!=="object"||Array.isArray(s[key])))return false;
  }
  if(s.skills&&Object.values(s.skills).some(k=>!k||!finiteNonnegative(k.xp)))return false;
  for(const key of ["inventory","defeated","cds"]){if(s[key]&&Object.values(s[key]).some(v=>!finiteNonnegative(v)))return false;}
  return true;
}
function decodeRoster(raw){
  if(!raw||typeof raw!=="object")return null;
  if(raw.version===7){
    if(!Array.isArray(raw.characters)||raw.characters.length>MAX_CHARACTERS)return null;
    const ids=new Set();
    for(const entry of raw.characters){
      if(!entry||typeof entry.id!=="string"||!entry.id||ids.has(entry.id)||!safeCharacter(entry.state))return null;
      ids.add(entry.id);
    }
    if(raw.activeId!==null&&!ids.has(raw.activeId))return null;
    const result=copyJSON(raw);
    result.revision=Number.isSafeInteger(raw.revision)&&raw.revision>=0?raw.revision:0;
    result.savedAt=finiteNonnegative(raw.savedAt)?raw.savedAt:0;
    for(const entry of result.characters){
      // Normalización idempotente: no entrega premios ni calcula tiempo.
      entry.state=migrateState(entry.state,7);
      if(entry.id!==result.activeId)freezeCharacter(entry.state);
    }
    return result;
  }
  if(![1,2,3,4,5,6].includes(raw.version)||!safeCharacter(raw.state))return null;
  const s=unwrap(raw);if(!s)return null;
  const id=newCharacterId();
  return {version:7,revision:0,savedAt:finiteNonnegative(raw.savedAt)?raw.savedAt:(s.savedAt||0),activeId:id,characters:[{id,state:s}]};
}
async function durableBackup(raw,reason){
  const key=(gameMode==="dev"?"argentum-idle-dev-backup-v":"argentum-idle-backup-v")+raw.version+"-"+reason+"-"+Date.now()+"-"+newCharacterId();
  const text=JSON.stringify(raw);let localOK=false,idbOK=false;
  try{localStorage.setItem(key,text);localOK=localStorage.getItem(key)===text;}catch(_){}
  try{
    const db=await openDB();
    await new Promise((resolve,reject)=>{
      const tx=db.transaction("saves","readwrite");tx.objectStore("saves").put(copyJSON(raw),key);
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error("respaldo abortado"));
    });idbOK=true;
  }catch(_){}
  if(!localOK&&!idbOK){const error=Error("No se pudo crear el respaldo previo. No se reemplazó el guardado.");error.backupFailure=true;throw error;}
}
function makeRosterRecord(){
  const now=Math.max(Date.now(),lastStamp+1,Number(roster.savedAt||0)+1);lastStamp=now;
  if(state&&roster.activeId){
    const entry=roster.characters.find(c=>c.id===roster.activeId);
    if(!entry)throw Error("El personaje activo no pertenece al conjunto.");
    entry.state=state;state.savedAt=now;
  }
  roster.version=7;roster.savedAt=now;roster.revision++;
  return copyJSON(roster);
}
function saveRoster(){
  if(!storageReady)return Promise.resolve(false);
  const record=makeRosterRecord();
    const job=async()=>{
    let localOK=false,idbOK=false;
    try{localStorage.setItem(LS_KEY,JSON.stringify(record));localOK=true;}catch(_){}
    try{await idbPut(record);idbOK=true;}catch(_){}
    if(!localOK&&!idbOK){setStatus("No se pudo guardar: exportá tu partida antes de cerrar.",true);return false;}
    lastSave=new Date(record.savedAt).toLocaleTimeString("es-AR");
    setStatus("Guardado v7 · "+roster.characters.length+" / 5 · "+lastSave+" · "+(localOK&&idbOK?"IndexedDB + localStorage":localOK?"localStorage":"IndexedDB"),false);
    return true;
  };
  const task=writeQueue.then(job,job);writeQueue=task.catch(()=>false);return task;
}
function restoreRosterSnapshot(raw){
  roster=copyJSON(raw);
  state=roster.activeId?roster.characters.find(c=>c.id===roster.activeId).state:null;
  ready=!!state;runtimeAt=ready?Date.now():0;runtimeRemainder=0;
}
function showCharacters(){
  for(const id of ["createScreen","gameScreen","combatDock"])document.getElementById(id).classList.add("hidden");
  document.getElementById("characterScreen").classList.remove("hidden");
  document.getElementById("characterCount").textContent=roster.characters.length;
  document.getElementById("newCharacterBtn").disabled=roster.characters.length>=MAX_CHARACTERS||!storageReady;
  document.getElementById("characterList").innerHTML=roster.characters.map(entry=>{
    const s=entry.state;
    return `<div class="panel"><b>${esc(s.name)}</b><div class="muted">${esc(classById(s.cls).name)} · ${esc(raceById(s.race).name)} · Nivel ${levelFromXp(s.xp)}</div><div class="muted">${fmt(s.gold)} oro${navHas(s)?" · Expedición pausada":""}${s.restLeft>0?" · Descanso pendiente":""}</div><div class="actions"><button class="primary" data-act="selectCharacter" data-id="${esc(entry.id)}">Jugar</button><button class="danger small" data-act="deleteCharacter" data-id="${esc(entry.id)}">Borrar</button></div></div>`;
  }).join("")||'<p class="muted">Todavía no hay personajes. Creá el primero.</p>';
  measureDock();
}
async function changeRoster(action,id){
  if(managing||busy||!storageReady)return;
  managing=true;let previous=null;
  try{
    if(state&&ready)syncRuntime();
    if(busy)throw Error("Esperá a que termine el cálculo offline y volvé a intentar.");
    previous=makeRosterRecord();
    if(action==="leave"){
      if(typeof e210StopFishing==='function')e210StopFishing();
      if(state)freezeCharacter(state);
      roster.activeId=null;state=null;ready=false;runtimeAt=0;runtimeRemainder=0;
    }else if(action==="select"){
      if(roster.activeId)throw Error("Volvé primero a la selección.");
      const entry=roster.characters.find(c=>c.id===id);if(!entry)throw Error("Personaje inexistente.");
      freezeCharacter(entry.state);roster.activeId=id;state=entry.state;ready=true;runtimeAt=Date.now();runtimeRemainder=0;
    }else if(action==="create"){
      if(roster.characters.length>=MAX_CHARACTERS)throw Error("Límite de 5 personajes.");
      if(roster.activeId||!classById(draft.cls)||!raceById(draft.race)||draft.name.trim().length<2)throw Error("Completá la creación del personaje.");
      draft.name=draft.name.trim().slice(0,18);
      const s=newState(),newId=newCharacterId();roster.characters.push({id:newId,state:s});
      roster.activeId=newId;state=s;ready=true;runtimeAt=Date.now();runtimeRemainder=0;
    }else if(action==="delete"){
      const entry=roster.characters.find(c=>c.id===id);if(!entry)return;
      if(!confirm(`¿Borrar a «${entry.state.name}» (nivel ${levelFromXp(entry.state.xp)})? Solo se elimina este personaje.`))return;
      await durableBackup(previous,"before-delete");
      if(roster.activeId===id)e210StopFishing();
      roster.characters=roster.characters.filter(c=>c.id!==id);
      if(roster.activeId===id){roster.activeId=null;state=null;ready=false;runtimeAt=0;runtimeRemainder=0;}
    }
    if(!await saveRoster())throw Error("No se pudo guardar el cambio. Se conservó la sesión anterior.");
    if(state){showGame();renderGame();}else showCharacters();
  }catch(e){
    if(previous)restoreRosterSnapshot(previous);
    toast(e.message);if(state){showGame();renderGame();}else showCharacters();
  }finally{managing=false;}
}
// Captura: evita ejecutar los antiguos manejadores de un solo personaje.
document.addEventListener("click",async e=>{
  const button=e.target.closest("button");if(!button)return;
  const act=button.dataset.act;
  const handled=button.id==="createBtn"||["switchCharacter","selectCharacter","deleteCharacter","reset","newCharacter","cancelCreate","importRoster","rosterTests","export"].includes(act);
  if(!handled)return;
  e.stopImmediatePropagation();e.preventDefault();
  if(button.disabled||busy||managing||!storageReady)return;
  if(button.id==="createBtn")return changeRoster("create");
  if(act==="switchCharacter")return changeRoster("leave");
  if(act==="selectCharacter")return changeRoster("select",button.dataset.id);
  if(act==="deleteCharacter"||act==="reset")return changeRoster("delete",button.dataset.id||roster.activeId);
  if(act==="export")return exportJSON();
  if(act==="rosterTests")return runRosterTests();
  if(act==="importRoster")return document.getElementById("rosterImportFile").click();
  if(act==="newCharacter"){
    if(roster.characters.length>=5)return;
    draft={name:"",race:null,cls:null};document.getElementById("charName").value="";showCreate();
  }else if(act==="cancelCreate")showCharacters();
},true);
document.addEventListener("change",e=>{
  if(e.target.id==="rosterImportFile"&&e.target.files[0]){importJSON(e.target.files[0]);e.target.value="";}
});

/* Pruebas puras: no escriben IndexedDB/localStorage ni cambian la sesión real. */
function runRosterTests(){
  const output=[];
  const assert=(label,fn)=>{try{if(!fn())throw Error("resultado inesperado");output.push("✓ "+label);}catch(e){output.push("✗ "+label+": "+e.message);}};
  const fixture=()=>{
    const prev=draft;try{draft={name:"Prueba",race:"humano",cls:"mago"};return newState();}finally{draft=prev;}
  };
  const base=()=>({version:7,revision:1,savedAt:1000,activeId:"a",characters:[{id:"a",state:fixture()},{id:"b",state:fixture()}]});
  assert("Migración v6 conserva recursos, equipo, hechizos y expedición",()=>{
    const s=fixture();s.gold=987;s.xp=4321;s.skills.navegacion.xp=2222;s.spells.apocalipsis=true;s.owned.hacha=true;s.equip.weapon="hacha";
    s.nav={id:"costa",left:3600,totalMs:7200000,remainingMs:3600000,elapsedMs:3600000,paused:false,legacy:false,earnedGold:60,earnedXp:400};
    s.navCarry={gold:123,xp:456};const raw={version:6,savedAt:1000,state:s},before=JSON.stringify(raw),r=decodeRoster(raw),t=r.characters[0].state;
    return JSON.stringify(raw)===before&&t.gold===987&&t.xp===4321&&t.skills.navegacion.xp===2222&&t.spells.apocalipsis&&t.equip.weapon==="hacha"&&t.nav.remainingMs===3600000&&t.navCarry.gold===123&&r.activeId===r.characters[0].id;
  });
  assert("Compatibilidad de formatos v1 a v6",()=>[1,2,3,4,5,6].every(version=>!!decodeRoster({version,savedAt:1000,state:fixture()})));
  assert("Nombres repetidos, identificadores únicos",()=>!!decodeRoster(base()));
  assert("Máximo 5 y rechazo de IDs duplicados",()=>{const r=base();r.characters[1].id="a";if(decodeRoster(r))return false;r.characters=Array.from({length:6},(_,i)=>({id:String(i),state:fixture()}));r.activeId="0";return !decodeRoster(r);});
  assert("Estado independiente después de serializar",()=>{const r=decodeRoster(base());r.characters[0].state.gold+=500;r.characters[0].state.inventory.material_rata=3;return r.characters[1].state.gold===100&&!r.characters[1].state.inventory.material_rata;});
  assert("Cambiar congela combate, navegación y descanso pendiente",()=>{const s=fixture();s.combat.active=true;s.nav={id:"costa",remainingMs:1000,paused:false};s.restLeft=9;freezeCharacter(s);return !s.combat.active&&s.nav.paused&&s.restLeft===9;});
  assert("Selección no reactiva combate ni navegación",()=>{const r=base();r.activeId=null;r.characters[0].state.combat.active=true;const t=decodeRoster(r);return !t.characters[0].state.combat.active&&t.activeId===null;});
  assert("Guardar/cargar conserva todos los personajes",()=>{const r=base(),t=decodeRoster(copyJSON(r));return t.characters.length===2&&t.activeId==="a"&&t.characters[0].state.name===r.characters[0].state.name;});
  assert("Importación pausada no genera recompensas",()=>{const t=decodeRoster(base());t.characters.forEach(e=>freezeCharacter(e.state));t.activeId=null;return t.characters.every(e=>!e.state.combat.active&&!navActive(e.state)&&e.state.gold===100);});
  assert("Offline solo corresponde al personaje activo",()=>{const r=base();r.characters[0].state.combat.active=true;r.characters[1].state.combat.active=true;const t=decodeRoster(r);return t.characters[0].state.combat.active&&!t.characters[1].state.combat.active;});
  assert("Cierre desde selección: cero actividad offline",()=>{const r=base();r.activeId=null;const t=decodeRoster(r);return !t.activeId&&t.characters.every(e=>!e.state.combat.active&&!navActive(e.state));});
  assert("Offline navegación: tope 24 h, sin premio duplicado",()=>{const s=fixture();s.nav={id:"costa",remainingMs:86400000,totalMs:86400000,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0};advanceNav(s,Math.min(172800,CFG.OFFLINE_MAX_SEC)*1000);const saved=copyJSON(s);normalizeNav(saved);advanceNav(saved,86400000);return saved.gold===1540&&saved.skills.navegacion.xp===9600&&!navHas(saved);});
  assert("Viaje legado conserva su recompensa única",()=>{const s=fixture();s.nav={id:"costa",left:10};normalizeNav(s);advanceNav(s,10000,()=>0);const t=copyJSON(s);normalizeNav(t);advanceNav(t,10000,()=>0);return t.gold===103&&t.skills.navegacion.xp===30;});
  assert("Borrado de un ID no elimina al otro",()=>{const r=base();r.characters=r.characters.filter(e=>e.id!=="a");return r.characters.length===1&&r.characters[0].id==="b";});
  assert("Rechaza NaN y estados corruptos sin descartar otros silenciosamente",()=>{const r=base();r.characters[1].state.gold=NaN;return !decodeRoster(r);});
  const box=document.getElementById("rosterTestOutput");box.textContent=output.join("\n")+"\n\n"+output.filter(x=>x.startsWith("✓")).length+" / "+output.length+" aprobadas.\nPruebas puras, ejecutadas solo al pulsar este botón. No prueban almacenamiento real, eventos del navegador ni cierre de pestaña.";
}

/* ---------- ARRANQUE v7 ---------- */
async function bootRoster(){
  try{
    // All inline extensions must be parsed before restoring a character and rendering it.
    if(document.readyState==='loading')await new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true}));
    const saved=await loadSaved();
    roster=saved?saved.data:roster;
    storageReady=true;
    if(roster.activeId){
      state=roster.characters.find(c=>c.id===roster.activeId).state;ready=true;
      showGame();renderGame();
      const elapsed=Math.max(0,(Date.now()-roster.savedAt)/1000);
      await simulateOffline(elapsed);
      // Persiste el resultado antes de habilitar acciones de cambio de personaje.
      runtimeAt=Date.now();runtimeRemainder=0;
      if(!await saveRoster())throw Error("El progreso calculado no pudo guardarse. No cierres sin exportar una copia.");
      renderGame();
    }else{
      state=null;ready=false;showCharacters();
      if(saved&&saved.raw.version!==7&&!await saveRoster())throw Error("No se pudo completar la migración.");
      setStatus("Selección de personajes · nadie genera progreso offline",false);
    }
    setInterval(tick,1000);
    setInterval(()=>{if(storageReady&&!managing&&!busy)persist();},CFG.AUTOSAVE_MS);
    window.addEventListener("beforeunload",()=>{
      if(!storageReady||busy||managing)return;
      try{if(state&&ready)syncRuntime();if(!busy)localStorage.setItem(LS_KEY,JSON.stringify(makeRosterRecord()));}catch(_){}
    });
    document.addEventListener("visibilitychange",()=>{if(document.hidden&&storageReady&&!busy&&!managing)persist();});
  }catch(e){
    storageReady=false;ready=false;
    setStatus("No se habilitó la escritura: "+e.message,true);
    const panel=document.createElement("div");panel.className="panel";panel.textContent="Inicio detenido para proteger los guardados. "+e.message+" No borres los datos del navegador. Podés recargar para reintentar.";document.querySelector("main").prepend(panel);
  }
}
if(navigator.locks&&navigator.locks.request){
  navigator.locks.request("argentum-idle-v7-owner",{ifAvailable:true},async lock=>{
    if(!lock){setStatus("El juego está abierto en otra pestaña. Cerrala y recargá esta.",true);return;}
    await bootRoster();await new Promise(()=>{});
  }).catch(e=>setStatus("No se pudo obtener el bloqueo de guardado: "+e.message,true));
}else bootRoster();

/* E1.4: mejoras de interfaz y estadísticas; no modifica el motor ni el formato v7. */
const e13Sessions = new WeakMap();
function e13Session(s){let x=e13Sessions.get(s);if(!x){x={seconds:0,kills:0,xp:0,gold:0};e13Sessions.set(s,x);}return x;}
const e13OriginalStep=step;
step=function(){
 const s=state,live=!!(s&&ready&&!OFF.active&&!busy&&!managing&&s.combat.active&&!navActive(s)&&s.restLeft===0);
 if(live)e13Session(s).seconds++;
 return e13OriginalStep();
};
const e13OriginalKill=onKill;
onKill=function(en){
 const s=state,eligible=!!(s&&ready&&!OFF.active&&!busy&&!managing),xp=s?.xp||0,gold=s?.gold||0;
 const result=e13OriginalKill(en);
 if(eligible&&s===state){const a=e13Session(s);a.kills++;a.xp+=Math.max(0,s.xp-xp);a.gold+=Math.max(0,s.gold-gold);}
 return result;
};
function e13FmtSeconds(n){const m=Math.floor(n/60),h=Math.floor(m/60);return h?`${h} h ${m%60} min`:`${m} min`;}
function e13Refresh(){
 if(!state||!ready)return;
 const s=state,d=derive(s),en=enemyById(s.combat.enemyId),lo=xpFor(d.L),hi=xpFor(d.L+1),pct=clamp(100*(s.xp-lo)/(hi-lo),0,100);
 const set=(id,v)=>{const el=document.getElementById(id);if(el&&el.textContent!==String(v))el.textContent=v;};
 set('dockPlayerLevel','Nv '+d.L);set('dockPlayerGold','🪙 '+fmt(s.gold));set('dockPlayerXpText',pct.toFixed(1)+'% · faltan '+fmt(hi-s.xp)+' XP');
 const bar=document.getElementById('dockPlayerXpBar');if(bar)bar.style.width=pct+'%';
 set('dockEnemyRewards','+'+fmt(en.xp)+' XP · '+fmt(en.goldMin)+'–'+fmt(en.goldMax)+' oro');
 const x=e13Session(s),box=document.getElementById('e13SessionBox');
 if(box){const hours=x.seconds/3600,rate=hours>0&&x.kills>=2?x.xp/hours:0,grate=hours>0&&x.kills>=2?x.gold/hours:0;
 const vals={e13Time:e13FmtSeconds(x.seconds),e13Kills:fmt(x.kills),e13Xp:fmt(x.xp),e13Gold:fmt(x.gold),e13XpHour:rate?fmt(rate):'Calculando…',e13GoldHour:grate?fmt(grate):'Calculando…',e13Eta:rate?e13FmtSeconds(Math.ceil((hi-s.xp)/rate*3600)):'Calculando…'};
 for(const [k,v] of Object.entries(vals))set(k,v);
 }
 e13EconomyRefresh();
}
const e13PreviousLive=updateLive;
updateLive=function(){e13PreviousLive();e13Refresh();};
const e13PreviousRender=renderGame;
renderGame=function(){e13PreviousRender();e13InstallPanels();e13Refresh();};
function e13InstallPanels(){
 const main=document.querySelector('.hybridMain')||document.getElementById('pCombat');
 if(main&&!document.getElementById('e13SessionBox')){
 const panel=document.createElement('details');panel.id='e13SessionBox';panel.className='panel e13Session';
 panel.innerHTML='<summary>📈 Estadísticas de sesión (solo combate en vivo)</summary><div class="e13SessionGrid">'+[
 ['e13Time','Tiempo combatiendo'],['e13Kills','Enemigos derrotados'],['e13Xp','XP obtenida'],['e13Gold','Oro ganado'],['e13XpHour','XP/h'],['e13GoldHour','Oro/h'],['e13Eta','Tiempo al próximo nivel']
 ].map(([id,label])=>`<div><small>${label}</small><b id="${id}">—</b></div>`).join('')+'</div><p class="muted">Ritmo promedio de la sesión actual, desde 2 bajas. No incluye navegación, progreso offline ni gastos.</p><button class="small" data-e13-reset>Reiniciar estadísticas</button>';
 const combat=main.querySelector('#pCombat')||main;combat.prepend(panel);
 }
 const goal=document.getElementById('visibleProgressBox');
 if(goal&&!document.getElementById('e13Economy')){
 const d=document.createElement('details');d.className='e13Economy';d.id='e13Economy';d.innerHTML='<summary>🪙 Próximas compras recomendadas</summary><div id="e13EconomyList"></div>';
 goal.append(d);
 }
}
function e13EconomyRefresh(){
 const host=document.getElementById('e13EconomyList');if(!host||!state)return;
 const s=state,candidates=[];
 for(const it of EQUIP){if(s.owned[it.id]||s.equip[it.slot]===it.id)continue;
 const can=reqOk(s,it.req),equipped=s.equip[it.slot]&&itemById(s.equip[it.slot]);
 const old=equipped?((equipped.attack||0)+(equipped.defense||0)+(equipped.magicRes||0)+(equipped.mp||0)/5):0;
 const val=(it.attack||0)+(it.defense||0)+(it.magicRes||0)+(it.mp||0)/5;
 if(val<=old)continue;
 candidates.push({id:it.id,name:it.name,price:it.price,why:statsText(it),req:can?'Disponible':reqText(it.req),available:can});
 }
 for(const sp of SPELLS){if(sp.price<=0||s.spells[sp.id])continue;candidates.push({id:sp.id,name:sp.name,price:sp.price,why:sp.desc,req:skl(s,'magia')>=sp.req?'Disponible':'Magia nivel '+sp.req,available:skl(s,'magia')>=sp.req});}
 candidates.sort((a,b)=>(b.available-a.available)||Math.abs(a.price-s.gold)-Math.abs(b.price-s.gold));
 const picks=candidates.slice(0,4),sig=picks.map(x=>x.id).join('|');
 if(host.dataset.signature!==sig){host.dataset.signature=sig;host.innerHTML=picks.map(x=>`<article data-e13-item="${x.id}"><b>${esc(x.name)}</b><div class="muted">${esc(x.why)} · ${esc(x.req)}</div><div class="bar xp"><div></div></div><small></small></article>`).join('')||'<p>Ya tenés todas las mejoras disponibles.</p>';}
 for(const x of picks){const el=host.querySelector('[data-e13-item="'+x.id+'"]');if(!el)continue;
 el.querySelector('.bar > div').style.width=clamp(s.gold/x.price*100,0,100)+'%';
 el.querySelector('small').textContent=s.gold>=x.price?`Tenés ${fmt(s.gold)} de ${fmt(x.price)} oro. ${x.available?'Podés comprarlo en Tienda.':'Todavía falta cumplir el requisito.'}`:`Tenés ${fmt(s.gold)} de ${fmt(x.price)} oro; faltan ${fmt(x.price-s.gold)}. ${x.available?'Buscá oro derrotando enemigos o navegando.':'Además: '+x.req+'.'}`;
 }
}
document.addEventListener('click',e=>{
 const reset=e.target.closest('[data-e13-reset]');if(reset&&state){e13Sessions.set(state,{seconds:0,kills:0,xp:0,gold:0});e13Refresh();return;}
 const btn=e.target.closest('[data-e13-enemy-info]');if(!btn||!state)return;
 const en=enemyById(btn.dataset.e13EnemyInfo);if(!en)return;
 let dialog=document.getElementById('e13EnemyDialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='e13EnemyDialog';document.body.append(dialog);}
 const dg=dungeonById(en.dungeonId),un=enemyUnlocked(en,derive(state).L)&&dungeonOk(dg,state);
 dialog.innerHTML=`<h2>${esc(en.name)} · Nv ${en.level}</h2><p>${un?'✓ Desbloqueado':'🔒 Requiere nivel '+Math.max(dg.minLevel,en.level-3)+(dg.navReq?' y Navegación '+dg.navReq:'')}</p><p>HP ${fmt(en.hp)} · Ataque ${en.attack} · Defensa ${en.defense} · Res. mágica ${en.magicRes}</p><p>${en.magic?'Ataque mágico':'Ataque físico'} · ${en.boss?'Jefe':'Enemigo normal'}</p><p>Recompensa: ${fmt(en.xp)} XP y ${fmt(en.goldMin)}–${fmt(en.goldMax)} oro.</p><p>Dificultad orientativa: <b>${derive(state).L>=en.level+8?'Fácil':derive(state).L>=en.level-2?'Adecuado':derive(state).L>=en.level-7?'Difícil':'Muy difícil'}</b> (solo nivel, no garantiza supervivencia).</p><button data-e13-close>Cerrar</button>`;
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
});
document.addEventListener('click',e=>{if(e.target.closest('[data-e13-close]')){const d=document.getElementById('e13EnemyDialog');if(d?.close)d.close();else d?.removeAttribute('open');}});


/* ===== E1.4: pociones recargables y tienda (guardado opcional en ui, v7 intacto) ===== */
const E14_POTION_COOLDOWN_MS=60000; // E1.4.3: 60 segundos por carga
const E14_POTION_CAP=2;
const E14_UPGRADES=[
 {level:1,hp:10,mp:8,price:0},
 {level:2,hp:18,mp:14,price:180},
 {level:3,hp:30,mp:24,price:600},
 {level:4,hp:50,mp:40,price:1800}
];
function e14Potions(s){
 const ui=uiPreferences(s);
 if(!ui.potions || typeof ui.potions!=='object' || Array.isArray(ui.potions))
   ui.potions={level:1,hp:E14_POTION_CAP,mp:E14_POTION_CAP,hpAt:Date.now(),mpAt:Date.now()};
 const p=ui.potions;
 p.level=Number.isInteger(p.level)?clamp(p.level,1,4):1;
 const now=Date.now();
 for(const k of ['hp','mp']){
   if(!Number.isFinite(p[k]))p[k]=E14_POTION_CAP;
   p[k]=clamp(Math.floor(p[k]),0,E14_POTION_CAP);
   const t=k+'At';
   if(!Number.isFinite(p[t])||p[t]>now)p[t]=now;
   if(p[k]>=E14_POTION_CAP){p[t]=now;continue;}
   const gained=Math.floor((now-p[t])/E14_POTION_COOLDOWN_MS);
   if(gained>0){p[k]=Math.min(E14_POTION_CAP,p[k]+gained);p[t]+=gained*E14_POTION_COOLDOWN_MS;if(p[k]===E14_POTION_CAP)p[t]=now;}
 }
 return p;
}
function e14Drink(k){
 if(!state||busy||managing||simulationLocked())return;
 const s=state,p=e14Potions(s),d=derive(s),hp=k==='hp';
 if(!p[k])return toast('Sin cargas. Se recargan automáticamente cada 1 minuto.');
 if(hp?s.hp>=d.hpMax:s.mp>=d.mpMax)return toast(hp?'Ya tenés toda la vida.':'Ya tenés todo el maná.');
 const amount=E14_UPGRADES[p.level-1][k],before=hp?s.hp:s.mp;
 if(hp)s.hp=Math.min(d.hpMax,s.hp+amount);else s.mp=Math.min(d.mpMax,s.mp+amount);
 if(p[k]===E14_POTION_CAP)p[k+'At']=Date.now();
 p[k]--;
 addLog((hp?'Poción de vida':'Poción de maná')+': recuperás '+Math.ceil((hp?s.hp:s.mp)-before)+' '+(hp?'HP':'MP')+'.');
 persist();updateLive();
}
function e14BuyUpgrade(){
 if(!state||busy||managing||simulationLocked())return;
 const p=e14Potions(state),next=E14_UPGRADES[p.level];
 if(!next)return toast('Tus frascos ya están al máximo.');
 if(state.gold<next.price)return toast('Necesitás '+next.price+' oro.');
 state.gold-=next.price;p.level++;
 addLog('Mejorás los frascos al nivel '+p.level+'.');
 persist();renderGame();
}
function e14AddDock(){
 const inner=document.querySelector('#combatDock .dockInner');
 if(!inner||document.getElementById('e14Potions'))return;
 const div=document.createElement('div');div.id='e14Potions';div.className='dockPotions';
 div.innerHTML='<button type="button" data-e14-drink="hp" id="e14HpPotion">🧪 Vida</button><button type="button" data-e14-drink="mp" id="e14MpPotion">🔷 Maná</button><span class="potionHint" id="e14PotionHint">2 cargas por frasco · +1 cada 1 min</span>';
 inner.append(div);measureDock();
}
function e14Update(){
 if(!state)return;
 const p=e14Potions(state),up=E14_UPGRADES[p.level-1];
 for(const k of ['hp','mp']){
   const b=document.getElementById(k==='hp'?'e14HpPotion':'e14MpPotion');if(!b)continue;
   const seconds=p[k]>=E14_POTION_CAP?0:Math.max(1,Math.ceil((E14_POTION_COOLDOWN_MS-(Date.now()-p[k+'At']))/1000));
   b.textContent=(k==='hp'?'🧪 Vida':'🔷 Maná')+' +'+up[k]+' ('+p[k]+'/'+E14_POTION_CAP+')'+(seconds?' · '+seconds+'s':'');
   b.disabled=busy||managing||p[k]===0||(k==='hp'?state.hp>=derive(state).hpMax:state.mp>=derive(state).mpMax);
 }
 const hint=document.getElementById('e14PotionHint');if(hint)hint.textContent='E1.4.3 · Frascos Nv '+p.level+' · 1 carga cada 60 s · mejorables en Tienda';
 const shop=document.getElementById('e14PotionShop');
 if(shop){const next=E14_UPGRADES[p.level];const b=shop.querySelector('button');
   shop.querySelector('.potionInfo').textContent='Nv '+p.level+' · Vida +'+up.hp+' HP · Maná +'+up.mp+' MP · 2 cargas por frasco.';
   if(b){b.textContent=next?'Mejorar a Nv '+next.level+' · '+next.price+' oro':'Mejora máxima';b.disabled=!next||busy||managing||state.gold<next.price;}
 }
}
function e14AddShop(){
 const shop=document.getElementById('page_shop');
 if(!shop||document.getElementById('e14PotionShop'))return;
 const panel=document.createElement('div');panel.id='e14PotionShop';panel.className='potionShop';
 panel.innerHTML='<b>🧪 Mejoras de frascos</b><p class="potionInfo muted"></p><p class="muted">Las pociones son permanentes, no consumen oro al usarlas y recuperan 1 carga cada 1 minuto.</p><button type="button" data-e14-upgrade>Mejorar frascos</button>';
 shop.append(panel);
}
const e14RenderDock=renderDock;
renderDock=function(){e14RenderDock();e14AddDock();e14Update();};
const e14RenderGame=renderGame;
renderGame=function(){e14RenderGame();e14AddDock();e14AddShop();e14Update();};
const e14UpdateLive=updateLive;
updateLive=function(){e14UpdateLive();e14Update();};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-e14-drink],[data-e14-upgrade]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(b.hasAttribute('data-e14-upgrade'))e14BuyUpgrade();else e14Drink(b.dataset.e14Drink);
},true);

