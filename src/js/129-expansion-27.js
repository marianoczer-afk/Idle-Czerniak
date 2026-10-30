'use strict';
// Additive content; historic catalogue rows and gear remain unchanged.
const E227_FISH=[
 {
  "id": "gobio_runico",
  "name": "Gobio rúnico",
  "req": 88,
  "price": 1650,
  "xp": 1080,
  "speed": 0.79,
  "wiggle": 0.66,
  "zone": 48,
  "icon": "",
  "difficulty": 2.4,
  "weight": [
   2,
   18
  ]
 },
 {
  "id": "nautilo_bronce",
  "name": "Nautilo de bronce",
  "req": 90,
  "price": 1900,
  "xp": 1220,
  "speed": 0.808,
  "wiggle": 0.672,
  "zone": 48,
  "icon": "",
  "difficulty": 2.7,
  "weight": [
   8,
   55
  ]
 },
 {
  "id": "congrio_archivo",
  "name": "Congrio del archivo",
  "req": 92,
  "price": 2400,
  "xp": 1450,
  "speed": 0.8260000000000001,
  "wiggle": 0.684,
  "zone": 48,
  "icon": "",
  "difficulty": 3.0,
  "weight": [
   35,
   210
  ],
  "rarity": 0.025
 },
 {
  "id": "tetra_prismatico",
  "name": "Tetra prismático",
  "req": 94,
  "price": 2000,
  "xp": 1350,
  "speed": 0.8200000000000001,
  "wiggle": 0.68,
  "zone": 48,
  "icon": "",
  "difficulty": 2.9,
  "weight": [
   0.3,
   3
  ]
 },
 {
  "id": "ajolote_cuarzo",
  "name": "Ajolote de cuarzo",
  "req": 96,
  "price": 2600,
  "xp": 1600,
  "speed": 0.8440000000000001,
  "wiggle": 0.6960000000000001,
  "zone": 48,
  "icon": "",
  "difficulty": 3.3,
  "weight": [
   1,
   8
  ],
  "rarity": 0.035
 },
 {
  "id": "esturion_geoda",
  "name": "Esturión geoda",
  "req": 97,
  "price": 3500,
  "xp": 1950,
  "speed": 0.8560000000000001,
  "wiggle": 0.7040000000000001,
  "zone": 48,
  "icon": "",
  "difficulty": 3.5,
  "weight": [
   90,
   480
  ],
  "rarity": 0.0125
 },
 {
  "id": "isopodo_fosil",
  "name": "Isópodo fósil",
  "req": 99,
  "price": 2500,
  "xp": 1700,
  "speed": 0.8380000000000001,
  "wiggle": 0.6920000000000001,
  "zone": 48,
  "icon": "",
  "difficulty": 3.2,
  "weight": [
   12,
   80
  ]
 },
 {
  "id": "quimera_ambar",
  "name": "Quimera de ámbar",
  "req": 99,
  "price": 3500,
  "xp": 2050,
  "speed": 0.8620000000000001,
  "wiggle": 0.7080000000000001,
  "zone": 48,
  "icon": "",
  "difficulty": 3.6,
  "weight": [
   50,
   320
  ],
  "rarity": 0.035
 },
 {
  "id": "titan_ammonita",
  "name": "Titán ammonita",
  "req": 100,
  "price": 6500,
  "xp": 2600,
  "speed": 0.886,
  "wiggle": 0.724,
  "zone": 48,
  "icon": "",
  "difficulty": 4.0,
  "weight": [
   300,
   1800
  ],
  "rarity": 0.006
 }
];
const E227_ZONES=[
 {
  "id": "ruinas_sumergidas",
  "name": "Ruinas Sumergidas",
  "req": 88,
  "icon": "",
  "desc": "Arcos de bronce y bibliotecas hundidas guardan criaturas marcadas por antiguas runas.",
  "fish": [
   "gobio_runico",
   "nautilo_bronce",
   "congrio_archivo",
   "calamar_abismo"
  ]
 },
 {
  "id": "cavernas_cristal",
  "name": "Cavernas de Cristal",
  "req": 94,
  "icon": "",
  "desc": "La luz del cuarzo recorre aguas silenciosas. Su fauna translúcida exige pulso y paciencia.",
  "fish": [
   "tetra_prismatico",
   "ajolote_cuarzo",
   "esturion_geoda",
   "pez_cristal"
  ]
 },
 {
  "id": "abismo_primordial",
  "name": "Abismo Primordial",
  "req": 99,
  "icon": "",
  "desc": "Bajo los arcos fósiles del fondo brillan criaturas que nadie creía vivas.",
  "fish": [
   "isopodo_fosil",
   "quimera_ambar",
   "titan_ammonita",
   "pez_linternilla"
  ]
 }
];
const E227_QUESTS=[
 {
  "id": "manglar_cartografo",
  "zone": "manglar",
  "title": "Cartógrafo de las raíces",
  "masteryRole": "supplemental",
  "gold": 1200,
  "goals": [
   {
    "kind": "discover",
    "ids": [
     "sabalo_manglar",
     "pez_arquero"
    ],
    "need": 2
   },
   {
    "kind": "captures",
    "need": 10
   }
  ]
 },
 {
  "id": "manglar_salto",
  "zone": "manglar",
  "title": "El salto entre raíces",
  "masteryRole": "supplemental",
  "gold": 2500,
  "goals": [
   {
    "kind": "speciesWeight",
    "id": "tarpon",
    "need": 40
   },
   {
    "kind": "discover",
    "need": 3
   }
  ]
 },
 {
  "id": "volcan_cuaderno",
  "zone": "volcan",
  "title": "Cuaderno de ceniza",
  "masteryRole": "supplemental",
  "gold": 3000,
  "goals": [
   {
    "kind": "discover",
    "ids": [
     "pez_lava",
     "mero_obsidiana"
    ],
    "need": 2
   },
   {
    "kind": "captures",
    "need": 8
   }
  ]
 },
 {
  "id": "volcan_guardian",
  "zone": "volcan",
  "title": "Guardián de la bahía",
  "masteryRole": "supplemental",
  "gold": 5000,
  "goals": [
   {
    "kind": "discover",
    "need": 3
   },
   {
    "kind": "captures",
    "need": 15
   },
   {
    "kind": "weight",
    "need": 100
   }
  ]
 },
 {
  "id": "ruinas_censo",
  "zone": "ruinas_sumergidas",
  "title": "El censo del archivista",
  "masteryRole": "main",
  "gold": 6000,
  "goals": [
   {
    "kind": "captures",
    "need": 18
   },
   {
    "kind": "discover",
    "ids": [
     "gobio_runico",
     "nautilo_bronce",
     "congrio_archivo"
    ],
    "need": 2
   }
  ]
 },
 {
  "id": "cristal_bitacora",
  "zone": "cavernas_cristal",
  "title": "Luz bajo la piedra",
  "masteryRole": "main",
  "gold": 8500,
  "goals": [
   {
    "kind": "discover",
    "ids": [
     "tetra_prismatico",
     "ajolote_cuarzo"
    ],
    "need": 2
   },
   {
    "kind": "speciesWeight",
    "id": "ajolote_cuarzo",
    "need": 4
   }
  ],
  "description": "Catalogá la fauna translúcida y documentá un ajolote de cuarzo de 4 kg."
 },
 {
  "id": "primordial_sondeo",
  "zone": "abismo_primordial",
  "title": "El último sondeo",
  "masteryRole": "main",
  "gold": 12000,
  "goals": [
   {
    "kind": "captures",
    "need": 25
   },
   {
    "kind": "discover",
    "ids": [
     "isopodo_fosil",
     "quimera_ambar",
     "titan_ammonita"
    ],
    "need": 2
   },
   {
    "kind": "weight",
    "need": 150
   }
  ],
  "description": "Explorá el fondo y registrá un ejemplar de 150 kg; no hace falta el Titán ammonita."
 }
];
const E227_MASTERY_BASELINE=[
 {
  "zoneId": "muelle",
  "speciesIds": [
   "mojarra",
   "bagre",
   "trucha",
   "carpa_dorada",
   "trucha_arcoiris"
  ],
  "mainQuestIds": [
   "e17_viejo"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "rio",
  "speciesIds": [
   "bagre",
   "trucha",
   "salmon",
   "trucha_arcoiris",
   "lucio",
   "anguila"
  ],
  "mainQuestIds": [
   "e171_rio",
   "coleccionista",
   "e208_rod_custodio_pulso",
   "e208_rod_custodio_cauce",
   "e208_rod_custodio_destello",
   "e208_rod_custodio_fortuna",
   "e208_rod_custodio_titan",
   "e208_rod_custodio_reliquia"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "costa",
  "speciesIds": [
   "salmon",
   "pez_espada",
   "pez_fantasma",
   "lubina",
   "atun",
   "mantarraya"
  ],
  "mainQuestIds": [
   "e171_costa"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "laguna",
  "speciesIds": [
   "trucha_arcoiris",
   "perca_esmeralda",
   "cangrejo_azul",
   "koi_imperial",
   "esturion"
  ],
  "mainQuestIds": [
   "laguna"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "arrecife",
  "speciesIds": [
   "lubina",
   "pez_luna",
   "caballito_mar",
   "morena",
   "tiburon_arrecife"
  ],
  "mainQuestIds": [
   "arrecife"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "abismo",
  "speciesIds": [
   "mantarraya",
   "pez_linternilla",
   "calamar_abismo",
   "pez_cristal",
   "leviatan"
  ],
  "mainQuestIds": [
   "abismo"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "manglar",
  "speciesIds": [
   "sabalo_manglar",
   "pez_arquero",
   "anguila_manglar",
   "tarpon"
  ],
  "mainQuestIds": [],
  "noQuestRule": "first-discovery"
 },
 {
  "zoneId": "glaciar",
  "speciesIds": [
   "trucha_alpina",
   "salvelino",
   "bacalao_hielo",
   "esturion_blanco"
  ],
  "mainQuestIds": [
   "e208_rod_boreal_pulso",
   "e208_rod_boreal_cauce",
   "e208_rod_boreal_destello",
   "e208_rod_boreal_fortuna",
   "e208_rod_boreal_titan",
   "e208_rod_boreal_reliquia"
  ],
  "noQuestRule": null
 },
 {
  "zoneId": "volcan",
  "speciesIds": [
   "pez_lava",
   "mero_obsidiana",
   "pez_escorpion",
   "dragon_mar"
  ],
  "mainQuestIds": [],
  "noQuestRule": "first-discovery"
 },
 {
  "zoneId": "santuario",
  "speciesIds": [
   "carpa_celeste",
   "pez_cometa",
   "raya_aurora",
   "guardian_mareas"
  ],
  "mainQuestIds": [
   "e208_rod_eterno_pulso",
   "e208_rod_eterno_cauce",
   "e208_rod_eterno_destello",
   "e208_rod_eterno_fortuna",
   "e208_rod_eterno_titan",
   "e208_rod_eterno_reliquia"
  ],
  "noQuestRule": null
 }
];
const E227_OLD_QUESTS=[
 {
  "id": "e17_viejo",
  "rodId": "e17_rod_viejo",
  "zone": "muelle"
 },
 {
  "id": "e171_rio",
  "rodId": "e171_rod_rio",
  "zone": "rio"
 },
 {
  "id": "e171_costa",
  "rodId": "e171_rod_costa",
  "zone": "costa"
 },
 {
  "id": "laguna",
  "rodId": null,
  "zone": "laguna"
 },
 {
  "id": "arrecife",
  "rodId": "e187_rod_coral",
  "zone": "arrecife"
 },
 {
  "id": "abismo",
  "rodId": null,
  "zone": "abismo"
 },
 {
  "id": "coleccionista",
  "rodId": "e18_rod_trofeo",
  "zone": "rio"
 },
 {
  "id": "e208_rod_custodio_pulso",
  "rodId": "e208_rod_custodio_pulso",
  "zone": "rio"
 },
 {
  "id": "e208_rod_custodio_cauce",
  "rodId": "e208_rod_custodio_cauce",
  "zone": "rio"
 },
 {
  "id": "e208_rod_custodio_destello",
  "rodId": "e208_rod_custodio_destello",
  "zone": "rio"
 },
 {
  "id": "e208_rod_custodio_fortuna",
  "rodId": "e208_rod_custodio_fortuna",
  "zone": "rio"
 },
 {
  "id": "e208_rod_custodio_titan",
  "rodId": "e208_rod_custodio_titan",
  "zone": "rio"
 },
 {
  "id": "e208_rod_custodio_reliquia",
  "rodId": "e208_rod_custodio_reliquia",
  "zone": "rio"
 },
 {
  "id": "e208_rod_boreal_pulso",
  "rodId": "e208_rod_boreal_pulso",
  "zone": "glaciar"
 },
 {
  "id": "e208_rod_boreal_cauce",
  "rodId": "e208_rod_boreal_cauce",
  "zone": "glaciar"
 },
 {
  "id": "e208_rod_boreal_destello",
  "rodId": "e208_rod_boreal_destello",
  "zone": "glaciar"
 },
 {
  "id": "e208_rod_boreal_fortuna",
  "rodId": "e208_rod_boreal_fortuna",
  "zone": "glaciar"
 },
 {
  "id": "e208_rod_boreal_titan",
  "rodId": "e208_rod_boreal_titan",
  "zone": "glaciar"
 },
 {
  "id": "e208_rod_boreal_reliquia",
  "rodId": "e208_rod_boreal_reliquia",
  "zone": "glaciar"
 },
 {
  "id": "e208_rod_eterno_pulso",
  "rodId": "e208_rod_eterno_pulso",
  "zone": "santuario"
 },
 {
  "id": "e208_rod_eterno_cauce",
  "rodId": "e208_rod_eterno_cauce",
  "zone": "santuario"
 },
 {
  "id": "e208_rod_eterno_destello",
  "rodId": "e208_rod_eterno_destello",
  "zone": "santuario"
 },
 {
  "id": "e208_rod_eterno_fortuna",
  "rodId": "e208_rod_eterno_fortuna",
  "zone": "santuario"
 },
 {
  "id": "e208_rod_eterno_titan",
  "rodId": "e208_rod_eterno_titan",
  "zone": "santuario"
 },
 {
  "id": "e208_rod_eterno_reliquia",
  "rodId": "e208_rod_eterno_reliquia",
  "zone": "santuario"
 }
];

const E228_REGIONAL_QUESTS=[
 {id:'manglar_cauce28',zone:'manglar',title:'El pulso de las raíces',rodId:'e208_rod_mangle_cauce',goals:[{kind:'speciesCount',id:'pez_arquero',need:6},{kind:'speciesCount',id:'anguila_manglar',need:4}]},
 {id:'volcan_destello28',zone:'volcan',title:'Templar la corriente',rodId:'e208_rod_obsidiana_destello',goals:[{kind:'speciesCount',id:'mero_obsidiana',need:6},{kind:'speciesCount',id:'pez_escorpion',need:4},{kind:'weight',need:90}]},
 {id:'ruinas_ancla28',zone:'ruinas_sumergidas',title:'Ancla del archivero',rodId:'e208_rod_obsidiana_titan',goals:[{kind:'speciesCount',id:'nautilo_bronce',need:6},{kind:'speciesCount',id:'congrio_archivo',need:1}]},
 {id:'cristal_pulso28',zone:'cavernas_cristal',title:'Afinación prismática',rodId:'e208_rod_celeste_pulso',goals:[{kind:'speciesCount',id:'tetra_prismatico',need:8},{kind:'speciesCount',id:'ajolote_cuarzo',need:4}]},
 {id:'primordial_reliquia28',zone:'abismo_primordial',title:'Memoria de las mareas',rodId:'e208_rod_celeste_reliquia',goals:[{kind:'speciesCount',id:'isopodo_fosil',need:10},{kind:'speciesCount',id:'quimera_ambar',need:3},{kind:'weight',need:240}]}
].map(q=>({...q,gold:0,masteryRole:'supplemental',description:'Vía alternativa a la compra: reconoce tus capturas locales ya registradas. La caña conserva sus estadísticas; si ya la tenés, recibís solamente la insignia.'}));
E227_QUESTS.push(...E228_REGIONAL_QUESTS);

for(const row of E227_FISH){const {difficulty,weight,...fish}=row;E16_FISH.push(fish);E161_DIFFICULTY[row.id]=difficulty;E190_WEIGHT_RANGES[row.id]=weight;}
E165_ZONES.push(...E227_ZONES);
// New regional species replace shared slots; historic species and records remain.
const E234_REGIONAL=[
 {id:'barbo_bronce',name:'Barbo de bronce',zone:'rio',from:'bagre'},
 {id:'dorado_bosque',name:'Dorado del bosque',zone:'rio',from:'trucha'},
 {id:'pez_hoja',name:'Pez hoja',zone:'rio',from:'trucha_arcoiris'},
 {id:'bonito_bruma',name:'Bonito de las brumas',zone:'costa',from:'salmon'},
 {id:'gurami_jade',name:'Gurami de jade',zone:'laguna',from:'trucha_arcoiris'},
 {id:'doncella_coral',name:'Doncella de coral',zone:'arrecife',from:'lubina'},
 {id:'raya_onice',name:'Raya de ónice',zone:'abismo',from:'mantarraya'},
 {id:'sepia_archivo',name:'Sepia del archivo',zone:'ruinas_sumergidas',from:'calamar_abismo'},
 {id:'medusa_cuarzo',name:'Medusa de cuarzo',zone:'cavernas_cristal',from:'pez_cristal'},
 {id:'vibora_primordial',name:'Víbora del primer mar',zone:'abismo_primordial',from:'pez_linternilla'}
];
const E234_BY_ID=new Map(E234_REGIONAL.map(r=>[r.id,r])),E234_ZONE_IDS=new Map();
for(const row of E234_REGIONAL){
 const source=E16_FISH.find(f=>f.id===row.from),zone=E165_ZONES.find(z=>z.id===row.zone);
 E16_FISH.push({...source,id:row.id,name:row.name,req:Math.max(source.req,zone.req)});
 E161_DIFFICULTY[row.id]=Math.max(E161_DIFFICULTY[row.from],1+zone.req/55);
 E190_WEIGHT_RANGES[row.id]=[...E190_WEIGHT_RANGES[row.from]];
 if(E210_CAPTURE_PROFILES[row.from])E210_CAPTURE_PROFILES[row.id]={...E210_CAPTURE_PROFILES[row.from]};
 zone.fish=zone.fish.map(id=>id===row.from?row.id:id);
 if(!E234_ZONE_IDS.has(row.zone))E234_ZONE_IDS.set(row.zone,new Map());E234_ZONE_IDS.get(row.zone).set(row.from,row.id);
}
function e234ZoneId(zone,id){return E234_ZONE_IDS.get(zone)?.get(id)||id;}
function e234SpeciesCount(record,zone){return new Set(Object.entries(record?.species||{}).filter(([,n])=>Number(n)>0).map(([id])=>e234ZoneId(zone,id))).size;}
function e234LocalCount(record,id){const old=E234_BY_ID.get(id)?.from;return(Number(record?.species?.[id])||0)+(old?Number(record?.species?.[old])||0:0);}
function e234BestWeight(s,id){return Math.max(Number(s.ui?.fishingWeights?.bySpecies?.[id]?.bestKg)||0,Number(s.ui?.fishingRegionalLegacy34?.bestWeights?.[id])||0);}
function e234QuestDiscovered(s,id){return e227Discovered(s,id);}
// Update objectives in catalogue data only; never rewrite saved captures/claims.
for(const q of E227_QUESTS)for(const goal of q.goals){if(goal.id)goal.id=e234ZoneId(q.zone,goal.id);if(goal.ids)goal.ids=goal.ids.map(id=>e234ZoneId(q.zone,id));}


// A one-time, additive legacy credit freezes the old global discovery rules.
// Future catches in the original home zone cannot unlock another region's fish.
function e234MigrateRegional(s){
 if(!s||Number(s.ui?.fishingRegionalVersion)>=34)return s;
 s.ui=s.ui||{};const old=s.ui.fishingRegionalLegacy34||{},discovered={...old.discovered},bestWeights={...old.bestWeights};
 for(const r of E234_REGIONAL){
  const h=s.ui.e18Fishing?.bySpecies?.[r.from],w=s.ui.fishingWeights?.bySpecies?.[r.from],local=s.ui.fishingWeights?.byZone?.[r.zone]?.species?.[r.from];
  const owned=['','__large','__huge','__legendary'].some(q=>Number(s.inventory?.['pez_'+r.from+q])>0);
  if(!Object.hasOwn(discovered,r.id))discovered[r.id]=Number(h?.total)>0||Number(w?.catches)>0||Number(local)>0||owned||!!s.ui.e191Achievements?.[r.zone]||!!((Number(s.ui.fishingMasteryEarned?.[r.zone])||0)&4);
  if(!Object.hasOwn(bestWeights,r.id))bestWeights[r.id]=Number(w?.bestKg)||0;
 }
 s.ui.fishingRegionalLegacy34={...old,discovered,bestWeights};s.ui.fishingRegionalVersion=34;return s;
}
const e234BeforeRegionalMigration=migrateState;
migrateState=function(s,version){return e234MigrateRegional(e234BeforeRegionalMigration(s,version));};

// Behaviour profiles only for new species. Existing capture/rarity formulas are untouched.
Object.assign(E210_CAPTURE_PROFILES,{
 congrio_archivo:{speed:1.06,run:1.35,gain:.98,loss:1.04},tetra_prismatico:{speed:1.18,run:1.10,gain:1,loss:1.06},
 ajolote_cuarzo:{speed:1.03,run:1.14,gain:1,loss:1},esturion_geoda:{speed:1.08,run:1.25,gain:.96,loss:1.06},
 quimera_ambar:{speed:1.12,run:1.25,gain:.97,loss:1.08},titan_ammonita:{speed:.98,run:1.4,gain:.94,loss:1.10}
});
function e227Discovered(s,id){
 const legacy=E234_BY_ID.get(id);if(legacy&&(s.ui?.fishingRegionalLegacy34?.discovered?.[id]||Number(s.ui?.fishingWeights?.byZone?.[legacy.zone]?.species?.[legacy.from])>0))return true;
 const inv=s.inventory||{},base='pez_'+id;
 return Number(s.ui?.e18Fishing?.bySpecies?.[id]?.total)>0||Number(s.ui?.fishingWeights?.bySpecies?.[id]?.catches)>0||E188_QUALITY.some(q=>Number(inv[q==='normal'?base:base+'__'+q])>0);
}
function e227HistoricalDone(s,q){return !!(q.rodId?s.owned?.[q.rodId]:s.ui?.e187Rewards?.[q.id]);}
function e227MigrateMastery(s){
 if(!s||s.ui?.fishingMasteryVersion>=27)return s;
 s.ui=s.ui||{};
 // New optional fields only. Never replace unknown UI data or existing earned bits.
 const earned=s.ui.fishingMasteryEarned&&typeof s.ui.fishingMasteryEarned==='object'&&!Array.isArray(s.ui.fishingMasteryEarned)?s.ui.fishingMasteryEarned:{};
 for(const zone of E227_MASTERY_BASELINE){
  const found=zone.speciesIds.filter(id=>e227Discovered(s,id)).length,accredited=!!s.ui.e191Achievements?.[zone.zoneId];
  const qs=E227_OLD_QUESTS.filter(q=>zone.mainQuestIds.includes(q.id));
  const stars=[accredited||found>=Math.ceil(zone.speciesIds.length/2),qs.length?qs.every(q=>e227HistoricalDone(s,q)):accredited||found>0,accredited||found===zone.speciesIds.length];
  const mask=stars.reduce((a,b,i)=>a|(b?1<<i:0),0);earned[zone.zoneId]=(Number(earned[zone.zoneId])||0)|mask;
 }
 s.ui.fishingMasteryEarned=earned;s.ui.fishingMasteryVersion=27;return s;
}
function e227EarnMastery(){
 if(!state)return;e227MigrateMastery(state);
 const defs=e216QuestDefinitions();for(const zone of E165_ZONES){const p=e216ZoneProgress(zone,defs),mask=p.stars.reduce((a,b,i)=>a|(b?1<<i:0),0);state.ui.fishingMasteryEarned[zone.id]=(Number(state.ui.fishingMasteryEarned[zone.id])||0)|mask;}
}
// Decode runs for every character, including inactive ones; no storage writes during decode.
const e227PreviousMigration=migrateState;
migrateState=function(s,version){return e227MigrateMastery(e227PreviousMigration(s,version));};
const e227PreviousRecord=makeRosterRecord;
makeRosterRecord=function(){if(state&&ready)e227EarnMastery();return e227PreviousRecord();};
function e227QuestGoal(q,goal){
 const zone=E165_ZONES.find(z=>z.id===q.zone),record=state.ui?.fishingWeights?.byZone?.[q.zone]||{};
 if(goal.kind==='speciesQualityCount'){const f=E16_FISH.find(f=>f.id===goal.id),counts=e218Record(goal.id).categoryCounts;return{label:`Conseguí ${goal.need} ${f.name} · ${E218_CATEGORIES[goal.category]} (contadores registrados)`,have:Number(counts[goal.category])||0,need:goal.need};}
 if(goal.kind==='speciesCount')return{label:`Capturá ${goal.need} ${E16_FISH.find(f=>f.id===goal.id).name} en ${zone.name}`,have:e234LocalCount(record,goal.id),need:goal.need};
 if(goal.kind==='captures')return{label:`Conseguí ${goal.need} capturas en ${zone.name}`,have:Number(record.catches)||0,need:goal.need};
 if(goal.kind==='weight')return{label:`Récord local de al menos ${e190Kg(goal.need)}`,have:Number(record.bestKg)||0,need:goal.need};
 if(goal.kind==='speciesWeight')return{label:`Capturá ${E16_FISH.find(f=>f.id===goal.id).name} de al menos ${e190Kg(goal.need)}`,have:e234BestWeight(state,goal.id),need:goal.need};
 const ids=goal.ids||zone.fish;return{label:goal.ids?'Descubrí '+ids.map(id=>E16_FISH.find(f=>f.id===id).name).join(' y '):`Descubrí ${goal.need} especies de ${zone.name}`,have:ids.filter(id=>e234QuestDiscovered(state,id)).length,need:goal.need};
}
function e227QuestDefinitions(){return E227_QUESTS.map(q=>({...q,reward:q.rodId?'Caña · '+E161_RODS.find(r=>r.id===q.rodId).name:e232BadgeReward(q),done:!!state.ui?.fishingQuestRewards?.[q.id],goals:q.goals.map(g=>({...e227QuestGoal(q,g),kind:g.kind,fishIds:g.id?[g.id]:g.ids||[]})),note:(q.description?q.description+' ':'')+(q.masteryRole==='supplemental'?'Encargo complementario: no cambia las estrellas históricas. Cuenta el progreso guardado; no consume peces.':'Encargo principal de maestría. Cuenta el progreso guardado; no consume peces ni exige la especie mítica.')}));}
function e227RenderQuests(){
 const group=document.querySelector('#page_fishing .e171Quests');if(!group||!state)return;
 const qs=e227QuestDefinitions().filter(q=>q.zone===e165Zone().id&&!q.done);if(!qs.length)return;
 let fold=group.querySelector('.e194QuestFold');if(!fold){fold=document.createElement('details');fold.className='e194QuestFold';fold.open=e194QuestOpen;fold.innerHTML='<summary></summary><div class="e194QuestBody"></div>';fold.addEventListener('toggle',()=>{e194QuestOpen=fold.open;});group.prepend(fold);}
 const body=fold.querySelector('.e194QuestBody');
 for(const q of qs){const section=document.createElement('section');section.className='e227Quest';section.dataset.questId=q.id;section.innerHTML=`<b>${esc(q.title)}</b><ul>${q.goals.map(g=>`<li>${esc(g.label)} · ${fmt(Math.min(g.have,g.need))}/${fmt(g.need)}</li>`).join('')}</ul><small>${esc(q.note)}</small><div class="actions"><span>${esc(q.reward)}</span><button data-expansion-claim="${q.id}" ${q.goals.every(g=>g.have>=g.need)?'':'disabled'}>Reclamar recompensa</button></div>`;body.append(section);}
 fold.querySelector(':scope>summary').textContent='Encargos de esta zona ('+body.children.length+')';e216CompactQuests();
}


document.addEventListener('click',event=>{
 const button=event.target.closest('[data-expansion-claim]');if(!button)return;
 event.preventDefault();if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 const q=e227QuestDefinitions().find(q=>q.id===button.dataset.expansionClaim);
 if(!q||q.done||q.zone!==e165Zone().id||!q.goals.every(g=>g.have>=g.need))return;
 state.ui.fishingQuestRewards=state.ui.fishingQuestRewards||{};state.ui.fishingQuestRewards[q.id]=true;if(q.rodId){state.owned=state.owned||{};state.owned[q.rodId]=true;}
 addLog('Pesca: '+q.title+' · '+q.reward);e227EarnMastery();persist();e16Page();updateLive();toast('Encargo completado: '+q.title);
});
