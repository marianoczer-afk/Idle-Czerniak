'use strict';
// Renderer composition moved; all other AST nodes must retain the Estable 34 contract.
const acorn=require('acorn'),crypto=require('node:crypto');
const renderers=new Set(['e16Page','e188UpdateHud']),bindings=new Set(['fishingPageShop','fishingPageZoneSync','fishingHudMenuSync','fishingHudXpSync']);
function clean(node){
 if(node===null||typeof node!=='object')return node;
 if(Array.isArray(node))return node.map(clean).filter(v=>v!==undefined);
 if(node.type==='FunctionDeclaration'&&renderers.has(node.id.name))return;
 if(node.type==='ExpressionStatement'&&node.expression.type==='AssignmentExpression'&&(renderers.has(node.expression.left.name)||bindings.has(node.expression.left.name)))return;
 if(node.type==='VariableDeclarator'&&node.init?.type==='Identifier'&&renderers.has(node.init.name))return;
 const out={};for(const[k,v]of Object.entries(node))if(!['start','end','loc','raw'].includes(k))out[k]=clean(v);
 if(node.type==='VariableDeclaration'&&!out.declarations.length)return;
 return out;
}
function hash(code,script=false){const text=script?JSON.stringify(clean(acorn.parse(code,{ecmaVersion:'latest'}))):code;return crypto.createHash('sha256').update(text).digest('hex');}
module.exports={hash};
