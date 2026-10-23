
"use strict";
/* Las sacudidas ocurren ANTES del minijuego existente: su física permanece intacta. */
let e195Pending=null,e195ShakeTimer=null,e195FirstFocus=false;
const e195OriginalStart=e16Start;
function e195Reset(){e195Pending=null;if(e195ShakeTimer){clearTimeout(e195ShakeTimer);e195ShakeTimer=null;}}
function e195ShakeCount(fish){
 const id=(e161Rod()?.id||'').toLowerCase();
 // Cañas de gama alta: picada automática. Las demás: 1-3 toques.
 if(/astral|nacar|abisal|abyss/.test(id))return 0;
 const difficulty=Number(E161_DIFFICULTY[fish.id]||1);
 const advanced=/coral|esmeralda|reforz|bruma|colecc/.test(id);
 return Math.max(1,Math.min(3,Math.round(1+difficulty*.48-(advanced?1:0))));
}
function e195DrawShake(){
 const dock=document.querySelector('#page_fishing .e162Dock');if(!dock)return;
 dock.querySelector('.e195Shake')?.remove();
 if(!e195Pending||!e161Fishing||e16Session)return;
 const wrap=document.createElement('div');wrap.className='e195Shake';wrap.setAttribute('aria-label','Atraer la picada');
 const title=document.createElement('div');title.className='e195ShakeTitle';title.textContent='💧 ¡Movimiento en el agua!';
 const sub=document.createElement('div');sub.className='e195ShakeSub';sub.textContent='Tocá el círculo para atraer al pez';
 const count=document.createElement('div');count.className='e195ShakeCount';count.textContent='Toques restantes: '+e195Pending.left;
 const bubble=document.createElement('button');bubble.type='button';bubble.className='e195Bubble';bubble.textContent='Picar';bubble.setAttribute('aria-label','Picar: atraer al pez');
 // Distribución acotada para no ocultar el texto y permitir uso táctil.
 bubble.style.left=(15+Math.random()*68)+'%';bubble.style.top=(55+Math.random()*23)+'%';
 wrap.append(title,sub,count,bubble);
 const game=dock.querySelector('#e16GamePanel');if(game)game.before(wrap);else dock.append(wrap);
}
e16Start=function(id){
 if(!e161Fishing||!e161OnPage())return e195OriginalStart(id);
 if(e195Pending)return;
 e182LastCatch=null;
 const fish=E16_FISH.find(f=>f.id===id);if(!fish)return;
 const left=e195ShakeCount(fish);
 if(!left)return e195OriginalStart(id);
 e195Pending={id,left};e16Result='';e16Page();
 e195ShakeTimer=setTimeout(()=>{if(!e195Pending)return;e195Reset();if(e161Fishing&&e161OnPage())e161NextBite();},18000);
};
const e195PriorPage=e16Page;
e16Page=function(){e195PriorPage();e195DrawShake();};
document.addEventListener('click',e=>{
 const b=e.target.closest('.e195Bubble');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(!e195Pending||!e161Fishing||!e161OnPage())return;
 e195Pending.left--;
 if(e195Pending.left<=0){const id=e195Pending.id;e195Reset();e195OriginalStart(id);}
 else e195DrawShake();
},true);
/* Al cambiar de zona o detener la pesca, cancelar la sacudida sin mover la pantalla. */
document.addEventListener('click',e=>{
 if(e.target.closest('[data-e165-zone]'))e195Reset();
 const toggle=e.target.closest('[data-e161-toggle]');
 if(toggle&&e161Fishing)e195Reset();
},true);
const e195PriorTab=selectWorkspaceTab;
selectWorkspaceTab=function(id,save=true){if(id!=='fishing')e195Reset();e195PriorTab(id,save);};
