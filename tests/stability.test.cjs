const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync,mkdtempSync,writeFileSync,rmSync}=require('node:fs');
const {tmpdir}=require('node:os');
const {createServer}=require('node:http');
const {join}=require('node:path');
const {chromium}=require('playwright');

// Each test owns a fresh browser context. Never connect to a player's profile.
let browser,server,url;
const errors=[];
before(async()=>{
 const html=readFileSync(join(__dirname,'../index.html'));
 server=createServer((req,res)=>{if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}if(req.url==='/arte/muestras.html'||req.url==='/arte/muestra-conceptual-estable23.png'){res.setHeader('Content-Type',req.url.endsWith('.png')?'image/png':'text/html; charset=utf-8');res.end(readFileSync(join(__dirname,'..',req.url)));return;}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 url=`http://127.0.0.1:${server.address().port}`;
 const executablePath=process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
 browser=await chromium.launch({executablePath,headless:true,args:['--no-sandbox']});
});
after(async()=>{await browser?.close();await new Promise(resolve=>server?.close(resolve));assert.deepEqual(errors,[],'No browser runtime errors');});
async function fresh(width=1366){
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>storageReady);
 return {context,page};
}
async function character(page,level=30,openCatalog=true){
 await page.evaluate(async level=>{
  draft={name:'Prueba aislada',race:'humano',cls:'guerrero'};await changeRoster('create');
  state.skills.pesca={xp:10*(level-1)**2};state.gold=100000;
  state.owned.e161_rod_steel=true;state.ui.fishingRodId='e161_rod_steel';state.ui.fishingZoneId='costa';
  selectWorkspaceTab('fishing');e16Page();
 },level);
 if(openCatalog)await page.evaluate(()=>{document.getElementById('fishingRodShop').open=true;document.querySelector('.rodTier[data-tier="inicio"]').open=true;});
}
async function atlasZone(page,id){
 await page.locator('#fishingAtlas').evaluate(n=>n.open=true);
 await page.locator(`[data-atlas-zone="${id}"]`).click();
}
function closeTo(actual,expected,epsilon=1){assert.ok(Math.abs(actual-expected)<=epsilon,`${actual} vs ${expected}`);}

test('HTML boundaries: styles parse and no CSS becomes body text',async()=>{
 const html=readFileSync(join(__dirname,'../index.html'),'utf8');
 assert.equal((html.match(/<style\b/g)||[]).length,(html.match(/<\/style>/g)||[]).length);
 const {context,page}=await fresh();
 try{
  assert.deepEqual(await page.evaluate(()=>[...document.body.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()).map(n=>n.textContent)),[]);
  assert.ok(await page.locator('#e1108-fishing-layout').count());
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Fishing context, mystery, invariant phases, full art (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page);
  // Open the responsive sidebar and check the complete visible text.
  await page.locator('#hybridSidebar').evaluate(n=>n.open=true);
  const sidebar=await page.locator('.hybridSidebarBody').innerText();
  assert.match(sidebar,/Progreso de Pesca/);assert.doesNotMatch(sidebar,/Combate con Armas|Poder mágico|Resistencia Mágica|Maná|Ataque:/);
  await page.evaluate(()=>{e161Fishing=true;e161StopWait();e16Start('atun');});
  await page.waitForSelector('.e196Bubble');
  // Position chosen by test/user; the game itself must never scroll it.
  await page.locator('#e16GamePanel').evaluate(n=>window.scrollTo(0,n.getBoundingClientRect().top+scrollY-100));
  const geometry=()=>page.evaluate(()=>{
   const r=document.getElementById('e16GamePanel').getBoundingClientRect(),toolbar=document.querySelector('.e1108Toolbar').getBoundingClientRect();
   return {top:r.top+scrollY,height:r.height,scroll:scrollY,document:document.documentElement.scrollHeight,toolbar:toolbar.top+scrollY,dock:document.getElementById('combatDock').getBoundingClientRect().height};
  });
  const bubbles=await geometry();
  for(const roll of [0,.999999]){
   const bounds=await page.evaluate(roll=>{
    const random=Math.random;try{Math.random=()=>roll;e195DrawShake();}finally{Math.random=random;}
    const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
    return{bubble:rect('.e196Bubble'),stage:rect('.e196ShakeOverlay'),title:rect('.e196Header'),counter:rect('.e196Counter')};
   },roll);
   assert.ok(bounds.bubble.width>=(width>650?76:70));
   assert.ok(bounds.bubble.left>=bounds.stage.left&&bounds.bubble.right<=bounds.stage.right);
   assert.ok(bounds.bubble.top>=bounds.title.bottom&&bounds.bubble.bottom<=bounds.counter.top,JSON.stringify(bounds));
  }

  const mystery=async()=>{
   assert.equal(await page.locator('#e188FishingHud .e189Art img,#e188FishingHud .e189Art svg.fishIllustration').count(),0);
   assert.doesNotMatch(await page.locator('#e188FishingHud').innerText(),/Atún|atun|Grande|Legendario/);
   assert.equal(await page.locator('#e188FishingHud .fishMysteryArt').count(),0);
   assert.match(await page.locator('#e188HudTitle').innerText(),/Última captura/);
  };
  await mystery();
  while(await page.locator('.e196Bubble').count()){const b=await page.locator('.e196Bubble').boundingBox();await page.mouse.click(b.x+b.width/2,b.y+b.height/2);}
  await page.waitForFunction(()=>!!e16Session);await mystery();
  const capture=await geometry();
  for(const k of Object.keys(bubbles))assert.ok(Math.abs(capture[k]-bubbles[k])<=1,`${k}: ${JSON.stringify({bubbles,capture})}`);
  assert.ok(await page.locator('#e16Hold').isVisible());
  const button=await page.locator('#e16Hold').boundingBox(),stage=await page.locator('#e16GamePanel').boundingBox();
  assert.ok(button.y>=stage.y&&button.y+button.height<=stage.y+stage.height,'Hold control fits inside stage');
  // Exercise the real hold input, then finish a deterministic successful catch.
  await page.locator('#e16Hold').dispatchEvent('pointerdown');assert.equal(await page.evaluate(()=>e16Holding),true);
  await page.locator('#e16Hold').dispatchEvent('pointerup');assert.equal(await page.evaluate(()=>e16Holding),false);
  const result=await page.evaluate(async()=>{
   cancelAnimationFrame(e16Frame);const random=Math.random;Math.random=()=>.9;
   const before={count:e188FishStock('atun'),xp:e16FishSkill().xp};
   try{e16Finish(true);}finally{Math.random=random;}
   e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);
   await persist();
   return {delta:e188FishStock('atun')-before.count,xp:e16FishSkill().xp-before.xp};
  });
  assert.equal(result.delta,1);assert.ok(result.xp>0);
  assert.match(await page.locator('#e188FishingHud').innerText(),/Atún gigante/);
  const art=page.locator('#e188FishingHud .e189Art>svg.fishIllustration');await art.waitFor();
  assert.equal(await art.getAttribute('preserveAspectRatio'),'xMidYMid meet');
  assert.equal(await art.evaluate(n=>getComputedStyle(n).objectFit),'contain');
  const finished=await geometry();for(const k of ['top','height','document','toolbar','dock'])closeTo(finished[k],bubbles[k]);
  await page.evaluate(()=>selectWorkspaceTab('combat'));
  assert.match(await page.locator('.hybridSidebarBody').innerText(),/Combate con Armas/);
  assert.equal(await page.locator('.e197FishingSkills').isVisible(),false);
 }finally{await context.close();}
});

test('Rod shop: compact rows, categories, state, purchase/equip and 100-row catalog',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);await page.locator('#tab_shop').click();await page.locator('#fishingRodShop').evaluate(n=>n.open=true);
  assert.equal(await page.evaluate(()=>state.ui.tab),'shop');
  assert.equal(await page.locator('#fishingRodShop').isVisible(),true);
  assert.equal(await page.locator('#combatDock .e1118Zone').isVisible(),false);
  assert.doesNotMatch(await page.locator('#dockPlayerLevel').innerText(),/Pesca/);
  assert.equal(await page.locator('#fishingRodShop').evaluate(n=>n.closest('.workspacePage').id),'page_shop');
  assert.equal(await page.locator('.rodTier').count(),3);
  const allNames=await page.locator('.rodShopRow').evaluateAll(xs=>xs.map(n=>n.dataset.rodId));assert.equal(new Set(allNames).size,50);
  const rows=await page.locator('.rodTier[data-tier="inicio"] .rodShopRow').evaluateAll(xs=>xs.map(n=>({height:n.getBoundingClientRect().height,width:n.getBoundingClientRect().width,text:n.innerText,fit:getComputedStyle(n.querySelector('img,svg')).objectFit})));
  for(const row of rows){assert.ok(row.height<=130,JSON.stringify(row));assert.ok(row.width>600);assert.match(row.text,/Atracción.*Suerte.*Control.*Resiliencia.*Trofeos/s);assert.match(row.text,/oro|Premio de misión/);assert.equal(row.fit,'contain');}
  await page.locator('.rodTier[data-tier="medio"]').evaluate(n=>n.open=true);
  await page.locator('[data-rod-id="e192_rod_laguna"] button').click();
  assert.equal(await page.evaluate(()=>state.owned.e192_rod_laguna),true);
  assert.equal(await page.evaluate(()=>state.gold),95200);
  assert.equal(await page.evaluate(()=>state.ui.fishingRodId),'e192_rod_laguna');
  assert.equal(await page.locator('.rodTier[data-tier="medio"]').evaluate(n=>n.open),true);
  await page.locator('[data-rod-id="e161_rod_steel"] button').click();assert.equal(await page.evaluate(()=>e161Rod().id),'e161_rod_steel');
  await page.evaluate(()=>{for(let i=E161_RODS.length;i<100;i++){E161_RODS.push({id:'test_rod_'+i,name:'Caña de prueba '+i,price:100,req:i+1,bonus:0,desc:'Solo fixture'});E164_ROD_STATS.push({control:0,wait:0,rare:0});}e16Page();});
  assert.equal(await page.locator('.rodShopRow').count(),65);
  assert.equal(await page.locator('.rodTier').evaluateAll(xs=>xs.reduce((n,x)=>n+x.querySelectorAll('.rodShopRow').length,0)),65);
 }finally{await context.close();}
});

test('Existing v7 saves survive reload, capture variants, quests and level 100',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,100);
  const expected=await page.evaluate(async()=>{
   state.skills.pesca.xp=120000;state.inventory={pez_atun:7,pez_atun__large:5,pez_mojarra__legendary:2,material_rata:3};
   state.owned.e17_rod_viejo=true;state.ui.e187Rewards={laguna:true,abismo:true};state.ui.e191Achievements={muelle:true};
   state.ui.e18Fishing={total:14,large:5,huge:0,legendary:2,riverHuge:true,bySpecies:{atun:{total:12,best:'large'}}};
   state.ui.e193InventoryOrder=['pez_atun__large','pez_atun'];
   await persist();
   return JSON.parse(JSON.stringify({inventory:state.inventory,owned:state.owned,xp:state.skills.pesca.xp,gold:state.gold,rewards:state.ui.e187Rewards,achievements:state.ui.e191Achievements,record:state.ui.e18Fishing,order:state.ui.e193InventoryOrder}));
  });
  await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);
  const actual=await page.evaluate(()=>({inventory:state.inventory,owned:state.owned,xp:state.skills.pesca.xp,gold:state.gold,rewards:state.ui.e187Rewards,achievements:state.ui.e191Achievements,record:state.ui.e18Fishing,order:state.ui.e193InventoryOrder}));
  assert.deepEqual(actual,expected);
  assert.equal(await page.evaluate(()=>e16FishLevel()),100);
  assert.match(await page.locator('#dockPlayerXpText').innerText(),/Nivel máximo/);
  assert.doesNotMatch(await page.locator('.e197FishingSkills').innerText(),/101/);
  assert.equal(await page.locator('#dockPlayerXpBar').evaluate(n=>n.style.width),'100%');
  assert.equal(await page.evaluate(async()=>{const ls=JSON.parse(localStorage.getItem(LS_KEY)),idb=await idbGet();return ls.characters[0].state.skills.pesca.xp===120000&&idb.characters[0].state.skills.pesca.xp===120000}),true);
  // Quality-inclusive quest consumption preserves more expensive fish first.
  assert.equal(await page.evaluate(()=>{const before=copyJSON(state.inventory);const stock=e188FishStock('atun');e188Consume([{id:'atun',qty:8}]);const ok=stock===12&&!state.inventory.pez_atun&&state.inventory.pez_atun__large===4;state.inventory=before;return ok;}),true);
 }finally{await context.close();}
});

test('RNG: exact existing weights, boundaries, seeded frequencies and trophy thresholds',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const report=await page.evaluate(()=>{
   const seed={rngState:12345},random=()=>seededNext(seed),rows=[];
   for(const zone of E165_ZONES)for(const level of [zone.req,Math.max(zone.req,50),100])for(const rod of [E161_RODS[0],E161_RODS.find(r=>r.id==='e192_rod_abyss')]){
    state.skills.pesca.xp=10*(level-1)**2;state.ui.fishingZoneId=zone.id;state.owned[rod.id]=true;state.ui.fishingRodId=rod.id;
    const distribution=e161FishDistribution(),luck=e1101Stats(rod).luck;
    const expected=E16_FISH.filter(f=>zone.fish.includes(f.id)&&level>=f.req&&e190CanLift(f,rod)).map(f=>({id:f.id,weight:(f.rarity?f.rarity*(1+luck/20):Math.max(.12,1/Math.pow(1+(level-f.req)/4,.4)/Math.pow(E161_DIFFICULTY[f.id]||1,2.3)))*(f.id==='atun'?.42:1)}));
    if(JSON.stringify(distribution.map(x=>({id:x.fish.id,weight:x.weight})))!==JSON.stringify(expected))throw Error('Weight changed');
    if(!distribution.length){if(e161RandomFish(random)!==null)throw Error('Empty pool must not fall back to another zone');rows.push(0);continue;}
    let cumulative=0;for(const entry of distribution){const mid=cumulative+entry.probability/2;if(e161RandomFish(()=>mid).id!==entry.fish.id)throw Error('CDF boundary');cumulative+=entry.probability;}
    if(e161RandomFish(()=>0).id!==distribution[0].fish.id||e161RandomFish(()=>1-Number.EPSILON).id!==distribution.at(-1).fish.id)throw Error('Endpoints');
    const n=20000,counts={};for(let i=0;i<n;i++){const id=e161RandomFish(random).id;counts[id]=(counts[id]||0)+1;}
    for(const entry of distribution){const p=entry.probability,sigma=Math.sqrt(n*p*(1-p));if(Math.abs((counts[entry.fish.id]||0)-n*p)>6*sigma+5)throw Error('Frequency '+entry.fish.id);}
    rows.push(distribution.length);
   }
   state.skills.pesca.xp=0;state.ui.fishingRodId='e16_rod';state.owned.e16_rod=true;
   const old=Math.random,thresholds=[];
   try{for(const v of [0,.017999,.018,.114999,.115,.339999,.34,.999999]){Math.random=()=>v;thresholds.push(e186QualityRoll());}}finally{Math.random=old;}
   return {scenarios:rows.length,draws:rows.filter(Boolean).length*20000,emptyScenarios:rows.filter(n=>n===0).length,thresholds};
  });
  assert.equal(report.scenarios,78);assert.equal(report.draws,1520000);assert.equal(report.emptyScenarios,2);
  assert.deepEqual(report.thresholds,[.009,.009,.06,.06,.20,.20,.8,.8]);
 }finally{await context.close();}
});

test('Repository suites: roster, navigation, DEV isolation, progression and balance lab',async()=>{
 const {context,page}=await fresh();
 try{
  const results=await page.evaluate(()=>{
   const checks=[['rosterTestOutput',runRosterTests],['navTestOutput',runNavTests],['devTestOutput',runDevTests],['simTests',runProgressionTests],['labTests',runBalanceLabTests]];
   return checks.map(([id,run])=>{let el=document.getElementById(id);if(!el){el=document.createElement('pre');el.id=id;document.body.append(el);}run();return {id,text:el.textContent};});
  });
  for(const {id,text} of results){assert.match(text,/✓/,id);assert.doesNotMatch(text,/✗/,text);console.log(`${id}: ${(text.match(/✓/g)||[]).length} passed`);}
 }finally{await context.close();}
});

test('Stopping bubbles cancels pending bite and allows the next cast',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  await page.evaluate(()=>{e161Fishing=true;e16Start('atun');});await page.waitForSelector('.e196Bubble');
  await page.locator('.e1108Toolbar [data-e161-toggle]').click();
  assert.equal(await page.evaluate(()=>e195Pending),null);
  assert.equal(await page.evaluate(()=>e161Fishing),false);
  assert.equal(await page.evaluate(()=>e195ShakeTimer),null);
  await page.locator('.e1108Toolbar [data-e161-toggle]').click();
  assert.equal(await page.evaluate(()=>e161Fishing),true);
  await page.waitForFunction(()=>!!e195Pending||!!e16Session);
  assert.equal(await page.locator('#e188FishingHud .e189Art img').count(),0);
 }finally{await context.close();}
});

test('Quality pipeline awards exactly one fish and never reuses the previous trophy',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const actual=await page.evaluate(()=>{
   state.inventory={};state.ui.e18Fishing={total:0,large:0,huge:0,legendary:0,riverHuge:false,bySpecies:{}};
   const random=Math.random,qualities=[];
   try{
    for(const roll of [.20,.90,.05,.90,.005,.90]){
     e161Fishing=true;e195OriginalStart('atun');cancelAnimationFrame(e16Frame);
     Math.random=()=>roll;e16Finish(true);Math.random=random;
     clearTimeout(e1111ResultTimer);e161StopWait();qualities.push(e182LastCatch.quality||'normal');
    }
   }finally{Math.random=random;e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);}
   return {inventory:copyJSON(state.inventory),record:copyJSON(e18Record()),weights:copyJSON(state.ui.fishingWeights.bySpecies.atun),qualities};
  });
  assert.deepEqual(actual.inventory,{pez_atun__large:1,pez_atun:3,pez_atun__huge:1,pez_atun__legendary:1});
  assert.deepEqual(actual.qualities,['Grande','normal','Enorme','normal','Legendario','normal']);
  assert.equal(actual.record.total,6);assert.equal(actual.record.bySpecies.atun.best,'legendary');
  assert.deepEqual(Object.keys(actual.weights.categoryBestKg).sort(),['huge','large','legendary','normal']);assert.equal(actual.weights.bestKg,Math.max(...Object.values(actual.weights.categoryBestKg)));assert.ok(actual.weights.categoryBestKg[actual.weights.bestCategory]===actual.weights.bestKg);
  assert.doesNotMatch(await page.locator('#e188HudResult').innerText(),/Grande|Enorme|Legendario/);
 }finally{await context.close();}
});

