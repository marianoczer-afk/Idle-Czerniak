
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
