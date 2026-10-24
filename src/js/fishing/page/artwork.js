// Ordered presentation work; blocks isolate locals and early exits. No captured predecessors.
function fishingRenderPageArtwork(){
 illustrations: { // 089-e1113-art.js
e1113RefreshArt();break illustrations;
 }
 collectionPortraits: { // 091-e1114-hd-art.js


 const page=document.getElementById('page_fishing');if(!page)break collectionPortraits;
 // Actualizar tarjetas existentes que fueron generadas antes de este parche.
 const zone=typeof e165Zone==='function'?e165Zone():null;
 if(zone){const fishList=E16_FISH.filter(f=>zone.fish.includes(f.id));
 const cards=page.querySelectorAll('.e186Fish');cards.forEach((card,i)=>{
  const sprite=card.querySelector('.e192Sprite');if(sprite&&fishList[i])sprite.innerHTML=e189FishSVG(fishList[i].id);
 });}
 break collectionPortraits;

 }
 fullArtwork: { // 095-e1117-full-art.js

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
 break fullArtwork;
 }
}
