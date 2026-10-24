
"use strict";
/* E1.8.6: descubrimientos por zona + especialización en trofeos de cañas.
   Usa exclusivamente el registro opcional existente state.ui.e18Fishing. */
let e186BookOpen=false;
function e186LuckPercent(){
 if(!state)return 0;
 const id=e161Rod()?.id||'';
 const rodLuck={e16_rod:0,e161_rod_bamboo:3,e161_rod_fiber:6,e161_rod_steel:12,e17_rod_viejo:4,e171_rod_rio:8,e171_rod_costa:13,e18_rod_trofeo:16};
 const base=Object.prototype.hasOwnProperty.call(rodLuck,id)?rodLuck[id]:id.includes('brumas')?13:id.includes('guard')?8:4;
 return Math.min(30,base+Math.floor((e16FishLevel()-1)/10));
}
/* Conserva exactamente la distribución original con caña básica a nivel 1.
   Aumenta moderadamente la frecuencia de calidad grande, enorme y legendaria
   con cañas avanzadas y nivel. La categoría se muestrea una vez por intento y modula los movimientos. */
function e186QualityRoll(){
 const boost=1+e186LuckPercent()/100;
 const roll=Math.random();
 if(roll<.018*boost)return .009;
 if(roll<.115*boost)return .06;
 if(roll<.34*boost)return .20;
 return .8;
}
const e186PriorPage=e16Page;
e16Page=function(){
 const existing=document.querySelector('#page_fishing .e186Book');
 if(existing)e186BookOpen=existing.open;
 e186PriorPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const dock=page.querySelector('.e162Dock');if(!dock)return;
 const summary=dock.querySelector('.e185Summary');
 if(summary){
  const badge=document.createElement('span');badge.className='e186Luck';
  badge.textContent='✨ Trofeos +'+e186LuckPercent()+'% de probabilidad';
  summary.append(badge);
 }
 const zone=e165Zone(),record=e18Record(),species=E16_FISH.filter(f=>zone.fish.includes(f.id));
 const found=species.filter(f=>(record.bySpecies[f.id]?.total||0)>0).length;
 const book=document.createElement('details');book.className='e186Book';book.open=e186BookOpen;
 const header=document.createElement('summary');header.textContent='📘 Colección de '+zone.name+' · '+found+'/'+species.length+' especies descubiertas';book.append(header);
 const progress=document.createElement('div');progress.className='e186Progress';
 const fill=document.createElement('div');fill.style.width=(species.length?100*found/species.length:0)+'%';progress.append(fill);book.append(progress);
 const grid=document.createElement('div');grid.className='e186BookGrid';
 const bestLabels={normal:'Común',large:'Grande',huge:'Enorme',legendary:'Legendario'};
 for(const f of species){
  const data=record.bySpecies[f.id],count=Number(data?.total)||0;
  const unlocked=e16FishLevel()>=f.req;
  const card=document.createElement('div');card.className='e186Fish';card.dataset.speciesId=f.id;
  if(!count)card.classList.add('e186Unknown');
  if(data?.best==='legendary')card.classList.add('e186Legend');
  const title=document.createElement('strong');title.textContent=count?f.name:(unlocked?'Sin descubrir':'Bloqueado · nivel '+f.req);
  const info=document.createElement('small');info.textContent=count?'Capturados: '+count+' · Récord: '+(bestLabels[data.best]||'Común'):(unlocked?'¡Seguí pescando para descubrirlo!':'Disponible al alcanzar Pesca '+f.req);
  card.append(title,info);grid.append(card);
 }
 book.append(grid);
 const old=page.querySelector('.e186Book');if(old)old.remove();
 const speciesDetails=dock.querySelector('.e173Species');
 if(speciesDetails)speciesDetails.after(book);else if(summary)summary.after(book);else dock.append(book);
};
// Cambiar de zona cierra la colección, mostrando el nuevo conjunto de especies.
document.addEventListener('click',e=>{if(e.target.closest('[data-e165-zone]'))e186BookOpen=false;},true);
