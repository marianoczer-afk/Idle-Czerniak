
"use strict";
/* Dibujos horizontales amplios, con temática por caña; se reutilizan en HUD y tienda. */
function e194RodArt(id){
 const k=String(id||'').toLowerCase(),mist=/bruma/.test(k),river=/guard|rio/.test(k),old=/viejo|pescador/.test(k),reef=/coral|nacar/.test(k),emerald=/laguna|esmeralda/.test(k),abyss=/abis|abyss|astral/.test(k),collector=/colecc/.test(k);
 const accent=abyss?'#d2a8ff':reef?'#ffa8a0':emerald?'#7ef2ac':mist?'#b9a1f6':river?'#82d2c0':collector?'#e9cb70':old?'#d8b67b':'#9bbbd2';
 const shaft=abyss?'#6755a1':reef?'#bd7283':emerald?'#367a61':mist?'#70618e':river?'#466e5a':old?'#8d633a':'#556d80';
 const ornament=abyss?'<path d="M380 17 l7 -13 7 13 -7 13Z" fill="#e3d4ff"/>':reef?'<path d="M348 21 q-8 -16 -12 -8 m12 8 q3 -17 13 -17 m-13 17 q12 -13 22 -5" stroke="#ffb5a9" stroke-width="3" fill="none"/>':emerald?'<path d="M355 18 Q340 2 356 2 Q369 11 355 18" fill="#98ffc1"/>':mist?'<circle cx="355" cy="14" r="8" fill="#d5c6ff" opacity=".8"/>':river?'<path d="M365 13 q-12 -12 -23 0 q11 14 23 0" fill="#80d7ba"/>':collector?'<path d="M355 3 l5 10 12 2 -9 7 2 11 -10 -6 -10 6 2 -11 -9 -7 12 -2Z" fill="#e9cb70"/>':'';
 return '<svg viewBox="0 0 520 78" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Caña de pesca ilustrada"><defs><linearGradient id="e194Shaft" x1="0" x2="1"><stop stop-color="'+shaft+'"/><stop offset=".6" stop-color="'+accent+'"/><stop offset="1" stop-color="#e6e5db"/></linearGradient></defs><path d="M16 59 Q225 51 471 8" stroke="#0b131b" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M16 59 Q225 51 471 8" stroke="url(#e194Shaft)" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M20 58 L125 52" stroke="#42322c" stroke-width="11" stroke-linecap="round"/><path d="M30 58 L118 53" stroke="'+accent+'" stroke-width="1.8" stroke-dasharray="6 5"/><g stroke="'+accent+'" fill="none" stroke-width="2.5"><ellipse cx="195" cy="45" rx="5" ry="9"/><ellipse cx="292" cy="33" rx="4" ry="7"/><ellipse cx="385" cy="21" rx="3" ry="5"/><ellipse cx="450" cy="11" rx="2" ry="4"/></g><circle cx="145" cy="51" r="17" fill="'+shaft+'" stroke="'+accent+'" stroke-width="3"/><circle cx="145" cy="51" r="8" fill="'+accent+'"/><path d="M145 51 l-12 20" stroke="'+accent+'" stroke-width="4"/><path d="M471 8 Q512 23 490 55" stroke="#c3e1e8" stroke-width="1.3" stroke-dasharray="4 3" fill="none"/><path d="M490 55 l-7 9 7 9 7 -9Z" fill="'+accent+'"/>'+ornament+'</svg>';
}
// One read-only ledger combines every quest family; ownership/flags remain the source of truth.
function e210StopFishing(){
 e219ClearXPEffects();
 e161Fishing=false;e161StopWait();e195Reset();cancelAnimationFrame(e16Frame);
 e16Session=null;e16Holding=false;e16Result='';
 if(e1111ResultTimer){clearTimeout(e1111ResultTimer);e1111ResultTimer=null;}
 e1111ResultUntil=0;
 e182LastCatch=null;
}
function e210RodRequirement(rod){
 if(rod.unlock)return state.owned?.[rod.id]?`${E165_ZONES.find(z=>z.id===rod.unlock.zone).name} · Desafío completado · ${rod.unlock.catches} capturas · ${rod.unlock.species} especies ${rod.unlock.bestKg?'· récord mínimo '+e190Kg(rod.unlock.bestKg):'· sin requisito de peso'}`:e208QuestText(rod);
 if(rod.id===E18_ROD.id){if(state.owned?.[rod.id])return 'Río del Bosque · Desafío completado · Caña del Coleccionista obtenida';const p=e190CollectorProgress();return `Río del Bosque · ${Math.min(5,p.catches)}/5 capturas · ${Math.min(3,p.species)}/3 especies · récord ${e190Kg(p.bestKg)}/8 kg`;}
 const q=rod.id===E17_ROD.id?E17_QUEST:rod.id===E187_ROD.id?E187_QUESTS.find(q=>q.kind==='rod'):E171_QUESTS.find(q=>q.rod.id===rod.id);
 if(!q)return 'Disponible por oro';
 const zone=E165_ZONES.find(z=>z.id===q.zone),needs=q.needs.map(n=>`${E16_FISH.find(f=>f.id===n.id)?.name||n.id} ${(state.owned?.[rod.id]?n.qty:Math.min(e188FishStock(n.id),n.qty))}/${n.qty}`).join(' · ');
 return `${zone.name} · Pesca ${q.level??q.req} · ${state.owned?.[rod.id]?'Encargo completado. Entrega acreditada':'Entregar'}: ${needs}`;
}
function e210ZoneChallenges(group){
 for(const rod of E208_CATALOG.filter(r=>r.unlock?.zone===e165Zone().id&&!state.owned?.[r.id])){
  const section=document.createElement('section');section.className='e187Quest';section.dataset.questId=rod.id;
  section.innerHTML=`<div class="e187QuestHead"><b>📜 ${esc(rod.unlock.title)}</b></div>${e212QuestGoals(rod)}<div class="e187QuestHead"><span>🎁 ${esc(rod.name)}</span><button class="small primary" data-catalog-claim="${rod.id}" ${e208QuestProgress(rod).ready&&!e16Session?'':'disabled'}>Reclamar caña</button></div>`;
  group.append(section);
 }
}
function e210RodZone(rod){
 if(rod.zone)return rod.zone;
 if(rod.unlock)return rod.unlock.zone;
 const family=E208_FAMILIES.find(f=>f.id===rod.family);if(family)return family.zone;
 return ({e16_rod:'muelle',e161_rod_bamboo:'rio',e161_rod_fiber:'rio',e161_rod_steel:'costa',e17_rod_viejo:'muelle',e171_rod_rio:'rio',e171_rod_costa:'costa',e18_rod_trofeo:'rio',e187_rod_coral:'arrecife',e192_rod_laguna:'laguna',e192_rod_coral:'arrecife',e192_rod_abyss:'abismo'})[rod.id]||'';
}

