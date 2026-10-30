// Test-only contract boundary; no browser, source parsing or test side effects.
import assert from 'node:assert/strict';
import {activityDesign} from '../src/activities.ts';
import {reconcile} from '../src/session.ts';
import {matrixPlanForDesign} from '../src/json-layout.ts';
import {RouteCache} from '../src/route-cache.ts';
export function layoutGeometry(design,activity){
 const d=activityDesign(design,activity),t=reconcile({key:'layout',name:'layout',design:d,positions:{},scroll:[0,0],zoom:1,activity},d);
 const plan=matrixPlanForDesign(d),names=new Map(d.graph.nodes.map(n=>[n.id,n.name]));
 const boxes=d.graph.nodes.map(n=>({id:n.id,x:t.positions[n.id][0],y:t.positions[n.id][1],width:260,height:68}));
 const routes=new RouteCache().update(t,d,boxes,d.graph.relations,plan.wires);
 const nodes=boxes.map(n=>[names.get(n.id),n.x,n.y,n.width,n.height]).sort();
 const gaps=nodes.flatMap((a,i)=>nodes.slice(i+1).map(b=>[a[0],b[0],b[1]-a[1],b[2]-a[2]]));
 const edges=d.graph.relations.map((r,i)=>({kind:r.kind,from:names.get(r.from),to:names.get(r.to),label:r.label,route:routes[i]})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 return {nodes,gaps,edges,boxes,routes,design:d};
}
export function namedGeometry(design,activity){const {nodes,gaps,edges}=layoutGeometry(design,activity);return {nodes,gaps,edges};}
// Rendering boundary: actual DOM attributes must match the shared world model.
// Independent arithmetic/port oracles remain in test-shared-layout/source-captions.
export function assertRenderedGeometry(design,activity,dom){
 const expected=layoutGeometry(design,activity);
 assert.deepEqual(dom.nodes.map(n=>[n.id,n.x,n.y]).sort(),expected.boxes.map(n=>[n.id,n.x,n.y]).sort(),'rendered world coordinates');
 assert.deepEqual(dom.edges.map(e=>e.index).sort((a,b)=>a-b),expected.routes.map((_,i)=>i),'every semantic edge is rendered');
 for(const edge of dom.edges){const route=expected.routes[edge.index],r=expected.design.graph.relations[edge.index];
  assert.equal(edge.path,route.path,'rendered SVG endpoints and bends');
  assert.deepEqual(edge.label,[route.label[0]-Math.max(30,r.label.length*12)/2,route.label[1]],'rendered caption anchor');
  assert.equal(edge.text,r.label,'rendered caption text');
 }
}
