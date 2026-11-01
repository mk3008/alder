import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validate} from '../../tools/document_storage/core.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authority=readFileSync('verification/decision-table-ordered.check-items.json');
const authorityIds=bytes=>{assert.equal(hash(bytes),'098cec2f5064c0e021fd305ed5c92717d4ab72dd39992944276aa9e95cdd4f85');return JSON.parse(bytes).checks.map(check=>check.id);};
const expected=authorityIds(authority),covered=new Set(),coverage=ids=>assert.deepEqual(ids.slice().sort(),expected.slice().sort());
const altered=JSON.parse(authority);altered.checks.pop();assert.throws(()=>authorityIds(Buffer.from(JSON.stringify(altered))));assert.throws(()=>coverage(expected.slice(1)));
const snapshots=[
 ['purchase-v4-check-review.json','02c56216c583a719aaea01cf6742cdd37aadd154da1933e9c0669be2d60f7146','efeaa1838b6fc8a9831b4246963bb7eaaf6cc1e8f49f2cd2348a1a6f7f2d7910','5dc39d44589fb9abfcb1e3644eb1ba5872b573a4491bff12f535bbb9cc33b923','9dc2fcf0c77f66970c22df09e7c73718c81666c2b17bc0d4d1d5fa7a0f2af452'],
 ['purchase-v5-resume-reference-draft.json','7f849b7531b8442f3113e9e627f65f263a82318035386a15271c86bbbd5ae93c','5cd1a1b63d3b36bea1b139f2ab37aa641c3c42f23d1041a903f1982a7b9607f4','07ca0c30bea1bb79f53ac64c6705df4965f55f9b5e147d4672dabdea6456f253','c9bcd4bdcc605114148e0fb551f829105a6ab83aaf49109d857737411d09a26b']
];
const digest=value=>hash(JSON.stringify(value)),cell=cell=>cell.map(run=>run.value??run.label??'').join('');
for(const [name,checkHash,sampleHash,businessHash,stateHash] of snapshots){
 const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/'+name,'utf8'));validate(pkg);
 const doc=kind=>pkg.documents.find(d=>d.kind===kind),checks=doc('checkItems'),model=doc('conceptModel');
 assert.equal(digest(checks.items),checkHash,'Check IDs, meanings and human states remain byte-identical');
 assert.equal(digest(model.reviewGroups.flatMap(group=>group.capabilities.flatMap(cap=>cap.samples))),sampleHash,'data examples and link identities remain unchanged');
 assert.equal(digest(doc('businessDesign')),businessHash);assert.equal(digest(doc('stateTransition')),stateHash);
 const ex=checks.examples.find(value=>value.id==='decision-submit-table'),rows=ex.rows.map(row=>row.map(cell));
 assert.deepEqual(ex.columns,['見積','役職別上限','結果','備考','Check ID']);
 assert.deepEqual(rows,[['あり','上限以下','提出可','','P-03'],['あり','それ以外','提出不可','上限超過、判定不能など','P-04、P-06'],['なし','‐','提出不可','','P-05']]);
 assert.deepEqual(ex.rows[1][4].filter(run=>run.kind==='reference').map(run=>run.targetId),['purchase-check-p-04','purchase-check-p-06']);
 for(const checkId of ['P-03','P-04','P-05','P-06'])assert(checks.items.some(item=>item.checkId===checkId));
 const statement=checks.guarantees.find(g=>g.id==='decision-submit-guarantee').blocks[0].content.map(run=>run.value).join('');
 assert.match(statement,/品目情報と購入理由が揃っている場合/);assert.match(statement,/その行では不問/);assert.doesNotMatch(statement,/複数の行/);

 // Independent expected decisions. A dash is a don't-care; the single else in
 // this table is the remaining role-limit branch after the prior row failed.
 const quoteFirst=(quote,limit)=>rows.find(([q,l])=>q===quote&&(l==='‐'||l===limit||l==='それ以外'));
 const limitFirst=(quote,limit)=>{
  if(limit==='上限以下')return quote==='あり'?{result:'提出可',id:'P-03'}:{result:'提出不可',id:'P-05'};
  return {result:'提出不可',id:limit==='上限超過'?'P-04':'P-06'};
 };
 for(const quote of ['あり','なし'])for(const limit of ['上限以下','上限超過','判定不能']){
  const expectedResult=quote==='あり'&&limit==='上限以下'?'提出可':'提出不可';
  assert.equal(quoteFirst(quote,limit)[2],expectedResult,`${name}: quote-first ${quote}/${limit}`);
  assert.equal(limitFirst(quote,limit).result,expectedResult,`${name}: limit-first ${quote}/${limit}`);
 }
 assert.equal(quoteFirst('なし','上限超過')[4],'P-05');assert.equal(limitFirst('なし','上限超過').id,'P-04','short circuit can select a different independent Check');
 assert.match(checks.items.find(item=>item.checkId==='P-03').fields.condition[0].value,/同額も含む/);
 covered.add('DECISION-ORDER-002');covered.add('DECISION-ORDER-003');covered.add('DECISION-ORDER-004');

 const resubmit=checks.examples.find(value=>value.id==='decision-resubmit-request-table');
 const resubmitRows=resubmit.rows.map(row=>row.map(cell));
 assert.deepEqual(resubmitRows.map(row=>[row[1],row[4],row[5]]),[['あり','上限以下','再提出可'],['なし','‐','再提出不可'],['あり','上限超過または判定不能','再提出不可']]);
 assert.match(checks.guarantees.find(value=>value.id==='decision-resubmit-request-guarantee').blocks[0].content[0].value,/不足する場合の可否はこの表では示していません/);
 assert.match(checks.items.find(item=>item.checkId==='P-12').fields.expectedResult[0].value,/状態を保つ/);
 assert.match(checks.guarantees.find(value=>value.id==='decision-record-partial-receipts-guarantee').blocks[0].content[0].value,/その行では不問/);
 for(const g of checks.guarantees.filter(value=>value.id.startsWith('decision-')))assert.doesNotMatch(JSON.stringify(g),/複数の行に該当する場合があります/);
 covered.add('DECISION-ORDER-001');covered.add('DECISION-ORDER-005');
}
coverage([...covered]);assert.deepEqual(authorityIds(readFileSync('verification/decision-table-ordered.check-items.json')),expected);
console.log(JSON.stringify({passed:[...covered],scope:'purchase ordered tables, two axis orders and preserved Check/data snapshots; visual review is separate'}));
