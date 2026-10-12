import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';
import {deploymentContext} from '../src/deployment.ts';
const prod='alder-web-viewer',a='/alder/preview/pr-194/scope-20261012-01/',b='/alder/preview/pr-194/second/';
assert.equal(deploymentContext('/alder/').database,prod);assert.equal(deploymentContext('/alder/index.html').database,prod);
assert.equal(deploymentContext(a).database,prod+':preview:pr-194:scope-20261012-01');assert.deepEqual(deploymentContext(a+'index.html'),deploymentContext(a));assert.notEqual(deploymentContext(a).database,deploymentContext(b).database);
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}}),db=new IDBFactory(),windows=[];
const wait=()=>new Promise(r=>setTimeout(r,300));
async function open(path){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test'+path,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.eval(outputFiles[0].text);for(let i=0;i<100&&w.document.getElementById('open').disabled;i++)await new Promise(r=>setTimeout(r,25));return w.document;}
try{
 const root=await open('/alder/');assert.equal(root.getElementById('preview-badge').hidden,true);root.getElementById('open-sample').click();await wait();
 const first=await open(a);assert.equal(first.querySelectorAll('.tab').length,0);assert.equal(first.getElementById('preview-badge').hidden,false);assert.match(first.getElementById('preview-badge').textContent,/scope-20261012-01/);first.getElementById('open-sample').click();first.getElementById('hide-outside').click();first.getElementById('theme').click();await wait();
 const same=await open(a+'index.html?view=anything#node');assert.equal(same.querySelectorAll('.node').length,12);assert.equal(same.documentElement.dataset.theme,'dark');
 const second=await open(b);assert.equal(second.querySelectorAll('.tab').length,0);second.getElementById('open-sample').click();second.getElementById('prefer-write').click();await wait();
 const production=await open('/alder/index.html');assert.equal(production.getElementById('preview-badge').hidden,true);assert.equal(production.querySelectorAll('.node').length,25);assert.equal(production.querySelectorAll('.edge').length,63);assert.equal(production.documentElement.dataset.theme,'light');assert.equal(production.getElementById('hide-outside').checked,false);
 const again=await open(a+'?another=value#other');assert.equal(again.querySelectorAll('.node').length,12);assert.equal(again.getElementById('prefer-write').checked,false);assert.equal(again.documentElement.dataset.theme,'dark');
 console.log(JSON.stringify({model:'DOM/IndexedDB',checks:['production DB and old session retained','preview never imports production','version-specific DB isolation','same version slash/index/query/hash restoration','runtime-only badge and database with identical bundle','production data/theme/options unchanged after previews']},null,2));
}finally{windows.forEach(w=>w.close());}
