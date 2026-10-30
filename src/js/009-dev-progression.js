
"use strict";
/* DEV: checkpoints de estado, RNG y contadores; un step por segundo. */
const XP_OPTIONS=[1,2,5,10,50,100,365,1000];
const SIM_DURATIONS=[[3600,"1 hora"],[28800,"8 horas"],[86400,"24 horas"],[604800,"7 días"],[2592000,"30 días"],[31536000,"365 días"]];
let simTimer=null,simEpoch=0,simLastWall=0,simUIAt=0,simCheckpointAt=0,simSaving=false;
let simulationExecuting=false;
let simTestContext=false;
const knownSimulations=new WeakSet();
const baseActivityFactor=xpActivityFactor;
const baseSyncRuntime=syncRuntime;
const baseTick=tick;
const basePersist=persist;
const baseRecord=makeRosterRecord;
const baseAppendDev=appendDevPanel;
const baseDevAdmin=devAdminAction;
const baseSwitchEnvironment=switchEnvironment;
const baseChangeRoster=changeRoster;
const baseImportProgression=importJSON;
const baseExportProgression=exportJSON;
const baseSimDeath=onDeath;
const baseSaveProgression=saveRoster;
function devProgress(s=state){
  if(!s.dev)s.dev={invulnerable:false};
  if(!s.dev.progress)s.dev.progress={xpMultiplier:1,xpScope:"both",history:[],simulation:null};
  const p=s.dev.progress;
  if(!XP_OPTIONS.includes(p.xpMultiplier))p.xpMultiplier=1;
  if(!["both","character","skills"].includes(p.xpScope))p.xpScope="both";
  if(!Array.isArray(p.history))p.history=[];
  return p;
}
function currentSimulation(){return gameMode==="dev"&&state?.devEnvironment?state.dev?.progress?.simulation:null;}
function simulationLocked(){const r=currentSimulation();return !!r&&["running","paused","recovered"].includes(r.status);}
function multiplierFor(s,kind){
  if(gameMode!=="dev"||!s?.devEnvironment)return 1;
  const p=devProgress(s),r=p.simulation;
  if(simulationExecuting||(r&&["running","paused","recovered"].includes(r.status)))return 1;
  return p.xpScope==="both"||p.xpScope===kind?p.xpMultiplier:1;
}
xpActivityFactor=function(s,kind){return multiplierFor(s,kind);};
function seedHash(text){let h=2166136261;for(const c of String(text)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function seededNext(r){r.rngState=(r.rngState+0x6D2B79F5)>>>0;let t=r.rngState;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
function sumKills(s){return Object.values(s.defeated).reduce((a,b)=>a+b,0);}
function skillSnapshot(s){return {weapon:s.skill.xp,...Object.fromEntries(SKILLS.map(k=>[k.key,s.skills[k.key].xp]))};}
function valuesSnapshot(s){return {level:levelFromXp(s.xp),xp:s.xp,gold:s.gold,kills:sumKills(s),skills:skillSnapshot(s)};}
function activityReason(s){if(s.combat.active)return "Combate activo";if(navActive(s))return "Navegando";if(s.restLeft>0)return "Descanso manual en curso";return "Personaje detenido";}
function frameFlags(s){return {combatActive:!!s.combat.active,navPaused:!!s.nav?.paused};}
function restoreFrame(s,r){
  if(!r.frame)return;
  s.combat.active=!!r.frame.combatActive;
  if(navHas(s))s.nav.paused=!!r.frame.navPaused;
  // Nunca se permiten navegación y combate simultáneos.
  if(navActive(s))s.combat.active=false;
}
function validSimulation(r){return !!r&&typeof r==="object"&&["running","paused","recovered","finished","stopped"].includes(r.status)&&Number.isSafeInteger(r.processed)&&Number.isSafeInteger(r.target)&&r.target>0&&r.processed>=0&&r.processed<=r.target&&Number.isInteger(r.rngState)&&r.initial&&r.initial.skills&&Number.isFinite(r.realMs)&&Number.isFinite(r.combatSec)&&Number.isFinite(r.deaths)&&[10,100,365].includes(r.speed);}
function updateSimFinal(r){r.final=valuesSnapshot(state);if(r.status==="running"||!r.frame)r.frame=frameFlags(state);}
function addHistory(r){
  const p=devProgress();const record=copyJSON(r);record.final=valuesSnapshot(state);
  const i=p.history.findIndex(x=>x.id===record.id);
  if(i>=0)p.history[i]=record;else p.history.unshift(record);
  // Solo informes, nunca personajes ni objetos. Se pueden exportar en JSON.
  if(p.history.length>50)p.history.length=50;
}
function durationText(sec){sec=Math.max(0,Math.floor(sec));const days=Math.floor(sec/86400);sec%=86400;const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);return (days?days+" d ":"")+h+" h "+m+" min "+sec%60+" s";}
function progressionStep(s,r){
  const combat=s.combat.active&&!navActive(s)&&s.restLeft===0;
  simulationExecuting=true;
  try{step();}finally{simulationExecuting=false;}
  r.processed++;
  if(combat)r.combatSec++;
  if(combat&&!s.combat.active&&r.lastDeathAt!==r.processed-1)r.reason="Combate detenido";
}
onDeath=function(en){
  const r=currentSimulation();
  if(simulationExecuting&&r){r.deaths++;r.lastDeathAt=r.processed;r.reason="Derrota frente a "+en.name+"; sin reinicio automático";}
  baseSimDeath(en);
};
function withSimulationRng(r,fn){const previous=rng;rng=()=>seededNext(r);try{return fn();}finally{rng=previous;}}
function simulationBatch(r,count){
  const oldOff=OFF.active;OFF.active=true;
  try{withSimulationRng(r,()=>{for(let i=0;i<count;i++)progressionStep(state,r);});}
  finally{OFF.active=oldOff;}
}
syncRuntime=function(){if(simulationLocked()){runtimeAt=Date.now();runtimeRemainder=0;return;}return baseSyncRuntime();};
tick=function(){if(simulationLocked()){runtimeAt=Date.now();return;}return baseTick();};
makeRosterRecord=function(){
  const r=currentSimulation();
  if(r&&simulationLocked())updateSimFinal(r);
  return baseRecord();
};
saveRoster=function(){
  const r=currentSimulation();if(r&&simulationLocked())updateSimFinal(r);
  return baseSaveProgression();
};
persist=function(){if(fishingFinishDepth)return Promise.resolve(true);if(simulationLocked()){runtimeAt=Date.now();return saveRoster();}return basePersist();};
async function simulationCheckpoint(){
  if(simSaving)return false;
  simSaving=true;
  try{
    const ok=await saveRoster();
    const r=currentSimulation();
    if(!ok&&r&&r.status==="running"){r.status="paused";r.reason="Pausa: fallo de guardado; exportá DEV antes de cerrar";simEpoch++;clearTimeout(simTimer);}
    return ok;
  }finally{simSaving=false;simLastWall=performance.now();}
}
function beginPump(){clearTimeout(simTimer);const token=++simEpoch;simLastWall=performance.now();simCheckpointAt=simLastWall;simUIAt=0;simTimer=setTimeout(()=>pumpSimulation(token),0);}
async function pumpSimulation(token){
  const r=currentSimulation();
  if(token!==simEpoch||!r||r.status!=="running"||gameMode!=="dev")return;
  if(simSaving){simTimer=setTimeout(()=>pumpSimulation(token),20);return;}
  const now=performance.now(),elapsed=Math.max(0,now-simLastWall);simLastWall=now;
  // Tiempo real incluye cálculo y espera, no tiempo pausado ni cierre de pestaña.
  r.realMs+=elapsed;
  r.credit=(Number(r.credit)||0)+elapsed/1000*r.speed;
  if(r.maximum)r.credit=0;
  const budget=r.maximum?r.target-r.processed:Math.min(Math.floor(r.credit),r.target-r.processed);
  const start=performance.now();let count=0;
  try{
    const oldOff=OFF.active;OFF.active=true;
    try{withSimulationRng(r,()=>{
      while(count<budget&&count<1000&&performance.now()-start<8){progressionStep(state,r);count++;}
    });}finally{OFF.active=oldOff;}
    if(!r.maximum)r.credit=Math.max(0,r.credit-count);
    updateSimFinal(r);
    if(r.processed>=r.target){await finishSimulation("finished","Duración objetivo completada");return;}
    if(now-simUIAt>=200){simUIAt=now;updateLive();updateInv();updateSimulationUI();}
    if(now-simCheckpointAt>=5000){simCheckpointAt=now;await simulationCheckpoint();}
  }catch(e){r.status="paused";r.reason="Error del motor: "+e.message;simEpoch++;await simulationCheckpoint();updateSimulationUI();return;}
  if(token===simEpoch&&r.status==="running")simTimer=setTimeout(()=>pumpSimulation(token),r.maximum?0:10);
}
async function finishSimulation(status,reason){
  const r=currentSimulation();if(!r)return;
  simEpoch++;clearTimeout(simTimer);r.status=status;r.endReason=reason;
  updateSimFinal(r);addHistory(r);
  freezeCharacter(state);runtimeAt=Date.now();runtimeRemainder=0;
  await simulationCheckpoint();renderGame();
}
async function pauseSimulation(reason="Pausa solicitada"){
  const r=currentSimulation();if(!r||!simulationLocked())return;
  if(r.status==="running"){r.realMs+=Math.max(0,performance.now()-simLastWall);r.frame=frameFlags(state);}
  simEpoch++;clearTimeout(simTimer);r.status="paused";r.pauseReason=reason;
  r.credit=0;runtimeAt=Date.now();await simulationCheckpoint();updateSimulationUI();
}
async function startSimulation(){
  if(gameMode!=="dev"||!state?.devEnvironment||simulationLocked()||busy||managing||simSaving)return;
  syncRuntime();if(busy)return;
  const speed=Number(document.getElementById("simSpeed").value),choice=document.getElementById("simDuration").value;
  const custom=Number(document.getElementById("simCustom").value);
  const target=choice==="custom"?Math.round(custom*3600):Number(choice);
  if(![10,100,365].includes(speed)||!Number.isSafeInteger(target)||target<1||target>315360000)return toast("Duración inválida: entre 1 segundo y 3650 días.");
  const seed=document.getElementById("simSeed").value||"argentum-1",p=devProgress();
  const r={id:newCharacterId(),status:"paused",name:state.name,cls:state.cls,race:state.race,seed,rngState:seedHash(seed),target,processed:0,combatSec:0,realMs:0,deaths:0,speed,maximum:document.getElementById("simMaximum").checked,initial:valuesSnapshot(state),frame:frameFlags(state),reason:activityReason(state),lastDeathAt:-1,credit:0,invulnerableAtStart:!!state.dev.invulnerable,createdAt:Date.now()};
    p.simulation=r;knownSimulations.add(r);runtimeAt=Date.now();runtimeRemainder=0;updateSimFinal(r);
  if(!await simulationCheckpoint())return toast("No se inició: no pudo guardarse el punto inicial DEV.");
  r.status="running";renderGame();beginPump();
}
async function resumeSimulation(){
  const r=currentSimulation();if(!r||!["paused","recovered"].includes(r.status)||simSaving)return;
  restoreFrame(state,r);r.credit=0;r.status="paused";
  if(!await simulationCheckpoint())return;
  r.status="running";r.pauseReason=null;runtimeAt=Date.now();runtimeRemainder=0;renderGame();beginPump();
}
function recoverSimulation(){
  if(gameMode!=="dev"||!state?.devEnvironment)return;
  const p=devProgress(),r=p.simulation;if(!r)return;
  if(!validSimulation(r)){p.simulation=null;freezeCharacter(state);toast("Checkpoint de simulación inválido: no se continuó la prueba.");return;}
  if(!knownSimulations.has(r)){
    if(r.status==="running"){r.status="recovered";r.credit=0;r.pauseReason="Recuperada desde el checkpoint; reanudación manual";}
    knownSimulations.add(r);
  }
}
function skillChanges(r,final){
  if(!r?.initial?.skills||!final?.skills)return "—";
  return Object.keys(r.initial.skills).map(k=>{
    const a=r.initial.skills[k],b=final.skills[k]??a,weapon=k==="weapon";
    const name=weapon?"Combate con Armas":SKILLS.find(x=>x.key===k)?.name||k;
    const level=weapon?levelFromXp:skillLvl;
    return `${name}: ${level(a)} → ${level(b)} (+${fmt(b-a)} XP)`;
  }).join(" · ");
}
function simulationSummary(r){
  const f=r.final||r.initial,sec=r.processed||0,rate=n=>sec?fmt(n*3600/sec):"0";
  return `<b>${esc(r.name||"Prueba")} · ${esc(classById(r.cls)?.name||r.cls||"")}</b><br>Estado: ${esc(r.status)} · Semilla: ${esc(r.seed)}${r.invulnerableAtStart?" · Invulnerabilidad DEV":""}<br>Tiempo total: ${durationText(sec)} / ${durationText(r.target)} · Combate: ${durationText(r.combatSec)}<br>Nivel ${r.initial.level} → ${f.level} · XP ${fmt(r.initial.xp)} → ${fmt(f.xp)} (+${fmt(f.xp-r.initial.xp)}) · Oro ${fmt(r.initial.gold)} → ${fmt(f.gold)} (+${fmt(f.gold-r.initial.gold)})<br>${rate(f.xp-r.initial.xp)} XP/h · ${rate(f.gold-r.initial.gold)} oro/h de tiempo total simulado · Bajas ${f.kills-r.initial.kills} · Muertes ${r.deaths}<br>Tiempo real activo: ${durationText(r.realMs/1000)} · ${esc(r.endReason||r.pauseReason||"En curso")}<br>${esc(r.reason||"")}<br><small>${esc(skillChanges(r,f))}</small>`;
}
function updateSimulationUI(){
  const panel=document.getElementById("devProgressionPanel");if(!panel||!state)return;
  const p=devProgress(),r=p.simulation,locked=simulationLocked();
  const multi=document.getElementById("devXpMultiplier"),scope=document.getElementById("devXpScope");
  if(multi)multi.disabled=locked;if(scope)scope.disabled=locked;
  const note=document.getElementById("simClockNote");
  if(note)note.textContent=locked?"RELOJ DEV EXCLUSIVO · XP ×1 obligatoria · reloj normal suspendido. La pausa también congela todos los temporizadores.":`Velocidad normal ×1 / XP ×${p.xpMultiplier} · ${p.xpScope==="both"?"personaje y habilidades":p.xpScope==="skills"?"habilidades":"personaje"}. Aplicación inmediata; oro y drops originales.`;
  const output=document.getElementById("simLive");
  if(output)output.innerHTML=r?`<div class="row"><b>${esc(r.status)}</b><span>${(r.processed/r.target*100).toFixed(2)}%</span></div><div class="bar xp"><div style="width:${r.processed/r.target*100}%"></div></div><div class="simMetrics"><div><small>Tiempo total procesado</small>${durationText(r.processed)}</div><div><small>Tiempo en combate</small>${durationText(r.combatSec)}</div><div><small>Tiempo fuera de combate</small>${durationText(r.processed-r.combatSec)}</div><div><small>Tiempo real activo</small>${durationText(r.realMs/1000)}</div></div><div>${simulationSummary({...r,final:valuesSnapshot(state)})}</div><p class="muted">Estado actual: ${esc(activityReason(state))}. Las tasas se dividen por TODO el tiempo simulado, incluido el tiempo detenido. ${r.pauseReason?esc(r.pauseReason):""}</p>`:"Todavía no hay una simulación.";
  for(const [id,enabled] of [["simStart",!locked],["simPause",r?.status==="running"],["simResume",r&&["paused","recovered"].includes(r.status)],["simStop",locked]]){
    const b=document.getElementById(id);if(b)b.disabled=!enabled||simSaving;
  }
  panel.querySelectorAll("[data-sim-config]").forEach(el=>el.disabled=locked);
}
function appendProgressionPanel(){
  document.getElementById("devProgressionPanel")?.remove();
  if(gameMode!=="dev"||!state?.devEnvironment||!ready)return;
  recoverSimulation();const p=devProgress();
  const panel=document.createElement("details");panel.id="devProgressionPanel";panel.open=true;
  panel.innerHTML=`<summary>🧪 Pruebas de progresión DEV</summary><section style="border:1px solid #ba944f;border-radius:8px;padding:12px;margin:10px 0"><h2>A. Jugar normalmente con XP multiplicada</h2><p class="muted">Modo principal de prueba: tiempo real ×1. Podés combatir, curarte, lanzar hechizos, comprar y cambiar de enemigo. Solo aumenta la XP elegida; no el oro ni los drops.</p><div class="devFields"><label>Multiplicador de XP<select id="devXpMultiplier">${XP_OPTIONS.map(n=>`<option value="${n}" ${n===p.xpMultiplier?"selected":""}>×${n}</option>`).join("")}</select></label><label>Afecta<select id="devXpScope"><option value="both" ${p.xpScope==="both"?"selected":""}>Personaje y habilidades</option><option value="character" ${p.xpScope==="character"?"selected":""}>Solo personaje</option><option value="skills" ${p.xpScope==="skills"?"selected":""}>Solo habilidades</option></select></label></div><div id="simClockNote" role="status"></div></section><section style="border:1px solid #79609b;border-radius:8px;padding:12px;margin:10px 0"><h2>B. Simulación automática acelerada</h2><p class="muted">Herramienta independiente de procesamiento masivo: acelera el tiempo del motor, no está pensada para jugar manualmente. No lanza hechizos automáticamente. Mientras esté en curso o pausada, la XP queda en ×1 y el reloj normal se congela.</p><div class="devFields"><label>Velocidad objetivo<select id="simSpeed" data-sim-config><option value="10">×10</option><option value="100">×100</option><option value="365" selected>×365</option></select></label><label>Duración objetivo<select id="simDuration" data-sim-config>${SIM_DURATIONS.map(([s,n])=>`<option value="${s}">${n}</option>`).join("")}<option value="custom">Personalizada</option></select></label><label>Horas personalizadas<input id="simCustom" data-sim-config type="number" min="0.000278" max="87600" step="any" value="1"></label><label>Semilla<input id="simSeed" data-sim-config type="text" maxlength="120" value="argentum-1"></label></div><label class="muted"><input id="simMaximum" data-sim-config type="checkbox"> Máximo rendimiento por lotes, sin limitar la velocidad al reloj real</label><p class="muted">×365 estricto procesa 365 segundos por segundo real: un año requiere aproximadamente un día. Para ensayos largos más rápidos, activá máximo rendimiento; también ejecuta TODOS los pasos reales, sin estimaciones. La semilla solo es comparable con el mismo estado inicial y las mismas acciones manuales.</p><p class="muted">Prepará primero el personaje e iniciá combate o navegación antes de simular. No hay cambio automático de objetivo ni resurrección. Durante una prueba podés lanzar hechizos, descansar y detener/iniciar combate manualmente. El panel administrador se bloquea hasta terminar.</p><div class="actions"><button id="simStart" data-sim-action="start">Iniciar simulación</button><button id="simPause" data-sim-action="pause">Pausar</button><button id="simResume" data-sim-action="resume">Reanudar</button><button id="simStop" data-sim-action="stop">Detener y conservar resultados</button></div><div id="simLive" aria-live="off"></div><details><summary>Resultados anteriores (últimos 50 por personaje DEV)</summary><div id="simHistory">${p.history.map(r=>`<article>${simulationSummary(r)}</article>`).join("")||"Sin resultados."}</div><button data-sim-action="exportReports">Exportar informes DEV de todos los personajes</button></details><details><summary>Pruebas aisladas de Entrega 3</summary><button data-sim-action="tests">Ejecutar pruebas</button><pre id="simTests">No ejecutadas.</pre></details></section>`;
  document.getElementById("devAdminPanel")?.after(panel);
  updateSimulationUI();
}
appendDevPanel=function(){baseAppendDev();appendProgressionPanel();};
// No se recupera el estado 'running' al volver a dibujar una prueba en ejecución.
const originalRecoverSimulation=recoverSimulation;
recoverSimulation=function(){originalRecoverSimulation();};
devAdminAction=async function(action){if(simulationLocked())return toast("Detené la simulación antes de preparar al personaje.");return baseDevAdmin(action);};
changeRoster=async function(action,id){
  if(simulationLocked())return toast("Detené la simulación antes de cambiar o borrar el personaje DEV.");
  const result=await baseChangeRoster(action,id);
  if(gameMode==="dev"&&state){recoverSimulation();appendProgressionPanel();}
  return result;
};
switchEnvironment=async function(){
  if(simSaving)return toast("Esperá a que se confirme el checkpoint.");
  if(simulationLocked()){
    if(!confirm("La prueba quedará pausada en DEV y requerirá reanudación manual. ¿Cambiar de entorno?"))return;
    await pauseSimulation("Pausa por cambio de entorno");
  }
  await baseSwitchEnvironment();
};
importJSON=async function(file){if(simulationLocked())return toast("Detené la simulación antes de importar DEV.");return baseImportProgression(file);};
exportJSON=async function(){if(simulationLocked())await simulationCheckpoint();return baseExportProgression();};
document.addEventListener("change",async e=>{
  if(!["devXpMultiplier","devXpScope"].includes(e.target.id))return;
  if(gameMode!=="dev"||!state?.devEnvironment||simulationLocked()||busy||managing)return;
  syncRuntime();if(busy)return;
  const p=devProgress();
  if(e.target.id==="devXpMultiplier"&&XP_OPTIONS.includes(Number(e.target.value)))p.xpMultiplier=Number(e.target.value);
  if(e.target.id==="devXpScope"&&["both","character","skills"].includes(e.target.value))p.xpScope=e.target.value;
  await saveRoster();updateSimulationUI();
});
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-sim-action]");
  if(b){
    e.preventDefault();e.stopImmediatePropagation();
    if(b.disabled||gameMode!=="dev"||!state?.devEnvironment||busy||managing||simSaving)return;
    const a=b.dataset.simAction;
    if(a==="start")return startSimulation();
    if(a==="pause")return pauseSimulation();
    if(a==="resume")return resumeSimulation();
    if(a==="stop")return finishSimulation("stopped","Detención solicitada; resultados conservados");
    if(a==="tests")return runProgressionTests();
    if(a==="exportReports")return exportSimulationReports();
  }
  if(!simulationLocked())return;
  const control=e.target.closest("[data-act]");if(!control)return;
  const act=control.dataset.act;
  if(["export","downloadHtml"].includes(act))return;
  if(!["cast","start","stop","rest"].includes(act)){
    e.preventDefault();e.stopImmediatePropagation();return toast("Terminá la prueba antes de cambiar inventario, actividad, personaje o guardado.");
  }
  e.preventDefault();e.stopImmediatePropagation();
  const r=currentSimulation();
  if(r.status!=="running")return toast("La simulación está pausada; reanudala para actuar.");
  if(control.disabled||simSaving)return;
  withSimulationRng(r,()=>{
    if(act==="cast")castSpell(control.dataset.id);
    if(act==="start"){startCombat();r.reason="Combate iniciado manualmente";}
    if(act==="stop"){stopCombat();r.reason="Combate detenido manualmente";}
    if(act==="rest"){rest();r.reason="Descanso solicitado manualmente";}
  });
  updateSimFinal(r);await simulationCheckpoint();renderGame();
},true);
function exportSimulationReports(){
  const records=roster.characters.map(e=>({id:e.id,name:e.state.name,cls:e.state.cls,reports:e.state.dev?.progress?.history||[],current:e.state.dev?.progress?.simulation||null}));
  const blob=new Blob([JSON.stringify({kind:"argentum-dev-reports",version:1,characters:records},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="argentum-dev-informes.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
/* Pruebas puras del motor real: se aíslan globals y RNG; no hay I/O. */
function runProgressionTests(){
  if(simulationLocked())return toast("Detené la simulación para ejecutar pruebas aisladas.");
  const saved={state,mode:gameMode,rng,draft,off:{...OFF},need:needRender,runtimeAt,runtimeRemainder};
  const lines=[];
  const test=(name,fn)=>{try{if(!fn())throw Error("resultado inesperado");lines.push("✓ "+name);}catch(e){lines.push("✗ "+name+": "+e.message);}};
  const fixture=()=>{const s=devFixture();s.devEnvironment=true;s.dev={invulnerable:false};return s;};
  const run=(initial,total,batch,seed="test")=>{
    state=copyJSON(initial);gameMode="dev";
    const r={id:"test",status:"paused",processed:0,target:total,combatSec:0,realMs:0,deaths:0,rngState:seedHash(seed),initial:valuesSnapshot(state),reason:"",speed:365,lastDeathAt:-1};
    devProgress().simulation=r;
    while(r.processed<total)simulationBatch(r,Math.min(batch,total-r.processed));
    const out={state:copyJSON(state),rng:r.rngState,processed:r.processed,combat:r.combatSec,deaths:r.deaths};return out;
  };
  try{
    OFF.active=true;simTestContext=true;
    test("Normal: XP ×1 incluso con opciones DEV",()=>{state=fixture();gameMode="normal";devProgress().xpMultiplier=1000;return multiplierFor(state,"character")===1&&multiplierFor(state,"skills")===1;});
    test("100 XP con ×365 = 36500, sin modificar oro",()=>{gameMode="dev";state=fixture();devProgress().xpMultiplier=365;const g=state.gold;gainCharacterXP(state,100);return state.xp===36500&&state.gold===g;});
    test("Selección XP personaje/habilidades/ambas",()=>["character","skills","both"].every(scope=>{state=fixture();const p=devProgress();p.xpMultiplier=10;p.xpScope=scope;gainCharacterXP(state,10);sklXp(state,"magia",10);return state.xp===(scope==="skills"?10:100)&&state.skills.magia.xp===(scope==="character"?10:100);}));
    test("Establecer niveles ignora multiplicador",()=>{state=fixture();devProgress().xpMultiplier=1000;devSetLevel(state,50);devSetSkill(state,"magia",25);return state.xp===xpFor(50)&&state.skills.magia.xp===5760;});
    test("Navegación ×10: oro 60, XP 4000 por hora",()=>{state=fixture();devProgress().xpMultiplier=10;state.nav={id:"costa",totalMs:3600000,remainingMs:3600000,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0};advanceNav(state,3600000);return state.gold===160&&state.skills.navegacion.xp===4000;});
    test("Motor individual = lotes de 173 (estado, RNG, muertes)",()=>{const s=fixture();s.combat.active=true;return JSON.stringify(run(s,7200,1))===JSON.stringify(run(s,7200,173));});
    test("Invulnerabilidad y lotes con mismo RNG",()=>{const s=fixture();s.dev.invulnerable=true;s.combat.active=true;return JSON.stringify(run(s,3600,1))===JSON.stringify(run(s,3600,250));});
    test("Navegación por step: XP ×1 durante simulación",()=>{const s=fixture();s.dev.progress={xpMultiplier:365,xpScope:"both",history:[],simulation:null};s.nav={id:"costa",totalMs:3600000,remainingMs:3600000,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0};const a=run(s,3600,113);return a.state.gold===160&&a.state.skills.navegacion.xp===400;});
    test("Checkpoint JSON + reanudación = ejecución continua",()=>{
      const s=fixture();s.combat.active=true;s.dev.invulnerable=true;
      const expected=run(s,3600,137);
      run(s,1800,73);const checkpoint=copyJSON(state),r=checkpoint.dev.progress.simulation;
      r.target=3600;r.frame=frameFlags(checkpoint);freezeCharacter(checkpoint);
      state=copyJSON(checkpoint);const recovered=state.dev.progress.simulation;restoreFrame(state,recovered);
      while(recovered.processed<3600)simulationBatch(recovered,Math.min(91,3600-recovered.processed));
      // Comparar exclusivamente estado del juego, RNG y contadores (no metadatos de UI).
      const actual=copyJSON(state),reference=expected.state;delete actual.dev.progress;delete reference.dev.progress;
      return JSON.stringify(actual)===JSON.stringify(reference)&&recovered.rngState===expected.rng&&recovered.combatSec===expected.combat;
    });
    test("Pausa y reloj normal no avanzan personaje",()=>{state=fixture();devProgress().simulation={status:"paused"};const before=JSON.stringify(state);runtimeAt=Date.now()-100000;syncRuntime();tick();return JSON.stringify(state)===before;});
    test("Muerte: sin reinicio ni recompensas posteriores",()=>{const s=fixture();s.hp=1;s.combat.enemyId="rey_pirata";s.combat.dungeonId="dungeon_pirata";s.combat.enemyHp=3308;s.combat.active=true;const out=run(s,86400,250);return out.deaths===1&&!out.state.combat.active&&sumKills(out.state)===0;});
    test("Cambio de contexto congela navegación sin premios",()=>{state=fixture();state.nav={id:"costa",remainingMs:3600000,paused:false};const g=state.gold;stopContextActivities(state);advanceNav(state,3600000);return state.gold===g&&state.nav.paused&&!state.combat.active;});
    test("RNG aislado: se restaura después de pasos",()=>{const original=rng;run(fixture(),50,7);return rng===original;});
    test("JSON DEV sigue rechazado en normal",()=>{const s=fixture();return !decodeForMode({version:7,kind:DEV_KIND,activeId:"a",characters:[{id:"a",state:s}]},"normal");});
    test("Checkpoint corrupto rechazado",()=>!validSimulation({status:"running",processed:NaN,target:10}));
  }finally{
    state=saved.state;gameMode=saved.mode;rng=saved.rng;draft=saved.draft;Object.assign(OFF,saved.off);needRender=saved.need;runtimeAt=saved.runtimeAt;runtimeRemainder=saved.runtimeRemainder;simulationExecuting=false;simTestContext=false;
  }
  const out=document.getElementById("simTests");if(out)out.textContent=lines.join("\n")+"\n\n"+lines.filter(x=>x.startsWith("✓")).length+" / "+lines.length+" aprobadas.\nPruebas del motor y serialización; no verifican IndexedDB real, recarga del navegador ni rendimiento de un año.";
}
window.addEventListener("pagehide",()=>{
  if(gameMode!=="dev"||!simulationLocked()||!storageReady)return;
  try{localStorage.setItem(MODE_STORAGE.dev.key,JSON.stringify(makeRosterRecord()));}catch(_){}
});
