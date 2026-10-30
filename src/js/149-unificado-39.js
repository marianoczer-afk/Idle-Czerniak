
const E239_SOULS_DOCUMENT="{{souls-document-base64}}";
'use strict';
const E239_ALLOWED=['fishing','souls_train','souls_arena','souls_shop'];
for(const tab of [['souls_train','Entrenamiento'],['souls_arena','Arenas'],['souls_shop','Equipo y sala']])if(!UI_TABS.some(([id])=>id===tab[0]))UI_TABS.push(tab);
function e239Prepare(){
 if(!state)return;state.ui=state.ui||{};
 if(!state.ui.unified39){state.ui.legacyActivity39={combatActive:!!state.combat.active,navigationPaused:state.nav?.paused};state.combat.active=false;pauseNav(state);state.ui.unified39=true;}
 if(!E239_ALLOWED.includes(state.ui.tab))state.ui.tab='fishing';
 state.ui.fishingDeliveryCredits=state.ui.fishingDeliveryCredits||{};
 state.ui.souls=state.ui.souls||{};
}
function e239OwnerValid(owner,win){return state===owner&&ready&&storageReady&&!busy&&!managing&&owner.ui?.tab?.startsWith('souls_')&&document.getElementById('soulsFrame39')?.contentWindow===win;}
window.IdleSoulsHost={
 open(win){const owner=state;e239Prepare();return{
  allowed:()=>e239OwnerValid(owner,win),
  getProgress:()=>structuredClone(owner.ui.souls),
  getGold:()=>owner.gold,
  setGold(value){if(!e239OwnerValid(owner,win)||!Number.isFinite(value)||value<0)throw Error('Compra o recompensa no válida');owner.gold=Math.round(value);},
  commit(progress){if(!e239OwnerValid(owner,win))return;const copy=structuredClone(progress);delete copy.coins;owner.ui.souls=copy;persist();updateLive();e239Wallet();}
 };},
 ready(win){if(document.getElementById('soulsFrame39')?.contentWindow!==win)return;e239SetFrameView();},
 resize(win,height){const frame=document.getElementById('soulsFrame39');if(frame?.contentWindow===win&&Number.isFinite(height))frame.style.height=Math.max(580,Math.min(2600,height+4))+'px';}
};
let e239FrameOwner=null;
function e239Mount(){
 if(!state)return;
 let host=document.getElementById('soulsHost39');
 if(e239FrameOwner!==state){host?.remove();host=null;e239FrameOwner=state;}
 if(!host&&state.ui.tab.startsWith('souls_')){host=document.createElement('section');host.id='soulsHost39';host.className='hidden';host.setAttribute('aria-label','Entrenamiento, arenas y equipo');const frame=document.createElement('iframe');frame.id='soulsFrame39';frame.title='Sala de entrenamiento y arenas';frame.srcdoc=new TextDecoder().decode(Uint8Array.from(atob(E239_SOULS_DOCUMENT),c=>c.charCodeAt(0)));host.append(frame);document.getElementById('gameScreen').append(host);}
 document.querySelectorAll('[data-ui-tab]').forEach(b=>{b.hidden=!E239_ALLOWED.includes(b.dataset.uiTab);});
 e239SetFrameView();e239Wallet();
}
function e239SetFrameView(){
 const id=state?.ui?.tab,active=!!(state&&ready&&id?.startsWith('souls_')),host=document.getElementById('soulsHost39'),frame=document.getElementById('soulsFrame39');
 host?.classList.toggle('hidden',!active);document.body.classList.toggle('e239SoulsActive',active);
 if(frame?.contentWindow?.UnifiedSouls)frame.contentWindow.UnifiedSouls.setView(active?{souls_train:'train',souls_arena:'arena',souls_shop:'shop'}[id]:'pause');
 if(active)document.getElementById('combatDock')?.classList.add('hidden');
}
function e239Wallet(){
 if(!state||!ready){document.getElementById('worldGold39')?.setAttribute('hidden','');return;}let wallet=document.getElementById('worldGold39');if(!wallet){wallet=document.createElement('span');wallet.id='worldGold39';document.querySelector('.globalHeaderTop')?.append(wallet);}if(wallet){wallet.hidden=false;wallet.textContent='✦ '+fmt(state.gold)+' oro';}
 const identity=document.querySelector('.generalIdentity>b');if(identity)identity.textContent=state.name+' · Aventurero';document.querySelector('.generalXP')?.setAttribute('hidden','');
 e239Settings();
}
function e239ImportSouls(raw){
 if(!state||!ready||busy||managing)throw Error('Esperá a que termine el guardado.');
 const src=raw?.state||raw;if(!src||!src.stats||!src.xp||!['str','def','acc','dodge','crit'].every(k=>Number.isFinite(src.stats[k])&&Number.isFinite(src.xp[k])))throw Error('El archivo no es un progreso de Argentum Souls.');
 e239Prepare();const dst=structuredClone(state.ui.souls),safe=n=>Math.max(0,Math.min(1e12,Math.floor(Number(n)||0)));
 dst.stats=dst.stats||{};dst.xp=dst.xp||{};
 for(const k of ['str','def','acc','dodge','crit']){const incoming=safe(src.stats[k]),own=safe(dst.stats[k]);if(incoming>own){dst.stats[k]=incoming;dst.xp[k]=safe(src.xp[k]);}else{dst.stats[k]=own;if(incoming===own)dst.xp[k]=Math.max(safe(dst.xp[k]),safe(src.xp[k]));}}
 for(const field of ['gear','stations','comboRecords']){dst[field]=dst[field]||{};for(const [k,v]of Object.entries(src[field]||{}))if(['str','def','acc','dodge','crit','sword','armor','shield','bow','helmet'].includes(k))dst[field][k]=Math.max(safe(dst[field][k]),safe(v));}
 dst.room=Math.max(1,Math.min(10,Math.max(safe(dst.room),safe(src.room))));dst.wins=Math.max(safe(dst.wins),safe(src.wins));dst.arena={completed:Math.min(100,Math.max(safe(dst.arena?.completed),safe(src.arena?.completed)))};
 dst.missions=dst.missions||{};for(const [k,v]of Object.entries(src.missions||{}))if(['str','def','acc','dodge','crit'].includes(k)&&v&&typeof v==='object'&&(!dst.missions[k]||safe(v.index)>safe(dst.missions[k].index)))dst.missions[k]=structuredClone(v);
 const credited=safe(state.ui.soulsImportedGold),incomingGold=safe(src.coins);state.gold+=Math.max(0,incomingGold-credited);state.ui.soulsImportedGold=Math.max(credited,incomingGold);state.ui.souls=dst;
 document.getElementById('soulsHost39')?.remove();e239FrameOwner=null;persist();e239Mount();return dst;
}
function e239Settings(){
 const root=document.querySelector('.settingsActions');if(!root||root.querySelector('[data-souls-import39]'))return;
 const row=document.createElement('div');row.className='actions';const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;
 const load=document.createElement('button');load.type='button';load.dataset.soulsImport39='';load.className='small';load.textContent='Importar progreso Argentum Souls';load.onclick=()=>input.click();input.onchange=async()=>{try{const file=input.files?.[0];if(!file)return;e239ImportSouls(JSON.parse(await file.text()));toast('Skills, equipo y arenas de Souls vinculados. El oro importado no se duplica al repetir el archivo.');}catch(e){toast(e.message);}finally{input.value='';}};
 const sell=document.createElement('button');sell.type='button';sell.className='small';sell.textContent='Vender peces guardados';sell.onclick=()=>{if(!state||!ready||busy||managing)return;let gold=0,count=0;const credits=state.ui.fishingDeliveryCredits;for(const [key,qty]of Object.entries(state.inventory)){if(!key.startsWith('pez_')||!Number.isSafeInteger(qty)||qty<=0)continue;const premium=e185PremiumData(key),id=premium?.fish.id||key.slice(4),fish=E16_FISH.find(f=>f.id===id);if(!fish)continue;gold+=Math.round(qty*fish.price*(premium?.mult||1));count+=qty;credits[id]=(Number(credits[id])||0)+qty;delete state.inventory[key];}state.gold+=gold;persist();e239Wallet();e16Page();toast(count?'Vendidos '+count+' peces · +'+fmt(gold)+' oro. Conservás sus comprobantes para encargos.':'No hay peces anteriores pendientes de vender.');};
 row.append(load,sell,input);root.append(row);
}
const e239PreviousRender=renderGame;
renderGame=function(){e239Prepare();const out=e239PreviousRender();e239Mount();return out;};
const e239PreviousTab=selectWorkspaceTab;
selectWorkspaceTab=function(id,save=true){if(!E239_ALLOWED.includes(id))id='fishing';e239Prepare();const out=e239PreviousTab(id,save);e239Mount();if(id==='fishing')e239QueueBubble();return out;};
e237FishingTheme=function(){document.body.classList.toggle('e237Fishing',!!(state&&ready));};

