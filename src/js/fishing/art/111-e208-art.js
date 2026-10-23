
/* @include src/catalogs/111-e208-art-e208_rod_art.js */
/* @include src/catalogs/111-e208-art-e208_fish_art.js */
function e208AtlasSVG(type,index,label){
 const height=type==='rod'?[199,198,197,192,238][Math.floor(index/2)]:512,width=type==='rod'?768:512;
 return `<svg class="${type==='rod'?'rodIllustration':'fishIllustration'}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg"><title>${esc(label)}</title><use href="#argentum-${type}-${index}" width="${width}" height="${height}"/></svg>`;
}
const e208PreviousRodArt=e194RodArt;
e194RodArt=function(id){
 const rod=E208_CATALOG.find(r=>r.id===id),index=rod?.art??E208_ROD_ART[id];
 if(index===undefined)return e208PreviousRodArt(id);
 return e208AtlasSVG('rod',index,rod?.name||[...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD].find(r=>r.id===id)?.name||'Caña de pesca');
};
const e208PreviousFishArt=e189FishSVG;
e189FishSVG=function(id){
 const index=E208_FISH_ART[id];
 return index===undefined?e208PreviousFishArt(id):e208AtlasSVG('fish',index,E16_FISH.find(f=>f.id===id)?.name||id);
};

