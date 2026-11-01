import type {ConceptCapability,ConceptContext,ConceptSample} from './concept-model';
import type {Check} from './json-document';
// @ts-expect-error Shared JSON reference resolution is implemented in JavaScript.
import {exampleCheckIds} from '../../tools/document_storage/core.mjs';

export type TestFunction={key:string;activityId?:string;groupId:string;capability:ConceptCapability;name:string;samples:ConceptSample[];checkIds:string[];decisionCheckIds:string[];resultCheckIds:string[];decisionExampleIds:string[];decisionTableCheckIds:string[]};
export type SampleDestination={kind:'sample'|'decision';key:string;sampleId?:string};
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);

// Explicit Check relationships, not the existence or names of samples, determine navigation.
export function testFunctions(context:ConceptContext|undefined,docs:Check[]):TestFunction[]{
 if(!context||context.model.schemaVersion!=='0.2')return [];
 const known=new Set(context.business.activities.map(activity=>activity.id)),result:TestFunction[]=[],used=new Set<string>(),keys=new Set<string>();
 const checks=docs.filter(doc=>doc.basedOn.documentId===context.business.id&&doc.basedOn.revision===context.business.revision);
 const linked=(id:string,activityId?:string)=>checks.some(doc=>doc.items.some(item=>item.id===id)&&(!activityId||doc.index.some(row=>row.activityId===activityId&&row.checkIds.includes(id))));
 const add=(groupId:string,capability:ConceptCapability,activityId:string|undefined,name:string)=>{
  const spec=capability.testSpecification,decisionCheckIds=(spec?.decisionCheckIds??[]).filter(id=>linked(id,activityId)),resultCheckIds=(spec?.resultCheckIds??[]).filter(id=>linked(id,activityId));
  const decisionExampleIds=(spec?.decisionExampleIds??[]).filter(id=>checks.some(doc=>{const example=doc.examples.find(value=>value.id===id),ids=example?exampleCheckIds(doc,example):[];return ids.length>0&&ids.every((checkId:string)=>linked(checkId,activityId));}));
  const samples=capability.samples.filter(sample=>(!spec||spec.sampleIds.includes(sample.id))&&sample.checkIds?.length&&(spec?sample.checkIds.every(id=>linked(id,activityId)):sample.checkIds.some(id=>linked(id,activityId))));
  const decisionTableChecks=decisionExampleIds.flatMap(id=>checks.flatMap(doc=>{const example=doc.examples.find(value=>value.id===id);return example?exampleCheckIds(doc,example).filter((checkId:string)=>linked(checkId,activityId)):[];}));
  const checkIds=[...new Set<string>([...decisionCheckIds,...resultCheckIds,...decisionTableChecks,...samples.flatMap(sample=>(sample.checkIds??[]).filter(id=>linked(id,activityId)))])];if(!checkIds.length)return;
  const key=`fn:${activityId??'_'}:${groupId}:${capability.id}`;if(keys.has(key))return;keys.add(key);result.push({key,activityId,groupId,capability,name,samples,checkIds,decisionCheckIds,resultCheckIds,decisionExampleIds,decisionTableCheckIds:[...new Set<string>(decisionTableChecks)]});
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

/** Use only explicit, already displayed Check/sample connections; never infer by name. */
export function sampleDestination(functions:TestFunction[],groupId:string,capabilityId:string,sampleId:string):SampleDestination|undefined{
 const candidates=functions.filter(item=>item.groupId===groupId&&item.capability.id===capabilityId);
 const exact=candidates.find(item=>item.samples.some(sample=>sample.id===sampleId));
 if(exact)return {kind:'sample',key:exact.key,sampleId};
 for(const item of candidates){
  if(!item.capability.testSpecification)continue;
  const sample=item.capability.samples.find(value=>value.id===sampleId),displayed=item.decisionExampleIds.length?item.decisionTableCheckIds:item.decisionCheckIds;
  if(sample?.checkIds?.some(id=>displayed.includes(id)))return {kind:'decision',key:'decision:'+item.key};
 }
 return undefined;
}
