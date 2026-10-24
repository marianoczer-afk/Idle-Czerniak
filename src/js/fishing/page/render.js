// Single page lifecycle. Presentation phases never call a previous e16Page.
let fishingPageShop,fishingPageZoneSync;
/* @include src/js/fishing/page/base.js */
/* @include src/js/fishing/page/zone-and-quests.js */
/* @include src/js/fishing/page/collection-and-controls.js */
/* @include src/js/fishing/page/artwork.js */
function e16Page(){
 if(state)e234MigrateRegional(state);
 e231RenderDepth++;
 try {
  if(!fishingFinishDepth){
   if(state)e227MigrateMastery(state);
   fishingRenderDepth++;
   try {
    e216Remember();fishingPageShop.remember();
    const previousShop=document.getElementById('fishingRodShop');
    const fold=document.querySelector('#page_fishing .e194QuestFold');if(fold)e194QuestOpen=fold.open;
    const book=document.querySelector('#page_fishing .e186Book');if(book)e186BookOpen=book.open;
    const species=document.querySelector('#page_fishing .e173Species');if(species)e173SpeciesOpen=species.open;
    fishingRenderBase();
    fishingRenderZoneAndQuests();
    fishingRenderCollectionAndControls();
    fishingRenderPageArtwork();
    fishingPageZoneSync();
    fishingPageShop.render(previousShop);
   } finally {fishingRenderDepth--;if(!fishingRenderDepth){e16Paint();measureDock();}}
   e218Journal();e221Decorate();e227RenderQuests();e228Presentation();e229Polish();
  }
  const panel=document.getElementById('e16GamePanel');
  if(panel&&!panel.querySelector('.e231StageScenery'))panel.insertAdjacentHTML('afterbegin',e227Illustration('ui','water','e231StageScenery',true));
 } finally {if(!--e231RenderDepth){e231QuestCache=null;e231ReferenceCache=null;}}
}
