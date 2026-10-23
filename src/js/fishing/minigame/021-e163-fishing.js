
"use strict";
/* E1.6.4: corrige geometría, añade peces especiales y simplifica inventario. */
/* @include src/catalogs/021-e163-fishing-e16_fish-additions-1.js */
Object.assign(E161_DIFFICULTY,{carpa_dorada:1.26,trucha_arcoiris:1.55,pez_fantasma:1.95});
// Pesca aleatoria: los especiales pueden picar con caña básica cuando cumplen nivel y caña.
e161RandomFish=function(){
 const lvl=e16FishLevel(),rod=e161RodIndex();
 const eligible=E16_FISH.filter(f=>lvl>=f.req&&rod>=Math.max(0,Math.floor((f.req-1)/10)));
 const weights=eligible.map(f=>f.rarity?f.rarity:Math.max(.12,1/Math.pow(1+(lvl-f.req)/4,.4)/Math.pow(E161_DIFFICULTY[f.id]||1,2.3)));
 let n=Math.random()*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<eligible.length;i++){n-=weights[i];if(n<=0)return eligible[i];}
 return eligible[0]||E16_FISH[0];
};
// Evita que la barra y el pez queden fuera del recorrido visible.
const e163Paint=e16Paint;
e16Paint=function(){
 if(fishingRenderDepth)return; // Track geometry is valid after the full page is assembled.
 if(e16Session){const track=document.getElementById('e16Tank');if(track){const width=e190TrackWidth();e16Session.pos=Math.min(Math.max(0,e16Session.pos),Math.max(0,width-e16Session.fish.zone-4));e16Session.target=Math.min(Math.max(3,e16Session.target),width-30);}}
 e163Paint();
};
// El nivel se actualiza en la barra junto al minijuego, y no solo en el panel inferior.
const e163Finish=e16Finish;
e16Finish=function(won){e163Finish(won);if(won&&state){const el=document.getElementById('e163XpText');if(el)el.setAttribute('aria-live','polite');}};
// Reordena inventario: primero oro y valor vendible, después los listados con sus botones.
function e163Inventory(){
 const page=document.getElementById('page_inventory');if(!page||!state)return;
 const inv=state.inventory||{};
 let total=0,units=0;
 for(const [id,qty] of Object.entries(inv)){
  if(!Number.isSafeInteger(qty)||qty<=0)continue;
  const fish=E16_FISH.find(f=>'pez_'+f.id===id);
  const price=fish?.price??E15_PRICES[id];
  if(Number.isFinite(price)){total+=qty*price;units+=qty;}
 }
 let summary=document.getElementById('e163InvSummary');
 if(!summary){summary=document.createElement('div');summary.id='e163InvSummary';summary.className='e163InvSummary';}
 summary.innerHTML='<b>🎒 Inventario y ventas</b><div style="margin-top:5px">Oro disponible: <strong>'+fmt(state.gold)+'</strong> · Valor total vendible: <strong>'+fmt(total)+'</strong> oro · '+fmt(units)+' unidades</div><small class="muted">El valor total es estimado: recibís el oro cuando vendés los objetos.</small>';
 page.prepend(summary);
 const mats=document.getElementById('e15Merchant'),fish=document.getElementById('e16FishMerchant');
 if(mats)summary.after(mats);
 if(fish)(mats||summary).after(fish);
}
const e163Merchant=e15MerchantPanel;
e15MerchantPanel=function(){e163Merchant();e163Inventory();};
const e163FishMerchant=e16FishMerchant;
e16FishMerchant=function(){e163FishMerchant();e163Inventory();};
const e163Render=renderGame;
renderGame=function(){e163Render();e163Inventory();};