for(const width of [1366,1024,390])test(`Collection: images and full text fit each card (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page);
  await page.evaluate(()=>{
   state.ui.fishingZoneId='laguna';
   state.owned.e17_rod_viejo=true;state.owned.e171_rod_rio=true;state.owned.e171_rod_costa=true;
   state.ui.fishingRodId='e171_rod_costa';
   state.ui.e18Fishing={total:223,large:0,huge:0,legendary:0,bySpecies:{trucha_arcoiris:{total:1,best:'normal'},perca_esmeralda:{total:3,best:'normal'},koi_imperial:{total:1,best:'normal'}}};
   e16Page();document.querySelector('.e186Book').open=true;
  });
  await page.waitForFunction(()=>[...document.querySelectorAll('.e186Fish img')].every(n=>n.complete&&n.naturalWidth>0));
  assert.match(await page.locator('.e186Book>summary').innerText(),/3\/5/);
  const cards=await page.locator('.e186Fish').evaluateAll(nodes=>nodes.map(card=>{
   const image=card.querySelector('.e192Sprite'),info=card.lastElementChild,c=card.getBoundingClientRect(),i=image.getBoundingClientRect(),t=info.getBoundingClientRect();
   const range=document.createRange();range.selectNodeContents(info);const text=range.getBoundingClientRect();
   return {overflow:card.scrollWidth-card.clientWidth,imageInside:i.left>=c.left&&i.right<=c.right,textInside:text.left>=c.left&&text.right<=c.right,below:t.top>=i.bottom,fit:getComputedStyle(image.querySelector('img,svg')).objectFit,text:info.innerText};
  }));
  assert.equal(cards.length,5);
  for(const card of cards){assert.ok(card.overflow<=1,JSON.stringify(card));assert.ok(card.imageInside&&card.textInside&&card.below,JSON.stringify(card));assert.equal(card.fit,'contain');}
  assert.match(await page.locator('[data-species-id="trucha_arcoiris"] strong').innerText(),/Trucha arcoíris/);assert.match(await page.locator('[data-species-id="perca_esmeralda"] strong').innerText(),/Perca esmeralda/);assert.equal(await page.locator('.e186Unknown strong').evaluateAll(ns=>ns.every(n=>/Especie desconocida/.test(n.textContent))),true);
  await page.evaluate(()=>e16Page());
  assert.equal(await page.locator('.e186Book').evaluate(n=>n.open),true);
  await page.locator('#tab_shop').click();await page.locator('#fishingRodShop').evaluate(n=>n.open=true);
  assert.equal(await page.locator('#fishingRodShop').isVisible(),true);
  assert.equal(await page.locator('.rodShopRow').count(),50);
  assert.equal(await page.locator('#fishingRodShop').count(),1);
  assert.equal(await page.locator('[data-rod-id="e171_rod_costa"] button').innerText(),'✓ Equipada');
  await page.locator('#tab_fishing').click();
  assert.equal(await page.locator('.e186Book').evaluate(n=>n.open),true);
  await page.locator('#tab_shop').click();
  assert.equal(await page.locator('#fishingRodShop').count(),1);
 }finally{await context.close();}
});

test('Downloaded index.html boots independently and retains the rod shop',async()=>{
 const {context,page}=await fresh();let downloadedContext,directory;
 try{
  await character(page);
  await page.locator('#gameSettings').evaluate(n=>n.open=true);
  const pending=page.waitForEvent('download');await page.locator('#gameSettings [data-act="downloadHtml"]').click();
  const download=await pending;assert.equal(download.suggestedFilename(),'index.html');
  const html=readFileSync(await download.path(),'utf8');
  assert.doesNotMatch(html,/data-rod-shop-open/);
  assert.match(html,/<meta name="argentum-build" content="estable-32">/);
  assert.match(html,/<h1>Argentum Idle Online · Estable 32<\/h1>/);
  downloadedContext=await browser.newContext();const exported=await downloadedContext.newPage();
  exported.on('pageerror',e=>errors.push(e.message));
  directory=mkdtempSync(join(tmpdir(),'argentum-html-'));
  const filePath=join(directory,'index.html');writeFileSync(filePath,html);
  // Managed Chromium blocks file:// navigation. Serve the exact downloaded file
  // locally and reject every other request; no remote assets can help it boot.
  await exported.route('**/*',route=>route.request().url()===url+'/'?route.fulfill({contentType:'text/html',body:readFileSync(filePath)}):route.abort());
  await exported.goto(url);await exported.waitForFunction(()=>storageReady);
  assert.equal(await exported.locator('#characterScreen').isVisible(),true);
  assert.deepEqual(await exported.evaluate(()=>[...document.body.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()).map(n=>n.textContent)),[]);
  await character(exported);
  await exported.locator('#tab_shop').click();await exported.locator('#fishingRodShop').evaluate(n=>n.open=true);
  assert.equal(await exported.locator('#page_shop #fishingRodShop').isVisible(),true);
  assert.equal(await exported.locator('.rodShopRow').count(),50);
  assert.equal(await exported.locator('#argentum-art-library symbol').count(),16);
 }finally{await downloadedContext?.close();await context.close();if(directory)rmSync(directory,{recursive:true,force:true});}
});

for(const width of [1366,390])test(`Estable 23: empty last-catch panel and rods purchasable from Fishing (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,33);
  await page.evaluate(()=>{
   for(const id of ['e17_rod_viejo','e171_rod_rio','e171_rod_costa'])state.owned[id]=true;
   state.ui.fishingRodId='e171_rod_costa';state.ui.fishingZoneId='laguna';e16Page();
  });
  assert.match(await page.locator('header h1').innerText(),/ARGENTUM IDLE ONLINE/);
  assert.equal(await page.locator('#page_fishing #fishingRodShop').isVisible(),true);
  assert.equal(await page.locator('#fishingRodShop').count(),1);
  assert.equal(await page.locator('#fishingRodShop .rodShopRow').count(),50);
  assert.equal(await page.evaluate(()=>!!(document.getElementById('fishingRodShop').compareDocumentPosition(document.querySelector('.e171Quests'))&Node.DOCUMENT_POSITION_PRECEDING)),true);
  const centered=async()=>{
   assert.equal(await page.locator('#e188FishingHud .fishMysteryArt,#e188FishingHud .e189Art img,#e188FishingHud .fishIllustration').count(),0);
   assert.match(await page.locator('#e188HudResult').innerText(),/Todavía no capturaste/);
  };
  await centered();
  const oldGold=await page.evaluate(()=>state.gold);
  await page.locator('[data-rod-id="e161_rod_fiber"] button').click();
  assert.equal(await page.evaluate(()=>state.ui.tab),'fishing');
  assert.equal(await page.evaluate(()=>state.owned.e161_rod_fiber),true);
  assert.equal(await page.evaluate(()=>state.gold),oldGold-700);
  assert.equal(await page.locator('#page_fishing #fishingRodShop').isVisible(),true);
  await page.evaluate(()=>{e161Fishing=true;e16Start('atun');});await page.waitForSelector('.e196Bubble');await centered();
  assert.equal(await page.evaluate(()=>{const before=document.querySelector('.e189Art').innerHTML;e195Reset();e16Start('lubina');return before===document.querySelector('.e189Art').innerHTML;}),true);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: larger rod art, provenance, stars and explicit quest rewards (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,33);
  await page.evaluate(()=>{
   for(const id of ['e17_rod_viejo','e171_rod_rio','e171_rod_costa'])state.owned[id]=true;
   state.ui.fishingRodId='e171_rod_costa';state.ui.fishingZoneId='laguna';state.ui.e187Rewards={laguna:true};e16Page();
  });
  const summaries=await page.locator('#fishingRodShop .rodTier>summary').allTextContents();
  assert.match(summaries[0],/Aprendiz/);assert.match(summaries[1],/Especialista/);assert.match(summaries[2],/Maestría/);
  assert.doesNotMatch(summaries.join(' '),/Niveles|Mid game|Late game/);
  const row=page.locator('[data-rod-id="e171_rod_costa"]');
  assert.equal(await row.getAttribute('data-source'),'quest');assert.match(await row.locator('.rodSource').innerText(),/Misión/);
  assert.match(await page.locator('[data-rod-id="e161_rod_fiber"] .rodSource').innerText(),/Compra/);
  assert.match(await row.locator('.rodShopInfo').innerText(),/Pesca 24.*Encargo completado/);
  const geometry=await row.evaluate(n=>{const art=n.querySelector('.rodShopArt').getBoundingClientRect(),info=n.querySelector('.rodShopInfo').getBoundingClientRect(),r=n.getBoundingClientRect();return{art:art.width,right:art.right,info:info.left,infoTop:info.top,artBottom:art.bottom,overflow:n.scrollWidth-n.clientWidth,height:r.height};});
  if(width>650)assert.ok(geometry.info>geometry.right);else assert.ok(geometry.infoTop>=geometry.artBottom);assert.ok(geometry.overflow<=1);
  if(width>650){assert.ok(geometry.art>=220);assert.ok(geometry.height<=130);}
  const stars=await page.locator('.rodShopStars').evaluateAll(ns=>ns.map(n=>({label:n.getAttribute('aria-label'),count:n.querySelector('[aria-hidden]').textContent.length})));
  assert.equal(stars.length,50);for(const star of stars){assert.match(star.label,/Valoración general: (10|[1-9]) de 10 estrellas/);assert.equal(star.count,10);}
  const scores=await page.evaluate(()=>{const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD];const a=all.map(e193RodScore);state.skills.pesca.xp=98010;const b=all.map(e193RodScore);state.skills.pesca.xp=10240;return{a,b};});
  assert.deepEqual(scores.a,scores.b,'Star ratings belong to rods, not character levels');
  await atlasZone(page,'laguna');await page.locator('[data-atlas-badge="laguna"]').click();
  const reward=page.locator('.atlasBadgeDetail');
  assert.match(await reward.innerText(),/Instinto de pescador.*\+5%.*XP/);
  assert.match(await reward.innerText(),/automáticamente/);
  await page.locator('#hybridSidebar').evaluate(n=>n.open=true);
  assert.match(await page.locator('.e197FishingSkills').innerText(),/Instinto de pescador.*\+5%/);
  assert.equal(await page.evaluate(()=>!!state.owned.e187_rod_coral),false,'XP reward does not invent a rod');
  // Existing rod and control rewards report their actual effect as well.
  for(const [zone,pattern] of [['arrecife',/Caña · Rama Coralina/],['abismo',/8 px.*control permanente/]]){
   await page.evaluate(zone=>{state.skills.pesca.xp=18490;state.ui.fishingZoneId=zone;state.ui.e187Rewards[zone]=true;if(zone==='arrecife')state.owned.e187_rod_coral=true;e16Page();},zone);
   await atlasZone(page,zone);await page.locator(`[data-atlas-badge="${zone}"]`).click();assert.match(await page.locator('.atlasBadgeDetail').innerText(),pattern);
  }
 }finally{await context.close();}
});

test('Weight and control balance: every species defined, capacity limits and proportional bars',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const result=await page.evaluate(()=>{
   const rods=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD];
   for(const f of E16_FISH){const r=e190WeightRange(f);if(!r||r[0]<=0||r[1]<r[0])throw Error('Missing weight '+f.id);}
   let samples=0;
   for(const rod of rods)for(const fish of E16_FISH)for(const roll of [0,.25,.5,.999999]){
    const kg=e190SampleWeight(fish,rod,()=>roll),range=e190WeightRange(fish);
    if(range[0]>e190Capacity(rod)){if(kg!==null)throw Error('Over-capacity fish selected');}
    else if(kg<range[0]||kg>Math.min(range[1],e190Capacity(rod)))throw Error('Invalid weight');
    samples++;
   }
   const fish=E16_FISH.find(f=>f.id==='bagre'),basic=E161_RODS[0],steel=E161_RODS[3];
   const widths=[220,520,900].map(width=>({width,basic:e190CaptureWidth(fish,basic,1,width,false),steel:e190CaptureWidth(fish,steel,1,width,false)}));
   const catalogue=JSON.stringify(E16_FISH);
   const g={fish:{...fish,zone:200},controlFraction:.4,controlExtra:8,pos:100,vel:0,target:120,dir:1,turnAt:100,burstAt:100,burst:0,seed:1,time:0,progress:.5,motion:{distance:1,interval:1}};
   e190FishingStep(g,false,.02,240,()=>.5);
   if(JSON.stringify(E16_FISH)!==catalogue)throw Error('Mutated fish catalogue');
   return {count:E16_FISH.length,samples,widths,resized:g.fish.zone,caps:rods.map(e190Capacity),allReachable:E16_FISH.every(f=>e190CanLift(f,rods.find(r=>r.id==='e192_rod_abyss')))};
  });
  assert.equal(result.count,50);assert.equal(result.samples,18000);assert.equal(result.allReachable,true);
  assert.ok(result.caps.every(n=>n>0));
  for(const row of result.widths){assert.ok(row.steel>row.basic);closeTo(row.steel-row.basic,row.width*.064,.001);}
  closeTo(result.resized,104,.001);
 }finally{await context.close();}
});

