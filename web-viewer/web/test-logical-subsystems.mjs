import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const authority=JSON.parse(readFileSync('verification/logical-subsystem-review.check-items.json','utf8'));
assert.deepEqual(authority.checks.map(item=>item.id),['LOGICAL-REVIEW-001','LOGICAL-REVIEW-002','LOGICAL-REVIEW-003','LOGICAL-REVIEW-004']);
for(const item of authority.checks)for(const key of ['condition','guarantee','reason','verification'])assert(item[key]);
const bundle=(await build({entryPoints:['src/viewer-shell.ts'],bundle:true,write:false,format:'iife',globalName:'Shell',loader:{'.css':'empty'}})).outputFiles[0].text;
const html='<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>';
function open(query='&concept=subsystems',saved,activities=[]){
 const w=new JSDOM(html,{url:'https://viewer.test/?view=concept&conceptFixture=purchase'+query,runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.CSS={escape:value=>value};if(saved)w.localStorage.setItem('alder-logical-subsystems-v1:/',saved);
 w.eval(bundle+';globalThis.Shell=Shell;');let key='purchase',opened;const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>({key,viewKey:'overview',activities,states:[],views:[{key:'overview',name:'業務全体図'}]}),openActivity(id){opened=id;},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});shell.syncDocument();return{w,d:w.document,opened:()=>opened,other(){key='other';shell.syncDocument();}};
}
const {w,d,other}=open();
try{
 const panel=d.querySelector('.logical-subsystems-panel');assert(panel&&!panel.hidden);assert.equal(d.querySelector('.landscape-modes button[aria-pressed=true]').textContent,'論理サブシステム');assert.equal(d.querySelectorAll('.concept-tabs .tab').length,1);
 assert.equal(panel.querySelector('.logical-draft-label').textContent,'稟議と入荷予実の分割案');
 assert.deepEqual([...panel.querySelectorAll('[data-logical-group] button')].map(n=>n.textContent),['稟議（案）','入荷予実（案）']);
 const expected={request:'approval',decision:'approval',progress:'approval',preparation:'receiving',result:'receiving'};
 assert.equal(panel.querySelectorAll('[data-logical-node]').length,5);
 for(const [id,group]of Object.entries(expected)){
  const box=panel.querySelector(`[data-logical-node="${id}"] rect.state-diagram-node`),region=panel.querySelector(`[data-logical-group="${group}"] rect`);assert(box&&region);
  for(const [position,size]of [['x','width'],['y','height']]){const start=Number(box.getAttribute(position)),end=start+Number(box.getAttribute(size)),lower=Number(region.getAttribute(position)),upper=lower+Number(region.getAttribute(size));assert(start>=lower&&end<=upper,`${id} must be contained in ${group}`);}
 }
 assert.deepEqual([...panel.querySelectorAll('[data-logical-edge]')].map(n=>[n.dataset.from,n.dataset.to]),[['request','decision'],['decision','preparation'],['preparation','result'],['result','progress']]);
 assert([...panel.querySelectorAll('[data-logical-edge]')].every(path=>path.dataset.unrouted==='false'),'initial routes must not be obstructed');
 assert.deepEqual([...panel.querySelectorAll('[data-logical-caption] button')].map(n=>n.textContent),['承認済みの版・品目','入荷・未購入の結果']);
 assert.deepEqual([...panel.querySelectorAll('.logical-review-section h2')].map(n=>n.textContent),['メリット','デメリット・必要な管理','レビューポイント']);
 const content=panel.textContent;for(const phrase of ['内部構造の変更','相関を業務情報と区別','複数の依頼元','差戻し','確定した版'])assert(content.includes(phrase),phrase);assert(!/テーブル|トランザクション|API|別DB/.test(content),'logical view must not prescribe physical design');
 const related=d.querySelector('.concept-related');assert(related.hidden);panel.querySelector('[data-logical-node=request]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(related.hidden,'selecting a node must not auto-open drawer');assert(panel.querySelector('[data-logical-node=request]').classList.contains('selected'));assert(panel.querySelector('[data-logical-node=decision]').classList.contains('review-neighbor'));assert(panel.querySelector('[data-logical-edge=request-decision]').classList.contains('review-related'));
 d.querySelector('#drawer').click();assert(!related.hidden);assert.equal(related.querySelector('.shell-heading strong').textContent,'申請・版・品目');
 const viewport=panel.querySelector('.diagram-viewport'),caption=panel.querySelector('[data-logical-caption=decision-preparation] button'),captures=[];viewport.setPointerCapture=id=>captures.push(id);const down=new w.MouseEvent('pointerdown',{bubbles:true,button:0});Object.defineProperties(down,{pointerType:{value:'mouse'},pointerId:{value:7}});caption.dispatchEvent(down);assert.deepEqual(captures,[],'interactive graph labels must not be captured by canvas panning');
 caption.click();assert.equal(related.querySelector('.shell-heading strong').textContent,'承認済みの版・品目');assert(panel.querySelector('[data-logical-edge=decision-preparation]').classList.contains('review-related'));
 related.querySelector('.shell-heading button').click();panel.querySelector('[data-logical-group=approval] button').click();assert(related.hidden,'selecting a group must preserve closed drawer');d.querySelector('#drawer').click();assert.equal(related.querySelector('.shell-heading strong').textContent,'稟議');assert.match(related.textContent,/まとまりの理由/);
 panel.querySelector('.zoom-in').click();assert.equal(panel.querySelector('.canvas-zoom').textContent,'120%');panel.querySelector('.graph-settings-toggle').click();panel.querySelector('.reset-layout').click();assert.equal(panel.querySelector('.canvas-zoom').textContent,'100%');
 const saved=w.localStorage.getItem('alder-logical-subsystems-v1:/');assert(saved);const restored=open('&concept=subsystems',saved);try{assert.equal(restored.d.querySelector('.logical-subsystems-panel').hidden,false);restored.d.querySelector('#drawer').click();assert.equal(restored.d.querySelector('.concept-related .shell-heading strong').textContent,'稟議');}finally{restored.w.close();}
 other();assert.equal(d.querySelector('.logical-subsystems-panel'),null,'document changes discard logical demo');
}finally{w.close();}
const activity={id:'ef8c1f4f-aff8-5f76-8ebd-a3445ae443f5',name:'購入を準備する'};
for(const [actual,enabled]of [[activity,true],[{...activity,id:'wrong-document'},false]]){
 const h=open('&concept=subsystems',undefined,[actual]);try{h.d.querySelector('[data-logical-node=preparation]').dispatchEvent(new h.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));h.d.querySelector('#drawer').click();const link=h.d.querySelector('.concept-related-content .shell-evidence');assert.equal(link.disabled,!enabled);link.click();assert.equal(h.opened(),enabled?activity.id:undefined,'related activity requires matching ID and name');}finally{h.w.close();}
}
const moved=open('&concept=subsystems',JSON.stringify({positions:{request:[-20,-30]}}));try{const svg=moved.d.querySelector('.logical-diagram'),bounds=svg.querySelector('[data-logical-group=approval] rect'),[x,y]=svg.getAttribute('viewBox').split(/\s+/).map(Number);assert(x<=Number(bounds.getAttribute('x'))&&y<=Number(bounds.getAttribute('y')),'canvas expansion includes the moved group boundary');}finally{moved.w.close();}
console.log('PASS LOGICAL-REVIEW-001..004: distinct modes, logical boundaries and directional routes, explicit review content, shared controls, selection and drawer');
