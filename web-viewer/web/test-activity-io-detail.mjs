import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';

// Byte-for-byte copy of the pre-implementation authority at c978cc98.
const authority=readFileSync('verification/activity-io-detail.check-items.json');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const verifyAuthority=bytes=>assert.equal(digest(bytes),'1288a37f3d1559201b984343bfde0f83dd0225fb94df0e5e7cadc95d4a5dadef');
verifyAuthority(authority);
assert.deepEqual(JSON.parse(authority).checks.map(c=>c.id),['ACTIVITY-IO-DETAIL-001','ACTIVITY-IO-DETAIL-002','ACTIVITY-IO-DETAIL-003','ACTIVITY-IO-DETAIL-004']);
assert.throws(()=>verifyAuthority(Buffer.from(authority.toString().replace('ACTIVITY-IO-DETAIL-002','ACTIVITY-IO-DETAIL-DELETED'))));
const required=['001:0.4','001:markdown','002:same-name-and-multiple-relations','003:0.4','003:markdown-and-exception','003:object','004:0.4-unchanged','004:markdown-unchanged'];
const completed=[];
const verifyCoverage=results=>assert.deepEqual([...results].sort(),[...required].sort());

const compiled=await build({entryPoints:['src/document-view.ts'],bundle:true,write:false,format:'iife',globalName:'view'});
const window=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;
window.eval(compiled.outputFiles[0].text+'\nwindow.view=view;');
const sections=detail=>{
 const result={};let name='';
 for(const node of detail.children){
  if(node.tagName==='H3')name=node.textContent;
  else if(['Input','Output','Exception When'].includes(name)){
   if(node.tagName==='UL')result[name]=[...node.children].map(item=>item.textContent);
   else if(node.tagName==='P')(result[name]??=[]).push(node.textContent);
  }
 }
 return result;
};
try{
 const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v9-draft-routes-reference-draft.json','utf8');
 const design=parseDocument(raw),activity=design.model.business.activities.find(a=>a.name==='備品購入を申請する');
 const original=JSON.stringify(design),rows=sections(window.view.businessDetail(design,activity.id));
 assert.equal(design.model.formatVersion,'0.4');
 assert.equal(rows.Input[0],'認証基盤 — 認証済み作業者の識別情報');
 assert.ok(rows.Output[0].startsWith('購入申請 — 提出時は申請者'));
 assert.equal(rows.Input.length,3);assert.equal(rows.Output.length,1);
 completed.push('001:0.4','003:0.4');
 assert.equal(JSON.stringify(design),original,'rendering preserves graph, IDs, source and review state');
 assert.equal(design.markdown,raw);
 completed.push('004:0.4-unchanged');

 // Exercise the renderer with an object sharing the Activity name and two
 // different relations to that same object. Information text is never replaced.
 const same=structuredClone(design),bd=same.model.business,first=bd.relations.find(r=>r.kind==='input'&&r.toId===activity.id);
 bd.objects.find(o=>o.id===first.fromId).name=activity.name;
 first.label=activity.name+' → 引用された情報';
 bd.relations.push({...first,id:'test-second-relation',label:'別の情報'});
 const sameBefore=JSON.stringify(same),sameRows=sections(window.view.businessDetail(same,activity.id));
 assert.deepEqual(sameRows.Input.filter(row=>row.startsWith(activity.name+' — ')),[activity.name+' — '+activity.name+' → 引用された情報',activity.name+' — 別の情報']);
 assert.equal(JSON.stringify(same),sameBefore);
 completed.push('002:same-name-and-multiple-relations');
 assert.deepEqual([...window.view.businessDetail(design,first.fromId).querySelectorAll('h3')].map(h=>h.textContent),['Scope','Information']);
 completed.push('003:object');

 const mdRaw=readFileSync('web/authorities/business-design.md','utf8'),md=parseDocument(mdRaw),mdBefore=JSON.stringify(md);
 const mdRows=sections(window.view.businessDetail(md,md.model.business.activities.find(a=>a.name==='業務設計').id));
 assert.ok(mdRows.Input.includes('Alder: 業務ナレッジ — 業務手順・条件・考慮事項の確認観点'));
 assert.ok(mdRows.Output.includes('判断記録 — 判断内容 / 結果'));
 assert.ok(mdRows['Exception When'].some(x=>x.startsWith('実装 → 業務設計 — ')));
 completed.push('001:markdown','003:markdown-and-exception');
 assert.equal(JSON.stringify(md),mdBefore);assert.equal(md.markdown,mdRaw);
 completed.push('004:markdown-unchanged');
}finally{window.close();}
verifyCoverage(completed);
assert.throws(()=>verifyCoverage(completed.slice(1)));
assert.throws(()=>verifyCoverage([...completed,completed[0]]));
verifyAuthority(readFileSync('verification/activity-io-detail.check-items.json'));
console.log('Activity I/O detail: supported 0.4/Markdown, repeated and same-name relations, exception endpoints and model preservation passed. 0.5, browser and human review are separate.');
