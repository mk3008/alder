import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialPositions,layoutPlan} from '../src/layout.ts';
import {reconcile} from '../src/session.ts';
import {parseDesign} from '../src/graph.ts';
const sample=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
const old=g=>Object.fromEntries(g.nodes.map((n,i)=>[n.id,[40+i%4*320,40+Math.floor(i/4)*140]]));
const connectedDistance=(g,p)=>g.relations.reduce((s,r)=>s+Math.hypot(p[r.to][0]-p[r.from][0],p[r.to][1]-p[r.from][1]),0);
const noOverlap=p=>{const all=Object.values(p);for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++)assert.ok(Math.abs(all[i][0]-all[j][0])>=280||Math.abs(all[i][1]-all[j][1])>=88);};
const before=JSON.stringify(sample.graph),fallback=initialPositions(sample.graph);noOverlap(fallback);assert.deepEqual(initialPositions(sample.graph),fallback);assert.equal(JSON.stringify(sample.graph),before);
const plan=layoutPlan(sample.graph,sample.activityOrder),p=plan.positions;noOverlap(p);assert.deepEqual(initialPositions(sample.graph,sample.activityOrder),p);
assert.ok(p['業務設計書'][0]<p['同期漏れ検査'][0]);assert.ok(Math.max(...Object.values(p).map(p=>p[0]))>4000,'no four-column wrapping');
for(const i of plan.forwardRelations){const r=sample.graph.relations[i];assert.ok(p[r.from][0]<p[r.to][0],r.from+' -> '+r.to);}
assert.equal(plan.forwardRelations.length+plan.feedbackRelations.length+plan.exceptionRelations.length,sample.graph.relations.length);
assert.equal(plan.exceptionRelations.length,2);assert.ok(plan.feedbackRelations.some(i=>{const r=sample.graph.relations[i];return p[r.from][0]>p[r.to][0];}));
assert.deepEqual(initialPositions({...sample.graph,nodes:[...sample.graph.nodes].reverse(),relations:[...sample.graph.relations].reverse()},sample.activityOrder),p,'input array permutations keep positions');
for(const size of [1,2,8,200,1000]){const graph={version:1,nodes:Array.from({length:size},(_,i)=>({id:String(i),name:String(i),type:i%2?'business':'object',scope:true})),relations:Array.from({length:Math.max(0,size-1)},(_,i)=>({kind:'input',from:String(i),to:String(i+1),label:'flow'}))};const result=initialPositions(graph);assert.equal(Object.keys(result).length,size);noOverlap(result);assert.ok(Object.values(result).flat().every(Number.isFinite));assert.deepEqual(initialPositions(graph),result);}
const isolated={version:1,nodes:sample.graph.nodes,relations:[]};noOverlap(initialPositions(isolated));
const tab={key:'test',name:'sample',design:sample,positions:{},scroll:[31,47],zoom:1.2},first=reconcile(tab,sample);assert.deepEqual(first.positions,p);assert.deepEqual(first.scroll,[31,47]);assert.equal(first.zoom,1.2);
const firstID=sample.graph.nodes[0].id,secondID=sample.graph.nodes[1].id;first.positions[firstID]=[987,654];first.positions[secondID]=[987,654];first.selected=firstID;assert.deepEqual(reconcile(first,sample).positions,first.positions,'manual overlaps also remain unchanged');
const partly={...first,positions:{[firstID]:p[secondID]}};const filled=reconcile(partly,sample);assert.deepEqual(filled.positions[firstID],partly.positions[firstID]);noOverlap(filled.positions);assert.equal(Object.keys(filled.positions).length,25);
const reduced={...sample,graph:{...sample.graph,nodes:sample.graph.nodes.slice(1),relations:sample.graph.relations.filter(r=>r.from!==firstID&&r.to!==firstID)}};const updated=reconcile(first,reduced);assert.equal(updated.positions[firstID],undefined);assert.equal(updated.selected,undefined);assert.deepEqual(updated.positions[secondID],first.positions[secondID]);
console.log(JSON.stringify({checks:['stable directed JSON-only fallback','all forward edges rightward, cycles retain relations, sample sync check right of design, no grid wrapping','bounded 1–1000 nodes','isolated graph','initial positions only','manual overlaps preserved','missing IDs avoid retained cards','deleted IDs removed'],sampleDistance:{old:connectedDistance(sample.graph,old(sample.graph)),new:connectedDistance(sample.graph,p)}},null,2));
