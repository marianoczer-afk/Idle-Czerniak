
"use strict";
/* E1.7.1: cambios incrementales; no se altera el formato de guardado v7. */
const E171_QUESTS=[
 {id:'e171_rio',zone:'rio',level:12,title:'Los secretos del río',needs:[{id:'lucio',qty:7},{id:'anguila',qty:4}],rod:{id:'e171_rod_rio',name:'Caña del Guardarríos',req:12,bonus:36,desc:'Control +9% de barra · resiliencia 32% · hasta 240 kg'}},
 {id:'e171_costa',zone:'costa',level:24,title:'El encargo del capitán',needs:[{id:'lubina',qty:9},{id:'atun',qty:5}],rod:{id:'e171_rod_costa',name:'Caña de las Brumas',req:24,bonus:44,desc:'Control +11% de barra · picadas 15% más rápidas · hasta 650 kg'}}
];
function e171Done(q){return !!state?.owned?.[q.rod.id];}
function e171CanDeliver(q){return e16FishLevel()>=q.level&&q.needs.every(n=>(state?.inventory?.['pez_'+n.id]||0)>=n.qty);}
function e171RodSelected(q){return e171Done(q)&&state?.ui?.fishingRodId===q.rod.id;}
/* Resolver una única caña efectiva. Las compradas siguen en propiedad pero no se equipan simultáneamente. */
const e171PriorRod=e161Rod;
e161Rod=function(){
 const q=E171_QUESTS.find(e171RodSelected);
 return q?q.rod:e171PriorRod();
};
/* Arranque justo: la zona verde comienza centrada sobre el pez, con margen en ambos extremos. */
const e171PreviousStart=e16Start;
e16Start=function(id){
 e171PreviousStart(id);
 if(!e16Session)return;
 const g=e16Session;
 const track=document.getElementById('e16Tank');
 const width=e190TrackWidth();
 const maxPos=Math.max(0,width-g.fish.zone-4);
 g.target=Math.max(8,Math.min(width-30,g.target));
 g.pos=Math.max(0,Math.min(maxPos,g.target+12-g.fish.zone/2));
 g.vel=0;
 g.progress=.27;
 e16Paint();
};
/* Para las nuevas cañas de misión, acelerar picadas con la misma mecánica de espera existente. */
const e171PreviousNextBite=e161NextBite;
e161NextBite=function(){
 e171PreviousNextBite();
 const q=E171_QUESTS.find(e171RodSelected);
 if(!q||e161Waiting===null||!e161Fishing)return;
 const factor=q.id==='e171_rio'?.88:.85;
 const remaining=Math.max(1200,e161CatchAt-Date.now());
 clearTimeout(e161Waiting);
 const wait=Math.max(1200,Math.round(remaining*factor));
 e161CatchAt=Date.now()+wait;
 e161Waiting=setTimeout(()=>{e161Waiting=null;e161StopWait();if(!e161Fishing||!e161OnPage()||!e161CanFish())return;const f=e161RandomFish();e16Start(f.id);},wait);
};
function e171QuestMarkup(q){
 const done=e171Done(q);
 const items=q.needs.map(n=>{
  const f=E16_FISH.find(f=>f.id===n.id),owned=state?.inventory?.['pez_'+n.id]||0;
  return `<span>${f?.icon||'🐟'} ${f?.name||n.id}: <b>${Math.min(owned,n.qty)}/${n.qty}</b></span>`;
 }).join('');
 return `<section class="e171Quest"><h3>📜 ${q.title}</h3><div class="fishMuted">Habilidad de Pesca ${q.level} · Guardá estos peces en el inventario y entregalos juntos. Cualquier tamaño cuenta; se consumen al reclamar.</div>
 <div class="e171Needs">${items}</div><div class="e171Footer"><div><b>🎁 ${q.rod.name}</b><div class="fishMuted">${q.rod.desc}</div></div>
 <button class="small primary" data-e171-deliver="${q.id}" ${e171CanDeliver(q)||done?'':'disabled'}>${done?'✓ Completada':e16FishLevel()<q.level?'🔒 Pesca '+q.level:e171CanDeliver(q)?'Entregar peces':'Faltan peces'}</button></div></section>`;
}


document.addEventListener('click',e=>{
 const deliver=e.target.closest('[data-e171-deliver]'),equip=e.target.closest('[data-e171-equip]');
 if(!deliver&&!equip)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 const q=E171_QUESTS.find(q=>q.id===(deliver?.dataset.e171Deliver||equip?.dataset.e171Equip));
 if(!q)return;
 if(deliver){
  if(e171Done(q)||e165Zone().id!==q.zone||!e171CanDeliver(q))return;
  for(const n of q.needs){const id='pez_'+n.id;state.inventory[id]-=n.qty;if(!state.inventory[id])delete state.inventory[id];}
  state.owned=state.owned||{};state.owned[q.rod.id]=true;
  addLog('Completaste '+q.title+' y recibiste '+q.rod.name+'.');
 }else if(!e171Done(q)||e16FishLevel()<q.level)return;
 if(e161Fishing){e161Fishing=false;e161StopWait();}
 state.ui=state.ui||{};state.ui.fishingRodId=q.rod.id;
 persist();renderGame();toast(deliver?'🏆 ¡Encargo completado! '+q.rod.name:'🎣 Caña equipada: '+q.rod.name);
},true);
