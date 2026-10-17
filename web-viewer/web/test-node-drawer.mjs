import {documentControls} from './document-test-view.mjs';
// Legacy no-Group input regression; the current Group sample is tested separately.
// DOM/session contract. Pixel centering, overlays and colors have a separate browser gate.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from './legacy-viewer-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
assert.match(readFileSync('src/style.css','utf8'),/#canvas\{overflow:clip\}/);
const drawerCSS=readFileSync('src/style.css','utf8');
const rowRule=drawerCSS.match(/\.node-list-row\{([^}]+)\}/)?.[1];assert.ok(rowRule);assert.doesNotMatch(rowRule,/border(?:-bottom)?\s*:/,'item rows have no divider');
assert.match(drawerCSS,/\.node-list-row\.list-selected\{background:var\(--select\)\}/,'selected item highlight remains');
assert.match(drawerCSS,/\.scope-bulk\{[^}]*border-block:1px solid/);assert.match(drawerCSS,/\.role-group\{border-bottom:1px solid/);assert.match(drawerCSS,/#node-list-search\{[^}]*border:1px solid/);assert.match(drawerCSS,/#node-categories \[aria-selected=true\]\{[^}]*border-bottom-color:/);

const source=readFileSync('web/authorities/ungrouped-alder.md','utf8'),design=parseDesign(source);
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const db=new IDBFactory(),windows=[];
async function boot(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);while(w.document.getElementById('open').disabled)await new Promise(r=>setTimeout(r,20));return w.document;}
const layouts=d=>Object.fromEntries([...d.querySelectorAll('.node')].map(n=>[n.dataset.node,[n.style.left,n.style.top]]));
try{
 const d=await boot(),$=id=>d.getElementById(id),rows=()=>[...d.querySelectorAll('[data-list-node]')],row=id=>rows().find(r=>r.dataset.listNode===id),input=value=>{$('node-list-search').value=value;$('node-list-search').dispatchEvent(new d.defaultView.Event('input'));};
 assert.equal($('node-list-drawer').hidden,true);$('open-sample').click();$('node-list-toggle').click();assert.equal(d.activeElement.id,'node-list-close');assert.equal($('node-list-drawer').hidden,false);assert.equal(rows().length,10);for(let i=0;i<3;i++){$('node-list-close').click();assert.equal(d.activeElement.id,'node-list-toggle');$('node-list-toggle').click();assert.equal(d.activeElement.id,'node-list-close');}$('node-list-search').focus();assert.equal(d.activeElement.id,'node-list-search');
 const initial=layouts(d),inside=design.graph.nodes.find(n=>n.scope&&n.type==='business'),outside=design.graph.nodes.find(n=>!n.scope&&n.type==='business');
 // Model actual graph client dimensions and a desktop flank (no right overlay).
 const viewport=$('viewport');Object.defineProperty(viewport,'clientWidth',{value:900});Object.defineProperty(viewport,'clientHeight',{value:800});viewport.getBoundingClientRect=()=>({left:300,right:1200,top:108,bottom:908,width:900,height:800});$('formattedMarkdownDrawer').getBoundingClientRect=()=>({left:1200,right:1580,top:108,bottom:908,width:380,height:800});
 row(inside.id).querySelector('.node-navigate').click();assert.deepEqual(layouts(d),initial);assert.equal($('zoom').textContent,'100%');const p=initial[inside.id].map(parseFloat);assert.equal(p[0]+130+parseFloat($('nodes').style.left)-viewport.scrollLeft,450);assert.equal(p[1]+34+parseFloat($('nodes').style.top)-viewport.scrollTop,400);
 const cameraExtent=()=>[$('canvas').style.width,$('canvas').style.height],extent=cameraExtent();viewport.scrollLeft=parseFloat(extent[0])-900;viewport.scrollTop=parseFloat(extent[1])-800;viewport.onscroll();for(let i=0;i<4;i++){$('layout-lock').click();assert.deepEqual(cameraExtent(),extent,'redrawing at the far edge cannot accumulate view margins');}
 row(inside.id).querySelector('.node-navigate').click();const beforePinch=[viewport.scrollLeft,viewport.scrollTop],fire=(type,id,x,y)=>{const e=new d.defaultView.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y});viewport.dispatchEvent(e);};
 // Same local midpoint before/after, distance doubles: world anchor includes inset.
 fire('pointerdown',1,650,508);fire('pointerdown',2,850,508);fire('pointermove',1,550,508);fire('pointermove',2,950,508);assert.equal($('zoom').textContent,'200%');assert.deepEqual([viewport.scrollLeft,viewport.scrollTop],[(beforePinch[0]+450)*2-450,(beforePinch[1]+400)*2-400]);assert.equal(parseFloat($('nodes').style.left),900);assert.equal(parseFloat($('nodes').style.top),800);assert.equal(parseFloat($('canvas').style.width),parseFloat($('nodes').style.width)*2+1800);assert.equal(parseFloat($('canvas').style.height),parseFloat($('nodes').style.height)*2+1600);assert.deepEqual(layouts(d),initial);fire('pointerup',1,550,508);fire('pointerup',2,950,508);

 row(inside.id).querySelector('.node-eye').click();assert.equal(layouts(d)[inside.id],undefined);assert.ok(row(inside.id));assert.equal(row(inside.id).querySelector('.node-eye').getAttribute('aria-pressed'),'false');const hiddenLayout=layouts(d),scroll=[$('viewport').scrollLeft,$('viewport').scrollTop];row(inside.id).querySelector('.node-navigate').click();assert.deepEqual(layouts(d),hiddenLayout);assert.deepEqual([$('viewport').scrollLeft,$('viewport').scrollTop],scroll);row(inside.id).querySelector('.node-eye').click();assert.deepEqual(layouts(d),initial);
 row(outside.id).querySelector('.node-eye').click();assert.equal($('scope-outside').getAttribute('aria-pressed'),'mixed');assert.match($('scope-count').textContent,/12\/13/);$('scope-outside').click();assert.deepEqual(layouts(d),initial);$('scope-outside').click();assert.equal(Object.keys(layouts(d)).length,12);row(outside.id).querySelector('.node-eye').click();assert.equal(Object.keys(layouts(d)).length,13);assert.equal($('scope-outside').getAttribute('aria-pressed'),'mixed');$('scope-outside').click();assert.deepEqual(layouts(d),initial);
 d.querySelector('[data-category=role]').click();assert.equal(d.querySelector('[data-category=role]').getAttribute('aria-selected'),'true');assert.ok(d.querySelectorAll('[data-role]').length);assert.equal(d.querySelectorAll('.role-children .who-badge,.node-navigate svg').length,0);const role=d.querySelector('[data-role]');role.click();assert.equal(d.querySelector('[data-role]').getAttribute('aria-expanded'),'false');d.querySelector('[data-role]').click();input('not-found');assert.equal(rows().length,0);input('');
 d.querySelector('[data-category=activity]').click();row(inside.id).querySelector('.node-eye').click();assert.equal(layouts(d)[inside.id],undefined,'hidden state remains in the current document');
 $('node-list-search').focus();$('node-list-search').dispatchEvent(new d.defaultView.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal($('node-list-drawer').hidden,true);assert.equal(d.activeElement.id,'node-list-toggle');
 await new Promise(r=>setTimeout(r,300));const restored=await boot();assert.equal(layouts(restored)[inside.id],undefined);assert.equal(Object.keys(layouts(restored)).length,24);assert.deepEqual({...layouts(restored),[inside.id]:initial[inside.id]},initial);
 assert.equal(restored.getElementById('zoom').textContent,'200%');assert.equal(restored.getElementById('nodes').style.left,'900px');assert.equal(restored.getElementById('nodes').style.top,'800px');
 const isolatedSource=source+'\n# Object 孤立Object\n\n## Scope\n\ntrue\n\n## Icon\n\nfile\n\n## Information\n\n- 独立した情報\n';
 $('open-text').click();$('source-text').value=isolatedSource;await $('source-submit').onclick();assert.equal(Object.keys(layouts(d)).length,26);assert.ok(layouts(d)['孤立Object']);$('scope-outside').click();assert.ok(layouts(d)['孤立Object'],'isolated Object is not hidden by scope-outside or missing incident edges');

 console.log(JSON.stringify({model:'DOM/IndexedDB',checks:['default closed and focus/Escape','Activity/Object/Role categories and search','role header icons only','inside/outside individual hide remains listed','hidden name inert','scope bulk mixed→show all and individual override','tab isolation and reload persistence','world positions retained','nonzero view inset centers exactly and pinch anchors correctly','far-edge redraw does not accumulate padding','camera inset/zoom restored','isolated Object stays visible']},null,2));
}finally{windows.forEach(w=>w.close());}
