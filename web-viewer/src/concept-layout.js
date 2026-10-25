import {routeER} from './concept-routing.js';
import {matrixPlan} from './matrix-layout.ts';

/** Compute the entire graph before filtering either view.
 * Reserve room for both endpoint counts even in a single-relation view.
 */
export function initialConceptPositions(ids,edges,sizes){
 const graph={version:1,nodes:ids.map(id=>({id,type:'business',name:id,scope:true})),relations:edges.map(([from,to])=>({kind:'input',from,to,label:''}))};
 const plan=matrixPlan(graph,ids),ordered=ids.slice().sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]);
 const ports=Math.max(1,...ids.map(id=>edges.filter(([a,b])=>a===id||b===id).length));
 // A 64px step left only 42px between an outlet and the next card: the
 // 1..N label's background covered the vertical departure in a local view.
 const widestCount=Math.max(0,...edges.flatMap(([, ,from,to])=>[from.length,to.length]).map(n=>n*8+10));
 const step=Math.max(96,64+36*Math.max(0,ports-1),22+24+widestCount/2+8);
 const positions={};let y=40;
 for(const id of ordered){positions[id]={x:40+step*plan.cells[id][0],y};y+=sizes.get(id).h+44;}
 return positions;
}

/** A local view is a crop of the whole graph, never a second layout/router.
 * Translation only removes empty space before the first visible card.
 * Per-view manual positions remain local, converted back before routing.
 */
export function conceptDiagram(ids,edges,sizes,visible=ids,overrides=new Map()){
 const initial=initialConceptPositions(ids,edges,sizes);
 const offset=[40-Math.min(...visible.map(id=>initial[id].x)),40-Math.min(...visible.map(id=>initial[id].y))];
 const allBoxes=new Map(ids.map(id=>{const saved=overrides.get(id),p=saved?{x:saved.x-offset[0],y:saved.y-offset[1]}:initial[id];return[id,{...p,...sizes.get(id)}];}));
 const whole=routeER(allBoxes,edges),routes=whole.routes.filter(r=>visible.includes(r.from)&&visible.includes(r.to)),included=new Set(routes.map(r=>r.id));
 const boxes=new Map(visible.map(id=>{const b=allBoxes.get(id);return[id,{...b,x:b.x+offset[0],y:b.y+offset[1]}];}));
 const labels=whole.labels.filter(l=>included.has(l.edge));
 const points=routes.flatMap(r=>r.points),width=Math.max(0,...points.map(p=>p.x+offset[0]+35),...labels.map(l=>l.left+l.w+offset[0]+24)),height=Math.max(0,...points.map(p=>p.y+offset[1]+35),...labels.map(l=>l.top+l.h+offset[1]+24));
 return {boxes,offset,routing:{routes,labels,width,height}};
}
