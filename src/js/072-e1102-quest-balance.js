
"use strict";
/* Los premios de misión no están en E161_RODS. No tratarlos como cañas de
   estadística cero: usar sus bonificaciones existentes, sin cambiar capturas. */
const E1102_QUEST_VALUES={
 e17_rod_viejo:{wait:10,rare:0,resilience:7,trophy:4},
 e171_rod_rio:{wait:12,rare:0,resilience:9,trophy:8},
 e171_rod_costa:{wait:15,rare:0,resilience:12,trophy:13},
 e18_rod_trofeo:{wait:0,rare:0,resilience:10,trophy:16},
 e187_rod_coral:{wait:16,rare:0,resilience:16,trophy:4}
};
const e1102PreviousStats=e1101Stats;
e1101Stats=function(rod){
 const base=e1102PreviousStats(rod),id=rod?.id||'';
 const special=E1102_QUEST_VALUES[id];
 const baseTrophy={e16_rod:0,e161_rod_bamboo:3,e161_rod_fiber:6,e161_rod_steel:12};
 const trophy=Object.prototype.hasOwnProperty.call(baseTrophy,id)?baseTrophy[id]:
  special?.trophy??(id.includes('brumas')?13:id.includes('guard')?8:4);
 return {...base,speed:special?.wait??base.speed,luck:special?.rare??base.luck,
  resilience:special?.resilience??base.resilience,
  trophy:Math.min(30,trophy+(state?Math.floor((e16FishLevel()-1)/10):0))};
};
