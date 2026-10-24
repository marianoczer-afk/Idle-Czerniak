
"use strict";
/* E1.6.4: cambia únicamente la profesión Pesca. Compatibilidad de guardados v7. */
/* @include src/catalogs/018-e161-fishing-e161_rods.js */
/* @include src/catalogs/018-e161-fishing-e161_difficulty.js */
let e161Waiting=null,e161Countdown=null,e161CatchAt=0,e161Fishing=false;
function e161RodIndex(){if(!state?.owned)return -1;for(let i=E161_RODS.length-1;i>=0;i--)if(state.owned[E161_RODS[i].id])return i;return -1;}
function e161Rod(){return E161_RODS[e161RodIndex()]||null;}
function e161OnPage(){return !!state&&state.ui?.tab==='fishing'&&!document.getElementById('page_fishing')?.classList.contains('hidden');}
function e161CanFish(){return !!(state&&ready&&!busy&&!managing&&storageReady&&!simulationLocked()&&!state.combat.active&&!(state.restLeft>0)&&!navActive(state)&&E16_FISH.some(f=>e165Zone().fish.includes(f.id)&&e16FishLevel()>=f.req&&e190CanLift(f)));}
function e161StopWait(){if(e161Waiting!==null)clearTimeout(e161Waiting);if(e161Countdown!==null)clearInterval(e161Countdown);e161Waiting=null;e161Countdown=null;}
function e161NextBite(){
 e161StopWait();if(!e161Fishing||!e161OnPage()||!e161Rod()||e16Session)return;
 if(!e161CanFish()){e161Fishing=false;e16Result='Para pescar, detené el combate, el descanso y la navegación.';e16Page();return;}
 const lvl=e16FishLevel(),rod=e161RodIndex();
 const wait=Math.round(4500+Math.random()*5000-Math.min(1700,lvl*32)-rod*400);
 e161CatchAt=Date.now()+Math.max(2200,wait);
 e161Waiting=setTimeout(()=>{e161Waiting=null;e161StopWait();if(!e161Fishing||!e161OnPage()||!e161CanFish())return;const f=e161RandomFish();e16Start(f.id);},Math.max(2200,wait));
 e161Countdown=setInterval(()=>{const el=document.getElementById('e161WaitingText');if(el)el.textContent='Esperando una picada… '+Math.max(0,Math.ceil((e161CatchAt-Date.now())/1000))+' s';},250);
 e16Page();
}
function e161RandomFish(){
 const lvl=e16FishLevel(),rod=e161RodIndex();
 const eligible=E16_FISH.filter(f=>lvl>=f.req&&rod>=Math.max(0,Math.floor((f.req-1)/10)));
 const weights=eligible.map(f=>Math.max(.12,12/Math.pow(1+(lvl-f.req)/4,0.4)/Math.pow(E161_DIFFICULTY[f.id],2.3)));
 let n=Math.random()*weights.reduce((a,b)=>a+b,0);
 for(let i=0;i<eligible.length;i++){n-=weights[i];if(n<=0)return eligible[i];}
 return eligible[eligible.length-1]||E16_FISH[0];
}
const e161PreviousTab=selectWorkspaceTab;
selectWorkspaceTab=function(id,save=true){
 const was=e161OnPage();e161PreviousTab(id,save);
 if(id==='fishing'){e16Page();}
 else if(was){e161Fishing=false;e161StopWait();if(e16Session){cancelAnimationFrame(e16Frame);e16Session=null;e16Holding=false;}e16Result='';}
};
const e161PreviousRender=renderGame;
renderGame=function(){e161StopWait();e161PreviousRender();if(e161Fishing&&!e16Session&&e161OnPage())e161NextBite();};

e16Paint=function(){if(!e16Session)return;const g=e16Session,zone=document.getElementById('e16Zone'),target=document.getElementById('e16Target'),meter=document.getElementById('e16Progress');if(zone){zone.style.left=g.pos+'px';zone.style.width=g.fish.zone+'px';}if(target)target.style.left=g.target+'px';if(meter)meter.style.width=Math.round(g.progress*100)+'%';};

