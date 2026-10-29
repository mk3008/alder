import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {readPreview,validateD2} from '../src/d2-preview-model.mjs';
import {parseDocument} from '../src/document-input.ts';
const raw=readFileSync('public/d2-examples.json','utf8'),input=readPreview(raw),frozen=JSON.stringify(input);
const authority=JSON.parse(readFileSync('verification/d2-preview.check-items.json','utf8'));
assert.deepEqual(authority.items.map(i=>i.id),['D2-01','D2-02','D2-03','D2-04','D2-05','D2-06']);
for(const c of input.cases){validateD2(c.candidate);parseDocument(JSON.stringify(c.before));}
const dom=new JSDOM('<div id="host"></div>',{url:'https://preview.test/d2.html',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.CSS={escape:s=>s};w.TextEncoder=TextEncoder;w.structuredClone=structuredClone;
const compiled=await build({entryPoints:['src/d2-preview.ts'],bundle:true,write:false,format:'iife',globalName:'D2UI',loader:{'.css':'empty'}});w.eval(compiled.outputFiles[0].text+'\nwindow.D2UI=D2UI;');
const host=w.document.querySelector('#host'),mount=(id,mode='d2')=>w.D2UI.mountPreview(host,structuredClone(input),id,mode);
const button=text=>[...host.querySelectorAll('button')].find(b=>b.textContent===text);
const select=id=>{const s=host.querySelector('select');s.value=id;s.dispatchEvent(new w.Event('change'));};
const results=[];const pass=id=>results.push(id);
// D2-01: real normalized 0.4 remains the source of the shared graph, no write or migration.
mount('molkkyCross');const ids=()=>[...host.querySelectorAll('[data-node]')].map(e=>e.dataset.node).sort();const d2ids=ids();button('0.4表現').click();assert.deepEqual(ids(),d2ids);assert.match(host.textContent,/同じ情報を現行0.4/);button('D2構造案').click();assert.deepEqual(ids(),d2ids);assert.equal(w.localStorage.length,0);pass('D2-01');
// D2-02: cross references navigate to the actual Step in its original Activity.
const link=[...host.querySelectorAll('.d2-cross button')].find(b=>b.textContent.includes('m-reset'));assert.ok(link);link.click();assert.equal(host.querySelector('[data-step-id="m-reset"]').dataset.focused,'true');assert.match(host.textContent,/このStep同士は入替可能/);assert.match(host.textContent,/Activity全体の交換/);pass('D2-02');
// D2-03: assignments are visible per Step, then unresolved scope remains visible.
select('mixed');const steps=[...host.querySelectorAll('.d2-step')];assert.match(steps[0].textContent,/受付担当/);assert.match(steps[1].textContent,/受付システム/);assert.match(steps[2].textContent,/受付担当/);select('molkkyCross');assert.match(host.textContent,/担当未確認/);assert.match(host.textContent,/外部業務/);pass('D2-03');
select('photo');assert.match(host.querySelector('.d2-step').textContent,/任意/);assert.match(host.querySelector('.d2-step').textContent,/写真がある場合/);assert.match(host.textContent,/成立条件/);select('molkky');assert.equal(host.querySelectorAll('[data-result-id]').length,2);assert.match(host.textContent,/参加者が2人以上で名前が重複しない場合/);assert.doesNotMatch(host.textContent,/現在.*2件.*成立/);pass('D2-04');
select('synthetic');const c=input.cases.find(c=>c.id==='synthetic').candidate.business;assert.equal(c.relations.filter(r=>r.kind==='output').length,1);assert.equal(c.relations.filter(r=>r.kind==='input').length,2);assert.equal(host.querySelectorAll('[data-relation-id="s-output"] [data-information-id]').length,2);assert.equal(host.querySelectorAll('[data-node]').length,c.objects.length+c.activities.length);pass('D2-05');
for(const change of [p=>p.format='alder-document-package',p=>p.cases[0].candidate.business.crossActivityOrderRules[0].standardSteps[0].stepId='missing',p=>p.cases[0].candidate.business.crossActivityOrderRules[0].standardSteps[0].activityId=p.cases[0].candidate.business.activities[0].id,p=>p.cases[0].candidate.business.activities[0].procedure.steps=[],p=>p.cases[0].candidate.business.activities[0].who='別の正本',p=>p.cases[0].candidate.business.crossActivityOrderRules.push({id:'bad-before',label:'矛盾',context:p.cases[0].candidate.business.crossActivityOrderRules[0].context,kind:'before',before:p.cases[0].candidate.business.crossActivityOrderRules[0].standardSteps[0],after:p.cases[0].candidate.business.crossActivityOrderRules[0].standardSteps[1]})]){const p=structuredClone(input);change(p);assert.throws(()=>readPreview(JSON.stringify(p)));}
assert.throws(()=>readPreview(raw.replace('"version": 1','"version": 1, "version": 1')),/Duplicate/);pass('D2-06');
assert.equal(JSON.stringify(input),frozen);assert.deepEqual(results.sort(),authority.items.map(i=>i.id).sort());dom.window.close();console.log(JSON.stringify({authority:'verification/d2-preview.check-items.json',results,passed:results.length,inputUnchanged:true,scope:'targeted DOM/validation, no human approval'}));
