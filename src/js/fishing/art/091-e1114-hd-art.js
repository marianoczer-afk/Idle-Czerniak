
"use strict";
const E1114_ROD_IMAGES=["@@ASSET:image-e6235bb6faf484da@@", "@@ASSET:image-46e055e97f39060b@@", "@@ASSET:image-51c9e04b9244779f@@", "@@ASSET:image-5006a50edbb9293c@@", "@@ASSET:image-07585621c5b370b9@@", "@@ASSET:image-55cf597420c89960@@", "@@ASSET:image-0253a1a04eed2710@@", "@@ASSET:image-ec25d839a6d231c1@@", "@@ASSET:image-668c20e7838e2817@@", "@@ASSET:image-2bc708d266a0da77@@", "@@ASSET:image-5039c02292c021dc@@", "@@ASSET:image-0acc2b44863c06fb@@", "@@ASSET:image-ec2fee7daae8f056@@", "@@ASSET:image-177dff5cf61f442d@@", "@@ASSET:image-dde8bd680619bb4f@@", "@@ASSET:image-c3129b1dffd6e0a2@@", "@@ASSET:image-f60d546437aba317@@", "@@ASSET:image-6cb1dca2251d9e39@@"];
const E1114_FISH_IMAGES=["@@ASSET:image-71e278f4e39c6cab@@", "@@ASSET:image-f08ce794e172daee@@", "@@ASSET:image-c48c26f74c2a213c@@", "@@ASSET:image-593a4c22ce1a3a44@@", "@@ASSET:image-7051dfb7c132e627@@", "@@ASSET:image-c6b19f328698ddc5@@", "@@ASSET:image-a54f24507e9b7e7b@@", "@@ASSET:image-aa3599f5fdfd1db1@@", "@@ASSET:image-53fc435d3b42ae02@@", "@@ASSET:image-9aac059824778169@@", "@@ASSET:image-c8618d539ae171d6@@", "@@ASSET:image-78cc04e715c2ca75@@"];
const E1114_ROD_KEYS={"bambu": 6, "bamboo": 6, "reforz": 1, "fiber": 1, "steel": 13, "acero": 13, "cost": 2, "bruma": 9, "solar": 10, "tiempo": 11, "time": 11, "viejo": 0, "pescador": 0, "guard": 7, "rio": 7, "river": 7, "esmer": 3, "laguna": 3, "coral": 2, "nacar": 8, "astral": 4, "celest": 4, "abis": 11, "abyss": 11, "sombr": 11, "volcan": 15, "trofeo": 10, "colec": 10, "muelle": 0};
const E1114_FISH_KEYS={"sardina": 0, "mojarra": 1, "pejerrey": 2, "bagre": 3, "dorado": 4, "corvina": 5, "robalo": 6, "r\u00f3balo": 6, "lenguado": 7, "pargo": 8, "merluza": 9, "trucha": 2, "salmon": 8, "salm": 8, "anguila": 3, "carpa": 4, "tiburon": 11, "tibur\u00f3n": 11, "espada": 5, "fantasma": 10, "sombra": 10, "lucio": 6, "perca": 1, "atun": 5, "at\u00fan": 5, "koi": 4, "manta": 7, "coral": 8, "medusa": 10, "abis": 11, "legend": 11};
function e1114RodIndex(id){const s=String(id||'').toLowerCase();for(const [k,n] of Object.entries(E1114_ROD_KEYS))if(s.includes(k))return n;return e1113Hash(s)%E1114_ROD_IMAGES.length;}
function e1114FishIndex(id){const s=String(id||'').toLowerCase();for(const [k,n] of Object.entries(E1114_FISH_KEYS))if(s.includes(k))return n;return e1113Hash(s)%E1114_FISH_IMAGES.length;}
e194RodArt=function(id){return '<img class="e1114Rod" alt="Ilustración detallada de caña de pesca" draggable="false" src="'+E1114_ROD_IMAGES[e1114RodIndex(id)]+'">';};
e189FishSVG=function(id){return '<img class="e1114Fish" alt="Ilustración de pez" draggable="false" src="'+E1114_FISH_IMAGES[e1114FishIndex(id)]+'">';};
const e1114PreviousPage=e16Page;
e16Page=function(){
 const result=e1114PreviousPage();
 const page=document.getElementById('page_fishing');if(!page)return result;
 // Actualizar tarjetas existentes que fueron generadas antes de este parche.
 const zone=typeof e165Zone==='function'?e165Zone():null;
 if(zone){const fishList=E16_FISH.filter(f=>zone.fish.includes(f.id));
 const cards=page.querySelectorAll('.e186Fish');cards.forEach((card,i)=>{
  const sprite=card.querySelector('.e192Sprite');if(sprite&&fishList[i])sprite.innerHTML=e189FishSVG(fishList[i].id);
 });}
 return result;
};
