
"use strict";
/* Conserva XP ya obtenida, nivel actual, guardados y recompensas de misiones anteriores.
   A partir del nivel 16 la XP por captura disminuye gradualmente. */
function e181XpFactor(){
 const level=e16FishLevel();
 if(level<=15)return 1;
 return Math.max(.22,1/(1+(level-15)*.095));
}
