
'use strict';
// Read-only mastery: the existing v7 records and ownership remain the source of truth.
const e216Views=new WeakMap();
function e216View(){let v=e216Views.get(state);if(!v){v={open:false,zone:null,search:'',filter:'all',quests:new Set(),badge:null};e216Views.set(state,v);}return v;}
function e216QuestDefinitions(){
 const delivery=(id,q,reward,done,rodId)=>({id,rodId,zone:q.zone,title:q.title,reward,done,goals:[{label:`Alcanzá habilidad de Pesca ${q.level??q.req}`,have:e16FishLevel(),need:q.level??q.req},...q.needs.map(n=>{const f=E16_FISH.find(f=>f.id===n.id);return{label:`Entregá ${n.qty} ${f?.name||n.id}`,have:e188FishStock(n.id),need:n.qty};})],note:`Habilidad de Pesca ${q.level??q.req}. Entrega de inventario: acepta cualquier tamaño y consume los peces.${q.kind==='xp'?' Mejora permanente activa: se aplica automáticamente a la XP de cada captura.':q.kind==='control'?' Mejora permanente activa: se aplica automáticamente a la barra de captura.':''}`});
 const result=[delivery('e17_viejo',E17_QUEST,E17_ROD.name,!!state.owned?.[E17_ROD.id],E17_ROD.id),...E171_QUESTS.map(q=>delivery(q.id,q,q.rod.name,!!state.owned?.[q.rod.id],q.rod.id)),...E187_QUESTS.map(q=>delivery(q.id,q,q.reward,!!state.ui?.e187Rewards?.[q.id]||(q.kind==='rod'&&!!state.owned?.[E187_ROD.id]),q.kind==='rod'?E187_ROD.id:null))];
 const w=state.ui?.fishingWeights?.byZone?.rio||{};
 result.push({id:'coleccionista',rodId:E18_ROD.id,zone:'rio',title:'El trofeo de las corrientes',reward:E18_ROD.name,done:!!state.owned?.[E18_ROD.id],note:'Capturas históricas del Río del Bosque; no consume peces. Se conserva el crédito de trofeo de las partidas antiguas.',goals:[{label:'Conseguí 5 capturas',have:w.catches||0,need:5},{label:'Descubrí 3 especies distintas',have:Object.values(w.species||{}).filter(n=>n>0).length,need:3},{label:'Capturá un pez de al menos 8 kg',have:w.bestKg||0,need:8}]});
 for(const rod of E208_CATALOG.filter(r=>r.unlock)){const q=rod.unlock,p=e208QuestProgress(rod);result.push({id:rod.id,rodId:rod.id,zone:q.zone,title:q.title,reward:rod.name,done:!!state.owned?.[rod.id],note:'Capturas históricas de esta zona; los tres objetivos son necesarios. No consume peces.',goals:[{label:`Conseguí ${q.catches} capturas`,have:p.catches,need:q.catches},{label:`Descubrí ${q.species} especies distintas`,have:p.species,need:q.species},{label:`Capturá un pez de al menos ${e190Kg(q.bestKg)}`,have:p.bestKg,need:q.bestKg}]});}
 return result;
}
function e216ZoneProgress(zone,definitions=e216QuestDefinitions()){
 const species=[...new Set(zone.fish)],record=state.ui?.e18Fishing?.bySpecies||{},weights=state.ui?.fishingWeights?.bySpecies||{};
 const discovered=species.filter(id=>Number(record[id]?.total)>0||Number(weights[id]?.catches)>0||e188FishStock(id)>0);
 const accredited=!!state.ui?.e191Achievements?.[zone.id],quests=definitions.filter(q=>q.zone===zone.id),done=quests.filter(q=>q.done).length;
 const threshold=Math.ceil(species.length/2),stars=[accredited||discovered.length>=threshold,quests.length?done===quests.length:accredited||discovered.length>0,accredited||discovered.length===species.length];
 return{zone,species,discovered,threshold,quests,done,accredited,stars,count:stars.filter(Boolean).length,complete:stars.every(Boolean)};
}
function e216Stars(p){return `<span class="atlasStars" role="img" aria-label="${p.count} de 3 estrellas">${p.stars.map(done=>`<span class="${done?'earned':''}" aria-hidden="true">${done?'★':'☆'}</span>`).join('')}</span>`;}
function e216BadgeDetails(q){return `<h4>📜 ${esc(q.title)}</h4><ul>${q.goals.map(g=>`<li>✓ ${esc(g.label)}</li>`).join('')}</ul><p>🎁 ${esc(q.reward)}</p><small>${esc(q.note)} · Recompensa ya obtenida; no se vuelve a entregar.</small>`;}
function e216ZoneDetails(p,v){
 const z=p.zone,remaining=p.species.filter(id=>!p.discovered.includes(id)),image=e221ZoneImage(z);
 const goals=[`Descubrir ${p.threshold} especies · ${Math.min(p.discovered.length,p.threshold)}/${p.threshold}`,p.quests.length?`Completar encargos · ${p.done}/${p.quests.length}`:'Primera especie · no tiene encargos',`Colección completa · ${p.discovered.length}/${p.species.length}`];
 const badges=p.quests.filter(q=>q.done),selected=badges.find(q=>q.id===v.badge);
 return `<section class="atlasZoneDetail" aria-label="Ficha de ${esc(z.name)}">${image?`<img class="atlasLandscape" src="${image}" alt="Paisaje de ${esc(z.name)}">`:''}<div class="atlasDetailHead"><h3>${esc(z.name)}</h3>${e216Stars(p)}${p.complete?'<span class="atlasMedal" title="Tres hitos completados">✺ Maestría de zona</span>':''}</div><div class="atlasCounts"><span title="Los descubrimientos se comparten con las colecciones existentes">Especies <b>${p.discovered.length}/${p.species.length}</b></span><span>Encargos <b>${p.done}/${p.quests.length}</b></span><span>${p.accredited?'Colección histórica acreditada':remaining.length?'Faltan '+remaining.length+' especies':'Colección completa'}</span></div><ol class="atlasMilestones">${goals.map((label,i)=>`<li class="${p.stars[i]?'done':''}"><b>${p.stars[i]?'★':'☆'}</b> ${esc(label)}</li>`).join('')}</ol><div class="atlasBadges" aria-label="Recompensas obtenidas">${badges.map(q=>`<button type="button" class="atlasBadge" data-atlas-badge="${q.id}" aria-expanded="${selected?.id===q.id}" title="${esc(q.title+' — '+q.goals.map(g=>g.label).join('; ')+' — Premio: '+q.reward)}">✦ ${esc(q.title)}</button>`).join('')||'<small>Sin insignias de encargos obtenidas.</small>'}${state.ui?.e191Achievements?.[z.id]?'<span class="atlasBadge collectionBadge" title="Premio de colección ya reclamado">◈ Explorador de zona</span>':''}</div>${e222QuestPreview(p,v)}${selected?`<div class="atlasBadgeDetail" tabindex="-1">${e216BadgeDetails(selected)}</div>`:''}</section>`;
}
function e216FilterAtlas(root){
 const v=e216View(),query=v.search.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();let visible=0;
 root.querySelectorAll('[data-atlas-zone]').forEach(row=>{row.hidden=!(row.dataset.name.includes(query)&&(v.filter==='all'||(v.filter==='complete')===(row.dataset.complete==='true')));if(!row.hidden)visible++;});
 if(v.zone&&root.querySelector('[data-atlas-zone="'+v.zone+'"]').hidden){const row=root.querySelector('[data-atlas-zone="'+v.zone+'"]');row.classList.remove('selected');row.setAttribute('aria-pressed','false');row.setAttribute('aria-expanded','false');root.querySelector('.atlasSelection')?.remove();v.zone=null;v.badge=null;}
 root.querySelector('.atlasResults').textContent=visible+' zonas';
}
function e216RenderAtlas(root){
 if(root.querySelector('.atlasRows')){
  const v=e216View(),rows=root.querySelector('.atlasRows'),top=rows.scrollTop;
  rows.querySelector('.atlasSelection')?.remove();
  rows.querySelectorAll('[data-atlas-zone]').forEach(row=>{const selected=row.dataset.atlasZone===v.zone;row.classList.toggle('selected',selected);row.setAttribute('aria-pressed',String(selected));row.setAttribute('aria-expanded',String(selected));if(selected){const detail=document.createElement('div');detail.className='atlasSelection';detail.innerHTML=e216ZoneDetails(e216ZoneProgress(E165_ZONES.find(z=>z.id===v.zone)),v);row.after(detail);}});
  e216FilterAtlas(root);rows.scrollTop=top;return;
 }
 const v=e216View(),defs=e216QuestDefinitions(),zones=E165_ZONES.map(z=>e216ZoneProgress(z,defs));
 root.innerHTML=`<summary>✧ Atlas de Pesca <small>${zones.filter(p=>p.complete).length}/${zones.length} zonas dominadas · ${defs.filter(q=>q.done).length}/${defs.length} encargos</small></summary><div class="atlasTools"><input type="search" data-atlas-search placeholder="Buscar zona…" aria-label="Buscar zona del Atlas"><select data-atlas-filter aria-label="Filtrar Atlas"><option value="all">Todas</option><option value="pending">Pendientes</option><option value="complete">Completas</option></select><small class="atlasResults" aria-live="polite"></small></div><div class="atlasRows" tabindex="0" role="region" aria-label="Zonas del Atlas">${zones.map(p=>`<button type="button" class="atlasRow${v.zone===p.zone.id?' selected':''}" data-atlas-zone="${p.zone.id}" data-name="${esc(p.zone.name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase())}" data-complete="${p.complete}" aria-pressed="${v.zone===p.zone.id}" aria-expanded="${v.zone===p.zone.id}"><b>${esc(p.zone.name)}</b>${e216Stars(p)}<small>${p.complete?'✺ Maestría':p.discovered.length+'/'+p.species.length+' especies · '+p.done+'/'+p.quests.length+' encargos'}</small></button>${v.zone===p.zone.id?`<div class="atlasSelection">${e216ZoneDetails(p,v)}</div>`:''}`).join('')}</div>`;
 root.querySelector('[data-atlas-search]').value=v.search;root.querySelector('[data-atlas-filter]').value=v.filter;e216FilterAtlas(root);e221Header(root,'atlas','Atlas de Pesca',root.querySelector(':scope>summary small')?.textContent||'');
}
function e216AtlasNode(){
 const root=document.createElement('details');root.id='fishingAtlas';root.className='fishingAtlas';root.open=e216View().open;root.__characterState=state;e216RenderAtlas(root);
 root.addEventListener('toggle',()=>{if(root.isConnected&&root.__characterState===state)e216View().open=root.open;});
 root.addEventListener('input',event=>{if(event.target.matches('[data-atlas-search]')){e216View().search=event.target.value;e216FilterAtlas(root);}});
 root.addEventListener('change',event=>{if(event.target.matches('[data-atlas-filter]')){e216View().filter=event.target.value;e216FilterAtlas(root);}});
 root.addEventListener('click',event=>{const zone=event.target.closest('[data-atlas-zone]'),badge=event.target.closest('[data-atlas-badge]');if(!zone&&!badge)return;const v=e216View();if(zone){v.zone=v.zone===zone.dataset.atlasZone?null:zone.dataset.atlasZone;v.badge=null;v.focusQuest=null;}else{v.badge=v.badge===badge.dataset.atlasBadge?null:badge.dataset.atlasBadge;}e216RenderAtlas(root);if(zone)root.querySelector(`[data-atlas-zone="${zone.dataset.atlasZone}"]`)?.focus({preventScroll:true});else root.querySelector(`[data-atlas-badge="${badge.dataset.atlasBadge}"]`)?.focus({preventScroll:true});});
 return root;
}
function e216Remember(){
 const root=document.getElementById('fishingAtlas');if(!root||root.__characterState!==state)return;e216View().scrollTop=root.querySelector('.atlasRows')?.scrollTop||0;
 const v=e216View();v.open=root.open;v.quests=new Set([...document.querySelectorAll('.e216Quest[open]')].map(n=>n.dataset.questKey));
}
function e216CompactQuests(){
 const body=document.querySelector('.e194QuestBody');if(!body)return;
 const definitions=e216QuestDefinitions(),zone=e165Zone().id,v=e216View();
 for(const section of [...body.children]){
  if(section.classList.contains('e216Quest'))continue;
  const claim=section.querySelector('[data-catalog-claim],[data-e187-claim],[data-e171-deliver],[data-e17-deliver]');
  const id=section.dataset.questId||claim?.dataset.catalogClaim||claim?.dataset.e187Claim||claim?.dataset.e171Deliver||(section.matches('.e17Quest')?'e17_viejo':section.querySelector('[data-e18-claim]')?'coleccionista':null);
  const q=definitions.find(q=>q.zone===zone&&(q.id===id||q.title===section.querySelector('h3,b')?.textContent?.replace(/^[📜🏆\s]+/u,'').trim()));if(!q)continue;
  const goals=q.goals,done=goals.filter(g=>g.have>=g.need).length,progress=Math.round(100*goals.reduce((sum,g)=>sum+clamp(g.have/g.need,0,1),0)/goals.length);
  const detail=document.createElement('details');detail.className='e216Quest';detail.dataset.questKey=q.id;detail.open=v.quests.has(q.id);
  const summary=document.createElement('summary');summary.innerHTML=`<span><b>${esc(q.title)}</b><small>🎁 ${esc(q.reward)}</small></span><span class="questRowProgress"><small>${done}/${goals.length} objetivos</small><span class="questMiniTrack" role="progressbar" aria-label="Progreso de ${esc(q.title)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><span style="width:${progress}%"></span></span></span>`;
  section.before(detail);detail.append(summary,section);detail.addEventListener('toggle',()=>{if(!detail.isConnected)return;const set=e216View().quests;detail.open?set.add(q.id):set.delete(q.id);});
 }
}
function e216RodComparison(rod){
 const current=e161Rod(),a=e1101Stats(rod),b=e1101Stats(current),fields=[['Atracción','speed','%'],['Suerte','luck','%'],['Control','control','%'],['Resiliencia','resilience','%'],['Trofeos','trophy','%'],['Capacidad','maxKg',' kg']];
 return fields.map(([label,key,unit])=>{const value=key==='control'?e190ControlPercent(a[key]):a[key],base=key==='control'?e190ControlPercent(b[key]):b[key],delta=Math.round((value-base)*100)/100,format=n=>e225StatFormat.format(Number(n)),diff=delta===0?'=':(delta>0?'▲':'▼')+format(Math.abs(delta))+(key==='maxKg'?' kg':' pp');return `<span class="rodCompare ${delta>0?'better':delta<0?'worse':'same'}" data-stat="${key}" data-delta="${delta}"><span>${label} ${format(value)}${unit}</span><b title="Diferencia respecto a la caña equipada">${diff}</b></span>`;}).join('');
}

