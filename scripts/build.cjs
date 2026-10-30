const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
function build(){
 const assets=JSON.parse(read('src/embedded.json')),blocks=JSON.parse(read('src/blocks.json')),cache=new Map();
 function hydrate(s){return s.replace(/\{\{asset:([a-f0-9]+)\}\}/g,(_,id)=>{if(cache.has(id))return cache.get(id);const asset=assets[id];if(!asset)throw Error('Unknown asset '+id);const raw=asset.text?Buffer.from(hydrate(read(asset.path))):fs.readFileSync(path.join(root,asset.path));const uri='data:'+asset.mime+';base64,'+raw.toString('base64');cache.set(id,uri);return uri;});}
 const document=hydrate(read('src/souls/document.html'));
 let html=read('src/template.html').replace(/\{\{block:(\d+)\}\}/g,(_,n)=>{const block=blocks[Number(n)];let body=hydrate(read(block.path)).replaceAll('{{souls-document-base64}}',Buffer.from(document).toString('base64'));if(block.type==='script'&&!/type\s*=\s*["'](?:application\/json|importmap)["']/.test(block.attrs)&&!/type\s*=\s*["']module["']/.test(block.attrs))new vm.Script(body,{filename:block.path});return body;});
 html=hydrate(html);if(/\{\{(?:asset:|block:|souls-document-base64)/.test(html))throw Error('Unresolved source marker');return html;
}
if(require.main===module){const html=build(),target=path.join(root,'index.html');if(process.argv.includes('--check')){if(fs.readFileSync(target,'utf8')!==html)throw Error('index.html differs from sources');console.log('Build matches index.html exactly.');}else{fs.writeFileSync(target,html);console.log('Built index.html: '+Buffer.byteLength(html)+' bytes');}}
module.exports={build};
