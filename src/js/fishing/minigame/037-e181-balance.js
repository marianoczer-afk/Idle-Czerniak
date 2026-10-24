
"use strict";
/* Conserva XP ya obtenida, nivel actual, guardados y recompensas de misiones anteriores.
   A partir del nivel 16 la XP por captura disminuye gradualmente. */
function e181XpFactor(){
 const level=e16FishLevel();
 const permanent=typeof e232PermanentBonus==='function'?e232PermanentBonus().xp:0;
 return (level<=15?1:Math.max(.22,1/(1+(level-15)*.095)))*(1+permanent);
}
