
'use strict';
const E218_CATEGORIES={normal:'Común',large:'Grande',huge:'Enorme',legendary:'Legendario'};
const e218Selected=new WeakMap();
function e220QualityKey(label){
 if(typeof label!=='string')return null;
 return ({'':'normal',normal:'normal',comun:'normal',large:'large',grande:'large',huge:'huge',enorme:'huge',legendary:'legendary',legendario:'legendary'})[label.normalize('NFD').replace(/[\u0300-\u036f!¡]/g,'').trim().toLowerCase()]||null;
}
function e218Record(id){
 const w=state.ui?.fishingWeights?.bySpecies?.[id]||{},h=state.ui?.e18Fishing?.bySpecies?.[id]||{},categories={};
 for(const key of Object.keys(E218_CATEGORIES)){const n=Number(w.categoryBestKg?.[key]);if(Number.isFinite(n)&&n>0)categories[key]=n;}
 const last=state.ui?.lastFishingCatch,weight=last?.id===id?Number(last.weightKg):0,realLast=Number.isFinite(weight)&&weight>0;
 const lastCategory=realLast&&Object.hasOwn(last,'quality')?e220QualityKey(last.quality):null;
 if(lastCategory)categories[lastCategory]=Math.max(categories[lastCategory]||0,weight);
 const historical=Number(w.bestKg),best=Math.max(Number.isFinite(historical)&&historical>0?historical:0,...Object.values(categories),realLast?weight:0);
 const matches=Object.keys(categories).filter(k=>categories[k]===best);
 let category=Object.hasOwn(E218_CATEGORIES,w.bestCategory)&&historical===best?w.bestCategory:null;
 if(!category&&lastCategory&&weight===best)category=lastCategory;
 if(!category&&matches.length===1)category=matches[0];
 if(category&&best>0)categories[category]=Math.max(categories[category]||0,best);
 return {count:Math.max(Number(h.total)||0,Number(w.catches)||0),best,category,categories,quality:h.best||'normal',categoryCounts:w.categoryCounts||h.categoryCounts||{},countsPartial:Number(w.categoryCountBaseline)>0||Object.values(w.categoryCounts||h.categoryCounts||{}).reduce((a,b)=>a+(Number(b)||0),0)<Math.max(Number(h.total)||0,Number(w.catches)||0)};
}
function e218Detail(f){
 const r=e218Record(f.id),panel=document.createElement('section');panel.className='e218Detail';panel.id='fishingSpeciesDetail';
 const zones=E165_ZONES.filter(z=>z.fish.includes(f.id)&&e16FishLevel()>=(z.req||1));
 panel.innerHTML='<div class="e218Art">'+e189FishSVG(f.id)+'</div><div><h3>'+(typeof e228FishName==='function'?e228FishName(f):f.name)+'</h3><p>'+fmt(r.count)+' capturas · '+zones.map(z=>z.name).join(' · ')+'</p><strong>Récord absoluto: '+(r.best?e190Kg(r.best):'Sin peso registrado')+(r.best?' · '+(E218_CATEGORIES[r.category]||'Categoría histórica no registrada'):'')+'</strong>'+(!r.category&&r.best?'<p class="journalHistorical">Peso histórico conservado. Su categoría no quedó registrada; las nuevas capturas completan las marcas por categoría.</p>':'')+'<div class="e218Records">'+Object.entries(E218_CATEGORIES).map(([key,label])=>'<div data-category="'+key+'"><b>'+label+'</b><span>'+(r.categories[key]?e190Kg(r.categories[key]):'Sin récord')+'</span></div>').join('')+'</div></div>';
 if(typeof e230StyleJournalCard==='function')e230StyleJournalCard(panel,f.id);
 return panel;
}
function e218PlaceDetail(grid,id){
 grid.querySelector('.e218Detail')?.remove();grid.querySelectorAll('[data-journal-fish]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.journalFish===id)));
 const selected=grid.querySelector('[data-journal-fish="'+id+'"]');if(!selected||selected.hidden)return;
 const cards=[...grid.querySelectorAll('[data-journal-fish]')].filter(c=>!c.hidden),top=selected.offsetTop;
 const last=cards.filter(c=>Math.abs(c.offsetTop-top)<3).at(-1)||selected;
 const fish=E16_FISH.find(f=>f.id===id);if(fish)last.after(e218Detail(fish));
}
const e220JournalViews=new WeakMap();
function e220JournalView(){if(!e220JournalViews.has(state))e220JournalViews.set(state,{search:'',zone:'all',sort:'difficulty',category:null});return e220JournalViews.get(state);}
function e220Normalize(text){return text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
function e220FilterJournal(list){
 const v=e220JournalView(),query=e220Normalize(v.search),cards=[...list.querySelectorAll('[data-journal-fish]')];
 list.querySelector('.e218Detail')?.remove();
 const records=new Map(cards.map(c=>{const r=e218Record(c.dataset.journalFish);return[c.dataset.journalFish,{...r,raw:r,totalCount:r.count,...e232JournalStats(r,v.category)}];}));
 const fish=new Map(E16_FISH.map(f=>[f.id,f])),difficulty=e222DifficultyReference();
 cards.sort((a,b)=>{const x=fish.get(a.dataset.journalFish),y=fish.get(b.dataset.journalFish),ra=records.get(x.id),rb=records.get(y.id),tie=()=>x.name.localeCompare(y.name,'es');
  if(v.sort==='difficulty'||v.sort==='difficultyHigh'){const d=(difficulty.get(y.id)?.chance??1)-(difficulty.get(x.id)?.chance??1)||(difficulty.get(x.id)?.level??0)-(difficulty.get(y.id)?.level??0)||tie()||x.id.localeCompare(y.id);return v.sort==='difficultyHigh'?-d:d;}
  if(v.sort==='name')return tie();
  if(v.sort==='valueHigh'||v.sort==='valueLow')return (v.sort==='valueHigh'?y.price-x.price:x.price-y.price)||tie();
  if(v.sort==='weightHigh'||v.sort==='weightLow'){if(!ra.best||!rb.best)return ra.best===rb.best?tie():!ra.best?1:-1;return(v.sort==='weightHigh'?rb.best-ra.best:ra.best-rb.best)||tie();}
  if(!ra.countKnown||!rb.countKnown)return ra.countKnown===rb.countKnown?tie():ra.countKnown?-1:1;
  return(v.sort==='least'?ra.count-rb.count:rb.count-ra.count)||tie();
 });
 let visible=0;
 for(const card of cards){const f=fish.get(card.dataset.journalFish),r=records.get(f.id),category=v.category,matchCategory=!category||category==='species'||!!r.categories[category]||r.category===category||(r.totalCount>0&&r.quality===category);e232JournalCaption(card,f,r.raw,category);card.hidden=!(matchCategory&&e220Normalize(f.name).includes(query)&&(v.zone==='all'||E165_ZONES.find(z=>z.id===v.zone)?.fish.includes(f.id)));if(!card.hidden)visible++;list.append(card);}
 const selected=e218Selected.get(state);if(selected&&!cards.some(c=>c.dataset.journalFish===selected&&!c.hidden))e218Selected.delete(state);
 list.querySelectorAll('[data-journal-fish]').forEach(c=>c.setAttribute('aria-expanded','false'));
 const empty=list.parentElement.querySelector('.journalEmpty');empty.hidden=visible>0;empty.textContent=cards.length?'No hay especies descubiertas con estos filtros.':'Tus especies aparecerán acá cuando captures peces.';
 list.parentElement.querySelector('[data-journal-results]').textContent=visible+' especies';
 for(const b of list.closest('details').querySelectorAll('[data-journal-category]'))b.setAttribute('aria-pressed',String(b.dataset.journalCategory===v.category));
 if(typeof e230StyleJournal==='function')e230StyleJournal(list,records);
 if(list.closest('details').open)e218PlaceDetail(list,e218Selected.get(state));
}
function e218Journal(){
 const journal=document.querySelector('#page_fishing .e181Journal');if(!journal||!state)return;
 const list=journal.querySelector('.e187JournalList');if(!list)return;list.replaceChildren();list.classList.add('e218Album');
 const fishes=E16_FISH.filter(f=>e218Record(f.id).count>0),record=e18Record(),total=Number(record.total)||0,large=Number(record.large)||0,huge=Number(record.huge)||0,legendary=Number(record.legendary)||0;
 const known=k=>Object.hasOwn(record,k)&&Number.isSafeInteger(record[k])&&record[k]>=0,normalKnown=['large','huge','legendary'].every(known)&&large+huge+legendary<=total;
 let stats=journal.querySelector('.e18Pills');stats.className='e18Pills journalSummary';
 stats.innerHTML=[['total','Capturas',total],['species','Especies',fishes.length],['normal','Comunes',normalKnown?Math.max(0,total-large-huge-legendary):null],['large','Grandes',known('large')?large:null],['huge','Enormes',known('huge')?huge:null],['legendary','Legendarios',known('legendary')?legendary:null]].map(([key,label,value])=>'<'+(key==='total'?'span':'button')+' data-journal-stat="'+key+'" '+(key==='total'?'title="Total histórico de capturas; no es una categoría"':'type="button" data-journal-category="'+key+'" aria-pressed="false" title="'+(key==='species'?'Todas las especies descubiertas':'Filtrar especies con una captura verificada de esta categoría; el número es el total histórico de capturas, no el número de especies')+'"')+'><i aria-hidden="true"></i><span>'+label+'</span><b>'+(value===null?'—':fmt(value))+'</b></'+(key==='total'?'span':'button')+'>').join('');
 const oldText=journal.querySelector('p');if(oldText)oldText.remove();journal.querySelector('.journalTools')?.remove();journal.querySelector('.journalEmpty')?.remove();
 const tools=document.createElement('div');tools.className='journalTools';tools.innerHTML='<input type="search" data-journal-search aria-label="Buscar especie del Diario" placeholder="Buscar especie…"><select data-journal-zone aria-label="Zona del Diario"><option value="all">Todas las zonas</option>'+e221ZoneOptions()+'</select><select data-journal-sort aria-label="Ordenar Diario" title="Dificultad de referencia: nivel 100, sin suerte y con capacidad suficiente; se toma la zona más favorable. No es tu probabilidad actual. Valor de venta: precio base Común por unidad"><option value="difficulty">Más fáciles de conseguir</option><option value="difficultyHigh">Más difíciles de conseguir</option><option value="most">Más capturados</option><option value="least">Menos capturados</option><option value="weightHigh">Mayor peso récord</option><option value="weightLow">Menor peso récord</option><option value="valueHigh">Mayor valor base de venta</option><option value="valueLow">Menor valor base de venta</option><option value="name">Nombre A–Z</option></select><small data-journal-results aria-live="polite"></small>';
 list.before(tools);const empty=document.createElement('p');empty.className='journalEmpty';list.after(empty);
 const view=e220JournalView();tools.querySelector('input').value=view.search;tools.querySelector('[data-journal-zone]').value=view.zone;tools.querySelector('[data-journal-sort]').value=view.sort;
 const filter=()=>{const search=tools.querySelector('input').value,zone=tools.querySelector('[data-journal-zone]').value,sort=tools.querySelector('[data-journal-sort]').value;if(search===view.search&&zone===view.zone&&sort===view.sort)return;view.search=search;view.zone=zone;view.sort=sort;e220FilterJournal(list);};tools.addEventListener('input',filter);tools.addEventListener('change',filter);
 for(const f of fishes){const r=e218Record(f.id),card=document.createElement('button');card.type='button';card.className='e218Card';card.dataset.journalFish=f.id;card.setAttribute('aria-expanded','false');card.setAttribute('aria-controls','fishingSpeciesDetail');
 card.title=f.name+' · '+fmt(r.count)+' capturas · Récord: '+(r.best?e190Kg(r.best):'Sin peso registrado')+' · Mejor categoría: '+E218_CATEGORIES[r.quality];card.setAttribute('aria-label',card.title);
 card.innerHTML='<div class="e218Art">'+e189FishSVG(f.id)+'</div><div class="e225JournalCaption"><b>'+f.name+'</b><div class="e225JournalMeta"><small>'+fmt(r.count)+' capt.</small><small>'+(r.best?e190Kg(r.best):'Sin récord')+'</small></div></div>';
 card.onclick=()=>{const next=e218Selected.get(state)===f.id?null:f.id;e218Selected.set(state,next);e218PlaceDetail(list,next);};list.append(card);}
 e220FilterJournal(list);
 if(!journal.dataset.detailToggle){journal.dataset.detailToggle='true';journal.addEventListener('toggle',()=>{if(journal.open&&state){const grid=journal.querySelector('.e218Album');if(grid)e218PlaceDetail(grid,e218Selected.get(state));}});}
 document.querySelectorAll('#page_fishing .e186Fish').forEach(card=>{card.title=[...card.querySelectorAll('strong,small')].map(n=>n.textContent.trim()).filter(Boolean).join(' · ');card.querySelectorAll('small').forEach(n=>n.remove());});
}
const e218PriorPage=e16Page;
e16Page=function(){if(fishingFinishDepth)return;const result=e218PriorPage();e218Journal();return result;};
window.addEventListener('resize',()=>{const grid=document.querySelector('.e218Album');if(grid&&state)e218PlaceDetail(grid,e218Selected.get(state));});
