
"use strict";
/* Las cinco zonas existentes y las nuevas comparten el mismo sistema visual. */
const E191_THEMES={
 muelle:['#26343a','#1d282c','#63848c'],rio:['#24382e','#19291f','#629a75'],costa:['#302d45','#211e33','#9280b8'],
 laguna:['#263c32','#1b2c27','#7ebd8c'],arrecife:['#3c3336','#2a2733','#d08c82'],abismo:['#292d44','#171a30','#7e83c5']
};
/* Logro por descubrimiento completo: se reclama una sola vez por zona.
   No exige que todos sean legendarios; cada especie debe haberse capturado al menos una vez. */
function e191Achievements(){if(!state)return {};state.ui=state.ui||{};const v=state.ui.e191Achievements;return v&&typeof v==='object'?v:(state.ui.e191Achievements={});}
const e191PriorPage=e16Page;
e16Page=function(){
 e191PriorPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const book=page.querySelector('.e186Book');if(!book)return;
 const zone=e165Zone(),fish=E16_FISH.filter(f=>zone.fish.includes(f.id)),record=e18Record();
 const completed=fish.length>0&&fish.every(f=>Number(record.bySpecies?.[f.id]?.total)>0);
 const claimed=!!e191Achievements()[zone.id];
 const box=document.createElement('div');box.className='e191Achievement';
 const info=document.createElement('div'),title=document.createElement('b'),detail=document.createElement('small');
 title.textContent=claimed?'🏅 Colección completada':completed?'🏆 ¡Colección completa!':'🏅 Logro: explorador de '+zone.name;
 detail.textContent=claimed?'Recompensa reclamada · insignia permanente':completed?'Descubriste todas las especies · insignia de colección':'Capturá al menos un ejemplar de cada especie para obtener su insignia. Premio visual, sin oro.';
 info.append(title,detail);box.append(info);
 if(completed&&!claimed){const button=document.createElement('button');button.className='small primary';button.dataset.e191Claim=zone.id;button.textContent='Reclamar premio';box.append(button);}
 book.append(box);
};
document.addEventListener('click',e=>{
 const btn=e.target.closest('[data-e191-claim]');if(!btn)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked())return;
 const zone=E165_ZONES.find(z=>z.id===btn.dataset.e191Claim),ach=e191Achievements();
 if(!zone||ach[zone.id])return;
 const record=e18Record(),fish=E16_FISH.filter(f=>zone.fish.includes(f.id));
 if(!fish.length||!fish.every(f=>Number(record.bySpecies?.[f.id]?.total)>0))return;

 ach[zone.id]=true;
 addLog('Pesca: completaste la colección de '+zone.name+'. Insignia de colección.');persist();renderGame();
},true);
