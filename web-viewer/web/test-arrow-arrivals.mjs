import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {parseDesign} from '../src/graph.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {activityDesign} from '../src/activities.ts';
import {RouteCache} from '../src/route-cache.ts';
import {routeEdge} from '../src/routing.ts';
// Measure the SVG's final straight command independently of route.points.
export function arrivalRun(path){const commands=[...path.matchAll(/([MLQ])([^MLQ]+)/g)].map(m=>({kind:m[1],p:m[2].trim().split(/[ ,]+/).map(Number)}));assert.equal(commands.at(-1).kind,'L');const end=commands.at(-1).p,previous=commands.at(-2).p.slice(-2);assert.equal(end[1],previous[1]);return Math.abs(end[0]-previous[0]);}
const fixture=readFileSync('../tools/fixtures/arrow-arrivals/purchase-request.md','utf8'),d=parseDesign(fixture);
let checked=0;
for(const focus of [undefined,...d.activityOrder]){
 const design=focus?activityDesign(d,focus):d;
 const plan=matrixPlan(design.graph,design.activityOrder,focus);
 const boxes=design.graph.nodes.map(n=>({id:n.id,x:plan.positions[n.id][0],y:plan.positions[n.id][1],width:260,height:68}));
 const routes=new RouteCache().update({},design,boxes,design.graph.relations,plan.wires);
 for(const [i,r] of routes.entries())if(plan.wires[i].returning){assert.ok(arrivalRun(r.path)>=24-1e-7,'return head has a full straight approach');assert.equal(r.collisions,0);checked++;}
}
const box=(id,x,y)=>({id,x,y,width:260,height:68});
const nodes=[box('source',40,40),box('target',296,376)],options={from:'source',to:'target',nodes,kind:'business-exception',matrix:{returning:true,captionLane:0}};
assert.equal(arrivalRun(routeEdge(options).path),24,'shortest clear right arrival reserves 24 units after rounding');
const green=routeEdge({from:'source',to:'target',nodes:[box('source',40,40),box('target',104,152)],kind:'output',matrix:{returning:false,captionLane:0}});assert.ok(arrivalRun(routeEdge(options).path)>=arrivalRun(green.path),'yellow at least as long as the reference green staircase arrival');
const moved=[...nodes,box('obstacle',570,150)];const routed=routeEdge({...options,nodes:moved});assert.ok(arrivalRun(routed.path)>=24);assert.equal(routed.collisions,0);
// A short retained gap must not win just because its length score is smaller.
const near={...options,nodes:[box('source',40,40),box('target',45,50)],matrix:undefined};assert.ok(arrivalRun(routeEdge(near).path)>=24);
if(process.env.ARROW_ROUTING_BASELINE_PATH){const old=(await import(pathToFileURL(process.env.ARROW_ROUTING_BASELINE_PATH).href)).routeEdge;assert.equal(arrivalRun(old(options).path),14);assert.throws(()=>assert.ok(arrivalRun(old(options).path)>=24));}
console.log(JSON.stringify({arrowArrival:'passed',matrixReturns:checked,minimumStraight:24,referenceGreen:arrivalRun(green.path),selectedMarkerLength:7*3.2,manualObstacle:true,shortSavedGap:true}));
