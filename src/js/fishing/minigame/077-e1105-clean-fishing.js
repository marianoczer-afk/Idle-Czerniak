
"use strict";
/* El panel de captura queda exclusivamente para el minijuego.
   Datos de zona, caña y bonificaciones disponibles en un desplegable aparte. */
const e1105PriorPage=e16Page;
e16Page=function(){
 const result=e1105PriorPage();
 const page=document.getElementById('page_fishing');
 const dock=page?.querySelector('.e162Dock');
 if(!dock)return result;
 const stats=dock.querySelector('.e185Summary');
 if(stats){
  let details=page.querySelector('.e1105Details');
  if(!details){
   details=document.createElement('details');
   details.className='e1105Details';
   const title=document.createElement('summary');
   title.textContent='🎣 Ver datos de zona, caña y bonificaciones';
   details.append(title);
   dock.insertAdjacentElement('afterend',details);
  }
  details.querySelector('.e185Summary')?.remove();
  details.append(stats);
 }
 // Una sola línea de estado antes del minijuego, sin mensajes duplicados.
 const status=page.querySelector('.e162DockHead');
 if(status){
  const nodes=[...status.querySelectorAll('*')].filter(n=>n.children.length===0);
  let seen=false;
  for(const n of nodes){
   if(/esperando picada|caña lanzada/i.test(n.textContent||'')){
    if(seen)n.style.visibility='hidden';else seen=true;
   }
  }
 }
 return result;
};
