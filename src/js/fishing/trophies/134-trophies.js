'use strict';
// Presentation and read-only recognitions. The v7 records remain authoritative.
const e228TrophyViews=new WeakMap();
function e228TrophyView(){if(!e228TrophyViews.has(state))e228TrophyViews.set(state,{open:false,filter:'earned',zone:'all',kind:'all',sort:'rare',selected:null});return e228TrophyViews.get(state);}
function e228FishName(f){return f.name.replace(/[★☆✨]/gu,'').trim();}
function e228Icon(key){const paths={speed:'M3 12h14m-5-5 5 5-5 5M3 7h5M3 17h5',luck:'M12 3 15 9 21 12 15 15 12 21 9 15 3 12 9 9Z',control:'M3 8v8m18-8v8M3 12h18m-14-3v6m10-6v6',resilience:'M12 3 20 6v6q-1 6-8 9-7-3-8-9V6Z',trophy:'M7 3h10v7q0 5-5 5t-5-5ZM7 6H3v4q0 3 5 3m9-7h4v4q0 3-5 3m-4 2v6m-5 0h10',maxKg:'M4 8h16l2 13H2ZM9 8V5q3-4 6 0v3',lock:'M6 10h12v11H6Zm3 0V6q3-6 6 0v4',hook:'M14 3v12q0 7-7 5-4-2-2-6l2 3'};return '<svg class="e228Icon" viewBox="0 0 24 24" aria-hidden="true"><path d="'+(paths[key]||paths.hook)+'" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
function e228Rarity(chance){return chance>=.25?'Frecuente':chance>=.12?'Poco común':chance>=.06?'Rara':chance>=.025?'Muy rara':chance>=.01?'Excepcional':'Mítica';}
function e228Mystery(zone,id){
 const seed=[...id].reduce((n,c)=>n+c.charCodeAt(0),0)%3;
 return '<span class="e228Habitat variant'+seed+'" role="img" aria-label="Hábitat misterioso de '+esc(zone.name)+'">'+e227ZoneArt(zone,'e228MysteryLandscape')+'<svg viewBox="0 0 240 120" preserveAspectRatio="none" aria-hidden="true"><path d="M0 105Q30 35 42 104Q65 65 76 118M160 120Q170 42 184 109Q203 72 214 118" fill="none" stroke="#a8c5ad" stroke-width="5" opacity=".35"/><path d="M0 68Q60 43 120 65T240 64M0 82Q60 61 120 80T240 83" fill="none" stroke="#b5d9d1" opacity=".28"/><circle cx="'+(45+seed*55)+'" cy="35" r="3" fill="#d7dab3" opacity=".7"/></svg></span>';
}
function e228Collection(){
 const zone=e165Zone(),grid=document.querySelector('#page_fishing .e186BookGrid');if(!grid)return;
 const refs=e222DifficultyReference(),pool=E16_FISH.filter(f=>zone.fish.includes(f.id)),chance=new Map(pool.map(f=>[f.id,refs.get(f.id)?.chance||0]));
 const found=pool.filter(f=>e227Discovered(state,f.id)).length,book=grid.closest('.e186Book'),caption=book?.querySelector(':scope>summary .e221HeaderWords small'),fill=book?.querySelector('.e186Progress>div');if(caption)caption.textContent=found+'/'+pool.length+' especies descubiertas';if(fill)fill.style.width=(pool.length?100*found/pool.length:0)+'%';
 const cards=[...grid.querySelectorAll('[data-species-id]')];cards.sort((a,b)=>chance.get(b.dataset.speciesId)-chance.get(a.dataset.speciesId)||(refs.get(a.dataset.speciesId)?.level||0)-(refs.get(b.dataset.speciesId)?.level||0)||a.dataset.speciesId.localeCompare(b.dataset.speciesId));
 for(const card of cards){const f=pool.find(f=>f.id===card.dataset.speciesId);if(!f)continue;const known=e227Discovered(state,f.id),locked=e16FishLevel()<Math.max(zone.req,f.req),rarity=e228Rarity(chance.get(f.id));card.classList.toggle('e186Unknown',!known);card.classList.toggle('e228LevelLocked',!known&&locked);
  const sprite=card.querySelector('.e192Sprite'),title=card.querySelector('strong');if(sprite)sprite.innerHTML=known?e189FishSVG(f.id):e228Mystery(zone,f.id);
  if(title)title.textContent=known?e228FishName(f):locked?'Fuera de alcance · Pesca '+f.req:'Especie desconocida';
  card.querySelector('.e228Rarity')?.remove();const tag=document.createElement('span');tag.className='e228Rarity';tag.textContent=rarity;title?.after(tag);
  card.title=known?e228FishName(f)+' · Rareza de especie: '+rarity+' · Referencia: nivel 100, sin suerte, capacidad suficiente y mejor zona. No es tu probabilidad actual. La calidad del ejemplar es independiente.':(locked?'Necesitás Pesca '+f.req+'. ':'')+'Capturá esta especie para descubrirla. Rareza de especie: '+rarity;grid.append(card);
 }
 for(const card of document.querySelectorAll('[data-journal-fish]')){const f=E16_FISH.find(f=>f.id===card.dataset.journalFish);const name=card.querySelector('.e225JournalCaption>b');if(name)name.textContent=e228FishName(f);card.title+=' · Rareza de especie: '+e228Rarity(refs.get(f.id)?.chance||1);}
}
function e228Recognitions(){
 const defs=e216QuestDefinitions(),items=[];
 for(const z of E165_ZONES){const p=e216ZoneProgress(z,defs),difficulty=z.req;
  for(const q of p.quests){const theme=q.goals.some(g=>/Entregá/.test(g.label))?'quest-delivery':q.goals.some(g=>/kg|peso|Récord/.test(g.label))?'quest-weight':'quest-exploration';items.push({id:'quest:'+q.id,kind:'quest',zone:z,title:q.title,earned:q.done,difficulty:difficulty+1,artKind:E227_ART['quest:'+q.id]?'quest':'collection',artId:E227_ART['quest:'+q.id]?q.id:z.id,goals:q.goals,reward:q.reward,note:q.note,quest:q.id});}
  items.push({id:'collection:'+z.id,kind:'collection',zone:z,title:'Explorador de '+z.name,earned:p.accredited,difficulty:difficulty+2,artKind:'collection',artId:z.id,goals:[{label:'Descubrir todas las especies',have:p.discovered.length,need:p.species.length}],reward:'Insignia de colección · premio visual',note:'Se reclama en la colección de zona. Los premios históricos ya obtenidos se conservan.'});
  items.push({id:'mastery:'+z.id,kind:'mastery',zone:z,title:'Maestría de '+z.name,earned:p.complete,difficulty:difficulty+3,artKind:'medal',artId:z.id,goals:p.stars.map((yes,i)=>({label:['Descubrir '+p.threshold+' especies','Completar los encargos principales','Completar la colección'][i],have:Number(yes),need:1})),reward:'Medalla exclusiva de maestría · premio visual',note:'Tres hitos independientes. Incluye tus estrellas históricas; los encargos complementarios no las revocan.'});
 }
 // Prestige is a catalogue ranking, never a percentage of players.
 for(const i of items)i.prestige=4*i.zone.req+({quest:0,collection:45,mastery:90}[i.kind])+5*i.goals.length+Math.min(30,i.goals.reduce((n,g)=>n+Math.log2(1+Math.max(0,g.need)),0));
 return items;
}
function e230RecognitionDate(item){const raw=state.ui?.fishingRecognitionDates?.[item.id];if(!raw)return 'Fecha no registrada';const date=new Date(raw);return Number.isFinite(date.getTime())?'Obtenida el '+date.toLocaleDateString('es-AR'):'Fecha no registrada';}
function e228TrophyDetails(item){return '<section class="e228TrophyDetail"><div class="e228AwardArt '+(!item.earned?'pending':'')+'">'+e227Illustration(item.artKind,item.artId)+'</div><div><h3>'+esc(item.title)+'</h3><small>'+esc(item.zone.name)+' · <b class="e233RecognitionState">'+(item.earned?'✓ Obtenido':'Pendiente')+'</b></small><ul>'+item.goals.map(g=>'<li>'+esc(g.label)+'</li>').join('')+'</ul><p>'+esc(item.reward)+'</p></div></section>';}
function e233PlaceTrophyDetail(root){
 if(!state)return;
 const host=root.querySelector('.e228TrophySelection'),grid=root.querySelector('.e228TrophyGrid');if(!host||!grid)return;
 host.remove();const id=e228TrophyView().selected,selected=(root.e233VisibleItems||[]).find(i=>i.id===id),button=[...grid.querySelectorAll('[data-recognition]')].find(b=>b.dataset.recognition===id);
 host.hidden=!selected||!button;host.innerHTML=selected&&button?e228TrophyDetails(selected):'';
 if(!selected||!button){root.append(host);return;}
 const top=button.offsetTop,last=[...grid.querySelectorAll('[data-recognition]')].filter(b=>Math.abs(b.offsetTop-top)<2).at(-1)||button;last.after(host);
}
window.addEventListener('resize',()=>{const root=document.getElementById('fishingTrophies');if(root?.open)e233PlaceTrophyDetail(root);});

function e228RenderTrophies(root){
 const v=e228TrophyView(),items=e228Recognitions();let sorted=items.filter(i=>(v.filter==='all'||i.earned===(v.filter==='earned'))&&(v.zone==='all'||i.zone.id===v.zone)&&(v.kind==='all'||i.kind===v.kind));
 sorted.sort((a,b)=>(v.sort==='rare'||v.sort==='hard'?b.prestige-a.prestige:v.sort==='zone'?a.zone.name.localeCompare(b.zone.name,'es'):v.sort==='kind'?a.kind.localeCompare(b.kind):a.prestige-b.prestige)||Number(b.earned)-Number(a.earned)||a.id.localeCompare(b.id));
 const selection=root.querySelector('.e228TrophySelection');if(selection)root.append(selection);
 root.querySelector('.e228TrophyGrid').innerHTML=sorted.map(i=>'<button type="button" class="e228Trophy '+(!i.earned?'pending':'earned')+' '+i.kind+'" data-recognition="'+i.id+'" aria-expanded="'+(v.selected===i.id)+'" title="'+esc(i.title+' · '+i.goals.map(g=>g.label).join('; ')+' · '+i.reward)+'"><span class="e228AwardArt">'+e227Illustration(i.artKind,i.artId)+'</span><b>'+esc(i.earned?i.title:'Reconocimiento pendiente')+'</b><small>'+esc(i.zone.name)+' · '+({quest:'Encargo',collection:'Colección',mastery:'Maestría'}[i.kind])+'</small></button>').join('')||'<p>No hay reconocimientos con estos filtros.</p>';
 root.querySelector('[data-trophy-count]').textContent=items.filter(i=>i.earned).length+'/'+items.length+' reconocimientos · '+items.filter(i=>i.kind==='mastery'&&i.earned).length+'/'+E165_ZONES.length+' medallas';
 root.e233VisibleItems=sorted;e233PlaceTrophyDetail(root);e228RemoveDecorativeEmoji(root);
}
function e228Trophies(){
 const atlas=document.getElementById('fishingAtlas');if(!atlas)return;document.getElementById('fishingTrophies')?.remove();const root=document.createElement('details'),v=e228TrophyView();root.id='fishingTrophies';root.className='e221Panel fishingTrophies';root.open=v.open;
 root.innerHTML='<summary><span class="e228TrophyHeaderArt">'+e227Illustration('ui','trophy-header','',true)+'</span><span class="e221HeaderWords"><b>Sala de Trofeos</b><small data-trophy-count></small></span></summary><div class="e228TrophyTools"><select data-trophy-tool="filter" aria-label="Estado de trofeos"><option value="all">Todos</option><option value="earned">Obtenidos</option><option value="pending">Pendientes</option></select><select data-trophy-tool="zone" aria-label="Zona de trofeos"><option value="all">Todas las zonas</option>'+E165_ZONES.map(z=>'<option value="'+z.id+'">'+esc(z.name)+'</option>').join('')+'</select><select data-trophy-tool="kind" aria-label="Tipo de reconocimiento"><option value="all">Todos los tipos</option><option value="quest">Encargos</option><option value="collection">Colecciones</option><option value="mastery">Maestrías</option></select><select data-trophy-tool="sort" aria-label="Ordenar trofeos"><option value="rare">Más raros primero</option><option value="easy">Menos raros primero</option><option value="zone">Por zona</option><option value="kind">Por tipo</option></select></div><div class="e228TrophyGrid"></div><div class="e228TrophySelection" id="fishingTrophyDetail" hidden></div>';
 for(const s of root.querySelectorAll('[data-trophy-tool]'))s.value=v[s.dataset.trophyTool];
 root.addEventListener('toggle',()=>{if(root.isConnected){v.open=root.open;if(root.open)e233PlaceTrophyDetail(root);}});root.addEventListener('change',e=>{if(e.target.dataset.trophyTool){v[e.target.dataset.trophyTool]=e.target.value;v.selected=null;e228RenderTrophies(root);}});root.addEventListener('click',e=>{const b=e.target.closest('[data-recognition]');if(b){v.selected=v.selected===b.dataset.recognition?null:b.dataset.recognition;e228RenderTrophies(root);root.querySelector('[data-recognition="'+b.dataset.recognition+'"]')?.focus({preventScroll:true});}});atlas.after(root);e228RenderTrophies(root);
}
function e228OpenAtlas(zone,quest){if(state?.ui?.tab!=='fishing')selectWorkspaceTab('fishing');const root=document.getElementById('fishingAtlas');if(!root)return;const v=e216View();Object.assign(v,{open:true,zone,search:'',filter:'all',badge:null,focusQuest:quest||null});root.open=true;root.querySelector('[data-atlas-search]').value='';root.querySelector('[data-atlas-filter]').value='all';e216RenderAtlas(root);e222Highlight(root.querySelector('.atlasSelection'));}
function e228Travel(id){
 const zone=E165_ZONES.find(z=>z.id===id);if(!state||!zone||!ready||busy||managing||!storageReady||simulationLocked())return;
 if(e16FishLevel()<zone.req){toast('Necesitás Pesca '+zone.req+' para viajar.');return;}
 if(e16Session||e195Pending){toast('Terminá la captura o dejá de pescar antes de viajar.');return;}
 if(e161Fishing){e161Fishing=false;e161StopWait();}e195Reset();state.ui.fishingZoneId=id;persist();e16Page();e190ReturnToFishing();
}
const e228PreviousZoneDetails=e216ZoneDetails;
e216ZoneDetails=function(p,v){let html=e228PreviousZoneDetails(p,v);html=html.replace('<span class="atlasMedal" title="Tres hitos completados">✺ Maestría de zona</span>','<span class="atlasMedal" title="Tres hitos completados">'+e227Illustration('medal',p.zone.id)+' ¡Maestría conquistada!</span>');const extra=p.quests.filter(q=>!p.mainQuests.includes(q));return html.replace(/<\/section>$/, '<p class="e228AtlasRoles">Principales '+p.mainDone+'/'+p.mainQuests.length+' · Complementarios '+extra.filter(q=>q.done).length+'/'+extra.length+'</p><button class="e228AtlasTravel small" type="button" data-atlas-travel="'+p.zone.id+'" title="'+(e16FishLevel()<p.zone.req?'Requiere Pesca '+p.zone.req:'Ir a '+esc(p.zone.name))+'" '+(e16FishLevel()<p.zone.req?'disabled':'')+'>Ir</button></section>');};
// The alternate quest does not replace or gate the existing purchase path.
const e228PreviousProvenance=e220RodProvenance;
e220RodProvenance=function(rod){const p=e228PreviousProvenance(rod),q=E228_REGIONAL_QUESTS.find(q=>q.rodId===rod.id);return q?{...p,label:p.label+' · También por encargo',detail:p.detail+' · Alternativa: '+q.title+' en '+E165_ZONES.find(z=>z.id===q.zone).name}:p;};
function e228RemoveDecorativeEmoji(root){if(!root)return;const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walk.nextNode())if(!walk.currentNode.parentElement.closest('svg,script,style,textarea,select,button[data-e161-toggle]'))nodes.push(walk.currentNode);for(const n of nodes){const value=n.nodeValue.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'');if(value!==n.nodeValue)n.nodeValue=value.trimStart();}}
const e228PreviousAtlasRender=e216RenderAtlas;
e216RenderAtlas=function(root){const result=e228PreviousAtlasRender(root);e228RemoveDecorativeEmoji(root);return result;};
function e228Presentation(){
 if(!state||fishingFinishDepth)return;e228Collection();e228Trophies();
 const shop=document.getElementById('fishingRodShop');const art=shop?.querySelector(':scope>summary .e221Art');if(art&&!art.dataset.e228){art.dataset.e228='true';art.innerHTML=e227Illustration('ui','shop-header','',true);}
 for(const row of shop?.querySelectorAll('[data-rod-id]')||[]){const q=E228_REGIONAL_QUESTS.find(q=>q.rodId===row.dataset.rodId);if(q&&!row.querySelector('[data-alternative-quest]'))row.querySelector('.rodShopInfo').insertAdjacentHTML('beforeend','<button class="small e228Alternative" data-alternative-quest="'+q.id+'">Alternativa: '+esc(q.title)+'</button>');}
 for(const b of document.querySelectorAll('.e165ZoneBtn')){const z=E165_ZONES.find(z=>z.id===b.dataset.e165Zone);if(z&&!b.querySelector('svg'))b.insertAdjacentHTML('afterbegin',e227ZoneArt(z,'e228ZoneLandscape'));}
 e228RemoveDecorativeEmoji(document.getElementById('page_fishing'));e228RemoveDecorativeEmoji(document.querySelector('.e197FishingSkills'));e228RemoveDecorativeEmoji(document.querySelector('.e1107RodPanel'));
}


document.addEventListener('click',e=>{const atlas=e.target.closest('[data-trophy-atlas]'),travel=e.target.closest('[data-atlas-travel]'),alternative=e.target.closest('[data-alternative-quest]');if(atlas){e.preventDefault();e228OpenAtlas(atlas.dataset.trophyAtlas,atlas.dataset.trophyQuest);}if(travel){e.preventDefault();e228Travel(travel.dataset.atlasTravel);}if(alternative){const q=E228_REGIONAL_QUESTS.find(q=>q.id===alternative.dataset.alternativeQuest);if(q)e228OpenAtlas(q.zone,q.id);}});
