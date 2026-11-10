import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {reviewHypothesisPackage,candidates} from '../../work/361-review-hypotheses/prepare-preview.mjs';
import {reviewDisplayCopy} from '../../work/361-copy-separation/prepare-display-copy.mjs';
const frozen=JSON.parse(readFileSync('../work/361-review-hypotheses/frozen.json'));
const pkg=reviewHypothesisPackage(),model=pkg.documents.find(d=>d.kind==='conceptModel'),base=reviewDisplayCopy(),baseModel=base.documents.find(d=>d.kind==='conceptModel');
const unchanged=JSON.stringify(pkg),stripped=structuredClone(pkg);delete stripped.documents.find(d=>d.kind==='conceptModel').meta.previewStructureReview;
assert.deepEqual(stripped,base);assert.equal(createHash('sha256').update(JSON.stringify(base)).digest('hex'),frozen.baselinePreviewSha256);
const fields=candidates.fields,mappings=model.meta.fieldMappings,results=[],record=(id,cases)=>{for(const name of cases)results.push({id,case:name,status:'pass',evidence:'test-structure-review-hypotheses.mjs: independent data/DOM/payload assertions'});};
assert.equal(Object.keys(fields).length,339);assert.equal(Object.values(fields).filter(f=>'purpose' in f).length,338);assert.equal(Object.values(fields).filter(f=>'sample' in f).length,207);
assert.deepEqual(Object.keys(fields).filter(id=>'sample' in fields[id]).sort(),[...frozen.exampleTargets].sort());
for(const mapping of mappings){
 const c=fields[mapping.informationId];assert.equal(c.status,'hypothesis');assert.ok(c.source.includes('/meta/fieldMappings/'));assert.ok(c.reason.trim());assert.ok(c.perspectiveReason.trim());
 assert.ok(c.perspectives.length>0&&c.perspectives.every(r=>['依頼者','設計者','開発者'].includes(r)));assert.equal(c.perspectives.length,new Set(c.perspectives).size);
 if(!mapping.logicalPurpose?.trim())assert.ok(c.purpose?.trim());else assert.equal(c.purpose,undefined,'original purpose is retained');
 if('sample' in c){
  const v=c.sample;assert.notEqual(v,null);assert.notEqual(v,'');assert.notEqual(v,undefined);if(typeof v==='object')assert.ok(Object.keys(v).length);
  const values=mapping.valueDomain?.values;if(values)assert.ok(values.some(x=>JSON.stringify(x.value)===JSON.stringify(v)),mapping.physicalName);
  const type=mapping.valueType;if(type==='string[]')assert.ok(Array.isArray(v)&&v.every(x=>typeof x==='string'),mapping.physicalName);else if(type==='array')assert.ok(Array.isArray(v));else if(type?.startsWith('object'))assert.ok(v&&typeof v==='object'&&!Array.isArray(v));else if(type==='boolean')assert.equal(typeof v,'boolean');else if(type?.startsWith('string')&&!type.includes('number')&&!type.includes('boolean'))assert.equal(typeof v,'string',mapping.physicalName);
 }
}
const diagnostic=mappings.find(m=>m.physicalName==='Package.diagnostics'),dc=fields[diagnostic.informationId];
assert.deepEqual(dc.sample,['0回の入力を未入力と区別する必要があるかは確認中。']);assert.equal(dc.purpose,'文書を読む際に残る補足や確認事項を共有し、合意済みの業務ルールと混同しない。');assert.deepEqual(dc.perspectives,['依頼者','設計者']);
record('REVIEW-HYP-001',['339-fields','338-purposes','all-empty-examples','valid-domain-types','grounded-diagnostics','multi-perspectives','provenance']);
assert.deepEqual(model.meta.fieldMappings,baseModel.meta.fieldMappings);assert.equal(mappings.filter(m=>m.nullable===null).length,47);
// Pinned bytes from 75f6b854; a shallow CI checkout need not contain its Git object.
const css=readFileSync('src/viewer-shell.css'),oldCssLength=36219,oldCssSha256='5c3e52aec090299ba0702dcf0a4afb772665360296a568cdb28dc8d0048f75af';
assert.equal(createHash('sha256').update(css.subarray(0,oldCssLength)).digest('hex'),oldCssSha256,'all prior CSS, including close and copy headings, is unchanged');
const changed=Buffer.from(css.subarray(0,oldCssLength));changed[0]^=1;assert.notEqual(createHash('sha256').update(changed).digest('hex'),oldCssSha256,'a prior-style byte change is rejected');
record('REVIEW-HYP-002',['only-preview-meta','all-existing-values','47-undecided','all-review-states','old-copy-hover']);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only'}).window;w.eval(code+';globalThis.Explorer=Explorer;');
try{
 const detail=w.document.querySelector('#detail'),show=(m=model,selection={kind:'structure',conceptId:'n-package'})=>w.Explorer.renderStructureDetails(detail,m,selection),attribute={kind:'attribute',conceptId:'n-package',informationId:diagnostic.informationId};
 const value=caption=>[...detail.querySelectorAll('dt')].find(dt=>(dt.querySelector('.structure-detail-caption')?.textContent??dt.textContent)===caption)?.nextElementSibling;
 show();assert.deepEqual([...detail.querySelectorAll('thead th')].map(x=>x.textContent),['項目','サンプル','説明','使用目的','確認する立場']);
 const row=detail.querySelector(`[data-information-id="${diagnostic.informationId}"]`);assert.equal(row.querySelector('.structure-attribute-sample').textContent,'[]');assert.ok(row.querySelector('.structure-review-hypothesis-value').textContent.includes('0回の入力'));assert.equal(row.querySelectorAll('.structure-review-hypothesis-label').length,3);
 row.querySelector('button').click();assert.ok(value('サンプル').textContent.startsWith('[]'));assert.ok(value('サンプル').textContent.includes('仮説（未確認）'));assert.equal(value('使用目的').querySelector('.structure-review-hypothesis-value').textContent,dc.purpose);assert.ok(value('確認する立場').textContent.includes('依頼者・設計者'));assert.equal(value('用途'),undefined);
 const disclosure=value('確認する立場').querySelector('details');assert.equal(disclosure.querySelector('summary').textContent,'候補の根拠');assert.ok(disclosure.textContent.includes(dc.source));assert.ok(disclosure.textContent.includes('実運用の記録・合意済み条件ではない'));
 record('REVIEW-HYP-003',['table','attribute','original-plus-hypothesis','purpose-separate-from-roles','provenance-visible','no-approval-claim']);
 show(baseModel,attribute);assert.equal(value('サンプル').textContent,'[]');assert.equal(value('確認する立場'),undefined);assert.equal(detail.querySelector('.structure-review-hypothesis'),null);assert.equal(value('使用目的').textContent,'');
 record('REVIEW-HYP-004',['absent-meta','no-runtime-generation']);
 for(const change of [m=>{m.meta.previewStructureReview.status='approved';},m=>{m.meta.previewStructureReview.fields[diagnostic.informationId].perspectives=['管理者'];},m=>{m.meta.previewStructureReview.fields[diagnostic.informationId].status='approved';}]){const bad=structuredClone(model);change(bad);show(bad,attribute);assert.equal(detail.querySelector('.structure-review-hypothesis'),null);assert.equal(value('サンプル').textContent,'[]');}
 record('REVIEW-HYP-004',['malformed-meta','unknown-role']);
 const unsafe=structuredClone(model),entry=unsafe.meta.previewStructureReview.fields[diagnostic.informationId];entry.sample='<script>alert(1)</script>';entry.purpose='<img src=x onerror=alert(1)>';entry.source='<svg onload=alert(1)>';
 show(unsafe,attribute);assert.equal(detail.querySelector('script,img,svg[onload]'),null);assert.ok(detail.textContent.includes('<img src=x onerror=alert(1)>'));record('REVIEW-HYP-004',['unsafe-text']);
 const writes=[];Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async text=>writes.push(text)}});const tick=()=>new Promise(r=>setTimeout(r,0));
 show(baseModel,attribute);detail.querySelector('.structure-copy-id').click();await tick();const oldIdentity=writes.at(-1);
 show(model,attribute);detail.querySelector('.structure-copy-id').click();await tick();assert.equal(writes.at(-1),oldIdentity);record('REVIEW-HYP-005',['identity-copy']);
 detail.querySelector('.structure-copy-full').click();await tick();const full=writes.at(-1);assert.ok(full.includes('使用目的：'));assert.ok(full.includes('確認する立場：'));assert.ok(full.includes('仮説（未確認）'));assert.ok(full.includes('0回の入力を未入力と区別する必要があるか'));assert.ok(!full.includes('識別情報をコピー'));assert.ok(!full.includes('全文をコピー'));record('REVIEW-HYP-005',['full-copy-hypothesis']);
 detail.querySelector('.structure-copy-id').dispatchEvent(new w.MouseEvent('click',{bubbles:true,shiftKey:true}));await tick();assert.equal(writes.at(-1),full);assert.ok(detail.querySelector('[role=status]').textContent.includes('全文'));record('REVIEW-HYP-005',['shift-and-notification']);
 assert.equal(JSON.stringify(pkg),unchanged);
 mkdirSync('web/evidence/review-hypotheses',{recursive:true});writeFileSync('web/evidence/review-hypotheses/node-results.json',JSON.stringify({results,scope:'Node/DOM/data; protected bytes and browser geometry/navigation/close remain separate'},null,2)+'\n');console.log(JSON.stringify({reviewHypotheses:{fields:339,purposes:338,samples:207,results}}));
}finally{w.close();}
