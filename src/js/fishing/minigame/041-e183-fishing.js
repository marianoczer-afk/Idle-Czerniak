
"use strict";
// Esta capa no altera el motor de pesca ni los guardados v7.
const e183PreviousPage=e16Page;
e16Page=function(){
 e183PreviousPage();
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const game=page.querySelector('#e16GamePanel'),toggle=page.querySelector('.e162DockHead [data-e161-toggle]');
 if(game&&toggle){
  let actions=game.querySelector('.e183Actions');
  if(!actions){actions=document.createElement('div');actions.className='e183Actions';game.prepend(actions);}
  const caption=document.createElement('span');caption.className='fishMuted';
  caption.textContent=e16Session?'🐟 ¡Picó un pez!':e161Fishing?'🎣 Caña lanzada · esperando picada':'🎣 Prepará tu caña para pescar';
  actions.replaceChildren(caption,toggle);
 }
 // El aviso es único y usa la recompensa efectiva, incluso en ejemplares enormes/legendarios.
 const result=page.querySelector('.e182Result');
 if(result&&!result.hidden&&e182LastCatch){
  const c=e182LastCatch;
  const size=e183LastQuality&&e183LastQuality.fish===c.name&&e183LastQuality.at>=c.at-1500?e183LastQuality.label:'';
  result.replaceChildren();
  const title=document.createElement('b');title.textContent='🎉 ¡Capturaste '+c.name+(size?' · '+size:'')+'!';
  const values=document.createElement('span');values.textContent=' · +'+fmt(c.xp)+' XP de Pesca · '+fmt(c.price)+' oro al vender';
  const note=document.createElement('small');note.textContent='Guardado en tu inventario. El oro se obtiene al venderlo.';
  result.append(title,values,note);
 }
};
let e183LastQuality=null;
const e183PreviousFinish=e16Finish;
e16Finish=function(won){
 const fish=won?e16Session?.fish:null;
 const before=fish?e18Record()?.bySpecies?.[fish.id]?.total||0:0;
 e183PreviousFinish(won);
 if(!fish)return;
 // El wrapper de trofeos puede emitir un segundo aviso; conservamos la calidad si aparece.
 const quality=(e16Result.match(/Ejemplar\s+(¡LEGENDARIO!|¡ENORME!|Grande)/)||[])[1]||'';
 e183LastQuality={fish:fish.name,label:quality,at:Date.now()};
 // Re-render final después de actualizar el resultado, sin alterar XP ni precio.
 e16Page();
};
