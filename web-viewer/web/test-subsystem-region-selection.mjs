import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const authority=readFileSync('verification/subsystem-region-selection.check-items.json');
const hash=value=>createHash('sha256').update(value).digest('hex');
const ids=['SUBSYSTEM-REGION-001','SUBSYSTEM-REGION-002','SUBSYSTEM-REGION-003','SUBSYSTEM-REGION-004','SUBSYSTEM-REGION-005'];
function verifyAuthority(bytes){
 assert.equal(hash(bytes),'0174a356c2a8854d72c4d8874672e8893c1d1d72e31dbb40273ec16eec1edb0a','frozen selection requirements must not change');
 const parsed=JSON.parse(bytes);assert.deepEqual(parsed.checks.map(item=>item.id),ids);
 for(const check of parsed.checks)for(const field of ['condition','guarantee','reason','source','verification'])assert(check[field],check.id+' '+field);
 return parsed;
}
const parsed=verifyAuthority(authority),changedAuthority=structuredClone(parsed);changedAuthority.checks.pop();
assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(changedAuthority,null,2)+'\n')),/requirements must not change/);
const cases={
 'SUBSYSTEM-REGION-001':['mouse','touch'],
 'SUBSYSTEM-REGION-002':['model','open','handoff'],
 'SUBSYSTEM-REGION-003':['mouse-locked','mouse-unlocked','touch-locked','touch-unlocked','pinch'],
 'SUBSYSTEM-REGION-004':['title','restore'],
 'SUBSYSTEM-REGION-005':['unmarked-background']
},results=[];
const pass=(id,name)=>results.push(id+':'+name);
function verifyCoverage(actual){assert.deepEqual([...actual].sort(),Object.entries(cases).flatMap(([id,names])=>names.map(name=>id+':'+name)).sort(),'every case must be present exactly once');}

const compiled=await build({entryPoints:['src/subsystem-overview.ts'],bundle:true,write:false,format:'iife',globalName:'Overview',loader:{'.css':'empty'}});
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.HTMLElement.prototype.setPointerCapture=()=>{};
w.HTMLElement.prototype.releasePointerCapture=()=>{};
w.HTMLElement.prototype.hasPointerCapture=()=>false;
w.eval(compiled.outputFiles[0].text+';window.Overview=Overview;');
const changes=[],opens=[],view=w.Overview.createSubsystemOverview(w.document,id=>opens.push(id),()=>changes.push(view.selection()?.id));
w.document.querySelector('#host').append(view.root);
const host=view.root.querySelector('.diagram-viewport'),region=id=>view.root.querySelector(`[data-subsystem="${id}"] .subsystem-overview-region`),selected=()=>view.selection()?.id;
const fire=(type,pointerType,id,x,y,target=host)=>{const e=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,pointerType,button:0,clientX:x,clientY:y});target.dispatchEvent(e);};
function tap(pointerType,id){fire('pointerdown',pointerType,1,100,100,region(id));fire('pointerup',pointerType,1,100,100);assert.equal(selected(),id);}
try{
 tap('mouse','approval');assert.equal(changes.length,1,'one mouse tap produces one selection');
 assert.equal(view.root.querySelector('[data-subsystem="approval"] button').getAttribute('aria-pressed'),'true');
 pass('SUBSYSTEM-REGION-001','mouse');
 tap('touch','receiving');assert.equal(changes.length,2,'one touch tap produces one selection');
 assert(view.root.querySelector('[data-subsystem="receiving"]').classList.contains('selected'));
 assert(view.root.querySelector('[data-subsystem="approval"]').classList.contains('review-neighbor'));
 assert.deepEqual(opens,[]);
 pass('SUBSYSTEM-REGION-001','touch');
 for(const type of ['mouse','touch'])for(const unlocked of [false,true]){
  const lock=view.root.querySelector('.canvas-lock');if((lock.getAttribute('aria-pressed')==='false')!==unlocked)lock.click();
  host.scrollLeft=300;host.scrollTop=200;const before=changes.length;
  fire('pointerdown',type,1,400,400,region('approval'));fire('pointermove',type,1,350,380);fire('pointerup',type,1,350,380);
  assert.equal(host.scrollLeft,350,type+' background pan x');assert.equal(host.scrollTop,220,type+' background pan y');
  assert.equal(changes.length,before,type+' pan must not select');assert.equal(selected(),'receiving');
  pass('SUBSYSTEM-REGION-003',type+'-'+(unlocked?'unlocked':'locked'));
 }
 const beforePinch=changes.length;
 fire('pointerdown','touch',1,100,100,region('approval'));fire('pointerdown','touch',2,200,100,region('approval'));
 fire('pointermove','touch',2,250,100);fire('pointerup','touch',1,100,100);fire('pointerup','touch',2,250,100);
 assert.equal(changes.length,beforePinch,'pinch must not select');assert.equal(selected(),'receiving');
 pass('SUBSYSTEM-REGION-003','pinch');
 const model=view.root.querySelector('[data-review-group="group-request"]');model.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
 assert.equal(view.selection().kind,'model');assert.equal(selected(),'group-request');
 pass('SUBSYSTEM-REGION-002','model');
 model.querySelector('.subsystem-overview-open').click();assert.deepEqual(opens,['group-request']);assert.equal(selected(),'group-request');
 pass('SUBSYSTEM-REGION-002','open');
 view.root.querySelector('[data-handoff-label="result-progress"]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
 assert.equal(view.selection().kind,'connection');assert.equal(selected(),'result-progress');
 pass('SUBSYSTEM-REGION-002','handoff');
 view.root.querySelector('[data-subsystem="approval"] button').click();assert.equal(view.selection().kind,'group');assert.equal(selected(),'approval');
 pass('SUBSYSTEM-REGION-004','title');
 const reloaded=w.Overview.createSubsystemOverview(w.document,()=>{},()=>{});w.document.querySelector('#host').append(reloaded.root);
 assert.equal(reloaded.selection()?.kind,'group');assert.equal(reloaded.selection()?.id,'approval');
 assert.equal(reloaded.root.querySelector('[data-subsystem="approval"] button').getAttribute('aria-pressed'),'true');
 pass('SUBSYSTEM-REGION-004','restore');
 const beforeEmpty=changes.length;fire('pointerdown','touch',1,100,100,host);fire('pointerup','touch',1,100,100);assert.equal(changes.length,beforeEmpty);assert.equal(selected(),'approval');
 pass('SUBSYSTEM-REGION-005','unmarked-background');
 const css=readFileSync('src/viewer-shell.css','utf8');assert.match(css,/\.subsystem-overview-region\{[^}]*cursor:pointer/);assert.doesNotMatch(css,/\.subsystem-overview-region\{[^}]*pointer-events:none/);
}finally{w.close();}
verifyCoverage(results);assert.throws(()=>verifyCoverage(results.slice(1)),/every case/);assert.throws(()=>verifyCoverage([...results,results[0]]),/every case/);
console.log('SUBSYSTEM-REGION-001..005: background selection, pan/pinch, independent targets, title and saved selection verified in DOM; real browser remains required');
