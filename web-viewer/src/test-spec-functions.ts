import type {ConceptCapability,ConceptContext,ConceptSample} from './concept-model';
import type {Check} from './json-document';

export type TestFunction={key:string;activityId?:string;groupId:string;capability:ConceptCapability;name:string;samples:ConceptSample[]};
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);

// Only a sample with an explicit Check reference can enter the test specification.
export function testFunctions(context:ConceptContext|undefined,docs:Check[]):TestFunction[]{
 if(!context||context.model.schemaVersion!=='0.2')return [];
 const known=new Set(context.business.activities.map(activity=>activity.id)),result:TestFunction[]=[],used=new Set<string>(),keys=new Set<string>();
 const checks=docs.filter(doc=>doc.basedOn.documentId===context.business.id&&doc.basedOn.revision===context.business.revision);
 const linked=(sample:ConceptSample,activityId?:string)=>sample.checkIds?.some(id=>checks.some(doc=>doc.items.some(item=>item.id===id)&&(!activityId||doc.index.some(row=>row.activityId===activityId&&row.checkIds.includes(id)))));
 const add=(groupId:string,capability:ConceptCapability,activityId:string|undefined,name:string)=>{
  const samples=capability.samples.filter(sample=>linked(sample,activityId));if(!samples.length)return;
  const key=`fn:${activityId??'_'}:${groupId}:${capability.id}`;if(keys.has(key))return;keys.add(key);result.push({key,activityId,groupId,capability,name,samples});
 };
 const views=context.model.presentation.activityViews;
 if(Array.isArray(views))for(const view of views){
  if(!record(view)||typeof view.activityId!=='string'||!known.has(view.activityId)||!Array.isArray(view.testSpecificationFunctions))continue;
  for(const ref of view.testSpecificationFunctions){
   if(!record(ref)||typeof ref.groupId!=='string'||typeof ref.capabilityId!=='string')continue;
   const group=context.model.reviewGroups.find(item=>item.id===ref.groupId),capability=group?.capabilities.find(item=>item.id===ref.capabilityId);
   if(!group||!capability)continue;
   used.add(JSON.stringify([group.id,capability.id]));
   add(group.id,capability,view.activityId,typeof ref.name==='string'&&ref.name.trim()?ref.name.trim():capability.title);
  }
 }
 for(const group of context.model.reviewGroups)for(const capability of group.capabilities){
  if(!used.has(JSON.stringify([group.id,capability.id])))add(group.id,capability,undefined,capability.title);
 }
 return result;
}
