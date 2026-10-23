
"use strict";
/* E1.6 pesca activa. Extensión aditiva compatible con guardados v7. */
UI_TABS.push(["fishing","Pesca"]);
const E16_ROD_PRICE=35;
/* @include src/catalogs/016-e16-fishing-e16_fish.js */
let e16Session=null,e16Holding=false,e16Frame=0,e16Last=0,e16Result="";
function e16FishSkill(){if(!state)return {xp:0};state.skills=state.skills||{};return state.skills.pesca||(state.skills.pesca={xp:0});}
function e16FishLevel(){return Math.min(100,skillLvl(e16FishSkill().xp));}
function e16FishProgress(){
 const xp=e16FishSkill().xp,level=e16FishLevel(),max=level===100;
 const low=10*(level-1)**2,high=10*level**2;
 return {xp,level,max,earned:Math.max(0,xp-low),need:high-low,left:max?0:Math.max(0,high-xp),percent:max?100:clamp(100*(xp-low)/(high-low),0,100)};
}
// Pesos propios de Argentum: kg físicos, separados de rareza y calidad de venta.
/* @include src/catalogs/016-e16-fishing-e190_weight_ranges.js */
function e190WeightRange(fish){return E190_WEIGHT_RANGES[fish.id];}
function e190Capacity(rod=e161Rod()){return E1103_SPECIAL[rod?.id]?.maxKg||25;}
function e190CanLift(fish,rod=e161Rod()){return e190WeightRange(fish)[0]<=e190Capacity(rod);}
const e225StatFormat=new Intl.NumberFormat('es-AR',{maximumFractionDigits:2});
function e190Kg(kg){return e225StatFormat.format(Number(kg))+' kg';}
function e190SampleWeight(fish,rod=e161Rod(),random=Math.random){
 const [low,maximum]=e190WeightRange(fish),high=Math.min(maximum,e190Capacity(rod));
 if(high<low)return null;
 return Math.round((low+random()*(high-low))*100)/100;
}
function e190TrackWidth(){return Math.max(60,(document.getElementById('e16Tank')?.clientWidth||520)-6);}
function e190ControlPercent(control){return control/4;}
function e190CaptureWidth(fish,rod=e161Rod(),level=e16FishLevel(),width=e190TrackWidth(),abismo=!!e187Rewards().abismo){
 const skill=Math.min(22,Math.floor((level-1)/3)*2);
 const difficulty=E161_DIFFICULTY[fish.id]||1;
 const fraction=clamp(.16+e1101Stats(rod).control/400+skill/2000-(difficulty-1)*.025,.10,.36);
 return Math.min(width*.55,Math.max(28,width*fraction+(abismo?8:0)));
}
function e190MotionProfile(fish,rod=e161Rod()){
 const resilience=clamp(e1101Stats(rod).resilience,0,60)/100;
 return {distance:1-resilience*.65,interval:1+resilience*1.5};
}
function e190Weights(){
 state.ui=state.ui||{};
 return state.ui.fishingWeights||(state.ui.fishingWeights={bySpecies:{},byZone:{}});
}
function e190RecordWeight(catchInfo){
 if(!Number.isFinite(catchInfo.weightKg))return;
 const fresh=!state.ui?.fishingWeights,weights=e190Weights(),id=catchInfo.fish.id;
 if(fresh)weights.legacyRiverTrophy=!!catchInfo.legacyRiverTrophy;
 const record=(target)=>{target.catches=(target.catches||0)+1;target.totalKg=Number(((target.totalKg||0)+catchInfo.weightKg).toFixed(2));target.bestKg=Math.max(target.bestKg||0,catchInfo.weightKg);};
 weights.bySpecies=weights.bySpecies||{};weights.byZone=weights.byZone||{};
 const speciesRecord=weights.bySpecies[id]||(weights.bySpecies[id]={});
 const known=e218Record(id),previousBest=known.best;
 catchInfo.newAbsoluteRecord=previousBest>0&&catchInfo.weightKg>previousBest;
 speciesRecord.bestKg=previousBest;speciesRecord.categoryBestKg={...speciesRecord.categoryBestKg,...known.categories};if(known.category)speciesRecord.bestCategory=known.category;
 record(speciesRecord);
 const label=e183LastQuality?.fish===catchInfo.fish.name?e183LastQuality.label:'';
 const category=label.includes('LEGENDARIO')?'legendary':label.includes('ENORME')?'huge':label.includes('Grande')?'large':'normal';
 speciesRecord.categoryBestKg=speciesRecord.categoryBestKg||{};
 speciesRecord.categoryBestKg[category]=Math.max(Number(speciesRecord.categoryBestKg[category])||0,catchInfo.weightKg);
 if(catchInfo.weightKg>previousBest)speciesRecord.bestCategory=category;
 const zone=weights.byZone[catchInfo.zone]||(weights.byZone[catchInfo.zone]={species:{}});
 zone.species=zone.species||{};zone.species[id]=(zone.species[id]||0)+1;record(zone);
 weights.last={id,weightKg:catchInfo.weightKg,zone:catchInfo.zone,rodId:catchInfo.rodId};
 if(e182LastCatch)e182LastCatch.weightKg=catchInfo.weightKg;
}
function e190CollectorProgress(){
 const river=state?.ui?.fishingWeights?.byZone?.rio||{};
 return {catches:river.catches||0,species:Object.keys(river.species||{}).length,bestKg:river.bestKg||0,legacy:state?.ui?.fishingWeights?!!state.ui.fishingWeights.legacyRiverTrophy:!!state?.ui?.e18Fishing?.riverHuge};
}
function e190CollectorReady(){const p=e190CollectorProgress();return p.legacy||(p.catches>=5&&p.species>=3&&p.bestKg>=8);}
function e190CollectorQuestHtml(){
 const done=!!state.owned?.[E18_ROD.id],p=e190CollectorProgress();
 return `<section class="e187Quest" data-quest-id="coleccionista"><div class="e187QuestHead"><b>🏆 El trofeo de las corrientes</b><span class="e187Perk">${done?'Caña obtenida':'Desafío de capturas · no consume peces'}</span></div><p>El coleccionista busca un pescador capaz de dominar el río: conseguí 5 capturas, 3 especies distintas y un ejemplar de al menos 8 kg en el Río del Bosque.</p><div class="e187QuestNeeds"><span>Capturas ${Math.min(5,p.catches)}/5</span><span>Especies ${Math.min(3,p.species)}/3</span><span>Récord ${e190Kg(p.bestKg)} / 8 kg</span></div><p>🎁 ${E18_ROD.name} · trofeos +16% de base · capacidad ${e190Kg(e190Capacity(E18_ROD))}</p>${p.legacy&&!done?'<p>Tu antiguo trofeo extraordinario del río ya acredita este desafío.</p>':''}${done?'<p>Recompensa reclamada. La caña está disponible en la tienda.</p>':`<button class="small primary" data-e18-claim ${e190CollectorReady()?'':'disabled'}>Reclamar caña del Coleccionista</button>`}</section>`;
}
function e190DecorateFishingPage(){
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const zone=e165Zone(),rod=e161Rod(),eligible=E16_FISH.filter(f=>zone.fish.includes(f.id)&&e16FishLevel()>=f.req),feasible=eligible.filter(f=>e190CanLift(f));
 const info=page.querySelector('.e165ZoneInfo');
 if(info&&rod)info.textContent=zone.desc+' · Tu caña soporta '+e190Kg(e190Capacity(rod))+'. '+feasible.length+'/'+eligible.length+' especies de tu nivel al alcance.'+(!feasible.length?' Equipá una caña de mayor capacidad para pescar aquí.':'');
 const species=E16_FISH.filter(f=>zone.fish.includes(f.id));
 page.querySelectorAll('.e186Fish').forEach((card,i)=>{
  const fish=species[i];if(!fish||card.classList.contains('e186Unknown'))return;
  const range=e190WeightRange(fish),best=state.ui?.fishingWeights?.bySpecies?.[fish.id]?.bestKg;
  const text=document.createElement('small');text.className='e190Weight';text.textContent='⚖ '+e190Kg(range[0])+'–'+e190Kg(range[1])+(best?' · Récord pesado: '+e190Kg(best):'');
  card.lastElementChild.append(text);
 });
 const progress=e16FishProgress(),track=page.querySelector('.e163XpTrack');
 if(track){track.setAttribute('role','progressbar');track.setAttribute('aria-label','Experiencia de Pesca');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',progress.percent.toFixed(1));}
 }
function e190ReturnToFishing(){
 if(!state||!ready||busy||managing)return;
 if(state.ui?.tab!=='fishing')selectWorkspaceTab('fishing');
 const progress=document.querySelector('#page_fishing .e163Skill');if(!progress)return;
 const tabs=document.querySelector('.workspaceTabs'),top=progress.getBoundingClientRect().top+window.scrollY-(tabs?.getBoundingClientRect().height||0)-12;
 window.scrollTo({top:Math.max(0,top),behavior:'auto'});
}
function e16Rod(){return !!state?.owned?.e16_rod;}
function e16Page(){
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const lvl=e16FishLevel(),xp=e16FishSkill().xp,lo=10*(lvl-1)*(lvl-1),hi=10*lvl*lvl;
 page.innerHTML=`<h2>🎣 Pesca · Nivel ${lvl}</h2>
 <div class="fishPanel"><b>Progreso de Pesca</b><div class="fishMuted">${fmt(Math.floor(xp-lo))} / ${fmt(hi-lo)} XP hacia nivel ${lvl+1}</div><div class="bar xp"><div style="width:${Math.max(0,Math.min(100,100*(xp-lo)/(hi-lo)))}%"></div></div>
 <p class="fishMuted">La pesca es una profesión independiente del nivel de personaje. Mantené presionado el botón o la barra espaciadora para subir la zona verde; soltá para que baje. Mantené al pez dentro hasta completar la captura.</p></div>
 <div class="fishPanel"><h3>Equipo de pesca</h3>${e16Rod()?'<p>✅ Caña sencilla equipada. Ya podés pescar.</p>':`<p>Comprá una caña sencilla por <b>${E16_ROD_PRICE} oro</b>. Es una compra permanente, pensada para el inicio.</p><button data-e16-buyrod ${state.gold<E16_ROD_PRICE?'disabled':''}>Comprar caña · ${E16_ROD_PRICE} oro</button>`}</div>
 <div class="fishPanel"><h3>Zona de pesca · Muelle del pueblo</h3><div class="fishSpecies">${E16_FISH.map(f=>`<div>${f.icon} <b>${f.name}</b><div class="fishMuted">${lvl>=f.req?'Disponible':'🔒 Pesca '+f.req} · ${f.price} oro · ${f.xp} XP</div></div>`).join('')}</div>
 <p class="fishMuted">Seleccioná una especie disponible para intentar pescarla. Los peces difíciles se mueven más y requieren mejor control. Los peces capturados se guardan en el inventario y se pueden vender al mercader.</p>
 <div class="actions">${E16_FISH.map(f=>`<button class="small" data-e16-cast="${f.id}" ${!e16Rod()||lvl<f.req||!!e16Session?'disabled':''}>${f.icon} ${f.name}</button>`).join('')}</div></div>
 <div class="fishPanel" id="e16GamePanel"><h3>Minijuego de pesca</h3><div id="e16Status" class="fishMuted" aria-live="polite">${e16Session?'¡El pez está picando!':e16Result||'Comprá tu caña y elegí un pez para empezar.'}</div>
 <div class="fishGrid" style="margin:12px 0"><div class="fishTank" id="e16Tank"><div class="fishZone" id="e16Zone" style="bottom:0"></div><div class="fishTarget" id="e16Target" style="bottom:150px">🐟</div></div><div><div class="fishMuted">Captura</div><div class="fishMeter"><div class="fishMeterFill" id="e16Progress"></div></div></div></div>
 <div style="text-align:center"><button class="primary fishControl" id="e16Hold" ${e16Session?'':'disabled'}>MANTENER PARA SUBIR ↑</button><p class="fishMuted">Mouse, pantalla táctil o barra espaciadora. Si el pez se escapa, podés volver a intentar sin gastar oro.</p><button class="small" data-e16-cancel ${e16Session?'':'disabled'}>Cancelar intento</button></div></div>`;
 if(e16Session)e16Paint();
}
function e16Paint(){if(!e16Session)return;const g=e16Session;const zone=document.getElementById('e16Zone'),target=document.getElementById('e16Target'),meter=document.getElementById('e16Progress');if(zone){zone.style.bottom=g.pos+'px';zone.style.height=g.fish.zone+'px';}if(target)target.style.bottom=g.target+'px';if(meter)meter.style.height=Math.round(g.progress*100)+'%';}
function e16Finish(won){const g=e16Session;if(!g)return;e16Session=null;e16Holding=false;cancelAnimationFrame(e16Frame);if(won){const id='pez_'+g.fish.id;state.inventory[id]=(state.inventory[id]||0)+1;const gained=sklXp(state,'pesca',g.fish.xp);e16Result=`¡Capturaste ${g.fish.name}! +${Math.floor(gained)} XP de Pesca. Vendelo en Inventario.`;addLog('Pesca: '+e16Result);persist();updateInv();}else e16Result='El pez escapó. ¡Volvé a intentarlo!';e16Page();}
function e16Animate(now){if(!e16Session)return;const g=e16Session,dt=Math.min(.05,Math.max(0,(now-e16Last)/1000));e16Last=now;
 // Movimiento de la barra con inercia y gravedad; objetivo con cambios de dirección.
 g.vel+=(e16Holding?700:-600)*dt;g.vel=Math.max(-245,Math.min(245,g.vel));g.pos=Math.max(0,Math.min(300-g.fish.zone,g.pos+g.vel*dt));if(g.pos===0||g.pos===300-g.fish.zone)g.vel=0;
 g.time+=dt;g.target+=g.dir*g.fish.speed*160*dt+Math.sin(g.time*5.7+g.seed)*g.fish.wiggle*85*dt;
 if(g.target<4){g.target=4;g.dir=1;}if(g.target>270){g.target=270;g.dir=-1;}
 if(g.time>=g.turnAt){g.dir=Math.random()<.5?-1:1;g.turnAt=g.time+.45+Math.random()*1.15;}
 const inside=g.target+12>=g.pos&&g.target+12<=g.pos+g.fish.zone;
 g.progress=Math.max(0,Math.min(1,g.progress+(inside?.16:-.095)*dt));
 e16Paint();if(g.progress>=1)return e16Finish(true);if(g.time>3&&g.progress<=0)return e16Finish(false);
 e16Frame=requestAnimationFrame(e16Animate);
}
function e16Start(id){if(e16Session||!state||!ready||busy||managing||!storageReady)return;const f=E16_FISH.find(x=>x.id===id);if(!f||!e16Rod()||e16FishLevel()<f.req)return;
 if(state.combat.active||state.restLeft>0||navActive(state))return toast('Detené el combate, descanso o navegación antes de pescar.');
 e16Session={fish:f,pos:110,vel:0,target:160,dir:1,turnAt:1,seed:Math.random()*6,time:0,progress:.30};e16Holding=false;e16Page();e16Last=performance.now();e16Frame=requestAnimationFrame(e16Animate);
}
const e16OldRender=renderGame;
renderGame=function(){if(e16Session){cancelAnimationFrame(e16Frame);e16Session=null;e16Holding=false;e16Result='Intento interrumpido por cambio de pantalla.';}e16OldRender();e16Page();};
const e16OldItemName=itemNameOf;
itemNameOf=function(id){const f=E16_FISH.find(x=>'pez_'+x.id===id);return f?f.name:e16OldItemName(id);};
const e16OldMerchant=e15MerchantPanel;
e15MerchantPanel=function(){e16OldMerchant();e16FishMerchant();};
function e16FishMerchant(){const page=document.getElementById('page_inventory');if(!page||!state)return;let panel=document.getElementById('e16FishMerchant');if(!panel){panel=document.createElement('section');panel.id='e16FishMerchant';panel.className='panel';panel.style.cssText='margin-top:12px;padding:14px;border:1px solid #80632f;border-radius:9px';page.append(panel);}
 const rows=E16_FISH.filter(f=>(state.inventory['pez_'+f.id]||0)>0);panel.innerHTML=`<h3>🐟 Venta de peces</h3><p class="muted">Los peces se venden por oro; por ahora no tienen recetas de fabricación.</p>${rows.length?rows.map(f=>{const n=state.inventory['pez_'+f.id];return `<div class="shopRow" style="flex-wrap:wrap"><div><b>${f.icon} ${f.name}</b><br><small class="muted">${n} disponibles · ${f.price} oro cada uno</small></div><div class="actions"><button class="small" data-e16-sell="${f.id}" data-e16-qty="1">Vender 1</button><button class="small" data-e16-sell="${f.id}" data-e16-qty="all">Vender todos (+${fmt(n*f.price)})</button></div></div>`;}).join(''):'<p class="muted">Todavía no capturaste peces.</p>'}`;
}
document.addEventListener('click',e=>{const buy=e.target.closest('[data-e16-buyrod]'),cast=e.target.closest('[data-e16-cast]'),cancel=e.target.closest('[data-e16-cancel]'),sell=e.target.closest('[data-e16-sell]');if(!buy&&!cast&&!cancel&&!sell)return;e.preventDefault();e.stopImmediatePropagation();if(!state||!ready||busy||managing||!storageReady||simulationLocked())return;
 if(buy){if(e16Rod()||state.gold<E16_ROD_PRICE)return;state.gold-=E16_ROD_PRICE;state.owned=state.owned||{};state.owned.e16_rod=true;persist();renderGame();toast('¡Compraste tu primera caña!');}
 if(cast)e16Start(cast.dataset.e16Cast);
 if(cancel)e16Finish(false);
 if(sell){const f=E16_FISH.find(x=>x.id===sell.dataset.e16Sell);if(!f)return;const id='pez_'+f.id,owned=state.inventory[id]||0,qty=sell.dataset.e16Qty==='all'?owned:1;if(!Number.isSafeInteger(owned)||qty<1||qty>owned||!Number.isSafeInteger(state.gold+qty*f.price))return;state.inventory[id]-=qty;if(!state.inventory[id])delete state.inventory[id];state.gold+=qty*f.price;addLog('Vendiste '+qty+' × '+f.name+' por '+fmt(qty*f.price)+' oro.');persist();renderGame();toast('Venta: +'+fmt(qty*f.price)+' oro');}
},true);
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#e16Hold,#e16Tank')||!e16Session)return;e.preventDefault();e16Holding=true;},true);
window.addEventListener('pointerup',()=>e16Holding=false);window.addEventListener('pointercancel',()=>e16Holding=false);window.addEventListener('blur',()=>e16Holding=false);
document.addEventListener('keydown',e=>{if(e.code==='Space'&&e16Session&&!/INPUT|TEXTAREA|BUTTON|SELECT/.test(document.activeElement?.tagName||'')){e.preventDefault();e16Holding=true;}});
document.addEventListener('keyup',e=>{if(e.code==='Space')e16Holding=false;});
