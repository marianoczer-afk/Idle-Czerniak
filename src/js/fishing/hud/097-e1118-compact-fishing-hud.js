
"use strict";
function e1118SyncHud(){
 const dock=document.getElementById('combatDock');
 if(!dock?.classList.contains('e188FishingMode')||!state)return;
 const vitals=dock.querySelector('.dockVitals');if(!vitals)return;
 let tile=vitals.querySelector('.e1118Zone');
 if(!tile){tile=document.createElement('div');tile.className='e1118Zone';vitals.prepend(tile);}
 const zone=typeof e165Zone==='function'?e165Zone():null;
 const zoneName=zone?.name||zone?.title||'Zona de pesca';
 const id=String(zone?.id||'').toLowerCase();
 const icon=/mar|costa|oceano|abis/.test(id)?'🌊':/pantano|cienaga/.test(id)?'🌿':/rio/.test(id)?'🏞️':/laguna|lago/.test(id)?'🏕️':'🌲';
 if(tile.dataset.zone!==id){tile.dataset.zone=id;tile.innerHTML='<span class="e1118Scene">'+icon+'</span><small></small>';}
 e215SetText(tile.querySelector('small'),zoneName);

}
const e1118PrevHud=e188UpdateHud;
e188UpdateHud=function(){const result=e1118PrevHud();e1118SyncHud();return result;};
const e1118PrevRender=renderGame;
renderGame=function(){const result=e1118PrevRender();e1118SyncHud();return result;};
