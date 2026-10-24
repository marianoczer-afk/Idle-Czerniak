'use strict';
/* @include src/catalogs/142-progression32.js */
const e232RodAliases=new Map(e221Rods().map(r=>[r.id,r.name]));
// IDs, ownership and rewards already granted remain authoritative. Names are display data.
for(const rod of e221Rods())if(E232_ROD_NAMES[rod.id]){rod.name=E232_ROD_NAMES[rod.id];if(rod.desc)rod.desc=rod.desc.replace(/Control \+[\d,.]+% de barra/,'Control +'+e190ControlPercent(rod.bonus||0)+'% de barra');if(rod.unlock)rod.unlock.title='El legado de '+rod.name;e231ArtNames.set('rod:'+rod.id,rod.name);}
E187_QUESTS.find(q=>q.id==='arrecife').reward='Caña · '+E187_ROD.name;
function e232BadgeReward(q){const name=E232_BADGES[q.id]||q.title,perk=E232_PERKS[q.id];return 'Insignia · '+name+(perk?' · '+perk.name+': '+perk.label:'');}
// Derived booleans, not additive mutations on load: one reward cannot stack twice.
const e232NoRegionalBonus={control:0,resilience:0,names:[]};
const e232RegionalPerks=new Map(Object.entries(E232_PERKS).map(([id,p])=>[p.zone,{id,bonus:{control:Math.min(2,p.control||0),resilience:Math.min(2,p.resilience||0),names:[p.name]}}]));
function e232RegionalBonus(zone=e165Zone().id){const p=e232RegionalPerks.get(zone);return p&&state?.ui?.fishingQuestRewards?.[p.id]?p.bonus:e232NoRegionalBonus;}

const e232BaseStats=e1101Stats;
e1101Stats=function(rod){const base=e232BaseStats(rod),perk=e232RegionalBonus();if(!perk.control&&!perk.resilience)return base;return{...base,control:base.control+perk.control,resilience:Math.min(60,base.resilience+perk.resilience)};};
function e232CaptureProfile(fish,rod,level,weight){
 const st=e1101Stats(rod),demand=clamp((fish.req-1)/99,0,1),handling=.65*st.control/64+.35*st.resilience/60;
 const shortfall=Math.max(0,.20+.90*demand-handling),load=Number.isFinite(weight)?clamp(weight/e190Capacity(rod),0,1):0;
 return{demand,shortfall,load,pressure:(1+.65*demand+.9*shortfall+.12*load)*(1-Math.min(.24,handling*.25))-Math.min(.03,Math.max(0,level-fish.req)*.0006),endurance:1+.85*shortfall+.35*load,loss:1+.65*shortfall+.25*load};
}
function e232JournalStats(r,category){
 if(!Object.hasOwn(E218_CATEGORIES,category))return{best:r.best,count:r.count,countKnown:true,partial:false};
 const count=Number(r.categoryCounts[category]),countKnown=Object.hasOwn(r.categoryCounts,category)&&Number.isSafeInteger(count)&&count>=0;
 return{best:r.categories[category]||0,count:countKnown?count:0,countKnown,partial:r.countsPartial};
}
function e232JournalCaption(card,f,r,category){
 const v=e232JournalStats(r,category),specific=Object.hasOwn(E218_CATEGORIES,category),count=v.countKnown?fmt(v.count)+(specific&&v.partial?' capt. registradas':' capt.'):'Cantidad sin registrar';
 const weight=v.best?e190Kg(v.best):'Sin récord registrado',meta=card.querySelector('.e225JournalMeta');
 if(meta){meta.innerHTML='<small>'+esc(count)+'</small><small>'+esc(weight)+'</small>';}
 card.title=f.name+' · '+(specific?E218_CATEGORIES[category]:'Todas las categorías')+' · '+count+' · '+(specific?'Récord de categoría: ':'Récord absoluto: ')+weight+(specific&&v.partial?' · Contador parcial desde Estable 32; el total histórico se conserva en la vista general.':'');card.setAttribute('aria-label',card.title);
}
const e232OldDetail=e218Detail;
e218Detail=function(f){const panel=e232OldDetail(f),r=e218Record(f.id),category=e220JournalView().category,v=e232JournalStats(r,category);if(Object.hasOwn(E218_CATEGORIES,category)){const text=panel.querySelector('p'),record=panel.querySelector('strong');if(text)text.textContent=E218_CATEGORIES[category]+' · '+(v.countKnown?fmt(v.count)+(v.partial?' capturas registradas desde Estable 32':' capturas'):'Cantidad histórica de esta categoría sin registrar');if(record)record.textContent='Récord '+E218_CATEGORIES[category]+': '+(v.best?e190Kg(v.best):'Sin récord registrado');}for(const node of panel.querySelectorAll('.e218Records span'))if(node.textContent==='Sin récord')node.textContent='Sin récord registrado';return panel;};
// Static surface accents: the alpha mask confines every reflection to the animal.
// No raster variants, full-image color filters, timers or extra animation loops.
function e232SpecimenLayer(symbol,key,category,width='100%',height='100%'){
 if(!['large','huge','legendary'].includes(category))return '';
 const rank={large:1,huge:2,legendary:3}[category],color=['','#d8ead0','#bcecff','#ffdb78'][rank];
 const scales=Array.from({length:rank*4},(_,i)=>{const x=35+(i%5)*28,y=32+Math.floor(i/5)*17;return '<path d="M'+x+' '+y+'q5 7 10 0" fill="none" stroke="'+color+'" stroke-width="'+(rank===1?.8:1.15)+'" opacity="'+(rank===1?.42:.58)+'"/>';}).join('');
 const sheen=rank>1?'<defs><linearGradient id="'+key+'-shine" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+color+'" stop-opacity="0"/><stop offset=".5" stop-color="'+color+'" stop-opacity=".65"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs><path d="M25 73Q70 8 127 31M77 85Q130 22 181 40" fill="none" stroke="url(#'+key+'-shine)" stroke-width="'+(rank===3?12:8)+'"/>':'';
 const sparks=rank===3?[[52,32],[90,51],[132,37],[155,65],[73,68]].map(([x,y])=>'<path d="M'+x+' '+(y-4)+'l1.4 3 3.6 1-3.6 1-1.4 3-1.4-3-3.6-1 3.6-1Z" fill="#fff0bf"/>').join(''):'';
 return '<defs><mask id="'+key+'-body" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="'+width+'" height="'+height+'"><use href="#'+symbol+'" width="'+width+'" height="'+height+'"/></mask></defs><g class="e231ScaleGlints e232SpecimenSurface" mask="url(#'+key+'-body)" data-category="'+category+'"><svg width="'+width+'" height="'+height+'" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">'+sheen+scales+sparks+'</svg></g>';
}
// Decorate normalized definitions once. All quest surfaces (Atlas/Trophies/shop) share these names.
function e232QuestDefinition(q){return {...q,reward:q.rodId?'Caña · '+(E232_ROD_NAMES[q.rodId]||e231ArtNames.get('rod:'+q.rodId)||q.reward):E232_BADGES[q.id]?e232BadgeReward(q)+(q.id==='laguna'?' · Instinto de pescador: +5% XP de Pesca permanente':q.id==='abismo'?' · Pulso del abismo: +8 px de control permanente':''):q.reward};}
