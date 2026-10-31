import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {RouteCache} from '../src/route-cache.ts';
import {stateCaptionGeometry,assertStateCaptionPlacement} from './caption-placement-oracle.mjs';

const authority=readFileSync('verification/state-caption-placement.check-items.json');
const digest='7ffbb694bf26b9c7934e3963d24612e0af5225f97e611b186df7e3fea3c09694';
const validateAuthority=raw=>{assert.equal(createHash('sha256').update(raw).digest('hex'),digest);const checks=JSON.parse(raw).checks;assert.deepEqual(checks.map(c=>c.id),['STATE-CAPTION-001','STATE-CAPTION-002','STATE-CAPTION-003']);return checks;};
const checks=validateAuthority(authority);const altered=JSON.parse(authority);altered.checks.pop();assert.throws(()=>validateAuthority(Buffer.from(JSON.stringify(altered))));
assert.throws(()=>validateAuthority(Buffer.from('')));
const coverage=results=>assert.deepEqual(results.slice().sort(),checks.map(c=>c.id).sort());
assert.throws(()=>coverage(checks.slice(1).map(c=>c.id)));
const results=[];
const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8'),pkg=JSON.parse(raw),state=pkg.documents.find(d=>d.kind==='stateTransition');
const row=id=>state.transitions.find(t=>t.sourceId===id),name=id=>state.states.find(s=>s.id===id)?.name??id;
assert.equal(name(row('T12').fromId),'承認済み');assert.equal(name(row('T12').toId),'購入準備済み');assert.equal(row('T12').path,'normal');
assert.equal(name(row('T14').fromId),'承認済み');assert.equal(name(row('T14').toId),'差戻し');assert.equal(row('T14').path,'exception');
const compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'}),window=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 window.eval(compiled.outputFiles[0].text+';window.StateUI=StateUI;');
 const design=parseDocument(raw),panel=window.StateUI.stateTransitionPanel(design,state.objectId,()=>{}),svg=panel.querySelector('.state-diagram'),rows=design.objectStateTransitions[state.objectId].model.transitions;
 const geometry=stateCaptionGeometry(svg);assertStateCaptionPlacement(geometry,rows);
 // Compare to the actual shared business-graph routing/cache boundary, in
 // addition to the independent line/card arithmetic above.
 const aliases={'@new':'作成前','@none':'作成なし','@unknown':'未決'},model=design.objectStateTransitions[state.objectId].model,ids=[...new Set(['@new',...model.states,...rows.map(r=>r.to)])];
 const relations=rows.map(r=>({kind:r.path==='exception'?'business-exception':'input',from:r.from,to:r.to,label:r.id+'：'+(design.graph.nodes.find(n=>n.id===r.activity)?.name??r.activity)+'：'+r.condition}));
 const graph={version:1,nodes:ids.map(id=>({id,type:'business',name:aliases[id]??id,scope:true})),relations},plan=matrixPlan(graph,ids),used=new Map();
 const sizes=rows.map((row,i)=>{const c=geometry.captions.find(c=>c.id===row.id),height=c.lines.length*18,width=Math.max(...c.lines.map(line=>Array.from(line).length*14));if(!plan.wires[i].returning){const offset=used.has(row.from)?used.get(row.from)+8:0;used.set(row.from,offset+height);plan.wires[i].captionLane=offset/22;}return{width,height};});
 const captionRelations=relations.map((relation,i)=>({...relation,label:String(i).padEnd(Math.ceil(sizes[i].width/12),'x')}));
 const routes=new RouteCache().update({},model,geometry.nodes,captionRelations,plan.wires);
 for(const [i,r]of rows.entries()){
  // Self-loop bends and caption alignment have their own independent SVG
  // checks above; the shared default route remains unchanged for other edges.
  if(r.from===r.to)continue;
  const label=geometry.captions.find(c=>c.id===r.id),singleWidth=Math.max(30,captionRelations[i].label.length*12);
  assert.ok(label.x>=routes[i].label[0]-singleWidth/2,'same business anchor or collision escape: '+r.id);
  const center=routes[i].label[1]+(plan.wires[i].returning?0:sizes[i].height/2-9);
  assert.equal(label.y,center-sizes[i].height/2+14,'shared business caption row: '+r.id);
 }
 const long=structuredClone(pkg),longException=long.documents.find(d=>d.kind==='stateTransition').transitions.find(t=>t.sourceId==='T02').exceptionId;long.documents.find(d=>d.kind==='businessDesign').exceptions.find(e=>e.id===longException).name='長い例外名'.repeat(30);
 const longDesign=parseDocument(JSON.stringify(long)),longSVG=window.StateUI.stateTransitionPanel(longDesign,state.objectId,()=>{}).querySelector('.state-diagram'),longGeometry=stateCaptionGeometry(longSVG);
 assertStateCaptionPlacement(longGeometry,longDesign.objectStateTransitions[state.objectId].model.transitions);
 assert.ok(longGeometry.captions.find(c=>c.id==='T02').y-14>=16,'long initial return caption remains inside the canvas');
 assert.equal(longSVG.querySelectorAll('[data-canvas-boundary]').length,rows.length,'camera includes every caption boundary');
 results.push('STATE-CAPTION-001');
 for(const id of ['T12','T14']){const t=row(id),caption=svg.querySelector(`[data-transition-id="${id}"]`),path=svg.querySelector(`path[data-transitions="${id}"]`),detail=panel.querySelector(`[data-transition="${id}"]`);assert.ok(caption.textContent.includes(id==='T12'?'購入を準備する':'承認後差戻し'));assert.ok(detail.textContent.includes(t.condition));assert.ok(detail.textContent.includes(name(t.toId)));assert.equal(path.classList.contains('exception'),id==='T14');}
 results.push('STATE-CAPTION-002');
 svg.querySelector('[data-state="購入準備済み"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 for(const [id,related]of [['T12',true],['T14',false]])assert.equal([...svg.querySelectorAll(`[data-transition-id="${id}"] tspan`)].every(t=>t.classList.contains('review-related')),related);
 svg.querySelector('[data-state="差戻し"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 for(const [id,related]of [['T12',false],['T14',true]])assert.equal([...svg.querySelectorAll(`[data-transition-id="${id}"] tspan`)].every(t=>t.classList.contains('review-related')),related);
 const order=[...svg.children],labels=[...svg.querySelectorAll('.state-diagram-edge-label')],paints=[...svg.querySelectorAll('[data-exception-paint]')];
 assert.ok(paints.length);assert.ok(paints.every(p=>labels.every(label=>order.indexOf(p)<order.indexOf(label))),'selected dashed paint remains behind every caption');
 const focused=svg.querySelector('[data-state="申請済み"]');window.document.body.append(panel);focused.focus();focused.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert.equal(window.document.activeElement,focused,'selection keeps keyboard focus');focused.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(focused.getAttribute('aria-pressed'),'false','Escape clears the selected state');
 results.push('STATE-CAPTION-003');validateAuthority(readFileSync('verification/state-caption-placement.check-items.json'));coverage(results);
 console.log(JSON.stringify({domChecks:results,transitions:rows.length,browser:'separate'}));
}finally{window.close();}
