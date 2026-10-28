import {readLegacyPackage} from './legacy-json.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {schema} from './schema.mjs';
import {parseStrict,validate,graphV1,inventory,stringify} from './core.mjs';
import {convertMarkdown} from './convert.mjs';
import {applyEdits} from './edit.mjs';
const here=fileURLToPath(new URL('./',import.meta.url)),root=path.resolve(here,'../..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const revision='c2852531ad62691c375e87818d8c3a49fd19803f',uri=`https://github.com/mk3008/alder/blob/${revision}/business-design/purchase-request/README.md`;
const bd=()=>({documentId:'purchase-bd',kind:'businessDesign',revision,uri,text:read('business-design/purchase-request/README.md')});
const check=(file='work/check-item-examples/meaning-validation-20261018/purchase/final.md')=>({documentId:'purchase-checks',kind:'checkItems',revision:'checks-1',basedOn:{documentId:'purchase-bd',revision},text:read(file)});
const request=()=>({sources:[bd(),check()],revision:'pkg-1'});
const convert=r=>convertMarkdown(r).package;
const sample=convert(request()),clone=()=>structuredClone(sample),c=p=>p.documents.find(d=>d.kind==='checkItems'),b=p=>p.documents.find(d=>d.kind==='businessDesign');
const bad=(fn,re)=>{const p=clone();fn(p);assert.throws(()=>validate(p),re);};
const graphSort=g=>({...g,nodes:g.nodes.toSorted((a,b)=>a.id.localeCompare(b.id)),relations:g.relations.toSorted((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))});

test('published schema equals executable schema',()=>assert.deepEqual(schema,JSON.parse(read('tools/document_storage/schema.json'))));
test('modern BD/Check: preserves guarantees/examples/shared ID/states/evidence and no archive',()=>{validate(sample);assert.equal(sample.documents.length,2);assert.equal(c(sample).items.length,6);assert.equal(c(sample).guarantees.length,4);assert.equal(c(sample).examples.length,4);assert.equal(c(sample).items.filter(i=>i.reviewState==='未レビュー').length,5);const shared=c(sample).items.find(i=>i.checkId==='JA-EX-04');assert.equal(c(sample).index.filter(r=>r.checkIds.includes(shared.id)).length,2);assert.ok(c(sample).items.every(i=>i.fields.testEvidence.length));assert.ok(!Object.hasOwn(sample,'archives'));assert.ok(!JSON.stringify(sample).includes(JSON.stringify(bd().text)));assert.equal(c(sample).basedOn.verification,'unverified');});
test('legacy explicit anchors/details retain six Check bodies, summaries and AI confidence',()=>{const r=request();r.sources[1]=check('docs/examples/purchase-check-review.ja.md');const p=convert(r);assert.equal(c(p).items.length,6);assert.ok(c(p).items.every(i=>i.detailSummary&&i.fields.confidence));assert.ok(c(p).items.find(i=>i.checkId==='JA-EX-01').fields.condition.some(r=>r.kind==='text'&&r.value.includes('品名')));});
test('same input repeated conversion deterministic; source order does not affect IDs',()=>{const r=request();assert.deepEqual(convert(r),sample);r.sources.reverse();assert.deepEqual([...inventory(convert(r)).map.keys()].sort(),[...inventory(sample).map.keys()].sort());});
test('Graph v1 projection equals unchanged official exporter',()=>{const r=spawnSync('python3',['tools/business_graph/export.py','business-design/purchase-request/README.md'],{cwd:root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.deepEqual(graphSort(graphV1(sample,b(sample).id)),graphSort(JSON.parse(r.stdout)));});
test('BD examples beyond purchasing convert with optional scope and problems',()=>{for(const file of ['docs/examples/meeting-room-reservation.ja.md','docs/examples/meeting-room-lifecycle.ja.md','business-design/ai-result-review/README.md']){const p=convert({sources:[{...bd(),uri:'',text:read(file)}],revision:'p'});validate(p);assert.ok(b(p).activities.every(a=>a.procedure));}});
test('modern reimport requires expected package version',()=>assert.throws(()=>convert({...request(),previousPackage:sample}),/Revision conflict/));
test('exact reimport retains complete ID set',()=>assert.deepEqual(convert({...request(),previousPackage:sample,expectedRevision:'pkg-1'}),sample));
test('reorder serialized JSON retains IDs and references',()=>{const p=clone();for(const d of p.documents)for(const k of ['activities','objects','relations','findings','items','guarantees','examples'])d[k]?.reverse();const q=parseStrict(stringify(p));validate(q);assert.deepEqual([...inventory(q).map.keys()].sort(),[...inventory(sample).map.keys()].sort());});
test('reorder Markdown entity blocks retains identity without positional matching',()=>{const r=request(),text=r.sources[0].text,parts=text.split(/(?=^# (?:Object|Activity) )/m);r.sources[0].text=parts[0]+parts.slice(1).reverse().join('');r.sources[0].revision='bd-2';r.sources[1].basedOn.revision='bd-2';r.sources[1].revision='checks-2';const q=convert({...r,revision:'pkg-2',previousPackage:sample,expectedRevision:'pkg-1'});assert.deepEqual([...inventory(q).map.keys()].sort(),[...inventory(sample).map.keys()].sort());});
function renamed(){const r=request(),old=b(sample).activities[0];for(const s of r.sources)s.text=s.text.replaceAll(old.name,'申請の改名');r.sources[0].revision='bd-2';r.sources[1].revision='checks-2';r.sources[1].basedOn.revision='bd-2';return {r,old};}
test('MD rename without explicit mapping refuses silent reassignment',()=>{const {r}=renamed();assert.throws(()=>convert({...r,revision:'pkg-2',previousPackage:sample,expectedRevision:'pkg-1'}),/Prior IDs/);});
test('explicit MD rename maps Activity and Check section to prior IDs',()=>{const {r,old}=renamed();const q=convert({...r,revision:'pkg-2',previousPackage:sample,expectedRevision:'pkg-1',renameBindings:{[old.id]:'申請の改名'}});assert.equal(b(q).activities.find(a=>a.name==='申請の改名').id,old.id);assert.deepEqual([...inventory(q).map.keys()].sort(),[...inventory(sample).map.keys()].sort());});
test('changed MD with old content revision is refused',()=>{const r=request();r.sources[0].text=r.sources[0].text.replace('購入の必要性','購入目的');assert.throws(()=>convert({...r,revision:'pkg-2',previousPackage:sample,expectedRevision:'pkg-1'}),/new revision/);});
test('source version mismatch refuses conversion',()=>{const r=request();r.sources[1].basedOn.revision='wrong';assert.throws(()=>convert(r),/source revision mismatch/);});
test('pinned Check source disagreement refuses conversion',()=>{const r=request();r.sources[0].uri=r.sources[0].uri.replace(revision,'f'.repeat(40));assert.throws(()=>convert(r),/source URI\/revision differs/);});
test('pinned Check needs explicit source identity',()=>{const r=request();delete r.sources[0].uri;assert.throws(()=>convert(r),/pinned Business Design uri/);});
test('unknown Markdown heading stops without dropping it',()=>{const r=request();r.sources[0].text=r.sources[0].text.replace('## Icon','## Medium');assert.throws(()=>convert(r),/unsupported heading/);});
test('unknown Check field stops',()=>{const r=request();r.sources[1].text=r.sources[1].text.replace('- 根拠：','- 不明欄：');assert.throws(()=>convert(r),/Unknown Check field/);});
test('ambiguous duplicate Check heading stops',()=>{const r=request();r.sources[1].text+='\n## 使い方\n\n重複';assert.throws(()=>convert(r),/duplicate Check heading/);});
test('unknown Check Activity stops',()=>{const r=request();r.sources[1].text=r.sources[1].text.replace('| [備品購入を申請する]','| [不明業務]');assert.throws(()=>convert(r),/Unknown Activity/);});
test('unknown fragment stops',()=>{const r=request();r.sources[1].text=r.sources[1].text.replace('#申請の条件保証と例','#不明');assert.throws(()=>convert(r),/Unknown fragment/);});
test('malformed common example separator stops',()=>{const r=request();r.sources[1].text=r.sources[1].text.replace('| --- | --- | --- | --- |\n| 新しい申請A','| x | --- | --- | --- |\n| 新しい申請A');assert.throws(()=>convert(r),/table separator/);});
test('direct draft validation refuses unknown format and payload versions/kinds',()=>{for(const fn of [p=>p.formatVersion='1',p=>p.documents[0].schemaVersion='future',p=>p.documents[0].kind='conceptModel',p=>p.documents[0].kind='stateTransition'])bad(fn,/enum|variant/);});
test('unknown storage fields including raw MD archives rejected',()=>bad(p=>p.archives=[],/Unknown field/));
test('duplicate key including Unicode-escaped spelling rejected',()=>assert.throws(()=>parseStrict('{"a":1,"\\u0061":2}'),/Duplicate JSON key/));
test('malformed JSON and deep nesting rejected',()=>{assert.throws(()=>parseStrict('{"a":'));assert.throws(()=>parseStrict('['.repeat(65)+'1'+']'.repeat(65)),/depth/);});
test('global ID collisions and dangling refs rejected',()=>{bad(p=>b(p).objects[0].id=b(p).activities[0].id,/Duplicate ID/);bad(p=>b(p).relations[0].toId='missing',/Dangling/);});
test('cross-document relation cannot bind merely by name',()=>bad(p=>b(p).relations[0].fromId=c(p).items[0].id,/mismatch/));
test('Check version mismatch and invalid review state rejected',()=>{bad(p=>c(p).basedOn.revision='wrong',/Stale Check/);bad(p=>c(p).items[0].reviewState='AI承認',/enum/);});
test('shared guarantee and example references retain owner and axes',()=>{bad(p=>c(p).examples[0].rows[0].pop(),/column mismatch/);bad(p=>c(p).examples[0].guaranteeId=c(p).guarantees[1].id,/owner mismatch/);bad(p=>c(p).items[0].fields.guarantee.find(r=>r.kind==='reference').targetId='missing',/Dangling/);});
test('Check identity separate from internal global UUID; duplicate local Check IDs rejected',()=>bad(p=>c(p).items[1].checkId=c(p).items[0].checkId,/Duplicate Check ID/));
test('unsafe links/source URI refuse credentials and non-HTTPS',()=>{bad(p=>p.sources[0].uri='http://x',/Unsafe/);bad(p=>c(p).items[0].fields.evidence.find(r=>r.kind==='link').uri='https://user:secret@example.com',/Unsafe/);});
test('atomic JSON rename advances BD and Check dependency only with explicit edits',()=>{const doc=b(sample),checks=c(sample),a=doc.activities[0],before=stringify(sample);const q=applyEdits(sample,{expectedRevision:'pkg-1',revision:'pkg-2',documentRevisions:{[doc.id]:{expected:doc.revision,next:'bd-2'},[checks.id]:{expected:checks.revision,next:'checks-2'}},changes:[{id:a.id,values:{name:'新しい業務名'}},{id:checks.id,values:{basedOn:{...checks.basedOn,revision:'bd-2'}}}]});assert.equal(b(q).activities[0].id,a.id);assert.equal(c(q).basedOn.verification,'unverified');assert.equal(stringify(sample),before);assert.deepEqual(b(q).relations,doc.relations);});
test('single-document edit refuses stale Check; original untouched',()=>assert.throws(()=>applyEdits(sample,{expectedRevision:'pkg-1',revision:'pkg-2',documentRevisions:{[b(sample).id]:{expected:revision,next:'bd-2'}},changes:[{id:b(sample).activities[0].id,values:{name:'x'}}]}),/Stale Check/));
test('atomic edit requires package/doc versions and immutable identity',()=>{assert.throws(()=>applyEdits(sample,{expectedRevision:'old',revision:'new'}),/conflict/);assert.throws(()=>applyEdits(sample,{expectedRevision:'pkg-1',revision:'p2',documentRevisions:{[b(sample).id]:{expected:revision,next:'bd2'}},changes:[{id:b(sample).activities[0].id,values:{id:'x'}}]}),/immutable/);});
test('external BD catalog supports historic Check without its full payload',()=>{
 const p=clone(),old=b(p);p.diagnostics.push('unrelated diagnostic');
 p.documents=p.documents.filter(d=>d!==old);p.externalDocuments=[{id:old.id,kind:old.kind,revision:old.revision,activities:old.activities.map(({id,name})=>({id,name}))}];
 // A catalog has no current Who/roleId: diagnostics owned by the removed BD are no longer current Role declarations.
 assert.ok(p.diagnostics.some(d=>d.startsWith('Role未確定:')));
 assert.throws(()=>validate(p),/Unresolved Who requires a diagnostic/);
 p.diagnostics=p.diagnostics.filter(d=>!d.startsWith('Role未確定:'));
 const before=JSON.stringify(p);validate(p);assert.equal(JSON.stringify(p),before);assert.ok(p.diagnostics.includes('unrelated diagnostic'));
 assert.ok(!('objects' in p.externalDocuments[0]));p.externalDocuments[0].revision='wrong';assert.throws(()=>validate(p),/Stale Check/);
});
test('converter supports explicit external catalog and digest without old BD payload',()=>{const old=b(sample);const p=convert({sources:[check()],revision:'pkg',externalDocuments:[{id:old.id,kind:old.kind,revision:old.revision,activities:old.activities.map(({id,name})=>({id,name}))}],externalSources:[sample.sources[0]]});assert.equal(p.documents.length,1);validate(p);});

test('CLI new-only atomic output, protected input/existing/symlink/hardlink and no output on error',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-storage-'));
 try{const source=path.join(dir,'bd.md'),requestFile=path.join(dir,'request.json'),out=path.join(dir,'package.json'),text=bd().text;
 fs.writeFileSync(source,text);const req={revision:'p1',sources:[{documentId:'bd',kind:'businessDesign',revision:'v1',path:'bd.md'}]};fs.writeFileSync(requestFile,JSON.stringify(req));
 const run=dest=>spawnSync(process.execPath,[path.join(here,'cli.mjs'),'convert',requestFile,dest],{encoding:'utf8'});
 assert.equal(run(out).status,0);validate(parseStrict(fs.readFileSync(out,'utf8')));const saved=fs.readFileSync(out,'utf8');assert.equal(run(out).status,2);assert.equal(fs.readFileSync(out,'utf8'),saved);assert.equal(run(source).status,2);assert.equal(fs.readFileSync(source,'utf8'),text);
 for(const [name,link]of [['sym',fs.symlinkSync],['hard',fs.linkSync]]){const f=path.join(dir,name);link(source,f);assert.equal(run(f).status,2);assert.equal(fs.readFileSync(source,'utf8'),text);}
 fs.writeFileSync(source,'# Broken\n');const failed=path.join(dir,'failed.json');assert.equal(run(failed).status,2);assert.ok(!fs.existsSync(failed));assert.ok(!fs.readdirSync(dir).some(n=>n.startsWith('.alder-storage-')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('Object rename is explicit and preserves IO endpoint IDs on reconversion',()=>{
 const r=request(),o=b(sample).objects[0],name='名称を変更したObject';r.sources[0].text=r.sources[0].text.replace('# Object '+o.name+'\n','# Object '+name+'\n').replaceAll('- '+o.name+' — ','- '+name+' — ');r.sources[0].revision='bd-2';r.sources[1].revision='checks-2';r.sources[1].basedOn.revision='bd-2';
 const q=convert({...r,revision:'pkg-2',previousPackage:sample,expectedRevision:'pkg-1',renameBindings:{[o.id]:name}});
 assert.equal(b(q).objects.find(x=>x.name===name).id,o.id);assert.deepEqual(b(q).relations.toSorted((a,b)=>a.id.localeCompare(b.id)),b(sample).relations.toSorted((a,b)=>a.id.localeCompare(b.id)));
});
test('unassigned Check has one body, no inferred Activity and preserved state',()=>{
 const r=request();r.sources[1].text+='\n\n## 未割当\n\n### UNASSIGNED-1 — 対応先を確認する\n\n- 人間レビュー状態：要確認\n- 条件：対応先は未決。\n- 期待結果：候補・未承認。\n';const p=convert(r),item=c(p).items.find(i=>i.checkId==='UNASSIGNED-1'),section=c(p).sections.find(s=>s.id===item.sectionId);assert.equal(section.activityId,null);assert.equal(item.reviewState,'要確認');assert.ok(!c(p).index.some(r=>r.checkIds.includes(item.id)));
});
test('Findings preserve source ID, status, content and stable targets; unknown targets stop',()=>{
 const source=bd(),name=b(sample).objects[0].name;
 const finding=`\n# Findings\n\n## Finding F01\n\n### Kind\n\nquestion\n\n### Status\n\nresolved\n\n### Scope\n\nitems\n\n### Targets\n\n- ${name}\n\n### Summary\n\n保存確認\n\n### Content\n\n未決内容を勝手に補完しない。\n`;
 source.text+=finding;const p=convert({sources:[source],revision:'p'});assert.equal(b(p).findings[0].sourceId,'F01');assert.equal(b(p).findings[0].status,'resolved');assert.deepEqual(b(p).findings[0].targetIds,[b(p).objects[0].id]);source.text=source.text.replace('### Targets\n\n- '+name,'### Targets\n\n- 存在しない対象');assert.throws(()=>convert({sources:[source],revision:'p'}),/Unresolved Finding target/);
});
test('atomic edit rejects ID replacement hidden in document array and duplicate edit targets',()=>{
 const p=convert({sources:[bd()],revision:'p'}),doc=b(p),objects=structuredClone(doc.objects);objects[0].id='replaced';
 const req={expectedRevision:'p',revision:'p2',documentRevisions:{[doc.id]:{expected:doc.revision,next:'v2'}},changes:[{id:doc.id,values:{objects}}]};assert.throws(()=>applyEdits(p,req),/Dangling|identity/);
 req.changes=[{id:doc.activities[0].id,values:{why:'編集'}},{id:doc.activities[0].id,values:{why:'編集2'}}];assert.throws(()=>applyEdits(p,req),/Duplicate edit/);
});
test('unsupported conversion options and duplicate sources stop',()=>{assert.throws(()=>convert({...request(),unknownOption:true}),/Unknown conversion option/);const r=request();r.sources.push(bd());assert.throws(()=>convert(r),/Duplicate source/);});
test('committed example is generated by the shared API',()=>{const dir=path.join(here,'examples'),r=JSON.parse(fs.readFileSync(path.join(dir,'request.json'),'utf8'));r.sources=r.sources.map(({path:p,...s})=>({...s,text:fs.readFileSync(path.resolve(dir,p),'utf8')}));assert.deepEqual(convert(r),readLegacyPackage(JSON.parse(read('tools/document_storage/examples/purchase.json'))));});
test('empty guarantees and examples-only common guarantees do not satisfy Check structure',()=>{bad(p=>c(p).items[0].fields.guarantee=[{kind:'text',value:'  '}],/guarantee required/);bad(p=>c(p).guarantees[0].blocks=c(p).guarantees[0].blocks.filter(b=>b.kind==='example'),/prose required/);});
test('request metadata and edit keys do not silently accept unsupported control fields',()=>{
 const r=request();r.sources[1].basedOn.verification='confirmed';assert.throws(()=>convert(r),/Unknown basedOn option/);
 const doc=b(sample),values=JSON.parse('{"__proto__":{"polluted":true}}');assert.throws(()=>applyEdits(sample,{expectedRevision:'pkg-1',revision:'p2',documentRevisions:{[doc.id]:{expected:doc.revision,next:'v2'}},changes:[{id:doc.activities[0].id,values}]}),/Reserved edit key/);assert.equal({}.polluted,undefined);
});
