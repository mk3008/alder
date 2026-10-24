import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {routeER,sharedRun} from './er-routing.js';
const html=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');
const code=html.split('const tables=')[1].split("const NS=")[0];
const {tables,edges,stages,compactInitial,creatorStage}=vm.runInNewContext('const tables='+code+';({tables,edges,stages,compactInitial,creatorStage})');
assert.equal(Object.keys(tables).length,6);assert.equal(edges.length,6);assert.equal(stages.length,6);
assert.equal(creatorStage.version,undefined);assert.equal(creatorStage.item,undefined);
assert.deepEqual(Array.from(stages.find(s=>s.id==='approve').ids),['request','version','preparation']);
const sizes=new Map(Object.entries(tables).map(([id,t])=>[id,{w:Math.max(220,...t.fields.map(([,n])=>n.length*14+24)),h:44+t.fields.length*25}]));
const initial=compactInitial(sizes),summary=[];
for(const stage of stages){
 const boxes=new Map(stage.ids.map(id=>[id,{...initial[stage.id][id],...sizes.get(id)}]));
 const result=routeER(boxes,stage.edges);
 assert.equal(result.routes.length,stage.edges.length);assert.equal(result.labels.length,stage.edges.length*2);
 assert(result.routes.every(r=>!r.unrouted),stage.id+' route missing');
 for(let i=0;i<result.routes.length;i++)for(let j=i+1;j<result.routes.length;j++)for(const a of result.routes[i].segments)for(const b of result.routes[j].segments)assert(!sharedRun(a.a,a.b,b.a,b.b),stage.id+' shared edge');
 for(let i=0;i<result.labels.length;i++)for(let j=i+1;j<result.labels.length;j++){const a=result.labels[i],b=result.labels[j];assert(!(a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top),stage.id+' label overlap');}
 summary.push({stage:stage.id,nodes:boxes.size,relations:result.routes.length,endpointCounts:result.labels.length});
}
console.log(JSON.stringify({status:'passed',summary},null,2));
