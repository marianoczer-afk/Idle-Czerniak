
"use strict";
/* La capa E1.8.3 movía el botón dentro del minijuego. Lo reubicamos fuera
   del overlay para que funcione tanto en sacudida como en captura. */
const e1108OldPage=e16Page;
e16Page=function(){
 const result=e1108OldPage();
 const page=document.getElementById('page_fishing');
 const dock=page?.querySelector('.e162Dock');
 const game=dock?.querySelector('#e16GamePanel');
 if(!dock||!game)return result;
 game.querySelectorAll('.e1107StopShake').forEach(n=>n.remove());
 let toolbar=dock.querySelector('.e1108Toolbar');
 if(!toolbar){toolbar=document.createElement('div');toolbar.className='e1108Toolbar';game.before(toolbar);}
 const toggle=dock.querySelector('[data-e161-toggle]');
 if(toggle){
  toolbar.append(toggle);
  toggle.disabled=!(e161Fishing||e161Rod()&&e161CanFish());
  toggle.textContent=e161Fishing?'Dejar de pescar':'🎣 Tirar la caña';
 }
 const actions=game.querySelector('.e183Actions');
 if(actions)actions.remove();
 // El mismo espacio del minijuego se mantiene durante la espera, los círculos y la captura.
 if(e161Fishing)game.style.display='block';
 return result;
};
