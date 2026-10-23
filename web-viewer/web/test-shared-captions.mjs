import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
import {matrixPlan} from '../src/matrix-layout.ts';
import {RouteCache} from '../src/route-cache.ts';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
const object=name=>`# Object ${name}\n\n## Scope\n\nfalse\n\n## Icon\n\nshield-check\n\n## Information\n\n- 利用者の識別情報\n\n`;
const activity=name=>`# Activity ${name}\n\n## Scope\n\ntrue\n\n## Why\n\n依頼を扱うため。\n\n## When\n\n依頼を受けたとき。\n\n## Who\n\n担当者\n\n## Where\n\n規定なし。\n\n## How\n\n### Input\n\n- 認証基盤 — 認証済み作業者の識別情報\n- 別の認証基盤 — 認証済み作業者の識別情報\n${name==='業務C'?'- 認証基盤 — 別の識別情報\n':''}\n### Procedure\n\n受け取った識別情報を使い依頼を扱う。\n\n### Output\n\n(none)\n\n## Result\n\n依頼の扱いが決まる。\n\n`;
const raw='# 共有キャプション\n\n'+object('認証基盤')+object('別の認証基盤')+['業務A','業務B','業務C'].map(activity).join('');
const d=parseDesign(raw),unchanged=JSON.stringify(d),plan=matrixPlan(d.graph,d.activityOrder);
const source=plan.positions['認証基盤'],next=Object.values(plan.positions).filter(p=>p[1]>source[1]).sort((a,b)=>a[1]-b[1])[0];
assert.equal(next[1]-source[1],158,'three equal captions plus one different caption need two lines, not four');
const boxes=d.graph.nodes.map(n=>({id:n.id,x:plan.positions[n.id][0],y:plan.positions[n.id][1],width:260,height:68}));
const routes=new RouteCache().update({},d,boxes,d.graph.relations,plan.wires),same=d.graph.relations.map((r,i)=>({r,i})).filter(({r})=>r.from==='認証基盤'&&r.label==='認証済み作業者の識別情報');
assert.equal(same.length,3);for(const {i}of same)assert.deepEqual(routes[i].label,routes[same[0].i].label);
assert.equal(new Set(same.map(({i})=>routes[i].path)).size,3,'all three destination paths remain');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
const until=async fn=>{for(let i=0;i<100&&!fn();i++)await new Promise(r=>setTimeout(r,20));assert.ok(fn());};
try{
 w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>!$('open-text').disabled);$('open-text').click();$('source-text').value=raw;$('source-submit').click();await until(()=>w.document.querySelectorAll('.edge').length===7);
 const labels=()=>[...w.document.querySelectorAll('.edge-label')],membership=n=>n.dataset.relations.split(' ').map(Number);
 assert.equal(labels().length,3,'one shared caption per source and text; different text and source stay separate');
 assert.deepEqual(labels().flatMap(membership).sort((a,b)=>a-b),[0,1,2,3,4,5,6]);
 const shared=()=>labels().find(n=>membership(n).length===3);assert.ok(shared());
 $('layout-lock').click();const selected=w.document.querySelector('[data-node="業務B"]');selected.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});selected.onpointerup({pointerId:1});
 assert.ok(shared().classList.contains('review-related'),'later group member highlights the common caption');assert.equal(shared().classList.contains('muted'),false);
 $('selected-edges-only').click();assert.equal(w.document.querySelectorAll('.edge').length,2);assert.equal(labels().length,2);assert.ok(labels().every(n=>membership(n).length===1),'only visible members are attributed');
 $('selected-edges-only').click();assert.equal(labels().length,3);
 w.document.querySelector('[data-node="業務B"] .activity-open').click();assert.equal(w.document.querySelectorAll('.edge').length,2);assert.equal(labels().length,2);
 assert.equal(JSON.stringify(d),unchanged,'presentation does not rewrite source/graph');
 for(const focus of d.activityOrder){const projected=activityDesign(d,focus);assert.equal(projected.graph.relations.length,focus==='業務C'?3:2);}
 console.log('shared captions: 7 edges / 3 labels; source/text boundaries; compact two-line gap; distinct destination paths; related member highlighting; selected-only and Activity detail; source immutable');
}finally{w.close();}
