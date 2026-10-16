import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {restoreWorkspace,snapshotWorkspace,openActivity,replaceWorkspace,updateWorkspace} from '../src/workspace.ts';
const source=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(source),activities=design.graph.nodes.filter(n=>n.type==='business');
const frozen=JSON.stringify(design);assert.equal(activityDesign(design),design,'overview is the original graph');
for(const a of activities){
 const detail=activityDesign(design,a.id),relations=design.graph.relations.filter(r=>(r.kind==='input'&&r.to===a.id)||(r.kind==='output'&&r.from===a.id));
 assert.deepEqual(detail.graph.relations,relations);assert.deepEqual(detail.graph.nodes.filter(n=>n.type==='business'),[a]);
 const ids=new Set([a.id,...relations.flatMap(r=>[r.from,r.to])]);assert.deepEqual(detail.graph.nodes,design.graph.nodes.filter(n=>ids.has(n.id)));assert.deepEqual(detail.activityOrder,[a.id]);
 for(const n of detail.graph.nodes)assert.equal(n,design.graph.nodes.find(v=>v.id===n.id),'Object and Activity identity retained');
 assert.ok(detail.graph.relations.every(r=>r.kind==='input'||r.kind==='output'));
}
assert.equal(JSON.stringify(design),frozen);assert.throws(()=>activityDesign(design,'missing'));
const oldText=source.replace('\n# Scope','\n## Groups\n\n### Group Old\n\n- Activity Missing\n\n# Scope');assert.deepEqual(parseDesign(oldText).graph,design.graph,'obsolete Group annotations do not control the graph or block reading');assert.equal(parseDesign(oldText).markdown,oldText);
const doc=(key,markdown=source)=>({key,name:key+'.md',design:parseDesign(markdown),positions:{},scroll:[0,0],zoom:1,source:{kind:'text'}});
const a={...doc('a'),draft:'unapplied A'},b={...doc('b'),draft:'unapplied B',checks:{markdown:'raw check evidence',name:'checks.md'}};
let ws=restoreWorkspace({tabs:[a,b],active:'b',dark:false,drawer:true,width:380});assert.equal(ws.tabs.length,1);assert.equal(ws.document.draft,b.draft);assert.equal(ws.recovery.length,2);assert.equal(ws.recovery[0].draft,a.draft);assert.equal(ws.recovery[1].checks.markdown,b.checks.markdown);
const first=ws.tabs[0],detail=openActivity(ws,activities[0].id);assert.equal(openActivity(ws,activities[0].id),detail);assert.equal(ws.tabs.length,2);assert.equal(detail.design,first.design);detail.draft='shared draft';assert.equal(first.draft,detail.draft);detail.zoom=1.5;assert.equal(first.zoom,1);
const snap=snapshotWorkspace(ws);assert.equal(snap.format,3);assert.ok(snap.views.every(v=>!('design'in v)&&!('draft'in v)&&!('checks'in v)));assert.equal(snap.document.draft,detail.draft);
for(const corrupt of [v=>v.views[0].zoom=NaN,v=>v.views[0].activity='unknown',v=>v.views[1].key=v.views[0].key,v=>v.views.push({...v.views[1],key:'other'})]){const invalid=structuredClone(snap);corrupt(invalid);assert.throws(()=>restoreWorkspace(invalid));}
assert.equal(restoreWorkspace(structuredClone(snap)).tabs[1].zoom,1.5);
const renamed=source.replaceAll(activities[0].id,activities[0].id+'改名');ws=updateWorkspace(ws,parseDesign(renamed));assert.equal(ws.tabs.length,1);assert.equal(ws.active,ws.tabs[0].key);assert.equal(ws.document.checks.markdown,b.checks.markdown);
ws.document.draft='keep on replacement';ws=replaceWorkspace(ws,doc('next'));assert.equal(ws.tabs.length,1);assert.ok(ws.recovery.some(d=>d.draft==='keep on replacement'));
// Version 2 Group views are retained as data, without retaining Group semantics.
const legacy={...snap,format:2,active:'group-view',views:[{...snap.views[0]},{...snap.views[1],activity:undefined,key:'group-view',group:'Old',positions:{'Group: Old':[123,456]},zoom:1.8}]};
const raw=JSON.stringify(legacy),migrated=restoreWorkspace(legacy);assert.equal(JSON.stringify(legacy),raw);assert.equal(migrated.tabs.length,1);assert.equal(migrated.active,migrated.tabs[0].key);assert.equal(migrated.document.draft,snap.document.draft);assert.deepEqual(migrated.legacyViews,{documentKey:snap.document.key,views:structuredClone(legacy.views),active:'group-view'});assert.deepEqual(snapshotWorkspace(restoreWorkspace(snapshotWorkspace(migrated))).legacyViews,migrated.legacyViews);
console.log('Activity one-hop projection, original graph, shared Object, old annotations, workspace migration/recovery and format 2 preservation passed');
