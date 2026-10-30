
'use strict';
// Display the earliest level/capacity at which the record is possible. No RNG changes.
function e235UnlockHint(rod){
 const q=rod.unlock;if(!q||!q.bestKg)return '';
 const zone=E165_ZONES.find(z=>z.id===q.zone),candidates=zone.fish.map(id=>E16_FISH.find(f=>f.id===id)).filter(f=>e190WeightRange(f)[1]>=q.bestKg).sort((a,b)=>a.req-b.req);
 const fish=candidates[0];if(!fish)return '';
 return ' Para ese peso: '+fish.name+' (Pesca '+fish.req+' o más); capacidad mínima '+e190Kg(q.bestKg)+'.';
}
function e235QuestGuide(q){
 const rod=E208_CATALOG.find(r=>r.id===q.rodId);if(!rod?.unlock)return '';
 return '<small class="e235QuestGuide">'+(rod.unlock.bestKg?'Desafío opcional':'Encargo de progresión')+esc(e235UnlockHint(rod))+'</small>';
}
function e235QuestNotice(){
 if(!state)return;
 const page=document.getElementById('page_fishing'),book=page?.querySelector('.e186Book>.e221BookHeader .e221HeaderWords>b');
 if(book&&!book.querySelector('.e235Chevron')){const arrow=document.createElement('span');arrow.className='e235Chevron';arrow.setAttribute('aria-hidden','true');arrow.textContent='▸';book.append(arrow);}
 const fold=page?.querySelector('.e194QuestFold'),summary=fold?.querySelector(':scope>summary');if(!summary)return;
 const count=e216QuestDefinitions().filter(q=>q.zone===e165Zone().id&&!q.done&&q.goals.every(g=>g.have>=g.need)).length;
 summary.querySelector('.e235QuestNotice')?.remove();
 if(count){const notice=document.createElement('span');notice.className='e235QuestNotice';notice.setAttribute('role','status');notice.textContent='✦ '+count+' '+(count===1?'recompensa lista':'recompensas listas');summary.append(notice);}
}
function e235CatchFlash(){
 const node=document.querySelector('#combatDock.e188FishingMode .e189Art');if(!node)return;
 if(node.e235FlashTimer)clearTimeout(node.e235FlashTimer);
 node.classList.remove('e235CatchFlash','e235RareCatch');
 void node.offsetWidth;
 const category=e220QualityKey(state.ui?.lastFishingCatch?.quality);
 node.classList.toggle('e235RareCatch',['huge','legendary'].includes(category)||!!state.ui?.lastFishingCatch?.newAbsoluteRecord);
 node.classList.add('e235CatchFlash');
 node.e235FlashTimer=setTimeout(()=>{node.classList.remove('e235CatchFlash','e235RareCatch');node.e235FlashTimer=null;},850);
}
