
"use strict";
(function(){
 const viewStates=new WeakMap();
 let renderedState=null;
 // Presentation recommendations only. Buying/equipping keeps the existing rules.
 const recommendedLevels={e192_rod_laguna:25,e192_rod_coral:40,e192_rod_abyss:60};
 const tiers=[{key:'all',name:'Todas las cañas',range:'Catálogo completo'}];
 function placeShop(){
  const shop=document.getElementById('fishingRodShop');if(!shop||!state)return;
  if(state.ui?.tab==='fishing')document.querySelector('#page_fishing .e171Quests')?.after(shop);
  else document.getElementById('page_shop')?.prepend(shop);
 }
 function remember(){
  if(!state||renderedState!==state)return;
  const shop=document.getElementById('fishingRodShop');if(!shop)return;
  viewStates.set(state,{open:shop.open,mine:shop.dataset.mine==='true',search:shop.querySelector('[data-rod-search]')?.value||'',filter:shop.querySelector('[data-rod-filter]')?.value||'all',location:e165Zone().id,zone:shop.querySelector('[data-rod-zone]')?.value||'all',sort:shop.querySelector('[data-rod-sort]')?.value||'progression',tiers:Object.fromEntries([...shop.querySelectorAll('.rodTier')].map(d=>[d.dataset.tier,d.open]))});
 }
 function rodRow(rod){
  const index=E161_RODS.findIndex(r=>r.id===rod.id),owned=!!state.owned?.[rod.id],equipped=e161Rod()?.id===rod.id;
  const st=e1101Stats(rod),stats=e216RodComparison(rod);
  let action;
  if(rod.unlock&&!owned)action=e208QuestProgress(rod).ready?`data-catalog-claim="${rod.id}"`:`data-rod-quest="${rod.id}"`;
  else if(index>=0)action=owned?`data-e164-equip="${index}"`:`data-e161-buy="${index}"`;
  else if(!owned)action=`data-rod-quest="${rod.id}"`;
  else if(rod.id===E17_ROD.id)action='data-e17-equip';
  else if(rod.id===E18_ROD.id)action='data-e18-equip';
  else if(rod.id===E187_ROD.id)action='data-e187-equip';
  else action=`data-e171-equip="${E171_QUESTS.find(q=>q.rod.id===rod.id).id}"`;
  const quest=index>=0?null:rod.id===E17_ROD.id?{title:E17_QUEST.title}:E171_QUESTS.find(q=>q.rod.id===rod.id)||(rod.id===E187_ROD.id?E187_QUESTS.find(q=>q.kind==='rod'):null);
  const isQuest=!!rod.unlock||index<0;
  const requirement=isQuest?e210RodRequirement(rod):'Disponible por oro';
  const score=e193RodScore(rod),stars=`<span class="rodShopStars" role="img" aria-label="Valoración general: ${score} de 10 estrellas" title="Valoración orientativa: ${score}/10. Compará cada atributo según el pez."><span aria-hidden="true">${'★'.repeat(score)}<span class="emptyStars">${'☆'.repeat(10-score)}</span></span> ${score}/10</span>`;
  const disabled=equipped||!!e16Session||(!owned&&(!isQuest&&state.gold<rod.price));
  return `<article class="rodShopRow${isQuest?' questRod':''}${equipped?' equipped':''}" data-rod-id="${rod.id}" data-source="${isQuest?'quest':'gold'}" data-zone="${e210RodZone(rod)}" data-price="${rod.price||0}" data-progression-level="${rod.req}" data-required-level="${e217RequiredLevel(rod)??''}" data-control="${st.control}" data-resilience="${st.resilience}" data-speed="${st.speed}" data-luck="${st.luck}" data-trophy="${st.trophy}" data-max-kg="${st.maxKg}"><div class="rodShopArt">${e194RodArt(rod.id)}</div><div class="rodShopInfo"><div class="rodShopTitle"><b>${esc(rod.name)}</b>${stars}<span class="rodSource${isQuest?' quest':''}">${isQuest?'📜 Misión':'🪙 Compra'}</span></div><div class="rodShopStats">${stats}</div><small>${esc(requirement)}${rod.unlock?'':' · '+esc(E1103_SPECIAL[rod.id]?.role||rod.desc)}</small></div><div class="rodShopAction"><span>${!isQuest?fmt(rod.price)+' oro':'Premio de misión'}</span><button class="small" ${action} ${disabled?'disabled':''}>${equipped?'✓ Equipada':owned?'Equipar':rod.unlock?(e208QuestProgress(rod).ready?'Reclamar':'Ver encargo'):isQuest?'Ver encargo':'Comprar'}</button></div></article>`;
 }
 fishingPageShop={remember,render:function(previousShop){

   const page=document.getElementById('page_fishing'),shop=page?.querySelector('details:has(.fishRod)');
   if(!shop||!state)return;
   const view=viewStates.get(state),active=e161Rod();
   const catalog=e221Rods();
   const sameLocation=view?.location===e165Zone().id;
   shop.id='fishingRodShop';shop.dataset.mine=String(view?.mine||false);shop.open=sameLocation?view.open:false;
   shop.innerHTML=`<summary>Tienda de cañas <small>${catalog.length} cañas · ${catalog.filter(r=>state.owned?.[r.id]).length} obtenidas</small></summary><p class="rodShopNote">Obtené cañas con oro o encargos. Compará sus atributos según el pez.<small>Atracción: menos espera y toques · Suerte: especies raras · Control: barra más ancha · Resiliencia: movimiento más suave · Trofeos: mejores ejemplares.</small></p>`;
   for(const tier of tiers){
    const rods=catalog;
    const detail=document.createElement('div');detail.className='rodTier e237UnifiedShop';detail.dataset.tier=tier.key;
    detail.open=sameLocation?(view.tiers[tier.key]??false):false;
    detail.innerHTML=`<div class="rodRows">${rods.map(rodRow).join('')||'<p class="rodShopEmpty">Todavía no hay cañas en esta categoría.</p>'}</div>`;
    shop.append(detail);
   }
   shop.insertAdjacentHTML('afterbegin',`<div class="rodCatalogTools"><input type="search" data-rod-search aria-label="Buscar cañas por nombre, especialidad o zona" placeholder="Buscar caña, especialidad o zona…"><select data-rod-filter aria-label="Filtrar cañas"><option value="all">Todas</option><option value="gold">Por oro</option><option value="quest">De misión</option><option value="owned">Mis cañas</option><option value="locked">Por desbloquear</option><option value="affordable">Puedo comprar</option></select><select data-rod-zone aria-label="Filtrar por zona"><option value="all">Todas las zonas</option>${e221ZoneOptions()}</select><select data-rod-sort aria-label="Ordenar cañas"><option value="progression">Progresión</option><option value="price">Precio: menor a mayor</option><option value="control">Mayor control</option><option value="resilience">Mayor resiliencia</option><option value="speed">Mayor atracción</option><option value="luck">Mayor suerte</option><option value="trophy">Más trofeos</option><option value="maxKg">Mayor capacidad</option></select><button type="button" class="small" data-rod-mine>Mis cañas</button><small data-rod-results aria-live="polite"></small></div>`);
   // Keep summary first for native details semantics.
   shop.prepend(shop.querySelector('summary'));
   shop.querySelector('[data-rod-search]').value=view?.search||'';
   shop.querySelector('[data-rod-filter]').value=view?.filter||'all';
   shop.querySelector('[data-rod-zone]').value=view?.zone||'all';
   shop.querySelector('[data-rod-sort]').value=view?.sort==='owned'?'price':view?.sort||'progression';
   const filter=()=>{e208FilterShop(shop,true);remember();};
   shop.querySelector('[data-rod-mine]').addEventListener('click',()=>{shop.dataset.mine=String(shop.dataset.mine!=='true');filter();});
   shop.addEventListener('input',filter);shop.addEventListener('change',filter);e208FilterShop(shop);
   if(previousShop&&previousShop!==shop)previousShop.remove();
   placeShop();
   e190DecorateFishingPage();e216CompactQuests();
   page.querySelector('h2')?.remove();
   renderedState=state;
   shop.addEventListener('toggle',()=>{if(shop.isConnected)remember();},true);
   return;
  }};
 const previousTab=selectWorkspaceTab;
 selectWorkspaceTab=function(id,save=true){const result=previousTab(id,save);placeShop();return result;};
 window.addEventListener('click',event=>{
  if(!event.target.closest('#combatDock.e188FishingMode .e189Art'))return;
  event.preventDefault();event.stopImmediatePropagation();e190ReturnToFishing();
 });
 window.addEventListener('keydown',event=>{
  if(!['Enter',' '].includes(event.key)||!event.target.matches('#combatDock.e188FishingMode .e189Art'))return;
  event.preventDefault();event.stopImmediatePropagation();e190ReturnToFishing();
 },true);
})();
