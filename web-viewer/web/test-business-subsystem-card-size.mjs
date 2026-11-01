import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const path='verification/business-subsystem-card-size.check-items.json',hash='231dc6dc1f025afa9d3ec5c8651326d2dbbd8a9f1ec0641586dbace26b4cb923';
const verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);verify(readFileSync(path));assert.throws(()=>verify(Buffer.from('{}')));
const ids=JSON.parse(readFileSync(path)).checks.map(c=>c.id);assert.deepEqual(ids,['CARD-SIZE-001','CARD-SIZE-002','CARD-SIZE-003']);
const input=readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json'),pkg=JSON.parse(input),model=pkg.documents.find(d=>d.kind==='conceptModel'),business=pkg.documents.find(d=>d.kind==='businessDesign');
const code=(await build({entryPoints:['src/subsystem-overview.ts'],bundle:true,write:false,format:'iife',globalName:'Overview'})).outputFiles[0].text;
const w=new JSDOM('<style></style><div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.document.querySelector('style').textContent=readFileSync('src/style.css','utf8');
w.eval(code+';globalThis.Overview=Overview;');const original=JSON.stringify(model),opened=[];
const storage='alder-subsystem-overview-v2:/:purchase';w.localStorage.setItem(storage,JSON.stringify({zoom:.62,positions:{'group-request':[180,190]},selection:{kind:'model',id:'group-request'}}));
const overview=w.Overview.createSubsystemOverview(w.document,{model,business},'purchase',id=>opened.push(id),()=>{});w.document.querySelector('#host').append(overview.root);
const card=w.document.createElement('div');card.className='node business';w.document.querySelector('#host').append(card);
try{
 const style=w.getComputedStyle(card),expected=[260,68];assert.deepEqual([parseFloat(style.width),parseFloat(style.height)],expected,'business card size baseline');
 assert.equal(overview.root.querySelector('.canvas-zoom').textContent,'62%','saved zoom remains untouched');
 const nodes=[...overview.root.querySelectorAll('[data-review-group]')];assert.equal(nodes.length,model.reviewGroups.length);
 for(const node of nodes){const rect=node.querySelector('.state-diagram-node'),surface=node.querySelector('.graph-card-surface'),content=node.querySelector('foreignObject:not(.concept-selection-glow)'),size=e=>[Number(e.getAttribute('width')),Number(e.getAttribute('height'))];assert.deepEqual(size(rect),expected,node.dataset.reviewGroup+' graph geometry');assert.deepEqual(size(content),expected,'content clipping box matches geometry');assert.deepEqual([parseFloat(surface.style.width),parseFloat(surface.style.height)],expected,'surface matches geometry');assert.equal(node.querySelector('.subsystem-overview-name').textContent,model.reviewGroups.find(g=>g.id===node.dataset.reviewGroup).title);assert(node.querySelector('.subsystem-overview-role-icon'));assert(node.querySelector('.subsystem-overview-open'));}
 const moved=overview.root.querySelector('[data-review-group="group-request"] .state-diagram-node');assert.deepEqual([+moved.getAttribute('x'),+moved.getAttribute('y')],[180,190],'saved position remains unchanged');assert.equal(overview.selected(),'group-request');overview.root.querySelector('[data-review-group="group-request"] .subsystem-overview-open').click();assert.deepEqual(opened,['group-request']);
 assert.notDeepEqual([300,86],expected,'the former different card size is rejected');assert.equal(JSON.stringify(model),original);assert.deepEqual(readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json'),input);
}finally{w.close();}verify(readFileSync(path));console.log(JSON.stringify({checks:['CARD-SIZE-001','CARD-SIZE-002'],scope:'actual subsystem DOM with business CSS; CARD-SIZE-003 uses independent state and concept regressions and native Chrome'}));
