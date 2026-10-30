
'use strict';
/* Laboratorio aislado y progreso visible; sin nuevo límite normal. */
const PROGRESS_MILESTONES={
 weapon:[[5,'Golpe firme',false],[10,'Categoría de armas de hierro',false],[20,'Categoría de armas de acero',false],[35,'Armas especializadas',false],[50,'Especialización ofensiva',false],[75,'Armas maestras',false],[100,'Maestría',false]],
 magia:[[3,'Comprar Flecha Mágica',true],[5,'Comprar Remover Parálisis y Túnica arcana',true],[6,'Comprar Flecha Eléctrica',true],[10,'Comprar Misil Mágico e Inmovilizar',true],[12,'Comprar Curar Heridas Graves',true],[16,'Comprar Descarga Eléctrica',true],[23,'Comprar Tormenta de Fuego',true],[35,'Comprar Apocalipsis',true],[50,'Especialización mágica',false],[75,'Hechizo maestro',false],[100,'Maestría',false]],
 resMagica:[[5,'Información ampliada de mitigación',false],[10,'Preparación rúnica',false],[20,'Talismanes protectores',false],[35,'Desafío de sellos',false],[50,'Protección manual',false],[75,'Protección especializada',false],[100,'Maestría',false]],
 escudos:[[5,'Minijuego de escudos',false],[8,'Comprar Escudo de hierro',true],[18,'Comprar Escudo torre',true],[20,'Técnica de guardia',false],[35,'Escudos especializados',false],[50,'Reacción defensiva',false],[75,'Escudo maestro',false],[100,'Maestría',false]],
 armaduras:[[5,'Comprar Cota de malla',true],[15,'Comprar Armadura de placas',true],[25,'Armaduras especializadas',false],[35,'Ajuste de equipo',false],[50,'Armaduras avanzadas',false],[75,'Armadura maestra',false],[100,'Maestría',false]],
 navegacion:[[8,'Ruta de altamar',true],[16,'Cruce de tormenta',true],[25,'Dungeon Pirata: requiere también personaje 35',true],[40,'Exploración marítima',false],[60,'Rutas de investigación',false],[80,'Expediciones de colección',false],[100,'Maestría marítima',false]]
};
const progressSkillName=k=>k==='character'?'Personaje':k==='weapon'?'Combate con Armas':SKILLS.find(x=>x.key===k)?.name||k;
function progressSkillLevel(s,k){return k==='character'?levelFromXp(s.xp):k==='weapon'?levelFromXp(s.skill.xp):skl(s,k);}
function progressThreshold(k,n){return k==='character'||k==='weapon'?xpFor(n):10*(n-1)**2;}
function progressStatsText(a,b){return [['hpMax','HP'],['mpMax','MP'],['attack','ATK'],['defense','DEF'],['magicRes','RM'],['spellMult','Poder mágico']].map(([k,name])=>`${name}: ${Number(a[k].toFixed(3))} → ${Number(b[k].toFixed(3))}`).join(' · ');}
function progressNotice(s,before,after,label){
 if(OFF.active||labFrame||s!==state)return;
 if(!s.ui)s.ui={};
 const m=label.match(/(\d+) → (\d+)/),a=m?+m[1]:0,b=m?+m[2]:0;
 const k=Object.keys(PROGRESS_MILESTONES).find(k=>label.startsWith(progressSkillName(k)));
 const rows=k?PROGRESS_MILESTONES[k]:DUNGEONS.map(d=>[d.minLevel,d.name+(d.navReq?' (además Navegación '+d.navReq+')':''),true]);
 const u=rows.filter(r=>r[2]&&r[0]>a&&r[0]<=b).map(r=>r[1]);
 s.ui.lastProgressNotice={label,text:progressStatsText(before,after)+(u.length?' · Requisitos alcanzados: '+u.join('; ')+'. Revisá compra y requisitos adicionales.':'')};
 if(u.length||!e217HasLevelFeedback(s))toast('¡'+label+'!'+(u.length?' · '+u.join(' · '):''));
}
const visibleGainXP=gainCharacterXP;
gainCharacterXP=function(s,n){const a=derive(s),value=visibleGainXP(s,n),b=derive(s);e217XPEvent(s,'character',value,a.L,b.L);if(b.L>a.L)progressNotice(s,a,b,`Nivel ${a.L} → ${b.L}`);return value;};
const visibleSkillXP=sklXp;
sklXp=function(s,key,n){const level=skl(s,key),a=derive(s),value=visibleSkillXP(s,key,n),end=skl(s,key);e217XPEvent(s,key,value,level,end);if(end>level)progressNotice(s,a,derive(s),`${progressSkillName(key)} ${level} → ${end}`);return value;};
const visiblePlayerSwing=playerSwing;
playerSwing=function(d,en){const a=derive(state),x=state.skill.xp;visiblePlayerSwing(d,en);const b=derive(state);e217XPEvent(state,'weapon',state.skill.xp-x,a.sk,b.sk);if(b.sk>a.sk)progressNotice(state,a,b,`Combate con Armas ${a.sk} → ${b.sk}`);};
function visibleSkillCard(name,xp,weapon=false){
 const level=weapon?levelFromXp(xp):skillLvl(xp),lo=weapon?xpFor(level):10*(level-1)**2,hi=weapon?xpFor(level+1):10*level**2;
 const pct=clamp(100*(xp-lo)/(hi-lo),0,100);
 return `<div class="skillCard"><div class="row"><span>${esc(name)}</span><b>Nv ${level} → ${level+1}</b></div><div class="bar xp" role="progressbar" aria-label="${esc(name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct.toFixed(1)}"><div style="width:${pct}%"></div></div><small>${fmt(xp-lo)} / ${fmt(hi-lo)} XP · ${pct.toFixed(1)}% · faltan ${fmt(hi-xp)} XP</small></div>`;
}
hybridSkillCard=visibleSkillCard;

