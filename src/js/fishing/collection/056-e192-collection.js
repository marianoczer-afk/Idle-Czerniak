
"use strict";
/* Tres cañas nuevas: compras normales, guardado compatible con v7. */
const E192_RODS=[
 {id:'e192_rod_laguna',name:'Caña Esmeralda',price:4800,req:1,bonus:38,desc:'Control +9,5% de barra · picadas 16% más rápidas · hasta 350 kg'},
 {id:'e192_rod_coral',name:'Caña de Nácar',price:11200,req:1,bonus:43,desc:'Control +10,75% de barra · picadas 23% más rápidas · hasta 900 kg'},
 {id:'e192_rod_abyss',name:'Caña Astral',price:29000,req:1,bonus:49,desc:'Control +12,25% de barra · picadas 28% más rápidas · hasta 3000 kg'}
];
for(const r of E192_RODS){if(!E161_RODS.some(x=>x.id===r.id)){E161_RODS.push(r);E164_ROD_STATS.push({control:r.bonus,wait:r.id==='e192_rod_laguna'?16:r.id==='e192_rod_coral'?23:28,rare:r.id==='e192_rod_laguna'?17:r.id==='e192_rod_coral'?22:27,label:r.desc});}}
const e192OldLuck=e186LuckPercent;
e186LuckPercent=function(){const id=e161Rod()?.id||'';const bonus=id==='e192_rod_laguna'?17:id==='e192_rod_coral'?22:id==='e192_rod_abyss'?27:null;return bonus===null?e192OldLuck():Math.min(35,bonus+Math.floor((e16FishLevel()-1)/10));};
/* Ilustraciones SVG por especie: formas de crustáceo, calamar, raya, caballito,
   pez luna, tiburón, anguila y familias de peces; marcas y colores por ID. */
