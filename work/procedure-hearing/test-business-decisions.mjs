import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));
const candidate=read('./business-decisions-poc.json');
const original=read('../../examples/molkky/business-design.json');
const source=original.documents.find(item=>item.kind==='businessDesign');
const sourceChecks=original.documents.find(item=>item.kind==='checkItems');
const originalActivity=source.activities.find(item=>item.id===candidate.source.activityId);
assert.equal(source.id,candidate.source.businessDocumentId);
assert.equal(source.revision,candidate.source.businessRevision);
assert.equal(sourceChecks.id,candidate.source.checkDocumentId);
assert.equal(originalActivity.who,candidate.businessDesign.activity.who.name);
assert.match(originalActivity.procedure,/0本なら0点、1本ならその棒の番号、2本以上なら倒れた本数/);
assert.match(originalActivity.exception,/入力誤りとして計算せず/);
assert.match(originalActivity.exception,/1回でも誤りがあれば計算対象全体をエラー/);

function validate(pkg){
  const design=pkg.businessDesign;
  const unique=items=>{const ids=items.map(item=>item.id);assert.equal(new Set(ids).size,ids.length);return new Map(items.map(item=>[item.id,item]));};
  const data=unique(design.data),objects=unique(design.objects),relations=unique(design.relations),steps=unique(design.steps),decisions=unique(design.decisions);
  assert.ok(data.has(design.activity.result.dataId));
  for(const id of design.activity.result.usedFor)assert.ok(data.has(id));
  assert.ok(decisions.get(design.activity.result.when.decisionId)?.rows.some(row=>row.id===design.activity.result.when.rowId));
  const party=id=>id===design.activity.who.id||objects.has(id);
  const originalParty=id=>id===design.activity.who.id?design.activity.id:id;
  const verifyCheck=ref=>{const item=sourceChecks.items.find(check=>check.id===ref.id);assert.ok(item);assert.equal(item.checkId,ref.code);assert.equal(item.reviewState,'要確認');};
  for(const relation of design.relations){
    assert.ok(party(relation.from)&&party(relation.to)&&data.has(relation.dataId));
    const old=source.relations.find(item=>item.id===relation.id);assert.ok(old);
    assert.equal(old.fromId,originalParty(relation.from));assert.equal(old.toId,originalParty(relation.to));
  }
  for(const step of design.steps){
    assert.ok(party(step.from)&&data.has(step.dataId));assert.ok(step.to===null||party(step.to));
    if(step.relationId){const relation=relations.get(step.relationId);assert.ok(relation);assert.equal(relation.from,step.from);assert.equal(relation.to,step.to);assert.equal(relation.dataId,step.dataId);}
    else assert.equal(step.to,null,'internal steps do not create a diagram relation');
    for(const id of step.decisionIds)assert.ok(decisions.has(id));
    if(step.pairId){const pair=steps.get(step.pairId);assert.ok(pair);assert.equal(pair.pairId,step.id);assert.equal(pair.from,step.to);assert.equal(pair.to,step.from);assert.deepEqual(new Set([step.exchange,pair.exchange]),new Set(['request','response']));}
    if(step.when){const decision=decisions.get(step.when.decisionId);assert.ok(decision?.rows.some(row=>row.id===step.when.rowId));}
  }
  for(const decision of design.decisions){
    assert.ok(data.has(decision.dataId));unique(decision.axes);unique(decision.rows);
    for(const axis of decision.axes)assert.ok(data.has(axis.source.dataId));
    if(decision.appliesWhen){const prior=decisions.get(decision.appliesWhen.decisionId);assert.ok(prior?.rows.some(row=>row.id===decision.appliesWhen.rowId));}
    for(const row of decision.rows){
      assert.deepEqual(row.conditions.map(item=>item.axisId),decision.axes.map(axis=>axis.id));
      for(const condition of row.conditions)assert.ok(['eq','gte','else','any'].includes(condition.op));
      if(row.result.dataId)assert.ok(data.has(row.result.dataId));
      row.checkRefs.forEach(verifyCheck);
    }
  }
  for(const exception of design.exceptions){
    const decision=decisions.get(exception.when.decisionId);assert.ok(decision);
    for(const id of exception.when.rowIds)assert.ok(decision.rows.some(row=>row.id===id));
    for(const id of exception.result.suppressDataIds)assert.ok(data.has(id));
    exception.checkRefs.forEach(verifyCheck);
  }
}
validate(candidate);
const design=candidate.businessDesign,validation=design.decisions.find(d=>d.id==='input-validation'),algorithm=design.decisions.find(d=>d.id==='score-algorithm');

