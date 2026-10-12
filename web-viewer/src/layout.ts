import type {Graph} from './graph';
import type {Point} from './session';
const COLUMN_COUNT=4, STEP_X=360, STEP_Y=180, MARGIN=40;
const MAX_PASSES=10, MAX_SWAPS=50_000, MAX_NEIGHBOR_VISITS=250_000;
const DOCUMENT_ROW_WEIGHT=2;

/**
 * A deterministic, overlap-free initial grid which puts connected cards nearby.
 * Activity appearance order may guide its vertical band, while connected cards
 * remain nearby. This is a soft reading hint, never an execution-order constraint.
 * Graph-only input keeps the existing layout; saved coordinates are handled by
 * reconcile and never passed through this initial-placement optimizer.
 * Equal-score swaps are rejected. The work budgets are counts, not time limits.
 * O(n + e + min(10*n*e, MAX_NEIGHBOR_VISITS) + min(10*n*n, MAX_SWAPS)).
 */
export function initialPositions(graph:Graph,activityOrder?:readonly string[]):Record<string,Point>{
  const result:Record<string,Point>=Object.create(null);
  const count=graph.nodes.length,index=new Map(graph.nodes.map((n,i)=>[n.id,i]));
  const slots:Point[]=graph.nodes.map((_,i)=>[MARGIN+i%COLUMN_COUNT*STEP_X,MARGIN+Math.floor(i/COLUMN_COUNT)*STEP_Y]);
  const activities=graph.nodes.filter(n=>n.type==='business');
  const ranks=new Map(Array.isArray(activityOrder)?activityOrder.map((id,i)=>[id,i]):[]);
  const hasOrder=ranks.size>0&&ranks.size===activityOrder?.length&&ranks.size===activities.length&&activities.every(n=>ranks.has(n.id));
  const rank=graph.nodes.map(n=>hasOrder&&n.type==='business'?ranks.get(n.id)!:-1);
  // Seed Activity slots in document order without making Object list order a hint.
  let nextActivity=0;
  const atSlot=graph.nodes.map((n,i)=>hasOrder&&n.type==='business'?index.get(activityOrder![nextActivity++])!:i);
  const slotOf=Array<number>(count);atSlot.forEach((node,slot)=>slotOf[node]=slot);
  const lastRow=Math.floor((count-1)/COLUMN_COUNT);
  const readingCost=(node:number,slot:number)=>rank[node]<0?0:
    Math.abs(Math.floor(slot/COLUMN_COUNT)-rank[node]*lastRow/Math.max(1,activities.length-1))*STEP_Y*DOCUMENT_ROW_WEIGHT;
  const neighbors=graph.nodes.map(()=>new Set<number>());
  for(const edge of graph.relations){
    const a=index.get(edge.from),b=index.get(edge.to);
    if(a===undefined||b===undefined||a===b)continue;
    neighbors[a].add(b);neighbors[b].add(a);
  }
  if(neighbors.every(list=>list.size===0)){
    graph.nodes.forEach((node,i)=>result[node.id]=[...slots[slotOf[i]]]);
    return result;
  }
  const distance=(a:number,b:number)=>Math.hypot(slots[a][0]-slots[b][0],slots[a][1]-slots[b][1]);
  let swaps=0,visits=0;
  optimize:for(let pass=0;pass<MAX_PASSES;pass++){
    let changed=false;
    for(let a=0;a<count;a++)for(let b=a+1;b<count;b++){
      if(++swaps>MAX_SWAPS)break optimize;
      const na=atSlot[a],nb=atSlot[b];
      if(visits+neighbors[na].size+neighbors[nb].size>MAX_NEIGHBOR_VISITS)break optimize;
      let delta=readingCost(na,b)+readingCost(nb,a)-readingCost(na,a)-readingCost(nb,b);
      for(const other of neighbors[na]){visits++;if(other!==nb)delta+=distance(b,slotOf[other])-distance(a,slotOf[other]);}
      for(const other of neighbors[nb]){visits++;if(other!==na)delta+=distance(a,slotOf[other])-distance(b,slotOf[other]);}
      if(delta < -1e-6){atSlot[a]=nb;atSlot[b]=na;slotOf[na]=b;slotOf[nb]=a;changed=true;}
    }
    if(!changed)break;
  }
  // Reflect the whole result toward its net normal flow; paired directions
  // cancel. Exception feedback must not determine the overall orientation.
  let dx=0,dy=0;
  for(const edge of graph.relations){
    if(edge.kind.endsWith('exception'))continue;
    const a=index.get(edge.from),b=index.get(edge.to);
    if(a===undefined||b===undefined)continue;
    dx+=slots[slotOf[b]][0]-slots[slotOf[a]][0];
    dy+=slots[slotOf[b]][1]-slots[slotOf[a]][1];
  }
  const maxX=MARGIN+Math.min(COLUMN_COUNT-1,count-1)*STEP_X;
  const maxY=MARGIN+Math.floor((count-1)/COLUMN_COUNT)*STEP_Y;
  graph.nodes.forEach((node,i)=>{
    const [x,y]=slots[slotOf[i]];
    // Reflect only graph-only layouts. Reading order must keep its top origin.
    result[node.id]=[!hasOrder&&dx<0?MARGIN+maxX-x:x,!hasOrder&&dy<0?MARGIN+maxY-y:y];
  });
  return result;
}
