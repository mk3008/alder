# チェック項目表示更新レポート

- Agent ID：`/root/candidate_v3_update`
- 指定されたソース改訂：`b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9`
- Alder Plugin：`0.4.8`（`plugin.json`）。同梱ガイダンスの原典改訂：`a3821d3d14dabd568a0d6da93b706dc251e24d0b`（`provenance.json`）。Check traceability / adoption / c3 の記録済みSHA-256は同ファイルを参照。
- 読んだ入力：`generation-candidate-v3/AGENTS.md`、`generation-candidate-v3/plugins/alder/skills/alder-draft-check-items/SKILL.md`、同Skillの`references/check-item-traceability.md`、`references/adoption.md`（任意のFunctional Interface節まで）、`references/candidate-c3.md`、`references/provenance.json`、`generation-candidate-v3/plugins/alder/plugin.json`、`generation-candidate-v3/business-design/purchase-request/README.md`全文、`generation-candidate-v3/docs/examples/purchase-check-review.ja.md`全文。
- 出力：`candidate-v3-update.md`。入力の業務設計・既存チェック項目は変更していない。

## 変更と意味保持

日本語の条件、必要条件または保証の式、操作、期待結果、具体的な入力／結果の対比例を各IDの同じ見出し内に配置した。従来の折りたたみ補足は常時読める「参照情報」へ移し、元の根拠、分類、確度、関連業務、テスト証拠の説明を保持した。四列の業務索引、業務名・見出し順、共有参照、ID、原典URLとその`c2852531ad62691c375e87818d8c3a49fd19803f`ピンを保持し、文書内リンクを新しい見出しのfragmentに合わせた。

| ID | 維持した独立の期待結果 | 状態 |
| --- | --- | --- |
| JA-EX-01 | 新しい購入要求が`submitted`の購入申請として記録される | 未レビュー |
| JA-EX-02 | 承認対象の申請が`approved`になる | 未レビュー |
| JA-EX-Q01 | 金額別の承認者・段階・完了条件は候補・未承認のまま | 要確認 |
| JA-EX-03 | 却下対象の申請が`rejected`になる | 未レビュー |
| JA-EX-04 | `rejected`の申請は購買担当者の購入対象にならない。却下と購入の両業務で同じIDを参照 | 未レビュー |
| JA-EX-05 | 購入した対象申請が`purchased`になる | 未レビュー |

期待結果の追加・削除、レビュー状態の変更、Business Design・Test対応の追加はない。申請日時など原典の別のResultを例の留意点で挙げた箇所は、新しいCheck保証にしていない。通常例の数値と申請R/Sは説明用であり、金額単位・値の許容範囲・金額別の承認境界を定めない。

## 質問と未決の扱い

- **JA-EX-Q01：** 金額別の承認経路を今回扱う必要が生じた場合、どの金額条件で誰の承認を要し、何をもって承認完了とするか。保留か、業務設計を人間が改訂・確認してから影響するCheckを更新するかを判断する。今回の表示更新では決めていない。
- **例示した未規定の結果：** 必須入力が欠ける場合の登録・却下・購入結果登録の可否とその後の状態、空欄・空白の扱い、対象が条件外の承認操作の結果は原典から確定できない。これらを失敗応答や状態不変の保証にせず、該当例を「未決・要確認」と表示した。実際に合否条件が必要なら、影響する業務意味をBusiness Designで確認する。
- 原典の在庫・発注・納品・支払、購入先選定、購入後管理、外部連携、監査履歴・通知は今回の対象外として維持した。これらを新しいCheckにしていない。

## 実施したチェックと限界

- 入力の業務設計全文と既存リストを照合し、四つの明示Activity名、各When/Who/Input/Procedure/Output/Result、業務相関、未決事項を確認した。各Checkの対象状態、必須入力、直接の結果が対応する原典記述と矛盾しないことを再読した。
- 旧・新の見出しID六件と人間レビュー状態六件の一致、原典URLの改訂ピンの一致、四列表の維持をスクリプトで確認した。新しいH2/H3の順、H4の存在、ローカルfragmentリンク16件が見出しに対応すること、HTMLの旧アンカー・折りたたみが残っていないことを確認した。補足、共有JA-EX-04、JA-EX-Q01の種別・選択肢・影響・テスト証拠は保存後に再読した。
- 適用する表示規則に対する明白なNGは、保存後の範囲では見つからなかった。日本語の本文、必要条件と保証の区別、操作と結果の分離、例の対象・入力・結果、未決の可視性を確認した。これは人間の内容承認やテスト検証ではない。
- 既存のGitHub原典URLが指す`c2852531...`のリモート実体とGitHub画面のレンダリングは、ネットワークを使わない指定に従い直接検証していない。提示されたローカル原典の見出しと行番号範囲は照合した。旧HTMLアンカー（`#ja-ex-01`等）への文書外の着信リンクの有無は調べていないため、外部互換性は未確認。実装、テスト、他の導出、他の出力、Phase 1資料は読まず、実行もしていない。
- 依頼された成果物は未合意Business Designからの表示更新であり、承認・実装引継ぎを主張しない。

## 完全なタスク指示（逐語）

> Use alder-draft-check-items at /workspace/scratch/0261bb5be107/generation-candidate-v3/plugins/alder/skills/alder-draft-check-items/SKILL.md to update Japanese Check Items /workspace/scratch/0261bb5be107/generation-candidate-v3/docs/examples/purchase-check-review.ja.md using the whole /workspace/scratch/0261bb5be107/generation-candidate-v3/business-design/purchase-request/README.md. Read project AGENTS.md and required bundled guidance inside generation-candidate-v3. Source revision b7de3bf013e9133d72384ec5ffb26f66d4fdbfe9, Plugin 0.4.8. Feedback: add Japanese conditions, logical expressions and concrete input/result examples where useful for discussing meaning. Retain existing scope, guarantees, IDs, supporting detail, shared references and human review states; do not settle undecided business meaning. BD is unconfirmed; no approval/handoff. Save only /workspace/scratch/0261bb5be107/candidate-v3-update.md and /workspace/scratch/0261bb5be107/candidate-v3-update-report.md, reporting read paths, revision, changed/retained guarantees, questions and checks actually performed. Do not read other derivations, implementation, tests, outputs, Phase 1 specimens, root issue, files outside generation-candidate-v3 except your own outputs, or use network/other agents. Do not edit the packet. Do not send external messages. Include your agent ID and this full task prompt verbatim in the report for reproducibility.
