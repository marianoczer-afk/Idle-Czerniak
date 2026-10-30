// Shared sprite sheets, installed once per iframe rather than repeated in every icon.
const sheet=document.createElement('style');sheet.id='shared-art41';
sheet.textContent=`.art41{background-image:url("{{asset:1e2edc663a4810e6f631532d}}")}.art41.gear41{background-image:url("{{asset:e2b26a532d7e2773acd12aff}}")}`;
document.head.append(sheet);
export const modeArt41={str:4,def:5,acc:6,dodge:7,crit:8};
export function art41(index){return `<span class="art41" aria-hidden="true" style="--x:${index%4};--y:${Math.floor(index/4)}"></span>`;}
export function gearArt41(slot,level){const x=['helmet','sword','shield','armor','bow'].indexOf(slot),tier=level<5?0:level<10?1:2;return `<span class="art41 gear41" data-tier="${tier}" aria-hidden="true" style="--x:${x};--y:${tier}"></span>`;}
