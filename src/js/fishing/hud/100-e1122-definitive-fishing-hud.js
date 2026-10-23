
'use strict';
(function(){
 function updateFishingXp(){
  const dock=document.getElementById('combatDock');
  if(!dock?.classList.contains('e188FishingMode')||!state)return;
  const p=e16FishProgress(),title=dock.querySelector('#dockPlayerLevel'),text=dock.querySelector('#dockPlayerXpText'),bar=dock.querySelector('#dockPlayerXpBar');
  const hint=p.max?'Nivel máximo de Pesca (100)':fmt(p.left)+' XP para nivel '+(p.level+1);
  e215SetText(title,'Pesca · Nv '+p.level);
  if(text){e215SetText(text,p.max?'Nivel máximo · '+fmt(p.xp)+' XP':fmt(p.earned)+' / '+fmt(p.need)+' XP · '+p.percent.toFixed(1).replace('.',',')+'%');text.title=hint;}
  if(bar){bar.style.width=p.percent.toFixed(2)+'%';bar.parentElement.title=hint;bar.parentElement.setAttribute('aria-label','Experiencia de pesca');}
 }
 // Actualización final tras el render normal: el HUD de combate escribe el nivel general.
 const priorLive=updateLive;
 updateLive=function(){const result=priorLive.apply(this,arguments);e197Sync();updateFishingXp();return result;};
 const priorHud=e188UpdateHud;
 e188UpdateHud=function(){const result=priorHud.apply(this,arguments);updateFishingXp();return result;};
 const priorRender=renderGame;
 renderGame=function(){const result=priorRender.apply(this,arguments);updateFishingXp();return result;};
 document.addEventListener('pointerup',()=>queueMicrotask(updateFishingXp),true);
 updateFishingXp();
})();
