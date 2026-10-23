'use strict';
// Small presentation changes on the existing lifecycle; no save migration.
function e229CollectionBadge(zone,css=''){
 // Each illustrated seal uses its own regional landscape, distinct from mastery medals.
 return '<span class="e229CollectionSeal '+css+'" role="img" aria-label="Insignia de colección de '+esc(zone.name)+'">'+e227ZoneArt(zone)+'<span aria-hidden="true">✦</span></span>';
}
function e229Reward(q){return q.rodId?e194RodArt(q.rodId):e227Illustration('ui',q.goals.some(g=>/Entregá/.test(g.label))?'quest-delivery':'quest-exploration');}
function e229Polish(){
 if(!state||fishingFinishDepth)return;const page=document.getElementById('page_fishing');if(!page)return;
 const zone=e165Zone(),banner=page.querySelector('.e1123ZoneBanner'),book=page.querySelector('.e186Book'),info=page.querySelector('.e165ZoneInfo');
 if(banner&&book){let scene=page.querySelector('.e229Scene');if(!scene){scene=document.createElement('section');scene.className='e229Scene';banner.before(scene);}scene.append(banner,book);if(info){const text=banner.querySelector('.e1123ZoneBannerText span');if(text)text.textContent=info.textContent;info.remove();}}
 if(book){const achievement=book.querySelector('.e191Achievement'),summary=book.querySelector(':scope>summary');if(achievement&&summary){const claimed=!!state.ui?.e191Achievements?.[zone.id],button=achievement.querySelector('[data-e191-claim]'),award=document.createElement('span');award.className='e229CollectionAward';award.innerHTML=e229CollectionBadge(zone)+(claimed?'<span class="e229AwardState">Obtenida</span>':button?'':'<span>Colección</span>');if(button){button.textContent='Reclamar insignia';award.append(button);}summary.append(award);achievement.remove();}}
 let fold=page.querySelector('.e194QuestFold');const group=page.querySelector('.e171Quests');if(!fold&&group&&e216QuestDefinitions().some(q=>q.zone===zone.id)){fold=document.createElement('details');fold.className='e194QuestFold';fold.open=e194QuestOpen;fold.addEventListener('toggle',()=>{if(fold.isConnected)e194QuestOpen=fold.open;});fold.innerHTML='<summary></summary><div class="e194QuestBody"></div>';group.prepend(fold);}const body=fold?.querySelector('.e194QuestBody');
 if(fold&&body){const defs=e216QuestDefinitions().filter(q=>q.zone===zone.id),summary=fold.querySelector(':scope>summary');if(summary){summary.innerHTML='<span class="e229QuestHeaderArt">'+e227Illustration('ui','quests-header')+'</span><span><b>Encargos de la zona</b><small>'+defs.filter(q=>!q.done).length+' pendientes · '+defs.filter(q=>q.done).length+' completados</small></span>';}
  for(const q of defs){let row=[...body.querySelectorAll('.e216Quest')].find(n=>n.dataset.questKey===q.id);if(!row&&q.done){row=document.createElement('details');row.className='e216Quest e229Completed';row.dataset.questKey=q.id;row.innerHTML='<summary><span><b>'+esc(q.title)+'</b><small>'+esc(q.reward)+'</small></span><span class="questRowProgress">Completado</span></summary><section>'+e216BadgeDetails(q)+'</section>';body.append(row);}if(!row)continue;row.classList.toggle('e229Completed',q.done);const head=row.querySelector(':scope>summary>span');if(head&&!head.querySelector('.e229RewardArt'))head.insertAdjacentHTML('afterbegin','<span class="e229RewardArt" aria-hidden="true">'+e229Reward(q)+'</span>');}
  for(const row of [...body.querySelectorAll('.e229Completed')])body.append(row);
 }
 const trophy=page.querySelector('.e228TrophyHeaderArt');if(trophy)trophy.innerHTML=e227Illustration('ui','trophy-header');
 const shop=document.querySelector('#fishingRodShop>summary .e221Art');if(shop)shop.innerHTML=e227Illustration('ui','shop-header','',true);
 e228RemoveDecorativeEmoji(page);
}
const e229PreviousPage=e16Page;
e16Page=function(){if(fishingFinishDepth)return;const result=e229PreviousPage();e229Polish();return result;};
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-journal-category]');if(button){const view=e220JournalView();view.category=view.category===button.dataset.journalCategory?null:button.dataset.journalCategory;e220FilterJournal(document.querySelector('.e218Album'));}
 const claim=event.target.closest('.e229CollectionAward');if(claim&&!event.target.closest('button')){event.preventDefault();event.stopPropagation();}
});
// HUD-specific SVG composition: the painted source extends across the card,
// while a separately fitted foreground preserves the complete silhouette.
// Reuses embedded atlas pixels, never a flat-color substitute or duplicated data URI.
function e229HudArt(kind,id,width,height){
 const frame=E227_ART[kind+':'+id];if(!frame)return null;
 const key='hud29-'+kind+'-'+id,w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height)),image='<use href="#'+frame.symbol+'" width="'+frame.width+'" height="'+frame.height+'"/>',view='viewBox="0 0 '+frame.width+' '+frame.height+'" width="'+w+'" height="'+h+'"';
 return '<svg class="'+(kind==='fish'?'fishIllustration':'rodIllustration')+' e229HudComposition" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(kind==='fish'?e228FishName(E16_FISH.find(f=>f.id===id)):E161_RODS.find(r=>r.id===id)?.name||id)+'"><defs><filter id="'+key+'-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter><linearGradient id="'+key+'-edge" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="'+frame.height+'"><stop offset="0" stop-color="black"/><stop offset=".04" stop-color="white"/><stop offset=".96" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><mask id="'+key+'-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="'+frame.width+'" height="'+frame.height+'"><rect width="'+frame.width+'" height="'+frame.height+'" fill="url(#'+key+'-edge)"/></mask></defs><svg viewBox="0 '+(frame.height*.94)+' '+frame.width+' '+(frame.height*.06)+'" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMid slice" overflow="hidden" filter="url(#'+key+'-soft)">'+image+'</svg><svg '+view+' preserveAspectRatio="xMidYMid meet" overflow="hidden"><g mask="url(#'+key+'-mask)">'+image+'</g></svg></svg>';
}
function e229Hud(){if(!state||!e161OnPage())return;for(const [kind,id,selector] of [['rod',e161Rod()?.id,'#combatDock .e194DockRodArt'],['fish',state.ui?.lastFishingCatch?.id,'#combatDock .e189Art']]){const node=document.querySelector(selector);if(!node||!id)continue;const r=node.getBoundingClientRect(),key=id+':'+Math.round(r.width)+':'+Math.round(r.height);if(node.dataset.hudComposition===key&&node.querySelector('.e229HudComposition'))continue;const art=e229HudArt(kind,id,r.width,r.height);if(art){node.innerHTML=art;node.dataset.hudComposition=key;}}}
const e229PreviousHud=e188UpdateHud;
e188UpdateHud=function(){const result=e229PreviousHud();e229Hud();return result;};
