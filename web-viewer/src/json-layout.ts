import type {Design,Graph} from './graph';
import type {Point} from './session';
import {initialPositions} from './layout.ts';
import {matrixPlan} from './matrix-layout.ts';

// Match the MD reader's Unicode codepoint ordering, including supplementary characters.
const compare=(a:string,b:string)=>{const x=Array.from(a),y=Array.from(b);for(let i=0;i<Math.min(x.length,y.length);i++){const d=x[i].codePointAt(0)!-y[i].codePointAt(0)!;if(d)return d;}return x.length-y.length;};
/** Display ordering only: persistent IDs and source JSON are never rewritten. */
export function canonicalJSONGraph(graph:Graph):Graph{
 const names=new Map(graph.nodes.map(n=>[n.id,n.name]));
 return {...graph,nodes:[...graph.nodes].sort((a,b)=>compare(a.name,b.name)),relations:[...graph.relations].sort((a,b)=>{
  for(const key of ['kind','from','to','label'] as const){const d=compare(key==='from'||key==='to'?names.get(a[key])!:a[key],key==='from'||key==='to'?names.get(b[key])!:b[key]);if(d)return d;}return 0;
 })};
}
/** The unchanged name-ID planners receive exactly the MD reader's input identity.
 * Only their coordinate-map keys are translated back to persistent UUIDs.
 * Activity reading hints retain their existing document-order semantics.
 */
function input(design:Design,activity?:string){
 const graph=canonicalJSONGraph(design.graph),names=new Map(graph.nodes.map(n=>[n.id,n.name])),ids=new Map(graph.nodes.map(n=>[n.name,n.id]));
 return {graph:{...graph,nodes:graph.nodes.map(n=>({...n,id:n.name})),relations:graph.relations.map(r=>({...r,from:names.get(r.from)!,to:names.get(r.to)!}))},order:design.activityOrder?.map(id=>names.get(id)!),activity:activity===undefined?undefined:names.get(activity),restore:(p:Record<string,Point>):Record<string,Point>=>Object.assign(Object.create(null),Object.fromEntries(Object.entries(p).map(([id,point])=>[ids.get(id)!,point])))};
}
export function initialPositionsForDesign(design:Design,activity?:string){const i=input(design,activity);return i.restore(initialPositions(i.graph,i.order,i.activity));}
export function matrixPlanForDesign(design:Design,activity?:string){const i=input(design,activity),plan=matrixPlan(i.graph,i.order,i.activity);return {...plan,positions:i.restore(plan.positions),cells:i.restore(plan.cells)};}
