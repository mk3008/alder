import {demand} from './core.mjs';

const unique=(items,message)=>demand(new Set(items).size===items.length,message);
const nonempty=(items,message)=>demand(items.length>0,message);
const conditionKey=value=>JSON.stringify(value.kind==='value'?[value.axisId,value.kind,value.operator,value.value]:[value.axisId,value.kind]);

// A decisionIds link identifies a reference, not necessarily the producer.
// Flag an unambiguous later reference for review; never turn it into an edge.
export function laterDecisionReference(activity,step){
 if(!step.whenDecision||step.dependsOn!=null)return null;
 const uses=activity.procedure.steps.filter(value=>value.decisionIds?.includes(step.whenDecision.decisionId));
 return uses.length===1&&activity.procedure.steps.indexOf(uses[0])>activity.procedure.steps.indexOf(step)?uses[0]:null;
}

// The array is a convenient standard order. Only explicitly recorded
// dependencies and legacy before rules constrain a reordering.
function validateOrder(activity,ref){
 const steps=activity.procedure.steps,ids=steps.map(s=>s.id),edges=new Map(ids.map(id=>[id,[]])),before=new Set(),groups=new Set(),swaps=[];
 nonempty(steps,'Procedure requires a Step: '+activity.id);
 for(const rule of activity.procedure.orderRules){
  if(rule.kind==='before'){
   ref(rule.beforeId,'step',activity.id);ref(rule.afterId,'step',activity.id);
   demand(rule.beforeId!==rule.afterId,'Self Step order');
   const key=JSON.stringify([rule.beforeId,rule.afterId]);demand(!before.has(key),'Duplicate Step order');before.add(key);
   demand(ids.indexOf(rule.beforeId)<ids.indexOf(rule.afterId),'Standard Step order contradicts before constraint');
   edges.get(rule.beforeId).push(rule.afterId);
  }else{
   demand(rule.stepIds.length>=2,'Interchangeable group requires two Steps');unique(rule.stepIds,'Duplicate interchangeable Step');
   for(const id of rule.stepIds)ref(id,'step',activity.id);
   const key=JSON.stringify([...rule.stepIds].sort());demand(!groups.has(key),'Duplicate interchangeable group');groups.add(key);swaps.push(rule.stepIds);
  }
 }
 for(const step of steps){
  if(!Array.isArray(step.dependsOn))continue;
  unique(step.dependsOn.map(value=>JSON.stringify([value.stepId,value.whenDecision?.decisionId??null,value.whenDecision?.rowId??null])),'Duplicate Step prerequisite: '+step.id);
  for(const dependency of step.dependsOn){const id=dependency.stepId;
   ref(id,'step',activity.id);demand(id!==step.id,'Self Step prerequisite: '+step.id);
   demand(ids.indexOf(id)<ids.indexOf(step.id),'Standard Step order contradicts prerequisite: '+id+' -> '+step.id);
   edges.get(id).push(step.id);
  }
 }
 const reaches=(from,to)=>{const pending=[from],seen=new Set();while(pending.length){const id=pending.pop();if(seen.has(id))continue;seen.add(id);for(const n of edges.get(id)){if(n===to)return true;pending.push(n);}}return false;};
 for(const id of ids)demand(!reaches(id,id),'Step order cycle');
 for(const group of swaps)for(const x of group)for(const y of group)if(x!==y)demand(!reaches(x,y),'Interchangeable Steps conflict with before constraint');
}

function validateCommon(bd,inv,target){
 const ref=(id,type,parent)=>{const value=target(id,type,bd.id);if(parent)demand(inv.parent.get(id)===parent,'Structure owner mismatch: '+id);return value;};
 unique(bd.roles.map(r=>r.name),'Duplicate Role name');demand(bd.roles.every(r=>r.name===r.name.trim()&&!/[\r\n]/.test(r.name)),'Invalid Role name');
 unique(bd.data.map(d=>d.name),'Duplicate Data name');
 for(const d of bd.data){demand(d.name===d.name.trim(),'Data name whitespace');nonempty(d.items,'Data requires Information: '+d.id);unique(d.items.map(i=>i.informationId),'Duplicate Data information');for(const i of d.items)ref(i.informationId,'information');}
 for(const a of bd.activities){nonempty(a.results,'Activity requires Result: '+a.id);validateOrder(a,ref);}
 return ref;
}

