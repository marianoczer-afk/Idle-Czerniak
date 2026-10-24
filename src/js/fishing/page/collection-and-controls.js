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