function progressionVisibleRefresh(){
 if(!state||!ready)return;
 const s=state,d=derive(s),a=xpFor(d.L),b=xpFor(d.L+1);
 document.getElementById('xpText').textContent=`${fmt(s.xp-a)} / ${fmt(b-a)} XP · ${(100*(s.xp-a)/(b-a)).toFixed(1)}% · faltan ${fmt(b-s.xp)} para Nv ${d.L+1}`;
 for(const k in PROGRESS_MILESTONES){const card=document.querySelector(`[data-skill-key="${k}"]`);if(!card)continue;let hint=card.querySelector('.nextUnlock');if(!hint){hint=document.createElement('small');hint.className='nextUnlock';hint.style.minHeight='48px';card.append(hint);}Array.from(card.querySelectorAll('small')).slice(1).forEach(el=>{if(el!==hint)el.remove();});const l=progressSkillLevel(s,k),n=PROGRESS_MILESTONES[k].find(r=>r[0]>l&&r[2])||PROGRESS_MILESTONES[k].find(r=>r[0]>l);hint.textContent=n?`${n[2]?'Próximo requisito':'FUTURO, no implementado'}: ${n[1]} · ${l}/${n[0]}`:'Sin más hitos definidos.';}
 document.getElementById('visibleProgressBox')?.remove(); return; // E1.4: objetivos pausados hasta implementar misiones reales.
}