// Decisions belong to the Activity. Check references cross into a Check
// document only when that document explicitly covers the same Activity.
function validateDecisions(bd,inv,target,ref,diagnostics){
 for(const activity of bd.activities){
  const pointer=value=>{const decision=ref(value.decisionId,'decision',activity.id);ref(value.rowId,'decision-row',decision.id);return decision;};
  for(const step of activity.procedure.steps){
   unique(step.decisionIds,'Duplicate Step decision');for(const id of step.decisionIds)ref(id,'decision',activity.id);
   if(step.whenDecision)pointer(step.whenDecision);
   const later=laterDecisionReference(activity,step);if(later)diagnostics.push('判定表を参照する手順が後方: '+step.id+' / '+later.id+'（前提を確認）');
   for(const dependency of step.dependsOn??[]){const id=dependency.stepId,prior=activity.procedure.steps.find(value=>value.id===id);
    if(dependency.whenDecision)pointer(dependency.whenDecision);
    const sameDecision=value=>value&&prior.whenDecision&&value.decisionId===prior.whenDecision.decisionId&&value.rowId===prior.whenDecision.rowId;
    const unmatchedDecision=prior.whenDecision&&!sameDecision(step.whenDecision)&&!sameDecision(dependency.whenDecision);
    if(prior.obligation==='optional'||prior.appliesWhen||unmatchedDecision)diagnostics.push('前提手順の実施条件を確認: '+step.id+' <- '+id);
   }
  }
  for(const decision of activity.decisions){
   nonempty(decision.axes,'Decision requires a condition axis: '+decision.id);nonempty(decision.rows,'Decision requires a row: '+decision.id);
   if(decision.appliesWhen){pointer(decision.appliesWhen);demand(decision.appliesWhen.decisionId!==decision.id,'Decision cannot depend on itself: '+decision.id);}
   for(const axis of decision.axes){unique(axis.dataIds,'Duplicate decision axis Data');for(const id of axis.dataIds)ref(id,'data');demand((axis.trueLabel===undefined)===(axis.falseLabel===undefined),'Boolean labels must be paired: '+axis.id);}
   for(const [index,row] of decision.rows.entries()){
    demand(row.conditions.length===decision.axes.length,'Decision row must cover every axis: '+row.id);
    for(const [column,condition] of row.conditions.entries()){
     demand(condition.axisId===decision.axes[column].id,'Decision condition axis/order mismatch: '+row.id);
     if(condition.kind==='value'&&['gte','lte','gt','lt'].includes(condition.operator))demand(typeof condition.value==='number','Ordered comparison requires a number: '+row.id);
     if(condition.kind==='undecided')demand(row.result.kind==='undecided','Undecided condition cannot assert an outcome: '+row.id);
     if(condition.kind==='else'){
      const prefix=JSON.stringify(row.conditions.slice(0,column).map(conditionKey));
      demand(decision.rows.slice(0,index).some(prior=>JSON.stringify(prior.conditions.slice(0,column).map(conditionKey))===prefix&&prior.conditions[column]?.kind==='value'),'Else needs an earlier branch in the same context: '+row.id);
     }
    }
    demand(row.result.kind==='undecided'||row.result.text!==null,'Known decision result needs a description: '+row.id);
    if(row.result.kind==='undecided')diagnostics.push('業務判断未決: '+row.id);
    unique(row.result.dataIds,'Duplicate decision result Data');for(const id of row.result.dataIds)ref(id,'data');
    unique(row.result.exceptionIds,'Duplicate decision exception');for(const id of row.result.exceptionIds){const exception=ref(id,'exception');demand(exception.activityId===activity.id,'Decision exception Activity mismatch: '+id);}
    unique(row.checkRefs.map(value=>value.checkId),'Duplicate decision Check');
    for(const link of row.checkRefs){target(link.checkId,'check');const doc=inv.map.get(inv.owner.get(link.checkId));demand(doc?.kind==='checkItems'&&doc.basedOn.documentId===bd.id&&doc.basedOn.revision===bd.revision,'Decision Check source mismatch: '+link.checkId);demand(doc.index.some(item=>item.activityId===activity.id&&item.checkIds.includes(link.checkId)),'Decision Check Activity mismatch: '+link.checkId);}
   }
  }
  for(const decision of activity.decisions){const seen=new Set();let current=decision;while(current.appliesWhen){demand(!seen.has(current.id),'Decision dependency cycle: '+decision.id);seen.add(current.id);current=pointer(current.appliesWhen);}}
 }
}

