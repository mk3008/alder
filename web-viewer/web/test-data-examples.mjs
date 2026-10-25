import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
const bundle=async(path,globalName)=>(await build({entryPoints:[path],bundle:true,write:false,format:'iife',globalName,loader:{'.css':'empty'}})).outputFiles[0].text;
const data=new JSDOM('',{runScripts:'outside-only'}).window;
data.eval(await bundle('src/data-examples.ts','Samples')+';globalThis.Samples=Samples;');data.eval(await bundle('src/concept-review-fixture.ts','Review')+';globalThis.Review=Review;');
const {dataExamples,findDataExample,renderDataExample}=data.Samples,{reviewGroups}=data.Review;
const expectedIDs=['request-draft','request-submitted','decision-approved','decision-resubmitted','handoff-batch','handoff-retry','result-partial','result-closed','result-none'];assert.deepEqual(Array.from(dataExamples,e=>e.id),expectedIDs);assert.equal(new Set(dataExamples.map(e=>e.id)).size,9);
const rows=(root,card)=>[...root.querySelectorAll(`[data-example-card="${card}"] tbody tr`)].map(tr=>[...tr.children].map(td=>td.textContent));
function verifyBusinessData(root,group){
 if(group==='group-handoff'){const targetTable=root.querySelector('[data-example-card=request] table');const preparationColumn=[...targetTable.querySelectorAll('th')].findIndex(th=>th.textContent==='準備番号');assert(preparationColumn>=0,'target table explicitly names preparation number');for(const row of rows(root,'request')){assert.equal(row[preparationColumn],rows(root,'preparation')[0][0],'target belongs to the displayed preparation');assert.equal(row[3],row[6],'target and approved version must match');assert.equal(row[5],'承認済み');}for(const row of rows(root,'item')){const target=rows(root,'request').find(r=>r[1]===row[0]);assert(target);assert.equal(row[1],target[3]);}}
 if(group==='group-result'){const balance=rows(root,'item');let allDone=true;for(const row of balance){const [q,r,c,w]=row.slice(2).map(Number);assert([q,r,c,w].every(x=>Number.isInteger(x)&&x>=0),'nonnegative quantities');assert.equal(q,r+c+w,'Q=R+C+W');const actual=rows(root,'line').filter(line=>line[1]===row[0]).reduce((sum,line)=>sum+Number(line[2]),0);assert.equal(r,actual,'R comes from the actual receipt lines');allDone&&=w===0;}const state=rows(root,'request')[0][3];assert.match(state,allDone?/で終結$/:/作業中（未終結）/);for(const line of rows(root,'line'))assert(rows(root,'receipt').some(row=>row[0]===line[0]),'line has a receipt');}
}
const rendered=new Map();
for(const example of dataExamples){const group=reviewGroups.find(g=>g.id===example.group),root=data.document.createElement('article');renderDataExample(root,group,example.id,()=>{});assert.match(root.textContent,/架空のデータ例/);assert.match(root.textContent,/独立した例/);assert.match(root.textContent,new RegExp(example.name));assert.equal(root.querySelector('select').value,example.id);assert.equal(root.querySelector('select').options.length,dataExamples.filter(e=>e.group===group.id).length);assert.deepEqual([...root.querySelectorAll('[data-example-card]')].map(e=>e.dataset.exampleCard).sort(),Object.keys(group.concepts).sort(),'every sample block corresponds to a visible model card');for(const block of root.querySelectorAll('[data-example-card]')){assert.equal(block.querySelector('h3').textContent,group.concepts[block.dataset.exampleCard].name);assert(block.querySelector('table').getAttribute('aria-label'));}verifyBusinessData(root,group.id);rendered.set(example.id,root);}
assert.equal(rows(rendered.get('request-draft'),'item')[0][2],'未入力');assert.match(rows(rendered.get('request-draft'),'version')[0][4],/未提出/);
assert.deepEqual(rows(rendered.get('request-submitted'),'item'),[['R-101','V1','ボールペン','10','100円'],['R-101','V1','ファイル','2','500円']]);
assert.deepEqual(rows(rendered.get('decision-approved'),'item'),rows(rendered.get('request-submitted'),'item'));
assert.equal(rows(rendered.get('decision-resubmitted'),'request')[0][1],'V2');assert.match(rows(rendered.get('decision-resubmitted'),'request')[0][4],/まだない/);assert(rows(rendered.get('decision-resubmitted'),'item').every(r=>r[1]==='V2'));assert.equal(rows(rendered.get('decision-resubmitted'),'item')[0][3],'12');assert(!rendered.get('decision-resubmitted').querySelector('table').textContent.includes('過去版の判断'),'do not invent mandatory judgment history storage');
const batch=rendered.get('handoff-batch'),retry=rendered.get('handoff-retry');assert.equal(rows(batch,'request').length,2);assert.equal(rows(batch,'item').length,3);assert.deepEqual(rows(batch,'item').filter(r=>r[0]==='R-101'),rows(rendered.get('request-submitted'),'item'));for(const card of ['request','item'])assert.deepEqual(rows(retry,card),rows(batch,card),'re-output preserves '+card);assert.equal(rows(batch,'preparation')[0][0],'P-001');assert.equal(rows(retry,'preparation')[0][0],'P-001');assert.match(retry.textContent,/未決/);
assert.deepEqual(rows(rendered.get('result-partial'),'item').map(r=>r.slice(2)),[['10','4','0','6'],['2','1','0','1']]);assert.deepEqual(rows(rendered.get('result-closed'),'item').map(r=>r.slice(2)),[['10','7','3','0'],['2','2','0','0']]);assert.equal(rows(rendered.get('result-closed'),'receipt').length,2);assert.equal(rows(rendered.get('result-none'),'receipt').length,0);assert.equal(rows(rendered.get('result-none'),'line').length,0);assert.match(rendered.get('result-none').textContent,/入庫回は0件/);
const badBalance=rendered.get('result-closed').cloneNode(true);badBalance.querySelector('[data-example-card=item] tbody tr').children[5].textContent='999';assert.throws(()=>verifyBusinessData(badBalance,'group-result'),/Q=R\+C\+W/);
assert(reviewGroups.find(g=>g.id==='group-handoff').concepts.request.fields.some(field=>field[1]==='準備番号'),'structure card includes preparation membership');
const badPreparation=batch.cloneNode(true);badPreparation.querySelector('[data-example-card=request] tbody tr').firstElementChild.textContent='P-999';assert.throws(()=>verifyBusinessData(badPreparation,'group-handoff'),/target belongs to the displayed preparation/);
const missingPreparation=batch.cloneNode(true);missingPreparation.querySelector('[data-example-card=request] thead tr').firstElementChild.remove();assert.throws(()=>verifyBusinessData(missingPreparation,'group-handoff'),/explicitly names preparation number/);
const badVersion=batch.cloneNode(true);badVersion.querySelector('[data-example-card=request] tbody tr').children[6].textContent='V2';assert.throws(()=>verifyBusinessData(badVersion,'group-handoff'),/version must match/);
// SAMPLE-KEY-COLOR-001: verify the actual rendered cells, including non-key exclusion.
const keyColors=new Map();
const domains={'準備番号':'preparation','申請':'request','対象申請':'request','入庫回':'receipt'};
for(const root of rendered.values())for(const table of root.querySelectorAll('table')){
 const headers=[...table.querySelectorAll('th')].map(th=>th.textContent);
 for(const row of table.querySelectorAll('tbody tr'))for(const [index,cell] of [...row.children].entries()){
  const domain=domains[headers[index]];
  if(!domain){assert(!cell.hasAttribute('data-key-tone'),'non-key cells are uncolored');continue;}
  const key=domain+':'+cell.textContent;assert.equal(cell.dataset.sampleKey,key);assert(cell.classList.contains('data-example-key'));
  assert(cell.dataset.keyTone,'identifier cell is colored');if(keyColors.has(key))assert.equal(cell.dataset.keyTone,keyColors.get(key),'same key has the same color across tables/scenes');keyColors.set(key,cell.dataset.keyTone);
 }
}
assert.equal(keyColors.size,5);assert.equal(new Set(keyColors.values()).size,5,'distinct IDs use distinct colors');
assert.equal(keyColors.get('preparation:P-001'),'yellow');assert.equal(keyColors.get('request:R-101'),'cyan');assert.equal(keyColors.get('request:R-102'),'green');
const keyAuthority=JSON.parse(readFileSync('verification/sample-key-colors.check-items.json','utf8'));assert.deepEqual(keyAuthority.checks.map(c=>c.id),['SAMPLE-KEY-COLOR-001']);
assert.equal(findDataExample('group-request','result-none'),undefined);
const shellCode=await bundle('src/viewer-shell.ts','Shell');
function harness(query='',group='group-handoff'){
 const w=new JSDOM('<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>',{url:'https://viewer.test/?view=concept&conceptFixture=purchase&concept='+group+query,runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.eval(shellCode+';globalThis.Shell=Shell;');let key='purchase';const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>({key,viewKey:'overview',activities:[],states:[{id:'request',name:'購入申請'}],views:[{key:'overview',name:'業務全体図'}]}),openActivity(){},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});shell.syncDocument();return{w,d:w.document,shell,other(){key='other';shell.syncDocument();}};
}
const {w,d,other}=harness();const $=s=>d.querySelector(s),choose=name=>[...d.querySelectorAll('.data-example-modes button')].find(b=>b.textContent===name).click();
try{
 const frame=$('[data-concept-view=group-handoff]');assert.equal(frame.hidden,false);$('#drawer').click();assert.equal($('.concept-related').hidden,false);choose('データ例');assert.equal(frame.hidden,true);assert.equal($('.concept-related').hidden,true);assert($('#drawer').disabled);assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-batch');assert.equal(new URL(w.location.href).searchParams.get('dataExample'),'handoff-batch');
 const picker=$('.data-example-picker select');picker.value='handoff-retry';picker.dispatchEvent(new w.Event('change'));assert.equal(new URL(w.location.href).searchParams.get('dataExample'),'handoff-retry');assert.match($('.data-examples-panel').textContent,/10:05/);
 choose('構造図');assert.equal($('[data-concept-view=group-handoff]'),frame);assert.equal(frame.hidden,false);assert.equal($('.concept-related').hidden,false,'restore the explicit drawer state');assert.equal(new URL(w.location.href).searchParams.get('dataExample'),null);w.history.back();await new Promise(r=>setTimeout(r,30));assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry');assert.equal($('.data-examples-panel').hidden,false);w.history.forward();await new Promise(r=>setTimeout(r,30));assert.equal($('.data-examples-panel').hidden,true);
 choose('データ例');assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry','returning from structure preserves the selected scene');const sampleURL=w.location.href;const direct=harness('&dataExample=handoff-batch&review=concept&reviewState=request');try{direct.shell.applyReview();assert.equal(direct.d.querySelector('.data-examples-panel').hidden,false);assert.equal(direct.d.querySelector('.data-examples-panel').dataset.dataExample,'handoff-batch');}finally{direct.w.close();}assert.match(sampleURL,/dataExample=/);
 $('[data-explorer-key="concept:group-result"]').click();assert.equal($('.data-examples-panel').hidden,true);choose('データ例');assert.equal($('.data-examples-panel').dataset.dataExample,'result-partial');$('[data-explorer-key="concept:group-handoff"]').click();assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry','each classification retains its own scene');
 assert.deepEqual([...d.querySelectorAll('.data-example-modes button')].map(b=>b.textContent),['概要','構造図','データ例']);
 choose('概要');assert.equal($('.data-review-overview').hidden,false);assert.equal($('.data-examples-panel').hidden,true);assert.equal(frame.hidden,true);assert($('#drawer').disabled);assert.equal(new URL(w.location.href).searchParams.get('dataView'),'overview');assert.equal(new URL(w.location.href).searchParams.get('dataExample'),null);assert.equal($('.concept-review-heading .review-owner'),null);assert.equal($('.concept-review-heading p'),null);assert.equal($('.concept-review-heading details'),null);assert.match($('.data-review-overview').textContent,/レビュー責任ロール候補購買業務責任者です。/);for(const label of ['主となる業務','確認先','受け取る情報','後続への保証','確認したいこと'])assert.match($('.data-review-overview').textContent,new RegExp(label));
 choose('構造図');assert.equal($('[data-concept-view=group-handoff]'),frame);assert.equal(frame.hidden,false);assert.equal($('.concept-related').hidden,false);w.history.back();await new Promise(r=>setTimeout(r,30));assert.equal($('.data-review-overview').hidden,false);w.history.forward();await new Promise(r=>setTimeout(r,30));assert.equal($('.data-review-overview').hidden,true);choose('概要');choose('データ例');assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry','overview preserves the last scene');
 const saved=JSON.parse(w.sessionStorage.getItem('alder-explorer-v1:/'));assert.equal(saved.examples['group-handoff'],'handoff-retry');other();assert.equal($('.data-examples-panel').hidden,true);$('[data-explorer-key="concept:landscape"]').click();assert.equal($('.concept-empty').hidden,false);assert.deepEqual(JSON.parse(w.sessionStorage.getItem('alder-explorer-v1:/')).examples,{});
}finally{w.close();}
const invalid=harness('&dataExample=result-none');try{assert.equal(invalid.d.querySelector('.data-examples-panel').hidden,true,'wrong classification scene is not applied');}finally{invalid.w.close();}
for(const group of reviewGroups){const direct=harness('&dataView=overview&review=concept&reviewState=request',group.id);try{direct.shell.applyReview();assert.equal(direct.d.querySelector('.data-review-overview').hidden,false);assert.equal(direct.d.querySelector('.data-examples-panel').hidden,true);assert.match(direct.d.querySelector('.data-review-overview').textContent,new RegExp(group.reviewer));assert.equal(direct.d.querySelector('.concept-review-heading p'),null);assert.equal(direct.d.querySelector('[data-example-mode=overview]').getAttribute('aria-pressed'),'true');}finally{direct.w.close();}}
// CAPABILITY-SAMPLE-001/002: JSON ownership and actual overview-to-scene navigation.
const reviewJSON=JSON.parse(readFileSync('src/business-review-content.json','utf8'));
assert.equal(reviewJSON.format,'alder-review-demo/1');assert.match(reviewJSON.source,/cbb3073/);
const nestedIDs=[];const capabilityIDs=new Set();
for(const group of reviewJSON.groups){
 const h=harness('&dataView=overview',group.id);
 try{
  assert.equal(h.d.querySelectorAll('.review-capability').length,group.capabilities.length);
  const owner=h.d.querySelector('.data-review-overview .review-owner');assert.equal(owner.tagName,'DD');assert.equal(owner.previousElementSibling.textContent,'レビュー責任ロール候補');
  for(const capability of group.capabilities){
   assert(!capabilityIDs.has(capability.id));capabilityIDs.add(capability.id);assert(capability.description&&capability.evidence.length&&capability.samples.length);
   for(const evidence of capability.evidence){assert(['apply','approve','revise','prepare','result'].includes(evidence.activity));assert(evidence.scene&&evidence.basis);}
   for(const sample of capability.samples){
    nestedIDs.push(sample.id);assert.equal(sample.group,undefined,'group is owned by the parent JSON');
    h.d.querySelector('[data-sample="'+sample.id+'"]').click();
    const panel=h.d.querySelector('.data-examples-panel');assert.equal(panel.hidden,false);assert.equal(panel.dataset.dataExample,sample.id);assert.equal(panel.dataset.capability,capability.id);assert.match(panel.textContent,new RegExp(capability.title));assert.match(panel.textContent,new RegExp(capability.description.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    assert.equal(new URL(h.w.location.href).searchParams.get('dataExample'),sample.id);
    const optgroup=panel.querySelector('option[value="'+sample.id+'"]').parentElement;assert.equal(optgroup.tagName,'OPTGROUP');assert.equal(optgroup.label,capability.title);
    h.w.history.back();await new Promise(r=>setTimeout(r,25));assert.equal(h.d.querySelector('.data-review-overview').hidden,false,'sample Back returns to overview');
   }
  }
  assert(group.limitations.every(item=>item.evidence.length&&item.description));
 }finally{h.w.close();}
}
assert.deepEqual(nestedIDs,expectedIDs);assert.equal(new Set(nestedIDs).size,9);
assert.match(reviewJSON.groups.find(g=>g.id==='group-handoff').questions.join(''),/検索.*未確定/);
const capabilityAuthority=JSON.parse(readFileSync('verification/capability-samples.check-items.json','utf8'));assert.deepEqual(capabilityAuthority.checks.map(c=>c.id),['CAPABILITY-SAMPLE-001','CAPABILITY-SAMPLE-002']);
const overviewAuthority=JSON.parse(readFileSync('verification/review-overview.check-items.json','utf8'));assert.deepEqual(overviewAuthority.checks.map(c=>c.id),['REVIEW-OVERVIEW-001','REVIEW-OVERVIEW-002']);
const authority=JSON.parse(readFileSync('verification/data-examples.check-items.json','utf8'));assert.deepEqual(authority.checks.map(c=>c.id),['DATA-EXAMPLE-001','DATA-EXAMPLE-002','DATA-EXAMPLE-003','DATA-EXAMPLE-004']);for(const c of authority.checks)for(const key of ['condition','guarantee','reason','verification'])assert(c[key]);data.close();console.log('PASS DATA-EXAMPLE-001..004 / REVIEW-OVERVIEW-001..002: CAPABILITY-SAMPLE-001/002, SAMPLE-KEY-COLOR-001, PURCHASE-TARGET-PREPARATION-001, nine rendered scenes, preparation membership and missing/mismatched number negative cases, card correspondence, arithmetic and fixed-version negative cases, modes, drawer/canvas preservation, history, direct entry and document boundary');
