import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {createHash} from 'node:crypto';

// This small DOM exercises the shared renderer without pretending to be a browser.
class Node {
 constructor(tag=''){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this._text='';this.className='';this.style={};}
 set textContent(value){this._text=String(value??'');this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 append(...nodes){this.children.push(...nodes.map(n=>typeof n==='string'?Object.assign(new Node('#text'),{textContent:n}):n));}
 setAttribute(name,value){this[name]=String(value);}
 querySelectorAll(selector){const names=new Set(selector.split(',').map(x=>x.trim().toUpperCase())),found=[];const walk=n=>{for(const c of n.children){if(names.has(c.tagName))found.push(c);walk(c);}};walk(this);return found;}
 querySelector(selector){return this.querySelectorAll(selector)[0]??null;}
 remove(){}
}
globalThis.document={createElement:tag=>new Node(tag),createTextNode:text=>Object.assign(new Node('#text'),{textContent:text})};
registerHooks({resolve(spec,context,next){if((spec.startsWith('./')||spec.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(spec)){try{return next(spec+'.ts',context)}catch{}try{return next(spec+'.js',context)}catch{}}return next(spec,context)}});
const {parseDocument}=await import('../src/document-input.ts');
const {businessDetail}=await import('../src/document-view.ts');
const {findingLinks}=await import('../src/findings.ts');
const {activityRole,roleGroupKey}=await import('../src/roles.ts');
const read=path=>readFileSync(path,'utf8'),parse=path=>parseDocument(read(path));
const {renderChecks}=await import('../src/document-view.ts');
const {decisionSpans,conditionLabel}=await import('../src/business-decisions.ts');
Node.prototype.addEventListener=function(name,fn){(this.listeners??={})[name]=fn;};Node.prototype.scrollIntoView=function(){this.scrolled=true;};
const raw=read('verification/business-decisions-integration.check-items.json');
assert.equal(createHash('sha256').update(raw).digest('hex'),'e0af5f884590680a5422e653a281e28507b99301b8d2c0aeec8d3bceedc421f2');
const expected=Array.from({length:7},(_,i)=>`BD-DECISION-00${i+1}`);assert.deepEqual(JSON.parse(raw).checks.map(value=>value.id),expected);const covered=[];
const source=read('../tools/document_storage/examples/molkky-decisions-v07.json'),design=parseDocument(source),detail=businessDetail(design,'calculate-score');
assert.equal(design.markdown,source);assert.equal(design.model.formatVersion,'0.7');
const tables=detail.querySelectorAll('table'),procedure=tables[0],rows=procedure.querySelectorAll('tr');assert.equal(tables.length,3);assert.deepEqual(procedure.querySelectorAll('th').map(n=>n.textContent),['From','To','Data','Action']);
assert.deepEqual(rows.slice(1).map(row=>row.children.map(cell=>cell.textContent.replace(/詳細.*$/,''))),[
 ['利用者','点数計算機能','投擲順・各回の棒の番号','受け取る'],['点数計算機能','—','投擲順・各回の棒の番号','検査する（※1）'],['点数計算機能','—','投擲順・各回の棒の番号','計算する（※2）'],['点数計算機能','投擲ごとの点数','投擲順・各回の点数','渡す'],['点数計算機能','利用者','各回の点数または入力エラー','返す']]);
assert.deepEqual(design.graph.relations.filter(x=>['input','output'].includes(x.kind)).map(x=>[x.kind,x.from,x.to]),[['input','player','calculate-score'],['output','calculate-score','player'],['output','calculate-score','score-object']]);covered.push(expected[0]);
const link=rows[2].querySelector('button'),sections=detail.querySelectorAll('section').filter(x=>x.dataset.businessDecision);link.onclick();assert.equal(sections[0].scrolled,true);assert.match(detail.textContent,/入力の検査（※1）/);assert.match(detail.textContent,/点数の計算（※2）/);assert.match(detail.textContent,/上から順に判定/);covered.push(expected[1]);
const decisions=design.model.business.activities[0].decisions;assert.deepEqual(decisionSpans(decisions[0]),[[2,1],[0,1],[1,1]]);assert.deepEqual(decisionSpans(decisions[1]),[[3,1],[0,1],[0,1],[1,1]]);const branch=structuredClone(decisions[1]);branch.rows[1].conditions[0].value=2;assert.equal(decisionSpans(branch)[1][1],1);for(const [kind,label] of [['else','それ以外'],['any','不問'],['undecided','未決']])assert.equal(conditionLabel({axisId:'x',kind},{id:'x',name:'x',dataIds:[]}),label);assert.equal(tables[1].querySelectorAll('tr')[2].children[0].rowSpan,2);assert.equal(tables[2].querySelectorAll('tr')[2].children[0].rowSpan,3);covered.push(expected[2]);
assert.match(tables[1].textContent,/MK-04/);assert.match(tables[2].textContent,/MK-10\*/);assert.match(detail.textContent,/この業務で扱う範囲のみ/);assert.equal(design.model.checks[0].items.every(x=>x.reviewState==='未レビュー'),true);const checkView=renderChecks(design,'calculate-score'),check01=checkView.querySelectorAll('section').find(section=>section.dataset.elementId==='check-01'),reference=check01.querySelector('details');reference.open=true;reference.listeners.toggle();assert.match(reference.textContent,/投擲回数/);assert.match(reference.textContent,/倒れた棒の番号/);covered.push(expected[3]);
const reverseOnly=JSON.parse(source),reverseItem=reverseOnly.documents.find(x=>x.kind==='checkItems').items[0];reverseItem.fields.guarantee=[{kind:'text',value:'0本は0点'}];const reverseView=renderChecks(parseDocument(JSON.stringify(reverseOnly)),'calculate-score'),reverseCard=reverseView.querySelectorAll('section').find(x=>x.dataset.elementId==='check-01'),reverseLink=reverseCard.querySelectorAll('details').find(x=>x.dataset.linkedBusinessDecision==='score-algorithm');assert.ok(reverseLink);reverseLink.open=true;reverseLink.listeners.toggle();assert.match(reverseLink.textContent,/投擲回数/);assert.match(detail.textContent,/適用条件：入力の検査 — 有効/);
const legacy=parseDocument(read('../tools/document_storage/examples/continuity-draft-v06.json')),oldTable=businessDetail(legacy,'fill').querySelector('table');assert.deepEqual(oldTable.querySelectorAll('th').map(x=>x.textContent),['Step','From','To','Data','Action']);const invalid=JSON.parse(source);invalid.formatVersion='0.8';assert.throws(()=>parseDocument(JSON.stringify(invalid)));covered.push(expected[4]);
const css=read('src/procedure-continuity.css');assert.match(css,/\[data-procedure-table\]\[data-business-decisions\]/);assert.match(css,/\[data-business-decision-table\].*padding:4px 6px/);assert.match(css,/overflow-x:auto/);assert.match(css,/border-left:2px solid/);covered.push(expected[5]);
assert.doesNotMatch(rows[3].textContent,/入力が有効な場合|判定条件/);assert.match(detail.textContent,/全体.*エラー/);const changed=JSON.parse(source);changed.documents[0].activities[0].procedure.steps[2].appliesWhen='特別な場合';assert.match(businessDetail(parseDocument(JSON.stringify(changed)),'calculate-score').textContent,/適用条件：特別な場合/);covered.push(expected[6]);assert.deepEqual(covered,expected);

// An accepted branch must remain identifiable when another accepted branch has
// the same result label. Both the Step and the dependent decision point to it.
const makeBranches=()=>{
 const pkg=JSON.parse(source),activity=pkg.documents[0].activities[0],validation=activity.decisions[0];
 validation.axes[1]={id:'axis-duplicate',name:'申請区分',dataIds:['throws']};
 validation.rows[0].conditions[1]={axisId:'axis-duplicate',kind:'value',operator:'is',value:'A'};
 const alternate=structuredClone(validation.rows[0]);alternate.id='valid-b';alternate.conditions[1].value='B';validation.rows.splice(1,0,alternate);
 return pkg;
};
for(const [rowId,expectedValue,forbiddenValue] of [['valid','A','B'],['valid-b','B','A']]){
 const pkg=makeBranches(),a=pkg.documents[0].activities[0];a.procedure.steps[2].whenDecision.rowId=rowId;a.decisions[1].appliesWhen.rowId=rowId;
 const view=businessDetail(parseDocument(JSON.stringify(pkg)),'calculate-score'),step=view.querySelectorAll('tr').find(n=>n.dataset.stepId==='calculate');
 const stepDetails=step.querySelector('details');assert.ok(stepDetails);assert.match(stepDetails.textContent,new RegExp(`判定条件：.*申請区分：${expectedValue}`));assert.doesNotMatch(stepDetails.textContent,new RegExp(`申請区分：${forbiddenValue}`));
 const conditional=stepDetails.querySelectorAll('button').find(n=>n.textContent==='（※1）');assert.ok(conditional);conditional.onclick();
 const target=view.querySelectorAll('tr').find(n=>n.dataset.decisionRow===rowId);assert.equal(target.scrolled,true);
 const dependent=view.querySelectorAll('section').find(n=>n.dataset.businessDecision==='score-algorithm');assert.match(dependent.textContent,new RegExp(`適用条件：.*申請区分：${expectedValue}`));target.scrolled=false;dependent.querySelector('button').onclick();assert.equal(target.scrolled,true);
}

// An undecided branch is not an error, even if the table has just one
// accepted row; suppressing the Step's condition would hide that distinction.
const pending=JSON.parse(source),pendingActivity=pending.documents[0].activities[0],pendingValidation=pendingActivity.decisions[0];
pendingValidation.rows.push({id:'pending',conditions:[{axisId:'axis-numbers',kind:'undecided'},{axisId:'axis-duplicate',kind:'any'}],result:{kind:'undecided',text:null,dataIds:[],exceptionIds:[]},checkRefs:[]});
const pendingView=businessDetail(parseDocument(JSON.stringify(pending)),'calculate-score'),pendingStep=pendingView.querySelectorAll('tr').find(n=>n.dataset.stepId==='calculate');assert.match(pendingStep.textContent,/判定条件：/);

// Explicit else/any are shown as decision-table terms, rather than substituted
// by the result label or inferred to mean a different decision row.
const otherwise=makeBranches(),otherwiseValidation=otherwise.documents[0].activities[0].decisions[0];
otherwiseValidation.rows[1].conditions[1]={axisId:'axis-duplicate',kind:'else'};
otherwise.documents[0].activities[0].procedure.steps[2].whenDecision.rowId='valid-b';
const otherwiseView=businessDetail(parseDocument(JSON.stringify(otherwise)),'calculate-score'),otherwiseStep=otherwiseView.querySelectorAll('tr').find(n=>n.dataset.stepId==='calculate');assert.match(otherwiseStep.textContent,/申請区分：それ以外/);

// Required and optional remain distinguishable without expanding every row.
const optional=JSON.parse(source);optional.documents[0].activities[0].procedure.steps[2].obligation='optional';
const optionalView=businessDetail(parseDocument(JSON.stringify(optional)),'calculate-score'),optionalStep=optionalView.querySelectorAll('tr').find(n=>n.dataset.stepId==='calculate');
assert.match(optionalView.textContent,/無印の手順は必須/);assert.match(optionalStep.textContent,/任意/);
optional.documents[0].activities[0].procedure.steps[2].method='目視';
const optionalDetails=businessDetail(parseDocument(JSON.stringify(optional)),'calculate-score').querySelectorAll('tr').find(n=>n.dataset.stepId==='calculate').querySelector('details');assert.match(optionalDetails.querySelector('summary').textContent,/任意/);assert.match(optionalDetails.textContent,/方法：目視/);
console.log('Integrated business decision model and DOM checks passed; real browser remains separate.');
