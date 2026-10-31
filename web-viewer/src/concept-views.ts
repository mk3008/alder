import type {ConceptContext,SubsystemViews} from './concept-model';

export type ConceptCard={name:string;note:string;fields:string[][];sources?:string[];sourceActivities?:string[];conceptId?:string;subsystemId?:string};
export type ReviewGroup={id:string;name:string;purpose:string;activities:string[];concepts:Record<string,ConceptCard>;relations:string[][]};

/** Projects only fields explicitly provided by the currently opened JSON. */
export function createConceptViews({model}:ConceptContext){
 const tables:Record<string,ConceptCard>=Object.fromEntries(model.concepts.map(concept=>[concept.id,{
  name:concept.name,note:concept.description,fields:concept.information.map(item=>['',item.name+(item.responsibleSubsystemId&&item.responsibleSubsystemId!==concept.subsystemId?'（担当：'+model.subsystems.find(s=>s.id===item.responsibleSubsystemId)!.name+'）':'')])
 }]));
 const edges=model.relations.map(relation=>[relation.fromConceptId,relation.toConceptId,relation.fromLabel,relation.toLabel,relation.kind]);
 const groups:ReviewGroup[]=model.reviewGroups.map(group=>({id:group.id,name:group.title,purpose:group.description,activities:group.relatedActivityIds,
  concepts:Object.fromEntries(group.graph.nodes.map(node=>[node.conceptId,{name:node.name,note:node.description,
   fields:node.fields.map(field=>['',field]),sources:node.sources,sourceActivities:node.sourceActivityIds}])),
  relations:group.graph.edges.map(edge=>[edge.fromConceptId,edge.toConceptId,edge.fromLabel,edge.toLabel,edge.kind])}));
 const findGroup=(id:string|undefined|null)=>groups.find(group=>group.id===id);
 const projection=(views:SubsystemViews,source:Record<string,ConceptCard>)=>{
  const cards:Record<string,ConceptCard>=Object.fromEntries(views.nodes.map(node=>[node.id,{...source[node.conceptId],name:node.name,note:node.description,sources:node.sources,
   conceptId:node.conceptId,subsystemId:node.subsystemId,fields:node.fields.map(field=>['',field.name])}]));
  const regions=model.subsystems.filter(item=>views.nodes.some(node=>node.subsystemId===item.id)).map(item=>({id:item.id,name:item.name}));
  const handoffs=views.handoffIds.map(id=>model.handoffs.find(item=>item.id===id)!).map(item=>({id:item.id,from:item.fromSubsystemId,to:item.toSubsystemId,label:item.information,returning:item.flowDirection==='return'}));
  return {ids:views.nodes.map(node=>node.id),tables:cards,edges:views.edges.map(edge=>[edge.fromViewId,edge.toViewId,edge.fromLabel,edge.toLabel,edge.kind]),regions,handoffs};
 };
 const graph=(id:string)=>{const group=findGroup(id);if(!group)throw Error('Unknown review group: '+id);
  const authored=model.reviewGroups.find(item=>item.id===id)!,views=authored.graph.subsystemViews;
  if(views)return projection(views,group.concepts);
  const ids=Object.keys(tables).filter(key=>Object.hasOwn(group.concepts,key));
  return {ids,tables:group.concepts,edges:group.relations.filter(([from,to])=>ids.includes(from)&&ids.includes(to)),regions:[],handoffs:[]};};
 const overviewGraph=()=>model.presentation.subsystemViews?projection(model.presentation.subsystemViews,tables):{ids:Object.keys(tables),tables,edges,regions:[],handoffs:[]};
 return {tables,edges,groups,findGroup,graph,overviewGraph};
}
