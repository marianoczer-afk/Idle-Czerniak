
"use strict";
/* Sin cambiar datos guardados, XP, probabilidades, ni el balance del minijuego. */
let e182LastCatch=null;


const e182BeforeFinish=e16Finish;
e16Finish=function(won){
 const fish=won?e16Session?.fish:null;
 const xpBefore=fish?e16FishSkill().xp:0;
 const zone=fish?e165Zone().id:null;
 e182BeforeFinish(won);
 if(fish){
  e182LastCatch={name:fish.name,xp:Math.max(0,e16FishSkill().xp-xpBefore),price:fish.price,zone,at:Date.now()};
  e16Page();
 }
};
// Evitar que la barra espaciadora desplace el documento cuando el minijuego está activo,
// incluso si el foco quedó en el botón de tirar la caña.
document.addEventListener('keydown',e=>{
 if(e.code!=='Space'||!e16Session||!e161OnPage()||/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))return;
 e.preventDefault();e16Holding=true;
},true);
document.addEventListener('keyup',e=>{
 if(e.code==='Space'&&e161OnPage()){e.preventDefault();e16Holding=false;}
},true);
// Al cambiar de zona, el mensaje de captura anterior deja de ser relevante.
document.addEventListener('click',e=>{if(e.target.closest('[data-e165-zone]'))e182LastCatch=null;},true);
