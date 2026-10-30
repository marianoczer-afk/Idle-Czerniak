
'use strict';
const E238_HEADER_ICONS={"atlas":"{{asset:c938e19930f19596a6ba51ae}}","journal":"{{asset:a757f5a3341aedcef9b5c4e1}}","quests":"{{asset:04548fbdac73740b0e157180}}","trophies":"{{asset:f17f06f51ee5fb382960242e}}","shop":"{{asset:cb4b7cd3393c51b36fd807be}}"};
function e238Icon(name){return '<img class="e238HeaderIcon" src="'+E238_HEADER_ICONS[name]+'" alt="" aria-hidden="true" width="128" height="128">';}
const e238PreviousIllustration=e227Illustration;
e227Illustration=function(kind,id,css='',slice=false){const key=kind==='ui'?({'quests-header':'quests','trophy-header':'trophies','shop-header':'shop'}[id]):null;return key?e238Icon(key):e238PreviousIllustration(kind,id,css,slice);};
const e238PreviousArt=e221Art;
e221Art=function(kind){return E238_HEADER_ICONS[kind]?'<span class="e221Art" data-art="'+kind+'" aria-hidden="true">'+e238Icon(kind)+'</span>':e238PreviousArt(kind);};

