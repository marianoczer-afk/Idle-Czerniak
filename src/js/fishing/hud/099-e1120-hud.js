
'use strict';
(function(){
let popup=null;
function closeMenu(){if(popup){popup.remove();popup=null;}}
function fishingLevel(){return typeof e16FishLevel==='function'?e16FishLevel():1;}
function sync(){
 const dock=document.getElementById('combatDock');if(!dock?.classList.contains('e188FishingMode')||!state){closeMenu();return;}
 const zone=dock.querySelector('.e1118Zone'),rod=dock.querySelector('.e194DockRod');
 if(!zone||!rod)return;
 zone.querySelector('.e1120RodLabel')?.remove();
 zone.setAttribute('role','button');zone.setAttribute('tabindex','0');zone.setAttribute('aria-label','Cambiar zona de pesca');
 rod.setAttribute('role','button');rod.setAttribute('tabindex','0');rod.setAttribute('aria-label','Elegir caña equipada');
 const txt=rod.querySelector('.e194DockRodText');if(txt)txt.textContent=e161Rod()?.name||'Sin caña';
}
function openMenu(type,anchor){
 if(popup?.dataset.type===type){closeMenu();return;}closeMenu();
 const lv=fishingLevel();popup=document.createElement('div');popup.className='e1120Menu';popup.dataset.type=type;
 if(type==='zone'){const head=document.createElement('div');head.className='e1120MenuHeader';head.innerHTML='<span>Elegir zona de pesca</span>';const x=document.createElement('button');x.textContent='✕';x.onclick=closeMenu;head.append(x);popup.append(head);}
 const entries=type==='zone'?E165_ZONES:e221Rods().sort((a,b)=>Number(!!state?.owned?.[b.id])-Number(!!state?.owned?.[a.id])||Number(b.id===e161Rod()?.id)-Number(a.id===e161Rod()?.id));
 entries.forEach((item,i)=>{
  const available=type==='zone'?lv>=item.req:!!state?.owned?.[item.id]&&(e217RequiredLevel(item)===null||lv>=e217RequiredLevel(item));
  const active=type==='zone'?e165Zone().id===item.id:e161Rod()?.id===item.id;
  const b=document.createElement('button');b.className='e1120Choice'+(active?' active':'');b.disabled=!available;if(type==='rod')b.dataset.rodId=item.id;
  const sym=document.createElement('span');sym.className='e1120Symbol';sym.textContent=type==='zone'?(item.icon||'🌲'):'';if(type==='zone')b.append(sym);else{const art=document.createElement('span');art.className='e216RodThumb';art.innerHTML=e194RodArt(item.id);b.append(art);}
  const info=document.createElement('span');const title=document.createElement('b');title.textContent=item.name+(active?'  ✓':'');info.append(title);
  const desc=document.createElement('small');desc.textContent=type==='zone'?(available?item.desc:'🔒 Requiere Pesca nivel '+item.req):(available?(item.desc||'Caña disponible'):'🔒 No obtenida');if(type==='zone')info.append(desc);else{const compare=document.createElement('span');compare.className='rodComparisons';compare.innerHTML=e216RodComparison(item);info.append(compare);const status=document.createElement('small');const provenance=e220RodProvenance(item);status.className='rodProvenance';status.dataset.provenanceZone=provenance.zone;status.title=provenance.detail;status.textContent=e222PickerStatus(item);info.append(status);}b.append(info);
  b.onclick=()=>{
   if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
   if(e161Fishing){e161Fishing=false;e161StopWait();}
   e195Reset();
   if(type==='zone'){
    state.ui=state.ui||{};state.ui.fishingZoneId=item.id;
   }else{state.ui=state.ui||{};state.ui.fishingRodId=item.id;}
   if(type==='zone')closeMenu();persist();e16Page();sync();if(type==='rod')e222RefreshPicker(popup);toast(type==='zone'?'Nueva zona: '+item.name:'Caña equipada: '+item.name);
  };
  if(type==='rod'){
   const entry=document.createElement('div');entry.className='e222RodEntry';entry.append(b);
   if(!state.owned?.[item.id]){const link=document.createElement('button');link.type='button';link.className='small e222Obtain';link.textContent=e220RodProvenance(item).quest?'Ver encargo':'Ir a comprar';link.setAttribute('aria-label',link.textContent+': '+item.name);link.onclick=()=>{closeMenu();e222FindRod(item);};entry.append(link);}
   popup.append(entry);
  }else popup.append(b);
 });
 if(type==='rod'){e217MenuTools(popup,anchor);popup.querySelector('.e217RodTools button').onclick=closeMenu;}
 document.body.append(popup);const rect=anchor.getBoundingClientRect();const w=popup.offsetWidth,h=popup.offsetHeight;
 popup.style.left=Math.max(10,Math.min(window.innerWidth-w-10,rect.left))+'px';
 popup.style.top=(rect.top>h+10?rect.top-h-7:Math.min(window.innerHeight-h-10,rect.bottom+7))+'px';
}
document.addEventListener('click',e=>{
 const zone=e.target.closest('#combatDock.e188FishingMode .e1118Zone');
 const rod=e.target.closest('#combatDock.e188FishingMode .e194DockRod');
 if(zone||rod){e.preventDefault();e.stopPropagation();openMenu(zone?'zone':'rod',zone||rod);return;}
 if(popup&&!e.target.closest('.e1120Menu'))closeMenu();
},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();if((e.key==='Enter'||e.key===' ')&&e.target.matches('#combatDock.e188FishingMode .e1118Zone,#combatDock.e188FishingMode .e194DockRod')){e.preventDefault();openMenu(e.target.classList.contains('e1118Zone')?'zone':'rod',e.target);}});
const old=e188UpdateHud;e188UpdateHud=function(){const result=old();sync();return result;};
const oldRender=renderGame;renderGame=function(){const result=oldRender();sync();return result;};
})();
