
"use strict";
function e197Sync(){
 const page=document.getElementById('page_fishing');
 const on=!!(state&&state.ui?.tab==='fishing'&&page&&!page.classList.contains('hidden'));
 document.body.classList.toggle('e197Fishing',on);
 if(page)page.classList.toggle('e197ShakeActive',!!(on&&e195Pending&&e161Fishing&&!e16Session));
 const heading=document.querySelector('.hybridSidebarBody details[data-ui-panel="skills"] > summary');
 if(heading){heading.textContent=on?'':'✦ Habilidades';heading.hidden=on;if(on)heading.parentElement.open=true;}
 if(!on||!state)return;
 const box=document.getElementById('skillsBox');if(!box)return;
 let card=box.parentElement?.querySelector('.e197FishingSkills');
 if(!card){card=document.createElement('div');card.className='e197FishingSkills';box.after(card);}
 const lv=e16FishLevel(),xp=e16FishSkill().xp,lo=10*(lv-1)*(lv-1),hi=10*lv*lv;
 const pct=e16FishProgress().percent;
 const rod=e161Rod(),perks=e187Rewards(),key=JSON.stringify([xp,rod?.name,!!perks.laguna,!!perks.abismo]);
 if(card.dataset.renderKey===key)return;card.dataset.renderKey=key;
 card.innerHTML='<b>🎣 Progreso de Pesca</b><div class="e197Line"><span>Nivel '+lv+(lv===100?' · Máximo':'')+'</span><b>'+(lv===100?fmt(xp)+' XP acumulada':Math.floor(xp-lo)+' / '+(hi-lo)+' XP')+'</b></div><div class="e197Track"><div class="e197Fill" style="width:'+pct.toFixed(1)+'%"></div></div><div class="e197Line"><span>🎣 Caña equipada</span><b>'+ (rod?.name||'Ninguna').replaceAll('<','&lt;')+'</b></div><small>La experiencia y las cañas mejoran tu capacidad de pesca. Los atributos de combate siguen disponibles en su pestaña.</small>';
 if(perks.laguna)card.insertAdjacentHTML('beforeend','<small class="e197Perk">🌿 Instinto de pescador · +5% XP de Pesca activo</small>');
 if(perks.abismo)card.insertAdjacentHTML('beforeend','<small class="e197Perk">🌌 Pulso del abismo · +8 px de control activos</small>');
}
const e197PreviousPage=e16Page;
e16Page=function(){e197PreviousPage();e197Sync();};
const e197PreviousTab=selectWorkspaceTab;
selectWorkspaceTab=function(id,save=true){e197PreviousTab(id,save);e197Sync();};
const e197PreviousRender=renderGame;
renderGame=function(){e197PreviousRender();e197Sync();};
/* El lanzamiento no desplaza la página: la posición elegida por el jugador se respeta. */
/* Si la etapa termina, mostrar nuevamente la información de la zona. */
document.addEventListener('click',e=>{if(e.target.closest('.e196Bubble'))setTimeout(e197Sync,0);},true);
