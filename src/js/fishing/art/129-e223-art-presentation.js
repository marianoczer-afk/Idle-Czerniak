
'use strict';
function e223FishBackdrop(art){
 const source=art.querySelector(':scope>img,:scope>svg');if(!source)return;
 const backdrop=document.createElement('span');backdrop.className='e223FishBackdrop';backdrop.setAttribute('aria-hidden','true');
 if(source.tagName==='IMG')backdrop.style.backgroundImage='url("'+source.getAttribute('src')+'")';
 else if(source.querySelector('use')){const copy=source.cloneNode(true);copy.removeAttribute('role');copy.removeAttribute('aria-label');copy.removeAttribute('class');copy.setAttribute('preserveAspectRatio','xMidYMid slice');copy.querySelector('title')?.remove();copy.style.cssText='display:block;width:100%;height:100%';backdrop.append(copy);}
 // Transparent standalone vectors already integrate with the card's base color.
 else return;
 art.prepend(backdrop);
}
