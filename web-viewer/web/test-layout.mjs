import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialPositions,layoutPlan} from '../src/layout.ts';
import {reconcile} from '../src/session.ts';
import {parseDesign} from '../src/graph.ts';
const sample=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
const chainNodes=Array.from({length:7},(_,i)=>({id:'step-'+i,type:i%2?'business':'object'}));
const stepGraph={version:1,nodes:chainNodes,relations:chainNodes.slice(1).map((n,i)=>({kind:i%2?'output':'input',from:chainNodes[i].id,to:n.id}))};
const stepPositions=initialPositions(stepGraph),origin=stepPositions[chainNodes[0].id];
const stepX=stepPositions[chainNodes[1].id][0]-origin[0],stepY=stepPositions[chainNodes[1].id][1]-origin[1];
assert.equal(stepX,64,'overview shares the accepted detail staircase horizontal step');
assert.equal(stepY,96,'cards retain the 28-unit vertical gap');
for(const [i,n] of chainNodes.entries())assert.deepEqual(stepPositions[n.id],[origin[0]+i*stepX,origin[1]+i*stepY]);
const old=g=>Object.fromEntries(g.nodes.map((n,i)=>[n.id,[40+i%4*320,40+Math.floor(i/4)*140]]));
const connectedDistance=(g,p)=>g.relations.reduce((s,r)=>s+Math.hypot(p[r.to][0]-p[r.from][0],p[r.to][1]-p[r.from][1]),0);
const noOverlap=p=>{const all=Object.values(p);for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)assert.ok(Math.abs(all[i][0]-all[j][0])>=260||Math.abs(all[i][1]-all[j][1])>=96);};
const before=JSON.stringify(sample.graph),fallback=initialPositions(sample.graph);noOverlap(fallback);assert.deepEqual(initialPositions(sample.graph),fallback);assert.equal(JSON.stringify(sample.graph),before);
const plan=layoutPlan(sample.graph,sample.activityOrder),p=plan.positions;noOverlap(p);assert.deepEqual(initialPositions(sample.graph,sample.activityOrder),p);
const saved128=JSON.parse(readFileSync(new URL('./authorities/overview-128-layout.json',import.meta.url),'utf8'));
assert.deepEqual({...reconcile({key:'old-overview',design:sample,positions:saved128,scroll:[17,29],zoom:.75},sample).positions},saved128,'saved 128-unit overview coordinates never migrate');
const previous=JSON.parse(readFileSync(new URL('./review-routing/positions-staircase.json',import.meta.url),'utf8'));
const columns=positions=>[...new Set(Object.values(positions).map(p=>p[0]))].sort((a,b)=>a-b).map(x=>Object.keys(positions).filter(id=>positions[id][0]===x).sort());
assert.deepEqual(columns(p).slice(3),columns(previous).slice(1),'downstream dependency ranks remain grouped after source-peer stairs');
assert.deepEqual(columns(p).slice(0,3),[['Alder: 業務相関ナレッジ'],['Alder: 検査項目設計ナレッジ'],['Alder: 業務ナレッジ']],'source-only Objects occupy distinct left/up staircase steps');
assert.deepEqual(Object.keys(p).sort((a,b)=>p[a][1]-p[b][1]),Object.keys(previous).sort((a,b)=>previous[a][1]-previous[b][1]),'compact spacing preserves the reviewed reading order');
const span=positions=>Math.max(...Object.values(positions).map(p=>p[0]))-Math.min(...Object.values(positions).map(p=>p[0]));
assert.ok(span(p)<span(previous),'the same dependency ranks occupy less horizontal space');
assert.ok(p['業務設計書'][0]<p['同期漏れ検査'][0]);assert.ok(columns(p).length>4,'no four-column wrapping');
for(const i of plan.forwardRelations){const r=sample.graph.relations[i];assert.ok(p[r.from][0]<p[r.to][0],r.from+' -> '+r.to);assert.ok(p[r.to][1]>=p[r.from][1]+96,'forward dependencies descend by at least one step');}
assert.equal(plan.forwardRelations.length+plan.feedbackRelations.length+plan.exceptionRelations.length,sample.graph.relations.length);
assert.deepEqual([plan.forwardRelations.length,plan.feedbackRelations.length,plan.exceptionRelations.length],[49,12,2],'spacing does not change cycle or exception classification');
for(const chain of [['業務設計','業務設計書','システム設計'],['画面設計','画面設計資料','実装'],['実装','コード','製品検証']]){assert.ok(p[chain[0]][0]<p[chain[1]][0]&&p[chain[1]][0]<p[chain[2]][0]);assert.ok(sample.graph.relations.some(r=>r.kind==='output'&&r.from===chain[0]&&r.to===chain[1]));assert.ok(sample.graph.relations.some(r=>r.kind==='input'&&r.from===chain[1]&&r.to===chain[2]));}
assert.equal(plan.exceptionRelations.length,2);assert.ok(plan.feedbackRelations.some(i=>{const r=sample.graph.relations[i];return p[r.from][0]>p[r.to][0];}));
assert.deepEqual(initialPositions({...sample.graph,nodes:[...sample.graph.nodes].reverse(),relations:[...sample.graph.relations].reverse()},sample.activityOrder),p,'input array permutations keep positions');
for(const size of [1,2,8,200,1000]){const graph={version:1,nodes:Array.from({length:size},(_,i)=>({id:String(i),name:String(i),type:i%2?'business':'object',scope:true})),relations:Array.from({length:Math.max(0,size-1)},(_,i)=>({kind:'input',from:String(i),to:String(i+1),label:'flow'}))};const result=initialPositions(graph);assert.equal(Object.keys(result).length,size);noOverlap(result);assert.ok(Object.values(result).flat().every(Number.isFinite));assert.deepEqual(initialPositions(graph),result);}
const isolated={version:1,nodes:sample.graph.nodes,relations:[]};noOverlap(initialPositions(isolated));
// Compare the optimized occupied-slot lookup with an all-card rectangle bump
// rule across branches, joins, cycles and every horizontally overlapping column.
// The old specimen above pins dependency ranks and reading order, not coordinates.
let seed=123456789;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
for(let trial=0;trial<24;trial++){
  const nodes=Array.from({length:70},(_,i)=>({id:'node-'+i,type:i%2?'business':'object'}));
  const graph={version:1,nodes,relations:Array.from({length:100},()=>({kind:random()<.5?'input':'output',from:nodes[Math.floor(random()*nodes.length)].id,to:nodes[Math.floor(random()*nodes.length)].id}))};
  const result=layoutPlan(graph),expected={},placed=[],parents=new Map(nodes.map(n=>[n.id,[]]));
  for(const i of result.forwardRelations){const r=graph.relations[i];parents.get(r.to).push(r.from);}
  for(const [id,[x]] of Object.entries(result.positions)){
    const rank=(x-origin[0])/stepX;
    let y=Math.max(40+rank*96,...parents.get(id).map(parent=>expected[parent][1]+96));
    while(true){const blockers=placed.filter(p=>x<p.x+260&&x+260>p.x&&y<p.y+96&&y+68>p.y-28);if(!blockers.length)break;y=Math.max(...blockers.map(p=>p.y+96));}
    expected[id]=[x,y];placed.push({x,y});
  }
  assert.deepEqual({...result.positions},expected,'slot lookup matches rectangle collision rule');noOverlap(result.positions);
  assert.deepEqual(initialPositions({...graph,nodes:[...nodes].reverse(),relations:[...graph.relations].reverse()}),result.positions);
}
// Long chains and wide isolated layers exercise iterative walks and compressed
// occupied runs without a quadratic all-pairs test or a timing-dependent gate.
const longNodes=Array.from({length:20000},(_,i)=>({id:'long-'+String(i).padStart(5,'0'),type:'object'}));
const longGraph={version:1,nodes:longNodes,relations:longNodes.slice(1).map((n,i)=>({kind:'input',from:longNodes[i].id,to:n.id}))};
const longPositions=initialPositions(longGraph);
for(let i=0;i<longNodes.length;i++)assert.deepEqual(longPositions[longNodes[i].id],[origin[0]+i*stepX,origin[1]+i*stepY]);
const widePositions=initialPositions({...longGraph,relations:[]});
for(let i=0;i<longNodes.length;i++)assert.deepEqual(widePositions[longNodes[i].id],[40,40+i*96]);
assert.deepEqual({...initialPositions({version:1,nodes:[],relations:[]})},{});
// Layout has no viewport input: narrow and wide hosts produce the same graph.
const previousWidth=globalThis.innerWidth;
try{globalThis.innerWidth=320;assert.deepEqual(initialPositions(sample.graph,sample.activityOrder),p);globalThis.innerWidth=1920;assert.deepEqual(initialPositions(sample.graph,sample.activityOrder),p);}
finally{if(previousWidth===undefined)delete globalThis.innerWidth;else globalThis.innerWidth=previousWidth;}
const tab={key:'test',name:'sample',design:sample,positions:{},scroll:[31,47],zoom:1.2},first=reconcile(tab,sample);assert.deepEqual(first.positions,p);assert.deepEqual(first.scroll,[31,47]);assert.equal(first.zoom,1.2);
const firstID=sample.graph.nodes[0].id,secondID=sample.graph.nodes[1].id;first.positions[firstID]=[987,654];first.positions[secondID]=[987,654];first.selected=firstID;assert.deepEqual(reconcile(first,sample).positions,first.positions,'manual overlaps also remain unchanged');
const partly={...first,positions:{[firstID]:p[secondID]}};const filled=reconcile(partly,sample);assert.deepEqual(filled.positions[firstID],partly.positions[firstID]);noOverlap(filled.positions);assert.equal(Object.keys(filled.positions).length,25);
const reduced={...sample,graph:{...sample.graph,nodes:sample.graph.nodes.slice(1),relations:sample.graph.relations.filter(r=>r.from!==firstID&&r.to!==firstID)}};const updated=reconcile(first,reduced);assert.equal(updated.positions[firstID],undefined);assert.equal(updated.selected,undefined);assert.deepEqual(updated.positions[secondID],first.positions[secondID]);
console.log(JSON.stringify({checks:['stable directed JSON-only fallback','compact staircase preserves reviewed dependency ranks and reading order; all forward edges rightward/downward; unchanged cycle and exception counts; no grid wrapping','bounded 1–1000 nodes; 20000-node chain and isolated layer; empty graph','all-card rectangle-rule equivalence and array permutation stability','viewport-independent initial positions only','manual overlaps preserved','missing IDs avoid retained cards','deleted IDs removed'],step:{x:stepX,y:stepY},sampleBounds:{left:Math.min(...Object.values(p).map(p=>p[0])),top:Math.min(...Object.values(p).map(p=>p[1])),right:Math.max(...Object.values(p).map(p=>p[0]+260)),bottom:Math.max(...Object.values(p).map(p=>p[1]+68))},sampleDistance:{old:connectedDistance(sample.graph,old(sample.graph)),new:connectedDistance(sample.graph,p)}},null,2));
