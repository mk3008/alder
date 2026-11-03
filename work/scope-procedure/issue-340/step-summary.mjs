// Research-only: derive diagram summaries from detailed Procedure steps.
// This is not an Alder package validator, migration or Viewer implementation.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

export function project(doc) {
  const errors=[], pending=[], rows=[], edges=[], ids=new Map();
  const error=(code,where)=>errors.push({code,where});
  const todo=(code,where)=>pending.push({code,where});
  const list=(value,where)=>{if(Array.isArray(value))return value;error('ARRAY_REQUIRED',where);return [];};
  const add=(item,type,where)=>{
    if(!item || typeof item.id!=='string' || !item.id.trim()){error('ID_REQUIRED',where);return;}
    if(ids.has(item.id))error('DUPLICATE_ID',item.id);else ids.set(item.id,{type,item});
  };
  if(doc?.candidateVersion!=='step-summary-poc/1')error('CANDIDATE_VERSION','candidateVersion');
  const roles=list(doc?.roles,'roles'), objects=list(doc?.objects,'objects'), data=list(doc?.data,'data'), activities=list(doc?.activities,'activities');
  for(const role of roles)add(role,'role','roles');
  for(const object of objects){add(object,'object','objects');if(object.scope===null)todo('SCOPE_UNRESOLVED',object.id);else if(typeof object.scope!=='boolean')error('SCOPE_BOOLEAN',object.id);}
  for(const datum of data)add(datum,'data','data');
  for(const activity of activities){
    add(activity,'activity','activities');
    for(const step of list(activity.steps,`${activity.id}.steps`))add(step,'step',activity.id);
  }
  const ref=(id,type,where)=>{const found=ids.get(id);if(!found||found.type!==type){error('INVALID_REFERENCE',`${where}:${type}:${id}`);return null;}return found.item;};
  const grouping=new Map();
  for(const activity of activities){
    if(activity.scope===null)todo('SCOPE_UNRESOLVED',activity.id);else if(typeof activity.scope!=='boolean')error('SCOPE_BOOLEAN',activity.id);
    const who=activity.who;
    if(who===null)todo('WHO_UNRESOLVED',activity.id);
    else if(!who || Array.isArray(who) || typeof who!=='object')error('SINGLE_WHO_REQUIRED',activity.id);
    else if(who.kind==='role')ref(who.roleId,'role',activity.id);
    else if(['system','scheduler'].includes(who.kind)){
      if(typeof who.name!=='string'||!who.name.trim())error('AUTOMATIC_WHO_NAME',activity.id);
    } else error('WHO_KIND',activity.id);
    if(typeof activity.when!=='string'||!activity.when.trim())error('WHEN_REQUIRED',activity.id);
    for(const step of list(activity.steps,`${activity.id}.steps`)){
      if(typeof step.text!=='string'||!step.text.trim())error('STEP_TEXT',step.id);
      if(Object.hasOwn(step,'action')&&(typeof step.action!=='string'||!step.action.trim()))error('ACTION',step.id);
      if(Object.hasOwn(step,'method')&&step.method!==null&&(typeof step.method!=='string'||!step.method.trim()))error('METHOD',step.id);
      if(Object.hasOwn(step,'targetDataId')&&step.targetDataId!==null)ref(step.targetDataId,'data',step.id);
      if(!['required','optional'].includes(step.obligation))error('OBLIGATION',step.id);
      if(step.appliesWhen!==null&&(typeof step.appliesWhen!=='string'||!step.appliesWhen.trim()))error('APPLIES_WHEN',step.id);
      if(step.effect!==null&&!['create','read','update','delete','not-applicable','undecided'].includes(step.effect))error('EFFECT',step.id);
      if(!('exchange' in step)){rows.push({stepId:step.id,text:step.text,action:step.action??step.text,method:step.method??null,kind:'local',from:`who:${activity.id}`,to:null,whatDataId:step.targetDataId??null,effect:step.effect});continue;}
      const x=step.exchange;
      if(x===null){todo('EXCHANGE_UNRESOLVED',step.id);rows.push({stepId:step.id,text:step.text,action:step.action??step.text,method:step.method??null,kind:'unresolved',from:null,to:null,whatDataId:step.targetDataId??null,effect:step.effect});continue;}
      if(!x||typeof x!=='object'||Array.isArray(x)){error('EXCHANGE_SHAPE',step.id);continue;}
      if(!['request','response'].includes(x.phase))error('PHASE',step.id);
      if(!['input','output'].includes(x.direction)){error('DIRECTION',step.id);continue;}
      const object=ref(x.objectId,'object',step.id);
      const hasTarget=Object.hasOwn(x,'targetDataId');
      if(hasTarget&&x.targetDataId!==null)ref(x.targetDataId,'data',step.id);
      let datum=null;
      const hasDataId=Object.hasOwn(x,'dataId'), hasNoData=Object.hasOwn(x,'noData');
      if(hasNoData && (x.noData!==true || hasDataId))error('DATA_SHAPE',step.id);
      else if(!hasNoData && !hasDataId)error('DATA_SHAPE',step.id);
      else if(hasNoData){} // An explicitly empty payload is different from unknown Data.
      else if(x.dataId===null)todo('DATA_UNRESOLVED',step.id);
      else datum=ref(x.dataId,'data',step.id);
      const whoEndpoint=`who:${activity.id}`, objectEndpoint=`object:${x.objectId}`;
      rows.push({stepId:step.id,text:step.text,action:step.action??step.text,method:step.method??null,kind:'exchange',from:x.direction==='output'?whoEndpoint:objectEndpoint,to:x.direction==='output'?objectEndpoint:whoEndpoint,phase:x.phase,direction:x.direction,objectId:x.objectId,whatDataId:hasTarget?x.targetDataId:x.dataId,dataId:x.dataId,effect:step.effect});
      if(!object || (!datum && !hasNoData && x.dataId!==null))continue;
      const key=JSON.stringify([activity.id,x.objectId,x.direction]);
      if(!grouping.has(key))grouping.set(key,{activityId:activity.id,objectId:x.objectId,direction:x.direction,stepIds:[],data:[]});
      const group=grouping.get(key);
      group.stepIds.push(step.id);
      if(datum && !group.data.some(item=>item.id===datum.id))group.data.push({id:datum.id,name:datum.name});
    }
  }
  for(const value of grouping.values())edges.push({...value,label:value.data.map(item=>item.name).join(' / ')});
  return {errors,pending,rows,edges};
}

if(process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href){
  if(!process.argv[2]){console.error('Usage: node step-summary.mjs fixture.json');process.exitCode=2;}
  else try{const result=project(JSON.parse(await readFile(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));if(result.errors.length)process.exitCode=1;}
  catch(error){console.error(error.message);process.exitCode=2;}
}
