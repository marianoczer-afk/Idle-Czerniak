'use strict';
// Small presentation changes on the existing lifecycle; no save migration.
function e229CollectionBadge(zone,css=''){
 return '<span class="e229CollectionSeal '+css+'" role="img" aria-label="Insignia de colección de '+esc(zone.name)+'">'+(e227Illustration('collection',zone.id)||e227ZoneArt(zone))+'</span>';
}
function e229Reward(q){return q.rodId?e194RodArt(q.rodId):e227Illustration('ui',q.goals.some(g=>/Entregá/.test(g.label))?'quest-delivery':'quest-exploration');}
function e229Polish(){
 if(!state||fishingFinishDepth)return;const page=document.getElementById('page_fishing');if(!page)return;
 const zone=e165Zone(),banner=page.querySelector('.e1123ZoneBanner'),book=page.querySelector('.e186Book'),info=page.querySelector('.e165ZoneInfo');
 if(banner&&book){let scene=page.querySelector('.e229Scene');if(!scene){scene=document.createElement('section');scene.className='e229Scene';banner.before(scene);}scene.append(banner,book);if(info){const text=banner.querySelector('.e1123ZoneBannerText span');if(text)text.textContent=info.textContent;info.remove();}}
 if(book){const achievement=book.querySelector('.e191Achievement'),summary=book.querySelector(':scope>summary');if(achievement&&summary){const claimed=!!state.ui?.e191Achievements?.[zone.id],button=achievement.querySelector('[data-e191-claim]'),award=document.createElement('span');award.className='e229CollectionAward';award.dataset.awardState=claimed?'earned':button?'claimable':'pending';award.setAttribute('aria-label',claimed?'Insignia obtenida':button?'Insignia disponible para reclamar':'Insignia pendiente: completá la colección');award.title=award.getAttribute('aria-label');award.innerHTML=e229CollectionBadge(zone)+(claimed?'<svg class="e230AwardCheck" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-9" fill="none" stroke="currentColor" stroke-width="2"/></svg>':'');if(button){button.textContent='Reclamar insignia';award.append(button);}summary.append(award);achievement.remove();}}
 let fold=page.querySelector('.e194QuestFold');const group=page.querySelector('.e171Quests');if(!fold&&group&&e216QuestDefinitions().some(q=>q.zone===zone.id)){fold=document.createElement('details');fold.className='e194QuestFold';fold.open=e194QuestOpen;fold.addEventListener('toggle',()=>{if(fold.isConnected)e194QuestOpen=fold.open;});fold.innerHTML='<summary></summary><div class="e194QuestBody"></div>';group.prepend(fold);}const body=fold?.querySelector('.e194QuestBody');
 if(fold&&body){const defs=e216QuestDefinitions().filter(q=>q.zone===zone.id),summary=fold.querySelector(':scope>summary');if(summary){summary.innerHTML='<span class="e229QuestHeaderArt">'+e227Illustration('ui','quests-header')+'</span><span><b>Encargos de la zona</b><small>'+defs.filter(q=>!q.done).length+' pendientes · '+defs.filter(q=>q.done).length+' completados</small></span>';}
  e230RenderQuests(body,defs,zone);
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
// Transparent foregrounds replace the old blurred/masked source-strip simulation.
function e229HudArt(kind,id,width,height){return e230HudArt(kind,id,width,height);}
function e229Hud(){if(!state||!e161OnPage())return;for(const [kind,id,selector] of [['rod',e161Rod()?.id,'#combatDock .e194DockRodArt'],['fish',state.ui?.lastFishingCatch?.id,'#combatDock .e189Art']]){const node=document.querySelector(selector);if(!node||!id)continue;const r=node.getBoundingClientRect(),height=r.height-(kind==='fish'?12:0),key=id+':'+Math.round(r.width)+':'+Math.round(height);if(node.dataset.hudComposition===key&&node.querySelector('.e229HudComposition'))continue;const art=e229HudArt(kind,id,r.width,height);if(art){node.innerHTML=art;node.dataset.hudComposition=key;}}if(typeof e231RarityHud==='function')e231RarityHud();}
const e229PreviousHud=e188UpdateHud;
e188UpdateHud=function(){const result=e229PreviousHud();e229Hud();return result;};
