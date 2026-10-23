
"use strict";
/* Estrellas: orientación visual, no probabilidades ni potencia adicional. */
function e193RodScore(r){
 // Valoración orientativa fija del equipo, sin incluir el nivel de Pesca del personaje.
 const st=e1101Stats(r),trophy=E1103_SPECIAL[r.id]?.trophy??Math.max(0,st.trophy-Math.floor((e16FishLevel()-1)/10));
 const score=.30*st.control/64+.25*st.resilience/45+.15*st.speed/40+.10*st.luck/43+.10*trophy/45+.10*Math.log1p(e190Capacity(r))/Math.log1p(3000);
 return clamp(Math.round(1+9*score),1,10);
}
const e193PreviousPage=e16Page;
e16Page=function(){
 e193PreviousPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const panel=page.querySelector('details:has(.fishRod)');if(!panel)return;
 panel.querySelectorAll('.fishRod').forEach(row=>{
  const name=row.querySelector('b')?.textContent?.replace(/^✓\s*/, '').trim();
  const rod=E161_RODS.find(r=>r.name===name);
  if(!rod)return;
  row.classList.add('e193Rod');
  const muted=row.querySelector('.fishMuted');
  if(muted)muted.textContent=(muted.textContent||'').replace(/Sin nivel mínimo\s*·?\s*/gi,'').replace(/\s*·\s*[\d.,]+\s*oro\s*$/i,'');
  row.querySelectorAll('.e164RodStat').forEach(el=>{el.textContent=(el.textContent||'').replace(/Sin nivel mínimo\s*·?\s*/gi,'');});
  const info=row.querySelector('div');if(!info)return;
  const score=e193RodScore(rod);
  const badge=document.createElement('div');badge.className='e193RodBadge';
  badge.innerHTML='<span class="e193Stars" title="Valoración orientativa de estadísticas">'+('★'.repeat(score))+'<span style="opacity:.22">'+('☆'.repeat(10-score))+'</span></span><span class="e193Tier">'+score+'/10 · Valoración general</span>';
  info.append(badge);
  const art=document.createElement('div');art.className='e193RodImage';art.innerHTML=e189RodSVG(rod.id);info.append(art);
  const buy=row.querySelector('[data-e161-buy]');
  if(buy){
   const controls=document.createElement('div');controls.className='e193Buy';
   const price=document.createElement('span');price.className='e193Price';price.textContent='🪙 '+fmt(rod.price)+' oro';
   controls.append(price);buy.textContent='Comprar';controls.append(buy);row.append(controls);
  }
 });
};
/* Inventario único: objetos y todos los grados de peces; orden personalizable. */
function e193InvRows(){
 const inv=state?.inventory||{};
 return Object.entries(inv).filter(([id,n])=>Number.isSafeInteger(n)&&n>0&&(Object.hasOwn(E15_PRICES,id)||E16_FISH.some(f=>'pez_'+f.id===id)||!!e185PremiumData(id)));
}
function e193Inventory(){
 const page=document.getElementById('page_inventory');if(!page||!state)return;
 let panel=page.querySelector('#e164Inventory');if(!panel){panel=document.createElement('section');panel.id='e164Inventory';panel.className='panel';page.prepend(panel);}
 // These panels were superseded by the unified seller; do not rebuild their hidden lists.
 page.querySelectorAll('#e15Merchant,#e16FishMerchant,#e163InvSummary,#e185PremiumInventory').forEach(n=>n.remove());
 const renderKey=JSON.stringify([state.gold,state.inventory,state.ui?.e193InventoryOrder]);
 if(panel.__inventoryState===state&&panel.__inventoryKey===renderKey)return;
 panel.__inventoryState=state;panel.__inventoryKey=renderKey;
 const order=Array.isArray(state.ui?.e193InventoryOrder)?state.ui.e193InventoryOrder:[];
 const rows=e193InvRows().sort((a,b)=>{
  const ia=order.indexOf(a[0]),ib=order.indexOf(b[0]);
  return (ia<0?100000:ia)-(ib<0?100000:ib);
 });
 const entries=rows.map(([id,qty])=>{
  const premium=e185PremiumData(id),fish=premium?.fish||E16_FISH.find(f=>'pez_'+f.id===id);
  const price=premium?fish.price*premium.mult:(fish?.price??E15_PRICES[id]);
  return {id,qty,fish,premium,price};
 });
 const total=entries.reduce((sum,x)=>sum+x.qty*x.price,0);
 const fishTotal=entries.filter(x=>x.fish).reduce((sum,x)=>sum+x.qty*x.price,0);
 const fishUnits=entries.filter(x=>x.fish).reduce((sum,x)=>sum+x.qty,0);
 const escAttr=v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
 panel.innerHTML='<div class="e193InvHead"><h3 style="margin:0">🎒 Tus objetos</h3><span class="muted">Ordená con ↑ ↓</span></div>'+
 '<div class="muted" style="margin-bottom:10px">🪙 Oro disponible: <b>'+fmt(state.gold)+'</b> · Valor total vendible: <b>'+fmt(total)+'</b> oro<br>🐟 Peces: <b>'+fmt(fishUnits)+'</b> · Valor acumulado: <b>'+fmt(fishTotal)+'</b> oro</div>'+
 (entries.length?entries.map((x,i)=>{
  const {id,qty,fish,premium,price}=x,quality=premium?'<span class="e193Quality '+premium.quality+'">★ '+premium.name+'</span>':'';
  const name=fish?(fish.icon+' '+fish.name):itemNameOf(id);
  const attrs=premium?'data-e185-sell="'+escAttr(id)+'"':fish?'data-e16-sell="'+escAttr(fish.id)+'"':'data-e15-sell="'+escAttr(id)+'"';
  const qtyAttr=premium?'data-e185-qty':fish?'data-e16-qty':'data-e15-qty';
  return '<div class="e164Item"><div><b>'+esc(name)+'</b>'+quality+' <span class="muted">×'+fmt(qty)+'</span><div class="muted" style="font-size:.8rem">🪙 '+fmt(price)+' c/u · Total: <b>'+fmt(qty*price)+' oro</b></div></div>'+
  '<div class="e164Buttons"><button class="small" '+attrs+' '+qtyAttr+'="1">Vender 1</button><button class="small" '+attrs+' '+qtyAttr+'="all">Vender todos</button></div>'+
  '<div class="e193Move"><button class="small" data-e193-move="up" data-e193-id="'+escAttr(id)+'" '+(i===0?'disabled':'')+' title="Subir">↑</button><button class="small" data-e193-move="down" data-e193-id="'+escAttr(id)+'" '+(i===entries.length-1?'disabled':'')+' title="Bajar">↓</button></div></div>';
 }).join(''):'<p class="muted">Todavía no tenés objetos ni peces para vender.</p>');
 page.querySelector('#e185PremiumInventory')?.remove();
}
const e193PriorRender=renderGame;
renderGame=function(){e193PriorRender();e193Inventory();};
// All current sale buttons delegate to the existing sale handlers; only presentation is unified.
e164Inventory=e193Inventory;
e15MerchantPanel=e193Inventory;
e16FishMerchant=e193Inventory;
updateInv=function(){e15OldUpdateInv();e193Inventory();};
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e193-move]');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked())return;
 const ids=e193InvRows().map(x=>x[0]);
 const saved=Array.isArray(state.ui?.e193InventoryOrder)?state.ui.e193InventoryOrder:[];
 const ordered=ids.sort((a,b)=>{const ia=saved.indexOf(a),ib=saved.indexOf(b);return (ia<0?100000:ia)-(ib<0?100000:ib);});
 const i=ordered.indexOf(btn.dataset.e193Id),j=i+(btn.dataset.e193Move==='up'?-1:1);
 if(i<0||j<0||j>=ordered.length)return;
 [ordered[i],ordered[j]]=[ordered[j],ordered[i]];
 state.ui=state.ui||{};state.ui.e193InventoryOrder=ordered;
 persist();e193Inventory();
},true);
