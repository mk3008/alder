import {purchaseModel,activityKey} from './purchase-review.ts';
import {tables,activityDefinitions} from './concept-fixture.ts';

type Concept={name:string;note:string;fields:string[][];sources?:string[];sourceActivities?:string[]};
export type ReviewGroup={id:string;name:string;purpose:string;activities:string[];concepts:Record<string,Concept>;relations:string[][]};
export const reviewGroups:ReviewGroup[]=purchaseModel.reviewGroups.map(group=>({
 id:group.id,name:group.title,purpose:group.description,
 activities:group.relatedActivityIds.map(activityKey),
 concepts:Object.fromEntries(group.graph.nodes.map(node=>[node.conceptId,{
  name:node.name,note:node.description,fields:node.fields.map(field=>['',field]),
  sources:node.sources,sourceActivities:node.sourceActivityIds.map(activityKey)
 }])),
 relations:group.graph.edges.map(edge=>[edge.fromConceptId,edge.toConceptId,edge.fromLabel,edge.toLabel,edge.kind])
}));
export const reviewBoundaries=purchaseModel.presentation.reviewBoundaries;
export const findReviewGroup=(id:string|undefined|null)=>reviewGroups.find(group=>group.id===id);
export function reviewGraph(id:string){
 const group=findReviewGroup(id);if(!group)throw Error('Unknown review group: '+id);
 const ids=Object.keys(tables).filter(key=>Object.hasOwn(group.concepts,key));
 return {ids,tables:group.concepts,edges:group.relations.filter(([from,to])=>ids.includes(from)&&ids.includes(to))};
}
export const reviewActivityNames=(group:ReviewGroup)=>group.activities.map(id=>activityDefinitions.find(a=>a.id===id)!.title);
