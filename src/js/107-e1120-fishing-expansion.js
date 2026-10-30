
"use strict";
(function(){
 const zones=[{id:'manglar',name:'Manglares Susurrantes',req:52,icon:'🌿',desc:'Raíces sumergidas, aguas turbias y depredadores sigilosos.',fish:["sabalo_manglar", "pez_arquero", "anguila_manglar", "tarpon"]},
{id:'glaciar',name:'Lago del Glaciar',req:62,icon:'❄️',desc:'Aguas heladas y profundas; especies adaptadas al frío.',fish:["trucha_alpina", "salvelino", "bacalao_hielo", "esturion_blanco"]},
{id:'volcan',name:'Bahía Volcánica',req:73,icon:'🌋',desc:'Corrientes termales, arrecifes oscuros y peces resistentes.',fish:["pez_lava", "mero_obsidiana", "pez_escorpion", "dragon_mar"]},
{id:'santuario',name:'Santuario Celestial',req:85,icon:'✨',desc:'Aguas luminosas, especies excepcionales y el desafío final.',fish:["carpa_celeste", "pez_cometa", "raya_aurora", "guardian_mareas"]}];
 const species=[{id:'sabalo_manglar',name:'Sábalo del manglar',req:52,price:580,xp:420,speed:0.66,wiggle:0.53,zone:56,icon:'🐟'},
{id:'pez_arquero',name:'Pez arquero',req:54,price:680,xp:470,speed:0.7,wiggle:0.58,zone:53,icon:'🐠'},
{id:'anguila_manglar',name:'Anguila de raíces',req:57,price:920,xp:580,speed:0.74,wiggle:0.61,zone:51,icon:'🐍',rarity:0.085},
{id:'tarpon',name:'Tarpón plateado',req:60,price:1650,xp:790,speed:0.82,wiggle:0.68,zone:47,icon:'🐟',rarity:0.028},
{id:'trucha_alpina',name:'Trucha alpina',req:62,price:780,xp:530,speed:0.7,wiggle:0.55,zone:53,icon:'🐟'},
{id:'salvelino',name:'Salvelino boreal',req:65,price:1000,xp:610,speed:0.76,wiggle:0.61,zone:50,icon:'🐠'},
{id:'bacalao_hielo',name:'Bacalao de hielo',req:68,price:1390,xp:720,speed:0.8,wiggle:0.65,zone:48,icon:'🐟',rarity:0.075},
{id:'esturion_blanco',name:'Esturión blanco',req:71,price:2200,xp:980,speed:0.88,wiggle:0.72,zone:44,icon:'🐟',rarity:0.023},
{id:'pez_lava',name:'Pez de las fumarolas',req:73,price:1180,xp:690,speed:0.77,wiggle:0.62,zone:49,icon:'🐠'},
{id:'mero_obsidiana',name:'Mero de obsidiana',req:76,price:1500,xp:820,speed:0.83,wiggle:0.67,zone:47,icon:'🐟'},
{id:'pez_escorpion',name:'Pez escorpión',req:79,price:2200,xp:1060,speed:0.89,wiggle:0.74,zone:43,icon:'🐡',rarity:0.058},
{id:'dragon_mar',name:'Dragón marino',req:82,price:3800,xp:1500,speed:0.95,wiggle:0.8,zone:40,icon:'🐉',rarity:0.016},
{id:'carpa_celeste',name:'Carpa celestial',req:85,price:1700,xp:950,speed:0.82,wiggle:0.67,zone:47,icon:'🐠'},
{id:'pez_cometa',name:'Pez cometa',req:89,price:2400,xp:1250,speed:0.9,wiggle:0.73,zone:43,icon:'✨',rarity:0.065},
{id:'raya_aurora',name:'Raya de la aurora',req:93,price:3900,xp:1700,speed:0.96,wiggle:0.81,zone:40,icon:'✨',rarity:0.025},
{id:'guardian_mareas',name:'Guardián de las mareas',req:98,price:7500,xp:2800,speed:1.03,wiggle:0.88,zone:37,icon:'👑',rarity:0.008}];
 const difficulties={'sabalo_manglar':1.48, 'pez_arquero':1.58, 'anguila_manglar':1.75, 'tarpon':2.0, 'trucha_alpina':1.62, 'salvelino':1.8, 'bacalao_hielo':1.96, 'esturion_blanco':2.23, 'pez_lava':1.9, 'mero_obsidiana':2.08, 'pez_escorpion':2.3, 'dragon_mar':2.55, 'carpa_celeste':2.05, 'pez_cometa':2.32, 'raya_aurora':2.62, 'guardian_mareas':2.92};
 zones.forEach(z=>{if(!E165_ZONES.some(old=>old.id===z.id))E165_ZONES.push(z);});
 species.forEach(f=>{if(!E16_FISH.some(old=>old.id===f.id))E16_FISH.push(f);});
 Object.assign(E161_DIFFICULTY,difficulties);
 const art={'sabalo_manglar':['#a8c57b','#3d735d','#e6df99','normal'],
'pez_arquero':['#b7d1d2','#557e99','#e8f6f3','archer'],
'anguila_manglar':['#4a967b','#1e4e57','#9ee6bc','eel'],
'tarpon':['#b9d0da','#4c6f88','#e6f7f5','long'],
'trucha_alpina':['#d9c9a6','#718da0','#f8e6c3','normal'],
'salvelino':['#e49c86','#84596f','#f6d6b4','normal'],
'bacalao_hielo':['#a4e0ef','#4384a9','#e5ffff','long'],
'esturion_blanco':['#f2f1de','#8ba5b0','#ffffff','long'],
'pez_lava':['#ff9a49','#7e2939','#ffd76d','normal'],
'mero_obsidiana':['#393e5d','#161d38','#a58bcd','big'],
'pez_escorpion':['#e4a079','#873e3d','#f9dbb1','spiky'],
'dragon_mar':['#e5b879','#76407c','#fff0b5','long'],
'carpa_celeste':['#83cde5','#397fb3','#e8ffff','normal'],
'pez_cometa':['#ffc878','#b95c9e','#fff5b4','long'],
'raya_aurora':['#b7b8ff','#4b72bd','#f7dcff','ray'],
'guardian_mareas':['#e4e6aa','#567a94','#fffde1','big']};
 const oldFishArt=e189FishSVG;
 // New species receive independent vector illustrations, not recycled fish photos.
 e189FishSVG=function(id){
  const key=String(id||'').replace(/^pez_/,'');
  const a=art[key];if(!a)return oldFishArt(id);
  const [base,dark,light,kind]=a;
  const seed=[...key].reduce((n,c)=>n+c.charCodeAt(0),0);
  const body=kind==='ray'?'M8 49 Q38 9 94 43 Q123 42 150 51 Q115 68 94 66 Q51 97 8 49Z'
   :kind==='eel'?'M10 51 Q44 16 79 47 T147 40 Q159 56 137 66 Q104 71 79 59 Q39 40 10 51Z'
   :kind==='long'?'M14 50 Q38 26 87 37 L136 19 L130 50 L141 81 L88 66 Q40 79 14 50Z'
   :kind==='spiky'?'M25 51 Q23 22 77 21 Q125 24 127 51 Q125 83 75 81 Q25 78 25 51Z'
   :kind==='big'?'M17 50 Q34 19 83 21 L133 31 L153 16 L146 51 L153 86 L133 69 L83 79 Q34 81 17 50Z'
   :'M18 51 Q33 24 84 31 L131 20 L124 50 L132 79 L83 68 Q34 78 18 51Z';
  const fins=kind==='ray'||kind==='eel'?'':`<path d="M52 31 L${60+seed%9} 10 L88 29 Z" fill="${dark}" stroke="${light}" stroke-width="2"/><path d="M63 69 L84 89 L96 65Z" fill="${dark}" stroke="${light}" stroke-width="1"/>`;
  const extra=kind==='spiky'?'<path d="M32 26L23 12L47 23L57 9L70 21L85 8L99 23L118 14L121 32" fill="none" stroke="'+light+'" stroke-width="4"/>':'';
  const stripes=seed%2===0?'<path d="M53 35Q60 51 53 67M77 32Q85 51 77 70M99 34Q107 51 99 67" fill="none" stroke="'+dark+'" stroke-width="4" opacity=".42"/>':'<g fill="'+light+'" opacity=".8"><circle cx="60" cy="42" r="3"/><circle cx="75" cy="56" r="3.4"/><circle cx="94" cy="45" r="2.5"/><circle cx="111" cy="55" r="2.8"/></g>';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 100" role="img" aria-label="Ilustración de ${key.replace(/_/g,' ')}" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="skin" x2=".2" y2="1"><stop stop-color="${light}"/><stop offset=".48" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><path d="${body}" fill="url(#skin)" stroke="${light}" stroke-width="2.3" stroke-linejoin="round"/>${fins}${extra}${stripes}<circle cx="34" cy="45" r="4.5" fill="#10242e" stroke="${light}" stroke-width="1.6"/><circle cx="33" cy="44" r="1.5" fill="#fff"/><path d="M18 56Q29 61 36 55" stroke="${dark}" stroke-width="2" fill="none"/></svg>`;
  return svg;
 };
})();
