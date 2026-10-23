
'use strict';
// Stable acquisition reference, not the player's live chance. No quality/price proxy.
function e222DifficultyReference(){
 const result=new Map();
 for(const zone of E165_ZONES){
  const pool=E16_FISH.filter(f=>zone.fish.includes(f.id)&&f.req<=100&&zone.req<=100),total=pool.reduce((n,f)=>n+e222SpeciesWeight(f,100,0),0);
  for(const fish of pool){const chance=e222SpeciesWeight(fish,100,0)/total,level=Math.max(zone.req,fish.req),old=result.get(fish.id);if(!old||chance>old.chance||chance===old.chance&&level<old.level)result.set(fish.id,{chance,level});}
 }
 return result;
}
function e222QuestForRod(rod){return e216QuestDefinitions().find(q=>q.rodId===rod.id);}
function e222QuestPreview(progress,view){
 const q=progress.quests.find(q=>q.id===view.focusQuest);if(!q)return '';
 return '<section class="e222QuestPreview" tabindex="-1" data-quest-preview="'+esc(q.id)+'"><h4>'+esc(q.title)+'</h4><ul>'+q.goals.map(g=>'<li>'+esc(g.label)+' · '+fmt(Math.min(g.have,g.need))+' / '+fmt(g.need)+'</li>').join('')+'</ul><p>Recompensa: '+esc(q.reward)+(q.done?' · Ya obtenida':'')+'</p><small>'+esc(q.note)+'</small></section>';
}
function e222Highlight(node){if(!node)return;node.classList.remove('e222Highlight');void node.offsetWidth;node.classList.add('e222Highlight');node.onanimationend=()=>{node.classList.remove('e222Highlight');node.onanimationend=null;};node.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
function e222FindRod(rod){
 const quest=e222QuestForRod(rod);
 if(quest){const root=document.getElementById('fishingAtlas');if(!root)return;const view=e216View();view.open=true;view.search='';view.filter='all';view.zone=quest.zone;view.focusQuest=quest.id;root.open=true;root.querySelector('[data-atlas-search]').value='';root.querySelector('[data-atlas-filter]').value='all';e216RenderAtlas(root);const target=root.querySelector('[data-quest-preview]');target?.focus({preventScroll:true});e222Highlight(target);return;}
 const shop=document.getElementById('fishingRodShop');if(!shop)return;shop.open=true;shop.dataset.mine='false';for(const [key,value] of [['search',''],['filter','all'],['zone','all']])shop.querySelector('[data-rod-'+key+']').value=value;shop.querySelector('[data-rod-search]').dispatchEvent(new Event('input',{bubbles:true}));const row=[...shop.querySelectorAll('[data-rod-id]')].find(n=>n.dataset.rodId===rod.id);if(row){row.closest('.rodTier').open=true;e222Highlight(row);}
}
function e222PickerStatus(rod){
 const provenance=e220RodProvenance(rod),level=e217RequiredLevel(rod),owned=!!state.owned?.[rod.id],locked=level!==null&&e16FishLevel()<level;
 return provenance.label+' · '+(locked?'Bloqueada · Requiere Pesca '+level:rod.id===e161Rod()?.id?'✓ Equipada':owned?'Disponible':'No obtenida')+(!owned?(provenance.quest?' · '+e210RodRequirement(rod):' · '+fmt(rod.price)+' oro'):'');
}
function e222RefreshPicker(popup){
 if(!popup)return;const rods=new Map(e221Rods().map(r=>[r.id,r]));for(const row of popup.querySelectorAll('.e1120Choice')){const rod=rods.get(row.dataset.rodId);if(!rod)continue;const active=rod.id===e161Rod()?.id;row.classList.toggle('active',active);row.querySelector('b').textContent=rod.name+(active?'  ✓':'');row.querySelector('.rodComparisons').innerHTML=e216RodComparison(rod);row.querySelector('.rodProvenance').textContent=e222PickerStatus(rod);}
 popup.e222Update?.();
}
