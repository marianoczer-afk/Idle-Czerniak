
"use strict";
/* E1.5: mercader de materiales. No añade campos al guardado v7 ni cambia las recompensas. */
const E15_PRICES=Object.freeze(Object.fromEntries(ENEMIES.map(en=>[
  en.drop.itemId, Math.max(3,Math.round((6+en.level*1.65)*(en.boss?2:1)))
])));
function e15MerchantPanel(){
 const page=document.getElementById('page_inventory');
 if(!page||!state)return;
 let panel=document.getElementById('e15Merchant');
 if(!panel){
   panel=document.createElement('section');panel.id='e15Merchant';panel.className='panel e15Merchant';
   panel.style.cssText='margin-top:12px;padding:14px;border:1px solid #80632f;border-radius:9px';
   page.append(panel);
 }
 const inv=state.inventory||{};
 const rows=Object.keys(inv).filter(id=>Number.isSafeInteger(inv[id])&&inv[id]>0&&Object.hasOwn(E15_PRICES,id));
 const total=rows.reduce((n,id)=>n+inv[id]*E15_PRICES[id],0);
 panel.innerHTML=`<h3 style="margin:0 0 8px">⚖ Mercader de recursos</h3>
 <p class="muted" style="margin:0 0 12px">Vendé materiales de enemigos para comprar tu primer equipo. Los materiales podrían servir para fabricar objetos en futuras versiones; guardá los que quieras conservar.</p>
 <div class="muted" style="margin-bottom:8px">Tu oro: <b>${fmt(state.gold)}</b> · Valor de los materiales: <b>${fmt(total)}</b> oro</div>
 ${rows.length?rows.map(id=>{
 const count=inv[id],price=E15_PRICES[id];
 return `<div class="shopRow" style="flex-wrap:wrap"><div><b>${esc(itemNameOf(id))}</b><br><small class="muted">Tenés ${fmt(count)} · ${fmt(price)} oro por unidad</small></div>
 <div style="display:flex;gap:5px;flex-wrap:wrap"><button type="button" class="small" data-e15-sell="${esc(id)}" data-e15-qty="1">Vender 1</button><button type="button" class="small" data-e15-sell="${esc(id)}" data-e15-qty="all">Vender todo (+${fmt(count*price)})</button></div></div>`;
 }).join(''):'<p class="muted">Todavía no tenés materiales para vender. Los enemigos pueden soltarlos al derrotarlos.</p>'}
 <small class="muted">Los precios son fijos por tipo de material. Vender no otorga XP ni consume tiempo de combate.</small>`;
}
const e15OldRenderGame=renderGame;
renderGame=function(){e15OldRenderGame();e15MerchantPanel();};
const e15OldUpdateInv=updateInv;
updateInv=function(){e15OldUpdateInv();if(document.getElementById('e15Merchant'))e15MerchantPanel();};
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e15-sell]');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||btn.disabled)return;
 if(typeof simulationLocked==='function'&&simulationLocked()){toast('Terminá la simulación antes de vender.');return;}
 syncRuntime();if(busy)return;
 const id=btn.dataset.e15Sell;
 if(!Object.hasOwn(E15_PRICES,id))return;
 const owned=state.inventory?.[id]||0;
 const qty=btn.dataset.e15Qty==='all'?owned:1;
 if(!Number.isSafeInteger(owned)||!Number.isSafeInteger(qty)||qty<1||qty>owned)return;
 const reward=qty*E15_PRICES[id];
 if(!Number.isSafeInteger(reward)||!Number.isSafeInteger(state.gold+reward))return toast('No se puede completar la venta.');
 state.inventory[id]=owned-qty;
 if(!state.inventory[id])delete state.inventory[id];
 state.gold+=reward;
 addLog('Vendiste '+qty+' × '+itemNameOf(id)+' por '+fmt(reward)+' oro.');
 persist();renderGame();toast('Venta realizada: +'+fmt(reward)+' oro.');
},true);
