import type {Design} from './graph';
const projections=new WeakMap<Design,Map<string,Design>>();
/** Object details use the same graph pipeline after selecting incident relations. */
export function objectDesign(design:Design,object:string):Design{
 const node=design.graph.nodes.find(n=>n.id===object&&n.type==='object');if(!node)throw Error('Unknown Object: '+object);
 let cache=projections.get(design);if(!cache){cache=new Map();projections.set(design,cache);}const key=object,cached=cache.get(key);if(cached)return cached;
 const objects=new Set(design.graph.nodes.filter(n=>n.type==='object').map(n=>n.id)),activities=new Set(design.graph.nodes.filter(n=>n.type==='business').map(n=>n.id));
 const relations=design.graph.relations.filter(r=>(r.kind==='input'&&r.from===object&&activities.has(r.to))||(r.kind==='output'&&r.to===object&&activities.has(r.from))||(r.kind==='object-exception'&&((r.from===object&&objects.has(r.to))||(r.to===object&&objects.has(r.from)))));
 const ids=new Set([object,...relations.flatMap(r=>[r.from,r.to])]);
 const result={...design,graph:{...design.graph,nodes:design.graph.nodes.filter(n=>ids.has(n.id)),relations},activityOrder:(design.activityOrder??design.graph.nodes.filter(n=>n.type==='business').map(n=>n.id)).filter(id=>ids.has(id))};cache.set(key,result);return result;
}
