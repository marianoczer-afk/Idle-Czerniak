
"use strict";
function e1107Sync(){
 const page=document.getElementById('page_fishing');
 const on=!!(state&&page&&e161OnPage()&&!page.classList.contains('hidden'));
 document.body.classList.toggle('e1107Fishing',on);
 const equipment=document.querySelector('.hybridSidebarBody details[data-ui-panel="equipment"]');
 if(equipment){
  const summary=equipment.querySelector('summary');
  if(summary){summary.textContent=on?'':'🛡 Equipamiento actual';summary.hidden=on;if(on)summary.parentElement.open=true;}
  let info=equipment.querySelector('.e1107RodPanel');
  if(!info){info=document.createElement('div');info.className='e1107RodPanel';equipment.append(info);}
  if(on){
   const rod=e161Rod(),st=rod?e1101Stats(rod):null;
   const fields=st?[['speed|Atracción',st.speed+'%'],['luck|Suerte',st.luck+'%'],['control|Control','+'+e190ControlPercent(st.control)+'% de barra'],['resilience|Resiliencia',st.resilience+'%'],['trophy|Trofeos',st.trophy+'%'],['maxKg|Peso máximo',e190Kg(e190Capacity(rod))]]:[];
   const key=JSON.stringify([rod?.name,fields]);
   if(info.dataset.renderKey!==key){info.dataset.renderKey=key;
   info.innerHTML='<div class="e1107RodName">'+(rod?'🎣 '+rod.name:'Sin caña equipada')+'</div>'+
    (rod?'<div class="e230RodHero">'+e230HudArt('rod',rod.id,250,84)+'</div>':'')+'<div class="e1107RodStats">'+fields.map(([name,value])=>'<div>'+e228Icon(name.split('|')[0])+name.split('|')[1]+'<b>'+value+'</b></div>').join('')+'</div>'+
    '<details class="e230StatHelp"><summary>Qué mejora cada atributo</summary><div class="e1107RodHelp">Atracción acelera la picada y reduce los toques previos; suerte mejora la aparición de peces raros; control amplía la barra; resiliencia ayuda con peces difíciles; trofeos mejora los ejemplares especiales.</div></details>';}
  }
 }
 if(!on)return;
 const dock=page.querySelector('.e162Dock'),game=dock?.querySelector('#e16GamePanel');
 if(!dock||!game)return;
 const waiting=dock.querySelector('#e161WaitingText');
 if(waiting&&e161Fishing)waiting.classList.add('e1107Quiet');
 // Mantener una sola explicación: en el minijuego de captura.
 const title=game.querySelector('.e162FightTitle');
 if(title&&e16Session)title.textContent='Mantené al pez dentro de la zona verde';
 // Botón disponible también durante los círculos.
 game.querySelectorAll('.e1107StopShake').forEach(n=>n.remove());
 if(e195Pending&&e161Fishing&&!e16Session){
  const stop=document.createElement('button');stop.type='button';stop.className='e1107StopShake';
  stop.textContent='Dejar de pescar';stop.setAttribute('aria-label','Dejar de pescar');
  game.append(stop);
 }
}




document.addEventListener('click',e=>{
 const stop=e.target.closest('.e1107StopShake');
 if(!stop)return;
 e.preventDefault();e.stopImmediatePropagation();
 const toggle=document.querySelector('#page_fishing .e162DockHead [data-e161-toggle]');
 if(toggle)toggle.click();
},true);
