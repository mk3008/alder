import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign,validateGraph} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {reconcile} from '../src/session.ts';
const raw=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(raw),g=design.graph;
const expected=raw.split('\n').filter(l=>l.startsWith('# Activity ')).map(l=>l.slice(11));
assert.deepEqual(design.activityOrder,expected);assert.equal(expected.length,10);
const snapshot=JSON.stringify(g),p=initialPositions(g,design.activityOrder);
const backwards=(order,p)=>order.reduce((sum,id,i)=>sum+order.slice(i+1).filter(other=>p[other][1]<p[id][1]).length,0);
assert.equal(backwards(expected,p),1,'sample has one adjacent-row feedback inversion; order is a soft hint');
assert.ok(backwards(expected,p)<backwards(expected,initialPositions(g)));
assert.ok(p[expected[0]][1]<p[expected.at(-1)][1]);
assert.equal(Object.hasOwn(g,'activityOrder'),false);validateGraph(g);
// Reordering whole Activity sections changes the Viewer hint but not Graph JSON.
const sections=raw.split(/(?=^# (?:Activity|Object|Scope|Graph exceptions) )/m),activities=sections.filter(s=>s.startsWith('# Activity ')).reverse();let next=0;
const reversed=parseDesign(sections.map(s=>s.startsWith('# Activity ')?activities[next++]:s).join(''));
assert.deepEqual(reversed.graph,g);assert.deepEqual(reversed.activityOrder,[...expected].reverse());
const rp=initialPositions(reversed.graph,reversed.activityOrder);assert.equal(backwards(reversed.activityOrder,rp),0);assert.ok(rp[expected[0]][1]>rp[expected.at(-1)][1]);
assert.notDeepEqual(rp,p);
// Source positions do not leak into official JSON or depend on Object list order.
const objects=sections.filter(s=>s.startsWith('# Object ')).reverse();next=0;
const objectReorder=parseDesign(sections.map(s=>s.startsWith('# Object ')?objects[next++]:s).join(''));
assert.deepEqual(objectReorder.graph,g);assert.deepEqual(initialPositions(objectReorder.graph,objectReorder.activityOrder),p);
// JSON-only callers have no document hint and retain the old deterministic layout.
const jsonGraph=JSON.parse(JSON.stringify(g)),fallback=initialPositions(jsonGraph);
for(const hint of [undefined,[],['missing'],expected.slice(1),[...expected,expected[0]],{},'invalid'])assert.deepEqual(initialPositions(jsonGraph,hint),fallback);
assert.equal(JSON.stringify(g),snapshot);
// Isolated Activities seed their relative document order, including numeric IDs.
const isolated={version:1,nodes:Array.from({length:12},(_,i)=>({id:String(i),type:'business'})),relations:[]},order=['10','2','0','11','1','3','4','5','6','7','8','9'];
const ip=initialPositions(isolated,order);assert.equal(backwards(order,ip),0);assert.ok(ip['10'][1]<ip['9'][1]);
// Connected Objects stay near their Activity while document bands guide Activities.
const paired={version:1,nodes:order.flatMap(id=>[{id,type:'business'},{id:'Object '+id,type:'object'}]),relations:order.map(id=>({kind:'input',from:'Object '+id,to:id}))};
const pp=initialPositions(paired,order);assert.equal(backwards(order,pp),0);
for(const id of order)assert.ok(Math.hypot(pp[id][0]-pp['Object '+id][0],pp[id][1]-pp['Object '+id][1])<=360);
assert.deepEqual(initialPositions({...paired,relations:[...paired.relations,...paired.relations]},order),pp,'duplicate relations add no weight');
const saved={key:'sample',name:'sample',design,positions:p,scroll:[17,91],zoom:.8};
assert.deepEqual(reconcile(saved,reversed).positions,p,'all existing coordinates outrank a new document order');
const legacy={...design};delete legacy.activityOrder;
assert.deepEqual(reconcile({...saved,design:legacy,positions:fallback},design).positions,fallback,'upgrade keeps graph-only legacy layout');
// Bound dense same-row placement by finite node counts; no clock or randomness.
for(const n of [1,100,1000]){const graph={version:1,nodes:[{id:'Activity',type:'business'},...Array.from({length:n},(_,i)=>({id:'Object '+i,type:'object'}))],relations:Array.from({length:n},(_,i)=>({kind:'input',from:'Object '+i,to:'Activity'}))};const positions=initialPositions(graph,['Activity']);assert.equal(new Set(Object.values(positions).map(p=>p.join(','))).size,n+1);assert.ok(Object.values(positions).flat().every(Number.isFinite));assert.deepEqual(initialPositions(graph,['Activity']),positions);}
console.log(JSON.stringify({checks:['sample top-to-bottom reading improves with one documented adjacent-row inversion','Graph JSON remains canonical under Activity/Object section permutations','Object-only reorder does not change layout','isolated/numeric-ID ordering and paired Object proximity','duplicate relations do not change weight','missing/invalid hint and JSON-only deterministic fallback','saved/legacy coordinates retained across document changes','1–1000 Objects: finite, unique, deterministic positions'],passed:8},null,2));
