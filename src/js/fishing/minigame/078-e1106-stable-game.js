
"use strict";
/* Los cambios de fase no deben cambiar la altura del documento ni crear
   dos anuncios simultáneos de que picó un pez. */
const e1106OldPage=e16Page;
e16Page=function(){
 const result=e1106OldPage();
 const page=document.getElementById('page_fishing');
 if(!page)return result;
 const waiting=page.querySelector('#e161WaitingText');
 if(waiting)waiting.classList.toggle('e1106Quiet',!!(e16Session||e195Pending));
 const game=page.querySelector('#e16GamePanel');
 if(game&&e161Fishing)game.style.display='block';
 return result;
};
