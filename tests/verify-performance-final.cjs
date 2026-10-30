const cp=require('child_process');
for(const args of [['tests/performance.cjs','despues-verificado'],['tests/full.cjs']]){const result=cp.spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,PERF_HTML:'index.html'}});if(result.status!==0)process.exit(result.status||1);}
