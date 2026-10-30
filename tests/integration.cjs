require('fs').mkdirSync('test-results',{recursive:true});
const fs=require('fs'),http=require('http');
const {chromium}=require('playwright');
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync('index.html'));});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const checks=[],errors=[];function check(name,ok){checks.push({name,ok});if(!ok)throw Error(name);}
 try{
  browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});const context=await browser.newContext({viewport:{width:1366,height:950}}),page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForTimeout(700);
  await page.evaluate(async()=>{draft={name:'Prueba unificada',race:'humano',cls:'guerrero'};await changeRoster('create');});
  check('Cuatro pestañas visibles, sin solapas antiguas',await page.locator('[data-ui-tab]:visible').count()===4);
  check('Personaje entra en pesca',await page.evaluate(()=>state.ui.tab==='fishing'));
  await page.waitForTimeout(1000);
  check('Burbuja disponible sin Tirar la caña',await page.locator('.e196Bubble:visible').count()===1&&await page.locator('[data-e161-toggle]:visible').count()===0);
  check('Instrucción de burbuja con contraste y negrita',await page.locator('.e196Header').evaluate(n=>Number(getComputedStyle(n).fontWeight)>=800));
  const sale=await page.evaluate(()=>{
   e195Reset();e161StopWait();state.skills.pesca.xp=10*34**2;state.gold=50000;state.ui.fishingZoneId='arrecife';state.ui.fishingRodId='e16_rod';e16Page();e161Fishing=true;e195OriginalStart('morena');const before=state.gold;e16Finish(true);return{before,after:state.gold,price:state.ui.lastFishingCatch.saleGold,stock:e188FishStock('morena'),credits:state.ui.fishingDeliveryCredits.morena,remaining:Object.entries(state.inventory).filter(([id])=>id.startsWith('pez_morena')).length};
  });
  check('Venta automática concede exactamente el oro de la captura',sale.after-sale.before===sale.price&&sale.price>0);
  check('Pez vendido deja comprobante y no un pez revendible',sale.stock===1&&sale.credits===1&&sale.remaining===0);
  check('Comprobante se consume una sola vez',await page.evaluate(()=>e188Consume([{id:'morena',qty:1}])&&!e188Consume([{id:'morena',qty:1}])&&e188FishStock('morena')===0));
  const temple=await page.evaluate(()=>{const fish=E16_FISH.find(f=>f.id==='morena'),simple=e221Rods().find(r=>r.id==='e16_rod'),good=e221Rods().find(r=>r.id==='e208_rod_coral_pulso');return{simple:e239Temple(simple),good:e239Temple(good),lossSimple:e232CaptureProfile(fish,simple,35,12).loss,lossGood:e232CaptureProfile(fish,good,35,12).loss};});
  check('Caña sencilla penaliza más que caña de coral',temple.simple<temple.good&&temple.lossSimple>temple.lossGood*1.4);
  await page.evaluate(()=>selectWorkspaceTab('souls_train'));
  await page.waitForFunction(()=>!!document.getElementById('soulsFrame39')?.contentWindow?.UnifiedSouls,{timeout:15000});
  const frame=page.frames().find(f=>f.parentFrame());frame.on('pageerror',e=>errors.push(String(e)));
  check('Cinco entrenamientos originales disponibles',await frame.locator('[data-mode]').count()===5);
  check('Skills empiezan con el modelo de Souls',await frame.evaluate(()=>window.UnifiedSouls.state.stats.str===0&&window.UnifiedSouls.state.room===1));
  await frame.locator('[data-mode="str"]').click();
  const gain=await frame.evaluate(()=>{const app=window.UnifiedSouls,before=app.state.xp.str,coins=app.state.coins;app.training.engine.good(true,350,350);return{before,after:app.state.xp.str,coinsBefore:coins,coinsAfter:app.state.coins};});
  check('Acierto de entrenamiento concede XP real',gain.after>gain.before);
  check('XP de entrenamiento vive en el guardado del personaje',await page.evaluate(()=>state.ui.souls.xp.str>0));
  await page.evaluate(()=>selectWorkspaceTab('souls_shop'));
  const buy=await frame.evaluate(()=>{const app=window.UnifiedSouls;return{gold:app.state.coins,gear:app.state.gear.sword};});
  await frame.locator('[data-buy="sword"]').click();
  check('Compra usa el mismo oro y equipa la mejora',await page.evaluate(({gold,gear})=>state.gold<gold&&state.ui.souls.gear.sword===gear+1,buy));
  await page.evaluate(()=>selectWorkspaceTab('souls_arena'));
  check('Selector ×3 disponible',await frame.locator('[data-speed="3"]').count()===1);
  await frame.locator('[data-speed="3"]').click();await frame.locator('#fightStart').click();
  check('×3 modifica la simulación',await frame.evaluate(()=>window.UnifiedSouls.arena.fight.speed===3));
  const turn=await frame.evaluate(async()=>{
   const {Combat}=await import('souls/combat/model.js');const {loadState}=await import('souls/state.js');const fixture=loadState({getItem:()=>null});fixture.stats={str:12,def:12,acc:12,dodge:12,crit:12};fixture.gear={sword:2,armor:2,shield:2,bow:2,helmet:2};let victories=0;
   const c=new Combat({state:fixture,arena:1,random:()=>.4,onVictory(){victories++;return{gold:1};}});let overlap=false,hero=false,enemy=false;
   for(let i=0;i<120*300&&!c.over;i++){c.advance(1/120);overlap||=!!(c.heroAttack&&c.enemyAttack);hero||=!!c.heroAttack;enemy||=!!c.enemyAttack;}
   c.advance(1);return{overlap,hero,enemy,phase:c.phase,kills:c.kills,victories};
  });
  check('Ataques alternados, nunca simultáneos',!turn.overlap&&turn.hero&&turn.enemy);
  check('Cuatro rivales y una sola recompensa',turn.phase==='victory'&&turn.kills===4&&turn.victories===1);
  await frame.evaluate(()=>{const app=window.UnifiedSouls;app.state.stats={str:60,def:60,acc:60,dodge:60,crit:60};app.save();app.arena.start();let f=app.arena.fight;for(let i=0;i<50000&&!f.over;i++)f.advance(1/120);app.arena.render();});
  check('Victoria ofrece siguiente arena',await frame.locator('#nextArena').isVisible());
  await frame.locator('#nextArena').click();
  check('Siguiente arena inicia directamente',await frame.evaluate(()=>window.UnifiedSouls.arena.selected===2&&window.UnifiedSouls.arena.fight.arena.id===2));
  const stored=await page.evaluate(async()=>{await saveRoster();return{gold:state.gold,souls:state.ui.souls,fishXp:state.skills.pesca.xp,owned:state.owned,credits:state.ui.fishingDeliveryCredits};});
  await page.reload();await page.waitForFunction(()=>!!document.getElementById('soulsFrame39')?.contentWindow?.UnifiedSouls);
  check('Recarga conserva oro, skills, equipo, pesca y encargos',await page.evaluate(saved=>JSON.stringify({gold:state.gold,souls:state.ui.souls,fishXp:state.skills.pesca.xp,owned:state.owned,credits:state.ui.fishingDeliveryCredits})===JSON.stringify(saved),stored));
  await page.screenshot({path:'test-results/prueba-39-arena-pc.png'});
  await page.evaluate(()=>selectWorkspaceTab('fishing'));await page.waitForTimeout(400);await page.locator('#fishingAtlas').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/prueba-39-pesca-pc.png'});
  check('Emblemas medievales quedan dentro de cada encabezado',await page.evaluate(()=>[...document.querySelectorAll('#page_fishing .e239Emblem')].every(n=>{const row=n.closest('summary');if(!row)return true;const r=row.getBoundingClientRect(),a=n.getBoundingClientRect(),p=row.parentElement.getBoundingClientRect();return a.top>=r.top&&a.bottom<=r.bottom+1&&a.bottom<=p.bottom+1;})));
  check('No hay pinceladas superpuestas a los peces',await page.evaluate(()=>!e231ResponsiveArt('fish','morena','legendary').includes('e237Skin')));
  await page.setViewportSize({width:390,height:844});await page.locator('#fishingAtlas').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/prueba-39-pesca-movil.png'});
  check('Pesca sin desbordamiento horizontal en móvil',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(()=>selectWorkspaceTab('souls_train'));await page.waitForTimeout(500);await page.screenshot({path:'test-results/prueba-39-entrenamiento-movil.png'});
  check('Entrenamiento sin desbordamiento horizontal en móvil',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const frame2=page.frames().find(f=>f.parentFrame());
  const balance=await frame2.evaluate(async()=>{
   const {Combat}=await import('souls/combat/model.js'),{loadState}=await import('souls/state.js');const scenarios=[];
   for(const [level,gear]of [[0,0],[12,2],[30,8],[60,12],[120,20]]){
    const s=loadState({getItem:()=>null});for(const k in s.stats)s.stats[k]=level;for(const k in s.gear)s.gear[k]=gear;let last=0,total=0,overlap=false;
    for(let arena=1;arena<=100;arena++){let seed=arena*12345+9;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;};const f=new Combat({state:s,arena,random});
     for(let i=0;i<120*400&&!f.over;i++){for(const skill of ['slash','shield','heal'])f.use(skill);f.advance(1/120);overlap||=!!(f.heroAttack&&f.enemyAttack);}
     total+=f.time;if(f.phase!=='victory')break;last=arena;
    }scenarios.push({level,gear,arenasSuperadas:last,secondsSimulated:Math.round(total),overlap});
   }return scenarios;
  });
  check('Personaje inicial no supera las cien arenas sin entrenar',balance[0].arenasSuperadas<10);
  check('Los cinco escenarios de balance mantienen turnos exclusivos',balance.every(s=>!s.overlap));
  fs.writeFileSync('test-results/BALANCE-ARENAS-39.json',JSON.stringify(balance,null,2));
  const importmap=await page.evaluate(()=>{const f=document.getElementById('soulsFrame39');const doc=new DOMParser().parseFromString(f.srcdoc,'text/html');return JSON.parse(doc.querySelector('script[type=importmap]').textContent).imports;});
  check('Todos los módulos Souls están embebidos, sin dependencia de servidor',Object.values(importmap).every(url=>url.startsWith('data:text/javascript;base64,')));
  const stale=await page.evaluate(async()=>{const owner=state,win=document.getElementById('soulsFrame39').contentWindow,bridge=IdleSoulsHost.open(win);await changeRoster('leave');draft={name:'Segundo héroe',race:'humano',cls:'guerrero'};await changeRoster('create');const before=state.gold;let denied=false;try{bridge.setGold(999999);}catch{denied=true;}return{denied,unchanged:state.gold===before,clean:!state.ui.souls.stats,ownerHasSkills:!!owner.ui.souls.stats};});
  check('Personajes separados y sesión vieja no puede gastar su oro',stale.denied&&stale.unchanged&&stale.clean&&stale.ownerHasSkills);
  const imported=await page.evaluate(()=>{const raw={stats:{str:11,def:12,acc:13,dodge:14,crit:15},xp:{str:7,def:6,acc:5,dodge:4,crit:3},coins:321,room:3,gear:{sword:4,armor:3,shield:2,bow:1,helmet:2},arena:{completed:9},stations:{str:2}};const before=state.gold;e239ImportSouls(raw);const once=state.gold;e239ImportSouls(raw);return{before,once,twice:state.gold,stats:state.ui.souls.stats.str,gear:state.ui.souls.gear.sword,arena:state.ui.souls.arena.completed};});
  check('Importación Souls conserva skills, equipo y arenas sin duplicar oro',imported.once-imported.before===321&&imported.once===imported.twice&&imported.stats===11&&imported.gear===4&&imported.arena===9);
  const reserves=await page.evaluate(()=>{state.inventory.pez_mojarra=3;const gold=state.gold;const btn=[...document.querySelectorAll('.settingsActions button')].find(b=>b.textContent==='Vender peces guardados');btn.click();const once=state.gold;btn.click();return{unit:E16_FISH.find(f=>f.id==='mojarra').price,gold,once,twice:state.gold,credit:state.ui.fishingDeliveryCredits.mojarra,remaining:state.inventory.pez_mojarra||0};});
  check('Reservas anteriores se venden una vez y conservan crédito de encargos',reserves.once-reserves.gold===3*reserves.unit&&reserves.once===reserves.twice&&reserves.credit===3&&reserves.remaining===0);
  const fileContext=await browser.newContext(),filePage=await fileContext.newPage();filePage.on('pageerror',e=>errors.push(String(e)));
  await filePage.goto(require('url').pathToFileURL(require('path').resolve('index.html')).href);await filePage.waitForTimeout(600);
  await filePage.evaluate(async()=>{draft={name:'Prueba archivo',race:'humano',cls:'guerrero'};await changeRoster('create');selectWorkspaceTab('souls_train');});
  await filePage.waitForFunction(()=>!!document.getElementById('soulsFrame39')?.contentWindow?.UnifiedSouls);
  check('HTML abre directamente desde archivo con entrenamiento funcional',await filePage.evaluate(()=>document.getElementById('soulsFrame39').contentWindow.UnifiedSouls.state.room===1));
  await fileContext.close();
  check('Sin errores de ejecución',errors.length===0);
  fs.writeFileSync('test-results/VERIFICACION-39.json',JSON.stringify({checks,errors,sale,temple,turn},null,2));console.log(JSON.stringify({checks,errors,sale,temple,turn},null,2));
 }catch(error){console.error(error);fs.writeFileSync('test-results/VERIFICACION-39-parcial.json',JSON.stringify({checks,errors,error:String(error)},null,2));throw error;}
 finally{await browser?.close();server.close();}
})().catch(()=>{process.exitCode=1;});
