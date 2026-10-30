
"use strict";
/* E1.8: solo presentación y estabilidad de Pesca; guardados v7 intactos. */
let e173ZoneChanged=false;
let e173SpeciesOpen=false;


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
