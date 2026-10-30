'use strict';
// Header is presentation only: real character XP, original save/import/DEV actions.
let e227GeneralDropTimer=0,e227GeneralPending=0,e227GeneralFrame=0,e227GeneralOwner=null;
function e227ClearGeneralDrop(){clearTimeout(e227GeneralDropTimer);cancelAnimationFrame(e227GeneralFrame);e227GeneralFrame=0;e227GeneralPending=0;e227GeneralOwner=null;document.querySelector('.generalXPDrop')?.remove();}
function e227TopShell(){
 const header=document.querySelector('body>header');if(header.querySelector('.generalIdentity'))return header;
 header.classList.add('globalHeader');
 const top=document.createElement('div');top.className='globalHeaderTop';
 const identity=document.createElement('div');identity.className='generalIdentity';identity.innerHTML='<b id="generalCharacter"></b><div class="generalXP"><span id="generalXPText"></span><div class="generalXPTrack" role="progressbar" aria-label="Experiencia general del personaje" aria-valuemin="0" aria-valuemax="100"><span id="generalXPBar"></span></div></div>';
 const title=header.querySelector('h1');top.append(identity,title);header.prepend(top);
 const nav=document.createElement('div');nav.className='globalHeaderNav';
 const settings=document.createElement('details');settings.id='gameSettings';settings.innerHTML='<summary aria-label="Configuración" title="Configuración"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 2-1 3-3 1-2 3 2 3-1 3 3 3 3-1 3 2 3-2 3 1 3-3-1-3 2-3-2-3-3-1-1-3Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="11" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span class="saveIndicator" aria-hidden="true"></span></summary><div class="settingsPanel"><h2>Configuración</h2><div id="settingsSaveState" role="status"></div><div class="settingsActions"></div><div class="settingsTechnical"><small>Estable 41 · Guardado automático · v7 · hasta cinco personajes</small><div id="settingsLastSave"></div></div></div>';
 nav.append(settings);header.append(nav);
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>document.documentElement.style.setProperty('--global-header-height',header.getBoundingClientRect().height+'px')).observe(header);
 const status=header.querySelector('#saveStatus');if(status){settings.querySelector('#settingsSaveState').append(status);if(status.classList.contains('warn')){settings.querySelector('summary').classList.add('saveError');settings.querySelector('summary').setAttribute('aria-label','Configuración · Atención: '+status.textContent);}}
 e227MoveDev();return header;
}
function e227MoveDev(){const button=document.getElementById('devModeToggle'),host=document.querySelector('.settingsActions');if(button&&host)host.append(button);}
function e227InstallTop(){
 const header=e227TopShell(),root=document.getElementById('uiWorkspace');
 const active=!!(state&&ready&&!document.getElementById('gameScreen').classList.contains('hidden'));
 document.body.classList.toggle('hasActiveCharacter',active);
 if(!root||!state){e227UpdateTop();return;}
 const tabs=root.querySelector('.workspaceTabs');if(tabs){header.querySelector('.workspaceTabs')?.remove();header.querySelector('.globalHeaderNav').prepend(tabs);}
 if(typeof e241Decorate==='function')e241Decorate();
 // Move the original controls, preserving data actions and file inputs.
 const save=root.querySelector('details[data-ui-panel="save"]'),host=header.querySelector('.settingsActions');
 if(save){for(const child of [...host.children])if(child.id!=='devModeToggle')child.remove();const body=save.querySelector('.sectionBody');if(body)host.prepend(...body.childNodes);save.remove();}
 root.querySelector('.sidebarQuickActions')?.remove();
 const workspaceHeader=root.querySelector('.workspaceHeader');if(workspaceHeader){const rest=root.querySelector('#restBtn')||workspaceHeader.querySelector('[data-act="rest"]');if(rest){const contextual=document.createElement('div');contextual.className='combatContextActions';contextual.append(rest);root.querySelector('#page_combat')?.prepend(contextual);}workspaceHeader.remove();}
 const session=document.getElementById('e13SessionBox');if(session)root.querySelector('#page_combat')?.prepend(session);
 // Duplicate identity/progression is now in the top row. Keep HP, MP, stats and rest.
 const attributes=root.querySelector('details[data-ui-panel="attributes"] .sectionBody');if(attributes){for(const id of ['lvlText','xpText','xpBar']){const n=attributes.querySelector('#'+id);if(n){if(id==='xpBar')n.parentElement.hidden=true;else n.closest('.row').hidden=true;}}attributes.querySelector(':scope>.muted')?.setAttribute('hidden','');}
 if(!host.querySelector('[data-previous-stable]'))host.insertAdjacentHTML('beforeend','<p><a data-previous-stable href="https://github.com/marianoczer-afk/Idle-Czerniak/blob/59e988e2ab95b7d6a7c719f5b500ffe20f9ab4d7/index.html" target="_blank" rel="noopener">Versión anterior · Estable 33</a></p>');
 e227MoveDev();e227UpdateTop();
}
function e227UpdateTop(){
 const header=document.querySelector('.globalHeader');if(!header)return;
 e215SetText(document.getElementById('settingsLastSave'),lastSave?'Último guardado correcto: '+lastSave:'Todavía no hay un guardado confirmado');
 const active=!!(state&&ready&&!document.getElementById('gameScreen').classList.contains('hidden'));document.body.classList.toggle('hasActiveCharacter',active);
 const title=header.querySelector('h1');title.textContent=active?'ARGENTUM IDLE ONLINE':'Argentum Idle Online · Estable 41';
 if(!active){e227ClearGeneralDrop();return;}
 const level=levelFromXp(state.xp),low=xpFor(level),high=xpFor(level+1),earned=Math.max(0,state.xp-low),need=high-low,percent=clamp(earned/need*100,0,100);
 e215SetText(document.getElementById('generalCharacter'),`${state.name} · ${classById(state.cls).name} · ${raceById(state.race).name} · Nv ${level}`);
 e215SetText(document.getElementById('generalXPText'),`${fmt(earned)} / ${fmt(need)} XP`);
 const bar=document.getElementById('generalXPBar');bar.style.width=percent+'%';bar.parentElement.setAttribute('aria-valuenow',percent.toFixed(1));bar.parentElement.setAttribute('aria-valuetext',`${fmt(earned)} de ${fmt(need)} XP para nivel ${level+1}`);
 if(e227GeneralOwner&&e227GeneralOwner!==state)e227ClearGeneralDrop();
}
function e227GeneralDrop(s,amount){
 if(!(amount>0)||s!==state||!ready||busy||managing||OFF.active||document.hidden||gameMode==='dev')return;
 e227GeneralOwner=s;e227GeneralPending+=amount;if(e227GeneralFrame)return;
 e227GeneralFrame=requestAnimationFrame(()=>{e227GeneralFrame=0;const value=e227GeneralPending;e227GeneralPending=0;if(state!==s||document.hidden)return;
 const host=document.querySelector('.generalXP');if(!host)return;host.querySelector('.generalXPDrop')?.remove();const drop=document.createElement('span');drop.className='generalXPDrop';drop.textContent='+'+fmt(value)+' XP';drop.setAttribute('aria-live','polite');host.append(drop);clearTimeout(e227GeneralDropTimer);e227GeneralDropTimer=setTimeout(()=>drop.remove(),1750);});
}
const e227PreviousXP=gainCharacterXP;
gainCharacterXP=function(s,n){const amount=e227PreviousXP(s,n);e227GeneralDrop(s,amount);return amount;};
const e227PreviousStatus=setStatus;
setStatus=function(msg,warn){e227PreviousStatus(msg,warn);const summary=document.querySelector('#gameSettings>summary');if(summary){summary.classList.toggle('saveError',!!warn);summary.setAttribute('aria-label',warn?'Configuración · Atención: '+msg:'Configuración · '+(lastSave?'Último guardado '+lastSave:'Guardado automático'));}const panel=document.querySelector('.settingsTechnical');if(panel)panel.title=msg;};
const e227PreviousRender=renderGame;
renderGame=function(){e227ClearGeneralDrop();document.querySelector('.globalHeader .workspaceTabs')?.remove();const result=e227PreviousRender();e227InstallTop();return result;};
const e227PreviousLive=updateLive;
updateLive=function(){const result=e227PreviousLive();e227UpdateTop();return result;};
const e227PreviousShowGame=showGame;
showGame=function(){const result=e227PreviousShowGame();e227InstallTop();return result;};
const e227PreviousCharacters=showCharacters;
showCharacters=function(){e227ClearGeneralDrop();const result=e227PreviousCharacters();e227TopShell();e227UpdateTop();return result;};
const e227PreviousModeChrome=refreshModeChrome;
refreshModeChrome=function(){const result=e227PreviousModeChrome();e227MoveDev();return result;};
function e227CleanDownload(page){const header=page.querySelector('body>header');header.className='';header.innerHTML='<h1>Argentum Idle Online · Estable 41</h1><div id="saveStatus">Cargando...</div>';page.querySelectorAll('.generalXPDrop').forEach(n=>n.remove());page.querySelector('body').classList.remove('hasActiveCharacter');}
document.addEventListener('click',event=>{const panel=document.getElementById('gameSettings');if(panel?.open&&!panel.contains(event.target))panel.open=false;});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){const panel=document.getElementById('gameSettings');if(panel?.open){panel.open=false;panel.querySelector('summary').focus();}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)e227ClearGeneralDrop();});
