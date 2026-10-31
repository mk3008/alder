import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';
import {stateSelfLoopRoute} from '../src/state-self-loop.ts';
import {stateCaptionGeometry,assertStateCaptionPlacement} from './caption-placement-oracle.mjs';
import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
const rawAuthority=readFileSync('verification/state-self-loop.check-items.json');
const authorityHash='08d8c155f86867541212b55ac15233057d4e5f1cfed05935b1cda292ce9a9caa';
const ids=['STATE-LOOP-001','STATE-LOOP-002','STATE-LOOP-003','STATE-LOOP-004'];
function verifyAuthority(value){assert.equal(hash(value),authorityHash);assert.deepEqual(JSON.parse(value).checks.map(c=>c.id),ids);}
function verifyCoverage(results){assert.deepEqual(results.slice().sort(),ids.slice().sort());}
verifyAuthority(rawAuthority);const changed=JSON.parse(rawAuthority);changed.checks.pop();assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(changed))));assert.throws(()=>verifyAuthority(Buffer.from('{}')));assert.throws(()=>verifyCoverage(ids.slice(1)));
const results=[];
const source=readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json');
assert.equal(hash(source),'b3dfb5aa699026d748969671a4d9efee9523aa354e34a30bbc2f81447bae46f4');
const original=JSON.parse(source),state=original.documents.find(d=>d.kind==='stateTransition');
const code=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const window=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
window.eval(code.outputFiles[0].text+';window.StateUI=StateUI;');
function render(pkg){
 const design=parseDocument(JSON.stringify(pkg));
 const panel=window.StateUI.stateTransitionPanel(design,state.objectId,()=>{});
 return {panel,design,model:design.objectStateTransitions[state.objectId].model,svg:panel.querySelector('.state-diagram')};
}
// Check the rendered path independently, including rounded corners; a pair
// of different SVG strings alone does not rule out a crossing.
function segments(path){
 const tokens=path.match(/[MLQ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi);let i=0,p=[0,0],out=[];
 while(i<tokens.length){const op=tokens[i++];if(op==='M')p=[+tokens[i++],+tokens[i++]];
  else if(op==='L'){const q=[+tokens[i++],+tokens[i++]];out.push([p,q]);p=q;}
  else if(op==='Q'){const c=[+tokens[i++],+tokens[i++]],end=[+tokens[i++],+tokens[i++]],start=p;for(let j=1;j<=8;j++){const t=j/8,s=1-t,q=[s*s*start[0]+2*s*t*c[0]+t*t*end[0],s*s*start[1]+2*s*t*c[1]+t*t*end[1]];out.push([p,q]);p=q;}}
  else throw Error('unexpected path command '+op);
 }return out;
}
function crossing([a,b],[c,d]){
 const cross=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
 return cross(a,b,c)*cross(a,b,d)<-1e-6&&cross(c,d,a)*cross(c,d,b)<-1e-6;
}
function verify(candidate){
 const {panel,design,model,svg}=render(candidate),g=stateCaptionGeometry(svg),loops=model.transitions.filter(t=>t.from===t.to);
 assertStateCaptionPlacement(g,model.transitions);
 assertStateCaptionRows(stateCaptionSnapshot(svg),model.transitions);
 assert.equal(g.paths.length,model.transitions.length);assert.equal(g.captions.length,model.transitions.length);
 for(const t of loops){
  const path=svg.querySelector(`path.edge[data-transitions="${t.id}"]`),caption=svg.querySelector(`[data-transition-id="${t.id}"]`),node=g.nodes.find(n=>n.id===t.from);
  assert(path&&caption&&node,t.id);assert.equal(path.classList.contains('exception'),t.path==='exception');
  const nums=path.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.equal(nums[0],node.x+node.width);assert.equal(nums.at(-1),node.y);
  assert(nums.at(-2)>node.x&&nums.at(-2)<node.x+node.width);
  assert(caption.textContent.includes(design.graph.nodes.find(n=>n.id===t.activity).name));assert(panel.querySelector(`[data-transition="${t.id}"]`).textContent.includes(t.condition));
 }
 for(const stateName of new Set(loops.map(t=>t.from))){
  const paths=loops.filter(t=>t.from===stateName).map(t=>svg.querySelector(`path.edge[data-transitions="${t.id}"]`).getAttribute('d'));
  assert.equal(new Set(paths).size,paths.length,'same-state transitions have distinct paths: '+stateName);
  for(const [i,path]of paths.entries())for(const other of paths.slice(i+1))assert(!segments(path).some(a=>segments(other).some(b=>crossing(a,b))),'same-state loops do not cross: '+stateName);
 }
 for(const name of ['終結','破棄'])assert(!loops.some(t=>t.from===name),name+' has no invented self-loop');
 return {g,loops,svg};
}
const none=structuredClone(original);none.documents.find(d=>d.kind==='stateTransition').transitions=state.transitions.filter(t=>t.fromId!==t.toId);
assert.equal(verify(none).loops.length,0);
const one=structuredClone(original);one.documents.find(d=>d.kind==='stateTransition').transitions=state.transitions.filter(t=>t.fromId!==t.toId||t.sourceId==='T17');
assert.deepEqual(verify(one).loops.map(t=>t.id),['T17']);
results.push('STATE-LOOP-001');
const actual=verify(original),draft=actual.loops.filter(t=>t.from==='下書き');
assert.deepEqual(draft.map(t=>t.id).sort(),['T08','T19']);
assert.equal(new Set(draft.map(t=>actual.svg.querySelector(`path.edge[data-transitions="${t.id}"]`).getAttribute('d'))).size,2);
const many=structuredClone(original),sd=many.documents.find(d=>d.kind==='stateTransition'),base=sd.transitions.find(t=>t.sourceId==='T19');
for(let i=0;i<3;i++)sd.transitions.push({...base,id:'extra-loop-'+i,sourceId:'T9'+i,condition:'追加の状態維持条件 '+i});
const manyResult=verify(many),same=manyResult.loops.filter(t=>t.from==='下書き');
assert.equal(same.length,5);assert.equal(new Set(same.map(t=>manyResult.svg.querySelector(`path.edge[data-transitions="${t.id}"]`).getAttribute('d'))).size,5);
// A retained position can put another card on the nominal loop corridor.
// The loop must find an upper-right detour without passing through that card.
const card={id:'self',x:200,y:200,width:104,height:44},blocker={id:'other',x:324,y:150,width:24,height:40};
const detour=stateSelfLoopRoute(card,[card,blocker],{index:0,count:1,rise:41,outerReach:32},120);
assert.equal(detour.collisions,0);assert.equal(detour.fallback,false);assert.equal(detour.rerouted,true);
results.push('STATE-LOOP-002');
const node=actual.g.nodes.find(n=>n.id==='作業中');actual.svg.querySelector('[data-state="作業中"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
assert(node&&actual.svg.querySelector('[data-transition-id="T17"] tspan').classList.contains('review-related'));
assert(!actual.svg.querySelector('path.edge[data-transitions="T17"]').classList.contains('exception'));
results.push('STATE-LOOP-003');
assert.equal(hash(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json')),hash(source));
results.push('STATE-LOOP-004');verifyAuthority(readFileSync('verification/state-self-loop.check-items.json'));verifyCoverage(results);
const originalDraft=actual.g.nodes.find(n=>n.id==='下書き'),manyDraft=manyResult.g.nodes.find(n=>n.id==='下書き');
console.log(JSON.stringify({checks:ids,examples:[0,1,2,5],draftNode:{two:[originalDraft.width,originalDraft.height],five:[manyDraft.width,manyDraft.height]},svg:{two:actual.svg.getAttribute('viewBox'),five:manyResult.svg.getAttribute('viewBox')},limitation:'DOM geometry; real browser and human review are separate'}));
window.close();