// ELSE is scoped to earlier branches on the same axis under the same prefix.
function decisionRow(decision,values){
  const matches=(rowIndex,axisIndex)=>{
    const condition=decision.rows[rowIndex].conditions[axisIndex],actual=values[condition.axisId];
    if(condition.op==='any')return true;
    if(condition.op==='eq')return actual===condition.value;
    if(condition.op==='gte')return typeof actual==='number'&&actual>=condition.value;
    if(condition.op==='else')return !decision.rows.slice(0,rowIndex).some((_,previous)=>
      decision.axes.slice(0,axisIndex).every((__,priorAxis)=>matches(previous,priorAxis))&&matches(previous,axisIndex));
    throw Error('Unknown condition');
  };
  return decision.rows.find((_,index)=>decision.axes.every((__,axisIndex)=>matches(index,axisIndex)));
}
function projected(throws){
  const validNumbers=throws.every(turn=>turn.every(pin=>Number.isInteger(pin)&&pin>=1&&pin<=12));
  const duplicateInTurn=throws.some(turn=>new Set(turn).size!==turn.length);
  const verdict=decisionRow(validation,{validNumbers,duplicateInTurn});
  if(verdict.result.kind==='input-error')return {verdict:'error',scores:null};
  if(!throws.length){const row=decisionRow(algorithm,{throwCount:0,pinCount:undefined});return {verdict:'valid',scores:[],rowIds:[row.id]};}
  const rows=throws.map(turn=>decisionRow(algorithm,{throwCount:throws.length,pinCount:turn.length}));
  const scores=rows.map((row,i)=>{
    if(row.result.kind==='constant')return row.result.value;
    if(row.result.kind==='only-pin-number')return throws[i][0];
    if(row.result.kind==='pin-count')return throws[i].length;
    throw Error('Unexpected score rule');
  });
  return {verdict:'valid',scores,rowIds:rows.map(row=>row.id)};
}
for(const [input,expected] of [
  [[],{verdict:'valid',scores:[],rowIds:['no-throws']}],
  [[[]],{verdict:'valid',scores:[0],rowIds:['zero-pins']}],
  [[[8]],{verdict:'valid',scores:[8],rowIds:['one-pin']}],
  [[[3,8]],{verdict:'valid',scores:[2],rowIds:['many-pins']}],
  [[[8],[8]],{verdict:'valid',scores:[8,8],rowIds:['one-pin','one-pin']}],
  [[[0]],{verdict:'error',scores:null}],
  [[[13]],{verdict:'error',scores:null}],
  [[[1.5]],{verdict:'error',scores:null}],
  [[['abc']],{verdict:'error',scores:null}],
  [[[8,8]],{verdict:'error',scores:null}],
  [[[8],[13]],{verdict:'error',scores:null}]
])assert.deepEqual(projected(input),expected);
assert.deepEqual(new Set(design.exceptions[0].result.suppressDataIds),new Set(['scores','total','history']));
assert.equal(algorithm.rows.find(row=>row.id==='no-throws').checkRefs[0].coverage,'partial');

for(const mutate of [
  p=>p.businessDesign.steps[0].dataId='missing',
  p=>p.businessDesign.steps[0].from='who',
  p=>p.businessDesign.steps.find(step=>step.id==='reply').exchange='request',
  p=>p.businessDesign.steps[1].decisionIds=['missing'],
  p=>p.businessDesign.decisions[1].rows[0].checkRefs[0].id='missing'
]){const bad=structuredClone(candidate);mutate(bad);assert.throws(()=>validate(bad));}

