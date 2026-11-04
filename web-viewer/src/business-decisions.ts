import type {BusinessDecision,Check,DecisionAxis,DecisionCondition,BD} from './json-document';

const element=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
const key=(c:DecisionCondition)=>JSON.stringify(c.kind==='value'?[c.axisId,c.kind,c.operator,c.value]:[c.axisId,c.kind]);
const sameContext=(left:DecisionCondition[],right:DecisionCondition[],column:number)=>left.slice(0,column+1).every((v,i)=>key(v)===key(right[i]));
export function conditionLabel(c:DecisionCondition,axis:DecisionAxis):string{
 if(c.kind!=='value')return c.kind==='else'?'それ以外':c.kind==='any'?'不問':'未決';
 if(typeof c.value==='boolean')return c.value?(axis.trueLabel??'true'):(axis.falseLabel??'false');
 const value=String(c.value)+(typeof c.value==='number'?(axis.unit??''):'');
 return value+({is:'',eq:'',gte:'以上',lte:'以下',gt:'超',lt:'未満'} as const)[c.operator];
}
/** Row spans only within the same adjacent outer branch. The stored rows never change. */
export function decisionSpans(decision:BusinessDecision):number[][]{
 return decision.rows.map((row,i)=>decision.axes.map((_axis,column)=>{
  if(i>0&&sameContext(decision.rows[i-1].conditions,row.conditions,column))return 0;
  let n=1;while(i+n<decision.rows.length&&sameContext(row.conditions,decision.rows[i+n].conditions,column))n++;return n;
 }));
}
export function businessDecisionTable(decision:BusinessDecision,checks:Check[]):HTMLElement{
 const wrapper=element('div');wrapper.dataset.businessDecisionScroll='';wrapper.tabIndex=0;wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label',decision.title);
 const table=element('table');table.dataset.businessDecisionTable='';const head=element('thead'),group=element('tr');
 const conditions=element('th','条件');conditions.colSpan=decision.axes.length;conditions.scope='colgroup';group.append(conditions);
 for(const label of ['結果','Check']){const th=element('th',label);th.rowSpan=2;th.scope='col';if(label==='結果')th.dataset.decisionResult='';group.append(th);}head.append(group);
 const names=element('tr');for(const axis of decision.axes){const th=element('th',axis.name);th.scope='col';names.append(th);}head.append(names);table.append(head);
 const body=element('tbody'),spans=decisionSpans(decision);let partial=false;
 for(const [i,row] of decision.rows.entries()){
  const tr=element('tr');tr.dataset.decisionRow=row.id;
  row.conditions.forEach((condition,column)=>{const span=spans[i][column];if(!span)return;const cell=element('td',conditionLabel(condition,decision.axes[column]));if(span>1)cell.rowSpan=span;tr.append(cell);});
  const result=element('td',row.result.text??'未決');result.dataset.decisionResult='';result.dataset.resultKind=row.result.kind;tr.append(result);
  const labels=row.checkRefs.map(ref=>{const item=checks.flatMap(doc=>doc.items).find(value=>value.id===ref.checkId);if(ref.coverage==='partial')partial=true;return (item?.checkId??ref.checkId)+(ref.coverage==='partial'?'*':'');});
  tr.append(element('td',labels.join('、')||'—'));body.append(tr);
 }table.append(body);wrapper.append(table);if(partial){const note=element('p','*：この業務で扱う範囲のみ');note.className='decision-footnote';wrapper.append(note);}return wrapper;
}
export function decisionExceptions(decision:BusinessDecision,bd:BD,checks:Check[]):HTMLElement[]{
 const ids=[...new Set(decision.rows.flatMap(row=>row.result.exceptionIds))];
 return ids.flatMap(id=>{const value=bd.exceptions?.find(item=>item.id===id);if(!value)return [];
  const linked=checks.flatMap(doc=>doc.items).filter(item=>Object.values(item.fields).some(runs=>runs.some(run=>run.kind==='reference'&&run.targetId===id))).map(item=>item.checkId);
  const p=element('p',value.description+(linked.length?' （'+[...new Set(linked)].join('、')+'）':''));p.className='decision-exception';return [p];
 });
}