// A sold fish produces gold and a delivery credit. Credits cannot be sold again.
const e239OriginalStock=e188FishStock,e239OriginalConsume=e188Consume;
e188FishStock=function(id){return e239OriginalStock(id)+Math.max(0,Number(state?.ui?.fishingDeliveryCredits?.[id])||0);};
e188Consume=function(needs){
 if(!needs.every(n=>e188FishStock(n.id)>=n.qty))return false;
 const credits=state.ui.fishingDeliveryCredits||(state.ui.fishingDeliveryCredits={}),remaining=[];
 for(const n of needs){const used=Math.min(n.qty,Number(credits[n.id])||0);credits[n.id]=(Number(credits[n.id])||0)-used;if(n.qty>used)remaining.push({...n,qty:n.qty-used});}
 return !remaining.length||e239OriginalConsume(remaining);
};
const e239PreviousFinish=e16Finish;
e16Finish=function(won){
 const owner=state,g=e16Session,previous=g?{...state.inventory}:null;
 const result=e239PreviousFinish(won);
 if(won&&g&&owner===state&&state.ui?.lastFishingCatch){
  const id=g.fish.id,base='pez_'+id,keys=[base,base+'__large',base+'__huge',base+'__legendary'];
  const key=keys.find(k=>(Number(state.inventory[k])||0)>(Number(previous[k])||0));
  if(key){state.inventory[key]--;if(!state.inventory[key])delete state.inventory[key];const earned=Math.max(0,Math.round(Number(state.ui.lastFishingCatch.price)||g.fish.price));state.gold+=earned;const credits=state.ui.fishingDeliveryCredits||(state.ui.fishingDeliveryCredits={});credits[id]=(Number(credits[id])||0)+1;state.ui.lastFishingCatch.autoSold=true;state.ui.lastFishingCatch.saleGold=earned;persist();e16Page();e188UpdateHud();e235CatchFlash();e239Wallet();}
 }
 e239QueueBubble();return result;
};
const e239PreviousDefinitions=e216QuestDefinitions;
e216QuestDefinitions=function(){return e239PreviousDefinitions().map(q=>q.goals.some(g=>g.kind==='delivery')?{...q,note:'Cuenta el inventario anterior y los comprobantes de capturas vendidas automáticamente. El encargo consume esos comprobantes; el oro de venta ya es tuyo.'}:q);};

