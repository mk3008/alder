# 備品購入申請Business Designのレビューと改稿案

2026-10-19。Alder #253 の文書草案まで。業務合意・採用は未了。

## 結論

既存の4 Activity・4 Object・11関係と状態遷移を保ち、入力名と手順の対応を明確にした。承認判断の開始位置、購入と結果登録の境界、申請者情報の出所、未入力・状態変更時の扱いは未確認としてBD冒頭へ残した。既存のWhenや結果を黙って置き換えて整合済みにはしていない。

改稿対象は `business-design/purchase-request/README.md`。Check、Viewer、Plugin、他の研究fixtureは変更しない。現行BDそのものへのbranch上の差分であり、main上の原典は未変更。Check生成・更新とViewer実装へは進まない。

## 読んだ原典と基準

- 作業base: `f9a9708e4b9b2992f5572ab4c34cf00c24a7953e`。
- 正式Plugin 0.4.8: tag `plugin-v0.4.8`、commit `9b4a3cbffe835cfa9c6a8ec7d602d9611a1a0285`。`plugins/alder/plugin.json` のversionは0.4.8。使用したcheckoutのPluginとBD構造・品質・相関・漏れ基準は、このtagとの差分なし。
- `AGENTS.md`、結果返却の `docs/result-review.ja.md` と `business-design/ai-result-review/README.md`。
- `business-design/purchase-request/README.md` 全文、`docs/examples/purchase-check-review.ja.md` 全文。Checkは未合意BDの `c2852531ad62691c375e87818d8c3a49fd19803f` を参照し、5項目は未レビュー、JA-EX-Q01は要確認、テスト証拠は未収集という記録を維持。
- `docs/release-notes-v0.4.8.md`、Plugin同梱の草案作成Skillと業務設計レビューSkill、その構造・品質・相関・漏れ基準、authoring guidanceのsection 1とBusiness Graph profile v1〜最小例。
- 同梱レビュー基準provenance: `979bf6b214f0ef805b9d407a04fc23c55dd17d4d`。同梱authoring provenance: `517e6dda0cb9043b63aba8bdd116190c201b1d37`（それぞれのSkill配下 `references/provenance.json`）。適用したSkill版は0.4.8、moving checkoutは上記base。
- 関連検証: `tools/business_graph/test_export.py`、`tools/test_workflow_skills.py` の現行日本語Check照合・Activity名診断、Viewerの `web/test-sample.mjs`・`web/test-check-items.mjs`・`web/test-check-items-dom.mjs`。

## 全Activityの確認

| Activity / What | Who / When | Input → Procedure → Output / Result | 判定 |
| --- | --- | --- | --- |
| 備品購入を申請する | 申請者 / 必要な備品を購入したいと判断したとき | 品名・数量・希望購入金額・購入理由の必須入力 → 新規登録 → 申請者・申請日時を含む `submitted` の購入申請 | 入力名を手順でも明示。申請者情報の確定方法は未確認 |
| 購入申請を承認する | 承認者 / `submitted` を購入してよいと判断したとき | 対象選択と申請内容・状態 → 内容確認・対象選択・承認 → `approved` と承認日時 | 対象と内容を明示。判断が開始前か仕事の内部かは未確認 |
| 購入申請を却下する | 承認者 / `submitted` を購入不可と判断したとき | 対象選択・却下理由と申請内容・状態 → 内容確認・理由記録・却下 → `rejected` と理由・日時、購買対象から除外 | 同上。却下を業務例外の戻り線にはしない |
| 承認済み備品を購入する | 購買担当者 / `approved` に基づき購入するとき | 購入した対象選択・実購入金額と申請内容・状態 → 購入・結果登録 → `purchased` と実購入金額・購入日時 | Inputにあった対象選択を手順にも明示。購入前後の境界と中断時の扱いは未確認 |

全ActivityのWhyは仕事の目的、Resultは終了状態を説明し、Whereは業務上の場所条件を規定しない。Activity名は開始条件を並べた名前ではなく、対象と仕事を識別しているため維持した。「承認済み」は購入対象の区別に必要。Scopeは申請・可否確定・購入結果登録と対象外業務の境界を示し、手順の移植や業務範囲の拡張は不要と判断した。

## 全Objectと業務相関の確認

