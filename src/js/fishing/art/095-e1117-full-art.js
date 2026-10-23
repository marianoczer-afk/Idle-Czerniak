
"use strict";
const E1117_RODS=["@@ASSET:image-aa15ecf3933a8d1b@@", "@@ASSET:image-88e5b6dbf8472cb8@@", "@@ASSET:image-2e7e91645bd83f3f@@", "@@ASSET:image-2f6b4337dad728c0@@", "@@ASSET:image-a2143662aed95550@@", "@@ASSET:image-b955108af592e76d@@", "@@ASSET:image-2bfd0853a021bfe9@@", "@@ASSET:image-7d23ea05b98beaaf@@", "@@ASSET:image-ebb688425e018134@@", "@@ASSET:image-0e74c65baf6c9ed9@@", "@@ASSET:image-2733465c58f09a5b@@", "@@ASSET:image-6cee42bfdcf89655@@", "@@ASSET:image-fd373b0ed906391e@@", "@@ASSET:image-f63a2a2d5a35337e@@", "@@ASSET:image-7fdc9fdeff79ad10@@", "@@ASSET:image-7f49b89156243076@@", "@@ASSET:image-aecdf6bf5d684460@@", "@@ASSET:image-fc4dbfe1f44a9bf5@@"];
const E1117_FISH={"costa": "@@ASSET:image-22a56f8a4f3ab6d0@@", "altamar": "@@ASSET:image-49be53fb62bf4aa1@@", "tormenta_nav": "@@ASSET:image-6e0218ffe8dd1f34@@", "mojarra": "@@ASSET:image-81e6c1ff01d58773@@", "bagre": "@@ASSET:image-ef835f8efdadaa1c@@", "trucha": "@@ASSET:image-31e638fc7fdf12d1@@", "salmon": "@@ASSET:image-d903731c2a6cc2bd@@", "pez_espada": "@@ASSET:image-2eb35bf13b75c24c@@", "carpa_dorada": "@@ASSET:image-8536ca4c1f29e69f@@", "trucha_arcoiris": "@@ASSET:image-b370fce34ac73f4f@@", "pez_fantasma": "@@ASSET:image-43a07ec2e92e265f@@", "muelle": "@@ASSET:image-82047a0285e4d371@@", "rio": "@@ASSET:image-6215578480376c67@@", "lucio": "@@ASSET:image-5ec5b7264efa0657@@", "anguila": "@@ASSET:image-762880a55ed1209a@@", "lubina": "@@ASSET:image-cf0debec62ff4668@@", "atun": "@@ASSET:image-e37fdb83af715e7b@@", "mantarraya": "@@ASSET:image-f1216a45bcf81b58@@", "perca_esmeralda": "@@ASSET:image-dc31dbe14c3dd6f5@@", "cangrejo_azul": "@@ASSET:image-00240439d4efe2bf@@", "koi_imperial": "@@ASSET:image-99bd72d2890926ee@@", "pez_luna": "@@ASSET:image-3191268b3743cb39@@", "caballito_mar": "@@ASSET:image-1464e52f6818ba5c@@", "morena": "@@ASSET:image-578122ca0c69d238@@", "tiburon_arrecife": "@@ASSET:image-2c1a72d38cb7471f@@", "pez_linternilla": "@@ASSET:image-e782d4f69032aa20@@", "calamar_abismo": "@@ASSET:image-19e124af30ac3fb8@@", "pez_cristal": "@@ASSET:image-0b7fd2e4b2de5fea@@", "leviatan": "@@ASSET:image-3517d68b608b3814@@", "laguna": "@@ASSET:image-e7a35f33219febdc@@", "arrecife": "@@ASSET:image-a3704be48c187ef2@@", "abismo": "@@ASSET:image-97964312d5ad02c2@@", "mago": "@@ASSET:image-70600f86ea58130f@@", "paladin": "@@ASSET:image-464eb57e2cb7fef3@@", "clerigo": "@@ASSET:image-e525ecc759aabade@@", "druida": "@@ASSET:image-026baf003d2d434e@@", "asesino": "@@ASSET:image-c05eb37c89993803@@", "bardo": "@@ASSET:image-a785a2f507b1f188@@", "guerrero": "@@ASSET:image-c5bef734a9cde320@@", "cazador": "@@ASSET:image-2e25e3f17ad49458@@", "humano": "@@ASSET:image-e2da20943ad607bb@@", "gnomo": "@@ASSET:image-224ed19d9aad8100@@", "newbie": "@@ASSET:image-2a1c8070ec4813e6@@", "cuevas_musgo": "@@ASSET:image-5e23b2e0a9e6ffb3@@", "cripta_abandonada": "@@ASSET:image-227588eaa778d3ca@@", "bosque_sombras": "@@ASSET:image-99746acc209b1c53@@", "dungeon_pirata": "@@ASSET:image-5fd013a9d17221c5@@", "dardo": "@@ASSET:image-79222f63222b8f9f@@", "curar_leve": "@@ASSET:image-fb98c096d35bf8b9@@", "flecha": "@@ASSET:image-192bc897f035db92@@", "flecha_electrica": "@@ASSET:image-19cebbd965cd255e@@", "misil": "@@ASSET:image-39cc3dd5607b4db3@@", "descarga": "@@ASSET:image-be1c5b8e8f652058@@", "curar_grave": "@@ASSET:image-53fe8b0e0f1b6c98@@", "tormenta": "@@ASSET:image-a1302291142f1402@@", "inmovilizar": "@@ASSET:image-d787f1bda53dd732@@", "remover": "@@ASSET:image-a55a99a5e75203d8@@", "apocalipsis": "@@ASSET:image-abfcdb434d694546@@", "daga": "@@ASSET:image-71402b72ab51c432@@", "hacha": "@@ASSET:image-5679c54aff134cd3@@", "cuero": "@@ASSET:image-224ed19d9aad8100@@", "malla": "@@ASSET:image-2c3b84341e1a8a65@@", "placas": "@@ASSET:image-5577056d3786c19f@@", "tunica": "@@ASSET:image-ae2354dcd18a6295@@", "madera": "@@ASSET:image-4aaa7f055138e77f@@", "hierro": "@@ASSET:image-f216a14c2bdb0ba1@@", "torre": "@@ASSET:image-48c93a9df278e4f7@@"};
const e1117RodOld=e194RodArt;
e194RodArt=function(id){
 const i=e1114RodIndex(id);
 return '<img class="e1117Rod" alt="Caña de pesca completa" draggable="false" src="'+E1117_RODS[i%E1117_RODS.length]+'">';
};
const e1117FishOld=e189FishSVG;
e189FishSVG=function(id){
 const url=E1117_FISH[id];
 return url?'<img class="e1117Fish" alt="Ilustración de '+String(id).replaceAll('_',' ')+'" draggable="false" src="'+url+'">':e1117FishOld(id);
};
const e1117PageOld=e16Page;
e16Page=function(){const r=e1117PageOld();
 document.querySelectorAll('#page_fishing .e1114Rod,#combatDock .e1114Rod').forEach(el=>{
  const box=el.closest('.fishRod,.e17Quest,.e171Quest,.e187Quest');
  const name=box?.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim();
  const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD];
  const rod=all.find(x=>x.name===name)||e161Rod();
  if(rod)el.outerHTML=e194RodArt(rod.id);
 });
 const zone=e165Zone();if(zone){const list=E16_FISH.filter(f=>zone.fish.includes(f.id));
  document.querySelectorAll('#page_fishing .e186Fish').forEach((card,i)=>{
   const sprite=card.querySelector('.e192Sprite');if(sprite&&list[i])sprite.innerHTML=card.classList.contains('e186Unknown')?e190MysteryArt():e189FishSVG(list[i].id);
  });}
 return r;};
