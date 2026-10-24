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
test('Gameplay engines, catalogs, listeners and HUD CSS preserve the Estable 34 contract',()=>{
 const {hash}=require('./helpers/gameplay-contract.cjs');
 const baseline=JSON.parse(fs.readFileSync(local('tests/fixtures/gameplay-estable34.json'),'utf8'));
 for(const [file,contract] of Object.entries(baseline.files))assert.equal(hash(fs.readFileSync(local(file),'utf8'),contract.script),contract.sha256,file);
});
