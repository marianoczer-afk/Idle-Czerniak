
"use strict";
/* Ilustración horizontal de la caña: empuñadura, carrete, guías, línea y señuelo. */
e189RodSVG=function(id){
 const key=(id||'').toLowerCase();
 const metal=/coral/.test(key)?'#ff9d82':/bruma|abis/.test(key)?'#bba2ff':/guard|viejo/.test(key)?'#91d8ad':/fibra|reforz/.test(key)?'#b9d7e9':/colecc/.test(key)?'#f7d57c':'#e0b576';
 const glow=/bruma|abis|coral|colecc/.test(key);
 return '<svg viewBox="0 0 145 44" role="img" aria-label="Caña equipada vista horizontal" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="e190rod" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#533522"/><stop offset=".23" stop-color="'+metal+'"/><stop offset="1" stop-color="#f1e6b3"/></linearGradient></defs><path d="M7 36 Q66 28 130 7" fill="none" stroke="#0c1117" stroke-width="6" stroke-linecap="round"/><path d="M7 36 Q66 28 130 7" fill="none" stroke="url(#e190rod)" stroke-width="3.2" stroke-linecap="round"/><path d="M7 36 L32 33" stroke="#72503c" stroke-width="7" stroke-linecap="round"/><path d="M12 34 L28 32" stroke="#c79b6b" stroke-width="1" stroke-dasharray="3 3"/><g stroke="'+metal+'" fill="none" stroke-width="1.6"><ellipse cx="55" cy="26" rx="3" ry="5"/><ellipse cx="86" cy="18" rx="2" ry="4"/><ellipse cx="114" cy="11" rx="1.6" ry="3"/></g><circle cx="39" cy="33" r="8" fill="#344854" stroke="'+metal+'" stroke-width="2.5"/><circle cx="39" cy="33" r="3" fill="'+metal+'"/><path d="M39 33 l-7 10" stroke="'+metal+'" stroke-width="2"/><path d="M130 7 Q140 12 136 29" stroke="#c8dce7" stroke-width=".8" stroke-dasharray="2 2" fill="none"/><path d="M136 29 l-4 5 4 5 4-5Z" fill="'+metal+'"/>'+(glow?'<circle cx="133" cy="7" r="4" fill="'+metal+'" opacity=".65"/>':'')+'</svg>';
};
/* Una silueta genérica compartida: nunca depende de la especie seleccionada. */
function e190MysteryArt(){
 return '<svg class="fishMysteryArt" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Pez por descubrir"><path d="M16 40 Q37 17 74 28 L104 15 L97 40 L104 65 L74 52 Q37 63 16 40Z" fill="#8c8c8c"/><path d="M42 27 L50 14 L66 27 M44 54 L56 66 L70 53" fill="#696969"/><text x="57" y="48" text-anchor="middle" font-family="system-ui,sans-serif" font-size="25" font-weight="800" fill="#e2e2e2">?</text></svg>';
}
/* El HUD no revela especie durante la picada; solo al capturarla. */
function e189UpdateArt(){
 const dock=document.getElementById('combatDock');if(!dock?.classList.contains('e188FishingMode'))return;
 const hud=document.getElementById('e188FishingHud');if(!hud)return;
 let art=hud.querySelector('.e189Art'),data=hud.querySelector('.e189Data');
 if(!art){art=document.createElement('div');art.className='e189Art';art.setAttribute('role','button');art.tabIndex=0;art.title='Volver a la pesca · experiencia y minijuego';hud.prepend(art);}
 if(!data){data=document.createElement('div');data.className='e189Data';[...hud.children].filter(n=>n!==art&&!n.classList.contains('dockProgress')).forEach(n=>data.append(n));hud.append(data);}
}
/* Reemplazar el texto que muestra el nombre en el panel mientras está picando. */
const e190PreviousPage=e16Page;
e16Page=function(){e190PreviousPage();if(!e16Session)return;const page=document.getElementById('page_fishing');if(!page)return;const waiting=page.querySelector('#e161WaitingText');if(waiting)waiting.textContent='🐟 ¡Picó un pez misterioso!';const status=page.querySelector('#e16Status');if(status)status.textContent='🐟 ¡Picó un pez misterioso!';};
/* Recorridos continuos y anticipación de impulso. La dificultad, control y resiliencia
   se miden por separado de la selección aleatoria y las recompensas. */
