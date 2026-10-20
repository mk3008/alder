// Generated from Alder Viewer 7af581e7319e9ca1fd34e8e0e22e0f314bdc2000; algorithm unchanged.
                                   
const compare=(a       ,b       )=>a<b?-1:a>b?1:0;
/** Coordinate-free SCC analysis. Only actual cyclic components use the reading hint. */
export function dependencyOrder(graph      ,activityOrder                   ){
  const nodes=[...graph.nodes].sort((a,b)=>compare(a.id,b.id)),count=nodes.length;
  const index=new Map(nodes.map((n,i)=>[n.id,i])),out=nodes.map(()=>new Set        ()),incoming=nodes.map(()=>new Set        ());
  const edges=graph.relations.map((r,i)=>({i,r,a:index.get(r.from),b:index.get(r.to)}));
  for(const {r,a,b} of edges)if(a!==undefined&&b!==undefined&&(r.kind==='input'||r.kind==='output')){out[a].add(b);incoming[b].add(a);}
  const next=out.map(s=>[...s].sort((a,b)=>a-b)),previous=incoming.map(s=>[...s].sort((a,b)=>a-b));
  // Iterative Kosaraju: long chains must not exhaust the JavaScript call stack.
  const seen=new Set        (),finish         =[];
  for(let root=0;root<count;root++){
    if(seen.has(root))continue;
    const stack                  =[[root,0]];seen.add(root);
    while(stack.length){const frame=stack[stack.length-1],n=frame[0];
      if(frame[1]<next[n].length){const other=next[n][frame[1]++];if(!seen.has(other)){seen.add(other);stack.push([other,0]);}}
      else{stack.pop();finish.push(n);}
    }
  }
  const component=nodes.map(()=>-1);let components=0;
  for(const root of finish.reverse())if(component[root]<0){
    const stack=[root];component[root]=components;
    while(stack.length){const n=stack.pop() ;for(const other of previous[n])if(component[other]<0){component[other]=components;stack.push(other);}}
    components++;
  }
  const activities=nodes.filter(n=>n.type==='business'),hint=new Map(Array.isArray(activityOrder)?activityOrder.map((id,i)=>[id,i]):[]);
  const validHint=hint.size>0&&hint.size===activityOrder?.length&&hint.size===activities.length&&activities.every(n=>hint.has(n.id));
  const activityRank=new Map(activities.map((n,i)=>[n.id,validHint?hint.get(n.id) :i]));
  const cycleOrder=nodes.map(n=>n.type==='business'?2*activityRank.get(n.id) :Infinity);
  for(const {r,a,b} of edges)if(r.kind==='output'&&a!==undefined&&b!==undefined&&component[a]===component[b]){
    const writer=activityRank.get(nodes[a].id);if(writer!==undefined)cycleOrder[b]=Math.min(cycleOrder[b],2*writer+1);
  }
  const forwardRelations         =[],feedbackRelations         =[],exceptionRelations         =[];
  const forward=nodes.map(()=>new Set        ()),back=nodes.map(()=>new Set        ());
  for(const {i,r,a,b} of edges){
    if(r.kind!=='input'&&r.kind!=='output'){exceptionRelations.push(i);continue;}
    if(a===undefined||b===undefined)continue;
    if(component[a]===component[b]&&cycleOrder[a]>=cycleOrder[b]){feedbackRelations.push(i);continue;}
    forwardRelations.push(i);forward[a].add(b);back[b].add(a);
  }
  const children=forward.map(s=>[...s].sort((a,b)=>a-b)),parents=back.map(s=>[...s].sort((a,b)=>a-b));
  return {nodes,previous,children,parents,activityRank,component,forwardRelations,feedbackRelations,exceptionRelations};
}
