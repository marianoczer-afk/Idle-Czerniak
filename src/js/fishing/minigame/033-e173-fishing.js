
"use strict";
/* E1.8: solo presentación y estabilidad de Pesca; guardados v7 intactos. */
let e173ZoneChanged=false;
let e173SpeciesOpen=false;
const e173PreviousPage=e16Page;
e16Page=function(){
 const pageBefore=document.getElementById('page_fishing');
 const oldDetails=pageBefore?.querySelector('.e173Species');
 if(oldDetails)e173SpeciesOpen=oldDetails.open;
 e173PreviousPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const dock=page.querySelector('.e162Dock');if(!dock)return;
 const z=e165Zone(),lvl=e16FishLevel();
 const waiting=dock.querySelector('#e161WaitingText');
 const catchBox=dock.querySelector('.fishCatch');
 if(e173ZoneChanged){
  if(catchBox)catchBox.remove();
  e173ZoneChanged=false;
 }
 // Mientras espera una nueva picada, un resultado viejo no puede confundirse con el estado actual.
 if(e161Fishing&&!e16Session){
  if(waiting){waiting.style.display='block';waiting.classList.add('e173Waiting');waiting.textContent='🎣 Pescando en '+z.name+' · Esperando una picada… '+Math.max(0,Math.ceil((e161CatchAt-Date.now())/1000))+' s';}
  if(catchBox)catchBox.remove();
 }
 // Listado compacto y contextual: únicamente peces presentes en la zona seleccionada.
 const list=E16_FISH.filter(f=>z.fish.includes(f.id));
 const details=document.createElement('details');details.className='e173Species';details.open=e173SpeciesOpen;
 const count=list.filter(f=>lvl>=f.req).length;
 details.innerHTML='<summary>🐠 Peces de esta zona · '+count+'/'+list.length+' disponibles</summary><div class="e173SpeciesGrid">'+list.map(f=>'<div class="e173Fish '+(lvl<f.req?'locked':'')+'"><b>'+f.icon+' '+f.name+'</b><small>'+(lvl>=f.req?'✓ Disponible':'🔒 Pesca '+f.req)+' · '+fmt(f.price)+' oro · '+fmt(f.xp)+' XP</small></div>').join('')+'</div>';
 const info=dock.querySelector('.e165ZoneInfo');if(info)info.after(details);
 // Quitar el listado duplicado: queda un único catálogo compacto junto al muelle.
 const oldSpecies=page.querySelector('.fishSpecies');
 if(oldSpecies){const oldPanel=oldSpecies.closest('details');if(oldPanel)oldPanel.remove();}
 /* no programmatic scrolling */
};
// Reiniciar inmediatamente el estado visual al cambiar de zona, sin mensajes de la anterior.
// El listener existente E1.7.2 maneja el cambio y la espera; aquí limpiamos el mensaje ANTES.
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e165-zone]');if(!btn||!state||e16Session)return;
 const z=E165_ZONES.find(x=>x.id===btn.dataset.e165Zone);
 if(!z||e16FishLevel()<z.req)return;
 e16Result='';e173ZoneChanged=true;e173SpeciesOpen=false;
},true);
// Un resultado de captura no debe quedarse en la zona de espera siguiente.
const e173PriorNextBite=e161NextBite;
e161NextBite=function(){
 if(e161Fishing&&!e16Session)e16Result='';
 e173PriorNextBite();
};
