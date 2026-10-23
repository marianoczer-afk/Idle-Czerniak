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
 server=createServer((req,res)=>{if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);});
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
   assert.equal(await page.locator('#e188FishingHud .e189Art img,#e188FishingHud .e189Art svg:not(.fishMysteryArt)').count(),0);
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
  const art=page.locator('#e188FishingHud .e189Art img');await art.waitFor();
  await page.waitForFunction(()=>document.querySelector('#e188FishingHud .e189Art img')?.naturalWidth>0);
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
  await character(page);await page.locator('[data-rod-shop-open]').click();
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
  assert.equal(report.scenarios,60);assert.equal(report.draws,1160000);assert.equal(report.emptyScenarios,2);
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
   return {inventory:copyJSON(state.inventory),record:copyJSON(e18Record()),qualities};
  });
  assert.deepEqual(actual.inventory,{pez_atun__large:1,pez_atun:3,pez_atun__huge:1,pez_atun__legendary:1});
  assert.deepEqual(actual.qualities,['Grande','normal','Enorme','normal','Legendario','normal']);
  assert.equal(actual.record.total,6);assert.equal(actual.record.bySpecies.atun.best,'legendary');
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
  assert.match(cards[0].text,/Trucha arcoíris/);assert.match(cards[1].text,/Perca esmeralda/);assert.match(cards[2].text,/Especie sin descubrir/);
  await page.evaluate(()=>e16Page());
  assert.equal(await page.locator('.e186Book').evaluate(n=>n.open),true);
  await page.locator('[data-rod-shop-open]').click();
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
  await page.locator('.hybridSidebarBody details[data-ui-panel="save"]').evaluate(n=>n.open=true);
  const pending=page.waitForEvent('download');await page.locator('.hybridSidebarBody [data-act="downloadHtml"]').click();
  const download=await pending;assert.equal(download.suggestedFilename(),'index.html');
  const html=readFileSync(await download.path(),'utf8');
  assert.match(html,/data-rod-shop-open/);
  assert.match(html,/<meta name="argentum-build" content="estable-13">/);
  assert.match(html,/<h1>Argentum Idle Online · Estable 13<\/h1>/);
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
  await exported.locator('[data-rod-shop-open]').click();
  assert.equal(await exported.locator('#page_shop #fishingRodShop').isVisible(),true);
  assert.equal(await exported.locator('.rodShopRow').count(),50);
  assert.equal(await exported.locator('#argentum-art-library symbol').count(),16);
 }finally{await downloadedContext?.close();await context.close();if(directory)rmSync(directory,{recursive:true,force:true});}
});

