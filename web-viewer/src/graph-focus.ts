/** Shared presentation policy for graph adjacency; never infer business relations. */
export type Connection={from:string;to:string};
export function graphFocus(relations:readonly Connection[],selected?:string){
 const neighbors=new Set<string>(selected?[selected]:[]);
 const related=(edge:Connection)=>!!selected&&(edge.from===selected||edge.to===selected);
 if(selected)for(const edge of relations)if(related(edge)){neighbors.add(edge.from);neighbors.add(edge.to);}
 return {
  related,
  muted:(edge:Connection)=>!!selected&&!related(edge),
  nodeClasses:(id:string)=>id===selected?' selected':!selected?'':neighbors.has(id)?' review-neighbor':' muted',
  labelClasses:(edges:readonly Connection[])=>!selected?'':edges.some(related)?' review-related':' muted'
 };
}