| Object | Scope / Information | 実際の接続と確認結果 |
| --- | --- | --- |
| 申請者 | false / 品名・数量・希望購入金額・購入理由 | 申請ActivityへのInput。Whoと同じ役割名だけで別の関係を生やさない。申請者自身の情報の出所は未確認 |
| 承認者 | false / 承認対象・却下対象・却下理由 | 承認・却下へのInput。ロールは既定だが金額別経路・担当割当や自己承認の可否は未確定。新しい権限制約は追加しない |
| 購買担当者 | false / 購入した対象・実購入金額 | 購入ActivityへのInput。人そのものの管理は対象外。購入前後の情報到着時点は未確認 |
| 購入申請 | true / 申請内容・主体・日時・状態・理由・実購入金額 | 文書内で一度だけ定義される共有記録。全4 Activityが書き、後段3 Activityが読む。一意性は既定、採番・入力方式は未規定のまま |

- 申請のResult `submitted` は承認・却下で読む対象になる。ただし提出しただけで承認者の判断が済むわけではなく、どちらのActivityも自動起動を保証しない。
- 承認のResult `approved` は購入のInput・Whenに対応する。承認済みは購入済みとは異なる。
- 却下のResult `rejected` は購買対象からの除外に対応する。却下は定義済みの正常な結果であり、承認Activityからの例外遷移を新設しない。
- 購入のResult `purchased` は購入済みとしての終点。納品・検収・支払・資産管理への接続は対象外であり、完了したとは推定しない。
- 4 ActivityすべてScope true、外部の人3 Objectはfalse、業務内で成立・更新する購入申請はtrue。普通のActivity間直接接続・Object間直接接続・例外関係はいずれもない。未記載の例外が存在しないことの保証ではない。

## 変更前後の意味対応

| 元の記述 / 根拠 | 改稿 | 業務意味への影響 |
| --- | --- | --- |
| 申請Procedureの「備品」「購入金額」、Inputの品名・希望購入金額 | 手順を「品名」「希望購入金額」に揃える | 実購入金額との混同を避ける。同じ必須入力で新規申請を登録 |
| 承認・却下Inputの対象選択と「対象購入申請の内容」、Procedureの申請確認・選択 | 「対象となる…購入申請の内容」「対象購入申請」と明示 | 新しい審査基準・再確認工程は追加しない。既存の確認対象を明示 |
| 購入Inputに必須の「購入した対象購入申請の選択」、Procedureに対象選択の明記なし | 金額記録の手順に対象選択を明示 | Inputからの記述補完。購入前の選択を新たに義務づけず、Input自体も変更しない |
| Check原典は未合意、BD自身には草案の明示なし | BD冒頭に草案・合意前と表示 | レビュー成功を業務承認と混同しない |
| When/Procedure等の曖昧さ、情報不足 | 冒頭の未確認事項に根拠付きで残す | 答えは未確定。正常条件や期待結果を追加・変更しない |

元の6件の未決定事項、必須入力、全ObjectのInformation、全ActivityのScope / Why / When / Who / Where / Input / Output / Resultは保持した。

## 人間へ返す判断

優先して決めるのは次の2点。いずれも業務境界の決定であり、AIの文面整理だけで確定しない。

1. **承認・却下は内容確認と可否判断を含む仕事か。** ロール説明・Why・Procedureは含むように読める一方、Whenは判断済みを開始条件にしている。含めるなら開始条件の改稿と、双方の分岐をどう表すかの再確認が必要。判断済みの記録を表すなら、その境界に合わせたProcedureの整理が必要。現状の4 Activityを保てる範囲で整えることを推奨し、Activity統合は先取りしない。
2. **購入Activityは購入前から開始するか、購入後の結果登録から開始するか。** Scope・Why・Procedureは購入を含むが、外部入力は購入した対象と実購入金額である。購入前から扱うなら、購入前後それぞれで受け取る情報と中断時の扱いを確認する。購入後からなら名前・When・責任範囲の変更となる。現行の「購入を含む」説明を基準に確認することを推奨するが、後者を否定しない。

追加の確認は「申請者として誰をどの情報で記録するか」。認証方式や申請者自身の入力を実装から要件へ逆輸入しない。入力不足・数量/金額範囲・選択後の状態変更/再実行の結果は未決として保持可能で、今回すべての答えを出す必須条件にはしない。金額別承認、在庫・発注等、通知・監査の対象外事項も引き続き保留する。

### Checkへの影響候補

