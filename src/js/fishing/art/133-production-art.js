'use strict';
/* @include src/catalogs/133-art-frames.js */
function e227Illustration(kind,id,css='',slice=false){
 const frame=E227_ART[kind+':'+id];if(!frame)return '';
 return `<svg class="${css}" viewBox="0 0 ${frame.width} ${frame.height}" preserveAspectRatio="xMidYMid ${slice?'slice':'meet'}" role="img" aria-label="${esc((kind==='fish'?E16_FISH.find(f=>f.id===id)?.name:kind==='zone'?E165_ZONES.find(z=>z.id===id)?.name:null)||id)}"><use href="#${frame.symbol}" width="${frame.width}" height="${frame.height}"/></svg>`;
}
function e227ZoneArt(zone,css=''){return e227Illustration('zone',zone.id,css,true);}
const e227PreviousFishArt=e189FishSVG;
e189FishSVG=function(id){return e227Illustration('fish',id,'fishIllustration')||e227PreviousFishArt(id);};
const e227PreviousRodArt=e194RodArt;
e194RodArt=function(id){return e227Illustration('rod',id,'rodIllustration')||e227PreviousRodArt(id);};
function e227DecorateFishing(){
 const page=document.getElementById('page_fishing');if(!page||!state)return;
 const cast=page.querySelector('[data-e161-toggle] .e221Art');if(cast&&!cast.querySelector('svg')){cast.classList.add('e227ControlArt');cast.innerHTML=e227Illustration('ui','cast','',true);}
 const tank=page.querySelector('#e16Tank');if(tank&&!tank.querySelector('.e227WaterArt'))tank.insertAdjacentHTML('afterbegin',fishingZoneScenery('e227WaterArt'));
}
// Decoration is tied to the existing page lifecycle; no observer or frame loop.
const e227PreviousDecoration=e221Decorate;
e221Decorate=function(){e227PreviousDecoration();e227DecorateFishing();};
