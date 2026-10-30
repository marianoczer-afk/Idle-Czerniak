
'use strict';
(function(){
 const ids=()=>typeof E165_ZONES!=='undefined'?E165_ZONES:[];
 function decorate(){
  document.querySelectorAll('.e1120Menu[data-type="zone"]').forEach(menu=>{
   const choices=menu.querySelectorAll('.e1120Choice');
   choices.forEach((btn,i)=>{
    if(btn.classList.contains('e1114ScenicChoice')||btn.classList.contains('e228ZoneChoice'))return;
    const zone=ids()[i];if(!zone)return;
    const art=window.e1114ZoneImages||{};
    if(typeof e227ZoneArt==='function'&&e227ZoneArt(zone)){btn.insertAdjacentHTML('afterbegin',e227ZoneArt(zone,'e1114ZoneThumb'));btn.classList.add('e1114ScenicChoice');return;}
    const img=document.createElement('img');img.className='e1114ZoneThumb';
    img.alt='Paisaje de '+zone.name;img.loading='eager';img.src=e221ZoneImage(zone)||art.muelle||'';
    btn.insertBefore(img,btn.firstChild);btn.classList.add('e1114ScenicChoice');
   });
  });
 }
 const observer=new MutationObserver(decorate);
 function start(){observer.observe(document.body,{childList:true});decorate();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
