// Explicit names only: typos and empty selections must never pass with no tests.
export function parseBrowserCaseArgs(args){
 const options={list:false,names:null};
 for(let i=0;i<args.length;i++){
  if(args[i]==='--list'){options.list=true;continue;}
  if(args[i]==='--cases'&&options.names===null){
   const value=args[++i];
   if(!value||value.startsWith('--'))throw Error('--cases requires comma-separated case names');
   options.names=value.split(',').map(name=>name.trim());
   if(options.names.some(name=>!name))throw Error('--cases contains an empty case name');
   continue;
  }
  throw Error(`Unknown or repeated argument: ${args[i]}`);
 }
 return options;
}
export function selectBrowserCases(cases,names=null){
 const available=new Set(cases.map(c=>c.name));
 if(available.size!==cases.length)throw Error('Duplicate browser case names');
 if(names===null)return cases;
 if(!names.length||names.some(name=>!available.has(name)))throw Error(`Unknown or empty browser case selection: ${names.join(',')}`);
 const selected=new Set(names);
 return cases.filter(c=>selected.has(c.name));
}
// Run each bounded case once. Failure never skips a later independent case.
export async function runBrowserCases(cases,report=console.log,{available=cases.length}={}){
 const started=performance.now();
 const results=[];
 for(const {name,run} of cases){const caseStarted=performance.now();try{const result=await run();results.push({name,status:'passed',result});}catch(error){results.push({name,status:'failed',error:{name:error?.name??'Error',message:error?.message??String(error),stack:error?.stack}});}results.at(-1).durationMs=Math.round(performance.now()-caseStarted);report(JSON.stringify({browserCase:results.at(-1)}));}
 report(JSON.stringify({browserSummary:{scope:cases.length===available?'full':'targeted',available,selected:cases.map(c=>c.name),durationMs:Math.round(performance.now()-started),total:results.length,passed:results.filter(x=>x.status==='passed').length,failed:results.filter(x=>x.status==='failed').length,results}}));
 const failures=results.filter(x=>x.status==='failed');if(failures.length){const error=new AggregateError(failures.map(x=>Object.assign(new Error(x.error.message),{name:x.error.name,stack:x.error.stack})),`${failures.length}/${results.length} browser cases failed`);error.results=results;throw error;}return results;
}
