'use strict';
const{test,before,after}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.join(__dirname,'..');let server,browser,url;
before(async()=>{const previous=execFileSync('git',['show','85355b4:index.html'],{cwd:root,maxBuffer:32e6}),current=fs.readFileSync(path.join(root,'index.html'));server=http.createServer((q,r)=>{r.setHeader('content-type','text/html;charset=utf-8');r.end(q.url.startsWith('/before')?previous:current);});await new Promise(r=>server.listen(0,'127.0.0.1',r));url='http://127.0.0.1:'+server.address().port;browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});});
after(async()=>{await browser?.close();await new Promise(r=>server?.close(r));});
async function fresh(version,width){const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url+'/'+version);await page.waitForFunction(()=>storageReady);await page.evaluate(async()=>{draft={name:'Equivalence',race:'humano',cls:'clerigo'};await changeRoster('create');state.skills.pesca.xp=98010;for(const rod of e221Rods())state.owned[rod.id]=true;state.ui.fishingRodId='e208_rod_eterno_pulso';selectWorkspaceTab('fishing');e161StopWait();});return{context,page,errors};}
for(const width of[1366,390])test('Unchanged capture controls/HUD preserve baseline structure, state and dimensions '+width,async()=>{
 const old=await fresh('before',width),now=await fresh('after',width);
 try{
  const seed=await old.page.evaluate(()=>copyJSON(state));
  const zones=await old.page.evaluate(()=>E165_ZONES.map(z=>z.id));
  for(const zone of zones)for(const phase of['idle','waiting','bubble','capture','result']){
   const snapshots=[];
   for(const{page}of[old,now])snapshots.push(await page.evaluate(({seed,zone,phase})=>{
    e161StopWait();e195Reset();cancelAnimationFrame(e16Frame);e16Session=null;e161Fishing=false;state=copyJSON(seed);state.ui.fishingZoneId=zone;
    Date.now=()=>1700000000000;let randomSeed=1234;Math.random=()=>((randomSeed=(randomSeed*1664525+1013904223)>>>0)/4294967296);
    e16Result='';e182LastCatch=null;e183LastQuality=null;e1111ResultUntil=0;
    if(phase==='waiting'){e161Fishing=true;e161CatchAt=Date.now()+900;}
    if(phase==='bubble'){e161Fishing=true;e195Pending={id:e165Zone().fish[0],left:2,total:3};}
    if(phase==='capture'){e161Fishing=true;e195OriginalStart(e165Zone().fish[0]);cancelAnimationFrame(e16Frame);if(e16Session)e16Session.progress=.47;}
    if(phase==='result'){const id=e165Zone().fish[0];state.ui.lastFishingCatch={id,xp:17,price:32,quality:'Enorme',weightKg:2,newAbsoluteRecord:true};}
    e16Page();e188UpdateHud();
    // Exercise retained open/filter state and a second render of the same zone.
    const shop=document.getElementById('fishingRodShop');if(shop){shop.open=true;const search=shop.querySelector('[data-rod-search]');search.value='caña';search.dispatchEvent(new Event('input',{bubbles:true}));}
    e16Page();e188UpdateHud();
    const ids=new Map();let serial=0;
    function normalize(text){return text.replace(/e231-(?:responsive|art)-\d+/g,id=>{if(!ids.has(id))ids.set(id,'art-serial-'+(++serial));return ids.get(id);}).replace(/Esperando una picada… \d+ s/g,'Esperando una picada… Ns');}
    function snapshot(node){const copy=node.cloneNode(true);for(const art of copy.querySelectorAll('.e231StageScenery,.e227WaterArt,.e230ShakeWater'))art.remove();for(const item of copy.querySelectorAll('[data-render-key]'))item.removeAttribute('data-render-key');return normalize(copy.outerHTML);}
    return{page:snapshot(document.querySelector('#page_fishing .e162Dock')),hud:snapshot(document.getElementById('combatDock')),state:copyJSON(state),height:document.getElementById('combatDock').getBoundingClientRect().height};
   },{seed,zone,phase}));
   // Persisted values and actual tree/attributes must match, not just text or screenshots.
   for(const field of['state','height','page','hud'])assert.deepEqual(snapshots[1][field],snapshots[0][field],zone+'/'+phase+'/'+field);
  }
  assert.deepEqual(old.errors,[]);assert.deepEqual(now.errors,[]);
 }finally{await old.context.close();await now.context.close();}
});
