
"use strict";
/* Diagnóstico aislado. */
let diagnosticJob=null;
let diagnosticFrame=null;
let diagnosticReports=[];
const diagnosticsEnemySwing=enemySwing;
enemySwing=function(d,en){
  const before=state.hp;
  diagnosticsEnemySwing(d,en);
  if(diagnosticFrame)diagnosticFrame.damage+=Math.max(0,before-state.hp);
};
const diagnosticsDeath=onDeath;
onDeath=function(en){if(diagnosticFrame)diagnosticFrame.deaths++;diagnosticsDeath(en);};
const diagnosticsCast=castSpell;
castSpell=function(id){
  const before=state?.hp||0;
  diagnosticsCast(id);
  if(diagnosticFrame){diagnosticFrame.healing+=Math.max(0,state.hp-before);diagnosticFrame.casts++;}
};
const diagnosticsAppend=appendDevPanel;
appendDevPanel=function(){diagnosticsAppend();appendDiagnostics();};
function appendDiagnostics(){
  document.getElementById('devBalancePanel')?.remove();
  if(gameMode!=='dev'||!state?.devEnvironment||!ready)return;
  const panel=document.createElement('details');panel.id='devBalancePanel';panel.className='panel';panel.style.marginTop='12px';
  panel.innerHTML=`<summary>📊 Diagnóstico reproducible de balance · motor original</summary>
  <p class="muted">Compara las ocho clases con Humano, el mismo nivel inicial, equipo, habilidad, NPC y semilla. XP ×1, sin invulnerabilidad. No busca una estrategia óptima ni cambia de enemigo. El nivel puede aumentar durante el ensayo. Se detiene el farmeo al morir, sin resurrección ni reinicio. Las bajas usan las tablas originales.</p>
  <div class="devFields"><label>Nivel inicial<input id="diagLevel" type="number" min="1" max="1000" value="1"></label><label>Nivel de habilidades<input id="diagSkills" type="number" min="1" max="1000" value="1"></label><label>Horas simuladas por clase<input id="diagHours" type="number" min="0.01" max="168" step="0.01" value="1"></label></div>
  <div class="devFields"><label>Objetivo<select id="diagEnemy">${ENEMIES.map(en=>`<option value="${en.id}">${esc(en.name)} · Nv ${en.level}</option>`).join('')}</select></label><label>Equipo<select id="diagEquipment"><option value="none">Sin equipo</option><option value="basic">Daga, cuero y madera</option><option value="advanced">Hacha, placas y torre (si cumple requisitos)</option></select></label></div>
  <div class="devFields"><label>Política de intervención<select id="diagPolicy"><option value="none">Sin curación ni descanso</option><option value="heal">Guion: Curar Heridas Leves con HP &lt; 50%</option><option value="rest">Guion: descansar con HP &lt; 50%, reanudar al terminar</option></select></label><label>Semilla<input id="diagSeed" type="text" value="balance-1" maxlength="100"></label></div>
  <p class="muted">Curación: una comprobación antes de cada segundo, solo si hay maná y cooldown disponible; usa el hechizo real. Descanso: solo si es legal y pagable; reanuda únicamente el combate pausado por ese descanso, nunca tras una muerte. Ningún guion se aplica fuera del diagnóstico. Equipo avanzado incompatible queda sin equipar y se informa. Todos comienzan con 100 oro y recursos completos.</p>
  <div class="actions"><button data-diagnostic="start">Comparar ocho clases</button><button data-diagnostic="stop">Detener y conservar resultados parciales</button><button data-diagnostic="export">Exportar informe JSON</button></div><p class="muted">Iniciar pausa y guarda el personaje DEV actual. Durante el diagnóstico no avanzan personajes reales. No se reanuda automáticamente al finalizar. Una recarga cancela el ensayo; solo conserva los informes ya persistidos. No es un checkpoint de simulación.</p><div id="diagProgress" role="status">Sin ejecutar.</div><div id="diagResults" style="overflow:auto"></div>`;
  document.getElementById('devProgressionPanel')?.after(panel);
  diagnosticReports=Array.isArray(state.dev.balanceReports)?state.dev.balanceReports:[];
  displayDiagnosticReports();
}
function displayDiagnosticReports(){
  const box=document.getElementById('diagResults');if(!box)return;
  box.innerHTML=diagnosticReports.map(r=>{
    if(r.error)return `<p>${esc(r.className)}: ${esc(r.error)}</p>`;
    const rate=(n,t)=>t>0?(n*3600/t).toFixed(1):'—';
    const estimate=[10,20,35,50].map(n=>{
      if(r.final.xp>=xpFor(n))return `Nv ${n}: alcanzado${r.reached[n]!==undefined?' a '+durationText(r.reached[n]):' antes del ensayo'}`;
      const remaining=Math.max(0,xpFor(n)-r.final.xp),xp=r.final.xp-r.initial.xp;
      return `Nv ${n}: ${xp>0?(remaining/(xp/r.seconds)/3600).toFixed(1)+' h adicionales':'sin tasa positiva'} (extrapolación constante, NO ruta simulada)`;
    }).join('<br>');
    return `<article class="panel" style="margin:8px 0"><b>${esc(r.className)} · ${r.cancelled?'parcial':'completo'}</b><div class="muted">${esc(r.enemy)} · ${esc(r.policy)} · Semilla ${esc(r.seed)}<br>Equipo: ${esc(r.equipment.join(', ')||'ninguno')} ${esc(r.warnings.join('; '))}</div><p>Tiempo total ${durationText(r.seconds)} · Combate ${durationText(r.combatSeconds)} · Descanso ${durationText(r.restSeconds)}<br>Nivel ${r.initial.level} → ${r.final.level} · XP ganada ${fmt(r.final.xp-r.initial.xp)} · Oro neto ${fmt(r.final.gold-r.initial.gold)}<br>Por hora TOTAL: ${rate(r.final.xp-r.initial.xp,r.seconds)} XP · ${rate(r.final.gold-r.initial.gold,r.seconds)} oro neto · ${rate(r.kills,r.seconds)} bajas<br>Por hora de COMBATE: ${rate(r.final.xp-r.initial.xp,r.combatSeconds)} XP · ${rate(r.kills,r.combatSeconds)} bajas<br>Tiempo de combate / baja: ${r.kills?(r.combatSeconds/r.kills).toFixed(1)+' s (incluye combate incompleto)':'sin bajas'}<br>Daño recibido ${fmt(r.damage)} · Muertes ${r.deaths} · Curaciones ${r.casts} (+${fmt(r.healing)} HP) · Descansos ${r.rests} (${fmt(r.restGold)} oro)<br>Segundos combatiendo con HP &lt; 50%: ${r.lowHpSeconds} · Curación solicitada sin poder lanzarla: ${r.blockedHealSeconds} s<br>Estado final: ${esc(r.reason)}</p><p class="muted">${estimate}<br>Las tasas observadas no garantizan supervivencia futura. Si murió, extrapolar supondría reinicios que NO se ejecutaron; no es una predicción válida de farmeo continuo.</p><small>${esc(skillChanges({initial:r.initial},r.final))}</small></article>`;
  }).join('')||'<p class="muted">No hay mediciones. No se presentan cifras estimadas como pruebas ejecutadas.</p>';
}
function makeDiagnosticState(cls,config){
  const previousDraft=draft;
  let s;
  try{draft={name:'Diagnóstico '+cls.name,race:'humano',cls:cls.id};s=normalNewState();}finally{draft=previousDraft;}
  s.devEnvironment=true;s.dev={invulnerable:false};devSetLevel(s,config.level);
  devSetSkill(s,'weapon',config.skills);SKILLS.forEach(k=>devSetSkill(s,k.key,config.skills));
  const en=enemyById(config.enemy),dg=dungeonById(en.dungeonId);
  if(!dungeonOk(dg,s)||!enemyUnlocked(en,derive(s).L))throw Error('Objetivo bloqueado por requisitos reales de nivel o Navegación.');
  const warnings=[];
  const items=config.equipment==='advanced'?['hacha','placas','torre']:config.equipment==='basic'?['daga','cuero','madera']:[];
  items.forEach(id=>{const item=itemById(id);if(reqOk(s,item.req)){s.owned[id]=true;s.equip[item.slot]=id;}else warnings.push(item.name+': requisito no cumplido');});
  const d=derive(s);s.hp=d.hpMax;s.mp=d.mpMax;
  s.combat={active:true,dungeonId:en.dungeonId,enemyId:en.id,enemyHp:en.hp,pT:0,eT:0,enemyPara:0};
  return {s,warnings};
}
async function runDiagnosticComparison(){
  if(gameMode!=='dev'||!state?.devEnvironment||busy||managing||simulationLocked()||diagnosticJob)return toast('Terminá la simulación o tarea actual antes del diagnóstico.');
  const config={level:Number(document.getElementById('diagLevel').value),skills:Number(document.getElementById('diagSkills').value),hours:Number(document.getElementById('diagHours').value),enemy:document.getElementById('diagEnemy').value,equipment:document.getElementById('diagEquipment').value,policy:document.getElementById('diagPolicy').value,seed:document.getElementById('diagSeed').value||'balance-1'};
  if(![config.level,config.skills].every(n=>Number.isInteger(n)&&n>=1&&n<=1000)||!Number.isFinite(config.hours)||config.hours<0.01||config.hours>168)return toast('Nivel/habilidades: 1–1000. Duración: 0,01–168 horas.');
  syncRuntime();if(busy)return;
  freezeCharacter(state);runtimeAt=Date.now();runtimeRemainder=0;
  if(!await saveRoster())return toast('No se inició: falló el guardado DEV previo.');
  const realState=state,job={cancel:false};diagnosticJob=job;busy=true;
  const total=Math.round(config.hours*3600);diagnosticReports=[];
  try{
    for(const cls of CLASSES){
      if(job.cancel)break;
      let setup;
      try{setup=makeDiagnosticState(cls,config);}catch(e){diagnosticReports.push({className:cls.name,error:e.message});continue;}
      const s=setup.s,r={className:cls.name,enemy:enemyById(config.enemy).name,policy:config.policy,seed:config.seed,config:{...config},equipment:Object.values(s.equip).filter(Boolean).map(id=>itemById(id).name),warnings:setup.warnings,initial:valuesSnapshot(s),seconds:0,combatSeconds:0,restSeconds:0,kills:0,damage:0,deaths:0,casts:0,healing:0,rests:0,restGold:0,lowHpSeconds:0,blockedHealSeconds:0,reached:{},reason:'Combate activo',rngState:seedHash(config.seed)};
      let resumeAfterRest=false;
      while(r.seconds<total&&!job.cancel){
        const previous={state,rng,off:{...OFF},need:needRender};
        const start=performance.now();let count=0;
        try{
          state=s;rng=()=>seededNext(r);OFF.active=true;diagnosticFrame=r;
          while(r.seconds<total&&count<250&&performance.now()-start<8){
            if(resumeAfterRest&&s.restLeft===0&&!r.deaths){beginPhysicalCombat(s);resumeAfterRest=false;}
            const low=s.hp<derive(s).hpMax*0.5;
            if(s.combat.active&&low){
              r.lowHpSeconds++;
              if(config.policy==='heal'){
                if(canCast('curar_leve'))castSpell('curar_leve');else r.blockedHealSeconds++;
              }else if(config.policy==='rest'&&s.restCd===0&&s.gold>=restCost(derive(s).L)){
                const gold=s.gold;rest();if(s.restLeft>0){r.rests++;r.restGold+=gold-s.gold;resumeAfterRest=true;}
              }
            }
            if(s.combat.active&&!s.restLeft)r.combatSeconds++;
            if(s.restLeft>0)r.restSeconds++;
            step();r.seconds++;count++;
            const level=levelFromXp(s.xp);for(const n of [10,20,35,50])if(level>=n&&r.initial.level<n&&r.reached[n]===undefined)r.reached[n]=r.seconds;
            if(r.deaths){resumeAfterRest=false;r.reason='Muerte: farmeo detenido, sin reinicio';}
          }
        }finally{diagnosticFrame=null;state=previous.state;rng=previous.rng;Object.assign(OFF,previous.off);needRender=previous.need;}
        const progress=document.getElementById('diagProgress');if(progress)progress.textContent=`${cls.name}: ${durationText(r.seconds)} / ${durationText(total)} · ${Math.floor(r.seconds/total*100)}% · ${r.deaths} muertes`;
        await new Promise(resolve=>setTimeout(resolve,0));
      }
      r.cancelled=job.cancel;r.kills=sumKills(s)-r.initial.kills;r.final=valuesSnapshot(s);
      if(!r.deaths)r.reason=job.cancel?'Cancelación solicitada; '+activityReason(s):activityReason(s)+' al completar la duración';
      diagnosticReports.push(r);
      realState.dev.balanceReports=copyJSON(diagnosticReports);
      displayDiagnosticReports();
            await saveRoster();
    }
  }catch(e){toast('Diagnóstico detenido: '+e.message);}
  finally{
    state=realState;diagnosticFrame=null;diagnosticJob=null;busy=false;runtimeAt=Date.now();runtimeRemainder=0;
    state.dev.balanceReports=copyJSON(diagnosticReports);await saveRoster();
    const progress=document.getElementById('diagProgress');if(progress)progress.textContent=job.cancel?'Cancelado: resultados parciales conservados.':'Diagnóstico terminado. Consultá los resultados; no son una estrategia óptima.';
    displayDiagnosticReports();updateLive();
  }
}
document.addEventListener('click',e=>{
  const button=e.target.closest('[data-diagnostic]');if(!button)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(gameMode!=='dev'||!state?.devEnvironment)return;
  const action=button.dataset.diagnostic;
  if(action==='stop'){if(diagnosticJob)diagnosticJob.cancel=true;return;}
  if(action==='start')return runDiagnosticComparison();
  if(action==='export'){
    const text=JSON.stringify({kind:'argentum-dev-balance-report',version:1,generatedAt:new Date().toISOString(),reports:diagnosticReports},null,2);
    const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='argentum-dev-diagnostico.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
},true);
