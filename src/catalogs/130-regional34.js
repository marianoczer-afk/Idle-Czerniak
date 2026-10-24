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
