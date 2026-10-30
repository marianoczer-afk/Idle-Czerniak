const cp=require('child_process');
if(!process.env.PERF_BASELINE_HTML)throw Error('Set PERF_BASELINE_HTML to the saved baseline index.html before comparing.');
for(const [label,file]of [['antes-medicion',process.env.PERF_BASELINE_HTML],['despues-final','index.html']]){const result=cp.spawnSync(process.execPath,['tests/performance.cjs',label],{stdio:'inherit',env:{...process.env,PERF_HTML:file}});if(result.status!==0)process.exit(result.status||1);}
