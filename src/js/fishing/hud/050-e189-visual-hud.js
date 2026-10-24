
"use strict";
/* Decorative vector sprites are built locally: no network, no asset dependencies. */
function e189FishSVG(id){
 const key=(id||'').toLowerCase();
 const long=/anguila|morena|serpiente/.test(key),flat=/mantarraya|raya/.test(key),spiky=/pez_espada|lucio|tiburon|leviatan/.test(key);
 const palette=/salmon|trucha/.test(key)?['#f2a16f','#e05d58','#ffe3b2']:/atun|pez_espada|tiburon/.test(key)?['#8cb4cb','#3d7199','#d2e9f2']:/koi|carpa_dorada|pez_luna/.test(key)?['#f7ca65','#e9853b','#fff1b2']:/fantasma|abisal|cristal|luminoso|leviatan/.test(key)?['#b0d9ed','#6a8db7','#e9ffff']:/perca|lucio|esturion/.test(key)?['#91bc80','#407d67','#d7e9a4']:['#8ec9bd','#388e9d','#d7f6e8'];
 const [base,dark,light]=palette;
 const body=flat?'<path d="M13 37 Q38 7 70 29 L83 48 Q53 49 46 59 L35 49 Q24 54 13 37Z"/>':long?'<path d="M10 35 Q26 11 50 27 T80 30 Q86 45 65 49 T27 45 Q15 48 10 35Z"/>':'<path d="M12 35 Q32 11 64 23 L82 13 L78 35 L83 55 L64 47 Q35 63 12 35Z"/>';
 const fins=flat?'':long?'':'<path d="M34 23 L42 9 L56 22Z" fill="'+dark+'"/><path d="M41 49 L54 61 L62 46Z" fill="'+dark+'"/>';
 const nose=spiky?'<path d="M12 35 L1 31 L13 38" fill="'+dark+'"/>':'';
 return '<svg viewBox="0 0 94 70" role="img" aria-label="Ilustración de pez" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="e189fishgrad" x1="0" y1="0" x2="0.7" y2="1"><stop stop-color="'+light+'"/><stop offset=".48" stop-color="'+base+'"/><stop offset="1" stop-color="'+dark+'"/></linearGradient></defs>'+fins+'<g fill="url(#e189fishgrad)" stroke="'+dark+'" stroke-width="1.8">'+body+'</g>'+nose+'<path d="M24 33 Q45 42 67 33" stroke="'+dark+'" stroke-width="1" opacity=".45" fill="none"/><circle cx="24" cy="31" r="3.2" fill="#172f3a"/><circle cx="23.2" cy="30.2" r="1" fill="#fff"/><path d="M11 41 L19 42" stroke="'+dark+'" stroke-width="1.5" stroke-linecap="round"/></svg>';
}
function e189RodSVG(id){
 const key=(id||'').toLowerCase();
 const color=/coral/.test(key)?'#fb9180':/bruma|abis/.test(key)?'#ae9ce8':/guard|viejo/.test(key)?'#8fcb9e':/fibra|reforz/.test(key)?'#a7c2d6':/colecc/.test(key)?'#f0c96d':'#cf9d64';
 return '<svg viewBox="0 0 40 44" role="img" aria-label="Ilustración de caña" xmlns="http://www.w3.org/2000/svg"><path d="M8 39 Q20 15 32 3" stroke="'+color+'" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M8 39 L15 27" stroke="#624329" stroke-width="4.6" stroke-linecap="round"/><path d="M32 3 Q39 15 34 27" stroke="#c5d7db" stroke-width=".8" stroke-dasharray="2 1" fill="none"/><path d="M34 27 l-3 4 3 4 3-4Z" fill="'+color+'"/><circle cx="14" cy="28" r="4" fill="#d6b776" stroke="#664b2d" stroke-width="2"/><path d="M13 12 L19 16" stroke="'+color+'" stroke-width="1.8"/></svg>';
}
function e189Quality(q){const k=(q||'').toLowerCase();if(/legend/.test(k))return {stars:'★',color:'#ffd56b',label:'ORO · LEGENDARIO'};if(/enorme|huge/.test(k))return {stars:'★',color:'#cbd9e7',label:'PLATA · ENORME'};if(/grande|large/.test(k))return {stars:'★',color:'#c58d59',label:'BRONCE · GRANDE'};return {stars:'',color:'',label:''};}


const e189PrevPaint=e16Paint;
e16Paint=function(){e189PrevPaint();if(e16Session)e189UpdateArt();};
