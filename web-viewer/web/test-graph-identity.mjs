import assert from 'node:assert/strict';
import {routeEdge} from '../src/routing.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {cameraZoom,initialCamera,ZOOM_FACTOR} from '../src/graph-camera.ts';
import {graphFocus} from '../src/graph-focus.ts';
import {routeER} from '../src/concept-routing.js';
const nodes=[{id:'parent',x:40,y:40,width:260,height:68},{id:'child',x:104,y:220,width:260,height:68}];
for(const returning of [false,true]){
 const r=routeEdge({from:'parent',to:'child',nodes,matrix:{returning,captionLane:0}});
 assert.deepEqual(r.points[0],returning?[300,74]:[72.5,108]);assert.deepEqual(r.points.at(-1),returning?[364,254]:[104,254]);assert.equal(r.collisions,0);
}
const explicit=routeEdge({from:'parent',to:'child',nodes,matrix:{returning:false,captionLane:0},ports:{from:.2,to:.7}});assert.deepEqual(explicit.points[0],[92,108]);assert.deepEqual(explicit.points.at(-1),[104,267.6]);
const boxes=new Map([['p',{x:40,y:40,w:220,h:170}],['a',{x:220,y:300,w:220,h:145}],['b',{x:400,y:520,w:220,h:145}]]),relations=[['p','a','1','1..N','down'],['p','b','1','0..N','reference']];
const er=routeER(boxes,relations);assert.equal(er.routes.length,2);assert.notDeepEqual(er.routes[0].ports[0].p,er.routes[1].ports[0].p,'independent source connectors remain independent');for(const r of er.routes){assert.equal(r.ports[0].side,'bottom');assert.equal(r.ports[1].side,'left');assert.equal(r.fromCount,'1');assert.equal(r.toCount,relations[r.id][3]);}
const input={zoom:1,scroll:[120,340]};assert.deepEqual(cameraZoom(input,ZOOM_FACTOR),{zoom:1.2,scroll:[120,340]});assert.deepEqual(input,{zoom:1,scroll:[120,340]});assert.equal(cameraZoom(input,100).zoom,2.5);assert.equal(cameraZoom(input,.001).zoom,.25);assert.deepEqual(initialCamera(),{zoom:1,scroll:[0,0]});
const model={version:1,nodes:['a','b','c'].map(id=>({id,name:id,type:'business',scope:true})),relations:[{kind:'input',from:'a',to:'b',label:''},{kind:'business-exception',from:'b',to:'c',label:''}]};const plan=matrixPlan(model);assert.equal(plan.wires[0].returning,false);assert.equal(plan.wires[1].returning,true,'forward exceptions retain explicit exception route');
const focus=graphFocus(model.relations,'a');assert.equal(focus.nodeClasses('b'),' review-neighbor');assert.equal(focus.nodeClasses('c'),' muted');assert.equal(focus.related(model.relations[1]),false,'no recursive highlighting');
console.log('PASS graph identity: business ports, explicit independent ports/cardinalities, forward exceptions, shared zoom/reset and one-hop focus');
