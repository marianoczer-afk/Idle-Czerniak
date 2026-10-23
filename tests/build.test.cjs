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
  if(asset.runtime!==asset.source){assert.equal(hash(asset.runtime),asset.runtimeSha256);assert.ok(asset.pixelEquality===true||asset.compression?.quality===90);}
 }
 const catalogs=JSON.parse(fs.readFileSync(local('src/catalogs/index.json')));
 assert.ok(catalogs.length>=20);for(const entry of catalogs)assert.ok(expand(entry.file).includes(entry.symbol));
 const production=JSON.parse(fs.readFileSync(local('arte/manifest-produccion.json')));
 assert.equal(new Set(production.entries.map(e=>e.id)).size,production.entries.length);
 for(const entry of production.entries)for(const id of entry.resourceIds||[])assert.ok(manifest.resources[id]);
});
test('Unmodified engines and bottom HUD stylesheet preserve the Estable 25 baseline',()=>{
 const html=fs.readFileSync(local('index.html'),'utf8'),baseline=JSON.parse(fs.readFileSync(local('tests/fixtures/source-estable25.json'))),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
 const normalize=s=>s.replace(/data:image\/[^\s"'<>]+/g,'DATA_IMAGE').replaceAll('Estable 27','Estable VERSION').replaceAll('estable-27','estable-VERSION');
 const changed=new Set(['005-core.js','006-hybrid-upgrade.js','016-e16-fishing.js','066-e197-fishing.js','102-e1123-zone-identity.js','104-e1114-menu-art.js','114-e216-atlas.js']);
 const blocks=JSON.parse(fs.readFileSync(local('src/blocks.json'))).filter(b=>b.type==='script'),scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
 for(let i=0;i<baseline.scripts.length;i++)if(!changed.has(path.basename(blocks[i].file)))assert.equal(hash(normalize(scripts[i][1])),baseline.scripts[i],blocks[i].file);
 assert.equal(hash(html.match(/<style id="fishing-hud-css">([\s\S]*?)<\/style>/)[1]),baseline.hudCSS);
});
