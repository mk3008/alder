// Legacy no-Group input regression; the current Group sample is tested separately.
import assert from 'node:assert/strict';
import {openDisplaySettingsDOM} from './toolbar-settings-control.mjs';
import {RouteCache} from '../src/route-cache.ts';
import {routeEdge, routeCollisionCount} from '../src/routing.ts';
import {readFileSync} from 'node:fs';
import {build} from './legacy-viewer-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';

let calls=[];
const cache=new RouteCache(options=>{calls.push(options);return routeEdge(options);});
const tab={},design={};
const nodes=[['a',100,100],['b',700,500],['c',1100,100],['d',1500,500]].map(([id,x,y])=>({id,x,y,width:260,height:68}));
const relations=[{kind:'output',from:'a',to:'b',label:'Write'},{kind:'input',from:'c',to:'d',label:'Read'},{kind:'output',from:'d',to:'c',label:'Write'}];
const first=cache.update(tab,design,nodes,relations);
assert.equal(calls.length,3);assert.ok(calls.every(c=>c.nodes===nodes),'one shared full obstacle array');
calls=[];assert.deepEqual(cache.update(tab,design,nodes,relations),first);assert.equal(calls.length,0);
// Move a card across an unrelated route. It remains byte-for-byte fixed.
const point=first[0].points[Math.floor(first[0].points.length/2)];
nodes[2].x=point[0]-130;nodes[2].y=point[1]-34;
const moved=cache.update(tab,design,nodes,relations);
assert.deepEqual(calls.map(c=>c.index),[1,2]);assert.equal(moved[0],first[0]);
assert.ok(routeCollisionCount(moved[0].points,[nodes[2]],0)>0);
assert.ok(calls.every(c=>c.nodes.length===4));
cache.update({},design,nodes,relations);calls=[];
assert.equal(cache.update(tab,design,nodes,relations)[0],moved[0],'returning to a tab preserves the nonincident route object');
assert.equal(calls.length,0);

// Multiple changed endpoints reroute the incident union only once each.
calls=[];nodes[2].x+=10;nodes[3].y+=10;cache.update(tab,design,nodes,relations);assert.deepEqual(calls.map(c=>c.index),[1,2]);
calls=[];nodes[0].x+=10;cache.update(tab,design,nodes,relations);assert.deepEqual(calls.map(c=>c.index),[0]);
calls=[];relations[0].label='Longer label';cache.update(tab,design,nodes,relations);assert.equal(calls.length,3);
calls=[];cache.update(tab,{},nodes,relations);assert.equal(calls.length,3);
const secondTab={};calls=[];const secondRoutes=cache.update(secondTab,design,nodes,relations);assert.equal(calls.length,3);
// Same design, independent tab history: changing the first never poisons the second.
cache.update(tab,design,nodes,relations);const secondPositions=nodes.map(n=>({...n}));
nodes[0].y+=50;cache.update(tab,design,nodes,relations);calls=[];
assert.deepEqual(cache.update(secondTab,design,secondPositions,relations),secondRoutes);assert.equal(calls.length,0);
cache.invalidate(tab);calls=[];cache.update(tab,design,nodes,relations);assert.equal(calls.length,relations.length,'explicit layout reset reroutes every edge');
calls=[];assert.deepEqual(cache.update(secondTab,design,secondPositions,relations),secondRoutes);assert.equal(calls.length,0,'layout reset does not invalidate another tab');
// In-place graph structure changes are detected even with the same identity.
calls=[];relations.push({kind:'output',from:'a',to:'d',label:'Added'});cache.update(tab,design,nodes,relations);assert.equal(calls.length,4);
relations.pop();calls=[];nodes[0].width+=10;cache.update(tab,design,nodes,relations);assert.equal(calls.length,3);

assert.equal(cache.update(tab,design,nodes.filter(n=>n.id!=='b'),relations)[0],undefined);
assert.equal(cache.update(tab,design,nodes,[]).length,0);
const fallback=new RouteCache(()=>({...first[0],fallback:true}));assert.equal(fallback.update(tab,design,nodes,relations)[0].fallback,true);

