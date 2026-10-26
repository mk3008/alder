import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

for(const [file,ids]of [['logical-subsystem-review.check-items.json',['LOGICAL-REVIEW-001','LOGICAL-REVIEW-002','LOGICAL-REVIEW-003','LOGICAL-REVIEW-004']],['logical-subsystem-flow.check-items.json',['LOGICAL-FLOW-001','LOGICAL-FLOW-002','LOGICAL-FLOW-003','LOGICAL-FLOW-004']]]){
 const authority=JSON.parse(readFileSync('verification/'+file,'utf8'));
 assert.deepEqual(authority.checks.map(item=>item.id),ids);
 for(const item of authority.checks)for(const key of ['condition','guarantee','reason','verification'])assert(item[key]);
}
const labelsAuthority=JSON.parse(readFileSync('verification/logical-subsystem-labels.check-items.json','utf8')).checks[0];
assert.equal(labelsAuthority.id,'LOGICAL-LABEL-001');
const expectedNames=labelsAuthority.expected;
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
 assert(!panel.textContent.includes(expectedNames.removedText));assert(panel.querySelector(':scope > h2').nextElementSibling.classList.contains('logical-subsystems-canvas'),'graph follows heading without the removed description');
 const groups=[...panel.querySelectorAll('[data-logical-group]')];assert.equal(groups.length,2);assert.deepEqual(groups.map(n=>n.querySelector('.logical-card-title').textContent),[expectedNames.approval,expectedNames.receiving]);
 assert.deepEqual(groups.map(n=>[...n.querySelectorAll('.logical-card-information')].map(x=>x.textContent)),[['申請・提出版・品目','承認・差戻し','稟議から見た進捗'],['購入準備・受領した購入対象','入荷・未購入の結果']]);
 const rect=id=>{const el=panel.querySelector(`[data-logical-group="${id}"] rect.state-diagram-node`);return Object.fromEntries(['x','y','width','height'].map(k=>[k,Number(el.getAttribute(k))]));};
 const upstream=rect('approval'),downstream=rect('receiving');assert(upstream.x<downstream.x&&upstream.y<downstream.y,'upstream must be upper left');
 const edges=[...panel.querySelectorAll('[data-logical-edge]')];assert.deepEqual(edges.map(n=>[n.dataset.from,n.dataset.to]),[['approval','receiving'],['receiving','approval']]);
 assert(edges.every(path=>path.dataset.unrouted==='false'),'initial routes must not be obstructed');
 assert.deepEqual([...panel.querySelectorAll('[data-logical-caption] button')].map(n=>n.textContent),['承認済みの版・品目','入荷・未購入の結果']);
 function ends(path){const numbers=[...path.getAttribute('d').matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));return [numbers.slice(0,2),numbers.slice(-2)];}
 const [[fx,fy],[tx,ty]]=ends(edges[0]);assert.equal(fy,upstream.y+upstream.height,'forward leaves bottom');assert.equal(tx,downstream.x,'forward enters left');assert(fx>=upstream.x&&fx<=upstream.x+upstream.width&&ty>=downstream.y&&ty<=downstream.y+downstream.height);
 const [[rx,ry],[ex,ey]]=ends(edges[1]);assert.equal(rx,downstream.x+downstream.width,'return leaves right');assert.equal(ex,upstream.x+upstream.width,'return enters right');assert(ry>=downstream.y&&ry<=downstream.y+downstream.height&&ey>=upstream.y&&ey<=upstream.y+upstream.height);assert(!edges[0].classList.contains('exception'));assert(edges[1].classList.contains('exception'));assert(panel.querySelector('[data-logical-return-paint][stroke-dasharray="6 5"]'),'return uses shared dashed painting');
 const svg=panel.querySelector('.logical-diagram'),[vx,vy,vw,vh]=svg.getAttribute('viewBox').split(/\s+/).map(Number);for(const caption of panel.querySelectorAll('[data-logical-caption]')){const x=Number(caption.getAttribute('x')),y=Number(caption.getAttribute('y'));assert(x>=vx&&y>=vy&&x+Number(caption.getAttribute('width'))<=vx+vw&&y+Number(caption.getAttribute('height'))<=vy+vh,'caption fits initial canvas');}
 assert.deepEqual([...panel.querySelectorAll('.logical-review-section h2')].map(n=>n.textContent),['メリット','デメリット・必要な管理','レビューポイント']);
 const content=panel.textContent;for(const phrase of ['内部構造の変更','相関を業務情報と区別','複数の依頼元','差戻し','確定した版'])assert(content.includes(phrase),phrase);assert(!/テーブル|トランザクション|API|別DB/.test(content),'logical view must not prescribe physical design');
 const related=d.querySelector('.concept-related');assert(related.hidden);panel.querySelector('[data-logical-group=approval]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(related.hidden,'selecting a group must not auto-open drawer');assert(panel.querySelector('[data-logical-group=approval]').classList.contains('selected'));assert(panel.querySelector('[data-logical-group=receiving]').classList.contains('review-neighbor'));assert(edges.every(path=>path.classList.contains('review-related')),'both incident directions are highlighted');assert(panel.querySelector('[data-logical-return-paint].review-related'));
 d.querySelector('#drawer').click();assert(!related.hidden);assert.equal(related.querySelector('.shell-heading strong').textContent,expectedNames.approval);assert.match(related.textContent,/まとまりの理由/);
 const viewport=panel.querySelector('.diagram-viewport'),caption=panel.querySelector('[data-logical-caption=decision-preparation] button'),captures=[];viewport.setPointerCapture=id=>captures.push(id);const down=new w.MouseEvent('pointerdown',{bubbles:true,button:0});Object.defineProperties(down,{pointerType:{value:'mouse'},pointerId:{value:7}});caption.dispatchEvent(down);assert.deepEqual(captures,[],'interactive graph labels must not be captured by canvas panning');
 caption.click();assert.equal(related.querySelector('.shell-heading strong').textContent,'承認済みの版・品目');assert(related.textContent.includes(`${expectedNames.approval} → ${expectedNames.receiving}`));assert(edges[0].classList.contains('review-related'));
 panel.querySelector('[data-logical-caption=result-progress] button').click();assert.equal(related.querySelector('.shell-heading strong').textContent,'入荷・未購入の結果');assert(related.textContent.includes(`${expectedNames.receiving} → ${expectedNames.approval}`));assert(edges[1].classList.contains('review-related'));
 related.querySelector('.shell-heading button').click();panel.querySelector('[data-logical-group=approval]').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(related.hidden,'selecting a group must preserve closed drawer');d.querySelector('#drawer').click();assert.equal(related.querySelector('.shell-heading strong').textContent,expectedNames.approval);
 panel.querySelector('.zoom-in').click();assert.equal(panel.querySelector('.canvas-zoom').textContent,'120%');panel.querySelector('.graph-settings-toggle').click();panel.querySelector('.reset-layout').click();assert.equal(panel.querySelector('.canvas-zoom').textContent,'100%');
 const saved=w.localStorage.getItem('alder-logical-subsystems-v1:/');assert(saved);const restored=open('&concept=subsystems',saved);try{assert.equal(restored.d.querySelector('.logical-subsystems-panel').hidden,false);restored.d.querySelector('#drawer').click();assert.equal(restored.d.querySelector('.concept-related .shell-heading strong').textContent,expectedNames.approval);}finally{restored.w.close();}
 other();assert.equal(d.querySelector('.logical-subsystems-panel'),null,'document changes discard logical demo');
}finally{w.close();}
const activity={id:'ef8c1f4f-aff8-5f76-8ebd-a3445ae443f5',name:'購入を準備する'};
for(const [actual,enabled]of [[activity,true],[{...activity,id:'wrong-document'},false]]){
 const h=open('&concept=subsystems',undefined,[actual]);try{h.d.querySelector('[data-logical-group=receiving]').dispatchEvent(new h.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));h.d.querySelector('#drawer').click();const link=h.d.querySelector('.concept-related-content .shell-evidence');assert.equal(link.disabled,!enabled);link.click();assert.equal(h.opened(),enabled?activity.id:undefined,'related activity requires matching ID and name');}finally{h.w.close();}
}
const moved=open('&concept=subsystems',JSON.stringify({positions:{approval:[-20,-30]}}));try{const svg=moved.d.querySelector('.logical-diagram'),bounds=svg.querySelector('[data-logical-group=approval] rect'),[x,y]=svg.getAttribute('viewBox').split(/\s+/).map(Number);assert(x<=Number(bounds.getAttribute('x'))&&y<=Number(bounds.getAttribute('y')),'canvas expansion includes the moved group boundary');}finally{moved.w.close();}
const migrated=open('&concept=subsystems',JSON.stringify({selection:{kind:'node',id:'preparation'}}));try{migrated.d.querySelector('#drawer').click();assert.equal(migrated.d.querySelector('.concept-related .shell-heading strong').textContent,expectedNames.receiving,'legacy selection maps to its subsystem');}finally{migrated.w.close();}
console.log('PASS LOGICAL-REVIEW-001,003..004 and LOGICAL-FLOW-001..004 and LOGICAL-LABEL-001: boundary-only data flows, route ports, review content, canvas and selection');