// Temple reduces the loss when the animal escapes the capture bar.
function e239Temple(rod=e161Rod()){const st=e1101Stats(rod);return Math.round(clamp(8+st.control*.65+st.resilience*.45+Math.min(15,Math.log10(e190Capacity(rod)+1)*4),10,75));}
const e239PreviousProfile=e232CaptureProfile;
e232CaptureProfile=function(fish,rod,level,weight){const base=e239PreviousProfile(fish,rod,level,weight),st=e1101Stats(rod),handling=.6*st.control/64+.4*st.resilience/60,mismatch=Math.max(0,.25+.85*(fish.req-1)/99-handling),temple=e239Temple(rod);return{...base,temple,mismatch,pressure:base.pressure*(1+mismatch*.30),endurance:base.endurance*(1+mismatch*.55),loss:base.loss*(1+(1-temple/100)*.8+mismatch*1.65)};};
const e239PreviousComparison=e216RodComparison;
e216RodComparison=function(rod){const value=e239Temple(rod),current=e239Temple();return e239PreviousComparison(rod)+'<span class="rodCompare '+(value>current?'better':value<current?'worse':'same')+'" data-stat="temple"><span>Temple '+value+'%</span><b title="Menos pérdida de progreso fuera de la barra">'+(value===current?'=':value>current?'▲'+(value-current):'▼'+(current-value))+'</b></span>';};

let e239BubbleTimer=null;
e161CanFish=function(){return !!(state&&ready&&!busy&&!managing&&storageReady&&!simulationLocked()&&E16_FISH.some(f=>e165Zone().fish.includes(f.id)&&e16FishLevel()>=f.req&&e190CanLift(f)));};
e195ShakeCount=function(){return 1;};
function e239QueueBubble(){
 if(e239BubbleTimer!==null)return;
 e239BubbleTimer=setTimeout(()=>{e239BubbleTimer=null;if(!e161OnPage()||document.hidden||!e161CanFish()||e16Session||e195Pending)return;e161StopWait();e161Fishing=true;const fish=e161RandomFish();if(fish)e16Start(fish.id);},state?Math.max(180,650-(e161Rod()?e1101Stats(e161Rod()).speed:0)*14):250);
}
e161NextBite=function(){e161StopWait();e239QueueBubble();};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)e239QueueBubble();});
const e239PreviousPage=e16Page;
e16Page=function(){const result=e239PreviousPage();e239QueueBubble();e239Decorate();return result;};

