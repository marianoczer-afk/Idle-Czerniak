
"use strict";
/* Interfaz híbrida; motor y guardados conservados. */
const compactWorkspaceStable = organizeWorkspace;
const compactLiveStable = updateLive;
const hybridDesktop = window.matchMedia('(min-width:851px)');
function hybridSkillCard(name,xp,weapon=false){
  const level=weapon?levelFromXp(xp):skillLvl(xp);
  const low=weapon?xpFor(level):10*Math.pow(level-1,2);
  const high=weapon?xpFor(level+1):10*Math.pow(level,2);
  const percent=clamp((xp-low)/(high-low)*100,0,100);
  return `<div class="skillCard"><div class="row"><span>${esc(name)}</span><b>Nv ${level}</b></div><div class="bar xp" role="progressbar" aria-label="Progreso de ${esc(name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.floor(percent)}"><div style="width:${percent}%"></div></div><small>${fmt(xp-low)} / ${fmt(high-low)} XP para el próximo nivel</small></div>`;
}
function sidebarLabel(s){return (s.ui?.tab==='fishing'?'Progreso de Pesca':'Atributos y habilidades')+' · '+(document.getElementById('hybridSidebar')?.open?'Contraer':'Expandir');}
function hybridRefresh(){
  if(!state)return;
  const box=document.getElementById('skillsBox');
  if(box){
    const rows=[['weapon','⚔ Combate con Armas',state.skill.xp],...SKILLS.map(k=>[k.key,k.name,state.skills[k.key].xp])];
    if(box.children.length!==6){box.innerHTML=rows.map(([k,n,x])=>hybridSkillCard(n,x,k==='weapon')).join('');Array.from(box.children).forEach((c,i)=>c.dataset.skillKey=rows[i][0]);}
    rows.forEach(([k,n,x],i)=>{const c=box.children[i],l=k==='weapon'?levelFromXp(x):skillLvl(x),a=progressThreshold(k,l),b=progressThreshold(k,l+1),p=clamp(100*(x-a)/(b-a),0,100);c.querySelector('.row b').textContent='Nv '+l+' → '+(l+1);c.querySelector('.bar > div').style.width=p+'%';c.querySelector('.bar').setAttribute('aria-valuenow',p.toFixed(1));c.querySelector('small').textContent=`${fmt(x-a)} / ${fmt(b-a)} XP · ${p.toFixed(1)}% · faltan ${fmt(b-x)} XP`;});
  }
  const summary=document.getElementById('hybridProfileSummary');
  if(summary){
    const d=derive(state);
    summary.innerHTML='<span class="hybridProfileLabel">'+(sidebarLabel(state))+'</span>';
  }
  const start=document.getElementById('dockStart'),stop=document.getElementById('dockStop');
  if(start)start.disabled=busy||managing||(state.combat.active&&!navActive(state))||state.restLeft>0;
  if(stop)stop.disabled=busy||managing||!state.combat.active;
  measureDock();
}
organizeWorkspace=function(){
  const prefs=uiPreferences(state);
    if(prefs.tab==='character'||prefs.tab==='equipment')prefs.tab='combat';
  compactWorkspaceStable();
  const root=document.getElementById('uiWorkspace');
  const layout=document.createElement('div');layout.className='hybridLayout';
  const sidebar=document.createElement('details');sidebar.id='hybridSidebar';sidebar.className='hybridSidebar';
  sidebar.innerHTML='<summary id="hybridProfileSummary" aria-label="Expandir o contraer ficha del personaje"></summary><div class="hybridSidebarBody"></div>';
  const body=sidebar.querySelector('.hybridSidebarBody');
  body.innerHTML='<div class="sidebarQuickActions"><button class="small" data-act="switchCharacter">Cambiar personaje</button></div>';
  const main=document.createElement('div');main.className='hybridMain';
  for(const node of Array.from(root.children))main.append(node);
  layout.append(sidebar,main);root.append(layout);
  for(const key of ['attributes','skills','equipment','save']){
    const panel=root.querySelector(`details[data-ui-panel="${key}"]`);
    if(!panel)continue;
    body.append(panel);
    const label=panel.querySelector('summary');
    if(key==='attributes'){
      panel.open=true;
      if(label){label.textContent='👤 '+state.name;label.hidden=true;}
    }else if(key==='skills'){
      panel.open=true;if(label)label.textContent='✦ Habilidades';
    }else if(key==='equipment'){
      panel.open=true;if(label)label.textContent='🛡 Equipamiento actual';
    }else if(label)label.textContent='⚙ Guardado y respaldo';
  }
    for(const id of ['character','equipment']){
    document.getElementById('tab_'+id)?.remove();
    document.getElementById('page_'+id)?.remove();
  }
  const saveBody=body.querySelector('details[data-ui-panel="save"] .sectionBody');
  if(saveBody){
    const stable=document.createElement('button');stable.className='small';
    stable.type='button';stable.textContent='Descargar copia completa';
    stable.addEventListener('click',downloadCompactStable);saveBody.append(stable);
  }
  const attributes=body.querySelector('details[data-ui-panel="attributes"]');
  const skills=body.querySelector('details[data-ui-panel="skills"]');
  const equipment=body.querySelector('details[data-ui-panel="equipment"]');
  for(const panel of [attributes,skills,equipment]){
    if(!panel)continue;
    const label=panel.querySelector('summary');
    if(label)label.style.pointerEvents='none';
    panel.addEventListener('toggle',()=>{if(panel.isConnected&&!panel.open)panel.open=true;});
  }
  sidebar.open=hybridDesktop.matches||prefs.panels.mobileProfile===true;
  sidebar.addEventListener('toggle',()=>{
    if(!sidebar.isConnected||!state||busy||managing)return;
    if(hybridDesktop.matches){if(!sidebar.open)sidebar.open=true;return;}
    const current=uiPreferences(state);
    if(current.panels.mobileProfile!==sidebar.open){current.panels.mobileProfile=sidebar.open;persist();}
    hybridRefresh();
  });
  const dock=document.querySelector('.dockInner');
  if(!document.getElementById('dockControls')){
    const controls=document.createElement('div');controls.id='dockControls';controls.className='dockControls';
    controls.innerHTML='<button id="dockStart" class="primary" data-act="start">▶ Combatir</button><button id="dockStop" data-act="stop">■ Detener</button>';
    dock.append(controls);
  }
  hybridRefresh();
};
updateLive=function(){compactLiveStable();hybridRefresh();};
function hybridMediaChange(){
  const sidebar=document.getElementById('hybridSidebar');
  if(sidebar&&state)sidebar.open=hybridDesktop.matches||uiPreferences(state).panels.mobileProfile===true;
  measureDock();
}
if(hybridDesktop.addEventListener)hybridDesktop.addEventListener('change',hybridMediaChange);
else hybridDesktop.addListener(hybridMediaChange);
document.addEventListener('keydown',e=>{
  const tab=e.target.closest('[data-ui-tab]');if(!tab||busy||managing)return;
  const tabs=Array.from(document.querySelectorAll('[data-ui-tab]'));
  const index=tabs.indexOf(tab);let next=index;
  if(e.key==='ArrowRight')next=(index+1)%tabs.length;
  else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
  else if(e.key==='Home')next=0;
  else if(e.key==='End')next=tabs.length-1;
  else return;
  e.preventDefault();e.stopImmediatePropagation();
  selectWorkspaceTab(tabs[next].dataset.uiTab);tabs[next].focus();
},true);
function downloadCompactStable(){
  // Every download must preserve the complete, executable standalone application.
  downloadHTML();
}
