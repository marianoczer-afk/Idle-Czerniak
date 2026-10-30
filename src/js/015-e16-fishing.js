
"use strict";
/* E1.6 pesca activa. Extensión aditiva compatible con guardados v7. */
UI_TABS.push(["fishing","Pesca"]);
const E16_ROD_PRICE=35;
const E16_FISH=[
 {id:"mojarra",name:"Mojarra",req:1,price:8,xp:14,speed:0.20,wiggle:0.13,zone:90,icon:"🐟"},
 {id:"bagre",name:"Bagre",req:3,price:14,xp:23,speed:0.27,wiggle:0.22,zone:82,icon:"🐟"},
 {id:"trucha",name:"Trucha",req:5,price:23,xp:35,speed:0.36,wiggle:0.30,zone:76,icon:"🐠"},
 {id:"salmon",name:"Salmón",req:10,price:48,xp:65,speed:0.49,wiggle:0.40,zone:68,icon:"🐠"},
 {id:"pez_espada",name:"Pez espada",req:15,price:90,xp:110,speed:0.62,wiggle:0.52,zone:60,icon:"🐡"}
];
let e16Session=null,e16Holding=false,e16Frame=0,e16Last=0,e16Result="";
function e16FishSkill(){if(!state)return {xp:0};state.skills=state.skills||{};return state.skills.pesca||(state.skills.pesca={xp:0});}
function e16FishLevel(){return Math.min(100,skillLvl(e16FishSkill().xp));}
function e16FishProgress(){
 const xp=e16FishSkill().xp,level=e16FishLevel(),max=level===100;
 const low=10*(level-1)**2,high=10*level**2;
 return {xp,level,max,earned:Math.max(0,xp-low),need:high-low,left:max?0:Math.max(0,high-xp),percent:max?100:clamp(100*(xp-low)/(high-low),0,100)};
}
// Pesos propios de Argentum: kg físicos, separados de rareza y calidad de venta.
const E190_WEIGHT_RANGES={
 mojarra:[.10,.65],bagre:[1,6],trucha:[.6,3.5],salmon:[2,12],pez_espada:[18,110],
 carpa_dorada:[1,7],trucha_arcoiris:[.5,4],pez_fantasma:[.3,4],lucio:[2,14],anguila:[.5,4],
 lubina:[1,8],atun:[35,160],mantarraya:[55,320],perca_esmeralda:[.4,3],cangrejo_azul:[.2,2],
 koi_imperial:[2,14],esturion:[12,65],pez_luna:[5,35],caballito_mar:[.02,.15],morena:[3,18],
 tiburon_arrecife:[40,220],pez_linternilla:[.1,1.5],calamar_abismo:[4,40],pez_cristal:[.2,2],leviatan:[180,900],
 sabalo_manglar:[3,14],pez_arquero:[.2,2],anguila_manglar:[1,9],tarpon:[22,140],trucha_alpina:[2,12],
 salvelino:[2,16],bacalao_hielo:[8,75],esturion_blanco:[100,500],pez_lava:[.5,6],mero_obsidiana:[30,190],
 pez_escorpion:[1,9],dragon_mar:[250,1400],carpa_celeste:[30,160],pez_cometa:[1,10],raya_aurora:[120,650],guardian_mareas:[600,2400]
};
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
function e190ControlPercent(control){return control/5;}
function e190CaptureWidth(fish,rod=e161Rod(),level=e16FishLevel(),width=e190TrackWidth(),abismo=!!e187Rewards().abismo){
 const st=e1101Stats(rod),demand=Math.max(0,(fish.req-1)/99),difficulty=E161_DIFFICULTY[fish.id]||1;
 const fraction=clamp(.185+st.control/500+Math.min(.015,(level-1)/7000)-(difficulty-1)*.014-demand*.030,.12,.35);
 // The historical +8px reward is 8px at the 520px reference, proportional on mobile.
 return Math.max(16,width*(fraction+(abismo?8/520:0)));
}
function e190MotionProfile(fish,rod=e161Rod()){
 const resilience=clamp(e1101Stats(rod).resilience,0,60)/100;
 return {distance:1-resilience*.5,interval:1+resilience*2};
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
 const priorCount=Math.max(Number(speciesRecord.catches)||0,(Number(state.ui?.e18Fishing?.bySpecies?.[id]?.total)||0)-1);
 if(!speciesRecord.categoryCounts){
  const historical=state.ui?.e18Fishing?.bySpecies?.[id]?.categoryCounts||{};
  speciesRecord.categoryCounts=Object.fromEntries(Object.entries(historical).filter(([key,n])=>Object.hasOwn(E218_CATEGORIES,key)&&Number.isSafeInteger(n)&&n>=0));
  speciesRecord.categoryCountBaseline=Math.max(0,priorCount-Object.values(speciesRecord.categoryCounts).reduce((a,b)=>a+b,0));
 }
 record(speciesRecord);
 const label=e183LastQuality?.fish===catchInfo.fish.name?e183LastQuality.label:'';
 const category=label.includes('LEGENDARIO')?'legendary':label.includes('ENORME')?'huge':label.includes('Grande')?'large':'normal';
 speciesRecord.categoryCounts[category]=(Number(speciesRecord.categoryCounts[category])||0)+1;
 speciesRecord.categoryBestKg=speciesRecord.categoryBestKg||{};
 speciesRecord.categoryBestKg[category]=Math.max(Number(speciesRecord.categoryBestKg[category])||0,catchInfo.weightKg);
 if(catchInfo.weightKg>previousBest)speciesRecord.bestCategory=category;
 const zone=weights.byZone[catchInfo.zone]||(weights.byZone[catchInfo.zone]={species:{}});
 zone.species=zone.species||{};zone.species[id]=(zone.species[id]||0)+1;record(zone);
 weights.last={id,weightKg:catchInfo.weightKg,category,zone:catchInfo.zone,rodId:catchInfo.rodId};
 if(e182LastCatch)e182LastCatch.weightKg=catchInfo.weightKg;
}
function e190CollectorProgress(){
 const river=state?.ui?.fishingWeights?.byZone?.rio||{};
 return {catches:river.catches||0,species:e234SpeciesCount(river,'rio'),bestKg:river.bestKg||0,legacy:state?.ui?.fishingWeights?!!state.ui.fishingWeights.legacyRiverTrophy:!!state?.ui?.e18Fishing?.riverHuge};
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
 const chrome=document.querySelector('.globalHeader')||document.querySelector('.workspaceTabs'),top=progress.getBoundingClientRect().top+window.scrollY-(chrome?.getBoundingClientRect().height||0)-12;
 window.scrollTo({top:Math.max(0,top),behavior:'auto'});
}
function e16Rod(){return !!state?.owned?.e16_rod;}
// Single page lifecycle. Presentation phases never call a previous e16Page.
let fishingPageShop,fishingPageZoneSync;
// Base structure shared by the explicit presentation phases.
function fishingRenderBase(){
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const lvl=e16FishLevel(),xp=e16FishSkill().xp,lo=10*(lvl-1)*(lvl-1),hi=10*lvl*lvl;
 const rod=e161Rod(),next=E161_RODS[e161RodIndex()+1];
 // Keep the live catalog until its replacement is ready; intermediate layout
 // reads must not shrink the scroll range of a long, open shop.
 const retainedShop=page.querySelector('#fishingRodShop');
 page.innerHTML=`<h2>🎣 ${esc(e165Zone().name)} <span class="fishMuted">· Pesca nivel ${lvl}</span></h2>
 <div class="fishPanel e162Dock"><div class="e162DockHead"><div><h3>🌊 Zona de pesca</h3><p class="fishMuted">${rod?'Caña equipada: '+rod.name:'Necesitás comprar tu primera caña para empezar.'} · La burbuja aparece sola; tocala para empezar.</p></div><button class="primary" data-e161-toggle ${!rod||(!e161Fishing&&!e161CanFish())?'disabled':''}>${e161Fishing?'Dejar de pescar':'🎣 Tirar la caña'}</button></div>
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
 <details class="fishPanel"><summary><b>🐠 Peces y desbloqueos</b></summary><div class="fishSpecies">${E16_FISH.map(f=>`<div class="${lvl<f.req?'fishLocked':''}">${f.icon} <b>${f.name}</b><div class="fishMuted">${lvl>=f.req?'Desbloqueado':'🔒 Pesca '+f.req} · ${f.price} oro · venta automática · ${f.xp} XP</div></div>`).join('')}</div></details>`;
 if(retainedShop)page.append(retainedShop);
 if(e16Session)e16Paint();
}