const progressLive=updateLive;
updateLive=function(){progressLive();progressionVisibleRefresh();};
/* Laboratorio: una referencia de contexto de vida estrictamente síncrona. */
let labFrame=null,labJob=null;
const labOriginalXP=xpFor,labOriginalDerive=derive,labOriginalHit=hitChance;
const LAB_DEFAULT_XP20=17000;
function labCurve(n,c){
 if(n<=1)return 0;
 if(n<=10)return Math.floor(c.xp10*((n-1)/9)**1.15);
 if(n<=20)return Math.floor(c.xp10+(c.xp20-c.xp10)*((n-10)/10)**1.15);
 // Solo para que el motor pueda consultar el siguiente umbral. No se mide >20.
 return Math.floor(c.xp20+(c.xp20-c.xp10)*(n-20));
}
xpFor=function(n){return labFrame?.candidate?labCurve(n,labFrame.config):labOriginalXP(n);};
derive=function(s){
 const d=labOriginalDerive(s),f=labFrame;
 if(!f?.candidate||s!==f.fixture)return d;
 const c=classById(s.cls),r=raceById(s.race),eq=equipBonus(s),p=f.config;
 // Combate con Armas conserva su curva original en ambos perfiles.
 const sk=levelFromOriginalWeaponXP(s.skill.xp);d.sk=sk;
 d.attack=Math.max(1,Math.round((CFG.BASE.attack+c.attack+r.attack+p.physLevel*(d.L-1)+eq.attack)*(1+p.weaponScale*(sk-1))));
 d.spellMult=(1+(c.magic+r.magic)/50)*(1+p.magicLevel*(d.L-1))*(1+p.magicSkill*(skl(s,'magia')-1));return d;
};
function levelFromOriginalWeaponXP(x){let n=1;while(labOriginalXP(n+1)<=x)n++;return n;}
const labDeriveCandidate=derive;
derive=function(s){const d=labDeriveCandidate(s);if(labFrame?.candidate&&s===labFrame.fixture)d.sk=levelFromOriginalWeaponXP(s.skill.xp);return d;};
hitChance=function(a,b){
 if(labFrame?.candidate&&labFrame.playerAccuracy){const p=labFrame.config;return clamp(CFG.HIT_BASE+p.levelAccuracy*(a-b)+p.weaponAccuracy*(derive(state).sk-1),.15,.98);}
 return labOriginalHit(a,b);
};
const labPlayerSwing=playerSwing;
playerSwing=function(d,en){if(!labFrame)return labPlayerSwing(d,en);labFrame.playerAccuracy=true;labFrame.attempts++;const before=state.combat.enemyHp;try{return labPlayerSwing(d,en);}finally{labFrame.playerAccuracy=false;const loss=Math.max(0,before-state.combat.enemyHp);labFrame.physicalDamage+=loss;if(loss>0)labFrame.hits++;}};
const labEnemySwing=enemySwing;
enemySwing=function(d,en){const hp=state.hp;labEnemySwing(d,en);if(labFrame)labFrame.received+=Math.max(0,hp-state.hp);};
const labDeath=onDeath;
onDeath=function(en){if(labFrame)labFrame.deaths++;return labDeath(en);};
const labCast=castSpell;
castSpell=function(id){
 if(!labFrame)return labCast(id);
 const oldMp=state.mp,hp=state.hp,enemyHp=state.combat.enemyHp,kills=sumKills(state);labCast(id);
 if(state.mp<oldMp){labFrame.casts++;labFrame.mana+=oldMp-state.mp;labFrame.healing+=Math.max(0,state.hp-hp);if(spellById(id)?.kind==='dmg')labFrame.magicDamage+=sumKills(state)>kills?enemyHp:Math.max(0,enemyHp-state.combat.enemyHp);}
};
const labAppend=appendDevPanel;
appendDevPanel=function(){labAppend();appendBalanceLab();};
function appendBalanceLab(){
 document.getElementById('balanceLabPanel')?.remove();if(gameMode!=='dev'||!ready||!state?.devEnvironment)return;
 const panel=document.createElement('details');panel.className='panel';panel.id='balanceLabPanel';
 panel.innerHTML=`<summary>🔬 Laboratorio 1–20 · actual vs candidato</summary><p class="muted">Ensayos aislados, XP ×1, Humano, nivel 1, habilidades 1, 100 oro. Compara ocho clases y dos perfiles con las mismas semillas. Sin compras automáticas, cambio de NPC ni resurrección. El equipo se concede inicialmente: esto NO mide su adquisición.</p><div class="labFields"><label>Repeticiones por clase/perfil<input id="labRepeats" type="number" min="1" max="30" value="3"></label><label>Máximo de horas por ensayo<input id="labHours" type="number" min="0.1" max="168" value="4" step="0.1"></label><label>Semilla base<input id="labSeed" value="progresion-1"></label><label>NPC fijo<select id="labEnemy">${ENEMIES.filter(e=>e.dungeonId==='newbie'&&e.level<=4).map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join('')}</select></label><label>Equipo concedido<select id="labEquipment"><option value="none">Sin equipo</option><option value="basic">Daga, cuero, madera</option></select></label><label>Política explícita<select id="labPolicy"><option value="idle">Físico idle; sin intervención</option><option value="heal">Curar Leve si HP &lt; 50%</option><option value="active">Curar Leve &lt; 50%; si no, Dardo disponible</option><option value="rest">Descanso legal &lt; 50%; reiniciar tras descanso</option></select></label></div><p class="muted">Políticas activas: comprobar antes de cada segundo; una acción como máximo. Solo Dardo y Curar Leve iniciales, con costes/cooldowns reales. Descanso nunca reinicia tras muerte. Objetivo fijo elegido por vos, no estrategia óptima. El ensayo termina al alcanzar 20, morir, cancelar o agotar el tiempo.</p><h2>Parámetros candidatos (no afectan el juego)</h2><div class="labFields">${[['xp10','XP acumulada nivel 10',3000],['xp20','XP acumulada nivel 20',17000],['physLevel','ATK por nivel',1.2],['weaponScale','Escala Armas por nivel',.01],['magicLevel','Escala magia por personaje',.012],['magicSkill','Escala por Magia',.01],['levelAccuracy','Precisión por diferencia de nivel',.008],['weaponAccuracy','Precisión por Armas',.001]].map(([id,name,v])=>`<label>${name}<input id="lab_${id}" type="number" min="0" step="any" value="${v}"></label>`).join('')}</div><p class="progressHint">Curva experimental solo de personaje: anclas 1=0, 10 y 20 editables, interpolación con exponente 1,15. Armas usa su curva original. HP/MP, defensas, enemigos, recompensas, curaciones y descanso no cambian. Por encima de 20 no se evalúa. Ninguna fórmula está aprobada para normal.</p><div class="actions"><button data-lab="run">Comparar perfiles y ocho clases</button><button data-lab="stop">Cancelar</button><button data-lab="export">Exportar resultados</button><button data-lab="tests">Pruebas aisladas</button></div><div id="labStatus" role="status">Sin ejecutar.</div><pre id="labTests" style="white-space:pre-wrap"></pre><div id="labResults" style="overflow:auto"></div>`;
 document.getElementById('gameScreen').append(panel);renderLabResults();
}
function labConfig(){
 const c={};for(const id of ['xp10','xp20','physLevel','weaponScale','magicLevel','magicSkill','levelAccuracy','weaponAccuracy']){c[id]=Number(document.getElementById('lab_'+id).value);if(!Number.isFinite(c[id])||c[id]<0)throw Error('Parámetro inválido: '+id);}
 if(c.xp10<9||c.xp20<=c.xp10+10||c.xp20>1e9||c.physLevel>10||c.weaponScale>1||c.magicLevel>1||c.magicSkill>1||c.levelAccuracy>1||c.weaponAccuracy>1)throw Error('Parámetros fuera de los límites de laboratorio.');return c;
}
function labFixture(cls,equipment){const previous=draft;try{draft={name:'Laboratorio',race:'humano',cls};const s=normalNewState();s.devEnvironment=true;s.dev={invulnerable:false};if(equipment==='basic')for(const id of ['daga','cuero','madera']){s.owned[id]=true;s.equip[itemById(id).slot]=id;}const d=labOriginalDerive(s);s.hp=d.hpMax;s.mp=d.mpMax;return s;}finally{draft=previous;}}
function newLabFrame(s,config,candidate,seed,policy){return {fixture:s,config,candidate,policy,rngState:seedHash(seed),playerAccuracy:false,seconds:0,combatSeconds:0,restSeconds:0,attempts:0,hits:0,physicalDamage:0,magicDamage:0,received:0,deaths:0,casts:0,mana:0,healing:0,rests:0,restGold:0,lowHpSeconds:0,blockedHealing:0,reached10:null,reached20:null,resumeRest:false,killDurations:[],sinceKill:0};}
function labOneSecond(f){
 const s=state,killsBeforeActions=sumKills(s);
 if(f.resumeRest&&s.restLeft===0&&!f.deaths){beginPhysicalCombat(s);f.resumeRest=false;}
 const d=derive(s),low=s.hp<d.hpMax*.5;
 if(s.combat.active&&low)f.lowHpSeconds++;
 if(s.combat.active){
 if(['active','heal'].includes(f.policy)&&low){if(canCast('curar_leve'))castSpell('curar_leve');else f.blockedHealing++;}
 else if(f.policy==='active'&&canCast('dardo'))castSpell('dardo');
 if(f.policy==='rest'&&low&&s.restCd===0&&s.gold>=restCost(d.L)){const g=s.gold;rest();if(s.restLeft){f.rests++;f.restGold+=g-s.gold;f.resumeRest=true;}}
 }
 const was=s.combat.active&&!navActive(s)&&!s.restLeft,kills=sumKills(s);
 if(was){f.combatSeconds++;f.sinceKill++;}if(s.restLeft)f.restSeconds++;
 step();f.seconds++;
 if(sumKills(s)>killsBeforeActions){f.killDurations.push(f.sinceKill);f.sinceKill=0;}
 const l=derive(s).L;if(l>=10&&f.reached10===null)f.reached10=f.seconds;if(l>=20&&f.reached20===null)f.reached20=f.seconds;
}
function labSynchronous(f,fn){
 const previous={state,rng,off:{...OFF},need:needRender,at:runtimeAt,remainder:runtimeRemainder,frame:labFrame};
 try{labFrame=f;state=f.fixture;rng=()=>seededNext(f);OFF.active=true;return fn();}
 finally{labFrame=previous.frame;state=previous.state;rng=previous.rng;Object.assign(OFF,previous.off);needRender=previous.need;runtimeAt=previous.at;runtimeRemainder=previous.remainder;}
}
async function runBalanceLab(){
 if(gameMode!=='dev'||!state?.devEnvironment||busy||managing||simulationLocked()||labJob)return;
 let config,repeats,hours;try{config=labConfig();repeats=Number(document.getElementById('labRepeats').value);hours=Number(document.getElementById('labHours').value);if(!Number.isInteger(repeats)||repeats<1||repeats>30||!Number.isFinite(hours)||hours<.1||hours>168)throw Error('Repeticiones 1–30; horas 0,1–168.');}catch(e){return toast(e.message);}
 const seed=document.getElementById('labSeed').value||'progresion-1',policy=document.getElementById('labPolicy').value,equipment=document.getElementById('labEquipment').value,enemy=document.getElementById('labEnemy').value;
 syncRuntime();if(busy)return;freezeCharacter(state);runtimeAt=Date.now();runtimeRemainder=0;if(!await saveRoster())return toast('No se inició: guardado DEV fallido.');
 const real=state,job={cancel:false};labJob=job;busy=true;const reports=[];real.dev.labReports=reports;
 try{
 for(const cls of CLASSES)for(const candidate of [false,true])for(let rep=0;rep<repeats;rep++){
 if(job.cancel)break;
 const s=labFixture(cls.id,equipment),en=enemyById(enemy);s.combat.enemyId=en.id;s.combat.enemyHp=en.hp;
 if(!enemyUnlocked(en,1)){reports.push({error:'NPC bloqueado a nivel 1',cls:cls.id});continue;}
 s.combat.active=true;const f=newLabFrame(s,config,candidate,seed+':'+rep,policy),initial=labSynchronous(f,()=>valuesSnapshot(s)),limit=Math.round(hours*3600);
 while(f.seconds<limit&&!job.cancel&&!f.deaths&&f.reached20===null){
 labSynchronous(f,()=>{const start=performance.now();let count=0;while(count++<250&&performance.now()-start<8&&f.seconds<limit&&!f.deaths&&f.reached20===null)labOneSecond(f);});
 const out=document.getElementById('labStatus');if(out)out.textContent=`${cls.name} · ${candidate?'candidato':'actual'} · repetición ${rep+1}/${repeats} · ${durationText(f.seconds)}/${durationText(limit)} · nivel ${labSynchronous(f,()=>derive(s).L)}. Cancelable.`;
 await new Promise(resolve=>setTimeout(resolve,0));
 }
 const final=labSynchronous(f,()=>valuesSnapshot(s));
 reports.push({cls:cls.id,profile:candidate?'candidato':'actual',seed:seed+':'+rep,policy,equipment,enemy,config:{...config},initial,final,seconds:f.seconds,combatSeconds:f.combatSeconds,restSeconds:f.restSeconds,reached10:f.reached10,reached20:f.reached20,kills:sumKills(s),deaths:f.deaths,attempts:f.attempts,hits:f.hits,physicalDamage:f.physicalDamage,magicDamage:f.magicDamage,received:f.received,casts:f.casts,mana:f.mana,healing:f.healing,rests:f.rests,restGold:f.restGold,lowHpSeconds:f.lowHpSeconds,blockedHealing:f.blockedHealing,killDurations:f.killDurations,reason:job.cancel?'Cancelación':f.deaths?'Derrota; sin reinicio':f.reached20!==null?'Nivel 20 alcanzado':'Tiempo agotado',cancelled:job.cancel});
  await saveRoster();renderLabResults();
 }
 }catch(e){toast('Laboratorio detenido: '+e.message);}finally{state=real;labFrame=null;busy=false;labJob=null;runtimeAt=Date.now();runtimeRemainder=0;await saveRoster();const out=document.getElementById('labStatus');if(out)out.textContent=job.cancel?'Cancelado: resultados parciales conservados.':'Ensayos terminados. Las metas no alcanzadas no se extrapolan.';renderLabResults();updateLive();}
}
function renderLabResults(){
 const box=document.getElementById('labResults');if(!box||!state)return;const reports=state.dev?.labReports||[];
 const rate=(n,s)=>s>0?(n*3600/s).toFixed(1):'—';
 const rows=reports.filter(r=>!r.error);
 const groups=new Map();for(const r of rows){const key=r.cls+' / '+r.profile;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
 const spread=a=>{if(!a.length)return 'no alcanzado';a.sort((x,y)=>x-y);const m=a.length%2?a[(a.length-1)/2]:(a[a.length/2-1]+a[a.length/2])/2;return `${durationText(m)} [${durationText(a[0])}–${durationText(a[a.length-1])}]`;};
 box.innerHTML=`<p class="muted">Mediana y rango de tiempos SOLO entre ensayos que alcanzan la meta; se muestra cuántos. Sin extrapolar muertes ni objetivos fallidos. XP/h y oro/h se dividen por tiempo total realmente procesado; una muerte finaliza el ensayo. No equivalen a 24 h de ausencia.</p><table class="labTable"><tr><th>Clase/perfil</th><th>Hasta 10</th><th>Hasta 20</th><th>Muertes/ensayos</th></tr>${Array.from(groups,([key,list])=>`<tr><td>${esc(key)}</td><td>${spread(list.filter(r=>r.reached10!==null).map(r=>r.reached10))} · ${list.filter(r=>r.reached10!==null).length}/${list.length}</td><td>${spread(list.filter(r=>r.reached20!==null).map(r=>r.reached20))} · ${list.filter(r=>r.reached20!==null).length}/${list.length}</td><td>${list.reduce((n,r)=>n+r.deaths,0)}/${list.length}</td></tr>`).join('')}</table>${rows.map(r=>`<details><summary>${esc(classById(r.cls).name)} · ${r.profile} · ${esc(r.seed)} · ${esc(r.reason)}</summary><p>Tiempo ${durationText(r.seconds)} · combate ${durationText(r.combatSeconds)} · descanso ${durationText(r.restSeconds)}<br>Nivel ${r.initial.level} → ${r.final.level} · XP ${fmt(r.final.xp-r.initial.xp)} · oro neto ${fmt(r.final.gold-r.initial.gold)}<br>${rate(r.final.xp-r.initial.xp,r.seconds)} XP/h · ${rate(r.final.gold-r.initial.gold,r.seconds)} oro/h · ${r.kills} bajas · ${r.deaths} muertes<br>Precisión observada ${r.attempts?(100*r.hits/r.attempts).toFixed(1):'—'}% (${r.hits}/${r.attempts}) · daño físico total ${r.physicalDamage} · mágico total ${r.magicDamage}<br>Tiempo combate/baja ${r.kills?(r.combatSeconds/r.kills).toFixed(1):'—'} s (incluye pelea incompleta).<br>Daño recibido ${r.received} · curaciones HP ${fmt(r.healing)} · lanzamientos ${r.casts} · MP ${r.mana} · descansos ${r.rests} (${r.restGold} oro).<br>HP bajo ${r.lowHpSeconds} s · intentos de curación bloqueados ${r.blockedHealing} s.<br>${esc(skillChanges(r,r.final))}</p></details>`).join('')||'<p>Sin resultados ejecutados.</p>'}`;
}
function runBalanceLabTests(){
 if(busy||simulationLocked())return;const out=[];const check=(name,fn)=>{try{if(!fn())throw Error('Resultado inesperado');out.push('✓ '+name);}catch(e){out.push('✗ '+name+': '+e.message);}};
 const c={xp10:3000,xp20:17000,physLevel:1.2,weaponScale:.01,magicLevel:.012,magicSkill:.01,levelAccuracy:.008,weaponAccuracy:.001};
 check('Fuera del laboratorio: curva normal intacta',()=>xpFor(20)===labOriginalXP(20));
 check('Anclas experimentales 1/10/20',()=>labCurve(1,c)===0&&labCurve(10,c)===3000&&labCurve(20,c)===17000);
 check('Umbrales estrictamente crecientes 1–20',()=>Array.from({length:19},(_,i)=>labCurve(i+2,c)>labCurve(i+1,c)).every(Boolean));
 const execute=batch=>{const s=labFixture('guerrero','basic');s.combat.active=true;const f=newLabFrame(s,c,true,'igualdad','active');while(f.seconds<600&&!f.deaths&&f.reached20===null)labSynchronous(f,()=>{for(let i=0;i<batch&&f.seconds<600&&!f.deaths&&f.reached20===null;i++)labOneSecond(f);});return JSON.stringify({s,seconds:f.seconds,rng:f.rngState,damage:f.physicalDamage,magic:f.magicDamage,deaths:f.deaths});};
 check('Mismos pasos y semilla: individual = lotes de 73',()=>execute(1)===execute(73));
 check('Estado real y RNG restaurados después de fixture',()=>{const saved=JSON.stringify(state),old=rng;execute(17);return JSON.stringify(state)===saved&&rng===old&&labFrame===null;});
 check('Armas conserva curva original en perfil candidato',()=>{const s=labFixture('guerrero','none');s.skill.xp=labOriginalXP(10);const f=newLabFrame(s,c,true,'arma','idle');return labSynchronous(f,()=>derive(s).sk===10);});
 check('Hitos previstos no incorporan equipo ni hechizos',()=>!itemById('espada_acero')&&!spellById('golpe_firme')&&PROGRESS_MILESTONES.weapon.some(r=>r[0]===20&&!r[2]));
 check('Normal rechaza JSON marcado DEV',()=>!decodeForMode({kind:DEV_KIND,version:7,activeId:null,characters:[]},'normal'));
 const box=document.getElementById('labTests');if(box)box.textContent=out.join('\n')+'\nSolo ejecutadas al pulsar este botón. No comprueban IndexedDB real, recarga, cancelación de UI ni guardados entre pestañas.';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-lab]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();if(gameMode!=='dev'||!state?.devEnvironment)return;
 const a=b.dataset.lab;if(a==='stop'){if(labJob)labJob.cancel=true;return;}if(busy||managing||simulationLocked())return;
 if(a==='run')return runBalanceLab();if(a==='tests')return runBalanceLabTests();
 if(a==='export'){const text=JSON.stringify({kind:'argentum-dev-lab-results',version:1,createdAt:new Date().toISOString(),reports:state.dev.labReports||[]},null,2),url=URL.createObjectURL(new Blob([text],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='argentum-laboratorio-1-20.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
},true);
