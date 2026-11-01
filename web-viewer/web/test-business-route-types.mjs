import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const authority='verification/business-route-types.check-items.json',hash='083d39090a483650803709458ae43c45ff92da338d0e2ae8b8c08f517021a966';
const verify=()=>{const bytes=readFileSync(authority);assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);return JSON.parse(bytes).checks.map(c=>c.id);};
const ids=verify(),covered=new Set();
assert.deepEqual(ids,['BUSINESS-ROUTE-TYPE-001','BUSINESS-ROUTE-TYPE-002','BUSINESS-ROUTE-TYPE-003']);
const path='../work/concept-review/issue-133/versions/purchase-v9-draft-routes-reference-draft.json',raw=readFileSync(path,'utf8'),pkg=JSON.parse(raw),bd=pkg.documents.find(d=>d.kind==='businessDesign');
const old=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v8-testability-reference-draft.json','utf8'));
assert.deepEqual(bd,old.documents.find(d=>d.kind==='businessDesign'));
assert.deepEqual(pkg.documents.find(d=>d.kind==='checkItems'),old.documents.find(d=>d.kind==='checkItems'));
const byActivity=name=>bd.activities.find(a=>a.name===name);
const byException=name=>bd.exceptions.find(e=>e.name===name);
const apply=byActivity('備品購入を申請する'),prepare=byActivity('購入を準備する');
const failed=byException('権限判定不成立'),draft=byException('下書き保存'),csv=byException('CSV再出力'),race=byException('購入準備競合');
const js=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
async function open(data){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/business-route-types',runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
 const $=selector=>w.document.querySelector(selector),until=async fn=>{for(let i=0;i<800;i++){if(fn())return;await new Promise(resolve=>setTimeout(resolve,5));}throw Error('Viewer did not become ready');};
 w.eval(js);await until(()=>$('#open')&&!$('#open').disabled);$('#open-text').click();$('#source-text').value=JSON.stringify(data);await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));
 return {w,$};
}
const select=(app,id)=>app.$(`[data-explorer-key="business:${id}"]`).click();
const group=(root,title)=>[...root.querySelectorAll('[data-business-variations]')].find(node=>node.querySelector('h3')?.textContent===title);
const names=node=>[...node.querySelectorAll('h4')].map(h=>h.textContent);
const links=(root,id)=>[...root.querySelector(`[data-business-exception="${id}"]`).nextElementSibling.querySelectorAll('[data-related-spec]')].map(e=>e.dataset.relatedSpec);
const app=await open(pkg);
try{
 select(app,apply.id);let root=app.$('#detail');
 assert.deepEqual(names(group(root,'例外')),['権限判定不成立']);assert.deepEqual(names(group(root,'別ルート')),['下書き保存']);assert(!group(root,'通常以外の扱い'));
 for(const e of [failed,draft])assert.equal(root.querySelectorAll(`[data-business-exception="${e.id}"]`).length,1);
 assert(root.querySelector('[data-business-result]'));
 const save=`fn:${apply.id}:group-request:save-draft`,submit=`fn:${apply.id}:group-request:submit-request`;
 assert.deepEqual(links(root,draft.id),['decision:'+save,save]);assert.deepEqual(links(root,failed.id),['decision:'+submit]);
 select(app,prepare.id);root=app.$('#detail');
 assert.deepEqual(names(group(root,'例外')),['購入準備競合']);assert.deepEqual(names(group(root,'別ルート')),['CSV再出力']);
 const handoff=`fn:${prepare.id}:group-handoff:prepare-approved-requests`,output=`fn:${prepare.id}:group-handoff:reexport-fixed-preparation`;
 assert.deepEqual(links(root,csv.id),['decision:'+output,output]);assert.deepEqual(links(root,race.id),['decision:'+handoff]);
 assert(!root.querySelector(`[data-business-exception="${race.id}"]`).nextElementSibling.textContent.includes('未作成'));
 covered.add('BUSINESS-ROUTE-TYPE-001');covered.add('BUSINESS-ROUTE-TYPE-003');
}finally{app.w.close();}
for(const variation of ['legacy','conflict','other-activity']){
 const data=variation==='legacy'?structuredClone(old):structuredClone(pkg),view=data.documents.find(d=>d.kind==='conceptModel').presentation.activityViews.find(v=>v.activityId===apply.id);
 if(variation==='conflict')view.businessVariations.push({exceptionId:draft.id,kind:'exception'});
 if(variation==='other-activity'){view.businessVariations=view.businessVariations.filter(v=>v.exceptionId!==draft.id);view.businessVariations.push({exceptionId:csv.id,kind:'alternative'});}
 const current=await open(data);try{select(current,apply.id);const root=current.$('#detail'),neutral=group(root,'通常以外の扱い');assert(neutral);assert(names(neutral).includes('下書き保存'));if(variation==='legacy')assert(names(neutral).includes('権限判定不成立'));}finally{current.w.close();}
}
covered.add('BUSINESS-ROUTE-TYPE-002');
assert.deepEqual([...covered].sort(),ids.slice().sort());verify();assert.equal(readFileSync(path,'utf8'),raw);
console.log(JSON.stringify({passed:[...covered],scope:'explicit route grouping, old/ambiguous fallback and real application test links; metadata remains a draft'}));
