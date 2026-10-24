
"use strict";
/* El id de la caña en ui es la única fuente de verdad: nunca hay dos equipadas. */
function e172RodId(){
 const id=state?.ui?.fishingRodId;
 const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod)];
 const valid=all.find(r=>r.id===id && (state?.owned?.[r.id]||r.id===E17_ROD.id&&e17Done()));
 return valid?.id||e161Rod()?.id||null;
}


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
