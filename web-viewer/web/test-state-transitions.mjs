import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {parseDesign,objectStateTransitionsFromSource} from '../src/graph.ts';
import {parseStateDeclaration,stateTransitionPanel} from '../src/state-transitions.ts';
const raw=readFileSync('../tools/fixtures/state-transitions/purchase-request.md','utf8');
const baseline=readFileSync('../tools/fixtures/sr-dependencies/purchase-request.md','utf8');
const design=parseDesign(raw),legacy=parseDesign(baseline),decl=design.objectStateTransitions['購入申請'];
assert.deepEqual(design.graph,legacy.graph);assert.deepEqual(design.findings,legacy.findings);
assert.equal(decl.error,undefined);assert.equal(decl.model.states.length,5);assert.equal(decl.model.transitions.length,13);
assert.equal(legacy.objectStateTransitions,undefined);assert.equal(objectStateTransitionsFromSource(baseline,new Set(['購入申請'])),undefined);
assert.equal(objectStateTransitionsFromSource(raw,new Set(['別Object']))['購入申請'],undefined);
const body=raw.split('## State Transitions\n\n')[1].split('\n# Object 基幹システム')[0];
for(const value of [body.replace('| T01 |','| T02 |'),body.replace('| submitted | change | normal | E1','| discarded | change | normal | E1'),body.replace('"購入申請"','"別Object"'),body.replace('| change | normal | E1','| unchanged | normal | E1'),body.replace('| T01 |','| T01 | extra |'),body+'\n推論で線を補う'])assert.ok(parseStateDeclaration(value,'購入申請').error);
assert.ok(parseStateDeclaration(body.replace('"terminal": "@unknown"','"terminal": "purchased"'),'購入申請').error);
const w=new JSDOM().window;globalThis.document=w.document;
try{
 let chosen;const root=stateTransitionPanel(design,'購入申請',id=>chosen=id);document.body.append(root);
 assert.equal(root.querySelectorAll('li').length,13);assert.match(root.textContent,/未記載の操作は未決/);assert.match(root.textContent,/遷移先未決/);assert.equal(root.querySelector('table'),null);
 root.querySelector('button').click();assert.equal(chosen,'備品購入を申請する');
 assert.equal(stateTransitionPanel(design,'申請者',()=>{}),undefined);assert.equal(stateTransitionPanel(design,'備品購入を申請する',()=>{}),undefined);
 const changed=parseDesign(raw.replace('備品購入を申請する | 必須情報','存在しないActivity | 必須情報'));assert.match(stateTransitionPanel(changed,'購入申請',()=>{}).textContent,/根拠Activityが見つかりません/);
 const invalid=parseDesign(raw.replace('| T01 |','| T02 |'));assert.match(stateTransitionPanel(invalid,'購入申請',()=>{}).textContent,/表示できません/);assert.deepEqual(invalid.graph,legacy.graph);
 const hostile=structuredClone(design);hostile.objectStateTransitions['購入申請'].model.transitions[0].condition='<img src=x onerror=alert(1)>';const inert=stateTransitionPanel(hostile,'購入申請',()=>{});assert.equal(inert.querySelector('img'),null);assert.match(inert.textContent,/<img/);
 assert.equal(decl.model.transitions.filter(r=>r.to==='@unknown').length,5);assert.ok(!decl.model.states.includes('discarded'));
 const prose=raw.replace('購入申請は一意に識別できるものとする。','購入申請はapprovedから下書きへ変更する。');assert.deepEqual(parseDesign(prose).objectStateTransitions,design.objectStateTransitions);
 console.log('Explicit state declarations: graph/findings unchanged, 13 operations, partial/unknown retained, invalid input, missing activity, inert text, legacy and source restoration passed');
}finally{w.close();delete globalThis.document;}
