'use strict';
// Static inventory, not a dead-code eliminator. Aliases/calls may be local or conditional.
const fs=require('node:fs'),path=require('node:path'),acorn=require('acorn');
function inventory(){
const root=path.join(__dirname,'..'),blocks=JSON.parse(fs.readFileSync(path.join(root,'src/blocks.json')));
const definitions=[],aliases=[],includes=[],files=new Map(),seen=new Set();
function visit(file,block,stack=[]){
 if(stack.includes(file))throw Error('Circular include: '+stack.concat(file).join(' -> '));
 const code=fs.readFileSync(path.join(root,file),'utf8');files.set(file,{file,bytes:Buffer.byteLength(code),lines:code.split('\n').length,block});
 for(const m of code.matchAll(/\/\* @include ([\w/.-]+) \*\//g)){includes.push({from:file,to:m[1],block});visit(m[1],block,stack.concat(file));}
 if(!file.endsWith('.js')||seen.has(file))return;seen.add(file);
 function walk(n){if(!n||typeof n!=='object')return;
  if(n.type==='FunctionDeclaration'&&n.id)definitions.push({name:n.id.name,kind:'declaration',file,line:n.loc.start.line,block});
  if(n.type==='AssignmentExpression'&&n.left.type==='Identifier'&&['FunctionExpression','ArrowFunctionExpression'].includes(n.right.type))definitions.push({name:n.left.name,kind:'assignment',file,line:n.loc.start.line,block});
  if(n.type==='VariableDeclarator'&&n.id.type==='Identifier'&&n.init?.type==='Identifier')aliases.push({alias:n.id.name,target:n.init.name,file,line:n.loc.start.line,block});
  for(const[k,v]of Object.entries(n)){if(k==='loc')continue;if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}
 }
 walk(acorn.parse(code,{ecmaVersion:'latest',locations:true}));
}
blocks.forEach((b,i)=>visit(b.file,i+1));
const grouped={};for(const d of definitions)(grouped[d.name]??=[]).push(d);
const report={schema:1,note:'Syntactic candidates; same-named locals and captured function references require manual/runtime verification. Block order is authoritative; declaration hoisting and deferred callbacks matter.',counts:{blocks:blocks.length,scripts:blocks.filter(b=>b.type==='script').length,styles:blocks.filter(b=>b.type==='style').length,reachableFiles:files.size,definitions:definitions.length},blocks:blocks.map((b,i)=>({order:i+1,...b})),includes,files:[...files.values()].sort((a,b)=>b.bytes-a.bytes),redefinitions:Object.entries(grouped).filter(([,v])=>v.length>1).map(([name,sites])=>({name,sites,aliases:aliases.filter(a=>a.target===name)})).sort((a,b)=>b.sites.length-a.sites.length),aliases};
return report;
}
module.exports={inventory};
if(require.main===module){const output=JSON.stringify(inventory(),null,2)+'\n';const index=process.argv.indexOf('--output');if(index>=0){if(!process.argv[index+1])throw Error('--output needs a path');fs.writeFileSync(process.argv[index+1],output);}else process.stdout.write(output);
}
