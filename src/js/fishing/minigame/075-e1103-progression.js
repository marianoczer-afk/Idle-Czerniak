
"use strict";
/* Especializaciones de cañas con efectos reales; se conservan todos los IDs
   y el formato de guardado anterior. */
/* @include src/catalogs/075-e1103-progression-e1103_special.js */
const e1103PrevStats=e1101Stats;
e1101Stats=function(rod){
 const base=e1103PrevStats(rod),special=E1103_SPECIAL[rod?.id];
 if(!special)return base;
 const bonus=Math.floor((e16FishLevel()-1)/10);
 return {...base,speed:special.speed,luck:special.luck,resilience:special.resilience,maxKg:special.maxKg,
  trophy:Math.min(rod?.family?45:35,special.trophy+bonus)};
};
/* Distribución efectiva: pesos relativos, normalizados por zona y nivel.
   El factor 0.42 del atún ya existía en data-e1122-fishing-fixes; se conserva sin rebalancear. */
function e222SpeciesWeight(fish,level,luck){
 const legacy=E234_BY_ID.get(fish.id);if(legacy)fish=E16_FISH.find(f=>f.id===legacy.from);
 const base=fish.rarity?fish.rarity*(1+luck/20):Math.max(.12,1/Math.pow(1+(level-fish.req)/4,.4)/Math.pow(E161_DIFFICULTY[fish.id]||1,2.3));
 return base*(fish.id==='atun'?.42:1);
}
function e161FishDistribution(zone=e165Zone(),level=e16FishLevel(),luck=e1101Stats(e161Rod()).luck){
 const pool=E16_FISH.filter(f=>zone.fish.includes(f.id)&&level>=f.req&&e190CanLift(f));
 const entries=pool.map(fish=>{
  return {fish,weight:e222SpeciesWeight(fish,level,luck)};
 });
 const total=entries.reduce((sum,x)=>sum+x.weight,0);
 return entries.map(x=>({...x,probability:x.weight/total}));
}
e161RandomFish=function(random=Math.random){
 const entries=e161FishDistribution();
 if(!entries.length)return null;
 let roll=random()*entries.reduce((sum,x)=>sum+x.weight,0);
 for(const entry of entries){roll-=entry.weight;if(roll<=0)return entry.fish;}
 return entries[entries.length-1].fish;
};
/* Atracción: afecta el tiempo previo a los círculos y respeta la ventaja de
   las cañas que evitan las sacudidas. */
const e1103OldNext=e161NextBite;
e161NextBite=function(){
 e1103OldNext();
 if(!e161Fishing||!e161OnPage()||e16Session||e195Pending||e161Waiting===null)return;
 const rod=e161Rod(),id=String(rod?.id||'').toLowerCase();
 const speed=e1101Stats(rod).speed;
 const delay=Math.max(450,Math.round(900*(1-speed/100)));
 clearTimeout(e161Waiting);
 e161CatchAt=Date.now()+delay;
 e161Waiting=setTimeout(()=>{
  e161Waiting=null;e161StopWait();
  if(!e161Fishing||!e161OnPage()||!e161CanFish()||e16Session)return;
  const fish=e161RandomFish();
  if(fish)e16Start(fish.id);
 },delay);
};
/* Trofeos: usar la estadística mostrada en el cálculo de ejemplares especiales. */
e186LuckPercent=function(){
 if(!state)return 0;
 return e1101Stats(e161Rod()).trophy;
};
/* Mostrar rol y ventajas claras en la tienda. */
