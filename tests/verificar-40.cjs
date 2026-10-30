require('fs').mkdirSync('test-results',{recursive:true});
const fs=require('fs'),http=require('http');
const {chromium}=require('playwright');
(async()=>{
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html;charset=utf-8');res.end(fs.readFileSync('index.html'));});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 const checks=[],errors=[];function check(name,ok){checks.push({name,ok});if(!ok)throw Error(name);}
 try{
  browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{}),headless:true});const context=await browser.newContext({viewport:{width:1366,height:950}}),page=await context.newPage();page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForTimeout(500);
  await page.evaluate(async()=>{draft={name:'Prueba HUD',race:'humano',cls:'guerrero'};await changeRoster('create');state.owned.e161_rod_bamboo=true;state.owned[E17_ROD.id]=true;state.skills.pesca.xp=10*70**2;state.ui.souls={stats:{str:7,def:6,acc:5,dodge:4,crit:3},xp:{str:2,def:0,acc:0,dodge:0,crit:0},gear:{sword:2},coins:0};state.ui.lastFishingCatch={id:'esturion_blanco',xp:1200,price:2200,quality:'Enorme',weightKg:250};e16Page();e188UpdateHud();});
  check('HUD visible al entrar',await page.locator('#combatDock').isVisible());
  check('HUD conserva zona, caña, pez y XP',await page.evaluate(()=>['.e1118Zone','.e194DockRod','.e189Art','#dockPlayerXpText'].every(s=>!!document.querySelector('#combatDock '+s))));
  check('Arte anterior en tienda y HUD',await page.evaluate(()=>!e194RodArt('e16_rod').includes('e239-rod-')&&!e230HudArt('rod','e16_rod',500,100).includes('e239-rod-')&&e194RodArt('e16_rod').includes('hud-rod')));
  await page.waitForTimeout(900);
  check('Burbuja aparece automáticamente',await page.locator('.e196Bubble:visible').count()===1);
  await page.locator('#fishingRodShop').evaluate(n=>n.open=true);await page.waitForTimeout(150);
  check('Preparación se pausa al abrir la tienda',await page.evaluate(()=>!e195Pending&&!e16Session));
  check('Equipar no queda bloqueado por burbuja',await page.locator('[data-e164-equip="1"]').isEnabled());
  await page.locator('[data-e164-equip="1"]').click();
  check('Tienda permite cambiar a una caña obtenida',await page.evaluate(()=>state.ui.fishingRodId==='e161_rod_bamboo'));
  await page.waitForTimeout(800);
  check('La burbuja no reaparece mientras se elige equipo',await page.evaluate(()=>!e195Pending&&!e16Session));
  await page.locator('#fishingRodShop').evaluate(n=>n.open=false);
  await page.waitForTimeout(950);
  check('Cerrar tienda reanuda las burbujas',await page.locator('.e196Bubble:visible').count()===1);
  await page.locator('#combatDock .e194DockRod').click();
  check('Selector de cañas del HUD abre',await page.locator('.e1120Menu[data-type="rod"]').isVisible());
  await page.locator('.e1120Menu [data-rod-id="e17_rod_viejo"]').click();
  check('Selector HUD equipa caña de misión',await page.evaluate(()=>state.ui.fishingRodId===E17_ROD.id));
  await page.locator('.e1120Menu .e217RodTools button').click();await page.waitForTimeout(1000);
  await page.locator('.e196Bubble').click();
  check('Explotar la burbuja inicia una captura',await page.evaluate(()=>!!e16Session));
  const sessionRod=await page.evaluate(()=>state.ui.fishingRodId);
  await page.evaluate(()=>{const b=document.createElement('button');b.dataset.e164Equip='0';document.body.append(b);b.click();b.remove();});
  check('No permite cambiar caña durante captura activa',await page.evaluate(id=>state.ui.fishingRodId===id,sessionRod));
  await page.evaluate(()=>e16Finish(false));
  const stable=await page.evaluate(()=>({xp:state.skills.pesca.xp,gold:state.gold,owned:state.owned,souls:state.ui.souls}));
  for(const tab of ['souls_train','souls_arena','souls_shop']){
   await page.evaluate(id=>selectWorkspaceTab(id),tab);await page.waitForFunction(()=>!!document.getElementById('soulsFrame39')?.contentWindow?.UnifiedSouls);
   check('HUD oculto en '+tab,!(await page.locator('#combatDock').isVisible()));
   await page.evaluate(()=>selectWorkspaceTab('fishing'));await page.waitForTimeout(100);
   check('HUD vuelve desde '+tab,await page.locator('#combatDock').isVisible());
  }
  check('Cambiar pestañas conserva progreso',await page.evaluate(s=>JSON.stringify({xp:state.skills.pesca.xp,gold:state.gold,owned:state.owned,souls:state.ui.souls})===JSON.stringify(s),stable));
  await page.evaluate(async()=>{e240PausePreparation();await saveRoster();});await page.reload();await page.waitForTimeout(700);
  check('Recarga mantiene caña equipada y HUD',await page.evaluate(id=>state.ui.fishingRodId===id,sessionRod)&&await page.locator('#combatDock').isVisible());
  await page.screenshot({path:'test-results/prueba-40-hud-pc.png'});
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{e16Page();e188UpdateHud();});
  check('HUD visible en móvil sin desborde',await page.locator('#combatDock').isVisible()&&await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#combatDock .e194DockRod').click();
  check('Selector de cañas del HUD abre en móvil',await page.locator('.e1120Menu[data-type="rod"]').isVisible());
  await page.locator('.e1120Menu [data-rod-id="e16_rod"]').click();await page.locator('.e1120Menu .e217RodTools button').click();
  check('Cambio de caña funciona en móvil',await page.evaluate(()=>state.ui.fishingRodId==='e16_rod'));
  await page.screenshot({path:'test-results/prueba-40-hud-movil.png'});
  check('Sin errores JavaScript',errors.length===0);
  fs.writeFileSync('test-results/VERIFICACION-40.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors},null,2));
 }catch(e){console.error(e);fs.writeFileSync('test-results/VERIFICACION-40-parcial.json',JSON.stringify({checks,errors,error:String(e)},null,2));throw e;}finally{await browser?.close();server.close();}
})().catch(()=>{process.exitCode=1;});
