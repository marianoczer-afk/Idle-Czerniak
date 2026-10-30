
"use strict";
/* E1.8.7: contenido de pesca de nivel 22 a 50, recompensas pasivas y diario por especie.
   Guardado aditivo en state.ui.e187Rewards. No modifica schema ni motor del minijuego. */
const E187_FISH=[
 {id:'perca_esmeralda',name:'Perca esmeralda',req:22,price:165,xp:190,speed:.54,wiggle:.44,zone:64,icon:'🐟'},
 {id:'cangrejo_azul',name:'Cangrejo azul',req:22,price:185,xp:200,speed:.47,wiggle:.56,zone:64,icon:'🦀'},
 {id:'koi_imperial',name:'Koi imperial',req:25,price:340,xp:340,speed:.64,wiggle:.50,zone:59,icon:'🐠',rarity:.045},
 {id:'esturion',name:'Esturión antiguo',req:28,price:570,xp:480,speed:.73,wiggle:.56,zone:56,icon:'🐟',rarity:.025},
 {id:'pez_luna',name:'Pez luna',req:32,price:290,xp:280,speed:.59,wiggle:.45,zone:63,icon:'🐡'},
 {id:'caballito_mar',name:'Caballito de mar',req:33,price:390,xp:330,speed:.60,wiggle:.50,zone:60,icon:'🐠'},
 {id:'morena',name:'Morena oscura',req:35,price:520,xp:420,speed:.71,wiggle:.60,zone:56,icon:'🐍'},
 {id:'tiburon_arrecife',name:'Tiburón de arrecife',req:38,price:950,xp:680,speed:.79,wiggle:.67,zone:52,icon:'🦈',rarity:.025},
 {id:'pez_linternilla',name:'Pez linternilla',req:43,price:610,xp:510,speed:.69,wiggle:.55,zone:58,icon:'✨'},
 {id:'calamar_abismo',name:'Calamar abisal',req:45,price:830,xp:680,speed:.77,wiggle:.64,zone:53,icon:'🦑'},
 {id:'pez_cristal',name:'Pez de cristal',req:47,price:1250,xp:860,speed:.82,wiggle:.69,zone:51,icon:'💎',rarity:.02},
 {id:'leviatan',name:'Cría de leviatán',req:50,price:2600,xp:1400,speed:.90,wiggle:.75,zone:48,icon:'🐉',rarity:.009}
];
for(const f of E187_FISH){if(!E16_FISH.some(x=>x.id===f.id))E16_FISH.push(f);}
Object.assign(E161_DIFFICULTY,{perca_esmeralda:1.38,cangrejo_azul:1.42,koi_imperial:1.65,esturion:1.85,pez_luna:1.55,caballito_mar:1.65,morena:1.85,tiburon_arrecife:2.08,pez_linternilla:1.80,calamar_abismo:2.05,pez_cristal:2.22,leviatan:2.5});
const E187_ZONES=[
 {id:'laguna',name:'Laguna Esmeralda',req:22,icon:'🍃',desc:'Peces ornamentales y especies ocultas entre las plantas.',fish:['trucha_arcoiris','perca_esmeralda','cangrejo_azul','koi_imperial','esturion']},
 {id:'arrecife',name:'Arrecife de Coral',req:32,icon:'🪸',desc:'Aguas cálidas con peces coloridos y depredadores de arrecife.',fish:['lubina','pez_luna','caballito_mar','morena','tiburon_arrecife']},
 {id:'abismo',name:'Fosa de las Sombras',req:43,icon:'🌌',desc:'Aguas profundas. Las capturas más raras son un desafío para expertos.',fish:['mantarraya','pez_linternilla','calamar_abismo','pez_cristal','leviatan']}
];
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
const E187_QUESTS=[
 {id:'laguna',zone:'laguna',req:22,title:'El naturalista de la laguna',needs:[{id:'perca_esmeralda',qty:4},{id:'cangrejo_azul',qty:3}],reward:'Instinto de pescador: +5% a la XP de pesca para siempre',kind:'xp'},
 {id:'arrecife',zone:'arrecife',req:32,title:'El secreto del arrecife',needs:[{id:'pez_luna',qty:4},{id:'caballito_mar',qty:3}],reward:'Caña Coralina: +11,5% de barra de control y picadas 16% más rápidas',kind:'rod'},
 {id:'abismo',zone:'abismo',req:43,title:'La mirada del abismo',needs:[{id:'pez_linternilla',qty:4},{id:'calamar_abismo',qty:2}],reward:'Pulso del abismo: +8 px de control permanente',kind:'control'}
];
const E187_ROD={id:'e187_rod_coral',name:'Caña Coralina',req:32,bonus:46,desc:'Control +11,5% de barra · picadas 16% más rápidas · hasta 550 kg'};
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
