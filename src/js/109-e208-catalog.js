
"use strict";
// Stable IDs and explicit family budgets. req only groups the display; it never gates a purchase.
const E208_FAMILIES=[
 {id:'junco',name:'Junco Dorado',zone:'muelle',req:1,price:110,art:0,power:[4,2,0,2,1,35]},
 {id:'sauce',name:'Sauce Ancestral',zone:'rio',req:8,price:550,art:1,power:[14,6,4,7,4,100]},
 {id:'marea',name:'Marea Errante',zone:'costa',req:18,price:2100,art:3,power:[24,12,8,11,8,300]},
 {id:'nenufar',name:'Nenúfar Real',zone:'laguna',req:25,price:5800,art:1,power:[31,17,13,14,12,420]},
 {id:'coral',name:'Corona Coralina',zone:'arrecife',req:35,price:14500,art:4,power:[36,20,18,17,17,750]},
 {id:'fosa',name:'Juramento Abisal',zone:'abismo',req:45,price:32000,art:9,power:[43,25,25,25,25,1600]},
 {id:'mangle',name:'Espina del Manglar',zone:'manglar',req:55,price:64000,art:5,power:[46,27,28,27,28,1850]},
 {id:'escarcha',name:'Aurora Glacial',zone:'glaciar',req:65,price:125000,art:6,power:[49,29,31,29,31,2200]},
 {id:'obsidiana',name:'Forja del Eclipse',zone:'volcan',req:75,price:230000,art:7,power:[52,31,34,31,34,2500]},
 {id:'celeste',name:'Bóveda Celestial',zone:'santuario',req:90,price:420000,art:8,power:[54,33,36,33,36,3000]},
 {id:'custodio',name:'Custodio del Río',zone:'rio',req:18,price:0,art:3,power:[31,19,16,24,19,500],quest:true},
 {id:'boreal',name:'Pacto Boreal',zone:'glaciar',req:65,price:0,art:6,power:[48,28,30,30,29,2200],quest:true},
 {id:'eterno',name:'Legado de las Mareas',zone:'santuario',req:90,price:0,art:8,power:[55,32,36,34,36,3000],quest:true}
];
const E208_SPECIALTIES=[
 {id:'pulso',name:'Pulso Certero',role:'Control · precisión',delta:[10,-3,-2,-2,0],capacity:.8,cost:1,goal:[12,2,.15]},
 {id:'cauce',name:'Cauce Indomable',role:'Resiliencia · peces inquietos',delta:[-4,-2,-2,12,0],capacity:.7,cost:1.1,goal:[18,3,.20]},
 {id:'destello',name:'Destello',role:'Atracción · menos espera y toques',delta:[-5,7,-2,-3,0],capacity:.75,cost:1.05,goal:[25,2,.12]},
 {id:'fortuna',name:'Faro de Fortuna',role:'Suerte · especies raras',delta:[-3,-4,7,-2,0],capacity:.65,cost:1.2,goal:[15,3,.25]},
 {id:'titan',name:'Ancla de Titanes',role:'Capacidad · grandes pesos',delta:[-4,-3,-3,-2,0],capacity:1.6,cost:1.15,goal:[10,2,.45]},
 {id:'reliquia',name:'Relicario',role:'Trofeos · ejemplares especiales',delta:[-3,-4,-2,0,8],capacity:.85,cost:1.25,goal:[30,3,.30]}
];
const E208_CATALOG=[];
for(const family of E208_FAMILIES)for(const specialty of E208_SPECIALTIES){
 const [control,speed,luck,resilience,trophy]=family.power.slice(0,5).map((n,i)=>clamp(n+specialty.delta[i],0,[64,40,43,45,45][i]));
 const rod={id:`e208_rod_${family.id}_${specialty.id}`,name:`${family.name} · ${specialty.name}`,price:Math.round(family.price*specialty.cost/5)*5,req:family.req,bonus:control,desc:specialty.role,family:family.id,art:family.art,specialty:specialty.id};
 if(family.quest){
  const zone=E165_ZONES.find(z=>z.id===family.zone),maxReachable=Math.max(...zone.fish.map(id=>e190WeightRange(E16_FISH.find(f=>f.id===id))[1]));
  rod.unlock={zone:family.zone,catches:specialty.goal[0],species:specialty.goal[1],bestKg:family.id==='boreal'&&['pulso','cauce'].includes(specialty.id)?0:Math.round(maxReachable*specialty.goal[2]),title:`${family.name}: ${specialty.name}`};
 }
 E1103_SPECIAL[rod.id]={speed,luck,resilience,trophy,maxKg:Math.min(3000,Math.round(family.power[5]*specialty.capacity)),role:specialty.role};
 E161_RODS.push(rod);E164_ROD_STATS.push({control,wait:speed,rare:luck,label:specialty.role});E208_CATALOG.push(rod);
}
function e208QuestProgress(rod){
 const q=rod.unlock,record=state?.ui?.fishingWeights?.byZone?.[q?.zone]||{};
 const catches=Number(record.catches||0),species=e234SpeciesCount(record,q?.zone),bestKg=Number(record.bestKg||0);
 return {catches,species,bestKg,ready:!!q&&e16FishLevel()>=rod.req&&catches>=q.catches&&species>=q.species&&bestKg>=q.bestKg};
}
function e208QuestText(rod){
 const q=rod.unlock,p=e208QuestProgress(rod),zone=E165_ZONES.find(z=>z.id===q.zone);
 return `${zone.name}: alcanzá Pesca ${rod.req}; capturá ${q.catches} peces (${Math.min(p.catches,q.catches)}/${q.catches}), ${q.species} especies distintas (${Math.min(p.species,q.species)}/${q.species}) ${q.bestKg?'y un pez de '+e190Kg(q.bestKg)+' o más (récord: '+e190Kg(p.bestKg)+').':'sin requisito de peso.'}${e235UnlockHint(rod)}`;
}
function e212QuestGoals(rod){
 const q=rod.unlock,p=e208QuestProgress(rod),zone=E165_ZONES.find(z=>z.id===q.zone);
 const goals=[[e16FishLevel()>=rod.req,'Alcanzá habilidad de Pesca '+rod.req,e16FishLevel()+' de '+rod.req],[p.catches>=q.catches,`Capturá ${q.catches} peces en total`,`${Math.min(p.catches,q.catches)} de ${q.catches}`],[p.species>=q.species,`Capturá ${q.species} especies distintas`,`${Math.min(p.species,q.species)} de ${q.species}`],[p.bestKg>=q.bestKg,`Capturá un pez de ${e190Kg(q.bestKg)} o más`,`Tu récord: ${e190Kg(p.bestKg)}`]].filter((g,i)=>i!==3||q.bestKg>0);
 return `<p>Completá estos objetivos en <b>${esc(zone.name)}</b>:</p><ul class="e212Goals">${goals.map(([done,label,progress])=>`<li class="${done?'done':''}"><span>${done?'✓':'○'} ${esc(label)}</span><b>${esc(progress)}</b></li>`).join('')}</ul><small>Cuenta lo que ya pescaste en esta zona. No se consumen peces; podés venderlos.</small>`;
}
// Retired offers retain their IDs, stats and owned equipment for existing saves.
const E212_OFFERS={junco:['cauce','destello'],sauce:['pulso','fortuna'],marea:['cauce','titan'],nenufar:['fortuna','reliquia'],coral:['pulso','cauce'],fosa:['pulso','titan'],mangle:['cauce','fortuna'],escarcha:['pulso','cauce'],obsidiana:['destello','titan'],celeste:['pulso','reliquia']};
// A single live UI catalogue; IDs and canonical gameplay arrays remain unchanged.
function e221Rods(){return [...new Map([...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD].filter(Boolean).map(r=>[r.id,r])).values()].filter(r=>e212Offered(r)||state?.owned?.[r.id]);}
function e221ZoneImage(zone){return zone?.image||window.e1114ZoneImages?.[zone?.id]||null;}
function e221ZoneOptions(){return E165_ZONES.map(z=>`<option value="${esc(z.id)}">${esc(z.name)}</option>`).join('');}
// These are historical variant IDs, not a whitelist for future content.
const E221_LEGACY_SPECIALTIES=new Set(['pulso','cauce','destello','fortuna','titan','reliquia']);
function e212Offered(rod){return !rod.family||!!rod.unlock||!Object.hasOwn(E212_OFFERS,rod.family)||!E221_LEGACY_SPECIALTIES.has(rod.specialty)||rod.id!==`e208_rod_${rod.family}_${rod.specialty}`||E212_OFFERS[rod.family].includes(rod.specialty);}
function e208FilterShop(shop,expand=false){
 const query=(shop.querySelector('[data-rod-search]')?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const mine=shop.dataset.mine==='true',source=shop.querySelector('[data-rod-filter]')?.value||'all',zone=shop.querySelector('[data-rod-zone]')?.value||'all',sort=shop.querySelector('[data-rod-sort]')?.value||'progression';let count=0;
 shop.querySelectorAll('.rodTier').forEach(tier=>{
  let visible=0;const container=tier.querySelector('.rodRows'),rows=[...tier.querySelectorAll('.rodShopRow')];
  rows.sort((a,b)=>{
   const owned=r=>Number(!!state.owned?.[r.dataset.rodId]);
   if(sort==='progression')return Number(a.dataset.progressionLevel)-Number(b.dataset.progressionLevel)||Number(a.dataset.source==='quest')-Number(b.dataset.source==='quest')||Number(a.dataset.price)-Number(b.dataset.price)||a.dataset.rodId.localeCompare(b.dataset.rodId);
   if(sort==='owned')return owned(b)-owned(a)||Number(b.classList.contains('equipped'))-Number(a.classList.contains('equipped'))||Number(a.dataset.price)-Number(b.dataset.price);
   if(sort==='price')return Number(a.dataset.price)-Number(b.dataset.price);
   if(sort==='levelAsc'||sort==='levelDesc'){const x=a.dataset.requiredLevel,y=b.dataset.requiredLevel;return x===''||y===''?(x===y?a.dataset.rodId.localeCompare(b.dataset.rodId):x===''?1:-1):(sort==='levelDesc'?Number(y)-Number(x):Number(x)-Number(y))||a.dataset.rodId.localeCompare(b.dataset.rodId);}
   return Number(b.dataset[sort])-Number(a.dataset[sort])||owned(b)-owned(a);
  }).forEach(row=>container.append(row));
  for(const row of rows){
   const owned=!!state.owned?.[row.dataset.rodId],text=(row.textContent+' '+(e232RodAliases.get(row.dataset.rodId)||'')).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
   const matches=source==='all'||source==='owned'&&owned||source==='locked'&&!owned||source==='affordable'&&row.dataset.source==='gold'&&!owned&&state.gold>=Number(row.dataset.price)||source===row.dataset.source;
   row.hidden=!(text.includes(query)&&matches&&(!mine||owned)&&(zone==='all'||row.dataset.zone===zone));if(!row.hidden)visible++;
  }
  count+=visible;tier.hidden=visible===0;if(expand&&(query||mine||source!=='all'||zone!=='all')&&visible)tier.open=true;
 });
 const mineButton=shop.querySelector('[data-rod-mine]');if(mineButton)mineButton.setAttribute('aria-pressed',String(mine));
 const result=shop.querySelector('[data-rod-results]');if(result)result.textContent=count+' cañas · '+[...shop.querySelectorAll('.rodShopRow')].filter(row=>state.owned?.[row.dataset.rodId]).length+' en tu colección';
}

function e208CatalogAction(event){
 const button=event.target.closest('[data-catalog-claim],[data-rod-quest]');if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 if(button.hasAttribute('data-rod-quest')){
  const id=button.dataset.rodQuest,newQuest=E208_CATALOG.find(r=>r.id===id)?.unlock,zone=newQuest?.zone|| (id===E17_ROD.id?'muelle':id===E18_ROD.id?'rio':id===E187_ROD.id?'arrecife':E171_QUESTS.find(q=>q.rod.id===id)?.zone);
  const target=E165_ZONES.find(z=>z.id===zone);
  if(!target||e16FishLevel()<target.req){toast('El encargo está en '+(target?.name||'otra zona')+'. Requiere Pesca '+(target?.req||1)+'.');return;}
  e161Fishing=false;e161StopWait();state.ui.fishingZoneId=zone;selectWorkspaceTab('fishing');e16Page();
  const fold=document.querySelector('.e194QuestFold');if(fold){fold.open=true;const target=fold.querySelector(`[data-quest-id="${id}"]`)||fold;if(target.matches('details'))target.open=true;target.closest('.e216Quest')?.setAttribute('open','');target.scrollIntoView({block:'center',behavior:'smooth'});}return;
 }
 const rod=E208_CATALOG.find(r=>r.id===button.dataset.catalogClaim);
 if(!rod?.unlock||state.owned?.[rod.id]||!e208QuestProgress(rod).ready)return;
 state.owned[rod.id]=true;state.ui.fishingRodId=rod.id;
 e161Fishing=false;e161StopWait();persist();renderGame();toast('🏆 Desafío completado: '+rod.name);
}
window.addEventListener('click',e208CatalogAction,true);

