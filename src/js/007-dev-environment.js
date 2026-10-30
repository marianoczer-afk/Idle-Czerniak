
"use strict";
/* Almacenamiento DEV separado. */
const DEV_KIND="argentum-dev";
const MODE_STORAGE={normal:{db:"argentum-idle",key:"argentum-idle-save-v1"},dev:{db:"argentum-idle-dev",key:"argentum-idle-dev-save-v1"}};
let modeTransition=false;
let normalContext=null;
let devContext=null;
const normalDecodeRoster=decodeRoster;
const normalNewState=newState;
const normalMakeRosterRecord=makeRosterRecord;
const normalRenderGame=renderGame;
const normalShowCharacters=showCharacters;
const normalEnemySwing=enemySwing;
const normalImportJSON=importJSON;
const normalChangeRoster=changeRoster;
const normalRunRosterTests=runRosterTests;
function taggedDev(raw){
  return !!(raw && (raw.kind===DEV_KIND || raw.environment==="dev" || raw.state?.devEnvironment===true || (Array.isArray(raw.characters)&&raw.characters.some(e=>e?.state?.devEnvironment===true))));
}
function decodeForMode(raw,mode){
  if(mode==="normal"){
    if(taggedDev(raw))return null;
    return normalDecodeRoster(raw);
  }
  // DEV no acepta archivos normales, ni siquiera como fuente de migración.
  if(!raw || raw.kind!==DEV_KIND || raw.version!==7 || !Array.isArray(raw.characters) || raw.characters.some(e=>e?.state?.devEnvironment!==true))return null;
  return normalDecodeRoster(raw);
}
decodeRoster=function(raw){return decodeForMode(raw,gameMode);};
newState=function(){
  const s=normalNewState();
  if(gameMode==="dev"){s.devEnvironment=true;s.dev={invulnerable:false};}
  return s;
};
makeRosterRecord=function(){
  const rec=normalMakeRosterRecord();
  if(gameMode==="dev")rec.kind=DEV_KIND;
  return rec;
};
enemySwing=function(d,en){
  const protect=gameMode==="dev"&&state?.devEnvironment===true&&state.dev?.invulnerable===true;
  const hp=state.hp;
  normalEnemySwing(d,en);
  if(protect)state.hp=hp;
};
function clampDevResources(s){
  const d=derive(s);
  s.hp=clamp(s.hp,0,d.hpMax);s.mp=clamp(s.mp,0,d.mpMax);
}
function requiredSkillXp(level){return 10*Math.pow(level-1,2);}
function devSetLevel(s,level){s.xp=xpFor(level);clampDevResources(s);}
function devSetSkill(s,key,level){
  if(key==="weapon")s.skill.xp=xpFor(level);
  else if(SKILLS.some(k=>k.key===key))s.skills[key].xp=requiredSkillXp(level);
  else throw Error("Habilidad inexistente.");
  clampDevResources(s);
}
function prepareDevDungeon(s,id){
  const dg=dungeonById(id);if(!dg)throw Error("Dungeon inexistente.");
  s.xp=Math.max(s.xp,xpFor(dg.minLevel));
  if(dg.navReq)s.skills.navegacion.xp=Math.max(s.skills.navegacion.xp,requiredSkillXp(dg.navReq));
  clampDevResources(s);
}
function stopContextActivities(s){if(s){if(s===state)e210StopFishing();freezeCharacter(s);}}
function devFixture(){
  const previous=draft;
  try{draft={name:"Prueba aislada",race:"humano",cls:"guerrero"};return normalNewState();}
  finally{draft=previous;}
}
function refreshModeChrome(){
  document.body.classList.toggle("devEnvironment",gameMode==="dev");
  let toggle=document.getElementById("devModeToggle");
  if(!toggle){toggle=document.createElement("button");toggle.id="devModeToggle";toggle.type="button";toggle.dataset.devAction="switchMode";document.querySelector("header").append(toggle);}
  toggle.textContent=gameMode==="dev"?"Salir de DEV → personajes normales":"Entrar al entorno DEV";
  toggle.disabled=modeTransition;
  let banner=document.getElementById("devModeBanner");
  if(gameMode==="dev"){
    if(!banner){banner=document.createElement("div");banner.id="devModeBanner";document.querySelector("header").after(banner);}
    banner.textContent="🛠 ENTORNO DEV · Personajes de prueba · Sin acceso a recursos normales"+(state?.dev?.invulnerable?" · INVULNERABILIDAD ACTIVA":"");
  }else banner?.remove();
}
function appendDevPanel(){
  document.getElementById("devAdminPanel")?.remove();
  document.getElementById("devIsolationTests")?.remove();
  refreshModeChrome();
  if(gameMode!=="dev")return;
  const tests=document.createElement("details");tests.id="devIsolationTests";tests.className="panel";
  tests.innerHTML='<summary>Pruebas aisladas DEV</summary><button data-dev-action="tests">Ejecutar pruebas DEV</button><pre id="devTestOutput">No ejecutadas. No escriben almacenamiento ni modifican personajes.</pre>';
  const selection=document.getElementById("characterScreen");
  const host=state&&ready?document.getElementById("gameScreen"):selection.querySelector(".panel");
  if(state&&ready&&state.devEnvironment===true){
    const s=state,d=derive(s);
    const panel=document.createElement("details");panel.id="devAdminPanel";panel.className="panel";panel.open=true;
    panel.innerHTML=`<summary>🛠 Preparación DEV · ${esc(s.name)}</summary>
      <p class="muted">Herramienta local, no un sistema seguro de permisos online. Cada modificación pausa las actividades. No altera personajes normales.</p>
      <div class="devFields"><label>Nivel del personaje<select id="devLevelPreset">${[1,10,20,35,50,100].map(n=>`<option value="${n}" ${n===d.L?"selected":""}>${n}</option>`).join("")}<option value="custom" ${![1,10,20,35,50,100].includes(d.L)?"selected":""}>Personalizado</option></select></label><label>Personalizado (1–1000)<input id="devCustomLevel" type="number" min="1" max="1000" step="1" value="${Math.min(1000,d.L)}"></label><button data-dev-action="level">Establecer nivel</button></div>
      <div class="devFields"><label>Cantidad de oro<input id="devGold" type="number" min="0" max="1000000000000" step="1" value="10000"></label><button data-dev-action="goldSet">Establecer oro</button><button data-dev-action="goldAdd">Agregar oro</button></div>
      <div class="devFields"><label>Habilidad<select id="devSkill"><option value="weapon">Combate con Armas</option>${SKILLS.map(k=>`<option value="${k.key}">${esc(k.name)}</option>`).join("")}</select></label><label>Nivel (1–1000)<input id="devSkillLevel" type="number" min="1" max="1000" step="1" value="25"></label><button data-dev-action="skill">Establecer habilidad</button></div>
      <div class="actions"><button data-dev-action="restore">Recuperar HP y MP</button><button data-dev-action="spells">Aprender todos los hechizos</button><button data-dev-action="equipment">Obtener equipo de tienda</button></div>
      <p class="muted">El equipo se agrega sin equiparlo; los requisitos y bonificaciones reales se mantienen. Preparar un dungeon sube únicamente los requisitos que falten.</p>
      <div class="devFields"><label>Dungeon<select id="devDungeon">${DUNGEONS.map(dg=>`<option value="${dg.id}">${esc(dg.name)}</option>`).join("")}</select></label><button data-dev-action="dungeon">Preparar requisitos y entrar</button></div>
      <div class="actions"><button data-dev-action="invulnerable" aria-pressed="${!!s.dev?.invulnerable}">Invulnerabilidad: ${s.dev?.invulnerable?"ACTIVA":"desactivada"}</button><button class="danger" data-dev-action="reset">Reiniciar personaje DEV</button><button class="danger" data-act="reset">Eliminar personaje DEV</button><button data-act="export">Exportar JSON DEV</button></div>
      <p class="muted">Las asignaciones de nivel usan XP acumulada real. Al cambiar máximos se limita HP/MP sin curar gratis; usá Recuperar para llenarlos.</p>`;
    host.prepend(panel);
  }
  host.append(tests);
  if(!state){
    const title=selection.querySelector("h2");
    if(title?.firstChild)title.firstChild.textContent="Personajes DEV · ";
    const p=selection.querySelector("p.muted");if(p)p.textContent="Espacios de prueba separados de los cinco personajes normales. Solo el DEV activo progresa. Salir de DEV pausa todas sus actividades.";
  }
}
renderGame=function(){normalRenderGame();appendDevPanel();};
showCharacters=function(){normalShowCharacters();appendDevPanel();};
importJSON=async function(file){
  if(modeTransition||busy||managing)return;
  try{
    const raw=JSON.parse(await file.text());
    if(!decodeForMode(raw,gameMode))throw Error(gameMode==="dev"?"DEV solo admite respaldos argentum-dev válidos. No se aceptan personajes normales.":"El modo normal no admite partidas DEV ni formatos inválidos.");
    await normalImportJSON(file);
    refreshModeChrome();
  }catch(e){toast(e.message||"No se pudo validar el archivo.");}
};
changeRoster=async function(action,id){
  if(modeTransition)return;
  await normalChangeRoster(action,id);
  refreshModeChrome();
};
async function loadDevRecord(){
  const records=[];let corrupt=false;
  try{const r=await idbGet();if(r)records.push(r);}catch(e){/* localStorage puede conservar una copia válida */}
  try{const text=localStorage.getItem(MODE_STORAGE.dev.key);if(text)records.push(JSON.parse(text));}catch(e){corrupt=true;}
  records.sort((a,b)=>(Number(b.savedAt)||0)-(Number(a.savedAt)||0)||(Number(b.revision)||0)-(Number(a.revision)||0));
  for(const raw of records){const decoded=decodeForMode(raw,"dev");if(decoded)return decoded;}
  if(records.length||corrupt)throw Error("Guardado DEV corrupto: no se sobrescribió ni se utilizó un guardado normal. Recuperá un respaldo DEV antes de reintentar.");
  return {version:7,kind:DEV_KIND,revision:0,savedAt:0,activeId:null,characters:[]};
}
async function switchEnvironment(){
  if(modeTransition||busy||managing||!storageReady)return;
  if(!confirm(gameMode==="normal"?"Entrar a DEV pausará tu personaje normal y lo guardará. No generará recompensas mientras estés en DEV. ¿Continuar?":"Salir de DEV pausará sus personajes y volverá a la selección normal. ¿Continuar?"))return;
  // Termina primero el tiempo real del contexto de origen.
  if(state&&ready)syncRuntime();
  if(busy)return toast("Esperá a que termine el cálculo offline y volvé a cambiar de modo.");
  modeTransition=true;managing=true;
  const originMode=gameMode;
  const originalDb=dbP;
  let originSnapshot=null;
  try{
    if(state)stopContextActivities(state);
    roster.characters.forEach(e=>stopContextActivities(e.state));
    roster.activeId=null;state=null;ready=false;runtimeAt=0;runtimeRemainder=0;
    if(!await saveRoster())throw Error("No se pudo guardar el contexto de origen; no se cambió de modo.");
    await writeQueue;
    originSnapshot=copyJSON(roster);
    const context={roster:originSnapshot,db:dbP};
    if(originMode==="normal")normalContext=context;else devContext=context;
    gameMode=originMode==="normal"?"dev":"normal";
    LS_KEY=MODE_STORAGE[gameMode].key;
    dbP=(gameMode==="normal"?normalContext:devContext)?.db||null;
    if(gameMode==="dev"){
      roster=await loadDevRecord();
      // Entrar nunca simula tiempo desde el último uso del laboratorio.
      roster.characters.forEach(e=>stopContextActivities(e.state));roster.activeId=null;
    }else{
      if(!normalContext)throw Error("No hay contexto normal válido; no se creó un reemplazo.");
      roster=copyJSON(normalContext.roster);
    }
    state=null;ready=false;runtimeAt=0;runtimeRemainder=0;
    if(!await saveRoster())throw Error("No se pudo guardar el contexto de destino.");
    showCharacters();refreshModeChrome();
    toast(gameMode==="dev"?"Entorno DEV abierto. Elegí o creá un personaje de prueba.":"Personajes normales conservados. Todas las actividades permanecen pausadas.");
  }catch(e){
    // Un error DEV nunca se resuelve copiando datos normales a la base DEV.
    gameMode=originMode;LS_KEY=MODE_STORAGE[originMode].key;
    const context=originMode==="normal"?normalContext:devContext;
    if(originSnapshot){roster=copyJSON(originSnapshot);dbP=context?.db||originalDb;}
    else {dbP=originalDb;roster.characters.forEach(e=>stopContextActivities(e.state));roster.activeId=null;}
    state=null;ready=false;runtimeAt=0;runtimeRemainder=0;
    showCharacters();refreshModeChrome();toast(e.message||"No se pudo cambiar de entorno.");
  }finally{managing=false;modeTransition=false;refreshModeChrome();}
}
function readDevInteger(id,min,max){
  const value=Number(document.getElementById(id)?.value);
  if(!Number.isSafeInteger(value)||value<min||value>max)throw Error(`Ingresá un entero entre ${min} y ${max}.`);
  return value;
}
async function devAdminAction(action){
  if(gameMode!=="dev"||!state?.devEnvironment||!ready||modeTransition||busy||managing||!storageReady)return;
  syncRuntime();if(busy)return;
  const snapshot=copyJSON(state);const activeId=roster.activeId;
  managing=true;
  try{
    stopContextActivities(state);runtimeAt=Date.now();runtimeRemainder=0;
    const s=state;
    if(action==="level"){
      const preset=document.getElementById("devLevelPreset").value;
      const n=preset==="custom"?readDevInteger("devCustomLevel",1,1000):Number(preset);
      if(!Number.isSafeInteger(n)||n<1||n>1000)throw Error("Nivel inválido.");
      devSetLevel(s,n);
    }else if(action==="goldSet"||action==="goldAdd"){
      const amount=readDevInteger("devGold",0,1000000000000);
      const result=action==="goldSet"?amount:s.gold+amount;
      if(!Number.isSafeInteger(result))throw Error("Cantidad fuera del rango seguro.");s.gold=result;
    }else if(action==="skill")devSetSkill(s,document.getElementById("devSkill").value,readDevInteger("devSkillLevel",1,1000));
    else if(action==="restore"){const d=derive(s);s.hp=d.hpMax;s.mp=d.mpMax;}
    else if(action==="spells")SPELLS.forEach(sp=>s.spells[sp.id]=true);
    else if(action==="equipment")EQUIP.forEach(it=>s.owned[it.id]=true);
    else if(action==="dungeon"){
      const id=document.getElementById("devDungeon").value;prepareDevDungeon(s,id);selectDungeon(id);
    }else if(action==="invulnerable"){
      s.dev=s.dev||{};s.dev.invulnerable=!s.dev.invulnerable;
    }else if(action==="reset"){
      if(!confirm(`¿Reiniciar a «${s.name}» en DEV? Perderá todo su progreso de prueba. Los normales no cambian.`))return;
      const previous=draft;
      try{draft={name:s.name,race:s.race,cls:s.cls};state=newState();roster.characters.find(e=>e.id===activeId).state=state;}
      finally{draft=previous;}
    }else return;
    addLog("DEV: preparación aplicada; actividades pausadas.");
    if(!await saveRoster())throw Error("No se pudo guardar la preparación DEV.");
  }catch(e){
    state=snapshot;roster.characters.find(e=>e.id===activeId).state=state;
    runtimeAt=Date.now();toast(e.message||"Error de preparación DEV.");
  }finally{managing=false;renderGame();refreshModeChrome();}
}
function runDevTests(){
  const lines=[];
  const test=(name,fn)=>{try{if(!fn())throw Error("resultado inesperado");lines.push("✓ "+name);}catch(e){lines.push("✗ "+name+": "+e.message);}};
  const fixtureRoster=()=>({version:7,revision:1,savedAt:1000,activeId:"test-a",characters:[{id:"test-a",state:devFixture()}]});
  const devRoster=()=>{const r=fixtureRoster();r.kind=DEV_KIND;r.characters[0].state.devEnvironment=true;return r;};
  test("Bases y claves normal/DEV distintas",()=>MODE_STORAGE.normal.db!==MODE_STORAGE.dev.db&&MODE_STORAGE.normal.key!==MODE_STORAGE.dev.key);
  test("JSON normal rechazado por DEV",()=>!decodeForMode(fixtureRoster(),"dev"));
  test("JSON DEV rechazado por normal",()=>!decodeForMode(devRoster(),"normal"));
  test("Quitar envoltorio DEV no oculta la marca de personaje",()=>{const r=devRoster();delete r.kind;return !decodeForMode(r,"normal");});
  test("Envoltorio DEV sin marca de personaje rechazado",()=>{const r=fixtureRoster();r.kind=DEV_KIND;return !decodeForMode(r,"dev");});
  test("DEV corrupto no es aceptado ni reemplazado por normal",()=>{const r=devRoster();r.characters[0].state.gold=-1;return !decodeForMode(r,"dev")&&!decodeForMode(fixtureRoster(),"dev");});
  test("XP y nivel reales: 1, 10, 20, 35, 50, 100, 173",()=>[1,10,20,35,50,100,173].every(n=>{const s=devFixture();devSetLevel(s,n);return s.xp===xpFor(n)&&derive(s).L===n;}));
  test("XP de habilidades reales",()=>SKILLS.every(k=>{const s=devFixture();devSetSkill(s,k.key,25);return s.skills[k.key].xp===5760&&skl(s,k.key)===25;}));
  test("Combate con Armas usa su propia curva",()=>{const s=devFixture();devSetSkill(s,"weapon",50);return s.skill.xp===xpFor(50)&&derive(s).sk===50;});
  test("Bajar nivel limita HP/MP al máximo derivado",()=>{const s=devFixture();s.xp=xpFor(100);s.hp=99999;s.mp=99999;devSetLevel(s,1);const d=derive(s);return s.hp===d.hpMax&&s.mp===d.mpMax;});
  test("Preparación Pirata respeta personaje 35 y Navegación 25",()=>{const s=devFixture();prepareDevDungeon(s,"dungeon_pirata");return derive(s).L===35&&skl(s,"navegacion")===25&&dungeonOk(dungeonById("dungeon_pirata"),s);});
  test("Snapshot normal no comparte referencias con DEV",()=>{const a=fixtureRoster(),before=JSON.stringify(a),b=copyJSON(a);b.characters[0].state.gold+=999;return JSON.stringify(a)===before;});
  test("Cambio de entorno detiene combate",()=>{const s=devFixture();s.combat.active=true;stopContextActivities(s);return !s.combat.active&&s.savedAt===0;});
  test("Cambio de entorno pausa navegación sin premios",()=>{const s=devFixture();s.nav={id:"costa",remainingMs:3600000,totalMs:3600000,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0};const gold=s.gold,xp=s.skills.navegacion.xp;stopContextActivities(s);advanceNav(s,86400000);return s.nav.paused&&s.nav.remainingMs===3600000&&s.gold===gold&&s.skills.navegacion.xp===xp;});
  test("Serialización DEV conserva personajes y privilegio solo en DEV",()=>{const r=devRoster();r.characters[0].state.dev={invulnerable:true};const t=decodeForMode(copyJSON(r),"dev");return t.characters.length===1&&t.characters[0].state.dev.invulnerable&&!decodeForMode(r,"normal");});
  test("Volver a selección no reactiva actividad",()=>{const r=devRoster();r.characters.forEach(e=>stopContextActivities(e.state));r.activeId=null;const t=decodeForMode(r,"dev");return t.activeId===null&&!t.characters[0].state.combat.active;});
  const out=document.getElementById("devTestOutput");
  if(out)out.textContent=lines.join("\n")+"\n\n"+lines.filter(x=>x.startsWith("✓")).length+" / "+lines.length+" aprobadas.\nEstas pruebas puras solo se ejecutan al pulsar el botón. No prueban escrituras reales de IndexedDB, recargas, archivos, eventos ni múltiples pestañas.";
}
runRosterTests=function(){
  const previous=decodeRoster;
  try{decodeRoster=normalDecodeRoster;normalRunRosterTests();}
  finally{decodeRoster=previous;}
};
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-dev-action]");if(!b)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(b.disabled||busy||managing||modeTransition||!storageReady)return;
  const action=b.dataset.devAction;
  if(action==="switchMode")return switchEnvironment();
  if(gameMode!=="dev")return;
  if(action==="tests")return runDevTests();
  return devAdminAction(action);
},true);
refreshModeChrome();
