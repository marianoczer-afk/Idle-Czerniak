'use strict';
const E232_ROD_NAMES={
 "e16_rod": "Caña sencilla",
 "e161_rod_bamboo": "Bambú del Remanso",
 "e161_rod_fiber": "Hilo de Plata",
 "e161_rod_steel": "Acero del Barquero",
 "e192_rod_laguna": "Vara Esmeralda",
 "e192_rod_coral": "Aguja de Nácar",
 "e192_rod_abyss": "Caña Astral",
 "e17_rod_viejo": "Caña del Viejo Pescador",
 "e171_rod_rio": "Guardarríos",
 "e171_rod_costa": "Vigía de las Brumas",
 "e18_rod_trofeo": "Tesoro del Coleccionista",
 "e187_rod_coral": "Rama Coralina",
 "e208_rod_junco_cauce": "Raíz Serena",
 "e208_rod_junco_destello": "Chispa del Estanque",
 "e208_rod_sauce_pulso": "Veta del Sauce",
 "e208_rod_sauce_fortuna": "Ojo del Martín Pescador",
 "e208_rod_marea_cauce": "Timón de la Niebla",
 "e208_rod_marea_titan": "Quilla de Bronce",
 "e208_rod_nenufar_fortuna": "Susurro de Nenúfar",
 "e208_rod_nenufar_reliquia": "Relicario de Jade",
 "e208_rod_coral_pulso": "Aguja del Atolón",
 "e208_rod_coral_cauce": "Abrazo del Coral",
 "e208_rod_fosa_pulso": "Compás de la Fosa",
 "e208_rod_fosa_titan": "Ancla del Silencio",
 "e208_rod_mangle_cauce": "Raíz Indómita",
 "e208_rod_mangle_fortuna": "Lucerna del Manglar",
 "e208_rod_escarcha_pulso": "Aguja de la Aurora",
 "e208_rod_escarcha_cauce": "Abrazo de Escarcha",
 "e208_rod_obsidiana_destello": "Ascua del Eclipse",
 "e208_rod_obsidiana_titan": "Yunque de Obsidiana",
 "e208_rod_celeste_pulso": "Meridiano Celestial",
 "e208_rod_celeste_reliquia": "Astrolabio de las Mareas",
 "e208_rod_custodio_pulso": "Custodio del Río",
 "e208_rod_custodio_cauce": "Trenza de Corrientes",
 "e208_rod_custodio_destello": "Centella del Junquillo",
 "e208_rod_custodio_fortuna": "Ojo de Ámbar",
 "e208_rod_custodio_titan": "Ancla de los Juncos",
 "e208_rod_custodio_reliquia": "Memoria del Roble",
 "e208_rod_boreal_pulso": "Aguja del Invierno",
 "e208_rod_boreal_cauce": "Pacto Boreal",
 "e208_rod_boreal_destello": "Aliento de la Aurora",
 "e208_rod_boreal_fortuna": "Lucero del Deshielo",
 "e208_rod_boreal_titan": "Colmillo del Glaciar",
 "e208_rod_boreal_reliquia": "Corona de Cristal Helado",
 "e208_rod_eterno_pulso": "Mandato del Firmamento",
 "e208_rod_eterno_cauce": "Juramento del Horizonte",
 "e208_rod_eterno_destello": "Albor de las Mareas",
 "e208_rod_eterno_fortuna": "Oráculo de las Estrellas",
 "e208_rod_eterno_titan": "Balanza del Leviatán",
 "e208_rod_eterno_reliquia": "Legado de las Mareas"
};
const E232_BADGES={
 "laguna": "Hoja del Naturalista",
 "abismo": "Ojo de las Profundidades",
 "manglar_cartografo": "Rosa de las Raíces",
 "manglar_salto": "Escama del Saltador",
 "volcan_cuaderno": "Folio de Ceniza",
 "volcan_guardian": "Escudo de la Caldera",
 "ruinas_censo": "Llave del Archivista",
 "cristal_bitacora": "Prisma del Espeleólogo",
 "primordial_sondeo": "Sonda del Primer Mar",
 "e231_cuaderno_muelle": "Pluma del Aprendiz",
 "e231_estanque_muelle": "Espejo del Remanso",
 "e231_derrota_costa": "Rumbo del Navegante",
 "e231_koi_laguna": "Lágrima del Koi",
 "e231_guardian_arrecife": "Guardián de las Agujas",
 "e231_luz_abismo": "Faro de las Tinieblas",
 "e231_puentes_manglar": "Nudo de las Raíces",
 "e231_forja_volcan": "Sello de la Forja",
 "e231_mosaico_ruinas_sumergidas": "Tesela de la Memoria",
 "e231_refraccion_cavernas_cristal": "Prisma de Siete Luces",
 "e231_estratos_abismo_primordial": "Huella del Primer Océano"
};
const E232_PERKS={
 "e231_puentes_manglar": {
  "zone": "manglar",
  "resilience": 2,
  "name": "Paso entre raíces",
  "label": "+2 puntos de Resiliencia en Manglares Susurrantes"
 },
 "e231_forja_volcan": {
  "zone": "volcan",
  "control": 2,
  "name": "Temple de ceniza",
  "label": "+0,4 puntos porcentuales de barra en Bahía Volcánica"
 },
 "e231_estratos_abismo_primordial": {
  "zone": "abismo_primordial",
  "resilience": 2,
  "name": "Memoria primordial",
  "label": "+2 puntos de Resiliencia en Abismo Primordial"
 }
};

