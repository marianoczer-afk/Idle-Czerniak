
"use strict";
/* El tiempo de espera no debe duplicar el trabajo de las sacudidas.
   Las cañas automáticas tienen la picada más rápida: esa es su ventaja. */
const e198PreviousNextBite=e161NextBite;
e161NextBite=function(){
 e198PreviousNextBite();
 if(!e161Fishing||!e161OnPage()||e16Session||e195Pending||e161Waiting===null)return;
 const rod=e161Rod();
 const id=String(rod?.id||'').toLowerCase();
 const automatic=/astral|nacar|abisal|abyss/.test(id);
 // Con sacudidas hay una espera breve, luego el jugador atrae la picada.
 // Sin sacudidas la caña superior atrae directamente al pez.
 const delay=automatic?1000+Math.floor(Math.random()*550):850+Math.floor(Math.random()*600);
 clearTimeout(e161Waiting);
 e161CatchAt=Date.now()+delay;
 e161Waiting=setTimeout(()=>{
  e161Waiting=null;e161StopWait();
  if(!e161Fishing||!e161OnPage()||!e161CanFish()||e16Session)return;
  const fish=e161RandomFish();
  if(fish)e16Start(fish.id);
 },delay);
 const waiting=document.getElementById('e161WaitingText');
 if(waiting)waiting.textContent='🎣 Esperando una picada… '+Math.ceil(delay/1000)+' s';
};
