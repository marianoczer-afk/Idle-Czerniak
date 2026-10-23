
"use strict";
/* E1.8.5: mejoras visuales y económicas; las capturas anteriores permanecen sin cambios. */
const E185_QUALITY={large:{name:'Grande',mult:2},huge:{name:'Enorme',mult:5},legendary:{name:'Legendario',mult:12}};
const E185_THEMES={
 muelle:{accent:'#6bc6e2',deep:'#113b52',shallow:'#2c758a',zone:'rgba(61,204,124,.36)',edge:'#87efa7',glow:'rgba(61,204,124,.3)',name:'Aguas del muelle'},
 rio:{accent:'#77cf91',deep:'#153c32',shallow:'#377a59',zone:'rgba(112,211,125,.36)',edge:'#b6f1a1',glow:'rgba(112,211,125,.3)',name:'Corriente del bosque'},
 costa:{accent:'#bda1e8',deep:'#262d59',shallow:'#45638d',zone:'rgba(170,132,239,.37)',edge:'#ddbdff',glow:'rgba(170,132,239,.34)',name:'Mareas de las Brumas'}
};
function e185PremiumData(id){const m=/^pez_(.+)__(large|huge|legendary)$/.exec(id);if(!m)return null;const f=E16_FISH.find(f=>f.id===m[1]);return f?{fish:f,quality:m[2],...E185_QUALITY[m[2]]}:null;}
const e185PriorFinish=e16Finish;
e16Finish=function(won){
 const fish=won?e16Session?.fish:null;
 e185PriorFinish(won);
 if(!fish||!state)return;
 const label=e183LastQuality?.fish===fish.name?e183LastQuality.label:'';
 const quality=label.includes('LEGENDARIO')?'legendary':label.includes('ENORME')?'huge':label.includes('Grande')?'large':null;
 const data=quality?E185_QUALITY[quality]:null;
 if(data){
  const base='pez_'+fish.id,variant=base+'__'+quality;
  if((state.inventory?.[base]||0)>0){state.inventory[base]--;if(!state.inventory[base])delete state.inventory[base];state.inventory[variant]=(state.inventory[variant]||0)+1;}
  if(e182LastCatch&&e182LastCatch.name===fish.name){e182LastCatch.price=fish.price*data.mult;e182LastCatch.quality=data.name;}
  e16Result='🎉 '+fish.name+' '+data.name+' · '+(e182LastCatch?.xp||0)+' XP · '+(fish.price*data.mult)+' oro al vender';
  persist();updateInv();
 }
 e16Page();
};
const e185PriorPage=e16Page;
e16Page=function(){
 e185PriorPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const zone=e165Zone(),theme=E185_THEMES[zone.id]||E185_THEMES.muelle,rod=e161Rod(),lvl=e16FishLevel();
 const dock=page.querySelector('.e162Dock');if(!dock)return;
 dock.style.setProperty('--e185-accent',theme.accent);dock.style.setProperty('--e185-deep',theme.deep);dock.style.setProperty('--e185-shallow',theme.shallow);dock.style.setProperty('--e185-zone',theme.zone);dock.style.setProperty('--e185-zone-edge',theme.edge);dock.style.setProperty('--e185-glow',theme.glow);
 dock.style.setProperty('--e185-water',zone.id==='costa'?'rgba(89,65,135,.23)':zone.id==='rio'?'rgba(36,101,59,.2)':'rgba(20,77,98,.22)');
 const current=dock.querySelector('.e185Summary');if(current)current.remove();
 const bonus=Math.min(22,Math.floor((lvl-1)/3)*2);
 const base=rod?.bonus||0;
 const st=E164_ROD_STATS[E161_RODS.findIndex(r=>r.id===rod?.id)];
 const stats=document.createElement('div');stats.className='e185Summary';
 const entries=[['🌊',theme.name],['🎣',rod?.name||'Sin caña'],['📈','Nivel +'+bonus+' px'],['🎯','Caña +'+base+' px']];
 if(st?.wait)entries.push(['⏱','Picada −'+st.wait+'%']);
 if(st?.rare)entries.push(['✨','Raros +'+st.rare+'%']);
 for(const [emoji,value] of entries){const item=document.createElement('span');item.textContent=emoji+' '+value;stats.append(item);}
 const action=dock.querySelector('.e183Actions');if(action)action.after(stats);else dock.prepend(stats);
 const result=dock.querySelector('.e182Result');
 if(result&&!result.hidden&&e182LastCatch?.quality){
  const text=result.querySelector('b');if(text)text.textContent='🏆 ¡Capturaste '+e182LastCatch.name+' · '+e182LastCatch.quality+'!';
  const values=result.querySelector('span');if(values)values.textContent=' · +'+fmt(e182LastCatch.xp)+' XP de Pesca · '+fmt(e182LastCatch.price)+' oro al vender';
 }
};
/* Los peces especiales ocupan entradas propias: no se mezclan con ejemplares normales al vender. */
function e185Inventory(){
 const page=document.getElementById('page_inventory');if(!page||!state)return;
 let panel=page.querySelector('#e185PremiumInventory');if(panel)panel.remove();
 const rows=Object.entries(state.inventory||{}).map(([id,n])=>({id,n,data:e185PremiumData(id)})).filter(x=>x.data&&Number.isSafeInteger(x.n)&&x.n>0);
 if(!rows.length)return;
 panel=document.createElement('section');panel.id='e185PremiumInventory';panel.className='e185Premium';
 const title=document.createElement('b');title.textContent='🏆 Capturas especiales';panel.append(title);
 const note=document.createElement('div');note.className='fishMuted';note.textContent='Grandes ×2 · Enormes ×5 · Legendarios ×12 de valor. El oro se recibe al vender.';panel.append(note);
 for(const {id,n,data} of rows){
  const row=document.createElement('div');row.className='e185PremiumRow';
  const info=document.createElement('div');const price=data.fish.price*data.mult;
  info.textContent=data.fish.icon+' '+data.fish.name+' · '+data.name+' ×'+n+' — '+fmt(price)+' oro/unidad';row.append(info);
  const controls=document.createElement('div');for(const [label,qty] of [['Vender 1','1'],['Vender todos','all']]){const btn=document.createElement('button');btn.className='small';btn.textContent=label;btn.dataset.e185Sell=id;btn.dataset.e185Qty=qty;controls.append(btn);}row.append(controls);panel.append(row);
 }
 const inventory=page.querySelector('#e164Inventory');if(inventory)inventory.after(panel);else page.prepend(panel);
}
const e185PriorRender=renderGame;
renderGame=function(){e185PriorRender();e185Inventory();};
const e185PriorInventory=e164Inventory;
e164Inventory=function(){e185PriorInventory();e185Inventory();};
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e185-sell]');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked())return;
 const id=btn.dataset.e185Sell,data=e185PremiumData(id);if(!data)return;
 const owned=state.inventory[id]||0,qty=btn.dataset.e185Qty==='all'?owned:1,price=data.fish.price*data.mult;
 if(!Number.isSafeInteger(owned)||qty<1||qty>owned||!Number.isSafeInteger(state.gold+qty*price))return;
 state.inventory[id]-=qty;if(!state.inventory[id])delete state.inventory[id];state.gold+=qty*price;
 addLog('Vendiste '+qty+' × '+data.fish.name+' '+data.name+' por '+fmt(qty*price)+' oro.');persist();renderGame();toast('Venta: +'+fmt(qty*price)+' oro');
},true);
