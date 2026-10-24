'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {generate,expand,local}=require('../scripts/build.cjs');
const root=path.join(__dirname,'..');
test('Generated single HTML is current, deterministic and contains no development tokens',()=>{
 const a=generate().html,b=generate().html;
 assert.equal(a,b);assert.equal(a,fs.readFileSync(path.join(root,'index.html'),'utf8'));
 assert.doesNotMatch(a, /@@(?:ASSET|BLOCK):|\/\* @include /);
 assert.doesNotMatch(a, /<(?:script|link)\b[^>]*(?:src|href)=["'](?:src\/|assets\/)/);
});
test('Source catalogues and original/runtime resources are complete and authenticated',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/manifest.json')));
 assert.equal(manifest.baseline.sha256,'05a1674bf411cf4aca2a555ceeaeda12f335ad9ead40069e6ff4e0f678d970dc');
 for(const asset of Object.values(manifest.resources)){
  const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(local(f))).digest('hex');
  assert.equal(hash(asset.source),asset.sha256);
  if(asset.runtime!==asset.source){assert.equal(hash(asset.runtime),asset.runtimeSha256);assert.ok(asset.pixelEquality===true||[85,88,90].includes(asset.compression?.quality));}
 }
 const catalogs=JSON.parse(fs.readFileSync(local('src/catalogs/index.json')));
 assert.ok(catalogs.length>=20);for(const entry of catalogs)assert.ok(expand(entry.file).includes(entry.symbol));
 const production=JSON.parse(fs.readFileSync(local('arte/manifest-produccion.json')));
 assert.equal(new Set(production.entries.map(e=>e.id)).size,production.entries.length);
 for(const entry of production.entries)for(const id of entry.resourceIds||[])assert.ok(manifest.resources[id]);
});
test('Unmodified engines and bottom HUD stylesheet preserve the Estable 25 baseline',()=>{
 const html=fs.readFileSync(local('index.html'),'utf8'),baseline=JSON.parse(fs.readFileSync(local('tests/fixtures/source-estable25.json'))),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
 const normalize=s=>s.replace(/data:image\/[^\s"'<>]+/g,'DATA_IMAGE').replace(/Estable (29|30|31|32)/g,'Estable VERSION').replace(/estable-(29|30|31|32)/g,'estable-VERSION').replace(" if(typeof e230HudArt==='function')return;\n",'').replace(" if(typeof e227Illustration==='function')wrap.insertAdjacentHTML('afterbegin',e227Illustration('ui','water','e230ShakeWater',true));\n",'');
 const changed=new Set(['005-core.js','006-hybrid-upgrade.js','016-e16-fishing.js','066-e197-fishing.js','102-e1123-zone-identity.js','104-e1114-menu-art.js','114-e216-atlas.js','025-e165-zones.js','045-e186-fishing.js','054-e191-polish.js','080-e1107-fishing-ui.js','095-e1117-full-art.js','099-e1120-hud.js','122-e218-journal.js','021-e163-fishing.js','087-e1111-catch-result.js','047-e187-expansion.js','052-e190-polish.js','035-e18-trophies.js','110-e208-catalog.js','119-e217-rod-ux.js','018-e161-fishing.js']);
 const blocks=JSON.parse(fs.readFileSync(local('src/blocks.json'))).filter(b=>b.type==='script'),scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
 for(let i=0;i<baseline.scripts.length;i++)if(!changed.has(path.basename(blocks[i].file)))assert.equal(hash(normalize(scripts[i][1])),baseline.scripts[i],blocks[i].file);
 const hud=html.match(/<style id="fishing-hud-css">([\s\S]*?)<\/style>/)[1];
 const oldHud=hud.replace('--fishing-zone-width:148px;--fishing-fish-width:156px','--fishing-zone-width:128px;--fishing-fish-width:104px').replace('minmax(0,1.06fr) minmax(0,1fr)','minmax(0,470px) minmax(0,1fr)').replace('max-width:1320px','max-width:1100px').replace('--fishing-zone-width:68px;--fishing-fish-width:64px','--fishing-zone-width:60px;--fishing-fish-width:48px').replace('minmax(0,1fr) minmax(0,1.3fr)','minmax(0,1fr) minmax(0,1fr)').replace('grid-template-rows:20px 79px','grid-template-rows:27px 72px').replace('height:79px','height:72px');
 assert.equal(hash(oldHud),baseline.hudCSS,'Only the expressly authorized HUD widths/mobile row split may differ');
});
