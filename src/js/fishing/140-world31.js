'use strict';
/* @include src/catalogs/140-regional31.js */
E228_REGIONAL_QUESTS.push(...E231_QUESTS.filter(q=>q.rodId));
for(const q of E231_QUESTS)for(const g of q.goals){if(g.id)g.id=e234ZoneId(q.zone,g.id);if(g.ids)g.ids=g.ids.map(id=>e234ZoneId(q.zone,id));}
// Artwork stays shared: transparent cutouts, one water background and masked highlights.
const e231OldRodArt=e194RodArt,e231OldFishArt=e189FishSVG,e231OldIcon=e228Icon;
const e231ArtNames=new Map([...E16_FISH.map(f=>['fish:'+f.id,f.name]),...e221Rods().map(r=>['rod:'+r.id,r.name])]);
function e231ResponsiveArt(kind,id,category='normal'){
 const variant=kind==='fish'?E227_ART['specimen-'+category+':'+id]:null;const f=variant||E227_ART['hud-'+kind+':'+id],water=E227_ART['ui:water'];if(!f||!water)return '';
 const key='e231-responsive-'+(++e231ArtSerial),name=e231ArtNames.get(kind+':'+id)||(kind==='fish'?E16_FISH.find(f=>f.id===id)?.name:e221Rods().find(r=>r.id===id)?.name);
 return `<svg class="${kind==='rod'?'rodIllustration':'fishIllustration'} e231ResponsiveArt" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(name||id)}" data-foreground="alpha" data-specimen-category="${category}"><rect width="100%" height="100%" fill="url(#argentum-water-skin)"/><use class="e231Subject" href="#${f.symbol}" width="100%" height="100%"/>${variant||E234_BY_ID.has(id)?'':e232SpecimenLayer(f.symbol,key,category)}</svg>`;
}
e194RodArt=function(id){return e231ResponsiveArt('rod',id)||e231OldRodArt(id);};
e189FishSVG=function(id){return e231ResponsiveArt('fish',id)||e231OldFishArt(id);};
e228Icon=function(key){return e227Illustration('attribute',key,'e231Attribute')||e231OldIcon(key);};
function e231RarityHud(){
 const node=document.querySelector('#combatDock .e189Art'),id=state?.ui?.lastFishingCatch?.id;if(!node||!id)return;
 const key=id+':'+E16_FISH.length+':'+E165_ZONES.length;if(node.dataset.rarityKey===key&&node.querySelector('.e231RarityBadge'))return;
 const chance=e222DifficultyReference().get(id)?.chance;if(!Number.isFinite(chance))return;
 const name=e228Rarity(chance),tones={'Frecuente':'common','Poco común':'uncommon','Rara':'rare','Muy rara':'very-rare','Excepcional':'exceptional','Mítica':'mythic'};
 let badge=node.querySelector('.e231RarityBadge');if(!badge){badge=document.createElement('span');badge.className='e231RarityBadge';node.append(badge);}node.dataset.rarityKey=key;badge.dataset.rarity=tones[name];badge.textContent=name;badge.title='Rareza de especie: '+name+'. Referencia sin suerte a nivel 100; es independiente de Grande, Enorme o Legendario.';
}
// Restyle recorded specimens, not the unrelated rarity of their species.
const e231PreviousJournal=e230StyleJournalCard;
e230StyleJournalCard=function(card,id,record){e231PreviousJournal(card,id,record);const category=card.dataset.catchCategory,art=card.querySelector('.e218Art');if(!art)return;const key=id+':'+category;if(art.dataset.specimenStyle===key)return;art.innerHTML=e231ResponsiveArt('fish',id,category)||e231OldFishArt(id);art.dataset.specimenStyle=key;};

// Read-only results are reused only inside one synchronous page render. Claims,
// imports, character changes and later events always compute fresh progress.
let e231RenderDepth=0,e231QuestCache=null,e231ReferenceCache=null;
const e231Definitions=e216QuestDefinitions,e231Reference=e222DifficultyReference;
e216QuestDefinitions=function(){if(!e231RenderDepth)return e231Definitions();return e231QuestCache||(e231QuestCache=e231Definitions());};
e222DifficultyReference=function(){if(!e231RenderDepth)return e231Reference();return e231ReferenceCache||(e231ReferenceCache=e231Reference());};
