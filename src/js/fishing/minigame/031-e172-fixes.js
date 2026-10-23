
"use strict";
/* El id de la caña en ui es la única fuente de verdad: nunca hay dos equipadas. */
function e172RodId(){
 const id=state?.ui?.fishingRodId;
 const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod)];
 const valid=all.find(r=>r.id===id && (state?.owned?.[r.id]||r.id===E17_ROD.id&&e17Done()));
 return valid?.id||e161Rod()?.id||null;
}
const e172PriorPage=e16Page;
e16Page=function(){
 e172PriorPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const activeId=e172RodId();
 const rods=page.querySelector('details:has(.fishRod)');
 if(rods){
  // Reconstruir solo los estados de equipamiento, incluidos los premios de quest.
  rods.querySelectorAll('.fishRod').forEach(row=>{
   const b=row.querySelector('b');if(!b)return;
   const name=b.textContent.replace(/^[✓🏆\s]+/u,'').trim();
   const rod=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod)].find(r=>r.name===name);
   if(!rod)return;
   const equipped=rod.id===activeId;
   b.textContent=(equipped?'✓ ':'')+rod.name;
   row.classList.toggle('e164RodActive',equipped);
   row.classList.toggle('e172Equipped',equipped);
   const btn=row.querySelector('[data-e164-equip],[data-e17-equip],[data-e171-equip]');
   if(btn){btn.textContent=equipped?'✓ Equipada':'Equipar';btn.disabled=equipped;}
   row.querySelectorAll('.e172Label').forEach(el=>el.remove());
   if(equipped&&!btn){const label=document.createElement('span');label.className='e172Label';label.textContent='✓ Equipada';row.append(label);}
  });
  const summary=rods.querySelector('summary');
  if(summary)summary.textContent='🎣 Cañas y estadísticas · '+(e161Rod()?.name||'Sin caña');
 }
 const dock=page.querySelector('.e162Dock');
 if(dock){
  const waiting=dock.querySelector('#e161WaitingText');
  if(waiting&&!e161Fishing&&!e16Session){
   waiting.textContent='Elegí una zona y empezá a pescar con el botón «Tirar la caña».';
  }
  // La notificación de captura ya aparece en un recuadro: evitar duplicarla.
  if(dock.querySelector('.fishCatch')&&waiting&&!e161Fishing&&!e16Session)waiting.style.display='none';
 }
};
/* Cambiar de zona es una acción directa: prepara la caña y comienza la espera automáticamente.
   Se mantienen las restricciones existentes (combate, descanso, navegación). */
document.addEventListener('click',function(e){
 const btn=e.target.closest('[data-e165-zone]');if(!btn)return;
 // Se ejecuta antes del listener E1.6.5 y lo sustituye.
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 const zone=E165_ZONES.find(z=>z.id===btn.dataset.e165Zone);
 if(!zone||e16FishLevel()<zone.req)return;
 const same=e165Zone().id===zone.id;
 if(!same){e161Fishing=false;e161StopWait();state.ui=state.ui||{};state.ui.fishingZoneId=zone.id;persist();}
 e16Result='';e173ZoneChanged=true;e173SpeciesOpen=false;
 if(e161Rod()&&e161CanFish()){
  e161Fishing=true;
  e161NextBite();
  toast((same?'🎣 Pescando en ':'🌊 Entraste a ')+zone.name+' · Esperando una picada');
 }else{
  e161Fishing=false;e16Page();
  toast('Zona: '+zone.name+'. Detené el combate o descanso para poder pescar.');
 }
},true);