test('Resilience calms fish without braking player input, including the bubble start path',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const result=await page.evaluate(()=>{
   const fish=E16_FISH.find(f=>f.id==='lucio'),basic=E161_RODS[0],bamboo=E161_RODS[1];
   const fixture=rod=>({fish:{...fish,zone:80},pos:180,vel:75,target:200,dir:1,turnAt:0,burstAt:0,burst:0,seed:1,time:0,progress:.5,motion:e190MotionProfile(fish,rod)});
   const a=fixture(basic),b=fixture(bamboo);
   e190FishingStep(a,true,.02,520,()=>.5);e190FishingStep(b,true,.02,520,()=>.5);
   return {a,b};
  });
  assert.ok(result.b.target-200<result.a.target-200);assert.ok(result.b.motionPhase<result.a.motionPhase);assert.ok(Math.abs(result.b.targetVelocity)<Math.abs(result.a.targetVelocity));
  assert.equal(result.a.vel,result.b.vel);assert.equal(result.a.pos,result.b.pos);
  await page.evaluate(()=>{state.owned.e161_rod_bamboo=true;state.ui.fishingRodId='e161_rod_bamboo';state.ui.fishingZoneId='rio';e16Page();e161Fishing=true;e16Start('lucio');});
  await page.waitForSelector('.e196Bubble');
  while(await page.locator('.e196Bubble').count())await page.locator('.e196Bubble').click();
  assert.deepEqual(await page.evaluate(()=>e16Session.motion),{distance:1-.28*.5,interval:1+.28*2});
  assert.ok(await page.evaluate(()=>e16Session.weightKg>0&&e16Session.weightKg<=60));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`HUD fish returns to XP and minigame only on deliberate input (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page);
  await page.evaluate(()=>{e161Fishing=true;e16Start('atun');});await page.waitForSelector('.e196Bubble');
  while(await page.locator('.e196Bubble').count())await page.locator('.e196Bubble').click();
  await page.evaluate(()=>{cancelAnimationFrame(e16Frame);window.keptSession=e16Session;window.scrollTo(0,document.documentElement.scrollHeight);});
  await page.locator('#e188FishingHud .e189Art').click();
  assert.equal(await page.evaluate(()=>e16Session===window.keptSession),true);
  const geometry=await page.evaluate(()=>({xp:document.querySelector('#page_fishing .e163Skill').getBoundingClientRect().toJSON(),stage:document.getElementById('e16GamePanel').getBoundingClientRect().toJSON(),tabs:document.querySelector('.workspaceTabs').getBoundingClientRect().toJSON(),dock:document.getElementById('combatDock').getBoundingClientRect().toJSON()}));
  assert.ok(geometry.xp.top>=geometry.tabs.bottom);assert.ok(geometry.stage.bottom<=geometry.dock.top+1);
  await page.evaluate(()=>{window.scrollTo(0,document.documentElement.scrollHeight);e16Holding=false;});
  await page.locator('#e188FishingHud .e189Art').focus();await page.keyboard.press('Space');
  assert.equal(await page.evaluate(()=>e16Holding),false);
  assert.equal(await page.evaluate(()=>e16Session===window.keptSession),true);
  const gained=await page.evaluate(async()=>{const xp=e16FishSkill().xp;const old=Math.random;Math.random=()=>.9;try{e16Finish(true);}finally{Math.random=old;}e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);await persist();return e16FishSkill().xp-xp;});
  assert.ok(gained>0);
  const xp=await page.evaluate(()=>({expected:e16FishProgress().percent,main:Number(document.querySelector('.e163XpTrack').getAttribute('aria-valuenow')),dock:parseFloat(document.getElementById('dockPlayerXpBar').style.width),weight:e182LastCatch.weightKg}));
  closeTo(xp.main,xp.expected,.1);closeTo(xp.dock,xp.expected,.01);assert.ok(xp.weight>0);
  assert.match(await page.locator('#e188HudResult').innerText(),/kg/);
 }finally{await context.close();}
});

test('Weighted records survive reload and the river challenge grants the existing Collector rod once',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const expected=await page.evaluate(async()=>{
   state.ui.fishingZoneId='rio';state.owned.e16_rod=true;state.ui.fishingRodId='e16_rod';
   delete state.ui.fishingWeights;state.ui.e18Fishing={total:0,large:0,huge:0,legendary:0,riverHuge:false,bySpecies:{}};
   const old=Math.random;
   try{for(const id of ['lucio','bagre','trucha','lucio','salmon']){
    Math.random=()=>.8;e161Fishing=true;e195OriginalStart(id);cancelAnimationFrame(e16Frame);
    Math.random=()=>.9;e16Finish(true);e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);
   }}finally{Math.random=old;}
   e16Page();document.querySelector('.e194QuestFold').open=true;document.querySelectorAll('.e216Quest').forEach(n=>n.open=true);await persist();
   return {weights:copyJSON(state.ui.fishingWeights),inventory:copyJSON(state.inventory),xp:state.skills.pesca.xp,gold:state.gold};
  });
  assert.ok(expected.weights.byZone.rio.bestKg>=8);
  assert.equal(await page.evaluate(()=>e190CollectorReady()),true);
  await page.locator('[data-e18-claim]').click();
  assert.equal(await page.evaluate(()=>state.owned.e18_rod_trofeo),true);
  assert.equal(await page.evaluate(()=>state.ui.fishingRodId),'e18_rod_trofeo');
  assert.deepEqual(await page.evaluate(()=>({inventory:state.inventory,xp:state.skills.pesca.xp,gold:state.gold})),{inventory:expected.inventory,xp:expected.xp,gold:expected.gold});
  await page.evaluate(async()=>{const b=document.createElement('button');b.dataset.e18Claim='';document.body.append(b);b.click();b.remove();await persist();});
  await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);
  assert.deepEqual(await page.evaluate(()=>state.ui.fishingWeights),expected.weights);
  assert.equal(await page.evaluate(()=>state.owned.e18_rod_trofeo),true);
  assert.equal(await page.evaluate(()=>{delete state.ui.fishingWeights;state.ui.e18Fishing.riverHuge=true;return e190CollectorReady();}),true,'Legacy river trophy remains valid');
 }finally{await context.close();}
});

test('An under-capacity rod gives a clear zone warning; buying a capable rod restores fishing',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,85);
  await page.evaluate(()=>{state.owned.e16_rod=true;state.ui.fishingRodId='e16_rod';state.ui.fishingZoneId='santuario';e16Page();});
  assert.match(await page.locator('.e1123ZoneBannerText span').innerText(),/0\/1.*Equipá una caña de mayor capacidad/);
  assert.equal(await page.locator('.e1108Toolbar [data-e161-toggle]').isDisabled(),true);
  assert.equal(await page.evaluate(()=>e161RandomFish()),null);
  await page.locator('.rodTier[data-tier="final"]').evaluate(n=>n.open=true);
  await page.locator('[data-rod-id="e192_rod_abyss"] button').click();
  assert.equal(await page.locator('.e1108Toolbar [data-e161-toggle]').isEnabled(),true);
  assert.equal(await page.evaluate(()=>e161RandomFish().id),'carpa_celeste');
 }finally{await context.close();}
});

test('Changing rods from the HUD cancels bubbles without granting a catch or keeping a stale timer',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  await page.evaluate(()=>{state.owned.e16_rod=true;e161Fishing=true;e16Start('atun');});await page.waitForSelector('.e196Bubble');
  const inventory=await page.evaluate(()=>copyJSON(state.inventory));
  await page.locator('#combatDock .e194DockRod').click();
  await page.locator('.e1120Menu[data-type="rod"] .e1120Choice').filter({hasText:'Caña sencilla'}).click();
  assert.equal(await page.evaluate(()=>e195Pending),null);
  assert.equal(await page.evaluate(()=>e195ShakeTimer),null);
  assert.equal(await page.evaluate(()=>e161Fishing),false);
  assert.equal(await page.evaluate(()=>e161Rod().id),'e16_rod');
  assert.deepEqual(await page.evaluate(()=>state.inventory),inventory);
 }finally{await context.close();}
});

test('A new huge river catch does not bypass the multi-objective challenge; old trophies retain credit',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const result=await page.evaluate(()=>{
   state.ui.fishingZoneId='rio';state.ui.e18Fishing={total:0,large:0,huge:0,legendary:0,riverHuge:false,bySpecies:{}};delete state.ui.fishingWeights;
   const old=Math.random;
   try{e161Fishing=true;e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);Math.random=()=>.05;e16Finish(true);}finally{Math.random=old;e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);}
   const fresh={huge:state.ui.e18Fishing.riverHuge,ready:e190CollectorReady(),legacy:state.ui.fishingWeights.legacyRiverTrophy};
   delete state.ui.fishingWeights;state.ui.e18Fishing.riverHuge=true;
   try{e161Fishing=true;e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);Math.random=()=>.9;e16Finish(true);}finally{Math.random=old;e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);}
   return {fresh,legacy:e190CollectorReady()};
  });
  assert.deepEqual(result,{fresh:{huge:true,ready:false,legacy:false},legacy:true});
 }finally{await context.close();}
});

test('Difficulty curve: reef needs active tracking, rods help, mythical fish stay demanding',async()=>{
 const {context,page}=await fresh();
 try{
  const result=await page.evaluate(()=>{
   const rods=[...E161_RODS,...E171_QUESTS.map(q=>q.rod)];
   function simulate(rodId,fishId,width=520,mode='tracking'){
    const rod=rods.find(r=>r.id===rodId),fish=E16_FISH.find(f=>f.id===fishId);let wins=0,total=0;
    for(let i=0;i<40;i++){
     const seed={rngState:seedHash('balance05:'+i)},random=()=>seededNext(seed),zone=e190CaptureWidth(fish,rod,33,width,false);
     const g={fish:{...fish,zone},capture:e232CaptureProfile(fish,rod,Math.max(33,fish.req),e190WeightRange(fish)[0]),weightKg:e190WeightRange(fish)[0],controlFraction:zone/width,controlExtra:0,motion:e190MotionProfile(fish,rod),pos:width/2-zone/2,vel:0,target:width/2-12,dir:1,turnAt:.35,seed:random()*6,time:0,progress:.23,burst:0,burstAt:.5};
     let outcome=null,holding=false,nextInput=0;
     while(g.time<60&&!outcome){
      if(g.time>=nextInput){holding=mode==='hold'||mode==='tracking'&&(g.target+12-(g.pos+g.fish.zone/2)-g.vel*.18)>0;nextInput=g.time+.20;}
      outcome=e190FishingStep(g,holding,1/60,width,random);
     }
     wins+=outcome==='won';total+=g.time;
    }
    return {wins,seconds:total/40};
   }
   return {easy:simulate('e16_rod','mojarra'),basic:simulate('e16_rod','morena'),brumas:simulate('e171_rod_costa','morena'),mythical:simulate('e192_rod_abyss','guardian_mareas'),idle:simulate('e16_rod','morena',520,'idle'),held:simulate('e16_rod','morena',520,'hold'),mobile:simulate('e16_rod','morena',260),desktop:simulate('e16_rod','morena',900)};
  });
  assert.equal(result.easy.wins,40);assert.ok(result.easy.seconds>6);
  assert.ok(result.brumas.wins>=result.basic.wins,JSON.stringify(result));if(result.basic.wins)assert.ok(result.brumas.seconds<result.basic.seconds*.85,JSON.stringify(result));else assert.ok(result.brumas.wins>result.basic.wins,JSON.stringify(result));
  assert.ok(result.brumas.wins>=25,'Brumas must support sustained tracking instead of making reef captures impossible');
  assert.ok(result.mythical.seconds>result.brumas.seconds*1.1,JSON.stringify(result));
  assert.equal(result.idle.wins,0);assert.equal(result.held.wins,0);
  assert.ok(Math.abs(result.mobile.wins-result.desktop.wins)<=12,JSON.stringify(result));
 }finally{await context.close();}
});

test('Attraction reduces preparation touches by stats; larger bubbles show Pique and art fills frames',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);
  const counts=await page.evaluate(()=>{
   const fish=E16_FISH.find(f=>f.id==='morena'),old=state.ui.fishingRodId;
   state.owned.e16_rod=true;state.owned.e171_rod_costa=true;state.owned.e192_rod_abyss=true;
   state.ui.fishingRodId='e16_rod';const basic=e195ShakeCount(fish);
   state.ui.fishingRodId='e171_rod_costa';const brumas=e195ShakeCount(fish);
   state.ui.fishingRodId='e192_rod_abyss';const astral=e195ShakeCount(fish);
   state.ui.fishingRodId=old;return{basic,brumas,astral};
  });
  assert.ok(counts.basic>counts.brumas&&counts.brumas>counts.astral);
  await page.evaluate(()=>{e161Fishing=true;e16Start('atun');});
  await page.waitForSelector('.e196Bubble');
  assert.match(await page.locator('.e196Bubble').innerText(),/¡Pique!\s+TOCÁ/);
  assert.equal(await page.locator('.e196Bubble').evaluate(n=>getComputedStyle(n).width),'76px');
  assert.equal(await page.locator('.rodShopArt svg').first().evaluate(n=>getComputedStyle(n).objectFit),'contain');
  await page.locator('.rodTier').first().evaluate(n=>n.open=true);
  assert.ok(await page.locator('.rodShopArt').first().evaluate(n=>n.getBoundingClientRect().width)>=300);
 }finally{await context.close();}
});

test('90 permanent rods: stable IDs, explicit tradeoffs, 60 gold additions and 18 achievable challenges',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page);
  const report=await page.evaluate(()=>{
   const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD],ids=all.map(r=>r.id);
   if(ids.length!==new Set(ids).size)throw Error('Duplicate ID');
   for(const rod of E208_CATALOG){
    const st=e1101Stats(rod);for(const key of ['control','speed','luck','resilience','trophy','maxKg'])if(!Number.isFinite(st[key])||st[key]<0)throw Error('Invalid '+rod.id+' '+key);
    if(rod.unlock){const q=rod.unlock,z=E165_ZONES.find(z=>z.id===q.zone);if(q.species>z.fish.length||q.bestKg>Math.max(...z.fish.map(id=>e190WeightRange(E16_FISH.find(f=>f.id===id))[1])))throw Error('Unreachable challenge');}
    else if(rod.price<=0)throw Error('Free gold rod');
   }
   for(const family of E208_FAMILIES){
    const rods=E208_CATALOG.filter(r=>r.family===family.id),stats=id=>e1101Stats(rods.find(r=>r.specialty===id));
    if(!(stats('pulso').control>stats('destello').control&&stats('cauce').resilience>stats('destello').resilience&&stats('destello').speed>stats('fortuna').speed&&stats('fortuna').luck>stats('titan').luck&&stats('titan').maxKg>stats('fortuna').maxKg&&E1103_SPECIAL[rods.find(r=>r.specialty==='reliquia').id].trophy>E1103_SPECIAL[rods[0].id].trophy))throw Error('Missing tradeoff '+family.id);
   }
   const keys=['control','speed','luck','resilience','trophy','maxKg'];
   for(const level of [1,33,100]){
    const oldXP=state.skills.pesca.xp;state.skills.pesca.xp=10*(level-1)**2;
    for(const rod of E208_CATALOG.filter(r=>!r.unlock)){
     const a=e1101Stats(rod),dominators=E161_RODS.filter(other=>{if(other.id===rod.id||other.unlock||other.price>rod.price)return false;const b=e1101Stats(other);return keys.every(k=>b[k]>=a[k])&&keys.some(k=>b[k]>a[k]);});
     if(dominators.length)throw Error('No reason to buy '+rod.id+' vs '+dominators[0].id+' at '+level);
    }
    state.skills.pesca.xp=oldXP;
   }
   return{total:all.length,additions:E208_CATALOG.length,gold:E208_CATALOG.filter(r=>!r.unlock).length,quests:E208_CATALOG.filter(r=>r.unlock).length};
  });
  assert.deepEqual(report,{total:90,additions:78,gold:60,quests:18});
 }finally{await context.close();}
});

test('New gold rods have no level gate; challenge rewards cannot be bought or claimed twice and survive reload',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,1);await page.evaluate(()=>{state.gold=1000000;e16Page();selectWorkspaceTab('shop');});
  await page.locator('.rodTier[data-tier="final"]').evaluate(n=>n.open=true);
  const buy=page.locator('[data-rod-id="e208_rod_celeste_pulso"] .rodShopAction button');assert.equal(await buy.isEnabled(),true);
  const beforeGold=await page.evaluate(()=>state.gold);await buy.click();
  assert.equal(await page.evaluate(()=>e161Rod().id),'e208_rod_celeste_pulso');
  assert.equal(await page.evaluate(()=>state.gold),beforeGold-420000);
  const rodId='e208_rod_custodio_pulso';
  assert.equal(await page.locator(`[data-rod-id="${rodId}"] button`).innerText(),'Ver encargo');
  assert.equal(await page.evaluate(()=>{
   const index=E161_RODS.findIndex(r=>r.id==='e208_rod_custodio_pulso'),button=document.createElement('button');button.dataset.e161Buy=index;document.body.append(button);button.click();button.remove();return !!state.owned.e208_rod_custodio_pulso;
  }),false);
  const expected=await page.evaluate(()=>{
   const rod=E208_CATALOG.find(r=>r.id==='e208_rod_custodio_pulso'),q=rod.unlock;state.skills.pesca.xp=10*17**2;
   state.ui.fishingWeights={bySpecies:{},byZone:{[q.zone]:{catches:q.catches,bestKg:q.bestKg,species:{bagre:5,trucha:7}}}};
   e16Page();return{gold:state.gold,xp:state.skills.pesca.xp,inventory:JSON.stringify(state.inventory)};
  });
  await page.locator(`[data-rod-id="${rodId}"] button`).click();
  assert.equal(await page.evaluate(()=>e161Rod().id),rodId);
  assert.deepEqual(await page.evaluate(()=>({gold:state.gold,xp:state.skills.pesca.xp,inventory:JSON.stringify(state.inventory)})),expected);
  assert.equal(await page.evaluate(()=>{const button=document.createElement('button');button.dataset.catalogClaim='e208_rod_custodio_pulso';document.body.append(button);button.click();button.remove();return Object.keys(state.owned).filter(id=>id==='e208_rod_custodio_pulso').length;}),1);
  await page.evaluate(()=>persist());await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);
  assert.equal(await page.evaluate(()=>e161Rod().id),rodId);
  assert.equal(await page.evaluate(()=>!!state.owned.e208_rod_celeste_pulso),true);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Catalog search, mission filters and full rod viewports (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40);await page.evaluate(()=>selectWorkspaceTab('shop'));
  await page.locator('[data-rod-search]').fill('boveda celestial');
  assert.equal(await page.locator('.rodShopRow:visible').count(),2);
  await page.locator('[data-rod-search]').fill('');await page.locator('[data-rod-filter]').selectOption('quest');
  assert.equal(await page.locator('.rodShopRow:visible').count(),23);
  await page.locator('[data-rod-filter]').selectOption('gold');assert.equal(await page.locator('.rodShopRow:visible').count(),27);
  await page.locator('[data-rod-filter]').selectOption('owned');assert.equal(await page.locator('.rodShopRow:visible').count(),1);
  await page.evaluate(()=>e16Page());assert.equal(await page.locator('[data-rod-filter]').inputValue(),'owned');
  const geometry=await page.locator('.rodShopRow:visible .rodIllustration').evaluate(svg=>{
   const u=svg.querySelector('use'),symbol=document.querySelector(u.getAttribute('href')),frame=svg.getBoundingClientRect();
   return{mode:svg.getAttribute('preserveAspectRatio'),ref:!!symbol,image:!!document.querySelector('#argentum-rod-master'),width:frame.width,height:frame.height,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.equal(geometry.mode,'xMidYMid meet');assert.equal(geometry.ref,true);assert.equal(geometry.image,true);assert.ok(geometry.width>250&&geometry.height>=75);assert.ok(geometry.overflow<=1);
 }finally{await context.close();}
});

test('Epic fish artwork reveals only after capture; every atlas is embedded and portable',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,100);
  await page.evaluate(()=>{state.owned.e192_rod_abyss=true;state.ui.fishingRodId='e192_rod_abyss';state.ui.fishingZoneId='abismo';e16Page();e161Fishing=true;e195OriginalStart('leviatan');cancelAnimationFrame(e16Frame);});
  assert.equal(await page.locator('#e188FishingHud .fishIllustration').count(),0);
  assert.equal(await page.locator('#e188FishingHud .fishMysteryArt').count(),0);
  await page.evaluate(()=>{e16Finish(true);e161Fishing=false;e161StopWait();clearTimeout(e1111ResultTimer);});
  assert.equal(await page.locator('#e188FishingHud .fishIllustration').count(),1);
  assert.match(await page.locator('#e188FishingHud .fishIllustration').getAttribute('aria-label'),/Leviatán/i);
  const assets=await page.evaluate(()=>({rods:document.querySelectorAll('#argentum-art-library symbol[id^="argentum-rod-"]').length,fish:document.querySelectorAll('#argentum-art-library symbol[id^="argentum-fish-"]').length,embedded:[...document.querySelectorAll('#argentum-art-library image')].every(n=>n.getAttribute('href').match(/^data:image\/(?:png|webp);base64,/)!==null)}));
  assert.deepEqual(assets,{rods:10,fish:6,embedded:true});
 }finally{await context.close();}
});

test('Completed ledger includes all 25 quests, permanent perks and new rod challenges without granting rewards',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,100);
  const before=await page.evaluate(()=>{
   for(const rod of [E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD,...E208_CATALOG.filter(r=>r.unlock)])state.owned[rod.id]=true;
   state.ui.e187Rewards={laguna:true,arrecife:true,abismo:true};state.ui.fishingZoneId='laguna';
   const snapshot=()=>({owned:JSON.stringify(state.owned),inventory:JSON.stringify(state.inventory),gold:state.gold,xp:state.skills.pesca.xp,rewards:JSON.stringify(state.ui.e187Rewards)});
   const before=snapshot();e16Page();return before;
  });
  assert.equal(await page.locator('#fishingAtlas').count(),1);
  assert.match(await page.locator('#fishingAtlas>summary').innerText(),/25\/52 encargos/);
  assert.equal(await page.locator('.e171QuestGroup').count(),0);assert.equal(await page.locator('.e194QuestFold').count(),1);assert.equal(await page.locator('.e229Completed').count(),1);
  let badges=0;
  for(const zone of await page.evaluate(()=>E165_ZONES.map(z=>z.id))){
   await atlasZone(page,zone);badges+=await page.locator('[data-atlas-badge]').count();
  }
  assert.equal(badges,25);
  for(const [zone,pattern] of [['laguna',/naturalista.*5%.*permanente activa/is],['arrecife',/secreto del arrecife.*Rama Coralina/is],['abismo',/8 px.*permanente activa/is]]){
   await atlasZone(page,zone);await page.locator(`[data-atlas-badge="${zone}"]`).click();assert.match(await page.locator('.atlasBadgeDetail').innerText(),pattern);
  }
  for(const zone of ['muelle','arrecife','abismo','santuario']){
   await page.evaluate(zone=>{state.ui.fishingZoneId=zone;e16Page();},zone);
   assert.equal(await page.evaluate(()=>e216QuestDefinitions().filter(q=>q.done).length),25);
   assert.equal(await page.locator('#fishingAtlas').evaluate(n=>n.open),true);
  }
  assert.deepEqual(await page.evaluate(()=>({owned:JSON.stringify(state.owned),inventory:JSON.stringify(state.inventory),gold:state.gold,xp:state.skills.pesca.xp,rewards:JSON.stringify(state.ui.e187Rewards)})),before);
 }finally{await context.close();}
});

test('Claiming Coralina moves the quest to Completed exactly once and retains the rod after reload',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);
  await page.evaluate(()=>{state.ui.fishingZoneId='arrecife';state.inventory.pez_pez_luna=4;state.inventory.pez_caballito_mar=3;e16Page();document.querySelector('.e194QuestFold').open=true;document.querySelectorAll('.e216Quest').forEach(n=>n.open=true);});
  await page.locator('[data-e187-claim="arrecife"]').click();
  assert.equal(await page.locator('[data-e187-claim="arrecife"]').count(),0);
  await atlasZone(page,'arrecife');assert.equal(await page.locator('[data-atlas-badge="arrecife"]').count(),1);
  const snapshot=await page.evaluate(()=>({gold:state.gold,xp:state.skills.pesca.xp,inventory:JSON.stringify(state.inventory),owned:JSON.stringify(state.owned),rewards:JSON.stringify(state.ui.e187Rewards)}));
  assert.equal(await page.evaluate(()=>state.owned[E187_ROD.id]&&e187Rewards().arrecife),true);
  assert.equal(await page.evaluate(()=>e161Rod().id),'e187_rod_coral');
  await page.evaluate(async()=>{const b=document.createElement('button');b.dataset.e187Claim='arrecife';document.body.append(b);b.click();b.remove();await persist();});
  assert.deepEqual(await page.evaluate(()=>({gold:state.gold,xp:state.skills.pesca.xp,inventory:JSON.stringify(state.inventory),owned:JSON.stringify(state.owned),rewards:JSON.stringify(state.ui.e187Rewards)})),snapshot);
  await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);await page.evaluate(()=>selectWorkspaceTab('fishing'));
  await atlasZone(page,'arrecife');assert.equal(await page.locator('[data-atlas-badge="arrecife"]').count(),1);
  assert.equal(await page.evaluate(()=>!!state.owned.e187_rod_coral),true);
 }finally{await context.close();}
});

test('Legacy Coralina ownership is recognized without inventing perk flags or consuming another delivery',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);
  const expected=await page.evaluate(()=>{state.owned.e187_rod_coral=true;state.ui.e187Rewards={};state.ui.fishingZoneId='arrecife';state.inventory.pez_pez_luna=4;state.inventory.pez_caballito_mar=3;e16Page();return JSON.stringify(state.inventory);});
  await atlasZone(page,'arrecife');assert.equal(await page.locator('[data-atlas-badge="arrecife"]').count(),1);
  assert.equal(await page.locator('[data-e187-claim="arrecife"]').count(),0);
  await page.evaluate(()=>{const b=document.createElement('button');b.dataset.e187Claim='arrecife';document.body.append(b);b.click();b.remove();});
  assert.equal(await page.evaluate(()=>JSON.stringify(state.inventory)),expected);
  assert.deepEqual(await page.evaluate(()=>state.ui.e187Rewards),{});
  assert.deepEqual(await page.evaluate(()=>e209CompletedQuests().map(q=>q.id)),['arrecife']);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: collapsed catalog follows missions, requirements are visible and capture control is large (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);
  assert.equal(await page.locator('#fishingRodShop').evaluate(n=>n.open),false);
  assert.equal(await page.locator('.rodTier[open]').count(),0);
  assert.equal(await page.evaluate(()=>!!(document.querySelector('.e171Quests').compareDocumentPosition(document.getElementById('fishingRodShop'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.locator('.rodTier[data-tier="medio"]').evaluate(n=>n.open=true);
  const requirement=await page.locator('[data-rod-id="e187_rod_coral"] .rodShopInfo small').innerText();
  assert.match(requirement,/Arrecife de Coral.*Pesca 32.*Pez luna 0\/4.*Caballito de mar 0\/3/);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';e16Page();document.querySelector('.e194QuestFold').open=true;document.querySelectorAll('.e216Quest').forEach(n=>n.open=true);});
  assert.equal(await page.locator('.e194QuestBody [data-catalog-claim]').count(),6);
  const quest=page.locator('.e194QuestBody [data-quest-id="e208_rod_custodio_pulso"]');
  assert.match(await quest.innerText(),/Conseguí 12 capturas.*0\/12.*Descubrí 2 especies.*0\/2.*Capturá un pez/is);
  await page.evaluate(()=>{state.ui.fishingZoneId='costa';e16Page();e161Fishing=true;e195OriginalStart('atun');cancelAnimationFrame(e16Frame);});
  const geometry=await page.locator('#e16Hold').evaluate(n=>{const b=n.getBoundingClientRect(),p=document.getElementById('e16GamePanel').getBoundingClientRect();return{width:b.width,height:b.height,stageWidth:p.width,bottom:b.bottom,stageBottom:p.bottom};});
  assert.ok(geometry.width>=geometry.stageWidth*.90,JSON.stringify(geometry));assert.ok(geometry.height>=72);assert.ok(geometry.bottom<=geometry.stageBottom);
  assert.doesNotMatch(await page.locator('#e16GamePanel').innerText(),/Mouse|táctil|espacio/);
 }finally{await context.close();}
});

test('Estable 23: new challenge is claimable in its zone; owned rods lead both the catalog and HUD selector',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.locator('.rodTier[data-tier="inicio"]').evaluate(n=>n.open=true);
  await page.locator('[data-rod-id="e208_rod_custodio_pulso"] button').click();
  assert.equal(await page.evaluate(()=>e165Zone().id),'rio');assert.equal(await page.locator('.e194QuestFold').evaluate(n=>n.open),true);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';state.ui.fishingWeights={byZone:{rio:{catches:12,bestKg:2,species:{bagre:6,trucha:6}}}};e16Page();document.querySelector('.e194QuestFold').open=true;document.querySelectorAll('.e216Quest').forEach(n=>n.open=true);});
  await page.locator('.e194QuestBody [data-catalog-claim="e208_rod_custodio_pulso"]').click();
  assert.equal(await page.evaluate(()=>!!state.owned.e208_rod_custodio_pulso),true);
  assert.equal(await page.locator('.e194QuestBody [data-catalog-claim="e208_rod_custodio_pulso"]').count(),0);
  await atlasZone(page,'rio');assert.equal(await page.locator('[data-atlas-badge="e208_rod_custodio_pulso"]').count(),1);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);
  assert.equal(await page.locator('[data-rod-sort]').inputValue(),'price');assert.equal(await page.locator('[data-rod-sort] option[value="owned"]').count(),0);
  await page.locator('[data-rod-mine]').click();assert.equal(await page.locator('.rodShopRow:visible').count(),2);
  await page.locator('[data-rod-filter]').selectOption('affordable');
  assert.equal(await page.locator('.rodShopRow:visible').evaluateAll(ns=>ns.every(n=>n.dataset.source==='gold'&&Number(n.dataset.price)<=100000)),true);
  await page.locator('[data-rod-filter]').selectOption('all');await page.locator('[data-rod-zone]').selectOption('arrecife');await page.locator('[data-rod-sort]').selectOption('resilience');
  assert.equal(await page.locator('.rodShopRow:visible').evaluateAll(ns=>ns.every(n=>n.dataset.zone==='arrecife')),true);
  const values=await page.locator('.rodTier[data-tier="medio"] .rodShopRow:not([hidden])').evaluateAll(ns=>ns.map(n=>Number(n.dataset.resilience)));assert.deepEqual(values,[...values].sort((a,b)=>b-a));
  await page.locator('#combatDock .e194DockRod').click();
  const choices=await page.locator('.e1120Menu[data-type="rod"] .e1120Choice').evaluateAll(ns=>ns.map(n=>n.disabled));
  assert.equal(choices[0],false);assert.equal(choices[1],false);assert.equal(choices.slice(2).every(Boolean),true);
 }finally{await context.close();}
});

test('Estable 23: sidebar scrolls independently and switching character stays accessible',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  const side=page.locator('#hybridSidebar');await side.evaluate(n=>{n.open=true;n.querySelectorAll('details').forEach(d=>d.open=true);n.scrollTop=0;});
  const box=await side.boundingBox(),before=await page.evaluate(()=>scrollY);
  await page.mouse.move(box.x+box.width/2,box.y+150);await page.mouse.wheel(0,800);
  if(await side.evaluate(n=>n.scrollHeight>n.clientHeight))await page.waitForFunction(()=>document.getElementById('hybridSidebar').scrollTop>0);
  assert.equal(await page.evaluate(()=>scrollY),before);
  await page.locator('#gameSettings').evaluate(n=>n.open=true);const quick=page.locator('#gameSettings [data-act="switchCharacter"]');
  assert.equal(await quick.isVisible(),true);
  const button=await quick.boundingBox();assert.ok(button.y>=0&&button.y<782);
  await page.evaluate(()=>{e161Fishing=true;e195OriginalStart('atun');});
  await quick.click();await page.waitForFunction(()=>!roster.activeId&&!busy&&document.getElementById('characterScreen')&&!document.getElementById('characterScreen').classList.contains('hidden'));
  assert.equal(await page.locator('#characterScreen').isVisible(),true);
  assert.equal(await page.evaluate(()=>roster.characters.length),1);
  assert.deepEqual(await page.evaluate(()=>({session:!!e16Session,pending:!!e195Pending,fishing:e161Fishing})),{session:false,pending:false,fishing:false});
 }finally{await context.close();}
});

test('Estable 23: finish renders and saves once; escape never awards a fish',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  const report=await page.evaluate(()=>{
   state.ui.fishingZoneId='arrecife';state.owned.e187_rod_coral=true;state.ui.fishingRodId='e187_rod_coral';e16Page();
   e161Fishing=true;e195OriginalStart('morena');cancelAnimationFrame(e16Frame);
   const originalPage=e16Page,originalSave=saveRoster;let renders=0,writes=0;
   e16Page=function(){const before=document.getElementById('e16GamePanel'),result=originalPage();if(before!==document.getElementById('e16GamePanel'))renders++;return result;};
   saveRoster=function(){writes++;return originalSave();};
   try{
    e16Finish(true);e161StopWait();const win={renders,writes,xp:e182LastCatch.xp};
    const snapshot=()=>JSON.stringify({inventory:state.inventory,xp:state.skills.pesca.xp,gold:state.gold,records:state.ui.e18Fishing,weights:state.ui.fishingWeights});
    const beforeLoss=snapshot();e16Start('morena');e161StopWait();
    const bubbles={pending:!!e195Pending,percent:document.getElementById('e188HudPercent').textContent,fill:document.getElementById('e188HudFill').style.width,art:document.querySelectorAll('#e188FishingHud .e189Art img,#e188FishingHud .fishIllustration').length};
    e195Reset();e195OriginalStart('morena');cancelAnimationFrame(e16Frame);renders=0;writes=0;e16Finish(false);e161StopWait();
    const loss={renders,writes,unchanged:snapshot()===beforeLoss,last:e182LastCatch,title:document.getElementById('e188HudTitle').textContent,percent:document.getElementById('e188HudPercent').textContent,fill:document.getElementById('e188HudFill').style.width,art:document.querySelectorAll('#e188FishingHud .e189Art img,#e188FishingHud .fishIllustration').length};
    e16Finish(true);return{win,bubbles,loss,duplicateUnchanged:snapshot()===beforeLoss,depth:fishingFinishDepth};
   }finally{e16Page=originalPage;saveRoster=originalSave;e210StopFishing();}
  });
  assert.equal(report.win.renders,1);assert.equal(report.win.writes,1);assert.ok(report.win.xp>0);
  assert.equal(report.bubbles.pending,true);assert.match(report.bubbles.percent,/XP.*oro al vender/);assert.equal(report.bubbles.art,1);
  assert.equal(report.loss.renders,1);assert.equal(report.loss.writes,1);assert.equal(report.loss.unchanged,true);assert.equal(report.loss.last,null);assert.equal(report.loss.title,'Última captura');assert.match(report.loss.percent,/XP.*oro al vender/);assert.equal(report.loss.art,1);assert.equal(report.duplicateUnchanged,true);assert.equal(report.depth,0);
 }finally{await context.close();}
});

test('Estable 23: last catch stays through attempts, loss, time and reload without duplicating rewards',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  const report=await page.evaluate(async()=>{
   e161Fishing=true;e195OriginalStart('atun');cancelAnimationFrame(e16Frame);e16Finish(true);
   const delay=e161CatchAt-Date.now(),last=JSON.parse(JSON.stringify(state.ui.lastFishingCatch)),expected={xp:e182LastCatch.xp,price:e182LastCatch.price},paused=!!e1111ResultTimer;
   e161StopWait();e195OriginalStart('lubina');cancelAnimationFrame(e16Frame);e16Paint();
   const active=document.getElementById('e188HudResult').textContent;const clock=Date.now;
   try{const later=clock()+60000;Date.now=()=>later;e188UpdateHud();}finally{Date.now=clock;}
   const oldXP=state.skills.pesca.xp,inventory=JSON.stringify(state.inventory);e16Finish(false);e161StopWait();e161Fishing=false;
   const loss=document.getElementById('e188HudResult').textContent,unchanged=state.skills.pesca.xp===oldXP&&inventory===JSON.stringify(state.inventory);
   await persist();return{delay,last,expected,paused,active,loss,unchanged};
  });
  assert.ok(report.delay>=300&&report.delay<=950,JSON.stringify(report));assert.equal(report.paused,false);
  assert.equal(report.last.id,'atun');assert.equal(report.last.xp,report.expected.xp);assert.equal(report.last.price,report.expected.price);
  assert.match(report.active,/Atún gigante/);assert.equal(report.loss,report.active);assert.equal(report.unchanged,true);
  await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);await page.evaluate(()=>{selectWorkspaceTab('fishing');e188UpdateHud();});
  assert.deepEqual(await page.evaluate(()=>state.ui.lastFishingCatch),report.last);
  assert.match(await page.locator('#e188HudResult').innerText(),/Atún gigante/);
  // A trophy can cross 1,000 gold; grouping separators do not change the awarded value.
  assert.match((await page.locator('#e188HudPercent').innerText()).replace(/\./g,''),new RegExp('\\+'+report.last.xp+' XP.*'+report.last.price+' oro al vender'));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: sidebar headings hidden and compact HUD preserves XP view and uncropped rod (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);await page.locator('#hybridSidebar').evaluate(n=>n.open=true);
  assert.equal(await page.locator('.hybridSidebarBody details[data-ui-panel="skills"]>summary').isVisible(),false);
  assert.equal(await page.locator('.hybridSidebarBody details[data-ui-panel="equipment"]>summary').isVisible(),false);
  assert.equal(await page.locator('.e197FishingSkills').isVisible(),true);assert.equal(await page.locator('.e1107RodStats').isVisible(),true);
  assert.equal(await page.locator('#hybridSidebar').evaluate(n=>getComputedStyle(n).scrollbarWidth),'none');
  const frame=await page.locator('#combatDock .e194DockRod').evaluate(panel=>{
   const art=panel.querySelector('.e194DockRodArt'),svg=art.querySelector('svg'),name=panel.querySelector('.e1123RodName'),p=panel.getBoundingClientRect(),a=art.getBoundingClientRect(),s=svg.getBoundingClientRect(),n=name.getBoundingClientRect(),v=svg.viewBox.baseVal;
   return{parent:p.width,art:a.width,svg:s.width,mode:svg.getAttribute('preserveAspectRatio'),dock:document.getElementById('combatDock').getBoundingClientRect().height,nameBottom:n.bottom,artTop:a.top,background:getComputedStyle(name).backgroundImage};
  });
  assert.ok(frame.art>=frame.parent-3,JSON.stringify(frame));closeTo(frame.svg,frame.art,.5);assert.equal(frame.mode,'xMidYMid meet');assert.ok(frame.dock<=120,JSON.stringify(frame));assert.ok(frame.nameBottom>frame.artTop+1);assert.match(frame.background,/linear-gradient/);
  assert.equal(await page.locator('#combatDock .e1118Zone').isVisible(),true);
  await page.locator('#combatDock .e1118Zone').click();assert.equal(await page.locator('.e1120Menu[data-type="zone"]').isVisible(),true);await page.keyboard.press('Escape');
  await page.evaluate(()=>e190ReturnToFishing());
  const xp=await page.locator('#page_fishing .e163Skill').boundingBox(),dock=await page.locator('#combatDock').boundingBox();assert.ok(xp.y>=0&&xp.y+xp.height<dock.y,JSON.stringify({xp,dock}));
  await page.setViewportSize({width,height:width>700?635:720});await page.evaluate(()=>e190ReturnToFishing());
  const small=await page.locator('#page_fishing .e163Skill').boundingBox(),bottom=await page.locator('#combatDock').boundingBox();assert.ok(small.y>=0&&small.y+small.height<bottom.y,JSON.stringify({small,bottom}));
 }finally{await context.close();}
});


test('Estable 23: curated offers remove close variants and preserve retired owned rods after reload',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);
  assert.equal(await page.locator('.rodShopRow').count(),50);
  assert.equal(await page.locator('[data-rod-id="e208_rod_junco_pulso"]').count(),0);
  await page.locator('#combatDock .e194DockRod').click();assert.equal(await page.locator('.e1120Choice').count(),50);assert.doesNotMatch(await page.locator('.e1120Menu').innerText(),/Junco Dorado · Pulso Certero/);await page.keyboard.press('Escape');
  const counts=await page.evaluate(()=>Object.keys(E212_OFFERS).map(id=>E208_CATALOG.filter(r=>r.family===id&&e212Offered(r)).length));assert.deepEqual(counts,Array(10).fill(2));
  await page.evaluate(async()=>{state.owned.e208_rod_junco_pulso=true;state.ui.fishingRodId='e208_rod_junco_pulso';await persist();});
  await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);await page.evaluate(()=>{selectWorkspaceTab('fishing');e16Page();});
  assert.equal(await page.evaluate(()=>e161Rod().id),'e208_rod_junco_pulso');assert.equal(await page.locator('[data-rod-id="e208_rod_junco_pulso"]').count(),1);
  assert.equal(await page.locator('.rodShopRow').count(),51);
  await page.locator('#combatDock .e194DockRod').click();assert.equal(await page.locator('.e1120Choice').count(),51);assert.match(await page.locator('.e1120Choice.active').innerText(),/Junco Dorado · Pulso Certero/);
 }finally{await context.close();}
});

test('Estable 23: quest goals explain all conditions and mark each completed objective',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';state.ui.fishingWeights={byZone:{rio:{catches:3,species:{mojarra:2,lubina:1},bestKg:7.35}}};e16Page();document.querySelector('.e194QuestFold').open=true;document.querySelectorAll('.e216Quest').forEach(n=>n.open=true);});
  const quest=page.locator('.e194QuestBody [data-quest-id="e208_rod_custodio_pulso"]');
  assert.match(await quest.innerText(),/Conseguí 12 capturas/);assert.match(await quest.innerText(),/Descubrí 2 especies distintas/);assert.match(await quest.innerText(),/Capturá un pez de al menos 2 kg/);assert.equal(await quest.locator('.e230Delivery').count(),0);
  assert.equal(await quest.locator('.e230Goal').count(),4);assert.equal(await quest.locator('.e230Goal.done').count(),3);assert.equal(await quest.locator('button').isDisabled(),true);
  await page.evaluate(()=>{state.ui.fishingWeights.byZone.rio.catches=12;e16Page();});assert.equal(await quest.locator('.e230Goal.done').count(),4);assert.equal(await quest.locator('button').isEnabled(),true);
 }finally{await context.close();}
});


for(const width of [1366,390])test(`Estable 23: restored zone and rod shortcuts work within the compact HUD (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);
  await page.locator('#combatDock .e1118Zone').click();
  await page.locator('.e1120Choice').filter({hasText:'Río del Bosque'}).click();
  assert.equal(await page.evaluate(()=>state.ui.fishingZoneId),'rio');
  assert.match(await page.locator('#combatDock .e1118Zone small').innerText(),/Río del Bosque/);
  const image=page.locator('#combatDock .e1118Zone svg');assert.equal(await image.isVisible(),true);assert.equal(await image.locator('use').getAttribute('href'),'#art27-zone-rio');
  await page.evaluate(()=>{state.owned.e161_rod_bamboo=true;});
  await page.locator('#combatDock .e194DockRod').click();await page.locator('.e1120Choice').filter({hasText:'Bambú del Remanso'}).click();
  assert.equal(await page.evaluate(()=>e161Rod().id),'e161_rod_bamboo');
  assert.match(await page.locator('#combatDock .e1123RodName').innerText(),/Bambú/);
  assert.equal(await page.locator('.e1120Menu').count(),1);await page.keyboard.press('Escape');
  assert.equal(await page.locator('#page_fishing #e16GamePanel').isVisible(),true);
 }finally{await context.close();}
});


