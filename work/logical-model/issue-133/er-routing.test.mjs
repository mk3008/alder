import assert from 'node:assert/strict';
import {routeER,sharedRun} from './er-routing.js';
const edges=[['request','version','1','1..N','down'],['version','item','1','1..N','down'],['version','confirmed','1','0..1','right'],['quote','version','1','0..N','reference'],['confirmed','decision','1','0..1','right']];
const base={request:{x:24,y:28,w:220,h:94},version:{x:104,y:174,w:220,h:144},item:{x:184,y:416,w:220,h:194},confirmed:{x:520,y:174,w:220,h:119},quote:{x:520,y:416,w:224,h:94},decision:{x:936,y:174,w:220,h:194}};
function verify(data,name){const t=performance.now(),result=routeER(new Map(Object.entries(data)),edges);assert(result.routes.every(r=>!r.unrouted),name+' unresolved');for(let i=0;i<result.routes.length;i++)for(let j=i+1;j<result.routes.length;j++)for(const a of result.routes[i].segments)for(const b of result.routes[j].segments)assert(!sharedRun(a.a,a.b,b.a,b.b),name+' shared '+i+':'+j);assert.equal(result.labels.length,result.routes.length*2);for(let i=0;i<result.labels.length;i++)for(let j=i+1;j<result.labels.length;j++){const a=result.labels[i],b=result.labels[j];assert(!(a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top),name+' labels overlap');}return performance.now()-t;}
let total=verify(base,'initial');
// The reported drag: quote above confirmation, both right of version.
for(const x of [450,520,650,850])for(const y of [8,40])total+=verify({...base,quote:{...base.quote,x,y}},'quote-above '+x+','+y);
// Both directions and parallel peers exercise per-side port allocation.
for(const x of [450,520,850])for(const y of [700,1000])total+=verify({...base,quote:{...base.quote,x,y}},'quote-below '+x+','+y);
for(const x of [24,104,184])total+=verify({...base,item:{...base.item,x}},'vertical landing '+x);
const vertical=routeER(new Map(Object.entries({...base,item:{...base.item,x:104}})),edges).routes.find(r=>r.to==='item');assert.equal(vertical.ports[1].side,'left');const last=vertical.points.at(-1),prior=vertical.points.at(-2);assert.equal(last.y,prior.y);assert(Math.abs(last.x-prior.x)>=44);
const impossible=routeER(new Map([['request',base.request],['version',{...base.version,x:24,y:28}]]),edges);assert(impossible.routes.some(r=>r.unrouted));
console.log('PASS initial + 17 dragged arrangements: all edges routed, no shared runs or label overlaps; impossible overlap flagged. '+Math.round(total)+'ms total');

verify({request:{x:24,y:28,w:220,h:94},version:{x:104,y:158,w:220,h:144},item:{x:184,y:338,w:220,h:194},confirmed:{x:420,y:158,w:220,h:119},quote:{x:500,y:338,w:226,h:94},decision:{x:736,y:158,w:220,h:194}},'compact overview');
console.log('PASS compact overview: 36px vertical gaps, all five edges independent and counts separate');
