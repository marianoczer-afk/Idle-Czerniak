
"use strict";
// Stable IDs and explicit family budgets. req only groups the display; it never gates a purchase.
/* @include src/catalogs/110-e208-catalog-e208_families.js */
/* @include src/catalogs/110-e208-catalog-e208_specialties.js */
const E208_CATALOG=[];
for(const family of E208_FAMILIES)for(const specialty of E208_SPECIALTIES){
 const [control,speed,luck,resilience,trophy]=family.power.slice(0,5).map((n,i)=>clamp(n+specialty.delta[i],0,[64,40,43,45,45][i]));
 const rod={id:`e208_rod_${family.id}_${specialty.id}`,name:`${family.name} · ${specialty.name}`,price:Math.round(family.price*specialty.cost/5)*5,req:family.req,bonus:control,desc:specialty.role,family:family.id,art:family.art,specialty:specialty.id};
 if(family.quest){
  const zone=E165_ZONES.find(z=>z.id===family.zone),maxReachable=Math.max(...zone.fish.map(id=>e190WeightRange(E16_FISH.find(f=>f.id===id))[1]));
  rod.unlock={zone:family.zone,catches:specialty.goal[0],species:specialty.goal[1],bestKg:Math.round(maxReachable*specialty.goal[2]),title:`${family.name}: ${specialty.name}`};
 }
 E1103_SPECIAL[rod.id]={speed,luck,resilience,trophy,maxKg:Math.min(3000,Math.round(family.power[5]*specialty.capacity)),role:specialty.role};
 E161_RODS.push(rod);E164_ROD_STATS.push({control,wait:speed,rare:luck,label:specialty.role});E208_CATALOG.push(rod);
}
function e208QuestProgress(rod){
 const q=rod.unlock,record=state?.ui?.fishingWeights?.byZone?.[q?.zone]||{};
 const catches=Number(record.catches||0),species=Object.keys(record.species||{}).filter(id=>record.species[id]>0).length,bestKg=Number(record.bestKg||0);
 return {catches,species,bestKg,ready:!!q&&e16FishLevel()>=rod.req&&catches>=q.catches&&species>=q.species&&bestKg>=q.bestKg};
}
function e208QuestText(rod){
 const q=rod.unlock,p=e208QuestProgress(rod),zone=E165_ZONES.find(z=>z.id===q.zone);
 return `${zone.name}: alcanzá Pesca ${rod.req}; capturá ${q.catches} peces (${Math.min(p.catches,q.catches)}/${q.catches}), ${q.species} especies distintas (${Math.min(p.species,q.species)}/${q.species}) y un pez de ${e190Kg(q.bestKg)} o más (récord: ${e190Kg(p.bestKg)}).`;
}
function e212QuestGoals(rod){
 const q=rod.unlock,p=e208QuestProgress(rod),zone=E165_ZONES.find(z=>z.id===q.zone);
 const goals=[[e16FishLevel()>=rod.req,'Alcanzá habilidad de Pesca '+rod.req,e16FishLevel()+' de '+rod.req],[p.catches>=q.catches,`Capturá ${q.catches} peces en total`,`${Math.min(p.catches,q.catches)} de ${q.catches}`],[p.species>=q.species,`Capturá ${q.species} especies distintas`,`${Math.min(p.species,q.species)} de ${q.species}`],[p.bestKg>=q.bestKg,`Capturá un pez de ${e190Kg(q.bestKg)} o más`,`Tu récord: ${e190Kg(p.bestKg)}`]];
 return `<p>Completá estos tres objetivos en <b>${esc(zone.name)}</b>:</p><ul class="e212Goals">${goals.map(([done,label,progress])=>`<li class="${done?'done':''}"><span>${done?'✓':'○'} ${esc(label)}</span><b>${esc(progress)}</b></li>`).join('')}</ul><small>Cuenta lo que ya pescaste en esta zona. No se consumen peces; podés venderlos.</small>`;
}
// Retired offers retain their IDs, stats and owned equipment for existing saves.
/* @include src/catalogs/110-e208-catalog-e212_offers.js */
// A single live UI catalogue; IDs and canonical gameplay arrays remain unchanged.
function e221Rods(){return [...new Map([...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD].filter(Boolean).map(r=>[r.id,r])).values()].filter(r=>e212Offered(r)||state?.owned?.[r.id]);}
function e221ZoneImage(zone){return zone?.image||window.e1114ZoneImages?.[zone?.id]||null;}
function e221ZoneOptions(){return E165_ZONES.map(z=>`<option value="${esc(z.id)}">${esc(z.name)}</option>`).join('');}
// These are historical variant IDs, not a whitelist for future content.
const E221_LEGACY_SPECIALTIES=new Set(['pulso','cauce','destello','fortuna','titan','reliquia']);
function e212Offered(rod){return !rod.family||!!rod.unlock||!Object.hasOwn(E212_OFFERS,rod.family)||!E221_LEGACY_SPECIALTIES.has(rod.specialty)||rod.id!==`e208_rod_${rod.family}_${rod.specialty}`||E212_OFFERS[rod.family].includes(rod.specialty);}
function e208FilterShop(shop,expand=false){
 const query=(shop.querySelector('[data-rod-search]')?.value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const mine=shop.dataset.mine==='true',source=shop.querySelector('[data-rod-filter]')?.value||'all',zone=shop.querySelector('[data-rod-zone]')?.value||'all',sort=shop.querySelector('[data-rod-sort]')?.value||'price';let count=0;
 shop.querySelectorAll('.rodTier').forEach(tier=>{
  let visible=0;const container=tier.querySelector('.rodRows'),rows=[...tier.querySelectorAll('.rodShopRow')];
  rows.sort((a,b)=>{
   const owned=r=>Number(!!state.owned?.[r.dataset.rodId]);
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
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session||e195Pending)return;
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