e189FishSVG=function(id){
 const key=(id||'mojarra').toLowerCase();
 const hash=[...key].reduce((a,c)=>(a*33+c.charCodeAt(0))>>>0,5381);
 const palettes={mojarra:['#b6b9aa','#687d79','#e9e5c9'],bagre:['#ae9879','#5c6258','#d7c6a1'],trucha:['#e0ab88','#647f77','#f8d6b5'],salmon:['#e88f7b','#a94e57','#ffd1ad'],carpa_dorada:['#eeb95b','#ba7032','#fff2b1'],trucha_arcoiris:['#a8c9b5','#6e85a5','#e9d4ae'],pez_fantasma:['#a8c9e4','#6e6da9','#f2f9ff'],koi_imperial:['#f2e5cc','#e08e43','#fff8e2'],esturion:['#9baba3','#4b6a65','#d3dfd1'],cangrejo_azul:['#74c9d9','#327a9f','#c9f7ff'],pez_luna:['#f6c980','#c98b59','#fff0c4'],caballito_mar:['#f0bd76','#c76c88','#ffe6ab'],morena:['#769a8d','#354e65','#c7cfab'],tiburon_arrecife:['#91bac6','#486f8d','#d5e7ed'],pez_linternilla:['#a5d7a5','#346c80','#edffe0'],calamar_abismo:['#b5a2e3','#64518f','#f0dcff'],pez_cristal:['#b8e3e8','#719cbe','#f4ffff'],leviatan:['#91b5db','#5359a0','#d5f8f3']};
 const p=palettes[key]||(/anguila|lucio|perca/.test(key)?['#a8b58c','#557b68','#e6d7a1']:/mantarraya|atun|espada/.test(key)?['#91bbd3','#466c97','#d8f3ff']:['#a7c7af','#598a84','#e9e8b7']);
 const [base,dark,light]=p,uid='e192'+hash.toString(16),eye='<circle cx="27" cy="32" r="3" fill="#15252e"/><circle cx="26.3" cy="31.2" r=".9" fill="white"/>';
 let parts='';
 if(/cangrejo/.test(key))parts='<ellipse cx="49" cy="36" rx="22" ry="15"/><path d="M31 30 L14 16 L6 22 L16 35 M67 30 L81 15 L90 22 L80 36 M35 47 L20 60 M45 50 L37 65 M59 50 L66 65 M66 46 L81 59" fill="none" stroke="'+dark+'" stroke-width="5" stroke-linecap="round"/><circle cx="42" cy="29" r="3" fill="#142631"/><circle cx="56" cy="29" r="3" fill="#142631"/>';
 else if(/calamar/.test(key))parts='<path d="M49 7 Q68 20 67 40 Q49 52 31 40 Q30 20 49 7Z"/><path d="M35 43 Q25 57 31 68 M43 45 Q40 57 42 70 M51 45 Q54 59 53 70 M59 44 Q70 58 65 68" fill="none" stroke="'+base+'" stroke-width="4" stroke-linecap="round"/><circle cx="43" cy="35" r="2.5" fill="#172c3b"/><circle cx="55" cy="35" r="2.5" fill="#172c3b"/>';
 else if(/caballito/.test(key))parts='<path d="M53 10 L68 16 L57 25 Q71 40 54 50 Q39 59 49 66 Q63 69 59 60 Q55 58 54 63 Q41 57 44 47 Q30 36 46 23 L42 16Z"/><path d="M41 29 L28 40 L43 43"/><circle cx="54" cy="20" r="2.5" fill="#19252b"/>';
 else if(/mantarraya|raya/.test(key))parts='<path d="M5 36 Q23 11 49 29 Q75 11 93 36 Q73 37 64 52 L50 46 L34 52 Q23 37 5 36Z"/><path d="M49 43 Q48 58 51 70" fill="none" stroke="'+dark+'" stroke-width="2"/><circle cx="42" cy="34" r="2" fill="#14222c"/><circle cx="56" cy="34" r="2" fill="#14222c"/>';
 else if(/anguila|morena/.test(key))parts='<path d="M9 39 Q27 10 49 27 T88 24 Q96 46 72 52 T30 47 Q15 55 9 39Z"/><path d="M12 37 Q35 28 60 42" fill="none" stroke="'+light+'" stroke-width="2"/>'+eye;
 else if(/pez_luna/.test(key))parts='<ellipse cx="49" cy="37" rx="26" ry="25"/><path d="M44 14 L55 1 L63 19 M45 60 L56 71 L63 55 M25 38 L10 28 L12 49"/><circle cx="38" cy="32" r="3" fill="#1d2b35"/>';
 else {
 const shark=/tiburon|leviatan/.test(key),sword=/espada/.test(key),long=/esturion|lucio/.test(key),body=long?'M10 35 Q30 21 72 27 L88 17 L83 36 L88 53 L72 45 Q29 54 10 35Z':'M10 35 Q28 14 66 24 L85 13 L80 36 L86 55 L66 47 Q28 60 10 35Z';
 parts='<path d="'+body+'"/><path d="M36 24 L47 '+(shark?'5':'13')+' L57 23Z" fill="'+dark+'"/><path d="M40 49 L53 62 L63 47Z" fill="'+dark+'"/><path d="M16 39 Q42 46 68 37" stroke="'+light+'" stroke-width="2" fill="none"/>'+(sword?'<path d="M11 33 L0 27 L11 37" fill="'+dark+'"/>':'')+eye;
 if(/koi|carpa/.test(key))parts+='<path d="M40 19 Q45 28 38 35 M60 28 Q53 36 60 47" fill="none" stroke="'+dark+'" stroke-width="6" opacity=".85"/>';
 if(/trucha|salmon/.test(key))parts+=[25,35,45,55].map((x,i)=>'<circle cx="'+x+'" cy="'+(i%2?28:39)+'" r="1.7" fill="'+dark+'"/>').join('');
 if(/linternilla/.test(key))parts+='<path d="M27 27 Q17 7 43 11" stroke="'+dark+'" stroke-width="2" fill="none"/><circle cx="43" cy="11" r="6" fill="#c8ffb6"/>';
 if(/leviatan/.test(key))parts+='<path d="M33 23 L30 8 L42 21 M57 23 L65 9 L66 27" fill="'+dark+'"/>';
 }
 return '<svg viewBox="0 0 98 74" role="img" aria-label="Ilustración de '+key.replaceAll('_',' ')+'" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="'+uid+'" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="'+light+'"/><stop offset=".55" stop-color="'+base+'"/><stop offset="1" stop-color="'+dark+'"/></linearGradient></defs><g fill="url(#'+uid+')" stroke="'+dark+'" stroke-width="1.8" stroke-linejoin="round">'+parts+'</g></svg>';
};
/* Cañas con siluetas y detalles particulares; no son simples cambios de color. */
e189RodSVG=function(id){
 const key=(id||'').toLowerCase(),abyss=/abyss|abis|astral/.test(key),coral=/coral|nacar/.test(key),emerald=/laguna|esmeralda/.test(key),mist=/bruma/.test(key),old=/viejo|bamboo|bambu|e16_rod/.test(key);
 const metal=abyss?'#bca6ff':coral?'#f7b8a4':emerald?'#80e5b1':mist?'#c1a4e9':old?'#d9ae6e':'#b7d5e3';
 const core=abyss?'#5351a3':coral?'#b9687e':emerald?'#317d69':old?'#835b39':'#536b84';
 const symbol=abyss?'<path d="M95 11 l5 -8 5 8 -5 8Z" fill="#e4d1ff"/>':coral?'<path d="M90 17 l-5 -9 m5 9 l6 -12 m-6 12 l10 -4" stroke="#ffb3b0" stroke-width="3"/>':emerald?'<path d="M93 18 Q83 8 94 4 Q104 10 93 18" fill="#8df6b0"/>':mist?'<circle cx="99" cy="13" r="5" fill="#c3a8ff" opacity=".8"/>':'';
 return '<svg viewBox="0 0 145 44" role="img" aria-label="Caña '+key+'" xmlns="http://www.w3.org/2000/svg"><path d="M7 35 Q68 30 130 7" stroke="#10151b" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M7 35 Q68 30 130 7" stroke="'+core+'" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M28 33 Q74 27 130 7" stroke="'+metal+'" stroke-width="1.7" fill="none"/><path d="M8 35 L34 32" stroke="'+(old?'#6f4a2f':'#273b4a')+'" stroke-width="8" stroke-linecap="round"/><path d="M11 34 L29 32" stroke="'+metal+'" stroke-width="1.3" stroke-dasharray="3 3"/><g fill="none" stroke="'+metal+'" stroke-width="1.8"><ellipse cx="58" cy="26" rx="3" ry="5"/><ellipse cx="88" cy="18" rx="2" ry="4"/><ellipse cx="115" cy="11" rx="1.5" ry="3"/></g><circle cx="40" cy="32" r="8" fill="'+core+'" stroke="'+metal+'" stroke-width="2"/><circle cx="40" cy="32" r="3" fill="'+metal+'"/><path d="M40 32 l-6 11" stroke="'+metal+'" stroke-width="2"/><path d="M130 7 Q142 12 135 28" stroke="#c8e2e9" stroke-width=".8" stroke-dasharray="2 2" fill="none"/><path d="M135 28 l-4 5 4 5 4-5Z" fill="'+metal+'"/>'+symbol+'</svg>';
};
const e192PriorPage=e16Page;
e16Page=function(){
 e192PriorPage();const page=document.getElementById('page_fishing');if(!page||!state)return;
 const book=page.querySelector('.e186Book'),zone=e165Zone();
 if(book){const cards=[...book.querySelectorAll('.e186Fish')],species=E16_FISH.filter(f=>zone.fish.includes(f.id));cards.forEach((card,i)=>{const f=species[i];if(!f||card.querySelector('.e192Sprite'))return;const icon=document.createElement('div');icon.className='e192Sprite';icon.innerHTML=e189FishSVG(f.id);const info=document.createElement('div');while(card.firstChild)info.append(card.firstChild);card.append(icon,info);});}
 const rods=page.querySelector('details:has(.fishRod)');if(rods){rods.querySelectorAll('.fishRod').forEach((row,i)=>{const r=E161_RODS[i];if(!r||row.querySelector('.e192RodShowcase'))return;const showcase=document.createElement('div');showcase.className='e192RodShowcase';showcase.innerHTML=e189RodSVG(r.id)+'<span>'+r.desc+'</span>';const parent=row.querySelector('div');if(parent)parent.append(showcase);});}
};
