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
const rawAuthority=readFileSync('verification/state-bundled-loop.check-items.json');
const authorityHash='3d586237dd362e2ad4fb58ce9835a1e58b1835ec6eba89386152cad5f41e8d67';
const ids=['STATE-BUNDLE-001','STATE-BUNDLE-002','STATE-BUNDLE-003','STATE-BUNDLE-004','STATE-BUNDLE-005'];
const legacyAuthorities=[
 ['verification/state-self-loop.check-items.json','08d8c155f86867541212b55ac15233057d4e5f1cfed05935b1cda292ce9a9caa'],
 ['verification/state-transition-identity.check-items.json','9e4e340940d214878b471fc70101e8fabb2087c6369f1281b567e2ff7276be90'],
 ['verification/state-caption-placement.check-items.json','7ffbb694bf26b9c7934e3963d24612e0af5225f97e611b186df7e3fea3c09694']
];
function verifyAuthority(value){assert.equal(hash(value),authorityHash);assert.deepEqual(JSON.parse(value).checks.map(c=>c.id),ids);}
function verifyCoverage(results){assert.deepEqual(results.slice().sort(),ids.slice().sort());}
verifyAuthority(rawAuthority);const changed=JSON.parse(rawAuthority);changed.checks.pop();assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(changed))));assert.throws(()=>verifyAuthority(Buffer.from('{}')));assert.throws(()=>verifyCoverage(ids.slice(1)));
const changedCase=JSON.parse(rawAuthority);changedCase.checks[0].condition='changed';assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(changedCase))));
for(const [path,digest]of legacyAuthorities)assert.equal(hash(readFileSync(path)),digest);
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
function pathFor(svg,id){const paths=[...svg.querySelectorAll('path.edge[data-transitions]')].filter(p=>p.dataset.transitions.split(' ').includes(id));assert.equal(paths.length,1,'one visible route for '+id);return paths[0];}
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
 const p=cross(a,b,c),q=cross(a,b,d),r=cross(c,d,a),s=cross(c,d,b);
 if(p*q< -1e-6&&r*s< -1e-6)return true;
 if(Math.max(Math.abs(p),Math.abs(q),Math.abs(r),Math.abs(s))>1e-6)return false;
 const axis=Math.abs(b[0]-a[0])>=Math.abs(b[1]-a[1])?0:1;
 return Math.min(Math.max(a[axis],b[axis]),Math.max(c[axis],d[axis]))-Math.max(Math.min(a[axis],b[axis]),Math.min(c[axis],d[axis]))>.1;
}
function hitsBox([a,b],box){
 let low=0,high=1;
 for(let axis=0;axis<2;axis++){
  const min=axis?box.y:box.x,max=min+(axis?box.height:box.width),delta=b[axis]-a[axis];
  if(Math.abs(delta)<1e-10){if(a[axis]<min||a[axis]>max)return false;}
  else{const p=(min-a[axis])/delta,q=(max-a[axis])/delta;low=Math.max(low,Math.min(p,q));high=Math.min(high,Math.max(p,q));if(low>high)return false;}
 }return true;
}
function verify(candidate){
 const {panel,design,model,svg}=render(candidate),g=stateCaptionGeometry(svg),loops=model.transitions.filter(t=>t.from===t.to);
 assertStateCaptionPlacement(g,model.transitions);
 assertStateCaptionRows(stateCaptionSnapshot(svg),model.transitions);
 assert.equal(g.paths.length,model.transitions.filter(t=>t.from!==t.to).length+new Set(loops.map(t=>JSON.stringify([t.from,t.path]))).size);assert.equal(g.captions.length,model.transitions.length);
 for(const t of loops){
  const path=pathFor(svg,t.id),caption=svg.querySelector(`[data-transition-id="${t.id}"]`),node=g.nodes.find(n=>n.id===t.from);
  assert(path&&caption&&node,t.id);assert.equal(path.classList.contains('exception'),t.path==='exception');
  const nums=path.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert(nums[0]>node.x&&nums[0]<node.x+node.width);assert.equal(nums[1],node.y+node.height);assert.equal(nums.at(-1),node.y+node.height);
  assert(nums.at(-2)>node.x&&nums.at(-2)<node.x+node.width);
  assert(caption.textContent.includes(design.graph.nodes.find(n=>n.id===t.activity).name));assert(panel.querySelector(`[data-transition="${t.id}"]`).textContent.includes(t.condition));
 }
 for(const stateName of new Set(loops.map(t=>t.from))){
  const stateLoops=loops.filter(t=>t.from===stateName);
  for(const a of stateLoops)for(const b of stateLoops)assert.equal(pathFor(svg,a.id)===pathFor(svg,b.id),a.path===b.path,'same-state loops group only the same line style');
 }
 for(const loop of loops){const path=segments(pathFor(svg,loop.id).getAttribute('d'));
  for(const other of g.paths.filter(p=>!p.id.split(' ').includes(loop.id)))assert(!path.some(a=>segments(other.d).some(b=>crossing(a,b))),loop.id+' does not cross or share another transition: '+other.id);
  const caption=g.captions.find(c=>c.id===loop.id),box={x:caption.x,y:caption.y-14,width:Math.max(...caption.lines.map(s=>Array.from(s).length*14)),height:caption.lines.length*18};
  for(const other of g.paths.filter(p=>!p.id.split(' ').includes(loop.id)))assert(!segments(other.d).some(s=>hitsBox(s,box)),loop.id+' caption does not cover a transition: '+other.id);
 }
 for(const row of model.transitions.filter(t=>t.from!==t.to))assert.equal(pathFor(svg,row.id).dataset.transitions,row.id,'non-self routes remain separate');
 for(const name of ['終結','破棄'])assert(!loops.some(t=>t.from===name),name+' has no invented self-loop');
 return {g,loops,svg};
}
const none=structuredClone(original);none.documents.find(d=>d.kind==='stateTransition').transitions=state.transitions.filter(t=>t.fromId!==t.toId);
assert.equal(verify(none).loops.length,0);
const one=structuredClone(original);one.documents.find(d=>d.kind==='stateTransition').transitions=state.transitions.filter(t=>t.fromId!==t.toId||t.sourceId==='T17');
assert.deepEqual(verify(one).loops.map(t=>t.id),['T17']);
const actual=verify(original),draft=actual.loops.filter(t=>t.from==='下書き');
assert.deepEqual(draft.map(t=>t.id).sort(),['T08','T19']);
assert.equal(pathFor(actual.svg,'T08'),pathFor(actual.svg,'T19'));
assert.deepEqual(pathFor(actual.svg,'T08').dataset.transitions.split(' ').sort(),['T08','T19']);
const many=structuredClone(original),sd=many.documents.find(d=>d.kind==='stateTransition'),base=sd.transitions.find(t=>t.sourceId==='T19');
for(let i=0;i<3;i++)sd.transitions.push({...base,id:'extra-loop-'+i,sourceId:'T9'+i,condition:'追加の状態維持条件 '+i});
const manyResult=verify(many),same=manyResult.loops.filter(t=>t.from==='下書き');
assert.equal(same.length,5);assert.equal(new Set(same.map(t=>pathFor(manyResult.svg,t.id))).size,1);
results.push('STATE-BUNDLE-001');
// A retained position can put another card on the nominal loop corridor.
// The lower loop must find a detour without passing through that card.
const card={id:'self',x:200,y:200,width:104,height:44},blocker={id:'other',x:288,y:280,width:12,height:20};
const detour=stateSelfLoopRoute(card,[card,blocker],{index:0,count:1,depth:80,labelLeft:312},120);
assert.equal(detour.collisions,0);assert.equal(detour.fallback,false);assert.equal(detour.rerouted,true);
const draftNode=actual.g.nodes.find(n=>n.id==='下書き'),returned=actual.g.nodes.find(n=>n.id==='差戻し'),draftCaptions=['T19','T08'].map(id=>actual.g.captions.find(c=>c.id===id));
assert(draftCaptions.every(c=>c.y-14>=draftNode.y+draftNode.height+24));assert(draftCaptions[0].y<draftCaptions[1].y);assert(draftCaptions[1].y<returned.y);
assert(actual.g.captions.find(c=>c.id==='T11').x<=returned.x+returned.width+40,'the returned-state loop caption stays near its state');
const vertical=p=>segments(pathFor(actual.svg,p).getAttribute('d')).filter(([a,b])=>Math.abs(a[0]-b[0])<.01&&Math.abs(a[1]-b[1])>2);
for(const a of vertical('T05'))for(const b of vertical('T14'))assert(!crossing(a,b),'distinct return transitions keep separate vertical corridors');
results.push('STATE-BUNDLE-002');
const initial=actual.g.nodes.find(n=>n.id==='@new'),incoming=actual.g.captions.find(c=>c.id==='T02');
assert(incoming.y>initial.y+initial.height);assert(incoming.y<draftNode.y);assert(incoming.y<draftCaptions[0].y);
const incomingBox={x:incoming.x,y:incoming.y-14,width:Math.max(...incoming.lines.map(s=>Array.from(s).length*14)),height:incoming.lines.length*18};
for(const other of actual.g.paths.filter(p=>!p.id.split(' ').includes('T02')))assert(!segments(other.d).some(s=>hitsBox(s,incomingBox)),'T02 caption does not cover '+other.id);
for(const id of ['T12','T14'])assert(actual.svg.querySelector(`[data-transition-id="${id}"]`));
results.push('STATE-BUNDLE-003');
const mixed=structuredClone(original),md=mixed.documents.find(d=>d.kind==='stateTransition');
md.transitions.push({...base,id:'normal-self',sourceId:'T90',path:'normal',exceptionId:null,condition:'状態を変えずに別の通常操作を実行'});
const mix=verify(mixed),normal=pathFor(mix.svg,'T90'),exception=pathFor(mix.svg,'T08');assert.notEqual(normal,exception);assert(!normal.classList.contains('exception'));assert(exception.classList.contains('exception'));
mix.svg.querySelector('[data-state="下書き"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
for(const id of ['T08','T19','T90'])assert([...mix.svg.querySelectorAll(`[data-transition-id="${id}"] tspan`)].every(t=>t.classList.contains('review-related')));
mix.svg.querySelector('[data-state="申請済み"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
for(const id of ['T08','T19','T90'])assert([...mix.svg.querySelectorAll(`[data-transition-id="${id}"] tspan`)].every(t=>!t.classList.contains('review-related')));
const node=actual.g.nodes.find(n=>n.id==='作業中');actual.svg.querySelector('[data-state="作業中"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
assert(node&&actual.svg.querySelector('[data-transition-id="T17"] tspan').classList.contains('review-related'));
assert(actual.g.captions.find(c=>c.id==='T17').x<=node.x+node.width+40,'the normal self-loop label stays near its state');
assert(!pathFor(actual.svg,'T17').classList.contains('exception'));
results.push('STATE-BUNDLE-004');
assert.equal(hash(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json')),hash(source));
for(const [path,digest]of [['src/routing.ts','23a5980eca7fe6017870030f99cfedd455d602032b68487c21c6b97b9471df49'],['src/matrix-layout.ts','151ce84c5c41eb9f58720efbf8a66f38719d098a6519e039cd52c0a554d91a2d'],['src/route-cache.ts','cd432c32d12b305aae2e65f100f77a2806f7b35d55ff85cec69b380f8c90d14f']])assert.equal(hash(readFileSync(path)),digest);
for(const [path,digest]of legacyAuthorities)assert.equal(hash(readFileSync(path)),digest);
results.push('STATE-BUNDLE-005');verifyAuthority(readFileSync('verification/state-bundled-loop.check-items.json'));verifyCoverage(results);
const originalDraft=actual.g.nodes.find(n=>n.id==='下書き'),manyDraft=manyResult.g.nodes.find(n=>n.id==='下書き');
console.log(JSON.stringify({checks:ids,examples:[0,1,2,5],draftNode:{two:[originalDraft.width,originalDraft.height],five:[manyDraft.width,manyDraft.height]},svg:{two:actual.svg.getAttribute('viewBox'),five:manyResult.svg.getAttribute('viewBox')},limitation:'DOM geometry; real browser and human review are separate'}));
window.close();
