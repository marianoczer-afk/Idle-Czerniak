
"use strict";
/* Valores explícitos y legibles: cinco atributos, ventajas especializadas. */
function e1101Stats(rod){
 const id=String(rod?.id||'').toLowerCase();
 const index=E161_RODS.findIndex(r=>r.id===rod?.id);
 const old=E164_ROD_STATS[index]||{};
 const speed=Math.max(0,Number(old.wait||0));
 const luck=Math.max(0,Number(old.rare||0));
 const control=Math.max(0,Number(old.control??rod?.bonus??0));
 const trophy=0; // Se calcula por caña en e1102/e1103; nunca llamar e186LuckPercent desde e1101Stats.
 const resilience=/astral|abisal|abyss/.test(id)?22:/coral|nacar/.test(id)?16:/esmeralda|reforz/.test(id)?11:/bruma|costa/.test(id)?8:3;
 return {speed,luck,control,resilience,maxKg:e190Capacity(rod),trophy:Math.min(35,trophy)};
}
function e1101View(r){
 const st=e1101Stats(r);
 return '<div class="e1101Stats">'+[
 ['⚡ Atracción',st.speed+'%'],['🍀 Suerte',st.luck+'%'],['🎯 Control','+'+e190ControlPercent(st.control)+'%'],
 ['🛡 Resiliencia',st.resilience+'%'],['🏆 Trofeos',st.trophy+'%']
 ].map(([k,v])=>'<div class="e1101Stat">'+k+'<b>'+v+'</b></div>').join('')+'</div>';
}
const e1101OldPage=e16Page;
e16Page=function(){
 const result=e1101OldPage();
 const page=document.getElementById('page_fishing');
 if(!page||!state)return result;
 const panel=page.querySelector('details:has(.fishRod)');
 if(panel)panel.querySelectorAll('.fishRod').forEach(row=>{
  const name=row.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim();
  const rod=E161_RODS.find(r=>r.name===name);
  if(!rod||row.querySelector('.e1101Stats'))return;
  const stats=document.createElement('div');stats.innerHTML=e1101View(rod);
  const info=row.querySelector('div');if(info)info.append(stats);
  const equipped=e161Rod(),a=e1101Stats(rod),b=e1101Stats(equipped);
  const diff=document.createElement('div');diff.className='e1101Compare';
  diff.textContent=equipped&&rod.id!==equipped.id?
    'Vs. tu caña: Atracción '+(a.speed-b.speed>=0?'+':'')+(a.speed-b.speed)+'% · Suerte '+(a.luck-b.luck>=0?'+':'')+(a.luck-b.luck)+'% · Control '+(a.control-b.control>=0?'+':'')+(a.control-b.control):
    'Estadísticas de tu caña actual';
  if(info)info.append(diff);
 });
 // Una sola referencia al estado de la picada dentro del HUD.
 const hud=document.getElementById('e188FishingHud');
 if(hud){
  const labels=hud.querySelectorAll('small,.fishMuted,.e188Status');
  let seen=false;
  labels.forEach(el=>{
   if(/pescando|esperando.*picada|pez.*luchando/i.test(el.textContent||'')){
    if(seen)el.style.display='none';else seen=true;
   }
  });
 }
 return result;
};
