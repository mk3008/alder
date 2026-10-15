// Run each bounded case once. Failure never skips a later independent case.
export async function runBrowserCases(cases,report=console.log){
 const results=[];
 for(const {name,run} of cases){try{const result=await run();results.push({name,status:'passed',result});}catch(error){results.push({name,status:'failed',error:{name:error?.name??'Error',message:error?.message??String(error),stack:error?.stack}});}report(JSON.stringify({browserCase:results.at(-1)}));}
 report(JSON.stringify({browserSummary:{total:results.length,passed:results.filter(x=>x.status==='passed').length,failed:results.filter(x=>x.status==='failed').length,results}}));
 const failures=results.filter(x=>x.status==='failed');if(failures.length){const error=new AggregateError(failures.map(x=>Object.assign(new Error(x.error.message),{name:x.error.name,stack:x.error.stack})),`${failures.length}/${results.length} browser cases failed`);error.results=results;throw error;}return results;
}