// Exercise the review page against the same structured source.
class Node{
  constructor(tag){this.tag=tag;this.textContent='';this.children=[];this.className='';this.attributes={};}
  append(child){this.children.push(child);}
  setAttribute(key,value){this.attributes[key]=String(value);}
}
const html=readFileSync(new URL('./business-decisions-preview.html',import.meta.url),'utf8');
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(script);
async function render(fixture){
  const elements=new Map(['title','context','steps','decisions','result','status'].map(id=>[id,new Node(id)]));
  const document={getElementById:id=>elements.get(id),createElement:tag=>new Node(tag)};
  await runInNewContext(`(async()=>{${script}})()`,{document,fetch:async()=>({ok:true,json:async()=>fixture})});
  return elements;
}
const elements=await render(candidate);
assert.equal(elements.get('status').textContent,'');
assert.equal(elements.get('steps').children.length,5);
for(const index of [2,3]){
  assert.deepEqual(design.steps[index].when,{decisionId:'input-validation',rowId:'valid'});
  assert.equal(elements.get('steps').children[index].children[3].children.filter(child=>child.className==='condition').length,0);
}
assert.ok(elements.get('decisions').children[0].children.some(child=>child.textContent.includes('誤りが1回でもあれば計算せず')));
const tables=elements.get('decisions').children.map(section=>section.children.find(node=>node.tag==='div').children[0]);
const physicalRows=table=>table.children.find(node=>node.tag==='tbody').children;
const rows=table=>{
  const logical=[];
  physicalRows(table).forEach((row,rowIndex)=>{
    logical[rowIndex]??=[];let column=0;
    for(const cell of row.children){
      while(logical[rowIndex][column]!==undefined)column++;
      for(let offset=0;offset<(cell.rowSpan??1);offset++){
        logical[rowIndex+offset]??=[];
        assert.equal(logical[rowIndex+offset][column],undefined);
        logical[rowIndex+offset][column]=cell.textContent;
      }
      column++;
    }
  });
  return logical;
};
assert.deepEqual(rows(tables[0]).map(row=>row.slice(0,3)),[
  ['1〜12の整数','なし','有効'],['1〜12の整数','それ以外','入力エラー'],['それ以外','不問','入力エラー']
]);
assert.deepEqual(rows(tables[1]).map(row=>row.slice(0,3)),[
  ['1回以上','0本','0点'],['1回以上','1本','倒れた棒の番号'],['1回以上','それ以外','倒れた本数'],['それ以外','不問','1回分の点数なし']
]);
assert.deepEqual(rows(tables[0]).map(row=>row[3]),['—','MK-04','MK-04']);
assert.deepEqual(rows(tables[1]).map(row=>row[3]),['MK-01','MK-02','MK-03','MK-10*']);
assert.equal(physicalRows(tables[0])[0].children[0].rowSpan,2);
assert.equal(physicalRows(tables[1])[0].children[0].rowSpan,3);

// Equal nested conditions must not cross a boundary in an earlier condition.
const nested=structuredClone(candidate),nestedRows=nested.businessDesign.decisions[0].rows;
nestedRows[1].conditions[1]=structuredClone(nestedRows[0].conditions[1]);
nestedRows[2].conditions[1]=structuredClone(nestedRows[0].conditions[1]);
const nestedElements=await render(nested);
assert.equal(nestedElements.get('status').textContent,'');
const nestedTable=nestedElements.get('decisions').children[0].children.find(node=>node.tag==='div').children[0];
assert.equal(physicalRows(nestedTable)[0].children[1].rowSpan,2);
assert.equal(physicalRows(nestedTable)[2].children[1].textContent,'なし');
assert.deepEqual(rows(nestedTable).map(row=>row.slice(0,3)),[
  ['1〜12の整数','なし','有効'],['1〜12の整数','なし','入力エラー'],['それ以外','なし','入力エラー']
]);

// Other step conditions remain visible and point to the exact decision row.
const conditional=structuredClone(candidate);
conditional.businessDesign.steps[2].when.rowId='duplicate';
const conditionalElements=await render(conditional);
assert.equal(conditionalElements.get('status').textContent,'');
const conditionNote=conditionalElements.get('steps').children[2].children[3].children.find(child=>child.className==='condition');
assert.ok(conditionNote);
assert.equal(conditionNote.children[0].href,'#input-validation--duplicate');
const conditionalTable=conditionalElements.get('decisions').children[0].children.find(node=>node.tag==='div').children[0];
assert.equal(physicalRows(conditionalTable)[1].id,'input-validation--duplicate');
console.log('Business decisions PoC: source IDs, relationships, checks, boundary cases and rendered tables passed.');
