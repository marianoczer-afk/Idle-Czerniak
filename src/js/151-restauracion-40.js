
'use strict';
// Restore the pre-integration horizontal rod artwork in every fishing surface.
e194RodArt=function(id){return e239PreviousResponsive('rod',id)||e231OldRodArt(id);};
e239RodArt=e194RodArt;
e230HudArt=function(kind,id,width,height,category='normal'){
 if(kind==='rod')return e237OriginalHudArt(kind,id,width,height,category);
 return e231ResponsiveArt(kind,id,category).replace('e231ResponsiveArt','e231ResponsiveArt e229HudComposition e230HudComposition');
};

function e240HudVisibility(){
 const dock=document.getElementById('combatDock');if(!dock)return;
 const visible=!!(state&&ready&&state.ui?.tab==='fishing'&&!document.getElementById('gameScreen')?.classList.contains('hidden'));
 dock.classList.toggle('hidden',!visible);
 if(visible)dock.classList.add('e188FishingMode');
 measureDock();
}
const e240OldFrameView=e239SetFrameView;
e239SetFrameView=function(){const out=e240OldFrameView();e240HudVisibility();if(state?.ui?.tab==='fishing')e188UpdateHud();return out;};
const e240OldHud=e188UpdateHud;
e188UpdateHud=function(){e240HudVisibility();const out=e240OldHud();e240HudVisibility();return out;};

function e240ChoosingRod(){return !!document.querySelector('.e1120Menu[data-type="rod"]')||!!document.getElementById('fishingRodShop')?.open;}
function e240PausePreparation(){
 if(e16Session)return false;
 if(e239BubbleTimer!==null){clearTimeout(e239BubbleTimer);e239BubbleTimer=null;}
 e161StopWait();e195Reset();e161Fishing=false;
 document.querySelectorAll('#page_fishing .e196ShakeOverlay,#page_fishing .e195Shake').forEach(n=>n.remove());
 document.getElementById('e16GamePanel')?.classList.remove('e196Shaking');
 return true;
}
// Preparation is paused while browsing gear. An active capture is never changed.
e239QueueBubble=function(){
 if(e239BubbleTimer!==null)return;
 e239BubbleTimer=setTimeout(()=>{
  e239BubbleTimer=null;
  if(!e161OnPage()||document.hidden||!e161CanFish()||e16Session)return;
  if(e240ChoosingRod()){e239QueueBubble();return;}
  if(e195Pending)return;
  e161StopWait();e161Fishing=true;const fish=e161RandomFish();if(fish)e16Start(fish.id);
 },state?Math.max(180,650-(e161Rod()?e1101Stats(e161Rod()).speed:0)*14):250);
};
document.addEventListener('toggle',event=>{
 if(event.target.id!=='fishingRodShop')return;
 if(event.target.isConnected&&event.target.open&&(e195Pending||e161Fishing||e161Waiting!==null)&&e240PausePreparation()){e16Page();e188UpdateHud();}
 e239QueueBubble();
},true);
window.addEventListener('click',event=>{
 if(!state||!ready||busy||managing||!storageReady||simulationLocked())return;
 const anchor=event.target.closest('#combatDock.e188FishingMode .e194DockRod');
 if(anchor&&!e16Session){e240PausePreparation();requestAnimationFrame(()=>{if(e161OnPage()){e16Page();e188UpdateHud();e239QueueBubble();}});return;}
 const b=event.target.closest('[data-e164-equip],[data-e17-equip],[data-e171-equip],[data-e18-equip],[data-e187-equip],.e1120Menu[data-type="rod"] .e1120Choice');
 if(!b)return;
 let id=b.dataset.rodId;
 if(b.hasAttribute('data-e164-equip'))id=E161_RODS[Number(b.dataset.e164Equip)]?.id;
 else if(b.hasAttribute('data-e17-equip'))id=E17_ROD.id;
 else if(b.hasAttribute('data-e171-equip'))id=E171_QUESTS.find(q=>q.id===b.dataset.e171Equip)?.rod.id;
 else if(b.hasAttribute('data-e18-equip'))id=E18_ROD.id;
 else if(b.hasAttribute('data-e187-equip'))id=E187_ROD.id;
 if(!id||!state.owned?.[id])return;
 event.preventDefault();event.stopImmediatePropagation();
 if(e16Session){toast('Terminá la captura actual para cambiar de caña.');return;}
 e240PausePreparation();state.ui.fishingRodId=id;persist();
 e16Page();e188UpdateHud();
 const popup=document.querySelector('.e1120Menu[data-type="rod"]');if(popup)e222RefreshPicker(popup);
 e239QueueBubble();toast('Caña equipada: '+e161Rod().name);
},true);

