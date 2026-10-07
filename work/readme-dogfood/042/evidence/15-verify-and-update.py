from pathlib import Path
import hashlib, json, re, subprocess, sys, difflib
root=Path.cwd(); ev=root.parent/'evidence'; check=root/'docs/checks/tool-return.md'
sha=lambda b:hashlib.sha256(b).hexdigest()
files=sorted(p for p in root.rglob('*') if p.is_file())
before={str(p.relative_to(root)):sha(p.read_bytes()) for p in files}
text=check.read_text(); (ev/'15-checks.before.md').write_bytes(check.read_bytes())
(ev/'15-before-hashes.json').write_text(json.dumps(before,ensure_ascii=False,indent=2)+'\n')
assert before['docs/checks/tool-return.md']=='f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351'
assert before['tests/test_tool_return.py']=='0ff16b58155d6d0c6f30a9261bdd5c35519b800880612db41764a40a773ce5c7'
assert (ev/'14-regression-strengthening.md').is_file()
commands=[]
def run(args, stem):
    import os
    env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1')
    r=subprocess.run(args,env=env,capture_output=True)
    for suffix,b in [('stdout.txt',r.stdout),('stderr.txt',r.stderr),('exit.txt',f'{r.returncode}\n'.encode())]: (ev/f'{stem}.{suffix}').write_bytes(b)
    commands.append({'argv':args,'environment':{'PYTHONDONTWRITEBYTECODE':'1'},'cwd':str(root),'stdout':f'{stem}.stdout.txt','stderr':f'{stem}.stderr.txt','exit':r.returncode})
    assert r.returncode==0
    return r.stdout.decode()
