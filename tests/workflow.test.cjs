'use strict';
const{test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
test('Build profiling preserves the offline distribution byte for byte',()=>{
 const result=require('../scripts/build.cjs').generate({profile:true});
 assert.equal(result.html,fs.readFileSync(path.join(root,'index.html'),'utf8'));
 assert.ok(result.profile.counts.uniqueAssets>0);
 assert.ok(result.profile.counts.assetReferences>=result.profile.counts.uniqueAssets);
 assert.ok(result.profile.counts.runtimeBytesRead>0);
 for(const ms of Object.values(result.profile.timingsMs))assert.ok(Number.isFinite(ms)&&ms>=0);
});
test('Architecture inventory follows ordered blocks and enforces single renderers',()=>{
 const r=require('../scripts/architecture-inventory.cjs').inventory();
 const blocks=JSON.parse(fs.readFileSync(path.join(root,'src/blocks.json')));
 assert.deepEqual(r.blocks.map(({order,...b})=>b),blocks);
 for(const b of blocks)assert.ok(r.files.some(f=>f.file===b.file));
 assert.equal(r.redefinitions.some(f=>f.name==='e16Page'||f.name==='e188UpdateHud'),false,'Page and HUD must have one implementation, no predecessor aliases');
 assert.ok(r.files.some(f=>f.file==='src/js/fishing/page/render.js'));
 assert.ok(r.files.some(f=>f.file==='src/js/fishing/hud/update.js'));
 assert.ok(r.includes.some(i=>i.to==='src/catalogs/130-regional34.js'));
});
