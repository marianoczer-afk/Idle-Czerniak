
'use strict';
function e220RodProvenance(rod){
 const zoneId=e210RodZone(rod),zone=E165_ZONES.find(z=>z.id===zoneId),family=E208_FAMILIES.find(f=>f.id===rod.family);
 const quest=rod.unlock?.title||(rod.id===E17_ROD.id?E17_QUEST.title:rod.id===E18_ROD.id?'El trofeo de las corrientes':rod.id===E187_ROD.id?E187_QUESTS.find(q=>q.kind==='rod').title:E171_QUESTS.find(q=>q.rod.id===rod.id)?.title);
 const method=quest?'Encargo':'Compra por oro';
 return {zone:zone?.name||'',family:family?.name||'',quest:quest||'',method,label:[zone?.name,method].filter(Boolean).join(' · '),detail:[family?'Familia: '+family.name:null,quest?'Encargo: '+quest:null,zone?'Zona: '+zone.name:null,'Obtención: '+method].filter(Boolean).join(' · ')};
}
const E217_STAT_KEYS=['speed','luck','control','resilience','trophy','maxKg'];
const E217_SORT_OPTIONS=[['recommended','Recomendadas'],['speed','Mayor atracción'],['luck','Mayor suerte'],['control','Mayor control'],['resilience','Mayor resiliencia'],['maxKg','Mayor capacidad de peso']];
function e217RequiredLevel(rod){
 // req on catalog rods is a display tier, NOT a purchase/equipment requirement.
 if(rod.id===E17_ROD.id)return E17_QUEST.level;
 const quest=E171_QUESTS.find(q=>q.rod.id===rod.id);if(quest)return quest.level;
 if(rod.id===E187_ROD.id)return E187_QUESTS.find(q=>q.kind==='rod').req;
 return null;
}
function e217LevelCompare(a,b,descending=false){
 const x=e217RequiredLevel(a),y=e217RequiredLevel(b);
 if(x===null||y===null)return x===y?0:x===null?1:-1;
 return descending?y-x:x-y;
}
function e217Dominates(a,b){return E217_STAT_KEYS.every(k=>a[k]>=b[k])&&E217_STAT_KEYS.some(k=>a[k]>b[k]);}
function e217Recommended(rods){
 const current=e161Rod(),stats=new Map(rods.map(r=>[r.id,e1101Stats(r)])),result=[];
 for(const owned of [true,false]){
  const group=rods.filter(r=>!!state.owned?.[r.id]===owned),edges=group.map(()=>[]),incoming=group.map(()=>0);
  for(let i=0;i<group.length;i++)for(let j=i+1;j<group.length;j++){
   if(e217Dominates(stats.get(group[i].id),stats.get(group[j].id))){edges[i].push(j);incoming[j]++;}
   else if(e217Dominates(stats.get(group[j].id),stats.get(group[i].id))){edges[j].push(i);incoming[i]++;}
  }
  let front=group.map((_,i)=>i).filter(i=>incoming[i]===0);
  while(front.length){front.sort((a,b)=>Number(group[b].id===current?.id)-Number(group[a].id===current?.id)||a-b);const next=[];
   for(const i of front){result.push(group[i]);for(const j of edges[i])if(--incoming[j]===0)next.push(j);}front=next;
  }
 }
 return result;
}
function e217SortRods(rods,sort='recommended'){
 if(sort==='recommended')return e217Recommended(rods);
 const position=new Map(rods.map((r,i)=>[r.id,i]));
 return [...rods].sort((a,b)=>(sort==='levelAsc'||sort==='levelDesc'?e217LevelCompare(a,b,sort==='levelDesc'):e1101Stats(b)[sort]-e1101Stats(a)[sort])||position.get(a.id)-position.get(b.id));
}
function e217MenuTools(popup,anchor){
 const toolbar=document.createElement('div');toolbar.className='e217RodTools';
 toolbar.innerHTML=`<input type="search" aria-label="Buscar caña" placeholder="Buscar caña…"><select aria-label="Ordenar cañas" title="Compará atributos y especialidades de las cañas">${E217_SORT_OPTIONS.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select><button type="button" aria-label="Cerrar selector de cañas">✕</button><label class="e222Mine"><input type="checkbox" data-picker-mine> Solo mis cañas</label>`;
 popup.prepend(toolbar);popup.setAttribute('aria-label','Seleccionar caña');
 const search=toolbar.querySelector('input'),sort=toolbar.querySelector('select');
 const normalize=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const choices=new Map([...popup.querySelectorAll('.e1120Choice')].map(row=>[row.dataset.rodId,row])),rods=e221Rods().filter(r=>choices.has(r.id));
 let orderKey='';
 const update=()=>{
  const key=sort.value+'|'+e16FishLevel()+'|'+e161Rod()?.id+'|'+rods.map(r=>Number(!!state.owned?.[r.id])).join('');
  if(key!==orderKey){for(const rod of e217SortRods(rods,sort.value))popup.append(choices.get(rod.id).closest('.e222RodEntry'));orderKey=key;}
  const query=normalize(search.value.trim()),mine=toolbar.querySelector('[data-picker-mine]').checked;for(const rod of rods){const row=choices.get(rod.id),hidden=!normalize(rod.name).includes(query)||(mine&&!state.owned?.[rod.id]);row.hidden=hidden;row.closest('.e222RodEntry').hidden=hidden;}
  popup.scrollTop=0;
 };
 search.addEventListener('input',update);sort.addEventListener('change',update);toolbar.querySelector('[data-picker-mine]').addEventListener('change',update);popup.e222Update=update;update();
}

