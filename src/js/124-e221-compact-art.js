
'use strict';
function e221Art(kind){return '<span class="e221Art" data-art="'+kind+'" aria-hidden="true"></span>';}
function e221Header(node,kind,title,subtitle){
 if(!node)return;node.classList.add('e221Panel');const summary=node.querySelector(':scope>summary');if(!summary)return;
 summary.title=title+(subtitle?' · '+subtitle:'');summary.innerHTML=e221Art(kind)+'<span class="e221HeaderWords"><b>'+esc(title)+'</b><small>'+esc(subtitle)+'</small></span>';
}
function e221Decorate(){
 if(!state)return;
 const atlas=document.getElementById('fishingAtlas');if(atlas&&!atlas.querySelector(':scope>summary .e221Art'))e221Header(atlas,'atlas','Atlas de Pesca',atlas.querySelector(':scope>summary small')?.textContent||'');
 const journal=document.querySelector('.e181Journal');if(journal&&!journal.querySelector(':scope>summary .e221Art'))e221Header(journal,'journal','Diario de Pesca',journal.querySelector(':scope>summary')?.textContent.replace(/^.*?Diario de pesca\s*·?\s*/i,'')||'');
 const shop=document.getElementById('fishingRodShop');if(shop&&!shop.querySelector(':scope>summary .e221Art'))e221Header(shop,'shop','Tienda de cañas',shop.querySelector(':scope>summary small')?.textContent||'');
 const book=document.querySelector('#page_fishing .e186Book>summary');if(book&&!book.querySelector('.e221Art')){const title=book.textContent.replace(/^📘\s*/,''),parts=title.split(' · ');book.title=title;book.innerHTML=e221Art('collection')+'<span class="e221HeaderWords"><b>'+esc(parts.shift())+'</b><small>'+esc(parts.join(' · '))+'</small></span>';book.classList.add('e221BookHeader');}
 const skill=document.querySelector('#page_fishing .e163SkillHead>b');if(skill){skill.classList.add('e221SkillTitle');skill.innerHTML=e221Art('fishing')+'Pesca · Nivel '+e16FishLevel();}
 const cast=document.querySelector('#page_fishing [data-e161-toggle]');if(cast&&!e161Fishing&&!cast.querySelector('.e221Art')){const r=cast.getBoundingClientRect();if(r.width){cast.style.width=r.width+'px';cast.style.height=r.height+'px';cast.classList.add('e221Cast');cast.innerHTML=e221Art('cast')+'<span>Tirar la caña</span>';}}
 document.querySelectorAll('#page_fishing .e218Card img,#page_fishing .e218Detail img,#fishingRodShop img').forEach(img=>{img.loading='lazy';img.decoding='async';});
}


const e221PriorTab=selectWorkspaceTab;
selectWorkspaceTab=function(){const result=e221PriorTab.apply(this,arguments);e221Decorate();return result;};
