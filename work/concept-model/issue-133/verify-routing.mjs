import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {routeER,sharedRun} from './er-routing.js';
const code=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').split('const tables=')[1].split('const NS=')[0];
const {tables,edges,compactInitial}=vm.runInNewContext('const tables='+code+';({tables,edges,compactInitial})');
const sizes=new Map(Object.entries(tables).map(([id,t])=>[id,{w:Math.max(220,...t.fields.map(([,n])=>n.length*14+24)),h:44+t.fields.length*25}]));
const initial=compactInitial(sizes).overview,results=[];
const staircase=routeER(new Map(Object.entries(initial).map(([id,p])=>[id,{...p,...sizes.get(id)}])),edges);
const branches=staircase.routes.filter(e=>e.from==='request');
assert(branches.find(e=>e.to==='receipt').ports[0].p.x<branches.find(e=>e.to==='version').ports[0].p.x,'long link must leave left of the nearer link');
const incoming=staircase.routes.filter(e=>e.to==='line');
assert.equal(incoming.find(e=>e.from==='item').ports[0].side,'bottom','reference starts down');
assert.equal(incoming.find(e=>e.from==='item').ports[1].side,'left','reference enters from the left');
assert.equal(incoming.find(e=>e.from==='receipt').ports[1].side,'left');
function crosses(a,b){const v=a.a.x===a.b.x?a:b,h=v===a?b:a;return v.a.x===v.b.x&&h.a.y===h.b.y&&v.a.x>=Math.min(h.a.x,h.b.x)&&v.a.x<=Math.max(h.a.x,h.b.x)&&h.a.y>=Math.min(v.a.y,v.b.y)&&h.a.y<=Math.max(v.a.y,v.b.y);}
let crossings=0;for(let i=0;i<staircase.routes.length;i++)for(let j=i+1;j<staircase.routes.length;j++)for(const a of staircase.routes[i].segments)for(const b of staircase.routes[j].segments)if(crosses(a,b))crossings++;
// The requested down/right reference replaces the previous right/right
// zero-crossing route. Keep independent relations at the geometric crossing.
const reference=staircase.routes.find(e=>e.from==='item'&&e.to==='line');
assert.equal(reference.points.length,3,'reference follows down then right without an outer-right detour');
assert.equal(reference.points[0].x,reference.points[1].x);
assert(reference.points[1].y>reference.points[0].y);
assert.equal(reference.points[1].y,reference.points[2].y);
assert(reference.points[2].x>reference.points[1].x);
const multi=initial.version.x-initial.request.x;
assert.equal(multi,116,'two outlets reserve an extra 36px');
edges.push(['request','item','1','1..N','down']);
const three=compactInitial(sizes).overview;
assert.equal(three.version.x-three.request.x,multi+36,'three outlets reserve another 36px');
edges.pop();
const near=staircase.routes.find(e=>e.from==='request'&&e.to==='version');
assert.equal(near.points.length,3,'multiple outlets must not squeeze the nearby 1..N into a fold');
assert(near.points[2].x-near.points[1].x>=58,'leave a full horizontal count landing');
assert.equal(crossings,1,'down/right reference crosses one independent relation without merging');
for(const e of staircase.routes){assert(e.points);for(let i=1;i<e.points.length;i++)assert(e.points[i].x>=e.points[i-1].x||e.to==='receipt','near staircase links must not fold left');}

assert(staircase.routes.every(e=>!e.unrouted));
for(const [dx,y] of [[0,388],[30,388],[60,388],[0,730],[0,850],[-100,850],[120,850]]){
 const positions={...initial,version:{...initial.version,x:184},item:{...initial.item,x:264},receipt:{x:500+dx,y},line:{x:500+dx+80,y:y+sizes.get('receipt').h+36}};
 const boxes=new Map(Object.entries(positions).map(([id,p])=>[id,{...p,...sizes.get(id)}])),r=routeER(boxes,edges);
 assert.equal(r.routes.length,6);assert.equal(r.labels.length,12);assert(r.routes.every(e=>!e.unrouted),'missing route '+dx+','+y);
 const branches=r.routes.filter(e=>e.from==='request');assert.equal(branches.length,2);assert(branches.every(e=>e.ports[0].side==='bottom'));assert.notDeepEqual(branches[0].ports[0].p,branches[1].ports[0].p,'outlets must not merge');
 const detour=r.routes.find(e=>e.to==='receipt');assert.equal(detour.ports[1].side,'left');assert(detour.points.some(p=>p.x<boxes.get('version').x&&p.y>=boxes.get('version').y),'route follows left corridor');
 for(let i=0;i<r.routes.length;i++)for(let j=i+1;j<r.routes.length;j++)for(const a of r.routes[i].segments)for(const b of r.routes[j].segments)assert(!sharedRun(a.a,a.b,b.a,b.b),'merged relation runs');
 for(let i=0;i<r.labels.length;i++)for(let j=i+1;j<r.labels.length;j++){const a=r.labels[i],b=r.labels[j];assert(!(a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top),'count overlap');}
 results.push({receipt:positions.receipt,outlets:branches.map(e=>e.ports[0].p),edges:r.routes.length,counts:r.labels.length});
}
console.log(JSON.stringify({status:'passed',cases:results},null,2));