e16Start=function(id){
 if(e16Session||!e161Fishing||!e161OnPage()||!e161CanFish())return;
 const f=E16_FISH.find(x=>x.id===id);if(!f||e16FishLevel()<f.req||!e161Rod())return;
 const weightKg=e190SampleWeight(f);
 if(weightKg===null){e161Fishing=false;e16Result='La caña no soporta el peso de este pez.';e16Page();return;}
 const rod=e161Rod(),motion=e190MotionProfile(f,rod),zone=e190CaptureWidth(f,rod);
 const fish={...f,zone};
 e16Session={fish,weightKg,rodId:rod.id,motion,capture:e232CaptureProfile(f,rod,e16FishLevel(),weightKg),controlFraction:e190CaptureWidth(f,rod,e16FishLevel(),1000,false)/1000,controlExtra:0,controlRewardFraction:e187Rewards().abismo?8/520:0,pos:100,vel:0,target:Math.random()*Math.max(20,e190TrackWidth()-40)+8,dir:Math.random()<.5?-1:1,turnAt:.35,seed:Math.random()*6,time:0,progress:.23,burst:0,burstAt:.5};
 e16Holding=false;e16Result='';e16Page();e16Last=performance.now();e16Frame=requestAnimationFrame(e16Animate);
};
e16Animate=function(now){
 if(!e16Session)return;const g=e16Session,dt=Math.min(.05,Math.max(0,(now-e16Last)/1000));e16Last=now;
 const track=document.getElementById("e16Tank");const width=Math.max(220,(track?.clientWidth||520)-6);const limit=Math.max(0,width-g.fish.zone-4);g.vel+=(e16Holding?600:-570)*dt;g.vel=Math.max(-220,Math.min(220,g.vel));g.pos=Math.max(0,Math.min(limit,g.pos+g.vel*dt));if(g.pos===0||g.pos===limit)g.vel=0;
 g.time+=dt;
 const diff=E161_DIFFICULTY[g.fish.id]||1;
 if(g.time>=g.burstAt){g.burst=(Math.random()*.42+.25)*diff*(Math.random()<.5?-1:1);g.burstAt=g.time+.45+Math.random()*.75/diff;}
 g.target+=(g.dir*(58+g.fish.speed*120)*diff*.53+g.burst*55+Math.sin(g.time*6+g.seed)*g.fish.wiggle*48)*dt;
 if(g.target<3){g.target=3;g.dir=1;g.burst=Math.abs(g.burst);}if(g.target>width-30){g.target=width-30;g.dir=-1;g.burst=-Math.abs(g.burst);}
 if(g.time>=g.turnAt){g.dir=Math.random()<.5?-1:1;g.turnAt=g.time+.55+Math.random()*.85/diff;}
 const inside=g.target+12>=g.pos&&g.target+12<=g.pos+g.fish.zone;
 g.progress=Math.max(0,Math.min(1,g.progress+(inside?.19:-.085*diff)*dt));
 e16Paint();if(g.progress>=1)return e16Finish(true);if(g.time>4&&g.progress<=0)return e16Finish(false);
 e16Frame=requestAnimationFrame(e16Animate);
};
e16Finish=function(won){
 const g=e16Session;if(!g)return;e16Session=null;e16Holding=false;cancelAnimationFrame(e16Frame);
 if(won){
  const id='pez_'+g.fish.id;state.inventory=state.inventory||{};state.inventory[id]=(state.inventory[id]||0)+1;
  const gained=sklXp(state,'pesca',Math.max(1,Math.round(g.fish.xp * e181XpFactor())));
  e16Result=`🎉 ¡Capturaste ${g.fish.name}! +${fmt(gained)} XP de Pesca · Valor de venta: ${fmt(g.fish.price)} oro (vendelo al mercader).`;
  addLog('Pesca: '+e16Result);persist();updateInv();/* Resultado visible dentro del panel de pesca; sin toast duplicado. */
 }else{e16Result='💨 ¡El pez escapó! Pronto habrá otra picada.';/* Escape informado dentro del panel de pesca. */}
 e16Page();if(e161Fishing&&e161OnPage())e161NextBite();
};
document.addEventListener('click',e=>{
 const buy=e.target.closest('[data-e161-buy]'),toggle=e.target.closest('[data-e161-toggle]');if(!buy&&!toggle)return;
 e.preventDefault();e.stopImmediatePropagation();if(!state||!ready||busy||managing||!storageReady||simulationLocked())return;
 if(buy){const i=Number(buy.dataset.e161Buy),r=E161_RODS[i];if(!r||i!==e161RodIndex()+1||e16FishLevel()<r.req||state.gold<r.price)return;state.gold-=r.price;state.owned=state.owned||{};state.owned[r.id]=true;persist();renderGame();toast('¡Compraste '+r.name+'!');}
 if(toggle){if(e161Fishing){e195Reset();e161Fishing=false;e161StopWait();if(e16Session){cancelAnimationFrame(e16Frame);e16Session=null;e16Holding=false;}e16Result='Guardaste la caña.';e16Page();}else{if(!e161Rod()||!e161CanFish())return;e161Fishing=true;e182LastCatch=null;e16Result='';e161NextBite();}}
},true);