// Preserve the unshipped 0.5 meaning exactly when reading it; never infer the
// new direct Who or alter an old payload during inspection.
export function validateOldStructure(bd,inv,target){
 const ref=validateCommon(bd,inv,target);
 for(const a of bd.activities){
  if(a.performers!==null){nonempty(a.performers,'Empty performers');unique(a.performers.map(p=>p.objectId),'Duplicate performer');for(const p of a.performers){ref(p.objectId,'object');unique(p.roleIds,'Duplicate performer Role');for(const role of p.roleIds)ref(role,'role');}}
  let unresolved=a.performers===null;
  for(const s of a.procedure.steps){if(s.performerObjectIds!==null){nonempty(s.performerObjectIds,'Empty Step performers');unique(s.performerObjectIds,'Duplicate Step performer');for(const id of s.performerObjectIds)demand(a.performers?.some(p=>p.objectId===id),'Step performer outside Activity assignment: '+id);}else if(a.performers?.length!==1)unresolved=true;}
  if(unresolved)demand(bd.findings.some(f=>f.status==='open'&&f.scope==='items'&&f.targetIds.includes(a.id)),'Unresolved performer requires an open Activity Finding: '+a.id);
 }
 for(const r of bd.relations)if(['input','output'].includes(r.kind)){const data=ref(r.dataId,'data'),objectId=r.kind==='input'?r.fromId:r.toId;for(const item of data.items)ref(item.informationId,'information',objectId);}
}

// New interactions retain explicit references. Their Data can originate from
// Information on another Object; ownership itself remains unchanged.
export function validateProcedureStructure(bd,inv,target,diagnostics){
 const ref=validateCommon(bd,inv,target),steps=new Map(bd.activities.flatMap(a=>a.procedure.steps.map(s=>[s.id,{activity:a,step:s}])));
 if(bd.schemaVersion==='0.6')validateDecisions(bd,inv,target,ref,diagnostics);
 for(const exception of bd.exceptions){
  const c=exception.continuity;if(!c)continue;
  for(const id of [c.interruptedAtStepId,c.resumeAtStepId])if(id!==null)ref(id,'step',exception.activityId);
  if(c.retainedDataIds!==null){unique(c.retainedDataIds,'Duplicate retained Data');for(const id of c.retainedDataIds)ref(id,'data');}
 }
 for(const object of bd.objects)if(object.scope===null)diagnostics.push('Scope未確定: '+object.id);
 for(const a of bd.activities){
  if(a.scope===null)diagnostics.push('Scope未確定: '+a.id);
  if(a.who===null)diagnostics.push('Who未確定: '+a.id);
  else if(a.who.kind==='role')ref(a.who.roleId,'role');
  for(const s of a.procedure.steps){
   if(s.parties)for(const party of [s.parties.from,s.parties.to])if(party?.kind==='object')ref(party.objectId,'object');
   if(s.whatDataIds===null)diagnostics.push('対象Data未確定: '+s.id);
   else {unique(s.whatDataIds,'Duplicate Step target Data');for(const id of s.whatDataIds)ref(id,'data');}
   const x=s.exchange;if(x.kind==='unresolved'){diagnostics.push('やり取り未確定: '+s.id);continue;}if(x.kind==='internal')continue;
   ref(x.objectId,'object');
   if(x.phase===null)diagnostics.push('Request/Response未確定: '+s.id);
   if(x.dataIds===null)diagnostics.push('Data未確定: '+s.id);
   else {unique(x.dataIds,'Duplicate Step Data');for(const id of x.dataIds)ref(id,'data');}
   if(x.relationId!==null){const relation=ref(x.relationId,'relation');const input=x.direction==='input';
    demand(relation.kind===x.direction&&relation.fromId===(input?x.objectId:a.id)&&relation.toId===(input?a.id:x.objectId),'Step relation direction/endpoint mismatch: '+s.id);
   }
   if(x.pairedStepId!==null){
    const pair=steps.get(x.pairedStepId);demand(pair&&pair.activity.id===a.id&&pair.step.id!==s.id,'Invalid paired Step: '+s.id);
    const y=pair.step.exchange;demand(y.kind==='interaction'&&['request','response'].includes(x.phase)&&['request','response'].includes(y.phase)&&y.phase!==x.phase&&y.direction!==x.direction&&y.objectId===x.objectId,'Request/Response mismatch: '+s.id);
   }
  }
 }
}

