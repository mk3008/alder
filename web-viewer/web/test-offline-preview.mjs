import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync,mkdirSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';
import {embedOfflineConcept,inlineOfflineHTML} from '../../tools/viewer-preview.mjs';

const authority=readFileSync('verification/offline-review.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'ecc62819781cd8e8f6cf286d4c1e0908b81cd9706bba3fce2601febd222d3489');
assert.deepEqual(JSON.parse(authority).checks.map(item=>item.id),['OFFLINE-REVIEW-001','OFFLINE-REVIEW-002']);
const dir=mkdtempSync(join(tmpdir(),'alder-offline-'));
try{
 mkdirSync(join(dir,'assets'));
 writeFileSync(join(dir,'assets/chunk.js'),'export const value="chunk loaded";');
 writeFileSync(join(dir,'assets/main.js'),'import {value} from "./chunk.js"; document.body.dataset.result=value;');
 writeFileSync(join(dir,'assets/first.css'),'body{color:red}');
 writeFileSync(join(dir,'assets/second.css'),'body{background:blue}');
 const html='<!doctype html><html><head><script type="module" crossorigin src="./assets/main.js"></script><link rel="modulepreload" href="./assets/chunk.js"><link rel="stylesheet" href="./assets/first.css"><link rel="stylesheet" href="./assets/second.css"></head><body></body></html>';
 const output=inlineOfflineHTML(html,dir),dom=new JSDOM(output.standalone,{runScripts:'outside-only'});
 try{
  assert.equal(dom.window.document.querySelectorAll('script[src],link[rel=stylesheet],link[rel=modulepreload]').length,0,'no external execution assets remain');
  assert.deepEqual([...dom.window.document.querySelectorAll('style')].map(node=>node.textContent),['body{color:red}','body{background:blue}'],'all styles remain in order');
  dom.window.eval(output.script);assert.equal(dom.window.document.body.dataset.result,'chunk loaded','a split module is present and executable');
 }finally{dom.window.close();}
 assert.throws(()=>inlineOfflineHTML(html.replace('./assets/main.js','../main.js'),dir),/asset path/);
 const embeddedInput='<html><script>window.evil=true</script></html>',embedded=new JSDOM(embedOfflineConcept(output.standalone,embeddedInput),{runScripts:'dangerously'});
 try{assert.equal(embedded.window.__alderConceptHtml,embeddedInput);assert.equal(embedded.window.evil,undefined,'embedded page remains data until used as a frame');}finally{embedded.window.close();}
 assert.throws(()=>embedOfflineConcept('<html></html>',embeddedInput),/entrypoint/);
 assert.throws(()=>inlineOfflineHTML(html.replace('./assets/first.css','https://example.test/first.css'),dir),/asset path/);
 writeFileSync(join(dir,'assets/first.css'),'</style>');assert.throws(()=>inlineOfflineHTML(html,dir),/Unsafe inline style/);
 console.log('OFFLINE-REVIEW-001: split JavaScript and all CSS inlined; unsafe asset paths and delimiters rejected. OFFLINE-REVIEW-002 requires real Chrome.');
}finally{rmSync(dir,{recursive:true,force:true});}
