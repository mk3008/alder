import './json-layout-protection.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {parseDocument} from '../src/json-document.ts';
import {activityDesign} from '../src/activities.ts';
import {reconcile} from '../src/session.ts';
import {resetLayout} from '../src/layout-reset.ts';
const root='../work/viewer-json/issue-274/layout-regression/';
export const mdSource=readFileSync(root+'same-business.md','utf8'),jsonSource=readFileSync(root+'same-business.json','utf8');
const md=parseDesign(mdSource),json=parseDocument(jsonSource);
const named=(design,positions)=>Object.fromEntries(design.graph.nodes.map(n=>[n.name,positions[n.id]]).sort());
const tab=(design,activity)=>reconcile({key:'layout',name:'layout',design,positions:{},scroll:[0,0],zoom:1,activity},design);
for(const name of [undefined,...md.activityOrder]){
 const a=activityDesign(md,name),id=json.graph.nodes.find(n=>n.name===name)?.id,b=activityDesign(json,id);
 const m=tab(a,name),j=tab(b,id);
 assert.deepEqual(named(b,j.positions),named(a,m.positions),`MD/JSON world coordinates: ${name??'overview'}`);
 assert.deepEqual(named(b,resetLayout(j).positions),named(a,resetLayout(m).positions));
}
console.log('JSON/MD identical world coordinates and reset in overview and every Activity detail');

// Same semantic edges are compared after pairing by visible names, never by UUID order.
const {matrixPlanForDesign,canonicalJSONGraph}=await import('../src/json-layout.ts');
const {RouteCache}=await import('../src/route-cache.ts');
const snapshot=(design,activity)=>{
 const d=activityDesign(design,activity),t=tab(d,activity),plan=matrixPlanForDesign(d,activity),names=new Map(d.graph.nodes.map(n=>[n.id,n.name]));
 const boxes=d.graph.nodes.map(n=>({id:n.id,x:t.positions[n.id][0],y:t.positions[n.id][1],width:260,height:68}));
 const routes=new RouteCache().update(t,d,boxes,d.graph.relations,plan.wires);
 const nodes=boxes.map(n=>[names.get(n.id),n.x,n.y,n.width,n.height]).sort();
 const gaps=nodes.flatMap((a,i)=>nodes.slice(i+1).map(b=>[a[0],b[0],b[1]-a[1],b[2]-a[2]]));
 const edges=d.graph.relations.map((r,i)=>({kind:r.kind,from:names.get(r.from),to:names.get(r.to),label:r.label,route:routes[i]})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
 return {nodes,gaps,edges};
};
const sourcePackage=JSON.parse(jsonSource),variant=structuredClone(sourcePackage),bd=variant.documents[0];
const idMap=new Map([...bd.objects,...bd.activities].map((n,i)=>[n.id,`00000000-0000-4000-8000-${String(999-i).padStart(12,'0')}`]));
for(const n of [...bd.objects,...bd.activities])n.id=idMap.get(n.id);
for(const r of bd.relations){r.fromId=idMap.get(r.fromId);r.toId=idMap.get(r.toId);}
for(const f of bd.findings)f.targetIds=f.targetIds.map(id=>idMap.get(id));
bd.objects.reverse();bd.relations.reverse();
const versions=[json,parseDocument(JSON.stringify(variant))];
for(const j of versions)for(const focus of [undefined,...md.activityOrder]){
 const id=j.graph.nodes.find(n=>n.name===focus)?.id;
 assert.deepEqual(snapshot(j,id),snapshot(md,focus),`MD/JSON route points, label, rectangles, spacing: ${focus??'overview'}`);
}
const before=tab(json);for(const [id,p] of Object.entries(before.positions))before.positions[id]=[p[0]+101,p[1]+203];
before.zoom=1.2;before.scroll=[71,93];before.selected=json.activityOrder[0];
const renamed=structuredClone(sourcePackage);renamed.documents[0].activities[0].name='改名しても保存座標を保持';renamed.documents[0].activities.reverse();
const restored=reconcile(JSON.parse(JSON.stringify(before)),parseDocument(JSON.stringify(renamed)));
assert.deepEqual(restored.positions,before.positions);assert.equal(restored.selected,before.selected);assert.deepEqual(restored.scroll,before.scroll);assert.equal(restored.zoom,before.zoom);
assert.equal(json.markdown,jsonSource);assert.deepEqual(json.model.business,sourcePackage.documents[0]);
const astral={version:1,nodes:['😀','\ue000'].map(name=>({id:name+'-uuid',name,type:'object',scope:true})),relations:[]};
assert.deepEqual(canonicalJSONGraph(astral).nodes.map(n=>n.name),['\ue000','😀']);
console.log(JSON.stringify({jsonLayout:{views:md.activityOrder.length+1,uuidVariants:versions.length,worldTolerance:0,routesAndLabels:'exact',manualCoordinatesAndRename:'retained'}}));

const {initialPositions}=await import('../src/layout.ts');
assert.notDeepEqual(named(json,initialPositions(json.graph,json.activityOrder)),named(md,initialPositions(md.graph,md.activityOrder)),'negative control: bypassing identity adapter reproduces the old UUID layout regression');

// Exercise both parameter modes before real Chrome; catches lexical shadowing in the E2E harness.
const {verifyJSONLayout}=await import('./test-json-layout-browser.mjs');
const {mkdtempSync,rmSync}=await import('node:fs'),{tmpdir}=await import('node:os');
const temp=mkdtempSync(tmpdir()+'/json-layout-dispatch-'),fake={newContext:async()=>{throw Error('native-browser-boundary');}};
try{for(const options of [{evidenceDirectory:temp},{source:jsonSource,evidenceDirectory:temp}])await assert.rejects(()=>verifyJSONLayout(fake,options),/native-browser-boundary/);}finally{rmSync(temp,{recursive:true,force:true});}
