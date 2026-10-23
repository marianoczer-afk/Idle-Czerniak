require('./build.cjs').build({check:true});
'use strict';
// Development-only snapshot from real runtime catalogues, using an isolated browser profile.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
async function main(){
 const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'));
 const server=http.createServer((req,res)=>{if(req.url==='/favicon.ico'){res.writeHead(204);res.end();return;}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);});
 let browser;
 try{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
  const context=await browser.newContext(),page=await context.newPage();
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>storageReady);
  const data=await page.evaluate(async()=>{
   draft={name:'Inventario de desarrollo aislado',race:'humano',cls:'guerrero'};await changeRoster('create');state.skills.pesca={xp:98010};
   const resolveArt=(id,seen=new Set())=>{if(seen.has(id))return '';seen.add(id);const node=document.getElementById(id);return node?node.outerHTML+[...node.querySelectorAll('use')].map(n=>resolveArt((n.getAttribute('href')||'').slice(1),seen)).join(''):'';};
   const describe=markup=>{const t=document.createElement('template');t.innerHTML=markup;const image=t.content.querySelector('img'),use=t.content.querySelector('use');return image?{kind:'raster',source:image.getAttribute('src')}:use?{kind:'atlas',symbol:use.getAttribute('href').slice(1),source:resolveArt(use.getAttribute('href').slice(1))}:{kind:'vector',source:markup};};
   const zones=E165_ZONES.map(z=>({...z,art:describe('<img src="'+e221ZoneImage(z)+'">')}));
   const fish=E16_FISH.map(f=>({...f,weightKg:e190WeightRange(f),difficulty:E161_DIFFICULTY[f.id]||1,art:describe(e189FishSVG(f.id))}));
   const catalogue=[...new Map([...E161_RODS,E17_ROD,...E171_QUESTS.map(q=>q.rod),E18_ROD,E187_ROD].map(r=>[r.id,r])).values()];
   const rods=catalogue.map(r=>({...r,art:describe(e194RodArt(r.id)),offered:e212Offered(r),zoneId:e210RodZone(r),requiredFishing:e217RequiredLevel(r),statsAtFishing100:e1101Stats(r)}));
   state.skills.pesca.xp=0;rods.forEach(r=>r.statsAtFishing1=e1101Stats(catalogue.find(c=>c.id===r.id)));state.skills.pesca.xp=98010;
   const quests=e216QuestDefinitions().map(({done,goals,...q})=>({...q,goals:goals.map(({have,...g})=>g)}));
   const reference=[...e222DifficultyReference()].map(([id,r])=>({id,...r}));
   return{build:document.querySelector('meta[name="argentum-build"]').content,zones,fish,rods,quests,families:E208_FAMILIES,specialties:E208_SPECIALTIES,difficultyReference:reference};
  });
  const resources=Object.values(JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json'))).resources);
  for(const item of [...data.zones,...data.fish,...data.rods])if(item.art.source){const source=item.art.source;item.art.resourceIds=[...new Set([...source.matchAll(/data:image\/[^\s"'<>]+/g)].map(m=>{const u=m[0],comma=u.indexOf(',');if(comma<0)return null;try{const bytes=u.slice(0,comma).includes(';base64')?Buffer.from(u.slice(comma+1),'base64'):Buffer.from(decodeURIComponent(u.slice(comma+1)));const hash=crypto.createHash('sha256').update(bytes).digest('hex');return resources.find(a=>a.sha256===hash||a.runtimeSha256===hash)?.id;}catch{return null;}}).filter(Boolean))];if(source.startsWith('data:image/svg+xml'))item.art.kind='svg-image';item.art.key=item.art.kind+'-'+crypto.createHash('sha256').update(source).digest('hex').slice(0,12);if(source.startsWith('data:image/'))item.art.format=source.slice(5,source.indexOf(';')>-1?source.indexOf(';'):source.indexOf(','));delete item.art.source;}else item.art.key=item.art.symbol;
  fs.mkdirSync(path.join(root,'arte'),{recursive:true});
  const target=path.join(root,'arte','inventario-'+data.build.replace(/^estable-/,'estable')+'.json');fs.writeFileSync(target,JSON.stringify(data,null,2)+'\n');
  console.log(path.relative(root,target)+': '+data.zones.length+' zonas, '+data.fish.length+' especies, '+data.rods.length+' cañas, '+data.quests.length+' encargos.');
 }finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
