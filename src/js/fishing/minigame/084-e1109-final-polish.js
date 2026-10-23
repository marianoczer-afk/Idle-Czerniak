
"use strict";
/* Eliminar el botón Cancelar redundante, manteniendo el control superior
   "Dejar de pescar" que funciona en ambas fases. */
const e1109PreviousPage=e16Page;
e16Page=function(){
 const result=e1109PreviousPage();
 const game=document.querySelector('#page_fishing .e162Dock #e16GamePanel');
 if(!game)return result;
 game.querySelectorAll('[data-e16-cancel]').forEach(b=>b.remove());
 return result;
};
