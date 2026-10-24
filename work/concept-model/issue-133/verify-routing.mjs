import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
import {routeER,sharedRun} from './er-routing.js';
const code=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').split('const tables=')[1].split('const NS=')[0];
const {tables,edges,compactInitial}=vm.runInNewContext('const tables='+code+';({tables,edges,compactInitial})');
const sizes=new Map(Object.entries(tables).map(([id,t])=>[id,{w:Math.max(220,...t.fields.map(([,n])=>n.length*14+24)),h:44+t.fields.length*25}]));
const initial=compactInitial(sizes).overview,results=[];
for(const [dx,y] of [[0,388],[30,388],[60,388],[0,730],[0,850],[-100,850],[120,850]]){
 const positions={...initial,receipt:{x:initial.receipt.x+dx,y},line:{x:initial.receipt.x+dx+80,y:y+sizes.get('receipt').h+36}};
 const boxes=new Map(Object.entries(positions).map(([id,p])=>[id,{...p,...sizes.get(id)}])),r=routeER(boxes,edges);
 assert.equal(r.routes.length,6);assert.equal(r.labels.length,12);assert(r.routes.every(e=>!e.unrouted),'missing route '+dx+','+y);
 const branches=r.routes.filter(e=>e.from==='request');assert.equal(branches.length,2);assert(branches.every(e=>e.ports[0].side==='bottom'));assert.notDeepEqual(branches[0].ports[0].p,branches[1].ports[0].p,'outlets must not merge');
 const detour=r.routes.find(e=>e.to==='receipt');assert.equal(detour.ports[1].side,'left');assert(detour.points.some(p=>p.x<boxes.get('version').x&&p.y>=boxes.get('version').y),'route follows left corridor');
 for(let i=0;i<r.routes.length;i++)for(let j=i+1;j<r.routes.length;j++)for(const a of r.routes[i].segments)for(const b of r.routes[j].segments)assert(!sharedRun(a.a,a.b,b.a,b.b),'merged relation runs');
 for(let i=0;i<r.labels.length;i++)for(let j=i+1;j<r.labels.length;j++){const a=r.labels[i],b=r.labels[j];assert(!(a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top),'count overlap');}
 results.push({receipt:positions.receipt,outlets:branches.map(e=>e.ports[0].p),edges:r.routes.length,counts:r.labels.length});
}
console.log(JSON.stringify({status:'passed',cases:results},null,2));
