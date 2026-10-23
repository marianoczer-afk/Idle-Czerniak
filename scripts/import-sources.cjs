'use strict';
// One-time, lossless import. Refuses to overwrite editable sources.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),acorn=require('acorn');
const root=path.join(__dirname,'..'),input=process.argv[2]||'index.html';
if(fs.existsSync(path.join(root,'src/template.html')))throw Error('Editable sources already exist. Import must never overwrite them.');
let html=fs.readFileSync(path.resolve(root,input),'utf8');const original=Buffer.from(html),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const resources={},byUri=new Map();let refs=0;
html=html.replace(/data:image\/[^\s"'<>]+/g,uri=>{
 if(uri.indexOf(',')<0||!uri.slice(uri.indexOf(',')+1))return uri;
 refs++;if(byUri.has(uri))return '@@ASSET:'+byUri.get(uri)+'@@';
 const comma=uri.indexOf(','),prefix=uri.slice(0,comma+1),mime=prefix.match(/^data:([^;,]+)/)[1],base64=prefix.includes(';base64'),payload=uri.slice(comma+1),bytes=base64?Buffer.from(payload,'base64'):Buffer.from(decodeURIComponent(payload));
 if(!bytes.length)throw Error('Empty image');const hash=sha(bytes),id='image-'+hash.slice(0,16),ext=({'image/png':'png','image/webp':'webp','image/svg+xml':'svg','image/jpeg':'jpg'})[mime];if(!ext)throw Error('Unsupported '+mime);
 const file='assets/originals/'+id+'.'+ext;fs.writeFileSync(path.join(root,file),bytes);
 resources[id]={id,mime,source:file,runtime:file,bytes:bytes.length,sha256:hash,originalPrefix:prefix,originalPayload:base64?undefined:payload,encoding:base64?'base64':'percent',references:0};
 byUri.set(uri,id);return '@@ASSET:'+id+'@@';
});
for(const m of html.matchAll(/@@ASSET:([^@]+)@@/g))resources[m[1]].references++;
const catalogueNames=new Set(['E16_FISH','E161_RODS','E161_DIFFICULTY','E165_ZONES','E17_QUEST','E17_ROD','E171_QUESTS','E18_ROD','E187_QUESTS','E187_ROD','E187_ZONES','E187_FISH','E190_WEIGHT_RANGES','E208_FAMILIES','E208_SPECIALTIES','E208_ROD_ART','E208_FISH_ART','E212_OFFERS','E1103_SPECIAL','E210_CAPTURE_PROFILES']);
const blocks=[],catalogs=[];let ordinal=0;
function category(label,type){if(!label||label==='core')return 'core';if(/dev|diagnostics|lab/.test(label))return 'dev';if(/e15-merchant/.test(label))return 'shop';if(/hybrid|e13|e14/.test(label))return 'layout';if(/atlas/.test(label))return 'fishing/atlas';if(/journal|collection/.test(label))return 'fishing/collection';if(/rod-shop|rod-ux/.test(label))return 'fishing/shop';if(/xp|feedback/.test(label))return 'fishing/feedback';if(/hud|sidebar/.test(label))return 'fishing/hud';if(/art|hd-|illustration/.test(label))return 'fishing/art';return 'fishing/minigame';}
function extractCatalogs(code,label){const ast=acorn.parse(code,{ecmaVersion:'latest',sourceType:'script'}),edits=[];let n=0;
 function visit(node){if(!node||typeof node!=='object')return;
  if(node.type==='VariableDeclaration'&&node.declarations.length===1){const d=node.declarations[0];if(d.id.type==='Identifier'&&catalogueNames.has(d.id.name)&&d.init&&['ArrayExpression','ObjectExpression'].includes(d.init.type)){const file='src/catalogs/'+label+'-'+d.id.name.toLowerCase()+'.js';fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),code.slice(node.start,node.end));edits.push({start:node.start,end:node.end,file});catalogs.push({file,symbol:d.id.name});return;}}
  if(node.type==='ExpressionStatement'&&node.expression.type==='CallExpression'){const e=node.expression,c=e.callee;if(c.type==='MemberExpression'&&c.object.type==='Identifier'&&catalogueNames.has(c.object.name)&&c.property.name==='push'&&e.arguments.every(a=>a.type==='ObjectExpression')){const file='src/catalogs/'+label+'-'+c.object.name.toLowerCase()+'-additions-'+(++n)+'.js';fs.writeFileSync(path.join(root,file),code.slice(node.start,node.end));edits.push({start:node.start,end:node.end,file});catalogs.push({file,symbol:c.object.name});return;}}
  for(const [k,v]of Object.entries(node))if(k!=='start'&&k!=='end'){if(Array.isArray(v))v.forEach(visit);else if(v&&typeof v==='object')visit(v);}
 }visit(ast);for(const e of edits.sort((a,b)=>b.start-a.start))code=code.slice(0,e.start)+'/* @include '+e.file+' */'+code.slice(e.end);return code;
}
html=html.replace(/<(script|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>/gi,(all,type,attrs,body)=>{
 const i=String(++ordinal).padStart(3,'0'),label=(attrs.match(/\b(?:id|data-[\w-]+)(?:="([^"]*)")?/)||[]),name=(label[1]||label[0]||'core').replace(/^data-/,'').replace(/[^a-z0-9-]/gi,'-'),language=type==='script'?'js':'css',file='src/'+language+'/'+category(name,type)+'/'+i+'-'+name+'.'+language;
 if(type==='script')body=extractCatalogs(body,i+'-'+name);
 fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),body);
 blocks.push({id:'block-'+i,file,type,attributes:attrs});return '<'+type+attrs+'>@@BLOCK:block-'+i+'@@</'+type+'>';
});
fs.writeFileSync(path.join(root,'src/template.html'),html);
fs.writeFileSync(path.join(root,'src/blocks.json'),JSON.stringify(blocks,null,2)+'\n');
fs.writeFileSync(path.join(root,'src/catalogs/index.json'),JSON.stringify(catalogs,null,2)+'\n');
fs.writeFileSync(path.join(root,'assets/manifest.json'),JSON.stringify({version:1,baseline:{sha256:sha(original),bytes:original.length,imageReferences:refs},resources},null,2)+'\n');
console.log(`Imported ${blocks.length} ordered blocks, ${catalogs.length} catalogue fragments, ${Object.keys(resources).length} unique image resources (${refs} references). Original index.html left untouched.`);
