
"use strict";
/* E1.8: récords de capturas y primer encargo por habilidad. No cambia el inventario ni el formato v7. */
/* @include src/catalogs/035-e18-trophies-e18_rod.js */
function e18Record(){
 if(!state)return null;
 state.ui=state.ui||{};
 if(!state.ui.e18Fishing||typeof state.ui.e18Fishing!=='object')state.ui.e18Fishing={total:0,large:0,huge:0,legendary:0,riverHuge:false,bySpecies:{}};
 const r=state.ui.e18Fishing;
 if(!r.bySpecies||typeof r.bySpecies!=='object')r.bySpecies={};
 return r;
}
function e18RodSelected(){return !!state?.owned?.[E18_ROD.id]&&state?.ui?.fishingRodId===E18_ROD.id;}
const e18OldRod=e161Rod;
e161Rod=function(){return e18RodSelected()?E18_ROD:e18OldRod();};
const e18OldFinish=e16Finish;
e16Finish=function(won){
 const fish=won&&e16Session?.fish;
 const zone=fish?e165Zone().id:null;
 let quality=null;
 if(fish){
  const roll=e186QualityRoll();
  quality=roll<.018?'legendary':roll<.115?'huge':roll<.34?'large':'normal';
  const r=e18Record();r.total=Math.max(0,Number(r.total)||0)+1;
  if(quality==='large')r.large=(Number(r.large)||0)+1;
  if(quality==='huge'){r.huge=(Number(r.huge)||0)+1;if(zone==='rio')r.riverHuge=true;}
  if(quality==='legendary'){r.legendary=(Number(r.legendary)||0)+1;if(zone==='rio')r.riverHuge=true;}
  const previous=r.bySpecies[fish.id]||{total:0,best:'normal'};
  const rank={normal:0,large:1,huge:2,legendary:3};
  r.bySpecies[fish.id]={total:(Number(previous.total)||0)+1,best:rank[quality]>rank[previous.best||'normal']?quality:previous.best};
 }
 e18OldFinish(won);
 if(fish){
  const labels={normal:'Común',large:'Grande',huge:'¡ENORME!',legendary:'¡LEGENDARIO!'};
  const msg=quality==='normal'?'':` 🏆 Ejemplar ${labels[quality]}`;
  if(msg){e16Result+=msg;addLog('Pesca: '+fish.name+' · '+labels[quality]);/* Trofeo mostrado en el panel, sin toast duplicado. */}
  persist();e16Page();
 }
};
const e18OldPage=e16Page;
e16Page=function(){
 e18OldPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const dock=page.querySelector('.e162Dock');if(!dock)return;
 const r=e18Record(),lvl=e16FishLevel(),done=!!state.owned?.[E18_ROD.id],eligible=lvl>=12;
 const q=document.createElement('details');q.className='e18Panel e181Journal';
 q.innerHTML=`<summary>📖 Diario de pesca · ${r.total||0} capturas · ${Object.keys(r.bySpecies).length||0} especies</summary>
 <div class="e18Pills"><span>🐟 Grandes: ${r.large||0}</span><span>🏆 Enormes: ${r.huge||0}</span><span>✨ Legendarios: ${r.legendary||0}</span></div>
 <p>Tu colección de trofeos. Los tamaños no modifican el valor de venta.</p>`;
 const quests=page.querySelector('.e171Quests');if(quests)quests.after(q);else dock.after(q);
 if(done){
  const rods=page.querySelector('details:has(.fishRod)');
  if(rods){const equipped=e18RodSelected(),row=document.createElement('div');row.className='fishRod';row.classList.toggle('e172Equipped',equipped);
   row.innerHTML=`<div><b>${equipped?'✓ ':''}${E18_ROD.name}</b><div class="fishMuted">Premio de Pesca · ${E18_ROD.desc}</div></div><button class="small" data-e18-equip ${equipped?'disabled':''}>${equipped?'✓ Equipada':'Equipar'}</button>`;
   rods.append(row);const summary=rods.querySelector('summary');if(summary)summary.textContent='🎣 Cañas y estadísticas · '+(e161Rod()?.name||'Sin caña');
  }
 }
};
document.addEventListener('click',e=>{
 const claim=e.target.closest('[data-e18-claim]'),equip=e.target.closest('[data-e18-equip]');if(!claim&&!equip)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!state||!ready||busy||managing||!storageReady||simulationLocked()||e16Session)return;
 if(claim){if(state.owned?.[E18_ROD.id]||!e190CollectorReady())return;
  state.owned=state.owned||{};state.owned[E18_ROD.id]=true;addLog('Completaste el desafío del ejemplar extraordinario.');
 }else if(!state.owned?.[E18_ROD.id])return;
 if(e161Fishing){e161Fishing=false;e161StopWait();}
 state.ui=state.ui||{};state.ui.fishingRodId=E18_ROD.id;
 persist();renderGame();toast(claim?'🏆 ¡Ganaste la Caña del Coleccionista!':'🎣 Caña del Coleccionista equipada');
},true);
