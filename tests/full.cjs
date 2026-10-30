const cp=require('child_process');
for(const args of [['--test','tests/build.test.cjs'],['tests/verificar-40.cjs'],['tests/verificar-41.cjs'],['tests/ui-performance.cjs'],['tests/integration.cjs']]){const result=cp.spawnSync(process.execPath,args,{stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status||1);}
