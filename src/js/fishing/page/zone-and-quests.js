// Ordered presentation work; blocks isolate locals and early exits. No captured predecessors.
function fishingRenderZoneAndQuests(){
 rodRows: { // 023-e164-update.js
e164RenderRods();
 }
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
 if(species){species.innerHTML=E16_FISH.filter(f=>z.fish.includes(f.id)).map(f=>`<div class="${lvl<f.req?'fishLocked':''}">${f.icon} <b>${f.name}</b><div class="fishMuted">${lvl>=f.req?'Disponible':'🔒 Pesca '+f.req} · ${fmt(f.price)} oro al vender · ${fmt(f.xp)} XP</div></div>`).join('');}

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
 const activeId=e172RodId();
 const rods=page.querySelector('details:has(.fishRod)');
 if(rods){
  // Reconstruir solo los estados de equipamiento, incluidos los premios de quest.
  rods.querySelectorAll('.fishRod').forEach(row=>{
   const b=row.querySelector('b');if(!b)return;
   const name=b.textContent.replace(/^[✓🏆\s]+/u,'').trim();
   const rod=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod)].find(r=>r.name===name);
   if(!rod)return;
   const equipped=rod.id===activeId;
   b.textContent=(equipped?'✓ ':'')+rod.name;
   row.classList.toggle('e164RodActive',equipped);
   row.classList.toggle('e172Equipped',equipped);
   const btn=row.querySelector('[data-e164-equip],[data-e17-equip],[data-e171-equip]');
   if(btn){btn.textContent=equipped?'✓ Equipada':'Equipar';btn.disabled=equipped;}
   row.querySelectorAll('.e172Label').forEach(el=>el.remove());
   if(equipped&&!btn){const label=document.createElement('span');label.className='e172Label';label.textContent='✓ Equipada';row.append(label);}
  });
  const summary=rods.querySelector('summary');
  if(summary)summary.textContent='🎣 Cañas y estadísticas · '+(e161Rod()?.name||'Sin caña');
 }
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
  const values=document.createElement('span');values.textContent=' · +'+fmt(c.xp)+' XP de Pesca · '+fmt(c.price)+' oro al vender';
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
  const values=result.querySelector('span');if(values)values.textContent=' · +'+fmt(e182LastCatch.xp)+' XP de Pesca · '+fmt(e182LastCatch.price)+' oro al vender';
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
