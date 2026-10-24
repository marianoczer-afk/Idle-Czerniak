'use strict';
// Runs inside an isolated browser page against the actual production functions.
module.exports=function(){
 const report={cases:[],idealFailures:[],automatic:[],blocked:[],maxStep:0};
 function run(f,rod,level,width,seed,delay,stationary=false){
  state.skills.pesca.xp=10*(level-1)**2;const range=e190WeightRange(f),capacity=e190Capacity(rod);if(capacity<range[0])return{blocked:true};
  const kg=range[0]+.6*(Math.min(range[1],capacity)-range[0]),zone=e190CaptureWidth(f,rod,level,width,false),g={fish:{...f,zone},weightKg:kg,rodId:rod.id,capture:e232CaptureProfile(f,rod,level,kg),motion:e190MotionProfile(f,rod),controlFraction:zone/width,pos:width*.25,vel:0,target:width*(.12+.15*seed)-12,dir:seed%2?1:-1,seed,time:0,progress:.23};
  const history=[];let held=false,outcome=null;for(let i=0;i<60*65;i++){history.push(g.target);if(i%6===0)held=g.pos+zone/2+g.vel*.14<(history[Math.max(0,history.length-1-Math.round(delay*.06))]??g.target)+12;if(stationary){g.pos=width*.5-zone/2;g.vel=0;}const last=g.target;outcome=e190FishingStep(g,stationary?false:held,1/60,width);report.maxStep=Math.max(report.maxStep,Math.abs(last-g.target)/width);if(outcome)break;}
  return{outcome,seconds:Math.round(g.time*100)/100,kg,zone:Math.round(zone/width*1000)/10};
 }
 const rods=e221Rods(),advanced=rods.find(r=>r.id==='e208_rod_eterno_pulso');
 for(const width of[520,200])for(const f of E16_FISH)for(let seed=1;seed<=4;seed++){
  const r=run(f,advanced,Math.max(f.req,1),width,seed,0);if(r.outcome!=='won')report.idealFailures.push({fish:f.id,width,seed,...r});
 }
 for(const id of['mojarra','pez_arquero','tarpon','ajolote_cuarzo'])for(const rodId of['e161_rod_bamboo','e187_rod_coral','e208_rod_mangle_cauce','e208_rod_eterno_pulso'])for(const width of[520,200])for(const levelType of['entry','100']){
  const f=E16_FISH.find(f=>f.id===id),rod=rods.find(r=>r.id===rodId),level=levelType==='100'?100:f.req;
  for(const delay of[0,150]){let wins=0,time=0,zone=0,blocked=0;for(let seed=1;seed<=4;seed++){const r=run(f,rod,level,width,seed,delay);if(r.blocked){blocked++;continue;}zone=r.zone;if(r.outcome==='won'){wins++;time+=r.seconds;}const parked=run(f,rod,level,width,seed,delay,true);if(parked.outcome==='won')report.automatic.push({id,rodId,width,level,seed});}report.cases.push({fish:id,rod:rodId,width,level,delay,wins,seeds:4,blocked,zone,meanSeconds:wins?Math.round(time/wins*100)/100:null});}
 }
 return report;
};