// Ordered presentation work; blocks isolate locals and early exits. No captured predecessors.
function fishingRenderZoneAndQuests(){

 zoneChoices: { // 025-e165-zones.js

 const page=document.getElementById('page_fishing');if(!page||!state)break zoneChoices;
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
 if(species){species.innerHTML=E16_FISH.filter(f=>z.fish.includes(f.id)).map(f=>`<div class="${lvl<f.req?'fishLocked':''}">${f.icon} <b>${f.name}</b><div class="fishMuted">${lvl>=f.req?'Disponible':'🔒 Pesca '+f.req} · ${fmt(f.price)} oro · venta automática · ${fmt(f.xp)} XP</div></div>`).join('');}

 }
 dockQuest: { // 027-e17-quests.js

 const page=document.getElementById('page_fishing');if(!page||!state)break dockQuest;
 const zone=e165Zone();
 if(zone.id==='muelle'){
  const section=document.createElement('div');section.innerHTML=e17QuestHtml();
  const quest=section.firstElementChild;
  const anchor=page.querySelector('.e165ZoneInfo')||page.querySelector('.e162Dock');
  if(anchor)anchor.after(quest);else page.append(quest);
 }
 const details=page.querySelector('details:has(.fishRod)');
 if(details&&e17Done()){
  const row=document.createElement('div');row.className='fishRod e17SpecialRod';
  row.innerHTML=`<div><b>🏆 ${E17_ROD.name}</b><div class="fishMuted">Misión del Muelle · Pesca 6 · ${E17_ROD.desc}</div></div><button class="small" data-e17-equip ${e17Selected()?'disabled':''}>${e17Selected()?'✓ Equipada':'Equipar'}</button>`;
  details.append(row);
  if(e17Selected()){const summary=details.querySelector('summary');if(summary)summary.textContent='🎣 Cañas y estadísticas · '+E17_ROD.name;}
 }

 }
 regionalQuests: { // 029-e171-improvements.js

 const page=document.getElementById('page_fishing');if(!page||!state)break regionalQuests;
 const dock=page.querySelector('.e162Dock');
 /* El muelle, la barra y el botón Tirar caña son lo primero que se ve. */
 if(dock){page.prepend(dock);}
 const current=e165Zone();
 const originalQuest=page.querySelector('.e17Quest');
 if(originalQuest&&e17Done())originalQuest.remove();
 const available=E171_QUESTS.filter(q=>q.zone===current.id);
 const group=document.createElement('div');group.className='e171Quests';
 const firstQuest=originalQuest&&!e17Done()?originalQuest.outerHTML:'';
 group.innerHTML=firstQuest+available.filter(q=>!e171Done(q)).map(e171QuestMarkup).join('');
 if(originalQuest)originalQuest.remove();
 if(dock)dock.after(group);else page.prepend(group);
 /* En el listado de cañas, indicar claramente una sola equipada. */
 const rodDetails=page.querySelector('details:has(.fishRod)');
 if(rodDetails){
  const active=e161Rod();
  rodDetails.querySelectorAll('.fishRod').forEach(row=>{
   const name=row.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim()||'';
   const equipped=name===active?.name;
   row.classList.toggle('e164RodActive',equipped);
   const btn=row.querySelector('[data-e164-equip],[data-e17-equip],[data-e171-equip]');
   if(btn){btn.textContent=equipped?'✓ Equipada':'Equipar';btn.disabled=equipped;}
   const title=row.querySelector('b');if(title)title.textContent=(equipped?'✓ ':'')+name;
  });
  for(const q of E171_QUESTS.filter(e171Done)){
   const row=document.createElement('div');row.className='fishRod';
   const equipped=e171RodSelected(q);
   row.classList.toggle('e164RodActive',equipped);
   row.innerHTML=`<div><b>${equipped?'✓ ':''}${q.rod.name}</b><div class="fishMuted">Recompensa de misión · ${q.rod.desc}</div></div><button class="small" data-e171-equip="${q.id}" ${equipped?'disabled':''}>${equipped?'✓ Equipada':'Equipar'}</button>`;
   rodDetails.append(row);
  }
  const summary=rodDetails.querySelector('summary');if(summary)summary.textContent='🎣 Cañas y estadísticas · '+(active?.name||'Sin caña');
 }

 }
 equipmentState: { // 031-e172-fixes.js

 const page=document.getElementById('page_fishing');if(!page||!state)break equipmentState;
 const dock=page.querySelector('.e162Dock');
 if(dock){
  const waiting=dock.querySelector('#e161WaitingText');
  if(waiting&&!e161Fishing&&!e16Session){
   waiting.textContent='Elegí una zona y empezá a pescar con el botón «Tirar la caña».';
  }
  // La notificación de captura ya aparece en un recuadro: evitar duplicarla.
  if(dock.querySelector('.fishCatch')&&waiting&&!e161Fishing&&!e16Session)waiting.style.display='none';
 }

 }
 speciesList: { // 033-e173-fishing.js

 const page=document.getElementById('page_fishing');if(!page||!state)break speciesList;
 const dock=page.querySelector('.e162Dock');if(!dock)break speciesList;
 const z=e165Zone(),lvl=e16FishLevel();
 const waiting=dock.querySelector('#e161WaitingText');
 const catchBox=dock.querySelector('.fishCatch');
 if(e173ZoneChanged){
  if(catchBox)catchBox.remove();
  e173ZoneChanged=false;
 }
 // Mientras espera una nueva picada, un resultado viejo no puede confundirse con el estado actual.
 if(e161Fishing&&!e16Session){
  if(waiting){waiting.style.display='block';waiting.classList.add('e173Waiting');waiting.textContent='🎣 Pescando en '+z.name+' · Esperando una picada… '+Math.max(0,Math.ceil((e161CatchAt-Date.now())/1000))+' s';}
  if(catchBox)catchBox.remove();
 }
 // Listado compacto y contextual: únicamente peces presentes en la zona seleccionada.
 const list=E16_FISH.filter(f=>z.fish.includes(f.id));
 const details=document.createElement('details');details.className='e173Species';details.open=e173SpeciesOpen;
 const count=list.filter(f=>lvl>=f.req).length;
 details.innerHTML='<summary>🐠 Peces de esta zona · '+count+'/'+list.length+' disponibles</summary><div class="e173SpeciesGrid">'+list.map(f=>'<div class="e173Fish '+(lvl<f.req?'locked':'')+'"><b>'+f.icon+' '+f.name+'</b><small>'+(lvl>=f.req?'✓ Disponible':'🔒 Pesca '+f.req)+' · '+fmt(f.price)+' oro · '+fmt(f.xp)+' XP</small></div>').join('')+'</div>';
 const info=dock.querySelector('.e165ZoneInfo');if(info)info.after(details);
 // Quitar el listado duplicado: queda un único catálogo compacto junto al muelle.
 const oldSpecies=page.querySelector('.fishSpecies');
 if(oldSpecies){const oldPanel=oldSpecies.closest('details');if(oldPanel)oldPanel.remove();}
 /* no programmatic scrolling */

 }
 journalShell: { // 035-e18-trophies.js

 const page=document.getElementById('page_fishing');if(!page||!state)break journalShell;
 const dock=page.querySelector('.e162Dock');if(!dock)break journalShell;
 const r=e18Record(),lvl=e16FishLevel(),done=!!state.owned?.[E18_ROD.id],eligible=lvl>=12;
 const q=document.createElement('details');q.className='e18Panel e181Journal';
 q.innerHTML=`<summary>📖 Diario de pesca · ${r.total||0} capturas · ${Object.keys(r.bySpecies).length||0} especies</summary>
 <div class="e18Pills"><span>🐟 Grandes: ${r.large||0}</span><span>🏆 Enormes: ${r.huge||0}</span><span>✨ Legendarios: ${r.legendary||0}</span></div>
 <p>Tu colección de trofeos. Los tamaños no modifican el valor de venta.</p>`;
 const quests=page.querySelector('.e171Quests');if(quests)quests.after(q);else dock.after(q);
 if(done){
  const rods=page.querySelector('details:has(.fishRod)');
  if(rods){const equipped=e18RodSelected(),row=document.createElement('div');row.className='fishRod';row.classList.toggle('e172Equipped',equipped);
   row.innerHTML=`<div><b>${equipped?'✓ ':''}${E18_ROD.name}</b><div class="fishMuted">Premio de Pesca · ${E18_ROD.desc}</div></div><button class="small" data-e18-equip ${equipped?'disabled':''}>${equipped?'✓ Equipada':'Equipar'}</button>`;
   rods.append(row);const summary=rods.querySelector('summary');if(summary)summary.textContent='🎣 Cañas y estadísticas · '+(e161Rod()?.name||'Sin caña');
  }
 }

 }
 captureResult: { // 039-e182-fishing.js

 const current=document.getElementById('page_fishing');if(!current||!state)break captureResult;
 const dock=current.querySelector('.e162Dock'),game=current.querySelector('#e16GamePanel');if(!dock||!game)break captureResult;
 // Reserva siempre el mismo espacio para que una picada no empuje el documento.
 game.style.display='block';
 game.classList.toggle('e182Idle',!e16Session);
 game.setAttribute('aria-hidden',e16Session?'false':'true');
 const previous=current.querySelector('.fishCatch');
 if(previous)previous.remove();
 let result=dock.querySelector('.e182Result');
 if(!result){result=document.createElement('div');result.className='e182Result';dock.append(result);}
 const recent=e182LastCatch&&Date.now()-e182LastCatch.at<7500&&e182LastCatch.zone===e165Zone().id;
 result.hidden=!recent;
 if(recent){
  const c=e182LastCatch;
  result.innerHTML=`<b>🎉 ¡Capturaste ${c.name}!</b> · +${fmt(c.xp)} XP de Pesca · <b>${fmt(c.price)} oro</b> al vender<small>El pez se guardó en tu inventario. Podés venderlo en el mercader.</small>`;
 }
 // No duplicar el panel de progreso; el principal ya está junto al minijuego.
 const extra=[...current.querySelectorAll('.fishPanel')].find(p=>p!==dock&&p.textContent?.includes('Cada 3 niveles ganás'));
 if(extra)extra.remove();
 // Al recrear los controles, el navegador puede intentar desplazar la página al foco.
 /* no programmatic scrolling */

 }
 captureActions: { // 041-e183-fishing.js

 const page=document.getElementById('page_fishing');if(!page||!state)break captureActions;
 const game=page.querySelector('#e16GamePanel'),toggle=page.querySelector('.e162DockHead [data-e161-toggle]');
 if(game&&toggle){
  let actions=game.querySelector('.e183Actions');
  if(!actions){actions=document.createElement('div');actions.className='e183Actions';game.prepend(actions);}
  const caption=document.createElement('span');caption.className='fishMuted';
  caption.textContent=e16Session?'🐟 ¡Picó un pez!':e161Fishing?'🎣 Caña lanzada · esperando picada':'🎣 Prepará tu caña para pescar';
  actions.replaceChildren(caption,toggle);
 }
 // El aviso es único y usa la recompensa efectiva, incluso en ejemplares enormes/legendarios.
 const result=page.querySelector('.e182Result');
 if(result&&!result.hidden&&e182LastCatch){
  const c=e182LastCatch;
  const size=e183LastQuality&&e183LastQuality.fish===c.name&&e183LastQuality.at>=c.at-1500?e183LastQuality.label:'';
  result.replaceChildren();
  const title=document.createElement('b');title.textContent='🎉 ¡Capturaste '+c.name+(size?' · '+size:'')+'!';
  const values=document.createElement('span');values.textContent=' · +'+fmt(c.xp)+' XP de Pesca · '+fmt(c.price)+' oro · venta automática';
  const note=document.createElement('small');note.textContent='Guardado en tu inventario. El oro se obtiene al venderlo.';
  result.append(title,values,note);
 }

 }
 zoneTheme: { // 043-e185-fishing.js

 const page=document.getElementById('page_fishing');if(!page||!state)break zoneTheme;
 const zone=e165Zone(),theme=E185_THEMES[zone.id]||E185_THEMES.muelle,rod=e161Rod(),lvl=e16FishLevel();
 const dock=page.querySelector('.e162Dock');if(!dock)break zoneTheme;
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
  const values=result.querySelector('span');if(values)values.textContent=' · +'+fmt(e182LastCatch.xp)+' XP de Pesca · '+fmt(e182LastCatch.price)+' oro · venta automática';
 }

 }
 collection: { // 045-e186-fishing.js

 const page=document.getElementById('page_fishing');if(!page||!state)break collection;
 const dock=page.querySelector('.e162Dock');if(!dock)break collection;
 const summary=dock.querySelector('.e185Summary');
 if(summary){
  const badge=document.createElement('span');badge.className='e186Luck';
  badge.textContent='✨ Trofeos +'+e186LuckPercent()+'% de probabilidad';
  summary.append(badge);
 }
 const zone=e165Zone(),record=e18Record(),species=E16_FISH.filter(f=>zone.fish.includes(f.id));
 const found=species.filter(f=>(record.bySpecies[f.id]?.total||0)>0).length;
 const book=document.createElement('details');book.className='e186Book';book.open=e186BookOpen;
 const header=document.createElement('summary');header.textContent='📘 Colección de '+zone.name+' · '+found+'/'+species.length+' especies descubiertas';book.append(header);
 const progress=document.createElement('div');progress.className='e186Progress';
 const fill=document.createElement('div');fill.style.width=(species.length?100*found/species.length:0)+'%';progress.append(fill);book.append(progress);
 const grid=document.createElement('div');grid.className='e186BookGrid';
 const bestLabels={normal:'Común',large:'Grande',huge:'Enorme',legendary:'Legendario'};
 for(const f of species){
  const data=record.bySpecies[f.id],count=Number(data?.total)||0;
  const unlocked=e16FishLevel()>=f.req;
  const card=document.createElement('div');card.className='e186Fish';card.dataset.speciesId=f.id;
  if(!count)card.classList.add('e186Unknown');
  if(data?.best==='legendary')card.classList.add('e186Legend');
  const title=document.createElement('strong');title.textContent=count?f.name:(unlocked?'Sin descubrir':'Bloqueado · nivel '+f.req);
  const info=document.createElement('small');info.textContent=count?'Capturados: '+count+' · Récord: '+(bestLabels[data.best]||'Común'):(unlocked?'¡Seguí pescando para descubrirlo!':'Disponible al alcanzar Pesca '+f.req);
  card.append(title,info);grid.append(card);
 }
 book.append(grid);
 const old=page.querySelector('.e186Book');if(old)old.remove();
 const speciesDetails=dock.querySelector('.e173Species');
 if(speciesDetails)speciesDetails.after(book);else if(summary)summary.after(book);else dock.append(book);

 }
 permanentQuests: { // 047-e187-expansion.js

 const previous=document.querySelector('#page_fishing .e181Journal');if(previous)e187JournalOpen=previous.open;

 const page=document.getElementById('page_fishing');if(!page||!state)break permanentQuests;
 const xp=e16FishSkill().xp,lvl=e16FishLevel(),lo=10*(lvl-1)*(lvl-1),hi=10*lvl*lvl;
 const bar=page.querySelector('.e163XpTrack');if(bar){const label=document.createElement('span');label.className='e187XpLabel';label.textContent=lvl===100?'Nivel máximo · Pesca 100 · '+fmt(xp)+' XP acumulada':fmt(Math.floor(xp-lo))+' / '+fmt(hi-lo)+' XP  ·  '+Math.floor(100*(xp-lo)/(hi-lo))+'%';bar.append(label);}
 const journal=page.querySelector('.e181Journal');if(journal){
  journal.open=e187JournalOpen;
  const old=journal.querySelector('.e187JournalList');if(old)old.remove();
  const list=document.createElement('div');list.className='e187JournalList';
  journal.append(list);
  const oldText=journal.querySelector('p');if(oldText)oldText.textContent='Registro de todas tus especies y sus mejores ejemplares.';
 }
 const zone=e165Zone(),quests=E187_QUESTS.filter(q=>q.zone===zone.id);
 const group=page.querySelector('.e171Quests');
 if(group){for(const q of quests){const done=e187QuestDone(q);
  const section=document.createElement('section');section.className='e187Quest';section.dataset.questId=q.id;
  if(done)continue;
  const head=document.createElement('div');head.className='e187QuestHead';const name=document.createElement('b');name.textContent='📜 '+q.title;head.append(name);section.append(head);
  const p=document.createElement('p');p.textContent='Guardá estos peces en tu inventario y entregalos juntos. Cualquier tamaño cuenta; se consumen al reclamar:';section.append(p);
  const needs=document.createElement('div');needs.className='e187QuestNeeds';let can=lvl>=q.req;
  for(const n of q.needs){const f=E16_FISH.find(f=>f.id===n.id),owned=state.inventory?.['pez_'+n.id]||0;can=can&&owned>=n.qty;
   const span=document.createElement('span');span.textContent=(f?.icon||'🐟')+' '+(f?.name||n.id)+' '+Math.min(owned,n.qty)+'/'+n.qty;needs.append(span);}
  section.append(needs);const foot=document.createElement('div');foot.className='e187QuestHead';const reward=document.createElement('span');reward.textContent='🎁 '+q.reward;foot.append(reward);
  const btn=document.createElement('button');btn.className='small primary';btn.dataset.e187Claim=q.id;btn.disabled=!can;btn.textContent=can?'Completar encargo':'Faltan peces';foot.append(btn);section.append(foot);group.append(section);
 }}
 if(group&&zone.id==='rio'&&!state.owned?.[E18_ROD.id])group.insertAdjacentHTML('beforeend',e190CollectorQuestHtml());
 const rods=page.querySelector('details:has(.fishRod)');if(rods&&state.owned?.[E187_ROD.id]){
  const active=state.ui?.fishingRodId===E187_ROD.id,row=document.createElement('div');row.className='fishRod';
  row.innerHTML='<div><b>'+(active?'✓ ':'')+E187_ROD.name+'</b><div class="fishMuted">Premio del arrecife · '+E187_ROD.desc+'</div></div><button class="small" data-e187-equip '+(active?'disabled':'')+'>'+(active?'✓ Equipada':'Equipar')+'</button>';rods.append(row);
 }
 const dock=page.querySelector('.e162Dock'),summary=dock?.querySelector('.e185Summary');if(summary){const rewards=e187Rewards();
  if(rewards.laguna){const x=document.createElement('span');x.textContent='🌿 +5% XP por misión';summary.append(x);}
  if(rewards.abismo){const x=document.createElement('span');x.textContent='🌌 +8 px permanentes';summary.append(x);}
 }

 }
 questStock: { // 049-e188-fishing.js

 const page=document.getElementById('page_fishing');if(!page||!state)break questStock;
 // Replace counts displayed by previous versions with quality-inclusive counts.
 const oldQuest=page.querySelector('.e17Quest');
 if(oldQuest&&!e17Done()){
  oldQuest.querySelectorAll('.e17QuestFish').forEach((el,i)=>{const n=E17_QUEST.needs[i];if(!n)return;
   const total=e188FishStock(n.id),f=E16_FISH.find(x=>x.id===n.id);
   el.innerHTML='<b>'+(f?.icon||'🐟')+' '+(f?.name||n.id)+'</b> '+fmt(Math.min(total,n.qty))+' / '+n.qty+' en inventario<div class="e17QuestBar"><div style="width:'+100*Math.min(1,total/n.qty)+'%"></div></div>';
  });
  const btn=oldQuest.querySelector('[data-e17-deliver]');if(btn){btn.disabled=e16FishLevel()<E17_QUEST.level||!e17HasFish();btn.textContent=e17HasFish()?'Entregar peces y reclamar caña':'Faltan peces';}
 }
 for(const q of E171_QUESTS){const btn=page.querySelector('[data-e171-deliver="'+q.id+'"]');if(!btn)continue;
  const panel=btn.closest('.e171Quest');panel?.querySelectorAll('.e171Needs span').forEach((span,i)=>{const n=q.needs[i],f=E16_FISH.find(x=>x.id===n?.id);if(n)span.innerHTML=(f?.icon||'🐟')+' '+(f?.name||n.id)+': <b>'+Math.min(e188FishStock(n.id),n.qty)+'/'+n.qty+'</b>';});
  btn.disabled=!e171CanDeliver(q);btn.textContent=e171CanDeliver(q)?'Entregar peces':'Faltan peces';
 }
 for(const q of E187_QUESTS){const btn=page.querySelector('[data-e187-claim="'+q.id+'"]');if(!btn)continue;
  const panel=btn.closest('.e187Quest');panel?.querySelectorAll('.e187QuestNeeds span').forEach((span,i)=>{const n=q.needs[i],f=E16_FISH.find(x=>x.id===n?.id);if(n)span.textContent=(f?.icon||'🐟')+' '+(f?.name||n.id)+' '+Math.min(e188FishStock(n.id),n.qty)+'/'+n.qty;});
  btn.disabled=!q.needs.every(n=>e188FishStock(n.id)>=n.qty);btn.textContent=btn.disabled?'Faltan peces':'Completar encargo';
 }
 // Remove the level requirement from purchased rods, both visually and in the action.
 const rods=page.querySelector('details:has(.fishRod)');
 if(rods){rods.querySelectorAll('[data-e161-buy]').forEach(btn=>{const i=Number(btn.dataset.e161Buy),r=E161_RODS[i];if(!r)return;
  btn.disabled=state.gold<r.price;const row=btn.closest('.fishRod');const info=row?.querySelector('.fishMuted');if(info)info.textContent='Sin nivel mínimo · '+r.desc+' · '+fmt(r.price)+' oro';
 });
  rods.querySelectorAll('.fishRod .fishMuted').forEach(el=>{if(/Pesca \d+/.test(el.textContent||'')&&/oro/.test(el.textContent||''))el.textContent=el.textContent.replace(/Pesca \d+\s*·\s*/,'Sin nivel mínimo · ');});
 }
 const next=page.querySelector('.fishPanel p.fishMuted');
 if(next&&next.textContent?.startsWith('Próxima caña:'))next.textContent='Podés comprar cualquier caña si tenés el oro necesario.';
 e188UpdateHud();

 }
}

