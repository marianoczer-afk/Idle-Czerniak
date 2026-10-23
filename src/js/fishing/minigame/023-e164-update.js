
"use strict";
/* Conserva el formato de guardados v7: se agrega solo una preferencia opcional en ui. */
const E164_ROD_STATS=[
 {control:0,wait:0,rare:0,label:'Equilibrada para aprender'},
 {control:12,wait:0,rare:0,label:'Más control en cada captura'},
 {control:22,wait:12,rare:0,label:'Más control y picadas más rápidas'},
 {control:32,wait:18,rare:12,label:'Mayor control y oportunidad de peces raros'}
];
function e164SelectedRodIndex(){
 const best=e161RodIndex();if(best<0)return -1;
 const id=state?.ui?.fishingRodId;
 const idx=E161_RODS.findIndex(r=>r.id===id&&state.owned?.[r.id]);
 return idx>=0?idx:best;
}
e161Rod=function(){return E161_RODS[e164SelectedRodIndex()]||null;};
// Las cañas superiores tienen una identidad propia, no solamente una compra automática.
const e164NextBite=e161NextBite;
e161NextBite=function(){
 e164NextBite();
 if(e161Waiting!==null&&e161Fishing){
  const idx=e164SelectedRodIndex();const reduction=(E164_ROD_STATS[idx]?.wait||0)/100;
  if(reduction>0){const remaining=Math.max(1200,e161CatchAt-Date.now());
   clearTimeout(e161Waiting);e161CatchAt=Date.now()+Math.max(1200,Math.round(remaining*(1-reduction)));
   e161Waiting=setTimeout(()=>{e161Waiting=null;e161StopWait();if(!e161Fishing||!e161OnPage()||!e161CanFish())return;const f=e161RandomFish();e16Start(f.id);},Math.max(1200,e161CatchAt-Date.now()));
  }
 }
};
const e164RandomFish=e161RandomFish;
e161RandomFish=function(){
 const idx=e164SelectedRodIndex(),rare=(E164_ROD_STATS[idx]?.rare||0)/100;
 if(rare>0&&Math.random()<rare){
  const eligible=E16_FISH.filter(f=>f.rarity&&e16FishLevel()>=f.req&&e161RodIndex()>=Math.max(0,Math.floor((f.req-1)/10)));
  if(eligible.length)return eligible[Math.floor(Math.random()*eligible.length)];
 }
 return e164RandomFish();
};
function e164RenderRods(){
 const details=document.querySelector('#page_fishing details:has(.fishRod)');if(!details||!state)return;
 const selected=e164SelectedRodIndex(),best=e161RodIndex(),lvl=e16FishLevel();
 details.querySelectorAll('.fishRod').forEach((row,i)=>{
  const r=E161_RODS[i],st=E164_ROD_STATS[i];if(!r)return;
  row.classList.toggle('e164RodActive',i===selected);
  const info=row.querySelector('div');
  if(info&&!info.querySelector('.e164RodStat')){const el=document.createElement('div');el.className='e164RodStat';el.textContent='Control +'+e190ControlPercent(st.control)+'% de barra · Picada '+(st.wait?'−'+st.wait+'%':'normal')+' · Raros '+(st.rare?'+'+st.rare+'% oportunidad extra':'sin bonificación')+' · '+st.label;info.append(el);}
  if(state.owned?.[r.id]){
   const old=row.querySelector('span.fishMuted');if(old)old.remove();
   let button=row.querySelector('[data-e164-equip]');if(!button){button=document.createElement('button');button.className='small';button.dataset.e164Equip=String(i);row.append(button);}
   button.textContent=i===selected?'✓ Equipada':'Equipar';button.disabled=i===selected;
  }
 });
 const summary=details.querySelector('summary');if(summary)summary.innerHTML='<b>🎣 Cañas y estadísticas</b> · '+(e161Rod()?.name||'Sin caña');
}
function e164Inventory(){
 const page=document.getElementById('page_inventory');if(!page||!state)return;
 let panel=document.getElementById('e164Inventory');
 if(!panel){panel=document.createElement('section');panel.id='e164Inventory';panel.className='panel';}
 const inv=state.inventory||{};
 const rows=Object.entries(inv).filter(([id,n])=>Number.isSafeInteger(n)&&n>0&&(Object.hasOwn(E15_PRICES,id)||E16_FISH.some(f=>'pez_'+f.id===id)));
 const total=rows.reduce((v,[id,n])=>{const f=E16_FISH.find(f=>'pez_'+f.id===id);return v+n*(f?.price??E15_PRICES[id]);},0);
 panel.innerHTML='<h3>🎒 Tus objetos</h3><div class="muted" style="margin-bottom:6px">Oro: <b>'+fmt(state.gold)+'</b> · Valor total vendible: <b>'+fmt(total)+'</b> oro</div>'+
 (rows.length?rows.map(([id,n])=>{
  const f=E16_FISH.find(f=>'pez_'+f.id===id),price=f?.price??E15_PRICES[id],attrs=f?'data-e16-sell="'+f.id+'"':'data-e15-sell="'+esc(id)+'"';
  return '<div class="e164Item"><div><b>'+(f?f.icon+' ':'')+esc(itemNameOf(id))+'</b> <span class="muted">×'+fmt(n)+'</span><div class="muted" style="font-size:.8rem">'+fmt(price)+' oro/unidad · Total '+fmt(price*n)+'</div></div><div class="e164Buttons"><button class="small" '+attrs+' '+(f?'data-e16-qty':'data-e15-qty')+'="1">Vender 1</button><button class="small" '+attrs+' '+(f?'data-e16-qty':'data-e15-qty')+'="all">Vender todos</button></div></div>';
 }).join(''):'<p class="muted">Todavía no tenés materiales ni peces para vender.</p>');
 const summary=document.getElementById('e163InvSummary');if(summary)summary.replaceWith(panel);else page.prepend(panel);
}
const e164OldPage=e16Page;
e16Page=function(){e164OldPage();e164RenderRods();};
const e164OldRender=renderGame;
renderGame=function(){e164OldRender();e164Inventory();e164RenderRods();};
const e164OldUpdate=updateInv;
updateInv=function(){e164OldUpdate();e164Inventory();};
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e164-equip]');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 const i=Number(btn.dataset.e164Equip),r=E161_RODS[i];if(!r||!state.owned?.[r.id])return;
 state.ui=state.ui||{};state.ui.fishingRodId=r.id;
 persist();e16Page();toast('Caña equipada: '+r.name);
},true);