for(const width of [1366,390])test(`Estable 13: empty last-catch panel and rods purchasable from Fishing (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,33);
  await page.evaluate(()=>{
   for(const id of ['e17_rod_viejo','e171_rod_rio','e171_rod_costa'])state.owned[id]=true;
   state.ui.fishingRodId='e171_rod_costa';state.ui.fishingZoneId='laguna';e16Page();
  });
  assert.match(await page.locator('header h1').innerText(),/Estable 13/);
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

for(const width of [1366,390])test(`Estable 13: larger rod art, provenance, stars and explicit quest rewards (${width}px)`,async()=>{
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
  await page.locator('.e171QuestGroup').evaluate(n=>n.open=true);
  const reward=page.locator('[data-quest-id="laguna"]');
  assert.match(await reward.innerText(),/Instinto de pescador.*\+5%.*XP/);
  assert.match(await reward.innerText(),/automáticamente/);
  await page.locator('#hybridSidebar').evaluate(n=>n.open=true);
  assert.match(await page.locator('.e197FishingSkills').innerText(),/Instinto de pescador.*\+5%/);
  assert.equal(await page.evaluate(()=>!!state.owned.e187_rod_coral),false,'XP reward does not invent a rod');
  // Existing rod and control rewards report their actual effect as well.
  for(const [zone,pattern] of [['arrecife',/Caña Coralina.*11,5%/],['abismo',/8 px.*control permanente/]]){
   await page.evaluate(zone=>{state.skills.pesca.xp=18490;state.ui.fishingZoneId=zone;state.ui.e187Rewards[zone]=true;if(zone==='arrecife')state.owned.e187_rod_coral=true;e16Page();document.querySelector('.e171QuestGroup').open=true;},zone);
   assert.match(await page.locator(`[data-quest-id="${zone}"]`).innerText(),pattern);
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
  assert.equal(result.count,41);assert.equal(result.samples,14760);assert.equal(result.allReachable,true);
  assert.ok(result.caps.every(n=>n>0));
  for(const row of result.widths){assert.ok(row.steel>row.basic);closeTo(row.steel-row.basic,row.width*.08,.001);}
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
  assert.ok(result.b.target-200<result.a.target-200);assert.ok(result.b.turnAt>result.a.turnAt);assert.ok(result.b.burstAt>result.a.burstAt);
  assert.equal(result.a.vel,result.b.vel);assert.equal(result.a.pos,result.b.pos);
  await page.evaluate(()=>{state.owned.e161_rod_bamboo=true;state.ui.fishingRodId='e161_rod_bamboo';state.ui.fishingZoneId='rio';e16Page();e161Fishing=true;e16Start('lucio');});
  await page.waitForSelector('.e196Bubble');
  while(await page.locator('.e196Bubble').count())await page.locator('.e196Bubble').click();
  assert.deepEqual(await page.evaluate(()=>e16Session.motion),{distance:1-.28*.65,interval:1+.28*1.5});
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
   e16Page();document.querySelector('.e194QuestFold').open=true;await persist();
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
  assert.match(await page.locator('.e165ZoneInfo').innerText(),/0\/1.*Equipá una caña de mayor capacidad/);
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
     const g={fish:{...fish,zone},controlFraction:zone/width,controlExtra:0,motion:e190MotionProfile(fish,rod),pos:width/2-zone/2,vel:0,target:width/2-12,dir:1,turnAt:.35,seed:random()*6,time:0,progress:.23,burst:0,burstAt:.5};
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
  assert.ok(result.basic.wins<30);assert.ok(result.brumas.wins>result.basic.wins+10);
  assert.ok(result.brumas.wins>=25,'Brumas must support sustained tracking instead of making reef captures impossible');
  assert.ok(result.mythical.wins<35);
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
  const buy=page.locator('[data-rod-id="e208_rod_celeste_pulso"] button');assert.equal(await buy.isEnabled(),true);
  const beforeGold=await page.evaluate(()=>state.gold);await buy.click();
  assert.equal(await page.evaluate(()=>e161Rod().id),'e208_rod_celeste_pulso');
  assert.equal(await page.evaluate(()=>state.gold),beforeGold-420000);
  const rodId='e208_rod_custodio_pulso';
  assert.equal(await page.locator(`[data-rod-id="${rodId}"] button`).innerText(),'Ver encargo');
  assert.equal(await page.evaluate(()=>{
   const index=E161_RODS.findIndex(r=>r.id==='e208_rod_custodio_pulso'),button=document.createElement('button');button.dataset.e161Buy=index;document.body.append(button);button.click();button.remove();return !!state.owned.e208_rod_custodio_pulso;
  }),false);
  const expected=await page.evaluate(()=>{
   const rod=E208_CATALOG.find(r=>r.id==='e208_rod_custodio_pulso'),q=rod.unlock;
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
  const assets=await page.evaluate(()=>({rods:document.querySelectorAll('#argentum-art-library symbol[id^="argentum-rod-"]').length,fish:document.querySelectorAll('#argentum-art-library symbol[id^="argentum-fish-"]').length,embedded:[...document.querySelectorAll('#argentum-art-library image')].every(n=>n.getAttribute('href').startsWith('data:image/png;base64,'))}));
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
  assert.equal(await page.locator('.e171QuestGroup').count(),1);
  assert.match(await page.locator('.e171QuestGroup>summary').innerText(),/Encargos completados \(25\)/);
  await page.locator('.e171QuestGroup').evaluate(n=>n.open=true);
  assert.equal(await page.locator('.e209CompletedQuest').count(),25);
  assert.equal(await page.locator('.e194QuestFold').count(),0);
  assert.match(await page.locator('.e171QuestGroup [data-quest-id="laguna"]').innerText(),/naturalista.*Laguna Esmeralda.*5%.*permanente activa/is);
  assert.match(await page.locator('.e171QuestGroup [data-quest-id="arrecife"]').innerText(),/secreto del arrecife.*Caña Coralina/is);
  assert.match(await page.locator('.e171QuestGroup [data-quest-id="abismo"]').innerText(),/8 px.*permanente activa/is);
  for(const zone of ['muelle','arrecife','abismo','santuario']){
   await page.evaluate(zone=>{state.ui.fishingZoneId=zone;e16Page();},zone);
   assert.equal(await page.locator('.e209CompletedQuest').count(),25);
   assert.equal(await page.locator('.e171QuestGroup').evaluate(n=>n.open),true);
   assert.equal(await page.locator('[data-quest-id="arrecife"]').count(),1);
  }
  assert.deepEqual(await page.evaluate(()=>({owned:JSON.stringify(state.owned),inventory:JSON.stringify(state.inventory),gold:state.gold,xp:state.skills.pesca.xp,rewards:JSON.stringify(state.ui.e187Rewards)})),before);
 }finally{await context.close();}
});

test('Claiming Coralina moves the quest to Completed exactly once and retains the rod after reload',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);
  await page.evaluate(()=>{state.ui.fishingZoneId='arrecife';state.inventory.pez_pez_luna=4;state.inventory.pez_caballito_mar=3;e16Page();document.querySelector('.e194QuestFold').open=true;});
  await page.locator('[data-e187-claim="arrecife"]').click();
  assert.equal(await page.locator('[data-e187-claim="arrecife"]').count(),0);
  assert.equal(await page.locator('.e171QuestGroup [data-quest-id="arrecife"]').count(),1);
  const snapshot=await page.evaluate(()=>({gold:state.gold,xp:state.skills.pesca.xp,inventory:JSON.stringify(state.inventory),owned:JSON.stringify(state.owned),rewards:JSON.stringify(state.ui.e187Rewards)}));
  assert.equal(await page.evaluate(()=>state.owned[E187_ROD.id]&&e187Rewards().arrecife),true);
  assert.equal(await page.evaluate(()=>e161Rod().id),'e187_rod_coral');
  await page.evaluate(async()=>{const b=document.createElement('button');b.dataset.e187Claim='arrecife';document.body.append(b);b.click();b.remove();await persist();});
  assert.deepEqual(await page.evaluate(()=>({gold:state.gold,xp:state.skills.pesca.xp,inventory:JSON.stringify(state.inventory),owned:JSON.stringify(state.owned),rewards:JSON.stringify(state.ui.e187Rewards)})),snapshot);
  await page.reload();await page.waitForFunction(()=>storageReady&&ready&&!busy);await page.evaluate(()=>selectWorkspaceTab('fishing'));
  assert.equal(await page.locator('.e171QuestGroup [data-quest-id="arrecife"]').count(),1);
  assert.equal(await page.evaluate(()=>!!state.owned.e187_rod_coral),true);
 }finally{await context.close();}
});

test('Legacy Coralina ownership is recognized without inventing perk flags or consuming another delivery',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40);
  const expected=await page.evaluate(()=>{state.owned.e187_rod_coral=true;state.ui.e187Rewards={};state.ui.fishingZoneId='arrecife';state.inventory.pez_pez_luna=4;state.inventory.pez_caballito_mar=3;e16Page();return JSON.stringify(state.inventory);});
  assert.equal(await page.locator('.e171QuestGroup [data-quest-id="arrecife"]').count(),1);
  assert.equal(await page.locator('[data-e187-claim="arrecife"]').count(),0);
  await page.evaluate(()=>{const b=document.createElement('button');b.dataset.e187Claim='arrecife';document.body.append(b);b.click();b.remove();});
  assert.equal(await page.evaluate(()=>JSON.stringify(state.inventory)),expected);
  assert.deepEqual(await page.evaluate(()=>state.ui.e187Rewards),{});
  assert.deepEqual(await page.evaluate(()=>e209CompletedQuests().map(q=>q.id)),['arrecife']);
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 13: collapsed catalog follows missions, requirements are visible and capture control is large (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);
  assert.equal(await page.locator('#fishingRodShop').evaluate(n=>n.open),false);
  assert.equal(await page.locator('.rodTier[open]').count(),0);
  assert.equal(await page.evaluate(()=>!!(document.querySelector('.e171Quests').compareDocumentPosition(document.getElementById('fishingRodShop'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.locator('.rodTier[data-tier="medio"]').evaluate(n=>n.open=true);
  const requirement=await page.locator('[data-rod-id="e187_rod_coral"] .rodShopInfo small').innerText();
  assert.match(requirement,/Arrecife de Coral.*Pesca 32.*Pez luna 0\/4.*Caballito de mar 0\/3/);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';e16Page();document.querySelector('.e194QuestFold').open=true;});
  assert.equal(await page.locator('.e194QuestBody [data-catalog-claim]').count(),6);
  const quest=page.locator('.e194QuestBody [data-quest-id="e208_rod_custodio_pulso"]');
  assert.match(await quest.innerText(),/12 peces en total.*0 de 12.*2 especies distintas.*0 de 2.*récord/is);
  await page.evaluate(()=>{state.ui.fishingZoneId='costa';e16Page();e161Fishing=true;e195OriginalStart('atun');cancelAnimationFrame(e16Frame);});
  const geometry=await page.locator('#e16Hold').evaluate(n=>{const b=n.getBoundingClientRect(),p=document.getElementById('e16GamePanel').getBoundingClientRect();return{width:b.width,height:b.height,stageWidth:p.width,bottom:b.bottom,stageBottom:p.bottom};});
  assert.ok(geometry.width>=geometry.stageWidth*.90,JSON.stringify(geometry));assert.ok(geometry.height>=72);assert.ok(geometry.bottom<=geometry.stageBottom);
  assert.doesNotMatch(await page.locator('#e16GamePanel').innerText(),/Mouse|táctil|espacio/);
 }finally{await context.close();}
});

test('Estable 13: new challenge is claimable in its zone; owned rods lead both the catalog and HUD selector',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.locator('.rodTier[data-tier="inicio"]').evaluate(n=>n.open=true);
  await page.locator('[data-rod-id="e208_rod_custodio_pulso"] button').click();
  assert.equal(await page.evaluate(()=>e165Zone().id),'rio');assert.equal(await page.locator('.e194QuestFold').evaluate(n=>n.open),true);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';state.ui.fishingWeights={byZone:{rio:{catches:12,bestKg:2,species:{bagre:6,trucha:6}}}};e16Page();document.querySelector('.e194QuestFold').open=true;});
  await page.locator('.e194QuestBody [data-catalog-claim="e208_rod_custodio_pulso"]').click();
  assert.equal(await page.evaluate(()=>!!state.owned.e208_rod_custodio_pulso),true);
  assert.equal(await page.locator('.e194QuestBody [data-catalog-claim="e208_rod_custodio_pulso"]').count(),0);
  assert.equal(await page.locator('.e171QuestGroup [data-quest-id="e208_rod_custodio_pulso"]').count(),1);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);
  assert.equal(await page.locator('.rodTier[data-tier="inicio"] .rodShopRow').first().getAttribute('data-rod-id'),'e208_rod_custodio_pulso');
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

test('Estable 13: sidebar scrolls independently and switching character stays accessible',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  const side=page.locator('#hybridSidebar');await side.evaluate(n=>{n.open=true;n.querySelectorAll('details').forEach(d=>d.open=true);n.scrollTop=0;});
  const box=await side.boundingBox(),before=await page.evaluate(()=>scrollY);
  await page.mouse.move(box.x+box.width/2,box.y+150);await page.mouse.wheel(0,800);
  await page.waitForFunction(()=>document.getElementById('hybridSidebar').scrollTop>0);
  assert.equal(await page.evaluate(()=>scrollY),before);
  const quick=page.locator('.sidebarQuickActions [data-act="switchCharacter"]');
  assert.equal(await quick.isVisible(),true);
  const button=await quick.boundingBox();assert.ok(button.y>=box.y&&button.y<box.y+70);
  await page.evaluate(()=>{e161Fishing=true;e195OriginalStart('atun');});
  await quick.click();await page.waitForFunction(()=>!roster.activeId&&!busy&&document.getElementById('characterScreen')&&!document.getElementById('characterScreen').classList.contains('hidden'));
  assert.equal(await page.locator('#characterScreen').isVisible(),true);
  assert.equal(await page.evaluate(()=>roster.characters.length),1);
  assert.deepEqual(await page.evaluate(()=>({session:!!e16Session,pending:!!e195Pending,fishing:e161Fishing})),{session:false,pending:false,fishing:false});
 }finally{await context.close();}
});

test('Estable 13: finish renders and saves once; escape never awards a fish',async()=>{
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

test('Estable 13: last catch stays through attempts, loss, time and reload without duplicating rewards',async()=>{
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
  assert.match(await page.locator('#e188HudPercent').innerText(),new RegExp('\\+'+report.last.xp+' XP.*'+report.last.price+' oro al vender'));
 }finally{await context.close();}
});

for(const width of [1366,390])test(`Estable 13: sidebar headings hidden and compact HUD preserves XP view and uncropped rod (${width}px)`,async()=>{
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
  assert.ok(frame.art>=frame.parent-3,JSON.stringify(frame));closeTo(frame.svg,frame.art,.5);assert.equal(frame.mode,'xMidYMid meet');assert.ok(frame.dock<=120,JSON.stringify(frame));assert.ok(frame.nameBottom<=frame.artTop+1);assert.equal(frame.background,'none');
  assert.equal(await page.locator('#combatDock .e1118Zone').isVisible(),true);
  await page.locator('#combatDock .e1118Zone').click();assert.equal(await page.locator('.e1120Menu[data-type="zone"]').isVisible(),true);await page.keyboard.press('Escape');
  await page.evaluate(()=>e190ReturnToFishing());
  const xp=await page.locator('#page_fishing .e163Skill').boundingBox(),dock=await page.locator('#combatDock').boundingBox();assert.ok(xp.y>=0&&xp.y+xp.height<dock.y,JSON.stringify({xp,dock}));
  await page.setViewportSize({width,height:width>700?635:720});await page.evaluate(()=>e190ReturnToFishing());
  const small=await page.locator('#page_fishing .e163Skill').boundingBox(),bottom=await page.locator('#combatDock').boundingBox();assert.ok(small.y>=0&&small.y+small.height<bottom.y,JSON.stringify({small,bottom}));
 }finally{await context.close();}
});


test('Estable 13: curated offers remove close variants and preserve retired owned rods after reload',async()=>{
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

test('Estable 13: quest goals explain all conditions and mark each completed objective',async()=>{
 const {context,page}=await fresh();
 try{
  await character(page,40,false);
  await page.evaluate(()=>{state.ui.fishingZoneId='rio';state.ui.fishingWeights={byZone:{rio:{catches:3,species:{mojarra:2,lubina:1},bestKg:7.35}}};e16Page();document.querySelector('.e194QuestFold').open=true;});
  const quest=page.locator('.e194QuestBody [data-quest-id="e208_rod_custodio_pulso"]');
  assert.match(await quest.innerText(),/tres objetivos en Río del Bosque/);assert.match(await quest.innerText(),/Capturá 12 peces en total/);assert.match(await quest.innerText(),/Capturá 2 especies distintas/);assert.match(await quest.innerText(),/Capturá un pez de 2 kg o más/);assert.match(await quest.innerText(),/No se consumen peces/);
  assert.equal(await quest.locator('.e212Goals li').count(),3);assert.equal(await quest.locator('.e212Goals .done').count(),2);assert.equal(await quest.locator('button').isDisabled(),true);
  await page.evaluate(()=>{state.ui.fishingWeights.byZone.rio.catches=12;e16Page();});assert.equal(await quest.locator('.e212Goals .done').count(),3);assert.equal(await quest.locator('button').isEnabled(),true);
 }finally{await context.close();}
});


for(const width of [1366,390])test(`Estable 13: restored zone and rod shortcuts work within the compact HUD (${width}px)`,async()=>{
 const {context,page}=await fresh(width);
 try{
  await character(page,40,false);
  await page.locator('#combatDock .e1118Zone').click();
  await page.locator('.e1120Choice').filter({hasText:'Río del Bosque'}).click();
  assert.equal(await page.evaluate(()=>state.ui.fishingZoneId),'rio');
  assert.match(await page.locator('#combatDock .e1118Zone small').innerText(),/Río del Bosque/);
  const image=page.locator('#combatDock .e1118Zone img');assert.equal(await image.isVisible(),true);assert.ok((await image.getAttribute('src')).startsWith('data:image/'));
  await page.evaluate(()=>{state.owned.e161_rod_bamboo=true;});
  await page.locator('#combatDock .e194DockRod').click();await page.locator('.e1120Choice').filter({hasText:'Caña de bambú'}).click();
  assert.equal(await page.evaluate(()=>e161Rod().id),'e161_rod_bamboo');
  assert.match(await page.locator('#combatDock .e1123RodName').innerText(),/bambú/);
  assert.equal(await page.locator('.e1120Menu').count(),0);
  assert.equal(await page.locator('#page_fishing #e16GamePanel').isVisible(),true);
 }finally{await context.close();}
});