// Capture behavior is separate from rarity weights: demanding fish need sustained tracking.
/* @include src/catalogs/052-e190-polish-e210_capture_profiles.js */
const E232_DEFAULT_CAPTURE={speed:1,run:1,gain:1,loss:1};
function e233MotionRandom(g){let n=g.motionRng;n^=n<<13;n^=n>>>17;n^=n<<5;g.motionRng=n>>>0;return g.motionRng/4294967296;}
function e190FishingStep(g,holding,dt,width,random=Math.random){
 if(Number.isFinite(g.controlFraction))g.fish.zone=Math.min(width*.55,Math.max(16,width*(g.controlFraction+(g.controlRewardFraction||0))+(g.controlExtra||0)));
 // Player input stays proportional to the track on desktop and touch.
 const limit=Math.max(0,width-g.fish.zone-4),scale=width/520;
 g.vel+=(holding?600:-570)*scale*dt;g.vel=Math.max(-220*scale,Math.min(220*scale,g.vel));g.pos=Math.max(0,Math.min(limit,g.pos+g.vel*dt));if(g.pos===0||g.pos===limit)g.vel=0;
 const diff=E161_DIFFICULTY[g.fish.id]||1,motion=g.motion||{distance:1,interval:1};
 const profile=E210_CAPTURE_PROFILES[g.fish.id]||E232_DEFAULT_CAPTURE;
 // Local zigzags with occasional changes of hunting ground. Randomness is
 // attempt-local; the smooth velocity/acceleration limits prevent teleporting.
 if(g===e16Session&&!Number.isFinite(g.qualityRoll)){g.qualityRoll=e186QualityRoll();g.qualityRank=g.qualityRoll<.018?3:g.qualityRoll<.115?2:g.qualityRoll<.34?1:0;}
 if(!g.motionRng)g.motionRng=((Math.floor((g.seed||1)*1e7)^g.fish.id.split('').reduce((n,c)=>Math.imul(n,31)+c.charCodeAt(0),7))>>>0)||1;
 const capture=g.capture||e232CaptureProfile(g.fish,e161Rod(),e16FishLevel(),g.weightKg),rank=g.qualityRank||0;
 g.time+=dt;
 // Restore the older heading/burst model. There is no distant waypoint that
 // keeps pulling the fish in the same direction after it decides to reverse.
 if(g.time>=(g.turnAt||0)){
  const reverse=e233MotionRandom(g)<.66+Math.min(.18,g.fish.wiggle*.2);if(reverse)g.dir=-(g.dir||1);
  const feint=e233MotionRandom(g)<.12+rank*.06;
  g.turnAt=g.time+(feint?.18+.12*e233MotionRandom(g):.35+.55*e233MotionRandom(g))*Math.pow(motion.interval,.65)/Math.sqrt(diff)/(1+rank*.10);
 }
 if(g.time>=(g.burstAt||0)){g.burst=.72+e233MotionRandom(g)*.55;g.burstAt=g.time+(.28+e233MotionRandom(g)*.48)*Math.pow(motion.interval,.4);}
 const speed=Math.min(.40,(.18+g.fish.speed*.12)*Math.sqrt(diff)*Math.sqrt(profile.speed)*capture.pressure*(1+rank*.06))*Math.pow(motion.distance,1.25);
 g.travelMin=Math.min(g.travelMin??g.target,g.target);g.travelMax=Math.max(g.travelMax??g.target,g.target);
 if(g.time>=(g.travelAt??1.7)&&g.time>=(g.escapeUntil||0)){
  if(g.travelMax-g.travelMin<width*.28){g.escapeDir=g.target+12<width*.5?1:-1;g.escapeGoal=width*(g.escapeDir>0?.88:.12)-12;g.escapeUntil=g.time+Math.abs(g.escapeGoal-g.target)/(width*Math.max(.12,speed))+.2;}
  g.travelMin=g.travelMax=g.target;g.travelAt=g.time+1.7;
 }
 const direction=g.time<(g.escapeUntil||0)?g.escapeDir:g.dir;

 const desiredVelocity=direction*speed*width*(g.burst||1)+Math.sin(g.time*(4+g.fish.wiggle*5)+(g.seed||0))*g.fish.wiggle*width*.025;
 const ceiling=width*.42*Math.pow(motion.distance,1.25),capped=Math.max(-ceiling,Math.min(ceiling,desiredVelocity));
 const response=width*3.8*Math.sqrt(motion.distance);
 g.targetVelocity=(g.targetVelocity||0)+Math.max(-response*dt,Math.min(response*dt,capped-(g.targetVelocity||0)));
 g.target=Math.max(3,Math.min(width-30,g.target+g.targetVelocity*dt));
 if(g.target===3||g.target===width-30){g.dir=g.target===3?1:-1;g.escapeDir=g.dir;g.targetVelocity=Math.abs(g.targetVelocity)*g.dir;}
 const inside=g.target+12>=g.pos&&g.target+12<=g.pos+g.fish.zone;
 const endurance=1+Math.max(0,(g.fish.req||1)-32)*.003;
 const gain=.13/(1+Math.max(0,diff-1)*.20)/endurance*profile.gain/capture.endurance,loss=Math.max(.13,.10*(.85+diff*.14)*profile.loss)*capture.loss*(g.time<.9?.4:1);
 g.progress=Math.max(0,Math.min(1,g.progress+(inside?gain:-loss)*dt));
 return g.progress>=1?'won':g.time>4&&g.progress<=0?'escaped':null;
}
e16Animate=function(now){
 if(!e16Session)return;
 const g=e16Session,dt=Math.min(.05,Math.max(0,(now-e16Last)/1000));e16Last=now;
 const outcome=e190FishingStep(g,e16Holding,dt,e190TrackWidth());
 e16Paint();if(outcome)return e16Finish(outcome==='won');
 e16Frame=requestAnimationFrame(e16Animate);
};
