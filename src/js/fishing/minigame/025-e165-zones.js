
"use strict";
/* Zonas de pesca: datos y selección opcional en ui, sin alterar el formato v7. */
/* @include src/catalogs/025-e165-zones-e165_zones.js */
/* @include src/catalogs/025-e165-zones-e16_fish-additions-1.js */
Object.assign(E161_DIFFICULTY,{lucio:1.37,anguila:1.65,lubina:1.52,atun:1.85,mantarraya:2.15});
function e165Zone(){
 const id=state?.ui?.fishingZoneId;
 const z=E165_ZONES.find(z=>z.id===id);
 return z&&e16FishLevel()>=z.req?z:E165_ZONES[0];
}
/* Conserva la rareza y bonificaciones de cañas de E1.6.4, pero limita la selección a la zona. */
e161RandomFish=function(){
 const z=e165Zone(),lvl=e16FishLevel(),rod=e161RodIndex();
 const pool=E16_FISH.filter(f=>z.fish.includes(f.id)&&lvl>=f.req&&rod>=Math.max(0,Math.floor((f.req-1)/10)));
 if(!pool.length)return E16_FISH[0];
 const idx=e164SelectedRodIndex(),bonus=(E164_ROD_STATS[idx]?.rare||0)/100;
 const weights=pool.map(f=>{
  if(f.rarity)return f.rarity*(1+bonus*5);
  return Math.max(.12,1/Math.pow(1+(lvl-f.req)/4,.4)/Math.pow(E161_DIFFICULTY[f.id]||1,2.3));
 });
 let roll=Math.random()*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<=0)return pool[i];}
 return pool[pool.length-1];
};
const e165PreviousPage=e16Page;
e16Page=function(){
 e165PreviousPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const z=e165Zone(),lvl=e16FishLevel();
 const header=page.querySelector('.e162DockHead');
 if(header){
  const title=header.querySelector('h3');if(title)title.textContent=z.icon+' '+z.name;
  const zones=document.createElement('div');zones.className='e165Zones';
  zones.innerHTML=E165_ZONES.map(a=>`<button class="e165ZoneBtn ${a.id===z.id?'active':''}" data-e165-zone="${a.id}" ${lvl<a.req||!!e16Session?'disabled':''}>${a.icon} ${a.name}<small>${lvl<a.req?'🔒 Pesca nivel '+a.req:a.id===z.id?'✓ Zona actual':'Entrar a la zona'}</small></button>`).join('');
  header.after(zones);
  const info=document.createElement('div');info.className='e165ZoneInfo';
  const eligible=E16_FISH.filter(f=>z.fish.includes(f.id));
  info.textContent=z.desc+' · '+eligible.filter(f=>lvl>=f.req).length+' especies desbloqueadas de '+eligible.length+'.';
  zones.after(info);
 }
 /* Una sola barra de progreso visible, junto a la acción principal. */
 const panels=page.querySelectorAll('.fishPanel');
 for(const p of panels){if(p!==page.querySelector('.e162Dock')&&p.textContent.includes('Cada 3 niveles ganás +2 de zona'))p.remove();}
 const species=page.querySelector('.fishSpecies');
 if(species){species.innerHTML=E16_FISH.filter(f=>z.fish.includes(f.id)).map(f=>`<div class="${lvl<f.req?'fishLocked':''}">${f.icon} <b>${f.name}</b><div class="fishMuted">${lvl>=f.req?'Disponible':'🔒 Pesca '+f.req} · ${fmt(f.price)} oro al vender · ${fmt(f.xp)} XP</div></div>`).join('');}
};
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e165-zone]');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 const zone=E165_ZONES.find(z=>z.id===btn.dataset.e165Zone);
 if(!zone||e16FishLevel()<zone.req)return;
 if(e161Fishing){e161Fishing=false;e161StopWait();}
 e195Reset();
 state.ui=state.ui||{};state.ui.fishingZoneId=zone.id;
 persist();e16Page();toast('Nueva zona: '+zone.name);
},true);
