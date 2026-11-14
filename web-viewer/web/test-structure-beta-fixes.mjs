import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {reviewSamples,samples,sourceURL} from '../../work/361-beta-fixes/prepare-review-samples.mjs';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const frozen=JSON.parse(readFileSync('../work/361-beta-fixes/authority-sha256.json'));
for(const [file,digest]of Object.entries(frozen))assert.equal(hash(readFileSync('../'+file)),digest,file);
const authority=JSON.parse(readFileSync('../work/361-beta-fixes/acceptance.json'));
const expected=authority.checks.flatMap(check=>check.cases.map(name=>check.id+':'+name));
const coverage=actual=>assert.deepEqual(actual.slice().sort(),expected.slice().sort());
coverage(expected);assert.throws(()=>coverage(expected.slice(1)));assert.throws(()=>coverage([...expected,expected[0]]));
const fewerIds=structuredClone(authority);fewerIds.checks.pop();assert.notEqual(hash(JSON.stringify(fewerIds)),frozen['work/361-beta-fixes/acceptance.json']);
const fewerCases=structuredClone(authority);fewerCases.checks[0].cases.pop();assert.notEqual(hash(JSON.stringify(fewerCases)),frozen['work/361-beta-fixes/acceptance.json']);
const pkg=JSON.parse(readFileSync(sourceURL)),revised=reviewSamples();
const model=pkg.documents.find(doc=>doc.kind==='conceptModel'),next=revised.documents.find(doc=>doc.kind==='conceptModel');
for(const field of next.meta.fieldMappings){
 if(Object.hasOwn(samples,field.informationId)){
  assert.equal(field.sampleValue,samples[field.informationId]);
  assert(field.sampleValue.trim());
  field.sampleValue=model.meta.fieldMappings.find(f=>f.informationId===field.informationId).sampleValue;
 }
}
assert.deepEqual(revised,pkg,'only the six authorized sample values change');
assert.equal(model.meta.fieldMappings.length,339);
assert.equal(model.meta.conceptNames['n-activity'].logicalName,'業務');
assert.equal(model.presentation.subsystemViews.nodes.find(n=>n.conceptId==='n-activity').name,'業務（Activity）');
assert.equal(model.meta.fieldMappings.find(f=>f.informationId==='n-who-field-3').sampleValue,'記録係');
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="host"></div>',{runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');
 const host=w.document.querySelector('#host');let selected;
 w.Explorer.renderStructureExplorer(host,model,{rootId:'n-activity',select:value=>{selected=value;}});
 const key=(el,key)=>el.dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
 const root=host.querySelector('summary');root.focus();key(root,'ArrowDown');assert.notEqual(w.document.activeElement,root);
 const first=w.document.activeElement;key(first,'ArrowUp');assert.equal(w.document.activeElement,root);
 key(root,'End');const last=w.document.activeElement;assert.notEqual(last,root);key(last,'Home');assert.equal(w.document.activeElement,root);
 key(root,'ArrowLeft');assert.equal(root.parentElement.open,false);key(root,'ArrowRight');assert.equal(root.parentElement.open,true);
 key(root,'ArrowRight');assert.notEqual(w.document.activeElement,root);key(w.document.activeElement,'ArrowLeft');assert.equal(w.document.activeElement,root);
 const search=host.querySelector('input[type=search]');search.value='performers';search.dispatchEvent(new w.Event('input'));
 const status=host.querySelector('[role=status]');assert.equal(status.hidden,false);assert.equal(status.textContent,'検索結果は0件です。');
 search.value='';search.dispatchEvent(new w.Event('input'));assert.equal(status.hidden,true);
 root.click();assert.equal(selected.conceptId,'n-activity');
}finally{w.close();}
console.log(JSON.stringify({samplesReviewed:339,samplesChanged:Object.keys(samples),sourceUnchanged:true,zeroResults:true,keyboardDOM:true,activityNames:'業務 / 業務（Activity）'}));
