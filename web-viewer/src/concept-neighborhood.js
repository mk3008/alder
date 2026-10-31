/** One hop over the explicitly declared relations. Never expand neighbors recursively. */
export function conceptNeighborhood(ids,edges,focus){
 if(!ids.includes(focus))throw new Error('Unknown concept');
 const incident=edges.filter(([from,to])=>from===focus||to===focus),visible=new Set([focus]);
 for(const [from,to] of incident){visible.add(from);visible.add(to);}
 return {ids:ids.filter(id=>visible.has(id)),edges:edges.filter(([from,to])=>visible.has(from)&&visible.has(to))};
}
