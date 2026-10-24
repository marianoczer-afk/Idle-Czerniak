'use strict';
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8'),build=html.match(/<meta name="argentum-build" content="([^"]+)"/)[1];
module.exports={build,label:'Estable '+build.replace('estable-','')};
