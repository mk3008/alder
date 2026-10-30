import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {objectDesign} from '../src/object-projection.ts';
import {restoreWorkspace,snapshotWorkspace,openActivity,openObject,viewDesign,replaceWorkspace,updateWorkspace} from '../src/workspace.ts';
const source=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(source),activities=design.graph.nodes.filter(n=>n.type==='business');
const frozen=JSON.stringify(design);assert.equal(activityDesign(design),design,'overview is the original graph');
for(const a of activities){
 const detail=activityDesign(design,a.id),relations=design.graph.relations.filter(r=>(r.kind==='input'&&r.to===a.id)||(r.kind==='output'&&r.from===a.id)||(r.kind==='business-exception'&&(r.from===a.id||r.to===a.id)));
 assert.deepEqual(detail.graph.relations,relations);
 const ids=new Set([a.id,...relations.flatMap(r=>[r.from,r.to])]);assert.deepEqual(detail.graph.nodes,design.graph.nodes.filter(n=>ids.has(n.id)));assert.deepEqual(detail.activityOrder,design.activityOrder.filter(id=>ids.has(id)));
 for(const n of detail.graph.nodes)assert.equal(n,design.graph.nodes.find(v=>v.id===n.id),'Object and Activity identity retained');
 assert.ok(detail.graph.relations.every(r=>r.kind==='input'||r.kind==='output'||r.kind==='business-exception'));
}
// Explicit oracle: both exception directions, cycles and a second hop must not expand the view.
const business=id=>({...activities[0],id,name:id,scope:id!=='B'}),object=id=>({...design.graph.nodes.find(n=>n.type==='object'),id,name:id});
const fixture={...design,graph:{version:1,nodes:['A','B','C','R'].map(business).concat(['O','P','Q'].map(object)),relations:[
 {kind:'input',from:'O',to:'A',label:'target input'},
 {kind:'output',from:'A',to:'O',label:'target output'},
 {kind:'business-exception',from:'R',to:'A',label:'incoming'},
 {kind:'business-exception',from:'A',to:'B',label:'outgoing'},
 {kind:'business-exception',from:'B',to:'A',label:'cycle'},
 {kind:'business-exception',from:'B',to:'C',label:'second hop'},
 {kind:'business-exception',from:'B',to:'R',label:'between neighbors'},
 {kind:'input',from:'O',to:'B',label:'shared Object to neighbor'},
 {kind:'output',from:'B',to:'P',label:'neighbor Object'},
 {kind:'object-exception',from:'O',to:'Q',label:'Object second hop'}]},activityOrder:['R','A','B','C']};