out=run([sys.executable,'run_tests.py'],'15-final-tests')
assert re.search(r'Ran 21 tests',out) and '\nOK\n' in out
code="import unittest,json; s=unittest.defaultTestLoader.discover('tests'); flat=lambda s:[t.id() for c in s for t in (flat_tests(c) if isinstance(c,unittest.TestSuite) else [c])]; def_placeholder=0\ndef flat_tests(s):\n for c in s:\n  if isinstance(c,unittest.TestSuite): yield from flat_tests(c)\n  else: yield c\nprint(json.dumps([t.id() for t in flat_tests(s)],indent=2))"
ids=json.loads(run([sys.executable,'-c',code],'15-discovery'))
assert len(ids)==21 and len(set(ids))==21
(ev/'15-test-ids.json').write_text(json.dumps(ids,indent=2)+'\n')
(ev/'15-commands.json').write_text(json.dumps(commands,indent=2)+'\n')
prefix='test_tool_return.ReturnReceptionTests.'
mappings={
'TR-01':['test_matching_return_is_confirmed','test_selected_loan_is_the_comparison_source'],
'TR-02':['test_first_receipt_records_time_on_selected_loan','test_time_is_normalized_to_utc'],
'TR-03':['test_received_group_waits_for_inspection'],
'TR-04':['test_received_group_is_not_available_for_loan','test_matching_return_clears_artificial_available_sentinel'],
'TR-05':['test_failed_reception_does_not_confirm_receipt','test_mismatching_reprocessing_keeps_existing_time_and_state'],
'TR-06':['test_failed_reception_does_not_record_return_time','test_mismatching_reprocessing_keeps_existing_time_and_state'],
'TR-07':['test_failed_reception_does_not_set_inspection_pending','test_mismatching_reprocessing_keeps_existing_time_and_state'],
'TR-08':['test_failed_reception_returns_needs_review_to_counter'],
'TR-09':['test_matching_reprocessing_preserves_first_return_time','test_mismatching_reprocessing_keeps_existing_time_and_state'],
}
assert all(prefix+t in ids for ts in mappings.values() for t in ts)
assertions={
'TR-01':'一致する組の受付で `status == CONFIRMED` と受領確認フラグを確認。別の選択貸出でもその貸出の記録を照合元として受領し、非対象貸出が変わらないことを確認。余剰・置換等には適用しない。',
'TR-02':'初回一致受付で対象貸出に指定時刻が記録され、別貸出が不変であることを確認。タイムゾーン違いでも同じ時点・UTC・マイクロ秒を保持する assertion は、システム試験条件の技術的補助であり、Check にタイムゾーン方針を追加しない。',
'TR-03':'一致受付後の `inspection_pending` が true であることを確認。通知・保管・物理的引渡し・実際の点検開始はこの assertion の対象外。',
'TR-04':'元の Test は一致受付後の貸出可能フラグが false であることを確認するが、初期値も false のため代入漏れを単独では検出できない。追加 Test は人工的な技術検出用 sentinel として true を設定し、一致受付の `CONFIRMED` と受付後の厳密な false を確認する。この初期値を正当な現実の貸出状態、新しい業務前提、貸出方針とは扱わない。後続の限定 mutation 検証では当該代入を省くと元20件は成功し、追加 Test だけが失敗した（後述の実行履歴）。',
'TR-05':'番号のみ不一致、純粋な不足、両方、付属品全欠落の4場面で、今回の結果が `CONFIRMED` ではなく、未受領の対象が受領済みにならないことを確認。受領後の不一致再処理では今回の結果が `NEEDS_REVIEW` で、過去の受領確認は保持される。過去の受領を取り消す意味に拡張しない。',
'TR-06':'同じ4不成立場面で未記録の返却日時が None のままであることを確認。すでに受領した対象では後日の不一致再処理でも最初の日時が同一オブジェクトのまま保持される。今回の記録禁止を既存日時の削除と読み替えない。',
'TR-07':'同じ4不成立場面で、未受領・点検待ち false の対象は false のまま。別の既存 Test では受領済み・点検待ち true の対象が不一致再処理後も true のままであることを確認。両 Test はそれぞれの fixture 文脈で false/true の双方を扱う。初回レビューの追加強化候補は確定した証拠不足や欠陥を意味せず、この更新で新しい TR-07 Test は要求しない。全ての将来状態や副作用一般の不変性には拡張しない。',
'TR-08':'同じ4不成立場面で `status == NEEDS_REVIEW` と `recipient == 窓口` の両方を確認。呼出し元へ返る値の証拠であり、外部通知の配送、調査完了、再受付成功の証拠ではない。',
'TR-09':'最初の一致受付後、後日・過去日時を与えた一致再処理の双方で、最初の返却日時が同一オブジェクトのまま保持される。不一致再処理の4場面でも保持される。全副作用の冪等性や応答全般は保証しない。',
}
old='- 版: 模擬レビュー反映 v2。更新前 Check v1 の SHA-256 は `a366d2a44ff1fbc75384b829e695c49a4f40e138b8a09ef1f82fdfa4510f9e47`。既存 ID `TR-01`〜`TR-09` をすべて保持。Check の追加・削除・分割・統合はありません。既存 Test 対応もありません。'
new='- 版: 模擬レビュー反映 v2 + Test 証拠更新 e1。更新前 Check v1 の SHA-256 は `a366d2a44ff1fbc75384b829e695c49a4f40e138b8a09ef1f82fdfa4510f9e47`、証拠更新前 v2 は `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351`。既存 ID `TR-01`〜`TR-09` と業務意味・模擬レビュー状態を保持し、Test 対応と証拠だけを追加。Check の追加・削除・分割・統合はありません。'
assert old in text; text=text.replace(old,new)
old=next(l for l in text.splitlines() if l.startswith('- Test 証拠は全項目で'))
new='- Test 証拠: 下記の各 ID で意味を照合した Test/assertion に対応済み（mapped）。静的な assertion 確認と実行成功は別々に確認しました。初回の独立レビューは元20 Test を対象とし、後続の技術的補強後に現在の21 Test を再発見・実行しています。正確な版・実行記録と限界は「Test 証拠の版と実行履歴」を参照してください。模擬レビュー状態や業務承認は Test 成功から変更しません。Code、SQL 入口、実装 symbol・行への恒久的な対応表は作りません。'
text=text.replace(old,new)
for cid,methods in mappings.items():
    pattern=r'(### '+cid+r' — .*?)(?=\n### |\n## |\Z)'
    m=re.search(pattern,text,re.S); assert m
    evidence='\n- Test 対応（mapped、静的照合・最終実行済み）: '+ '、'.join('`'+prefix+t+'`' for t in methods)+'。\n- Assertion と証拠の限界: '+assertions[cid]+'\n'
    text=text[:m.end()]+evidence+text[m.end():]
    text=text.replace('### '+cid+' —', '<a id="'+cid.lower()+'"></a>\n\n### '+cid+' —',1)