for(const width of [1366,390])test(`Estable 23: fish matches zone size and live capture progress stays separate from last catch (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);
  await page.evaluate(()=>{e161Fishing=true;e195OriginalStart('atun');cancelAnimationFrame(e16Frame);e16Finish(true);e161StopWait();e195OriginalStart('lubina');cancelAnimationFrame(e16Frame);e16Session.progress=.47;e16Paint();});
  const geometry=await page.evaluate(()=>{const rect=q=>{const r=document.querySelector(q).getBoundingClientRect();return{w:r.width,h:r.height};};return{zone:rect('#combatDock .e1118Zone'),fish:rect('#e188FishingHud .e189Art'),dock:rect('#combatDock')};});
  closeTo(geometry.zone.w-geometry.fish.w,width>700?-8:4);closeTo(geometry.zone.h,102);closeTo(geometry.fish.h,width>700?102:79);assert.ok(geometry.dock.h<=120,JSON.stringify(geometry));
  assert.equal(await page.locator('#e188FishingHud .e188Track').isVisible(),true);
  assert.equal(await page.locator('#e188HudFill').evaluate(n=>n.style.width),'47%');
  assert.equal(await page.locator('#e188FishingHud [role="progressbar"]').getAttribute('aria-valuenow'),'47');
  assert.match(await page.locator('.e214CaptureStatus').innerText(),/Captura actual · 47%/);
  assert.match(await page.locator('#e188HudResult').innerText(),/Atún gigante/);assert.doesNotMatch(await page.locator('#e188HudResult').innerText(),/Lubina/);
  await page.evaluate(()=>{e16Finish(false);e161StopWait();e161Fishing=false;e188UpdateHud();});
  assert.equal(await page.locator('#e188HudFill').evaluate(n=>n.style.width),'0%');assert.match(await page.locator('.e214CaptureStatus').innerText(),/Sin captura en curso/);assert.match(await page.locator('#e188HudResult').innerText(),/Atún gigante/);
 }finally{await context.close();}
});


for(const width of [1366,390])test(`Estable 23: larger full-height rod, XP on the right and stable artwork (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);
  const metrics=await page.evaluate(()=>{
   const q=s=>document.querySelector(s),rect=n=>{const r=n.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height};};
   const panel=q('#combatDock .e194DockRod'),svg=panel.querySelector('svg'),image=q('#combatDock .e1118Zone img'),progress=q('#combatDock .dockProgress');
   const art=panel.querySelector('.e194DockRodArt'),frame=rect(art),view=svg.viewBox.baseVal;
   const contentWidth=Math.min(frame.w,frame.h*view.width/view.height),stats=q('.e1107RodStats');
   for(let i=0;i<10;i++)e188UpdateHud();
   return{rod:rect(panel),xp:rect(progress),fish:rect(q('#e188FishingHud .e189Art')),dock:rect(q('#combatDock')),art:rect(art),contentWidth,stable:svg===panel.querySelector('svg'),stableStats:stats===q('.e1107RodStats'),stableZone:image===q('#combatDock .e1118Zone img'),xpParent:progress.parentElement.id};
  });
  assert.equal(metrics.xpParent,'e188FishingHud');assert.ok(metrics.xp.x>=metrics.rod.x+metrics.rod.w,JSON.stringify(metrics));assert.ok(metrics.rod.h>=100);assert.ok(metrics.dock.h<=120);
  if(width>700){assert.ok(metrics.contentWidth>=300,JSON.stringify(metrics));assert.ok(metrics.contentWidth/metrics.art.w>=.85,JSON.stringify(metrics));}
  assert.equal(metrics.stable,true);assert.equal(metrics.stableStats,true);assert.equal(metrics.stableZone,true);
  await page.evaluate(()=>selectWorkspaceTab('combat'));
  assert.equal(await page.locator('#combatDock .dockVitals>.dockProgress').count(),1);assert.equal(await page.locator('#combatDock .dockProgress').count(),1);
  assert.equal(await page.locator('#dockHpText').isVisible(),true);assert.equal(await page.locator('#dockPlayerLevel').isVisible(),true);
  await page.evaluate(()=>selectWorkspaceTab('fishing'));
  assert.equal(await page.locator('#e188FishingHud>.dockProgress').count(),1);assert.equal(await page.locator('#combatDock .dockProgress').count(),1);
  assert.equal(await page.locator('#combatDock .e1118Zone').isVisible(),true);assert.equal(await page.locator('#e188FishingHud .e188Track').isVisible(),true);
 }finally{await context.close();}
});