// Ordered presentation work; blocks isolate locals and early exits. No captured predecessors.
function fishingRenderCollectionAndControls(){
 mysteryCaption: { // 052-e190-polish.js
if(!e16Session)break mysteryCaption;const page=document.getElementById('page_fishing');if(!page)break mysteryCaption;const waiting=page.querySelector('#e161WaitingText');if(waiting)waiting.textContent='🐟 ¡Picó un pez misterioso!';const status=page.querySelector('#e16Status');if(status)status.textContent='🐟 ¡Picó un pez misterioso!';
 }
 collectionReward: { // 054-e191-polish.js

 const page=document.getElementById('page_fishing');if(!page||!state)break collectionReward;
 const book=page.querySelector('.e186Book');if(!book)break collectionReward;
 const zone=e165Zone(),fish=E16_FISH.filter(f=>zone.fish.includes(f.id)),record=e18Record();
 const completed=fish.length>0&&fish.every(f=>typeof e227Discovered==='function'?e227Discovered(state,f.id):Number(record.bySpecies?.[f.id]?.total)>0);
 const claimed=!!e191Achievements()[zone.id];
 const box=document.createElement('div');box.className='e191Achievement';
 const info=document.createElement('div'),title=document.createElement('b'),detail=document.createElement('small');
 title.textContent=claimed?'🏅 Colección completada':completed?'🏆 ¡Colección completa!':'🏅 Logro: explorador de '+zone.name;
 detail.textContent=claimed?'Recompensa reclamada · insignia permanente':completed?'Descubriste todas las especies · insignia de colección':'Capturá al menos un ejemplar de cada especie para obtener su insignia. Premio visual, sin oro.';
 info.append(title,detail);box.append(info);
 if(completed&&!claimed){const button=document.createElement('button');button.className='small primary';button.dataset.e191Claim=zone.id;button.textContent='Reclamar premio';box.append(button);}
 book.append(box);

 }
 collectionArt: { // 056-e192-collection.js

 const page=document.getElementById('page_fishing');if(!page||!state)break collectionArt;
 const book=page.querySelector('.e186Book'),zone=e165Zone();
 if(book){const cards=[...book.querySelectorAll('.e186Fish')],species=E16_FISH.filter(f=>zone.fish.includes(f.id));cards.forEach((card,i)=>{const f=species[i];if(!f||card.querySelector('.e192Sprite'))return;const icon=document.createElement('div');icon.className='e192Sprite';icon.innerHTML=e189FishSVG(f.id);const info=document.createElement('div');while(card.firstChild)info.append(card.firstChild);card.append(icon,info);});}
 const rods=page.querySelector('details:has(.fishRod)');if(rods){rods.querySelectorAll('.fishRod').forEach((row,i)=>{const r=E161_RODS[i];if(!r||row.querySelector('.e192RodShowcase'))return;const showcase=document.createElement('div');showcase.className='e192RodShowcase';showcase.innerHTML=e189RodSVG(r.id)+'<span>'+r.desc+'</span>';const parent=row.querySelector('div');if(parent)parent.append(showcase);});}

 }

 atlasAndQuestFold: { // 060-e194-polish.js

 const page=document.getElementById('page_fishing');if(!page||!state)break atlasAndQuestFold;
 const quests=page.querySelector('.e171Quests');
 if(quests){
  e210ZoneChallenges(quests);
  const active=[...quests.children].filter(el=>!el.matches('.e171QuestGroup'));
  if(active.length){const fold=document.createElement('details');fold.className='e194QuestFold';fold.open=e194QuestOpen;
   const sum=document.createElement('summary');sum.textContent='📜 Encargos de esta zona ('+active.length+')';
   const body=document.createElement('div');body.className='e194QuestBody';active.forEach(el=>body.append(el));fold.append(sum,body);quests.prepend(fold);
   fold.addEventListener('toggle',()=>{e194QuestOpen=fold.open;});
  }
  quests.querySelectorAll('.e171QuestGroup').forEach(n=>n.remove());
  quests.append(e216AtlasNode());quests.querySelector('.atlasRows').scrollTop=e216View().scrollTop||0;
 }
 // Todas las cañas (compradas o ganadas en quests) reciben ilustración.
 const list=page.querySelector('details:has(.fishRod)');
 if(list)list.querySelectorAll('.fishRod').forEach(row=>{
  const label=row.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim();
  const rod=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),...(typeof E187_ROD!=='undefined'?[E187_ROD]:[])].find(r=>r?.name===label);
  const id=rod?.id||(/brumas/i.test(label)?'bruma':/guardarr/i.test(label)?'guardarr':/viejo/i.test(label)?'viejo':/coral/i.test(label)?'coral':null);
  if(!id)return;
  const existing=row.querySelector('.e193RodImage');
  if(existing){existing.innerHTML=e194RodArt(id);return;}
  if(row.querySelector('.e194QuestRodArt'))return;
  const art=document.createElement('div');art.className='e194QuestRodArt';art.innerHTML=e194RodArt(id);
  const info=row.querySelector('div');if(info)info.append(art);
 });
 const next=[...page.querySelectorAll('*')].find(el=>el.children.length===0&&/Próxima caña:\s*.*nivel\s*\d+/i.test(el.textContent||''));
 if(next)next.textContent='';

 }
 biteBubbles: { // 062-e195-fishing.js
e195DrawShake();
 }
 sidebar: { // 066-e197-fishing.js
e197Sync();
 }
 hudLabels: { // 071-e1101-balance.js

 const page=document.getElementById('page_fishing');
 if(!page||!state)break hudLabels;
 // Una sola referencia al estado de la picada dentro del HUD.
 const hud=document.getElementById('e188FishingHud');
 if(hud){
  const labels=hud.querySelectorAll('small,.fishMuted,.e188Status');
  let seen=false;
  labels.forEach(el=>{
   if(/pescando|esperando.*picada|pez.*luchando/i.test(el.textContent||'')){
    if(seen)el.style.display='none';else seen=true;
   }
  });
 }
 break hudLabels;

 }


 zoneDetails: { // 077-e1105-clean-fishing.js

 const page=document.getElementById('page_fishing');
 const dock=page?.querySelector('.e162Dock');
 if(!dock)break zoneDetails;
 const stats=dock.querySelector('.e185Summary');
 if(stats){
  let details=page.querySelector('.e1105Details');
  if(!details){
   details=document.createElement('details');
   details.className='e1105Details';
   const title=document.createElement('summary');
   title.textContent='🎣 Ver datos de zona, caña y bonificaciones';
   details.append(title);
   dock.insertAdjacentElement('afterend',details);
  }
  details.querySelector('.e185Summary')?.remove();
  details.append(stats);
 }
 // Una sola línea de estado antes del minijuego, sin mensajes duplicados.
 const status=page.querySelector('.e162DockHead');
 if(status){
  const nodes=[...status.querySelectorAll('*')].filter(n=>n.children.length===0);
  let seen=false;
  for(const n of nodes){
   if(/esperando picada|caña lanzada/i.test(n.textContent||'')){
    if(seen)n.style.visibility='hidden';else seen=true;
   }
  }
 }
 break zoneDetails;

 }
 phaseVisibility: { // 078-e1106-stable-game.js

 const page=document.getElementById('page_fishing');
 if(!page)break phaseVisibility;
 const waiting=page.querySelector('#e161WaitingText');
 if(waiting)waiting.classList.toggle('e1106Quiet',!!(e16Session||e195Pending));
 const game=page.querySelector('#e16GamePanel');
 if(game&&e161Fishing)game.style.display='block';
 break phaseVisibility;

 }
 fishingControls: { // 080-e1107-fishing-ui.js
e1107Sync();break fishingControls;
 }
 toolbar: { // 082-e1108-fishing-layout.js

 const page=document.getElementById('page_fishing');
 const dock=page?.querySelector('.e162Dock');
 const game=dock?.querySelector('#e16GamePanel');
 if(!dock||!game)break toolbar;
 game.querySelectorAll('.e1107StopShake').forEach(n=>n.remove());
 let toolbar=dock.querySelector('.e1108Toolbar');
 if(!toolbar){toolbar=document.createElement('div');toolbar.className='e1108Toolbar';game.before(toolbar);}
 const toggle=dock.querySelector('[data-e161-toggle]');
 if(toggle){
  toolbar.append(toggle);
  toggle.disabled=!(e161Fishing||e161Rod()&&e161CanFish());
  toggle.textContent=e161Fishing?'Dejar de pescar':'🎣 Tirar la caña';
 }
 const actions=game.querySelector('.e183Actions');
 if(actions)actions.remove();
 // El mismo espacio del minijuego se mantiene durante la espera, los círculos y la captura.
 if(e161Fishing)game.style.display='block';
 break toolbar;

 }
 cancelControl: { // 084-e1109-final-polish.js

 const game=document.querySelector('#page_fishing .e162Dock #e16GamePanel');
 if(!game)break cancelControl;
 game.querySelectorAll('[data-e16-cancel]').forEach(b=>b.remove());
 break cancelControl;

 }
 resultNotice: { // 087-e1111-catch-result.js

 const page=document.getElementById('page_fishing');
 const dock=page?.querySelector('.e162Dock');
 if(!dock)break resultNotice;
 // Durante la pausa, resultado único y bien visible sobre el minijuego.
 if(Date.now()<e1111ResultUntil&&!e16Session&&!e195Pending&&e16Result){
  const existing=dock.querySelector('.fishCatch');
  if(existing){existing.classList.add('e1111CatchNotice');existing.setAttribute('role','status');}
 }
 break resultNotice;

 }
}

