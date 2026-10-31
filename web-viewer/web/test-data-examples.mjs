import {context} from './fixtures/concept-sample.ts';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const bundle=async(path,globalName)=>(await build({entryPoints:[path],bundle:true,write:false,format:'iife',globalName,loader:{'.css':'empty'}})).outputFiles[0].text;
const data=new JSDOM('',{runScripts:'outside-only'}).window;
data.eval(await bundle('web/fixtures/concept-sample.ts','Samples')+';globalThis.Samples=Samples;');data.eval(await bundle('web/fixtures/concept-sample.ts','Review')+';globalThis.Review=Review;');
const {dataExamples,findDataExample,renderDataExample}=data.Samples,{reviewGroups}=data.Review;
const expectedIDs=['request-draft-empty','request-draft','request-draft-approved','request-draft-prepared','request-submitted','decision-approved','decision-resubmitted','handoff-batch','handoff-retry','result-partial','result-closed','result-none'];assert.deepEqual(Array.from(dataExamples,e=>e.id),expectedIDs);assert.equal(new Set(dataExamples.map(e=>e.id)).size,12);
const rows=(root,card)=>[...root.querySelectorAll(`[data-example-card="${card}"] tbody tr`)].map(tr=>[...tr.children].map(td=>td.textContent));
const namedRows=(root,card)=>{const block=root.querySelector(`[data-example-card="${card}"]`),headers=[...block.querySelectorAll('th')].map(th=>th.textContent);return rows(root,card).map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]])));};
function verifyBusinessData(root,group){
 if(group==='group-handoff'){const targetTable=root.querySelector('[data-example-card=request] table');const preparationColumn=[...targetTable.querySelectorAll('th')].findIndex(th=>th.textContent==='準備番号');assert(preparationColumn>=0,'target table explicitly names preparation number');for(const row of rows(root,'request')){assert.equal(row[preparationColumn],rows(root,'preparation')[0][0],'target belongs to the displayed preparation');assert.equal(row[3],row[6],'target and approved version must match');assert.equal(row[5],'承認済み');}for(const row of rows(root,'item')){const target=rows(root,'request').find(r=>r[1]===row[0]);assert(target);assert.equal(row[1],target[3]);}}
 if(group==='group-result'){const balance=namedRows(root,'item'),lines=namedRows(root,'line');let allDone=true;for(const row of balance){const [q,r,c,w]=['依頼数量 Q','入庫累計 R','購入しない C','待ち W'].map(key=>Number(row[key]));assert([q,r,c,w].every(x=>Number.isInteger(x)&&x>=0),'nonnegative quantities');assert.equal(q,r+c+w,'Q=R+C+W');if(row['品目番号']===undefined)assert.equal(lines.length,0,'a receipt line needs an identifiable item');const actual=lines.filter(line=>line['申請']===row['申請']&&line['対象版']===row['対象版']&&line['元品目番号']===row['品目番号']).reduce((sum,line)=>sum+Number(line['今回入庫数量']),0);assert.equal(r,actual,'R comes from the actual receipt lines for the identified item');allDone&&=w===0;}const state=rows(root,'request')[0][3];assert.match(state,allDone?/で終結$/:/作業中（未終結）/);for(const line of lines){assert(rows(root,'receipt').some(row=>row[0]===line['入庫回']),'line has a receipt');const item=balance.find(row=>row['申請']===line['申請']&&row['対象版']===line['対象版']&&row['品目番号']===line['元品目番号']);assert(item,'line has an identified item');assert.equal(line['元の品名'],item['品名'],'line displays the identified item name');}}
}
const rendered=new Map();
for(const example of dataExamples){const group=reviewGroups.find(g=>g.id===example.group),root=data.document.createElement('article');renderDataExample(root,group,example.id,()=>{});assert.doesNotMatch(root.textContent,/架空のデータ例|独立した例|同時に成立する状態ではありません|同じ色は同じ対象を示します/);assert.equal(root.querySelector('.data-example-caption'),null);assert.match(root.textContent,new RegExp(example.name));assert.equal(root.querySelector('select').value,example.id);assert.equal(root.querySelector('select').options.length,dataExamples.filter(e=>e.group===group.id).length);assert.deepEqual([...root.querySelectorAll('[data-example-card]')].map(e=>e.dataset.exampleCard).sort(),Object.keys(group.concepts).sort(),'every sample block corresponds to a visible model card');for(const block of root.querySelectorAll('[data-example-card]')){assert.equal(block.querySelector('h3').textContent,group.concepts[block.dataset.exampleCard].name);assert(block.querySelector('table').getAttribute('aria-label'));}verifyBusinessData(root,group.id);rendered.set(example.id,root);}
assert.equal(rows(rendered.get('request-draft'),'item')[0][3],'未入力');assert.match(rows(rendered.get('request-draft'),'version')[0][5],/未提出/);
assert.equal(rows(rendered.get('request-draft-empty'),'item').length,0);
for(const id of ['request-draft-approved','request-draft-prepared']){const request=rows(rendered.get(id),'request')[0],versions=rows(rendered.get(id),'version'),items=rows(rendered.get(id),'item');assert.equal(request[2],request[3]);assert.equal(request[4],'V1');assert.deepEqual(versions.map(r=>r.slice(1,4)),[['V1','提出済み','承認済み'],['D1','下書き','未提出']]);assert.deepEqual(items.map(r=>r.slice(1,4)),[['V1','ボールペン','10'],['D1','ボールペン','12']]);}
assert.deepEqual(rows(rendered.get('request-submitted'),'item'),[['R-101','V1','ボールペン','10','100円'],['R-101','V1','ファイル','2','500円']]);
assert.deepEqual(rows(rendered.get('decision-approved'),'item'),rows(rendered.get('request-submitted'),'item'));
assert.equal(rows(rendered.get('decision-resubmitted'),'request')[0][1],'V2');assert.match(rows(rendered.get('decision-resubmitted'),'request')[0][4],/まだない/);assert(rows(rendered.get('decision-resubmitted'),'item').every(r=>r[1]==='V2'));assert.equal(rows(rendered.get('decision-resubmitted'),'item')[0][3],'12');assert(!rendered.get('decision-resubmitted').querySelector('table').textContent.includes('過去版の判断'),'do not invent mandatory judgment history storage');
const batch=rendered.get('handoff-batch'),retry=rendered.get('handoff-retry');assert.equal(rows(batch,'request').length,2);assert.equal(rows(batch,'item').length,3);assert.deepEqual(rows(batch,'item').filter(r=>r[0]==='R-101'),rows(rendered.get('request-submitted'),'item'));for(const card of ['request','item'])assert.deepEqual(rows(retry,card),rows(batch,card),'re-output preserves '+card);assert.equal(rows(batch,'preparation')[0][0],'P-001');assert.equal(rows(retry,'preparation')[0][0],'P-001');assert(!retry.textContent.includes('未決'),'internal open questions are not presented as business content');
assert.deepEqual(rows(rendered.get('result-partial'),'item').map(r=>r.slice(5)),[['10','4','0','6'],['2','1','0','1']]);assert.deepEqual(rows(rendered.get('result-closed'),'item').map(r=>r.slice(5)),[['10','7','3','0'],['2','2','0','0']]);assert.equal(rows(rendered.get('result-closed'),'receipt').length,2);assert.equal(rows(rendered.get('result-none'),'receipt').length,0);assert.equal(rows(rendered.get('result-none'),'line').length,0);assert.match(rendered.get('result-none').textContent,/入庫回は0件/);
const badBalance=rendered.get('result-closed').cloneNode(true);badBalance.querySelector('[data-example-card=item] tbody tr').children[8].textContent='999';assert.throws(()=>verifyBusinessData(badBalance,'group-result'),/Q=R\+C\+W/);
const duplicateNames=rendered.get('result-partial').cloneNode(true);for(const row of duplicateNames.querySelectorAll('[data-example-card=item] tbody tr'))row.children[3].textContent='同じ品名';for(const row of duplicateNames.querySelectorAll('[data-example-card=line] tbody tr'))row.children[4].textContent='同じ品名';verifyBusinessData(duplicateNames,'group-result');
const badItemReference=duplicateNames.cloneNode(true);badItemReference.querySelector('[data-example-card=line] tbody tr').children[3].textContent='02';assert.throws(()=>verifyBusinessData(badItemReference,'group-result'),/identified item/);
const badItemName=rendered.get('result-partial').cloneNode(true);badItemName.querySelector('[data-example-card=line] tbody tr').children[4].textContent='別の品名';assert.throws(()=>verifyBusinessData(badItemName,'group-result'),/identified item name/);
assert(reviewGroups.find(g=>g.id==='group-handoff').concepts.request.fields.some(field=>field[1]==='準備番号'),'structure card includes preparation membership');
const badPreparation=batch.cloneNode(true);badPreparation.querySelector('[data-example-card=request] tbody tr').firstElementChild.textContent='P-999';assert.throws(()=>verifyBusinessData(badPreparation,'group-handoff'),/target belongs to the displayed preparation/);
const missingPreparation=batch.cloneNode(true);missingPreparation.querySelector('[data-example-card=request] thead tr').firstElementChild.remove();assert.throws(()=>verifyBusinessData(missingPreparation,'group-handoff'),/explicitly names preparation number/);
const badVersion=batch.cloneNode(true);badVersion.querySelector('[data-example-card=request] tbody tr').children[6].textContent='V2';assert.throws(()=>verifyBusinessData(badVersion,'group-handoff'),/version must match/);
// SAMPLE-KEY-MUTED-002: distinguish keys within each rendered scene, not across scenes.
const domains={'準備番号':'preparation','申請':'request','対象申請':'request','入庫回':'receipt'};
const additionalLinkColumns=new Set(['版','対象版','承認対象版','現在の提出版','判断対象版','現在の判断対象版','品目番号','元品目番号']);
for(const [scene,root] of rendered){
 const keyColors=new Map();
 for(const table of root.querySelectorAll('table')){
  const headers=[...table.querySelectorAll('th')].map(th=>th.textContent);
  for(const row of table.querySelectorAll('tbody tr'))for(const [index,cell] of [...row.children].entries()){
   const domain=domains[headers[index]];let key;
   if(domain){key=domain+':'+cell.textContent;assert.equal(cell.dataset.sampleKey,key);}
   else if(additionalLinkColumns.has(headers[index])&&cell.dataset.sampleKey){key=cell.dataset.sampleKey;assert(/^(version|item):/.test(key));}
   else{assert(!cell.hasAttribute('data-key-tone'),'unlinked cells are uncolored');continue;}
   assert(cell.classList.contains('data-example-key'));
   assert(cell.dataset.keyTone,'identifier cell is colored');if(keyColors.has(key))assert.equal(cell.dataset.keyTone,keyColors.get(key),'same key has the same color across tables');keyColors.set(key,cell.dataset.keyTone);
  }
 }
 assert.equal(new Set(keyColors.values()).size,keyColors.size,'different keys use different colors within '+scene);
}
const tone=(root,key)=>root.querySelector(`[data-sample-key="${key}"]`).dataset.keyTone;
assert.equal(tone(batch,'preparation:P-001'),tone(rendered.get('request-submitted'),'request:R-101'),'different pages can reuse a color');
assert.notEqual(tone(batch,'request:R-101'),tone(batch,'request:R-102'),'different requests in the same scene remain distinguishable');
// New link IDs must be colored even when they were not part of the purchase fixture.
const sample=dataExamples.find(e=>e.id==='handoff-batch'),requestBlock=sample.blocks.find(b=>b.card==='request');
const requestIndex=requestBlock.columns.indexOf('申請'),originalRows=requestBlock.rows.length;
let extendedKeyColors;
assert(requestIndex>=0);
try{
 for(let n=0;n<8;n++){const row=[...requestBlock.rows[0]],keys=row.map(()=>undefined);row[requestIndex]='R-NEW-'+n;keys[requestIndex]='request:R-NEW-'+n;requestBlock.rows.push(row);requestBlock.keyIds.push(keys);}
 const root=data.document.createElement('article');renderDataExample(root,reviewGroups.find(g=>g.id===sample.group),sample.id,()=>{});
 const cells=[...root.querySelectorAll('[data-sample-key]')],colorsByKey=new Map();
 for(const cell of cells){const key=cell.dataset.sampleKey,value=cell.dataset.keyTone;if(colorsByKey.has(key))assert.equal(colorsByKey.get(key),value);colorsByKey.set(key,value);}
 extendedKeyColors=colorsByKey;
 assert.equal(new Set(colorsByKey.values()).size,colorsByKey.size,'palette overflow does not reuse a tone within a scene');
 assert.equal(colorsByKey.size,13);
 const extras=cells.filter(c=>c.dataset.keyTone.startsWith('extra-'));
 for(const theme of ['light','dark']){const backgrounds=extras.map(c=>c.style.getPropertyValue('--sample-key-extra-'+theme));assert(backgrounds.every(Boolean));assert.equal(new Set(backgrounds).size,extras.length,'extra keys use different '+theme+' backgrounds');}
}finally{requestBlock.rows.length=originalRows;requestBlock.keyIds.length=originalRows;}
const keyAuthority=JSON.parse(readFileSync('verification/sample-key-colors.check-items.json','utf8'));assert.deepEqual(keyAuthority.checks.map(c=>c.id),['SAMPLE-KEY-COLOR-001']);
const mutedAuthorityBytes=readFileSync('verification/sample-key-muted.check-items.json');
assert.equal(createHash('sha256').update(mutedAuthorityBytes).digest('hex'),'3cde2e859420ddade4ec52fac5b17cb766f7c47066b0b08d5b86434ce7a75991');
assert.deepEqual(JSON.parse(mutedAuthorityBytes).checks.map(c=>c.id),['SAMPLE-KEY-MUTED-001','SAMPLE-KEY-MUTED-002']);
const pastelAuthorityBytes=readFileSync('verification/sample-key-pastel.check-items.json');
assert.equal(createHash('sha256').update(pastelAuthorityBytes).digest('hex'),'12057964b486d623f5ec89720acae392dc353389574433aee681d22eae923dca');
const pastelAuthority=JSON.parse(pastelAuthorityBytes);assert.deepEqual(pastelAuthority.checks.map(c=>c.id),['SAMPLE-KEY-PASTEL-001','SAMPLE-KEY-PASTEL-002']);
// SAMPLE-KEY-PASTEL-001/002: use the chosen colors and keep both themes readable.
const css=readFileSync('src/viewer-shell.css','utf8'),rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
const luminance=hex=>rgb(hex).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const lightBackgrounds=new Map();
for(const name of ['yellow','cyan','green','blue','purple','orange'])for(const dark of [false,true]){
 const selector=(dark?'[data-theme=dark] ':'')+`.data-example-key[data-key-tone=${name}]`;
 const line=css.split('\n').find(line=>line.startsWith(selector+'{'));assert(line,selector);
 const colors=line.match(/--sample-key-bg:(#[0-9a-f]{6});--sample-key-fg:(#[0-9a-f]{6})/i);assert(colors,selector);
 assert(contrast(colors[1],colors[2])>=4.5,selector+' text contrast');
 if(!dark)lightBackgrounds.set(name,colors[1].toLowerCase());
}
assert.deepEqual([...extendedKeyColors.values()].slice(0,5).map(name=>lightBackgrounds.get(name)),pastelAuthority.palette,'first five distinct keys use the selected palette in order');
assert.deepEqual(['preparation:P-001','request:R-101','version:R-101:V1','request:R-102','version:R-102:V1'].map(key=>lightBackgrounds.get(tone(batch,key))),pastelAuthority.palette,'the handoff scene retains the chosen palette order for all five targets');
assert.equal(new Set(lightBackgrounds.values()).size,lightBackgrounds.size,'the retained sixth tone stays distinct');
assert.equal(findDataExample('group-request','result-none'),undefined);
const shellCode=await bundle('src/viewer-shell.ts','Shell');
function harness(query='',group='group-handoff'){
 const w=new JSDOM('<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>',{url:'https://viewer.test/?view=concept&concept='+group+(query.includes('dataView=')?'':'&dataView=structure')+query,runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.eval(shellCode+';globalThis.Shell=Shell;');let key='purchase';const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>({concept:key==='purchase'?context:undefined,key,viewKey:'overview',activities:[],states:[{id:'request',name:'購入申請'}],views:[{key:'overview',name:'業務全体図'}]}),openActivity(){},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});shell.syncDocument();return{w,d:w.document,shell,other(){key='other';shell.syncDocument();}};
}
const identityDetails=harness('','group-request');try{
 identityDetails.d.querySelector('#drawer').click();const frame=identityDetails.d.querySelector('[data-concept-view=group-request]');
 for(const [id,description] of [['request','申請の識別で、別の申請と区別する想定。'],['version','申請と、その申請内の版の識別を組み合わせて区別する想定。'],['item','申請版と、その版内の品目の識別を組み合わせて区別する想定。']]){identityDetails.w.dispatchEvent(new identityDetails.w.MessageEvent('message',{origin:identityDetails.w.location.origin,source:frame.contentWindow,data:{type:'alder-concept-select',id}}));assert(identityDetails.d.querySelector('.concept-related-content').textContent.includes(description),id+' detail shows the identification hypothesis');}
}finally{identityDetails.w.close();}
const {w,d,other}=harness();const $=s=>d.querySelector(s);
const openExamples=async()=>{$('#concept-drawer-examples').click();await new Promise(r=>setTimeout(r,0));};
try{
 const frame=$('[data-concept-view=group-handoff]');assert.equal(frame.hidden,false);assert($('.concept-related').hidden);$('#drawer').click();assert.equal($('.concept-related').hidden,false);await openExamples();assert.equal(frame.hidden,false,'examples keep the graph visible');assert.equal($('.concept-related').hidden,false);assert(!$('#drawer').disabled);assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-batch');assert.equal(new URL(w.location.href).searchParams.get('dataExample'),'handoff-batch');
 const picker=$('.data-example-picker select');picker.value='handoff-retry';picker.dispatchEvent(new w.Event('change'));assert.equal(new URL(w.location.href).searchParams.get('dataExample'),'handoff-retry');assert.match($('.data-examples-panel').textContent,/10:05/);
 $('#concept-drawer-overview').click();assert.equal($('[data-concept-view=group-handoff]'),frame);assert.equal(frame.hidden,false);assert.equal(new URL(w.location.href).searchParams.get('dataExample'),null);w.history.back();await new Promise(r=>setTimeout(r,30));assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry');assert.equal($('#concept-drawer-examples').getAttribute('aria-selected'),'true');w.history.forward();await new Promise(r=>setTimeout(r,30));assert.equal($('#concept-drawer-examples').getAttribute('aria-selected'),'false');
 await openExamples();assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry','selected scene persists');const direct=harness('&dataExample=handoff-batch&review=concept&reviewState=request');try{assert.equal(direct.d.querySelector('.concept-related').hidden,true,'deep links preserve the global closed preference');direct.d.querySelector('#drawer').click();assert.equal(direct.d.querySelector('#concept-drawer-examples').getAttribute('aria-selected'),'true');assert.equal(direct.d.querySelector('.data-examples-panel').dataset.dataExample,'handoff-batch');assert.equal(direct.d.querySelector('[data-concept-view=group-handoff]').hidden,false);}finally{direct.w.close();}
 $('[data-explorer-key="concept:group-result"]').click();assert.equal($('#concept-drawer-examples').getAttribute('aria-selected'),'false');assert.equal($('.concept-related').hidden,false,'open state is shared across pages');await openExamples();assert.equal($('.data-examples-panel').dataset.dataExample,'result-partial');$('[data-explorer-key="concept:group-handoff"]').click();assert.equal($('.data-examples-panel').dataset.dataExample,'handoff-retry');assert.equal($('.concept-main .data-example-modes'),null);
 $('#concept-drawer-overview').click();assert.match($('.data-review-overview').textContent,/レビュアー購買担当者/);for(const label of ['確認先','主となる業務','レビュー責任ロール候補','レビュー範囲・受け渡し','受け取る情報','後続への保証','確認が必要なこと'])assert(!$('.data-review-overview').textContent.includes(label));
 const saved=JSON.parse(w.sessionStorage.getItem('alder-explorer-v1:/'));assert.equal(saved.lastExamples['group-handoff'],'handoff-retry');other();assert.equal($('.data-examples-panel').hidden,true);
  assert.equal($('[data-explorer-key="group:states"]').disabled,false,'authored states are still available');
  for(const [id,label] of [['subsystems','サブシステム'],['concept','データ構造']]){
   const heading=$('[data-explorer-key="group:'+id+'"]');assert.equal(heading.disabled,true);assert.equal(heading.textContent,label);assert.equal(d.querySelectorAll('#explorer-'+id+' .explorer-item').length,0);
  }
  assert.equal($('[data-explorer-key="concept:landscape"]'),null);assert.equal($('#concept-workspace').hidden,true);assert.deepEqual(JSON.parse(w.sessionStorage.getItem('alder-explorer-v1:/')).examples,{});
}finally{w.close();}
const invalid=harness('&dataExample=result-none');try{assert.equal(invalid.d.querySelector('#concept-drawer-examples').getAttribute('aria-selected'),'false','wrong classification scene is not applied');assert.notEqual(invalid.d.querySelector('.data-examples-panel').dataset.dataExample,'result-none');}finally{invalid.w.close();}
for(const group of reviewGroups){const direct=harness('&dataView=overview&review=concept&reviewState=request',group.id);try{assert.equal(direct.d.querySelector('.concept-related').hidden,true,'deep links preserve the global closed preference');direct.d.querySelector('#drawer').click();assert.equal(direct.d.querySelector('#concept-drawer-overview').getAttribute('aria-selected'),'true');assert.equal(direct.d.querySelector('#concept-drawer-examples').getAttribute('aria-selected'),'false');assert.match(direct.d.querySelector('.data-review-overview').textContent,new RegExp(data.Samples.contentFor(group.id).reviewer.role));assert.equal(direct.d.querySelector('[data-concept-view="'+group.id+'"]').hidden,false);assert.equal(direct.d.querySelector('.concept-main .data-example-modes'),null);}finally{direct.w.close();}}
// CAPABILITY-SAMPLE-001/002: JSON ownership and actual overview-to-scene navigation.
const sourceModel=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-concepts-v2-beta.json','utf8'));
const nativeBD=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8')).documents.find(d=>d.activities);
assert.equal(sourceModel.basedOn.revision,nativeBD.revision);
const reviewJSON={groups:data.Samples.reviewContents};
const nestedIDs=[];const capabilityIDs=new Set();
for(const group of reviewJSON.groups){
 const h=harness('&dataView=overview',group.id);
 try{
  assert.equal(h.d.querySelectorAll('.review-capability').length,group.capabilities.length);
  const owner=h.d.querySelector('.data-review-overview .review-owner');assert.equal(owner.tagName,'P');assert.equal(owner.previousElementSibling.textContent,'レビュアー');assert.equal(owner.textContent,group.reviewer.role);
  for(const capability of group.capabilities){
   assert(!capabilityIDs.has(capability.id));capabilityIDs.add(capability.id);assert(capability.description&&capability.meta.evidence.length&&capability.samples.length);
   for(const evidence of capability.meta.evidence){assert(nativeBD.activities.some(a=>a.id===evidence.activityId));assert(evidence.scene&&evidence.basis);}
   for(const sample of capability.samples){
    nestedIDs.push(sample.id);assert.equal(sample.group,undefined,'group is owned by the parent JSON');
    h.d.querySelector('[data-sample="'+sample.id+'"]').click();
    const panel=h.d.querySelector('.data-examples-panel');assert.equal(panel.hidden,false);assert.equal(panel.dataset.dataExample,sample.id);assert.equal(panel.dataset.capability,capability.id);assert.match(panel.textContent,new RegExp(capability.title));assert.match(panel.textContent,new RegExp(capability.description.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    assert.equal(new URL(h.w.location.href).searchParams.get('dataExample'),sample.id);
    const optgroup=panel.querySelector('option[value="'+sample.id+'"]').parentElement;assert.equal(optgroup.tagName,'OPTGROUP');assert.equal(optgroup.label,capability.title);
    const back=new Promise(resolve=>h.w.addEventListener('popstate',resolve,{once:true}));h.w.history.back();await back;assert.equal(h.d.querySelector('.data-review-overview').hidden,false,'sample Back returns to overview');
   }
  }
  assert(group.limitations.every(item=>item.meta.evidence.length&&item.description));
 }finally{h.w.close();}
}
assert.deepEqual(nestedIDs,expectedIDs);assert.equal(new Set(nestedIDs).size,12);
assert.match(reviewJSON.groups.find(g=>g.id==='group-handoff').meta.questions.join(''),/検索.*未確定/);
// STRUCTURED-OVERVIEW-001/002: resolve reviewer and activity identities against the actual BD.
data.eval(await bundle('src/concept-review.ts','Overview')+';globalThis.Overview=Overview;');
for(const content of reviewJSON.groups){
 const group=reviewGroups.find(g=>g.id===content.id),root=data.document.createElement('article'),opened=[];
 assert(content.title&&content.description&&content.reviewer.role);assert(nativeBD.activities.some(a=>a.who===content.reviewer.role));
 for(const a of content.relatedActivities)assert(nativeBD.activities.some(b=>b.id===a.id&&b.name===a.name));
 data.Overview.renderReviewOverview(root,group,data.Samples.sampleIndex,()=>{},id=>opened.push(id),nativeBD.activities);
 assert.equal(root.querySelector('.review-description').textContent,content.description);
 const structures=[...root.querySelectorAll('.review-structure')];assert.equal(structures.length,content.structureStatements.length);
 for(const [i,section] of structures.entries()){const item=content.structureStatements[i];assert.equal(section.dataset.structure,item.id);assert.equal(section.querySelector('h4').textContent,item.title);assert.equal(section.querySelector('p').textContent,item.description);assert.equal(section.querySelector('button, a'),null,'structure explanation does not duplicate sample links');}
 for(const capability of content.capabilities){const section=root.querySelector(`[data-capability="${capability.id}"]`);assert(section);assert.deepEqual([...section.querySelectorAll('[data-sample]')].map(b=>b.dataset.sample),Array.from(capability.samples,s=>s.id),'every capability retains its own sample links');}
 const buttons=[...root.querySelectorAll('.review-related-activities button')];assert.equal(buttons.length,content.relatedActivities.length);
 for(const [i,b] of buttons.entries()){assert(!b.disabled);assert(b.querySelector('[data-icon="square-arrow-out-up-right"]'));assert.equal(b.textContent,content.relatedActivities[i].name);b.click();assert.equal(opened.at(-1),content.relatedActivities[i].id);}
 assert.equal(root.querySelectorAll('.review-limitation').length,content.limitations.length);
 for(const [i,section]of [...root.querySelectorAll('.review-limitation')].entries()){const item=content.limitations[i];assert.equal(section.querySelector('h4').textContent,item.title);assert(section.textContent.includes(item.description));assert(section.textContent.includes(item.reason));}
 for(const hidden of [content.id,...content.meta.questions,...content.capabilities.flatMap(c=>c.meta.evidence.map(e=>e.basis))])assert(!root.textContent.includes(hidden),'metadata is not shown: '+hidden);
 data.Overview.renderReviewOverview(root,group,data.Samples.sampleIndex,()=>{},()=>assert.fail('must not open an unrelated document'),nativeBD.activities.map(a=>({...a,id:'other-'+a.id})));
 for(const b of root.querySelectorAll('.review-related-activities button')){assert(b.disabled);b.click();}
}
const structuredAuthority=JSON.parse(readFileSync('verification/structured-overview.check-items.json','utf8'));assert.deepEqual(structuredAuthority.checks.map(c=>c.id),['STRUCTURED-OVERVIEW-001','STRUCTURED-OVERVIEW-002']);
const linkAuthorityBytes=readFileSync('verification/overview-sample-links.check-items.json');assert.equal(createHash('sha256').update(linkAuthorityBytes).digest('hex'),'28792fcd91f01025f776486c7ddc67c9c1c4abaa483e747c77a7974f0d8c277f');assert.deepEqual(JSON.parse(linkAuthorityBytes).checks.map(c=>c.id),['OVERVIEW-SAMPLE-LINKS-001','OVERVIEW-SAMPLE-LINKS-002']);
const capabilityAuthority=JSON.parse(readFileSync('verification/capability-samples.check-items.json','utf8'));assert.deepEqual(capabilityAuthority.checks.map(c=>c.id),['CAPABILITY-SAMPLE-001','CAPABILITY-SAMPLE-002']);
const overviewAuthority=JSON.parse(readFileSync('verification/review-overview.check-items.json','utf8'));assert.deepEqual(overviewAuthority.checks.map(c=>c.id),['REVIEW-OVERVIEW-001','REVIEW-OVERVIEW-002']);
const authority=JSON.parse(readFileSync('verification/data-examples.check-items.json','utf8'));assert.deepEqual(authority.checks.map(c=>c.id),['DATA-EXAMPLE-001','DATA-EXAMPLE-002','DATA-EXAMPLE-003','DATA-EXAMPLE-004']);for(const c of authority.checks)for(const key of ['condition','guarantee','reason','verification'])assert(c[key]);data.close();console.log('PASS DATA-EXAMPLE-001..004 / REVIEW-OVERVIEW-001..002: STRUCTURED-OVERVIEW-001/002, CAPABILITY-SAMPLE-001/002, SAMPLE-KEY-COLOR-001, PURCHASE-TARGET-PREPARATION-001, twelve rendered scenes, preparation membership and missing/mismatched number negative cases, card correspondence, arithmetic and fixed-version negative cases, modes, drawer/canvas preservation, history, direct entry and document boundary');
await import('./test-sample-identification.mjs');