test('Estable 23: Atlas derives independent milestones from v7 records without modifying saves or rewards',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,100,false);
  const report=await page.evaluate(()=>{
   state.inventory={};state.ui.e18Fishing={bySpecies:{}};state.ui.fishingWeights={};state.ui.e191Achievements={};state.ui.e187Rewards={};
   const zone=id=>E165_ZONES.find(z=>z.id===id),record=state.ui.e18Fishing.bySpecies,read=id=>{const before=JSON.stringify(state),p=e216ZoneProgress(zone(id));if(JSON.stringify(state)!==before)throw Error('Atlas wrote to save');return p.stars;};
   const empty=read('rio');for(const id of zone('rio').fish.slice(0,3))record[id]={total:1};const discovery=read('rio');
   state.owned[E171_QUESTS[0].rod.id]=true;state.owned[E18_ROD.id]=true;for(const r of E208_CATALOG.filter(r=>r.unlock?.zone==='rio'))state.owned[r.id]=true;const quests=read('rio');
   for(const id of zone('rio').fish)record[id]={total:1};const all=read('rio');
   const noQuestEmpty=read('manglar');record[zone('manglar').fish[0]]={total:1};const noQuestOne=read('manglar');for(const id of zone('manglar').fish)record[id]={total:1};const noQuestAll=read('manglar');
   state.ui.e191Achievements.glaciar=true;const legacy=read('glaciar');state.owned[E187_ROD.id]=true;const coral=read('arrecife');
   return{empty,discovery,quests,all,noQuestEmpty,noQuestOne,noQuestAll,legacy,coral,definitions:e216QuestDefinitions().length,counts:E165_ZONES.map(z=>e216ZoneProgress(z).quests.length),species:E16_FISH.length};
  });
  assert.deepEqual(report.empty,[false,false,false]);assert.deepEqual(report.discovery,[true,false,false]);assert.deepEqual(report.quests,[true,true,false]);assert.deepEqual(report.all,[true,true,true]);
  assert.deepEqual(report.noQuestEmpty,[false,false,false]);assert.deepEqual(report.noQuestOne,[false,true,false]);assert.deepEqual(report.noQuestAll,[true,true,true]);assert.deepEqual(report.legacy,[true,false,true]);assert.equal(report.coral[1],true);
  assert.equal(report.definitions,52);assert.equal(report.species,50);assert.deepEqual(report.counts,[3,8,3,3,3,3,4,6,4,6,3,3,3]);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: Atlas search, mastery, accessible badges and compact quest details (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';state.owned.e187_rod_coral=true;state.ui.e18Fishing={bySpecies:Object.fromEntries(E165_ZONES.find(z=>z.id==='manglar').fish.map(id=>[id,{total:1}]))};e16Page();});
  assert.equal(await page.locator('#fishingAtlas').count(),1);assert.equal(await page.locator('.atlasZoneDetail').count(),0);assert.equal(await page.locator('.e216Quest').count(),8);assert.equal(await page.locator('.e216Quest[open]').count(),0);
  await page.locator('.e194QuestFold').evaluate(n=>n.open=true);
  const first=page.locator('.e216Quest').first();assert.equal(await first.locator('summary').count(),0);assert.equal(await first.locator('.e230Goal').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height>0)),true);assert.match(await first.innerText(),/Entrega: consume peces del inventario/);
  await page.evaluate(()=>e16Page());assert.equal(await page.locator('.e194QuestFold').evaluate(n=>n.open),true);
  await page.locator('#fishingAtlas').evaluate(n=>n.open=true);assert.equal(await page.locator('.atlasRow:visible').count(),13);
  await page.locator('[data-atlas-search]').fill('rio del');assert.equal(await page.locator('.atlasRow:visible').count(),1);await page.locator('[data-atlas-search]').fill('');
  await page.locator('[data-atlas-filter]').selectOption('complete');assert.equal(await page.locator('.atlasRow:visible').count(),1);await page.locator('[data-atlas-zone="manglar"]').click();assert.equal(await page.locator('.atlasMedal').count(),1);assert.match(await page.locator('.atlasZoneDetail').innerText(),/sin encargos principales/);
  await page.locator('[data-atlas-filter]').selectOption('pending');assert.equal(await page.locator('.atlasRow:visible').count(),12);await page.locator('[data-atlas-zone="arrecife"]').click();
  const before=await page.evaluate(()=>JSON.stringify({gold:state.gold,xp:state.skills.pesca.xp,inventory:state.inventory,owned:state.owned,record:state.ui.e18Fishing,weights:state.ui.fishingWeights,rewards:state.ui.e187Rewards,achievements:state.ui.e191Achievements,zone:state.ui.fishingZoneId}));const badge=page.locator('[data-atlas-badge="arrecife"]');assert.match(await badge.getAttribute('title'),/secreto del arrecife.*Entregá.*Rama Coralina/is);await badge.click();assert.match(await page.locator('.atlasBadgeDetail').innerText(),/Recompensa ya obtenida/);assert.equal(await page.evaluate(()=>JSON.stringify({gold:state.gold,xp:state.skills.pesca.xp,inventory:state.inventory,owned:state.owned,record:state.ui.e18Fishing,weights:state.ui.fishingWeights,rewards:state.ui.e187Rewards,achievements:state.ui.e191Achievements,zone:state.ui.fishingZoneId})),before);
  const geometry=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,rows:[...document.querySelectorAll('.atlasRow:not([hidden])')].map(n=>n.getBoundingClientRect().height),quests:[...document.querySelectorAll('.e230Quest')].map(n=>n.getBoundingClientRect().height)}));assert.ok(geometry.overflow<=1,JSON.stringify(geometry));assert.ok(geometry.rows.every(h=>h<=65));assert.ok(geometry.quests.every(h=>h<=(width<700?280:180)));
  await page.evaluate(async()=>persist());await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);await page.evaluate(()=>selectWorkspaceTab('fishing'));await atlasZone(page,'manglar');assert.equal(await page.locator('.atlasMedal').count(),1);assert.equal(await page.evaluate(()=>state.owned.e187_rod_coral),true);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: thin rod art, signed attribute comparisons and full names (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);await page.evaluate(()=>{state.owned.e208_rod_custodio_titan=true;state.ui.fishingRodId='e208_rod_custodio_titan';e16Page();});
  assert.equal(await page.locator('#combatDock .e1118Zone .e1120RodLabel').count(),0);assert.equal(await page.locator('#page_fishing>h2').count(),0);
  const name=page.locator('#combatDock .e1123RodName');assert.match(await name.innerText(),/Ancla de los Juncos/);assert.ok(await name.evaluate(n=>n.scrollWidth<=n.clientWidth+1));
  await page.locator('#combatDock .e194DockRod').click();
  const choice=page.locator('.e1120Choice').filter({has:page.locator('b',{hasText:'Hilo de Plata'})});assert.equal(await choice.locator('.e216RodThumb svg').count(),1);assert.equal(await choice.locator('.rodCompare').count(),6);
  const actual=await choice.locator('[data-stat="control"]').getAttribute('data-delta'),expected=await page.evaluate(()=>Math.round((e1101Stats(E161_RODS.find(r=>r.id==='e161_rod_fiber')).control-e1101Stats(e161Rod()).control)/5*100)/100);assert.equal(Number(actual),expected);
  const deltas=await page.locator('.rodCompare').evaluateAll(ns=>ns.map(n=>({delta:Number(n.dataset.delta),better:n.classList.contains('better'),worse:n.classList.contains('worse'),same:n.classList.contains('same')})));for(const d of deltas){assert.equal(d.better,d.delta>0);assert.equal(d.worse,d.delta<0);assert.equal(d.same,d.delta===0);}assert.ok(deltas.some(d=>d.better)&&deltas.some(d=>d.worse));
  assert.ok(await page.locator('.e1120Menu').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: compact picker search, all sorts, honest levels and Pareto recommendations (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);await page.evaluate(()=>{for(const id of ['e16_rod','e161_rod_bamboo','e161_rod_fiber','e171_rod_rio','e208_rod_celeste_pulso'])state.owned[id]=true;e16Page();});
  const report=await page.evaluate(()=>{
   const all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD].filter(r=>e212Offered(r)||state.owned[r.id]),order=e217Recommended(all),ids=order.map(r=>r.id);
   for(let i=0;i<order.length;i++)for(let j=i+1;j<order.length;j++)if(!!state.owned[order[i].id]===!!state.owned[order[j].id]&&e217Dominates(e1101Stats(order[j]),e1101Stats(order[i])))throw Error('Dominated rod ordered first');
   const own=order.map(r=>!!state.owned[r.id]);if(own.some((v,i)=>v&&own.slice(0,i).includes(false)))throw Error('Unavailable rod ahead of owned');
   return{ids,repeat:e217Recommended(all).map(r=>r.id),gold:E161_RODS.filter(r=>!r.unlock).map(e217RequiredLevel),collector:e217RequiredLevel(E18_ROD),old:e217RequiredLevel(E17_ROD)};
  });
  assert.deepEqual(report.ids,report.repeat);assert.ok(report.gold.every(x=>x===null));assert.equal(report.collector,null);assert.equal(report.old,6);
  await page.locator('#combatDock .e194DockRod').click();assert.equal(await page.locator('.e217RodTools select').inputValue(),'recommended');assert.equal(await page.locator('.rodCompareNote,.e1120Menu[data-type="rod"] .e1120MenuHeader').count(),0);
  assert.deepEqual(await page.locator('.e1120Choice').evaluateAll(ns=>ns.map(n=>n.dataset.rodId)),report.ids);
  await page.locator('.e217RodTools input[type="search"]').fill('boveda celestial');assert.equal(await page.locator('.e1120Choice:visible').count(),2);await page.locator('.e217RodTools input[type="search"]').fill('');
  for(const sort of ['speed','luck','control','resilience','maxKg']){
   await page.locator('.e217RodTools select').selectOption(sort);
   assert.equal(await page.locator('.e1120Choice').evaluateAll(ns=>ns.length),report.ids.length);
   const result=await page.evaluate(sort=>{const rows=[...document.querySelectorAll('.e1120Choice')],all=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD];return rows.map(n=>{const r=all.find(r=>r.id===n.dataset.rodId);return sort.startsWith('level')?e217RequiredLevel(r):e1101Stats(r)[sort];});},sort);
   const values=result.filter(x=>x!==null);assert.deepEqual(values,[...values].sort((a,b)=>sort==='levelAsc'?a-b:b-a));if(sort.startsWith('level'))assert.ok(result.slice(0,values.length).every(x=>x!==null));
  }
  assert.ok(await page.locator('.e1120Menu').evaluate(n=>n.scrollWidth<=n.clientWidth+1));await page.locator('.e217RodTools button').click();assert.equal(await page.locator('.e1120Menu').count(),0);
 }finally{await context.close();}
});

test('Estable 23: catalog comparisons use pp/kg, recalculate on equip and preserve filters while sorting by real requirements',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);await page.locator('#tab_shop').click();await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.locator('.rodTier[data-tier="inicio"]').evaluate(n=>n.open=true);
  const row=page.locator('.rodShopRow[data-rod-id="e161_rod_fiber"]');assert.equal(await row.locator('.rodCompare').count(),6);assert.match(await row.locator('[data-stat="control"]').innerText(),/▼2 pp/);assert.match(await row.locator('[data-stat="maxKg"]').innerText(),/▼220 kg/);
  const gold=await page.evaluate(()=>state.gold);await row.locator('button').click();assert.equal(await page.evaluate(()=>e161Rod().id),'e161_rod_fiber');assert.equal(await page.evaluate(()=>state.gold),gold-700);
  assert.ok(await row.locator('.rodCompare').evaluateAll(ns=>ns.every(n=>Number(n.dataset.delta)===0&&n.textContent.includes('='))));
  await page.locator('[data-rod-filter]').selectOption('quest');await page.locator('[data-rod-search]').fill('');
  assert.equal(await page.locator('[data-rod-sort] option[value="levelAsc"],[data-rod-sort] option[value="levelDesc"]').count(),0);
  assert.equal(await page.locator('[data-rod-filter]').inputValue(),'quest');
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: real fishing XP groups drops, shows final level and preserves layout (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);await page.bringToFront();await page.evaluate(()=>{state.skills.pesca.xp=15995;e16Page();e190ReturnToFishing();});
  const report=await page.evaluate(async()=>{
   const geometry=()=>{const r=document.querySelector('#page_fishing .e163XpTrack').getBoundingClientRect(),s=document.getElementById('e16GamePanel').getBoundingClientRect();return{xpY:r.y,xpH:r.height,stageY:s.y,stageH:s.height};};const before=geometry(),xp=state.skills.pesca.xp;
   const a=sklXp(state,'pesca',3),b=sklXp(state,'pesca',7);e16Page();
   await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
   return{before,after:geometry(),delta:state.skills.pesca.xp-xp,awarded:a+b,drop:[...document.querySelectorAll('.e217XpDrop')].map(n=>({text:n.textContent,key:n.dataset.xpSkill})),level:[...document.querySelectorAll('.e217LevelNotice')].map(n=>n.textContent),glow:document.querySelectorAll('.e217LevelGlow').length};
  });
  assert.deepEqual(report.before,report.after);assert.equal(report.delta,report.awarded);assert.deepEqual(report.drop,[{text:'+10 XP',key:'pesca'}]);assert.deepEqual(report.level,['¡PESCA NIVEL 41!']);assert.equal(report.glow,1);
  await page.waitForFunction(()=>!document.querySelector('.e217XpDrop'));assert.equal(await page.locator('.e217LevelNotice').count(),1);await page.waitForFunction(()=>!document.querySelector('.e217LevelNotice'));assert.equal(await page.locator('.e217LevelGlow').count(),0);
 }finally{await context.close();}
});

test('Estable 23: XP routes to the actual skill and suppresses offline, load and background-state awards',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);await page.evaluate(()=>selectWorkspaceTab('combat'));await page.locator('#hybridSidebar').evaluate(n=>n.open=true);await page.locator('[data-skill-key="magia"]').scrollIntoViewIfNeeded();await page.bringToFront();
  const report=await page.evaluate(async()=>{
   sklXp(state,'magia',2);gainCharacterXP(state,3);updateLive();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);return[...document.querySelectorAll('.e217XpDrop')].map(n=>n.dataset.xpSkill).sort();
  });assert.deepEqual(report,['character','magia']);assert.equal(await page.locator('.e217XpDrop[data-xp-skill="pesca"]').count(),0);
  await page.waitForFunction(()=>!document.querySelector('.e217XpDrop'));
  const silent=await page.evaluate(async()=>{OFF.active=true;try{sklXp(state,'magia',5);gainCharacterXP(state,7);}finally{OFF.active=false;}const copy=copyJSON(state);sklXp(copy,'magia',9);state.nav={id:'costa',left:30,totalMs:30000,remainingMs:30000,elapsedMs:0,paused:false,legacy:false,earnedGold:0,earnedXp:0};await simulateOffline(10);state.nav.id=null;state.nav.remainingMs=0;await new Promise(requestAnimationFrame);return{pending:e217PendingXP.size,visible:document.querySelectorAll('.e217XpDrop,.e217LevelNotice').length};});assert.deepEqual(silent,{pending:0,visible:0});
  await page.evaluate(async()=>persist());await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.equal(await page.locator('.e217XpDrop,.e217LevelNotice').count(),0);
 }finally{await context.close();}
});

test('Estable 23: reduced motion keeps brief feedback without animation; multi-level gains show one final level',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{state.skills.pesca.xp=0;e16Page();e190ReturnToFishing();});await page.bringToFront();
  const result=await page.evaluate(async()=>{sklXp(state,'pesca',90);e16Page();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);const drop=document.querySelector('.e217XpDrop'),level=document.querySelector('.e217LevelNotice');const clone=document.documentElement.cloneNode(true);e217CleanClone(clone);return{drop:drop.textContent,level:level.textContent,levelCount:document.querySelectorAll('.e217LevelNotice').length,animation:getComputedStyle(drop).animationName,transform:getComputedStyle(drop).transform,cloned:clone.querySelectorAll('#e217XpEffects,.e217LevelGlow').length};});
  assert.equal(result.drop,'+90 XP');assert.match(result.level,/PESCA NIVEL 4/);assert.equal(result.levelCount,1);assert.equal(result.animation,'none');assert.equal(result.transform,'none');assert.equal(result.cloned,0);
 }finally{await context.close();}
});

test('Estable 23: every existing skill bar receives only its live award, including weapon hits',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);await page.evaluate(()=>selectWorkspaceTab('combat'));await page.locator('#hybridSidebar').evaluate(n=>n.open=true);await page.bringToFront();
  for(const key of ['weapon','magia','resMagica','escudos','armaduras','navegacion']){
   await page.locator(`[data-skill-key="${key}"]`).scrollIntoViewIfNeeded();
   const report=await page.evaluate(async key=>{
    let delta;
    if(key==='weapon'){const before=state.skill.xp,random=rng;try{rng=()=>0;playerSwing(derive(state),enemyById(state.combat.enemyId));}finally{rng=random;}delta=state.skill.xp-before;}
    else delta=sklXp(state,key,1);
    updateLive();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
    return{delta,keys:[...document.querySelectorAll('.e217XpDrop')].map(n=>n.dataset.xpSkill),target:!!e217XPTarget(key)};
   },key);
   assert.ok(report.delta>0);assert.equal(report.target,true);assert.deepEqual(report.keys,[key]);await page.waitForFunction(()=>!document.querySelector('.e217XpDrop'));
  }
 }finally{await context.close();}
});

test('Estable 23: importing and selecting a high-level backup does not replay XP drops or level-ups',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);page.on('dialog',dialog=>dialog.accept());
  const result=await page.evaluate(async()=>{
   const raw=makeRosterRecord();raw.characters[0].state.xp=xpFor(50);raw.characters[0].state.skills.pesca.xp=98010;
   await importJSON(new File([JSON.stringify(raw)],'isolated-v7.json',{type:'application/json'}));
   const selected=roster.activeId;await changeRoster('select',roster.characters[0].id);selectWorkspaceTab('fishing');await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
   return{selected,level:e16FishLevel(),characterLevel:levelFromXp(state.xp),pending:e217PendingXP.size,effects:document.querySelectorAll('.e217XpDrop,.e217LevelNotice').length};
  });assert.equal(result.selected,null);assert.equal(result.level,100);assert.equal(result.characterLevel,50);assert.equal(result.pending,0);assert.equal(result.effects,0);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: illustrated journal, truthful records, nearby details and HUD XP (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,40,false);
 const result=await page.evaluate(()=>{
 state.ui.e18Fishing={total:12,large:2,huge:1,legendary:1,bySpecies:{}};state.ui.fishingWeights={bySpecies:{},byZone:{}};
 for(const f of E16_FISH.slice(0,10)){state.ui.e18Fishing.bySpecies[f.id]={total:2,best:'legendary'};state.ui.fishingWeights.bySpecies[f.id]={bestKg:99,catches:2};}
 const fish=E16_FISH[0];
 const legacy=e218Record(fish.id);
 for(const [label,weightKg] of [['',2],['Grande',3],['¡ENORME!',4],['¡LEGENDARIO!',5],['Grande',1]]){e183LastQuality={fish:fish.name,label};e190RecordWeight({fish,weightKg,zone:'muelle',rodId:e161Rod().id});}
 const record=e218Record(fish.id);e16Page();return{legacy,record};
 });
 assert.equal(result.legacy.best,99);assert.equal(result.legacy.category,null);assert.deepEqual(result.legacy.categories,{});
 assert.equal(result.record.best,99);assert.equal(result.record.category,null);assert.deepEqual(result.record.categories,{normal:2,large:3,huge:4,legendary:5});
 await page.locator('.e181Journal').evaluate(n=>n.open=true);
 const cards=page.locator('[data-journal-fish]');assert.equal(await cards.count(),10);assert.equal(await cards.first().locator('svg.fishIllustration').count(),1);
 await cards.nth(2).click();
 const geometry=await page.locator('.e218Album').evaluate(grid=>{const selected=grid.querySelector('[aria-expanded=true]'),detail=grid.querySelector('.e218Detail'),cards=[...grid.querySelectorAll('[data-journal-fish]')];return{top:detail.offsetTop,rowBottom:Math.max(...cards.filter(c=>c.offsetTop===selected.offsetTop).map(c=>c.offsetTop+c.offsetHeight)),next:detail.nextElementSibling?.offsetTop||Infinity,bottom:detail.offsetTop+detail.offsetHeight,overflow:detail.scrollWidth>detail.clientWidth+1};});
 assert.ok(geometry.top>=geometry.rowBottom);assert.ok(geometry.next>=geometry.bottom);assert.equal(geometry.overflow,false);
 await cards.nth(2).click();assert.equal(await page.locator('.e218Detail').count(),0);
 await cards.first().click();assert.match(await page.locator('.e218Detail').innerText(),/Categoría histórica no registrada/);
 await page.evaluate(()=>{document.querySelector('.e181Journal').open=false;window.scrollTo(0,0);sklXp(state,'pesca',30);e16Page();e188UpdateHud();});
 await page.waitForSelector('.e217XpDrop');await page.waitForTimeout(200);
 const fx=await page.evaluate(()=>{const d=document.querySelector('.e217XpDrop'),target=e217XPTarget('pesca'),r=document.createRange();r.selectNodeContents(target.node);return{text:d.textContent,hud:!!target.node.closest('#e188FishingHud'),right:d.getBoundingClientRect().right,left:r.getBoundingClientRect().left,opacity:Number(getComputedStyle(d).opacity)};});
 assert.equal(fx.text,'+30 XP');assert.equal(fx.hud,true);assert.ok(fx.right<fx.left);assert.ok(fx.opacity>.5);
 }finally{await context.close();}
});

