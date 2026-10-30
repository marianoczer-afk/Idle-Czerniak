'use strict';
const E241_ATLAS="{{asset:1e2edc663a4810e6f631532d}}";
function e241Art(i){return `<span class="e241Art" aria-hidden="true" style="--x:${i%4};--y:${Math.floor(i/4)};background-image:url('${E241_ATLAS}')"></span>`;}
function e241Decorate(){for(const [id,i]of [['fishing',0],['souls_train',1],['souls_arena',2],['souls_shop',3]]){const el=document.querySelector('.workspaceTabs [data-ui-tab="'+id+'"]');if(el&&!el.querySelector('.e241Art'))el.insertAdjacentHTML('afterbegin',e241Art(i));}}
new MutationObserver(e241Decorate).observe(document.body,{childList:true,subtree:true});e241Decorate();
function e241FrameSize(){const frame=document.getElementById('soulsFrame39');if(!frame)return;const header=document.querySelector('.globalHeader');const height=Math.max(360,Math.min(1000,innerHeight-(header?.getBoundingClientRect().height||65)-16));frame.style.height=height+'px';}
IdleSoulsHost.resize=function(win){if(document.getElementById('soulsFrame39')?.contentWindow===win)e241FrameSize();};addEventListener('resize',e241FrameSize);
// New catches pay more as fishing progression advances. Existing wallet and XP stay intact.
const E241_ORIGINAL_PRICES=Object.fromEntries(E16_FISH.map(f=>[f.id,f.price]));
for(const fish of E16_FISH)fish.price=Math.round(fish.price*(1.15+Math.min(1,Math.max(0,fish.req||0)/80)*.25));
// Preserve the horizontal artwork and recolour only its subject, never the zone background.
function e241RodPalette(svg,id){let hash=0;for(const ch of id)hash=(hash*31+ch.charCodeAt(0))>>>0;const hue=[0,32,75,145,185,225,275,320][hash%8];return svg.replace(/class="e231Subject"/g,`class="e231Subject" style="filter:hue-rotate(${hue}deg) saturate(1.2)"`);}
const e241RodBefore=e194RodArt,e241HudBefore=e230HudArt;
e194RodArt=function(id){return e241RodPalette(e241RodBefore(id),id);};e239RodArt=e194RodArt;
e230HudArt=function(kind,id,...args){const svg=e241HudBefore(kind,id,...args);return kind==='rod'?e241RodPalette(svg,id):svg;};
