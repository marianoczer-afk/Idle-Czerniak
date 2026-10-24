'use strict';
const{test,before,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path'),http=require('http'),{chromium}=require('playwright');const root=path.join(__dirname,'..');let browser,server,url;const errors=[];
before(async()=>{const html=fs.readFileSync(path.join(root,'index.html'));server=http.createServer((q,r)=>r.end(html));await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port;browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});});after(async()=>{await browser.close();await new Promise(r=>server.close(r));assert.deepEqual(errors,[]);});
async function fresh(width=1366){const context=await browser.newContext({viewport:{width,height:900}}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);await p.waitForFunction(()=>storageReady);await p.evaluate(async()=>{draft={name:'Prueba aislada',race:'humano',cls:'guerrero'};await changeRoster('create');state.skills.pesca.xp=98010;state.owned.e187_rod_coral=true;state.ui.fishingRodId='e187_rod_coral';selectWorkspaceTab('fishing');e16Page();});return{p,context};}
for(const width of[1366,390,360])test('World31 fixed reward slot, full cutouts, body highlights and 118px HUD '+width,async()=>{const{p,context}=await fresh(width);try{const rects=await p.evaluate(()=>{const out=[];for(const phase of['pending','claimable','earned']){state.ui.e191Achievements={};state.ui.e18Fishing={bySpecies:phase==='pending'?{}:Object.fromEntries(E165_ZONES[0].fish.map(id=>[id,{total:1}]))};if(phase==='earned')state.ui.e191Achievements.muelle=true;e16Page();const n=document.querySelector('.e229CollectionSeal').getBoundingClientRect();out.push({x:n.x,y:n.y,w:n.width,h:n.height});}return out;});assert.deepEqual(rects[0],rects[1]);assert.deepEqual(rects[0],rects[2]);
 await p.evaluate(()=>{state.ui.e18Fishing={bySpecies:{mojarra:{total:3,best:'legendary'}}};state.ui.lastFishingCatch={id:'mojarra',xp:9,price:3,weightKg:.4,quality:'Grande'};e16Page();e188UpdateHud();document.querySelector('.e181Journal').open=true;});assert.equal((await p.locator('#combatDock').boundingBox()).height,118);assert.equal(await p.locator('.e231RarityBadge').innerText(),'Frecuente');assert.match(await p.locator('#e188HudResult').innerText(),/Grande/);assert.equal(await p.locator('[data-journal-fish=mojarra] .e231ScaleGlints[mask]').count(),1);assert.equal(await p.locator('[data-journal-fish=mojarra] mask').evaluate(n=>getComputedStyle(n).maskType),'alpha');assert.equal(await p.locator('.e1107RodStats .e231Attribute').count(),6);await p.locator('#combatDock .e194DockRod').click();assert.equal(await p.locator('.e216RodThumb .e231Subject').count(),50);await p.keyboard.press('Escape');
 }finally{await context.close();}});
test('World31 smooth sweep: every species catchable; widest and calmest rods never capture statically',async()=>{
 const{p,context}=await fresh();try{
 const result=await p.evaluate(()=>{
  const bad=[],automatic=[],times=[];state.skills.pesca.xp=98010;
  const rods=e221Rods(),tracker=rods.find(r=>r.id==='e192_rod_abyss'),calmest=rods.reduce((a,b)=>e1101Stats(b).resilience>e1101Stats(a).resilience?b:a);
  for(const f of E16_FISH){
   const width=520,widest=rods.reduce((a,b)=>e190CaptureWidth(f,b,100,width,false)>e190CaptureWidth(f,a,100,width,false)?b:a);
   const strategies=[{active:true,rod:tracker},...[widest,calmest].flatMap(rod=>[.15,.3,.5,.7,.85].map(position=>({rod,position})))];
   for(const strategy of strategies)for(let seed=1;seed<=4;seed++){
    const zone=e190CaptureWidth(f,strategy.rod,100,width,false),g={fish:{...f,zone},motion:e190MotionProfile(f,strategy.rod),controlFraction:zone/width,pos:width*.25,vel:0,target:width*(.2+.13*seed),dir:seed%2?1:-1,seed,time:0,progress:.23};
    let outcome,last=g.target;
    for(let i=0;i<60*60;i++){
     const hold=strategy.active?g.pos+zone/2+g.vel*.14<g.target+12:false;
     if(!strategy.active){g.pos=Math.max(0,Math.min(width-zone,width*strategy.position-zone/2));g.vel=0;}
     outcome=e190FishingStep(g,hold,1/60,width,()=>.5);
     if(Math.abs(g.target-last)>width*.5/60+1e-6)throw Error('Teleport '+f.id);last=g.target;if(outcome)break;
    }
    if(strategy.active){if(outcome!=='won')bad.push(f.id);else times.push(g.time);}
    else if(outcome==='won')automatic.push({fish:f.id,rod:strategy.rod.id,position:strategy.position,time:g.time});
   }
  }
  return{bad,automatic,maxSeconds:Math.max(...times),minSeconds:Math.min(...times)};
 });
 assert.deepEqual(result.bad,[]);assert.deepEqual(result.automatic,[]);assert.ok(result.maxSeconds<30);assert.ok(result.minSeconds>3);
 fs.mkdirSync(path.join(root,'arte/verificacion/estable31'),{recursive:true});fs.writeFileSync(path.join(root,'arte/verificacion/estable31/simulacion-especies.json'),JSON.stringify(result,null,2));
 }finally{await context.close();}
});
test('World31 supplemental quests preserve old stars, consume nothing and grant each new reward once',async()=>{const{p,context}=await fresh();try{const before=await p.evaluate(()=>{state.gold=12345;state.ui.fishingMasteryEarned=Object.fromEntries(E165_ZONES.map(z=>[z.id,7]));state.ui.fishingWeights={bySpecies:Object.fromEntries(E16_FISH.map(f=>[f.id,{catches:1000,bestKg:3000}])),byZone:Object.fromEntries(E165_ZONES.map(z=>[z.id,{catches:1000,bestKg:3000,species:Object.fromEntries(z.fish.map(id=>[id,1000]))}]))};return{inventory:JSON.stringify(state.inventory),gold:state.gold};});for(const id of await p.evaluate(()=>E231_QUESTS.map(q=>q.id))){await p.evaluate(id=>{state.ui.fishingZoneId=E231_QUESTS.find(q=>q.id===id).zone;e16Page();const b=document.querySelector('[data-expansion-claim="'+id+'"]');if(!b||b.disabled)throw Error('Unreachable '+id);b.click();const clone=document.createElement('button');clone.dataset.expansionClaim=id;document.body.append(clone);clone.click();clone.remove();},id);}const after=await p.evaluate(async()=>{await persist();return{inventory:JSON.stringify(state.inventory),gold:state.gold,claimed:E231_QUESTS.every(q=>state.ui.fishingQuestRewards[q.id]),rods:E231_QUESTS.filter(q=>q.rodId).every(q=>state.owned[q.rodId]),stars:E165_ZONES.every(z=>e216ZoneProgress(z).complete),unique:new Set(e228Recognitions().map(i=>E227_ART[i.artKind+':'+i.artId].symbol)).size};});assert.equal(after.inventory,before.inventory);assert.equal(after.gold,before.gold);assert.ok(after.claimed&&after.rods&&after.stars);assert.equal(after.unique,78);await p.reload();await p.waitForFunction(()=>storageReady&&ready);assert.equal(await p.evaluate(()=>E231_QUESTS.every(q=>state.ui.fishingQuestRewards[q.id])),true);}finally{await context.close();}});
