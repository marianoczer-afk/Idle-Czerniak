const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),crypto=require('crypto');const {build}=require('../scripts/build.cjs');
test('Current sources reconstruct the standalone release',()=>{assert.equal(build(),fs.readFileSync('index.html','utf8'));});
test('Imported release has exactly the original bytes',()=>{const release=JSON.parse(fs.readFileSync('src/release.json','utf8')),html=build();assert.equal(Buffer.byteLength(html),release.bytes);assert.equal(crypto.createHash('sha256').update(html).digest('hex'),release.sha256);});
