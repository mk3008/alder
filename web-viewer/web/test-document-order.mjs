import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign,validateGraph} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {reconcile} from '../src/session.ts';
const raw=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(raw),g=design.graph;
const expected=raw.split('\n').filter(l=>l.startsWith('# Activity ')).map(l=>l.slice(11));
assert.deepEqual(design.activityOrder,expected);assert.equal(expected.length,10);
const snapshot=JSON.stringify(g),p=initialPositions(g,design.activityOrder);
assert.equal(Object.hasOwn(g,'activityOrder'),false);validateGraph(g);
// Reordering whole Activity sections changes the Viewer hint but not Graph JSON.
const sections=raw.split(/(?=^# (?:Activity|Object|Scope|Graph exceptions) )/m),activities=sections.filter(s=>s.startsWith('# Activity ')).reverse();let next=0;
const reversed=parseDesign(sections.map(s=>s.startsWith('# Activity ')?activities[next++]:s).join(''));
assert.deepEqual(reversed.graph,g);assert.deepEqual(reversed.activityOrder,[...expected].reverse());
const rp=initialPositions(reversed.graph,reversed.activityOrder);
assert.notDeepEqual(rp,p);
// Source positions do not leak into official JSON or depend on Object list order.
const objects=sections.filter(s=>s.startsWith('# Object ')).reverse();next=0;
const objectReorder=parseDesign(sections.map(s=>s.startsWith('# Object ')?objects[next++]:s).join(''));
assert.deepEqual(objectReorder.graph,g);assert.deepEqual(initialPositions(objectReorder.graph,objectReorder.activityOrder),p);
// JSON-only callers have no document hint and use a stable-ID directed fallback.
const jsonGraph=JSON.parse(JSON.stringify(g)),fallback=initialPositions(jsonGraph);
for(const hint of [undefined,[],['missing'],expected.slice(1),[...expected,expected[0]],{},'invalid'])assert.deepEqual(initialPositions(jsonGraph,hint),fallback);
assert.equal(JSON.stringify(g),snapshot);
// Acyclic direction takes precedence over contradictory document order.
const chain={version:1,nodes:[{id:'A',type:'business'},{id:'B',type:'business'},{id:'O',type:'object'}],relations:[{kind:'output',from:'A',to:'O'},{kind:'input',from:'O',to:'B'}]};
const cp=initialPositions(chain,['B','A']);assert.ok(cp.A[0]<cp.O[0]&&cp.O[0]<cp.B[0]);
assert.deepEqual(initialPositions({...chain,relations:[...chain.relations,...chain.relations]},['B','A']),cp);
const saved={key:'sample',name:'sample',design,positions:p,scroll:[17,91],zoom:.8};
assert.deepEqual(reconcile(saved,reversed).positions,p,'all existing coordinates outrank a new document order');
const legacy={...design};delete legacy.activityOrder;
assert.deepEqual({...reconcile({...saved,design:legacy,positions:Object.fromEntries(g.nodes.map((n,i)=>[n.id,[40+i%4*320,40+Math.floor(i/4)*140]]))},design).positions},Object.fromEntries(g.nodes.map((n,i)=>[n.id,[40+i%4*320,40+Math.floor(i/4)*140]])),'upgrade keeps legacy saved grid layout');
// Bound dense same-row placement by finite node counts; no clock or randomness.
for(const n of [1,100,1000]){const graph={version:1,nodes:[{id:'Activity',type:'business'},...Array.from({length:n},(_,i)=>({id:'Object '+i,type:'object'}))],relations:Array.from({length:n},(_,i)=>({kind:'input',from:'Object '+i,to:'Activity'}))};const positions=initialPositions(graph,['Activity']);assert.equal(new Set(Object.values(positions).map(p=>p.join(','))).size,n+1);assert.ok(Object.values(positions).flat().every(Number.isFinite));assert.deepEqual(initialPositions(graph,['Activity']),positions);}
console.log('document order: canonical GraphJSON unchanged; cycle hint changes initial positions; acyclic direction wins; invalid hint stable fallback; legacy/saved coordinates preserved; finite dense graphs');
