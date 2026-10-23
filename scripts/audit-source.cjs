require('./build.cjs').build({check:true});
'use strict';
// Parse every inline script without executing game code or touching browser saves.
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {Script}=require('node:vm');
const html=readFileSync(join(__dirname,'../index.html'),'utf8');
const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
const styles=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)];
assert.equal(scripts.length,(html.match(/<script\b/g)||[]).length,'Unclosed script');
assert.equal(styles.length,(html.match(/<style\b/g)||[]).length,'Unclosed style');
assert.equal(styles.length,(html.match(/<\/style>/g)||[]).length,'Extra style closing tag');
for(const [i,m] of scripts.entries())new Script(m[1],{filename:`inline-script-${i+1}.js`});
// Also detect conflicting global lexical declarations across separate script elements.
new Script(scripts.map(m=>m[1]).join('\n;\n'),{filename:'all-inline-scripts.js'});
assert.match(html,/<!doctype html>/i);
assert.match(html,/<meta name="argentum-build" content="estable-\d+">/);
console.log(`OK: ${scripts.length} scripts parsed, ${styles.length} style blocks balanced; standalone HTML.`);