section='''## Test 証拠の版と実行履歴

- この証拠更新は、独立した実装レビュー後の限定的な記録保守です。新しい業務判断や実装受入れは行いません。上記の同一 Business Design と模擬 Check v2 の条件・期待結果を基準にしています。[Business Design](../business-design/tool-return.md) → 各 Check 詳細 → Test ID と、下表の Test ID → Check 詳細 → Business Design の両方向を辿れます。
- 元の独立レビュー: `../../../evidence/13-implementation-review.md`。Check SHA-256 `f5003361c073f3a17dfa3389ed6ef89ec3103c1185d0d6ae51e29aa1ceb08351`、元 Test SHA-256 `4dfd53ba191ef48b6af4d7c891171905b104239fe5385208ad2845bc2a963d1d` に対する20件成功。このレビューの対象を21件へ遡及拡張しません。
- 後続の技術的補強: `../../../evidence/14-regression-strengthening.md`。TR-04 の人工 sentinel Test を1件追加。代入を省く限定 mutation は元20件では検出されず、補強後21件では新 Test だけが失敗。実装は変更されていません。
- 現在の Test: [tests/test_tool_return.py](../../tests/test_tool_return.py)、SHA-256 `0ff16b58155d6d0c6f30a9261bdd5c35519b800880612db41764a40a773ce5c7`。runner-discovered ID は `../../../evidence/15-test-ids.json` に21件を保存。静的に実際の assertion を確認した上で、workspace から `PYTHONDONTWRITEBYTECODE=1 python run_tests.py` を実行し、21件成功・失敗0・エラー0・終了0を観測しました。
- 実行対象の実装スナップショット SHA-256: `0980f2f430f217f22b7494958c61c474817c440e23166cdc6d40c4586df0b7a1`。runner SHA-256: `7778146810d410f9758d49f8310f023fe68d204b990c8dd92894a7c3e451a0f1`。これらは実行版の固定であり、Check と実装位置の恒久対応ではありません。
- 正確なコマンド・stdout・stderr・終了値は `../../../evidence/15-commands.json` と `15-final-tests.*`、独立 discovery の結果は `15-discovery.*` に保存。更新前後 Check の完全なスナップショットと SHA-256・意味保持監査は `15-checks.before.md`、`15-checks.after.md`、`15-invariants.json` を参照。
- 証拠の範囲は合成データのローカル in-memory fixture です。外部通知、実際の責任主体、物理的な引渡し、永続化・並行処理・中断後復旧、本番運用への証拠はありません。BD-Q01〜04 と明示保留を解消しません。

### Test → Check の逆引き

以下の ID は全て今回の runner discovery に存在します。Check に対応する Test は、その詳細にある assertion と限界を合わせて読みます。技術的補助・境界 Test は業務期待結果の追加承認になりません。

| Runner Test ID | 対応・位置づけ |
| --- | --- |
'''
reverse={i:[] for i in ids}
for cid,ts in mappings.items():
    for t in ts: reverse[prefix+t].append(cid)
for tid in ids:
    links=', '.join(f'[{c}](#{c.lower()})' for c in reverse[tid])
    if tid.endswith('test_time_is_normalized_to_utc'): links+='（UTC はシステム試験条件の技術的補助）'
    if tid.endswith('test_matching_return_clears_artificial_available_sentinel'): links+='（人工 sentinel による技術的補強）'
    if not links: links='技術的入力・fixture 境界。承認済み Check への業務合否対応なし'
    section+=f'| `{tid}` | {links} |\n'