// Regression cases found during the technical audit. Every failure is injected in an isolated context.
for(const phase of ['capture','bubbles','waiting'])test(`Audit 19: import cancels ${phase} without transferring runtime or losing v7 history`,async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);page.on('dialog',d=>d.accept());
 const result=await page.evaluate(async phase=>{
 state.ui.fishingWeights={bySpecies:{bagre:{bestKg:7.2,bestCategory:'large',categoryBestKg:{large:7.2},catches:3}},byZone:{rio:{catches:3,bestKg:7.2,species:{bagre:3}}}};
 state.ui.e18Fishing={total:3,large:3,bySpecies:{bagre:{total:3,best:'large'}}};state.ui.e187Rewards={laguna:true};state.ui.historicalUnknownField={keep:'intacto'};
 const backup=makeRosterRecord(),incoming=backup.characters[0].state;incoming.name='Importado';incoming.gold=98765;
 // Full potion charges refresh their wall-clock anchors on render; those clocks are not progress.
 const snapshot=s=>{const ui=copyJSON(s.ui);if(ui.potions){delete ui.potions.hpAt;delete ui.potions.mpAt;}return JSON.stringify([ui,s.skills,s.owned,s.inventory]);};const history=snapshot(incoming);
 e161Fishing=true;
 if(phase==='capture'){e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);}
 else if(phase==='bubbles')e16Start('bagre');else e161NextBite();
 await importJSON(new File([JSON.stringify(backup)],'isolated-audit.json'));
 const stopped=!e16Session&&!e195Pending&&e161Waiting===null&&e195ShakeTimer===null&&!e161Fishing&&e217ActiveFX.size===0;
 await changeRoster('select',roster.characters[0].id);selectWorkspaceTab('fishing');
 const preserved=history===snapshot(state);
 const before=JSON.stringify([state.skills,state.inventory]);e16Finish(true);
 await persist();return{stopped,preserved,duplicateSafe:before===JSON.stringify([state.skills,state.inventory]),name:state.name,gold:state.gold};
 },phase);
 assert.equal(result.stopped,true);assert.equal(result.preserved,true,JSON.stringify(result));assert.equal(result.duplicateSafe,true);assert.equal(result.name,'Importado');assert.equal(result.gold,98765);
 await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.deepEqual(await page.evaluate(()=>state.ui.historicalUnknownField),{keep:'intacto'});assert.equal(await page.evaluate(()=>e218Record('bagre').categories.large),7.2);
 }finally{await context.close();}
});

test('Audit 19: leaving for DEV and deleting the active character clean runtime; cancelling import keeps fishing',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 const result=await page.evaluate(async()=>{
 const confirmBefore=window.confirm;window.confirm=()=>false;
 e161Fishing=true;e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);const active=e16Session;
 await importJSON(new File([JSON.stringify(makeRosterRecord())],'cancel.json'));const cancelled=e16Session===active;
 window.confirm=()=>true;
 try{await switchEnvironment();const devStopped=!e16Session&&!e195Pending&&!e161Fishing&&e161Waiting===null;
 await changeRoster('create');e16Finish(true);const devInventory=JSON.stringify(state.inventory);await switchEnvironment();await changeRoster('select',roster.characters[0].id);selectWorkspaceTab('fishing');
 e161Fishing=true;e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);await changeRoster('delete',roster.activeId);
 return{cancelled,devStopped,devInventory,deletedStopped:state===null&&!e16Session&&!e195Pending&&!e161Fishing&&e161Waiting===null,remaining:roster.characters.length};
 }finally{window.confirm=confirmBefore;}
 });assert.deepEqual(result,{cancelled:true,devStopped:true,devInventory:'{}',deletedStopped:true,remaining:0});
 }finally{await context.close();}
});

test('Audit 19: an aborted real IndexedDB transaction settles, falls back to localStorage and does not block later saves',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 const result=await page.evaluate(async()=>{
 const db=await openDB(),transaction=db.transaction.bind(db);let aborts=0;
 db.transaction=function(...args){const tx=transaction(...args);if(args[1]==='readwrite'){aborts++;queueMicrotask(()=>tx.abort());}return tx;};
 state.gold=54321;
 let saved;
 try{saved=await Promise.race([persist(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Save queue stalled on abort')),1500))]);}finally{delete db.transaction;}
 const local=JSON.parse(localStorage.getItem(LS_KEY));const localGold=local.characters.find(c=>c.id===local.activeId).state.gold;
 state.gold=54322;const next=await persist(),idb=await idbGet();
 return{saved,aborts,localGold,next,idbGold:idb.characters.find(c=>c.id===idb.activeId).state.gold,version:idb.version};
 });assert.equal(result.saved,true);assert.ok(result.aborts>=1);assert.equal(result.localGold,54321);assert.equal(result.next,true);assert.equal(result.idbGold,54322);assert.equal(result.version,7);
 await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.equal(await page.evaluate(()=>state.gold),54322);
 }finally{await context.close();}
});

test('Audit 19: unchanged inventory keeps nodes and focus; real sales and reorder still update',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 const report=await page.evaluate(async()=>{
 state.inventory={pez_bagre:3,pez_atun__large:2,material_rata:4};selectWorkspaceTab('inventory');e193Inventory();
 const panel=document.getElementById('e164Inventory'),button=panel.querySelector('button');button.focus();let mutations=0;
 const observer=new MutationObserver(ms=>mutations+=ms.length);observer.observe(panel,{childList:true,subtree:true});
 for(let i=0;i<40;i++)updateInv();await new Promise(requestAnimationFrame);observer.disconnect();
 return{mutations,preserved:button.isConnected&&document.activeElement===button,rows:panel.querySelectorAll('.e164Item').length};
 });assert.deepEqual(report,{mutations:0,preserved:true,rows:3});
 const gold=await page.evaluate(()=>state.gold);await page.locator('#e164Inventory [data-e16-sell="bagre"]').first().click();assert.equal(await page.evaluate(()=>state.inventory.pez_bagre),2);assert.equal(await page.evaluate(()=>state.gold),gold+await page.evaluate(()=>E16_FISH.find(f=>f.id==='bagre').price));
 const before=await page.locator('#e164Inventory .e164Item').first().innerText();await page.locator('#e164Inventory [data-e193-move="down"]').first().click();assert.notEqual(await page.locator('#e164Inventory .e164Item').first().innerText(),before);
 }finally{await context.close();}
});

test('Audit 19: a late XP award gets its own full effect; pending effects cannot leak to another character',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 await page.evaluate(()=>{sklXp(state,'pesca',5);e16Page();e188UpdateHud();});await page.waitForSelector('.e217XpDrop');
 await page.waitForTimeout(700);
 await page.evaluate(()=>{sklXp(state,'pesca',7);e16Page();e188UpdateHud();});
 await page.waitForFunction(()=>document.querySelector('.e217XpDrop')?.textContent==='+7 XP');
 await page.waitForTimeout(200);assert.ok(await page.locator('.e217XpDrop').evaluate(n=>Number(getComputedStyle(n).opacity)>.5));
 const clean=await page.evaluate(async()=>{await changeRoster('leave');return{pending:e217PendingXP.size,active:e217ActiveFX.size,root:!!document.getElementById('e217XpEffects'),flush:e217FlushFrame,frame:e217EffectFrame};});assert.deepEqual(clean,{pending:0,active:0,root:false,flush:0,frame:0});
 }finally{await context.close();}
});

test('Audit 19: repeated screen renders do not register more global listeners',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);const client=await context.newCDPSession(page);
 const count=async expression=>{const {result}=await client.send('Runtime.evaluate',{expression});const {listeners}=await client.send('DOMDebugger.getEventListeners',{objectId:result.objectId});return listeners.map(l=>l.type+':'+l.useCapture).sort();};
 const before={document:await count('document'),window:await count('window')};
 await page.evaluate(()=>{for(let i=0;i<12;i++){selectWorkspaceTab(i%2?'fishing':'combat',false);renderGame();}});
 assert.deepEqual({document:await count('document'),window:await count('window')},before);
 await page.locator('#tab_combat').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.evaluate(()=>document.activeElement.id),'tab_magic');
 await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.id),'tab_fishing');await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.id),'tab_combat');await client.detach();
 }finally{await context.close();}
});

test('Audit 19: secondary HTML download preserves all scripts, excludes transient UI and boots with XP feedback',async()=>{
 const {context,page}=await fresh();let exportedContext;
 try{
 await character(page,40,false);await page.locator('#combatDock .e194DockRod').click();
 const pending=page.waitForEvent('download');await page.evaluate(()=>downloadCompactStable());const download=await pending;
 assert.equal(download.suggestedFilename(),'index.html');const html=readFileSync(await download.path(),'utf8');
 exportedContext=await browser.newContext();const exported=await exportedContext.newPage();exported.on('pageerror',e=>errors.push(e.message));
 await exported.route('**/*',r=>r.request().url()===url+'/'?r.fulfill({contentType:'text/html',body:html}):r.abort());await exported.goto(url);await exported.waitForFunction(()=>storageReady);
 assert.equal(await exported.locator('.e1120Menu,#e217XpEffects').count(),0);await character(exported,40,false);assert.equal(await exported.evaluate(()=>typeof progressThreshold),'function');
 await exported.evaluate(()=>{sklXp(state,'pesca',9);e16Page();e188UpdateHud();});await exported.waitForSelector('.e217XpDrop');assert.equal(await exported.locator('.e217XpDrop').innerText(),'+9 XP');await exported.evaluate(()=>persist());
 }finally{await exportedContext?.close();await context.close();}
});

test('Audit 19: all five v7 characters survive actual JSON export/import, storage fallback and reload',async()=>{
 const {context,page}=await fresh();
 try{
 const expected=await page.evaluate(async()=>{
 for(let i=0;i<5;i++){
 draft={name:'Personaje '+i,race:'humano',cls:'guerrero'};await changeRoster('create');
 state.gold=1000+i*100;state.skills.pesca={xp:10*i*i};state.owned.e161_rod_bamboo=true;state.ui.fishingRodId='e161_rod_bamboo';state.inventory.pez_bagre=i+1;state.ui.e187Rewards={laguna:i%2===0};state.ui.fishingWeights={bySpecies:{bagre:{bestKg:7+i,bestCategory:'large',categoryBestKg:{large:7+i},catches:i+1}},byZone:{}};state.ui.historicalExtra={value:i};
 await changeRoster('leave');
 }
 return roster.characters.map(c=>({id:c.id,name:c.state.name,gold:c.state.gold,xp:c.state.skills.pesca.xp,rod:c.state.ui.fishingRodId,owned:c.state.owned,inventory:c.state.inventory,weights:c.state.ui.fishingWeights,rewards:c.state.ui.e187Rewards,extra:c.state.ui.historicalExtra}));
 });
 const pending=page.waitForEvent('download');await page.evaluate(()=>exportJSON());const download=await pending;const backup=readFileSync(await download.path(),'utf8');assert.equal(JSON.parse(backup).version,7);assert.equal(JSON.parse(backup).characters.length,5);
 page.on('dialog',d=>d.accept());await page.evaluate(async text=>{await importJSON(new File([text],'actual-export.json'));},backup);
 const actual=()=>page.evaluate(()=>roster.characters.map(c=>({id:c.id,name:c.state.name,gold:c.state.gold,xp:c.state.skills.pesca.xp,rod:c.state.ui.fishingRodId,owned:c.state.owned,inventory:c.state.inventory,weights:c.state.ui.fishingWeights,rewards:c.state.ui.e187Rewards,extra:c.state.ui.historicalExtra})));
 assert.deepEqual(await actual(),expected);
 await page.evaluate(async()=>{const set=Storage.prototype.setItem;try{Storage.prototype.setItem=function(){throw new DOMException('Injected quota','QuotaExceededError');};if(!await persist())throw Error('IDB fallback failed');const idb=await idbGet(),local=JSON.parse(localStorage.getItem(LS_KEY));if(!(idb.revision>local.revision))throw Error('IDB did not receive the newer save');}finally{Storage.prototype.setItem=set;}});
 await page.reload();await page.waitForFunction(()=>storageReady);assert.deepEqual(await actual(),expected);assert.equal(await page.evaluate(()=>roster.activeId),null);assert.equal(await page.locator('#characterList [data-act="selectCharacter"]').count(),5);
 }finally{await context.close();}
});

test('Audit 19: successful catches rebuild the illustrated journal once, after all records settle',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 const result=await page.evaluate(()=>{
 e161Fishing=true;e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);
 const original=e218Journal;let renders=0;e218Journal=function(){renders++;return original();};
 try{
 const before=Number(e18Record().bySpecies.bagre?.total)||0;e16Finish(true);e161StopWait();
 const card=document.querySelector('[data-journal-fish="bagre"]'),record=e218Record('bagre');
 return{renders,count:record.count,expected:before+1,text:card.textContent,best:record.best,categories:Object.keys(record.categories)};
 }finally{e218Journal=original;e210StopFishing();}
 });assert.equal(result.renders,1);assert.equal(result.count,result.expected);assert.match(result.text,new RegExp(result.expected+' capt\\.'));assert.ok(result.best>0);assert.equal(result.categories.length,1);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: fixed 118px HUD preserves the approved Estable 30 layout during overlays (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,40,false);
 await page.evaluate(()=>{state.skills.pesca.xp=15210;state.ui.fishingZoneId='rio';state.ui.lastFishingCatch={id:'bagre',weightKg:3.25,quality:'Grande',xp:81,price:99};e16Page();e188UpdateHud();});
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
 const baseline=JSON.parse(readFileSync(join(__dirname,'fixtures/hud-estable30.json'),'utf8'))[width];
 assert.equal(baseline['#combatDock'].height,118);assert.equal(baseline['#combatDock .e1118Zone'].width,width>700?148:68);assert.equal(baseline['#e188FishingHud .e189Art'].width,width>700?156:64);
 const geometry=()=>page.evaluate(selectors=>Object.fromEntries(selectors.map(s=>{const r=document.querySelector(s).getBoundingClientRect();return[s,{x:r.x,y:r.y,width:r.width,height:r.height}];})),Object.keys(baseline));
 assert.deepEqual(await geometry(),baseline,'HUD rectangles must match the reviewed Estable 30 layout');
 // Hold model values constant to isolate overlay geometry; real XP awards have separate regressions.
 await page.evaluate(()=>{e217XPEvent(state,'pesca',81,40,40);e188UpdateHud();});await page.waitForSelector('.e217XpDrop');await page.waitForTimeout(200);
 assert.deepEqual(await geometry(),baseline,'Overlay must not move or resize any HUD element');
 const style=await page.evaluate(()=>{const drop=document.querySelector('.e217XpDrop'),counter=document.getElementById('dockPlayerXpText'),a=getComputedStyle(drop),b=getComputedStyle(counter),r=document.createRange();r.selectNodeContents(counter);return{family:a.fontFamily,size:a.fontSize,weight:a.fontWeight,counterFamily:b.fontFamily,counterSize:b.fontSize,counterWeight:b.fontWeight,shadow:a.textShadow,right:drop.getBoundingClientRect().right,left:r.getBoundingClientRect().left,color:a.color,opacity:Number(a.opacity)};});
 assert.equal(style.family,style.counterFamily);assert.ok(parseFloat(style.size)<parseFloat(style.counterSize)&&parseFloat(style.size)>=parseFloat(style.counterSize)*.9);assert.equal(style.weight,style.counterWeight);assert.equal(style.shadow,'none');assert.ok(style.right<style.left);assert.equal(style.color,'rgb(186, 213, 164)');assert.ok(style.opacity>.5);
 await page.evaluate(()=>{e219ClearXPEffects();e161Fishing=true;e195OriginalStart('bagre');cancelAnimationFrame(e16Frame);e16Session.progress=.4;e16Paint();});assert.deepEqual(await geometry(),baseline,'Capture phase must preserve HUD dimensions');
 }finally{await context.close();}
});

