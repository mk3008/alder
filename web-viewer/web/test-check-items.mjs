import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseChecks,checkCompatibility,githubDocument,confirmationKey} from '../src/check-items.ts';
import {parseDesign} from '../src/graph.ts';
import {reconcile} from '../src/session.ts';
const markdown=readFileSync('../docs/examples/purchase-check-review.ja.md','utf8');
const design=parseDesign(readFileSync('../business-design/purchase-request/README.md','utf8'));
const tab={key:'purchase',name:'purchase',design,source:{kind:'url',url:'https://raw.githubusercontent.com/mk3008/alder/main/business-design/purchase-request/README.md'},positions:{},scroll:[0,0],zoom:1};
const checks=parseChecks(markdown);
assert.equal(checks.items.length,6);assert.equal(checks.items.filter(i=>i.id==='JA-EX-04').length,1);
assert.deepEqual(checks.items.find(i=>i.id==='JA-EX-04').activities,['購入申請を却下する','承認済み備品を購入する']);
assert.match(checks.items.find(i=>i.id==='JA-EX-Q01').body,/人間レビュー状態：要確認/);
assert.equal(checkCompatibility(checks,tab).state,'unverified','pinned vs main: revision warning, not mismatch');
const sha='c2852531ad62691c375e87818d8c3a49fd19803f';
const pinned={...tab,source:{kind:'url',url:tab.source.url.replace('/main/',`/${sha}/`)}};
assert.equal(checkCompatibility(checks,pinned).state,'matched');
assert.equal(checkCompatibility(checks,{...pinned,edited:true}).state,'unverified');
assert.equal(checkCompatibility(checks,{...tab,source:{kind:'text'}}).state,'unverified');
assert.equal(checkCompatibility(checks,{...tab,source:{kind:'sample'}}).state,'mismatch');
assert.equal(checkCompatibility(parseChecks(markdown.replaceAll('purchase-request/README.md','another/README.md')),tab).state,'mismatch','same names cannot override different source');
assert.equal(checkCompatibility(parseChecks(markdown.replaceAll('購入申請を承認する','不明な承認業務')),tab).state,'unverified');
assert.equal(checkCompatibility(parseChecks(markdown.replaceAll('購入','別件購入')),tab).state,'mismatch');
assert.equal(checkCompatibility(parseChecks(markdown.replace(/https:\/\/github.com[^)]+/g,'#missing-source')),tab).state,'unverified');
assert.equal(githubDocument(`https://github.com/mk3008/alder/blob/${sha}/business-design/purchase-request/README.md#L123`).document,githubDocument(pinned.source.url).document);
assert.equal(githubDocument('https://raw.githubusercontent.com/mk3008/alder/refs/heads/main/business-design/purchase-request/README.md').document,githubDocument(tab.source.url).document);
for(const raw of ['',design.markdown,markdown.replace('人間レビュー状態：要確認','レビュー削除：要確認'),markdown.replace('[JA-EX-01](#ja-ex-01)','[JA-EX-01](#ja-ex-02)'),markdown+'\n```\n',markdown.replace('### JA-EX-05','### JA-EX-04')])assert.throws(()=>parseChecks(raw));
const augmented=markdown.replace('- 人間レビュー状態：未レビュー','- 人間レビュー状態：未レビュー\n\n式：A AND (B OR C)\n\n| A | B | 結果 |\n|---|---|---|\n| 1 | 0 | 保留 |');
assert.match(parseChecks(augmented).items[0].body,/A AND \(B OR C\)/);assert.match(parseChecks(augmented).items[0].body,/\| 1 \| 0 \| 保留 \|/);
const confirmed={...tab,checks:{name:'check',markdown,confirmedFor:confirmationKey(tab)},draft:'unsaved draft'};
const changed=reconcile(confirmed,{...design,markdown:design.markdown+'\n'});
assert.notEqual(confirmationKey(changed),confirmed.checks.confirmedFor);assert.equal(changed.draft,'unsaved draft');assert.equal(changed.checks,confirmed.checks);
console.log('related Check parser, shared/unresolved IDs, identity/revision and boundary checks passed');

// Independent legacy adapter oracle: one shared identity, review state and guarantee reference.
const shared=parseChecks(`# Check

## 業務一覧
| 業務 | 目的 | 接続 | Check |
| [受付](#受付) | 受付の目的 | 明示接続 | [C01](#c01) |
| [確認](#確認) | 確認の目的 | 明示接続 | [C01](#c01) |

## 受付

### 一般保証

合意していない保証の本文。

### C01 — 番号を確認する

- 条件：[一般保証](#一般保証)を参照
- 期待結果：番号を表示する
- 人間レビュー状態：要確認
- 独自の補足：未決の文章を残す
`).model;
assert.equal(shared.items.length,1);assert.equal(shared.items[0].reviewState,'要確認');assert.equal(shared.items[0].checkId,'C01');
assert.equal(shared.index[0].checkIds[0],shared.index[1].checkIds[0]);assert.equal(shared.index[0].purpose,'受付の目的');
assert.equal(shared.guarantees[0].title,'一般保証');assert.deepEqual(shared.items[0].fields.condition[0],{kind:'reference',targetId:shared.guarantees[0].id,label:'一般保証'});
assert.deepEqual(shared.items[0].fields['独自の補足'],[{kind:'markdown',value:'未決の文章を残す'}]);
assert.equal(shared.basedOn.verification,'unverified');

const ambiguous=parseChecks(markdown.replace('### JA-EX-01','### 同名の保証\n説明1\n\n### JA-EX-01')+'\n### 同名の保証\n説明2\n');assert.equal(new Set(ambiguous.model.guarantees.map(g=>g.id)).size,ambiguous.model.guarantees.length,'repeated legacy titles never create duplicate reference identities');
