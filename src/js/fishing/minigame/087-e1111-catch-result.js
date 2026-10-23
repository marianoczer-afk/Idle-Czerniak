
"use strict";
/* A catch is one transaction: run the existing award rules once, then render and save once.
   Feedback remains readable in the HUD without delaying the next attempt. */
let e1111ResultUntil=0,e1111ResultTimer=null;
function e215SetText(node,text){if(node&&node.textContent!==text)node.textContent=text;}
function e215PlaceXp(fishing){
 const dock=document.getElementById('combatDock'),xp=dock?.querySelector('.dockProgress');
 const target=dock?.querySelector(fishing?'#e188FishingHud':'.dockVitals');
 if(xp&&target&&xp.parentElement!==target)target.prepend(xp);
}
function e211SyncHud(){
 if(!state)return;
 if(!e161OnPage()){e215PlaceXp(false);return;}
 const hud=document.getElementById('e188FishingHud');if(!hud)return;
 e215PlaceXp(true);
 const last=state.ui?.lastFishingCatch,fish=last&&E16_FISH.find(f=>f.id===last.id);
 const title=hud.querySelector('#e188HudTitle'),result=hud.querySelector('#e188HudResult'),percent=hud.querySelector('#e188HudPercent'),art=hud.querySelector('.e189Art');
 const record=!!last?.newAbsoluteRecord;
 if(title.dataset.record!==String(record)){title.innerHTML='<span class="e225CaptureLabel">Última captura</span>'+(record?'<span class="e225LastRecord">Nuevo récord</span>':'');title.dataset.record=String(record);}
 e215SetText(result,fish?(typeof e228FishName==='function'?e228FishName(fish):fish.name)+(last.quality?' · '+last.quality:'')+(last.weightKg?' · '+e190Kg(last.weightKg):''):'Todavía no capturaste un pez');
 e215SetText(percent,fish?'+'+fmt(last.xp)+' XP · '+fmt(last.price)+' oro al vender':'Tu próxima captura aparecerá acá');
 const track=hud.querySelector('.e188Track'),fill=hud.querySelector('#e188HudFill');
 if(track&&fill){
  let label=hud.querySelector('.e214CaptureStatus');
  if(!label){label=document.createElement('div');label.className='e214CaptureStatus';track.parentElement.append(label,track);}
  const progress=e16Session?Math.round(clamp(e16Session.progress,0,1)*100):0;
  e215SetText(label,e16Session?'Captura actual · '+progress+'%':e195Pending?'Preparando la picada · '+e195Pending.left+' toques':e161Fishing?'Esperando una picada…':'Sin captura en curso');
  if(fill.style.width!==progress+'%')fill.style.width=progress+'%';track.setAttribute('role','progressbar');track.setAttribute('aria-label','Progreso de la captura actual');track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax','100');track.setAttribute('aria-valuenow',String(progress));track.setAttribute('aria-valuetext',label.textContent);
 }
 if(art){
  const key=fish?.id||'empty';
  if(art.dataset.lastCatch!==key||art.querySelector('.fishMysteryArt')){art.innerHTML=fish?e189FishSVG(fish.id):(typeof e228Icon==='function'?e228Icon('hook'):'');if(fish)e223FishBackdrop(art);art.dataset.lastCatch=key;}
  art.classList.remove('e190Mystery');art.setAttribute('aria-label','Volver a la pesca'+(fish?' · última captura: '+fish.name:''));
 }
}
const e1111PriorFinish=e16Finish;
e16Finish=function(won){
 if(!e16Session||fishingFinishDepth)return;
 const caught=won?{fish:e16Session.fish,weightKg:e16Session.weightKg,rodId:e16Session.rodId,zone:e165Zone().id,legacyRiverTrophy:!!state.ui?.e18Fishing?.riverHuge}:null;
 if(!won){e182LastCatch=null;e183LastQuality=null;}
 e1111ResultUntil=Date.now()+1400;
 fishingFinishDepth++;
 try{e1111PriorFinish(won);if(caught)e190RecordWeight(caught);}
 finally{fishingFinishDepth--;}
 if(won&&e182LastCatch&&caught){state.ui.lastFishingCatch={id:caught.fish.id,xp:e182LastCatch.xp,price:e182LastCatch.price,quality:e182LastCatch.quality||'',weightKg:caught.weightKg||0,newAbsoluteRecord:!!caught.newAbsoluteRecord};}
 e16Page();e188UpdateHud();persist();
};
const e1111PriorPage=e16Page;
e16Page=function(){
 const result=e1111PriorPage();
 const page=document.getElementById('page_fishing');
 const dock=page?.querySelector('.e162Dock');
 if(!dock)return result;
 // Durante la pausa, resultado único y bien visible sobre el minijuego.
 if(Date.now()<e1111ResultUntil&&!e16Session&&!e195Pending&&e16Result){
  const existing=dock.querySelector('.fishCatch');
  if(existing){existing.classList.add('e1111CatchNotice');existing.setAttribute('role','status');}
 }
 return result;
};