function e209CompletedQuests(){
 if(!state)return [];
 const rows=[];
 if(e17Done())rows.push({id:'e17_viejo',zone:'muelle',title:E17_QUEST.title,reward:E17_ROD.name,detail:E17_ROD.desc});
 for(const q of E171_QUESTS)if(e171Done(q))rows.push({id:q.id,zone:q.zone,title:q.title,reward:q.rod.name,detail:q.rod.desc});
 for(const q of E187_QUESTS)if(e187QuestDone(q))rows.push({id:q.id,zone:q.zone,title:q.title,reward:q.reward,detail:q.kind==='xp'?'Mejora permanente activa: se aplica automáticamente a la XP de cada captura.':q.kind==='control'?'Mejora permanente activa: se aplica automáticamente a tu barra de captura.':'Caña obtenida: disponible para equipar en la tienda.'});
 if(state.owned?.[E18_ROD.id])rows.push({id:'coleccionista',zone:'rio',title:'El trofeo de las corrientes',reward:E18_ROD.name,detail:'Caña obtenida: disponible para equipar en la tienda.'});
 for(const rod of E208_CATALOG)if(rod.unlock&&state.owned?.[rod.id])rows.push({id:rod.id,zone:rod.unlock.zone,title:rod.unlock.title,reward:rod.name,detail:'Desafío completado y caña obtenida. No consume peces.'});
 return rows;
}
let e194QuestOpen=true;


function e194UpdateDockRod(){
 const dock=document.getElementById('combatDock'),vitals=dock?.querySelector('.dockVitals');if(!vitals)return;
 let panel=vitals.querySelector('.e194DockRod');if(!panel){panel=document.createElement('div');panel.className='e194DockRod';panel.innerHTML='<div class="e194DockRodArt"></div><div class="e194DockRodText"></div>';vitals.append(panel);}
 if(!dock.classList.contains('e188FishingMode')||!state)return;
 const rod=e161Rod(),id=rod?.id||'',key=id+'|'+(rod?.name||'');if(panel.dataset.key===key)return;
 panel.dataset.key=key;panel.querySelector('.e194DockRodArt').innerHTML=e194RodArt(id);
 panel.querySelector('.e194DockRodText').innerHTML='🎣 '+(rod?.name||'Caña equipada')+'<small>Tu caña equipada</small>';
}


const e194PriorRender=renderGame;
renderGame=function(){e194PriorRender();e194UpdateDockRod();};
