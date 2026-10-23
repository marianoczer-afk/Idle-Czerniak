
"use strict";
/* Sin cambiar datos guardados, XP, probabilidades, ni el balance del minijuego. */
let e182LastCatch=null;
const e182BeforePage=e16Page;
e16Page=function(){
 e182BeforePage();
 const current=document.getElementById('page_fishing');if(!current||!state)return;
 const dock=current.querySelector('.e162Dock'),game=current.querySelector('#e16GamePanel');if(!dock||!game)return;
 // Reserva siempre el mismo espacio para que una picada no empuje el documento.
 game.style.display='block';
 game.classList.toggle('e182Idle',!e16Session);
 game.setAttribute('aria-hidden',e16Session?'false':'true');
 const previous=current.querySelector('.fishCatch');
 if(previous)previous.remove();
 let result=dock.querySelector('.e182Result');
 if(!result){result=document.createElement('div');result.className='e182Result';dock.append(result);}
 const recent=e182LastCatch&&Date.now()-e182LastCatch.at<7500&&e182LastCatch.zone===e165Zone().id;
 result.hidden=!recent;
 if(recent){
  const c=e182LastCatch;
  result.innerHTML=`<b>🎉 ¡Capturaste ${c.name}!</b> · +${fmt(c.xp)} XP de Pesca · <b>${fmt(c.price)} oro</b> al vender<small>El pez se guardó en tu inventario. Podés venderlo en el mercader.</small>`;
 }
 // No duplicar el panel de progreso; el principal ya está junto al minijuego.
 const extra=[...current.querySelectorAll('.fishPanel')].find(p=>p!==dock&&p.textContent?.includes('Cada 3 niveles ganás'));
 if(extra)extra.remove();
 // Al recrear los controles, el navegador puede intentar desplazar la página al foco.
 /* no programmatic scrolling */
};
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
