
"use strict";
/* E1.7.1: cambios incrementales; no se altera el formato de guardado v7. */
/* @include src/catalogs/029-e171-improvements-e171_quests.js */
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
const e171PreviousPage=e16Page;
e16Page=function(){
 e171PreviousPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const dock=page.querySelector('.e162Dock');
 /* El muelle, la barra y el botón Tirar caña son lo primero que se ve. */
 if(dock){page.prepend(dock);}
 const current=e165Zone();
 const originalQuest=page.querySelector('.e17Quest');
 if(originalQuest&&e17Done())originalQuest.remove();
 const available=E171_QUESTS.filter(q=>q.zone===current.id);
 const group=document.createElement('div');group.className='e171Quests';
 const firstQuest=originalQuest&&!e17Done()?originalQuest.outerHTML:'';
 group.innerHTML=firstQuest+available.filter(q=>!e171Done(q)).map(e171QuestMarkup).join('');
 if(originalQuest)originalQuest.remove();
 if(dock)dock.after(group);else page.prepend(group);
 /* En el listado de cañas, indicar claramente una sola equipada. */
 const rodDetails=page.querySelector('details:has(.fishRod)');
 if(rodDetails){
  const active=e161Rod();
  rodDetails.querySelectorAll('.fishRod').forEach(row=>{
   const name=row.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim()||'';
   const equipped=name===active?.name;
   row.classList.toggle('e164RodActive',equipped);
   const btn=row.querySelector('[data-e164-equip],[data-e17-equip],[data-e171-equip]');
   if(btn){btn.textContent=equipped?'✓ Equipada':'Equipar';btn.disabled=equipped;}
   const title=row.querySelector('b');if(title)title.textContent=(equipped?'✓ ':'')+name;
  });
  for(const q of E171_QUESTS.filter(e171Done)){
   const row=document.createElement('div');row.className='fishRod';
   const equipped=e171RodSelected(q);
   row.classList.toggle('e164RodActive',equipped);
   row.innerHTML=`<div><b>${equipped?'✓ ':''}${q.rod.name}</b><div class="fishMuted">Recompensa de misión · ${q.rod.desc}</div></div><button class="small" data-e171-equip="${q.id}" ${equipped?'disabled':''}>${equipped?'✓ Equipada':'Equipar'}</button>`;
   rodDetails.append(row);
  }
  const summary=rodDetails.querySelector('summary');if(summary)summary.textContent='🎣 Cañas y estadísticas · '+(active?.name||'Sin caña');
 }
};
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
