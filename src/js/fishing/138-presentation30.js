'use strict';
// Read-only presentation. No persistence, simulation or reward calculations here.
let e231ArtSerial=0;
function e230HudArt(kind,id,width,height,category='normal'){
 const f=E227_ART['hud-'+kind+':'+id],water=E227_ART['ui:water'];if(!f||!water)return '';
 const w=Math.max(1,Math.round(width)),h=Math.max(1,Math.round(height)),key='e231-art-'+(++e231ArtSerial);
 const label=e231ArtNames.get(kind+':'+id);
 const glints=['large','huge','legendary'].includes(category),color=category==='legendary'?'#ffe19a':category==='huge'?'#aee9ff':'#d5ecc3';
 const dots=glints?'<g class="e231ScaleGlints" mask="url(#'+key+'-body)" fill="'+color+'">'+[[.25,.40],[.38,.55],[.51,.38],[.58,.62],[.67,.45],[.75,.56]].map(([x,y],i)=>'<path opacity="'+(category==='legendary'?.82:.55)+'" d="M'+(w*x)+' '+(h*y-3)+'l1.2 2 3 .8-3 .8-1.2 2-1.2-2-3-.8 3-.8Z"/>').join('')+'</g>':'';
 return `<svg class="${kind==='rod'?'rodIllustration':'fishIllustration'} e229HudComposition e230HudComposition" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label||id)}" data-foreground="alpha" data-specimen-category="${category}"><defs><pattern id="${key}-water" width="${w}" height="${h}" patternUnits="userSpaceOnUse" viewBox="0 0 ${water.width} ${water.height}" preserveAspectRatio="xMidYMid slice"><use href="#${water.symbol}" width="${water.width}" height="${water.height}"/></pattern>${glints?`<mask id="${key}-body" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="${w}" height="${h}"><use href="#${f.symbol}" width="${w}" height="${h}"/></mask>`:''}</defs><rect width="${w}" height="${h}" fill="url(#${key}-water)"/><use class="e231Subject" href="#${f.symbol}" width="${w}" height="${h}"/>${dots}</svg>`;
}

function e230RenderQuests(body,defs,zone){
 const buttons=new Map();for(const row of body.querySelectorAll('[data-quest-key]')){const b=row.querySelector('[data-expansion-claim],[data-catalog-claim],[data-e187-claim],[data-e171-deliver],[data-e17-deliver],[data-e18-claim]');if(b)buttons.set(row.dataset.questKey,b);}
 const ready=q=>!q.done&&q.goals.every(g=>g.have>=g.need);
 const sorted=defs.map((q,i)=>({q,i})).sort((a,b)=>Number(a.q.done)-Number(b.q.done)||Number(ready(b.q))-Number(ready(a.q))||a.i-b.i);
 const fragment=document.createDocumentFragment();for(const {q} of sorted){const row=document.createElement('article');row.className='e216Quest e230Quest'+(q.done?' e229Completed':'')+(ready(q)?' e230Claimable':'');row.dataset.questKey=q.id;row.dataset.questId=q.id;row.title=q.note;
 const award=e227Illustration('quest',q.id)||e229Reward(q),reward=q.rodId?e194RodArt(q.rodId):award;
 const goals=q.goals.map(g=>{const ratio=q.done?1:Math.min(1,Math.max(0,g.have/g.need||0)),fish=(g.fishIds||[]).map(id=>{const f=E16_FISH.find(f=>f.id===id);return f?'<span class="e230GoalFish '+(e227Discovered(state,id)?'':'unknown')+'" title="'+esc(e227Discovered(state,id)?e228FishName(f):'Especie requerida aún no descubierta')+'">'+e189FishSVG(id)+'</span>':'';}).join('');return '<div class="e230Goal'+(q.done||g.have>=g.need?' done':'')+'">'+fish+'<span>'+esc(g.label)+'</span><b>'+(q.done?'✓':fmt(Math.min(g.have,g.need))+'/'+fmt(g.need))+'</b><progress max="1" value="'+ratio+'" aria-label="'+esc(g.label)+'"></progress></div>';}).join('');
 row.innerHTML='<div class="e230QuestSeal" aria-hidden="true">'+award+'</div><div class="e230QuestGoals"><strong>'+esc(q.title)+'</strong>'+goals+(q.goals.some(g=>g.kind==='delivery')?'<small class="e230Delivery">Entrega: consume peces del inventario.</small>':'')+'</div><div class="e230QuestReward"><span class="e230RewardArt">'+reward+'</span><b>'+esc(q.reward)+'</b><small>'+(q.done?'Completado':ready(q)?'Disponible para reclamar':'Pendiente')+'</small></div>';
 const b=buttons.get(q.id);if(b&&!q.done)row.querySelector('.e230QuestReward').append(b);fragment.append(row);
 }body.replaceChildren(fragment);
}
function e230StyleJournalCard(card,id,r=e218Record(id)){
 const view=e220JournalView(),known=Object.keys(r.categories).filter(k=>r.categories[k]>0),order=['normal','large','huge','legendary'];
 if(r.count>0&&order.includes(r.quality))known.push(r.quality);
 const category=order.includes(view.category)?view.category:order.filter(k=>known.includes(k)).pop()||'normal';card.dataset.catchCategory=category;
}
function e230StyleJournal(list,records){if(list)for(const card of list.querySelectorAll('[data-journal-fish]'))e230StyleJournalCard(card,card.dataset.journalFish,records?.get(card.dataset.journalFish)?.raw);}
