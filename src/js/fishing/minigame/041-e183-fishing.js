
"use strict";
// Esta capa no altera el motor de pesca ni los guardados v7.


let e183LastQuality=null;
const e183PreviousFinish=e16Finish;
e16Finish=function(won){
 const fish=won?e16Session?.fish:null;
 const before=fish?e18Record()?.bySpecies?.[fish.id]?.total||0:0;
 e183PreviousFinish(won);
 if(!fish)return;
 // El wrapper de trofeos puede emitir un segundo aviso; conservamos la calidad si aparece.
 const quality=(e16Result.match(/Ejemplar\s+(¡LEGENDARIO!|¡ENORME!|Grande)/)||[])[1]||'';
 e183LastQuality={fish:fish.name,label:quality,at:Date.now()};
 // Re-render final después de actualizar el resultado, sin alterar XP ni precio.
 e16Page();
};