// Ordered presentation work; blocks isolate locals and early exits. No captured predecessors.
function fishingRenderPageArtwork(){
 illustrations: { // 089-e1113-art.js
e1113RefreshArt();break illustrations;
 }

 fullArtwork: { // 095-e1117-full-art.js

 document.querySelectorAll('#page_fishing .e1114Rod,#combatDock .e1114Rod').forEach(el=>{
  const box=el.closest('.fishRod,.e17Quest,.e171Quest,.e187Quest');
  const name=box?.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim();
  const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD];
  const rod=all.find(x=>x.name===name)||e161Rod();
  if(rod)el.outerHTML=e194RodArt(rod.id);
 });
 const zone=e165Zone();if(zone){const list=E16_FISH.filter(f=>zone.fish.includes(f.id));
  document.querySelectorAll('#page_fishing .e186Fish').forEach((card,i)=>{
   const sprite=card.querySelector('.e192Sprite');if(sprite&&list[i])sprite.innerHTML=card.classList.contains('e186Unknown')?e190MysteryArt():e189FishSVG(list[i].id);
  });}
 break fullArtwork;
 }
}

function fishingZoneScenery(css){return e227ZoneArt(e165Zone(),css)||e227Illustration('ui','water',css,true);}
function e16Page(){
 if(state)e234MigrateRegional(state);
 e231RenderDepth++;
 try {
  if(!fishingFinishDepth){
   if(state)e227MigrateMastery(state);
   fishingRenderDepth++;
   try {
    e216Remember();fishingPageShop.remember();
    const previousShop=document.getElementById('fishingRodShop');
    const fold=document.querySelector('#page_fishing .e194QuestFold');if(fold)e194QuestOpen=fold.open;
    const book=document.querySelector('#page_fishing .e186Book');if(book)e186BookOpen=book.open;
    const species=document.querySelector('#page_fishing .e173Species');if(species)e173SpeciesOpen=species.open;
    fishingRenderBase();
    fishingRenderZoneAndQuests();
    fishingRenderCollectionAndControls();
    fishingRenderPageArtwork();
    fishingPageZoneSync();
    fishingPageShop.render(previousShop);
   } finally {fishingRenderDepth--;if(!fishingRenderDepth){e16Paint();measureDock();}}
   e218Journal();e221Decorate();e227RenderQuests();e228Presentation();e229Polish();e235QuestNotice();
  }
  const panel=document.getElementById('e16GamePanel');
  if(panel){const zone=e165Zone().id,scene=panel.querySelector('.e231StageScenery');if(!scene||scene.dataset.zone!==zone){scene?.remove();panel.insertAdjacentHTML('afterbegin',fishingZoneScenery('e231StageScenery'));const art=panel.querySelector('.e231StageScenery');if(art)art.dataset.zone=zone;}}
 } finally {if(!--e231RenderDepth){e231QuestCache=null;e231ReferenceCache=null;}}
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