test('Estable 23: historical record recovery uses matching capture metadata, never the highest category alone',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 const result=await page.evaluate(()=>{
 state.ui.e18Fishing={total:10,large:1,huge:1,legendary:1,bySpecies:{salmon:{total:10,best:'legendary'}}};state.ui.fishingWeights={bySpecies:{salmon:{bestKg:7.61,catches:10}},byZone:{}};delete state.ui.lastFishingCatch;
 let before=JSON.stringify(state);const historical=e218Record('salmon'),unchanged=before===JSON.stringify(state);
 state.ui.lastFishingCatch={id:'salmon',weightKg:7.61,quality:'Grande',xp:20,price:48};before=JSON.stringify(state);const recovered=e218Record('salmon'),readOnly=before===JSON.stringify(state);
 e183LastQuality={fish:E16_FISH.find(f=>f.id==='salmon').name,label:''};e190RecordWeight({fish:E16_FISH.find(f=>f.id==='salmon'),weightKg:2,zone:'rio',rodId:e161Rod().id});const lower=e218Record('salmon');
 delete state.ui.lastFishingCatch;state.ui.fishingWeights.bySpecies.salmon={bestKg:7.61,bestCategory:'huge'};const explicit=e218Record('salmon');
 state.ui.fishingWeights.bySpecies.salmon={bestKg:7.61,categoryBestKg:{normal:1,large:9}};const inconsistent=e218Record('salmon');
 return{historical,unchanged,recovered,readOnly,lower,explicit,inconsistent};
 });assert.equal(result.historical.best,7.61);assert.equal(result.historical.category,null);assert.deepEqual(result.historical.categories,{});assert.equal(result.unchanged,true);assert.equal(result.readOnly,true);
 assert.equal(result.recovered.category,'large');assert.deepEqual(result.recovered.categories,{large:7.61});assert.equal(result.lower.best,7.61);assert.deepEqual(result.lower.categories,{normal:2,large:7.61});assert.equal(result.explicit.categories.huge,7.61);assert.equal(result.inconsistent.best,9);assert.equal(result.inconsistent.category,'large');
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: journal combines filters, sorts real data and keeps details beside their row (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,100,false);
 await page.evaluate(()=>{state.ui.e18Fishing={total:100,large:20,huge:10,legendary:5,bySpecies:{salmon:{total:8,best:'large'},bagre:{total:20,best:'normal'},trucha:{total:3,best:'huge'},atun:{total:2,best:'normal'}}};state.ui.fishingWeights={bySpecies:{salmon:{bestKg:7.61},bagre:{bestKg:3},trucha:{bestKg:9}},byZone:{}};delete state.ui.lastFishingCatch;e16Page();document.querySelector('.e181Journal').open=true;});
 assert.equal(await page.locator('[data-journal-stat]').count(),6);assert.match(await page.locator('[data-journal-stat="normal"]').innerText(),/65/);assert.equal(await page.locator('.journalSummary').evaluate(n=>/[🐟🏆✨]/u.test(n.textContent)),false);
 const visible=()=>page.locator('[data-journal-fish]:not([hidden])').evaluateAll(ns=>ns.map(n=>n.dataset.journalFish));
 assert.equal(await page.locator('[data-journal-sort]').inputValue(),'difficulty');await page.locator('[data-journal-sort]').selectOption('most');assert.deepEqual(await visible(),['bagre','salmon','trucha','atun']);
 for(const [order,expected] of [['least',['atun','trucha','salmon','bagre']],['weightHigh',['trucha','salmon','bagre','atun']],['weightLow',['bagre','salmon','trucha','atun']],['name',['atun','bagre','salmon','trucha']]]){await page.locator('[data-journal-sort]').selectOption(order);assert.deepEqual(await visible(),expected);}
 for(const order of ['valueHigh','valueLow']){await page.locator('[data-journal-sort]').selectOption(order);const ids=await visible(),prices=await page.evaluate(ids=>ids.map(id=>E16_FISH.find(f=>f.id===id).price),ids);assert.deepEqual(prices,[...prices].sort((a,b)=>order==='valueHigh'?b-a:a-b));}
 await page.locator('[data-journal-fish="salmon"]').click();assert.equal(await page.locator('.e218Detail').count(),1);
 await page.locator('[data-journal-zone]').selectOption('rio');await page.locator('[data-journal-search]').fill('TRÚ');assert.deepEqual(await visible(),['trucha']);assert.equal(await page.locator('.e218Detail').count(),0);
 await page.locator('[data-journal-fish="trucha"]').click();assert.equal(await page.locator('.e218Detail').count(),1,JSON.stringify(await page.evaluate(()=>({selected:e218Selected.get(state),open:document.querySelector('.e181Journal').open,cards:[...document.querySelectorAll('[data-journal-fish]')].map(n=>({id:n.dataset.journalFish,hidden:n.hidden,expanded:n.getAttribute('aria-expanded')}))}))));const near=await page.locator('.e218Detail').evaluate(n=>n.previousElementSibling.dataset.journalFish);assert.equal(near,'trucha');
 await page.locator('[data-journal-search]').fill('leviatan');assert.deepEqual(await visible(),[]);assert.equal(await page.locator('.e218Detail').count(),0);assert.ok(await page.locator('.journalEmpty').isVisible());assert.equal(await page.locator('[data-journal-fish="leviatan"]').count(),0);
 await page.evaluate(()=>e16Page());assert.equal(await page.locator('[data-journal-search]').inputValue(),'leviatan');assert.equal(await page.locator('[data-journal-zone]').inputValue(),'rio');
 assert.ok(await page.locator('.journalTools').evaluate(n=>n.scrollWidth<=n.clientWidth+1));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: Atlas expands immediately after the selected zone and toggles closed (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,40,false);await page.locator('#fishingAtlas').evaluate(n=>n.open=true);
 const snapshot=()=>page.evaluate(()=>JSON.stringify([state.inventory,state.gold,state.skills,state.owned,state.ui.fishingWeights,state.ui.e18Fishing,state.ui.e187Rewards]));const before=await snapshot();
 await page.locator('[data-atlas-zone="rio"]').click();assert.equal(await page.locator('.atlasSelection').count(),1);assert.equal(await page.locator('.atlasSelection').evaluate(n=>n.previousElementSibling.dataset.atlasZone),'rio');assert.equal(await page.locator('[data-atlas-zone="rio"]').getAttribute('aria-expanded'),'true');
 const background=await page.locator('.atlasZoneDetail').evaluate(n=>{const img=n.querySelector('.atlasLandscape'),a=img.getBoundingClientRect(),b=n.getBoundingClientRect();return{position:getComputedStyle(img).position,w:a.width,h:a.height,pw:b.width,ph:b.height,overlay:getComputedStyle(n,'::before').backgroundImage};});assert.equal(background.position,'absolute');assert.ok(Math.abs(background.w-background.pw)<=2);assert.ok(Math.abs(background.h-background.ph)<=2);assert.match(background.overlay,/linear-gradient/);
 await page.locator('[data-atlas-zone="arrecife"]').click();assert.equal(await page.locator('.atlasSelection').evaluate(n=>n.previousElementSibling.dataset.atlasZone),'arrecife');assert.equal(await page.locator('.atlasSelection').count(),1);
 await page.locator('[data-atlas-zone="arrecife"]').click();assert.equal(await page.locator('.atlasSelection').count(),0);assert.equal(await page.locator('[data-atlas-zone="arrecife"]').getAttribute('aria-expanded'),'false');assert.equal(await snapshot(),before);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: shop ownership toggle preserves other filters; headers and provenance use real data (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,40,false);await page.evaluate(()=>{state.owned.e208_rod_custodio_pulso=true;e16Page();});await page.locator('#tab_shop').click();await page.locator('#fishingRodShop').evaluate(n=>n.open=true);
 await page.locator('[data-rod-search]').fill('custodio');await page.locator('[data-rod-zone]').selectOption('rio');await page.locator('[data-rod-filter]').selectOption('quest');await page.locator('[data-rod-sort]').selectOption('control');
 const total=await page.locator('.rodShopRow:not([hidden])').count();assert.ok(total>1);
 await page.locator('[data-rod-mine]').click();assert.equal(await page.locator('[data-rod-mine]').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.rodShopRow:not([hidden])').count(),1);
 await page.locator('[data-rod-mine]').click();assert.equal(await page.locator('[data-rod-mine]').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('.rodShopRow:not([hidden])').count(),total);
 assert.equal(await page.locator('[data-rod-search]').inputValue(),'custodio');assert.equal(await page.locator('[data-rod-zone]').inputValue(),'rio');assert.equal(await page.locator('[data-rod-filter]').inputValue(),'quest');assert.equal(await page.locator('[data-rod-sort]').inputValue(),'control');
 const heading=await page.locator('#fishingRodShop>summary').innerText();assert.match(heading,/Tienda de cañas\s+50 cañas · 2 obtenidas/);assert.doesNotMatch(heading,/reforzada|🎣/);assert.equal(await page.locator('.rodTier>summary').evaluateAll(ns=>ns.some(n=>/[🌱🌊✨]/u.test(n.textContent))),false);
 const requirements=await page.evaluate(()=>[E17_ROD,...E171_QUESTS.map(q=>q.rod),E187_ROD].map(e217RequiredLevel));assert.deepEqual(requirements,[6,12,24,32]);assert.equal(await page.locator('[data-rod-sort] option[value="levelAsc"]').count(),0);
 await page.locator('#tab_fishing').click();await page.locator('#combatDock .e194DockRod').click();const tag=page.locator('.e1120Choice[data-rod-id="e208_rod_custodio_pulso"] .rodProvenance');assert.match(await tag.innerText(),/Río del Bosque · Encargo/);assert.match(await tag.getAttribute('title'),/Familia: Custodio del Río.*Encargo: El legado de Custodio del Río/);
 assert.equal(await page.evaluate(()=>e220RodProvenance({id:'unknown',name:'Prueba'}).zone),'');assert.equal(await page.locator('.e1120Choice[data-rod-id="e208_rod_custodio_pulso"] .rodCompare').count(),6);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: uniform illustrated headers and unchanged cast button (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,40,false);
 const report=await page.evaluate(()=>{const nodes=['#fishingAtlas','.e181Journal','#fishingRodShop'].map(s=>document.querySelector(s));nodes.forEach(n=>n.open=false);return{rows:nodes.map(n=>{const r=n.getBoundingClientRect(),title=n.querySelector('summary b').getBoundingClientRect();return{height:r.height,x:r.x,width:r.width,titleX:title.x,art:!!n.querySelector('summary .e221Art'),background:getComputedStyle(n.querySelector('.e221Art')).backgroundImage.match(/^url\("data:image\/(?:png|webp);base64,/)!==null}}),cast:(()=>{const n=document.querySelector('[data-e161-toggle]'),r=n.getBoundingClientRect();return{width:r.width,height:r.height,text:n.textContent,art:!!n.querySelector('.e221Art[data-art="cast"]')};})(),main:document.querySelector('.e163SkillHead>b').textContent,hud:document.getElementById('dockPlayerLevel').textContent};});
 assert.ok(report.rows.every(r=>r.height===46&&r.art&&r.background),JSON.stringify(report));assert.ok(report.rows.every(r=>r.x===report.rows[0].x&&r.width===report.rows[0].width&&r.titleX===report.rows[0].titleX));assert.deepEqual(report.cast,{width:153.078125,height:44,text:'Tirar la caña',art:true});assert.match(report.main,/Pesca · Nivel 40/);assert.match(report.hud,/Pesca · Nv 40/);
 await page.locator('[data-e161-toggle]').click();await page.waitForSelector('.e196Bubble');for(let i=0;i<5&&await page.locator('.e196Bubble').count();i++)await page.locator('.e196Bubble').click();
 assert.equal(await page.locator('.e162FightTitle').innerText(),'Mantené al pez dentro de la zona verde');assert.equal(await page.locator('.e162FightTitle').evaluate(n=>getComputedStyle(n).fontWeight),'600');
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: readable XP duration, golden arrow and unobstructed Level Up overlays (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
 await character(page,40,false);await page.evaluate(()=>{state.skills.pesca.xp=15995;e16Page();e190ReturnToFishing();});
 const rects=()=>page.evaluate(()=>Object.fromEntries(['#combatDock','#combatDock .e1118Zone','#combatDock .e194DockRod','#e188FishingHud','#e188FishingHud .e189Art','#e188FishingHud .dockProgress'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return[s,{x:r.x,y:r.y,w:r.width,h:r.height}];})));
 const before=await rects();await page.evaluate(()=>{sklXp(state,'pesca',81);e16Page();e188UpdateHud();});await page.waitForSelector('.e217LevelNotice');await page.waitForTimeout(150);
 const report=await page.evaluate(()=>{const drop=document.querySelector('.e217XpDrop'),notice=document.querySelector('.e217LevelNotice'),arrow=document.querySelector('.e221LevelArrow'),f=e217ActiveFX.get('pesca:level'),anchor=notice.dataset.anchor==='main'?document.querySelector('.e163XpTrack'):e217XPTarget('pesca').bar,a=anchor.getBoundingClientRect(),n=notice.getBoundingClientRect(),xp=e217ActiveFX.get('pesca:drop');return{drop:drop.textContent,duration:getComputedStyle(drop).animationDuration,ms:xp.until-xp.started,levelMs:f.until-f.started,notice:notice.textContent,svg:!!arrow?.querySelector('svg'),rectangular:getComputedStyle(notice).borderTopWidth!=='0px'||getComputedStyle(notice).backgroundColor!=='rgba(0, 0, 0, 0)',below:n.top>=a.bottom,center:Math.abs((n.left+n.width/2)-(a.left+a.width/2)),glow:document.querySelectorAll('.e217LevelGlow').length};});
 assert.equal(report.drop,'+81 XP');assert.equal(report.duration,'1.7s');assert.equal(report.ms,1700);assert.equal(report.levelMs,2000);assert.equal(report.notice,'¡PESCA NIVEL 41!');assert.equal(report.svg,true);assert.equal(report.rectangular,false);assert.equal(report.below,true);assert.ok(report.center<1);assert.equal(report.glow,1);assert.deepEqual(await rects(),before);
 await page.waitForTimeout(700);assert.ok(await page.locator('.e217XpDrop').evaluate(n=>Number(getComputedStyle(n).opacity)>.98));
 await page.waitForFunction(()=>!document.querySelector('.e217LevelNotice'));assert.equal(await page.locator('.e221LevelArrow').count(),0);
 }finally{await context.close();}
});

test('Estable 23: a real new Grande salmon fills its category below an uncategorized historical record and survives JSON import',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);page.on('dialog',d=>d.accept());
 const captured=await page.evaluate(async()=>{
 state.ui.fishingZoneId='rio';state.ui.e18Fishing={total:10,large:0,huge:0,legendary:1,bySpecies:{salmon:{total:10,best:'legendary'}}};state.ui.fishingWeights={bySpecies:{salmon:{bestKg:7.61,catches:10}},byZone:{}};delete state.ui.lastFishingCatch;
 const old=Math.random;let sampled;
 try{Math.random=()=>.05;e161Fishing=true;e195OriginalStart('salmon');cancelAnimationFrame(e16Frame);sampled=e16Session.weightKg;Math.random=()=>.20;e16Finish(true);e161StopWait();e161Fishing=false;}finally{Math.random=old;}
 const record=e218Record('salmon');await persist();return{sampled,record,serialized:JSON.stringify(makeRosterRecord())};
 });assert.ok(captured.sampled>0&&captured.sampled<7.61);assert.equal(captured.record.best,7.61);assert.equal(captured.record.category,null);assert.equal(captured.record.categories.large,captured.sampled);assert.equal(captured.record.count,11);
 await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.deepEqual(await page.evaluate(()=>e218Record('salmon')),captured.record);
 await page.evaluate(async text=>{await importJSON(new File([text],'real-catch.json'));await changeRoster('select',roster.characters[0].id);selectWorkspaceTab('fishing');document.querySelector('.e181Journal').open=true;},captured.serialized);
 await page.locator('[data-journal-fish="salmon"]').click();assert.doesNotMatch(await page.locator('.e218Detail [data-category="large"]').innerText(),/Sin récord/);assert.match(await page.locator('.e218Detail').innerText(),/Categoría histórica no registrada/);assert.deepEqual(await page.evaluate(()=>e218Record('salmon')),captured.record);
 }finally{await context.close();}
});

test('Estable 23: future data automatically reaches all fishing interfaces without retiring a new family',async()=>{
 const {context,page}=await fresh(390);
 try{
 await character(page,100,false);
 const report=await page.evaluate(()=>{
 if(!e212Offered({id:'e208_rod_junco_future',family:'junco',specialty:'future'})||!e212Offered({id:'future_custom',family:'junco',specialty:'pulso'})||e212Offered({id:'e208_rod_junco_pulso',family:'junco',specialty:'pulso'}))throw Error('Legacy retirement leaked into new content');
 const image=window.e1114ZoneImages.rio;E165_ZONES.push({id:'test_expansion',name:'Ensayo de expansión',req:1,desc:'Solo una prueba aislada',fish:['test_species'],image});E16_FISH.push({id:'test_species',name:'Especie de ensayo',req:1,price:123,xp:1,speed:.1,wiggle:.1,zone:60,icon:''});
 E208_FAMILIES.push({id:'test_family',name:'Familia de ensayo',zone:'test_expansion'});
 const rod={id:'test_rod',name:'Caña de ensayo',price:123,req:1,bonus:10,family:'test_family',zone:'test_expansion',specialty:'new',art:0};E161_RODS.push(rod);E1103_SPECIAL[rod.id]={speed:2,luck:3,resilience:4,trophy:5,maxKg:100,role:'Prueba'};
 state.ui.e18Fishing.bySpecies.test_species={total:2,best:'normal'};state.ui.e18Fishing.total+=2;e16Page();document.querySelector('.e181Journal').open=true;document.getElementById('fishingAtlas').open=true;
 return{zones:E165_ZONES.length,rods:e221Rods().length,offered:e212Offered(rod),journalZone:!!document.querySelector('[data-journal-zone] option[value="test_expansion"]'),shopZone:!!document.querySelector('[data-rod-zone] option[value="test_expansion"]'),atlas:!!document.querySelector('[data-atlas-zone="test_expansion"]'),species:!!document.querySelector('[data-journal-fish="test_species"]'),row:!!document.querySelector('.rodShopRow[data-rod-id="test_rod"]'),sameImage:e221ZoneImage(E165_ZONES.at(-1))===image};
 });assert.deepEqual(report,{zones:14,rods:51,offered:true,journalZone:true,shopZone:true,atlas:true,species:true,row:true,sameImage:true});
 await page.locator('#combatDock .e194DockRod').click();assert.equal(await page.locator('.e1120Choice[data-rod-id="test_rod"]').count(),1);await page.locator('.e217RodTools input[type="search"]').fill('ensayo');assert.equal(await page.locator('.e1120Choice:not([hidden])').count(),1);
 }finally{await context.close();}
});

test('Estable 23: scalable Pareto ranking matches the previous algorithm and is cached during picker searches',async()=>{
 const {context,page}=await fresh();
 try{
 await character(page,40,false);
 const report=await page.evaluate(()=>{
 const rods=[...e221Rods()];for(let i=0;i<160;i++){const r={id:'test_scale_'+i,name:'Ensayo '+i,price:100+i,req:1,bonus:(i*7)%60,family:'new_family',specialty:'x',art:0};E1103_SPECIAL[r.id]={speed:i%35,luck:(i*3)%40,resilience:(i*9)%45,trophy:i%35,maxKg:100+i*10,role:'Prueba'};rods.push(r);E161_RODS.push(r);}
 const reference=()=>{const result=[],stats=new Map(rods.map(r=>[r.id,e1101Stats(r)])),current=e161Rod();for(const own of[true,false]){let pending=rods.filter(r=>!!state.owned[r.id]===own);while(pending.length){const front=pending.filter(r=>!pending.some(o=>o!==r&&e217Dominates(stats.get(o.id),stats.get(r.id))));front.sort((a,b)=>Number(b.id===current.id)-Number(a.id===current.id));result.push(...front);const ids=new Set(front.map(r=>r.id));pending=pending.filter(r=>!ids.has(r.id));}}return result.map(r=>r.id);};
 const expected=reference(),old=e217Dominates;let calls=0;e217Dominates=(a,b)=>{calls++;return old(a,b);};let actual;try{actual=e217Recommended(rods).map(r=>r.id);}finally{e217Dominates=old;}return{expected,actual,calls,n:rods.length};
 });assert.deepEqual(report.actual,report.expected);assert.ok(report.calls<=report.n*(report.n-1));
 await page.locator('#combatDock .e194DockRod').click();await page.evaluate(()=>{window.testRankCalls=0;window.testRankOriginal=e217Recommended;e217Recommended=function(r){window.testRankCalls++;return window.testRankOriginal(r);};});
 await page.locator('.e217RodTools input[type="search"]').fill('Ensayo 1');await page.locator('.e217RodTools input[type="search"]').fill('Ensayo 15');assert.equal(await page.evaluate(()=>window.testRankCalls),0);assert.ok(await page.locator('.e1120Menu').evaluate(n=>n.scrollHeight>n.clientHeight));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: Atlas keeps nodes, keyboard focus and scroll; native scrolling chains (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);await page.evaluate(()=>{document.getElementById('fishingAtlas').open=true;document.querySelector('.e181Journal').open=true;});
  const atlas=page.locator('#fishingAtlas');await atlas.scrollIntoViewIfNeeded();
  const before=await page.evaluate(()=>{const root=document.getElementById('fishingAtlas');window.e222OldRow=root.querySelector('[data-atlas-zone="costa"]');window.e222OldList=root.querySelector('.atlasRows');e222OldRow.focus({preventScroll:true});return{y:scrollY,top:e222OldList.scrollTop};});
  await page.keyboard.press('Enter');await page.waitForTimeout(100);
  const report=await page.evaluate(()=>({sameRow:e222OldRow===document.querySelector('[data-atlas-zone="costa"]'),sameList:e222OldList===document.querySelector('.atlasRows'),focused:document.activeElement===e222OldRow,y:scrollY,top:e222OldList.scrollTop,scrollbar:getComputedStyle(e222OldList).scrollbarWidth,overflow:getComputedStyle(e222OldList).overflowY,chain:getComputedStyle(e222OldList).overscrollBehaviorY}));
  assert.equal(report.sameRow,true);assert.equal(report.sameList,true);assert.equal(report.focused,true);assert.equal(report.scrollbar,'none');assert.equal(report.overflow,'auto');assert.equal(report.chain,'auto');closeTo(report.y,before.y,0);closeTo(report.top,before.top,0);
  await page.keyboard.press('Enter');await page.waitForTimeout(100);assert.equal(await page.locator('.atlasSelection').count(),0);assert.equal(await page.evaluate(()=>scrollY),before.y);
  await page.locator('[data-atlas-search]').fill('brumas');assert.equal(await page.locator('.atlasRow:visible').count(),1);await page.locator('[data-atlas-search]').fill('');
  await page.evaluate(()=>{const shop=document.getElementById('fishingRodShop');shop.open=true;shop.querySelectorAll('.rodTier').forEach(n=>n.open=true);});
  const list=page.locator('.rodTier[data-tier="inicio"] .rodRows');await list.evaluate(n=>{window.scrollTo(0,n.getBoundingClientRect().top+scrollY-120);n.scrollTop=0;});
  const box=await list.boundingBox();await page.mouse.move(box.x+box.width/2,250);await page.mouse.wheel(0,180);await page.waitForTimeout(200);assert.ok(await list.evaluate(n=>n.scrollTop)>0);
  await list.evaluate(n=>n.scrollTop=n.scrollHeight);await page.waitForTimeout(400);const y=await page.evaluate(()=>scrollY);await page.mouse.wheel(0,220);await page.waitForTimeout(250);await page.mouse.wheel(0,220);await page.waitForTimeout(250);assert.ok(await page.evaluate(()=>scrollY)>y,'Wheel continues into document at list end');
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: picker acquisition links, reversible ownership filter and live comparisons (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);await page.evaluate(()=>{state.owned.e16_rod=true;state.gold=0;e16Page();});
  await page.locator('#combatDock .e194DockRod').click();const mine=page.locator('[data-picker-mine]');await mine.check();assert.equal(await page.locator('.e1120Choice:visible').count(),2);
  await page.locator('.e1120Choice[data-rod-id="e16_rod"]').click();assert.equal(await page.locator('[data-picker-mine]').isChecked(),true);assert.equal(await page.evaluate(()=>e161Rod().id),'e16_rod');assert.equal(await page.locator('.e1120Choice.active').getAttribute('data-rod-id'),'e16_rod');
  await mine.uncheck();assert.equal(await page.locator('.e1120Choice:visible').count(),50);await page.locator('.e217RodTools input[type="search"]').fill('bambu');
  await page.getByRole('button',{name:'Ir a comprar: Bambú del Remanso',exact:true}).click();assert.equal(await page.locator('.e1120Menu').count(),0);
  const rod=page.locator('.rodShopRow[data-rod-id="e161_rod_bamboo"]');assert.equal(await rod.isVisible(),true);assert.equal(await rod.evaluate(n=>n.closest('.rodTier').open),true);assert.equal(await rod.locator('button').isDisabled(),true);assert.match(await rod.innerText(),/170 oro/);assert.equal(await page.evaluate(()=>!!state.owned.e161_rod_bamboo),false);
  await page.evaluate(()=>{e161Fishing=true;e161StopWait();});await page.locator('#combatDock .e194DockRod').click();await page.locator('.e217RodTools input[type="search"]').fill('Coralina');
  await page.getByRole('button',{name:'Ver encargo: Rama Coralina',exact:true}).click();const preview=page.locator('[data-quest-preview]');assert.equal(await preview.count(),1);assert.match(await preview.innerText(),/Coralina|coral/i);assert.match(await preview.innerText(),/32/);assert.equal(await page.evaluate(()=>e165Zone().id),'costa');assert.equal(await page.evaluate(()=>e161Fishing),true);assert.equal(await page.evaluate(()=>!!state.owned.e187_rod_coral),false);
  await page.evaluate(()=>{e210StopFishing();state.skills.pesca.xp=0;e16Page();});await page.locator('#combatDock .e194DockRod').click();await page.locator('.e217RodTools input[type="search"]').fill('Viejo');const locked=page.locator('.e1120Choice[data-rod-id="e17_rod_viejo"]');assert.equal(await locked.isDisabled(),true);assert.match(await locked.innerText(),/Bloqueada · Requiere Pesca 6/);assert.equal(await page.getByRole('button',{name:'Ver encargo: Caña del Viejo Pescador',exact:true}).isEnabled(),true);
 }finally{await context.close();}
});

test('Estable 23: difficulty reference matches existing species weights, stays independent of equipment and never reveals undiscovered fish',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,100,false);const report=await page.evaluate(()=>{
   const reference=e222DifficultyReference(),expected=new Map();
   for(const z of E165_ZONES){const pool=E16_FISH.filter(f=>z.fish.includes(f.id)&&f.req<=100),weights=pool.map(f=>(f.rarity?f.rarity:Math.max(.12,1/Math.pow(1+(100-f.req)/4,.4)/Math.pow(E161_DIFFICULTY[f.id]||1,2.3)))*(f.id==='atun'?.42:1)),sum=weights.reduce((a,b)=>a+b,0);pool.forEach((f,i)=>expected.set(f.id,Math.max(expected.get(f.id)||0,weights[i]/sum)));}
   const exact=[...expected].every(([id,p])=>reference.get(id).chance===p);state.ui.e18Fishing={total:6,bySpecies:{bagre:{total:1},salmon:{total:2},pez_fantasma:{total:3}}};e16Page();document.querySelector('.e181Journal').open=true;const order=()=>[...document.querySelectorAll('[data-journal-fish]')].map(n=>n.dataset.journalFish);const before=order();state.ui.fishingRodId='e16_rod';state.skills.pesca.xp=0;e16Page();document.querySelector('.e181Journal').open=true;return{exact,before,after:order(),sort:document.querySelector('[data-journal-sort]').value,keys:before.map(id=>reference.get(id).chance)};
  });assert.equal(report.exact,true);assert.equal(report.sort,'difficulty');assert.deepEqual(report.before,report.after);assert.deepEqual([...report.before].sort(),['bagre','pez_fantasma','salmon']);assert.deepEqual(report.keys,[...report.keys].sort((a,b)=>b-a));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: long Atlas scrolls with keyboard and touch, preserves internal offset on render and chains upward (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);
  // Large future catalogue exists only in this isolated browser context.
  await page.evaluate(()=>{for(let i=0;i<35;i++)E165_ZONES.push({id:'scroll_fixture_'+i,name:'Zona de prueba '+i,req:1,fish:['bagre'],desc:''});e16Page();document.getElementById('fishingAtlas').open=true;});
  const rows=page.locator('#fishingAtlas .atlasRows');await rows.evaluate(n=>{scrollTo(0,n.getBoundingClientRect().top+scrollY-110);n.focus({preventScroll:true});});
  await page.keyboard.press('PageDown');await page.waitForTimeout(300);assert.ok(await rows.evaluate(n=>n.scrollTop)>0);
  const offset=await rows.evaluate(n=>n.scrollTop);await page.evaluate(()=>e16Page());assert.equal(await rows.evaluate(n=>n.scrollTop),offset);
  await rows.evaluate(n=>n.scrollTop=0);await page.waitForTimeout(150);const rect=await rows.boundingBox(),x=rect.x+rect.width/2,y=rect.y+200;await page.mouse.move(x,y);const originalY=await page.evaluate(()=>scrollY);
  await page.mouse.wheel(0,-160);await page.waitForTimeout(250);await page.mouse.wheel(0,-160);await page.waitForTimeout(250);assert.ok(await page.evaluate(()=>scrollY)<originalY);
  await rows.evaluate(n=>{scrollTo(0,n.getBoundingClientRect().top+scrollY-110);n.scrollTop=0;});await page.waitForTimeout(150);
  const client=await context.newCDPSession(page),box=await rows.boundingBox(),tx=box.x+box.width/2,ty=box.y+260;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:tx,y:ty}]});
  for(let i=1;i<=5;i++){await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:tx,y:ty-i*28}]});await page.waitForTimeout(20);}
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(150);assert.ok(await rows.evaluate(n=>n.scrollTop)>0);await client.detach();
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: complete header cells align art, title, progress and arrow for every zone (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);
  const reports=await page.evaluate(()=>E165_ZONES.map(zone=>{state.ui.fishingZoneId=zone.id;e16Page();const selectors=['#fishingAtlas>summary','.e181Journal>summary','#fishingRodShop>summary','.e221BookHeader'];return selectors.map(selector=>{const head=document.querySelector(selector),art=head.querySelector('.e221Art'),words=head.querySelector('.e221HeaderWords'),a=art.getBoundingClientRect(),b=words.getBoundingClientRect(),h=head.getBoundingClientRect(),cs=getComputedStyle(art);return{selector,zone:zone.id,artWidth:a.width,artHeight:a.height,gap:b.left-a.right,within:a.left>=h.left&&a.right<=h.right&&a.top>=h.top&&a.bottom<=h.bottom,background:cs.backgroundSize,mask:cs.maskImage,progress:!!words.querySelector('small'),height:h.height};});}).flat());
  for(const r of reports){assert.equal(r.artWidth,40,JSON.stringify(r));assert.equal(r.artHeight,40);assert.ok(r.within,JSON.stringify(r));assert.ok(r.gap>=10,JSON.stringify(r));assert.equal(r.background,'300% 200%');assert.equal(r.mask,'none');assert.ok(r.progress);assert.ok(r.height<=46,JSON.stringify(r));}
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: all fish formats and rod silhouettes fit unchanged-height HUD; backdrop is cached (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);
  const report=await page.evaluate(()=>{
   const check=()=>{const dock=document.getElementById('combatDock'),panel=dock.querySelector('.e194DockRod'),art=panel.querySelector('.e194DockRodArt'),name=panel.querySelector('.e1123RodName'),a=art.getBoundingClientRect(),p=panel.getBoundingClientRect();return{height:dock.getBoundingClientRect().height,fixed:getComputedStyle(dock).position,artHeight:a.height,panelHeight:p.height,name:getComputedStyle(name).position,artWidth:a.width,panelWidth:p.width};};
   const fish=E16_FISH.map(f=>{state.ui.lastFishingCatch={id:f.id,weightKg:2,quality:'',xp:14,price:8};e188UpdateHud();const art=document.querySelector('#e188FishingHud .e189Art'),source=art.querySelector(':scope>img,:scope>svg'),backdrop=art.querySelector('.e223FishBackdrop');for(let i=0;i<3;i++)e188UpdateHud();return{id:f.id,source:!!source,fit:getComputedStyle(source).objectFit,ratio:source.tagName==='svg'?source.getAttribute('preserveAspectRatio'):null,stable:source===art.querySelector(':scope>img,:scope>svg'),backdropStable:backdrop===art.querySelector('.e223FishBackdrop'),count:art.querySelectorAll('.e223FishBackdrop').length,height:check().height};});
   for(const r of E161_RODS)state.owned[r.id]=true;const rods=e221Rods().map(r=>{state.owned[r.id]=true;state.ui.fishingRodId=r.id;e188UpdateHud();const art=document.querySelector('.e194DockRodArt>svg');return{id:r.id,ratio:art?.getAttribute('preserveAspectRatio'),view:art?.viewBox.baseVal.width,...check()};});return{fish,rods};
  });
  for(const f of report.fish){assert.equal(f.source,true,f.id);assert.equal(f.fit,'contain',f.id);if(f.ratio)assert.equal(f.ratio,'xMidYMid meet');assert.equal(f.height,118);assert.ok(f.stable&&f.backdropStable,f.id);assert.ok(f.count<=1);}
  for(const r of report.rods){assert.equal(r.height,118,r.id);assert.equal(r.fixed,'fixed');assert.equal(r.ratio,'xMidYMid meet');assert.equal(r.name,'absolute');assert.equal(r.panelHeight-r.artHeight,2);assert.equal(r.panelWidth-r.artWidth,2);assert.ok(r.view>0);}
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 23: art proposal runs separately with production HUD CSS and no save access (${width}px)`,async()=>{
 const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto(url+'/arte/muestras.html');assert.equal(await page.locator('.sample').count(),6);await page.waitForFunction(()=>document.querySelector('#sampleFish svg'));
  const geometry=()=>page.locator('#muestraHud').evaluate(n=>({height:n.getBoundingClientRect().height,width:n.getBoundingClientRect().width}));const before=await geometry();assert.equal(before.height,118);
  for(const value of ['bagre','calamar_abismo','mantarraya']){await page.selectOption('#fishSelect',value);assert.equal(await page.locator('#sampleFish svg').getAttribute('preserveAspectRatio'),'xMidYMid meet');assert.deepEqual(await geometry(),before);}
  for(const value of ['e161_rod_bamboo','e187_rod_coral','e208_rod_fosa_pulso']){await page.selectOption('#rodSelect',value);assert.equal(await page.locator('#sampleRod svg').getAttribute('preserveAspectRatio'),'xMidYMid meet');assert.deepEqual(await geometry(),before);}
  assert.equal(await page.evaluate(()=>localStorage.length),0);assert.equal(await page.evaluate(()=>typeof state),'undefined');assert.equal(await page.locator('image').getAttribute('href'),'muestra-conceptual-estable23.png');
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 24: hidden native scrollbars keep zone and shop scrolling (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);assert.equal(await page.locator('[data-rod-shop-open]').count(),0);
  await page.locator('#combatDock .e1118Zone').click();
  const menu=page.locator('.e1120Menu[data-type="zone"]');assert.deepEqual(await menu.evaluate(n=>({bar:getComputedStyle(n).scrollbarWidth,overflow:getComputedStyle(n).overflowY,chain:getComputedStyle(n).overscrollBehaviorY})),{bar:'none',overflow:'auto',chain:'auto'});
  const b=await menu.boundingBox();await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.wheel(0,200);await page.waitForTimeout(200);assert.ok(await menu.evaluate(n=>n.scrollTop)>0);
  await page.keyboard.press('Escape');await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.locator('.rodTier[data-tier="inicio"]').evaluate(n=>n.open=true);
  assert.equal(await page.locator('.rodRows').first().evaluate(n=>getComputedStyle(n).scrollbarWidth),'none');assert.equal(await page.locator('.rodRows').first().evaluate(n=>getComputedStyle(n).overscrollBehaviorY),'auto');
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 24: a live absolute record stays beside the last catch until another successful catch (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  page.on('dialog',d=>d.accept());await character(page,40,false);await page.evaluate(()=>{state.ui.fishingWeights={bySpecies:{salmon:{catches:1,bestKg:5,categoryBestKg:{normal:5}}},byZone:{}};});
  const height=()=>page.locator('#combatDock').evaluate(n=>n.getBoundingClientRect().height);assert.equal(await height(),118);
  await page.evaluate(()=>{e161Fishing=true;e195OriginalStart('salmon');cancelAnimationFrame(e16Frame);e16Session.weightKg=6;e16Finish(true);e161StopWait();e161Fishing=false;});
  const notice=page.locator('.e225LastRecord');await notice.waitFor();assert.equal(await notice.innerText(),'Nuevo récord');assert.equal(await height(),118);assert.equal(await page.evaluate(()=>e218Record('salmon').best),6);
  assert.equal(await page.locator('.e224RecordNotice').count(),0);assert.equal(await page.evaluate(()=>state.ui.lastFishingCatch.newAbsoluteRecord),true);
  await page.waitForTimeout(2200);assert.equal(await notice.count(),1);await page.evaluate(()=>persist());await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.equal(await notice.count(),1);await page.evaluate(async()=>{await importJSON(new File([JSON.stringify(makeRosterRecord())],'record.json'));await changeRoster('select',roster.characters[0].id);selectWorkspaceTab('fishing');});await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.equal(await notice.count(),1);await page.evaluate(()=>{e161Fishing=true;e195OriginalStart('salmon');cancelAnimationFrame(e16Frame);e16Session.weightKg=10;e16Finish(false);e161StopWait();e161Fishing=false;});assert.equal(await notice.count(),1);
  for(const [won,weight] of [[true,6],[true,4],[false,10]]){await page.evaluate(({won,weight})=>{e161Fishing=true;e195OriginalStart('salmon');cancelAnimationFrame(e16Frame);e16Session.weightKg=weight;e16Finish(won);e161StopWait();e161Fishing=false;},{won,weight});assert.equal(await notice.count(),0);}
  await page.evaluate(()=>persist());await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);assert.equal(await notice.count(),0);assert.equal(await page.evaluate(()=>e218Record('salmon').best),6);assert.equal(await height(),118);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 25: compact fish captions and persistent record preserve fixed HUD (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);await page.evaluate(()=>{state.ui.fishingZoneId='muelle';state.ui.e18Fishing={total:3,bySpecies:{mojarra:{total:1,best:'normal'},bagre:{total:1,best:'normal'},trucha:{total:1,best:'normal'}}};state.ui.lastFishingCatch={id:'trucha',weightKg:2.24,xp:35,price:23,newAbsoluteRecord:true};e16Page();document.querySelector('.e186Book').open=true;document.querySelector('.e181Journal').open=true;});
  const report=await page.evaluate(()=>{const box=q=>document.querySelector(q).getBoundingClientRect(),label=document.querySelector('.e225CaptureLabel'),badge=document.querySelector('.e225LastRecord');return{height:box('#combatDock').height,zone:box('.e1118Zone').height,rod:box('.e194DockRod').height,badgeRight:box('.e225LastRecord').left>=box('.e225CaptureLabel').right,labelFits:label.scrollWidth<=label.clientWidth,badgeSize:parseFloat(getComputedStyle(badge).fontSize),titleSize:parseFloat(getComputedStyle(label).fontSize),cards:[...document.querySelectorAll('.e186Fish')].map(c=>{const a=c.querySelector('.e192Sprite').getBoundingClientRect();return{art:a.width,card:c.clientWidth,small:c.querySelectorAll('small').length,name:parseFloat(getComputedStyle(c.querySelector('strong')).fontSize)};}),journal:[...document.querySelectorAll('.e218Card')].map(c=>({lines:c.querySelectorAll('.e225JournalMeta small').length,title:c.title,art:c.querySelector('.e218Art').getBoundingClientRect().height,all:c.getBoundingClientRect().height}))};});
  assert.equal(report.height,118);assert.equal(report.zone,report.rod);assert.ok(report.badgeRight&&report.labelFits);assert.ok(report.badgeSize<=report.titleSize);
  for(const c of report.cards){assert.ok(c.art>=c.card-14);assert.equal(c.small,0);assert.ok(c.name<=11);}
  for(const c of report.journal){assert.equal(c.lines,2);assert.match(c.title,/Récord absoluto/);assert.ok(c.art>c.all*.55);}
  await page.locator('[data-journal-fish="trucha"]').click();assert.equal(await page.locator('.e218Detail').count(),1);assert.match(await page.locator('.e218Detail').innerText(),/Récord absoluto/);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 26: styleable zone picker, boundary chaining and exact HUD geometry (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,100,false);
  const height=()=>page.locator('#combatDock').evaluate(n=>n.getBoundingClientRect().height);
  assert.equal(await height(),118);
  await page.locator('#combatDock .e1118Zone').click();
  const menu=page.locator('.e1120Menu');
  assert.equal(await menu.evaluate(n=>getComputedStyle(n).scrollbarWidth),'none');
  if(width===1366){require('node:fs').mkdirSync(join(__dirname,'../arte/verificacion/estable32/regresiones/regresiones'),{recursive:true});await page.screenshot({path:join(__dirname,'../arte/verificacion/estable32/regresiones/regresiones/zonas-desktop.png')});}
  await page.keyboard.press('Escape');
  await page.locator('#fishingRodShop').evaluate(n=>{n.open=true;n.querySelectorAll('.rodTier').forEach(n=>n.open=true)});
  const filter=page.locator('[data-rod-zone]');await filter.scrollIntoViewIfNeeded();await filter.click();
  assert.equal(await filter.evaluate(n=>getComputedStyle(n).appearance),'base-select');
  assert.deepEqual(await filter.evaluate(n=>({bar:getComputedStyle(n,'::picker(select)').scrollbarWidth,chain:getComputedStyle(n,'::picker(select)').overscrollBehaviorY})),{bar:'none',chain:'auto'});
  if(width===1366)await page.screenshot({path:join(__dirname,'../arte/verificacion/estable32/regresiones/regresiones/filtro-desktop.png')});
  await page.keyboard.press('End');await page.keyboard.press('Enter');
  assert.equal(await filter.inputValue(),await page.evaluate(()=>E165_ZONES.at(-1).id));
  assert.match(await page.locator('[data-rod-results]').innerText(),/cañas/);
  await page.keyboard.press('Escape');await filter.selectOption('all');
  const rows=page.locator('.rodRows').first();await rows.scrollIntoViewIfNeeded();await rows.evaluate(n=>n.scrollTop=n.scrollHeight);
  const before=await page.evaluate(()=>scrollY),rect=await rows.boundingBox();await page.mouse.move(rect.x+rect.width/2,rect.y+Math.min(rect.height/2,100));await page.waitForTimeout(120);await page.mouse.wheel(0,400);await page.waitForTimeout(350);await page.mouse.wheel(0,400);await page.waitForTimeout(350);
  assert.ok(await page.evaluate(()=>scrollY)>before,JSON.stringify(await rows.evaluate(n=>({scroll:scrollY,height:document.documentElement.scrollHeight,rect:n.getBoundingClientRect().toJSON(),top:n.scrollTop,max:n.scrollHeight-n.clientHeight,ancestors:(()=>{let a=n,out=[];while(a){out.push([a.tagName,a.className,getComputedStyle(a).overflowY,getComputedStyle(a).overscrollBehaviorY]);a=a.parentElement;}return out;})()})))+' Scroll continues to document at internal boundary');
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollbarWidth),'auto');
  assert.equal(await height(),118);
 }finally{await context.close();}
});
