import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {conceptDiagram} from '../src/concept-layout.js';
const bundle=async(path,globalName)=>(await build({entryPoints:[path],bundle:true,write:false,format:'iife',globalName,loader:{'.css':'empty'}})).outputFiles[0].text;
const dataWindow=new JSDOM('',{runScripts:'outside-only'}).window;dataWindow.eval(await bundle('src/concept-review-fixture.ts','Review')+';globalThis.Review=Review;');
const {reviewGroups,reviewBoundaries,reviewGraph}=dataWindow.Review;
const ids=['group-request','group-decision','group-handoff','group-result'];
assert.deepEqual(Array.from(reviewGroups,g=>g.id),ids);
const visible={ 'group-request':['request','version','item'],'group-decision':['request'],'group-handoff':['request','preparation'],'group-result':['request','item','receipt','line']};
const code=await bundle('src/concept-canvas.js');
const html=readFileSync('concept.html','utf8');
for(const id of ids){
 const w=new JSDOM(html,{url:'https://viewer.test/concept.html?group='+id,runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.HTMLCanvasElement.prototype.getContext=()=>({font:'',measureText:v=>({width:v.length*14})});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.SVGElement.prototype.focus=()=>{};
 try{w.eval(code);const d=w.document,graph=reviewGraph(id);assert.deepEqual([...d.querySelectorAll('.node')].map(n=>n.dataset.node),visible[id]);const sizes=new Map(Object.entries(graph.tables).map(([key,t])=>[key,{w:Math.ceil(Math.max(220,t.name.length*14+64,...t.fields.map(([,n])=>n.length*14+24))),h:44+t.fields.length*25}]));const expected=conceptDiagram(Array.from(graph.ids),Array.from(graph.edges),sizes);
 for(const card of d.querySelectorAll('.node')){const rect=card.querySelector('.concept-select>rect'),box=expected.boxes.get(card.dataset.node);assert.equal(+rect.getAttribute('x'),box.x);assert.equal(+rect.getAttribute('y'),box.y);}
 for(const wire of d.querySelectorAll('.wire'))assert.equal(wire.getAttribute('d'),expected.routing.routes.find(r=>r.id===+wire.dataset.edge).d);
 const target=visible[id][0];d.querySelector(`[data-node="${target}"] .concept-select`).dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(d.querySelector('.node.selected').dataset.node,target);
 assert(d.querySelector('.zoom-in'));assert(d.querySelector('.reset-layout'));
 if(id==='group-request'){const content=d.querySelector('svg').textContent;for(const forbidden of ['現在判断','準備所属','終結結果','購入しない確定数量'])assert(!content.includes(forbidden),forbidden+' belongs to a downstream review');assert.equal(d.querySelectorAll('.wire').length,2);assert.equal(d.querySelector('[data-from="request"]').dataset.toCardinality,'1..N');assert.equal(d.querySelector('[data-from="version"]').dataset.toCardinality,'1..N');}
 }finally{w.close();}
}
assert.equal(reviewBoundaries.length,6);for(const group of reviewGroups){assert.equal(typeof group.reviewer,'string');assert(group.reviewer.trim());assert(group.activities.length&&group.consult.length&&group.guarantee);}
const shellCode=await bundle('src/viewer-shell.ts','Shell');
function harness(query){
 const w=new JSDOM('<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>',{url:'https://viewer.test/?view=concept&conceptFixture=purchase'+query,runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.eval(shellCode+';globalThis.Shell=Shell;');let key='purchase';const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>({key,viewKey:'overview',activities:[],states:[{id:'request',name:'購入申請'}],views:[{key:'overview',name:'業務全体図'}]}),openActivity(){},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});shell.syncDocument();return{w,d:w.document,shell,other(){key='other';shell.syncDocument();}};
}
const {w,d,other}=harness('');
try{
 assert.equal(d.querySelector('.concept-review-landscape').hidden,false);assert.equal(d.querySelectorAll('[data-review-group]').length,4);assert.equal(d.querySelectorAll('.review-boundaries li').length,6);assert.equal(d.querySelectorAll('.review-group-card .review-owner').length,4);assert.equal(d.querySelector('#concept-tab-landscape .view-tab-name').textContent,'購買業務の全体像');assert(d.querySelector('#drawer').disabled);
 d.querySelector('[data-review-group="group-request"] .review-open').click();assert.equal(new URL(w.location.href).searchParams.get('concept'),'group-request');const frame=d.querySelector('[data-concept-view="group-request"]');assert(frame);assert.match(frame.src,/group=group-request/);assert.equal(d.querySelector('.concept-review-heading h1').textContent,'購入要求・申請内容');assert.equal(d.querySelectorAll('.concept-review-heading .review-owner').length,1);assert.match(d.querySelector('.concept-review-heading').textContent,/申請業務責任者/);assert.match(d.querySelector('.concept-review-heading').textContent,/後続への保証/);
 const send=(type,id)=>w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:frame.contentWindow,data:{type,id}}));send('alder-concept-select','request');assert(d.querySelector('.concept-related').hidden);d.querySelector('#drawer').click();assert.equal(d.querySelector('.concept-related .shell-heading strong').textContent,'購入申請');assert.equal(d.querySelector('.concept-related-content li').textContent,'申請者');assert.deepEqual([...d.querySelectorAll('.concept-related-content li')].map(e=>e.textContent),['申請者','現在の提出版']);
 send('alder-concept-select','item');assert.match(d.querySelector('.concept-related-content').textContent,/依頼数量 Q/);assert(![...d.querySelectorAll('.concept-related-content li')].some(e=>e.textContent.includes('購入しない')));
 send('alder-concept-open','version');assert.match(d.querySelector('[data-concept-view="version"]').src,/focus=version/);assert.equal(frame.hidden,true);assert(d.querySelector('#concept-tab-group-request'));
 d.querySelector('[data-explorer-key="concept:group-request"]').click();assert.equal(d.querySelector('[data-concept-view="group-request"]'),frame);assert.equal(d.querySelectorAll('#concept-tab-group-request').length,1);
 d.querySelector('.review-back').click();assert.equal(d.querySelector('.concept-review-landscape').hidden,false);w.history.back();await new Promise(r=>setTimeout(r,30));assert.equal(d.querySelector('#concept-tab-group-request').getAttribute('aria-current'),'true');w.history.forward();await new Promise(r=>setTimeout(r,30));assert.equal(d.querySelector('#concept-tab-landscape').getAttribute('aria-current'),'true');
 d.querySelector('[aria-label="概念モデル：購入要求・申請内容のタブを閉じる"]').click();assert.equal(d.querySelector('#concept-tab-group-request'),null);d.querySelector('[data-explorer-key="concept:group-request"]').click();assert(d.querySelector('#concept-tab-group-request'));
 other();assert.equal(d.querySelectorAll('.concept-tabs .tab').length,0);assert.equal(d.querySelectorAll('[data-concept-view="group-request"]').length,0);d.querySelector('[data-explorer-key="concept:landscape"]').click();assert.equal(d.querySelector('.concept-empty').hidden,false);assert.equal(d.querySelector('.concept-review-landscape').hidden,true);
}finally{w.close();}
for(const id of ids){const h=harness('&concept='+id);try{assert.equal(h.d.querySelector('.concept-review-heading h1').textContent,reviewGroups.find(g=>g.id===id).name);assert.match(h.d.querySelector('.concept-frame:not([hidden])').src,new RegExp('group='+id));}finally{h.w.close();}}
const resumed=harness('&concept=group-request&review=concept&reviewState=request');try{resumed.shell.applyReview();assert.equal(resumed.d.querySelector('#concept-tab-group-request').getAttribute('aria-current'),'true','review entry must not override an explicit classification on reload');assert.equal(resumed.d.querySelector('.concept-review-heading h1').textContent,'購入要求・申請内容');}finally{resumed.w.close();}
const authority=JSON.parse(readFileSync('verification/concept-review.check-items.json','utf8'));assert.deepEqual(authority.checks.map(c=>c.id),['CONCEPT-REVIEW-001','CONCEPT-REVIEW-002','CONCEPT-REVIEW-003','CONCEPT-REVIEW-004','CONCEPT-REVIEW-005']);for(const c of authority.checks)for(const key of ['condition','guarantee','reason','verification'])assert(c[key]);dataWindow.close();console.log('PASS CONCEPT-REVIEW-001..005: four groups, single reviewer, scoped actual SVG via common B, drawer, navigation, history, direct links and document boundary');
