import type {ConceptContext,SubsystemViews} from './concept-model';

export type ConceptCard={name:string;note:string;fields:string[][];sources?:string[];sourceActivities?:string[];conceptId?:string;subsystemId?:string};
export type ReviewGroup={id:string;name:string;purpose:string;activities:string[];concepts:Record<string,ConceptCard>;relations:string[][]};

/** Projects only fields explicitly provided by the currently opened JSON. */
export function createConceptViews({model}:ConceptContext){
 // This optional mapping is authored with the document. Never infer a field
 // relationship from similar names or from the existence of an edge alone.
 type FieldMapping={informationId:string;physicalName:string;relationIds:string[];valueType?:string;nullable?:boolean};
 type FieldLink={from:string;to:string;owner:string;informationId:string};
 const meta=model.meta&&typeof model.meta==='object'?model.meta as {fieldMappings?:unknown}:{};
 const mappings:FieldMapping[]=Array.isArray(meta.fieldMappings)?meta.fieldMappings.filter((value):value is FieldMapping=>
  !!value&&typeof value==='object'&&typeof value.informationId==='string'&&typeof value.physicalName==='string'&&
  Array.isArray(value.relationIds)&&value.relationIds.every((id:unknown)=>typeof id==='string')):[];
 const mappingByInfo=new Map(mappings.map(value=>[value.informationId,value]));
 const concepts=new Map(model.concepts.map(item=>[item.id,item]));
 const field=(conceptId:string,name:string,informationId?:string)=>{
  const info=concepts.get(conceptId)?.information.find(item=>informationId?item.id===informationId:item.name===name);
  const mapping=info&&mappingByInfo.get(info.id);
  if(!mapping)return ['',name];
  const result=[mapping.physicalName,name,info.id,mapping.valueType==='array'?'array':''];
  if(mapping.valueType==='array'&&mapping.nullable===true)result.push('nullable');
  return result;
 };
 const links=(projected:{from:string;to:string;relationIds:string[]}[],cards:Record<string,ConceptCard>):FieldLink[]=>{
  const result:FieldLink[]=[];
  for(const edge of projected){
   for(const owner of [edge.from,edge.to]){
    const card=cards[owner],conceptId=card?.conceptId??owner,concept=concepts.get(conceptId);if(!concept)continue;
    for(const info of concept.information){const mapping=mappingByInfo.get(info.id);if(!mapping)continue;
     if(mapping.relationIds.some(id=>edge.relationIds.includes(id)&&model.relations.some(rel=>rel.id===id&&(rel.fromConceptId===conceptId||rel.toConceptId===conceptId))))
      result.push({from:edge.from,to:edge.to,owner,informationId:info.id});
    }
   }
  }
  return result;
 };
 const tables:Record<string,ConceptCard>=Object.fromEntries(model.concepts.map(concept=>[concept.id,{
  name:concept.name,note:concept.description,fields:concept.information.map(item=>field(concept.id,item.name+(item.responsibleSubsystemId&&item.responsibleSubsystemId!==concept.subsystemId?'（担当：'+model.subsystems.find(s=>s.id===item.responsibleSubsystemId)!.name+'）':''),item.id))
 }]));
 const edges=model.relations.map(relation=>[relation.fromConceptId,relation.toConceptId,relation.fromLabel,relation.toLabel,relation.kind]);
 const groups:ReviewGroup[]=model.reviewGroups.map(group=>({id:group.id,name:group.title,purpose:group.description,activities:group.relatedActivityIds,
  concepts:Object.fromEntries(group.graph.nodes.map(node=>[node.conceptId,{name:node.name,note:node.description,
   fields:node.fields.map(name=>field(node.conceptId,name)),sources:node.sources,sourceActivities:node.sourceActivityIds}])),
  relations:group.graph.edges.map(edge=>[edge.fromConceptId,edge.toConceptId,edge.fromLabel,edge.toLabel,edge.kind])}));
 const findGroup=(id:string|undefined|null)=>groups.find(group=>group.id===id);
 const projection=(views:SubsystemViews,source:Record<string,ConceptCard>)=>{
  const cards:Record<string,ConceptCard>=Object.fromEntries(views.nodes.map(node=>[node.id,{...source[node.conceptId],name:node.name,note:node.description,sources:node.sources,
   conceptId:node.conceptId,subsystemId:node.subsystemId,fields:node.fields.map(item=>field(node.conceptId,item.name,item.informationId))}]));
  const regions=model.subsystems.filter(item=>views.nodes.some(node=>node.subsystemId===item.id)).map(item=>({id:item.id,name:item.name}));
  const handoffs=views.handoffIds.map(id=>model.handoffs.find(item=>item.id===id)!).map(item=>({id:item.id,from:item.fromSubsystemId,to:item.toSubsystemId,label:item.information,returning:item.flowDirection==='return'}));
  return {ids:views.nodes.map(node=>node.id),tables:cards,edges:views.edges.map(edge=>[edge.fromViewId,edge.toViewId,edge.fromLabel,edge.toLabel,edge.kind]),regions,handoffs,
   fieldLinks:links(views.edges.map(edge=>({from:edge.fromViewId,to:edge.toViewId,relationIds:edge.relationIds})),cards)};
 };
 const fieldLinks=links(model.relations.map(relation=>({from:relation.fromConceptId,to:relation.toConceptId,relationIds:[relation.id]})),tables);
 const graph=(id:string)=>{const group=findGroup(id);if(!group)throw Error('Unknown review group: '+id);
  const authored=model.reviewGroups.find(item=>item.id===id)!,views=authored.graph.subsystemViews;
  if(views)return projection(views,group.concepts);
  const ids=Object.keys(tables).filter(key=>Object.hasOwn(group.concepts,key));
  return {ids,tables:group.concepts,edges:group.relations.filter(([from,to])=>ids.includes(from)&&ids.includes(to)),regions:[],handoffs:[],
   fieldLinks:links(authored.graph.edges.map(edge=>({from:edge.fromConceptId,to:edge.toConceptId,relationIds:edge.relationIds})),group.concepts)};};
 const overviewGraph=()=>model.presentation.subsystemViews?projection(model.presentation.subsystemViews,tables):{ids:Object.keys(tables),tables,edges,regions:[],handoffs:[],fieldLinks};
 return {tables,edges,groups,findGroup,graph,overviewGraph,fieldLinks};
}