// Presentation projection is derived from Steps. Grouping never merges or
// overwrites the underlying Step/Data IDs or optional legacy Relation IDs.
export function projectProcedure(bd){
 const data=new Map(bd.data.map(d=>[d.id,d])),groups=new Map(),rows=[];
 for(const a of bd.activities)for(const s of a.procedure.steps){
  const x=s.exchange,mentioned=new Map();
  const add=(id,kind)=>{let item=mentioned.get(id);if(!item){const d=data.get(id);demand(d,'Unknown Data during projection: '+id);item={id:d.id,name:d.name,uses:[]};mentioned.set(id,item);}if(!item.uses.includes(kind))item.uses.push(kind);};
  for(const id of s.whatDataIds??[])add(id,'target');if(x.kind==='interaction')for(const id of x.dataIds??[])add(id,'transferred');
  const common={activityId:a.id,stepId:s.id,action:s.action,method:s.method,data:[...mentioned.values()],targetDataUndecided:s.whatDataIds===null,obligation:s.obligation,appliesWhen:s.appliesWhen,effect:s.effect,...(s.parties?{parties:s.parties}:{})};
  if(x.kind!=='interaction'){rows.push({...common,kind:x.kind,from:x.kind==='internal'?{kind:'who',activityId:a.id}:null,to:null});continue;}
  const who={kind:'who',activityId:a.id},object={kind:'object',objectId:x.objectId};
  rows.push({...common,kind:x.kind,from:x.direction==='output'?who:object,to:x.direction==='output'?object:who,
   objectId:x.objectId,direction:x.direction,phase:x.phase,dataIds:x.dataIds,relationId:x.relationId,pairedStepId:x.pairedStepId});
  const key=JSON.stringify([a.id,x.objectId,x.direction]);if(!groups.has(key))groups.set(key,{activityId:a.id,objectId:x.objectId,direction:x.direction,stepIds:[],relationIds:[],data:[]});
  const group=groups.get(key);group.stepIds.push(s.id);if(x.relationId!==null&&!group.relationIds.includes(x.relationId))group.relationIds.push(x.relationId);if(x.dataIds===null)group.transferUndecided=true;
  for(const id of x.dataIds??[])if(!group.data.some(item=>item.id===id)){const d=data.get(id);demand(d,'Unknown Data during projection: '+id);group.data.push({id:d.id,name:d.name});}
 }
 return {rows,edges:[...groups.values()].map(group=>({...group,label:group.data.map(d=>d.name).join(' / ')}))};
}
