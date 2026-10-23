
"use strict";
/* Colección visual vectorial autónoma: funciona offline y no modifica partidas. */
function e1113Hash(s){let h=2166136261;for(const c of String(s)){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function e1113RodTheme(id){
 const k=String(id||'').toLowerCase();
 if(/tiempo|time/.test(k))return ['#2aaea9','#e1bb70','#77dce5','time'];
 if(/solar|sol/.test(k))return ['#b98a37','#ffe4a1','#f2bb52','sun'];
 if(/bruma|mist/.test(k))return ['#567c9d','#c4e5f5','#79c9ec','mist'];
 if(/cost|mar|ocean/.test(k))return ['#2f8caa','#e2d9a5','#6dd7d5','sea'];
 if(/guard|rio|river/.test(k))return ['#51745a','#e0b66f','#7bc4a3','river'];
 if(/bamb|bamboo/.test(k))return ['#718846','#e0c477','#a8ca64','bamboo'];
 if(/reforz|steel|acero|fibra/.test(k))return ['#536d85','#d8e3ec','#7cbdde','steel'];
 if(/esmer|laguna/.test(k))return ['#387b5b','#c5e3a1','#80e8aa','emerald'];
 if(/coral|nacar|arrecife/.test(k))return ['#ad6677','#ffe1c7','#f4a6a6','coral'];
 if(/abis|abyss|sombr/.test(k))return ['#594577','#d8b7ff','#b488ed','abyss'];
 if(/astral|celest/.test(k))return ['#5275af','#f4e2ac','#b6cfff','astral'];
 if(/colec|trofeo/.test(k))return ['#9a7844','#f2d78d','#e9bf6a','trophy'];
 if(/viejo|pescador/.test(k))return ['#825e3d','#d6ba83','#b99962','old'];
 return ['#687e81','#e2d2a7','#91b9b7','classic'];
}
function e194RodArt(id){
 const [body,metal,accent,kind]=e1113RodTheme(id),uid='ar'+e1113Hash(id).toString(36);
 const gold=/sun|time|astral|trophy/.test(kind),magic=/mist|emerald|abyss|astral|time|sun/.test(kind);
 const decoration={
 bamboo:'<g stroke="#d6c27b" stroke-width="2"><path d="M66 58l3 -12M90 55l2 -12M115 52l2 -10"/></g><path d="M117 49q-16 -18 -24 -10q13 13 24 10M139 47q9 -21 19 -18q-5 15 -19 18" fill="#8db46d" stroke="#537c40"/>',
 steel:'<path d="M52 59L140 50" stroke="#e0e9f4" stroke-width="2" stroke-dasharray="13 4"/><path d="M167 45l-10 -11 20 3 8 8Z" fill="#9bb3c8"/>',
 sea:'<path d="M315 27q8 -13 16 -3q-8 10 -16 3M347 23q8 -13 16 -3q-8 10 -16 3" fill="#b5e8ec"/><path d="M427 12q-9 15 -2 20q11 -10 2 -20" fill="#a4dbe2"/>',
 river:'<path d="M95 55q10 -17 22 -4M133 50q12 -18 24 -6" stroke="#b8e6ca" stroke-width="2" fill="none"/>',
 old:'<path d="M40 59l13 -4m0 4l12 -5m1 5l12 -6" stroke="#e2c18b" stroke-width="1.4"/>',
 mist:'<path d="M330 27q25 -24 48 -12q-20 1 -28 17M375 20q20 -12 38 -6" stroke="#b9eaff" stroke-width="3" opacity=".6" fill="none"/>',
 emerald:'<path d="M360 20l10 -18 12 16 -10 13Z" fill="#83f5b4" stroke="#dcffe3" stroke-width="2"/><path d="M290 32q13 -18 24 -14" stroke="#a0dc83" stroke-width="3" fill="none"/>',
 coral:'<path d="M334 25q-4 -17 -14 -18m14 18q10 -18 20 -14m-20 14q15 -6 25 0" stroke="#ffb7a7" stroke-width="4" fill="none"/>',
 abyss:'<path d="M315 26l15 -21 14 16 -15 19Z" fill="#a980df"/><path d="M367 21l9 -17 8 15 -10 12Z" fill="#cfb2ff"/>',
 astral:'<path d="M337 20l6 -13 6 13 13 6 -13 5 -6 12 -6 -12 -13 -5Z" fill="#e8e5ff"/>',
 sun:'<circle cx="354" cy="20" r="10" fill="#fce3a0"/><path d="M354 3v-8m0 42v9m-17 -26h-9m52 0h-9m-29 -12l-6 -6m36 36l6 6" stroke="#f4c56e" stroke-width="3"/>',
 time:'<circle cx="352" cy="22" r="15" stroke="#bde8e3" stroke-width="3" fill="#2b5664"/><path d="M352 11v11l9 5" stroke="#f9e4b2" stroke-width="3" fill="none"/><path d="M332 5l-7 -7m48 48l7 7" stroke="#bde8e3" stroke-width="2"/>',
 trophy:'<path d="M352 3l5 11 12 1 -9 8 3 12 -11 -6 -11 6 3 -12 -9 -8 12 -1Z" fill="#f2d78d"/>'
 }[kind]||'';
 const flecks=magic?Array.from({length:7},(_,i)=>{const x=245+i*29,y=13+(e1113Hash(id+i)%19);return `<circle cx="${x}" cy="${y}" r="${i%3===0?2.3:1.3}" fill="${accent}" opacity=".7"/>`}).join(''):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 88" role="img" aria-label="Ilustración de caña ${kind}"><defs><linearGradient id="${uid}shaft" x1="0" y1="1" x2="1" y2="0"><stop stop-color="${body}"/><stop offset=".47" stop-color="${metal}"/><stop offset="1" stop-color="${accent}"/></linearGradient><radialGradient id="${uid}reel"><stop stop-color="${metal}"/><stop offset=".55" stop-color="${body}"/><stop offset="1" stop-color="#14202a"/></radialGradient></defs>
 <path d="M20 65Q220 50 474 9" stroke="#101a1e" stroke-width="12" fill="none" stroke-linecap="round"/>
 <path d="M20 65Q220 50 474 9" stroke="url(#${uid}shaft)" stroke-width="6.8" fill="none" stroke-linecap="round"/>
 <path d="M21 65Q76 61 129 56" stroke="#4a3427" stroke-width="14" fill="none" stroke-linecap="round"/>
 <path d="M27 61Q75 57 126 52" stroke="${metal}" stroke-width="2.3" fill="none" stroke-dasharray="5 4"/>
 <g stroke="${metal}" stroke-width="2.4" fill="none"><ellipse cx="211" cy="49" rx="5" ry="9"/><ellipse cx="297" cy="36" rx="4.5" ry="7"/><ellipse cx="390" cy="23" rx="3.3" ry="5.3"/><ellipse cx="457" cy="12" rx="2.4" ry="3.8"/></g>
 <path d="M143 56l-12 21" stroke="${metal}" stroke-width="5" stroke-linecap="round"/>
 <circle cx="152" cy="54" r="19" fill="url(#${uid}reel)" stroke="${metal}" stroke-width="3.5"/><circle cx="152" cy="54" r="12" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="4 3"/><circle cx="152" cy="54" r="5" fill="${metal}"/>
 <path d="M168 66l17 8" stroke="${metal}" stroke-width="4"/><circle cx="186" cy="74" r="5" fill="${body}" stroke="${metal}" stroke-width="2"/>
 <path d="M474 9Q512 21 496 60" stroke="#b2d8dc" stroke-width="1.4" stroke-dasharray="3 3" fill="none"/>
 <path d="M496 60l-5 9 5 9 5 -9Z" fill="${gold?'#f2d78d':accent}" stroke="${metal}" stroke-width="1.5"/>
 ${decoration}${flecks}</svg>`;
}
function e1113FishStyle(id){
 const k=String(id||'').toLowerCase(),h=e1113Hash(k);
 const palettes=[
 ['#8bc9bd','#327e8b','#d7fff3'],['#f4b184','#bc6152','#fff0c8'],
 ['#a8c2d4','#467a99','#e3f7ff'],['#e5c66e','#b17a3f','#fff0b4'],
 ['#9cbb85','#54744b','#e0f1b8'],['#bdabd7','#655e96','#efe6ff'],
 ['#f6a49c','#b95d78','#ffe5db'],['#8bc5e8','#3579b4','#d2f5ff']
 ];
 const pal=/trucha|salmon/.test(k)?palettes[1]:/espada|tiburon|atun/.test(k)?palettes[2]:/carpa|koi|dorad/.test(k)?palettes[3]:/lucio|perca|esturion/.test(k)?palettes[4]:/fantasma|abis|sombra/.test(k)?palettes[5]:/coral|arrecife/.test(k)?palettes[6]:palettes[h%palettes.length];
 return {pal,h,kind:/anguila|morena|serpiente/.test(k)?'eel':/raya|manta/.test(k)?'ray':/tiburon/.test(k)?'shark':/pez_espada|espada/.test(k)?'sword':/globo|erizo/.test(k)?'puffer':/bagre/.test(k)?'catfish':'fish'};
}
function e189FishSVG(id){
 const {pal,h,kind}=e1113FishStyle(id),[base,dark,light]=pal,u='f'+h.toString(36),spots=(h%3),long=kind==='eel';
 const body=kind==='ray'?'M8 37Q30 6 57 27Q73 22 83 36Q61 47 54 55L40 47Q21 54 8 37Z':long?'M8 36Q22 18 43 29Q66 38 80 26Q85 41 66 49Q43 53 25 42Q13 48 8 36Z':kind==='puffer'?'M17 36Q17 15 47 13Q76 13 77 35Q76 58 46 57Q17 56 17 36Z':'M13 36Q30 15 56 23L78 15L75 35L81 55L55 48Q30 57 13 36Z';
 const fin=kind==='ray'||long?'':`<path d="M35 23L${38+h%7} 8L55 22Z" fill="${dark}" stroke="${light}" stroke-width="1.1"/><path d="M43 48L52 62L63 47Z" fill="${dark}"/>`;
 const marking=spots===0?`<g fill="${light}" opacity=".65"><circle cx="40" cy="30" r="2.6"/><circle cx="52" cy="35" r="3"/><circle cx="62" cy="29" r="2"/></g>`:spots===1?`<path d="M38 24q6 12 -1 24m16 -24q7 12 0 23" fill="none" stroke="${dark}" stroke-width="3" opacity=".55"/>`:`<path d="M33 31q17 10 35 0" fill="none" stroke="${light}" stroke-width="3" opacity=".75"/>`;
 const extras=kind==='catfish'?`<path d="M21 39Q4 44 5 52M24 38Q10 29 3 29" stroke="${dark}" stroke-width="1.5" fill="none"/>`:kind==='sword'?`<path d="M15 35L0 29L16 39" fill="${light}" stroke="${dark}"/>`:kind==='shark'?`<path d="M38 24L44 2L54 24" fill="${dark}"/>`:kind==='puffer'?Array.from({length:7},(_,i)=>`<path d="M${26+i*7} ${i%2?53:17}l3 ${i%2?9:-9} 4 ${i%2?-9:9}" fill="${light}"/>`).join(''):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 70" role="img" aria-label="Pez ilustrado"><defs><linearGradient id="${u}" x1="0" y1="0" x2=".6" y2="1"><stop stop-color="${light}"/><stop offset=".5" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>${fin}<path d="${body}" fill="url(#${u})" stroke="${dark}" stroke-width="2"/>${marking}${extras}<path d="M30 26Q35 35 29 44" stroke="${dark}" stroke-width="1.2" opacity=".55" fill="none"/><circle cx="24" cy="31" r="3.3" fill="#102633"/><circle cx="23" cy="30" r="1.15" fill="#fff"/><path d="M12 42l8 1" stroke="${dark}" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}
function e1113RefreshArt(){
 document.querySelectorAll('#page_fishing .e193RodImage,#page_fishing .e194QuestRodArt').forEach(node=>{
  const row=node.closest('.fishRod,.e17Quest,.e171Quest,.e187Quest'),name=row?.querySelector('b')?.textContent?.replace(/^✓\s*/,'').trim();
  const rods=[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),...(typeof E187_ROD!=='undefined'?[E187_ROD]:[]),...(typeof E18_ROD!=='undefined'?[E18_ROD]:[])];
  const rod=rods.find(r=>r?.name===name);
  if(rod)node.innerHTML=e194RodArt(rod.id);
 });
}
const e1113PriorPage=e16Page;
e16Page=function(){const r=e1113PriorPage();e1113RefreshArt();return r;};
