
'use strict';
// Presentation events only: never poll saved XP to infer gains.
const e217PendingXP=new Map(),e217ActiveFX=new Map();let e217FlushFrame=0,e217EffectFrame=0;
function e217LiveXP(s){return s===state&&ready&&storageReady&&!busy&&!managing&&!OFF.active&&!simulationLocked()&&!labFrame&&!document.hidden;}
function e217XPEvent(s,key,amount,before,after){
 if(!Number.isFinite(amount)||!(amount>0)||!e217LiveXP(s))return;
 if(key==='pesca'){before=Math.min(100,before);after=Math.min(100,after);}
 const event=e217PendingXP.get(key);
 if(event&&event.s===s){event.amount+=amount;event.after=Math.max(event.after,after);}
 else e217PendingXP.set(key,{s,key,amount,before,after});
 if(!e217FlushFrame)e217FlushFrame=requestAnimationFrame(e217FlushXP);
}
function e217HasLevelFeedback(s){return e217LiveXP(s)&&[...e217PendingXP.values()].some(e=>e.s===s&&e.after>e.before&&e217XPTarget(e.key));}
function e217Visible(node){
 if(!node||!node.isConnected||!node.getClientRects().length||getComputedStyle(node).visibility==='hidden')return false;
 const r=node.getBoundingClientRect();return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
}
function e217XPTarget(key){
 const selectors=key==='pesca'?['#e188FishingHud #dockPlayerXpText','#page_fishing .e187XpLabel','.e197FishingSkills .e197Line b']:
 key==='character'?['#combatDock:not(.e188FishingMode) #dockPlayerXpText','#xpText']:[`#skillsBox [data-skill-key="${key}"] small`];
 for(const selector of selectors){const node=document.querySelector(selector);if(!e217Visible(node))continue;
  const bar=key==='pesca'?(node.closest('.e163XpTrack')||document.querySelector(node.closest('#combatDock')?'#combatDock .dockProgress .bar':'.e197Track')):
   key==='character'?(node.closest('.dockProgress')?.querySelector('.bar')||document.getElementById('xpBar')?.parentElement):node.closest('.skillCard')?.querySelector('.bar');
  if(bar&&e217Visible(bar))return{node,bar};
 }
 return null;
}
function e217EffectRoot(){let root=document.getElementById('e217XpEffects');if(!root){root=document.createElement('div');root.id='e217XpEffects';root.setAttribute('aria-hidden','true');document.body.append(root);}return root;}
function e217FormatXP(n){return Number(n.toFixed(2)).toLocaleString('es-AR');}
function e217SkillLabel(key){return key==='pesca'?'Pesca':key==='character'?'Personaje':key==='weapon'?'Armas':SKILLS.find(s=>s.key===key)?.name||key;}
function e217RemoveFX(id){const f=e217ActiveFX.get(id);if(!f)return;f.node.remove();f.arrow?.remove();f.bar?.classList.remove('e217LevelGlow');e217ActiveFX.delete(id);}
function e217StartFX(event,kind){
 const id=event.key+':'+kind,now=performance.now(),previous=e217ActiveFX.get(id);
 const amount=event.amount;
 if(previous&&kind==='drop'&&previous.s===event.s){
  if(now-previous.started<160){previous.amount+=amount;previous.node.textContent='+'+e217FormatXP(previous.amount)+' XP';}
  else if(previous.next)previous.next.amount+=amount;
  else previous.next={...event};
  return;
 }
 if(previous)e217RemoveFX(id);
 const node=document.createElement('span');node.className=kind==='drop'?'e217XpDrop':'e217LevelNotice';node.dataset.xpSkill=event.key;
 node.textContent=kind==='drop'?'+'+e217FormatXP(amount)+' XP':'¡'+e217SkillLabel(event.key).toLocaleUpperCase('es-AR')+' NIVEL '+event.after+'!';
 let arrow=null;if(kind==='level'){arrow=document.createElement('span');arrow.className='e221LevelArrow';arrow.innerHTML='<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1 1 9h4v10h6V9h4Z" fill="#f0cc70" stroke="#8e6028" stroke-width="1"/></svg>';e217EffectRoot().append(arrow);}
 e217EffectRoot().append(node);e217ActiveFX.set(id,{...event,node,arrow,amount,kind,started:now,updated:now,until:now+(kind==='drop'?1700:2000),bar:null});
}
function e217FlushXP(){
 e217FlushFrame=0;
 for(const event of e217PendingXP.values())if(e217LiveXP(event.s)&&e217XPTarget(event.key)){e217StartFX(event,'drop');if(event.after>event.before)e217StartFX(event,'level');}
 e217PendingXP.clear();if(e217ActiveFX.size&&!e217EffectFrame)e217EffectFrame=requestAnimationFrame(e217PositionFX);
}
function e221TextRect(node){const range=document.createRange();range.selectNodeContents(node);return range.getBoundingClientRect();}
function e221LevelPosition(f,target){
 const b=target.bar.getBoundingClientRect(),hud=target.node.closest('#e188FishingHud');
 const mainCandidate=f.key==='pesca'?document.querySelector('#page_fishing .e163XpTrack'):null,mainRect=mainCandidate?.getBoundingClientRect();
 const layoutKey=[b.x,b.y,b.width,b.height,innerWidth,innerHeight,mainRect?.x,mainRect?.y,mainRect?.width,mainRect?.height,hud?.querySelector('#e188HudResult')?.textContent].join('|');
 if(f.layout?.key===layoutKey)return f.layout.position;
 const blockers=hud?[...hud.querySelectorAll('#e188HudTitle,#e188HudResult,#e188HudPercent,.e214CaptureStatus')].map(e221TextRect):[];
 if(hud)blockers.push(...[...document.querySelectorAll('#combatDock .e189Art,#combatDock .e194DockRod,#e188FishingHud .e188Track')].map(n=>n.getBoundingClientRect()));
 let anchor=target.bar;
 const main=f.key==='pesca'?document.querySelector('#page_fishing .e163XpTrack'):null;
 if(hud&&innerWidth<650&&e217Visible(main))anchor=main;
 let rect=anchor.getBoundingClientRect();f.node.style.fontSize=(innerWidth<650?11:13)+'px';
 let w=f.node.getBoundingClientRect().width,h=f.node.getBoundingClientRect().height,left=rect.left+(rect.width-w)/2,top=rect.bottom+2;
 if(anchor===target.bar&&hud){
  const boundary=hud.getBoundingClientRect(),overlaps=(x,y,width,height)=>blockers.some(r=>x<r.right&&x+width>r.left&&y<r.bottom&&y+height>r.top);
  let placed=false;
  for(const size of [13,11,10,9,8]){f.node.style.fontSize=size+'px';const box=f.node.getBoundingClientRect();w=box.width;h=box.height;left=rect.left+(rect.width-w)/2;
   for(let y=rect.bottom+2;y+h<=boundary.bottom;y+=2)if(!overlaps(left,y,w,h)){top=y;placed=true;break;}if(placed)break;
  }
  if(!placed){top=rect.bottom+2;f.node.style.fontSize='8px';}
 }
 f.node.dataset.anchor=anchor===main?'main':'hud';
 if(f.arrow){const level=hud?document.getElementById('dockPlayerLevel'):f.key==='character'?document.getElementById('dockPlayerLevel'):target.node.closest('.skillCard')?.querySelector('.row b');
  if(level){const r=e221TextRect(level);f.arrow.style.left=Math.min(innerWidth-15,r.right+4)+'px';f.arrow.style.top=Math.max(1,r.top-11)+'px';}
 }
 const position={left,top};f.layout={key:layoutKey,position};return position;
}
function e217PositionFX(){
 e217EffectFrame=0;const now=performance.now();
 for(const [id,f] of e217ActiveFX){
  const target=e217LiveXP(f.s)?e217XPTarget(f.key):null;
  if(now>=f.until||!target){const next=f.next;e217RemoveFX(id);if(target&&next&&e217LiveXP(next.s))e217StartFX(next,'drop');continue;}
  if(f.kind==='drop'&&f.anchor!==target.node){const style=getComputedStyle(target.node);f.node.style.fontFamily=style.fontFamily;f.node.style.fontSize=(parseFloat(style.fontSize)*.96)+'px';f.node.style.fontWeight=style.fontWeight;f.node.style.lineHeight=style.lineHeight;f.anchor=target.node;}
  const range=document.createRange();range.selectNodeContents(target.node);const r=range.getBoundingClientRect(),b=target.bar.getBoundingClientRect(),w=f.node.getBoundingClientRect().width;
  const celebration=f.kind==='level'?e221LevelPosition(f,target):null;
  const left=f.kind==='drop'?r.left-w-6:celebration.left,top=f.kind==='drop'?r.top:celebration.top;
  f.node.style.left=Math.max(6,Math.min(innerWidth-w-6,left))+'px';f.node.style.top=Math.max(6,top)+'px';
  if(f.kind==='level'&&f.bar!==target.bar){f.bar?.classList.remove('e217LevelGlow');f.bar=target.bar;f.bar.classList.add('e217LevelGlow');}
 }
 if(e217ActiveFX.size)e217EffectFrame=requestAnimationFrame(e217PositionFX);else document.getElementById('e217XpEffects')?.remove();
}

function e219ClearXPEffects(){
 cancelAnimationFrame(e217FlushFrame);cancelAnimationFrame(e217EffectFrame);e217FlushFrame=0;e217EffectFrame=0;
 e217PendingXP.clear();for(const id of [...e217ActiveFX.keys()])e217RemoveFX(id);
 document.getElementById('e217XpEffects')?.remove();
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)e219ClearXPEffects();});

function e217CleanClone(page){page.querySelectorAll('#e217XpEffects,.e1120Menu').forEach(n=>n.remove());page.querySelectorAll('.e217LevelGlow').forEach(n=>n.classList.remove('e217LevelGlow'));}

