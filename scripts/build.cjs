'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{Script}=require('node:vm');
const root=path.join(__dirname,'..'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function local(file){const target=path.resolve(root,file);if(!target.startsWith(root+path.sep))throw Error('Path outside project: '+file);return target;}
function expand(file,stack=[]){if(stack.includes(file))throw Error('Circular source include: '+stack.concat(file));return fs.readFileSync(local(file),'utf8').replace(/\/\* @include ([\w/.-]+) \*\//g,(_,f)=>expand(f,stack.concat(file)));}
function generate(){const manifest=JSON.parse(fs.readFileSync(local('assets/manifest.json'))),blocks=JSON.parse(fs.readFileSync(local('src/blocks.json'))),uris=new Map();let html=fs.readFileSync(local('src/template.html'),'utf8');
 for(const b of blocks){const token='@@BLOCK:'+b.id+'@@';if(!html.includes(token))throw Error('Missing ordered block '+b.id);let code=expand(b.file);if(b.type==='script')new Script(code,{filename:b.file});html=html.replace(token,()=>code);}
 html=html.replace(/@@ASSET:([^@]+)@@/g,(_,id)=>{if(uris.has(id))return uris.get(id);const a=manifest.resources[id];if(!a)throw Error('Missing resource '+id);const bytes=fs.readFileSync(local(a.runtime));if(!bytes.length)throw Error('Empty resource '+id);
 const same=a.runtime===a.source;if(!same&&a.runtimeSha256&&hash(bytes)!==a.runtimeSha256)throw Error('Runtime asset modified without updating manifest: '+id);if(same&&hash(bytes)!==a.sha256)throw Error('Original asset modified without updating manifest: '+id);
 const key=hash(Buffer.concat([Buffer.from(same?a.originalPrefix+':'+a.encoding:a.runtimeMime),bytes])),cache=local('.build-cache/'+key+'.uri');let uri;if(fs.existsSync(cache))uri=fs.readFileSync(cache,'utf8');else{uri=same?(a.encoding==='percent'?a.originalPrefix+a.originalPayload:a.originalPrefix+bytes.toString('base64')):'data:'+a.runtimeMime+';base64,'+bytes.toString('base64');fs.mkdirSync(path.dirname(cache),{recursive:true});fs.writeFileSync(cache,uri);}uris.set(id,uri);return uri;});
 if(/@@(?:ASSET|BLOCK):|\/\* @include /.test(html))throw Error('Unresolved build token');
 new Script([...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n;\n'));
 return {html,manifest,blocks};
}
function build({check=false}={}){const {html,manifest,blocks}=generate(),target=local('index.html'),bytes=Buffer.byteLength(html),sha256=hash(html);if(check){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==html)throw Error('index.html is stale or not generated from these sources');}else{const temp=target+'.build-tmp';fs.writeFileSync(temp,html);fs.renameSync(temp,target);}console.log(`${check?'Verified':'Built'} index.html: ${bytes} bytes, ${blocks.length} ordered blocks, SHA-256 ${sha256}`);return{bytes,sha256};}
module.exports={build,generate,expand,local};if(require.main===module)build({check:process.argv.includes('--check')});
