
"use strict";
/* E1.7: primer encargo del pescador. Usa state.inventory, state.owned y state.ui opcional (guardado v7). */
/* @include src/catalogs/027-e17-quests-e17_quest.js */
/* @include src/catalogs/027-e17-quests-e17_rod.js */
function e17Done(){return !!state?.owned?.[E17_ROD.id];}
function e17HasFish(){return E17_QUEST.needs.every(x=>Number.isSafeInteger(state?.inventory?.['pez_'+x.id])&&state.inventory['pez_'+x.id]>=x.qty);}
function e17Selected(){return e17Done()&&state?.ui?.fishingRodId===E17_ROD.id;}
/* Mantiene intacta la progresión de cañas comprables y agrega una alternativa de quest. */
const e17PreviousRod=e161Rod;
e161Rod=function(){return e17Selected()?E17_ROD:e17PreviousRod();};
const e17PreviousBite=e161NextBite;
e161NextBite=function(){
 e17PreviousBite();
 if(!e17Selected()||!e161Fishing||e161Waiting===null)return;
 const remaining=Math.max(1200,e161CatchAt-Date.now());
 clearTimeout(e161Waiting);
 const wait=Math.max(1200,Math.round(remaining*.90));
 e161CatchAt=Date.now()+wait;
 e161Waiting=setTimeout(()=>{e161Waiting=null;e161StopWait();if(!e161Fishing||!e161OnPage()||!e161CanFish())return;const f=e161RandomFish();e16Start(f.id);},wait);
};
function e17QuestHtml(){
 const lvl=e16FishLevel(),done=e17Done(),unlocked=lvl>=E17_QUEST.level;
 const fish=E17_QUEST.needs.map(x=>{
  const f=E16_FISH.find(y=>y.id===x.id),n=Math.max(0,Number(state.inventory?.['pez_'+x.id])||0);
  return `<div class="e17QuestFish"><b>${f?.icon||'🐟'} ${f?.name||x.id}</b>${fmt(Math.min(n,x.qty))} / ${x.qty} en inventario<div class="e17QuestBar"><div style="width:${100*Math.min(1,n/x.qty)}%"></div></div></div>`;
 }).join('');
 return `<section class="e17Quest" aria-label="Encargo del pescador"><h3>📜 ${E17_QUEST.title}</h3>
 <div class="fishMuted">🏡 Muelle del pueblo · Recomendado: Pesca ${E17_QUEST.level} · Una sola vez por personaje</div>
 ${done?`<p>✅ ¡Encargo completado! Ya conseguiste la <b>${E17_ROD.name}</b>.</p><div class="e17QuestReward"><span class="fishMuted">Control +7,5% de barra · Picadas 10% más rápidas · Recompensa permanente</span><button class="small" data-e17-equip ${e17Selected()?'disabled':''}>${e17Selected()?'✓ Caña equipada':'Equipar caña de misión'}</button></div>`:
 `<p>El viejo pescador necesita provisiones. Guardá estas capturas en tu inventario y entregalas juntas para conseguir una caña especial.</p>
 <div class="e17QuestGrid">${fish}</div>
 <div class="e17QuestReward"><div><b>🎁 ${E17_ROD.name}</b><div class="fishMuted">Recompensa de este encargo. Requiere habilidad de Pesca 6 para reclamarla; no se compra con oro.</div></div>
 <button class="primary" data-e17-deliver ${!unlocked||!e17HasFish()?'disabled':''}>${!unlocked?'🔒 Requiere Pesca 6':!e17HasFish()?'Faltan peces':'Entregar peces y reclamar caña'}</button></div>
 <p class="fishMuted">Los peces entregados se consumen. Podés venderlos en Inventario, pero entonces no contarán para el encargo.</p>`}
 </section>`;
}


document.addEventListener('click',event=>{
 const deliver=event.target.closest('[data-e17-deliver]');
 const equip=event.target.closest('[data-e17-equip]');
 if(!deliver&&!equip)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 if(deliver){
  if(e17Done()||e165Zone().id!=='muelle'||e16FishLevel()<E17_QUEST.level||!e17HasFish())return;
  // Validar antes de modificar para evitar entregas parciales o pérdidas accidentales.
  for(const x of E17_QUEST.needs){const id='pez_'+x.id;state.inventory[id]-=x.qty;if(state.inventory[id]===0)delete state.inventory[id];}
  state.owned=state.owned||{};state.owned[E17_ROD.id]=true;
  state.ui=state.ui||{};state.ui.fishingRodId=E17_ROD.id;
  if(e161Fishing){e161Fishing=false;e161StopWait();}
  addLog('Completaste '+E17_QUEST.title+' y recibiste '+E17_ROD.name+'.');
  persist();renderGame();toast('🏆 ¡Misión completada! '+E17_ROD.name+' equipada.');
 }else if(equip){
  if(!e17Done()||e16FishLevel()<E17_ROD.req)return;
  if(e161Fishing){e161Fishing=false;e161StopWait();}
  state.ui=state.ui||{};state.ui.fishingRodId=E17_ROD.id;
  persist();e16Page();toast('Caña equipada: '+E17_ROD.name);
 }
},true);
