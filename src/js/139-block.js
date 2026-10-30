
'use strict';
const E231_QUESTS=[
 {
  "id": "e231_cuaderno_muelle",
  "zone": "muelle",
  "title": "El cuaderno del aprendiz",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "discover",
    "need": 2,
    "ids": [
     "mojarra",
     "bagre"
    ]
   }
  ]
 },
 {
  "id": "e231_estanque_muelle",
  "zone": "muelle",
  "title": "El reflejo dorado",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesCount",
    "need": 3,
    "id": "carpa_dorada"
   },
   {
    "kind": "speciesWeight",
    "need": 1.8,
    "id": "trucha"
   }
  ]
 },
 {
  "id": "e231_vigia_costa",
  "zone": "costa",
  "title": "Vigía de la bruma",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesCount",
    "need": 5,
    "id": "lubina"
   },
   {
    "kind": "speciesCount",
    "need": 3,
    "id": "pez_fantasma"
   }
  ],
  "rodId": "e208_rod_marea_cauce"
 },
 {
  "id": "e231_derrota_costa",
  "zone": "costa",
  "title": "La derrota del navegante",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "discover",
    "need": 3,
    "ids": [
     "salmon",
     "pez_espada",
     "lubina"
    ]
   },
   {
    "kind": "captures",
    "need": 24
   }
  ]
 },
 {
  "id": "e231_jardin_laguna",
  "zone": "laguna",
  "title": "Jardín de escamas",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesCount",
    "need": 6,
    "id": "perca_esmeralda"
   },
   {
    "kind": "speciesCount",
    "need": 4,
    "id": "cangrejo_azul"
   }
  ],
  "rodId": "e208_rod_nenufar_fortuna"
 },
 {
  "id": "e231_koi_laguna",
  "zone": "laguna",
  "title": "El espejo del koi",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesWeight",
    "need": 6,
    "id": "koi_imperial"
   },
   {
    "kind": "discover",
    "need": 2,
    "ids": [
     "perca_esmeralda",
     "koi_imperial"
    ]
   }
  ]
 },
 {
  "id": "e231_vivero_arrecife",
  "zone": "arrecife",
  "title": "El vivero del coral",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesCount",
    "need": 5,
    "id": "caballito_mar"
   },
   {
    "kind": "speciesCount",
    "need": 3,
    "id": "morena"
   }
  ],
  "rodId": "e208_rod_coral_cauce"
 },
 {
  "id": "e231_guardian_arrecife",
  "zone": "arrecife",
  "title": "Guardián de las agujas",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesWeight",
    "need": 95,
    "id": "tiburon_arrecife"
   },
   {
    "kind": "captures",
    "need": 28
   }
  ]
 },
 {
  "id": "e231_luz_abismo",
  "zone": "abismo",
  "title": "Una luz en las profundidades",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesCount",
    "need": 6,
    "id": "pez_linternilla"
   },
   {
    "kind": "speciesCount",
    "need": 3,
    "id": "calamar_abismo"
   }
  ]
 },
 {
  "id": "e231_cartografo_abismo",
  "zone": "abismo",
  "title": "Cartógrafo de la fosa",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "discover",
    "need": 4,
    "ids": [
     "mantarraya",
     "pez_linternilla",
     "calamar_abismo",
     "pez_cristal"
    ]
   },
   {
    "kind": "weight",
    "need": 150
   }
  ],
  "rodId": "e208_rod_fosa_titan"
 },
 {
  "id": "e231_puentes_manglar",
  "zone": "manglar",
  "title": "Puentes entre raíces",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesWeight",
    "need": 65,
    "id": "tarpon"
   },
   {
    "kind": "captures",
    "need": 35
   }
  ]
 },
 {
  "id": "e231_forja_volcan",
  "zone": "volcan",
  "title": "La memoria de la forja",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesWeight",
    "need": 100,
    "id": "mero_obsidiana"
   },
   {
    "kind": "speciesCount",
    "need": 8,
    "id": "pez_lava"
   }
  ]
 },
 {
  "id": "e231_mosaico_ruinas_sumergidas",
  "zone": "ruinas_sumergidas",
  "title": "El mosaico incompleto",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "discover",
    "need": 3,
    "ids": [
     "gobio_runico",
     "nautilo_bronce",
     "congrio_archivo"
    ]
   },
   {
    "kind": "speciesWeight",
    "need": 30,
    "id": "nautilo_bronce"
   }
  ]
 },
 {
  "id": "e231_refraccion_cavernas_cristal",
  "zone": "cavernas_cristal",
  "title": "Refracción viva",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesWeight",
    "need": 240,
    "id": "esturion_geoda"
   },
   {
    "kind": "speciesCount",
    "need": 6,
    "id": "ajolote_cuarzo"
   }
  ]
 },
 {
  "id": "e231_estratos_abismo_primordial",
  "zone": "abismo_primordial",
  "title": "Los primeros estratos",
  "gold": 0,
  "masteryRole": "supplemental",
  "description": "Tus capturas históricas cuentan. No consume peces ni cambia las estrellas ya obtenidas.",
  "goals": [
   {
    "kind": "speciesWeight",
    "need": 160,
    "id": "quimera_ambar"
   },
   {
    "kind": "speciesCount",
    "need": 12,
    "id": "isopodo_fosil"
   }
  ]
 }
];
E227_QUESTS.push(...E231_QUESTS);

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

