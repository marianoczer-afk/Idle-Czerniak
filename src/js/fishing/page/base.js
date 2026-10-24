// Base structure shared by the explicit presentation phases.
function fishingRenderBase(){
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const lvl=e16FishLevel(),xp=e16FishSkill().xp,lo=10*(lvl-1)*(lvl-1),hi=10*lvl*lvl;
 const rod=e161Rod(),next=E161_RODS[e161RodIndex()+1];
 // Keep the live catalog until its replacement is ready; intermediate layout
 // reads must not shrink the scroll range of a long, open shop.
 const retainedShop=page.querySelector('#fishingRodShop');
 page.innerHTML=`<h2>🎣 ${esc(e165Zone().name)} <span class="fishMuted">· Pesca nivel ${lvl}</span></h2>
 <div class="fishPanel e162Dock"><div class="e162DockHead"><div><h3>🌊 Zona de pesca</h3><p class="fishMuted">${rod?'Caña equipada: '+rod.name:'Necesitás comprar tu primera caña para empezar.'} · Los peces pican solos cuando tirás la caña.</p></div><button class="primary" data-e161-toggle ${!rod||(!e161Fishing&&!e161CanFish())?'disabled':''}>${e161Fishing?'Dejar de pescar':'🎣 Tirar la caña'}</button></div>
 <div class="e163Skill"><div class="e163SkillHead"><b>🎣 Pesca · Nv ${lvl}</b><span id="e163XpText">${fmt(Math.floor(xp-lo))} / ${fmt(hi-lo)} XP · ${Math.floor(100*(xp-lo)/(hi-lo))}%</span></div><div class="e163XpTrack"><div id="e163XpFill" style="width:${Math.max(0,Math.min(100,100*(xp-lo)/(hi-lo)))}%"></div></div></div>
 <div id="e161WaitingText" class="fishWaiting fishMuted">${e16Session?'¡Picó un pez misterioso!':e161Fishing?'Esperando una picada… '+Math.max(0,Math.ceil((e161CatchAt-Date.now())/1000))+' s':e16Result||'Comprá una caña y empezá a pescar.'}</div>
 <div id="e16GamePanel" class="e162Game" ${e16Session?'':'style="display:none"'}>
 <div class="e162FightTitle">🐟 ¡Un pez está luchando! <span class="fishMuted">Mantené apretado para mover la zona verde a la derecha; soltá para llevarla a la izquierda.</span></div>
 <div class="e162Play"><div class="fishTank" id="e16Tank"><div class="fishZone" id="e16Zone" style="left:0"></div><div class="fishTarget" id="e16Target" style="left:150px">🐟</div></div><div class="e162ProgressWrap"><span class="fishMuted">Captura</span><div class="fishMeter"><div class="fishMeterFill" id="e16Progress"></div></div></div></div>
 <div class="e162Controls"><button class="primary fishControl" id="e16Hold" ${e16Session?'':'disabled'}>MANTENER PARA MOVER →</button><button class="small" data-e16-cancel ${e16Session?'':'disabled'}>Cancelar</button></div></div>
 ${e16Result?`<div class="fishCatch" aria-live="polite">${e16Result}</div>`:''}</div>
 <div class="fishPanel"><b>Progreso de Pesca · Nv ${lvl}</b><div class="fishMuted">${fmt(Math.floor(xp-lo))} / ${fmt(hi-lo)} XP hacia nivel ${lvl+1}</div><div class="bar xp"><div style="width:${Math.max(0,Math.min(100,100*(xp-lo)/(hi-lo)))}%"></div></div>
 <p class="fishMuted">Cada 3 niveles ganás +2 de zona de captura (máximo +22). Las cañas amplían la zona y desbloquean especies más difíciles. Pesca no sube tu nivel de combate.</p></div>
 <details class="fishPanel" ${rod?'':'open'}><summary><b>🎣 Cañas y mejoras</b> · ${rod?rod.name:'Sin caña'}</summary>
 <div class="fishRod" hidden><div><b>${E161_RODS[0].name}</b></div></div>
 ${next?`<p class="fishMuted">Próxima caña: ${next.name}, nivel ${next.req}.</p>`:'<p class="fishMuted">¡Tenés la mejor caña!</p>'}</details>
 <details class="fishPanel"><summary><b>🐠 Peces y desbloqueos</b></summary><div class="fishSpecies">${E16_FISH.map(f=>`<div class="${lvl<f.req?'fishLocked':''}">${f.icon} <b>${f.name}</b><div class="fishMuted">${lvl>=f.req?'Desbloqueado':'🔒 Pesca '+f.req} · ${f.price} oro al vender · ${f.xp} XP</div></div>`).join('')}</div></details>`;
 if(retainedShop)page.append(retainedShop);
 if(e16Session)e16Paint();
}
