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
test('Architecture inventory follows the actual ordered blocks and captured aliases',()=>{
 const r=require('../scripts/architecture-inventory.cjs').inventory();
 const blocks=JSON.parse(fs.readFileSync(path.join(root,'src/blocks.json')));
 assert.deepEqual(r.blocks.map(({order,...b})=>b),blocks);
 for(const b of blocks)assert.ok(r.files.some(f=>f.file===b.file));
 const page=r.redefinitions.find(f=>f.name==='e16Page');
 assert.ok(page.aliases.some(a=>a.alias==='e231PreviousPage'));
 assert.ok(page.sites.some(s=>s.file==='src/js/fishing/140-world31.js'));
 assert.ok(r.includes.some(i=>i.to==='src/catalogs/130-regional34.js'));
});