- JA-EX-01: 申請者情報・入力条件を後日確定する場合に影響し得る。
- JA-EX-02 / JA-EX-03: 判断の開始位置を変更する場合は条件の再照合が必要。
- JA-EX-04: `rejected` の購買対象除外は維持。共有IDを分割しない。
- JA-EX-05: 購入と登録の境界の決定で条件・サンプルの場面が変わり得る。
- JA-EX-Q01: 金額別承認経路は依然未決。

今回はいずれも変更しない。現在のCheckは固定commitを参照しており、改稿後の行番号へ自動的に追従するものではない。人間合意後のPhase 2で原典版を固定し直して扱う。

## 非破壊的検証

| 検証 | 結果 |
| --- | --- |
| `python3 -m unittest discover -s tools/business_graph -p 'test_*.py' -q` | 52 tests成功 |
| 作業baseと候補BDを同じ `parse_design` / `validate_graph` / `render` で比較 | 両方有効、JSON出力はバイト一致。4 Activity / 4 Object / 11関係、全Graphフィールドを保持 |
| `python3 tools/check_activity_names.py --design business-design/purchase-request/README.md --checks docs/examples/purchase-check-review.ja.md` | match、4 Activity名・Check索引・見出し一致 |
| `python3 -m unittest tools.test_workflow_skills.LiteralActivityNameDiagnosticTest -q` | 8 tests成功 |
| Viewer: `node --experimental-strip-types --test --test-isolation=process --test-concurrency=2 web/test-sample.mjs web/test-check-items.mjs web/test-check-items-dom.mjs` | 3 test files成功。備品購入BDの4 Activity・4 Object・11関係、状態分岐、PythonとのGraph一致、全ノード本文表示、既存Check読込・共有ID・未決IDを確認 |
| Viewer: `npm run build` | 型検査・build成功。既存の500 kB超chunk警告あり |
| `CurrentJapaneseSourceAlignmentTest` | setUpClassでERROR。過去commit `c0020d3f88fa7ce70b17c197464978bb548f9100` に `docs/examples/purchase-check-review.ja.md` がなく、履歴fixtureを読み出せない。検査本体は未実行 |

履歴fixtureエラーは改稿BDを読む前の失敗。baseから変わっていないテストとGit履歴に対する `git show` でも同じファイル不在を確認した。今回の範囲で履歴、期待値、テストコードを変更・弱化しない。この検査の成功を主張しない。

Graph共通SHA-256: `9b71e55a9d3f0b066983c9aafe38458672e5046bd763c41ac91b60a81db6cbb5`。比較は次で再現できる（リポジトリroot、baseは上記commit）。

```python
import subprocess, sys
from pathlib import Path
sys.path.insert(0, 'tools/business_graph')
from export import parse_design, render, validate_graph
path = 'business-design/purchase-request/README.md'
base = 'f9a9708e4b9b2992f5572ab4c34cf00c24a7953e'
before = parse_design(subprocess.check_output(['git', 'show', base + ':' + path]).decode())
after = parse_design(Path(path).read_text())
validate_graph(before)
validate_graph(after)
assert render(before) == render(after)
```

GraphはProcedureと冒頭の未確認事項を投影しないため、バイト一致だけでは業務意味保持を証明しない。上記の意味対応表と全文の読み取りで補った。実ブラウザE2E・新規GUI Preview・CI全体・購買業務の実装テストは今回の対象として実行していない。JSDOM成功を人間の画面操作確認や業務合意とは扱わない。

## 改稿後の読み取り専用レビュー

同一Agentが編集を止めた別のレビュー段階で、最終BD全文、元のBD、構造・品質・相関・漏れ基準と上記対応を照合した。独立Freshレビューではない。

- 全4 Activityと全4 Objectを再読し、Input→Procedure→Output、Result→後続When、Scope、名前と欄への割当を確認。既知の正常経路と既存6件の未決を保持している。
- 購入Inputにある対象選択をProcedureへ明示する根拠はある。一方、購入前に選択する等の順序を新しく決めていない。
- 承認/却下の開始位置・購入前後の境界・申請者情報・異常時結果は残る。未確認と明記しただけで、これらが解決したとは判定しない。
- 追加の原典根拠付き修正は検出しなかった。本文の未確認事項は業務判断に必要な内容であり、検証方法・作者向けレビュー指示・作業経緯はこの記録へ分離した。

次はReviewer Chatで差分と残る論点を確認し、本人が業務内容をレビューする。回答に従う改稿・再レビューと業務合意の後でのみPhase 2を検討する。
