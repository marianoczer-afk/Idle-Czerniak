
"use strict";
/* E1.8.7: contenido de pesca de nivel 22 a 50, recompensas pasivas y diario por especie.
   Guardado aditivo en state.ui.e187Rewards. No modifica schema ni motor del minijuego. */
/* @include src/catalogs/047-e187-expansion-e187_fish.js */
for(const f of E187_FISH){if(!E16_FISH.some(x=>x.id===f.id))E16_FISH.push(f);}
Object.assign(E161_DIFFICULTY,{perca_esmeralda:1.38,cangrejo_azul:1.42,koi_imperial:1.65,esturion:1.85,pez_luna:1.55,caballito_mar:1.65,morena:1.85,tiburon_arrecife:2.08,pez_linternilla:1.80,calamar_abismo:2.05,pez_cristal:2.22,leviatan:2.5});
/* @include src/catalogs/047-e187-expansion-e187_zones.js */
for(const z of E187_ZONES){if(!E165_ZONES.some(x=>x.id===z.id))E165_ZONES.push(z);}
/* La bonificación de rareza debe respetar SIEMPRE la zona elegida. */
e161RandomFish=function(){
 const z=e165Zone(),lvl=e16FishLevel(),idx=e164SelectedRodIndex(),rod=e161RodIndex();
 const pool=E16_FISH.filter(f=>z.fish.includes(f.id)&&lvl>=f.req&&rod>=Math.min(3,Math.max(0,Math.floor((f.req-1)/10))));
 if(!pool.length)return E16_FISH[0];
 const rare=(E164_ROD_STATS[idx]?.rare||0)/100;
 const weights=pool.map(f=>f.rarity?f.rarity*(1+rare*5):Math.max(.12,1/Math.pow(1+(lvl-f.req)/4,.4)/Math.pow(E161_DIFFICULTY[f.id]||1,2.3)));
 let roll=Math.random()*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<=0)return pool[i];}
 return pool[pool.length-1];
};
/* @include src/catalogs/047-e187-expansion-e187_quests.js */
/* @include src/catalogs/047-e187-expansion-e187_rod.js */
function e187Rewards(){if(!state)return {};state.ui=state.ui||{};return state.ui.e187Rewards||(state.ui.e187Rewards={});}
function e187QuestDone(q){return !!e187Rewards()[q.id]||(q.kind==='rod'&&!!state?.owned?.[E187_ROD.id]);}
const e187PreviousRod=e161Rod;
e161Rod=function(){return state?.owned?.[E187_ROD.id]&&state?.ui?.fishingRodId===E187_ROD.id?E187_ROD:e187PreviousRod();};
const e187PreviousFinish=e16Finish;
e16Finish=function(won){
 const before=won&&e16Session?e16FishSkill().xp:0;
 e187PreviousFinish(won);
 if(won&&e187Rewards().laguna&&state){
  const gained=Math.max(0,e16FishSkill().xp-before);
  const extra=Math.max(1,Math.round(gained*.05));
  const awarded=sklXp(state,'pesca',extra);
  if(e182LastCatch)e182LastCatch.xp+=awarded;
  persist();e16Page();
 }
};
const e187PreviousBite=e161NextBite;
e161NextBite=function(){
 e187PreviousBite();
 if(e161Fishing&&!e16Session&&e161Waiting!==null&&e161Rod()?.id===E187_ROD.id){
  const remaining=Math.max(1200,e161CatchAt-Date.now());clearTimeout(e161Waiting);
  const wait=Math.max(1200,Math.round(remaining*.84));e161CatchAt=Date.now()+wait;
  e161Waiting=setTimeout(()=>{e161Waiting=null;e161StopWait();if(!e161Fishing||!e161OnPage()||!e161CanFish())return;const f=e161RandomFish();e16Start(f.id);},wait);
 }
};
let e187JournalOpen=false;


document.addEventListener('click',e=>{
 const claim=e.target.closest('[data-e187-claim]'),equip=e.target.closest('[data-e187-equip]');if(!claim&&!equip)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 if(claim){const q=E187_QUESTS.find(x=>x.id===claim.dataset.e187Claim);if(!q||e187QuestDone(q)||e165Zone().id!==q.zone||e16FishLevel()<q.req)return;
  if(!q.needs.every(n=>(state.inventory?.['pez_'+n.id]||0)>=n.qty))return;
  for(const n of q.needs){const id='pez_'+n.id;state.inventory[id]-=n.qty;if(!state.inventory[id])delete state.inventory[id];}
  e187Rewards()[q.id]=true;if(q.kind==='rod'){state.owned=state.owned||{};state.owned[E187_ROD.id]=true;state.ui.fishingRodId=E187_ROD.id;}
  addLog('Pesca: completaste '+q.title+'. '+q.reward);persist();renderGame();toast('🏆 ¡Misión completada! '+q.reward);
 }else{
  if(!state.owned?.[E187_ROD.id])return;
  if(e161Fishing){e161Fishing=false;e161StopWait();}
  state.ui=state.ui||{};state.ui.fishingRodId=E187_ROD.id;persist();renderGame();toast('🎣 Caña Coralina equipada');
 }
},true);
