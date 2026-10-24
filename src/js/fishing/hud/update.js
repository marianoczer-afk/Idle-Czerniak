// One HUD lifecycle; the order preserves layout, menu behavior and live XP.
let fishingHudMenuSync,fishingHudXpSync;
function fishingRenderHudBase(){
 const dock=document.getElementById('combatDock');if(!dock)return;
 const active=!!(state&&ready&&e161OnPage()&&!document.getElementById('gameScreen')?.classList.contains('hidden'));
 dock.classList.toggle('e188FishingMode',active);
 if(!active){e215PlaceXp(false);measureDock();return;}
 const node=e188HudNode();if(!node)return;
 measureDock();
}
function e188UpdateHud(){
 if(!fishingFinishDepth){
  fishingRenderHudBase();
  e189UpdateArt();
  e194UpdateDockRod();
  e1107Sync();
  e1118SyncHud();
  fishingHudMenuSync();
  fishingHudXpSync();
  fishingPageZoneSync();
  e211SyncHud();
 }
 // This outer artwork phase also ran when the transaction guard skipped updates.
 e229Hud();
}
