'use strict';
/* @include src/catalogs/130-expansion.js */
for(const row of E227_FISH){const {difficulty,weight,...fish}=row;E16_FISH.push(fish);E161_DIFFICULTY[row.id]=difficulty;E190_WEIGHT_RANGES[row.id]=weight;}
E165_ZONES.push(...E227_ZONES);
// Behaviour profiles only for new species. Existing capture/rarity formulas are untouched.
Object.assign(E210_CAPTURE_PROFILES,{
 congrio_archivo:{speed:1.06,run:1.35,gain:.98,loss:1.04},tetra_prismatico:{speed:1.18,run:1.10,gain:1,loss:1.06},
 ajolote_cuarzo:{speed:1.03,run:1.14,gain:1,loss:1},esturion_geoda:{speed:1.08,run:1.25,gain:.96,loss:1.06},
 quimera_ambar:{speed:1.12,run:1.25,gain:.97,loss:1.08},titan_ammonita:{speed:.98,run:1.4,gain:.94,loss:1.10}
});
function e227Discovered(s,id){
 const inv=s.inventory||{},base='pez_'+id;
 return Number(s.ui?.e18Fishing?.bySpecies?.[id]?.total)>0||Number(s.ui?.fishingWeights?.bySpecies?.[id]?.catches)>0||E188_QUALITY.some(q=>Number(inv[q==='normal'?base:base+'__'+q])>0);
}
function e227HistoricalDone(s,q){return !!(q.rodId?s.owned?.[q.rodId]:s.ui?.e187Rewards?.[q.id]);}
function e227MigrateMastery(s){
 if(!s||s.ui?.fishingMasteryVersion>=27)return s;
 s.ui=s.ui||{};
 // New optional fields only. Never replace unknown UI data or existing earned bits.
 const earned=s.ui.fishingMasteryEarned&&typeof s.ui.fishingMasteryEarned==='object'&&!Array.isArray(s.ui.fishingMasteryEarned)?s.ui.fishingMasteryEarned:{};
 for(const zone of E227_MASTERY_BASELINE){
  const found=zone.speciesIds.filter(id=>e227Discovered(s,id)).length,accredited=!!s.ui.e191Achievements?.[zone.zoneId];
  const qs=E227_OLD_QUESTS.filter(q=>zone.mainQuestIds.includes(q.id));
  const stars=[accredited||found>=Math.ceil(zone.speciesIds.length/2),qs.length?qs.every(q=>e227HistoricalDone(s,q)):accredited||found>0,accredited||found===zone.speciesIds.length];
  const mask=stars.reduce((a,b,i)=>a|(b?1<<i:0),0);earned[zone.zoneId]=(Number(earned[zone.zoneId])||0)|mask;
 }
 s.ui.fishingMasteryEarned=earned;s.ui.fishingMasteryVersion=27;return s;
}
function e227EarnMastery(){
 if(!state)return;e227MigrateMastery(state);
 const defs=e216QuestDefinitions();for(const zone of E165_ZONES){const p=e216ZoneProgress(zone,defs),mask=p.stars.reduce((a,b,i)=>a|(b?1<<i:0),0);state.ui.fishingMasteryEarned[zone.id]=(Number(state.ui.fishingMasteryEarned[zone.id])||0)|mask;}
}
// Decode runs for every character, including inactive ones; no storage writes during decode.
const e227PreviousMigration=migrateState;
migrateState=function(s,version){return e227MigrateMastery(e227PreviousMigration(s,version));};
const e227PreviousRecord=makeRosterRecord;
makeRosterRecord=function(){if(state&&ready)e227EarnMastery();return e227PreviousRecord();};
function e227QuestGoal(q,goal){
 const zone=E165_ZONES.find(z=>z.id===q.zone),record=state.ui?.fishingWeights?.byZone?.[q.zone]||{};
 if(goal.kind==='captures')return{label:`Conseguí ${goal.need} capturas en ${zone.name}`,have:Number(record.catches)||0,need:goal.need};
 if(goal.kind==='weight')return{label:`Récord local de al menos ${e190Kg(goal.need)}`,have:Number(record.bestKg)||0,need:goal.need};
 if(goal.kind==='speciesWeight')return{label:`Capturá ${E16_FISH.find(f=>f.id===goal.id).name} de al menos ${e190Kg(goal.need)}`,have:Number(state.ui?.fishingWeights?.bySpecies?.[goal.id]?.bestKg)||0,need:goal.need};
 const ids=goal.ids||zone.fish;return{label:goal.ids?'Descubrí '+ids.map(id=>E16_FISH.find(f=>f.id===id).name).join(' y '):`Descubrí ${goal.need} especies de ${zone.name}`,have:ids.filter(id=>e227Discovered(state,id)).length,need:goal.need};
}
function e227QuestDefinitions(){return E227_QUESTS.map(q=>({...q,reward:`Insignia · ${fmt(q.gold)} oro`,done:!!state.ui?.fishingQuestRewards?.[q.id],goals:q.goals.map(g=>e227QuestGoal(q,g)),note:(q.description?q.description+' ':'')+(q.masteryRole==='supplemental'?'Encargo complementario: no cambia las estrellas históricas. Cuenta el progreso guardado; no consume peces.':'Encargo principal de maestría. Cuenta el progreso guardado; no consume peces ni exige la especie mítica.')}));}
function e227RenderQuests(){
 const group=document.querySelector('#page_fishing .e171Quests');if(!group||!state)return;
 const qs=e227QuestDefinitions().filter(q=>q.zone===e165Zone().id&&!q.done);if(!qs.length)return;
 let fold=group.querySelector('.e194QuestFold');if(!fold){fold=document.createElement('details');fold.className='e194QuestFold';fold.open=e194QuestOpen;fold.innerHTML='<summary></summary><div class="e194QuestBody"></div>';fold.addEventListener('toggle',()=>{e194QuestOpen=fold.open;});group.prepend(fold);}
 const body=fold.querySelector('.e194QuestBody');
 for(const q of qs){const section=document.createElement('section');section.className='e227Quest';section.dataset.questId=q.id;section.innerHTML=`<b>${esc(q.title)}</b><ul>${q.goals.map(g=>`<li>${esc(g.label)} · ${fmt(Math.min(g.have,g.need))}/${fmt(g.need)}</li>`).join('')}</ul><small>${esc(q.note)}</small><div class="actions"><span>${esc(q.reward)}</span><button data-expansion-claim="${q.id}" ${q.goals.every(g=>g.have>=g.need)?'':'disabled'}>Reclamar recompensa</button></div>`;body.append(section);}
 fold.querySelector(':scope>summary').textContent='Encargos de esta zona ('+body.children.length+')';e216CompactQuests();
}
const e227PriorPage=e16Page;
e16Page=function(){if(state)e227MigrateMastery(state);const result=e227PriorPage();e227RenderQuests();return result;};
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-expansion-claim]');if(!button)return;
 event.preventDefault();if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session||e195Pending)return;
 const q=e227QuestDefinitions().find(q=>q.id===button.dataset.expansionClaim);
 if(!q||q.done||q.zone!==e165Zone().id||!q.goals.every(g=>g.have>=g.need)||!Number.isSafeInteger(state.gold+q.gold))return;
 state.ui.fishingQuestRewards=state.ui.fishingQuestRewards||{};state.ui.fishingQuestRewards[q.id]=true;state.gold+=q.gold;
 addLog('Pesca: '+q.title+' · '+q.reward);e227EarnMastery();persist();e16Page();updateLive();toast('Encargo completado: '+q.title);
});
