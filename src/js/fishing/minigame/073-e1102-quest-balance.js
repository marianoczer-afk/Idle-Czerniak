
"use strict";
/* Los premios de misión no están en E161_RODS. No tratarlos como cañas de
   estadística cero: usar sus bonificaciones existentes, sin cambiar capturas. */
const E1102_QUEST_VALUES={
 e17_rod_viejo:{wait:10,rare:0,resilience:7,trophy:4},
 e171_rod_rio:{wait:12,rare:0,resilience:9,trophy:8},
 e171_rod_costa:{wait:15,rare:0,resilience:12,trophy:13},
 e18_rod_trofeo:{wait:0,rare:0,resilience:10,trophy:16},
 e187_rod_coral:{wait:16,rare:0,resilience:16,trophy:4}
};
const e1102PreviousStats=e1101Stats;
e1101Stats=function(rod){
 const base=e1102PreviousStats(rod),id=rod?.id||'';
 const special=E1102_QUEST_VALUES[id];
 const baseTrophy={e16_rod:0,e161_rod_bamboo:3,e161_rod_fiber:6,e161_rod_steel:12};
 const trophy=Object.prototype.hasOwnProperty.call(baseTrophy,id)?baseTrophy[id]:
  special?.trophy??(id.includes('brumas')?13:id.includes('guard')?8:4);
 return {...base,speed:special?.wait??base.speed,luck:special?.rare??base.luck,
  resilience:special?.resilience??base.resilience,
  trophy:Math.min(30,trophy+(state?Math.floor((e16FishLevel()-1)/10):0))};
};
const e1102PreviousPage=e16Page;
e16Page=function(){
 const result=e1102PreviousPage();
 const page=document.getElementById('page_fishing');
 const panel=page?.querySelector('details:has(.fishRod)');
 if(!panel||!state)return result;
 const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD];
 const active=e161Rod();
 for(const row of panel.querySelectorAll('.fishRod')){
  const name=row.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim();
  const rod=all.find(r=>r.name===name);
  if(!rod)continue;
  row.querySelectorAll('.e1101Stats,.e1101Compare,.e1102QuestTag').forEach(el=>el.remove());
  const target=row.querySelector('div');if(!target)continue;
  const wrapper=document.createElement('div');wrapper.innerHTML=e1101View(rod);
  target.append(wrapper.firstElementChild);
  const a=e1101Stats(rod),b=e1101Stats(active);
  const names=[['Atracción','speed','%'],['Suerte','luck','%'],['Control','control',' px'],['Resiliencia','resilience','%'],['Trofeos','trophy','%']];
  const cmp=document.createElement('div');cmp.className='e1101Compare';
  cmp.textContent=rod.id===active?.id?'✓ Caña equipada':
   'Vs. equipada: '+names.map(([name,key,unit])=>{const delta=a[key]-b[key];return name+' '+(delta>0?'+':'')+delta+unit}).join(' · ');
  target.append(cmp);
  if(E1102_QUEST_VALUES[rod.id]){
   row.classList.add('e1102Quest');
   const tag=document.createElement('div');tag.className='e1102QuestTag';
   tag.textContent='🏆 Caña de misión · Estadísticas incluidas en la comparación';
   target.append(tag);
  }
 }
 return result;
};
