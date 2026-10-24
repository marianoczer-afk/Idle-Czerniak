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
 const rank={large:1,huge:2,legendary:3}[category],id=symbol.split('hud-fish-').pop(),color=['','#dcebcf','#a8e7ff','#ffd46e'][rank];
 let paths,points,anatomy;
 if(/calamar/.test(id)){anatomy='mantle-tentacles';paths=['M104 44Q138 17 170 33','M91 49Q61 43 35 63T18 69','M88 57Q65 80 43 71T23 75'];points=[[128,34],[151,32],[77,55],[54,70],[30,62]];}
 else if(/bagre/.test(id)){anatomy='back-whiskers';paths=['M38 41Q85 23 146 44','M40 52Q25 58 17 69','M43 55Q29 67 24 78','M113 38L129 23'];points=[[58,39],[84,34],[115,39],[35,58],[26,68]];}
 else if(/cangrejo|isopodo/.test(id)){anatomy='shell-claws';paths=['M72 43Q101 23 127 44','M45 45Q32 26 48 20','M147 43Q168 24 152 17','M78 59Q101 67 123 56'];points=[[87,42],[112,39],[42,29],[155,28],[104,58]];}
 else if(/mantarraya/.test(id)){anatomy='wings';paths=['M38 61Q64 37 96 42','M104 42Q145 34 169 61','M99 48Q109 66 116 82'];points=[[68,48],[136,48],[96,44],[113,66]];}
 else if(/anguila|morena|congrio/.test(id)){anatomy='sinuous-back';paths=['M25 62Q68 28 98 50T173 43','M36 65Q76 43 108 64'];points=[[49,48],[83,44],[111,56],[155,49]];}
 else{anatomy='scales-fins';const shift=[...id].reduce((n,c)=>n+c.charCodeAt(0),0)%9-4;paths=['M40 43Q90 '+(23+shift)+' 152 43','M75 47q6 9 12 0m5 4q6 9 12 0m5-9q6 9 12 0','M92 30L105 20M104 67L120 76'];points=[[65,40],[88,35+shift],[115,38],[139,47],[101,64]];}
 const strokes=paths.slice(0,rank===1?1:paths.length).map(d=>'<path d="'+d+'" fill="none" stroke="'+color+'" stroke-width="'+[0,1.1,2.6,3.3][rank]+'" stroke-linecap="round" opacity="'+[0,.48,.86,.95][rank]+'"/>').join('');
 const spots=rank>1?points.map(([x,y],i)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+(rank===3?6:4)+'" ry="2.4" fill="'+color+'" opacity=".32"/>'+(rank===3&&i<4?'<path d="M'+x+' '+(y-3)+'l1 2 3 1-3 1-1 2-1-2-3-1 3-1Z" fill="#fff2ba"/>':'')).join(''):'';
 // Shared alpha threshold removes semi-transparent fringe; no blur/color filter
 // is applied to the picture. Anatomy strokes remain inside the opaque animal.
 return '<defs><mask id="'+key+'-body" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="'+width+'" height="'+height+'"><use href="#'+symbol+'" width="'+width+'" height="'+height+'" filter="url(#argentum-specimen-edge)"/></mask></defs><g class="e231ScaleGlints e232SpecimenSurface" mask="url(#'+key+'-body)" data-category="'+category+'" data-anatomy="'+anatomy+'"><svg width="'+width+'" height="'+height+'" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">'+strokes+spots+'</svg></g>';
}
// Decorate normalized definitions once. All quest surfaces (Atlas/Trophies/shop) share these names.
function e232QuestDefinition(q){return {...q,reward:q.rodId?'Caña · '+(E232_ROD_NAMES[q.rodId]||e231ArtNames.get('rod:'+q.rodId)||q.reward):E232_BADGES[q.id]?e232BadgeReward(q)+(q.id==='laguna'?' · Instinto de pescador: +5% XP de Pesca permanente':q.id==='abismo'?' · Pulso del abismo: +8 px de control permanente':''):q.reward};}
