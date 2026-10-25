import {routeER} from './concept-routing.js';
import {matrixPlan} from './matrix-layout.ts';

/** Lay out the selected graph without overview/detail knowledge.
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

/** B: layout and route only the graph selected upstream by A.
 * No focus, hidden source graph, or overview/detail mode enters this function.
 */
export function conceptDiagram(ids,edges,sizes,overrides=new Map()){
 const initial=initialConceptPositions(ids,edges,sizes);
 const boxes=new Map(ids.map(id=>[id,{...(overrides.get(id)||initial[id]),...sizes.get(id)}]));
 return {boxes,routing:routeER(boxes,edges)};
}
