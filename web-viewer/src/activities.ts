import type {Design} from './graph';
const projections=new WeakMap<Design,Map<string,Design>>();
/** Preserve the source graph and Object identity; a detail is exactly one hop. */
export function activityDesign(design:Design,activity?:string):Design{
 if(activity===undefined)return design;
 const node=design.graph.nodes.find(n=>n.id===activity&&n.type==='business');if(!node)throw Error('Unknown Activity: '+activity);
 let cache=projections.get(design);if(!cache){cache=new Map();projections.set(design,cache);}const cached=cache.get(activity);if(cached)return cached;
 const objects=new Set(design.graph.nodes.filter(n=>n.type==='object').map(n=>n.id));
 const relations=design.graph.relations.filter(r=>(r.kind==='input'&&r.to===activity&&objects.has(r.from))||(r.kind==='output'&&r.from===activity&&objects.has(r.to)));
 const ids=new Set([activity,...relations.flatMap(r=>[r.from,r.to])]);
 const result={...design,graph:{...design.graph,nodes:design.graph.nodes.filter(n=>ids.has(n.id)),relations},activityOrder:[activity]};cache.set(activity,result);return result;
}
