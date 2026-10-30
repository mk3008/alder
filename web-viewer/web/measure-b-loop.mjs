// Temporary measurement in the existing B-loop CI entry point for issue 314.
// The normal benchmark implementation is restored in the final candidate.
import {spawn,spawnSync,execFileSync} from 'node:child_process';
import {openSync,closeSync,writeFileSync,readFileSync,mkdirSync,symlinkSync,copyFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {performance} from 'node:perf_hooks';

const baseline='1f05aeeb5e5c3acbd8722420a3ab9aacd7e29dd0';
const repo=resolve('..'), current=process.cwd(), tmp=join(process.env.RUNNER_TEMP,'edge-314');
const evidence=resolve('web/evidence/b-loop');
mkdirSync(tmp,{recursive:true});mkdirSync(evidence,{recursive:true});
const parent=execFileSync('git',['rev-parse','HEAD^1'],{cwd:repo,encoding:'utf8'}).trim();
if(parent!==baseline)throw Error(`Expected frozen PR base ${baseline}; got ${parent}`);
const measurements=[];
function run(label,args,cwd,extraEnv={},timeout=400000){
 const file=join(evidence,label+'.log'),fd=openSync(file,'w'),start=performance.now();
 let result;try{result=spawnSync(args[0],args.slice(1),{cwd,env:{...process.env,...extraEnv},stdio:['ignore',fd,fd],timeout});}finally{closeSync(fd);}
 const item={label,seconds:+((performance.now()-start)/1000).toFixed(3),exit:result.status,signal:result.signal,error:result.error?.message};
 if(result.status!==0){
  const log=readFileSync(file,'utf8');const line=log.split('\n').find(x=>x.startsWith('NODE_EDGE_DRAG_CASE '));
  if(line){try{const x=JSON.parse(line.slice('NODE_EDGE_DRAG_CASE '.length));item.observed={name:x.name,status:x.status,error:String(x.error).slice(0,600)};}catch{}}
  else item.observed={excerpt:log.slice(0,1000)};
  console.log('EDGE314_FAILURE '+JSON.stringify({label,...item.observed}));
 }
 measurements.push(item);console.log('EDGE314_MEASUREMENT '+JSON.stringify(item));
 return item;
}
function replaceOnce(file,oldValue,newValue){const text=readFileSync(file,'utf8');if(text.split(oldValue).length!==2)throw Error(`Expected one mutation point in ${file}`);writeFileSync(file,text.replace(oldValue,newValue));}
const archive=join(tmp,'baseline.tar');
const setupStart=performance.now();
execFileSync('git',['archive','--format=tar','--output='+archive,baseline],{cwd:repo});
const dirs={};
for(const name of ['base','pure','capture','fast']){
 const dir=join(tmp,name);mkdirSync(dir,{recursive:true});execFileSync('tar',['-xf',archive,'-C',dir]);dirs[name]=join(dir,'web-viewer');
 if(name!=='fast')symlinkSync(join(current,'node_modules'),join(dirs[name],'node_modules'),'dir');
}
const candidateTest=join(current,'web/test-node-edge-drag.mjs');
copyFileSync(candidateTest,join(dirs.fast,'web/test-node-edge-drag.mjs'));
const setupSeconds=(performance.now()-setupStart)/1000;
console.log('EDGE314_SETUP '+JSON.stringify({baseline,head:process.env.REVIEW_HEAD,node:process.version,chrome:execFileSync('/usr/bin/google-chrome',['--version'],{encoding:'utf8'}).trim(),setupSeconds:+setupSeconds.toFixed(3),nodeModules:'CI npm ci from candidate lock; fast copy has no node_modules',existingBenchmarkArgument:process.argv[2]??null,scope:'issue 314; archived base and isolated fault copies'}));
const node=['node','--experimental-strip-types','web/test-node-edge-drag.mjs'];
for(let i=1;i<=3;i++)run(`base-node-dom-${i}`,node,dirs.base);
for(let i=1;i<=3;i++)run(`candidate-logic-no-deps-${i}`,[...node,'--logic-only'],dirs.fast);
for(let i=1;i<=3;i++)run(`candidate-node-dom-${i}`,node,current);
replaceOnce(join(dirs.pure,'src/node-drag.ts'),'+(now[0]-drag.camera[0])','-(now[0]-drag.camera[0])');
for(let i=1;i<=3;i++)run(`pure-before-${i}`,node,dirs.pure);
copyFileSync(candidateTest,join(dirs.pure,'web/test-node-edge-drag.mjs'));
for(let i=1;i<=3;i++)run(`pure-after-${i}`,[...node,'--logic-only'],dirs.pure);
replaceOnce(join(dirs.capture,'src/main.ts'),'dragTarget.setPointerCapture(e.pointerId);','');
run('capture-node-dom',node,dirs.capture);

// Limit only the fault runs to one named existing native case. Test body and
// assertions are unchanged, and the ordinary full case runs use untouched code.
for(const name of ['pure','capture'])replaceOnce(join(dirs[name],'web/test-node-edge-drag-browser.mjs'),
 ' for(const test of cases){',
 " const chosen=cases.filter(test=>test.name===process.env.EDGE314_CASE);if(chosen.length!==1)throw Error('Expected one named native case');\n for(const test of chosen){");
async function preview(name,body){
 const cwd=dirs[name];const build=run(`build-${name}`,['npm','run','build'],cwd,{},180000);if(build.exit!==0)throw Error(`Build failed: ${name}`);
 const fd=openSync(join(evidence,`preview-${name}.log`),'w');const start=performance.now();
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port','4173'],{cwd,stdio:['ignore',fd,fd]});
 try{
  let ready=false;for(let i=0;i<120;i++){try{const response=await fetch('http://127.0.0.1:4173/');if(response.ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}
  if(!ready)throw Error(`Preview did not start: ${name}`);
  const item={label:`preview-setup-${name}`,seconds:+((performance.now()-start)/1000).toFixed(3)};measurements.push(item);console.log('EDGE314_MEASUREMENT '+JSON.stringify(item));
  await body(cwd);
 }finally{if(server.exitCode===null&&server.signalCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('close',r));}closeSync(fd);}
}
const browser=['node','web/test-browser.mjs','--cases','nodeEdgeDrag'];
await preview('base',async cwd=>{for(let i=1;i<=2;i++)run(`browser-base-${i}`,browser,cwd);});
await preview('pure',async cwd=>{run('browser-pure',browser,cwd,{EDGE314_CASE:'mouse right 393px 100%'},60000);});
await preview('capture',async cwd=>{run('browser-capture',browser,cwd,{EDGE314_CASE:'stop on capture-loss'},60000);});
writeFileSync(join(evidence,'measurements.json'),JSON.stringify(measurements,null,2));
const unexpected=measurements.filter(x=>{
 if(!Object.hasOwn(x,'exit'))return false;
 if(x.exit===null)return true;
 if(/pure-before|pure-after/.test(x.label))return x.exit===0||!x.observed?.excerpt?.includes('stationary edge hold keeps moving');
 if(/browser-pure|browser-capture/.test(x.label)){const expected=x.label==='browser-pure'?'mouse right 393px 100%':'stop on capture-loss';return x.exit===0||x.observed?.status!=='failed'||x.observed?.name!==expected;}
 return x.exit!==0;
});
console.log('EDGE314_CONCLUSION '+JSON.stringify({unexpected,limits:'Single named native case per injected fault; full native group measured separately; no physical devices; npm ci and Playwright installation are shared setup; builds and preview startup timed separately.'}));
if(unexpected.length)process.exitCode=1;
