import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {parseDesign,objectStateTransitionsFromSource} from '../src/graph.ts';
import {parseStateDeclaration,stateTransitionPanel} from '../src/state-transitions.ts';
const raw=readFileSync('../tools/fixtures/state-transitions/purchase-request.md','utf8');
const baseline=readFileSync('../tools/fixtures/sr-dependencies/purchase-request.md','utf8');
const design=parseDesign(raw),legacy=parseDesign(baseline),decl=design.objectStateTransitions['購入申請'];
const withoutDeclaration=raw.replace(/\n## State Transitions\n[\s\S]*?(?=\n# Object 基幹システム)/,'');
const currentWithoutDeclaration=parseDesign(withoutDeclaration);
assert.deepEqual(design.graph,currentWithoutDeclaration.graph);assert.deepEqual(design.findings,currentWithoutDeclaration.findings);
assert.equal(decl.error,undefined);assert.equal(decl.model.states.length,5);assert.equal(decl.model.transitions.length,13);
assert.equal(legacy.objectStateTransitions,undefined);assert.equal(objectStateTransitionsFromSource(baseline,new Set(['購入申請'])),undefined);
assert.equal(objectStateTransitionsFromSource(raw,new Set(['別Object']))['購入申請'],undefined);
const body=raw.split('## State Transitions\n\n')[1].split('\n# Object 基幹システム')[0];
// Require every mutation to actually alter the current Japanese fixture.
const mutate=(before,after)=>{assert.ok(body.includes(before),before);const value=body.replace(before,after);assert.notEqual(value,body);return value;};
for(const [before,after] of [
 ['| T01 |','| T02 |'],
 ['| 申請済み | change | normal | E1','| 未登録 | change | normal | E1'],
 ['"購入申請"','"別Object"'],
 ['| change | normal | E1','| unchanged | normal | E1'],
 ['| T01 |','| T01 | extra |'],
 ['"terminal": "@unknown"','"terminal": "購入済み"'],
 ['"completeness": "partial"','"completeness": "complete"'],
 ['| 作業中断 |','| - |'],
 ['| - | 必須情報','| 例外名 | 必須情報'],
 ['| @none | no-create |','| 下書き | no-create |'],
 ['| @unknown | constraint | normal | E7','| 承認済み | constraint | normal | E7']
])assert.ok(parseStateDeclaration(mutate(before,after),'購入申請').error,before);
assert.ok(parseStateDeclaration(body+'\n推論で線を補う','購入申請').error);
const unchanged=parseStateDeclaration(mutate('| @unknown | constraint | normal | E7','| 承認済み | unchanged | normal | E7'),'購入申請');
assert.equal(unchanged.error,undefined);assert.equal(unchanged.model.transitions.find(r=>r.id==='T12').from,unchanged.model.transitions.find(r=>r.id==='T12').to);
// The real fixture keeps uncertain paths uncertain, independent of successful parsing.
assert.deepEqual(decl.model.states,['下書き','差戻し','申請済み','承認済み','購入済み']);
assert.deepEqual(decl.model.transitions.filter(r=>r.to==='@unknown').map(r=>r.id),['T07','T08','T10','T11','T12']);
assert.equal(decl.model.transitions.find(r=>r.id==='T12').effect,'constraint');
const w=new JSDOM().window;globalThis.document=w.document;
try{
 let chosen;const root=stateTransitionPanel(design,'購入申請',id=>chosen=id);document.body.append(root);
 assert.equal(root.querySelectorAll('li').length,13);assert.doesNotMatch(root.textContent,/部分定義：|図は横にスクロールできます/);assert.ok(root.querySelector('.state-diagram'));assert.match(root.textContent,/遷移先未決/);assert.equal(root.querySelector('table'),null);
 root.querySelector('button').click();assert.equal(chosen,'備品購入を申請する');
 assert.equal(stateTransitionPanel(design,'申請者',()=>{}),undefined);assert.equal(stateTransitionPanel(design,'備品購入を申請する',()=>{}),undefined);
 const changed=parseDesign(raw.replace('備品購入を申請する | - | 必須情報','存在しないActivity | - | 必須情報'));assert.match(stateTransitionPanel(changed,'購入申請',()=>{}).textContent,/根拠Activityが見つかりません/);
 assert.equal(stateTransitionPanel(changed,'購入申請',()=>{}).querySelector('svg'),null);
 const renamed=parseDesign(raw.replace('| 作業中断 |','| 別の例外 |'));assert.match(stateTransitionPanel(renamed,'購入申請',()=>{}).textContent,/一意に参照できません/);
 const invalid=parseDesign(raw.replace('| T01 |','| T02 |'));assert.match(stateTransitionPanel(invalid,'購入申請',()=>{}).textContent,/表示できません/);assert.deepEqual(invalid.graph,currentWithoutDeclaration.graph);
 const hostile=structuredClone(design);hostile.objectStateTransitions['購入申請'].model.transitions[0].condition='<img src=x onerror=alert(1)>';const inert=stateTransitionPanel(hostile,'購入申請',()=>{});assert.equal(inert.querySelector('img'),null);assert.match(inert.textContent,/<img/);
 assert.equal(decl.model.transitions.filter(r=>r.to==='@unknown').length,5);assert.ok(!decl.model.states.includes('discarded'));
 const prose=raw.replace('購入申請は一意に識別できるものとする。','購入申請はapprovedから下書きへ変更する。');assert.deepEqual(parseDesign(prose).objectStateTransitions,design.objectStateTransitions);
 console.log('Explicit state declarations: graph/findings unchanged, 13 operations, partial/unknown retained, invalid input, missing activity, inert text, legacy and source restoration passed');
}finally{w.close();delete globalThis.document;}
