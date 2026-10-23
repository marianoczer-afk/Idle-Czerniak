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
