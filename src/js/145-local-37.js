
'use strict';
// Additive balance: catalogue definitions change, saved progress never does.
const E237_BALANCE={questFactor:.65,xpMin:1.18,xpMax:1.35};
function e237Quantity(n){return n<=1?n:Math.max(1,Math.round(n*E237_BALANCE.questFactor));}
for(const fish of E16_FISH){fish.xp=Math.round(fish.xp*(E237_BALANCE.xpMin+(E237_BALANCE.xpMax-E237_BALANCE.xpMin)*Math.min(100,fish.req)/100));}
for(const q of [E17_QUEST,...E171_QUESTS,...E187_QUESTS])for(const n of q.needs)n.qty=e237Quantity(n.qty);
for(const rod of E208_CATALOG.filter(r=>r.unlock)){
 rod.unlock.catches=e237Quantity(rod.unlock.catches);
 if(rod.unlock.bestKg)rod.unlock.bestKg=Math.round(rod.unlock.bestKg*.85);
 // A nearby progression goal while the celestial record challenges remain optional.
 if(rod.id==='e208_rod_eterno_pulso')rod.unlock.bestKg=0;
}
for(const q of E227_QUESTS)for(const g of q.goals)if(['captures','speciesCount','speciesQualityCount'].includes(g.kind))g.need=e237Quantity(g.need);

const E237_CREATURES=[
 ['carpa_dorada','Carpa real del remanso'],['trucha_arcoiris','Bagre de aletas rojas'],
 ['salmon','Dorado de corrientes'],['lucio','Surubí del bosque'],
 ['atun','Tiburón de las brumas'],['mantarraya','Manta oceánica'],
 ['koi_imperial','Koi imperial'],['esturion','Esturión acorazado'],
 ['morena','Pulpo del coral'],['tiburon_arrecife','Tiburón martillo'],
 ['calamar_abismo','Pulpo abisal'],['leviatan','Calamar colosal'],
 ['anguila_manglar','Anguila de raíces'],['tarpon','Pez sierra del manglar'],
 ['bacalao_hielo','Bacalao de hielo'],['esturion_blanco','Tiburón boreal'],
 ['mero_obsidiana','Pulpo de obsidiana'],['dragon_mar','Leviatán de la caldera'],
 ['raya_aurora','Manta de las estrellas'],['guardian_mareas','Ballena celestial'],
 ['nautilo_bronce','Nautilo de bronce'],['congrio_archivo','Tiburón de las ruinas'],
 ['ajolote_cuarzo','Ajolote de cuarzo'],['esturion_geoda','Tiburón geoda'],
 ['quimera_ambar','Quimera de ámbar'],['titan_ammonita','Cachalote primordial']
];
for(const [id,name] of E237_CREATURES){
 const fish=E16_FISH.find(f=>f.id===id);fish.name=name;e231ArtNames.set('fish:'+id,name);
 const symbol='e237-creature-'+id,entry={symbol,width:256,height:204.8};
 E227_ART['fish:'+id]=entry;E227_ART['hud-fish:'+id]=entry;
 // Share the new base animal. Quality is rendered as an alpha-clipped skin effect.
 for(const cat of ['normal','large','huge','legendary'])delete E227_ART['specimen-'+cat+':'+id];
}
// Existing IDs, catches, inventories and discoveries refer to the same slot.
// Rename only presentation text that explicitly mentions a replaced animal.
for(const q of E227_QUESTS)if(q.id==='e231_puentes_manglar')q.description='Documentá las grandes criaturas del manglar. Tus capturas históricas cuentan.';

const e237OldLayer=e232SpecimenLayer;
e232SpecimenLayer=function(symbol,key,category,width='100%',height='100%'){
 if(!symbol.startsWith('e237-creature-'))return e237OldLayer(symbol,key,category,width,height);
 if(!['large','huge','legendary'].includes(category))return '';
 const gold=category==='legendary',huge=category==='huge',color=gold?'#ffd45f':huge?'#6edcff':'#d6f0d0',opacity=gold?.31:huge?.20:.08;
 return '<defs><mask id="'+key+'-skin" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="'+width+'" height="'+height+'"><use href="#'+symbol+'" width="'+width+'" height="'+height+'"/></mask></defs><g mask="url(#'+key+'-skin)" class="e237Skin" data-quality="'+category+'"><rect width="'+width+'" height="'+height+'" fill="'+color+'" opacity="'+opacity+'"/><svg width="'+width+'" height="'+height+'" viewBox="0 0 200 100" preserveAspectRatio="none"><path d="M49 40l8-2m23 4l7-1m23 7l8-2m-9 12l7 1" fill="none" stroke="'+color+'" stroke-width="1.4" opacity=".65"/>'+[[42,45],[67,39],[94,47],[120,43],[146,54],[163,45],[83,61]].map(([x,y])=>'<path d="M'+x+' '+(y-4)+'l1.2 3 4 1-4 1-1.2 3-1.2-3-4-1 4-1Z" fill="'+color+'" opacity="'+((gold||huge)?.95:.3)+'"/>').join('')+'</svg></g>';
};
const e237CreatureIds=new Set(E237_CREATURES.map(([id])=>id)),e237OriginalHudArt=e230HudArt;
e230HudArt=function(kind,id,width,height,category='normal'){
 if(kind!=='fish'||!e237CreatureIds.has(id))return e237OriginalHudArt(kind,id,width,height,category);
 return e231ResponsiveArt(kind,id,category).replace('e231ResponsiveArt','e231ResponsiveArt e229HudComposition e230HudComposition');
};
e229HudArt=function(kind,id,width,height){const category=kind==='fish'?e220QualityKey(state?.ui?.lastFishingCatch?.quality)||'normal':'normal';return e230HudArt(kind,id,width,height,category);};

// Blue for Huge, gold for Legendary, one brief glow per new successful catch.
e235CatchFlash=function(){
 const node=document.querySelector('#combatDock.e188FishingMode .e189Art');if(!node)return;
 if(node.e235FlashTimer)clearTimeout(node.e235FlashTimer);
 node.classList.remove('e235CatchFlash','e235RareCatch','e237HugeCatch');
 void node.offsetWidth;
 const category=e220QualityKey(state.ui?.lastFishingCatch?.quality);
 node.classList.toggle('e235RareCatch',category==='legendary'||!!state.ui?.lastFishingCatch?.newAbsoluteRecord);
 node.classList.toggle('e237HugeCatch',category==='huge');node.classList.add('e235CatchFlash');
 node.e235FlashTimer=setTimeout(()=>{node.classList.remove('e235CatchFlash','e235RareCatch','e237HugeCatch');node.e235FlashTimer=null;},1250);
};

let e237LastQuestState=null,e237LastQuestZone=null;
function e237FishingTheme(){document.body.classList.toggle('e237Fishing',!!(state&&ready&&state.ui?.tab==='fishing'));}
const e237PreviousPage=e16Page;
e16Page=function(){
 if(state&&(e237LastQuestState!==state||e237LastQuestZone!==e165Zone().id)){e194QuestOpen=true;e237LastQuestState=state;e237LastQuestZone=e165Zone().id;const fold=document.querySelector('.e194QuestFold');if(fold)fold.open=true;}
 const result=e237PreviousPage();e237FishingTheme();return result;
};
const e237PreviousTab=selectWorkspaceTab;
selectWorkspaceTab=function(id,save=true){const result=e237PreviousTab(id,save);e237FishingTheme();return result;};