// Alpha-only quality treatment: preserve anatomy and texture, never brush stripes.
e232SpecimenLayer=function(){return '';};
const e239PreviousResponsive=e231ResponsiveArt;
e231ResponsiveArt=function(kind,id,category='normal'){
 if(kind!=='fish')return e239PreviousResponsive(kind,id,category);
 const f=E227_ART['hud-fish:'+id]||E227_ART['fish:'+id];if(!f)return e239PreviousResponsive(kind,id,category);
 const name=E16_FISH.find(x=>x.id===id)?.name||id;
 return '<svg class="fishIllustration e231ResponsiveArt e239Fish" width="100%" height="100%" role="img" aria-label="'+esc(name)+'" data-specimen-category="'+category+'"><rect width="100%" height="100%" fill="url(#argentum-water-skin)"/><use class="e231Subject" href="#'+f.symbol+'" width="100%" height="100%"/></svg>';
};
e230HudArt=function(kind,id,width,height,category='normal'){return (kind==='fish'?e231ResponsiveArt(kind,id,category):e239RodArt(id)).replace('e231ResponsiveArt','e231ResponsiveArt e229HudComposition e230HudComposition');};
e235CatchFlash=function(){
 const n=document.querySelector('#combatDock.e188FishingMode .e189Art');if(!n)return;clearTimeout(n.e235FlashTimer);n.classList.remove('e235CatchFlash','e235RareCatch','e237HugeCatch');void n.offsetWidth;const q=e220QualityKey(state.ui?.lastFishingCatch?.quality);n.classList.toggle('e235RareCatch',q==='legendary');n.classList.toggle('e237HugeCatch',q==='huge');n.classList.add('e235CatchFlash');n.e235FlashTimer=setTimeout(()=>n.classList.remove('e235CatchFlash','e235RareCatch','e237HugeCatch'),q==='legendary'?2200:q==='huge'?1800:1100);
};
function e239RodIndex(id){const r=e221Rods().find(x=>x.id===id),zone=r?e210RodZone(r):'muelle';return ({muelle:0,rio:1,costa:2,laguna:3,arrecife:4,abismo:5,manglar:6,glaciar:7,volcan:8,santuario:9,ruinas_sumergidas:10,cavernas_cristal:11,abismo_primordial:11})[zone]??0;}
function e239RodArt(id){const name=e221Rods().find(r=>r.id===id)?.name||id;return '<svg class="rodIllustration e231ResponsiveArt e239Rod" width="100%" height="100%" role="img" aria-label="'+esc(name)+'"><use href="#e239-rod-'+e239RodIndex(id)+'" width="100%" height="100%"/></svg>';}
e194RodArt=e239RodArt;
e238Icon=function(name){const index={atlas:0,journal:1,quests:2,trophies:3,shop:4}[name];return '<svg class="e239Emblem" viewBox="0 0 100 100" aria-hidden="true"><use href="#e239-emblem-'+index+'" width="100" height="100"/></svg>';};
function e239Decorate(){
 if(!state)return;
 document.querySelectorAll('[data-e161-toggle]').forEach(n=>n.hidden=true);
 const art=document.querySelector('#combatDock .e189Art');if(art){art.dataset.quality=e220QualityKey(state.ui?.lastFishingCatch?.quality)||'normal';if(state.ui?.lastFishingCatch?.autoSold){const label=document.querySelector('#e188HudResult');if(label&&!e16Session)label.textContent='Venta automática · +'+fmt(state.ui.lastFishingCatch.saleGold)+' oro';}}
 document.querySelectorAll('.e196Header').forEach(n=>n.textContent='¡Hay pique! Explotá la burbuja');
 const rod=document.querySelector('.e194DockRod');if(rod)rod.title='Temple '+e239Temple()+'% · más temple reduce el castigo fuera de la barra';
 const grid=document.querySelector('.e1107RodStats');if(grid){let tile=grid.querySelector('[data-temple39]');if(!tile){tile=document.createElement('div');tile.dataset.temple39='';grid.append(tile);}tile.innerHTML=e228Icon('resilience')+'Temple<b>'+e239Temple()+'%</b>';tile.title='Menor pérdida fuera de la barra. Los peces avanzados exigen una caña de mayor manejo.';}
 const help=document.querySelector('.e1107RodHelp');if(help&&!help.dataset.unified39){help.dataset.unified39='';help.textContent='Atracción adelanta la siguiente burbuja; suerte mejora especies raras; control amplía la barra; resiliencia suaviza los movimientos; temple reduce el castigo fuera de la barra; trofeos mejora la calidad de los ejemplares.';}
 const identity=document.querySelector('.generalIdentity>b');if(identity)identity.textContent=state.name+' · Aventurero';
 document.querySelector('.generalXP')?.setAttribute('hidden','');
}
const e239PreviousHud=e188UpdateHud;
e188UpdateHud=function(){const out=e239PreviousHud();e239Decorate();return out;};
const e239PreviousClean=e227CleanDownload;
e227CleanDownload=function(page){e239PreviousClean(page);page.querySelector('#soulsHost39')?.remove();page.querySelector('#worldGold39')?.remove();page.querySelector('body')?.classList.remove('e239SoulsActive');};
const e239PreviousTop=e227UpdateTop;
e227UpdateTop=function(){const out=e239PreviousTop();e239Wallet();return out;};