const originalFixture=JSON.stringify(fixture),oneHop=activityDesign(fixture,'A');
assert.deepEqual(oneHop.graph.nodes.map(n=>n.id),['A','B','R','O']);assert.deepEqual(oneHop.graph.relations,fixture.graph.relations.slice(0,5));assert.deepEqual(oneHop.activityOrder,['R','A','B']);assert.equal(oneHop.graph.nodes.find(n=>n.id==='B').scope,false);
for(const relation of oneHop.graph.relations)assert.equal(relation,fixture.graph.relations.find(r=>r===relation));assert.equal(JSON.stringify(fixture),originalFixture);assert.equal(activityDesign(fixture,'A'),oneHop,'cached projection retains identity');
// OBJECT-DETAIL-001: only incident relations, including both exception directions.
const objectFixture={...fixture,graph:{...fixture.graph,nodes:[...fixture.graph.nodes,object('isolated')],relations:[...fixture.graph.relations,{kind:'object-exception',from:'P',to:'O',label:'incoming Object exception'}]}};
const objectProjection=objectDesign(objectFixture,'O');assert.deepEqual(objectProjection.graph.nodes.map(n=>n.id),['A','B','O','P','Q']);assert.deepEqual(objectProjection.graph.relations.map(r=>r.label),['target input','target output','shared Object to neighbor','Object second hop','incoming Object exception']);assert.deepEqual(objectProjection.activityOrder,['A','B']);assert.equal(objectDesign(objectFixture,'O'),objectProjection);assert(objectProjection.graph.nodes.every(n=>objectFixture.graph.nodes.includes(n)));assert(objectProjection.graph.relations.every(r=>objectFixture.graph.relations.includes(r)));assert.equal(JSON.stringify(fixture),originalFixture);
assert.deepEqual(objectDesign(objectFixture,'isolated').graph.nodes.map(n=>n.id),['isolated']);assert.deepEqual(objectDesign(objectFixture,'isolated').graph.relations,[]);assert.throws(()=>objectDesign(objectFixture,'A'));assert.throws(()=>objectDesign(objectFixture,'missing'));
for(const [target,neighbor] of [['検査項目の設計','業務設計'],['業務設計','検査項目の設計']])assert.ok(activityDesign(design,target).graph.nodes.some(n=>n.id===neighbor),'sample exception neighbor in either direction');
assert.equal(JSON.stringify(design),frozen);assert.throws(()=>activityDesign(design,'missing'));
const oldText=source.replace('\n# Scope','\n## Groups\n\n### Group Old\n\n- Activity Missing\n\n# Scope');assert.deepEqual(parseDesign(oldText).graph,design.graph,'obsolete Group annotations do not control the graph or block reading');assert.equal(parseDesign(oldText).markdown,oldText);
const doc=(key,markdown=source)=>({key,name:key+'.md',design:parseDesign(markdown),positions:{},scroll:[0,0],zoom:1,source:{kind:'text'}});
const a={...doc('a'),draft:'unapplied A'},b={...doc('b'),draft:'unapplied B',checks:{markdown:'raw check evidence',name:'checks.md'}};
let ws=restoreWorkspace({tabs:[a,b],active:'b',dark:false,drawer:true,width:380});assert.equal(ws.tabs.length,1);assert.equal(ws.document.draft,b.draft);assert.equal(ws.recovery.length,2);assert.equal(ws.recovery[0].draft,a.draft);assert.equal(ws.recovery[1].checks.markdown,b.checks.markdown);
// OBJECT-DETAIL-003: preserve the view's type, camera, draft and neighboring views.
let objectWorkspace=restoreWorkspace({tabs:[{...a,design:objectFixture}],active:'a',dark:false,drawer:true,width:380});const activityTab=openActivity(objectWorkspace,'A'),objectTab=openObject(objectWorkspace,'O');assert.equal(openObject(objectWorkspace,'O'),objectTab);assert.equal(objectWorkspace.tabs.length,3);assert.equal(viewDesign(objectTab),objectProjection);objectTab.zoom=1.7;objectTab.scroll=[23,45];objectTab.selected='A';
const isolatedWorkspace=restoreWorkspace({tabs:[{...a,design:objectFixture}],active:'a',dark:false,drawer:true,width:380}),isolatedTab=openObject(isolatedWorkspace,'isolated');assert.deepEqual(viewDesign(isolatedTab).graph.nodes.map(n=>n.id),['isolated']);assert.equal(isolatedTab.positions.isolated.length,2);assert(isolatedTab.positions.isolated.every(Number.isFinite),'an unconnected Object can be opened and laid out');
const objectSnapshot=snapshotWorkspace(objectWorkspace),objectRestored=restoreWorkspace(structuredClone(objectSnapshot));assert.equal(objectRestored.tabs[2].object,'O');assert.equal(objectRestored.tabs[2].selected,'A');assert.equal(objectRestored.tabs[2].zoom,1.7);assert.deepEqual(objectRestored.tabs[2].scroll,[23,45]);assert.equal(objectRestored.document.draft,'unapplied A');assert.equal(objectRestored.tabs[1].activity,'A');
for(const corrupt of [v=>v.views[2].object='A',v=>v.views[2].object='unknown',v=>v.views[2].activity='A',v=>v.views.push({...v.views[2],key:'duplicate'})]){const invalid=structuredClone(objectSnapshot);corrupt(invalid);assert.throws(()=>restoreWorkspace(invalid));}
objectWorkspace=updateWorkspace(objectWorkspace,{...objectFixture,graph:{...objectFixture.graph,nodes:objectFixture.graph.nodes.filter(n=>n.id!=='O'),relations:objectFixture.graph.relations.filter(r=>r.from!=='O'&&r.to!=='O')}});assert.equal(objectWorkspace.tabs.length,2);assert.equal(objectWorkspace.tabs[1].activity,activityTab.activity);assert.equal(objectWorkspace.document.draft,undefined);
const first=ws.tabs[0],detail=openActivity(ws,activities[0].id);assert.equal(openActivity(ws,activities[0].id),detail);assert.equal(ws.tabs.length,2);assert.equal(detail.design,first.design);detail.draft='shared draft';assert.equal(first.draft,detail.draft);detail.zoom=1.5;assert.equal(first.zoom,1);
const snap=snapshotWorkspace(ws);assert.equal(snap.format,3);assert.ok(snap.views.every(v=>!('design'in v)&&!('draft'in v)&&!('checks'in v)));assert.equal(snap.document.draft,detail.draft);
// A saved pre-neighbor detail retains its coordinates and gains missing adjacent nodes.
const beforeNeighbors=structuredClone(snap);Object.assign(beforeNeighbors.views[1],{activity:'業務設計',selected:'業務設計',positions:{'業務設計':[111,222]},scroll:[33,44],zoom:1.3});
const restoredDetail=restoreWorkspace(structuredClone(beforeNeighbors));assert.deepEqual(restoredDetail.tabs[1].positions['業務設計'],[111,222]);assert.ok(restoredDetail.tabs[1].positions['検査項目の設計']);assert.ok(restoredDetail.tabs[1].positions['実装']);assert.deepEqual(restoredDetail.tabs[1].scroll,[33,44]);assert.equal(restoredDetail.tabs[1].zoom,1.3);assert.equal(restoredDetail.document.draft,snap.document.draft);assert.equal(restoredDetail.document.design.markdown,source);
for(const corrupt of [v=>v.views[0].zoom=NaN,v=>v.views[0].activity='unknown',v=>v.views[1].key=v.views[0].key,v=>v.views.push({...v.views[1],key:'other'})]){const invalid=structuredClone(snap);corrupt(invalid);assert.throws(()=>restoreWorkspace(invalid));}
assert.equal(restoreWorkspace(structuredClone(snap)).tabs[1].zoom,1.5);
const renamed=source.replaceAll(activities[0].id,activities[0].id+'改名');ws=updateWorkspace(ws,parseDesign(renamed));assert.equal(ws.tabs.length,1);assert.equal(ws.active,ws.tabs[0].key);assert.equal(ws.document.checks.markdown,b.checks.markdown);
ws.document.draft='keep on replacement';ws=replaceWorkspace(ws,doc('next'));assert.equal(ws.tabs.length,1);assert.equal(ws.recovery.length,2);assert.ok(!ws.recovery.some(d=>d.draft==='keep on replacement'),'new replacements do not append body generations; IDB protects pre-migration drafts atomically');
// Version 2 Group views are retained as data, without retaining Group semantics.
const legacy={...snap,format:2,active:'group-view',views:[{...snap.views[0]},{...snap.views[1],activity:undefined,key:'group-view',group:'Old',positions:{'Group: Old':[123,456]},zoom:1.8}]};
const raw=JSON.stringify(legacy),migrated=restoreWorkspace(legacy);assert.equal(JSON.stringify(legacy),raw);assert.equal(migrated.tabs.length,1);assert.equal(migrated.active,migrated.tabs[0].key);assert.equal(migrated.document.draft,snap.document.draft);assert.deepEqual(migrated.legacyViews,{documentKey:snap.document.key,views:structuredClone(legacy.views),active:'group-view'});assert.deepEqual(snapshotWorkspace(restoreWorkspace(snapshotWorkspace(migrated))).legacyViews,migrated.legacyViews);
console.log('Activity one-hop projection, original graph, shared Object, old annotations, workspace migration/recovery and format 2 preservation passed');
