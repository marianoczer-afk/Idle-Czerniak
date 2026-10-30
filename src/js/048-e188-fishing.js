
"use strict";
/* E1.8.8: quest ingredients accept all quality variants, rods are level-free,
   and the existing combat dock switches to a fishing HUD only on the fishing tab. */
const E188_QUALITY=['legendary','huge','large','normal'];
function e188FishStock(id){
 const inv=state?.inventory||{},base='pez_'+id;
 return E188_QUALITY.reduce((sum,q)=>sum+Math.max(0,Number(inv[q==='normal'?base:base+'__'+q])||0),0);
}
function e188Consume(needs){
 if(!needs.every(n=>e188FishStock(n.id)>=n.qty))return false;
 const inv=state.inventory;
 for(const n of needs){
  let left=n.qty,base='pez_'+n.id;
  // Common fish first, preserving valuable trophies whenever possible.
  for(const q of ['normal','large','huge','legendary']){
   const key=q==='normal'?base:base+'__'+q,have=Math.max(0,Number(inv[key])||0),take=Math.min(left,have);
   if(take){inv[key]-=take;if(!inv[key])delete inv[key];left-=take;}
   if(!left)break;
  }
 }
 return true;
}
// Keep all existing quest buttons, but let rare fish count towards delivery.
e17HasFish=function(){return E17_QUEST.needs.every(n=>e188FishStock(n.id)>=n.qty);};
e171CanDeliver=function(q){return e16FishLevel()>=q.level&&q.needs.every(n=>e188FishStock(n.id)>=n.qty);};


// The previous click handlers run at capture phase. Intercept only the actions we replace.
window.addEventListener('click',e=>{
 const buy=e.target.closest('[data-e161-buy]'),quest=e.target.closest('[data-e17-deliver],[data-e171-deliver],[data-e187-claim]');
 if(!buy&&!quest)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 if(buy){
  const r=E161_RODS[Number(buy.dataset.e161Buy)];if(!r||r.unlock||state.owned?.[r.id]||state.gold<r.price)return;
  state.gold-=r.price;state.owned=state.owned||{};state.owned[r.id]=true;
  state.ui=state.ui||{};state.ui.fishingRodId=r.id;
  if(e161Fishing){e161Fishing=false;e161StopWait();}
  persist();renderGame();toast('🎣 Compraste y equipaste '+r.name);return;
 }
 if(quest.hasAttribute('data-e17-deliver')){
  if(e17Done()||e165Zone().id!=='muelle'||e16FishLevel()<E17_QUEST.level||!e188Consume(E17_QUEST.needs))return;
  state.owned=state.owned||{};state.owned[E17_ROD.id]=true;state.ui=state.ui||{};state.ui.fishingRodId=E17_ROD.id;
  if(e161Fishing){e161Fishing=false;e161StopWait();}
  addLog('Pesca: misión '+E17_QUEST.title+' completada.');persist();renderGame();toast('🏆 ¡Caña del Viejo Pescador conseguida!');return;
 }
 if(quest.hasAttribute('data-e171-deliver')){
  const q=E171_QUESTS.find(x=>x.id===quest.dataset.e171Deliver);
  if(!q||e171Done(q)||e165Zone().id!==q.zone||e16FishLevel()<q.level||!e188Consume(q.needs))return;
  state.owned=state.owned||{};state.owned[q.rod.id]=true;state.ui=state.ui||{};state.ui.fishingRodId=q.rod.id;
  if(e161Fishing){e161Fishing=false;e161StopWait();}
  addLog('Pesca: misión '+q.title+' completada.');persist();renderGame();toast('🏆 ¡Conseguiste '+q.rod.name+'!');return;
 }
 const q=E187_QUESTS.find(x=>x.id===quest.dataset.e187Claim);
 if(!q||e187QuestDone(q)||e165Zone().id!==q.zone||e16FishLevel()<q.req||!e188Consume(q.needs))return;
 e187Rewards()[q.id]=true;
 if(q.kind==='rod'){state.owned=state.owned||{};state.owned[E187_ROD.id]=true;state.ui.fishingRodId=E187_ROD.id;}
 addLog('Pesca: misión '+q.title+' completada.');persist();renderGame();toast('🏆 '+q.reward);
},true);
// Fishing species still require fishing skill, but not an owned rod tier.
const e188PreviousRandom=e161RandomFish;
e161RandomFish=function(){
 const z=e165Zone(),lvl=e16FishLevel(),idx=e164SelectedRodIndex();
 const pool=E16_FISH.filter(f=>z.fish.includes(f.id)&&lvl>=f.req);
 if(!pool.length)return E16_FISH.find(f=>z.fish.includes(f.id))||E16_FISH[0];
 const rare=(E164_ROD_STATS[idx]?.rare||0)/100;
 const weights=pool.map(f=>f.rarity?f.rarity*(1+rare*5):Math.max(.12,1/Math.pow(1+(lvl-f.req)/4,.4)/Math.pow(E161_DIFFICULTY[f.id]||1,2.3)));
 let roll=Math.random()*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<pool.length;i++){roll-=weights[i];if(roll<=0)return pool[i];}
 return pool[pool.length-1];
};
// Fixed HUD: reuse the combat dock; only replace its contents while fishing.
function e188HudNode(){
 const dock=document.getElementById('combatDock');if(!dock)return null;
 let node=document.getElementById('e188FishingHud');if(!node){
  node=document.createElement('div');node.id='e188FishingHud';node.setAttribute('aria-label','Estado de pesca');
  node.innerHTML='<div><div class="e188Head" id="e188HudTitle">🎣 Pesca</div><div class="e188Sub" id="e188HudSub">Esperando una captura</div></div><div><div class="e188Result" id="e188HudResult" role="status">Preparado para pescar</div><div class="e188Track"><div class="e188Fill" id="e188HudFill"></div></div><div class="e188Meta"><span id="e188HudPercent">Captura 0%</span><span id="e188HudZone">—</span></div></div>';
  dock.querySelector('.dockInner')?.append(node);
 }
 return node;
}
// One HUD lifecycle; the order preserves layout, menu behavior and live XP.
let fishingHudMenuSync,fishingHudXpSync;
function fishingRenderHudBase(){
 const dock=document.getElementById('combatDock');if(!dock)return;
 const active=!!(state&&ready&&e161OnPage()&&!document.getElementById('gameScreen')?.classList.contains('hidden'));
 dock.classList.toggle('e188FishingMode',active);
 if(!active){e215PlaceXp(false);measureDock();return;}
 const node=e188HudNode();if(!node)return;
 measureDock();
}
function e188UpdateHud(){
 if(!fishingFinishDepth){
  fishingRenderHudBase();
  e189UpdateArt();
  e194UpdateDockRod();
  e1107Sync();
  e1118SyncHud();
  fishingHudMenuSync();
  fishingHudXpSync();
  fishingPageZoneSync();
  e211SyncHud();
 }
 // This outer artwork phase also ran when the transaction guard skipped updates.
 e229Hud();
}

const e188PriorFinish=e16Finish;
e16Finish=function(won){e188PriorFinish(won);e188UpdateHud();};
const e188PriorTab=selectWorkspaceTab;
selectWorkspaceTab=function(id,save=true){e188PriorTab(id,save);e188UpdateHud();updateLive();};
const e188PriorRender=renderGame;
renderGame=function(){e188PriorRender();e188UpdateHud();};
// Wait for existing page handlers to finish updating the selected zone.
document.addEventListener('click',e=>{if(e.target.closest('[data-e165-zone],[data-e161-toggle]'))queueMicrotask(e188UpdateHud);},false);
