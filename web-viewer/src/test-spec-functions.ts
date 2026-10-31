import type {ConceptCapability,ConceptContext} from './concept-model';

export type TestFunction={key:string;activityId?:string;groupId:string;capability:ConceptCapability;name:string};
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);

// Navigation is explicitly supplied as presentation data; provenance metadata is not interpreted.
export function testFunctions(context:ConceptContext|undefined):TestFunction[]{
 if(!context)return [];
 const known=new Set(context.business.activities.map(activity=>activity.id)),result:TestFunction[]=[],used=new Set<string>(),keys=new Set<string>();
 const views=context.model.presentation.activityViews;
 if(Array.isArray(views))for(const view of views){
  if(!record(view)||typeof view.activityId!=='string'||!known.has(view.activityId)||!Array.isArray(view.testSpecificationFunctions))continue;
  for(const ref of view.testSpecificationFunctions){
   if(!record(ref)||typeof ref.groupId!=='string'||typeof ref.capabilityId!=='string')continue;
   const group=context.model.reviewGroups.find(item=>item.id===ref.groupId),capability=group?.capabilities.find(item=>item.id===ref.capabilityId);
   if(!group||!capability)continue;
   const key=`fn:${view.activityId}:${group.id}:${capability.id}`;if(keys.has(key))continue;keys.add(key);used.add(JSON.stringify([group.id,capability.id]));
   const name=typeof ref.name==='string'&&ref.name.trim()?ref.name.trim():capability.title;
   result.push({key,activityId:view.activityId,groupId:group.id,capability,name});
  }
 }
 for(const group of context.model.reviewGroups)for(const capability of group.capabilities){
  if(!used.has(JSON.stringify([group.id,capability.id])))result.push({key:`fn:_:${group.id}:${capability.id}`,groupId:group.id,capability,name:capability.title});
 }
 return result;
}