// Supplemental long-term goals. Stable IDs; effects are derived from existing v7 claim flags.
const FISHING_MASTERY_QUESTS=[
 {id:'mastery_muelle_paciencia',zone:'muelle',title:'La paciencia del muelle',species:'mojarra',count:30,quality:'large',qualityCount:5,captures:60,perk:{xp:.01,label:'+1% XP de Pesca'}},
 {id:'mastery_costa_ritmo',zone:'costa',title:'El ritmo de la bruma',species:'lubina',count:30,quality:'large',qualityCount:5,captures:90,perk:{speed:1,label:'+1 punto de Atracción'}},
 {id:'mastery_laguna_reflejos',zone:'laguna',title:'Reflejos esmeralda',species:'perca_esmeralda',count:25,quality:'huge',qualityCount:2,captures:100,perk:{luck:1,label:'+1 punto de Suerte'}},
 {id:'mastery_arrecife_guardia',zone:'arrecife',title:'Custodia del jardín de coral',species:'caballito_mar',count:25,quality:'large',qualityCount:5,captures:120,perk:{resilience:1,label:'+1 punto de Resiliencia'}},
 {id:'mastery_fosa_pulso',zone:'abismo',title:'Pulso bajo las sombras',species:'calamar_abismo',count:25,quality:'huge',qualityCount:2,captures:150,perk:{control:1,label:'+0,2 puntos porcentuales de barra'}},
 {id:'mastery_glaciar_silencio',zone:'glaciar',title:'El silencio del hielo',species:'salvelino',count:30,quality:'huge',qualityCount:3,captures:160,perk:{xp:.01,label:'+1% XP de Pesca'}},
 {id:'mastery_santuario_constelacion',zone:'santuario',title:'La constelación viviente',species:'carpa_celeste',count:35,quality:'huge',qualityCount:3,captures:180,perk:{luck:1,label:'+1 punto de Suerte'}},
 {id:'mastery_ruinas_memoria',zone:'ruinas_sumergidas',title:'Memoria del archivo sumergido',species:'nautilo_bronce',count:30,quality:'huge',qualityCount:2,captures:160,perk:{control:1,label:'+0,2 puntos porcentuales de barra'}},
 {id:'mastery_cristal_destello',zone:'cavernas_cristal',title:'Destellos entre las geodas',species:'tetra_prismatico',count:30,quality:'huge',qualityCount:3,captures:180,perk:{luck:1,label:'+1 punto de Suerte'}}
];
for(const q of FISHING_MASTERY_QUESTS)E227_QUESTS.push({id:q.id,zone:q.zone,title:q.title,masteryRole:'supplemental',gold:0,permanent:q.perk,description:'Mejora permanente global. No consume peces. Las capturas son locales; las categorías usan el contador global registrado de la especie; no se reconstruyen cantidades a partir de récords antiguos.',goals:[{kind:'speciesCount',id:q.species,need:q.count},{kind:'speciesQualityCount',id:q.species,category:q.quality,need:q.qualityCount},{kind:'captures',need:q.captures}]});

