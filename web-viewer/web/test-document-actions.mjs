// Deterministic DOM lifecycle gate; actual layout and native keyboard are browser-tested.
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
const {outputFiles}=await build({entryPoints:['src/document-actions.ts'],bundle:true,write:false,format:'iife',globalName:'DocumentActions'});
const w=new JSDOM('<div class="tab-strip"><nav id="tabs"><div class="tab active">Document</div></nav><button id="document-actions-toggle" aria-expanded="false" hidden>…</button><div id="document-actions"><button id="refresh" disabled aria-label="Refresh"></button><button id="save-image" aria-label="Save"></button><button id="copy-image" aria-label="Copy"></button><button id="edit-markdown" aria-label="Edit"></button></div></div><button id="outside">Outside</button>',{runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 const d=w.document,$=id=>d.getElementById(id),strip=d.querySelector('.tab-strip'),group=$('document-actions'),toggle=$('document-actions-toggle');
 let width=700,tabWidth=200,actionWidth=300;const rect=n=>({width:n,height:40,left:0,right:n,top:0,bottom:40});
 strip.getBoundingClientRect=()=>rect(width);Object.defineProperty(strip,'clientWidth',{get:()=>width});group.getBoundingClientRect=()=>rect(actionWidth);d.querySelector('.tab').getBoundingClientRect=()=>rect(tabWidth);
 const originals=[...group.children];let saves=0;$('save-image').onclick=()=>saves++;
 w.eval(outputFiles[0].text+';window.DocumentActions=DocumentActions;');const controller=w.DocumentActions.installDocumentActions(strip);
 assert.equal(strip.dataset.actionsMode,'inline');assert.equal(toggle.hidden,true);
 const update=n=>{width=n;controller.update();};
 update(499);assert.equal(strip.dataset.actionsMode,'menu');assert.equal(toggle.hidden,false);
 const key=(target,k)=>target.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));
 toggle.click();assert.equal(toggle.getAttribute('aria-expanded'),'true');assert.equal(d.activeElement,$('save-image'),'disabled refresh skipped');
 key(group,'ArrowUp');assert.equal(d.activeElement,$('edit-markdown'));key(group,'Home');assert.equal(d.activeElement,$('save-image'));key(group,'End');assert.equal(d.activeElement,$('edit-markdown'));
 key(group,'Escape');assert.equal(toggle.getAttribute('aria-expanded'),'false');assert.equal(d.activeElement,toggle);
 toggle.click();$('save-image').click();assert.equal(saves,1,'original handler retained');assert.equal(toggle.getAttribute('aria-expanded'),'false');assert.equal(d.activeElement,toggle);
 toggle.focus();for(let i=0;i<5;i++){controller.update();assert.equal(d.activeElement,toggle,'same menu mode keeps toggle focus');assert.equal(toggle.hidden,false);}
 toggle.click();$('outside').focus();assert.equal(toggle.getAttribute('aria-expanded'),'false','focus leaving closes');
 toggle.click();$('outside').dispatchEvent(new w.Event('pointerdown',{bubbles:true}));assert.equal(toggle.getAttribute('aria-expanded'),'false','outside pointer closes');
 toggle.focus();update(500);assert.equal(strip.dataset.actionsMode,'inline','exact fit stays inline');assert.equal(d.activeElement,$('save-image'),'focus recovers when toggle disappears');
 update(499);assert.equal(d.activeElement,toggle,'focus recovers when inline actions disappear');
 for(let i=0;i<20;i++){controller.update();assert.equal(strip.dataset.actionsMode,'menu','repeated measurement cannot oscillate');}
 update(500);for(let i=0;i<20;i++){controller.update();assert.equal(strip.dataset.actionsMode,'inline');}
 tabWidth=450;controller.update();assert.equal(strip.dataset.actionsMode,'menu','long title changes measured fit');tabWidth=100;controller.update();assert.equal(strip.dataset.actionsMode,'inline','short title restores inline');
 assert.deepEqual([...group.children],originals,'no proxy/replaced controls');assert.equal(d.querySelectorAll('#save-image').length,1);
 $('refresh').disabled=false;update(250);toggle.click();assert.equal(d.activeElement,$('refresh'),'new enabled state used immediately');
 console.log('document actions DOM: measured fit, stable boundary, original handlers, focus recovery, keyboard navigation and dismissal passed');
}finally{w.close();}
