import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';

const authority=readFileSync('verification/activity-io-detail.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'1288a37f3d1559201b984343bfde0f83dd0225fb94df0e5e7cadc95d4a5dadef');
assert.deepEqual(JSON.parse(authority).checks.map(c=>c.id),['ACTIVITY-IO-DETAIL-001','ACTIVITY-IO-DETAIL-002','ACTIVITY-IO-DETAIL-003','ACTIVITY-IO-DETAIL-004']);
const compiled=await build({entryPoints:['src/document-view.ts'],bundle:true,write:false,format:'iife',globalName:'view'});
const window=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;
window.eval(compiled.outputFiles[0].text+'\nwindow.view=view;');
const sections=detail=>{const result={};let name='';for(const node of detail.children){if(node.tagName==='H3')name=node.textContent;else if(node.tagName==='P'&&['Input','Output','Exception When'].includes(name))(result[name]??=[]).push(node.textContent);}return result;};
try{
 const raw=readFileSync('../work/plugin-json/issue-310/agent/review-revision/business-design.json','utf8'),design=parseDocument(raw),activity=design.model.business.activities[0];
 const original=JSON.stringify(design),detail=window.view.businessDetail(design,activity.id),rows=sections(detail);
 assert.deepEqual(rows.Input,['利用者 — 利用者からの来訪希望','案内台帳 — 案内台帳の来訪案内']);
 assert.deepEqual(rows.Output,['案内台帳 — 案内台帳の来訪案内','利用者 — 利用者への来訪案内','案内台帳 — 案内台帳への希望記録']);
 for(const value of ['希望日','連絡先','希望詳細','希望詳細が届いている場合','この業務では希望日と同じ日を案内する。'])assert.ok(detail.textContent.includes(value),value);
 assert.equal(JSON.stringify(design),original,'rendering does not alter source, graph, IDs, references or stored data');
 assert.equal(design.markdown,raw);

 // Even if caller-supplied names coincide, endpoints are identified by ID,
 // and text inside Data labels is never rewritten. The document Validator
 // itself rejects duplicate visible names; this exercises only the renderer.
 const same=structuredClone(design),bd=same.model.business,source=bd.relations.find(r=>r.kind==='input');
 bd.objects.find(o=>o.id===source.fromId).name=activity.name;
 bd.data.find(d=>d.id===source.dataId).name=activity.name+' → 記録';
 assert.equal(sections(window.view.businessDetail(same,activity.id)).Input[0],activity.name+' — '+activity.name+' → 記録');

 const old=parseDocument(readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8'));
 assert.equal(old.model.formatVersion,'0.4');
 const oldRows=sections(window.view.businessDetail(old,old.model.business.activities[0].id));
 assert.equal(oldRows.Input[0],'認証基盤 — 認証済み作業者の識別情報');
 assert.ok(oldRows.Output[0].startsWith('購入申請 — 提出時は申請者'));
 assert.ok(oldRows['Exception When'][0].startsWith('備品購入を申請する → 購入申請を再申請・破棄する — '));

 const mdRaw=readFileSync('web/authorities/business-design.md','utf8'),md=parseDocument(mdRaw),mdBefore=JSON.stringify(md);
 const mdRows=sections(window.view.businessDetail(md,md.model.business.activities.find(a=>a.name==='業務設計').id));
 assert.ok(mdRows.Input.includes('Alder: 業務ナレッジ — 業務手順・条件・考慮事項の確認観点'));
 assert.ok(mdRows.Output.includes('判断記録 — 判断内容 / 結果'));
 assert.ok(mdRows['Exception When'].some(x=>x.startsWith('実装 → 業務設計 — ')));
 assert.equal(JSON.stringify(md),mdBefore);assert.equal(md.markdown,mdRaw);
 const object=window.view.businessDetail(design,design.model.business.objects[0].id);
 assert.deepEqual([...object.querySelectorAll('h3')].map(h=>h.textContent),['Scope','Icon','Information']);
}finally{window.close();}
console.log('Activity I/O detail: 0.5, 0.4, Markdown, information, exceptions, same-name endpoints and source preservation passed; browser/human checks remain separate');
