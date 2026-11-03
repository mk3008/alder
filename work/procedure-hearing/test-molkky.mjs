import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const candidate=JSON.parse(readFileSync(new URL('./issue-340-molkky.json',import.meta.url),'utf8'));
function validate(p){
  const unique=items=>{const ids=items.map(item=>item.id);assert.equal(new Set(ids).size,ids.length);return new Map(items.map(item=>[item.id,item]));};
  const parties=unique(p.parties),data=unique(p.data),checks=unique(p.checks),steps=unique(p.steps);
  assert.ok(parties.has(p.activity.whoId));
  for(const step of p.steps){
    assert.ok(parties.has(step.from)&&parties.has(step.to)&&data.has(step.dataId));
    for(const id of step.checkIds)assert.ok(checks.has(id));
    if(step.pairId){
      const pair=steps.get(step.pairId);
      assert.ok(pair&&pair.pairId===step.id&&pair.from===step.to&&pair.to===step.from);
      assert.deepEqual(new Set([step.phase,pair.phase]),new Set(['request','response']));
    }
  }
  for(const check of p.checks)for(const condition of check.conditions){
    const entry=data.get(condition.dataId);assert.ok(entry);
    if(condition.fieldId)assert.ok(entry.fields.some(field=>field.id===condition.fieldId));
  }
}
validate(candidate);
assert.deepEqual(candidate.steps.map(s=>[s.from,s.to,s.dataId,s.action]),[
  ['participant','recorder','participants','受け取る'],
  ['recorder','rule','participants','開始する'],
  ['rule','recorder','registration-result','返却する']
]);
const checks=new Map(candidate.checks.map(c=>[c.id,c]));
assert.deepEqual(checks.get('check-few').conditions[0].values,[0,1]);
assert.equal(checks.get('check-few').expected.outcome,'error');
assert.equal(checks.get('check-duplicate').conditions[0].value,true);
assert.equal(checks.get('check-duplicate').expected.outcome,'error');
assert.equal(checks.get('check-start').expected.outcome,'started');
assert.ok(checks.get('check-start').expected.effects.some(e=>e.action==='set-initial-score'&&e.value===0));
function matches(check,names){
  return check.conditions.every(c=>{
    if(c.predicate==='count-in')return c.values.includes(names.length);
    if(c.predicate==='count-at-least')return names.length>=c.value;
    if(c.predicate==='duplicates-exist')return (new Set(names).size<names.length)===c.value;
    throw Error('Unknown predicate');
  });
}
for(const [names,expected] of [
  [[],['check-few']],
  [['A'],['check-few']],
  [['A','A'],['check-duplicate']],
  [['A','B'],['check-start']]
])assert.deepEqual(candidate.checks.filter(c=>matches(c,names)).map(c=>c.id),expected);
// Evaluate the displayed first-match order against the original structured
// checks, including both boundary and repeated-name cases.
for(const [names,expected] of [
  [[], 'check-few'], [['A'], 'check-few'], [['A','A'], 'check-duplicate'],
  [['A','B'], 'check-start'], [['A','B','A'], 'check-duplicate'], [['A','B','C'], 'check-start']
])assert.equal(candidate.checks.find(check=>matches(check,names))?.id,expected);

// Run the preview's own renderer with the same JSON: each row exposes its
// deciding conditions and retains its Check ID and expected outcome.
const html=readFileSync(new URL('./preview.html',import.meta.url),'utf8');
const script=html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1];assert.ok(script);
class Node{
  constructor(tag){this.tag=tag;this.textContent='';this.children=[];this.className='';}
  append(child){this.children.push(child);}
}
async function render(source){
  const elements=new Map(['status','steps','checks','start-effects'].map(id=>[id,new Node(id)]));
  const document={getElementById:id=>elements.get(id),createElement:tag=>new Node(tag)};
  await runInNewContext(`(async()=>{${script}})()`,{document,fetch:async()=>({ok:true,json:async()=>source})});
  assert.equal(elements.get('status').textContent,'');return elements;
}
const rendered=await render(candidate);
assert.deepEqual(rendered.get('checks').children.map(row=>row.children.map(cell=>cell.textContent)),[
  ['2名以上','いる','エラー','check-duplicate'],
  ['2名以上','それ以外','正常','check-start'],
  ['それ以外','不問','エラー','check-few']
]);
assert.equal(rendered.get('start-effects').textContent,'開始時の記録：参加者の名前、順番、各自0点。');
const displayed=rendered.get('checks').children.map(row=>row.children.map(cell=>cell.textContent));
for(const names of [[],['A'],['A','A'],['A','B'],['A','B','A'],['A','B','C']]){
  const hasDuplicates=new Set(names).size<names.length;
  const row=displayed.find(([number,duplicate])=>(number==='2名以上'?names.length>=2:names.length<2)&&(duplicate==='不問'||(duplicate==='いる'&&hasDuplicates)||(duplicate==='それ以外'&&!hasDuplicates)));
  assert.equal(row?.[3],candidate.checks.find(check=>matches(check,names))?.id);
}
const changed=structuredClone(candidate);changed.checks[0].conditions[0].values=[0];
const changedRows=await render(changed);
assert.deepEqual(changedRows.get('checks').children[1].children.slice(0,2).map(cell=>cell.textContent),['不問','いる']);
const missing=structuredClone(candidate);missing.steps[2].checkIds[0]='missing';assert.throws(()=>validate(missing));
const badData=structuredClone(candidate);badData.steps[0].dataId='missing';assert.throws(()=>validate(badData));
const badDirection=structuredClone(candidate);badDirection.steps[2].from='recorder';assert.throws(()=>validate(badDirection));
const badPair=structuredClone(candidate);badPair.steps[2].phase='request';assert.throws(()=>validate(badPair));
console.log('Hearing procedure/check PoC: sample, references, direction and Request/Response checks passed.');
