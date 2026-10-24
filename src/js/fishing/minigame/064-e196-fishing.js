
"use strict";
/* La caña determina la cantidad de sacudidas. La captura final mantiene su física. */
e195ShakeCount=function(fish){
 const attraction=e1101Stats(e161Rod()).speed;
 const difficulty=Number(E161_DIFFICULTY[fish.id]||1);
 // Attraction affects preparation, never fish motion or capture progress.
 return Math.max(1,Math.min(5,3+Math.floor(Math.max(0,difficulty-1)*1.5)-Math.floor(attraction/10)));
};
/* Anular el bloque anterior y dibujar el círculo DENTRO del juego reservado. */
e195DrawShake=function(){
 const dock=document.querySelector('#page_fishing .e162Dock');if(!dock)return;
 dock.querySelectorAll('.e195Shake,.e196ShakeOverlay').forEach(el=>el.remove());
 const game=dock.querySelector('#e16GamePanel');if(!game)return;
 const active=!!(e195Pending&&e161Fishing&&!e16Session);
 game.classList.toggle('e196Shaking',active);
 if(!active)return;
 game.style.display='block';game.classList.remove('e182Idle');game.setAttribute('aria-hidden','false');
 const wrap=document.createElement('div');wrap.className='e196ShakeOverlay';wrap.setAttribute('aria-label','Atraer la picada');
 if(typeof e227Illustration==='function')wrap.insertAdjacentHTML('afterbegin',e227Illustration('ui','water','e230ShakeWater',true));
 const title=document.createElement('div');title.className='e196Header';title.textContent='¡Hay pique! Tocá la burbuja';
 const count=document.createElement('div');count.className='e196Counter';count.textContent='Toques restantes: '+e195Pending.left;
 const bubble=document.createElement('button');bubble.type='button';bubble.className='e196Bubble';
 const label=document.createElement('span');label.textContent='¡Pique!';
 const hint=document.createElement('small');hint.textContent='TOCÁ';bubble.append(label,hint);bubble.setAttribute('aria-label','Tocar la burbuja para atraer al pez');
 bubble.style.left=(18+Math.random()*64)+'%';bubble.style.top=(43+Math.random()*15)+'%';
 wrap.append(title,count,bubble);game.append(wrap);
};
document.addEventListener('click',e=>{
 const b=e.target.closest('.e196Bubble');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!e195Pending||!e161Fishing||!e161OnPage())return;
 e195Pending.left--;
 if(e195Pending.left<=0){const id=e195Pending.id;e195Reset();e195OriginalStart(id);}
 else e195DrawShake();
},true);
