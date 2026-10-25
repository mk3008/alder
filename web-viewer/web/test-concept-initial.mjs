import assert from 'node:assert/strict';
import {tables,edges} from '../src/concept-fixture.ts';
import {conceptNeighborhood} from '../public/concept-preview/neighborhood.js';
import {conceptDiagram} from '../src/concept-layout.js';
import {routeER} from '../src/concept-routing.js';
// Independent segment/slab oracle includes the router's sampled rounded bends.
function crosses(a,b,r,padding=3){
 let low=0,high=1;
 for(const axis of ['x','y']){const min=(axis==='x'?r.left:r.top)-padding,max=min+(axis==='x'?r.w:r.h)+padding*2,delta=b[axis]-a[axis];if(!delta){if(a[axis]<min||a[axis]>max)return false;}else{const t1=(min-a[axis])/delta,t2=(max-a[axis])/delta;low=Math.max(low,Math.min(t1,t2));high=Math.min(high,Math.max(t1,t2));if(low>high)return false;}}
 return true;
}
const ids=Object.keys(tables),sizes=new Map(ids.map(id=>[id,{w:Math.max(220,...tables[id].fields.map(([,name])=>name.length*14+24)),h:44+tables[id].fields.length*25}]));
for(const focus of [null,...ids]){
 const view=focus?conceptNeighborhood(ids,edges,focus):{ids,edges};
 // A selects the graph. B has no access to the original graph or focus.
 const selectedSizes=new Map(view.ids.map(id=>[id,sizes.get(id)]));
 const {boxes,routing}=conceptDiagram(view.ids,view.edges,selectedSizes);
 const standalone=conceptDiagram([...view.ids],structuredClone(view.edges),selectedSizes);
 assert.deepEqual({boxes,routing},standalone,'the same selected graph renders identically as a standalone overview');
 assert.deepEqual([...boxes.keys()],view.ids,'B contains only A-selected cards');
 assert.equal(routing.routes.length,view.edges.length);
 for(const route of routing.routes){assert(!route.unrouted,focus+' routes without fallback');assert.equal(route.points[0].y,boxes.get(route.from).y+boxes.get(route.from).h);assert.equal(route.points.at(-1).x,boxes.get(route.to).x);}
 for(const label of routing.labels){
  for(const route of routing.routes)assert(!route.segments.some(({a,b})=>crosses(a,b,label)),`${focus||'overview'}: ${label.table} ${label.count} must not cover ${route.from}->${route.to}`);
  for(const box of boxes.values())assert(!(label.left<box.x+box.w&&label.left+label.w>box.x&&label.top<box.y+box.h&&label.top+label.h>box.y),focus+' count outside cards');
 }
}
console.log('PASS concept initial layout: overview and all six one-hop views, complete bottom/left wires and counts clear of every routed segment/card');

// Retained 64px positions from before the fix must also keep the entire wire
// clear: the target label used to cover x=62 at y=238..256.
const tight=new Map([['preparation',{x:40,y:40,w:220,h:119}],['request',{x:104,y:203,w:220,h:169}]]);
const retained=routeER(tight,[['preparation','request','0..1','1..N','down']]);
for(const label of retained.labels){assert(!label.conflict);for(const route of retained.routes)assert(!route.segments.some(({a,b})=>crosses(a,b,label)),'retained narrow layout labels clear the complete route');}