section+='\n'
text=text.replace('## 未決の項目 —',section+'## 未決の項目 —')
text+='''
### Test 証拠更新 e1 の出典

- 使用 Skill: `alder-follow-up-review`。Alder plugin **0.4.2**、source commit `6d30b93abf8ecdc8902fef5c16bfb53fda8617e9`。
- 同梱 authority revision `f904fe1e584ed6693983d58749b1f9dec83b3c8c`。全 `check-item-traceability.md` と `adoption.md` の Check Item 節・実装後レビュー節を適用。上記の同梱 SHA-256 を再検証しています。
'''
check.write_text(text)
(ev/'15-checks.after.md').write_bytes(check.read_bytes())
(ev/'15-checks.diff').write_text(''.join(difflib.unified_diff((ev/'15-checks.before.md').read_text().splitlines(True),text.splitlines(True),fromfile='before/docs/checks/tool-return.md',tofile='after/docs/checks/tool-return.md')))
after={str(p.relative_to(root)):sha(p.read_bytes()) for p in files}
(ev/'15-after-hashes.json').write_text(json.dumps(after,ensure_ascii=False,indent=2)+'\n')
def meaning(t):
    out={}
    for cid in mappings:
        m=re.search(r'### '+cid+r' — (.*?)(?=\n### |\n## |\Z)',t,re.S); assert m
        block=m.group()
        out[cid]={'heading':block.splitlines()[0],'semantic_lines':[l for l in block.splitlines() if l.startswith(('- 条件・入力:','- 期待結果:','- 根拠:','- 導出分類:','- 代表場面:','- 関連・接続:'))], 'human_row':next(l for l in t.splitlines() if l.startswith('| '+cid+' |'))}
    return out
original=(ev/'15-checks.before.md').read_text()
old_meaning=meaning(original); new_meaning=meaning(text)
unchanged_section=lambda t:t.split('## 未決の項目 —',1)[1].split('## Alder 出典',1)[0]
changed=[p for p in before if before[p]!=after[p]]
inv={'schema_version':1,'check_ids':list(mappings),'before_sha256':sha(original.encode()),'after_sha256':sha(check.read_bytes()),'changed_workspace_files':changed,'before':before,'after':after,'checks':{'ids_preserved':list(old_meaning)==list(new_meaning),'titles_conditions_expectations_sources_connections_review_states_unchanged':old_meaning==new_meaning,'unresolved_and_boundary_sections_byte_identical':unchanged_section(original)==unchanged_section(text),'only_check_document_changed':changed==['docs/checks/tool-return.md'],'all_9_simulated_states_preserved':all('確認済み（模擬）' in v['human_row'] for v in new_meaning.values()),'all_mapped_ids_discovered':all(t in ids for t,c in reverse.items() if c),'discovered_exactly_21_unique_ids':len(ids)==len(set(ids))==21,'final_run_exit_zero':commands[0]['exit']==0,'no_new_business_decisions':old_meaning==new_meaning and before['docs/decisions.md']==after['docs/decisions.md']},'semantic_snapshot':new_meaning,'forward':{c:[prefix+t for t in ts] for c,ts in mappings.items()},'reverse':reverse,'discovered_test_ids':ids,'commands':commands,'requested_settings':'inherited; no explicit model or reasoning-effort override','effective_runtime_settings':'unverified','routing':'manual source-catalog diagnostic, not natural client routing','source_plugin_version':'0.4.2','source_commit':'6d30b93abf8ecdc8902fef5c16bfb53fda8617e9'}
assert all(inv['checks'].values()),inv['checks']
(ev/'15-invariants.json').write_text(json.dumps(inv,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'checks':inv['checks'],'check_after_sha256':inv['after_sha256'],'test_count':len(ids)},ensure_ascii=False,indent=2))