// Real UI rerenders must not invalidate the runtime cache. Instrument routing,
// not SVG writes, so zero means no expensive path search occurred.
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'count-routes',setup(build){build.onLoad({filter:/\/routing\.ts$/},args=>({contents:readFileSync(args.path,'utf8').replace('const source=nodes.find', 'globalThis.__routeCalls=(globalThis.__routeCalls??0)+1; const source=nodes.find'),loader:'ts'}));}}]});
const dom=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);
const d=w.document,$=id=>d.getElementById(id);
for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,25));
$('open-sample').click();
const sample=parseDesign(readFileSync('web/authorities/ungrouped-alder.md','utf8'));
assert.equal(w.__routeCalls,sample.graph.relations.length);
const paths=()=>new Map([...d.querySelectorAll('.edge')].map(e=>[e.dataset.relation,e.getAttribute('d')]));
openDisplaySettingsDOM(d);const initial=paths(),viewBox=$('edges').getAttribute('viewBox');
w.__routeCalls=0;$('layout-lock').click();
let card=d.querySelector('.node');const id=card.dataset.node;
(card.querySelector('.node-drag-handle')??card).onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});(card.querySelector('.node-drag-handle')??card).onpointerup({pointerId:1});
$('out').click();$('in').click();$('drawer').click();$('drawer').click();$('node-list-toggle').click();$('node-list-close').click();
openDisplaySettingsDOM(d);$('prefer-write').click();$('scope-outside').click();$('scope-outside').click();openDisplaySettingsDOM(d);$('prefer-write').click();
assert.equal(w.__routeCalls,0,'selection, zoom, drawers, lock, Scope and Write do not route');
assert.deepEqual(paths(),initial,'filters restore original geometry');
assert.equal($('edges').getAttribute('viewBox'),viewBox,'filter changes retain all extents');
card=d.querySelector(`[data-node="${id}"]`);(card.querySelector('.node-drag-handle')??card).onpointerdown({button:0,clientX:0,clientY:0,pointerId:2,stopPropagation(){}});
(card.querySelector('.node-drag-handle')??card).onpointermove({clientX:35,clientY:40});
const incident=sample.graph.relations.map((r,i)=>r.from===id||r.to===id?i:-1).filter(i=>i>=0);
assert.equal(w.__routeCalls,incident.length);
for(const [index,path] of paths())if(!incident.includes(+index))assert.equal(path,initial.get(index));
(card.querySelector('.node-drag-handle')??card).onpointerup({pointerId:2});assert.equal(w.__routeCalls,incident.length,'pointer release keeps route geometry');
assert.ok([...d.querySelectorAll('.edge')].every(e=>['true','false'].includes(e.dataset.fallback)));
const fire=(type,pointerId,x,y,target=$('viewport'))=>{const event=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{pointerId,pointerType:'touch',button:0,clientX:x,clientY:y});target.dispatchEvent(event);};
const beforeTouch=paths();w.__routeCalls=0;
fire('pointerdown',3,100,100,d.querySelector(`[data-node="${id}"]`));fire('pointermove',3,130,140);
assert.equal(w.__routeCalls,incident.length,'touch reroutes the same incident union');
for(const [index,path] of paths())if(!incident.includes(+index))assert.equal(path,beforeTouch.get(index));
fire('pointerup',3,130,140);assert.equal(w.__routeCalls,incident.length,'touch release keeps geometry');

const afterDrag=paths();w.__routeCalls=0;
card=[...d.querySelectorAll('.node')].find(n=>n.dataset.node!==id);
(card.querySelector('.node-drag-handle')??card).onpointerdown({button:0,clientX:0,clientY:0,pointerId:4,stopPropagation(){}});(card.querySelector('.node-drag-handle')??card).onpointerup({pointerId:4});
assert.equal(w.__routeCalls,0,'selection after dragging preserves cached routes');
assert.deepEqual(paths(),afterDrag);
// Cache isolation now follows graph views of the same original.
const grouped=readFileSync('web/authorities/ungrouped-alder.md','utf8');
$('open-text').click();$('source-text').value=grouped;await $('source-submit').onclick();
d.querySelector('.node[data-activity="'+sample.activityOrder[0]+'"]').click();const firstTab=d.querySelector('.tab.active').dataset.key;
const groupPaths=paths();await d.querySelector('.tab button').onclick();d.querySelector('.node[data-activity="'+sample.activityOrder[2]+'"]').click();
w.__routeCalls=0;await [...d.querySelectorAll('.tab')].find(t=>t.dataset.key===firstTab).querySelector('button').onclick();
assert.equal(w.__routeCalls,0,'switching back to a Group view reuses its cache');assert.deepEqual(paths(),groupPaths);

w.close();
console.log(JSON.stringify({checks:'cache initial full graph; zero display-only routes; incident-only mouse/touch drag; unrelated crossing retained; multi-node union; structural/design invalidation; tab isolation; missing endpoints; filters restore paths/extents; fallback exposed',initialRoutes:sample.graph.relations.length,dragRoutes:incident.length}));
