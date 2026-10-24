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
