
"use strict";
/* E1.8.6: descubrimientos por zona + especialización en trofeos de cañas.
   Usa exclusivamente el registro opcional existente state.ui.e18Fishing. */
let e186BookOpen=false;
function e186LuckPercent(){
 if(!state)return 0;
 const id=e161Rod()?.id||'';
 const rodLuck={e16_rod:0,e161_rod_bamboo:3,e161_rod_fiber:6,e161_rod_steel:12,e17_rod_viejo:4,e171_rod_rio:8,e171_rod_costa:13,e18_rod_trofeo:16};
 const base=Object.prototype.hasOwnProperty.call(rodLuck,id)?rodLuck[id]:id.includes('brumas')?13:id.includes('guard')?8:4;
 return Math.min(30,base+Math.floor((e16FishLevel()-1)/10));
}
/* Conserva exactamente la distribución original con caña básica a nivel 1.
   Aumenta moderadamente la frecuencia de calidad grande, enorme y legendaria
   con cañas avanzadas y nivel. La categoría se muestrea una vez por intento y modula los movimientos. */
function e186QualityRoll(){
 const boost=1+e186LuckPercent()/100;
 const roll=Math.random();
 if(roll<.018*boost)return .009;
 if(roll<.115*boost)return .06;
 if(roll<.34*boost)return .20;
 return .8;
}


// Cambiar de zona cierra la colección, mostrando el nuevo conjunto de especies.
document.addEventListener('click',e=>{if(e.target.closest('[data-e165-zone]'))e186BookOpen=false;},true);