const e232RodAliases=new Map(e221Rods().map(r=>[r.id,r.name]));
// IDs, ownership and rewards already granted remain authoritative. Names are display data.
for(const rod of e221Rods())if(E232_ROD_NAMES[rod.id]){rod.name=E232_ROD_NAMES[rod.id];if(rod.desc)rod.desc=rod.desc.replace(/Control \+[\d,.]+% de barra/,'Control +'+e190ControlPercent(rod.bonus||0)+'% de barra');if(rod.unlock)rod.unlock.title='El legado de '+rod.name;e231ArtNames.set('rod:'+rod.id,rod.name);}
E187_QUESTS.find(q=>q.id==='arrecife').reward='Caña · '+E187_ROD.name;
function e232BadgeReward(q){const name=E232_BADGES[q.id]||q.title,perk=q.permanent||E232_PERKS[q.id];return 'Insignia · '+name+(perk?' · '+(perk.name||'Mejora permanente')+': '+perk.label:'');}
// Derived booleans, not additive mutations on load: one reward cannot stack twice.
const e232NoRegionalBonus={control:0,resilience:0,names:[]};
const e232RegionalPerks=new Map(Object.entries(E232_PERKS).map(([id,p])=>[p.zone,{id,bonus:{control:Math.min(2,p.control||0),resilience:Math.min(2,p.resilience||0),names:[p.name]}}]));
function e232RegionalBonus(zone=e165Zone().id){const p=e232RegionalPerks.get(zone);return p&&state?.ui?.fishingQuestRewards?.[p.id]?p.bonus:e232NoRegionalBonus;}

const e232BaseStats=e1101Stats;
function e232PermanentBonus(s=state){
 const bonus={xp:0,control:0,resilience:0,speed:0,luck:0,names:[]};
 for(const q of FISHING_MASTERY_QUESTS)if(s?.ui?.fishingQuestRewards?.[q.id]){for(const key of ['xp','control','resilience','speed','luck'])bonus[key]+=q.perk[key]||0;bonus.names.push(q.title+' · '+q.perk.label);}
 return bonus;
}
e1101Stats=function(rod){const base=e232BaseStats(rod),perk=e232RegionalBonus(),global=e232PermanentBonus();if(!perk.control&&!perk.resilience&&!global.names.length)return base;return{...base,control:base.control+perk.control+global.control,resilience:Math.min(60,base.resilience+perk.resilience+global.resilience),speed:base.speed+global.speed,luck:base.luck+global.luck};};

function e232CaptureProfile(fish,rod,level,weight){
 const st=e1101Stats(rod),demand=clamp((fish.req-1)/99,0,1),handling=.65*st.control/64+.35*st.resilience/60;
 const shortfall=Math.max(0,.15+.70*demand-handling),load=Number.isFinite(weight)?clamp(weight/e190Capacity(rod),0,1):0;
 return{demand,shortfall,load,pressure:(1+.35*demand+.40*shortfall+.06*load)*(1-Math.min(.24,handling*.25))-Math.min(.03,Math.max(0,level-fish.req)*.0006),endurance:1+.50*shortfall+.20*load,loss:1+.40*shortfall+.18*load};
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
