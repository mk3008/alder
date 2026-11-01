import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v4-check-review.json','utf8');
const code=(await build({stdin:{contents:"export {businessDetail} from './src/document-view.ts'; export {parseDocument} from './src/document-input.ts';",resolveDir:process.cwd()},bundle:true,write:false,format:'iife',globalName:'Details',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const w=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 w.eval(code+';globalThis.Details=Details;');const design=w.Details.parseDocument(raw),bd=design.model.business;
 for(const activity of bd.activities){const exceptions=bd.exceptions.filter(e=>e.activityId===activity.id),root=w.Details.businessDetail(design,activity.id),headings=[...root.querySelectorAll('h3')].map(e=>e.textContent);assert(!headings.includes('Exception'),'identical summary is not repeated: '+activity.name);for(const e of exceptions){assert.equal(headings.filter(h=>h==='Exception · '+e.name).length,1);const plain=e.description.replace(/[`*]/g,'');assert.equal(root.textContent.split(plain).length-1,1,'structured description remains exactly once: '+e.name);}}
 const a=bd.activities[0],original=a.exception;a.exception+='\n- **別の説明** — 個別例外にない内容。';let root=w.Details.businessDetail(design,a.id);assert([...root.querySelectorAll('h3')].some(h=>h.textContent==='Exception'));assert(root.textContent.includes('個別例外にない内容。'),'unmatched information is preserved');
 a.exception=original.replace('申請不成立を、承認業務による差戻しとは扱わない','追加の検討が必要');root=w.Details.businessDetail(design,a.id);assert(root.textContent.includes('追加の検討が必要'),'different information is not treated as a duplicate');
 bd.exceptions=bd.exceptions.filter(e=>e.activityId!==a.id);a.exception=original;root=w.Details.businessDetail(design,a.id);assert([...root.querySelectorAll('h3')].some(h=>h.textContent==='Exception'));assert(root.textContent.includes('下書き保存'),'unstructured input still shows its exceptions');
 console.log('Business exception details: duplicate summaries removed; unique, different, and unstructured content retained.');
}finally{w.close();}
